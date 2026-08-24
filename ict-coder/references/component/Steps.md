# Steps
> id: string | component: "Steps" | props: object | children: object

## props (required: `current`)
- `current`: number | DataBinding — Specify the current step.
- `types?`: "default" | "dot" | "inline" | "navigation" | "panel" (default: "default") — Selection of Step Bar Type.
- `variant?`: "filled" | "outlined"
- `orientation?`: "horizontal" | "vertical"
- `status?`: "wait" | "process" | "finish" | "error"
- `size?`: "large" | "medium" | "small"
- `className?`: string — Tailwind CSS classes for the component.

## children
类型: StaticChildren | TemplateChildren
> Child nodes must be StepItem components. If using template loop format, the path must point to a stepItems data array.

------

# Steps 步骤条使用规范

用于表达有明确顺序的流程进度与阶段状态。

## 使用规则

- 标准流程使用 `types=default`；轻量进度使用 `types=dot`；紧凑流程使用 `types=inline`；支持步骤导航时使用 `types=navigation`；阶段面板使用 `types=panel`。
- 横向流程使用 `orientation=horizontal`；步骤多、标题长或需要说明时使用 `orientation=vertical`。
- 使用 `current` 指定当前步骤；整体异常使用 `status=error`，其他状态使用 `wait | process | finish`。
- 需要区分实心或描边节点时使用 `variant=filled | outlined`，同一流程保持一致。
- 常规页面使用 `size=medium`；紧凑场景使用 `size=small`；同组步骤条尺寸一致。
- 每个 StepItem 必须设置 `title`；补充说明使用 `content`，仅在图标能帮助识别时设置 `icon`。
- 错误步骤必须同时提供原因或下一步动作，不能只靠颜色表达。

## 布局

- 横向 Steps 不承载长文案；长说明放在步骤下方内容区。
- 当前步骤最突出，完成步骤不能比当前步骤更抢眼。
- 横向空间不足时改用纵向，不压缩步骤或截断关键信息。

## Don't

- 不要用 Steps 替代 Tabs 或普通导航。
- 不要把非线性状态强行组织成步骤。
- 不要在步骤节点内放复杂表单或图表。
- 不要使用开发组件不存在的属性或枚举值。

------

# Steps 示例

## Usage constraints for child node ids

- Each child node id must be owned by exactly one parent component and one child or slot position.
- Do not reuse the same node id in multiple `children` arrays or multiple `{ "componentId": "..." }` slot/template references.
- Do not reuse a loop template `componentId` as another static child or as another parent's template.
- If two structures look similar, create separate child nodes such as `projectOverviewPanel` and `userOverviewPanel` instead of sharing `overviewPanel`.
- Component-specific keys such as `props.key` can reuse the same semantic value in different components, but the node `id` must still be unique per usage.

## Steps Example: Demonstrating the Component Composition between Steps and StepItem, featuring Slot Syntax for flexible content distribution within individual items.

```json
{
	"state": {
		"currentStep": 1,
		"personalInfo": [
			{ "message": "基本信息", "information": "填写个人基本信息", "status": "finish","icon": "user" },
			{ "message": "教育经历", "information": "填写教育背景", "status": "process","icon": "graduation-cap" }
			{ "message": "工作经历", "information": "填写工作经历", "status": "wait","icon": "briefcase" }
			{ "message": "技能证书", "information": "上传技能证书", "status": "wait","icon": "award" }
		]
	},
	"rootId": "resume",
	"elements": [
		{
			"id": "resume",
			"component": "Steps",
			"props": { "current": { "path": "/currentStep" }, "types": "dot", "className": "mb-6" },
			"children": { "path": "/personalInfo", "componentId": "resumeStep" }
		},
		{
			"id": "resumeStep",
			"component": "StepItem",
			"props": { "title": { "path": "message" }, "content": { "componentId": "personalResume" }, "status": { "path": "status" }, "icon": { "path": "icon" } }
		},
		{
			"id": "personalResume",
			"component": "div",
			"props": { "className": "p-4", "value": { "path": "information" } }
		}
	]
}
```

## Example: Applicable to asymmetric attribute structures, not applicable to loops, and tiles all items.Slot Syntax (`componentId`) works in static tiling mode too, enabling complex component composition.

```json

{
	"id": "order",
	"component": "Steps",
	"props": { "current": 2,"types": "default","className": "mb-6" },
    "children": ["orderProgression1", "orderProgression2", "orderProgression3"]
},
{
	"id": "orderProgression1",
	"component": "StepItem",
	"props": { "title": "已下单","content": { "componentId": "information" },"status": "finish","icon": "shopping-cart" }
},
{
	"id": "orderProgression2",
	"component": "StepItem",
	"props": { "title": "已付款","content": "等待商家确认","icon": "credit-card" }
},
{
	"id": "orderProgression3",
	"component": "StepItem",
	"props": { "title": "已发货","status": "wait","icon": "package-plus" }
},
{
    "id": "information",
    "component": "span",
    "props": { "className": "font-semibold", "value": "订单已成功提交" }
}

```
