#!/usr/bin/env node
/**
 * check-i18n-keys.cjs — 迁移后 i18n 动态 key 静态检查（advisory）
 *
 * 排查 MISSING_TRANSLATION 的两类高危写法（对应 migration-workflow.md §3.5）：
 *   A. 调用侧：`t(x, x)` 双参同名的动态翻译调用（如 Table 列 render: (value) => t(value, value)），
 *      id 是运行时字段值；若该字段 value ≠ msgId（缺命名空间前缀），运行时必然报
 *      `MISSING_TRANSLATION: Missing message "gateway" for locale "zh"`。
 *   B. 数据侧：data.js 等选项字典中 `value !== msgId` 的字段——这些字段的值不能直接当
 *      i18n key 用，调用侧必须补前缀（如 `t("deviceType." + value, value)`）。
 *
 * 用法：
 *   node check-i18n-keys.cjs <目标工程根>            # 输出报告，退出码 0
 *   node check-i18n-keys.cjs <目标工程根> --strict   # 发现"未加前缀的 t(x,x) 调用"时退出码 1
 *
 * 说明：
 * - 只递归扫描 <目标工程根>/src/ 下 .js/.jsx/.ts/.tsx；纯静态正则，不执行代码。
 * - B 类只识别 `{ value: "...", msgId: "..." }`（含 `label`/`fallback` 任一字段）的对象字面量。
 * - 已修复的写法（`t("deviceType." + value, value)`、t("字面量", "字面量")）不会被误报。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const MAX_PAIR_GAP = 160; // value 与 msgId 在同一对象字面量内的最大字符距离

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
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

// B 类：提取对象字面量里成对的 value / msgId
function extractValueMsgIdPairs(text) {
  const pairs = [];
  const objRe = /\{([^{}]*)\}/g;
  let m;
  while ((m = objRe.exec(text)) !== null) {
    const body = m[1];
    const valueM = body.match(/\bvalue\s*:\s*["'`]([^"'`]+)["'`]/);
    const msgIdM = body.match(/\bmsgId\s*:\s*["'`]([^"'`]+)["'`]/);
    if (valueM && msgIdM && Math.abs(valueM.index - msgIdM.index) <= MAX_PAIR_GAP) {
      pairs.push({ value: valueM[1], msgId: msgIdM[1], offset: m.index });
    }
  }
  return pairs;
}

// A 类：t(x, x) 双参同名调用（x 是标识符/成员表达式，不是字符串字面量）
function extractSameArgCalls(text) {
  const calls = [];
  const callRe = /\bt\(\s*([A-Za-z_$][\w$.]*)\s*,\s*\1\s*(?:,[^)]*)?\)/g;
  let m;
  while ((m = callRe.exec(text)) !== null) {
    // 排除字符串字面量：标识符不可能带引号，正则已保证；再排除 t("a", "a") 形式（不会被此正则命中）
    calls.push({ arg: m[1], offset: m.index });
  }
  return calls;
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.indexOf('--strict') >= 0;
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-i18n-keys] 找不到 ${srcDir}，用法: node check-i18n-keys.cjs <目标工程根> [--strict]`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const riskyFields = []; // B 类：value !== msgId
  const sameArgCalls = []; // A 类：t(x, x)

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);

    for (const p of extractValueMsgIdPairs(text)) {
      if (p.value !== p.msgId) riskyFields.push({ file: rel, line: lineOfOffset(text, p.offset), ...p });
    }
    for (const c of extractSameArgCalls(text)) {
      sameArgCalls.push({ file: rel, line: lineOfOffset(text, c.offset), arg: c.arg });
    }
  }

  // 为每个 t(x, x) 调用推测风险：末段标识符命中 value≠msgId 的字段名
  const riskyValues = new Map(); // value -> { msgId, prefix }
  for (const f of riskyFields) {
    const prefix = f.msgId.endsWith(f.value) ? f.msgId.slice(0, f.msgId.length - f.value.length) : null;
    if (!riskyValues.has(f.value)) riskyValues.set(f.value, { msgId: f.msgId, prefix });
  }

  const flagged = [];
  for (const c of sameArgCalls) {
    const leaf = c.arg.split('.').pop();
    const hit = riskyValues.get(leaf);
    if (hit) flagged.push({ ...c, value: leaf, ...hit });
  }

  // ---- 报告 ----
  console.log('[check-i18n-keys] i18n 动态 key 检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件）`);

  console.log(`\n① 选项字典中 value !== msgId 的字段（${riskyFields.length} 个，调用侧不能直接 t(value)）：`);
  if (riskyFields.length === 0) {
    console.log('  （无）');
  } else {
    for (const f of riskyFields) {
      const prefix = f.msgId.endsWith(f.value) ? f.msgId.slice(0, f.msgId.length - f.value.length) : '?';
      console.log(`  - ${f.file}:${f.line}  value="${f.value}"  msgId="${f.msgId}"  → 前缀 "${prefix}"`);
    }
  }

  console.log(`\n② t(x, x) 双参同名动态翻译调用（${sameArgCalls.length} 处，需逐个核对是否要补前缀）：`);
  if (sameArgCalls.length === 0) {
    console.log('  （无）');
  } else {
    for (const c of sameArgCalls) {
      const leaf = c.arg.split('.').pop();
      const hit = riskyValues.get(leaf);
      const hint = hit
        ? `高危 → 补前缀: t("${hit.prefix}" + ${c.arg}, ${c.arg})`
        : `待核对: 确认 ${c.arg} 的取值就是完整 i18n key（value === msgId 的字段无需改）`;
      console.log(`  - ${c.file}:${c.line}  t(${c.arg}, ${c.arg})  ${hint}`);
    }
  }

  const highRisk = flagged.length;
  console.log(
    `\n结论: ${highRisk === 0 ? '未发现"缺前缀"的高危调用' : `发现 ${highRisk} 处高危调用（value ≠ msgId 且未加前缀）→ 运行时会报 MISSING_TRANSLATION`}`
  );
  if (highRisk > 0) {
    console.log('  修复模式见 migration-workflow.md §3.5：t("deviceType." + value, value)');
    if (strict) process.exit(1);
  }
}

main();
