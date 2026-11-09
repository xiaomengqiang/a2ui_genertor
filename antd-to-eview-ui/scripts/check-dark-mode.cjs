#!/usr/bin/env node
/**
 * check-dark-mode.cjs — eview-ui 暗色三轨切换检查（硬 FAIL）
 *
 * 对应 SKILL.md「eview-ui 硬约束」⑪。eview-ui 的暗色是三轨（缺任一轨切换不完整）：
 *   ① html 轨：document.documentElement.classList.toggle("dark", isDark) —— 自定义 token 四层跟随
 *      （上游 umd-to-antd-vite 已就位，本 skill 保留；误删则自定义样式暗色失效）
 *   ② body 属性轨：document.body.setAttribute("data-theme", isDark ? "dark" : "default")
 *      （白天 default / 黑夜 dark——eview-ui 主题标识）
 *   ③ body class 轨：classList 切换 eviewui_aui3_1_evening（暗）/ eviewui_aui3_1_default（亮）
 *      （**白天也必须挂 default 类**，不是仅移除 evening）
 *
 * 同时检查骨架换血残留（eview-react 旧轨遗迹）：
 *   - body 轨 aui3_1_dark 残留（eview-react 专属，aui3_1_dark.css 已删——残留即换血未完成）
 *   - @nce/eview-react CSS import 残留
 *
 * 前置判断：只有产物有暗色需求才检查（CSS 有 .dark 选择器 或 JS 有 isDark/toggleDark）。
 *   无暗色需求（项目本就无暗色）→ PASS 不报。
 *
 * 检查项（均为硬 FAIL）：
 *   1. TOKEN_DARK_TOGGLE_MISSING   缺 html 轨（toggle documentElement 的 .dark）
 *   2. BODY_DATATHEME_MISSING      缺 body 属性轨（data-theme 切换）
 *   3. BODY_THEMECLASS_MISSING     缺 body class 轨（eviewui_aui3_1_* 类切换）
 *   4. AUI_DARK_TOGGLE_RESIDUE     body 轨 aui3_1_dark 残留（应删——换血未完成）
 *   5. AUI_CSS_IMPORT_RESIDUE      import aui3_1_dark.css / aui3_1.css 残留（应删）
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

  console.log('[check-dark-mode] eview-ui 暗色三轨切换检查报告');
  console.log(`  扫描范围: ${srcDir}（JS/JSX/TS/TSX ${jsFiles.length} 个 + CSS ${cssFiles.length} 个）`);
  if (!hasDarkNeed) {
    console.log('  暗色需求: 未检测到（无 .dark CSS 选择器、无 isDark/toggleDark 逻辑）→ 项目无暗色，跳过三轨检查');
    console.log('\n结论: PASS — 项目无暗色需求，无需三轨切换。');
    process.exit(0);
  }
  console.log(`  暗色需求: 检测到（${hasDarkCss ? '.dark CSS 选择器' : ''}${hasDarkCss && hasDarkJs ? ' + ' : ''}${hasDarkJs ? 'isDark/toggleDark 逻辑' : ''}）→ 检查三轨完整性`);

  // ---- 检查三轨 + 换血残留 ----
  const fails = [];

  // ① html 轨：documentElement 切 .dark
  const classListDarkRe = /document\.documentElement[^;]*classList\s*\.\s*(?:toggle|add|remove)\s*\(\s*['"]dark['"]/;
  // ② body 属性轨：setAttribute('data-theme', ...) 或 body.dataset.theme =
  const bodyDatathemeRe = /document\.body\s*\.\s*(?:setAttribute\s*\(\s*['"]data-theme['"]|dataset\s*\.\s*theme\s*=)/;
  // ③ body class 轨：eviewui_aui3_1_evening / eviewui_aui3_1_default 类切换（或 className 整体赋值）
  const bodyThemeClassRe = /document\.body[^;]*classList\s*\.\s*(?:toggle|add|remove)\s*\(\s*['"]eviewui_aui3_1_(?:evening|default)['"]|document\.body\.className\s*=[^;]*eviewui_aui3_1_/;

  // 换血残留
  const classListAuiDarkRe = /classList\s*\.\s*(?:toggle|add|remove)\s*\(\s*['"]aui3_1_dark['"]/;
  const auiCssImportRe = /['"][^'"]*aui3_1(?:_dark)?\.css['"]/;

  let htmlTrackFile = null;
  let datathemeFile = null;
  let themeClassFile = null;

  for (const f of jsFiles) {
    const text = stripCommentsKeepLines(fs.readFileSync(f, 'utf8'), true);
    const rel = path.relative(root, f).replace(/\\/g, '/');

    if (!htmlTrackFile && classListDarkRe.test(text)) htmlTrackFile = rel;
    if (!datathemeFile && bodyDatathemeRe.test(text)) datathemeFile = rel;
    if (!themeClassFile && bodyThemeClassRe.test(text)) themeClassFile = rel;

    if (classListAuiDarkRe.test(text)) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (classListAuiDarkRe.test(lines[i])) {
          fails.push({
            file: rel, line: i + 1, code: 'AUI_DARK_TOGGLE_RESIDUE',
            detail: 'body 轨 aui3_1_dark 残留——eview-react 旧轨（aui3_1_dark.css 已删）。删除该行，改用 eview-ui 三轨：data-theme 属性 + eviewui_aui3_1_default/evening 类互换',
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
            detail: '残留 @nce/eview-react 的 CSS import（aui3_1*.css）——骨架换血未完成，应删除',
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
      detail: '缺 html 轨：未找到 document.documentElement 的 .dark classList 切换——自定义 token 四层暗色会失效（上游已就位，可能被误删）。应为 document.documentElement.classList.toggle("dark", isDark)',
    });
  }

  if (datathemeFile) {
    console.log(`  ② body 属性轨: ✓ ${datathemeFile}`);
  } else {
    fails.push({
      file: '(src/)', line: 0, code: 'BODY_DATATHEME_MISSING',
      detail: '缺 body 属性轨：未找到 document.body 的 data-theme 切换——应为 document.body.setAttribute("data-theme", isDark ? "dark" : "default")（白天 default / 黑夜 dark）',
    });
  }

  if (themeClassFile) {
    console.log(`  ③ body class 轨: ✓ ${themeClassFile}`);
  } else {
    fails.push({
      file: '(src/)', line: 0, code: 'BODY_THEMECLASS_MISSING',
      detail: '缺 body class 轨：未找到 eviewui_aui3_1_evening/eviewui_aui3_1_default 类切换——应为 document.body.classList.toggle("eviewui_aui3_1_evening", isDark) + toggle("eviewui_aui3_1_default", !isDark)（白天也必须挂 default 类，不是仅移除 evening）',
    });
  }

  // ---- 报告 ----
  if (fails.length === 0) {
    console.log('\n结论: PASS — 暗色三轨齐全（html .dark + body data-theme + body eviewui_aui3_1_* 类），无 eview-react 旧轨残留。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) {
    const loc = v.line ? `${v.file}:${v.line}` : v.file;
    console.log(`  - ${loc}  [${v.code}] ${v.detail}`);
  }
  console.log('\n  修复指引见 SKILL.md 硬约束⑪ + migration-workflow.md 步骤 0.5/步骤 1。');
  process.exit(1);
}

main();
