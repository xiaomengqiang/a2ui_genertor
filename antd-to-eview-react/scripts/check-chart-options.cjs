#!/usr/bin/env node
/**
 * check-chart-options.cjs — 图表 option 必含 a2ui: true 与 theme 检查
 *
 * 对应 SKILL.md 硬约束⑪ + 已知坑点「图表 option 缺 a2ui:true 与 theme 标识」：
 * 源项目 Chart 封装（assets/shared/chart.jsx）在 setSimpleOption 前统一注入
 * theme（暗色派生）与 a2ui: true。改 @nce/eview-react/Chart 包导入后不会自动补——
 * 漏写则图表 a2ui 视觉规范失效、暗色切换后主题不跟随。
 *
 * 检查项：
 *   1. SETSIMPLEOPTION_RESIDUAL  残留 setSimpleOption( → FAIL（源 Chart 封装未替换为包导入）
 *   2. 每个 <Chart ... option={X} .../> 的 X：
 *      - 内联对象 { a2ui:true, theme:..., ... }        → 须含字面量 a2ui 与 theme
 *      - 聚合展开 { ...chartBase, ... }               → 追 chartBase 定义查 a2ui/theme
 *      - 变量 { chartOption }                          → 追同文件 const chartOption={...}/useMemo 查
 *      - 追不到（外部变量/复杂表达式）                  → advisory（需人工确认）
 *
 * 用法：
 *   node check-chart-options.cjs <目标工程根>          # 发现硬 FAIL exit 1
 *
 * 纯静态正则 + 平衡括号匹配，不执行代码。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

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

// 从 startBraceIdx 处的 { 开始，平衡匹配到对应 }，返回 { body, end }
// 跳过字符串/模板字面量内的括号
function extractBalanced(text, startBraceIdx) {
  let depth = 0;
  let i = startBraceIdx;
  let inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return { body: text.slice(startBraceIdx + 1, i), end: i };
      }
    }
    i++;
  }
  return null;
}

// 对象 body 中是否含字面量 a2ui: 与 theme:
function objHasKeys(body) {
  return {
    hasA2ui: /\ba2ui\b\s*:/.test(body),
    hasTheme: /\btheme\b\s*:/.test(body),
  };
}

// 在文件文本中追变量定义，返回其对象 body（若定义是对象字面量）
// 支持: const NAME = { ... };  const NAME = useMemo(() => ({ ... }), ...);
function findVarObjectBody(text, varName) {
  // const varName = { ... }
  const re1 = new RegExp(`\\bconst\\s+${varName}\\s*=\\s*\\{`);
  let m = re1.exec(text);
  if (m) {
    const obj = extractBalanced(text, m.index + m[0].length - 1);
    if (obj) return obj.body;
  }
  // const varName = useMemo(() => ({ ... }), ...)
  const re2 = new RegExp(`\\bconst\\s+${varName}\\s*=\\s*\\w+\\s*\\(\\s*\\(\\)\\s*=>\\s*\\(\\s*\\{`);
  m = re2.exec(text);
  if (m) {
    const braceIdx = text.indexOf('{', m.index + m[0].length - 1);
    const obj = extractBalanced(text, braceIdx);
    if (obj) return obj.body;
  }
  return null;
}

// 检测对象 body 中是否含 ...<聚合变量> 展开，若是返回该变量名
function findSpreadVar(body) {
  const m = body.match(/\.\.\.([A-Za-z_$][\w$]*)/);
  return m ? m[1] : null;
}

// 从 option={ 之后解析 X，返回 { type, body?, varName? }
// type: 'inline' (内联对象) | 'var' (变量) | 'unknown'
function parseOptionValue(text, afterOptionEq) {
  let i = afterOptionEq; // 指向 option= 后的 {
  // 跳过空白到 {
  while (i < text.length && /\s/.test(text[i])) i++;
  if (text[i] !== '{') return { type: 'unknown' };
  // JSX 表达式容器 { ... }，提取内部
  const inner = extractBalanced(text, i);
  if (!inner) return { type: 'unknown' };
  const innerTrim = inner.body.trim();
  // 内联对象: 以 { 开头
  if (innerTrim.startsWith('{')) {
    const objBrace = inner.body.indexOf('{');
    const obj = extractBalanced(inner.body, objBrace);
    return obj ? { type: 'inline', body: obj.body } : { type: 'unknown' };
  }
  // 变量: 标识符
  const varM = innerTrim.match(/^([A-Za-z_$][\w$]*)/);
  if (varM) return { type: 'var', varName: varM[1] };
  return { type: 'unknown' };
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-chart-options] 找不到 ${srcDir}，用法: node check-chart-options.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];     // 硬 FAIL
  const advisories = []; // 追不到，需人工确认

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);

    // 1. 残留 setSimpleOption(
    const ssRe = /\bsetSimpleOption\s*\(/g;
    let m;
    while ((m = ssRe.exec(text)) !== null) {
      fails.push({
        file: rel, line: lineOfOffset(text, m.index),
        code: 'SETSIMPLEOPTION_RESIDUAL',
        detail: '残留 setSimpleOption( — 源 Chart 封装未替换为 @nce/eview-react/Chart 包导入',
      });
    }

    // 2. <Chart ... option={X} ...>
    const chartRe = /<Chart\b/g;
    while ((m = chartRe.exec(text)) !== null) {
      const chartStart = m.index;
      // 在该 <Chart 之后找 option=（限定在同标签内，粗略到下一个 />）
      const tagEnd = text.indexOf('/>', chartStart);
      const tagFrag = tagEnd > 0 ? text.slice(chartStart, tagEnd) : text.slice(chartStart);
      const optRe = /\boption\s*=\s*\{/g;
      let om;
      while ((om = optRe.exec(tagFrag)) !== null) {
        const absOffset = chartStart + om.index + om[0].length; // option={ 的 { 后
        const parsed = parseOptionValue(text, absOffset - 1);
        const line = lineOfOffset(text, chartStart + om.index);

        if (parsed.type === 'inline') {
          const keys = objHasKeys(parsed.body);
          // 聚合展开: 若含 ...chartBase 且 chartBase 定义含 a2ui/theme，视为通过
          const spreadVar = findSpreadVar(parsed.body);
          let viaSpread = false;
          if (spreadVar && (!keys.hasA2ui || !keys.hasTheme)) {
            const spreadBody = findVarObjectBody(text, spreadVar);
            if (spreadBody) {
              const sk = objHasKeys(spreadBody);
              if (sk.hasA2ui && sk.hasTheme) viaSpread = true;
            }
          }
          if (!viaSpread) {
            const missing = [];
            if (!keys.hasA2ui) missing.push('a2ui: true');
            if (!keys.hasTheme) missing.push('theme');
            if (missing.length) {
              fails.push({
                file: rel, line,
                code: 'CHART_OPTION_MISSING',
                detail: `<Chart> option 内联对象缺 ${missing.join(' / ')}（源 Chart 封装的注入不会随包导入自动补）`,
              });
            }
          }
        } else if (parsed.type === 'var') {
          const body = findVarObjectBody(text, parsed.varName);
          if (body) {
            const keys = objHasKeys(body);
            const spreadVar = findSpreadVar(body);
            let viaSpread = false;
            if (spreadVar && (!keys.hasA2ui || !keys.hasTheme)) {
              const spreadBody = findVarObjectBody(text, spreadVar);
              if (spreadBody) {
                const sk = objHasKeys(spreadBody);
                if (sk.hasA2ui && sk.hasTheme) viaSpread = true;
              }
            }
            if (!viaSpread) {
              const missing = [];
              if (!keys.hasA2ui) missing.push('a2ui: true');
              if (!keys.hasTheme) missing.push('theme');
              if (missing.length) {
                fails.push({
                  file: rel, line,
                  code: 'CHART_OPTION_MISSING',
                  detail: `<Chart> option 变量 "${parsed.varName}" 的定义缺 ${missing.join(' / ')}`,
                });
              }
            }
          } else {
            advisories.push({
              file: rel, line,
              code: 'CHART_OPTION_EXTERNAL',
              detail: `<Chart> option 是外部变量 "${parsed.varName}"，无法静态确认，请人工核对含 a2ui: true 与 theme`,
            });
          }
        } else {
          advisories.push({
            file: rel, line,
            code: 'CHART_OPTION_UNPARSEABLE',
            detail: '<Chart> option 无法静态解析，请人工核对含 a2ui: true 与 theme',
          });
        }
      }
    }
  }

  // ---- 报告 ----
  const chartFiles = files.filter((f) => /<Chart\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-chart-options] 图表 option 检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <Chart> 的 ${chartFiles} 个）`);

  if (fails.length === 0 && advisories.length === 0) {
    console.log('\n结论: PASS — 未发现图表 option 问题。');
    process.exit(0);
  }

  if (fails.length > 0) {
    console.log(`\n【硬 FAIL】${fails.length} 处：`);
    for (const v of fails) {
      console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
    }
  }
  if (advisories.length > 0) {
    console.log(`\n【advisory — 需人工确认】${advisories.length} 处：`);
    for (const v of advisories) {
      console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
    }
  }

  console.log('\n  修复指引见 SKILL.md 硬约束⑪ + components/Chart.md（推荐 chartBase 聚合模式）。');
  process.exit(fails.length > 0 ? 1 : 0);
}

main();
