# 迁移工作流（详细步骤）

> 从 antd 项目迁移到 eview-react 的完整流程。按步骤执行，每步产出明确。

## 步骤 0：评估迁移可行性

### 0.1 读交接文件获取迁移清单

源项目是 `umd-to-antd-vite` 产物，目标工程根必有 `.umd-conversion.json` 交接文件。

**优先路径（`migrationPlan` 非 `null`，上游 `umd-to-antd-vite` 步骤 5 已评估前置）**：直接读 `migrationPlan` 数组作为分类评估清单——每项已含 `antd` / `category`（A/B/C）/ `eview` / `keyDiffs` / `ref` / `files`。**无需再读 `component-mapping.md` 大表对照，直接跳到 §0.4 用此清单规划步骤 3 替换顺序**（§0.2 分类、§0.3 估时均可从 `migrationPlan` 的 `category` 字段直接统计，跳过）。

**回退路径（`migrationPlan` 为 `null`，上游未跑步骤 5）**：读 `antdComponents` 字段（keys 即组件名列表）作为迁移清单，同时读 `antdIcons` 获取图标清单，进入 §0.2 手动对照 `component-mapping.md` 分类。文件路径字段仅供参考（搬代码后路径可能变），以组件名为准。

**`antdIcons` 只统计 `@ant-design/icons` 命名导入，不代表有无图标**。ict-react-coder 产物普遍用**自定义 `<Icon name="...">` 运行时 shim**（`assets/shared/icon.jsx`，源码里的"方案A形式"组件）、不用 `@ant-design/icons`，故 `antdIcons` **恒为 `[]`**——但实际有大量 `<Icon name>` 调用点（复杂页面 31 处、preview3 20+ 处），**正是方案 C/B 要扫描改写的目标**。**判断是否有图标看 `<Icon name` 调用点，不看 `antdIcons`**：
> ```bash
> grep -rl "<Icon\b" <目标工程>/src/
> ```
> 输出非空即有图标站点，**必须走 §3.0 图标步骤**（C 跑 `match-icons.cjs` / B 在线匹配），**禁止因 `antdIcons: []` 跳过 `match-icons.cjs`**。源码 `<Icon name>` shim ≠ 产物方案A，其字面量站点必须转 C/B。

> 组件清单已由 `umd-to-antd-vite` 生成并写入交接文件，不需要手动 grep 扫描 `src/`。`migrationPlan` 是否非 `null` 决定走优先路径（跳过 §0.2/§0.3）还是回退路径（手动对照大表）。

### 0.2 对照组件映射总表分类（回退路径，优先路径跳过）

> 若 §0.1 走优先路径（`migrationPlan` 已含 `category` 字段），本节跳过。仅回退路径（`migrationPlan` 为 `null`）需手动对照下表。

将交接文件中读取到的组件分为三类：

| 分类 | 含义 | 处理 |
|------|------|------|
| **A. 有对应** | eview-react 有同名或功能等价组件 | 直接替换，改 props |
| **B. 无对应需手写** | eview-react 无对应组件 | 用 [handwrite-templates.md](handwrite-templates.md) 模板 |
| **C. 需模式转换** | 组件有对应但 API 模式不同（Steps / Modal） | 读 §3.3 |

据此规划步骤 2 替换顺序（叶子先、容器后、布局最后），按需读 `ref` 指向的 reference，进入步骤 1。

## 步骤 1：i18n 设置

> antd ConfigProvider + theme.darkAlgorithm 已由 umd-to-antd-vite 步骤 3 删除并换成 eview 类名切换；`<body class="aui3_1">` 已在 scaffold `index.html` 写死。i18n 静态接线按 `.umd-conversion.json` 的 `i18nScenario` 分支：
> - **scenario A/B（`wired=true`）**：上游步骤 3 已完成 `main.jsx` 接线（IntlProvider + componentsLocales，B 还合并了业务包）。本步骤**跳过接线**，只做运行时验证（DatePicker 月份显中文、Dialog 等 portal 不报 `MISSING_TRANSLATION`、Pagination "条/页" 正常），运行时验证并入步骤 3 的 `npm install` + 浏览器实测。
> - **scenario C（`wired=false`）**：源项目用 i18next，上游未合并业务包。本步骤做 keep i18next vs 迁 react-intl 决策（见 [i18n-migration.md](i18n-migration.md) §3 场景 C）；若迁 react-intl，按 §4 在 `main.jsx` 接 IntlProvider（注意 §2.5 的放置位置）。

### 2.5 IntlProvider 放在 main.jsx（不要跟着 AppShell 搬）

> scenario A/B 的 IntlProvider 已由上游 `umd-to-antd-vite` 步骤 3 在 `main.jsx` 正确放置，本节主要针对 scenario C（迁 react-intl）接线时。**高频踩坑点。** IntlProvider 必须是 `main.jsx` 中 `ConfigProvider` 的**直接子级**（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；locale 用 `"zh"` 不是 `"zh-CN"`。完整代码（含 `Root` 包一层读 lang、合并 `componentsLocales` + 业务文案、反例对照）见 [i18n-migration.md](i18n-migration.md) §4。

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

### 3.0 图标（方案 B/C 名匹配 + 静态 import）/ 图表（包导入）

> **图标步骤触发条件 = `src/` 下存在 `<Icon name` 调用点（`grep -rl "<Icon\b" src/` 非空）或 `@ant-design/icons` 用法，与 `.umd-conversion.json` 的 `antdIcons` 是否为空无关**。源项目的 `<Icon name="...">` 运行时 shim（`assets/shared/icon.jsx`）是源码里的"方案A形式"组件，但**不等于产物方案A**：其 `<Icon name="字面量">` 调用点、以及**成员表达式 `name={t.icon}` / `name={MENU[0].icon}`（绑到同文件/跨文件静态数组）**都是方案 C/B 的**主要目标**，必须跑 `match-icons.cjs`（C）或在线匹配（B）转为 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import；只有真动态名（`name={row.iconField}` 类运行时数据，绑不到任何已扫文件中的静态数组常量）才落产物方案A shim。**`antdIcons: []` 时只要 src/ 有 `<Icon name` 站点就必跑图标步骤，禁止跳过**（ict-react-coder 产物 `antdIcons` 恒 `[]` 但有大量 `<Icon name>` 站点——见 §0.1 警告）。
>
> **已落方案A的产物可原地补救**：若产物调用点仍为 `<Icon name="字面量" .../>` 或 `name={t.icon}`（前次迁移漏跑图标步骤），直接 `node scripts/match-icons.cjs <工程根> --apply` 即可把字面量站点 + 数据数组动态名站点转为 C/B（脚本幂等：已含 `IconPlusIc` 的站点自动跳过）。`--apply` 还会自动把因改写引入 JSX 的 `.js`→`.jsx` / `.ts`→`.tsx` 并修引用方显式扩展名 import。

**项目级先选 B 还是 C**：迁移开始先探测 `https://octo.hdesign.huawei.com/` 可达性（如 `curl -sI https://octo.hdesign.huawei.com/` / WebFetch），全项目统一一种：
- **可达（内网）→ 方案 B**：LLM 调在线 `getIconInfo?keyword=<名>&topK=2&source_id=6` 接口匹配图标名 → `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import。
- **不可达（外网）→ 方案 C**：跑 `node scripts/match-icons.cjs <目标工程根>` 自动扫描 `src/` 下 `<Icon name="..." />`/`<Icon name={...}/>`（含常量传播、三元、变量分流）与 `@ant-design/icons` 调用点，按 [match-icons.cjs](../scripts/match-icons.cjs) 的 `matchOne` 离线匹配 `icons/icon-plus-names.json`（顶层 key 是按图标名前置词分的桶，**非语义领域**；候选打分用 token 重叠+子串，不按桶优先）。输出 `.icon-match.json` 报告：**confirmed**（SEMANTIC/L1-L4 命中，含多桶同名按最短完整名 tie-break）`--apply` 自动改写；**residual**（前缀/fuzzy/未命中/链式三元/未追源变量）带 top-K 候选交 LLM 选，**不自动 apply**——LLM 只看短名单复核，不必扫整本 66KB catalog（候选都不对再查 catalog）；UNMATCHED 不再落占位而是带候选交 LLM。iconSize：源 `size` 原样透传（icon+ 静态 import 支持 rem/px/数字，不转换；仅方案A shim 的 getIcon API 转数字）。 **方案 A/B/C 的选择只由图标名决定**：size/color/variant 是独立 props（透传或 shim 内部处理），不影响方案选择——尺寸/颜色异常不因此退方案A，名匹配命中即落对应方案。报告写 **OS 临时目录**（不进产物根），`--apply` 仅落 confirmed、结束清理临时报告；**residual 由 LLM 在会话内逐条复核，禁止因 residual 整体放弃方案C**。`--topk N` 控候选数（默认 5）。**无网络依赖、彻底离线。**

B 与 C 仅名匹配方式不同，命中后用法一致：`import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import，把 `<Icon name="search" />` 替换为 `<IconPlusIcPublicSearch ... />`。组件名合成 = `"IconPlusIc" + Domain + Name`；无 `color` 时 `iconColor={['currentcolor']}`；`size`→`iconSize`（支持rem、px、数字）。C 的 confirmed = SEMANTIC + L1/L2/L4 命中（含多桶同名，按最短完整名 tie-break）；其余（L3 前缀、L5-L7 fuzzy、UNMATCHED、链式三元、未追源变量）一律 residual 带 top-K 候选交 LLM，**UNMATCHED 不再直接落占位**。**数据数组动态名 `name={t.icon}` / `name={MENU[0].icon}`**：Phase B 绑定同文件/跨文件静态数组字面量，`--apply` 整组改写——`icon: "lit"` → `icon: <IconPlusIc…/>`（命中用真实组件，未命中用占位 `IconPlusIcPublicTransverseRectangleTemplate` 顶替并带候选进 residual）、render `<Icon name={t.icon}/>` → `{t.icon}`；绑不到静态数组源（接口/props 真运行时）才退方案 A。**`.js`→`.jsx` / `.ts`→`.tsx`**：`--apply` 把因改写引入 JSX（替换串含 `<IconPlusIc`）的 `.js`/`.ts` 文件自动转扩展名，并扫 `src/` 修引用方显式 `.js`/`.ts` 扩展名 import（无扩展名 import 不动）；非 `src/` 引用（vite.config、index.html）不处理。

> **`{}` 上下文规则（缺陷一/二教训）**：剥离 `<Icon name={X}/>` 包装时，改写结果 `X`（如 `cond ? <A/> : <B/>`、`group.icon`）**仅当原处 JSX 子节点位才包 `{X}`**；三元分支/对象值/数组元素/prop 容器/箭头体/return 等表达式位一律裸 `X`，否则 `{}` 被解析为对象字面量/块语句而语法报错。脚本 `--apply`（三元 + 数据数组 render）已按 `wrapIfNeeded` 遵守；LLM residual 手改链式三元、prop 驱动调用方同步更新等场景务必同此规则。详见 [Icon.md](components/Icon.md)「`<Icon name={X}/>` 改写的 `{}` 上下文规则」表。

| 组件 | 源项目用法 | 迁移后（B/C 静态 import） |
|------|-----------|------------------|
| Icon | `<Icon name="search" size={14} />`（`./assets/shared/icon.jsx`） | `import { IconPlusIcPublicSearch } from '@nce/icon-plus'` + `<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} />`（名由 B 在线 / C catalog 匹配；C 的 confirmed 自动落、residual 交 LLM 从候选选） |
| Chart | `<Chart name="BarChart" option={...} />`（`../../../assets/shared/chart.jsx`） | `import Chart from '@nce/eview-react/Chart'`（任意位置，包导入；**option 必须显式补 `a2ui: true` + `theme`（暗色派生 `hdesign-dark`/`hdesign-light`），见 [Chart.md](components/Chart.md)**） |

> **方案 A（B/C 兜底，仅留真运行时数据）**：经脚本常量传播 + Phase B 数组绑定 + LLM 跨组件追源仍无法确定 icon+ 名的调用点（典型：`name={row.iconField}` 类**后端运行时数据**，row 来自接口/props、迁移时值不可预知；或成员表达式绑不到任何已扫文件中的静态数组常量；或数组含非字符串字面量字段、集合不封闭），保留 scaffold `src/shared/Icon` 的 `<Icon name="...">` 契约、调用点零改动，`--apply` 仅修 import 路径（`assets/shared/icon` → `@/shared/Icon`，具名→默认导入）。链式/嵌套三元、未追源标识符 `name={x}` 仍由 LLM 在 residual 阶段静态解析（recipe 见 [Icon.md](components/Icon.md)「动态名」段）；**成员表达式 `name={t.icon}` / `name={MENU[0].icon}` 绑到静态数组字面量（封闭集合）的，由 `--apply` 自动整组改写为 icon+ 元素塞进 data + render `{t.icon}`，不落 A**。见 [components/Icon.md](components/Icon.md) 渲染方式段。跑 `scripts/check-relative-imports.cjs`（§5.1）扫残留 `./assets/shared/...` 旧路径。
> 图表契约（`<Chart name option />`、ResizeObserver 自适应、ref 方法）由 `@nce/eview-react/Chart` 原生提供；**但源 Chart 封装在 `setSimpleOption` 前注入的 `theme` + `a2ui: true` 不会随包导入自动补**——所有图表 option 必须显式携带两项，`theme` 由全局暗色状态派生（`.dark` 切主题靠业务 option 驱动），详见 [components/Chart.md](components/Chart.md)。

### 3.1 A 类（有对应）：改 props

对每个有对应的组件，执行：
1. 改导入路径：`from 'antd'` → `from '@nce/eview-react/<Component>'`（**例外**：包壳组件 Select/TextField → `from '@/shared/<X>'`，见 SKILL.md 硬约束 #1）
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