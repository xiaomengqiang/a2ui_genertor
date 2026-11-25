# HelpTip 文字提示

> 分类：数据展示

HelpTip组件可实现当鼠标悬浮或键盘聚焦在问号图标上时，显示出一个提示信息，该组件可用于为某些关键字提供帮助提示。组件内部基于Tooltip实现，默认触发方式为`hover`和`focus`，箭头自动指向图标中心。

## API

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| id | 定制组件dom元素id，传入该值可覆盖组件自动生成的id | string | |
| className | 支持通过className设置提示框（overlay）的样式类名 | string | |
| iconSize | 定制图标的大小，格式为`[width, height]`，不传则使用默认大小 | string[] | `['1rem', '1rem']` |
| tipStyle | 支持通过style设置tip提示框的样式，其中`backgroundColor`会作为Tooltip的`color`属性 | React.CSSProperties | |
| iconDisplay | 控制提示框的显示和隐藏，映射为Tooltip的`visible`属性 | boolean | true |
| position | 设置图标容器的位置，图标容器的display属性为relative，格式为`[top, left]`，例如`position={[20, 50]}` => top: 20px, left: 50px | number[] | `[0, 0]` |
| arrowDirection | 支持通过arrowDirection设置箭头方向，表示箭头指向的方向：左 右 上 下 | enum: `'left'` \| `'right'` \| `'top'` \| `'bottom'` | `'left'` |
| tipContent | 设置提示框里的内容，默认值为空，支持字符串或任意React节点 | string \| React.ReactNode | |
| hideArrow | 是否隐藏箭头，继承自Tooltip | boolean | false |

### 继承属性（来自Tooltip）

HelpTip继承自Tooltip组件，以下属性也可使用：

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| onVisibleChange | 提示框显示/隐藏时的回调函数 | (visible: boolean) => void | |
| mouseEnterDelay | 鼠标进入后多少毫秒显示提示框 | number | 100 |
| mouseLeaveDelay | 鼠标移出后多少毫秒隐藏提示框 | number | 100 |
| getPopupContainer | 浮层渲染父节点，默认渲染到body上 | (() => HTMLElement) \| false | () => document.body |
| zIndex | 提示框的z-index属性 | number | |
| autoAdjustOverflow | 提示框被遮挡时自动调整位置 | boolean | true |
| space | 提示框依附图标的附加距离 | number | 8 |
| destroyTooltipOnHide | 关闭后是否销毁Tooltip | boolean | false |

> **注意**：以下属性在HelpTip内部已被固定或映射，不建议外部覆盖：<br/>
> - `trigger`：固定为 `['hover', 'focus']`<br/>
> - `arrowPointAtCenter`：固定为 `true`（箭头始终指向图标中心）<br/>
> - `placement`：由 `arrowDirection` 自动映射<br/>
> - `overlayClassName`：由 `className` 映射<br/>
> - `overlayStyle`：由 `tipStyle` 映射<br/>
> - `visible`：由 `iconDisplay` 映射<br/>
> - `content`：由 `tipContent` 映射<br/>
> - `color`：由 `tipStyle.backgroundColor` 映射<br/>
> - `scrollHiden`：固定为 `true`（滚动时自动隐藏）

## 使用示例

### 基本用法

```jsx
import { SvgIcon } from '@/shared/SvgIcon'
import HelpTip from "eview-ui/HelpTip";

<HelpTip tipContent="arrow left, and you can set the position" />
<HelpTip arrowDirection="top" position={[0, 30]} tipContent="arrow top" /> {/* position: [top, left] */}
<HelpTip arrowDirection="bottom" position={[0, 10]} tipContent="arrow bottom" tipStyle={{ width: "200px", backgroundColor: "lightBlue", borderRadius: "5px" }} />
<HelpTip arrowDirection="right" position={[0, 10]} tipContent={<div><SvgIcon src="error" size={16} /> <span>help tip box support html</span></div>} /> {/* tipContent 支持 ReactNode */}
<HelpTip iconSize={["0.75rem", "0.75rem"]} position={[0, 10]} arrowDirection="left" tipContent={<span>you can set the size of the icon</span>} />
<HelpTip tipContent="配置 hideArrow 可以将箭头隐藏掉" hideArrow />
```

