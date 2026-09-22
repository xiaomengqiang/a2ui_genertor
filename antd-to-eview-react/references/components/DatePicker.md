# DatePicker 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `DatePicker/types`；官网组件页 Date Picker 及示例 `DatePickerDemo.jsx` / `DatePickerEvent.jsx` / `DatePickerRange.jsx` / `DatePickerUpdate.jsx` / `DateTimePicker.jsx` / `DatePickerDisabled.jsx` / `DatePickerAmPm.jsx` / **`DatePickerBadExample.jsx`（官方反例）**；官网 FAQ「onChange 等回调函数中不建议使用双向绑定的写法」
>
> ⚠️ **这是唯一一个官方明确给出"反例 demo"的组件**：`DatePickerBadExample.jsx` 标题写着"onChange 回调中，和 value 的状态'双向绑定'了"——它把 `onChange` 第一个参数（字符串）**无条件**回写 `value`。原因（FAQ）：组件会对 value 做修正 / 格式化，原样回写会打断用户输入。对照 `DatePickerEvent.jsx`（正例）：只在第二个参数 `date` 为有效 Date 时才回写（`if (obj)`）。**其他组件通用的 `value` + `onChange` 直接回写，在 DatePicker 上要改成"有效 Date 才回写"或干脆用 `defaultValue` + `ref.getValue()`。**
> ⚠️ `DatePickerUpdate.jsx` 注释："传给组件的 value 值要是 24 小时制的（不建议使用字符串，容易出错）"，"onOkClick 里一定要设置延时（setTimeout）再 setState"。
> ⚠️ `timeEmbedded` 在 API 表无说明；官方 demo 统一写 `timeEmbedded={theme === 'aui3_1'}`，本 Skill 目标主题即 aui3_1 → `datetime` 类型加 `timeEmbedded`。

## 1. 功能定位

DatePicker 是日期 / 日期时间 / 月 / 季 / 年 / 周选择器，支持范围选择（仅 date / datetime）、可选范围限制、12 小时制、时区与夏令时。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 选一个日期 / 日期时间 | `DatePicker type="date" \| "datetime"` | antd `DatePicker` + `onChange` 回写 `value` |
| 选起止时间段 | `DatePicker range={[]}`（同一个组件） | `RangePicker`（不存在） |
| 选月 / 季 / 年 / 周 | `type="month" \| "quarter" \| "year" \| "week"` | `picker="month"` |
| 只选时间点（hh:mm） | `Spinner type="time"`（[Spinner.md](Spinner.md)）或 `TimePicker`（后续批次） | DatePicker |
| 相对时间范围（近 7 天） | `TimeRangeSelector`（后续批次）或 `SelectCard`（[SelectCard.md](SelectCard.md)） | 两个 DatePicker |

## 2. 典型场景

- 新建任务的"生效日期"：`defaultValue` 初始今天，提交时 `ref.getValue()` 取值
- 查询条件"起止时间"：`type="datetime"` + `range={[]}`，在 `onOkClick` 里取 `fromDateObj` / `toDateObj` 触发查询
- 报表按月 / 季 / 年统计：`type="month"` 等 + 对应 `format`
- 限制可选范围：`dateRange={{ dateFrom, dateTo }}`（如不能选未来）
- 编辑页回填：`value={new Date(record.startTime)}` 由外部一次性设置，不用 `onChange` 回写

## 3. 状态声明

```tsx
// 模式 A（推荐，表单提交型）：不存 value，用 defaultValue 初始化，提交时从 ref 取
const startRef = useRef<any>(null);

// 模式 B（需要程序化改值：重置 / 回填）：value 受控，但 onChange 只在拿到有效 Date 时回写 Date 对象
const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(undefined);

// 范围查询：只存确认后的起止（来自 onOkClick），不跟随每次 onChange
const [period, setPeriod] = useState<{ from: Date; to: Date } | null>(null);

// 仅用于联动 / 校验的"是否已选"标记，来自 onChange 的第二个参数是否为有效 Date
const [hasDate, setHasDate] = useState<boolean>(false);
```

## 4. 事件与交互逻辑

### 模式 A：defaultValue + ref.getValue()（demo DateTimePicker.jsx 取值方式）

```tsx
<DatePicker
  ref={startRef}
  label="生效日期"
  type="date"
  format="yyyy-MM-dd"
  defaultValue={new Date()}                 // 只在初始化生效，之后改它无效
  dateRange={{ dateFrom: new Date(), dateTo: new Date(2030, 11, 31) }}
  required
  placeholder="请选择日期"
  onChange={(dateString: string, date?: Date) => setHasDate(!!date)}   // 只做副作用，不回写 value
/>

const handleSubmit = () => {
  const start = startRef.current.getValue();  // 提交时取值
  …
};
```

### 模式 B：受控但只回写有效 Date（demo DatePickerEvent.jsx 的 `if (obj)` 写法）

```tsx
<DatePicker
  type="datetime"
  format="yyyy-MM-dd HH:mm:ss"
  timeEmbedded
  showNow
  value={effectiveDate}                       // 传 Date，不传字符串
  onChange={(dateString: string, date?: Date) => {
    if (date) setEffectiveDate(date);         // 有效 Date 才回写，且回写 Date 对象；不要 setEffectiveDate(dateString)
  }}
/>
<Button text="回填为上次配置" onClick={() => setEffectiveDate(new Date(record.time))} />   // 外部动作才改 value
<Button text="重置" onClick={() => setEffectiveDate(undefined)} />
```

### 范围选择：range 属性开启，onOkClick 取起止（demo DatePickerRange.jsx / DatePickerUpdate.jsx）

```tsx
<DatePicker
  type="datetime"
  format="yyyy-MM-dd HH:mm:ss"
  range={[]}                                  // 传数组即为范围模式；仅 date / datetime，且不支持 amPm / 夏令时
  onChange={(dateString: string, date?: Date, target?: string) => { /* target: 'left' | 'right' */ }}
  onOkClick={(obj: any) => {
    // obj: { dateFormate, fromDateObj, fromSelectDate, toDateObj, toSelectDate }
    setTimeout(() => setPeriod({ from: obj.fromDateObj, to: obj.toDateObj }), 100);   // demo 注明：一定要延时
  }}
  onCancelClick={() => {}}
/>
```

### 月 / 季 / 年 / 周：type 与 format 成对

```tsx
<DatePicker type="month" format="yyyy-MM" placeholder="请选择月份" />
<DatePicker type="quarter" format="yyyy-QQ" dateRange={{ dateFrom: new Date(2020, 3), dateTo: new Date() }} />
<DatePicker type="year" format="yyyy" />
<DatePicker type="week" format="yyyy-wo" />
```

## 5. 数据结构

```tsx
// 范围确认回调的对象（api onOkClick 描述）
interface DateRangeResult {
  dateFormate: string;
  fromDateObj: Date;
  fromSelectDate: string;
  toDateObj: Date;
  toSelectDate: string;
}

// 可选范围限制
interface DateRangeLimit {
  dateFrom: Date;
  dateTo: Date;
}

// onBlur 事件对象（api onBlur 描述）
interface DatePickerBlurEvent {
  event: object;
  value: Date;
  text: string;
  format: string;
}
```

## 6. 联动说明

- 起止范围确认（`onOkClick`）→ 列表 / 图表重新请求；`onCancelClick` 不动
- "生效日期"晚于"结束日期"→ 提交前用两个 ref 的 `getValue()` 比较，失败提示（组件本身不做跨字段校验）
- 统计粒度（SelectCard：日 / 月 / 年）变化 → 切换 DatePicker 的 `type` + `format`，并清空已选
- 在 `Form.Item` 内：不传 `value` / `onChange`，Form 按 `name` 收集（`initialValues` 提供初值）
- 编辑回填：进入页面时一次性 `setEffectiveDate(new Date(...))`，用 Date 对象、24 小时制

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import DatePicker from '@nce/eview-react/DatePicker';
import Button from '@nce/eview-react/Button';

interface Period {
  from: Date;
  to: Date;
}

// 任务计划：生效日期（模式 B：受控 + 只回写有效 Date，支持回填 / 清空）+ 截止日期（模式 A：defaultValue + ref 取值）+ 统计时间段（范围模式）
export default function TaskSchedule() {
  const deadlineRef = useRef<any>(null);
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(undefined);
  const [period, setPeriod] = useState<Period | null>(null);
  const [result, setResult] = useState<string>('');

  const today = new Date();
  const maxDate = new Date(today.getFullYear() + 2, 11, 31);

  const handleSubmit = () => {
    if (!effectiveDate) {
      setResult('请选择生效日期');
      return;
    }
    const deadline: Date | undefined = deadlineRef.current?.getValue();   // 模式 A：提交时才从组件取值
    if (!deadline || deadline <= effectiveDate) {
      setResult('截止日期必须晚于生效日期');
      return;
    }
    if (!period) {
      setResult('请选择统计时间段并点击确定');
      return;
    }
    setResult(`生效 ${effectiveDate.toLocaleDateString()}，截止 ${deadline.toLocaleDateString()}，统计 ${period.from.toLocaleString()} ~ ${period.to.toLocaleString()}`);
  };

  return (
    <div style={{ width: 560, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker
        label="生效日期"
        type="date"
        format="yyyy-MM-dd"
        required
        placeholder="请选择日期"
        value={effectiveDate}
        dateRange={{ dateFrom: today, dateTo: maxDate }}
        style={{ width: '18.5rem' }}
        onChange={(dateString: string, date?: Date) => {
          if (date) setEffectiveDate(date);   // 有效 Date 才回写（官方反例是无条件回写字符串）
        }}
      />
      <div style={{ display: 'flex', gap: 12 }}>
        <Button text="回填为下月 1 日" onClick={() => setEffectiveDate(new Date(today.getFullYear(), today.getMonth() + 1, 1))} />
        <Button text="清空日期" onClick={() => setEffectiveDate(undefined)} />
      </div>

      <DatePicker
        ref={deadlineRef}
        label="截止日期"
        type="date"
        format="yyyy-MM-dd"
        placeholder="请选择日期"
        defaultValue={maxDate}                 // 模式 A：只做初始值，提交时用 ref.getValue()
        dateRange={{ dateFrom: today, dateTo: maxDate }}
        style={{ width: '18.5rem' }}
      />

      <DatePicker
        label="统计时间段"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        timeEmbedded
        range={[]}
        style={{ width: '32rem' }}
        onOkClick={(obj: any) => {
          // demo DatePickerUpdate.jsx：onOkClick 里要延时再 setState
          setTimeout(() => setPeriod({ from: obj.fromDateObj, to: obj.toDateObj }), 100);
        }}
        onCancelClick={() => {}}
      />
      <div style={{ color: '#676767' }}>
        {period ? `已选：${period.from.toLocaleString()} ~ ${period.to.toLocaleString()}` : '未选择时间段'}
      </div>

      {result ? <div>{result}</div> : null}
      <div>
        <Button status="primary" text="保存计划" disabled={!effectiveDate} onClick={handleSubmit} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ 官方反例 DatePickerBadExample.jsx：onChange 的字符串原样回写 value（"双向绑定"）
<DatePicker value={date} onChange={(value) => setDate(value)} />

// ❌ antd 习惯：没有 RangePicker / picker / showTime / disabledDate
<DatePicker.RangePicker showTime disabledDate={(d) => d.isAfter(today)} />
<DatePicker picker="month" />

// ❌ 用 defaultValue 做"回填"（它只在初始化生效，之后改它无效）
<DatePicker defaultValue={record.time} />   // record 异步加载后才有值 → 不生效

// ❌ value 传字符串、12 小时制（DatePickerUpdate 注释：要 24 小时制的 Date，不建议字符串）
<DatePicker value="2024-01-01 02:00:00 PM" />

// ❌ 范围模式在 onChange 里取起止（应在 onOkClick 的 obj 里取 fromDateObj / toDateObj）
<DatePicker range={[]} onChange={(text) => setPeriod(text)} />

// ❌ type 与 format 不配对
<DatePicker type="month" format="yyyy-MM-dd" />
```

## 9. API 速查

> 压缩自 `DatePicker/types`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'date' \| 'datetime' \| 'month' \| 'quarter' \| 'year' \| 'week'`，默认 `date` | 类型 |
| `format` | `string`，默认 `yyyy-MM-dd` | date：`yyyy-MM-dd` / `M/d yyyy` / `MM/DD/YYYY` / `dd/MM/yyyy`；datetime：`yyyy-MM-dd HH:mm:ss` 等；month：`yyyy-MM` / `MM/YYYY`；quarter：`yyyy-QQ`；year：`yyyy`；week：`yyyy-wo` |
| `value` | `Date \| string \| number` | 当前值；**建议 Date、24 小时制，且不要用 onChange 回写** |
| `defaultValue` | `Date \| string` | 初始值，**只在初始化生效** |
| `dateRange` | `{ dateFrom: Date, dateTo: Date }` | 可选范围限制 |
| `range` | `(Date \| string)[]` | 传数组开启范围选择（仅 date / datetime） |
| `onChange` | `(dateString, date?, target?, dstDate?) => void` | 变更；范围时 `target` 为 `left` / `right` |
| `onOkClick` / `onCancelClick` | `(obj, event, target?) => void` | 范围模式确定 / 取消；`obj` 含 `fromDateObj` / `toDateObj` / `fromSelectDate` / `toSelectDate` / `dateFormate` |
| `onBlur` | `(ev: { event, value: Date, text, format }) => void` | 输入框失焦 |
| `onOpenChange` | `() => void` | 面板展开 |
| `required` / `disabled` / `readOnly` | `boolean`，默认 `false` | 必填 / 禁用 / 输入框只读 |
| `placeholder` / `label` | `string` | 占位 / 名称 |
| `hintType` | `'div' \| 'tip' \| 'none'`，默认 `tip` | 提示形式 |
| `timeFormat` / `amPm` | `string`（默认 `hh:mm:ss`）/ `boolean` | datetime 的时间格式 / 12 小时制 |
| `showNow` | `boolean` | 面板显示"此刻" |
| `timeEmbedded` | `boolean` | 表内无说明；demo 在 aui3_1 主题下为 true |
| `popupDirection` | `'top' \| 'bottom' \| 'left' \| 'right'` | 弹出方向 |
| `showTimezone` / `timezoneRule` | `boolean` / `any` | 时区显示 / 夏令时规则（手动 DST 已废弃） |
| `ifTriggerOnChangeWithCalender` | `boolean`，默认 `true` | 打开面板时是否触发 onChange |
| `focusShowCalender` / `tipDisplay` / `display` / `zIndex` | — | 聚焦展开 / 提示 / 显隐 / 层级 |
| `selectStyle` / `selectClassName` / `labelStyle` / `style` / `className` / `id` | — | 常规透传 |
| `ref.getValue()` | `() => Date` | 取当前值（demo DateTimePicker.jsx） |
