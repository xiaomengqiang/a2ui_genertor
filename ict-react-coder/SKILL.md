---
name: ict-react-coder
description: Generate a production-grade single-page prototype from any input — text descriptions (page or module), screenshots/images, or raw HTML. Deliverables are the page source (app.jsx + src/*) and a self-running index.page.html (React + Design Token + Ant Design 5).
---

# ICT React Coder — Single-Page Prototype Generator

You are an expert UI/UX Designer and Frontend Engineer. Your mission is to generate and modify pages: create a production-grade frontend page from the user's input, and revise existing scaffolds when the user requests changes. 
Deliverables per request: a page scaffold (`app.jsx` + `src/*`) authored as standard ES Modules, compiled into a self-running `index.page.html` (React + Ant Design 5 via local assets, four-layer design token CSS).

## Workflow Overview

```
init scaffold → author page → build → verify → output
```
0. **Init:** create the page scaffold at `{artifact-folder}/preview/`
1. **Author:** write the page source (app.jsx + src/**) as ES Modules
2. **Build & verify:** compile to a single `index.page.html`, machine-check it
3. **Output:** emit the preview link as an `<artifact>` tag

---

## Step 1 — Init Scaffold (MANDATORY, once per page)

```
node scripts/init.mjs --artifact-folder "{artifact-folder}"
```

- `{artifact-folder}` comes from the runtime context — use it as-is, do NOT create/guess/fabricate it. If absent, omit the flag (falls back to the current working directory).
- `init.mjs` creates a page scaffold at `{artifact-folder}/preview/`:
  ```
  preview/
  ├── assets/   → linked to the skill's shared assets (library/style/font/shared/uploads)
  ├── app.jsx   → entry starter (build entry + root container)
  └── src/      → context.jsx + empty components/ + empty views/
  ```
- **Output:** `RESULT: OK` + `SCAFFOLD_DIR: <abs path>` → proceed. `RESULT: FAIL | <reason>` → fix and re-run.
- **Init runs ONCE per page.** In modification sessions, do NOT re-run init.

## Step 2 — Author the Page

> 分层约定（Layer 1–5 见 app.jsx 头部注释）：
> ```
> src/context.jsx        Layer 1 全局状态 (AppProvider + useApp hook; dark 模式切换)
> src/data.js            Layer 2 数据与业务逻辑 (mock data, derived stats)
> src/components/{name}/ Layer 3 通用小组件 (跨视图复用,如 status-tag / section-card)
> src/views/{name}/      Layer 4 视图组件 (每个页签/功能区一个,如 device-table / header-bar)
> app.jsx                Layer 5 布局骨架 (Provider + root container assembly)
> ```
>
> **目录与命名规则（强制）：**
> - views/ 与 components/ 下**一个组件一个文件夹**：kebab-case 文件夹名，内部 `index.jsx` + `index.css`
> - 根级文件（context.jsx / data.js / i18n.js）与入口（app.jsx / app.css）不进文件夹
> - 文件夹名即组件名 — 不出现 PascalCase 文件、不出现 jsx/css 不同名配对
> - **组件文件夹内相对路径深度**：引用共享资产 `../../../assets/shared/...`、引用 src 模块 `../../context.jsx`（比平铺深一层，写错会 build FAIL）

### Import contract (ES Modules, build-time bundled)

Supported — write **standard ES Module imports**, the bundler maps them to runtime globals:

```jsx
import { useState, useEffect } from "react";          // → React globals
import { Menu, Button, Table, ConfigProvider, theme } from "antd"; // → antd globals(禁布局类,见下)
import dayjs from "dayjs";                            // → dayjs global
import { IntlProvider, FormattedMessage, useIntl } from "react-intl"; // → ReactIntl global(可选,多语言页面)
import zhCN from "./assets/shared/antd-zh.js";     // 中文 locale(dayjs zh-cn + antd zhCN)
import { Icon } from "./assets/shared/icons.js";      // Lucide 图标组件
import { AppProvider, useApp } from "./src/context.jsx"; // 相对路径引用自己的模块
import DeviceTable from "./src/views/device-table/index.jsx";
import "./src/views/device-table/index.css";          // 组件级 CSS(可选)
```

NOT supported:
- `import * as`
- aliased imports (`{ a as b }`)
- npm packages beyond react/react-dom/antd/dayjs
- `import ... from "@ant-design/icons"` — **build FAILs**; page icons are Lucide-only via `<Icon name="..." />`（antd 组件内置图标无需处理，随 antd.min.js 携带）
- **禁用 antd 布局/装饰组件（build 直接 FAIL）**：`Layout` `Grid(Row/Col)` `Flex` `Space` `Card` `Skeleton` `Masonry` `Popconfirm` `Watermark`。真遇到对应需求，**用纯 H5 或已有组件组合实现**
- `export default` 必须是具名函数声明（`export default function App()`）；入口必须是 `app.jsx`
- 相对 import 必须带扩展名（`./src/views/device-table/index.jsx`，不能省略 `.jsx`/`.js`/`.css`）

### Icon usage

Read **[references/component/Icon.md](references/component/Icon.md)** — Lucide names only (`<Icon name="search" size={14} />`), never hand-write SVG paths, never use @ant-design/icons. build.mjs validates every name at build time and injects only the used icon nodes.

### zh-CN locale

`antd.min.js` UMD 不带 locale 包 — 用共享补丁文件：
```jsx
import zhCN from "./assets/shared/antd-zh.js";
<ConfigProvider locale={zhCN}>…</ConfigProvider>
```
（该文件同时注册 dayjs zh-cn locale，DatePicker/Pagination 等均为中文。）

### i18n（可选 — 多语言页面才启用）

默认页面单语言（zh-CN）。**准入门槛（强制）：用户未明确要求多语言/中英切换时，禁止创建 `src/i18n.js`、禁止引入 IntlProvider、禁止生成语言切换 UI** — 单语言页面带语言切换属于过度设计。用户明确要求后，按以下模式使用 react-intl（离线包已内置，`import ... from "react-intl"` 自动映射到 `ReactIntl` 全局）：

1. **字典**：`src/i18n.js` 集中维护 `{ zh: {...}, en: {...} }`，语义化 key（`menu.devices`）。
2. **Provider**：`<IntlProvider locale={lang} messages={dict[lang]}>` 包在 ConfigProvider 内层。
3. **消费**：`<FormattedMessage id="menu.devices" defaultMessage="设备管理" />` 或 `useIntl().formatMessage(...)`；ICU 语法可用（`{count, plural, one {# alarm} other {# alarms}}`）。
4. **defaultMessage 必写** — 字典漏 key 时的兜底显示，防止裸 key/空白。
5. **切语言三件套同步**：IntlProvider 的 `locale/messages` + ConfigProvider 的 `locale`（zhCN/enUS）+ `dayjs.locale()`。antd enUS locale 需内联精简对象（同 zh-cn 补丁思路，仅必要组件）。

### Styling — token-first (CRITICAL)

1. **Read `references/design_system.md`** (once per session) for tokens and visual rules.
2. **布局一律 H5 结构 + CSS**：`<header>/<aside>/<main>/<footer>/<section>` + flex/grid + token 间距（`gap: var(--spacing-gutter)`）。antd 布局/装饰组件已禁用（Layout/Grid/Flex/Space/Card/Skeleton/Masonry/Popconfirm/Watermark，build FAIL）。交互组件一律 antd（语义色走 props：`type="primary"`、`status="error"`…）。真遇到对应需求，**用纯 H5 或已有组件组合实现**。
3. **自定义样式写在组件文件夹的 `index.css`**（如 `src/views/device-table/index.jsx` + `index.css`）：布局用 flex/grid + px 值；**颜色/阴影/圆角/文字规格一律用 token** — `var(--primary)`、`var(--surface-container-highest)`、`var(--shadow-card)`、`var(--radius-container)`… 文字用角色化 font token：`font: var(--font-body-m)`（display/headline/body/caption × l/m/s 共 11 档），字重独立设 `font-weight: var(--font-weight-medium)`。NEVER 硬编码 hex（build.mjs CSS lint FAIL/WARN 兜底）。
4. Dark mode 单轨驱动（CRITICAL）：**不使用 antd 的 darkAlgorithm / React 态主题切换**。`src/context.jsx`（init 自带）的 AppProvider 只切换 `<html>` 的 `.dark` class —— 普通 H5 元素由四层 token 自动翻转；antd 组件的暗色由 `assets/style/ant.css` 重置层的 `.dark` 规则承载。antd 组件的 `theme` prop 一律静态 `"light"`，不用 React 态切主题。
5. Component CSS must not define `:root`/`.dark` blocks and must use defined tokens; build.mjs CSS lint FAILs otherwise.
6. **禁止页面级 antd 组件覆盖样式**（如自建 `antd.css`/`ant-override.css`）：antd 组件的换肤与视觉缺口统一补充到共享的 `assets/style/ant.css`（含 `.dark` 规则）— 换肤层单源，所有页面一致受益。

## Step 3 — Build (MANDATORY)

```
node scripts/build.mjs --dir "{SCAFFOLD_DIR}"
```

- `build.mjs` bundles all page source modules into one self-running `index.page.html` (local UMD libraries + Design Token CSS + antd skin + Lucide icons).
- **WARN**: unknown icon names, hardcoded hex — safe to ignore.
- **FAIL**: read the error, fix the source, re-run `build.mjs`.

## Step 4 — Verify (MANDATORY)

```
node scripts/verify-build.mjs --dir "{SCAFFOLD_DIR}"
```

- `verify-build.mjs` headlessly compiles and runs the built script to verify the code executes without errors (catches syntax errors, undefined variables, and render failures before opening a browser).
- **Success**: `OK index.page.html verified`.
- **Failure**: error output points to the source file and line — fix it, then re-run build → verify.

## Step 5 — Output

After build and verify both pass, output the preview link as the final conversation output:

```
<artifact type="text/link">{SCAFFOLD_DIR}/index.page.html</artifact>
```

---

## Modification Workflow

When modifying an existing page, **do NOT regenerate from scratch or edit `index.page.html` directly** — modify the `src` source and rebuild:

1. **Locate:** `{artifact-folder}/preview/` (the `SCAFFOLD_DIR` from init).
2. **Edit:** only the parts the user mentioned — keep the rest untouched.
3. **Rebuild & verify:** Step 3 + Step 4. 
4. **Output:** output the same `<artifact>` link as in Step 5.

---

## Generation Rules

- **Generative Expansion:** 永不输出稀疏 UI — 用全所有数据项、mock 真实文案/指标、必要 CTA 与交互、搜索/筛选/排序、状态标签与图标语义化。
- **Mock data:** 语义化 key（`hotelName`、`orderCount`，不是 `val1`）；主列表/表格 ≥10 条且状态多样，次级列表 5–6 条。**若输入为截图/图片：按图逐格转录，不扩充不发明**（行数列数与图一致、逐格独立读取、可见列都有 data key、同行数字逻辑自洽）。
- **Media URLs:** 头像 `https://randomuser.me/api/portraits/{men|women}/{1-99}.jpg`；占位图 `https://fpoimg.com/{width}x{height}?gradient={hex_start},{hex_end}&text_color={text_hex}&text=IMAGE`。
- **antd API:** 标准 Ant Design 5 API，不发明 prop；复杂组件（Table/Modal/Form/Tabs…）按需读 `references/component/{Name}.md` 设计规范。
- **Self-check:** JSX 标签闭合、引用变量皆有定义、用到的组件均已 import — build + verify 会兜底，但一次写对更快。

## Session Context Caching (CRITICAL for speed)

同会话内已读过的文件保持在上下文中：
1. **NEVER re-read** 已读文件（含 `references/design_system.md`、`references/component/*.md`）。
2. 设计规范一会话读一次；组件规范按需读。

## Quality Checklist (Self-Verify Before Output)

1. build `OK` + verify `OK index.page.html verified`
2. 无 WARN 遗留（icon 名 / hex）
3. app.jsx: `export default function App()` present
4. Mock data 完整（行数、状态多样性、语义 key）
5. Token-first 颜色（CSS 无硬编码 hex，token 取色）
6. `<artifact>` 链接已输出

## References

- **[references/design_system.md](references/design_system.md)** — 设计 Token（含场景注释）、层级、布局、品牌质量
- **[references/component/](references/component/)** — 组件设计规范（使用规则、布局、Don'ts）。按需读取；API 以 Ant Design 5 为准
- **[references/component/Icon.md](references/component/Icon.md)** — Lucide 图标使用规范（props、命名规则、antd 搭配）
- **[references/component_catalog.md](references/component_catalog.md)** / **[references/charts_usage.md](references/charts_usage.md)** — 组件清单与图表规范
