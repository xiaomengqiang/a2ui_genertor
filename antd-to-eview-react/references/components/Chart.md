# 图表（Chart）功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：`@nce/eview-react/Chart`；契约与 ict-react-coder 源项目的 `<Chart>` 一致（`name` + `option`）。完整 API 以官方 TypeDoc 为准。
>
> ⚠️ 迁移自 ict-react-coder 源项目时**调用点零改动**，只改 import 路径：`./assets/shared/chart.jsx` → `@nce/eview-react/Chart`。无需 UMD `<script>` 注入或自写封装。
> ⚠️ 旧 scaffold 的 `src/shared/chart.jsx` + `public/library/`（`echarts.min.js` + `hui-charts.umd.js`）方案已废弃，改用 `@nce/eview-react/Chart` 原生组件。

## 1. 功能定位

`@nce/eview-react/Chart` 是 HUI Charts（封装 echarts）的 React 组件，用于柱状图 / 折线图 / 饼图 / 仪表盘等。`name` 指定图表类型，`option` 原样透传给底层 HUI Charts 的 `setSimpleOption`。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 柱状 / 折线 / 饼图等 | `<Chart name="BarChart" option={...} />` | 直接操作 echarts 或自写 UMD 封装 |

## 2. 典型场景

- 数据看板：柱状图展示设备数量、折线图展示趋势
- 仪表盘：GaugeChart 展示健康度 / 使用率
- 占比分布：PieChart

## 3. 状态声明

```tsx
// 图表本身无状态；option 由业务 data 派生
const [option, setOption] = useState({ /* echarts option */ });
```

## 4. 事件与交互逻辑

```tsx
import Chart from '@nce/eview-react/Chart';

<Chart
  name="BarChart"
  option={{
    xAxis: { data: ['Mon', 'Tue', 'Wed'] },
    series: [{ type: 'bar', data: [10, 20, 15] }],
  }}
/>
```

## 5. 数据结构

```tsx
interface ChartProps {
  name: string;    // 图表类型（见 §9）
  option: object;  // echarts 风格配置项，原样透传
  className?: string;
  style?: React.CSSProperties;
  onChartRendered?: (chart: any) => void;  // 渲染完成回调
}
```

## 6. 联动说明

- 暗色模式：监听 `<html>` 的 `.dark` 类，自动切换 hdesign-light / hdesign-dark 主题并重建图表
- 容器尺寸变化（侧栏折叠 / 窗口缩放 / 响应式）：ResizeObserver 自动 resize
- ref 方法：`getEchartsInstance()` 取底层 echarts 实例；`resizeHandler()` 手动触发 resize

## 7. 完整代码示例

```tsx
import Chart from '@nce/eview-react/Chart';

export default function DeviceChart({ data }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <Chart
        name="BarChart"
        option={{
          xAxis: { data: data.map((d) => d.name) },
          series: [{ type: 'bar', data: data.map((d) => d.value) }],
        }}
      />
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ 自写 UMD 封装 + <script> 注入 window.HUICharts（旧 scaffold 方案，已废弃）
import Chart from './shared/chart.jsx';
// index.html: <script src="/library/echarts.min.js"></script>

// ❌ import 路径用源项目的资产目录旧路径
import Chart from './assets/shared/chart.jsx';

// ❌ 直接操作 window.echarts 绕过组件
const chart = echarts.init(dom);
```

## 9. API 速查

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `name` | `string` | 图表类型：`BarChart` / `LineChart` / `PieChart` / `GaugeChart` / `HillChart` / `JadeJueChart` / `ProcessChart` |
| `option` | `object` | echarts 风格配置项，原样透传给 HUICharts `setSimpleOption` |
| `className` / `style` | `string` / `CSSProperties` | 容器样式（wrapper 默认 `width:100%; height:100%`） |
| `onChartRendered` | `(chart) => void` | 渲染完成回调，收底层 chart 实例 |
| ref `getEchartsInstance()` | `() => echartsInstance \| null` | 取底层 echarts 实例 |
| ref `resizeHandler()` | `() => void` | 手动触发 resize |

> 上述 API 基于源项目（ict-react-coder）的 `<Chart>` 契约与旧 scaffold 封装的行为对齐；`@nce/eview-react/Chart` 原生组件的完整 prop 列表以官方 TypeDoc 为准，未列出的 props 一律不写。
