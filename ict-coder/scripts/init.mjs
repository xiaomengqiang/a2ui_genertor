#!/usr/bin/env node
// init.mjs — 初始化页面脚手架
//
// 在 {artifact-folder}/{dir-name}/ 下创建页面工程:
//   ├── public/   → 完整拷贝自 skill 的 scripts/preview/public
//   ├── app.jsx   → 入口 starter(构建入口 + 布局骨架)
//   └── src/      → 页面源码(context.jsx + components/ views/ 空目录)
//
// 幂等: 缺省 dir-name 重跑 → 复用现有 preview/ 工程(修改会话场景);
//       显式 --dir-name 撞名 → 追加 -2 / -3(新建工程意图)。
//
// Usage:
//   node init.mjs --artifact-folder "<abs path>" [--dir-name "<kebab-case name>"]
//   short: -a / -d     (artifact-folder 缺省时使用当前工作目录; dir-name 缺省时为 "preview")
//
// dir-name 命名规则: kebab-case, 由 AI 根据用户页面描述提取(如 "device-alarm-management")
// 冲突处理: 若同名目录已含工程(app.jsx), 自动追加 -2 / -3
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
  cpSync,
  writeFileSync,
  readdirSync,
} from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_SRC = join(__dirname, "preview", "public");

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
const dirNameOpt = getOpt("--dir-name", "-d");

const base = resolve(artifactFolder ? artifactFolder : process.cwd());
if (!existsSync(base) || !statSync(base).isDirectory()) {
  fail(`Artifact folder does not exist or is not a directory: ${base}`);
}

// dir-name: kebab-case, derived from user's page description; default "preview"
const dirName = dirNameOpt || "preview";
if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(dirName)) {
  fail(`Invalid dir-name "${dirName}" — must be kebab-case (e.g. "device-alarm-management")`);
}

// --- validate skill public completeness ---
if (!existsSync(PUBLIC_SRC)) fail(`skill public missing: ${PUBLIC_SRC}`);
const REQUIRED = [
  "library/react.production.min.js",
  "library/antd.min.js",
  "library/dayjs.min.js",
  "library/echarts.min.js",
  "library/hui-charts.umd.js",
  "library/babel.min.js",
  "library/react-intl.umd.js",
  "library/lucide-icon-nodes.json",
  "style/base.css",
  "style/light.css",
  "style/theme.css",
  "style/dark.css",
  "style/ant.css",
  "shared/icon.jsx",
  "shared/antd-zh.js",
];
for (const p of REQUIRED) {
  if (!existsSync(join(PUBLIC_SRC, p))) fail(`skill public incomplete, missing: ${p}`);
}

// resolve conflicts: only when dir-name was explicitly passed (new project intent);
// default "preview" re-run means a modification session → idempotent reuse
let dest = join(base, dirName);
if (dirNameOpt && existsSync(join(dest, "app.jsx"))) {
  let n = 2;
  while (existsSync(join(base, `${dirName}-${n}`, "app.jsx"))) n++;
  const resolved = `${dirName}-${n}`;
  console.log(`NOTE  dir-name conflict: "${dirName}" already has a project, using "${resolved}"`);
  dest = join(base, resolved);
}

const STARTER_APP = `// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. status-tag / section-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. device-table / header-bar)
//   src/utils/            → pure function utilities (formatNumber, debounce, etc.)
//   src/hooks/            → custom React hooks (useDebounce, useTableData, etc.)
//   src/constants/        → enums and config constants (STATUS_MAP, PAGE_SIZE, etc.)
//   src/styles/           → cross-view shared CSS (utility classes, keyframes; not antd overrides)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider, Empty } from "antd";
import zhCN from "./public/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./public/uploads/empty.svg" }}
        spin={{ indicator: <img src="./public/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root">
          {/* view mount point */}
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
`;

const STARTER_CONTEXT = `import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
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

const STARTER_CSS = `/* 应用级基础样式 — 页面根节点的 token 消费示例 */
.app-root {
  min-height: 100vh;
  background: var(--surface-container-lowest);
  color: var(--on-surface);
  font: var(--font-body-m);
}
`;

const AGENTS_MD = `本项目的唯一内容源是根目录 **README.md**（目录结构、构建与验证命令、关键非显性约定全部在其中）。

**任何 AI 会话开始工作前，必须先完整阅读 README.md，并严格遵守其中的约定。**
`;

const GITIGNORE = `.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
.octo/
.history/
node_modules/
dist/
`;

const README_MD = `# [项目名称]

> 本项目由 ict-coder skill 生成。

[一句话描述项目功能]

## 开发流程

1. 修改 \`app.jsx\` 或 \`src/\` 下的源码
2. 重新构建：\`node [skill路径]/scripts/build.mjs --dir [工程目录]\`
3. 验证构建：\`node [skill路径]/scripts/verify-build.mjs --dir [工程目录]\`
4. 刷新浏览器查看效果（构建产物：\`[工程目录]/index.page.html\`，双击打开或刷新已打开的页面）

## 目录结构

\`\`\`
[工程目录]/
├── app.jsx              页面入口（Provider + 根容器组装）
├── src/
│   ├── views/           视图组件（一个 tab/section 一个文件夹）
│   ├── components/      可复用组件
│   ├── mock/            mock 数据
│   ├── hooks/           自定义 React hooks
│   ├── utils/           纯函数工具
│   ├── constants/       枚举/配置常量
│   ├── styles/          跨视图共享 CSS
│   └── context.jsx      全局状态（AppProvider + useApp）
├── public/              共享资产（React/antd/Babel 运行时 + token CSS + 字体）
└── index.page.html      构建产物（自动生成，勿手改）
\`\`\`

## 关键约定

- **先读 skill 再开发**：本工程基于 ict-coder skill 体系，首次工作前请阅读 skill 的 SKILL.md（组件规范、token 体系、禁用规则）
- **只改源码，不改产物**：修改 \`src/\` 或 \`app.jsx\` 后必须重新 build，禁止直接编辑 \`index.page.html\`
- **图片资源放 \`public/uploads/\`**；新的 UMD 库（如 three.umd.js）放 \`public/library/\`
- **不要修改下列文件**：\`public/library/\`（React/antd 运行时）、\`public/style/\`（token CSS）、\`public/shared/\`（icon/chart 共享件）
- **每次修改后验证**：build 完成后运行 verify-build.mjs，确认 Babel 编译和渲染无错误
- **init.mjs 只跑一次**：修改会话中不要重新执行 init（幂等无害但无意义）
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
  mkdirSync(join(dest, "src", "utils"), { recursive: true });
  mkdirSync(join(dest, "src", "hooks"), { recursive: true });
  mkdirSync(join(dest, "src", "constants"), { recursive: true });
  mkdirSync(join(dest, "src", "styles"), { recursive: true });
  for (const d of ["utils", "hooks", "constants", "styles"]) {
    writeFileSync(join(dest, "src", d, ".gitkeep"), "", "utf8");
  }

  // --- copy public (full copy from skill's shared assets) ---
  const publicDst = join(dest, "public");
  try {
    cpSync(PUBLIC_SRC, publicDst, { recursive: true });
  } catch {
    fail(`Could not copy public to: ${publicDst}`);
  }
  if (!existsSync(publicDst)) fail(`public copy failed: ${publicDst}`);

  // verify runtime js is reachable in the copied public
  const libraryDir = join(publicDst, "library");
  let libFiles = [];
  try { libFiles = readdirSync(libraryDir); } catch { /* copy incomplete */ }
  const runtimeOk =
    libFiles.includes("antd.min.js") &&
    libFiles.includes("babel.min.js");
  if (!runtimeOk) fail(`public/library runtime js not reachable at: ${libraryDir}`);

  writeFileSync(join(dest, "app.jsx"), STARTER_APP, "utf8");
  writeFileSync(join(dest, "src", "context.jsx"), STARTER_CONTEXT, "utf8");
  writeFileSync(join(dest, "app.css"), STARTER_CSS, "utf8");
  // AGENTS.md / README.md / .gitignore: shared at base level, only write if not already present
  if (!existsSync(join(base, "AGENTS.md"))) writeFileSync(join(base, "AGENTS.md"), AGENTS_MD, "utf8");
  if (!existsSync(join(base, "README.md"))) writeFileSync(join(base, "README.md"), README_MD, "utf8");
  if (!existsSync(join(base, ".gitignore"))) writeFileSync(join(base, ".gitignore"), GITIGNORE, "utf8");

  console.log("RESULT: OK");
  console.log(`SCAFFOLD_DIR: ${dest}`);
  console.log("INIT: created");
  console.log(`NEXT: author page source in ${dest} (app.jsx + src/), then run: node scripts/build.mjs --dir "${dest}" && node scripts/verify-build.mjs --dir "${dest}"`);
} catch (err) {
  fail(err.message);
}
