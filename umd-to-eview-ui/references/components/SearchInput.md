# SearchInput 搜索框

> 分类：数据录入

该组件用于搜索关键词弹出列表框，支持回车和鼠标点击触发搜索，同时可设置下拉列表框是否展示。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法      | eview 写法    | 迁移要点                                                                                                                                                                                                                                                                                                        |
| -------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Input.Search` | `SearchInput` | **`onSearch(value)` 触发时机比 antd 宽**——点图标/回车/**文本值变化时均触发**，必须加防抖或只在回车分支处理；`onChange(value)`（仅值）；`onClear(value)`；`maxLength`→**`maxLengthInput`**；下拉建议 `popItems=[{text,value}]` 与 `onSuggest` **互斥不能同设**；`labelPosition="after"` 布局文档明言不正确，勿用 |

## API

| 方法名   | 描述                                | 参数 | 返回             |
| -------- | ----------------------------------- | ---- | ---------------- |
| getValue | 当get取值方法称为返回当前文本框中的 | 不   | 当前文本框中的值 |

### 属性

| 属性名称       | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 输入                                         | 默认     |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------- | :------- |
| id             | 搜索输入框根节点的id。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | string                                       |          |
| className      | 搜索输入框根节点的样式类名。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | string                                       |          |
| style          | 覆盖搜索输入框根节点的行内样式。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | object                                       |          |
| inputClassName | 输入框的样式类名。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | string                                       |          |
| inputStyle     | 覆盖搜索框的行内样式。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | object                                       |          |
| inputProps     | 不建议使用!!!<br><br>额外可以添加的input原生属性，会覆盖掉组件自定义的与input原生属性相关的属性，例如会导致maxLengthInput、disabled等失效。                                                                                                                                                                                                                                                                                                                                                                                                                                           | object                                       |          |
| labelClassName | 通过添加class的方式自定义label的名称的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | string                                       |          |
| labelStyle     | 通过添加style的方式自定义label的名称的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | object                                       |          |
| label          | 设置下拉框的名称文字                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | string                                       |          |
| showPopUp      | 当用户将参数值设置为true时，弹出信息提示框。当用户将参数值设置为false时，隐藏信息提示框。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | bool                                         | false    |
| showTip        | 目前无法控制tip不展示，在内容过长时仍是自动通过tip展示完整内容。<br><br>控制tip的展示，当value长度超过文本框长度时展示                                                                                                                                                                                                                                                                                                                                                                                                                                                                | bool                                         | false    |
| required       | 指定其必填字段                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | bool                                         | false    |
| disabled       | 禁用组件。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | bool                                         | false    |
| labelPosition  | 目前默认的before表现正常，而after的布局是不正确的。<br><br>设置输入框的名称文字的位置 before代表名称文字在输入框的前面，after代表名称文字在输入框的后面                                                                                                                                                                                                                                                                                                                                                                                                                               | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| value          | 搜索输入框的文本值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | any                                          |          |
| popItems       | 下拉列表的内容，和onSuggest互斥，两者不能同时设置，格式如下： <br>[{ <br>text: "a", //文本内容 <br>value: 1 //内容标识 <br>}, ...]                                                                                                                                                                                                                                                                                                                                                                                                                                                    | array                                        |          |
| placeholder    | 搜索输入框的占位语。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | string                                       |          |
| maxLengthInput | 输入框的最大输入长度                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | number                                       |          |
| zIndex         | 该参数可覆盖输入框popUp的zIndex                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | number                                       | 9999     |
| onSearch       | 点击搜索图标,或者在输入框按回车,或者当前输入框文本值发生变化时的回调。<br><br>**签名:**<br>`function(value: any) => void`<br>_value:_ 当前搜索框的文本值。                                                                                                                                                                                                                                                                                                                                                                                                                            | function                                     |          |
| onSuggest      | 当搜索框值变化时，调用该回调动态设置下拉列表内容,和popItems互斥，两者不能同时设置<br><br>**签名:**<br>`function(value: any) => Array`<br>_value:_ 当前搜索输入框的value值<br> _returns_ (Array): 返回下拉列表数据，数据格式和popItems一致                                                                                                                                                                                                                                                                                                                                             | function                                     |          |
| onClear        | 点击清除图标的回调。<br><br>**签名:**<br>`function(value: any) => void`<br>_value:_ 当前搜索框的文本值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | function                                     |          |
| lazySearch     | Object that defines the lazy search options. If this property is defined, then the records that are being shown in the search suggestion drop down will be paged, and lazy loaded through the defined callback method. User need to provide only a set of 10 records at a time. The data structure is as : <br>`totalRecords`: The total number of search results for the searched string <br>`onLoadRecords`: The callback that will load next set of the data to be displayed in the popup. This method will have the index of the first element in the view port as the parameter. | object                                       |          |
| onChange       | 搜索框值更改触发事件。<br><br>**Signature:**<br>`function(value: string) => void`<br>_value:_ The search string value after the change                                                                                                                                                                                                                                                                                                                                                                                                                                                | function                                     |          |
| onClick        | 搜索框点击事件。<br><br>**Signature:**<br>`function(event: object) => void`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | function                                     |          |

## 使用示例

### 基本属性设置

```jsx
import SearchInput from "eview-ui/SearchInput";

const labelStyle = { display: "block", paddingLeft: "0px" };

<SearchInput
  label="Default style"
  labelStyle={labelStyle}
  placeholder="search"
/>;

<SearchInput
  label="Limit 5 Character"
  required={true}
  labelStyle={labelStyle}
  placeholder="search"
  maxLengthInput={5}
/>;

<SearchInput
  label="Additional Input props"
  labelStyle={labelStyle}
  inputProps={{ maxLength: 8 }}
/>;

<SearchInput
  label="Disabled Style"
  labelStyle={labelStyle}
  placeholder="search"
  disabled
/>
```

### 事件处理

```jsx
import SearchInput from "eview-ui/SearchInput";

const popItems = [
  { text: "a", value: 1 },
  { text: "ab", value: 2 },
  { text: "abc", value: 3 },
];

// 静态设置选项：popItems 与 onSuggest 互斥，不能同设
<SearchInput
  value=""
  popItems={popItems}
  onSearch={(value) => {
    // value: 搜索框文本值（点图标/回车/值变化时均触发，需防抖）
  }}
  onChange={(value) => {
    // value: 变化后的值
  }}
  onItemClick={(value) => {
    // value: 选中项的 value
  }}
/>;

// 动态设置选项：onSuggest 返回下拉列表（与 popItems 互斥）
<SearchInput
  value=""
  onSuggest={(value) => {
    // value: 当前输入值；返回 popItems 格式数组
    return popItems.filter((item) =>
      item.text.toUpperCase().includes(value.toUpperCase()),
    );
  }}
  onSearch={(value) => {}}
  onChange={(value) => {}}
  onItemClick={(value) => {}}
/>
```

### 懒加载结果

```jsx
import SearchInput from "eview-ui/SearchInput";

// lazySearch：下拉结果分页懒加载，每次只提供 10 条
const lazySearch = {
  totalRecords: 11, // 搜索结果总数
  onLoadRecords: (index) => {
    // index: 视口内首条数据下标，业务返回该位置起的下一批数据
  },
};

const popItems = [
  { text: "Two wrongs don't make a right.", value: 0 },
  { text: "The pen is mightier than the sword.", value: 1 },
  { text: "When in Rome, do as the Romans.", value: 2 },
];

<SearchInput
  label="Enter the text value, the pop-up list box:"
  value=""
  required={true}
  isShow={true}
  enablePopup={true}
  popItems={popItems}
  lazySearch={lazySearch}
  onSearch={(value) => {
    // value: 搜索框值
  }}
  onChange={(value) => {
    // value: 变化后的值
  }}
  onItemClick={(obj) => {
    // obj: { text, value } 选中项
  }}
  onClear={(value) => {
    // value: 清除前的值
  }}
/>
```
