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
| iconUrl | 图标URL（注：没有图标不要传入字符串；建议使用icon替代）；废弃 | string | undefined |
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
```

## 使用示例

### 基本属性设置

```jsx
import PopUpMenu from "eview-ui/PopUpMenu";

const options = [
  {
    text: "Item 1",
    serialno: 1,
    submenus: [
      { text: "Item 1.1", serialno: 11 },
      { text: "Item 1.2", serialno: 12 },
    ],
  },
  {
    text: "Item 2",
    serialno: 2,
    submenus: [
      { text: "说明文字", serialno: 21 },
      {
        text: "说明文字",
        serialno: 22,
        submenus: [
          { text: "Item 2.2.1", serialno: 221 },
          { text: "Item 2.2.2", serialno: 222 },
        ],
      },
    ],
  },
  { isDivider: true, serialno: 3 },
  { text: "Item 4", serialno: 4, disable: true, submenus: [] },
];

// isOpen 受控；parentId 指定菜单依附的父元素 id；自动调整菜单宽度
<PopUpMenu
  parentId="evu_PopUpMenu_example_default"
  options={options}
  isOpen={false} // true 打开 / false 关闭
  onClick={(evt) => {
    // evt: { event, text, value, clickItem }
  }}
  onBlur={() => {
    // 失焦（点击外部）触发
  }}
/>

// 通过 width 设置菜单宽度
<PopUpMenu
  parentId="evu_PopUpMenu_example_default2"
  options={options}
  isOpen={false}
  width="200px"
  onClick={(evt) => {}}
  onBlur={() => {}}
/>
```

### 带有图标和事件示例的菜单

```jsx
import PopUpMenu from "eview-ui/PopUpMenu";

const options = [
  {
    text: "Item 1",
    serialno: 1,
    iconUrl: "create_icon", // 图片 url
    submenus: [
      {
        text: "Item 1.1",
        serialno: 11,
        iconUrl: "create_icon", // 图片 url
        onClick: (evt) => {
          // 单项自定义点击回调；evt: { text, value, clickItem }
          // 设置后不再触发全局 onClick
        },
      },
      { text: "Item 1.2", serialno: 12, iconUrl: "create_icon" },
    ],
  },
  {
    text: "Item 2",
    serialno: 2,
    iconUrl: "create_icon",
    submenus: [
      { text: "Item 2.1", serialno: 21, iconUrl: "create_icon" },
      {
        text: "Item 2.2",
        serialno: 22,
        iconUrl: "create_icon",
        submenus: [
          {
            text: "Item 2.2.1",
            serialno: 221,
            iconUrl: "create_icon",
            onClick: (evt) => {},
          },
          { text: "Item 2.2.2", serialno: 222, iconUrl: "create_icon" },
        ],
      },
    ],
  },
];

<PopUpMenu
  parentId="evu_PopUpMenu_example_icon"
  options={options}
  isOpen={false}
  width="120"
  onClick={(evt) => {
    // evt: { event, text, value, clickItem }
  }}
  onBlur={() => {}}
/>
```

