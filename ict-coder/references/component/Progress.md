# Progress
> id: string | component: "Progress" | props: object

## props (required: `percent`)
- `percent`: number | DataBinding — percentage
- `showInfo?`: boolean
- `status?`: "success" | "exception" | "normal" | "active"
- `strokeColor?`: string
- `size?`: "medium" | "small"
- `className?`: string — Tailwind CSS classes for the component.

------

# Progress 示例

## Example: Progress basic

```json

{
	"id": "ProgressCompletion",
	"component": "Progress",
	"props": {
		"percent": 80,
		"status": "success",
		"size": "medium",
		"strokeColor": "#87d068"
	}
},

```
