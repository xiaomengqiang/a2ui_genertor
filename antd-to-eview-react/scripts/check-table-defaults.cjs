#!/usr/bin/env node
/**
 * check-table-defaults.cjs — Table 默认值反向坑检查（advisory）
 *
 * 对应 Table.md §4/§5「Table 排序/斑马纹/外层宽度/columns 更新」四连：
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
 * columnsAllWidth（第 6 项）扫描采用 AST（@babel/parser）：
 *   纯正则的 extractColumnWidths 只扫第一个 [...] 数组体，对 columns={raw.map(c=>({width}))}、
 *   Array.from、spread、function 回调 return 等动态形态全漏（advisory 不触发）。
 *   AST 从 columns 表达式收集【顶层列对象】（数组直接元素 / .map 回调 return 的对象，不深入
 *   嵌套——避免列 render 回调里返回的 {children,props} 被误计入列数），逐个查 width 属性。
 *   其余 5 项是 tag 级 / 文件级文本搜索，不涉及列对象，保留正则。Table 元素定位也改 AST
 *   （精准取开标签节点，frag = text.slice(start, end)）。与字段残留类 check 共用 lib/ast-helpers.cjs。
 *
 * 用法：
 *   node check-table-defaults.cjs <目标工程根>          # advisory，列出待核项，退出码 0
 *   node check-table-defaults.cjs <目标工程根> --strict # 有待核项 exit 1（接入步骤 3 门禁）
 *
 * 退出码：0=无待核项/通过，1=有待核项（--strict）/无解析器（--strict），2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

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
    present: () => false, // 由 AST 顶层列对象扫描单独处理，不在此触发
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

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-table-defaults] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(strict ? 1 : 2);
  }

  const files = walk(srcDir, []);
  const items = []; // { file, line, missing: [], warning: [] }
  const parseWarnings = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (!/<Table\b/.test(text)) continue;
    const rel = path.relative(root, file);

    // 解析 AST；解析失败仅告警跳过该文件（advisory 检查，不阻塞——但 --strict 下记为待核）
    const parsed = H.parse(parser, text);
    if (parsed.error) {
      parseWarnings.push(`${rel}: ${parsed.error.message}`);
      continue;
    }
    const ast = parsed.ast;

    const tables = H.findJsxElements(ast, ['Table']);
    for (const { el } of tables) {
      const frag = text.slice(el.start, el.end);
      const line = (el.loc && el.loc.start) ? el.loc.start.line : lineOfOffset(text, el.start);
      const missing = [];
      const warning = [];
      let detailMsg = null;

      for (const key of Object.keys(CHECKS)) {
        if (key === 'columnsAllWidth') continue; // 由 AST 顶层列对象扫描单独处理
        const c = CHECKS[key];
        const has = c.present(frag, text);
        if (c.isWarning) {
          if (has) warning.push(key);
        } else {
          if (!has) missing.push(key);
        }
      }

      // columnsAllWidth：AST 收集【顶层列对象】（数组元素 / .map 回调 return，不深入嵌套——
      // 列 render 回调里返回的 {children,props} 不算列），逐个查 width 属性。
      // 覆盖 .map/Array.from/spread/function 回调/标识符追源 等动态形态。
      // 规则：全列有 width 且（列数≥2 或 mapSourced）才报——.map 回调静态只产 1 个形状对象
      // 但运行时可能 N 列，故 mapSourced 时不看列数阈值，形状带 width 即报（advisory，运行时核列数）。
      const colExpr = H.getAttrExpr(el, 'columns');
      if (colExpr) {
        const { objects: cols, mapSourced } = H.collectTopLevelObjects(ast, colExpr);
        if (cols.length >= 1) {
          const withWidth = cols.filter((o) => H.findProperty(o, 'width')).length;
          const allWidth = withWidth === cols.length;
          if (allWidth && (cols.length >= 2 || mapSourced)) {
            missing.push('columnsAllWidth');
            const cntDesc = mapSourced
              ? `${cols.length} 个列形状（.map/Array.from 动态生成，运行时列数可能更多）`
              : `${cols.length} 列`;
            detailMsg = `columns 共 ${cntDesc}全部带 width（eview-react Table 列全设 width 会导致表格显示异常——应至少有一列不设 width 让其自适应剩余空间）`;
          }
        }
      }

      if (missing.length || warning.length) {
        items.push({ file: rel, line, missing, warning, detail: detailMsg });
      }
    }
  }

  // ---- 报告 ----
  const tableFiles = files.filter((f) => /<Table\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-table-defaults] Table 默认值反向坑检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <Table> 的 ${tableFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件被跳过，请人工复核 Table 默认值 props】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

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
  console.log('  详见 components/Table.md §4/§5（Table 排序项/斑马纹/外层宽度/columns 更新）。');
  if (strict) process.exit(1);
}

main();
