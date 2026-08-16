# Timeline
> id: string | component: "Timeline" | props: object | children: object

## props
- `mode?`: "start" | "alternate" | "end"
- `orientation?`: "vertical" | "horizontal"
- `variant?`: "filled" | "outlined"
- `className?`: string — Tailwind CSS classes for the component.

## children
类型: StaticChildren | TemplateChildren
> Child nodes must be TimelineItem components. If using template loop format, the path must point to a TimelineItem data array.

## 设计规范

# Timeline 时间轴使用规范

用于按时间顺序展示事件、操作历史和状态流转。

## 使用规则

- 历史记录建议使用 `orientation=vertical`；短流程且横向空间充足时使用 `horizontal`。
- 内容在轴线同侧时使用 `mode=start | end`；需要交替排布时使用 `mode=alternate`。
- 节点样式通过 `variant=filled | outlined` 选择，同一时间轴保持一致。
- 每个 TimelineItem 必须设置 `title` 和 `content`；只有图标帮助识别时设置 `icon`。
- 仅在事件有明确状态语义时设置 `color`；内容位置通过 `placement=start | end` 设置。
- 时间格式保持一致，当前进行中节点清晰，历史节点适当弱化。

## 布局

- 时间、标题和说明对齐；长说明保持可读行宽，不挤压时间列。

## Don't

- 不要用于没有时间或顺序关系的列表。
- 不要为了装饰给每个节点使用不同颜色或图标。
- 不要只用颜色区分关键状态。
- 不要使用开发组件不存在的属性或枚举值。


## 示例

# Timeline

## Usage constraints for child node ids

- Each child node id must be owned by exactly one parent component and one child or slot position.
- Do not reuse the same node id in multiple `children` arrays or multiple `{ "componentId": "..." }` slot/template references.
- Do not reuse a loop template `componentId` as another static child or as another parent's template.
- If two structures look similar, create separate child nodes such as `projectOverviewPanel` and `userOverviewPanel` instead of sharing `overviewPanel`.
- Component-specific keys such as `props.key` can reuse the same semantic value in different components, but the node `id` must still be unique per usage.

### Example: Demonstrating the Component Composition between Timeline and TimelineItem, featuring Slot Syntax for flexible content distribution within individual items.

```json
{
	"state": {
		"progression": [
			{ "date": "2024-02-01", "projectInfo": "项目上线仪式", "icon": "rocket" },
			{ "date": "2023-12-15", "projectInfo": "完成核心功能开发", "icon": "code" }
			{ "date": "2023-12-01", "projectInfo": "项目启动会", "icon": "play" }
		]
	},
	"rootId": "projectShowcase",
	"elements": [
		{
			"id": "projectShowcase",
			"component": "Timeline",
			"props": { "orientation": "vertical" },
			"children": { "path": "/progression", "componentId": "projectStatus" }
		},
		{
			"id": "projectStatus",
			"component": "TimelineItem",
			"props": { "title": { "path": "date" }, "content": { "componentId": "progressInformation" }, "icon": { "path": "icon" } }
		},
		{
			"id": "progressInformation",
			"component": "div",
			"props": { "className": "p-4", "value": { "path": "projectInfo" } }
		}
	]
}
```

### Example: Applicable to asymmetric attribute structures, not applicable to loops, and tiles all items.Slot Syntax (`componentId`) works in static tiling mode too, enabling complex component composition.

```json
{
    "id": "order",
    "component": "Timeline",
    "props": { "orientation": "vertical" },
    "children": ["orderProgression1", "orderProgression2", "orderProgression3"]
},
{.
    "id": "orderProgression1",
    "component": "TimelineItem",
    "props": { "title": "2024-01-11 10:00","content": { "componentId": "information" }, "icon": "store" }
},
{
    "id": "orderProgression2",
    "component": "TimelineItem",
    "props": { "title": "2024-01-13 18:45","content": "已到达【北京朝阳区配送站】" }
},
{
    "id": "orderProgression3",
    "component": "TimelineItem",
    "props": { "title": "2024-01-15 14:30","content": "已签收，感谢您的购买", "icon": "check-circle" }
},
{
    "id": "information",
    "component": "span",
    "props": { "className": "font-semibold", "value": "商家已发货" }
}
```

