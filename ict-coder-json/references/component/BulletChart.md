# BulletChart
> Bar chart component for displaying data with rectangular bars.
> id: string | component: "BulletChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core chart data source (required)
  - `xAxis`: { `data`: string, `name?`: string } — X-axis base configuration (required)
    - `data`: string — Field name for X-axis dimension mapping
    - `name?`: string — Setting the X-axis Name
  - `yAxisTitle`: string — MANDATORY: The visible title/label of the Y-axis. This must be a descriptive string (e.g., 'Revenue (USD)', 'Count').
  - `direction?`: "vertical" | "horizontal" — BulletChart direction: vertical or horizontal
  - `markLine?`: { `data`: number, `name?`: "info" | "error" | "warning" | "subwarning" | "success" } — markline for displaying horizontal reference lines (required)
    - `data`: number — markLine in Charts
    - `name?`: "info" | "error" | "warning" | "subwarning" | "success" — markLine state color
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

------

# BulletChart | 子弹图 示例

The chart already includes a legend and does not require an additional one.

## Example: Basic Bullet Chart
- Data uses ranges, measures, and target values for comparison
- `yAxisTitle` is the Y-axis visible label (required)

```json
{
  "id": "bulletChart",
  "component": "BulletChart",
  "props": {
    "option": {
      "data": [
        { "Month": "Jan", "Score": 400 },
        { "Month": "Feb", "Score": 800}
      ],
      "yAxisTitle": "Amount",
      "markLine": {
        "name": "info",
        "data": "600"
      }
    },
    "className": "h-16 w-full"
  }
}
```

## Optional Props (add to `option`)
- `"direction": "horizontal"` — horizontal bullet orientation
- `"color": ["#2070F3", "#63b430"]` — custom bullet colors
