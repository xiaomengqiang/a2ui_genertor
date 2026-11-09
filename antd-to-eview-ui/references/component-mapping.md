# 组件映射总表（antd → eview-ui）

> 本表覆盖 antd 常用组件到 eview-ui（ICT eview-ui，aui3 规范）的完整映射。每行标注：有对应 / 组合替代 / 无对应需手写。
> 文末另附**属性拼写异常**（eview-ui 官方拼错的属性名）、**回调签名差异**（首参是值不是 event / 参数顺序反直觉）和**显隐 prop 速查**（eview-ui 各组件显隐 prop 名不统一，是最高频迁移错误）三张速查表。
> eview-ui 组件的完整 API 详见本 skill 的 `references/components/<组件>.md`。
> 本 skill 的坑标注基于官方文档推导，非实测——**第一版未经真实工程校准，标注「需实测」的条目在首次迁移时必须验证**。

## 导入规范（全表统一）

```jsx
import Button from '@cloudsop/eview-ui/Button';        // 默认形态：子路径默认导入
```

> ⚠ **真实包名是 `@cloudsop/eview-ui`（scoped，`^7.1.37`）**——本 skill 的 `references/components/*.md` 官方文档示例里写的 `import X from 'eview-ui/X'` 是**简写形态**，迁移写代码时必须补 `@cloudsop/` 前缀（裸 `eview-ui` 解析必失败，`check-imports.cjs` 的 EVUI_UNSCOPED_IMPORT 拦截）。

特例（仅以下 4 个不走默认形态）：

| 组件 | 导入写法 |
|------|---------|
| `Tab` | `import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`（TabItem 具名导出） |
| `Panel` | `import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**必须解构**，默认导出不是 Panel 本身） |
| `GridLayout` | `import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`（Row/Col 具名导出） |
| `RangePicker` | `import DatePicker from '@cloudsop/eview-ui/DatePicker'; const { RangePicker } = DatePicker;`（RangePicker 是 DatePicker 的静态属性，**包内有导出**——`<DatePicker.RangePicker>` 改为解构后的 `<RangePicker>` 即可） |

## 通用

| antd | eview-ui | 关键 API 差异 |
|------|----------|-------------|
| `Button`（纯文字） | `Button` | 文字用 `text` prop（**不用 children**，文档 API 只有 text）；`type`→`status`（`default`/`primary`/`risk`）；`size` 三档是 `small`/``normal``/`large`（**antd `middle`→`normal`**）；无 `loading`/`htmlType`/`danger`（`danger`→`status="risk"`）；处理中用 `disabled`+文案切换；`onClick(event)` 原生事件（同 antd） |
| `Button icon={<Icon/>}`（带图标） | `Button` + children 组合 | **不要迁 `leftIcon`/`rightIcon`**——eview-ui 的 leftIcon/rightIcon 接收**图标 url 字符串**，不是 ReactNode，与保留的 `<Icon>` shim 类型不匹配。改用 children：`<Button onClick={...}><Icon name="x" size={14}/>{文字}</Button>`（Button 底层是原生 button，children 可渲染）；纯文字部分仍优先 `text` prop，带图标时文字跟在 Icon 后 |
| `Button type="text"` | `TextButton` | `text` prop + `onClick(event)`；或手写 `<a>` |
| `Typography.Link` | `LinkField` | `href`/`target`/`underline`/`title`；**文字用 `children`**（`text` 即将废弃）；`disabled`；`onClick(event)` 原生事件；显隐 `display`（默认 true）；`Typography.Link` 的 `ellipsis`/`copyable` 无对应 |
| `Button.Group` | `ButtonGroup` | **data 数组驱动**：`data=[{text, onClick, ...Button props}]`（不是 children） |
| `Dropdown.Button` | `ButtonMenu` | `text` + `options=[{text, value, iconUrl?, disable?}]` + `onClick(value, event)` |
| `Space` | 手写 flex div + `gap` | **无对应**（`Split` 是可拖拽分栏容器，不是间距容器，勿用）；`<div style={{ display:'flex', gap:'0.75rem' }}>` |
| `Typography.*` | 手写 | `<h1>`~`<h6>`/`<span>` + 源项目 CSS 变量 |
| `Divider` | 手写 | **无页面级对应**（仅 `Menu.Divider` 是菜单内分割线）；手写 `<div>` + border |
| `ConfigProvider`（antd） | `ConfigProvider`（eview-ui） | 见 SKILL.md 硬约束 3：`locale="zh"`、`version="aui3"`、`theme="lightday"/"evening"` |

## 表单与输入

> **源项目（ict-coder 产物）表单用 div+输入组件拼合，无 Form/Form.Item**——FormPro 仅在源项目真用了 antd Form 时才迁（见「表单容器」小节）。输入组件普遍有 `label`/`labelPosition` 内嵌名称 prop（相当于 antd Form.Item label），**迁移时保持源项目的 div 拼合结构，不用 label prop 重排布局**（避免视觉漂移）。

| antd | eview-ui | 关键 API 差异 |
|------|----------|-------------|
| `Input` | `TextField` | `placeholder` 同名保留；**`onChange(value1, value2, event)`**（新值/旧值/事件，**首参是值**）；无 `prefix`/`suffix`/`addonBefore`/`addonAfter`（手写外层 div 组合）；`type` 仅 `text`/`password`（数字输入用 `format="number"`）；`validator(value, id, type) => {result, message}`；无 `size`/`defaultValue`（默认值转初始 `value` state）；ref：`getValue()`/`validate()`/`focus()` |
| `Input.Password` | `TextField type="password"` | 加 `autoComplete="off"`（文档警告 BM 场景必传） |
| `Input.TextArea` | `TextArea` | `onChange(value1, value2, event)`；`maxLength` 自带右下角计数（替代 `showCount`）；无 `autoSize`（用 `rows`/`cols`）；无 `allowClear` |
| `Input.Search` | `SearchInput` | **`onSearch(value)` 触发时机比 antd 宽**——点图标/回车/**文本值变化时均触发**，必须加防抖或只在回车分支处理；`onChange(value)`（仅值）；`onClear(value)`；`maxLength`→**`maxLengthInput`**；下拉建议 `popItems=[{text,value}]` 与 `onSuggest` **互斥不能同设**；`labelPosition="after"` 布局文档明言不正确，勿用 |
| `InputNumber` | `Spinner` | `value` **默认 0**（antd 无默认，空态需注意）；**`onChange(value)` 仅有效值触发 + `onError(value)` 接无效值**（两路分流）；`onBlur(value)` **参数是值不是事件**；`min`/`max`/`step`/`precision` 同名；无 `controls`/`formatter` 字符串形态（有 `formatter` 函数） |
| `Select` | `SelectPro`（**唯一——旧 Select 弃用**） | **受控组件**（value 唯一数据源）；基础下拉 `mode='single'`（默认可省）；`options` 项 `label`→**`text`**（`{text, value, disabled?}`）；**`placeholder` 同名保留**（旧 Select 才是 defaultLabel——本 skill 不用旧 Select）；**`onChange(value, options)` 两参**（options 是选中项对象/数组——antd `labelInValue` 的替代）；`defaultValue` 仅 mount 生效一次——antd defaultValue 转**初始 `value` state** 更稳（**必须设默认选中值**，无默认时取 `options[0].value`）；`notFoundContent`→`emptyOptionsMsg`；无 `allowClear`；性能：options ≤500、`isVirtualScroll` ≤1W 条 |
| `Select mode="multiple"` | `MultipleSelect` | 删 `mode`；`options=[{text, value}]`；`value` 数组；**`onChange(value[], changeValue[], event)`**；`placeholder` 同名保留；`searchable`（= showSearch）；`selectAll`；`getValue()`；性能：options ≤500（也可用 SelectPro `mode='multiple'`，本表主映射 MultipleSelect） |
| `Select showSearch` | `SelectPro mode="singleSearch"` | 同上 + **`onInputChange(value, e)` 搜索时必填**（antd `onSearch` 逻辑迁入）；搜索过滤后仍只能选列表项；输入值可作选中值的场景（AutoComplete）用 `InputSelect` |
| `AutoComplete` | `InputSelect` | `options=[{text, value}]`；**`onChange(value, oldValue)`**（两参）；**无 placeholder prop**（需外层处理）；`onInputEnter(e, value)`；`enablHorzScroll` 拼写注意 |
| `Cascader` | 手写 | **无对应**（`CategoryInput` 是「下拉+输入框」组合不是级联选择）；见 [handwrite-templates.md](handwrite-templates.md) §2 |
| `Checkbox` | `Checkbox` | `label` prop（= antd children）；**`onChange(value, checked, event, additionalData)` 四参**（首参是 value 不是 event）；`indeterminate`→`halfChecked`；`labelPosition` 默认 `after`（文本在右，与 antd 一致，勿改） |
| `Checkbox.Group` | `CheckboxGroup` | **`data`（不是 options）**，项 `{value, text, checked?, tipText?}`；`value[]`；`onChange(newValue[], oldValue[], event)`；`selectAll` 是**对象** `{text, checked, onChange}`；`rows` 多行排布如 `"0:1 \| 2:4"`；接口有拼写错 `validtor`（数量校验 `{minSelect, maxSelect}`） |
| `Radio` | `Radio` | `label` prop（= children）；`onChange(value, event)`（首参是值）；`labelPosition` 默认 `after` |
| `Radio.Group` | `RadioGroup` | **`data=[{value, text, disabled?}]`**（不是 options）；`onChange(value, oldValue, event)`（带 oldValue）；无 `buttonStyle`（Radio.Button 场景转 SelectCard）；无 `optionType` |
| `Radio.Button` / `Segmented` | `SelectCard` | `data=[{value, text}]`；`onChange(value, event)`（首参即选中值）；`defaultValue`→初始 `value` state（**`value=null` 时取消所有选择**）；`size`→`type`（`default`/`small`，值域不同）；禁用是 **`disable`**（不是 disabled，拼写异常表）；仅适合 ≤7 项的单行展示（文档警告）；`block` 无对应（宽度走 style） |
| `Switch` | `Toggle` | `checked`→**`toggled`**；`onChange`→**`onToggle(value)`**；`data=[关值, 开值]`（值集合，顺序=关闭/开启）；`disabled` 正确拼写保留；无 `loading`/`size`；文档推荐设置 data 默认值 |
| `Slider` | `DragInput` | **`value` 永远是数组**：`type="single"` 默认 `[min]`、`type="range"` 默认 `[min, min]`；`marks` 对象→**`markIndexes` 纯数字数组（要求递增）**；`onChange(value, changeValue)`；`range`→`type="range"`；**无 `disabled` prop**（需要时外层禁用处理）；`displayInput` 默认 true 显示输入框 |
| `Rate` | `Rating` | `count`→**`starCount`**；`allowHalf`→`half`；**`onChange`→`onClick(event, value)`（event 在前！且事件名是 onClick 不是 onChange）**；`allowClear` 默认 **false**（antd 默认 true）；`character`→`iconName`（字符串）；无 `tooltips` |
| `DatePicker` | `DatePicker` | `picker`→**`type`**（`date`/`datetime`/`year`/`month`/`week`）；`value` 接受 Date/string/number；`placeholder` 同名；**`disabledDate` 回调→`range=[start, end]` 值数组**（静态范围，动态禁用逻辑需业务前置过滤）；`format` 支持数组（多格式匹配、展示第一个）；`showTime`→`type="datetime"`（可选 `ampm`）；`rules=[{validator, message, required}]`；**无 getValue()**（新版用 value+onChange 维护）；ref：`focus/blur/validate/clearValidation` |
| `DatePicker.RangePicker` | `RangePicker`（解构） | `import DatePicker from '@cloudsop/eview-ui/DatePicker'; const { RangePicker } = DatePicker;`；`value=[Date, Date]` 数组；`placeholder=['开始日期','结束日期']` 数组；可选范围同用 `range`；**JSX 标签 `<DatePicker.RangePicker>` 改为 `<RangePicker>`**（成员访问形式改解构变量） |
| `TimePicker` | `TimePicker` | **`value`→`time` 数字数组** `[时, 分, 秒]`（antd 是 dayjs 对象，**必须转数组**）；`onChange(time: number[])` 回传数字数组；`format` 小写 `'hh:mm:ss'`/`'hh:mm'`/`'mm:ss'`；12 小时制 `use12HrClock`（不是 format 里写 a）；**无 RangePicker**（范围用 `TimeRangeSelector`——但标注在开发中，建议两个 TimePicker 手动组合）；`label` 类 props 已废弃；`display` prop 传入布尔值后将完全由 props 控制显隐（勿轻易传） |
| `Upload` | `FileUpload` | **组件不发请求**——`handleSubmit({event, data})` 业务自己发；`fileList` 受控；`maxFileCount` 默认 10；**`disable`（不是 disabled）**、**`placeHolder`（大写 H）**、**`upLoadErrorMessage`/`upLoadSuccessMessage`**（upLoad 拼写）；上传状态回写 `fileUploadStatus={文件名: 'loading'/'fail'/'success'}` + 进度 `updateProgressStatus={文件名: '百分比'}`；`onReload` 重传；ref：`getValue`/`getValueEx`/`setFileList` |
| `Mentions` | 手写 | 无对应 |
| `ColorPicker` | `ColorPicker` | `onChange`→**`onColorChange(color)`**；value '#rrggbb' 字符串 |

### 表单容器（仅源项目真用了 antd Form 时）

| antd | eview-ui | 关键 API 差异 |
|------|----------|-------------|
| `Form` / `Form.Item` | `FormPro` / `FormItem` | **不要迁到 `Form`**——eview-ui `Form` 是原生 `<form>` 包装（action/method，无校验；**有 Pro 版，Form 不使用**）；`FormPro` 才有完整体系：`initialValues` 同名；`onFinish`→**`onSuccess(values)`**、`onFinishFailed`→**`onFailed(errors, values)`**；**Rule 是扁平字段**（`required/integer/float/email/url/alpha/ipv4/ipv6/min/max/minLength/maxLength/pattern/equalTo` + `custom: (value, name?) => Promise`）——**不是 antd 的 `{required, message, validator}` 数组形态**，message 走 `validateMessages`；FormInstance：`validateFields()`/`getFieldValue`/`setFieldsValue`/`resetFields`/`getErrors`（经 `useForm` 或 ref）；`validateErrorType='div'/'tip'/'none'` |
| `Form` layout 布局 | `GridLayout`（Row/Col） | `Row totalCols`（默认 24）+ `Col cols`（= span）/`offset`；`gutter`→`colMargin`（CSS margin 写法）；**无响应式断点**（无 xs/sm/md）；配合 `eui_form_ctrl` 类受 Form 控制布局 |

## 数据展示

| antd | eview-ui | 关键 API 差异 |
|------|----------|-------------|
| `Table` | `TablePro`（**唯一——旧 Table 弃用**） | API 同构度高：`rowKey`（默认 'key'）/`columns[].dataIndex`/`render(text, record, pageIndex, index)`/`sorter`/`fixed`（left/right，IE 无效）均保留 antd 形态；`dataSource`→**`dataset`**；`pagination` 对象（**设 `false` 不分页**，否则传 Paging props + `recordCount`）；`rowSelection`→**`selection` 对象**（`type:'checkbox'/'radio'`/`selectedRowKeys`/`onChange(selectedRowKeys, selectedRows)`/`onSelect`）；`onChange(currentDataset, changeEvent)`（分页/排序/筛选变化）；`expandable`→**`expansion` 对象**（`expandedRowRender`/`childrenColumnName` 默认 'children'）；**`columnResizable` 默认 true**（列宽拖拽，antd 默认无——不需要要显式 false）；排序词 `ascend`/`descend` 与 antd 一致（`sortOrderList=['ascend','descend']`）；`disabelCheckAssociated` 拼写注意（父子勾选关联）；斑马纹 `enableZebraCrossing` 默认 false（同 antd）；**旧 Table 的单元格编辑（`setRowEditable`）/ScrollTable/VirtualizedTable 场景不再走旧 Table**——查 TablePro 对应能力，无则手写；树表用独立组件 `TreeTable`（非旧 Table） |
| `Tabs` / `TabPane` | `Tab` / `TabItem` | **TabItem children 驱动**（`<Tab><TabItem title>内容</TabItem></Tab>`，**无 data/items prop**）；`activeKey`→**`selectedIndex`（数字下标，不是 key！）**——key→index 需映射；**切换回调是 `onClick(index, title, event)`（不是 onChange）**；`onClose(index, event, title)`；**`draggable` 默认 true**（不需要要显式 false）；TabItem：`title`/`closable`/`disabled`/`icon`（url 字符串）；`tabBarExtraContent` 无对应（手写）；**遍历生成 TabItem 时数据源必须判空兜底**（`(tabs || []).map(...)`）；`lazyLoad` 激活时才加载 |
| `Collapse` / `Panel` | `Panel` / `PanelItem` | **解构导入**：`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`；`items=[{key,label,children}]`→children `<PanelItem title>`；`defaultActiveKey`/`activeKey`（key）→**`selectedIndex`（下标数组，按顺序做 key→index 映射）**；`accordion`→**`enableMultiExpand={false}`（语义取反**：antd accordion=true 即手风琴 = eview enableMultiExpand=false）；`onChange(key)`→`onExpand(selectedIndex, event)`/`onClose(index, event, collapsed)`；`destroyInactivePanel`→PanelItem `keepAlive`（取反）；`closable` 默认 true；**PanelItem `expanded` 是单项非受控初始态**，受控展开一律走 Panel 的 `selectedIndex` |
| `Tree` | `Tree` | `treeData`→**`data`**；节点 `title`→**`text`**、`key`→**`id`**（主键字段名 `nodeKey` 默认 'id'，**不是 fieldNames**）；`checkable`→**`enableCheckbox`**（默认 false，勾选需显式开）；**`enableMultiSelect` 默认 true**——单选树必须显式 `enableMultiSelect={false}`；回调：`onSelect(selectedKeys, node, event)`/`onCheck(checkedKeys, node)`（首参是 keys 数组）/`onExpand(expandedKeys, node)`（**必须接**，只传 expandedKeys 不接回调点箭头展开不了）；`loadData` 异步加载（`isLeaf` 显箭头）；父子勾选关联 `disabelCheckAssociated`（拼写）；`showLine` 仅 3.1；`expandedKeys`/`selectedKeys`/`checkedKeys` 受控同名保留 |
| `TreeSelect` | `TreeSelect` | **组合式**：`treeProps`（**必传**，Tree 的 props 全部下钻）+ `selectBoxProps`（**不允许传 ref**）；无 treeData/value 一等 prop——antd `treeData`→`treeProps.data`、`onChange`→`treeProps.onCheck`（勾选模式）或 `treeProps.onSelect`；`treeNodeLabelProp` 无对应（用 `tagRenderer` 自定义显示） |
| `Transfer` | `DoubleSelect` | **双数组直传**（不是 dataSource/targetKeys 模式）：`items`（左）+ `selectedItems`（右），项 `{text, isMovable}`；`onMoveToRight(data)`/`onMoveToLeft(data)`；`filterable`（仅 list 型）；`itemOrderChanger` 右侧排序；快捷键 Ctrl+方向移动；ref：`getLeftItems`/`getRightItems`；性能：items ≤200 |
| `Tag` | `Tag` | `type="message"/"dot"/"status"`（antd 无此分型，默认 message）；`color` 枚举 `default/primary/success/warning/danger/caution` + hex（**仅 status/dot 类型生效**）；`closable`→message 型有 `onClose(e)`；**`disable`（不是 disabled，仅 message 型）**；**仅 ICT 3.1 风格**；`CheckableTag`→`selected` prop + `onClick` |
| `Tooltip` | `Tooltip` | **`title`→`content`**（ReactNode）；`placement` 同名 12 值；`trigger` 同名；`visible`/`onVisibleChange` 受控；`open`→`visible`；`arrowPointAtCenter` 同名；`getPopupContainer` 同名；`mouseEnterDelay`/`mouseLeaveDelay` 单位 **ms（antd 是秒，数值需 ×1000）**；`destroyTooltipOnHide` 同名 |
| `Popover` | `Tooltip` | `trigger="click"` + `content` 自定义；`Tooltip` 包裹式（`<Tooltip content trigger="click"><目标/></Tooltip>`）；`Tooltip.destroyAll()` |
| `Popconfirm` | `PopConfirm` | `title` 同名；`description`→**`content`**；`onConfirm`/`onCancel` 同名；`icon`→`type`（7 枚举同 MessageDialog）；`okText`/`cancelText`→按钮模式 `confirmButton`/`cancelButton` 对象 `{text, status}` 或文本模式 `confirmText`/`cancelText`（`mode="text"`）；**仅 ICT 3.1 风格**；placement 12 值 |
| `Badge` | 手写 | **无对应**；见 [handwrite-templates.md](handwrite-templates.md) §4 |
| `Empty` | 手写 | **无对应**；见 [handwrite-templates.md](handwrite-templates.md) §5 |
| `Descriptions` | `LabelField` + `GridLayout` 组合 | 轻量键值：`LabelField text`（+`required` 显星号）；多列用 Row/Col 排布；复杂态见 [handwrite-templates.md](handwrite-templates.md) §3 |
| `Statistic` | 手写 | 无对应；见 [handwrite-templates.md](handwrite-templates.md) §6 |
| `Skeleton` | 手写 | 无对应（迁移时源项目一般已用 loading 态，直接 Loader） |
| `Avatar` | 手写 | 无对应；见 [handwrite-templates.md](handwrite-templates.md) §7 |
| `List` | `JList`（可选列表）或手写 | `JList` 是**可选列表控件**（有选中态）不是纯展示列表——纯展示 antd List 手写 div 循环；`items=[{text, isEnable?}]`；`selectedIndex` 下标数组；`onClick(event, item, index)`；**`mutiSelectEnable` 拼写**（control+click 多选）；文档明言选中值不自动暴露，需 onClick 里主动 `getSelectedItemsIndex()` 回写 state |
| `Card` | `Card` | `type="resource"/"detail"/"add"`；`title` 同名（不传不显示）；`icon` 是 url 字符串；`content=[{text, value}]` 数组（卡片正文键值）；`menuData` 右上菜单（`onMenuItemClick`）；antd `extra`/`actions` 无对应（手写 children）；复杂卡片手写 div 更稳 |
| `Carousel` | `Carousel` | `autoplay` 同名；`autoplaySpeed`→**`autoplayInterval`**（默认 3000）；`dots`/`beforeChange`/`afterChange` 无对应；`easing`→`transformTime`；**文档标注 [Under Development]，慎用（需实测）** |
| `Timeline` | `TimeLine` | **导出名大写 L（TimeLine 不是 Timeline）**；`items`→**`data=[{title, date, icon?, iconType?, content}]`**；`iconType: 'success'/'error'/'default'`（= antd color 三态）；`dot`→`icon`（url）；自定义内容 `render(content)`（**data 项级 render 函数**）；**第一条数据的 iconType 是内置固定的不受控制**（文档警告） |
| `Progress` | `ProgressBar` | `percent`→**`current`**；`max` 默认 100；`showInfo`→`format="percent"`（或 `"steps"` 步骤型）；`strokeColor`→`barStyle`；`size` 无对应；`formatter(value, precision, format) => string` |
| `Image` | 手写 `<img>` | 无对应 |

## 反馈

| antd | eview-ui | 关键 API 差异 |
|------|----------|-------------|
| `Modal` | `DialogPro`（**唯一——旧 Dialog 弃用**） | `open`→**`isOpen`**；**无 `buttons` prop——footer 自写**：children 底部排 `<Button text="确定" status="primary" onClick={...}/>` + 取消按钮，关闭自理（**`onClose(event)` 不自动关闭**，必须 `setIsOpen(false)`）；`title`→**`customHeader`**（ReactNode）；`content`→children；`width/height`→**`size=[宽, 高]`**（支持 rem，**建议偶数**）；**模态必须居中**（AUI 规范——不传 position）；`destroyOnClose` 默认 **true**（antd false——依赖保留 DOM 状态时显式 false）；`minSize=[504,400]`；`focusOnClose`/`isNeedFocusOnOpen` 聚焦管理；无最小化；`resizable` 默认 false 不建议开 |
| `Modal.confirm()` 等静态 | `MessageDialogPro`（**唯一——旧 MessageDialog 弃用**） | **受控形态**：`type` **必填** 7 枚举（highRisk/risk/error/info/warn/confirm/success）+ `isOpen` + **`buttons={ok: {…ButtonProps}, cancel: {…}}` 对象** + `onClose` 手动关 + `children` 优先于 `content`；**命令式**：`MessageDialogPro.confirm(config)` 等静态方法（≈ antd Modal.confirm，返回引用 `update`/`destroy`，`destroyAll()` 清场）；**函数式调用脱离 ConfigProvider context**（取不到 context/redux；3.1+ 必须传 `version`）——命令式弹窗优先受控形态；`hasChecked` 仅 risk/highRisk；`autoFocusButton` 默认 'ok'；`keepTopPosition` 尺寸变化保持顶部 |
| `Drawer` | `Drawer` | antd v5 `open`→**`visible`**（回到 v4 拼写）；`placement` 同名（top/right/bottom/left）；`onClose(event)` **不自动关闭**（CloseEvent `{type:'ok'/'cancel'/'mask'}` 可区分来源）；`width` 默认 **'20rem'**（最小 4rem）；`title`/`footer` 支持 **`false`**（显式无）；遮罩 `maskSetting={disable, onClickClose, show}`；`inContainer` 挂父容器 |
| `Alert` | `DivMessage` | `message`→**`text`**；`type`（`default`/`success`/`error`/`warn`，3.1 另有 `risk`/`highRisk`）；**`display` 显隐（不是 visible/isOpen）**；`closable` 默认 true；`disposeTimeOut`（**默认 0 = 不自动隐藏**；TimeOut 大写 O 拼写）；`description`→`detail`? 无——内容全走 `text`（any 类型） |
| `message.success()` | `DivMessage`（受控渲染） | **无命令式 API**；只能渲染 `<DivMessage display type="success" text>`；换 key 重挂触发重新计时；或用 `MessageDialogPro.success(config)` 静态（但脱离 context）；**DivMessage 渲染在父组件渲染树中会引发输入组件失焦**（通知浮层抽离独立组件 + 自己的 state） |
| `notification` | `PageMessage` | 页面公告条（**无 display/onClose/closable**，由父级条件渲染控制）；`type` 分版本枚举（3.1: info/warn/success/error/risk/highRisk）；`text`；`icon` 16×16（DivMessage 是 24×24） |
| `Spin` | `Loader` | `spinning`→**`isOpen`**；`tip`→**`desc`**；`type="global"/"local"/"micro"`（全屏遮罩/容器内/行内——antd 无此分层：全屏用 global，包内容器用 local **需父容器 position:relative**，小 spinner 用 micro）；`fullscreen`→type="global" |
| `Result` | 手写 | 无对应；`DivMessage type` + 手写标题/按钮 |
| `Popconfirm 之外的气泡确认` | — | 见上表 PopConfirm |

## 布局与导航

| antd | eview-ui | 关键 API 差异 |
|------|----------|-------------|
| `Layout`/`Header`/`Sider`/`Content` | `Layout` 或手写 | eview-ui `Layout` 仅三种形态：`type="full"/"horizontal"/"vertical"` + `leftPanel`/`rightPanel`（element）+ children 主区；**antd Layout 复合结构（Header+ Sider + Content 嵌套）无一一对应**——简单左右/上下分栏用 Layout，复杂骨架手写 CSS（固定侧栏 + flex 主区，见 [handwrite-templates.md](handwrite-templates.md) §1）；固定栏目传 `className="eui_layout_fix"` + 显式宽高 |
| `Menu`（侧边导航，items 数组） | `Accordion`（**主映射**） | `items`→**`data=[{title, value, icon?, children?}]`**（`label`→`title`、`key`→`value`、`icon` 是 url 字符串——**保留 `<Icon>` shim 时 icon 字段不用**，图标走 customRender? 无——图标省略）；`selectedKeys`→**`selectedValue`（单 string）**；`onClick({key})`→**`onClick(node)`**（node 是 data 项原始对象，取 `node.value`）；`openKeys`→`defaultOpenKeys`；`mode="inline"` 收起态→`expanded`/`onExpand(flag)`；`enableMultiOpen`（嵌套菜单多开，默认 false）；`forceShowTip='title'` 溢出提示；单层平铺菜单：`data` 无 children + `enableExpand={false}` |
| `Menu`（需 checkbox 多选/精确同构） | `Menu`（备选） | **children 驱动**（`Menu.Item`/`Menu.SubMenu`/`Menu.Divider`，无 items prop——antd v5 items 数组必须转 JSX）；`mode`（**现只有 vertical 实现**）；**`selectable` 默认 false——必须显式 `selectable={true}`**（antd 默认可选中）；`selectedKeys`/`openKeys`/`defaultOpenKeys`/`multiple` 同名；`onOpenChange`→**`onOpenKeysChange(openKeys)`**；`onClick/onSelect(event: ClickItemEvent)`（event 包装，取 key 方式见 [Menu.md](components/Menu.md) 事件行为表）；`triggerSubMenuAction` 默认 **'hover'**（antd 默认 click，行为差异见 Menu.md §事件行为）；`selectable` 只在 true 时 onSelect 有效 |
| `Dropdown` | `Dropdown`（**antd 高度同构**） | **保留 `overlay`（ReactNode）/`trigger`（`['click','hover','contextMenu']` 数组）/`placement`（12 值同名）**；antd v5 `menu={{items}}` 数组形态→**`overlay={<Menu>…Menu.Item/SubMenu…</Menu>}` children JSX**（见 Menu 行备选的 children 驱动）；antd v5 `open`→**`visible`**、`onOpenChange`→**`onVisibleChange(visible)`**；`getPopupContainer` 同名；`mountOnBody`（默认 false）；**不用 `PopUpMenu`（文档标注废弃）** |
| `Breadcrumb` | `Crumbs` | **`items`→`data`**；项 `{title, url?, enable?, icon?}`（`href`/`path`→**`url`**；**`enable: false` 不可点击**，默认 true）；**`separator`→`seprator`（官方拼错，将错就错，残留正确英文 separator 即未迁移）**；头部标题 `title`；`onClick(url, event)` 组件级（非每项）；**`<Breadcrumb.Item>` JSX 子元素形态→拍平 `data=[{title:'xxx'}]` 数组**；最后一项不传 `url` 即当前页 |
| `Steps` | `Wizards` | `current`→**`currentStep`（对应 `data[].value` 不是下标！）**；`items`→**`data=[{text, value, description?}]`**（`title`→`text`；value 不配默认序号 1,2,3…但**回跳依赖 value 唯一**）；`onClick`→data 项级 **`onStepClick(index)`**；`size`: antd default/small→`large`/`medium`/`small`/`mini`（**antd `small` 值同名但档位整体偏移**）；`direction="vertical"`→**`orientation="vertical"`**；`type="navigation"`→`isArrowType`（仅水平）；`progressDot` 无对应；`labelPlacement` 无对应；**建议不超过 5 步**（文档）；`isBacktrackable`（仅箭头型，需中间无跳过） |
| `Pagination` | `Paging` | `total`→**`recordCount`（必须传）**；`current`→`currentPage`；`pageSize`/`pageSizeOptions` 同名；`showTotal`→`recordCountDisp`（string 替代展示）；`onChange(page, pageSize)`→**`onPageChange(currentPage)` + `onPageSizeChange(pageSize)` 分开两个**；`hideConfig=['totalRecord','pageSize','gotoPage']` 隐藏分区；`simple`→`type='simple'`；**`onPageChange` 一旦设置即完全受控**（默认翻页行为被禁用——受控时必须接回调维护 currentPage） |
| `Affix` | 手写 `position:sticky` | 无对应 |
| `BackTop` | 手写 | 无对应 |
| `Row` / `Col` | `Row` / `Col`（GridLayout） | `import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`；`span`→**`cols`**；`gutter`→`colMargin`（**CSS margin 字符串写法**，如 `'0 0 1rem 1rem'`，不是数字/数组）；`offset` 同名；**无响应式断点**（xs/sm/md/lg/xl 全删）；复杂栅格手写 flex/grid |
| `Sider` 可拖拽分栏 | `Split` | `split="vertical"/"horizontal"`（**vertical = 左右分栏？见 [Split.md](components/Split.md) 语义**）；`allowResize` 默认 true；`minSize`/`maxSize`/`defaultSize`；children 两个 pane；**不是 antd Space 的对应物** |

## 图标与图表

| antd / 源项目 | eview-ui | 关键差异 |
|--------------|----------|---------|
| `<Icon name="...">`（源项目 shim，icon-plus/Lucide） | **保留原样** | **本 skill 不迁移图标**：保留 `@/shared/Icon` shim + `import Icon from '@/shared/Icon'`；vite proxy 不动；**不使用 eview-ui `Icon`（name 体系不同）也不使用 `SvgIcon`（文档标注废弃）**；仅校验 import 路径正确（`check-imports.cjs`） |
| `@ant-design/icons` 具名导入 | 转 `<Icon name>` shim 或手写 | 源项目一般不用（ict-coder 产物恒走 shim）；若出现，按语义换 `<Icon name="语义名">`（icon-plus 在线名）或 Lucide 内联 |
| `<Chart name option>`（源项目封装） | **保留原样** | **eview-ui 无 Chart 组件**——保留源项目 chart.jsx 封装（echarts）；保留其 import 路径与 ResizeObserver 行为；**不需要补 a2ui/theme**（eview-ui 无此约束，勿凭空添加）；暗色跟随由业务 CSS 处理（图表主题若源项目有切换逻辑则保留） |

## 属性拼写异常（eview-ui 官方原文，迁移必须照抄）

| 正确英文 | eview-ui 实际拼写 | 所属组件 | 备注 |
|---------|------------------|---------|------|
| separator | **`seprator`** | Crumbs（另有 `sepratorStyle`） | 残留 `separator` 即未迁移 |
| disabled | **`disable`** | SelectCard、FileUpload、Tag（message 型）、PopUpMenu Option 项、ButtonMenu options 项 | **其余组件（Button/TextField/Select/Menu 等）都是正确拼写 `disabled`——不要全局替换** |
| placeholder | **`placeHolder`** | FileUpload、BrowseButton | 大写 H |
| uploadErrorMessage | **`upLoadErrorMessage`**/`upLoadSuccessMessage` | FileUpload | upLoad |
| disposeTimeout | **`disposeTimeOut`** | TipBox、DivMessage | 大写 O |
| disableCheckAssociated | **`disabelCheckAssociated`** | TablePro selection、Tree、TreeTable | 父子勾选关联 |
| enableMultiExpand | **`enableMulitiExpand`** | Table | Muliti |
| onRowExpand | **`onRowExpend`**/`onRowExpendClick`/`expandedRow` | Table | Expend |
| multiSelectEnable | **`mutiSelectEnable`** | JList、TreeTable | muti |
| enableHorzScroll | **`enablHorzScroll`** | Select、InputSelect、Popup | 漏 e |
| onFocus | **`onFoucs`** | Spinner（接口定义） | 仅接口处；属性表用 onFocus，正常写 |
| validator | **`validtor`** | CheckboxGroup（接口定义） | 仅接口处 |
| minimizeModalEnable | **`minimizModalEnable`** | Dialog | 漏 e |
| className | **`Classname`** | ProgressBar（属性表排版） | 以属性表为准时照抄；不确定用 className |

## 回调签名差异（首参是值不是 event / 参数顺序反直觉）

| 组件 | eview-ui 签名 | 迁移要点 |
|------|--------------|---------|
| TextField / TextArea / HexField | `onChange(value1, value2, event)` | 新值/旧值/event；antd `onChange(e)` 的 `e.target.value` → 首参 |
| SelectPro | `onChange(value, options)` | 两参；options 是选中项对象/数组（labelInValue 替代） |
| MultipleSelect | `onChange(value[], changeValue[], event)` | 选中集合/本次变更项/event |
| InputSelect | `onChange(value, oldValue)` | 两参 |
| Checkbox | `onChange(value, checked, event, additionalData)` | 四参；checked 是第 2 参 |
| CheckboxGroup | `onChange(newValue[], oldValue[], event)` | 数组双参 |
| Radio | `onChange(value, event)` | |
| RadioGroup | `onChange(value, oldValue, event)` | 带 oldValue |
| SelectCard | `onChange(value, event)` | 首参即选中值 |
| Toggle | `onToggle(value)` | 事件名也变了（onChange→onToggle） |
| Spinner | `onChange(value)` 仅有效值；`onError(value)` 无效值；**`onBlur(value)`（值不是事件！）** | antd InputNumber onChange 混收有效无效，需分流 |
| SearchInput | `onSearch(value)`（**值变化也触发**）；`onChange(value)`；`onClear(value)` | 必须防抖 |
| Rating | **`onClick(event, value)`（event 在前！）** | 事件名 onClick 不是 onChange |
| DatePicker | `onChange(date, {moment, isDst, unix, utcTime})` | 第二参是信息包 |
| TimePicker | `onChange(time: number[])` | 数字数组 [时,分,秒] |
| IPInput | `onChange(value, event)`；IPAddress `onChange(value)` 单参 | 两个组件签名不同 |
| CategorySearch | `onSearch(category, value)`；`onClear(oldValue, newValue)`（**old 在前！**） | |
| FileUpload | `onChange(event, itemList)`（**event 在前**）；`onReload({event, data})` | |
| Table | `onRowClick(row, e)`；**`onRowRightClick(e, row)`（事件在前！）**；`onColumnSort(sortColumn, sortType)` | 右键事件参数序反 |
| TablePro | `onChange(currentDataset, changeEvent)` | 分页/排序/筛选统一回调 |
| Tab | **`onClick(index, title, event)`（不是 onChange；index 是下标）** | |
| Panel | `onExpand(selectedIndex, event)`（下标） | |
| Tree | `onSelect(selectedKeys, node, event)`；`onCheck(checkedKeys, node)` | 首参是 keys 数组 |
| Popup | `onItemClick(item, e)`（item 是数据项） | |
| PopUpMenu | `onClick({text, value, clickItem})` | |
| ButtonMenu | `onClick(value, event)` | |
| Crumbs | `onClick(url, event)` 组件级 | |
| DialogPro / MessageDialogPro | `onClose(event)` **不自动关闭** | 必须自己 setIsOpen(false) |
| Drawer | `onClose(event?: {type: 'ok'/'cancel'/'mask'})` **不自动关闭** | |
| Paging | `onPageChange(currentPage)`；`onPageSizeChange(pageSize)` | antd onChange(page, pageSize) 拆两个 |

## 显隐 prop 速查（eview-ui 不统一，最高频张冠李戴点）

| prop | 组件 |
|------|------|
| `isOpen` | DialogPro、MessageDialogPro、PopUpMenu、Loader |
| `visible` | Drawer、Tooltip、Dropdown |
| `display` | Popup、TipBox、DivMessage、LinkField（TipBox/DivMessage/LinkField 的 display 默认 **true** 即显示；Popup 默认 false） |
| `iconDisplay` | HelpTip（默认 true） |
| `isShow` | Shade（默认 true） |
| 无显隐 prop | PopConfirm（内部管理）、PageMessage、FormMessage（父级条件渲染） |
| `destroyOnClose` 默认 **true** | DialogPro、MessageDialogPro（**antd 默认 false——语义反转**） |
| 不自动关闭 | 所有弹层 onClose 均需手动置 false（DivMessage/TipBox 靠 disposeTimeOut） |

## 性能规格（组件文档标注的规模上限）

| 组件 | 数据规模上限 |
|------|-------------|
| Select / MultipleSelect / SelectPro `options` | ≤ 500 |
| SearchInput `popItems` | ≤ 200 |
| DoubleSelect `items` | ≤ 200 |
