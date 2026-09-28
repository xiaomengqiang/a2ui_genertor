---
name: antd-to-eview-react
description: >-
  将 umd-to-antd-vite 产物（标准 antd Vite 工程 + .umd-conversion.json 交接文件）迁移到 @nce/eview-react（HUI Eview React，ICT 3.1）。
  仅处理 umd-to-antd-vite 产物，不直接处理 UMD 单 HTML 或其他来源的 antd 工程。
  覆盖：antd→eview-react 组件库替换、Form/Steps/Modal 模式转换、Layout/Menu 等无对应组件手写。
---

# antd → eview-react 迁移 Skill

## 前置条件

1. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可正常解析 `.npmrc` 中的 `@nce` scope。
2. **源项目工程形态**：源项目**必须是** `umd-to-antd-vite` 的产物——标准 Vite + npm 工程，附带 `.umd-conversion.json` 交接文件。**若目标工程根无 `.umd-conversion.json`，本 skill 停止执行，提示用户先跑 `umd-to-antd-vite`**——不直接处理 UMD 单 HTML 或其他来源的 antd 工程。步骤 0 读交接文件的 `antdComponents` 作为迁移清单（跳过扫描），步骤 1 用 `--upgrade` 模式（保留 token），步骤 4 跳过相对导入检查（路径已修正）。

## 迁移工作流（评估 + 4 步）

> 详细步骤见 [references/migration-workflow.md](references/migration-workflow.md)

| 步骤 | 做什么 | 产出 |
|------|--------|------|
| **0. 评估** | 读 `.umd-conversion.json` 的 `antdComponents` 作为迁移清单（由 `umd-to-antd-vite` 生成，跳过扫描）。对照组件映射总表标注"有对应/无对应需手写"。详见 [§0.1](references/migration-workflow.md) | 组件迁移清单 |
| **1. 建工程骨架** | 跑 `init-scaffold.cjs --force --upgrade`（覆盖骨架为 eview-react，保留 styles 里的 token CSS）。scaffold 目录结构与各文件用途见 [migration-workflow.md](references/migration-workflow.md) 步骤 1 / §1.2 | 可运行的空壳工程 |
| **2. 换 Provider 与入口** | 移除 antd `ConfigProvider` + `theme.darkAlgorithm`；eview-react 用 `ConfigProvider` + `IntlProvider` + `<body>` 加 `class="aui3_1"`，暗色切 `aui3_1_dark`（挂 `<body>`） | Provider 就绪 |
| **3. 逐组件替换** | 按映射总表替换每个 antd 组件；Form 模式单独按 [form-migration.md](references/form-migration.md) 转换；无对应的按 [handwrite-templates.md](references/handwrite-templates.md) 手写；图标（scaffold shim）/图表（`@nce/eview-react/Chart`）走预制件复用，调用点零改动。详见 [§3.0–§3.6](references/migration-workflow.md) | 组件代码全部替换 |
| **4. 验证** | `check-relative-imports.cjs` 跳过（路径已由 `umd-to-antd-vite` 修正）。`check-i18n-keys.cjs` 必跑。`npm install` + `npm run dev` 构建与功能验证。详见 [§4.6](references/migration-workflow.md) | i18n/构建/功能通过 |

## 组件映射总表

> 完整映射含 API 差异见 [component-mapping.md](references/component-mapping.md)；单组件完整 API 见 [components/INDEX.md](references/components/INDEX.md) 索引。

### 有直接对应（API 不同，需改 props）

**表单与输入**：Input→TextField、Input.TextArea→TextArea、Input.Search→SearchInput、Input.Password→TextField、InputNumber→Spinner、Select、Select(多选)→MultipleSelect、AutoComplete→InputSelect、Cascader、TreeSelect、Checkbox/Checkbox.Group→CheckboxGroup、Radio/Radio.Group→RadioGroup、Radio.Button→SelectCard、**Switch→Switch（推荐）或 Toggle**、Slider→DragInput、Rate→Rating、DatePicker、RangePicker→DatePicker range、TimePicker→Spinner、Upload→FileUpload、Form/Form.Item

**数据展示**：Table、Tabs/TabPane→Tab/TabItem、Collapse→Panel/PanelItem、Empty、Badge、Tag、Tooltip/Popover→TipBox、Popconfirm→MessageDialog、Breadcrumb→Crumbs

**反馈**：Modal→Dialog、Modal.confirm→MessageDialog、Drawer、Alert/message/notification→DivMessage、Spin→Loading、Result→Empty+手写

**通用**：Button（`type`→`status`）、Divider

### 无对应需手写（见 [handwrite-templates.md](references/handwrite-templates.md)）

Layout/Header/Sider/Content、Menu、Avatar、Descriptions、Space、Statistic、Skeleton、Card、List、Typography、Mentions、Comment、Image、Affix、BackTop、Progress

> `Carousel`/`Timeline`/`Transfer`：eview-react 有导出名（`Carousel`/`TimeLine`/`DoubleSelect`）但无 Reference，仍按手写。详见 [component-mapping.md](references/component-mapping.md)。

> `antdComponents` 不含 Layout/Space/Card/Skeleton 时（上游已改写为 H5：`<div>` + CSS 变量），保留已有结构、不套 handwrite 模板；仅 `antdComponents` 中仍有的组件才手写补位。

## eview-react 硬约束（迁移时必须遵守）

1. **导入路径**：`import Button from '@nce/eview-react/Button'`，不是 `import { Button } from 'antd'`
2. **样式**：入口引 `import '@nce/eview-react/styles/aui3_1.css'` + `import '@nce/eview-react/styles/aui3_1_dark.css'`；原始 token 提取到独立 CSS 并存引入（见下方"CSS 样式"）
3. **Provider**：`ConfigProvider` + `IntlProvider`（`messages={componentsLocales[locale]}`）；antd 的 `ConfigProvider locale={zhCN}` 整套删掉——详见 [i18n-migration.md](references/i18n-migration.md)。**IntlProvider 必须在 `main.jsx`，是 `ConfigProvider` 的直接子级**（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；**locale 用 `"zh"` 不是 `"zh-CN"`**（匹配 `componentsLocales` 的 key）；有业务文案时合并 `componentsLocales` + 业务语言包
4. **`<body>` 类名**：加 `class="aui3_1"`，暗色切 `aui3_1_dark`（挂 `<body>`）和 `.dark`（挂 `<html>`）
5. **回调签名**：第一个参数通常是值不是 event（TextField `onChange(value, ...)`、Select `onChange(value, oldValue, text, oldText, event)`）
6. **validator**：返回 `{ result: true, message }`，`result: true` = 通过
7. **API 表里查不到的 props 一律不写**
8. **CSS 不写死色值**：用源项目的 CSS 变量（原始 token）；类名用业务前缀 `app-` 不用 `ev_`
9. **Form 内不允许用 `<div>` 做栅格**：多列布局用 Form 级 `itemCol` 设默认宽度（24 栅格制）；**单项覆盖用 `Form.Item.col`**（不拆 Form、不用 div/Row/Col 包裹）；删掉 antd 的 Row/Col 或 div+CSS grid 包裹
10. **Form `initialValues` 必须传对象**：动态/异步/向导多步场景一律 `initialValues={x || {}}`。传 `undefined` 会让 `submit()` → `onSuccess(values)` 收到**空对象**（"托管没生效、确认页没数据"的根因，已真机确认）。控件自带 `validator` 要在 `submit()` 时跑需 Form 上加 `validateAllChildComponent={true}`（Form rules `required`/`email`/`range` 默认就跑）。详见 [form-migration.md](references/form-migration.md) 顶部"运行时已验证"段
11. **Toggle / Switch 在 Form 内 `data` 必须用布尔值**：`valuePropName="toggled"` 时，`Switch data={[false, true]}`。不要用 `data={['false', 'true']}`（字符串），否则 `toggled` 收到字符串 `'false'`（JS 中为 truthy，`!!'false' === true`），导致开关无法关闭。推荐 `import Switch from '@nce/eview-react/Switch'` 而非 `Toggle`（两者相同，但 Switch 语义更明确）。
12. **相对导入解析**：路径已由 `umd-to-antd-vite` 修正并验证通过（`.umd-conversion.json` 的 `verification.relativeImports=PASS`），步骤 4 **跳过** `check-relative-imports.cjs`。步骤 3 替换组件时新增的 import 不要写 `./src/...`（同级用 `./`、上层用 `../`）；兜底靠步骤 4 的 `npm run dev`——Vite import-analysis 阶段会报残留的 `./src/...`，不能只做 Babel/TypeScript 语法检查。
13. **图标**：迁移期默认复用 scaffold 自定义 `<Icon>` shim（`src/shared/icon.jsx`，运行时 fetch icon-plus，调用点零改动，见 [components/Icon.md](references/components/Icon.md) 渲染方式 A）；eview-react 内置 `Icon name="ict_*"` 已下线不要用；不要用 `@ant-design/icons`；可点击图标用 `IconButton iconName={<IconPlusIc* />} tipText`，不给图标组件挂 onClick；**antd 纯图标按钮（`Button type="text" shape="circle" icon={...}` 无 children）用 `IconButton`，禁止退化为原生 `<button>+<Icon>`**（见 [component-mapping.md](references/component-mapping.md) 图标行）。

## 命名异常速查

> eview-react 部分 API 命名与"正确英文"或 antd 习惯不同（如 `seprator`/`taggledChildren`/`disable`/`status`/`defaultLabel`/`toggled` 等），迁移前必查 [references/naming-quirks.md](references/naming-quirks.md)（含拼写异常、属性名差异、回调签名差异三类共 79 条）

## CSS 样式：保留原始 token

迁移时**保留源项目的 token 体系**，不做变量名替换：源项目 token 提取到独立 CSS，与 eview-react 的 `aui3_1.css` + `aui3_1_dark.css` 并存（两套变量名不冲突，布局/手写 CSS 一行不用改）。入口六处 CSS import（`aui3_1` / `aui3_1_dark` / `base` / `font` / `tokens` / `theme-dark`）已在 scaffold 写好。暗色模式同时切 `<body>` 的 `aui3_1_dark` + `<html>` 的 `.dark`。完整步骤见 [references/css-token-mapping.md](references/css-token-mapping.md)。

## 页面模式迁移

| antd 页面模式 | eview-react 迁移要点 |
|--------------|---------------------|
| **筛选列表页** | `Input.Search`→`SearchInput`+防抖；`Select` 换 `options` 格式；`Table` 换 `dataset`；分页用 Table 自带 `enablePagination` |
| **列表 CRUD** | `Modal`+`Form`→`Dialog`+`Form`；`Modal.confirm()`→`MessageDialog type="confirm"`；`form.validateFields()`→`ref.submit()`→`onSuccess` |
| **多步向导** | `Steps current={i}`→`Steps currentStep={data[i].value}`；每步 Form 用 `ref.submit()`→`onSuccess` 推进（非 Promise） |
| **表单提交页** | `Form onFinish`→`onSuccess`；`rules message` 删掉；Toggle 配 `valuePropName`+`updateTrigger` |
| **侧边详情/编辑** | `Drawer`→`Drawer`（`open`→`visible`）；底部按钮自写；`Descriptions`→手写 KeyValueList |
| **布局骨架** | `Layout`/`Menu`/`Avatar` 全部手写；`Breadcrumb`→`Crumbs`；`Input.Search`→`SearchInput` |

## 前置 skill：umd-to-antd-vite

本 skill 的直接输入是 `umd-to-antd-vite` 的产物（标准 antd Vite 工程 + `.umd-conversion.json` 交接文件），不直接消费 UMD 单 HTML。以下工作已由 `umd-to-antd-vite` 完成，本 skill 跳过：组件扫描（`.umd-conversion.json` 的 `antdComponents`）、token 外置、相对导入修正。本 skill 只做 4 步：步骤 1 `--upgrade` 换骨架、步骤 2 换 Provider、步骤 3 逐组件替换、步骤 4 构建验证。

## 核心问题

从 antd 迁移到 eview-react 时的典型失败模式（每条详情见对应 reference）：

- **API 名称猜错**：`type`→`status`、`placeholder`→`defaultLabel`、`checked`→`toggled` 等；完整对照见 [naming-quirks.md](references/naming-quirks.md)
- **Form 模式不兼容**：`useForm()`+Promise → `useRef`+`onSuccess` 回调，控制流从同步变异步；见 [form-migration.md](references/form-migration.md)
- **组件无对应**：Layout/Menu/Avatar/Descriptions/Result/Space 无直接对应，需手写补位；见 [handwrite-templates.md](references/handwrite-templates.md)
- **CSS token 丢失**：源项目 token 内联在 HTML，迁移到 Vite 后丢失；提取到独立 CSS 与 `aui3_1.css` 并存；见 [css-token-mapping.md](references/css-token-mapping.md)
- **IntlProvider 放错位置**：必须在 `main.jsx` 作为 `ConfigProvider` 直接子级，locale 用 `"zh"` 不是 `"zh-CN"`；见 [i18n-migration.md](references/i18n-migration.md) §4
- **Table render i18n key 不对齐**：`t(cellValue, cellValue)` 取不到带前缀的 key，需 `t("deviceType." + value, value)`；脚本 `scripts/check-i18n-keys.cjs` 自动排查；见 [migration-workflow.md](references/migration-workflow.md) §3.5
- **命名拼写异常**：`seprator`/`taggledChildren`/`disable` 等官方拼错；见 [naming-quirks.md](references/naming-quirks.md)
- **import 路径失效**：scaffold 后 `app.jsx` 在 `src/`，`./src/context.jsx` 须改 `./context.jsx`；脚本 `scripts/check-relative-imports.cjs` 按需排查（见 [§4.1](references/migration-workflow.md)）；步骤 4 默认跳过（路径已由前置 skill 修正）