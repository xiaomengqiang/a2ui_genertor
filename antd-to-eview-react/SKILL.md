---
name: antd-to-eview-react
description: >-
  将基于 antd 的 React 项目迁移到 @nce/eview-react（HUI Eview React，ICT 3.1 风格）的专项 Skill。
  从 antd 开发者视角出发，提供：antd 组件 → eview-react 组件的完整映射总表（含"无对应需手写"标注）、
  Form 模式转换（useForm/validateFields Promise → ref.submit/onSuccess 回调）、
  Layout/Menu/Avatar/Descriptions/Result/Space 等未覆盖组件的手写补位模板、
  CSS 变量体系切换映射、API 命名异常速查（seprator/taggledChildren/disable vs disabled 等）、
  以及五步迁移工作流。务必在以下场景使用此 Skill：将 antd 项目迁移到 eview-react、
  把 antd 组件代码改写为 eview-react、评估 antd 项目的迁移可行性、
  在 antd → eview-react 迁移中遇到 Form/Steps/Modal 等模式转换问题、
  需要将 antd 的 Layout/Menu/Breadcrumb/Avatar/Descriptions 等组件替换为 eview-react 等价实现。
---

# antd → eview-react 迁移 Skill

## 核心问题

从 antd 迁移到 eview-react 时的典型失败模式：

- **API 名称猜错**：`Button type="primary"`（应为 `status="primary"`）、`Select placeholder`（应为 `defaultLabel`）、`Switch checked`（应为 `toggled`）
- **Form 模式不兼容**：antd 的 `Form.useForm()` + `form.validateFields()` 返回 Promise，eview-react 是 `ref.submit()` → `onSuccess(values)` 回调，控制流从同步变异步
- **组件无对应**：Layout、Menu、Avatar、Descriptions、Result、Space 在 eview-react 中无直接对应或无 Reference，需要手写补位
- **CSS token 丢失**：源项目 token 内联在 HTML 里，迁移到 Vite 后 HTML 不能用，token 定义跟着丢。解决方法：提取 token 到独立 CSS 文件，与 eview-react 的 `aui3_1.css` + `aui3_1_dark.css` 并存，布局 CSS 一行不改（见 [css-token-mapping.md](references/css-token-mapping.md)）
- **IntlProvider 放错位置**：源项目的 IntlProvider 在 `app.jsx`/AppShell 里（跟 antd ConfigProvider locale 放一起），迁移时容易原样留在 AppShell。但 eview-react 的 `ConfigProvider` 在 `main.jsx`，弹层（Dialog 等 portal）由 ConfigProvider 管理，**IntlProvider 必须是 ConfigProvider 的直接子级**，否则弹层内容取不到业务文案，报 `MISSING_TRANSLATION`。同时 locale 要用 `"zh"`（不是 `"zh-CN"`），匹配 `componentsLocales` 的 key。详见 [i18n-migration.md](references/i18n-migration.md) §4
- **Table render 的 i18n key 不对齐**：antd 项目的 Table 列 `render` 常用 `t(cellValue, cellValue)` 翻译单元格值，但 `data.js` 里 value 是短代码（`"gateway"`），i18n key 带前缀（`"deviceType.gateway"`），`t("gateway", ...)` 找不到消息报 `MISSING_TRANSLATION`。这个 bug 在 antd 源项目里就存在（antd 的 locale 不走 react-intl 所以没暴露），迁移后 IntlProvider 严格报错。修复：`render: (value) => t("deviceType." + value, value)`。提供自动排查脚本 `scripts/check-i18n-keys.cjs`（交叉比对 t(x,x) 调用与 data.js 的 value≠msgId 字段，用法见 [migration-workflow.md](references/migration-workflow.md) §5.2）。详见 [migration-workflow.md](references/migration-workflow.md) §3.5
- **命名拼写异常**：`seprator`（不是 separator）、`taggledChildren`（不是 toggledChildren）、`disable`（SelectCard 用，不是 disabled）
- **文件位置变化导致 import 路径失效**：UMD/旧工程常见 `app.jsx` 在工程根目录并导入 `./src/context.jsx`；拷贝 scaffold 后 `app.jsx` 位于 `src/app.jsx`，必须改为 `./context.jsx`。迁移后必须跑相对导入解析检查（脚本位于本 skill 的 `scripts/check-relative-imports.cjs`，调用方式见步骤 5），语法检查不能发现这类错误。
- **复杂页顾此失彼**：单 agent 在复杂页上同时背"API命名/样式/逻辑"三关注点，注意力带宽有限必然掉一个——功能对了样式差、样式对了逻辑错。解决：复杂页走多 agent 闭环（按 view 文件拆 N 个并行「页面 agent」+ 1 个「骨架 agent」，客观 L0 门槛 + 独立测试兜底），见下方"页面复杂度判定"与"与编排器对接"。

## 页面复杂度判定与 agent 架构

迁移前先判复杂度，决定走「多 agent 闭环」还是「单遍自检」：

| 复杂度 | 判定（满足任一） | 架构 |
|--------|-----------------|------|
| **复杂页 / 多页应用** | ① ≥3 个独立 view 文件；② 同时含 ≥2 个 C 类模式（Form+Steps / Form+Modal.confirm / 多 Form）；③ C 类 + ≥3 个 B 类手写；④ 向导 / 多步 / CRUD 跨页 | 走多 agent 闭环：顶层 [`build-test-fix-loop`](../build-test-fix-loop/SKILL.md)，生成侧按 view 文件拆 N 个并行「页面 agent」+ 1 个「骨架 agent」，测试侧 [`test-eview-react-product`](../test-eview-react-product/SKILL.md)。失败按 `file:line` 路由回属主 agent。详见下方"与编排器对接" |
| **简单页** | 单一表单 / 单页列表无复杂交互 / view 文件 <3 | 单生成 agent 跑三轨（见"迁移工作流"步骤 3）+ 步骤 5 一次性自检 |

> 复杂页务必走多 agent：单 agent 注意力并行三关注点易掉一个，多 agent 按文件分桶 + 客观 checklist 门槛 + 独立 L2 像素 diff 兜底。

## 迁移工作流（评估 + 5 步）

> 详细步骤见 [references/migration-workflow.md](references/migration-workflow.md)

| 步骤 | 做什么 | 产出 |
|------|--------|------|
| **0. 评估** | 扫描 antd 项目用到的组件，对照组件映射总表标注"有对应/无对应需手写" | 组件迁移清单 |
| **1. 建工程骨架** | 若源项目非 Vite + npm 工程：把 `scaffold/` 整目录拷到目标工程根（改 `package.json` 的 `name`、`index.html` 的 `<title>`），`npm install` + `npm run dev` 即空壳可跑。详见 [migration-workflow.md](references/migration-workflow.md) 步骤 1 | 可运行的空壳工程 |
| **2. 换 Provider 与入口** | 移除 antd `ConfigProvider` + `theme.darkAlgorithm`；eview-react 用 `ConfigProvider` + `IntlProvider` + `<body>` 加 `class="aui3_1"`，暗色切 `aui3_1_dark`（挂 `<body>`） | Provider 就绪 |
| **3. 分轨替换** | 按**关注点**分三遍扫全部文件（不按文件分桶，一个 `.jsx` 三遍都改，每遍只盯一个关注点）：**Pass1 功能骨架**（导入路径+API命名+B类最小可渲染版+Form只搭结构）→ **Pass2 样式保真**（填 tokens/theme-dark+补 B 类样式+暗色双类名）→ **Pass3 逻辑保真**（Form onSuccess/Toggle valuePropName/Modal 受控关闭/回调签名/i18n key 对齐）。每轨末跑 `test-eview-react-product` 的 `checklist.mjs` 自检本轨 L0 子集全绿才进下一轨。详见 [migration-workflow.md](references/migration-workflow.md) §3 | 三轨全绿 |
| **4. 提取 CSS token** | 将源项目内联 token 填入骨架的 `src/styles/tokens.css`、`.dark` 覆盖填入 `src/styles/theme-dark.css`（见 [css-token-mapping.md](references/css-token-mapping.md)），布局 CSS 不改 | 样式跟随主题 |
| **5. 验证** | **简单页**：跑 `check-relative-imports.cjs` + `check-i18n-keys.cjs` + `test-eview-react-product` 的 `checklist.mjs` 38 条 + 构建功能验证。**复杂页**：不在此步自检，已由 `build-test-fix-loop` 闭环覆盖（生成=本 skill 的页面/骨架 agent，测试=`test-eview-react-product`，失败按 file:line 路由回属主 agent 循环修复），见上方"与编排器对接" | 全过 / 闭环收敛 |

### scaffold/ 预制骨架（步骤 1 可直接拷贝）

`scaffold/` 是预制的可运行空壳工程，步骤 1 不必逐文件手写，整目录拷贝即可：

```
scaffold/
├── package.json        # 依赖已含 @nce/eview-react / react-intl / horizon peer / lodash 等
├── .npmrc              # 华为内网源（@nce scope）
├── vite.config.js      # Vite + @vitejs/plugin-react
├── index.html          # <body class="ev_no_wcag"> + /src/main.jsx
└── src/
    ├── main.jsx        # ConfigProvider + IntlProvider + 四处 css import（aui3_1 / base / tokens / theme-dark）
    ├── app.jsx         # 空壳 App（根 div class="root"；aui3_1 挂 <body>，见 index.html），步骤 3 往里填 AppShell
    └── styles/
        ├── base.css          # 骨架自带全局重置（ev_no_wcag 焦点轮廓），开箱即用不用改
        ├── tokens.css        # 空壳占位，步骤 4 填原始 :root 变量
        └── theme-dark.css    # 空壳占位，步骤 4 填 .dark 覆盖
```

用法：`cp -r scaffold/ <目标工程根>`，改 `package.json` 的 `name` 与 `index.html` 的 `<title>`，`npm install` 后 `npm run dev`。空壳能直接渲染（显示 "app root"），步骤 3/4 再往里填内容，`main.jsx` 不用再改。

> 注意：scaffold 的 `app.jsx` 在 `src/app.jsx`。如果源项目根目录也有 `app.jsx` 且导入 `./src/context.jsx`、`./src/views/...`，迁移到 scaffold 后必须改成 `./context.jsx`、`./views/...`。`src/` 内文件一律不应残留 `./src/...` 导入。

> 注意：scaffold 的 `src/app.jsx` 内置了一段暗色切换 `useEffect`（演示用，切换 `aui3_1_dark` + `.dark` 两个类名）。步骤 3 用源项目 AppShell 替换 `app.jsx` 时，务必把这段暗色切换逻辑迁移到新 AppShell 或 `main.jsx`，否则暗色模式切换会失效。完整切换代码见 [css-token-mapping.md](references/css-token-mapping.md) §4。

> 若源项目是 UMD 单 HTML 工程 / 内联 token CSS / 运行时 fetch 图标，迁移前先读 [source-project-guidelines.md](references/source-project-guidelines.md) 了解这些结构如何影响迁移成本，以及在源项目侧可以做什么来降低成本。

## 组件映射总表

> 完整版含 API 差异详见 [references/component-mapping.md](references/component-mapping.md)

### 有直接对应（API 不同，需改 props）

| antd 组件 | eview-react 组件 | 关键差异 |
|-----------|-----------------|---------|
| `Button` (`type="primary"`) | `Button` (`status="primary"`) | `type`→`status`；无 `loading`/`htmlType`；文字用 `text` 或 children |
| `Input` | `TextField` | `onChange` 首参是 value 不是 event；`validator` 返回 `{result,message}` |
| `Input.TextArea` | `TextArea` | 无 `showCount`/`autoSize`；`maxLength` 自带计数；`onBlur` 只有 event |
| `Input.Search` | `SearchInput` | `onSearch` 值变化也触发需防抖；`placeholder` 保留 |
| `Input.Password` | `TextField type="password"` | 需 `isAllowToModifyPasswordByProps` 才能 props 清空 |
| `InputNumber` | `Spinner` | `onChange` 只在有效值触发；`onInputError` 接无效值；重置加 `doNotFocusWhenValueUpdate` |
| `Select` | `Select` | `options` 字段 `label`→`text`；`placeholder`→`defaultLabel`；五参 `onChange` |
| `Select` (多选) | `MultipleSelect` | `mode="multiple"` 删掉；`value` 数组；`onChange(value[],changeValue[])` |
| `AutoComplete` | `InputSelect` | `onlySelect` 决定输入是否可作值 |
| `Cascader` | `Cascader` | 唯一用 `label` 的组件；值是路径数组 |
| `Checkbox` / `.Group` | `Checkbox` / `CheckboxGroup` | Group 用 `data` 不是 children |
| `Radio` / `.Group` | `Radio` / `RadioGroup` | Group 用 `data`；需 `isControlled` 才受控 |
| `Radio.Button` | `SelectCard` | 导出名 SelectCard；`data=[{text,value}]`；禁用是 `disable` |
| `Switch` | `Toggle` | `checked`→`toggled`；`onChange`→`onToggle(value)`；`data=[关,开]` |
| `Slider` | `DragInput` | `value` 永远是数组；`type="range"` 开双滑块 |
| `Rate` | `Rating` | 取值是 `onClick(value)` 不是 onChange |
| `DatePicker` | `DatePicker` | 不要无条件回写 `onChange` 的字符串到 `value`（官方反例） |
| `RangePicker` | `DatePicker range={[]}` | 用 `onOkClick` 取 `fromDateObj/toDateObj` |
| `TimePicker` | `Spinner type="time"` | 值是字符串 `"hh:mm:ss"` |
| `Upload` | `FileUpload` | 组件不发请求；`handleSubmit` 自己上传；`disable` 不是 `disabled` |
| `Form` / `Form.Item` | `Form` / `Form.Item` | **见下方 Form 迁移模式** |
| `Table` | `Table` | `dataSource`→`dataset`；`rowKey`→`keyIndex`；`columns[].dataIndex`→`key` |
| `Tabs` / `TabPane` | `Tab` / `TabItem` | children 驱动；切换回调是 `onClick(index,title,event)` |
| `Modal` | `Dialog` | `open`→`isOpen`；`footer`→`buttons` 数组；不会自动关闭 |
| `Modal.confirm()` | `MessageDialog` | `type` 七种；`buttons={{ok,cancel}}` 对象 |
| `Drawer` | `Drawer` | `open`→`visible`；`onClose(isShowDrawer)` |
| `Alert` | `DivMessage` | `display` 控制；默认 10s 消失；换 key 重挂 |
| `message.success()` | `DivMessage` | 无命令式 API；只能渲染组件 |
| `Spin` | `Loading` | `isOpen`；`type="global"/"local"/"micro"` |
| `Empty` | `Empty` | `type="success"`（成功无数据）vs `"fail"` |
| `Breadcrumb` | `Crumbs` | `data=[{title,url?}]`；`seprator`（拼错）；`onClick(data,event)` |
| `Collapse` | `Panel` / `PanelItem` | `selectedIndex` 数组；`enableMultiExpand` |
| `Tooltip` | `TipBox` | 包裹式；`direction` 12 方位 |
| `Popover` | `TipBox` | `trigger="click"` |
| `Popconfirm` | `MessageDialog type="confirm"` | `buttons={{ok,cancel}}` |
| `Tag` | `Tag` | 无 `closable`；`color` 六语义色；`fill="outline"` |
| `Badge` | `Badge` | `count`→`content` |
| `Divider` | `Divider` | API 基本一致 |
| `Steps` | `Steps` | `current`→`currentStep`（对应 `data[].value`）；`items`→`data=[{text,value}]` |
| `@ant-design/icons` | `@nce/icon-plus` 按需引入 | icon+ 名迁移时用 icon-plus 接口（`getIconInfo`）按 antd/Lucide 名 keyword 查得（见 [source-project-guidelines §3.3](references/source-project-guidelines.md)）；内置 `Icon name="ict_*"` 已下线 |

### 无对应需手写（见 [handwrite-templates.md](references/handwrite-templates.md)）

| antd 组件 | 处置 | 说明 |
|-----------|------|------|
| `Layout` / `Header` / `Sider` / `Content` | 手写 CSS 布局 | eview-react 有 `Layout`/`Col`/`Row` 导出名但无 Reference |
| `Menu` | 手写导航列表 | eview-react 有 `Menu` 导出名但无 Reference |
| `Avatar` | 手写 div 圆形 | 无导出 |
| `Descriptions` | 手写 KeyValueList | 无导出；用 `<dl>/<dt>/<dd>` + CSS 变量 |
| `Result` | `Empty type="success"` + 手写内容 | API 不同 |
| `Space` | flex div + gap | 无导出 |
| `Statistic` | 手写 | 无导出 |
| `Skeleton` | 手写 | 无导出 |
| `Card` | 手写或 `Panel` | 无 Reference；fallback-handwrite 有卡片模板 |
| `List` | 手写或 `Table` | 无导出 |
| `Typography` | 手写标签 | `Typography.Link`→`Button status="text"` |
| `Carousel` | 手写 | 无 Reference（导出名存在但未覆盖） |
| `Timeline` | 手写 | 无 Reference（导出名 `TimeLine` 存在但未覆盖） |
| `Transfer` | 手写 | 无 Reference（导出名 `DoubleSelect` 可能近似） |
| `Mentions` | 手写 | 无导出 |
| `Comment` | 手写 | 无导出 |

## Form 迁移模式（最关键的模式转换）

> 完整示例（向导 / CRUD）见 [references/form-migration.md](references/form-migration.md)

### 核心差异

| 维度 | antd | eview-react |
|------|------|-------------|
| 获取 form 实例 | `const [form] = Form.useForm()` | `const formRef = useRef(null)` |
| 触发校验 | `await form.validateFields()` → Promise | `formRef.current.submit()` → `onSuccess(values)` 回调 |
| 校验失败 | catch / reject | `onFailed(errorFields, values)` 回调 |
| 重置 | `form.resetFields()` | `formRef.current.resetFields()`（相同） |
| 回填 | `form.setFieldsValue(record)` | `formRef.current.setFieldsValue(record)`（相同） |
| 控件值托管 | Form.Item `name` 托管（相同） | Form.Item `name` 托管（相同） |
| Toggle | `valuePropName="checked"` | `valuePropName="toggled" updateTrigger="onToggle"` |
| Checkbox | `valuePropName="checked"` | `valuePropName="checked" updateTriggerIndex={1}` |
| rules message | `rules=[{required:true, message:'必填'}]` | `rules=[{required:true}]`（无 message） |
| 提交按钮 | `htmlType="submit"` 或 `onClick` | `onClick={() => formRef.current.submit()}` |
| 多列布局 | `<Row><Col>` 或 `<div className="grid">` 包裹 | Form 自带 24 栅格：`itemCol`（Form 级统一设置，所有项同等宽度）；**不支持单项覆盖**；Form 内不允许用 div 做栅格 |

### 向导迁移示例（antd → eview-react）

```tsx
// ❌ antd：Promise 链，校验通过后同步推进
const [form] = Form.useForm();
const handleNext = async () => {
    try {
        const values = await form.validateFields();
        setAllValues(prev => ({ ...prev, basic: values }));
        setCurrent(c => c + 1);
    } catch { /* 校验失败 */ }
};

// ✅ eview-react：回调链，submit 触发 onSuccess 后才推进
const formRef = useRef(null);
const handleNext = () => { formRef.current.submit(); };
const handleSuccess = (values) => {
    setAllValues(prev => ({ ...prev, basic: values }));
    setCurrent(c => c + 1);
};
// Form 的 onSuccess={handleSuccess}；onFailed 不推进（停在本步）
```

## eview-react 硬约束（迁移时必须遵守）

1. **导入路径**：`import Button from '@nce/eview-react/Button'`，不是 `import { Button } from 'antd'`
2. **样式**：入口引 `import '@nce/eview-react/styles/aui3_1.css'` + `import '@nce/eview-react/styles/aui3_1_dark.css'`；原始 token 提取到独立 CSS 并存引入（见下方"CSS 样式"）
3. **Provider**：`ConfigProvider` + `IntlProvider`（`messages={componentsLocales[locale]}`）；antd 的 `ConfigProvider locale={zhCN}` 整套删掉——详见 [i18n-migration.md](references/i18n-migration.md)。**IntlProvider 必须在 `main.jsx`，是 `ConfigProvider` 的直接子级**（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；**locale 用 `"zh"` 不是 `"zh-CN"`**（匹配 `componentsLocales` 的 key）；有业务文案时合并 `componentsLocales` + 业务语言包
4. **`<body>` 类名**：加 `class="aui3_1"`，暗色切 `aui3_1_dark`（挂 `<body>`）和 `.dark`（挂 `<html>`）
5. **回调签名**：第一个参数通常是值不是 event（TextField `onChange(value, ...)`、Select `onChange(value, oldValue, text, oldText, event)`）
6. **validator**：返回 `{ result: true, message }`，`result: true` = 通过
7. **API 表里查不到的 props 一律不写**
8. **CSS 不写死色值**：用源项目的 CSS 变量（原始 token）；类名用业务前缀 `app-` 不用 `ev_`
9. **Form 内不允许用 `<div>` 做栅格**：多列布局用 `itemCol`（Form 级统一设置，所有项同等宽度，不支持单项覆盖）；24 栅格制；删掉 antd 的 Row/Col 或 div+CSS grid 包裹
10. **Form `initialValues` 必须传对象**：动态/异步/向导多步场景一律 `initialValues={x || {}}`。传 `undefined` 会让 `submit()` → `onSuccess(values)` 收到**空对象**（"托管没生效、确认页没数据"的根因，已真机确认）。控件自带 `validator` 要在 `submit()` 时跑需 Form 上加 `validateAllChildComponent={true}`（Form rules `required`/`email`/`range` 默认就跑）。详见 [form-migration.md](references/form-migration.md) 顶部"运行时已验证"段
11. **迁移后必须验证相对导入解析**：尤其检查 `src/**/*.jsx` 中是否残留 `./src/...`。这是 Vite import-analysis 阶段才会报的错误，不能只做 Babel/TypeScript 语法检查。

## 命名异常速查

> 完整版见 [references/naming-quirks.md](references/naming-quirks.md)

| antd 写法 | eview-react 正确写法 | 组件 |
|-----------|---------------------|------|
| `separator` | `seprator` | Crumbs |
| `checkedChildren` | `taggledChildren` | Toggle |
| `unCheckedChildren` | `unTaggledChildren` | Toggle |
| `checked` | `toggled` | Toggle |
| `onChange` (Switch) | `onToggle(value)` | Toggle |
| `disabled` (SelectCard) | `disable` | SelectCard |
| `type="primary"` | `status="primary"` | Button |
| `placeholder` (Select) | `defaultLabel` | Select |
| `label` (options) | `text` | Select/SelectCard/RadioGroup/CheckboxGroup |
| `count` (Badge) | `content` | Badge |
| `closable` (Tag) | 无（靠数组+onClick 删） | Tag |
| `current` (Steps) | `currentStep`（对应 `data[].value`） | Steps |
| `open` (Modal) | `isOpen` | Dialog/MessageDialog |
| `open` (Drawer) | `visible` | Drawer |
| `loading` (Button) | 无（用 `disabled`+文案切换） | Button |
| `loading` (Spin) | `isOpen` | Loading |
| `<Row><Col>`（Form 内） | `itemCol` | Form 自带 24 栅格，Form 级统一设置所有项同等宽度；不能用 div/Row/Col 包裹 |

## CSS 样式：保留原始 token

迁移时**保留源项目的 token 体系**，不做变量名替换。源项目自带 token 定义提取到独立 CSS 文件，与 eview-react 的 `aui3_1.css` 并存。两套变量名不冲突（`--surface` ≠ `--colorBackground`），布局/手写 CSS 一行不用改。

> 完整操作步骤见 [references/css-token-mapping.md](references/css-token-mapping.md)

入口的四处 CSS import（`aui3_1.css` + `aui3_1_dark.css` + `base.css`+ `tokens.css` + `theme-dark.css`）已在 `scaffold/src/main.jsx` 写好，拷贝骨架后不用改；步骤 4 只往 `tokens.css` / `theme-dark.css` 填内容。

暗色模式同时切两处：`<body>` 追加 `aui3_1_dark`、`<html>` 加 `.dark`。**`aui3_1_dark` 必须挂 `<body>`**（不能只挂 `.root`）——eview-react 的弹层（Dialog/Select 下拉/TipBox 等）通过传送门挂到 `<body>` 下，只有 `<body>` 上有 `aui3_1` / `aui3_1_dark` 弹层才能继承变量、跟随主题。完整切换代码见 [css-token-mapping.md](references/css-token-mapping.md) §4。

通用规则：
- 不写死色值（如 `#191919`），用 CSS 变量（源项目的原始 token）
- 类名用业务前缀（`app-`），不用 `ev_`（组件库内部前缀）
- 可点击元素用 `<button type="button">`，不用 `<div onClick>`

## 页面模式迁移

| antd 页面模式 | eview-react 迁移要点 |
|--------------|---------------------|
| **筛选列表页** | `Input.Search`→`SearchInput`+防抖；`Select` 换 `options` 格式；`Table` 换 `dataset`/`keyIndex`；分页用 Table 自带 `enablePagination` |
| **列表 CRUD** | `Modal`+`Form`→`Dialog`+`Form`；`Modal.confirm()`→`MessageDialog type="confirm"`；`form.validateFields()`→`ref.submit()`→`onSuccess` |
| **多步向导** | `Steps current={i}`→`Steps currentStep={data[i].value}`；每步 Form 用 `ref.submit()`→`onSuccess` 推进（非 Promise） |
| **表单提交页** | `Form onFinish`→`onSuccess`；`rules message` 删掉；Toggle 配 `valuePropName`+`updateTrigger` |
| **侧边详情/编辑** | `Drawer`→`Drawer`（`open`→`visible`）；底部按钮自写；`Descriptions`→手写 KeyValueList |
| **布局骨架** | `Layout`/`Menu`/`Avatar` 全部手写；`Breadcrumb`→`Crumbs`；`Input.Search`→`SearchInput` |

## 与编排器对接（复杂页走多 agent）

复杂页 / 多页应用由 [`build-test-fix-loop`](../build-test-fix-loop/SKILL.md) 编排，本 skill 作为生成侧，有两种角色：

### 角色 A：骨架 agent（Phase 0，1 个）

职责 = 步骤 0-2 + 全局 CSS + 冻结契约：

- 步骤 0 评估 + 复杂度判定（确认 ≥3 独立 view → 走多 agent）
- 步骤 1 拷 scaffold
- 步骤 2 main.jsx（ConfigProvider/IntlProvider/4 处 CSS import）+ app.jsx 空壳 + index.html（`body class="ev_no_wcag aui3_1"`）
- 步骤 4（全局）填 `tokens.css` / `theme-dark.css`
- **冻结契约**：`data.js` / `context.jsx` / i18n keys / CSS 变量名，作为只读快照交给各页面 agent
- **拥有文件**：`main.jsx` / `app.jsx` / `index.html` / `context.jsx` / `data.js` / `styles/*.css` / `AppShell.jsx`（路由壳）

### 角色 B：页面 agent（Phase 1，N 个并行）

每个 agent 认领一个 `src/views/<X>.jsx` + 其私有子组件/样式，**全责跑三轨**：

- 收到：view 文件路径 + 私有子组件/样式目录 + 冻结契约快照（只读）+ 三轨说明 + 每轨 L0 子集门槛
- **禁碰**：`main.jsx` / `app.jsx` / `context.jsx` / `data.js` / `styles/*.css` / `AppShell.jsx`（全局文件，归骨架）
- 全责三轨（同"迁移工作流"步骤 3 的 Pass1/2/3），每轨末跑 `checklist.mjs` 自检本轨子集（只看自己 view 文件相关的失败）
- 需新 i18n key / 新共享组件 → **不自行加**，标 `// TODO_CONTRACT: 需新增 i18n key "xx.yy"`，由编排器收齐交骨架 agent 统一补

### 失败路由（Phase 3）

`test-eview-react-product` 的 failures 带 `file:line`（`checklist.mjs` 输出 `{file, line, text}`），编排器按 file 归属路由：

- file 属某 view → 续接该 page agent 的 `GEN_ID` 修
- file 属全局（main/app/context/data/styles）→ 续接骨架 agent 的 `GEN_ID` 修
- 只传该 agent 相关的 failures 子集，不串扰其他 agent

> 轮次预算：Phase 0 骨架 1 轮；Phase 1 页面并行各 1 轮；Phase 2-3 整体循环默认 5 轮（全局预算，非每页 5 轮，否则成本爆炸）。