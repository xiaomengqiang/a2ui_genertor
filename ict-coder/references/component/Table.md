# Table
> Declarative table component based on Antd Table variants.
> id: string | component: "Table" | props: object | children: object

## props (required: `rowKey`, `columns`, `dataSource`)
- `rowKey`: string — The field name in the row data to be used as the unique key.
- `columns`: { `title`: string, `dataIndex`: string, `align?`: "left" | "right" | "center", `className?`: string, `filters?`: object[], `fixed?`: "start" | "end" | boolean, `sort?`: boolean, `width?`: string | number, `minWidth?`: string | number }[] | DataBinding
- `dataSource`: DataBinding — Binding path to the table data source.
- `pagination?`: boolean (default: true) — Whether to display pagination at the bottom of the table. Defaults to true; set to false to hide pagination and show all rows at once. The LLM does not need to generate pagination UI itself — it is handled automatically by the component.
- `rowSelection?`:
  - `type?`: "checkbox" | "radio"
  - `selectedRowKeys?`: string[] | DataBinding
- `expandable?`: — Row expandable configuration.
  - `expandedRowKeys?`: string[] | DataBinding — Keys of rows that support expanding.
- `rowClassName?`: string
- `size?`: "large" | "medium" | "small"
- `className?`: string

## children
类型: TemplateChildren
> A template for generating a dynamic list of children from a data model list. The componentId must be a TableRow.

------

# Table 表格使用规范

用于密集、可比较、基于行的企业数据。

## 使用规则

- 必须设置唯一 `rowKey`、`dataSource` 和 `columns`；每列必须设置 `columns.title` 与 `columns.dataIndex`。
- 数字右对齐，短状态可居中，其余默认左对齐，通过 `columns.align=left | center | right` 设置。
- 仅冻结列设置 `columns.fixed=start | end` 和 `columns.width`；操作列可设置窄 `columns.width`；长文本列可设置 `columns.minWidth`，不要给所有列固定宽度。
- 需要列筛选或排序时使用 `columns.filters`、`columns.sort=true`，不要手画控件。
- 默认保留组件分页；仅需显示全部行时设置 `pagination=false`。
- 批量选择使用 `rowSelection.type=checkbox | radio`；展开行使用 `expandable.expandedRowKeys` 和 TableRow 的 `expandedRowRender`。
- 行内操作使用 `Button types=link`；状态使用文本、图标或 Tag，不使用 Badge。

## 布局

- Table 放在 `bg-surface-container-highest` 内，长文本截断并通过 Tooltip 或详情展示，保持行高一致。
- 同一表格中的普通文字使用统一的文字色 Token；仅链接、状态、告警和禁用内容使用对应语义色，不得按列或行随意改变文字颜色。
- 选中行后在表格工具区显示已选数量和可执行操作。

## Don't

- 不要手动画分页、复选列、排序或筛选。
- 不要把标准表格行做成 Card。
- 不要用固定宽度破坏表格自适应。
- 不要使用开发组件不存在的属性或枚举值。

------

# Table 示例

## Table Example: Multi-Column Rendering

```json
{
  "state": {
    "tableList": [
      { "id": "01", "name": "Node-Alpha", "type": "Compute", "statusIcon": "circle-check" },
      { "id": "02", "name": "Node-Beta", "type": "Storage", "statusIcon": "circle-x" }
    ]
  },
  "rootId": "multi_col_table",
  "elements": [
    {
      "id": "multi_col_table",
      "component": "Table",
      "props": {
        "rowKey": "id",
        "dataSource": { "path": "/tableList" },
        "columns": [
          { "title": "Device Name", "dataIndex": "name" },
          { "title": "Type", "dataIndex": "type" },
          { "title": "Status", "dataIndex": "status" },
          { "title": "Action", "dataIndex": "action", "width": 120 }
        ]
      },
      "children": {
        "path": "/tableList",
        "componentId": "multi_col_row"
      }
    },
    {
      "id": "multi_col_row",
      "component": "TableRow",
      "children": [
        "name_cell_comp",
        "type_cell_comp",
        "status_cell_comp",
        "action_cell_comp"
      ]
    },
    {
      "id": "name_cell_comp",
      "component": "span",
      "props": {
        "value": { "path": "name" }
      }
    },
    {
      "id": "type_cell_comp",
      "component": "Tag",
      "props": {
        "value": { "path": "type" },
        "variant": "outlined"
      }
    },
    {
      "id": "status_cell_comp",
      "component": "Icon",
      "props": {
        "name": { "path": "statusIcon" },
        "shape": "circle"
      }
    },
    {
      "id": "action_cell_comp",
      "component": "Button",
      "props": {
        "value": "Detail",
        "size": "small"
      }
    }
  ]
}
```

## Table Example: Selection with Multi-Column

```json
{
  "state": {
    "selectedKeys": ["01"],
    "tableList": [
      { "id": "01", "name": "Node-Alpha", "type": "Compute", "statusIcon": "circle-check" },
      { "id": "02", "name": "Node-Beta", "type": "Storage", "statusIcon": "circle-x" }
    ]
  },
  "rootId": "selection_multi_table",
  "elements": [
    {
      "id": "selection_multi_table",
      "component": "Table",
      "props": {
        "rowKey": "id",
        "dataSource": { "path": "/tableList" },
        "rowSelection": {
          "type": "checkbox",
          "selectedRowKeys": { "path": "/selectedKeys" }
        },
        "columns": [
          { "title": "Name", "dataIndex": "name" },
          { "title": "Type", "dataIndex": "type" },
          { "title": "Status", "dataIndex": "status" }
        ]
      },
      "children": {
        "path": "/tableList",
        "componentId": "selection_multi_row"
      }
    },
    {
      "id": "selection_multi_row",
      "component": "TableRow",
      "children": [
        "name_display",
        "type_display",
        "status_display"
      ]
    },
    {
      "id": "name_display",
      "component": "span",
      "props": {
        "value": { "path": "name" }
      }
    },
    {
      "id": "type_display",
      "component": "Tag",
      "props": {
        "value": { "path": "type" },
        "variant": "outlined"
      }
    },
    {
      "id": "status_display",
      "component": "Icon",
      "props": {
        "name": { "path": "statusIcon" },
        "shape": "circle"
      }
    }
  ]
}
```

## Table Example: Expandable Row with Sub-Table

```json
{
  "state": {
    "expandedRowKeys": ["01", "03"],
    "tableList": [
      {
        "id": "01",
        "name": "Node-Alpha",
        "type": "Compute",
        "statusIcon": "circle-check",
        "subList": [
          { "id": "01-1", "task": "数据处理", "progress": "80%", "statusIcon": "circle-check" },
          { "id": "01-2", "task": "任务调度", "progress": "60%", "statusIcon": "circle-x" }
        ]
      },
      {
        "id": "02",
        "name": "Node-Beta",
        "type": "Storage",
        "statusIcon": "circle-x"
      },
      {
        "id": "03",
        "name": "Node-Gamma",
        "type": "Network",
        "statusIcon": "circle-check",
        "subList": [
          { "id": "03-1", "task": "流量转发", "progress": "95%", "statusIcon": "circle-check" }
        ]
      }
    ]
  },
  "rootId": "expandable_table",
  "elements": [
    {
      "id": "expandable_table",
      "component": "Table",
      "props": {
        "rowKey": "id",
        "dataSource": { "path": "/tableList" },
        "columns": [
          { "title": "Name", "dataIndex": "name" },
          { "title": "Type", "dataIndex": "type" },
          { "title": "Status", "dataIndex": "status" }
        ],
        "expandable": {
          "expandedRowKeys": { "path": "/expandedRowKeys" }
        }
      },
      "children": {
        "path": "/tableList",
        "componentId": "table_row"
      }
    },
    {
      "id": "table_row",
      "component": "TableRow",
      "props": {
        "expandedRowRender": { "componentId": "expanded_sub_table" }
      },
      "children": [
        "name_cell",
        "type_cell",
        "status_cell"
      ]
    },
    {
      "id": "name_cell",
      "component": "span",
      "props": { "value": { "path": "name" } }
    },
    {
      "id": "type_cell",
      "component": "Tag",
      "props": { "value": { "path": "type" }, "variant": "outlined" }
    },
    {
      "id": "status_cell",
      "component": "Icon",
      "props": { "name": { "path": "statusIcon" }, "shape": "circle" }
    },
    {
      "id": "expanded_sub_table",
      "component": "Table",
      "props": {
        "rowKey": "id",
        "dataSource": { "path": "subList" },
        "columns": [
          { "title": "Task", "dataIndex": "task" },
          { "title": "Progress", "dataIndex": "progress" },
          { "title": "Status", "dataIndex": "status" }
        ],
        "pagination": false
      },
      "children": {
        "path": "subList",
        "componentId": "sub_table_row"
      }
    },
    {
      "id": "sub_table_row",
      "component": "TableRow",
      "children": [
        "sub_task",
        "sub_progress",
        "sub_status"
      ]
    },
    {
      "id": "sub_task",
      "component": "span",
      "props": { "value": { "path": "task" } }
    },
    {
      "id": "sub_progress",
      "component": "span",
      "props": { "value": { "path": "progress" } }
    },
    {
      "id": "sub_status",
      "component": "Icon",
      "props": { "name": { "path": "statusIcon" }, "shape": "circle" }
    }
  ]
}
```
