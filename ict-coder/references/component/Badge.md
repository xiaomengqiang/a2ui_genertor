# Badge
> id: string | component: "Badge" | props: object | children: object

## props (required: `count`)
- `color?`: string
- `count`: string | number | DataBinding — Displayed content
- `dot?`: boolean
- `offset?`: number[] — Position offset for the status point. Must be an array of two numbers: [x, y].
- `overflowCount?`: number
- `showZero?`: boolean
- `status?`: "success" | "processing" | "default" | "error" | "warning"
- `className?`: string — Tailwind CSS classes for the component.

## children
类型: string[]
> The element to be wrapped by the Badge. A static list of child component IDs. Note: The node ID count must be exactly 1;

## 设计规范

# Badge 徽标使用规范

用于依附在图标、头像或文字上的通知点和数量提示。

## 使用规则

- 必须设置 `count`；只表达“有新内容”时使用 `dot=true`，表达数量时显示 `count`。
- 数量超过展示上限时设置 `overflowCount`；只有业务需要显示 0 时才使用 `showZero=true`。
- 有明确状态时使用 `status=success | processing | default | error | warning`，不要用任意 `color` 替代语义状态。
- 默认放在锚点右上角；仅在遮挡锚点时使用 `offset=[x, y]` 微调。

## 布局

- Badge 必须依附明确锚点，不单独占据内容区域。
- 同组 Badge 的位置与上限规则保持一致。

## Don't

- 不要在 Table 内使用 Badge。
- 不要用 Badge 表达分类或普通状态；此类信息使用 Tag。
- 不要让 Badge 抢过锚点本身的视觉权重。


## 示例

# Badge

### Example: Badge basic

```json
{
	"state": {
		"favourableComment": 50
	},
	"rootId": "favourable",
	"elements": [
		{
			"id": "favourable",
			"component": "Badge",
			"props": {
				"count": {
					"path": "/favourableComment"
				},
				"overflowCount": 99
			},
			"children": ["goodReview"]
		},
		{
			"id": "goodReview",
			"component": "Button",
			"props": { "value": "好评数" }
		}
	]
}
```

