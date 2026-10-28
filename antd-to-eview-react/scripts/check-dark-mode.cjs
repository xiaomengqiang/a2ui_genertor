#!/usr/bin/env node
/**
 * check-dark-mode.cjs — 黑白主题双轨切换检查（硬 FAIL）
 *
 * 对应暗色模式转换规则（umd-to-antd-vite 步骤 3 已完成转换，本 skill 步骤 2 替换组件时
 * 可能误删/改坏）。源项目是单轨驱动（只切 <html> 的 .dark），产物需要双轨驱动：
 *   ① html 轨：document.documentElement.classList.toggle("dark", isDark) —— 自定义 token 四层跟随
 *   ② body 轨：document.body.classList.toggle("aui3_1_dark", isDark) —— eview 组件库暗色覆盖层跟随
 *   ③ css import：入口 import '@nce/eview-react/styles/aui3_1_dark.css' —— body 轨的 class 有对应样式
 * 三者配套，少任一轨黑白主题切换即坏（组件库不跟随 / 自定义 token 不跟随 / class 切了没样式）。
 *
 * 前置判断：只有产物有暗色需求才检查（CSS 有 .dark 选择器 或 JS 有 isDark/toggleDark）。
 *   无暗色需求（项目本就无暗色）→ PASS 不报。
 *
 * 检查项（均为硬 FAIL）：
 *   1. TOKEN_DARK_TOGGLE_MISSING  缺 html 轨（toggle documentElement 的 .dark）
 *   2. AUI_DARK_TOGGLE_MISSING    缺 body 轨（toggle body 的 aui3_1_dark）
 *   3. AUI_DARK_CSS_MISSING       缺 import aui3_1_dark.css
 *
 * 用法：
 *   node check-dark-mode.cjs <目标工程根>          # 硬 FAIL，缺任一轨 exit 1
 *   node check-dark-mode.cjs <目标工程根> --strict # 同上（硬 FAIL 默认即 strict）
 *
 * 纯静态正则，不执行代码。退出码：0=通过/无暗色需求，1=缺轨（硬 FAIL），2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const JS_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const CSS_EXTS = new Set(['.css']);
const ALL_EXTS = new Set([...JS_EXTS, ...CSS_EXTS]);

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (ALL_EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

// 移除注释（保留换行符使行号一致）
function stripCommentsKeepLines(text, isJs) {
  if (isJs) {
    // JS：去 /* */ 和 // 行注释（保留换行）
    let t = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
    t = t.replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
    return t;
  }
  // CSS：去 /* */
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-dark-mode] 找不到 ${srcDir}，用法: node check-dark-mode.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const jsFiles = files.filter(f => JS_EXTS.has(path.extname(f)));
  const cssFiles = files.filter(f => CSS_EXTS.has(path.extname(f)));

  // ---- 前置判断：产物是否有暗色需求 ----
  // 信号 A：CSS 有 .dark 选择器（.dark 后跟选择器字符，排除 .dark-mode 等）
  let hasDarkCss = false;
  for (const f of cssFiles) {
    const text = stripCommentsKeepLines(fs.readFileSync(f, 'utf8'), false);
    if (/\.dark(?=[\s{,.#:+>~])/.test(text)) { hasDarkCss = true; break; }
  }
  // 信号 B：JS 有 isDark / toggleDark 暗色状态逻辑
  let hasDarkJs = false;
  for (const f of jsFiles) {
    const text = stripCommentsKeepLines(fs.readFileSync(f, 'utf8'), true);
    if (/\bisDark\b/.test(text) || /\btoggleDark\b/.test(text)) { hasDarkJs = true; break; }
  }

  const hasDarkNeed = hasDarkCss || hasDarkJs;

  // ---- 报告头 ----
  console.log('[check-dark-mode] 黑白主题双轨切换检查报告');
  console.log(`  扫描范围: ${srcDir}（JS/JSX/TS/TSX ${jsFiles.length} 个 + CSS ${cssFiles.length} 个）`);
  if (!hasDarkNeed) {
    console.log('  暗色需求: 未检测到（无 .dark CSS 选择器、无 isDark/toggleDark 逻辑）→ 项目无暗色，跳过双轨检查');
    console.log('\n结论: PASS — 项目无暗色需求，无需双轨切换。');
    process.exit(0);
  }
  console.log(`  暗色需求: 检测到（${hasDarkCss ? '.dark CSS 选择器' : ''}${hasDarkCss && hasDarkJs ? ' + ' : ''}${hasDarkJs ? 'isDark/toggleDark 逻辑' : ''}）→ 检查双轨完整性`);

  // ---- 检查三轨 ----
  // html 轨：某 JS 文件含 document.documentElement 且含 classList 操作 "dark"
  let htmlTrackFile = null;
  let bodyTrackFile = null;
  let cssImportFile = null;

  // classList.toggle("dark") / add("dark") / remove("dark") 作为 classList 参数（纯 "dark" 不含 .dark-mode）
  const classListDarkRe = /classList\s*\.\s*(?:toggle|add|remove)\s*\(\s*['"]dark['"]/;
  const classListAuiDarkRe = /classList\s*\.\s*(?:toggle|add|remove)\s*\(\s*['"]aui3_1_dark['"]/;
  const auiDarkCssImportRe = /['"][^'"]*aui3_1_dark\.css['"]/;

  for (const f of jsFiles) {
    const text = stripCommentsKeepLines(fs.readFileSync(f, 'utf8'), true);
    const rel = path.relative(root, f).replace(/\\/g, '/');
    if (!htmlTrackFile && /document\.documentElement/.test(text) && classListDarkRe.test(text)) {
      htmlTrackFile = rel;
    }
    if (!bodyTrackFile && /document\.body/.test(text) && classListAuiDarkRe.test(text)) {
      bodyTrackFile = rel;
    }
    if (!cssImportFile && auiDarkCssImportRe.test(text)) {
      cssImportFile = rel;
    }
  }

  const missing = [];
  if (!htmlTrackFile) missing.push({ code: 'TOKEN_DARK_TOGGLE_MISSING', detail: '缺 html 轨：未找到 toggle document.documentElement 的 .dark class（自定义 token 四层不跟随暗色）。应补 document.documentElement.classList.toggle("dark", isDark)' });
  if (!bodyTrackFile) missing.push({ code: 'AUI_DARK_TOGGLE_MISSING', detail: '缺 body 轨：未找到 toggle document.body 的 aui3_1_dark class（eview 组件库暗色覆盖层不跟随）。应补 document.body.classList.toggle("aui3_1_dark", isDark)' });
  if (!cssImportFile) missing.push({ code: 'AUI_DARK_CSS_MISSING', detail: '缺 CSS import：未找到 import aui3_1_dark.css（body 轨切了 class 但无对应样式）。应在入口（如 main.jsx）补 import "@nce/eview-react/styles/aui3_1_dark.css"' });

  // ---- 报告 ----
  console.log('');
  console.log(`  ① html 轨 (toggle html.dark):     ${htmlTrackFile ? '✓ ' + htmlTrackFile : '✗ 缺失'}`);
  console.log(`  ② body 轨 (toggle body.aui3_1_dark): ${bodyTrackFile ? '✓ ' + bodyTrackFile : '✗ 缺失'}`);
  console.log(`  ③ CSS import (aui3_1_dark.css):    ${cssImportFile ? '✓ ' + cssImportFile : '✗ 缺失'}`);
  console.log('');

  if (missing.length === 0) {
    console.log('结论: PASS — 双轨切换完整（html.dark + body.aui3_1_dark + aui3_1_dark.css import 均在）。');
    process.exit(0);
  }

  console.log(`发现 ${missing.length} 处缺失（硬 FAIL）：\n`);
  for (const m of missing) {
    console.log(`  [${m.code}] ${m.detail}`);
    console.log('');
  }
  console.log('结论: FAIL — 黑白主题双轨切换不完整，暗色切换会部分失效。');
  console.log('  详见 SKILL.md 暗色模式转换 + 换肤双轨驱动说明。');
  process.exit(1);
}

main();
