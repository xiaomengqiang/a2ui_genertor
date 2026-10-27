#!/usr/bin/env node
/**
 * check-icon-shim.cjs — 方案A（<Icon> 运行时 fetch shim）保留硬闸（advisory）
 *
 * 防 match-icons.cjs --apply（C）/ LLM 在线匹配改写（B）跑完 + residual 处理后，converted src/ 里
 * 残留的 <Icon name={...}/> 兜底站点被默默保留方案 A——典型回归：① LLM 编造不存在的 Icon.md
 *   章节引用当保留依据（case1 .icon-result.json 实证：「函数参数传入的 icon prop（跨组件边界）」
 *   「OBJ[runtimeKey] 计算属性访问」两段 Icon.md 根本没有）；② C 下 match-icons.cjs 把跨边界
 *   props/useMemo/pushActivity 闭合字面量集误判 runtimeDataSites 后 LLM 不覆盖、直接留 shim。
 *
 * 闸门逻辑：扫 converted src/ 下所有 <Icon\b 站点（排除 src/shared/Icon/ shim 自身），逐处要求
 *   LLM 在 .icon-shim-justified.json 给闭合性结论：
 *   - { file, line, expr, source, closedSet: false, reason }
 *   - closedSet: true（集合闭合）→ 不该留 shim → 报 UNJUSTIFIED（应转 icon+）
 *   - closedSet: false → reason 须含 OPEN 集合具体证据（后端接口/运行时自由取值/props 字段且
 *     数据源不在已扫文件），空泛写「跨组件边界」→ 报 UNJUSTIFIED
 *   - reason 里「…」/§X 引用的 Icon.md 章节名须实有（防幻觉）
 *   - 无对应 justification 条目 → 报 UNJUSTIFIED
 *
 * 用法：
 *   node check-icon-shim.cjs <目标工程根>              # 输出报告，退出码 0
 *   node check-icon-shim.cjs <目标工程根> --strict     # 任一 UNJUSTIFIED 站点退出码 1
 *   node check-icon-shim.cjs <目标工程根> --icon-md <path> # 指定 Icon.md（默认 skill 目录下）
 *
 * 说明：
 * - 只递归扫描 <目标工程根>/src/ 下 .js/.jsx/.ts/.tsx；纯静态正则，不执行代码。
 * - .icon-shim-justified.json 放目标工程根；缺失则所有站点 UNJUSTIFIED。
 * - Icon.md 章节名提取自 `## `/`### ` 标题（auto-locate：<skill>/references/components/Icon.md）。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// OPEN 集合证据关键词（reason 须含其一才放行 closedSet:false）
const OPEN_KEYWORDS = [
  '后端', '接口', '运行时自由', '自由取值', 'runtime', 'backend',
  '数据源不在已扫文件', 'props 字段且源', 'API 响应', '响应字段',
];

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

function rel(p) {
  return p.replace(/\\/g, '/');
}

// 扫描 <Icon .../> 标签站点（含多行）。返回 [{ offset, tag, file, line, nameExpr }]。
// nameExpr：name="lit" 字面量 / name={EXPR} 表达式 / 缺失。
function scanShimSites(text) {
  const sites = [];
  const re = /<Icon\b[\s\S]*?(?:\/>|<\/Icon>)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const tag = m[0];
    // name="lit" 字面量
    const lit = tag.match(/\bname\s*=\s*["']([^"']*)["']/);
    let nameExpr = null;
    if (lit) {
      nameExpr = `"${lit[1]}"`;
    } else {
      // name={...} 表达式（平衡花括号）
      const br = tag.match(/\bname\s*=\s*\{/);
      if (br) {
        const start = br.index + br[0].length;
        let depth = 1;
        let i = start;
        for (; i < tag.length; i++) {
          if (tag.charCodeAt(i) === 123) depth++;
          else if (tag.charCodeAt(i) === 125) {
            depth--;
            if (depth === 0) break;
          }
        }
        nameExpr = tag.slice(start, i).trim();
      }
    }
    sites.push({ offset: m.index, tag, nameExpr });
  }
  return sites;
}

// 提取 Icon.md 章节标题名集合（## / ### 行，去 # 与前后空白 + 行内 anchor 链接）。
function loadIconHeadings(iconMdPath) {
  if (!iconMdPath || !fs.existsSync(iconMdPath)) return null;
  const text = fs.readFileSync(iconMdPath, 'utf8');
  const set = new Set();
  const re = /^#{2,3}\s+(.+?)\s*$/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    // 剥行内 `[...](...)` 链接，只留文字
    const name = m[1].replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim();
    if (name) set.add(name);
  }
  return set;
}

// 从 reason 文本里抓被引用的章节名（「…」/§X 两种形态）。
function extractCitedSections(reason) {
  const out = [];
  if (!reason) return out;
  const corner = /「([^」]+)」/g;
  let m;
  while ((m = corner.exec(reason)) !== null) out.push(m[1]);
  const sec = /§([^\s，。、；:：]+)/g;
  while ((m = sec.exec(reason)) !== null) out.push(m[1]);
  return out;
}

function parseArgs(argv) {
  const opts = { targetRoot: null, strict: false, iconMdPath: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--strict') opts.strict = true;
    else if (a === '--icon-md') opts.iconMdPath = argv[++i];
    else if (a === '-h' || a === '--help') {
      console.error(`用法: node check-icon-shim.cjs <目标工程根> [--strict] [--icon-md <path>]`);
      process.exit(0);
    } else if (!a.startsWith('--')) opts.targetRoot = a;
  }
  if (!opts.targetRoot) {
    console.error(`用法: node check-icon-shim.cjs <目标工程根> [--strict] [--icon-md <path>]`);
    process.exit(1);
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const targetRoot = path.resolve(opts.targetRoot);
  const srcDir = path.join(targetRoot, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-icon-shim] 目标工程无 src/ 目录: ${srcDir}`);
    process.exit(1);
  }

  // Icon.md auto-locate：<skill>/references/components/Icon.md（脚本在 <skill>/scripts/）
  const iconMdPath =
    opts.iconMdPath ||
    path.join(__dirname, '..', 'references', 'components', 'Icon.md');
  const headings = loadIconHeadings(iconMdPath);
  if (!headings) {
    console.warn(`[check-icon-shim] 未找到 Icon.md（${iconMdPath}），章节引用校验跳过`);
  }

  // 读 LLM 写的闭合性结论（缺失则全 UNJUSTIFIED）
  const justPath = path.join(targetRoot, '.icon-shim-justified.json');
  let justifications = [];
  if (fs.existsSync(justPath)) {
    try {
      justifications = JSON.parse(fs.readFileSync(justPath, 'utf8'));
      if (!Array.isArray(justifications)) justifications = [];
    } catch (e) {
      console.warn(`[check-icon-shim] .icon-shim-justified.json 解析失败：${e.message}`);
    }
  }
  // 按 "relPath:line" 索引（容错：file 用 basename 也匹配）
  const justByKey = new Map();
  const justByBaseLine = new Map();
  for (const j of justifications) {
    if (!j || !j.file) continue;
    const norm = rel(j.file).replace(/^\.?\//, '');
    justByKey.set(`${norm}:${j.line}`, j);
    justByBaseLine.set(`${path.basename(norm)}:${j.line}`, j);
  }

  const files = walk(srcDir, []);
  const unjustified = [];
  const staleImports = [];
  let totalShimSites = 0;
  // 旧 shim import 正则：legacy 具名 `import { Icon } from "...(assets/)?shared/icon(s).jsx?"（未改成 `@/shared/Icon` 默认导入）
  const staleShimImportRe = /import\s*\{\s*Icon\s*\}\s*from\s*['"][^'"]*?(?:assets\/)?shared\/icons?\.jsx?['"]/;
  for (const file of files) {
    // 跳过 shim 自身（src/shared/Icon/）
    if (rel(file).includes('/shared/Icon/')) continue;
    const text = fs.readFileSync(file, 'utf8');
    const sites = scanShimSites(text);
    if (sites.length && staleShimImportRe.test(text)) {
      // 残留 <Icon> 站点的文件仍 import 旧 assets/shared/icon 路径 → A3 后脚本不再 auto-修，须 LLM 手改 @/shared/Icon
      staleImports.push({ file: rel(file), issue: 'STALE-SHIM-IMPORT', detail: '残留 <Icon> 站点的文件仍 import 旧 `assets/shared/icon` 路径（具名）——A3 后脚本不 auto-修，须手改 `import Icon from "@/shared/Icon"`（默认导入），否则运行时 404' });
    }
    for (const s of sites) {
      totalShimSites++;
      const line = lineOfOffset(text, s.offset);
      const normFile = rel(file).replace(/^.*?src\//, 'src/');
      const baseFile = path.basename(file);
      const j =
        justByKey.get(`${normFile}:${line}`) ||
        justByKey.get(`${baseFile}:${line}`) ||
        justByBaseLine.get(`${baseFile}:${line}`);
      const site = { file: rel(file), line, expr: s.nameExpr, tag: s.tag };
      if (!j) {
        unjustified.push({ ...site, issue: 'no-justification', detail: '未声明闭合性结论（.icon-shim-justified.json 无对应条目）' });
        continue;
      }
      if (j.closedSet === true) {
        unjustified.push({ ...site, issue: 'closed-set-should-convert', detail: `closedSet=true：集合闭合，应转 icon+ 不应留 shim${j.reason ? '；reason: ' + j.reason : ''}` });
        continue;
      }
      // closedSet: false → reason 须含 OPEN 证据
      const reason = String(j.reason || '');
      const hasOpenEvidence = OPEN_KEYWORDS.some((k) => reason.includes(k));
      if (!hasOpenEvidence) {
        unjustified.push({ ...site, issue: 'vague-reason', detail: `closedSet=false 但 reason 缺 OPEN 集合证据（须含：后端/接口/运行时自由取值/props 字段且源不在已扫文件 等）。reason: "${reason}"` });
        continue;
      }
      // 引用的 Icon.md 章节须实有（防幻觉）
      if (headings) {
        const cited = extractCitedSections(reason);
        const phony = cited.filter((c) => !headings.has(c));
        if (phony.length) {
          unjustified.push({ ...site, issue: 'phantom-section-ref', detail: `reason 引用了不存在的 Icon.md 章节：${phony.map((c) => `「${c}」`).join('、')}` });
          continue;
        }
      }
    }
  }

  // 报告
  console.log('[check-icon-shim] 方案A 兜底保留校验报告');
  console.log('  契约：方案A 仅 name 值集合 OPEN（后端自由取值）；闭合集（含跨 prop/useMemo/推入函数边界、对象地图）须转 icon+。');
  console.log('        untraced 站点（脚本追不到源）交 LLM 按 Icon.md §name 解析 判，本闸拦闭集误留与未判站点。');
  console.log(`  扫描范围: src/（${files.length} 个文件，${totalShimSites} 处 <Icon> shim 站点，已排除 src/shared/Icon/）`);
  console.log(`  闭合性结论条目: ${justifications.length} 条（.icon-shim-justified.json）`);
  console.log(`  UNJUSTIFIED: ${unjustified.length} 处；STALE-SHIM-IMPORT: ${staleImports.length} 处`);
  if (unjustified.length) {
    console.log('');
    for (const u of unjustified) {
      console.log(`  ✗ ${u.file}:${u.line}  name=${u.expr || '(无)'}  [${u.issue}]`);
      console.log(`      ${u.detail}`);
    }
  }
  if (staleImports.length) {
    console.log('');
    for (const s of staleImports) {
      console.log(`  ✗ ${s.file}  [${s.issue}]`);
      console.log(`      ${s.detail}`);
    }
  }
  if (unjustified.length || staleImports.length) {
    console.log('');
    console.log('修复：按 Icon.md §name 解析与方案A 判定（统一原则）枚举闭集叶子转 icon+，');
    console.log('     或在 .icon-shim-justified.json 补具体 OPEN 集合证据（后端接口/运行时自由取值/props 字段且源不在已扫文件）；');
    console.log('     STALE-SHIM-IMPORT：残留 <Icon> 文件手改 `import Icon from "@/shared/Icon"`（默认导入）。');
  } else if (totalShimSites) {
    console.log('  全部残留 shim 站点已声明具体 OPEN 集合证据、无 stale import——PASS');
  } else {
    console.log('  无残留 <Icon> shim 站点——PASS');
  }

  if (opts.strict && (unjustified.length || staleImports.length)) {
    process.exit(1);
  }
}

main();
