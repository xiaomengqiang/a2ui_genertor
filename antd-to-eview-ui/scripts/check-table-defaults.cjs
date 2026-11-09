#!/usr/bin/env node
/**
 * check-table-defaults.cjs — TablePro 迁移反向坑检查（硬 FAIL + advisory）
 *
 * 对应 component-mapping.md Table 行 + SKILL.md Pro 优先原则。
 * **Table 唯一映射 TablePro**（旧 Table 弃用——旧版的导入由 check-imports.cjs 的
 * LEGACY_PRO_USED 硬拦截，本脚本不再检查旧 Table 的 API 形态）。
 *
 * TablePro 与 antd Table 高度同构（dataIndex/rowKey/sorter/fixed 保留），
 * 仅剩两类反向坑：
 *   - dataSource= 残留（antd 形态；TablePro 用 dataset=）→ 硬 FAIL
 *   - rowSelection= 残留（antd 形态；TablePro 用 selection 对象）→ advisory
 *   - columnResizable 默认 true（列宽拖拽，antd 默认无）未显式处理 → advisory
 *
 * 检查项：
 *   1. DATASOURCE_RESIDUE     <TablePro> 上 dataSource= 残留（应 dataset=）→ 硬 FAIL
 *   2. ROWSELECTION_RESIDUE   rowSelection= 残留（应 selection={type, selectedRowKeys, onChange}）→ advisory
 *   3. TABLEPRO_RESIZABLE     文件含 <TablePro> 且未显式处理 columnResizable → advisory
 *                             （默认 true 列宽拖拽；源 antd 无拖拽时应显式 columnResizable={false}）
 *
 * 用法：
 *   node check-table-defaults.cjs <目标工程根>          # advisory 列出待核项，退出码 0（除非硬 FAIL）
 *   node check-table-defaults.cjs <目标工程根> --strict # advisory 也 exit 1
 *
 * 纯静态正则，不执行代码。退出码：0=通过/仅 advisory，1=硬 FAIL（或 --strict 下有 advisory），2=用法错误。
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

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-table-defaults] 找不到 ${srcDir}，用法: node check-table-defaults.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  const advisories = [];
  let tableFiles = 0;

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const hasTablePro = /<TablePro\b/.test(raw);
    if (!hasTablePro) continue;
    tableFiles++;
    const text = stripComments(raw);
    const rel = path.relative(root, file);

    // 1. dataSource= 残留（TablePro 应 dataset=）
    const dsRe = /(<TablePro\b[^>]*?\bdataSource\s*=|^\s*dataSource\s*=)/g;
    let m;
    while ((m = dsRe.exec(text)) !== null) {
      const line = text.slice(0, m.index).split('\n').length;
      fails.push({
        file: rel, line, code: 'DATASOURCE_RESIDUE',
        detail: 'dataSource= 残留（antd Table）——TablePro 用 dataset=',
      });
    }

    // 2. rowSelection= 残留
    const rsRe = /\browSelection\s*=/g;
    while ((m = rsRe.exec(text)) !== null) {
      const line = text.slice(0, m.index).split('\n').length;
      advisories.push({
        file: rel, line, code: 'ROWSELECTION_RESIDUE',
        detail: 'rowSelection= 残留（antd 形态）——TablePro 应为 selection 对象（type/selectedRowKeys/onChange(selectedRowKeys, selectedRows)/onSelect）',
      });
    }

    // 3. TablePro columnResizable 默认 true
    if (!/columnResizable\s*=/.test(text)) {
      const line = (text.split('\n').findIndex(l => /<TablePro\b/.test(l)) || 0) + 1;
      advisories.push({
        file: rel, line, code: 'TABLEPRO_RESIZABLE',
        detail: '<TablePro> 未显式处理 columnResizable——默认 true（列宽拖拽）。源 antd 无列宽拖拽时应显式 columnResizable={false}；有意保留请在 result 的 advisoryReviews.tableDefaults 注明',
      });
    }
  }

  // ---- 报告 ----
  console.log('[check-table-defaults] TablePro 反向坑检查报告（旧 Table 由 check-imports 的 LEGACY_PRO_USED 拦截）');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <TablePro> 的 ${tableFiles} 个）`);

  if (fails.length === 0 && advisories.length === 0) {
    console.log('\n结论: PASS — 无 dataSource 残留，TablePro 反向坑无待核项。');
    process.exit(0);
  }

  if (fails.length > 0) {
    console.log(`\n【硬 FAIL】${fails.length} 处：`);
    for (const v of fails) {
      console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
    }
  }
  if (advisories.length > 0) {
    console.log(`\n【advisory — 须逐条回应（result 的 advisoryReviews.tableDefaults）】${advisories.length} 处：`);
    for (const v of advisories) {
      console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
    }
  }
  console.log('\n  修复指引见 component-mapping.md Table 行 + migration-workflow.md §2.3。');

  if (fails.length > 0) process.exit(1);
  if (strict && advisories.length > 0) process.exit(1);
  process.exit(0);
}

main();
