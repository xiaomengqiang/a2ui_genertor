# PatGauge
> 原生 JS + SVG 实现的半圆仪表盘组件，传入当前值和最大值，自动计算百分比并渲染带渐变弧线、刻度线、光效指示点和数字滚动动画。
> id: string | component: "PatGauge" | props: object

## props (required: `value`)
- `value`: number | DataBinding (default: 0) — 当前数值，自动计算为 value/max 的百分比显示
- `max?`: number | DataBinding (default: 100) — 仪表盘的最大值，进度弧线满弧对应的数值
- `className?`: string — Tailwind CSS classes for the component.

## 示例

# Gauge | 仪表盘

### Example: Basic Gauge
- 传入 value 和 max，自动渲染半圆仪表盘

```json
{
  "id": "gaugeCpu",
  "component": "PatGauge",
  "props": {
    "value": 72,
    "max": 100
  }
}
```

### Example: With DataBinding
- 绑定 state 中的动态数据

```json
{
  "id": "gaugeMemory",
  "component": "PatGauge",
  "props": {
    "value": { "path": "/memoryUsage" },
    "max": { "path": "/memoryTotal" }
  }
}
```
