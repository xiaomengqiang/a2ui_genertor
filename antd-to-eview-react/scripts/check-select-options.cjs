#!/usr/bin/env node
/**
 * check-select-options.cjs — Select 系 options/data prop 名 + label→text 字段残留检查（硬 FAIL）
 *
 * 对应 component-mapping.md Select / MultipleSelect / InputSelect / SelectCard /
 * CheckboxGroup / RadioGroup 行 + components/Select.md §2「选项结构」。
 * eview-react 这些组件的选项项字段是 { text, value }（不是 antd 的 { label, value }）。
 * 迁移时若漏改 label→text，eview 按 text 取显示文字 → 下拉项文字空白。
 *
 * 选项 prop 名按组件分两组，不能串：
 *   Select / MultipleSelect / InputSelect       → options
 *   SelectCard / CheckboxGroup / RadioGroup     → data
 * 两组项结构相同（{text,value}），但 prop 名不同。LLM 易把"eview 用 data"套到 Select，
 * 或把 Select 的 options 套到 SelectCard——本脚本双向都守，与 check-dropdown 的
 * OPTIONS_PROP_RESIDUE（DropDown 用 data，options= 残留）对称。
 *
 * 为什么需要本脚本（且用 AST）：
 *   label→text 与 prop 名重命名都发生在 antd-to-eview-react 步骤 2（LLM 手工替换），步骤 3
 *   此前无任何脚本守护 Select 系（check-dropdown/check-accordion 只管 DropDown/Accordion）。
 *   且选项常以 .map(item => ({ value, label })) 动态生成——纯正则的 resolveArrayBody
 *   只扫第一个 [...] 数组体（即 [1,2,3] 源数组），扫不到 .map 回调里的对象字面量。
 *   本脚本用 @babel/parser 解析 AST，递归收集 options/data 表达式里【所有】
 *   ObjectExpression（覆盖字面量数组 / .map 隐式返回 / .map 块体 return / function 回调 /
 *   Array.from / spread / 嵌套 / shorthand / 计算键），逐个查 label 属性。
 *
 * 检查项（硬 FAIL，exit 1）：
 *   PROP_RESIDUE         Select 系选项 prop 名串了组件——Select/MultipleSelect/InputSelect
 *                        残留 data=（应为 options=），或 SelectCard/CheckboxGroup/RadioGroup
 *                        残留 options=（应为 data=）。此前本脚本只查"正确 prop 里的 label 字段"，
 *                        找不到 options 就 continue 跳过，<Select data=> 因此静默放过——此条补该缺口
 *   LABEL_TEXT_RESIDUE   Select 系 options/data 项残留 antd 字段名 label（应为 text）
 *                        ——含对象 shorthand { label } 与 computed { ['label']: x }；
 *                          跨标识符追同文件 const 定义（含 .map 产生的）一并查；
 *                          同时扫正确 prop 与残留 prop（prop 名也错时一次性报全）
 *
 * 用法：
 *   node check-select-options.cjs <目标工程根>
 *
 * 退出码：0=通过（无 Select 系或 prop 名/字段均已转），1=硬 FAIL，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 组件 → 正确选项 prop 名 + 易残留（错误）prop 名
//   Select/MultipleSelect/InputSelect 用 options（项 {text,value}）
//   SelectCard/CheckboxGroup/RadioGroup 用 data（项 {text,value}）
// 两者项结构相同但 prop 名不同，LLM 易把"eview 用 data"套到 Select，或把 Select 的 options
// 套到 SelectCard——双向都守，与 check-dropdown 的 OPTIONS_PROP_RESIDUE（DropDown 用 data，
// options= 残留）对称。
const COMPONENTS = [
  { name: 'Select', prop: 'options', residue: 'data' },
  { name: 'MultipleSelect', prop: 'options', residue: 'data' },
  { name: 'InputSelect', prop: 'options', residue: 'data' },
  { name: 'SelectCard', prop: 'data', residue: 'options' },
  { name: 'CheckboxGroup', prop: 'data', residue: 'options' },
  { name: 'RadioGroup', prop: 'data', residue: 'options' },
];
const NAMES = COMPONENTS.map((c) => c.name);
const SPEC_BY_NAME = Object.fromEntries(COMPONENTS.map((c) => [c.name, c]));

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

// 取 JSXOpeningElement 上指定 prop 名的属性节点（JSXAttribute），用于定位 prop 名所在行。
// 用 AST 精确匹配 prop 名（data-source 不会被误判为 data），比 tag 级正则更稳。
function findAttrNode(el, propName) {
  for (const a of (el.attributes || [])) {
    if (a.type !== 'JSXAttribute') continue;
    if (a.name && a.name.type === 'JSXIdentifier' && a.name.name === propName) return a;
  }
  return null;
}

// 取属性节点所在行（优先 prop 名 loc，回退属性 loc）。
function attrLine(a) {
  if (!a) return null;
  if (a.name && a.name.loc && a.name.loc.start) return a.name.loc.start.line;
  if (a.loc && a.loc.start) return a.loc.start.line;
  return null;
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
  const seen = new Set(); // 去重 file:line:label（字段残留）
  const propSeen = new Set(); // 去重 file:line:residue（prop 名残留）
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
      const spec = SPEC_BY_NAME[name];

      // ---- PROP_RESIDUE：选项 prop 名串了组件 ----
      // Select/MultipleSelect/InputSelect 应为 options=，残留 data= 即未转
      // （LLM 误套"eview 用 data"模式；此前本脚本找不到 options 就 continue，<Select data=> 静默放过）；
      // SelectCard/CheckboxGroup/RadioGroup 应为 data=，残留 options= 即未转（误当 Select）。
      const resAttr = findAttrNode(el, spec.residue);
      if (resAttr) {
        const rLine = attrLine(resAttr);
        const dk = `${rel}:${rLine}:${spec.residue}`;
        if (!propSeen.has(dk)) {
          propSeen.add(dk);
          const otherGroup = spec.residue === 'data'
            ? 'SelectCard/CheckboxGroup/RadioGroup/Crumbs/DropDown/Accordion 等'
            : 'Select/MultipleSelect/InputSelect 等';
          fails.push({
            file: rel, line: rLine, code: 'PROP_RESIDUE',
            detail: `${name} 残留 antd prop "${spec.residue}="（应为 ${spec.prop}=）——eview-react ${name} 的选项 prop 是 ${spec.prop}（项 {text,value}），${spec.residue} 是 ${otherGroup} 组件的 prop，LLM 易误套"eview 用 data/options"模式串了组件。项结构也要同步改 {label,value}→{text,value}。见 components/Select.md §2 / component-mapping.md ${name} 行`,
          });
        }
      }

      // ---- LABEL_TEXT_RESIDUE：选项项 label→text 字段残留 ----
      // 同时扫正确 prop 与残留 prop：prop 名也错时（<Select data={[{label}]}>）一次性把 label 也报全，
      // 不因 prop 名错而漏报字段（与 check-dropdown collectItemObjects 扫 data/items/options 同思路）。
      const objs = new Set();
      for (const p of [spec.prop, spec.residue]) {
        const e = H.getAttrExpr(el, p);
        if (e) for (const o of H.collectOptionsObjects(ast, e)) objs.add(o);
      }
      for (const obj of objs) {
        const hit = H.findProperty(obj, 'label');
        if (!hit) continue;
        const line = hit.line;
        const dk = `${rel}:${line}:label`;
        if (seen.has(dk)) continue;
        seen.add(dk);
        fails.push({
          file: rel, line, code: 'LABEL_TEXT_RESIDUE',
          detail: `${name} 的 ${spec.prop} 项残留 antd 字段名 "label"（应为 "text"）——eview-react ${name} 选项项结构为 { text, value, ... }，按 text 取显示文字，label 会被忽略导致下拉项文字空白。含 .map/Array.from/spread/嵌套/shorthand/计算键等动态形态。见 components/Select.md §2 / component-mapping.md ${name} 行`,
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
  console.log('[check-select-options] Select 系 options/data prop 名 + label→text 残留检查报告');
  console.log(`  扫描范围: ${srcDir}（${scannedFiles} 个文件，含 Select 系的 ${hitFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【解析告警 — 跳过 ${parseWarnings.length} 个文件，请人工复核】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — 无 Select 系组件，或 prop 名与 options/data 项均已 label→text。');
    process.exit(parseWarnings.length ? 0 : 0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md Select/MultipleSelect/InputSelect/SelectCard/CheckboxGroup/RadioGroup 行 + components/Select.md §2。');
  process.exit(1);
}

main();
