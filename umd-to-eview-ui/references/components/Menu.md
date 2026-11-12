# Menu 菜单

> 分类：导航


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Menu`（需 checkbox 多选/精确同构） | `Menu`（备选） | **children 驱动**（`Menu.Item`/`Menu.SubMenu`/`Menu.Divider`，无 items prop——antd v5 items 数组必须转 JSX）；`mode`（**现只有 vertical 实现**）；**`selectable` 默认 false——必须显式 `selectable={true}`**（antd 默认可选中）；`selectedKeys`/`openKeys`/`defaultOpenKeys`/`multiple` 同名；`onOpenChange`→**`onOpenKeysChange(openKeys)`**；`onClick/onSelect(event: ClickItemEvent)`（event 包装，取 key 方式见 [Menu.md](components/Menu.md) 事件行为表）；`triggerSubMenuAction` 默认 **'hover'**（antd 默认 click，行为差异见 Menu.md §事件行为）；`selectable` 只在 true 时 onSelect 有效 |

## API


### Menu
| 属性名称 | 描述 | 类型 | 默认 |
|-----|-----|-----|-----|
| mode | 菜单类型 (现只有垂直模式) | 'vertical' &#124; 'horizontal' &#124; 'inline'  | 'vertical' |
| selectable | 支持选中 | boolean | false |
| multiple | 允许多选 | boolean | false |
| size | 菜单正常大小和较小模式 | 'normal' &#124; 'small' | 'normal' |
| defaultOpenKeys | 初始展开的SubMenu子菜单的key数组 | React.Key[] | [] |
| openKeys | 展开的SubMenu子菜单的key数组 | React.Key[] |  |
| onOpenKeysChange | SubMenu 展开/关闭的回调 | (openKeys?: React.Key[]) => void |  |
| defaultSelectedKeys | 初始选中的菜单项 key 数组 | React.Key[] | [] |
| selectedKeys | 选中的菜单项 key 数组 | React.Key[] |  |
| onSelect | MenuItem 被选中时调用, 仅在 selectable = true 时有效 | (event?: SelectItemEvent) => void |  |
| onDeselect | MenuItem 被取消选中时调用，仅在 multiple = true 时有效 | (event?: SelectItemEvent) => void |  |
| onClick | 点击 MenuItem 调用此函数 | (event?: ClickItemEvent) => void |  |
| triggerSubMenuAction | SubMenu 标题展开子菜单的触发条件 | 'hover' &#124; 'click' | 'hover' |
| style | Menu节点样式(只作用于第一层) | React.CSSProperties |  |
| children | 菜单选项元素, 请使用 MenuItem &#124; SubMenu &#124; Divider 数组 | React.ReactNode |  |
注: 还包括HTMUListElement的API

### Menu.Item
| 属性名称 | 描述 | 类型 | 默认 |
|-----|-----|-----|-----|
| disabled | 是否禁用 | boolean | false |
| key | 键, 唯一标识 | React.Key |  |
| title | 设置收缩时展示的悬浮标题 | string ||
| icon | 菜单图标 | React.ReactElement | `null` |
| children | Item文字或元素 | React.ReactNode ||
| keyCode | 快捷键码 | number ||
注: 还包括HTMLLIElement的API

### Menu.SubMenu
| 属性名称 | 描述 | 类型 | 默认 |
|-----|-----|-----|-----|
| popupClassName | 子菜单弹出框样式 | string ||
| key | 键, 唯一标识 | React.Key ||
| icon | 图标元素 | React.ReactElement | `null` |
| title | 子菜单标题文字或子元素 | React.ReactNode ||
| disabled | 是否禁用 | boolean ||
| onTitleClick | 点击子菜单标题 | (event?: { key?: React.Key; domEvent: React.MouseEvent }) => void ||
| children | 子菜单展开选项元素, 请使用 MenuItem &#124; SubMenu &#124; Divider 数组 | React.ReactNode |  |
| keyCode | 快捷键码 | number ||
注: 还包括HTMLLIElement的API

### Menu.Divider
菜单项分割线, 包括HTMLLIElement的API

## 附加说明: 不同 triggerSubMenuAction 的事件行为
### click
| 事件/对象 | Item | SubMenuTitle | 外部 |
|-----|-----|-----|-----|-----|
| 鼠标悬浮 | 无 | 无 | 无 |
| 鼠标离开 | 无 | 无 | / |
| 点击 | 关闭所有SubMenu | 关其它SubMenu打开此SubMenu | 关闭所有SubMenu |

### hover
| 事件/对象 | Item | SubMenuTitle | 外部 |
|-----|-----|-----|-----|-----|
| 鼠标悬浮 | 关闭下级SubMenu | 关闭其它下级SubMenu, 打开此SubMenu | 关闭所有SubMenu |
| 鼠标离开 | 无 | 关闭此SubMenu | / |
| 点击 | 关闭所有SubMenu | 无 | 关闭所有SubMenu |

## 使用示例

### 基本属性设置

## en-US



```jsx
import Menu from 'eview-ui/Menu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={ version } theme={ theme }>
    <Menu style={{ width: 256, border: '1px solid #f0f0f0' }}>
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
          <Menu.SubMenu key="10" title="打开">
            <Menu.Item key="11">菜单项</Menu.Item>
            <Menu.Item key="12">菜单项</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item key="13">菜单项</Menu.Item>
        <Menu.Item key="14">菜单项</Menu.Item>
        <Menu.SubMenu key="15" title="打开15">
          <Menu.Item key="16">菜单项</Menu.Item>
          <Menu.SubMenu key="17" title="打开17">
            <Menu.Item key="18">菜单项</Menu.Item>
            <Menu.Item key="19">菜单项</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="20">菜单项</Menu.Item>
          <Menu.SubMenu key="21" title="打开21">
            <Menu.Item key="22">菜单项</Menu.Item>
            <Menu.Item key="23">菜单项</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu.SubMenu>
      <Menu.Item key="24">菜单项</Menu.Item>
      <Menu.Item key="25">菜单项</Menu.Item>
    </Menu>
  </ConfigProvider>
,
  mountNode,
);

```

```jsx
import Menu from 'eview-ui/Menu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={ version } theme={ theme }>
    <Menu style={{ width: 256, border: '1px solid #f0f0f0' }}>
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
          <Menu.SubMenu key="10" title="打开">
            <Menu.Item key="11">菜单项</Menu.Item>
            <Menu.Item key="12">菜单项</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item key="13">菜单项</Menu.Item>
        <Menu.Item key="14">菜单项</Menu.Item>
        <Menu.SubMenu key="15" title="打开15">
          <Menu.Item key="16">菜单项</Menu.Item>
          <Menu.SubMenu key="17" title="打开17">
            <Menu.Item key="18">菜单项</Menu.Item>
            <Menu.Item key="19">菜单项</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="20">菜单项</Menu.Item>
          <Menu.SubMenu key="21" title="打开21">
            <Menu.Item key="22">菜单项</Menu.Item>
            <Menu.Item key="23">菜单项</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu.SubMenu>
      <Menu.Item key="24">菜单项</Menu.Item>
      <Menu.Item key="25">菜单项</Menu.Item>
    </Menu>
  </ConfigProvider>
,
  mountNode,
);

```

### 小尺寸

## en-US



```jsx
import Menu from 'eview-ui/Menu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <Menu style={{ width: 256, border: '1px solid #f0f0f0' }} size="small">
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
          <Menu.SubMenu key="10" title="打开 10">
            <Menu.Item key="11">菜单项 11</Menu.Item>
            <Menu.Item key="12">菜单项 12</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item key="13">菜单项 13</Menu.Item>
        <Menu.Item key="14">菜单项 14</Menu.Item>
        <Menu.SubMenu key="15" title="打开 15">
          <Menu.Item key="16">菜单项 16</Menu.Item>
          <Menu.SubMenu key="17" title="打开 17">
            <Menu.Item key="18">菜单项 18</Menu.Item>
            <Menu.Item key="19">菜单项 19</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="20">菜单项 20</Menu.Item>
          <Menu.SubMenu key="21" title="打开 21">
            <Menu.Item key="22">菜单项 22</Menu.Item>
            <Menu.Item key="23">菜单项 23</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu.SubMenu>
      <Menu.Item key="24">菜单项</Menu.Item>
      <Menu.Item key="25">菜单项</Menu.Item>
    </Menu>
  </ConfigProvider>
,
  mountNode,
);

```

```jsx
import Menu from 'eview-ui/Menu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <Menu style={{ width: 256, border: '1px solid #f0f0f0' }} size="small">
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
          <Menu.SubMenu key="10" title="打开 10">
            <Menu.Item key="11">菜单项 11</Menu.Item>
            <Menu.Item key="12">菜单项 12</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item key="13">菜单项 13</Menu.Item>
        <Menu.Item key="14">菜单项 14</Menu.Item>
        <Menu.SubMenu key="15" title="打开 15">
          <Menu.Item key="16">菜单项 16</Menu.Item>
          <Menu.SubMenu key="17" title="打开 17">
            <Menu.Item key="18">菜单项 18</Menu.Item>
            <Menu.Item key="19">菜单项 19</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="20">菜单项 20</Menu.Item>
          <Menu.SubMenu key="21" title="打开 21">
            <Menu.Item key="22">菜单项 22</Menu.Item>
            <Menu.Item key="23">菜单项 23</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu.SubMenu>
      <Menu.Item key="24">菜单项</Menu.Item>
      <Menu.Item key="25">菜单项</Menu.Item>
    </Menu>
  </ConfigProvider>
,
  mountNode,
);

```

