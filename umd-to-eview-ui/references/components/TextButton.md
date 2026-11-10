# TextButton 文本按钮

> 分类：通用

该组件支持自定义样式和文本。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Button type="text"` | `TextButton` | `text` prop + `onClick(event)`；或手写 `<a>` |

## API



### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| id | 自定义id | string | - |
| className |  自定义class | string | - |
| style |  自定义组件样式 | React.CSSProperties | - |
| text |  显示文字 | string | '' |
| disabled |  组件的灰化状态 | bool | false |
| onClick |  组件的点击事件<br>*event: 原生dom的点击事件* | function:<br> (event: object) => void | - |

## 使用示例

### 基本属性设置

## en-US



```jsx
import TextButton from 'eview-ui/TextButton';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextButtonExample extends React.Component {

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
            <TextButton id="btnUpdate" text="Modify"/>
          </div>
          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>Disabled</LabelField>
            <TextButton text="Set" disabled/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextButtonExample />, mountNode);

```

```jsx
import TextButton from 'eview-ui/TextButton';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextButtonExample extends React.Component {

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
            <TextButton id="btnUpdate" text="Modify"/>
          </div>
          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>Disabled</LabelField>
            <TextButton text="Set" disabled/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextButtonExample />, mountNode);

```

### 事件回调

## en-US



```jsx
import TextButton from 'eview-ui/TextButton';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextButtonEvent extends React.Component {

  state = {
    msg: '',
  };

  handleClick = () => {
    this.setState({ msg: "Callback events for the component's click event" });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = {margin: '20px'};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_button_example" style={divStyle}>
          <div style={{marginBottom: '5px'}}>
            <TextButton text="Event Display" onClick={this.handleClick}/>
            {this.state.msg ?
              <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextButtonEvent />, mountNode);

```

```jsx
import TextButton from 'eview-ui/TextButton';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TextButtonEvent extends React.Component {

  state = {
    msg: '',
  };

  handleClick = () => {
    this.setState({ msg: "Callback events for the component's click event" });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = {margin: '20px'};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_button_example" style={divStyle}>
          <div style={{marginBottom: '5px'}}>
            <TextButton text="Event Display" onClick={this.handleClick}/>
            {this.state.msg ?
              <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TextButtonEvent />, mountNode);

```

