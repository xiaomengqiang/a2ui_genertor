# Menu 菜单

> 分类：导航

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                           | eview 写法     | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Menu`（需 checkbox 多选/精确同构） | `Menu`（备选） | **children 驱动**（`Menu.Item`/`Menu.SubMenu`/`Menu.Divider`，无 items prop——antd v5 items 数组必须转 JSX）；`mode`（**现只有 vertical 实现**）；**`selectable` 默认 false——必须显式 `selectable={true}`**（antd 默认可选中）；`selectedKeys`/`openKeys`/`defaultOpenKeys`/`multiple` 同名；`onOpenChange`→**`onOpenKeysChange(openKeys)`**；`onClick/onSelect(event: ClickItemEvent)`（event 包装，取 key 方式见下方事件行为表）；`triggerSubMenuAction` 默认 **'hover'**（antd 默认 click，行为差异见下方事件行为表）；`selectable` 只在 true 时 onSelect 有效 |

## 事件类型定义

```typescript
interface ClickItemEvent {
  item: HTMLElement | null;
  key: React.Key;
  keyPath: React.Key[];
  domEvent?: React.MouseEvent<HTMLElement, MouseEvent>;
}

interface SelectItemEvent extends ClickItemEvent {
  selectedKeys: React.Key[];
}
```

## API

### Menu

| 属性名称             | 描述                                                             | 类型                                           | 默认       |
| -------------------- | ---------------------------------------------------------------- | ---------------------------------------------- | ---------- |
| mode                 | 菜单类型 (现只有垂直模式)                                        | 'vertical' &#124; 'horizontal' &#124; 'inline' | 'vertical' |
| selectable           | 支持选中                                                         | boolean                                        | false      |
| multiple             | 允许多选                                                         | boolean                                        | false      |
| size                 | 菜单正常大小和较小模式                                           | 'normal' &#124; 'small'                        | 'normal'   |
| defaultOpenKeys      | 初始展开的SubMenu子菜单的key数组                                 | React.Key[]                                    | []         |
| openKeys             | 展开的SubMenu子菜单的key数组                                     | React.Key[]                                    |            |
| onOpenKeysChange     | SubMenu 展开/关闭的回调                                          | (openKeys?: React.Key[]) => void               |            |
| defaultSelectedKeys  | 初始选中的菜单项 key 数组                                        | React.Key[]                                    | []         |
| selectedKeys         | 选中的菜单项 key 数组                                            | React.Key[]                                    |            |
| onSelect             | MenuItem 被选中时调用, 仅在 selectable = true 时有效             | (event?: SelectItemEvent) => void              |            |
| onDeselect           | MenuItem 被取消选中时调用，仅在 multiple = true 时有效           | (event?: SelectItemEvent) => void              |            |
| onClick              | 点击 MenuItem 调用此函数                                         | (event?: ClickItemEvent) => void               |            |
| triggerSubMenuAction | SubMenu 标题展开子菜单的触发条件                                 | 'hover' &#124; 'click'                         | 'hover'    |
| style                | Menu节点样式(只作用于第一层)                                     | React.CSSProperties                            |            |
| className            | Menu节点自定义class                                              | string                                         |            |
| version              | 传入该值可定制当前组件匹配的ucd规范，例如 `version='aui3'`       | string                                         |            |
| theme                | 传入该值可定制当前组件匹配的主题模式样式，例如 `theme='evening'` | string                                         |            |
| children             | 菜单选项元素, 请使用 MenuItem &#124; SubMenu &#124; Divider 数组 | React.ReactNode                                |            |

注: 还包括HTMLUListElement的API

### Menu.Item

| 属性名称 | 描述                                                             | 类型            | 默认  |
| -------- | ---------------------------------------------------------------- | --------------- | ----- |
| disabled | 是否禁用                                                         | boolean         | false |
| key      | 键, 唯一标识                                                     | React.Key       |       |
| title    | 设置收缩时展示的悬浮标题（**暂未实现，当前仅用作鼠标悬浮提示**） | string          | ''    |
| icon     | 菜单图标文本内容                                                 | string          |       |
| children | Item文字或元素                                                   | React.ReactNode |       |
| keyCode  | 快捷键码                                                         | number          |       |

注: 还包括HTMLLIElement的API

### Menu.SubMenu

| 属性名称       | 描述                                                                   | 类型                                                                                         | 默认  |
| -------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----- |
| popupClassName | 子菜单弹出框样式                                                       | string                                                                                       |       |
| key            | 键, 唯一标识                                                           | React.Key                                                                                    |       |
| icon           | 图标元素                                                                   | React.ReactElement                                                                           |       |
| title          | 子菜单标题文字或子元素                                                 | React.ReactNode                                                                              |       |
| disabled       | 是否禁用                                                               | boolean                                                                                      | false |
| onTitleClick   | 点击子菜单标题                                                         | (event?: { key?: React.Key; domEvent: React.MouseEvent<HTMLLIElement, MouseEvent> }) => void |       |
| children       | 子菜单展开选项元素, 请使用 MenuItem &#124; SubMenu &#124; Divider 数组 | React.ReactNode                                                                              |       |
| keyCode        | 快捷键码                                                               | number                                                                                       |       |
| useAbsolute    | 子菜单弹出是否使用absolute定位方式                                     | boolean                                                                                      | false |

注: 还包括HTMLLIElement的API

### Menu.Divider

菜单项分割线，支持 `className` 和 `style` 属性，还包括HTMLLIElement的API

## 接口定义

```typescript
interface MenuProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "onClick" | "onSelect"
> {
  /**
   * 菜单类型 (现只有垂直模式)
   * @default 'vertical'
   */
  mode?: "vertical" | "horizontal" | "inline";

  /**
   * 支持选中
   * @default false
   */
  selectable?: boolean;

  /**
   * 允许多选
   * @default false
   */
  multiple?: boolean;

  /**
   * 菜单正常大小和较小模式
   * @default 'normal'
   */
  size?: "normal" | "small";

  /**
   * 初始展开的SubMenu子菜单的key数组
   */
  defaultOpenKeys?: React.Key[];

  /**
   * 展开的SubMenu子菜单的key数组
   */
  openKeys?: React.Key[];

  /**
   * SubMenu 展开/关闭的回调
   */
  onOpenKeysChange?: (openKeys?: React.Key[]) => void;

  /**
   * 初始选中的菜单项 key 数组
   */
  defaultSelectedKeys?: React.Key[];

  /**
   * 选中的菜单项 key 数组
   */
  selectedKeys?: React.Key[];

  /**
   * Menu节点样式(只作用于第一层)
   */
  style?: React.CSSProperties;

  /**
   * 点击 MenuItem 调用此函数
   */
  onClick?: (event?: ClickItemEvent) => void;

  /**
   * MenuItem 被选中时调用, 仅在 selectable = true 时有效
   */
  onSelect?: (event?: SelectItemEvent) => void;

  /**
   * MenuItem 被取消选中时调用, 仅在 multiple = true 时有效
   */
  onDeselect?: (event?: SelectItemEvent) => void;

  /**
   * SubMenu 标题展开子菜单的触发条件
   * @default 'hover'
   */
  triggerSubMenuAction?: "hover" | "click";

  /**
   * Menu节点自定义class
   */
  className?: string;

  /**
   * 传入该值可定制当前组件匹配的ucd规范
   */
  version?: string;

  /**
   * 传入该值可定制当前组件匹配的主题模式样式
   */
  theme?: string;

  /**
   * 菜单选项元素, 请使用 MenuItem | SubMenu | Divider 数组
   */
  children?: React.ReactNode;
}

interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 键, 唯一标识
   */
  key?: React.Key;

  /**
   * 设置收缩时展示的悬浮标题（暂未实现，当前仅用作鼠标悬浮提示）
   * @default ''
   */
  title?: string;

  /**
   * 菜单图标文本内容
   */
  icon?: string;

  /**
   * Item文字或元素
   */
  children: React.ReactNode;

  /**
   * 快捷键码
   */
  keyCode?: number;
}

interface SubMenuProps extends Omit<
  React.HTMLAttributes<HTMLLIElement>,
  "title"
> {
  /**
   * 子菜单弹出框样式
   */
  popupClassName?: string;

  /**
   * 键, 唯一标识
   */
  key?: React.Key;

  /**
   * 图标元素
   */
  icon?: React.ReactElement;

  /**
   * 子菜单标题文字或子元素
   */
  title?: React.ReactNode;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 点击子菜单标题
   */
  onTitleClick?: (event?: {
    key?: React.Key;
    domEvent: React.MouseEvent<HTMLLIElement, MouseEvent>;
  }) => void;

  /**
   * 子菜单展开选项元素, 请使用 MenuItem | SubMenu | Divider 数组
   */
  children?: React.ReactNode;

  /**
   * 快捷键码
   */
  keyCode?: number;

  /**
   * 子菜单弹出是否使用absolute定位方式
   * @default false
   */
  useAbsolute?: boolean;
}
```

## 附加说明: 不同 triggerSubMenuAction 的事件行为

### click

| 事件/对象 | Item            | SubMenuTitle               | 外部            |
| --------- | --------------- | -------------------------- | --------------- |
| 鼠标悬浮  | 无              | 无                         | 无              |
| 鼠标离开  | 无              | 无                         | /               |
| 点击      | 关闭所有SubMenu | 关其它SubMenu打开此SubMenu | 关闭所有SubMenu |

### hover

| 事件/对象 | Item            | SubMenuTitle                       | 外部            |
| --------- | --------------- | ---------------------------------- | --------------- |
| 鼠标悬浮  | 关闭下级SubMenu | 关闭其它下级SubMenu, 打开此SubMenu | 关闭所有SubMenu |
| 鼠标离开  | 无              | 关闭此SubMenu                      | /               |
| 点击      | 关闭所有SubMenu | 无                                 | 关闭所有SubMenu |

## 使用示例

### 基本属性设置



```jsx
import Menu from "eview-ui/Menu";

<Menu style={{ width: 256, border: "1px solid #f0f0f0" }}>
  <Menu.Item key="1">菜单项</Menu.Item>
  <Menu.Item key="2">菜单项</Menu.Item>
  <Menu.Divider />
  <Menu.SubMenu key="3" title="打开">
    <Menu.SubMenu key="4" title="打开">
      <Menu.Item key="5">菜单项</Menu.Item>
      <Menu.SubMenu key="6" title="打开">
        <Menu.Item key="7">菜单项</Menu.Item>
        <Menu.Item key="8">菜单项</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="9">菜单项</Menu.Item>
    </Menu.SubMenu>
    <Menu.Item key="13">菜单项</Menu.Item>
  </Menu.SubMenu>
  <Menu.Item key="24">菜单项</Menu.Item>
</Menu>
```

### 小尺寸



```jsx
import Menu from "eview-ui/Menu";

<Menu style={{ width: 256, border: "1px solid #f0f0f0" }} size="small">
  <Menu.Item key="1">菜单项 1</Menu.Item>
  <Menu.Item key="2">菜单项 2</Menu.Item>
  <Menu.Divider />
  <Menu.SubMenu key="3" title="打开 3">
    <Menu.SubMenu key="4" title="打开 4">
      <Menu.Item key="5">菜单项 5</Menu.Item>
      <Menu.SubMenu key="6" title="打开 6">
        <Menu.Item key="7">菜单项 7</Menu.Item>
        <Menu.Item key="8">菜单项 8</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="9">菜单项 9</Menu.Item>
    </Menu.SubMenu>
    <Menu.Item key="13">菜单项 13</Menu.Item>
  </Menu.SubMenu>
  <Menu.Item key="24">菜单项</Menu.Item>
</Menu>
```
