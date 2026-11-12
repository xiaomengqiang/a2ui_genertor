#!/usr/bin/env node
/**
 * check-dark-mode.cjs — eview-ui 黑白主题双轨切换检查（硬 FAIL）
 *
 * 对应 SKILL.md「eview-ui 硬约束」10。暗色机制（实测）是双轨（缺任一轨切换不完整）：
 *   ① html 轨：document.documentElement.classList.toggle("dark", isDark) —— 自定义 token 四层跟随
 *      （scaffold 的 ThemeProvider 已内置；步骤 3 改为消费 useApp().isDark）
 *   ② ConfigProvider theme 轨：theme={isDark ? 'evening' : "lightday"} + version="aui3-1"
 *      —— 组件库内部自行切换暗色（实测），**不需要**手写 body data-theme / eviewui_aui3_1_* 类切换、
 *      不需要 listenTheme；theme 必须动态派生（静态字面量由 check-provider.cjs 拦截，此处查存在性）
 *
 * 同时检查 eview-react 旧骨架残留（本 skill scaffold 预置 eview-ui，残留即混入了旧骨架）：
 *   - body 轨 aui3_1_dark 残留（eview-react 专属旧轨，本 skill scaffold 不含——残留即混入了旧骨架）
 *   - @nce/eview-react CSS import 残留
 *
 * 前置判断：只有产物有暗色需求才检查（CSS 有 .dark 选择器 或 JS 有 isDark/toggleDark）。
 *   无暗色需求（项目本就无暗色）→ PASS 不报。
 *
 * 检查项（均为硬 FAIL）：
 *   1. TOKEN_DARK_TOGGLE_MISSING   缺 html 轨（toggle documentElement 的 .dark）
 *   2. THEME_TRACK_MISSING         缺 theme 轨（src/ 无任何 <ConfigProvider> 挂动态 theme={…}）
 *   3. AUI_DARK_TOGGLE_RESIDUE     body 轨 aui3_1_dark 残留（应删——eview-react 旧骨架）
 *   4. AUI_CSS_IMPORT_RESIDUE      import aui3_1_dark.css / aui3_1.css 残留（应删）
 *
 * 用法：
 *   node check-dark-mode.cjs <目标工程根>
 *
 * 纯静态正则，不执行代码。退出码：0=通过/无暗色需求，1=FAIL，2=用法错误。
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

function stripCommentsKeepLines(text, isJs) {
  if (isJs) {
    let t = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
    t = t.replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
    return t;
  }
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

// 从 `<ConfigProvider` 开始提取完整开标签窗口（跳过字符串与 {} 表达式里的 >）
function findTagEnd(text, start) {
  let i = start + 1;
  let depth = 0;
  let inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (depth === 0 && ch === '>') return i;
    }
    i++;
  }
  return -1;
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
  let hasDarkCss = false;
  for (const f of cssFiles) {
    const text = stripCommentsKeepLines(fs.readFileSync(f, 'utf8'), false);
    if (/\.dark(?=[\s{,.#:+>~])/.test(text)) { hasDarkCss = true; break; }
  }
  let hasDarkJs = false;
  for (const f of jsFiles) {
    const text = stripCommentsKeepLines(fs.readFileSync(f, 'utf8'), true);
    if (/\bisDark\b/.test(text) || /\btoggleDark\b/.test(text)) { hasDarkJs = true; break; }
  }

  const hasDarkNeed = hasDarkCss || hasDarkJs;

  console.log('[check-dark-mode] eview-ui 黑白主题双轨切换检查报告');
  console.log(`  扫描范围: ${srcDir}（JS/JSX/TS/TSX ${jsFiles.length} 个 + CSS ${cssFiles.length} 个）`);
  if (!hasDarkNeed) {
    console.log('  暗色需求: 未检测到（无 .dark CSS 选择器、无 isDark/toggleDark 逻辑）→ 项目无暗色，跳过双轨检查');
    console.log('\n结论: PASS — 项目无暗色需求，无需双轨切换。');
    process.exit(0);
  }
  console.log(`  暗色需求: 检测到（${hasDarkCss ? '.dark CSS 选择器' : ''}${hasDarkCss && hasDarkJs ? ' + ' : ''}${hasDarkJs ? 'isDark/toggleDark 逻辑' : ''}）→ 检查双轨完整性`);

  // ---- 检查双轨 + 旧骨架残留 ----
  const fails = [];

  // ① html 轨：documentElement 切 .dark
  const classListDarkRe = /document\.documentElement[^;]*classList\s*\.\s*(?:toggle|add|remove)\s*\(\s*['"]dark['"]/;
  // ② theme 轨：<ConfigProvider> 上挂动态 theme={…}（字面量 theme="evening" 由 check-provider 拦静态，
  //    此处只要求存在动态派生的 theme 表达式）
  const providerRe = /<ConfigProvider\b/g;

  // 旧骨架残留
  const classListAuiDarkRe = /classList\s*\.\s*(?:toggle|add|remove)\s*\(\s*['"]aui3_1_dark['"]/;
  const auiCssImportRe = /['"][^'"]*aui3_1(?:_dark)?\.css['"]/;

  let htmlTrackFile = null;
  let themeTrackFile = null;

  for (const f of jsFiles) {
    const text = stripCommentsKeepLines(fs.readFileSync(f, 'utf8'), true);
    const rel = path.relative(root, f).replace(/\\/g, '/');

    if (!htmlTrackFile && classListDarkRe.test(text)) htmlTrackFile = rel;

    if (!themeTrackFile) {
      let m;
      providerRe.lastIndex = 0;
      while ((m = providerRe.exec(text)) !== null) {
        const tagEnd = findTagEnd(text, m.index);
        const tagWindow = tagEnd > 0 ? text.slice(m.index, tagEnd) : text.slice(m.index, m.index + 600);
        if (/theme\s*=\s*\{/.test(tagWindow)) { themeTrackFile = rel; break; }
      }
    }

    if (classListAuiDarkRe.test(text)) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (classListAuiDarkRe.test(lines[i])) {
          fails.push({
            file: rel, line: i + 1, code: 'AUI_DARK_TOGGLE_RESIDUE',
            detail: 'body 轨 aui3_1_dark 残留——eview-react 旧轨。删除该行；本路线暗色双轨 = html .dark + ConfigProvider theme（组件库内部切换，不手写 body 轨）',
          });
        }
      }
    }
    if (auiCssImportRe.test(text)) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (auiCssImportRe.test(lines[i])) {
          fails.push({
            file: rel, line: i + 1, code: 'AUI_CSS_IMPORT_RESIDUE',
            detail: '残留 @nce/eview-react 的 CSS import（aui3_1*.css）——混入 eview-react 旧骨架，应删除',
          });
        }
      }
    }
  }

  if (htmlTrackFile) {
    console.log(`  ① html 轨: ✓ ${htmlTrackFile}`);
  } else {
    fails.push({
      file: '(src/)', line: 0, code: 'TOKEN_DARK_TOGGLE_MISSING',
      detail: '缺 html 轨：未找到 document.documentElement 的 .dark classList 切换——自定义 token 四层暗色会失效（scaffold 的 ThemeProvider 已内置，可能被误删）。应为 document.documentElement.classList.toggle("dark", isDark)',
    });
  }

  if (themeTrackFile) {
    console.log(`  ② theme 轨: ✓ ${themeTrackFile}（ConfigProvider theme 动态派生——组件库内部切换暗色，version="aui3-1"）`);
  } else {
    fails.push({
      file: '(src/)', line: 0, code: 'THEME_TRACK_MISSING',
      detail: '缺 theme 轨：未找到 <ConfigProvider> 挂动态 theme={…}（如 theme={isDark ? \'evening\' : \'lightday\'}）——eview-ui 组件暗色靠它驱动（实测），缺失则组件恒亮。位置：scaffold 的 src/theme/useTheme.jsx（ThemeProvider 内）',
    });
  }

  // ---- 报告 ----
  if (fails.length === 0) {
    console.log('\n结论: PASS — 黑白主题双轨齐全（html .dark + ConfigProvider theme 动态派生），无 eview-react 旧轨残留。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) {
    const loc = v.line ? `${v.file}:${v.line}` : v.file;
    console.log(`  - ${loc}  [${v.code}] ${v.detail}`);
  }
  console.log('\n  修复指引见 SKILL.md 黑白主题双轨硬约束 + migration-workflow.md 步骤 6。');
  process.exit(1);
}

main();
