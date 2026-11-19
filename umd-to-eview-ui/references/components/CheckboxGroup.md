# CheckboxGroup 复选框组

> 分类：数据录入

本组件用于定义一组复选框，设置选中项以及复选框与文本的位置，同时支持选中变化回调和自定义样式。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Checkbox.Group` | `CheckboxGroup` | **`data`（不是 options）**，项 `{value, text, checked?, disabled?, tipText?, fieldClassName?}`；`value[]`；`onChange(newValue[], oldValue[], event)`；`selectAll` 是**对象** `{text, checked, onChange}`；`rows` 多行排布如 `"0:1 \| 2:4 \| 5"` |

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getValue|用来获取被选中复选框的值|无|复选框的值（array）|
|validate|校验必填项，当required为true时，若未选中任何项则返回false|无|boolean|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| data | 设置checkbox的数据：let data=[{value:1,text:"MALE",checked:true,tipText:"Male"},{value:2,text:"222",disabled:false,fieldClassName:"custom-cls"},{value:3,text:"333"}] 其中checked设置是否选中，value为数据库存取值，text为文本展示值，tipText为气泡提示内容，disabled设置单项是否灰化，fieldClassName设置单项的自定义class | array |  |
| id | 设置CheckboxGroup的id | string |  |
| className | 通过自定义class来添加自定义样式，可控制整个组件的整体样式（最外层div）例如：margin、padding | string |  |
| style | 通过自定义style来添加自定义样式，可控制整个组件的整体样式（最外层div）例如：margin、padding | object |  |
| label | 设置CheckboxGroup的文本名称 | string |  |
| labelClassName | 通过添加class的方式控制label的样式，可用来调节复选框组和复选框组文本名字之间的间距 | string |  |
| labelStyle | 通过添加style的方式控制label的样式，可用来调节复选框组和复选框组文本名字之间的间距 | object |  |
| fieldStyle | 设置复选框组件(checkbox + label)的样式，例如width | object |  |
| fieldClassName | 通过className设置每个checkbox的样式 | string |  |
| itemClassName | 设置每个checkbox项的className样式 | string |  |
| itemStyle | 设置每个checkbox项的style样式 | object |  |
| tipData | 配置Checkbox气泡提示，参考[Tooltip](/components/Tooltip/) | object |  |
| labelPosition | CheckboxGroup的文本名称与复选框组的位置，before代表了文本名称在复选框组的左边，after代表了文本名称在复选框组的右边 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| itemLabelPosition | CheckboxGroup中单个checkbox的文本名称与复选框的位置，before代表了文本名称在复选框的左边，after代表了文本名称在复选框的右边 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "after" |
| value | 设置所选值的值 | array |  |
| tipStyle | 校验提示气泡框的样式 | object |  |
| tipValidatorClass | 校验提示框的自定义className | string |  |
| required | 设置组件是否为必填项 | bool | false |
| disabled | 设置组件的灰化状态 | bool | false |
| onChange | 设置CheckboxGroup的onChange事件，会传递参数为：<br><br>**签名:**<br>`function(newValue: array, oldValue: array, event: Object) => void`<br>*newValue:* 当前复选框选中的值<br>*oldValue:* 上一次复选框选中的值<br>*event:* 原生点击事件 | function |  |
| selectAll | 提供"全选"复选框功能。格式为对象：`{text: "全选", checked: true, onChange: this.handleAllChange}`，其中text为全选复选框的标签文本（默认为"All"），checked设置初始选中状态，onChange为全选复选框变化时的回调函数。回调参数为`(selectedValues, event)`。如果设置了selectAll.checked，其优先级高于单个项的checked和value值。 | object |  |
| rows | 指定checkbox元素在多行多列中的排列方式。例如：`rows="0:1 \| 2:4 \| 6"` 表示第0到1个checkbox在第一行，第2到4个checkbox在第二行，第6个checkbox在第三行；若未设置rows属性，则checkbox按行内排列。也支持逗号分隔的网格模式，如 `rows="0,3 \| 2,4 \| 5"` 表示第0和3个checkbox在第一行，第2和4个在第二行，第5个在第三行。两种格式不可混用。 | string |  |
| validtor | 设置最小和最大选择数量的校验规则。格式为对象：`{minSelect: 2, minSelectMsg: 'Min Select : 2', maxSelect: 4, maxSelectMsg: 'Max Select : 4'}`，其中minSelect为最少选择数，minSelectMsg为不满足最少选择数时的提示文本，maxSelect为最多选择数，maxSelectMsg为超过最多选择数时的提示文本。 | object |  |
| version | 设置组件版本，用于控制样式版本（如'aui3-1'），未设置时从ConfigProvider的context中获取 | string |  |

## 接口定义

```typescript
interface CheckboxGroup {

  /**
   * 设置checkbox的数据：<br/>
   * let data = [<br/>
   * &nbsp;&nbsp;{ value:1; text:"MALE"; checked:true; tipText:"Male"; disabled?: boolean; fieldClassName?: string };<br/>
   * &nbsp;&nbsp;{ value:2; text:"222" };<br/>
   * &nbsp;&nbsp;{ value:3; text:"333" }<br/>
   * ]<br/>
   * 其中checked设置是否选中;value为数据库存取值，text为文本展示值，disabled设置单项是否灰化，fieldClassName设置单项自定义class
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
   * 设置CheckboxGroup的onChange事件，会传递参数为：
   *
   * @param {Array} value 当前选中值
   * @param {Array} oldValue 上次选中值
   * @param {object} event 原生dom的点击事件
   */
  onChange: any;

  /**
   * 提供"全选"复选框功能，设置后会出现全选父复选框
   * 格式为：{text: "全选", checked: boolean, onChange: function}
   */
  selectAll: object;

  /**
   * 指定checkbox元素在多行多列中的排列方式
   * 格式如："0:1|2:4|5" 或 "0,3|2,4|5"
   * 未设置时checkbox按行内排列
   */
  rows: string;

  /**
   * 设置每个checkbox的样式
   */
  fieldStyle: object;

  /**
   * 通过className设置每个checkbox的样式
   */
  fieldClassName: string;

  /**
   * 设置每个checkbox项的className样式
   */
  itemClassName: string;

  /**
   * 设置每个checkbox项的style样式
   */
  itemStyle: object;

  /**
   * 配置Checkbox气泡提示
   */
  tipData: object;

  /**
   * 设置最小和最大选择数量的校验规则
   * 格式为：{minSelect: number, minSelectMsg: string, maxSelect: number, maxSelectMsg: string}
   */
  validtor: object;

  /**
   * 校验提示气泡框的样式
   */
  tipStyle: object;

  /**
   * CheckboxGroup中单个checkbox的文本名称与复选框的位置
   * before代表文本名称在复选框的左边，after代表文本名称在复选框的右边
   */
  itemLabelPosition: 'before' | 'after';

  /**
   * 校验提示框的自定义className
   */
  tipValidatorClass: string;

  /**
   * 设置组件版本，用于控制样式版本（如'aui3-1'）
   * 未设置时从ConfigProvider的context中获取
   */
  version: string;

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
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CheckboxGroupEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      checkedValue: [3],
    };
  }

  handleClick = () => {
    console.log(this.group.getValue());
  };

  handleChange = (value, oldValue, event) => {
    console.log(`${value}--${oldValue}--${event}`);
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
            value={this.state.checkedValue}
            onChange={this.handleChange}
            data={data}
            ref={(group) => (this.group = group)}
          />

          <Button
            text="Gets the value of current checkboxGroup"
            onClick={this.handleClick}
          ></Button>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CheckboxGroupEvent />, mountNode);
```

### 校验器

校验器（使用validtor属性进行最小/最大选择数量校验，配合selectAll全选和rows多行排列）

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
              tipStyle={{ color: 'red' }}
              tipValidatorClass="custom-validator-tip"
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

