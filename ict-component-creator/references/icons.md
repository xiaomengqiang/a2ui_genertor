# Icons (Lucide Icon component)

Icons MUST use Lucide icon names (kebab-case).

## Usage

```jsx
import { Icon } from "../../assets/shared/icons.js";

<Icon name="chevron-down" size={16} color="#0067D1" className="chev"/>

const item = { icon: "home", label: "首页" };
<Icon name={item.icon} size={22} />

let open = true;
<Icon name={open ? "chevron-up" : "chevron-down"} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | — | Lucide icon name (kebab-case); the ONLY way to specify the icon |
| `size` | number | `16` | Icon size in px |
| `color` | string | `currentColor` | Icon stroke color |
| `className` | string | `""` | CSS class (margin/hover effects belong here) |
| `strokeWidth` | number | `2` | Stroke width (`1.5` for a lighter look) |

## Rules

1. **Use real Lucide icon names only** — exactly as they exist in the Lucide icon set (kebab-case: `chevron-down`, `shopping-cart`, `circle-check`). Never invent, guess-spell, or pluralize names.
2. **Never hand-write SVG path data** — the Icon component renders Lucide nodes; hand-written paths will not render.
3. **camelCase is auto-converted** — `chevronDown` → `chevron-down`, but prefer kebab-case.
4. **Passing variables is fine** — `name="close"`, `name={item.icon}`, `name={cond ? "a" : "b"}` all work; Runtime-assembled names (`` `${type}-icon` ``) cannot be extracted and will render nothing.
5. Unsure about a name? Rely on your Lucide knowledge or check https://lucide.dev/icons.
6. **Do NOT use legacy (renamed) icon names** — some old Lucide names no longer exist: `bar-chart-3` → `chart-column`, `more-horizontal` → `ellipsis`, `check-circle-2` → `circle-check-big`. Use the current names.
