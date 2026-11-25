# Button Menu 菜单按钮

> 分类：通用

Menu组件提供API功能,用户可以创建和子菜单。
<br>
注意：文本下拉按钮类型仅适用于ICT3.1规范。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法         | eview 写法   | 迁移要点                                                                         |
| ----------------- | ------------ | -------------------------------------------------------------------------------- |
| `Dropdown.Button` | `ButtonMenu` | `text` + `options=[{text, value, iconUrl?, disable?}]` + `onClick(value, event)` |

## API

### 属性

| 属性名称          | 描述                                                                                                                                       | 输入                                                                                                                           | 默认       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| id                | 自定义id                                                                                                                                   | string                                                                                                                         | -          |
| className         | 自定义class                                                                                                                                | string                                                                                                                         | -          |
| style             | 自定义组件样式                                                                                                                             | React.CSSProperties                                                                                                            | -          |
| text              | Button中的文本                                                                                                                             | string                                                                                                                         |            |
| iconUrl           | 图标                                                                                                                                       | string                                                                                                                         |            |
| status            | Button的状态                                                                                                                               | `default`&#124;`primary`&#124;`risk`                                                                                           | `default ` |
| value             | 项的值                                                                                                                                     | any                                                                                                                            | -          |
| selectedIndex     | 默认选中的选项索引                                                                                                                         | number                                                                                                                         | -          |
| disabled          | 设置组件灰化。                                                                                                                             | bool                                                                                                                           | false      |
| isOpen            | 设置下拉菜单是否可见                                                                                                                       | bool                                                                                                                           | false      |
| required          | 设置是否必选（此属性为内部属性，不建议外部使用）                                                                                           | bool                                                                                                                           | false      |
| options           | 设置每个数据项 例:options = [{text: "111", value: 1}, {text: "222", value: 2}, {text: "333", value: 2} 在 text, 页面显示值和, 数据库访问值 | array                                                                                                                          |            |
| optionClassName   | 设置options类名                                                                                                                            | string                                                                                                                         | -          |
| optionStyle       | 设置options的样式 例:optionStyle={{width:'350px'}}设置了下拉框的宽度.                                                                      | React.CSSProperties                                                                                                            | -          |
| position          | Button Menu的位置                                                                                                                          | `left`&#124;`right`                                                                                                            | `left`     |
| width             | 设置ButtonMenu的宽度                                                                                                                       | string                                                                                                                         | -          |
| onClick           | 组件item的点击事件                                                                                                                         | _function_:` (data: object, event: object) => void`<br>data: 被点击的选项对象（包含text、value等） <br>event: DOM原生click事件 |            |
| onFocus           | 组件聚焦时的事件                                                                                                                           | _function_:` (event: React.FocusEvent) => void`<br>event: DOM原生focus事件                                                     |            |
| onBlur            | 组件失焦时的事件                                                                                                                           | _function_:` (value?: string \| number, event?: React.SyntheticEvent) => void`<br>value: 当前选中值 <br>event: 原生事件        |            |
| onButtonClick     | 按钮本身的点击事件（非菜单项点击）                                                                                                         | _function_:` () => void`                                                                                                       |            |
| displayDirection  | 弹出方向                                                                                                                                   | `auto`&#124;`up`&#124;`down`                                                                                                   | `auto`     |
| tipShow           | tip是否展示                                                                                                                                | `always`&#124;`never`                                                                                                          | `never`    |
| tipData           | tip展示内容，为空时默认显示text属性值                                                                                                      | string                                                                                                                         | ''         |
| label             | 设置label                                                                                                                                  | string                                                                                                                         |            |
| labelClassName    | label自定义类                                                                                                                              | string                                                                                                                         |            |
| labelStyle        | label自定义样式                                                                                                                            | React.CSSProperties                                                                                                            |            |
| labelPosition     | 设置label的位置                                                                                                                            | `before`&#124;`after`                                                                                                          | `before`   |
| getPopupContainer | 设置弹窗的容器元素，传入函数返回容器DOM节点，传入false则不指定                                                                             | (() => HTMLElement) \| boolean                                                                                                 | false      |
| isTextDropdown    | 是否文本下拉按钮类型                                                                                                                       | boolean                                                                                                                        | `false`    |
| textColor         | 文本下拉按钮类型的文本颜色                                                                                                                 | 'blue'&#124;'black'                                                                                                            | `blue`     |
| version           | aui版本                                                                                                                                    | string                                                                                                                         | -          |
| theme             | 主题                                                                                                                                       | string                                                                                                                         | -          |

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import ButtonMenu from "eview-ui/ButtonMenu";

const optionsButton1 = [
  {
    text: "Create",
    value: 1,
    iconUrl: "create-default-url", // 图片 url
  },
  {
    text: "Export",
    value: 2,
    iconUrl: "export-default-url", // 图片 url
  },
  {
    text: "Delete",
    value: 3,
    iconUrl: "delete-default-url", // 图片 url
  },
];

const textOptions = [
  { text: "Create", value: 1 },
  { text: "Modify", value: 2 },
];

<ButtonMenu
  text="Operation"
  position="right"
  iconUrl="create-default-url" // 图片 url
  options={optionsButton1}
  label="Default style"
  labelStyle={{ paddingLeft: "5px" }}
  selectedIndex={1}
  style={{ marginLeft: "20px", width: "400px" }}
/>
<ButtonMenu
  text="Operation"
  options={textOptions}
  label="Only Text:"
  labelStyle={{ paddingLeft: "5px" }}
  value={1}
  style={{ marginLeft: "20px", width: "400px" }}
/>
<ButtonMenu
  text="Operation"
  iconUrl="create-icon-url" // 图片 url
  options={textOptions}
  label="Disabled style"
  labelStyle={{ paddingLeft: "5px" }}
  value={1}
  disabled={true}
  style={{ marginLeft: "20px", width: "400px" }}
/>
```

### 文本下拉按钮类型

基本属性设置

```jsx
import ButtonMenu from "eview-ui/ButtonMenu";

const optionsButton1 = [
  { text: "Create", value: 1 },
  { text: "Export", value: 2 },
  { text: "Delete", value: 3 },
];

<ButtonMenu
  text="文本按钮"
  position="right"
  iconUrl="create-default-url" // 图片 url
  options={optionsButton1}
  label="Default style"
  labelStyle={{ paddingLeft: "5px" }}
  selectedIndex={1}
  style={{ marginLeft: "20px", width: "400px" }}
  isTextDropdown
  width={"12rem"}
/>
```

### 按钮菜单事件

按钮菜单事件

```jsx
import ButtonMenu from "eview-ui/ButtonMenu";

const options = [
  {
    text: "Create",
    value: 1,
    iconUrl: "create-default-url", // 图片 url
    title: "Create a Drive",
  },
  {
    text: "Export",
    value: 2,
    disable: true,
    iconUrl: "export-default-url", // 图片 url
    title: "Export a Drive",
  },
  {
    text: "Delete",
    value: 3,
    iconUrl: "delete-default-url", // 图片 url
    title: "Delete a Drive",
  },
];

<ButtonMenu
  text="Operation"
  iconUrl="create-default-url" // 图片 url
  options={options}
  label="OnClick Event"
  labelStyle={{ paddingLeft: "0px" }}
  selectedIndex={0}
  style={{ marginLeft: "20px", width: "310px" }}
  onClick={(data, event) => {
    // data 是被点击的选项对象（含 text/value）
  }}
  onFocus={(event) => {
    // event 是原生 focus 事件
  }}
  tipShow={"always"}
  tipData={"Operation drive"}
/>
```

### popup位置

通过设置 `displayDirection` 为 `up` `down` 控制 popup 弹出位置。

```jsx
import ButtonMenu from "eview-ui/ButtonMenu";

const options = [
  {
    text: "Create",
    value: 1,
    iconUrl: "create-default-url", // 图片 url
    title: "Create a Drive",
  },
  {
    text: "Export",
    value: 2,
    disable: true,
    iconUrl: "export-default-url", // 图片 url
    title: "Export a Drive",
  },
  {
    text: "Delete",
    value: 3,
    iconUrl: "delete-default-url", // 图片 url
    title: "Delete a Drive",
  },
];

<ButtonMenu
  text="Up Button"
  iconUrl="create-default-url" // 图片 url
  options={options}
  label="display向上："
  labelStyle={{ paddingLeft: "0px" }}
  displayDirection="up"
  style={{ marginLeft: "20px", width: "310px" }}
/>
<ButtonMenu
  text="Down Button"
  iconUrl="create-default-url" // 图片 url
  options={options}
  label="display向下："
  labelStyle={{ paddingLeft: "0px" }}
  displayDirection="down"
  style={{ marginLeft: "20px", width: "310px" }}
/>
```

### icon和label位置设定

通过设置 `position` 为 `left` `right` 控制 icon 位置。
<br/>
通过设置 `labelPosition` 为 `before` `after` 控制 label 位置。

```jsx
import ButtonMenu from "eview-ui/ButtonMenu";

const options = [
  {
    text: "Create",
    value: 1,
    iconUrl: "create-default-url", // 图片 url
    title: "Create a Drive",
  },
  {
    text: "Export",
    value: 2,
    disable: true,
    iconUrl: "export-default-url", // 图片 url
    title: "Export a Drive",
  },
  {
    text: "Delete",
    value: 3,
    iconUrl: "delete-default-url", // 图片 url
    title: "Delete a Drive",
  },
];

// position: 'left' | 'right'（icon 位置）
// labelPosition: 'before' | 'after'（label 位置）
<ButtonMenu
  text="Opertion"
  iconUrl="create-default-url" // 图片 url
  options={options}
  position="left"
  labelPosition="before"
  label="自定义位置"
  labelStyle={{ paddingLeft: "0px" }}
/>
```
