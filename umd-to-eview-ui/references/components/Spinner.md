# Spinner 计数器

> 分类：数据录入

通过步伐对数字进行微调，可以设置数字的初始值，最大值，最小值等。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法     | eview 写法 | 迁移要点                                                                                                                                                                                                                                                          |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `InputNumber` | `Spinner`  | `value` **默认 0**（antd 无默认，空态需注意）；**`onChange(value)` 仅有效值触发 + `onError(value)` 接无效值**（两路分流）；`onBlur(value)` **参数是值不是事件**；`min`/`max`/`step`/`precision` 同名；无 `controls`/`formatter` 字符串形态（有 `formatter` 函数） |

## API

| 方法名   | 描述               | 参数 | 返回值     |
| -------- | ------------------ | ---- | ---------- |
| getValue | 获取当前文本框的值 | 无   | 文本框的值 |

### 属性

| 属性名称               | 描述                                                                                                                                                                                                                                                                                                                         | 输入                                                                     | 默认                                             |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :----------------------------------------------- |
| id                     | 定制组件id，传入该值可覆盖组件自动生成的id 例如：id = {'eui_spinner_1001'}                                                                                                                                                                                                                                                   | string                                                                   |                                                  |
| className              | 通过class的方式自定义组件样式 例如：className = {'spinnerClassName'}                                                                                                                                                                                                                                                         | string                                                                   |                                                  |
| disabledBlurFunction   | 设置是否禁用blur事件对应功能（自动修正错误值）；禁用后onBlur api会失效                                                                                                                                                                                                                                                       | boolean                                                                     | false                                            |
| style                  | 自定义计数器样式 例如：style = {{ color: 'red' }}                                                                                                                                                                                                                                                                            | object                                                                   |                                                  |
| inputClassName         | 通过添加class的方式自定义计数器输入框的样式                                                                                                                                                                                                                                                                                  | string                                                                   |                                                  |
| labelClassName         | 通过添加class的方式自定义计数器的label的样式                                                                                                                                                                                                                                                                                 | string                                                                   |                                                  |
| labelStyle             | 通过添加style的方式自定义计数器的名称的样式                                                                                                                                                                                                                                                                                  | object                                                                   |                                                  |
| label                  | 设置计数器的label                                                                                                                                                                                                                                                                                                            | string                                                                   |                                                  |
| labelPosition          | 设置计数器label的位置，before代表在计数器的左边，after代表在计数器的右边                                                                                                                                                                                                                                                     | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br>                             | before                                           |
| focusTip               | 组件获取焦点时弹出提示，失去焦点时消失                                                                                                                                                                                                                                                                                       | string                                                                   |                                                  |
| tipStyle               | 自定义提示框样式                                                                                                                                                                                                                                                                                                             | object                                                                   |                                                  |
| decTitle               | 自定义当鼠标获取减号的焦点时，显示的文本内容 例如：decTitle = {'减'}                                                                                                                                                                                                                                                         | string                                                                   |                                                  |
| incTitle               | 自定义当鼠标获取加号的焦点时，显示的文本内容 例如：incTitle = {'加'}                                                                                                                                                                                                                                                         | string                                                                   |                                                  |
| min                    | 自定义计数器的最小值，默认为 Number.MIN_SAFE_INTEGER 例如：min = {6}                                                                                                                                                                                                                                                         | number                                                                   | Number.MIN_SAFE_INTEGER                          |
| max                    | 自定义计数器的最大值，默认为 Number.MAX_SAFE_INTEGER 例如：max = {10}                                                                                                                                                                                                                                                        | number                                                                   | Number.MAX_SAFE_INTEGER                          |
| minMaxCycle            | 数字是否循环显示，如增加到最大值时，继续增加返回至最小值，在设置min和max的情况下使用                                                                                                                                                                                                                                         | boolean                                                                     | false                                            |
| \*rangeArray           | 此属性即将废弃，不建议使用                                                                                                                                                                                                                                                                                                   | /                                                                        | /                                                |
| step                   | 自定义计数器的步伐，默认为1 例如：step = {1}                                                                                                                                                                                                                                                                                 | number                                                                   | 1                                                |
| value                  | 用户设置计数器初始值，例如：value = {0} or value = {'12:00 AM'}                                                                                                                                                                                                                                                              | enum:<br>&nbsp;"number"<br>&nbsp;"String"<br>                            | 0                                                |
| disabled               | 自定义组件是否灰化，默认为false 例如：disabled = {true}                                                                                                                                                                                                                                                                      | boolean                                                                     | false                                            |
| onChange               | 自定义计数器文本框值改变时的回调方法(有效值时调用)<br><br>**签名:**<br>`function(value: number) => void`<br>_value:_ 文本框的值                                                                                                                                                                                              | function                                                                 |                                                  |
| onError                | 自定义计数器文本框值改变时的回调方法(无效值时调用)<br><br>**签名:**<br>`function(value: number) => void`<br>_value:_ 文本框的值                                                                                                                                                                                              | function                                                                 |                                                  |
| onFoucs                | 自定义计数器文本框聚焦时的回调<br><br>**签名:**<br>`function(event: object) => void`<br>_event:_ 原生dom的event                                                                                                                                                                                                              | function                                                                 |                                                  |
| onBlur                 | 自定义计数器文本框失焦时的回调<br><br>**签名:**<br>`function(value: number) => void`<br>_value:_ 文本框的值                                                                                                                                                                                                                  | function                                                                 |                                                  |
| required               | 支持设置组件值是否必须，若为必须，则input前的label文字前加\*，同时支持非空校验                                                                                                                                                                                                                                               | boolean                                                                     | false                                            |
| locale                 | 当amPm为true时，设置后缀名是中文（上午/下午）还是英文（AM/PM），如果不设置，则使用ConfigProvider中配置的语言                                                                                                                                                                                                                 | 'en'                                                                     | 'zh'                                             |
| precision              | 支持设置组件值精度                                                                                                                                                                                                                                                                                                           | number                                                                   | 0                                                |
| formatter              | 格式化输入框显示，聚焦时显示原值。签名:`(value: number, precision: number) => string`                                                                                                                                                                                                                                        | function                                                                 | `(value, precision) => value.toFixed(precision)` |
| type                   | Spinner类型,'number','time', 'customWithPrefixs'，分别表示数字型、时间型、自定义前缀类型。                                                                                                                                                                                                                                   | enum:<br>&nbsp;"number"<br>&nbsp;"time"<br>&nbsp;"customWithPrefixs"<br> | "number"                                         |
| timeFormat             | 指定时间格式，有效的时间格式为 'hh:mm:ss','hh:mm'.                                                                                                                                                                                                                                                                           | string                                                                   | hh:mm:ss                                         |
| amPm                   | 使用am pm格式.                                                                                                                                                                                                                                                                                                               | boolean                                                                     | false                                            |
| onCustomIncOrDecClick  | 当type为'customWithPrefixs'时，点击Spinner的加减号的回调函数。<br><br>**签名:**<br>`function(changeTag: string, direction: number,currentValue: string) => void`<br>_changeTag:_ 加减号修改的内容。修改前缀时值为'prefix'，修改内容时值为'content'<br>*direction:*执行加操作时为1，减操作时为-1<br>*currentValue:*输入框的值 | function                                                                 |                                                  |
| tipStyle               | 通过添加tipStyle来自定义提示框的样式                                                                                                                                                                                                                                                                                         | object                                                                   |                                                  |
| isCustomerValidatorMsg | 配合form,通过isCustomerValidatorMsg变量控制是否需要显示自定义异常提示信息                                                                                                                                                                                                                                                    | boolean                                                                     | false                                            |

## 使用示例

### 基本属性设置

```jsx
import Spinner from "eview-ui/Spinner";

const style = { marginRight: "50px" };
const labelStyle = { display: "block", paddingLeft: "0px" };

<>
  <Spinner value={50} min={0} max={100} step={1} label={"Default style"} labelStyle={labelStyle} style={style} />
  <Spinner decTitle={"dec"} incTitle={"inc"} value={89} min={1} max={100} step={2} label={"Disabled Style"} disabled={true} labelStyle={labelStyle} style={style} />
  <Spinner value={3.14} min={0} max={100} step={0.2} precision={2} label={"Precision style"} labelStyle={labelStyle} style={style} />
  <Spinner value={1} min={0} max={100} step={1} label={"Min Max Cycle"} labelStyle={labelStyle} style={style} minMaxCycle={true} />
</>
```

### 事件处理

```jsx
import Spinner from "eview-ui/Spinner";

// value 受控：配合 onChange 更新；ref.getValue() 可取当前值
<Spinner
  label={"Event Callback:"}
  value={0}
  onChange={(value) => {
    // value 为新值（非 event）
  }}
  required
  ref={(spinner) => {
    // spinner.getValue() 取当前值
  }}
/>
```

### 微调器类型时间演示

```jsx
import Spinner from "eview-ui/Spinner";

const style = { marginRight: "50px" };
const labelStyle = { display: "block", paddingLeft: "0px" };

// type="time": value 为时间字符串，timeFormat 控制格式，amPm 开启 12 小时制
<>
  <Spinner type={"time"} value={"12:00"} timeFormat={"hh:mm"} amPm={false} label={"Time Format:hh:mm "} labelStyle={labelStyle} style={style} />
  <Spinner type={"time"} timeFormat={"hh:mm"} value={"12:00"} disabled={true} amPm={true} label={"Time Format:hh:mm Enable AM/PM "} labelStyle={labelStyle} style={style} />
  <Spinner type={"time"} timeFormat={"hh:mm:ss"} amPm={false} value={"15:33:26"} label={"Time Format:hh:mm:ss "} labelStyle={labelStyle} style={style} />
  <Spinner type={"time"} timeFormat={"hh:mm:ss"} amPm={true} value={"11:33:26 AM"} label={"Time Format:hh:mm:ss Enable AM/PM  "} labelStyle={labelStyle} style={style} />
</>
```

### 微调器类型时间事件演示

```jsx
import Spinner from "eview-ui/Spinner";

// type="time": value 受控，onChange 回调首参为新值（非 event）
<Spinner
  label={"Event Callback:"}
  value={"11:33:26 AM"}
  onChange={(value) => {
    // value 为新时间值
  }}
  required
  type={"time"}
  timeFormat={"hh:mm:ss"}
  amPm={true}
  ref={(spinner) => {
    // spinner.getValue() 取当前值
  }}
/>
```

### 支持自定义前缀

```jsx
import Spinner from "eview-ui/Spinner";

// type="customWithPrefixs": 自定义前缀微调器
// onCustomIncOrDecClick(changeTag, direction, currentValue)
//   changeTag: "content"（调整数值）| "prefix"（切换前缀）；direction: +1/-1；currentValue: 当前完整值
<Spinner
  label={"Custom Prefix"}
  value={"D'8"}
  onChange={(value) => {
    // value 为新值
  }}
  required
  type={"customWithPrefixs"}
  customPrefix={"H'"}
  onCustomIncOrDecClick={(changeTag, direction, currentValue) => {
    // 取 changeTag/direction/currentValue 计算新值并更新
  }}
  ref={(spinner) => {
    // spinner.getValue() 取当前值
  }}
/>
```
