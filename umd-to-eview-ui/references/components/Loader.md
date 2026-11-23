# Loader 加载

> 分类：数据展示

Loader 是指示灯，显示项或状态为 in progress。

**重要行为说明：**
- `type="global"`：全屏遮罩加载，父容器需有明确 id 用于遮罩定位
- `type="local"`：容器内加载，**父容器必须设置 `position: "relative"`**，`style` 属性仅在此模式下生效
- `type="micro"`：行内小 spinner 加载，`style` 属性不生效
- `iconUrl` 为非必填属性；不传时使用默认旋转图标（aui3-1 场景使用 IconSvg loading 图标，其他场景使用 CSS 动画）

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Spin` | `Loader` | `spinning`→**`isOpen`**；`tip`→**`desc`**；`type="global"/"local"/"micro"`（全屏遮罩/容器内/行内——antd 无此分层：全屏用 global，包内容器用 local **需父容器 position:relative**，小 spinner 用 micro）；`fullscreen`→type="global" |

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id | 设置元素的id，不传则自动生成 (evu_Loader_N) | string | 自动生成 |
| isOpen | 定制加载是否显示。E.g: `isOpen={true}` | bool | false |
| type | 元素的类型：<br>&nbsp;"global" - 全屏遮罩加载<br>&nbsp;"local" - 容器内加载（需父容器 position:relative）<br>&nbsp;"micro" - 行内小 spinner | enum:<br>&nbsp;"global"<br>&nbsp;"local"<br>&nbsp;"micro"<br> | "global" |
| iconUrl | 自定义图标路径，将作为加载/刷新图标显示。不传则使用默认旋转图标 | string | |
| desc | 设置加载过程说明文字 | string | |
| textClassName | 设置描述文字的 CSS class，用于自定义描述文字样式 | string | |
| style | 设置组件的样式。**注意：此属性仅在 `type="local"` 时生效，global 和 micro 模式下不应用此属性** | object | |
| version | 传入该值可定制当前组件匹配的ucd规范，例如 `version='aui3'` | string | |
| theme | 传入该值可定制当前组件匹配的主题模式样式，例如 `theme='evening'` | string | |

## 接口定义

```typescript
interface Loader {

  /**
   * 设置元素的id
   */
  id: string;

  /**
   * 定制加载是否显示，默认 false
   * E.g: isOpen={true}
   */
  isOpen: boolean;

  /**
   * 元素的类型：
   * - 'global': 全屏遮罩加载
   * - 'local': 容器内加载（需父容器 position:relative）
   * - 'micro': 行内小 spinner
   */
  type: 'global' | 'local' | 'micro';

  /**
   * 自定义图标路径，将作为加载/刷新图标显示。
   * 不传则使用默认旋转图标。
   * 注意：此属性为非必填项。
   */
  iconUrl: string;

  /**
   * 设置加载过程说明文字
   */
  desc: string;

  /**
   * 设置描述文字的 CSS class
   */
  textClassName: string;

  /**
   * 设置组件的样式。
   * 注意：此属性仅在 type="local" 时生效，
   * global 和 micro 模式下不应用此属性。
   */
  style: object;

  /**
   * 传入该值可定制当前组件匹配的ucd规范
   */
  version: string;

  /**
   * 传入该值可定制当前组件匹配的主题模式样式
   */
  theme: string;

}

/* 以下为内部子组件接口，仅供组件内部使用，不对外暴露 */

interface LoadingWindow {

  /**
   * 设置窗口内容（内部使用，由 Loader 自动传入 LoadingBody）
   */
  content: object;

  /**
   * 窗口宽度
   */
  width: string;

  /**
   * 窗口高度
   */
  height: string;

  /**
   * 是否模态窗口，默认 true
   */
  modal: boolean;

  /**
   * version setting
   */
  version: string;

  /**
   * theme setting
   */
  theme: string;

}

interface LoadingBody {

  /**
   * 自定义图标路径（非必填，不传使用默认图标）
   */
  iconUrl: string;

  /**
   * 描述文字
   */
  text: string;

  /**
   * 描述文字的 CSS class
   */
  className: string;

  /**
   * 元素位置的 className（仅 local 类型使用）
   */
  elementClassName: string;

  /**
   * version setting
   */
  version: string;

  /**
   * theme setting
   */
  theme: string;

}
```

## 使用示例

### 全局加载示例











```jsx
import Loader from 'eview-ui/Loader';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class GlobalLoadingExample extends React.Component {

    state = {
        isLoadingShow: false,
        isLoadingShow1:false,
    };

    handleClick = () => {
        this.setState({ isLoadingShow: true });
        setTimeout(function () {
            this.setState({ isLoadingShow: false });
        }.bind(this), 5000);
    };

    handleClick1 = () => {
        this.setState({ isLoadingShow1: true });
        setTimeout(function () {
            this.setState({ isLoadingShow1: false });
        }.bind(this), 5000);
    };

    render() {
      const [version, theme] = getDemoVersion();
        let divStyle = { margin: "20px 0px 50px 20px" };
        let labelStyle = { display: "block", fontSize: "14px", marginTop: "10px" };
        let buttonDescription = { display: "block", fontSize: "12px", marginTop: "10px" };

        return (
          // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
          <ConfigProvider version={version} theme={theme}>
            <div id="evu_selector_example">
                <div style={divStyle}>

                    <div><LabelField style={labelStyle}>Global Loading Control</LabelField></div>
                    <div style={{ marginBottom: "5px", paddingTop: "20px" }}>
                        <LabelField style={buttonDescription}>*On clicking Show Progress, Loading Component (Global type) will display for 5 seconds.</LabelField>
                        <br/>
                        <Button text='Show Progress' onClick={this.handleClick} />
                        <Button text='Custom Text Style' style={{ marginLeft: "50px" }} onClick={this.handleClick1} />

                        <Loader type="global" isOpen={this.state.isLoadingShow} desc="Please wait..." />
                        <Loader type="global" isOpen={this.state.isLoadingShow1} desc="Loading..." textClassName="loading_text_custom_cls" />
                    </div>

                </div>
            </div>
          </ConfigProvider>
        );
    }
}

ReactDOM.render(<GlobalLoadingExample />, mountNode);

```

### 本地加载示例











```jsx
import Button from 'eview-ui/Button';
import Loader from 'eview-ui/Loader';
import LabelField from 'eview-ui/LabelField';
import Table from 'eview-ui/Table';
import PopUpMenu from 'eview-ui/PopUpMenu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TablePopUpMenu extends React.Component {

  state = {
    isMenuOpen: false,
    X: 100,
    Y: 100,
    offset: {
      X: 100,
      Y: 100
    },
    parentId: "",

  }
  onRowRightClick = (e, cbData) => {
    console.log("Table onRowRightClick cbData : ", cbData, e);

    this.setState({
      isMenuOpen: true,
      X: e.pageX,
      Y: e.pageY,
      offset: {
        X: e.offsetX, Y: e.offsetY
      },
      parentId: cbData.id,
    })
  }

  handleMenuClick = (evt) => {
    console.log("Popup menu onClick : ", evt);
  }

  render() {
    const [version, theme] = getDemoVersion();

    const columns = [
      {
        title: 'VPN Name',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'VPN_ID',
      },
      {
        title: 'Site',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Site_ID',
      },
      {
        title: 'Alarm',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Alarm_ID',
      },
    ];

    const rows = [];
    rows.push(['R&D VPN2', '3', 'ICMP Echo']);
    rows.push(['Shop Storage', '3', 'ICMP Echo']);
    rows.push(['IT Link', '7', 'ICMP Echo']);
    rows.push(['R&D VPN1', '3', 'ICMP Echo']);
    rows.push(['R&D VPN6', '5', 'ICMP Echo']);
    rows.push(['R&D VPN2', '7', 'ICMP Echo']);


    let PopUpMenuOptions = [
      {
        text: "Item1", serialno: 1, submenus: [
          {
            text: "Item11", serialno: 11, submenus: [
              {
                text: "Item111", serialno: 111, disable: true, submenus: [
                  { text: "Item1111", serialno: 1111, submenus: [] }
                ]
              },
              { text: "Item112", serialno: 12111, submenus: [] },
              { text: "Item121", serialno: 121, submenus: [] }
            ]
          }
        ]
      },
      { text: "Item2", serialno: 2, submenus: [] },
      {
        text: "Item 3", serialno: 3, submenus: [
          { text: "Item31", serialno: 1211, submenus: [] },
          { text: "Item32", serialno: 1221, submenus: [] }
        ]
      },
      { text: "Item 4", serialno: 4, submenus: [] }
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Table onRowRightClick={this.onRowRightClick}
                 columns={columns}
                 dataset={rows}
                 ref={table => {
                   this.table = table;
                 }}
          />
          <PopUpMenu options={PopUpMenuOptions} parentId={this.state.parentId} isOpen={this.state.isMenuOpen}
                     X={this.state.X} Y={this.state.Y} offset={this.state.offset}
                     onClick={this.handleMenuClick}></PopUpMenu>
        </div>
      </ConfigProvider>
    );
  }
}


export default class LocalLoadingExample extends React.Component {

    handleShowClick = () => {
        this.setState({ isLoadingShow: true });
    };

    handleHideClick = () => {
        this.setState({ isLoadingShow: false });
    };

    state = {
        isLoadingShow: false
    };
    render() {
      const [version, theme] = getDemoVersion();
        let style = { zIndex: 9998 }
      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div>
            <div>
              <Button text='Show Local Loader' style={{width: "250px", marginRight: "10px"}}
                      onClick={this.handleShowClick}/>
              <Button text='Hide Local Loader' style={{width: "250px", marginRight: "10px"}}
                      onClick={this.handleHideClick}/>
              <br/>
            </div>
            {/* 注意：type="local" 时，父容器必须设置 position: "relative" */}
            <div style={{position: "relative", paddingTop: "5px"}}>
              <TablePopUpMenu></TablePopUpMenu>
              <Loader type='local' desc="Loading..." isOpen={this.state.isLoadingShow} style={style}></Loader>
            </div>
          </div>
        </ConfigProvider>
      )
    }
}

ReactDOM.render(<LocalLoadingExample />, mountNode);

```

### 微加载示例











```jsx
import Loader from 'eview-ui/Loader';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class MicroLoadingExample extends React.Component {

    handleShowMicroClick = () => {
        this.setState({ isMicroLoadingShow: true });
    };
    handleHideMicroClick = () => {
        this.setState({ isMicroLoadingShow: false });
    };

    state = {
        isMicroLoadingShow: false,
        isMicroCustomIconLoadingShow: true,
        iconUrl: ""
    };

    render() {
      const [version, theme] = getDemoVersion();
        let divStyle = { margin: "20px 0px 50px 20px" };
        let labelStyle = { display: "block", fontSize: "14px", marginTop: "10px", paddingLeft: "0px" };

      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div id="evu_selector_example">
            <div style={divStyle}>

              <div><LabelField style={labelStyle}>Micro Loading Control</LabelField></div>

              <Button text='Show Micro' style={{width: "150px"}} onClick={this.handleShowMicroClick}/>
              <Button text='Hide Micro' style={{width: "150px"}} onClick={this.handleHideMicroClick}/>

              <div style={{marginBottom: "5px"}}>
                <Loader type="micro" desc="Micro Progress description.." isOpen={this.state.isMicroLoadingShow}/>
              </div>

              <div><LabelField style={labelStyle}>Micro Loading Control [Custom Icon/Text]</LabelField></div>

              <div style={{marginBottom: "5px", paddingTop: "20px"}}>
                <Loader style={{'fontStyle': 'italic', color: 'blue'}} type="micro" desc="Micro Progress description.."
                        isOpen={this.state.isMicroCustomIconLoadingShow} iconUrl={this.state.iconUrl}
                        textClassName="loading_text_custom_cls"/>
              </div>

            </div>
          </div>
        </ConfigProvider>
      );
    }
}

ReactDOM.render(<MicroLoadingExample />, mountNode);

```

