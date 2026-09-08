# Design System (HarmonyOS)

## Token Architecture (four layers)

| Layer | File | Scope | Role |
|---|---|---|---|
| Primitive | `assets/style/base.css` | `:root` + `.dark` | Raw material: brand/primary/on-primary/container alpha scales, gray, multi-color palette, font sizes/weights/line-heights, radius levels, spacing, border widths, motion |
| Semantic (light) | `assets/style/light.css` | `:root` | `--color-*` role tokens mapped to primitives (default theme) |
| **Theme (AI-facing)** | `assets/style/theme.css` | `:root` | **The layer components write against first** — semantic aliases |
| Semantic (dark) | `assets/style/dark.css` | `.dark` | Only re-defines tokens whose reference differs per mode; the rest auto-flip via base |

**Component CSS uses the THEME layer first.** When theme has no equivalent, escape hatches below (light/dark `--color-*`, then base primitives) are allowed. Hardcoded hex is discouraged (build.mjs WARNs). Dark mode is free: any token reference auto-flips under `.dark` — never write mode-specific values yourself.

## Theme Layer Tokens

### Primary / Brand

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | #0A59F7 | Primary buttons, links, selected states |
| `--on-primary` | #FFFFFF | Text/icons on solid brand fills |
| `--primary-hover` | rgba(10,89,247,.8) | Primary button hover |
| `--primary-active` | #0A59F7 | Primary button pressed |
| `--primary-disabled` | rgba(10,89,247,.4) | Primary button disabled |
| `--primary-container` | rgba(10,89,247,.05) | Light brand bg: badges, selected rows, chips |
| `--on-primary-container` | primary-90 | Text on primary-container |

### Surface & Content

| Token | Value | Usage |
|-------|-------|-------|
| `--surface` | #F1F3F5 | Page background |
| `--surface-dim` | #E5E5EA | Dimmer page section |
| `--surface-bright` | #FFFFFF | Brightest surface |
| `--on-surface` | primary-90 | Primary text |
| `--surface-container-lowest` | #FFFFFF | Lightest container |
| `--surface-container-low` | #F1F3F5 | Light container |
| `--surface-container` | 5% overlay | **Default container** — cards, panels, buttons, inputs, chips. Resting bg does NOT change on hover/press; use interactive overlays (Design Rule 3) |
| `--surface-container-high` | #E5E5EA | High container |
| `--surface-container-highest` | #D1D1D6 | Darkest container |

### Inverse (dark snackbars/toasts on light pages, vice versa)

`--inverse-surface` (primary: black↔white) · `--inverse-on-surface` (font-on-primary) · `--inverse-on-surface-variant` (60%) · `--inverse-primary` (brand)

### Functional Colors (main + on + container + on-container)

| State | Main | On | Container | On-container |
|-------|------|----|-----------|--------------|
| Error | `--error` mc-08 #E84026 | `--on-error` white | `--error-container` aux-08 light coral | `--on-error-container` font-primary |
| Success | `--success` mc-04 #64BB5C | `--on-success` white | `--success-container` aux-04 light green | `--on-success-container` |
| Critical | `--critical` mc-09 orange | `--on-critical` white | `--critical-container` aux-09 light peach | `--on-critical-container` |
| Warning | `--warning` mc-11 yellow #F7CE00 | `--on-warning` **black** | `--warning-container` aux-11 light cream | `--on-warning-container` |
| Info | `--info` brand | `--on-info` white | `--info-container` brand-05 | `--on-info-container` |

Usage: solid state chip → bg `--error` + text `--on-error`; soft badge/alert → text `--error` on bg `--error-container`.

### Text Colors (four tiers + aliases)

| Tier | Theme alias | Raw tier (light/dark) | Value | Usage |
|------|------------|----------------------|-------|-------|
| Main | `--on-surface` | `--color-font-primary` | primary-90 | Main text |
| Secondary | `--text-secondary` | `--color-font-secondary` | primary-60 | Secondary text, labels |
| **Placeholder** | `--text-placeholder` | `--color-font-tertiary` | primary-40 | Placeholder text (`::placeholder`) |
| **Disabled** | `--text-disabled` | `--color-font-fourth` | primary-20 | Disabled text |
| Inverse-disabled | `--text-inverse-disabled` | `--color-font-on-fourth` | on-primary-20 | Disabled text on inverse surfaces |

Text on brand fills at other emphasis levels: `--color-font-on-primary/secondary/tertiary/fourth`.

### Links

`--interactive-link` brand · `-hover` brand-80 · `-active` brand · `-visited` brand (same as default — no purple) · `-disabled` brand-40

### Scrim / Divider / Focus

`--scrim` container-15 (modal & drawer mask) · `--divider` comp-divider (20% overlay) · `--focus-ring` / `--selected` comp-border-focus (brand)

### Spacing (semantic aliases over base numeric scale)

`--spacing-inline` 8px · `--spacing-stack` 12px · `--spacing-gutter` 16px · `--spacing-inset` 24px · `--spacing-section` 16px · `--spacing-page` 24px

For other values use base numeric scale directly (below).

### Shadows (usage aliases over light/dark raw scale)

| Token | Usage |
|-------|-------|
| `--shadow-card` (= `--shadow-sm`) | Cards, list items |
| `--shadow-dropdown` (= `--shadow-md`) | Dropdowns |
| `--shadow-popover` (= `--shadow-lg`) | Popovers |
| `--shadow-modal` (= `--shadow-2xl`) | Modals |
| `--shadow-none` | No shadow |

Raw scale (light/dark defined, auto-flip): `--shadow-xs / sm / md / lg / xl / 2xl / strong / l-sm / glow`. `--shadow-strong` = high-intensity short-radius (menus); `--shadow-l-sm` = left-only (attached panels).

### Radius (usage aliases over base levels)

`--radius-badge` / `--radius-action` 4px · `--radius-container` / `--radius-overlay` 8px

Base scale: `--radius-none` 0 · `--radius-level1`–`level12` (2–24px, level N = N×2px) · `--radius-level16` 32px · `--radius-full` 9999px (pills/circles).

### Border & Outline Width

`--border-width-thin` 1px (default stroke) · `--border-width-thick` 2px (emphasis) · base `--border-width-none` 0
`--outline-width-focus` 1px · `--outline-offset-gap` 2px (focus ring gap)

### Typography (role tokens: size + line-height + family bundled)

Use with the `font` shorthand; **`font-weight` must be written AFTER `font:`** (the shorthand resets it):

```css
font: var(--font-title-md);           /* 24px/1.375 + family, one line */
font-weight: var(--font-weight-bold); /* 600 — after font:, never before */
```

| Role | Tokens (px/line-height) | Usage |
|------|------------------------|-------|
| Display | `--font-display-sm/md/lg` 38/48/56 ÷ 1.25 | Hero numbers, marketing display |
| Title | `--font-title-sm/md/lg` 20/24/30 ÷ 1.375 | Card/section/page titles |
| Subtitle | `--font-subtitle-sm/md/lg` 14/16/18 ÷ 1.5 | Card subtitles, list headers |
| Body | `--font-body-sm/md/lg` 12/14/16 ÷ 1.5 | Body text (md = default) |
| Caption | `--font-caption-md/lg` 10/12 ÷ 1.5 | Annotations, timestamps, badges |

Weights: `--font-weight-regular` 400 · `--font-weight-medium` 500 · `--font-weight-bold` 600. Font family: `var(--font-family)` (already on `body` — do not re-declare).

## Beyond theme.css (scenarios theme does not cover)

Theme aliases don't cover everything. These scenarios resolve directly against light/dark semantic tokens or base primitives — all auto-flip in dark mode unless noted.

### Motion (base-only, not in theme)

Durations: `--duration-fast` 150ms (micro: hover/color/press) · `--duration-medium` 250ms (enter/exit: dropdown/fade) · `--duration-slow` 400ms (large moves: modal/drawer)
Easings: `--ease-out` = **entrances** (fast-in, settle) · `--ease-in` = **exits** (accelerate away) · `--ease-standard` = **movement/resize** (both endpoints visible)

Standard transition pattern (only the properties that change):

```css
transition: background-color var(--duration-fast) var(--ease-standard),
            color var(--duration-fast) var(--ease-standard);
```

### Checkbox / Radio unchecked state (light/dark)

`--color-fg-unchecked` (20% on-primary) — the border/fill of unselected CheckBox & Radio controls.

### Emphasized text & icons (light/dark)

- `--color-font-emphasize` (= `--brand-font`, brighter than brand in dark) — emphasized text, inline emphasis
- `--color-icon-emphasize` (same value) · `--color-icon-sub-emphasize` (brand-40) — emphasized / secondary-emphasized icons

### Page background levels (light/dark, raw)

`--color-background-primary` (white) · `-secondary` (gray-01, the page bg) · `-tertiary` (gray-02) · `-fourth` (gray-03) · `-emphasize` (solid brand page section). Use when you need the level explicitly rather than via `--surface-*`.

### Chart / avatar / category palette (base)

`--multi-color-01…11` + `--multi-color-aux-01…11` (22 tokens, theme-aware). Main series for charts; `aux` = lighter supporting shade. Also for avatar backgrounds, tag category colors, data-viz series.

### Custom tints & overlays (base alpha scales)

- **Brand tints:** `--brand-05…90` (5%–90% alpha) · `--brand-font` (brand tuned for text — differs from `--brand` in dark)
- **Neutral overlays:** `--container-05…90` (black-based in light, white-based in dark — hover/press/mask primitives)
- **Content overlays:** `--primary-05…90` / `--on-primary-05…90`
- **Fixed constants:** `--black` / `--white` / `--gray-01…04`

### Raw type scale (base, when role tokens don't fit)

`--font-size-xs/sm/base/md/lg/xl/2xl/3xl/4xl/5xl/6xl` = 10/12/14/16/18/20/24/30/38/48/56px · line heights: `--line-height-none/tight/snug/base/relaxed/loose` (1 / 1.25 / 1.375 / 1.5 / 1.625 / 2)

### Numeric spacing (base)

`--spacing-0` … `--spacing-6` (N×4px; `N-5` suffix = half step, e.g. `--spacing-2-5` = 10px)

### Light/dark semantic (`--color-*`) quick index

- **Comp backgrounds:** `--color-comp-background-primary/secondary/tertiary`, `-emphasize`, `--color-comp-emphasize-secondary/tertiary` (brand 20%/10%), `-list-card`, `-gray`, `-gray-secondary`
- **Comp border states:** `--color-comp-border` + `-hover/-focus/-active/-disabled`
- **Icon colors:** `--color-icon-primary/secondary/tertiary/fourth`, `-on-primary/secondary/tertiary/fourth`
- **Interactive overlays:** `--color-interactive-hover/pressed/click/focus/select`
- **Functional mains:** `--color-error/warning/success/info`
- **Text on brand tiers:** `--color-font-on-primary/secondary/tertiary/fourth`

**Forbidden in component CSS:** `:root` / `.dark` blocks, `rgba()`/hex literals for themed colors, redefining `--font-family`.

## Design Rules

1. **No shadow + border combo:** EITHER `box-shadow: var(--shadow-card)` OR `border: var(--border-width-thin) solid var(--color-comp-border)` — never both on the same element.
2. **Card pattern:** `background: var(--surface-container); border-radius: var(--radius-container); box-shadow: var(--shadow-card); padding: var(--spacing-gutter);`
3. **Hover/pressed on surfaces:** layer `--color-interactive-hover` / `-pressed` over the resting bg (which stays `--color-comp-background-tertiary`); the resting bg itself does not change between states.
4. **Focus ring pattern:** `outline: var(--outline-width-focus) solid var(--focus-ring); outline-offset: var(--outline-offset-gap);`
5. **Z-index scale:** 10 dropdowns · 100 popovers · 1000 modals.
6. **Disabled state:** text `--text-disabled`, controls `--color-comp-border-disabled` border or `--primary-disabled` fill.
7. **Placeholder text:** `color: var(--text-placeholder)` (use with `::placeholder`).
8. **Dark mode is free:** stay on tokens; never write mode-specific color values.
9. **Machine-enforced:** build.mjs CSS lint FAILs on unknown `var(--*)` names and `:root`/`.dark` blocks; hardcoded hex triggers a WARN.
