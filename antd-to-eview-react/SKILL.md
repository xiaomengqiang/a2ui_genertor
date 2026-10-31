---
name: antd-to-eview-react
description: >-
  将 umd-to-antd-vite 产物（eview-react Vite 工程 + .umd-conversion.json 交接文件）的 antd 组件替换为 @nce/eview-react（HUI Eview React，ICT 3.1）。
  仅处理 umd-to-antd-vite 产物，不直接处理 UMD 单 HTML 或其他来源的 antd 工程。
  覆盖：antd→eview-react 组件库替换、Steps/Modal 模式转换、Layout/Menu 等无对应组件手写。源项目表单用 div+输入组件拼合（无 Form/Form.Item）。
---

# antd → eview-react 迁移 Skill

## 前置条件

1. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可正常解析 `.npmrc` 中的 `@nce` scope。
2. **源项目工程形态**：源项目**必须是** `umd-to-antd-vite` 的产物——标准 Vite + npm 工程，附带 `.umd-conversion.json` 交接文件（含 `migrationPlan` 字段，由上游步骤 5 始终填充）。**若目标工程根无 `.umd-conversion.json`，本 skill 停止执行，提示用户先跑 `umd-to-antd-vite`**——不直接处理 UMD 单 HTML 或其他来源的 antd 工程。

## 迁移工作流（评估 + 3 步）

> 详细步骤见 [references/migration-workflow.md](references/migration-workflow.md)

| 步骤 | 做什么 | 产出 |
|------|--------|------|
| **0. 评估** | 读 `.umd-conversion.json` 的 `migrationPlan`（由 `umd-to-antd-vite` 步骤 5 `build-migration-plan.cjs` 脚本生成，含分类 A/B/C + 替换名 + **importPath** + **shellComponent** + **完整 keyDiffs** + ref 指引 + 涉及文件；**Chart 迁移行已注入**——`chartCallSites` 非空时由脚本自动 push，keyDiffs 含 `a2ui: true`/`theme` 补全提醒）+ `globalRef`（拼写异常 + 回调签名速查表）。**A 类组件直接用 keyDiffs + importPath 替换，无需读 `component-mapping.md` 或 `components/<Name>.md`**；仅 B/C 类按 `ref` 指引读对应 reference。读 `iconCallSites` 获取图标调用点预扫结果（跳过 grep）。详见 [migration-workflow.md](references/migration-workflow.md) 步骤 0 | 组件迁移清单 + 拼写/回调速查 + 图标调用点 + 图表迁移行 |
| **1. i18n 设置** | 读 `.umd-conversion.json` 的 `i18nScenario`：`wired=true`（scenario A/B）跳过接线（IntlProvider + 业务包合并已由上游步骤 3 完成），只做运行时验证（DatePicker 中文、Portal 不报 MISSING_TRANSLATION）；`wired=false`（scenario C）做 keep i18next vs 迁 react-intl 决策。详见 [i18n-migration.md](references/i18n-migration.md) §3/§4 | i18n 运行时验证通过 |
| **2. 逐组件替换** | 按映射总表替换每个 antd 组件；无对应的按 [handwrite-templates.md](references/handwrite-templates.md) 手写；图标按 §3.0 转 icon+：**契约——方案A 仅 name 值集合 OPEN（后端自由取值）；其余闭合集（字面量/常量/三元/数据结构字段/wrapper）一律转 icon+ 静态 import**。`match-icons.cjs --apply`（C）统一解析器 auto-转脚本能静态到达的闭合形态（字面量/常量/扁平+链式三元/数组/对象地图/wrapper/`@ant-design/icons`）；追不到源的（含跨边界 props/useMemo/推入函数闭合集）报 `untracedSites`（不断言方案A、keep shim 可运行）交 LLM 按 [Icon.md](references/components/Icon.md) §name 解析 统一原则判，`check-icon-shim.cjs --strict` 拦闭集误留 + 图标改写交互 props 丢失（PROP_DROPPED_ON_ICON_REWRITE，读 `.umd-conversion.json` 的 `iconCallSites.interactiveProps` 配对核对源 `<Icon>` 的 onClick/title 等是否保留到改写后的 `<IconPlusIc*>`，补 check-dark-mode.cjs 静态三轨盲区）；`.js`→`.jsx` 自动。B 下 LLM 全手工按同一契约。详见 [Icon.md](references/components/Icon.md) /图表（`@nce/eview-react/Chart`，**Chart 已在 `migrationPlan` 里**——按 keyDiffs 改 import 路径 + 每个 option 补 `a2ui: true` + `theme`（暗色派生，源 Chart 封装的注入行为不随包导入自动生效））。详见 [§3.0–§3.5](references/migration-workflow.md) | 组件代码全部替换 |
| **3. 验证（机器兜底门禁）** | 十一脚本必跑：`check-relative-imports.cjs` 跳过（路径已修正）；`check-i18n-keys.cjs`（§4.2）；`check-imports.cjs`（§4.3 硬约束①，硬 FAIL）；`check-chart-options.cjs`（§4.4 硬约束⑪）；`check-table-defaults.cjs`（§4.5 Table 默认值反向坑，advisory 须逐条回应）；`check-provider.cjs`（§4.6 硬约束③，硬 FAIL）；`check-css.cjs`（§4.7 硬约束⑦，advisory 须逐条回应）；`check-token-drift.cjs`（§4.8 色值 token 不漂移，对照源快照，token 值漂移硬 FAIL + advisory 须回应）；`check-props-preserved.cjs`（§4.9 包壳组件 style/className 保留，对照源快照，advisory 须逐条回应）；`check-steps-defaults.cjs`（§4.10 Steps labelPlacement 默认值反向坑，advisory 须逐条回应）；`check-dark-mode.cjs`（§4.11 硬约束⑬ 黑白主题双轨切换，硬 FAIL）；`check-messagedialog-defaults.cjs`（§4.12 MessageDialog iconLocation 默认值反向坑，advisory 须逐条回应）。`npm install`（timeout=30000，超时/失败记 SKIP 不判 FAIL）。脚本对抗 AI 遗忘硬约束——导入路径/图表 option/Provider/token 值/dark-mode 双轨脚本 exit≠0 即 FAIL；Table 默认值/Steps/MessageDialog/CSS/token/props-preserved advisory 须在 result 逐条回应。`check-token-drift`/`check-props-preserved`/`check-css` 依赖 `.umd-conversion.json` 的 `sourceCssTokens`/`inputPropCallSites`/`sourceCssColors`（由 `umd-to-antd-vite` `extract-umd.cjs` 生成）。详见 [§4.14](references/migration-workflow.md) | 十二脚本通过 + Table/Steps/MessageDialog/CSS/token/props 待核项逐条回应 |

## 组件映射

> 完整映射（有对应 / 组合替代 / 无对应需手写）含 API 差异、属性拼写异常、回调签名差异见 [component-mapping.md](references/component-mapping.md)；无对应组件的手写模板见 [handwrite-templates.md](references/handwrite-templates.md)；单组件完整 API 见 [components/INDEX.md](references/components/INDEX.md) 索引。

## eview-react 硬约束（迁移时必须遵守）

1. **导入路径**：`import Button from '@nce/eview-react/Button'`，不是 `import { Button } from 'antd'`。**例外——包壳组件**：被包壳组件（清单：`Tag`、`Select`、`TextField`、`InputSelect`、`MultipleSelect`、`SearchInput`、`TextArea`、`DatePicker`、`Spinner`、`Cascader`、`TreeSelector`、`IPInput`、`TimePicker`、`Crumbs`）从 `@/shared/<X>` 导入（scaffold 预置；多数透明转发 `@nce/eview-react/<X>`、API 不变，`TextField` 包壳扩展了 `prefix` prop（`.prefix-wrapper` 绝对定位，用法同 `suffix`），`Cascader` 为 scaffold 手写组件、API 基本同 antd 调用点几乎零改动；props 规则仍按本 skill 映射表/组件文档迁移）；清单本约束维护，新增包壳同步更新。**特别注意——`RadioGroup` 包与 `Radio` 包分离**：`RadioGroup` 必须从 `@nce/eview-react/RadioGroup` **默认导入**（`import RadioGroup from '@nce/eview-react/RadioGroup'`），`@nce/eview-react/Radio` 只导出 `Radio` 组件本身、**不导出** `RadioGroup`，禁止写 `import { RadioGroup } from '@nce/eview-react/Radio'`。**机器验证**：步骤 3 `check-imports.cjs` 自动扫残留 `from 'antd'`/RadioGroup 套错包/包壳组件错路径（自动跳过 `src/shared/` 实现文件），exit≠0 即 FAIL——见 [§4.3](references/migration-workflow.md)。**包壳组件须保留源 style/className**：替换组件时 antd 原组件身上的 `style`/`className` 必须带上到包壳组件，`check-props-preserved.cjs` 对照 `.umd-conversion.json` 的 `inputPropCallSites` 快照（由 `extract-umd.cjs` 扫描源调用点生成）按文件+家族+出现顺序配对，检查 style/className 丢失，advisory 须在 result 的 `propsPreservedReviews` 逐条回应——见 [§4.9](references/migration-workflow.md)。
2. **样式**：scaffold `main.jsx` 已写好六处 CSS import（`aui3_1` / `aui3_1_dark` / `base` / `font` / `tokens` / `theme-dark`），不要删
3. **Provider**：scaffold `main.jsx` 已配好 `IntlProvider`（`messages={componentsLocales[locale]}`）；i18n 静态接线（scenario A/B 合并业务包）已由 `umd-to-antd-vite` 步骤 3 前置完成（`i18nScenario.wired=true`），本 skill 步骤 1 只在 `wired=false`（scenario C）时做决策。**IntlProvider 必须在 `main.jsx` 最外层直接包 `<App/>`**（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；**locale 用 `"zh"` 不是 `"zh-CN"`**。**机器验证**：步骤 3 `check-provider.cjs` 自动扫 IntlProvider 是否在 main.jsx 顶层（被搬到 app.jsx/context.jsx → FAIL）+ `locale="zh-CN"` → FAIL。见 [§4.6](references/migration-workflow.md)。
4. **回调签名**：第一个参数通常是值不是 event（TextField `onChange(value, ...)`、Select `onChange(value, oldValue, text, oldText, event)`）
5. **validator**：返回 `{ result: true, message }`，`result: true` = 通过
6. **API 表里查不到的 props 一律不写**
7. **CSS 色值不漂移**：原项目 CSS 有时写死色值是**允许的**（忠实保留即可），但迁移**不能擅自改色值**；类名用业务前缀 `app-` 不用 `ev_`。**机器验证**：步骤 3 `check-css.cjs` 对照 `.umd-conversion.json` 的 `sourceCssColors` 快照（由 `umd-to-antd-vite` `extract-umd.cjs` 扫源业务 CSS 写死色值生成）按文件+出现顺序配对，检查色值漂移（COLOR_DRIFT 擅自改值/COLOR_ADDED 新增/COLOR_DROPPED 删除）+ `.ev_xxx` 类名，advisory 须在 result 的 `cssReviews` 逐条回应。自动排除 `src/styles/`（token 定义层）+ `src/shared/`（包壳层用 ev_ 类名覆盖组件库样式是正确的）。见 [§4.7](references/migration-workflow.md)。**色值 token 不漂移**：`check-token-drift.cjs` 对照 `sourceCssTokens` 快照（由 `umd-to-antd-vite` `extract-umd.cjs` 扫描源 `assets/style/` 四层 CSS 生成）检查 token 定义值漂移（硬 FAIL）+ 业务 CSS 引用未定义 token（advisory，自动排除 JSX 内联 style 注入的动态 token）。见 [§4.8](references/migration-workflow.md)。
8. **Toggle `data` 必须用布尔值**：`data={[false, true]}`（不要用字符串 `['false','true']`，`'false'` 是 truthy 会导致开关无法关闭）
9. **相对导入解析**：路径已由 `umd-to-antd-vite` 修正并验证通过（`.umd-conversion.json` 的 `verification.relativeImports=PASS`），步骤 3 **跳过** `check-relative-imports.cjs`。步骤 2 替换组件时新增的 import 不要写 `./src/...`（同级用 `./`、上层用 `../`）。
10. **DivMessage 通知浮层避免与表单输入组件同渲染树**：`DivMessage` 通过 `setNotice` 渲染在父组件中时，每次通知会触发父组件重渲染，导致 eview-react 输入组件（TextField、Select 等）丢失焦点。**应在用户输入回调（`setField`/`onChange`）中关闭浮层**，或将通知浮层抽离为独立组件（`createPortal` 到 `document.body` + 独立 `useState`）。
11. **所有图表 option 必含 `a2ui: true` 与 `theme`**：源项目 Chart 封装（`assets/shared/chart.jsx`）在 `setSimpleOption` 前统一注入这两项，改 `@nce/eview-react/Chart` 包导入后**不会自动补**——漏写则图表 a2ui 视觉规范失效、暗色切换后主题不跟随。`theme` 从全局暗色状态派生（`isDark ? "hdesign-dark" : "hdesign-light"`）。见 [components/Chart.md](references/components/Chart.md)。**机器验证**：步骤 3 `check-chart-options.cjs` 自动扫残留 `setSimpleOption(` + 每个 `<Chart option>` 是否含 `a2ui`/`theme`（支持内联/变量/`...chartBase` 展开），exit≠0 即 FAIL——见 [§4.4](references/migration-workflow.md)。
12. **Wizards/Steps 原生支持 `size` prop**：eview-react Steps 原生支持 `size: 'mini' \| 'small' \| 'middle' \| 'large'`（默认 `middle`，比通用三档多一个 `mini`），直接传 `size` 即可。**导入 `@nce/eview-react/Steps`（非包壳）**。antd Steps 的 dot（圆点）形态迁移时统一用 `size="mini"`（eview-react Steps 无 `type="dot"` prop）。用法见 [components/Steps.md](references/components/Steps.md) §6。
13. **黑白主题双轨切换**：源项目是单轨驱动（只切 `<html>` 的 `.dark`），产物需要双轨驱动——① 切 `<html>` 的 `.dark`（自定义 token 四层跟随）+ ② 切 `<body>` 的 `aui3_1_dark`（eview 组件库暗色覆盖层跟随）+ ③ 入口 import `aui3_1_dark.css`（class 切了才有样式）。三者配套，少任一轨黑白主题切换即坏（组件库不跟随 / 自定义 token 不跟随 / class 切了没样式）。**机器验证**：步骤 3 `check-dark-mode.cjs` 检测暗色需求（CSS 有 `.dark` 选择器 或 JS 有 `isDark`/`toggleDark`）后验证三轨完整性，缺任一轨 exit≠0 即 FAIL——见 [§4.11](references/migration-workflow.md)。

## 命名异常速查

> eview-react 部分 API 命名与"正确英文"或 antd 习惯不同（如 `seprator`/`taggledChildren`/`disable`/`status`/`defaultLabel`/`toggled` 等），迁移前必查 [references/component-mapping.md](references/component-mapping.md) 文末「属性拼写异常」+「回调签名差异」两张速查表

## 页面模式迁移

| antd 页面模式 | eview-react 迁移要点 |
|--------------|---------------------|
| **筛选列表页** | `Input.Search`→`SearchInput`+防抖；`Select` 换 `options` 格式；`Table` 换 `dataset`；分页用 Table 自带 `enablePagination`；**注意给 Table 设 `maxHeight` 或 `height` 让分页栏固定在表格底部**（否则父容器 padding 导致分页栏位置偏移） |
| **列表 CRUD** | `Modal`→`Dialog`；`Modal.confirm()`→`MessageDialog type="confirm"` |
| **多步向导** | `Steps current={i}`→`Steps currentStep={data[i].value}` |
| **表单提交页** | 输入组件逐个替换（源项目用 div+输入组件拼合，无 Form 包装）；提交逻辑不变 |
| **侧边详情/编辑** | `Drawer`→`Drawer`（`open`→`visible`）；底部按钮自写；`Descriptions`→手写 KeyValueList |
| **布局骨架** | `Layout`/`Avatar` 全部手写；`Menu`→`Accordion`；`Breadcrumb`→`Crumbs`；`Input.Search`→`SearchInput` |
| **分段选项卡** | `Segmented`→`SelectCard`（导出名是 SelectCard 不是 Segmented）；`options`→`data=[{text,value}]`；`defaultValue`→初始 `value` state；`block`→无对应（宽度走 `style`/`itemStyle`）；`disabled`→`disable`；`onChange` 首参即为选中值 |

## 前置 skill：umd-to-antd-vite

以下工作已由 `umd-to-antd-vite` 完成，本 skill 跳过：工程骨架搭建（eview-react scaffold 已就位）、组件扫描（`antdComponents`）、**图表调用点预扫**（`chartCallSites`，含文件+行号+chartType+共享件路径，已由 `build-migration-plan.cjs` 注入 `migrationPlan` 作为 Chart 迁移行，含 `a2ui: true`/`theme` 补全提醒）、**图标调用点预扫**（`iconCallSites`，含文件+行号+name值+类型，跳过 grep）、token 外置、相对导入修正、暗色模式转换（antd `theme.darkAlgorithm` → eview 类名切换）、i18n 静态接线（scenario A/B 的 `IntlProvider` + 业务包合并，`i18nScenario.wired=true`；scenario C 留本 skill 步骤 1 决策）、**组件分类评估**（`migrationPlan` enriched 版，由上游步骤 5 `build-migration-plan.cjs` 脚本生成，含 importPath + shellComponent + 完整 keyDiffs + ref；**A 类组件无需读 component-mapping.md / components/*.md**）+ **全局速查表**（`globalRef`，拼写异常 + 回调签名，跳过读 component-mapping.md 文末速查表）。

## 核心问题

从 antd 迁移到 eview-react 时的典型失败模式（每条详情见对应 reference）：

- **API 名称猜错**：`type`→`status`、`placeholder`→`defaultLabel`、`checked`→`toggled` 等；完整对照见 [component-mapping.md](references/component-mapping.md)
- **组件无对应**：Layout/Avatar/Descriptions/Result/Space 无直接对应，需手写补位；见 [handwrite-templates.md](references/handwrite-templates.md)
- **IntlProvider 放错位置**：必须在 `main.jsx` 最外层直接包 `<App/>`，locale 用 `"zh"` 不是 `"zh-CN"`；见 [i18n-migration.md](references/i18n-migration.md) §4
- **Table render i18n key 不对齐**：`t(cellValue, cellValue)` 取不到带前缀的 key，需 `t("deviceType." + value, value)`；脚本 `scripts/check-i18n-keys.cjs` 自动排查；见 [migration-workflow.md](references/migration-workflow.md) §3.5
- **命名拼写异常**：`seprator`/`taggledChildren`/`disable` 等官方拼错；见 [component-mapping.md](references/component-mapping.md) 文末「属性拼写异常」表
- **import 路径失效**：scaffold 后 `app.jsx` 在 `src/`，`./src/context.jsx` 须改 `./context.jsx`；脚本 `scripts/check-relative-imports.cjs` 按需排查（见 [§4.1](references/migration-workflow.md)）；步骤 4 默认跳过（路径已由前置 skill 修正）
- **`antdIcons:[]` 误判无图标 → 跳过 `match-icons.cjs` → 全落方案A**：`antdIcons` 只统计 `@ant-design/icons` 命名导入，ict-coder 产物用自定义 `<Icon name>` 运行时 shim、`antdIcons` 恒 `[]` 但有大量 `<Icon name>` 调用点；**触发条件看 `<Icon name` 站点（`grep -rl "<Icon\b" src/`）不看 `antdIcons`**，`antdIcons: []` 禁止跳过 `match-icons.cjs`；见 [migration-workflow.md](references/migration-workflow.md) §0.1 警告 + §3.0
- **`columns[].fixed` 误加 `freezeCol`（冻结列视觉回归）**：eview 的 `freezeCol` **无条件冻结**（sticky+阴影），antd 的 `fixed` 仅在表格横向滚动（`scroll.x` 溢出）时才有视觉效果——源列写了 `fixed` ≠ 源页面视觉冻结。迁移**默认不写** `freezeCol`/`freezeColPosition`；仅当源列有 `fixed` **且**源表 `scroll.x`/列宽合计明显超出容器宽（迁移后真的会横向滚动）时才加列 `freezeCol: true` + 表 `freezeColPosition`；见 [component-mapping.md](references/component-mapping.md) Table 行
- **图表 option 漏 `a2ui: true`/`theme`**：源 Chart 封装的注入行为不随包导入自动生效，所有图表 option 必须显式携带两项（theme 随暗色派生）；见 [components/Chart.md](references/components/Chart.md)
- **DivMessage 通知浮层导致输入框失焦**：`DivMessage` 通过 `setNotice` 渲染在父组件渲染树中时，每次通知触发父组件重渲染，导致输入组件丢失焦点；详见 [DivMessage.md](references/components/DivMessage.md) § 通知浮层与输入组件焦点竞争
- **Table 分页栏位置偏移**：eview-react Table 分页栏在表格内部底部，`calc(100% - 3rem)` 在无固定高度容器中失效，分页栏被推出父容器 padding 外；详见 [Table.md](references/components/Table.md) § 分页栏位置偏移
- **Table 操作列按钮间距缺失**：Fragment 包裹按钮无间距，需用 flex div + gap；详见 [Table.md](references/components/Table.md) § 操作列按钮间距
- **onChartRendered 回调内二次调 getEchartsInstance()**：回调参数已是 echarts 实例，禁止再调 `getEchartsInstance()`；详见 [Chart.md](references/components/Chart.md) §4/§8=