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
  └── src/      → context.jsx + mock/ + components/ + views/ (empty)
  ```
- **Output:** `RESULT: OK` + `SCAFFOLD_DIR: <abs path>` → proceed. `RESULT: FAIL | <reason>` → fix and re-run.
- **Init runs ONCE per page.** In modification sessions, do NOT re-run init.

## Step 2 — Author the Page

> Layering convention (see app.jsx header for Layer 1–5):
> ```
> src/context.jsx        Layer 1 global state (AppProvider + useApp hook; dark mode toggle)
> src/mock/              Layer 2 mock data (per-domain files, e.g. device.js / alarm.js)
> src/components/{name}/ Layer 3 reusable components (cross-view, e.g. status-tag / section-card)
> src/views/{name}/      Layer 4 view components (one per tab/section, e.g. device-table / header-bar)
> app.jsx                Layer 5 layout skeleton (Provider + root container assembly)
> ```
>
> **Directory & naming rules:**
> - One folder per component under views/ and components/: kebab-case folder name, containing `index.jsx` + `index.css` + other helper `.js` files as needed
> - Folder name = component name — no PascalCase, no mismatched jsx/css names
> - Root-level files (context.jsx / i18n.js) and entry (app.jsx / app.css) stay flat, no folders
> - Use relative import paths within component folders

### Import contract (ES Modules, build-time bundled)

Supported - **standard ES Module imports**, the bundler maps them to runtime globals:

```jsx
import dayjs from "dayjs";                            // → dayjs global
import { useState, useEffect } from "react";          // → React globals
import { Menu, Button, Table, ConfigProvider } from "antd"; // → antd globals (layout components banned, see below)
import { IntlProvider, FormattedMessage, useIntl } from "react-intl"; // → ReactIntl global (optional, multilingual pages)
import zhCN from "./assets/shared/antd-zh.js";        // Antd chinese locale (dayjs zh-cn + antd zhCN)
import { Icon } from "./assets/shared/icons.js";      // Lucide icon component
import { AppProvider, useApp } from "./src/context.jsx"; // relative imports for own modules
import DeviceTable from "./src/views/device-table/index.jsx"; // component import (optional)
import "./src/views/device-table/index.css";          // component CSS (optional)
```

NOT supported:
- `import * as`
- aliased imports (`{ a as b }`)
- npm packages beyond react/react-dom/antd/dayjs/react-intl
- `import ... from "@ant-design/icons"` is **banned**; page icons are Lucide-only via `<Icon name="..." />`
- `export default` must be a named function declaration (`export default function App()`)
- Page entry file must be `app.jsx`
- Relative imports must include file extensions (`./src/views/device-table/index.jsx`, no omitting `.jsx`/`.js`/`.css`)
- Banned antd components: `Layout` `Grid(Row/Col)` `Flex` `Space` `Card` `Skeleton` `Masonry` `Popconfirm` `Watermark`. If needed, use pure H5 or existing component combinations instead.

### Icon usage

Read **[references/component/Icon.md](references/component/Icon.md)** — Lucide names only (`<Icon name="search" size={14} />`), **never hand-write SVG paths**, **never use @ant-design/icons**. Build validates and injects icons on demand.

### Internationalization

**Default: single-language (zh-CN), already configured in the starter** — `app.jsx` imports `antd-zh.js` (dayjs + antd zh-CN locale) and wraps `<ConfigProvider locale={zhCN}>`. No extra work needed for Chinese pages.

**Gate: do NOT create `src/i18n.js`, `IntlProvider`, or language-switch UI unless the user explicitly requests multilingual support.**

When multilingual is required, use react-intl (bundled offline, `import ... from "react-intl"` auto-maps to `ReactIntl` global):

1. **Antd and dayjs: no extra locale setup for zh/en** — Chinese is pre-installed via `antd-zh.js`; English is the default for both.
2. **Dictionary**: `src/i18n.js` — central `{ zh: {...}, en: {...} }` with semantic keys (`menu.devices`).
3. **Provider**: `<IntlProvider locale={lang} messages={dict[lang]}>` inside app.jsx's ConfigProvider.
4. **Usage**: `<FormattedMessage id="menu.devices" defaultMessage="设备管理" />` or `useIntl().formatMessage(...)`; ICU syntax supported (`{count, plural, one {# alarm} other {# alarms}}`).
5. **defaultMessage is required** — fallback display when a key is missing from the dictionary.
6. **Language switch sync**: IntlProvider `locale/messages` + ConfigProvider `locale` + `dayjs.locale()`.

### Styling — token-first (CRITICAL)

1. **Read `references/design_system.md`** for tokens and visual rules.
2. Custom styles go in the component's `index.css` with semantic class names. 
  - Colors/fonts/shadows/radius/spacing MUST use **tokens**; hardcoded hex or px only when the requirement specifies an exact value.
3. Dark mode single-track (CRITICAL): **Do NOT use antd's darkAlgorithm / React state theme switching.** `src/context.jsx`'s AppProvider toggles `<html>`'s `.dark` class — H5 elements flip via tokens; antd components via `ant.css`. antd `theme` prop stays `"light"`.
   - Do NOT define bare `:root` / `.dark` selectors (without a descendant suffix) — global tokens already live in `assets/style/`
   - Per-mode values that tokens can't express (custom colors, images, gradients): base rule = light value, dark value via `.dark .yourComponentRoot { ... }` descendant override
4. Do NOT create page-level antd component override styles (e.g., `antd.css`/`ant-override.css`). antd component skinning and visual gaps go into the shared `assets/style/ant.css` (including `.dark` rules) — single source, all pages benefit.

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

## Constraints

- No `import * as`, no aliased imports (`{ a as b }`) — see Import contract
- No npm packages beyond react/react-dom/antd/dayjs/react-intl — see Import contract
- No `@ant-design/icons` — use Lucide Icon component — see Import contract
- No antd layout/decorative components (Layout/Grid/Flex/Space/Card/Skeleton/Masonry/Popconfirm/Watermark) — build FAILs — see Import contract
- `export default` must be a named function declaration; page entry must be `app.jsx` — see Import contract
- Relative imports must include file extensions (`.jsx`/`.js`/`.css`) — see Import contract
- No bare `:root`/`.dark` selectors in component CSS — see Styling rule 3
- No page-level antd override CSS — see Styling rule 4
- No antd darkAlgorithm or React-state theme switching — see Styling rule 3
- No `src/i18n.js`/IntlProvider/language-switch UI unless explicitly requested — see Internationalization

---

## Generation Rules

- **Generative Expansion:** 永不输出稀疏 UI — 用全所有数据项、mock 真实文案/指标、必要 CTA 与交互、搜索/筛选/排序、状态标签与图标语义化。
- **Mock data:** 语义化 key（`hotelName`、`orderCount`，不是 `val1`）；主列表/表格 ≥10 条且状态多样，次级列表 5–6 条。**若输入为截图/图片：按图逐格转录，不扩充不发明**（行数列数与图一致、逐格独立读取、可见列都有 data key、同行数字逻辑自洽）。
- **Media URLs:** 头像 `https://randomuser.me/api/portraits/{men|women}/{1-99}.jpg`；占位图 `https://fpoimg.com/{width}x{height}?gradient={hex_start},{hex_end}&text_color={text_hex}&text=IMAGE`。
- **antd API:** 标准 Ant Design 5 API，不发明 prop；复杂组件（Table/Modal/Form/Tabs…）按需读 `references/component/{Name}.md` 设计规范。
- **Self-check:** JSX 标签闭合、引用变量皆有定义、用到的组件均已 import — build + verify 会兜底，但一次写对更快。

## Quality Checklist (Self-Verify Before Output)

1. build `OK` + verify `OK index.page.html verified`
2. app.jsx: `export default function App()` present
3. Mock data 完整（行数、状态多样性、语义 key）
4. `<artifact>` 链接已输出

## References

- **[references/design_system.md](references/design_system.md)** — 设计 Token（含场景注释）、层级、布局、品牌质量
- **[references/component/](references/component/)** — 组件设计规范（使用规则、布局、Don'ts）。按需读取；API 以 Ant Design 5 为准
- **[references/component/Icon.md](references/component/Icon.md)** — Lucide 图标使用规范（props、命名规则、antd 搭配）
- **[references/component_catalog.md](references/component_catalog.md)** / **[references/charts_usage.md](references/charts_usage.md)** — 组件清单与图表规范
