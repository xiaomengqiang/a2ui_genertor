# CategorySearch 分类搜索框

> 分类：数据录入

该组件用于分类搜索关键词弹出列表框，支持回车和鼠标点击触发搜索，同时可设置下拉列表框是否展示。


## API

| 方法名      | 参数 | 返回值 | 描述                                                                          |
| ----------- | ---- | ------ | ----------------------------------------------------------------------------- |
| getSelected | 无   | 分类搜索框的下拉项值  | 返回当前分类搜索框的下拉选中项的值，即分类搜索的类别 |
| getValue | 无   | 分类搜索框文本框的值  | 返回当前分类搜索框的文本框的值，即搜索关键词 |


### 属性


| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| id |  搜索输入框根节点的id。 | string |  |
| className |  搜索输入框根节点的样式类名。 | string |  |
| style |  覆盖搜索输入框根节点的行内样式。 | object |  |
| inputClassName |  输入框的样式类名。 | string |  |
| inputStyle |  覆盖搜索框的行内样式。 | object |  |
| inputProps |  设置搜索框属性。 | object |  |
| selectClassName |  下拉框的样式类名。 | string |  |
| selectStyle |  下拉框的行内样式。 | object |  |
| labelClassName |  通过添加class的方式自定义label的名称的样式 | string |  |
| labelStyle |  通过添加style的方式自定义label的名称的样式 | object |  |
| label |  设置下拉框的名称文字 | string |  |
| labelPosition |  设置输入框的名称文字的位置 before代表名称文字在输入框的左边，after代表名称文字在输入框的右边 | enum:<br>&nbsp;'before'<br>&nbsp;'after'<br> | 'before' |
| showPopUp | 当用户将参数值设置为true时，弹出信息提示框。当用户将参数值设置为false时，隐藏信息提示框。 | bool | false |
| disabled |  禁用组件。 | bool | false |
| categoryOptions |  设置下拉框的options,例如：[{text: "China",value: 1}, {text: "UK",value: 2}, {text: "USA",value: 3}] | array |  |
| category |  通过设置category（对应categoryOptions中的value值）来选中select中的对应项 | any |  |
| value |  设置搜索输入框的值 | any |  |
| popItems |  下拉列表的内容，和onSuggest互斥，两者不能同时设置，格式如下： <br>[{ <br>text: "a", //文本内容 <br>value: 1 //内容标识 <br>}, ...] | array |  |
| placeholder |  搜索输入框的占位语。 | string |  |
| onSearch |  点击搜索图标或者在输入框按回车时的回调。<br><br>**签名:**<br>`function(category: any, value: any) => void`<br>*category:* 当前分类搜索框的下拉选中项的值，即分类搜索的类别。 *value:* 当前搜索框的文本值。 | function |  |
| onClear |  点击清除图标的回调。<br><br>**签名:**<br>`function(oldValue: any ,newValue: any ) => void`<br>*oldValue:* 当前搜索框的文本值。 * newValue：*搜索框的空值。| function |  |
| onCategoryChange |  设置select的onChange事件，参数为：<br><br>**签名:**<br>`function(value: any) => void`<br>*value:* 当前选中的select的value值 | function |  |
| onSearchChange |  搜索框文本发生变化回调函数，参数为：<br><br>**Signature:**<br>`function(value: any) => void`<br>*value:* 搜索字符串值| function |  |
| onSuggest |  当搜索框值变化时，调用该回调动态设置下拉列表内容，和popItems互斥，两者不能同时设置<br><br>**签名:**<br>`function(value: any) => Array`<br>*value:* 当前搜索输入框的value值<br> *returns* (Array): 返回下拉列表数据，数据格式和popItems一致 | function |  |

## 接口定义

```typescript
interface CategorySearch {

  /**
   *  搜索输入框根节点的id。
   */
  id: string;

  /**
   *  搜索输入框根节点的样式类名。
   */
  className: string;

  /**
   *  传入该值可定制当前组件匹配的ucd规范，不传则默认aui2规范。
   */
  version: string;

  /**
   *  传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式。
   */
  theme: string;

  /**
   * 覆盖搜索输入框根节点的行内样式。
   */
  style: object;

  /**
   * 输入框的样式类名。
   */
  inputClassName: string;

  /**
   * 覆盖搜索框的行内样式。
   */
  inputStyle: object;

  /**
   * 下拉框的样式类名。
   */
  selectClassName: string;

  /**
   * 下拉框的行内样式。
   */
  selectStyle: object;

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
   * 设置下拉框的options;例如：[{text: "China";value: 1}; {text: "UK";value: 2}; {text: "USA";value: 3}]
   */
  categoryOptions: any;

  /**
   * 通过设置category（对应categoryOptions中的value值）来选中select中的对应项
   */
  category: any;

  /**
   * 设置搜索输入框的值
   */
  value: any;

  /**
   * 下拉列表的内容，和onSuggest互斥，两者不能同时设置，格式如下：
   * <br>[{
   * <br>text: "a"; //文本内容
   * <br>value: 1 //内容标识
   * <br>}; ...]
   */
  popItems: any;

  /**
   * 搜索输入框的占位语。
   */
  placeholder: string;

  /**
   * 点击搜索图标或者在输入框按回车或者当前输入框文本值发生变化时的回调。
   *
   * @param {any} value 当前搜索框的文本值。
   */
  onSearch: (selectedValue: string, value: string) => unknown;

  /**
   * 点击清除图标的回调。
   *
   * @param {any} value 当前搜索框的文本值。
   */
  onClear: (oldVal: string, newVal: string) => unknown;

  /**
   * 设置select的onChange事件，参数为：
   *
   * @param {any} value 当前选中的select的value值
   */
  onCategoryChange: (val: string) => unknown;

  /**
   * 当搜索框值变化时，调用该回调动态设置下拉列表内容，和popItems互斥，两者不能同时设置
   *
   * @param {any} value 当前搜索输入框的value值
   * @returns {Array}  返回下拉列表数据，数据格式和popItems一致
   */
  onSuggest: (val: string) => unknown;

  inputProps: object;

  /**
   * disabled
   */
  disabled: boolean;

  onSearchChange: (val: string) => unknown;

  showPopUp: boolean;

  selectedIndex: number;

}
```

## 使用示例

### 基本属性设置

基本属性设置

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

事件处理

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
      msg: `onCategoryChange callback,Selected Value : ${typeValue}`,
      selectedValue1: typeValue,
    });
  };


  handleCategoryChange2 = (typeValue) => {
    this.setState({
      msg: `onCategoryChange callback,Selected Value : ${typeValue}`,
      selectedValue2: typeValue,
    });
  };

  handleSearch1 = (typeValue, searchValue) => {
    this.setState({
      msg: `onSearch callback,Selected Value : ${typeValue}, ${searchValue}`,
      value1: searchValue,
      selectedValue1: typeValue,
    });
  };

  handleSearch2 = (typeValue, searchValue) => {
    this.setState({
      msg: `onSearch callback,Selected Value : ${typeValue}, ${searchValue}`,
      value2: searchValue,
      selectedValue2: typeValue,
    });
  };

  handleClear1 = () => {
    this.setState({
      value1: '',
    });
  };

  handleClear2 = () => {
    this.setState({
      value2: '',
    });
  };

  handleSuggest = value => {
    let data = [];
    popItems.map((item, index) => {
      if (item.text.toLocaleUpperCase().match(new RegExp(value.toLocaleUpperCase(), "g"))) {
        data.push(item);
      }
    });
    return data;
  };

  render() {
    const [version, theme] = getDemoVersion();
    const options = [
      {
        text: 'China',
        value: 'China',
      },
      {
        text: 'UK',
        value: 'UK',
      },
      {
        text: 'USA',
        value: 'USA',
      },
    ];

    const lineStyle = {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 16
    }

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
          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '500px', }} /> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CategorySearchEventExample />, mountNode);

```

