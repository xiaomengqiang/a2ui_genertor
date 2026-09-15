#!/usr/bin/env node
// init.mjs — 初始化页面脚手架
//
// 在 {artifact-folder}/{slug}/ 下创建页面工程:
//   ├── assets/   → 链接(junction/symlink, 失败则拷贝)到 skill 的 scripts/preview/assets
//   ├── app.jsx   → 入口 starter(构建入口 + 布局骨架)
//   └── src/      → 页面源码(components/ views/ 已建空目录)
//
// 幂等: 若 {slug}/app.jsx 已存在 → 复用脚手架,不覆盖任何文件(修改会话场景)。
//
// Usage:
//   node init.mjs --artifact-folder "<abs path>" --slug "<kebab-case>"
//   short: -a  -s      (artifact-folder 缺省时使用当前工作目录)
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
const slug = getOpt("--slug", "-s");

if (!slug) fail('Missing --slug <kebab-case>. e.g. --slug "data-dashboard"');
if (!/^[a-z0-9]+(-[a-z0-9]+){1,5}$/.test(slug)) {
  fail(`Slug must be kebab-case ascii, 2-6 hyphen-separated segments: '${slug}'`);
}

const base = resolve(artifactFolder ? artifactFolder : process.cwd());
if (!existsSync(base) || !statSync(base).isDirectory()) {
  fail(`Artifact folder does not exist or is not a directory: ${base}`);
}

// --- validate skill assets completeness ---
if (!existsSync(ASSETS_SRC)) fail(`skill assets missing: ${ASSETS_SRC}`);
const REQUIRED = [
  "library/react.production.min.js",
  "library/antd.min.js",
  "library/dayjs.min.js",
  "library/babel.min.js",
  "library/lucide-icon-nodes.json",
  "style/base.css",
  "style/light.css",
  "style/theme.css",
  "style/dark.css",
  "shared/icons.js",
  "shared/antd-zh-cn.js",
];
for (const p of REQUIRED) {
  if (!existsSync(join(ASSETS_SRC, p))) fail(`skill assets incomplete, missing: ${p}`);
}

const dest = join(base, slug);

const STARTER_APP = `// 应用入口 — ICT React 页面
// 分层约定:
//   Layer 1 全局状态   → src/context.jsx  (AppProvider: 全局状态 + dark 模式同步)
//   Layer 2 数据与逻辑 → src/data.js      (mock 数据、派生统计)
//   Layer 3 通用小组件 → src/components/  (StatusTag / StatCard ...)
//   Layer 4 视图组件   → src/views/       (每个页签/功能区一个,配套同名 .css)
//   Layer 5 布局骨架   → app.jsx          (本文件: 组装 Provider + antd Layout)
//
// 样式约定: antd 组件承载布局与交互;自定义样式写在 CSS 文件中,颜色/阴影/圆角
// 一律使用 token(var(--primary) / var(--shadow-card) / var(--radius-*))。

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh-cn.js";
import "./app.css";

// 页面标题 — 构建时写入产物 <title>
export const APP_TITLE = "页面标题";

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app-root">
        {/* 视图组件挂载点 */}
      </div>
    </ConfigProvider>
  );
}
`;

const STARTER_CSS = `/* 应用级基础样式 — 页面骨架的 token 消费示例 */
.app-root {
  min-height: 100vh;
  background: var(--surface-container-lowest);
  color: var(--on-surface);
  font: var(--font-body-m);
}
`;

try {
  // --- idempotent reuse (modification session) ---
  if (existsSync(join(dest, "app.jsx"))) {
    console.log("RESULT: OK");
    console.log(`SCAFFOLD_DIR: ${dest}`);
    console.log("INIT: reused (existing app.jsx kept, nothing overwritten)");
    process.exit(0);
  }

  mkdirSync(dest, { recursive: true });
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
    libFiles.includes("antd.min.js") &&
    libFiles.includes("babel.min.js");
  if (!runtimeOk) fail(`assets/library runtime js not reachable at: ${libraryDir}`);

  writeFileSync(join(dest, "app.jsx"), STARTER_APP, "utf8");
  writeFileSync(join(dest, "app.css"), STARTER_CSS, "utf8");

  console.log("RESULT: OK");
  console.log(`SCAFFOLD_DIR: ${dest}`);
  console.log("INIT: created");
  console.log(`NEXT: author page source in ${dest} (app.jsx + src/), then run: node scripts/build.mjs --dir "${dest}" && node scripts/verify-build.mjs --dir "${dest}"`);
} catch (err) {
  fail(err.message);
}
