#!/usr/bin/env node
/**
 * check-select-options.cjs — eview-ui Select 系 options/data 的 label→text 字段残留检查（硬 FAIL）
 *
 * 对应 component-mapping.md Select/MultipleSelect/InputSelect/SelectPro/SelectCard/
 * CheckboxGroup/RadioGroup/CategoryInput/CategorySearch/Popup/ButtonMenu 行。
 * eview-ui 这些组件的选项项字段是 { text, value }（不是 antd 的 { label, value }）。
 * 迁移时若漏改 label→text，组件按 text 取显示文字 → 下拉项文字空白（静默失败）。
 *
 * 监控的组件与选项 prop 清单（eview-ui 全家）：
 *   - options prop：Select / MultipleSelect / InputSelect / SelectPro / ButtonMenu
 *   - data prop：SelectCard / CheckboxGroup / RadioGroup / Popup
 *   - categoryOptions prop：CategoryInput / CategorySearch；popItems prop：CategorySearch
 *
 * 选项常以 .map(item => ({ value, label })) 动态生成——用 @babel/parser 解析 AST，
 * 递归收集表达式里所有 ObjectExpression（覆盖字面量数组 / .map 隐式返回 / .map 块体 return /
 * function 回调 / Array.from / spread / 嵌套 / shorthand / 计算键），逐个查 label 属性。
 *
 * 检查项（硬 FAIL，exit 1）：
 *   LABEL_TEXT_RESIDUE   Select 系 options/data/categoryOptions/popItems 项残留 antd 字段名
 *                        label（应为 text）——含对象 shorthand { label } 与 computed { ['label']: x }
 *
 * 用法：
 *   node check-select-options.cjs <目标工程根>
 *
 * 退出码：0=通过（无 Select 系或全部已 label→text），1=硬 FAIL，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 组件 → 选项 prop 名（eview-ui 多组件多 prop；Pro 优先——Select 监控 SelectPro，旧 Select 不使用）
const COMPONENTS = [
  { name: 'SelectPro', props: ['options'] },
  { name: 'MultipleSelect', props: ['options'] },
  { name: 'InputSelect', props: ['options'] },
  { name: 'ButtonMenu', props: ['options'] },
  { name: 'SelectCard', props: ['data'] },
  { name: 'CheckboxGroup', props: ['data'] },
  { name: 'RadioGroup', props: ['data'] },
  { name: 'Popup', props: ['data'] },
  { name: 'CategoryInput', props: ['categoryOptions'] },
  { name: 'CategorySearch', props: ['categoryOptions', 'popItems'] },
];
const NAMES = COMPONENTS.map((c) => c.name);
const PROPS_BY_NAME = Object.fromEntries(COMPONENTS.map((c) => [c.name, c.props]));

function walkFiles(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, out);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-select-options] 找不到 ${srcDir}，用法: node check-select-options.cjs <目标工程根>`);
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-select-options] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(2);
  }

  const files = walkFiles(srcDir, []);
  const fails = [];
  const seen = new Set(); // 去重 file:line:label
  const parseWarnings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    // 粗筛：文件无任何 Select 系标签则跳过（省解析）
    let hasAny = false;
    for (const n of NAMES) { if (new RegExp(`<${n}\\b`).test(raw)) { hasAny = true; break; } }
    if (!hasAny) continue;

    const rel = path.relative(root, file);
    const parsed = H.parse(parser, raw);
    if (parsed.error) {
      parseWarnings.push(`${rel}: ${parsed.error.message}`);
      continue;
    }
    const ast = parsed.ast;

    const elements = H.findJsxElements(ast, NAMES);
    for (const { el, name } of elements) {
      for (const propName of PROPS_BY_NAME[name]) {
        const expr = H.getAttrExpr(el, propName);
        if (!expr) continue; // 无该选项 prop

        const objs = H.collectOptionsObjects(ast, expr);
        for (const obj of objs) {
          const hit = H.findProperty(obj, 'label');
          if (!hit) continue;
          const line = hit.line;
          const dk = `${rel}:${line}:label`;
          if (seen.has(dk)) continue;
          seen.add(dk);
          fails.push({
            file: rel, line, code: 'LABEL_TEXT_RESIDUE',
            detail: `${name} 的 ${propName} 项残留 antd 字段名 "label"（应为 "text"）——eview-ui ${name} 选项项结构为 { text, value, ... }，按 text 取显示文字，label 会被忽略导致下拉项文字空白。含 .map/Array.from/spread/嵌套/shorthand/计算键等动态形态。见 component-mapping.md ${name} 行`,
          });
        }
      }
    }
  }

  // ---- 报告 ----
  const scannedFiles = files.length;
  const hitFiles = files.filter((f) => {
    const r = fs.readFileSync(f, 'utf8');
    return NAMES.some((n) => new RegExp(`<${n}\\b`).test(r));
  }).length;
  console.log('[check-select-options] Select 系 options/data label→text 残留检查报告');
  console.log(`  扫描范围: ${srcDir}（${scannedFiles} 个文件，含 Select 系的 ${hitFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【解析告警 — 跳过 ${parseWarnings.length} 个文件，请人工复核】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — 无 Select 系组件，或所有 options/data 项均已 label→text。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md Select/MultipleSelect/InputSelect/SelectCard/CheckboxGroup/RadioGroup/CategoryInput/CategorySearch/Popup/ButtonMenu 行 + components/SelectPro.md。');
  process.exit(1);
}

main();
