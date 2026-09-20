# 迁移工作流（详细步骤）

> 从 antd 项目迁移到 eview-react 的完整流程。按步骤执行，每步产出明确。

## 步骤 0：评估迁移可行性

### 0.1 扫描源项目组件清单

用 grep / 人工审查源项目 `src/`，列出所有 antd 组件导入：

```bash
# 查找所有 antd 导入
grep -rn "from 'antd'" src/ --include="*.jsx" --include="*.tsx"
grep -rn "from \"antd\"" src/ --include="*.jsx" --include="*.tsx"
```

### 0.2 对照组件映射总表分类

将扫描到的组件分为三类：

| 分类 | 含义 | 处理 |
|------|------|------|
| **A. 有对应** | eview-react 有同名或功能等价组件（有 Reference） | 直接替换，改 props |
| **B. 无对应需手写** | eview-react 无对应组件 | 用 [handwrite-templates.md](handwrite-templates.md) 模板 |
| **C. 需模式转换** | 组件有对应但 API 模式不同（Form / Steps / Modal） | 读 [form-migration.md](form-migration.md) |

### 0.3 评估工作量

- A 类组件 × 数量 → 每个约 5-15 分钟（改 props）
- B 类组件 × 数量 → 每个约 15-30 分钟（手写 + 调样式）
- C 类模式 → Form 迁移约 30-60 分钟（控制流重写）
- CSS 变量切换 → 全局约 30-60 分钟

### 0.4 输出迁移清单

| antd 组件 | 分类 | eview-react 替换 | 涉及文件 | 备注 |
|-----------|------|-----------------|---------|------|
| Button | A | Button (status) | AppShell.jsx | type→status |
| Form | C | Form (ref) | StepFlow.jsx | useForm→ref |
| Layout | B | 手写 | AppShell.jsx | 无对应 |
| ... | | | | |

## 步骤 1：建工程骨架

### 1.1 判断是否需要新建

- 源项目已有 `package.json` + Vite → 跳到步骤 2
- 源项目是 UMD/单 HTML/无构建 → 执行 1.2（拷贝 `scaffold/` 预制骨架）

### 1.2 拷贝预制骨架

`scaffold/`（skill 根目录，与 `references/` 并列）是预制好的可运行空壳工程，已含步骤 1 所需全部文件，不必逐个手写。整目录拷贝到目标工程根：

```bash
cp -r scaffold/ <目标工程根>
```

布局：

```
scaffold/
├── package.json        # 依赖已含 @nce/eview-react / react-intl / horizon peer / lodash 等
├── .npmrc              # @nce scope 指向华为 product_npm 源
├── vite.config.js      # Vite + @vitejs/plugin-react
├── index.html          # <body class="ev_no_wcag"> + /src/main.jsx
└── src/
    ├── main.jsx        # ConfigProvider + IntlProvider + aui3_1.css + base.css + tokens.css + theme-dark.css
    ├── app.jsx         # 空壳 App（<div className="root">；aui3_1 挂 <body>），步骤 3 替换为 AppShell
    └── styles/
        ├── base.css          # 骨架自带全局重置（ev_no_wcag 焦点轮廓），开箱即用不用改
        ├── tokens.css        # 空壳占位，步骤 4 填原始 :root 变量
        └── theme-dark.css    # 空壳占位，步骤 4 填 .dark 覆盖
```

拷贝后各文件何时改：

| 文件 | 作用 | 何时改 |
|------|------|--------|
| `package.json` | 依赖锁定（@nce/eview-react latest / react ^18.3 / react-intl ^7 / horizon peer / lodash） | 改 `name` |
| `.npmrc` | `@nce` scope 指向 product_npm 源 | 一般不改 |
| `vite.config.js` | Vite + plugin-react，最小配置 | 一般不改 |
| `index.html` | 薄入口，`<body class="ev_no_wcag">` + `/src/main.jsx` | 改 `<title>` |
| `src/main.jsx` | Provider 组装 + 四处 css import | import 不用改；步骤 2 切暗色时加类名切换逻辑 |
| `src/app.jsx` | 空壳 App | 步骤 3 替换为源项目 AppShell |
| `src/styles/tokens.css` | 空壳占位 | 步骤 4 填 |
| `src/styles/theme-dark.css` | 空壳占位 | 步骤 4 填 |

> `main.jsx` 已把 `aui3_1.css` + `aui3_1_dark.css` + `base.css` + `tokens.css` + `theme-dark.css` 四处 import 都写好，步骤 4 填充 token 后无需再改入口。

### 1.3 文件位置变化与相对路径

UMD/单 HTML 源项目经常同时有根目录 `app.jsx` 和 `src/` 目录。根目录 `app.jsx` 中的导入通常长这样：

```jsx
import { AppProvider } from './src/context.jsx';
import AppShell from './src/views/AppShell.jsx';
```

拷贝 scaffold 后，目标工程入口组件是 `src/app.jsx`。如果把根目录 `app.jsx` 的 import 原样搬进 `src/app.jsx`，Vite 会把 `./src/context.jsx` 解析成 `src/src/context.jsx` 并报错：

```text
[plugin:vite:import-analysis] Failed to resolve import "./src/context.jsx" from "src/app.jsx"
```

正确写法：

```jsx
// src/app.jsx
import { AppProvider } from './context.jsx';
import AppShell from './views/AppShell.jsx';
```

规则：
- `src/app.jsx` 导入同级模块用 `./context.jsx`、`./data.js`
- `src/app.jsx` 导入视图用 `./views/X.jsx`
- `src/views/X.jsx` 导入上层数据用 `../data.js`、`../context.jsx`
- `src/` 内文件禁止残留 `./src/...` 导入

### 1.4 依赖说明

`scaffold/package.json` 预置的依赖用途：

| 依赖 | 用途 | 是否必需 |
|------|------|---------|
| `react` / `react-dom` | React 运行时 | 必需 |
| `react-intl` | eview-react 组件内置文案的 i18n（`IntlProvider`） | 必需 |
| `@nce/eview-react` | 组件库本体 | 必需 |
| `@nce/icon-plus` | 图标库（`IconPlusIc*` 按需引入） | 用图标时必需 |
| `@cloudsop/horizon` | eview-react 的 peer 依赖；缺失报 `Element type is invalid` | 必需（peer） |
| `@cloudsop/horizon-intl` / `@cloudsop/htimezone` / `@baize/wdk` / `@hui/design-token` | eview-react 生态关联依赖（i18n 适配 / 时区 / 工具 / 设计 token） | 骨架预置；未用到可在 package.json 删除 |
| `lodash` | 工具库 | 源项目用到则保留 |

> 上述用途为基于包名与已有报错信息的推断，具体以实际工程的 `npm install` 与运行结果为准。

### 1.5 安装与启动

```bash
npm install
npm run dev
```

预期：页面能渲染（显示 "app root"），无样式报错。若报 `Element type is invalid` → horizon 等 peer 依赖未装上，常见报错对照见步骤 5.5。

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

### 2.3 `<body>` 加 aui3_1 类名

`aui3_1` 挂在 `<body>` 上（在 `index.html` 里写死：`<body class="ev_no_wcag aui3_1">`），不挂在 `.root` div：

```tsx
// app.jsx
<div className="root">
    <AppShell />
</div>
```

### 2.4 删除 antd 相关依赖

- 删除 `antd` 导入
- 删除 `antd-zh-cn.js` 等语言包
- 删除 UMD 库引用（`antd.min.js` 等）

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

## 步骤 4：提取 CSS token

> 详见 [css-token-mapping.md](css-token-mapping.md)

迁移时保留源项目的 token 体系，不做变量名替换。操作：

1. 从源项目的 `index.page.html`（或内联 `<style>`）提取 `:root` 变量定义到 `src/styles/tokens.css`
2. 提取 `.dark` 暗色覆盖到 `src/styles/theme-dark.css`（有的话）
3. 在入口同时引入：`import '@nce/eview-react/styles/aui3_1.css'` + `import '@nce/eview-react/styles/aui3_1_dark.css'` + `import './styles/tokens.css'` + `import './styles/theme-dark.css'`
4. 布局/手写 CSS 不改（继续引用 `var(--surface)` 等原始变量名）
5. 暗色模式同时切 `<body>` 上的 `aui3_1` / `aui3_1_dark` 和 `<html>` 上的 `.dark`

通用规则：
- 不写死色值，用 CSS 变量（源项目的原始 token）
- 类名用业务前缀（`app-`）不用 `ev_`
- 可点击元素用 `<button type="button">`

## 步骤 5：验证

### 5.1 相对导入解析检查（必跑）

语法检查只能发现 JSX/JS 写法错误，发现不了 `src/app.jsx` 中 `./src/context.jsx` 这类路径错误。迁移后、`npm run dev` 前必须跑：

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

### 5.2 i18n 动态 key 检查（必跑）

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

### 5.3 编译检查

```bash
npm install
npm run dev
```

### 5.4 功能验证清单

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

### 5.5 常见报错对照

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