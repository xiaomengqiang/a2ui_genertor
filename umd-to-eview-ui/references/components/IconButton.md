# IconButton 图标按钮

> 分类：废弃
>
> **该组件已废弃，推荐使用 Button 组件替代。**

该组件支持自定义样式和图标，同时支持通过iconName属性获取组件库中的已有图标。组件内部基于Tooltip实现提示气泡，触发方式为`hover`和`focus`。支持键盘Enter键触发点击事件。组件默认设置`tabIndex={0}`以支持键盘无障碍访问，禁用状态下`tabIndex`不设置。

## API

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 设置组件的id | string | 自动生成（前缀`eui_icon_bt_`） |
| className | 通过自定义class的方式给组件添加样式 | string | |
| style | 通过添加style的方式给组件添加样式 | React.CSSProperties | |
| iconUrl | 通过传入图片路径设置图标按钮，图标以背景图方式显示（废弃，建议用 iconName） | string | |
| hoverIconUrl | 通过传入图片路径设置鼠标悬浮时的按钮图标，悬浮时替换为该背景图（同 iconUrl，废弃，建议用 iconName） | string | |
| iconName | 获取组件库中的已有图标，与iconUrl属性二者只能用其一；设置后内部渲染Icon组件 | string | |
| iconProps | 配合iconName一同使用，用来设置组件库已有图标的样式，不设置为组件库默认样式。支持传入Icon组件的所有props，如：<br/>`{ color: '#39f', hoverColor: '#39f', disabledColor: '#999', active: true, activeColor: '#ff0', focus: true, focusColor: '#0f0' }` | object | |
| disabled | 设置组件的灰化（禁用）状态 | boolean | `false` |
| onClick | 设置组件的点击事件<br><br>**签名：**`function(event: object) => void`<br>*event:* 原生dom的点击事件 | function | |
| onMouseEnter | 设置组件鼠标进入事件<br><br>**签名：**`function(event: React.MouseEvent) => void` | function | |
| onMouseLeave | 设置组件鼠标移出事件<br><br>**签名：**`function(event: React.MouseEvent) => void` | function | |
| onFocus | 设置组件聚焦事件<br><br>**签名：**`function(event: React.FocusEvent) => void` | function | |
| onBlur | 设置组件失焦事件<br><br>**签名：**`function(event: React.FocusEvent) => void` | function | |
| tipText | 提示文本，作为Tooltip的content显示 | string | |
| tipData | 提示气泡的配置项，内部传递给Tooltip组件作为props。支持Tooltip的所有属性，如`placement`、`arrowPointAtCenter`、`overlayClassName`等；同时支持`disposeTimeOut`用于自动关闭配置。例如：`tipData={{ disposeTimeOut: 5000, placement: 'top' }}` | object | |
| zIndex | 提示气泡的z-index | number | 基础zIndex + 基础单位 |
| version | 传入该值可定制当前组件匹配的ucd规范 | string | 取自ConfigProvider |
| theme | 传入该值可定制当前组件的主题模式 | string | 取自ConfigProvider |
| data-test-id | 测试标识，用于自动化测试 | string | |

> **注意**：当使用`iconUrl`/`hoverIconUrl`时，图标以CSS背景图方式渲染（span元素 + backgroundImage），组件默认尺寸为1rem × 1rem；当使用`iconName`时，内部渲染Icon组件，图标尺寸由`iconProps.size`控制。

## 使用示例

### 基本属性设置

```jsx
import IconButton from 'eview-ui/IconButton';

// iconUrl/hoverIconUrl 以背景图方式渲染（废弃，建议用 iconName）
<IconButton
  tipText="Modify"
  tipData={{ disposeTimeOut: 5000, placement: 'top' }}
  iconUrl="pen_default" // 图片 url
  hoverIconUrl="pen_hover" // 悬浮图标 url
/>;

// 禁用态
<IconButton
  tipText="Set"
  tipData={{ disposeTimeOut: 5000, placement: 'top' }}
  disabled
  iconUrl="pen_disabled" // 图片 url
  hoverIconUrl="pen_hover"
/>;
```

### 事件回调

```jsx
import IconButton from 'eview-ui/IconButton';

// iconName 获取组件库已有图标（建议用法），触发方式 hover/focus，支持 Enter 键
<IconButton
  tipText="Display Tip"
  tipData={{ disposeTimeOut: 5000, placement: 'top' }}
  iconName="operation"
  onClick={(event) => {
    // event: 原生点击事件
  }}
/>;

<IconButton
  tipText="Loading Tip"
  tipData={{ disposeTimeOut: 5000, placement: 'top' }}
  iconName="loading"
  onClick={(event) => {}}
/>;
```

