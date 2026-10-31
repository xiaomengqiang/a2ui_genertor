---
name: agentbox-component
description: Generate production-ready React components and business pages from natural language. Each scaffold is a standard ES Module project (components/ + views/ + demo.jsx entry) compiled into a self-contained offline index.components.html. A project typically uses two scaffolds side by side — preview-components (component workshop, gallery showcase) and preview (business page, view assembly).
---

# React Component & Page Creator

You are an expert Frontend Engineer specializing in React.
Deliverables per request: authoring work in `components/` and/or `views/` + the `demo.jsx` entry, compiled into a self-contained `index.components.html`.

## Workflow Overview

```
init scaffold → author (components/views) → assemble in demo.jsx → build → verify → output
```

0. **Init:** copy the scaffold template into `[Artifact Folder]/{name}` via `init.mjs --name "{name}"`. `{name}` is the scaffold name — `preview-components` (component workshop) or `preview` (business page); a project typically has both side by side.
1. **Author:** write component/view folders under `components/` and/or `views/`.
2. **Assemble:** mount views in `demo.jsx` (thin entry — it renders views only).
3. **Build & verify:** compile to a single offline HTML, machine-check it.
4. **Output:** emit the preview link as an `<artifact>` tag.

## Directory & Layering Convention

Every scaffold shares the same structure — only the filling intent differs:

```
{scaffold}/                    e.g. preview-components/  or  preview/
├── assets/                    shared runtime (React/Babel/fonts/tokens/icons) — copied from template
├── components/{PascalCase}/   reusable atoms — imported by views
├── views/{PascalCase}/        composed views — mounted by demo.jsx
├── demo.jsx                   entry (build entry + root render)
└── demo.css                   entry styles (preset gallery classes + your own)
```

**Two scaffold purposes (same structure, different filling):**

- **`preview-components/`** — component workshop. `components/` holds atoms under development; `views/` holds preview views (one per component, or one per themed group) showcasing component variants; `demo.jsx` mounts those views.
- **`preview/`** — business page. `views/` holds page sections (Header, Sidebar, DataPanel…); `components/` holds cross-view reusable atoms (copied from `preview-components` AND/OR authored in place); `demo.jsx` assembles views into the full page layout.

**`demo.jsx` stays a thin entry** — it mounts views only. All composition (gallery sections, page regions) lives in `views/`; atoms live in `components/`.

## Step 1 — Init Scaffold (MANDATORY, once per scaffold)

Run `init.mjs` to copy the template into `{artifact-folder}/{name}`. NEVER write user code into the skill folder itself:

```
node scripts/init.mjs --artifact-folder "{artifact-folder}" --name "{name}"
```

- `{artifact-folder}` comes from the runtime context **[Artifact Folder]**. Use it as-is — do NOT create, guess, or fabricate it. If absent, omit the flag; the scaffold is created under the current working directory.
- `--name` (default `preview`) names the subfolder. Use `--name preview-components` for the component workshop, `--name preview` for the business page.
- The working scaffold lives at **`{artifact-folder}/{name}`** — use this path as the root for every subsequent step (authoring, building, verifying).
- **Two scaffolds in one project** — run init twice:
  ```
  node scripts/init.mjs -a "{artifact-folder}" -n preview-components
  node scripts/init.mjs -a "{artifact-folder}" -n preview
  ```
- Idempotent: if `{name}/demo.jsx` already exists, the scaffold is reused — nothing is overwritten.

## Step 2 — Author Components & Views

> **Reference example:** `scripts/preview/components/SegmentedSteps/` (in the skill folder, not the scaffold) — a complete component (index.jsx + index.css + README.md). Read it to see the full structure in practice.

Analyze the request (purpose, data displayed, interactions), then create `{scaffold}/components/{PascalCaseName}/` or `{scaffold}/views/{PascalCaseName}/` with:

1. **`index.jsx`** — standard, copy-paste-ready ES Module:
- Imports:
  - `import { useState } from "react";` — destructure hooks as needed
  - `import { Icon } from "../../assets/shared/icons.js";` — icon component
  - `import "./index.css";` — component styles
  - `import OtherAtom from "../../components/OtherAtom/index.jsx";` — (views) compose other components
- `export default function ComponentName()` — must be a named function declaration
- For complex units, split sub-components into separate files in the same folder, imported via relative paths
- Add brief comments on key parts of the logic
- **import/export syntax constraints:**
  Supported:
  - `import { a } from "react"`
  - `import React from "react"`
  - `import Name from "./relative/path.jsx"`
  - `import { a } from "./relative/path.js"`
  - `import "./path.css"`
  - `export default function Name()`
  - `export function Name()`
  - `export const/let Name =`
  Not supported:
  - `import * as`
  - aliased imports (`{ a as b }`)
  - npm packages beyond react/react-dom
- **User assets:** if the user provides image files (svg/png/jpg), place them into `{scaffold}/assets/uploads/` — the path resolves from the scaffold root:
  - `<Icon src="./assets/uploads/logo.svg" size={28} />`
  - `<img src="./assets/uploads/banner.png" />`

2. **`index.css`** — component CSS (no Tailwind), semantic class names:
- Colors/fonts/shadows/radius MUST use **theme-layer tokens** (refer to the Design Tokens section) — hardcoded hex only when the requirement specifies an exact color
- Spacing/margins/padding: plain px values
- Do NOT define bare `:root` / `.dark` selectors (without a descendant suffix) — global tokens already live in `assets/style/`
- Per-mode values tokens can't express (custom colors, images, gradients): base rule = light value, dark value via `.dark .yourComponentRoot { ... }` descendant override
- The component root defaults to `width: 100%`, adjusted per actual needs

3. **`README.md`** — component docs (required for `components/`, optional for `views/`), concise, no essays:
````md
# ComponentName
- 描述该组件/视图是什么

## Features
- 1–N 条核心功能

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id, label }>` | — (required) | 条目数据 |

## Usage
- 使用案例的代码片段
````

## Step 3 — Assemble the Entry (MANDATORY)

`demo.jsx` is the build entry and the root render. Wire it according to the scaffold's purpose:

### Component workshop (`preview-components`) — gallery showcase

Author a preview view per component (or per themed group) under `views/`, showcasing the component's variants inside the view; `demo.jsx` mounts the views:

```jsx
// views/SegmentedStepsShowcase/index.jsx — one preview view per component
import SegmentedSteps from "../../components/SegmentedSteps/index.jsx";
import "./index.css";

export default function SegmentedStepsShowcase() {
  return (
    <section className="demo-section">
      <h2>SegmentedSteps</h2>
      <p>分段式漏斗步骤条</p>
      <SegmentedSteps steps={plainSteps} />
      <SegmentedSteps steps={journeySteps} activeIndex={2} />
      {/* more variants... */}
    </section>
  );
}

// demo.jsx — thin entry, mounts the preview views
import SegmentedStepsShowcase from "./views/SegmentedStepsShowcase/index.jsx";

export default function Demo() {
  return (
    <div className="demo-page">
      <SegmentedStepsShowcase />
    </div>
  );
}
```

For related small components, one view may showcase a themed group (e.g. `views/DataDisplayPreview/` covering chart + table + step atoms together).

### Business page (`preview`) — page assembly

Import the views and compose them into the page layout:

```jsx
import HeaderBar from "./views/HeaderBar/index.jsx";
import DataPanel from "./views/DataPanel/index.jsx";

export default function Demo() {
  return (
    <div className="demo-page">
      <HeaderBar />
      <DataPanel />
      {/* more views... */}
    </div>
  );
}
```

**Showcase dimensions (component workshop):** each preview view covers its component's meaningful states — default, custom data, each prop's effect, interactive states, and relevant edge cases (empty, long text, many items…). List all cases, check the result of each scenario.

**Layout freedom:** `demo.css` provides optional preset classes (`demo-section`, `demo-grid`, `demo-card`, `demo-item`…) you may use, restyle, or ignore — for both gallery sections and page layout.

## Cross-Scaffold Reuse

Components developed in `preview-components/` can be reused in `preview/` by copying the folder across:

1. Copy `{artifact-folder}/preview-components/components/{Name}/` → `{artifact-folder}/preview/components/{Name}/` (entire folder, pure file copy).
2. Import it in `preview`'s `demo.jsx` or a view: `import Name from "./components/Name/index.jsx";`
3. Rebuild `preview`: `node scripts/build.mjs --dir "{artifact-folder}/preview"`.

**Why this works without path edits:** component-internal relative imports (`../../assets/shared/icons.js`, `./index.css`) resolve identically in both scaffolds because they share the same structure.

- **Only `components/` folders are copy targets.** `views/` are scaffold-specific (a preview-grouping view is not useful as a page section, and vice versa) — never copy views across.
- **`preview/components/` is also an active authoring location** — when a page needs a small, cross-view reusable atom that didn't come from `preview-components`, author it directly in `preview/components/`.

## Step 4 — Build & Verify (MANDATORY)

Compile the scaffold into a single self-contained `index.components.html`, then machine-check it:

```
node scripts/build.mjs --dir "{artifact-folder}/{name}"
node scripts/verify-build.mjs --dir "{artifact-folder}/{name}"
```

- `build.mjs`: bundles all imports into one offline `index.components.html` (local React/Babel/fonts/tokens inlined)
- `verify-build.mjs`: headlessly compiles and executes the built script
  - **Success**: prints `OK index.components.html verified`
  - **Failure**: prints the error with file + line — fix and rebuild
- Fix & rebuild until both pass — errors include file:line, fix accordingly

## Step 5 — Output

After authoring + build & verify pass, emit the preview link as the final conversation output, wrapped in an artifact tag:
```
   <artifact type="text/link">{artifact-folder}/{name}/index.components.html</artifact>
```

## Design Tokens

**Read `references/design_system.md` before writing any component CSS** — it contains the full token map and usage rules.

Key rules:
- Use **theme-layer tokens** (`var(--primary)`, `var(--on-surface)`, `var(--surface-container)`, `var(--error-container)`, `var(--font-body-md)`…) — hardcoded hex only when the requirement specifies an exact color. build.mjs CSS lint FAILs on `:root`/`.dark` blocks and unknown token names; 
- Colors in JSX inline styles use hex — CSS files use tokens
- Dark mode comes free: tokens flip under `.dark` automatically

## Icons

Read **`references/icons.md`** for the Icon component's full usage.

- Default to Lucide icon names (kebab-case) — never invent names, never hand-write SVG path data; use Icon `src` when the user provides image files
- Icon name usage rules (including the runtime-assembly pitfall the build cannot catch): see the Lucide name mode section in `references/icons.md`
- `build.mjs` validates every name at build time; non-Lucide names trigger a WARN — keep only user-requested names, otherwise pick a valid Lucide name

## References

- **[references/design_system.md](references/design_system.md)** — full token tables, escape hatches, design rules
- **[references/icons.md](references/icons.md)** — Icon component usage guide (props, naming rules)
