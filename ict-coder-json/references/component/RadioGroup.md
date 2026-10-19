# RadioGroup
> id: string | component: "RadioGroup" | props: object

## props (required: `value`, `options`)
- `value`: string | DataBinding — Used to set the selected value.
- `options`: any[] | DataBinding — Semantic radio options.
- `orientation?`: "horizontal" | "vertical"
- `className?`: string — Tailwind CSS classes for the component.
- `size?`: "large" | "medium" | "small"

------

# RadioGroup 单选框使用规范

用于从少量互斥选项中选择一项。

## 使用规则

- 必须设置当前 `value` 和 `options`；有安全默认值时提供默认选中项。
- 选项短且数量少时使用 `orientation=horizontal`；标签长或需要说明时使用 `orientation=vertical`。
- 常规页面使用 `size=medium`；同组 RadioGroup 尺寸一致。
- 单选组必须有组标题或上下文，选项文案保持同一维度。

## Don't

- 不要用于多选；使用 CheckboxGroup。
- 不要用于长列表；使用 Select。
- 不要使用开发组件不存在的属性或枚举值。

------

# RadioGroup | 单选组 示例

## Example: RadioGroup basic

```json
{
	"state": {
		"payValue": "monthly",
		"payOptions": [
			{
				"label": "按周",
				"value": "weekly"
			},
			{
				"label": "按月",
				"value": "monthly"
			},
			{
				"label": "按年",
				"value": "yearly"
			}
		]
	},
	"rootId": "payment",
	"elements": [
		{
			"id": "payment",
			"component": "RadioGroup",
			"props": {
				"value": {
					"path": "/payValue"
				},
				"options": {
					"path": "/payOptions"
				}
			}
		}
	]
}
```
