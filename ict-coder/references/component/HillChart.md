# HillChart
> Bar chart component for displaying data with rectangular bars.
> id: string | component: "HillChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core chart data source (required)
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

## 示例

# HillChart | 山峰图

The chart already includes a legend and does not require an additional one.

### Example: Basic Hill Chart
- Data is an array of objects representing hill/area distribution

```json
{
  "id": "hillChart",
  "component": "HillChart",
  "props": {
    "option": {
      "data": [
        { "name": "Group A", "value": 40 },
        { "name": "Group B", "value": 25 },
        { "name": "Group C", "value": 35 }
      ]
    },
    "className": "h-16 w-full"
  }
}
```

### Optional Props (add to `option`)
- `"color": ["#2070F3", "#63b430", "#715afb"]` — custom hill colors

