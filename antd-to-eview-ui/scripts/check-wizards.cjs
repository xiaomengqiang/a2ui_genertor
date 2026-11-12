#!/usr/bin/env node
/**
 * check-wizards.cjs — Steps→Wizards 迁移正确性检查（硬 FAIL + advisory）
 *
 * 对应 component-mapping.md Steps 行 + components/Wizards.md。
 * antd Steps→eview-ui Wizards 的两大坑：
 *   1. currentStep 对应 data[].value（不是下标）——传数字下标步骤不推进
 *   2. items→data、title→text——字段残留文字不显示
 *
 * 检查项：
 *   1. STEPS_RESIDUE          `<Steps` / `Steps.Step` JSX 残留（eview-ui 无 Steps，应已换 Wizards）→ 硬 FAIL
 *   2. WIZARDS_ITEMS_PROP     `<Wizards>` 上 items= 残留（应为 data=）→ 硬 FAIL
 *   3. WIZARDS_DATA_FIELDS    Wizards data 项残留 title:/label:（应为 text/value）→ 硬 FAIL（AST 扫描
 *                             .map/spread/嵌套等动态形态；无 @babel/parser 时降级跳过并在报告注明）
 *   4. WIZARDS_CURRENT_INDEX  currentStep={数字直接量或下标变量（i/index/current）}——疑似传了下标
 *                             而非 data[].value → advisory（数字/常见下标名合法场景存在，需人工确认）
 *
 * 用法：
 *   node check-wizards.cjs <目标工程根>
 *
 * 退出码：0=通过/无 Wizards，1=硬 FAIL，2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function stripComments(text) {
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  out = out.replace(/(^|[^:'"])\/\/[^\n]*/g, (m, p1) => p1);
  return out;
}

function findTagEnd(text, start) {
  let i = start + 1;
  let depth = 0;
  let inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (depth === 0 && ch === '>') return i;
    }
    i++;
  }
  return -1;
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-wizards] 找不到 ${srcDir}，用法: node check-wizards.cjs <目标工程根>`);
    process.exit(2);
  }

  // AST 解析器（可选——无则降级跳过 data 项字段扫描）
  let H = null;
  let parser = null;
  try {
    H = require('./lib/ast-helpers.cjs');
    parser = H.loadParser(root);
  } catch (e) { /* lib 缺失时降级 */ }

  const files = walk(srcDir, []);
  const fails = [];
  const advisories = [];
  let astSkipped = 0;

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const hasWizards = /<Wizards\b/.test(raw);
    const hasSteps = /<Steps\b|Steps\.Step\b/.test(raw);
    if (!hasWizards && !hasSteps) continue;

    const text = stripComments(raw);
    const rel = path.relative(root, file);

    // 1. Steps 残留
    if (/<Steps\b/.test(text)) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (/<Steps\b/.test(lines[i])) {
          fails.push({
            file: rel, line: i + 1, code: 'STEPS_RESIDUE',
            detail: '残留 <Steps>——eview-ui 无 Steps 组件，应替换为 <Wizards>（current={i}→currentStep={data[i].value}；items→data=[{text,value}]）',
          });
        }
      }
    }
    if (/Steps\.Step\b/.test(text)) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (/Steps\.Step\b/.test(lines[i])) {
          fails.push({
            file: rel, line: i + 1, code: 'STEPS_RESIDUE',
            detail: '残留 Steps.Step children 形态——Wizards 用 data=[{text, value}] 数组驱动',
          });
        }
      }
    }

    if (!hasWizards) continue;

    // 2/4. Wizards 标签级检查（tagWindow 跨行）
    const wzRe = /<Wizards\b/g;
    let m;
    while ((m = wzRe.exec(text)) !== null) {
      const start = m.index;
      const tagEnd = findTagEnd(text, start);
      const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 400);
      const line = text.slice(0, start).split('\n').length;

      if (/\bitems\b\s*=/.test(tagWindow)) {
        fails.push({
          file: rel, line, code: 'WIZARDS_ITEMS_PROP',
          detail: '<Wizards> 用 items= 残留（antd Steps items）——应为 data=[{text, value, description?}]',
        });
      }

      // currentStep 传下标：数字直接量或 i/index/current 等下标变量名
      const csMatch = tagWindow.match(/currentStep\s*=\s*\{\s*([^}]+?)\s*\}/);
      if (csMatch) {
        const val = csMatch[1].trim();
        if (/^-?\d+(\.\d+)?$/.test(val) || /^(i|index|current|activeIndex|stepIndex|idx)$/.test(val)) {
          advisories.push({
            file: rel, line, code: 'WIZARDS_CURRENT_INDEX',
            detail: `currentStep={${val}} 疑似传了下标——currentStep 对应 data[].value（不是下标），传下标步骤不推进。若 data 未配 value（序号默认 1,2,3…）则数字直接量可能合法，请人工确认`,
          });
        }
      }
    }

    // 3. data 项 title:/label: 残留（AST）
    if (parser && H) {
      const parsed = H.parse(parser, raw);
      if (!parsed.error) {
        const elements = H.findJsxElements(parsed.ast, ['Wizards']);
        for (const { el } of elements) {
          const expr = H.getAttrExpr(el, 'data');
          if (!expr) continue;
          const objs = H.collectOptionsObjects(parsed.ast, expr);
          for (const obj of objs) {
            for (const badKey of ['title', 'label']) {
              const hit = H.findProperty(obj, badKey);
              if (hit) {
                fails.push({
                  file: rel, line: hit.line, code: 'WIZARDS_DATA_FIELDS',
                  detail: `Wizards data 项残留 "${badKey}:"（antd Steps items 字段）——应为 text（标题）/ value（步骤值）`,
                });
              }
            }
          }
        }
      }
    } else {
      astSkipped++;
    }
  }

  // ---- 报告 ----
  console.log('[check-wizards] Steps→Wizards 迁移正确性检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件${parser ? '' + '' : '，⚠ 无 @babel/parser，data 项 AST 字段扫描降级跳过' + (astSkipped ? `（${astSkipped} 个含 Wizards 的文件）` : '')}）`);

  if (fails.length === 0 && advisories.length === 0) {
    console.log('\n结论: PASS — 无 Steps 残留，Wizards 用法正确。');
    process.exit(0);
  }

  if (fails.length > 0) {
    console.log(`\n【硬 FAIL】${fails.length} 处：`);
    for (const v of fails) {
      console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
    }
  }
  if (advisories.length > 0) {
    console.log(`\n【advisory — 需人工确认】${advisories.length} 处（写入 result 的 advisoryReviews.wizards）：`);
    for (const v of advisories) {
      console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
    }
  }
  process.exit(fails.length > 0 ? 1 : 0);
}

main();
