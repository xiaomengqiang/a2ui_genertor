#!/usr/bin/env node
/**
 * check-crumbs.cjs — Breadcrumb→Crumbs 迁移正确性检查（硬 FAIL）
 *
 * 对应 component-mapping.md Breadcrumb 行 + components/Crumbs.md §2/§4/§5。
 * antd Breadcrumb→eview-ui Crumbs 是「prop 重命名 + 字段重命名 + 拼写反转」的高错迁移，
 * 文档已强约束，本脚本做机器兜底——拦弱模型最常漏的三类残留：
 *   1. items=/item= 残留（应为 data=）—— antd items prop 没改成 data
 *   2. data 项里 href:/path: 残留（应为 url:）—— 字段没转，title 共享字段名掩护了 href 漏改
 *   3. separator= 残留（应为 seprator=）—— eview-ui 官方 API 即拼错的 seprator（将错就错），正确英文 separator 残留即未转
 *
 * 字段残留扫描（href:/path:→url:）采用 AST（@babel/parser）：
 *   纯正则的 extractArrayProp 只扫第一个 [...] 数组体，对 .map(item=>({href,url}))、
 *   Array.from、spread、function 回调 return、shorthand、计算键等动态形态全漏。
 *   AST 从 data/items/item 表达式递归收集所有 ObjectExpression，逐个查属性键，
 *   覆盖上述全部 JS 书写习惯（与 check-select-options / check-dropdown / check-accordion 共用
 *   scripts/lib/ast-helpers.cjs）。tag 级检查（items=/item=/separator=）仍走正则。
 *
 * 全硬 FAIL（Crumbs 的转换正确性无「可能有意为之」的灰区，残留即未转）。
 *
 * 用法：
 *   node check-crumbs.cjs <目标工程根>
 *
 * 退出码：0=通过，1=硬 FAIL，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

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

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-crumbs] 找不到 ${srcDir}，用法: node check-crumbs.cjs <目标工程根>`);
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-crumbs] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  // FIELD_RESIDUE 去重键：同一 file:line:field 只报一次（data 常量被多个 <Crumbs> 引用时避免重复）
  const fieldSeen = new Set();
  const parseWarnings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!/<Crumbs\b/.test(raw)) continue;
    const text = stripComments(raw);
    const rel = path.relative(root, file);

    // 解析 AST（字段残留扫描用）；解析失败仅告警跳过 AST 部分，tag 级正则检查照跑
    const parsed = H.parse(parser, text);
    if (parsed.error) parseWarnings.push(`${rel}: ${parsed.error.message}`);
    const ast = parsed.ast;

    // ---- tag 级正则检查（items=/item=/separator=）----
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
          detail: 'separator= 残留——eview-ui 官方 API 拼写是 seprator（将错就错），应改为 seprator=。见 Crumbs.md §2/§4' });
      }
    }

    // ---- AST 字段残留扫描（3. FIELD_RESIDUE：data 项 href:/path:→url:）----
    // 替代原 extractArrayProp 正则：覆盖 .map 回调 / Array.from / spread / function 回调 /
    // 嵌套 / shorthand / 计算键等动态形态，含标识符追同文件 const 定义。
    // 扫 data= / items= / item= 三个 prop（items/item 残留时仍能扫到里面的字段，第一轮即抓）
    if (ast) {
      const crumbEls = H.findJsxElements(ast, ['Crumbs']);
      for (const { el } of crumbEls) {
        const objs = new Set();
        for (const prop of ['data', 'items', 'item']) {
          const e = H.getAttrExpr(el, prop);
          if (e) for (const o of H.collectOptionsObjects(ast, e)) objs.add(o);
        }
        for (const obj of objs) {
          for (const field of ['href', 'path']) {
            const hit = H.findProperty(obj, field);
            if (!hit) continue;
            const dk = `${rel}:${hit.line}:${field}`;
            if (fieldSeen.has(dk)) continue;
            fieldSeen.add(dk);
            fails.push({ file: rel, line: hit.line, code: 'FIELD_RESIDUE',
              detail: `data 项残留 antd 字段名 "${field}:"（应为 url:）——antd Breadcrumb item 的 ${field} 改为 Crumbs item 的 url；title 两边同名不用改。含 .map/Array.from/spread/嵌套/shorthand/计算键等动态形态。见 Crumbs.md 字段映射表` });
          }
        }
      }
    }
  }

  // ---- 报告 ----
  const crumbsFiles = files.filter((f) => /<Crumbs\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-crumbs] Breadcrumb→Crumbs 迁移正确性检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <Crumbs> 的 ${crumbsFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件字段扫描被跳过，请人工复核】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

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
