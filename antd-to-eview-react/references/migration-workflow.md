# 迁移工作流（详细步骤）

> 从 antd 项目迁移到 eview-react 的完整流程。按步骤执行，每步产出明确。

## 步骤 0：评估迁移可行性

### 0.1 读交接文件获取迁移清单

源项目是 `umd-to-antd-vite` 产物，目标工程根必有 `.umd-conversion.json` 交接文件。

**优先路径（`migrationPlan` 非 `null`，上游 `umd-to-antd-vite` 步骤 5 `build-migration-plan.cjs` 已生成 enriched 版）**：直接读 `migrationPlan` 数组作为分类评估清单——每项已含 `antd` / `category`（A/B/C）/ `eview` / **`importPath`**（含 @/shared/ 包壳检测 + SHELL_COMPONENTS 硬编码兜底）/ **`shellComponent`** / **`keyDiffs`**（映射表完整原文，非一行摘要）/ `ref` / `files`。**A 类组件直接用 `keyDiffs` + `importPath` 替换，无需读 `component-mapping.md` 或 `components/<Name>.md`**；仅 B/C 类按 `ref` 指引读对应 reference。**Chart 迁移行已由 `build-migration-plan.cjs` §2c 自动注入**（读 `chartCallSites.callSites` 非空时 push，category A、importPath `@nce/eview-react/Chart`、keyDiffs 含 `a2ui: true`/`theme` 补全提醒）——步骤 2 按 keyDiffs 改 import 路径 + 补 `a2ui`/`theme` 即可，无需手动发现 `<Chart>` 调用点。同时读 `globalRef`（`.umd-conversion.json` 顶层）获取静态拼写异常 + 回调签名速查表，跳过读 `component-mapping.md` 文末速查表。直接跳到 §0.4 用 `migrationPlan` 的 `category` 统计规划步骤 3 替换顺序（§0.2/§0.3 跳过）。

**回退路径（`migrationPlan` 为 `null`，上游未跑步骤 5）**：读 `antdComponents` 字段（keys 即组件名列表）作为迁移清单，同时读 `antdIcons` 获取图标清单，进入 §0.2 手动对照 `component-mapping.md` 分类。文件路径字段仅供参考（搬代码后路径可能变），以组件名为准。

**`antdIcons` 只统计 `@ant-design/icons` 命名导入，不代表有无图标**。ict-coder 产物普遍用**自定义 `<Icon name="...">` 运行时 shim**（`assets/shared/icon.jsx`，源码里的"方案A形式"组件）、不用 `@ant-design/icons`，故 `antdIcons` **恒为 `[]`**——但实际有大量 `<Icon name>` 调用点（复杂页面 31 处、preview3 20+ 处），**正是方案 C/B 要扫描改写的目标**。**判断是否有图标看 `iconCallSites` 字段（上游 `extract-umd.cjs` 预扫）或 `<Icon name` 调用点，不看 `antdIcons`**：
> ```bash
> # iconCallSites 已预扫时直接用；否则 grep 确认
> grep -rl "<Icon\b" <目标工程>/src/
> ```
> `iconCallSites` 非空或 grep 输出非空即有图标站点，**必须走 §3.0 图标步骤**（C 跑 `match-icons.cjs` / B 在线匹配），**禁止因 `antdIcons: []` 跳过 `match-icons.cjs`**。源码 `<Icon name>` shim ≠ 产物方案A，其字面量站点必须转 C/B。
>
> **`shimRetained` 引用必对得上 Icon.md 实有章节；每项附 closed-set 追源结论**：residual 阶段保留方案 A 的每处站点须在 `.icon-shim-justified.json` 写 `{ file, line, expr, source, closedSet, reason }`——`closedSet:true`（闭合）不该留（应转 icon+）；`closedSet:false` 须 reason 含具体 OPEN 证据（后端接口/运行时自由取值/props 字段且源不在已扫文件）。**禁止编造不存在的 Icon.md 章节引用**当保留依据（实测回归：LLM 可能臆造诸如「函数参数传入的 icon prop（跨组件边界）」「OBJ[runtimeKey] 计算属性访问」之类 Icon.md 根本没有的章节名——一切引用须以 Icon.md 实有标题为准）。`scripts/check-icon-shim.cjs --strict` 自动拦（见 §4）。

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

> scenario A/B 的 IntlProvider 已由上游 `umd-to-antd-vite` 步骤 3 在 `main.jsx` 正确放置，本节主要针对 scenario C（迁 react-intl）接线时。**高频踩坑点。** IntlProvider 必须在 `main.jsx` 最外层直接包 `<App/>`（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；locale 用 `"zh"` 不是 `"zh-CN"`。完整代码（含 `Root` 包一层读 lang、合并 `componentsLocales` + 业务文案、反例对照）见 [i18n-migration.md](i18n-migration.md) §4。

```jsx
// main.jsx 结构（详见 i18n-migration.md §4.1）
<AppProvider>
    <Root />           {/* Root 里读 lang → IntlProvider → App */}
</AppProvider>
```

## 步骤 2：逐组件替换

> 按组件映射总表替换。

### 3.0 图标（方案 B/C 名匹配 + 静态 import）/ 图表（包导入）

> **图标步骤触发条件 = `src/` 下存在 `<Icon name` 调用点（`grep -rl "<Icon\b" src/` 非空）或 `@ant-design/icons` 用法，与 `.umd-conversion.json` 的 `antdIcons` 是否为空无关**。源项目的 `<Icon name="...">` 运行时 shim（`assets/shared/icon.jsx`）是源码里的"方案A形式"组件，但**不等于产物方案A**：其 `<Icon name="字面量">` 调用点、以及**成员表达式 `name={t.icon}` / `name={MENU[0].icon}`（绑到同文件/跨文件静态数组）**都是方案 C/B 的**主要目标**，必须跑 `match-icons.cjs`（C）或在线匹配（B）转为 `import { IconPlusIcXxx } from '@hui/icon-plus'` 静态 import；只有真动态名（`name={row.iconField}` 类运行时数据，绑不到任何已扫文件中的静态数组常量）才落产物方案A shim。**`antdIcons: []` 时只要 src/ 有 `<Icon name` 站点就必跑图标步骤，禁止跳过**（ict-coder 产物 `antdIcons` 恒 `[]` 但有大量 `<Icon name>` 站点——见 §0.1 警告）。
>
> **已落方案A的产物可原地补救**：若产物调用点仍为 `<Icon name="字面量" .../>` 或 `name={t.icon}`（前次迁移漏跑图标步骤），直接 `node scripts/match-icons.cjs <工程根> --apply` 即可把字面量站点 + 数据数组动态名站点转为 C/B（脚本幂等：已含 `IconPlusIc` 的站点自动跳过）。`--apply` 还会自动把因改写引入 JSX 的 `.js`→`.jsx` / `.ts`→`.tsx` 并修引用方显式扩展名 import。

**项目级先选 B 还是 C**：迁移开始先探测 `https://octo.hdesign.huawei.com/` 可达性（如 `curl -sI https://octo.hdesign.huawei.com/` / WebFetch），全项目统一一种：
- **可达（内网）→ 方案 B**：LLM 调在线 `getIconInfo?keyword=<名>&topK=2&source_id=6` 接口匹配图标名 → `import { IconPlusIcXxx } from '@hui/icon-plus'` 静态 import。
- **不可达（外网）→ 方案 C**：**跑 `node scripts/match-icons.cjs <目标工程根> --apply`**（`--apply` 是转换步骤、**不是可选**；scan-only 无 `--apply` 只出报告不转换、仅复核用，不作为转换手段）。`--apply` 扫 `src/` 下 `<Icon name="..." />`/`<Icon name={...}/>`（含常量传播、三元、变量分流）+ `@ant-design/icons` 调用点，按 [match-icons.cjs](../scripts/match-icons.cjs) `matchOne` 离线匹配 `icons/icon-plus-names.json`（顶层 key 是按图标名前置词分桶、**非语义领域**；候选打分用 token 重叠+子串，不按桶优先），**auto-转**：confirmed 字面量 + **闭集动态形态**（对象地图 `cat = OBJ[key]; cat.icon` / 数组 `name={t.icon}` / 扁平+链式三元 / wrapper `icon` prop / `@ant-design/icons`）→ `<IconPlusIc…/>` 静态 import + `.js`→`.jsx` 自动；未命中的用占位 `IconPlusIcPublicTransverseRectangleTemplate` 顶替并带候选进 residual。**residual**（未命中名带 top-K 候选 + untraced 跨边界 props/useMemo/推入函数闭合集）**不 auto-apply**——交 LLM 按 [Icon.md](components/Icon.md) §name 解析 统一原则处理（未命中名从候选选 / 跨边界追源转 / 真 OPEN 保 shim），再跑 `scripts/check-icon-shim.cjs --strict`（§4）拦闭集误留与未判站点。报告写 **OS 临时目录**（不进产物根）、`--apply` 结束清理。iconSize：源 `size` 原样透传（icon+ 静态 import 支持 rem/px/数字，不转换；仅方案A shim 的 getIcon API 转数字）。 **方案 A/B/C 的选择只由图标名决定**：size/color/variant 是独立 props（透传或 shim 内部处理），不影响方案选择——尺寸/颜色异常不因此退方案A，名匹配命中即落对应方案。`--topk N` 控候选数（默认 5）。**无网络依赖、彻底离线；禁止因 residual 整体放弃方案C**——residual 由 LLM 在会话内按控制台/临时报告逐条复核。

B 与 C 仅名匹配方式不同，命中后用法一致：`import { IconPlusIcXxx } from '@hui/icon-plus'` 静态 import，把 `<Icon name="search" />` 替换为 `<IconPlusIcPublicSearch ... />`。组件名合成 = `"IconPlusIc" + Domain + Name`；无 `color` 时 `iconColor={['currentcolor']}`；`size`→`iconSize`（支持rem、px、数字）。C 的 confirmed = SEMANTIC + L1/L2/L4 命中（含多桶同名，按最短完整名 tie-break）；其余（L3 前缀、L5-L7 fuzzy、UNMATCHED、链式三元、未追源变量）一律 residual 带 top-K 候选交 LLM，**UNMATCHED 不再直接落占位**。**数据数组动态名 `name={t.icon}` / `name={MENU[0].icon}`**：Phase B 绑定同文件/跨文件静态数组字面量，`--apply` 整组改写——`icon: "lit"` → `icon: <IconPlusIc…/>`（命中用真实组件，未命中用占位 `IconPlusIcPublicTransverseRectangleTemplate` 顶替并带候选进 residual）、render `<Icon name={t.icon}/>` → `{t.icon}`；绑不到静态数组源（接口/props 真运行时）才退方案 A。**图标-prop wrapper 组件**（SoftTag/ToggleRow：自定义组件接收 `icon` prop、内部 `<Icon name={icon}/>` 渲染）：Phase C 自动改写——调用点 `icon="lit"`/`icon={常量}`/`icon={扁平三元}` → `icon={<IconPlusIc…/>}`（尺寸取自 wrapper 内部 `<Icon/>`），`icon={IDENT.field}` 成员调用方透传 + 数据数组元素化，wrapper 内部 `<Icon name={icon}/>` → `{icon}`/裸；调用方 `icon={expr}` 不可静态解析（链式三元/未追源变量）→ 安全闸整组退方案 A。**`.js`→`.jsx` / `.ts`→`.tsx`**：`--apply` 把因改写引入 JSX（替换串含 `<IconPlusIc`）的 `.js`/`.ts` 文件自动转扩展名，并扫 `src/` 修引用方显式 `.js`/`.ts` 扩展名 import（无扩展名 import 不动）；非 `src/` 引用（vite.config、index.html）不处理。

> **`{}` 上下文规则（缺陷一/二教训）**：剥离 `<Icon name={X}/>` 包装时，改写结果 `X`（如 `cond ? <A/> : <B/>`、`group.icon`）**仅当原处 JSX 子节点位才包 `{X}`**；三元分支/对象值/数组元素/prop 容器/箭头体/return 等表达式位一律裸 `X`，否则 `{}` 被解析为对象字面量/块语句而语法报错。脚本 `--apply`（三元 + 数据数组 render + 图标-prop wrapper 内部）已按 `wrapIfNeeded` 遵守；LLM residual 手改链式三元、prop 驱动调用方同步更新、wrapper 安全闸 residual 等场景务必同此规则。详见 [Icon.md](components/Icon.md)「`<Icon name={X}/>` 改写的 `{}` 上下文规则」表 +「图标-prop wrapper 组件」小节。

| 组件 | 源项目用法 | 迁移后（B/C 静态 import） |
|------|-----------|------------------|
| Icon | `<Icon name="search" size={14} />`（`./assets/shared/icon.jsx`） | `import { IconPlusIcPublicSearch } from '@hui/icon-plus'` + `<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} />`（名由 B 在线 / C catalog 匹配；C 的 confirmed 自动落、residual 交 LLM 从候选选） |
| Chart | `<Chart name="BarChart" option={...} />`（`../../../assets/shared/chart.jsx`） | `import Chart from '@nce/eview-react/Chart'`（任意位置，包导入；**Chart 已在 `migrationPlan` 里**——由 `build-migration-plan.cjs` §2c 读 `chartCallSites` 注入，keyDiffs 含 `a2ui`/`theme` 补全提醒；**option 必须显式补 `a2ui: true` + `theme`（暗色派生 `hdesign-dark`/`hdesign-light`），见 [Chart.md](components/Chart.md)**） |

> **方案 A（B/C 兜底，仅留真运行时数据）**：经脚本常量传播 + Phase B 数组绑定 + LLM 跨组件追源仍无法确定 icon+ 名的调用点（典型：`name={row.iconField}` 类**后端运行时数据**，row 来自接口/props、迁移时值不可预知；或成员表达式绑不到任何已扫文件中的静态数组常量；或数组含非字符串字面量字段、集合不封闭），保留 scaffold `src/shared/Icon` 的 `<Icon name="...">` 契约、调用点零改动，`--apply` 仅修 import 路径（`assets/shared/icon` → `@/shared/Icon`，具名→默认导入）。链式/嵌套三元、未追源标识符 `name={x}` 仍由 LLM 在 residual 阶段静态解析（recipe 见 [Icon.md](components/Icon.md)「动态名」段）；**成员表达式 `name={t.icon}` / `name={MENU[0].icon}` 绑到静态数组字面量（封闭集合）的，由 `--apply` 自动整组改写为 icon+ 元素塞进 data + render `{t.icon}`，不落 A**。见 [components/Icon.md](components/Icon.md) 渲染方式段。跑 `scripts/check-relative-imports.cjs`（§5.1）扫残留 `./assets/shared/...` 旧路径。
>
> **icon 转换契约（详见 [Icon.md](components/Icon.md) §name 解析与方案A 判定）**：**方案A（`src/shared/Icon` shim）仅当 name 值集合 OPEN（后端自由取值 / prop 源不在已扫文件）；其余闭合集（字面量/常量/三元各分支/数据结构字段/wrapper）一律转 icon+。** 转换法唯一：枚举闭集叶子 → 源处 `"lit"` 改 `<IconPlusIc…/>` → render `{EXPR}`。`match-icons.cjs --apply`（C）统一解析器 auto-转脚本能静态到达的闭合形态（字面量/常量/扁平+链式三元/数组/对象地图/wrapper/`@ant-design/icons`）；**追不到源的（含跨边界 props/useMemo/推入函数闭合集——纯正则追不动跨组件数据流）报 `untracedSites`：不断言方案A、keep 残留 `<Icon>` shim 可运行+修 import，交 LLM 按 §name 解析 统一原则判（闭合→转 / 真 OPEN→保 shim）**。`scripts/check-icon-shim.cjs --strict`（§4）拦闭集误留与未判站点。B 下 LLM 全手工按同一契约 + recipe 转。
> 图表契约（`<Chart name option />`、ResizeObserver 自适应、ref 方法）由 `@nce/eview-react/Chart` 原生提供；**但源 Chart 封装在 `setSimpleOption` 前注入的 `theme` + `a2ui: true` 不会随包导入自动补**——所有图表 option 必须显式携带两项，`theme` 由全局暗色状态派生（`.dark` 切主题靠业务 option 驱动），详见 [components/Chart.md](components/Chart.md)。

### 3.1 A 类（有对应）：改 props

对每个有对应的组件，执行：
1. 改导入路径：用 `migrationPlan` 的 `importPath` 字段（已含 @/shared/ 包壳检测 + SHELL_COMPONENTS 硬编码兜底 IPInput/TimePicker 等，无需手动判断；`shellComponent=true` 的从 `@/shared/<X>` 导入）
2. 改属性名：用 `migrationPlan` 的 `keyDiffs`（映射表完整原文）逐项替换；拼写异常查 `globalRef.spellingAnomalies`，回调签名查 `globalRef.callbackSignatures`——**无需读 `component-mapping.md`**
3. 改回调签名：首参从 event 改为 value（`globalRef.callbackSignatures` 有每组件签名）
4. 改数据格式：`options` 的 `label`→`text`，`items`→`data` 等（`keyDiffs` 已列）
5. **仅当 `keyDiffs` 不够详细时**（复杂组件如 Table/DatePicker），按 `ref` 读 `components/<Name>.md` 查完整 API

### 3.2 B 类（无对应）：手写补位

1. 读 [handwrite-templates.md](handwrite-templates.md) 取对应模板
2. 按模板实现，样式用源项目的 CSS 变量（原始 token）
3. 加 `// TODO(eview-react)` 注释
4. 在最终回复中列出所有手写补位

> **先查 `antdComponents`**：若 Layout/Space/Card/Skeleton 等不在 `antdComponents` 中（上游已改写为 H5：`<div>` + CSS 变量），保留已有结构、不套 handwrite 模板；仅 `antdComponents` 中仍有的组件才手写补位。

### 3.3 C 类（模式转换）

**Steps**：`current`→`currentStep`（对应 `data[].value` 不是下标）；`items`→`data=[{text,value}]`；`onClick(index)` 只允许回跳；**antd dot（圆点）形态迁移用 `size="mini"`**（eview-react Steps 无 `type="dot"` prop）；导入 `@nce/eview-react/Steps`（非包壳）。见 [components/Steps.md](components/Steps.md)。

**Modal / Modal.confirm**：`open`→`isOpen`；`footer`→`buttons=[{text,status,onClick}]`；`onClose` 不自动关闭（需 `setIsOpen(false)`）；`Modal.confirm()`→`MessageDialog type="confirm"`。见 [components/Dialog.md](components/Dialog.md) / [components/MessageDialog.md](components/MessageDialog.md)。

### 3.4 替换顺序与执行

按以下顺序替换（叶子先、容器后、布局最后），每次只读当前需要的 reference：

1. **叶子组件**（Button / TextField / Select 等）—— 改动小、验证快
2. **容器组件**（Dialog / Table）—— 模式变化大
3. **布局组件**（Layout / Menu / Breadcrumb）—— 影响全局

**每个组件替换时读**：
- A 类：`migrationPlan.keyDiffs` + `importPath` + `globalRef`（拼写/回调速查）——**通常无需额外读文件**；仅 Table/DatePicker 等复杂组件按 `ref` 读 `components/<Name>.md`
- B 类：按 `ref` 读 [handwrite-templates.md](handwrite-templates.md) 对应 §章节
- C 类：按 `ref` 读 [components/Steps.md](components/Steps.md) / [components/Dialog.md](components/Dialog.md) / [components/MessageDialog.md](components/MessageDialog.md)

> **Table 操作列间距**：操作列 `render` 中多个按钮不要用 `<>...</>` Fragment 包裹（无间距），改用 `<div style={{ display: 'flex', gap: '12px' }}>`。源项目用 antd `<Space>` 的，迁移后统一按此模式处理。
>
> **Table 排序项**：eview-react 的 `allowSort` 默认 `true`（所有列表头带排序箭头），antd 的 `sorter` 默认无。**迁移时必须逐列比对**：源列有 `sorter` 的保留排序，无 `sorter` 的显式加 `allowSort: false`。操作列、状态列等固定无排序。见 [Table.md](components/Table.md) 列定义形状。
>
> **Table 冻结列**：eview 的 `freezeCol` **无条件冻结**（sticky+阴影），antd 的 `fixed` 仅表格横向溢出（`scroll.x` 生效）时才有视觉效果——源列写了 `fixed` ≠ 源页面视觉冻结。迁移**默认不写** `freezeCol`/`freezeColPosition`；仅源列有 `fixed` 且源表 `scroll.x`/列宽合计明显超出容器宽（真的会横向滚动）时才映射。见 [Table.md](components/Table.md) §5 冻结列行。
>
> **Table 斑马纹**：eview-react 的 `enableZebraCrossing` **默认 `true`**（开斑马纹），antd Table **默认无斑马纹**（需用 `rowClassName` 注入偶数行类 + 自定义 CSS、或 ConfigProvider `theme.token` 配 stripe 才开）。**迁移时必须显式判定源 antd Table 是否开了斑马纹**：源未开（无 `rowClassName` 偶数行逻辑、无对应 CSS、无 theme stripe 配置）的，eview-react 表上显式加 `enableZebraCrossing={false}`，否则迁移后表格凭空多出斑马纹——与原页面视觉不一致。判定方法：搜源 `rowClassName` 是否输出 `even`/`odd`/`striped` 等类名、源 CSS 是否有 `.ant-table-row-even`/`.ant-table-row-odd` 背景、源 ConfigProvider `theme.token` 是否配 stripe。见 [Table.md](components/Table.md) §5 API 速查 `enableZebraCrossing` 行。
>
> **Table 外层宽度**：eview-react 的 Table **默认给最外层 dom 加行内样式 `width:100%;height:100%;`**，在 flex 容器、Grid 布局、卡片内嵌等场景下会撑破父容器、占满高度挤压兄弟元素。**迁移时显式加 `width="unset"` 重置组件库默认行内宽度**——但要先看源 antd Table 有无 width 相关设置：源有显式容器宽度（`style={{ width: ... }}` / className + CSS 设宽）→ 映射到 eview-react `width` prop；`scroll={{ x: ... }}` **直接抛弃不转**（eview `width` 是最外层 dom 宽度，不是 antd 列宽计算/横向滚动阈值概念，实测映射会导致表格宽度错误）；源无显式容器宽度 → 加 `width="unset"`。判定方法：搜源 `<Table` 是否带 `style` 含 `width`、`className` 对应 CSS 是否设宽度。见 [Table.md](components/Table.md) §5 API 速查 `width` 行。
>
> **Table columns 更新**：eview-react 的 `enableColumnCompareUpdate` **默认 `false`**，更新 `columns` prop 时不会重新渲染列定义（diff 比较被关掉，columns 变化不生效）。源 antd 的 `columns` 经常动态变化（条件列、权限列、筛选后列集、`useMemo` 依赖变化重建 columns）。**迁移时默认显式加 `enableColumnCompareUpdate={true}`**，否则源项目里 columns 变化的逻辑全部失效。见 [Table.md](components/Table.md) §5 API 速查 `enableColumnCompareUpdate` 行。

**硬约束**：遵守 SKILL.md 的"eview-react 硬约束"章节（12 条）。导入路径改为 `import X from '@nce/eview-react/X'`。

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

### 4.3 导入路径硬约束检查（必跑）

> 对应 SKILL.md 硬约束① 导入路径。导入路径 100% 静态可判、无歧义，故本检查全量硬 FAIL——任何违规必须修复后重跑，不能跳过。改 import 路径是迁移的核心动作，本脚本是防止「包壳组件从错路径导入 / RadioGroup 套错包 / 残留 antd」的机器兜底。

脚本 `scripts/check-imports.cjs`，纯静态正则，自动跳过 `src/shared/`（包壳实现文件内部转发 `@nce/eview-react/<X>` 是正确的，只有业务代码从该路径导入才算违规）。检查五类违规：残留 `from 'antd'`/`from 'antd/...'`、残留 `@ant-design/icons`、`import { RadioGroup } from '@nce/eview-react/Radio'`（须默认导入自 `@nce/eview-react/RadioGroup`）、包壳组件从 `@nce/eview-react/<X>` 导入（须从 `@/shared/<X>`）。

```bash
node <skill目录>/scripts/check-imports.cjs <目标工程根>
```

发现违规 → exit 1，逐条列文件:行号 + 违规类型 + 修复指引。修复后重跑直至 exit 0。

### 4.4 图表 option 检查（必跑）

> 对应 SKILL.md 硬约束⑪ + [Chart.md](components/Chart.md)「图表 option 缺 a2ui:true 与 theme 标识」。源 Chart 封装在 `setSimpleOption` 前注入的 `theme` + `a2ui: true` 不会随包导入自动补——漏写则图表 a2ui 视觉规范失效、暗色不跟随。这是改 import 路径时最容易忘的项。

脚本 `scripts/check-chart-options.cjs`，检查两类问题：① 残留 `setSimpleOption(`（源 Chart 封装未替换为 `@nce/eview-react/Chart` 包导入）→ 硬 FAIL；② 每个 `<Chart option={X}>` 的 X 是否含 `a2ui: true` 与 `theme`——支持内联对象、变量定义（追同文件 `const X={...}`/`useMemo`）、`...chartBase` 聚合展开三种写法，追不到的外部变量标 advisory。

```bash
node <skill目录>/scripts/check-chart-options.cjs <目标工程根>
```

有硬 FAIL → exit 1；纯 advisory（option 是外部变量）→ exit 0 但报告需人工确认。推荐 `const chartBase = { a2ui: true, theme: ... }` 聚合后展开进各 option（见 [components/Chart.md](components/Chart.md)）。

### 4.5 Table 默认值反向坑检查（advisory 必跑）

> 对应 [Table.md](components/Table.md) §4/§5「Table 排序项/斑马纹/外层宽度/columns 更新」四连——eview-react 的 Table 多个默认值与 antd **相反**，迁移时最易忘、最常错。脚本无法访问源 antd 项目，故全 advisory：列出每个 `<Table>` 缺哪几项标记，**强制迁移方逐条对照源 antd 回应**（决策写入 `.migration-result.json` 的 `tableDefaultReviews`）。这一步把「靠 AI 记住」的约束变成「AI 必须逐条回应」。

脚本 `scripts/check-table-defaults.cjs`，对每个 `<Table>` 标六项：① `enableZebraCrossing`（eview 默认 true 开斑马纹 vs antd 默认无）、② `allowSort`（列级属性，eview 默认 true 全列带排序箭头 vs antd 默认无，检查 columns 数组每列是否标 allowSort）、③ `enableColumnCompareUpdate`（eview 默认 false，columns 动态失效）、④ `width`（eview 默认行内 100%/100% 撑破布局）、⑤ `freezeCol`（eview 无条件冻结，含则需确认源真会横向滚动）、⑥ **`columnsAllWidth`（列级，columns 所有列都带 width 会导致 eview-react Table 显示异常——应至少有一列不设 width 让其自适应剩余空间；脚本解析 columns 数组逐列检查 width，全列带 width 则报）**。

```bash
node <skill目录>/scripts/check-table-defaults.cjs <目标工程根>
```

advisory 模式 exit 0，但每个待核 `<Table>` 必须在 `.migration-result.json` 的 `tableDefaultReviews` 写明决策（如 `"源无 sorter，已加 allowSort:false"` 或 `"columns 6 列全带 width，已删操作列 width 让其自适应"`）。未逐条回应视同 FAIL。

### 4.6 IntlProvider 位置 + locale 检查（必跑，硬 FAIL）

> 对应 SKILL.md 硬约束③ Provider。IntlProvider 放错位置是高频踩坑点：迁移时容易把 IntlProvider 跟着 AppShell 一起搬到 `app.jsx`/`context.jsx`，导致弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`。

脚本 `scripts/check-provider.cjs`，基于 **scaffold 实际结构**：IntlProvider 应在 `main.jsx` 顶层 `render()` 最外层直接包 `<App/>`。检查四项：① main 文件无 `<IntlProvider>` → FAIL（被搬走）；② 非 main 文件含 `<IntlProvider>` → FAIL；③ `locale="zh-CN"` → FAIL（应为 `"zh"`）；④ main 无 `locale="zh"` → advisory（scenario C 变量注入需核对）。扫描前移除注释。

```bash
node <skill目录>/scripts/check-provider.cjs <目标工程根>
```

发现硬 FAIL → exit 1，列文件:行号 + 违规类型。修复后重跑直至 exit 0。

### 4.7 CSS 色值漂移（对照源快照）+ ev_ 类名检查（advisory 必跑）

> 对应 SKILL.md 硬约束⑦。原项目 CSS 有时写死色值是**允许的**（忠实保留即可），但迁移**不能擅自改色值**；类名用业务前缀 `app-` 不用 `ev_`。脚本自动排除 `src/styles/`（token 定义层）和 `src/shared/`（包壳层），只扫业务 CSS。

脚本 `scripts/check-css.cjs`，对照 `.umd-conversion.json` 的 `sourceCssColors` 快照（由 `umd-to-antd-vite` `extract-umd.cjs` 扫源业务 CSS 写死色值生成）按文件 + 出现顺序配对源/产物色值，检查：① **COLOR_DRIFT**——同位置色值不同（迁移擅自改了色值，应改回源值）；② **COLOR_ADDED**——产物有色值、源同位置没有（迁移新增，需确认合理）；③ **COLOR_DROPPED**——源有色值、产物同位置没有（迁移删了，需确认合理）；④ **EV_CLASSNAME**——业务 CSS 用 `.ev_xxx` 类名（自定义违规 vs 覆盖组件库，需核对）。跳过变量定义行（`--xxx:`）和 `var()` 行的 fallback。

```bash
node <skill目录>/scripts/check-css.cjs <目标工程根>
```

advisory 模式 exit 0，但每个待核项必须在 `.migration-result.json` 的 `cssReviews` 写明决策（如 `"test.css:6 COLOR_DRIFT 源#000→产物#f00，已改回源值"` 或 `"ev_checkbox 是覆盖组件库样式，保留"`）。未逐条回应视同 FAIL。**前置依赖**：`.umd-conversion.json` 须含 `sourceCssColors` 字段（由 `extract-umd.cjs` 生成；若产物由旧版生成需重跑 extract-umd 或手动补该字段）。

### 4.8 色值 token 漂移检查（对照源快照，必跑）

> 对应需求：从 antd 向私有组件转换时，手写样式的色值 token 不应修改（不漂移）。`umd-to-antd-vite` 的 `extract-umd.cjs` 步骤 2 已扫描源项目 `assets/style/` 四层 CSS 的 `--xxx: value` 定义，写入 `.umd-conversion.json` 的 `sourceCssTokens` 字段（每层一个 name→value 映射）。本脚本读该快照对照产物，无需访问源项目——解决「对照源项目」的根本边界。

脚本 `scripts/check-token-drift.cjs`，检查四类：
1. **TOKEN_VALUE_DRIFT（硬 FAIL）**：产物 `src/styles/*.css` 的 token 定义值与源快照不一致（如源 `--brand-50: #0067D1`，产物被改成 `#0077E0`）→ exit≠0
2. **TOKEN_MISSING（advisory）**：源有但产物缺失的 token（可能误删）
3. **TOKEN_ADDED（advisory）**：产物新增源没有的 token（scaffold 可能合理新增，需核对）
4. **UNDEFINED_REF（advisory）**：业务 CSS 引用 `var(--xxx)` 但 `xxx` 未在任何 CSS 层定义——自动排除 JSX 内联 `style={{ "--xxx": ... }}` 注入的合法动态 token（如 `--tl-color` 由 `style={{ "--tl-color": t.color }}` 运行时设值）

```bash
node <skill目录>/scripts/check-token-drift.cjs <目标工程根>
```

硬 FAIL exit 1；advisory exit 0 但需在 `.migration-result.json` 的 `tokenDriftReviews` 写明决策。**前置依赖**：`.umd-conversion.json` 须含 `sourceCssTokens` 字段（由 `extract-umd.cjs` 生成；若产物由旧版生成需重跑 extract-umd 或手动补该字段）。

### 4.9 包壳组件 style/className 保留检查（对照源快照，advisory 必跑）

> 对应需求：从 antd 向私有组件转换时，包壳组件要把 antd 原组件身上的 `style` 和 `className` 都带上。AI 做组件替换时容易丢掉原组件的 style/className。`umd-to-antd-vite` 的 `extract-umd.cjs` 已扫描源项目每个 antd 输入/包壳对应组件调用点的 `hasStyle`/`hasClassName`/`styleSource`/`classNameValue`，写入 `.umd-conversion.json` 的 `inputPropCallSites` 字段。本脚本读快照对照产物。

脚本 `scripts/check-props-preserved.cjs`，对照策略：按文件 + 家族 + 出现顺序配对源/产物调用点（搬代码保持结构，同文件同家族调用点出现顺序稳定；路径规范化去 `src/` 前缀使源根级 app.jsx 与产物 src/app.jsx 可配对）。检查三类：
1. **STYLE_DROPPED（advisory）**：源调用点 hasStyle 但产物对应调用点无 style（可能合理，如 DatePicker 包壳内部已强制 width:100%）
2. **CLASSNAME_DROPPED（advisory）**：源调用点 hasClassName 但产物对应调用点无 className
3. **COUNT_MISMATCH（advisory）**：源/产物同文件同家族调用点数量不等（可能重构，无法精确配对）

```bash
node <skill目录>/scripts/check-props-preserved.cjs <目标工程根>
```

advisory 模式 exit 0，但每个待核项必须在 `.migration-result.json` 的 `propsPreservedReviews` 写明决策（如 `"Spinner L113 style 丢失 → 应补回 style={{width:'100%'}}"` 或 `"DatePicker style 由包壳内部 width:100% 处理，合理丢弃"`）。未逐条回应视同 FAIL。**前置依赖**：`.umd-conversion.json` 须含 `inputPropCallSites` 字段（由 `extract-umd.cjs` 生成）。

### 4.10 Steps labelPlacement 默认值反向坑检查（advisory 必跑）

> 对应 components/Steps.md 规格第 5 行 + API 表——又一个「eview 默认值与 antd 相反」的坑（同 Table 默认值反向坑系列）。antd 默认形态文字在图标右侧 = `labelPlacement="horizontal"`，但 eview-react 默认是 `vertical`（文字在图标下方）。迁移时若不显式设 `labelPlacement="horizontal"`，视觉与 antd 不一致。

脚本 `scripts/check-steps-defaults.cjs`，对每个 `<Steps>` 检查：① 缺 `labelPlacement` → advisory（eview 默认 vertical，antd 默认 horizontal，需对照源确认补 horizontal）；② `labelPlacement="vertical"` → advisory（核对源是否真用竖排）；③ 动态值 → advisory（确认运行时为 horizontal）。

```bash
node <skill目录>/scripts/check-steps-defaults.cjs <目标工程根>
```

advisory 模式 exit 0，但每个待核 `<Steps>` 必须在 `.migration-result.json` 的 `stepsReviews` 写明决策（如 `"源 antd 用默认形态，已补 labelPlacement='horizontal'"` 或 `"源显式 vertical，保留"`）。未逐条回应视同 FAIL。

### 4.11 黑白主题双轨切换检查（必跑，硬 FAIL）

> 对应 SKILL.md 硬约束⑬。源项目是**单轨驱动**（只切 `<html>` 的 `.dark`），产物需要**双轨驱动**：① 切 `<html>` 的 `.dark`（自定义 token 四层跟随）+ ② 切 `<body>` 的 `aui3_1_dark`（eview 组件库暗色覆盖层跟随）+ ③ 入口 import `aui3_1_dark.css`（body 轨切了 class 才有对应样式）。三者配套，少任一轨黑白主题切换即坏。`umd-to-antd-vite` 步骤 3 已完成转换，但步骤 2 替换组件时可能误删/改坏，本检查兜底。

脚本 `scripts/check-dark-mode.cjs`，前置判断产物是否有暗色需求（CSS 有 `.dark` 选择器 或 JS 有 `isDark`/`toggleDark`），有需求才检查三轨完整性：① html 轨 `document.documentElement.classList.toggle("dark", isDark)`；② body 轨 `document.body.classList.toggle("aui3_1_dark", isDark)`；③ CSS import `aui3_1_dark.css`。缺任一轨 → 硬 FAIL。无暗色需求 → PASS 不报。

```bash
node <skill目录>/scripts/check-dark-mode.cjs <目标工程根>
```

硬 FAIL，exit≠0 即 FAIL。无需在 result 写决策（结构完整性检查，非 advisory）。

### 4.12 MessageDialog iconLocation 默认值反向坑检查（advisory 必跑）

> 对应 components/MessageDialog.md §5 API 表 + §2 三处示例——又一个「eview 默认值与 antd 形态相反」的坑（同 Table/Steps 默认值反向坑系列）。eview-react MessageDialog 的 `iconLocation` 默认 `'content'`（图标在内容区），但 demo 统一用 `'title'`（图标在标题区）——这也是 antd `Modal.confirm` 的形态（图标出现在标题旁）。迁移时若不显式设 `iconLocation="title"`，图标位置与 antd 习惯不一致。

脚本 `scripts/check-messagedialog-defaults.cjs`，对每个 `<MessageDialog>` 检查：① 缺 `iconLocation` → advisory（eview 默认 content，antd Modal.confirm 形态 = title，需补 title）；② `iconLocation="content"` → advisory（显式用了 eview 默认值，核对源是否确实要图标在内容区，否则改 title）；③ 动态值 → advisory（确认运行时值为 title）。

```bash
node <skill目录>/scripts/check-messagedialog-defaults.cjs <目标工程根>
```

advisory 模式 exit 0，但每个待核 `<MessageDialog>` 必须在 `.migration-result.json` 的 `messageDialogReviews` 写明决策（如 `"源 antd Modal.confirm 图标在标题区，已补 iconLocation='title'"` 或 `"源确实要图标在内容区，保留 content"`）。未逐条回应视同 FAIL。

### 4.13 常见报错对照

| 报错 | 原因 | 修复 |
|------|------|------|
| `Element type is invalid` | 缺 peer 依赖 | 补装 `@cloudsop/horizon` 等 |
| 组件无样式 | 未引 css 或缺类名 | 引 `aui3_1.css` + `<body>` 加 `class="aui3_1"` |
| 弹层文案是 key | 缺 IntlProvider | 加 `IntlProvider` + `messages` |
| `MISSING_TRANSLATION: Missing message "xxx" for locale "zh"` | IntlProvider 放在 `app.jsx`/AppShell 里，不在 `main.jsx` 最外层 | 把 IntlProvider 搬到 `main.jsx` 最外层直接包 `<App/>`；详见 [i18n-migration.md](i18n-migration.md) §4 |
| `MISSING_TRANSLATION: Missing message "gateway" for locale "zh"`（消息 id 是短代码如 "gateway"/"shanghai"） | Table 列 `render` 用 `t(value, value)` 但 `data.js` 里 value 是短代码、i18n key 带前缀 | 在 render 里补命名空间前缀：`t("deviceType." + value, value)`；详见 §3.5 |
| `undefined is not a function` | ref 还没挂载就调方法 | 检查 `?.` 可选链 + 组件是否已渲染 |

### 4.14 验证

跑验证脚本，把结果写入 `<目标工程根>/.migration-result.json`。

> **十二个脚本均为机器兜底，对抗 AI 在长任务中遗忘 skill 硬约束**。导入路径/图表 option/Provider/token 值漂移/dark-mode 双轨是硬约束，脚本 exit≠0 即 FAIL；i18n-keys/table-defaults/steps-defaults/messagedialog-defaults/css/token/props-preserved advisory 项 exit=0 但需把人工核对结论写进 result 的对应字段，未逐条回应视同 FAIL。

**验证步骤**（全部必跑，按序）：
1. 相对导入检查**跳过**（见 §4.1）
2. 跑 `node <skill目录>/scripts/check-i18n-keys.cjs <目标工程根>`（§4.2，advisory，高危调用记 FAIL）
3. 跑 `node <skill目录>/scripts/check-imports.cjs <目标工程根>`（§4.3，**硬 FAIL**，exit≠0 即 FAIL）
4. 跑 `node <skill目录>/scripts/check-chart-options.cjs <目标工程根>`（§4.4，硬 FAIL + advisory）
5. 跑 `node <skill目录>/scripts/check-table-defaults.cjs <目标工程根>`（§4.5，advisory，逐条回应写入 `tableDefaultReviews`）
6. 跑 `node <skill目录>/scripts/check-provider.cjs <目标工程根>`（§4.6，**硬 FAIL**，exit≠0 即 FAIL）
7. 跑 `node <skill目录>/scripts/check-css.cjs <目标工程根>`（§4.7，advisory，逐条回应写入 `cssReviews`）
8. 跑 `node <skill目录>/scripts/check-token-drift.cjs <目标工程根>`（§4.8，token 值漂移硬 FAIL + advisory 须回应写入 `tokenDriftReviews`）
9. 跑 `node <skill目录>/scripts/check-props-preserved.cjs <目标工程根>`（§4.9，advisory，逐条回应写入 `propsPreservedReviews`）
10. 跑 `node <skill目录>/scripts/check-steps-defaults.cjs <目标工程根>`（§4.10，advisory，逐条回应写入 `stepsReviews`）
11. 跑 `node <skill目录>/scripts/check-dark-mode.cjs <目标工程根>`（§4.11，**硬 FAIL**，exit≠0 即 FAIL）
12. 跑 `node <skill目录>/scripts/check-messagedialog-defaults.cjs <目标工程根>`（§4.12，advisory，逐条回应写入 `messageDialogReviews`）
13. `cd <目标工程根> && npm install`（bash 工具 timeout=30000）；超时/失败（外网无法访问 `@nce` 内网源）记 `SKIP`

**结果文件**：把结果写入 `<目标工程根>/.migration-result.json`（覆盖写），JSON 结构：

```json
{
  "status": "PASS" 或 "FAIL",
  "round": {round},
  "failures": ["失败点 1", ...],
  "checks": {
    "relative-imports": "PASS(skip)",
    "i18n-keys": "PASS/FAIL",
    "imports": "PASS/FAIL",
    "chart-options": "PASS/FAIL/ADVISORY",
    "table-defaults": "PASS/FAIL",
    "provider": "PASS/FAIL",
    "css": "PASS/FAIL",
    "token-drift": "PASS/FAIL",
    "props-preserved": "PASS/FAIL",
    "steps-defaults": "PASS/FAIL",
    "dark-mode": "PASS/FAIL",
    "messagedialog-defaults": "PASS/FAIL",
    "npm-install": "PASS/SKIP"
  },
  "tableDefaultReviews": [
    { "file": "src/views/.../list.jsx", "line": 92, "allowSort": "源无 sorter，已加 allowSort:false", "enableZebraCrossing": "源无斑马纹，已加 false", "enableColumnCompareUpdate": "源 columns 动态，已加 true", "width": "源无显式宽度，已加 width=\"unset\"", "freezeCol": "无", "columnsAllWidth": "6 列全带 width，已删操作列 width 让其自适应" }
  ],
  "cssReviews": [
    { "file": "src/views/.../form.css", "line": 6, "type": "COLOR_DRIFT", "value": "源#000→产物#f00", "decision": "迁移擅自改值，已改回源值 #000" },
    { "file": "src/views/.../form.css", "line": 15, "type": "COLOR_ADDED", "value": "#def", "decision": "迁移新增渐变端色值，合理保留" },
    { "file": "src/views/my-todo/index.css", "line": 90, "type": "EV_CLASSNAME", "value": ".ev_checkbox", "decision": "覆盖组件库样式，保留" }
  ],
  "tokenDriftReviews": [
    { "type": "UNDEFINED_REF", "file": "src/views/.../demo.css", "line": 10, "token": "--my-color", "decision": "改用源项目已定义的 --on-surface" },
    { "type": "TOKEN_ADDED", "file": "src/styles/base.css", "token": "--new-var", "decision": "scaffold 合理新增，保留" }
  ],
  "propsPreservedReviews": [
    { "type": "STYLE_DROPPED", "file": "src/views/.../form.jsx", "line": 113, "family": "Spinner", "sourceStyle": "width: \"100%\"", "decision": "应补回 style={{width:'100%'}}" },
    { "type": "STYLE_DROPPED", "file": "src/views/.../form.jsx", "line": 148, "family": "DatePicker", "sourceStyle": "width: \"100%\"", "decision": "DatePicker 包壳内部已强制 width:100%，合理丢弃" }
  ],
  "stepsReviews": [
    { "file": "src/views/.../wizard.jsx", "line": 20, "code": "LABEL_PLACEMENT_MISSING", "decision": "源 antd 用默认形态，已补 labelPlacement='horizontal'" }
  ],
  "messageDialogReviews": [
    { "file": "src/views/.../list.jsx", "line": 45, "code": "ICON_LOCATION_MISSING", "decision": "源 antd Modal.confirm 图标在标题区，已补 iconLocation='title'" }
  ],
  "notes": "可选说明"
}
```

- 所有验收项全过 → status="PASS"，failures=[]
- 任一不过（SKIP 不算不过）→ status="FAIL"，failures 逐条写清具体失败点
- npm-install=SKIP 不影响整体 status（notes 写明外网环境降级，仅静态检查生效）
- `table-defaults` advisory：脚本 exit=0 但有待核项时，**每个待核 `<Table>` 必须在 `tableDefaultReviews` 写明决策**；未逐条回应 → FAIL
- `steps-defaults` advisory：脚本 exit=0 但有待核项时，**每个待核 `<Steps>` 必须在 `stepsReviews` 写明决策**；未逐条回应 → FAIL
- `messagedialog-defaults` advisory：脚本 exit=0 但有待核项时，**每个待核 `<MessageDialog>` 必须在 `messageDialogReviews` 写明决策**；未逐条回应 → FAIL
- `css` advisory：脚本 exit=0 但有待核项时，**每个待核项必须在 `cssReviews` 写明决策**；未逐条回应 → FAIL
- `token-drift` advisory（TOKEN_MISSING/TOKEN_ADDED/UNDEFINED_REF）：脚本 exit=0 但有待核项时，**每个待核项必须在 `tokenDriftReviews` 写明决策**；未逐条回应 → FAIL
- `props-preserved` advisory（STYLE_DROPPED/CLASSNAME_DROPPED/COUNT_MISMATCH）：脚本 exit=0 但有待核项时，**每个待核项必须在 `propsPreservedReviews` 写明决策**（合理丢弃如 DatePicker 包壳已处理宽度，否则应补回）；未逐条回应 → FAIL
- `chart-options` 纯 advisory（option 是外部变量追不到）不计 FAIL，但需在 notes 说明已人工确认
- `provider` advisory（locale 用变量注入）不计 FAIL，但需在 notes 说明已人工确认值为 "zh"

**循环上限**：默认 5 轮（round 1 首次验证，round 2~5 修复后重测）。验证 FAIL 时主 agent 直接读 `.migration-result.json` 的 `failures` 字段，回到步骤 2 自己修复，再重新验证（round + 1）。第 5 轮仍 FAIL 必须停止，向用户报告失败项 + 建议人工介入。