#!/usr/bin/env node
/**
 * check-crumbs.cjs — Breadcrumb→Crumbs 迁移正确性检查（硬 FAIL）
 *
 * 对应 component-mapping.md Breadcrumb 行 + components/Crumbs.md §2/§4/§5。
 * antd Breadcrumb→eview Crumbs 是「prop 重命名 + 字段重命名 + 拼写反转」的高错迁移，
 * 文档已强约束，本脚本做机器兜底——拦弱模型最常漏的三类残留：
 *   1. items=/item= 残留（应为 data=）—— antd items prop 没改成 data
 *   2. data 项里 href:/path: 残留（应为 url:）—— 字段没转，title 共享字段名掩护了 href 漏改
 *   3. separator= 残留（应为 seprator=）—— eview-react 官方 API 即拼错的 seprator（将错就错），正确英文 separator 残留即未转
 *
 * 全硬 FAIL（Crumbs 的转换正确性无「可能有意为之」的灰区，残留即未转）。
 *
 * 用法：
 *   node check-crumbs.cjs <目标工程根>
 *
 * 纯静态正则（扫描前移除注释），不执行代码。退出码：0=通过，1=硬 FAIL，2=用法错误。
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

// 移除注释（同 check-provider.cjs）
function stripComments(text) {
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  out = out.replace(/(^|[^:'"])\/\/[^\n]*/g, (m, p1) => p1);
  return out;
}

// 从 <Crumbs 开始提取开标签片段（跳过字符串和 {} 表达式），同 check-steps-defaults tagWindow
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

// 提取 Crumbs 某 prop 引用的数组体（内联 [ 或标识符追 const），返回 { body, bodyStartOffsetInText }
// propName 支持 data/items/item——items/item 残留时仍能扫到里面的字段，第一轮即抓 FIELD_RESIDUE
function extractArrayProp(text, frag, fragOffsetInText, propName) {
  const expr = extractPropExpr(text, frag, propName, fragOffsetInText);
  if (!expr) return null;
  const body = expr.body;
  const bodyStart = expr.bodyStartOffsetInText;
  const arrOffInBody = body.indexOf('[');
  if (arrOffInBody >= 0) {
    const arrIdxInText = bodyStart + arrOffInBody;
    const res = extractBalanced(text, '[', ']', arrIdxInText);
    if (res) return { body: res.body, bodyStartOffsetInText: res.bodyStart };
  }
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
    console.error(`[check-crumbs] 找不到 ${srcDir}，用法: node check-crumbs.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  // FIELD_RESIDUE 去重键：同一 file:line:field 只报一次（data 常量被多个 <Crumbs> 引用时避免重复）
  const fieldSeen = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!/<Crumbs\b/.test(raw)) continue;
    const text = stripComments(raw);
    const rel = path.relative(root, file);

    const re = /<Crumbs\b/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const frag = tagWindow(text, start);
      const line = lineOfOffset(text, start);

      // 1. ITEMS_RESIDUE: items=/item= 残留（应为 data=）
      //    \bitem\b 不匹配 itemStyle/itemTip（其后跟字母无 \b）；\bitems\b 不匹配 itemStyle
      if (/\bitems\b\s*=\s*\{/.test(frag)) {
        fails.push({ file: rel, line, code: 'ITEMS_RESIDUE',
          detail: 'items= 残留——antd Breadcrumb 的 items prop 应改为 Crumbs 的 data。见 Crumbs.md §2/§4' });
      } else if (/\bitem\b\s*=\s*\{/.test(frag)) {
        fails.push({ file: rel, line, code: 'ITEMS_RESIDUE',
          detail: 'item= 残留——应为 data=（antd items→eview data）。见 Crumbs.md §2/§4' });
      }

      // 2. SEPARATOR_RESIDUE: separator=（正确英文）残留（应为 seprator=，eview 官方拼写即拼错的 seprator）
      if (/\bseparator\b\s*=\s*/.test(frag)) {
        fails.push({ file: rel, line, code: 'SEPARATOR_RESIDUE',
          detail: 'separator= 残留——eview-react 官方 API 拼写是 seprator（将错就错），应改为 seprator=。见 Crumbs.md §2/§4' });
      }

      // 3. FIELD_RESIDUE: data 项里 href:/path: 残留（应为 url:）
      //    无论 prop 是 data= 还是残留的 items=/item=，都扫其数组体（第一轮即抓字段残留）
      const dataArr = extractArrayProp(text, frag, start, 'data')
        || extractArrayProp(text, frag, start, 'items')
        || extractArrayProp(text, frag, start, 'item');
      if (dataArr) {
        const residueRe = /\b(href|path)\b\s*:/g;
        let rm;
        while ((rm = residueRe.exec(dataArr.body)) !== null) {
          const off = dataArr.bodyStartOffsetInText + rm.index;
          const resLine = lineOfOffset(text, off);
          const dedupKey = `${rel}:${resLine}:${rm[1]}`;
          if (fieldSeen.has(dedupKey)) continue;
          fieldSeen.add(dedupKey);
          fails.push({ file: rel, line: resLine, code: 'FIELD_RESIDUE',
            detail: `data 项残留 antd 字段名 "${rm[1]}:"（应为 url:）——antd Breadcrumb item 的 ${rm[1]} 改为 Crumbs item 的 url；title 两边同名不用改。见 Crumbs.md 字段映射表` });
        }
      }
    }
  }

  // ---- 报告 ----
  const crumbsFiles = files.filter((f) => /<Crumbs\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-crumbs] Breadcrumb→Crumbs 迁移正确性检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <Crumbs> 的 ${crumbsFiles} 个）`);

  if (fails.length === 0) {
    console.log('\n结论: PASS — 无 Crumbs，或所有 <Crumbs> 通过检查。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md Breadcrumb 行 + components/Crumbs.md §2/§4/§5。');
  process.exit(1);
}

main();
