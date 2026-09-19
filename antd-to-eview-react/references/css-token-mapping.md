# CSS token 提取指南

> 迁移时**保留源项目的 token 体系**，不做变量名替换。
> 源项目 token 定义提取到独立 CSS 文件，与 eview-react 的 `aui3_1.css` 并存。
> 两套变量名不冲突，布局/手写 CSS 一行不用改。

## 操作步骤

### 1. 提取 token 定义到独立 CSS 文件

从源项目的 `index.page.html`（或内联 `<style>`）中提取 `:root` 和 `.dark` 的变量定义：

```
src/styles/
├── tokens.css          # :root { --brand-50: #0067D1; --gray-90: #191919; ... } 全部原始色阶 + 语义层 + 角色层
└── theme-dark.css      # .dark { --color-text-primary: #FFFFFF; ... } 暗色覆盖
```

提取原则：
- `:root { ... }` 里的所有 `--xxx` 变量定义 → 放进 `tokens.css`
- `.dark { ... }` 里的所有 `--xxx` 变量覆盖 → 放进 `theme-dark.css`
- 不带变量定义的选择器规则（如 `body { ... }`、`#root { ... }`）→ 按需放进 `app.css` 或对应组件 CSS
- `@font-face` 定义 → 放进 `tokens.css` 或单独的 `fonts.css`

### 2. 在入口同时引入两套 CSS

入口的以下 import 已在 `scaffold/src/main.jsx` 写好（拷贝骨架即有），无需手写：

- `import '@nce/eview-react/styles/aui3_1.css'` — eview-react 组件的样式和变量
- `import '@nce/eview-react/styles/aui3_1_dark.css'` — eview-react 暗色组件变量（**必须导入**，否则暗色切换时 eview-react 组件变量不生效）
- `import './styles/base.css'` — 骨架自带全局重置（ev_no_wcag 焦点轮廓）
- `import './styles/tokens.css'` — 原始 token 定义（布局/手写 CSS 引用这套）
- `import './styles/theme-dark.css'` — 原始暗色覆盖

引入顺序：先 `aui3_1.css` 再 `aui3_1_dark.css` 再 `tokens.css` 再 `theme-dark.css`——如果两边有同名变量（实际不会），后者覆盖前者。`.dark` 选择器在 `theme-dark.css` 中、位于 `tokens.css` 的 `:root` 之后，确保暗色覆盖生效。

### 3. 布局/手写 CSS 保持原样

`app-shell.css`、`step-flow.css` 等组件 CSS 文件继续引用原始变量名，一行不改：

```css
/* 不用改——原始 token 仍在 tokens.css 里定义着 */
.shell-header {
    background: var(--surface-container-highest);
    color: var(--on-surface);
    border-bottom: 1px solid var(--divider);
}
.step-panel {
    box-shadow: var(--shadow-card);
    padding: var(--spacing-inset);
}
```

### 4. 暗色模式同时切 `<body>` 和 `<html>` 类名

`aui3_1`（浅色基础）常驻 `<body>`（已在 `index.html` 写死：`<body class="ev_no_wcag aui3_1">`），暗色时叠 `aui3_1_dark`；`.dark` 挂 `<html>`：

```jsx
// 放在持有 isDark 的根组件里（如 scaffold/src/app.jsx）
useEffect(() => {
    document.body.classList.toggle('aui3_1_dark', isDark);          // 挂 <body>，叠加在常驻的 aui3_1 上
    document.documentElement.classList.toggle('dark', isDark);      // 挂 <html>
}, [isDark]);
```

- `aui3_1` 常驻 `<body>`（`index.html` 里写死）→ eview-react 组件浅色基础生效
- `aui3_1_dark` 挂 `<body>`，随 `isDark` 叠加在 `aui3_1` 上 → eview-react 的 `aui3_1.css` 内置暗色变量生效（影响 eview-react 组件）
- `.dark` 挂 `<html>`（document.documentElement）→ `theme-dark.css` 里的暗色覆盖全局生效（影响布局/手写 CSS）
- `<body>` 还保留 `ev_no_wcag`（关闭 eview-react 的 WCAG 无障碍样式覆盖，骨架默认，按需保留）
- `.root` div（app.jsx 的根容器）只作业务根容器，不挂 `aui3_1` 类名

## 为什么两套 token 不冲突

- 原始 token 变量名（`--surface`、`--on-surface`、`--primary`、`--spacing-inset` 等）与 eview-react 变量名（`--colorBackground`、`--colorTextPrimary`、`--colorCommonSelected` 等）**完全不同**
- 全局 `:root` 下两套变量并存，互不覆盖
- eview-react 组件内部只引用自己的变量（`--color*` 系列），不会读到原始 token
- 手写元素（Layout/Menu/Avatar 等）只引用原始 token，不会读到 eview-react 变量
- 两套变量各自独立工作，不会报错

## tokens.css 与 theme-dark.css 的加载顺序

入口 CSS 按以下顺序加载（已在 scaffold 中写好）：

```
aui3_1.css → aui3_1_dark.css → tokens.css → theme-dark.css
```

**关键**：`tokens.css` 中的 `:root` 定义（语义变量、角色变量）会覆盖 `dark.css` / `aui3_1_dark.css` 中同名的 `.dark` 变量吗？

**不会**，因为：
- `tokens.css` 的 `:root` 和 `theme-dark.css` 的 `.dark` 特异性相同（0,1,0），但 `theme-dark.css` 在 `tokens.css` 之后加载，级联中后声明者胜出
- `tokens.css` **只应放 `:root` 定义**，`.dark` 覆盖只放在 `theme-dark.css` 中
- 确保 `.dark` 覆盖中出现所有在 `tokens.css` 的 `:root` 中也被定义的语义/角色变量，否则那些变量在暗色模式下不会翻转

**如果源项目的 `:root` 包含角色变量（如 `--primary`、`--surface`、`--on-surface`）**，这些变量在 `:root` 中定义为对语义变量的惰性引用（如 `--surface: var(--color-bg-1)`）。由于 CSS 变量是惰性求值，当 `.dark` 切换 `--color-bg-1` 的值时，`--surface` 会自动跟随。但如果 `tokens.css` 中也在 `:root` 直接定义了语义变量（如 `--color-bg-1`），则 `theme-dark.css` 的 `.dark` 中**必须**重复覆盖这些语义变量，否则 `tokens.css` 的 `:root` 会在级联中覆盖 `.dark`（两者特异性相同，后加载者胜——`tokens.css` 在 `dark.css` 之后加载）。

最佳实践：
- `tokens.css` 放：基础色阶 + 排版 + 间距 + `@font-face` + `@media` 响应式 + `:root` **角色层**变量（`--primary`、`--surface` 等，这些引用语义变量、惰性求值，不依赖 CSS 加载顺序）
- `tokens.css` **不放**：语义层变量（`--color-bg-1`、`--color-text-primary` 等），这些由 `aui3_1.css` 在 `.aui3_1` 下定义，`aui3_1_dark.css` 在 `.aui3_1_dark` 下覆盖
- `theme-dark.css` 放：`.dark` 下的语义层覆盖 + `.dark` 下的角色层覆盖（如果角色变量在 `:root` 中直接写了色值而非 `var()` 引用，则 `.dark` 中必须显式覆盖）
- 如果源项目的原始 token 用 `:root` 同时定义了语义变量和角色变量，拷贝到 `tokens.css` 后，`theme-dark.css` 必须在 `.dark` 中覆盖**所有**在 `tokens.css` 的 `:root` 中有定义且暗色值不同的变量

## 间距规则

源项目的间距 token（如 `--spacing-inset: 24px`）在 `tokens.css` 里保留，布局 CSS 继续引用 `var(--spacing-inset)`。

如果手写新元素需要间距，沿用源项目的间距体系（`var(--spacing-*)`），或直接写 px/rem 值（4px 整数倍）。不需要切到 eview-react 的 rem 体系。

## 类名规则

- 类名用业务前缀（`app-`，如 `app-menu-item`、`app-card`）
- 不用 `ev_`（eview-react 组件库内部前缀，避免样式冲突）
- 不写死色值（如 `#191919`），用 CSS 变量（原始 token）

## 常见问题

### 源项目 token 是内联在 HTML 里的怎么办？

从 `index.page.html` 的 `<style>` 块里复制 `:root` 和 `.dark` 的内容到独立 CSS 文件。详见 [source-project-guidelines.md](source-project-guidelines.md) §2。

### 源项目没有暗色 token 怎么办？

跳过 `theme-dark.css`，暗色只切 `aui3_1_dark`（eview-react 组件暗色生效，手写元素不跟随暗色）。

### eview-react 组件和手写元素配色不一致怎么办？

可能原始 token 的"主色"和 eview-react 的"选中色"色值不同。如果视觉差异可接受就不用处理；如果需要统一，可以在 `tokens.css` 里把原始 token 的值改成与 eview-react 一致（如 `--primary: var(--colorCommonSelected)`），让原始 token 引用 eview-react 变量值。

### 源项目用的是 px 不是 rem，要不要统一？

不用。保留源项目的间距体系。手写新元素时可以沿用源项目的间距 token 或直接写 px（4px 整数倍）。