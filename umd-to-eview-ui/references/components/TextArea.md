# TextArea 多行文本输入框

> 分类：数据录入

该组件是用于文本输入的文本域，支持同时定义文本域的名称，直接使用可简化样式定义，同时支持自定义样式，该组件同时支持必填设置与校验，并给出错误提示，还可选择错误提示的位置,支持原生textarea的所有事件。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Input.TextArea` | `TextArea` | `onChange(value1, value2, event)`；`maxLength` 自带右下角计数（替代 `showCount`）；无 `autoSize`（用 `rows`/`cols`）；无 `allowClear` |

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getValue|用来获取当前输入框的value值|无|输入框的值|
|validate|用来手动进行非空校验，返回是否通过校验|无|校验结果，bool类型|
|focus|用来设置文本域的聚焦|无|无|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  组件默认设置动态id，且组件支持用户自定义id | string |  |
| style |  通过添加style的方式自定义该组件的整体样式（作用于最外层div） 例如：margin padding | object |  |
| className |  通过添加class的方式自定义该组件的整体样式（作用于最外层div） 例如：margin padding | string |  |
| label |  设置文本域的名称文字 | string |  |
| placeholder |  设置文本域的placeholder | string |  |
| labelClassName |  通过添加class的方式控制label的样式以及文本域和文本之间的间距 | string |  |
| labelStyle |  通过添加style的方式控制label的样式以及文本域和文本之间的间距 | object |  |
| inputClassName |  该属性是通过添加class的方式来控制textarea的样式 | string |  |
| inputStyle |  该属性是通过添加style的方式来控制textarea的样式 | object |  |
| value |  支持给组件设置value值 | any |  |
| focusTip |  focusTip | React.Node |  |
| maxLength |  文本域右下角的字数显示（设置总字数），设置文本域中最大的可输入长度,超过长度将不能继续输入 | number |  |
| rows |  设置文本域中显示的行数 | number |  |
| cols |  设置文本域中显示的列数 | number |  |
| ruleText |  设置文本域右边显示的输入标准（该提示一直存在于文本域右侧） | string |  |
| labelPosition |  设置文本域的名称文字的位置 before代表名称文字在文本域的左边，after代表名称文字在文本域的右边 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| validator |  设置自定义校验规则，注意在输入不合法的值后，该方法会被执行两次：一次是值改变触发的校验，一次是动态获取错误提示信息 <br><br>**签名:**<br>`function(value: value) => Object`<br>*value:* 用户输入值<br> *returns* (Object): validationReturnMap={'result'：result,'message':message}  <br>result {bool} 用来设置校验是否有错误 <br>message {string} 用来设置错误提示的文本信息 <br>result和message，不能更换为其他字段 | function |  |
| required |  支持设置组件值是否必须，若为必须，则文本域文字名称前前面加* | bool | false |
| disabled |  设置组件的灰化 | bool | false |
| hintType | 显示提示信息 | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br> |  |
| tipStyle |  通过添加tipStyle来自定义提示框的样式 | object | width:'500px' |
| readOnly |  Set the component is read only. | bool | false |
| onBlur |  定义组件的失去焦点时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event | function |  |
| onChange |  定义组件内容改变时的事件<br><br>**签名:**<br>`function(value1: string, value2: string, event: object) => void`<br>*value1:* new value<br>*value2:* previous value<br>*event:* 原生dom的event | function |  |
| onFocus |  定义组件聚焦时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event | function |  |
| onKeyDown |  定义组件在按下键盘键时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event | function |  |
| onKeyUp |  定义组件在放开键盘键时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event | function |  |

## 使用示例

### 基本属性设置

## en-US



```jsx
import TextArea from 'eview-ui/TextArea';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextAreaExample extends React.Component {

  render() {
    let labelStyle = {display: "block", paddingLeft: "0px"};
    const inputStyle = {resize: "both"}
    const [version, theme] = getDemoVersion();
    //resize: none|both|horizontal|vertical|initial|inherit;
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textArea_example" style={{margin: "20px"}}>
          <div style={{width: '30%'}}>
            <TextArea label="Default style" placeholder="Please Enter" labelStyle={labelStyle} rows={5} cols={50}
                      maxLength={100}/>
          </div>
          <div style={{width: '30%'}}>
            <TextArea label="Resize Style Property." placeholder="Please Enter" labelStyle={labelStyle} rows={5}
                      cols={50} inputStyle={inputStyle}/>
          </div>
          <div style={{width: '30%'}}>
            <TextArea label="Read Only" labelStyle={labelStyle} readOnly value="read only" rows={5} cols={50}/>
          </div>
          <TextArea label="Disabled style" labelStyle={labelStyle} disabled={true} placeholder="Please Enter" rows={5}
                    cols={50}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextAreaExample />, mountNode);

```

```jsx
import TextArea from 'eview-ui/TextArea';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextAreaExample extends React.Component {

  render() {
    let labelStyle = {display: "block", paddingLeft: "0px"};
    const inputStyle = {resize: "both"}
    const [version, theme] = getDemoVersion();
    //resize: none|both|horizontal|vertical|initial|inherit;
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textArea_example" style={{margin: "20px"}}>
          <div style={{width: '30%'}}>
            <TextArea label="Default style" placeholder="Please Enter" labelStyle={labelStyle} rows={5} cols={50}
                      maxLength={100}/>
          </div>
          <div style={{width: '30%'}}>
            <TextArea label="Resize Style Property." placeholder="Please Enter" labelStyle={labelStyle} rows={5}
                      cols={50} inputStyle={inputStyle}/>
          </div>
          <div style={{width: '30%'}}>
            <TextArea label="Read Only" labelStyle={labelStyle} readOnly value="read only" rows={5} cols={50}/>
          </div>
          <TextArea label="Disabled style" labelStyle={labelStyle} disabled={true} placeholder="Please Enter" rows={5}
                    cols={50}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextAreaExample />, mountNode);

```

### 事件处理

## en-US



```jsx
import TextArea from 'eview-ui/TextArea'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ValidateExample extends React.Component {

    validator=(param)=>{
    let validationReturnMap = {};
    let validationResult=(param.length<=5);
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Too many characters entered";;
    return validationReturnMap;
  }

  render() {
    let labelStyle = {display: "inline-block", width: "75px", marginLeft: "20px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textArea_example">
          <div>
            <TextArea label="Text field" required={true} labelStyle={labelStyle}
                      validator={this.validator} inputStyle={{boxSizing: 'border-box'}} ruleText="Enter up to 5 words"
                      rows={5} cols={50}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ValidateExample />, mountNode);

```

```jsx
import TextArea from 'eview-ui/TextArea'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ValidateExample extends React.Component {

    validator=(param)=>{
    let validationReturnMap = {};
    let validationResult=(param.length<=5);
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Too many characters entered";;
    return validationReturnMap;
  }

  render() {
    let labelStyle = {display: "inline-block", width: "75px", marginLeft: "20px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textArea_example">
          <div>
            <TextArea label="Text field" required={true} labelStyle={labelStyle}
                      validator={this.validator} inputStyle={{boxSizing: 'border-box'}} ruleText="Enter up to 5 words"
                      rows={5} cols={50}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ValidateExample />, mountNode);

```

### Custom Validation

## en-US



```jsx
import TextArea from 'eview-ui/TextArea';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ValidateExample extends React.Component {

    validator=(param)=>{
    let validationReturnMap = {};
    let validationResult=(param.length<=5);
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Too many characters entered";;
    return validationReturnMap;
  }

  render() {
    let labelStyle = {display: "inline-block", width: "75px", marginLeft: "20px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textArea_example">
          <div>
            <TextArea label="Text field" required={true} labelStyle={labelStyle}
                      validator={this.validator} inputStyle={{boxSizing: 'border-box'}} ruleText="Enter up to 5 words"
                      rows={5} cols={50}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ValidateExample />, mountNode);

```

```jsx
import TextArea from 'eview-ui/TextArea';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ValidateExample extends React.Component {

    validator=(param)=>{
    let validationReturnMap = {};
    let validationResult=(param.length<=5);
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Too many characters entered";;
    return validationReturnMap;
  }

  render() {
    let labelStyle = {display: "inline-block", width: "75px", marginLeft: "20px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textArea_example">
          <div>
            <TextArea label="Text field" required={true} labelStyle={labelStyle}
                      validator={this.validator} inputStyle={{boxSizing: 'border-box'}} ruleText="Enter up to 5 words"
                      rows={5} cols={50}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ValidateExample />, mountNode);

```

