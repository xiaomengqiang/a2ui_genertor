#!/usr/bin/env node
/**
 * check-table-defaults.cjs — Table 默认值反向坑检查（advisory）
 *
 * 对应 SKILL.md 已知坑点「Table 排序/斑马纹/外层宽度/columns 更新」四连：
 * eview-react 的 Table 多个默认值与 antd **相反**——迁移时最易忘、最常错。
 * 本脚本只扫迁移后产物，无法访问源 antd 项目，故全 advisory：列出每个 <Table>
 * 缺哪几项标记，强制迁移方逐条对照源 antd 回应（写入 .migration-result.json）。
 *
 * 检查项（每个 <Table> 标五项，缺则提示对应源项目核对方法）：
 *   1. enableZebraCrossing  缺标记 → eview 默认 true 开斑马纹，源 antd 默认无 → 需对照源
 *   2. allowSort            缺标记 → eview 默认 true 全列带排序箭头，源 antd 默认无 → 需逐列对照源 sorter
 *   3. enableColumnCompareUpdate  缺标记 → eview 默认 false，columns 动态变化场景失效 → 需对照源 columns 是否动态
 *   4. width                缺标记 → eview 默认行内 width:100%;height:100% 撑破布局 → 需对照源有无显式宽度
 *   5. freezeCol            含标记 → eview 无条件冻结，源 fixed 仅横向溢出才冻结 → 需确认源真会横向滚动
 *
 * 用法：
 *   node check-table-defaults.cjs <目标工程根>          # advisory，列出待核项，退出码 0
 *   node check-table-defaults.cjs <目标工程根> --strict # 有待核项 exit 1（接入步骤 3 门禁）
 *
 * 纯静态正则，不执行代码。退出码：0=无待核项/通过，1=有待核项（--strict），2=用法错误。
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

// 提取每个 <Table ... /> 开标签的完整片段 + 标记是否自引用同文件 columns
function findTables(text) {
  const tables = [];
  const re = /<Table\b/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const start = m.index;
    // 找该标签结束（/> 或 >），粗略用第一个 />；若无自闭合取到 >
    let end = text.indexOf('/>', start);
    if (end < 0) end = text.indexOf('>', start);
    const frag = end > 0 ? text.slice(start, end) : text.slice(start);
    tables.push({ start, line: lineOfOffset(text, start), frag });
  }
  return tables;
}

// 提取 <Table> 引用的 columns 数组，返回每列是否带 width 的判断结果
// 策略：从 <Table> 标签里找 columns={X}，X 是标识符则追同文件 const X=[...]；X 是内联 [ 则直接用
// 然后用平衡括号提取数组体，按顶层对象分割（{ ... }），每个对象里查 width:
// 返回 { total, withWidth, allHaveWidth }
function extractColumnWidths(frag, text) {
  // 找 columns={X}
  const colRefM = frag.match(/columns\s*=\s*\{([^}]+)\}/);
  if (!colRefM) return null;
  let colExpr = colRefM[1].trim();
  let arrBody = null;
  if (colExpr.startsWith('[')) {
    // 内联数组，提取平衡括号
    const braceStart = colRefM.index + colRefM[0].indexOf('[');
    const arr = extractBalancedArray(frag, braceStart);
    if (arr) arrBody = arr.body;
  } else {
    // 标识符引用，追同文件 const X = [ ... ]
    const name = colExpr.match(/^([A-Za-z_$][\w$]*)/);
    if (name) {
      const re = new RegExp(`\\bconst\\s+${name[1]}\\s*=\\s*\\[`);
      const defM = re.exec(text);
      if (defM) {
        const braceStart = defM.index + defM[0].lastIndexOf('[');
        const arr = extractBalancedArray(text, braceStart);
        if (arr) arrBody = arr.body;
      }
    }
  }
  if (!arrBody) return null;

  // 按顶层 { } 对象分割（平衡括号）
  const cols = [];
  let i = 0;
  while (i < arrBody.length) {
    if (arrBody[i] === '{') {
      const obj = extractBalancedObj(arrBody, i);
      if (obj) {
        cols.push(obj.body);
        i = obj.end + 1;
        continue;
      }
    }
    i++;
  }
  if (cols.length === 0) return null;
  const withWidth = cols.filter(c => /\bwidth\b\s*:/.test(c)).length;
  return { total: cols.length, withWidth, allHaveWidth: withWidth === cols.length };
}

// 从 startIdx（指向 [）平衡匹配到 ]，返回 { body, end }
function extractBalancedArray(text, startIdx) {
  let depth = 0, i = startIdx, inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (depth === 0) return { body: text.slice(startIdx + 1, i), end: i }; }
    }
    i++;
  }
  return null;
}

// 从 startIdx（指向 {）平衡匹配到 }，返回 { body, end }
function extractBalancedObj(text, startIdx) {
  let depth = 0, i = startIdx, inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) return { body: text.slice(startIdx + 1, i), end: i }; }
    }
    i++;
  }
  return null;
}

const CHECKS = {
  enableZebraCrossing: {
    // 表级属性，检查 <Table> 开标签
    present: (frag, text) => /\benableZebraCrossing\b/.test(frag),
    advice: '缺 enableZebraCrossing 标记 → eview 默认 true 开斑马纹；源 antd 默认无斑马纹。核对源：搜源 rowClassName 是否输出 even/odd/striped、源 CSS 是否有 .ant-table-row-even/.ant-table-row-odd 背景、ConfigProvider theme.token 是否配 stripe。源未开 → 加 enableZebraCrossing={false}',
  },
  allowSort: {
    // 列级属性（在 columns 数组里，不在 <Table> 开标签）——检查整个文件是否出现 allowSort
    // 仅当文件有任何 columns 定义（const columns = 或 columns={[}）才提示
    present: (frag, text) => /\ballowSort\b/.test(text) || !/\bcolumns\b/.test(frag),
    advice: '缺 allowSort 标记 → eview 默认 true 全列表头带排序箭头；源 antd 默认无（仅显式 sorter 列才排序）。核对源 columns：有 sorter 的列保留 allowSort: true，无 sorter 的列/操作列/状态列显式加 allowSort: false（allowSort 是列级属性，写在 columns 数组的每个列对象里）',
  },
  enableColumnCompareUpdate: {
    // 表级属性，检查 <Table> 开标签
    present: (frag, text) => /\benableColumnCompareUpdate\b/.test(frag),
    advice: '缺 enableColumnCompareUpdate 标记 → eview 默认 false，columns 变化不重新渲染。核对源 columns 是否动态变化（条件列/权限列/筛选后列集/useMemo 依赖重建）。动态 → 加 enableColumnCompareUpdate（={true}）',
  },
  width: {
    present: (frag) => /\bwidth\b\s*[:=]/.test(frag),
    advice: '缺 width 标记 → eview 默认行内 width:100%;height:100% 撑破父容器。核对源 <Table> 有无显式容器宽度（style width / className CSS 设宽）。源无显式宽度 → 加 width="unset"；源有 → 映射到 width prop（scroll.x 直接抛弃不转）',
  },
  freezeCol: {
    present: (frag) => /\bfreezeCol\b/.test(frag),
    advice: '含 freezeCol → eview 无条件冻结（sticky+阴影），源 antd fixed 仅横向溢出（scroll.x）才冻结。核对源列 fixed 且源表 scroll.x/列宽合计真超出容器宽（真会横向滚动）才保留，否则删除 freezeCol/freezeColPosition',
    isWarning: true, // 含此项才提示（其余是缺才提示）
  },
  columnsAllWidth: {
    present: () => false, // 由 extractColumnWidths 单独处理，不在此触发
    advice: '所有列都带 width → eview-react Table 列全设 width 会导致表格显示异常。应至少有一列不设 width 让其自适应剩余空间（通常操作列或文本列可去 width）',
  },
};

function main() {
  const args = process.argv.slice(2);
  const strict = args.indexOf('--strict') >= 0;
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-table-defaults] 找不到 ${srcDir}，用法: node check-table-defaults.cjs <目标工程根> [--strict]`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const items = []; // { file, line, missing: [], warning: [] }

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (!/<Table\b/.test(text)) continue;
    const rel = path.relative(root, file);
    for (const t of findTables(text)) {
      const missing = [];
      const warning = [];
      let detailMsg = null;
      for (const key of Object.keys(CHECKS)) {
        const c = CHECKS[key];
        if (key === 'columnsAllWidth') continue; // 由 extractColumnWidths 单独处理
        const has = c.present(t.frag, text);
        if (c.isWarning) {
          if (has) warning.push(key);
        } else {
          if (!has) missing.push(key);
        }
      }
      // 额外检查：所有列都带 width 会导致 eview-react Table 显示异常
      const cw = extractColumnWidths(t.frag, text);
      if (cw && cw.allHaveWidth && cw.total >= 2) {
        missing.push('columnsAllWidth');
        detailMsg = `columns 共 ${cw.total} 列全部带 width（eview-react Table 列全设 width 会导致表格显示异常——应至少有一列不设 width 让其自适应剩余空间）`;
      }
      if (missing.length || warning.length) {
        items.push({ file: rel, line: t.line, missing, warning, detail: detailMsg });
      }
    }
  }

  // ---- 报告 ----
  const tableFiles = files.filter((f) => /<Table\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-table-defaults] Table 默认值反向坑检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <Table> 的 ${tableFiles} 个）`);

  if (items.length === 0) {
    console.log('\n结论: PASS — 所有 <Table> 均已标记默认值相关 props，无需核对。');
    process.exit(0);
  }

  console.log(`\n发现 ${items.length} 个 <Table> 待核对（eview 默认值与 antd 相反，最易忘）：\n`);
  for (const it of items) {
    console.log(`- ${it.file}:${it.line}  <Table>`);
    if (it.detail) {
      console.log(`  [columnsAllWidth] ${it.detail}`);
    }
    const otherMissing = it.missing.filter(k => k !== 'columnsAllWidth');
    if (otherMissing.length) {
      console.log('  缺标记（对照源 antd 项目确认是否需补）：');
      for (const key of otherMissing) {
        console.log(`    · ${key}`);
        console.log(`      ${CHECKS[key].advice}`);
      }
    }
    if (it.warning.length) {
      console.log('  含标记（需确认源真会触发该行为）：');
      for (const key of it.warning) {
        console.log(`    · ${key}`);
        console.log(`      ${CHECKS[key].advice}`);
      }
    }
    console.log('');
  }

  console.log('结论: 待核对 — 上述 <Table> 需逐条对照源 antd 项目确认后补 props。');
  console.log('  详见 SKILL.md 已知坑点「Table 排序项/斑马纹/外层宽度/columns 更新」+ components/Table.md §5。');
  if (strict) process.exit(1);
}

main();
