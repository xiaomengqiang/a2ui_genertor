# Dropdown 下拉菜单

> 分类：导航

弹出菜单

## API


### 属性

| 属性名称 | 说明 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| visible | 控制菜单的显示 | boolean |  |
| onVisibleChange | 菜单显示状态变更时调用 | (visible: boolean) => void; |  |
| getPopupContainer | 获取渲染父节点, 设为false时为元素虚拟dom的原位置 | (() => HTMLElement) &#124; false |  |
| placement | 定义popup依附的相对位置 | 'leftTop' &#124; 'left' &#124; 'leftBottom' &#124; 'rightTop' &#124; 'right' &#124; 'rightBottom' &#124; 'topLeft' &#124; 'top' &#124; 'topRight' &#124; 'bottomLeft' &#124; 'bottom' &#124; 'bottomRight' | 'bottomLeft' |
| overlay | 菜单元素 | React.ReactNode |  |
| overlayClassName | 下拉根元素类名 | string |  |
| overlayStyle | 下拉根元素样式 | React.CSSProperties |  |
| trigger | 触发下拉的行为 | ('click' &#124; 'hover' &#124; 'contextMenu')[] | ['click'] |
| children | 菜单弹出触发者元素 | React.ReactElement |  |
| mountOnBody | 是否将下拉元素挂载到body下 | boolean | false |

## 使用示例

### 基本属性设置

## en-US



```jsx
import Dropdown from 'eview-ui/Dropdown';
import Menu from 'eview-ui/Menu';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const menu = (
    <Menu>
      <Menu.Item key="1" disabled>菜单项</Menu.Item>
      <Menu.Item key="2">菜单项</Menu.Item>
      <Menu.Divider />
      <Menu.SubMenu title="打开">
        <Menu.SubMenu title="打开" disabled>
          <Menu.Item key="5">菜单项</Menu.Item>
          <Menu.SubMenu key="6" title="打开">
            <Menu.Item key="7">菜单项</Menu.Item>
            <Menu.Item key="8">菜单项</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="9">菜单项</Menu.Item>
          <Menu.SubMenu title="打开">
            <Menu.Item>菜单项</Menu.Item>
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
);

function DropdownDemo() {
  const [version, theme] = getDemoVersion();
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <Dropdown overlay={menu}>
        <Button text={'open'}></Button>
      </Dropdown>
    </ConfigProvider>
  )
}

ReactDOM.render(<DropdownDemo />, mountNode);

```

```jsx
import Dropdown from 'eview-ui/Dropdown';
import Menu from 'eview-ui/Menu';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const menu = (
    <Menu>
      <Menu.Item key="1" disabled>菜单项</Menu.Item>
      <Menu.Item key="2">菜单项</Menu.Item>
      <Menu.Divider />
      <Menu.SubMenu title="打开">
        <Menu.SubMenu title="打开" disabled>
          <Menu.Item key="5">菜单项</Menu.Item>
          <Menu.SubMenu key="6" title="打开">
            <Menu.Item key="7">菜单项</Menu.Item>
            <Menu.Item key="8">菜单项</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="9">菜单项</Menu.Item>
          <Menu.SubMenu title="打开">
            <Menu.Item>菜单项</Menu.Item>
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
);

function DropdownDemo() {
  const [version, theme] = getDemoVersion();
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <Dropdown overlay={menu}>
        <Button text={'open'}></Button>
      </Dropdown>
    </ConfigProvider>
  )
}

ReactDOM.render(<DropdownDemo />, mountNode);

```

### 支持12种方向弹出

## en-US



```jsx
import Dropdown from 'eview-ui/Dropdown';
import Menu from 'eview-ui/Menu';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const PLACEMENTS = [
    'leftTop', 'left', 'leftBottom', 'rightTop', 'right', 'rightBottom', 'topLeft', 'top', 'topRight', 'bottomLeft', 'bottom', 'bottomRight',
];

const menu = (
    <Menu>
    <Menu.Item disabled>菜单项</Menu.Item>
    <Menu.Item>菜单项</Menu.Item>
    <Menu.Divider />
    <Menu.SubMenu title="打开">
        <Menu.SubMenu title="打开" disabled>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开15">
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开17">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开21">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        </Menu.SubMenu>
    </Menu.SubMenu>
    <Menu.Item>菜单项</Menu.Item>
    <Menu.Item>菜单项</Menu.Item>
    </Menu>
);
const [version, theme] = getDemoVersion();
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>

    {PLACEMENTS.map(placement => (
      <Dropdown overlay={menu} placement={placement}>
        <Button style={{ width: 150, margin: 10 }} text={placement} />
      </Dropdown>
    ))}

  </ConfigProvider>
,
    mountNode,
);

```

```jsx
import Dropdown from 'eview-ui/Dropdown';
import Menu from 'eview-ui/Menu';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const PLACEMENTS = [
    'leftTop', 'left', 'leftBottom', 'rightTop', 'right', 'rightBottom', 'topLeft', 'top', 'topRight', 'bottomLeft', 'bottom', 'bottomRight',
];

const menu = (
    <Menu>
    <Menu.Item disabled>菜单项</Menu.Item>
    <Menu.Item>菜单项</Menu.Item>
    <Menu.Divider />
    <Menu.SubMenu title="打开">
        <Menu.SubMenu title="打开" disabled>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开15">
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开17">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item>菜单项</Menu.Item>
        <Menu.SubMenu title="打开21">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
        </Menu.SubMenu>
        </Menu.SubMenu>
    </Menu.SubMenu>
    <Menu.Item>菜单项</Menu.Item>
    <Menu.Item>菜单项</Menu.Item>
    </Menu>
);
const [version, theme] = getDemoVersion();
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>

    {PLACEMENTS.map(placement => (
      <Dropdown overlay={menu} placement={placement}>
        <Button style={{ width: 150, margin: 10 }} text={placement} />
      </Dropdown>
    ))}

  </ConfigProvider>
,
    mountNode,
);

```

