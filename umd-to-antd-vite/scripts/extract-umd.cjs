#!/usr/bin/env node

// extract-umd.cjs
// 从 ict-react-coder 产物的 UMD 单 HTML 工程提取内容到标准 Vite 工程结构：
//
// 1. <style> 块的 CSS 规则 → 按 :root / .dark / @font-face / 其他 分类写入对应文件
// 2. <script type="text/babel|jsx"> 块的源码模块 → 写入 _extracted/ 目录（需 --scripts）
// 3. 检查源项目 src/ 目录 → 列出文件清单
// 4. 扫描 antd 组件导入 → 生成 .umd-conversion.json 交接文件（供 antd-to-eview-react skill 读取）
//
// 用法：
//   node extract-umd.cjs <源UMD文件路径> [输出目录] [--scripts]
//
// 示例：
//   node extract-umd.cjs ./source/index.page.html ./my-app
//   node extract-umd.cjs ./source/index.page.html ./my-app --scripts

const fs = require('fs');
const path = require('path');

const sourceFile = process.argv[2];
const outputDir = process.argv[3] || (sourceFile ? path.dirname(sourceFile) : '');
const extractScripts = process.argv.includes('--scripts');

if (!sourceFile || sourceFile === '--scripts') {
  console.error('[extract-umd] 用法: node extract-umd.cjs <源UMD文件路径> [输出目录] [--scripts]');
  console.error('[extract-umd] 示例: node extract-umd.cjs ./index.page.html ./my-app --scripts');
  process.exit(1);
}

if (!fs.existsSync(sourceFile)) {
  console.error(`[extract-umd] 源文件不存在: ${sourceFile}`);
  process.exit(1);
}

const html = fs.readFileSync(sourceFile, 'utf8');
const sourceDir = path.dirname(path.resolve(sourceFile));
const resolvedOutput = path.resolve(outputDir || sourceDir);
const sourceBaseName = path.basename(sourceFile);

const stats = {
  rootRules: 0, darkRules: 0, fontRules: 0, mediaRules: 0, otherRules: 0,
  tokenVars: 0, darkVars: 0, scriptsExtracted: 0, srcFiles: [],
  antdComponents: {}, antdIcons: [],
};

// ========== 1. 提取 <style> 块并分类 ==========

function extractStyleBlocks(html) {
  const blocks = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1]);
  return blocks.join('\n');
}

function extractTopLevelRules(css) {
  const rules = [];
  let i = 0;
  const len = css.length;
  while (i < len) {
    while (i < len && /\s/.test(css[i])) i++;
    if (i >= len) break;
    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i);
      i = end < 0 ? len : end + 2;
      continue;
    }
    let selStart = i;
    while (i < len && css[i] !== '{' && css[i] !== ';') i++;
    if (i >= len) break;
    if (css[i] === ';') { i++; continue; }
    const selector = css.slice(selStart, i).trim();
    i++;
    let depth = 1, blockStart = i;
    while (i < len && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      if (depth > 0) i++;
    }
    const block = css.slice(blockStart, i).trim();
    i++;
    rules.push({ selector, block, raw: `${selector} { ${block} }` });
  }
  return rules;
}

function countVars(block) {
  const m = block.match(/--[a-zA-Z0-9-]+\s*:/g);
  return m ? m.length : 0;
}

function classifyRule(rule, buckets) {
  const sel = rule.selector;
  if (sel === ':root' || /^:root\b/.test(sel)) {
    buckets.root.push(rule.raw);
    stats.rootRules++;
    stats.tokenVars += countVars(rule.block);
  } else if (/^\.dark\b/.test(sel) || /,\s*\.dark\b/.test(sel)) {
    buckets.dark.push(rule.raw);
    stats.darkRules++;
    stats.darkVars += countVars(rule.block);
  } else if (sel.startsWith('@font-face')) {
    buckets.font.push(rule.raw);
    stats.fontRules++;
  } else if (sel.startsWith('@media')) {
    stats.mediaRules++;
    const mediaCondition = sel.replace(/^@media\s*/, '');
    const innerRules = extractTopLevelRules(rule.block);
    const innerBuckets = { root: [], dark: [], font: [], other: [] };
    for (const ir of innerRules) classifyRule(ir, innerBuckets);
    for (const key of ['root', 'dark', 'font', 'other']) {
      if (innerBuckets[key].length) {
        buckets[key].push(`@media ${mediaCondition} {\n${innerBuckets[key].join('\n\n')}\n}`);
      }
    }
  } else if (sel.startsWith('@keyframes') || sel.startsWith('@-webkit-keyframes')) {
    buckets.other.push(rule.raw);
    stats.otherRules++;
  } else if (sel.startsWith('@import') || sel.startsWith('@charset')) {
    // 忽略
  } else {
    buckets.other.push(rule.raw);
    stats.otherRules++;
  }
}

const cssText = extractStyleBlocks(html);
const cssFilesWritten = [];
if (!cssText.trim()) {
  console.warn('[extract-umd] 未找到 <style> 块，跳过 CSS 提取');
} else {
  const rules = extractTopLevelRules(cssText);
  const buckets = { root: [], dark: [], font: [], other: [] };
  for (const rule of rules) classifyRule(rule, buckets);

  const stylesDir = path.join(resolvedOutput, 'src', 'styles');
  if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true });

  if (buckets.root.length) {
    const p = path.join(stylesDir, 'tokens.css');
    fs.writeFileSync(p, `/* tokens.css - 从 ${sourceBaseName} 提取的 :root 变量定义 */\n/* 共 ${stats.tokenVars} 个变量，${stats.rootRules} 个 :root 规则 */\n\n${buckets.root.join('\n\n')}\n`, 'utf8');
    cssFilesWritten.push('src/styles/tokens.css');
    console.log(`[extract-umd] tokens.css: ${stats.tokenVars} 个变量（${stats.rootRules} 个 :root 规则）`);
  }
  if (buckets.dark.length) {
    const p = path.join(stylesDir, 'theme-dark.css');
    fs.writeFileSync(p, `/* theme-dark.css - 从 ${sourceBaseName} 提取的 .dark 覆盖 */\n/* 共 ${stats.darkVars} 个变量，${stats.darkRules} 个 .dark 规则 */\n\n${buckets.dark.join('\n\n')}\n`, 'utf8');
    cssFilesWritten.push('src/styles/theme-dark.css');
    console.log(`[extract-umd] theme-dark.css: ${stats.darkVars} 个变量（${stats.darkRules} 个 .dark 规则）`);
  }
  if (buckets.font.length) {
    const p = path.join(stylesDir, 'font.css');
    fs.writeFileSync(p, `/* font.css - 从 ${sourceBaseName} 提取的 @font-face */\n\n${buckets.font.join('\n\n')}\n`, 'utf8');
    cssFilesWritten.push('src/styles/font.css');
    console.log(`[extract-umd] font.css: ${stats.fontRules} 个 @font-face 规则`);
  }
  if (buckets.other.length) {
    const p = path.join(stylesDir, 'base.css');
    fs.appendFileSync(p, `\n\n/* 以下规则从 ${sourceBaseName} 的 <style> 块提取（${stats.otherRules} 条） */\n\n${buckets.other.join('\n\n')}\n`, 'utf8');
    cssFilesWritten.push('src/styles/base.css');
    console.log(`[extract-umd] base.css: 追加 ${stats.otherRules} 条规则`);
  }
  if (stats.mediaRules) console.log(`[extract-umd] @media 规则: ${stats.mediaRules} 个（已递归分类）`);
}

// ========== 2. 检查源项目 src/ 目录 ==========

function listSrcFiles(baseDir) {
  const srcDir = path.join(baseDir, 'src');
  if (!fs.existsSync(srcDir)) return [];
  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (name === 'node_modules' || name === 'dist') continue;
        walk(full);
      } else if (/\.(jsx?|tsx?|json|css)$/.test(name)) {
        files.push(path.relative(baseDir, full).replace(/\\/g, '/'));
      }
    }
  }
  walk(srcDir);
  return files;
}

stats.srcFiles = listSrcFiles(sourceDir);
if (stats.srcFiles.length) {
  console.log(`[extract-umd] 源项目 src/ 有 ${stats.srcFiles.length} 个文件`);
} else {
  console.warn('[extract-umd] 源项目无 src/ 目录，需要从 HTML 提取 script 块（加 --scripts）');
}

// ========== 3. 提取 script 块（可选） ==========

if (extractScripts || !stats.srcFiles.length) {
  const scriptRe = /<script\s+[^>]*type=["']text\/(?:babel|jsx)["'][^>]*>([\s\S]*?)<\/script>/gi;
  const presetRe = /<script\s+[^>]*data-presets[^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let m;
  while ((m = scriptRe.exec(html)) !== null) blocks.push(m[1].trim());
  while ((m = presetRe.exec(html)) !== null) {
    const c = m[1].trim();
    if (c && !blocks.includes(c)) blocks.push(c);
  }

  if (blocks.length) {
    const extractedDir = path.join(resolvedOutput, '_extracted');
    if (!fs.existsSync(extractedDir)) fs.mkdirSync(extractedDir, { recursive: true });
    blocks.forEach((content, idx) => {
      const fileName = guessFileName(content, idx);
      fs.writeFileSync(path.join(extractedDir, fileName), content + '\n', 'utf8');
      stats.scriptsExtracted++;
      console.log(`[extract-umd] _extracted/${fileName}`);
    });
    console.log(`[extract-umd] 提取 ${stats.scriptsExtracted} 个 script 块到 _extracted/`);
  }
}

// ========== 4. 扫描 antd 组件导入 ==========

// 确定扫描目录：优先源项目 src/，其次目标 _extracted/
function scanAntdImports() {
  const scanDirs = [];
  const srcDir = path.join(sourceDir, 'src');
  if (fs.existsSync(srcDir)) scanDirs.push(srcDir);
  const extractedDir = path.join(resolvedOutput, '_extracted');
  if (fs.existsSync(extractedDir)) scanDirs.push(extractedDir);

  const components = {}; // componentName -> [relativeFiles]
  const icons = new Set();

  for (const base of scanDirs) {
    function walk(dir) {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (name === 'node_modules' || name === 'dist') continue;
          walk(full);
          continue;
        }
        if (!/\.(jsx?|tsx?)$/.test(name)) continue;
        const code = fs.readFileSync(full, 'utf8');
        const relFile = path.relative(sourceDir, full).replace(/\\/g, '/');
        // import { Button, Form, Table } from 'antd'
        const braceRe = /import\s+\{([^}]+)\}\s+from\s+['"]antd['"]/g;
        let bm;
        while ((bm = braceRe.exec(code)) !== null) {
          const names = bm[1].split(',').map(s => s.trim()).filter(Boolean);
          for (const n of names) {
            const clean = n.replace(/\s+as\s+\w+/, '').trim();
            if (clean) {
              if (!components[clean]) components[clean] = [];
              if (!components[clean].includes(relFile)) components[clean].push(relFile);
            }
          }
        }
        // import Button from 'antd/es/button' (named import)
        const defaultRe = /import\s+(\w+)\s+from\s+['"]antd\/(?:es|lib)\/(\w+)['"]/g;
        let dm;
        while ((dm = defaultRe.exec(code)) !== null) {
          const comp = dm[2];
          if (comp) {
            const cap = comp.charAt(0).toUpperCase() + comp.slice(1);
            if (!components[cap]) components[cap] = [];
            if (!components[cap].includes(relFile)) components[cap].push(relFile);
          }
        }
        // import { SearchOutlined } from '@ant-design/icons'
        const iconRe = /import\s+\{([^}]+)\}\s+from\s+['"]@ant-design\/icons['"]/g;
        let im;
        while ((im = iconRe.exec(code)) !== null) {
          const names = im[1].split(',').map(s => s.trim().replace(/\s+as\s+\w+/, '')).filter(Boolean);
          for (const n of names) icons.add(n);
        }
      }
    }
    walk(base);
  }

  stats.antdComponents = components;
  stats.antdIcons = Array.from(icons).sort();

  const compCount = Object.keys(components).length;
  if (compCount) {
    console.log(`[extract-umd] 扫描到 ${compCount} 个 antd 组件:`);
    for (const [comp, files] of Object.entries(components)) {
      console.log(`  ${comp} → ${files.join(', ')}`);
    }
  }
  if (icons.size) {
    console.log(`[extract-umd] 扫描到 ${icons.size} 个 @ant-design/icons 图标`);
  }
}

scanAntdImports();

// ========== 4.5 扫描 i18n 用法（判定 scenario A/B/C） ==========

function scanI18nUsage() {
  const scanDirs = [];
  const srcDir = path.join(sourceDir, 'src');
  if (fs.existsSync(srcDir)) scanDirs.push(srcDir);
  const extractedDir = path.join(resolvedOutput, '_extracted');
  if (fs.existsSync(extractedDir)) scanDirs.push(extractedDir);

  const result = {
    scenario: 'A',
    reactIntl: { used: false, files: [] },
    i18next: { used: false, files: [] },
    antdLocaleImports: [],
    antdLocaleFiles: [],
    businessLocaleFiles: [],
    hasDayjs: false,
  };

  const localeDirRe = /(^|[\/\\])(locales?|i18n|lang|messages|languages)([\/\\]|$)/i;

  for (const base of scanDirs) {
    function walk(dir) {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (name === 'node_modules' || name === 'dist') continue;
          walk(full);
          continue;
        }
        if (!/\.(jsx?|tsx?|mjs)$/.test(name)) continue;
        const code = fs.readFileSync(full, 'utf8');
        const relFile = path.relative(sourceDir, full).replace(/\\/g, '/');

        if (/'react-intl'/.test(code) || /<FormattedMessage\b/.test(code) || /\buseIntl\b/.test(code)) {
          result.reactIntl.used = true;
          if (!result.reactIntl.files.includes(relFile)) result.reactIntl.files.push(relFile);
        }
        if (/'react-i18next'/.test(code) || /'i18next'/.test(code) || /\buseTranslation\b/.test(code)) {
          result.i18next.used = true;
          if (!result.i18next.files.includes(relFile)) result.i18next.files.push(relFile);
        }

        let lm;
        const localeImportRe = /from\s+['"]antd\/locale\/[^'"]+['"]/g;
        while ((lm = localeImportRe.exec(code)) !== null) {
          if (!result.antdLocaleImports.includes(lm[0])) result.antdLocaleImports.push(lm[0]);
        }

        if (/dayjs\.locale\s*\(/.test(code)) {
          if (!result.antdLocaleFiles.includes(relFile)) result.antdLocaleFiles.push(relFile);
        }

        if (/['"]dayjs['"]/.test(code)) result.hasDayjs = true;

        if (localeDirRe.test(relFile) || /^locales?\.[a-z]+$/.test(name) || /^i18n\.[a-z]+$/.test(name) || /^messages\.[a-z]+$/.test(name)) {
          if (!result.businessLocaleFiles.includes(relFile)) result.businessLocaleFiles.push(relFile);
        }
      }
    }
    walk(base);
  }

  if (result.i18next.used) result.scenario = 'C';
  else if (result.reactIntl.used) result.scenario = 'B';
  else result.scenario = 'A';

  return result;
}

const i18nInfo = scanI18nUsage();
stats.i18n = i18nInfo;

if (i18nInfo.scenario !== 'A') {
  console.log(`[extract-umd] i18n scenario: ${i18nInfo.scenario}`);
}
if (i18nInfo.reactIntl.used) console.log(`[extract-umd] react-intl 用法: ${i18nInfo.reactIntl.files.length} 个文件`);
if (i18nInfo.i18next.used) console.log(`[extract-umd] i18next 用法: ${i18nInfo.i18next.files.length} 个文件`);
if (i18nInfo.antdLocaleImports.length) console.log(`[extract-umd] antd locale 导入: ${i18nInfo.antdLocaleImports.length} 处`);
if (i18nInfo.antdLocaleFiles.length) console.log(`[extract-umd] 自写 antd locale 文件(dayjs 注册): ${i18nInfo.antdLocaleFiles.join(', ')}`);
if (i18nInfo.businessLocaleFiles.length) console.log(`[extract-umd] 业务语言包文件: ${i18nInfo.businessLocaleFiles.length} 个`);

// ========== 5. 生成 .umd-conversion.json 交接文件 ==========

const handoff = {
  skill: 'umd-to-antd-vite',
  version: '1.0',
  sourceFile: sourceBaseName,
  projectName: path.basename(resolvedOutput),
  antdComponents: stats.antdComponents,
  antdIcons: stats.antdIcons,
  tokens: {
    rootVarCount: stats.tokenVars,
    darkVarCount: stats.darkVars,
    cssFiles: cssFilesWritten,
  },
  srcFiles: stats.srcFiles,
  darkMode: {
    method: 'css-vars + aui3_1_dark class (antd darkAlgorithm removed in step 3)',
    darkClass: '.dark on <html> + aui3_1_dark on <body>',
  },
  i18nScenario: {
    scenario: i18nInfo.scenario,
    reactIntl: i18nInfo.reactIntl,
    i18next: i18nInfo.i18next,
    antdLocaleImports: i18nInfo.antdLocaleImports,
    antdLocaleFiles: i18nInfo.antdLocaleFiles,
    businessLocaleFiles: i18nInfo.businessLocaleFiles,
    hasDayjs: i18nInfo.hasDayjs,
    wired: i18nInfo.scenario === 'A' || i18nInfo.scenario === 'B',
  },
  verification: null,
  migrationPlan: null,
  notes: stats.scriptsExtracted
    ? `提取了 ${stats.scriptsExtracted} 个 script 块到 _extracted/，文件名为推断需人工核对`
    : '',
};

const handoffPath = path.join(resolvedOutput, '.umd-conversion.json');
fs.writeFileSync(handoffPath, JSON.stringify(handoff, null, 2) + '\n', 'utf8');
console.log(`[extract-umd] 交接文件: ${handoffPath}`);

// ========== 报告 ==========

console.log('');
console.log('=== extract-umd 报告 ===');
console.log(`  CSS 规则: :root=${stats.rootRules}, .dark=${stats.darkRules}, @font-face=${stats.fontRules}, @media=${stats.mediaRules}, other=${stats.otherRules}`);
console.log(`  Token 变量: ${stats.tokenVars} 个 (:root), ${stats.darkVars} 个 (.dark)`);
console.log(`  src/ 文件: ${stats.srcFiles.length} 个`);
console.log(`  antd 组件: ${Object.keys(stats.antdComponents).length} 个`);
console.log(`  antd 图标: ${stats.antdIcons.length} 个`);
console.log(`  i18n scenario: ${i18nInfo.scenario}${i18nInfo.scenario === 'A' ? '（硬编码，scaffold 已就绪）' : i18nInfo.scenario === 'B' ? '（react-intl，步骤 3 合并业务包）' : '（i18next，留下游决策）'}`);
if (stats.scriptsExtracted) console.log(`  提取 script 块: ${stats.scriptsExtracted} 个`);
console.log(`  交接文件: .umd-conversion.json`);

function guessFileName(content, index) {
  const firstLines = content.split('\n').slice(0, 5).join('\n');
  const commentMatch = firstLines.match(/(?:\/\/|\/\*|<!--)\s*@?([\w./-]+\.(?:jsx?|tsx?|mjs|cjs))\b/i);
  if (commentMatch) return commentMatch[1];
  const defaultExportMatch = content.match(/export\s+default\s+function\s+(\w+)/);
  if (defaultExportMatch) return defaultExportMatch[1] + '.jsx';
  const namedExportMatch = content.match(/export\s+function\s+(\w+)/);
  if (namedExportMatch) return namedExportMatch[1] + '.jsx';
  const constMatch = content.match(/(?:const|let|var)\s+(\w+)\s*=/);
  if (constMatch && !/^(useState|useEffect|import|require)$/.test(constMatch[1])) {
    const name = constMatch[1];
    return (/^[A-Z]/.test(name) ? name + '.jsx' : name + '.js');
  }
  const funcMatch = content.match(/function\s+(\w+)/);
  if (funcMatch) return funcMatch[1] + '.jsx';
  return `block-${String(index + 1).padStart(3, '0')}.jsx`;
}
