# Toggle 开关

> 分类：数据录入

该组件用于表示某些场景的on/off状态,可以通过接口getValue获取当前状态值。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Switch` | `Toggle` | `checked`→**`toggled`**；`onChange`→**`onToggle(value)`**；`data=[关值, 开值]`（值集合，顺序=关闭/开启）；`disabled` 正确拼写保留；无 `loading`/`size`；文档推荐设置 data 默认值 |

## API

| 方法名      | 描述                                                                          | 参数 | 返回值 |
| ----------- | ----------------------------------------------------------------------------- | ---- | ------ |
|getValue|切换框当前表示on/off状态的值|无|切换框当前状态值|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  切换框根节点的id。 | string |  |
| className |  切换框最外层div的样式类名。 | string |  |
| style |  覆盖切换框最外层div的行内样式。 | object |  |
| labelClassName |  通过添加class的方式控制label的样式,以及展示文本与组件之间的间距 | string |  |
| labelStyle |  通过添加style的方式控制label的样式,以及展示文本与组件之间的间距 | object |  |
| data |  切换框不同状态下的值集合，默认圆圈在左边时表示关闭状态，圆圈在右边时表示开启状态， 比如["33","44"],第一个值表示关闭状态下的值，第二个值表示开启状态下的值， 这个属性可选，推荐设置默认值。 | array |  |
| label |  设置组件的展示文本值 | string |  |
| labelPosition |  设置组件的文本值在组件图标的左侧还是右侧 before代表文本在组件的左边，after表示文本在组件的右边 | enum:<br>&nbsp;'before'<br>&nbsp;'after'<br> | "before" |
| toggled |  设置开启切换框，默认关闭。 | bool | false |
| disabled |  设置禁用切换框，默认关闭。 | bool | false |
| onToggle |  点击切换框时的回调。使用时需传data。并且此时toggled属性由用户维护。<br><br>**签名:**<br>`function(value: any) => void`<br>*value:* 点击文本切换框时当前状态值 | function |  |

## 接口定义

```typescript
interface Toggle {


  /**
   * 切换框根节点的id。
   */
  id: string;

  /**
   * 切换框最外层div的样式类名。
   */
  className: string;

  /**
   * 支持通过version设置组件版本.
   */
  version: string;

  /**
   * 支持通过theme设置组件主题.
   */
  theme: string;

  /**
   * 覆盖切换框最外层div的行内样式。
   */
  style: object;

  /**
   * 通过添加class的方式控制label的样式;以及展示文本与组件之间的间距
   */
  labelClassName: string;

  /**
   * 通过添加style的方式控制label的样式;以及展示文本与组件之间的间距
   */
  labelStyle: object;

  /**
   * 切换框不同状态下的值集合，默认圆圈在左边时表示关闭状态，圆圈在右边时表示开启状态，
   * 比如["33";"44"];第一个值表示关闭状态下的值，第二个值表示开启状态下的值，
   * 这个属性可选，推荐设置默认值。
   */
  data: string[];

  /**
   * 设置组件的展示文本值
   */
  label: string;

  /**
   * 设置组件的文本值在组件图标的左侧还是右侧
   * before代表文本在组件的左边，after表示文本在组件的右边
   */
  labelPosition: 'before' | 'after';

  /**
   * 设置开启切换框，默认关闭。
   */
  toggled: boolean;

  /**
   * 设置禁用切换框，默认启用。
   */
  disabled: boolean;

  /**
   * 点击切换框时的回调。
   *
   * @param {any} value 点击文本切换框时当前状态值
   */
  onToggle: (value: string) => unknown;

  /**
   * 设置禁用Enter键盘事件，默认关闭。
   */
  stopEnterKey: boolean;

  fieldClassName: string;

  fieldStyle: object;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Toggle from 'eview-ui/Toggle';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ToggleExample extends React.Component {

  render() {
    let style = {marginRight: "10px"};
    let labelStyle = {display: "block", paddingLeft: "0px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{margin: "20px 20px"}}>
          <div style={{display: "inline-block", marginRight: "50px"}}>
            <LabelField text="Default style" style={labelStyle}/>
            <Toggle toggled={true} style={style}/>
            <Toggle/>
          </div>
          <div style={{display: "inline-block"}}>
            <LabelField text="Disabled style" style={labelStyle}/>
            <Toggle toggled={true} disabled={true} style={style}/>
            <Toggle disabled={true} style={style}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ToggleExample />, mountNode);

```

```jsx
import Toggle from 'eview-ui/Toggle';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ToggleExample extends React.Component {

  render() {
    let style = {marginRight: "10px"};
    let labelStyle = {display: "block", paddingLeft: "0px"};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{margin: "20px 20px"}}>
          <div style={{display: "inline-block", marginRight: "50px"}}>
            <LabelField text="Default style" style={labelStyle}/>
            <Toggle toggled={true} style={style}/>
            <Toggle/>
          </div>
          <div style={{display: "inline-block"}}>
            <LabelField text="Disabled style" style={labelStyle}/>
            <Toggle toggled={true} disabled={true} style={style}/>
            <Toggle disabled={true} style={style}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ToggleExample />, mountNode);

```

### 事件处理

## en-US



```jsx
import Toggle from 'eview-ui/Toggle';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ToggleInteractiveExample extends React.Component {

  state={
    msg:'',
    toggled:false
  };

  handleClick = ()=> {
    this.setState({msg:"GetValue value callback: current Value"+this.toggle.getValue()});
  };

  onToggle = (value)=> {
    this.setState({msg:"OnToggle event callback: current Value"+value,toggled:!this.state.toggled});
  };

  render() {
    const data = [1, 2];
    const toggleStyle={"verticalAlign":"text-top"};
    const linkStyle={"margin":"0 5px","color":"#4a1eb9","cursor":"pointer"};
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LabelField text="Event Handling" style={{marginLeft: "20px"}}>
          </LabelField>
          <Toggle data={data} toggled={this.state.toggled} onToggle={this.onToggle}
                  ref={(toggle) => this.toggle = toggle}
                  style={toggleStyle}/>
          <Button text="Value" style={{marginLeft: "180px"}} onClick={this.handleClick}/>
          {this.state.msg ? <DivMessage text={this.state.msg} type="success"
                                        style={{marginLeft: "15px", marginTop: "10px", width: "378px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ToggleInteractiveExample />, mountNode);

```

```jsx
import Toggle from 'eview-ui/Toggle';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ToggleInteractiveExample extends React.Component {

  state={
    msg:'',
    toggled:false
  };

  handleClick = ()=> {
    this.setState({msg:"GetValue value callback: current Value"+this.toggle.getValue()});
  };

  onToggle = (value)=> {
    this.setState({msg:"OnToggle event callback: current Value"+value,toggled:!this.state.toggled});
  };

  render() {
    const data = [1, 2];
    const toggleStyle={"verticalAlign":"text-top"};
    const linkStyle={"margin":"0 5px","color":"#4a1eb9","cursor":"pointer"};
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LabelField text="Event Handling" style={{marginLeft: "20px"}}>
          </LabelField>
          <Toggle data={data} toggled={this.state.toggled} onToggle={this.onToggle}
                  ref={(toggle) => this.toggle = toggle}
                  style={toggleStyle}/>
          <Button text="Value" style={{marginLeft: "180px"}} onClick={this.handleClick}/>
          {this.state.msg ? <DivMessage text={this.state.msg} type="success"
                                        style={{marginLeft: "15px", marginTop: "10px", width: "378px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ToggleInteractiveExample />, mountNode);

```

