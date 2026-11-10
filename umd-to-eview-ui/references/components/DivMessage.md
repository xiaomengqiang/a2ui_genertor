# DivMessage 通知提醒

> 分类：反馈

Div提示框，主要用于区域操作的结果性提示，直接显示在主内容区域的上方，默认显示10s后自动消失。支持定义样式，自定义文本内容，自定义图标，支持[“默认”,“成功”,“失败”]三种类型。



## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Alert` | `DivMessage` | `message`→**`text`**；`type`（`default`/`success`/`error`/`warn`，3.1 另有 `risk`/`highRisk`）；**`display` 显隐（不是 visible/isOpen）**；`closable` 默认 true；`disposeTimeOut`（**默认 0 = 不自动隐藏**；TimeOut 大写 O 拼写）；`description`→`detail`? 无——内容全走 `text`（any 类型） |
| `message.success()` | `DivMessage`（受控渲染） | **无命令式 API**；只能渲染 `<DivMessage display type="success" text>`；换 key 重挂触发重新计时；或用 `MessageDialogPro.success(config)` 静态（但脱离 context）；**DivMessage 渲染在父组件渲染树中会引发输入组件失焦**（通知浮层抽离独立组件 + 自己的 state） |

## API


### 属性

| 属性名称 | 描述                                                                                | 输入                                                                              | 默认 |
|:-----|:----------------------------------------------------------------------------------|:--------------------------------------------------------------------------------|:-----|
| id | 默认支持动态设置id;同时支持用户自定义设置固定id                                                        | string                                                                          |  |
| className | 支持通过className设置组件样式                                                               | string                                                                          |  |
| style | 支持通过style设置组件样式                                                                   | React.CSSProperties                                                             |  |
| text | 支持通过text设置组件文本内容                                                                  | any                                                                             |  |
| icon | 支持通过icon设置组件图标，icon为url，组件默认图标符合AUI2.0规范，图片大小为24*24                               | string                                                                          |  |
| iconClassName | 支持通过iconClassName设置图标样式                                                           | string                                                                          |  |
| disposeTimeOut | 支持通过设置disposeTimeOut显示时间，如果用户给出超过0毫秒，超过该时间就会隐藏。默认不隐藏                              | number                                                                          | 0 |
| closable  | 根据用户配置设置关闭信息提示。                                                                   | boolean                                                                         | true |
| type | 支持通过type设置组件类型，包括[success，error，default, error]三种类型,ICT 3.1以上风格支持 risk和highRisk类型 | enum:<br>&nbsp;"success"<br>&nbsp;"error"<br>&nbsp;"warn"<br>&nbsp;"default"<br> | "default" |
| display | 支持通过display设置组件显示与隐藏                                                              | boolean                                                                         | true |
| onClose | 自定义点击关闭按钮关闭DivMessage时的回调方法，不传则无回调 例如：onClose={()=>alert('2')}                    | function                                                                        |  |

## 使用示例

### 基本属性设置

## en-US



```jsx
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import imgPicture from '@images/filter';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DivMessageExample extends React.Component {

  state = {
    display: false,
  };

  handleClick = () => {
    this.setState({ display: true });
  };

  handleClose = () => {
    console.log("onClose fired");
  };

  render() {
    const [version, theme] = getDemoVersion();

    let style = { marginBottom: "20px" };

    let contentValue = [
      <span>
        <b>Procedure: </b>
        <br />
        <p>1. The iEMP checks the usage of the security management
        tablespace in the database at the specified time everyday.
        <br />
          If the tablespace usage exceeds the threshold, the iEMP dumps the
          oldest audit logs (including security logs, operation logs, and system logs)
          to a specified directory, and deletes the data from the database, until the
        usage is lower than the threshold.  </p>
        <p>2. The iEMP checks the size or save
        time of the files in the directory. If the size or time exceeds the preset
        value, the iEMP deletes the oldest files, until the size and time meet the preset conditions.</p>
      </span>];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{margin: "20px"}}>
          <div style={{margin: "20px 0px"}}>
            <DivMessage text="Cloud host hws-ws-00032 started successfully!" type="success" disposeTimeOut={5000}
                        style={style} onClose={this.handleClose}/>
            <DivMessage text="Cloud host hws-ws-00032 failed to start!" type="error" style={style}/>
            <DivMessage text="Cloud host hws-ws-00032 giving warning!" type="warn" style={style}/>
            <DivMessage text="System is busy, please try again later!" type="default" style={style}/>
            {version === 'aui3-1' && (
              <>
                <DivMessage text="System is busy, please try again later!" type="risk" style={style}/>
                <DivMessage text="System is busy, please try again later!" type="highRisk" style={style}/>
              </>
            )}
            <DivMessage text="Custom icon" type="default" icon={imgPicture} style={style}/>
            <DivMessage text={contentValue} type="success" icon={imgPicture}
                        style={{marginBottom: "20px", width: "600px"}}/>
          </div>
          <Button onClick={this.handleClick}
                  text="DivMessage disappears automatically after 5 seconds. Click the button to display the component again!"/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<DivMessageExample />, mountNode);

```

```jsx
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import imgPicture from '@images/filter';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DivMessageExample extends React.Component {

  state = {
    display: false,
  };

  handleClick = () => {
    this.setState({ display: true });
  };

  handleClose = () => {
    console.log("onClose fired");
  };

  render() {
    const [version, theme] = getDemoVersion();

    let style = { marginBottom: "20px" };

    let contentValue = [
      <span>
        <b>Procedure: </b>
        <br />
        <p>1. The iEMP checks the usage of the security management
        tablespace in the database at the specified time everyday.
        <br />
          If the tablespace usage exceeds the threshold, the iEMP dumps the
          oldest audit logs (including security logs, operation logs, and system logs)
          to a specified directory, and deletes the data from the database, until the
        usage is lower than the threshold.  </p>
        <p>2. The iEMP checks the size or save
        time of the files in the directory. If the size or time exceeds the preset
        value, the iEMP deletes the oldest files, until the size and time meet the preset conditions.</p>
      </span>];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{margin: "20px"}}>
          <div style={{margin: "20px 0px"}}>
            <DivMessage text="Cloud host hws-ws-00032 started successfully!" type="success" disposeTimeOut={5000}
                        style={style} onClose={this.handleClose}/>
            <DivMessage text="Cloud host hws-ws-00032 failed to start!" type="error" style={style}/>
            <DivMessage text="Cloud host hws-ws-00032 giving warning!" type="warn" style={style}/>
            <DivMessage text="System is busy, please try again later!" type="default" style={style}/>
            {version === 'aui3-1' && (
              <>
                <DivMessage text="System is busy, please try again later!" type="risk" style={style}/>
                <DivMessage text="System is busy, please try again later!" type="highRisk" style={style}/>
              </>
            )}
            <DivMessage text="Custom icon" type="default" icon={imgPicture} style={style}/>
            <DivMessage text={contentValue} type="success" icon={imgPicture}
                        style={{marginBottom: "20px", width: "600px"}}/>
          </div>
          <Button onClick={this.handleClick}
                  text="DivMessage disappears automatically after 5 seconds. Click the button to display the component again!"/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<DivMessageExample />, mountNode);

```

