# TimePicker 时间选择器

> 分类：数据录入

输入或选择时间。

## API

### 属性

| 属性名称              | 描述                                       | 输入                               | 默认                  |
|:------------------|:-----------------------------------------|:---------------------------------|:--------------------|
| className         | 输入框最外层选择器类名                              | string                           |                     |
| defaultTime       | 初始传入的时间值, 数组形式, 24小时制, 如 [13:02:03]      | `[number, number, number]        | [number, number]    | null` | null |
| time              | 时间值, 数组形式, 24小时制, 如 [13:02:03]           | `[number, number, number]        | [number, number]    | null` | null |
| onChange          | 时间选择后触发回调                                | `(time: [number, number, number] | [number, number]    | null) => void` |  |
| disabled          | 是否被禁用                                    | boolean                          | false               |
| display           | 选择弹出框是否显示 (注意: props传入布尔值后将完全由props控制显隐) | boolean                          |                     |
| onDisplayChange   | display发生状态时触发的回调                        | (display: boolean) => void       |                     |
| use12HrClock      | 时间显示为12小时制(AM/PM)                        | boolean                          | false               |
| format            | 时间格式, 有hh:mm:ss, hh:mm, mm:ss            | `'hh:mm:ss'                      | 'mm:ss'             | 'hh:mm'` | 'hh:mm:ss' |
| placement         | 选择框展开方向                                  | `'bottomLeft'                    | 'bottomRight'       | 'topLeft'| 'topRight'| 'top'| 'bottom' | ((alignedRect: DOMRect, popupRect: DOMRect) => { left: number, top: number })` | 'bottomLeft' |
| placeholder       | 在输入框为空时的placeholder                      | string                           |                     |
| popupZIndex       | 下拉选择框的z-index                            | number                           | 1000 (css)          |
| style             | 输入框外层div元素的自定义样式                         | React.CSSProperties              |                     |
| inputStyle        | input输入框的自定义样式                           | React.CSSProperties              |                     |
| iconStyle         | 图标按钮外层span元素的自定义样式                       | React.CSSProperties              |                     |
| popupStyle        | 按出选择框外层div的自定义样式                         | React.CSSProperties              |                     |
| selectStyle       | 下拉选择器的自定义样式                              | React.CSSProperties              |                     |
| cellStyle         | 选择器中元素的自定义样式                             | React.CSSProperties              |                     |
| locale            | 设置组件国际化，该配置比ConfigProvider优先级更高          | string                           |
| getPopupContainer | 设置弹窗的容器元素，默认挂载在body下                     | () => HTMLElement                       | () => document.body |
| ignoreDST | 是否忽略夏令时影响                     | boolean                     | false |

### 废弃属性

| 属性名称           | 描述                                  | 输入        | 默认       |
|:---------------|:------------------------------------|:----------|:---------|
| id             |                                     | string    |          |
| label          | 不再附带label, 请使用placeholder或自行添加label | string    |          |
| labelClassName | 不再附带label, 请使用placeholder或自行添加label | string    |          |
| labelStyle     | 不再附带label, 请使用placeholder或自行添加label | string    |          |
| amPm           | 请使用use12HrClock                     | boolean   |          |
| required       | 是否为必填项                              | boolean   | false    |
| labelPosition  | 不再附带label, 请使用placeholder或自行添加label | `'before' | 'after'` |  |
| direction      | 选择框展开方向, 请使用placement               | `'auto'   | 'up'     | 'down'` | 'auto' |

## 使用示例

### 基本属性设置

点击时间选择器输入或选时间

```jsx
import React from 'react';
import TimePicker from 'eview-ui/TimePicker';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <TimePicker/>
  </ConfigProvider>, mountNode);
```

### 时间传入与获取

通过time或defaultTime传入时间值, 通过onChange获取时间值。传入的新的time可以更新为新的time值

```jsx
import React from 'react';
import TimePicker, { ArrayTime } from 'eview-ui/TimePicker';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const style: React.CSSProperties = {
  margin: '0 0.5rem 0.75rem 0'
}

export default function TimePickerUseTimeDemo() {
  const [version, theme] = getDemoVersion();
  const [time, setTime] = React.useState(null as ArrayTime);

  React.useEffect(() => {
    const id = setInterval(() => {
      if (time === null) {
        return;
      }
      const nextMoment = moment(time.join(':'), 'HH:mm:ss').add(1, 'second');
      const nextTime = nextMoment.format('HH:mm:ss').split(':').map(Number) as [number, number, number];
      setTime(nextTime);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [time]);

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <TimePicker defaultTime={null} onChange={console.log} placeholder={'defaultTime'} style={style}/>
        <TimePicker time={time} onChange={setTime} placeholder={'time'} style={style}/>
      </>
    </ConfigProvider>
  );
}

ReactDOM.render(<TimePickerUseTimeDemo />, mountNode);
```

### 禁用

禁用操作

```jsx
import React from 'react';
import TimePicker from 'eview-ui/TimePicker';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <TimePicker defaultTime={[12, 9, 8]} disabled/>
  </ConfigProvider>,
  mountNode
);
```

### 时间格式

时间显示格式参数format和use12HrClock

```jsx
import React from 'react';
import TimePicker from 'eview-ui/TimePicker';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const style: React.CSSProperties = {
  margin: '0 0.5rem 0.75rem 0'
}
const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <>
      <TimePicker format={'hh:mm:ss'} placeholder={'hh:mm:ss (24hr)'} style={style}/>
      <TimePicker format={'hh:mm'} placeholder={'hh:mm (24hr)'} style={style}/>
      <TimePicker format={'hh:mm:ss'} use12HrClock placeholder={'hh:mm:ss (12hr)'} style={style}/>
      <TimePicker format={'hh:mm'} use12HrClock placeholder={'hh:mm (12hr)'} style={style}/>
      <TimePicker format={'mm:ss'} placeholder={'mm:ss'} style={style}/>
    </>
  </ConfigProvider>,
  mountNode
);
```

