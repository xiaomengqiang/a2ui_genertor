# Collapse
> id: string | component: "Collapse" | props: object | children: object

## props (required: `activeKey`)
- `activeKey`: string | DataBinding — Key of the active panel
- `accordion?`: boolean
- `expandIcon?`: string — Expand icon for the Collapse (Lucide icon name in kebab-case, e.g., 'chevron-down').
- `expandIconPlacement?`: "start" | "end"
- `size?`: "large" | "medium" | "small"
- `className?`: string — Tailwind CSS classes for the component.

## children
类型: StaticChildren | TemplateChildren
> Child nodes must be CollapseItem components. If using template loop format, the path must point to a collapseItems data array.

## 设计规范

# Collapse 折叠面板使用规范

用于收纳可独立展开或隐藏的次级内容。

## 使用规则

- 使用 `activeKey` 指定当前展开项；仅允许同时展开一项时使用 `accordion=true`。
- 默认展开图标使用组件样式；只有产品已有统一图标规范时才设置 `expandIcon`，并通过 `expandIconPlacement=start | end` 确定位置。
- 每个 CollapseItem 必须设置唯一 `key`；标题使用 `label`，正文使用 `content`，标题右侧辅助操作使用 `extra`。
- 表格、表单可放在面板内容区，但不能破坏其自身结构和操作规则。
- 常规页面使用 `size=medium`；同组面板尺寸保持一致。

## 布局

- 点击标题栏展开或收起，展开后的高度由内容决定。
- 同组标题、展开图标和辅助操作位置保持一致。
- 内容区与标题栏保持清楚层级，避免在 Collapse 内继续多层嵌套 Collapse。

## Don't

- 不要折叠用户完成当前任务必须持续查看的核心内容。
- 不要把主要操作只放进默认收起的面板。
- 不要让标题栏辅助操作与展开点击产生冲突。
- 不要使用开发组件不存在的属性或枚举值。


## 示例

# Collapse

## Usage constraints for child node ids

- Each child node id must be owned by exactly one parent component and one child or slot position.
- Do not reuse the same node id in multiple `children` arrays or multiple `{ "componentId": "..." }` slot/template references.
- Do not reuse a loop template `componentId` as another static child or as another parent's template.
- If two structures look similar, create separate child nodes such as `projectOverviewPanel` and `userOverviewPanel` instead of sharing `overviewPanel`.
- Component-specific keys such as `props.key` can reuse the same semantic value in different components, but the node `id` must still be unique per usage.

### Example: Demonstrating the Component Composition between Collapse and CollapseItem, featuring Slot Syntax for flexible content distribution within individual items.

```json
{
  "state": {
    "activeKey": ["resetPassword"],
    "faqList": [
      {
        "id": "resetPassword",
        "question": "如何重置密码？",
        "anwser": "在登录页面点击忘记密码，按提示操作即可重置"
      },
      {
        "id": "contactCustomerService",
        "label": "如何联系客服？",
        "content": "您可以通过在线客服或拨打客服热线400-xxx-xxxx"
      },
      {
        "id": "viewOrder",
        "label": "如何查看订单？",
        "content": "登录后进入个人中心查看订单详情"
      }
    ]
  },
  "rootId": "collapseFaq",
  "elements": [
    {
      "id": "collapseFaq",
      "component": "Collapse",
      "props": {
        "activeKey": { "path": "/activeKey" },
      },
      "children": {
        "path": "/faqList",
        "componentId": "faqItem"
    	}
    },
    {
      "id": "faqItem",
      "component": "CollapseItem",
      "props": {
        "key": { "path": "id" },
        "label": { "path": "label" },
        "content": { "componentId": "collapseContent" }
      }
    },
    {
      "id": "collapseContent",
      "component": "div",
      "props": { "className": "p-4", "value": { "path": "content" } }
    }
  ]
}

```

### Example: Applicable to asymmetric attribute structures, not applicable to loops, and tiles all items. Slot Syntax (`componentId`) works in static tiling mode too, enabling complex component composition.

```json	
{
  "id": "userGuide",
  "component": "Collapse",
  "props": {
    "activeKey": { "value": "first" },
    "size": "large",
    "expandIcon": "chevron-down",
    "expandIconPlacement": "end",
    "accordion": true,
  },
  "children": ["first", "second", "third"]
},
{
  "id": "first",
  "component": "CollapseItem",
  "props": {
    "key": "first",
    "label": "第一步：注册账号",
    "content": { "componentId": "firstContent" },
    "extra": {"componentId": "tips"}
  }
},
{
  "id": "second",
  "component": "CollapseItem",
  "props": {
    "key": "second",
    "label": "第二步：完善资料",
    "content": "在个人中心完善个人资料信息"
  }
},
{
  "id": "third",
  "component": "CollapseItem",
  "props": {
    "key": "third",
    "label": "第三步：开始使用",
    "content": "完成以上步骤后即可开始使用系统功能"
  }
},
{
  "id": "tips",
  "component": "Icon",
  "props": { "name": "circle-question-mark" }
},
{
  "id": "firstContent",
  "component": "div",
  "props": { "className": "flex flex-col gap-2 p-4" },
  "children": ["firstTitle", "firstTips"]
},
{
  "id": "firstTitle",
  "component": "span",
  "props": { "className": "font-semibold text-slate-800", "value": "点击注册按钮，填写相关信息完成账号注册" }
},
{
  "id": "firstTips",
  "component": "span",
  "props": { "className": "text-sm text-slate-500", "value": "密码需要含有大小写字母 + 数字 + 符号，且密码长度大于8位" }
}

```
