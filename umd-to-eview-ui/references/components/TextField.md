# TextField 单行文本输入框

> 分类：数据录入

该组件是用于文本输入的文本输入框，支持同时定义文本框的名称，直接使用可简化样式定义，同时支持自定义样式，该组件同时支持必填设置与校验，并给出错误提示，还可选择错误提示的位置,支持原生input的所有事件。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Input` | `TextField` | `placeholder` 同名保留；**`onChange(value1, value2, event)`**（新值/旧值/事件，**首参是值**）；无 `prefix`/`suffix`/`addonBefore`/`addonAfter`（手写外层 div 组合）；`type` 仅 `text`/`password`（数字输入用 `format="number"`）；`validator(value, id, type) => {result, message}`；无 `size`/`defaultValue`（默认值转初始 `value` state）；ref：`getValue()`/`validate()`/`focus()` |
| `Input.Password` | `TextField type="password"` | 加 `autoComplete="off"`（文档警告 BM 场景必传） |

## API

| 方法名      | 描述                   | 参数                           | 返回                                                                                       |
|----------|----------------------|------------------------------|------------------------------------------------------------------------------------------|
| getValue | 获取当前文本框中的值           | 无                            | 当前文本框中的值                                                                                 |
| validate | 用于手动进行非空检查，并返回是否通过校验 | 无                            | 校验结果，bool类型                                                                              |
| focus    | 用来设置文本框框聚焦           | 手动聚焦行为，可选{preventScroll:true | false}preventScroll的值为false（默认值），意味着浏览器在聚焦该元素后会将其滚动到视图中。如果preventScroll被设置为true，则不会发生滚动。 |无|

### 属性

| 属性名称               | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 输入                                            | 默认       |
|:-------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------|:---------|
| id                 | 组件默认设置动态id，且组件支持用户自定义id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | string                                        |          |
| type               | 指定要显示的输入类型 "password" 或者 "text". 默认值为文本类型.<br/>注意：如果类型为密码，则BM需要传递自动完成属性。 请参阅链接中的自动完成准则 <br/>  https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | enum:<br>&nbsp;'text'<br>&nbsp;'password'<br> | 'text'   |
| style              | 通过添加style的方式自定义该组件的整体样式（作用于最外层div） 例如：margin padding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | object                                        |          |
| className          | 通过添加class的方式自定义该组件的整体样式（作用于最外层div） 例如：margin padding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | string                                        |          |
| label              | 设置输入框的名称文字                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | string                                        |          |
| placeholder        | 设置文本输入框的placeholder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | string                                        |          |
| placement          | 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | string                                        | topLeft  |
| format             | 设置输入类型，当 format 为 number 时，只能输入数字，当不设置该属性或为 any 时，可以输入任意值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 'number'<br>&nbsp;'any'                       | any      |
| containerStyle     | 设置容器样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | object                                        |          |
| labelClassName     | 通过添加class的方式控制label的样式以及输入框和文本之间的间距                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | string                                        |          |
| labelStyle         | 通过添加style的方式控制label的样式以及输入框和文本之间的间距                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | object                                        |          |
| labelProps         | 设置label属性，参考LabelField组件属性                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | object                                        |          |
| inputClassName     | 该属性是通过添加class的方式来控制input的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | string                                        |          |
| inputStyle         | 该属性是通过添加style的方式来控制input的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | object                                        |          |
| value              | 支持给组件设置value值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | any                                           |          |
| useLatestValue     | receiveProps钩子默认会对比两次props里的value，只在不相同时进行setState。设置为true后，则强制set                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | bool                                          | false    |
| labelPosition      | 设置输入框的名称文字的位置 before代表名称文字在输入框的左边，after代表名称文字在输入框的右边                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br>  | "before" |
| required           | 支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | bool                                          | false    |
| hideRequiredMark   | 当required属性为true时，支持设置是否隐藏掉输入框前的*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | boolean                                       | false    |
| disabled           | 设置组件的灰化                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | bool                                          | false    |
| readOnly           | Set the component is read only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | bool                                          | false    |
| maxLength          | 设置文本域中最大的可输入长度，超过长度将不能继续输入                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | number                                        |          |
| tipDuration        | 校验气泡持续时间(ms)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | number                                        | 3000     |
| canPasswordPaste   | 是否允许粘贴密码                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | bool                                          | false    |
| autoComplete       | 是否自动填充表单, 默认on; 当type=password时, 默认off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | string: <br>&nbsp;"off"<br>&nbsp;"on"<br>     | on       |
| hintType           | 显示提示信息                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br>       |          |
| validator          | 设置自定义校验规则<br><br>**签名:**<br>`function(value: value,id: id, type: type) => Object`<br>*value:* 用户输入值<br>*id:* ID of component which generate this.<br> *type:* if its triggered by "onChange" or "onBlur"<br><br> *returns* (Object): validationReturnMap={'result'：result,'message':message}  <br>result {bool} 用来设置校验是否有错误 <br>message {string} 用来设置错误提示的文本信息 <br>result和message，不能更换为其他字段。TextField组件的静态属性defaultValidator提供了下列默认校验函数：min, max, range, number, email, digit, url, alpha, regex, postfix, ipv4, ipv6, creditCard, equalTo, notEqualTo, minLength, maxLength, rangeLength。例如，如果希望用户输入的最小值是5, 可以这样使用 `<TextField validator={TextField.defaultValidator.min(5)}/>` | function                                      |          |
| onBlur             | 定义组件的失去焦点时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | function                                      |          |
| onChange           | 定义组件内容改变时的事件<br><br>**签名:**<br>`function(value1: string, value2: string, event: object) => void`<br>*value1:* new value<br>*value2:* previous value<br>*event:* 原生dom的event                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | function                                      |          |
| onFocus            | 定义组件聚焦时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | function                                      |          |
| onKeyDown          | 定义组件在按下键盘键时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | function                                      |          |
| onKeyUp            | 定义组件在放开键盘键时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | function                                      |          |
| isCharacterAllowed | 如果该函数返回false，则不考虑输入的字符。<br>注意：该api只能对单字节的情形有用（即纯英文）<br><br>**签名:**<br>`function(value: value, id: id) => Object`<br>*value:* The value entered by a user<br>*id:* ID of component which generate this.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | function                                      |          |
| zIndex             | 支持组件自定义tipbox z-index.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | number                                        | 99999999 |
| tipStyle           | 通过添加tipStyle来自定义提示框的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | object                                        |          |
| tipProps           | 自定义组件中ToolTip的，详细参考ToolTip组件(仅当hintType为`tip`时生效)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | CustomTooltipType                             |          |
| options    | 输入时的提示词条（只有2.0和3.1以上支持, 6.0.18以上支持）    | Array<{text: string;value: string;}>                             |     []     |
| onOptionClick    | 输入时的提示词条选中后的回调函数（只有2.0和3.1以上支持, 6.0.18以上支持）<br><br>**签名:**<br>`function({text: string,value: string}) => void`    | function        |          |
| getPopupContainer | 设置option弹窗的容器元素，默认挂载在body下（只有2.0和3.1以上支持, 6.0.18以上支持），设为false时为元素虚拟dom的原位置 | (() => HTMLElement) &#124; false |  |

## 使用示例

### 基本属性设置

## en-US



```jsx
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextFieldExample extends React.Component {

  validate = (value) => {
    let validationReturnMap = {};
    let validationResult = value.match(new RegExp("@", "g"));
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Incorrect input";;
    return validationReturnMap;
  };

  render() {

    let style = { width: '300px' };
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let divStyle = { margin: "10px 20px", display: "inline-block" };
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={divStyle}>
            <TextField label="Default style" placeholder="Please enter..." labelStyle={labelStyle} inputStyle={style}/>
          </div>

          <div style={divStyle}>
            <TextField label="autoComplete-off style" placeholder="Please enter..." labelStyle={labelStyle}
                       autoComplete="off" inputStyle={style}/>
          </div>

          <div style={divStyle}>
            <TextField label="Incorrect input" labelStyle={labelStyle} value={0} validator={this.validate}/>
          </div>

          <div style={divStyle}>
            <TextField label="Incorrect input tip style" labelStyle={labelStyle} value="error" validator={this.validate}
                       hintType="tip"/>
          </div>

          <div style={divStyle}>
            <TextField label="Disabled style" placeholder="Please enter..." labelStyle={labelStyle} disabled={true}/>
          </div>

          <div style={divStyle}>
            <TextField id="pwd" label="Password Input" placeholder="******" labelStyle={labelStyle} type="password"
                       autoComplete="off" value="error"/>
          </div>

          <div style={divStyle}>
            <TextField label="Read Only" value="read only" readOnly labelStyle={labelStyle} inputStyle={style}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextFieldExample />, mountNode);

```

```jsx
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextFieldExample extends React.Component {

  validate = (value) => {
    let validationReturnMap = {};
    let validationResult = value.match(new RegExp("@", "g"));
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Incorrect input";;
    return validationReturnMap;
  };

  render() {

    let style = { width: '300px' };
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let divStyle = { margin: "10px 20px", display: "inline-block" };
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={divStyle}>
            <TextField label="Default style" placeholder="Please enter..." labelStyle={labelStyle} inputStyle={style}/>
          </div>

          <div style={divStyle}>
            <TextField label="autoComplete-off style" placeholder="Please enter..." labelStyle={labelStyle}
                       autoComplete="off" inputStyle={style}/>
          </div>

          <div style={divStyle}>
            <TextField label="Incorrect input" labelStyle={labelStyle} value={0} validator={this.validate}/>
          </div>

          <div style={divStyle}>
            <TextField label="Incorrect input tip style" labelStyle={labelStyle} value="error" validator={this.validate}
                       hintType="tip"/>
          </div>

          <div style={divStyle}>
            <TextField label="Disabled style" placeholder="Please enter..." labelStyle={labelStyle} disabled={true}/>
          </div>

          <div style={divStyle}>
            <TextField id="pwd" label="Password Input" placeholder="******" labelStyle={labelStyle} type="password"
                       autoComplete="off" value="error"/>
          </div>

          <div style={divStyle}>
            <TextField label="Read Only" value="read only" readOnly labelStyle={labelStyle} inputStyle={style}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextFieldExample />, mountNode);

```

### 自动补全提示词设置

## en-US



```jsx
import TextField from 'eview-ui/TextField';
import Dialog from 'eview-ui/Dialog';
import SelectPro from 'eview-ui/SelectPro';
import InputSelect from 'eview-ui/InputSelect';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

 const options0 = [
  { text: 'China is big country', value: '1' },
  { text: 'UK is small country', value: '2' },
  { text: 'USA', value: 3 },
  { text: 'USAB', value: 4 },
  { text: 'USAC', value: 5 },
  { text: 'USAD', value: 6 },
  { text: 'USAE', value: 7 },
  { text: 'USAF', value: 8 },
  { text: 'USAG', value: 9 },
];


export default class TextFieldExample extends React.Component {

  handleClick1 = (item) => {
    console.log('handleDropdownClick', item)
  }

  handleChange = (e, e1) => {
    console.log('handleChange','new:', e, 'old:', e1)
  }


  render() {

    let style = { width: '500px' };
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let divStyle = { margin: "10px 20px", display: "inline-block" };
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={divStyle}>
            <TextField label="Default style" placeholder="Please enter..." labelStyle={labelStyle} inputStyle={style}
              onChange={this.handleChange}
              value={'111'}
              onOptionClick={this.handleClick1}
              options={options0}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextFieldExample />, mountNode);

```

```jsx
import TextField from 'eview-ui/TextField';
import Dialog from 'eview-ui/Dialog';
import SelectPro from 'eview-ui/SelectPro';
import InputSelect from 'eview-ui/InputSelect';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

 const options0 = [
  { text: 'China is big country', value: '1' },
  { text: 'UK is small country', value: '2' },
  { text: 'USA', value: 3 },
  { text: 'USAB', value: 4 },
  { text: 'USAC', value: 5 },
  { text: 'USAD', value: 6 },
  { text: 'USAE', value: 7 },
  { text: 'USAF', value: 8 },
  { text: 'USAG', value: 9 },
];


export default class TextFieldExample extends React.Component {

  handleClick1 = (item) => {
    console.log('handleDropdownClick', item)
  }

  handleChange = (e, e1) => {
    console.log('handleChange','new:', e, 'old:', e1)
  }


  render() {

    let style = { width: '500px' };
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let divStyle = { margin: "10px 20px", display: "inline-block" };
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={divStyle}>
            <TextField label="Default style" placeholder="Please enter..." labelStyle={labelStyle} inputStyle={style}
              onChange={this.handleChange}
              value={'111'}
              onOptionClick={this.handleClick1}
              options={options0}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextFieldExample />, mountNode);

```

### 事件回调

## en-US



```jsx
import TextField from 'eview-ui/TextField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextFieldEventExample extends React.Component {

  state = {
    msg: '',
    value: ''
  };

  handleChange = (value) => {
    this.setState({
      msg: "OnChange event callback, Contents of Textfield : " + value,
      value: value
    });
  };

  handleBlur = (e) => {
    this.setState({
      msg: "OnBlur event callback, Contents of Textfield : " + e.target.value,
      value: e.target.value
    });
  };

  handleFocus = (e) => {
    this.setState({
      msg: "OnFocus event callback, Contents of Textfield : " + e.target.value,
      value: e.target.value
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = {display: "inline-block", width: "120px", marginLeft: "20px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={{marginBottom: "20px", marginLeft: "20px"}}>
            <TextField label="Event callback:" labelStyle={labelStyle} value={this.state.value}
                       onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/>
            {this.state.msg ?
              <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextFieldEventExample />, mountNode);

```

```jsx
import TextField from 'eview-ui/TextField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextFieldEventExample extends React.Component {

  state = {
    msg: '',
    value: ''
  };

  handleChange = (value) => {
    this.setState({
      msg: "OnChange event callback, Contents of Textfield : " + value,
      value: value
    });
  };

  handleBlur = (e) => {
    this.setState({
      msg: "OnBlur event callback, Contents of Textfield : " + e.target.value,
      value: e.target.value
    });
  };

  handleFocus = (e) => {
    this.setState({
      msg: "OnFocus event callback, Contents of Textfield : " + e.target.value,
      value: e.target.value
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = {display: "inline-block", width: "120px", marginLeft: "20px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={{marginBottom: "20px", marginLeft: "20px"}}>
            <TextField label="Event callback:" labelStyle={labelStyle} value={this.state.value}
                       onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/>
            {this.state.msg ?
              <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextFieldEventExample />, mountNode);

```

### Custom Validation

## en-US



```jsx
import TextField from 'eview-ui/TextField';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ValidateExample extends React.Component {

  state = {
    msg: '',
    hintType: "div"
  };

  validator = (param) => {
    console.log(param);
    let validationReturnMap = {};
    //If "@" not found then report the error.
    var patt = new RegExp("@", "g");
    let validationResult = patt.test(param);
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "The email address is invalid.";
    return validationReturnMap;
  }

  handleClickGetValue = () => {
    this.setState({ msg: "getValue API : " + this.textField.getValue() });
  };

  handleClickValidate = (result) => {
    this.setState({ msg: "Validate API result : " + this.textField.validate() });
  };

  handleClickFocus = () => {
    this.textField.focus();
  };

  handleChange = (value) => {
    this.setState({
      msg: "OnChange event callback: Contents of Textfield : " + value,
    });
  };

  handleChangeHintType = (value) => {
    this.setState({
      hintType: "tip"
    });
  };

  render() {
    let labelStyle = {display: "inline-block", width: "120px", marginLeft: "20px", marginRight: "16px"};
    let buttonStyle = {marginLeft: "20px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <TextField label="Email Address:"
                     focusTip="Plz type"
                     required={true}
                     labelStyle={labelStyle}
                     validator={this.validator}
                     onChange={this.handleChange}
                     hintType={this.state.hintType}
                     ref={(textField) => this.textField = textField}
          />

          <br/> <br/>

          <Button text="getValue" onClick={this.handleClickGetValue} style={buttonStyle}></Button>
          <Button text="Validate" onClick={this.handleClickValidate} style={buttonStyle}></Button>
          <Button text="Focus" onClick={this.handleClickFocus} style={buttonStyle}></Button>
          <Button text="change Hint Type" onClick={this.handleChangeHintType} style={buttonStyle}></Button>


          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "660px"}}/> : ''}

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ValidateExample />, mountNode);

```

```jsx
import TextField from 'eview-ui/TextField';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ValidateExample extends React.Component {

  state = {
    msg: '',
    hintType: "div"
  };

  validator = (param) => {
    console.log(param);
    let validationReturnMap = {};
    //If "@" not found then report the error.
    var patt = new RegExp("@", "g");
    let validationResult = patt.test(param);
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "The email address is invalid.";
    return validationReturnMap;
  }

  handleClickGetValue = () => {
    this.setState({ msg: "getValue API : " + this.textField.getValue() });
  };

  handleClickValidate = (result) => {
    this.setState({ msg: "Validate API result : " + this.textField.validate() });
  };

  handleClickFocus = () => {
    this.textField.focus();
  };

  handleChange = (value) => {
    this.setState({
      msg: "OnChange event callback: Contents of Textfield : " + value,
    });
  };

  handleChangeHintType = (value) => {
    this.setState({
      hintType: "tip"
    });
  };

  render() {
    let labelStyle = {display: "inline-block", width: "120px", marginLeft: "20px", marginRight: "16px"};
    let buttonStyle = {marginLeft: "20px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <TextField label="Email Address:"
                     focusTip="Plz type"
                     required={true}
                     labelStyle={labelStyle}
                     validator={this.validator}
                     onChange={this.handleChange}
                     hintType={this.state.hintType}
                     ref={(textField) => this.textField = textField}
          />

          <br/> <br/>

          <Button text="getValue" onClick={this.handleClickGetValue} style={buttonStyle}></Button>
          <Button text="Validate" onClick={this.handleClickValidate} style={buttonStyle}></Button>
          <Button text="Focus" onClick={this.handleClickFocus} style={buttonStyle}></Button>
          <Button text="change Hint Type" onClick={this.handleChangeHintType} style={buttonStyle}></Button>


          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "660px"}}/> : ''}

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ValidateExample />, mountNode);

```

### Input Control validation

## en-US



```jsx
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class InputControlExample extends React.Component {

  isCharacterAllowed = (value, id) => {
    console.log(value);
    /*Allow only number between 0-9*/
    var regxsRef = new RegExp("^[0-9]{1,10}$");
    if (value == '' || regxsRef.test(value)) {
      return true;
    }
    return false;
  }

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = {display: "inline-block", width: "140px", marginLeft: "20px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <TextField label="Contact Number : " required={true} labelStyle={labelStyle}
                     isCharacterAllowed={this.isCharacterAllowed} hintType="tip" zIndex={3}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<InputControlExample />, mountNode);

```

```jsx
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class InputControlExample extends React.Component {

  isCharacterAllowed = (value, id) => {
    console.log(value);
    /*Allow only number between 0-9*/
    var regxsRef = new RegExp("^[0-9]{1,10}$");
    if (value == '' || regxsRef.test(value)) {
      return true;
    }
    return false;
  }

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = {display: "inline-block", width: "140px", marginLeft: "20px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <TextField label="Contact Number : " required={true} labelStyle={labelStyle}
                     isCharacterAllowed={this.isCharacterAllowed} hintType="tip" zIndex={3}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<InputControlExample />, mountNode);

```

