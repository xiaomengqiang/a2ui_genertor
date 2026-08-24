# Button
> id: string | component: "Button" | props: object

## props
- `value?`: string | DataBinding — Button text
- `color?`: "default" | "primary" | "danger"
- `types?`: "link" | "default" (default: "default") — Selection of Button Type.
- `size?`: "large" | "medium" | "small"
- `icon?`: string | DataBinding — Valid kebab-case Lucide icon matching the context (e.g., 'chevron-right').
- `iconPlacement?`: "start" | "end"
- `shape?`: "default" | "circle" | "round"
- `disabled?`: boolean
- `onClick?`: Action — Fires when the button is clicked. Typically a setState action.
- `className?`: string — Tailwind CSS classes for the component. To specify the button color, use the color property instead (default | primary | danger).

------

# Button 按钮使用规范

用于触发即时操作；`types=link` 用于文字链接。

## 使用规则

- 使用 `value` 设置按钮文字。
- 普通操作使用 `types=default`；表格行内操作、上下文跳转或下载入口使用 `types=link`。
- 主操作使用 `color=primary`，每个操作区域最多一个；中性或次要操作使用 `color=default`。
- 删除、停用、清空等破坏性操作使用 `color=danger`，并配合确认。
- 常规页面使用 `size=medium`；低密度强调场景使用 `size=large`；表格和紧凑区域使用 `size=small`。
- 同一操作组内按钮尺寸保持一致。
- 同一操作组内按钮结构保持一致：统一使用纯文字、纯图标或图标加文字。
- `shape=circle` 仅用于含义明确的纯图标操作，并提供 Tooltip 或无障碍名称；`shape=round` 仅在产品规范明确要求时使用。

### 文字链接

- 文字链接文案应说明目标或动作；正文中的链接与上下文字号一致，表格中的链接与表格文字一致。
- 需要图标帮助识别时使用 `icon`，并通过 `iconPlacement=start | end` 确定位置；无必要时只用文字。
- 正文链接应放在能说明其含义的句子或段落中；表格行内操作可以独立使用。
- 不要手动覆盖组件的颜色或样式。

## 布局

- 表单、内容容器底部的按钮组通常靠右。
- 按钮从左到右排列：更多操作、次要操作、取消或返回、主操作。
- 按钮与文字链接文案保持单行。

## Don't

- 不要使用开发组件不存在的属性或枚举值。
- 不要手动覆盖按钮或文字链接的颜色、圆角、高度和下划线。
- 不要用 `types=link` 承担保存、提交、新建等主操作。
- 不要用 Button 代替 Checkbox、Radio、Switch 或 Tag。

------

# Button | 按钮 示例

## Example: Button value path and color

```json
{
	"state": {
		"username": "xiaowang"
	},
	"rootId": "buttonUserName",
	"elements": [
		{
			"id": "buttonUserName",
			"component": "Button",
			"props": {
				"value": {
					"path": "/username"
				},
				"color": "primary"
			}
		}
	]
}
```

## Example: Button icon

```json
 {
	"id": "searchIconButton",
	"component": "Button",
	"props": {
		"icon": "search"
	}
},
```

## Example: Button value with icon

```json
{
	"id": "addUserButton",
	"component": "Button",
	"props": {
		"value": "添加用户",
		"icon": "user-plus",
		"iconPlacement": "start"
	}
}
```


## Example: Link Button 

```json
 {
	"id": "linkButton",
	"component": "Button",
	"props": {
		"value": "添加用户",
		"types": "link"
	}
}
```

## Example: Button onClick event

```json
{
	"id": "toggleBtn",
	"component": "Button",
	"props": {
		"value": "展开详情",
		"color": "primary",
		"onClick": {
			"action": "setState",
			"args": { "path": "/isDetailOpen", "value": true }
		}
	}
}
```
