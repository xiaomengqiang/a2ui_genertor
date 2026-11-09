# Spinner 计数器

> 分类：数据录入

通过步伐对数字进行微调，可以设置数字的初始值，最大值，最小值等。

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getValue|获取当前文本框的值|无|文本框的值|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  定制组件id，传入该值可覆盖组件自动生成的id 例如：id = {'eui_spinner_1001'} | string |  |
| className |  通过class的方式自定义组件样式 例如：className = {'spinnerClassName'} | string |  |
| disabledBlurFunction |  设置是否禁用blur事件对应功能（自动修正错误值）；禁用后onBlur api会失效 | bool | false |
| style |  自定义计数器样式 例如：style = {{ color: 'red' }} | object |  |
| inputClassName |  通过添加class的方式自定义计数器输入框的样式 | string |  |
| labelClassName |  通过添加class的方式自定义计数器的label的样式 | string |  |
| labelStyle |  通过添加style的方式自定义计数器的名称的样式 | object |  |
| label |  设置计数器的label | string |  |
| labelPosition |  设置计数器label的位置，before代表在计数器的左边，after代表在计数器的右边 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | before |
| focusTip |  组件获取焦点时弹出提示，失去焦点时消失 | string |  |
| tipStyle |  自定义提示框样式 | object |  |
| decTitle |  自定义当鼠标获取减号的焦点时，显示的文本内容 例如：decTitle = {'减'} | string |  |
| incTitle |  自定义当鼠标获取加号的焦点时，显示的文本内容 例如：incTitle = {'加'} | string |  |
| min |  自定义计数器的最小值，默认为 Number.MIN_SAFE_INTEGER 例如：min = {6} | number | Number.MIN_SAFE_INTEGER |
| max |  自定义计数器的最大值，默认为 Number.MAX_SAFE_INTEGER 例如：max = {10} | number | Number.MAX_SAFE_INTEGER |
| minMaxCycle |  数字是否循环显示，如增加到最大值时，继续增加返回至最小值，在设置min和max的情况下使用 | bool | false |
| *rangeArray | 此属性即将废弃，不建议使用 | / | / |
| step |  自定义计数器的步伐，默认为1 例如：step = {1} | number | 1 |
| value |  用户设置计数器初始值，例如：value = {0} or value = {'12:00 AM'} | enum:<br>&nbsp;"number"<br>&nbsp;"String"<br> | 0 |
| disabled |  自定义组件是否灰化，默认为false 例如：disabled = {true} | bool | false |
| onChange |  自定义计数器文本框值改变时的回调方法(有效值时调用)<br><br>**签名:**<br>`function(value: number) => void`<br>*value:* 文本框的值 | function |  |
| onError |  自定义计数器文本框值改变时的回调方法(无效值时调用)<br><br>**签名:**<br>`function(value: number) => void`<br>*value:* 文本框的值 | function |  |
| onFoucs | 自定义计数器文本框聚焦时的回调<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生dom的event | function |  |
| onBlur | 自定义计数器文本框失焦时的回调<br><br>**签名:**<br>`function(value: number) => void`<br>*value:* 文本框的值 | function |  |
|required	|	支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验 |bool	|false|
|locale| 当amPm为true时，设置后缀名是中文（上午/下午）还是英文（AM/PM），如果不设置，则使用ConfigProvider中配置的语言 | 'en' | 'zh' |
|precision	|	支持设置组件值精度 |number	|0|
|formatter	|	格式化输入框显示，聚焦时显示原值。签名:`(value: number, precision: number) => string` |function	|`(value, precision) => value.toFixed(precision)`|
|type	|	Spinner类型,'number','time', 'customWithPrefixs'，分别表示数字型、时间型、自定义前缀类型。|enum:<br>&nbsp;"number"<br>&nbsp;"time"<br>&nbsp;"customWithPrefixs"<br> |"number" |
|timeFormat	|	指定时间格式，有效的时间格式为 'hh:mm:ss','hh:mm'.|string |hh:mm:ss|
|amPm| 使用am pm格式.|bool|false|
|onCustomIncOrDecClick| 当type为'customWithPrefixs'时，点击Spinner的加减号的回调函数。<br><br>**签名:**<br>`function(changeTag: string, direction: number,currentValue: string) => void`<br>*changeTag:* 加减号修改的内容。修改前缀时值为'prefix'，修改内容时值为'content'<br>*direction:*执行加操作时为1，减操作时为-1<br>*currentValue:*输入框的值| function |  |
| tipStyle |  通过添加tipStyle来自定义提示框的样式 | object |  |
| isCustomerValidatorMsg |  配合form,通过isCustomerValidatorMsg变量控制是否需要显示自定义异常提示信息 | bool | false |

## 使用示例

### 基本属性设置

## en-US



```jsx
import Spinner from 'eview-ui/Spinner'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerExample1 extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let style = {marginRight: "50px"}
    let labelStyle = {display: "block", paddingLeft: "0px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <Spinner value={50} min={0} max={100} step={1} label={"Default style"} labelStyle={labelStyle} style={style}/>
          <Spinner decTitle={"dec"} incTitle={"inc"} value={89} min={1} max={100} step={2} label={"Disabled Style"}
                   disabled={true} labelStyle={labelStyle} style={style}/>
          <Spinner value={3.14} min={0} max={100} step={0.2} precision={2} label={"Precision style"}
                   labelStyle={labelStyle} style={style}/>
          <Spinner value={1} min={0} max={100} step={1} label={"Min Max Cycle"} labelStyle={labelStyle} style={style}
                   minMaxCycle={true}/>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerExample1 />, mountNode);

```

```jsx
import Spinner from 'eview-ui/Spinner'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerExample1 extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let style = {marginRight: "50px"}
    let labelStyle = {display: "block", paddingLeft: "0px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <Spinner value={50} min={0} max={100} step={1} label={"Default style"} labelStyle={labelStyle} style={style}/>
          <Spinner decTitle={"dec"} incTitle={"inc"} value={89} min={1} max={100} step={2} label={"Disabled Style"}
                   disabled={true} labelStyle={labelStyle} style={style}/>
          <Spinner value={3.14} min={0} max={100} step={0.2} precision={2} label={"Precision style"}
                   labelStyle={labelStyle} style={style}/>
          <Spinner value={1} min={0} max={100} step={1} label={"Min Max Cycle"} labelStyle={labelStyle} style={style}
                   minMaxCycle={true}/>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerExample1 />, mountNode);

```

### 事件处理

## en-US



```jsx
import Spinner from 'eview-ui/Spinner';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerExample2 extends React.Component {

  state = {
    msg: '',
    value: 0
  };

  handleChange = (value) => {
    this.setState({ msg: "OnChange event callback : " + value, value: value });
  }

  onClickButton = (e) => {
    this.setState({ msg: "getValue API : " + this.spinner.getValue() });
  }

  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle={marginLeft:"20px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>
          <Spinner label={"Event Callback:"}
            onChange={this.handleChange}
            value={this.state.value}
            required
            ref={(spinner) => { this.spinner = spinner }} />
          <Button text="getValue" style={buttonStyle} onClick={this.onClickButton} />
          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "400px" }} /> : ''}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerExample2 />, mountNode);

```

```jsx
import Spinner from 'eview-ui/Spinner';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerExample2 extends React.Component {

  state = {
    msg: '',
    value: 0
  };

  handleChange = (value) => {
    this.setState({ msg: "OnChange event callback : " + value, value: value });
  }

  onClickButton = (e) => {
    this.setState({ msg: "getValue API : " + this.spinner.getValue() });
  }

  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle={marginLeft:"20px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>
          <Spinner label={"Event Callback:"}
            onChange={this.handleChange}
            value={this.state.value}
            required
            ref={(spinner) => { this.spinner = spinner }} />
          <Button text="getValue" style={buttonStyle} onClick={this.onClickButton} />
          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "400px" }} /> : ''}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerExample2 />, mountNode);

```

### 微调器类型时间演示

## en-US



```jsx
import Spinner from 'eview-ui/Spinner';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerTypeTime extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let style = {marginRight: "50px"}
    let labelStyle = {display: "block", paddingLeft: "0px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{marginLeft: "20px", display: "inline-block"}}>

            <Spinner type={'time'} value={'12:00'} timeFormat={'hh:mm'} amPm={false} label={"Time Format:hh:mm "}
                     labelStyle={labelStyle} style={style}/>
            <Spinner type={'time'} timeFormat={'hh:mm'} value={'12:00'} disabled={true} amPm={true}
                     label={"Time Format:hh:mm Enable AM/PM "} labelStyle={labelStyle} style={style}/>
          </div>
          <div style={{marginLeft: "20px", display: "inline-block"}}>

            <Spinner type={'time'} timeFormat={'hh:mm:ss'} amPm={false} value={'15:33:26'}
                     label={"Time Format:hh:mm:ss "} labelStyle={labelStyle} style={style}/>
            <Spinner type={'time'} timeFormat={'hh:mm:ss'} amPm={true} value={'11:33:26 AM'}
                     label={"Time Format:hh:mm:ss Enable AM/PM  "} labelStyle={labelStyle} style={style}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerTypeTime />, mountNode);

```

```jsx
import Spinner from 'eview-ui/Spinner';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerTypeTime extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let style = {marginRight: "50px"}
    let labelStyle = {display: "block", paddingLeft: "0px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{marginLeft: "20px", display: "inline-block"}}>

            <Spinner type={'time'} value={'12:00'} timeFormat={'hh:mm'} amPm={false} label={"Time Format:hh:mm "}
                     labelStyle={labelStyle} style={style}/>
            <Spinner type={'time'} timeFormat={'hh:mm'} value={'12:00'} disabled={true} amPm={true}
                     label={"Time Format:hh:mm Enable AM/PM "} labelStyle={labelStyle} style={style}/>
          </div>
          <div style={{marginLeft: "20px", display: "inline-block"}}>

            <Spinner type={'time'} timeFormat={'hh:mm:ss'} amPm={false} value={'15:33:26'}
                     label={"Time Format:hh:mm:ss "} labelStyle={labelStyle} style={style}/>
            <Spinner type={'time'} timeFormat={'hh:mm:ss'} amPm={true} value={'11:33:26 AM'}
                     label={"Time Format:hh:mm:ss Enable AM/PM  "} labelStyle={labelStyle} style={style}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerTypeTime />, mountNode);

```

### 微调器类型时间事件演示

## en-US



```jsx
import Spinner from 'eview-ui/Spinner';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerEventTypeTime extends React.Component {

  state = {
    msg: '',

  };

  handleChange = (value) => {
    this.setState({ msg: "OnChange event callback : " + value, value: value });
  }

  onClickButton = (e) => {
    this.setState({ msg: "getValue API : " +this.spinner.getValue(),value: this.spinner.getValue() });
  }

  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle={marginLeft:"20px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>
          <Spinner label={"Event Callback:"}
            value={this.state.value}
            onChange={this.handleChange}
            required
            type={'time'}
            timeFormat={'hh:mm:ss'}
            amPm={true}
            ref={(spinner) => { this.spinner = spinner }} />
          <Button text="getValue" style={buttonStyle} onClick={this.onClickButton} />

          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "400px" }} /> : ''}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerEventTypeTime />, mountNode);

```

```jsx
import Spinner from 'eview-ui/Spinner';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerEventTypeTime extends React.Component {

  state = {
    msg: '',

  };

  handleChange = (value) => {
    this.setState({ msg: "OnChange event callback : " + value, value: value });
  }

  onClickButton = (e) => {
    this.setState({ msg: "getValue API : " +this.spinner.getValue(),value: this.spinner.getValue() });
  }

  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle={marginLeft:"20px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>
          <Spinner label={"Event Callback:"}
            value={this.state.value}
            onChange={this.handleChange}
            required
            type={'time'}
            timeFormat={'hh:mm:ss'}
            amPm={true}
            ref={(spinner) => { this.spinner = spinner }} />
          <Button text="getValue" style={buttonStyle} onClick={this.onClickButton} />

          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "400px" }} /> : ''}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<SpinnerEventTypeTime />, mountNode);

```

### 支持自定义前缀

## en-US



```jsx
import Spinner from 'eview-ui/Spinner';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerCustomPrefix extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      value: 'D\'8',
      customPrefix: 'D\''
    };
    this.prefixArr = ['D\'', 'H\'']
  }

  handleChange = (value) => {
    this.setState({ msg: "OnChange event callback : " + value, value: value });
  }

  onClickButton = (e) => {
    this.setState({ msg: "getValue API : " + this.spinner.getValue(), value: this.spinner.getValue() });
  }

  handleCustomIncOrDecClick = (changeTag, direction, currentValue) => {
    let customPrefix = currentValue.substr(0, 2)
    let contentValue = currentValue.substr(2);

    if (changeTag === 'content') {
      contentValue = customPrefix === 'D\'' ? parseInt(contentValue) : parseInt(contentValue, 16)
      contentValue += 1 * direction;
      contentValue = customPrefix === 'D\'' ? contentValue : contentValue.toString(16)
    } else {
      if (customPrefix === 'D\'') {
        customPrefix = 'H\'';
        contentValue = parseInt(contentValue).toString(16)
      } else {
        customPrefix = 'D\''
        contentValue = parseInt(contentValue, 16)
      }
    }
    this.setState({
      value: customPrefix + contentValue
    })

  }


  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle = { marginLeft: "20px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <React.Fragment>
        <ConfigProvider version={version} theme={theme}>
          <br />
          <div style={{ marginLeft: "20px" }}>
            <Spinner label={"Custom Prefix"}
              value={this.state.value}
              onChange={this.handleChange}
              required
              type={'customWithPrefixs'}
              customPrefix={'H\''}
              onCustomIncOrDecClick={this.handleCustomIncOrDecClick}
              ref={(spinner) => { this.spinner = spinner }} />
            <Button text="getValue" style={buttonStyle} onClick={this.onClickButton} />
            {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "400px" }} /> : ''}
          </div>
        </ConfigProvider>
      </React.Fragment >
    )
  }
}

ReactDOM.render(<SpinnerCustomPrefix />, mountNode);

```

```jsx
import Spinner from 'eview-ui/Spinner';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SpinnerCustomPrefix extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      value: 'D\'8',
      customPrefix: 'D\''
    };
    this.prefixArr = ['D\'', 'H\'']
  }

  handleChange = (value) => {
    this.setState({ msg: "OnChange event callback : " + value, value: value });
  }

  onClickButton = (e) => {
    this.setState({ msg: "getValue API : " + this.spinner.getValue(), value: this.spinner.getValue() });
  }

  handleCustomIncOrDecClick = (changeTag, direction, currentValue) => {
    let customPrefix = currentValue.substr(0, 2)
    let contentValue = currentValue.substr(2);

    if (changeTag === 'content') {
      contentValue = customPrefix === 'D\'' ? parseInt(contentValue) : parseInt(contentValue, 16)
      contentValue += 1 * direction;
      contentValue = customPrefix === 'D\'' ? contentValue : contentValue.toString(16)
    } else {
      if (customPrefix === 'D\'') {
        customPrefix = 'H\'';
        contentValue = parseInt(contentValue).toString(16)
      } else {
        customPrefix = 'D\''
        contentValue = parseInt(contentValue, 16)
      }
    }
    this.setState({
      value: customPrefix + contentValue
    })

  }


  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle = { marginLeft: "20px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <React.Fragment>
        <ConfigProvider version={version} theme={theme}>
          <br />
          <div style={{ marginLeft: "20px" }}>
            <Spinner label={"Custom Prefix"}
              value={this.state.value}
              onChange={this.handleChange}
              required
              type={'customWithPrefixs'}
              customPrefix={'H\''}
              onCustomIncOrDecClick={this.handleCustomIncOrDecClick}
              ref={(spinner) => { this.spinner = spinner }} />
            <Button text="getValue" style={buttonStyle} onClick={this.onClickButton} />
            {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "400px" }} /> : ''}
          </div>
        </ConfigProvider>
      </React.Fragment >
    )
  }
}

ReactDOM.render(<SpinnerCustomPrefix />, mountNode);

```

