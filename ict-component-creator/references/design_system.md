# Design System

## Color Tokens

### Brand / Primary
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#0067D1` | Primary buttons, links, selected states |
| `primary-hover` | `#0050A8` | Hover state for primary elements |
| `primary-active` | `#004EA8` | Active/pressed state |
| `primary-light` | `#EEF3FE` | Light backgrounds, badges, subtle containers |

### Surface
| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#F3F3F3` | Page background, canvas |
| `surface-bright` / `surface-container` | `#FFFFFF` | Cards, panels, elevated surfaces |
| `on-surface` | `#191919` | Primary text color |
| `on-surface-variant` | `#777777` | Secondary text, labels, descriptions |

### Semantic States
| Token | Value | Container | Usage |
|-------|-------|-----------|-------|
| `error` | `#E02128` | `#FEE7E8` | Error messages, destructive actions |
| `success` | `#09AA71` | `#E7FBF2` | Success states, confirmations |
| `warning` | `#FCC800` | `#FEFCE0` | Warnings, caution |
| `critical` | `#F4840C` | `#FEF5E8` | Alerts, critical warnings |
| `info` | `#2070F3` | `#EEF3FE` | Info messages, neutral notifications |

### Neutral
| Token | Value | Usage |
|-------|-------|-------|
| `outline` | `#C9C9C9` | Borders, dividers |
| `outline-variant` | `#DFDFDF` | Lighter borders, separators |
| `divider` | `#DFDFDF` | Divider lines |
| `content-placeholder` | `#AEAEAE` | Placeholder text |
| `content-disabled` | `#C9C9C9` | Disabled text |

## Spacing Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `inline` | `0.5rem` (8px) | Inline gaps between small items |
| `stack` | `0.75rem` (12px) | Vertical stacking gaps |
| `gutter` | `1rem` (16px) | Gutter between sections |
| `inset` | `1.5rem` (24px) | Card/panel inner padding |
| `section` | `1rem` (16px) | Section spacing |
| `page` | `2rem` (32px) | Page-level margins |

## Shadow Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` / `shadow-card` | `0px 1px 6px 0 rgba(0,0,0,0.08)` | Cards, list items |
| `shadow-base` | `0 4px 12px 0 rgba(0,0,0,0.16)` | Raised cards |
| `shadow-md` | `0 8px 24px rgba(0,0,0,0.08)` | Dropdowns, popovers |
| `shadow-lg` / `shadow-popover` | `0 8px 24px 0 rgba(0,0,0,0.16)` | Modals, overlays |
| `shadow-xl` / `shadow-modal` | `0 16px 48px 0 rgba(0,0,0,0.16)` | Large modals |

## Border Radius Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-xs` | `2px` | Tiny elements |
| `rounded-base` / `rounded-action` / `rounded-badge` | `4px` | Buttons, badges, actions |
| `rounded-md` | `6px` | Inputs, small cards |
| `rounded-lg` / `rounded-container` | `8px` | Cards, containers |
| `rounded-xl` | `12px` | Large cards, panels |
| `rounded-full` | `9999px` | Avatars, pills |

## Typography
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-sm` | 12px | 1.6 | Labels, captions, metadata |
| `text-md` | 14px | 1.5 | Body text, table content |
| `text-lg` | 16px | 1.5 | Card titles, section headers |
| `text-xl` | 18px | 1.5 | Sub-headers |
| `text-2xl` | 20px | 1.4 | Page section titles |
| `text-3xl` | 24px | 1.4 | Page titles |
| `text-4xl` | 28px | 1.4 | Hero text |
| `text-5xl` | 36px | 1.4 | Large hero |

## Font Family
```
'HarmonyOS Sans', 'Microsoft YaHei', Arial, 'PingFang SC', sans-serif
```

## Design Rules

1. **No shadows + borders combo:** Use EITHER a shadow OR a border, never both.
2. **Card pattern:** `bg-white rounded-lg shadow-card p-inset` (or `p-6`)
3. **Button pattern:** `rounded-action px-4 py-2 text-sm font-medium` + color variant
4. **Tag/Badge:** `rounded-badge px-3 py-1 text-xs font-medium` + color container
5. **Hover transitions:** Always add `transition-all` or `transition-colors` for interactive elements
6. **Consistent spacing:** Use Tailwind's spacing scale (4, 8, 12, 16, 24, 32px)
7. **Z-index:** Use `z-10` for dropdowns, `z-20` for popovers, `z-50` for modals
