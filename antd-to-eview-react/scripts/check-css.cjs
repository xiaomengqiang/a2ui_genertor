#!/usr/bin/env node
/**
 * check-css.cjs — CSS 色值漂移（对照源快照）+ ev_ 类名检查（advisory）
 *
 * 对应 SKILL.md 硬约束⑦：原项目 CSS 有时写死色值是允许的（忠实保留即可），
 * 但迁移不能擅自改色值；类名用业务前缀 app- 不用 ev_。
 *
 * 色值检查：对照 .umd-conversion.json 的 sourceCssColors 快照（由 umd-to-antd-vite
 * extract-umd.cjs 扫源项目业务 CSS 写死色值生成）。按文件 + 出现顺序配对源/产物色值：
 *   - COLOR_DRIFT   同位置色值不同（迁移擅自改了色值，应保持与源一致）→ advisory
 *   - COLOR_ADDED   产物有色值、源同位置没有（迁移新增，需确认合理）→ advisory
 *   - COLOR_DROPPED 源有色值、产物同位置没有（迁移删了，需确认合理）→ advisory
 * 色值提取逻辑须与 extract-umd.cjs 的 extractColorsFromCssFile 保持一致
 * （hex 规范化小写；rgb/rgba/hsl/hsla 去空格规范化；跳过 var() 行的 fallback；
 *  跳过变量定义行 --xxx:；跳过 url(#...)）。
 *
 * 排除范围（产物专属层不检查）：
 *   - src/styles/  token 定义层（:root 里 --brand-50:#xxx 是变量定义）
 *   - src/shared/   包壳层（包壳组件 CSS 需用 ev_ 类名覆盖组件库样式）
 *
 * 检查项：
 *   1. COLOR_DRIFT/ADDED/DROPPED  色值漂移（对照源快照）→ advisory
 *   2. EV_CLASSNAME  业务 CSS 使用 .ev_xxx 类名 → advisory（可能是自定义类违规，也可能是覆盖组件库，需核对）
 *
 * 用法：
 *   node check-css.cjs <目标工程根>          # advisory，列出待核项，退出码 0
 *   node check-css.cjs <目标工程根> --strict # 有待核项 exit 1
 *
 * 纯静态正则，不执行代码。退出码：0=无待核项/通过，1=有待核项（--strict），2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.css']);
const SKIP_DIRS = new Set(['styles', 'shared']);

function walk(dir, out, rootSrc) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    if (ent.isDirectory() && dir === rootSrc && SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out, rootSrc);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function stripCommentsKeepLines(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function isVarDecl(line) {
  return /^\s*--[A-Za-z0-9-]+\s*:/.test(line);
}

// 色值提取（与 extract-umd.cjs extractColorsFromCssFile 一致）
function extractColorsFromCss(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const text = stripCommentsKeepLines(raw);
  const lines = text.split('\n');
  const colors = [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const lineNo = i + 1;
    if (!ln.trim()) continue;
    if (isVarDecl(ln)) continue;
    if (/\bvar\s*\(/.test(ln)) continue;
    let m;
    const hexRe = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
    while ((m = hexRe.exec(ln)) !== null) {
      const before = ln.slice(Math.max(0, m.index - 6), m.index);
      if (/url\s*\(\s*['"]?$/.test(before)) continue;
      colors.push({ line: lineNo, value: m[0].toLowerCase() });
    }
    const funcRe = /\b(rgba?|hsla?)\s*\(([^)]*)\)/g;
    while ((m = funcRe.exec(ln)) !== null) {
      const norm = (m[1] + '(' + m[2].replace(/\s+/g, '') + ')').toLowerCase();
      colors.push({ line: lineNo, value: norm });
    }
  }
  return colors;
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.indexOf('--strict') >= 0;
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-css] 找不到 ${srcDir}，用法: node check-css.cjs <目标工程根> [--strict]`);
    process.exit(2);
  }

  const handoffPath = path.join(root, '.umd-conversion.json');
  let sourceCssColors = {};
  let hasSnapshot = false;
  if (fs.existsSync(handoffPath)) {
    try {
      const j = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
      sourceCssColors = j.sourceCssColors || {};
      hasSnapshot = !!j.sourceCssColors;
    } catch (e) {}
  }

  const files = walk(srcDir, [], srcDir);
  const driftItems = [];
  const evClasses = [];
  const productColorsByFile = {};

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const normFile = rel.replace(/^src\//, '');
    const colors = extractColorsFromCss(file);
    productColorsByFile[normFile] = { colors, rel };

    const raw = fs.readFileSync(file, 'utf8');
    const text = stripCommentsKeepLines(raw);
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const evRe = /\.ev_[A-Za-z0-9_-]+/g;
      let m;
      while ((m = evRe.exec(lines[i])) !== null) {
        const snip = lines[i].trim().length > 80 ? lines[i].trim().slice(0, 80) + '…' : lines[i].trim();
        evClasses.push({ file: rel, line: i + 1, code: 'EV_CLASSNAME', detail: `使用组件库类名 "${m[0]}"（若是自定义类名违规——应用 app- 前缀；若是覆盖组件库样式则允许，需核对）`, snippet: snip });
      }
    }
  }

  if (hasSnapshot) {
    const allFiles = new Set([...Object.keys(sourceCssColors), ...Object.keys(productColorsByFile)]);
    for (const nf of allFiles) {
      const src = sourceCssColors[nf] || [];
      const prodEntry = productColorsByFile[nf];
      const prod = prodEntry ? prodEntry.colors : [];
      const prodRel = prodEntry ? prodEntry.rel : `src/${nf}`;
      const max = Math.max(src.length, prod.length);
      for (let i = 0; i < max; i++) {
        const s = src[i];
        const p = prod[i];
        if (s && p) {
          if (s.value !== p.value) {
            driftItems.push({ file: prodRel, line: p.line, code: 'COLOR_DRIFT', detail: `色值漂移：源 "${s.value}"（源行 ${s.line}）→ 产物 "${p.value}"（迁移擅自改了色值，应保持与源一致）` });
          }
        } else if (p && !s) {
          driftItems.push({ file: prodRel, line: p.line, code: 'COLOR_ADDED', detail: `新增色值 "${p.value}"（源同位置无此色值，需确认是否合理新增）` });
        } else if (s && !p) {
          driftItems.push({ file: prodRel, line: s.line, code: 'COLOR_DROPPED', detail: `色值丢失：源有 "${s.value}"（源行 ${s.line}）但产物无（迁移删了，需确认是否合理）` });
        }
      }
    }
  }

  console.log('[check-css] CSS 色值漂移（对照源）+ ev_ 类名检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个业务 CSS 文件，已排除 src/styles/ + src/shared/）`);
  if (hasSnapshot) {
    const srcCount = Object.values(sourceCssColors).reduce((s, a) => s + a.length, 0);
    console.log(`  源快照: ${srcCount} 处色值（跨 ${Object.keys(sourceCssColors).length} 个文件）`);
  } else {
    console.log(`  ⚠️ 未找到 sourceCssColors 快照（.umd-conversion.json 无此字段）——色值漂移检查跳过，仅检查 ev_ 类名。需重跑 extract-umd 或手动补该字段`);
  }

  const total = driftItems.length + evClasses.length;
  if (total === 0) {
    console.log('\n结论: PASS — 业务 CSS 色值与源一致，未发现 ev_ 类名。');
    process.exit(0);
  }

  console.log(`\n发现 ${total} 处待核项：\n`);

  if (driftItems.length > 0) {
    console.log(`【色值漂移 — 对照源快照】${driftItems.length} 处：`);
    for (const v of driftItems) {
      console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
    }
    console.log('');
  }

  if (evClasses.length > 0) {
    console.log(`【ev_ 类名 — 需核对是自定义(违规)还是覆盖(允许)】${evClasses.length} 处：`);
    for (const v of evClasses) {
      console.log(`  - ${v.file}:${v.line}  ${v.detail}`);
      console.log(`      ${v.snippet}`);
    }
    console.log('');
  }

  console.log('结论: 待核对 — 色值漂移项须在 cssReviews 逐条回应（擅自改值应改回源值；新增/删除需确认合理）；自定义 ev_ 类名应改 app- 前缀。');
  console.log('  详见 SKILL.md 硬约束⑦。');
  if (strict) process.exit(1);
}

main();
