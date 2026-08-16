# JadeJueChart
> Bar chart component for displaying data with rectangular bars.
> id: string | component: "JadeJueChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core chart data source (required)
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
  - `title?`: { `text`: string, `subtext?`: string } — Center text configuration for the JadeJueChart chart
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

## 示例

# JadeJueChart | 玉玦图

The chart already includes a legend and does not require an additional one.

### Example: Basic JadeJue Chart
- Data is an array of objects representing jade jue segments

```json
{
  "id": "jadeJueChart",
  "component": "JadeJueChart",
  "props": {
    "option": {
      "data": [
        { "name": "Category A", "value": 45 },
        { "name": "Category B", "value": 30 },
        { "name": "Category C", "value": 25 }
      ]
    },
    "className": "h-16 w-full"
  }
}
```

### Optional Props (add to `option`)
- `"color": ["#2070F3", "#63b430", "#715afb"]` — custom segment colors

