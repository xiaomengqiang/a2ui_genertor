#!/usr/bin/env node
/**
 * check-provider.cjs — eview-ui ConfigProvider 检查（硬 FAIL）
 *
 * 对应 SKILL.md「eview-ui 硬约束」③。eview-ui 组件文案/主题全靠 ConfigProvider：
 *   - locale 默认是 'en'——不传 locale="zh" 则 DatePicker 月份/分页条/弹层按钮全英文（最高频遗漏）
 *   - version="aui3" + listenTheme 是 aui3 规范与动态切主题的前提
 *   - theme 必须响应式派生 isDark（写死静态字符串 → 暗色切换组件不跟随）
 *
 * 检查项（均硬 FAIL）：
 *   1. CONFIGPROVIDER_MISSING  src/ 无 <ConfigProvider → FAIL
 *   2. LOCALE_NOT_ZH           <ConfigProvider> 标签缺 locale="zh" → FAIL（默认 en）
 *   3. VERSION_NOT_AUI3        缺 version="aui3" → FAIL
 *   4. LISTENTHEME_MISSING     缺 listenTheme → FAIL（动态切主题必须）
 *   5. THEME_STATIC_STRING     theme="..." 是静态字符串（无 isDark 派生）→ FAIL
 *
 * 用法：
 *   node check-provider.cjs <目标工程根>
 *
 * 纯静态正则（扫描前移除注释；ConfigProvider 标签跨行用 tagWindow 提取），不执行代码。
 * 退出码：0=通过，1=硬 FAIL，2=用法错误。
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

function stripComments(text) {
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  out = out.replace(/(^|[^:'"])\/\/[^\n]*/g, (m, p1) => p1);
  return out;
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
    console.error(`[check-provider] 找不到 ${srcDir}，用法: node check-provider.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];

  let providerCount = 0;

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!/<ConfigProvider\b/.test(raw)) continue;
    const text = stripComments(raw);
    const rel = path.relative(root, file);

    const re = /<ConfigProvider\b/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      providerCount++;
      const start = m.index;
      const tagEnd = findTagEnd(text, start);
      const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 500);
      const line = text.slice(0, start).split('\n').length;
      const loc = `${rel}:${line}`;

      if (!/locale\s*=\s*['"]zh['"]/.test(tagWindow)) {
        fails.push({
          file: rel, line, code: 'LOCALE_NOT_ZH',
          detail: `${loc} ConfigProvider 缺 locale="zh"（eview-ui 默认 en，不传则组件内置文案全英文）`,
        });
      }
      if (/locale\s*=\s*['"]zh-CN['"]/.test(tagWindow)) {
        fails.push({
          file: rel, line, code: 'LOCALE_NOT_ZH',
          detail: `${loc} locale="zh-CN" 应为 "zh"（eview-ui 枚举是小写 zh/en）`,
        });
      }
      if (!/version\s*=\s*['"]aui3['"]/.test(tagWindow)) {
        fails.push({
          file: rel, line, code: 'VERSION_NOT_AUI3',
          detail: `${loc} ConfigProvider 缺 version="aui3"（aui3 规范前提，listenTheme 依赖它）`,
        });
      }
      if (!/\blistenTheme\b/.test(tagWindow)) {
        fails.push({
          file: rel, line, code: 'LISTENTHEME_MISSING',
          detail: `${loc} ConfigProvider 缺 listenTheme（动态切主题必须：listenTheme=true 时须 version=aui3 且 theme 传值）`,
        });
      }
      // theme 静态字符串：theme="lightday" / theme="evening" 字面量（无 {} 派生）
      if (/theme\s*=\s*['"](?:lightday|evening)['"]/.test(tagWindow)) {
        fails.push({
          file: rel, line, code: 'THEME_STATIC_STRING',
          detail: `${loc} theme 是静态字符串——必须响应式派生：theme={isDark ? 'evening' : 'lightday'}（暗色主机制是 body 三轨，ConfigProvider theme 作双保险——写死则双保险失效且可能与 body 轨冲突）`,
        });
      }
      // theme 缺失（既无静态也无动态）
      if (!/theme\s*=/.test(tagWindow)) {
        fails.push({
          file: rel, line, code: 'THEME_STATIC_STRING',
          detail: `${loc} ConfigProvider 缺 theme 属性（须 theme={isDark ? 'evening' : 'lightday'}）`,
        });
      }
    }
  }

  // ---- 报告 ----
  console.log('[check-provider] ConfigProvider locale/version/theme 检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，发现 ${providerCount} 处 <ConfigProvider>）`);

  if (providerCount === 0) {
    console.log('\n【硬 FAIL】');
    console.log('  - src/ 未发现 <ConfigProvider>——eview-ui 组件文案/主题必须由 ConfigProvider 提供');
    console.log('    正确位置：app.jsx 的 AppProvider 之下包住业务树，四项必传：');
    console.log('    <ConfigProvider locale="zh" version="aui3" listenTheme theme={isDark ? \'evening\' : \'lightday\'}>');
    process.exit(1);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — ConfigProvider 四项齐全，theme 响应式派生。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) {
    console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }
  console.log('\n  修复指引见 SKILL.md 硬约束③ + migration-workflow.md 步骤 1。');
  process.exit(1);
}

main();
