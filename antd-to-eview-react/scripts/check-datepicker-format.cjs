#!/usr/bin/env node
/**
 * check-datepicker-format.cjs — DatePicker `format` 合法性检查（硬 FAIL + advisory）
 *
 * 对应 components/DatePicker.md §2 format 映射规则 + component-mapping.md
 * DatePicker / DatePicker.RangePicker / RangePicker 行。
 *
 * eview-react DatePicker 的 `format` **只接受按 type 固定的几种模式**（见 DatePicker.md §5 API 速查）：
 *   date：`yyyy-MM-dd`；datetime：`yyyy-MM-dd HH:mm:ss` / `yyyy-MM-dd HH:mm`；
 *   month：`yyyy-MM`；quarter：`yyyy-QQ`；year：`yyyy`；week：`yyyy-wo`。
 * 它**不支持 antd/dayjs 的任意 token 组合**（YYYY/MM/DD/M/D/HH/mm/ss 等）。
 *
 * 步骤 2 LLM 常见误改：把 antd 的 dayjs format 逐 token 转换（如 `M/D`→`M/d`、`YYYY-MM-DD`→`yyyy-mm-dd`），
 * 产物 format 值既不是 antd 原值也不是 eview 合法模式，组件渲染异常。正确做法是按 type 整体替换为
 * eview 固定模式（见 DatePicker.md §2 format 映射规则表）。本脚本做机器兜底——扫产物 `<DatePicker format=...>`
 * 的字面量 format 值，非 eview 固定模式即硬 FAIL。
 *
 * 检查项：
 *   FORMAT_INVALID       硬 FAIL（exit 1）—— `format` 是字符串字面量但值不在 eview 固定模式集合内
 *                         （如 `M/d` / `M/D` / `YYYY-MM-DD` / `yyyy-mm-dd` 等任何 token 残留 / 错大小写）。
 *   FORMAT_DYNAMIC       advisory（exit 0，需人工复核）—— `format` 是动态表达式（变量 / 模板串 / 成员访问），
 *                         静态无法判定，需人工确认其运行时值为 eview 固定模式。
 *   RANGE_TYPE_INVALID   硬 FAIL（exit 1）—— `<DatePicker range={...} type="month|quarter|year|week">`：
 *                         antd RangePicker 是单独组件，eview-react 用 `range` prop 开范围；**range 模式只支持
 *                         type=date / datetime**，其余 type 在 range 模式下不可用，组件异常。拦 LLM 把源普通
 *                         DatePicker 的 picker=month 等误带到 range 形态。
 *   RANGE_TYPE_DYNAMIC   advisory（exit 0，需人工复核）—— `<DatePicker range={...} type={动态}>`：type 是
 *                         动态表达式，静态无法判定是否为 date/datetime，需人工复核。
 *   ANTD_PROP_RESIDUE    advisory（exit 0，需人工复核）—— `<DatePicker>` 上残留 antd-only prop（`disabledDate`/
 *                         `ranges`/`allowClear`/`open`/`disabledTime`/`status`/`cellRender`/`separator`/`inputReadOnly`/
 *                         `placement` 等）：这些 prop 在 eview-react 无对等或需重命名，LLM 漏改即残留。onChange 换序与
 *                         value 类型（dayjs→Date）难静态判定，不在本检查内，须按 DatePicker.md §2 人工保证。
 *
 * 用法：
 *   node check-datepicker-format.cjs <目标工程根>
 *
 * AST（@babel/parser）精准定位 `<DatePicker>` 元素并取 `format` 属性值，避免字符串/注释误报。
 * 与字段残留类 check 共用 lib/ast-helpers.cjs。退出码：0=通过（可能有 advisory），1=硬 FAIL，2=用法错误/无解析器。
 * 跳过 src/shared/（包壳实现文件，非业务代码，同 check-imports.cjs 惯例）。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// eview-react DatePicker format 合法模式集合（见 DatePicker.md §5 API 速查 + §2 示例）
const VALID_FORMATS = new Set([
  'yyyy-MM-dd',
  'yyyy-MM-dd HH:mm:ss',
  'yyyy-MM-dd HH:mm',
  'yyyy-MM',
  'yyyy-QQ',
  'yyyy',
  'yyyy-wo',
]);

// range 模式只支持 type=date / datetime（见 DatePicker.md §2 RangePicker 映射）
const RANGE_ALLOWED_TYPES = new Set(['date', 'datetime']);

// antd-only prop：在 eview-react DatePicker 无对等或需重命名（见 DatePicker.md §2 antd prop 映射差异表）。
// 残留即 LLM 漏改，advisory 逐条回应。spread `{...props}` 跳过（静态无法判定）。
const ANTD_ONLY_PROPS = new Set([
  'disabledDate', 'ranges', 'allowClear', 'open', 'onOpenChange',
  'disabledTime', 'status', 'variant', 'cellRender', 'cellsRender', 'dateRender',
  'defaultPickerValue', 'pickerValue', 'separator', 'order',
  'onOk', 'suffixIcon', 'prefixIcon', 'inputReadOnly', 'placement',
  'onSelect', 'mode', 'getPopupContainer', 'popupClassName',
  'generateConfig', 'bordered', 'nextIcon', 'prevIcon', 'superNextIcon', 'superPrevIcon',
]);

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // 跳过 src/shared/（包壳实现，非业务代码）
      if (ent.name === 'shared' && path.basename(dir) === 'src') continue;
      walk(full, out);
    } else if (EXTS.has(path.extname(ent.name))) {
      out.push(full);
    }
  }
  return out;
}

// 粗筛：文件无 DatePicker 字样则跳过（省解析）。不要求 format 字样——antd-prop 残留检查
// 需覆盖只有 disabledDate/ranges 等而无 format 的文件。
function maybeHasDatePicker(raw) {
  return /DatePicker/.test(raw);
}

// 取字面量字符串值（StringLiteral 直接返回 value；其余返回 null 表示动态）
function literalStringValue(expr) {
  if (!expr) return null;
  if (expr.type === 'StringLiteral') return expr.value;
  return null;
}

// 判断 JSX 元素是否有某属性（不论值，含 boolean shorthand `range`）。spread `{...props}` 不计（静态无法判定）。
function hasAttr(el, propName) {
  const attrs = el.attributes || [];
  for (const a of attrs) {
    if (a.type !== 'JSXAttribute') continue;
    if (a.name && a.name.type === 'JSXIdentifier' && a.name.name === propName) return true;
  }
  return false;
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-datepicker-format] 找不到 ${srcDir}，用法: node check-datepicker-format.cjs <目标工程根>`);
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-datepicker-format] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  const advisories = [];
  const seen = new Set(); // 去重 file:line
  const parseWarnings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!maybeHasDatePicker(raw)) continue;
    const rel = path.relative(root, file);

    const parsed = H.parse(parser, raw);
    if (parsed.error) {
      parseWarnings.push(`${rel}: ${parsed.error.message}`);
      continue;
    }
    const ast = parsed.ast;

    const elements = H.findJsxElements(ast, ['DatePicker']);
    for (const { el } of elements) {
      const line = (el.loc && el.loc.start) ? el.loc.start.line : 0;

      // —— format 合法性 ——
      const fmtExpr = H.getAttrExpr(el, 'format');
      if (fmtExpr != null) {
        const val = literalStringValue(fmtExpr);
        const dk = `${rel}:${line}:format`;
        if (!seen.has(dk)) {
          seen.add(dk);
          if (val != null) {
            if (!VALID_FORMATS.has(val)) {
              fails.push({
                file: rel, line, code: 'FORMAT_INVALID',
                detail: `format="${val}" 非 eview 固定模式——eview DatePicker format 只接受 yyyy-MM-dd / yyyy-MM-dd HH:mm:ss / yyyy-MM-dd HH:mm / yyyy-MM / yyyy-QQ / yyyy / yyyy-wo（按 type 取）。常见误改：antd dayjs token 逐字符转换（如 M/D→M/d、YYYY-MM-DD→yyyy-mm-dd）。正确做法：按 type 整体替换为 eview 固定模式（date→yyyy-MM-dd、datetime→yyyy-MM-dd HH:mm:ss、month→yyyy-MM、quarter→yyyy-QQ、year→yyyy、week→yyyy-wo），不要逐 token 转换。见 DatePicker.md §2 format 映射规则 + §5 API 速查`,
              });
            }
          } else {
            // 动态表达式（变量 / 模板串 / 成员访问 / 三元等）—— 静态无法判定，advisory
            advisories.push({
              file: rel, line, code: 'FORMAT_DYNAMIC',
              detail: `format 为动态表达式，静态无法判定其值是否为 eview 固定模式（yyyy-MM-dd / yyyy-MM-dd HH:mm:ss / yyyy-MM-dd HH:mm / yyyy-MM / yyyy-QQ / yyyy / yyyy-wo）。人工复核运行时值。见 DatePicker.md §2 format 映射规则`,
            });
          }
        }
      }

      // —— range 模式 type 约束（antd RangePicker 是单独组件，eview 用 range prop；range 只支持 type=date/datetime）——
      if (hasAttr(el, 'range')) {
        const typeExpr = H.getAttrExpr(el, 'type');
        const dk = `${rel}:${line}:range-type`;
        if (!seen.has(dk)) {
          seen.add(dk);
          if (typeExpr != null) {
            const typeVal = literalStringValue(typeExpr);
            if (typeVal != null) {
              if (!RANGE_ALLOWED_TYPES.has(typeVal)) {
                fails.push({
                  file: rel, line, code: 'RANGE_TYPE_INVALID',
                  detail: `<DatePicker range={...} type="${typeVal}">——range 模式只支持 type="date"/"datetime"，month/quarter/year/week 在 range 模式下不可用，组件异常。antd RangePicker 是单独组件，eview-react 用 range prop 开范围；RangePicker 的 type 仅由源 showTime 决定（有→datetime，无→date），不涉及 picker。见 DatePicker.md §2 RangePicker 映射`,
                });
              }
            } else {
              // type 为动态表达式——静态无法判定是否 date/datetime
              advisories.push({
                file: rel, line, code: 'RANGE_TYPE_DYNAMIC',
                detail: `<DatePicker range={...} type={动态}>——type 为动态表达式，静态无法判定是否为 date/datetime（range 模式唯一支持的两种）。人工复核运行时值。见 DatePicker.md §2 RangePicker 映射`,
              });
            }
          }
          // typeExpr == null（无 type 属性）→ 默认 date，range 合法，不报
        }
      }

      // —— antd-only prop 残留（无对等 / 须重命名）—— advisory
      const elAttrs = el.attributes || [];
      for (const a of elAttrs) {
        if (a.type !== 'JSXAttribute') continue; // spread {...props} 跳过（静态无法判定）
        const pname = a.name && a.name.type === 'JSXIdentifier' ? a.name.name : null;
        if (!pname || !ANTD_ONLY_PROPS.has(pname)) continue;
        const pline = (a.loc && a.loc.start) ? a.loc.start.line : line;
        const dk = `${rel}:${pline}:antd-prop:${pname}`;
        if (seen.has(dk)) continue;
        seen.add(dk);
        advisories.push({
          file: rel, line: pline, code: 'ANTD_PROP_RESIDUE',
          detail: `<DatePicker ${pname}=...> 残留 antd-only prop——${pname} 在 eview-react DatePicker 无对等或需重命名（disabledDate→dateRange 仅连续区间；inputReadOnly→readOnly；placement→popupDirection 有损；其余丢弃）。见 DatePicker.md §2 antd prop 映射差异表逐条确认处理`,
        });
      }
    }
  }

  // ---- 报告 ----
  const hitFiles = files.filter((f) => maybeHasDatePicker(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-datepicker-format] DatePicker format + range type + antd prop 残留检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 DatePicker 字样的 ${hitFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件被跳过，请人工复核 format 值】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

  if (advisories.length) {
    console.log(`\n【advisory — ${advisories.length} 处需人工复核（FORMAT_DYNAMIC / RANGE_TYPE_DYNAMIC / ANTD_PROP_RESIDUE），逐条回应写入 datePickerFormatReviews】`);
    for (const v of advisories) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — DatePicker format 字面量值均为 eview 固定模式。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 components/DatePicker.md §2 format 映射规则 + component-mapping.md DatePicker 行。');
  process.exit(1);
}

main();
