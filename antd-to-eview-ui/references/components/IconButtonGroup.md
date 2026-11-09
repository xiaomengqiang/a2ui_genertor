# IconButtonGroup 图标按钮组

> 分类：通用

该组件支持自定义样式和图标,同时支持通过iconName属性获取组件库中的已有图标。

## API

### 属性

| 属性名称 | 描述 | 类型 | 默认 |
|-----|-----|-----|-----|
| id | 元素id| string |  |
| data |  组件data,如 [{text:"按钮1",iconUrl:navForm,hoverIconUrl:navFormActive,type:"button",onClick:()=>{}}]，可参考IconButton组件传参  | array |  |
| className |  通过添加class的方式自定义组件样式，作用于组件最外层div | string |  |
| style |  通过添加style的方式自定义组件样式，作用于组件最外层div | object |  |
| itemClassName |  通过添加class的方式自定义组件下拉项中图标样式 | string |  |
| itemStyle |  通过添加style的方式自定义组件下拉项中图标样式 | object |  |

## 接口定义

```typescript
interface IconButtonGroup {


  /**
   * 设置组件的数据
   * 例如：data=[{text:"按钮1";status:"primary";type:"button";onClick:()=>{}};{text:"按钮2"}];
   * 数组内的对象可定义Button组件的所有属性
   */
  data: any;

  /**
   * 设置ButtonGroup的id
   */
  id: string;

  /**
   * 通过添加类的方式控制整个ButtonGroup的样式（控制最外层div）
   * 可控制：margin、padding
   */
  className: string;

  /**
   * 通过添加style的方式控制整个ButtonGroup的样式（控制最外层div）
   * 可控制：margin、padding 例如：style={{margin:"0px"}}
   */
  style: object;

  /**
   * 通过添加类的方式控制各个Button相互之间的样式
   * 例如：通过margin-let和margin-right控制间距
   */
  itemClassName: string;

  /**
   * 通过添加类的方式控制各个Button相互之间的样式
   * 例如：通过margin-let和margin-right控制间距
   */
  itemStyle: object;

}
```

## 使用示例

### 基本属性设置

## en-US

```jsx
import IconButtonGroup from "eview-ui/IconButtonGroup";
import DivMessage from 'eview-ui/DivMessage';
import navForm from "@images/nav_form"
import navFormActive from "@images/nav_form_active"
import navMsg from "@images/nav_msg"
import navMsgActive from "@images/nav_msg_active"
import navHeart from "@images/nav_heart"
import navHeartActive from "@images/nav_heart_active"
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonGroupExample extends React.Component {
  state = {
    msg: '',
  };

  handleClick = () => {
    this.setState({ msg: "Callback events for the component's click event" });
  };
  render() {
    const [version, theme] = getDemoVersion();
    const data = [
      {
        className: "",
        style: "",
        title: "icon1",
        tipText:"form",
        tipData:{ disposeTimeOut: 5000, arrowDirection: 'none' },
        iconUrl: navForm,
        hoverIconUrl: navFormActive,
        onClick:this.handleClick,
      },
      {
        title: "icon2",
        disabled: true,
        tipText:"msg",
        iconUrl: navMsg,
        hoverIconUrl: navMsgActive
      },
      {
        title: "icon3",
        disabled: false,
        tipText:"heart",
        iconUrl: navHeart,
        hoverIconUrl: navHeartActive
      },
      {
        title: "icon3",
        disabled: false,
        tipText:"starImg",
        iconName: "star",
      }
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_IconButtonGroup_example">
          <div>
            <IconButtonGroup data={data} id={"IconButtonGroupId"}/>
          </div>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonGroupExample />, mountNode);

```

```jsx
import IconButtonGroup from "eview-ui/IconButtonGroup";
import DivMessage from 'eview-ui/DivMessage';
import navForm from "@images/nav_form"
import navFormActive from "@images/nav_form_active"
import navMsg from "@images/nav_msg"
import navMsgActive from "@images/nav_msg_active"
import navHeart from "@images/nav_heart"
import navHeartActive from "@images/nav_heart_active"
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonGroupExample extends React.Component {
  state = {
    msg: '',
  };

  handleClick = () => {
    this.setState({ msg: "Callback events for the component's click event" });
  };
  render() {
    const [version, theme] = getDemoVersion();
    const data = [
      {
        className: "",
        style: "",
        title: "icon1",
        tipText:"form",
        tipData:{ disposeTimeOut: 5000, arrowDirection: 'none' },
        iconUrl: navForm,
        hoverIconUrl: navFormActive,
        onClick:this.handleClick,
      },
      {
        title: "icon2",
        disabled: true,
        tipText:"msg",
        iconUrl: navMsg,
        hoverIconUrl: navMsgActive
      },
      {
        title: "icon3",
        disabled: false,
        tipText:"heart",
        iconUrl: navHeart,
        hoverIconUrl: navHeartActive
      },
      {
        title: "icon3",
        disabled: false,
        tipText:"starImg",
        iconName: "star",
      }
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_IconButtonGroup_example">
          <div>
            <IconButtonGroup data={data} id={"IconButtonGroupId"}/>
          </div>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonGroupExample />, mountNode);

```

