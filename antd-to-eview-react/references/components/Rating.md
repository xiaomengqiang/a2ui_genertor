# Rating 组件功能逻辑规格

> 资料来源：TypeDoc `Rating/Rating` + 官网 Rating 页示例。
> ⚠️ 取值回调是 **`onClick(value)`**，没有 `onChange`；悬浮预览靠 `onMouseOver(value)` / `onMouseLeave(value)` 自己写回 state（demo `RatingHalf.jsx`），`value` 用 `hoverScore ?? score` 切换显示。

## 1. 功能定位

Rating 是星级评分：展示评价或快速评级，支持半星、只读、尺寸、自定义图标与颜色。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 用户打分（可交互） | `Rating` + `onClick` | antd `Rate` + `onChange` |
| 只展示分数 | `Rating disabled` | 手写星星 |
| 满意度 / 优先级五档 | `Rating starCount={5}` | RadioGroup |
| 非星形（心形 / 自定义） | `iconName={<IconPlusIcPublicHeart />}` | 换组件 |

## 2. 事件与交互逻辑

### onClick(value) 才是取值；onMouseOver / onMouseLeave 做预览

```tsx
const [score, setScore] = useState<number>(0);
const [hoverScore, setHoverScore] = useState<number | null>(null);

<Rating
  value={hoverScore ?? score}
  half
  size={24}
  onClick={(value: number) => setScore(value)}          // 确认选择
  onMouseOver={(value: number) => setHoverScore(value)}  // 悬浮预览
  onMouseLeave={() => setHoverScore(null)}               // 移出恢复
  onKeyDown={(value: number) => setScore(value)}         // 键盘可达
/>
<span>{(hoverScore ?? score).toFixed(1)} 分</span>
```

### 只读展示

```tsx
<Rating value={item.score} disabled size={16} />
```

### 自定义图标与颜色

```tsx
import { IconPlusIcPublicHeart } from '@nce/icon-plus';
<Rating iconName={<IconPlusIcPublicHeart />} starColor="#f43146" value={likes} starCount={5} />
```

## 3. 联动说明

- `score === 0` → 提交按钮 `disabled`，提示"请先评分"；提交成功 → `disabled` 切为只读态展示
- 分值区间 → 联动文案（1-2 分"不满意"，3 分"一般"，4-5 分"满意"）或联动是否必填评论
- 列表展示用 `disabled`，避免误触改分

## 4. 反面示例

```tsx
// ❌ antd 习惯：eview Rating 没有 onChange / allowHalf / count / character / allowClear
<Rate allowHalf count={5} onChange={setScore} allowClear character={<IconPlusIcPublicXxx />} />

// ❌ 用 onChange 接取值，永远收不到回调（应为 onClick）
<Rating value={score} onChange={(v) => setScore(v)} />

// ❌ 悬浮预览直接改正式分值，移出后分值被污染
<Rating value={score} onMouseOver={(v) => setScore(v)} />

// ❌ 列表展示不加 disabled，用户误触就改了分
<Rating value={item.score} />

// ❌ 未评分（0 分）也允许提交
<Button text="提交" onClick={submit} />
```

## 5. API 速查

> 压缩自 `Rating/Rating`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `value` | `number`，默认 `0` | 绑定值 |
| `starCount` | `number`，默认 `5` | 星总数 |
| `half` | `boolean`，默认 `false` | 允许半星 |
| `disabled` | `boolean`，默认 `false` | 只读，无法交互 |
| `size` | `number`，默认 `16` | 图标大小 |
| `starColor` | `string`，默认 `'#eeba18'` | 选中颜色 |
| `iconName` / `iconProps` | `string \| ReactElement` / `{ color, hoverColor, disabledColor }` | 用 icon+ 组件（推荐）或组件库图标名替换星形及其颜色 |
| `onClick` | `(value: number) => void` | **取值回调** |
| `onMouseOver` / `onMouseLeave` | `(value: number) => void` | 悬浮预览 / 移出 |
| `onKeyDown` | `(value: number) => void` | 键盘选择 |
| `id` / `className` | — | 最外层 |
