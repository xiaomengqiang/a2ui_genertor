# TimeSelector 时间选择器

> 分类：数据录入

设置时间的时，分，秒。

## API

| 方法名      | 描述                                                                          | 参数 | 返回值 |
| ----------- | ----------------------------------------------------------------------------- | ---- | ------ |
|getValue|获取当前输入框中的值小时分钟秒比如[1,2,3] |不|时间分钟秒|


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  组件的id | string |  |
| className |  定制组件容器类级别, 通过在上添加类组件默认风格定制的组件样式  例如: className = 'timeSelectorClassName' | string |  |
| style |  自定义时间选择风格, 例如: style = {{color: 'red'}} | object |  |
| labelClassName |  通过添加类我们只能设置css类标签级别. | string |  |
| labelStyle |  通过添加样式只能设置的样式标签级别. | object |  |
| label |  设置时间选择文本名称. | string |  |
| timeClassName |  我们可以通过添加类的css类组件级别设置. | string |  |
| timeStyle |  通过添加样式的css属性可以设置组件级别. | object |  |
| time |  自定义时间 例如: time = {[1,2,3]}, 1 那时候; 2 几分钟; 3 几秒钟 | array | [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()] |
| disabled |  设置是否禁用自定义组件, 默认为false 例如: disabled = {true} | bool | false |
| display |  显示或隐藏时间Selector组件. True: 查询组件. False: 隐藏组件. | bool | true |
| amPm |  使能TimeSelector组件的AM/PM格式，true表示开启AM/PM格式，false表示关闭AM/PM格式。 | bool | false |
| labelPosition |  设置时间选择器名称wrt文本的位置 Before:指定时间选择器左侧的名称文本,  after : 指定时间选择器右侧的名称文本 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| required |  设置组件是否需要 | bool |  |
| format |  设置显示时间格式. 合法的时间格式为 hh:mm,,mm:ss and hh:mm:ss | string | 'hh:mm:ss' |
| onChange |  自定义时间时回调方法选择文本框中修改.<br><br>**签名:**<br>`function(time: array) => void`<br>*time:* : 文本框中时间, 例如: [1,2,3], 1 那时候; 2 几分钟; 3 几秒钟 | function |  |
| direction |  时间菜单默认也会显示上下根据空间位置.  如果用户设置为了起来,它将显示在位置. 如果用户设置为'下会显示为下位置. | string | 'auto' |

## 接口定义

```typescript
interface TimeSelector {


  /**
   * id of the component.
   */
  id: string;

  /**
   * Customize the component class for container level; passing in the value Add the class on the component default style to customize the component style
   * For example: className = 'timeSelectorClassName'
   */
  className: string;

  /**
   * Custom time selector style; For example: style = {{color: 'red'}}
   */
  style: object;

  /**
   * By adding class we can set the css class for only label level.
   */
  labelClassName: string;

  /**
   * By adding style we can set the style for only label level.
   */
  labelStyle: object;

  /**
   * Set the time selector text name.
   */
  label: string;

  /**
   * By adding class we can set the css class for component level.
   */
  timeClassName: string;

  /**
   * By adding style we can set the css properties  for  component level.
   */
  timeStyle: object;

  /**
   * Custom time For example: time = {[1;2;3]}; 1 for the time; 2 for minutes; 3 for seconds
   */
  time: number[];

  /**
   * Set if the custom component is disable or not ; the default is false For example: disabled = {true}
   */
  disabled: boolean;

  /**
   * Shows or hides the TimeSelector component. True: Shows the component. False: Hides the component.
   */
  display: boolean;

  /**
   * Set the name of the time selector wrt the position of the text
   * Before:specifies the name text on the left side of the time selector;
   * after : specifies the name text on the right side of the time selector
   */
  labelPosition: 'before' | 'after';

  /**
   * Set whether the component is required
   */
  required: boolean;

  /**
   * Sets the format to display time. The valid time formats are hh:mm,,mm:ss and hh:mm:ss
   */
  format: string;

  /**
   * The callback method when the custom time selector text box value changes .
   *
   * @param {Array} time: The time in the text box; for example: [1;2;3]; 1 for the time; 2 for minutes; 3 for seconds
   */
  onChange: (...args: any) => unknown;

  /**
   *  TimeMenu by default it will show either up or down position according to the available space .
   *  If user set as 'up' it will show in up position .
   *  If user set as 'down' it will show as down position.
   */
  direction: string;

  /**
   * Set Am/Pm is enable .
   */
  amPm: boolean;

  /**
   * Set if empty time is allowed .
   */
  supportEmptyTime: boolean;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import TimeSelector from 'eview-ui/TimeSelector'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeSelectorExample1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: []
    };
  }

  handleTimeChange = value => {
    this.setState({time: value});
    console.log(value);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{display: "inline-block", marginLeft: "20px"}}>
            <TimeSelector label={"Default style"} time={[17, 23, 30]} timeStyle={{width: '128px'}}
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Disabled style"} time={[17, 23, 30]} timeStyle={{width: '128px'}} disabled={true}
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Format mm:ss"} time={[43, 30]} disabled={false} format='mm:ss'
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Format hh:mm"} time={[22, 44]} disabled={false} format='hh:mm'
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "20px"}}>
            <TimeSelector label={"Empty time"} time={this.state.time} timeStyle={{width: '128px'}}
                          labelStyle={labelStyle}
                          supportEmptyTime={true} onChange={(array) => this.handleTimeChange(array)}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TimeSelectorExample1 />, mountNode);

```

```jsx
import TimeSelector from 'eview-ui/TimeSelector'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeSelectorExample1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: []
    };
  }

  handleTimeChange = value => {
    this.setState({time: value});
    console.log(value);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{display: "inline-block", marginLeft: "20px"}}>
            <TimeSelector label={"Default style"} time={[17, 23, 30]} timeStyle={{width: '128px'}}
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Disabled style"} time={[17, 23, 30]} timeStyle={{width: '128px'}} disabled={true}
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Format mm:ss"} time={[43, 30]} disabled={false} format='mm:ss'
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Format hh:mm"} time={[22, 44]} disabled={false} format='hh:mm'
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "20px"}}>
            <TimeSelector label={"Empty time"} time={this.state.time} timeStyle={{width: '128px'}}
                          labelStyle={labelStyle}
                          supportEmptyTime={true} onChange={(array) => this.handleTimeChange(array)}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TimeSelectorExample1 />, mountNode);

```

### 基本属性设置

AM/PM Setting

```jsx
import TimeSelector from 'eview-ui/TimeSelector';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeSelectorExample1 extends React.Component {
  state = {
    msg: '',
    val: new Date()
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{display: "inline-block", marginLeft: "20px"}}>
            <TimeSelector label={"Default style"} time={[11, 23, 30]} amPm={true} timeStyle={{width: '128px'}}
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Disabled style"} time={[12, 23, 30]} amPm={true} timeStyle={{width: '128px'}}
                          disabled={true}
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Format hh:mm"} time={[10, 44]} disabled={false} amPm={true} format='hh:mm'
                          labelStyle={labelStyle}/>
          </div>
          <div style={{display: "inline-block", marginLeft: "40px"}}>
            <TimeSelector label={"Disabled style"} time={[10, 44]} disabled={true} amPm={true} format='hh:mm'
                          labelStyle={labelStyle}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TimeSelectorExample1 />, mountNode);

```

### 事件处理

## en-US



```jsx
import TimeSelector from 'eview-ui/TimeSelector';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeSelectorExample2 extends React.Component {

  state = {
    msg: '',
    time: [0, 0, 0]
  };

  onChangeTimeSelector = (value) => {
    this.setState({ msg: "OnChange event callback : " + value[0] + ":" + value[1] + ":" + value[2], time: this.timeSelector.getValue() });
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <TimeSelector time={this.state.time} timeStyle={{width: '128px'}} labelStyle={{marginRight: "59px"}}
                        ref={(timeSelector) => this.timeSelector = timeSelector}
                        onChange={this.onChangeTimeSelector} label={"OnChange event display"}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "500px"}}/> : ''}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TimeSelectorExample2 />, mountNode);

```

```jsx
import TimeSelector from 'eview-ui/TimeSelector';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeSelectorExample2 extends React.Component {

  state = {
    msg: '',
    time: [0, 0, 0]
  };

  onChangeTimeSelector = (value) => {
    this.setState({ msg: "OnChange event callback : " + value[0] + ":" + value[1] + ":" + value[2], time: this.timeSelector.getValue() });
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <TimeSelector time={this.state.time} timeStyle={{width: '128px'}} labelStyle={{marginRight: "59px"}}
                        ref={(timeSelector) => this.timeSelector = timeSelector}
                        onChange={this.onChangeTimeSelector} label={"OnChange event display"}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "500px"}}/> : ''}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TimeSelectorExample2 />, mountNode);

```

