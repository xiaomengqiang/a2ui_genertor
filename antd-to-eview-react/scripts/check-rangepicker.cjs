#!/usr/bin/env node
/**
 * check-rangepicker.cjs — RangePicker 残留检查（硬 FAIL）
 *
 * 对应 component-mapping.md DatePicker.RangePicker / RangePicker 行 + components/DatePicker.md
 * §范围选择 + components/TimePicker.md §反面示例。
 * eview-react **没有 RangePicker 导出**——antd 的 `DatePicker.RangePicker` / `RangePicker` /
 * `TimePicker.RangePicker` 必须转换：
 *   - 日期范围：`<DatePicker range={...}>`（同一个组件加 range prop，见 DatePicker.md §范围选择）
 *   - 时间范围：两个 `<TimePicker>` + 业务校验（TimePicker 无 range，见 TimePicker.md）
 * 步骤 2 LLM 常漏改（migrationPlan 里 RangePicker 信号埋在 DatePicker keyDiffs 子段，bare `<RangePicker>`
 * 导入甚至 unmatched 无信号），且步骤 3 此前无脚本拦 JSX 残留（check-imports 只管 `from 'antd'`，
 * 不管已改 import 但 JSX 仍用 `.RangePicker` 成员或 `<RangePicker>` 标识符的情况）。本脚本做机器兜底。
 *
 * 检查项（硬 FAIL，exit 1）：
 *   RANGEPICKER_RESIDUE   产物中残留 RangePicker，三种形态全拦：
 *     a) <DatePicker.RangePicker> / <RangePicker> / <TimePicker.RangePicker> JSX 元素
 *        （含 `const { RangePicker } = DatePicker` + `<RangePicker>` 这种解构出标识符再当 JSX 用）
 *     b) `const { RangePicker } = X` 解构（含 rename `{ RangePicker: RP }`）——
 *        eview-react DatePicker（@/shared/DatePicker 包壳）无 RangePicker 成员，解构得 undefined
 *     c) `X.RangePicker` 成员访问（非 JSX，如 `const RP = DatePicker.RangePicker`）——
 *        eview-react 无 RangePicker 导出
 *
 * 用法：
 *   node check-rangepicker.cjs <目标工程根>
 *
 * AST（@babel/parser）精准定位 JSX 元素名，避免字符串/注释误报。与字段残留类 check 共用
 * lib/ast-helpers.cjs。退出码：0=通过，1=硬 FAIL，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 待检测的 JSX 元素名：
//   DatePicker.RangePicker / TimePicker.RangePicker（成员访问形态）
//   RangePicker（bare 标识符形态——import { RangePicker } 或 const { RangePicker } = DatePicker）
const TARGET_NAMES = new Set(['DatePicker.RangePicker', 'TimePicker.RangePicker', 'RangePicker']);

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

// 粗筛：文件无 RangePicker 字样则跳过（省解析）
function maybeHasRangePicker(raw) {
  return /RangePicker/.test(raw);
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-rangepicker] 找不到 ${srcDir}，用法: node check-rangepicker.cjs <目标工程根>`);
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-rangepicker] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  const seen = new Set(); // 去重 file:line
  const parseWarnings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!maybeHasRangePicker(raw)) continue;
    const rel = path.relative(root, file);

    const parsed = H.parse(parser, raw);
    if (parsed.error) {
      parseWarnings.push(`${rel}: ${parsed.error.message}`);
      continue;
    }
    const ast = parsed.ast;

    const elements = H.findJsxElements(ast, [...TARGET_NAMES]);
    for (const { el, name } of elements) {
      const line = (el.loc && el.loc.start) ? el.loc.start.line : 0;
      const dk = `${rel}:${line}:jsx:${name}`;
      if (seen.has(dk)) continue;
      seen.add(dk);

      let detail;
      if (name === 'TimePicker.RangePicker') {
        detail = '残留 <TimePicker.RangePicker>——eview-react TimePicker 无 RangePicker 导出、无 range 模式。时间范围用两个 <TimePicker> + 业务校验起止。见 TimePicker.md §反面示例';
      } else {
        // DatePicker.RangePicker 或 bare RangePicker
        detail = `残留 <${name}>——eview-react 无 RangePicker 导出。antd DatePicker.RangePicker / RangePicker 必须转为 <DatePicker range={[(Date|string)[]]} onChange 用 target 参数('from'/'to') 收集起止>（不要用 onOkClick，实测不返回 fromDateObj/toDateObj）。⚠️ 导入 @/shared/DatePicker（包壳）。见 DatePicker.md §范围选择 + component-mapping.md DatePicker.RangePicker 行`;
      }
      fails.push({ file: rel, line, code: 'RANGEPICKER_RESIDUE', detail });
    }

    // 解构 `const { RangePicker } = X`（含 rename）+ 成员访问 `X.RangePicker`（非 JSX）
    // ——拦半修残留：JSX 已改 <DatePicker range> 但留下死解构 / 死成员访问
    H.walk(ast, (n) => {
      if (n.type === 'ObjectPattern') {
        for (const p of n.properties) {
          if (p.type !== 'ObjectProperty' && p.type !== 'ObjectMethod') continue;
          const keyName = H.getPropertyName(p);
          if (keyName !== 'RangePicker') continue;
          const line = (p.key && p.key.loc && p.key.loc.start.line)
            || (p.loc && p.loc.start.line) || 0;
          const dk = `${rel}:${line}:destructure`;
          if (seen.has(dk)) continue;
          seen.add(dk);
          fails.push({ file: rel, line, code: 'RANGEPICKER_RESIDUE',
            detail: '残留 `const { RangePicker } = ...` 解构——eview-react DatePicker（@/shared/DatePicker 包壳）无 RangePicker 成员，解构得 undefined。删除该解构；范围选择改用 <DatePicker range={...}>。见 DatePicker.md §范围选择' });
        }
      } else if (n.type === 'MemberExpression' && n.property && n.property.type === 'Identifier' && n.property.name === 'RangePicker') {
        // 非 JSX 的成员访问（JSX 的 <X.RangePicker> 是 JSXMemberExpression，已被上面 JSX 扫描覆盖，不会重复）
        const line = (n.property.loc && n.property.loc.start.line)
          || (n.loc && n.loc.start.line) || 0;
        const dk = `${rel}:${line}:member`;
        if (seen.has(dk)) return;
        seen.add(dk);
        fails.push({ file: rel, line, code: 'RANGEPICKER_RESIDUE',
          detail: '残留 `*.RangePicker` 成员访问——eview-react 无 RangePicker 导出。改为 <DatePicker range={...}>（删除 DatePicker.RangePicker 取值）。见 DatePicker.md §范围选择' });
      }
    });
  }

  // ---- 报告 ----
  const hitFiles = files.filter((f) => maybeHasRangePicker(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-rangepicker] RangePicker JSX 残留检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 RangePicker 字样的 ${hitFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件被跳过，请人工复核 RangePicker 残留】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — 无 RangePicker JSX 残留。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md DatePicker.RangePicker / RangePicker 行 + components/DatePicker.md §范围选择 / components/TimePicker.md。');
  process.exit(1);
}

main();
