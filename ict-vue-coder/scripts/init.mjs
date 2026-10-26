#!/usr/bin/env node
// init.mjs — 初始化 Vue 页面脚手架(ict-vue-coder)
//
// 在 {artifact-folder}/preview/ 下创建页面工程:
//   ├── assets/    → 链接(junction/symlink, 失败则拷贝)到 skill 的 scripts/preview/assets
//   ├── app.vue    → 入口 starter(根组件 + el-config-provider + 布局骨架)
//   ├── app.css    → 应用级基础样式
//   └── src/       → 页面源码(context.js + mock/ + components/ views/ 空目录)
//
// 幂等: 若 preview/app.vue 已存在 → 复用现有脚手架,不覆盖任何文件(修改会话场景)。
//
// Usage:
//   node init.mjs --artifact-folder "<abs path>"
//   short: -a      (artifact-folder 缺省时使用当前工作目录)
//
// Output (agent-parseable):
//   RESULT: OK
//   SCAFFOLD_DIR: <absolute path>
//   INIT: created | reused
//   RESULT: FAIL | <reason>

import {
  existsSync,
  statSync,
  mkdirSync,
  symlinkSync,
  rmSync,
  cpSync,
  writeFileSync,
  readdirSync,
} from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_SRC = join(__dirname, "preview", "assets");

function fail(reason) {
  console.log(`RESULT: FAIL | ${reason}`);
  process.exit(1);
}

// --- parse args ---
const args = process.argv.slice(2);
function getOpt(long, short) {
  const idx = args.findIndex((a) => a === long || a === short);
  if (idx === -1) return undefined;
  const val = args[idx + 1];
  if (val === undefined || val.startsWith("-")) fail(`Missing value for ${long}`);
  return val;
}

const artifactFolder = getOpt("--artifact-folder", "-a");

const base = resolve(artifactFolder ? artifactFolder : process.cwd());
if (!existsSync(base) || !statSync(base).isDirectory()) {
  fail(`Artifact folder does not exist or is not a directory: ${base}`);
}

// --- validate skill assets completeness ---
if (!existsSync(ASSETS_SRC)) fail(`skill assets missing: ${ASSETS_SRC}`);
const REQUIRED = [
  "library/vue.global.prod.js",
  "library/element-plus.full.min.js",
  "library/element-zh-cn.min.js",
  "library/dayjs.min.js",
  "library/echarts.min.js",
  "library/vue-i18n.global.prod.js",
  "library/lucide-icon-nodes.json",
  "style/base.css",
  "style/light.css",
  "style/theme.css",
  "style/dark.css",
  "style/element/base.css",
  "shared/icon.js",
  "shared/chart.js",
  "shared/ip-input.js",
  "shared/element-zh.js",
];
for (const p of REQUIRED) {
  if (!existsSync(join(ASSETS_SRC, p))) fail(`skill assets incomplete, missing: ${p}`);
}

const dest = join(base, "preview");

const STARTER_APP = `<!-- App entry — ICT Vue page
Layering convention (one folder per component, kebab-case + index.vue):
  Layer 1 global state  → src/context.js         (reactive store: global state + dark mode toggle)
  Layer 2 mock data     → src/mock/              (per-domain files, e.g. device.js / alarm.js)
  Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. status-tag / section-card)
  Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. device-table / header-bar)
  Layer 5 layout        → app.vue                (el-config-provider + root container assembly)

Styling: custom styles in component <style> block or sibling index.css; prefer tokens for visual values.
-->

<template>
  <el-config-provider :locale="zhCn">
    <div class="app-root">
      <!-- view mount point -->
    </div>
  </el-config-provider>
</template>

<script>
import zhCn from "./assets/shared/element-zh.js";
import "./app.css";

export default {
  name: "App",
  components: {},
  setup() {
    return { zhCn };
  },
};
</script>
`;

const STARTER_CONTEXT = `import { reactive, watchEffect } from "vue";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 Element Plus 组件(element/ 换肤文件夹)同源跟随,无需组件树参与换肤。
const state = reactive({
  isDark: false,
});

watchEffect(() => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", state.isDark);
  }
});

// 组合式入口:setup() { return { app: useApp() } } → 模板用 app.isDark
export function useApp() {
  return state;
}

export function toggleDark() {
  state.isDark = !state.isDark;
}
`;

const STARTER_CSS = `/* 应用级基础样式 — 页面根节点的 token 消费示例 */
.app-root {
  min-height: 100vh;
  background: var(--surface-container-lowest);
  color: var(--on-surface);
  font: var(--font-body-m);
}
`;

try {
  // --- idempotent reuse (modification session) ---
  if (existsSync(join(dest, "app.vue"))) {
    console.log("RESULT: OK");
    console.log(`SCAFFOLD_DIR: ${dest}`);
    console.log("INIT: reused (existing app.vue kept, nothing overwritten)");
    process.exit(0);
  }

  mkdirSync(dest, { recursive: true });
  mkdirSync(join(dest, "src", "mock"), { recursive: true });
  mkdirSync(join(dest, "src", "components"), { recursive: true });
  mkdirSync(join(dest, "src", "views"), { recursive: true });

  // --- link assets (junction on win32 needs no admin; fallback: full copy) ---
  const assetsDst = join(dest, "assets");
  let assetsReady = false;
  try {
    if (process.platform === "win32") {
      symlinkSync(ASSETS_SRC, assetsDst, "junction");
    } else {
      symlinkSync(ASSETS_SRC, assetsDst, "dir");
    }
    assetsReady = existsSync(assetsDst);
  } catch {
    assetsReady = false;
  }
  if (!assetsReady) {
    try {
      rmSync(assetsDst, { force: true });
      cpSync(ASSETS_SRC, assetsDst, { recursive: true });
      assetsReady = existsSync(assetsDst);
      if (assetsReady) console.log("NOTE  junction unavailable — assets fully copied (skill asset updates will NOT propagate; delete the assets folder to re-link)");
    } catch {
      assetsReady = false;
    }
  }
  if (!assetsReady) fail(`Could not link or copy assets to: ${assetsDst}`);

  // verify runtime js is reachable through the link
  const libraryDir = join(assetsDst, "library");
  let libFiles = [];
  try { libFiles = readdirSync(libraryDir); } catch { /* link broken */ }
  const runtimeOk =
    libFiles.includes("vue.global.prod.js") &&
    libFiles.includes("element-plus.full.min.js");
  if (!runtimeOk) fail(`assets/library runtime js not reachable at: ${libraryDir}`);

  writeFileSync(join(dest, "app.vue"), STARTER_APP, "utf8");
  writeFileSync(join(dest, "src", "context.js"), STARTER_CONTEXT, "utf8");
  writeFileSync(join(dest, "app.css"), STARTER_CSS, "utf8");

  console.log("RESULT: OK");
  console.log(`SCAFFOLD_DIR: ${dest}`);
  console.log("INIT: created");
  console.log(`NEXT: author page source in ${dest} (app.vue + src/), then run: node scripts/build.mjs --dir "${dest}" && node scripts/verify-build.mjs --dir "${dest}"`);
} catch (err) {
  fail(err.message);
}
