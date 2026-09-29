# DatePicker 组件功能逻辑规格

> 资料来源：TypeDoc `DatePicker/types` + 官网 Date Picker 页示例（含官方反例 `DatePickerBadExample.jsx`）。
> ⚠️ **唯一一个官方明确给出"反例 demo"的组件**：`DatePickerBadExample.jsx` 标题写着"onChange 回调中，和 value 的状态'双向绑定'了"——它把 `onChange` 第一个参数（字符串）**无条件**回写 `value`。原因（FAQ）：组件会对 value 做修正 / 格式化，原样回写会打断用户输入。对照 `DatePickerEvent.jsx`（正例）：只在第二个参数 `date` 为有效 Date 时才回写（`if (obj)`）。**其他组件通用的 `value` + `onChange` 直接回写，在 DatePicker 上要改成"有效 Date 才回写"或干脆用 `defaultValue` + `ref.getValue()`。**
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

## 2. 事件与交互逻辑

### 模式 A：defaultValue + ref.getValue()（推荐，表单提交型）

```tsx
const startRef = useRef<any>(null);
<DatePicker
  ref={startRef}
  label="生效日期"
  type="date"
  format="yyyy-MM-dd"
  defaultValue={new Date()}                 // 只在初始化生效，之后改它无效
  dateRange={{ dateFrom: new Date(), dateTo: new Date(2030, 11, 31) }}
  required
  onChange={(dateString: string, date?: Date) => setHasDate(!!date)}   // 只做副作用，不回写 value
/>
// 提交时：const start = startRef.current.getValue();
```

### 模式 B：受控但只回写有效 Date（demo DatePickerEvent.jsx 的 `if (obj)` 写法）

```tsx
const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(undefined);
<DatePicker
  type="datetime"
  format="yyyy-MM-dd HH:mm:ss"
  timeEmbedded
  value={effectiveDate}                       // 传 Date，不传字符串
  onChange={(dateString: string, date?: Date) => {
    if (date) setEffectiveDate(date);         // 有效 Date 才回写 Date 对象；不要 setEffectiveDate(dateString)
  }}
/>
<Button text="回填" onClick={() => setEffectiveDate(new Date(record.time))} />   // 外部动作才改 value
<Button text="重置" onClick={() => setEffectiveDate(undefined)} />
```

### 范围选择：range 属性开启，onOkClick 取起止（demo DatePickerRange.jsx / DatePickerUpdate.jsx）

```tsx
<DatePicker
  type="datetime"
  format="yyyy-MM-dd HH:mm:ss"
  range={[]}                                  // 传数组即为范围模式；仅 date / datetime，不支持 amPm / 夏令时
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

## 3. 联动说明

- 起止范围确认（`onOkClick`）→ 列表 / 图表重新请求；`onCancelClick` 不动
- "生效日期"晚于"结束日期"→ 提交前用两个 ref 的 `getValue()` 比较，失败提示（组件本身不做跨字段校验）
- 统计粒度（SelectCard：日 / 月 / 年）变化 → 切换 DatePicker 的 `type` + `format`，并清空已选

## 4. 反面示例

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

## 5. API 速查

> 压缩自 `DatePicker/types`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'date' \| 'datetime' \| 'month' \| 'quarter' \| 'year' \| 'week'`，默认 `date` | 类型 |
| `format` | `string`，默认 `yyyy-MM-dd` | date：`yyyy-MM-dd` 等；datetime：`yyyy-MM-dd HH:mm:ss`；month：`yyyy-MM`；quarter：`yyyy-QQ`；year：`yyyy`；week：`yyyy-wo` |
| `value` | `Date \| string \| number` | 当前值；**建议 Date、24 小时制，且不要用 onChange 回写** |
| `defaultValue` | `Date \| string` | 初始值，**只在初始化生效** |
| `dateRange` | `{ dateFrom: Date, dateTo: Date }` | 可选范围限制 |
| `range` | `(Date \| string)[]` | 传数组开启范围选择（仅 date / datetime） |
| `onChange` | `(dateString, date?, target?, dstDate?) => void` | 变更；范围时 `target` 为 `left` / `right` |
| `onOkClick` / `onCancelClick` | `(obj, event, target?) => void` | 范围模式确定 / 取消；`obj` 含 `fromDateObj` / `toDateObj` / `fromSelectDate` / `toSelectDate` / `dateFormate` |
| `onBlur` | `(ev: { event, value: Date, text, format }) => void` | 输入框失焦 |
| `required` / `disabled` / `readOnly` | `boolean`，默认 `false` | 必填 / 禁用 / 输入框只读 |
| `placeholder` / `label` | `string` | 占位 / 名称 |
| `hintType` | `'div' \| 'tip' \| 'none'`，默认 `tip` | 提示形式 |
| `timeFormat` / `amPm` | `string`（默认 `hh:mm:ss`）/ `boolean` | datetime 时间格式 / 12 小时制 |
| `showNow` | `boolean` | 面板显示"此刻" |
| `timeEmbedded` | `boolean` | 表内无说明；demo 在 aui3_1 主题下为 true |
| `popupDirection` | `'top' \| 'bottom' \| 'left' \| 'right'` | 弹出方向 |
| `showTimezone` / `timezoneRule` | `boolean` / `any` | 时区显示 / 夏令时规则（手动 DST 已废弃） |
| `ifTriggerOnChangeWithCalender` | `boolean`，默认 `true` | 打开面板时是否触发 onChange |
| `ref.getValue()` | `() => Date` | 取当前值（demo DateTimePicker.jsx） |
