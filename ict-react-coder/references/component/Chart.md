# Chart

React wrapper over HUICharts (echarts-based).

**Import:** `import Chart from "../../../assets/shared/chart.jsx"` (adjust relative depth for component folders)

## Sizing

The chart fills its container (default 100% × 100%). **echarts** reads the container size at init — without a computable height the chart renders at 0px (invisible).

**Rules** — any sizing method works (style / className / flex / grid) as long as the height is computable:

- Percentages (`height: 50%`) only when the ancestor chain resolves to a definite height (e.g. `100vh` layouts) — inside an auto-height parent they collapse to 0
- **`flex: 1` computes its height from the parent or its own floor — never from `height` on the same element** (`flex: 1` = `flex-basis: 0%`, which overrides `height`: dead code, build FAILs; in auto-height parents the chart collapses to ~0 and echarts misreads the wrapper's `height: 100%` as 100px). Two valid setups:
  1. **Parent height + chart layer `flex: 1`** — fixed-height card / `100vh` shell (Pattern A); `flex: 1` fills the parent
  2. **Chart layer `flex: 1` + `min-height: <value>`** — elastic cards (Pattern C); the floor survives flex resolution, `flex: 1` absorbs any stretched height
- `max-height` alone gives no computable height; `min-height` alone does — used height = max(content, min-height)

- Grid `auto` rows are not computable; `1fr` rows in a definite-height grid are
- Hidden containers (antd Tabs / Collapse / Drawer panes) init at 0×0 but self-heal via ResizeObserver — no conditional rendering needed

**Pattern A — parent fixed height, chart fills:**

```jsx
<div style={{ height: 320, display: "flex", gap: 16 }}>
  <Chart name="BarChart" option={barOption} style={{ flex: 1 }} />
  <Chart name="PieChart" option={pieOption} style={{ flex: 1 }} />
</div>
```

**Pattern B — direct height on the chart, parent auto-height:**

```jsx
// use style
<Chart name="BarChart" option={{ ... }} style={{ height: 300 }} />
// with .chart-box { height: 300px }
<Chart name="PieChart" option={{ ... }} className="chart-box" /> 
```

**Pattern C — elastic card (recommended for card grids):**

In equal-height grids (`align-items: stretch`), fixed heights leave dead space below the chart. Make the card `flex column`, give the chart `flex: 1`.

The chart's height has two valid setups — never pair `flex: 1` with `height` on the same element (dead code, build FAILs):

1. **Parent height + chart layer `flex: 1`** — fixed-height card / `100vh` shell (Pattern A territory); `flex: 1` fills the parent.
2. **Chart layer `flex: 1` + `min-height`** — elastic cards (this pattern); `min-height` is the guaranteed floor, `flex: 1` absorbs any stretched height.

```jsx
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
  // tall card — stretches the sibling to its height
  <div className="card">…400px tall content…</div>
  // elastic card — flex column, chart absorbs the stretched height
  <div className="card" style={{ display: "flex", flexDirection: "column" }}>
    <h3>月度发电量</h3>
    <Chart name="BarChart" option={barOption} style={{ flex: 1, minHeight: 240 }} />
  </div>
</div>
```

## Stability — height feedback & render loops

Elastic chart cards (Pattern A/C) can enter self-amplifying loops when chart-rendered heights feed back into layout, or when dozens of live echarts instances keep repainting off-screen. EVERY chart card MUST apply:

1. **Break the height loop** — card body: `flex: 1 1 0` + `overflow: hidden` + `min-height: <fallback px>`. TWO feedback channels must both be cut:
   - `overflow: hidden` zeroes the flex item's automatic minimum size — content can no longer raise the card's minimum height;
   - basis `0` (**never `flex: 1 1 auto`**) — with basis auto the body's content height IS the growth baseline, so heights written back by echarts push the card taller on every resize (the classic "cards grow while dragging" bug).
   Chart wrapper style: `{ flex: 1, minWidth: 0, minHeight: 0 }` — height comes from flex allocation only.
2. **Skip off-screen rendering** — card root: `content-visibility: auto; contain-intrinsic-size: auto 360px;`. Off-screen cards stop painting (echarts repaints and ResizeObserver callbacks pause), eliminating "page renders forever" CPU loops; the intrinsic size keeps the scrollbar stable. Gracefully degrades in unsupporting browsers.
3. **Instance budget** — many charts on one page: group them into Tabs with `destroyInactiveTabPane`, so only the active pane holds live echarts instances.
4. **Non-elastic siblings** — lists / text / KPI blocks next to charts: `flex: 0 0 auto` with an explicit height (fixed px / `aspect-ratio` / natural + `max-height` scroll). Never give `flex: 1` to content that cannot resize itself.

Symptoms when these rules are skipped: cards growing taller every frame or while dragging resizers (`ResizeObserver loop`); constant repaint / high CPU with the page idle.

```css
/* card root */
.chart-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 360px;
}

/* chart body — basis 0 (never 1 1 auto), min-height as layout fallback, overflow kills the min-size feedback */
.chart-card__body {
  display: flex;
  flex: 1 1 0;
  min-height: 300px;
  overflow: hidden;
}
```

```jsx
<Chart name="LineChart" option={lineOption} style={{ flex: 1, minWidth: 0, minHeight: 0 }} />
```

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