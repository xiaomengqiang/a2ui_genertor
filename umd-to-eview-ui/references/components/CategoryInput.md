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
import type { ChangeEvent, FocusEvent } from 'react';

interface CategoryOption {
  text: string;
  value: any;
}

interface CategoryInput {

  id: string;
  className: string;
  version: string;
  theme: string;
  style: React.CSSProperties;
  selectClassName: string;
  selectStyle: React.CSSProperties;
  categoryOptions: CategoryOption[];
  category: any;
  selectedIndex: number;
  onCategoryChange: (value: any) => unknown;
  placeholder: string;
  inputClassName: string;
  inputStyle: React.CSSProperties;
  value: any;
  required: boolean;
  disabled: boolean;
  onBlur: (e: FocusEvent<HTMLInputElement>) => unknown;
  onChange: (value: any, oldValue: any, e: ChangeEvent<HTMLInputElement>) => unknown;
  onFocus: (e: FocusEvent<HTMLInputElement>) => unknown;
  labelClassName: string;
  labelStyle: React.CSSProperties;
  label: string;
  labelPosition: 'before' | 'after';
  inputPosition: 'left' | 'right';
  format: 'number' | 'any';
  maxLength: number;

}

export type Props = Partial<CategoryInput>;
```

## 使用示例

### 基本属性设置

基本属性设置，展示默认、禁用、必填样式，以及 validate / getCategory /getValue API 调用

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

事件处理，展示 onChange、onBlur、onFocus、onCategoryChange 回调

```jsx
import CategoryInput from 'eview-ui/CategoryInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CategoryInputEventExample extends React.Component {
  state = {
    msg: '',
    value: '',
  };

  handleChange = (value, oldValue, event) => {
    this.setState({ msg: "onChange callback, Value: " + value + ", OldValue: " + oldValue, value: value });
  };

  handleBlur = (e) => {
    this.setState({ msg: "onBlur callback, Value: " + e.target.value });
  };

  handleFocus = (e) => {
    this.setState({ msg: "onFocus callback, Value: " + e.target.value });
  };

  handleCategoryChange = (val) => {
    this.setState({ msg: "onCategoryChange callback, Value: " + val });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const options = [
      { text: 'China', value: 'China' },
      { text: 'UK', value: 'UK' },
      { text: 'USA', value: 'USA' },
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
                value={this.state.value}
                placeholder="Please enter..."
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onCategoryChange={this.handleCategoryChange}
              />
            </div>
          </div>
          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '500px' }} /> : ''}
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<CategoryInputEventExample />, mountNode);

```

### 主题与版本

通过 version 和 theme 属性控制组件外观规范

```jsx
import CategoryInput from 'eview-ui/CategoryInput';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CategoryInputThemeExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const options = [
      { text: 'Option1', value: 1 },
      { text: 'Option2', value: 2 },
    ];
    return (
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginTop: '20px', marginLeft: '20px' }}>
          <CategoryInput
            label="AUI3 Theme"
            categoryOptions={options}
            version="aui3"
            theme="theme_dark"
            selectStyle={{ width: '80px' }}
            inputStyle={{ width: '220px' }}
            placeholder="Please enter..."
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CategoryInputThemeExample />, mountNode);
```

