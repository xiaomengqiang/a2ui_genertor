# Button 按钮

> 分类：通用

该组件默认分default和primary两种样式，支持添加图标、设置按钮文本，自定义样式，同时该组件底层采用原生的button标签，支持原生button的所有事件。


## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| id | 自定义id | string | - |
| className |  自定义class | string | - |
| style |  自定义组件样式 | React.CSSProperties | - |
| title | 鼠标悬浮在按钮上的展示的提示信息内容，优先级低于冒泡提示信息 | string | - |
| status |  设置Button的使用场景，默认default样式，特殊场景下设置该属性值为primary | `default`\|`primary`\|`risk`| `default `|
| size |  设置组件的类型 | `small`\|`normal`\|`large` | `normal`  |
| text |  Button中的文本 | string | ''  |
| disabled |  设置Button的灰化状态 | bool | `false` |
| onClick |  点击按钮时的回调<br>*event:* 原生dom的点击事件 <br> | function: <br>`(event: object) => void` | - |
| focused| 设置组件是否默认聚焦 | bool|	`false`|
| leftIcon |  在Button中文本的左边设置图标，传入值为图标的绝对路径 | string | - |
| rightIcon |  在Button中文本的右边设置图标，传入值为图标的绝对路径 | string | - |
| leftIconProps |  设置leftIcon的附加属性 <br>**属性：** <br> *leftHoverIcon*: 光标悬停时的leftIcon <br>*leftIconClass*: leftIcon的自定义类  | object | null |
| rightIconProps |  设置rightIcon的附加属性 <br>**属性：** <br> *rightHoverIcon*: 光标悬停时的rightIcon <br>  *rightIconClass*: rightIcon的自定义类 | object | null |
| toolTipProps |  tip配置 *优先级高于其他tip相关配置* <br> **请使用Tooltip组件添加提示框,结构清晰,组件控制便捷** | object(具体配置见Tooltip组件文档) | null |
| tipStyle | tip样式 | React.CSSProperties | - |
| tipShow | 指定鼠标悬浮在按钮上的提示为冒泡提示，设置的值为always或overflow时生效，与tipData配合使用 | `always`\|`never`\|`overflow`| `never` |
| tipData | tip值,默认显示text属性值  | string | text属性值 |

## 使用示例

### 按钮类型

按钮有三种类型：主按钮`primary`、次按钮`default`、危险按钮`risk`

```jsx
import { Button } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class ButtonExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Button text="Primary Button" status="primary" style={{marginRight: "16px"}}/>
          <Button text="Default Button" tipShow='overflow' style={{marginRight: "16px"}}/>
          <Button text="Risk Button" status="risk"/>
        </div>
      </ConfigProvider>
    );
  }
}
ReactDOM.render(<ButtonExample />, mountNode);
```

### 不可用状态

添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。

```jsx
import Button from "eview-ui/Button";
import LabelField from "eview-ui/LabelField";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonStyle extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let divStyle = { margin: "20px 0px 20px 20px" };
    let iconButtonStyle = { marginRight: "5px", width: "90px" };
    let labelStyle = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: "0px"
    };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_button_example">
          <div style={divStyle}>
            <Button
              text="Primary"
              status="primary"
              style={{marginRight: "1rem", marginBottom: "20px"}}
            />
            <Button
              text="Disable Primary"
              status="primary"
              disabled={true}
              style={{marginBottom: "20px"}}
            />
            <br/>
            <Button
              text="Default"
              tipShow="overflow"
              style={{marginRight: "1rem", marginBottom: "20px"}}
            />
            <Button
              text="Disable Default"
              disabled={true}
              style={{marginBottom: "20px"}}
            />
            <br/>
            <Button
              text="Risk"
              status="risk"
              style={{marginRight: "1rem", marginBottom: "20px"}}
            />
            <Button
              text="Disable Risk"
              status="risk"
              disabled={true}
              style={{marginBottom: "20px"}}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonStyle />, mountNode);
```

### 带图标的按钮

`leftIcon` `leftIconProps`可以设置左图标<br/>
`rightIcon` `rightIconProps`可以设置右图标

```jsx
import Button from "eview-ui/Button";
import Icon from "eview-ui/Icon";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonStyle extends React.Component {
  state = { iconsSvg: {}, };

  getIconToBase64Svg = ({ key, iconName = key, color }) => {
    const [version, theme] = getDemoVersion();

    return new Promise((resolve) => {
      const tempDiv = document.createElement('div');
      const renderIcon = <Icon version={version} theme={theme} name={key} color={color}/>;
      ReactDOM.render(renderIcon, tempDiv, () => {
        const innerHTMLSvg = tempDiv.innerHTML;
        ReactDOM.unmountComponentAtNode(tempDiv);
        resolve({ [iconName]: `data:image/svg+xml;base64,${btoa(innerHTMLSvg)}` });
      });
    });
  };

  componentDidMount() {
    const iconNames = [{ key: 'plus' }, { key: 'del' }];

    Promise.allSettled(iconNames.map((icon) => this.getIconToBase64Svg(icon)))
      .then((results) => {
        const iconsSvg = results
          .filter((result) => result.status === 'fulfilled') // 过滤出成功的 Promise
          .map((result) => result.value)
          .reduce((acc, curr) => ({ ...acc, ...curr }), {});

        this.setState({ iconsSvg });
      });
  }

  render() {
    const [version, theme] = getDemoVersion();
    const { iconsSvg } = this.state;
    let divStyle = { display: "flex" };
    let iconButtonStyle = { flex: "1", marginRight: "0.5rem" };
    let labelStyle = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: "0px"
    };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_button_example">
          <div style={divStyle}>
            <Button
              leftIcon={iconsSvg.plus}
              leftIconProps={{
                leftHoverIcon: iconsSvg.del,
                leftIconClass: 'my-icon-class',
              }}
              onClick={() => {
                alert(123);
              }}
              style={{padding: 0, border: 0, height: '100%', margin: '0.5rem 1rem 0 0'}}
            />
            <Button
              text="Primary Button"
              tipShow="overflow"
              tipData={"Hello React"}
              status="primary"
              rightIcon={iconsSvg.plus}
              style={iconButtonStyle}
            />
            <Button
              text="Default Button"
              tipShow="overflow"
              leftIcon={iconsSvg.plus}
              style={iconButtonStyle}
            />
            <Button
              text="Risk Button"
              tipShow="overflow"
              tipData={"Hello React"}
              status="risk"
              style={iconButtonStyle}
              leftIcon={iconsSvg.del}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonStyle />, mountNode);
```

### 按钮尺寸

按钮有大、中（默认）、小三种尺寸。
通过设置 `size` 为 `large` `default` `small` 分别把按钮设为大、中（默认）、小尺寸。

```jsx
import Button from "eview-ui/Button";
import LabelField from "eview-ui/LabelField";
import Radio from "eview-ui/Radio";
import Icon from "eview-ui/Icon";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonStyle extends React.Component {
  state = {
    size: "default",
  };

  render() {
    const [version, theme] = getDemoVersion();
    const { size } = this.state;
    const btnStyle = {
      marginRight: "1rem",
      marginTop: "0.5rem",
     };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_button_example">
          <div style={{marginBottom: "1rem", display: "flex"}}>
            <LabelField text="尺寸:"/>
            <Radio
              value="large"
              label="large"
              checked={size === "large"}
              onChange={value => this.setState({size: value})}
              style={{marginRight: "0.5rem"}}
            />
            <Radio
              value="default"
              label="default"
              checked={size === "default"}
              onChange={value => this.setState({size: value})}
              style={{marginRight: "0.5rem"}}
            />
            <Radio
              value="small"
              label="small"
              checked={size === "small"}
              onChange={value => this.setState({size: value})}
            />
          </div>
          <div>
            <Button
              text="Primary Button"
              status="primary"
              size={size}
              style={btnStyle}
            />
            <Button
              text="Default Button"
              tipShow="overflow"
              size={size}
              style={btnStyle}
            />
            <Button text="Risk Button" status="risk" size={size} style={btnStyle}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonStyle />, mountNode);
```

### 提示功能

`tipData`设置提示信息

```jsx
import Button from "eview-ui/Button";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonStyle extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let divStyle = { margin: "20px 0px 20px 20px" };
    let iconButtonStyle = { marginRight: "5px", width: "90px" };
    let labelStyle = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: "0px"
    };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_button_example">
          <div style={divStyle}>
            <Button
              text="带提示的按钮"
              tipData="Hello eViews!"
              tipShow="always"
              style={{width: '8rem', marginRight: "1rem", marginBottom: "20px"}}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonStyle />, mountNode);
```

### 自动聚焦

`focused`属性可以让页面渲染完成后进行自动聚焦到按钮上

```jsx
import Button from "eview-ui/Button";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonStyle extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <Button text="自动聚焦按钮" focused={true}/>;
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<IconButtonStyle />, mountNode);
```

