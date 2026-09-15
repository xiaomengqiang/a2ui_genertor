---
name: eview-react
description: >-
  在"设计稿转代码"管线中承担 HUI Eview React（npm 包 @nce/eview-react，ICT 3.1 风格）页面的
  代码生成与功能逻辑补全：接收 UX-DSL 或组件结构，输出正确导入、props 与回调签名准确、
  含状态声明、事件处理、数据结构、组件联动和异常边界的可运行代码。
  务必在以下场景使用此 Skill：生成 eview-react / HUI React / @nce/eview-react 页面或组件、
  从设计稿或 DSL 转 React 代码且目标组件库是 eview-react、编写包含表单、筛选、按钮、
  输入框、多行文本、搜索框、下拉、多选下拉、可输入下拉、树选择、级联、IP 输入、复选、单选、开关、
  步骤条、页签、文件上传、日期选择、数字微调、滑块、分段选项卡、评分、标签、徽标、分割线、表单容器、
  表格、树表、树、分页、对话框、抽屉、消息提示、提示条、气泡、加载、空态、面包屑、折叠面板、图标等
  eview-react 组件的界面、
  为已有 eview-react 页面补全交互逻辑、
  接入 eview-react 工程（依赖 / Provider / 主题）——即使用户没有明确说"补全逻辑"，
  只要生成的是 eview-react 组件代码，就应当使用此 Skill，保证 props 全部可在官方 API 表中
  查到、回调参数顺序正确、且不是从 antd 等其他组件库猜出来的写法。
---

# HUI Eview React 组件代码生成与逻辑补全 Skill

## 核心问题

AI 生成 eview-react 代码时的典型失败模式：

- **按 antd 习惯猜 API**：`<Button type="primary">`、`<Select><Option>`、`<RadioGroup><Radio>`、`onChange={(e) => e.target.value}` —— 全部不存在或签名不同
- **只有 UI 外壳**：没有 `useState`、没有 `onChange`、按钮没有 `onClick`、列表数据写死
- **工程跑不起来**：缺 `IntlProvider` / `ConfigProvider`、没引 `aui3_1.css`、缺 peer 依赖报 `Element type is invalid`

## 使用方式

### 页面交付默认值（本项目用户偏好）

这组默认值来自用户的页面交付约定，不是 eview-react 官方组件 API 限制；用户明确指定的目标端和设计稿要求优先。

- **默认 PC 端**：未指定目标端时，按桌面浏览器页面设计和实现；仅要求“自适应 / 响应式”时，先按桌面窗口宽度变化处理。只有用户明确要求手机、移动端、H5 或提供明确的移动端设计任务时，才加入移动端适配。
- **桌面布局与交互**：按业务信息密度组织表单、筛选、表格和操作区，支持鼠标与键盘；不默认增加手机导航、触屏专用布局或手机断点。
- **预览与验收**：优先采用用户给出的 PC 设计稿尺寸；未指定时以 1440×900 作为预览基准，必要时检查 1366px 等桌面宽度下的布局。默认交付 PC 截图，检查控件可见、标签对齐、内容不遮挡和键盘操作；不默认安排手机截图与移动端测试。
- **生成提示词保持一致**：为 OpenCode 等工具编写后续提示词时沿用上述约定，不自行追加“适配窄屏 / 手机端”。历史示例中的移动适配不自动变成新页面的需求。

生成任何 eview-react 组件代码时，按以下步骤：

0. **识别项目上下文** —— 先看当前工程是否已接入 eview-react（`package.json` 有 `@nce/eview-react`、入口有 `IntlProvider`）、是否已有 Service / 数据模型 / 状态管理。有就复用并保持风格；没有就先读 [references/patterns/project-setup.md](references/patterns/project-setup.md) 把接入代码一并生成
1. **识别组件类型** —— 确认要生成哪些组件；当前已覆盖 39 个组件 Reference（Button / TextField / TextArea / SearchInput / Select / MultipleSelect / InputSelect / TreeSelect / Cascader / IPInput / Checkbox / Radio / Toggle / Steps / Tab / FileUpload / DatePicker / Spinner / DragInput / SelectCard / Rating / Tag / Badge / Divider / Form / Table / TreeTable / Tree / Paging / Dialog / Drawer / MessageDialog / DivMessage / TipBox / Loading / Empty / Crumbs / Panel / Icon）
2. **读取对应参考文档** —— 已覆盖的读 `references/<组件>.md`；未覆盖的按下方「未覆盖组件的处理」三层判定：组合已覆盖组件 → 照抄工程现有用法 → 手写 HTML/JSX 补位
3. **补全五要素** —— 状态声明、事件逻辑、数据结构、组件联动、异常与边界
4. **用检查清单自检** —— 确保 props 可溯源、签名正确、代码可运行；按目标端完成预览验收，未指定时使用上面的 PC 默认值

## 五要素检查清单

- [ ] **状态声明**：交互涉及的值是否都有 `useState`？受控组件是否 `value` + `onChange` 成对？需要命令式校验的是否有 `useRef`？
- [ ] **事件处理**：`onClick` / `onChange` / `onBlur` 是否都绑了，且**参数顺序与 API 表一致**？
- [ ] **数据结构**：`options` / `data` / 表单值是否定义了 interface，字段名是 `text` / `value` 而不是 `label`？
- [ ] **组件联动**：筛选变化是否触发列表刷新？勾选是否联动按钮？校验是否联动提交？
- [ ] **异常与边界**：异步有 loading / error / empty 三态？按钮防重复？父级切换是否清空子级？

## eview-react 硬约束（必须遵守）

以下每条都对应 eview-react 官方资料中的具体出处（TypeDoc 类型表 / 官网示例文件名，表中"出处"列）；原始资料不随 Skill 打包，出处仅供人工复核。

### 1. 导入路径与工程接入

```tsx
// ✅ 业务工程真实包名，按路径导入
import Button from '@nce/eview-react/Button';
// ✅ 或主包命名导出
import { Button, TextField } from '@nce/eview-react';
// ✅ 入口只引一次样式；根节点 ConfigProvider + IntlProvider（rules/project-setting.md）
import '@nce/eview-react/styles/aui3_1.css';

import Button from 'eview-react/Button';   // ❌ 源码仓内部别名，业务工程解析不到
import { Button } from 'antd';             // ❌ 不是 antd
```

Vite 5 + plugin-react 4 锁版本、peer 依赖全装 —— 详见 project-setup.md。

### 2. 禁止用其他组件库的属性猜 eview-react（rules/component-use.md 查找约束 1）

| 意图 | ❌ antd 写法 | ✅ eview-react 写法 | 出处 |
|------|-------------|-------------------|------|
| 主按钮 | `type="primary"` | `status="primary"` | api/Button_types.md |
| 危险按钮 | `danger` | `status="risk"` | api/Button_types.md |
| 按钮文字 | children only | `text="..."` 或 children | api/Button_types.md |
| 按钮加载 | `loading` | 无此属性；用 `disabled` + 文案切换 | api/Button_types.md（无 loading） |
| 下拉选项 | `<Option>` children / `options=[{label}]` | `options={[{ text, value }]}` | demos/Select/README.md |
| 下拉占位 | `placeholder` | `defaultLabel` | api/Select_Select.md |
| 单选组 | `<Radio>` children | `data={[{ text, value }]}` | rules/component-use.md |
| 复选组 | `<Checkbox>` children | `data={[{ text, value }]}` | api/CheckboxGroup_types.md |
| 输入校验 | `rules` on Input | `validator` / `required` / `TextField.defaultValidator.*` | api/TextField_TextField.md |
| 多行字数统计 | `showCount` / `autoSize` | `maxLength`（自带右下角计数） | api/TextArea_TextArea.md |
| 搜索框 | `Input.Search` / `enterButton` | `SearchInput` + `onSearch`（值变化也会触发，需防抖） | api/SearchInput_type.md |
| 步骤条 | `<Steps current={i}><Step/>` | `data={[{ text, value }]}` + `currentStep={data[i].value}` | demos/Steps/__docs__/API.md |
| 页签 | `items=[...]` / `<TabPane>` / `onChange` | children `<TabItem title>` + 切换回调 **`onClick`**；`draggable` 默认 true 需关 | api/Tab_Tab.md |
| 文件上传 | `action` / `beforeUpload` / `disabled` | `handleSubmit` 里自己发请求 + `updateProgressStatus` / `fileUploadStatus` 回写；禁用是 `disable` | api/FileUpload_FileUpload.md |
| 日期范围 | `DatePicker.RangePicker` / `picker="month"` / `showTime` | 同一个 `DatePicker`：`range={[]}` 开范围、`type="month"` 等、`type="datetime"`；**不要**把 `onChange` 字符串无条件回写 `value`（官方反例） | api/DatePicker_types.md + DatePickerBadExample.jsx |
| 数字输入 | `InputNumber` | `Spinner`（`min/max/step/precision`，`onChange` 只在有效值触发，`onInputError` 接无效值） | api/Spinner_Spinner.md |
| 滑块 | `Slider` / `range` 布尔 / `marks` 对象 | `DragInput`（`value` **永远是数组**，`type="range"`，`markIndexes` 数组） | api/DragInput_DragInput.md |
| 分段选项卡 | `Segmented options=[...]` / `Radio.Button` | `SelectCard data={[{ text, value }]}`（官网页面名 Segmented，导出名 SelectCard；禁用是 `disable`） | api/SelectCard_types.md |
| 评分 | `Rate` + `onChange` | `Rating` + **`onClick(value)`**（没有 onChange） | api/Rating_Rating.md |
| 标签 | `Tag closable onClose` / `color="green"` | `Tag` **没有 closable**；`color` 只认 `default/primary/success/warning/caution/danger`，描边用 `fill="outline"` | api/Tag_types.md |
| 徽标 | `Badge count={n}` | `Badge content={n}`；状态点 `dot status text` | api/Badge_types.md |
| 表单 | `Form.useForm` / `form` / `onFinish` / `rules=[{ message }]` | `ref.submit()` → `onSuccess(values)` / `onFailed`；`Form.Item name` + `rules=[{ required: true }, { range: true, args }]`；Checkbox / Toggle 配 `valuePropName` + `updateTrigger` | api/Form_Form.md + FormFunction.jsx |
| 表格 | `dataSource` / `rowKey` / `columns[].dataIndex` / `pagination` / `rowSelection` | `dataset`（二维数组或对象行）/ `keyIndex` / `columns[].key` / `enablePagination` + `pagingProps` + `onPageChange` / `enableCheckBox` + `onRowCheck` | TableProps.ts + TablePaging.jsx |
| 分页器 | `Pagination total current showSizeChanger` | `Paging recordCount currentPage pageSizeOptions onPageSizeChange` | api/Paging_types.md |
| 对话框 | `Modal open onOk onCancel footer` | `Dialog isOpen onClose buttons={[{ text, status, onClick }]}`（数组）；自己 `setIsOpen(false)` | api/Dialog_types.md + Confirm.tsx |
| 确认 / 提示 | `Modal.confirm()` / `message.success()` | `MessageDialog type buttons={{ ok, cancel }}`（对象），`isOpen` 受控 | api/MessageDialog_types.md + Type.tsx |
| 开关 | `Switch checked onChange checkedChildren` | `Toggle toggled onToggle(value) data=[关, 开] taggledChildren` | api/Toggle_Toggle.md |
| 多选下拉 | `Select mode="multiple"` / `defaultLabel` | `MultipleSelect options value[] onChange(value[], changeValue[]) placeholder` | api/MultipleSelect_MultipleSelect.md |
| 可搜索下拉 | `Select showSearch` / `AutoComplete` | `InputSelect options onlySelect placeholder`（输入只过滤 vs 可自定义值） | api/InputSelect_InputSelect.md |
| 树 | `Tree treeData title/key checkable` | `Tree data=[{ text, id, children }] nodeKey enableCheckbox`；三套 keys 各配回调；`enableMultiSelect` 默认 true | api/Tree_Tree.md |
| 树选择 | `TreeSelect treeCheckable onChange(value)` | `TreeSelect treeData enableCheckbox onChange(selectNode[])`（回传节点对象数组） | api/TreeSelect_TreeSelect.md |
| 级联 | `Cascader value fieldNames` | `Cascader options=[{ label, value, children }] selectedValue`（**唯一用 label 的组件**，值是路径数组） | Cascader __docs__/API.md |
| 树表 | `Table` + `children` 行 | `TreeTable columns[].field dataset=[{ data, children, isLeaf }] expandedKeys onNodeExpand` | api/TreeTable_TreeTable.md |
| 抽屉 | `Drawer open footer` | `Drawer visible onClose(isShowDrawer) placement width`；底部按钮自写；`destroyOnClose` 默认 false | api/Drawer_types.md |
| IP 输入 | `Input` + 正则 | `IPInput type="v4" \| "v6" \| "mac" value onChange(value, event)`（完整字符串） | api/IPInput_IPInput.md |
| 轻提示 | `message.success()` / `Alert` | `DivMessage display type text`（换 key 重挂；默认 10s 自动消失） | api/DivMessage_DivMessage.md |
| 加载 | `Spin spinning` | `Loading isOpen type="global" \| "local" \| "micro"`（local 需父容器 relative；`Loader` 同一组件） | api/Loading_Loading.md |
| 空态 | `Empty image` | `Empty type="success" \| "fail" description`（搜索无结果用 success） | api/Empty_types.md |
| 面包屑 | `Breadcrumb items separator` | `Crumbs data=[{ title, url? }] onClick(data, event) seprator`（拼写照官方） | api/Crumbs_Crumbs.md |
| 折叠面板 | `Collapse items activeKey accordion` | `Panel selectedIndex={[…]} enableMultiExpand` + `PanelItem title closable={false}` | api/Panel_Panel.md |
| 图标 | `@ant-design/icons` | icon+ `@hui/icon-plus` 按需导入，或 `Icon name="ict_xxx"`；可点击用 `IconButton iconName tipText` | api/Icon_Icon.md + IconPlusBasic.jsx |
| 气泡提示 | `Tooltip title placement` | `TipBox content direction trigger` 包裹目标元素（12 方位） | api/TipBox_TipBox.md |

**API 表里查不到的 props 一律不写**（component-use.md 约束 3/4：查不到不推断、不替换）。

### 3. 回调签名：第一个参数通常是值，不是 event

| 组件 | 签名 | 出处 |
|------|------|------|
| `Button.onClick` | `(event, additionalData)` | api/Button_types.md |
| `TextField.onChange` | `(value, oldValue, event)` | api/TextField_TextField.md |
| `TextField.onBlur` | `(event, value)` | api/TextField_TextField.md |
| `Select.onChange` | `(value, oldValue, text, oldText, event)` | api/Select_Select.md |
| `Checkbox.onChange` | `(value, checked, event, additionalData)` | api/Checkbox_types.md |
| `Checkbox.onPreChange` | `(value, checked, event) => boolean`，返回 false 阻止 | api/Checkbox_types.md |
| `CheckboxGroup.onChange` | `(value[], oldValue[], event)` | api/CheckboxGroup_types.md |
| `Radio.onChange` | `(value, event)` | api/Radio_types.md |
| `RadioGroup.onChange` | **类型与描述冲突**（`(oldValue, value)` vs `(value, oldValue)`），按 [Radio.md §4](references/Radio.md) 兼容写法 | api/RadioGroup_types.md |
| `TextArea.onChange` / `onBlur` | `(targetValue, value, event)` / `(event)`（**没有** value 参数） | api/TextArea_TextArea.md |
| `SearchInput.onSearch` / `onChange` / `onBlur` / `onClear` | 都是 `(value)` | api/SearchInput_type.md |
| `SearchInput.onItemClick` | 类型 `(value, obj)`，demo 首参当 obj → 按 [SearchInput.md §4](references/SearchInput.md) 兼容写法 | api/SearchInput_type.md |
| `Steps.onClick` | `(index)`，下标不是 value | demos/Steps/__docs__/API.md |
| `Tab.onClick` / `Tab.onClose` | `(index, title, event)` / `(index, event, title)`（二、三参顺序不同） | api/Tab_Tab.md |
| `FileUpload.handleSubmit` / `onReload` | `({ event, data })`，`data[i].name` / `data[i].data`（File） | api/FileUpload_FileUpload.md |
| `FileUpload.onChange` | `(event, itemList)` | api/FileUpload_FileUpload.md |
| `DatePicker.onChange` | `(dateString, date?, target?, dstDate?)`：第一个是字符串，第二个才是 Date；范围时 `target` 为 `left`/`right` | api/DatePicker_types.md |
| `DatePicker.onOkClick` | `(obj, event, target?)`，`obj.fromDateObj` / `obj.toDateObj`；demo 注明回调里要 `setTimeout` 再 setState | api/DatePicker_types.md + DatePickerUpdate.jsx |
| `Spinner.onChange` / `onInputError` / `onBlur` | 都是 `(value)`；有效值走 onChange，无效值走 onInputError | api/Spinner_Spinner.md |
| `DragInput.onChange` | `(value: number[], changeValue?: number[])`，单滑块也是数组 | api/DragInput_DragInput.md |
| `SelectCard.onChange` | `(value, event)` | api/SelectCard_types.md |
| `Rating.onClick` / `onMouseOver` / `onMouseLeave` | 都是 `(value: number)`；取值用 onClick | api/Rating_Rating.md |
| `Tag.onClick` | `(event)`，无值参数，值自己闭包 | api/Tag_types.md |
| `Form.onSuccess` / `onFailed` / `onValuesChange` | `(values)` / `(errorFields, values)` / `(changedFields, allNewValues, allPrevValues)` | api/Form_Form.md |
| `Table.onRowCheck` / `onHeaderCheck` | `(row, checkedRows, e)` / `(checkedRows, checked, checkedRowsData)`；`checkedRows` 是主键数组（`keyIndex` 列或行号） | TableProps.ts |
| `Table.onColumnSort` / `onPageChange` / `onRowClick` | `(sortColumn, sortType)` / `(currentPage)` / `(row, event)` | TableProps.ts |
| `Paging.onPageChange` / `onPageSizeChange` | `(currentPage)` / `(pageSize)` | api/Paging_types.md |
| `Dialog.onClose` / `MessageDialog.onClose` | `(event)`；不会自动关闭，需 `setIsOpen(false)` | api/Dialog_types.md |
| `Toggle.onToggle` | `(value)`，值取自 `data=[关, 开]` | api/Toggle_Toggle.md |
| `MultipleSelect.onChange` | `(value[], changeValue[], event)`，第一个是全部选中 | api/MultipleSelect_MultipleSelect.md |
| `InputSelect.onChange` | `(value, oldValue)`（描述提及第三参 `type`，未入签名） | api/InputSelect_InputSelect.md |
| `Tree.onSelect` / `onCheck` / `onExpand` | `(keys[], node, …)`，第一个是新的 keys 数组；主键取 `node.props.eventKey` | api/Tree_Tree.md + TreeExample.jsx |
| `TreeSelect.onChange` | `(selectNode: Array<{ value, text }>)`，节点对象数组 | api/TreeSelect_TreeSelect.md |
| `Cascader.onChange` | `(value: 路径数组)`；`multiple` 时为二维数组 | Cascader __docs__/API.md |
| `TreeTable.onNodeExpand` / `onRowCheck` | `(rowId, expandedKeys, expanded)` / `(row, checkedRows, e)` | api/TreeTable_TreeTable.md |
| `Drawer.onClose` | `(isShowDrawer: boolean)`；不会自动关闭 | api/Drawer_types.md |
| `IPInput.onChange` / `onBlur` / `onFocus` | `(value: string, event)` | api/IPInput_IPInput.md |
| `Crumbs.onClick` | `(data, event)`，组件级回调 | api/Crumbs_Crumbs.md |
| `Panel.onExpand` / `onClose` | `(index, event)` / `(index, event, collapsed)`；`collapsed=false` 表示点了移除 | api/Panel_Panel.md |
| `Icon.onClick` / `IconButton.onClick` / `Tag.onClick` | `(event)` | api/Icon_Icon.md |

### 4. 校验：`validator` 返回 `{ result, message }`，`result === true` 表示通过

```tsx
// ✅ demo TextFieldEvent.jsx / selectBasic.tsx 的语义
validator={(value) => ({ result: /^\d+$/.test(value), message: '只能输入数字' })}
// ✅ 内置规则
validator={TextField.defaultValidator.range(1, 65535)}
// ❌ 返回布尔 / 改字段名 / 语义反了
validator={(value) => value.length > 0}
```

`required` 自带非空校验；`hintType: 'div' | 'tip'` 决定提示形式；提交前用 `ref.current.validate()` 统一触发（仅 TextField / Select 的官方 demo 出现过 `getValue / validate / focus / clear`，FileUpload 出现过 `handleSubmit / getValue / getValueEx`，SelectCard / Spinner / DragInput / DatePicker 出现过 `getValue`，MultipleSelect 出现过 `getValue / validate / focus`，Form 出现过 `submit / resetFields / setFieldsValue / getFieldsValue / getFieldValue / getErrors`，Table 出现过 `getCheckedRowsData / getCheckedRowsIndexes / getSelectedRowIndex / setCheckedRows / setRowEditable`，InputSelect 出现过 `getValue / validate / focus / clear`，IPInput 出现过 `getValue`，Tree 出现过 `findLevelNodes`，TreeTable 出现过 `expandAll / collapseAll`；TextArea / SearchInput / Tab / Steps / Rating / Tag / Badge / Divider / Paging / Dialog / MessageDialog / Toggle / TreeSelect / Cascader / Drawer / DivMessage / Loading / Empty / Crumbs / Panel / Icon / TipBox 的 demo 没有 ref 方法，不要假设有）。

### 5. 受控与单向数据流（site-doc/f_&_q.md + 官方 demo）

- React 没有双向绑定：`value` 从 state 来，`onChange` 写回 state，父传子只走 props
- TextField / Select / Checkbox 官方 demo 均为 `value` + `onChange` 受控写法，照抄
- `Radio` / `RadioGroup` 默认非受控，要让 state 驱动显示必须传 `isControlled`
- `type="password"` 的 TextField 要通过 props 清空 / 回填，必须传 `isAllowToModifyPasswordByProps`
- **DatePicker 是例外**：官方反例 `DatePickerBadExample.jsx` 明确反对把 `onChange` 的字符串无条件回写 `value`；用 `defaultValue` + `ref.getValue()`，或受控时只在第二个参数 `date` 有效时回写 Date 对象（见 [DatePicker.md](references/DatePicker.md)）
- `Spinner` 的 `value` 被程序化更新时默认抢焦点，重置 / 联动改值要传 `doNotFocusWhenValueUpdate`
- 在 `Form.Item` 内的控件**不传** `value` / `onChange`，由 Form 按 `name` 托管；非 value/onChange 型控件配 `valuePropName` + `updateTrigger`（Checkbox：`checked` + `updateTriggerIndex={1}`；Toggle：`toggled` + `onToggle`）；`Form.Item` 不要提取成变量（project-setting.md）
- `Dialog` / `MessageDialog` 的 `isOpen`、`Drawer` 的 `visible` 受控但**不会自动关闭**：`onClose` 和按钮 `onClick` 里都要自己置 false，且成功才关、失败保持打开；`Drawer.destroyOnClose` 默认 false，换对象编辑要 `setFieldsValue` 覆盖
- `Tree` 的 `selectedKeys` / `checkedKeys` / `expandedKeys` 三套受控数组必须各配 `onSelect` / `onCheck` / `onExpand` 写回，否则点了没反应；`DivMessage` 自动消失后 `display` 仍为 true，用换 key 重挂

### 6. 编码风格（site-doc/rules.md）

函数组件 + hooks；ES module；`const`/`let`；`===`；每句分号；`handleXxx` 命名事件处理；不留 `console.log`；间距 4px 倍数。

## 常见页面级调用链

生成完整页面时先识别页面模式，按骨架组织跨组件逻辑，再逐组件读 Reference 补细节：

| 页面模式 | 涉及组件 | 调用链骨架 |
|---------|---------|-----------|
| 登录 / 注册页 | TextField + Checkbox + Button | 输入 → `validator` 逐字段校验 → 协议勾选解锁按钮 → 提交 `disabled` 防重复 → 失败提示 |
| 筛选列表页 | SearchInput + Select + Table | 关键字 `onSearch` 防抖 + 版本号 → 筛选变化 → `page=1` → 请求 → `enableLoading` / `emptyTableMsg` → Table 后台分页 + `disableEviewSort` 后台排序 |
| 列表 CRUD 页 | Table + Dialog(Form) + MessageDialog | 操作列 `render` 按钮 → 新建 / 编辑打开 `Dialog`，确定调 `formRef.submit()` → `onSuccess` 请求成功才关窗刷新 → 删除走 `MessageDialog type="confirm"`，`ok.onClick` 成功后关窗 + 刷新 + `success` 反馈 |
| 多步创建向导 | Steps + TextField + Select + Button | `currentStep={data[i].value}` → 每步控件 `ref.validate()` 通过才 `i+1` → 最后一步汇总提交 → 失败步 `status:'error'` 并跳回 |
| 多页签工作区 / 详情页 | Tab + TabItem + Table / Form | `selectedIndex` 受控 → `onClick` 首次进入才请求（`Set` 记录已加载）→ `onClose` 移除数组并修正下标 → 未保存先确认 |
| 附件上传表单 | FileUpload + TextArea + Button | 选文件 → `handleSubmit` 业务发请求 → 按文件名回写进度 / 状态 → `fail` 走 `onReload` 重传 → 全部 `success` 才解锁提交 |
| 时间范围查询条 | DatePicker(range) + SelectCard + Select + Button | 粒度 SelectCard 切换 `type/format` 并清空已选 → 范围 `onOkClick` 取 `fromDateObj/toDateObj` → 合并筛选参数 `page=1` 请求 → 空态 |
| 参数配置表单 | Spinner + DragInput + SelectCard + Checkbox + Button | 开关 Checkbox 控制 `disabled` → Spinner 有效值算派生量 / `onInputError` 锁提交 → DragInput 数组值与输入框互相钳制 → 重置用 `doNotFocusWhenValueUpdate` |
| 状态列表 / 卡片 | Badge + Tag + Divider + Icon | 业务状态码 → 统一映射表 → `Badge status/text` 或 `Tag color` → 筛选 Tag `fill` 切换选中 → 列表过滤 |
| 树 + 列表主从页 | Tree + Table + Crumbs | 左树 `enableMultiSelect={false}` `onSelect` → 右表 `page=1` 按节点请求 → 面包屑随选中路径派生 → 搜索 `findLevelNodes` 展开定位 |
| 侧边详情 / 编辑 | Table + Drawer(Form) + DivMessage | 行操作 → `setCurrent` + `visible=true` → `setFieldsValue` 回填 → 底部自写按钮 `submit()` → 成功关抽屉 + `DivMessage` 反馈 |
| 四态内容区 | Loading + Empty + DivMessage | `loading` 局部遮罩（父容器 relative）→ 成功无数据 `Empty type="success"` / 失败 `type="fail"` + 重试 → 操作结果 `DivMessage` 换 key 重挂 |
| 多选批量操作 | Checkbox + Button | 逐行勾选 → `Set` 计数 → 表头全选 / 半选派生 → 批量按钮解锁 → 确认 → 删除后同步集合 |
| 向导 / 模式切换 | RadioGroup + TextField + Button | `isControlled` 单选 → 条件渲染区块 → 切走清空隐藏字段 → 提交校验 |
| 级联下拉 | Select × 2 | 父级 `onChange` → 清空子级 → 异步加载子级 `options`（带取消标记防串数据） |
| 表单提交页 | Form + Form.Item + TextField / Select / MultipleSelect / Toggle / DatePicker | `initialValues` → `rules` 统一校验 → 按钮 `ref.submit()` → `onSuccess` 提交（防重复）/ `onFailed` 提示 → 编辑回填用 `setFieldsValue` |

## 通用 Pattern 索引

| 场景 | 读取 | 核心产出 |
|------|------|---------|
| 新工程接入 / 报错 `Element type is invalid` / 无样式 / 文案是 key | [references/patterns/project-setup.md](references/patterns/project-setup.md) | `.npmrc` + 依赖版本表 + `main.tsx` 骨架（ConfigProvider + IntlProvider + css）+ 报错对照表 |
| 需要的组件没有 Reference（卡片 / 进度条 / 时间轴 / 轮播 / 穿梭框 / 键值详情 …） | [references/patterns/fallback-handwrite.md](references/patterns/fallback-handwrite.md) | 三层判定流程、组合替代表、组件库 CSS 变量速查（颜色 / 字号 / 圆角 / 高度）、手写模板（卡片 / 键值详情块 / 简单进度条）、必标 TODO 的复杂组件清单 |

## 组件参考索引

生成代码中包含以下组件时，读取对应参考文档获取完整的逻辑规格：

| 当代码中出现... | 读取 | 你将获得 |
|---------------|------|---------|
| `Button` / `ButtonGroup` / 按钮 / 提交 | [references/Button.md](references/Button.md) | `status` 四态、`onClick(event, additionalData)`、无 loading 的处理中表达、单页唯一主按钮、ButtonGroup `data` |
| `TextField` / 输入框 / 密码框 | [references/TextField.md](references/TextField.md) | `onChange(value, oldValue, event)`、`validator` + `defaultValidator.*`、`isCharacterAllowed`、`format="number"`、ref `validate/getValue/focus`、密码 props 回填开关 |
| `Select` / 下拉 / 筛选 | [references/Select.md](references/Select.md) | `options=[{text,value}]`、`defaultLabel`、五参 `onChange`、`enableClear`、`virtualScroll`、级联清空子级、ref `clear` |
| `Checkbox` / `CheckboxGroup` / 复选 / 全选 | [references/Checkbox.md](references/Checkbox.md) | `onChange(value, checked, ...)`、`onPreChange` 拦截、`halfChecked` 表头、`Set` 管理选中集合、Group `data/value/selectAll/rows` |
| `Radio` / `RadioGroup` / 单选 | [references/Radio.md](references/Radio.md) | Group 必须 `data`、`isControlled`、`onChange` 参数顺序冲突的兼容写法、Form.Item 托管、切换清空隐藏字段 |
| `TextArea` / 多行文本 / 描述 / 备注 | [references/TextArea.md](references/TextArea.md) | `onChange(targetValue, ...)`、`onBlur(event)` 无 value、`maxLength` 自带计数、`validator`、无 ref 方法、`inputStyle.resize` |
| `SearchInput` / 搜索框 / 关键字 | [references/SearchInput.md](references/SearchInput.md) | `onSearch` 值变化也触发 → 防抖 + 版本号、`onClear` 恢复全量、`popItems` vs `onSuggest` 互斥、`onItemClick` 顺序冲突兼容写法、`isLoading` |
| `Steps` / 步骤条 / 向导 | [references/Steps.md](references/Steps.md) | `data=[{text,value}]`、`currentStep` 对应 value 不是下标、`onClick(index)` 只允许回跳、`status:'error'` 失败回跳、`labelPlacement` / `direction` |
| `Tab` / `TabItem` / 页签 | [references/Tab.md](references/Tab.md) | children 驱动、切换回调是 `onClick(index, title, event)`、`onClose` 后修正 `selectedIndex`、`draggable={false}`、`type="sub"` 卡片式、按需加载 |
| `FileUpload` / 上传 / 附件 | [references/FileUpload.md](references/FileUpload.md) | 组件不发请求：`handleSubmit` 自己上传 + `updateProgressStatus` / `fileUploadStatus` 按文件名回写、`disable`、`isAcceptValidate`、`onReload` 重传、自动上传 `ref.handleSubmit()` |
| `DatePicker` / 日期 / 时间范围 | [references/DatePicker.md](references/DatePicker.md) | 官方反例：不要无条件回写 `value`；`defaultValue` + `ref.getValue()` 或"有效 Date 才回写"；`range={[]}` + `onOkClick`（要 setTimeout）；`type/format` 配对；`dateRange` 限制；传 Date 不传字符串 |
| `Spinner` / 数字输入 / InputNumber / 微调 | [references/Spinner.md](references/Spinner.md) | `min/max/step/precision`、`onChange` 仅有效值、`onInputError`、失焦自动修正、`rangeArray`、`type="time"`、`doNotFocusWhenValueUpdate` |
| `DragInput` / 滑块 / Slider | [references/DragInput.md](references/DragInput.md) | 导出名 DragInput 不是 Slider；`value` 数组、`type="range"`、`markIndexes`、`unit/labelFormat`、`displayInput`、与 TextField 联动钳制 |
| `SelectCard` / 分段选项卡 / Segmented | [references/SelectCard.md](references/SelectCard.md) | 导出名 SelectCard 不是 Segmented；`data=[{text,value,disable?,tipsText?}]`、`onChange(value, event)`、`type="small"`、`disable`、换 data 后校正 value |
| `Rating` / 评分 / 星级 | [references/Rating.md](references/Rating.md) | 取值是 `onClick(value)` 不是 onChange、`onMouseOver/Leave` 做悬浮预览、`half`、`disabled` 只读、`iconName` 换图标、0 分不可提交 |
| `Tag` / 标签 / 状态 | [references/Tag.md](references/Tag.md) | 无 `closable`（删除靠数组 + onClick）、`color` 六语义色、`fill="outline"` 描边、可点击筛选用 fill 表达选中、`isMessageTag`、自定义 `style` 颜色 |
| `Badge` / 徽标 / 未读数 / 状态点 | [references/Badge.md](references/Badge.md) | `content`（不是 count）、`dot`、`max/showZero`、`status` 五态 + `text` 独立使用、`offset`、状态映射表与 Tag 共用语义 |
| `Divider` / 分割线 | [references/Divider.md](references/Divider.md) | `type="vertical"` 行内竖线、`orientation` 标题位置、`dashed`、与分组 / 权限按钮一起条件渲染 |
| `Form` / `Form.Item` / 表单 | [references/Form.md](references/Form.md) | 2.0 写法 `name + rules` 托管、`ref.submit()` → `onSuccess/onFailed`、`valuePropName/updateTrigger`、`setFieldsValue` 回填、内置规则清单、`Form.Item` 不提取 |
| `Table` / 表格 / 列表 | [references/Table.md](references/Table.md) | `columns/dataset/keyIndex`、后台分页 `pagingProps + onPageChange`、`disableEviewSort + onColumnSort`、`enableCheckBox` 主键数组、`enableLoading/emptyTableMsg`、`render` 操作列、ref 取勾选 |
| `Paging` / 分页器 | [references/Paging.md](references/Paging.md) | `recordCount` 必传、`onPageSizeChange` 后页码归 1、`type="select"` 简单分页、`enablePageJumpTrigger` 拦截、表格场景用 Table 自带分页 |
| `Dialog` / 对话框 / 弹窗表单 | [references/Dialog.md](references/Dialog.md) | `isOpen` 受控不会自动关、`buttons` 数组、Form 在弹窗内 `submit()` 成功才关、`size/position`、`zindex ≤ 9999`、`destroyOnClose` 下用 `setFieldsValue` 回填 |
| `MessageDialog` / 确认框 / 结果提示 | [references/MessageDialog.md](references/MessageDialog.md) | 七种 `type`、`buttons={{ ok, cancel }}` 对象、`ok.onClick` 成功才关、`highRisk + hasChecked` 勾选确认、`detail/detailMessage`、单按钮反馈 |
| `Toggle` / `Switch` / 开关 | [references/Toggle.md](references/Toggle.md) | `toggled + onToggle(value) + data=[关, 开]`、`taggledChildren`（拼写照官方）、行内切换乐观更新 + 失败回滚、`Switch isControlToggled` 二次确认、Form 内 `valuePropName="toggled" updateTrigger="onToggle"` |
| `MultipleSelect` / 多选下拉 | [references/MultipleSelect.md](references/MultipleSelect.md) | `value` 数组、`placeholder`（不是 defaultLabel）、`onChange(value[], changeValue[])`、`selectAll/searchable/enableCloseIcon/displayItems`、选项禁用是 `disabled`、级联清空 |
| `InputSelect` / 可输入下拉 / 搜索选择 | [references/InputSelect.md](references/InputSelect.md) | `onlySelect` 决定输入是否可作值、`options=[{text,value}]`、`placeholder`、`virtualScroll`、ref `getValue/validate/focus/clear` |
| `Tree` / 树 / 组织架构 | [references/Tree.md](references/Tree.md) | `data=[{text,id,children}]` + `nodeKey`、三套 keys 配对回调、`node.props.eventKey`、`enableMultiSelect` 默认 true、`enableCheckbox`、`loadData` 懒加载、`findLevelNodes` 搜索 |
| `TreeSelect` / 树形下拉 | [references/TreeSelect.md](references/TreeSelect.md) | `treeData`、`onChange(selectNode[])` 节点对象数组、`enableCheckbox` 多选、单选关 `enableMultiSelect`、资料薄标待实测 |
| `TreeTable` / 树表 / 层级表格 | [references/TreeTable.md](references/TreeTable.md) | 列用 `field`、行是 `{ data, children, isLeaf }`、`expandedKeys + onNodeExpand`、ref `expandAll/collapseAll`、无分页 |
| `Cascader` / 级联 / 省市区 | [references/Cascader.md](references/Cascader.md) | 选项字段是 **label**（唯一例外）、`selectedValue` 路径数组、`changeOnSelect`、`multiple + multiLimit` |
| `Drawer` / 抽屉 / 侧滑面板 | [references/Drawer.md](references/Drawer.md) | `visible + onClose` 不自动关、`placement/width`、底部按钮自写、`destroyOnClose` 默认 false、`showMask={false}` 对照、`sizeDraggable` |
| `IPInput` / IP / MAC 输入 | [references/IPInput.md](references/IPInput.md) | `type="v4"/"v6"/"mac"`、值是完整字符串、`onChange(value, event)`、`validator`、ref `getValue`、类型切换清空 |
| `DivMessage` / 提示条 / 操作反馈 | [references/DivMessage.md](references/DivMessage.md) | `display` 受控、默认 10s 自动消失、换 key 重挂、错误用 `enableDisposeTimeOut={false}` 常驻、无命令式 API |
| `Loading` / `Loader` / 加载 | [references/Loading.md](references/Loading.md) | `isOpen`、`global/local/micro`、local 需父容器 `position: relative`、`finally` 关、Loader 是同一组件 |
| `Empty` / 空态 / 无数据 | [references/Empty.md](references/Empty.md) | `type="success"`（有请求无数据）vs `"fail"`、`description` 放下一步动作、四态渲染、Table 内用 `emptyTableMsg` |
| `Crumbs` / 面包屑 | [references/Crumbs.md](references/Crumbs.md) | `data=[{title,url?}]` 最后一项无 url、组件级 `onClick(data, event)`、`seprator` 拼写、`countLimit` 折叠、随路由派生 |
| `Panel` / `PanelItem` / 折叠面板 / 分组 | [references/Panel.md](references/Panel.md) | children 驱动、`selectedIndex` 数组、`enableMultiExpand` 手风琴、`closable` 默认 true 要关、`onClose` 的 `collapsed` 区分折叠与移除、校验失败自动展开 |
| `Icon` / `IconButton` / 图标 / icon+ | [references/Icon.md](references/Icon.md) | icon+ `@hui/icon-plus` 按需导入首选、`Icon name` 改色需 `isStandard={false}`、可点击用 `IconButton iconName tipText tipData`、颜色用 CSS 变量 |
| `TipBox` / 气泡 / 悬浮说明 | [references/TipBox.md](references/TipBox.md) | 包裹式写法、`trigger hover/click/focus`、12 方位 `direction`、`type="simple"`、`isMouseLeaveClose/isClosable`、有 children 时 `display` 无效 |

## 未覆盖组件的处理（三层判定，本 Skill 不携带原始资料）

本 Skill 只打包 SKILL.md + `references/`，**没有**随附 eview-react 的 API 表和官方示例。**不要去 `node_modules` 翻类型声明猜 API，不要用 antd 等其他库顶替。** 除上表 39 份 Reference 覆盖的组件外，其余按下面顺序处理，命中即停（细则与手写模板见 [references/patterns/fallback-handwrite.md](references/patterns/fallback-handwrite.md)）：

| 层 | 条件 | 做法 |
|----|------|------|
| **一** | 需求能用已覆盖组件或其组合表达 | 读 Reference 照规格写；优先组合替代（`Badge`/`Tag` 做状态、`SelectCard` 做相对时间、`Tag onClick` 代可关闭标签、`Panel` 代卡片分组） |
| **二** | 目标工程 `src/` 里已经 `import X from '@nce/eview-react/X'` 并在用 | **只照抄工程里出现过的 props / 回调 / 数据结构**，不新增任何未出现过的属性，注释 `// 用法参考：src/…` |
| **三** | 前两层都不命中 | 用原生 HTML / JSX 手写，样式**只用组件库 CSS 变量**（`--colorTextPrimary`、`--colorBorder`、`--borderRadius`、`--commonHeight` 等），类名用业务前缀不用 `ev_`；穿梭框 / 图表 / 轮播 / 时间轴 / 进度条这类复杂组件只做最小可用版，注释 `// TODO(eview-react): 建议替换为 <X>，本 Skill 暂无其规格`，并在最终回复里逐条告知用户 |

补充规则：

1. **组件名只认导出清单**（用于第二层核对工程里的导入是否真实存在）。`@nce/eview-react` 可导入的全部名字（87 个）：
   `Accordion Anchor Badge BrowseButton Button ButtonGroup ButtonMenu Card CardGrid Carousel Cascader CategoryInput CategorySearch Checkbox CheckboxGroup Col ConfigProvider Crumbs DatePicker Dialog Divider DivMessage DoubleSelect DragInput Drawer DropDown Empty FileUpload Form FormMessage GridLayout HelpTip HexField Icon IconButton IconButtonGroup InputSelect IPInput JList LabelField Layout LinkField Loader Loading Menu MessageDialog MultipleSelect PageMessage Paging PagingTree Panel Popup PopUpMenu ProgressBar Radio RadioGroup Rating Row ScrollBar ScrollTable SearchInput Select SelectCard Shade Spinner Split Steps Switch Tab TabItem Table Tag TextArea TextButton TextField TimeLine TimePicker TimeRangeSelector TimescaleAxis TipBox Toggle Tree TreeDataEngine TreeSelect TreeSelector TreeTable Wizards`
   不在清单里的名字（如 `Upload`、`Tabs`、`Input`、`Modal`、`Option`、`Step`）一律不存在；工程里若出现 `Form`，其子项固定写 `Form.Item`。
2. **第二层只抄"跑着的用法"**：类型声明里有的 props 不等于业务里验证过；`node_modules` 不是依据。
3. **第三层的手写不是"临时凑合"**：布局、间距、颜色全部走 CSS 变量与 4px 倍数间距，交互元素用 `<button>`，弹层加 `role="dialog"`；但不去模仿组件库 DOM 结构和 `ev_` 类名"蹭样式"。
4. **每处补位都要汇报**：位置、替代方式、建议后续换用的真实组件，写进最终回复，不能只埋在注释里。

## 反面示例：典型的"死代码"

```tsx
// ❌ AI 常见输出：antd 写法 + 纯 UI 外壳 —— 没有 options / value / onChange / onClick，值进不了 state
import { Button, Select, Input } from 'antd';
<Select placeholder="状态"><Select.Option value="1">在线</Select.Option></Select>
<Input placeholder="名称" />
<Button type="primary">查询</Button>
```

```tsx
// ✅ 补全后：@nce/eview-react 路径导入 + 受控 + 防重复；完整页面写法见 Select.md / TextField.md / Button.md 第 7 节
import Select from '@nce/eview-react/Select';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

const [status, setStatus] = useState<number | null>(null);
const [name, setName] = useState<string>('');
const [loading, setLoading] = useState<boolean>(false);

<Select label="状态" options={[{ text: '在线', value: 1 }, { text: '离线', value: 0 }]} defaultLabel="-请选择-" enableClear value={status} onChange={(value: number) => setStatus(value)} />
<TextField label="名称" placeholder="请输入" value={name} onChange={(value: string) => setName(value)} />
<Button status="primary" text={loading ? '查询中...' : '查询'} disabled={loading} onClick={async () => { if (loading) return; setLoading(true); try { await onSearch({ status, name: name.trim() }); } finally { setLoading(false); } }} />
```
