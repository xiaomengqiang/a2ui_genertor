# 迁移工作流（详细步骤）

> 从 antd 项目迁移到 eview-react 的完整流程。按步骤执行，每步产出明确。

## 步骤 0：评估迁移可行性

读 `.umd-conversion.json` 的 `migrationPlan` 数组（由上游 `umd-to-antd-vite` 步骤 5 始终填充）。每项含 `antd` / `category`（A/B/C）/ `eview` / `keyDiffs` / `ref` / `files`，即组件迁移清单，无需读 `component-mapping.md` 大表对照。

| 分类 | 含义 | 处理 |
|------|------|------|
| **A. 有对应** | eview-react 有同名或功能等价组件 | 直接替换，改 props |
| **B. 无对应需手写** | eview-react 无对应组件 | 用 [handwrite-templates.md](handwrite-templates.md) 模板 |
| **C. 需模式转换** | 组件有对应但 API 模式不同（Steps / Modal） | 读 §3.3 |

据此规划步骤 2 替换顺序（叶子先、容器后、布局最后），按需读 `ref` 指向的 reference，进入步骤 1。

## 步骤 1：i18n 设置

> antd ConfigProvider + theme.darkAlgorithm 已由 umd-to-antd-vite 步骤 3 删除并换成 eview 类名切换；`<body class="aui3_1">` 已在 scaffold `index.html` 写死。本步骤只做 IntlProvider 业务文案合并。

### 2.5 IntlProvider 放在 main.jsx（不要跟着 AppShell 搬）

> **高频踩坑点。** IntlProvider 必须是 `main.jsx` 中 `ConfigProvider` 的**直接子级**（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；locale 用 `"zh"` 不是 `"zh-CN"`。完整代码（含 `Root` 包一层读 lang、合并 `componentsLocales` + 业务文案、反例对照）见 [i18n-migration.md](i18n-migration.md) §4。

```jsx
// main.jsx 结构（详见 i18n-migration.md §4.1）
<ConfigProvider>
    <AppProvider>
        <Root />           {/* Root 里读 lang → IntlProvider → App */}
    </AppProvider>
</ConfigProvider>
```

## 步骤 2：逐组件替换

> 按组件映射总表替换。

### 3.0 图标（方案 C 离线匹配 + 静态 import）/ 图表（包导入）

**图标默认走方案 C**：读 skill 自带的 `icons/icon-plus-names.json`（按领域划分的 icon+ 名目录，`Public`/`Ict` 为通用主力域）离线匹配源项目（`ict-react-coder` 产物）的 Lucide/antd 图标名 → 命中即 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import，把 `<Icon name="search" />` 调用点替换为 `<IconPlusIcPublicSearch ... />`（**无网络依赖、彻底离线**）。组件名合成 = `"IconPlusIc" + Domain + Name`；无 `color` 时 `iconColor={['currentcolor']}`；`size`→`iconSize`（支持rem、px、数字）；未匹配名用占位 `IconPlusIcPublicTransverseRectangleTemplate`。完整算法见 [components/Icon.md](components/Icon.md) §1.1。

| 组件 | 源项目用法 | 迁移后（方案 C） |
|------|-----------|------------------|
| Icon | `<Icon name="search" size={14} />`（`./assets/shared/icon.jsx`） | `import { IconPlusIcPublicSearch } from '@nce/icon-plus'` + `<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} />`（名由 catalog 匹配） |
| Chart | `<Chart name="BarChart" option={...} />`（`../../../assets/shared/chart.jsx`） | `import Chart from '@nce/eview-react/Chart'`（任意位置，包导入） |

> **备选 A**（内网运行时 fetch 兜底）：scaffold `src/shared/icon.jsx`，`<Icon name="...">` 调用点零改动，只改 import 路径 `./assets/shared/icon.jsx` → `./shared/icon.jsx`（src/ 下）或 `../shared/icon.jsx`（views/ 下），见 [components/Icon.md](components/Icon.md) §1.2。跑 `scripts/check-relative-imports.cjs` 扫残留 `./assets/shared/...` 旧路径。
> 图表契约（`<Chart name option />`、`.dark` 自动切主题、ResizeObserver 自适应、ref 方法）由 `@nce/eview-react/Chart` 原生提供，与源项目一致，详见 [components/Chart.md](components/Chart.md)。

### 3.1 A 类（有对应）：改 props

对每个有对应的组件，执行：
1. 改导入路径：`from 'antd'` → `from '@nce/eview-react/<Component>'`
2. 改属性名：对照 [component-mapping.md](component-mapping.md) 逐项替换（含文末「属性拼写异常」+「回调签名差异」速查表）
3. 改回调签名：首参从 event 改为 value
4. 改数据格式：`options` 的 `label`→`text`，`items`→`data` 等

### 3.2 B 类（无对应）：手写补位

1. 读 [handwrite-templates.md](handwrite-templates.md) 取对应模板
2. 按模板实现，样式用源项目的 CSS 变量（原始 token）
3. 加 `// TODO(eview-react)` 注释
4. 在最终回复中列出所有手写补位

> **先查 `antdComponents`**：若 Layout/Space/Card/Skeleton 等不在 `antdComponents` 中（上游已改写为 H5：`<div>` + CSS 变量），保留已有结构、不套 handwrite 模板；仅 `antdComponents` 中仍有的组件才手写补位。

### 3.3 C 类（模式转换）

**Steps**：`current`→`currentStep`（对应 `data[].value` 不是下标）；`items`→`data=[{text,value}]`；`onClick(index)` 只允许回跳。见 [components/Steps.md](components/Steps.md)。

**Modal / Modal.confirm**：`open`→`isOpen`；`footer`→`buttons=[{text,status,onClick}]`；`onClose` 不自动关闭（需 `setIsOpen(false)`）；`Modal.confirm()`→`MessageDialog type="confirm"`。见 [components/Dialog.md](components/Dialog.md) / [components/MessageDialog.md](components/MessageDialog.md)。

### 3.4 替换顺序与执行

按以下顺序替换（叶子先、容器后、布局最后），每次只读当前需要的 reference：

1. **叶子组件**（Button / TextField / Select 等）—— 改动小、验证快
2. **容器组件**（Dialog / Table）—— 模式变化大
3. **布局组件**（Layout / Menu / Breadcrumb）—— 影响全局

**每个组件替换时读**：
- [component-mapping.md](component-mapping.md) — 查"关键 API 差异"列 + 文末拼写/回调速查表
- [components/<组件>.md](components/INDEX.md) — 查完整 API
- 无对应组件读 [handwrite-templates.md](handwrite-templates.md) — 手写模板

**硬约束**：遵守 SKILL.md 的"eview-react 硬约束"章节（10 条）。导入路径改为 `import X from '@nce/eview-react/X'`。

全部替换完后进入步骤 3 验证。

### 3.5 i18n key 对齐检查（Table render 函数）

> **高频源码 bug。** antd 项目的 Table 列 `render` 常用 `t(cellValue, cellValue)` 翻译单元格值。如果数据模型里 cell value 是短代码（如 `"gateway"`），而 i18n 字典的 key 带命名空间前缀（如 `"deviceType.gateway"`），`t("gateway", "gateway")` 会找不到消息，报 `MISSING_TRANSLATION`。这个 bug 在 antd 项目里就存在（antd 的 ConfigProvider locale 不走 react-intl，所以 antd 项目可能没注意到），迁移到 eview-react 后 IntlProvider 会严格报错。

**排查方法：** 对每个 Table 列的 `render` 函数，检查是否用 `t(value, ...)` / `intl.formatMessage({ id: value, ... })` 翻译单元格值。如果是，对照 `data.js` 的选项字典确认 value 是否等于 i18n key。也可以直接跑 `scripts/check-i18n-keys.cjs` 自动完成"调用侧 × 数据侧"交叉比对（见 §4.2）：

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


## 步骤 3：验证

### 4.1 相对导入解析检查（跳过）

路径已由 `umd-to-antd-vite` 修正并验证通过。本步骤跳过。如步骤 2 改了 import 路径需确认，可跑 `node <skill目录>/scripts/check-relative-imports.cjs <目标工程根>`。

### 4.2 i18n 动态 key 检查（必跑）

> 针对 §3.5 的高频 bug（`t(value, value)` 缺命名空间前缀 → `MISSING_TRANSLATION`）。人工逐列核对容易漏，迁移后必须跑脚本。

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

### 4.3 常见报错对照

| 报错 | 原因 | 修复 |
|------|------|------|
| `Element type is invalid` | 缺 peer 依赖 | 补装 `@cloudsop/horizon` 等 |
| 组件无样式 | 未引 css 或缺类名 | 引 `aui3_1.css` + `<body>` 加 `class="aui3_1"` |
| 弹层文案是 key | 缺 IntlProvider | 加 `IntlProvider` + `messages` |
| `MISSING_TRANSLATION: Missing message "xxx" for locale "zh"` | IntlProvider 放在 `app.jsx`/AppShell 里，不是 `ConfigProvider` 的直接子级 | 把 IntlProvider 搬到 `main.jsx` 作为 `ConfigProvider` 直接子级；详见 [i18n-migration.md](i18n-migration.md) §4 |
| `MISSING_TRANSLATION: Missing message "gateway" for locale "zh"`（消息 id 是短代码如 "gateway"/"shanghai"） | Table 列 `render` 用 `t(value, value)` 但 `data.js` 里 value 是短代码、i18n key 带前缀 | 在 render 里补命名空间前缀：`t("deviceType." + value, value)`；详见 §3.5 |
| `undefined is not a function` | ref 还没挂载就调方法 | 检查 `?.` 可选链 + 组件是否已渲染 |

### 4.4 验证

跑验证脚本，把结果写入 `<目标工程根>/.migration-result.json`。

**验证步骤**：
1. 相对导入检查**跳过**（见 §4.1）
2. 跑 `node <skill目录>/scripts/check-i18n-keys.cjs <目标工程根>`
3. `cd <目标工程根> && npm install`（bash 工具 timeout=30000）；超时/失败（外网无法访问 `@nce` 内网源）记 `SKIP`

**结果文件**：把结果写入 `<目标工程根>/.migration-result.json`（覆盖写），JSON 结构：

```json
{
  "status": "PASS" 或 "FAIL",
  "round": {round},
  "failures": ["失败点 1", ...],
  "checks": {
    "relative-imports": "PASS/FAIL",
    "i18n-keys": "PASS/FAIL",
    "npm-install": "PASS/SKIP"
  },
  "notes": "可选说明"
}
```

- 所有验收项全过 → status="PASS"，failures=[]
- 任一不过（SKIP 不算不过）→ status="FAIL"，failures 逐条写清具体失败点
- npm-install=SKIP 不影响整体 status（notes 写明外网环境降级，仅静态检查 i18n-keys 生效）

**循环上限**：默认 5 轮（round 1 首次验证，round 2~5 修复后重测）。验证 FAIL 时主 agent 直接读 `.migration-result.json` 的 `failures` 字段，回到步骤 2 自己修复，再重新验证（round + 1）。第 5 轮仍 FAIL 必须停止，向用户报告失败项 + 建议人工介入。