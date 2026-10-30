#!/usr/bin/env node
/**
 * check-messagedialog-defaults.cjs — MessageDialog iconLocation 默认值反向坑检查（advisory）
 *
 * 对应 components/MessageDialog.md §5 API 表 + §2 三处示例：
 *   eview-react MessageDialog 的 iconLocation 默认 'content'（图标在内容区），
 *   但 demo 统一用 'title'（图标在标题区）——这也是 antd Modal.confirm 的形态
 *   （图标出现在标题旁）。迁移时务必显式设 iconLocation="title"，否则图标位置
 *   与 antd 习惯不一致。
 *
 * 这是「eview 默认值与 antd 形态相反」的典型坑——同 Table/Steps 默认值反向坑系列。
 * 脚本无法访问源 antd 项目，故全 advisory：列出每个 <MessageDialog> 缺 iconLocation
 * 或显式 content，强制迁移方确认应补 title。
 *
 * 检查项：
 *   1. ICON_LOCATION_MISSING  <MessageDialog> 缺 iconLocation → advisory
 *      （eview 默认 content 图标在内容区；antd Modal.confirm 图标在标题区 = title）
 *   2. ICON_LOCATION_CONTENT  <MessageDialog> iconLocation="content" → advisory
 *      （显式用了 eview 默认值；除非源 antd 确实要图标在内容区才保留，否则改 title）
 *   3. ICON_LOCATION_DYNAMIC  <MessageDialog> iconLocation 是动态值 → advisory
 *      （请确认运行时值为 "title"）
 *
 * 用法：
 *   node check-messagedialog-defaults.cjs <目标工程根>          # advisory，列出待核项，退出码 0
 *   node check-messagedialog-defaults.cjs <目标工程根> --strict # 有待核项 exit 1
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

// 从 <MessageDialog 开始，找到当前标签结束（/> 或 >），跳过字符串和 {} 表达式
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
    console.error(`[check-messagedialog-defaults] 找不到 ${srcDir}，用法: node check-messagedialog-defaults.cjs <目标工程根> [--strict]`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const items = []; // { file, line, code, detail }

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (!/<MessageDialog\b/.test(text)) continue;
    const rel = path.relative(root, file);

    const re = /<MessageDialog\b/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const frag = tagWindow(text, start);
      const line = lineOfOffset(text, start);

      // 检查 iconLocation
      const ilMatch = frag.match(/iconLocation\s*=\s*["']([^"']+)["']/);
      const ilDynMatch = frag.match(/iconLocation\s*=\s*\{([^}]+)\}/);

      if (ilMatch) {
        // 显式设了字面量值
        if (ilMatch[1] === 'content') {
          items.push({
            file: rel, line, code: 'ICON_LOCATION_CONTENT',
            detail: `iconLocation="content"（eview 默认即 content，图标在内容区）——antd Modal.confirm 图标在标题区，应改 title（除非源 antd 确实要图标在内容区才保留 content）`,
          });
        }
        // title → 正确，不报
      } else if (ilDynMatch) {
        // 动态值，无法静态确认
        items.push({
          file: rel, line, code: 'ICON_LOCATION_DYNAMIC',
          detail: `iconLocation 是动态值 "${ilDynMatch[1].trim()}"——请确认运行时值为 "title"（antd Modal.confirm 图标在标题区）`,
        });
      } else {
        // 缺 iconLocation
        items.push({
          file: rel, line, code: 'ICON_LOCATION_MISSING',
          detail: `缺 iconLocation → eview 默认 content（图标在内容区）；antd Modal.confirm 图标在标题区 = title。应补 iconLocation="title"（components/MessageDialog.md demo 统一用 title）`,
        });
      }
    }
  }

  // ---- 报告 ----
  const mdFiles = files.filter((f) => /<MessageDialog\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-messagedialog-defaults] MessageDialog iconLocation 默认值反向坑检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <MessageDialog> 的 ${mdFiles} 个）`);

  if (items.length === 0) {
    console.log('\n结论: PASS — 所有 <MessageDialog> 均已显式设 iconLocation="title"，或工程无 MessageDialog。');
    process.exit(0);
  }

  console.log(`\n发现 ${items.length} 个 <MessageDialog> 待核对（eview 默认 content vs antd 形态 title）：\n`);
  for (const it of items) {
    console.log(`- ${it.file}:${it.line}  <MessageDialog>  [${it.code}]`);
    console.log(`  ${it.detail}`);
    console.log('');
  }

  console.log('结论: 待核对 — 上述 <MessageDialog> 需补/改 iconLocation="title"（antd Modal.confirm 图标在标题区，eview 默认 content）。');
  console.log('  详见 components/MessageDialog.md §5 API 表（iconLocation 默认 content，demo 统一用 title）。');
  if (strict) process.exit(1);
}

main();
