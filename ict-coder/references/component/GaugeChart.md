# GaugeChart
> Gauge chart component for displaying values on a circular dial.
> id: string | component: "GaugeChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core data source (required)
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
  - `text?`: { `offset?`: number[], `formatter?`: string } — Center text configuration
    - `offset?`: number[]
    - `formatter?`: string
  - `splitColor?`: number | string[][] — Color ranges as array of [threshold, color] pairs, e.g., [[0.25, '#0d9458'], [0.5, '#eeba18']]
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

------

# GaugeChart | 仪表盘 示例

## Example: Basic Gauge Chart
- Use `data` prop with `value` and `name` fields

```json
{
  "id": "gaugeChart",
  "component": "GaugeChart",
  "props": {
    "option": {
      "data": [{ "value": 71, "name": "Utilization rate" }]
    },
    "className": "h-16 w-full"
  }
}
```

## Optional Props (add to `option`)
- `"color": ["#2070F3"]` — custom gauge color
- `"pointer": true` — show gauge pointer needle
- `"min": 0, "max": 100, "splitNumber": 4` — custom range and divisions
- `"markLine": 88` — threshold value (gauge turns red when exceeded)
- `"splitColor": [[0.25, "#0d9458"], [0.5, "#eeba18"], [0.75, "#ec6f1a"], [1, "#f43146"]]` — multi-color ranges
