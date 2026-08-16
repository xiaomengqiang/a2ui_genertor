# PatStackedBar
> 原生 JS 实现的横向堆叠条形图组件，通过四个状态数值自动计算比例并渲染带动画的条形图和图例。颜色内部固定：正常(绿)、告警(黄)、危险(橙)、错误(红)。
> id: string | component: "PatStackedBar" | props: object

## props (required: `normal`, `warning`, `danger`, `error`)
- `normal`: number | DataBinding (default: 0) — 正常状态的数量，对应绿色区块
- `warning`: number | DataBinding (default: 0) — 告警状态的数量，对应黄色区块
- `danger`: number | DataBinding (default: 0) — 危险状态的数量，对应橙色区块
- `error`: number | DataBinding (default: 0) — 错误状态的数量，对应红色区块
- `className?`: string — Tailwind CSS classes for the component.

## 示例

# StackedBar | 状态分布堆叠条形图

### Example: Basic Stacked Bar
- 四个状态数值，自动计算比例渲染

```json
{
  "id": "stackedBar",
  "component": "PatStackedBar",
  "props": {
    "normal": 45,
    "warning": 20,
    "danger": 25,
    "error": 10
  }
}
```

### Example: With DataBinding
- 绑定 state 中的动态数据

```json
{
  "id": "stackedBarHealth",
  "component": "PatStackedBar",
  "props": {
    "normal": { "path": "/healthStatus/normal" },
    "warning": { "path": "/healthStatus/warning" },
    "danger": { "path": "/healthStatus/danger" },
    "error": { "path": "/healthStatus/error" }
  }
}
```

