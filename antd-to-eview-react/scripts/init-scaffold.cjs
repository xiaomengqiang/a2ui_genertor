#!/usr/bin/env node

// 将 scaffold/ 预制骨架拷贝到目标工程根，并替换 package.json 的 name 和 index.html 的 title。
// 替代手动 cp -r + 手改两个字段，跨平台可用（不依赖 Unix cp）。
//
// 用法：
//   node init-scaffold.cjs <目标工程根> [项目名] [标题] [--force]
//
// 参数：
//   目标工程根  必需。不存在则自动创建；非空时需 --force 确认覆盖
//   项目名      可选。写入 package.json 的 name；缺省用目标目录名
//   标题        可选。写入 index.html 的 <title>；缺省用项目名
//
// 示例：
//   node init-scaffold.cjs ./my-app my-app "我的应用"
//   node init-scaffold.cjs D:/projects/portal

const fs = require('fs');
const path = require('path');

const scriptDir = path.dirname(__filename);
const scaffoldDir = path.join(scriptDir, '..', 'scaffold');

const targetRoot = process.argv[2];
const projectName = process.argv[3];
const title = process.argv[4];
const force = process.argv.includes('--force');

if (!targetRoot || targetRoot === '--force') {
  console.error('[init-scaffold] 用法: node init-scaffold.cjs <目标工程根> [项目名] [标题] [--force]');
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

function copyDir(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (skipDirs.has(name)) continue;
    const srcPath = path.join(src, name);
    const dstPath = path.join(dst, name);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
      copiedCount++;
    }
  }
}

let copiedCount = 0;
copyDir(scaffoldDir, resolvedTarget);

const pkgPath = path.join(resolvedTarget, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.name = resolvedName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n', 'utf8');
}

const htmlPath = path.join(resolvedTarget, 'index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${resolvedTitle}</title>`);
  fs.writeFileSync(htmlPath, html, 'utf8');
}

console.log(`[init-scaffold] 拷贝完成: ${copiedCount} 个文件 -> ${resolvedTarget}`);
console.log(`[init-scaffold] package.json name = "${resolvedName}"`);
console.log(`[init-scaffold] index.html title = "${resolvedTitle}"`);
console.log('');
console.log('后续步骤:');
const cdPath = path.relative(process.cwd(), resolvedTarget) || '.';
console.log(`  cd ${cdPath}`);
console.log('  npm install');
console.log('  npm run dev');
