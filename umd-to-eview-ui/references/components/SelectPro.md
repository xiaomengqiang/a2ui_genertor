# SelectPro 选择器

> 分类：数据录入

此组件为 **[受控组件](https://zh-hans.reactjs.org/docs/forms.html#controlled-components)**<br>
`单选`/`单选带搜索`/`多选`/`多选带搜索` 四种类型可选择<br>
需在option数组中设置文本显示值text和唯一标识value; 可自定义显示的元素<br>

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法           | eview 写法                      | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Select`            | `SelectPro`                     | **受控组件**（value 唯一数据源）；基础下拉 `mode='single'`（默认可省）；`options` 项 `label`→**`text`**（`{text, value, disabled?}`）；**`placeholder` 同名保留**；**`onChange(value, options)` 两参**（options 是选中项对象/数组——antd `labelInValue` 的替代）；`defaultValue` 仅 mount 生效一次——antd defaultValue 转**初始 `value` state** 更稳（**必须设默认选中值**，无默认时取 `options[0].value`）；`notFoundContent`→`emptyOptionsMsg`；无 `allowClear`；性能：options ≤500、`isVirtualScroll` ≤1W 条 |
| `Select showSearch` | `SelectPro mode="singleSearch"` | 同上 + **`onInputChange(value, e)` 搜索时必填**（antd `onSearch` 逻辑迁入）；搜索过滤后仍只能选列表项；输入值可作选中值的场景（AutoComplete）用 `InputSelect`                                                                                                                                                                                                                                                                                                                                                 |
| `Select`（option 含图标 / 节点内容） | `SelectPro`（`options[].node`） | SelectPro **无 option 级图标 prop**——antd `optionRender` 或 antd `option[].icon` 存在 时，**用 `options[].node`（ReactNode）承载，不要塞进 `text`**（`text` 是 string，放节点不渲染/报错）；`text` 仍需设**纯字符串**作选中后 Select 框显示值（取 label 文字部分，无文字用 `value` 兜底）；选中后框里只显 `text` 不显 `node`——若业务需选中态也带图标，外层包一层或放弃 |

## API

| 方法名   | 描述                                     | 参数 | 返回值                               |
| -------- | ---------------------------------------- | ---- | ------------------------------------ |
| getValue | 获取已选中value的数组                    | -    | React.ReactText \| React.ReactText[] |
| focus    | 设置select组件聚焦                       | -    | -                                    |
| validate | 用于手动进行非空检查，并返回是否通过校验 | -    | 校验结果，boolean类型                   |

### 公共属性

| 属性                  | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 类型                                                                                                                                                                                                                            | 默认值                    |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------ |
| id                    | 自定义组件id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | string                                                                                                                                                                                                                          | -                         |
| className             | 设置组件class                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | string                                                                                                                                                                                                                          | -                         |
| emptyOptionsMsg       | 当options不存在数据时，自定义展示消息                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | string                                                                                                                                                                                                                          | -                         |
| style                 | 设置组件style                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | React.CSSProperties                                                                                                                                                                                                             | -                         |
| onPopupShowChanged    | popup弹出框状态改变时的回调,参数为新的弹出框展示状态                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `function:(popupShow: boolean) => void`                                                                                                                                                                                         | -                         |
| onFocus               | 获得焦点时回调,点击下拉框中选项也会触发                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `function:(event: object) => void`                                                                                                                                                                                              | -                         |
| onBlur                | 失去焦点时回调,点击下拉框中选项也会触发                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `function:(event: object) => void`                                                                                                                                                                                              | -                         |
| onChange              | 选中的value变化时，触发此回调 <br>**签名:**<br>_values_: 选中项的value 值/数组 <br>_options_: 选中项对应的option 值/数组                                                                                                                                                                                                                                                                                                                                                                                   | `function:(value: ReactText                                                                                                                                         \| ReactText[], options: OptionObj \| OptionObj[]) => void` | -                         |
| mode                  | 指定选择器的类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `single`\| `singleSearch`\| `multiple` \| `multiSearch`                                                                                                                                                                         | 'single'                  |
| defaultValue          | 默认选中项,此项只在组件mount时生效一次                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | ReactText \| ReactText[]                                                                                                                                                                                                        | -                         |
| value                 | 选中项,此项是当前组件的唯一数据源                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | ReactText \| ReactText[]                                                                                                                                                                                                        | -                         |
| options               | 设置展示的option数据<br> 例: <br>[{`text`: "Option1", //选中选项之后显示在Select中的值 <br> `value`: 1, //option的唯一标识 <br> `node`:<span\>option1</span\>, // 自定义option的展示项,不设置则option默认显示text值<br> `style`:{color:red}//设置样式 <br> `className`:'my-option-1' //设置类名<br>},<br> {`text`: "Option2", `value`: 2 }];                                                                                                                                                               | OptObj[]<br><br>OptObj对象参数:<br>text: string<br>value: React.ReactText<br> <node\>: React.ReactNode <br> <style\>: React.CSSProperties <br> <className\>: string                                                             | -                         |
| disabled              | 是否禁用组件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | boolean                                                                                                                                                                                                                            | false                     |
| placeholder           | 选择框提示文字                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | string                                                                                                                                                                                                                          | 默认提示                  |
| popupDirection        | 下拉框弹出方向(注:当弹出方向空间不够时会自动切换到其他方向)                                                                                                                                                                                                                                                                                                                                                                                                                                                | `top`\| `bottom`                                                                                                                                                                                                                | bottom                    |
| selectClassName       | 自定义select的class                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | string                                                                                                                                                                                                                          | -                         |
| selectStyle           | 自定义select的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | React.CSSProperties                                                                                                                                                                                                             | -                         |
| dropdownClassName     | 自定义dropdown的class                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | string                                                                                                                                                                                                                          | -                         |
| dropdownStyle         | 自定义dropdown的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | React.CSSProperties                                                                                                                                                                                                             | -                         |
| optionClassName       | 自定义option的class                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | string                                                                                                                                                                                                                          | -                         |
| optionStyle           | 自定义option的样式, \*set optionStyle.width for setting the width of the popup window                                                                                                                                                                                                                                                                                                                                                                                                                      | object                                                                                                                                                                                                                          | -                         |
| required              | 设置组件是否为必填项                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | boolean                                                                                                                                                                                                                            | false                     |
| toolTipProps          | 自定义选项的Tooltip样式，参考Tooltip组件文档来设置                                                                                                                                                                                                                                                                                                                                                                                                                                                         | object                                                                                                                                                                                                                          | -                         |
| validationTipStyle    | 自定义校验弹出的Tooltip样式，参考Tooltip文档中的CustomTooltipType来设置                                                                                                                                                                                                                                                                                                                                                                                                                                    | object                                                                                                                                                                                                                          | -                         |
| validator             | 设置自定义校验规则<br>**签名:**<br>`function:(value: ReactText[]                                                                                                                                                                                                                                                                             \| ReactText[]) => {result: boolean, message: string}`<br>*value:*选中项的value数组<br><br>*result:*校验结果,true代表通过<br>*message:*校验失败显示的提示信息 | function                                                                                                                                                                                                                        | -                         |
| hintType              | 显示提示信息(required)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br>                                                                                                                                                                                         | 'div'                     |
| getPopupContainer     | 获取渲染父节点, 设为false时为元素虚拟dom的原位置                                                                                                                                                                                                                                                                                                                                                                                                                                                           | (() => HTMLElement) &#124; false                                                                                                                                                                                                |                           |
| isVirtualScroll       | 支持下拉内容虚拟滚动加载，注：不支持配置enableCloseIcon；不支持jsx定制化选项HTML内容；数据规模不超过1W条。                                                                                                                                                                                                                                                                                                                                                                                                 | false                                                                                                                                                                                                                           |                           |
| tipTextLimit          | 限制多选时tip内容的长度显示，超过会截断内容加...显示，注：大量数据全选场景下设置显示tip内容，业务可根据实际诉求设置tip长度截断处理，提升Tip显示性能。                                                                                                                                                                                                                                                                                                                                                      | number                                                                                                                                                                                                                          |                           |
| tipMaxHeight          | 多选时tip内容太多，控制tip最大高度，超过最大高度，tip内容出滚动条展示。                                                                                                                                                                                                                                                                                                                                                                                                                                    | `number`\| `string`                                                                                                                                                                                                             | 支持px与rem，默认值 36rem |
| inputTextDisplayLimit | 限制输入框选择的内容显示的最大长度，超过会截断内容加...显示                                                                                                                                                                                                                                                                                                                                                                                                                                                | number                                                                                                                                                                                                                          | 默认值1000                |
| isManualSearch        | 支持搜索时，是否支持手动搜索, 仅适用于ICT 3.1规范。                                                                                                                                                                                                                                                                                                                                                                                                                                                        | boolean                                                                                                                                                                                                                         | false                     |

### 搜索模式属性

| 属性          | 描述                                                                    | 类型                                        | 默认值 |
| :------------ | :---------------------------------------------------------------------- | :------------------------------------------ | :----- |
| showSearchTip | 展示搜索为空提示                                                        | boolean                                        | true   |
| onInputChange | 当input中的值改变的时候触发这个函数, 如果要使用搜索功能，该属性为必填项 | `function(value: string, e: Event) => void` | -      |

### 多选模式属性

| 属性            | 描述                      | 类型   | 默认值 |
| :-------------- | :------------------------ | :----- | :----- |
| delimiter       | value之间的分隔符         | string | ','    |
| selectAll       | 在下拉菜单中添加“All”选项 | boolean   | false  |
| enableCloseIcon | 每个选项可以单独删除      | boolean   | false  |

## 使用示例

### 单选(single) 基础属性 此组件为受控组件,保证唯一数据源

```jsx
import SelectPro from "eview-ui/SelectPro";
import Button from "eview-ui/Button";

const options = [
  { text: "China is big country", value: "1" },
  { text: "UK is small country", value: "2" },
  { text: "USA", value: 3 },
  { text: "USAB", value: 4 },
  { text: "USAC", value: 5 },
];

const navFormIcon = "nav_form"; // 图片 url
const customizedOption = [
  {
    text: "Create",
    value: 1,
    node: (
      <div>
        <Button leftIcon={navFormIcon} size={"small"} style={{ padding: 0, border: 0, background: "transparent" }} />
        <span>Create</span>
      </div>
    ),
  },
  {
    text: "Export",
    value: 2,
    node: (
      <div>
        <Button leftIcon={navFormIcon} size={"small"} style={{ padding: 0, border: 0, background: "transparent" }} />
        <span>Export</span>
      </div>
    ),
  },
];

{/* 受控组件：value 需配合 onChange 使用 */}
<SelectPro options={options} value={""} onChange={(value) => { /* 取 value 更新 */ }} isVirtualScroll={true} />

{/* required / popupDirection / placeholder */}
<SelectPro options={options} required={true} value={""} onChange={(value) => { /* 取 value 更新 */ }} placeholder="请选择国家" popupDirection="top" />

{/* 自定义 option 渲染（node 字段）+ defaultValue */}
<SelectPro options={customizedOption} defaultValue={1} />

{/* disabled */}
<SelectPro options={options} disabled={true} />
```

### 事件处理

```jsx
import SelectPro from "eview-ui/SelectPro";

const options = [
  { text: "China", value: 1 },
  { text: "UK", value: 2 },
  { text: "USA", value: 3 },
];

// value 受控；onChange 回调首参为选中值；ref.focus() 可聚焦
<SelectPro
  options={options}
  ref={(select) => { /* select.focus() 聚焦 */ }}
  value={1}
  onChange={(value) => { /* 取 value 更新 */ }}
/>
```

### 搜索

```jsx
import SelectPro from "eview-ui/SelectPro";

const options = [
  { text: "Afghanistan", value: 1 },
  { text: "Albania", value: 2 },
  { text: "Algeria", value: 3 },
  { text: "Andorra", value: 4 },
  { text: "Angola", value: 5 },
  { text: "Anguilla", value: 6 },
];

{/* mode="singleSearch": 单选带搜索；onInputChange 回调首参为输入值 */}
<SelectPro
  mode="singleSearch"
  options={options}
  value={""}
  onChange={(value) => { /* 取 value 更新 */ }}
  onInputChange={(value) => { /* value 为搜索框输入值 */ }}
  isVirtualScroll={true}
/>

{/* mode="multiSearch": 多选带搜索；value 为选中值数组 */}
<SelectPro
  mode="multiSearch"
  options={options}
  value={[]}
  onChange={(value) => { /* value: 选中值数组 */ }}
  onInputChange={(value) => { /* value 为搜索框输入值 */ }}
  enableCloseIcon
  isVirtualScroll={true}
/>
```

### 多选

```jsx
import SelectPro from "eview-ui/SelectPro";

const options1 = [
  { text: "Armenia", value: "1" },
  { text: "Australia", value: "2" },
  { text: "Austria", value: "3" },
  { text: "Azerbaijan", value: "4" },
  { text: "Bahamas", value: "5" },
  { text: "Bahrain", value: "6" },
];

{/* mode="multiple": 多选，value 为选中值数组 */}
<SelectPro
  mode="multiple"
  options={options1}
  value={[]}
  onChange={(value) => { /* value: 选中值数组 */ }}
/>

{/* delimiter: 多选展示分隔符；selectAll: 全选 */}
<SelectPro
  mode="multiple"
  options={options1}
  delimiter="~"
  selectAll
  value={["1", "2", "3"]}
  onChange={(value) => { /* value: 选中值数组 */ }}
  isVirtualScroll
  tipMaxHeight={200}
  inputTextDisplayLimit={1000}
/>

{/* enableCloseIcon + defaultValue（非受控初始值） */}
<SelectPro
  mode="multiple"
  options={options1}
  enableCloseIcon
  defaultValue={["1", "2"]}
  value={[]}
  onChange={(value) => { /* value: 选中值数组 */ }}
/>
```

### 校验

```jsx
import SelectPro from "eview-ui/SelectPro";
import Tooltip from "eview-ui/Tooltip";

const options = [
  { text: "Armenia", value: 9 },
  { text: "Australia", value: 10 },
  { text: "Austria", value: 11 },
  { text: "Azerbaijan", value: 12 },
  { text: "Bahamas", value: 13 },
  { text: "Bahrain", value: 14 },
];

// 用 Tooltip 包裹做自定义校验提示：onChange 中判断后控制 Tooltip visible
<Tooltip content="选中项不能大于3个" visible={false}>
  <SelectPro
    mode="multiple"
    options={options}
    selectAll
    value={[]}
    onChange={(value) => {
      // value: 选中值数组；超 3 个时置 showTip=true 提示
    }}
  />
</Tooltip>
```
