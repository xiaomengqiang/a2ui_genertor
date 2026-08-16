# RadarChart
> Radar chart component for displaying multivariate data on a polar coordinate system.
> id: string | component: "RadarChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core data source (required)
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
  - `area?`: { `show?`: boolean } — Controls whether the graphic area fill is displayed
  - `markLine?`: number — Threshold line value
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

## 示例

# RadarChart | 雷达图

The chart already includes a legend and does not require an additional one.

### Example: Basic Radar Chart
- Use `data` prop with series name as key and dimension-value pairs as value
- Use `radarMax` to set the maximum value for the outermost circle

```json
{
  "id": "radarChart",
  "component": "RadarChart",
  "props": {
    "option": {
      "radarMax": 100,
      "data": {
        "Domestic": {
          "Equipment": 41,
          "VM": 91,
          "CSP": 81
        }
      }
    },
    "className": "h-16 w-full"
  }
}
```

### Optional Props (add to `option`)
- `"area": { "show": false }` — control radar area fill (default true)
- `"color": ["#2db8ca"]` — custom radar color
- `"markLine": 81` — threshold circle line
- `"radar": { "shape": "polygon" }` — polygon shape (default is circle)
