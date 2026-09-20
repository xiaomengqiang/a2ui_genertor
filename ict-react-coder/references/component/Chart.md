# Chart

React wrapper over HUICharts (echarts-based).

**Import:** `import Chart from "../../../assets/shared/chart.jsx"` (adjust relative depth for component folders)

## Usage — three sizing patterns

The chart fills its container (default 100% × 100%). The container must end up with a computable height — via inline `style`, a CSS `className`, flex/grid sizing, any way works. Percentage heights (`height: 50%`) count as computable only when the ancestor chain resolves to a definite height (e.g., `100vh` layouts) — a percentage inside an auto-height parent collapses to 0. Three patterns:

Common height traps:

- `min-height` / `max-height` alone do NOT give a computable height — percentage children resolve against the `height` property only → 0px chart. Always set `height`, not just `min-height`.
- Grid `auto` rows are not computable (content-sized); `1fr` rows in a definite-height grid are.
- Charts inside initially-hidden containers (antd Tabs / Collapse / Drawer panes) init at 0×0 but self-heal — the wrapper's ResizeObserver resizes automatically when the pane is shown. No conditional rendering needed.

**Pattern A — parent provides the height, chart fills:**

```jsx
<div style={{ height: 320, display: "flex", gap: 16 }}>
  <Chart name="BarChart" option={barOption} style={{ flex: 1 }} />
  <Chart name="PieChart" option={pieOption} style={{ flex: 1 }} />
</div>
```

**Pattern B — height set directly on the chart, parent auto-height:**

```jsx
// use style
<Chart name="BarChart" option={{ ... }} style={{ height: 300 }} />
// with .chart-box { height: 300px }
<Chart name="PieChart" option={{ ... }} className="chart-box" /> 
```

**Pattern C — chart fills an elastic card (recommended for card grids):**

Cards in an equal-height grid (`align-items: stretch`) are stretched by the tallest sibling. A chart with a fixed `height` then leaves blank space below it — the chart no longer matches its container. Make the chart fill the leftover height instead of fixing it:

```jsx
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
  {/* tall card — stretches the sibling to its height */}
  <div className="card">…400px tall content…</div>
  {/* elastic card — flex column, chart absorbs the stretched height */}
  <div className="card" style={{ display: "flex", flexDirection: "column" }}>
    <h3>月度发电量</h3>
    <Chart name="BarChart" option={barOption} style={{ flex: 1 }} />
  </div>
</div>
```

> echarts requires a container with a computable height at init — neither pattern applied → the chart renders at 0 height (invisible).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` (required) | — | Chart type — see Selection below |
| `option` | `object` (required) | — | Chart config — per-type specs: `references/component/{ChartName}.md` |
| `className` | `string` | — | Custom class |
| `style` | `object` | — | Inline styles |
| `onChartRendered` | `(chart) => void` | — | Callback after render; receives the HUICharts instance |

## Selection

| Chart | Scenario |
|-------|----------|
| `BarChart` (柱状图) | Category comparison |
| `LineChart` (折线图) | Trends over time or categories |
| `PieChart` (饼图) | Composition / proportion |
| `GaugeChart` (仪表盘) | Single-value achievement rate |
| `HillChart` (山峰图) | Absolute-value ranking |
| `JadeJueChart` (玉玦图) | Ranked proportion |
| `ProcessChart` (多组进度图) | Completion progress, percentage/ratio ranking |

## Colors

- Charts use the default palette in order: `#2070f3, #62B42E, #715AFB, #2CB8C9, #F69E39, #5CA2E9, #BF68FA, #ED448A, #BFB9FA, #D19F00, #B8D9F9`. Set `option.color` only when the user explicitly requests custom colors.
- Keep color mapping consistent per data category across multiple charts.

## Dark mode

Automatic — the wrapper watches `<html>`'s `.dark` class and re-renders with `hdesign-dark` / `hdesign-light` theme. To force a specific theme, set `option.theme` explicitly.

## Public methods (via ref)

| Method | Returns | Description |
|--------|---------|-------------|
| `getEchartsInstance()` | echarts instance | Raw echarts instance for advanced operations (events, tooltips, dataZoom) |
| `resizeHandler()` | — | Manually trigger chart resize (auto via ResizeObserver; use after manual DOM changes) |

### Example: bind chart events via getEchartsInstance

```jsx
import { useRef } from "react";
import Chart from "../../../assets/shared/chart.jsx";

function ClickableBar({ data, onBarClick }) {
  const chartRef = useRef(null);

  const handleRendered = () => {
    const ec = chartRef.current?.getEchartsInstance();
    if (!ec) return;
    ec.on("click", (params) => {
      onBarClick?.(params.name, params.value);
    });
  };

  return (
    <Chart
      ref={chartRef}
      name="BarChart"
      option={{ data }}
      onChartRendered={handleRendered}
    />
  );
}
```

### Example: force resize via resizeHandler

```jsx
// 场景:容器尺寸被外部逻辑改变(如手动改了父容器 className),ResizeObserver
// 已自动覆盖大多数情况;此方法用于极端场景下手动兜底
chartRef.current?.resizeHandler();
```

## Don't

- Do not hand-draw legends, axes, units, or progress visuals.
- Do not call chart types or props that don't exist.