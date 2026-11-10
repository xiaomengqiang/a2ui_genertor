# Loader 加载

> 分类：数据展示

Loader时指示灯显示项或状态为in progress。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Spin` | `Loader` | `spinning`→**`isOpen`**；`tip`→**`desc`**；`type="global"/"local"/"micro"`（全屏遮罩/容器内/行内——antd 无此分层：全屏用 global，包内容器用 local **需父容器 position:relative**，小 spinner 用 micro）；`fullscreen`→type="global" |

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  设置元素的id | string |  |
| isOpen |  定制弹出框中是否显示, 默认值为 false (off) E.g: IsOpen = {true} | bool |  |
| type |  元素的类型 | enum:<br>&nbsp;"global"<br>&nbsp;"local"<br>&nbsp;"micro"<br> |  |
| iconUrl |  图标路径指定, 将如加载/刷新图标必填字段 | string |  |
| desc |  设置图标/流程说明 | string |  |
| textClassName |  设置样式为标签 | string |  |

## 接口定义

```typescript
interface Loader {


  /**
   * Set the id of the element
   */
  id: string;

  /**
   * Customize the pop-up box whether is displayed; the default value is false (off)
   * E.g:
   * IsOpen = {true}
   */
  isOpen: boolean;

  /**
   * Specifiesthe type of element
   */
  type: 'global' | 'local' | 'micro';

  /**
   * Specifies the icon path; which will be shown as loading/refresh icon
   * This is a mandatory field
   */
  iconUrl: string;

  /**
   * Specifies the icon/process description
   */
  desc: string;

  /**
   * Set the style to label
   */
  textClassName: string;

  /**
   * Set the style of the element
   */
  style: object;

  /**
   * add version setting
   */
  version: string;

  /**
   * add theme setting
   */
  theme: string;

}

interface LoadingWindow {

  /**
   * "To set the content to the window.
   */
  content: object;

  /**
   * width of the window.
   */
  width: string;

  /**
   * Height of the window.
   */
  height: string;

  /**
   * User can set the window as modal or non modal. Default is modal. If user wants WIndow to set as non
   * modal then modal option has to set as false.
   */
  modal: boolean;

  /**
   * add version setting
   */
  version: string;

  /**
   * add theme setting
   */
  theme: string;

}

interface LoadingBody {

  /**
   * Specifies the icon path, which will be shown as loading/refresh icon
   * This is a mandatory field
   */
  iconUrl: string;

  /**
   * Specifies the icon/process description
   */
  text: string;

  /**
   * Set the style to label
   */
  className: string;

  /**
   * Specifies the position of the element
   */
  elementClassName: string;

  /**
   * Add version setting
   */
  version: string;

  /**
   * Add theme setting
   */
  theme: string;

}
```

## 使用示例

### 全局加载示例

## en-US



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

                        <Loader type="global" isOpen={this.state.isLoadingShow} desc="Please wait..." maskElementId="evu_selector_example" />
                        <Loader type="global" isOpen={this.state.isLoadingShow1} desc="Loading..." textClassName="loading_text_custom_cls" maskElementId="evu_selector_example" />
                    </div>

                </div>
            </div>
          </ConfigProvider>
        );
    }
}

ReactDOM.render(<GlobalLoadingExample />, mountNode);

```

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

                        <Loader type="global" isOpen={this.state.isLoadingShow} desc="Please wait..." maskElementId="evu_selector_example" />
                        <Loader type="global" isOpen={this.state.isLoadingShow1} desc="Loading..." textClassName="loading_text_custom_cls" maskElementId="evu_selector_example" />
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

## en-US



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
    rows.push(['R&D VPN2 ', '3', 'ICMP Echo',]);
    rows.push(['Shop Storage', '3', 'ICMP Echo ',]);
    rows.push(['IT Link', '7', 'ICMP Echo',]);
    rows.push(['R&D VPN1', '3', 'ICMP Echo',]);
    rows.push(['R&D VPN6', '5', 'ICMP Echo',]);
    rows.push(['R&D VPN2', '7', 'ICMP Echo',]);


    let PopUpMenuOptions = [
      {
        text: "Item1", serialno: 1, submenus: [
          {
            text: "Item11Item11Item11Item11Item11Item11", serialno: 11, submenus: [
              {
                text: "Item111Item111", serialno: 111, disable: true, submenus: [
                  { text: "Item1111Item111", serialno: 1111, submenus: [] }
                ]
              },
              { text: "Item111112121Item111112121Item111112121", serialno: 12111, submenus: [] },
              { text: "Item121", serialno: 121, submenus: [] }
            ]
          }
        ]
      },
      { text: "Item2", serialno: 2, submenus: [] },
      {
        text: "Item 3", serialno: 3, submenus: [
          { text: "Item1111121", serialno: 1211, submenus: [] },
          { text: "Item121", serialno: 1221, submenus: [] }
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
    rows.push(['R&D VPN2 ', '3', 'ICMP Echo',]);
    rows.push(['Shop Storage', '3', 'ICMP Echo ',]);
    rows.push(['IT Link', '7', 'ICMP Echo',]);
    rows.push(['R&D VPN1', '3', 'ICMP Echo',]);
    rows.push(['R&D VPN6', '5', 'ICMP Echo',]);
    rows.push(['R&D VPN2', '7', 'ICMP Echo',]);


    let PopUpMenuOptions = [
      {
        text: "Item1", serialno: 1, submenus: [
          {
            text: "Item11Item11Item11Item11Item11Item11", serialno: 11, submenus: [
              {
                text: "Item111Item111", serialno: 111, disable: true, submenus: [
                  { text: "Item1111Item111", serialno: 1111, submenus: [] }
                ]
              },
              { text: "Item111112121Item111112121Item111112121", serialno: 12111, submenus: [] },
              { text: "Item121", serialno: 121, submenus: [] }
            ]
          }
        ]
      },
      { text: "Item2", serialno: 2, submenus: [] },
      {
        text: "Item 3", serialno: 3, submenus: [
          { text: "Item1111121", serialno: 1211, submenus: [] },
          { text: "Item121", serialno: 1221, submenus: [] }
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

## en-US



```jsx
import Loader from 'eview-ui/Loader';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import imgPicture from '@images/customLoading';
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
        let buttonDescription = { display: "block", fontSize: "12px", marginTop: "10px" };

      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div id="evu_selector_example">
            <div style={divStyle}>

              <div><LabelField style={labelStyle}>* Micro Loading Control</LabelField></div>

              <Button text='Show Micro' style={{width: "150px"}} onClick={this.handleShowMicroClick}/>
              <Button text='Hide Micro' style={{width: "150px"}} onClick={this.handleHideMicroClick}/>

              <div style={{marginBottom: "5px"}}>
                <Loader type="micro" desc="Micro Progress description.." isOpen={this.state.isMicroLoadingShow}/>
              </div>

              <div><LabelField style={labelStyle}>* Micro Loading Control [Custom Icon/Text]</LabelField></div>

              <div style={{marginBottom: "5px", paddingTop: "20px"}}>
                <Loader style={{'fontStyle': 'italic', color: 'blue'}} type="micro" desc="Micro Progress description.."
                        isOpen={this.state.isMicroCustomIconLoadingShow} iconUrl={imgPicture}
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

```jsx
import Loader from 'eview-ui/Loader';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import imgPicture from '@images/customLoading';
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
        let buttonDescription = { display: "block", fontSize: "12px", marginTop: "10px" };

      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div id="evu_selector_example">
            <div style={divStyle}>

              <div><LabelField style={labelStyle}>* Micro Loading Control</LabelField></div>

              <Button text='Show Micro' style={{width: "150px"}} onClick={this.handleShowMicroClick}/>
              <Button text='Hide Micro' style={{width: "150px"}} onClick={this.handleHideMicroClick}/>

              <div style={{marginBottom: "5px"}}>
                <Loader type="micro" desc="Micro Progress description.." isOpen={this.state.isMicroLoadingShow}/>
              </div>

              <div><LabelField style={labelStyle}>* Micro Loading Control [Custom Icon/Text]</LabelField></div>

              <div style={{marginBottom: "5px", paddingTop: "20px"}}>
                <Loader style={{'fontStyle': 'italic', color: 'blue'}} type="micro" desc="Micro Progress description.."
                        isOpen={this.state.isMicroCustomIconLoadingShow} iconUrl={imgPicture}
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

