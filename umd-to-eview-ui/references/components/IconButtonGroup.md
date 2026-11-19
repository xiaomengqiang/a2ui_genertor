# IconButtonGroup 图标按钮组

> 分类：通用

该组件用于将多个图标按钮组合在一起展示。每个按钮项的数据通过`data`数组传入，数组内每个对象对应一个IconButton组件。组件采用Flexbox布局，自动处理按钮间距（首项无左间距，末项无右间距，中间项右间距1.875rem），支持换行（flex-wrap: wrap）。

## API

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 组件最外层div的id | string | 自动生成（前缀`eui_bg_`） |
| data | 按钮组数据数组，数组内每个对象对应一个IconButton组件，可传入IconButton的所有属性，其余属性通过`...other`透传 | array | |
| className | 通过添加class的方式自定义组件样式，作用于组件最外层div | string | |
| style | 通过添加style的方式自定义组件样式，作用于组件最外层div | React.CSSProperties | |
| itemClassName | 通过添加class的方式自定义所有按钮项的样式，作用于每个IconButton的className | string | |
| itemStyle | 通过添加style的方式自定义所有按钮项的基础样式，作用于每个IconButton的style，与单项style合并（itemStyle优先级低于单项style中的同名属性会被覆盖） | React.CSSProperties | |

### data 数组项属性

data数组中的每个对象支持以下属性（对应IconButton组件），以及IconButton的其他所有属性（如`tipText`、`tipData`、`iconName`、`iconProps`、`onMouseEnter`、`onMouseLeave`、`onFocus`、`onBlur`等）：

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| iconUrl | 通过传入图片路径设置图标按钮 | string | |
| hoverIconUrl | 通过传入图片路径设置鼠标悬浮时的按钮图标 | string | |
| disabled | 设置该按钮的灰化（禁用）状态 | boolean | `false` |
| className | 单个按钮项的自定义class，会追加到itemClassName之后 | string | |
| style | 单个按钮项的自定义style，与itemStyle合并 | object | |
| title | 按钮的title属性 | string | |
| tipText | 提示文本 | string | |
| tipData | 提示气泡配置项，传递给内部Tooltip组件 | object | |
| iconName | 使用组件库已有图标的名称，与iconUrl二选一 | string | |
| onClick | 点击事件回调 | function | |

> **注意**：data数组中，除了`className`、`style`、`title`、`iconUrl`、`disabled`、`hoverIconUrl`被显式解构外，其余属性（如`tipText`、`tipData`、`iconName`、`iconProps`、`onClick`等）通过`...other`透传给IconButton组件。

### 内置样式类

| 类名 | 说明 |
|------|------|
| `eui_icon_button_group` | 最外层容器div，display: flex, align-items: center, flex-wrap: wrap |
| `eui_icon_button_group_item` | 每个按钮项，margin-right: 1.875rem |
| `eui_icon_button_group_item_first` | 第一个按钮项，margin-left: 0 |
| `eui_icon_button_group_item_last` | 最后一个按钮项，margin-right: 0 |

## 使用示例

### 基本属性设置

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
        title: "icon1",
        tipText: "form",
        tipData: { disposeTimeOut: 5000, placement: 'top' },
        iconUrl: navForm,
        hoverIconUrl: navFormActive,
        onClick: this.handleClick,
      },
      {
        title: "icon2",
        disabled: true,
        tipText: "msg",
        iconUrl: navMsg,
        hoverIconUrl: navMsgActive,
      },
      {
        title: "icon3",
        tipText: "heart",
        iconUrl: navHeart,
        hoverIconUrl: navHeartActive,
      },
      {
        title: "icon4",
        tipText: "star",
        iconName: "star",
      }
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_IconButtonGroup_example">
          <div>
            <IconButtonGroup data={data} id="IconButtonGroupId"/>
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

### 使用 iconName 和自定义样式

```jsx
import IconButtonGroup from "eview-ui/IconButtonGroup";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconButtonGroupStyledExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const data = [
      {
        tipText: "编辑",
        iconName: "edit",
        iconProps: { color: '#191919', hoverColor: '#0072e8' },
      },
      {
        tipText: "删除",
        iconName: "del",
        iconProps: { color: '#191919', hoverColor: '#0072e8' },
      },
      {
        tipText: "刷新",
        iconName: "refresh",
        iconProps: { color: '#191919', hoverColor: '#0072e8' },
      },
      {
        tipText: "设置",
        iconName: "operation",
        disabled: true,
      },
    ];

    return (
      <ConfigProvider version={version} theme={theme}>
        <IconButtonGroup
          data={data}
          itemStyle={{ marginRight: '0.5rem' }}
          style={{ padding: '8px' }}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconButtonGroupStyledExample />, mountNode);
```

