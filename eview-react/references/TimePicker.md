# TimePicker 组件功能逻辑规格（时分秒选择）

> ⚠️ 根导出名为 **`TimeSelector`**，本文沿用 `import { TimeSelector as TimePicker } from '@nce/eview-react'`；发布包 **3.10.28** 也已确认支持 `import TimePicker from '@nce/eview-react/TimePicker'`。
> ⚠️ 24 小时 `time` 用数字数组；AM/PM 输入是含标记的**混合数组**，标记固定放 `time[3]`。`onChange` / `getValue()` 返回字符串数组，`hh:mm + amPm` 的标记却在下标 2，不能直接回填。
> ⚠️ 默认用 24 小时 `hh:mm:ss`。3.10 核验源码与发布包 3.10.28 均无 `bottomButtons`，不使用旧资料中的该属性；`ampmVal` 作为外部 prop 无效。`timeEmbedded` 可内联显示面板。
> 行为核验基于 R26.0-NCE 3.10.36+6 源码，入口与方法类型另经发布包 3.10.28 确认；本页未做真实包运行验证。4.x 仅确认源码存在 getValue，不能外推其他契约，见[版本边界](patterns/project-setup.md)。

## 1. 功能定位

TimePicker 选择一天中的时间，可输入或从浮层选时分秒，不包含日期、时区或时间范围语义。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 每日执行时刻、营业起始时间 | `TimePicker time` | antd 的 `value={dayjs(...)}` |
| 日期和时间共同选择 | [DatePicker](DatePicker.md) | 给 TimePicker 添加日期 props |
| 时分或分秒输入 | `format="hh:mm"` / `"mm:ss"` | 用不存在的 `showHour/showSecond` |
| 两个时刻组成区间 | 两个 TimePicker + 业务校验 | 虚构 `TimePicker.RangePicker` |

## 2. 典型场景

- 定时任务：选择每天的执行时间，保存 `[小时, 分钟, 秒]`。
- 营业时间：开始、结束分别选择，跨午夜规则由业务决定。
- 只读配置：通过 `disabled` 禁止编辑，保留时间展示。
- 简化精度：`hh:mm` 显示时分，`mm:ss` 显示分秒；不把分秒输入当任意长时长。

## 3. 状态声明

```tsx
// 本例为 24 小时制；数字输入与字符串回调分开保存，提交时校验转换
const initialTime: [number, number, number] = [9, 0, 0]; // 放组件外，保持引用稳定
const [rawTime, setRawTime] = useState<string[]>(['09', '00', '00']);
const [saving, setSaving] = useState(false);
const inFlight = useRef(false);
const [resetKey, setResetKey] = useState(0);
```

默认时间是当前时分秒。本例固定初值显式传数字 `time`，回调先保存字符串快照；重置同时恢复业务值并通过 key 重建组件，而不是臆造 `clear()`。AM/PM 输入形状见 §5。

## 4. 事件与交互逻辑

```tsx
<TimePicker
  label="执行时间"
  time={initialTime}
  format="hh:mm:ss"
  onChange={(next: string[]) => setRawTime([...next])}
  disabled={saving}
/>

// 短格式同样输入数字数组，回调分别为 ['09', '30'] / ['15', '20']
<TimePicker time={[9, 30]} format="hh:mm" />
<TimePicker time={[15, 20]} format="mm:ss" />
```

- 回调是字符串数组：hh:mm 为 `['HH','MM']`，mm:ss 为 `['MM','SS']`，hh:mm:ss 为三项；启用 amPm 的小时格式末尾增加 `'AM'` / `'PM'`。键入、面板选择、失焦 / 点外部校正均可触发，不把 onChange 当保存动作。
- `format` 使用小写 `hh`，支持 `hh:mm:ss`、`hh:mm`、`mm:ss`；不要按其他库习惯替换成 `HH:mm:ss`。
- `required` 有声明，但没有已验证的 `validate()` / `focus()` 接口。提交校验在业务侧完成，不能只靠必填标记断言数据有效。
- 核验 3.10 版本没有 `bottomButtons`，不配置底部确认 / 取消按钮，也不添加 `onOk/onCancel`。保存和取消由业务外部按钮实现，不从 onChange 推导确认语义。
- `supportEmptyTime` 开启后，输入 `time=[]` 表示空值，清空时 onChange 与 getValue 均为 `[]`。先判空、格式和范围，再转换有效值；空值保留为空或按必填规则拦截，不用 `Number('')` 或补零变成午夜。
- `timeEmbedded={true}` 内联显示时间输入与选择面板，不弹出浮层；默认按普通输入场景保留 false / 缺省。
- `direction` 默认 auto，但固定方向枚举不明确，保留默认；`display` 控制整个组件显示，不能当浮层 open。

## 5. 数据结构

```tsx
type ClockTime = [number, number, number]; // 业务规范化后的 24 小时时分秒
const initialTime: ClockTime = [9, 0, 0];
// 午夜 [0, 0, 0] 有效，小时 0–23、分钟和秒 0–59
// 文本展示可在通过范围校验后使用 parts.map(String).map(s => s.padStart(2, '0')).join(':')
```

上面的元组只用于 24 小时时分秒。`onChange` 与 `getValue()` 的返回形状一致；getValue 类型为 `() => any[]`，实现返回字符串数组，不能把旧资料的 void 当实际返回值。

| format / 模式 | time 输入示例 | onChange / getValue 输出示例 |
|---------------|---------------|-----------------------------|
| hh:mm，24 小时 | `[9, 30]` | `['09', '30']` |
| mm:ss | `[15, 20]` | `['15', '20']` |
| hh:mm:ss，24 小时 | `[9, 30, 0]` | `['09', '30', '00']` |
| hh:mm + amPm | `[9, 30, 0, 'PM']` | `['09', '30', 'PM']` |
| hh:mm:ss + amPm | `[12, 30, 0, 'AM']` | `['12', '30', '00', 'AM']` |
| supportEmptyTime 空值 | `[]` | `[]` |

AM/PM 模式小时为 **1–12**，输入标记始终是 `time[3]`，hh:mm 的下标 2 用 `0` 占位；输出标记则分别在下标 2 / 3。标记须为大写 AM / PM，组件遇到非法标记会回退 AM，业务应先拒绝无效值，避免悄悄改变时刻。

业务转换先校验长度、非空数字字符串、整数范围和 AM/PM：小时 1–12，分秒 0–59；hh:mm 没有秒，业务需要秒时显式取 0。转 24 小时用 `hour % 12 + (period === 'PM' ? 12 : 0)`，因此 12 AM → 0、12 PM → 12。反向先校验 24 小时值在 0–23，用 `hour % 12 || 12` 与 `hour < 12 ? 'AM' : 'PM'`，再组装 `[hour12, minute, second, period]`；hh:mm 的 second 固定 0。TimePicker 自身不完成这层归一化，不直接把输出数组回填到 time。

## 6. 联动说明

- 保存 → 校验当前回传值完整且在范围内，复制为独立元组后请求；处理中禁用输入与重复提交。
- 重置 → 恢复明确的有效初值并清除业务错误；程序化回填若未更新显示，用 key 重建。
- 两个选择器 → 先各自校验，再转换为秒比较；允许跨午夜与否是业务规则，不由组件自动推断。
- 与 Form 组合时，值属性不是默认的 value；尚无该组合的托管示例，先核验工程已有用法，不凭空给 TimePicker 加 rules 或 validate 方法。
- 默认保存 onChange 快照；需要命令式读取时可用实例 getValue，先复制返回数组再校验，不原地修改组件内部数据。尚无真实包探针确认各交互下的精确事件顺序，不推断读取与失焦 / 提交谁先发生。

## 7. 完整代码示例

示例保留字符串快照，清空或不完整时拦截保存，有效时转换为数字元组；重置主动重建输入。保存函数由业务注入。

```tsx
import React, { useRef, useState } from 'react';
import { TimeSelector as TimePicker } from '@nce/eview-react';
import Button from '@nce/eview-react/Button';

type ClockTime = [number, number, number];
const initialTime: ClockTime = [9, 0, 0];
function normalizeTime(value: string[]): ClockTime | null {
  if (value.length !== 3) return null; // [] 清空，不补成午夜
  const parts = value.map((part) => /^\d{1,2}$/.test(part) ? Number(part) : NaN);
  if (!parts.every((part, index) => Number.isInteger(part) && part >= 0
    && part <= (index === 0 ? 23 : 59))) return null;
  return [parts[0], parts[1], parts[2]];
}

export default function DailySchedule({ save }: { save: (time: ClockTime) => Promise<void> }) {
  const [rawTime, setRawTime] = useState<string[]>(['09', '00', '00']);
  const [resetKey, setResetKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSave = async () => {
    if (inFlight.current) return;
    const snapshot = normalizeTime(rawTime);
    if (!snapshot) { setFeedback({ ok: false, text: '请填写完整有效的时分秒' }); return; }
    inFlight.current = true;
    setSaving(true);
    setFeedback(null);
    try {
      await save(snapshot);
      setFeedback({ ok: true, text: '执行时间已保存' });
    } catch (error) {
      setFeedback({ ok: false, text: error instanceof Error ? error.message : '保存失败，请重试' });
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };
  const handleReset = () => {
    if (inFlight.current) return;
    setRawTime(['09', '00', '00']);
    setResetKey((key) => key + 1);
    setFeedback(null);
  };

  return (
    <section className="app-daily-schedule">
      <TimePicker key={resetKey} label="每日执行时间" time={initialTime}
        format="hh:mm:ss" required supportEmptyTime disabled={saving}
        onChange={(next: string[]) => { setRawTime([...next]); setFeedback(null); }} />
      <Button text={saving ? '保存中…' : '保存'} status="primary"
        disabled={saving} onClick={handleSave} />
      <Button text="重置为 09:00:00" disabled={saving} onClick={handleReset} />
      {feedback && <p role={feedback.ok ? 'status' : 'alert'}>{feedback.text}</p>}
    </section>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 的 value/dayjs 与格式习惯；本组件使用 time 数组和 hh:mm:ss
<TimePicker value={dayjs()} format="HH:mm:ss" />

// ❌ antd 的 RangePicker、allowClear 和 disabledTime 没有相应声明
<TimePicker.RangePicker allowClear disabledTime={getDisabledTimes} />

// ❌ 第一个参数不是 DOM event，也不是 (dayjs, timeString)
<TimePicker onChange={(event) => setTime(event.target.value)} />

// ❌ display 控制整个控件，不能拿来控制弹出面板
<TimePicker display={panelOpen} onOpenChange={setPanelOpen} />

// ❌ 清空 [] / 不完整字符串不能补成午夜，也不能调用不存在的 clear/validate
const saved = [0, 1, 2].map((index) => Number(rawTime[index] ?? ''));
timeRef.current.clear();

// ❌ hh:mm + amPm 的输出不能直接回填；输入标记须在 time[3]
<TimePicker amPm format="hh:mm" time={[9, 30, 'PM']} ampmVal="PM" />

// ❌ 核验 3.10 源码与 3.10.28 发布包无 bottomButtons，也无已确认的 onOk/onCancel
<TimePicker bottomButtons onOk={save} onCancel={reset} />
```

## 9. API 速查

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `time` | 原声明 any；24 小时数字数组，AM/PM 混合数组 | 形状见 §5；AM/PM 固定在 time[3]，不能直接回填输出 |
| `onChange` | 原声明 any；实际 `(time: string[]) => void` | 零填充数字字符串，长度随 format / amPm；清空 [] |
| `format` | `string`，默认 `'hh:mm:ss'` | 支持 hh:mm:ss / hh:mm / mm:ss |
| `disabled` / `display` | `boolean`，默认 false / true | 禁用 / 整体显隐 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`，默认 before | 文本与位置 |
| `required` | `boolean`，默认 false | 必填声明，不据此推断 ref 校验能力 |
| `amPm` | `boolean`，默认 false | 小时范围 1–12；输入标记下标 3，输出位置随 format，业务负责 24 小时转换 |
| `supportEmptyTime` | `boolean` | 允许空时间，清空回调 []；业务显式处理空值 |
| `direction` | `string`，默认 auto | 固定方向枚举不明确，默认不指定 |
| `timeEmbedded` | `boolean` | 内联显示面板，不触发弹层 |
| `getValue()` | 发布包声明 `() => any[]`；实际 string[] | 实例方法，形状见 §5；空值 []，使用前复制并校验 |
| 其余 | — | `id` / `className` / `labelClassName` / `timeClassName`（string）；`style` / `labelStyle` / `timeStyle`（object） |

旧资料曾列 bottomButtons，核验 3.10 源码及 3.10.28 发布包均不存在，不能作为正向 API 使用；ampmVal 不是公共 prop 且实现不读取它。真实确认 / 取消事件时序未获运行证据，不据此新增事件或恢复上述属性。
