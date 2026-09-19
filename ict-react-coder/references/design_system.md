# Design System

## Token Architecture (four layers)

| Layer | File | Scope | Role |
|---|---|---|---|
| Primitive | `assets/style/base.css` | `:root` + `.dark` | Raw material: color scales, font sizes/weights/line-heights, radius levels, spacing, border widths |
| Semantic (light) | `assets/style/light.css` | `:root` | `--color-*` role tokens mapped to primitives (default theme) |
| **Theme (AI-facing)** | `assets/style/theme.css` | `:root` | **The layer custom CSS writes against first** — semantic aliases |
| Semantic (dark) | `assets/style/dark.css` | `.dark` | Dark-mode values for the full semantic set — overrides light via cascade order |

Custom CSS uses the THEME layer first. Dark mode is free: any token reference auto-flips under `.dark`.

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

Numeric scale: `--spacing-0` … `--spacing-20` (0–80px, N×4px; `-0-5` suffix = half step, e.g. `--spacing-2-5` = 10px).

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

## Design Rules

1. **Semantic first:** brand, interaction, text, border and error/warning/critical/success/info states must use corresponding semantic tokens — no arbitrary color substitution.
2. **Non-semantic colors only for visual richness:** data classification, chart series, illustrations, decorative backgrounds — control quantity, keep consistent mapping.
3. **Semantic wins over decorative:** never change state meaning or text readability for visual richness.
4. **Chart colors:** follow chart component defaults — don't hardcode; keep consistent per-category mapping (see `charts_usage.md`).
5. **Text & icons by function:** use semantic color tokens; `inverse-*` only on dark backgrounds.
6. **Default light:** pages default to light theme — do NOT auto-generate dark sidebars.
7. **No shadow + border combo:** never use `box-shadow` and `border` on the same element — pick one.
8. **No accent strips:** no left-border colored accent strips on cards or alerts — use `var(--error-container)` background instead.
9. **Card pattern:** `background: var(--surface-container-highest); border-radius: var(--radius-container); box-shadow: var(--shadow-card);` — no structural border when shadow is present.
10. **Token first:** prefer tokens over raw values; use raw hex/px only when the requirement specifies an exact value.
11. **Machine-enforced:** build.mjs CSS lint FAILs on unknown `var(--*)` names and `:root`/`.dark` blocks; hardcoded hex triggers a WARN.
12. **Custom per-mode values:** for values tokens can't express (custom colors, images, gradients): base rule = light value, dark value via `.dark .yourComponentRoot { ... }` descendant override.

## Elevation & Depth

We achieve spatial hierarchy through a precise combination of **Tonal Layering** and **Ambient Shadows**, avoiding heavy traditional borders.

### The Layering Principle (Stacking Order)

Depth is established by stacking architectural tiers from back to front:
- **Level 0 (The Canvas):** Use `var(--surface-container-lowest)` with no shadows. This is the absolute bottom layer (the page background).
- **Level 1 (Active Containers):** Use `var(--surface-container-highest)` paired with `var(--shadow-sm)` (or `var(--shadow-card)`). Reserved for primary content containers: Data Cards, Tables, Navigations, and Drawers to make them "pop" forward.
- **Level 2 (Inner Sub-regions):** Use `var(--surface-variant)`. Apply this *inside* Level 1 cards to visually separate internal functional blocks (e.g., inner lists, or nested form areas).

### Text & Contrast Pairings

Always pair backgrounds with their strict `on-*` text tokens to maintain premium readability:
- On `surface-container-*` backgrounds ➔ Use `var(--on-surface)`.
- On `surface-variant` backgrounds ➔ Use `var(--on-surface-variant)`.

### Semantic States (Status Indicator Layering)

To indicate semantic states (error, warning, success, info), apply the respective `var(--*-container)` tokens as background tints.
**Crucially:** Always pair them with the corresponding `var(--on-*-container)` tokens (and use the base `*` token for icons if needed).

### Strict UI Constraints (CRITICAL)

- **Mutual Exclusion:** NEVER combine a shadow with a structural border. If a container floats, it is borderless.
- **No Accent Strips:** Strictly NO left-border colored accent strips on cards or alerts. Use `var(--error-container)` background instead.

## Layout

### Content Container / Card

- Card is a layout container, not a component — use `div` or `section` (antd Card is banned).
- Use `background: var(--surface-container-highest); border-radius: var(--radius-container); box-shadow: var(--shadow-card);` — no structural border when shadow is present.
- Avoid meaningless nesting; keep consistent structure for same-type Cards. Primary actions go in page/section action area; Footer only for secondary actions.

### Header Navigation

- Height `48px`, use `var(--surface-container-highest)`. Brand identity, primary nav, global tools and user area stay stable.
- Only carries global nav; page filters, batch actions and primary actions go in content area.

### Side Navigation

- Default light `var(--surface-container-highest)`. Expanded width `248px`, collapsed `48px`.
- Collapsed state keeps icons, Tooltip and selected state. Use multi-level nav only when the information architecture truly needs it.

## Charts

> Detailed chart selection, layout, and color constraints see `charts_usage.md`. Core rules only here.

- All chart components come with legend, units, and axis — do not generate these UI elements, just pass data to the chart component.
- Chart height must fill the parent container — large whitespace is ugly.
- Chart data key names must be in Chinese for readability.

## Text

- *Color:*
  - Table content: use `var(--on-surface)` uniformly.
- *Typography:*
  - Card Title: must use `--font-headline-m` (18px).
  - Table Content: must use `--font-body-m` (14px).

## Brand & Visual Quality

ICT products should present a clear, useful, trustworthy, restrained, natural, professional and unified enterprise-grade experience — making page purpose, key information, status and actions quickly understood, and reflecting quality through clear hierarchy, alignment, grouping, whitespace and consistent components.

- Tech aesthetics must serve business understanding — use restrained visual cues related to devices, networks, data, processes and states.
- Avoid: marketing-style compositions, cyber or gaming feel, neon effects, heavy glass-morphism, random particles, exaggerated 3D and meaningless decoration.
- Any visual richness that interferes with data, actions or status should be reduced.
- Specific tokens, components, font and layout rules take precedence over general guidelines.

## Responsive & Adaptive

- Default canvas: 1920 × 1080. Desktop design width based on 1920px, default `1rem = 16px`.
- Mobile `<768px`. Tablet `768–1024px`. Desktop `>1024px`.

## 全局选择规则

- 顶部导航和侧边导航必须使用 `Menu`，不得使用 `Tabs`，也不得在导航项中放置 `Checkbox`、`RadioGroup` 或 `Tag`。
- 卡片右上角的少量互斥视图切换使用 `Segmented`；同级内容分区才使用 `Tabs`。
- 表格行选择使用 Table 的 `rowSelection`，不得手动画 Checkbox 列。
- 关键词搜索使用 `Input` 并设置搜索图标，不创建不存在的 Search 组件。
- 只调用当前运行环境真实提供的组件；没有独立规范文件的组件不得臆造 props。
