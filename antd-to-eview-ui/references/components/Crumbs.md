# Crumbs 面包屑

> 分类：导航

这是面包屑组件，显示当前页面路径，可定制面包屑路径文本，可定制面包屑路径是否为链接，可定制面包屑分割图标，支持点击回调。

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id 例如： id='crumbsId' | string |  |
| className |  定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 例如： className='crumbsClassName' | string |  |
| title |  传入该值可定制面包屑头部标题，不传则默认不需要标题 例如： title='当前位置' | string |  |
| seprator |  自定义分隔符 | string | > |
| data |  必填项，面包屑配置数据 array<{  url?: string;title: string;enable?: boolean;icon?: string;style?:CSSProperties}> |  | enable默认为true |
| style |  自定义面包屑组件最外层样式，例如：style={{padding:'2rem'}} | object |  |
| onClick |  定义带有链接的面包屑点击事件的回调方法<br><br>**签名:**<br>`function(url: string, event: object) => void`<br>*url:* 触发点击事件的目标元素的url属性.<br>*event:* dom原生事件. | function |  |
| itemStyle | 项 style  （0.1.x 版本支持) | CSSProperties | |
| sepratorStyle | 分隔符style  （0.1.x 版本支持)  | CSSProperties |

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import Crumbs from "eview-ui/Crumbs";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CrumbsSimpleExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const data = [
      {
        title: "Security",
        url: "#/Crumbs1"
      },
      {
        title: "Firewall",
        url: "#/Crumbs2"
      },
      {
        title: "Site-FW",
        url: "#/Crumbs3"
      },
      {
        title: "URL Filter"
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Crumbs data={data} />
          <Crumbs title="自定义分隔符" data={data} seprator="/" />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CrumbsSimpleExample />, mountNode);
```

### 事件处理

事件处理

```jsx
import Crumbs from "eview-ui/Crumbs";
import DivMessage from "eview-ui/DivMessage";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CrumbsLinkExample extends React.Component {
  state = {
    msg: ""
  };

  handleClick = child => {
    this.setState({ msg: "OnClick event callback" });
    console.log(child);
  };

  render() {
    const [version, theme] = getDemoVersion();
    const data = [
      {
        title: "Security",
        url: "#/Crumbs"
      },
      {
        title: "Firewall"
      },
      {
        title: "Site-FW",
        url: "#/Crumbs",
        enable: false
      },
      {
        title: "URL Filter"
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ margin: "20px" }}>
          <Crumbs
            title="Create URL Filter"
            onClick={this.handleClick}
            data={data}
          />
          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{ marginTop: "10px", width: "470px" }}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CrumbsLinkExample />, mountNode);
```

### 带图标的

设置`data`中的`icon`可以设置图标

```jsx
import Crumbs from "eview-ui/Crumbs";
import navFormActive from "@images/nav_form_active";
import navMsgActive from "@images/nav_msg_active";
import navHeartActive from "@images/nav_heart_active";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CrumbsSimpleExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const data = [
      {
        title: "Security",
        url: "#/Crumbs",
        icon: navFormActive
      },
      {
        url: "#/Crumbs",
        icon: navMsgActive
      },
      {
        title: "URL Filter",
        icon: navHeartActive
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Crumbs data={data} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CrumbsSimpleExample />, mountNode);
```

