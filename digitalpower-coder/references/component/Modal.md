# Modal
> id: string | component: "Modal" | props: object | children: object

## props (required: `open`, `onClose`)
- `open`: DataBinding
- `onClose`: Action — Fires when the modal requests to close. Typically a setState that writes false to the same path bound to `open`.
- `mask?`: boolean (default: true)
- `title?`: string | DataBinding — Modal header title.
- `footer?`: SlotNode — Footer content. Omit this prop when no footer is needed.
- `className?`: string — Tailwind CSS classes for the component.

## children
类型: StaticChildren
> The modal body content.

## 设计规范

# Modal 模态弹窗使用规范

用于在当前流程上方叠加一个需要用户主动关闭的对话框，承载强打断型操作或重要详情确认。

## 使用规则

- `open` 必须绑定到一个布尔 state（如 `{ "path": "/isModalOpen" }`），由其他元素的事件来切换；禁止写死 `true`。
- `onClose` 必须配套设置，通常是一条 `setState`，把 `open` 绑定的同一 path 写回 `false`；该事件在点击遮罩、关闭图标或按 ESC 时触发。
- 弹窗主体内容使用 `children`，不要为正文再单独定义 content 插槽。
- 底部操作区使用 `footer` 命名插槽，传入一个 `componentId`（通常是一个靠右排列的按钮组）；不需要底部时设 `footer: null`，不要把操作按钮塞进 `children`。
- 默认 `mask: true`；仅在非阻断的轻提示场景才设 `mask: false`。
- 标题使用 `title`；标题与触发该弹窗的动作保持同一动词语境（如“查看详情” → 标题“订单详情”）。

## 布局

- Modal 通过 portal 渲染在文档根节点，不参与页面 flex/grid 流式布局。
- 主体内容保持单一焦点，避免在弹窗内再堆叠复杂多栏布局；信息较多时改用抽屉或独立页面。
- 底部按钮组靠右排列，主操作在最右，顺序通常为：取消 / 次要操作 / 主操作。

## Don't

- 不要用 Modal 承载需要常驻或并行查看的内容；常驻内容用页面区域或抽屉。
- 不要让两个 Modal 同时打开承担同一流程；嵌套弹窗会破坏焦点与可达性。
- 不要在 `children` 和 `footer` 中放重复的操作入口；关闭/确认类按钮统一放 `footer`。
- 不要臆造 API 未定义的属性（如 width、centered 等），需要时再补充。


## 示例

# Modal

### Example: A detail modal triggered by a button. `open` / `onClose` bind to the same shared boolean state, the body is a single wrapper node passed to `children`, and the footer is rendered via a SlotNode.

```json
{
  "state": {
    "isDetailModalOpen": false
  },
  "rootId": "demoRoot",
  "elements": [
    {
      "id": "demoRoot",
      "component": "div",
      "props": { "className": "p-inset" },
      "children": ["openBtn", "detailModal"]
    },
    {
      "id": "openBtn",
      "component": "Button",
      "props": {
        "value": "查看详情",
        "color": "primary",
        "onClick": {
          "action": "setState",
          "args": { "path": "/isDetailModalOpen", "value": true }
        }
      }
    },
    {
      "id": "detailModal",
      "component": "Modal",
      "props": {
        "open": { "path": "/isDetailModalOpen" },
        "title": "订单详情",
        "mask": true,
        "footer": { "componentId": "modalFooter" },
        "onClose": {
          "action": "setState",
          "args": { "path": "/isDetailModalOpen", "value": false }
        }
      },
      "children": ["modalBody"]
    },
    {
      "id": "modalBody",
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
      "id": "modalFooter",
      "component": "div",
      "props": { "className": "flex justify-end gap-inline" },
      "children": ["cancelBtn", "confirmBtn"]
    },
    {
      "id": "cancelBtn",
      "component": "Button",
      "props": {
        "value": "关闭",
        "onClick": {
          "action": "setState",
          "args": { "path": "/isDetailModalOpen", "value": false }
        }
      }
    },
    {
      "id": "confirmBtn",
      "component": "Button",
      "props": {
        "value": "确认",
        "color": "primary",
        "onClick": {
          "action": "setState",
          "args": { "path": "/isDetailModalOpen", "value": false }
        }
      }
    }
  ]
}
```

### Example: Modal element only, no footer (`footer` omitted). Body content is still a single wrapper node.

```json
{
  "id": "deleteModal",
  "component": "Modal",
  "props": {
    "open": { "path": "/isDeleteModalOpen" },
    "title": "确认删除",
    "mask": true,
    "onClose": {
      "action": "setState",
      "args": { "path": "/isDeleteModalOpen", "value": false }
    }
  },
  "children": ["deleteBody"]
},
{
  "id": "deleteBody",
  "component": "span",
  "props": { "className": "text-sm text-on-surface", "value": "删除后不可恢复，确定要继续吗？" }
}
```

