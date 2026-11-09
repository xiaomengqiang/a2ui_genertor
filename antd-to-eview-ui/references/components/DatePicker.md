# DatePicker 日期选择框

> 分类：数据录入

输入或选择日期的控件。<br/>
新版 DatePicker 不再提供 getValue 等 angularjs 风格 方法，请使用`value`与`onChange`维护 value 值，直接访问。<br/>
使用快捷键时，打开日期面板后需要先按一下Tab键，然后再按ctrl+左右键/上下键,ctrl+左右键切换月份，ctrl+上下键切换年份，Tab键切换面板

## API

### 属性

| 属性名称               | 描述                                                                                                                                                                           | 输入                                                                                                         | 默认                          |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|-----------------------------|
| value              | 日期值                                                                                                                                                                          | Date \| string                                                                                             | number                      | -      |
| format             | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [moment.js](https://momentjs.com/docs/#/parsing/string-formats/)                                                                            | string\| string[]                                                                                          |                             |
| placeholder        | 输入框提示文字                                                                                                                                                                      | string                                                                                                     | -                           |
| style              | 自定义输入框样式                                                                                                                                                                     | CSSProperties                                                                                              |                             |
| className          | 自定义输入框className                                                                                                                                                              | string                                                                                                     |                             |
| popupStyle         | 自定义弹出日历样式                                                                                                                                                                    | CSSProperties                                                                                              |                             |
| popupClassName     | 自定义弹出日历 className                                                                                                                                                            | string                                                                                                     |                             |
| zIndex             | 自定义弹出日历zIndex                                                                                                                                                                | number                                                                                                     | 100000                      |
| disabled           | 是否禁用日期组件                                                                                                                                                                     | boolean                                                                                                    | false                       |
| showToday          | 是否展示“此刻”按钮                                                                                                                                                                   | boolean                                                                                                    | true                        |
| readOnly           | 是否禁用                                                                                                                                                                         | bool                                                                                                       | false                       |
| type               | 设置选择器类型                                                                                                                                                                      | 'date' \| 'datetime'                                                                                       | 'year' \| 'month' \| 'week' | date   |
| range              | 1、日期的可选范围 \[start, end\]。建议通过rangeFormat来指定格式，以被组件正确识别；或者传入通用时间格式，形如 2021/08/05 04:54:03。<br>2、start与end 可以置为null，组件会自动填充<br>3、如果值只设置了日期，没有时分秒，组件会自动补零                       | \[string, string\]                                                                                         | null                        |
| rangeFormat        | 可选范围的日期格式                                                                                                                                                                    |                                                                                                            |                             |
| ampm               | 是否提供AM/PM选择器，该值为true且type='datetime'时，才会生效。<br/>AM - 表示凌晨00:00:00到上午11:59:59; PM - 表示下午12:00:00到晚上23:59:59<br/>12:00:00 AM 表示凌晨00:00:00, 12:00:00 PM表示中午12:00:00<br/>与显示格式无关 | bool                                                                                                       | false                       |
| timezone           | 设置时区 ，有夏令时的时区默认会有夏令时计算（如Asia/Shanghai）[所有时区列表](https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json)                                               | string                                                                                                     | -                           |
| showDST            | 是否展示夏令时标志                                                                                                                                                                    | bool                                                                                                       | true                        |
| showFormat         | 输入错误时是否展示日期格式提示                                                                                                                                                              | bool                                                                                                       | true                        |
| rules              | 检验规则                                                                                                                                                                         | [Rule](#Rule)[]                                                                                            | -                           |
| validationTipsType | 检验提示类型                                                                                                                                                                       | 'div' \| 'tipbox'                                                                                          | div                         |
| locale             | zh: 显示上午下午， en: 显示AM PM                                                                                                                                                      | 'zh'\| 'en'                                                                                                |                             |
| onChange           | 时间发生变化的回调，发生在用户选择时间时                                                                                                                                                         | (date: string, <br/>{ moment:Momemt,<br/>isDst:boolean,<br/>unix: number, <br/>utcTime: string }) => void; | null                        |
| onOpenChange       | 弹出日历和关闭日历的回调                                                                                                                                                                 | (open: boolean) => void;                                                                                   | -                           |
| getPopupContainer  | 获取渲染父节点, 设为false时为元素虚拟dom的原位置                                                                                                                                                | (() => HTMLElement) &#124; false                                                                           | -                           |
| minutesInterval    | 当PickerType为datetime且可以选择到分钟时，设置分钟选项的间隔。该参数为大于0的整数或对象                                                                                                                        | number \| {start:number; end:number; step:number}                                                          | 1                           |

## Rule

| 名称        | 说明      | 类型                          |
|-----------|---------|-----------------------------|
| validator | 自定义校验   | (value: Moment) => boolean; |
| message   | 错误信息    | string                      |
| required  | 是否为必选字段 | boolean                     |

## 方法

| 方法名                | 描述     | 参数 | 返回值             |
|--------------------|--------|----|-----------------|
| blur()             | 移除焦点   |    |                 |
| focus()            | 获取焦点   |    |                 |
| validate()         | 手动校验   |    | result: boolean |
| clearValidation()  | 清除校验   |    |                 |
| hideValidateTips() | 隐藏校验气泡 |    |                 |

## 默认 Format

| 组件       | 格式                  |
|----------|---------------------|
| datetime | YYYY-MM-DD HH:mm:ss |
| date     | YYYY-MM-DD          |
| month    | YYYY-MM             |
| year     | YYYY                |
| week     | YYYY-w              |

## 使用示例

### 基本

最简单的用法，在浮层中可以选择或者输入日期。

```jsx
import { DatePicker } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


function DatePickerDemo() {
  const [date, setDate] = React.useState();
  const [month, setMonth] = React.useState();
  const [week, setWeek] = React.useState();
  const [year, setYear] = React.useState();

  const [version, theme] = getDemoVersion();

  const onDateChange = (value) => {
    setDate(value);
  };
  const onMonthChange = (value) => {
    setMonth(value);
  };
  const onWeekChange = (value) => {
    setWeek(value);
  };
  const onYearChange = (value) => {
    setYear(value);
  };

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <DatePicker value={date} placeholder="请选择日期" onChange={onDateChange}/>
        <br/><br/>
        <DatePicker value={month} placeholder="请选择月份" onChange={onMonthChange} type="month"/>
        <br/><br/>
        <DatePicker value={week} placeholder="请选择周" onChange={onWeekChange} type="week"/>
        <br/><br/>
        <DatePicker value={year} placeholder="请选择年份" onChange={onYearChange} type="year"/>
      </>
    </ConfigProvider>);
}
ReactDOM.render(
  <DatePickerDemo />,
  mountNode,
);
```

### 日期时间

增加选择时间功能，`ampm`可以设置选择器是否使用 12 小时制，与日期是否显示上下午无关。
<br/>
是否显示 12 小时制通过`format`设置，格式设置查阅[moment](https://momentjs.com/docs/)

```jsx
import { DatePicker } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const { RangePicker } = DatePicker;

function onChange(date) {
  console.log(date);
}

const [version, theme] = getDemoVersion();

ReactDOM.render(
  <ConfigProvider version={version} theme={theme}>
    <>
      <DatePicker placeholder="日期时间(24小时制)" type="datetime" onChange={onChange}/>
      <br/>
      <br/>
      <DatePicker
        style={{width: '15rem'}}
        placeholder="日期时间(12小时制)"
        onChange={onChange}
        type="datetime"
        format="YYYY-MM-DD hh:mm:ss A"
        ampm
      />
      <br/>
      <br/>
      <RangePicker type="datetime" placeholder={['开始日期', '结束日期']} onChange={onChange}/>
    </>
  </ConfigProvider>,
  mountNode
);
```

### 范围选择器

选择日期范围

```jsx
import { DatePicker } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const { RangePicker } = DatePicker;

function DatePickerDemo() {
  const [version, theme] = getDemoVersion();
  const [value, setState] = React.useState([]);

  const onChange = (date) => {
    setState(date);
  };

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <RangePicker value={value} onChange={onChange} placeholder={['开始日期', '结束日期']}/>
        <br/>
        <RangePicker value={value} onChange={onChange} type="month" placeholder={['开始月份', '结束月份']}/>
        <br/>
        <RangePicker value={value} onChange={onChange} type="year" placeholder={['开始年', '结束年']}/>
      </>
    </ConfigProvider>);
}
ReactDOM.render(
  <DatePickerDemo />,
  mountNode,
);
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
import { DatePicker, Select } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const DatePickerDstDemo = () => {
  const [version, theme] = getDemoVersion();
  const [timezone, setTimezone] = React.useState('Asia/Shanghai');
  const timezoneOpts = [
    {
      text: '上海:',
      value: 'Asia/Shanghai',
    },
    {
      text: '巴黎',
      value: 'Europe/Paris',
    },
    {
      text: '伦敦',
      value: 'Europe/London',
    },
    {
      text: '洛杉矶',
      value: 'America/Los_Angeles',
    },
  ];
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div>
        <Select
          label="时区"
          options={timezoneOpts}
          onChange={v => {
            setTimezone(v);
          }}
          value={timezone}
        />
        <div>
          <DatePicker timezone={timezone} value={new Date()} style={{margin: '1rem 1rem 0 0'}}/>
          <DatePicker type="datetime" timezone={timezone} value={new Date()}/>
        </div>
      </div>
    </ConfigProvider>
  );
};
ReactDOM.render(<DatePickerDstDemo />, mountNode);
```

### 日期格式

使用`format`属性，可以自定义日期显示格式。格式设置查阅[moment](https://momentjs.com/docs/)
<br/><br/>
请注意：因为moment格式与Cloudsop平台日期格式不兼容，目前处理方式如下
<br/>
1. 在cloudsop平台下，不传入format时，且type=`datetime`，组件自动获取cookie中的format并转换
<br/>
2. 自行通过`DatePicker.convertFormat`对cookie中对的`format`进行转换

```jsx
import { DatePicker } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const { RangePicker } = DatePicker;
const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <>
      <DatePicker
        value={new Date()}
        format="YYYY/MM/DD"
      />
      <br/>
      <br/>
      <DatePicker
        value={new Date()}
        type="month"
        format="YYYY/MM"
      />
      <br/>
      <br/>
      <RangePicker
        value={[new Date(), new Date()]}
        format="MM/DD-YYYY"
      />
    </>
  </ConfigProvider>,
  mountNode
);
```

### 时间校验

传入`rules`定义校验规则，调用`validate()`进行结果校验

```jsx
import { DatePicker, Button, LabelField, Radio } from 'eview-ui';
import moment from 'moment';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const ValidateDatePicker = () => {
  const [version, theme] = getDemoVersion();
  const ref = React.useRef();
  const [tipsType, setTipsType] = React.useState('div');
  const validate = () => {
    const result = ref.current.validate();
    if(result) {
      console.log('合法输入')
    }
  }
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div style={{marginBottom: '2rem'}}>
        <div style={{marginBottom: "1rem", display: "flex"}}>
          <LabelField text="校验提示类型:"/>
          <Radio
            value="div"
            label="div"
            checked={tipsType === "div"}
            onChange={value => setTipsType(value)}
            style={{marginRight: "0.5rem"}}
          />
          <Radio
            value="tipbox"
            label="tipbox"
            checked={tipsType === "tipbox"}
            onChange={value => setTipsType(value)}
          />
        </div>
        <DatePicker
          ref={ref}
          validationTipsType={tipsType}
          rules={[
            {required: true, message: '时间必填'},
            {
              validator: value => {
                return value < moment();
              },
              message: '请选择今天以前的日期',
            },
          ]}
        />
        <Button
          style={{marginLeft: '1rem'}}
          text="校验"
          onClick={() => validate()}
        />
        <Button
          style={{marginLeft: '1rem'}}
          text="清除"
          onClick={() => ref.current.clearValidation()}
        />
      </div>
    </ConfigProvider>
  );
};

ReactDOM.render(<ValidateDatePicker />, mountNode);
```

### 禁用、只读

`disabled`属性设置选择框的不可用状态，`readOnly`属性设置输入框只读，不可编辑

```jsx
import { DatePicker } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const { RangePicker } = DatePicker;
const [version, theme] = getDemoVersion();

const DisabledDemo = () => (
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <div>
      <DatePicker value={new Date()} disabled/>
      <br/>
      <br/>
      <RangePicker value={[new Date(), new Date()]} disabled/>
      <br/>
      <br/>
      <DatePicker value={new Date()} readOnly/>
      <br/>
      <br/>
      <RangePicker value={[new Date(), new Date()]} readOnly/>
    </div>
  </ConfigProvider>
);
ReactDOM.render(<DisabledDemo />, mountNode);
```

### 可选范围

`range`属性设置日期可选范围

```jsx
import { DatePicker } from 'eview-ui';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const { RangePicker } = DatePicker;
const [version, theme] = getDemoVersion();

ReactDOM.render(
// 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <>
      <DatePicker
        placeholder="请选择日期"
        range={['2020-03-15', '2020-04-15']}
      />
      <br/><br/>
      <RangePicker
        placeholder={['开始日期', '结束日期']}
        range={['2020-03-15', '2020-04-15']}
      />
    </>
  </ConfigProvider>,
  mountNode
);
```

