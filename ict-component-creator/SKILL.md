---
name: ict-component-creator
description: Generate a production-ready React component from a natural language description. Outputs a component folder (containing index.jsx + index.css) and a lightweight HTML preview entry that renders the component in-browser via Babel standalone — no build step required.
---

# ICT React Component Generator

You are an expert Frontend Engineer specializing in React + Tailwind CSS.
Your output is a **component folder** containing `index.jsx` (component logic) and `index.css` (component styles), plus an updated `index.html` preview entry that loads and renders the component.

## Architecture

```
preview/
├── serve.cjs                        # Zero-dependency static server + HTML inliner
├── index.html                       # AUTO-GENERATED — do not edit (inlined by serve.cjs)
├── assets/
│   ├── icons.js                     # Shared Icon component + ICONS dictionary
│   └── tokens.css                   # Global design tokens (:root CSS variables)
└── components/
    └── ComponentName/              # ← Generated component folder (PascalCase name)
        ├── index.jsx                # ← Component JSX logic (no imports/exports)
        └── index.css                # ← Component-specific CSS
```

**serve.cjs** is the entry point. When you run `node serve.cjs`:
1. It scans `components/` for a folder containing `index.jsx`
2. Reads `index.jsx` + `index.css` + `assets/icons.js`
3. Inlines ALL content into a single self-contained `index.html` (CSS in `<style>`, icons + JSX in `<script>`)
4. Serves it at `http://localhost:3000` AND writes the static `index.html` to disk
5. Because everything is inlined, you can also double-click `index.html` directly — no CORS issues

The component's `index.jsx`:
- Uses `const { useState } = React;` (NO import statements)
- Uses `Icon` and `ICONS` from the global scope
- NO `export`/`module.exports` — just define the function, `serve.cjs` appends the render call
- `serve.cjs` auto-appends: `ReactDOM.createRoot(...).render(React.createElement(ComponentName))`

The component's `index.css`:
- Contains all custom CSS classes used by the component
- Uses plain CSS
- **MUST use `var(--color-*)`, `var(--shadow-*)`, `var(--radius-*)` tokens** from the global `assets/tokens.css` — see "Design System Color Tokens" section below
- Do NOT include the `:root` block in component CSS — it is already defined globally in `assets/tokens.css` and loaded via `index.html`
- Inlined into `<style>` tag in the generated HTML

## Session Context Caching (CRITICAL for speed)

Within the same conversation session, reference files you have **already read remain in your context**. To maximize speed:

1. **NEVER re-read** a file you have already read in this session.
2. **Design tokens:** `references/design_system.md` — read once per session.
3. **Component patterns:** `references/component_patterns.md` — read once per session.
4. **Examples:** `references/examples.md` — read once per session.
5. **Lucide icons:** `references/icons.md` — only read if you need icons not in the pre-built ICONS dictionary.

## Design System Color Tokens (MANDATORY)

When writing `index.css`, you **MUST** use the exact color values from `references/design_system.md`. Do NOT invent or approximate colors — use the `var(--*)` tokens below.

### CSS Custom Properties (already defined globally in `assets/tokens.css`)

These CSS variables are already defined in `preview/assets/tokens.css` and loaded globally via `index.html`. **Do NOT repeat them in component CSS** — just reference `var(--color-*)`, `var(--shadow-*)`, `var(--radius-*)` directly in your component rules.

```css
:root {
  /* Brand / Primary */
  --color-primary: #0067D1;
  --color-primary-hover: #0050A8;
  --color-primary-active: #004EA8;
  --color-primary-light: #EEF3FE;

  /* Surface */
  --color-surface: #F3F3F3;
  --color-surface-bright: #FFFFFF;
  --color-surface-container: #FFFFFF;
  --color-on-surface: #191919;
  --color-on-surface-variant: #777777;

  /* Semantic States — main + container pairs */
  --color-error: #E02128;
  --color-error-container: #FEE7E8;
  --color-success: #09AA71;
  --color-success-container: #E7FBF2;
  --color-warning: #FCC800;
  --color-warning-container: #FEFCE0;
  --color-critical: #F4840C;
  --color-critical-container: #FEF5E8;
  --color-info: #2070F3;
  --color-info-container: #EEF3FE;

  /* Neutral */
  --color-outline: #C9C9C9;
  --color-outline-variant: #DFDFDF;
  --color-divider: #DFDFDF;
  --color-content-placeholder: #AEAEAE;
  --color-content-disabled: #C9C9C9;

  /* Shadow */
  --shadow-card: 0px 1px 6px 0 rgba(0, 0, 0, 0.08);
  --shadow-base: 0 4px 12px 0 rgba(0, 0, 0, 0.16);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-popover: 0 8px 24px 0 rgba(0, 0, 0, 0.16);
  --shadow-modal: 0 16px 48px 0 rgba(0, 0, 0, 0.16);

  /* Border Radius */
  --radius-xs: 2px;
  --radius-base: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```

### Usage Rules

1. **Always reference variables:** Use `color: var(--color-on-surface);` instead of hardcoding `#191919`. Use the variable name, not the hex value, in component CSS rules.
2. **No invented colors:** If you need a color that's not in the design system, pick the closest semantic token. Do NOT use arbitrary hex values like `#3B82F6` or `#333`.
3. **Hover/active states:** Use `--color-primary-hover` and `--color-primary-active` for interactive elements — do not lighten/darken colors manually.
4. **Semantic containers:** For badges, alerts, and tags, pair the main color with its container variant (e.g., text `--color-error` on background `--color-error-container`).
5. **Borders vs shadows:** Per design rule, use EITHER `border: 1px solid var(--color-outline)` OR `box-shadow: var(--shadow-card)` — never both on the same element.
6. **Placeholder text:** Use `color: var(--color-content-placeholder);` for `::placeholder` styles.
7. **Disabled state:** Use `color: var(--color-content-disabled);` and `background: var(--color-surface);` for disabled elements.

### Quick Reference — Color to Token Map

| You want… | Use |
|---|---|
| Primary text | `var(--color-on-surface)` → `#191919` |
| Secondary/label text | `var(--color-on-surface-variant)` → `#777777` |
| Page background | `var(--color-surface)` → `#F3F3F3` |
| Card/panel background | `var(--color-surface-bright)` → `#FFFFFF` |
| Primary button bg | `var(--color-primary)` → `#0067D1` |
| Primary button hover | `var(--color-primary-hover)` → `#0050A8` |
| Primary button active | `var(--color-primary-active)` → `#004EA8` |
| Light badge bg | `var(--color-primary-light)` → `#EEF3FE` |
| Border / divider | `var(--color-outline)` or `var(--color-outline-variant)` → `#C9C9C9` / `#DFDFDF` |
| Error state | text `--color-error` `#E02128` + bg `--color-error-container` `#FEE7E8` |
| Success state | text `--color-success` `#09AA71` + bg `--color-success-container` `#E7FBF2` |
| Warning state | text `--color-warning` `#FCC800` + bg `--color-warning-container` `#FEFCE0` |
| Critical/alert state | text `--color-critical` `#F4840C` + bg `--color-critical-container` `#FEF5E8` |
| Info state | text `--color-info` `#2070F3` + bg `--color-info-container` `#EEF3FE` |

## Tech Stack

- **React 18** (UMD build via CDN)
- **Babel Standalone** (compiles JSX in-browser)
- **Plain CSS** (component-specific `.css` file, no Tailwind in browser runtime)
- **Lucide icons** via inline SVG (`Icon` component + `ICONS` dictionary in `assets/icons.js`)
- **No npm, no Vite, no Node build** — `serve.cjs` is a zero-dependency static file server

## How to Use This Skill

### Step 1 — Analyze Intent

Determine:
- What the component does (purpose, scenario)
- What data it displays or collects
- What interactions it supports
- Whether it's a standalone block or part of a larger page

### Step 2 — Generative Expansion

NEVER output a sparse UI. Elevate to production quality:
1. **Full mock data:** Inject realistic text, numbers, avatars, descriptions.
2. **Interactive states:** Hover effects, active states, transitions.
3. **Visual hierarchy:** Clear primary/secondary content, proper spacing, shadows.
4. **Responsive layout:** Flexbox/Grid, adapt to widths.
5. **Accessibility:** Semantic HTML, ARIA labels where needed.

### Step 3 — Component Design

1. **Component folder:** Create a folder under `preview/components/{PascalCaseName}/`.
2. **Two files:** `index.jsx` (logic) and `index.css` (styles).
3. **No imports:** Use `const { useState } = React;` at top of `index.jsx`.
4. **Use globals:** `Icon` and `ICONS` are available globally (from `assets/icons.js`).
5. **No TypeScript:** Plain JavaScript JSX.
6. **No export/import:** Do NOT use `import`, `export`, or `module.exports`. Just define the function — `serve.cjs` will inline it and add the render call automatically.
7. **Plain CSS with design tokens:** Write all custom styles in `index.css`. Use semantic class names (not Tailwind). Use `var(--color-*)`, `var(--shadow-*)`, `var(--radius-*)` tokens from the global `assets/tokens.css` throughout — never hardcode hex values in component CSS rules. **Do NOT include the `:root` block** — it is already defined globally in `assets/tokens.css` and loaded via `index.html`.
8. **Icons:** Use `<Icon paths={ICONS.iconName} size={16} />` pattern.
9. **Mock images:** `https://randomuser.me/api/portraits/{men|women}/{1-99}.jpg` for avatars.
10. **PascalCase:** Component names MUST be PascalCase.

### Step 4 — Code Quality Rules

1. **No comments** unless absolutely necessary.
2. **No `console.log`** or debug statements.
3. **No `import`/`export`/`module.exports` statements.**
4. **No TypeScript** type annotations.
5. **Consistent formatting:** 2-space indent, double quotes.
6. **List rendering:** `.map()` with proper `key` props.

### Step 5 — Save & Preview (MANDATORY)

1. **Write `index.jsx`:** Write to `preview/components/{ComponentName}/index.jsx`.
   - The file should contain ONLY the component code (useState, mock data, sub-components, main function).
   - Do NOT add render calls or exports — `serve.cjs` handles that.
2. **Write `index.css`:** Write to `preview/components/{ComponentName}/index.css`.
3. **Run the server:** `cd preview && node serve.cjs`
   - `serve.cjs` auto-discovers the component folder, reads `index.jsx` + `index.css` + `assets/icons.js`, inlines them into a single HTML, and serves it.
   - It also writes a static `index.html` to disk so you can double-click it directly (`file://` protocol also works — no CORS issues because everything is inlined).
4. **Verify:** Open `http://localhost:3000` OR double-click `preview/index.html` to see the rendered component.

## Available Icons

The `ICONS` dictionary in `assets/icons.js` contains these icon keys:
search, plus, trash, download, check, x, heart, copy, upload, settings, arrowRight, arrowLeft, chevronDown, chevronRight, chevronLeft, chevronUp, loader, user, users, bell, mail, lock, eye, eyeOff, calendar, mapPin, share, moreHorizontal, star, edit, filter, trendingUp, trendingDown, dollar, clock, message, folder, grid, inbox, zap, sparkles, github, play, pause, phone, gift, tag, shield, package, truck

Usage: `<Icon paths={ICONS.heart} size={16} className="some-class" />`

If you need an icon not listed above, add the SVG path data to the `ICONS` dictionary in `assets/icons.js`.

## index.html — Auto-Generated by serve.cjs

**You do NOT need to write or edit `index.html`.** The `serve.cjs` script automatically:
1. Scans `components/` for a folder with `index.jsx`
2. Reads the `.jsx` (component code), `.css` (styles), and `assets/icons.js` (Icon + ICONS)
3. Inlines everything into a single self-contained HTML
4. Serves it at `http://localhost:3000` AND writes a static `index.html` to disk

The generated HTML looks like:

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- React 18 + Babel standalone via CDN -->
    <script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.24.7/babel.min.js"></script>
    <style>/* body + #root base styles */</style>
    <style>/* inlined component CSS */</style>
  </head>
  <body>
    <div id="root">Loading...</div>
    <script>/* inlined icons.js: Icon component + ICONS dict */</script>
    <script type="text/babel" data-presets="react">
      // inlined component JSX code
      // ...
      function ComponentName() { ... }

      // auto-appended render call:
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(React.createElement(ComponentName));
    </script>
  </body>
</html>
```

Everything is inlined — no external file requests — so `file://` protocol works without CORS errors.

## Constraints

1. **Component folder:** Each component is a folder with `index.jsx` + `index.css`.
2. **No npm imports:** React/Icon/ICONS all available as globals.
3. **No TypeScript:** Plain JSX.
4. **Plain CSS with design tokens:** Custom CSS in `index.css`, NOT Tailwind classes. **MUST** use CSS custom properties (`var(--color-*)`) from `references/design_system.md` — no hardcoded hex values in component CSS rules (the `:root` variable definitions are the only place hex values appear).
5. **No API calls:** Mock data only.
6. **PascalCase:** Folder and component names must be PascalCase.
7. **No exports/imports:** Just define the function — `serve.cjs` handles the render call.
8. **Production quality:** Polished, not wireframe.

## Quality Checklist

1. Valid JSX — no syntax errors
2. No `import`/`export`/`module.exports` statements
3. No TypeScript type annotations
4. `const { useState } = React;` at top of `index.jsx`
5. CSS in `index.css` — NO `:root` block needed (global `tokens.css` handles it)
6. All colors/shadows/radii use `var(--*)` tokens — no hardcoded hex in component rules
7. Component folder name matches the function name (PascalCase)
8. Mock data realistic
9. Component responsive
10. Icons via `Icon` + `ICONS`
11. Run `node serve.cjs` to preview

## References

- **[references/design_system.md](references/design_system.md)** — Design tokens, color palette, spacing, shadows
- **[references/component_patterns.md](references/component_patterns.md)** — React component conventions, prop patterns
- **[references/icons.md](references/icons.md)** — Lucide icon name reference
- **[references/examples.md](references/examples.md)** — Full example components
