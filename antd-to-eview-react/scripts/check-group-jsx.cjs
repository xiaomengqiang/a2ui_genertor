#!/usr/bin/env node
/**
 * check-group-jsx.cjs — Checkbox.Group / Radio.Group 残留检查（硬 FAIL）
 *
 * 对应 component-mapping.md Checkbox.Group / Radio/Radio.Group 行。
 * eview-react 的 CheckboxGroup / RadioGroup 是独立组件：
 *   - CheckboxGroup：`import CheckboxGroup from '@nce/eview-react/CheckboxGroup'`
 *   - RadioGroup：`import RadioGroup from '@nce/eview-react/RadioGroup'`（默认导入，
 *     ⚠️ 禁止 `import { RadioGroup } from '@nce/eview-react/Radio'`——Radio 包不导出 RadioGroup）
 * antd 的 `<Checkbox.Group>` / `<Radio.Group>` 成员访问形态必须转换：
 *   - <Checkbox.Group> → <CheckboxGroup>
 *   - <Radio.Group> → <RadioGroup>
 *
 * 为什么需要本脚本：步骤 2 LLM 常漏转 .Group——extract-umd.cjs 此前只扫 `import { Checkbox }`，
 * .Group 成员访问用法丢失，migrationPlan 把 .Group 当普通 Checkbox/Radio，LLM 直接转
 * Checkbox/Radio 漏转 CheckboxGroup/RadioGroup。即便 extract-umd 已补扫 .Group、
 * build-migration-plan 已按完整 pattern 匹配，步骤 2 后续手改仍可能回归，本脚本做机器兜底。
 *
 * 检查项（硬 FAIL，exit 1）：
 *   GROUP_JSX_RESIDUE   产物中残留 Checkbox.Group / Radio.Group，两态全拦：
 *     a) <Checkbox.Group> / <Radio.Group> JSX 元素（JSXMemberExpression，findJsxElements 支持）
 *     b) `Checkbox.Group` / `Radio.Group` 成员访问（非 JSX，如 `const G = Checkbox.Group`）——
 *        object 名精确匹配 Checkbox/Radio，无误报
 *
 *   注：解构形态 `const { Group } = Checkbox` + `<Group>` 因 `Group` 名通用易误报，暂不检测；
 *       ict-coder 产物通常直接 `<Checkbox.Group>`，该形态罕见。如需覆盖后续扩展。
 *
 * 用法：
 *   node check-group-jsx.cjs <目标工程根>
 *
 * AST（@babel/parser）精准定位，与字段残留类 check 共用 lib/ast-helpers.cjs。
 * 退出码：0=通过，1=硬 FAIL，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 待检测的 JSX 元素名（JSXMemberExpression，jsxElementName 返回 'Checkbox.Group'）
const TARGET_NAMES = new Set(['Checkbox.Group', 'Radio.Group']);
// 成员访问宿主：Checkbox / Radio（精确匹配 object.name，避免误报）
const GROUP_HOSTS = new Set(['Checkbox', 'Radio']);

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

// 粗筛：文件无 Checkbox.Group / Radio.Group 字样则跳过（省解析）
// \b 词边界：<Checkbox.Group 中 Checkbox 前是 <（非词字符，\b 命中）；Checkbox.Group 成员访问前是空格/=（\b 命中）
function maybeHasGroup(raw) {
  return /\b(Checkbox|Radio)\.Group\b/.test(raw);
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-group-jsx] 找不到 ${srcDir}，用法: node check-group-jsx.cjs <目标工程根>`);
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-group-jsx] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  const seen = new Set(); // 去重 file:line
  const parseWarnings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!maybeHasGroup(raw)) continue;
    const rel = path.relative(root, file);

    const parsed = H.parse(parser, raw);
    if (parsed.error) {
      parseWarnings.push(`${rel}: ${parsed.error.message}`);
      continue;
    }
    const ast = parsed.ast;

    // a) JSX 元素：<Checkbox.Group> / <Radio.Group>
    const elements = H.findJsxElements(ast, [...TARGET_NAMES]);
    for (const { el, name } of elements) {
      const line = (el.loc && el.loc.start) ? el.loc.start.line : 0;
      const dk = `${rel}:${line}:jsx:${name}`;
      if (seen.has(dk)) continue;
      seen.add(dk);
      const target = name === 'Checkbox.Group' ? 'CheckboxGroup' : 'RadioGroup';
      const importNote = name === 'Radio.Group'
        ? '（⚠️ RadioGroup 必须默认导入 @nce/eview-react/RadioGroup，禁止 from @nce/eview-react/Radio）'
        : '（@nce/eview-react/CheckboxGroup）';
      fails.push({ file: rel, line, code: 'GROUP_JSX_RESIDUE',
        detail: `残留 <${name}>——eview-react 用独立组件 ${target}${importNote}。antd <${name}> → <${target}>（data=[{text,value}]、value 数组${target === 'CheckboxGroup' ? '；CheckboxGroup 有 selectAll/rows' : ''}）。见 component-mapping.md ${name} 行` });
    }

    // b) 成员访问 `Checkbox.Group` / `Radio.Group`（非 JSX）
    //    JSX 的 <X.Group> 是 JSXMemberExpression，已被上面 JSX 扫描覆盖，不会重复
    H.walk(ast, (n) => {
      if (n.type !== 'MemberExpression') return;
      if (!n.property || n.property.type !== 'Identifier' || n.property.name !== 'Group') return;
      if (!n.object || n.object.type !== 'Identifier' || !GROUP_HOSTS.has(n.object.name)) return;
      const host = n.object.name;
      const line = (n.property.loc && n.property.loc.start.line)
        || (n.loc && n.loc.start.line) || 0;
      const dk = `${rel}:${line}:member`;
      if (seen.has(dk)) return;
      seen.add(dk);
      const target = host === 'Checkbox' ? 'CheckboxGroup' : 'RadioGroup';
      fails.push({ file: rel, line, code: 'GROUP_JSX_RESIDUE',
        detail: `残留 \`${host}.Group\` 成员访问——eview-react 无此成员，改用独立组件 ${target}（${host === 'Radio' ? '默认导入 @nce/eview-react/RadioGroup' : '@nce/eview-react/CheckboxGroup'}）。见 component-mapping.md ${host}.Group 行` });
    });
  }

  // ---- 报告 ----
  const hitFiles = files.filter((f) => maybeHasGroup(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-group-jsx] Checkbox.Group / Radio.Group 残留检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 .Group 字样的 ${hitFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件被跳过，请人工复核 .Group 残留】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — 无 Checkbox.Group / Radio.Group 残留。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md Checkbox.Group / Radio/Radio.Group 行 + components/Checkbox.md。');
  process.exit(1);
}

main();
