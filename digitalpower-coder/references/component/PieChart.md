# PieChart
> Pie chart component for displaying proportions of a whole.
> id: string | component: "PieChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core data source (required)
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
  - `label?`: { `show?`: boolean } — Pie chart text label
  - `title`: { `text`: string, `subtext?`: string } — Center text configuration for the pie chart
  - `legendPosition?`: "centerRight" | "bottomCenter" — Legend position relative to the chart
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

## 示例

# PieChart | 饼图

The chart already includes a legend and does not require an additional one.

### Example: Basic Pie Chart (Donut)
- Pie chart requires `name` and `value` fields in data

```json
{
  "id": "pieChart",
  "component": "PieChart",
  "props": {
    "option": {
      "data": [
        { "value": 100, "name": "VPC" },
        { "value": 90, "name": "IM" },
        { "value": 49, "name": "EIP" }
      ]
    },
    "className": "h-16 w-full"
  }
}
```

### Optional Props (add to `option`)
- `"color": ["#2070F3", "#63b430", "#715afb"]` — custom slice colors
- `"label": { "show": true }` — show/hide slice labels
- `"title": { "text": "160", "subText": "总数" }` — center text overlay
