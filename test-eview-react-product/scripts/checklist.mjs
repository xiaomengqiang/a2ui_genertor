#!/usr/bin/env node
// 静态清单检查：按 references/test-checklist.md 跑 grep 驱动的 30+ 条断言
// 用法：node checklist.mjs <PRODUCT_PATH>
// 输出：<PRODUCT_PATH>/.checklist-result.json
//
// 纯 node fs + regex，跨平台不依赖系统 grep。

import fs from 'fs';
import path from 'path';

const productRoot = path.resolve(process.argv[2] || process.cwd());
const srcRoot = path.join(productRoot, 'src');

const srcExts = ['.js', '.jsx', '.ts', '.tsx'];
const srcFiles = [];
const cssFiles = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
      walk(full);
    } else {
      const ext = path.extname(name);
      const rel = path.relative(productRoot, full).replace(/\\/g, '/');
      if (srcExts.includes(ext)) {
        srcFiles.push({ abs: full, rel, content: fs.readFileSync(full, 'utf8') });
      } else if (ext === '.css') {
        cssFiles.push({ abs: full, rel, content: fs.readFileSync(full, 'utf8') });
      }
    }
  }
}
walk(srcRoot);

function grepInFiles(files, re) {
  const hits = [];
  for (const f of files) {
    const lines = f.content.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (re.test(line)) hits.push({ file: f.rel, line: i + 1, text: line.trim() });
    });
  }
  return hits;
}

function readFile(rel) {
  const p = path.join(productRoot, rel);
  if (!fs.existsSync(p)) return null;
  return { abs: p, rel, content: fs.readFileSync(p, 'utf8') };
}

function hitsDetail(hits, msg) {
  return hits.map(h => `${h.file}:${h.line} ${msg}`).join('; ');
}

// 负向检查工厂：正则匹配 = 失败
function neg(id, category, severity, re, failMsg) {
  return {
    id, category, severity,
    run: () => {
      const hits = grepInFiles(srcFiles, re);
      return { passed: hits.length === 0, detail: hits.length ? hitsDetail(hits, failMsg) : '' };
    }
  };
}

const checks = [
  // === 0. 项目骨架完整性类（阻断，前置门） ===
  // 各条独立跑，不互相短路；任一失败 → 跳过后续 import/api/mode/style。
  {
    id: 'package-json-exists', category: 'structure', severity: 'block',
    run: () => {
      const f = readFile('package.json');
      return { passed: !!f, detail: f ? '' : 'package.json 未找到（工程根缺失）' };
    }
  },
  {
    id: 'package-json-react-dep', category: 'structure', severity: 'block',
    run: () => {
      const f = readFile('package.json');
      if (!f) return { passed: false, detail: 'package.json 未找到' };
      let pkg;
      try { pkg = JSON.parse(f.content); } catch { return { passed: false, detail: 'package.json 非合法 JSON' }; }
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      const ok = 'react' in deps || 'react-dom' in deps;
      return { passed: ok, detail: ok ? '' : 'package.json 缺 react / react-dom 依赖' };
    }
  },
  {
    id: 'package-json-eview-dep', category: 'structure', severity: 'block',
    run: () => {
      const f = readFile('package.json');
      if (!f) return { passed: false, detail: 'package.json 未找到' };
      let pkg;
      try { pkg = JSON.parse(f.content); } catch { return { passed: false, detail: 'package.json 非合法 JSON' }; }
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      const ok = Object.keys(deps).some(k => k.startsWith('@nce/') || k.startsWith('@cloudsop/') || k.startsWith('@hui/'));
      return { passed: ok, detail: ok ? '' : 'package.json 缺 @nce/* / @cloudsop/* / @hui/* 依赖（eview-react 未接入）' };
    }
  },
  {
    id: 'package-json-scripts', category: 'structure', severity: 'block',
    run: () => {
      const f = readFile('package.json');
      if (!f) return { passed: false, detail: 'package.json 未找到' };
      let pkg;
      try { pkg = JSON.parse(f.content); } catch { return { passed: false, detail: 'package.json 非合法 JSON' }; }
      const scripts = pkg.scripts || {};
      const missing = [];
      if (!scripts.build) missing.push('build');
      if (!scripts.dev) missing.push('dev');
      return { passed: missing.length === 0, detail: missing.length ? `package.json scripts 缺 ${missing.join(', ')}` : '' };
    }
  },
  {
    id: 'entry-file-exists', category: 'structure', severity: 'block',
    run: () => {
      const f = readFile('src/main.jsx') || readFile('src/main.tsx') || readFile('src/main.js')
        || readFile('src/index.jsx') || readFile('src/index.tsx') || readFile('src/index.js');
      return { passed: !!f, detail: f ? '' : '入口文件未找到（src/main.{jsx,tsx,js} 或 src/index.{jsx,tsx,js}）' };
    }
  },
  {
    id: 'index-html-exists', category: 'structure', severity: 'block',
    run: () => {
      const f = readFile('index.html') || readFile('public/index.html');
      return { passed: !!f, detail: f ? '' : 'index.html 未找到（根目录或 public/）' };
    }
  },
  {
    id: 'build-config-exists', category: 'structure', severity: 'block',
    run: () => {
      const candidates = ['vite.config.js', 'vite.config.ts', 'vite.config.mjs', 'vite.config.cjs', 'webpack.config.js', 'webpack.config.ts'];
      const found = candidates.find(c => readFile(c));
      return { passed: !!found, detail: found ? '' : '构建配置未找到（vite.config.{js,ts,mjs,cjs} 或 webpack.config.{js,ts}）' };
    }
  },

  // === 1. import 类（阻断） ===
  neg('no-antd-import', 'import', 'block', /from\s+['"]antd['"]|require\(['"]antd['"]\)/, '仍从 antd 导入（应删除）'),
  neg('no-antd-locale', 'import', 'block', /from\s+['"]antd\/locale/, '仍用 antd locale（应换 @nce/eview-react/locales）'),
  neg('no-antd-icons', 'import', 'block', /from\s+['"]@ant-design\/icons['"]/, '仍用 @ant-design/icons（应换 @nce/icon-plus）'),
  neg('eview-import-path', 'import', 'block', /from\s+['"]@nce\/eview-react['"]/, '用命名导入（应为 @nce/eview-react/<Component> 默认导入）'),
  {
    id: 'no-src-prefix-in-src', category: 'import', severity: 'block',
    run: () => {
      const re = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"]\.\/src\//;
      const hits = grepInFiles(srcFiles, re);
      return { passed: hits.length === 0, detail: hits.length ? hitsDetail(hits, 'src 内不应写 ./src/（应为 ./）') : '' };
    }
  },
  {
    id: 'css-imports-in-entry', category: 'import', severity: 'block',
    run: () => {
      const f = readFile('src/main.jsx') || readFile('src/main.tsx') || readFile('src/main.js');
      if (!f) return { passed: false, detail: 'src/main.{jsx,tsx,js} 未找到' };
      const need = ['aui3_1.css', 'base.css', 'tokens.css', 'theme-dark.css'];
      const missing = need.filter(n => !f.content.includes(n));
      return { passed: missing.length === 0, detail: missing.length ? `main 缺 import: ${missing.join(', ')}` : '' };
    }
  },

  // === 2. API 命名类（硬失败） ===
  neg('button-status', 'api', 'fail', /<Button\b[^>]*\btype=/, 'Button 用 type（应为 status）'),
  neg('select-defaultLabel', 'api', 'fail', /<Select\b[^>]*\bplaceholder=/, 'Select 用 placeholder（应为 defaultLabel）'),
  neg('toggle-toggled', 'api', 'fail', /<Toggle\b[^>]*\bchecked=/, 'Toggle 用 checked（应为 toggled）'),
  neg('toggle-onToggle', 'api', 'fail', /<Toggle\b[^>]*\bonChange=/, 'Toggle 用 onChange（应为 onToggle）'),
  neg('toggle-taggled-children', 'api', 'fail', /\btoggledChildren/, '用 toggledChildren（应为 taggledChildren，官方拼错）'),
  neg('crumbs-seprator', 'api', 'fail', /<Crumbs\b[^>]*\bseparator=/, 'Crumbs 用 separator（应为 seprator，官方拼错）'),
  neg('selectcard-disable', 'api', 'fail', /<SelectCard\b[^>]*\bdisabled=/, 'SelectCard 用 disabled（应为 disable）'),
  neg('fileupload-disable', 'api', 'fail', /<FileUpload\b[^>]*\bdisabled=/, 'FileUpload 用 disabled（应为 disable）'),
  neg('dialog-isOpen', 'api', 'fail', /<Dialog\b[^>]*\bopen=(?!isOpen)/, 'Dialog 用 open（应为 isOpen）'),
  neg('drawer-visible', 'api', 'fail', /<Drawer\b[^>]*\bopen=/, 'Drawer 用 open（应为 visible）'),
  neg('loading-isOpen', 'api', 'fail', /<Loading\b[^>]*\bspinning=/, 'Loading 用 spinning（应为 isOpen）'),
  neg('steps-currentStep', 'api', 'fail', /<Steps\b[^>]*\bcurrent=(?!Step)/, 'Steps 用 current（应为 currentStep）'),
  neg('badge-content', 'api', 'fail', /<Badge\b[^>]*\bcount=/, 'Badge 用 count（应为 content）'),
  neg('tag-no-closable', 'api', 'fail', /<Tag\b[^>]*\bclosable/, 'Tag 用 closable（eview-react 无，靠数组删）'),
  neg('table-dataset', 'api', 'fail', /<Table\b[^>]*\bdataSource=/, 'Table 用 dataSource（应为 dataset）'),
  neg('table-keyIndex', 'api', 'fail', /<Table\b[^>]*\browKey=/, 'Table 用 rowKey（应为 keyIndex）'),
  neg('table-key-in-columns', 'api', 'fail', /\bdataIndex:/, 'columns 用 dataIndex（应为 key）'),

  // === 3. 模式转换类（硬失败） ===
  neg('form-ref-not-useForm', 'mode', 'fail', /Form\.useForm\(/, '用 Form.useForm()（应为 useRef(null)）'),
  neg('form-no-validateFields', 'mode', 'fail', /\.validateFields\(/, '用 validateFields()（应为 ref.submit() + onSuccess）'),
  neg('form-no-onFinish', 'mode', 'fail', /\bonFinish=/, '用 onFinish（应为 onSuccess）'),
  neg('message-imperial-gone', 'mode', 'fail', /\bmessage\.(success|error|info|warning|loading)\(/, '用命令式 message（应用 <DivMessage>）'),
  neg('popconfirm-to-messagedialog', 'mode', 'fail', /<Popconfirm/, '用 Popconfirm（应换 MessageDialog type=confirm）'),

  // === 4. 样式与入口类（硬失败） ===
  {
    id: 'body-aui3_1', category: 'style', severity: 'fail',
    run: () => {
      const f = readFile('index.html');
      if (!f) return { passed: false, detail: 'index.html 未找到' };
      const ok = /<body[^>]*\baui3_1\b/.test(f.content);
      return { passed: ok, detail: ok ? '' : 'index.html <body> 缺 aui3_1 类' };
    }
  },
  {
    id: 'body-ev-no-wcag', category: 'style', severity: 'fail',
    run: () => {
      const f = readFile('index.html');
      if (!f) return { passed: false, detail: 'index.html 未找到' };
      const ok = /<body[^>]*\bev_no_wcag\b/.test(f.content);
      return { passed: ok, detail: ok ? '' : 'index.html <body> 缺 ev_no_wcag 类' };
    }
  },
  {
    id: 'config-provider-present', category: 'style', severity: 'fail',
    run: () => {
      const f = readFile('src/main.jsx') || readFile('src/main.tsx') || readFile('src/main.js');
      if (!f) return { passed: false, detail: '入口文件未找到' };
      const ok = /<ConfigProvider/.test(f.content);
      return { passed: ok, detail: ok ? '' : '入口缺 <ConfigProvider>' };
    }
  },
  {
    id: 'intl-provider-present', category: 'style', severity: 'fail',
    run: () => {
      const f = readFile('src/main.jsx') || readFile('src/main.tsx') || readFile('src/main.js');
      if (!f) return { passed: false, detail: '入口文件未找到' };
      const ok = /IntlProvider/.test(f.content) && /componentsLocales/.test(f.content);
      return { passed: ok, detail: ok ? '' : '入口缺 IntlProvider + componentsLocales' };
    }
  },
  {
    id: 'dark-useeffect-two-classes', category: 'style', severity: 'fail',
    run: () => {
      const candidates = srcFiles.filter(f => /aui3_1_dark/.test(f.content));
      if (candidates.length === 0) return { passed: false, detail: '未找到 aui3_1_dark 切换逻辑' };
      const ok = candidates.some(f =>
        /classList[^;]*aui3_1_dark/.test(f.content) &&
        /classList[^;]*\bdark['"]?\s*,/.test(f.content) &&
        /documentElement|document\.body/.test(f.content)
      );
      return { passed: ok, detail: ok ? '' : '未同时切换 aui3_1_dark(body) + dark(html)' };
    }
  },
  {
    id: 'dark-on-body-not-root', category: 'style', severity: 'fail',
    run: () => {
      const candidates = srcFiles.filter(f => /aui3_1_dark/.test(f.content));
      if (candidates.length === 0) return { passed: false, detail: '未找到 aui3_1_dark 切换逻辑' };
      const wrongOnRoot = candidates.some(f => /querySelector\(['"]\.root['"]\)[^;]*aui3_1_dark/.test(f.content));
      if (wrongOnRoot) return { passed: false, detail: 'aui3_1_dark 挂 .root（应挂 <body>）' };
      const onBody = candidates.some(f => /document\.body\.classList[^;]*aui3_1_dark/.test(f.content));
      return { passed: onBody, detail: onBody ? '' : 'aui3_1_dark 未挂 document.body（应挂 <body>）' };
    }
  },
  {
    id: 'no-dead-color-in-css', category: 'style', severity: 'fail',
    run: () => {
      const componentCss = cssFiles.filter(f => !/\/styles\/(tokens|theme-dark)\.css$/.test(f.rel));
      const re = /#[0-9a-fA-F]{3,8}\b/;
      const hits = grepInFiles(componentCss, re);
      return { passed: hits.length === 0, detail: hits.length ? hitsDetail(hits, '写死色值（应用 var(--*)）') : '' };
    }
  },
  neg('no-ev-class-prefix', 'style', 'fail', /className=['"][^'"]*\bev_(?!no_wcag)/, '业务类名用 ev_ 前缀（应用业务前缀如 app-）'),
  neg('clickable-is-button', 'style', 'fail', /<div\b[^>]*\bonClick=/, 'div 挂 onClick（应用 <button type=button>）'),

  // === 5. 回调签名类（警告，不计入 failed） ===
  neg('no-etarget-value', 'callback', 'warn', /e\.target\.(value|checked)/, '用 e.target.value（eview-react 首参是 value）'),
];

// 执行：structure 类先跑（各条独立，不互相短路），任一失败 → 跳过后续 import/api/mode/style
const results = [];
let structureFailed = false;
for (const c of checks) {
  if (c.category !== 'structure') continue;
  const r = c.run();
  results.push({ id: c.id, category: c.category, severity: c.severity, passed: r.passed, detail: r.detail });
  if (!r.passed) structureFailed = true;
}
let blockNext = structureFailed;
for (const c of checks) {
  if (c.category === 'structure') continue;
  if (blockNext && c.severity !== 'warn') {
    results.push({ id: c.id, category: c.category, severity: c.severity, passed: false, skipped: true, detail: structureFailed ? '因骨架检查未过跳过' : '因前序 import 错误跳过' });
    continue;
  }
  const r = c.run();
  results.push({ id: c.id, category: c.category, severity: c.severity, passed: r.passed, detail: r.detail });
  if (!r.passed && c.severity === 'block') blockNext = true;
}

const summary = {
  total: results.length,
  passed: results.filter(r => r.passed).length,
  failed: results.filter(r => !r.passed && !r.skipped && r.severity !== 'warn').length,
  warnings: results.filter(r => !r.passed && r.severity === 'warn').length,
  blockNext,
};

const out = { summary, checks: results };
fs.writeFileSync(path.join(productRoot, '.checklist-result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(summary));
