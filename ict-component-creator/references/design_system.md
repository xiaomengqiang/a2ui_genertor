# Design System

## Token Architecture (four layers)

| Layer | File | Scope | Role |
|---|---|---|---|
| Primitive | `assets/style/base.css` | `:root` | Raw color scales, radius, typography, spacing |
| Semantic (light) | `assets/style/light.css` | `:root` | `--color-*` names mapped to primitives (default theme) |
| **Theme (AI-facing)** | `assets/style/theme.css` | `:root` | **The layer components write against** — Material-style names |
| Semantic (dark) | `assets/style/dark.css` | `.dark` | Same semantic names, dark values (add class `dark` to `<html>`) |

**Component CSS uses the THEME layer first.** It is designed around AI-friendly, guessable names with `on-*` pairing conventions. Escape hatches below cover what the theme layer doesn't name. Prefer theme-layer tokens; primitive scales (`var(--brand-50)`, `var(--gray-90)`) are allowed when needed. Hardcoded hex is discouraged but not blocked (build.mjs WARNs).

## Theme Layer Tokens (light values shown)

### Primary / Brand
| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#0067D1` | Primary buttons, links, selected states |
| `--primary-hover` / `--primary-active` / `--primary-disabled` | `#2E86DE` / `#004EA8` / `#8ABEF3` | Interactive brand states |
| `--on-primary` | `#FFFFFF` | Text/icons on primary fills |
| `--primary-container` | `#EEF3FE` | Light brand bg: badges, selected rows, subtle chips |
| `--on-primary-container` | `#191919` | Text on primary-container |
| `--primary-fixed` / `--primary-fixed-dim` | `#0067D1` / `#004EA8` | Fixed brand tones |

### Surface & Content
| Token | Value | Usage |
|-------|-------|-------|
| `--surface` | `#F3F3F3` | Page background |
| `--surface-container` (+ `-low`/`-lowest`/`-high`/`-highest`, `-dim`/`-bright`, `-variant`) | `#FFFFFF` | Cards, panels, elevated surfaces |
| `--on-surface` | `#191919` | Primary text |
| `--on-surface-variant` | `#777777` | Secondary text, labels |
| `--content-placeholder` | `#AEAEAE` | Placeholder text (`::placeholder`) |
| `--content-disabled` | `#C9C9C9` | Disabled text |
| `--inverse-surface` / `--inverse-on-surface` | `#191919` / `#FFFFFF` | Inverted blocks (toasts on dark) |

### Semantic States (M3 pattern: main + on + container)
| State | Main | On | Container | On-container |
|-------|------|----|-----------|--------------|
| Error | `--error` `#E02128` | `--on-error` | `--error-container` `#FEE7E8` | `--on-error-container` |
| Success | `--success` `#09AA71` | `--on-success` | `--success-container` `#E7FBF2` | `--on-success-container` |
| Warning | `--warning` `#FCC800` | `--on-warning` | `--warning-container` `#FEFCE0` | `--on-warning-container` |
| Critical | `--critical` `#F4840C` | `--on-critical` | `--critical-container` `#FEF5E8` | `--on-critical-container` |
| Info | `--info` `#2070F3` | `--on-info` | `--info-container` `#EEF3FE` | `--on-info-container` |

Usage: solid state chip → bg `--error` + text `--on-error`; soft badge/alert → text `--error` on bg `--error-container`.

### Outline / Divider / Focus
`--outline` `#C9C9C9` · `--outline-variant` / `--divider` `#DFDFDF` · `--focus-ring` `#0067D1` · `--selected` `#0067D1`

### Interactive (links)
`--interactive-link` `#0067D1` · `-hover` `#2E86DE` · `-active` `#004EA8` · `-visited` `#715AFB` · `-disabled` `#8ABEF3`

### Scrim
`--scrim` `rgba(25,25,25,.3)` — modal/overlay mask.

### Shadows
Theme-layer aliases over light/dark `--elevation-*` values — they auto-switch with dark mode:
| Token | Usage |
|-------|-------|
| `--shadow-sm` / `--shadow-card` | Cards, list items |
| `--shadow-base` | Raised cards |
| `--shadow-md` | Dropdowns |
| `--shadow-lg` / `--shadow-popover` | Popovers, modals |
| `--shadow-xl` / `--shadow-modal` | Modals |

### Radius
`--radius-xs` 2px · `--radius-base` / `--radius-action` / `--radius-badge` 4px · `--radius-md` 6px · `--radius-lg` / `--radius-container` / `--radius-overlay` 8px · `--radius-xl` 12px · `--radius-full` 9999px

### Typography
Font family: `var(--font-family)` (HarmonyOS Sans, already on `body` — do not re-declare).

| Token | Size / Line-height | Usage |
|-------|--------------------|-------|
| `--text-sm` | 12px / 1.6 | Labels, captions |
| `--text-md` | 14px / 1.5 | Body text |
| `--text-lg` | 16px / 1.5 | Card titles |
| `--text-xl` | 18px / 1.5 | Sub-headers |
| `--text-2xl` | 20px / 1.4 | Section titles |
| `--text-3xl` … `--text-9xl` | 24…96px | Page titles, hero |

Companion line-height tokens exist: `--text-N--line-height`.

## Escape Hatches (semantic/base layer, allowed when theme has no equivalent)

- **Chart series:** `var(--color-chart-1)` … `var(--color-chart-25)` — sequential, theme-aware
- **Numeric spacing:** `var(--spacing-1)` (4px) … `var(--spacing-96)` (384px) from base.css
- **Font weights:** `var(--font-weight-light|normal|medium|semibold|bold)`
- **Icon colors:** `var(--color-icon-primary|secondary|placeholder|disabled)`
- **Specialized surfaces:** `--color-table-*` (zebra, sticky), `--color-tag-bg-*` / `--color-tag-text-*`, `--color-sidenav-bg`, `--color-message-bg-*`, `--color-bg-mask`
- **Directional shadows:** `--elevation-r-sm`, `--elevation-t-sm`, `--elevation-l-base`, `--elevation-l-md` (right/top/left-only, for attached panels)
- **State variants beyond primary:** `--color-error-hover`, `--color-warning-subtler`…

**Forbidden:** `:root`/`.dark` blocks in component CSS, `rgba()` literals for themed colors.

## Design Rules

1. **No shadows + borders combo:** EITHER `box-shadow: var(--shadow-card)` OR `border: 1px solid var(--outline)` — never both on the same element.
2. **Card pattern:** `background-color: var(--surface-container); border-radius: var(--radius-xl); box-shadow: var(--shadow-card); padding: var(--spacing-6);`
3. **Hover transitions:** `transition: background-color 0.2s ease, color 0.2s ease` — only the properties that change.
4. **Z-index scale:** 10 dropdowns · 100 popovers · 1000 modals.
5. **Disabled state:** text `var(--content-disabled)` on background `var(--surface)`.
6. **Dark mode is free:** stay on theme/semantic tokens and the component re-themes under `.dark` automatically.
7. **Machine-enforced:** build.mjs CSS lint fails on unknown `var(--*)` names and hardcoded hex in component CSS.
