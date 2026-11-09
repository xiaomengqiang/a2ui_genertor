# CheckboxGroup 复选框组

> 分类：数据录入

This component is used to define a set of checkboxes that define the selected items, as well as the checkboxes and text positions, while supporting selection of changed callbacks and custom styles.

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getValue|用来获取被选中单选框的值|无|单选框的值|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| data |  设置checkbox的数据：let data=[{value:1,text:"MALE",checked:true,tipText:"Male"},{value:2,text:"222"},{value:3,text:"333"}] 其中checked设置是否选中,value为数据库存取值，text为文本展示值,tipText为气泡提示内容 | array |  |
| id |  设置CheckboxGroup的id | string |  |
| className |  通过自定义class来添加自定义样式，可控制整个组件的整体样式（最外层div） 例如：margin、padding | string |  |
| style |  通过自定义style来添加自定义样式，可控制整个组件的整体样式（最外层div） 例如：margin、padding | object |  |
| label |  设置CheckboxGroup的文本名称 | string |  |
| labelClassName |  通过添加class的方式控制label的样式，可用来调节复选框组和复选框组文本名字之间的间距 | string |  |
| labelStyle |  通过添加style的方式控制label的样式，可用来调节复选框组和复选框组文本名字之间的间距 | object |  |
| fieldStyle |  设置复选框组件(checkbox + label)的样式，，例如width | object |  |
| tipData |  配置Checkbox气泡提示 ，参考[Tooltip](/components/Tooltip/) | object | {} |
| labelPosition |  CheckboxGroup的文本名称与复选框组的位置 before代表了文本名称在复选框组的左边，after代表了文本名称在复选框组的右边 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| itemLabelPosition |  CheckboxGroup中单个checkbox的文本名称与复选框的位置 before代表了文本名称在复选框的左边，after代表了文本名称在复选框的右边 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "after" |
| value | 设置所选值的值 | array |  |
| tipStyle | style of tipbox | React.CSSProperties |  |
| required |  设置组件是否为必填项 | bool | false |
| disabled |  设置组件的灰化状态 | bool | false |
| onChange |  设置CheckboxGroup的onClick事件，会传递参数为：参数为：<br><br>**签名:**<br>`function(newValue: array, oldValue: array, event: Object) => void`<br>*newValue:* 当前复选框选中的值<br>*oldValue:* 上一次复选框选中的值<br>*event:* 原生点击事件 | function |  |
| selectAll | This attribute provides the 'Select All' checkbox using this we can selct all the  checkboxes in set. let SelectAll = {text : "All", checked : true , onChange:this.handleChange}, where  text is label for parentCheckbox default its "All" , checked refers initial  checked status and using onChange key can get callback event on change of parentbox.  onChange will return selected values and event  if user has mentioned selectAll.checked value it will take priority over indvidual item and values| object |  |
| rows | Specifies checkbox elements alignment in multiple columns and rows. For example, rows = "0:1 &#124; 2:4 &#124; 5" displays zero(0) to one(1) checkbox elements in the first row. Two(2) to four(4) checkbox elements in 2nd row and 5th checkbox element in 3rd row. if rows property is not defined  boxes are arranged inline style.<br> example, rows = "0,3 &#124; 2,4 &#124; 5"  displays  zero(0) and three(3)checkbox elements in the firest row .Two(2) and four(4) checbox elements in 2nd row and 5th checkbox element is in 3rd row .So user should use one format at a time .| object |  |

## 接口定义

```typescript
interface CheckboxGroup {


  /**
   * 设置checkbox的数据：<br/>
   * let data = [<br/>
   * &nbsp;&nbsp;{ value:1; text:"MALE"; checked:true; tipText:"Male" };<br/>
   * &nbsp;&nbsp;{ value:2; text:"222" };<br/>
   * &nbsp;&nbsp;{ value:3; text:"333" }<br/>
   * ]<br/>
   * 其中checked设置是否选中;value为数据库存取值，text为文本展示值
   */
  data: any;

  /**
   * 设置CheckboxGroup的id
   */
  id: string;

  /**
   * 通过自定义class来添加自定义样式，可控制整个组件的整体样式（最外层div）
   * 例如：margin、padding
   */
  className: string;

  /**
   * 通过自定义style来添加自定义样式，可控制整个组件的整体样式（最外层div）
   * 例如：margin、padding
   */
  style: object;

  /**
   * 设置CheckboxGroup的文本名称
   */
  label: string;

  /**
   * 通过添加class的方式控制label的样式，可用来调节复选框组和复选框组文本名字之间的间距
   */
  labelClassName: string;

  /**
   * 通过添加style的方式控制label的样式，可用来调节复选框组和复选框组文本名字之间的间距
   */
  labelStyle: object;

  /**
   * CheckboxGroup的文本名称与复选框组的位置
   * before代表了文本名称在复选框组的左边，after代表了文本名称在复选框组的右边
   */
  labelPosition: 'before' | 'after';

  /**
   * 设置组件的选中项
   */
  value: any;

  /**
   * 设置组件是否为必填项
   */
  required: boolean;

  /**
   * 设置组件的灰化状态
   */
  disabled: boolean;

  /**
   * 设置CheckboxGroup的onClick事件，会传递参数为：
   *
   * @param {Array} value 当前选中值
   * @param {Array} oldValue 上次选中值
   * @param {object} event 原生dom的点击事件
   */
  onChange: any;

  /**
   * controlls the selection of checkbox  in checkboxgroup
   * if selectAll Props not passed extra parent checkbox will not  appear
   */
  selectAll: object;

  /**
   * Specifies checkbox elements alignment in multiple columns and rows.
   * if rows props not mentioned it will be in normal strucure
   */
  rows: string;

  /**
   * Specifies style of each checkbox
   */
  fieldStyle: object;

  /**
   * Specifies affect the style of each checkbox through className
   */
  fieldClassName: string;

  /**
   *props given for the tip
   */
  tipData: object;

  /**
   * This attribute supports only the minimum and maximum validation.
   * e.g  {'minSelect' : '2';'maxSelect' : '4'};
   */
  validtor: object;

  /**
   * style of tip
   */
  tipStyle: object;

  itemClassName: string;

  itemStyle: object;

  itemLabelPosition: 'before' | 'after';

  tipValidatorClass: string;

}
```

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import CheckboxGroup from 'eview-ui/CheckboxGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CheckboxGroupExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { value: 1, text: 'MALE', tipText: 'Male' },
      { value: 2, text: 'FEMALE', tipText: 'Female' },
      { value: 3, text: 'NONE', tipText: 'None' },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_CheckboxGroup_example">
          <div>
            <CheckboxGroup label="Checkgroup of no item is selected:" data={data} labelStyle={{ display: 'block' }} />
          </div>
          <div>
            <CheckboxGroup
              label="Checkgroup of some selected items:"
              value={[1]}
              data={data}
              tipData={{ placement: 'top', overlayClassName: 'custom-class-name', overlayStyle: { fontWeight: 'bold' } }}
            />
          </div>
          <div>
            <CheckboxGroup label="Checkgroup of mandatory parameters:" required={true} data={data} />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CheckboxGroupExample />, mountNode);
```

### 事件处理

事件处理

```jsx
import CheckboxGroup from 'eview-ui/CheckboxGroup';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CheckboxGroupEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      msg: "",
      checkedValue: [3],
    };
  }

  handleClick = () => {
    console.log(this.group.getValue());
  };

  handleChange = (value, oldValue, a) => {
    console.log(`${value}--${oldValue}--${a}`);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {value: 1, text: "MALE", tipText: "Male", checked: true},
      {value: 2, text: "FEMALE"},
      {value: 3, text: "NONE"},
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <CheckboxGroup
            label="Callback event"
            // value={this.state.checkedValue}
            // onChange={this.handleChange}
            data={data}
            ref={(group) => (this.group = group)}
          />

          <Button
            text="Gets the value of current checkboxGroup"
            onClick={this.handleClick}
          ></Button>

          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{marginTop: "10px", width: "600px"}}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CheckboxGroupEvent />, mountNode);

```

### 校验器

校验器

```jsx
import CheckboxGroup from 'eview-ui/CheckboxGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CheckboxGroupValidator extends React.Component {
  handleAllChange = (value, event) => {
    console.log('Callback All onChange : ' + value);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { value: 0, text: 'Apple', tipText: 'Apple' },
      { value: 1, text: 'Honor', tipText: 'Honor' },
      { value: 2, text: 'Oneplus', tipText: 'Oneplus' },
      { value: 3, text: 'ZTE', tipText: 'ZTE' },
      { value: 4, text: 'Lenovo', tipText: 'Lenovo' },
      { value: 5, text: 'Motorola', tipText: 'Motorola' },
      { value: 6, text: 'Samsung', tipText: 'Samsung' },
    ];

    let data1 = [
      { value: 1, text: 'USA' },
      { value: 2, text: 'UK' },
      { value: 3, text: 'CHINA' },
      { value: 4, text: 'BRAZIL' },
      { value: 5, text: 'GERMANY' },
    ];

    let selectAll = { text: 'All', onChange: this.handleAllChange };
    let validtorRule = { minSelect: 2, minSelectMsg: 'Min Select : 2', maxSelect: 4, maxSelectMsg: 'Max Select : 4' };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_CheckboxGroup_example">
          <div>
            <CheckboxGroup value={[2, 4]} data={data1} validtor={validtorRule} />
          </div>
          <br />
          <br />
          <div>
            <CheckboxGroup
              label="Example with label : "
              value={[2, 4]}
              selectAll={selectAll}
              tipData={{ placement: 'topRight', overlayStyle: { fontWeight: 'bold' } }}
              data={data}
              rows={'0:2|3:5|6'}
              tipStyle={{ color: 'red' }} // 校验失败时气泡提示样式
              validtor={validtorRule}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CheckboxGroupValidator />, mountNode);
```

