#!/usr/bin/env node

// 将 scaffold/ 预制骨架拷贝到目标工程根，并替换 package.json 的 name 和 index.html 的 title。
// 替代手动 cp -r + 手改两个字段，跨平台可用（不依赖 Unix cp）。
//
// 双 profile 支持（下游两条迁移路线共用本 skill 的工程标准化步骤）：
//   --profile eview-react  默认。scaffold/ 原样拷贝（@nce/eview-react 依赖 + aui3_1 CSS + src/shared 包壳）
//   --profile eview-ui     先拷 scaffold/，再用 scaffold-eview-ui/ 差异文件覆盖（package.json/main.jsx/
//                          index.html/app.jsx/base.css），并删除转发 @nce/eview-react 的 src/shared 包壳
//                          目录（保留 Icon shim 与 Cascader/Timeline 手写件）。产物直接衔接 antd-to-eview-ui，
//                          下游跳过「骨架换血」步骤。
//
// 用法：
//   node init-scaffold.cjs <目标工程根> [项目名] [标题] [--force] [--upgrade] [--profile <name>]
//
// 参数：
//   目标工程根  必需。不存在则自动创建；非空时需 --force 确认覆盖
//   项目名      可选。写入 package.json 的 name；缺省用目标目录名
//   标题        可选。写入 index.html 的 <title>；缺省用项目名
//   --force     覆盖非空目标目录
//   --upgrade   升级模式：跳过 src/styles/ 目录拷贝，保留已有 token CSS
//               （用于源项目已是标准 Vite 工程，如 umd-to-antd-vite 产物）
//   --profile   scaffold profile：eview-react（默认）或 eview-ui
//
// 示例：
//   node init-scaffold.cjs ./my-app my-app "我的应用"
//   node init-scaffold.cjs ./my-app my-app "我的应用" --profile eview-ui
//   node init-scaffold.cjs D:/projects/portal --force --upgrade

const fs = require('fs');
const path = require('path');

const scriptDir = path.dirname(__filename);
const scaffoldDir = path.join(scriptDir, '..', 'scaffold');
const overlayDir = path.join(scriptDir, '..', 'scaffold-eview-ui');

const targetRoot = process.argv[2];
const force = process.argv.includes('--force');
const upgrade = process.argv.includes('--upgrade');

// --profile <name> 或 --profile=<name>（默认 eview-react）
let profile = 'eview-react';
const pIdx = process.argv.indexOf('--profile');
if (pIdx !== -1 && process.argv[pIdx + 1] && !process.argv[pIdx + 1].startsWith('--')) {
  profile = process.argv[pIdx + 1];
} else {
  const eq = process.argv.find(a => a.startsWith('--profile='));
  if (eq) profile = eq.split('=')[1];
}
const PROFILES = ['eview-react', 'eview-ui'];
if (!PROFILES.includes(profile)) {
  console.error(`[init-scaffold] 未知 profile: ${profile}（可选：${PROFILES.join(' / ')}）`);
  process.exit(1);
}

// 位置参数：跳过 -- 开头的参数取前两个（项目名/标题）
const positional = process.argv.slice(2).filter(a => !a.startsWith('--') && a !== targetRoot);
const projectName = positional[0];
const title = positional[1];

if (!targetRoot || targetRoot === '--force' || targetRoot === '--upgrade') {
  console.error('[init-scaffold] 用法: node init-scaffold.cjs <目标工程根> [项目名] [标题] [--force] [--upgrade] [--profile <name>]');
  console.error('[init-scaffold] 示例: node init-scaffold.cjs ./my-app my-app "我的应用" --profile eview-ui');
  process.exit(1);
}

const resolvedTarget = path.resolve(targetRoot);
const resolvedName = projectName || path.basename(resolvedTarget);
const resolvedTitle = title || resolvedName;

if (!fs.existsSync(scaffoldDir)) {
  console.error(`[init-scaffold] scaffold 目录不存在: ${scaffoldDir}`);
  console.error('[init-scaffold] 脚本应位于 <skill目录>/scripts/ 下，scaffold/ 在上级目录');
  process.exit(1);
}
if (profile === 'eview-ui' && !fs.existsSync(overlayDir)) {
  console.error(`[init-scaffold] scaffold-eview-ui overlay 目录不存在: ${overlayDir}`);
  process.exit(1);
}

const skipDirs = new Set(['node_modules', '.git', 'dist']);

if (fs.existsSync(resolvedTarget)) {
  const entries = fs.readdirSync(resolvedTarget).filter(n => !skipDirs.has(n) && !n.startsWith('.'));
  if (entries.length > 0 && !force) {
    console.error(`[init-scaffold] 目标目录非空: ${resolvedTarget}`);
    console.error(`[init-scaffold] 已有文件: ${entries.slice(0, 5).join(', ')}${entries.length > 5 ? ' ...' : ''}`);
    console.error('[init-scaffold] 如确认覆盖，加 --force 参数');
    process.exit(1);
  }
}

// copyDir(baseDir)：从 baseDir 递归拷贝到目标根。
// --upgrade 时跳过 baseDir/src/styles（保留目标已有 token CSS）——base 与 overlay 拷贝都遵守。
function copyDir(src, dst, baseDir) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (skipDirs.has(name)) continue;
    const srcPath = path.join(src, name);
    const dstPath = path.join(dst, name);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      if (upgrade && name === 'styles' && src === path.join(baseDir, 'src')) {
        skippedStyles = true;
        continue;
      }
      copyDir(srcPath, dstPath, baseDir);
    } else {
      fs.copyFileSync(srcPath, dstPath);
      copiedCount++;
    }
  }
}

let copiedCount = 0;
let skippedStyles = false;
copyDir(scaffoldDir, resolvedTarget, scaffoldDir);

// eview-ui profile：overlay 差异文件覆盖 + 删除 eview-react 专属包壳
let removedShells = 0;
let overlayCount = 0;
if (profile === 'eview-ui') {
  const before = copiedCount;
  copyDir(overlayDir, resolvedTarget, overlayDir);
  overlayCount = copiedCount - before;

  // 转发 @nce/eview-react 的包壳目录（eview-ui 路线不需要——包依赖已不存在）
  const SHELL_DIRS = [
    'Select', 'TextField', 'InputSelect', 'MultipleSelect', 'SearchInput', 'TextArea',
    'DatePicker', 'Spinner', 'TreeSelector', 'TimePicker', 'Tag', 'Crumbs', 'IPInput',
    'Accordion',
  ];
  for (const d of SHELL_DIRS) {
    const p = path.join(resolvedTarget, 'src', 'shared', d);
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      removedShells++;
    }
  }
  // 保留：src/shared/Icon（图标 shim，两路线通用）、src/shared/Cascader、src/shared/Timeline（纯手写 antd 兼容件，无 @nce 依赖）
}

const pkgPath = path.join(resolvedTarget, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, ''));
  pkg.name = resolvedName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n', 'utf8');
}

const htmlPath = path.join(resolvedTarget, 'index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${resolvedTitle}</title>`);
  fs.writeFileSync(htmlPath, html, 'utf8');
}

console.log(`[init-scaffold] 拷贝完成: ${copiedCount} 个文件 -> ${resolvedTarget}（profile: ${profile}）`);
console.log(`[init-scaffold] package.json name = "${resolvedName}"`);
console.log(`[init-scaffold] index.html title = "${resolvedTitle}"`);
if (profile === 'eview-ui') {
  console.log(`[init-scaffold] eview-ui overlay 已应用（覆盖 ${overlayCount} 个差异文件，删除 ${removedShells} 个 eview-react 包壳目录）`);
  console.log('[init-scaffold] 保留：src/shared/Icon（图标 shim）、src/shared/Cascader、src/shared/Timeline（手写 antd 兼容件）');
  console.log('[init-scaffold] vite.config.js 已含 less 预处理配置（javascriptEnabled + TildeFileManager ~ 导入支持）；less 由 @cloudsop/eview-ui 传递依赖提供（无需显式 devDep）');
  console.log('[init-scaffold] 依赖：@cloudsop/eview-ui ^7.1.37 + @hui/design-token 保留 + .npmrc @cloudsop scope');
  console.log('[init-scaffold] TODO: main.jsx 的 eview-ui 全局样式 import 路径待内网确认（有占位注释，可能是 .less 文件）');
  console.log('[init-scaffold] TODO: .npmrc 的 @cloudsop scope 源路径按 @nce 同源推断，内网核对');
}
if (skippedStyles) {
  console.log('[init-scaffold] 升级模式：保留已有 src/styles/ 目录（token CSS 未覆盖）');
}
console.log('');
console.log('后续步骤:');
const cdPath = path.relative(process.cwd(), resolvedTarget) || '.';
console.log(`  cd ${cdPath}`);
console.log('  npm install');
