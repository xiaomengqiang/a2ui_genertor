# ScrollBar 滚动条

> 分类：其他

滚动条组件。

## API

### 属性

| 属性名称    | 描述                                                                                                                                                   | 输入     | 默认 |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :--- |
| style       | maxWidth: 550,// 配置组件需要水平滚动的的最大宽度. minWidth: 300, // 设置组件需要水平滚动的最小宽度. maxHeight: 200,//配置max组件需要垂直滚动条的高度. | shape    | {}   |
| children    | 滚动条的子组件                                                                                                                                         | node     | null |
| scrollEvent | 滚动后的回调函数                                                                                                                                       | function |      |
| scrollStep  | 设置滚动条单次滚动的步长                                                                                                                               | number   | 53   |

## 使用示例

### 基本属性设置

```jsx
import ScrollBar from "eview-ui/ScrollBar";

const scrollbarStyle = {
  maxWidth: 550, // 水平滚动最大宽度
  minWidth: 300,
  maxHeight: 200, // 垂直滚动最大高度
};

const block = { background: "#2196F3", width: "150px", height: "150px", display: "inline-block", margin: "15px" };

<ScrollBar style={scrollbarStyle} scrollEvent={(data) => { /* 滚动后回调 */ }}>
  <div className="scroll-content">
    <div style={block} />
    <div style={block} />
    <div style={block} />
  </div>
</ScrollBar>
```
