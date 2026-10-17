# Icon Component

Default use **Lucide icon name** (`name` prop); only when the user explicitly provides image files, use `src` prop.

## Usage

```jsx
import { Icon } from "../../assets/shared/icon.jsx";

<Icon name="chevron-down" size="1rem" color="#0067D1" className="chev"/>

const item = { icon: "home", label: "首页" };
<Icon name={item.icon} size="1.25rem" />

let open = true;
<Icon name={open ? "chevron-up" : "chevron-down"} />

<Icon src="./assets/uploads/logo.svg" size="2rem" />

<Icon name="trash-2" size="1rem" title="Delete" onClick={() => del(row.id)} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | — | Lucide icon name (kebab-case) |
| `src` | string | — | User-provided image path (svg/png/jpg); overrides `name` when both are set |
| `size` | string \| number | `"1rem"` | Icon size — rem string required (see Size scale below); numbers are auto-converted but log a WARN |
| `color` | string | `currentColor` | Icon stroke color (name mode only) |
| `className` | string | `""` | CSS class (margin/hover effects belong here) |
| `style` | object | — | Inline styles |
| `id` | string | — | DOM element id |
| `strokeWidth` | number | `2` | Stroke width (name mode only) |
| `variant` | string | `"lined"` | Icon style: `lined` / `filled` / `two-tone` / `circle` / `square` |
| `onClick` | function | — | Click handler (adds `cursor: pointer`) |
| `title` | string | — | Tooltip title |

## Size scale

`size` uses **rem strings** (scale with viewport). **Use ONLY the recommended sizes below** — never non-scale values like 13 or 22. px↔rem mapping (at 1920 baseline, 1rem = 16px):

| px | rem | |
|----|-----|--|
| 12 | `size="0.75rem"` | dense inline icons, legends |
| 14 | `size="0.875rem"` | inside buttons/inputs/menus (matches body text) |
| 16 | `size="1rem"` | default, standalone icons |
| 20 | `size="1.25rem"` | emphasized actions |
| 24 | `size="1.5rem"` | large feature icons |
| 32 | `size="2rem"` | illustrative |
| 36 | `size="2.25rem"` | |
| 40 | `size="2.5rem"` | |
| 48 | `size="3rem"` | |
| 60 | `size="3.75rem"` | empty-state art |

## Lucide name mode (`name`)

The default mode — prefer it unless the user explicitly provides asset files.

1. **Use real Lucide icon names only** — exactly as they exist in the Lucide icon set (kebab-case: `chevron-down`, `shopping-cart`, `circle-check`). Never invent, guess-spell, or pluralize names.
2. **Never hand-write SVG path data** — the Icon component renders Lucide nodes; hand-written paths will not render.
3. **camelCase is auto-converted** — `chevronDown` → `chevron-down`, but prefer kebab-case.
4. **Passing variables is fine** — `name="close"`, `name={item.icon}`, `name={cond ? "a" : "b"}` all work; Runtime-assembled names (`` `${type}-icon` ``) cannot be extracted and will render nothing.
5. Unsure about a name? Rely on your Lucide knowledge or check https://lucide.dev/icons.
6. **Do NOT use legacy (renamed) icon names** — some old Lucide names no longer exist: `bar-chart-3` → `chart-column`, `more-horizontal` → `ellipsis`, `check-circle-2` → `circle-check-big`. Use the current names.

## src mode (`src`)

Only when the user explicitly requires their own images (svg/png/jpg). Place them into `{artifact-folder}/preview/assets/uploads/` — the path resolves from the scaffold root:

1. `<Icon src="./assets/uploads/logo.svg" size="2rem" />`
2. `<img src="./assets/uploads/banner.png" />`
