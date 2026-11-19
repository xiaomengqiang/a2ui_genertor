# Popup 弹出列表

> 分类：其他

该组件用于设置下拉菜单，支持图标和自定义样式。

## API


### 属性

| 属性名称 | 描述 | 类型 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  设置组件id | string |  |
| className |  通过添加class的方式自定义组件样式，作用于组件最外层div | string |  |
| style |  通过添加style的方式自定义组件样式，作用于组件最外层div | object | {} |
| itemStyle |  通过添加style的方式自定义组件下拉项样式 | object |  |
| itemClassName |  通过添加class的方式自定义组件下拉项样式 | string |  |
| iconClassName |  通过添加class的方式自定义组件下拉项中图标样式 | string |  |
| iconStyle |  通过添加style的方式自定义组件下拉项中图标样式 | object |  |
| display |  设置组件是否显示 | bool | false |
| enablHorzScroll |  设置弹出窗口的横向滚动条（注意：源码属性名拼写为 enablHorzScroll，非 enableHorzScroll） | bool | false |
| data | 设置传入数据，数组中每项对象支持以下字段：<br>**text**: 页面展示值（string 或 function）<br>**value**: 数据库存取值（any）<br>**icon**: 下拉项中的图标URL（可选）<br>**iconActive**: 下拉项被选中时的图标URL（可选）<br>**tipData**: tooltip 展示值（可选）<br>**disabled**: 是否灰化（可选，bool）<br>**customClassName**: 下拉列表项的自定义样式类名（可选）<br>**label**: 是否为分组标签（可选，bool）<br>**style**: 单项自定义行内样式（可选） | array | [] |
| value |  通过value设置组件的选中项 | any |  |
| popupDirection |  定义弹出方向。属性值auto表示弹出方向将根据屏幕可视区域是否有足够空间显示完整下拉菜单自动选择 | enum:<br>&nbsp;'top'<br>&nbsp;'bottom'<br>&nbsp;'auto' | 'bottom' |
| popupWidth | 设置弹出框宽度（0表示自动） | number | 0 |
| displayItems | 设置弹窗中可见的最大下拉项数量 | number | 8 |
| lazyLoadOptions | 懒加载配置，用于大量数据滚动加载，包含 `totalRecords`（总记录数）和 `onLoadRecords(startIndex)`（加载回调） | object |  |
| isScrollAlwaysDisplay | 是否始终显示滚动条 | bool | false |
| hideTitle | 是否隐藏下拉项的 title 提示 | bool | false |
| coverItemCls | 是否覆盖item的className，默认为追加模式 | bool | false |
| onItemClick | 点击下拉项时的回调<br><br>**签名:**<br>`function(item: object, e: MouseEvent) => void`<br>*item:* 被点击的下拉项数据对象<br>*e:* 原生鼠标事件 | function |  |
| onMouseDown | 鼠标按下时的回调<br><br>**签名:**<br>`function(e: MouseEvent, index: number) => void`<br>*e:* 原生鼠标事件<br>*index:* 下拉项索引 | function |  |
| onItemHover | 鼠标在下拉项中移动时的回调<br><br>**签名:**<br>`function(item: object, e: MouseEvent) => void` | function |  |
| onItemEnter | 鼠标移入下拉项时的回调<br><br>**签名:**<br>`function(item: object, e: MouseEvent) => void` | function |  |
| onItemOut | 鼠标移出下拉项时的回调<br><br>**签名:**<br>`function(item: object, e: MouseEvent) => void` | function |  |
| onClosePopup | 弹窗关闭时的回调<br><br>**签名:**<br>`function() => void` | function |  |
| version | 增加版本设置，用于样式适配 | string |  |
| theme | 增加主题设置 | string |  |

## 接口定义

```typescript
import type { MouseEvent } from 'react';

interface PopUpDataItem {
  text: string | ((index: number) => React.ReactNode);
  value: any;
  icon?: string;
  iconActive?: string;
  tipData?: string;
  disabled?: boolean;
  customClassName?: string;
  label?: boolean;
  style?: object;
  dataClassName?: string;
}

interface LazyLoadOptions {
  totalRecords: number;
  onLoadRecords: (startIndex: number) => void;
}

interface PopUp {

  id?: string;

  className?: string;

  style?: object;

  itemStyle?: object;

  itemClassName?: string;

  iconClassName?: string;

  iconStyle?: object;

  display?: boolean;

  enablHorzScroll?: boolean;

  data?: PopUpDataItem[];

  value?: any;

  onItemClick?: (item: PopUpDataItem, e: MouseEvent<HTMLSpanElement>) => unknown;

  onMouseDown?: (e: MouseEvent<HTMLSpanElement>, index: number) => unknown;

  lazyLoadOptions?: LazyLoadOptions;

  popupDirection?: 'top' | 'bottom' | 'auto';

  popupWidth?: number;

  displayItems?: number;

  isScrollAlwaysDisplay?: boolean;

  onClosePopup?: () => unknown;

  onItemHover?: (item: PopUpDataItem, e: MouseEvent<HTMLSpanElement>) => unknown;

  onItemEnter?: (item: PopUpDataItem, e: MouseEvent<HTMLSpanElement>) => unknown;

  onItemOut?: (item: PopUpDataItem, e: MouseEvent<HTMLSpanElement>) => unknown;

  hideTitle?: boolean;

  coverItemCls?: boolean;

  fromSelect?: boolean;

  version?: string;

  theme?: string;

  nodeLinelHeight?: number;

}

export type PopUpProps = Partial<PopUp>;
```

## 使用示例

### 基本属性设置

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
          .filter((result) => result.status === 'fulfilled')
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
      },
      {
        text: "push", value: 4, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      },
      {
        text: "pop", value: 5, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      },
      {
        text: "remove", value: 6, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      },
      {
        text: "add", value: 7, icon: iconsSvg.del, iconActive: iconsSvg.delActive
      },
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

