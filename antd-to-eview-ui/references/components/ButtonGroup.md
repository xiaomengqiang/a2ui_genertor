# Button Group 按钮组

> 分类：通用

该组件用于定义一组按钮，使按钮在一行内排列，同时可自定义按钮之间的间距。

### 如何使用

## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 自定义id | string | - |
| className |  自定义class | string | - |
| style |  设置组件样式 | React.CSSProperties | - |
| data |**与Button组件参数一致**:<br/>设置组件的数据,数组每项对应相应button的配置 | array | - |
| itemClassName |  给每个button加上统一的class | string | - |
| itemStyle |  给每个button加上统一样式 | React.CSSProperties | - |
| size |  设置组件的类型 | `small`\|`normal`\|`large` | `normal`  |

## 使用示例

### 按钮组

按钮组基础设置

```jsx
import ButtonGroup from 'eview-ui/ButtonGroup';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ButtonGroupExample extends React.Component {
  state = {
    msg: '',
  };

  handleClick = e => {
    this.setState({
      msg: 'Clicked Button text: ' + e.currentTarget.textContent,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const labelStyle = {
      display: 'block',
      fontSize: '14px',
      marginBottom: '10px',
    };

    let data = [
      { text: 'Button 1', onClick: this.handleClick },
      { text: 'Button 2', onClick: this.handleClick },
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: '20px'}}>
          <ButtonGroup data={data}/>

          <br/>
          {this.state.msg && (
            <DivMessage text={this.state.msg} type="success" style={{marginTop: '10px', width: '350px'}}/>
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ButtonGroupExample />, mountNode);
```

### 自定义按钮组

自定义按钮之间的间距、颜色等

```jsx
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ButtonGroupExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px' }}>
          <ButtonGroup itemStyle={{marginRight: '50px', color: '#0067d1'}} data={[{ text: 'Button 1' }, { text: 'Button 2' }]}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ButtonGroupExample />, mountNode);
```

