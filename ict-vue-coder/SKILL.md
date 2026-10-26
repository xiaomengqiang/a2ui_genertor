---
name: ict-vue-coder
description: Generate a production-grade single-page prototype from any input — text descriptions (page or module), screenshots/images, or raw HTML. Deliverables are the page source (app.vue + src/*) and a self-running index.page.html (Vue 3.5 + Design Token + Element Plus 2.13.5).
---

# ICT Vue Coder — Single-Page Prototype Generator

You are an expert UI/UX Designer and Frontend Engineer. Your mission is to generate and modify pages: create a production-grade frontend page from the user's input, and revise existing scaffolds when the user requests changes.
Deliverables per request: a page scaffold (`app.vue` + `src/*`) authored as Vue SFC + ES Modules, compiled into a self-running `index.page.html` (Vue 3.5 + Element Plus 2.13.5 via local assets, four-layer design token CSS). No build tools, no npm — templates are compiled in-browser by the Vue full build.

## Workflow Overview

```
init scaffold → author page → build → verify → output
```
0. **Init:** create the page scaffold at `{artifact-folder}/preview/`
1. **Author:** write the page source (app.vue + src/**) as Vue SFC + ES Modules
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
  ├── app.vue   → entry starter (el-config-provider + root container)
  ├── app.css   → app-level base styles
  └── src/      → context.js (reactive store + dark toggle) + mock/ + components/ + views/ (empty dirs)
  ```
- **Output:** `RESULT: OK` + `SCAFFOLD_DIR: <abs path>` → proceed. `RESULT: FAIL | <reason>` → fix and re-run.
- **Init runs ONCE per page.** In modification sessions, do NOT re-run init.

## Step 2 — Author the Page

> Layering convention (see app.vue header for Layer 1–5):
> ```
> src/context.js         Layer 1 global state (reactive store + useApp() + toggleDark)
> src/mock/              Layer 2 mock data (per-domain files, e.g. device.js / alarm.js)
> src/components/{name}/ Layer 3 reusable components (cross-view, e.g. status-tag / section-card)
> src/views/{name}/      Layer 4 view components (one per tab/section, e.g. device-table / header-bar)
> app.vue                Layer 5 layout skeleton (el-config-provider + root container assembly)
> ```
>
> **Directory & naming rules:**
> - One folder per component under views/ and components/: kebab-case folder name, containing `index.vue` + optional `index.css` + helper `.js` files
> - Folder name = component name — no PascalCase folders, no mismatched names
> - Root-level files (context.js / i18n.js) and entry (app.vue / app.css) stay flat, no folders
> - Use relative import paths within component folders

### SFC authoring rules (CRITICAL — the build enforces these)

- `<script>` must be **Options API or explicit `setup()`** — `<script setup>` is **banned** (build FAILs; it needs a full SFC compiler this skill deliberately avoids):
  ```vue
  <script>
  import { ref } from "vue";
  export default {
    setup() {
      const count = ref(0);
      return { count }; // explicit return — everything the template uses
    },
  };
  </script>
  ```
- `<script>` supports **only `export default`** (the component options object). Named exports (export const/function) → move to a sibling `.js` file.
- No attributes on any SFC block: no `lang`, no `<style scoped>`, no `<script setup>`. Component styles are plain global CSS in `<style>` blocks or sibling `index.css` (semantic class names).
- Do NOT write the literal text `</template>` inside the template (including HTML comments) — it breaks block splitting.
- Element Plus `el-*` components are globally registered (auto `app.use(ElementPlus)`) — use them in templates directly, no imports. Only imperative APIs are imported (see Import contract).
- Components used in a template must be locally registered: `components: { HeaderBar, DeviceTable }` + import.

### Component Specs

Element Plus component design specs live in `references/component/{Name}.md` — read them before using a component when present. **When a spec is absent, follow `references/design_system.md` + standard Element Plus 2.13.5 API.**

Beyond Element Plus, the skill ships built-in components: `<Icon>` (Lucide icons), `<Chart>` (echarts wrapper with ICT palette + dark-mode sync), `<IpInput>` (IP / IPv6 / MAC segmented input, `v-model`).

Forms are the exception: `el-form` / `el-form-item` are banned. Write forms as H5 (`<label>` + control + error text) following the layout/spacing/token rules in `references/design_system.md` until `references/component/Form.md` is available.

### Import contract (ES Modules, build-time bundled)

Supported — write **standard ES Module imports**; the bundler maps them to runtime globals:

```js
import { ref, computed, watch, onMounted, reactive } from "vue";        // → Vue globals
import { ElMessage, ElNotification, ElMessageBox } from "element-plus"; // → ElementPlus globals (imperative APIs)
import dayjs from "dayjs";                                             // → global dayjs (EP bundled instance, plugins registered)
import { createI18n, useI18n } from "vue-i18n";                        // → VueI18n global (optional, multilingual pages)
import zhCn from "./assets/shared/element-zh.js";                      // zh-cn locale (dayjs + EP dual registration)
import { Icon } from "./assets/shared/icon.js";                        // Lucide icon component
import Chart from "./assets/shared/chart.js";                          // echarts wrapper (ICT palette)
import IpInput from "./assets/shared/ip-input.js";                     // IP / IPv6 / MAC segmented input
import { useApp, toggleDark } from "./src/context.js";                 // relative imports for own modules
import DeviceTable from "./src/views/device-table/index.vue";          // component import
import "./src/views/device-table/index.css";                           // component CSS (optional)
```

NOT supported:
- `import * as` and aliased imports (`{ a as b }`)
- default imports from `vue` / `element-plus` / `vue-i18n` (named imports only)
- npm packages beyond vue/element-plus/dayjs/vue-i18n/echarts
- importing asset files (`.svg` / `.png` / `.jpg` / etc.) — use runtime path strings (e.g. `<img src="./assets/uploads/x.png" />`) instead
- `import ... from "@element-plus/icons-vue"` is **banned**; page icons are Lucide-only via `<Icon name="..." />`
- Page entry file must be `app.vue` default-exporting the root component options
- Relative imports must include file extensions (`./src/views/device-table/index.vue`, no omitting `.vue`/`.js`/`.css`)
- Banned Element Plus components: `ElContainer` `ElHeader` `ElAside` `ElFooter` `ElMain` `ElRow` `ElCol` `ElCard` `ElSpace` `ElSkeleton` `ElDescriptions` `ElResult` `ElAvatar` `ElImage` `ElCalendar` `ElTour` `ElStatistic` `ElAffix` `ElTransfer` `ElPopconfirm` `ElText` `ElMention` `ElSplitter` `ElWatermark` `ElIcon` `ElForm` `ElFormItem` `ElAutocomplete` `ElUpload` `ElAlert` (kebab-case tags included). If needed, use pure H5 or existing component combinations instead.

### Icon usage

Lucide names only (`<Icon name="search" size="0.875rem" />`), **never hand-write SVG paths**, **never use @element-plus/icons-vue**. `size` is a rem **string** (numbers → WARN); `color` must be 6-digit hex (icon-plus matches by hex value). Build validates and injects icons on demand.

### Charts

Use `<Chart :option="..." />` (`import Chart from "./assets/shared/chart.js"`) — a thin wrapper over echarts (SVG renderer). `option` is a **standard echarts option**; the wrapper injects the ICT palette (`--color-chart-*` tokens, auto-flips in dark mode) plus token-driven text/axis/tooltip defaults — your option overrides them.

- Declare legends/axes/units in `option` as usual echarts practice; keep per-category color mapping consistent across charts.
- Charts fill their container (100% × 100%) — **the parent must have an explicit height** (fixed px card or flex-fill area), or set `style="height: x rem"` directly.
- Dark mode is automatic (token re-read + rebuild on `.dark`).
- **Card stability (CRITICAL)** — elastic chart layouts without a definite height in the chain (height purely from stretch allocation) MUST cut both feedback channels: column flex container `flex: 1 1 0` (never `1 1 auto`) + `min-height: 0` / fixed rem / `overflow: hidden` (never the default `auto`); chart wrapper `flex: 1` + `minHeight: 0` (or fixed rem), `minWidth: 0`.
- Hidden containers (el-tabs / el-collapse panes) init at 0×0 but self-heal via ResizeObserver — no conditional rendering needed.

### Internationalization

**Default: single-language (zh-CN), already configured in the starter** — `app.vue` imports `element-zh.js` (registers zh-cn on both the global dayjs and EP's built-in dayjs) and wraps `<el-config-provider :locale="zhCn">`. No extra work needed for Chinese pages.

**Gate: do NOT create `src/i18n.js`, `createI18n`, or language-switch UI unless the user explicitly requests multilingual support.**

When multilingual is required, use vue-i18n (bundled offline, `import ... from "vue-i18n"` auto-maps to the `VueI18n` global):

1. **Dictionary + instance**: create `src/i18n.js` — central dictionary with semantic keys, default-export a `createI18n` instance. The build auto-installs it (`app.use(i18n)`) when the module exists:
   ```js
   import { createI18n } from "vue-i18n";
   const messages = {
     zh: { menu: { devices: "设备管理" } },
     en: { menu: { devices: "Devices" } },
   };
   const i18n = createI18n({ legacy: false, locale: "zh", fallbackLocale: "zh", messages });
   export default i18n;
   ```
2. **Usage**: `const { t } = useI18n();` in any component's `setup()` (add `t` to the returned object) → `{{ t("menu.devices") }}`.
3. **Language switch sync**: `i18n.global.locale.value = lang` + `<el-config-provider :locale="lang === 'zh' ? zhCn : en">` + `dayjs.locale(lang === "zh" ? "zh-cn" : "en")`. Keep the current `lang` in `src/context.js` state so one switcher drives all three together.

### Styling — token-first (CRITICAL)

1. **Read `references/design_system.md`** for tokens and visual rules.
2. Custom styles go in the component's `<style>` block or `index.css` with semantic class names.
   - Colors/fonts/shadows/radius/spacing prefer **tokens**; hardcoded hex or px only when the requirement specifies an exact value.
3. Dark mode single-track (CRITICAL): **Do NOT use EP's dark CSS vars or component-state theme switching.** `src/context.js`'s store toggles `<html>`'s `.dark` class — H5 elements flip via tokens; Element Plus components via the shared `assets/style/element/` skin folder.
   - Do NOT define bare `:root` / `.dark` selectors (without a descendant suffix) — global tokens already live in `assets/style/`
   - Per-mode values that tokens can't express (custom colors, images, gradients): base rule = light value, dark value via `.dark .yourComponentRoot { ... }` descendant override
4. Do NOT create page-level Element Plus override styles. EP component skinning and visual gaps go into `assets/style/element/{component}.css` (one file per EP component; files in that folder are auto-loaded — `base.css` first, then the rest alphabetically) — single source, all pages benefit.
5. Link-style actions (clickable text, e.g. table data cell links, card header actions, form auxiliary links, help links, inline text links) use `<a>` + `var(--interactive-link)` + `cursor: pointer` — NOT `<el-button link>`.

### Content Guidelines

1. **Generative Expansion**: build dense data — mock realistic content, include CTAs, search/filter, status tags.
2. **Mock data**:
   - Use semantic keys (`hotelName`, not `val1`);
   - Main list/table ≥20 items with diverse statuses;
   - secondary lists ≥5 items.
   - Image assets: avatars: `./assets/uploads/user.png`; backgrounds: `./assets/uploads/background.jpg`; general images: `./assets/uploads/image.jpg`.

## Step 3 — Build (MANDATORY)

```
node scripts/build.mjs --dir "{SCAFFOLD_DIR}"
```

- `build.mjs` bundles all page source modules into one self-running `index.page.html` (local UMD libraries + four-layer token CSS + `element/` skin folder + Lucide icons; templates compiled in-browser by the Vue full build — no Babel).
- **WARN**: unknown icon names, hardcoded hex — safe to ignore.
- **FAIL**: read the error, fix the source, re-run `build.mjs`.

## Step 4 — Verify (MANDATORY)

```
node scripts/verify-build.mjs --dir "{SCAFFOLD_DIR}"
```

- `verify-build.mjs` headlessly loads the same local libraries in Node, mounts the app against a stub DOM, and asserts `createApp(...).use(ElementPlus).mount("#root")` executed exactly once — catching template syntax errors, setup/render failures, and unknown-token CSS before opening a browser.
- **Success**: `OK index.page.html verified`.
- **Failure**: error output points to the source — fix it, then re-run build → verify.

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
- No npm packages beyond vue/element-plus/dayjs/vue-i18n/echarts — see Import contract
- No `@element-plus/icons-vue` — use Lucide Icon — see Import contract
- No `<script setup>`, no `lang`/`scoped` SFC block attributes, SFC script named exports banned — see SFC authoring rules
- Banned Element Plus components: `ElContainer` `ElHeader` `ElAside` `ElFooter` `ElMain` `ElRow` `ElCol` `ElCard` `ElSpace` `ElSkeleton` `ElDescriptions` `ElResult` `ElAvatar` `ElImage` `ElCalendar` `ElTour` `ElStatistic` `ElAffix` `ElTransfer` `ElPopconfirm` `ElText` `ElMention` `ElSplitter` `ElWatermark` `ElIcon` `ElForm` `ElFormItem` `ElAutocomplete` `ElUpload` `ElAlert` — use H5 or existing components when needed — see Import contract
- Page entry must be `app.vue` with `export default { ... }` (root component options) — see Import contract
- Relative imports must include file extensions (`.vue`/`.js`/`.css`) — see Import contract
- No bare `:root`/`.dark` selectors in component CSS — see Styling rule 3
- No page-level Element Plus override CSS — see Styling rule 4
- No EP dark-theme CSS vars or component-state theme switching — see Styling rule 3
- No inventing Element Plus props — use standard Element Plus 2.13.5 API; follow `references/design_system.md` and `references/component/{Name}.md` (when present)
- No stretch-only elastic chart layout without the height-feedback loop cuts — see Charts

---

## Quality Checklist (Self-Verify Before Output)

1. build `OK` + verify `OK index.page.html verified`
2. app.vue: root component `export default { ... }` with `<el-config-provider :locale="zhCn">`
3. Mock data complete (row count, status diversity, semantic keys)
4. Every `setup()` explicitly returns everything the template uses
5. `<artifact>` link output

## References

- **[references/design_system.md](references/design_system.md)** — Design tokens (with usage notes), elevation, layout, brand quality
- **[references/component/](references/component/)** — Component design specs (usage rules, Don'ts). Read on demand; API follows Element Plus 2.13.5. **Specs are being authored incrementally — when a spec is absent, follow design_system.md + standard EP API.**
