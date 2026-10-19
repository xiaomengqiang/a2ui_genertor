# BarChart
> Bar chart component for displaying data with rectangular bars.
> id: string | component: "BarChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core chart data source (required)
  - `direction?`: "vertical" | "horizontal" — Bar direction: vertical or horizontal
  - `stack?`: boolean (default: false) — Enable data stacking - bars will stack on top of each other instead of side by side
  - `xAxis`: — X-axis base configuration (required)
    - `data`: string — Field name for X-axis dimension mapping
    - `name?`: string — Setting the X-axis Name
  - `yAxisTitle`: string — MANDATORY: The visible title/label of the Y-axis. This must be a descriptive string (e.g., 'Revenue (USD)', 'Count').
  - `markLine?`: — markline for displaying horizontal reference lines
    - `top?`: number — Upper threshold line
    - `bottom?`: number — Lower threshold line
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

------

# BarChart | 柱状图 示例

The chart already includes a legend and does not require an additional one.

## Example: Basic Bar Chart
- Use `xAxis.data` to specify the field name for X-axis dimension
- `yAxisTitle` is the Y-axis visible label (required)

```json
{
  "id": "barChart",
  "component": "BarChart",
  "props": {
    "option": {
      "data": [
        { "Month": "Jan", "Domestic": 33, "Abroad": 20 },
        { "Month": "Feb", "Domestic": 27, "Abroad": 39 }
      ],
      "xAxis": { "data": "Month" },
      "yAxisTitle": "Percentage(%)"
    },
    "className": "h-16 w-full"
  }
}
```

## Optional Props (add to `option`)
- `"direction": "horizontal"` — horizontal bar orientation
- `"color": ["#2070F3", "#63b430"]` — custom bar colors
- `"markLine": { "top": 38 }` — threshold reference line

## Example: Double-sided Bar Chart
- Use `type: "double-sides"` for bidirectional bars

```json
{
  "id": "doubleSidesBarChart",
  "component": "BarChart",
  "props": {
    "option": {
      "type": "double-sides",
      "data": [
        { "Month": "Jan", "上行": 33, "下行": 37 },
        { "Month": "Feb", "上行": 27, "下行": 39 }
      ],
      "xAxis": { "data": "Month" },
      "yAxisTitle": "Percent(%)"
    },
    "className": "h-16 w-full"
  }
}
```

## Example: Stacked Bar Chart
- Use `type: "stack"` for stacked bars
- Use `stack` object to define custom stack groups (field name arrays)

```json
{
  "id": "stackBarChart",
  "component": "BarChart",
  "props": {
    "option": {
      "type": "stack",
      "stack": { "GroupA": ["A1", "A2"], "GroupB": ["B1"] },
      "data": [
        { "Time": "T1", "A1": 33, "A2": 5, "B1": 23 },
        { "Time": "T2", "A1": 27, "A2": 8, "B1": 28 }
      ],
      "xAxis": { "data": "Time" },
      "yAxisTitle": "Count"
    },
    "className": "h-16 w-full"
  }
}
```
