# Design System

## Token Architecture (four layers)

| Layer | File | Scope | Role |
|---|---|---|---|
| Primitive | `assets/style/base.css` | `:root` + `.dark` | Raw material: color scales, font sizes/weights/line-heights, radius levels, spacing, border widths |
| Semantic (light) | `assets/style/light.css` | `:root` | `--color-*` role tokens mapped to primitives (default theme) |
| **Theme (AI-facing)** | `assets/style/theme.css` | `:root` | **The layer custom CSS writes against first** — semantic aliases |
| Semantic (dark) | `assets/style/dark.css` | `.dark` | Dark-mode values for the full semantic set — overrides light via cascade order |

**Component CSS uses the THEME layer first.** It is designed around AI-friendly, guessable names with `on-*` pairing conventions. Dark mode is free: any token reference auto-flips under `.dark`. Primitive scales (`var(--brand-50)`, `var(--gray-90)`) are allowed when needed. Hardcoded hex is discouraged but not blocked (build.mjs WARNs).

## Tokens

### Primary / Brand

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | #0067D1 | Primary buttons, links, selected tabs |
| `--on-primary` | #FFFFFF | Text/icons on solid brand fills |
| `--primary-hover` | #2E86DE | Primary button hover |
| `--primary-active` | #004EA8 | Primary button pressed |
| `--primary-disabled` | #8ABEF3 | Primary button disabled |
| `--primary-container` | #EEF3FE | Light brand bg: selected rows, brand chips |
| `--on-primary-container` | #191919 | Text on primary-container |
| `--primary-fixed` | #0067D1 | Fixed brand color (all-mode) |
| `--primary-fixed-dim` | #004EA8 | Fixed block pressed/hover |
| `--on-primary-fixed` | #FFFFFF | Fixed block primary text |
| `--on-primary-fixed-variant` | #FFFFFF | Fixed block secondary text |

### Surface & Content

| Token | Value | Usage |
|-------|-------|-------|
| `--surface` | #F3F3F3 | Page background |
| `--surface-dim` | #FFFFFF | Dimmer page section |
| `--surface-bright` | #FFFFFF | Brightest surface |
| `--on-surface` | #191919 | Primary text |
| `--surface-variant` | #F3F3F3 | Secondary container bg (search input) |
| `--on-surface-variant` | #777777 | Secondary text, placeholder, date, subtitle |
| `--surface-container-lowest` | #F3F3F3 | Bottom layer — page body |
| `--surface-container-low` | #FFFFFF | Sub-bottom — frosted glass containers |
| `--surface-container` | #FFFFFF | Mid-level — cards |
| `--surface-container-high` | #FFFFFF | Upper — floating menu panels |
| `--surface-container-highest` | #FFFFFF | Top — modals, highest z-level |

### Inverse (dark snackbars/toasts)

| Token | Value | Usage |
|-------|-------|-------|
| `--inverse-surface` | #191919 | Dark toast/snackbar surface |
| `--inverse-on-surface` | #FFFFFF | Text on inverse surface |
| `--inverse-on-surface-variant` | #FFFFFF | Secondary text on inverse surface |
| `--inverse-primary` | #0067D1 | Brand action on inverse surface |

### Functional Colors

| State | Main | On | Container | On-container |
|-------|------|----|-----------|--------------|
| Error | `--error` #E02128 | `--on-error` #FFFFFF | `--error-container` #FEE7E8 | `--on-error-container` #191919 |
| Success | `--success` #09AA71 | `--on-success` #FFFFFF | `--success-container` #E7FBF2 | `--on-success-container` #191919 |
| Critical | `--critical` #F4840C | `--on-critical` #FFFFFF | `--critical-container` #FEF5E8 | `--on-critical-container` #191919 |
| Warning | `--warning` #FCC800 | `--on-warning` #FFFFFF | `--warning-container` #FEFCE0 | `--on-warning-container` #191919 |
| Info | `--info` #2070F3 | `--on-info` #FFFFFF | `--info-container` #EEF3FE | `--on-info-container` #191919 |

Usage: solid state chip → bg `--error` + text `--on-error`; soft badge → text `--error` on bg `--error-container`. Dark mode flips automatically.

### Content, Links & Scrim

| Token | Value | Usage |
|-------|-------|-------|
| `--text-placeholder` | #AEAEAE | Placeholder text |
| `--text-disabled` | #C9C9C9 | Disabled content |
| `--text-inverse-disabled` | #FFFFFF | Disabled content on dark |
| `--interactive-link` | #0067D1 | Link text |
| `--interactive-link-hover` | #2E86DE | Link hover |
| `--interactive-link-active` | #004EA8 | Link pressed |
| `--interactive-link-visited` | #715AFB | Visited link |
| `--interactive-link-disabled` | #8ABEF3 | Disabled link |
| `--scrim` | rgba(25,25,25,0.3) | Modal & drawer mask |
| `--outline` | #C9C9C9 | Default stroke (inputs, cards) |
| `--outline-variant` | #DFDFDF | Weak stroke |
| `--divider` | #DFDFDF | Separator lines, table grid |
| `--focus-ring` | #0067D1 | Keyboard-focus outline color |
| `--selected` | #0067D1 | Selected item border/indicator |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-inline` | 8px | Horizontal gap (button icon↔text, flex row gap) |
| `--spacing-stack` | 12px | Vertical gap (form Label↔Input, flex column gap) |
| `--spacing-gutter` | 16px | Grid gap between cards |
| `--spacing-inset` | 24px | Inner padding of containers |
| `--spacing-section` | 16px | Gap between page sections |
| `--spacing-page` | 32px | Page edge padding |

Numeric scale: `--spacing-0` … `--spacing-20` (rem-based, scales with viewport; at design canvas rem=16px: 0–80px, 0.125rem step = half of 0.25rem grid).

### Shadows

Scale (`--shadow-*` defined in light/dark layers, auto-deepens in dark):

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-none` | none | No shadow |
| `--shadow-sm` | 0 1px 6px rgba(0,0,0,0.08) | Initial shadow |
| `--shadow-base` | 0 4px 12px rgba(0,0,0,0.16) | Button/card hover lift |
| `--shadow-md` | 0 8px 24px rgba(0,0,0,0.08) | Medium shadow |
| `--shadow-lg` | 0 8px 24px rgba(0,0,0,0.16) | Dropdowns, floating panels |
| `--shadow-xl` | 0 16px 48px rgba(0,0,0,0.16) | Modal dialogs |
| `--shadow-r-sm` / `--shadow-t-sm` / `--shadow-l-base` / `--shadow-l-md` | — | Directional shadows (right/top/left) |

Semantic aliases (theme layer):

| Token | = | Usage |
|-------|---|-------|
| `--shadow-card` | `--shadow-sm` | Cards |
| `--shadow-popover` | `--shadow-lg` | Popovers, tooltips |
| `--shadow-modal` | `--shadow-xl` | Modals |

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Full-width banners, edge-to-edge |
| `--radius-xs` | 2px | Tiny controls (Checkbox) |
| `--radius-base` | 4px | Default — inputs, buttons, tags |
| `--radius-md` | 6px | Medium — image masks, some buttons |
| `--radius-lg` | 8px | Large — cards |
| `--radius-xl` | 12px | Extra large |
| `--radius-full` | 9999px | Pills, circles (avatars) |
| `--radius-badge` | 4px | Badges, unread dots |
| `--radius-action` | 4px | Buttons, toggles |
| `--radius-container` | 8px | Cards, panels |
| `--radius-overlay` | 8px | Modals, drawers, popovers |

### Border & Outline Width

| Token | Value | Usage |
|-------|-------|-------|
| `--border-width-thin` | 1px | Default stroke |
| `--border-width-thick` | 2px | State indicator — active tab bar |
| `--outline-width-focus` | 1px | Focus ring width (`:focus-visible`) |
| `--outline-offset-gap` | 2px | Gap between element and focus ring |

### Typography (role tokens: size + line-height + family bundled)

Use with the `font` shorthand; `font-weight` must be written AFTER `font:` (the shorthand resets it):

```css
font: var(--font-headline-s);           /* 16px/1.5 + family */
font-weight: var(--font-weight-semibold); /* 600 — after font: */
```

| Role | Token | px/line-height | Usage |
|------|-------|---------------|-------|
| Display L | `--font-display-l` | 60px/1.25 | Hero tagline, dashboard hero numbers |
| Display M | `--font-display-m` | 48px/1.375 | Hero subtitle, section mega title |
| Display S | `--font-display-s` | 36px/1.375 | Dashboard numbers, section titles |
| Headline L | `--font-headline-l` | 20px/1.375 | Section title (H3), sidebar module title |
| Headline M | `--font-headline-m` | 18px/1.375 | Card title |
| Headline S | `--font-headline-s` | 16px/1.5 | Form area title, small card title |
| Body L | `--font-body-l` | 16px/1.5 | Large body text, lead paragraphs |
| Body M | `--font-body-m` | 14px/1.5 | Body text, table data, button text, form labels (page default) |
| Body S | `--font-body-s` | 12px/1.625 | Helper text, secondary info |
| Caption M | `--font-caption-m` | 12px/1.625 | Timestamps, table annotations |
| Caption S | `--font-caption-s` | 10px/1.8 | Fine print, micro annotations |

Weights: `--font-weight-light` 300 · `--font-weight-normal` 400 · `--font-weight-medium` 500 · `--font-weight-semibold` 600 · `--font-weight-bold` 700.
Line heights: `--line-height-xs` 1.25 · `--line-height-sm` 1.375 · `--line-height-base` 1.5 · `--line-height-md` 1.625 · `--line-height-lg` 1.8.
Font family: `var(--font-family)` (already on `body` — do not re-declare).

Raw scale: `--font-size-sm(10) / base(12) / md(14) / lg(16) / xl(18) / 2xl(20) / 3xl(24) / 4xl(28) / 5xl(36) / 6xl(48) / 7xl(60) / 8xl(72)`.

All font sizes and numeric spacing are **rem** and scale with viewport: 1rem = 12px @≤1366 · 14px @1367-1680 · 16px @1681-1920 · 20px @>1920. Values above are shown at the 1920 baseline (1rem = 16px) — when writing rem values yourself, compute against this baseline.

## Escape Hatches (semantic/base layer, allowed when theme has no equivalent)

- **Chart series:** `var(--color-chart-1)` … `var(--color-chart-25)` — sequential, theme-aware
- **Icon colors:** `var(--color-icon-primary|secondary|placeholder|disabled)`
- **Specialized surfaces:** `--color-table-*` (zebra, sticky), `--color-tag-bg-*` / `--color-tag-text-*`, `--color-sidenav-bg`, `--color-message-bg-*`, `--color-bg-mask`
- **State variants beyond primary:** `--color-error-hover`, `--color-warning-subtler`…

**Forbidden:** `:root`/`.dark` blocks in component CSS, `rgba()` literals for themed colors, legacy token names (`--text-N*`, `--elevation-*`, `--content-*` — use the role/scale tokens above).

## Design Rules

1. **No shadows + borders combo:** EITHER `box-shadow: var(--shadow-card)` OR `border: 1px solid var(--outline)` — never both on the same element.
2. **Card pattern:** `background-color: var(--surface-container); border-radius: var(--radius-xl); box-shadow: var(--shadow-card); padding: var(--spacing-6);`
3. **Hover transitions:** `transition: background-color 0.2s ease, color 0.2s ease` — only the properties that change.
4. **Z-index scale:** 10 dropdowns · 100 popovers · 1000 modals.
5. **Disabled state:** text `var(--text-disabled)` on background `var(--surface)`.
6. **Dark mode is free:** stay on theme/semantic tokens and the component re-themes under `.dark` automatically.
7. **Machine-enforced:** build.mjs CSS lint FAILs on unknown `var(--*)` names and `:root`/`.dark` blocks; hardcoded hex triggers a WARN.
8. **Custom per-mode values:** for values tokens can't express (custom colors, images, gradients): base rule = light value, dark value via `.dark .yourComponentRoot { ... }` descendant override.
