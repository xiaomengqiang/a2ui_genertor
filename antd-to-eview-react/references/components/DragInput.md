# DragInput 组件功能逻辑规格（官网页面名：Slider / 滑动输入器）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `DragInput/DragInput`；官网组件页 Slider（标题 DragInput）及示例 `DragInputBasic.jsx` / `DragInputDemo.jsx` / `DragInputDisabled.jsx` / `DragInputGroup.jsx` / `DragInputUpdateDemo.jsx` / `DragInputEventDemo.jsx`
>
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
| 滑块 + 旁边独立输入框联动 | `DragInput displayInput={false}` + `TextField`（demo DragInputGroup） | — |

## 2. 典型场景

- 带宽 / 配额设置：`min` / `max` / `unit="Mbps"`，`markIndexes` 标出关键刻度
- 告警阈值区间：`type="range"`，`value=[low, high]`
- 百分比参数（CPU 阈值）：`precision={0}`，`displayInput` 默认显示输入框可直接键入
- 滑块与外部输入框双向联动，输入越界时钳制到 `min` / `max`

## 3. 状态声明

```tsx
// 单滑块：数组只有一个元素
const [bandwidth, setBandwidth] = useState<number[]>([50]);

// 区间：[low, high]
const [threshold, setThreshold] = useState<number[]>([60, 90]);

// 与外部 TextField 联动时，输入框的字符串单独存（用户可能输入非法字符）
const [bandwidthText, setBandwidthText] = useState<string>('50');
```

## 4. 事件与交互逻辑

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

### 与外部输入框联动：输入越界钳制（demo DragInputGroup.jsx 思路）

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

## 5. 数据结构

```tsx
// 表单里的两类值
interface QosForm {
  bandwidth: number[];   // [v]
  threshold: number[];   // [low, high]
}
```

## 6. 联动说明

- 滑块变化 → 外部输入框同步显示；输入框变化 → 解析为数字、钳制到范围后写回滑块
- 区间值变化 → 图表阈值线 / 表格高亮同步
- 表单重置 → 直接 `setBandwidth([默认])`，组件按新 `value` 重绘（demo DragInputUpdateDemo）
- 提交时以 state 数组为准；单滑块取 `value[0]`

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import DragInput from '@nce/eview-react/DragInput';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

const MIN = 0;
const MAX = 1000;

// QoS 配置：带宽单滑块 + 外部输入框联动钳制；CPU 告警阈值区间滑块；重置
export default function QosConfig() {
  const [bandwidth, setBandwidth] = useState<number[]>([200]);
  const [bandwidthText, setBandwidthText] = useState<string>('200');
  const [threshold, setThreshold] = useState<number[]>([60, 90]);
  const [summary, setSummary] = useState<string>('');

  const clamp = (n: number): number => Math.min(Math.max(n, MIN), MAX);

  const handleSliderChange = (value: number[]) => {
    setBandwidth(value);
    setBandwidthText(String(value[0]));
  };

  const handleTextChange = (text: string) => {
    setBandwidthText(text);
    if (text === '' || Number.isNaN(Number(text))) return;   // 非法输入不动滑块
    setBandwidth([clamp(Number(text))]);
  };

  const handleTextBlur = () => {
    // 失焦时把输入框规整为滑块的合法值
    setBandwidthText(String(bandwidth[0]));
  };

  const handleReset = () => {
    setBandwidth([200]);
    setBandwidthText('200');
    setThreshold([60, 90]);
    setSummary('');
  };

  return (
    <div style={{ width: 560, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <DragInput
          label="带宽"
          min={MIN}
          max={MAX}
          unit="Mbps"
          markIndexes={[0, 500, 1000]}
          displayInput={false}
          style={{ flex: 1 }}
          value={bandwidth}
          onChange={handleSliderChange}
        />
        <TextField inputStyle={{ width: 80 }} format="number" value={bandwidthText} onChange={handleTextChange} onBlur={handleTextBlur} />
        <span>Mbps</span>
      </div>

      <DragInput
        label="CPU 告警阈值"
        type="range"
        min={0}
        max={100}
        precision={0}
        markIndexes={[0, 50, 100]}
        labelFormat={(value?: number) => ({ formatValue: `${value}%` })}
        value={threshold}
        onChange={(value: number[]) => setThreshold(value)}
      />

      {summary ? <div>{summary}</div> : null}
      <div style={{ display: 'flex', gap: 12 }}>
        <Button
          status="primary"
          text="保存"
          onClick={() => setSummary(`带宽 ${bandwidth[0]} Mbps，阈值 ${threshold[0]}% ~ ${threshold[1]}%`)}
        />
        <Button text="重置" onClick={handleReset} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

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
