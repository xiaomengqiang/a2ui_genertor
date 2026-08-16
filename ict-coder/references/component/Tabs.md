# Tabs
> id: string | component: "Tabs" | props: object | children: object

## props (required: `activeKey`)
- `activeKey`: string | DataBinding — Current TabPane's key.
- `types?`: "line" | "card" | "separator" (default: "line") — Selection of Tabs Type.
- `maxVisible?`: number — Maximum number of visible tabs. Excess tabs are collapsed into a 'More' dropdown.
- `tabPlacement?`: "top" | "end" | "bottom" | "start"
- `className?`: string — Tailwind CSS classes for the component.
- `size?`: "large" | "medium" | "small"

## children
类型: StaticChildren | TemplateChildren
> Child nodes must be TabItem components. Any child node id must belong to exactly one parent and one child position; never reference the same node id from multiple parents or multiple positions. If using template loop format, the path must point to a tabItems data array and the template componentId must be dedicated to this Tabs instance.

## 设计规范

# Tabs 页签使用规范

用于同一上下文中同级内容的切换。

## 使用规则

- 必须设置当前 `activeKey`；每个 TabItem 必须设置唯一 `key`，标题使用 `label`，内容使用 `content`。
- 标准内容分区使用 `types=line`；面板内强分组使用 `types=card`；需要新增或关闭页签时使用 `types=editable-card`。
- 默认使用 `tabPlacement=top`；仅在内容结构明确需要时使用 `start | end | bottom`。
- 常规页面使用 `size=medium`；同组 Tabs 尺寸一致。
- 仅在图标有助于区分标签时设置 TabItem `icon`；标签保持短且同一命名维度。

## 布局

- Tabs 紧邻所控制的内容，当前项在组内最突出。
- 页签过多时使用组件溢出能力；需要多层导航时改用 Side Navigation 或内容分组。

## Don't

- 不要用 Tabs 表示步骤流程或跨模块导航。
- 不要混合同级和非同级内容。
- 不要写 Button/Segmented 等 Tabs API 不支持的类型。
- 不要连续堆叠多层 Tabs。


## 示例

# Tabs

## Usage constraints for child node ids

- Each child node id must be owned by exactly one parent component and one child or slot position.
- Do not reuse the same node id in multiple `children` arrays or multiple `{ "componentId": "..." }` slot/template references.
- Do not reuse a loop template `componentId` as another static child or as another parent's template.
- If two structures look similar, create separate child nodes such as `projectOverviewPanel` and `userOverviewPanel` instead of sharing `overviewPanel`.
- Component-specific keys such as `props.key` can reuse the same semantic value in different components, but the node `id` must still be unique per usage.

### Example: Demonstrating the Component Composition between Tabs and TabItem, featuring Slot Syntax for flexible content distribution within individual items.

```json
{
  "state": {
    "activeTab": "tab1",
    "rbacConfig": [
      { "id": "tab1", "label": "用户管理", "icon": "user", "content": "这是用户管理面板" },
      { "id": "tab2", "label": "角色管理", "icon": "team", "content": "这是角色管理面板" },
      { "id": "tab3", "label": "权限管理", "icon": "safety", "content": "这是权限管理面板" }
    ]
  },
  "rootId": "tabsContainer",
  "elements": [
    {
      "id": "tabsContainer",
      "component": "Tabs",
      "props": {
        "activeKey": { "path": "/activeTab" }
      },
      "children": {
        "path": "/rbacConfig",
        "componentId": "dynamicTabItem"
      }
    },
    {
      "id": "dynamicTabItem",
      "component": "TabItem",
      "props": {
        "key": { "path": "id" },
        "label": { "path": "label" },
        "icon": { "path": "icon" },
        "content": { "componentId": "tabContent" }
      }
    },
    {
      "id": "tabContent",
      "component": "div",
      "props": { "className": "p-4", "value": { "path": "content" } }
    }
  ]
}

```

### Example: Applicable to asymmetric attribute structures, not applicable to loops, and tiles all items. Slot Syntax (`componentId`) works in static tiling mode too, enabling complex component composition.

```json	
{
    "id": "design",
    "component": "Tabs",
    "props": { "activeKey": "ui" },
    "children": ["ui", "ux", "interaction"]
}, 
{
    "id": "ui",
    "component": "TabItem",
    "props": { "key": "ui", "label": "UI设计师", "icon": "building", "content": { "componentId": "uiContent" } }
},
{
    "id": "ux",
    "component": "TabItem",
    "props": { "key": "ux", "label": "UX设计师", "icon": "hand-platter", "content": { "componentId": "uxContent" } }
},
{
    "id": "interaction",
    "component": "TabItem",
    "props": { "key": "interaction", "label": "交互设计师", "content": "交互设计师专注于动态操作逻辑（点击、反馈）" }
},
{
    "id": "uiContent",
    "component": "div",
    "props": { "className": "flex flex-col gap-2 p-4" },
    "children": ["uiTitle", "uiDesc"]
},
{
    "id": "uiTitle",
    "component": "span",
    "props": { "className": "font-semibold text-slate-800", "value": "视觉美感专家" }
},
{
    "id": "uiDesc",
    "component": "span",
    "props": { "className": "text-sm text-slate-500", "value": "UI设计师专注视觉美感（布局、色彩、图标）" }
},
{
    "id": "uxContent",
    "component": "div",
    "props": { "className": "flex flex-col gap-2 p-4" },
    "children": ["uxTitle", "uxDesc"]
},
{
    "id": "uxTitle",
    "component": "span",
    "props": { "className": "font-semibold text-slate-800", "value": "用户体验策略师" }
},
{
    "id": "uxDesc",
    "component": "span",
    "props": { "className": "text-sm text-slate-500", "value": "UX设计师侧重用户体验策略（研究、流程、结构）" }
}

```

