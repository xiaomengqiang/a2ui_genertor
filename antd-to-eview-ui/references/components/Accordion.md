# Accordion 侧边导航

> 分类：导航

手风琴控件提供展示页面和功能的导航菜单。

## API

### 属性

| 属性名称          | 描述                                                                                                                                       | 输入             | 默认  |
| :---------------- |:-----------------------------------------------------------------------------------------------------------------------------------------|:---------------| :---- |
| id                | 用户传入自定义 id 用于覆盖组件自动生成 id                                                                                                                 | string         |       |
| data              | 手风琴数据 array<{title: ReactNode;value: string;icon?: string;description?: string;activeIcon?: string;disabled?: boolean;children?: array}> | array          |       |
| selectedValue     | 默认被选中的项的 value，不设置，则为第一项的 value                                                                                                          | string         | null  |
| headerText        | 手风琴标题文字                                                                                                                                  | string         |       |
| headerIcon        | 手风琴标题图标的 url                                                                                                                             | string         |       |
| enableTooltip     | 是否使用提示                                                                                                                                   | bool           | true  |
| toolTipProps     | 自定义手风琴菜单的Tooltip属性(6.0.x版本支持)，需要将enableTooltip设置为true，参考Tooltip组件文档来设置                                                                   | [CustomTooltipType](/components/Tooltip/)         |   |
| forceShowTip      | 强制展示tip，设置为 'title'，使用浏览器默认的title属性。此时会忽略enableTooltip属性；enableTooltip只会在有溢出时才展示。                                                        | string \| bool | false  |
| defaultOpenKeys    | 默认展示项的key                                                                                                                                | string[]       |  |
| disabledItemKeys   | 禁用项的key                                                                                                                                  | string[]       |  |
| hideTitleBar      | 隐藏标题栏。                                                                                                                                   | bool           | false |
| headerIconPosition  | 控制头部 Icon 布局，可选值有 'top'、'left'                                                                                                           | string         | top |
| enableMultiOpen   | 是否允许同时展开多个一级菜单                                                                                                                           | bool           | false |
| showArrow      | 是否启用菜单收缩                                                                                                                                 | bool           | false |
| enableExpand      | 是否允许折叠                                                                                                                                   | bool           | false |
| expanded          | 默认是否展开                                                                                                                                   | bool           | true |
| allowResize       | 是否允许拖动                                                                                                                                   | bool           | false |
| maxResizableWidth | 最大可拖动宽度，支持 px 和 rem 单位                                                                                                                   | string         |       |
| style             | 通过 style 控制组件最外层样式                                                                                                                       | object         |       |
| className         | 通过 class 控制组件最外层样式                                                                                                                       | string         |       |
| onClick           | 手风琴元素被点击后的回调函数<br><br>**签名:**<br>`function(node: object) => void`<br>_node:_ 被点击项对应 data 中的原始数据                                          | function       |       |
| onItemRightClick  | Callback on right click on item. br><br>**Signature:**<br>`function(event: object, node: object) => void`<br>_node:_ clicked node data   | function       |       |
| onExpand          | 设置面板收起展开回调<br><br>**签名:**<br>`function(bool: flag) => void`<br>_bool:_ 面板展开时为 true，收起时为 false                                            | function       |       |
| onResize          | 拖动回调函数`resizeData:{oldWidth: string;newWidth: string;}) => void;`<br>                                                                    | function       |       |

## 使用示例

### 基本

使用时需要传入菜单数据源，可以支持多级菜单

```jsx
import Accordion from "eview-ui/Accordion";
import DivMessage from "eview-ui/DivMessage";
import { Row, Col } from "eview-ui/GridLayout";
import LabelField from "eview-ui/LabelField";
import huawei from "@images/huawei";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class AccordionDemo extends React.Component {
  // static init state here
  state = {
    msg: '',
    data: [
      {
        title: "Navigation One",
        value: "1"
      },
      {
        title: "Navigation Two",
        value: "hero-since-child",
        children: [
          {
            title: "Option1",
            value: "opt1",
            children: [
              {
                title: "Sub Option1",
                value: "subOpt1"
              },
              {
                title: "Sub Option2",
                value: "subOpt2"
              },
              {
                title: "Sub Option3",
                value: "subOpt3"
              },
              {
                title: "Sub Option4",
                value: "subOpt4"
              }
            ]
          },
          {
            title: "Option2",
            value: "opt2"
          },
          {
            title: "Option3",
            value: "opt3"
          },
          {
            title: "Option4",
            value: "opt4"
          }
        ]
      },
      {
        title: "Navigation Tree",
        value: "off-the-wall",
        children: [
          {
            title: "Security Rule",
            value: "Security Rule"
          },
          {
            title: "Traffic Rule",
            value: "Traffic Rule"
          },
          {
            title: "Application Group",
            value: "Application Group"
          },
          {
            title: "URL Filter",
            value: "URL Filter"
          }
        ]
      }
    ],
    selectedValue: "subOpt1"
  };
  handleClick = (node) => {
    if (!node.children || node.children?.length === 0) {
      this.setState({
        msg: `Clicked Node ：\n${node.code}`,
        selectedValue: node.value,
      });
    }
  };

  handleRightClick = (event, node) => {
    console.log("handleRightClick called : ", event);
    console.log("node : ", node);
  };
  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ background: "#fcfcfc", width: "100%" }}>
          <Accordion
            onClick={this.handleClick}
            onItemRightClick={this.handleRightClick}
            data={this.state.data}
            selectedValue={this.state.selectedValue}
            headerIcon={huawei}
            style={{ height: "540px" }}
          />
          {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "280px" }} /> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<AccordionDemo />, mountNode);
```

### 收缩、展开菜单

加入`enableExpand`属性可配置收缩功能，加入`showArrow`属性可配置展开功能

```jsx
import Accordion from "eview-ui/Accordion";
import DivMessage from "eview-ui/DivMessage";
import { Row, Col } from "eview-ui/GridLayout";
import LabelField from "eview-ui/LabelField";
import Radio from "eview-ui/Radio";
import huawei from "@images/huawei";
import navFormActive from "@images/nav_form_active";
import navForm from "@images/nav_form";
import navMsg from "@images/nav_msg";
import navMsgActive from "@images/nav_msg_active";
import navHeart from "@images/nav_heart";
import navHeartActive from "@images/nav_heart_active";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
export default class AccordionDemo extends React.Component {
  // static init state here
  state = {
    expandMethod: "expand",
    data: [
      {
        title: "Overview",
        value: "over_view",
        icon: navForm,
        activeIcon: navFormActive
      },
      {
        title: "Easy Configuration",
        value: "hero-since-child",
        icon: navMsg,
        activeIcon: navMsgActive,
        children: [
          {
            title: "Thriller",
            description:
              "唱片同名歌曲，创造了多个单曲格莱美大奖记录，一举奠定了流行音乐天王地位。"
          },
          {
            title: "The Girl Is Mine",
            description: "热辣火热的舞蹈和动感心动的声响完美的结合"
          },
          {
            title: "Beat It",
            description: "经典中的经典，几乎无人不知",
            value: "beat-it"
          },
          {
            title: "Billie Jean",
            description: "传说来自天王的一个亲身经历"
          }
        ]
      },
      {
        title: "Advanced Configuration",
        icon: navHeart,
        activeIcon: navHeartActive,
        value: "off-the-wall",
        children: [
          {
            title: "Security Rule",
            value: "Security Rule"
          },
          {
            title: "Traffic Rule"
          },
          {
            title: "Application Group"
          },
          {
            title: "URL Filter",
            value: "URL Filter"
          }
        ]
      }
    ],
    selectedValue: "URL Filter"
  };

  render() {
    const { expandMethod } = this.state
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginBottom: "1rem" }}>
          <LabelField text="展开方式" />
          <Radio
            value="expand"
            label="缩小"
            checked={expandMethod === "expand"}
            onChange={value => this.setState({ expandMethod: value })}
            style={{ marginRight: "0.5rem" }}
          />
          <Radio
            value="arrow"
            label="收起"
            checked={expandMethod === "arrow"}
            onChange={value => this.setState({ expandMethod: value })}
          />
        </div>
        <div style={{ background: "#fcfcfc", width: "100%" }}>
          <Accordion
            data={this.state.data}
            headerText={"Site1-FW"}
            selectedValue={this.state.selectedValue}
            enableExpand={expandMethod === "expand"}
            showArrow={expandMethod === "arrow"}
            style={{ height: "776px", width: "344px" }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<AccordionDemo />, mountNode);
```

### 头部样式

设置`hideTitleBar`可以控制是否需要头部，`headerIconPosition`可以控制头部 Icon 布局

```jsx
import Accordion from "eview-ui/Accordion";
import DivMessage from "eview-ui/DivMessage";
import Toggle from "eview-ui/Toggle";
import Radio from "eview-ui/Radio";
import { Row, Col } from "eview-ui/GridLayout";
import LabelField from "eview-ui/LabelField";
import navFormActive from "@images/nav_form_active";
import navForm from "@images/nav_form";
import navMsg from "@images/nav_msg";
import navMsgActive from "@images/nav_msg_active";
import navHeart from "@images/nav_heart";
import navHeartActive from "@images/nav_heart_active";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class AccordionDemo extends React.Component {
  // static init state here
  state = {
    hideTitleBar: false,
    headerIconPosition: "top",
    data: [
      {
        title: "Overview",
        value: "over_view",
        icon: navForm,
        activeIcon: navFormActive
      },
      {
        title: "Easy Configuration",
        value: "hero-since-child",
        icon: navMsg,
        activeIcon: navMsgActive,
        children: [
          {
            title: "Thriller",
            description:
              "唱片同名歌曲，创造了多个单曲格莱美大奖记录，一举奠定了流行音乐天王地位。"
          },
          {
            title: "The Girl Is Mine",
            description: "热辣火热的舞蹈和动感心动的声响完美的结合"
          },
          {
            title: "Beat It",
            description: "经典中的经典，几乎无人不知",
            value: "beat-it"
          },
          {
            title: "Billie Jean",
            description: "传说来自天王的一个亲身经历"
          }
        ]
      },
      {
        title: "Advanced Configuration",
        icon: navHeart,
        activeIcon: navHeartActive,
        value: "off-the-wall",
        children: [
          {
            title: "Security Rule",
            value: "Security Rule"
          },
          {
            title: "Traffic Rule"
          },
          {
            title: "Application Group"
          },
          {
            title: "URL Filter",
            value: "URL Filter"
          }
        ]
      }
    ],
    selectedValue: "URL Filter"
  };

  render() {
    const {
      data,
      selectedValue,
      hideTitleBar,
      headerIconPosition
    } = this.state;
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginBottom: "1rem" }}>
          <LabelField text="是否需要头部" />
          <Toggle
            toggled={hideTitleBar}
            onToggle={value => {
              this.setState({ hideTitleBar: !hideTitleBar });
            }}
          />
          {!hideTitleBar && (
            <span style={{ marginLeft: "1rem", display: "inline-flex" }}>
              <LabelField text="头部位置" />
              <Radio
                value="top"
                label="top"
                checked={headerIconPosition === "top"}
                onChange={value => this.setState({ headerIconPosition: value })}
                style={{ marginRight: "0.5rem" }}
              />
              <Radio
                value="left"
                label="left"
                checked={headerIconPosition === "left"}
                onChange={value => this.setState({ headerIconPosition: value })}
              />
            </span>
          )}
        </div>
        <div style={{ background: "#fcfcfc", width: "100%" }}>
          <Accordion
            data={data}
            selectedValue={selectedValue}
            headerText="Header"
            hideIcons={true}
            hideTitleBar={hideTitleBar}
            headerIconPosition={headerIconPosition}
            style={{ height: "540px" }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<AccordionDemo />, mountNode);
```

### 单个展开

设置```enableMultiOpen```为```false```，可设置菜单只展开单个

```jsx
import Accordion from 'eview-ui/Accordion';
import huawei from '@images/huawei';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class AccordionDemoNoMultiOpen extends React.Component {
  // static init state here
  state = {
    data: [
      {
        title: 'All',
        value: 'over_view',
      },
      {
        title: 'Star',
        value: 'hero-since-child',
      },
      {
        title: 'Off The Wall',
        children: [{
          title: "Don't Stop Till You Get Enough",
        },
        {
          title: 'Rock with You',
        },
        {
          title: 'Off The Wall',
          value: 'off-the-wall',
        }
        ],
      },
      {
        title: 'Thriller',
        description: '巅峰中的巅峰',
        value: 'thriller',
        children: [
          {
            title: 'Thriller',
            description: '唱片同名歌曲，创造了多个单曲格莱美大奖记录，一举奠定了流行音乐天王地位。',
          },
          {
            title: 'The Girl Is Mine',
            description: '热辣火热的舞蹈和动感心动的声响完美的结合',
          },
          {
            title: 'Beat It',
            description: '经典中的经典，几乎无人不知',
          },
          {
            title: 'Billie Jean',
            description: '传说来自天王的一个亲身经历',
          }
        ],
      }
    ],
    selectedValue: 'off-the-wall',
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider ConfigProvider version={version} theme={theme}>
        <div style={{ background: "#fcfcfc", width: '100%'}}>
          <Accordion
            data={this.state.data}
            selectedValue={this.state.selectedValue}
            headerIcon={huawei}
            enableMultiOpen={false} />
        </div>
      </ConfigProvider>

    );
  }
}


ReactDOM.render(<AccordionDemoNoMultiOpen />, mountNode);

```

### 允许拖动

可以通过设置`allowResize`属性开启拖动功能，`maxResizableWidth`可以设置拖动最大宽度，支持`px`和`rem`

```jsx
import Accordion from "eview-ui/Accordion";
import DivMessage from "eview-ui/DivMessage";
import { Row, Col } from "eview-ui/GridLayout";
import LabelField from "eview-ui/LabelField";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
export default class AccordionDemo extends React.Component {
  // static init state here
  state = {
    data: [
      {
        title: "Overview",
        value: "over_view",
      },
      {
        title: "Easy Configuration",
        value: "hero-since-child",
        children: [
          {
            title: "Thriller",
            description:
              "唱片同名歌曲，创造了多个单曲格莱美大奖记录，一举奠定了流行音乐天王地位。"
          },
          {
            title: "The Girl Is Mine",
            description: "热辣火热的舞蹈和动感心动的声响完美的结合"
          },
          {
            title: "Beat It",
            description: "经典中的经典，几乎无人不知",
            value: "beat-it"
          },
          {
            title: "Billie Jean",
            description: "传说来自天王的一个亲身经历"
          }
        ]
      },
      {
        title: "Advanced Configuration",
        value: "off-the-wall",
        children: [
          {
            title: "Security Rule",
            value: "Security Rule"
          },
          {
            title: "Traffic Rule"
          },
          {
            title: "Application Group"
          },
          {
            title: "URL Filter",
            value: "URL Filter"
          }
        ]
      }
    ],
    selectedValue: "URL Filter"
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ background: "#fcfcfc", width: "100%" }}>
          <Accordion
            allowResize
            maxResizableWidth="500px"
            data={this.state.data}
            selectedValue={this.state.selectedValue}
            style={{ height: "540px" }}
            enableMultiOpen
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<AccordionDemo />, mountNode);
```

