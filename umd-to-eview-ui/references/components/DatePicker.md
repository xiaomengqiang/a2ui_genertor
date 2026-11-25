# DatePicker 日期选择框

> 分类：数据录入

输入或选择日期的控件。<br/>
新版 DatePicker 不再提供 getValue 等 angularjs 风格方法，请使用`value`与`onChange`维护 value 值，直接访问。<br/>
使用快捷键时，打开日期面板后需要先按一下Tab键，然后再按ctrl+左右键/上下键，ctrl+左右键切换月份，ctrl+上下键切换年份，Tab键切换面板


## antd 迁移注意事项

> 导入特例：`import DatePicker from 'eview-ui/DatePicker'; const { RangePicker } = DatePicker;`（`<DatePicker.RangePicker>` 改 `<RangePicker>`）

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `DatePicker` | `DatePicker` | `picker`→**`type`**（`date`/`datetime`/`year`/`month`/`week`）；`value` 接受 Date/string/number；`placeholder` 同名；**`disabledDate` 回调→`range=[start, end]` 值数组**（静态范围，动态禁用逻辑需业务前置过滤）；`format` 支持数组（多格式匹配、展示第一个）；`showTime`→`type="datetime"`（可选 `ampm`）；`rules=[{validator, message, required}]`；**无 getValue()**（新版用 value+onChange 维护）；ref：`focus/blur/validate/clearValidation/hideValidateTips` |
| `DatePicker.RangePicker` | `RangePicker`（解构） | `import DatePicker from 'eview-ui/DatePicker'; const { RangePicker } = DatePicker;`；`value=[Date, Date]` 数组；`placeholder=['开始日期','结束日期']` 数组；可选范围同用 `range`；`separator` 设置分隔符；`format` 仅支持 string（不支持数组）；`onChange(date[], detail[])` 两个参数；**JSX 标签 `<DatePicker.RangePicker>` 改为 `<RangePicker>`**（成员访问形式改解构变量） |

## API

### DatePicker 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:---------|:-----|:-----|:-----|
| value | 日期值 | Date \| string \| number | - |
| format | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [moment.js](https://momentjs.com/docs/#/parsing/string-formats/) | string \| string[] | 见[默认Format](#默认-format) |
| placeholder | 输入框提示文字 | string | - |
| style | 自定义输入框样式 | CSSProperties |  |
| className | 自定义输入框className | string |  |
| popupStyle | 自定义弹出日历样式 | CSSProperties |  |
| popupClassName | 自定义弹出日历 className | string |  |
| zIndex | 自定义弹出日历zIndex | number | ConfigProvider的baseZIndex |
| disabled | 是否禁用日期组件 | boolean | false |
| showToday | 是否展示"此刻"按钮 | boolean | true |
| readOnly | 是否只读 | boolean | false |
| open | 是否打开选择时间弹层（受控） | boolean | false |
| type | 设置选择器类型 | 'date' \| 'datetime' \| 'year' \| 'month' \| 'week' | 'date' |
| range | 日期的可选范围 [start, end]。建议通过rangeFormat来指定格式，以被组件正确识别；或者传入通用时间格式，形如 2021/08/05 04:54:03。start与end可以置为null，组件会自动填充。如果值只设置了日期，没有时分秒，组件会自动补零 | [ValueType, ValueType] | null |
| rangeFormat | 可选范围的日期格式，配置参考 moment.js | string |  |
| ampm | 是否提供AM/PM选择器，该值为true且type='datetime'时才会生效。AM表示凌晨00:00:00到上午11:59:59；PM表示下午12:00:00到晚上23:59:59。12:00:00 AM表示凌晨00:00:00，12:00:00 PM表示中午12:00:00。与显示格式无关 | boolean | false |
| timezone | 设置时区，有夏令时的时区默认会有夏令时计算（如Asia/Shanghai）。[所有时区列表](https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json)。注意：目前设置时区会对所有DatePicker实例都生效 | string | - |
| showDST | 是否展示夏令时标志 | boolean | true |
| showFormat | 输入错误时是否展示日期格式提示 | boolean | true |
| formatRender | 自定义格式错误提示的格式内容 | (format: string) => string |  |
| rules | 校验规则，onBlur时触发 | [Rule](#rule)[] | - |
| validationTipsType | 校验提示类型 | 'div' \| 'tipbox' | 'div' |
| locale | 语言配置：zh显示上午下午，en显示AM PM | 'zh' \| 'en' |  |
| onChange | 时间发生变化的回调，发生在用户选择时间时 | (date: string, detail?: TimeDetail) => void |  |
| onOpenChange | 弹出日历和关闭日历的回调 | (open: boolean) => void | - |
| onInputKeyDown | 时间输入框的键盘事件回调 | (e: React.KeyboardEvent<HTMLInputElement>) => void |  |
| getPopupContainer | 获取渲染父节点，设为false时为元素虚拟dom的原位置 | (() => HTMLElement) \| false | - |
| minutesInterval | 当PickerType为datetime且可以选择到分钟时，设置分钟选项的间隔。该参数为大于0的整数或对象 | number \| {start?: number; end?: number; step?: number} | 1 |
| version | 设置组件版本，用于控制样式版本（如'aui3-1'），未设置时从ConfigProvider的context中获取 | string |  |
| theme | 设置组件主题，未设置时从ConfigProvider的context中获取 | string |  |

### RangePicker 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:---------|:-----|:-----|:-----|
| value | 日期范围值 | Array\<Date \| string \| number\> | null |
| format | 设置日期格式（RangePicker仅支持string，不支持数组） | string | 见[默认Format](#默认-format) |
| placeholder | 输入框提示文字 | [string, string] |  |
| style | 自定义输入框样式 | CSSProperties |  |
| type | 设置选择器类型 | 'date' \| 'datetime' \| 'year' \| 'month' \| 'week' | 'date' |
| separator | 设置分隔符 | string | '~' |
| range | 日期的可选范围 [start, end] | [ValueType, ValueType] | null |
| rangeFormat | 可选范围的日期格式 | string |  |
| ampm | 是否提供AM/PM选择器（需type='datetime'） | boolean | false |
| timezone | 设置时区 | string | - |
| showDST | 是否展示夏令时标志 | boolean | true |
| showToday | 是否展示"此刻"按钮 | boolean | true |
| showFormat | 输入错误时是否展示日期格式提示 | boolean | true |
| formatRender | 自定义格式错误提示的格式内容 | (format: string) => string |  |
| disabled | 是否禁用 | boolean | false |
| readOnly | 是否只读 | boolean | false |
| open | 是否打开选择时间弹层（受控） | boolean | false |
| zIndex | 自定义弹出日历zIndex | number | ConfigProvider的baseZIndex |
| popupStyle | 自定义弹出日历样式 | CSSProperties |  |
| popupClassName | 自定义弹出日历 className | string |  |
| locale | 语言配置 | 'zh' \| 'en' |  |
| onChange | 时间发生变化的回调 | (date: string[], detail?: TimeDetail[]) => void |  |
| onOpenChange | 弹出日历和关闭日历的回调 | (open: boolean) => void | - |
| getPopupContainer | 获取渲染父节点 | (() => HTMLElement) \| false | - |
| minutesInterval | 分钟选项间隔 | number \| {start?: number; end?: number; step?: number} | 1 |
| version | 设置组件版本 | string |  |
| theme | 设置组件主题 | string |  |

### TimeDetail 类型

onChange回调的第二个参数类型：

| 字段 | 类型 | 描述 |
|:-----|:-----|:-----|
| moment | Moment | moment对象（可调用moment的API进行时间操作） |
| isDst | boolean | 是否为夏令时 |
| unix | number | UNIX时间戳 |
| utcTime | string | UTC时间字符串 |

## Rule

| 名称 | 说明 | 类型 |
|:-----|:-----|:-----|
| validator | 自定义校验 | (value: Moment) => boolean |
| message | 错误信息 | string |
| required | 是否为必选字段 | boolean |

## 方法

| 方法名 | 描述 | 参数 | 返回值 |
|:-------|:-----|:-----|:-------|
| blur() | 移除焦点 | | |
| focus() | 获取焦点 | | |
| validate() | 手动校验 | | result: boolean |
| clearValidation() | 清除校验 | | |
| hideValidateTips() | 隐藏校验气泡 | | |

## 静态方法

| 方法名 | 描述 | 参数 | 返回值 |
|:-------|:-----|:-----|:-------|
| DatePicker.convertFormat | 将Cloudsop平台日期格式转换为moment格式（y→Y, d→D, aa→A, ZZ→Z） | (format: string) | string |

## 默认 Format

| 组件 | 格式 |
|:-----|:-----|
| datetime | YYYY-MM-DD HH:mm:ss |
| datetime (ampm) | YYYY-MM-DD hh:mm:ss A |
| date | YYYY-MM-DD |
| month | YYYY-MM |
| year | YYYY |
| week | YYYY-[W]w |

## 使用示例

### 基本

最简单的用法，在浮层中可以选择或者输入日期。

```jsx
import DatePicker from "eview-ui/DatePicker";

<DatePicker value="2020-01-01" placeholder="请选择日期" onChange={(value) => {
  // 取 value 更新
}}/>
<DatePicker value="2020-01" placeholder="请选择月份" onChange={(value) => {
  // 取 value 更新
}} type="month"/>
<DatePicker value="2020-W1" placeholder="请选择周" onChange={(value) => {
  // 取 value 更新
}} type="week"/>
<DatePicker value="2020" placeholder="请选择年份" onChange={(value) => {
  // 取 value 更新
}} type="year"/>
```

### 日期时间

增加选择时间功能，`ampm`可以设置选择器是否使用 12 小时制，与日期是否显示上下午无关。
<br/>
是否显示 12 小时制通过`format`设置，格式设置查阅[moment](https://momentjs.com/docs/)

```jsx
import DatePicker from "eview-ui/DatePicker";
const { RangePicker } = DatePicker;

<DatePicker placeholder="日期时间(24小时制)" type="datetime" onChange={(value) => {
  // 取 value 更新
}}/>
<DatePicker
  style={{ width: "15rem" }}
  placeholder="日期时间(12小时制)"
  onChange={(value) => {
    // 取 value 更新
  }}
  type="datetime"
  format="YYYY-MM-DD hh:mm:ss A"
  ampm
/>
<RangePicker type="datetime" placeholder={["开始日期", "结束日期"]} onChange={(value) => {
  // 取 value 更新
}}/>
```

### 范围选择器

选择日期范围

```jsx
import DatePicker from "eview-ui/DatePicker";
const { RangePicker } = DatePicker;

<RangePicker value={["2020-01-01", "2020-02-01"]} onChange={(value) => {
  // 取 value 更新
}} placeholder={["开始日期", "结束日期"]}/>
<RangePicker value={["2020-01", "2020-02"]} onChange={(value) => {
  // 取 value 更新
}} type="month" placeholder={["开始月份", "结束月份"]}/>
<RangePicker value={["2020", "2021"]} onChange={(value) => {
  // 取 value 更新
}} type="year" placeholder={["开始年", "结束年"]}/>
```

### 夏令时

默认支持夏令时，`timezone`传入时区，带有夏令时的时区会默认计算好夏令时
<br/>
获取当前UTC时间：moment(\`${YOUR_DATE}\`).utc()
<br/>
获取当前UNIX时间戳：moment(\`${YOUR_DATE}\`).unix()
<br/>
更多时间处理API可查阅[moment](https://momentjs.com/docs/)
<br/>
注意：目前设置时区会对所有DatePicker实例都生效

```jsx
import DatePicker from "eview-ui/DatePicker";

// timezone：'Asia/Shanghai' | 'Europe/Paris' | 'Europe/London' | 'America/Los_Angeles'
<DatePicker timezone="Asia/Shanghai" value={new Date()} style={{ margin: "1rem 1rem 0 0" }}/>
<DatePicker type="datetime" timezone="Asia/Shanghai" value={new Date()}/>
```

### 日期格式

使用`format`属性，可以自定义日期显示格式。格式设置查阅[moment](https://momentjs.com/docs/)
<br/><br/>
请注意：因为moment格式与Cloudsop平台日期格式不兼容，目前处理方式如下
<br/>
1. 在cloudsop平台下，不传入format时，且type=`datetime`，组件自动获取cookie中的format并转换
<br/>
2. 自行通过`DatePicker.convertFormat`对cookie中的`format`进行转换

```jsx
import DatePicker from "eview-ui/DatePicker";
const { RangePicker } = DatePicker;

<DatePicker value={new Date()} format="YYYY/MM/DD"/>
<DatePicker value={new Date()} type="month" format="YYYY/MM"/>
<RangePicker value={[new Date(), new Date()]} format="MM/DD-YYYY"/>
```

### 时间校验

传入`rules`定义校验规则，调用`validate()`进行结果校验

```jsx
import DatePicker from "eview-ui/DatePicker";
import Button from "eview-ui/Button";
import moment from "moment";

const ref = React.useRef();

// validationTipsType: 'div' | 'tipbox'
<DatePicker
  ref={ref}
  validationTipsType="div"
  rules={[
    { required: true, message: "时间必填" },
    {
      validator: (value) => {
        return value < moment();
      },
      message: "请选择今天以前的日期",
    },
  ]}
/>
<Button style={{ marginLeft: "1rem" }} text="校验" onClick={() => { ref.current.validate(); }}/>
<Button style={{ marginLeft: "1rem" }} text="清除" onClick={() => { ref.current.clearValidation(); }}/>
```

### 禁用、只读

`disabled`属性设置选择框的不可用状态，`readOnly`属性设置输入框只读，不可编辑

```jsx
import DatePicker from "eview-ui/DatePicker";
const { RangePicker } = DatePicker;

<DatePicker value={new Date()} disabled/>
<RangePicker value={[new Date(), new Date()]} disabled/>
<DatePicker value={new Date()} readOnly/>
<RangePicker value={[new Date(), new Date()]} readOnly/>
```

### 可选范围

`range`属性设置日期可选范围

```jsx
import DatePicker from "eview-ui/DatePicker";
const { RangePicker } = DatePicker;

<DatePicker placeholder="请选择日期" range={["2020-03-15", "2020-04-15"]}/>
<RangePicker placeholder={["开始日期", "结束日期"]} range={["2020-03-15", "2020-04-15"]}/>
```

