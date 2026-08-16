# CheckboxGroup
> id: string | component: "CheckboxGroup" | props: object

## props (required: `value`, `options`)
- `value`: any[] | DataBinding — Used to set the selected value.
- `options`: any[] | DataBinding — Semantic checkbox options.
- `disabled?`: boolean | DataBinding — Determines if the checkbox is disabled.
- `indeterminate?`: boolean | DataBinding — Determines if the checkbox is indeterminate.
- `className?`: string — Tailwind CSS classes for the component.

## 示例

# CheckboxGroup | 复选框组

### Example: CheckboxGroup basic

```json
{
	"state": {
		"checkboxValue": ["yellow", "blue"],
		"checkboxOptions": [
			{
				"label": "红色",
				"value": "red"
			},
			{
				"label": "黄色",
				"value": "yellow"
			},
			{
				"label": "蓝色",
				"value": "blue"
			}
		]
	},
	"rootId": "colorPickerSection",
	"elements": [
		{
			"id": "colorPickerSection",
			"component": "CheckboxGroup",
			"props": {
				"value": {
					"path": "/checkboxValue"
				},
				"options": {
					"path": "/checkboxOptions"
				}
			}
		}
	]
}
```

