#!/usr/bin/env node
// init.mjs — 初始化页面脚手架
//
// 在 {artifact-folder}/preview/ 下创建页面工程:
//   ├── assets/   → 链接(junction/symlink, 失败则拷贝)到 skill 的 scripts/preview/assets
//   ├── app.jsx   → 入口 starter(构建入口 + 布局骨架)
//   └── src/      → 页面源码(context.jsx + components/ views/ 空目录)
//
// 幂等: 若 preview/app.jsx 已存在 → 复用现有脚手架,不覆盖任何文件(修改会话场景)。
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
  "library/react.production.min.js",
  "library/antd.min.js",
  "library/dayjs.min.js",
  "library/babel.min.js",
  "library/react-intl.umd.js",
  "library/lucide-icon-nodes.json",
  "style/base.css",
  "style/light.css",
  "style/theme.css",
  "style/dark.css",
  "style/ant.css",
  "shared/icons.js",
  "shared/antd-zh.js",
];
for (const p of REQUIRED) {
  if (!existsSync(join(ASSETS_SRC, p))) fail(`skill assets incomplete, missing: ${p}`);
}

const dest = join(base, "preview");

const STARTER_APP = `// 应用入口 — ICT React 页面
// 分层约定(目录与命名: views/components 下一组件一文件夹,kebab-case + index.jsx/index.css):
//   Layer 1 全局状态   → src/context.jsx            (AppProvider: 全局状态 + dark 模式切换)
//   Layer 2 数据与逻辑 → src/mock/                  (mock 数据,按域分文件)
//   Layer 3 通用小组件 → src/components/{name}/     (跨视图复用,如 status-tag)
//   Layer 4 视图组件   → src/views/{name}/          (每个页签/功能区一个,如 device-table)
//   Layer 5 布局骨架   → app.jsx                    (本文件: 组装 Provider + H5 布局骨架 header/aside/main)
//
// 样式约定: antd 组件承载布局与交互;自定义样式写在组件文件夹 index.css,颜色/阴影/圆角
// 一律使用 token(var(--primary) / var(--shadow-card) / var(--radius-*))。

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          {/* 视图组件挂载点 */}
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
`;

const STARTER_CONTEXT = `import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 重置层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
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
    libFiles.includes("antd.min.js") &&
    libFiles.includes("babel.min.js");
  if (!runtimeOk) fail(`assets/library runtime js not reachable at: ${libraryDir}`);

  writeFileSync(join(dest, "app.jsx"), STARTER_APP, "utf8");
  writeFileSync(join(dest, "src", "context.jsx"), STARTER_CONTEXT, "utf8");
  writeFileSync(join(dest, "app.css"), STARTER_CSS, "utf8");

  console.log("RESULT: OK");
  console.log(`SCAFFOLD_DIR: ${dest}`);
  console.log("INIT: created");
  console.log(`NEXT: author page source in ${dest} (app.jsx + src/), then run: node scripts/build.mjs --dir "${dest}" && node scripts/verify-build.mjs --dir "${dest}"`);
} catch (err) {
  fail(err.message);
}
