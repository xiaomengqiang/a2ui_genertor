# 源项目迁移前规范建议

> 以下建议针对**被转换的 antd 源项目**。如果源项目在生成时就遵循这些规范，
> 迁移到 eview-react 时可以跳过"重建基础设施"阶段，直接聚焦于组件库替换。
>
> 每条建议基于一次真实迁移任务（device-access-wizard 项目）中遇到的实际问题。

---

## 1. 工程结构应标准化

### 1.1 问题

源项目 `device-access-wizard` 是 UMD 单 HTML 运行器：整个应用被内联进 `index.page.html`（2058 行），包含 UMD script 标签、内联 CSS、内联 JS 模块、Babel-standalone 转译器。没有 `package.json`，没有构建工具。

具体结构：

```
index.page.html (2058 行)
├── UMD script 标签     (1-15 行)      react/react-dom/dayjs/antd/babel 的 UMD 构建
├── 内联 CSS token      (16-1045 行)   1030 行、666 个 CSS 变量定义
├── base 样式           (1046-1051)
├── Babel preset 注册   (1054-1061)
├── antd-zh-cn.js       (1063-1360)    295 行 antd 中文 locale，内联
├── context.jsx         (1361-1394)    内联
├── icons.js            (1395-1641)    230 行自定义图标组件，内联
├── data.js             (1642-1715)    内联
├── BasicInfoForm.jsx   (1716-1767)    内联
├── NetworkForm.jsx     (1768-1812)    内联
├── ConfirmForm.jsx     (1813-1854)    内联
├── StepFlow.jsx        (1855-1961)    内联
├── AppShell.jsx        (1962-2024)    内联
├── app.jsx             (2025-2052)    内联
└── render              (2053-2058)
```

同时 `src/` 目录下也有独立源文件，代码存在两份：HTML 内联版用于即时预览，`src/` 版用于工程化。两份之间靠人工同步。

### 1.2 迁移时的影响

迁移到 eview-react 需要执行以下"不该属于组件库迁移"的额外工作：

| 额外工作 | 原因 |
|---------|------|
| 创建 `package.json` | 源项目没有，无法 `npm install @nce/eview-react` |
| 创建 `vite.config.js` | 源项目用 Babel-standalone 在浏览器内转译，无构建工具 |
| 创建 `index.html` | 原来的 `index.page.html` 是 UMD runner，Vite 用不了 |
| 创建 `main.jsx` | ConfigProvider + IntlProvider + aui3_1.css 原来在 HTML 的 script 标签和内联 JS 里 |
| 判断"以哪份代码为准" | `src/` 独立文件 vs `index.page.html` 内联版，需确认一致性 |

### 1.3 建议结构

源项目应使用 Vite + npm 结构：

```
project/
├── package.json           # antd 作为 dependency
├── vite.config.js         # Vite + @vitejs/plugin-react
├── index.html             # 薄入口：<div id="root"> + <script src="/main.jsx">
├── main.jsx               # ReactDOM.render(<App />)
└── src/
    ├── App.jsx
    ├── context.jsx
    ├── data.js
    └── views/
        ├── AppShell.jsx
        └── steps/
```

关键区别：
- **入口是 Vite 的 `index.html`，不是 UMD runner**：`<script type="module" src="/main.jsx">`，不用 Babel-standalone
- **每个源文件独立存在，不内联到 HTML**：改一个文件就改完，不用同步两份
- **`package.json` 有 antd 依赖**：迁移时把 `"antd"` 换成 `"@nce/eview-react"`，`npm install` 就能装新依赖

### 1.4 成本对比

| 步骤 | UMD 工程（现状） | Vite 工程（改进后） |
|------|-----------------|-------------------|
| 建工程骨架 | 30-45 分钟（写 5 个新文件） | 0（已有） |
| 装依赖 | 需要配 .npmrc + npm install | 只改 package.json 的依赖名 |
| 入口改造 | 重新写 main.jsx + index.html | main.jsx 只改 Provider 组件 |
| 代码一致性 | 需判断 HTML 内联版 vs src/ 版 | 只有一份代码 |

---

## 2. Token CSS 应外置且分层

### 2.1 问题

`index.page.html` 的 `<style>` 块有 **1030 行、666 个 CSS 变量定义**，分 3 层 `:root`：

| 层 | 变量数 | 内容 |
|----|--------|------|
| 第 1 层 `:root` | ~260 | 原始色阶（`--brand-05`~`--brand-90`、`--gray-0`~`--gray-100`、红/橙/黄/绿/青/蓝/靛/紫/粉各 10 级） |
| 第 2 层 `:root` | ~200 | 语义化 token（`--color-text-primary`、`--color-brand`、`--color-border`、告警色、图表色、标签色、阴影） |
| 第 3 层 `:root` | ~100 | 角色化 token（`--primary`、`--surface`、`--on-surface`、`--divider`、间距、字号简写） |
| `.dark` | ~200 | 暗色覆盖（覆盖第 2 层的语义值） |

这些变量全部内联在 HTML 的 `<style>` 标签里。`src/` 下的 CSS 文件（`app-shell.css`、`step-flow.css`）引用这些变量（如 `var(--surface-container-highest)`），但变量定义不在这些文件里——在 HTML 内联的 `<style>` 里。

### 2.2 迁移时的影响

迁移到 Vite 后，`index.page.html` 不能用了（UMD runner），666 个变量定义全部跟着 HTML 一起丢失。`src/` 下的 CSS 文件还在引用 `var(--surface-container-highest)`，但没有地方定义这个变量。

解决方法：把 token 定义从 HTML 内联提取到独立 CSS 文件，迁移时与 eview-react 的 `aui3_1.css` 并存引入。两套变量名不冲突（`--surface` ≠ `--colorBackground`），布局 CSS 一行不用改。

### 2.3 建议结构

把 token 定义从 HTML 内联拆到独立 CSS 文件，至少分两层：

```
src/styles/
├── tokens.css          # :root { --brand-50: ...; --gray-90: ...; } 原始色阶 + 语义层 + 角色层
└── theme-dark.css      # .dark { --primary: ...; --surface: ...; } 暗色覆盖
```

迁移后的 `main.jsx` 会同时 import 这两套 CSS（已写在 `scaffold/src/main.jsx`，拷贝骨架即有）：

- `aui3_1.css` — eview-react 组件的样式和变量
- `tokens.css` — 原始 token 定义（源项目预先外置的那份）
- `theme-dark.css` — 原始暗色覆盖

**核心原则：token 定义和应用样式不要混在一起，更不要内联在 HTML 里。**

- `tokens.css`——只放 `:root { --xxx: ... }` 变量定义，不放任何选择器规则
- `*.css`（组件样式）——只放 `.shell-header { ... }` 等选择器规则，引用 `var(--xxx)` 但不定义变量

### 2.4 成本对比

| 场景 | 内联在 HTML（现状） | 独立 CSS 文件（改进后） |
|------|-------------------|----------------------|
| 迁移到 Vite | 666 个变量定义跟着 HTML 一起丢 | 文件还在，import 正常工作 |
| 保留原始 token | 不可能（HTML 丢了） | 直接 import，与 `aui3_1.css` 并存，布局 CSS 不改 |
| 暗色模式 | `.dark` 类也在 HTML 里 | `theme-dark.css` 独立，迁移后暗色同时切 `aui3_1_dark` 和 `.dark` |

---

## 3. 图标方案应避免运行时 fetch

### 3.1 问题

`assets/shared/icons.js` 是 230 行的自定义图标组件，做了三件事：

**第一层：硬编码 Lucide SVG path 表**

```js
const LUCIDE = {
    "arrow-left": [["path", {"d": "m12 19-7-7 7-7"}], ...],
    "search": [["path", {"d": "m21 21-4.34-4.34"}], ["circle", {"cx":"11",...}]],
    "sun": [["circle", {"cx":"12",...}], ...],
    // ... 共 10 个图标
};
```

这 10 个图标的 SVG path 数据写死在代码里。另外 `assets/library/lucide-icon-nodes.json` 有 714.9KB 的完整 Lucide 图标库。

**第二层：运行时 fetch 华为 icon-plus 在线服务**

```js
const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;
```

组件渲染时：
1. 先 `fetch(getConfig)` 探测 icon-plus 服务是否可用
2. 如果可用，按图标名 `fetch(getIconInfo?keyword=xxx)` 查找匹配图标
3. 再 `fetch(getIcon?url=xxx&size=16&style=border&color=xxx&fileType=svg)` 获取 SVG 文本
4. 把 SVG 文本 `dangerouslySetInnerHTML` 注入 DOM
5. 如果 icon-plus 不可用，回退到 Lucide 硬编码表

**第三层：缓存 + 状态管理**

```js
let plusState = null;      // null = 探测中, true = icon-plus 可用, false = 回退 Lucide
let plusPromise = null;    // 单例 getConfig 探测 Promise
const iconInfoMap = {};    // name -> { name, url } 缓存
const svgCache = new Map(); // "name&variant&color" -> svg text 缓存
```

每个 `<Icon name="search" />` 组件内部用 `useState` + `useEffect` 管理 SVG 异步加载状态。

### 3.2 迁移时的影响

源项目里用到的图标：

| 图标名 | 用途 | 出现位置 |
|--------|------|---------|
| `zap` | 品牌 logo | AppShell header |
| `search` | 搜索框前缀图标 | AppShell header |
| `sun` / `moon` | 深浅色切换 | AppShell header |
| `arrow-left` / `arrow-right` | 上一步/下一步 | StepFlow footer |
| `rotate-ccw` | 重新配置 | StepFlow success 页 |
| `gauge` / `server` / `bell` / `settings` | 侧导航菜单图标 | AppShell sider |

迁移到 eview-react 时面临三个问题：

**问题 1：不知道图标名怎么映射**

eview-react 有两套图标方案：
- `Icon name="ict_xxx"`——内置图标，但 skill 里只有 `ict_chevronDown`/`ict_trash`/`ict_edit` 等少数几个名字被提到，没有完整目录
- `@hui/icon-plus`——icon+ 图标库按需导入，命名规律是 `IconPlusIc<Category><Name>`，但 skill 里也只有 `IconPlusIcPublicSearch`/`IconPlusIcPublicTrash` 等少数例子

无法确认 `sun` 对应的 icon-plus 组件名是 `IconPlusIcWeatherSun` 还是 `IconPlusIcSystemSun` 还是别的什么。

**问题 2：运行时 fetch 与静态 import 范式不兼容**

```
源项目：运行时 fetch → 动态注入 SVG → 需要网络
eview-react：构建时 import → 静态 React 组件 → 离线可用
```

不能简单地保留源项目的 Icon 组件——它依赖的 `https://octo.hdesign.huawei.com` 在 eview-react 工程里不一定能访问，而且它绕过了 eview-react 的图标体系。

**问题 3：最终只能退化方案**

因为上面两个问题，转换时把所有图标都去掉了：
- 搜索框→`SearchInput`（自带搜索图标，不用单独传）
- 深浅色切换→纯文字 Button（`text="深色"`）
- 上一步/下一步→纯文字 Button（无 leftIcon/rightIcon）
- 侧导航菜单→纯文字按钮（无图标）
- 品牌 logo→CSS 色块（`<span className="shell-brand-mark" />`）

丢失了所有视觉图标。

### 3.3 建议方案

**方案 A（最优）：直接用 `@ant-design/icons`**

```jsx
import { SearchOutlined, SunOutlined, MoonOutlined,
         ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

<Button icon={<SunOutlined />} onClick={toggleDark} />
```

迁移时映射关系清晰：

| antd 图标 | eview-react 对应 |
|-----------|-----------------|
| `SearchOutlined` | `SearchInput` 自带，或 `IconPlusIcPublicSearch` |
| `SunOutlined` | `IconPlusIcWeatherSun`（需查目录确认） |
| `ArrowLeftOutlined` | `Button leftIcon` 或 `Icon name="ict_chevronLeft"` |
| `EditOutlined` | `IconButton iconName="ict_edit"`（skill 里有这个名字） |

@ant-design/icons 的名字是公开标准，可以在 npm/官网查到完整目录。即使 skill 没有 icon-plus 目录，至少可以从 antd 图标名推断 intent，再在真实工程里查 icon-plus 对应名。

**方案 B（次优）：用内联 SVG 组件**

```jsx
function SearchIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth={2}>
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
        </svg>
    );
}
```

迁移时：
- eview-react 的 `Icon` 支持 `iconUrl="./icons/search.svg"`——直接用静态 SVG 文件
- 或者继续用内联 SVG 组件，不依赖任何图标库
- 不需要网络、不需要构建时 import、不需要猜名字

**方案 C（应避免）：运行时 fetch 图标服务（源项目现状）**

迁移时的问题：
- 需要决定保留还是替换
- 保留→依赖内网 API，离线不可用，且绕过 eview-react 图标体系
- 替换→需要从 10 个 Lucide 名映射到 eview-react icon-plus 名，但无目录可查
- 无论选哪个，都增加了额外的决策成本和实现成本

### 3.4 成本对比

| 方面 | 运行时 fetch（现状） | @ant-design/icons（方案 A） | 内联 SVG（方案 B） |
|------|-------------------|---------------------------|-------------------|
| 迁移时图标名映射 | 无法映射（名字体系不兼容） | 可查 antd 官网目录，推断 intent | 不需要映射，SVG 直接用 |
| 网络依赖 | 运行时 fetch 内网 API | 无 | 无 |
| 迁移后是否保留 | 需额外决策 | 直接映射到 icon-plus 或保留 | 直接用或转 `iconUrl` |
| 迁移额外成本 | 高（猜名字 + 改范式） | 低（名字可查） | 低（不需映射） |

---

## 总结：三条建议的共同规律

源项目应该让"应用代码"和"基础设施"（构建工具、token 定义、图标加载）保持分离。迁移一个组件库时，只需要改应用代码里的 import 和 props；基础设施不应该跟着被推翻重建。

| 层 | 源项目现状 | 迁移时被迫重建 | 改进后 |
|----|-----------|--------------|--------|
| 构建工具 | UMD + Babel-standalone | 全套 Vite 工程 | 已有 Vite |
| Token 定义 | 666 个变量内联在 HTML | 全部丢失 | 独立 CSS 文件，与 `aui3_1.css` 并存，布局 CSS 不改 |
| 图标加载 | 230 行运行时 fetch 组件 | 无法映射，退化为纯文字 | 标准图标库或内联 SVG |
| 应用代码 | 内联在 HTML + src/ 两份 | 需判断以哪份为准 | 只有一份 |

改进后，迁移的工作量从"重建基础设施 + 替换组件"缩减为**纯组件替换**。
