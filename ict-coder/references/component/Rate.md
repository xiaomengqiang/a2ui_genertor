# Rate
> id: string | component: "Rate" | props: object

## props (required: `count`, `value`)
- `count`: number | DataBinding — Total number of stars.
- `value`: number | DataBinding — Current number of records.
- `allowClear?`: boolean
- `disabled?`: boolean
- `size?`: "small" | "medium" | "large"
- `className?`: string — Tailwind CSS classes for the component.

## 示例

# Rate | 评分

### Example: Rate basic

```json
{
	"state": {
		"judgement": 4,
		"total": 5
	},
	"rootId": "preferenceDegree",
	"elements": [
		{
			"id": "preferenceDegree",
			"component": "Rate",
			"props": {
				"value": {
					"path": "/judgement"
				},
				"count": {
					"path": "/total"
				},
				"size": "medium"
			}
		}
	]
}
```

