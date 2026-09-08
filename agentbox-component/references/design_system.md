# Design System (HarmonyOS)

## Token Architecture (four layers)

| Layer | File | Scope | Role |
|---|---|---|---|
| Primitive | `assets/style/base.css` | `:root` + `.dark` | Raw material: brand/primary/on-primary/container alpha scales, gray, multi-color palette, font sizes/weights/line-heights, radius levels, spacing, border widths, motion |
| Semantic (light) | `assets/style/light.css` | `:root` | `--color-*` role tokens mapped to primitives (default theme) |
| **Theme (AI-facing)** | `assets/style/theme.css` | `:root` | **The layer components write against first** — semantic aliases |
| Semantic (dark) | `assets/style/dark.css` | `.dark` | Only re-defines tokens whose reference differs per mode; the rest auto-flip via base |

**Component CSS uses the THEME layer first.** When theme has no equivalent, escape hatches below (light/dark `--color-*`, then base primitives) are allowed. Hardcoded hex is discouraged (build.mjs WARNs). Dark mode is free: any token reference auto-flips under `.dark` — never write mode-specific values yourself.

## Tokens

### Primary / Brand

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | #0A59F7 | Primary buttons, links, selected states |
| `--on-primary` | #FFFFFF | Text/icons on solid brand fills |
| `--primary-hover` | rgba(10,89,247,.8) | Primary button hover |
| `--primary-active` | #0A59F7 | Primary button pressed |
| `--primary-disabled` | rgba(10,89,247,.4) | Primary button disabled |
| `--primary-container` | rgba(10,89,247,.05) | Light brand bg: badges, selected rows, chips |
| `--on-primary-container` | rgba(0,0,0,.9) | Text on primary-container |

### Surface & Content

| Token | Value | Usage |
|-------|-------|-------|
| `--surface` | #F1F3F5 | Page background |
| `--surface-dim` | #E5E5EA | Dimmer page section |
| `--surface-bright` | #FFFFFF | Brightest surface |
| `--on-surface` | rgba(0,0,0,.9) | Primary text |
| `--surface-container-lowest` | #FFFFFF | **Cards, drawers, modals, popovers** — solid container surfaces |
| `--surface-container-low` | #F1F3F5 | Muted container — inset areas, secondary panels |
| `--surface-container` | rgba(0,0,0,.05) | **Controls** — buttons, inputs, chips, segmented. Resting bg; hover/press via interactive overlays (Design Rule 3) |
| `--surface-container-high` | #E5E5EA | Deeper container tint — nested blocks, wells |
| `--surface-container-highest` | #D1D1D6 | Strongest tint — zebra rows, emphasis wells |

Raw levels (use when you need the level explicitly): `--color-background-primary` #FFFFFF · `-secondary` #F1F3F5 (the page bg) · `-tertiary` #E5E5EA · `-fourth` #D1D1D6 · `-emphasize` #0A59F7 (solid brand page section).

### Inverse (dark snackbars/toasts on light pages, vice versa)

| Token | Value | Usage |
|-------|-------|-------|
| `--inverse-surface` | #000000 | Dark toast/snackbar surface |
| `--inverse-on-surface` | #FFFFFF | Text on inverse surface |
| `--inverse-on-surface-variant` | rgba(255,255,255,.6) | Secondary text on inverse surface |
| `--inverse-primary` | #0A59F7 | Brand action on inverse surface |

### Functional Colors (main + on + container + on-container)

| State | Main | On | Container | On-container |
|-------|------|----|-----------|--------------|
| Error | `--error` #E84026 | `--on-error` #FFFFFF | `--error-container` #E87361 | `--on-error-container` rgba(0,0,0,.9) |
| Success | `--success` #64BB5C | `--on-success` #FFFFFF | `--success-container` #92C48D | `--on-success-container` rgba(0,0,0,.9) |
| Critical | `--critical` #ED6F21 | `--on-critical` #FFFFFF | `--critical-container` #ED955F | `--on-critical-container` rgba(0,0,0,.9) |
| Warning | `--warning` #F7CE00 | `--on-warning` #000000 | `--warning-container` #F5DC62 | `--on-warning-container` rgba(0,0,0,.9) |
| Info | `--info` #0A59F7 | `--on-info` #FFFFFF | `--info-container` rgba(10,89,247,.05) | `--on-info-container` rgba(0,0,0,.9) |

Usage: solid state chip → bg `--error` + text `--on-error`; soft badge/alert → text `--error` on bg `--error-container`.

### Text Colors (four tiers + aliases)

| Tier | Theme alias | Value | Usage |
|------|------------|-------|-------|
| Main | `--on-surface` | rgba(0,0,0,.9) | Main text |
| Secondary | `--text-secondary` | rgba(0,0,0,.6) | Secondary text, labels |
| **Placeholder** | `--text-placeholder` | rgba(0,0,0,.4) | Placeholder text (`::placeholder`) |
| **Disabled** | `--text-disabled` | rgba(0,0,0,.2) | Disabled text |
| Emphasized | `--color-font-emphasize` | #0A59F7 | Emphasized/inline emphasis text (brighter in dark) |
| Inverse-disabled | `--text-inverse-disabled` | rgba(255,255,255,.2) | Disabled text on inverse surfaces |

Text on dark/inverse fills (brand buttons, error banners, dark toolbars): `--color-font-on-primary/secondary/tertiary/fourth` — white at 100%/60%/40%/20% emphasis.

### Icon Colors

| Tier | Token | Value | Usage |
|------|-------|-------|-------|
| Main | `--color-icon-primary` | rgba(0,0,0,.9) | Main icons |
| Secondary | `--color-icon-secondary` | rgba(0,0,0,.6) | Secondary icons |
| Tertiary | `--color-icon-tertiary` | rgba(0,0,0,.4) | Decorative/inactive icons |
| Disabled | `--color-icon-fourth` | rgba(0,0,0,.2) | Disabled icons |
| Emphasized | `--color-icon-emphasize` | #0A59F7 | Emphasized icons (brighter in dark) |
| Sub-emphasized | `--color-icon-sub-emphasize` | rgba(10,89,247,.4) | Secondary emphasized icons |

Icons on dark/inverse fills: `--color-icon-on-primary/secondary/tertiary/fourth` — white at 100%/60%/40%/20% emphasis.

### Links

| Token | Value | Usage |
|-------|-------|-------|
| `--interactive-link` | #0A59F7 | Link text |
| `--interactive-link-hover` | rgba(10,89,247,.8) | Link hover |
| `--interactive-link-active` | #0A59F7 | Link pressed |
| `--interactive-link-visited` | #0A59F7 | Visited (same as default) |
| `--interactive-link-disabled` | rgba(10,89,247,.4) | Disabled link |

### Scrim / Divider / Focus

| Token | Value | Usage |
|-------|-------|-------|
| `--scrim` | rgba(0,0,0,.15) | Modal & drawer mask |
| `--divider` | rgba(0,0,0,.2) | Separator lines between list items & sections |
| `--focus-ring` | #0A59F7 | Keyboard-focus outline on interactive elements |
| `--selected` | #0A59F7 | Border/indicator for selected items |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-inline` | 8px | Horizontal gap between inline elements |
| `--spacing-stack` | 12px | Vertical gap between stacked blocks |
| `--spacing-gutter` | 16px | Card padding, grid gutters |
| `--spacing-section` | 16px | Gap between page sections |
| `--spacing-inset` | 24px | Inner padding of large containers |
| `--spacing-page` | 24px | Page edge padding |

Numeric scale for all other values: `--spacing-0` … `--spacing-10` (0–40px, N×4px; `N-5` suffix = half step, e.g. `--spacing-2-5` = 10px).

### Shadows

| Token | Usage |
|-------|-------|
| `--shadow-card` (= `--shadow-sm`) | Cards, list items |
| `--shadow-dropdown` (= `--shadow-md`) | Dropdowns |
| `--shadow-popover` (= `--shadow-lg`) | Popovers |
| `--shadow-modal` (= `--shadow-2xl`) | Modals |
| `--shadow-none` | No shadow |

Full scale: `--shadow-xs / sm / md / lg / xl / 2xl / strong / l-sm / glow` (auto-flip in dark). `--shadow-strong` = high-intensity short-radius (menus); `--shadow-l-sm` = left-only (attached panels).

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-badge` | 4px | Badges, tags |
| `--radius-action` | 4px | Buttons, inputs |
| `--radius-container` | 8px | Cards, panels |
| `--radius-overlay` | 8px | Modals, drawers, popovers |

Full scale: `--radius-none` 0 · `--radius-xs/sm/md/lg/xl/2xl/3xl` = 2/4/6/8/12/16/20px · `--radius-full` 9999px (pills/circles).

### Border & Outline Width

| Token | Value | Usage |
|-------|-------|-------|
| `--border-width-thin` | 1px | Default stroke |
| `--border-width-thick` | 2px | Emphasis stroke |
| `--border-width-none` | 0 | No border |
| `--outline-width-focus` | 1px | Focus ring width |
| `--outline-offset-gap` | 2px | Gap between element and focus ring |

### Typography (role tokens: size + line-height + family bundled)

Use with the `font` shorthand; **`font-weight` must be written AFTER `font:`** (the shorthand resets it):

```css
font: var(--font-title-md);           /* 24px/1.375 + family, one line */
font-weight: var(--font-weight-bold); /* 600 — after font:, never before */
```

| Role | Tokens (px/line-height) | Usage |
|------|------------------------|-------|
| Display | `--font-display-sm/md/lg` 38/48/56 × 1.25 | Hero numbers, marketing display |
| Title | `--font-title-sm/md/lg` 20/24/30 × 1.375 | Card/section/page titles |
| Subtitle | `--font-subtitle-sm/md/lg` 14/16/18 × 1.5 | Card subtitles, list headers |
| Body | `--font-body-sm/md/lg` 12/14/16 × 1.5 | Body text (md = default) |
| Caption | `--font-caption-md/lg` 10/12 × 1.5 | Annotations, timestamps, badges |

Weights: `--font-weight-regular` 400 · `--font-weight-medium` 500 · `--font-weight-bold` 600.
Line heights: `--line-height-none/tight/snug/base/relaxed/loose` = 1 / 1.25 / 1.375 / 1.5 / 1.625 / 2.
Font family: `var(--font-family)` (already on `body` — do not re-declare).

Raw scale (when role tokens don't fit): `--font-size-xs/sm/base/md/lg/xl/2xl/3xl/4xl/5xl/6xl` = 10/12/14/16/18/20/24/30/38/48/56px.

### Motion

**Durations**

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro interactions: hover, color change, press |
| `--duration-medium` | 250ms | Enter/exit: dropdown, fade |
| `--duration-slow` | 400ms | Large moves: modal, drawer |

**Easings**

| Token | Usage |
|-------|-------|
| `--ease-out` | Entrances (fast-in, settle) |
| `--ease-in` | Exits (accelerate away) |
| `--ease-standard` | Movement/resize (both endpoints visible) |

### Checkbox / Radio unchecked

`--color-fg-unchecked` rgba(255,255,255,.2) — the border/fill of unselected CheckBox & Radio controls.

### Chart / avatar / category palette

`--multi-color-01…11` + `--multi-color-aux-01…11` (22 tokens, theme-aware). Main series for charts; `aux` = lighter supporting shade. Also for avatar backgrounds, tag category colors, data-viz series.

### Custom tints & overlays

- **Brand tints:** `--brand-05…90` (5%–90% alpha) · `--brand-font` (brand tuned for text — differs from `--brand` in dark)
- **Neutral overlays:** `--container-05…90` (black-based in light, white-based in dark — hover/press/mask primitives)
- **Content overlays:** `--primary-05…90` / `--on-primary-05…90`
- **Fixed constants:** `--black` / `--white` / `--gray-01…04`

### Light/dark semantic (`--color-*`) index

- **Comp backgrounds:** `--color-comp-background-primary/secondary/tertiary`, `-emphasize`, `--color-comp-emphasize-secondary/tertiary` (brand 20%/10%), `-list-card`, `-gray`, `-gray-secondary`
- **Comp border states:** `--color-comp-border` + `-hover/-focus/-active/-disabled`
- **Interactive overlays:** `--color-interactive-hover/pressed/click/focus/select`
- **Functional mains:** `--color-error/warning/success/info`

## Design Rules

1. **No shadow + border combo:** never use `box-shadow` and `border` on the same element — pick one.
2. **Card pattern:** `background: var(--surface-container-lowest); border-radius: var(--radius-container); box-shadow: var(--shadow-card); padding: var(--spacing-gutter);`
3. **Hover/pressed on surfaces:** layer `--color-interactive-hover` / `-pressed` over the resting bg (which stays `--color-comp-background-tertiary`); the resting bg itself does not change between states.
4. **Z-index scale:** 10 dropdowns · 100 popovers · 1000 modals.
5. **Disabled state:** text `--text-disabled`, controls `--color-comp-border-disabled` border or `--primary-disabled` fill.
6. **Machine-enforced:** build.mjs CSS lint FAILs on unknown `var(--*)` names and `:root`/`.dark` blocks; hardcoded hex triggers a WARN.
7. **Token first:** prefer tokens over raw values; use a raw hex/rgba literal only when the user explicitly specifies an exact color.
8. **Custom theme colors:** Per-mode values tokens can't express (custom colors, images, gradients): base rule = light value, dark value via `.dark .yourComponentRoot { ... }` descendant override.
