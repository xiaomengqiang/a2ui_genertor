# Divider
> Used to separate the contents
> id: string | component: "Divider" | props: object

## props
- `value?`: string | DataBinding | SlotNode — Content of the dividing line. Can be raw literal text OR a structural node reference.
- `orientation?`: string
- `size?`: "large" | "medium" | "small"
- `titlePlacement?`: "start" | "end" | "center"
- `variant?`: "dashed" | "dotted" | "solid"
- `className?`: string — Tailwind CSS classes for the component.

## 设计规范

# Divider 分割线使用规范

用于分隔存在明确结构关系的内容区域。

## 使用规则

- 默认使用 `orientation=horizontal`；并排区域或工具项之间使用竖向分隔。
- 分隔线上需要文字时使用 `value`，并通过 `titlePlacement=start | center | end` 设置位置；无标题时不要设置。
- 线型只使用 `variant=solid | dashed | dotted`；具体粗细使用组件 `size`，不要用自定义样式覆盖。

## 布局

- 分割线与所分隔内容对齐，不穿过文字、图标或操作区。
- 优先使用间距和背景层级组织内容，只在边界需要明确时增加分割线。

## Don't

- 不要用分割线装饰页面或包围内容。
- 不要用告警色虚线表达普通分隔。
- 不要硬编码虚线段长和间隔；使用组件默认样式。
- 不要使用开发组件不存在的属性或枚举值。


## 示例

# Divider

### Example: Divider value

```json
{
	"state": {
		"dividerText": "split line"
	},
	"rootId": "dividerLine",
	"elements": [
		{
			"id": "dividerLine",
			"component": "Divider",
			"props": {
				"value": {
					"path": "/dividerText"
				}
			}
		}
	]
}
```

