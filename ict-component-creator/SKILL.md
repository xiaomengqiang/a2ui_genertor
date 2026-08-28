---
name: ict-component-creator
description: Generate production-ready React components from a natural language description. Each component is a standard ES Module folder (index.jsx + index.css + README.md) showcased with its variants in a gallery page, compiled into a self-contained offline index.components.html.
---

# React Component Creator

You are an expert Frontend Engineer specializing in React.
Deliverable per request: a component folder + a showcase section in demo.jsx, compiled into a self-contained `index.components.html`.

## Workflow Overview

```
init scaffold → author components → showcase in demo → build → verify → output
```

0. **Init:** copy the preview scaffold to the user's [Artifact Folder]
1. **Author:** write the component folder + gallery section
2. **Build & verify:** compile to a single offline HTML, machine-check it
3. **Output:** emit the preview link as an `<artifact>` tag

## Step 1 — Init Scaffold (MANDATORY, once per session)

All component work happens in a working scaffold — run `init.mjs` to copy the preview template from the skill into `{artifact-folder}/preview`. NEVER write user components into the skill folder itself:

```
node scripts/init.mjs --artifact-folder "{artifact-folder}"
```

- `{artifact-folder}` comes from the runtime context **[Artifact Folder]** Use it as-is — do NOT create, guess, or fabricate it. If absent, omit the flag and the scaffold is created under the current working directory at `./preview`.
- The actual working scaffold lives at **`{artifact-folder}/preview`** — use this path as the root for every subsequent step (writing components, building, verifying).

## Step 2 — Author the Component

> **Reference example:** `scripts/preview/components/SegmentedSteps/` (in the skill folder, not the scaffold) — a complete component (index.jsx + index.css + README.md). Read it to see the full structure in practice.

Analyze the request (purpose, data displayed, interactions), then create `{artifact-folder}/preview/components/{PascalCaseName}/` with three core files:

1. **`index.jsx`** — standard, copy-paste-ready ES Module:
- Imports:
  - `import { useState } from "react";` — destructure hooks as needed
  - `import { Icon } from "../../assets/shared/icons.js";` — icon component
  - `import "./index.css";` — component styles
- `export default function ComponentName()` — must be a named function declaration
- Sub-components and sub-modules may be split into multiple files in the same folder, accessible via relative imports
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

2. **`index.css`** — component CSS (no Tailwind), semantic class names:
- Colors/fonts/shadows/radius MUST use **theme-layer tokens** (refer to the Design Tokens section) — hardcoded hex only when the requirement specifies an exact color
- Spacing/margins/padding: plain px values
- Do NOT define `:root` or `.dark` blocks — they are already defined globally in `assets/style/`
- The component root defaults to `width: 100%`, adjusted per actual needs

3. **`README.md`** — component docs, concise, no essays:
````md
# ComponentName
- 描述该组件是什么

## Features
- 1–N 条该组件的核心功能

## Props
- 组件属性列表
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id, label }>` | — (required) | 条目数据 |

## Usage
- 组件使用案例的代码片段
````

## Step 3 — Gallery Section (MANDATORY)

Every component gets an import + a showcase section in `{artifact-folder}/preview/demo.jsx`:

```jsx
import ComponentName from "./components/ComponentName/index.jsx";

// inside <Demo />, a dedicated section for the component:
<section className="demo-section">
  <h2>Component name</h2>
  <p>Component purpose</p>
  <ComponentName items={mockItems} />
  {/* more variants... */}
</section>
```

1. **Import:** `import ComponentName from "./components/ComponentName/index.jsx";` at the top of `demo.jsx`.
2. **Showcase dimensions:** cover the component's meaningful states — default, custom data, each prop's effect, interactive states, and relevant edge cases (empty, long text, many items...). List all cases, check the result of each scenario.
3. **Layout freedom:** organize the page as you see fit. `demo.css` provides optional preset classes (`demo-section`, `demo-grid`, `demo-card`, `demo-item`...) you may use, restyle, or ignore — the gallery is a showcase page, not a template.

## Step 4 — Build & Verify (MANDATORY)

Compile the scaffold into a single self-contained `index.components.html`, then machine-check it:

```
node scripts/build.mjs --dir "{artifact-folder}/preview"
node scripts/verify-build.mjs --dir "{artifact-folder}/preview"
```

- `build.mjs`: bundles all imports into one offline `index.components.html` (local React/Babel/fonts/tokens inlined)
- `verify-build.mjs`: headlessly compiles and executes the built script
  - **Success**: prints `OK index.components.html verified`
  - **Failure**: prints the error with file + line — fix and rebuild
- Fix & rebuild until both pass — errors include file:line, fix accordingly

## Step 5 — Output

After component authoring + build & verify pass, emit the preview link as the final conversation output, wrapped in an artifact tag:
```
   <artifact type="text/link">{artifact-folder}/preview/index.components.html</artifact>
```

## Design Tokens

**Read `references/design_system.md` before writing any component CSS** — it contains the full token map and usage rules.

Key rules:
- Use **theme-layer tokens** (`var(--primary)`, `var(--on-surface)`, `var(--surface-container)`, `var(--error-container)`, `var(--text-md)`…) — hardcoded hex only when the requirement specifies an exact color. build.mjs CSS lint FAILs on `:root`/`.dark` blocks and unknown token names; 
- Colors in JSX inline styles use hex — CSS files use tokens
- Dark mode comes free: tokens flip under `.dark` automatically

## Icons

Read **`references/icons.md`** for the Icon component's full usage.

- Icons MUST use Lucide icon names (kebab-case) — never invent names, never hand-write SVG path data
- Icon name usage rules (including the runtime-assembly pitfall the build cannot catch): see `references/icons.md` Rules
- `build.mjs` validates every name at build time; unknown names FAIL the build — fix and rebuild

## References

- **[references/design_system.md](references/design_system.md)** — full token tables, escape hatches, design rules
- **[references/icons.md](references/icons.md)** — Icon component usage guide (props, naming rules)
