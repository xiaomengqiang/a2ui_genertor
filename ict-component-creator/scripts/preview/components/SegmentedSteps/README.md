# SegmentedSteps

分段式漏斗步骤条：按数值占比分配轨道宽度的多步骤转化展示。

## Features

- `activeIndex` 控制点亮进度，未激活步骤置灰
- 悬停高亮对应步骤
- 图例支持 Lucide 图标
- 数值自动格式化为 k / w（如 12800 → 1.3w）

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `Array<{ value: number, label: string, icon?: string }>` | — (required) | 步骤数据；`icon` 为 Lucide 图标名，缺省渲染色点 |
| `colors` | `string[]` | 内置图表色 | 系列色数组（hex），按索引循环取用 |
| `activeIndex` | `number` | 全部点亮 | 点亮到第几步（含） |

## Usage

```jsx
import SegmentedSteps from "./SegmentedSteps/index.jsx";

const steps = [
  { value: 48200, label: "触达", icon: "trending-up" },
  { value: 21500, label: "打开", icon: "mouse-pointer-click" },
  { value: 2360, label: "下单", icon: "package-check" },
];

<SegmentedSteps steps={steps} activeIndex={1} />
```
