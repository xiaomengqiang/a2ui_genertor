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
| **2. 逐组件替换** | 按映射总表替换每个 antd 组件；无对应的按 [handwrite-templates.md](references/handwrite-templates.md) 手写；图标按 §3.0 转 icon+：**契约——方案A 仅 name 值集合 OPEN（后端自由取值）；其余闭合集（字面量/常量/三元/数据结构字段/wrapper）一律转 icon+ 静态 import**。`match-icons.cjs --apply`（C）统一解析器 auto-转脚本能静态到达的闭合形态（字面量/常量/扁平+链式三元/数组/对象地图/wrapper/`@ant-design/icons`）；追不到源的（含跨边界 props/useMemo/推入函数闭合集）报 `untracedSites`（不断言方案A、keep shim 可运行）交 LLM 按 [Icon.md](references/components/Icon.md) §name 解析 统一原则判，`check-icon-shim.cjs --strict` 拦闭集误留；`.js`→`.jsx` 自动。B 下 LLM 全手工按同一契约。详见 [Icon.md](references/components/Icon.md) /图表（`@nce/eview-react/Chart`，**Chart 已在 `migrationPlan` 里**——按 keyDiffs 改 import 路径 + 每个 option 补 `a2ui: true` + `theme`（暗色派生，源 Chart 封装的注入行为不随包导入自动生效））。详见 [§3.0–§3.5](references/migration-workflow.md) | 组件代码全部替换 |
| **3. 验证** | `check-relative-imports.cjs` 跳过（路径已由 `umd-to-antd-vite` 修正）。`check-i18n-keys.cjs` 必跑。`npm install`（bash 工具 timeout=30000，超时/失败记 SKIP 不判 FAIL）。详见 [§4.4](references/migration-workflow.md) | i18n 检查通过 |

## 组件映射

> 完整映射（有对应 / 组合替代 / 无对应需手写）含 API 差异、属性拼写异常、回调签名差异见 [component-mapping.md](references/component-mapping.md)；无对应组件的手写模板见 [handwrite-templates.md](references/handwrite-templates.md)；单组件完整 API 见 [components/INDEX.md](references/components/INDEX.md) 索引。

## eview-react 硬约束（迁移时必须遵守）

1. **导入路径**：`import Button from '@nce/eview-react/Button'`，不是 `import { Button } from 'antd'`。**例外——包壳组件**：被包壳组件（清单：`Tag`、`Select`、`TextField`、`InputSelect`、`MultipleSelect`、`SearchInput`、`TextArea`、`DatePicker`、`Spinner`、`Steps`、`Cascader`、`TreeSelector`、`IPInput`、`TimePicker`）从 `@/shared/<X>` 导入（scaffold 预置；多数透明转发 `@nce/eview-react/<X>`、API 不变，`Cascader` 为 scaffold 手写组件、API 基本同 antd 调用点几乎零改动；props 规则仍按本 skill 映射表/组件文档迁移）；清单本约束维护，新增包壳同步更新。**特别注意——`RadioGroup` 包与 `Radio` 包分离**：`RadioGroup` 必须从 `@nce/eview-react/RadioGroup` **默认导入**（`import RadioGroup from '@nce/eview-react/RadioGroup'`），`@nce/eview-react/Radio` 只导出 `Radio` 组件本身、**不导出** `RadioGroup`，禁止写 `import { RadioGroup } from '@nce/eview-react/Radio'`。
2. **样式**：scaffold `main.jsx` 已写好六处 CSS import（`aui3_1` / `aui3_1_dark` / `base` / `font` / `tokens` / `theme-dark`），不要删
3. **Provider**：scaffold `main.jsx` 已配好 `ConfigProvider` + `IntlProvider`（`messages={componentsLocales[locale]}`）；i18n 静态接线（scenario A/B 合并业务包）已由 `umd-to-antd-vite` 步骤 3 前置完成（`i18nScenario.wired=true`），本 skill 步骤 1 只在 `wired=false`（scenario C）时做决策。**IntlProvider 必须在 `main.jsx`，是 `ConfigProvider` 的直接子级**（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；**locale 用 `"zh"` 不是 `"zh-CN"`**
4. **回调签名**：第一个参数通常是值不是 event（TextField `onChange(value, ...)`、Select `onChange(value, oldValue, text, oldText, event)`）
5. **validator**：返回 `{ result: true, message }`，`result: true` = 通过
6. **API 表里查不到的 props 一律不写**
7. **CSS 不写死色值**：用源项目的 CSS 变量（原始 token）；类名用业务前缀 `app-` 不用 `ev_`
8. **Toggle `data` 必须用布尔值**：`data={[false, true]}`（不要用字符串 `['false','true']`，`'false'` 是 truthy 会导致开关无法关闭）
9. **相对导入解析**：路径已由 `umd-to-antd-vite` 修正并验证通过（`.umd-conversion.json` 的 `verification.relativeImports=PASS`），步骤 3 **跳过** `check-relative-imports.cjs`。步骤 2 替换组件时新增的 import 不要写 `./src/...`（同级用 `./`、上层用 `../`）。
10. **DivMessage 通知浮层避免与表单输入组件同渲染树**：`DivMessage` 通过 `setNotice` 渲染在父组件中时，每次通知会触发父组件重渲染，导致 eview-react 输入组件（TextField、Select 等）丢失焦点。**应在用户输入回调（`setField`/`onChange`）中关闭浮层**，或将通知浮层抽离为独立组件（`createPortal` 到 `document.body` + 独立 `useState`）。
11. **所有图表 option 必含 `a2ui: true` 与 `theme`**：源项目 Chart 封装（`assets/shared/chart.jsx`）在 `setSimpleOption` 前统一注入这两项，改 `@nce/eview-react/Chart` 包导入后**不会自动补**——漏写则图表 a2ui 视觉规范失效、暗色切换后主题不跟随。`theme` 从全局暗色状态派生（`isDark ? "hdesign-dark" : "hdesign-light"`）。见 [components/Chart.md](references/components/Chart.md)
12. **Wizards/Steps 无 `size` API，通过 CSS 类名控制三种尺寸**：小尺寸 `ev_wizard_container_xs`（圆点 8px / 间距 4px / 文字 12px）、中尺寸（默认）`ev_wizard_container_sm`（圆点 24px / 间距 8px / 文字 14px）、大尺寸 `ev_wizard_container_lg`（圆点 32px / 间距 8px / 文字 16px）。**须通过 `@/shared/Steps` 包壳组件使用**（转发 `@nce/eview-react/Steps`），该包壳支持 `type="dot"` 开启实心圆点模式（圆内无数字）。**小尺寸（xs）默认即为 dot 模式**。包壳与样式由 scaffold 预置（`src/shared/Steps/`），业务侧只写 `className`/`type`、**无需复制 CSS**；用法见 [components/Steps.md](references/components/Steps.md) §6/§7。

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
- **IntlProvider 放错位置**：必须在 `main.jsx` 作为 `ConfigProvider` 直接子级，locale 用 `"zh"` 不是 `"zh-CN"`；见 [i18n-migration.md](references/i18n-migration.md) §4
- **Table render i18n key 不对齐**：`t(cellValue, cellValue)` 取不到带前缀的 key，需 `t("deviceType." + value, value)`；脚本 `scripts/check-i18n-keys.cjs` 自动排查；见 [migration-workflow.md](references/migration-workflow.md) §3.5
- **命名拼写异常**：`seprator`/`taggledChildren`/`disable` 等官方拼错；见 [component-mapping.md](references/component-mapping.md) 文末「属性拼写异常」表
- **import 路径失效**：scaffold 后 `app.jsx` 在 `src/`，`./src/context.jsx` 须改 `./context.jsx`；脚本 `scripts/check-relative-imports.cjs` 按需排查（见 [§4.1](references/migration-workflow.md)）；步骤 4 默认跳过（路径已由前置 skill 修正）
- **`antdIcons:[]` 误判无图标 → 跳过 `match-icons.cjs` → 全落方案A**：`antdIcons` 只统计 `@ant-design/icons` 命名导入，ict-coder 产物用自定义 `<Icon name>` 运行时 shim、`antdIcons` 恒 `[]` 但有大量 `<Icon name>` 调用点；**触发条件看 `<Icon name` 站点（`grep -rl "<Icon\b" src/`）不看 `antdIcons`**，`antdIcons: []` 禁止跳过 `match-icons.cjs`；见 [migration-workflow.md](references/migration-workflow.md) §0.1 警告 + §3.0
- **`columns[].fixed` 误加 `freezeCol`（冻结列视觉回归）**：eview 的 `freezeCol` **无条件冻结**（sticky+阴影），antd 的 `fixed` 仅在表格横向滚动（`scroll.x` 溢出）时才有视觉效果——源列写了 `fixed` ≠ 源页面视觉冻结。迁移**默认不写** `freezeCol`/`freezeColPosition`；仅当源列有 `fixed` **且**源表 `scroll.x`/列宽合计明显超出容器宽（迁移后真的会横向滚动）时才加列 `freezeCol: true` + 表 `freezeColPosition`；见 [component-mapping.md](references/component-mapping.md) Table 行
- **`columns[].width` 全列设宽误平移（列宽错乱）**：源 antd 的 `columns` 每列都设 `width`（常见于配 `scroll.x` 或 ict-coder 统一设宽场景）时，这些 `width` 多是 antd 按 `scroll.x`/列宽合计做横向滚动布局的相对值，不是精确像素要求——直接平移到 eview 会导致列宽分布错误、撑破或挤压。迁移规则：源 `columns` 每列都有 `width` → 除需迁移 `freezeCol` 的固定列**保留 `width`** 外，其余列**统一去掉 `width` 不映射**；源只有部分列设 `width`（混合）→ 按原值映射。判定：统计源 `columns` 设宽列数 == 总列数即走全列分支；见 [component-mapping.md](references/component-mapping.md) Table 行 + [migration-workflow.md](references/migration-workflow.md) Table 列宽 warning
- **图表 option 漏 `a2ui: true`/`theme`**：源 Chart 封装的注入行为不随包导入自动生效，所有图表 option 必须显式携带两项（theme 随暗色派生）；见 [components/Chart.md](references/components/Chart.md)

## 已知坑点与已解决问题

### DatePicker range 模式：onOkClick 不返回起止对象

**问题**：`DatePicker` range 模式下 `onOkClick` 回调的 `obj` **不含 `fromDateObj` / `toDateObj`**，而是分两次回调（`type: 'from'` 和 `type: 'to'`），每次只返回单个日期对象。导致条件 `if (obj.fromDateObj && obj.toDateObj)` 永远不成立，`setField` 不会执行。

**解决**：改用 `onChange` 回调，通过 `target` 参数（`'from'` / `'to'`）分别收集起止日期自行组装。详见 [DatePicker.md](references/components/DatePicker.md) § 范围选择。

### DivMessage 通知浮层导致输入框失焦

**问题**：`DivMessage` 通知浮层通过 `setNotice` 渲染在父组件渲染树中，每次 `notify` 产生新的 `notice` 对象导致父组件重渲染。`DivMessage` 挂载时触发的副作用（焦点竞争）导致 eview-react 输入组件（TextField、Select 等）在重渲染中丢失焦点。

**解决**：在 `setField` / `onChange` 等用户输入回调中调用 `setNotice(null)` 关闭浮层，避免焦点竞争。如果需保留提示，可把通知浮层抽离为独立组件（如 `createPortal` 到 `document.body` + 独立 `useState`），使其不参与表单组件的渲染树。

### 图表 option 缺 a2ui:true 与 theme 标识

**问题**：源项目 Chart 封装（`assets/shared/chart.jsx`）在 `setSimpleOption` 前对**每个图表**统一注入 `theme`（随 `.dark` 切 `hdesign-dark` / `hdesign-light`）与 `a2ui: true`（源封装写法：`setSimpleOption(name, { theme: isDark ? "hdesign-dark" : "hdesign-light", a2ui: true, ...option })`）。迁移到 `@nce/eview-react/Chart` 只改 import 路径时，业务 option 不含这两项且**不会自动补**——图表 a2ui 视觉规范失效、暗色切换后图表主题不跟随（preview2 实测坑）。

**解决**：所有图表 option 显式携带 `a2ui: true` 与 `theme`；`theme` 从全局暗色状态派生（如 `useApp().isDark ? "hdesign-dark" : "hdesign-light"`），暗色切换 → option 变化 → 图表按新主题重建。推荐在图表组件内聚合 `const chartBase = { a2ui: true, theme: ... }` 后展开进各 option（参考 preview2/src/views/dashboard-overview/index.jsx）。详见 [Chart.md](references/components/Chart.md)。

### Table 操作列按钮间距缺失

**问题**：antd 中操作列按钮用 `<Space>` 或 `<Space size="middle">` 包裹获得间距。迁移到 eview-react 后，直接在 render 中用 `<>...</>` Fragment 包裹按钮，多个按钮之间**无任何间距**，视觉上紧贴在一起。

**解决**：用 `<div style={{ display: 'flex', gap: '1rem' }}>` 代替 Fragment 包裹操作列按钮（gap 默认 `1rem`；源 antd `<Space>` 有显式 `size` 的按源值取，如 `size={24}`→`gap:'24px'`）。如需竖线分隔符见 [Divider.md](references/components/Divider.md) § 操作列。详见 [Table.md](references/components/Table.md) §2 列定义示例。

### Table 分页栏位置偏移（超出表格底部 / 超出父容器白色卡片）

**问题**：antd 的 Table 分页默认在表格外部底部，通过 `pagination` 的 `position` 控制位置。eview-react 的 Table 自带分页栏渲染在**表格组件内部**底部（`Table/index.css` 第 423-425 行 `.ev_table_has_paging { height: calc(100% - 3rem); }`），这个百分比高度相对于 Table 外层容器计算。当 Table 外层容器无固定高度（由内容撑开）且父容器有 `padding`（如卡片容器 `.device-table { padding: var(--spacing-inset); }`）时：

- 方案 A — **无 `maxHeight`**：`height: calc(100% - 3rem)` 计算失效（父容器无固定高度），表格内容撑开后分页栏被推到父容器 padding 区域之外，视觉上超出白色卡片底部。
- 方案 B — **设 `maxHeight`**：表格内容区被约束在 `maxHeight` 内，分页栏在内部底部，不会超出。但是如果表格内容很少（行数少于分页高度），`maxHeight` 会留下过多空白，不够灵活。

**解决**：

**方案 A（推荐 —— 覆盖组件库 CSS，适合内容动态变化场景）**：

```css
/* 在业务 CSS 中覆盖组件库的百分比高度，让表格内容由内容自然撑开 */
.device-table .ev_table_has_paging {
  height: auto;
}
.device-table .ev_paging.ev_table_paging {
  height: auto;
  padding-top: 1rem;
}
```

这样表格内容区 `height: auto` 由行数自然决定，分页栏紧随其后排列在内容区下方，被父容器的 `padding` 完整包裹。

**方案 B（适合固定高度卡片场景）**：

```jsx
<Table
  dataset={rows}
  enablePagination
  enableAutoPaging
  pageSize={8}
  maxHeight={480}      // 约束表格内容区高度，让分页栏在表格底部以内
/>
```

> `maxHeight` 不含分页栏高度，分页栏渲染在表格内部底部，设此值可确保表格总高度不超过 `maxHeight + 分页栏高度`，分页栏不会超出。详见 [Table.md](references/components/Table.md) §5 API 速查 `height`/`minHeight`/`maxHeight`。

### Table 排序项默认全部开启（源 antd 未配排序的列也带排序箭头）

**问题**：eview-react 的 Table 列 `allowSort` 默认值为 `true`，所有列头默认显示排序箭头。antd 的 Table 列 `sorter` 默认无（不排序），只有显式设了 `sorter` 的列才显示排序图标。迁移后源项目未配排序的列（如名称、编号、区域等纯展示列）也带上了排序箭头，不符合原设计。

**解决**：迁移时逐列检查源 antd 的 `columns` 定义：
- 源列有 `sorter` 的 → 保持 `allowSort: true`（或不设，利用默认值）
- 源列无 `sorter` 的 → 显式加 `allowSort: false`
- 操作列、状态列等无排序意义的列 → 显式加 `allowSort: false`

```jsx
// 迁移后：仅源项目有 sorter 的列保留排序
const columns = [
  { title: "设备名称", key: "name", allowSort: false },   // 源无 sorter
  { title: "负载率", key: "load", allowSort: true },      // 源有 sorter
  { title: "操作", key: "action", allowSort: false },     // 操作列不排序
];
```

### Table 斑马纹默认开启（源 antd 未开斑马纹也带斑马纹）

**问题**：eview-react 的 Table `enableZebraCrossing` 默认值为 `true`，表格默认开斑马纹。antd 的 Table **默认无斑马纹**——要开得用 `rowClassName={(_, i) => i % 2 === 0 ? 'ant-table-row-even' : ''}` + 自定义 CSS、或 ConfigProvider `theme.token` 配 stripe。源 antd 未开斑马纹的表格，迁移到 eview-react 后凭空多出斑马纹，与原页面视觉不一致。

**解决**：迁移每个 Table 时显式判定源 antd 是否开了斑马纹（搜源 `rowClassName` 是否输出 `even`/`odd`/`striped` 等类名、源 CSS 是否有 `.ant-table-row-even`/`.ant-table-row-odd` 背景、源 ConfigProvider `theme.token` 是否配 stripe）：
- 源未开斑马纹 → eview-react 表上显式加 `enableZebraCrossing={false}`
- 源开了斑马纹 → 不设（利用默认 `true`）

```jsx
// 源 antd 未开斑马纹 → 迁移后显式关闭
<Table dataset={rows} columns={columns} enableZebraCrossing={false} />
```

### Table 外层默认行内 width:100%;height:100% 撑破布局

**问题**：eview-react 的 Table 默认给最外层 dom 加行内样式 `width:100%;height:100%;`，在 flex 容器、Grid 布局、卡片内嵌等场景下会撑破父容器、占满高度挤压兄弟元素，与原 antd 表格（默认 block `width:100%`、高度由内容决定）布局不一致。

**解决**：迁移每个 Table 时显式加 `width="unset"` 重置组件库默认行内宽度。但要先看源 antd Table 有无 width 相关设置：
- 源 antd 有显式容器宽度（`style={{ width: ... }}` / className + CSS 设宽）→ 映射到 eview-react `width` prop
- 源 antd 无显式容器宽度 → 加 `width="unset"`
- `scroll={{ x: ... }}` **直接抛弃不转**——eview `width` 是最外层 dom 宽度，不是 antd 列宽计算/横向滚动阈值概念；实测映射会导致表格宽度错误

```jsx
// 源 antd 无显式容器宽度 → 迁移后重置默认行内宽度
<Table dataset={rows} columns={columns} width="unset" />
// 源 antd 有显式容器宽度（style/className CSS）→ 映射到 width prop
<Table dataset={rows} columns={columns} width={600} />
```

### Table columns 变化不生效（enableColumnCompareUpdate 默认 false）

**问题**：eview-react 的 Table `enableColumnCompareUpdate` 默认值为 `false`，更新 `columns` prop 时不会重新渲染列定义（diff 比较被关掉，columns 变化不生效）。源 antd 项目的 `columns` 经常动态变化——条件列（按权限/状态显示不同列）、筛选后列集、`useMemo` 依赖变化重建 columns 等。迁移后如果不显式开 `enableColumnCompareUpdate={true}`，所有 columns 变化的逻辑全部失效。

**解决**：迁移时默认显式加 `enableColumnCompareUpdate={true}`。

```jsx
<Table dataset={rows} columns={columns} enableColumnCompareUpdate />
```

### onChartRendered 回调内二次调 getEchartsInstance()

**问题**：`onChartRendered(chart)` 的 `chart` 参数**已经是 echarts 实例本身**，但迁移时误把它当作组件实例再调 `chart.getEchartsInstance()`——该方法只存在于组件 ref 上（`chartRef.current.getEchartsInstance()`），回调参数上没有，取值为 `undefined` 导致事件绑定静默失效（preview4 实测坑）。

**解决**：`onChartRendered` 回调内直接用参数绑事件/改配置：`chart.on('click', ...)`、`chart.setOption(...)`，**禁止**在回调内调 `getEchartsInstance()`。详见 [Chart.md](references/components/Chart.md) §4/§8。
