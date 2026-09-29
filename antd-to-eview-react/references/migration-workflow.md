# 迁移工作流（详细步骤）

> 从 antd 项目迁移到 eview-react 的完整流程。按步骤执行，每步产出明确。

## 步骤 0：评估迁移可行性

### 0.1 读交接文件获取迁移清单

源项目是 `umd-to-antd-vite` 产物，目标工程根必有 `.umd-conversion.json` 交接文件。

**优先路径（`migrationPlan` 非 `null`，上游 `umd-to-antd-vite` 步骤 5 已评估前置）**：直接读 `migrationPlan` 数组作为分类评估清单——每项已含 `antd` / `category`（A/B/C）/ `eview` / `keyDiffs` / `ref` / `files`。**无需再读 `component-mapping.md` 大表对照，直接跳到 §0.4 用此清单规划步骤 3 替换顺序**（§0.2 分类、§0.3 估时均可从 `migrationPlan` 的 `category` 字段直接统计，跳过）。

**回退路径（`migrationPlan` 为 `null`，上游未跑步骤 5）**：读 `antdComponents` 字段（keys 即组件名列表）作为迁移清单，同时读 `antdIcons` 获取图标清单，进入 §0.2 手动对照 `component-mapping.md` 分类。文件路径字段仅供参考（搬代码后路径可能变），以组件名为准。

> 组件清单已由 `umd-to-antd-vite` 生成并写入交接文件，不需要手动 grep 扫描 `src/`。`migrationPlan` 是否非 `null` 决定走优先路径（跳过 §0.2/§0.3）还是回退路径（手动对照大表）。

### 0.2 对照组件映射总表分类（回退路径，优先路径跳过）

> 若 §0.1 走优先路径（`migrationPlan` 已含 `category` 字段），本节跳过。仅回退路径（`migrationPlan` 为 `null`）需手动对照下表。

将交接文件中读取到的组件分为三类：

| 分类 | 含义 | 处理 |
|------|------|------|
| **A. 有对应** | eview-react 有同名或功能等价组件（有 Reference） | 直接替换，改 props |
| **B. 无对应需手写** | eview-react 无对应组件 | 用 [handwrite-templates.md](handwrite-templates.md) 模板 |
| **C. 需模式转换** | 组件有对应但 API 模式不同（Form / Steps / Modal） | 读 [form-migration.md](form-migration.md) |

### 0.3 评估工作量

> 优先路径可直接从 `migrationPlan` 的 `category` 字段统计 A/B/C 各类数量；回退路径从 §0.2 分类结果统计。

- A 类组件 × 数量 → 每个约 5-15 分钟（改 props）
- B 类组件 × 数量 → 每个约 15-30 分钟（手写 + 调样式）
- C 类模式 → Form 迁移约 30-60 分钟（控制流重写）
- CSS 变量切换 → 全局约 30-60 分钟

### 0.4 输出迁移清单

> 优先路径下 `migrationPlan` 本身即此清单（含 `ref` 指引列，可直接据此规划步骤 3 替换顺序与按需读 reference）；回退路径据 §0.2 结果填下表。

| antd 组件 | 分类 | eview-react 替换 | 涉及文件 | 备注 |
|-----------|------|-----------------|---------|------|
| Button | A | Button (status) | AppShell.jsx | type→status |
| Form | C | Form (ref) | StepFlow.jsx | useForm→ref |
| Layout | B | 手写 | AppShell.jsx | 无对应 |
| ... | | | | |

## 步骤 1：建工程骨架

### 1.1 前置条件

源项目是 `umd-to-antd-vite` 产物（标准 Vite 工程 + `.umd-conversion.json`），直接执行 1.2a（`--upgrade` 模式）。

### 1.2 拷贝预制骨架

`scaffold/`（skill 根目录，与 `references/` 并列）是预制好的可运行空壳工程，已含步骤 1 所需全部文件。用脚本一键拷贝并替换 `package.json` name 和 `index.html` title：

```bash
node <skill目录>/scripts/init-scaffold.cjs <目标工程根> [项目名] [标题] [--force]
```

- 项目名缺省时用目标目录名；标题缺省时用项目名
- 目标目录非空时需加 `--force` 确认覆盖

布局：

```
scaffold/
├── package.json        # 依赖已含 @nce/eview-react / react-intl / horizon peer / lodash / icon-plus 等
├── .npmrc              # @nce scope 指向华为 product_npm 源
├── vite.config.js      # Vite + @vitejs/plugin-react
├── index.html          # 薄入口，<body class="ev_no_wcag aui3_1"> + /src/main.jsx
├── public/
│   └── font/           # HarmonyOS Sans SC 字体（4 个 .woff2），font.css @font-face 引用
│       └── HarmonyOS_SansSC/
└── src/
    ├── main.jsx        # ConfigProvider + IntlProvider + aui3_1.css + aui3_1_dark.css + base.css + font.css + tokens.css + theme-dark.css
    ├── app.jsx         # 空壳 App（<div className="root">；aui3_1 挂 <body>），步骤 3 替换为 AppShell
    ├── shared/         # 预制图标组件，迁移时调用点零改动（只改 import 路径）
    │   └── icon.jsx              # <Icon name="..."> 契约保留（icon-plus 在线，内网恒可达，无离线兜底）
    └── styles/
        ├── base.css          # 骨架自带全局重置（ev_no_wcag 焦点轮廓），开箱即用不用改
        ├── font.css          # HarmonyOS Sans SC @font-face（预制，不用改）
        ├── tokens.css        # 空壳占位，步骤 4 填原始 :root 变量（含 --font-family）
        └── theme-dark.css    # 空壳占位，步骤 4 填 .dark 覆盖
```

拷贝后各文件何时改：

| 文件 | 作用 | 何时改 |
|------|------|--------|
| `package.json` | 依赖锁定（@nce/eview-react latest / react ^18.3 / react-intl ^7 / horizon peer / lodash / icon-plus） | 改 `name` |
| `.npmrc` | `@nce` scope 指向 product_npm 源 | 一般不改 |
| `vite.config.js` | Vite + plugin-react，最小配置 | 一般不改 |
| `index.html` | 薄入口，`<body class="ev_no_wcag aui3_1">` + `/src/main.jsx` | 改 `<title>` |
| `public/font/*` | HarmonyOS Sans SC 字体（4 个 .woff2） | 不改（font.css 引用） |
| `src/main.jsx` | Provider 组装 + 六处 css import（含 font.css） | import 不用改；步骤 2 切暗色时加类名切换逻辑 |
| `src/app.jsx` | 空壳 App | 步骤 3 替换为源项目 AppShell |
| `src/shared/icon.jsx` | 预制 `<Icon name=...>` shim（icon-plus 在线，无 Lucide 兜底） | 不改；源项目 `<Icon>` 调用点只改 import 路径（见 §3.0） |
| `src/styles/font.css` | HarmonyOS Sans SC @font-face（4 个权重） | 不改；`--font-family` 由 tokens.css 步骤 4 填 |
| `src/styles/tokens.css` | 空壳占位 | 步骤 4 填（含 `--font-family: 'HarmonyOS Sans', ...`） |
| `src/styles/theme-dark.css` | 空壳占位 | 步骤 4 填 |

> `main.jsx` 已把 `aui3_1.css` + `aui3_1_dark.css` + `base.css` + `font.css` + `tokens.css` + `theme-dark.css` 六处 import 都写好，步骤 4 填充 token 后无需再改入口。`src/shared/icon.jsx` 的图标 shim、`public/font/` 的字体已预置；图表直接用 `@nce/eview-react/Chart`（见 §3.0）。源项目用到的 `<Icon>` / `<Chart>` 迁移时调用点零改动。

### 1.2a 升级模式（源项目已是标准 Vite 工程）

若源项目已是标准 Vite + npm 工程（如 `umd-to-antd-vite` skill 产物——有 `package.json` + `vite.config.js` + 外置 `src/styles/tokens.css` + `theme-dark.css`），用 `--upgrade` 模式拷贝骨架：

```bash
node <skill目录>/scripts/init-scaffold.cjs <目标工程根> [项目名] [标题] --force --upgrade
```

`--upgrade` 模式跳过 `src/styles/` 目录的拷贝，保留已有的 `tokens.css` / `theme-dark.css` / `base.css` / `font.css`，只覆盖骨架文件（`package.json` / `.npmrc` / `vite.config.js` / `index.html` / `src/main.jsx` / `src/app.jsx` / `src/shared/icon.jsx` / `public/font/`）。token CSS 不丢失，步骤 4 可跳过。

> **注意**：`--upgrade` 会覆盖 `src/app.jsx` 为空壳。如果源项目的 `app.jsx` 有业务逻辑（暗色切换等），步骤 2 需重新配。`src/` 下的其他业务文件（views/、context.jsx 等）不受影响（scaffold 没有这些文件，不会覆盖）。

### 1.3 相对路径（已由 umd-to-antd-vite 修正）

路径已由 `umd-to-antd-vite` 步骤 3 修正（`./src/...` → `./...`）并验证通过。本步骤无需操作。步骤 3 组件替换时如新增 import，遵循以下规则：

- `src/app.jsx` 导入同级模块用 `./context.jsx`、`./data.js`
- `src/app.jsx` 导入视图用 `./views/X.jsx`
- `src/views/X.jsx` 导入上层数据用 `../data.js`、`../context.jsx`
- `src/` 内文件禁止写 `./src/...` 导入

### 1.4 依赖说明

`scaffold/package.json` 预置的依赖用途：

| 依赖 | 用途 | 是否必需 |
|------|------|---------|
| `react` / `react-dom` | React 运行时 | 必需 |
| `react-intl` | eview-react 组件内置文案的 i18n（`IntlProvider`） | 必需 |
| `dayjs` | 日期格式化；输入工程普遍 `import dayjs from "dayjs"` 做格式化，缺则报 `Failed to resolve "dayjs"` | 必需 |
| `@nce/eview-react` | 组件库本体 | 必需 |
| `@nce/icon-plus` | 图标库（`IconPlusIc*` 按需引入） | 用图标时必需 |
| `@cloudsop/horizon` | eview-react 的 peer 依赖；缺失报 `Element type is invalid` | 必需（peer） |
| `@cloudsop/horizon-intl` / `@cloudsop/htimezone` / `@baize/wdk` / `@hui/design-token` | eview-react 生态关联依赖（i18n 适配 / 时区 / 工具 / 设计 token） | 骨架预置；未用到可在 package.json 删除 |
| `lodash` | 工具库 | 必需 |

> 上述用途为基于包名与已有报错信息的推断，具体以实际工程的 `npm install` 与运行结果为准。

### 1.5 安装与启动

```bash
npm install    # bash 工具 timeout=30000
npm run dev
```

预期：页面能渲染（显示 "app root"），无样式报错。若报 `Element type is invalid` → horizon 等 peer 依赖未装上，常见报错对照见步骤 5.5。

> `npm install` 设 30s 超时：外网环境无法访问 `@nce` 内网源时会超时，记 `SKIP` 不阻断；`npm run dev` 无 node_modules 一并 `SKIP`。SKIP 规则详见 §4.6。

## 步骤 2：换 Provider 与入口

### 2.1 移除 antd Provider

```tsx
// ❌ 删除
import { ConfigProvider, theme } from 'antd';
import zhCN from './assets/shared/antd-zh-cn.js';

<ConfigProvider locale={zhCN}>
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        {children}
    </ConfigProvider>
</ConfigProvider>
```

### 2.2 暗色模式改类名切换

eview-react 用类名切换代替 antd 的 `theme.darkAlgorithm`：`aui3_1_dark` 挂 `<body>`（eview-react 组件暗色）、`.dark` 挂 `<html>`（原始 token 暗色覆盖）。完整 `useEffect` 代码见 [css-token-mapping.md](css-token-mapping.md) §4。

> scaffold 的 `src/app.jsx` 内置了一段暗色切换 `useEffect`（演示用）。步骤 3 用源项目 AppShell 替换 `app.jsx` 时，务必把这段暗色切换逻辑迁移到新 AppShell 或 `main.jsx`，否则暗色模式切换会失效。

### 2.3 `<body>` 加 aui3_1 类名

`aui3_1` 挂在 `<body>` 上（在 `index.html` 里写死：`<body class="ev_no_wcag aui3_1">`），不挂在 `.root` div：

```tsx
// app.jsx
<div className="root">
    <AppShell />
</div>
```

### 2.4 删除 antd 相关依赖

- 删除 `antd` 导入（改为 `@nce/eview-react/X`）
- 删除 `antd/locale/zh_CN` 导入（改为 IntlProvider）
- 删除 `@ant-design/icons` 导入（改为 scaffold 预制 `Icon` shim 或 `@nce/icon-plus`）

### 2.5 IntlProvider 放在 main.jsx（不要跟着 AppShell 搬）

> **高频踩坑点。** 源项目的 IntlProvider 通常在 `app.jsx` 的 AppShell 里（antd 项目把 `ConfigProvider locale` 和 `IntlProvider` 放一起）。迁移时容易原样留在 AppShell——但 eview-react 的 `ConfigProvider` 在 `main.jsx`，弹层（Dialog 等 portal）由 ConfigProvider 管理，**IntlProvider 必须是 ConfigProvider 的直接子级**，否则弹层内容取不到业务文案，报 `MISSING_TRANSLATION`。

操作要点（详见 [i18n-migration.md](i18n-migration.md) §4）：

1. **IntlProvider 放 main.jsx**，是 `ConfigProvider` 的直接子级
2. **locale 用 `"zh"`**（不是 `"zh-CN"`），匹配 `componentsLocales` 的 key
3. **合并组件文案 + 业务文案**：`mergedMessages = { zh: { ...componentsLocales.zh, ...businessMessages.zh }, en: ... }`
4. **lang state 在 context 里** → 用 `Root` 组件包一层读 `lang` 再提供 `IntlProvider`；`AppProvider` 放 `ConfigProvider` 内、`Root` 外
5. **app.jsx/AppShell 不再放** IntlProvider / AppProvider / mergedMessages / dayjs effect

```jsx
// main.jsx 结构
<ConfigProvider>
    <AppProvider>
        <Root />           {/* Root 里读 lang → IntlProvider → App */}
    </AppProvider>
</ConfigProvider>
```

> 反例与排查见 [i18n-migration.md](i18n-migration.md) §4.1 / §4.2。

## 步骤 3：逐组件替换

> 按组件映射总表替换，Form 模式单独处理。

### 3.0 图标（方案 C 离线匹配 + 静态 import）/ 图表（包导入）

**图标默认走方案 C**：读 skill 自带的 `icons/icon-plus-names.json`（按领域划分的 icon+ 名目录，`Public`/`Ict` 为通用主力域）离线匹配源项目（`ict-react-coder` 产物）的 Lucide/antd 图标名 → 命中即 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import，把 `<Icon name="search" />` 调用点替换为 `<IconPlusIcPublicSearch ... />`（**无网络依赖、彻底离线**）。组件名合成 = `"IconPlusIc" + Domain + Name`；无 `color` 时 `iconColor={['currentcolor']}`；`size`→`iconSize`（支持rem、px、数字）；未匹配名用占位 `IconPlusIcPublicTransverseRectangleTemplate`。完整算法见 [source-project-guidelines.md](source-project-guidelines.md) §3.2。

| 组件 | 源项目用法 | 迁移后（方案 C） |
|------|-----------|------------------|
| Icon | `<Icon name="search" size={14} />`（`./assets/shared/icon.jsx`） | `import { IconPlusIcPublicSearch } from '@nce/icon-plus'` + `<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} />`（名由 catalog 匹配） |
| Chart | `<Chart name="BarChart" option={...} />`（`../../../assets/shared/chart.jsx`） | `import Chart from '@nce/eview-react/Chart'`（任意位置，包导入） |

> **备选 A**（内网运行时 fetch 兜底）：scaffold `src/shared/icon.jsx`，`<Icon name="...">` 调用点零改动，只改 import 路径 `./assets/shared/icon.jsx` → `./shared/icon.jsx`（src/ 下）或 `../shared/icon.jsx`（views/ 下），见 [source-project-guidelines.md](source-project-guidelines.md) §3.3。跑 `scripts/check-relative-imports.cjs`（§5.1）扫残留 `./assets/shared/...` 旧路径。
> 图表契约（`<Chart name option />`、`.dark` 自动切主题、ResizeObserver 自适应、ref 方法）由 `@nce/eview-react/Chart` 原生提供，与源项目一致，详见 [components/Chart.md](components/Chart.md)。

### 3.1 A 类（有对应）：改 props

对每个有对应的组件，执行：
1. 改导入路径：`from 'antd'` → `from '@nce/eview-react/<Component>'`
2. 改属性名：对照 [naming-quirks.md](naming-quirks.md) 逐项替换
3. 改回调签名：首参从 event 改为 value
4. 改数据格式：`options` 的 `label`→`text`，`items`→`data` 等

### 3.2 B 类（无对应）：手写补位

1. 读 [handwrite-templates.md](handwrite-templates.md) 取对应模板
2. 按模板实现，样式用源项目的 CSS 变量（原始 token）
3. 加 `// TODO(eview-react)` 注释
4. 在最终回复中列出所有手写补位

### 3.3 C 类（Form 模式转换）

1. 读 [form-migration.md](form-migration.md)
2. `useForm()` → `useRef(null)`
3. `validateFields()` Promise → `submit()` + `onSuccess` 回调
4. 推进逻辑从 `.then()` 移到 `onSuccess` 内
5. `rules` 删 `message`
6. Toggle 加 `valuePropName="toggled" updateTrigger="onToggle"`

### 3.4 替换顺序建议

1. **叶子组件先换**（Button / TextField / Select 等）—— 改动小、验证快
2. **容器组件后换**（Form / Dialog / Table）—— 模式变化大
3. **布局组件最后换**（Layout / Menu / Breadcrumb）—— 影响全局

### 3.5 i18n key 对齐检查（Table render 函数）

> **高频源码 bug。** antd 项目的 Table 列 `render` 常用 `t(cellValue, cellValue)` 翻译单元格值。如果数据模型里 cell value 是短代码（如 `"gateway"`），而 i18n 字典的 key 带命名空间前缀（如 `"deviceType.gateway"`），`t("gateway", "gateway")` 会找不到消息，报 `MISSING_TRANSLATION`。这个 bug 在 antd 项目里就存在（antd 的 ConfigProvider locale 不走 react-intl，所以 antd 项目可能没注意到），迁移到 eview-react 后 IntlProvider 会严格报错。

**排查方法：** 对每个 Table 列的 `render` 函数，检查是否用 `t(value, ...)` / `intl.formatMessage({ id: value, ... })` 翻译单元格值。如果是，对照 `data.js` 的选项字典确认 value 是否等于 i18n key。也可以直接跑 `scripts/check-i18n-keys.cjs` 自动完成"调用侧 × 数据侧"交叉比对（见 §5.2）：

```js
// data.js 选项字典
export const deviceTypeOptions = [
  { value: "gateway", msgId: "deviceType.gateway", fallback: "智能网关" },
  //     ^^^^^^^         ^^^^^^^^^^^^^^^^^^^^
  //     value ≠ msgId    → render 里 t(value, value) 会 MISSING_TRANSLATION
];

export const policyTemplates = [
  { value: "policy.highFreq", msgId: "policy.highFreq", fallback: "高频采集策略" },
  //     ^^^^^^^^^^^^^^^^^^         ^^^^^^^^^^^^^^^^^^
  //     value === msgId             → render 里 t(value, value) 正确
];
```

**修复模式：**

```jsx
// ❌ value 是短代码，缺前缀 → MISSING_TRANSLATION
{ key: "type", render: (value) => t(value, value) }        // t("gateway", "gateway") ✗
{ key: "site", render: (value) => t(value, value) }        // t("shanghai", "shanghai") ✗

// ✅ 补上 i18n 命名空间前缀
{ key: "type", render: (value) => t("deviceType." + value, value) }
{ key: "site", render: (value) => t("site." + value, value) }

// ✅ value 本身就是完整 i18n key（无需改）
{ key: "policy", render: (value) => t(value, value) }      // t("policy.highFreq", ...) ✓
```

**对照表（常见命名空间）：**

| 数据字段 | value 示例 | i18n key 前缀 | render 写法 |
|---------|-----------|--------------|------------|
| type / deviceType | `"gateway"` | `"deviceType."` | `t("deviceType." + value, value)` |
| site | `"shanghai"` | `"site."` | `t("site." + value, value)` |
| status | `"online"` | `"status."` | `t("status." + value, value)` 或用 StatusTag 组件 |
| priority | `"high"` | `"option.priority."` | `t("option.priority." + value, value)` |
| compression | `"gzip"` | `"option.compression."` | `t("option.compression." + value, value)` |
| policy | `"policy.highFreq"` | （value 即完整 key） | `t(value, value)` 无需改 |

> **规则：** 凡是 `render: (value) => t(value, ...)` 且 `data.js` 中该字段的 `value ≠ msgId`，必须补前缀。`value === msgId` 的无需改。StatusTag 等自定义组件如果内部已做 `"status." + status` 拼接，则无需在 render 里再拼。

### 3.6 逐组件替换

步骤 3 上下文消耗最高（form-migration.md + handwrite-templates.md + components/*.md）。按以下顺序替换，每次只读当前需要的 reference：

**替换顺序**（叶子先、容器后、布局最后）：
1. **叶子组件**（Button / TextField / Select 等）—— 改动小、验证快
2. **容器组件**（Form / Dialog / Table）—— 模式变化大
3. **布局组件**（Layout / Menu / Breadcrumb）—— 影响全局

**每个组件替换时读**：
- [naming-quirks.md](naming-quirks.md) — 逐项替换命名差异
- [components/<组件>.md](components/INDEX.md) — 查完整 API
- [component-mapping.md](component-mapping.md) — 查"关键 API 差异"列
- Form 组件额外读 [form-migration.md](form-migration.md) — 模式转换（useForm→useRef、Promise→onSuccess 回调）
- 无对应组件读 [handwrite-templates.md](handwrite-templates.md) — 手写模板

**硬约束**：严格遵守 SKILL.md 的"eview-react 硬约束"章节（13 条）。导入路径改为 `import X from '@nce/eview-react/X'`。

替换完一类组件后，可先跑 `npm run dev` 快速验证该类是否编译通过，再继续下一类。全部替换完后进入步骤 5 验证。


## 步骤 4：验证

### 4.1 相对导入解析检查（已由 umd-to-antd-vite 验证，跳过）

路径已由 `umd-to-antd-vite` 修正并验证通过（`.umd-conversion.json` 的 `verification.relativeImports = "PASS"`）。本步骤跳过。如步骤 3 组件替换时改了 import 路径，可按需重跑确认：

脚本位于本 skill 的 `scripts/check-relative-imports.cjs`，两种调用方式任选其一：

```bash
# 方式 A：直接用 skill 目录的脚本（<skill目录> 是本 skill 的安装路径，
#         例如 ~/.opencode/skills/antd-to-eview-react）
node <skill目录>/scripts/check-relative-imports.cjs <目标工程根>

# 方式 B：把脚本拷到目标工程的 scripts/ 后在工程根执行
node scripts/check-relative-imports.cjs .
```

> 脚本只递归扫描 `<目标工程根>/src/`，不覆盖根目录的 `vite.config.js`、`vitest.setup.js` 等可能也用相对导入的配置文件。如需检查根目录配置，单独 `grep` 即可。

检查项：
- 所有 `from './...'` / `from '../...'` / `require('./...')` 是否能解析到真实文件
- `src/**/*.js(x)` / `src/**/*.ts(x)` 中是否残留 `./src/...`
- 允许自动补全 `.js` / `.jsx` / `.ts` / `.tsx` / `.json` / `.css` 与 `index.*`

常见修复：

| 错误导入 | 位置 | 正确导入 |
|---------|------|---------|
| `./src/context.jsx` | `src/app.jsx` | `./context.jsx` |
| `./src/views/AppShell.jsx` | `src/app.jsx` | `./views/AppShell.jsx` |
| `./src/data.js` | `src/app.jsx` | `./data.js` |

### 4.2 i18n 动态 key 检查（必跑）

> 针对 §3.5 的高频 bug（`t(value, value)` 缺命名空间前缀 → `MISSING_TRANSLATION`）。人工逐列核对容易漏，迁移后、`npm run dev` 前必须跑脚本。

脚本位于本 skill 的 `scripts/check-i18n-keys.cjs`，两种调用方式任选其一：

```bash
# 方式 A：直接用 skill 目录的脚本
node <skill目录>/scripts/check-i18n-keys.cjs <目标工程根>

# 方式 B：把脚本拷到目标工程的 scripts/ 后在工程根执行
node scripts/check-i18n-keys.cjs .
```

脚本做两类静态检查（纯正则，不执行代码）：

1. **数据侧**：扫描 `src/` 下 `{ value: "...", msgId: "..." }` 选项字典，列出所有 `value !== msgId` 的字段及其命名空间前缀（如 `value="gateway"` / `msgId="deviceType.gateway"` → 前缀 `"deviceType."`）
2. **调用侧**：扫描所有 `t(x, x)` 双参同名的动态翻译调用（典型如 Table 列 `render: (value) => t(value, value)`），并与数据侧结果交叉比对：
   - 字段的 `value ≠ msgId` 且调用未加前缀 → **高危**（运行时必报 `MISSING_TRANSLATION`），按 `t("前缀" + value, value)` 修复
   - 字段的 `value === msgId`（如 `policy.highFreq`）→ 无需改，报告标"待核对"

脚本默认 advisory（退出码 0，输出报告供人工核对）；加 `--strict` 时发现高危调用退出码 1，可接入 CI。

### 4.3 编译检查

```bash
npm install    # bash 工具 timeout=30000；超时/失败记 SKIP
npm run dev
```

> `npm install` 超时/失败（外网无法访问 `@nce` 内网源）记 `SKIP` 不判 `FAIL`，`npm run dev` 一并 `SKIP`（无 node_modules 无法启动）。SKIP 不影响整体 status，详见 §4.6。

### 4.4 功能验证清单

- [ ] 页面能渲染（无 `Element type is invalid` → 检查 peer 依赖）
- [ ] 组件有 ICT 3.1 样式（无样式 → 检查 `aui3_1.css` 导入和 `<body>` 上的 `aui3_1` 类名）
- [ ] 弹层文案是中文（显示 key → 检查 `IntlProvider` + `messages`）
- [ ] 控制台无 `MISSING_TRANSLATION` 报错（弹层里的业务文案取不到 → 见 §2.5 / 5.5；Table render 里 cell value 不是完整 i18n key → 见 §3.5）
- [ ] 已运行 `check-i18n-keys.cjs` 且报告中无"高危"项（见 §5.2）
- [ ] Table 列 render 函数中 `t(value, ...)` 的 value 是完整 i18n key（否则补前缀，见 §3.5）
- [ ] 表单能输入（`TextField` value+onChange 成对）
- [ ] 表单校验触发（`ref.submit()` → `onSuccess`）
- [ ] 下拉选项渲染（`options=[{text,value}]` 字段名正确）
- [ ] 弹窗能打开和关闭（`isOpen`/`visible` 受控 + `onClose` 里置 false）
- [ ] 暗色模式切换（`<body>` 上 `aui3_1` / `aui3_1_dark` + `<html>` 上 `.dark` 都切）
- [ ] 手写补位组件样式跟随主题（用了 CSS 变量，不写死色值）

### 4.5 常见报错对照

| 报错 | 原因 | 修复 |
|------|------|------|
| `Failed to resolve import "./src/context.jsx" from "src/app.jsx"` | 源项目根目录 `app.jsx` 的 import 被原样搬到 scaffold 的 `src/app.jsx` | `./src/context.jsx`→`./context.jsx`，`./src/views/...`→`./views/...`，并跑 `check-relative-imports.cjs` |
| `Element type is invalid` | 缺 peer 依赖 | 补装 `@cloudsop/horizon` 等 |
| `Form.Item is undefined` | Form 导入方式错 | `import Form from '@nce/eview-react/Form'` |
| 组件无样式 | 未引 css 或缺类名 | 引 `aui3_1.css` + `<body>` 加 `class="aui3_1"` |
| 弹层文案是 key | 缺 IntlProvider | 加 `IntlProvider` + `messages` |
| `MISSING_TRANSLATION: Missing message "xxx" for locale "zh"` | IntlProvider 放在 `app.jsx`/AppShell 里，不是 `ConfigProvider` 的直接子级；ConfigProvider 的弹层（Dialog 等 portal）落到了 IntlProvider 之外，业务 `<FormattedMessage>` 取不到业务文案 | 把 IntlProvider 搬到 `main.jsx`，做 `ConfigProvider` 的直接子级；lang state 在 context 里就用 `Root` 组件包一层读 lang；locale 用 `"zh"` 不是 `"zh-CN"`；合并 `componentsLocales` + 业务文案。详见 [i18n-migration.md](i18n-migration.md) §4 |
| `MISSING_TRANSLATION: Missing message "gateway" for locale "zh"`（消息 id 是短代码如 "gateway"/"shanghai"） | Table 列 `render` 用 `t(value, value)` 翻译单元格值，但 `data.js` 里 value 是短代码（`"gateway"`），i18n key 带前缀（`"deviceType.gateway"`），`t("gateway", ...)` 找不到消息 | 在 render 里补 i18n 命名空间前缀：`t("deviceType." + value, value)`；对照 `data.js` 选项字典的 `value` vs `msgId`，`value ≠ msgId` 的都要补。详见 §3.5 |
| `undefined is not a function` | ref 还没挂载就调方法 | 检查 `?.` 可选链 + 组件是否已渲染 |

### 4.6 验证

跑验证脚本 + 构建检查，把结果写入 `<目标工程根>/.migration-result.json`。

**验证步骤**：
1. 相对导入检查**跳过**（路径已由 `umd-to-antd-vite` 修正，`.umd-conversion.json` 的 `verification.relativeImports=PASS`）；步骤 3 替换组件时若新增 import，靠第 4 步 `npm run dev` 的 Vite import-analysis 兜底
2. 跑 `node <skill目录>/scripts/check-i18n-keys.cjs <目标工程根>`
3. `cd <目标工程根> && npm install`（bash 工具 timeout=30000）；超时/失败（外网无法访问 `@nce` 内网源）记 `SKIP`，跳过步骤 4-5
4. `npm run dev` 确认启动成功
5. 按 §4.4 功能验证清单逐项检查

**结果文件**：把结果写入 `<目标工程根>/.migration-result.json`（覆盖写），JSON 结构：

```json
{
  "status": "PASS" 或 "FAIL",
  "round": {round},
  "failures": ["失败点 1", ...],
  "checks": {
    "relative-imports": "PASS/FAIL",
    "i18n-keys": "PASS/FAIL",
    "npm-install": "PASS/SKIP",
    "npm-run-dev": "PASS/SKIP",
    "functional": "X/Y"
  },
  "notes": "可选说明"
}
```

- 所有验收项全过 → status="PASS"，failures=[]
- 任一不过（SKIP 不算不过）→ status="FAIL"，failures 逐条写清具体失败点
- npm-install=SKIP 时 npm-run-dev 一并 SKIP，整体 status 不因 SKIP 判 FAIL（notes 写明外网环境降级，仅静态检查 i18n-keys 生效）

**循环上限**：默认 5 轮（round 1 首次验证，round 2~5 修复后重测）。验证 FAIL 时主 agent 直接读 `.migration-result.json` 的 `failures` 字段，回到步骤 3 自己修复，再重新验证（round + 1）。第 5 轮仍 FAIL 必须停止，向用户报告失败项 + 建议人工介入。