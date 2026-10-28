#!/usr/bin/env node
/**
 * check-provider.cjs — IntlProvider 位置 + locale 检查（硬 FAIL）
 *
 * 对应 SKILL.md 硬约束③ Provider。IntlProvider 放错位置是高频踩坑点：
 * 迁移时容易把 IntlProvider 跟着 AppShell 一起搬到 app.jsx/context.jsx，
 * 导致弹层（Dialog 等 portal）取不到业务文案报 MISSING_TRANSLATION。
 *
 * 基于 scaffold 实际结构：scaffold main.jsx 的正确形态是 IntlProvider
 * 在 main.jsx 顶层 render() 的最外层直接包 <App/>。脚本检查 IntlProvider
 * 在 main.jsx + locale 正确。
 *
 * 检查项：
 *   1. INTLPROVIDER_NOT_IN_MAIN  main.jsx 不含 <IntlProvider → FAIL（应无 main 文件，或被搬走）
 *   2. INTLPROVIDER_IN_APPSHELL  app.jsx/context.jsx/views 等非 main 文件含 <IntlProvider → FAIL
 *   3. LOCALE_ZH_CN              任何文件 locale="zh-CN" → FAIL，应为 "zh"
 *   4. LOCALE_MISSING_ZH         main.jsx 无 locale="zh" → advisory（可能用变量，需核对）
 *
 * 用法：
 *   node check-provider.cjs <目标工程根>
 *
 * 纯静态正则（扫描前移除注释），不执行代码。退出码：0=通过，1=硬 FAIL，2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const MAIN_NAMES = ['main.jsx', 'main.tsx', 'main.js', 'main.ts'];

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

// 移除注释：/* */ 块注释（保留换行维持行号）+ // 行注释（// 前是行首或非 : ' " 字符，避免误删 URL 的 //）
function stripComments(text) {
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  out = out.replace(/(^|[^:'"])\/\/[^\n]*/g, (m, p1) => p1);
  return out;
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

  // 定位 main 文件
  let mainFile = null;
  for (const name of MAIN_NAMES) {
    const p = path.join(srcDir, name);
    if (fs.existsSync(p)) { mainFile = p; break; }
  }

  const files = walk(srcDir, []);
  const fails = [];     // 硬 FAIL
  const advisories = [];

  if (!mainFile) {
    fails.push({
      file: '(src/)', line: 0,
      code: 'INTLPROVIDER_NOT_IN_MAIN',
      detail: '找不到 main.jsx/main.tsx——IntlProvider 应在 main 顶层 render() 最外层直接包 <App/>',
    });
  } else {
    const mainText = stripComments(fs.readFileSync(mainFile, 'utf8'));
    const mainRel = path.relative(root, mainFile);
    if (!/<IntlProvider\b/.test(mainText)) {
      fails.push({
        file: mainRel, line: 0,
        code: 'INTLPROVIDER_NOT_IN_MAIN',
        detail: 'main 文件不含 <IntlProvider>——IntlProvider 应在 main.jsx 顶层 render() 最外层直接包 <App/>（迁移时可能被搬走）',
      });
    }
    if (!/locale\s*=\s*['"]zh['"]/.test(mainText)) {
      advisories.push({
        file: mainRel, line: 0,
        code: 'LOCALE_MISSING_ZH',
        detail: 'main 文件未出现 locale="zh"——可能 locale 用变量注入（如 scenario C），请确认最终值为 "zh" 不是 "zh-CN"',
      });
    }
  }

  // 扫所有文件：<IntlProvider> 不应在非 main 文件出现；locale="zh-CN" 全局禁
  for (const file of files) {
    const text = stripComments(fs.readFileSync(file, 'utf8'));
    const rel = path.relative(root, file);
    const lines = text.split('\n');

    const isMain = mainFile && file === mainFile;

    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      // IntlProvider 被搬到非 main 文件
      if (!isMain && /<IntlProvider\b/.test(ln)) {
        fails.push({
          file: rel, line: i + 1,
          code: 'INTLPROVIDER_IN_APPSHELL',
          detail: '<IntlProvider> 出现在非 main 文件——应只在 main.jsx 顶层 render() 最外层（否则弹层 portal 取不到业务文案报 MISSING_TRANSLATION）',
        });
      }
      // locale="zh-CN" 全局禁（含 main 文件）
      if (/locale\s*=\s*['"]zh-CN['"]/.test(ln)) {
        fails.push({ file: rel, line: i + 1, code: 'LOCALE_ZH_CN', detail: 'locale="zh-CN" 应改为 "zh"（componentsLocales 的 key 是 "zh"）' });
      }
    }
  }

  // ---- 报告 ----
  console.log('[check-provider] IntlProvider 位置 + locale 检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，main=${mainFile ? path.basename(mainFile) : '未找到'}）`);

  if (fails.length === 0 && advisories.length === 0) {
    console.log('\n结论: PASS — IntlProvider 在 main.jsx 顶层、locale 正确。');
    process.exit(0);
  }

  if (fails.length > 0) {
    console.log(`\n【硬 FAIL】${fails.length} 处：`);
    for (const v of fails) {
      const loc = v.line ? `${v.file}:${v.line}` : v.file;
      console.log(`  - ${loc}  [${v.code}] ${v.detail}`);
    }
  }
  if (advisories.length > 0) {
    console.log(`\n【advisory — 需人工确认】${advisories.length} 处：`);
    for (const v of advisories) {
      const loc = v.line ? `${v.file}:${v.line}` : v.file;
      console.log(`  - ${loc}  [${v.code}] ${v.detail}`);
    }
  }
  console.log('\n  修复指引见 SKILL.md 硬约束③ + i18n-migration.md §4。');
  process.exit(fails.length > 0 ? 1 : 0);
}

main();
