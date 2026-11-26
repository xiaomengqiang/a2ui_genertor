# CategorySearch 分类搜索框

> 分类：数据录入

该组件由下拉分类选择框和搜索输入框组合而成，用于分类搜索关键词并弹出列表框，支持回车和鼠标点击触发搜索，同时可设置下拉列表框是否展示。


## API

| 方法名 | 参数 | 返回值 | 描述 |
|-----|-----|-----|-----|
| getCategory | 无 | 当前选中的下拉项值（类型与 categoryOptions 中的 value 一致） | 返回当前分类搜索框的下拉选中项的值，即分类搜索的类别 |
| getValue | 无 | string | 返回当前分类搜索框的文本框的值，即搜索关键词 |
| getComValue | 无 | [category, value] | 返回包含分类值和搜索文本值的数组 |

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 搜索输入框根节点的 id | string | 自动生成 |
| className | 搜索输入框根节点的样式类名 | string |  |
| style | 覆盖搜索输入框根节点的行内样式 | object |  |
| version | 传入该值可定制当前组件匹配的 ucd 规范，不传则默认 aui2 规范 | string |  |
| theme | 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式 | string |  |
| inputClassName | 输入框的样式类名 | string |  |
| inputStyle | 覆盖搜索框的行内样式 | object |  |
| inputProps | 设置搜索框属性，例如 `{maxLength: 10}` | object |  |
| selectClassName | 下拉框的样式类名 | string |  |
| selectStyle | 下拉框的行内样式 | object |  |
| labelClassName | 通过添加 class 的方式自定义 label 的名称的样式 | string |  |
| labelStyle | 通过添加 style 的方式自定义 label 的名称的样式 | object |  |
| label | 设置下拉框的名称文字 | string |  |
| labelPosition | 设置名称文字的位置，`before` 代表名称文字在输入框的左边，`after` 代表名称文字在输入框的右边 | `'before'` \| `'after'` | `'before'` |
| showPopUp | 当设置为 true 时弹出信息提示框，设置为 false 时隐藏信息提示框 | boolean | false |
| disabled | 禁用组件 | boolean | false |
| categoryOptions | 设置下拉框的 options，例如：`[{text: "China", value: 1}, {text: "UK", value: 2}, {text: "USA", value: 3}]` | CategoryOption[] |  |
| category | 通过设置 category（对应 categoryOptions 中的 value 值）来选中 select 中的对应项 | any |  |
| selectedIndex | 设置下拉框默认选中的选项索引 | number |  |
| value | 设置搜索输入框的值 | any |  |
| popItems | 下拉列表的内容，和 onSuggest 互斥，两者不能同时设置。格式：`[{text: "a", value: 1}, ...]` | PopItem[] |  |
| placeholder | 搜索输入框的占位语 | string |  |
| onSearch | 点击搜索图标或在输入框按回车时的回调<br><br>**签名:**<br>`function(category: any, value: any) => void`<br>*category:* 当前选中的下拉分类值<br>*value:* 当前搜索框的文本值 | func |  |
| onClear | 点击清除图标的回调<br><br>**签名:**<br>`function(oldValue: any, newValue: any) => void`<br>*oldValue:* 清除前搜索框的文本值<br>*newValue:* 清除后搜索框的值（空字符串） | func |  |
| onCategoryChange | 设置 select 的 onChange 事件<br><br>**签名:**<br>`function(value: any) => void`<br>*value:* 当前选中的 select 的 value 值 | func |  |
| onSearchChange | 搜索框文本发生变化时的回调<br><br>**签名:**<br>`function(value: any) => void`<br>*value:* 搜索字符串值 | func |  |
| onSuggest | 当搜索框值变化时，调用该回调动态设置下拉列表内容，和 popItems 互斥，两者不能同时设置<br><br>**签名:**<br>`function(value: any) => Array`<br>*value:* 当前搜索输入框的 value 值<br>*returns:* 返回下拉列表数据，数据格式和 popItems 一致 | func |  |

## 接口定义

```typescript
interface CategoryOption {
  text: string;
  value: any;
}

interface PopItem {
  text: string;
  value: any;
}
```

## 使用示例

### 基本属性设置

基本属性设置，展示默认样式、maxLength 限制和禁用状态

```jsx
import CategorySearch from 'eview-ui/CategorySearch';

const options = [
  { text: 'China', value: 1 },
  { text: 'UK', value: 2 },
  { text: 'USA', value: 3 },
];

// category 选中下拉项；inputProps 透传给搜索框（如 maxLength）
<CategorySearch categoryOptions={options} category={2} />

<CategorySearch
  categoryOptions={options}
  category={2}
  placeholder="Max length 10"
  inputProps={{ maxLength: 10 }}
  inputStyle={{ width: "300px" }}
/>

// disabled 禁用
<CategorySearch categoryOptions={options} category={2} disabled />
```

### 事件处理

事件处理，展示 onSearch、onClear、onCategoryChange 回调，以及 popItems（静态下拉）和 onSuggest（动态下拉）两种模式

```jsx
import CategorySearch from 'eview-ui/CategorySearch';

const options = [
  { text: 'China', value: 'China' },
  { text: 'UK', value: 'UK' },
  { text: 'USA', value: 'USA' },
];

// popItems 静态下拉（与 onSuggest 互斥）
const popItems = [
  { text: "a", value: 1 },
  { text: "ab", value: 2 },
  { text: "abc", value: 3 },
];

// onSearch(category, value)：category 是下拉分类值，value 是搜索文本
// onClear(oldValue, newValue)：oldValue 清除前文本，newValue 清除后（空字符串）
<CategorySearch
  categoryOptions={options}
  category={'China'}
  value=""
  onCategoryChange={(value) => {
    // value 是当前选中 select 的 value
  }}
  onSearch={(category, value) => {
    // category 下拉分类值，value 搜索文本
  }}
  onClear={(oldValue, newValue) => {
    // oldValue 清除前文本，newValue 空字符串
  }}
  popItems={popItems}
/>

// onSuggest 动态下拉（与 popItems 互斥）：返回下拉列表数据
<CategorySearch
  categoryOptions={options}
  category={'UK'}
  value=""
  onCategoryChange={(value) => {}}
  onSearch={(category, value) => {}}
  onClear={(oldValue, newValue) => {}}
  onSuggest={(value) => {
    // value 当前搜索框文本；返回 popItems 格式的数组
    return popItems.filter((item) =>
      item.text.toLocaleUpperCase().match(new RegExp(value.toLocaleUpperCase(), "g"))
    );
  }}
/>
```

### 主题与版本

通过 version 和 theme 属性控制组件外观规范

```jsx
import CategorySearch from 'eview-ui/CategorySearch';

const options = [
  { text: 'China', value: 1 },
  { text: 'UK', value: 2 },
];

// version 控制规范（如 'aui3'），theme 控制主题（如 'theme_dark'）
<CategorySearch
  categoryOptions={options}
  category={1}
  version="aui3"
  theme="theme_dark"
  placeholder="Please enter..."
/>
```

