# DatePicker 组件功能逻辑规格

> 导入：`import DatePicker from '@/shared/DatePicker'`（scaffold 包壳，透明转发 `@nce/eview-react/DatePicker`，API 不变）。

> 资料来源：TypeDoc `DatePicker/types` + 官网 Date Picker 页示例（含官方反例 `DatePickerBadExample.jsx`）。
> ⚠️ **唯一一个官方明确给出"反例 demo"的组件**：`DatePickerBadExample.jsx` 标题写着"onChange 回调中，和 value 的状态'双向绑定'了"——它把 `onChange` 第一个参数（字符串）**无条件**回写 `value`。原因（FAQ）：组件会对 value 做修正 / 格式化，原样回写会打断用户输入。对照 `DatePickerEvent.jsx`（正例）：只在第二个参数 `date` 为有效 Date 时才回写（`if (obj)`）。**其他组件通用的 `value` + `onChange` 直接回写，在 DatePicker 上要改成"有效 Date 才回写"或干脆用 `defaultValue` + `ref.getValue()`。**
> ⚠️ `DatePickerUpdate.jsx` 注释："传给组件的 value 值要是 24 小时制的（不建议使用字符串，容易出错）"，"onOkClick 里一定要设置延时（setTimeout）再 setState"。
> ⚠️ `timeEmbedded` 在 API 表无说明；官方 demo 统一写 `timeEmbedded={theme === 'aui3_1'}`，本 Skill 目标主题即 aui3_1 → `datetime` 类型加 `timeEmbedded`。
> ⚠️ **format 只接受按 type 的固定模式**（`yyyy-MM-dd` / `yyyy-MM-dd HH:mm:ss` / `yyyy-MM-dd HH:mm` / `yyyy-MM` / `yyyy-QQ` / `yyyy` / `yyyy-wo`），**不支持 antd/dayjs 的任意 token 组合**。迁移时**按 type 整体替换**为对应固定模式，**禁止逐 token 转换**（如 `M/D`→`M/d`、`YYYY-MM-DD`→`yyyy-mm-dd` 均错——既非 antd 原值也非 eview 合法模式）。见 §2「format 映射规则」。**机器验证**：步骤 3 `check-datepicker-format.cjs` AST 扫 `<DatePicker format=...>` 字面量值，非固定模式全硬 FAIL。
> ⚠️ **onChange 参数顺序与 antd 相反**：antd `onChange(date, dateString)` → eview `onChange(dateString, date, target?, dstDate?)`，第一参从 dayjs 对象变字符串；**value 类型 dayjs → native Date**（`value={dayjs(x)}` 须 `.toDate()`）。两者均静默 bug，须人工保证（难静态校验）。见 §2「antd prop 映射差异」。

## 1. 功能定位

DatePicker 是日期 / 日期时间 / 月 / 季 / 年 / 周选择器，支持范围选择（仅 date / datetime）、可选范围限制、12 小时制、时区与夏令时。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 选一个日期 / 日期时间 | `DatePicker type="date" \| "datetime"` | antd `DatePicker` + `onChange` 回写 `value` |
| 选起止时间段 | `DatePicker range={[]}`（同一个组件） | `RangePicker`（不存在） |
| 选月 / 季 / 年 / 周 | `type="month" \| "quarter" \| "year" \| "week"` | `picker="month"` |
| 只选时间点（hh:mm） | `TimePicker`（[TimePicker.md](TimePicker.md)） | DatePicker |
| 相对时间范围（近 7 天） | `TimeRangeSelector`（后续批次）或 `SelectCard`（[SelectCard.md](SelectCard.md)） | 两个 DatePicker |

## 2. 事件与交互逻辑

### format 映射规则：按 type 整体替换，禁止逐 token 转换

eview-react 的 `format` 与 antd（dayjs）**完全不同**——它不是 token 拼接，而是按 `type` 从固定模式集合里取一个整体字符串。antd 的 `YYYY`/`MM`/`DD`/`M`/`D`/`HH`/`mm`/`ss` 等 token 在 eview 里**无意义**，逐字符转换（大小写换、删补位）产出的既不是 antd 原值也不是 eview 合法模式，组件渲染异常。**迁移规则：按源 antd 形态判定 eview `type`，整体替换 `format` 为对应固定模式，丢弃源 format 字符串。**

⚠️ **关键差异——RangePicker 不是独立组件**：antd 的 `RangePicker` 是从 DatePicker 解构出的**单独组件**（`DatePicker.RangePicker` / `import { RangePicker } from 'antd'`）；eview-react **没有 RangePicker 导出**，范围选择是**同一个 `DatePicker` 加 `range` prop**。并且 **`range` 模式只支持 `type="date"` 和 `type="datetime"`**——month/quarter/year/week 在 range 模式下**不可用**。RangePicker 的 `type` 由源 `showTime` 决定（有→`datetime`，无→`date`），**不涉及 `picker`**（antd RangePicker 本身就是日期范围，不带 `picker`）。

#### 普通 DatePicker 映射（`type` 由源 `picker` / `showTime` 决定）

| 源 antd 形态 | eview `type` | eview `format` |
|------------|-------------|----------------|
| `picker="date"`/默认，无 `showTime` | `date` | `yyyy-MM-dd` |
| `showTime`（日期+时间） | `datetime` | `yyyy-MM-dd HH:mm:ss`（源 format 无秒 → `yyyy-MM-dd HH:mm`） |
| `picker="month"` | `month` | `yyyy-MM` |
| `picker="quarter"` | `quarter` | `yyyy-QQ` |
| `picker="year"` | `year` | `yyyy` |
| `picker="week"` | `week` | `yyyy-wo` |

#### RangePicker 映射（`type` 仅由源 `showTime` 决定；range 模式只支持 date / datetime）

| 源 antd 形态（单独组件） | eview 形态（加 `range` prop） | eview `type` | eview `format` |
|------------------------|-------------------------------|-------------|----------------|
| `<RangePicker>`（无 `showTime`） | `<DatePicker range={[]} >` | `date` | `yyyy-MM-dd` |
| `<RangePicker showTime>` | `<DatePicker range={[]} >` | `datetime` | `yyyy-MM-dd HH:mm:ss`（源 format 无秒 → `yyyy-MM-dd HH:mm`） |

> ⚠️ range 模式**禁止**写 `type="month"`/`"quarter"`/`"year"`/`"week"`——eview-react range 不支持这些 type，组件会异常。若源 RangePicker 真带 `picker="month"` 等（antd 本身极少这样用），不能映射到 range 模式，需改用两个普通 DatePicker 或 `SelectCard`。

```tsx
// ❌ 逐 token 转换：M/D → M/d（dayjs D 被当 eview 小写 token），既非 antd 原值也非 eview 合法模式
<DatePicker.RangePicker format="M/D" />   // 迁移后变成
<DatePicker range={[]} type="date" format="M/d" />   // ❌ format="M/d" 非法，组件渲染异常

// ❌ 大小写错乱：YYYY-MM-DD → yyyy-mm-dd（mm 在 eview datetime 是分钟，不是月份；MM 才是月）
<DatePicker type="date" format="yyyy-mm-dd" />   // ❌ 应 yyyy-MM-dd

// ❌ range 模式用了不支持的 type
<DatePicker range={[]} type="month" format="yyyy-MM" />   // ❌ range 只支持 date/datetime

// ✅ 源 RangePicker（无 showTime）format="M/D" → type="date" + range + format="yyyy-MM-dd"
<DatePicker range={[]} type="date" format="yyyy-MM-dd" onChange={(s, d, t) => { /* target 'from'/'to' 收集起止 */ }} />

// ✅ 源 RangePicker showTime → type="datetime" + range + format="yyyy-MM-dd HH:mm:ss"
<DatePicker range={[]} type="datetime" format="yyyy-MM-dd HH:mm:ss" timeEmbedded onChange={(s, d, t) => { /* ... */ }} />

// ✅ 源普通 DatePicker showTime format="YYYY-MM-DD HH:mm" → type="datetime" + format="yyyy-MM-dd HH:mm"（无 range）
<DatePicker type="datetime" format="yyyy-MM-dd HH:mm" timeEmbedded value={v} onChange={(s, d) => d && setV(d)} />
```

> **机器验证**：步骤 3 `check-datepicker-format.cjs` 同时拦两类——① `<DatePicker format=...>` 字面量 format 非 eview 固定模式（FORMAT_INVALID 硬 FAIL）；② `<DatePicker range={...} type="month|quarter|year|week">` range 模式用了不支持的 type（RANGE_TYPE_INVALID 硬 FAIL）。见 [migration-workflow.md](../migration-workflow.md) §4.23。

### antd prop 映射差异（onChange 换序 / value 类型 / 无对等 prop）

eview-react DatePicker 与 antd DatePicker/RangePicker 差异大，除 format（见上）和 RangePicker→`range` prop（见上）外，以下差异迁移时必须处理：

#### onChange 参数顺序反转（静默 bug，最易漏）

antd `onChange(date: dayjs, dateString: string)` → eview `onChange(dateString, date?, target?, dstDate?)`。**第一参从 dayjs 对象变成字符串**——迁移时必须换序，否则 `setV(date)` 拿到字符串而非 Date。

```tsx
// ❌ antd 原样搬入：date 实参是字符串，setV 拿到字符串
<DatePicker onChange={(date, dateString) => setV(date)} />
// ✅ 换序 + 有效 Date 才回写（见模式 B）
<DatePicker onChange={(dateString, date) => { if (date) setV(date); }} />
```

range 模式用第 3 参 `target`（`'from'`/`'to'`）区分起止（见 §范围选择）。

#### value 类型：dayjs → native Date

antd `value`/`defaultValue` 是 `dayjs.Dayjs`；eview 是 `Date | string | number`（native Date）。迁移时 `value={dayjs(x)}` 须加 `.toDate()`，`defaultValue` 同理；range 模式 `range={[from, to]}` 数组里的 dayjs 也要逐个 `.toDate()`。

```tsx
// ❌ antd dayjs value 直接搬入
<DatePicker value={dayjs(record.time)} />
// ✅ 转 native Date
<DatePicker value={dayjs(record.time).toDate()} />
```

#### disabledDate（函数）→ dateRange（仅固定连续区间）

antd `disabledDate(current)` 函数可禁任意日期（过去、周末、特定日期列表）；eview `dateRange={dateFrom, dateTo}` 只能表达**一个连续区间**。

- 简单"禁过去/未来"→ `dateRange={{ dateFrom: new Date(), dateTo: 远期 }}`（或反向）
- 非连续/条件逻辑（禁周末、禁特定日期列表）→ **无对等**，丢弃 `disabledDate`，改业务层提交时校验

#### RangePicker 专属 prop

| antd prop | 处理 |
|----------|------|
| `ranges`（预设快捷范围 `{'今天': [...]}`） | **无对等**，丢弃或用外部按钮调 `setRange` 重建 |
| `placeholder` 数组 `['开始','结束']` | eview `placeholder` 单字符串（只支持一个）；起止分别提示用 `label` |
| `separator`（输入框间分隔符） | **无对等**，丢弃 |
| `order`（自动排序起止） | eview 不支持，业务自行处理 |

#### 其他无对等 antd prop（迁移时丢弃或重命名，不要原样搬到 eview）

| antd prop | 处理 |
|----------|------|
| `allowClear` | 无对等，丢弃（eview 无清除按钮 prop） |
| `open` / `onOpenChange` | 无对等，丢弃（eview 无受控 open） |
| `disabledTime` | 无对等，丢弃（datetime 禁时分秒无法表达） |
| `status` / `variant` | 无对等，丢弃（表单态业务层处理） |
| `cellRender` / `cellsRender` / `dateRender` | 无对等，丢弃（自定义单元格渲染不支持） |
| `defaultPickerValue` / `pickerValue` | 无对等，丢弃（无法控制面板默认月/年） |
| `onOk`（单选 datetime 的确定按钮） | eview `onOkClick` 是 **range 模式专用**，单选 datetime 无对等，丢弃 |
| `suffixIcon` / `prefixIcon` | 无对等，丢弃 |
| `inputReadOnly` | → eview `readOnly`（重命名） |
| `placement` | → eview `popupDirection`，枚举有损映射：`bottomLeft`/`bottomRight`→`bottom`、`topLeft`/`topRight`→`top`、`left`→`left`、`right`→`right` |
| `onSelect` / `mode` / `getPopupContainer` / `popupClassName` / `generateConfig` / `bordered` / `nextIcon` / `prevIcon` / `superNextIcon` / `superPrevIcon` | 无对等，丢弃 |

> **机器验证**：步骤 3 `check-datepicker-format.cjs` 的 `ANTD_PROP_RESIDUE`（advisory）AST 扫 `<DatePicker>` 上残留的 antd-only prop（`disabledDate`/`ranges`/`allowClear`/`open`/`onOpenChange`/`disabledTime`/`status`/`variant`/`cellRender`/`separator`/`suffixIcon`/`inputReadOnly`/`placement` 等），逐条回应写入 `datePickerFormatReviews`。**onChange 换序与 value 类型难静态判定**，须按上表人工保证。

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

### 范围选择：range 属性开启，用 onChange 取起止（实测 onOkClick 不返回 fromDateObj/toDateObj）

> ⚠️ **实测问题**：官方文档说 `onOkClick` 的 `obj` 含 `fromDateObj` / `toDateObj`，但实际上 `onOkClick` 是分两次回调（`type: 'from'` 和 `type: 'to'`），每次只返回单日期对象，**不含** `fromDateObj` / `toDateObj`。因此在 range 模式下应使用 `onChange` 监听 `target` 参数来分别收集起止日期。

```tsx
const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

<DatePicker
  type="datetime"
  format="yyyy-MM-dd HH:mm"
  timeEmbedded
  range={range ? range.map(d => d?.toDate?.() || d) : []}    // range prop 传实际值供 DatePicker 显示已选状态
  onChange={(dateString: string, date?: Date, target?: string) => {
    // target: 'from' | 'to'
    if (!date) return;
    if (target === 'from') {
      const to = range?.[1] || dayjs();
      setRange([dayjs(date), to]);
    } else if (target === 'to') {
      const from = range?.[0] || dayjs();
      setRange([from, dayjs(date)]);
    }
  }}
  onCancelClick={() => {}}
/>
// 提交时：const [from, to] = range;
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
| `format` | `string`，默认 `yyyy-MM-dd` | **只接受按 type 的固定模式**：date `yyyy-MM-dd`；datetime `yyyy-MM-dd HH:mm:ss`（或 `yyyy-MM-dd HH:mm`）；month `yyyy-MM`；quarter `yyyy-QQ`；year `yyyy`；week `yyyy-wo`。**不支持 antd/dayjs 任意 token**，迁移时按 type 整体替换（见 §2 format 映射规则，禁止逐 token 转换如 `M/D`→`M/d`） |
| `value` | `Date \| string \| number` | 当前值；**建议 Date、24 小时制，且不要用 onChange 回写** |
| `defaultValue` | `Date \| string` | 初始值，**只在初始化生效** |
| `dateRange` | `{ dateFrom: Date, dateTo: Date }` | 可选范围限制 |
| `range` | `(Date \| string)[]` | 传数组开启范围选择（仅 date / datetime） |
| `onChange` | `(dateString, date?, target?, dstDate?) => void` | 变更；范围时 `target` 为 `from` / `to` |
| `onOkClick` / `onCancelClick` | `(obj, event, target?) => void` | 范围模式确定 / 取消；`obj` 含 `fromDateObj` / `toDateObj` / `fromSelectDate` / `toSelectDate` / `dateFormate` |
| `onBlur` | `(ev: { event, value: Date, text, format }) => void` | 输入框失焦 |
| `required` / `disabled` / `readOnly` | `boolean`，默认 `false` | 必填 / 禁用 / 输入框只读 |
| `size` | `'small' \| 'middle' \| 'large'`，默认 `middle` | 尺寸；与 antd `size` 枚举一致，可直接透传 |
| `placeholder` / `label` | `string` | 占位 / 名称 |
| `hintType` | `'div' \| 'tip' \| 'none'`，默认 `tip` | 提示形式 |
| `timeFormat` / `amPm` | `string`（默认 `hh:mm:ss`）/ `boolean` | datetime 时间格式 / 12 小时制 |
| `showNow` | `boolean` | 面板显示"此刻" |
| `timeEmbedded` | `boolean` | 表内无说明；demo 在 aui3_1 主题下为 true |
| `popupDirection` | `'top' \| 'bottom' \| 'left' \| 'right'` | 弹出方向 |
| `showTimezone` / `timezoneRule` | `boolean` / `any` | 时区显示 / 夏令时规则（手动 DST 已废弃） |
| `ifTriggerOnChangeWithCalender` | `boolean`，默认 `true` | 打开面板时是否触发 onChange |
| `ref.getValue()` | `() => Date` | 取当前值（demo DateTimePicker.jsx） |
