#!/usr/bin/env node
/**
 * check-accordion.cjs — Menu→Accordion 迁移正确性检查（硬 FAIL + advisory）
 *
 * 对应 component-mapping.md Menu 行 + components/Accordion.md §4/§5/§8/§9/§10。
 * antd Menu→eview Accordion 是「带语义反转 + 字段重命名 + 默认值反向坑」的高错迁移，
 * 文档已强约束，本脚本做机器兜底，拦弱模型最常漏的三类硬错误 + 两类待核项。
 *
 * 检查项：
 *   硬 FAIL（exit 1）：
 *     1. SELECTED_VALUE_ARRAY   selectedValue 传数组（应为单 string，非 antd selectedKeys 数组）
 *     2. DATA_FIELD_RESIDUE     data 子项残留 antd 字段名 key:/label:（应为 value:/title:，含嵌套 children）
 *     3. EXPAND_INVERTED        expanded 传入值与状态变量语义相反（collapsed 语义多加了 ! / expanded 语义漏了 !）
 *     4. ON_EXPAND_NOT_NEGATED  collapsed 语义下 onExpand setV(flag) 未取反（应 setV(!flag)）
 *        ON_EXPAND_OVER_NEGATED expanded 语义下 onExpand setV(!flag) 多取反（应 setV(flag)）
 *   advisory（exit 0，需逐条回应写入 accordionReviews）：
 *     5. HIDE_PROPS_MISSING     <Accordion> 缺 hideIcons 或 hideTitleBar（迁移默认必加，见 §10）
 *     6. EXPAND_GENERIC_NAMING  expanded/onExpand 用泛化命名（非 collapse/open/expand/show/visible），静态无法确认，需核对配对一致性
 *
 * 用法：
 *   node check-accordion.cjs <目标工程根>          # 硬 FAIL exit 1，advisory exit 0
 *
 * 纯静态正则（扫描前移除注释），不执行代码。退出码：0=通过/仅 advisory，1=硬 FAIL，2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

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

function lineOfOffset(text, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

// 移除注释（同 check-provider.cjs）：/* */ 块注释（保留换行维持行号）+ // 行注释
function stripComments(text) {
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  out = out.replace(/(^|[^:'"])\/\/[^\n]*/g, (m, p1) => p1);
  return out;
}

// 从 <Accordion 开始提取开标签片段（跳过字符串和 {} 表达式），同 check-steps-defaults tagWindow
function tagWindow(code, start) {
  let i = start + 1;
  let inStr = null;
  let braceDepth = 0;
  while (i < code.length) {
    const ch = code[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
      i++; continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; i++; continue; }
    if (ch === '{') { braceDepth++; i++; continue; }
    if (ch === '}') { braceDepth--; i++; continue; }
    if (braceDepth === 0 && ch === '>') return code.slice(start, i + 1);
    i++;
  }
  return code.slice(start, start + 800);
}

// 从 startIdx（指向 openCh）平衡匹配到 closeCh，返回 { body, bodyStart }
function extractBalanced(text, openCh, closeCh, startIdx) {
  let depth = 0, i = startIdx, inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === openCh) depth++;
      else if (ch === closeCh) { depth--; if (depth === 0) return { body: text.slice(startIdx + 1, i), bodyStart: startIdx + 1 }; }
    }
    i++;
  }
  return null;
}

// 提取 prop={...} 的值内容（不含外层 {}）。返回 { body, bodyStartOffsetInText } 或 null
function extractPropExpr(text, frag, propName, fragOffsetInText) {
  const re = new RegExp(`\\b${propName}\\b\\s*=\\s*\\{`);
  const m = re.exec(frag);
  if (!m) return null;
  const braceIdxInFrag = m.index + m[0].length - 1; // 指向 {
  const braceIdxInText = fragOffsetInText + braceIdxInFrag;
  const res = extractBalanced(text, '{', '}', braceIdxInText);
  if (!res) return null;
  return { body: res.body, bodyStartOffsetInText: res.bodyStart };
}

// 提取 Accordion data 引用的数组体（内联 [ 或标识符追 const），返回 { body, bodyStartOffsetInText }
function extractDataArray(text, frag, fragOffsetInText) {
  const expr = extractPropExpr(text, frag, 'data', fragOffsetInText);
  if (!expr) return null;
  const body = expr.body;
  const bodyStart = expr.bodyStartOffsetInText;
  // 内联数组：取 body 里第一个 [
  const arrOffInBody = body.indexOf('[');
  if (arrOffInBody >= 0) {
    const arrIdxInText = bodyStart + arrOffInBody;
    const res = extractBalanced(text, '[', ']', arrIdxInText);
    if (res) return { body: res.body, bodyStartOffsetInText: res.bodyStart };
  }
  // 标识符引用：追同文件 const/let/var X = [
  const nameM = body.trim().match(/^([A-Za-z_$][\w$]*)/);
  if (nameM) {
    const re = new RegExp(`\\b(?:const|let|var)\\s+${nameM[1]}\\s*=\\s*\\[`);
    const defM = re.exec(text);
    if (defM) {
      const arrIdxInText = defM.index + defM[0].lastIndexOf('[');
      const res = extractBalanced(text, '[', ']', arrIdxInText);
      if (res) return { body: res.body, bodyStartOffsetInText: res.bodyStart };
    }
  }
  return null;
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-accordion] 找不到 ${srcDir}，用法: node check-accordion.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];      // 硬 FAIL
  const advisories = []; // advisory
  // DATA_FIELD_RESIDUE 去重键：同一 file:line:field 只报一次（data 常量被多个 <Accordion> 引用时避免重复）
  const residueSeen = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!/<Accordion\b/.test(raw)) continue;
    const text = stripComments(raw);
    const rel = path.relative(root, file);

    const re = /<Accordion\b/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const frag = tagWindow(text, start);
      const line = lineOfOffset(text, start);

      // 1. SELECTED_VALUE_ARRAY
      if (/selectedValue\s*=\s*\{\s*\[/.test(frag)) {
        fails.push({ file: rel, line, code: 'SELECTED_VALUE_ARRAY',
          detail: 'selectedValue 传了数组——Accordion 的 selectedValue 是单个 string，不是 antd 的 selectedKeys 数组。改为 selectedValue={key}（单值）' });
      }

      // 2. DATA_FIELD_RESIDUE（含嵌套 children，扫整个 data 数组体）
      const dataArr = extractDataArray(text, frag, start);
      if (dataArr) {
        const residueRe = /\b(key|label)\b\s*:/g;
        let rm;
        while ((rm = residueRe.exec(dataArr.body)) !== null) {
          const off = dataArr.bodyStartOffsetInText + rm.index;
          const resLine = lineOfOffset(text, off);
          const dedupKey = `${rel}:${resLine}:${rm[1]}`;
          if (residueSeen.has(dedupKey)) continue;
          residueSeen.add(dedupKey);
          fails.push({ file: rel, line: resLine, code: 'DATA_FIELD_RESIDUE',
            detail: `data 子项残留 antd 字段名 "${rm[1]}:"（应为 ${rm[1] === 'key' ? 'value' : 'title'}:）——AccordionItem 用 value/title，嵌套 children 里的子项也要逐层改。见 Accordion.md §5 字段映射表` });
        }
      }

      // 3/4/6. expanded / onExpand 配对
      const expandedExpr = extractPropExpr(text, frag, 'expanded', start);
      const onExpandExpr = extractPropExpr(text, frag, 'onExpand', start);
      if (expandedExpr && onExpandExpr) {
        const eBody = expandedExpr.body.trim();
        const oBody = onExpandExpr.body.trim();

        const eNeg = eBody.startsWith('!');
        const eVarM = eBody.match(/^!?\s*([A-Za-z_$][\w$]*)/);
        const eVar = eVarM ? eVarM[1] : null;

        // onExpand 箭头参数 + 首个 setX(...) 调用
        const paramM = oBody.match(/(?:\(\s*([\w$]+)\s*\)|\b([\w$]+)\b)\s*=>/);
        const param = paramM ? (paramM[1] || paramM[2]) : null;
        const setterM = oBody.match(/(set[\w$]+)\s*\(\s*([^)]+?)\s*\)/);
        const setterName = setterM ? setterM[1] : null;
        const setterArg = setterM ? setterM[2].trim() : null;

        // 命名语义判定：collapsed（true=已收起）/ expanded（true=已展开，如 isOpen/isExpanded/open）
        const collapsedNaming = (eVar && /collapse/i.test(eVar)) || (setterName && /collapse/i.test(setterName));
        const expandedNaming = !collapsedNaming && (
          (eVar && /open|expand|show|visible/i.test(eVar)) ||
          (setterName && /open|expand|show|visible/i.test(setterName))
        );

        if (collapsedNaming) {
          // 正确形态：expanded={v}（裸）+ onExpand setV(!flag)
          if (eNeg && eVar) {
            fails.push({ file: rel, line, code: 'EXPAND_INVERTED',
              detail: `expanded={${eBody}}——变量 ${eVar} 是 collapsed 语义（true=收起），应直接 expanded={${eVar}}。Accordion 的 expanded prop true=收起（语义反转），再加 ! 会双重反转。见 Accordion.md §4/§8` });
          }
          if (param && setterArg && setterArg === param) {
            fails.push({ file: rel, line, code: 'ON_EXPAND_NOT_NEGATED',
              detail: `onExpand 回调 ${setterName}(${setterArg}) 未取反——collapsed 语义下应 ${setterName}(!${param})。onExpand(flag) 的 flag=true 表示"变为展开"，存 collapsed 状态要取反。见 Accordion.md §4/§8` });
          }
        } else if (expandedNaming) {
          // 正确形态：expanded={!v}（取反）+ onExpand setV(flag)（裸）
          if (!eNeg && eVar) {
            fails.push({ file: rel, line, code: 'EXPAND_INVERTED',
              detail: `expanded={${eBody}}——变量 ${eVar} 是 expanded 语义（true=展开），应 expanded={!${eVar}}。Accordion 的 expanded prop true=收起（与变量语义相反），需取反传入。见 Accordion.md §4/§8` });
          }
          if (param && setterArg && setterArg === `!${param}`) {
            fails.push({ file: rel, line, code: 'ON_EXPAND_OVER_NEGATED',
              detail: `onExpand 回调 ${setterName}(${setterArg}) 多取反了一次——expanded 语义下应 ${setterName}(${param})（裸）。onExpand(flag) 的 flag=true 表示"变为展开"，存 expanded 状态直接传 flag。见 Accordion.md §4/§8` });
          }
        } else {
          // 泛化命名（val/state 等），静态无法确认配对一致性
          advisories.push({ file: rel, line, code: 'EXPAND_GENERIC_NAMING',
            detail: `expanded/onExpand 用泛化命名（expanded={${eBody}}），静态无法确认配对。核对两种正确形态之一：① collapsed 语义 expanded={v}+setV(!flag)；② expanded 语义 expanded={!v}+setV(flag)。禁止 expanded={!v}+setV(flag) 或 expanded={v}+setV(!flag)（双重反转）。见 Accordion.md §4` });
        }
      }

      // 5. HIDE_PROPS_MISSING
      const missing = [];
      if (!/\bhideIcons\b/.test(frag)) missing.push('hideIcons');
      if (!/\bhideTitleBar\b/.test(frag)) missing.push('hideTitleBar');
      if (missing.length) {
        advisories.push({ file: rel, line, code: 'HIDE_PROPS_MISSING',
          detail: `缺 ${missing.join(' / ')}——迁移 antd Menu 默认必加 hideIcons + hideTitleBar（两种形态都要，漏加样式与官网不一致）。若确有特殊需求不加，在 accordionReviews 注明理由。见 Accordion.md §10` });
      }
    }
  }

  // ---- 报告 ----
  const accFiles = files.filter((f) => /<Accordion\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-accordion] Menu→Accordion 迁移正确性检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <Accordion> 的 ${accFiles} 个）`);

  if (fails.length === 0 && advisories.length === 0) {
    console.log('\n结论: PASS — 无 Accordion，或所有 <Accordion> 通过检查。');
    process.exit(0);
  }

  if (fails.length > 0) {
    console.log(`\n【硬 FAIL】${fails.length} 处：`);
    for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }
  if (advisories.length > 0) {
    console.log(`\n【advisory — 需逐条回应写入 accordionReviews】${advisories.length} 处：`);
    for (const v of advisories) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }
  console.log('\n  修复指引见 component-mapping.md Menu 行 + components/Accordion.md §4/§5/§8/§10。');
  process.exit(fails.length > 0 ? 1 : 0);
}

main();
