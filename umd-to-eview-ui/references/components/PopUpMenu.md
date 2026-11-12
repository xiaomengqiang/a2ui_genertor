# PopUpMenu 弹出菜单

> 分类：废弃

Pop Up Menu组件提供API功能,用户可以创建与子菜单上单击右键。

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  指定菜单元素的id | string |  |
| className |  类名称风格为菜单内容[Text] | string |  |
| style |  通过style设置组件样式 | object |  |
| options|  菜单数据, 参见Option接口 (注: 一般来说, 同一个菜单只使用同一份options, 如果要给同一菜单传入不同的options, 为避免bug应该给所有option设唯一id) | Option[] |  |
| isOpen |  指定菜单显示 i.e. 打开或关闭 | bool |  |
| offset |  指定菜单上方的X和Y的左边| object |  |
| X |  左菜单的X坐标 | number |  |
| Y |  Y坐标的左上角菜单 | number |  |
| parentId |  指定元素的菜单将被创建 | string |  |
| width |  设置菜单主要适用于宽度, 菜单 | string |  |
| onClick | 点击触发的回调 | (event: { text?: string; value?: any; clickItem?: Option; }) => void |  |
| onBlur |  失焦行为(如点击外部)触发的回调 | (value?: string | number, event?: React.SyntheticEvent | Event) => void |  |
| direction |  设置菜单的方向包括[up，down，auto]三种类型 | enum:<br>&nbsp;"up"<br>&nbsp;"down"<br>&nbsp;auto"<br> | "down"|
| zIndex |  优先级 | number | 1000 |
| space | 弹出后与依附元素的距离, 单位是px | number | 5 |

### Option
| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id | 选项id (如果设了值, 值必须唯一) | string |  |
| text | 选项文字或子元素 | React.ReactNode |  |
| serialno | 选项序列号 | string &#124; number |  |
| cls | 选项类名 | string |  |
| iconUrl | 图标url (注: 没有图标不要传入字符串) | string | undefined |
| keyCode | 快捷键码 (注: 不设快捷键不要传入数字) | number | undefined |
| disable | 是否禁用 | boolean |  |
| submenus | 子菜单 (注: 非子菜单不要传入数组类型) | Option[] | undefined |

## 接口定义

```typescript
interface Menu {
  id: string;
  className: string;
  options: any;
  parentId: string;
  width: number | string;
  style: object;
}

interface Content {
  id: string;

  className: string;

  content: object;

  width: number | string;
  style: object;

}

interface PopUpMenu {

  /**
   * Specifies the id of Menu element
   */
  id: string;

  /**
   * Specifies the className to set the style to Menu Content[Text]
   */
  className: string;

  style: object;

  options: any;

  /**
   * Specifies the menu display i.e. open or close
   */
  isOpen: boolean;

  /**
   * Specifies X and Y co-ordinates of top left of menu.   ==> Need to make this deprecated.
   */
  offset: object;

  /**
   * X co-ordinates of top left menu.
   */
  X: number;

  /**
   * Y co-ordinates of top left of menu.
   */
  Y: number;

  /**
   * Specifies the element for which Menu will be created
   */
  parentId: string;

  /**
   * Specifies the width of menu
   * Applicable to main menu, submenus
   */
  width: number | string;

  /**
   * Specifies the selected element of the Menu
   *  Syntax:
   * Function (value: any, event: object) => void
   * Value: the value of the currently selected data
   * Event: The focus event for native dom
   */
  onClick: (...args: any[]) => unknown;

  onBlur: (...args: any[]) => unknown;

  /**
   * Specifies popup or popdown
   * Default is "down"
   */
  direction: 'up' | 'down' | 'auto';

  zIndex: number;


}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Button from 'eview-ui/Button';
import PopUpMenu from 'eview-ui/PopUpMenu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PopUpMenuMenuDefaultExample extends React.Component {

    state = {
        isMenuOpen: false,
        isMenu2Open: false,
    };

    _handleShowBtn1 = () => {
        this.setState({ isMenuOpen: true });
    };

    _handleHideBtn1 = () => {
        this.setState({ isMenuOpen: false });
    };

    _handleShowBtn2 = () => {
        this.setState({ isMenu2Open: true });
    };

    _handleHideBtn2 = () => {
        this.setState({ isMenu2Open: false });
    };

    handleMenuClick = (evt) => {
        console.log(evt);
    }

    handleMenuClick2 = (evt) => {
        console.log(evt);
    }

    handleOnBlur = () => {
        console.log('blur CallBack');
    }

    render() {
      const [version, theme] = getDemoVersion();
        let btnDivStyle = { paddingBottom: 0 };
        let menuDivStyle = { paddingTop: 0, height: 0 };
        let options1 = [
            {
                text: "Item 1", serialno: 1, submenus: [
                    { text: "Item 1.1", serialno: 11 },
                    { text: "Item 1.2", serialno: 12 },
                    { text: "Item 1.3", serialno: 13 }]
            },
            {
                text: "Item 2", serialno: 2, submenus: [
                    { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem", serialno: 21 },
                    {
                        text: "ItemItemItemItemItemItemItemItemItemItemItemItem 2.2Item", serialno: 22, submenus: [
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.1", serialno: 221 },
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.2", serialno: 222 },
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.3", serialno: 223 },
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.4", serialno: 224 }]
                    },
                    { text: "Item 2.3", serialno: 23 }]
            },
            { isDivider: true, serialno: 3 },
            { text: "Item 4", serialno: 4, disable: true, submenus: [] },
            {
                text: "Item 5", serialno: 5, submenus: [
                    { text: "Item 5.1", serialno: 51 },
                    { text: "Item 5.2", serialno: 52 },
                    { text: "Item 5.3", serialno: 53 },
                    { text: "Item 5.4", serialno: 54 }]
            }
        ];
        let options2 = [
            {
                text: "Item 1", serialno: 1, submenus: [
                    { text: "Item 1.1", serialno: 11 },
                    { text: "Item 1.2", serialno: 12 },
                    { text: "Item 1.3", serialno: 13 },
                    { text: "Item 1.3", serialno: 13 }]
            },
            {
                text: "Item 2", serialno: 2, submenus: [
                    { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem", serialno: 21 },
                    {
                        text: "ItemItemItemItemItemItemItemItemItemItemItemItem 2.2Item", serialno: 22, submenus: [
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem", serialno: 221 },
                            { text: "Item 2.2.2", serialno: 223 },
                            { text: "Item 2.2.3", serialno: 224 },
                            { text: "Item 2.2.4", serialno: 225 }]
                    },
                    { text: "Item 2.3", serialno: 23 }]
            },
            { isDivider: true, serialno: 3 },
            { text: "Item 4", serialno: 4, disable: true, submenus: [] },
            {
                text: "Item 5", serialno: 5, submenus: [
                    { text: "Item 5.1", serialno: 51 },
                    { text: "Item 5.2", serialno: 52 },
                    { text: "Item 5.3", serialno: 53 },
                    { text: "Item 5.4", serialno: 54 }]
            }
        ];

      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div style={{display: "inline-block"}}>
            <div style={{display: "inline-block"}}>
              <p style={{fontSize: "13px", color: "lightslategray"}}>Popup menu 自动调整菜单的宽度</p>
              <div style={btnDivStyle}>
                <Button text='Show Menu' onClick={this._handleShowBtn1} style={{width: "182px"}}/>
                <Button text='Hide Menu' onClick={this._handleHideBtn1} style={{width: "182px"}}/>
              </div>
              <div>
                <div style={menuDivStyle} id="evu_PopUpMenu_example_default">
                  <PopUpMenu onBlur={this.handleOnBlur} parentId="evu_PopUpMenu_example_default" options={options1}
                             isOpen={this.state.isMenuOpen} onClick={this.handleMenuClick}
                             onBlur={this._handleHideBtn1}></PopUpMenu>
                </div>
              </div>
            </div>
            <div style={{display: "inline-block", marginLeft: "150px"}}>
              <p style={{fontSize: "13px", color: "lightslategray"}}>Popup menu 通过width设置菜单的宽度</p>
              <div style={btnDivStyle}>
                <Button text='Show Menu' onClick={this._handleShowBtn2} style={{width: "182px"}}/>
                <Button text='Hide Menu' onClick={this._handleHideBtn2} style={{width: "182px"}}/>
              </div>
              <div>
                <div style={menuDivStyle} id="evu_PopUpMenu_example_default2">
                  <PopUpMenu parentId="evu_PopUpMenu_example_default2" options={options2}
                             isOpen={this.state.isMenu2Open} width="200px" onClick={this.handleMenuClick2}
                             onBlur={this._handleHideBtn2}></PopUpMenu>
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
      )
    }
}

ReactDOM.render(<PopUpMenuMenuDefaultExample />, mountNode);

```

```jsx
import Button from 'eview-ui/Button';
import PopUpMenu from 'eview-ui/PopUpMenu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PopUpMenuMenuDefaultExample extends React.Component {

    state = {
        isMenuOpen: false,
        isMenu2Open: false,
    };

    _handleShowBtn1 = () => {
        this.setState({ isMenuOpen: true });
    };

    _handleHideBtn1 = () => {
        this.setState({ isMenuOpen: false });
    };

    _handleShowBtn2 = () => {
        this.setState({ isMenu2Open: true });
    };

    _handleHideBtn2 = () => {
        this.setState({ isMenu2Open: false });
    };

    handleMenuClick = (evt) => {
        console.log(evt);
    }

    handleMenuClick2 = (evt) => {
        console.log(evt);
    }

    handleOnBlur = () => {
        console.log('blur CallBack');
    }

    render() {
      const [version, theme] = getDemoVersion();
        let btnDivStyle = { paddingBottom: 0 };
        let menuDivStyle = { paddingTop: 0, height: 0 };
        let options1 = [
            {
                text: "Item 1", serialno: 1, submenus: [
                    { text: "Item 1.1", serialno: 11 },
                    { text: "Item 1.2", serialno: 12 },
                    { text: "Item 1.3", serialno: 13 }]
            },
            {
                text: "Item 2", serialno: 2, submenus: [
                    { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem", serialno: 21 },
                    {
                        text: "ItemItemItemItemItemItemItemItemItemItemItemItem 2.2Item", serialno: 22, submenus: [
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.1", serialno: 221 },
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.2", serialno: 222 },
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.3", serialno: 223 },
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem 2.2.4", serialno: 224 }]
                    },
                    { text: "Item 2.3", serialno: 23 }]
            },
            { isDivider: true, serialno: 3 },
            { text: "Item 4", serialno: 4, disable: true, submenus: [] },
            {
                text: "Item 5", serialno: 5, submenus: [
                    { text: "Item 5.1", serialno: 51 },
                    { text: "Item 5.2", serialno: 52 },
                    { text: "Item 5.3", serialno: 53 },
                    { text: "Item 5.4", serialno: 54 }]
            }
        ];
        let options2 = [
            {
                text: "Item 1", serialno: 1, submenus: [
                    { text: "Item 1.1", serialno: 11 },
                    { text: "Item 1.2", serialno: 12 },
                    { text: "Item 1.3", serialno: 13 },
                    { text: "Item 1.3", serialno: 13 }]
            },
            {
                text: "Item 2", serialno: 2, submenus: [
                    { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem", serialno: 21 },
                    {
                        text: "ItemItemItemItemItemItemItemItemItemItemItemItem 2.2Item", serialno: 22, submenus: [
                            { text: "ItemItemItemItemItemItemItemItemItemItemItem 1ItemItemItem", serialno: 221 },
                            { text: "Item 2.2.2", serialno: 223 },
                            { text: "Item 2.2.3", serialno: 224 },
                            { text: "Item 2.2.4", serialno: 225 }]
                    },
                    { text: "Item 2.3", serialno: 23 }]
            },
            { isDivider: true, serialno: 3 },
            { text: "Item 4", serialno: 4, disable: true, submenus: [] },
            {
                text: "Item 5", serialno: 5, submenus: [
                    { text: "Item 5.1", serialno: 51 },
                    { text: "Item 5.2", serialno: 52 },
                    { text: "Item 5.3", serialno: 53 },
                    { text: "Item 5.4", serialno: 54 }]
            }
        ];

      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div style={{display: "inline-block"}}>
            <div style={{display: "inline-block"}}>
              <p style={{fontSize: "13px", color: "lightslategray"}}>Popup menu 自动调整菜单的宽度</p>
              <div style={btnDivStyle}>
                <Button text='Show Menu' onClick={this._handleShowBtn1} style={{width: "182px"}}/>
                <Button text='Hide Menu' onClick={this._handleHideBtn1} style={{width: "182px"}}/>
              </div>
              <div>
                <div style={menuDivStyle} id="evu_PopUpMenu_example_default">
                  <PopUpMenu onBlur={this.handleOnBlur} parentId="evu_PopUpMenu_example_default" options={options1}
                             isOpen={this.state.isMenuOpen} onClick={this.handleMenuClick}
                             onBlur={this._handleHideBtn1}></PopUpMenu>
                </div>
              </div>
            </div>
            <div style={{display: "inline-block", marginLeft: "150px"}}>
              <p style={{fontSize: "13px", color: "lightslategray"}}>Popup menu 通过width设置菜单的宽度</p>
              <div style={btnDivStyle}>
                <Button text='Show Menu' onClick={this._handleShowBtn2} style={{width: "182px"}}/>
                <Button text='Hide Menu' onClick={this._handleHideBtn2} style={{width: "182px"}}/>
              </div>
              <div>
                <div style={menuDivStyle} id="evu_PopUpMenu_example_default2">
                  <PopUpMenu parentId="evu_PopUpMenu_example_default2" options={options2}
                             isOpen={this.state.isMenu2Open} width="200px" onClick={this.handleMenuClick2}
                             onBlur={this._handleHideBtn2}></PopUpMenu>
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
      )
    }
}

ReactDOM.render(<PopUpMenuMenuDefaultExample />, mountNode);

```

### 带有图标和事件示例的菜单

## en-US



```jsx
import PopUpMenu from 'eview-ui/PopUpMenu';
import createPicture from '@images/create_icon';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PopUpMenuIconExample extends React.Component {

    state = {
        isMenuOpen: false
    };

    handleShowBtn = () => {
        this.setState({ isMenuOpen: true });
    };

    handleHideBtn = () => {
        this.setState({ isMenuOpen: false });
    };

    handleMenuClick = (evt) => {
        console.log("handleMenuClick: ", evt);
        this.setState(() => ({ msg: "OnClick event callback: Selected menu option Text : " + evt.text + " and Value : " + evt.value, isMenuOpen: false }));
    }

    handleCustomItemClick = (evt) => {
        console.log("handleCustomItemClick: ", evt);
        this.setState(() => ({ msg: "OnClick event custom callback: Selected menu option Text : " + evt.text + " and Value : " + evt.value, isMenuOpen: false }));
    }

    render() {
      const [version, theme] = getDemoVersion();
        let btnDivStyle = { paddingBottom: 0 };
        let menuDivStyle = { paddingTop: 0, height: 0 };
        let options = [
            {
                text: "Item 1", serialno: 1, iconUrl: createPicture, submenus: [
                    { text: "Item 1.1", serialno: 11, iconUrl: createPicture, onClick: this.handleCustomItemClick },
                    { text: "Item 1.2", serialno: 12, iconUrl: createPicture },
                    { text: "Item 1.3", serialno: 13, iconUrl: createPicture },
                    { text: "Item 1.4", serialno: 14, iconUrl: createPicture }]
            },
            {
                text: "Item 2", serialno: 2, iconUrl: createPicture, submenus: [
                    { text: "Item 2.1", serialno: 21, iconUrl: createPicture },
                    {
                        text: "Item 2.2", serialno: 22, iconUrl: createPicture, submenus: [
                            { text: "Item 2.2.1", serialno: 221, iconUrl: createPicture, onClick: this.handleCustomItemClick },
                            { text: "Item 2.2.2", serialno: 222, iconUrl: createPicture },
                            { text: "Item 2.2.3", serialno: 223, iconUrl: createPicture },
                            { text: "Item 2.2.4", serialno: 224, iconUrl: createPicture }]
                    },
                    { text: "Item 2.3", serialno: 23, iconUrl: createPicture },
                    { text: "Item 2.4", serialno: 24, iconUrl: createPicture }]
            },
            { text: "Item 3", serialno: 3, iconUrl: createPicture, submenus: [] },
            {
                text: "Item 4", serialno: 4, iconUrl: createPicture, submenus: [
                    { text: "Item 4.1", serialno: 41, iconUrl: createPicture },
                    { text: "Item 4.2", serialno: 42, iconUrl: createPicture },
                    { text: "Item 4.3", serialno: 43, iconUrl: createPicture },
                    { text: "Item 4.4", serialno: 44, iconUrl: createPicture }]
            },
            { text: "Item 5", serialno: 5, iconUrl: createPicture, submenus: [] },
            { text: "Item 6", serialno: 6, iconUrl: createPicture, submenus: [] }
        ];
      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div>
            <p style={{fontSize: "13px", color: "lightslategray"}}>Popup menu 设置图标和事件</p>
            <div style={btnDivStyle}>
              <Button text='Show Menu' onClick={this.handleShowBtn} style={{width: "182px"}}/>
              <Button text='Hide Menu' onClick={this.handleHideBtn} style={{width: "182px"}}/>
            </div>
            <div style={menuDivStyle} id="evu_PopUpMenu_example_icon">
              <PopUpMenu parentId="evu_PopUpMenu_example_icon" options={options} isOpen={this.state.isMenuOpen}
                         width={'120'} onClick={this.handleMenuClick} onBlur={this.handleHideBtn}></PopUpMenu>
            </div>
            <div>
              {this.state.msg ? <DivMessage text={this.state.msg} type="success"
                                            style={{marginTop: "10px", width: "800px", marginLeft: "93px"}}/> : ''}
            </div>
          </div>
        </ConfigProvider>
      )
    }
}

ReactDOM.render(<PopUpMenuIconExample />, mountNode);

```

```jsx
import PopUpMenu from 'eview-ui/PopUpMenu';
import createPicture from '@images/create_icon';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PopUpMenuIconExample extends React.Component {

    state = {
        isMenuOpen: false
    };

    handleShowBtn = () => {
        this.setState({ isMenuOpen: true });
    };

    handleHideBtn = () => {
        this.setState({ isMenuOpen: false });
    };

    handleMenuClick = (evt) => {
        console.log("handleMenuClick: ", evt);
        this.setState(() => ({ msg: "OnClick event callback: Selected menu option Text : " + evt.text + " and Value : " + evt.value, isMenuOpen: false }));
    }

    handleCustomItemClick = (evt) => {
        console.log("handleCustomItemClick: ", evt);
        this.setState(() => ({ msg: "OnClick event custom callback: Selected menu option Text : " + evt.text + " and Value : " + evt.value, isMenuOpen: false }));
    }

    render() {
      const [version, theme] = getDemoVersion();
        let btnDivStyle = { paddingBottom: 0 };
        let menuDivStyle = { paddingTop: 0, height: 0 };
        let options = [
            {
                text: "Item 1", serialno: 1, iconUrl: createPicture, submenus: [
                    { text: "Item 1.1", serialno: 11, iconUrl: createPicture, onClick: this.handleCustomItemClick },
                    { text: "Item 1.2", serialno: 12, iconUrl: createPicture },
                    { text: "Item 1.3", serialno: 13, iconUrl: createPicture },
                    { text: "Item 1.4", serialno: 14, iconUrl: createPicture }]
            },
            {
                text: "Item 2", serialno: 2, iconUrl: createPicture, submenus: [
                    { text: "Item 2.1", serialno: 21, iconUrl: createPicture },
                    {
                        text: "Item 2.2", serialno: 22, iconUrl: createPicture, submenus: [
                            { text: "Item 2.2.1", serialno: 221, iconUrl: createPicture, onClick: this.handleCustomItemClick },
                            { text: "Item 2.2.2", serialno: 222, iconUrl: createPicture },
                            { text: "Item 2.2.3", serialno: 223, iconUrl: createPicture },
                            { text: "Item 2.2.4", serialno: 224, iconUrl: createPicture }]
                    },
                    { text: "Item 2.3", serialno: 23, iconUrl: createPicture },
                    { text: "Item 2.4", serialno: 24, iconUrl: createPicture }]
            },
            { text: "Item 3", serialno: 3, iconUrl: createPicture, submenus: [] },
            {
                text: "Item 4", serialno: 4, iconUrl: createPicture, submenus: [
                    { text: "Item 4.1", serialno: 41, iconUrl: createPicture },
                    { text: "Item 4.2", serialno: 42, iconUrl: createPicture },
                    { text: "Item 4.3", serialno: 43, iconUrl: createPicture },
                    { text: "Item 4.4", serialno: 44, iconUrl: createPicture }]
            },
            { text: "Item 5", serialno: 5, iconUrl: createPicture, submenus: [] },
            { text: "Item 6", serialno: 6, iconUrl: createPicture, submenus: [] }
        ];
      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div>
            <p style={{fontSize: "13px", color: "lightslategray"}}>Popup menu 设置图标和事件</p>
            <div style={btnDivStyle}>
              <Button text='Show Menu' onClick={this.handleShowBtn} style={{width: "182px"}}/>
              <Button text='Hide Menu' onClick={this.handleHideBtn} style={{width: "182px"}}/>
            </div>
            <div style={menuDivStyle} id="evu_PopUpMenu_example_icon">
              <PopUpMenu parentId="evu_PopUpMenu_example_icon" options={options} isOpen={this.state.isMenuOpen}
                         width={'120'} onClick={this.handleMenuClick} onBlur={this.handleHideBtn}></PopUpMenu>
            </div>
            <div>
              {this.state.msg ? <DivMessage text={this.state.msg} type="success"
                                            style={{marginTop: "10px", width: "800px", marginLeft: "93px"}}/> : ''}
            </div>
          </div>
        </ConfigProvider>
      )
    }
}

ReactDOM.render(<PopUpMenuIconExample />, mountNode);

```

