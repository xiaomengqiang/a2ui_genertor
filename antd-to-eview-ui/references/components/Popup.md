# Popup 弹出列表

> 分类：其他

该组件用于设置下拉菜单，支持图标和自定义样式。

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  设置组件id | string |  |
| className |  通过添加class的方式自定义组件样式，作用于组件最外层div | string |  |
| style |  通过添加style的方式自定义组件样式，作用于组件最外层div | object |  |
| itemStyle |  通过添加style的方式自定义组件下拉项样式 | object |  |
| itemClassName |  通过添加class的方式自定义组件下拉项样式 | string |  |
| iconClassName |  通过添加class的方式自定义组件下拉项中图标样式 | string |  |
| iconStyle |  通过添加style的方式自定义组件下拉项中图标样式 | object |  |
| display |  设置组件是否显示 | bool | false |
| enablHorzScroll |  设置弹出窗口的横向滚动条 | bool | false |
| data | 设置传入数据 <br>[{ <br>text: "Create",  //页面展示值 <br>tipData: "tipData", //tip 页面展示值 <br>value: 1, //数据库存取值 <br>icon:"image/create-default.png",//下拉项中的图标（可不定义） <br>iconActive:"image/create-selected.png",//下拉项被选中时的图标（可不定义） <br>disabled:true //用来定义下拉列表项的灰化状态 <br>},<br>customClassName:"custom" //用来定义下拉列表项的样式 <br>}, ...] | array | [] |
| value |  通过value设置组件的选中项 | any |  |
| onItemClick |  设置组件的onClick事件 | function |  |
| popupDirection |  定义弹出方向. 属性值auto表示弹出方向将根据屏幕可视区域是否有足够空间显示完整下拉菜单自动选择 | enum:<br>&nbsp;'top'<br>&nbsp;'bottom'<br>&nbsp;'auto' | 'bottom' |

## 接口定义

```typescript
import type { MouseEvent } from 'react';

interface PopUp {


  /**
   * 设置组件id
   */
  id: string;

  /**
   * 通过添加class的方式自定义组件样式，作用于组件最外层div
   */
  className: string;

  /**
   * 通过添加style的方式自定义组件样式，作用于组件最外层div
   */
  style: object;

  /**
   * 通过添加style的方式自定义组件下拉项样式
   */
  itemStyle: object;

  /**
   * 通过添加class的方式自定义组件下拉项样式
   */
  itemClassName: string;

  /**
   * 通过添加class的方式自定义组件下拉项中图标样式
   */
  iconClassName: string;

  /**
   * 通过添加style的方式自定义组件下拉项中图标样式
   */
  iconStyle: object;

  /**
   * 设置组件是否显示
   */
  display: boolean;

  /**
   * 设置传入数据
   * <br>[{
   * <br>text: "Create";  //页面展示值
   * <br>value: 1; //数据库存取值
   * <br>icon:"image/create-default.png";//下拉项中的图标（可不定义）
   * <br>iconActive:"image/create-selected.png";//下拉项被选中时的图标（可不定义）
   * <br>disabled:true //用来定义下拉列表项的灰化状态
   * <br>}; ...]
   */
  data: any;

  /**
   * 通过value设置组件的选中项
   */
  value: any;

  /**
   * 设置组件的onClick事件
   *
   * @param (object) data 被点击下拉项对应用户传入数据
   */
  onItemClick: (item: string, e: MouseEvent<HTMLSpanElement>) => unknown;

  /**
   * Triggers an event when mousedown  occurs on component
   *
   * @param {Object} event Object:{event; index}
   */
  onMouseDown: (e: MouseEvent<HTMLSpanElement>, index: number) => unknown;

  /**
   * Pass the options to the menu if the content is to be loaded dynamically on scroll instead of preloading all the
   * items in one shot.
   * This will make sure the popup is faster; even with a lot of items to be displayed; like in search component
   * with the search result being 1000s of items
   * ` totalRecords:1000;
   *   onLoadRecords(startIndex);
   *   `
   */
  lazyLoadOptions: object;

  /**
   * Defines the direction of the popup. This will cause the popup to be positioned as much as its height to the top
   * of the default expeacted position.
   * This will have meaning only in case of select component popup ideally.
   */
  popupDirection: 'top' | 'bottom' | 'auto';

  /**
   * Set the maximum items to be display in the popup default eight
   */
  displayItems: number;
  onClosePopup: () => unknown;

  /**
   * Value true the scoll bar is always displayed .
   */
  isScrollAlwaysDisplay: boolean;

  /** 鼠标在item中的移动事件 */
  onItemHover: (item: string, e: MouseEvent<HTMLSpanElement>) => unknown;

  /** 鼠标在item中的移入事件 */
  onItemEnter: (item: string, e: MouseEvent<HTMLSpanElement>) => unknown;

  /** 鼠标在item中的移出事件*/
  onItemOut: (item: string, e: MouseEvent<HTMLSpanElement>) => unknown;

  /** 是否隐藏title */
  hideTitle: boolean;

  /** 是否覆盖item的class; 默认是追加 */
  coverItemCls: boolean;

  /** 内部屬性 */
  fromSelect: boolean;

  enablHorzScroll: boolean;

  /** 增加版本设置 */
  version: string;

  /** 增加主题设置 */
  theme: string;

}

export type PopUpProps = Partial<PopUp>;
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Popup from 'eview-ui/Popup';
import Button from 'eview-ui/Button';
import Icon from 'eview-ui/Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DropDownExample extends React.Component {

  state = {
    isShow1: false,
    isShow2: false,
    value: null,
    iconsSvg: {},
  };

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
    const iconNames = [
      { key: 'plus' },
      { key: 'plus', iconName: 'plusActive', color: '#2E86DE' },
      { key: 'del' },
      { key: 'del', iconName: 'delActive', color: '#2E86DE' },
      { key: 'back', iconName: 'exportImg' },
      { key: 'back', iconName: 'exportImgActive', color: '#2E86DE' },
    ];

    Promise.allSettled(iconNames.map((icon) => this.getIconToBase64Svg(icon)))
      .then((results) => {
        const iconsSvg = results
          .filter((result) => result.status === 'fulfilled') // 过滤出成功的 Promise
          .map((result) => result.value)
          .reduce((acc, curr) => ({ ...acc, ...curr }), {});
        this.setState({ iconsSvg });
      });
  }

  handleClick1 = () => {
    if (this.state.isShow1) {
      this.setState({ isShow1: false })
    } else {
      this.setState({ isShow1: true })
    }
  };
  handleItemClick1 = (item) => {
    this.setState({ isShow1: false, value: item.value })
  };
  handleClick2 = () => {
    if (this.state.isShow2) {
      this.setState({ isShow2: false })
    } else {
      this.setState({ isShow2: true })
    }
  };
  handleItemClick2 = (item) => {
    this.setState({ isShow2: false, value: item.value })
  };

  render() {
    const { iconsSvg } = this.state;
    const [version, theme] = getDemoVersion();
    let options1 = [
      {
        text: "Create", tipData: "defineCreate", value: 1, icon: iconsSvg.plus, iconActive: iconsSvg.plusActive
      },
      {
        text: "Export", value: 2, icon: iconsSvg.exportImg, iconActive: iconsSvg.exportImgActive
      },
      {
        text: "Delete", value: 3, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "push", value: 4, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "pop", value: 5, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "remove", value: 6, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "add", value: 7, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "multi", value: 8, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      },
      {
        text: "common", value: 9, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
    ];
    let options2 = [
      {
        text: "CreateenablHorzScrollenablHorzScroll", value: 11, icon: iconsSvg.plus, iconActive: iconsSvg.plusActive
      },
      {
        text: "Export", value: 12, icon: iconsSvg.exportImg, iconActive: iconsSvg.exportImgActive
      },
      {
        text: "Delete", value: 13, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_Select_example" style={{width: "480px", height: "200px"}}>
          <Button text="Show/Hide Popup" style={{marginBottom: "5px"}} onClick={this.handleClick1}/>
          <Button text="Show/Hide Popup with Scroll" style={{marginBottom: "5px", float: "right"}}
                  onClick={this.handleClick2}/>

          <div id="eui_Select_example1" style={{position: "relative", width: "200px"}}>
            <Popup data={options1} value={this.state.value} display={this.state.isShow1}
                   onItemClick={this.handleItemClick1}/>
          </div>

          <div id="eui_Select_example2" style={{position: "relative", width: "220px", height: "1px", float: "right"}}>
            <Popup data={options2} value={this.state.value} display={this.state.isShow2}
                   onItemClick={this.handleItemClick2} enablHorzScroll={true}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<DropDownExample />, mountNode);

```

```jsx
import Popup from 'eview-ui/Popup';
import Button from 'eview-ui/Button';
import Icon from 'eview-ui/Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DropDownExample extends React.Component {

  state = {
    isShow1: false,
    isShow2: false,
    value: null,
    iconsSvg: {},
  };

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
    const iconNames = [
      { key: 'plus' },
      { key: 'plus', iconName: 'plusActive', color: '#2E86DE' },
      { key: 'del' },
      { key: 'del', iconName: 'delActive', color: '#2E86DE' },
      { key: 'back', iconName: 'exportImg' },
      { key: 'back', iconName: 'exportImgActive', color: '#2E86DE' },
    ];

    Promise.allSettled(iconNames.map((icon) => this.getIconToBase64Svg(icon)))
      .then((results) => {
        const iconsSvg = results
          .filter((result) => result.status === 'fulfilled') // 过滤出成功的 Promise
          .map((result) => result.value)
          .reduce((acc, curr) => ({ ...acc, ...curr }), {});
        this.setState({ iconsSvg });
      });
  }

  handleClick1 = () => {
    if (this.state.isShow1) {
      this.setState({ isShow1: false })
    } else {
      this.setState({ isShow1: true })
    }
  };
  handleItemClick1 = (item) => {
    this.setState({ isShow1: false, value: item.value })
  };
  handleClick2 = () => {
    if (this.state.isShow2) {
      this.setState({ isShow2: false })
    } else {
      this.setState({ isShow2: true })
    }
  };
  handleItemClick2 = (item) => {
    this.setState({ isShow2: false, value: item.value })
  };

  render() {
    const { iconsSvg } = this.state;
    const [version, theme] = getDemoVersion();
    let options1 = [
      {
        text: "Create", tipData: "defineCreate", value: 1, icon: iconsSvg.plus, iconActive: iconsSvg.plusActive
      },
      {
        text: "Export", value: 2, icon: iconsSvg.exportImg, iconActive: iconsSvg.exportImgActive
      },
      {
        text: "Delete", value: 3, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "push", value: 4, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "pop", value: 5, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "remove", value: 6, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "add", value: 7, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
      ,
      {
        text: "multi", value: 8, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      },
      {
        text: "common", value: 9, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
    ];
    let options2 = [
      {
        text: "CreateenablHorzScrollenablHorzScroll", value: 11, icon: iconsSvg.plus, iconActive: iconsSvg.plusActive
      },
      {
        text: "Export", value: 12, icon: iconsSvg.exportImg, iconActive: iconsSvg.exportImgActive
      },
      {
        text: "Delete", value: 13, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_Select_example" style={{width: "480px", height: "200px"}}>
          <Button text="Show/Hide Popup" style={{marginBottom: "5px"}} onClick={this.handleClick1}/>
          <Button text="Show/Hide Popup with Scroll" style={{marginBottom: "5px", float: "right"}}
                  onClick={this.handleClick2}/>

          <div id="eui_Select_example1" style={{position: "relative", width: "200px"}}>
            <Popup data={options1} value={this.state.value} display={this.state.isShow1}
                   onItemClick={this.handleItemClick1}/>
          </div>

          <div id="eui_Select_example2" style={{position: "relative", width: "220px", height: "1px", float: "right"}}>
            <Popup data={options2} value={this.state.value} display={this.state.isShow2}
                   onItemClick={this.handleItemClick2} enablHorzScroll={true}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<DropDownExample />, mountNode);

```

