# CategoryInput 分类输入框

> 分类：数据录入

该组件用于分类输入，支持同时定义文本框的名称，直接使用可简化样式定义，同时支持自定义样式，该组件同时支持必填设置与校验，同时可设置下拉列表框是否展示。


## API

| 方法名      | 描述                                                                          | 参数 | 返回值 |
| ----------- | ----------------------------------------------------------------------------- | ---- | ------ |
| getSelected | 返回当前分类搜索框的下拉选中项的值，即分类搜索的类别 | 无   | 分类搜索框的下拉项值  |
| getValue | 返回当前分类搜索框的文本框的值，即搜索关键词 | 无   | 分类搜索框文本框的值  |
| validate | required为true时可调用 | 无   | 判定两边都有值返回 true，否则为 false  |

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
|id|搜索输入框根节点的id|string| |
|className|搜索输入框根节点的样式类名|string| |
|style|覆盖搜索输入框根节点的行内样式|object| |
|selectClassName|下拉框的样式类名|string| |
|selectStyle|下拉框的行内样式|object| |
|categoryOptions| 设置下拉框的options,例如：[{text: "China",value: 1}, {text: "UK",value: 2}, {text: "USA",value: 3}]|array| |
|category|通过设置category 对应categoryOptions中的value值）来选中select中的对应项|any| |
|onCategoryChange|设置组件select部分的onChange事件<br><br>**签名:**<br>`function(value:any) => void`<br>*value:* 当前选中的select的value值|func| |
|placeholder|设置文本输入框的placeholder|string| |
|inputClassName|该属性是通过添加class的方式来控制input的样式|string| |
|inputStyle|该属性是通过添加style的方式来控制input的样式|object| |
|value|支持给input设置value值|any| |
|required|支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验|bool|false|
|disabled|设置组件的灰化|bool|false|
|onBlur|定义组件的输入框失去焦点时的事件<br><br>**签名:**<br>`function(event:object) => void`<br>*event:* 原生dom的event|func| |
|onChange|定义组件输入框内容改变时的事件<br><br>**签名:**<br>`function(value:any,oldValue:any,event:object) => void`<br>*value:* 当前输入框的值<br>*oldValue:* 上次输入框的值<br>*event:* 原生dom的event|func| |
|onFocus|定义组件聚焦时的事件<br><br>**签名:**<br>`function(event:object) => void`<br>*event:* 原生dom的event|func| |
|labelClassName|通过添加class的方式自定义label的名称的样式|string| |
|labelStyle|通过添加style的方式自定义label的名称的样式|object| |
|label|设置下拉框的名称文字|string| |
|labelPosition|设置输入框的名称文字的位置，before代表名称文字在输入框的左边，after代表名称文字在输入框的右边|enum:<br>&nbsp;'before'<br>&nbsp;'after'<br>|'before'|
|inputPosition|设置输入框的位置|enum:<br>&nbsp;'left'<br>&nbsp;'right'<br>|'right'|
|format|输入框的值类型|enum:<br>&nbsp;'number'<br>&nbsp;'any'<br>| |
|maxLength|设置输入框的最大可输入长度|number| |

## 接口定义

```typescript
import type { ChangeEvent } from 'react';

interface data {
  text: string;
  value: any;
}

interface CategoryInput {


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
   * 下拉框的样式类名。
   */
  selectClassName: string;

  /**
   * 下拉框的行内样式。
   */
  selectStyle: object;

  /**
   * 设置下拉框的options;例如：[{text: "China";value: 1}; {text: "UK";value: 2}; {text: "USA";value: 3}]
   */
  categoryOptions: data[];

  /**
   * 通过设置category 对应categoryOptions中的value值）来选中select中的对应项
   */
  category: any;

  /**
   * 设置组件select部分的onChange事件，参数为：
   * @param {any} value 当前选中的select的value值
   */
  onCategoryChange: (value: string) => unknown;

  /**
   * 设置文本输入框的placeholder
   */
  placeholder: string;

  /**
   * 该属性是通过添加class的方式来控制input的样式
   */
  inputClassName: string;

  /**
   * 该属性是通过添加style的方式来控制input的样式
   */
  inputStyle: object;

  /**
   *  支持给input设置value值
   */
  value: any;

  /**
   *  支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验
   */
  required: boolean;

  /**
   * 设置组件的灰化
   */
  disabled: boolean;

  /**
   * 定义组件的输入框失去焦点时的事件
   *
   * @param {object} event 原生dom的event
   */
  onBlur: (e: FocusEvent) => unknown;

  /**
   * 定义组件输入框内容改变时的事件
   *
   * @param {string} value 当前输入框的值
   * @param {string} oldValue 上次输入框的值
   * @param {object} event 原生dom的event
   */
  onChange: (value: string, oldValue: string, e: ChangeEvent) => unknown;

  /**
   * 定义组件聚焦时的事件
   *
   * @param {object} event 原生dom的event
   */
  onFocus: (e: FocusEvent) => unknown;

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
   * 设置输入框的位置
   */
  inputPosition: 'left' | 'right';

  /**
   * 输入框的值类型
   */
  format: 'number' | 'any';

  selectedIndex: number;

  selectOptions: any;

  onSelectClick: any;

}
```

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import CategoryInput from 'eview-ui/CategoryInput';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CategoryInputExample extends React.Component {

  state = {
    msg: '',
  };

  handleClick = () => {
    this.setState({ msg: "validate API: " + this.categoryInput.validate() });
  };
  handleGetCategory = () => {
    this.setState({ msg: "getCategory API: " + this.categoryInput.getCategory() });
  };
  handleGetValue = () => {
    this.setState({ msg: "getValue API: " + this.categoryInput.getValue() });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const options = [
      { text: 'NE1', value: 1 },
      { text: 'NE2', value: 2 },
      { text: 'NE3', value: 3 },
    ];
    let labelStyle = {
      display: "inline-block",
      width: "150px",
      marginLeft: "20px"
    };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{ marginBottom: "25px", marginTop: '20px' }}>
            <CategoryInput label="Default Style" inputPosition={'left'} labelStyle={labelStyle}
              inputClassName={'eui_category_input'} categoryOptions={options}
              selectStyle={{ width: '80px' }}
              inputStyle={{ width: '220px' }}
              category={2}
              placeholder="Please enter..." />
          </div>
          <div style={{ marginBottom: "25px", paddingTop: '20px' }}>
            <CategoryInput label="Disabled Style" inputPosition={'right'} labelStyle={labelStyle}
              inputClassName={'eui_category_input'} categoryOptions={options} disabled={true}
              selectStyle={{ width: '80px' }}
              inputStyle={{ width: '220px' }}
              placeholder="Please enter..." />
          </div>
          <div style={{ marginBottom: "25px", paddingTop: '20px' }}>
            <CategoryInput label="Required Style" inputPosition={'left'} labelStyle={labelStyle} required={true}
              categoryOptions={options}
              selectStyle={{ width: '80px' }}
              inputStyle={{ width: '220px' }}
              placeholder="Please enter..." />
          </div>
          <div style={{ marginBottom: "25px", paddingTop: '20px' }}>
            <CategoryInput label="Required Style" inputPosition={'right'} labelStyle={labelStyle} required={true}
              categoryOptions={options}
              selectStyle={{ width: '80px' }}
              inputStyle={{ width: '220px' }}
              placeholder="Please enter..."
              ref={input => { this.categoryInput = input }} />
          </div>
          <div>
            <Button text='validate' style={{ marginLeft: '20px' }} onClick={this.handleClick} />
            <Button text='getCategory' style={{ marginLeft: '20px' }} onClick={this.handleGetCategory} />
            <Button text='getValue' style={{ marginLeft: '20px' }} onClick={this.handleGetValue} />
            {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "560px" }} /> : ''}
          </div>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CategoryInputExample />, mountNode);

```

### 事件处理

事件处理

```jsx
import CategoryInput from 'eview-ui/CategoryInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


const popItems = [{ text: "a", value: 1 }, { text: "ab", value: 2 }, { text: "abc", value: 3 }];

export default class CategoryInputEventExample extends React.Component {
  state = {
    msg: '',
    data: popItems,
    value: '',
    selectedValue: '',
  };

  handleChange = (value) => {
    this.setState({ msg: "onChange callback, Value : " + value, value: value });
  };

  handleBlur = (e) => {
    this.setState({ msg: "onBlur callback, Value : " + e.target.value, value: e.target.value });
  };

  handleFocus = (e) => {
    this.setState({ msg: "onFocus callback, Value : " + e.target.value, value: e.target.value });
  };

  handleCategoryChange = (val) => {
    this.setState({ msg: "onCategoryChange callback, Value : " + val});
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
    const labelStyle = {
      display: 'block',
      fontSize: '14px',
      marginBottom: '10px',
      paddingLeft: '0px',
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px' }}>
          <div>
            <div style={{ display: "inline-block", marginRight: "30px" }}>
              <LabelField style={labelStyle}>Event callback</LabelField>
            </div>
            <div style={{ display: "inline-block" }}>
              <CategoryInput categoryOptions={options}
                inputValue={this.state.value}
                placeholder="Please enter..."
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onCategoryChange={this.handleCategoryChange}
              />
            </div>
          </div>
          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '500px', }} /> : ''}
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<CategoryInputEventExample />, mountNode);

```

