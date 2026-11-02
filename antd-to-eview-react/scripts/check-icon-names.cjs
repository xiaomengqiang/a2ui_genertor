#!/usr/bin/env node
/**
 * check-icon-names.cjs — 产物 IconPlusIc* 图标名实有性硬约束检查（strict，发现违规直接 FAIL）
 *
 * 方案 C 转换后，产物中每个 `IconPlusIc{Domain}{Name}` 标识符（import specifier、JSX 标签、
 * 标识符引用）都必须是 `references/icons/icon-plus-names.json` catalog 的实有条目。
 *
 * 仅方案 C（外网/离线 catalog 匹配）跑此闸门——catalog 是方案 C 的真值。方案 B（内网）的名由在线
 * `getIconInfo` 接口匹配（真值是实包，非离线快照），不跑此闸门（版本漂移会误报）；方案 A 产物无
 * IconPlusIc* 名，跑了亦 no-op。
 *
 * 防的回归：LLM residual 复核时臆造 `IconPlusIc{Domain}{Name}`——拿桶前缀 + 源名 PascalCase 基名
 * 拼接，既不验证该 entry 在该桶存在、又常拼错桶（实测：源 `siren` → `IconPlusIcPublicAlarm`，但
 * `Alarm` 只在 Ict 桶；源 `building-2` → `IconPlusIcIctBuilding2`，但全库无 `Building2`）。
 * match-icons.cjs 对孤儿名已自动落占位（catalog 实有名），本闸门兜底拦任何漏网的非实有名。
 *
 * 检查项：
 *   INVALID-ICON-NAME  产物中出现 catalog 不存在的 IconPlusIc* 标识符
 *
 * 用法：
 *   node check-icon-names.cjs <目标工程根> [--strict] [--catalog <catalog.json 路径>]
 *
 * 默认 strict（发现违规 exit 1）；--strict 为兼容工作流统一调用的显式开关（已默认 strict，传入无额外效果）。
 * 纯静态正则，不执行代码。退出码：0=通过，1=发现违规，2=用法/读 catalog 错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const NAME_RE = /\bIconPlusIc[A-Z][A-Za-z0-9]*\b/g;

// 默认 catalog：本 skill 的 references/icons/icon-plus-names.json
function defaultCatalogPath() {
  return path.join(__dirname, '..', 'references', 'icons', 'icon-plus-names.json');
}

// skipDirs：src/shared/ 是包壳实现文件（scaffold 预置），跳过（同 check-imports.cjs 惯例）
function walk(dir, out, skipDirs) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    if (skipDirs && skipDirs.has(ent.name) && ent.isDirectory()) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out, skipDirs);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

// 去 // 行注释与 /* */ 块注释（避免注释里提到的 IconPlusIc 名误报；不处理字符串字面量——
// 字符串里出现 IconPlusIc 名本身即为可疑，保留扫描）。返回去注释后的文本（保留换行以对齐行号）。
function stripComments(text) {
  let out = '';
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '/' && next === '/') {
      // 行注释：跳到行尾（保留换行）
      while (i < n && text[i] !== '\n') i++;
    } else if (c === '/' && next === '*') {
      // 块注释：跳到 */，中间换行保留以对齐行号
      i += 2;
      while (i < n && !(text[i] === '*' && text[i + 1] === '/')) {
        if (text[i] === '\n') out += '\n';
        i++;
      }
      i += 2; // 跳过 */
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

function loadValidNames(catalogPath) {
  const raw = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const valid = new Set();
  for (const domain of Object.keys(raw)) {
    for (const name of raw[domain]) {
      valid.add(`IconPlusIc${domain}${name}`);
    }
  }
  // PLACEHOLDER = IconPlusIcPublicTransverseRectangleTemplate 已是 Public 实有条目，无需特判。
  return valid;
}

function main() {
  const args = process.argv.slice(2);
  const positional = [];
  let catalogPath = defaultCatalogPath();
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--strict') {
      // 显式 strict（默认即 strict，兼容工作流统一调用）
      continue;
    } else if (a === '--catalog') {
      catalogPath = args[++i];
      if (!catalogPath) {
        console.error('[check-icon-names] --catalog 需提供路径参数');
        process.exit(2);
      }
    } else if (!a.startsWith('--')) {
      positional.push(a);
    }
  }
  const root = positional.length ? path.resolve(positional[0]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-icon-names] 找不到 ${srcDir}，用法: node check-icon-names.cjs <目标工程根>`);
    process.exit(2);
  }
  if (!fs.existsSync(catalogPath)) {
    console.error(`[check-icon-names] 找不到 catalog: ${catalogPath}`);
    process.exit(2);
  }

  let valid;
  try {
    valid = loadValidNames(catalogPath);
  } catch (e) {
    console.error(`[check-icon-names] 读 catalog 失败: ${catalogPath}\n  ${e.message}`);
    process.exit(2);
  }

  const files = walk(srcDir, [], new Set(['shared']));
  const violations = []; // { file, line, name }

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const stripped = stripComments(raw);
    const lines = stripped.split('\n');
    // 同一文件同一名字多处出现都报（每处一行号），便于定位；但同行重复只记一次。
    for (let i = 0; i < lines.length; i++) {
      const seenOnLine = new Set();
      let m;
      NAME_RE.lastIndex = 0;
      while ((m = NAME_RE.exec(lines[i])) !== null) {
        const name = m[0];
        if (seenOnLine.has(name)) continue;
        seenOnLine.add(name);
        if (!valid.has(name)) {
          violations.push({ file: rel, line: i + 1, name });
        }
      }
    }
  }

  // ---- 报告 ----
  console.log('[check-icon-names] IconPlusIc* 名实有性检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，跳过 src/shared/）`);
  console.log(`  catalog: ${catalogPath}（${valid.size} 个实有名）`);

  if (violations.length === 0) {
    console.log('\n结论: PASS — 产物中所有 IconPlusIc* 名均为 catalog 实有条目。');
    process.exit(0);
  }

  console.log(`\n发现 ${violations.length} 处违规：\n`);
  console.log(`【INVALID-ICON-NAME】产物中出现 catalog 不存在的 IconPlusIc* 名（${violations.length} 处）`);
  for (const v of violations) {
    console.log(`  - ${v.file}:${v.line}  ${v.name}`);
  }
  console.log('');
  console.log('结论: FAIL — 存在 catalog 不存在的 IconPlusIc* 名，必须修复后重跑。');
  console.log('  修复指引：residual 名只能取候选[0] / 占位 IconPlusIcPublicTransverseRectangleTemplate / catalog 实有名；');
  console.log('           禁止拼接 IconPlusIc{Domain}{Name}。孤儿名（catalog 无匹配）由 match-icons.cjs --apply 自动落占位。');
  console.log('           见 references/components/Icon.md residual 铁律。');
  process.exit(1);
}

main();
