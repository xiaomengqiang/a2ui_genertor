#!/usr/bin/env node
// build.mjs — ICT Vue 页面的零依赖 "mini bundler"(ict-vue-coder)。
//
// What it does:
//   1. 加载 app.vue(页面入口),递归跟随相对 import(.vue/.js 模块、.css 文件)
//   2. SFC 拆块: .vue 拆为 template / script / style(顶层块,template 嵌套感知);
//      script 走剥 import 流水线,template 挂为字符串交给浏览器端 Vue 编译器
//      (vue.global.prod.js full 版自带编译,无需 Babel),style 并入 CSS 收集
//   3. 外部库 import 映射为全局:
//        vue         → Vue          (命名导入)
//        element-plus→ ElementPlus  (命名导入;ElMessage 等)
//        vue-i18n    → VueI18n      (命名导入;多语言页面按需)
//        dayjs / echarts → 全局标识符直接可用(default import 剥离)
//        @element-plus/icons-vue → FAIL(本 skill 一律使用 Lucide Icon 组件)
//   4. 剥离 import/export 语句(固定模式),模块包进 IIFE 共享一个 __export 池;
//      .vue 的 export default → const __sfc = {...} + template 字符串注入,
//      以模块相对路径字符串为 key 注册(匿名 default 导出同机制)
//   5. 提取使用到的 Lucide 图标(扫描 <Icon name="x" /> / :name="{...}" / icon: "x"),
//      在 lucide-icon-nodes.json(1777 icons)中校验,非 Lucide 名 → WARN,
//      将图标 nodes 注入 shared/icon.js 模块(const LUCIDE = {...})
//   6. 内联六层 CSS — base/light/theme/dark/el-base(EP 基础样式)/el(EP 换肤层)
//      进 <style>(font url() 重写为 HTML 根相对路径)
//   7. CSS lint: 组件 CSS 禁止 :root/.dark 块、禁止未知 token、hex 硬编码 → WARN
//   8. 产出可直接双击打开(file://)的 index.page.html(inline 脚本为普通 classic
//      script,浏览器端由 Vue 编译器编译各组件 template)
//
// Usage:  node build.mjs --dir "<scaffold path>"

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, resolve, dirname } from "node:path";

// --- parse --dir argument (the scaffold path to build) ---
const args = process.argv.slice(2);
const dirIdx = args.findIndex((a) => a === "--dir" || a === "-d");
if (dirIdx === -1 || !args[dirIdx + 1]) {
  console.error('FAIL  Missing --dir <scaffold path>. Usage: node build.mjs --dir "<path>"');
  process.exit(1);
}
const ROOT = resolve(args[dirIdx + 1]);

const ENTRY = resolve(ROOT, "app.vue");
const OUT = resolve(ROOT, "index.page.html");
const STYLE_DIR = resolve(ROOT, "assets/style");
// 六层样式加载序: base(基础色阶) → light(:root 语义) → theme(终极语义别名)
// → dark(.dark 覆盖) → el-base(EP 官方基础样式) → el(EP 换肤层,.dark 规则随暗色生效)
const STYLE_FILES = ["base.css", "light.css", "theme.css", "dark.css", "el-base.css", "el.css"].map((f) => resolve(STYLE_DIR, f));
const LUCIDE_JSON = resolve(ROOT, "assets/library/lucide-icon-nodes.json");
const ICONS_MODULE = "assets/shared/icon.js";

// Matches: import [Def,] [Def2] [{ named, names }] from "source";
const IMPORT_RE = /^[ \t]*import\s+(?:(\w+)\s*,\s*)?(?:(\w+)\s+)?(?:\{([^}]*)\})?\s*from\s*["']([^"']+)["'];?[ \t]*$/gm;
// Matches: import "source";  (side-effect, used for CSS)
const SIDE_EFFECT_RE = /^[ \t]*import\s*["']([^"']+)["'];?[ \t]*$/gm;

// Icon usage patterns scanned across all module sources:
// 只匹配 <Icon ...> 标签自身的 name 属性 — el-form 表单字段等组件的 name="field"
// 是表单字段名,不能当图标名扫描。
const ICON_SCAN_PATTERNS = [
  /<[Ii]con\b[^>]*?\bname=["']([a-z0-9-]+)["']/gs,  // <Icon name="chevron-down" (属性任意顺序)
  /\bicon[a-z]*\s*[:=]\s*["']([a-z0-9-]+)["']/g,    // icon: "grid" data fields / icon="x" attrs
];
// Dynamic name expressions — extract every string literal inside: <Icon :name="a ? 'x' : 'y'">
// 属性值由同种引号定界(双引号内可含单引号,反之亦然),故用双分支匹配
const NAME_EXPR_RE = /<[Ii]con\b[^>]*?:name=(?:"([^"]*)"|'([^']*)')/gs;
const STRING_LIT_RE = /["']([a-z0-9-]+)["']/g;

// 资源文件扩展 — 不可 import,须用运行时路径字符串
const ASSET_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp", ".woff", ".woff2", ".ttf", ".eot", ".json"];

// --- Banned Element Plus components (布局/装饰/表单类 — 须用 H5 + CSS 或组件组合实现) ---
const EP_BANNED = [
  // 布局/栅格
  "ElContainer", "ElHeader", "ElAside", "ElFooter", "ElMain",
  "ElRow", "ElCol",
  // 容器/装饰
  "ElCard", "ElSpace", "ElSkeleton", "ElSkeletonItem",
  "ElDescriptions", "ElDescriptionsItem", "ElResult", "ElAvatar",
  "ElImage", "ElImageViewer", "ElCalendar", "ElTour", "ElStatistic",
  "ElAffix", "ElTransfer", "ElPopconfirm", "ElText", "ElMention",
  "ElSplitter", "ElWatermark",
  // EP 图标容器(页面图标一律 Lucide Icon)
  "ElIcon",
  // 表单
  "ElForm", "ElFormItem",
  // 输入
  "ElAutocomplete", "ElUpload",
  // 反馈
  "ElAlert",
];
function pascalToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
const EP_BANNED_TAGS = [...EP_BANNED, ...EP_BANNED.map(pascalToKebab)];

function splitNames(named, label) {
  return (named || "").split(",").map((s) => s.trim()).filter(Boolean).map((n) => {
    if (/\s+as\s+/.test(n)) {
      throw new Error(`${label}: aliased imports ({ a as b }) are not supported — import under its own name`);
    }
    return n;
  });
}
function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// ---------------- SFC 解析 ----------------

// 顶层 <template> 块内容定位:嵌套感知(内层 <template v-if> 合法)+ 跳过 HTML 注释
function findTemplateClose(raw, from, label) {
  let i = from, depth = 1;
  while (i < raw.length) {
    if (raw.startsWith("<!--", i)) {
      const e = raw.indexOf("-->", i);
      if (e === -1) return null;
      i = e + 3;
      continue;
    }
    const lt = raw.indexOf("<", i);
    if (lt === -1) return null;
    const rest = raw.slice(lt);
    let m;
    if ((m = /^<template\b[^>]*>/i.exec(rest))) {
      if (!m[0].endsWith("/>")) depth++;
      i = lt + m[0].length;
    } else if ((m = /^<\/template\s*>/i.exec(rest))) {
      depth--;
      if (depth === 0) return { contentEnd: lt, blockEnd: lt + m[0].length };
      i = lt + m[0].length;
    } else {
      i = lt + 1;
    }
  }
  return null;
}

// SFC 块属性校验:template/script/style 均不允许任何属性(lang/scoped/setup 全部禁止)
function assertNoBlockAttrs(tag, attrs, label) {
  if (attrs && attrs.trim()) {
    if (tag === "script" && /\bsetup\b/.test(attrs)) {
      throw new Error(`${label}: <script setup> 不支持 — 写显式 setup() 或 Options API(export default { setup() { ... return {...} } })`);
    }
    throw new Error(`${label}: <${tag}${attrs}> 不支持 — SFC 块不允许属性(lang/scoped/setup 等均禁用;组件样式用全局 class 或同目录 index.css)`);
  }
}

function parseSfc(raw, label) {
  const out = { template: null, script: null, styles: [] };
  let i = 0;
  while (i < raw.length) {
    if (raw.startsWith("<!--", i)) {
      const e = raw.indexOf("-->", i);
      if (e === -1) break;
      i = e + 3;
      continue;
    }
    if (raw[i] !== "<") { i++; continue; }
    const m = /^<(template|script|style)\b([^>]*)>/i.exec(raw.slice(i));
    if (!m) { i++; continue; }
    const tag = m[1].toLowerCase();
    const attrs = m[2] || "";
    const contentStart = i + m[0].length;
    if (tag === "template") {
      assertNoBlockAttrs(tag, attrs, label);
      if (out.template !== null) throw new Error(`${label}: 仅允许一个 <template> 块`);
      const close = findTemplateClose(raw, contentStart, label);
      if (!close) throw new Error(`${label}: <template> 块未闭合`);
      out.template = raw.slice(contentStart, close.contentEnd);
      i = close.blockEnd;
    } else {
      // script/style 内容直到第一个闭合标签(模板/脚本内不会出现同名闭合串)
      const closeRe = new RegExp(`</${tag}\\s*>`, "i");
      const rest = raw.slice(contentStart);
      const cm = closeRe.exec(rest);
      if (!cm) throw new Error(`${label}: <${tag}> 块未闭合`);
      assertNoBlockAttrs(tag, attrs, label);
      const content = rest.slice(0, cm.index);
      if (tag === "script") {
        if (out.script !== null) throw new Error(`${label}: 仅允许一个 <script> 块`);
        out.script = content;
      } else {
        out.styles.push(content);
      }
      i = contentStart + cm.index + cm[0].length;
    }
  }
  return out;
}

// SFC 友好组件名:src/views/device-table/index.vue → DeviceTable;app.vue → App
function sfcFriendlyName(label) {
  const parts = label.split("/");
  let stem = parts.pop().replace(/\.vue$/i, "");
  if ((stem === "index" || stem === "Index") && parts.length) stem = parts.pop();
  const name = stem
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
  return /^[A-Za-z]/.test(name) ? name : "AnonymousComponent";
}

// ---------------- 模块加载 ----------------

const modules = [];            // in topological order (dependencies first)
const moduleByPath = new Map(); // resolved path -> module record
const loaded = new Set();
const cssEntries = [];          // component css in collection order: { label, text, isSfc }
let entryKey = null;            // __export key of app.vue default export
const iconRefs = new Map();     // kebab-name -> Set of "file (usage)"

function recordIconRef(rawName, label) {
  const kebab = camelToKebab(rawName);
  if (!iconRefs.has(kebab)) iconRefs.set(kebab, new Set());
  iconRefs.get(kebab).add(`${label} ("${rawName}")`);
}

function scanIconUsage(code, label) {
  for (const re of ICON_SCAN_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(code)) !== null) recordIconRef(m[1], label);
  }
  NAME_EXPR_RE.lastIndex = 0;
  let em;
  while ((em = NAME_EXPR_RE.exec(code)) !== null) {
    const expr = em[1] ?? em[2] ?? "";
    STRING_LIT_RE.lastIndex = 0;
    let lm;
    while ((lm = STRING_LIT_RE.exec(expr)) !== null) recordIconRef(lm[1], label);
  }
}

async function loadModule(filePath) {
  filePath = resolve(filePath);
  if (loaded.has(filePath)) return;
  loaded.add(filePath);
  const ext = extname(filePath).toLowerCase();
  if (ext === ".css") {
    const label = relLabel(filePath);
    if (!cssEntries.some((e) => e.label === label)) {
      cssEntries.push({ label, text: (await readFile(filePath, "utf8")).replace(/^\uFEFF/, ""), isSfc: false });
    }
    return;
  }
  if (ASSET_EXTS.includes(ext)) {
    throw new Error(`${relLabel(filePath)}: 资源文件不可 import — 用运行时路径字符串(如 <img src="./assets/uploads/x.png" />)`);
  }

  const raw = (await readFile(filePath, "utf8")).replace(/^\uFEFF/, ""); // 容错 UTF-8 BOM
  const label = relLabel(filePath);
  const deps = [];
  const vueNames = new Set();
  const epNames = new Set();
  const i18nNames = new Set();
  const bundleNames = [];
  const defImports = []; // { local, dep } — default import 的本地名与依赖路径
  let isSfc = false;
  let template = null;
  let sfcStyles = [];
  let code = raw;

  // --- SFC: 拆块 ---
  if (ext === ".vue") {
    const sfc = parseSfc(raw, label);
    isSfc = true;
    template = sfc.template;
    sfcStyles = sfc.styles;
    // 纯模板组件(无 script)合法 — 合成空 options
    code = sfc.script && sfc.script.trim() ? sfc.script : "export default {};";
  }

  // --- strip & map imports ---
  code = code.replace(IMPORT_RE, (_match, def1, def2, named, source) => {
    const def = def1 || def2;
    if (source === "vue") {
      if (def) throw new Error(`${label}: "vue" 仅支持命名导入(import { ref, computed } from "vue")`);
      splitNames(named, label).forEach((n) => vueNames.add(n));
      return "";
    }
    if (source === "element-plus") {
      if (def) throw new Error(`${label}: "element-plus" 仅支持命名导入(import { ElMessage } from "element-plus")`);
      splitNames(named, label).forEach((n) => epNames.add(n));
      return "";
    }
    if (source === "vue-i18n") {
      if (def) throw new Error(`${label}: "vue-i18n" 仅支持命名导入(import { createI18n } from "vue-i18n")`);
      splitNames(named, label).forEach((n) => i18nNames.add(n));
      return "";
    }
    if (source === "dayjs" || source === "echarts") {
      // default import → 全局标识符直接可用
      return "";
    }
    if (source === "@element-plus/icons-vue") {
      throw new Error(`${label}: 本 skill 不使用 @element-plus/icons-vue — 页面图标一律使用 <Icon name="lucide-name" />(import { Icon } from "./assets/shared/icon.js")`);
    }
    const dep = resolve(dirname(filePath), source);
    if (!existsSync(dep)) {
      throw new Error(`${label}: dependency not found: ${relLabel(dep) || dep} (import 路径必须包含扩展名 .vue/.js/.css)`);
    }
    deps.push(dep);
    if (def) defImports.push({ local: def, dep });
    splitNames(named, label).forEach((n) => bundleNames.push(n));
    return "";
  });

  code = code.replace(SIDE_EFFECT_RE, (_match, source) => {
    const dep = resolve(dirname(filePath), source);
    if (!existsSync(dep)) {
      throw new Error(`${label}: dependency not found: ${relLabel(dep) || dep} (import 路径必须包含扩展名 .vue/.js/.css)`);
    }
    deps.push(dep);
    return "";
  });

  // Load dependencies first so the concatenation order is valid.
  for (const dep of deps) {
    await loadModule(dep);
  }

  // resolve default imports against the loaded dependency modules
  for (const di of defImports) {
    const depMod = moduleByPath.get(di.dep);
    if (!depMod) throw new Error(`${label}: dependency not found: ${di.dep}`);
    if (!depMod.defaultPoolKey) throw new Error(`${label}: dependency has no default export: ${depMod.label}`);
    di.key = depMod.defaultPoolKey;
  }

  // --- strip & collect exports ---
  const exportAssigns = []; // { key, value } — key 为 __export 池键(标识符名或模块路径)
  let defaultPoolKey = null;

  if (isSfc) {
    // SFC: export default <expr> → const __sfc = <expr>;命名导出禁止(放同目录 .js)
    const defaults = [...code.matchAll(/^[ \t]*export\s+default\b/gm)];
    if (defaults.length === 0) {
      throw new Error(`${label}: <script> 必须有 export default(组件 options 对象:export default { ... } 或 export default { setup() {...} })`);
    }
    if (defaults.length > 1) throw new Error(`${label}: 仅允许一个 export default`);
    if (/^[ \t]*export\s+(?!default\b)[\w{]/m.test(code)) {
      throw new Error(`${label}: SFC <script> 不支持命名导出(export const/function)— 提取到同目录 .js 文件`);
    }
    code = code.replace(/^[ \t]*export\s+default\s*/m, "const __sfc = ");
    defaultPoolKey = label;
    exportAssigns.push({ key: label, value: "__sfc" });
    if (filePath === ENTRY) entryKey = label;
  } else {
    // plain .js: 与 react 版同机制 + 匿名对象/表达式 default 导出支持
    const defaultFn = code.match(/^[ \t]*export\s+default\s+function\s+(\w+)/m);
    if (defaultFn) {
      code = code.replace(/^[ \t]*export\s+default\s+function\s+\w+/m, (m) => m.replace(/^[ \t]*export\s+default\s+/, ""));
      exportAssigns.push({ key: defaultFn[1], value: defaultFn[1] });
      defaultPoolKey = defaultFn[1];
      if (filePath === ENTRY) entryKey = defaultFn[1];
    } else {
      const defaultIdent = code.match(/^[ \t]*export\s+default\s+([A-Za-z_$][\w$]*)\s*;?[ \t]*$/m);
      if (defaultIdent) {
        code = code.replace(/^[ \t]*export\s+default\s+[A-Za-z_$][\w$]*\s*;?[ \t]*$/m, "");
        exportAssigns.push({ key: defaultIdent[1], value: defaultIdent[1] });
        defaultPoolKey = defaultIdent[1];
      } else {
        const defaultExpr = code.match(/^[ \t]*export\s+default\s*(?=[{\[(])/m);
        if (defaultExpr) {
          code = code.replace(/^[ \t]*export\s+default\s*(?=[{\[(])/m, "const __default_export__ = ");
          defaultPoolKey = label;
          exportAssigns.push({ key: label, value: "__default_export__" });
        } else if (/^[ \t]*export\s+default\b/m.test(code)) {
          throw new Error(`${filePath}: "export default" must be a function declaration, a plain identifier, or an object/array literal`);
        }
      }
    }
    code = code.replace(/^[ \t]*export\s+function\s+(\w+)/gm, (_m, name) => {
      exportAssigns.push({ key: name, value: name });
      return `function ${name}`;
    });
    code = code.replace(/^[ \t]*export\s+const\s+(\w+)/gm, (_m, name) => {
      exportAssigns.push({ key: name, value: name });
      return `const ${name}`;
    });
    code = code.replace(/^[ \t]*export\s+let\s+(\w+)/gm, (_m, name) => {
      exportAssigns.push({ key: name, value: name });
      return `let ${name}`;
    });
  }

  scanIconUsage(raw, label);

  const mod = {
    label,
    isSfc,
    template,
    friendlyName: isSfc ? sfcFriendlyName(label) : null,
    vueNames: [...vueNames],
    epNames: [...epNames],
    i18nNames: [...i18nNames],
    bundleNames: [...new Set(bundleNames)],
    defImports,
    exportAssigns,
    defaultPoolKey,
    code: code.trim(),
    prelude: "",
  };
  modules.push(mod);
  moduleByPath.set(filePath, mod);

  // SFC <style> 块并入 CSS 收集(依赖模块的样式先入,保持级联稳定)
  for (const [idx, text] of sfcStyles.entries()) {
    cssEntries.push({ label: `${label}<style#${idx + 1}>`, text, isSfc: true });
  }
}

function relLabel(p) {
  return p.slice(ROOT.length + 1).replace(/\\/g, "/");
}

function wrapModule(mod) {
  const lines = [`/* ===== ${mod.label} ===== */`, "(function () {"];
  if (mod.prelude) lines.push(mod.prelude);
  if (mod.vueNames.length) lines.push(`  const { ${mod.vueNames.join(", ")} } = Vue;`);
  if (mod.epNames.length) lines.push(`  const { ${mod.epNames.join(", ")} } = ElementPlus;`);
  if (mod.i18nNames.length) lines.push(`  const { ${mod.i18nNames.join(", ")} } = VueI18n;`);
  if (mod.bundleNames.length) lines.push(`  const { ${mod.bundleNames.join(", ")} } = __export;`);
  for (const di of mod.defImports) {
    lines.push(`  const ${di.local} = __export[${JSON.stringify(di.key)}];`);
  }
  lines.push(mod.code);
  if (mod.isSfc) {
    lines.push(`  if (!__sfc.name) __sfc.name = ${JSON.stringify(mod.friendlyName)};`);
    lines.push(`  __sfc.template = ${JSON.stringify(mod.template)};`);
  }
  for (const ea of mod.exportAssigns) {
    lines.push(`  __export[${JSON.stringify(ea.key)}] = ${ea.value};`);
  }
  lines.push("})();");
  return lines.join("\n");
}

await loadModule(ENTRY);

// i18n 门控:src/i18n.js 存在即打包(页面源码无需显式 import,epilogue 自动 app.use)
const I18N_MODULE = resolve(ROOT, "src", "i18n.js");
if (existsSync(I18N_MODULE)) {
  await loadModule(I18N_MODULE);
}

if (!entryKey) {
  throw new Error("app.vue must exist and default-export the root component (export default { ... })");
}

// --- Banned Element Plus components ---
const bannedHits = [];
const tagRe = new RegExp(`<(?:${EP_BANNED_TAGS.map((t) => t.replace(/-/g, "\\-")).join("|")})[\\s/>]`, "i");
const tagReGlobal = new RegExp(tagRe.source, "g");
for (const mod of modules) {
  for (const n of mod.epNames) {
    if (EP_BANNED.includes(n)) bannedHits.push(`${mod.label}: import { ${n} } from "element-plus"`);
  }
  for (const source of [mod.code, mod.template || ""]) {
    tagReGlobal.lastIndex = 0;
    let bm;
    while ((bm = tagReGlobal.exec(source)) !== null) {
      bannedHits.push(`${mod.label}: <${bm[0].slice(1)}…`);
    }
  }
}
if (bannedHits.length) {
  console.error("FAIL  禁用的 Element Plus 组件(布局/装饰/表单类) — 用纯 H5 或已有组件组合实现:");
  for (const h of [...new Set(bannedHits)]) console.error(`  ${h}`);
  process.exit(1);
}

// --- Icon size format check: must be rem string, not number ---
const iconSizeWarnings = [];
const sizeNumRes = [
  /<[Ii]con\b[^>]*?\bsize=["'](\d+(?:\.\d+)?)["']/gs,
  /<[Ii]con\b[^>]*?\b:size=["'](\d+(?:\.\d+)?)["']/gs,
];
for (const mod of modules) {
  for (const source of [mod.code, mod.template || ""]) {
    for (const re of sizeNumRes) {
      re.lastIndex = 0;
      let ism;
      while ((ism = re.exec(source)) !== null) {
        const px = parseFloat(ism[1]);
        const rem = `${parseFloat((px / 16).toFixed(4))}rem`;
        iconSizeWarnings.push(`  ${mod.label}: size="${px}" → use size="${rem}"`);
      }
    }
  }
}
if (iconSizeWarnings.length) {
  console.log("WARN  Icon size should be rem string, not number:");
  console.log(iconSizeWarnings.join("\n"));
}

// --- Icon color format check: 6-digit hex only (icon-plus matches by hex) ---
const iconColorWarnings = [];
const colorRes = [
  /<[Ii]con\b[^>]*?\bcolor=["']([^"']*)["']/gs,
  /<[Ii]con\b[^>]*?\b:color=["']([^"']*)["']/gs,
];
for (const mod of modules) {
  for (const source of [mod.code, mod.template || ""]) {
    for (const re of colorRes) {
      re.lastIndex = 0;
      let icm;
      while ((icm = re.exec(source)) !== null) {
        const val = icm[1].replace(/^['"]|['"]$/g, "");
        if (val.startsWith("#") && !/^#[0-9a-fA-F]{6}$/.test(val)) {
          iconColorWarnings.push(`  ${mod.label}: color="${val}" → use 6-digit hex like "#0067D1"`);
        }
      }
    }
  }
}
if (iconColorWarnings.length) {
  console.log("WARN  Icon color must be 6-digit hex (rgba/rgb/8-digit hex silently mismatch in icon-plus):");
  console.log(iconColorWarnings.join("\n"));
}

// --- Lucide icon extraction & validation ---
const lucideRaw = JSON.parse(await readFile(LUCIDE_JSON, "utf8"));
const iconTableEntries = [];
const nonLucideNames = [];
for (const [kebab, usages] of [...iconRefs.entries()].sort()) {
  const nodes = lucideRaw[kebab];
  if (!nodes) {
    nonLucideNames.push(`  ${kebab}  <- used in ${[...usages].join(", ")}`);
    continue;
  }
  iconTableEntries.push(`${JSON.stringify(kebab)}: ${JSON.stringify(nodes)}`);
}
if (nonLucideNames.length) {
  console.log("WARN  Icon names not found in Lucide:");
  console.log(nonLucideNames.join("\n"));
  console.log("Keep them only if the user explicitly requested these names; otherwise pick valid names from https://lucide.dev/icons");
}
const lucidePrelude = iconTableEntries.length
  ? `  const LUCIDE = {\n    ${iconTableEntries.join(",\n    ")},\n  };`
  : "  const LUCIDE = {};";
const iconsMod = modules.find((m) => m.label === ICONS_MODULE);
if (iconsMod) iconsMod.prelude = lucidePrelude;

// --- CSS collection: token vars (base/light/theme/dark) + EP base/skin + component css ---
function rewriteCssUrls(css) {
  // 样式文件位于 assets/style/,字体位于 assets/font/ — 内联后 url 相对于
  // 脚手架根部的 HTML 解析。剥掉 "../" 但保留引号。
  return css.replace(/url\((\s*)(["']?)\.\.\/(font|library|icons)\//g, "url($1$2assets/$3/");
}

const cssParts = [];
for (const f of STYLE_FILES) {
  if (!existsSync(f)) throw new Error(`style layer missing: ${f}`);
  cssParts.push(rewriteCssUrls((await readFile(f, "utf8")).replace(/^\uFEFF/, "")));
}
for (const e of cssEntries) cssParts.push(e.text);

// --- CSS lint: validate component css against the defined token set ---
function extractDefinedVars(css) {
  const names = new Set();
  const re = /(--[a-zA-Z0-9-]+)\s*:/g;
  let m;
  while ((m = re.exec(css)) !== null) names.add(m[1]);
  return names;
}

const definedVars = new Set();
for (const f of STYLE_FILES) extractDefinedVars(await readFile(f, "utf8")).forEach((n) => definedVars.add(n));
for (const e of cssEntries) extractDefinedVars(e.text).forEach((n) => definedVars.add(n));

const cssLintErrors = [];
const cssLintWarnings = [];
for (const e of cssEntries) {
  e.text.split("\n").forEach((line, idx) => {
    const at = `${e.label}:${idx + 1}`;
    const bare = line.replace(/\/\*.*?\*\//g, "");
    if (/^\s*(:root|\.dark)\s*\{/.test(bare)) {
      cssLintErrors.push(`${at}: component CSS must NOT define :root or .dark blocks`);
    }
    let vm;
    const varRe = /var\((--[a-zA-Z0-9-]+)/g;
    while ((vm = varRe.exec(bare)) !== null) {
      if (!definedVars.has(vm[1])) cssLintErrors.push(`${at}: unknown token var(${vm[1]})`);
    }
    if (/#[0-9a-fA-F]{3,8}\b/.test(bare)) {
      cssLintWarnings.push(`${at}: hardcoded hex color — prefer theme-layer tokens (intentional values are fine)`);
    }
  });
}
if (cssLintErrors.length) {
  console.error("FAIL  CSS lint errors:");
  for (const e of cssLintErrors) console.error(`  ${e}`);
  console.error("Fix :root/.dark blocks or unknown tokens — see references/design_system.md.");
  process.exit(1);
}
if (cssLintWarnings.length) {
  console.log("WARN  hardcoded hex colors (fine if intentional, prefer tokens otherwise):");
  for (const w of cssLintWarnings) console.log(`  ${w}`);
}

const jsBody = modules.map(wrapModule).join("\n\n");
const script = [
  "var __export = {};",
  jsBody,
  "/* ===== create app ===== */",
  `const __app = Vue.createApp(__export[${JSON.stringify(entryKey)}]);`,
  "__app.use(ElementPlus);",
  // i18n 门控安装:src/i18n.js default-export 一个 createI18n 实例时自动 app.use(多语言页面按需创建)
  'const __i18n = __export["src/i18n.js"] || __export.i18n;',
  'if (__i18n && typeof __i18n.install === "function") __app.use(__i18n);',
  '__app.mount("#root");',
].join("\n");

if (script.includes("</script>")) {
  throw new Error("Module code contains </script>, cannot inline into HTML");
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ICT页面</title>
<!-- 1. Core Libraries (local; Vue full build 自带浏览器端模板编译器,无需 Babel) -->
<script src="./assets/library/vue.global.prod.js"></script>
<script src="./assets/library/dayjs.min.js"></script>
<!-- 2. UI Components (local UMD; Element Plus 内置 dayjs,仅需 Vue 全局) -->
<script src="./assets/library/element-plus.full.min.js"></script>
<!-- 3. Element Plus zh-cn locale (global ElementPlusLocaleZhCn) -->
<script src="./assets/library/element-zh-cn.min.js"></script>
<!-- 4. Charts (local UMD → 全局 echarts) -->
<script src="./assets/library/echarts.min.js"></script>
<!-- 5. vue-i18n (offline, exposes VueI18n; 多语言页面按需使用) -->
<script src="./assets/library/vue-i18n.global.prod.js"></script>
<!-- 6. 六层 CSS(base → light → theme → dark → el-base(EP 基础) → el(EP 换肤层))内联 -->
<style>
${cssParts.join("\n\n")}
</style>
<!-- 7. Base styles -->
<style>
body, html { margin: 0; padding: 0; height: 100%; font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif); }
#root { height: 100%; }
</style>
</head>
<body>
<div id="root">Loading...</div>
<script data-page-script>
${script}
</script>
</body>
</html>
`;

await writeFile(OUT, html, "utf8");
console.log(`OK  ${OUT}`);
console.log(`    modules (${modules.length}): ${modules.map((m) => m.label).join(", ")}`);
console.log(`    css     (${cssEntries.length + STYLE_FILES.length}): style/(base,light,theme,dark,el-base,el) + ${cssEntries.map((c) => c.label).join(", ")}`);
console.log(`    icons   (${iconTableEntries.length}): ${[...iconRefs.keys()].sort().join(", ") || "none"}`);
console.log(`    entry   : __export[${JSON.stringify(entryKey)}]`);
