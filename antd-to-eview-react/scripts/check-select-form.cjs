#!/usr/bin/env node
/**
 * check-select-form.cjs — Select 系形态错配检查（硬 FAIL）
 *
 * 对应 component-mapping.md Select / Select showSearch / Select mode="multiple" /
 * Select mode="tags" / AutoComplete 行 + components/Select.md §1 / InputSelect.md /
 * MultipleSelect.md。
 *
 * 背景：eview Select 不支持搜索（无 showSearch/searchable），可过滤用 InputSelect onlySelect、
 * 多选用 MultipleSelect。步骤 2 LLM 最易错：① 把 antd Select showSearch 误转成 eview Select
 * （残留 showSearch/placeholder，应转 InputSelect onlySelect+placeholder）；② 把 Select mode="multiple"
 * 误转成 Select（残留 mode，应转 MultipleSelect）；③ placeholder/defaultLabel 跨组件用错
 * （Select 用 defaultLabel，InputSelect/MultipleSelect 用 placeholder）。本脚本做形态错配机器兜底——
 * 检测 eview Select 系组件身上的"不该出现的 prop"。
 *
 * 检查项（硬 FAIL，exit 1）：
 *   FORM_MISMATCH   Select 系组件身上残留不属于该组件的 prop：
 *     - <Select> 上 showSearch / mode / onlySelect / searchable / placeholder
 *         （Select 无这些 prop；showSearch→应转 InputSelect，mode→应转 MultipleSelect，
 *          onlySelect 属 InputSelect，searchable 属 MultipleSelect，placeholder→应为 defaultLabel）
 *     - <InputSelect> 上 defaultLabel / mode / showSearch / searchable
 *         （InputSelect 用 placeholder 不是 defaultLabel；mode/showSearch 应删；searchable 属 MultipleSelect）
 *     - <MultipleSelect> 上 defaultLabel / mode / onlySelect / showSearch
 *         （MultipleSelect 用 placeholder；mode 应删；onlySelect 属 InputSelect；showSearch→应为 searchable）
 *
 *   注：只检 StringLiteral/标识符 prop 名（JSXAttribute.name）；spread `{...props}` 跳过（静态无法判定）。
 *       <Select> 无论导入源（@/shared/Select 或 antd 残留）都检——antd Select 残留的 showSearch/mode/
 *       placeholder 同样命中（与 check-imports 双重保险）。
 *
 * 用法：node check-select-form.cjs <目标工程根>
 * AST（@babel/parser）精准定位，与字段残留类 check 共用 lib/ast-helpers.cjs。
 * 退出码：0=通过，1=硬 FAIL，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 每个组件身上"不该出现"的 prop 名 → 错配说明
const FORM_RULES = {
  Select: {
    showSearch: 'Select 不支持 showSearch（无搜索）——可过滤单选转 InputSelect onlySelect=true（@/shared/InputSelect），见 component-mapping.md Select showSearch 行',
    mode: 'Select 不支持 mode——多选转 MultipleSelect（mode="multiple"/"tags"）、可过滤转 InputSelect（showSearch），见 component-mapping.md Select mode="multiple" 行',
    onlySelect: 'onlySelect 是 InputSelect 的 prop——Select 上出现说明形态错配（showSearch 形态应转 InputSelect onlySelect=true），见 Select showSearch 行',
    searchable: 'searchable 是 MultipleSelect 的 prop——Select 上出现说明形态错配（多选应转 MultipleSelect），见 Select mode="multiple" 行',
    placeholder: 'Select 用 defaultLabel 不是 placeholder——残留 placeholder 即漏转（应 placeholder→defaultLabel），见 component-mapping.md Select 行',
  },
  InputSelect: {
    defaultLabel: 'InputSelect 用 placeholder 不是 defaultLabel——defaultLabel 是 Select 的 prop，形态错配，见 component-mapping.md Select showSearch 行',
    mode: 'InputSelect 不支持 mode——多选应转 MultipleSelect，见 Select mode="multiple" 行',
    showSearch: 'InputSelect 内置输入过滤，无 showSearch prop——残留即漏删（antd showSearch 已由 InputSelect 输入过滤替代），见 InputSelect.md',
    searchable: 'searchable 是 MultipleSelect 的 prop——InputSelect 上出现说明形态错配，见 MultipleSelect.md',
  },
  MultipleSelect: {
    defaultLabel: 'MultipleSelect 用 placeholder 不是 defaultLabel——形态错配，见 component-mapping.md Select mode="multiple" 行',
    mode: 'MultipleSelect 不支持 mode——迁移时删 mode（多选语义已由 MultipleSelect 本身表达），见 Select mode="multiple" 行',
    onlySelect: 'onlySelect 是 InputSelect 的 prop——MultipleSelect 上出现说明形态错配，见 InputSelect.md',
    showSearch: 'MultipleSelect 的搜索 prop 是 searchable 不是 showSearch——残留 showSearch 即漏转（应 showSearch→searchable），见 Select mode="multiple" 行',
  },
};
const TARGET_NAMES = Object.keys(FORM_RULES);

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

// 粗筛：文件无 <Select / <InputSelect / <MultipleSelect 字样则跳过
function maybeHas(raw) {
  return /<(Select|InputSelect|MultipleSelect)\b/.test(raw);
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-select-form] 找不到 ${srcDir}，用法: node check-select-form.cjs <目标工程根>`);
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-select-form] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  const seen = new Set(); // 去重 file:line:component:prop
  const parseWarnings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!maybeHas(raw)) continue;
    const rel = path.relative(root, file);

    const parsed = H.parse(parser, raw);
    if (parsed.error) {
      parseWarnings.push(`${rel}: ${parsed.error.message}`);
      continue;
    }
    const ast = parsed.ast;

    const elements = H.findJsxElements(ast, TARGET_NAMES);
    for (const { el, name } of elements) {
      const rules = FORM_RULES[name];
      const attrs = el.attributes || [];
      for (const a of attrs) {
        if (a.type !== 'JSXAttribute') continue; // 跳过 spread {...props}
        if (!a.name || a.name.type !== 'JSXIdentifier') continue;
        const propName = a.name.name;
        if (!rules[propName]) continue;
        const line = (a.loc && a.loc.start) ? a.loc.start.line
          : (el.loc && el.loc.start) ? el.loc.start.line : 0;
        const dk = `${rel}:${line}:${name}:${propName}`;
        if (seen.has(dk)) continue;
        seen.add(dk);
        fails.push({ file: rel, line, code: 'FORM_MISMATCH',
          detail: `<${name}> 残留 prop "${propName}"——${rules[propName]}` });
      }
    }
  }

  // ---- 报告 ----
  const hitFiles = files.filter((f) => maybeHas(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-select-form] Select 系形态错配检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 Select 系的 ${hitFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件被跳过，请人工复核】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — 无 Select 系形态错配。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md Select / Select showSearch / Select mode="multiple" 行 + components/Select.md / InputSelect.md / MultipleSelect.md。');
  process.exit(1);
}

main();
