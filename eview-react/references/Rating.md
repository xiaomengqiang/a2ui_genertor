# Rating 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Rating/Rating`；官网组件页 Rating 及示例 `RatingBasic.jsx` / `RatingHalf.jsx` / `RatingDisabled.jsx` / `RatingSize.jsx` / `RatingCustomIcon.jsx`
>
> ⚠️ 取值回调是 **`onClick(value)`**，没有 `onChange`；悬浮预览靠 `onMouseOver(value)` / `onMouseLeave(value)` 自己写回 state（demo `RatingHalf.jsx`）。

## 1. 功能定位

Rating 是星级评分：展示评价或快速评级，支持半星、只读、尺寸、自定义图标与颜色。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 用户打分（可交互） | `Rating` + `onClick` | antd `Rate` + `onChange` |
| 只展示分数 | `Rating disabled` | 手写星星 |
| 满意度 / 优先级五档 | `Rating starCount={5}` | RadioGroup |
| 非星形（心形 / 自定义） | `iconName="ict_heart"` | 换组件 |

## 2. 典型场景

- 评价表单：点击打分，`half` 允许半星，提交时校验必须 > 0
- 列表 / 卡片里的评分展示：`disabled` 只读 + 旁边文字显示数值
- 悬浮预览：鼠标划过时实时显示将要选择的分数，移出恢复已选值
- 优先级选择：`starCount={3}`，`iconName` 换成旗子 / 火焰等图标

## 3. 状态声明

```tsx
// 已提交 / 已选择的分值
const [score, setScore] = useState<number>(0);

// 悬浮预览值：为 null 时显示 score（demo 直接把 onMouseOver 的值写进同一个 state，也可分开存）
const [hoverScore, setHoverScore] = useState<number | null>(null);
```

## 4. 事件与交互逻辑

### onClick(value) 才是取值；onMouseOver / onMouseLeave 做预览

```tsx
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
<Rating iconName="ict_heart" starColor="#f43146" value={likes} starCount={5} />
```

## 5. 数据结构

```tsx
interface ReviewForm {
  score: number;      // 0 表示未评分；half 时可为 x.5
  comment: string;    // TextArea
}
```

## 6. 联动说明

- `score === 0` → 提交按钮 `disabled`，提示"请先评分"
- 分值区间 → 联动文案（1-2 分"不满意"，3 分"一般"，4-5 分"满意"）或联动是否必填评论
- 提交成功 → `disabled` 切为只读态展示
- 列表展示用 `disabled`，避免误触改分

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import Rating from '@nce/eview-react/Rating';
import TextArea from '@nce/eview-react/TextArea';
import Button from '@nce/eview-react/Button';

interface ReviewForm {
  score: number;
  comment: string;
}

const SCORE_TEXT = (s: number): string => (s === 0 ? '请评分' : s <= 2 ? '不满意' : s <= 3 ? '一般' : '满意');

// 服务评价：半星打分 + 悬浮预览 + 低分必填评论 + 提交后只读
export default function ReviewPanel() {
  const [form, setForm] = useState<ReviewForm>({ score: 0, comment: '' });
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const shown = hoverScore ?? form.score;
  const needComment = form.score > 0 && form.score <= 2;                  // 低分必须填原因
  const canSubmit = form.score > 0 && (!needComment || form.comment.trim().length >= 5) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: 420, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Rating
          value={shown}
          half
          size={28}
          disabled={submitted}
          onClick={(value: number) => setForm((prev) => ({ ...prev, score: value }))}
          onMouseOver={(value: number) => setHoverScore(value)}
          onMouseLeave={() => setHoverScore(null)}
          onKeyDown={(value: number) => setForm((prev) => ({ ...prev, score: value }))}
        />
        <span>{shown > 0 ? `${shown.toFixed(1)} 分 · ` : ''}{SCORE_TEXT(shown)}</span>
      </div>

      {!submitted ? (
        <>
          <TextArea
            label="评价"
            placeholder={needComment ? '低分请说明原因（至少 5 字）' : '选填'}
            required={needComment}
            rows={3}
            maxLength={200}
            value={form.comment}
            onChange={(targetValue: string) => setForm((prev) => ({ ...prev, comment: targetValue }))}
          />
          <div>
            <Button status="primary" text={submitting ? '提交中...' : '提交评价'} disabled={!canSubmit} onClick={handleSubmit} />
          </div>
        </>
      ) : (
        <div style={{ color: '#2da769' }}>感谢评价</div>
      )}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：eview Rating 没有 onChange / allowHalf / count / character / allowClear
<Rate allowHalf count={5} onChange={setScore} allowClear character={<Icon />} />

// ❌ 用 onChange 接取值，永远收不到回调（应为 onClick）
<Rating value={score} onChange={(v) => setScore(v)} />

// ❌ 悬浮预览直接改正式分值，移出后分值被污染
<Rating value={score} onMouseOver={(v) => setScore(v)} />

// ❌ 列表展示不加 disabled，用户误触就改了分
<Rating value={item.score} />

// ❌ 未评分（0 分）也允许提交
<Button text="提交" onClick={submit} />
```

## 9. API 速查

> 压缩自 `Rating/Rating`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `value` | `number`，默认 `0` | 绑定值 |
| `starCount` | `number`，默认 `5` | 星总数 |
| `half` | `boolean`，默认 `false` | 允许半星 |
| `disabled` | `boolean`，默认 `false` | 只读，无法交互 |
| `size` | `number`，默认 `16` | 图标大小 |
| `starColor` | `string`，默认 `'#eeba18'` | 选中颜色 |
| `iconName` / `iconProps` | `string` / `{ color, hoverColor, disabledColor }` | 用组件库图标替换星形及其颜色 |
| `onClick` | `(value: number) => void` | **取值回调** |
| `onMouseOver` / `onMouseLeave` | `(value: number) => void` | 悬浮预览 / 移出 |
| `onKeyDown` | `(value: number) => void` | 键盘选择 |
| `id` / `className` | — | 最外层 |
