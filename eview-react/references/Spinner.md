# Spinner 组件功能逻辑规格（数字微调器，即 InputNumber）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Spinner/Spinner`；官网组件页 Spinner 及示例 `SpinnerExample1.jsx` / `SpinnerExample2.jsx` / `SpinnerExample3.jsx` / `SpinnerCustomPrefix.jsx` / `SpinnerWithRangeArray.jsx` / `SpinnerTypeTime.jsx`；Badge 示例 `BadgeChange.jsx`（受控用法）
>
> ⚠️ eview-react **没有 `InputNumber`**，数字输入 + 加减按钮就是 `Spinner`（"微调器允许用户通过鼠标或键盘，输入范围内的数值"）。它不是 loading 转圈——那是 `Loading` / `Loader`。
> ⚠️ `value` 从外部更新时输入框默认会**抢焦点**（`doNotFocusWhenValueUpdate` 说明"默认会获取"），程序化改值（如重置、联动）要传 `doNotFocusWhenValueUpdate`。

## 1. 功能定位

Spinner 是带加减按钮的数值输入框：范围、步长、精度、必填、非法值回调与失焦自动修正；另有时间型（`hh:mm:ss`）和自定义前缀型。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 数量 / 端口 / 超时秒数等数值输入 | `Spinner` | antd `InputNumber`、`TextField format="number"` 手写加减 |
| 拖动选值、看范围 | `DragInput`（[DragInput.md](DragInput.md)） | Spinner |
| 时:分:秒 输入 | `Spinner type="time"` | TimePicker（后续批次，另有日期语义） |
| 加载中转圈 | `Loading` / `Loader`（后续批次） | Spinner |

## 2. 典型场景

- 表单里的数量 / 重试次数：`min` / `max` / `step`，`required`
- 端口号：`min={1} max={65535}`，非法输入用 `onInputError` 提示
- 只允许离散区间：`rangeArray={[[1,3],[6,9]]}`
- 与 Badge / 图表联动的计数控制（demo BadgeChange：`value={count} onChange={setCount}`）
- 巡检时间点：`type="time" timeFormat="hh:mm"`

## 3. 状态声明

```tsx
// 受控写法（demo BadgeChange.jsx / SpinnerExample2.jsx）
const [retry, setRetry] = useState<number>(3);

// 非法输入提示（onInputError 触发时写入，onChange 有效值时清空）
const [retryError, setRetryError] = useState<string>('');

// 时间型的值是字符串
const [checkTime, setCheckTime] = useState<string>('08:00');
```

## 4. 事件与交互逻辑

### onChange 只在"有效值"时触发；无效值走 onInputError；失焦自动修正

```tsx
<Spinner
  label="重试次数"
  min={0}
  max={10}
  step={1}
  required
  hintType="tip"
  value={retry}
  doNotFocusWhenValueUpdate                       // 外部改值时不抢焦点
  onChange={(value: number) => {                  // 有效值
    setRetry(value);
    setRetryError('');
  }}
  onInputError={(value) => setRetryError(`"${value}" 超出 0-10`)}   // 无效值（超范围 / 非数字）
  onBlur={(value) => setRetry(Number(value))}     // 失焦时组件已自动修正到合法值，回传
/>
```

### 离散范围 / 循环 / 精度

```tsx
<Spinner rangeArray={[[1, 3], [6, 9], [12, 15]]} value={v} onChange={(n: number) => setV(n)} />   // 4、5、10、11 视为错误值
<Spinner min={0} max={359} minMaxCycle value={angle} onChange={(n: number) => setAngle(n)} />        // 到最大值继续加回到最小值
<Spinner min={0} max={1} step={0.05} precision={2} value={ratio} onChange={(n: number) => setRatio(n)} />
```

### 时间型

```tsx
<Spinner type="time" timeFormat="hh:mm" value={checkTime} onChange={(v: string) => setCheckTime(v)} />
<Spinner type="time" timeFormat="hh:mm:ss" amPm value="11:33:26 AM" />
```

### 命令式取值（demo SpinnerExample2）

```tsx
const spinnerRef = useRef<any>(null);
const current = spinnerRef.current.getValue();
```

## 5. 数据结构

```tsx
interface RetryPolicy {
  retryCount: number;     // Spinner number
  intervalSec: number;    // Spinner number，step 5
  windowStart: string;    // Spinner time，'hh:mm'
}
```

## 6. 联动说明

- 有效值变化 → 计算派生值（总时长 = 次数 × 间隔）实时显示
- `onInputError` → 提交按钮 `disabled` 并显示错误；`onChange` 有效值后清除
- 上级开关关闭（如"启用重试"取消勾选）→ Spinner `disabled`，值保留
- 重置表单 → 程序化 `setRetry(默认)`，需 `doNotFocusWhenValueUpdate` 防止焦点跳到 Spinner
- 在 Form.Item 内使用时不传 `value` / `onChange`，交给 Form

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import Spinner from '@nce/eview-react/Spinner';
import Checkbox from '@nce/eview-react/Checkbox';
import Button from '@nce/eview-react/Button';

interface RetryPolicy {
  retryCount: number;
  intervalSec: number;
  windowStart: string;
}

const DEFAULT_POLICY: RetryPolicy = { retryCount: 3, intervalSec: 30, windowStart: '02:00' };

// 重试策略：启用开关控制禁用、次数与间隔联动总时长、非法输入锁提交、时间型 Spinner
export default function RetryPolicyForm() {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [policy, setPolicy] = useState<RetryPolicy>(DEFAULT_POLICY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const setField = <K extends keyof RetryPolicy>(key: K, value: RetryPolicy[K]) => {
    setPolicy((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };
  const setError = (key: keyof RetryPolicy, msg: string) => setErrors((prev) => ({ ...prev, [key]: msg }));

  const hasError = Object.values(errors).some((m) => m !== '');
  const totalSec = policy.retryCount * policy.intervalSec;

  const handleReset = () => {
    setPolicy(DEFAULT_POLICY);
    setErrors({});
    setResult('');
  };

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="启用失败重试" checked={enabled} onChange={(value, checked: boolean) => setEnabled(checked)} />

      <Spinner
        label="重试次数"
        min={0}
        max={10}
        step={1}
        required
        hintType="tip"
        disabled={!enabled}
        doNotFocusWhenValueUpdate
        value={policy.retryCount}
        onChange={(value: number) => setField('retryCount', value)}
        onInputError={(value) => setError('retryCount', `次数 "${value}" 超出 0-10`)}
      />
      <Spinner
        label="重试间隔(秒)"
        min={5}
        max={300}
        step={5}
        disabled={!enabled}
        doNotFocusWhenValueUpdate
        value={policy.intervalSec}
        onChange={(value: number) => setField('intervalSec', value)}
        onInputError={(value) => setError('intervalSec', `间隔 "${value}" 超出 5-300`)}
      />
      <Spinner
        label="维护窗口开始"
        type="time"
        timeFormat="hh:mm"
        disabled={!enabled}
        doNotFocusWhenValueUpdate
        value={policy.windowStart}
        onChange={(value: string) => setField('windowStart', value)}
      />

      <div style={{ color: hasError ? '#f43146' : '#676767' }}>
        {hasError ? Object.values(errors).filter(Boolean).join('；') : enabled ? `最长重试耗时约 ${totalSec} 秒` : '已关闭重试'}
      </div>
      {result ? <div>{result}</div> : null}

      <div style={{ display: 'flex', gap: 12 }}>
        <Button
          status="primary"
          text="保存"
          disabled={hasError}
          onClick={() => setResult(enabled ? `已保存：${policy.retryCount} 次 / ${policy.intervalSec}s / ${policy.windowStart}` : '已保存：关闭重试')}
        />
        <Button text="重置" onClick={handleReset} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：eview 没有 InputNumber，也没有 addonAfter / controls / formatter
<InputNumber min={0} max={10} addonAfter="次" controls={false} formatter={(v) => `${v}%`} />

// ❌ 把 Spinner 当 loading 用
{loading ? <Spinner /> : <Table />}

// ❌ 用 TextField + 两个 Button 手写加减，放弃了范围 / 步长 / 失焦修正
<Button text="-" /><TextField format="number" value={n} /><Button text="+" />

// ❌ 程序化改值不加 doNotFocusWhenValueUpdate，"重置"后焦点跳进 Spinner
<Spinner value={policy.retryCount} onChange={...} />

// ❌ 只接 onChange 不接 onInputError，用户输 999 时没有任何提示（onChange 不会触发）
<Spinner min={0} max={10} value={n} onChange={setN} />

// ❌ 时间型的值当数字处理
<Spinner type="time" value={800} />
```

## 9. API 速查

> 压缩自 `Spinner/Spinner`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `value` | `string \| number`，默认 `0` | 当前值（时间型为字符串） |
| `min` / `max` | `number \| string`，默认 `0` / `100` | 范围 |
| `step` | `number`，默认 `1` | 步长 |
| `precision` | `number`，默认 `0` | 小数位 |
| `rangeArray` | `number[][]`，如 `[[1,3],[6,7]]` | 离散合法区间 |
| `minMaxCycle` | `boolean`，默认 `false` | 到边界后循环 |
| `onChange` | `(value) => void` | **有效值**时触发 |
| `onInputError` | `(value) => void` | 无效值时触发 |
| `onBlur` | `(value) => void` | 失焦（组件已自动修正）；`disabledBlurFunction` 可禁用修正 |
| `onFocus` | `(event) => void` | 聚焦 |
| `onPressEnter` | `(value) => void` | 回车 |
| `required` | `boolean`，默认 `false` | 必填 + 非空校验 |
| `disabled` | `boolean`，默认 `false` | 灰化 |
| `doNotFocusWhenValueUpdate` | `boolean` | 值更新时不抢焦点（默认会） |
| `type` | `'number' \| 'time' \| 'customWithPrefixs'`，默认 `number` | 数字 / 时间 / 自定义前缀 |
| `timeFormat` / `amPm` / `locale` | `'hh:mm:ss' \| 'hh:mm'` / `boolean` / `'en' \| 'zh'` | 时间型格式 |
| `customPrefix` / `onCustomIncOrDecClick` | `string` / `(changeTag, direction, value) => void` | 自定义前缀型（demo SpinnerCustomPrefix） |
| `label` / `labelPosition` / `decTitle` / `incTitle` | `string` | 名称 / 位置 / 加减按钮提示 |
| `hintType` / `focusTip` / `tipStyle` / `noZeroPrecise` | — | 提示相关 |
| `inputClassName` / `labelStyle` / `style` / `className` / `id` | — | 常规透传 |
| `ref.getValue()` | `() => value` | 取当前值 |
