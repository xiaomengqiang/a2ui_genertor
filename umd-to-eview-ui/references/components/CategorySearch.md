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

interface CategorySearch {

  id: string;
  className: string;
  version: string;
  theme: string;
  style: React.CSSProperties;

  inputClassName: string;
  inputStyle: React.CSSProperties;
  inputProps: object;

  selectClassName: string;
  selectStyle: React.CSSProperties;

  labelClassName: string;
  labelStyle: React.CSSProperties;
  label: string;
  labelPosition: 'before' | 'after';

  categoryOptions: CategoryOption[];
  category: any;
  selectedIndex: number;

  value: any;
  popItems: PopItem[];
  placeholder: string;
  showPopUp: boolean;
  disabled: boolean;

  onSearch: (category: any, value: string) => unknown;
  onClear: (oldValue: any, newValue: string) => unknown;
  onCategoryChange: (value: any) => unknown;
  onSearchChange: (value: string) => unknown;
  onSuggest: (value: string) => PopItem[] | unknown;

}

export type Props = Partial<CategorySearch>;
```

## 使用示例

### 基本属性设置

基本属性设置，展示默认样式、maxLength 限制和禁用状态

```jsx
import CategorySearch from 'eview-ui/CategorySearch';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CategorySearchExample extends React.Component {

  state = {
    msg: '',
  };

  handleGetCategory = () => {
    this.setState({ msg: "getCategory API: " + this.categorySearch.getCategory() });
  };
  handleGetValue = () => {
    this.setState({ msg: "getValue API: " + this.categorySearch.getValue() });
  };

  render() {
    const options = [
      { text: 'China', value: 1 },
      { text: 'UK', value: 2 },
      { text: 'USA', value: 3 },
    ];
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginBottom: "25px", paddingTop: '20px'}}>
          <CategorySearch categoryOptions={options} category={2} ref={search => {
            this.categorySearch = search
          }}/>
          <br/> <br/>
          <Button text='getCategory' onClick={this.handleGetCategory}/>
          <Button text='getValue' style={{marginLeft: '20px'}} onClick={this.handleGetValue}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
          <br/> <br/>
          <CategorySearch categoryOptions={options} category={2} placeholder={"Max length 10"}
                          inputProps={{maxLength: 10}} inputStyle={{width: "300px"}}/>
          <br/> <br/>
          <CategorySearch categoryOptions={options} category={2} disabled/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CategorySearchExample />, mountNode);

```

### 事件处理

事件处理，展示 onSearch、onClear、onCategoryChange 回调，以及 popItems（静态下拉）和 onSuggest（动态下拉）两种模式

```jsx
import CategorySearch from 'eview-ui/CategorySearch';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const popItems = [{ text: "a", value: 1 }, { text: "ab", value: 2 }, { text: "abc", value: 3 }];

export default class CategorySearchEventExample extends React.Component {
  state = {
    msg: '',
    data: popItems,
    value1: '',
    selectedValue1: '',
    value2: '',
    selectedValue2: '',
  };

  handleCategoryChange1 = (typeValue) => {
    this.setState({
      msg: `onCategoryChange callback, Selected Value: ${typeValue}`,
      selectedValue1: typeValue,
    });
  };

  handleCategoryChange2 = (typeValue) => {
    this.setState({
      msg: `onCategoryChange callback, Selected Value: ${typeValue}`,
      selectedValue2: typeValue,
    });
  };

  handleSearch1 = (typeValue, searchValue) => {
    this.setState({
      msg: `onSearch callback, Category: ${typeValue}, Value: ${searchValue}`,
      value1: searchValue,
      selectedValue1: typeValue,
    });
  };

  handleSearch2 = (typeValue, searchValue) => {
    this.setState({
      msg: `onSearch callback, Category: ${typeValue}, Value: ${searchValue}`,
      value2: searchValue,
      selectedValue2: typeValue,
    });
  };

  handleClear1 = (oldValue, newValue) => {
    this.setState({
      msg: `onClear callback, OldValue: ${oldValue}, NewValue: ${newValue}`,
      value1: '',
    });
  };

  handleClear2 = (oldValue, newValue) => {
    this.setState({
      msg: `onClear callback, OldValue: ${oldValue}, NewValue: ${newValue}`,
      value2: '',
    });
  };

  handleSuggest = value => {
    let data = [];
    popItems.map((item) => {
      if (item.text.toLocaleUpperCase().match(new RegExp(value.toLocaleUpperCase(), "g"))) {
        data.push(item);
      }
    });
    return data;
  };

  render() {
    const [version, theme] = getDemoVersion();
    const options = [
      { text: 'China', value: 'China' },
      { text: 'UK', value: 'UK' },
      { text: 'USA', value: 'USA' },
    ];

    const lineStyle = {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 16
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px' }}>
          <div style={lineStyle}>
            <div style={{ display: "inline-block", marginRight: "30px" }}>
              <LabelField>Static drop-down options</LabelField>
            </div>
            <div style={{ display: "inline-block" }}>
              <CategorySearch
                categoryOptions={options}
                category={this.state.selectedValue1}
                value={this.state.value1}
                onCategoryChange={this.handleCategoryChange1}
                onSearch={this.handleSearch1}
                onClear={this.handleClear1}
                popItems={this.state.data}
              />
            </div>
          </div>
          <div style={lineStyle}>
            <div style={{ display: "inline-block", marginRight: "20px" }}>
              <LabelField>Dynamic drop-down options</LabelField>
            </div>
            <div style={{ display: "inline-block" }}>
              <CategorySearch
                categoryOptions={options}
                category={this.state.selectedValue2}
                value={this.state.value2}
                onCategoryChange={this.handleCategoryChange2}
                onSearch={this.handleSearch2}
                onClear={this.handleClear2}
                onSuggest={this.handleSuggest}
              />
            </div>
          </div>
          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '500px' }} /> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CategorySearchEventExample />, mountNode);

```

### 主题与版本

通过 version 和 theme 属性控制组件外观规范

```jsx
import CategorySearch from 'eview-ui/CategorySearch';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CategorySearchThemeExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const options = [
      { text: 'China', value: 1 },
      { text: 'UK', value: 2 },
    ];
    return (
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginTop: '20px', marginLeft: '20px' }}>
          <CategorySearch
            categoryOptions={options}
            category={1}
            version="aui3"
            theme="theme_dark"
            placeholder="Please enter..."
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CategorySearchThemeExample />, mountNode);
```

