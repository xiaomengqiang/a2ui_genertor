#!/usr/bin/env node
/**
 * check-steps-defaults.cjs — Steps labelPlacement 默认值反向坑检查（advisory）
 *
 * 对应 components/Steps.md 规格第 5 行 + API 表：
 *   antd 默认形态（文字在图标右侧）对应 eview-react `labelPlacement="horizontal"`，
 *   但 eview-react 默认是 `vertical`（文字在图标下方）。
 *   迁移时务必显式设为 `horizontal`，否则视觉与 antd 不一致。
 *
 * 这是「eview 默认值与 antd 相反」的典型坑——同 Table 默认值反向坑系列。
 * 脚本无法访问源 antd 项目，故全 advisory：列出每个 <Steps> 缺 labelPlacement，
 * 强制迁移方对照源 antd 确认源是否用默认形态（默认 = horizontal，需补）。
 *
 * 检查项：
 *   1. LABEL_PLACEMENT_MISSING  <Steps> 缺 labelPlacement → advisory
 *      （eview 默认 vertical 文字在图标下方，antd 默认 horizontal 文字在图标右侧）
 *   2. LABEL_PLACEMENT_VERTICAL <Steps> labelPlacement="vertical" → advisory
 *      （若源 antd 确实用 vertical 才保留，否则应改 horizontal）
 *
 * 用法：
 *   node check-steps-defaults.cjs <目标工程根>          # advisory，列出待核项，退出码 0
 *   node check-steps-defaults.cjs <目标工程根> --strict # 有待核项 exit 1
 *
 * 纯静态正则，不执行代码。退出码：0=无待核项/通过，1=有待核项（--strict），2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
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
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

// 从 <Steps 开始，找到当前标签结束（/> 或 >），跳过字符串和 {} 表达式
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
  return code.slice(start, start + 600);
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.indexOf('--strict') >= 0;
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-steps-defaults] 找不到 ${srcDir}，用法: node check-steps-defaults.cjs <目标工程根> [--strict]`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const items = []; // { file, line, code, detail }

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (!/<Steps\b/.test(text)) continue;
    const rel = path.relative(root, file);

    const re = /<Steps\b/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const frag = tagWindow(text, start);
      const line = lineOfOffset(text, start);

      // 检查 labelPlacement
      const lpMatch = frag.match(/labelPlacement\s*=\s*["']([^"']+)["']/);
      const lpDynMatch = frag.match(/labelPlacement\s*=\s*\{([^}]+)\}/);

      if (lpMatch) {
        // 显式设了字面量值
        if (lpMatch[1] === 'vertical') {
          items.push({
            file: rel, line, code: 'LABEL_PLACEMENT_VERTICAL',
            detail: `labelPlacement="vertical"（eview 默认即 vertical，文字在图标下方）——核对源 antd 是否确实用竖排文字，否则应改 horizontal（antd 默认形态文字在图标右侧）`,
          });
        }
        // horizontal → 正确，不报
      } else if (lpDynMatch) {
        // 动态值，无法静态确认
        items.push({
          file: rel, line, code: 'LABEL_PLACEMENT_DYNAMIC',
          detail: `labelPlacement 是动态值 "${lpDynMatch[1].trim()}"——请确认运行时值为 "horizontal"（antd 默认形态），除非源 antd 确实用竖排`,
        });
      } else {
        // 缺 labelPlacement
        items.push({
          file: rel, line, code: 'LABEL_PLACEMENT_MISSING',
          detail: `缺 labelPlacement → eview 默认 vertical（文字在图标下方）；antd 默认形态是文字在图标右侧 = horizontal。核对源 antd Steps：源用默认形态（无 labelPlacement 或 labelPlacement="horizontal"）→ 补 labelPlacement="horizontal"；源显式 labelPlacement="vertical" → 保留 vertical`,
        });
      }
    }
  }

  // ---- 报告 ----
  const stepsFiles = files.filter((f) => /<Steps\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-steps-defaults] Steps labelPlacement 默认值反向坑检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <Steps> 的 ${stepsFiles} 个）`);

  if (items.length === 0) {
    console.log('\n结论: PASS — 所有 <Steps> 均已显式设 labelPlacement="horizontal"，或工程无 Steps。');
    process.exit(0);
  }

  console.log(`\n发现 ${items.length} 个 <Steps> 待核对（eview 默认 vertical vs antd 默认 horizontal）：\n`);
  for (const it of items) {
    console.log(`- ${it.file}:${it.line}  <Steps>  [${it.code}]`);
    console.log(`  ${it.detail}`);
    console.log('');
  }

  console.log('结论: 待核对 — 上述 <Steps> 需对照源 antd 确认 labelPlacement（antd 默认 horizontal，eview 默认 vertical）。');
  console.log('  详见 components/Steps.md 规格第 5 行 + API 表。');
  if (strict) process.exit(1);
}

main();
