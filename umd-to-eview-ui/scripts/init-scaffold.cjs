#!/usr/bin/env node

// 将 scaffold/ 预制 eview-ui 骨架拷贝到目标工程根，并替换 package.json 的 name 和 index.html 的 title。
// 替代手动 cp -r + 手改两个字段，跨平台可用（不依赖 Unix cp）。
//
// scaffold 已是 eview-ui 形态（由 umd-to-antd-vite 的 scaffold + scaffold-eview-ui overlay 预合并而来，
// @nce/eview-react 包壳已剔除，仅保留 src/shared/Icon 图标 shim 与 src/shared/Cascader 手写件）——
// 等价于原 umd-to-antd-vite `init-scaffold.cjs --profile eview-ui` 的产物。
//
// 用法：
//   node init-scaffold.cjs <目标工程根> [项目名] [标题] [--force] [--upgrade]
//
// 参数：
//   目标工程根  必需。不存在则自动创建；非空时需 --force 确认覆盖
//   项目名      可选。写入 package.json 的 name；缺省用目标目录名
//   标题        可选。写入 index.html 的 <title>；缺省用项目名
//   --force     覆盖非空目标目录
//   --upgrade   升级模式：跳过 src/styles/ 目录拷贝，保留已有 token CSS
//               （用于源项目已是标准 Vite 工程）
//
// 示例：
//   node init-scaffold.cjs ./my-app my-app "我的应用"
//   node init-scaffold.cjs D:/projects/portal --force --upgrade

const fs = require('fs');
const path = require('path');

const scriptDir = path.dirname(__filename);
const scaffoldDir = path.join(scriptDir, '..', 'scaffold');

const targetRoot = process.argv[2];
const force = process.argv.includes('--force');
const upgrade = process.argv.includes('--upgrade');

// 位置参数：跳过 -- 开头的参数取前两个（项目名/标题）
const positional = process.argv.slice(2).filter(a => !a.startsWith('--') && a !== targetRoot);
const projectName = positional[0];
const title = positional[1];

if (!targetRoot || targetRoot === '--force' || targetRoot === '--upgrade') {
  console.error('[init-scaffold] 用法: node init-scaffold.cjs <目标工程根> [项目名] [标题] [--force] [--upgrade]');
  console.error('[init-scaffold] 示例: node init-scaffold.cjs ./my-app my-app "我的应用"');
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

// copyDir(src)：递归拷贝到目标根。--upgrade 时跳过 src/styles（保留目标已有 token CSS）。
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

console.log(`[init-scaffold] 拷贝完成: ${copiedCount} 个文件 -> ${resolvedTarget}（eview-ui 骨架）`);
console.log(`[init-scaffold] package.json name = "${resolvedName}"`);
console.log(`[init-scaffold] index.html title = "${resolvedTitle}"`);
console.log('[init-scaffold] 已含：@cloudsop/eview-ui ^7.1.37 + @hui/design-token 依赖、.npmrc @cloudsop scope、ThemeProvider 黑白主题切换（src/theme）、body 首帧 eviewui_aui3_1_default + data-theme=default 防闪');
console.log('[init-scaffold] 保留：src/shared/Icon（图标 shim）、src/shared/Cascader（手写 antd 兼容件）');
console.log('[init-scaffold] vite.config.js 已含 less 预处理配置（javascriptEnabled + TildeFileManager ~ 导入支持）；less 由 @cloudsop/eview-ui 传递依赖提供（无需显式 devDep）');
console.log('[init-scaffold] TODO: main.jsx 的 eview-ui 全局样式 import 路径待内网确认（有占位注释，可能是 .less 文件）');
console.log('[init-scaffold] TODO: .npmrc 的 @cloudsop scope 源路径按 @nce 同源推断，内网核对');
if (skippedStyles) {
  console.log('[init-scaffold] 升级模式：保留已有 src/styles/ 目录（token CSS 未覆盖）');
}
console.log('');
console.log('后续步骤:');
const cdPath = path.relative(process.cwd(), resolvedTarget) || '.';
console.log(`  cd ${cdPath}`);
console.log('  npm install');
