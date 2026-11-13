#!/usr/bin/env node
/**
 * check-token-drift.cjs — 色值 token 漂移检查（对照源项目快照）
 *
 * 对应需求：从 antd 向私有组件转换时，手写样式的色值 token 不应修改（不漂移）。
 * 数据来源：umd-to-antd-vite 的 extract-umd.cjs 在步骤 2 扫描源项目 assets/style/
 * 四层 CSS 的 --xxx: value 定义，写入 .umd-conversion.json 的 sourceCssTokens 字段。
 * 本脚本读该快照对照产物，无需访问源项目。
 *
 * 检查项：
 *   1. TOKEN_VALUE_DRIFT   产物 src/styles/*.css 的 token 定义值与源快照不一致 → 硬 FAIL
 *      （如源 --brand-50: #0067D1，产物被改成 --brand-50: #0077E0）
 *   2. TOKEN_MISSING       源快照有但产物缺失的 token → advisory（可能被误删）
 *   3. TOKEN_ADDED         产物新增源快照没有的 token → advisory（scaffold 可能合理新增，需核对）
 *   4. UNDEFINED_REF       业务 CSS 引用 var(--xxx) 但 xxx 不在任何层已定义 → 报漂移
 *      （AI 手写时发明了源项目不存在的 token 名）
 *
 * 范围：
 *   - token 定义对照：src/styles/{base,light,theme,dark}.css（与源快照同四层）
 *   - 未定义引用：src/ 下排除 styles/ + shared/ 的业务 CSS（同 check-css.cjs 范围）
 *
 * 用法：
 *   node check-token-drift.cjs <目标工程根>          # 有硬 FAIL exit 1，advisory exit 0
 *   node check-token-drift.cjs <目标工程根> --strict # 有 advisory 也 exit 1
 *
 * 纯静态正则，不执行代码。退出码：0=通过/仅 advisory，1=硬 FAIL 或 --strict 下有 advisory，2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.css']);
const SKIP_DIRS = new Set(['styles', 'shared']);
const LAYER_FILES = ['base.css', 'light.css', 'theme.css', 'dark.css'];

// 提取 CSS 内容中所有自定义属性定义（--xxx: value;）——与 extract-umd.cjs 的 extractCssTokens 一致
function extractCssTokens(cssContent) {
  const tokens = {};
  const lines = cssContent.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*(--[A-Za-z0-9_-]+)\s*:\s*([^;]+);/);
    if (m) tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

// 提取 CSS 中所有 var(--xxx) 引用的 token 名（去重）
function extractVarRefs(cssContent) {
  const refs = new Set();
  const re = /var\s*\(\s*(--[A-Za-z0-9_-]+)/g;
  let m;
  while ((m = re.exec(cssContent)) !== null) refs.add(m[1]);
  return refs;
}

// 扫描 JSX/JS/TS 文件中内联 style 设置的 CSS 自定义属性名
// 如 style={{ "--tl-color": t.color }} → 提取 "--tl-color"
// 这些 token 虽未在 CSS 层定义但运行时由 JS 注入，是合法模式，不应报漂移
function extractInlineStyleTokenNames(text) {
  const names = new Set();
  const re = /['"](--[A-Za-z0-9_-]+)['"]\s*:/g;
  let m;
  while ((m = re.exec(text)) !== null) names.add(m[1]);
  return names;
}

const CSS_EXTS = new Set(['.css']);
const JSX_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

function walk(dir, out, rootSrc, exts) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    if (ent.isDirectory() && dir === rootSrc && SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out, rootSrc, exts);
    else if (exts.has(path.extname(ent.name))) out.push(full);
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

function main() {
  const args = process.argv.slice(2);
  const strict = args.indexOf('--strict') >= 0;
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-token-drift] 找不到 ${srcDir}，用法: node check-token-drift.cjs <目标工程根> [--strict]`);
    process.exit(2);
  }

  // 读源 token 快照
  const handoffPath = path.join(root, '.umd-conversion.json');
  let sourceTokens = null;
  if (fs.existsSync(handoffPath)) {
    const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
    sourceTokens = handoff.sourceCssTokens || null;
  }
  if (!sourceTokens) {
    console.error(`[check-token-drift] .umd-conversion.json 无 sourceCssTokens 字段——需先跑 umd-to-antd-vite 的 extract-umd.cjs（已支持 token 快照）。`);
    console.error('  若产物由旧版 extract-umd 生成，需重跑 extract-umd 或手动补 sourceCssTokens。');
    process.exit(2);
  }

  // 收集源项目所有已定义 token 名（跨层并集）
  const sourceDefinedNames = new Set();
  for (const layer of LAYER_FILES) {
    const tokens = sourceTokens[layer];
    if (tokens) for (const name of Object.keys(tokens)) sourceDefinedNames.add(name);
  }

  // ---- 1. 对照 token 定义值 ----
  const fails = [];      // 硬 FAIL（值漂移）
  const advisories = []; // advisory

  let productDefinedNames = new Set();
  for (const layer of LAYER_FILES) {
    const productFile = path.join(srcDir, 'styles', layer);
    if (!fs.existsSync(productFile)) {
      advisories.push({ code: 'LAYER_MISSING', file: `src/styles/${layer}`, detail: '产物缺少该 CSS 层文件' });
      continue;
    }
    const productTokens = extractCssTokens(fs.readFileSync(productFile, 'utf8'));
    for (const name of Object.keys(productTokens)) productDefinedNames.add(name);
    const srcTokens = sourceTokens[layer] || {};

    // 值漂移：同名 token 值不同
    for (const name of Object.keys(productTokens)) {
      if (srcTokens[name] !== undefined && srcTokens[name] !== productTokens[name]) {
        fails.push({
          file: `src/styles/${layer}`, name,
          code: 'TOKEN_VALUE_DRIFT',
          detail: `token 值漂移：源 "${srcTokens[name]}" → 产物 "${productTokens[name]}"`,
        });
      }
    }
    // 源有产物无
    for (const name of Object.keys(srcTokens)) {
      if (productTokens[name] === undefined) {
        advisories.push({
          file: `src/styles/${layer}`, name,
          code: 'TOKEN_MISSING',
          detail: `源项目有 token ${name} 但产物缺失（可能被误删）`,
        });
      }
    }
    // 产物新增
    for (const name of Object.keys(productTokens)) {
      if (srcTokens[name] === undefined) {
        advisories.push({
          file: `src/styles/${layer}`, name,
          code: 'TOKEN_ADDED',
          detail: `产物新增 token ${name}（源项目无，scaffold 可能合理新增，需核对）`,
        });
      }
    }
  }

  // ---- 2. 业务 CSS 引用未定义 token ----
  const businessCssFiles = walk(srcDir, [], srcDir, CSS_EXTS);
  // 收集 JSX/JS/TS 文件中内联 style 设置的 token 名（运行时注入，合法模式，不应报漂移）
  const businessJsxFiles = walk(srcDir, [], srcDir, JSX_EXTS);
  const inlineDefinedNames = new Set();
  for (const file of businessJsxFiles) {
    const text = fs.readFileSync(file, 'utf8');
    for (const name of extractInlineStyleTokenNames(text)) inlineDefinedNames.add(name);
  }

  for (const file of businessCssFiles) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const refs = extractVarRefs(text);
    for (const refName of refs) {
      // 已在 CSS 层定义 或 由 JSX 内联 style 注入 → 不报
      if (productDefinedNames.has(refName) || inlineDefinedNames.has(refName)) continue;
      // 找第一个出现的行号
      const re = new RegExp(`var\\s*\\(\\s*${refName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      const m = re.exec(text);
      const line = m ? lineOfOffset(text, m.index) : 1;
      const isSourceDefined = sourceDefinedNames.has(refName);
      advisories.push({
        file: rel, line, name: refName,
        code: 'UNDEFINED_REF',
        detail: `业务 CSS 引用 var(${refName}) 但该 token 未在产物任何 CSS 层定义${isSourceDefined ? '（源项目有定义但产物缺失——token 被误删）' : '（源项目也无此 token——可能 AI 手写时发明，或由 JSX 内联 style 注入，需核对）'}`,
      });
    }
  }

  // ---- 报告 ----
  console.log('[check-token-drift] 色值 token 漂移检查报告');
  console.log(`  扫描范围: ${srcDir}（token 层 ${LAYER_FILES.length} 文件 + 业务 CSS ${businessCssFiles.length} 文件 + 业务 JSX ${businessJsxFiles.length} 文件）`);
  console.log(`  源快照: ${sourceDefinedNames.size} 个 token（${Object.keys(sourceTokens).map(l => `${l}:${Object.keys(sourceTokens[l]||{}).length}`).join(', ')}）`);

  if (fails.length === 0 && advisories.length === 0) {
    console.log('\n结论: PASS — token 定义值与源一致，业务 CSS 无未定义引用。');
    process.exit(0);
  }

  if (fails.length > 0) {
    console.log(`\n【硬 FAIL — token 值漂移】${fails.length} 处：`);
    for (const v of fails) {
      console.log(`  - ${v.file}  ${v.name}  ${v.detail}`);
    }
  }
  if (advisories.length > 0) {
    // 按类型分组
    const byCode = {};
    for (const v of advisories) (byCode[v.code] = byCode[v.code] || []).push(v);
    const codeDesc = {
      TOKEN_MISSING: '源有产物缺（可能误删）',
      TOKEN_ADDED: '产物新增（scaffold 可能合理，需核对）',
      UNDEFINED_REF: '业务 CSS 引用未定义 token（漂移）',
      LAYER_MISSING: 'CSS 层文件缺失',
    };
    console.log(`\n【advisory — 需人工确认】${advisories.length} 处：`);
    for (const code of Object.keys(byCode)) {
      console.log(`\n  [${code}] ${codeDesc[code] || code}（${byCode[code].length} 处）：`);
      for (const v of byCode[code]) {
        const loc = v.line ? `${v.file}:${v.line}` : v.file;
        console.log(`    - ${loc}  ${v.detail}`);
      }
    }
  }

  console.log('\n  修复指引：token 值漂移必须恢复源值；未定义引用应改用源项目已定义的 token。');
  if (fails.length > 0 || strict) process.exit(1);
}

main();
