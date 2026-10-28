#!/usr/bin/env node
/**
 * check-props-preserved.cjs — 包壳组件 style/className 保留检查（对照源快照）
 *
 * 对应需求：从 antd 向私有组件转换时，包壳组件要把 antd 原组件身上的 style 和 className 都带上。
 * 数据来源：umd-to-antd-vite 的 extract-umd.cjs 扫描源项目每个 antd 输入/包壳对应组件调用点的
 * hasStyle/hasClassName/styleSource/classNameValue，写入 .umd-conversion.json 的 inputPropCallSites。
 * 本脚本读快照对照产物，无需访问源项目。
 *
 * 对照策略：按文件 + 家族 + 出现顺序配对源/产物调用点（搬代码保持结构，同文件同家族调用点
 * 出现顺序稳定）。路径规范化：去 src/ 前缀，使源根级 app.jsx 与产物 src/app.jsx 可配对。
 *
 * 检查项：
 *   1. STYLE_DROPPED      源调用点 hasStyle 但产物对应调用点无 style → advisory
 *      （可能合理，如 DatePicker 包壳内部已强制 width:100%，需逐条回应决策）
 *   2. CLASSNAME_DROPPED  源调用点 hasClassName 但产物对应调用点无 className → advisory
 *   3. COUNT_MISMATCH     源/产物同文件同家族调用点数量不等 → advisory（可能重构，无法精确配对）
 *
 * 用法：
 *   node check-props-preserved.cjs <目标工程根>          # advisory，exit 0
 *   node check-props-preserved.cjs <目标工程根> --strict # 有待核项 exit 1
 */
'use strict';

const fs = require('fs');
const path = require('path');

const JSX_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// eview 包壳组件 → 家族（与源 antd 家族对应；\b 保证不匹配 SelectCard/TagItem 等前缀名）
const PRODUCT_PATTERNS = [
  { re: /<TextField\b/g, family: 'TextField' },
  { re: /<TextArea\b/g, family: 'TextArea' },
  { re: /<SearchInput\b/g, family: 'SearchInput' },
  { re: /<Spinner\b/g, family: 'Spinner' },
  { re: /<Select\b/g, family: 'Select' },
  { re: /<MultipleSelect\b/g, family: 'Select' },
  { re: /<InputSelect\b/g, family: 'Select' },
  { re: /<DatePicker\b/g, family: 'DatePicker' },
  { re: /<TimePicker\b/g, family: 'TimePicker' },
  { re: /<Cascader\b/g, family: 'Cascader' },
  { re: /<TreeSelector\b/g, family: 'TreeSelector' },
  { re: /<Tag\b/g, family: 'Tag' },
  { re: /<Steps\b/g, family: 'Steps' },
];

// 路径规范化：去 ./ 前缀和 src/ 前缀，使源根级 app.jsx 与产物 src/app.jsx 可配对
function normFile(f) {
  return f.replace(/^\.?\//, '').replace(/^src\//, '');
}

// 从 <Component 开始，找到当前标签结束（/> 或 >），跳过字符串和 {} 表达式
// 把 style/className 提取限制在当前标签内，避免溢出到后续 JSX 元素
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

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (JSX_EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

// 扫描产物包壳组件调用点的 hasStyle/hasClassName
function scanProductCallSites(srcDir, root) {
  const files = walk(srcDir, []);
  const callSites = [];
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file).replace(/\\/g, '/');
    for (const { re, family } of PRODUCT_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(code)) !== null) {
        const startPos = m.index;
        const window = tagWindow(code, startPos);
        const lineNum = code.slice(0, startPos).split('\n').length;
        const styleMatch = window.match(/style\s*=\s*\{\{([\s\S]*?)\}\}/);
        const classNameLit = window.match(/className\s*=\s*["']([^"']+)["']/);
        const classNameDyn = window.match(/className\s*=\s*\{([^}]+)\}/);
        callSites.push({
          file: rel, line: lineNum, family,
          hasStyle: !!styleMatch,
          hasClassName: !!(classNameLit || classNameDyn),
        });
      }
    }
  }
  callSites.sort((a, b) => a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1);
  return callSites;
}

// 按规范化文件+家族分组
function groupByFileFamily(callSites) {
  const groups = {};
  for (const c of callSites) {
    const key = normFile(c.file) + '|' + c.family;
    (groups[key] = groups[key] || []).push(c);
  }
  return groups;
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.indexOf('--strict') >= 0;
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-props-preserved] 找不到 ${srcDir}，用法: node check-props-preserved.cjs <目标工程根> [--strict]`);
    process.exit(2);
  }
  const handoffPath = path.join(root, '.umd-conversion.json');
  if (!fs.existsSync(handoffPath)) {
    console.error(`[check-props-preserved] 找不到 .umd-conversion.json（需先跑 umd-to-antd-vite 的 extract-umd.cjs）`);
    process.exit(2);
  }
  const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
  const sourceSites = handoff.inputPropCallSites;
  if (!sourceSites) {
    console.error(`[check-props-preserved] .umd-conversion.json 无 inputPropCallSites 字段（需重跑 extract-umd.cjs，新版已支持）`);
    process.exit(2);
  }

  const productSites = scanProductCallSites(srcDir, root);
  const sourceGroups = groupByFileFamily(sourceSites);
  const productGroups = groupByFileFamily(productSites);

  const advisories = [];
  const allKeys = new Set([...Object.keys(sourceGroups), ...Object.keys(productGroups)]);

  for (const key of allKeys) {
    const srcs = sourceGroups[key] || [];
    const prods = productGroups[key] || [];
    const [normFile, family] = key.split('|');
    if (srcs.length === 0) continue; // 产物有源无（新增），不报
    if (prods.length === 0) {
      if (srcs.some(s => s.hasStyle || s.hasClassName)) {
        advisories.push({ code: 'COUNT_MISMATCH', file: normFile, family, detail: `${family} 调用点源 ${srcs.length} 个（部分带 style/className）产物 0 个——组件可能被删除或重构，需人工核对` });
      }
      continue;
    }
    if (srcs.length !== prods.length) {
      const withProp = srcs.filter(s => s.hasStyle || s.hasClassName).length;
      if (withProp > 0) {
        advisories.push({ code: 'COUNT_MISMATCH', file: normFile, family, detail: `${family} 调用点数量不等（源 ${srcs.length} / 产物 ${prods.length}），源 ${withProp} 个带 style/className——可能重构，无法精确配对，需人工核对` });
      }
    }
    // 按序配对（取 min 长度）
    const n = Math.min(srcs.length, prods.length);
    for (let i = 0; i < n; i++) {
      const s = srcs[i], p = prods[i];
      if (s.hasStyle && !p.hasStyle) {
        advisories.push({ code: 'STYLE_DROPPED', file: normFile, line: s.line, family, component: s.component, detail: `${family} 调用点（源 ${s.component} 行${s.line}）style 被丢弃（源 style: ${s.styleSource}）` });
      }
      if (s.hasClassName && !p.hasClassName) {
        advisories.push({ code: 'CLASSNAME_DROPPED', file: normFile, line: s.line, family, component: s.component, detail: `${family} 调用点（源 ${s.component} 行${s.line}）className 被丢弃（源 className: ${s.classNameValue}）` });
      }
    }
  }

  // 报告
  console.log('[check-props-preserved] 包壳组件 style/className 保留检查报告');
  console.log(`  扫描范围: ${srcDir}`);
  console.log(`  源快照: ${sourceSites.length} 处调用点（${Object.keys(sourceGroups).length} 个 文件×家族组）`);
  console.log(`  产物: ${productSites.length} 处调用点（${Object.keys(productGroups).length} 个 文件×家族组）`);

  if (advisories.length === 0) {
    console.log('\n结论: PASS — 源 antd 组件的 style/className 均已保留到包壳组件。');
    process.exit(0);
  }

  const byCode = {};
  for (const v of advisories) (byCode[v.code] = byCode[v.code] || []).push(v);
  const codeDesc = {
    STYLE_DROPPED: 'style 被丢弃（源有产物无）',
    CLASSNAME_DROPPED: 'className 被丢弃（源有产物无）',
    COUNT_MISMATCH: '调用点数量不等（可能重构，无法精确配对）',
  };
  console.log(`\n发现 ${advisories.length} 处待核项：\n`);
  for (const code of Object.keys(byCode)) {
    console.log(`【${code}】${codeDesc[code] || code}（${byCode[code].length} 处）：`);
    for (const v of byCode[code]) {
      const loc = v.line ? `${v.file}:${v.line}` : v.file;
      console.log(`  - ${loc}  [${v.family}] ${v.detail}`);
    }
    console.log('');
  }
  console.log('结论: 待核对 — 上述调用点的 style/className 需逐条确认（合理丢弃如 DatePicker 包壳已处理宽度，否则应补回）。');
  console.log('  详见 SKILL.md 硬约束① + 组件映射表（包壳组件从 @/shared/<X> 导入，须保留源 style/className）。');
  if (strict) process.exit(1);
}

main();
