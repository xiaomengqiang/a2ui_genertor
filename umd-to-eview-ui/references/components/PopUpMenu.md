# PopUpMenu 弹出菜单

> 分类：废弃

> **废弃提示：** 请使用 Dropdown 和 Menu 组件替代，详情请见 Dropdown。

PopUpMenu组件提供弹出菜单功能，支持多级子菜单、图标、自定义样式和键盘导航。

## API


### 属性

| 属性名称 | 描述 | 类型 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  指定菜单元素的id | string |  |
| className |  菜单内容的类名 | string |  |
| style |  通过style设置组件样式 | React.CSSProperties |  |
| options|  菜单数据，参见Option接口定义（注：同一菜单只使用同一份options，如需给同一菜单传入不同options，应为所有option设唯一id） | Option[] | [] |
| isOpen |  指定菜单是否显示（打开或关闭） | bool | false |
| offset |  指定菜单上方的X和Y坐标（已废弃，建议使用X和Y分别指定） | object |  |
| X |  菜单的X坐标（与Y同时指定时，菜单将挂载在body下的绝对定位div上并依附） | number |  |
| Y |  菜单的Y坐标（与X同时指定时，菜单将挂载在body下的绝对定位div上并依附） | number |  |
| parentId |  指定菜单将依附的父元素id | string |  |
| parentRef |  指定菜单将依附的父元素ref（与parentId二选一） | React.Ref |  |
| width |  设置菜单宽度，适用于主菜单和子菜单 | number \| string |  |
| onClick | 点击菜单项触发的回调<br><br>**签名:**<br>`(event: { event?: React.MouseEvent; text?: React.ReactNode; value?: any; clickItem?: Option; }) => void` | function |  |
| onBlur | 失焦行为（如点击外部）触发的回调<br><br>**签名:**<br>`(value?: string \| number, event?: React.SyntheticEvent \| Event) => void` | function |  |
| direction |  设置菜单的弹出方向 | enum:<br>&nbsp;'up'<br>&nbsp;'down'<br>&nbsp;'auto' | 'down' |
| zIndex |  菜单的z-index层级 | number |  |
| space | 弹出后与依附元素的距离，单位px | number | 5 |
| hasScroll | 是否启用滚动条 | bool | false |
| size | 菜单尺寸 | enum:<br>&nbsp;'normal'<br>&nbsp;'small' | 'normal' |
| container | 设置弹窗的容器元素获取函数 | `() => HTMLElement` |  |

### Option

| 属性名称 | 描述 | 类型 | 默认 |
|:-----|:-----|:-----|:-----|
| id | 选项id（如果设了值，值必须唯一） | string |  |
| text | 选项文字或子元素 | React.ReactNode |  |
| serialno | 选项序列号（必填且唯一） | string \| number |  |
| value | 选项值（未设置时使用serialno） | any |  |
| cls | 选项类名 | string |  |
| iconUrl | 图标URL（注：没有图标不要传入字符串；建议使用icon替代） | string | undefined |
| icon | 图标节点（推荐使用，替代iconUrl） | React.ReactNode |  |
| keyCode | 快捷键码（注：不设快捷键不要传入数字） | number | undefined |
| disable | 是否禁用 | boolean | false |
| submenus | 子菜单（注：非子菜单不要传入数组类型） | Option[] | undefined |
| isDivider | 是否为分割线（为true时只显示分割线，其他属性忽略） | boolean | undefined |
| onClick | 单个选项的自定义点击回调（设置后不再触发全局onClick） | function |  |

## 接口定义

```typescript
import type { MouseEvent, ReactNode, Ref, CSSProperties } from 'react';

interface DividerOption {
  serialno: string | number;
  isDivider?: boolean;
}

interface CommonOption {
  id?: string;
  text?: ReactNode;
  serialno: string | number;
  value?: any;
  cls?: string;
  iconUrl?: string;
  icon?: ReactNode;
  keyCode?: number;
  disable?: boolean;
  onClick?: (evt: { text?: ReactNode; value?: any; clickItem?: Option }) => void;
}

interface ItemOption extends CommonOption {
  submenus?: undefined;
}

interface SubMenuOption extends CommonOption {
  submenus: Option[];
}

type Option = ItemOption | SubMenuOption | DividerOption;

interface Menu {
  id: string;
  className: string;
  options: Option[];
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

  id?: string;

  className?: string;

  style?: CSSProperties;

  options?: Option[];

  isOpen?: boolean;

  offset?: object;

  X?: number;

  Y?: number;

  parentId?: string;

  parentRef?: Ref<object>;

  width?: CSSProperties['width'];

  onClick?: (event: {
    event?: MouseEvent<HTMLLIElement>;
    text?: ReactNode;
    value?: any;
    clickItem?: Option;
  }) => void;

  onBlur?: (value?: string | number, event?: React.SyntheticEvent | Event) => void;

  direction?: 'up' | 'down' | 'auto';

  zIndex?: number;

  hasScroll?: boolean;

  size?: 'normal' | 'small';

  space?: number;

  container?: () => HTMLElement;

}
```

## 使用示例

### 基本属性设置

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
                  <PopUpMenu onBlur={this._handleHideBtn1} parentId="evu_PopUpMenu_example_default" options={options1}
                             isOpen={this.state.isMenuOpen} onClick={this.handleMenuClick}></PopUpMenu>
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

