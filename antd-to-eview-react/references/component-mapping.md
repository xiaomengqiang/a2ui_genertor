# 组件映射总表（antd → eview-react）

> 本表覆盖 antd 常用组件到 eview-react 的完整映射。每行标注：有对应 / 组合替代 / 无对应需手写。
> eview-react 组件的完整 API 详见本 skill 的 `references/components/<组件>.md`。

## 通用

| antd | eview-react | 关键 API 差异 |
|------|-----------|-------------|
| `Button type="primary"` | `Button status="primary"` | `type`→`status`（default/primary/risk/text）；无 `loading`/`htmlType`/`danger`；文字用 `text` 或 children；处理中用 `disabled`+文案切换 |
| `Button danger` | `Button status="risk"` | 同上 |
| `Button type="text" shape="circle" icon={<Icon/>}`（无 children，纯图标按钮） | `IconButton iconName tipText` | antd `shape="circle"`/`type="text"`+`icon`+无 children 是纯图标按钮信号；**不要**退化为原生 `<button>+<Icon>`；`onClick`→`onClick`、antd 的 `message.success` 提示文案移到 `tipText` |
| `Button icon={...}`（有文字 children） | `Button leftIcon` / `rightIcon` | 仅当有文字 children 时；无 children 的纯图标按钮走 IconButton（见上行） |
| `Space` | flex div + `gap` | 无对应组件；用 `<div style={{ display:'flex', gap:'0.75rem' }}>` |
| `Typography.Link` | `Button status="text"` | 或手写 `<a>` |
| `Typography.Title` | 手写 `<h1>`~`<h6>` | 用 `--fontSizeLarge` / `--titleFontSize` 变量 |
| `Typography.Text` | 手写 `<span>` | 用源项目 CSS 变量 |
| `Divider` | `Divider` | API 基本一致；`type="vertical"` 行内竖线 |

## 表单与输入

| antd | eview-react | 关键 API 差异 |
|------|-----------|-------------|
| `Form` / `Form.Item` | `Form` / `Form.Item` | `useForm()`→`useRef`；`validateFields()` Promise→`submit()`+`onSuccess` 回调；多列用 `itemCol` 设 Form 级默认，**单项覆盖用 `Form.Item.col`**；Form 内不能用 div/Row/Col 做栅格；详见 [form-migration.md](form-migration.md) |
| `Row` / `Col`（Form 内用） | 删掉（用 `itemCol` / `Form.Item.col`） | eview-react Form 自带 24 栅格，`itemCol` 设默认宽度，**单项可用 `Form.Item.col` 覆盖** |
| `Input` | `TextField` | `onChange(value, oldValue, event)` 首参是值；`validator` 返回 `{result,message}`；`required` 自带星号；无 `allowClear`/`prefix`/`rules`/`onPressEnter` |
| `Input.TextArea` | `TextArea` | `onChange(targetValue, value, event)`；`onBlur(event)` 无 value；`maxLength` 自带右下角计数（替代 `showCount`）；无 `autoSize`/`allowClear`；无 ref 方法 |
| `Input.Search` | `SearchInput` | `onSearch` 值变化也触发（需防抖）；`onClear(value)`；`placeholder` 保留；`onSuggest` vs `popItems` 互斥 |
| `Input.Password` | `TextField type="password"` | 需 `isAllowToModifyPasswordByProps` 才能 props 清空/回填；`autoComplete="off"` |
| `InputNumber` | `Spinner` | `onChange(value)` 只在有效值触发；`onInputError(value)` 接无效值；重置加 `doNotFocusWhenValueUpdate`；`min/max/step/precision` |
| `Mentions` | 手写 | 无对应 |
| `Select` | `Select` | `options` 字段 `label`→`text`；`placeholder`→`defaultLabel`；`onChange(value, oldValue, text, oldText, event)` 五参；`enableClear`；`virtualScroll` >100 项 |
| `Select mode="multiple"` | `MultipleSelect` | 删 `mode`；`value` 数组；`onChange(value[], changeValue[], event)`；`placeholder`（不是 defaultLabel）；`selectAll`/`searchable` |
| `Select showSearch` | `InputSelect` | `onlySelect` 决定输入是否可作值；`options=[{text,value}]` |
| `AutoComplete` | `InputSelect` | 同上 |
| `Cascader` | `Cascader` | **唯一用 `label`**（不是 text）；`selectedValue` 路径数组；`changeOnSelect`；`multiple + multiLimit` |
| `TreeSelect` | `TreeSelect` | `treeData`；`onChange(selectNode[])` 节点对象数组；`enableCheckbox` |
| `Checkbox` | `Checkbox` | `onChange(value, checked, event, additionalData)`；`onPreChange` 拦截 |
| `Checkbox.Group` | `CheckboxGroup` | `data=[{text,value}]`；`value[]`；`selectAll`；`rows` |
| `Radio` / `.Group` | `Radio` / `RadioGroup` | Group 用 `data=[{text,value}]`；需 `isControlled` 才受控；`onChange` 参数顺序有冲突，用兼容写法 |
| `Radio.Button` | `SelectCard` | 导出名 SelectCard（不是 Segmented）；`data=[{text,value}]`；`onChange(value,event)`；禁用是 `disable`（不是 disabled） |
| `Switch` | `Toggle` | `checked`→`toggled`；`onChange`→`onToggle(value)`；`data=[关,开]`；`taggledChildren`（拼错）；`Switch isControlToggled` 二次确认 |
| `Slider` | `DragInput` | `value` **永远是数组**；`type="range"` 开双滑块；`markIndexes` 数组；导出名是 DragInput 不是 Slider |
| `Rate` | `Rating` | 取值是 `onClick(value)` 不是 onChange；`onMouseOver/Leave` 悬浮预览；`half`；`disabled` 只读 |
| `DatePicker` | `DatePicker` | **不要无条件回写** `onChange` 的字符串到 `value`（官方反例）；用 `defaultValue`+`ref.getValue()` 或有效 Date 才回写 |
| `DatePicker.RangePicker` | `DatePicker range={[]}` | `onOkClick` 取 `fromDateObj/toDateObj`；回调里要 `setTimeout` 再 setState |
| `TimePicker` | `Spinner type="time"` | 值是字符串 `"hh:mm:ss"`；`timeFormat` |
| `Upload` | `FileUpload` | 组件不发请求；`handleSubmit({event,data})` 自己发；`updateProgressStatus`/`fileUploadStatus` 回写；`disable`（不是 disabled）；`onReload` 重传 |
| `Form.List` | 手写 | 无对应；用数组 state + `map` 渲染 |

## 数据展示

| antd | eview-react | 关键 API 差异 |
|------|-----------|-------------|
| `Table` | `Table` | `dataSource`→`dataset`；`rowKey`→`keyIndex`；`columns[].dataIndex`→`key`；`columns[].fixed: 'left'/'right'`→列 `freezeCol: true` + 表 `freezeColPosition`（取值待实测确认，见 [Table.md](components/Table.md) §9）；`pagination`→`enablePagination`+`pagingProps`+`onPageChange`；`rowSelection`→`enableCheckBox`+`onRowCheck`；`emptyText`→`emptyTableMsg`；**render 函数保留——行对象取第 4 参 `row`（不是第 2 参 `rowData`，见 [Table.md](components/Table.md) 顶部）；并需检查 i18n key 对齐**（见 [migration-workflow.md](migration-workflow.md) §3.5） |
| `Tabs` / `TabPane` | `Tab` / `TabItem` | children 驱动（`<TabItem title>`）；切换回调是 `onClick(index,title,event)`（不是 `onChange`）；`draggable` 默认 true 需关；`items` 不存在 |
| `Collapse` / `Panel` | `Panel` / `PanelItem` | `selectedIndex` 数组；`enableMultiExpand` 手风琴；`closable` 默认 true 要关 |
| `List` | 手写或 `Table` | 无导出 |
| `Descriptions` | 手写 KeyValueList | 无导出；见 [handwrite-templates.md](handwrite-templates.md) §3 |
| `Empty` | `Empty` | `type="success"`（成功无数据）/ `"fail"`（失败）；`description` 可放按钮 |
| `Statistic` | 手写 | 无导出；见 [handwrite-templates.md](handwrite-templates.md) §7 |
| `Skeleton` | 手写 | 无导出 |
| `Avatar` | 手写 | 无导出；见 [handwrite-templates.md](handwrite-templates.md) §2 |
| `Badge` | `Badge` | `count`→`content`；`dot`；`status` 五态+`text`；`max`/`showZero` |
| `Tag` | `Tag` | **无 `closable`**（删除靠数组+onClick）；`color` 六语义色（default/primary/success/warning/caution/danger）；`fill="outline"` 描边 |
| `Tooltip` | `TipBox` | 包裹式（`<TipBox content><目标/></TipBox>`）；`direction` 12 方位；`trigger="hover"/"click"/"focus"` |
| `Popover` | `TipBox` | `trigger="click"`；`content` 自定义 |
| `Popconfirm` | `MessageDialog type="confirm"` | `buttons={{ok,cancel}}` 对象；`isOpen` 受控 |
| `Image` | 手写 | 无 Reference |
| `Carousel` | 手写 | 导出名存在但无 Reference |
| `Card` | 手写或 `Panel` | 见 [handwrite-templates.md](handwrite-templates.md) §1 |
| `Timeline` | 手写 | 导出名 `TimeLine` 存在但无 Reference |
| `Comment` | 手写 | 无导出 |
| `Transfer` | 手写 | 导出名 `DoubleSelect` 可能近似，无 Reference |

## 反馈

| antd | eview-react | 关键 API 差异 |
|------|-----------|-------------|
| `Modal` | `Dialog` | `open`→`isOpen`；`footer`→`buttons=[{text,status,onClick}]` 数组；`onClose` 不会自动关闭（需自己 `setIsOpen(false)`）；`size`/`position` |
| `Modal.confirm()` | `MessageDialog` | 七种 `type`；`buttons={{ok,cancel}}` 对象；`isOpen` 受控；`highRisk+hasChecked` 勾选确认 |
| `Drawer` | `Drawer` | `open`→`visible`；`onClose(isShowDrawer)` 不会自动关闭；`placement`/`width`；`destroyOnClose` 默认 false；底部按钮自写 |
| `Alert` | `DivMessage` | `display` 控制（不是 visible）；默认 10s 消失；换 key 重挂；错误用 `enableDisposeTimeOut={false}` 常驻；type 只有 default/success/error/warn |
| `message.success()` | `DivMessage` | **无命令式 API**；只能渲染 `<DivMessage display type="success">` |
| `notification` | `DivMessage` | 同上 |
| `Spin` | `Loading` | `isOpen`；`type="global"/"local"/"micro"`；local 需父容器 `position:relative`；`Loader` 是同一组件 |
| `Result` | `Empty type="success"` + 手写 | `description` 放标题+副标题+按钮 |

## 布局与导航

| antd | eview-react | 关键 API 差异 |
|------|-----------|-------------|
| `Layout` / `Header` / `Sider` / `Content` | 手写 CSS 布局 | 见 [handwrite-templates.md](handwrite-templates.md) §4 |
| `Menu` | 手写导航列表 | 见 [handwrite-templates.md](handwrite-templates.md) §5 |
| `Breadcrumb` | `Crumbs` | `data=[{title,url?}]`；最后一项无 url；`seprator`（拼错）；`onClick(data,event)` 组件级 |
| `Affix` | 手写 `position:sticky` | 无对应 |
| `BackTop` | 手写 | 无对应 |
| `Row` / `Col` | 手写 flex/grid | eview-react 有 `Row`/`Col` 导出名但无 Reference |
| `Steps` | `Steps` | `current`→`currentStep`（对应 `data[].value` 不是下标）；`items`→`data=[{text,value}]`；`onClick(index)` 只允许回跳 |

## 图标

| antd | eview-react | 关键差异 |
|------|-----------|---------|
| `@ant-design/icons` | `@nce/icon-plus` 按需引入 | `import { IconPlusIcPublicSearch } from '@nce/icon-plus'`；`type="filled"` 换风格；`iconColor` 换色（支持 CSS 变量）；`iconSize` 只能取 12/14/16/20/24/32/36/40/48/60；icon+ 名迁移时用 icon-plus 接口（`getIconInfo`）按 antd/Lucide 名 keyword 查得（见 [source-project-guidelines §3.3](source-project-guidelines.md)） |
| 可点击图标 | `IconButton` | `iconName={<IconPlusIc* />}`+`tipText`；不要给图标组件挂 onClick |

> 迁移期默认复用 scaffold 自定义 `<Icon>` shim（`<Icon name="...">` 调用点零改动，只改 import 路径，见 [source-project-guidelines §3.2](source-project-guidelines.md)）；上表 icon+ 静态 import 为可选目标范式（§3.3），非迁移必做。
