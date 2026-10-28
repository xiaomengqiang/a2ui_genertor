#!/usr/bin/env node

// extract-umd.cjs
// 从 ict-coder 产物的 UMD 单 HTML 工程提取内容到标准 Vite 工程结构：
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
  scriptsExtracted: 0, srcFiles: [],
  styleFiles: [],
  antdComponents: {}, antdIcons: [], iconCallSites: [],
  ipInputCallSites: { sharedFiles: [], imports: [], callSites: [] },
  chartCallSites: { sharedFiles: [], imports: [], callSites: [] },
  uploadsAssets: { copied: [], copiedCount: 0, pathRewrite: { from: './assets/uploads/', to: '/uploads/' } },
  // 源项目 CSS token 定义快照（供下游 check-token-drift.cjs 对照防 token 漂移）
  sourceCssTokens: {},
  // 源项目业务 CSS 写死色值快照（供下游 check-css.cjs 对照防色值漂移）
  sourceCssColors: {},
  // 源 antd 输入/包壳对应组件调用点的 style/className 快照（供下游 check-props-preserved.cjs 对照防迁移时丢失）
  inputPropCallSites: [],
};

// ========== 1. 从产物 assets/style/ 拷贝 4 层 CSS（ict-coder 已分好类：base/light/theme/dark） ==========
// ict-coder 的 style 五层（base/light/theme/dark/ant）已分文件存于产物 assets/style/，
// extract-umd 直接读这 4 个文件（ant.css 跳过，eview-react 用 aui3_1.css 替代），
// 不再从 index.page.html 内联 <style> 艰难按内容特征区分 :root 三层——分类 ict 已做好。

function copyStyleFiles() {
  const assetsStyleDir = path.join(sourceDir, 'assets', 'style');
  const stylesDir = path.join(resolvedOutput, 'src', 'styles');
  if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true });
  const cssFilesWritten = [];

  if (!fs.existsSync(assetsStyleDir)) {
    console.warn(`[extract-umd] 源项目无 assets/style/ 目录（ict-coder 标准产物应含此目录，含 base/light/theme/dark/ant 五层 CSS），跳过 CSS 拷贝；scaffold 空壳占位将保留`);
    return cssFilesWritten;
  }

  // base.css: @font-face 字体路径改写（../font/ | ./font/ | assets/font/ → /font/，Vite public 绝对路径）；
  // ./assets/uploads/ → /uploads/（图片资源由 §4.8 拷到 public/uploads/）；
  // append 到 scaffold 预制的 base.css（eview 专用样式 ev_no_wcag/ev_form_item 保留在前）
  const baseSrc = path.join(assetsStyleDir, 'base.css');
  if (fs.existsSync(baseSrc)) {
    let content = fs.readFileSync(baseSrc, 'utf8');
    content = content.replace(
      /url\(\s*['"]?(?:\.\.\/)*(?:\.\/)?(?:assets\/)?(font\/HarmonyOS_SansSC\/[^'")\s]+)['"]?\s*\)/g,
      "url('/$1')"
    );
    content = content.replace(/\.\/assets\/uploads\//g, '/uploads/');
    const baseDest = path.join(stylesDir, 'base.css');
    fs.appendFileSync(baseDest, `\n\n/* 以下从源项目 assets/style/base.css 拷贝（@font-face 字体路径已改写为 Vite /font/ 绝对路径，uploads 图片路径改写为 /uploads/） */\n\n${content}\n`, 'utf8');
    cssFilesWritten.push('src/styles/base.css');
    stats.styleFiles.push({ from: 'assets/style/base.css', to: 'src/styles/base.css' });
    console.log(`[extract-umd] base.css: 拷贝 + 路径改写（@font-face → /font/，uploads → /uploads/）`);
  }

  // light.css / theme.css / dark.css: 直接 write（覆盖 scaffold 空壳占位）
  for (const name of ['light.css', 'theme.css', 'dark.css']) {
    const src = path.join(assetsStyleDir, name);
    if (fs.existsSync(src)) {
      const content = fs.readFileSync(src, 'utf8');
      fs.writeFileSync(path.join(stylesDir, name), content, 'utf8');
      cssFilesWritten.push(`src/styles/${name}`);
      stats.styleFiles.push({ from: `assets/style/${name}`, to: `src/styles/${name}` });
      const varCount = (content.match(/--[a-zA-Z0-9-]+\s*:/g) || []).length;
      console.log(`[extract-umd] ${name}: 拷贝（${varCount} 个变量定义）`);
    }
  }

  // ant.css 跳过（eview-react 用 aui3_1.css 替代，不需 antd 组件换肤层）
  if (fs.existsSync(path.join(assetsStyleDir, 'ant.css'))) {
    console.log(`[extract-umd] ant.css: 跳过（eview-react 用 aui3_1.css 替代）`);
  }

  // 扫描 4 层 CSS 的 token 定义生成 sourceCssTokens 快照（供下游 check-token-drift.cjs 对照）
  for (const name of ['base.css', 'light.css', 'theme.css', 'dark.css']) {
    const src = path.join(assetsStyleDir, name);
    if (fs.existsSync(src)) {
      stats.sourceCssTokens[name] = extractCssTokens(fs.readFileSync(src, 'utf8'));
    }
  }

  return cssFilesWritten;
}

// 提取 CSS 内容中所有自定义属性定义（--xxx: value;）为 { name: value } 映射
// 逐行扫描：值取到第一个 ; （正确处理尾注释如 --x: 1rem; /* 10px */）
function extractCssTokens(cssContent) {
  const tokens = {};
  const lines = cssContent.split('\n');
  const declRe = /^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/;
  for (const line of lines) {
    const m = line.match(declRe);
    if (m) tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

const cssFilesWritten = copyStyleFiles();

// ========== 1.5 共享：收集扫描文件清单 ==========

// 收集所有待扫描的源文件：① 源项目根级文件（非递归——ict-coder 把 app.jsx 放在 preview/ 根目录，不在 src/ 里）
// ② src/ 下所有匹配文件（递归，跳过 node_modules/dist） ③ _extracted/ 下所有匹配文件（递归，跳过 node_modules/dist）
// extRegex: 文件扩展名正则，如 /\.(jsx?|tsx?)$/ 或 /\.(jsx?|tsx?|mjs)$/
function collectScanFiles(extRegex) {
  const entries = [];

  // ① 源项目根级文件（非递归——捕获 app.jsx 等根级入口文件）
  if (fs.existsSync(sourceDir)) {
    for (const name of fs.readdirSync(sourceDir)) {
      const full = path.join(sourceDir, name);
      if (fs.statSync(full).isFile() && extRegex.test(name)) {
        entries.push({ fullPath: full, relFile: name });
      }
    }
  }

  // ② src/ 递归
  const srcDir = path.join(sourceDir, 'src');
  if (fs.existsSync(srcDir)) {
    function walkSrc(dir) {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (name === 'node_modules' || name === 'dist') continue;
          walkSrc(full);
          continue;
        }
        if (!extRegex.test(name)) continue;
        entries.push({ fullPath: full, relFile: path.relative(sourceDir, full).replace(/\\/g, '/') });
      }
    }
    walkSrc(srcDir);
  }

  // ③ _extracted/ 递归
  const extractedDir = path.join(resolvedOutput, '_extracted');
  if (fs.existsSync(extractedDir)) {
    function walkExtracted(dir) {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (name === 'node_modules' || name === 'dist') continue;
          walkExtracted(full);
          continue;
        }
        if (!extRegex.test(name)) continue;
        entries.push({ fullPath: full, relFile: path.relative(sourceDir, full).replace(/\\/g, '/') });
      }
    }
    walkExtracted(extractedDir);
  }

  return entries;
}

// ========== 2. 检查源项目 src/ 目录 ==========

function listSrcFiles(baseDir) {
  const files = [];
  // 根级文件（非递归——app.jsx 在根目录，不在 src/ 里）
  if (fs.existsSync(baseDir)) {
    for (const name of fs.readdirSync(baseDir)) {
      const full = path.join(baseDir, name);
      if (fs.statSync(full).isFile() && /\.(jsx?|tsx?|json|css)$/.test(name)) {
        files.push(name);
      }
    }
  }
  // src/ 递归
  const srcDir = path.join(baseDir, 'src');
  if (fs.existsSync(srcDir)) {
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
  }
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

function scanAntdImports() {
  const components = {}; // componentName -> [relativeFiles]
  const icons = new Set();

  for (const { fullPath, relFile } of collectScanFiles(/\.(jsx?|tsx?)$/)) {
    const code = fs.readFileSync(fullPath, 'utf8');
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

  for (const { fullPath, relFile } of collectScanFiles(/\.(jsx?|tsx?|mjs)$/)) {
    const code = fs.readFileSync(fullPath, 'utf8');
    const name = path.basename(fullPath);

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

// ========== 4.6 扫描 <Icon name> 调用点（供下游 antd-to-eview-react 图标步骤预定位） ==========

function scanIconCallSites() {
  const callSites = [];

  for (const { fullPath, relFile } of collectScanFiles(/\.(jsx?|tsx?)$/)) {
    const code = fs.readFileSync(fullPath, 'utf8');

    const iconRe = /<Icon\b/g;
    let m;
    while ((m = iconRe.exec(code)) !== null) {
      const startPos = m.index;
      const window = code.slice(startPos, startPos + 300);
      const lineNum = code.slice(0, startPos).split('\n').length;

      const nameLitMatch = window.match(/name\s*=\s*["']([^"']+)["']/);
      const nameDynMatch = window.match(/name\s*=\s*\{([^}]+)\}/);

      let nameValue = null;
      let nameType = 'none';

      if (nameLitMatch) {
        nameValue = nameLitMatch[1];
        nameType = 'literal';
      } else if (nameDynMatch) {
        nameValue = nameDynMatch[1].trim();
        nameType = 'dynamic';
      }

      callSites.push({
        file: relFile,
        line: lineNum,
        name: nameValue,
        type: nameType,
      });
    }
  }

  return callSites;
}

stats.iconCallSites = scanIconCallSites();

if (stats.iconCallSites.length) {
  const literal = stats.iconCallSites.filter(s => s.type === 'literal').length;
  const dynamic = stats.iconCallSites.filter(s => s.type === 'dynamic').length;
  const noneName = stats.iconCallSites.filter(s => s.type === 'none').length;
  console.log(`[extract-umd] <Icon> 调用点: ${stats.iconCallSites.length} 处 (字面量=${literal}, 动态=${dynamic}, 无name=${noneName})`);
}

// ========== 4.6b 扫描源 antd 输入/包壳对应组件调用点的 style/className（供下游 check-props-preserved.cjs 对照） ==========

// 从 < 开始，找到当前标签结束（>），跳过字符串和 {} 表达式（防止溢出到下一个 JSX 元素）
// ⚠️ 此函数实现须与 antd-to-eview-react/scripts/check-props-preserved.cjs 的 tagWindow 保持一致
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

// antd 组件 → eview 家族映射（顺序敏感：Input.TextArea/Search/Password 必须在 bare Input 之前）
const INPUT_PROP_PATTERNS = [
  { re: /<Input\.TextArea\b/g, component: 'Input.TextArea', family: 'TextArea' },
  { re: /<Input\.Search\b/g, component: 'Input.Search', family: 'SearchInput' },
  { re: /<Input\.Password\b/g, component: 'Input.Password', family: 'TextField' },
  { re: /<Input\b(?=[\s/>])/g, component: 'Input', family: 'TextField' },
  { re: /<InputNumber\b/g, component: 'InputNumber', family: 'Spinner' },
  { re: /<Select\b/g, component: 'Select', family: 'Select' },
  { re: /<DatePicker\b/g, component: 'DatePicker', family: 'DatePicker' },
  { re: /<TimePicker\b/g, component: 'TimePicker', family: 'TimePicker' },
  { re: /<Cascader\b/g, component: 'Cascader', family: 'Cascader' },
  { re: /<TreeSelect\b/g, component: 'TreeSelect', family: 'TreeSelector' },
  { re: /<Tag\b/g, component: 'Tag', family: 'Tag' },
  { re: /<Steps\b/g, component: 'Steps', family: 'Steps' },
];

function scanInputPropCallSites() {
  const sites = [];
  for (const { fullPath, relFile } of collectScanFiles(/\.(jsx?|tsx?)$/)) {
    const code = fs.readFileSync(fullPath, 'utf8');
    for (const p of INPUT_PROP_PATTERNS) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(code)) !== null) {
        const startPos = m.index;
        const window = tagWindow(code, startPos);
        const lineNum = code.slice(0, startPos).split('\n').length;
        // 提取 style
        const styleLitM = window.match(/style\s*=\s*\{([^}]+)\}/);
        const hasStyle = !!styleLitM;
        const styleSource = styleLitM ? styleLitM[1].trim() : null;
        // 提取 className
        const classLitM = window.match(/className\s*=\s*["']([^"']+)["']/);
        const classDynM = window.match(/className\s*=\s*\{([^}]+)\}/);
        const hasClassName = !!(classLitM || classDynM);
        const classNameValue = classLitM ? classLitM[1] : (classDynM ? classDynM[1].trim() : null);
        sites.push({
          file: relFile, line: lineNum,
          component: p.component, family: p.family,
          hasStyle, styleSource, hasClassName, classNameValue,
        });
      }
    }
  }
  return sites;
}
stats.inputPropCallSites = scanInputPropCallSites();
if (stats.inputPropCallSites.length) {
  const withStyle = stats.inputPropCallSites.filter(s => s.hasStyle).length;
  const withClass = stats.inputPropCallSites.filter(s => s.hasClassName).length;
  console.log(`[extract-umd] 输入组件 style/className 快照: ${stats.inputPropCallSites.length} 处 (带style=${withStyle}, 带className=${withClass})`);
}

// ========== 4.6c 扫描源业务 CSS 写死色值（供下游 check-css.cjs 对照防色值漂移） ==========

// 色值提取逻辑须与 antd-to-eview-react/scripts/check-css.cjs 的 extractColorsFromCss 保持一致
// （hex 规范化小写；rgb/rgba/hsl/hsla 去空格规范化；跳过 var() 行的 fallback；跳过变量定义行 --xxx:；跳过 url(#...)）
function stripCssCommentsKeepLines(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}
function isVarDeclLine(line) {
  return /^\s*--[A-Za-z0-9-]+\s*:/.test(line);
}
function extractColorsFromCssFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const text = stripCssCommentsKeepLines(raw);
  const lines = text.split('\n');
  const colors = [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const lineNo = i + 1;
    if (!ln.trim()) continue;
    if (isVarDeclLine(ln)) continue; // 变量定义行 --xxx: #value 是定义，不是写死使用
    if (/\bvar\s*\(/.test(ln)) continue; // var() 行的色值视为 fallback，不计入硬色值快照
    let m;
    const hexRe = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
    while ((m = hexRe.exec(ln)) !== null) {
      const before = ln.slice(Math.max(0, m.index - 6), m.index);
      if (/url\s*\(\s*['"]?$/.test(before)) continue; // 排除 url(#...)
      colors.push({ line: lineNo, value: m[0].toLowerCase() });
    }
    const funcRe = /\b(rgba?|hsla?)\s*\(([^)]*)\)/g;
    while ((m = funcRe.exec(ln)) !== null) {
      const norm = (m[1] + '(' + m[2].replace(/\s+/g, '') + ')').toLowerCase();
      colors.push({ line: lineNo, value: norm });
    }
  }
  return colors;
}
function scanSourceCssColors() {
  const result = {};
  for (const { fullPath, relFile } of collectScanFiles(/\.css$/)) {
    // 路径规范化：去 src/ 前缀（与产物 check-css.cjs 的 normFile 一致）
    let normFile = relFile.replace(/^\.?\/?src\//, '');
    // 排除产物 scaffold 专属层
    if (normFile.startsWith('styles/') || normFile.startsWith('shared/')) continue;
    const colors = extractColorsFromCssFile(fullPath);
    if (colors.length) result[normFile] = colors;
  }
  return result;
}
stats.sourceCssColors = scanSourceCssColors();
{
  const fileCount = Object.keys(stats.sourceCssColors).length;
  const colorCount = Object.values(stats.sourceCssColors).reduce((s, a) => s + a.length, 0);
  if (colorCount) console.log(`[extract-umd] 业务 CSS 写死色值快照: ${colorCount} 处 (跨 ${fileCount} 个文件)`);
}

// ========== 4.7 扫描 IPInput 调用点（ict-coder 手写共享件，非 antd 导入，extract-umd 默认扫不到） ==========

function scanIpInputCallSites() {
  const result = { sharedFiles: [], imports: [], callSites: [] };

  // 1) 检测源项目里的手写 IPInput 共享件（assets/shared/ip-input.jsx 等常见位置 + src/components/ip-input/）
  const candidates = [
    'assets/shared/ip-input.jsx',
    'assets/shared/IpInput.jsx',
    'assets/shared/IPInput.jsx',
  ];
  for (const rel of candidates) {
    if (fs.existsSync(path.join(sourceDir, rel))) result.sharedFiles.push(rel);
  }
  const ipInputComponentDir = path.join(sourceDir, 'src/components/ip-input');
  if (fs.existsSync(ipInputComponentDir)) {
    for (const name of fs.readdirSync(ipInputComponentDir)) {
      if (/\.jsx?$/.test(name)) result.sharedFiles.push(`src/components/ip-input/${name}`);
    }
  }

  // 2) 扫 imports 与 <IpInput>/<IPInput> 调用点（根级 + src/ + _extracted/，collectScanFiles 统一收集）
  for (const { fullPath, relFile } of collectScanFiles(/\.(jsx?|tsx?)$/)) {
    const code = fs.readFileSync(fullPath, 'utf8');

    // import IpInput from ".../assets/shared/ip-input.jsx" 或 .../components/ip-input
    const importRe = /import\s+(\w+)\s+from\s+['"]([^'"]*(?:assets\/shared\/ip-input|components\/ip-input)[^'"]*)['"]/gi;
    let im;
    while ((im = importRe.exec(code)) !== null) {
      result.imports.push({ file: relFile, importName: im[1], source: im[2] });
    }

    // <IpInput ...> 或 <IPInput ...>（ict-coder 产物函数名为 IpInput）
    const callRe = /<(IpInput|IPInput)\b/g;
    let cm;
    while ((cm = callRe.exec(code)) !== null) {
      const startPos = cm.index;
      const lineNum = code.slice(0, startPos).split('\n').length;
      const window = code.slice(startPos, startPos + 300);
      const propsMatch = window.match(/^<(?:IpInput|IPInput)\s*([^>]*)/);
      const propsStr = propsMatch ? propsMatch[1].trim() : '';
      result.callSites.push({ file: relFile, line: lineNum, component: cm[1], props: propsStr });
    }
  }

  return result;
}

stats.ipInputCallSites = scanIpInputCallSites();

if (stats.ipInputCallSites.callSites.length) {
  console.log(`[extract-umd] <IpInput> 调用点: ${stats.ipInputCallSites.callSites.length} 处, import 来源: ${stats.ipInputCallSites.imports.length} 处, 手写共享件: ${stats.ipInputCallSites.sharedFiles.length} 个`);
}

// ========== 4.8 拷贝 assets/uploads/ 图片资源到 public/uploads/（scaffold public/ 预置 font/，无 uploads/） ==========
// ict-coder 把图片放在 assets/uploads/，UMD 用相对路径 ./assets/uploads/xxx 引用。
// Vite 工程下这些路径会断，需：① 整目录拷到 public/uploads/；② JSX/CSS 里的 ./assets/uploads/xxx 改写成 /uploads/xxx。
// 本步做①（拷贝）+ 记录 pathRewrite 规则到 .umd-conversion.json（供步骤 3 子 agent 改 JSX 路径）；
// CSS 改写已在上文 §1 buckets 生成后统一完成（CSS 文件由 extract-umd 写、子 agent 不碰）。

function copyUploadsAssets() {
  const result = { copied: [], copiedCount: 0, pathRewrite: { from: './assets/uploads/', to: '/uploads/' } };
  const srcUploadsDir = path.join(sourceDir, 'assets', 'uploads');
  if (!fs.existsSync(srcUploadsDir)) {
    console.log('[extract-umd] 源项目无 assets/uploads/ 目录，跳过图片资源拷贝');
    return result;
  }
  const destUploadsDir = path.join(resolvedOutput, 'public', 'uploads');
  let copiedCount = 0;
  function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      const srcFull = path.join(src, name);
      const destFull = path.join(dest, name);
      const stat = fs.statSync(srcFull);
      if (stat.isDirectory()) {
        copyDir(srcFull, destFull);
      } else {
        fs.copyFileSync(srcFull, destFull);
        copiedCount++;
        result.copied.push(path.relative(srcUploadsDir, srcFull).replace(/\\/g, '/'));
      }
    }
  }
  copyDir(srcUploadsDir, destUploadsDir);
  result.copiedCount = copiedCount;
  return result;
}

stats.uploadsAssets = copyUploadsAssets();

if (stats.uploadsAssets.copiedCount) {
  console.log(`[extract-umd] 拷贝 assets/uploads/ 图片资源: ${stats.uploadsAssets.copiedCount} 个文件 → public/uploads/`);
}

// ========== 4.9 扫描 Chart 调用点（ict-coder 内置图表共享件，非 antd 导入，extract-umd 默认扫不到） ==========

function scanChartCallSites() {
  const result = { sharedFiles: [], imports: [], callSites: [] };

  // 1) 检测源项目里的 Chart 共享件（assets/shared/chart.jsx 等常见位置 + src/components/chart/）
  const candidates = [
    'assets/shared/chart.jsx',
    'assets/shared/Chart.jsx',
  ];
  for (const rel of candidates) {
    if (fs.existsSync(path.join(sourceDir, rel))) result.sharedFiles.push(rel);
  }
  const chartComponentDir = path.join(sourceDir, 'src/components/chart');
  if (fs.existsSync(chartComponentDir)) {
    for (const name of fs.readdirSync(chartComponentDir)) {
      if (/\.jsx?$/.test(name)) result.sharedFiles.push(`src/components/chart/${name}`);
    }
  }

  // 2) 扫 imports 与 <Chart name> 调用点（根级 + src/ + _extracted/，collectScanFiles 统一收集）
  for (const { fullPath, relFile } of collectScanFiles(/\.(jsx?|tsx?)$/)) {
    const code = fs.readFileSync(fullPath, 'utf8');

    // import Chart from ".../assets/shared/chart.jsx" 或 .../components/chart
    const importRe = /import\s+(\w+)\s+from\s+['"]([^'"]*(?:assets\/shared\/chart|components\/chart)[^'"]*)['"]/gi;
    let im;
    while ((im = importRe.exec(code)) !== null) {
      result.imports.push({ file: relFile, importName: im[1], source: im[2] });
    }

    // <Chart name="..." ...> 调用点（ict-coder 产物函数名为 Chart）
    const callRe = /<Chart\b/g;
    let cm;
    while ((cm = callRe.exec(code)) !== null) {
      const startPos = cm.index;
      const window = code.slice(startPos, startPos + 300);
      const lineNum = code.slice(0, startPos).split('\n').length;

      const nameLitMatch = window.match(/name\s*=\s*["']([^"']+)["']/);
      const nameDynMatch = window.match(/name\s*=\s*\{([^}]+)\}/);

      let nameValue = null;
      let nameType = 'none';

      if (nameLitMatch) {
        nameValue = nameLitMatch[1];
        nameType = 'literal';
      } else if (nameDynMatch) {
        nameValue = nameDynMatch[1].trim();
        nameType = 'dynamic';
      }

      result.callSites.push({
        file: relFile,
        line: lineNum,
        name: nameValue,
        type: nameType,
      });
    }
  }

  return result;
}

stats.chartCallSites = scanChartCallSites();

if (stats.chartCallSites.callSites.length) {
  const literal = stats.chartCallSites.callSites.filter(s => s.type === 'literal').length;
  const dynamic = stats.chartCallSites.callSites.filter(s => s.type === 'dynamic').length;
  const noneName = stats.chartCallSites.callSites.filter(s => s.type === 'none').length;
  console.log(`[extract-umd] <Chart> 调用点: ${stats.chartCallSites.callSites.length} 处 (字面量=${literal}, 动态=${dynamic}, 无name=${noneName}), import 来源: ${stats.chartCallSites.imports.length} 处, 共享件: ${stats.chartCallSites.sharedFiles.length} 个`);
}

// ========== 5. 生成 .umd-conversion.json 交接文件 ==========

const handoff = {
  skill: 'umd-to-antd-vite',
  version: '1.0',
  sourceFile: sourceBaseName,
  projectName: path.basename(resolvedOutput),
  antdComponents: stats.antdComponents,
  antdIcons: stats.antdIcons,
  iconCallSites: stats.iconCallSites,
  inputPropCallSites: stats.inputPropCallSites,
  ipInputCallSites: stats.ipInputCallSites,
  chartCallSites: stats.chartCallSites,
  uploadsAssets: stats.uploadsAssets,
  styles: {
    source: 'assets/style',
    files: stats.styleFiles,
    cssFiles: cssFilesWritten,
  },
  // 源项目 CSS token 定义快照（4 层 CSS 的 --xxx: value 定义）
  sourceCssTokens: stats.sourceCssTokens,
  // 源项目业务 CSS 写死色值快照（每文件按出现顺序的色值列表）
  sourceCssColors: stats.sourceCssColors,
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
console.log(`  CSS 文件: ${cssFilesWritten.length} 个 (${cssFilesWritten.join(', ')})`);
console.log(`  src/ 文件: ${stats.srcFiles.length} 个`);
console.log(`  antd 组件: ${Object.keys(stats.antdComponents).length} 个`);
console.log(`  antd 图标: ${stats.antdIcons.length} 个`);
  console.log(`  Icon 调用点: ${stats.iconCallSites.length} 处`);
  if (stats.ipInputCallSites.callSites.length) {
    console.log(`  IPInput 调用点: ${stats.ipInputCallSites.callSites.length} 处 (手写共享件: ${stats.ipInputCallSites.sharedFiles.length} 个, import 来源: ${stats.ipInputCallSites.imports.length} 处)`);
  }
  if (stats.chartCallSites.callSites.length) {
    console.log(`  Chart 调用点: ${stats.chartCallSites.callSites.length} 处 (共享件: ${stats.chartCallSites.sharedFiles.length} 个, import 来源: ${stats.chartCallSites.imports.length} 处)`);
  }
  if (stats.uploadsAssets.copiedCount) {
    console.log(`  uploads 图片资源: ${stats.uploadsAssets.copiedCount} 个文件 → public/uploads/ (pathRewrite: ${stats.uploadsAssets.pathRewrite.from} → ${stats.uploadsAssets.pathRewrite.to})`);
  }
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
