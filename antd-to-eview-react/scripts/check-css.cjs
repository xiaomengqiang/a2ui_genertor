#!/usr/bin/env node
/**
 * check-css.cjs — CSS 不写死色值 + 类名不用 ev_ 前缀检查（advisory）
 *
 * 对应 SKILL.md 硬约束⑦：CSS 不写死色值（用源项目 CSS 变量/原始 token）；
 * 类名用业务前缀 app- 不用 ev_。
 *
 * 排除范围（这些层的色值/ev_ 类名是正确用法，不检查）：
 *   - src/styles/  token 定义层（base/light/theme/dark，:root 里 --brand-50:#xxx 是变量定义）
 *   - src/shared/   包壳层（Steps.css 等需用 ev_wizard_* 类名覆盖组件库样式）
 * 业务 CSS（src/views/、src/components/、src/app.css 等）才检查。
 *
 * 检查项：
 *   1. HARD_COLOR    业务 CSS 里写死色值（裸 hex/rgb/rgba/hsl/hsla，行内无 var()）→ advisory
 *      （行内有 var() 的色值视为 fallback 降级，不报；变量定义行 --xxx: 不报）
 *   2. COLOR_FALLBACK var() 内的 fallback 色值 → advisory（合理降级，但建议核对是否必要）
 *   3. EV_CLASSNAME  业务 CSS 使用 .ev_xxx 类名 → advisory（可能是自定义类违规，也可能是覆盖组件库，需核对）
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
// 排除目录：token 定义层 + 包壳层（这两层 ev_ 类名/色值是正确用法）
const SKIP_DIRS = new Set(['styles', 'shared']);

function walk(dir, out, rootSrc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    // 排除 src/styles/ 与 src/shared/（仅 src 直接子级生效）
    if (ent.isDirectory() && dir === rootSrc && SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out, rootSrc);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function lineOfOffset(text, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

// 移除 /* ... */ 注释（含跨行）
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '');
}

// 色值正则：hex (#fff / #ffffff / #ffffffff) 或 rgb/rgba/hsl/hsla(...)
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const FUNC_COLOR_RE = /\b(rgba?|hsla?)\s*\(/g;

// 变量定义行：以 -- 开头的声明（如 --brand-50: #E6F2FD;）
function isVarDecl(line) {
  return /^\s*--[A-Za-z0-9-]+\s*:/.test(line);
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

  const files = walk(srcDir, [], srcDir);
  const hardColors = [];   // 写死色值
  const fallbacks = [];    // var() 内 fallback
  const evClasses = [];    // ev_ 类名

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const text = stripComments(raw);
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      const lineNo = i + 1;
      if (!ln.trim()) continue;

      // 跳过变量定义行（--xxx: #value 是定义，不是写死使用）
      if (isVarDecl(ln)) continue;

      const hasVar = /\bvar\s*\(/.test(ln);

      // hex 色值
      let m;
      HEX_RE.lastIndex = 0;
      while ((m = HEX_RE.exec(ln)) !== null) {
        // 排除 url(#...) 等：hex 前面不是 url(
        const before = ln.slice(Math.max(0, m.index - 6), m.index);
        if (/url\s*\(\s*['"]?$/.test(before)) continue;
        if (hasVar) {
          fallbacks.push({ file: rel, line: lineNo, code: 'COLOR_FALLBACK', detail: `var() 内 fallback 色值 "${m[0]}"（合理降级，建议核对是否必要）`, snippet: ln.trim() });
        } else {
          hardColors.push({ file: rel, line: lineNo, code: 'HARD_COLOR', detail: `写死色值 "${m[0]}"（应改用 var(--token)）`, snippet: ln.trim() });
        }
      }

      // rgb/rgba/hsl/hsla 色值函数
      FUNC_COLOR_RE.lastIndex = 0;
      while ((m = FUNC_COLOR_RE.exec(ln)) !== null) {
        if (hasVar) {
          fallbacks.push({ file: rel, line: lineNo, code: 'COLOR_FALLBACK', detail: `var() 内 fallback 色值函数 "${m[1]}(...)" `, snippet: ln.trim() });
        } else {
          hardColors.push({ file: rel, line: lineNo, code: 'HARD_COLOR', detail: `写死色值函数 "${m[1]}(...)"（应改用 var(--token)）`, snippet: ln.trim() });
        }
      }

      // ev_ 类名（选择器里 .ev_xxx）
      const evRe = /\.ev_[A-Za-z0-9_-]+/g;
      while ((m = evRe.exec(ln)) !== null) {
        evClasses.push({ file: rel, line: lineNo, code: 'EV_CLASSNAME', detail: `使用组件库类名 "${m[0]}"（若是自定义类名违规——应用 app- 前缀；若是覆盖组件库样式则允许，需核对）`, snippet: ln.trim() });
      }
    }
  }

  // ---- 报告 ----
  console.log('[check-css] CSS 色值 + ev_ 类名检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个业务 CSS 文件，已排除 src/styles/ + src/shared/）`);

  const total = hardColors.length + fallbacks.length + evClasses.length;
  if (total === 0) {
    console.log('\n结论: PASS — 业务 CSS 未发现写死色值或 ev_ 类名。');
    process.exit(0);
  }

  console.log(`\n发现 ${total} 处待核项：\n`);

  if (hardColors.length > 0) {
    console.log(`【写死色值 — 应改用 var(--token)】${hardColors.length} 处：`);
    for (const v of hardColors) {
      const snip = v.snippet.length > 80 ? v.snippet.slice(0, 80) + '…' : v.snippet;
      console.log(`  - ${v.file}:${v.line}  ${v.detail}`);
      console.log(`      ${snip}`);
    }
    console.log('');
  }

  if (fallbacks.length > 0) {
    console.log(`【var() fallback 色值 — 合理降级，建议核对】${fallbacks.length} 处：`);
    for (const v of fallbacks) {
      const snip = v.snippet.length > 80 ? v.snippet.slice(0, 80) + '…' : v.snippet;
      console.log(`  - ${v.file}:${v.line}  ${v.detail}`);
      console.log(`      ${snip}`);
    }
    console.log('');
  }

  if (evClasses.length > 0) {
    console.log(`【ev_ 类名 — 需核对是自定义(违规)还是覆盖(允许)】${evClasses.length} 处：`);
    for (const v of evClasses) {
      const snip = v.snippet.length > 80 ? v.snippet.slice(0, 80) + '…' : v.snippet;
      console.log(`  - ${v.file}:${v.line}  ${v.detail}`);
      console.log(`      ${snip}`);
    }
    console.log('');
  }

  console.log('结论: 待核对 — 上述项目需逐条确认（写死色值应改 var()，自定义 ev_ 类名应改 app- 前缀）。');
  console.log('  详见 SKILL.md 硬约束⑦。');
  if (strict) process.exit(1);
}

main();
