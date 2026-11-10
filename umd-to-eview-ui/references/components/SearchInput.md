# SearchInput 搜索框

> 分类：数据录入

该组件用于搜索关键词弹出列表框，支持回车和鼠标点击触发搜索，同时可设置下拉列表框是否展示。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Input.Search` | `SearchInput` | **`onSearch(value)` 触发时机比 antd 宽**——点图标/回车/**文本值变化时均触发**，必须加防抖或只在回车分支处理；`onChange(value)`（仅值）；`onClear(value)`；`maxLength`→**`maxLengthInput`**；下拉建议 `popItems=[{text,value}]` 与 `onSuggest` **互斥不能同设**；`labelPosition="after"` 布局文档明言不正确，勿用 |

## API

| 方法名 | 描述 | 参数 | 返回 |
|---|---|---|---|
|getValue|当get取值方法称为返回当前文本框中的|不|当前文本框中的值|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  搜索输入框根节点的id。 | string |  |
| className |  搜索输入框根节点的样式类名。 | string |  |
| style |  覆盖搜索输入框根节点的行内样式。 | object |  |
| inputClassName |  输入框的样式类名。 | string |  |
| inputStyle |  覆盖搜索框的行内样式。 | object |  |
| inputProps |  不建议使用!!!<br><br>额外可以添加的input原生属性，会覆盖掉组件自定义的与input原生属性相关的属性，例如会导致maxLengthInput、disabled等失效。 | object |  |
| labelClassName |  通过添加class的方式自定义label的名称的样式 | string |  |
| labelStyle |  通过添加style的方式自定义label的名称的样式 | object |  |
| label |  设置下拉框的名称文字 | string |  |
| showPopUp |  当用户将参数值设置为true时，弹出信息提示框。当用户将参数值设置为false时，隐藏信息提示框。 | bool | false |
| showTip | 目前无法控制tip不展示，在内容过长时仍是自动通过tip展示完整内容。<br><br>控制tip的展示，当value长度超过文本框长度时展示 | bool | false |
| required |  指定其必填字段| bool | false |
| disabled |  禁用组件。 | bool | false |
| labelPosition |  目前默认的before表现正常，而after的布局是不正确的。<br><br>设置输入框的名称文字的位置 before代表名称文字在输入框的前面，after代表名称文字在输入框的后面 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| value |  搜索输入框的文本值。 | any |  |
| popItems |  下拉列表的内容，和onSuggest互斥，两者不能同时设置，格式如下： <br>[{ <br>text: "a", //文本内容 <br>value: 1 //内容标识 <br>}, ...] | array |  |
| placeholder |  搜索输入框的占位语。 | string |  |
| maxLengthInput |  输入框的最大输入长度 | number |  |
| zIndex | 该参数可覆盖输入框popUp的zIndex  | number | 9999 |
| onSearch |  点击搜索图标,或者在输入框按回车,或者当前输入框文本值发生变化时的回调。<br><br>**签名:**<br>`function(value: any) => void`<br>*value:* 当前搜索框的文本值。 | function |  |
| onSuggest |  当搜索框值变化时，调用该回调动态设置下拉列表内容,和popItems互斥，两者不能同时设置<br><br>**签名:**<br>`function(value: any) => Array`<br>*value:* 当前搜索输入框的value值<br> *returns* (Array): 返回下拉列表数据，数据格式和popItems一致 | function |  |
| onClear |  点击清除图标的回调。<br><br>**签名:**<br>`function(value: any) => void`<br>*value:* 当前搜索框的文本值。 | function |  |
| lazySearch |  Object that defines the lazy search options. If this property is defined, then the records that are being shown in the search suggestion drop down will be paged, and lazy loaded through the defined callback method. User need to provide only a set of 10 records at a time. The data structure is as : <br>`totalRecords`: The total number of search results for the searched string <br>`onLoadRecords`: The callback that will load next set of the data to be displayed in the popup. This method will have the index of the first element in the view port as the parameter. | object |  |
| onChange |  搜索框值更改触发事件。<br><br>**Signature:**<br>`function(value: string) => void`<br>*value:* The search string value after the change | function |  |
| onClick |  搜索框点击事件。<br><br>**Signature:**<br>`function(event: object) => void` | function |  |

## 接口定义

```typescript
import type { MouseEventHandler } from 'react';

interface items {
  text: string;
  value: string;
}

interface SearchInput {


  /**
   *  搜索输入框根节点的id。
   */
  id: string;

  /**
   *  搜索输入框根节点的样式类名。
   */
  className: string;

  /**
   * 传入该值可定制当前组件匹配的ucd规范，不传则默认aui2规范
   * 例如：
   * version='aui3'
   */
  version: string;

  /**
   * 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式
   * 例如：
   * theme='evening'
   */
  theme: string;

  /**
   * 覆盖搜索输入框根节点的行内样式。
   */
  style: object;

  required: boolean;

  /**
   * 设置组件的灰化
   */
  disabled: boolean;

  /**
   * 输入框的样式类名。
   */
  inputClassName: string;

  /**
   * 覆盖搜索框的行内样式。
   */
  inputStyle: object;

  /**
   * 通过添加class的方式自定义label的名称的样式
   */
  labelClassName: string;

  /**
   * 通过添加style的方式自定义label的名称的样式
   */
  labelStyle: object;

  /**
   * 设置下拉框的名称文字
   */
  label: string;

  /**
   * 设置输入框的名称文字的位置
   * before代表名称文字在输入框的左边，after代表名称文字在输入框的右边
   */
  labelPosition: 'before' | 'after';

  /**
   * 搜索输入框的文本值。
   */
  value: string;

  /**
   * 下拉列表的内容，和onSuggest互斥，两者不能同时设置，格式如下：
   * <br>[{
   * <br>text: "a"; //文本内容
   * <br>value: 1 //内容标识
   * <br>}; ...]
   */
  popItems: items[];

  /**
   * 搜索输入框的占位语。
   */
  placeholder: string;

  /**
   * To limit the charcter in search input box
   */
  maxLengthInput: number;

  /**
   * 点击搜索图标;或者在输入框按回车;或者当前输入框文本值发生变化时的回调。
   *
   * @param {any} value 当前搜索框的文本值。
   */
  onSearch: (value: string) => unknown;

  /**
   * 当搜索框值变化时，调用该回调动态设置下拉列表内容;和popItems互斥，两者不能同时设置
   *
   * @param {any} value 当前搜索输入框的value值
   * @returns {Array}  返回下拉列表数据，数据格式和popItems一致
   */
  onSuggest: (value: string) => unknown;

  onItemClick: (value: string, obj: any) => unknown;

  /**
   * 点击清除图标的回调。
   *
   * @param {any} value 当前搜索框的文本值。
   */
  onClear: (value: string) => unknown;

  /**
   *
   */
  showPopUp: boolean;

  /**
   * Object that defines the lazy search options.
   * If this property is defined; then the records that are being shown in the search suggestion drop down will
   * be paged; and lazy loaded through the defined callback method.
   * User need to provide only a set of 10 records at a time.
   * The data structure is as :
   * `totalRecords`: The total number of search results for the searched string
   * `onLoadRecords`: The callback that will load next set of the data to be displayed in the popup.
   * This method will have the index of the first element in the view port as the parameter.
   */
  lazySearch: object;

  /**
   *
   */
  inputProps: object;

  /**
   * Handler for search box value change.
   *
   * @param {string} value The search string value after the change
   */
  onChange: (value:string) => unknown;

  /**
   *  Popup close callback
   */
  onClosePopup: () => unknown;

  /**
   *  zIndex value for popup
   */
  zIndex: number;

  /**
   * 是否显示clearButton
   */
  clearButton: boolean;

  /**
   * 是否显示tip
   */
  showTip: boolean;

  /**
   * 通过添加style的方式自定义组件下拉项中图标样式
   */
  iconStyle: object;

  /**
   * 在聚焦时是否显示下拉列表
   */
  showSuggest: boolean;

  onBlur: () => unknown;

  onMouseEnter: MouseEventHandler<HTMLInputElement>;

  onMouseLeave: MouseEventHandler<HTMLInputElement>;

  onClick: MouseEventHandler<HTMLInputElement>;

  onFocus: MouseEventHandler<HTMLInputElement>;

  disable: boolean;

  searchable: boolean;

  title: string;
}

export type SearchInputProps = Partial<SearchInput>;
```

## 使用示例

### 基本属性设置

## en-US

```jsx
import SearchInput from "eview-ui/SearchInput";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class SearchInputSimpleExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let style = { margin: "15px 20px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider  version={version} theme={theme}>
        <div>
          <div style={style}>
            <SearchInput
              label="Default style"
              labelStyle={labelStyle}
              placeholder="search"
            />
            <br/>
            <br/>
            <SearchInput
              label="Limit 5 Character"
              required={true}
              labelStyle={labelStyle}
              placeholder="search"
              maxLengthInput={5}
            />
            <br/>
            <br/>
            <SearchInput
              label="Additional Input props"
              labelStyle={labelStyle}
              inputProps={{maxLength: 8}}
            />
            <br/>
            <br/>
            <SearchInput
              label="Disabled Style"
              labelStyle={labelStyle}
              placeholder="search"
              disabled
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SearchInputSimpleExample/>, mountNode);
```

```jsx
import SearchInput from "eview-ui/SearchInput";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class SearchInputSimpleExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let style = { margin: "15px 20px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider  version={version} theme={theme}>
        <div>
          <div style={style}>
            <SearchInput
              label="Default style"
              labelStyle={labelStyle}
              placeholder="search"
            />
            <br/>
            <br/>
            <SearchInput
              label="Limit 5 Character"
              required={true}
              labelStyle={labelStyle}
              placeholder="search"
              maxLengthInput={5}
            />
            <br/>
            <br/>
            <SearchInput
              label="Additional Input props"
              labelStyle={labelStyle}
              inputProps={{maxLength: 8}}
            />
            <br/>
            <br/>
            <SearchInput
              label="Disabled Style"
              labelStyle={labelStyle}
              placeholder="search"
              disabled
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SearchInputSimpleExample/>, mountNode);
```

### 事件处理

## en-US

```jsx
import SearchInput from "eview-ui/SearchInput";
import LabelField from "eview-ui/LabelField";
import DivMessage from "eview-ui/DivMessage";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const popItems = [
  { text: "a", value: 1 },
  { text: "ab", value: 2 },
  { text: "abc", value: 3 }
];

export default class SearchInputExample extends React.Component {
  state = {
    msg: "",
    popItems: popItems,
    value1: "",
    value2: ""
  };

  handleSearch1 = value => {
    this.setState({
      msg: "onSearch event,Value of input box is : " + value,
      value1: value
    });
  };

  handleSearch2 = value => {
    this.setState({
      msg: "onSearch event,Value of input box is : " + value,
      value2: value
    });
  };

  handleChange1 = value => {
    this.setState({
      msg: "onChange event,Value of input box is : " + value,
      value1: value
    });
  };

  handleChange2 = value => {
    this.setState({
      msg: "onChange event,Value of input box is : " + value,
      value2: value
    });
  };

  handleItemClick1 = value => {
    this.setState({
      msg: "onItemClick event,Value is : " + value,
      value1: value
    });
  };

  handleItemClick2 = value => {
    this.setState({
      msg: "onItemClick event,Value is : " + value,
      value2: value
    });
  };

  handleSuggest = value => {
    let data = [];
    popItems.map((item, index) => {
      if (
        item.text
          .toLocaleUpperCase()
          .match(new RegExp(value.toLocaleUpperCase(), "g"))
      ) {
        data.push(item);
      }
    });
    return data;
  };

  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = { margin: "20px" };
    const labelStyle = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: "0px"
    };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={divStyle}>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "30px" }}>
              <LabelField style={labelStyle}>
                静态设置选项
              </LabelField>
            </div>
            <SearchInput
              onSearch={this.handleSearch1}
              onChange={this.handleChange1}
              onItemClick={this.handleItemClick1}
              popItems={this.state.popItems}
              value={this.state.value1}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "30px" }}>
              <LabelField style={labelStyle}>
                动态设置选项
              </LabelField>
            </div>
            <SearchInput
              onSearch={this.handleSearch2}
              onChange={this.handleChange2}
              onItemClick={this.handleItemClick2}
              onSuggest={this.handleSuggest}
              value={this.state.value2}
            />
          </div>
          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{ marginTop: "10px", width: "600px" }}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SearchInputExample />, mountNode);
```

```jsx
import SearchInput from "eview-ui/SearchInput";
import LabelField from "eview-ui/LabelField";
import DivMessage from "eview-ui/DivMessage";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const popItems = [
  { text: "a", value: 1 },
  { text: "ab", value: 2 },
  { text: "abc", value: 3 }
];

export default class SearchInputExample extends React.Component {
  state = {
    msg: "",
    popItems: popItems,
    value1: "",
    value2: ""
  };

  handleSearch1 = value => {
    this.setState({
      msg: "onSearch event,Value of input box is : " + value,
      value1: value
    });
  };

  handleSearch2 = value => {
    this.setState({
      msg: "onSearch event,Value of input box is : " + value,
      value2: value
    });
  };

  handleChange1 = value => {
    this.setState({
      msg: "onChange event,Value of input box is : " + value,
      value1: value
    });
  };

  handleChange2 = value => {
    this.setState({
      msg: "onChange event,Value of input box is : " + value,
      value2: value
    });
  };

  handleItemClick1 = value => {
    this.setState({
      msg: "onItemClick event,Value is : " + value,
      value1: value
    });
  };

  handleItemClick2 = value => {
    this.setState({
      msg: "onItemClick event,Value is : " + value,
      value2: value
    });
  };

  handleSuggest = value => {
    let data = [];
    popItems.map((item, index) => {
      if (
        item.text
          .toLocaleUpperCase()
          .match(new RegExp(value.toLocaleUpperCase(), "g"))
      ) {
        data.push(item);
      }
    });
    return data;
  };

  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = { margin: "20px" };
    const labelStyle = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: "0px"
    };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={divStyle}>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "30px" }}>
              <LabelField style={labelStyle}>
                静态设置选项
              </LabelField>
            </div>
            <SearchInput
              onSearch={this.handleSearch1}
              onChange={this.handleChange1}
              onItemClick={this.handleItemClick1}
              popItems={this.state.popItems}
              value={this.state.value1}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "30px" }}>
              <LabelField style={labelStyle}>
                动态设置选项
              </LabelField>
            </div>
            <SearchInput
              onSearch={this.handleSearch2}
              onChange={this.handleChange2}
              onItemClick={this.handleItemClick2}
              onSuggest={this.handleSuggest}
              value={this.state.value2}
            />
          </div>
          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{ marginTop: "10px", width: "600px" }}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SearchInputExample />, mountNode);
```

### 懒加载结果

## en-US

```jsx
import SearchInput from "eview-ui/SearchInput";
import DivMessage from "eview-ui/DivMessage";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SearchInputLazyResults extends React.Component {
  state = {
    isShow: false,
    msg: "",
    data: [],
    value: "",
    lazyOptions: { totalRecords: 0, onLoadRecords: this.handleLoadRecords }
  };
  findMatchedResult = value => {
    // Search result fetch has to be a very optimized logic and may involve server calls to get the relevant data.
    // Also, frequent calls to search also will have to be intelligently handled to avoid unwanted search executions.
    const result = [];
    for (let i = 0; i < PHRASE_DICTIONARY.length; i++) {
      if (
        PHRASE_DICTIONARY[i].toLowerCase().indexOf(value.toLowerCase()) === 0
      ) {
        result.push({ text: PHRASE_DICTIONARY[i], value: i });
      }
    }
    return result;
  };
  handleSuggest = value => {
    let result;
    if (value) result = this.findMatchedResult(value);
    else result = [];
    const data = result.slice(0, 10);
    // const data = result;
    this.setState({
      data,
      resultSet: result,
      isShow: true,
      msg: "onSuggest event, the current input box value is: " + value,
      value: value,
      lazyOptions: {
        totalRecords: result.length,
        onLoadRecords: this.handleLoadRecords
      }
    });
  };
  handleSearchChange = value => {
    let result;
    if (value) result = this.findMatchedResult(value);
    else result = [];

    const data = result.slice(0, 10);
    // const data = result;
    this.setState({
      data,
      resultSet: result,
      isShow: true,
      msg: "onChange event, the current input box value is: " + value,
      value: value,
      lazyOptions: {
        totalRecords: result.length,
        onLoadRecords: this.handleLoadRecords
      }
    });
  };
  handleSearch = value => {
    let result;
    if (value) result = this.findMatchedResult(value);
    else result = [];
    const data = result.slice(0, 10);
    // const data = result;
    this.setState({
      data,
      resultSet: result,
      isShow: true,
      msg: "onSearch event, the current input box value is: " + value,
      value: value,
      lazyOptions: {
        totalRecords: result.length,
        onLoadRecords: this.handleLoadRecords
      }
    });
  };

  handleClick = obj => {
    this.setState({
      data: [
        { text: "a", value: 1 },
        { text: "b", value: 2 },
        { text: "c", value: 3 }
      ],
      isShow: false,
      msg:
        "OnItemClick event, click the value of the drop-down item: " +
        obj.value,
      value: obj.text
    });
  };
  handleClear = () => {
    this.setState(() => ({
      data: [],
      isShow: false,
      value: ""
    }));
  };

  handleLoadRecords = index => {
    const newdata = this.state.resultSet.slice(index, index + 10);
    this.setState(() => ({
      data: newdata
    }));
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>
          <SearchInput
            label="Enter the text value, the pop-up list box:"
            value={this.state.value}
            onSearch={this.handleSearch}
            isShow={this.state.isShow}
            popItems={this.state.data}
            enablePopup={true}
            onItemClick={this.handleClick}
            onChange={this.handleSearchChange}
            onClear={this.handleClear}
            lazySearch={this.state.lazyOptions}
            required={true}
          />
          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{ marginTop: "10px", width: "600px" }}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

const PHRASE_DICTIONARY = [
  "Two wrongs don't make a right.",
  "The pen is mightier than the sword.",
  "When in Rome, do as the Romans.",
  "The squeaky wheel gets the grease.",
  "When the going gets tough, the tough get going.",
  "No man is an island.",
  "Fortune favors the bold.",
  "People who live in glass houses should not throw stones.",
  "Hope for the best, but prepare for the worst.",
  "Better late than never.",
  "Birds of a feather flock together."
];

ReactDOM.render(<SearchInputLazyResults />, mountNode);
```

```jsx
import SearchInput from "eview-ui/SearchInput";
import DivMessage from "eview-ui/DivMessage";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SearchInputLazyResults extends React.Component {
  state = {
    isShow: false,
    msg: "",
    data: [],
    value: "",
    lazyOptions: { totalRecords: 0, onLoadRecords: this.handleLoadRecords }
  };
  findMatchedResult = value => {
    // Search result fetch has to be a very optimized logic and may involve server calls to get the relevant data.
    // Also, frequent calls to search also will have to be intelligently handled to avoid unwanted search executions.
    const result = [];
    for (let i = 0; i < PHRASE_DICTIONARY.length; i++) {
      if (
        PHRASE_DICTIONARY[i].toLowerCase().indexOf(value.toLowerCase()) === 0
      ) {
        result.push({ text: PHRASE_DICTIONARY[i], value: i });
      }
    }
    return result;
  };
  handleSuggest = value => {
    let result;
    if (value) result = this.findMatchedResult(value);
    else result = [];
    const data = result.slice(0, 10);
    // const data = result;
    this.setState({
      data,
      resultSet: result,
      isShow: true,
      msg: "onSuggest event, the current input box value is: " + value,
      value: value,
      lazyOptions: {
        totalRecords: result.length,
        onLoadRecords: this.handleLoadRecords
      }
    });
  };
  handleSearchChange = value => {
    let result;
    if (value) result = this.findMatchedResult(value);
    else result = [];

    const data = result.slice(0, 10);
    // const data = result;
    this.setState({
      data,
      resultSet: result,
      isShow: true,
      msg: "onChange event, the current input box value is: " + value,
      value: value,
      lazyOptions: {
        totalRecords: result.length,
        onLoadRecords: this.handleLoadRecords
      }
    });
  };
  handleSearch = value => {
    let result;
    if (value) result = this.findMatchedResult(value);
    else result = [];
    const data = result.slice(0, 10);
    // const data = result;
    this.setState({
      data,
      resultSet: result,
      isShow: true,
      msg: "onSearch event, the current input box value is: " + value,
      value: value,
      lazyOptions: {
        totalRecords: result.length,
        onLoadRecords: this.handleLoadRecords
      }
    });
  };

  handleClick = obj => {
    this.setState({
      data: [
        { text: "a", value: 1 },
        { text: "b", value: 2 },
        { text: "c", value: 3 }
      ],
      isShow: false,
      msg:
        "OnItemClick event, click the value of the drop-down item: " +
        obj.value,
      value: obj.text
    });
  };
  handleClear = () => {
    this.setState(() => ({
      data: [],
      isShow: false,
      value: ""
    }));
  };

  handleLoadRecords = index => {
    const newdata = this.state.resultSet.slice(index, index + 10);
    this.setState(() => ({
      data: newdata
    }));
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>
          <SearchInput
            label="Enter the text value, the pop-up list box:"
            value={this.state.value}
            onSearch={this.handleSearch}
            isShow={this.state.isShow}
            popItems={this.state.data}
            enablePopup={true}
            onItemClick={this.handleClick}
            onChange={this.handleSearchChange}
            onClear={this.handleClear}
            lazySearch={this.state.lazyOptions}
            required={true}
          />
          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{ marginTop: "10px", width: "600px" }}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

const PHRASE_DICTIONARY = [
  "Two wrongs don't make a right.",
  "The pen is mightier than the sword.",
  "When in Rome, do as the Romans.",
  "The squeaky wheel gets the grease.",
  "When the going gets tough, the tough get going.",
  "No man is an island.",
  "Fortune favors the bold.",
  "People who live in glass houses should not throw stones.",
  "Hope for the best, but prepare for the worst.",
  "Better late than never.",
  "Birds of a feather flock together."
];

ReactDOM.render(<SearchInputLazyResults />, mountNode);
```

