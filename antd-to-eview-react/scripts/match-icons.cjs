#!/usr/bin/env node
/**
 * match-icons.cjs — icon+ 名匹配 + 调用点改写建议（方案 C 自动化：外网/接口不可达场景）
 *
 * 混合策略：脚本负责提取 + 精确匹配自动改写 + residual 候选生成；LLM 复核 residual 短名单。
 *   - confirmed（--apply 自动改写）：SEMANTIC_MAP + L1/L2/L4 命中（唯一或多桶同名，多桶按最短完整名 tie-break，非 domainRank）。
 *   - residual（带 top-K 候选，交 LLM 选，不自动 apply）：L3 prefix、L5-L7 fuzzy、UNMATCHED、
 *     链式/嵌套三元、常量传播未命中的变量。UNMATCHED 不再直接落占位，而是带候选交 LLM。
 *   - 方案A（保留 src/shared/Icon shim，folder + 默认导出）：仅留给"name 由真运行时后端数据决定"的调用点
 *     （如 name={row.iconField}，row 来自接口/props，迁移时值不可预知；或成员表达式绑不到同文件/跨文件静态数组）。
 *   - 动态名（成员表达式 name={t.icon}）**现已自动解析**：Phase B 把 t.icon 绑定到同文件/跨文件静态数组字面量，
 *     全组改写——数组里 FIELD:"lit" → FIELD:<IconPlusIc… iconSize/>（命中用真实组件，未命中用占位
 *     IconPlusIcPublicTransverseRectangleTemplate 顶替并带候选进 residual），render <Icon name={t.icon}/> → {t.icon}。
 *     标识符 name={x}（常量传播未命中）与链式/嵌套三元仍交 LLM 在 residual 阶段按 Icon.md recipe 解析。
 *     仅真运行时数据（接口/props、跨文件追源失败、数组含非字面量字段）退方案A。
 *   - 图标-prop wrapper 组件（SoftTag/ToggleRow：自定义组件接收 icon prop、内部 <Icon name={icon}/> 渲染）
 *     **Phase C 自动改写**：调用点 icon="lit"/icon={常量}/icon={扁平三元} → icon={<IconPlusIc…/>}（尺寸取自 wrapper
 *     内部 <Icon/>）；icon={IDENT.field} 成员调用方透传 + 数据数组元素化；wrapper 内部 <Icon name={icon}/> → {icon}/裸
 *     （按 wrapIfNeeded 上下文判 {}）。调用方 icon={expr} 不可静态解析（链式三元/未解析标识符/追不到数组源）→
 *     安全闸整组退方案 A shim（修 shared/icon 路径），交 LLM。
 *   - .js→.jsx / .ts→.tsx：--apply 把因改写引入 JSX（替换串含 <IconPlusIc）的 .js/.ts 文件自动转扩展名，
 *     并扫 src/ 修引用了旧路径显式 .js/.ts 扩展名的 import（无扩展名 import 不动，解析器仍命中 .jsx）。
 *
 * iconSize：源 size 原样透传（icon+ 静态 import 支持 rem/px/数字，不转换；仅方案A shim 的 getIcon API 需转数字）。
 *
 * passthrough：源 <Icon>/<XxxOutlined> 上未识别的 prop（onClick、onMouse*、id、title、data-*、aria-*、role、tabIndex、
 *   {…spread}/布尔简写等）原样透传到 <IconPlusIc…/>，避免交互/无障碍/自定义属性在改写时丢失。
 *   仅 name/size/color/variant/className/style 六个被显式映射的 prop 不走透传（已转成 iconSize/iconColor/type/className/style）。
 *
 * 重要：references/icons/icon-plus-names.json 顶层 key（Public/Ict/Bpit…）**不是语义领域**，只是按图标名
 * 前置词分的桶；domainRank 已从决策路径退役（仅用于拼 componentName = IconPlusIc+domain+name）。
 * 候选打分用 token 重叠 + 子串包含（见 scoreCandidate/topKCandidates），不按桶优先。
 *
 * 做的事：
 *   1. 扫描 <目标工程根>/src/ 下 .js/.jsx/.ts/.tsx，提取图标调用点：
 *        a. 源 <Icon name="..." .../> 与 <Icon name={...}/>（含常量传播、三元、变量分流）
 *        b. @ant-design/icons 的 import 名 + <XxxOutlined .../> 用法（--include-antd-icons 默认开）
 *   2. 读 references/icons/icon-plus-names.json，按 matchOne 分 confirmed/residual（见上方策略）
 *   3. 输出控制台报告（confirmed 段 + residual 段带 top-K 候选 + 动态名段）
 *   4. 写 OS 临时目录 `icon-match-<工程名>.json`（供 LLM 按 residual 候选复核；**不进产物根**，控制台报告亦为 in-context 真相源）
 *   5. --apply：仅改写 confirmed 调用点 + 注入 @hui/icon-plus import；residual 不动；结束清理临时报告
 *
 * 用法：
 *   node match-icons.cjs <目标工程根>                       # 扫描 + 报告（不改文件）
 *   node match-icons.cjs <目标工程根> --apply               # 仅落 confirmed 改写 + 注入 import
 *   node match-icons.cjs <目标工程根> --no-antd-icons       # 跳过 @ant-design/icons
 *   node match-icons.cjs <目标工程根> --catalog <path>      # 指定 catalog（默认 skill 目录下）
 *   node match-icons.cjs <目标工程根> --topk N              # residual 候选数（默认 5）
 *
 * 说明：
 * - 纯静态正则 + 常量传播，不执行代码、不做运行时渲染。
 * - 报告写 OS 临时目录、不进产物根：`--apply` 结束清理临时报告；residual 由 LLM 在会话内按控制台/临时报告逐条复核，**勿因 residual 整体放弃方案C**。
 * - 不删 src/shared/Icon shim（方案A 兜底保留）。
 * - 语义覆写表内联在下方 SEMANTIC_MAP，覆盖 confirmed 路径的同义条目；视实践增量扩充。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// ─── 常量 ───────────────────────────────────────────────────────────────────

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 占位图标：未命中时用，保证编译通过
const PLACEHOLDER = {
  domain: 'Public',
  name: 'TransverseRectangleTemplate',
  componentName: 'IconPlusIcPublicTransverseRectangleTemplate',
};

// 语义覆写表：Lucide/antd 名 → icon+ (domain, name)。
// 只列 L1-L4 字面匹配会 miss 的同义条目（bell 已被 L3 前缀覆盖，不列）。
// 注意 refresh-cw → RefreshClockwise 字面不前缀匹配（refreshcw vs refreshclockwise，位置 8 w≠l），故列入。
// 扩充时只改本常量。
const SEMANTIC_MAP = {
  'circle-check': { domain: 'Public', name: 'Checkmark' },
  'circle-slash': { domain: 'Public', name: 'ProhibitCircle' },
  'trash-2': { domain: 'Public', name: 'Trash' },
  'refresh-cw': { domain: 'Public', name: 'RefreshClockwise' },
  'x': { domain: 'Public', name: 'Close' }, // curate 为 Public/Close（Ict 亦有同名 X，歧义走 residual 由 LLM 定）
  // 实测补充：Lucide 同义词，与 catalog 零 token 重叠、需 curate 为 confirmed（避免落占位/方案A）
  'chevron-right': { domain: 'Public', name: 'RightArrow' }, // catalog 无 ChevronRight，取 RightArrow
  'circle-alert': { domain: 'Public', name: 'Alert' },
  'sparkles': { domain: 'Public', name: 'Star' }, // catalog 无 Sparkle，取最近 Star
  'list-checks': { domain: 'Public', name: 'ListBullet' }, // catalog 无 ListCheck，取 ListBullet
  // 实测补充：数字后缀 Lucide 名（tokenize 拆分前零 token 重叠，curate 为 confirmed 避免落孤儿占位）
  'building-2': { domain: 'Public', name: 'Building' }, // catalog 无 Building2，取 Building@Public
  'chevron-left': { domain: 'Public', name: 'LeftArrow' }, // catalog 无 ChevronLeft，取 LeftArrow@Public（与 chevron-right→RightArrow 对称）
};

// ─── 命令行 ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    targetRoot: null,
    apply: false,
    includeAntdIcons: true,
    catalogPath: null,
    topk: 5,
    // 方案 B 两段式（catalog-free，无占位）：
    //   --plan              pass 1：结构规划，不改文件、不读 catalog，产 icon-leaves.json
    //   --apply-decisions   pass 2：用 --decisions 决策日志的真名做完整结构改写（不读 catalog、无占位）
    plan: false,
    applyDecisions: false,
    decisionsPath: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') opts.apply = true;
    else if (a === '--no-antd-icons') opts.includeAntdIcons = false;
    else if (a === '--include-antd-icons') opts.includeAntdIcons = true;
    else if (a === '--catalog') opts.catalogPath = argv[++i];
    else if (a === '--topk') {
      const v = Number(argv[++i]);
      if (Number.isInteger(v) && v > 0) opts.topk = v;
    }
    else if (a === '--plan') opts.plan = true;
    else if (a === '--apply-decisions') opts.applyDecisions = true;
    else if (a === '--decisions') opts.decisionsPath = argv[++i];
    else if (a === '-h' || a === '--help') {
      printHelp();
      process.exit(0);
    } else if (!a.startsWith('--')) opts.targetRoot = a;
  }
  if (!opts.targetRoot) {
    printHelp();
    process.exit(1);
  }
  return opts;
}

function printHelp() {
  console.error(
    `用法: node match-icons.cjs <目标工程根> [模式]
  方案 C(catalog 名匹配): [--apply] [--no-antd-icons] [--catalog <path>] [--topk N]
  方案 B 两段式(catalog-free,无占位):
    --plan                                  pass 1 结构规划(不改文件,产 icon-leaves.json)
    --apply-decisions --decisions <path>    pass 2 用决策日志真名做结构改写(缺名即报错)`
  );
}

// ─── 文件遍历 ───────────────────────────────────────────────────────────────

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

// ─── catalog 索引 ───────────────────────────────────────────────────────────

// PascalCase 名 → 小写 token 数组（如 BellClock → ['bell','clock']）
function tokenize(name) {
  // 在小写/数字 与 大写 之间插空格，再按非字母数字边界拆分并小写。
  // 另在 字母 与 数字 之间插空格（Building2→Building 2），使数字后缀名能与无后缀 catalog 条目
  // 共享 token（building-2 与 Building 共享 'building'）；双侧（catalog [:185] 与源名 [:289]）一致使用，
  // 故 L1(lower 串)/L2(token 集合相等)/L4(bare) exact 命中零回归，仅 L3/L5-L7 fuzzy 增加粒度。
  const spaced = String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])([0-9])/g, '$1 $2');
  return spaced
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

// 剥 Textured / \d+Textured 后缀生成裸名（如 BellClockTextured → BellClock）
function bareName(name) {
  return String(name).replace(/\d*Textured$/, '');
}

// 把 entry 推进 Map<key, entry[]>（保持 catalog 顺序，供 L1/L2/L4 索引命中）。
function pushMap(map, key, val) {
  const arr = map.get(key);
  if (arr) arr.push(val);
  else map.set(key, [val]);
}

function loadCatalog(jsonPath) {
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const index = [];
  // 预建索引（最小侵入：index 仍是数组，附加 byLower/byBare/byToken 供 matchOne 短路，避免 7 次全量 filter）。
  const byLower = new Map(); // lower → entry[]（L1 精确命中）
  const byBare = new Map(); // bare → entry[]（L4 精确命中，命中后仍需 bare!==lower 过滤）
  const byToken = new Map(); // token → entry[]（L2 token 倒排，求交集替代全量扫）
  for (const domain of Object.keys(raw)) {
    for (const name of raw[domain]) {
      const lower = String(name).toLowerCase();
      const bare = bareName(name).toLowerCase();
      const tokens = new Set(tokenize(name));
      const entry = { domain, name, lower, tokens, bare };
      index.push(entry);
      pushMap(byLower, lower, entry);
      pushMap(byBare, bare, entry);
      for (const t of tokens) pushMap(byToken, t, entry);
    }
  }
  index.byLower = byLower;
  index.byBare = byBare;
  index.byToken = byToken;
  return index;
}

// ─── 候选打分（residual 用，供 LLM 从短名单选）──────────────────────────────

// 多桶同名裁决：最短完整名优先（**不**用域优先级——catalog 顶层 key 只是前置词分桶，非语义领域）。
function pickBest(candidates) {
  return candidates.slice().sort((a, b) => a.name.length - b.name.length)[0];
}

// 对单个目录条目打分：共享 token 数（主，权重 2）+ 子串包含（辅，权重 1，catch bell ⊂ BellClock）。
// 对完整名 domain+name 计算，不引用域优先级。
function scoreCandidate(norm, c) {
  let shared = 0;
  for (const t of c.tokens) if (norm.tokens.has(t)) shared++;
  let sub = 0;
  if (norm.lower.length >= 2) {
    if (c.lower.includes(norm.lower)) sub = 1;
    else if ((c.domain + c.name).toLowerCase().includes(norm.lower)) sub = 1;
  }
  return { score: shared * 2 + sub, shared };
}

// 全量扫 index 取 top-K 候选（2961 条，毫秒级）。返回 [{domain, catalogName, componentName, score, sharedTokens}]。
function topKCandidates(norm, index, topk) {
  const out = [];
  for (const c of index) {
    const { score, shared } = scoreCandidate(norm, c);
    if (score > 0)
      out.push({
        domain: c.domain,
        catalogName: c.name,
        componentName: `IconPlusIc${c.domain}${c.name}`,
        score,
        sharedTokens: shared,
      });
  }
  out.sort((a, b) => b.score - a.score || a.catalogName.length - b.catalogName.length);
  return out.slice(0, topk);
}

// 合并 level 命中 + scorer top-K，去重按 componentName，按 score 降序、名短者优先，取 top-K。
function buildResidualCandidates(norm, index, topk, levelHits) {
  const byComp = new Map();
  for (const c of topKCandidates(norm, index, topk)) byComp.set(c.componentName, c);
  for (const { h, level } of levelHits) {
    const comp = `IconPlusIc${h.domain}${h.name}`;
    if (!byComp.has(comp)) {
      const { score, shared } = scoreCandidate(norm, h);
      byComp.set(comp, {
        domain: h.domain,
        catalogName: h.name,
        componentName: comp,
        score,
        sharedTokens: shared,
        level,
      });
    } else {
      const existing = byComp.get(comp);
      const newPri = LEVEL_PRIORITY[level] ?? 99;
      const oldPri = existing.level != null ? LEVEL_PRIORITY[existing.level] ?? 99 : 99;
      if (newPri < oldPri) existing.level = level;
    }
  }
  const all = [...byComp.values()];
  all.sort((a, b) => b.score - a.score || a.catalogName.length - b.catalogName.length);
  return all.slice(0, topk);
}

// residual 的 best-guess：按 level 优先级（L1>L2>L4>L3>L5>L6>L7）再名短者取一，作为建议替换用。
const LEVEL_PRIORITY = { L1: 0, L2: 1, L4: 2, L3: 3, L5: 4, L6: 5, L7: 6 };
function pickBestGuess(levelHits) {
  if (!levelHits.length) return null;
  const sorted = levelHits
    .slice()
    .sort((a, b) => (LEVEL_PRIORITY[a.level] - LEVEL_PRIORITY[b.level]) || a.h.name.length - b.h.name.length);
  return sorted[0].h;
}

// 孤儿名：residual 且无任何 level 命中（level==='UNMATCHED'）且无候选（score 全 0）——catalog 无贴切对应。
// --apply 自动落占位 IconPlusIcPublicTransverseRectangleTemplate（catalog 实有条目），不交 LLM 拼名（防臆造
// 诸如 IconPlusIcPublicAlarm / IconPlusIcIctBuilding2 等非实有名）；后续由人工/SEMANTIC_MAP 升级。
function isOrphan(match) {
  return !!match && match.status === 'residual' && match.level === 'UNMATCHED' && !(match.candidates && match.candidates.length);
}

// ─── 源名归一化 ─────────────────────────────────────────────────────────────

// antd 剥尾部 Outlined/Filled/TwoTone；Lucide kebab→Pascal；保留 base + lower + tokens
function normalizeSourceName(raw) {
  let base = String(raw);
  // antd @ant-design/icons：剥尾部 Outlined/Filled/TwoTone
  base = base.replace(/(Outlined|Filled|TwoTone)$/, '');
  // Lucide kebab-case → PascalCase（arrow-left → ArrowLeft，trash-2 → Trash2）
  if (base.includes('-')) {
    base = base
      .split('-')
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
      .join('');
  }
  const tokensArr = tokenize(base);
  return { raw: String(raw), base, lower: base.toLowerCase(), tokens: new Set(tokensArr), tokensArr };
}

// ─── 匹配核心 ───────────────────────────────────────────────────────────────

// 语义表 key 用源名原始形态（kebab 或 antd 原名）。先按归一化 lower 查，再按 raw 查。
function matchSemantic(norm) {
  if (SEMANTIC_MAP[norm.raw]) return SEMANTIC_MAP[norm.raw];
  if (SEMANTIC_MAP[norm.lower]) return SEMANTIC_MAP[norm.lower];
  return null;
}

// confirmed 单命中构造
function mkConfirmed(level, hit) {
  return {
    status: 'confirmed',
    level,
    fuzzy: false,
    domain: hit.domain,
    catalogName: hit.name,
    componentName: `IconPlusIc${hit.domain}${hit.name}`,
  };
}

// residual 构造：best-guess（level hit 优先，否则候选[0]，否则占位）+ top-K 候选
function mkResidual(level, norm, index, topk, levelHits) {
  const candidates = buildResidualCandidates(norm, index, topk, levelHits);
  let guess = pickBestGuess(levelHits);
  let match;
  if (guess) {
    match = { domain: guess.domain, catalogName: guess.name, componentName: `IconPlusIc${guess.domain}${guess.name}` };
  } else if (candidates.length) {
    const c = candidates[0];
    match = { domain: c.domain, catalogName: c.catalogName, componentName: c.componentName };
  } else {
    match = { domain: PLACEHOLDER.domain, catalogName: PLACEHOLDER.name, componentName: PLACEHOLDER.componentName };
  }
  return { status: 'residual', level, fuzzy: true, candidates, ...match };
}

// L2 token 精确匹配（用 byToken 倒排索引求交集，替代全量 index.filter）：
// 取所有 norm.tokens 的交集 entry，再过滤 tokens.size === norm.tokens.size（精确集，非超集）。
// 结果保持 catalog 顺序（与原 index.filter 一致），pickBest/levelHits 行为不变。
function tokenExactEntries(byToken, norm) {
  const toks = norm.tokensArr;
  if (!toks.length) return [];
  let cand = byToken.get(toks[0]);
  if (!cand) return [];
  cand = cand.slice(); // 拷贝，避免污染倒排索引原数组
  for (let i = 1; i < toks.length; i++) {
    const arr = byToken.get(toks[i]);
    if (!arr) return [];
    const set = new Set(arr);
    cand = cand.filter((c) => set.has(c));
    if (!cand.length) return [];
  }
  const nsize = norm.tokens.size;
  return cand.filter((c) => c.tokens.size === nsize);
}

function matchOne(norm, index, topk) {
  // 语义表 → confirmed
  const sem = matchSemantic(norm);
  if (sem) {
    return {
      status: 'confirmed',
      level: 'SEMANTIC',
      fuzzy: false,
      domain: sem.domain,
      catalogName: sem.name,
      componentName: `IconPlusIc${sem.domain}${sem.name}`,
    };
  }

  // CONFIRMED 短路（L1/L2/L4）：用预建索引命中即返回，省 residual 全量 filter。
  // byLower/byBare/byToken 由 loadCatalog 附加；缺失时回退全量 filter 保行为一致。
  const byLower = index.byLower;
  const byBare = index.byBare;
  const byToken = index.byToken;
  const l1 = byLower ? byLower.get(norm.lower) || [] : index.filter((c) => c.lower === norm.lower);
  if (l1.length >= 1) return mkConfirmed('L1', pickBest(l1));
  const l2 = byToken
    ? tokenExactEntries(byToken, norm)
    : index.filter((c) => c.tokens.size === norm.tokens.size && [...c.tokens].every((t) => norm.tokens.has(t)));
  if (l2.length >= 1) return mkConfirmed('L2', pickBest(l2));
  const l4 = byBare
    ? (byBare.get(norm.lower) || []).filter((c) => c.bare !== c.lower)
    : index.filter((c) => c.bare === norm.lower && c.bare !== c.lower);
  if (l4.length >= 1) return mkConfirmed('L4', pickBest(l4));

  // RESIDUAL：仅此处算 L3/L5/L6/L7（频次低，保留全量 filter 保行为一致）。
  // l1/l2/l4 此时为空（未短路返回），levelHits 中对应 spread 为空。
  const l3 = norm.lower.length >= 3 ? index.filter((c) => c.lower.startsWith(norm.lower)) : [];

  // L5 复数归一：settings→Setting、users→User
  let l5 = [];
  if (norm.lower.endsWith('s') && norm.lower.length > 3) {
    const sing = norm.lower.slice(0, -1);
    l5 = index.filter((c) => c.lower === sing || (sing.length >= 3 && c.lower.startsWith(sing)));
  }
  // L6 主 token 单名：cloud-off→Cloud、user-plus→User
  let l6 = [];
  if (norm.tokensArr.length >= 2) {
    const firstTok = norm.tokensArr[0];
    l6 = index.filter((c) => c.tokens.size === 1 && c.tokens.has(firstTok));
    if (!l6.length) {
      const longest = norm.tokensArr.slice().sort((a, b) => b.length - a.length)[0];
      if (longest !== firstTok) l6 = index.filter((c) => c.tokens.size === 1 && c.tokens.has(longest));
    }
  }
  // L7 token 超集：arrow-up→ArrowMoveUp
  const l7 =
    norm.tokensArr.length >= 2
      ? index.filter((c) => c.tokens.size > norm.tokens.size && [...norm.tokens].every((t) => c.tokens.has(t)))
      : [];

  // RESIDUAL：L3 prefix、L5-L7 fuzzy、UNMATCHED —— 一律带 top-K 候选交 LLM 选
  const levelHits = [
    ...l1.map((h) => ({ h, level: 'L1' })),
    ...l2.map((h) => ({ h, level: 'L2' })),
    ...l3.map((h) => ({ h, level: 'L3' })),
    ...l4.map((h) => ({ h, level: 'L4' })),
    ...l5.map((h) => ({ h, level: 'L5' })),
    ...l6.map((h) => ({ h, level: 'L6' })),
    ...l7.map((h) => ({ h, level: 'L7' })),
  ];
  const level = levelHits.length ? levelHits[levelHits.length - 1].level : 'UNMATCHED';
  return mkResidual(level, norm, index, topk, levelHits);
}

// ─── props 抽取与改写 ──────────────────────────────────────────────────────

// 从一段 JSX 标签文本里取某 prop 的字符串字面量值（name="x" / name='x'）
function getStringProp(tag, prop) {
  const re = new RegExp(`\\b${prop}\\s*=\\s*["']([^"']*)["']`);
  const m = tag.match(re);
  return m ? m[1] : null;
}

// 取 prop={...} 的大括号表达式内容（平衡花括号），返回内含值（不含外层花括号）
function getBracedProp(tag, prop) {
  const re = new RegExp(`\\b${prop}\\s*=\\s*\\{`);
  const m = tag.match(re);
  if (!m) return null;
  const start = m.index + m[0].length; // 指向 { 之后第一个字符
  let depth = 1;
  let i = start;
  for (; i < tag.length; i++) {
    const ch = tag.charCodeAt(i);
    if (ch === 123) depth++; // {
    else if (ch === 125) {
      // }
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) return null;
  return tag.slice(start, i);
}

// 解析 braced name 表达式，分四类（最大化静态解析，避免无谓落方案A）：
//   - literal:        name={"search"} 字面量（罕见）
//   - ternary-flat:   <cond> ? "a" : "b"  扁平 2 分支字面量三元 → 可自动条件渲染改写
//   - ternary-chained:链式/嵌套三元（含 ≥2 个 '?' 或带括号），收集所有字面量分支 leaf 交 LLM 拼装
//   - variable:       纯标识符/成员表达式（name={x} / name={row.icon}）→ 走常量传播/LLM 追源
function parseNameExpr(body) {
  if (body == null) return null;
  const trimmed = body.trim();
  if (!trimmed) return null;

  // 字面量
  const litM = trimmed.match(/^["']([^"']*)["']$/);
  if (litM) return { kind: 'literal', value: litM[1] };

  if (trimmed.includes('?')) {
    // 扁平 2 分支字面量三元（条件不含 '?'、不带括号）
    const tail = trimmed.match(/^(.+?)\s*\?\s*["']([^"']*)["']\s*:\s*["']([^"']*)["']$/);
    if (tail) {
      const cond = tail[1].trim();
      if (cond && !cond.includes('?') && !/[()]/.test(cond)) {
        return { kind: 'ternary-flat', cond, candidates: [tail[2], tail[3]] };
      }
    }
    // 链式/嵌套：收集所有字面量分支 leaf
    const leaves = [];
    const leafRe = /["']([^"']*)["']/g;
    let lm;
    while ((lm = leafRe.exec(trimmed)) !== null) if (lm[1]) leaves.push(lm[1]);
    if (leaves.length >= 2) return { kind: 'ternary-chained', cond: trimmed, candidates: leaves };
    return { kind: 'variable', expr: trimmed };
  }

  return { kind: 'variable', expr: trimmed };
}

// 文件内常量传播：扫 const/let/var id = "lit" 与 id = "lit"，返回 Map<id, {literal, raw}>。
// 用于把 name={someVar} 解析回字面量（同文件赋值场景），避免误落方案A。
function buildConstMap(text) {
  const map = new Map();
  // 仅匹配 const/let/var X = "lit" 声明。**不**用宽松赋值正则（\bIDENT\s*=\s*"lit"）——后者会误命中
  // JSX 属性（如 <SoftTag icon="bell-ring">），把解构 prop 名 icon 伪解析成首个调用点的字面量，
  // 与 Phase C 的 wrapper 内部改写冲突（confirmed 时会覆盖 {icon} 透传）。声明式正则有 const/let/var 前缀，安全。
  const decl = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*["']([^"']*)["']/g;
  let m;
  while ((m = decl.exec(text)) !== null) map.set(m[1], { literal: m[2], raw: m[0] });
  return map;
}

// icon+ 静态 import 的 iconSize 支持 rem/px/数字，**原样透传、不转换**（仅方案A shim 的 getIcon API 才需转数字）。
// 返回拼到 `iconSize=` 之后的片段：字符串字面量 → `"1rem"`；braced 数字 → `{14}`；braced 字符串 → `"1rem"`；braced 表达式 → `{x}`。
function sizeSnippet(props, context) {
  let strVal = null, exprVal = null;
  if (props.sizeStr != null) strVal = props.sizeStr;
  else if (props.sizeExpr != null) exprVal = props.sizeExpr;
  else if (props.fontSize != null) {
    const f = String(props.fontSize).trim();
    if (/^-?\d+(?:\.\d+)?$/.test(f)) return `{${f}}`; // 纯数字 → {14}
    return `"${f}"`; // rem/px → "14px"
  }
  if (strVal != null) return `"${strVal}"`;
  if (exprVal != null) {
    const e = exprVal.trim();
    const qm = e.match(/^["']([^"']*)["']$/); // {"1rem"} → "1rem"
    if (qm) return `"${qm[1]}"`;
    return `{${e}}`; // {14} / {x}
  }
  return context === 'button' ? `{14}` : `{16}`; // 无 size 默认
}

// 由源 <Icon>/<XxxOutlined> props + 匹配结果 + 语境，生成目标 icon+ 标签
function buildReplacement(match, props, context) {
  const comp = match.componentName;
  const out = [];

  // iconSize：透传源 size（或 style.fontSize）；无则按语境默认（standalone {16} / button {14}）
  out.push(`iconSize=${sizeSnippet(props, context)}`);

  // iconColor：有 hex 用 ['hex']，无默认 ['currentcolor']
  if (props.color) {
    out.push(`iconColor={['${props.color}']}`);
  } else {
    out.push(`iconColor={['currentcolor']}`);
  }

  // type：variant="filled" → type="filled"；lined（默认）省略
  if (props.variant && props.variant !== 'lined') {
    out.push(`type="${props.variant}"`);
  }

  // className 透传：字符串字面量保引号，表达式保花括号
  if (props.classNameStr != null) out.push(`className="${props.classNameStr}"`);
  else if (props.classNameExpr != null) out.push(`className={${props.classNameExpr}}`);

  // style 透传（已剔除 fontSize）；styleRest 为含内层花括号的对象字面量文本
  if (props.styleRest) {
    out.push(`style={${props.styleRest}}`);
  }

  if (props.passthrough && props.passthrough.length) out.push(...props.passthrough);

  return `<${comp} ${out.join(' ')} />`;
}

// 已识别 prop 名（extractIconProps 显式映射，passthrough 不重复收）
const KNOWN_PROPS = new Set(['name', 'size', 'color', 'variant', 'className', 'style']);

// 扫标签属性区，收非已知 prop 的原文（保留 `prop="str"` / `prop={expr}` / `prop` 布尔简写 / `{...spread}`），
// 用于把源 <Icon>/<XxxOutlined> 上的 onClick/id/data-*/aria-*/spread 等未识别 prop 原样透传到 <IconPlusIc…/>。
// 与 getBracedProp 同样的最佳努力花括号边界（不识别字符串/注释内的括号）。
function collectPassthroughProps(tag) {
  const out = [];
  const headM = tag.match(/^<([A-Za-z_$][\w$.-]*)\s*/);
  if (!headM) return out;
  let i = headM[0].length;
  const n = tag.length;
  // 开标签终点：第一个位于花括号外的 '>'（自闭合 '/>' 的 '>' 或开标签 '>'）。跳过 {...} 内的 '>'（如箭头 =>）。
  let depth = 0;
  let end = -1;
  for (let j = i; j < n; j++) {
    const c = tag[j];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (depth === 0 && c === '>') { end = j; break; }
  }
  if (end === -1) return out;
  while (i < end) {
    while (i < end && /\s/.test(tag[i])) i++;
    if (i >= end) break;
    const ch = tag[i];
    if (ch === '/' || ch === '>') break;
    if (ch === '{') {
      // spread {...rest} 或罕见 {expr} 属性 — 整段原样收（花括号平衡）
      let d = 0;
      const s = i;
      for (; i < end; i++) {
        if (tag[i] === '{') d++;
        else if (tag[i] === '}') { d--; if (d === 0) { i++; break; } }
      }
      out.push(tag.slice(s, i));
      continue;
    }
    const ns = i;
    while (i < end && /[A-Za-z0-9_$-]/.test(tag[i])) i++;
    const name = tag.slice(ns, i);
    if (!name) { i++; continue; }
    while (i < end && /\s/.test(tag[i])) i++;
    if (tag[i] === '=') {
      i++;
      while (i < end && /\s/.test(tag[i])) i++;
      if (tag[i] === '"' || tag[i] === "'") {
        const q = tag[i];
        i++;
        while (i < end && tag[i] !== q) i++;
        i++;
      } else if (tag[i] === '{') {
        let d = 0;
        for (; i < end; i++) {
          if (tag[i] === '{') d++;
          else if (tag[i] === '}') { d--; if (d === 0) { i++; break; } }
        }
      } else {
        while (i < end && /\S/.test(tag[i]) && tag[i] !== '/' && tag[i] !== '>') i++;
      }
      if (!KNOWN_PROPS.has(name)) out.push(tag.slice(ns, i));
    } else if (!KNOWN_PROPS.has(name)) {
      out.push(name);
    }
  }
  return out;
}

// 从 <Icon .../> 标签文本抽取 props（按 §3.2 映射表）
function extractIconProps(tag) {
  const props = {};
  // name
  props.name = getStringProp(tag, 'name');
  // size：size="1rem"（字符串字面量 → sizeStr）或 size={14}/size={"1rem"}/size={x}（braced → sizeExpr）
  const sizeExpr = getBracedProp(tag, 'size');
  if (sizeExpr != null) props.sizeExpr = sizeExpr;
  else {
    const sizeStr = getStringProp(tag, 'size');
    if (sizeStr != null) props.sizeStr = sizeStr;
  }
  // color 字符串
  props.color = getStringProp(tag, 'color');
  // variant
  props.variant = getStringProp(tag, 'variant');
  // className：区分字符串字面量与 {} 表达式
  const clsBraced = getBracedProp(tag, 'className');
  if (clsBraced != null) props.classNameExpr = clsBraced;
  else {
    const clsStr = getStringProp(tag, 'className');
    if (clsStr != null) props.classNameStr = clsStr;
  }
  // style：抽 fontSize 并剔除
  const styleExpr = getBracedProp(tag, 'style');
  if (styleExpr != null) {
    const fontSizeMatch = styleExpr.match(/fontSize\s*:\s*["'`]?(0*\d+(?:\.\d+)?)\s*(px|rem)?["'`]?\s*,?/);
    if (fontSizeMatch) props.fontSize = fontSizeMatch[1] + (fontSizeMatch[2] || '');
    // 剔除 fontSize 后的剩余 style（保留内层花括号）
    let rest = styleExpr.replace(/fontSize\s*:\s*[^,}]+,?/g, '').trim();
    rest = rest.replace(/,\s*}/g, '}').replace(/,\s*$/, '').trim();
    if (rest && rest !== '{}' && /\S/.test(rest.replace(/[{}]/g, ''))) props.styleRest = rest;
  }
  props.passthrough = collectPassthroughProps(tag);
  return props;
}

// ─── 数据数组图标解析（动态名 name={t.icon} → 同文件静态数组字面量）──────────────

// 平衡括号扫描：text[openIdx] 为 '[' / '{' / '('，返回 { end, inner }（inner 不含外层括号）；不闭合返回 null。
// 字符串/注释里的括号不识别（与 getBracedProp 同样的最佳努力边界）。
function balancedSlice(text, openIdx) {
  const open = text[openIdx];
  const close = open === '{' ? '}' : open === '[' ? ']' : open === '(' ? ')' : null;
  if (!close) return null;
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return { end: i, inner: text.slice(openIdx + 1, i) };
    }
  }
  return null;
}

// 同文件找循环绑定：IDENT 绑到数组变量名 ARR（.map/.forEach/.flatMap/.filter((IDENT… 或 for(const IDENT of ARR)）。返回 ARR 或 null。
function findLoopBinding(text, ident) {
  const esc = ident.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re1 = new RegExp(`([A-Za-z_$][\\w$]*)\\.(?:map|forEach|flatMap|filter)\\s*\\(\\s*\\(?\\s*${esc}\\b`, 'g');
  let m;
  while ((m = re1.exec(text)) !== null) return m[1];
  const re2 = new RegExp(`for\\s*\\(\\s*(?:const|let|var)\\s+${esc}\\s+of\\s+([A-Za-z_$][\\w$]*)`, 'g');
  while ((m = re2.exec(text)) !== null) return m[1];
  return null;
}

// 在 text 里找 `(?:export )?(?:const|let|var) ARR = [`，返回 '[' 的索引；找不到返回 -1。
function findArrayDecl(text, arrName) {
  const esc = arrName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${esc}\\s*=\\s*(\\[)`, 'g');
  const m = re.exec(text);
  if (!m) return -1;
  return m.index + m[0].length - 1; // 指向 '['
}

// 在数组字面量（arrOpenIdx 指向 '['）里抓所有 `FIELD: "lit"` / `FIELD: 'lit'` 字符串字面量条目（含 offset/length/raw）。
function extractDataIconFields(text, arrOpenIdx, fieldName) {
  const slice = balancedSlice(text, arrOpenIdx);
  if (!slice) return [];
  const base = arrOpenIdx + 1;
  const esc = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${esc}\\s*:\\s*["']([^"']*)["']`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(slice.inner)) !== null) {
    out.push({ value: m[1], offset: base + m.index, length: m[0].length, raw: m[0] });
  }
  return out;
}

// 数组里是否存在非字符串字面量的 FIELD 值（变量/三元/标识符等）→ 集合不封闭，不能安全转 icon+ 元素。
function hasNonLiteralField(text, arrOpenIdx, fieldName) {
  const slice = balancedSlice(text, arrOpenIdx);
  if (!slice) return true; // 解析不出就保守当非封闭
  const esc = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${esc}\\s*:\\s*([^,}\\n]+?)\\s*(?=[,}\\n])`, 'g');
  let m;
  while ((m = re.exec(slice.inner)) !== null) {
    if (!/^["'][^"']*["']$/.test(m[1].trim())) return true;
  }
  return false;
}

// 由 render 站点 props + 语境 + 组件名，拼 data 数组里 `icon: <Comp iconSize=… />` 元素（复用 sizeSnippet 的尺寸透传）。
function buildDataIconElement(componentName, props, context) {
  const out = [`iconSize=${sizeSnippet(props, context)}`];
  out.push(props.color ? `iconColor={['${props.color}']}` : `iconColor={['currentcolor']}`);
  if (props.variant && props.variant !== 'lined') out.push(`type="${props.variant}"`);
  if (props.classNameStr != null) out.push(`className="${props.classNameStr}"`);
  else if (props.classNameExpr != null) out.push(`className={${props.classNameExpr}}`);
  if (props.styleRest) out.push(`style={${props.styleRest}}`);
  if (props.passthrough && props.passthrough.length) out.push(...props.passthrough);
  return `<${componentName} ${out.join(' ')} />`;
}

// render 站点 <Icon name={EXPR} …/> 的替换串（EXPR 如 t.icon / MENU[0].icon）。按上下文判 {}：
// 仅 JSX 子节点位包 {EXPR}（开标签 '>' 或前一个 {expr} 的 '}'）；其余表达式位（三元分支/对象值/数组元素/
// prop 容器/箭头体/return 等）裸 EXPR——否则 {} 落到非子节点位会被解析为对象字面量/块语句报错。
// 详见 wrapIfNeeded（缺陷一/二：`<Icon name={X}/>` 改写后 {} 的合法性取决于上下文）。
function dataRenderReplacement(expr, text, offset) {
  return wrapIfNeeded(expr, text, offset);
}

// 方案A shim import 路径修正：assets/shared/icon(.jsx?) 或旧产物 shared/icon(.jsx?) → @/shared/Icon（scaffold 把 shim 重构为 src/shared/Icon/ folder + 默认导出）。
// 同时把具名 import { Icon } 改为默认 import Icon（scaffold 桶 export { default }）。幂等：已是 @/shared/Icon 默认导入不匹配。
function fixShimImportPath(text) {
  return text.replace(/import\s*\{\s*Icon\s*\}\s*from\s*['"][^'"]*?(?:assets\/shared|shared)\/icons?\.jsx?['"]/g, 'import Icon from "@/shared/Icon"');
}

// 解析数组变量 ARR 的声明位置：先同文件（renderFile），再跨文件按名唯一性找；返回 {arrayFile, arrOpenIdx} 或 null（找不到/多名歧义）。
function resolveArrayDecl(arrName, renderFile, textCache) {
  const renderText = textCache.get(renderFile);
  const idx = findArrayDecl(renderText, arrName);
  if (idx !== -1) return { arrayFile: renderFile, arrOpenIdx: idx };
  const hits = [];
  for (const [f, t] of textCache) {
    if (f === renderFile) continue;
    const i2 = findArrayDecl(t, arrName);
    if (i2 !== -1) hits.push({ file: f, idx: i2 });
  }
  if (hits.length === 1) return { arrayFile: hits[0].file, arrOpenIdx: hits[0].idx };
  return null;
}

// ─── 对象地图图标解析（cat = OBJ[runtimeKey]; cat.icon）──────────────────────
// 对象地图形态：const cat = CATEGORY_STYLE[first.cat]; <Icon name={cat.icon}/>
// CATEGORY_STYLE 是 const OBJ = { k1: { icon: "lit1", ... }, k2: { icon: "lit2", ... } } 静态闭合对象。
// 与数据数组（name={t.icon} 绑 const ARR = [...]）互补：Phase B 的 resolveArrayDecl 只找 `= [`，
// 对象地图 `= {` 走本组函数。命中后复用数据数组全部改写机制（buildDataIconElement/wrapIfNeeded/
// dataIconSites apply 路径/renameJsxFiles+fixExplicitExtensionImports），只新增「对象字面量解析」。

// 扫 const|let|var IDENT = OBJ[...] / IDENT = OBJ.member（OBJ 为标识符），返回源对象名 OBJ 或 null。
// 覆盖 const cat = CATEGORY_STYLE[first.cat] 与 const cat = CATEGORY_STYLE[x.cat]。
// 不收 IDENT = OBJ（无下标/无成员链）——那是整个对象赋值，cat.icon 访问对象本身非其值字段，另走它法。
function findObjectMapBinding(text, ident) {
  const esc = ident.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 等号右侧须是「标识符 + 至少一个下标 [..] 或 .member」——排除 IDENT = {（对象声明自身）/ IDENT = lit
  const re = new RegExp(
    `\\b(?:const|let|var)\\s+${esc}\\s*=\\s*([A-Za-z_$][\\w$]*)\\s*(?:\\[[^\\]]+\\]+|\\.[A-Za-z_$][\\w$]*)`
  );
  const m = re.exec(text);
  return m ? m[1] : null;
}

// 在 text 里找 `(?:export )?(?:const|let|var) OBJ = {`，返回 '{' 的索引；找不到返回 -1。
function findObjectDecl(text, objName) {
  const esc = objName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${esc}\\s*=\\s*(\\{)`, 'g');
  const m = re.exec(text);
  if (!m) return -1;
  return m.index + m[0].length - 1; // 指向 '{'
}

// 解析对象变量 OBJ 的声明位置：先同文件（renderFile），再跨文件按名唯一性找；
// 返回 { objFile, objOpenIdx } 或 null（找不到/多名歧义）。
function resolveObjectDecl(objName, renderFile, textCache) {
  const renderText = textCache.get(renderFile);
  const idx = findObjectDecl(renderText, objName);
  if (idx !== -1) return { objFile: renderFile, objOpenIdx: idx };
  const hits = [];
  for (const [f, t] of textCache) {
    if (f === renderFile) continue;
    const i2 = findObjectDecl(t, objName);
    if (i2 !== -1) hits.push({ file: f, idx: i2 });
  }
  if (hits.length === 1) return { objFile: hits[0].file, objOpenIdx: hits[0].idx };
  return null;
}

// 在对象字面量（objOpenIdx 指向 '{'）内抓所有 `FIELD: "lit"` 字符串字面量条目（含 offset/length/raw）。
// 对象地图值是 { icon: "smartphone", text: ..., bg: ... }——抓内层 icon:（与 extractDataIconFields
// 同正则，作用域换成 balancedSlice 对象内层文本，offset 相对全文）。
function extractObjectIconFields(text, objOpenIdx, fieldName) {
  const slice = balancedSlice(text, objOpenIdx);
  if (!slice) return [];
  const base = objOpenIdx + 1;
  const esc = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${esc}\\s*:\\s*["']([^"']*)["']`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(slice.inner)) !== null) {
    out.push({ value: m[1], offset: base + m.index, length: m[0].length, raw: m[0] });
  }
  return out;
}

// 对象里是否存在非字符串字面量的 FIELD 值（变量/三元/标识符等）→ 集合不封闭，不能安全转 icon+ 元素。
function hasNonLiteralObjectField(text, objOpenIdx, fieldName) {
  const slice = balancedSlice(text, objOpenIdx);
  if (!slice) return true; // 解析不出就保守当非封闭
  const esc = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${esc}\\s*:\\s*([^,}\\n]+?)\\s*(?=[,}\\n])`, 'g');
  let m;
  while ((m = re.exec(slice.inner)) !== null) {
    if (!/^["'][^"']*["']$/.test(m[1].trim())) return true;
  }
  return false;
}

// ─── 调用点扫描 ─────────────────────────────────────────────────────────────

// 捕获 <Icon .../> 标签（含多行、嵌在 prop 内）。返回 [{ offset, tag, file, line }]
function scanIconComponent(text) {
  const sites = [];
  // <Icon ...> 直到 /> 或 </Icon>
  const re = /<Icon\b[\s\S]*?(?:\/>|<\/Icon>)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const tag = m[0];
    const name = getStringProp(tag, 'name');
    if (!name) continue; // name 是表达式或缺失，无法静态匹配
    sites.push({ offset: m.index, tag, name });
  }
  return sites;
}

// 捕获 @ant-design/icons import 名 + 各 <XxxOutlined|Filled|TwoTone .../> 用法
function scanAntdIcons(text) {
  const result = { imports: [], usages: [] };
  // import { A, B as C } from '@ant-design/icons'
  const impRe = /import\s*\{([^}]*)\}\s*from\s*['"]@ant-design\/icons['"]/g;
  let im;
  while ((im = impRe.exec(text)) !== null) {
    const names = im[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    for (let n of names) {
      // 处理 as 别名：XxxOutlined as Yyy → 用原 XxxOutlined 匹配，用法处用 Yyy
      const asM = n.match(/(\w+)\s+as\s+(\w+)/);
      if (asM) result.imports.push({ imported: asM[1], local: asM[2], offset: im.index });
      else result.imports.push({ imported: n, local: n, offset: im.index });
    }
  }
  // 各 imported 名的用法：<XxxOutlined .../>（含多行）
  for (const imp of result.imports) {
    const re = new RegExp(`<${imp.local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[\\s\\S]*?(?:\\/>|<\\/${imp.local}>)`, 'g');
    let um;
    while ((um = re.exec(text)) !== null) {
      result.usages.push({ offset: um.index, tag: um[0], name: imp.imported, local: imp.local });
    }
  }
  return result;
}

// 捕获 <Icon name={...} .../> 动态 name 调用点（与 scanIconComponent 互补：后者只收字面量 name）。
// 按 parseNameExpr 分流，最大化静态解析、避免无谓落方案A：
//   - ternaryFlat:   扁平 2 分支字面量三元 → 可自动条件渲染改写
//   - ternaryChained:链式/嵌套三元 → 收集 leaf 候选交 LLM 拼装
//   - variable:      标识符/成员表达式 → 同文件常量传播命中则当字面量；否则带线索交 LLM 追源
//   - literal:       name={"lit"}（罕见）
function scanDynamicIcons(text, constMap) {
  const ternaryFlat = [];
  const ternaryChained = [];
  const variables = [];
  const literals = [];
  const members = []; // 成员表达式 name={IDENT.FIELD}：交 Phase B 解析同文件/跨文件静态数组/对象地图（命中→dataIconSite，追不到源→untraced，交 LLM+gate）
  const re = /<Icon\b[\s\S]*?(?:\/>|<\/Icon>)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const tag = m[0];
    if (getStringProp(tag, 'name') != null) continue; // 字面量 name 站点由 scanIconComponent 处理
    const body = getBracedProp(tag, 'name');
    const parsed = parseNameExpr(body);
    if (!parsed) continue;
    const site = { offset: m.index, tag };
    if (parsed.kind === 'literal') literals.push({ ...site, value: parsed.value });
    else if (parsed.kind === 'ternary-flat')
      ternaryFlat.push({ ...site, cond: parsed.cond, candidates: parsed.candidates });
    else if (parsed.kind === 'ternary-chained')
      ternaryChained.push({ ...site, cond: parsed.cond, candidates: parsed.candidates });
    else {
      // variable：常量传播 / 成员表达式 / 标识符分流
      const idMatch = parsed.expr.match(/^([A-Za-z_$][\w$]*)$/);
      // 成员表达式：IDENT.field 或 IDENT[i][j]….field（含下标直接索引，如 MENU[0].icon）
      const memMatch = !idMatch && parsed.expr.match(/^([A-Za-z_$][\w$]*)(?:\[[^\]]+\])*\.([A-Za-z_$][\w$]*)$/);
      if (idMatch && constMap && constMap.has(idMatch[1])) {
        literals.push({ ...site, value: constMap.get(idMatch[1]).literal, resolvedVar: idMatch[1] });
      } else if (memMatch) {
        members.push({ ...site, root: memMatch[1], fieldName: memMatch[2], expr: parsed.expr });
      } else {
        variables.push({ ...site, expr: parsed.expr, isMember: false });
      }
    }
  }
  return { ternaryFlat, ternaryChained, variables, literals, members };
}

// 判断 <Icon> 是否嵌在 Button/IconButton 的 icon/leftIcon/rightIcon/iconName prop 内（决定默认尺寸语境）
function detectContext(text, offset) {
  // 向前找最近的 = 在 <Icon 之前（同一 JSX 表达式片段）
  const before = text.slice(Math.max(0, offset - 80), offset);
  if (/\b(leftIcon|rightIcon|iconName|icon)\s*=\s*\{?\s*$/.test(before)) return 'button';
  return 'standalone';
}

// 判定 <Icon/> 改写结果（一个表达式 EXPR，如 `cond ? <A/> : <B/>`、`t.icon`）是否需要包 {}：
// **仅 JSX 子节点位置才包 {}**；其余表达式位置一律裸 EXPR，否则 {} 落到非子节点位会被解析为对象字面量/块语句报错。
// JSX 子节点位：前一个非空白字符是 '>'（开标签/自闭合/闭合标签的 '>'，但排除 '=>'）或 '}'（前一个 {expr} 子节点结束）。
// 其余（'(' ')' ',' ':' '[' '?' '{' / '=>' 的 '>' / return 等关键字尾字母）→ 表达式位 → 裸 EXPR。
function wrapIfNeeded(expr, text, offset) {
  let i = offset - 1;
  while (i >= 0 && /\s/.test(text[i])) i--;
  if (i < 0) return expr;
  const ch = text[i];
  if (ch === '>' && i >= 1 && text[i - 1] !== '=') return `{${expr}}`; // 开标签 '>'（排除 '=>'）
  if (ch === '}') return `{${expr}}`; // 前一个 {expr} 子节点结束 → 仍在 JSX 子节点位
  return expr; // 表达式位（括号/对象值/数组元素/prop 容器/箭头体/return 等）→ 裸
}

// ─── 图标-prop wrapper 组件（SoftTag/ToggleRow 模式）──────────────────────────
// 自定义组件接收 icon="字面量"/icon={expr} prop，内部 <Icon name={icon}/> 渲染。
// 调用点字面量不在 <Icon> 标签上 → scanIconComponent 看不见；内部 name={icon} 是解构 prop 参数
// → scanDynamicIcons 归 variables（residual）。Phase C 耦合改写两半：调用点 icon= → icon={<IconPlusIc…/>}，
// wrapper 内部 <Icon name={icon}/> → {icon}/裸透传（wrapIfNeeded 上下文判 {}）。
// 调用方 icon={expr} 按 <Icon name={expr}/> 同套机制解析（常量传播/成员→数据数组/扁平三元）；
// 任一调用方不可静态解析 → 安全闸：整组退方案 A shim（与"真运行时数据退 A"一致）。

// 解构参数块里 icon 是否为独立绑定（排除 iconColor/iconSize 等同名前缀；icon 可为首项[{前}或逗号后)
function isIconBinding(paramsBlock) {
  return /(?:^|[{,])\s*icon\s*(?:[,=}]|$)/m.test(paramsBlock);
}

// 在 [start,end) 区间内找 <Icon name={icon}/>（name 表达式恰为裸标识符 icon）。返回 {offset, tag} 或 null。
function findInternalIconSite(text, start, end) {
  const re = /<Icon\b[\s\S]*?(?:\/>|<\/Icon>)/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index >= end) break;
    const tag = m[0];
    const body = getBracedProp(tag, 'name');
    if (body != null && body.trim() === 'icon') return { offset: m.index, tag };
  }
  return null;
}

// 安全检查：body 内（剔除内部 <Icon name={icon}/> 标签后）icon 是否被当字符串用（方法/索引/模板插值）。
// 仅 truthy/render 用法（icon ?、icon &&、{icon}）兼容 ReactNode，放行。
function safeIconUse(text, start, end, internalTag) {
  const body = text.slice(start, end).replace(internalTag, '');
  if (/\bicon\b\s*[.[]/.test(body)) return false; // icon.xxx / icon[i] 字符串操作
  if (/\$\{icon\}/.test(body)) return false; // 模板插值
  return true;
}

// 发现文件内所有图标-prop wrapper 组件定义。返回 [{ wrapperName, renderOffset, renderTag }]。
// 形态：function NAME({...,icon,...}) {...} / const NAME = ({...,icon,...}) => {...}（均需 braced body）。
function scanIconPropWrappers(text) {
  const out = [];
  const forms = [
    /(?:\bexport\s+(?:default\s+)?)?function\s+([A-Z]\w*)\s*\(\s*(\{[^}]*\})\s*\)\s*\{/g,
    /(?:\bexport\s+(?:default\s+)?)?(?:const|let|var)\s+([A-Z]\w*)\s*=\s*\(\s*(\{[^}]*\})\s*\)\s*=>\s*\{/g,
  ];
  for (const re of forms) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const name = m[1];
      const params = m[2];
      if (!isIconBinding(params)) continue;
      const bodyOpen = m.index + m[0].length - 1; // 指向 body '{'
      const span = balancedSlice(text, bodyOpen);
      if (!span) continue;
      const bodyStart = bodyOpen + 1;
      const bodyEnd = bodyStart + span.inner.length;
      const site = findInternalIconSite(text, bodyStart, bodyEnd);
      if (!site) continue;
      if (!safeIconUse(text, bodyStart, bodyEnd, site.tag)) continue;
      out.push({ wrapperName: name, renderOffset: site.offset, renderTag: site.tag });
    }
  }
  return out;
}

// 取标签内某 prop 的完整 span（含 prop 名与值），返回 { kind, raw, offsetRel, value?/expr? } 或 null。
// kind: 'literal'（icon="x"）/ 'braced'（icon={...}）。offsetRel 为 raw 在 tag 内的相对索引。
function getPropSpan(tag, prop) {
  const litRe = new RegExp(`\\b${prop}\\s*=\\s*["']([^"']*)["']`);
  let m = tag.match(litRe);
  if (m) return { kind: 'literal', raw: m[0], offsetRel: m.index, value: m[1] };
  const brRe = new RegExp(`\\b${prop}\\s*=\\s*\\{`);
  m = tag.match(brRe);
  if (!m) return null;
  const start = m.index + m[0].length; // 指向 '{' 之后
  let depth = 1;
  let i = start;
  for (; i < tag.length; i++) {
    const ch = tag[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) return null;
  const raw = tag.slice(m.index, i + 1);
  const expr = tag.slice(start, i).trim();
  return { kind: 'braced', raw, offsetRel: m.index, expr };
}

// ─── 报告 ───────────────────────────────────────────────────────────────────

function fmtCandidates(cands) {
  if (!cands || !cands.length) return '（无候选，请 LLM 据 catalog 语义补）';
  return cands.map((c) => `${c.componentName}(s${c.score})`).join(' | ');
}

function reportConsole(scan, byName) {
  const names = Object.keys(byName);
  const confirmed = names.filter((n) => byName[n].match.status === 'confirmed');
  const residual = names.filter((n) => byName[n].match.status === 'residual' && !isOrphan(byName[n].match));
  const autoPlaceholder = names.filter((n) => isOrphan(byName[n].match));

  console.log('[match-icons] 图标匹配报告');
  console.log(`  扫描范围: src/（${scan.files} 个文件，${scan.totalSites} 个调用点）`);
  console.log(`  唯一图标名: ${names.length} 个（confirmed ${confirmed.length} / residual ${residual.length} / 孤儿占位 ${autoPlaceholder.length}）`);
  console.log('');
  console.log(`✓ confirmed（--apply 自动改写）: ${confirmed.length} 个`);
  for (const n of confirmed) {
    const e = byName[n];
    const { domain, catalogName, level, componentName } = e.match;
    const locs = e.sites.map((s) => `${path.basename(s.file)}:${s.line}`).join(', ');
    console.log(`    ${n} → ${domain}.${catalogName} (${level}) → ${componentName}  (${e.sites.length} 处: ${locs})`);
  }
  console.log('');
  console.log(`? residual（带 top-K 候选，交 LLM 选，不自动 apply）: ${residual.length} 个`);
  for (const n of residual) {
    const e = byName[n];
    const { level, componentName, candidates } = e.match;
    const locs = e.sites.map((s) => `${path.basename(s.file)}:${s.line}`).join(', ');
    console.log(`    ${n} [${level}] 建议 ${componentName}  (${e.sites.length} 处: ${locs})`);
    console.log(`      候选: ${fmtCandidates(candidates)}`);
  }
  // 孤儿名：catalog 无任何匹配（无候选、无 level 命中），--apply 自动落占位（catalog 实有名），
  // 不交 LLM 拼名（防臆造非实有 IconPlusIc 名）；待人工/SEMANTIC_MAP 升级为更贴切图标。
  if (autoPlaceholder.length) {
    console.log('');
    console.log(`◇ 孤儿名（catalog 无匹配，--apply 自动落占位 ${PLACEHOLDER.componentName}，待人工/SEMANTIC_MAP 升级）: ${autoPlaceholder.length} 个`);
    for (const n of autoPlaceholder) {
      const e = byName[n];
      const locs = e.sites.map((s) => `${path.basename(s.file)}:${s.line}`).join(', ');
      console.log(`    ${n} [UNMATCHED] → ${e.match.componentName}  (${e.sites.length} 处: ${locs})`);
    }
  }

  // confirmed 调用点改写建议
  if (confirmed.length) {
    console.log('');
    console.log('confirmed 调用点改写建议:');
    for (const n of confirmed) {
      const e = byName[n];
      for (const s of e.sites) {
        console.log(`  ${rel(s.file)}:${s.line}`);
        console.log(`    - ${s.original.trim()}`);
        console.log(`    + import { ${e.match.componentName} } from '@hui/icon-plus';`);
        console.log(`    + ${s.replacement}`);
      }
    }
  }

  // 扁平三元 name → 条件渲染改写（仅两分支均 confirmed 才自动；否则入 residual 段）
  if (scan.ternarySites && scan.ternarySites.length) {
    console.log('');
    console.log(`扁平三元 name → 条件渲染改写: ${scan.ternarySites.length} 处`);
    for (const t of scan.ternarySites) {
      const [a, b] = t.candidates;
      const st = (c) => (c.match.status === 'confirmed' ? c.match.level : `${c.match.level}(residual)`);
      const importNames = [...new Set([a.match.componentName, b.match.componentName])].join(', ');
      const flag = t.allConfirmed ? '[confirmed]' : '[residual，交 LLM 拼装]';
      console.log(`  ${rel(t.file)}:${t.line}  cond: ${t.cond}  ${flag}`);
      console.log(`    - ${t.original.trim()}`);
      console.log(`    + ${a.sourceName} → ${a.match.componentName} (${st(a)})`);
      console.log(`    + ${b.sourceName} → ${b.match.componentName} (${st(b)})`);
      console.log(`    + import { ${importNames } } from '@hui/icon-plus';`);
      console.log(`    + ${t.replacement}`);
    }
  }

  // 链式/嵌套三元 → 全 leaf confirmed 自动改写；任一 residual 交 LLM 拼装
  if (scan.chainedTernarySites && scan.chainedTernarySites.length) {
    console.log('');
    console.log(`链式/嵌套三元 name（全 leaf confirmed → 自动 nested 条件渲染；任一 residual → 交 LLM 拼装）: ${scan.chainedTernarySites.length} 处`);
    for (const t of scan.chainedTernarySites) {
      const flag = t.allConfirmed ? '[confirmed]' : '[residual，交 LLM 拼装]';
      console.log(`  ${rel(t.file)}:${t.line}  cond: ${t.cond}  ${flag}`);
      console.log(`    - ${t.original.trim()}`);
      if (t.allConfirmed) {
        const importNames = [...new Set(t.leafCandidates.map((c) => c.match.componentName))].join(', ');
        console.log(`    + import { ${importNames} } from '@hui/icon-plus';`);
        console.log(`    + ${t.replacement}`);
      }
      for (const c of t.leafCandidates) {
        const st = c.match.status === 'confirmed' ? c.match.level : `${c.match.level}(residual)`;
        console.log(`    + leaf ${c.sourceName} → ${c.match.componentName} (${st})  候选: ${fmtCandidates(c.match.candidates)}`);
      }
    }
  }

  // 变量名（标识符，常量传播未命中）→ 带 expr 交 LLM 跨组件追源；追到静态字面量则解析、追不到才方案A
  if (scan.variableSites && scan.variableSites.length) {
    console.log('');
    console.log(`变量 name（标识符，常量传播未命中，交 LLM 跨组件追源；追到静态字面量则解析、追不到才方案A）: ${scan.variableSites.length} 处`);
    for (const v of scan.variableSites) {
      console.log(`  ${rel(v.file)}:${v.line}  name={${v.expr}}`);
      console.log(`    - ${v.original.trim()}`);
    }
  }

  // 数据数组图标：name={IDENT.FIELD} 绑定同文件/跨文件静态数组 → icon+ 元素塞进 data + render 改 {IDENT.FIELD}
  if (scan.dataIconSites && scan.dataIconSites.length) {
    console.log('');
    console.log(`数据数组图标（icon: "lit" → icon: <IconPlusIc…/> 塞进 data + render → {IDENT.FIELD}）: ${scan.dataIconSites.length} 处`);
    for (const d of scan.dataIconSites) {
      const sameFile = d.arrayFile === d.renderFile;
      console.log(`  ${rel(d.renderFile)}:${d.renderLine}  ${d.renderExpr} ← 数组 ${d.arrayName}（${sameFile ? '同文件' : rel(d.arrayFile)}）`);
      console.log(`    - render ${d.renderOriginal.trim()}  → ${d.renderReplacement}`);
      for (const e of d.entries) {
        const st = e.isPlaceholder
          ? `[未命中→占位 ${PLACEHOLDER.componentName}，residual 候选: ${fmtCandidates(e.match.candidates)}]`
          : `[${e.match.level}]`;
        console.log(`    + ${d.fieldName}: "${e.value}" → ${e.element}  ${st}`);
      }
    }
  }

  // untraced 图标：name={IDENT.FIELD} 追不到同文件/跨文件静态容器/const（含跨边界 props/useMemo/推入函数）→ 不 auto-保方案A、不断言 runtime
  // ——keep 残留 <Icon> shim 可运行（修 import），每处交 LLM 按 closed-set 原则判：闭集→转 / 真 OPEN→保 shim；check-icon-shim.cjs --strict 拦闭集误留
  if (scan.untracedSites && scan.untracedSites.length) {
    console.log('');
    console.log(`追不到源（untraced，交 LLM 按 closed-set 原则判：闭集→转 icon+ / 真 OPEN→保 shim；脚本 keep shim 可运行+修 import，gate 拦闭集误留）: ${scan.untracedSites.length} 处`);
    for (const r of scan.untracedSites) {
      console.log(`  ${rel(r.file)}:${r.line}  name={${r.expr}}  [${r.reason}]`);
      console.log(`    - ${r.original.trim()}`);
    }
  }

  // 图标-prop wrapper（SoftTag/ToggleRow）：调用点 icon= → icon={<IconPlusIc…/>} + 内部 <Icon name={icon}/> → {icon}
  if (scan.propWrapperSites && scan.propWrapperSites.length) {
    console.log('');
    console.log(`图标-prop wrapper 组件（调用点 icon= → icon={<IconPlusIc…/>}，内部 <Icon name={icon}/> → {icon}）: ${scan.propWrapperSites.length} 个`);
    for (const pw of scan.propWrapperSites) {
      console.log(`  ${rel(pw.wrapperFile)}:${pw.wrapperLine}  wrapper ${pw.wrapperName}  内部 → ${pw.internalReplacement}`);
      for (const ce of pw.callerEdits) {
        console.log(`    ${rel(ce.file)}  - ${ce.raw.trim()}  + ${ce.repl.trim()}${ce.isPlaceholder ? '  [含未命中→占位]' : ''}`);
      }
    }
  }

  // 安全闸退方案 A 的 wrapper（不可静态解析的 icon={expr} 调用方）
  if (scan.propWrapperResidual && scan.propWrapperResidual.length) {
    console.log('');
    console.log(`图标-prop wrapper 安全闸退方案A（存在不可静态解析的 icon={expr} 调用方，整组保留 <Icon> shim）: ${scan.propWrapperResidual.length} 个`);
    for (const pw of scan.propWrapperResidual) {
      console.log(`  ${rel(pw.wrapperFile)}:${pw.wrapperLine}  wrapper ${pw.wrapperName}  [${pw.reason}]`);
      for (const c of pw.callers) {
        console.log(`    ${rel(c.file)}:${c.line}  icon={${c.expr}}  (${c.kind})`);
      }
    }
  }
}

function rel(p) {
  return p.replace(/\\/g, '/');
}

function writeJson(scan, byName, outPath) {
  const names = Object.keys(byName);
  const confirmedCount = names.filter((n) => byName[n].match.status === 'confirmed').length;
  const icons = names.map((n) => {
    const e = byName[n];
    const m = e.match;
    return {
      sourceName: n,
      normalizedBase: e.normalized.base,
      status: m.status,
      matchLevel: m.level,
      domain: m.domain,
      catalogName: m.catalogName,
      componentName: m.componentName,
      candidates: m.candidates || undefined,
      callSites: e.sites.map((s) => ({
        file: rel(s.file),
        line: s.line,
        original: s.original.trim(),
        replacement: s.replacement,
      })),
    };
  });
  // imports 收 confirmed 名 + 孤儿占位名（两者均由 --apply 自动改写，需注入 import）；非孤儿 residual 不自动 apply，不预占 import 名
  const imports = {};
  for (const n of names) {
    const m = byName[n].match;
    if (m.status !== 'confirmed' && !isOrphan(m)) continue;
    for (const s of byName[n].sites) {
      const f = rel(s.file);
      (imports[f] = imports[f] || new Set()).add(m.componentName);
    }
  }

  const ternarySites = (scan.ternarySites || []).map((t) => {
    const [a, b] = t.candidates;
    if (t.allConfirmed) {
      const f = rel(t.file);
      (imports[f] = imports[f] || new Set()).add(a.match.componentName).add(b.match.componentName);
    }
    return {
      file: rel(t.file),
      line: t.line,
      cond: t.cond,
      allConfirmed: t.allConfirmed === true,
      original: t.original.trim(),
      replacement: t.replacement,
      candidates: [
        { sourceName: a.sourceName, status: a.match.status, matchLevel: a.match.level, componentName: a.match.componentName, candidates: a.match.candidates || undefined },
        { sourceName: b.sourceName, status: b.match.status, matchLevel: b.match.level, componentName: b.match.componentName, candidates: b.match.candidates || undefined },
      ],
    };
  });
  const chainedTernarySites = (scan.chainedTernarySites || []).map((t) => {
    if (t.allConfirmed) {
      const f = rel(t.file);
      t.leafCandidates.forEach((c) => (imports[f] = imports[f] || new Set()).add(c.match.componentName));
    }
    return {
      file: rel(t.file),
      line: t.line,
      cond: t.cond,
      allConfirmed: t.allConfirmed === true,
      original: t.original.trim(),
      replacement: t.replacement,
      leafCandidates: t.leafCandidates.map((c) => ({
        sourceName: c.sourceName,
        status: c.match.status,
        matchLevel: c.match.level,
        componentName: c.match.componentName,
        candidates: c.match.candidates || undefined,
      })),
    };
  });
  const variableSites = (scan.variableSites || []).map((v) => ({
    file: rel(v.file),
    line: v.line,
    expr: v.expr,
    isMember: v.isMember === true,
    original: v.original.trim(),
  }));
  const dataIconSites = (scan.dataIconSites || []).map((d) => {
    const sameFile = d.arrayFile === d.renderFile;
    return {
      renderFile: rel(d.renderFile),
      renderLine: d.renderLine,
      arrayFile: rel(d.arrayFile),
      sameArrayAndRenderFile: sameFile,
      arrayName: d.arrayName,
      fieldName: d.fieldName,
      renderExpr: d.renderExpr,
      root: d.root,
      directArray: d.directArray === true,
      renderOriginal: d.renderOriginal.trim(),
      renderReplacement: d.renderReplacement,
      entries: d.entries.map((e) => ({
        value: e.value,
        status: e.match.status,
        matchLevel: e.match.level,
        componentName: e.componentName,
        isPlaceholder: e.isPlaceholder === true,
        element: e.element,
        candidates: e.match.candidates || undefined,
      })),
    };
  });
  const untracedSites = (scan.untracedSites || []).map((r) => ({
    file: rel(r.file),
    line: r.line,
    expr: r.expr,
    reason: r.reason,
    original: r.original.trim(),
  }));
  const propWrapperSites = (scan.propWrapperSites || []).map((pw) => ({
    wrapperName: pw.wrapperName,
    wrapperFile: rel(pw.wrapperFile),
    wrapperLine: pw.wrapperLine,
    internalReplacement: pw.internalReplacement,
    internalOriginal: pw.internalTag.trim(),
    imports: pw.imports,
    callerEdits: pw.callerEdits.map((ce) => ({
      file: rel(ce.file),
      raw: ce.raw.trim(),
      repl: ce.repl.trim(),
      isPlaceholder: ce.isPlaceholder === true,
    })),
  }));
  const propWrapperResidual = (scan.propWrapperResidual || []).map((pw) => ({
    wrapperName: pw.wrapperName,
    wrapperFile: rel(pw.wrapperFile),
    wrapperLine: pw.wrapperLine,
    reason: pw.reason,
    callers: pw.callers.map((c) => ({ file: rel(c.file), line: c.line, expr: c.expr, kind: c.kind })),
  }));
  // data 数组改写引入的 import 也收进 imports（arrayFile）
  for (const d of scan.dataIconSites || []) {
    const f = rel(d.arrayFile);
    for (const e of d.entries) (imports[f] = imports[f] || new Set()).add(e.componentName);
  }
  // 图标-prop wrapper 调用点改写引入的 import（caller 文件）
  for (const pw of scan.propWrapperSites || []) {
    for (const ce of pw.callerEdits) {
      const f = rel(ce.file);
      for (const imp of ce.imports || []) (imports[f] = imports[f] || new Set()).add(imp);
    }
  }
  const dataIconPlaceholderCount = (scan.dataIconSites || []).reduce(
    (acc, d) => acc + d.entries.filter((e) => e.isPlaceholder).length,
    0
  );
  const propWrapperPlaceholderCount = (scan.propWrapperSites || []).reduce(
    (acc, pw) => acc + pw.callerEdits.filter((ce) => ce.isPlaceholder).length,
    0
  );
  const residualCount = names.filter((n) => byName[n].match.status === 'residual' && !isOrphan(byName[n].match)).length;
  const autoPlaceholderCount = names.filter((n) => isOrphan(byName[n].match)).length;
  const autoPlaceholderSites = names
    .filter((n) => isOrphan(byName[n].match))
    .map((n) => {
      const e = byName[n];
      return {
        sourceName: n,
        componentName: e.match.componentName,
        callSites: e.sites.map((s) => ({ file: rel(s.file), line: s.line, original: s.original.trim(), replacement: s.replacement })),
      };
    });
  const out = {
    summary: {
      total: names.length,
      confirmedCount,
      residualCount,
      autoPlaceholderCount,
      ternaryCount: ternarySites.length,
      chainedTernaryCount: chainedTernarySites.length,
      variableCount: variableSites.length,
      dataIconSiteCount: dataIconSites.length,
      dataIconPlaceholderCount,
      untracedCount: untracedSites.length,
      propWrapperSiteCount: propWrapperSites.length,
      propWrapperResidualCount: propWrapperResidual.length,
      propWrapperPlaceholderCount,
      needsLlmReview: residualCount + ternarySites.filter((t) => !t.allConfirmed).length + chainedTernarySites.filter((t) => !t.allConfirmed).length + variableSites.length + dataIconPlaceholderCount + untracedSites.length + propWrapperResidual.length,
    },
    icons,
    autoPlaceholderSites,
    ternarySites,
    chainedTernarySites,
    variableSites,
    dataIconSites,
    untracedSites,
    propWrapperSites,
    propWrapperResidual,
    imports: Object.fromEntries(Object.entries(imports).map(([k, v]) => [k, [...v].sort()])),
  };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
}

// ─── --apply 改写 ───────────────────────────────────────────────────────────

function applyRewrites(scan, byName, srcDir) {
  // 按文件聚合改写计划：edits（标签替换）+ 所需 @hui/icon-plus 组件名
  const byFile = new Map();
  const plan = (file) => {
    if (!byFile.has(file)) byFile.set(file, { edits: [], imports: new Set() });
    return byFile.get(file);
  };

  // 字面量 name 调用点：confirmed 自动改写；孤儿（UNMATCHED 无候选）亦自动落占位（catalog 实有名，
  // 防 LLM residual 阶段臆造非实有 IconPlusIc 名）；非孤儿 residual（有候选）交 LLM 选，不动。
  for (const n of Object.keys(byName)) {
    const m = byName[n].match;
    if (m.status !== 'confirmed' && !isOrphan(m)) continue;
    for (const s of byName[n].sites) {
      const comp = m.componentName;
      const p = plan(s.file);
      p.imports.add(comp);
      // 幂等：若调用点已被替换（tag 含目标组件名），跳过
      if (new RegExp(`<${comp}\\b`).test(s.tag)) continue;
      p.edits.push({ tag: s.tag, offset: s.offset, repl: s.replacement });
    }
  }
  // 扁平三元 name 调用点：仅两分支均 confirmed 才自动改写
  for (const t of scan.ternarySites || []) {
    if (!t.allConfirmed) continue;
    const p = plan(t.file);
    t.candidates.forEach((c) => p.imports.add(c.match.componentName));
    // 幂等：tag 已含 IconPlusIc（前次已改写），跳过
    if (/<IconPlusIc\b/.test(t.tag)) continue;
    p.edits.push({ tag: t.tag, offset: t.offset, repl: t.replacement });
  }
  // 链式/嵌套三元 name 调用点：全 leaf confirmed 才自动改写（同扁平三元机制：leaf 按序换 icon+ 元素 → nested 条件渲染）
  for (const t of scan.chainedTernarySites || []) {
    if (!t.allConfirmed) continue;
    const p = plan(t.file);
    t.leafCandidates.forEach((c) => p.imports.add(c.match.componentName));
    // 幂等：tag 已含 IconPlusIc（前次已改写），跳过
    if (/<IconPlusIc\b/.test(t.tag)) continue;
    p.edits.push({ tag: t.tag, offset: t.offset, repl: t.replacement });
  }
  // 数据数组图标站点：数组里 FIELD:"lit" → FIELD:<Comp .../>（在 arrayFile），render <Icon name={t.field}/> → {t.field}（在 renderFile）；组件 import 进 arrayFile
  for (const d of scan.dataIconSites || []) {
    const ap = plan(d.arrayFile);
    for (const e of d.entries) {
      ap.imports.add(e.componentName);
      // 幂等：raw 已被改写（不再含字符串字面量形态）→ 跳过
      if (!new RegExp(`${d.fieldName}\\s*:\\s*["']`).test(e.raw)) continue;
      ap.edits.push({ tag: e.raw, offset: e.offset, repl: e.element });
    }
    const rp = plan(d.renderFile);
    // 幂等：render tag 已不含 <Icon（前次已改为 {t.field}）→ 跳过
    if (!/<Icon\b/.test(d.renderTag)) continue;
    rp.edits.push({ tag: d.renderTag, offset: d.renderOffset, repl: d.renderReplacement });
  }

  // 图标-prop wrapper：调用点 icon= → icon={<IconPlusIc…/>}（caller 文件）+ wrapper 内部 <Icon name={icon}/> → {icon}/裸（wrapper 文件）
  for (const pw of scan.propWrapperSites || []) {
    for (const ce of pw.callerEdits) {
      const p = plan(ce.file);
      for (const imp of ce.imports || []) p.imports.add(imp);
      p.edits.push({ tag: ce.raw, offset: ce.offset, repl: ce.repl });
    }
    const wp = plan(pw.wrapperFile);
    // 内部 edit：与 member dataIconSites 的 render edit 同位时由 seenFrom 去重
    if (/<Icon\b/.test(pw.internalTag)) {
      wp.edits.push({ tag: pw.internalTag, offset: pw.internalOffset, repl: pw.internalReplacement });
    }
  }
  // 旧 Icon import 清理正则（文件已无 <Icon 调用时移除）：覆盖 legacy 具名 shared/icon(s).jsx（scaffold 旧产物/源项目）与新默认 @/shared/Icon（scaffold 重构后）
  const oldIconImportRe = /^\s*import\s*(?:\{\s*Icon\s*\}|Icon)\s*from\s*['"](?:[^'"]*?(?:assets\/)?shared\/icons?\.jsx?|@\/shared\/Icon)['"];?\s*\r?\n?/gm;

  // untraced 站点（追不到源）+ 安全闸 wrapper 残留文件：纳入 byFile 以触写（不 auto-保方案A、不断言 runtime——
  // 仅 keep 残留 <Icon> shim 可运行：修 import 路径让产物不崩，每处残留交 LLM 按 closed-set 原则判、check-icon-shim --strict 拦）
  const untracedFiles = new Set(
    (scan.untracedSites || []).map((r) => r.file).concat(scan.shimKeepFiles || [])
  );
  for (const f of untracedFiles) plan(f); // 纳入 byFile 以触写（即便无其他改写，仍修 shim import 让残留 <Icon> 可运行）

  let touched = 0;
  for (const [file, { edits, imports }] of byFile) {
    let text = fs.readFileSync(file, 'utf8');
    // 解析每个 edit 的实际位置（offset 可能因前序编辑漂移，先按 offset 定位，失败再从头找）
    const resolved = [];
    const seenFrom = new Set(); // 同位置多 edit（多个 render 站点引用同一数组条目）去重，仅取首个
    for (const e of edits) {
      let idx = text.indexOf(e.tag, e.offset);
      if (idx === -1) idx = text.indexOf(e.tag);
      if (idx === -1) continue;
      if (seenFrom.has(idx)) continue;
      seenFrom.add(idx);
      resolved.push({ from: idx, to: idx + e.tag.length, repl: e.repl });
    }
    if (!resolved.length) {
      // 调用点都已改写但 import 仍缺 / untraced 文件 → 补 import + 残留 <Icon> 修 shim 路径
      if (!imports.size && !untracedFiles.has(file)) continue;
      if (imports.size) text = ensureImport(text, [...imports].sort());
      // 残留 <Icon>（untraced / 真 OPEN）→ 修 shim import 让其可运行（不断言方案A，gate 拦闭集误留）；无 <Icon> → 清旧 import
      if (/<Icon\b/.test(text)) text = fixShimImportPath(text);
      else text = text.replace(oldIconImportRe, '');
      fs.writeFileSync(file, text, 'utf8');
      touched++;
      continue;
    }
    // 从后往前替换，避免 offset 漂移
    resolved.sort((a, b) => b.from - a.from);
    for (const e of resolved) {
      text = text.slice(0, e.from) + e.repl + text.slice(e.to);
    }
    // 注入 @hui/icon-plus import（幂等：已有则合并去重）
    if (imports.size) text = ensureImport(text, [...imports].sort());
    // 残留 <Icon>（untraced / 真 OPEN）→ 修 shim import 让其可运行（不断言方案A，gate 拦闭集误留）；无 <Icon> → 清旧 import
    if (/<Icon\b/.test(text)) text = fixShimImportPath(text);
    else text = text.replace(oldIconImportRe, '');
    fs.writeFileSync(file, text, 'utf8');
    touched++;
  }

  // .js→.jsx / .ts→.tsx 转换 pass：本次改写引入 JSX（替换串含 <IconPlusIc）的 .js/.ts 文件转扩展名，并修引用方显式扩展名 import
  const renamed = renameJsxFiles(byFile, untracedFiles);
  if (renamed.size) {
    fixExplicitExtensionImports(renamed, srcDir);
    console.log(`[match-icons] --apply: ${renamed.size} 个 .js/.ts 文件转 .jsx/.tsx（引入 JSX）并修引用方显式扩展名 import。`);
  }
  console.log(`[match-icons] --apply: 改写 ${touched} 个文件。`);
}

// 判定本次改写是否在 file 引入 JSX：edits 中有替换串含 <IconPlusIc（数据数组元素 / 字面量 / 三元改写均含）。render 站点 {t.icon} 不引入 <，不算。
function editIntroducesJsx(edits) {
  return edits.some((e) => e.repl.includes('<IconPlusIc'));
}

// 把因改写引入 JSX 的 .js→.jsx / .ts→.tsx 重命名，写回新路径删旧；返回 Map<oldAbs,newAbs>。仅扫本次有改写的文件（byFile keys）+ 方案A 文件（保留 <Icon>，但其引用方可能因 data 文件重命名需修）。
function renameJsxFiles(byFile, untracedFiles) {
  const renamed = new Map();
  for (const [file, { edits }] of byFile) {
    if (!editIntroducesJsx(edits)) continue;
    const ext = path.extname(file);
    let newExt = null;
    if (ext === '.js') newExt = '.jsx';
    else if (ext === '.ts') newExt = '.tsx';
    if (!newExt) continue;
    const newPath = file.slice(0, file.length - ext.length) + newExt;
    const text = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(newPath, text, 'utf8');
    if (file !== newPath && fs.existsSync(file)) fs.unlinkSync(file);
    renamed.set(file, newPath);
  }
  return renamed;
}

// 扫 src/ 所有文件，把引用了 renamed 旧路径且带显式 .js/.ts 扩展名的 import 说明符改为新扩展名。无扩展名 import 不动（解析器仍能命中 .jsx）。
function fixExplicitExtensionImports(renamed, srcDir) {
  if (!renamed.size) return;
  const oldPaths = new Set(renamed.keys());
  const allFiles = walk(srcDir, []);
  let fixed = 0;
  for (const f of allFiles) {
    if (!fs.existsSync(f)) continue;
    let text = fs.readFileSync(f, 'utf8');
    let changed = false;
    const rewrite = (spec) => {
      if (!/\.js$/.test(spec) && !/\.ts$/.test(spec)) return spec;
      const resolved = path.resolve(path.dirname(f), spec);
      if (oldPaths.has(resolved)) {
        const newExt = path.extname(renamed.get(resolved)); // '.jsx' / '.tsx'
        return spec.replace(/\.(js|ts)$/, newExt); // 匹配含点号，替换也含点号
      }
      return spec;
    };
    text = text.replace(/(\bfrom\s*['"])([^'"]+)(['"])/g, (m, pre, spec, post) => {
      const ns = rewrite(spec);
      if (ns !== spec) { changed = true; return `${pre}${ns}${post}`; }
      return m;
    });
    text = text.replace(/(\bimport\s*\(\s*['"])([^'"]+)(['"]\s*\))/g, (m, pre, spec, post) => {
      const ns = rewrite(spec);
      if (ns !== spec) { changed = true; return `${pre}${ns}${post}`; }
      return m;
    });
    if (changed) {
      fs.writeFileSync(f, text, 'utf8');
      fixed++;
    }
  }
  if (fixed) console.log(`[match-icons] --apply: 修正 ${fixed} 个引用文件的显式扩展名 import。`);
}


// 确保文件含 `import { ... } from '@hui/icon-plus'`；已有则合并去重，无则插到首个 import 之后
function ensureImport(text, names) {
  const re = /import\s*\{([^}]*)\}\s*from\s*['"]@hui\/icon-plus['"];?/g;
  const existing = new Set();
  let firstPos = -1;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (firstPos === -1) firstPos = m.index;
    m[1].split(',').map((s) => s.trim()).filter(Boolean).forEach((n) => existing.add(n));
  }
  for (const n of names) existing.add(n);
  const merged = `import { ${[...existing].sort().join(', ')} } from '@hui/icon-plus';`;

  if (firstPos !== -1) {
    // 删除所有 @hui/icon-plus import 行（含前导空白与换行），再在首个 import 处插入合并行
    const stripped = text.replace(
      /^\s*import\s*\{[^}]*\}\s*from\s*['"]@hui\/icon-plus['"];?\s*\r?\n?/gm,
      ''
    );
    const head = stripped.match(/^\s*import[^\n]*\r?\n/m);
    if (head) {
      const at = head.index + head[0].length;
      return stripped.slice(0, at) + merged + '\n' + stripped.slice(at);
    }
    return merged + '\n' + stripped;
  }

  // 无现有 @hui/icon-plus import：插到首个 import 之后，否则文件头
  const head = text.match(/^\s*import[^\n]*\r?\n/m);
  if (head) {
    const at = head.index + head[0].length;
    return text.slice(0, at) + merged + '\n' + text.slice(at);
  }
  return merged + '\n' + text;
}

// ─── 方案 B 两段式：决策日志 + 叶子枚举（catalog-free，无占位）──────────────

// 从 <Icon> 标签抽 size/color（render 站点信息，供 LLM 预期渲染形态；pass 2 会重算，非载重字段）。
function safeRenderSite(tag) {
  if (!tag) return null;
  try {
    const p = extractIconProps(tag);
    const rs = {};
    const size = p.sizeStr || p.sizeExpr;
    if (size != null && size !== '') rs.size = size;
    if (p.color != null && p.color !== '') rs.color = p.color;
    return Object.keys(rs).length ? rs : null;
  } catch (e) {
    return null;
  }
}

// 加载 LLM 维护的决策日志（--apply-decisions 用）。格式：[{ keyword, requestUrl, iconPlusName, candidates[], selectedBecause }]（iconPlusName = response.icons[0].name；requestUrl/candidates/selectedBecause 供审计，loader 仅消费 keyword/iconPlusName）。
// 返回 { byRaw, byLower, count }：名真值来自 getIconInfo 在线返回，catalog 零参与。
function loadDecisions(decisionsPath) {
  if (!decisionsPath) {
    console.error('[match-icons] --apply-decisions 需配合 --decisions <path> 指定决策日志');
    process.exit(1);
  }
  if (!fs.existsSync(decisionsPath)) {
    console.error(`[match-icons] 决策日志未找到: ${decisionsPath}`);
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
  } catch (e) {
    console.error(`[match-icons] 决策日志解析失败: ${decisionsPath} (${e.message})`);
    process.exit(1);
  }
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.entries) ? data.entries : null);
  if (!arr) {
    console.error(`[match-icons] 决策日志须为数组 [{ keyword, iconPlusName, ... }]: ${decisionsPath}`);
    process.exit(1);
  }
  const byRaw = new Map();
  const byLower = new Map();
  for (const e of arr) {
    if (!e || typeof e !== 'object') continue;
    const kw = e.keyword != null ? String(e.keyword) : null;
    const name = e.iconPlusName != null ? String(e.iconPlusName) : null;
    if (!kw || !name) {
      console.error(`[match-icons] 决策日志条目缺 keyword/iconPlusName: ${JSON.stringify(e)}`);
      process.exit(1);
    }
    byRaw.set(kw, name);
    byLower.set(kw.toLowerCase(), name);
  }
  return { byRaw, byLower, count: arr.length };
}

// 决策日志名解析（替换 matchOne/catalog）：命中 → confirmed + getIconInfo 真名；未命中 → missing 并记入 missingSet。
// 名全部来自决策日志（getIconInfo 在线返回），catalog 不参与；缺名不静默落占位（main 在 apply 前拦截 missing 报错）。
function resolveFromDecisions(norm, decisions, missingSet) {
  const raw = norm.raw;
  const name = decisions.byRaw.get(raw) || decisions.byLower.get(norm.lower);
  if (name) return { status: 'confirmed', level: 'DECISION', componentName: name, candidates: [] };
  if (!missingSet.has(raw)) missingSet.add(raw);
  return { status: 'missing', keyword: raw, level: 'MISSING', candidates: [] };
}

// 收集所有闭集叶子（--plan 产 icon-leaves.json / --apply-decisions 校验 missing 用）。
// 叶子集与扫描一一对应：字面量/antd/常量传播(byName)、扁平三元、链式三元、数据数组/对象地图、wrapper 调用方叶子。
// lineOf(file, offset) => 行号（main 注入 textCache 版本，闭包访问文件文本）。
function collectLeaves(scan, byName, lineOf) {
  const leaves = [];
  const untraced = [];
  const pushLeaf = (sourceKeyword, file, line, closedForm, renderSite) => {
    if (sourceKeyword == null || sourceKeyword === '') return;
    leaves.push({ sourceKeyword, site: { file, line }, closedForm, ...(renderSite ? { renderSite } : {}) });
  };
  // 字面量 / antd / 常量传播命中（byName 每个 sourceName 可能多站点）
  for (const name of Object.keys(byName)) {
    for (const s of byName[name].sites) {
      pushLeaf(name, s.file, s.line, 'literal', safeRenderSite(s.tag));
    }
  }
  // 扁平三元：两候选各为叶子，站点为三元调用点
  for (const t of scan.ternarySites || []) {
    const rp = safeRenderSite(t.tag);
    for (const c of t.candidates) pushLeaf(c.sourceName, t.file, t.line, 'ternary', rp);
  }
  // 链式/嵌套三元：各字面量 leaf 为叶子
  for (const t of scan.chainedTernarySites || []) {
    const rp = safeRenderSite(t.tag);
    for (const c of t.leafCandidates) pushLeaf(c.sourceName, t.file, t.line, 'chained-ternary', rp);
  }
  // 数据数组 / 对象地图：叶子值在 arrayFile（line 由 offset 解），render 站点提供 size/color
  for (const d of scan.dataIconSites || []) {
    const rp = safeRenderSite(d.renderTag);
    for (const e of d.entries) {
      pushLeaf(e.value, d.arrayFile, lineOf(d.arrayFile, e.offset), 'data-binding', rp);
    }
  }
  // wrapper 调用方叶子（字面量/三元；member 已进 dataIconSites，此处不重复）
  for (const pw of scan.propWrapperSites || []) {
    const rp = safeRenderSite(pw.internalTag);
    for (const ce of pw.callerEdits || []) {
      for (const l of ce.leaves || []) pushLeaf(l.sourceKeyword, ce.file, pw.wrapperLine, l.closedForm, rp);
    }
  }
  // 跨边界 / 未追源 / 安全闸 wrapper 整组：无 sourceKeyword，交 LLM 手工
  for (const u of scan.untracedSites || []) {
    untraced.push({ file: u.file, line: u.line, expr: u.expr, reason: u.reason });
  }
  // 动态变量站点（name={prop}/name={state} 等，无静态源 keyword）→ 同属跨边界，交 LLM 手工
  for (const v of scan.variableSites || []) {
    untraced.push({ file: v.file, line: v.line, expr: v.expr, reason: v.isMember ? 'dynamic-member' : 'dynamic-variable' });
  }
  for (const r of scan.propWrapperResidual || []) {
    untraced.push({ file: r.wrapperFile, line: r.wrapperLine, expr: r.wrapperName, reason: r.reason });
  }
  return { leaves, untraced };
}

// 写 icon-leaves.json 到 OS 临时目录（沿用报告写临时目录惯例，不进产物根）。
// 每条 leaf：{ sourceKeyword, site:{file,line}, closedForm, renderSite?{size,color?} }；去重保留首次站点。
function writeLeavesJson(leavesData, outPath) {
  const seen = new Set();
  const uniq = [];
  for (const l of leavesData.leaves) {
    if (seen.has(l.sourceKeyword)) continue;
    seen.add(l.sourceKeyword);
    uniq.push(l);
  }
  const payload = {
    mode: 'plan',
    uniqueKeywordCount: uniq.length,
    totalLeafSites: leavesData.leaves.length,
    leaves: uniq,
    untraced: leavesData.untraced,
    note: '每个唯一 sourceKeyword 调一次 getIconInfo——请求参数固定 keyword=<源名>&topK=2&source_id=6（禁止改 topK/source_id、禁止加额外参数）；结果写入 icon-b-decisions.json（每条 {keyword,requestUrl,iconPlusName,candidates[],selectedBecause}，iconPlusName=response.icons[0].name）；untraced 段按 Icon.md 跨边界 recipe 手工。',
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  return { uniqueKeywordCount: uniq.length, totalLeafSites: leavesData.leaves.length, untracedCount: leavesData.untraced.length };
}

// ─── 主流程 ──────────────────────────────────────────────────────────────────

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const targetRoot = path.resolve(opts.targetRoot);
  const srcDir = path.join(targetRoot, 'src');
  // 方案 B 两段式与方案 C(catalog) 是并列模式：plan/applyDecisions 不读 catalog、不塞占位；
  // 仅 C 路径(--apply 或默认报告)需要 catalog 做名匹配。
  const mode = opts.plan ? 'plan' : (opts.applyDecisions ? 'applyDecisions' : 'catalog');

  const catalogPath =
    opts.catalogPath ||
    path.join(__dirname, '..', 'references', 'icons', 'icon-plus-names.json');

  if (mode === 'catalog' && !fs.existsSync(catalogPath)) {
    console.error(`[match-icons] catalog 未找到: ${catalogPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(srcDir)) {
    console.error(`[match-icons] 目标工程无 src/ 目录: ${srcDir}`);
    process.exit(1);
  }

  const index = mode === 'catalog' ? loadCatalog(catalogPath) : null;
  const files = walk(srcDir, []);
  const scan = {
    files: files.length,
    totalSites: 0,
    ternarySites: [],
    chainedTernarySites: [],
    variableSites: [],
    dataIconSites: [],
    untracedSites: [], // 追不到源（含跨边界 props/useMemo/推入函数）→ 不断言 runtime、不 auto-保方案A：keep 残留 <Icon> shim 可运行 + 修 import，交 LLM 按 closed-set 判、gate 拦
    propWrapperSites: [], // 图标-prop wrapper（自动改写）：调用点 icon= → icon={<IconPlusIc…/>} + 内部 → {icon}
    propWrapperResidual: [], // 安全闸 wrapper（任一调用方不可静态解析）→ 整组 untraced 交 LLM+gate（不 auto-保方案A）
    shimKeepFiles: [], // untraced wrapper 文件（歧义/safety-gate）：keep 残留 shim 可运行 + 修 import，gate 拦
  };
  // byName: sourceName -> { normalized, match, sites: [{file,line,original,replacement,offset,tag}] }
  const byName = {};
  const topk = opts.topk;
  // 名解析闭包：catalog 模式走 matchOne；plan 模式走 stub（不取名、不改文件）；applyDecisions 走决策日志。
  // applyDecisions 下 match1 命中返回 confirmed+真名，未命中返回 missing 并记入 missingSet（apply 前拦截）。
  const missingSet = new Set();
  const decisions = mode === 'applyDecisions' ? loadDecisions(opts.decisionsPath) : null;
  const match1 =
    mode === 'plan'
      ? (norm) => ({ status: 'planned', level: 'PLAN', componentName: null, candidates: [] })
      : mode === 'applyDecisions'
        ? (norm) => resolveFromDecisions(norm, decisions, missingSet)
        : (norm) => matchOne(norm, index, topk);

  // 文件文本缓存（Phase B 跨文件数组解析需要）
  const textCache = new Map();
  const memberSites = []; // 待 Phase B 解析的 name={IDENT.FIELD} 站点

  function addSite(name, normalized, file, line, original, replacement, offset, tag) {
    if (!byName[name]) {
      byName[name] = { normalized, match: match1(normalized), sites: [] };
    }
    byName[name].sites.push({ name, file, line, original, replacement, offset, tag });
    scan.totalSites++;
  }

  // 处理一处扁平三元 name 调用点：两候选各自匹配 + buildReplacement，组装条件渲染替换串。
  // 容器内（icon={<Icon/>}）不包外层 {}，独立 JSX 子节点包 {cond ? <A/> : <B/>}。
  function addTernarySite(t, file, text) {
    const line = lineOfOffset(text, t.offset);
    const props = extractIconProps(t.tag);
    const context = detectContext(text, t.offset);
    const candidates = t.candidates.map((srcName) => {
      const normalized = normalizeSourceName(srcName);
      const match = byName[srcName] ? byName[srcName].match : match1(normalized);
      return { sourceName: srcName, normalized, match, replacement: buildReplacement(match, props, context) };
    });
    const [a, b] = candidates;
    const inner = `${t.cond} ? ${a.replacement} : ${b.replacement}`;
    // 按上下文判 {}：JSX 子节点位 → {inner}；表达式位（三元分支/括号/对象值等）→ 裸 inner（避免 {} 被当对象字面量）
    const replacement = wrapIfNeeded(inner, text, t.offset);
    scan.ternarySites.push({
      file,
      line,
      offset: t.offset,
      tag: t.tag,
      original: t.tag,
      cond: t.cond,
      candidates,
      replacement,
      allConfirmed: a.match.status === 'confirmed' && b.match.status === 'confirmed',
    });
    scan.totalSites++;
  }

  // 链式/嵌套三元：各字面量分支 leaf 各自匹配；**全 leaf confirmed → 自动拼 nested 条件渲染**（同扁平三元）；任一 residual → 交 LLM 拼装
  function addChainedTernarySite(t, file, text) {
    const line = lineOfOffset(text, t.offset);
    const props = extractIconProps(t.tag);
    const context = detectContext(text, t.offset);
    const leafCandidates = t.candidates.map((srcName) => {
      const normalized = normalizeSourceName(srcName);
      const match = byName[srcName] ? byName[srcName].match : match1(normalized);
      return { sourceName: srcName, normalized, match, replacement: buildReplacement(match, props, context) };
    });
    const allConfirmed = leafCandidates.every((c) => c.match.status === 'confirmed');
    // 构 nested 条件渲染：t.cond 里每个字面量 leaf 按 leafRe 出现序换成对应 icon+ 元素（条件部分含字面量的边角形态不在自动范围）
    let leafIdx = 0;
    const inner = t.cond.replace(/["']([^"']*)["']/g, () => {
      const lc = leafCandidates[leafIdx++];
      return lc.replacement;
    });
    const replacement = wrapIfNeeded(inner, text, t.offset);
    scan.chainedTernarySites.push({
      file,
      line,
      offset: t.offset,
      tag: t.tag,
      original: t.tag,
      cond: t.cond,
      leafCandidates,
      replacement,
      allConfirmed,
    });
    scan.totalSites++;
  }

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    textCache.set(file, text);

    // a. 源 <Icon name="..."/> 调用点（字面量 name）
    const iconSites = scanIconComponent(text);
    for (const s of iconSites) {
      const norm = normalizeSourceName(s.name);
      const match = byName[s.name] ? byName[s.name].match : match1(norm);
      const props = extractIconProps(s.tag);
      const context = detectContext(text, s.offset);
      const replacement = buildReplacement(match, props, context);
      const line = lineOfOffset(text, s.offset);
      addSite(s.name, norm, file, line, s.tag, replacement, s.offset, s.tag);
    }

    // b. @ant-design/icons 用法
    if (opts.includeAntdIcons) {
      const antd = scanAntdIcons(text);
      for (const u of antd.usages) {
        const norm = normalizeSourceName(u.name);
        const match = byName[u.name] ? byName[u.name].match : match1(norm);
        const props = extractIconProps(u.tag);
        const context = detectContext(text, u.offset);
        const replacement = buildReplacement(match, props, context);
        const line = lineOfOffset(text, u.offset);
        addSite(u.name, norm, file, line, u.tag, replacement, u.offset, u.tag);
      }
    }

    // c. <Icon name={...}/> 动态 name（常量传播 + 三元 + 变量分流）
    const constMap = buildConstMap(text);
    const dyn = scanDynamicIcons(text, constMap);
    // 常量传播命中的变量 / name={"lit"} → 当字面量走 addSite
    for (const l of dyn.literals) {
      const norm = normalizeSourceName(l.value);
      const match = byName[l.value] ? byName[l.value].match : match1(norm);
      const props = extractIconProps(l.tag);
      const context = detectContext(text, l.offset);
      const replacement = buildReplacement(match, props, context);
      const line = lineOfOffset(text, l.offset);
      addSite(l.value, norm, file, line, l.tag, replacement, l.offset, l.tag);
    }
    for (const t of dyn.ternaryFlat) addTernarySite(t, file, text);
    for (const t of dyn.ternaryChained) addChainedTernarySite(t, file, text);
    for (const v of dyn.variables) {
      scan.variableSites.push({
        file,
        line: lineOfOffset(text, v.offset),
        offset: v.offset,
        tag: v.tag,
        original: v.tag,
        expr: v.expr,
        isMember: v.isMember,
      });
      scan.totalSites++;
    }
    // 成员表达式 name={IDENT.field} / name={IDENT[i].field} → 暂存，Phase B 跨文件解析同文件/跨文件静态数组
    for (const mb of dyn.members) {
      memberSites.push({
        file,
        line: lineOfOffset(text, mb.offset),
        offset: mb.offset,
        tag: mb.tag,
        original: mb.tag,
        root: mb.root,
        fieldName: mb.fieldName,
        expr: mb.expr,
      });
      scan.totalSites++;
    }
  }

  // Phase B：解析成员表达式站点 → dataIconSite（同文件/跨文件静态数组/对象地图）或 untracedSite（追不到源→交 LLM 按 closed-set 判，不 auto-保方案A）
  for (const site of memberSites) {
    const renderText = textCache.get(site.file);
    // 绑定数组变量名 ARR：root 是循环变量（.map/forEach/for-of 绑到 ARR）；否则 root 自身是数组常量（直接索引 MENU[0].icon）
    let arrName = findLoopBinding(renderText, site.root);
    let directArray = false;
    if (!arrName) {
      arrName = site.root; // 直接索引模式：root 即数组名（resolveArrayDecl 会验证它确为数组常量）
      directArray = true;
    }
    const decl = resolveArrayDecl(arrName, site.file, textCache);
    // 对象地图回退：arrName 解析不到数组 const 时，root 可能是「= OBJ[runtimeKey] 的局部变量」
    // （const cat = CATEGORY_STYLE[key]），或 root 直接是对象名（<Icon name={CATEGORY_STYLE[x].icon}/>）。
    // 命中后与数据数组共用同一 dataIconSite 形态 + apply 路径（buildDataIconElement/wrapIfNeeded/renameJsxFiles）。
    let objName = null;
    let objDecl = null;
    let directObject = false;
    if (!decl) {
      objName = findObjectMapBinding(renderText, site.root);
      if (!objName) {
        objName = site.root; // 直接形态：root 即对象名（resolveObjectDecl 会验证它确为对象常量）
        directObject = true;
      }
      objDecl = resolveObjectDecl(objName, site.file, textCache);
    }
    if (!decl && !objDecl) {
      // 追不到源（无循环绑定且 root 非任何已扫文件中的数组/对象常量 / 跨文件多名歧义 / 跨边界 props）→ untraced：交 LLM 按 closed-set 判（闭集→转 / 真 OPEN→保 shim），不 auto-保方案A
      scan.untracedSites.push({
        file: site.file, line: site.line, offset: site.offset, tag: site.tag, original: site.tag,
        expr: site.expr, reason: 'no-loop-binding-or-array-const',
      });
      continue;
    }
    // 容器：数组（decl）或对象地图（objDecl）。统一取容器文件文本 + 开括号索引 + 闭合性/抽取函数。
    let containerFile, containerOpenIdx, containerName, directContainer;
    let fnHasNonLiteral, fnExtract, nonLiteralReason;
    if (decl) {
      containerFile = decl.arrayFile;
      containerOpenIdx = decl.arrOpenIdx;
      containerName = arrName;
      directContainer = directArray;
      fnHasNonLiteral = hasNonLiteralField;
      fnExtract = extractDataIconFields;
      nonLiteralReason = 'non-literal-field-in-array';
    } else {
      containerFile = objDecl.objFile;
      containerOpenIdx = objDecl.objOpenIdx;
      containerName = objName;
      directContainer = directObject;
      fnHasNonLiteral = hasNonLiteralObjectField;
      fnExtract = extractObjectIconFields;
      nonLiteralReason = 'non-literal-field-in-object';
    }
    const containerText = textCache.get(containerFile);
    // 集合不封闭（含非字符串字面量字段）→ 不能安全转元素，退方案A
    if (fnHasNonLiteral(containerText, containerOpenIdx, site.fieldName)) {
      scan.untracedSites.push({
        file: site.file, line: site.line, offset: site.offset, tag: site.tag, original: site.tag,
        expr: site.expr, reason: nonLiteralReason,
      });
      continue;
    }
    const entries = fnExtract(containerText, containerOpenIdx, site.fieldName);
    if (!entries.length) {
      // 容器里没有该字段的字符串字面量（可能全是非字面量，或字段名不匹配）
      scan.untracedSites.push({
        file: site.file, line: site.line, offset: site.offset, tag: site.tag, original: site.tag,
        expr: site.expr, reason: 'no-string-literal-entries',
      });
      continue;
    }
    // 逐字面量匹配：confirmed → 真实组件名；未命中 → 占位图标 PLACEHOLDER，并带候选进 residual
    const props = extractIconProps(site.tag);
    const context = detectContext(renderText, site.offset);
    const resolved = entries.map((e) => {
      const norm = normalizeSourceName(e.value);
      const m = byName[e.value] ? byName[e.value].match : match1(norm);
      const componentName =
        m.status === 'confirmed' ? m.componentName : PLACEHOLDER.componentName;
      const element = `${site.fieldName}: ${buildDataIconElement(componentName, props, context)}`;
      return {
        value: e.value,
        offset: e.offset,
        raw: e.raw,
        match: m,
        componentName,
        element,
        isPlaceholder: m.status !== 'confirmed',
      };
    });
    const renderRepl = dataRenderReplacement(site.expr, renderText, site.offset);
    scan.dataIconSites.push({
      renderFile: site.file,
      renderLine: site.line,
      renderOffset: site.offset,
      renderTag: site.tag,
      renderOriginal: site.tag,
      renderReplacement: renderRepl,
      renderExpr: site.expr,
      arrayFile: containerFile,
      arrayName: containerName,
      fieldName: site.fieldName,
      root: site.root,
      directArray: directContainer,
      entries: resolved,
    });
  }

  // Phase C：图标-prop wrapper 组件（SoftTag/ToggleRow）。自定义组件接收 icon prop、内部 <Icon name={icon}/> 渲染。
  // 调用点字面量不在 <Icon> 上（scanIconComponent 看不见），内部 name={icon} 是解构 prop（scanDynamicIcons 归 variables）。
  // 两半耦合改写：调用点 icon= → icon={<IconPlusIc…/>}（尺寸取自 wrapper 内部 <Icon/>）；内部 <Icon name={icon}/> → {icon}/裸透传。
  // 调用方 icon={expr} 按 <Icon name={expr}/> 同套解析；任一不可静态解析 → 安全闸整组退方案 A。
  {
    const nameDefs = new Map(); // wrapperName -> [{ file, renderOffset, renderTag }]
    const wrapperInternalSites = new Set(); // "file:offset" — 从 variableSites 剔除（Phase C 接管，避免双报）
    for (const file of files) {
      const t = textCache.get(file);
      for (const w of scanIconPropWrappers(t)) {
        if (!nameDefs.has(w.wrapperName)) nameDefs.set(w.wrapperName, []);
        nameDefs.get(w.wrapperName).push({ file, renderOffset: w.renderOffset, renderTag: w.renderTag });
        wrapperInternalSites.add(`${file}:${w.renderOffset}`);
      }
    }
    // 剔除 wrapper 内部站点（已由 Phase C 接管，不重复进 variableSites residual）
    scan.variableSites = (scan.variableSites || []).filter((v) => !wrapperInternalSites.has(`${v.file}:${v.offset}`));

    for (const [wrapperName, defs] of nameDefs) {
      if (defs.length !== 1) {
        // 同名多定义歧义 → 全退 residual/方案 A
        for (const d of defs) {
          scan.propWrapperResidual.push({
            wrapperName,
            wrapperFile: d.file,
            wrapperLine: lineOfOffset(textCache.get(d.file), d.renderOffset),
            reason: 'ambiguous-wrapper-name',
            callers: [],
          });
          scan.shimKeepFiles.push(d.file);
        }
        continue;
      }
      const { file: wrapperFile, renderOffset, renderTag } = defs[0];
      const wrapperText = textCache.get(wrapperFile);
      const wrapperLine = lineOfOffset(wrapperText, renderOffset);
      const wrapperProps = extractIconProps(renderTag);
      const wrapperContext = detectContext(wrapperText, renderOffset);
      const internalReplacement = wrapIfNeeded('icon', wrapperText, renderOffset);
      const escName = wrapperName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // 扫所有文件的 <WRAPPERNAME ...> 调用点，抽 icon prop 分类
      const callers = [];
      let skipped = false;
      let skipReason = '';
      for (const cf of files) {
        const ct = textCache.get(cf);
        const re = new RegExp(`<${escName}\\b[\\s\\S]*?(?:\\/>|>)`, 'g');
        let cm;
        while ((cm = re.exec(ct)) !== null) {
          const tagStart = cm.index;
          const tag = cm[0];
          const span = getPropSpan(tag, 'icon');
          if (!span) continue; // 无 icon prop → 忽略（icon undefined）
          const propOffset = tagStart + span.offsetRel;
          const callerLine = lineOfOffset(ct, tagStart);
          const c = { file: cf, line: callerLine, tagStart, propOffset, raw: span.raw };
          if (span.kind === 'literal') {
            c.kind = 'literal';
            c.value = span.value;
            callers.push(c);
            continue;
          }
          // braced
          const parsed = parseNameExpr(span.expr);
          if (!parsed) {
            c.kind = 'unresolvable'; c.expr = span.expr; callers.push(c);
            skipped = true; skipReason = skipReason || 'unresolvable-icon-expr'; continue;
          }
          if (parsed.kind === 'literal') {
            c.kind = 'literal'; c.value = parsed.value; callers.push(c);
          } else if (parsed.kind === 'ternary-flat') {
            c.kind = 'ternary'; c.cond = parsed.cond; c.candidates = parsed.candidates; callers.push(c);
          } else if (parsed.kind === 'ternary-chained') {
            c.kind = 'unresolvable'; c.expr = span.expr; callers.push(c);
            skipped = true; skipReason = skipReason || 'chained-ternary-icon';
          } else {
            const expr = parsed.expr;
            const idMatch = expr.match(/^([A-Za-z_$][\w$]*)$/);
            const memMatch = !idMatch && expr.match(/^([A-Za-z_$][\w$]*)(?:\[[^\]]+\])*\.([A-Za-z_$][\w$]*)$/);
            if (idMatch) {
              const cmap = buildConstMap(ct);
              if (cmap.has(idMatch[1])) {
                c.kind = 'literal'; c.value = cmap.get(idMatch[1]).literal; c.resolvedVar = idMatch[1]; callers.push(c);
              } else {
                c.kind = 'unresolvable'; c.expr = expr; callers.push(c);
                skipped = true; skipReason = skipReason || 'unresolved-ident-icon';
              }
            } else if (memMatch) {
              const ident = memMatch[1];
              const fieldName = memMatch[2];
              // 统一容器解析（同 Phase B）：先数组（循环绑定/直接索引），失败则对象地图回退（const cat=OBJ[key] / 直接 OBJ[key].field）
              let arrName = findLoopBinding(ct, ident);
              let directArray = false;
              if (!arrName) { arrName = ident; directArray = true; }
              let decl = resolveArrayDecl(arrName, cf, textCache);
              let containerKind = 'array';
              let containerName = arrName;
              let directContainer = directArray;
              if (!decl) {
                let objName = findObjectMapBinding(ct, ident);
                let directObject = false;
                if (!objName) { objName = ident; directObject = true; }
                const objDecl = resolveObjectDecl(objName, cf, textCache);
                if (!objDecl) {
                  c.kind = 'unresolvable'; c.expr = expr; callers.push(c);
                  skipped = true; skipReason = skipReason || 'no-traceable-source'; continue;
                }
                decl = { containerFile: objDecl.objFile, containerOpenIdx: objDecl.objOpenIdx };
                containerKind = 'object';
                containerName = objName;
                directContainer = directObject;
              } else {
                decl = { containerFile: decl.arrayFile, containerOpenIdx: decl.arrOpenIdx };
              }
              const containerText = textCache.get(decl.containerFile);
              const fnHasNonLiteral = containerKind === 'array' ? hasNonLiteralField : hasNonLiteralObjectField;
              const fnExtract = containerKind === 'array' ? extractDataIconFields : extractObjectIconFields;
              if (fnHasNonLiteral(containerText, decl.containerOpenIdx, fieldName)) {
                c.kind = 'unresolvable'; c.expr = expr; callers.push(c);
                skipped = true; skipReason = skipReason || (containerKind === 'array' ? 'non-literal-field' : 'non-literal-field-in-object'); continue;
              }
              const entries0 = fnExtract(containerText, decl.containerOpenIdx, fieldName);
              if (!entries0.length) {
                c.kind = 'unresolvable'; c.expr = expr; callers.push(c);
                skipped = true; skipReason = skipReason || 'no-string-literal-entries'; continue;
              }
              c.kind = 'member'; c.ident = ident; c.fieldName = fieldName; c.containerName = containerName; c.directContainer = directContainer; c.decl = decl; c.containerKind = containerKind; callers.push(c);
            } else {
              c.kind = 'unresolvable'; c.expr = expr; callers.push(c);
              skipped = true; skipReason = skipReason || 'unparsable-icon-expr';
            }
          }
        }
      }

      if (skipped) {
        // 安全闸：整组退方案 A shim
        scan.propWrapperResidual.push({
          wrapperName, wrapperFile, wrapperLine, reason: skipReason,
          callers: callers.map((c) => ({ file: c.file, line: c.line, expr: c.expr || c.value, kind: c.kind })),
        });
        scan.shimKeepFiles.push(wrapperFile);
        continue;
      }

      // 非跳过：生成 callerEdits（字面量/常量/扁平三元）+ member→dataIconSites + wrapper 内部 edit
      const callerEdits = [];
      const importSet = new Set();
      let hasConvertCaller = false;
      for (const c of callers) {
        if (c.kind === 'literal') {
          const norm = normalizeSourceName(c.value);
          const mres = byName[c.value] ? byName[c.value].match : match1(norm);
          const comp = mres.status === 'confirmed' ? mres.componentName : PLACEHOLDER.componentName;
          const el = buildDataIconElement(comp, wrapperProps, wrapperContext);
          callerEdits.push({ file: c.file, offset: c.propOffset, raw: c.raw, repl: `icon={${el}}`, imports: [comp], isPlaceholder: mres.status !== 'confirmed', leaves: [{ sourceKeyword: c.value, closedForm: 'wrapper-literal' }] });
          importSet.add(comp);
          hasConvertCaller = true;
        } else if (c.kind === 'ternary') {
          const [aSrc, bSrc] = c.candidates;
          const am = byName[aSrc] ? byName[aSrc].match : match1(normalizeSourceName(aSrc));
          const bm = byName[bSrc] ? byName[bSrc].match : match1(normalizeSourceName(bSrc));
          const ac = am.status === 'confirmed' ? am.componentName : PLACEHOLDER.componentName;
          const bc = bm.status === 'confirmed' ? bm.componentName : PLACEHOLDER.componentName;
          const aEl = buildDataIconElement(ac, wrapperProps, wrapperContext);
          const bEl = buildDataIconElement(bc, wrapperProps, wrapperContext);
          callerEdits.push({ file: c.file, offset: c.propOffset, raw: c.raw, repl: `icon={${c.cond} ? ${aEl} : ${bEl}}`, imports: [ac, bc], isPlaceholder: am.status !== 'confirmed' || bm.status !== 'confirmed', leaves: [{ sourceKeyword: aSrc, closedForm: 'wrapper-ternary' }, { sourceKeyword: bSrc, closedForm: 'wrapper-ternary' }] });
          importSet.add(ac); importSet.add(bc);
          hasConvertCaller = true;
        } else if (c.kind === 'member') {
          // 容器元素化（数组/对象地图）→ push dataIconSite，render 站点 = wrapper 内部（与 propWrapperSites 内部 edit 同位，seenFrom 去重）
          const containerText = textCache.get(c.decl.containerFile);
          const fnExtract = c.containerKind === 'array' ? extractDataIconFields : extractObjectIconFields;
          const entries = fnExtract(containerText, c.decl.containerOpenIdx, c.fieldName).map((e) => {
            const norm = normalizeSourceName(e.value);
            const mres = byName[e.value] ? byName[e.value].match : match1(norm);
            const comp = mres.status === 'confirmed' ? mres.componentName : PLACEHOLDER.componentName;
            const element = `${c.fieldName}: ${buildDataIconElement(comp, wrapperProps, wrapperContext)}`;
            return { value: e.value, offset: e.offset, raw: e.raw, match: mres, componentName: comp, element, isPlaceholder: mres.status !== 'confirmed' };
          });
          scan.dataIconSites.push({
            renderFile: wrapperFile, renderLine: wrapperLine, renderOffset, renderTag, renderOriginal: renderTag,
            renderReplacement: internalReplacement, renderExpr: 'icon',
            arrayFile: c.decl.containerFile, arrayName: c.containerName, fieldName: c.fieldName, root: c.ident, directArray: c.directContainer,
            entries,
          });
          hasConvertCaller = true;
        }
      }
      if (!hasConvertCaller) continue; // 无可改写调用方（wrapper 未被使用 / 全无 icon prop）→ 不动
      scan.propWrapperSites.push({
        wrapperName, wrapperFile, wrapperLine,
        internalOffset: renderOffset, internalTag: renderTag, internalReplacement,
        callerEdits, imports: [...importSet].sort(),
      });
    }
  }

  // 行号解析闭包：collectLeaves 用（data 数组叶子在 arrayFile 的 offset → 行号）。
  const lineOf = (file, offset) => {
    const t = textCache.get(file);
    return t ? lineOfOffset(t, offset) : null;
  };

  // ── 方案 B pass 1：结构规划（不改文件、不读 catalog、不取名）──────────────
  if (mode === 'plan') {
    const leavesData = collectLeaves(scan, byName, lineOf);
    const outPath = path.join(os.tmpdir(), `icon-leaves-${path.basename(targetRoot)}.json`);
    const stats = writeLeavesJson(leavesData, outPath);
    console.log('\n[match-icons] --plan 完成：结构规划，未改任何产物文件（原 <Icon> shim 保留，中间态可编译）；未读 catalog。');
    console.log(`  闭集叶子 ${stats.totalLeafSites} 处 / 唯一 sourceKeyword ${stats.uniqueKeywordCount} 个 / untraced ${stats.untracedCount} 处。`);
    console.log(`  叶子清单写入临时目录 ${outPath}（不进产物）。`);
    console.log('  下一步：按 Icon.md「方案 B 在线匹配执行 recipe」去重唯一名 + 同 turn 并行调 getIconInfo + 写 icon-b-decisions.json，再跑 --apply-decisions。');
    return;
  }

  // ── 方案 B pass 2：用决策日志真名做结构改写（catalog-free、无占位）────────
  if (mode === 'applyDecisions') {
    // 缺名闸：决策日志未覆盖某 keyword → 列出缺失项 + 站点，中止、零改写、零占位（强制 LLM 补齐再重跑）。
    if (missingSet.size) {
      const leavesData = collectLeaves(scan, byName, lineOf);
      const missingLeaves = leavesData.leaves.filter((l) => missingSet.has(l.sourceKeyword));
      console.error(`\n[match-icons] --apply-decisions 中止：决策日志缺 ${missingSet.size} 个唯一 sourceKeyword（产物零改写、零占位）。`);
      console.error('  缺失名（补齐 icon-b-decisions.json 后重跑）:');
      for (const l of missingLeaves) {
        console.error(`    ${l.sourceKeyword}  @ ${rel(l.site.file)}:${l.site.line}  [${l.closedForm}]`);
      }
      process.exit(1);
    }
    applyRewrites(scan, byName, srcDir);
    console.log('\n[match-icons] --apply-decisions 完成：所有名取自决策日志（getIconInfo 在线返回），产物零 catalog 名、零占位。');
    // residual 逐条明细打印到控制台（供步 7 LLM 手改）——与 C 模式 reportConsole 对齐，
    // 避免步 7 依赖 OS tmp 的 icon-leaves.json（session 重启/tmp 清理易丢，丢失可由 grep + --init-justified
    // 恢复站点清单但失脚本的 reason 分类）。collectLeaves 的 untraced 段 = untracedSites + variableSites + propWrapperResidual。
    const bResidual = []
      .concat((scan.untracedSites || []).map((r) => ({ file: rel(r.file), line: r.line, expr: r.expr, reason: r.reason })))
      .concat((scan.variableSites || []).map((v) => ({ file: rel(v.file), line: v.line, expr: v.expr, reason: v.isMember ? 'dynamic-member' : 'dynamic-variable' })))
      .concat((scan.propWrapperResidual || []).map((r) => ({ file: rel(r.wrapperFile), line: r.wrapperLine, expr: r.wrapperName, reason: r.reason })));
    if (bResidual.length) {
      console.log(`  residual（保留 <Icon> shim + 修 import，交 LLM 手工追源转 / 真 OPEN 保 shim，见 Icon.md §name 解析 + 跨边界 recipe；跑 check-icon-shim --strict 复核）: ${bResidual.length} 处`);
      for (const r of bResidual) {
        console.log(`    ${r.file}:${r.line}  ${r.expr}  [${r.reason}]`);
      }
    } else {
      console.log('  residual：0 处（全部闭集叶子已自动改写，无 untraced/跨边界残留）');
    }
    return;
  }

  // ── 方案 C（catalog 名匹配）：原报告 + 可选 --apply ──────────────────────
  reportConsole(scan, byName);

  // 报告写 OS 临时目录（不进产物根），供 LLM 在会话内复核 residual；控制台报告已是 in-context 真相源。
  const outPath = path.join(os.tmpdir(), `icon-match-${path.basename(targetRoot)}.json`);
  writeJson(scan, byName, outPath);
  const residualCount =
    Object.keys(byName).filter((n) => byName[n].match.status !== 'confirmed').length +
    (scan.ternarySites || []).filter((t) => !t.allConfirmed).length +
    (scan.chainedTernarySites || []).filter((t) => !t.allConfirmed).length +
    (scan.variableSites || []).length +
    (scan.dataIconSites || []).reduce((a, d) => a + d.entries.filter((e) => e.isPlaceholder).length, 0) +
    (scan.untracedSites || []).length +
    (scan.propWrapperResidual || []).length;
  console.log(`\n[match-icons] 报告写入临时目录 ${outPath}（residual ${residualCount} 处待 LLM 复核；不进产物）`);

  if (opts.apply) {
    applyRewrites(scan, byName, srcDir);
    // --apply 仅落 confirmed 改写；报告在临时目录，结束后清理（产物根永不出现 .icon-match.json）。
    // residual 由 LLM 在会话内按控制台/临时报告复核，逐条人工改写调用点。
    if (fs.existsSync(outPath)) {
      fs.unlinkSync(outPath);
      console.log(`[match-icons] --apply 完成，已清理临时报告 ${outPath}；residual ${residualCount} 处交 LLM 按控制台输出复核`);
    } else {
      console.log(`[match-icons] --apply 完成；residual ${residualCount} 处交 LLM 按控制台输出复核`);
    }
  }
}

main();
