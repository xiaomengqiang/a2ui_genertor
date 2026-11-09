# TimeRangeSelector 时间范围选择器

> 分类：数据录入

Time Range Selector组件提供的API和函数创建时间组件。[在开发]

## API



### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  组件的id | string |  |
| className |  定制组件类, 通过在上添加类组件默认风格定制的组件样式如: className = 'timeSelectorClassName' | string |  |
| width |  设置时间轴组件的宽度 | string | 180 |
| minDate |  配置最小时间日期组件.必填字段。注意Java Script对象以0开始日期月一月 | object |  |
| maxDate |  配置最大时间日期组件. 必填字段. 注: Java Script对象以0开始日期月一月 | object |  |
| displayStartDate |  设置开始日期时间组件中显示. 必填字段. 注: Java Script对象以0开始日期月一月 | object |  |
| displayEndDate |  设置结束日期时间组件中显示. 必填字段. 注: Java Script对象以0开始日期月一月 | object |  |
| selectedStartDate |  设置开始日期时间组件中可以选择. 注: Java Script对象以0开始日期月一月 | object |  |
| selectedEndDate |  设置结束日期时间组件中选择. 示例, 当第一显示日期为2013-09-12上午10点比选择结束日期为2013-09-12上午11点 注: Java Script对象以0开始日期月一月. | object |  |
| onChange |  自定义时间时回调方法选择文本框中修改. {min:2017-07-12 12:34 , max: 2017-07-13 12:00} | function |  |
| type |  支持时间线的类型 [小时,天,周,月] | string | "days" |

## 接口定义

```typescript
interface TimeRangeSelector {

  /**
   * id of the component.
   */
  id: string;

  /**
   *  Customize the component class; passing in the value Add the class on the component default style to
   *  customize the component style
   *  For example: className = 'timeSelectorClassName'
   */
  className: string;

  /**
   * Sets the width of timeline component.
   */
  width: string;

  /**
   * Configures the minimum date of timeline component.This is a mandatory field. Note: Java Script date object
   * takes 0 as starting month January.
   */
  minDate: object;

  /**
   * Configures the maximum date of timeline component. This is a mandatory field. Note: Java Script date object
   * takes 0 as starting month January.
   */
  maxDate: object;

  /**
   * Sets the start date that is displayed in the timeline component.
   * This is a mandatory field. Note: Java Script date object takes 0 as starting month January.
   */
  displayStartDate: object;

  /**
   * Sets the end date that is displayed in the timeline component.
   * This is a mandatory field. Note: Java Script date object takes 0 as starting month January.
   */
  displayEndDate: object;

  /**
   * Sets the start date to be selected in the timeline component.
   * Note: Java Script date object takes 0 as starting month January.
   */
  selectedStartDate: object;

  /**
   * Sets the end date to be selected in timeline component.
   * Example; when first displayed date is 2013-09-12 10 a.m.
   * than selected-end-date is 2013-09-12 11 a.m. Note: Java Script date object takes 0 as starting month January.
   */
  selectedEndDate: object;

  /**
   * The callback method when the custom time selector text box value changes .
   * {min:2017-07-12 12:34 ; max: 2017-07-13 12:00}
   */
  onChange: (...args: any[]) => unknown;

  /**
   * Type of time line supported [hours;days;weeks;months]
   */
  type: string;

  /**
   * add version setting.
   */
  version: string;

  /**
   * add theme setting.
   */
  theme: string;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import { TimeRangeSelector } from 'eview-ui';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeRangeSelectorExample extends React.Component {

  state = {
    width: '800px',

    displayStartDate: new Date(2012, 9, 7, 0, 0, 0),
    displayEndDate: new Date(2013, 11, 8, 0, 0, 0),
    selectedStartDate: new Date(2012, 9, 7, 4, 0, 0),
    selectedEndDate: new Date(2012, 10, 12, 12, 0, 0),
  };


  onChange = (e) => {
    console.log(e);
  }

  render() {
    const [version, theme] = getDemoVersion();

    const minDate = new Date(2011, 9, 7);
    const maxDate = new Date(2015, 11, 14);

    const maxhourDate = new Date(2011, 10, 10);

    const maxdaysDate = new Date(2011, 10, 28);

    const displayDaysStartDate = new Date(2011, 9, 7, 0, 0, 0);
    const displayDaysEndDate = new Date(2011, 10, 7, 0, 0, 0);

    const selectedDaysStartDate = new Date(2011, 9, 8, 12, 0, 0);
    const selectedDaysEndDate = new Date(2011, 9, 23, 20, 0, 0);

    const displayHoursStartDate = new Date(2011, 9, 7, 0, 0, 0);
    const displayHoursEndDate = new Date(2011, 9, 8, 0, 0, 0);

    const selectedHoursStartDate = new Date(2011, 9, 7, 12, 0, 0);
    const selectedHoursEndDate = new Date(2011, 9, 7, 20, 0, 0);


    const displayweeksStartDate = new Date(2012, 9, 7, 0, 0, 0);
    const displayweeksEndDate = new Date(2012, 11, 8, 0, 0, 0);

    const selectedweeksStartDate = new Date(2012, 9, 10, 12, 0, 0);
    const selectedweeksEndDate = new Date(2012, 9, 10, 12, 0, 0);


    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Month Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxDate} displayStartDate={this.state.displayStartDate}
                             displayEndDate={this.state.displayEndDate}
                             selectedStartDate={this.state.selectedStartDate}
                             selectedEndDate={this.state.selectedEndDate}
                             width={this.state.width} id={"testmeMonth"} onChange={this.onChange} type="months"/>
          <br/>

          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Days Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxdaysDate} displayStartDate={displayDaysStartDate}
                             displayEndDate={displayDaysEndDate}
                             selectedStartDate={selectedDaysStartDate} selectedEndDate={selectedDaysEndDate}
                             width={this.state.width} id={"testmeDays"} onChange={this.onChange} type="days"/>
          <br/>

          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Hours Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxhourDate} displayStartDate={displayHoursStartDate}
                             displayEndDate={displayHoursEndDate}
                             selectedStartDate={selectedHoursStartDate} selectedEndDate={selectedHoursEndDate}
                             width={this.state.width} id={"testmeHr"} onChange={this.onChange} type="hours"/>
          <br/>


          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>weeks Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxDate} displayStartDate={displayweeksStartDate}
                             displayEndDate={displayweeksEndDate}
                             selectedStartDate={selectedweeksStartDate} selectedEndDate={selectedweeksEndDate}
                             width={this.state.width} id={"testmeWeek"} onChange={this.onChange} type="weeks"/>
          <br/>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TimeRangeSelectorExample />, mountNode);

```

```jsx
import { TimeRangeSelector } from 'eview-ui';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeRangeSelectorExample extends React.Component {

  state = {
    width: '800px',

    displayStartDate: new Date(2012, 9, 7, 0, 0, 0),
    displayEndDate: new Date(2013, 11, 8, 0, 0, 0),
    selectedStartDate: new Date(2012, 9, 7, 4, 0, 0),
    selectedEndDate: new Date(2012, 10, 12, 12, 0, 0),
  };


  onChange = (e) => {
    console.log(e);
  }

  render() {
    const [version, theme] = getDemoVersion();

    const minDate = new Date(2011, 9, 7);
    const maxDate = new Date(2015, 11, 14);

    const maxhourDate = new Date(2011, 10, 10);

    const maxdaysDate = new Date(2011, 10, 28);

    const displayDaysStartDate = new Date(2011, 9, 7, 0, 0, 0);
    const displayDaysEndDate = new Date(2011, 10, 7, 0, 0, 0);

    const selectedDaysStartDate = new Date(2011, 9, 8, 12, 0, 0);
    const selectedDaysEndDate = new Date(2011, 9, 23, 20, 0, 0);

    const displayHoursStartDate = new Date(2011, 9, 7, 0, 0, 0);
    const displayHoursEndDate = new Date(2011, 9, 8, 0, 0, 0);

    const selectedHoursStartDate = new Date(2011, 9, 7, 12, 0, 0);
    const selectedHoursEndDate = new Date(2011, 9, 7, 20, 0, 0);


    const displayweeksStartDate = new Date(2012, 9, 7, 0, 0, 0);
    const displayweeksEndDate = new Date(2012, 11, 8, 0, 0, 0);

    const selectedweeksStartDate = new Date(2012, 9, 10, 12, 0, 0);
    const selectedweeksEndDate = new Date(2012, 9, 10, 12, 0, 0);


    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Month Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxDate} displayStartDate={this.state.displayStartDate}
                             displayEndDate={this.state.displayEndDate}
                             selectedStartDate={this.state.selectedStartDate}
                             selectedEndDate={this.state.selectedEndDate}
                             width={this.state.width} id={"testmeMonth"} onChange={this.onChange} type="months"/>
          <br/>

          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Days Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxdaysDate} displayStartDate={displayDaysStartDate}
                             displayEndDate={displayDaysEndDate}
                             selectedStartDate={selectedDaysStartDate} selectedEndDate={selectedDaysEndDate}
                             width={this.state.width} id={"testmeDays"} onChange={this.onChange} type="days"/>
          <br/>

          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Hours Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxhourDate} displayStartDate={displayHoursStartDate}
                             displayEndDate={displayHoursEndDate}
                             selectedStartDate={selectedHoursStartDate} selectedEndDate={selectedHoursEndDate}
                             width={this.state.width} id={"testmeHr"} onChange={this.onChange} type="hours"/>
          <br/>


          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>weeks Time Line</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxDate} displayStartDate={displayweeksStartDate}
                             displayEndDate={displayweeksEndDate}
                             selectedStartDate={selectedweeksStartDate} selectedEndDate={selectedweeksEndDate}
                             width={this.state.width} id={"testmeWeek"} onChange={this.onChange} type="weeks"/>
          <br/>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TimeRangeSelectorExample />, mountNode);

```

### Hours Style Settings

## en-US



```jsx
import { TimeRangeSelector } from 'eview-ui';
import Button from 'eview-ui/Button';
import './less/TimeRangeHourStyle.less';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeRangeHourExample extends React.Component {

  state = {
    width: "100%",
  };
  onChange = (e) => {
    console.log(e.min + '--->' + e.max);
  }

  render() {
    const [version, theme] = getDemoVersion();

    const minDate = new Date(2018, 7, 9);
    const maxDate = new Date(2018, 7, 10);

    const displayHoursStartDate = new Date(2018, 7, 9, 0, 0, 0);
    const displayHoursEndDate = new Date(2018, 7, 10, 0, 0, 0);

    const selectedHoursStartDate = new Date(2018, 7, 9, 0, 0, 0);
    const selectedHoursEndDate = new Date(2018, 7, 9, 23, 59, 59);


    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div className="Product">
          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Hide Left And Right Buttons And To Set Style
            Properties</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxDate} displayStartDate={displayHoursStartDate}
                             displayEndDate={displayHoursEndDate}
                             selectedStartDate={selectedHoursStartDate} selectedEndDate={selectedHoursEndDate}
                             width={this.state.width} id={"24Hr"} onChange={this.onChange} type="hours"/>
          <br/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TimeRangeHourExample />, mountNode);

```

```jsx
import { TimeRangeSelector } from 'eview-ui';
import Button from 'eview-ui/Button';
import './less/TimeRangeHourStyle.less';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TimeRangeHourExample extends React.Component {

  state = {
    width: "100%",
  };
  onChange = (e) => {
    console.log(e.min + '--->' + e.max);
  }

  render() {
    const [version, theme] = getDemoVersion();

    const minDate = new Date(2018, 7, 9);
    const maxDate = new Date(2018, 7, 10);

    const displayHoursStartDate = new Date(2018, 7, 9, 0, 0, 0);
    const displayHoursEndDate = new Date(2018, 7, 10, 0, 0, 0);

    const selectedHoursStartDate = new Date(2018, 7, 9, 0, 0, 0);
    const selectedHoursEndDate = new Date(2018, 7, 9, 23, 59, 59);


    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div className="Product">
          <br/>
          <p style={{fontSize: "1rem", color: "lightslategray"}}>Hide Left And Right Buttons And To Set Style
            Properties</p>
          <TimeRangeSelector minDate={minDate} maxDate={maxDate} displayStartDate={displayHoursStartDate}
                             displayEndDate={displayHoursEndDate}
                             selectedStartDate={selectedHoursStartDate} selectedEndDate={selectedHoursEndDate}
                             width={this.state.width} id={"24Hr"} onChange={this.onChange} type="hours"/>
          <br/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TimeRangeHourExample />, mountNode);

```

