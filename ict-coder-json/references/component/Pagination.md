# Pagination
> id: string | component: "Pagination" | props: object

## props (required: `current`, `total`)
- `current`: number | DataBinding — Current page number.
- `total`: number | DataBinding — Total number of data items.
- `showTotal?`: boolean | DataBinding — Used to display the total data volume.
- `simple?`: boolean | DataBinding — Used to display a simplified pagination style.
- `className?`: string — Tailwind CSS classes for the component.

------

# Pagination 分页器使用规范

用于在大数据集或分页结果之间切换。

## 使用规则

- 必须设置当前页 `current` 和数据总数 `total`。
- 用户需要判断数据规模时使用 `showTotal=true`；空间有限且不需要直接跳页时使用 `simple=true`。
- 切换页码时保留筛选、搜索和排序条件；当前页超出新结果范围时回到有效页。
- Table 已内置分页，默认不要额外创建 Pagination；仅在 `pagination=false` 或独立列表场景中单独使用。

## 布局

- 放在所控制的数据容器底部，通常右对齐或与容器工具区对齐。
- 页码很多时由组件处理省略，不手动画页码链。

## Don't

- 不要在数据量很少时分页。
- 不要把 Pagination 放得远离所控制的内容。
- 不要生成 API 表中不存在的 pageSize、jump 等属性。

------

# Pagination | 分页 示例

## Example: Pagination basic

```json
{
  "id": "paginationBasic",
  "component": "Pagination",
  "props": {
    "current": 1,
    "total": 120
  }
}
```

## Example: Pagination with data binding

```json
{
  "state": { "currentPage": 1, "totalCount": 246 },
  "rootId": "userPagination",
  "elements": [
    {
      "id": "userPagination",
      "component": "Pagination",
      "props": {
        "current": { "path": "/currentPage" },
        "total": { "path": "/totalCount" },
        "showTotal": true,
        "className": "mt-4"
      }
    }
  ]
}
```
