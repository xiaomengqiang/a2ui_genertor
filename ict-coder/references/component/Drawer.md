# Drawer
> id: string | component: "Drawer" | props: object | children: object

## props (required: `open`, `onClose`)
- `open`: DataBinding
- `onClose`: Action — Fires when the drawer requests to close. Typically a setState that writes false to the same path bound to `open`.
- `placement?`: "right" | "left" | "top" | "bottom" (default: "right")
- `mask?`: boolean (default: true)
- `title?`: string | DataBinding — Drawer header title.
- `footer?`: SlotNode — Footer content. Omit this prop when no footer is needed.
- `className?`: string — Tailwind CSS classes for the component.

## children
类型: StaticChildren
> The drawer body content.

## 设计规范

# Drawer 抽屉使用规范

用于从屏幕边缘滑出的面板，承载需要更多纵向空间的内容（详情、筛选、分步表单、多字段编辑等）。比 Modal 更适合信息量较大的场景。

## 使用规则

- `open` 必须绑定到一个布尔 state（如 `{ "path": "/isDrawerOpen" }`），由其他元素的事件来切换；禁止写死 `true`。
- `onClose` 必须配套设置，通常是一条 `setState`，把 `open` 绑定的同一 path 写回 `false`；该事件在点击遮罩、关闭图标或按 ESC 时触发。
- 使用 `placement` 指定滑出方向（`right` | `left` | `top` | `bottom`），默认 `right`；同一产品内同侧抽屉保持一致。
- 抽屉主体内容使用 `children`，不要为正文再单独定义 content 插槽。
- 底部操作区使用 `footer` 命名插槽，传入一个 `componentId`（通常是一个按钮组）；不需要底部时省略 `footer`，不要把操作按钮塞进 `children`。
- 默认 `mask: true`；仅在需要同时操作抽屉与底层页面时才设 `mask: false`。
- 标题使用 `title`；标题与触发该抽屉的动作保持同一语境。

## 布局

- Drawer 通过 portal 渲染在文档根节点，沿 `placement` 方向滑入，不参与页面 flex/grid 流式布局。
- 抽屉宽度/高度由其方向决定，主体内容纵向滚动；避免在抽屉内再嵌套复杂多栏布局。
- 底部按钮组靠右排列（`placement=top` 时可居中），主操作在最右。

## Don't

- 不要用 Drawer 承载强打断型的关键确认；强打断场景用 Modal。
- 不要同时打开多个 Drawer 形成级联；需要分步时在同一抽屉内切换内容。
- 不要在 `children` 和 `footer` 中放重复的操作入口；操作按钮统一放 `footer`。
- 不要臆造 API 未定义的属性（如 width、height、closable 等），需要时再补充。


## 示例

# Drawer

### Example: A detail drawer triggered by a button, sliding in from the right. `open` / `onClose` bind to the same shared boolean state, the body is a single wrapper node passed to `children`, and the footer is rendered via a SlotNode.

```json
{
  "state": {
    "isDetailDrawerOpen": false
  },
  "rootId": "demoRoot",
  "elements": [
    {
      "id": "demoRoot",
      "component": "div",
      "props": { "className": "p-inset" },
      "children": ["openBtn", "detailDrawer"]
    },
    {
      "id": "openBtn",
      "component": "Button",
      "props": {
        "value": "查看详情",
        "color": "primary",
        "onClick": {
          "action": "setState",
          "args": { "path": "/isDetailDrawerOpen", "value": true }
        }
      }
    },
    {
      "id": "detailDrawer",
      "component": "Drawer",
      "props": {
        "open": { "path": "/isDetailDrawerOpen" },
        "placement": "right",
        "title": "订单详情",
        "mask": true,
        "footer": { "componentId": "drawerFooter" },
        "onClose": {
          "action": "setState",
          "args": { "path": "/isDetailDrawerOpen", "value": false }
        }
      },
      "children": ["drawerBody"]
    },
    {
      "id": "drawerBody",
      "component": "div",
      "props": { "className": "flex flex-col gap-inline" },
      "children": ["bodyLabel", "bodyText"]
    },
    {
      "id": "bodyLabel",
      "component": "span",
      "props": { "className": "text-sm text-on-surface-variant", "value": "物流状态" }
    },
    {
      "id": "bodyText",
      "component": "span",
      "props": { "className": "text-sm text-on-surface", "value": "订单 SO-20260802-0042 已发货，预计明日送达。" }
    },
    {
      "id": "drawerFooter",
      "component": "div",
      "props": { "className": "flex justify-end gap-inline" },
      "children": ["cancelBtn", "applyBtn"]
    },
    {
      "id": "cancelBtn",
      "component": "Button",
      "props": {
        "value": "关闭",
        "onClick": {
          "action": "setState",
          "args": { "path": "/isDetailDrawerOpen", "value": false }
        }
      }
    },
    {
      "id": "applyBtn",
      "component": "Button",
      "props": {
        "value": "确认",
        "color": "primary",
        "onClick": {
          "action": "setState",
          "args": { "path": "/isDetailDrawerOpen", "value": false }
        }
      }
    }
  ]
}
```

### Example: Drawer element only, no footer (`footer` omitted). Body content is still a single wrapper node.

```json
{
  "id": "filterDrawer",
  "component": "Drawer",
  "props": {
    "open": { "path": "/isFilterDrawerOpen" },
    "placement": "left",
    "title": "筛选条件",
    "mask": true,
    "onClose": {
      "action": "setState",
      "args": { "path": "/isFilterDrawerOpen", "value": false }
    }
  },
  "children": ["filterBody"]
},
{
  "id": "filterBody",
  "component": "span",
  "props": { "className": "text-sm text-on-surface", "value": "在此放置筛选表单内容。" }
}
```

