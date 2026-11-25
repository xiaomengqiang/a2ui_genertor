# TimeRangeSelector 时间范围选择器

> 分类：数据录入

Time Range Selector组件提供的API和函数创建时间组件。[在开发]

## API

### 属性

| 属性名称          | 描述                                                                                                                                         | 输入     | 默认   |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :----- |
| id                | 组件的id                                                                                                                                     | string   |        |
| className         | 定制组件类, 通过在上添加类组件默认风格定制的组件样式如: className = 'timeSelectorClassName'                                                  | string   |        |
| width             | 设置时间轴组件的宽度                                                                                                                         | string   | 180    |
| minDate           | 配置最小时间日期组件.必填字段。注意Java Script对象以0开始日期月一月                                                                          | object   |        |
| maxDate           | 配置最大时间日期组件. 必填字段. 注: Java Script对象以0开始日期月一月                                                                         | object   |        |
| displayStartDate  | 设置开始日期时间组件中显示. 必填字段. 注: Java Script对象以0开始日期月一月                                                                   | object   |        |
| displayEndDate    | 设置结束日期时间组件中显示. 必填字段. 注: Java Script对象以0开始日期月一月                                                                   | object   |        |
| selectedStartDate | 设置开始日期时间组件中可以选择. 注: Java Script对象以0开始日期月一月                                                                         | object   |        |
| selectedEndDate   | 设置结束日期时间组件中选择. 示例, 当第一显示日期为2013-09-12上午10点比选择结束日期为2013-09-12上午11点 注: Java Script对象以0开始日期月一月. | object   |        |
| onChange          | 自定义时间时回调方法选择文本框中修改. {min:2017-07-12 12:34 , max: 2017-07-13 12:00}                                                         | function |        |
| type              | 支持时间线的类型 [小时,天,周,月]                                                                                                             | string   | "days" |

## 使用示例

### 基本属性设置

```jsx
import { TimeRangeSelector } from "eview-ui";

const minDate = new Date(2011, 9, 7);
const maxDate = new Date(2015, 11, 14);
const maxdaysDate = new Date(2011, 10, 28);
const maxhourDate = new Date(2011, 10, 10);

// type="months"
<TimeRangeSelector
  minDate={minDate}
  maxDate={maxDate}
  displayStartDate={new Date(2012, 9, 7, 0, 0, 0)}
  displayEndDate={new Date(2013, 11, 8, 0, 0, 0)}
  selectedStartDate={new Date(2012, 9, 7, 4, 0, 0)}
  selectedEndDate={new Date(2012, 10, 12, 12, 0, 0)}
  width="800px"
  id="testmeMonth"
  onChange={(e) => {
    // e: { min, max }
  }}
  type="months"
/>

// type="days"
<TimeRangeSelector
  minDate={minDate}
  maxDate={maxdaysDate}
  displayStartDate={new Date(2011, 9, 7, 0, 0, 0)}
  displayEndDate={new Date(2011, 10, 7, 0, 0, 0)}
  selectedStartDate={new Date(2011, 9, 8, 12, 0, 0)}
  selectedEndDate={new Date(2011, 9, 23, 20, 0, 0)}
  width="800px"
  id="testmeDays"
  onChange={(e) => {}}
  type="days"
/>

// type="hours"
<TimeRangeSelector
  minDate={minDate}
  maxDate={maxhourDate}
  displayStartDate={new Date(2011, 9, 7, 0, 0, 0)}
  displayEndDate={new Date(2011, 9, 8, 0, 0, 0)}
  selectedStartDate={new Date(2011, 9, 7, 12, 0, 0)}
  selectedEndDate={new Date(2011, 9, 7, 20, 0, 0)}
  width="800px"
  id="testmeHr"
  onChange={(e) => {}}
  type="hours"
/>

// type="weeks"
<TimeRangeSelector
  minDate={minDate}
  maxDate={maxDate}
  displayStartDate={new Date(2012, 9, 7, 0, 0, 0)}
  displayEndDate={new Date(2012, 11, 8, 0, 0, 0)}
  selectedStartDate={new Date(2012, 9, 10, 12, 0, 0)}
  selectedEndDate={new Date(2012, 9, 10, 12, 0, 0)}
  width="800px"
  id="testmeWeek"
  onChange={(e) => {}}
  type="weeks"
/>
```

### Hours Style Settings

```jsx
import { TimeRangeSelector } from "eview-ui";

<TimeRangeSelector
  minDate={new Date(2018, 7, 9)}
  maxDate={new Date(2018, 7, 10)}
  displayStartDate={new Date(2018, 7, 9, 0, 0, 0)}
  displayEndDate={new Date(2018, 7, 10, 0, 0, 0)}
  selectedStartDate={new Date(2018, 7, 9, 0, 0, 0)}
  selectedEndDate={new Date(2018, 7, 9, 23, 59, 59)}
  width="100%"
  id="24Hr"
  onChange={(e) => {
    // e: { min, max }
  }}
  type="hours"
/>
```
