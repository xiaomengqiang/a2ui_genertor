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
├── UMD script 标签     (1-15 行)      react/react-dom/dayjs/antd/babel 的 UMD 构建
├── 内联 CSS token      (16-1045 行)   1030 行、666 个 CSS 变量定义
├── base 样式           (1046-1051)
├── Babel preset 注册   (1054-1061)
├── antd-zh-cn.js       (1063-1360)    295 行 antd 中文 locale，内联
├── context.jsx         (1361-1394)    内联
├── icons.js            (1395-1641)    230 行自定义图标组件，内联
├── data.js             (1642-1715)    内联
├── BasicInfoForm.jsx   (1716-1767)    内联
├── NetworkForm.jsx     (1768-1812)    内联
├── ConfirmForm.jsx     (1813-1854)    内联
├── StepFlow.jsx        (1855-1961)    内联
├── AppShell.jsx        (1962-2024)    内联
├── app.jsx             (2025-2052)    内联
└── render              (2053-2058)
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
| 修正相对 import 路径 | 源项目根目录 `app.jsx` 常写 `./src/context.jsx`，迁移到 scaffold 的 `src/app.jsx` 后会变成错误的 `src/src/context.jsx` |

### 1.3 建议结构

源项目应使用 Vite + npm 结构：

```
project/
├── package.json           # antd 作为 dependency
├── vite.config.js         # Vite + @vitejs/plugin-react
├── index.html             # 薄入口：<div id="root"> + <script src="/main.jsx">
├── main.jsx               # ReactDOM.render(<App />)
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
- **入口文件位置固定**：如果 `app.jsx` 放在 `src/app.jsx`，就不要写 `./src/...` 导入；同级导入写 `./context.jsx`，视图导入写 `./views/...`

### 1.3.1 相对路径约定

推荐源项目也采用与 scaffold 一致的入口位置，减少迁移时的路径重写：

```jsx
// src/app.jsx
import { AppProvider } from './context.jsx';
import AppShell from './views/AppShell.jsx';

// src/views/AppShell.jsx
import { useApp } from '../context.jsx';
import { menuItems } from '../data.js';
```

应避免：

```jsx
// ❌ src/app.jsx 内不要写；这会解析成 src/src/context.jsx
import { AppProvider } from './src/context.jsx';
```

迁移后必须跑相对导入解析检查，避免 Vite import-analysis 阶段才暴露问题：

```bash
# 脚本位于本 skill 的 scripts/check-relative-imports.cjs，两种调用方式任选其一：
# 方式 A：直接用 skill 目录的脚本（<skill目录> 是本 skill 的安装路径）
node <skill目录>/scripts/check-relative-imports.cjs <目标工程根>

# 方式 B：把脚本拷到目标工程的 scripts/ 后在工程根执行
node scripts/check-relative-imports.cjs .
```

### 1.4 成本对比

| 步骤 | UMD 工程（现状） | Vite 工程（改进后） |
|------|-----------------|-------------------|
| 建工程骨架 | 30-45 分钟（写 5 个新文件） | 0（已有） |
| 装依赖 | 需要配 .npmrc + npm install | 只改 package.json 的依赖名 |
| 入口改造 | 重新写 main.jsx + index.html | main.jsx 只改 Provider 组件 |
| 代码一致性 | 需判断 HTML 内联版 vs src/ 版 | 只有一份代码 |
| import 路径 | 根目录文件搬进 src 后需批量修正 `./src/...` | 入口位置稳定，路径不变 |

---

## 2. Token CSS 应外置且分层

### 2.1 问题

`index.page.html` 的 `<style>` 块有 **1030 行、666 个 CSS 变量定义**，分 3 层 `:root`：

| 层 | 变量数 | 内容 |
|----|--------|------|
| 第 1 层 `:root` | ~260 | 原始色阶（`--brand-05`~`--brand-90`、`--gray-0`~`--gray-100`、红/橙/黄/绿/青/蓝/靛/紫/粉各 10 级） |
| 第 2 层 `:root` | ~200 | 语义化 token（`--color-text-primary`、`--color-brand`、`--color-border`、告警色、图表色、标签色、阴影） |
| 第 3 层 `:root` | ~100 | 角色化 token（`--primary`、`--surface`、`--on-surface`、`--divider`、间距、字号简写） |
| `.dark` | ~200 | 暗色覆盖（覆盖第 2 层的语义值，也需覆盖第 3 层中直接写色值的角色变量） |

这些变量全部内联在 HTML 的 `<style>` 标签里。`src/` 下的 CSS 文件（`app-shell.css`、`step-flow.css`）引用这些变量（如 `var(--surface-container-highest)`），但变量定义不在这些文件里——在 HTML 内联的 `<style>` 里。

### 2.2 迁移时的影响

迁移到 Vite 后，`index.page.html` 不能用了（UMD runner），666 个变量定义全部跟着 HTML 一起丢失。`src/` 下的 CSS 文件还在引用 `var(--surface-container-highest)`，但没有地方定义这个变量。

解决方法：把 token 定义从 HTML 内联提取到独立 CSS 文件，迁移时与 eview-react 的 `aui3_1.css` 并存引入。两套变量名不冲突（`--surface` ≠ `--colorBackground`），布局 CSS 一行不用改。

### 2.3 建议结构

把 token 定义从 HTML 内联拆到独立 CSS 文件，至少分两层：

```
src/styles/
├── tokens.css          # :root { --brand-50: ...; --gray-90: ...; } 原始色阶 + 语义层 + 角色层
└── theme-dark.css      # .dark { --primary: ...; --surface: ...; } 暗色覆盖
```

迁移后的 `main.jsx` 会同时 import 这些 CSS（已写在 `scaffold/src/main.jsx`，拷贝骨架即有）：

- `aui3_1.css` — eview-react 亮色组件样式和变量
- `aui3_1_dark.css` — eview-react 暗色组件变量（**必须导入**）
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
| 暗色模式 | `.dark` 类也在 HTML 里 | `theme-dark.css` 独立，迁移后暗色同时切 `aui3_1_dark`（挂 `<body>`）和 `.dark`（挂 `<html>`） |

---

## 3. 图标方案：用接口匹配 icon+ 名（优选），避免运行时 fetch SVG 注入

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
let plusState = null;      // null = 探测中, true = icon-plus 可用, false = 回退 Lucide
let plusPromise = null;    // 单例 getConfig 探测 Promise
const iconInfoMap = {};    // name -> { name, url } 缓存
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

**问题 1：图标名怎么映射——可解（用 icon-plus 接口查）**

eview-react 默认用 icon+（`@nce/icon-plus` 按需引入，命名规律 `IconPlusIc<Category><Name>`）；内置 `Icon name="ict_xxx"` 已下线、不再推荐。icon+ 全量目录不随 skill 打包，但源项目的 icon-plus 在线接口（见 §3.1 第二层）可吃 Lucide 名或 antd 名做 keyword 查询、返回匹配的 icon+ 名，迁移时用它做一次名发现即可——见 §3.3 优选方案。

迁移时拿源项目的图标名（如 `sun`/`search`/`arrow-left`，或对应 antd 名 `SunOutlined`/`SearchOutlined`/`ArrowLeftOutlined`）当 keyword 查 `getIconInfo`，拿到 icon+ 组件名后在 eview-react 工程里 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态用。

**问题 2：运行时 fetch SVG 注入与静态 import 范式不兼容**

```
源项目：运行时 fetch → 动态注入 SVG → 需要网络
eview-react：构建时 import → 静态 React 组件 → 离线可用
```

不能简单地保留源项目的 Icon 组件——它依赖的 `https://octo.hdesign.huawei.com` 在 eview-react 工程里不一定能访问，而且它绕过了 eview-react 的图标体系。**但接口的名发现能力可复用为迁移期一次性查询**：fetch 只在迁移时查名、不参与运行时渲染，范式冲突消除。

**问题 3：原迁移退化掉了所有图标——现在可保留**

之前因问题 1+2，转换时把所有图标都去掉了：
- 搜索框→`SearchInput`（自带搜索图标，不用单独传）
- 深浅色切换→纯文字 Button（`text="深色"`）
- 上一步/下一步→纯文字 Button（无 leftIcon/rightIcon）
- 侧导航菜单→纯文字按钮（无图标）
- 品牌 logo→CSS 色块（`<span className="shell-brand-mark" />`）

有了 §3.3 的接口名发现优选方案，不必再"丢失所有视觉图标"，可按 icon+ 名正常渲染。

### 3.3 建议方案

**优选方案：用 icon-plus 接口做名映射，迁到 eview-react icon+ 组件**

源项目的 icon-plus 在线接口（§3.1 第二层）可吃 Lucide 名或 antd 名做 keyword 查询，返回匹配的 icon+ 图标名（下划线小写形，如 `ic_public_search`），再按下划线分段转 PascalCase 得到组件名（`IconPlusIcPublicSearch`），在 eview-react 工程（已装 `@nce/icon-plus`）里静态 import。

**接口调用**：`GET https://octo.hdesign.huawei.com/assetRepository/iconPlus/getIconInfo?keyword=<keyword>&topK=2&source_id=6`
- 迁移期一次性查询：收集源项目所有图标名（Lucide/antd 名），`keyword` 传逗号拼接的全部名，一次请求拿回每个名对应的 icon+ 名
- 响应是数组，每项 `item.icons[]`；优先取 `group` 含「系统图标」的图标，取其 `name`；否则回退 `item.icons[0].name`；都没有则该名解析失败

**下划线/小写名 → PascalCase 组件名**：按下划线分段、每段首字母大写、拼接、去掉点号、前加 `IconPlus`。例：`ic_bpit_home` → `IconPlusIcBpitHome`；`ic_public_search` → `IconPlusIcPublicSearch`。

**失败回退**：API 不可用或某名无匹配时，用占位图标 `IconPlusIcPublicTransverseRectangleTemplate`，保证编译通过、不阻塞迁移（后续人工替换）。

**整体流程**：

```jsx
// 1) 收集源项目所有图标名（Lucide/antd 名，如 sun/search/arrow-left）
// 2) 一次性请求 getIconInfo?keyword=sun,search,arrow-left,... → 拿到每个名对应的 icon+ 下划线名（如 ic_public_sun）
// 3) 按下划线分段转 PascalCase（IconPlusIcPublicSun）
// 4) eview-react 工程里静态 import
import { IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@nce/icon-plus';
<Button leftIcon={<IconPlusIcPublicSun />} onClick={toggleDark} />
```

接口在此**只做迁移期一次的名发现**，不参与运行时渲染，范式冲突消除；不需要把源项目的 Icon 组件搬过去。

迁移时名映射示意（icon+ 组件名为示意，真实值靠接口查得 + PascalCase 转换）：

| 源项目图标（Lucide/antd 名） | 接口返回下划线名（示意） | icon+ 组件名 |
|------------------------------|------------------------|-------------|
| `search` / `SearchOutlined` | `ic_public_search` | `IconPlusIcPublicSearch` |
| `sun` / `SunOutlined` | `ic_public_sun` | `IconPlusIcPublicSun` |
| `arrow-left` / `ArrowLeftOutlined` | `ic_public_arrow_left` | `Button leftIcon={<IconPlusIcPublicArrowLeft />}` |
| `edit` / `EditOutlined` | `ic_public_edit` | `IconButton iconName={<IconPlusIcPublicEdit />}` |

**备选方案 A：直接用 `@ant-design/icons`**

```jsx
import { SearchOutlined, SunOutlined, MoonOutlined,
         ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

<Button icon={<SunOutlined />} onClick={toggleDark} />
```

迁移时映射关系清晰（icon+ 组件名为示意，真实值靠接口查得）：

| antd 图标 | eview-react 对应 |
|-----------|-----------------|
| `SearchOutlined` | `SearchInput` 自带，或 `IconPlusIcPublicSearch` |
| `SunOutlined` | `IconPlusIcPublicSun`（需查接口确认） |
| `ArrowLeftOutlined` | `Button leftIcon={<IconPlusIcPublicArrowLeft />}` |
| `EditOutlined` | `IconButton iconName={<IconPlusIcPublicEdit />}` |

`@ant-design/icons` 的名字是公开标准，可在 npm/官网查到完整目录。接口不可用时用它兜底——从 antd 名推断 intent，再到真实工程查 icon+ 对应名。

**备选方案 B：用内联 SVG 组件**

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
- eview-react 的图标 prop 多收 ReactElement，可直接塞内联 SVG 组件或静态 SVG 文件
- 不依赖任何图标库，不需要网络、不需要构建时 import、不需要猜名字

**方案 C（应避免）：运行时 fetch SVG 注入图标服务（源项目现状）**

仅指源项目那条"fetch SVG → `dangerouslySetInnerHTML` 注入 DOM"的渲染旁路。迁移时的问题：
- 需要决定保留还是替换
- 保留→依赖内网 API，离线不可用，且绕过 eview-react 图标体系
- 替换→名映射走优选方案的接口即可，不再"无目录可查"
- 接口的名发现能力已被优选方案复用，但 SVG 注入这条渲染旁路仍应避免

### 3.4 成本对比

| 方面 | 运行时 fetch SVG 注入（现状） | 接口名发现（优选） | @ant-design/icons（备选 A） | 内联 SVG（备选 B） |
|------|-------------------|---------------------------|---------------------------|-------------------|
| 迁移时图标名映射 | 不适用（运行时渲染） | 接口按 keyword 查得 icon+ 名 | 可查 antd 官网目录，推断 intent | 不需要映射，SVG 直接用 |
| 网络依赖 | 运行时 fetch 内网 API（离线不可用） | 迁移期一次性查询（可选） | 无 | 无 |
| 迁移后是否保留 | 不保留（旁路应避免） | icon+ 组件静态 import，保留图标 | 直接映射到 icon+ 或暂保留 | 直接用或塞图标 prop |
| 迁移额外成本 | 高（运行时依赖 + 绕过体系） | 低（查名 + 静态 import） | 低（名字可查） | 低（不需映射） |

---

## 总结：三条建议的共同规律

源项目应该让"应用代码"和"基础设施"（构建工具、token 定义、图标加载）保持分离。迁移一个组件库时，只需要改应用代码里的 import 和 props；基础设施不应该跟着被推翻重建。

| 层 | 源项目现状 | 迁移时被迫重建 | 改进后 |
|----|-----------|--------------|--------|
| 构建工具 | UMD + Babel-standalone | 全套 Vite 工程 | 已有 Vite |
| Token 定义 | 666 个变量内联在 HTML | 全部丢失 | 独立 CSS 文件，与 `aui3_1.css` 并存，布局 CSS 不改 |
| 图标加载 | 230 行运行时 fetch 组件 | 名映射无目录、退化为纯文字 | 接口查 icon+ 名 → 静态 import，或内联 SVG |
| 应用代码 | 内联在 HTML + src/ 两份 | 需判断以哪份为准 | 只有一份 |

改进后，迁移的工作量从"重建基础设施 + 替换组件"缩减为**纯组件替换**。