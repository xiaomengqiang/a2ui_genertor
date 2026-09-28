# 源项目迁移前规范建议

> 以下建议针对**被转换的 antd 源项目**（pipeline 最上游的 UMD 单 HTML 原型，由 `ict-react-coder` 生成）。如果源项目在生成时就遵循这些规范，
> 迁移到 eview-react 时可以跳过"重建基础设施"阶段，直接聚焦于组件库替换。
>
> **本文定位**：这是给**上游生成端**（`ict-react-coder`）的规范建议，描述的是 UMD 单 HTML 源项目的形态与痛点。`antd-to-eview-react` skill 的**直接输入不是本文描述的 UMD 工程**，而是 `umd-to-antd-vite` 处理后的标准 Vite 工程（`package.json` + `vite.config.js` + 外置 `src/styles/tokens.css` + `.umd-conversion.json` 交接文件）。完整 pipeline 链：`ict-react-coder`（生成 UMD 原型）→ `umd-to-antd-vite`（UMD → antd Vite + 外置 token + 修路径 + 扫描组件）→ `antd-to-eview-react`（antd → eview-react）。本文的价值在于解释 `umd-to-antd-vite` 为什么要做那些"工程标准化"工作（外置 token、修路径、扫组件），以及上游生成端如何改进才能减少整条 pipeline 的迁移成本。
>
> 每条建议基于一次真实迁移任务（device-access-wizard 项目）中遇到的实际问题。
>
> **典型源项目**：`ict-react-coder` skill 生成的单页原型——UMD 单 HTML（`index.page.html` + `src/` 双份代码）、antd 5、内联 token CSS、Lucide 图标、禁用 Layout/Grid/Space/Card 等布局组件。下方各"问题"小节描述的结构特征均源自该类项目。

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

源项目应保证相对导入路径正确（同级 `./`、上层 `../`，不写 `./src/...`），这样下游 `umd-to-antd-vite` 的 `verification.relativeImports` 能 PASS，`antd-to-eview-react` 步骤 5 可跳过 `check-relative-imports.cjs`。如需按需排查，脚本位于本 skill 的 `scripts/check-relative-imports.cjs`：

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

## 3. 图标方案：方案 C（catalog 离线匹配 + icon+ 静态 import）为优选默认，A/B 为备选

> 三套方案，渲染范式分两类：**A 是 scaffold 自定义 `<Icon>` shim**（运行时 fetch icon-plus 在线取 SVG，不依赖 `@nce/icon-plus` 包、不写静态 import）；**B/C 是 icon+ 静态 import**（`import { IconPlusIcXxx } from '@nce/icon-plus'`），二者仅「名发现」方式不同——C 离线 catalog 匹配、B 在线接口查得。
> - **C（优选默认）**：读 skill 自带的 `icons/icon-plus-names.json`（按领域划分的 icon+ PascalCase 名目录）**离线匹配**源 Lucide/antd 名 → 命中即 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import。**无网络依赖、无运行时 fetch**，迁移期默认走这条。
> - **A（备选）**：scaffold 预制 `<Icon>` shim（`src/shared/icon.jsx`），保留源项目 `<Icon name="..."/>` 契约，运行时 fetch icon-plus 在线取 SVG 注入；调用点零改动、只改 import 路径。不引入 `@nce/icon-plus` 静态 import。内网兜底用。
> - **B（备选）**：在线 `getIconInfo?keyword=...` 名发现 → `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import。外网/接口不便时**不用**，改用 C 的 catalog 离线匹配。
>
> 完整规格见 §3.2（C）/ §3.3（A）/ §3.4（B）。

### 3.1 源项目 Icon 组件结构

`assets/shared/icon.jsx`（源项目，约 230 行）做三件事：

**第一层：Lucide SVG path 表**——`assets/library/lucide-icon-nodes.json`（约 763KB）含完整 Lucide 图标库 nodes，离线兜底用。

**第二层：运行时 fetch 华为 icon-plus 在线服务**

```js
const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;
```

组件渲染时：
1. 先 `fetch(getConfig)` 探测 icon-plus 服务是否可用
2. 如果可用，按图标名 `fetch(getIconInfo?keyword=xxx&topK=2&source_id=6)` 查找匹配图标（完整 URL 与参数见 §3.4）
3. 再 `fetch(getIcon?url=xxx&size=16&style=border&color=xxx&fileType=svg)` 获取 SVG 文本
4. 把 SVG 文本 `dangerouslySetInnerHTML` 注入 DOM
5. 如果 icon-plus 不可用，回退到 Lucide nodes 表

**第三层：缓存 + 状态管理**——`plusState`（探测状态）、`iconInfoMap`（name→{name,url}）、`svgCache`（"name&variant&color"→svg text）。每个 `<Icon name="search" />` 内部用 `useState` + `useEffect` 管理 SVG 异步加载。

### 3.2 优选路径：方案 C — catalog 离线匹配 + icon+ 静态 import

用 skill 自带的 icon+ 名目录**离线匹配**源项目的 Lucide/antd 图标名，命中后 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import（scaffold 已预置 `@nce/icon-plus` 依赖）。**无网络依赖、无运行时 fetch**——既消除 A 的运行时 fetch，又免掉 B 的在线名发现，外网环境下同样可用。迁移期默认走这条。

#### 数据源

`icons/icon-plus-names.json` —— `{ "<Domain>": ["<PascalCaseName>", ...] }`，按领域划分的 icon+ 组件「短名」目录（19 个域，`Public`/`Ict` 为通用主力域，其余为业务域）。迁移期由 agent 读此文件做名匹配，**不随 scaffold 打进目标工程、不参与运行时**。

> 组件名合成规则（已核实）：JSON 中 `Public` 域下的 `TransverseRectangleTemplate`，对应既有占位组件名 `IconPlusIcPublicTransverseRectangleTemplate`。故 icon+ 组件名 = **`"IconPlusIc" + Domain + Name`**（如 `Public` + `Search` → `IconPlusIcPublicSearch`，与 §3.4 既有示例一致）。

#### 名匹配算法（源 Lucide/antd 名 → icon+ 名）

1. **归一化源名**为 PascalCase base：
   - antd `@ant-design/icons`：剥尾部 `Outlined` / `Filled` / `TwoTone`。如 `SearchOutlined`→`Search`、`ArrowLeftOutlined`→`ArrowLeft`、`CaretUpFilled`→`CaretUp`。
   - Lucide：kebab-case 转 PascalCase。如 `arrow-left`→`ArrowLeft`、`chevron-down`→`ChevronDown`、`x`→`X`、`pencil`→`Pencil`、`trash`→`Trash`、`sun`→`Sun`。
   - 保留 base 的全小写形式与按大写拆分的 token 集合（如 `ArrowLeft` → tokens `{arrow, left}`）。
   > 注意：名归一化只处理**名字**；antd 图标尺寸经由 `style.fontSize` 表达，**须单独抽取**（见下 props 映射表 → `iconSize`），不要因名归一化遗漏尺寸。

2. **建索引**：遍历 JSON 每个 `(domain, name)`，记录 `name.toLowerCase()` 全名、`name` 按大写拆分的 token 集合；候选名额外剥 `Textured` / `\d+Textured` 后缀生成「裸名」变体（如 `BellClockTextured`→`bellclock`）作为次级候选。

3. **匹配优先级**（命中即停，多域/多名时按 **`Public` > `Ict` > 其余** 裁决，其次取最短名）：
   - **L1 全名精确**（大小写无关）：`name.toLowerCase() === base.toLowerCase()`。如 `search`→`Search`、`sun`→`Sun`。
   - **L2 token 集合相等**（忽略顺序）：捕获 `ArrowLeft` ↔ `LeftArrow` 这类倒序命名。
   - **L3 前缀匹配**：base 是候选名前缀（如 `check` 是 `Checkbox`/`Checkmark` 前缀、`lock` 是 `Locked` 前缀、`refresh` 是 `RefreshClockwise` 前缀）。
   - **L4 裸名变体**：剥 `Textured` / `\d+Textured` 后缀后再走 L1。
   - **未命中** → 占位图标 `IconPlusIcPublicTransverseRectangleTemplate`（保证编译通过、不阻塞迁移，后续人工替换）。

   > 常见同义提示（可选，辅助人工判断；多域同名一律按 `Public` > `Ict` > 其余 裁决）：算法给 `Checkbox`（☑ 复选框），若需 ✓ 对勾改用 `Checkmark`；lucide `x`（关闭图标）算法给 `Ict/X`，若需关闭用 `Close`；`Delete` 算法给 `DigitalPower/Delete`，若需垃圾桶用 `Trash`。仅作提示，不强制。

#### 组件名合成

命中 `(domain, name)` → 组件名 = `"IconPlusIc" + Domain + Name`：
- `Public` + `Search` → `IconPlusIcPublicSearch`
- `Public` + `LeftArrow` → `IconPlusIcPublicLeftArrow`
- `Public` + `Checkmark` → `IconPlusIcPublicCheckmark`
- `Dev` + `Branch` → `IconPlusIcDevBranch`
- `Car` + `User` → `IconPlusIcCarUser`
- 未命中 → `IconPlusIcPublicTransverseRectangleTemplate`

#### 调用点改写（`<Icon>` 契约 → icon+ 静态 import）

源 `<Icon name="search" size={14} variant="lined" className="x" style={s} />`（无 color，继承容器）→
```jsx
import { IconPlusIcPublicSearch } from '@nce/icon-plus';
<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} className="x" style={s} />
```
源 `<Icon name="search" size={14} color="#fff" variant="filled" className="x" style={s} />` →
```jsx
<IconPlusIcPublicSearch iconSize={14} iconColor={['#fff']} type="filled" className="x" style={s} />
```

props 映射：

| 源 `<Icon>` prop | icon+ 组件 prop | 备注 |
|-----------------|----------------|------|
| `name` | 解析为具体 `IconPlusIcXxx` 组件 | 走上面匹配算法 |
| `size`（默认 16） | `iconSize` | 支持rem、px、数字；源值不在集合内就近吸附（默认 16）。**Button / IconButton 的 `leftIcon`/`rightIcon`/`iconName` 内层 `<IconPlusIc* />` 同样适用——尺寸写内层 `iconSize`，不是按钮的 `size`** |
| antd `@ant-design/icons` 的 `style.fontSize` | `iconSize` | antd 图标组件**无 `size` prop**，尺寸靠 `style={{ fontSize: 14 }}` 或 `'14px'`；剥 `px` 取数字后按同样规则吸附到 `iconSize`。**这是 antd 图标尺寸的常见来源，勿漏** |
| `color`（hex） | `iconColor={['#hex']}` | **无 color 时默认 `iconColor={['currentcolor']}`**（继承容器文字色）；有 hex 用 `['#hex']` |
| `variant="filled"` | `type="filled"` | `lined`（默认）省略 `type`；`two-tone`/`circle`/`square` icon+ 支持度有限，按需 `type` |
| `className` / `style` | 原样透传 | icon+ 收 `className`/`style`；但 `style.fontSize` **须先提升为 `iconSize` 并从透传的 `style` 里剔除**（icon+ 是 SVG，`fontSize` 无效） |
| `src`（自定义图片） | 内联 `<img src={src} width={size} height={size} aria-hidden alt="" />` | shim 的 src 分支等价改写，无需库 |
| `strokeWidth` | 丢弃 | icon+ 不支持（与 A 一致） |

可点击图标用 `IconButton`：`<IconButton iconName={<IconPlusIcPublicEdit />} tipText="..." onClick={...} />`，名匹配同上（见 [components/Icon.md](components/Icon.md)）。

> 切完 C 后 **保留 `src/shared/icon.jsx`**（A 作为运行时 fetch 兜底随时可回退，不删）。接口在此不参与——名发现靠 catalog 离线匹配，渲染靠 icon+ 静态 import。

### 3.3 备选 A：scaffold 预制 Icon shim 复用（运行时 fetch）

scaffold 的 `src/shared/icon.jsx` 保留源项目 Icon 组件的 icon-plus 在线层（§3.1 第二层 + 第三层：getConfig 探测、getIconInfo 查名、getIcon 取 SVG、缓存），**剥离第一层 Lucide 兜底**（内网环境 icon-plus 恒可达，不需要离线兜底，连带去掉 `lucide-icon-nodes.json` 的 763KB）。契约、props（`name`/`src`/`size`/`color`/`className`/`style`/`variant`）、运行时机制不变；`<Icon>` 在 icon-plus 探测中 / 探测失败时渲染 `null`（内网下探测失败属异常态，不退化到 Lucide）。

**迁移操作**：源项目所有 `<Icon name="search" size={14} />` 调用点零改动，只改 import 路径：
- `import { Icon } from "./assets/shared/icon.jsx"` → `import { Icon } from "./shared/icon.jsx"`（src/ 下）或 `"../shared/icon.jsx"`（views/ 下）
- 跑 `scripts/check-relative-imports.cjs` 扫残留的 `./assets/shared/...` 旧路径
- 源项目的 `strokeWidth` prop 在 shim 中已移除（仅 Lucide 分支用）；调用点若传了 `strokeWidth` 会被忽略，不影响渲染

**取舍**（相比 icon+ 静态 import）：
- ✅ 迁移工作量最小（调用点零改动，无需名发现）
- ✅ 无 763KB lucide JSON 负担
- ⚠️ 保留运行时 fetch（icon-plus 在线取 SVG，依赖内网 `octo.hdesign.huawei.com` 可达）
- ⚠️ 探测失败 / 网络异常时该图标渲染 `null`（无 Lucide 兜底）

> 之前版本的迁移因"运行时 fetch 与静态 import 范式不兼容"把所有图标退化为纯文字 / CSS 色块（搜索框→SearchInput 自带图标、深浅切换→纯文字 Button、上一步/下一步→无 leftIcon、侧导航→无图标、品牌 logo→色块）。预制 shim 后这条退化路径不再需要——图标全部保留。

### 3.4 备选 B：在线 getIconInfo 名发现（外网不便时不用）

与 C 共用「icon+ 静态 import」范式，**仅名发现方式不同**：C 靠 skill 自带 catalog 离线匹配（§3.2，默认），B 靠在线 `getIconInfo` 接口按 Lucide/antd 名 keyword 查得 icon+ 名。**外网 / 接口不便时不用 B，改用 C**。仅当 catalog 未命中、且能联通内网接口时，用 B 做在线名发现兜底。

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
// 4) eview-react 工程里静态 import，替换原 <Icon name="sun" /> 调用点
import { IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@nce/icon-plus';
<Button leftIcon={<IconPlusIcPublicSun />} onClick={toggleDark} />
```

接口在此只做迁移期一次的名发现，不参与运行时渲染。切完后 **保留 `src/shared/icon.jsx`**（A 兜底，不删）。

名映射示意（icon+ 组件名为示意，真实值靠接口查得 + PascalCase 转换）：

| 源项目图标（Lucide/antd 名） | 接口返回下划线名（示意） | icon+ 组件名 |
|------------------------------|------------------------|-------------|
| `search` / `SearchOutlined` | `ic_public_search` | `IconPlusIcPublicSearch` |
| `sun` / `SunOutlined` | `ic_public_sun` | `IconPlusIcPublicSun` |
| `arrow-left` / `ArrowLeftOutlined` | `ic_public_arrow_left` | `Button leftIcon={<IconPlusIcPublicArrowLeft />}` |
| `edit` / `EditOutlined` | `ic_public_edit` | `IconButton iconName={<IconPlusIcPublicEdit />}` |

### 3.5 其他备选（icon+ 名查不到时兜底）

**备选 A：直接用 `@ant-design/icons`**

```jsx
import { SearchOutlined, SunOutlined, MoonOutlined,
         ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

<Button icon={<SunOutlined />} onClick={toggleDark} />
```

`@ant-design/icons` 的名字是公开标准，可在 npm/官网查到完整目录。接口不可用时用它兜底——从 antd 名推断 intent，再到真实工程查 icon+ 对应名。

**备选 B：用内联 SVG 组件**

```jsx
function SearchIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
             stroke="currentcolor" strokeWidth={2}>
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
        </svg>
    );
}
```

迁移时：eview-react 的图标 prop 多收 ReactElement，可直接塞内联 SVG 组件或静态 SVG 文件；不依赖任何图标库，不需要网络、不需要构建时 import、不需要猜名字。

### 3.6 成本对比

| 方面 | **方案 C（优选默认 §3.2）** | 预制 shim A（备选 §3.3） | 在线名发现 B（备选 §3.4） | @ant-design/icons（§3.5 备选 A） | 内联 SVG（§3.5 备选 B） |
|------|---------------------------|-------------------------|--------------------------|--------------------------------|-----------------------|
| 迁移时图标名映射 | catalog 离线匹配（`icons/icon-plus-names.json`，`Public`>`Ict` 优先） | 不需要（调用点零改动） | 接口按 keyword 查得 icon+ 名 | 可查 antd 官网目录，推断 intent | 不需要映射，SVG 直接用 |
| 网络依赖 | **无**（离线 catalog + 静态 import） | 运行时 fetch icon-plus（内网恒可达，无 Lucide 兜底） | 迁移期一次性查询（可选） | 无 | 无 |
| 迁移后调用点改动 | 逐个改调用点为静态 import | 仅改 import 路径 | 逐个改调用点为静态 import | 逐个改调用点 | 逐个改调用点 |
| bundle 体积 | 只打包用到的 icon+ | 仅用到的 SVG（无 lucide JSON） | 只打包用到的 icon+ | 用到的 antd 图标 | 用到的 SVG |
| 迁移额外成本 | 低-中（查名靠 catalog，离线；无网络） | 最低 | 中（查名 + 逐点替换） | 中（名字可查 + 逐点替换） | 中（逐点替换） |
| 未匹配回退 | 占位 `IconPlusIcPublicTransverseRectangleTemplate` | 探测失败渲染 `null` | 占位 `IconPlusIcPublicTransverseRectangleTemplate` | — | — |

---

## 总结：三条建议的共同规律

源项目应该让"应用代码"和"基础设施"（构建工具、token 定义、图标加载）保持分离。迁移一个组件库时，只需要改应用代码里的 import 和 props；基础设施不应该跟着被推翻重建。

| 层 | 源项目现状 | 迁移时被迫重建 | 改进后 |
|----|-----------|--------------|--------|
| 构建工具 | UMD + Babel-standalone | 全套 Vite 工程 | 已有 Vite |
| Token 定义 | 666 个变量内联在 HTML | 全部丢失 | 独立 CSS 文件，与 `aui3_1.css` 并存，布局 CSS 不改 |
| 图标加载 | 230 行运行时 fetch 组件（icon-plus 在线 + Lucide 兜底） | 方案 C：catalog 离线匹配 → icon+ 静态 import（§3.2，默认，无网络）；备选 A 预制 shim 复用（§3.3，运行时 fetch） | 方案 C 离线静态 import 为默认；A 预制 shim 复用兜底（剥离 Lucide，切到 C 后保留不删） |
| 应用代码 | 内联在 HTML + src/ 两份 | 需判断以哪份为准 | 只有一份 |

改进后，迁移的工作量从"重建基础设施 + 替换组件"缩减为**纯组件替换**——图标与图表（HUI Charts）连组件替换都省了：图标默认走方案 C（读 `icons/icon-plus-names.json` 离线匹配 → icon+ 静态 import，无网络依赖），图表直接 `import Chart from '@nce/eview-react/Chart'`。备选 A 的 scaffold 预制 `src/shared/icon.jsx`（运行时 fetch，内网恒可达，不带 Lucide 兜底与 lucide JSON）作兜底，切到 C 后保留不删。