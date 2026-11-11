# 迁移工作流（详细步骤）

> 从 antd 项目迁移到 eview-react 的完整流程。按步骤执行，每步产出明确。

## 步骤 0：评估迁移可行性

### 0.1 读交接文件获取迁移清单

源项目是 `umd-to-antd-vite` 产物，目标工程根必有 `.umd-conversion.json` 交接文件。

**优先路径（`migrationPlan` 非 `null`，上游 `umd-to-antd-vite` 步骤 5 `build-migration-plan.cjs` 已生成 enriched 版）**：直接读 `migrationPlan` 数组作为分类评估清单——每项已含 `antd` / `category`（A/B）/ `eview` / **`importPath`**（含 @/shared/ 包壳检测 + SHELL_COMPONENTS 硬编码兜底）/ **`shellComponent`** / **`keyDiffs`**（映射表完整原文，非一行摘要）/ `ref` / `files`。**A 类组件按 `ref` 读 `components/<Name>.md` 查完整 API，结合 `keyDiffs` + `importPath` 替换（`component-mapping.md` 无需读，`keyDiffs` 已含其差异摘要）**；仅 B 类按 `ref` 指引读对应 reference。**Chart 迁移行已由 `build-migration-plan.cjs` §2c 自动注入**（读 `chartCallSites.callSites` 非空时 push，category A、importPath `@nce/eview-react/Chart`、keyDiffs 含 `a2ui: true`/`theme` 补全提醒）——步骤 2 按 keyDiffs 改 import 路径 + 补 `a2ui`/`theme` 即可，无需手动发现 `<Chart>` 调用点。同时读 `globalRef`（`.umd-conversion.json` 顶层）获取静态拼写异常 + 回调签名速查表，跳过读 `component-mapping.md` 文末速查表。直接跳到 §0.4 用 `migrationPlan` 的 `category` 统计规划步骤 3 替换顺序（§0.2/§0.3 跳过）。

**回退路径（`migrationPlan` 为 `null`，上游未跑步骤 5）**：读 `antdComponents` 字段（keys 即组件名列表）作为迁移清单，进入 §0.2 手动对照 `component-mapping.md` 分类。文件路径字段仅供参考（搬代码后路径可能变），以组件名为准。**图标发现看 `iconCallSites` 字段或 `grep -rl "<Icon\b" src/`**（见下文 `antdIcons` 陷阱，**不要用 `antdIcons` 字段**——其恒 `[]` 不代表无图标）。

**`antdIcons` 只统计 `@ant-design/icons` 命名导入，不代表有无图标**。ict-coder 产物普遍用**自定义 `<Icon name="...">` 运行时 shim**（`assets/shared/icon.jsx`，源码里的"方案A形式"组件）、不用 `@ant-design/icons`，故 `antdIcons` **恒为 `[]`**——但实际有大量 `<Icon name>` 调用点（复杂页面 31 处、preview3 20+ 处），**正是方案 C/B 要识别改写的目标**（C 跑 `match-icons.cjs` 扫描、B 由 LLM 逐个在线 `getIconInfo` 匹配）。**判断是否有图标看 `iconCallSites` 字段（上游 `extract-umd.cjs` 预扫）或 `<Icon name` 调用点，不看 `antdIcons`**：
> ```bash
> # iconCallSites 已预扫时直接用；否则 grep 确认
> grep -rl "<Icon\b" <目标工程>/src/
> ```
> `iconCallSites` 非空或 grep 输出非空即有图标站点，**必须走 §3.0 图标步骤**（C 跑 `match-icons.cjs` / B 在线 `getIconInfo` 匹配），**禁止因 `antdIcons: []` 跳过图标步骤**（C 下即禁止跳过 `match-icons.cjs`）。源码 `<Icon name>` shim ≠ 产物方案A，其字面量站点必须转 B/C 静态 import。
>
> **`shimRetained` 引用必对得上 Icon.md 实有章节；每项附 closed-set 追源结论**：residual 阶段保留方案 A 的每处站点须在 `.icon-shim-justified.json` 写 `{ file, line, expr, source, closedSet, reason }`——`closedSet:true`（闭合）不该留（应转 icon+）；`closedSet:false` 须 reason 含具体 OPEN 证据（后端接口/运行时自由取值/props 字段且源不在已扫文件）。`closedSet` 语义：`false`=OPEN 放行保 shim；`true`=闭合应转、误留则拦。**禁止编造不存在的 Icon.md 章节引用**当保留依据（实测回归：LLM 臆造「函数参数传入的 icon prop（跨组件边界）」「OBJ[runtimeKey] 计算属性访问」之类 Icon.md 根本没有的章节名——一切引用须以 Icon.md 实有标题为准）。`scripts/check-icon-shim.cjs --strict` 自动拦无结论/`closedSet:true`/幻觉章节/缺 OPEN 证据（图标步骤内跑，见 §3.0 / Icon.md recipe 步 7）。

> 组件清单已由 `umd-to-antd-vite` 生成并写入交接文件，不需要手动 grep 扫描 `src/`。`migrationPlan` 是否非 `null` 决定走优先路径（跳过 §0.2/§0.3）还是回退路径（手动对照大表）。

### 0.2 对照组件映射总表分类（回退路径，优先路径跳过）

> 若 §0.1 走优先路径（`migrationPlan` 已含 `category` 字段），本节跳过。仅回退路径（`migrationPlan` 为 `null`）需手动对照下表。

将交接文件中读取到的组件分为两类：

| 分类 | 含义 | 处理 |
|------|------|------|
| **A. 有对应** | eview-react 有同名或功能等价组件（含 Steps/Modal 等需模式转换的） | 直接替换，改 props；Steps/Modal 等模式转换组件见 §3.3 |
| **B. 无对应需手写** | eview-react 无对应组件 | 用 [handwrite-templates.md](handwrite-templates.md) 模板 |

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
> **已落方案A的产物可原地补救**（仅方案 C）：若产物调用点仍为 `<Icon name="字面量" .../>` 或 `name={t.icon}`（前次迁移漏跑图标步骤），直接 `node scripts/match-icons.cjs <工程根> --apply` 即可把字面量站点 + 数据数组动态名站点转为方案 C 静态 import（脚本幂等：已含 `IconPlusIc` 的站点自动跳过）。**方案 B 项目不跑 `match-icons.cjs --apply`**（catalog 名匹配）；但跑 `--plan` + `--apply-decisions`（结构改写 + 在线名，catalog-free，见 §3.0 B 分支）——B 的名匹配靠在线 `getIconInfo`、非离线 catalog，补救由 LLM 按 [Icon.md](components/Icon.md)「方案 B 在线匹配执行 recipe」两段式处理。`--apply` 还会自动把因改写引入 JSX 的 `.js`→`.jsx` / `.ts`→`.tsx` 并修引用方显式扩展名 import。

**项目级先选 B 还是 C**：迁移开始先探测 `https://octo.hdesign.huawei.com/` 可达性（如 `curl -sI https://octo.hdesign.huawei.com/` / WebFetch），全项目统一一种：
- **可达（内网）→ 方案 B（两段式，catalog-free）**：`node scripts/match-icons.cjs <工程根> --plan` 离线结构规划（产 `icon-leaves.json`，不改文件、不读 catalog）→ LLM 读 leaves 去重唯一名 + 同 turn 并行调 `getIconInfo?keyword=<名>&topK=2&source_id=6` + `icon-b-decisions.json` 缓存（每唯一名只查一次）→ `node scripts/match-icons.cjs <工程根> --apply-decisions --decisions <log>` 用真名做结构改写（无占位；缺名即报错零改写）。详见 [Icon.md](components/Icon.md)「方案 B 在线匹配执行 recipe」。内网接口必返回名，故无占位 `IconPlusIcPublicTransverseRectangleTemplate`、产物零 catalog 名。
- **不可达（外网）→ 方案 C**：**跑 `node scripts/match-icons.cjs <目标工程根> --apply`**（`--apply` 是转换步骤、**不是可选**；scan-only 无 `--apply` 只出报告不转换、仅复核用，不作为转换手段）。`--apply` 扫 `src/` 下 `<Icon name="..." />`/`<Icon name={...}/>`（含常量传播、三元、变量分流）+ `@ant-design/icons` 调用点，按 [match-icons.cjs](../scripts/match-icons.cjs) `matchOne` 离线匹配 `icons/icon-plus-names.json`（顶层 key 是按图标名前置词分桶、**非语义领域**；候选打分用 token 重叠+子串，不按桶优先），**auto-转**：confirmed 字面量 + **闭集动态形态**（对象地图 `cat = OBJ[key]; cat.icon` / 数组 `name={t.icon}` / 扁平三元 / wrapper `icon` prop / `@ant-design/icons`；**链式/嵌套三元与未追源标识符 → residual**）→ `<IconPlusIc…/>` 静态 import + `.js`→`.jsx` 自动；未命中的用占位 `IconPlusIcPublicTransverseRectangleTemplate` 顶替并带候选进 residual。**residual**（未命中名带 top-K 候选 + 链式/嵌套三元 + untraced 跨边界 props/useMemo/推入函数闭合集）**不 auto-apply**——交 LLM 按 [Icon.md](components/Icon.md) §name 解析 统一原则处理（未命中名从候选选 / 跨边界追源转 / 真 OPEN 保 shim），再跑 `scripts/check-icon-shim.cjs --strict`（图标步骤内跑，见 Icon.md recipe 步 7）拦闭集误留与未判站点。报告写 **OS 临时目录**（不进产物根）、`--apply` 结束清理。iconSize：源 `size` 原样透传（icon+ 静态 import 支持 rem/px/数字，不转换；仅方案A shim 的 getIcon API 转数字）。 **方案 A/B/C 的选择只由图标名决定**：size/color/variant 是独立 props（透传或 shim 内部处理），不影响方案选择——尺寸/颜色异常不因此退方案A，名匹配命中即落对应方案。`--topk N` 控候选数（默认 5）。**无网络依赖、彻底离线；禁止因 residual 整体放弃方案C**——residual 由 LLM 在会话内按控制台/临时报告逐条复核。

B 与 C 仅名匹配方式不同，命中后用法一致：`import { IconPlusIcXxx } from '@hui/icon-plus'` 静态 import，把 `<Icon name="search" />` 替换为 `<IconPlusIcPublicSearch ... />`。组件名合成 = `"IconPlusIc" + Domain + Name`；无 `color` 时 `iconColor={['currentcolor']}`；`size`→`iconSize`（支持 rem/px/数字）。C 的 confirmed/residual/UNMATCHED 分级、孤儿名占位、数据数组 Phase B 整组改写、wrapper Phase C 两半改写、`.js`→`.jsx` 自动等机制详见 [Icon.md](components/Icon.md) §name 解析 + §动态名 + §wrapper + 「迁移工作流要点」（本文不重述）。

> **`{}` 上下文规则（缺陷一/二教训）**：剥离 `<Icon name={X}/>` 包装时，改写结果 `X`（如 `cond ? <A/> : <B/>`、`group.icon`）**仅当原处 JSX 子节点位才包 `{X}`**；三元分支/对象值/数组元素/prop 容器/箭头体/return 等表达式位一律裸 `X`，否则 `{}` 被解析为对象字面量/块语句而语法报错。脚本 `--apply`（三元 + 数据数组 render + 图标-prop wrapper 内部）已按 `wrapIfNeeded` 遵守；LLM residual 手改链式三元、prop 驱动调用方同步更新、wrapper 安全闸 residual 等场景务必同此规则。详见 [Icon.md](components/Icon.md)「`<Icon name={X}/>` 改写的 `{}` 上下文规则」表 +「图标-prop wrapper 组件」小节。

> **⚠️ props 保留规则（缺陷三教训，必读）**：闭集自动改写站点（`--apply`/`--apply-decisions`）经 `collectPassthroughProps` 已透传 `<Icon>` 上的非 icon props（不会丢）；**须 LLM 显式搬 props 的场景限于 residual 手改站点 + 剥 antd 纯图标 Button/IconButton 外壳**（props 在父 `<Button>` 上、脚本不碰 Button）——必须把原调用点所有非 icon props 原样搬到新 `<IconPlusIc*>`，否则交互断链。高频受害：主题切换图标漏 `onClick={toggleDark}` → `isDark` 永不翻转、暗色三轨永不触发（`check-dark-mode.cjs` 静态 PASS 拦不住，见 §4.11 盲区）。完整改写清单 + 正反例 + 收尾复核见 [Icon.md](components/Icon.md) §「⚠️ 硬约束：改写 `<Icon>` 调用点必须保留原 DOM/交互 props」；机器兜底 `check-icon-shim.cjs --strict` PROP_DROPPED_ON_ICON_REWRITE 拦手改丢的 handler（见 §3.0 步7 / Icon.md recipe，仅核 HANDLER_PROPS，title/aria/箭头是盲区须人工复核）。阶段3 收尾必须 grep `toggleDark` 确认有实际调用点（详见 §4.11）。
>
> **residual 收尾自净（步 7 之后必跑，B/C 都适用）**：图标步骤 residual 手改（untraced 跨边界追源 / 占位 `IconPlusIcPublicTransverseRectangleTemplate` 替换 / 链式三元）会在 `.js`/`.ts` 数据文件里注入 `<IconPlusIc*>` JSX。`match-icons.cjs` 的 `renameJsxFiles` 只对 `--apply`/`--apply-decisions` **自己改写**的文件改名，**LLM residual 手改的文件不经过它**——且重跑 `--apply` 也救不回（手改后文件无 `<Icon name>` 站点，扫描不进 byFile）。故 residual 收尾后必跑 `node scripts/check-jsx-extension.cjs <工程根> --fix`：AST 扫工程根所有 `.js`/`.ts`（含 `src/` 外 mock），含 `JSXElement`/`JSXFragment` 的自动 `.js→.jsx`/`.ts→.tsx` + 工程级修引用方显式扩展名 import，让 icon 步骤自净（不等步骤 3 闸门兜底）。见 §4.19 + SKILL.md 硬约束 #14。

| 组件 | 源项目用法 | 迁移后（B/C 静态 import） |
|------|-----------|------------------|
| Icon | `<Icon name="search" size={14} />`（`./assets/shared/icon.jsx`） | `import { IconPlusIcPublicSearch } from '@hui/icon-plus'` + `<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} />`（名由 B 在线 / C catalog 匹配；C 的 confirmed 自动落、residual 交 LLM 从候选选） |
| Chart | `<Chart name="BarChart" option={...} />`（`../../../assets/shared/chart.jsx`） | `import Chart from '@nce/eview-react/Chart'`（任意位置，包导入；**Chart 已在 `migrationPlan` 里**——由 `build-migration-plan.cjs` §2c 读 `chartCallSites` 注入，keyDiffs 含 `a2ui`/`theme` 补全提醒；**option 必须显式补 `a2ui: true` + `theme`**：`theme` 必须响应式引用 `useApp().isDark`（`isDark` 来自 `src/context.jsx` 的 AppProvider，上游 `umd-to-antd-vite` 步骤 3 已保留）——`theme: isDark ? 'hdesign-dark' : 'hdesign-light'`，禁止静态字符串（暗色切换图表不跟随）；推荐 `const chartBase = { a2ui: true, theme: isDark ? 'hdesign-dark' : 'hdesign-light' }` 聚合展开，见 [Chart.md](components/Chart.md)**） |

> **方案 A（B/C 兜底，仅留真运行时数据）**：经脚本常量传播 + Phase B 数组绑定 + LLM 跨组件追源仍无法确定 icon+ 名的调用点（典型：`name={row.iconField}` 类**后端运行时数据**，row 来自接口/props、迁移时值不可预知；或成员表达式绑不到任何已扫文件中的静态数组常量；或数组含非字符串字面量字段、集合不封闭），保留 scaffold `src/shared/Icon` 的 `<Icon name="...">` 契约、调用点零改动，`--apply` 仅修 import 路径（`assets/shared/icon` → `@/shared/Icon`，具名→默认导入）。链式/嵌套三元、未追源标识符 `name={x}` 仍由 LLM 在 residual 阶段静态解析（recipe 见 [Icon.md](components/Icon.md)「动态名」段）；**成员表达式 `name={t.icon}` / `name={MENU[0].icon}` 绑到静态数组字面量（封闭集合）的，由 `--apply` 自动整组改写为 icon+ 元素塞进 data + render `{t.icon}`，不落 A**。见 [components/Icon.md](components/Icon.md) 渲染方式段。跑 `scripts/check-relative-imports.cjs`（§5.1）扫残留 `./assets/shared/...` 旧路径。
>
> **icon 转换契约（详见 [Icon.md](components/Icon.md) §name 解析与方案A 判定）**：方案A（`src/shared/Icon` shim）仅当 name 值集合 OPEN（后端自由取值 / prop 源不可追·非闭集）；其余闭合集（字面量/常量/扁平三元/数据结构字段/wrapper）一律转 icon+。C `--apply` auto-转脚本能静态到达的闭合形态（字面量/常量/扁平三元/数组/对象地图/wrapper/`@ant-design/icons`）；**链式/嵌套三元与未追源标识符 → residual 交 LLM**；追不到源的（含跨边界 props/useMemo/推入函数闭合集——纯正则追不动跨组件数据流）报 `untracedSites`（不断言方案A、keep shim 可运行+修 import），交 LLM 判（闭合→转 / 真 OPEN→保 shim）。`check-icon-shim.cjs --strict`（图标步骤内跑，见 Icon.md「方案 B recipe」步 7）拦闭集误留与未判站点 + TERNARY_WRAP_LOST。B 两段式 `--plan`+`--apply-decisions` 按同一契约 + [Icon.md](components/Icon.md) recipe 转，仅跨边界 residual 手工。
> 图表契约（`<Chart name option />`、ResizeObserver 自适应、ref 方法）由 `@nce/eview-react/Chart` 原生提供；**但源 Chart 封装在 `setSimpleOption` 前注入的 `theme` + `a2ui: true` 不会随包导入自动补**——所有图表 option 必须显式携带两项，`theme` 由全局暗色状态派生（`.dark` 切主题靠业务 option 驱动），详见 [components/Chart.md](components/Chart.md)。

### 3.1 A 类（有对应）：改 props

对每个有对应的组件，执行：
1. 改导入路径：用 `migrationPlan` 的 `importPath` 字段（已含 @/shared/ 包壳检测 + SHELL_COMPONENTS 硬编码兜底 IPInput/TimePicker 等，无需手动判断；`shellComponent=true` 的从 `@/shared/<X>` 导入）
2. 改属性名：用 `migrationPlan` 的 `keyDiffs`（映射表完整原文）逐项替换；拼写异常查 `globalRef.spellingAnomalies`，回调签名查 `globalRef.callbackSignatures`——**无需读 `component-mapping.md`**
3. 改回调签名：首参从 event 改为 value（`globalRef.callbackSignatures` 有每组件签名）
4. 改数据格式：`options` 的 `label`→`text`，`items`→`data` 等（`keyDiffs` 已列）
5. 按 `ref` 读 `components/<Name>.md` 查完整 API（`keyDiffs` 是差异摘要，非完整 API；`component-mapping.md` 无需读，其内容已并入 `keyDiffs`）

### 3.2 B 类（无对应）：手写补位

1. 读 [handwrite-templates.md](handwrite-templates.md) 取对应模板
2. 按模板实现，样式用源项目的 CSS 变量（原始 token）
3. 加 `// TODO(eview-react)` 注释
4. 在最终回复中列出所有手写补位

> **先查 `antdComponents`**：若 Layout/Space/Card/Skeleton 等不在 `antdComponents` 中（上游已改写为 H5：`<div>` + CSS 变量），保留已有结构、不套 handwrite 模板；仅 `antdComponents` 中仍有的组件才手写补位。

### 3.3 模式转换组件（Steps/Modal，A 类）

**Steps**：`current`→`currentStep`（对应 `data[].value` 不是下标）；`items`→`data=[{text,value}]`；`onClick(index)` 只允许回跳；**antd dot（圆点）形态迁移用 `size="mini"`**（eview-react Steps 无 `type="dot"` prop）；导入 `@nce/eview-react/Steps`（非包壳）。见 [components/Steps.md](components/Steps.md)。

**Modal / Modal.confirm**：`open`→`isOpen`；`footer`→`buttons=[{text,status,onClick}]`；`onClose` 不自动关闭（需 `setIsOpen(false)`）；`Modal.confirm()`→`MessageDialog type="confirm"`，且**每个 `<MessageDialog>` 必须显式写 `iconLocation="title"`**（eview 默认 content 与 antd 形态相反；源 antd 无 icon prop 也要补，见 §4.12）。见 [components/Dialog.md](components/Dialog.md) / [components/MessageDialog.md](components/MessageDialog.md)。

### 3.4 替换顺序与执行

按以下顺序替换（叶子先、容器后、布局最后），每次只读当前需要的 reference：

1. **叶子组件**（Button / TextField / Select 等）—— 改动小、验证快
2. **容器组件**（Dialog / Table）—— 模式变化大
3. **布局组件**（Layout / Menu / Breadcrumb）—— 影响全局

**每个组件替换时读**：
- A 类：`migrationPlan.keyDiffs` + `importPath` + `globalRef`（拼写/回调速查）+ 按 `ref` 读 `components/<Name>.md` 查完整 API（`keyDiffs` 是差异摘要，非完整 API）；Steps/Modal 等模式转换组件另按 §3.3 处理
- B 类：按 `ref` 读 [handwrite-templates.md](handwrite-templates.md) 对应 §章节

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
>
> **Table 列宽去除**：eview-react Table **全列设 `columns[].width` 会显示异常**（至少一列不设 `width` 自适应剩余空间）。源 antd 表有 `scroll`（每列定宽）或全列定宽时，迁移时去掉**非冻结列**的 `columns[].width`；冻结列（`freezeCol: true`）保留 `width`。判定方法：搜源 `<Table` 是否带 `scroll`、源 columns 是否每列都设 `width`。**机器验证**：步骤 3 `check-table-defaults.cjs` 的 `columnsAllWidth` 项**硬 FAIL**（AST 扫 columns 顶层列对象，全列带 width 即拦，不依赖源项目；①-⑤ 仍 advisory）。见 [Table.md](components/Table.md) §4 列宽行。

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

脚本 `scripts/check-imports.cjs`，纯静态正则，自动跳过 `src/shared/`（包壳实现文件内部转发 `@nce/eview-react/<X>` 是正确的，只有业务代码从该路径导入才算违规）。检查七类违规：残留 `from 'antd'`/`from 'antd/...'`、残留 `@ant-design/icons`、`import { RadioGroup } from '@nce/eview-react/Radio'`（须默认导入自 `@nce/eview-react/RadioGroup`）、包壳组件从 `@nce/eview-react/<X>` 导入（须从 `@/shared/<X>`）、`<Toggle>` 上用 `disable`（应为 `disabled`——Toggle 用 `disabled` 正确拼写，`disable` 只属于 SelectCard/FileUpload）、`<Tab>` 上挂 `data`（禁止——Tab 是 children 驱动 `<TabItem>`，`data` 是 Select/SelectCard/Steps 等的 prop）。

```bash
node <skill目录>/scripts/check-imports.cjs <目标工程根>
```

发现违规 → exit 1，逐条列文件:行号 + 违规类型 + 修复指引。修复后重跑直至 exit 0。

### 4.4 图表 option 检查（必跑）

> 对应 SKILL.md 硬约束⑪ + [Chart.md](components/Chart.md)「图表 option 缺 a2ui:true 与 theme 标识」。源 Chart 套壳（ict-coder `assets/shared/chart.jsx`）自动 watch `<html>.dark` + 在 `setSimpleOption` 前注入 `theme` + `a2ui: true` + 暗色切换自动 re-render；改 `@nce/eview-react/Chart` 包导入后自动行为整体丢失——漏写则 a2ui 视觉规范失效、暗色不跟随。这是改 import 路径时最容易忘的项。

脚本 `scripts/check-chart-options.cjs`，检查三类问题：① 残留 `setSimpleOption(`（源 Chart 封装未替换为 `@nce/eview-react/Chart` 包导入）→ 硬 FAIL；② 每个 `<Chart option={X}>` 的 X 是否含 `a2ui: true` 与 `theme`——支持内联对象、变量定义（追同文件 `const X={...}`/`useMemo`）、`...chartBase` 聚合展开三种写法，追不到的外部变量标 advisory；③ **STATIC_THEME**：`theme` 值是静态字符串字面量（如 `'hdesign-light'`，非 `isDark` 动态派生）→ advisory（暗色切换时图表主题不跟随，应改 `theme: isDark ? 'hdesign-dark' : 'hdesign-light'`，`isDark` 来自 `useApp()`）。

```bash
node <skill目录>/scripts/check-chart-options.cjs <目标工程根>
```

有硬 FAIL → exit 1；纯 advisory（option 是外部变量 / STATIC_THEME）→ exit 0 但报告需人工确认。推荐 `const chartBase = { a2ui: true, theme: isDark ? 'hdesign-dark' : 'hdesign-light' }` 聚合后展开进各 option（`isDark` 来自 `useApp()`，chartBase 引用 isDark 即响应式，见 [components/Chart.md](components/Chart.md)）。

### 4.5 Table 默认值反向坑检查（advisory 必跑）

> 对应 [Table.md](components/Table.md) §4/§5「Table 排序项/斑马纹/外层宽度/columns 更新」四连——eview-react 的 Table 多个默认值与 antd **相反**，迁移时最易忘、最常错。脚本无法访问源 antd 项目，故全 advisory：列出每个 `<Table>` 缺哪几项标记，**强制迁移方逐条对照源 antd 回应**（决策写入 `.migration-result.json` 的 `tableDefaultReviews`）。这一步把「靠 AI 记住」的约束变成「AI 必须逐条回应」。

脚本 `scripts/check-table-defaults.cjs`，对每个 `<Table>` 标六项：① `enableZebraCrossing`（eview 默认 true 开斑马纹 vs antd 默认无）、② `allowSort`（列级属性，eview 默认 true 全列带排序箭头 vs antd 默认无，检查 columns 数组每列是否标 allowSort）、③ `enableColumnCompareUpdate`（eview 默认 false，columns 动态失效）、④ `width`（eview 默认行内 100%/100% 撑破布局）、⑤ `freezeCol`（eview 无条件冻结，含则需确认源真会横向滚动）、⑥ **`columnsAllWidth`（列级，columns 所有列都带 width 会导致 eview-react Table 显示异常——至少一列不设 width 自适应剩余空间；非冻结列去 width，冻结列 freezeCol: true 保留）——硬 FAIL（①-⑤ 为 advisory）**。

> **`columnsAllWidth` 扫描基于 AST（@babel/parser）**：从 `columns` 表达式收集【顶层列对象】（数组直接元素 / `.map` 回调 return 的对象，**不深入嵌套**——避免列 `render` 回调里返回的 `{children,props}` 被误计入列数），逐个查 `width` 属性。覆盖 `columns={raw.map(c=>({width}))}`/`Array.from`/spread/function 回调 return/标识符追同文件 `const` 等动态形态（纯正则只扫第一个 `[...]` 数组体，`.map` 列全漏）。规则：全列有 `width` 且（列数≥2 或 `.map`/`Array.from` 动态生成）则报——`.map` 回调静态只产 1 个形状对象但运行时可能 N 列，故动态生成时不看列数阈值。①~⑤ 是 tag 级 / 文件级文本搜索，保留正则；Table 元素定位也走 AST（精准取开标签节点）。与字段残留类 check 共用 `scripts/lib/ast-helpers.cjs`。

```bash
node <skill目录>/scripts/check-table-defaults.cjs <目标工程根>
```

advisory 模式 exit 0，但每个待核 `<Table>` 必须在 `.migration-result.json` 的 `tableDefaultReviews` 写明决策（如 `"源无 sorter，已加 allowSort:false"`、`"源无斑马纹，已加 enableZebraCrossing:false"`）。未逐条回应视同 FAIL。**`columnsAllWidth` 为硬 FAIL（exit 1，非 advisory，无需 --strict 即拦）——全列定宽是产物侧不变量，不依赖源项目，命中即必须修复（去掉非冻结列 width，至少一列不设 width 自适应；冻结列 freezeCol: true 保留 width）**。

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

### 4.13 IconPlusIc* 名实有性（check-icon-names.cjs）—— 仅方案 C

> **方案 C 专属**：本闸门校验产物 `IconPlusIc*` 名是否为 `references/icons/icon-plus-names.json` **离线 catalog 快照**的实有条目——这正是方案 C 的真值（`match-icons.cjs` 离线匹配的唯一 ground truth）。**方案 B（内网）不跑此闸门**：方案 B 的名由在线 `getIconInfo` 接口匹配（真值是实包/在线服务，非离线快照），版本漂移时会出现「实包有、快照无」的名，跑此闸门会误报 FAIL。**方案 A** 产物无 `IconPlusIc*` 名（`<Icon>` shim），跑了亦 no-op。项目级 B/C 二选一（探 `https://octo.hdesign.huawei.com/` 可达性：内网→B / 外网→C），见 [§3.0](#) 与 [components/Icon.md](components/Icon.md) 渲染方式。

方案 C 转换后，产物中每个 `IconPlusIc{Domain}{Name}` 标识符（import specifier、JSX 标签、标识符引用）都必须是该 catalog 的实有条目。防的回归：LLM residual 复核时臆造 `IconPlusIc{Domain}{Name}`——拿桶前缀 + 源名 PascalCase 基名拼接，既不验证 entry 在该桶存在、又常拼错桶（实测：源 `siren`→`IconPlusIcPublicAlarm`，但 `Alarm` 只在 Ict 桶；源 `building-2`→`IconPlusIcIctBuilding2`，全库无 `Building2`）。`match-icons.cjs --apply` 对孤儿名（catalog 无任何匹配、无候选）已自动落占位 `IconPlusIcPublicTransverseRectangleTemplate`（实有条目），本闸门兜底扫产物所有 `IconPlusIc*` 拦漏网的非实有名。

脚本 `scripts/check-icon-names.cjs`，纯静态正则（去注释后扫 `IconPlusIc[A-Z][A-Za-z0-9]*`），跳过 `src/shared/`（同 `check-imports.cjs` 惯例），对照 catalog 实有集逐一校验。

```bash
node <skill目录>/scripts/check-icon-names.cjs <目标工程根>   # 仅方案 C（外网）项目跑
```

硬 FAIL：任一 `IconPlusIc*` 名非 catalog 实有条目 → exit 1（报 `INVALID-ICON-NAME` + file:line:名）。修复：residual 名只能取候选[0] / 占位 / catalog 实有名，禁止拼接 `IconPlusIc{Domain}{Name}`；孤儿名交 `match-icons.cjs --apply` 自动落占位。详见 [components/Icon.md](components/Icon.md) residual 铁律③。

### 4.14 Menu→Accordion 迁移正确性检查（硬 FAIL + advisory 必跑）

> 对应 component-mapping.md Menu 行 + components/Accordion.md §4/§5/§8/§9/§10。antd Menu→eview Accordion 是「带 `expanded` 语义反转 + 字段重命名（`key/label`→`value/title`）+ 默认值反向坑（`hideIcons`/`hideTitleBar` 默认必加）」的高错迁移，文档已强约束，本脚本做机器兜底——Menu/Accordion 此前无专属校验脚本，`expanded` 语义反转这类易错点全靠 LLM 自觉，弱模型最常漏。

脚本 `scripts/check-accordion.cjs`，对每个 `<Accordion>` 检查：

> **字段残留扫描（`DATA_FIELD_RESIDUE`）基于 AST（@babel/parser）**——从 `data` 表达式递归收集所有 ObjectExpression（含嵌套 `children` 子项），覆盖 `.map(item=>({key,label}))`/`Array.from`/spread/function 回调 return/shorthand/计算键等动态形态，标识符引用追同文件 `const` 定义（与 check-select-options/check-dropdown 共用 `scripts/lib/ast-helpers.cjs`）。其余检查（selectedValue/expanded·onExpand/hideIcons）仍走正则。

**硬 FAIL（exit≠0 即 FAIL）**：
1. `SELECTED_VALUE_ARRAY` — `selectedValue` 传数组（应为单 string，非 antd `selectedKeys` 数组）
2. `DATA_FIELD_RESIDUE` — `data` 子项残留 antd 字段名 `key:`/`label:`（应为 `value:`/`title:`，**含嵌套 `children` 里的子项**）；AST 递归收集 ObjectExpression 覆盖 `.map`/`Array.from`/spread/shorthand/计算键等动态形态，标识符引用追同文件 `const` 定义
3. `EXPAND_INVERTED` — `expanded` 传入值与状态变量语义相反：collapsed 语义（变量名含 `collapse`，true=收起）多加了 `!`（`expanded={!collapsed}`）/ expanded 语义（变量名含 `open/expand/show/visible`，true=展开）漏了 `!`（`expanded={isOpen}`）
4. `ON_EXPAND_NOT_NEGATED` / `ON_EXPAND_OVER_NEGATED` — collapsed 语义下 `onExpand setV(flag)` 未取反（应 `setV(!flag)`）/ expanded 语义下 `setV(!flag)` 多取反（应 `setV(flag)`）

**advisory（exit 0，逐条回应写入 `accordionReviews`）**：
5. `HIDE_PROPS_MISSING` — `<Accordion>` 缺 `hideIcons` 或 `hideTitleBar`（迁移默认必加，两种形态都要，见 Accordion.md §10）
6. `EXPAND_GENERIC_NAMING` — `expanded`/`onExpand` 用泛化命名（非 `collapse`/`open`/`expand`/`show`/`visible` 语义），静态无法确认配对一致性，需核对两种正确形态之一

```bash
node <skill目录>/scripts/check-accordion.cjs <目标工程根>
```

硬 FAIL 项 exit≠0 即 FAIL；advisory 项 exit=0 但每个待核 `<Accordion>` 必须在 `.migration-result.json` 的 `accordionReviews` 写明决策，未逐条回应视同 FAIL。工程无 `<Accordion>` → PASS 不报。

### 4.15 Breadcrumb→Crumbs 迁移正确性检查（硬 FAIL 必跑）

> 对应 component-mapping.md Breadcrumb 行 + components/Crumbs.md §2/§4/§5。antd Breadcrumb→eview Crumbs 是「prop 重命名（`items`→`data`）+ 字段重命名（`href`/`path`→`url`）+ 拼写反转（`separator`→`seprator`）」的高错迁移。`title` 两边同名会掩护 `href`/`path` 漏改（最常见失败），且 `<Breadcrumb.Item>` JSX 子元素形态要拍平成 `data` 数组——文档已强约束，本脚本做机器兜底。

脚本 `scripts/check-crumbs.cjs`，对每个 `<Crumbs>` 检查（全硬 FAIL）：

> **字段残留扫描（`FIELD_RESIDUE`）基于 AST（@babel/parser）**——从 `data`/`items`/`item` 表达式递归收集所有 ObjectExpression，覆盖 `.map(item=>({href,url}))`/`Array.from`/spread/function 回调 return/shorthand/计算键等动态形态，标识符引用追同文件 `const` 定义（与 check-select-options/check-dropdown/check-accordion 共用 `scripts/lib/ast-helpers.cjs`）。tag 级检查（items=/item=/separator=）仍走正则。

1. `ITEMS_RESIDUE` — `items=`/`item=` 残留（应为 `data=`，antd items prop 没改成 data）
2. `FIELD_RESIDUE` — `data` 项里 `href:`/`path:` 残留（应为 `url:`；AST 扫 `data`/`items`/`item` 持有的数组体——`items=`/`item=` 残留时第一轮即抓字段残留；覆盖 `.map`/`Array.from`/spread/shorthand/计算键等动态形态，标识符追同文件 `const` 定义，按 file:line:field 去重）
3. `SEPARATOR_RESIDUE` — `separator=`（正确英文）残留（应为 `seprator=`，eview-react 官方 API 即拼错的 seprator，将错就错）

```bash
node <skill目录>/scripts/check-crumbs.cjs <目标工程根>
```

硬 FAIL，exit≠0 即 FAIL。无需在 result 写决策（纯残留检查，非 advisory）。工程无 `<Crumbs>` → PASS 不报。

### 4.16 Dropdown→DropDown 迁移正确性检查（硬 FAIL + advisory 必跑）

> 对应 component-mapping.md Dropdown 行 + components/DropDown.md §4/§5/§8/§9。antd Dropdown→eview DropDown 是「prop 重命名（menu/items→data）+ 字段重命名（key→value，label→text）+ 回调签名改（onClick({key})→onItemClick(item,event)）+ 不支持多级子菜单 + disabled 正确拼写（非 disable）」的高错迁移。**原 PopUpMenu 方案已废弃**（多级 children 下钻改用 DropDown 一级 + `label:true` 分组），本脚本做机器兜底——拦弱模型最常漏的 prop/字段残留、误当 Select、误用受控显隐、disable 拼错、trigger 数组等硬错误，外加 onClick 用法与 value=0 真假值判断两类待核项。

脚本 `scripts/check-dropdown.cjs`，对每个 `<DropDown>` 检查：

> **字段残留扫描（项 4/5/6/7 的 data 项字段）基于 AST（@babel/parser）**——从 `data`/`items`/`options`/`menu.items` 表达式递归收集所有 ObjectExpression，覆盖 `.map(item=>({key,label}))`/`Array.from`/spread/function 回调 return/shorthand/计算键/嵌套等动态形态，标识符引用追同文件 `const` 定义（与 check-select-options/check-accordion 共用 `scripts/lib/ast-helpers.cjs`）。tag 级检查（menu/items/options prop 残留、disable=、trigger、placement、open、value、onClick）仍走正则。

**硬 FAIL（exit≠0 即 FAIL）**：
1. `MENU_PROP_RESIDUE` — `menu=` 残留（antd `menu={{items}}`，应为 `data=`）
2. `ITEMS_PROP_RESIDUE` — `items=` 残留（应为 `data=`）
3. `OPTIONS_PROP_RESIDUE` — `options=` 残留（误当 Select，应为 `data=`）
4. `KEY_FIELD_RESIDUE` — data 项 `key:` 残留（应为 `value:`，含 menu/items/options 持有的数组与同文件 `const` 定义追源）
5. `LABEL_TEXT_RESIDUE` — data 项 `label:` 带字符串值（antd 文字 label，应为 `text:`；**`label: true` 是 DropDown 合法分组标记，不报**）
6. `CHILDREN_SUBMENU_RESIDUE` — data 项 `children:` 残留（antd 多级子菜单，DropDown 仅一级不支持，需拍平为 `label:true` 分组或拆成多个菜单）
7. `DISABLE_PROP_RESIDUE` — `disable` 残留（prop 级或 data 项字段，应为 `disabled`，DropDown 用正确拼写）
8. `TRIGGER_ARRAY` — `trigger={['click']}` 数组（应为单字符串 `'click'`/`'hover'`）
9. `PLACEMENT_RESIDUE` — `placement=` 残留（应为 `position`+`popupDirection`）
10. `OPEN_CONTROL_RESIDUE` — `open=`/`onOpenChange=` 残留（DropDown 展开由组件内部管理，无受控显隐 API；用 `onDropDown`/`onClosePopup` 仅作通知）
11. `SELECT_API_RESIDUE` — `value=`/`onChange=` 残留（误当 Select，DropDown 无选值契约）

**advisory（exit 0，逐条回应写入 `dropdownReviews`）**：
12. `ONCLICK_USED` — `<DropDown>` 用 `onClick=`（应用 `onItemClick(item, event)` 处理菜单项点击；`onClick` 是未记录的无参事件，不能取点击项）
13. `VALUE_BOOLEAN_CHECK` — `onItemClick` 回调用 `if (item.value)`/`if (!item.value)` 真假值判断（`value=0` 有效会误拦，应 `item.value === undefined` 判缺失）

```bash
node <skill目录>/scripts/check-dropdown.cjs <目标工程根>
```

硬 FAIL 项 exit≠0 即 FAIL；advisory 项 exit=0 但每个待核 `<DropDown>` 必须在 `.migration-result.json` 的 `dropdownReviews` 写明决策（如 `"已改 onClick→onItemClick"` 或 `"已改 if(!item.value)→item.value===undefined"`）。未逐条回应视同 FAIL。工程无 `<DropDown>` → PASS 不报。

### 4.17 Select 系 options/data label→text 残留检查（硬 FAIL 必跑）

> 对应 component-mapping.md Select / MultipleSelect / InputSelect / SelectCard / CheckboxGroup / RadioGroup 行 + components/Select.md §2「选项结构」。eview-react 这些组件的选项项字段是 `{ text, value }`（不是 antd 的 `{ label, value }`），按 `text` 取显示文字——漏改 `label→text` 则下拉项文字空白。`label→text` 重命名发生在步骤 2（LLM 手工替换），本脚本做机器兜底。

脚本 `scripts/check-select-options.cjs`，对每个 Select 系元素（`Select`/`MultipleSelect`/`InputSelect` 取 `options`；`SelectCard`/`CheckboxGroup`/`RadioGroup` 取 `data`）检查（全硬 FAIL）：

1. `LABEL_TEXT_RESIDUE` — options/data 项残留 antd 字段名 `label`（应为 `text`）

**扫描基于 AST（@babel/parser）**——从 options/data 表达式递归收集所有 ObjectExpression，覆盖 `.map(item=>({value,label}))`（最常见的产物形态）/`.map` 块体 return/`.map(function)`/`Array.from`/spread/嵌套/shorthand `{label}`/计算键 `{['label']:x}` 等全部 JS 书写形态，标识符引用追同文件 `const` 定义（含 `.map` 产生的）。之所以用 AST 而非正则：纯正则的 `resolveArrayBody` 只扫第一个 `[...]` 数组体（即 `.map` 的源数组 `[1,2,3]`），扫不到回调里的对象字面量；且 `label: item`（标识符值）非字符串字面量，旧正则 `label:\s*['"`]` 也匹配不到。AST 与 check-dropdown/check-accordion 共用 `scripts/lib/ast-helpers.cjs`。

```bash
node <skill目录>/scripts/check-select-options.cjs <目标工程根>
```

硬 FAIL，exit≠0 即 FAIL。无需在 result 写决策（纯残留检查，非 advisory）。工程无 Select 系组件 → PASS 不报。依赖 `@babel/parser`（`@vitejs/plugin-react` 传递依赖，目标工程 `npm install` 后可用；找不到 exit 2 提示装）。

### 4.18 RangePicker JSX 残留检查（硬 FAIL 必跑）

> 对应 component-mapping.md `DatePicker.RangePicker` / `RangePicker` 行 + components/DatePicker.md §范围选择 + components/TimePicker.md §反面示例。eview-react **没有 RangePicker 导出**——antd 的 `DatePicker.RangePicker` / `RangePicker` 必须转为 `<DatePicker range={...}>`（onChange 用 `target` 参数 `'from'`/`'to'` 收集起止，不要用 `onOkClick`），`TimePicker.RangePicker` 转为两个 `<TimePicker>` + 业务校验。步骤 2 LLM 常漏改（migrationPlan 里 RangePicker 信号埋在 DatePicker keyDiffs 子段，bare `import { RangePicker }` 甚至 unmatched 无信号），且步骤 3 此前无脚本拦——即使 import 已改成 `@/shared/DatePicker`，JSX 仍用 `.RangePicker` 成员或 `<RangePicker>` 标识符时 check-imports 不报。本脚本做机器兜底。

脚本 `scripts/check-rangepicker.cjs`，用 AST（@babel/parser）精准定位（避免字符串/注释误报），检测三种形态的 RangePicker 残留（全硬 FAIL）：

1. `RANGEPICKER_RESIDUE` — 任一形态：
   - **JSX 元素** `<DatePicker.RangePicker>` / `<RangePicker>` / `<TimePicker.RangePicker>`（含源 `const { RangePicker } = DatePicker` + `<RangePicker>` 这种解构出标识符再当 JSX 用——用户产物实测形态）
   - **解构** `const { RangePicker } = X`（含 rename `{ RangePicker: RP }`）——eview-react DatePicker（@/shared/DatePicker 包壳）无 RangePicker 成员，解构得 undefined；拦半修残留（JSX 已改 `<DatePicker range>` 但留下死解构）
   - **成员访问** `X.RangePicker`（非 JSX，如 `const RP = DatePicker.RangePicker`）——eview-react 无 RangePicker 导出

```bash
node <skill目录>/scripts/check-rangepicker.cjs <目标工程根>
```

硬 FAIL，exit≠0 即 FAIL。无需在 result 写决策（纯残留检查，非 advisory）。工程无 RangePicker JSX → PASS 不报。依赖 `@babel/parser`（同其他 AST check）。

### 4.19 .js/.ts 承载 JSX 检查（必跑，硬 FAIL + --fix 兜底）

> 对应 SKILL.md 硬约束 #14。Vite/esbuild 默认不对 `.js`/`.ts` 启用 JSX loader——`.js`/`.ts` 文件含 JSX 语法时项目启动报错。`match-icons.cjs` 的 `renameJsxFiles` 只覆盖 icon 步骤自己的 `<IconPlusIc` 改写、且只扫 `src/`；本脚本是项目级、来源无关的兜底网——icon 步骤漏的、步骤 2 组件替换 / LLM 手改注入 JSX 的、mock 数据在 `src/` 外的，统一拦。

脚本 `scripts/check-jsx-extension.cjs`，基于 AST（@babel/parser，复用 `lib/ast-helpers.cjs`）：扫工程根下所有 `.js`/`.ts`（排除 node_modules/dist/build/.git），解析（jsx 插件），若 AST 含 `JSXElement` / `JSXFragment` 节点 → 该文件承载 JSX → 违规。AST 节点类型判定零误报：`a < b` 比较运算 → BinaryExpression、字符串 `"<Foo/>"` → StringLiteral、TS 类型断言 `<Foo>x` → TSTypeAssertion（均非 JSXElement）；仅 `<Foo/>` / `<Foo>...</Foo>` / `<>...</>` 真 JSX 触发。

两种模式：
- **检查（默认）**：列出违规 `.js`/`.ts` 文件 + 首个 JSX 行号，**硬 FAIL**（exit 1）。
- **`--fix`**：违规文件 `.js→.jsx` / `.ts→.tsx`（写新路径删旧，同名冲突跳过交人工）+ 工程级修引用方显式 `.js`/`.ts` 扩展名 import/require（无扩展名 import 不动，解析器仍命中 `.jsx`/`.tsx`）+ 复核无残留。

```bash
node <skill目录>/scripts/check-jsx-extension.cjs <目标工程根>           # 检查，硬 FAIL
node <skill目录>/scripts/check-jsx-extension.cjs <目标工程根> --fix     # 自动改扩展名 + 修引用
```

硬 FAIL，exit≠0 即 FAIL。无需在 result 写决策（纯工具链约束，非 advisory）。工程无 `.js`/`.ts` 承载 JSX → PASS 不报。依赖 `@babel/parser`（同其他 AST check）。

### 4.20 常见报错对照

| 报错 | 原因 | 修复 |
|------|------|------|
| `Element type is invalid` | 缺 peer 依赖 | 补装 `@cloudsop/horizon` 等 |
| 组件无样式 | 未引 css 或缺类名 | 引 `aui3_1.css` + `<body>` 加 `class="aui3_1"` |
| 弹层文案是 key | 缺 IntlProvider | 加 `IntlProvider` + `messages` |
| `MISSING_TRANSLATION: Missing message "xxx" for locale "zh"` | IntlProvider 放在 `app.jsx`/AppShell 里，不在 `main.jsx` 最外层 | 把 IntlProvider 搬到 `main.jsx` 最外层直接包 `<App/>`；详见 [i18n-migration.md](i18n-migration.md) §4 |
| `MISSING_TRANSLATION: Missing message "gateway" for locale "zh"`（消息 id 是短代码如 "gateway"/"shanghai"） | Table 列 `render` 用 `t(value, value)` 但 `data.js` 里 value 是短代码、i18n key 带前缀 | 在 render 里补命名空间前缀：`t("deviceType." + value, value)`；详见 §3.5 |
| `undefined is not a function` | ref 还没挂载就调方法 | 检查 `?.` 可选链 + 组件是否已渲染 |

### 4.21 验证

跑验证脚本，把结果写入 `<目标工程根>/.migration-result.json`。

> **十八个脚本均为机器兜底，对抗 AI 在长任务中遗忘 skill 硬约束**。导入路径/图表 option/Provider/token 值漂移/dark-mode 双轨/Accordion expand 语义反转+字段残留/Crumbs items+separator+字段残留/Dropdown menu-items-options 残留+字段 key-label-children 残留+disable 拼错+trigger 数组/placement/open/value/onChange 残留/**Select 系 options/data label→text 残留**/**RangePicker JSX 残留**/**.js/.ts 承载 JSX（check-jsx-extension）**是硬约束，脚本 exit≠0 即 FAIL；i18n-keys/table-defaults/steps-defaults/messagedialog-defaults/accordion/dropdown/css/token/props-preserved advisory 项 exit=0 但需把人工核对结论写进 result 的对应字段，未逐条回应视同 FAIL。**`check-icon-names.cjs`（§4.13）为方案 C 专属条件跑，不在无条件必跑之列**——见下方「方案 C 专属加跑」。

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
13. 跑 `node <skill目录>/scripts/check-accordion.cjs <目标工程根>`（§4.14，硬 FAIL + advisory，advisory 项逐条回应写入 `accordionReviews`）
14. 跑 `node <skill目录>/scripts/check-crumbs.cjs <目标工程根>`（§4.15，**硬 FAIL**，exit≠0 即 FAIL）
15. 跑 `node <skill目录>/scripts/check-dropdown.cjs <目标工程根>`（§4.16，硬 FAIL + advisory，advisory 项逐条回应写入 `dropdownReviews`）
16. 跑 `node <skill目录>/scripts/check-select-options.cjs <目标工程根>`（§4.17，**硬 FAIL**，exit≠0 即 FAIL——Select 系 options/data 项 label→text 残留，AST 扫描覆盖 `.map`/`Array.from`/spread/shorthand/计算键等动态形态）
17. 跑 `node <skill目录>/scripts/check-rangepicker.cjs <目标工程根>`（§4.18，**硬 FAIL**，exit≠0 即 FAIL——`<DatePicker.RangePicker>`/`<RangePicker>`/`<TimePicker.RangePicker>` JSX 残留，eview-react 无 RangePicker 导出）
18. 跑 `node <skill目录>/scripts/check-icon-shim.cjs <目标工程根> --strict`（**硬 FAIL**，B/C 都跑——UNJUSTIFIED 闭集误留 / STALE-SHIM-IMPORT / UNCONVERTED-ICON-SOURCE 数据源半改 / PROP_DROPPED_ON_ICON_REWRITE 丢 handler props / TERNARY_WRAP_LOST 条件式漏包 `{}` 任一，见 [Icon.md](components/Icon.md) 步 7 + §3.0）。**与阶段 2 §3.0 步 7 同闸门、幂等**——stage 3 重测兜底防阶段 2 后续 LLM 临场手改图标站点引入回归（正是 TERNARY_WRAP_LOST 要防的"偶尔丢 `{}`"类），并让 `.migration-result.json` 的 `icon-shim` 键权威实测（非沿用阶段 2 旧结果）。复用阶段 2 步 7 生成的 `.icon-shim-justified.json`（无残留 `<Icon>` shim 站点则不需该文件、0 处直接 PASS）。`PROP_DROPPED`/`TERNARY_WRAP_LOST` 的非 handler props（title/aria-*/role/tabIndex）与箭头函数 handler 是已知盲区，须人工复核（residual 手改 / Button 外壳剥离站点在 `confirmedSiteRepairs` 逐条回应）。
19. 跑 `node <skill目录>/scripts/check-jsx-extension.cjs <目标工程根>`（§4.19，**硬 FAIL**，exit≠0 即 FAIL——`.js`/`.ts` 文件承载 JSX，Vite 不对 `.js`/`.ts` 启用 JSX loader 项目启动报错；拦 icon 步骤 / 步骤 2 组件替换 / LLM 手改向 `.js`/`.ts` 注入 JSX 漏改扩展名。命中可跑 `--fix` 自动 `.js→.jsx` / `.ts→.tsx` + 修引用后重跑）
20. `cd <目标工程根> && npm install`（bash 工具 timeout=30000）；超时/失败（外网无法访问 `@nce` 内网源）记 `SKIP`

**方案 C 专属加跑**（项目级图标方案为 C / 外网 octo 不可达时，**在步骤 18（check-icon-shim）之后、npm install（步骤 20）之前**加跑）：
- 跑 `node <skill目录>/scripts/check-icon-names.cjs <目标工程根>`（§4.13，**硬 FAIL**，exit≠0 即 FAIL——拦 LLM residual 臆造的非 catalog 实有 IconPlusIc* 名）。
- **方案 B（内网）项目不跑此闸门**：其图标名真值是在线 `getIconInfo` 接口（实包），非离线 catalog 快照，跑会误报实包有而快照无的名。方案 A 产物无 `IconPlusIc*` 名，跑了亦 no-op。

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
    "accordion": "PASS/FAIL",
    "crumbs": "PASS/FAIL",
    "dropdown": "PASS/FAIL",
    "select-options": "PASS/FAIL",
    "rangepicker": "PASS/FAIL",
    "icon-shim": "PASS/FAIL",
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
  "accordionReviews": [
    { "file": "src/views/.../nav.jsx", "line": 20, "code": "HIDE_PROPS_MISSING", "decision": "已补 hideIcons + hideTitleBar（见 Accordion.md §10）" },
    { "file": "src/views/.../nav.jsx", "line": 58, "code": "EXPAND_GENERIC_NAMING", "decision": "变量 val 实为 collapsed 语义，已改为 expanded={val}+setVal(!flag)" }
  ],
  "dropdownReviews": [
    { "file": "src/views/.../list.jsx", "line": 45, "code": "ONCLICK_USED", "decision": "已改 onClick→onItemClick(item, event)，按 item.value 派发" },
    { "file": "src/views/.../list.jsx", "line": 52, "code": "VALUE_BOOLEAN_CHECK", "decision": "已改 if(!item.value)→item.value===undefined，放行 value=0" }
  ],
  "confirmedSiteRepairs": [
    { "file": "src/views/.../header.jsx", "line": 12, "site": "residual 手改主题切换 <IconPlusIcPublicSun/>", "repair": "补回 onClick={toggleDark}（源 <Icon onClick={toggleDark}/> 漏搬）" },
    { "file": "src/views/.../header.jsx", "line": 30, "site": "Button 外壳剥离 <IconPlusIcPublicMoon/>", "repair": "补回 title={t('dark')} + role=\"button\" + tabIndex={0}" }
  ],
  "notes": "可选说明"
}
```

- 所有验收项全过 → status="PASS"，failures=[]
- 任一不过（SKIP 不算不过）→ status="FAIL"，failures 逐条写清具体失败点
- npm-install=SKIP 不影响整体 status（notes 写明外网环境降级，仅静态检查生效）
- `icon-shim` **硬 FAIL**（**两处跑** `check-icon-shim.cjs --strict`：阶段 2 §3.0 步 7 residual 复核 + 阶段 3 步 18 兜底重测）：exit≠0 → status="FAIL"。阶段 3 重测为权威值（防阶段 2 后续手改引入回归、非沿用旧结果）。5 项拦截项 + 非 handler props 盲区见步 18；**每处 residual 手改 / Button 外壳剥离站点须在 `confirmedSiteRepairs` 写明 props 复核决策**（闭集自动改写站点经 passthrough 已保留，无需记录），未逐条回应 → FAIL
- `table-defaults` advisory：脚本 exit=0 但有待核项时，**每个待核 `<Table>` 必须在 `tableDefaultReviews` 写明决策**；未逐条回应 → FAIL
- `steps-defaults` advisory：脚本 exit=0 但有待核项时，**每个待核 `<Steps>` 必须在 `stepsReviews` 写明决策**；未逐条回应 → FAIL
- `messagedialog-defaults` advisory：脚本 exit=0 但有待核项时，**每个待核 `<MessageDialog>` 必须在 `messageDialogReviews` 写明决策**；未逐条回应 → FAIL
- `accordion` advisory（HIDE_PROPS_MISSING/EXPAND_GENERIC_NAMING）：脚本 exit=0 但有待核项时，**每个待核 `<Accordion>` 必须在 `accordionReviews` 写明决策**（如已补 hideIcons/hideTitleBar、泛化命名变量实为哪种语义并已校正配对）；未逐条回应 → FAIL；硬 FAIL 项（SELECTED_VALUE_ARRAY/DATA_FIELD_RESIDUE/EXPAND_INVERTED/ON_EXPAND_*）exit≠0 直接 FAIL
- `dropdown` advisory（ONCLICK_USED/VALUE_BOOLEAN_CHECK）：脚本 exit=0 但有待核项时，**每个待核 `<DropDown>` 必须在 `dropdownReviews` 写明决策**（如已改 onClick→onItemClick、已改 `if(!item.value)`→`item.value===undefined` 放行 value=0）；未逐条回应 → FAIL；硬 FAIL 项（MENU_PROP_RESIDUE/ITEMS_PROP_RESIDUE/OPTIONS_PROP_RESIDUE/KEY_FIELD_RESIDUE/LABEL_TEXT_RESIDUE/CHILDREN_SUBMENU_RESIDUE/DISABLE_PROP_RESIDUE/TRIGGER_ARRAY/PLACEMENT_RESIDUE/OPEN_CONTROL_RESIDUE/SELECT_API_RESIDUE）exit≠0 直接 FAIL
- `css` advisory：脚本 exit=0 但有待核项时，**每个待核项必须在 `cssReviews` 写明决策**；未逐条回应 → FAIL
- `token-drift` advisory（TOKEN_MISSING/TOKEN_ADDED/UNDEFINED_REF）：脚本 exit=0 但有待核项时，**每个待核项必须在 `tokenDriftReviews` 写明决策**；未逐条回应 → FAIL
- `props-preserved` advisory（STYLE_DROPPED/CLASSNAME_DROPPED/COUNT_MISMATCH）：脚本 exit=0 但有待核项时，**每个待核项必须在 `propsPreservedReviews` 写明决策**（合理丢弃如 DatePicker 包壳已处理宽度，否则应补回）；未逐条回应 → FAIL
- `chart-options` 纯 advisory（option 是外部变量追不到）不计 FAIL，但需在 notes 说明已人工确认
- `provider` advisory（locale 用变量注入）不计 FAIL，但需在 notes 说明已人工确认值为 "zh"

**循环上限**：默认 5 轮（round 1 首次验证，round 2~5 修复后重测）。验证 FAIL 时主 agent 直接读 `.migration-result.json` 的 `failures` 字段，回到步骤 2 自己修复，再重新验证（round + 1）。第 5 轮仍 FAIL 必须停止，向用户报告失败项 + 建议人工介入。