# HexField Hex输入框

> 分类：数据录入

该组件是用于输入十六进制数值的文本输入框，支持同时定义文本框的名称，直接使用可简化样式定义，同时支持自定义样式，该组件同时支持必填设置与校验，并给出错误提示，还可选择错误提示的位置,支持原生input的所有事件。

## API

| 方法名 | 描述 | 参数 | 返回 |
|---|---|---|---|
|getValue|获取当前文本框中的值|无|当前文本框中的值|
|validate|用于手动进行非空检查，并返回是否通过校验|无|校验结果，bool类型|
|focus|用来设置文本框框聚焦|无|无|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  组件默认设置动态id，且组件支持用户自定义id | string |  |
| style |  通过添加style的方式自定义该组件的整体样式（作用于最外层div） 例如：margin padding | object |  |
| className |  通过添加class的方式自定义该组件的整体样式（作用于最外层div） 例如：margin padding | string |  |
| label |  设置输入框的名称文字 | string |  |
| placeholder |  设置文本输入框的placeholder | string |  |
| labelClassName |  通过添加class的方式控制label的样式以及输入框和文本之间的间距 | string |  |
| labelStyle |  通过添加style的方式控制label的样式以及输入框和文本之间的间距 | object |  |
| inputClassName |  该属性是通过添加class的方式来控制input的样式 | string |  |
| inputStyle |  该属性是通过添加style的方式来控制input的样式 | object |  |
| value |  支持给组件设置value值 | any |  |
| labelPosition |  设置输入框的名称文字的位置 before代表名称文字在输入框的前面，after代表名称文字在输入框的后面 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| required |  支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验 | bool | false |
| disabled |  设置组件的灰化 | bool | false |
| validator |  设置自定义校验规则<br><br>**签名:**<br>`function(value: value,id: id, type: type) => Object`<br>*value:* 用户输入值<br>*id:* ID of component which generate this.<br> *type:* if its triggered by "onChange" or "onBlur"<br><br> *returns* (Object): validationReturnMap={'result'：result,'message':message}  <br>result {bool} 用来设置校验是否有错误 <br>message {string} 用来设置错误提示的文本信息 <br>result和message，不能更换为其他字段。TextField组件的静态属性defaultValidator提供了下列默认校验函数：min, max, range, number, email, digit, url, alpha, regex, postfix, ipv4, ipv6, creditCard, equalTo, notEqualTo, minLength, maxLength, rangeLength。例如，如果希望用户输入的最小值是5, 可以这样使用 `<TextField validator={TextField.defaultValidator.min(5)}/>` | function |  |
| onBlur |  定义组件的失去焦点时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event | function |  |
| onChange |  定义组件内容改变时的事件<br><br>**签名:**<br>`function(value1: string, value2: string, event: object) => void`<br>*value1:* new value<br>*value2:* previous value<br>*event:* 原生dom的event | function |  |
| onFocus |  定义组件聚焦时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event | function |  |

## 使用示例

### 基本属性设置

## en-US



```jsx
import HexField from 'eview-ui/HexField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class HexFieldExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let divStyle = { margin: "10px 20px", display: "inline-block" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={divStyle}>
            <HexField style={{width: '50%'}} label="Default style" placeholder="Hex field..." labelStyle={labelStyle}
                      ref={(dom) => this.dom = dom}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<HexFieldExample />, mountNode);

```

```jsx
import HexField from 'eview-ui/HexField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class HexFieldExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let divStyle = { margin: "10px 20px", display: "inline-block" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_textField_example">
          <div style={divStyle}>
            <HexField style={{width: '50%'}} label="Default style" placeholder="Hex field..." labelStyle={labelStyle}
                      ref={(dom) => this.dom = dom}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<HexFieldExample />, mountNode);

```

