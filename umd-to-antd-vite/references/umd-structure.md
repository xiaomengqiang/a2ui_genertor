# UMD 源项目结构特征与提取细节

> ict-react-coder 产出的 UMD 单 HTML 工程的结构特征，以及 `extract-umd.cjs` 如何处理这些结构。

## 1. 典型结构

ict-react-coder 产物的 `index.page.html` 是一个 UMD runner，整个应用内联在单个 HTML 文件里：

```
index.page.html (~2000 行)
├── UMD script 标签     react/react-dom/dayjs/antd/babel 的 UMD 构建
├── 内联 CSS token      ~1030 行，~666 个 CSS 变量定义
│   ├── 第 1 层 :root   ~260 个原始色阶（--brand-05~--brand-90、--gray-0~--gray-100 等）
│   ├── 第 2 层 :root   ~200 个语义化 token（--color-text-primary、--color-brand 等）
│   ├── 第 3 层 :root   ~100 个角色化 token（--primary、--surface、--on-surface 等）
│   └── .dark           ~200 个暗色覆盖
├── base 样式           全局重置
├── Babel preset 注册   @babel/preset-react + @babel/preset-env
├── antd-zh-cn.js       antd 中文 locale（内联）
├── context.jsx         React Context（内联）
├── icons.js            自定义图标组件（内联，icon-plus 在线 + Lucide 兜底）
├── data.js             数据/常量（内联）
├── *.jsx               各表单/视图组件（内联）
├── AppShell.jsx        布局壳（内联）
├── app.jsx             根组件 + ConfigProvider（内联）
└── render              ReactDOM.render
```

同时 `src/` 目录下也有独立源文件，代码存在两份：HTML 内联版用于即时预览，`src/` 版用于工程化。

## 2. 内联 token CSS 的三层结构

### 2.1 为什么需要外置

迁移到 Vite 后，`index.page.html` 不能用了（UMD runner），666 个变量定义全部跟着 HTML 一起丢失。`src/` 下的 CSS 文件还在引用 `var(--surface-container-highest)`，但没有地方定义这个变量。

`extract-umd.cjs` 自动把 token 定义从 HTML 内联提取到独立 CSS 文件，与 antd 的样式并存。两套变量名不冲突，布局 CSS 一行不用改。

### 2.2 提取逻辑

`extract-umd.cjs` 用括号计数法拆分顶层 CSS 规则：

1. 从 HTML 提取所有 `<style>` 块内容，拼接成一个大 CSS 字符串
2. 遍历字符，按 `{` 和 `}` 深度拆分顶层规则块
3. 按选择器分类：
   - `:root` → `tokens.css`（多个 :root 块原样保留，CSS 级联中后声明覆盖先声明）
   - `.dark` → `theme-dark.css`
   - `@font-face` → `font.css`
   - `@media` → 递归提取内部规则，按选择器分类到对应文件，保留 `@media` 声明包裹
   - 其他（`.shell-header` 等）→ `base.css` 追加

### 2.3 变量计数

脚本统计 `:root` 和 `.dark` 中的 CSS 变量数（`--xxx:` 匹配），输出报告。典型产物：tokens.css ~666 个变量，theme-dark.css ~200 个变量。

## 3. script 块的提取与文件名推断

### 3.1 何时提取

- 源项目有 `src/` 目录 → `extract-umd.cjs` 列出 `src/` 文件清单，**不提取 script 块**（优先用独立文件）
- 源项目无 `src/` 目录 → 自动提取 script 块到 `_extracted/`
- 显式 `--scripts` → 始终提取 script 块（用于和 `src/` 版交叉校验）

### 3.2 文件名推断优先级

1. 首行注释 `// xxx.jsx` 或 `/* xxx.js */` → 用注释中的文件名
2. `export default function Name` → `Name.jsx`
3. `export function Name` → `Name.jsx`
4. `const Name =` 且首字母大写 → `Name.jsx`（组件）
5. `const name =` 小写 → `name.js`（非组件）
6. `function name` → `name.jsx`
7. 以上都不匹配 → `block-001.jsx`（序号）

### 3.3 注意

文件名为推断，可能不准。子 agent 搬代码时需人工核对 `_extracted/` 中的文件名，整理到 `src/` 正确目录结构。

## 4. src/ 双份代码的一致性问题

### 4.1 问题

源项目有 `index.page.html` 内联版和 `src/` 独立版两份代码。两份之间靠人工同步，可能不一致。

### 4.2 处理策略

- **优先用 `src/` 独立文件**：`extract-umd.cjs` 列出 `src/` 文件清单后，子 agent 直接搬 `src/` 文件
- **token CSS 始终从 HTML 提取**：因为 `src/` 下的 CSS 文件引用 `var(--xxx)` 但变量定义在 HTML 内联的 `<style>` 里，`src/` 没有变量定义
- **交叉校验**：如果怀疑不一致，用 `--scripts` 提取 HTML 内联版，和 `src/` 版 diff 比对

## 5. 图标组件的处理

### 5.1 源项目 icon 组件结构

源项目的 icon 组件（通常 `assets/shared/icon.jsx` 或 `icons.js`）做三件事：

1. **Lucide SVG path 表**：`lucide-icon-nodes.json`（~763KB），离线兜底
2. **运行时 fetch icon-plus 在线**：`fetch(getConfig)` 探测 → `fetch(getIconInfo?keyword=xxx)` 查名 → `fetch(getIcon?url=xxx&style=xxx&color=xxx&fileType=svg)` 取 SVG → `dangerouslySetInnerHTML` 注入
3. **缓存 + 状态管理**：`plusState`、`iconInfoMap`、`svgCache`

### 5.2 转换时保留原版

本 skill **不剥离 Lucide 兜底**（那是 antd-to-eview-react scaffold shim 的工作）。搬入源项目的 `icon.jsx` 内容到 `src/shared/Icon/Icon.jsx`（`export function Icon`→`export default function Icon`，scaffold 的 `index.jsx` 桶 `export { default } from './Icon.jsx'` 已就位），保留三层结构；shim 最终路径 `src/shared/Icon`（默认导出）。

### 5.3 vite.config.js 的 icon-plus proxy

源项目 icon 组件用绝对 URL `https://octo.hdesign.huawei.com` 做 fetch。Vite dev 下直接 fetch 会跨域。scaffold 的 `vite.config.js` 预配了：

1. **transform 插件**：把 `const ICON_API_BASE = "https://octo.hdesign.huawei.com"` 替换为 `const ICON_API_BASE = ""`（走相对路径）
2. **proxy**：`/assetRepository` 代理到 `https://octo.hdesign.huawei.com`

这样 icon 组件的 fetch 从绝对 URL 变成相对 URL，Vite proxy 转发到 icon-plus 服务，避免跨域。

## 6. antd ConfigProvider 与暗色模式

### 6.1 源项目的暗色方案

源项目同时用两种暗色机制：

1. **CSS 变量 + `.dark` 类**：自定义样式（布局、手写组件）通过 CSS 变量翻转，`.dark` 挂 `<html>`
2. **antd `theme.darkAlgorithm`**：antd 组件（Table/Form/Button 等）通过 `ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}` 切换

### 6.2 scaffold 的处理

scaffold 的 `app.jsx` 预配了两种暗色：

```jsx
useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
}, [isDark]);

return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        <div className="root">...</div>
    </ConfigProvider>
);
```

步骤 3 搬入源项目 AppShell 时，保留这段暗色切换逻辑（`.dark` 类 + 嵌套 ConfigProvider）。

> main.jsx 的外层 ConfigProvider 只传 `locale={zhCN}`，不传 theme（theme 由 app.jsx 内层嵌套 ConfigProvider 控制 isDark）。
