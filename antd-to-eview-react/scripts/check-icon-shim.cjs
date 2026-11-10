#!/usr/bin/env node
/**
 * check-icon-shim.cjs — 方案A（<Icon> 运行时 fetch shim）保留硬闸（默认 advisory；`--strict` → 任一违规 exit 1，§3.0 图标步骤用 --strict）
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
 * 数据源字面量半改扫描（形态无关）：另扫数据结构里的 icon-ish 字段字符串字面量
 *   `icon|iconName|iconType|iconKey : "lit"`（对象字段位，不命中 JSX 属性 icon=...）。纯字符串字面量
 *   按定义闭合 → 必须转 icon+；转换后仍命中即未转 → 报 UNCONVERTED-ICON-SOURCE（消费端已转 {x.icon}
 *   而源未转→渲染文本）。唯一放行：真 OPEN 运行时字段的默认/兜底，且消费端是保留并判 OPEN 的 <Icon>
 *   shim → 须在该字面量条目补 closedSet:false + OPEN 证据 + linksShim 指向该 shim 站点（闸门校验）。
 *
 * 改写后图标交互 props 丢失扫描（PROP_DROPPED_ON_ICON_REWRITE）：对应 Icon.md「⚠️ 硬约束：改写
 *   <Icon> 调用点必须保留原 DOM/交互 props」。闭集自动改写站点（match-icons.cjs --apply / --apply-decisions）
 *   经 collectPassthroughProps + buildReplacement/buildDataIconElement 已原样透传 <Icon> 上的非 icon props
 *   （onClick、onMouse*、onKey*、title、aria-*、role、tabIndex、style、className、id、data-* 等；仅 name/size/color/variant/className/style 被显式映射）。
 *   故闭集站点不会丢 props；本扫描兜底拦的是 **residual 跨边界手改站点 / 剥 Button-IconButton 外壳**
 *   （props 在父 <Button> 上、--apply 不碰 Button）时 LLM 漏搬 props（实测回归主因：主题切换 <Icon onClick={toggleDark}/>
 *   手改漏 onClick → toggleDark 成死变量 → 暗色三轨永不翻转）。
 *   数据来源：读 .umd-conversion.json 的 iconCallSites.interactiveProps（由 umd-to-antd-vite 的
 *   extract-umd.cjs 扫源 <Icon> 调用点记录，含 index.page.html 内联源码）。提取源调用点携带的关键
 *   事件 handler 值签名（如 onClick={toggleDark} 的值 "toggleDark"），在产物 src/ 扫所有 <IconPlusIc*>
 *   站点核对该值签名是否保留。源有 handler 值但产物所有 IconPlusIc 站点都无 → 报 PROP_DROPPED。
 *   **覆盖范围**：仅核 HANDLER_PROPS（onClick、onMouse*、onKey*、onFocus、onBlur、onTouch*、onPress）的
 *   标识符/成员表达式值签名；非 handler props（title、aria-*、role、tabIndex、style、className）与箭头函数
 *   handler（onClick={()=>fn()}）为**已知盲区不报**，须人工复核。精确配对（非启发式）、误报极低。
 *   check-dark-mode.cjs 静态三轨 PASS 拦不住此运行时入口断裂，本检查补盲区（实测回归：case4/case5/
 *   码趣 3 工程暗色失效即此缺陷，check-dark-mode 全 PASS 但 onClick 丢失）。
 *
 * 条件式图标站点漏包 {} 扫描（TERNARY_WRAP_LOST）：对应 Icon.md §「<Icon name={X}/> 改写的 {} 上下文
 *   规则」。LLM residual 手改的**任意条件式图标站点**（扁平三元 / 链式嵌套三元 / `&&` 条件 / 裸标识符条件 /
 *   跨边界追源条件）在 JSX 子节点位须整体包一层 `{}`（`{cond ? <IconPlusIc…/> : <IconPlusIc…/>}`，
 *   非"每分支各包"）。脚本自动路径（扁平字面量三元 + 全叶 confirmed 链式三元）由 match-icons.cjs 的
 *   `wrapIfNeeded` 确定性加 `{}`——主题切换 `isDark?"sun":"moon"` 即此路径，稳定不受影响；本扫描兜底拦的是
 *   residual 路径：分支非字面量 / 链式未确认 / 跨边界 untraced / 扫描漏掉的 tag 落 residual 交 LLM 手改时，
 *   LLM 偶尔只写 `cond ? <A/> : <B/>` 不包外层 `{}` → JSX 子节点位被解析为对象字面量/块语句语法错或静默
 *   渲染错。算法：对每个 `<IconPlusIc…/>` 站点向后回溯找所属条件表达式最外层起点（深度 0 遇 `?`/`&&`/`||`），
 *   起点处做单字符 lookbehind：`>`（JSX 子节点开标签，非 `=>`）或 `}` → JSX 子节点位且未包 → 报
 *   TERNARY_WRAP_LOST；`{`（已包）/ `(` / `[` / `,` / `=` / `;` 等表达式位 → 不报（与 wrapIfNeeded 一致，
 *   宁可漏报不误报，residual 本就有 doc 指引 + LLM 复核）。
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

// 判 text[pos]（'>'）是否为 JSX 开标签闭合（如 <div>、<Comp className="x">），而非比较运算符 >。
// 用法：从 pos-1 向回走，遇 '<' 即 JSX 闭合；遇 > ; { } ) ] 等表达式边界即比较运算符。
// 消歧 count > 0（比较，'<' 左侧是 '>' 即 <div> 的 '>'）vs <div>cond（JSX 闭合，'<' 左侧是 '<'）。
function isJsxCloseGt(text, pos) {
  let k = pos - 1;
  while (k >= 0 && /\s/.test(text[k])) k--;
  if (k < 0) return false;
  while (k >= 0) {
    const ch = text[k];
    if (ch === '<') return true;
    if (ch === '>' || ch === ';' || ch === '{' || ch === '}' || ch === ')' || ch === ']') return false;
    k--;
  }
  return false;
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
  const opts = { targetRoot: null, strict: false, iconMdPath: null, initJustified: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--strict') opts.strict = true;
    else if (a === '--init-justified') opts.initJustified = true;
    else if (a === '--icon-md') opts.iconMdPath = argv[++i];
    else if (a === '-h' || a === '--help') {
      console.error(`用法: node check-icon-shim.cjs <目标工程根> [--strict] [--init-justified] [--icon-md <path>]\n  --init-justified  扫残留 <Icon> shim + 数据源 icon:"lit" 字面量，写出 .icon-shim-justified.json 骨架（file/line/expr/source 预填，closedSet/reason 留空待 LLM 填）`);
      process.exit(0);
    } else if (!a.startsWith('--')) opts.targetRoot = a;
  }
  if (!opts.targetRoot) {
    console.error(`用法: node check-icon-shim.cjs <目标工程根> [--strict] [--init-justified] [--icon-md <path>]`);
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

  // ── --init-justified：扫残留站点写 .icon-shim-justified.json 骨架（N5）─────────
  // 复用 scanShimSites + 数据源字面量扫描拿全残留站点；file/line/expr/source 脚本预填，
  // closedSet/reason 留空待 LLM 填（reason 须含 OPEN 关键词，见 OPEN_KEYWORDS）。
  // 幂等：已存在的条目（按 file:line 键）保留不覆盖，仅补未覆盖站点。
  if (opts.initJustified) {
    const justPath = path.join(targetRoot, '.icon-shim-justified.json');
    const files = walk(srcDir, []);
    const skeleton = [];
    const seenKeys = new Set();
    // 统一 key 为 src/ 相对形态（兼容全路径/相对路径写入），与扫描侧 normFile 一致，防重复 init 产生重复条目。
    const srcRel = (p) => {
      const r = rel(p);
      const idx = r.search(/(^|[\\\/])src[\\\/]/);
      return idx >= 0 ? r.slice(r.indexOf('src')) : r.replace(/^\.?\//, '');
    };
    // 保留已存在条目（LLM 已填的 closedSet/reason 不覆盖）
    let existing = [];
    if (fs.existsSync(justPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(justPath, 'utf8'));
        if (Array.isArray(parsed)) existing = parsed;
      } catch (e) {
        console.warn(`[check-icon-shim] 现有 .icon-shim-justified.json 解析失败，将覆盖：${e.message}`);
      }
    }
    for (const j of existing) {
      if (!j || !j.file) continue;
      seenKeys.add(`${srcRel(j.file)}:${j.line}`);
      skeleton.push(j);
    }
    let addedShim = 0;
    let addedSource = 0;
    const ICON_FIELD_RE_INIT = /\b(icon|iconName|iconType|iconKey)\s*:\s*["']([A-Za-z][\w-]*)["']/g;
    for (const file of files) {
      if (rel(file).includes('/shared/Icon/')) continue;
      const text = fs.readFileSync(file, 'utf8');
      const normFile = srcRel(file);
      // 残留 <Icon> shim 站点
      for (const s of scanShimSites(text)) {
        const line = lineOfOffset(text, s.offset);
        const key = `${normFile}:${line}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        skeleton.push({
          file: rel(file), line, expr: s.nameExpr, source: 'shim-site',
          closedSet: null, reason: '',
        });
        addedShim++;
      }
      // 数据源 icon:"lit" 字面量（半改态；须 closedSet:false + OPEN 证据 + linksShim 关联保留 shim）
      ICON_FIELD_RE_INIT.lastIndex = 0;
      let m;
      while ((m = ICON_FIELD_RE_INIT.exec(text)) !== null) {
        const line = lineOfOffset(text, m.index);
        const key = `${normFile}:${line}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        skeleton.push({
          file: rel(file), line, expr: `${m[1]}:"${m[2]}"`, source: 'data-source-literal',
          field: m[1], value: m[2], closedSet: null, reason: '', linksShim: '',
        });
        addedSource++;
      }
    }
    skeleton.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
    fs.writeFileSync(justPath, JSON.stringify(skeleton, null, 2) + '\n', 'utf8');
    console.log('[check-icon-shim] --init-justified 完成');
    console.log(`  骨架写入 ${justPath}（共 ${skeleton.length} 条；保留已存在 ${existing.length} 条，新增 shim 站点 ${addedShim}、数据源字面量 ${addedSource}）。`);
    console.log('  待 LLM 逐条填 closedSet + reason：闭合集→closedSet:true（应转 icon+，不该留 shim）；真 OPEN→closedSet:false 且 reason 须含 OPEN 证据（' + OPEN_KEYWORDS.join('/') + '）；数据源字面量另填 linksShim 指向保留 shim。');
    return;
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
  const unconvertedSources = []; // 数据结构里残留的 icon:"lit" 字面量（半改态：消费端转 {x.icon}、源未转→渲染文本）
  const convertedConsumers = []; // 已转消费端签名 {x.icon}（配对上下文，帮定位半改对）
  const openShimSites = new Set(); // 判 OPEN 放行的保留 <Icon> shim 站点（baseFile:line / normFile:line），供数据源字面量 linksShim 校验
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
      // 该 shim 站点判 OPEN 放行 → 记入 openShimSites，供数据源字面量 linksShim 校验
      openShimSites.add(`${baseFile}:${line}`);
      openShimSites.add(`${normFile}:${line}`);
    }
  }

  // ── 数据源字面量扫描：转换后数据结构里残留的 icon:"lit" 字符串（半改态）
  // 形态无关：数据数组 / 对象地图 / 跨边界 useMemo / useState / wrapper 默认值里的 icon 字段纯字符串字面量
  //   按定义闭合（值集合=写死字面量）→ 必须转 icon+，不可判 OPEN。转换后仍命中即未转。
  // 放行唯一例外：字面量是某真 OPEN 运行时字段的默认/兜底，且消费端是保留并判 OPEN 的 <Icon> shim
  //   → 须在 .icon-shim-justified.json 给该字面量一条 closedSet:false + OPEN 证据 + linksShim 指向该 shim。
  const ICON_FIELD_RE = /\b(icon|iconName|iconType|iconKey)\s*:\s*["']([A-Za-z][\w-]*)["']/g;
  const CONV_CONSUMER_RE = /\{([A-Za-z_$][\w$]*)\.(icon|iconName|iconType|iconKey)\}/g; // 已转消费端 {x.icon}
  for (const file of files) {
    if (rel(file).includes('/shared/Icon/')) continue;
    const text = fs.readFileSync(file, 'utf8');
    let m;
    ICON_FIELD_RE.lastIndex = 0;
    while ((m = ICON_FIELD_RE.exec(text)) !== null) {
      const line = lineOfOffset(text, m.index);
      const field = m[1];
      const value = m[2];
      const normFile = rel(file).replace(/^.*?src\//, 'src/');
      const baseFile = path.basename(file);
      const j =
        justByKey.get(`${normFile}:${line}`) ||
        justByKey.get(`${baseFile}:${line}`) ||
        justByBaseLine.get(`${baseFile}:${line}`);
      // 放行：判 OPEN + OPEN 证据 + linksShim 指向有效保留 shim
      let justified = false;
      if (j && j.closedSet === false) {
        const reason = String(j.reason || '');
        const hasOpen = OPEN_KEYWORDS.some((k) => reason.includes(k));
        const link = String(j.linksShim || '');
        const ci = link.lastIndexOf(':');
        if (hasOpen && ci > 0) {
          const lBase = link.slice(0, ci).split('/').pop();
          const lLine = link.slice(ci + 1);
          if (openShimSites.has(`${lBase}:${lLine}`) || openShimSites.has(`${link.slice(0, ci)}:${lLine}`)) {
            justified = true;
          }
        }
      }
      if (!justified) {
        unconvertedSources.push({
          file: rel(file), line, field, value,
          issue: 'UNCONVERTED-ICON-SOURCE',
          detail: `数据结构 ${field}: "${value}" 仍是字符串字面量（按定义闭合须转 icon+）——若消费端已转 {x.${field}} 则半改致渲染文本；转 icon+（源在别文件也追过去改），或在 .icon-shim-justified.json 声明 closedSet:false + OPEN 证据 + linksShim 关联保留 shim`,
        });
      }
    }
    CONV_CONSUMER_RE.lastIndex = 0;
    while ((m = CONV_CONSUMER_RE.exec(text)) !== null) {
      convertedConsumers.push({ file: rel(file), line: lineOfOffset(text, m.index), expr: m[0] });
    }
  }

  // ── 改写后 <IconPlusIc*> 交互 props 丢失扫描（PROP_DROPPED_ON_ICON_REWRITE）
  // 对应 Icon.md「⚠️ 硬约束：改写 <Icon> 调用点必须保留原 DOM/交互 props」
  // 数据来源：.umd-conversion.json 的 iconCallSites.interactiveProps（由 extract-umd.cjs 扫源 <Icon> 记录）。
  //   match-icons.cjs --apply / --apply-decisions 把 <Icon name=.../> 改写成 <IconPlusIc*/>（含三元条件渲染）
  //   时，闭集站点已由 collectPassthroughProps + buildReplacement/buildDataIconElement 的 passthrough 机制
  //   原样透传 onClick/title/aria-*/style/className 等 props。故闭集自动改写站点不会丢 props，
  //   本检查兜底拦的是 **residual 跨边界手改站点**——LLM 按 Icon.md 步 7 手工转 <Icon> 时漏搬 props
  //   （实测回归主因：主题切换 <Icon onClick={toggleDark}/> 手改漏 onClick → toggleDark 成死变量）。
  //   已知盲区（用户暂未要求补）：① 箭头函数 handler 值（onClick={()=>fn()}，行 ~427 排除，丢了不报）；
  //   ② 非 handler props（title/aria-*/role/tabIndex/style/className，本检查只查 HANDLER_PROPS，丢了静默）。
  // 检测策略（精确配对，非启发式）：读交接文档里带 interactiveProps 的源 <Icon> 调用点，提取关键事件
  //   handler 的值签名（如 onClick={toggleDark} 的值 "toggleDark"），在产物 src/ 扫所有 <IconPlusIc*>
  //   站点，逐一核对该值签名是否出现在某 IconPlusIc 站点的同名 prop 上。源有该 handler 值但产物无任何
  //   IconPlusIc 站点携带 → 判 props 在改写时丢失 → 报 PROP_DROPPED_ON_ICON_REWRITE。
  // 此检测读交接文档（用户要求"交接文档写明需检查 icon 的，check 读交接文档"），精确配对、误报极低。
  //   check-dark-mode.cjs 静态三轨 PASS 拦不住此运行时入口断裂，本检查补盲区（实测回归：case4/case5/
  //   码趣 3 工程暗色失效即此缺陷——源 <Icon onClick={toggleDark}> 改写后 onClick 丢失）。
  const propDropped = [];
  // 关键事件 handler prop（值是函数引用，丢失即交互断链；onClick 为主，兼 onMouse*/onKey*/onPress 等）
  const HANDLER_PROPS = ['onClick', 'onDoubleClick', 'onMouseDown', 'onMouseUp', 'onMouseEnter',
    'onMouseLeave', 'onMouseMove', 'onMouseOver', 'onMouseOut', 'onKeyDown', 'onKeyPress', 'onKeyUp',
    'onFocus', 'onBlur', 'onTouchStart', 'onTouchEnd', 'onTouchMove', 'onPress'];
  // 读交接文档 iconCallSites（带 interactiveProps 的源调用点）
  let iconCallSites = [];
  const convPath = path.join(targetRoot, '.umd-conversion.json');
  if (fs.existsSync(convPath)) {
    try {
      const conv = JSON.parse(fs.readFileSync(convPath, 'utf8'));
      iconCallSites = Array.isArray(conv.iconCallSites) ? conv.iconCallSites : [];
    } catch (e) {
      console.warn(`[check-icon-shim] .umd-conversion.json 解析失败（icon props 核对跳过）：${e.message}`);
    }
  }
  // 提取源调用点里"关键事件 handler 的值签名"（如 onClick={toggleDark} → "toggleDark"）
  // 仅取纯标识符/成员表达式值（排除箭头函数匿名值，因匿名值无稳定签名难配对）
  // 排除"值名 == handler prop 名"的透传场景（如 onClick={onClick}，从 props 解构同名透传，
  //   属 wrapper 组件动态 prop 传递、非固定函数引用，丢失检测无意义——产物保留即透传，不报）
  const sourceHandlerValues = new Map(); // value → [{ prop, sourceSite }]
  for (const site of iconCallSites) {
    if (!site.interactiveProps) continue;
    for (const p of site.interactiveProps) {
      if (!HANDLER_PROPS.includes(p.name) || !p.hasValue || !p.value) continue;
      // 纯标识符（toggleDark）或成员表达式（this.handle）；排除箭头函数/函数表达式（()=>...）
      if (/^=>|^\(.*\)\s*=>|^function\b/.test(p.value)) continue;
      const val = p.value.trim();
      if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(val)) continue;
      // 排除同名透传（onClick={onClick} / onMouseDown={onMouseDown}）——wrapper 组件动态 prop 透传
      if (val === p.name) continue;
      if (!sourceHandlerValues.has(val)) sourceHandlerValues.set(val, []);
      sourceHandlerValues.get(val).push({ prop: p.name, sourceSite: site });
    }
  }
  if (sourceHandlerValues.size) {
    // 扫产物 src/ 所有 <IconPlusIc*> 站点，收集它们携带的 handler 值签名
    const IconPlusRe = /<IconPlusIc[A-Za-z0-9]*\b[\s\S]*?(?:\/>|<\/IconPlusIc[A-Za-z0-9]*>)/g;
    const productHandlerValues = new Set(); // 产物 IconPlusIc 站点携带的 handler 值（如 toggleDark）
    for (const file of files) {
      if (rel(file).includes('/shared/Icon/')) continue;
      const text = fs.readFileSync(file, 'utf8');
      IconPlusRe.lastIndex = 0;
      let im;
      while ((im = IconPlusRe.exec(text)) !== null) {
        const tag = im[0];
        for (const hp of HANDLER_PROPS) {
          // handler={value} 形态（平衡 {} 取值）
          const re = new RegExp(`\\b${hp}\\s*=\\s*\\{([^}]*)\\}`);
          const hm = tag.match(re);
          if (hm) {
            const v = hm[1].trim();
            if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(v)) {
              productHandlerValues.add(v);
            }
          }
        }
      }
    }
    // 核对：源有 handler 值，但产物所有 IconPlusIc 站点都无 → 报丢失
    for (const [val, sources] of sourceHandlerValues) {
      if (productHandlerValues.has(val)) continue; // 产物有该 handler 值 → 保留成功
      for (const s of sources) {
        propDropped.push({
          file: s.sourceSite.file,
          line: s.sourceSite.line,
          fn: val,
          sourceName: s.sourceSite.name,
          issue: 'PROP_DROPPED_ON_ICON_REWRITE',
          detail: `源 <Icon> 调用点（${s.sourceSite.file}:${s.sourceSite.line}，name=${s.sourceSite.name || '(无)'}）携带 ${s.prop}={${val}}，但产物 src/ 所有 <IconPlusIc*> 站点均无 ${s.prop}={${val}}——疑似 match-icons.cjs --apply / 手工图标替换把原 <Icon> 改写成 <IconPlusIc*> 时丢失了 ${s.prop}。check-dark-mode.cjs 静态三轨 PASS 拦不住此运行时入口断裂（${val} 若是暗色切换函数则 isDark 永不翻转）。修复：在产物对应图标站点补回 ${s.prop}={${val}}（+ title/role/tabIndex 等 a11y props），见 Icon.md「⚠️ 硬约束：改写 <Icon> 调用点必须保留原 DOM/交互 props」改写清单。`,
        });
      }
    }
  }

  // ── 条件式图标站点漏包外层 {} 扫描（TERNARY_WRAP_LOST）
  // 对应 Icon.md §「<Icon name={X}/> 改写的 {} 上下文规则」+ 步 7 residual {} 义务。
  // 防：LLM residual 手改条件式图标站点（三元 / && / ||）在 JSX 子节点位漏包外层 {}——
  //   脚本自动路径（扁平字面量三元 + 全叶 confirmed 链式三元）由 wrapIfNeeded 确定性加 {}、稳定不出错；
  //   residual 手改由 LLM 加，漏加致 JSX 解析为对象字面量/块语句语法错或静默渲染错。本扫描兜底 residual 路径。
  // 检测：对每个 <IconPlusIc*> 站点，向后走找其所属条件式的最外层 ? / && / ||（深度 0），
  //   再从该算子向左回溯到条件式左边界（深度负 opener { ( [ / JSX 闭合 > / ; , =）：
  //   边界 > (isJsxCloseGt) → JSX 子节点位且未包 {} → 报 TERNARY_WRAP_LOST；
  //   边界 { → 已包（JSX 容器/块/prop 容器，均正确不报）；边界 ( [ ; , = → 表达式位裸正确不报。
  //   比较运算符 >（如 count > 0）由 isJsxCloseGt 消歧（向左遇 '>' 等 → 非闭合 → 不报），避免误报。
  //   嵌套/链式三元取最外层 ?；同一条件式多 icon 站点按 (file:边界偏移) 去重只报一次。宁漏不误。
  const ternaryWrapLost = [];
  const IconPlusReWrap = /<IconPlusIc[A-Za-z0-9]*\b[\s\S]*?(?:\/>|<\/IconPlusIc[A-Za-z0-9]*>)/g;
  const wrapFlaggedStarts = new Set();
  for (const file of files) {
    const relFile = rel(file);
    if (relFile.includes('/shared/Icon/')) continue;
    const text = fs.readFileSync(file, 'utf8');
    IconPlusReWrap.lastIndex = 0;
    let im;
    while ((im = IconPlusReWrap.exec(text)) !== null) {
      const iconStart = im.index;
      // phase 1：从 iconStart 向后走，找最外层（最左）深度 0 的条件算子 ? / && / ||
      let depth = 0;
      let i = iconStart - 1;
      let outermostOp = -1;
      const phaseBound = Math.max(0, iconStart - 800);
      while (i >= phaseBound) {
        const ch = text[i];
        if (ch === ')' || ch === ']' || ch === '}') depth++;
        else if (ch === '(' || ch === '[' || ch === '{') {
          if (depth === 0) break; // 触外层 opener → 边界（条件式在此 opener 之内）
          depth--;
        } else if (depth === 0) {
          if (ch === '?') outermostOp = i;
          else if (ch === '&' && i >= 1 && text[i - 1] === '&') outermostOp = i - 1;
          else if (ch === '|' && i >= 1 && text[i - 1] === '|') outermostOp = i - 1;
          // 语句/表达式边界：到这些即条件式不可向左延伸，停（防跨语句/跨箭头体误追最外层 ?）
          //   ; — 语句尾；=>（箭头）的 '>' 前字符是 '=' — 箭头体边界（如 `() => cond ? <A/> : <B/>`，
          //   `()` 是平衡括号对，扫过 depth 归 0 不 break，须靠 `=>` 兜底停，否则跨语句追到前一个 ?）。
          //   不在 '>'(JSX 闭合) 处停——保留嵌套三元取最外层 ? 的能力（<Wrapper>cond ? <div>a?<A/>:<B/></div> : null</Wrapper>）。
          else if (ch === ';') break;
          else if (ch === '>' && i >= 1 && text[i - 1] === '=') break; // 箭头 =>
        }
        i--;
      }
      if (outermostOp < 0) continue; // 该 icon 不在条件式内 → 跳过（plain icon+ 子节点无需 {}）
      // phase 2：从 outermostOp 向左回溯到条件式左边界（depth 重置 0）
      let d2 = 0;
      let j = outermostOp - 1;
      let boundary = null; // { ch, pos }
      const condBound = Math.max(0, outermostOp - 200);
      while (j >= condBound) {
        const ch = text[j];
        if (ch === ')' || ch === ']' || ch === '}') d2++;
        else if (ch === '(' || ch === '[' || ch === '{') {
          if (d2 === 0) { boundary = { ch, pos: j }; break; }
          d2--;
        } else if (d2 === 0) {
          if (ch === '>' && isJsxCloseGt(text, j)) { boundary = { ch: '>', pos: j }; break; }
          if (ch === ';' || ch === ',' || ch === '=') { boundary = { ch, pos: j }; break; }
        }
        j--;
      }
      if (!boundary || boundary.ch !== '>') continue; // {/( /[/;/,/=/超界 → 不报
      const startKey = relFile + ':' + boundary.pos;
      if (wrapFlaggedStarts.has(startKey)) continue;
      wrapFlaggedStarts.add(startKey);
      const segEnd = Math.min(text.length, iconStart + im[0].length);
      let seg = text.slice(boundary.pos + 1, segEnd).replace(/\s+/g, ' ').trim();
      if (seg.length > 80) seg = seg.slice(0, 77) + '...';
      ternaryWrapLost.push({
        file: relFile, line: lineOfOffset(text, boundary.pos + 1), expr: seg,
        issue: 'TERNARY_WRAP_LOST',
        detail: `条件式图标表达式在 JSX 子节点位漏包外层 {}——前一个非空白字符是 '>'（JSX 开标签闭合），剥离 <Icon/> 后整体条件表达式须包 {}（见 Icon.md §「<Icon name={X}/> 改写的 {} 上下文规则」）。修复：整体用 {} 包裹，如 {cond ? <IconPlusIc…/> : <IconPlusIc…/>}（整体包一层，非每分支各包）。脚本自动路径（扁平字面量三元）由 wrapIfNeeded 确定性加 {}、稳定；此处是 residual 手改漏加。`,
      });
    }
  }

  // 报告
  console.log('[check-icon-shim] 方案A 兜底保留校验报告');
  console.log('  契约：方案A 仅 name 值集合 OPEN（后端自由取值）；闭合集（含跨 prop/useMemo/推入函数边界、对象地图）须转 icon+。');
  console.log('        untraced 站点（脚本追不到源）交 LLM 按 Icon.md §name 解析 判，本闸拦闭集误留与未判站点。');
  console.log(`  扫描范围: src/（${files.length} 个文件，${totalShimSites} 处 <Icon> shim 站点，已排除 src/shared/Icon/）`);
  console.log(`  闭合性结论条目: ${justifications.length} 条（.icon-shim-justified.json）`);
  console.log(`  UNJUSTIFIED: ${unjustified.length} 处；STALE-SHIM-IMPORT: ${staleImports.length} 处；UNCONVERTED-ICON-SOURCE: ${unconvertedSources.length} 处；PROP_DROPPED_ON_ICON_REWRITE: ${propDropped.length} 处；TERNARY_WRAP_LOST: ${ternaryWrapLost.length} 处`);
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
  if (unconvertedSources.length) {
    console.log('');
    for (const u of unconvertedSources) {
      console.log(`  ✗ ${u.file}:${u.line}  ${u.field}="${u.value}"  [${u.issue}]`);
      console.log(`      ${u.detail}`);
    }
    if (convertedConsumers.length) {
      console.log('  配对：已转消费端签名（{x.icon}，源若未转即半改对）：');
      for (const c of convertedConsumers.slice(0, 20)) {
        console.log(`    · ${c.file}:${c.line}  ${c.expr}`);
      }
      if (convertedConsumers.length > 20) console.log(`    …余 ${convertedConsumers.length - 20} 处`);
    }
  }
  if (propDropped.length) {
    console.log('');
    for (const p of propDropped) {
      console.log(`  ✗ ${p.file}:${p.line}  fn=${p.fn}  [${p.issue}]`);
      console.log(`      ${p.detail}`);
    }
  }
  if (ternaryWrapLost.length) {
    console.log('');
    for (const t of ternaryWrapLost) {
      console.log(`  ✗ ${t.file}:${t.line}  [${t.issue}]  ${t.expr}`);
      console.log(`      ${t.detail}`);
    }
  }
  if (unjustified.length || staleImports.length || unconvertedSources.length || propDropped.length || ternaryWrapLost.length) {
    console.log('');
    console.log('修复：按 Icon.md §name 解析与方案A 判定（统一原则）枚举闭集叶子转 icon+，');
    console.log('     或在 .icon-shim-justified.json 补具体 OPEN 集合证据（后端接口/运行时自由取值/props 字段且源不在已扫文件）；');
    console.log('     STALE-SHIM-IMPORT：残留 <Icon> 文件手改 `import Icon from "@/shared/Icon"`（默认导入）。');
    console.log('     UNCONVERTED-ICON-SOURCE：数据源两半同改——把 icon:"lit" 改 <IconPlusIc…/> + import 注入源文件（源在别文件也追过去改）；');
    console.log('       仅真 OPEN 默认/兜底字面量可留，须 closedSet:false + OPEN 证据 + linksShim 关联保留 shim。');
    console.log('     PROP_DROPPED_ON_ICON_REWRITE：给报出的暗色切换图标补回 onClick={fn}（+ title/role/tabIndex 等 a11y props），');
    console.log('       见 Icon.md「⚠️ 硬约束：改写 <Icon> 调用点必须保留原 DOM/交互 props」改写清单。');
    console.log('     TERNARY_WRAP_LOST：条件式图标在 JSX 子节点位漏包外层 {}——整体用 {} 包裹，如 {cond ? <IconPlusIc…/> : <IconPlusIc…/>}，');
    console.log('       见 Icon.md §「<Icon name={X}/> 改写的 {} 上下文规则」。');
  } else if (totalShimSites) {
    console.log('  全部残留 shim 站点已声明具体 OPEN 集合证据、无 stale import、无数据源半改、无图标改写 props 丢失、无条件式漏包 {}——PASS');
  } else {
    console.log('  无残留 <Icon> shim 站点、无数据源半改、无图标改写 props 丢失、无条件式漏包 {}——PASS');
  }

  if (opts.strict && (unjustified.length || staleImports.length || unconvertedSources.length || propDropped.length || ternaryWrapLost.length)) {
    process.exit(1);
  }
}

main();
