#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || process.cwd());
const srcRoot = path.join(root, 'src');

if (!fs.existsSync(srcRoot)) {
  console.error(`[check-relative-imports] src directory not found: ${srcRoot}`);
  process.exit(1);
}

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'];
const problems = [];
const suspicious = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      walk(full);
      continue;
    }
    if (/\.(js|jsx|ts|tsx)$/.test(name)) checkFile(full);
  }
}

function existsImportTarget(raw) {
  const direct = path.resolve(raw);
  const candidates = [direct];
  for (const ext of extensions) candidates.push(direct + ext);
  for (const ext of extensions) candidates.push(path.join(direct, `index${ext}`));
  return candidates.some((candidate) => fs.existsSync(candidate));
}

function checkFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const relFile = path.relative(root, file).replace(/\\/g, '/');
  const importRe = /(?:import\s[^'";]*?from\s*|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRe.exec(code)) !== null) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) continue;
    if (relFile.startsWith('src/') && specifier.startsWith('./src/')) {
      suspicious.push(`${relFile} -> ${specifier} (src 内文件不应再写 ./src/，通常应改为 ./...)`);
    }
    const target = path.resolve(path.dirname(file), specifier);
    if (!existsImportTarget(target)) problems.push(`${relFile} -> ${specifier}`);
  }
}

walk(srcRoot);

if (suspicious.length || problems.length) {
  if (suspicious.length) {
    console.error('[check-relative-imports] suspicious imports:');
    for (const item of suspicious) console.error(`  ${item}`);
  }
  if (problems.length) {
    console.error('[check-relative-imports] unresolved relative imports:');
    for (const item of problems) console.error(`  ${item}`);
  }
  process.exit(1);
}

console.log('[check-relative-imports] all relative imports resolved');
