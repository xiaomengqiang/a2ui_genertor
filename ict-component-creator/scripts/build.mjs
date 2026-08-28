#!/usr/bin/env node
// build.mjs — Zero-dependency "mini bundler" for the component preview.
//
// What it does:
//   1. Loads demo.jsx (the entry that showcases all components)
//   2. Follows relative imports recursively (other .js/.jsx modules, .css files)
//   3. Strips import/export statements (fixed, template-controlled patterns)
//   4. Extracts used Lucide icons:
//      - scans module sources for  name="x" / name={expr with "lit"} / icon: "x"  patterns
//      - looks each name up in assets/library/lucide-icon-nodes.json (1777 icons)
//      - hallucinated/renamed icon names FAIL the build with a clear message
//      - injects the icon nodes into the shared icons.js module (const LUCIDE = {...})
//   5. Inlines everything — React/ReactDOM/Babel from local assets/library,
//      base+light+theme+dark CSS into <style> (font url() paths rewritten to the HTML root),
//      all modules wrapped in IIFEs sharing one __export pool
//   6. Writes a fully self-contained index.components.html that opens via double-click (file://)
//
// Usage:  node build.mjs --dir "<scaffold path>"

import { readFile, writeFile } from "node:fs/promises";
import { extname, resolve, dirname } from "node:path";

// --- parse --dir argument (the scaffold path to build) ---
const args = process.argv.slice(2);
const dirIdx = args.findIndex((a) => a === "--dir" || a === "-d");
if (dirIdx === -1 || !args[dirIdx + 1]) {
  console.error("FAIL  Missing --dir <scaffold path>. Usage: node build.mjs --dir \"<path>\"");
  process.exit(1);
}
const ROOT = resolve(args[dirIdx + 1]);

const ENTRY = resolve(ROOT, "demo.jsx");
const OUT = resolve(ROOT, "index.components.html");
const STYLE_DIR = resolve(ROOT, "assets/style");
const STYLE_FILES = ["base.css", "light.css", "theme.css", "dark.css"].map((f) => resolve(STYLE_DIR, f));
const LUCIDE_JSON = resolve(ROOT, "assets/library/lucide-icon-nodes.json");
const ICONS_MODULE = "assets/shared/icons.js";

// Matches: import [Def,] [Def2] [{ named, names }] from "source";
const IMPORT_RE = /^[ \t]*import\s+(?:(\w+)\s*,\s*)?(?:(\w+)\s+)?(?:\{([^}]*)\})?\s*from\s*["']([^"']+)["'];?[ \t]*$/gm;
// Matches: import "source";  (side-effect, used for CSS)
const SIDE_EFFECT_RE = /^[ \t]*import\s*["']([^"']+)["'];?[ \t]*$/gm;

// Icon usage patterns scanned across all module sources:
const ICON_SCAN_PATTERNS = [
  /\bname=["']([a-z0-9-]+)["']/g,                 // <Icon name="chevron-down" (any tag, any order)
  /\bicon[a-z]*\s*[:=]\s*["']([a-z0-9-]+)["']/g, // icon: "grid" data fields / icon="x" attrs
];
// Dynamic name expressions — extract every string literal inside: name={a ? "x" : "y"}
const NAME_EXPR_RE = /\bname=\{([^}]*)\}/g;
const STRING_LIT_RE = /["']([a-z0-9-]+)["']/g;

function splitNames(named) {
  return (named || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const modules = [];   // in topological order (dependencies first)
const loaded = new Set();
const cssFiles = [];  // in dependency order
let entryDefault = null;
const iconRefs = new Map(); // kebab-name -> Set of "file (usage)" for error reporting

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
    STRING_LIT_RE.lastIndex = 0;
    let lm;
    while ((lm = STRING_LIT_RE.exec(em[1])) !== null) recordIconRef(lm[1], label);
  }
}

async function loadModule(filePath) {
  filePath = resolve(filePath);
  if (loaded.has(filePath)) return;
  loaded.add(filePath);

  const raw = await readFile(filePath, "utf8");
  const deps = [];
  const reactNames = new Set();
  const bundleNames = [];
  let code = raw;

  code = code.replace(IMPORT_RE, (_match, def1, def2, named, source) => {
    const def = def1 || def2;
    if (source === "react") {
      splitNames(named).forEach((n) => reactNames.add(n));
      return "";
    }
    if (source === "react-dom" || source === "react-dom/client") {
      return "";
    }
    deps.push(resolve(dirname(filePath), source));
    if (def) bundleNames.push(def);
    splitNames(named).forEach((n) => bundleNames.push(n));
    return "";
  });

  code = code.replace(SIDE_EFFECT_RE, (_match, source) => {
    const dep = resolve(dirname(filePath), source);
    deps.push(dep);
    if (extname(dep) === ".css" && !cssFiles.includes(dep)) cssFiles.push(dep);
    return "";
  });

  // Load dependencies first so the concatenation order is valid.
  for (const dep of deps) {
    if (extname(dep) === ".css") continue;
    await loadModule(dep);
  }

  const exported = [];
  const defaultFn = code.match(/^[ \t]*export\s+default\s+function\s+(\w+)/m);
  if (defaultFn) {
    code = code.replace(/^[ \t]*export\s+default\s+function\s+\w+/m, (m) => m.replace(/^[ \t]*export\s+default\s+/, ""));
    exported.push(defaultFn[1]);
    if (filePath === ENTRY) entryDefault = defaultFn[1];
  } else if (/^[ \t]*export\s+default\b/m.test(code)) {
    throw new Error(`${filePath}: "export default" must be a named function declaration (export default function Name)`);
  }
  code = code.replace(/^[ \t]*export\s+function\s+(\w+)/gm, (_m, name) => {
    exported.push(name);
    return `function ${name}`;
  });
  code = code.replace(/^[ \t]*export\s+const\s+(\w+)/gm, (_m, name) => {
    exported.push(name);
    return `const ${name}`;
  });
  code = code.replace(/^[ \t]*export\s+let\s+(\w+)/gm, (_m, name) => {
    exported.push(name);
    return `let ${name}`;
  });

  scanIconUsage(raw, filePath.slice(ROOT.length + 1).replace(/\\/g, "/"));

  modules.push({
    label: filePath.slice(ROOT.length + 1).replace(/\\/g, "/"),
    reactNames: [...reactNames],
    bundleNames: [...new Set(bundleNames)],
    code: code.trim(),
    exported,
    prelude: "",
  });
}

function wrapModule(mod) {
  const lines = [`/* ===== ${mod.label} ===== */`, "(function () {"];
  if (mod.prelude) lines.push(mod.prelude);
  if (mod.reactNames.length) lines.push(`  const { ${mod.reactNames.join(", ")} } = React;`);
  if (mod.bundleNames.length) lines.push(`  const { ${mod.bundleNames.join(", ")} } = __export;`);
  lines.push(mod.code);
  if (mod.exported.length) lines.push(`  Object.assign(__export, { ${mod.exported.join(", ")} });`);
  lines.push("})();");
  return lines.join("\n");
}

const BASE_CSS = `body { margin: 0; font-family: var(--font-family); background-color: var(--surface); color: var(--on-surface); }
#root { min-height: 100vh; }`;

await loadModule(ENTRY);

if (!entryDefault) {
  throw new Error("demo.jsx must have: export default function Demo()");
}

// --- Lucide icon extraction & validation ---
const lucideRaw = JSON.parse(await readFile(LUCIDE_JSON, "utf8"));
const iconTableEntries = [];
const missing = [];
for (const [kebab, usages] of [...iconRefs.entries()].sort()) {
  const nodes = lucideRaw[kebab];
  if (!nodes) {
    missing.push(`  ${kebab}  <- used in ${[...usages].join(", ")}`);
    continue;
  }
  iconTableEntries.push(`${JSON.stringify(kebab)}: ${JSON.stringify(nodes)}`);
}
if (missing.length) {
  console.error("FAIL  Unknown icon names (typo, hallucination, or renamed in Lucide):");
  console.error(missing.join("\n"));
  console.error("Pick valid kebab-case names from Lucide (https://lucide.dev/icons).");
  process.exit(1);
}
const lucidePrelude = iconTableEntries.length
  ? `  const LUCIDE = {\n    ${iconTableEntries.join(",\n    ")},\n  };`
  : "  const LUCIDE = {};";
const iconsMod = modules.find((m) => m.label === ICONS_MODULE);
if (iconsMod) iconsMod.prelude = lucidePrelude;

// --- CSS collection: style tokens (base/light/theme/dark) + component css ---
function rewriteCssUrls(css) {
  // Style files live in assets/style/, fonts in assets/font/ — after inlining,
  // urls resolve relative to the HTML at the scaffold root. Strip the "../" but
  // keep any quote characters intact.
  return css.replace(/url\((\s*)(["']?)\.\.\/(font|library|icons)\//g, "url($1$2assets/$3/");
}

const cssParts = [];
for (const f of STYLE_FILES) cssParts.push(rewriteCssUrls(await readFile(f, "utf8")));
for (const css of cssFiles) cssParts.push(await readFile(css, "utf8"));

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
for (const css of cssFiles) extractDefinedVars(await readFile(css, "utf8")).forEach((n) => definedVars.add(n));

const cssLintErrors = [];
const cssLintWarnings = [];
for (const css of cssFiles) {
  const label = css.slice(ROOT.length + 1).replace(/\\/g, "/");
  const content = await readFile(css, "utf8");
  content.split("\n").forEach((line, idx) => {
    const at = `${label}:${idx + 1}`;
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
  "/* ===== render ===== */",
  "const root = ReactDOM.createRoot(document.getElementById(\"root\"));",
  `root.render(React.createElement(__export.${entryDefault}));`,
].join("\n");

if (script.includes("</script>")) {
  throw new Error("Module code contains </script>, cannot inline into HTML");
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ICT Components</title>
<script src="./assets/library/react.production.min.js"></script>
<script src="./assets/library/react-dom.production.min.js"></script>
<script src="./assets/library/babel.min.js"></script>
<style>
${cssParts.join("\n\n")}
</style>
<style>
${BASE_CSS}
</style>
</head>
<body>
<div id="root">Loading...</div>
<script type="text/babel" data-presets="react">
${script}
</script>
</body>
</html>
`;

await writeFile(OUT, html, "utf8");
console.log(`OK  ${OUT}`);
console.log(`    modules (${modules.length}): ${modules.map((m) => m.label).join(", ")}`);
console.log(`    css     (${cssFiles.length + STYLE_FILES.length}): style/(base,light,theme,dark) + ${cssFiles.map((c) => c.slice(ROOT.length + 1).replace(/\\/g, "/")).join(", ")}`);
console.log(`    icons   (${iconTableEntries.length}): ${[...iconRefs.keys()].sort().join(", ") || "none"}`);
console.log(`    entry   : __export.${entryDefault}`);
