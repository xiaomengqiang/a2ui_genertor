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
| **0. 评估** | 读 `.umd-conversion.json` 的 `migrationPlan`（由 `umd-to-antd-vite` 步骤 5 始终生成，含分类 A/B/C + 替换名 + 关键差异 + 涉及文件 + reference 指引）。详见 [migration-workflow.md](references/migration-workflow.md) 步骤 0 | 组件迁移清单 |
| **1. i18n 设置** | 读 `.umd-conversion.json` 的 `i18nScenario`：`wired=true`（scenario A/B）跳过接线（IntlProvider + 业务包合并已由上游步骤 3 完成），只做运行时验证（DatePicker 中文、Portal 不报 MISSING_TRANSLATION）；`wired=false`（scenario C）做 keep i18next vs 迁 react-intl 决策。详见 [i18n-migration.md](references/i18n-migration.md) §3/§4 | i18n 运行时验证通过 |
| **2. 逐组件替换** | 按映射总表替换每个 antd 组件；无对应的按 [handwrite-templates.md](references/handwrite-templates.md) 手写；图标按 §3.0 转 B/C 静态 import（字面量、三元、数据数组动态名 `name={t.icon}`、图标-prop wrapper 组件 `icon` prop 全由 `match-icons.cjs --apply` 自动改写；引入 JSX 的 `.js`→`.jsx` / `.ts`→`.tsx` 自动转换；仅真运行时数据/wrapper 安全闸退方案A shim 兜底，详见 [Icon.md](references/components/Icon.md)）/图表（`@nce/eview-react/Chart`）走预制件复用，只改 import 路径，**所有图表 option 必须显式补 `a2ui: true` + `theme`（暗色派生，源 Chart 封装的注入行为不随包导入自动生效）**。详见 [§3.0–§3.5](references/migration-workflow.md) | 组件代码全部替换 |
| **3. 验证** | `check-relative-imports.cjs` 跳过（路径已由 `umd-to-antd-vite` 修正）。`check-i18n-keys.cjs` 必跑。`npm install`（bash 工具 timeout=30000，超时/失败记 SKIP 不判 FAIL）。详见 [§4.4](references/migration-workflow.md) | i18n 检查通过 |

## 组件映射

> 完整映射（有对应 / 组合替代 / 无对应需手写）含 API 差异、属性拼写异常、回调签名差异见 [component-mapping.md](references/component-mapping.md)；无对应组件的手写模板见 [handwrite-templates.md](references/handwrite-templates.md)；单组件完整 API 见 [components/INDEX.md](references/components/INDEX.md) 索引。

## eview-react 硬约束（迁移时必须遵守）

1. **导入路径**：`import Button from '@nce/eview-react/Button'`，不是 `import { Button } from 'antd'`。**例外——包壳组件**：被包壳组件（清单：`Select`、`TextField`、`InputSelect`、`MultipleSelect`、`SearchInput`、`TextArea`）从 `@/shared/<X>` 导入（scaffold 预置包壳，透明转发 `@nce/eview-react/<X>`，API 不变，props 规则仍按本 skill 映射表/组件文档迁移）；清单本约束维护，新增包壳同步更新
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

## 命名异常速查

> eview-react 部分 API 命名与"正确英文"或 antd 习惯不同（如 `seprator`/`taggledChildren`/`disable`/`status`/`defaultLabel`/`toggled` 等），迁移前必查 [references/component-mapping.md](references/component-mapping.md) 文末「属性拼写异常」+「回调签名差异」两张速查表

## 页面模式迁移

| antd 页面模式 | eview-react 迁移要点 |
|--------------|---------------------|
| **筛选列表页** | `Input.Search`→`SearchInput`+防抖；`Select` 换 `options` 格式；`Table` 换 `dataset`；分页用 Table 自带 `enablePagination` |
| **列表 CRUD** | `Modal`→`Dialog`；`Modal.confirm()`→`MessageDialog type="confirm"` |
| **多步向导** | `Steps current={i}`→`Steps currentStep={data[i].value}` |
| **表单提交页** | 输入组件逐个替换（源项目用 div+输入组件拼合，无 Form 包装）；提交逻辑不变 |
| **侧边详情/编辑** | `Drawer`→`Drawer`（`open`→`visible`）；底部按钮自写；`Descriptions`→手写 KeyValueList |
| **布局骨架** | `Layout`/`Avatar` 全部手写；`Menu`→`Accordion`；`Breadcrumb`→`Crumbs`；`Input.Search`→`SearchInput` |

## 前置 skill：umd-to-antd-vite

以下工作已由 `umd-to-antd-vite` 完成，本 skill 跳过：工程骨架搭建（eview-react scaffold 已就位）、组件扫描（`antdComponents`）、token 外置、相对导入修正、暗色模式转换（antd `theme.darkAlgorithm` → eview 类名切换）、i18n 静态接线（scenario A/B 的 `IntlProvider` + 业务包合并，`i18nScenario.wired=true`；scenario C 留本 skill 步骤 1 决策）、组件分类评估（`migrationPlan`，由上游步骤 5 始终填充，步骤 0 直接读它）。

## 核心问题

从 antd 迁移到 eview-react 时的典型失败模式（每条详情见对应 reference）：

- **API 名称猜错**：`type`→`status`、`placeholder`→`defaultLabel`、`checked`→`toggled` 等；完整对照见 [component-mapping.md](references/component-mapping.md)
- **组件无对应**：Layout/Avatar/Descriptions/Result/Space 无直接对应，需手写补位；见 [handwrite-templates.md](references/handwrite-templates.md)
- **IntlProvider 放错位置**：必须在 `main.jsx` 作为 `ConfigProvider` 直接子级，locale 用 `"zh"` 不是 `"zh-CN"`；见 [i18n-migration.md](references/i18n-migration.md) §4
- **Table render i18n key 不对齐**：`t(cellValue, cellValue)` 取不到带前缀的 key，需 `t("deviceType." + value, value)`；脚本 `scripts/check-i18n-keys.cjs` 自动排查；见 [migration-workflow.md](references/migration-workflow.md) §3.5
- **命名拼写异常**：`seprator`/`taggledChildren`/`disable` 等官方拼错；见 [component-mapping.md](references/component-mapping.md) 文末「属性拼写异常」表
- **import 路径失效**：scaffold 后 `app.jsx` 在 `src/`，`./src/context.jsx` 须改 `./context.jsx`；脚本 `scripts/check-relative-imports.cjs` 按需排查（见 [§4.1](references/migration-workflow.md)）；步骤 4 默认跳过（路径已由前置 skill 修正）
- **`antdIcons:[]` 误判无图标 → 跳过 `match-icons.cjs` → 全落方案A**：`antdIcons` 只统计 `@ant-design/icons` 命名导入，ict-react-coder 产物用自定义 `<Icon name>` 运行时 shim、`antdIcons` 恒 `[]` 但有大量 `<Icon name>` 调用点；**触发条件看 `<Icon name` 站点（`grep -rl "<Icon\b" src/`）不看 `antdIcons`**，`antdIcons: []` 禁止跳过 `match-icons.cjs`；见 [migration-workflow.md](references/migration-workflow.md) §0.1 警告 + §3.0
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
