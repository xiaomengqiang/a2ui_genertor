# Shade 阴影

> 分类：其他

为组件添加阴影。

## API

### 属性

| 属性名称  | 描述                 | 输入                                       | 默认  |
| :-------- | :------------------- | :----------------------------------------- | :---- |
| id        | 指定阴影的id         | string                                     |       |
| className | 指定类名提到阴影     | string                                     |       |
| width     | 设置阴影的宽度       | union:<br>&nbsp;string<br>&nbsp;number<br> | 100%  |
| height    | 设置阴影的高度       | union:<br>&nbsp;string<br>&nbsp;number<br> | 100%  |
| position  | 阴影的布局方式       | string                                     | fixed |
| left      | 阴影距元素的左边距离 | union:<br>&nbsp;string<br>&nbsp;number<br> | 0     |
| top       | 阴影距元素的顶边距离 | union:<br>&nbsp;string<br>&nbsp;number<br> | 0     |
| isShow    | 是否显示阴影         | bool                                       | true  |

## 使用示例

### 基本属性设置

```jsx
import Shade from "eview-ui/Shade";

// position="relative"：以父组件为基准；"absolute"：以 DOM 根为基准；"fixed"：以视口为基准
<Shade isShow={true} width="80%" height="100%" position="relative">
  <div>{/* shade 内部子组件内容 */}</div>
</Shade>
```