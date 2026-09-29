# Spinner 组件功能逻辑规格（数字微调器，即 InputNumber）

> 资料来源：TypeDoc `Spinner/Spinner` + 官网 Spinner 页示例。
> ⚠️ eview-react **没有 `InputNumber`**，数字输入 + 加减按钮就是 `Spinner`。它不是 loading 转圈——那是 `Loading` / `Loader`。
> ⚠️ `value` 从外部更新时输入框默认会**抢焦点**（`doNotFocusWhenValueUpdate` 说明"默认会获取"），程序化改值（如重置、联动）要传 `doNotFocusWhenValueUpdate`。

## 1. 功能定位

Spinner 是带加减按钮的数值输入框：范围、步长、精度、必填、非法值回调与失焦自动修正；另有时间型（`hh:mm:ss`）和自定义前缀型。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 数量 / 端口 / 超时秒数等数值输入 | `Spinner` | antd `InputNumber`、`TextField format="number"` 手写加减 |
| 拖动选值、看范围 | `DragInput`（[DragInput.md](DragInput.md)） | Spinner |
| 时:分:秒 输入 | `Spinner type="time"` | TimePicker（后续批次，另有日期语义） |
| 加载中转圈 | `Loading` / `Loader`（后续批次） | Spinner |

## 2. 事件与交互逻辑

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

### 时间型（值是字符串，不是数字）

```tsx
<Spinner type="time" timeFormat="hh:mm" value={checkTime} onChange={(v: string) => setCheckTime(v)} />
<Spinner type="time" timeFormat="hh:mm:ss" amPm value="11:33:26 AM" />
```

### 命令式取值

```tsx
const spinnerRef = useRef<any>(null);
const current = spinnerRef.current.getValue();
```

## 3. 联动说明

- 重置表单 → 程序化 `setRetry(默认)`，需 `doNotFocusWhenValueUpdate` 防止焦点跳进 Spinner
- 上级开关关闭（如"启用重试"取消勾选）→ Spinner `disabled`，值保留

## 4. 反面示例

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

## 5. API 速查

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
| `customPrefix` / `onCustomIncOrDecClick` | `string` / `(changeTag, direction, value) => void` | 自定义前缀型 |
| `label` / `labelPosition` / `decTitle` / `incTitle` | `string` | 名称 / 位置 / 加减按钮提示 |
| `hintType` / `focusTip` / `tipStyle` / `noZeroPrecise` | — | 提示相关 |
| `inputClassName` / `labelStyle` / `style` / `className` / `id` | — | 常规透传 |
| `ref.getValue()` | `() => value` | 取当前值 |
