# LineChart
> Line chart component for displaying data trends over time or categories.
> id: string | component: "LineChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core data source (required)
  - `smooth?`: boolean — Whether to display as smooth curve
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
  - `step?`: boolean — Step line configuration - converts line to step chart
  - `xAxis`: — X-axis base configuration (required)
    - `data`: string — Field name for X-axis dimension mapping
    - `name?`: string — Setting the X-axis Name
  - `yAxisTitle`: string — MANDATORY: The visible title/label of the Y-axis. This must be a descriptive string (e.g., 'Revenue (USD)', 'Count').
  - `markLine?`: — markline configuration for displaying horizontal reference lines
    - `top?`: number — Upper threshold line value
    - `bottom?`: number — Lower threshold line value
  - `area?`: boolean — Whether to display as area chart
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

------

# LineChart | 折线图 示例

The chart already includes a legend and does not require an additional one.

## Example: Basic Line Chart
- Use `xAxis.data` to specify the field name for X-axis
- `yAxisTitle` is the Y-axis visible label (required)

```json
{
  "id": "lineChart",
  "component": "LineChart",
  "props": {
    "option": {
      "data": [
        { "Month": "Jan", "Train": 84, "Bus": 56 },
        { "Month": "Feb", "Train": 55, "Bus": 39 }
      ],
      "xAxis": { "data": "Month" },
      "yAxisTitle": "Percentage(%)"
    },
    "className": "h-16 w-full"
  }
}
```

## Optional Props (add to `option`)
- `"smooth": true` — smooth curve display
- `"step": true` — step line display
- `"stack": true` — stacked lines
- `"color": ["#2070F3", "#63b430"]` — custom line colors
- `"markLine": { "top": 38, "bottom": 20 }` — threshold reference lines
- `"xAxis": { "data": "Month", "name": "Time" }` — X-axis with display name
