# Carousel 组件功能逻辑规格

> 资料来源：TypeDoc `Carousel/types` + 官网 Carousel 页示例。
> ⚠️ **导入名 `Carousel`**：`import Carousel from '@nce/eview-react/Carousel'`。
> ⚠️ 内容通过 **children** 直接放元素，迁移时直接保留元素子项即可。
> ⚠️ prop 改名：`autoplaySpeed`→`autoplayInterval`、`speed`→`transformTime`、`dots`→`indicator`、`arrows`→`hasArrows`、`afterChange`→`onChange(index)`、`infinite`→`repeat`；`initialSlide` 无对应（默认第 0 项）。

## 1. 功能定位

Carousel 在同一区域轮播图片、公告或其他同类内容，支持自动播放、指示器、箭头与垂直切换。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 公告 / 图片轮播 | `Carousel` + children | antd `dots` / `afterChange` / `arrows` |

## 2. 事件与交互逻辑

### 自动播放与切换通知

```tsx
const [index, setIndex] = useState(0);

<Carousel
  autoplay={items.length > 1}
  autoplayInterval={5000}
  repeat
  indicator
  hasArrows
  onChange={(nextIndex: number) => setIndex(nextIndex)}
>
  {items.map((item) => (
    <div key={item.id}>{item.title}</div>
  ))}
</Carousel>
```

- `onChange(index)` 用于更新旁边计数 / 标题；索引从 0 开始，越界时忽略（列表刷新后旧回调可能访问不存在的项）。
- 暂停只把 `autoplay` 置 `false`，不删当前内容；`autoplay` 默认值未注明，按场景显式设置。

## 3. 联动说明

- children 改变会重置到第 0 项并触发 `onChange(0)`；列表刷新后不要假定保留原位置。
- 当前条数用 `index + 1` 展示，访问数组仍用 `index`。
- loading / error / empty 在轮播外处理，空数组不要当作可自动播放的轮播。
- 各项保持统一高度，避免轮播时页面跳动。

## 4. 反面示例

```tsx
// ❌ 沿用 antd 属性名：应改为 autoplayInterval / transformTime / indicator / hasArrows / onChange / repeat
<Carousel autoplaySpeed={5000} speed={350} dots arrows afterChange={setIndex} infinite />

// ❌ 从空数组或过期索引直接读取标题
<h3>{items[index].title}</h3>
```

## 5. API 速查

> 压缩自 `Carousel/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `children` | `ReactNode`，**必填** | 幻灯片内容，直接放元素 |
| `autoplay` | `boolean` | 自动播放开关；默认值未注明，按场景显式设置 |
| `autoplayInterval` | `number`，默认 `3000` | 播放间隔，毫秒（antd `autoplaySpeed`） |
| `transformTime` | `number`，默认 `350` | 动画时间，毫秒（antd `speed`） |
| `axis` | `'horizontal' \| 'vertical'`，默认 `horizontal` | 水平 / 垂直切换 |
| `indicator` | `boolean`，默认 `true` | 指示器（antd `dots`） |
| `hasArrows` | `boolean`，默认 `true` | 左右箭头（antd `arrows`） |
| `repeat` / `allowTouch` | `boolean`，均默认 `true` | 重复播放（antd `infinite`）/ 手势拖动 |
| `onChange` / `onClick` | `(index: number) => void` | 切换后 / 点击切换通知；参数是索引（antd `afterChange`） |
| `id` / `className` / `style` | — | 最外层标识与样式 |
