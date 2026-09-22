---
name: antd-to-eview-react
description: >-
  将基于 antd 的 React 项目迁移到 @nce/eview-react（HUI Eview React，ICT 3.1）的专项 Skill。
  提供组件映射总表、Form 模式转换、未覆盖组件手写模板、CSS token 映射、命名异常速查及五步迁移工作流。
  务必在以下场景使用：将 antd 项目迁移到 eview-react、把 antd 组件改写为 eview-react、
  评估迁移可行性、遇到 Form/Steps/Modal 等模式转换问题、
  需要将 Layout/Menu/Breadcrumb/Avatar/Descriptions 等组件替换为 eview-react 等价实现。
---

# antd → eview-react 迁移 Skill

## 核心问题

从 antd 迁移到 eview-react 时的典型失败模式（每条详情见对应 reference）：

- **API 名称猜错**：`type`→`status`、`placeholder`→`defaultLabel`、`checked`→`toggled` 等；完整对照见 [naming-quirks.md](references/naming-quirks.md)
- **Form 模式不兼容**：`useForm()`+Promise → `useRef`+`onSuccess` 回调，控制流从同步变异步；见 [form-migration.md](references/form-migration.md)
- **组件无对应**：Layout/Menu/Avatar/Descriptions/Result/Space 无直接对应，需手写补位；见 [handwrite-templates.md](references/handwrite-templates.md)
- **CSS token 丢失**：源项目 token 内联在 HTML，迁移到 Vite 后丢失；提取到独立 CSS 与 `aui3_1.css` 并存；见 [css-token-mapping.md](references/css-token-mapping.md)
- **IntlProvider 放错位置**：必须在 `main.jsx` 作为 `ConfigProvider` 直接子级，locale 用 `"zh"` 不是 `"zh-CN"`；见 [i18n-migration.md](references/i18n-migration.md) §4
- **Table render i18n key 不对齐**：`t(cellValue, cellValue)` 取不到带前缀的 key，需 `t("deviceType." + value, value)`；脚本 `scripts/check-i18n-keys.cjs` 自动排查；见 [migration-workflow.md](references/migration-workflow.md) §3.5
- **命名拼写异常**：`seprator`/`taggledChildren`/`disable` 等官方拼错；见 [naming-quirks.md](references/naming-quirks.md)
- **import 路径失效**：scaffold 后 `app.jsx` 在 `src/`，`./src/context.jsx` 须改 `./context.jsx`；脚本 `scripts/check-relative-imports.cjs` 排查；见步骤 5

## 前置条件

1. **网络**：`@nce/eview-react` 及其 peer 依赖托管在华为内网 npm 源（`cmc.centralrepo.rnd.huawei.com`，见 `scaffold/.npmrc`）。步骤 1 执行 `npm install` 前须确认内网/VPN 可达，否则直接停机并提示用户，不要尝试用公网源替代。
2. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可正常解析 `.npmrc` 中的 `@nce` scope。
3. **源项目**：须为 React 项目（非 Vue/Angular）；若为 UMD 单 HTML 工程须先读 [source-project-guidelines.md](references/source-project-guidelines.md) 评估成本。

## 迁移工作流（评估 + 5 步）

> 详细步骤见 [references/migration-workflow.md](references/migration-workflow.md)

| 步骤 | 做什么 | 产出 | 执行方式 |
|------|--------|------|---------|
| **0. 评估** | 扫描 antd 项目用到的组件，对照组件映射总表标注"有对应/无对应需手写" | 组件迁移清单 | 派发 explore 子 agent（[§0.5](references/migration-workflow.md)） |
| **1. 建工程骨架** | 若源项目非 Vite + npm 工程：跑 `init-scaffold.cjs` 拷贝 scaffold 骨架，`npm install` + `npm run dev` 即空壳可跑。详见 [migration-workflow.md](references/migration-workflow.md) 步骤 1 | 可运行的空壳工程 | 主 agent 跑脚本 |
| **2. 换 Provider 与入口** | 移除 antd `ConfigProvider` + `theme.darkAlgorithm`；eview-react 用 `ConfigProvider` + `IntlProvider` + `<body>` 加 `class="aui3_1"`，暗色切 `aui3_1_dark`（挂 `<body>`） | Provider 就绪 | 主 agent |
| **3. 逐组件替换** | 按映射总表替换每个 antd 组件；Form 模式单独按 [form-migration.md](references/form-migration.md) 转换；无对应的按 [handwrite-templates.md](references/handwrite-templates.md) 手写 | 组件代码全部替换 | 按组件类别派发 2-3 个 general 子 agent 并行（[§3.6](references/migration-workflow.md)） |
| **4. 提取 CSS token** | 将源项目内联 token 填入骨架的 `src/styles/tokens.css`、`.dark` 覆盖填入 `src/styles/theme-dark.css`（见 [css-token-mapping.md](references/css-token-mapping.md)），布局 CSS 不改 | 样式跟随主题 | 派发 general 子 agent（可选） |
| **5. 验证** | `npm install` / `npm run dev` 前先跑两个静态检查：相对导入解析（`scripts/check-relative-imports.cjs`）与 i18n 动态 key（`scripts/check-i18n-keys.cjs`，两种调用方式见 [migration-workflow.md](references/migration-workflow.md) §5.1/§5.2）；再做构建与功能验证 | import/i18n/构建/功能通过 | 派发 general 子 agent（[§5.6](references/migration-workflow.md)） |

### scaffold/ 预制骨架（步骤 1 可直接拷贝）

`scaffold/` 是预制的可运行空壳工程，步骤 1 不必逐文件手写，整目录拷贝即可：

```
scaffold/
├── package.json        # 依赖已含 @nce/eview-react / react-intl / horizon peer / lodash 等
├── .npmrc              # 华为内网源（@nce scope）
├── vite.config.js      # Vite + @vitejs/plugin-react
├── index.html          # <body class="ev_no_wcag"> + /src/main.jsx
└── src/
    ├── main.jsx        # ConfigProvider + IntlProvider + 四处 css import（aui3_1 / base / tokens / theme-dark）
    ├── app.jsx         # 空壳 App（根 div class="root"；aui3_1 挂 <body>），步骤 3 往里填 AppShell
    └── styles/
        ├── base.css          # 骨架自带全局重置（ev_no_wcag 焦点轮廓），开箱即用不用改
        ├── tokens.css        # 空壳占位，步骤 4 填原始 :root 变量
        └── theme-dark.css    # 空壳占位，步骤 4 填 .dark 覆盖
```

用法：`node <skill目录>/scripts/init-scaffold.cjs <目标工程根> [项目名] [标题] [--force]`（自动拷贝 scaffold/、改 `package.json` name、改 `index.html` title；目标非空时加 `--force`），然后 `npm install` + `npm run dev`。两条注意事项（app.jsx 导入路径修正、暗色切换 useEffect 迁移）见 [migration-workflow.md](references/migration-workflow.md) §1.3 / §2.2。

> 若源项目是 UMD 单 HTML 工程 / 内联 token CSS / 运行时 fetch 图标，迁移前先读 [source-project-guidelines.md](references/source-project-guidelines.md) 了解这些结构如何影响迁移成本，以及在源项目侧可以做什么来降低成本。

## 组件映射总表

> 完整版含 API 差异详见 [references/component-mapping.md](references/component-mapping.md)；组件完整 API 详见 [references/components/INDEX.md](references/components/INDEX.md) 索引，按需查阅对应组件 .md

### 有直接对应（API 不同，需改 props）

**表单与输入**：Input→TextField、Input.TextArea→TextArea、Input.Search→SearchInput、Input.Password→TextField、InputNumber→Spinner、Select、Select(多选)→MultipleSelect、AutoComplete→InputSelect、Cascader、TreeSelect、Checkbox/Checkbox.Group→CheckboxGroup、Radio/Radio.Group→RadioGroup、Radio.Button→SelectCard、Switch→Toggle、Slider→DragInput、Rate→Rating、DatePicker、RangePicker→DatePicker range、TimePicker→Spinner、Upload→FileUpload、Form/Form.Item

**数据展示**：Table、Tabs/TabPane→Tab/TabItem、Collapse→Panel/PanelItem、Empty、Badge、Tag、Tooltip/Popover→TipBox、Popconfirm→MessageDialog、Breadcrumb→Crumbs

**反馈**：Modal→Dialog、Modal.confirm→MessageDialog、Drawer、Alert/message/notification→DivMessage、Spin→Loading、Result→Empty+手写

**通用**：Button（`type`→`status`）、Divider

### 无对应需手写（见 [handwrite-templates.md](references/handwrite-templates.md)）

Layout/Header/Sider/Content、Menu、Avatar、Descriptions、Space、Statistic、Skeleton、Card、List、Typography、Carousel、Timeline、Transfer、Mentions、Comment、Image、Affix、BackTop

### 图标

`@ant-design/icons` → `@nce/icon-plus` 按需引入；icon+ 名迁移用 icon-plus 接口 `getIconInfo` 按 antd/Lucide 名 keyword 查得（见 [source-project-guidelines.md](references/source-project-guidelines.md) §3.3）；内置 `Icon name="ict_*"` 已下线

## Form 迁移模式（最关键的模式转换）

> 完整示例（向导 / CRUD）见 [references/form-migration.md](references/form-migration.md)

三点核心差异：
1. **获取实例**：`Form.useForm()` → `useRef(null)`；`<Form form={form}>` → `<Form ref={formRef}>`
2. **触发校验**：`await form.validateFields()`（Promise）→ `formRef.current.submit()` 触发 `onSuccess(values)` / `onFailed(errors)` 回调，控制流从同步变异步
3. **多列布局**：Form 自带 24 栅格，`itemCol` 设 Form 级默认宽度，**单项覆盖用 `Form.Item.col`**；Form 内不允许用 div/Row/Col 做栅格

> ⚠️ `initialValues` 必须传对象（`x || {}`）；传 `undefined` 会让 `onSuccess(values)` 收到空对象。控件自带 `validator` 要在 `submit()` 时跑需加 `validateAllChildComponent={true}`。详见 [form-migration.md](references/form-migration.md) 顶部"运行时已验证"段

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
11. **迁移后必须验证相对导入解析**：尤其检查 `src/**/*.jsx` 中是否残留 `./src/...`。这是 Vite import-analysis 阶段才会报的错误，不能只做 Babel/TypeScript 语法检查。

## 命名异常速查

> eview-react 部分 API 命名与"正确英文"或 antd 习惯不同（如 `seprator`/`taggledChildren`/`disable`/`status`/`defaultLabel`/`toggled` 等），迁移前必查 [references/naming-quirks.md](references/naming-quirks.md)（含拼写异常、属性名差异、回调签名差异三类共 79 条）

## CSS 样式：保留原始 token

迁移时**保留源项目的 token 体系**，不做变量名替换：源项目 token 提取到独立 CSS，与 eview-react 的 `aui3_1.css` + `aui3_1_dark.css` 并存（两套变量名不冲突，布局/手写 CSS 一行不用改）。入口四处 CSS import 已在 scaffold 写好。暗色模式同时切 `<body>` 的 `aui3_1_dark` + `<html>` 的 `.dark`。完整步骤见 [references/css-token-mapping.md](references/css-token-mapping.md)。

## 页面模式迁移

| antd 页面模式 | eview-react 迁移要点 |
|--------------|---------------------|
| **筛选列表页** | `Input.Search`→`SearchInput`+防抖；`Select` 换 `options` 格式；`Table` 换 `dataset`/`keyIndex`；分页用 Table 自带 `enablePagination` |
| **列表 CRUD** | `Modal`+`Form`→`Dialog`+`Form`；`Modal.confirm()`→`MessageDialog type="confirm"`；`form.validateFields()`→`ref.submit()`→`onSuccess` |
| **多步向导** | `Steps current={i}`→`Steps currentStep={data[i].value}`；每步 Form 用 `ref.submit()`→`onSuccess` 推进（非 Promise） |
| **表单提交页** | `Form onFinish`→`onSuccess`；`rules message` 删掉；Toggle 配 `valuePropName`+`updateTrigger` |
| **侧边详情/编辑** | `Drawer`→`Drawer`（`open`→`visible`）；底部按钮自写；`Descriptions`→手写 KeyValueList |
| **布局骨架** | `Layout`/`Menu`/`Avatar` 全部手写；`Breadcrumb`→`Crumbs`；`Input.Search`→`SearchInput` |
