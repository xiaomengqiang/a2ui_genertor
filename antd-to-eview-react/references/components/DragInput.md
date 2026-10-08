# DragInput 组件功能逻辑规格（官网页面名：Slider / 滑动输入器）

> 资料来源：TypeDoc `DragInput/DragInput` + 官网 Slider（标题 DragInput）页示例。
> ⚠️ **导入名是 `DragInput`**：`import DragInput from '@nce/eview-react/DragInput'`。官网页面叫 Slider，但 `Slider` 不在导出清单里，demo 全部导入 `DragInput`。
> ⚠️ `value` **永远是数组**：单滑块 `[v]`，区间 `[min, max]`；`onChange` 第一个参数也是数组。
> ⚠️ demo 里用到的 `onBlur` / `onFocus` 不在 API 表中，不要依赖。

## 1. 功能定位

DragInput 是带刻度的滑动输入器：单值或区间，可显示刻度值、单位、内置数字输入框，精度可控。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 在一个范围内拖选数值（带宽、阈值、百分比） | `DragInput` | antd `Slider` |
| 选一段区间（起止端口、价格区间） | `DragInput type="range"` | 两个 Spinner |
| 精确输入数字、加减微调 | `Spinner`（[Spinner.md](Spinner.md)） | 把 DragInput 当输入框 |
| 滑块 + 旁边独立输入框联动 | `DragInput displayInput={false}` + `TextField` | — |

## 2. 事件与交互逻辑

### onChange(value[], changeValue[]) —— 第一个参数是整组值

```tsx
<DragInput
  label="带宽"
  min={0}
  max={1000}
  unit="Mbps"
  markIndexes={[0, 500, 1000]}
  value={bandwidth}
  onChange={(value: number[], changeValue?: number[]) => setBandwidth(value)}
/>

// 区间
<DragInput
  type="range"
  min={0}
  max={100}
  precision={0}
  markIndexes={[0, 50, 100]}
  value={threshold}
  onChange={(value: number[]) => setThreshold(value)}   // value = [low, high]
/>
```

### 与外部输入框联动：输入越界钳制（displayInput={false} 时配 TextField）

```tsx
const clamp = (n: number) => Math.min(Math.max(n, MIN), MAX);

<DragInput min={MIN} max={MAX} displayInput={false} value={bandwidth} onChange={(v: number[]) => { setBandwidth(v); setBandwidthText(String(v[0])); }} />
<TextField
  format="number"
  value={bandwidthText}
  onChange={(text: string) => {
    setBandwidthText(text);
    if (text !== '' && !Number.isNaN(Number(text))) setBandwidth([clamp(Number(text))]);
  }}
/>
```

### 刻度文字格式化

```tsx
<DragInput labelFormat={(value?: number) => ({ formatValue: `${value} GB` })} … />
```

## 3. 联动说明

- 表单重置 → 直接 `setBandwidth([默认])`，组件按新 `value` 重绘（值必须是数组）
- 提交时以 state 数组为准；单滑块取 `value[0]`，区间取 `[value[0], value[1]]`

## 4. 反面示例

```tsx
// ❌ 导入不存在的名字（官网页面叫 Slider，导出名是 DragInput）
import Slider from '@nce/eview-react/Slider';

// ❌ antd 习惯：没有 range 布尔、marks 对象、tooltip、onAfterChange
<Slider range marks={{ 0: '0', 100: '100' }} tooltip={{ open: true }} onAfterChange={save} />

// ❌ value 传标量（必须是数组，单滑块也要 [v]）
<DragInput value={50} onChange={(v) => setValue(v)} />

// ❌ 单滑块 onChange 直接把数组当数字用
onChange={(value) => setBandwidth(value * 2)}     // 应为 value[0]

// ❌ 区间只传一个值
<DragInput type="range" value={[60]} />

// ❌ 外部输入框越界不钳制，滑块拿到超出 max 的值
onChange={(text) => setBandwidth([Number(text)])}
```

## 5. API 速查

> 压缩自 `DragInput/DragInput`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `value` | `number[]` | **数组**：single `[v]`，range `[min, max]` |
| `type` | `'single' \| 'range'`，默认 `single` | 单值 / 区间 |
| `min` / `max` | `number`，默认 `0` / `100` | 刻度范围 |
| `precision` | `number`，默认 `0` | 小数位 |
| `onChange` | `(value: number[], changeValue?: number[]) => void` | 整组值 + 本次改变的值 |
| `markIndexes` | `number[]` | 需要显示刻度值的位置 |
| `unit` | `string` | 刻度单位；多单位用 `labelFormat` |
| `labelFormat` | `(value?) => { formatValue: string }` | 刻度文字格式化 |
| `displayInput` | `boolean`，默认 `true` | 是否显示内置输入框 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 标题及位置 |
| `disabled` | `boolean`，默认 `false` | 禁用 |
| `stickStyle` / `barStyle` / `inputStyle`（及对应 className） | 样式 | 刻度条 / 滑块 / 输入框 |
| `id` / `className` / `style` | — | 最外层 |
| `ref.getValue()` | `() => number[]` | 取当前值（demo DragInputEventDemo） |
