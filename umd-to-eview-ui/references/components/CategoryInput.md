# CategoryInput 分类输入框

> 分类：数据录入

该组件用于分类输入，由下拉选择框和文本输入框组合而成，支持同时定义文本框的名称，直接使用可简化样式定义，同时支持自定义样式。该组件同时支持必填设置与校验，同时可设置下拉列表框是否展示。


## API

| 方法名 | 描述 | 参数 | 返回值 |
|-----|-----|-----|-----|
| getCategory | 返回当前分类搜索框的下拉选中项的值，即分类搜索的类别 | 无 | 当前选中的下拉项值（类型与 categoryOptions 中的 value 一致） |
| getValue | 返回当前分类搜索框的文本框的值，即搜索关键词 | 无 | 分类搜索框文本框的值 |
| validate | 校验组件值是否合法，required 为 true 时可调用 | 无 | required 为 true 时：两边都有值返回 true，否则返回 false；required 为 false 时返回 undefined |
| focus | 使输入框获得焦点 | 无 | 无 |

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 搜索输入框根节点的 id | string | 自动生成 |
| className | 搜索输入框根节点的样式类名 | string |  |
| style | 覆盖搜索输入框根节点的行内样式 | object |  |
| version | 传入该值可定制当前组件匹配的 ucd 规范，不传则默认 aui2 规范 | string |  |
| theme | 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式 | string |  |
| selectClassName | 下拉框的样式类名 | string |  |
| selectStyle | 下拉框的行内样式 | object |  |
| categoryOptions | 设置下拉框的 options，例如：`[{text: "China", value: 1}, {text: "UK", value: 2}, {text: "USA", value: 3}]` | CategoryOption[] |  |
| category | 通过设置 category（对应 categoryOptions 中的 value 值）来选中 select 中的对应项 | any |  |
| selectedIndex | 设置下拉框默认选中的选项索引 | number |  |
| onCategoryChange | 设置组件 select 部分的 onChange 事件<br><br>**签名:**<br>`function(value: any) => void`<br>*value:* 当前选中的 select 的 value 值 | func |  |
| placeholder | 设置文本输入框的 placeholder | string |  |
| inputClassName | 通过添加 class 的方式控制 input 的样式 | string |  |
| inputStyle | 通过添加 style 的方式控制 input 的样式 | object |  |
| value | 支持给 input 设置 value 值 | any |  |
| required | 支持设置组件值是否必须，若为必须，则 input 前的 label 文字前加 *，同时支持非空校验 | boolean | false |
| disabled | 设置组件的灰化（禁用）状态 | boolean | false |
| onBlur | 定义组件的输入框失去焦点时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生 dom 的 event | func |  |
| onChange | 定义组件输入框内容改变时的事件<br><br>**签名:**<br>`function(value: any, oldValue: any, event: object) => void`<br>*value:* 当前输入框的值<br>*oldValue:* 上次输入框的值<br>*event:* 原生 dom 的 event | func |  |
| onFocus | 定义组件聚焦时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生 dom 的 event | func |  |
| labelClassName | 通过添加 class 的方式自定义 label 的名称的样式 | string |  |
| labelStyle | 通过添加 style 的方式自定义 label 的名称的样式 | object |  |
| label | 设置下拉框的名称文字 | string |  |
| labelPosition | 设置输入框的名称文字的位置，`before` 代表名称文字在输入框的左边，`after` 代表名称文字在输入框的右边 | `'before'` \| `'after'` | `'before'` |
| inputPosition | 设置输入框的位置，`right` 代表下拉框在左输入框在右，`left` 代表输入框在左下拉框在右 | `'left'` \| `'right'` | `'right'` |
| format | 输入框的值类型 | `'number'` \| `'any'` |  |
| maxLength | 设置输入框的最大可输入长度 | number |  |

## 接口定义

```typescript
interface CategoryOption {
  text: string;
  value: any;
}
```

## 使用示例

### 基本属性设置

基本属性设置，展示默认、禁用、必填样式，以及 validate / getCategory /getValue API 调用

```jsx
import CategoryInput from 'eview-ui/CategoryInput';

const options = [
  { text: 'NE1', value: 1 },
  { text: 'NE2', value: 2 },
  { text: 'NE3', value: 3 },
];

// inputPosition: "left"（输入框在左）/ "right"（输入框在右，默认）
<CategoryInput
  label="Default Style"
  inputPosition="left"
  categoryOptions={options}
  category={2}
  placeholder="Please enter..."
/>

// disabled 禁用态
<CategoryInput
  label="Disabled Style"
  inputPosition="right"
  categoryOptions={options}
  disabled
  placeholder="Please enter..."
/>

// required 必填，加 * 并支持非空校验
<CategoryInput
  label="Required Style"
  inputPosition="left"
  required
  categoryOptions={options}
  placeholder="Please enter..."
  ref={(input) => {
    // input.validate() 校验；input.getCategory() 取下拉值；input.getValue() 取输入框值
  }}
/>
```

### 事件处理

事件处理，展示 onChange、onBlur、onFocus、onCategoryChange 回调

```jsx
import CategoryInput from 'eview-ui/CategoryInput';

const options = [
  { text: 'China', value: 'China' },
  { text: 'UK', value: 'UK' },
  { text: 'USA', value: 'USA' },
];

// onChange(value, oldValue, event)：前两参是输入框值；onCategoryChange(value) 是下拉选中值
<CategoryInput
  categoryOptions={options}
  value=""
  placeholder="Please enter..."
  onChange={(value, oldValue, event) => {
    // value 当前输入框值，oldValue 上次输入框值
  }}
  onBlur={(event) => {
    // event 是原生 dom 事件
  }}
  onFocus={(event) => {
    // event 是原生 dom 事件
  }}
  onCategoryChange={(value) => {
    // value 是当前选中 select 的 value
  }}
/>
```

### 主题与版本

通过 version 和 theme 属性控制组件外观规范

```jsx
import CategoryInput from 'eview-ui/CategoryInput';

const options = [
  { text: 'Option1', value: 1 },
  { text: 'Option2', value: 2 },
];

// version 控制规范（如 'aui3'），theme 控制主题（如 'theme_dark'）
<CategoryInput
  label="AUI3 Theme"
  categoryOptions={options}
  version="aui3"
  theme="theme_dark"
  placeholder="Please enter..."
/>
```

