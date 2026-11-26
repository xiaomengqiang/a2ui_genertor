# Carousel 走马灯

> 分类：数据展示

轮播组件，用于循环展示一系列内容，支持自动播放、拖拽切换、箭头导航和指示点切换。鼠标悬停时暂停自动播放，移出后恢复。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Carousel` | `Carousel` | `autoplay` 同名；`autoplaySpeed`→**`autoplayInterval`**（默认 3000）；`dots`/`beforeChange`/`afterChange` 无对应；`easing`→`transformTime` |


## API

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 设置 Carousel 的 id | string | 自动生成 |
| className | 通过添加类的方式控制整个 Carousel 的样式（控制最外层 div），可控制 margin、padding 等 | string |  |
| style | 通过添加 style 的方式控制整个 Carousel 的样式（控制最外层 div），可控制 margin、padding 等，例如：`style={{ margin: '0px' }}` | object |  |
| autoplay | 通过设置 autoplay 来控制 Carousel 是否自动播放 | boolean | false |
| autoplayInterval | 通过设置 autoplayInterval 来控制自动播放的时间间隔（单位：毫秒） | number | 3000 |
| direction | 通过设置 direction 决定轮播的方向，可选值：`'top'` `'right'` `'bottom'` `'left'` | string | `'right'` |
| axis | 通过设置 axis 决定轮播的水平垂直方向，可选值：`'horizontal'` `'vertical'` | string | `'horizontal'` |
| transformTime | 通过设置 transformTime 控制动画过渡时间（单位：毫秒） | number | 350 |
| children | 轮播子元素，可直接使用 `<img>` 或 `<Carousel.Item>` 包裹自定义内容 | React.ReactNode |  |

### Carousel.Item

使用 `Carousel.Item` 可以在轮播项中自定义内容（如添加文字说明等）。

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| children | 自定义轮播项内容 | React.ReactNode |  |

## 交互行为

- **自动播放**：设置 `autoplay` 为 `true` 后，按 `autoplayInterval` 间隔自动切换
- **鼠标悬停**：鼠标移入 Carousel 区域时暂停自动播放，移出后恢复
- **箭头导航**：水平方向显示左右箭头，垂直方向显示上下箭头，点击切换轮播
- **指示点导航**：底部（水平方向）或右侧（垂直方向）显示指示点，点击可跳转到对应轮播项
- **拖拽切换**：支持拖拽轮播内容区域切换轮播项

## 使用示例

### 基本使用

基本使用、自动播放与垂直方向

```jsx
import Carousel from "eview-ui/Carousel";

const pic1 = "pic1-url"; // 图片 url
const pic2 = "pic2-url";
const pic3 = "pic3-url";
const pic4 = "pic4-url";

// 基本：children 直接用 <img>
<Carousel>
  <img src={pic1} />
  <img src={pic2} />
  <img src={pic3} />
  <img src={pic4} />
</Carousel>

// 自动播放：autoplay + autoplayInterval（ms，默认 3000）+ transformTime（过渡 ms，默认 350）
<Carousel autoplay autoplayInterval={3000} transformTime={600}>
  <img src={pic1} />
  <img src={pic2} />
  <img src={pic3} />
  <img src={pic4} />
</Carousel>

// 垂直方向：axis="vertical"
<Carousel autoplay autoplayInterval={3000} transformTime={600} axis="vertical">
  <img src={pic2} />
  <img src={pic3} />
  <img src={pic4} />
</Carousel>
```

### 自定义内容

使用 `Carousel.Item` 可以在轮播项中自定义内容，如图片叠加文字说明

```jsx
import Carousel from "eview-ui/Carousel";

const pic1 = "pic1-url"; // 图片 url
const pic2 = "pic2-url";
const pic3 = "pic3-url";

const captionStyle = {
  position: "absolute",
  bottom: "0",
  width: "100%",
  padding: "30px 0",
  color: "#fff",
};

// Carousel.Item：在轮播项中自定义内容（图片叠加文字说明等）
<Carousel style={{ width: "500px", height: "300px" }}>
  <Carousel.Item>
    <img src={pic1} />
    <div style={captionStyle}>
      <h3>First slide label</h3>
      <p>说明文字</p>
    </div>
  </Carousel.Item>
  <Carousel.Item>
    <img src={pic2} />
    <div style={captionStyle}>
      <h3>Second slide label</h3>
      <p>说明文字</p>
    </div>
  </Carousel.Item>
  <Carousel.Item>
    <img src={pic3} />
    <div style={captionStyle}>
      <h3>Third slide label</h3>
      <p>说明文字</p>
    </div>
  </Carousel.Item>
</Carousel>
```

### 指定轮播方向

通过 `direction` 控制轮播切换方向，`right` 为从右向左，`left` 为从左向右

```jsx
import Carousel from "eview-ui/Carousel";

const pic1 = "pic1-url"; // 图片 url
const pic2 = "pic2-url";
const pic3 = "pic3-url";

// direction 控制切换方向：right（默认，从右向左）/ left（从左向右）/ top / bottom
<Carousel autoplay autoplayInterval={3000} direction="left">
  <img src={pic1} />
  <img src={pic2} />
  <img src={pic3} />
</Carousel>
```

