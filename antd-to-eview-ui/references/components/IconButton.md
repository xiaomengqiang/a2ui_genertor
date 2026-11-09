# IconButton 图标按钮

> 分类：废弃

该组件支持自定义样式和图标,同时支持通过iconName属性获取组件库中的已有图标。

IconButton 中的提示气泡 ，在 0.0.x 版本中采用 TipBox 实现，样式对应 TipBox 的样式。在 0.1.x 版本中采用 Tooltip 实现，样式对应 Tooltip 样式。

## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| id |  设置组件的id | string |  |
| className |  通过自定义class的方式给组件添加样式 | string |  |
| style |  通过添加style的方式给组件添加样式 | object |  |
| iconUrl |  通过传入路径设置图标按钮 | string |  |
| hoverIconUrl |  通过传入路径设置鼠标悬浮时的按钮图标 | string |  |
| iconName |   获取组件库中的已有图标,与iconUrl属性，二者只能用其一 | string |  |
| iconProps |  改属性配和iconName一同使用，用来设置组件库已有图标样式，不设置为组件库默认样式 <br>{color:#39f//定制组件默认颜色 <br>hoverColor:#39f//定制组件鼠标悬浮时颜色 <br>disabledColor:#999//定制组件灰化颜色 } | object |  |
| disabled |  设置组件的灰化状态 | bool | false |
| onClick |  设置组件的点击事件<br><br>**Signature:**<br>`function(event: object) => void`<br>*event:* 原生dom的点击事件 | function |  |
| tipText |  提示文本  | string |  |
| tipData | 0.0.x版本 tipData={{disposeTimeOut:5000,arrowDirection:'left',style:{maxWidth:'218px'}}} 0.1.x 版本对应 Tooltip 的 props | object |  |

## 使用示例

### 基本属性设置

## en-US



```jsx
import IconButton from 'eview-ui/IconButton';
import LabelField from 'eview-ui/LabelField';
import pen_default from '@images/pen_default';
import pen_hover from '@images/pen_hover';
import pen_disabled from '@images/pen_disabled';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = { margin: '20px 0px 50px 20px' };
    const labelStyle = {
      display: 'block',
      fontSize: '14px',
      marginBottom: '10px',
      paddingLeft: '0px',
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={divStyle}>
          <div style={{display: "inline-block", marginRight: "30px"}}>
            <LabelField style={labelStyle}>Default</LabelField>
            <IconButton tipText="Modify" tipData={{disposeTimeOut: 5000, arrowDirection: 'none'}} iconUrl={pen_default}
                        hoverIconUrl={pen_hover}/>
          </div>
          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>Disabled</LabelField>
            <IconButton tipText="Set" tipData={{disposeTimeOut: 5000, arrowDirection: 'none'}} disabled
                        iconUrl={pen_disabled} hoverIconUrl={pen_hover}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonDemo />, mountNode);

```

```jsx
import IconButton from 'eview-ui/IconButton';
import LabelField from 'eview-ui/LabelField';
import pen_default from '@images/pen_default';
import pen_hover from '@images/pen_hover';
import pen_disabled from '@images/pen_disabled';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = { margin: '20px 0px 50px 20px' };
    const labelStyle = {
      display: 'block',
      fontSize: '14px',
      marginBottom: '10px',
      paddingLeft: '0px',
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={divStyle}>
          <div style={{display: "inline-block", marginRight: "30px"}}>
            <LabelField style={labelStyle}>Default</LabelField>
            <IconButton tipText="Modify" tipData={{disposeTimeOut: 5000, arrowDirection: 'none'}} iconUrl={pen_default}
                        hoverIconUrl={pen_hover}/>
          </div>
          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>Disabled</LabelField>
            <IconButton tipText="Set" tipData={{disposeTimeOut: 5000, arrowDirection: 'none'}} disabled
                        iconUrl={pen_disabled} hoverIconUrl={pen_hover}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonDemo />, mountNode);

```

### 事件回调

按钮有四种类型：主按钮、次按钮、虚线按钮和链接按钮。主按钮在同一个操作区域最多出现一次。

```jsx
import IconButton from 'eview-ui/IconButton';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonEvent extends React.Component {

  state = {
    msg: '',
  };

  handleClick = () => {
    this.setState({ msg: "Callback events for the component's click event" });
  };


  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = {margin: '20px 0px 50px 20px'};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={divStyle}>

          <div style={{display: "inline-block", marginRight: "100px"}}>
            <IconButton tipText="Display Tip" tipData={{disposeTimeOut: 5000, arrowDirection: 'none'}}
                        iconName="operation" onClick={this.handleClick}/>
          </div>

          <div style={{display: "inline-block"}}>
            <IconButton tipText="Loading Tip" tipData={{disposeTimeOut: 5000, arrowDirection: 'none'}}
                        iconName="loading" onClick={this.handleClick}/>
          </div>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}

        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<IconButtonEvent />, mountNode);
```

