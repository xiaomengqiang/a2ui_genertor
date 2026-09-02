// PreviewRenderer.js —— A2UI 节点渲染器
// 本文件为**唯一权威源**，位于 ict-html-mix 技能 scripts/ 目录；运行时副本由
// validate-and-sync.ps1 -GenMeta 扇出同步到各页目录（项目根 previewdist/ + 各 <页目录>/previewdist/，
// 页面实际加载后者）。宿主页引用带 ?v= 缓存指纹（独立维护，源变更必 bump 并硬刷新）。
//
// replace 构造选项（双模式，见 .opencode/skills/ict-html-mix/WORKFLOW.md）：
//   replace:true（默认）——「替换/修改节点」：清空节点内容再渲染新的（=v1 语义）
//   replace:false       ——「新增/共存」：不清宿主内容，仅移除自产节点（幂等重挂）后追加
// container 为必填项（缺省 init 时显式报错）。
// 自产节点标记（replace:false 的清理锚点）：.preview-a2ui-app / .preview-a2ui-iframe / .preview-renderer-error
//
// 免服务器 file:// 支持：Chromium 下 file:// 页面的 fetch/XHR 全被 CORS 拦截，故本渲染器在
// file: 协议时改走 <script> 标签加载（经典 script 不受此限）：
//   - 应用元信息（styles+scripts 清单）：使用下方 __A2UI_EMBEDDED_META__ 内嵌块（由
//     .opencode/skills/ict-html-mix/scripts/validate-and-sync.ps1 -GenMeta 从 ict-coder 技能的
//     scripts/previewdist/index.prototype.html 提取并回写本文件；该运行时重建后需重跑刷新内嵌块，
//     并 bump 宿主页 ?v=；http 模式则运行时 fetch 入口页自适应 index.html / index.prototype.html）
// 节点数据 dataPath 三种形态（_initDirect 第 3 步）：
//   - *.json（裸 JSON）：http 走 fetch；file:// 走孪生 .data.js（validate-and-sync.ps1 校验 PASS 后
//     自动生成，内容为 window.__A2UI_FILE_DATA__ = <JSON>）
//   - *.js（自带 wrapper 的 data.js，ict-coder 产物格式 window.__A2UI_DATA__ = {...}）：
//     协议无关一律 script 标签直载，文件自身写 __A2UI_DATA__，天然免孪生
//   - 都不传：previewdist/data.js 默认数据（其自身代码写 window.__A2UI_DATA__，script 直载）
// ── 内嵌应用元信息（生成物，勿手改）──────────────────────────
// __A2UI_FILE_META_BEGIN__
var __A2UI_EMBEDDED_META__ = {
    "scripts":  [
                    "./assets/index.js"
                ],
    "styles":  [
                   {
                       "text":  "/* @tailwindcss/browser 运行时主题配置 */\r\n@theme {\r\n  /* ── colors → --color-* ── */\r\n  --color-primary: var(--color-brand, #0067D1);\r\n  --color-on-primary: var(--color-text-inverse, #FFFFFF);\r\n  --color-primary-container: var(--color-info-primary-subtler, #EEF3FE);\r\n  --color-on-primary-container: var(--color-text-primary, #191919);\r\n  --color-primary-fixed: var(--color-brand, #0067D1);\r\n  --color-primary-fixed-dim: var(--color-brand-active, #004EA8);\r\n  --color-on-primary-fixed: var(--color-text-inverse, #FFFFFF);\r\n  --color-on-primary-fixed-variant: var(--color-text-inverse, #FFFFFF);\r\n\r\n  --color-surface: var(--color-bg-1, #F3F3F3);\r\n  --color-surface-dim: var(--color-bg-2, #FFFFFF);\r\n  --color-surface-bright: var(--color-bg-2, #FFFFFF);\r\n  --color-on-surface: var(--color-text-primary, #191919);\r\n  --color-surface-variant: var(--color-bg-1, #F3F3F3);\r\n  --color-on-surface-variant: var(--color-text-secondary, #777777);\r\n  --color-surface-container-lowest: var(--color-bg-1, #F3F3F3);\r\n  --color-surface-container-low: var(--color-bg-2, #FFFFFF);\r\n  --color-surface-container: var(--color-bg-2, #FFFFFF);\r\n  --color-surface-container-high: var(--color-bg-2, #FFFFFF);\r\n  --color-surface-container-highest: var(--color-bg-2, #FFFFFF);\r\n\r\n  --color-inverse-surface: var(--color-text-primary, #191919);\r\n  --color-inverse-on-surface: var(--color-text-inverse, #FFFFFF);\r\n  --color-inverse-on-surface-variant: var(--color-text-inverse-disabled, #FFFFFF);\r\n  --color-inverse-primary: var(--color-brand, #0067D1);\r\n\r\n  --color-error: var(--color-error, #E02128);\r\n  --color-on-error: var(--color-text-inverse, #FFFFFF);\r\n  --color-error-container: var(--color-message-bg-error, #FEE7E8);\r\n  --color-on-error-container: var(--color-text-primary, #191919);\r\n\r\n  --color-success: var(--color-success, #09AA71);\r\n  --color-on-success: var(--color-text-inverse, #FFFFFF);\r\n  --color-success-container: var(--color-message-bg-success, #E7FBF2);\r\n  --color-on-success-container: var(--color-text-primary, #191919);\r\n\r\n  --color-critical: var(--color-alert, #F4840C);\r\n  --color-on-critical: var(--color-text-inverse, #FFFFFF);\r\n  --color-critical-container: var(--color-message-bg-alert, #FEF5E8);\r\n  --color-on-critical-container: var(--color-text-primary, #191919);\r\n\r\n  --color-warning: var(--color-warning, #FCC800);\r\n  --color-on-warning: var(--color-text-inverse, #FFFFFF);\r\n  --color-warning-container: var(--color-message-bg-warning, #FEFCE0);\r\n  --color-on-warning-container: var(--color-text-primary, #191919);\r\n\r\n  --color-info: var(--color-info-primary, #2070F3);\r\n  --color-on-info: var(--color-text-inverse, #FFFFFF);\r\n  --color-info-container: var(--color-message-bg-info, #EEF3FE);\r\n  --color-on-info-container: var(--color-text-primary, #191919);\r\n\r\n  --color-content-placeholder: var(--color-text-placeholder, #AEAEAE);\r\n  --color-content-disabled: var(--color-text-disabled, #C9C9C9);\r\n  --color-content-inverse-disabled: var(--color-text-inverse-disabled, #FFFFFF);\r\n  --color-interactive-link: var(--color-link, #0067D1);\r\n  --color-interactive-link-hover: var(--color-link-hover, #2E86DE);\r\n  --color-interactive-link-active: var(--color-link-active, #004EA8);\r\n  --color-interactive-link-visited: var(--color-link-visited, #715AFB);\r\n  --color-interactive-link-disabled: var(--color-link-disabled, #8ABEF3);\r\n  --color-scrim: var(--color-bg-mask, rgba(25, 25, 25, 0.3));\r\n  --color-outline: var(--color-border, #C9C9C9);\r\n  --color-outline-variant: var(--color-border-separator, #DFDFDF);\r\n  --color-divider: var(--color-border-separator, #DFDFDF);\r\n  --color-focus-ring: var(--color-border-focus, #0067D1);\r\n  --color-selected: var(--color-border-focus, #0067D1);\r\n\r\n  /* ── spacing → --spacing-* ── */\r\n  --spacing-inline: 0.5rem;\r\n  --spacing-stack: 0.75rem;\r\n  --spacing-gutter: 1rem;\r\n  --spacing-inset: 1.5rem;\r\n  --spacing-section: 1rem;\r\n  --spacing-page: 2rem;\r\n\r\n  /* ── boxShadow → --shadow-* ── */\r\n  --shadow-sm: 0px 1px 6px 0 rgba(0, 0, 0, 0.08);\r\n  --shadow-base: 0 4px 12px 0 rgba(0, 0, 0, 0.16);\r\n  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);\r\n  --shadow-lg: 0 8px 24px 0 rgba(0, 0, 0, 0.16);\r\n  --shadow-xl: 0 16px 48px 0 rgba(0, 0, 0, 0.16);\r\n  --shadow-card: var(--shadow-sm, 0px 1px 6px 0 rgba(0, 0, 0, 0.08));\r\n  --shadow-popover: var(--shadow-lg, 0 8px 24px 0px rgba(0, 0, 0, 0.16));\r\n  --shadow-modal: var(--shadow-xl, 0 16px 48px 0px rgba(0, 0, 0, 0.16));\r\n\r\n  /* ── borderRadius → --radius-* ── */\r\n  --radius-none: 0px;\r\n  --radius-xs: 2px;\r\n  --radius-base: 4px;\r\n  --radius-md: 6px;\r\n  --radius-lg: 8px;\r\n  --radius-xl: 12px;\r\n  --radius-full: 9999px;\r\n  --radius-badge: 4px;\r\n  --radius-action: 4px;\r\n  --radius-container: 8px;\r\n  --radius-overlay: 8px;\r\n\r\n  /* ── outlineWidth / outlineOffset ── */\r\n  --outline-width-focus: 1px;\r\n  --outline-offset-gap: 2px;\r\n\r\n  /* ── fontSize → --text-* (+ --text-*--line-height) ── */\r\n  --text-sm: 12px;\r\n  --text-sm--line-height: 1.6;\r\n  --text-md: 14px;\r\n  --text-md--line-height: 1.5;\r\n  --text-lg: 16px;\r\n  --text-lg--line-height: 1.5;\r\n  --text-xl: 18px;\r\n  --text-xl--line-height: 1.5;\r\n  --text-2xl: 20px;\r\n  --text-2xl--line-height: 1.4;\r\n  --text-3xl: 24px;\r\n  --text-3xl--line-height: 1.4;\r\n  --text-4xl: 28px;\r\n  --text-4xl--line-height: 1.4;\r\n  --text-5xl: 36px;\r\n  --text-5xl--line-height: 1.4;\r\n  --text-6xl: 48px;\r\n  --text-6xl--line-height: 1.3;\r\n  --text-7xl: 60px;\r\n  --text-7xl--line-height: 1.3;\r\n  --text-8xl: 72px;\r\n  --text-8xl--line-height: 1.2;\r\n  --text-9xl: 96px;\r\n  --text-9xl--line-height: 1.2;\r\n\r\n  /* ── fontFamily ── */\r\n  --font-sans: \u0027HarmonyOS Sans\u0027, \u0027Microsoft YaHei\u0027, Arial, \u0027PingFang SC\u0027, \u0027San Francisco\u0027, sans-serif;\r\n\r\n  /* ── hui 基本色阶 ── */\r\n  --color-hui-brand-5: var(--brand-05, #E6F2FD);\r\n  --color-hui-brand-10: var(--brand-10, #B8D9F9);\r\n  --color-hui-brand-20: var(--brand-20, #8ABEF3);\r\n  --color-hui-brand-30: var(--brand-30, #5CA2E9);\r\n  --color-hui-brand-40: var(--brand-40, #2E86DE);\r\n  --color-hui-brand-50: var(--brand-50, #0067D1);\r\n  --color-hui-brand-60: var(--brand-60, #004EA8);\r\n  --color-hui-brand-70: var(--brand-70, #003D83);\r\n  --color-hui-brand-80: var(--brand-80, #002E6A);\r\n  --color-hui-brand-90: var(--brand-90, #00214B);\r\n  --color-hui-gray-0: var(--gray-0, #FFFFFF);\r\n  --color-hui-gray-5: var(--gray-05, #F3F3F3);\r\n  --color-hui-gray-10: var(--gray-10, #DFDFDF);\r\n  --color-hui-gray-20: var(--gray-20, #C9C9C9);\r\n  --color-hui-gray-30: var(--gray-30, #AEAEAE);\r\n  --color-hui-gray-40: var(--gray-40, #939393);\r\n  --color-hui-gray-50: var(--gray-50, #777777);\r\n  --color-hui-gray-60: var(--gray-60, #595959);\r\n  --color-hui-gray-70: var(--gray-70, #393939);\r\n  --color-hui-gray-80: var(--gray-80, #2A2A2A);\r\n  --color-hui-gray-90: var(--gray-90, #191919);\r\n  --color-hui-gray-100: var(--gray-100, #000000);\r\n  --color-hui-red-5: var(--red-05, #FEE7E8);\r\n  --color-hui-red-10: var(--red-10, #FABDC1);\r\n  --color-hui-red-20: var(--red-20, #F59297);\r\n  --color-hui-red-30: var(--red-30, #EE696F);\r\n  --color-hui-red-40: var(--red-40, #E7434A);\r\n  --color-hui-red-50: var(--red-50, #E02128);\r\n  --color-hui-red-60: var(--red-60, #C7000B);\r\n  --color-hui-red-70: var(--red-70, #850F12);\r\n  --color-hui-red-80: var(--red-80, #59080A);\r\n  --color-hui-red-90: var(--red-90, #350305);\r\n  --color-hui-rose-5: var(--rose-05, #FEE5F2);\r\n  --color-hui-rose-10: var(--rose-10, #FCC3E0);\r\n  --color-hui-rose-20: var(--rose-20, #F99AC7);\r\n  --color-hui-rose-30: var(--rose-30, #F470AB);\r\n  --color-hui-rose-40: var(--rose-40, #ED448A);\r\n  --color-hui-rose-50: var(--rose-50, #E61866);\r\n  --color-hui-rose-60: var(--rose-60, #C40054);\r\n  --color-hui-rose-70: var(--rose-70, #811439);\r\n  --color-hui-rose-80: var(--rose-80, #540D24);\r\n  --color-hui-rose-90: var(--rose-90, #330614);\r\n  --color-hui-orange-5: var(--orange-05, #FEF5E8);\r\n  --color-hui-orange-10: var(--orange-10, #FDE2BD);\r\n  --color-hui-orange-20: var(--orange-20, #FCCE92);\r\n  --color-hui-orange-30: var(--orange-30, #F9B766);\r\n  --color-hui-orange-40: var(--orange-40, #F69E39);\r\n  --color-hui-orange-50: var(--orange-50, #F4840C);\r\n  --color-hui-orange-60: var(--orange-60, #C76207);\r\n  --color-hui-orange-70: var(--orange-70, #954304);\r\n  --color-hui-orange-80: var(--orange-80, #642802);\r\n  --color-hui-orange-90: var(--orange-90, #3D1601);\r\n  --color-hui-yellow-5: var(--yellow-05, #FEFCE0);\r\n  --color-hui-yellow-10: var(--yellow-10, #FEF8B8);\r\n  --color-hui-yellow-20: var(--yellow-20, #FEF08A);\r\n  --color-hui-yellow-30: var(--yellow-30, #FDE55C);\r\n  --color-hui-yellow-40: var(--yellow-40, #FCD72E);\r\n  --color-hui-yellow-50: var(--yellow-50, #FCC800);\r\n  --color-hui-yellow-60: var(--yellow-60, #D19F00);\r\n  --color-hui-yellow-70: var(--yellow-70, #9E7400);\r\n  --color-hui-yellow-80: var(--yellow-80, #614500);\r\n  --color-hui-yellow-90: var(--yellow-90, #2E1F00);\r\n  --color-hui-green-5: var(--green-05, #F2FBE9);\r\n  --color-hui-green-10: var(--green-10, #DFF4CC);\r\n  --color-hui-green-20: var(--green-20, #C6E9A8);\r\n  --color-hui-green-30: var(--green-30, #A8DB81);\r\n  --color-hui-green-40: var(--green-40, #87C859);\r\n  --color-hui-green-50: var(--green-50, #62B42E);\r\n  --color-hui-green-60: var(--green-60, #488E20);\r\n  --color-hui-green-70: var(--green-70, #316614);\r\n  --color-hui-green-80: var(--green-80, #1B3E0A);\r\n  --color-hui-green-90: var(--green-90, #0C2004);\r\n  --color-hui-mint-5: var(--mint-05, #E7FBF2);\r\n  --color-hui-mint-10: var(--mint-10, #BCF2DB);\r\n  --color-hui-mint-20: var(--mint-20, #8FE5C2);\r\n  --color-hui-mint-30: var(--mint-30, #63D5A8);\r\n  --color-hui-mint-40: var(--mint-40, #36C18D);\r\n  --color-hui-mint-50: var(--mint-50, #09AA71);\r\n  --color-hui-mint-60: var(--mint-60, #058358);\r\n  --color-hui-mint-70: var(--mint-70, #036142);\r\n  --color-hui-mint-80: var(--mint-80, #02422E);\r\n  --color-hui-mint-90: var(--mint-90, #00291D);\r\n  --color-hui-cyan-5: var(--cyan-05, #E8FCFD);\r\n  --color-hui-cyan-10: var(--cyan-10, #C9F6F9);\r\n  --color-hui-cyan-20: var(--cyan-20, #A4ECF1);\r\n  --color-hui-cyan-30: var(--cyan-30, #7DDFE7);\r\n  --color-hui-cyan-40: var(--cyan-40, #55CCD9);\r\n  --color-hui-cyan-50: var(--cyan-50, #2CB8C9);\r\n  --color-hui-cyan-60: var(--cyan-60, #1C94A4);\r\n  --color-hui-cyan-70: var(--cyan-70, #127180);\r\n  --color-hui-cyan-80: var(--cyan-80, #094C57);\r\n  --color-hui-cyan-90: var(--cyan-90, #04282F);\r\n  --color-hui-blue-5: var(--blue-05, #EEF3FE);\r\n  --color-hui-blue-10: var(--blue-10, #D0D8FD);\r\n  --color-hui-blue-20: var(--blue-20, #B0BFFD);\r\n  --color-hui-blue-30: var(--blue-30, #8CA3FA);\r\n  --color-hui-blue-40: var(--blue-40, #668CF7);\r\n  --color-hui-blue-50: var(--blue-50, #2070F3);\r\n  --color-hui-blue-60: var(--blue-60, #1F55B5);\r\n  --color-hui-blue-70: var(--blue-70, #1B3F86);\r\n  --color-hui-blue-80: var(--blue-80, #112857);\r\n  --color-hui-blue-90: var(--blue-90, #081635);\r\n  --color-hui-indigo-5: var(--indigo-05, #EEEEFE);\r\n  --color-hui-indigo-10: var(--indigo-10, #D5D3FD);\r\n  --color-hui-indigo-20: var(--indigo-20, #BFB9FA);\r\n  --color-hui-indigo-30: var(--indigo-30, #A89FF9);\r\n  --color-hui-indigo-40: var(--indigo-40, #8E81F4);\r\n  --color-hui-indigo-50: var(--indigo-50, #715AFB);\r\n  --color-hui-indigo-60: var(--indigo-60, #5531EB);\r\n  --color-hui-indigo-70: var(--indigo-70, #3F21B5);\r\n  --color-hui-indigo-80: var(--indigo-80, #281675);\r\n  --color-hui-indigo-90: var(--indigo-90, #160B48);\r\n  --color-hui-purple-5: var(--purple-05, #F7EDFE);\r\n  --color-hui-purple-10: var(--purple-10, #E8CFFE);\r\n  --color-hui-purple-20: var(--purple-20, #D9B1FD);\r\n  --color-hui-purple-30: var(--purple-30, #CB8EFB);\r\n  --color-hui-purple-40: var(--purple-40, #BF68FA);\r\n  --color-hui-purple-50: var(--purple-50, #B62BF7);\r\n  --color-hui-purple-60: var(--purple-60, #8A21BC);\r\n  --color-hui-purple-70: var(--purple-70, #651B8B);\r\n  --color-hui-purple-80: var(--purple-80, #41125A);\r\n  --color-hui-purple-90: var(--purple-90, #260937);\r\n  --color-hui-pink-5: var(--pink-05, #FDE6FC);\r\n  --color-hui-pink-10: var(--pink-10, #F9C5F6);\r\n  --color-hui-pink-20: var(--pink-20, #F39DEC);\r\n  --color-hui-pink-30: var(--pink-30, #EB74DF);\r\n  --color-hui-pink-40: var(--pink-40, #E049CE);\r\n  --color-hui-pink-50: var(--pink-50, #D41DBC);\r\n  --color-hui-pink-60: var(--pink-60, #9F1C8D);\r\n  --color-hui-pink-70: var(--pink-70, #751868);\r\n  --color-hui-pink-80: var(--pink-80, #4C0F43);\r\n  --color-hui-pink-90: var(--pink-90, #2E0728);\r\n\r\n /* ── hui 语义色 ── */\r\n  --color-hui-brand-color: var(--color-brand);\r\n  --color-hui-brand-hover: var(--color-brand-hover);\r\n  --color-hui-brand-focus: var(--color-brand-focus);\r\n  --color-hui-brand-active: var(--color-brand-active);\r\n  --color-hui-brand-disabled: var(--color-brand-disabled);\r\n  --color-hui-text-primary: var(--color-text-primary);\r\n  --color-hui-text-secondary: var(--color-text-secondary);\r\n  --color-hui-text-placeholder: var(--color-text-placeholder);\r\n  --color-hui-text-disabled: var(--color-text-disabled);\r\n  --color-hui-text-inverse: var(--color-text-inverse);\r\n  --color-hui-text-inverse-disabled: var(--color-text-inverse-disabled);\r\n  --color-hui-text-on: var(--color-text-on);\r\n  --color-hui-link: var(--color-link);\r\n  --color-hui-link-hover: var(--color-link-hover);\r\n  --color-hui-link-active: var(--color-link-active);\r\n  --color-hui-link-visited: var(--color-link-visited);\r\n  --color-hui-link-disabled: var(--color-link-disabled);\r\n  --color-hui-bg-1: var(--color-bg-1);\r\n  --color-hui-bg-2: var(--color-bg-2);\r\n  --color-hui-bg-3: var(--color-bg-3);\r\n  --color-hui-bg-4: var(--color-bg-4);\r\n  --color-hui-bg-5: var(--color-bg-5);\r\n  --color-hui-bg-6: var(--color-bg-6);\r\n  --color-hui-bg-mask: var(--color-bg-mask);\r\n  --color-hui-fill-disabled: var(--color-fill-disabled);\r\n  --color-hui-hover: var(--color-hover);\r\n  --color-hui-fill-disabled-subtle: var(--color-fill-disabled-subtle);\r\n  --color-hui-fill: var(--color-fill);\r\n  --color-hui-select: var(--color-select);\r\n  --color-hui-fill-subtle: var(--color-fill-subtle);\r\n  --color-hui-icon-primary: var(--color-icon-primary);\r\n  --color-hui-icon-secondary: var(--color-icon-secondary);\r\n  --color-hui-icon-tertiary: var(--color-icon-tertiary);\r\n  --color-hui-icon-placeholder: var(--color-icon-placeholder);\r\n  --color-hui-icon-disabled: var(--color-icon-disabled);\r\n  --color-hui-icon-inverse: var(--color-icon-inverse);\r\n  --color-hui-icon-hover: var(--color-icon-hover);\r\n  --color-hui-icon-focus: var(--color-icon-focus);\r\n  --color-hui-icon-active: var(--color-icon-active);\r\n  --color-hui-border-color: var(--color-border);\r\n  --color-hui-border-hover: var(--color-border-hover);\r\n  --color-hui-border-focus: var(--color-border-focus);\r\n  --color-hui-border-active: var(--color-border-active);\r\n  --color-hui-border-disabled: var(--color-border-disabled);\r\n  --color-hui-border-separator: var(--color-border-separator);\r\n  --color-hui-border-separator-sbutle: var(--color-border-separator-sbutle);\r\n  --color-hui-error: var(--color-error);\r\n  --color-hui-error-hover: var(--color-error-hover);\r\n  --color-hui-error-active: var(--color-error-active);\r\n  --color-hui-error-disabled: var(--color-error-disabled);\r\n  --color-hui-error-subtle: var(--color-error-subtle);\r\n  --color-hui-error-subtler: var(--color-error-subtler);\r\n  --color-hui-alert: var(--color-alert);\r\n  --color-hui-alert-hover: var(--color-alert-hover);\r\n  --color-hui-alert-active: var(--color-alert-active);\r\n  --color-hui-alert-disabled: var(--color-alert-disabled);\r\n  --color-hui-alert-subtle: var(--color-alert-subtle);\r\n  --color-hui-alert-subtler: var(--color-alert-subtler);\r\n  --color-hui-warning: var(--color-warning);\r\n  --color-hui-warning-hover: var(--color-warning-hover);\r\n  --color-hui-warning-active: var(--color-warning-active);\r\n  --color-hui-warning-disabled: var(--color-warning-disabled);\r\n  --color-hui-warning-bold: var(--color-warning-bold);\r\n  --color-hui-warning-subtle: var(--color-warning-subtle);\r\n  --color-hui-warning-subtler: var(--color-warning-subtler);\r\n  --color-hui-success: var(--color-success);\r\n  --color-hui-success-hover: var(--color-success-hover);\r\n  --color-hui-success-active: var(--color-success-active);\r\n  --color-hui-success-disabled: var(--color-success-disabled);\r\n  --color-hui-success-subtle: var(--color-success-subtle);\r\n  --color-hui-success-subtler: var(--color-success-subtler);\r\n  --color-hui-info-primary: var(--color-info-primary);\r\n  --color-hui-info-primary-subtle: var(--color-info-primary-subtle);\r\n  --color-hui-info-primary-subtler: var(--color-info-primary-subtler);\r\n  --color-hui-info-secondary: var(--color-info-secondary);\r\n  --color-hui-info-secondary-hover: var(--color-info-secondary-hover);\r\n  --color-hui-info-secondary-active: var(--color-info-secondary-active);\r\n  --color-hui-info-secondary-disabled: var(--color-info-secondary-disabled);\r\n  --color-hui-info-secondary-subtle: var(--color-info-secondary-subtle);\r\n  --color-hui-none: var(--color-none);\r\n  --color-hui-none-hover: var(--color-none-hover);\r\n  --color-hui-none-active: var(--color-none-active);\r\n  --color-hui-none-disabled: var(--color-none-disabled);\r\n  --color-hui-none-subtle: var(--color-none-subtle);\r\n  --color-hui-chart-1: var(--color-chart-1);\r\n  --color-hui-chart-2: var(--color-chart-2);\r\n  --color-hui-chart-3: var(--color-chart-3);\r\n  --color-hui-chart-4: var(--color-chart-4);\r\n  --color-hui-chart-5: var(--color-chart-5);\r\n  --color-hui-chart-6: var(--color-chart-6);\r\n  --color-hui-chart-7: var(--color-chart-7);\r\n  --color-hui-chart-8: var(--color-chart-8);\r\n  --color-hui-chart-9: var(--color-chart-9);\r\n  --color-hui-chart-10: var(--color-chart-10);\r\n  --color-hui-chart-11: var(--color-chart-11);\r\n  --color-hui-chart-12: var(--color-chart-12);\r\n  --color-hui-chart-13: var(--color-chart-13);\r\n  --color-hui-chart-14: var(--color-chart-14);\r\n  --color-hui-chart-15: var(--color-chart-15);\r\n  --color-hui-chart-16: var(--color-chart-16);\r\n  --color-hui-chart-17: var(--color-chart-17);\r\n  --color-hui-chart-18: var(--color-chart-18);\r\n  --color-hui-chart-19: var(--color-chart-19);\r\n  --color-hui-chart-20: var(--color-chart-20);\r\n  --color-hui-chart-21: var(--color-chart-21);\r\n  --color-hui-chart-22: var(--color-chart-22);\r\n  --color-hui-chart-23: var(--color-chart-23);\r\n  --color-hui-chart-24: var(--color-chart-24);\r\n  --color-hui-chart-25: var(--color-chart-25);\r\n  --color-hui-scrollbar: var(--color-scrollbar);\r\n  --color-hui-scrollbar-hover: var(--color-scrollbar-hover);\r\n  --color-hui-card-gray-disabled: var(--color-card-gray-disabled);\r\n  --color-hui-card-white-disabled: var(--color-card-white-disabled);\r\n  --color-hui-sidenav-bg: var(--color-sidenav-bg);\r\n  --color-hui-table-header: var(--color-table-header);\r\n  --color-hui-table-zebra: var(--color-table-zebra);\r\n  --color-hui-message-bg-info: var(--color-message-bg-info);\r\n  --color-hui-message-bg-success: var(--color-message-bg-success);\r\n  --color-hui-message-bg-warning: var(--color-message-bg-warning);\r\n  --color-hui-message-bg-alert: var(--color-message-bg-alert);\r\n  --color-hui-message-bg-error: var(--color-message-bg-error);\r\n  --color-hui-alert-urgent: #F43146;\r\n  --color-hui-alert-primary: #EC6F1A;\r\n  --color-hui-alert-secondary: #EEBA18;\r\n  --color-hui-alert-success: #2DA769;\r\n  --color-hui-alert-running: #5990FD;\r\n  --color-hui-alert-none: #939393;\r\n  --color-hui-table-1: var(--color-table-1);\r\n  --color-hui-table-2: var(--color-table-2);\r\n  --color-hui-table-sticky-1: var(--color-table-sticky-1);\r\n  --color-hui-table-sticky-2: var(--color-table-sticky-2);\r\n  --color-hui-table-sticky-bg: var(--color-table-sticky-bg);\r\n  --color-hui-table-sticky-header: var(--color-table-sticky-header);\r\n  --color-hui-tag-text-purple: var(--color-tag-text-purple);\r\n  --color-hui-tag-bg-purple: var(--color-tag-bg-purple);\r\n  --color-hui-tag-text-cyan: var(--color-tag-text-cyan);\r\n  --color-hui-tag-bg-cyan: var(--color-tag-bg-cyan);\r\n  --color-hui-tag-text-rose: var(--color-tag-text-rose);\r\n  --color-hui-tag-bg-rose: var(--color-tag-bg-rose);\r\n  --color-hui-tag-text-green: var(--color-tag-text-green);\r\n  --color-hui-tag-bg-green: var(--color-tag-bg-green);\r\n  --color-hui-tag-text-pink: var(--color-tag-text-pink);\r\n  --color-hui-tag-bg-pink: var(--color-tag-bg-pink);\r\n  --color-hui-tag-text-indigo: var(--color-tag-text-indigo);\r\n  --color-hui-tag-bg-indigo: var(--color-tag-bg-indigo);\r\n  --color-hui-tag-text-none: var(--color-tag-text-none);\r\n  --color-hui-tag-bg-none: var(--color-tag-bg-none);\r\n  --color-hui-tag-text-error: var(--color-tag-text-error);\r\n  --color-hui-tag-bg-error: var(--color-tag-bg-error);\r\n  --color-hui-tag-text-alert: var(--color-tag-text-alert);\r\n  --color-hui-tag-bg-alert: var(--color-tag-bg-alert);\r\n  --color-hui-tag-text-warning: var(--color-tag-text-warning);\r\n  --color-hui-tag-bg-warning: var(--color-tag-bg-warning);\r\n  --color-hui-tag-text-success: var(--color-tag-text-success);\r\n  --color-hui-tag-bg-success: var(--color-tag-bg-success);\r\n  --color-hui-tag-text-info: var(--color-tag-text-info);\r\n  --color-hui-tag-bg-info: var(--color-tag-bg-info);\r\n}\n    ",
                       "type":  "text/tailwindcss"
                   }
               ]
};
// __A2UI_FILE_META_END__
class PreviewRenderer {
  constructor(options = {}) {
    this.options = {
      container: options.container || null,
      distPath: options.distPath || this._getDefaultDistPath(),
      dataPath: options.dataPath || null,
      data: options.data || null,
      autoInit: options.autoInit !== false,
      useIframe: options.useIframe || false,
      replace: options.replace !== false,
      onError: options.onError || null,
      onDataLoad: options.onDataLoad || null,
      onRender: options.onRender || null,
    };

    this.container = null;
    this.iframe = null;
    this.initialized = false;
    this.data = null;

    if (this.options.autoInit) {
      this.init();
    }
  }

  async init() {
    if (this.initialized) {
      return this;
    }

    if (!this.options.container) {
      this._handleError(new Error('PreviewRenderer: `container` option is required'));
      return this;
    }

    this.container = this._getContainer();
    if (!this.container) {
      this._handleError(new Error(`Container not found: ${this.options.container}`));
      return this;
    }

    try {
      if (this.options.useIframe) {
        await this._initWithIframe();
      } else {
        await this._initDirect();
      }

      this.initialized = true;
      this._handleRender();
      return this;
    } catch (error) {
      this._handleError(error);
      return this;
    }
  }

  _getDefaultDistPath() {
    const segments = window.location.pathname.split('/');
    segments.pop();
    segments.pop();
    segments.push('previewdist');
    return segments.join('/');
  }

  _getContainer() {
    if (typeof this.options.container === 'string') {
      return document.querySelector(this.options.container);
    }
    return this.options.container;
  }

  // 双模式清容器（见 WORKFLOW.md）：replace:true 清空宿主内容；false 仅移除自产节点（幂等重挂）。
  // 顺带把 static 容器钉成 relative，供 appDiv/iframe 的百分比尺寸与绝对定位正确解析。
  _prepareTarget(selfSelector) {
    const target = this.container;
    if (this.options.replace) {
      target.innerHTML = '';
    } else {
      Array.from(target.querySelectorAll(`:scope > ${selfSelector}`)).forEach(el => el.remove());
    }
    if (window.getComputedStyle(target).position === 'static') {
      target.style.position = 'relative';
    }
  }

  // 串行逐个加载脚本，加载完即移除标签（旧构建兜底重挂时复用以重新执行 IIFE）
  _loadScriptOnce(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => { s.remove(); resolve(); };
      s.onerror = () => { s.remove(); reject(new Error(`Failed to load script: ${url}`)); };
      document.head.appendChild(s);
    });
  }

  _loadScripts(scripts) {
    return scripts.reduce((chain, src) => chain.then(() => this._loadScriptOnce(src)), Promise.resolve());
  }

  _isFileProtocol() {
    return typeof window !== 'undefined' && window.location.protocol === 'file:';
  }

  // 应用元信息：file:// 用本文件内嵌块（validate-and-sync.ps1 -GenMeta 生成，来源 ict-coder 运行时）；
  // http 走 fetch 解析 previewdist 入口页——依次尝试 index.html（项目根运行时）与
  // index.prototype.html（ict-coder 本地运行时，页面本地化副本的标准入口）。
  // 两条路径统一存「原始 src」（./ 前缀），使用处再按 distPath 归一化。
  // 注：ict-coder bundle 无 __A2UI_BOOT__ 工厂出口，自动落入「旧构建兜底」（#app 挂载，
  // 每节点重执行 IIFE）——功能等价，仅多节点时每节点多一次 bundle 解析。
  async _getAppMeta(distPath) {
    if (this._isFileProtocol()) {
      if (!__A2UI_EMBEDDED_META__ || !__A2UI_EMBEDDED_META__.scripts) {
        throw new Error('Embedded app meta missing: run validate-and-sync.ps1 -GenMeta in .opencode/skills/ict-html-mix/scripts/ (then bump host ?v=)');
      }
      return __A2UI_EMBEDDED_META__;
    }
    if (!PreviewRenderer._appMeta) {
      let resp = await fetch(`${distPath}/index.html`);
      if (!resp.ok) resp = await fetch(`${distPath}/index.prototype.html`);
      if (!resp.ok) throw new Error(`Failed to load ${distPath}/index.html (also tried index.prototype.html)`);
      const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
      PreviewRenderer._appMeta = {
        styles: Array.from(doc.querySelectorAll('style')).map(s => ({
          text: s.textContent,
          type: s.getAttribute('type'),
        })),
        scripts: Array.from(doc.querySelectorAll('script[src]'))
          .map(s => s.getAttribute('src'))
          .filter(src => src && !src.includes('data.js')),
      };
    }
    return PreviewRenderer._appMeta;
  }

  async _initWithIframe() {
    this._prepareTarget('.preview-a2ui-iframe');

    this.iframe = document.createElement('iframe');
    this.iframe.className = 'preview-a2ui-iframe';
    this.iframe.style.cssText = 'position:absolute;inset:0;border:none;display:block;width:100%;height:100%;';
    this.iframe.src = `${this.options.distPath}/index.html`;
    this.container.appendChild(this.iframe);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Iframe load timeout'));
      }, 10000);

      this.iframe.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      this.iframe.onerror = () => {
        reject(new Error('Failed to load iframe'));
      };
    });
  }

  async _initDirect() {
    const distPath = this.options.distPath;

    // 1. 应用元信息（styles + scripts 清单）：file:// 用本文件内嵌块，http 走 fetch
    const meta = await this._getAppMeta(distPath);
    const scriptUrls = meta.scripts.map(src => src.startsWith('./') ? `${distPath}/${src.slice(2)}` : src);

    // 2. 全局样式只注入一次（@theme / tailwind 运行时主题）+ 高度链垫片：
    //    垫片强制应用外壳（PreviewPage 的 h-screen 链）填满 #app（=容器尺寸），避免直接模式下
    //    100vh 把卡片撑爆；同时钉稳 shell→content-wrap→a2ui-surface 整条百分比高度链（图表卡
    //    无内在高度，链断即永久空渲染）。overflow:hidden 覆盖 PreviewPage 根的 overflow-auto：
    //    定尺寸预览卡挂载瞬间的布局抖动会闪滚动条，内容 w-full h-full 本就贴合，裁剪无副作用。
    //    仅作用外壳层，不触碰卡片内部 flex 布局。
    if (!PreviewRenderer._stylesInjected) {
      PreviewRenderer._stylesInjected = true;
      meta.styles.forEach(s => {
        const ns = document.createElement('style');
        ns.textContent = s.text;
        if (s.type) ns.setAttribute('type', s.type);
        document.head.appendChild(ns);
      });
      const shim = document.createElement('style');
      shim.textContent = '.preview-a2ui-app>div,.preview-a2ui-app>div>div,.preview-a2ui-app .a2ui-surface{height:100%;max-height:100%;}.preview-a2ui-app,.preview-a2ui-app>div{overflow:hidden}';
      document.head.appendChild(shim);
    }

    // 3. 设置本实例数据（PreviewPage onMounted 读取 window.__A2UI_DATA__；调用方必须串行）
    if (this.options.data) {
      window.__A2UI_DATA__ = this.options.data;
    } else if (this.options.dataPath) {
      if (/\.js(\?|$)/i.test(this.options.dataPath)) {
        // dataPath 直接指向自带 wrapper 的 data.js（ict-coder 产物格式：window.__A2UI_DATA__ = {...}）：
        // script 标签加载（http/file:// 通用，不受 fetch 的 file:// CORS 限制），文件自身写 __A2UI_DATA__，
        // 此处无需（也不得）再赋值；时间戳防缓存（等价 fetch 分支的 no-store）。天然免 .data.js 孪生。
        const sep = this.options.dataPath.includes('?') ? '&' : '?';
        await this._loadScriptOnce(`${this.options.dataPath}${sep}t=${Date.now()}`);
        if (!window.__A2UI_DATA__ && window.__A2UI_FILE_DATA__) {
          // 兜底：误指向 .data.js 孪生（写 __A2UI_FILE_DATA__）时取用之
          window.__A2UI_DATA__ = window.__A2UI_FILE_DATA__;
        }
        if (typeof window.__A2UI_DATA__ === 'undefined' || !window.__A2UI_DATA__) {
          throw new Error(`data.js loaded but window.__A2UI_DATA__ missing/empty: ${this.options.dataPath}`);
        }
      } else if (this._isFileProtocol()) {
        // file:// 免服务器：JSON 改走孪生 .data.js（script 标签不受 CORS 限制）；时间戳防 file 缓存
        const twin = this.options.dataPath.replace(/\.json$/, '.data.js');
        delete window.__A2UI_FILE_DATA__;
        await this._loadScriptOnce(`${twin}?t=${Date.now()}`);
        if (typeof window.__A2UI_FILE_DATA__ === 'undefined') {
          throw new Error(`Data twin missing/invalid: ${twin} (re-run validate-and-sync.ps1 in ict-html-mix skill scripts)`);
        }
        window.__A2UI_DATA__ = window.__A2UI_FILE_DATA__;
      } else {
        const dr = await fetch(this.options.dataPath, { cache: 'no-store' });
        window.__A2UI_DATA__ = dr.ok ? await dr.json() : null;
      }
    } else {
      // 默认数据 previewdist/data.js：其自身代码会写入 window.__A2UI_DATA__
      if (this._isFileProtocol()) {
        await this._loadScriptOnce(`${distPath}/data.js`);
      } else {
        if (!PreviewRenderer._defaultDataJs) {
          const dr = await fetch(`${distPath}/data.js`);
          PreviewRenderer._defaultDataJs = dr.ok ? await dr.text() : '';
        }
        try { (new Function(PreviewRenderer._defaultDataJs))(); } catch (e) { /* ignore */ }
      }
    }

    // 4. 本实例挂载点（工厂模式直接 mount 到该元素，不需要 #app id）
    this._prepareTarget('.preview-a2ui-app');
    const appDiv = document.createElement('div');
    appDiv.className = 'preview-a2ui-app';   // 稳定标记类：垫片 CSS 锚点 + 「只删自产节点」清理锚点
    this._appDiv = appDiv;                   // 记录自产节点，destroy 时只删它
    // 显式 width/height:100%（而非 inset:0）：inset 简写在某些 cssText 解析下 bottom 不生效，
    // appDiv 会退化成内容高度 → 整条 height:100% 链断裂。父级容器有确定高度，百分比可正确解析。
    appDiv.style.cssText = 'width:100%;height:100%;';
    this.container.appendChild(appDiv);

    // 5. 工厂模式：整条 bundle 只解析执行一次，之后每个节点调 window.__A2UI_BOOT__ 挂载
    //    （不再每节点重解析+重执行 IIFE）；置多实例标志 → bundle 暴露工厂而非自动 mount('#app')
    window.__A2UI_MULTI__ = true;
    if (!PreviewRenderer._bundleLoaded) {
      PreviewRenderer._bundleLoaded = this._loadScripts(scriptUrls);
    }
    await PreviewRenderer._bundleLoaded;

    if (typeof window.__A2UI_BOOT__ === 'function') {
      // 新构建：工厂挂载，每实例只付 createApp+mount 成本。
      // 先隐藏挂载点：首帧 flex 链/Tailwind 运行时/chart init 未稳定时，内容会按错误（偏小）尺寸
      // 渲染再跳变；chart 无自身 ResizeObserver，但 HuiCharts 监听 window.resize，故布局落定后
      // （双 rAF + 20ms）派发一次 resize 让 chart 重算到稳定尺寸，再显现。
      appDiv.style.opacity = '0';
      window.__A2UI_BOOT__(appDiv);
      this._settleAndReveal(appDiv);
    } else {
      // 旧构建兜底：重新执行 IIFE，按 #app 挂载（每节点重解析一次）。
      // 视觉对齐工厂分支：装载（=挂载）前先隐藏，bundle 执行完、布局落定后再显现——
      // 慢（重复解析）不可免，但让用户看不见中间态。
      const prevApp = document.getElementById('app');
      if (prevApp) prevApp.removeAttribute('id');
      appDiv.style.opacity = '0';
      appDiv.id = 'app';
      await this._loadScripts(scriptUrls);
      this._settleAndReveal(appDiv);
    }
  }

  // 布局落定后显现（假定调用方已 opacity:0 隐藏）：双 rAF + 20ms 等 flex 链/Tailwind 运行时/
  // chart init 稳定，派发一次 window.resize（HuiCharts 监听）让 chart 按最终尺寸重算，再淡入。
  _settleAndReveal(appDiv) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        appDiv.style.opacity = '1';
      }, 20);
    }));
  }

  async loadData(source) {
    let data;

    if (typeof source === 'string') {
      if (source.startsWith('http') || source.startsWith('/') || source.startsWith('./')) {
        data = await this._loadFromUrl(source);
      } else {
        data = JSON.parse(source);
      }
    } else if (source instanceof File) {
      data = await this._loadFromFile(source);
    } else if (typeof source === 'object') {
      data = source;
    } else {
      throw new Error('Invalid data source');
    }

    this.data = data;

    if (this.options.useIframe && this.iframe) {
      this.iframe.contentWindow.postMessage({
        type: 'A2UI_UPDATE',
        payload: data
      }, '*');
    } else {
      window.__A2UI_DATA__ = data;
      if (window.__A2UI_UPDATE__) {
        window.__A2UI_UPDATE__(data);
      }
    }

    if (this.options.onDataLoad) {
      this.options.onDataLoad(data);
    }

    return this;
  }

  async _loadFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load data from ${url}`);
    }
    return await response.json();
  }

  async _loadFromFile(file) {
    const text = await file.text();
    return JSON.parse(text);
  }

  _handleError(error) {
    console.error('PreviewRenderer Error:', error);

    if (this.options.onError) {
      this.options.onError(error);
    } else {
      this._showDefaultError(error);
    }
  }

  // 错误提示为追加式（任何模式都不破坏容器内容）：
  // 仅移除本渲染器先前注入的错误提示（幂等），再追加新的。
  _showDefaultError(error) {
    if (!this.container) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'preview-renderer-error';
    errorDiv.style.cssText = `
      padding: 20px;
      background: #ffebee;
      border: 1px solid #ef5350;
      border-radius: 8px;
      color: #c62828;
      margin: 20px;
      font-family: sans-serif;
    `;
    errorDiv.innerHTML = `
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">预览加载失败</h3>
      <p style="margin: 0; font-size: 14px;">${error.message}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
        请确保 previewdist 已构建完成
      </p>
    `;
    Array.from(this.container.querySelectorAll(':scope > .preview-renderer-error')).forEach(el => el.remove());
    this.container.appendChild(errorDiv);
  }

  _handleRender() {
    if (this.options.onRender) {
      this.options.onRender(this.container);
    }
  }

  setContainer(selector) {
    this.options.container = selector;
    this.container = this._getContainer();
    return this;
  }

  setDistPath(path) {
    this.options.distPath = path;
    return this;
  }

  setDataPath(path) {
    this.options.dataPath = path;
    return this;
  }

  destroy() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
    // 只删自产节点：移除本实例的挂载点，不触碰宿主原有内容
    if (this._appDiv) {
      this._appDiv.remove();
      this._appDiv = null;
    }
    this.container = null;
    this.initialized = false;
    this.data = null;
    return this;
  }
}

if (typeof window !== 'undefined') {
  window.PreviewRenderer = PreviewRenderer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreviewRenderer;
}
