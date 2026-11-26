# 组件映射总表（antd → eview-ui）

> 本表是 antd→`@cloudsop/eview-ui` 的**聚合名表 + 导入路径 + 成员拆解**，供步骤 7 子 agent 改导入与 JSX 重命名时首选速查。
> 机器版（每组件分类/keyDiffs + 逐文件改写清单）在 `.migration-plan-eui.json` 的 `migrationPlanEui` + `importRewrites`；本表是人读聚合，覆盖 compound 名成员拆解（机器按 import 名定不了子用法，须查本表）。
> 导入规范：统一 `import X from '@cloudsop/eview-ui/X'` 子路径**默认**导入（官方文档示例里的 `eview-ui/X` 是简写，抄写必须补 `@cloudsop/` 前缀）。**Pro 优先**：Select→SelectPro、Table→TablePro、Modal→DialogPro、Modal.confirm→MessageDialogPro、Form→FormPro——旧版（Select/Table/Dialog/MessageDialog/Form）导入即违规。
> 完整 API 见各 `components/<Name>.md`；B 类手写模板见 [handwrite-templates.md](handwrite-templates.md)；三张横切速查表（拼写异常/回调签名/显隐 prop）见 [components/INDEX.md](components/INDEX.md) 文末。

## 通用

| antd | eview-ui | 导入路径 | 关键差异 |
|------|----------|---------|---------|
| `Button type="primary"` | `Button status="primary"` | `@cloudsop/eview-ui/Button` | `type`→`status`（default/primary/risk）；无 `loading`/`htmlType`/`danger`（`danger`→`status="risk"`）；文字用 `text` prop（`string`\|`ReactNode`，支持富文本），**不支持 children**（带 `leftIcon`/`rightIcon` 时也用 `text`）；`size` small/normal/large（antd `middle`→`normal`）；`onClick(event)` 原生事件 |
| `Button type="text"/"link"` | `TextButton` | `@cloudsop/eview-ui/TextButton` | 同 Button：文字用 `text`（`string`\|`ReactNode`，支持富文本），**不支持 children** |
| `Typography.Link` | `LinkField` | `@cloudsop/eview-ui/LinkField` | `children`（`text` 已废弃）+ `href`；`display` 默认 true |
| `Typography.Title`/`Text` | 手写 `<h1>`~`<h6>`/`<span>` | — | 无专用模板（§1 是 Layout 骨架，非 Typography）；用源项目 CSS 变量 |
| `Divider` | 手写 `<div>` + border | — | 无页面级对应（仅 `Menu.Divider` 是菜单内分割线）；见 §9 |
| `Space` | 手写 flex div + `gap` | — | 无对应（`Split` 是可拖拽分栏，不是间距容器）；见 §8 |

## 表单与输入

| antd | eview-ui | 导入路径 | 关键差异 |
|------|----------|---------|---------|
| `Input` | `TextField` | `@cloudsop/eview-ui/TextField` | `onChange(value1, value2, event)` 首参是值；无 `allowClear`/`rules`/`onPressEnter`；**compound——见下方成员拆解** |
| `Input.TextArea` | `TextArea` | `@cloudsop/eview-ui/TextArea` | `onChange(targetValue, value, event)`；`maxLength` 自带计数（替代 `showCount`）；无 `autoSize`/`allowClear` |
| `Input.Search` | `SearchInput` | `@cloudsop/eview-ui/SearchInput` | `onSearch` 值变化也触发（**需防抖**）；`onClear(value)`；`placeholder` 保留 |
| `Input.Password` | `TextField type="password"` | `@cloudsop/eview-ui/TextField` | `autoComplete="off"` |
| `InputNumber` | `Spinner` | `@cloudsop/eview-ui/Spinner` | `onChange(value)` 只在有效值触发；`onError(value)` 接无效值；**`onBlur(value)`（值不是事件）** |
| `Select` | `SelectPro` | `@cloudsop/eview-ui/SelectPro` | **Pro 优先**（旧 `Select` 弃用）；`options` 字段 `label`→`text`；**`optionRender` / `option[].icon` → `options[].node`（非 text，text 是 string）**；`placeholder` 同名；`onChange(value, options)` 两参；`mode` single/singleSearch/multiple/multiSearch |
| `Select mode="multiple"/"tags"` | `MultipleSelect` | `@cloudsop/eview-ui/MultipleSelect` | 删 `mode`；`value` 数组；`onChange(value[], changeValue[], event)` 三参；`placeholder` 保留；`showSearch`→`searchable`；tags 的「输入新建」能力丢失，需业务自补 |
| `Select showSearch` | `SelectPro mode="singleSearch"` | `@cloudsop/eview-ui/SelectPro` | `mode="singleSearch"` + `onInputChange(value, e)`（搜索时必填）；`placeholder` 保留；`onChange(value, options)` 两参；输入值可作选中值的 AutoComplete 场景才改用 `InputSelect` |
| `AutoComplete` | `InputSelect` | `@cloudsop/eview-ui/InputSelect` | 可输入任意值：`showCustomInput={true}`（默认 false，不传则拒绝非 options 值）+ `onInputChange(value)`；`onChange(value, oldValue)` 两参；**无 placeholder prop**（仅原生透传，需外层处理） |
| `Cascader` | 手写 | — | 无对应（`CategoryInput` 是下拉+输入框组合，不是级联）；见 §2 |
| `TreeSelect` | `TreeSelect` | `@cloudsop/eview-ui/TreeSelect` | `treeData`→`treeProps.data`；节点 `title`→`text`、`key`→`id` |
| `Checkbox` | `Checkbox` | `@cloudsop/eview-ui/Checkbox` | `onChange(value, checked, event, additionalData)` 四参 |
| `Checkbox.Group` | `CheckboxGroup` | `@cloudsop/eview-ui/CheckboxGroup` | `data=[{text,value}]`；`value[]`；**compound——见下方成员拆解** |
| `Radio` | `Radio` | `@cloudsop/eview-ui/Radio` | `onChange(value, event)` |
| `Radio.Group` | `RadioGroup` | `@cloudsop/eview-ui/RadioGroup` | `data=[{text,value}]`；**compound——见下方成员拆解** |
| `Radio.Button`/`Segmented` | `SelectCard` | `@cloudsop/eview-ui/SelectCard` | `data=[{text,value}]`；`onChange(value, event)`；禁用是 `disable`（不是 disabled）；**compound——见下方成员拆解** |
| `Switch` | `Toggle` | `@cloudsop/eview-ui/Toggle` | `checked`→`toggled`；`onChange`→`onToggle(value)`；`disabled` 保留正确拼写 |
| `Slider` | `DragInput` | `@cloudsop/eview-ui/DragInput` | `value` 永远是数组；`type="range"` 双滑块；`markIndexes` |
| `Rate` | `Rating` | `@cloudsop/eview-ui/Rating` | **`onClick(event, value)`（event 在前，不是 onChange）** |
| `DatePicker` | `DatePicker` | `@cloudsop/eview-ui/DatePicker` | `onChange(date, {moment, isDst, unix, utcTime})`；**compound——见下方成员拆解** |
| `TimePicker` | `TimePicker` | `@cloudsop/eview-ui/TimePicker` | `time` 是数字数组 `[时,分,秒]`；`onChange(time: number[])`；`format` 小写 `hh:mm:ss` |
| `Upload` | `FileUpload` | `@cloudsop/eview-ui/FileUpload` | 组件不发请求（`handleSubmit` 自己发）；`disable`（不是 disabled）；`onReload` 重传；`placeHolder`（大写 H） |
| `Form` | `FormPro` | `@cloudsop/eview-ui/FormPro` | **Pro 优先**（旧 `Form` 弃用）；Rule 扁平化（`required/email/ipv4/min...` + `custom`，非 antd `{required, message, validator}` 数组）；自定义校验用 `custom: (value, name?) => Promise<void>`，出错 `throw Error`（message 走 `validateMessages`）；FormPro Rule **无 `validator` 字段**——`{result, message}` 是 TextField/TextArea 的 `validator` prop 专属，勿用于 FormPro |
| `Mentions` | 手写 | — | 无对应 |

## 数据展示

| antd | eview-ui | 导入路径 | 关键差异 |
|------|----------|---------|---------|
| `Table` | `TablePro` | `@cloudsop/eview-ui/TablePro` | **Pro 优先**（旧 `Table` 弃用）；`dataSource`→`dataset`；`columns[].dataIndex` 保留同名（不重命名；`key` 是独立 React key，可省略）；`rowSelection`→`selection` 对象（`type`:'checkbox'/'radio'/`selectedRowKeys`/`onChange(selectedRowKeys, selectedRows)`/`onSelect`/`disabelCheckAssociated`）；`pagination`→对象；rowKey 同构 antd |
| `Tree` | `Tree` | `@cloudsop/eview-ui/Tree` | `treeData`→`data`；节点 `title`→`text`、`key`→`id`（`nodeKey="id"` 指定主键字段名）；`checkable`→`enableCheckbox`；三套受控状态分离 |
| `Tabs`/`TabPane` | `Tab`/`TabItem` | `import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`（**特例**） | **TabItem children 驱动**（`<Tab><TabItem title>内容</TabItem></Tab>`），禁止 `data`/`items`；`onClick(index, title, event)`（不是 onChange）；**compound——见下方成员拆解** |
| `Collapse`/`Panel` | `Panel`/`PanelItem` | `import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**特例·必须解构**） | `defaultActiveKey`/`activeKey`→`selectedIndex`（索引数组，key→index 映射）；`accordion`→`enableMultiExpand={false}`（语义取反）；**compound——见下方成员拆解** |
| `Tag` | `Tag` | `@cloudsop/eview-ui/Tag` | 仅 ICT 3.1 |
| `Card` | `Card` | `@cloudsop/eview-ui/Card` | `type` resource/detail/add |
| `Card.Grid` | `CardGrid` | `@cloudsop/eview-ui/CardGrid` | |
| `Timeline` | `TimeLine` | `@cloudsop/eview-ui/TimeLine` | 导出名大写 L |
| `Progress` | `ProgressBar` | `@cloudsop/eview-ui/ProgressBar` | `percent`→`current` |
| `Carousel` | `Carousel`（⛔） | `@cloudsop/eview-ui/Carousel` | Under Development，慎用 |
| `Transfer` | `DoubleSelect` | `@cloudsop/eview-ui/DoubleSelect` | `items`/`selectedItems` 双数组 |
| `List`（选中态场景） | `JList` | `@cloudsop/eview-ui/JList` | `mutiSelectEnable`（拼错）；非选中态列表手写 |
| `Descriptions` | `LabelField` 组合 / 手写 | `@cloudsop/eview-ui/LabelField` | 键值行轻量替代；复杂详情见 §3 |
| `Empty` | 手写 | — | 见 §5 |
| `Statistic` | 手写 | — | 见 §6 |
| `Skeleton` | 手写 / `Loader` | — | 见 §12 |
| `Avatar` | 手写 | — | 见 §7 |
| `Result` | 手写 | — | 手写 `SvgIcon` + 标题/按钮（iconMap: success/error/warn/info）；见 §11 |
| `Image` | 手写 | — | 无对应 |
| `Comment` | 手写 | — | 无对应 |

## 反馈

| antd | eview-ui | 导入路径 | 关键差异 |
|------|----------|---------|---------|
| `Modal` | `DialogPro` | `@cloudsop/eview-ui/DialogPro` | **Pro 优先**（旧 `Dialog` 弃用）；`open`→`isOpen`；**无 buttons prop——footer 自写**（children 排 Button + 自己 `setIsOpen(false)`）；`destroyOnClose` 默认 true（antd 默认 false，语义反转）；`onClose(event)` 不自动关闭；**compound——见下方成员拆解** |
| `Modal.confirm()`/`.info()`/`.warning()`/`.error()` | `MessageDialogPro` | `@cloudsop/eview-ui/MessageDialogPro` | **Pro 优先**（旧 `MessageDialog` 弃用）；受控形态 buttons 是 `{ok, cancel}` 对象；或静态方法 `.confirm(config)`（脱离 context，慎用）；`isOpen` 受控；**compound——见下方成员拆解** |
| `Drawer` | `Drawer` | `@cloudsop/eview-ui/Drawer` | `open`→**`visible`**；`onClose(event?: {type})` 不自动关闭；底部按钮自写 |
| `Alert`/`message.*()`/`notification` | `DivMessage` | `@cloudsop/eview-ui/DivMessage` | `display` 控制（不是 visible）；`disposeTimeOut`（拼错，大写 O）默认 `0` = 不自动隐藏（需显式传毫秒数才自动消失）；type 仅 default/success/error/warn（无 info/warning）；命令式 → 渲染式 |
| `Spin` | `Loader` | `@cloudsop/eview-ui/Loader` | `isOpen`；`type="global"/"local"/"micro"` |
| `Tooltip` | `Tooltip` | `@cloudsop/eview-ui/Tooltip` | `title`→`content`；`trigger="click"` 当 Popover 用 |
| `Popover` | `Tooltip` | `@cloudsop/eview-ui/Tooltip` | `trigger="click"`；`content` 自定义 |
| `Popconfirm` | `PopConfirm` | `@cloudsop/eview-ui/PopConfirm` | 仅 ICT 3.1；内部管理显隐（无 visible prop） |

## 布局与导航

| antd | eview-ui | 导入路径 | 关键差异 |
|------|----------|---------|---------|
| `Layout`/`Header`/`Sider`/`Content` | `Layout`（简单分栏）/ 手写 CSS（复杂骨架） | `@cloudsop/eview-ui/Layout` | `type` full/horizontal/vertical + `leftPanel`/`rightPanel`；固定栏目 `className="eui_layout_fix"` + 显式宽高；复杂骨架见 §1 |
| `Menu mode="inline"`/默认垂直 | `Accordion` | `@cloudsop/eview-ui/Accordion` | `items`→`data`（`label`→`title`、`key`→`value`）；`selectedKeys`→`selectedValue`（单 string）；`onClick({key})`→`onClick(node)`（取 `node.value`）；**compound——见下方成员拆解** |
| `Menu mode="horizontal"` | 手写横向菜单 | — | eview-ui 无横向菜单组件（不转 Accordion）；handwrite-templates.md 暂无对应模板；按源项目样式手写横向 `<ul><li>` + CSS（参考 §1 Layout header 思路） |
| `Breadcrumb` | `Crumbs` | `@cloudsop/eview-ui/Crumbs` | `items`→`data`；项 `href`/`path`→`url`；`separator`→**`seprator`**（官方拼错，将错就错）；`<Breadcrumb.Item>` 子元素→拍平 `data=[{title}]` |
| `Dropdown` | `Dropdown` | `@cloudsop/eview-ui/Dropdown` | antd 高度同构：`overlay`/`trigger`/`placement`；`menu={{items}}`→`overlay={<Menu>…Menu.Item/SubMenu…</Menu>}` children JSX（Dropdown/Menu 均无 `data` prop；items 拍平为 Menu 子元素） |
| `Steps` | `Wizards` | `@cloudsop/eview-ui/Wizards` | `current`→`currentStep`（对应 `data[].value` 不是下标）；`items`→`data=[{text, value}]`；`onChange(current)`→`data` 项级 `onStepClick(index)`（挂每项 `data` 上，非组件级 prop） |
| `Pagination` | `Paging` | `@cloudsop/eview-ui/Paging` | `recordCount` 必传；`onChange(page, pageSize)` 拆 `onPageChange`+`onPageSizeChange` |
| `Row`/`Col` | `Row`/`Col`（GridLayout） | `import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`（**特例·具名导出**） | `span`→**`cols`**；`gutter`→`colMargin`（CSS margin 字符串写法如 `'0 0 1rem 1rem'`）；`offset` 同名；**无响应式断点**（xs/sm/md/lg/xl 全删） |
| `Affix` | 手写 `position:sticky` | — | 见 §10 |
| `BackTop` | 手写 | — | 见 §10 |

## 图标

| antd | eview-ui | 导入路径 | 关键差异 |
|------|----------|---------|---------|
| `@ant-design/icons` | `@/shared/SvgIcon`（scaffold 已提供） | `@/shared/SvgIcon` | 源 `<Icon name size color>` → `<SvgIcon src={name} size={n} color={...}/>`（图标组件）或 `useIcon(name,{size,color?})`（图标字符串，给 string 型 icon prop，主题响应式）；**禁** eview-ui `Icon`/`SvgIcon`/`svg-icons`/`IconButton`、`@/shared/Icon` 旧路径（见硬约束 8 + [Icon.md](components/Icon.md)） |

## 成员拆解（compound——机器按 import 名定不了，须按文件实际 JSX 子用法定）

> `importRewrites[file].compoundFlags` 列出的 antd 名（Input/Checkbox/Radio/Modal/DatePicker/Tabs/Collapse/Menu）按本节定导入：import 名一样、但实际 JSX 子用法不同 → 导入不同 eview 组件。**必须同步重命名 JSX 标签与成员访问。**

### Input（`import { Input } from 'antd'`）
- `<Input>` → `<TextField>` → `import TextField from '@cloudsop/eview-ui/TextField'`
- `<Input.TextArea>` → `<TextArea>` → `import TextArea from '@cloudsop/eview-ui/TextArea'`（**不是 TextField**）
- `<Input.Search>` → `<SearchInput>` → `import SearchInput from '@cloudsop/eview-ui/SearchInput'`
- `<Input.Password>` → `<TextField type="password">` → `import TextField from '@cloudsop/eview-ui/TextField'`（标签改 `<TextField type="password">`）
- `<InputNumber>` 不属 Input 成员，独立 → `Spinner`（叶子，机器可定）

### Checkbox（`import { Checkbox } from 'antd'`）
- `<Checkbox>` → `<Checkbox>` → `import Checkbox from '@cloudsop/eview-ui/Checkbox'`
- `<Checkbox.Group>` → `<CheckboxGroup>` → `import CheckboxGroup from '@cloudsop/eview-ui/CheckboxGroup'`

### Radio（`import { Radio } from 'antd'`）
- `<Radio>` → `<Radio>` → `import Radio from '@cloudsop/eview-ui/Radio'`
- `<Radio.Group>` → `<RadioGroup>` → `import RadioGroup from '@cloudsop/eview-ui/RadioGroup'`
- `<Radio.Button>` → `<SelectCard>` → `import SelectCard from '@cloudsop/eview-ui/SelectCard'`

### Modal（`import { Modal } from 'antd'`）
- `<Modal>` → `<DialogPro>` → `import DialogPro from '@cloudsop/eview-ui/DialogPro'`
- `Modal.confirm()/info()/warning()/error()` → `<MessageDialogPro>` → `import MessageDialogPro from '@cloudsop/eview-ui/MessageDialogPro'`（命令式调用 → 渲染式 JSX + `isOpen` 受控）

### DatePicker（`import { DatePicker } from 'antd'`）
- `<DatePicker>` → `<DatePicker>` → `import DatePicker from '@cloudsop/eview-ui/DatePicker'`
- `<DatePicker.RangePicker>` / bare `<RangePicker>` → `<RangePicker>` → **特例**：`import DatePicker from '@cloudsop/eview-ui/DatePicker'; const { RangePicker } = DatePicker;`（删 `.RangePicker` 成员 JSX，eview-ui 无 RangePicker 默认导出）

### Tabs（`import { Tabs } from 'antd'`）
- `<Tabs>` + `<Tabs.TabPane>` → `<Tab>` + `<TabItem>` → **特例**：`import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`

### Collapse（`import { Collapse } from 'antd'`）
- `<Collapse>` + `<Collapse.Panel>` / `<Panel>` → `<Panel>` + `<PanelItem>` → **特例**：`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`

### Menu（`import { Menu } from 'antd'`）
- `<Menu mode="inline">`/默认垂直 → `<Accordion>` → `import Accordion from '@cloudsop/eview-ui/Accordion'`（`items`→`data`）
- `<Menu mode="horizontal">` → 手写横向菜单（eview-ui 无横向菜单组件，不转 Accordion）
- `<Menu.Divider>` → 菜单内分割线（手写 `<li role="separator">` 或 CSS）

## 导入特例（4 个——照原文，机器 `importRewrites.addImports` 已含）
1. **Tab**：`import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`（TabItem 具名导出）
2. **Panel**：`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**必须解构**，默认导出不是 Panel 本身）
3. **GridLayout**：`import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`（Row/Col 具名导出）
4. **RangePicker**：`import DatePicker from '@cloudsop/eview-ui/DatePicker'; const { RangePicker } = DatePicker;`（RangePicker 是 DatePicker 静态属性，`<DatePicker.RangePicker>` 改 `<RangePicker>`）

## 横切速查表
- **属性拼写异常**（seprator/disable/placeHolder/upLoadErrorMessage/disposeTimeOut/disabelCheckAssociated/...）：见 [components/INDEX.md](components/INDEX.md) 文末
- **回调签名差异**（首参是值/event 在前的例外——Rating `onClick(event, value)`、Table `onRowRightClick(e, row)`、FileUpload `onChange(event, itemList)` 等）：见 [components/INDEX.md](components/INDEX.md) 文末
- **显隐 prop 速查**（isOpen/visible/display/isShow/iconDisplay 全家福）：见 [components/INDEX.md](components/INDEX.md) 文末
