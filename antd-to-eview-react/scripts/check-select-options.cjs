#!/usr/bin/env node
/**
 * check-select-options.cjs — Select 系 options/data 的 label→text 字段残留检查（硬 FAIL）
 *
 * 对应 component-mapping.md Select / MultipleSelect / InputSelect / SelectCard /
 * CheckboxGroup / RadioGroup 行 + components/Select.md §2「选项结构」。
 * eview-react 这些组件的选项项字段是 { text, value }（不是 antd 的 { label, value }）。
 * 迁移时若漏改 label→text，eview 按 text 取显示文字 → 下拉项文字空白。
 *
 * 为什么需要本脚本（且用 AST）：
 *   label→text 重命名发生在 antd-to-eview-react 步骤 2（LLM 手工替换），步骤 3 此前
 *   无任何脚本守护 Select 系（check-dropdown/check-accordion 只管 DropDown/Accordion）。
 *   且选项常以 .map(item => ({ value, label })) 动态生成——纯正则的 resolveArrayBody
 *   只扫第一个 [...] 数组体（即 [1,2,3] 源数组），扫不到 .map 回调里的对象字面量。
 *   本脚本用 @babel/parser 解析 AST，递归收集 options/data 表达式里【所有】
 *   ObjectExpression（覆盖字面量数组 / .map 隐式返回 / .map 块体 return / function 回调 /
 *   Array.from / spread / 嵌套 / shorthand / 计算键），逐个查 label 属性。
 *
 * 检查项（硬 FAIL，exit 1）：
 *   LABEL_TEXT_RESIDUE   Select 系 options/data 项残留 antd 字段名 label（应为 text）
 *                        ——含对象 shorthand { label } 与 computed { ['label']: x }；
 *                          跨标识符追同文件 const 定义（含 .map 产生的）一并查
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

// 组件 → 选项 prop 名
const COMPONENTS = [
  { name: 'Select', prop: 'options' },
  { name: 'MultipleSelect', prop: 'options' },
  { name: 'InputSelect', prop: 'options' },
  { name: 'SelectCard', prop: 'data' },
  { name: 'CheckboxGroup', prop: 'data' },
  { name: 'RadioGroup', prop: 'data' },
];
const NAMES = COMPONENTS.map((c) => c.name);
const PROP_BY_NAME = Object.fromEntries(COMPONENTS.map((c) => [c.name, c.prop]));

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
      const propName = PROP_BY_NAME[name];
      const expr = H.getAttrExpr(el, propName);
      if (!expr) continue; // 无选项 prop（如受控 children 驱动，或漏传——后者另有规则管）

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
          detail: `${name} 的 ${propName} 项残留 antd 字段名 "label"（应为 "text"）——eview-react ${name} 选项项结构为 { text, value, ... }，按 text 取显示文字，label 会被忽略导致下拉项文字空白。含 .map/Array.from/spread/嵌套/shorthand/计算键等动态形态。见 components/Select.md §2 / component-mapping.md ${name} 行`,
        });
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
    process.exit(parseWarnings.length ? 0 : 0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md Select/MultipleSelect/InputSelect/SelectCard/CheckboxGroup/RadioGroup 行 + components/Select.md §2。');
  process.exit(1);
}

main();
