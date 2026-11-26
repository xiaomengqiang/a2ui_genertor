# MultipleSelect 下拉复选框

> 分类：数据录入

该组件用来设置多选下拉框，并在输入框提供当前选中的列表的预览。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                | eview 写法       | 迁移要点                                                                                                                                                                                                                                                              |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Select mode="multiple"` | `MultipleSelect` | 删 `mode`；`options=[{text, value}]`；`value` 数组；**`onChange(value[], changeValue, event)`**；`placeholder` 同名保留；`searchable`（= showSearch）；`selectAll`；`getValue()`；性能：options ≤500（也可用 SelectPro `mode='multiple'`，本表主映射 MultipleSelect） |

## API

| 方法名   | 描述                              | 参数 | 返回值                          |
| -------- | --------------------------------- | ---- | ------------------------------- |
| getValue | 用来获取下拉框中被选中项的value值 |      | 当前选中的项的value集合（数组） |
| validate | 用来手动进行非空校验              |      | 校验结果，bool类型              |
| focus    | 用来设置下拉框聚焦并打开下拉面板  |      | 无                              |

### 属性

| 属性名称                  | 描述                                                                                                                                                                                                                                                                                   | 输入                                                                                                                                                            | 默认                 |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| id                        | 设置多选下拉组件外层容器id，未设置时自动生成（eui_ms_NNNN）                                                                                                                                                                                                                            | string                                                                                                                                                          |                      |
| className                 | 为组件外层容器增加class                                                                                                                                                                                                                                                                | string                                                                                                                                                          |                      |
| style                     | 为组件外层容器设置样式                                                                                                                                                                                                                                                                 | object                                                                                                                                                          |                      |
| selectClassName           | 为选择容器（.eui_multiple_select）增加class                                                                                                                                                                                                                                            | string                                                                                                                                                          |                      |
| selectStyle               | 为选择容器设置样式                                                                                                                                                                                                                                                                     | object                                                                                                                                                          |                      |
| inputStyle                | 自定义样式，改变输入框样式（支持rem宽度）                                                                                                                                                                                                                                              | object                                                                                                                                                          |                      |
| inputClassName            | 为输入框容器增加class                                                                                                                                                                                                                                                                  | string                                                                                                                                                          |                      |
| options                   | 设置下拉列表的选项<br>&nbsp; options : [{ text: "111", value: 1, optionStyle:{ }, optionClassName: 'customName'}, {text: "222", value: 2, disabled: true}];                                                                                                                            | MultipleSelectOptionItem[]                                                                                                                                                           | []                   |
| optionStyle               | 配置下拉列表每条选项的样式                                                                                                                                                                                                                                                             | object                                                                                                                                                          |                      |
| optionClassName           | 配置下拉列表每条选项的className                                                                                                                                                                                                                                                        | string                                                                                                                                                          |                      |
| selectedIndex             | 设置默认选中的index，此处为数据属性options中对应的index，如果同时设置value，以value为准                                                                                                                                                                                                | number[]                                                                                                                                                        |                      |
| value                     | 设置当前选中的value值（受控）                                                                                                                                                                                                                                                          | any[]                                                                                                                                                           | []                   |
| disabled                  | 设置组件的禁用状态                                                                                                                                                                                                                                                                     | bool                                                                                                                                                            | false                |
| label                     | 设置下拉框的名称文字                                                                                                                                                                                                                                                                   | string                                                                                                                                                          |                      |
| labelClassName            | 通过添加class的方式控制label的样式                                                                                                                                                                                                                                                     | string                                                                                                                                                          |                      |
| labelStyle                | 通过添加style的方式控制label的样式                                                                                                                                                                                                                                                     | object                                                                                                                                                          |                      |
| labelPosition             | 设置输入框的名称文字的位置 before代表名称文字在输入框的左边，after代表名称文字在输入框的右边                                                                                                                                                                                           | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br>                                                                                                                    | "before"             |
| required                  | 支持设置组件值是否必须，若为必须，则input前面加\*                                                                                                                                                                                                                                      | bool                                                                                                                                                            | false                |
| searchable                | 是否启用搜索功能                                                                                                                                                                                                                                                                       | bool                                                                                                                                                            | false                |
| selectAll                 | 在下拉菜单中添加"All"选项                                                                                                                                                                                                                                                              | bool                                                                                                                                                            | false                |
| selectAllSearched         | 有搜索结果时使用"Select all search results"选项替换"All"选项（searchable和selectAll为true时有效）                                                                                                                                                                                      | bool                                                                                                                                                            | false                |
| disableToolTip            | 禁用工具提示                                                                                                                                                                                                                                                                           | bool                                                                                                                                                            | false                |
| delimiter                 | 分隔符，用于分隔输入框中已选中的选项文本                                                                                                                                                                                                                                               | string                                                                                                                                                          | ','                  |
| enableCloseIcon           | 是否在每个选中项上显示关闭小图标（x）                                                                                                                                                                                                                                                  | bool                                                                                                                                                            | false                |
| zIndex                    | MultipleSelect Popup的z-index，可由用户覆盖                                                                                                                                                                                                                                            | number                                                                                                                                                          | 由ConfigProvider计算 |
| toolTipPosition           | 设置自定义工具提示位置                                                                                                                                                                                                                                                                 | 跟Tooltip 组件的placement属性一致 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | 'topLeft'            |
| popupDirection            | 设置弹出框的方向                                                                                                                                                                                                                                                                       | enum:<br>&nbsp;"top"<br>&nbsp;"bottom"<br>                                                                                                                      |                      |
| dropdownClassName         | 下拉框类名                                                                                                                                                                                                                                                                             | string                                                                                                                                                          |                      |
| dropdownStyle             | 下拉框样式                                                                                                                                                                                                                                                                             | object                                                                                                                                                          |                      |
| displayItems              | 设置弹出框中最大显示条目数，0表示不限制                                                                                                                                                                                                                                                | number                                                                                                                                                          | 0                    |
| listHeight                | 设置选择列表的高度（启用isVirtualScroll时无效）                                                                                                                                                                                                                                        | number                                                                                                                                                          |                      |
| maxLengthInput            | 搜索输入框最大字符长度                                                                                                                                                                                                                                                                 | number                                                                                                                                                          | 64                   |
| placeholder               | 输入框默认文本                                                                                                                                                                                                                                                                         | string                                                                                                                                                          | ''                   |
| hintType                  | 显示提示信息的方式                                                                                                                                                                                                                                                                     | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br>                                                                                                                         | 'div'                |
| tipStyle                  | 通过添加tipStyle来自定义提示框的样式                                                                                                                                                                                                                                                   | object                                                                                                                                                          |                      |
| tagStyle                  | 设置标签容器样式                                                                                                                                                                                                                                                                       | object                                                                                                                                                          |                      |
| alwaysValidate            | 是否一直校验，为true时每次滚动/失焦都会触发校验                                                                                                                                                                                                                                        | bool                                                                                                                                                            | false                |
| showPopUp                 | 控制弹窗初始是否显示                                                                                                                                                                                                                                                                   | bool                                                                                                                                                            | true                 |
| onBlur                    | 定义组件的失去焦点时的事件<br><br>**签名:**<br>`function(event: FocusEvent) => void`<br>_event:_ 触发失焦的事件对象                                                                                                                                                                    | function                                                                                                                                                        |                      |
| onChange                  | 定义组件内容改变时的事件<br><br>**签名:**<br>`function(value: any[], changeValue: any, event: Event) => void`<br>_value:_ 当前组件中选中的项的value集合（数组）<br>_changeValue:_ 当前选择或取消的项的value（单项值，selectAll时为之前选中的value数组）<br>_event:_ 触发改变的事件对象 | function                                                                                                                                                        |                      |
| onFocus                   | 定义组件聚焦时的事件<br><br>**签名:**<br>`function(event: FocusEvent) => void`<br>_event:_ 触发聚焦的事件对象                                                                                                                                                                          | function                                                                                                                                                        |                      |
| onSearchTextChange        | 搜索文本改变后的回调函数，函数接受的参数为搜索框中的文本（仅在searchable设置为true时有效）<br>**签名:**<br>`function(text: string) => void`<br>_text:_ 搜索框文本                                                                                                                      | function                                                                                                                                                        |                      |
| onOpenMultipleSelectPopup | popup弹出框状态改变时的回调<br>**签名:**<br>`function(popupShow: boolean) => void`<br>_popupShow:_ 新的弹出框展示状态（true=打开，false=关闭）                                                                                                                                         | function                                                                                                                                                        |                      |
| isVirtualScroll           | 是否启用虚拟滚动加载，注意虚拟滚动时为了避免选项显示半截，设置listHeight无效，会使用组件定制的高度                                                                                                                                                                                     | bool                                                                                                                                                            | false                |
| tipTextLimit              | 仅在isVirtualScroll虚拟滚动加载场景下生效，限制tip内容的长度显示，超过会截断内容加...显示                                                                                                                                                                                              | number                                                                                                                                                          |                      |
| inputTextDisplayLimit     | 限制输入框选择的内容显示的最大长度，超过会截断内容加...显示                                                                                                                                                                                                                            | number                                                                                                                                                          | 1000                 |
| isManualSearch            | 支持搜索时，是否支持手动搜索模式（onSearch回调），仅适用于AUI 3.1规范                                                                                                                                                                                                                  | bool                                                                                                                                                            | false                |
| version                   | AUI版本号，通常由ConfigProvider提供，一般不需要手动设置                                                                                                                                                                                                                                | string                                                                                                                                                          |                      |
| theme                     | AUI主题名，通常由ConfigProvider提供，一般不需要手动设置                                                                                                                                                                                                                                | string                                                                                                                                                          |                      |

## 接口定义

```typescript
interface MultipleSelectOptionItem {
  text: string;
  value: any;
  disabled?: boolean;
  optionStyle?: object;
  optionClassName?: string;
}
```

## 使用示例

### 基本属性设置

```jsx
import MultipleSelect from "eview-ui/MultipleSelect";

const onChange = (value, changeValue, event) => {
  // value 是选中值数组, changeValue 是本次变更项
};

const options = [
  { value: "1", text: "The internet" },
  { value: "2", text: "Network" },
  { value: "3", text: "item 03" },
  { value: "4", text: "item 04" },
  { value: "5", text: "item 05", optionStyle: { color: "red" }, optionClassName: "customName" },
];

// isVirtualScroll：options 较多时启用虚拟滚动
<MultipleSelect
  onChange={onChange}
  label="Default Style"
  labelStyle={{ display: "block" }}
  value={["1", "2"]}
  style={{ margin: "20px" }}
  inputStyle={{ width: "670px" }}
  isVirtualScroll
  options={options}
/>
<MultipleSelect
  onChange={onChange}
  disabled
  style={{ margin: "20px" }}
  label="Disabled Style"
  labelStyle={{ display: "block" }}
  value={["1", "2"]}
  options={options}
/>
<MultipleSelect
  onChange={onChange}
  label="Enable Close Icon"
  labelStyle={{ display: "block" }}
  value={["1", "2"]}
  enableCloseIcon
  style={{ margin: "20px" }}
  inputStyle={{ width: "670px" }}
  options={options}
/>
```

### 扩展处理

```jsx
import MultipleSelect from "eview-ui/MultipleSelect";

<MultipleSelect
  id="demo_multiple_select"
  onChange={(value, changeValue, event) => {
    // value 是选中值数组
  }}
  onBlur={(event) => {}}
  onOpenMultipleSelectPopup={(popupOpened) => {
    // popupOpened 为 true 时拉取 options 更新
  }}
  onFocus={(event) => {}}
  label="Multi-select expand dropdown box"
  value={[]}
  required
  style={{ marginBottom: "20px", marginRight: "20px", verticalAlign: "top" }}
  options={[
    { value: "1", text: "The internet" },
    { value: "2", text: "Network1" },
    { value: "3", text: "Network2" },
  ]}
/>
```

### 事件处理

```jsx
import MultipleSelect from "eview-ui/MultipleSelect";
import ButtonGroup from "eview-ui/ButtonGroup";

const selectRef = React.useRef();

const options = [
  { value: "1", text: "The internet" },
  { value: "2", text: "Network" },
  { value: "3", text: "item 03" },
  { value: "4", text: "item 04", disabled: true },
  { value: "5", text: "item 05" },
];

<MultipleSelect
  ref={selectRef}
  id="demo_multiple_select"
  onChange={(value, changeValue, event) => {
    // value 选中值数组, changeValue 变更项
  }}
  delimiter=";"
  label="Multi-select drop-down box"
  value={[]}
  required
  isVirtualScroll
  tipTextLimit={1000}
  inputTextDisplayLimit={1000}
  style={{ marginBottom: "20px", marginRight: "20px", verticalAlign: "top" }}
  options={options}
  selectAll
/>
<ButtonGroup
  data={[
    { text: "Check", onClick: () => { selectRef.current.validate(); } },
    { text: "getValue", onClick: () => { selectRef.current.getValue(); } },
    { text: "Focus", onClick: () => { selectRef.current.focus(); } },
    { text: "Clear", onClick: () => { /* 清空 value */ } },
  ]}
/>
```

### 可搜索选择框

```jsx
import MultipleSelect from "eview-ui/MultipleSelect";

const options = [
  { value: "1", text: "The internet" },
  { value: "2", text: "Network" },
  { value: "3", text: "item 03" },
  { value: "4", text: "item 04" },
  { value: "5", text: "item 05" },
];

<MultipleSelect
  id="demo_multiple_select"
  onChange={(value, changeValue, event) => {
    // value 选中值数组
  }}
  onBlur={(event) => {}}
  onFocus={(event) => {}}
  onSearchTextChange={(text) => {
    // text 搜索框文本
  }}
  label="Multi-select searchable dropdown box"
  value={[]}
  searchable
  selectAll
  selectAllSearched
  required
  isVirtualScroll
  style={{ marginBottom: "20px", marginRight: "20px", verticalAlign: "top" }}
  options={options}
/>
```
