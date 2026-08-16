# CircleProcessChart
> A circular chart showing percentage progress toward a goal.
> id: string | component: "CircleProcessChart" | props: object

## props (required: `option`, `className`)
- `option`:
  - `data`: object[] | DataBinding — Core data source (required)
  - `color?`: string[] | DataBinding — Stick to default color groups. Override only upon explicit user request.
  - `title?`: { `text`: string, `subtext?`: string } — Center text configuration for the circleProcess chart
- `className`: string — Tailwind CSS classes for the component. Mandatory: width (w-) and height (h-) classes must be explicitly defined.

## 示例

# CircleProcessChart | 圆环进度图

### Example: Basic CircleProcess Chart
- Use `data` prop with `value` and `name` fields

```json
{
  "id": "circleProcessChart",
  "component": "CircleProcessChart",
  "props": {
    "option": {
      "data": [{ "value": 71, "name": "Utilization rate" }]
    },
    "className": "h-16 w-full"
  }
}
```

### Optional Props (add to `option`)
- `"color": ["#2070F3"]` — custom CircleProcess color

