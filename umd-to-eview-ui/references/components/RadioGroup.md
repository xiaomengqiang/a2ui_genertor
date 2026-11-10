# RadioGroup 单选组

> 分类：数据录入

This component is used to define a set of radio boxes that can customize the selected items, as well as the location of the radio boxes and text, while supporting selected call changes and custom styles.


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Radio.Group` | `RadioGroup` | **`data=[{value, text, disabled?}]`**（不是 options）；`onChange(value, oldValue, event)`（带 oldValue）；无 `buttonStyle`（Radio.Button 场景转 SelectCard）；无 `optionType` |

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getValue|用来获取一组单选框中被选中的值|无|单选框组的值|
|validate|用来手动进行非空校验，返回是否通过校验|无|校验结果，bool类型|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| data |  设置RadioGroup的数据：let radios1=[{value:1,text:"MALE"},{value:2,text:"222"},{value:3,text:"333", disabled:true}] value为数据库存取值，text为文本展示值 | array |  |
| label |  设置radioGroup的文本子名称 | string |  |
| id |  设置RadioGroup的id | string |  |
| className |  通过自定义class来改变RadioGroup的整体样式 例如：margin、padding | string |  |
| style |  通过自定义style来改变RadioGroup的整体样式 例如：margin、padding | object |  |
| labelClassName |  通过添加class的方式控制label的样式，可用来调节单选组和单选组文本名字之间的间距 | string |  |
| labelStyle |  通过添加style的方式控制label的样式，可用来调节单选组和单选组文本名字之间的间距 | object |  |
| labelPosition |  设置radioGroup文本值对于radioGroup的位置 before代表文本值在radioGroup的左边，after代表文本值在radioGroup的右边 | enum:<br>&nbsp;'before'<br>&nbsp;'after'<br> | "before" |
| value |  设置选中的value值 | any |  |
| required |  设置组件是否为必填项 | bool | false |
| disabled |  设置组件的灰化状态 | bool | false |
| onChange |  设置RadioGroup的onClick事件，会传递参数为：<br><br>**签名:**<br>`function(value: any, oldValue: any, event: object) => void`<br>*value:* 当前选中值<br>*oldValue:* 上次选中值<br>*event:* 原生dom的点击事件 | function |  |

## 接口定义

```typescript
interface RadioGroup {


  /**
   * 设置RadioGroup的数据：let radios1=[{value:1;text:"MALE"};{value:2;text:"222"};{value:3;text:"333"}]
   * value为数据库存取值，text为文本展示值
   */
  data: any;

  /**
   * 设置radioGroup的文本子名称
   */
  label: string;

  /**
   * 设置RadioGroup的id
   */
  id: string;

  /**
   * 通过自定义class来改变RadioGroup的整体样式
   * 例如：margin、padding
   */
  className: string;

  /**
   * 通过自定义style来改变RadioGroup的整体样式
   * 例如：margin、padding
   */
  style: object;

  /**
   * 通过添加class的方式控制label的样式，可用来调节单选组和单选组文本名字之间的间距
   */
  labelClassName: string;

  /**
   * 通过添加style的方式控制label的样式，可用来调节单选组和单选组文本名字之间的间距
   */
  labelStyle: object;

  /**
   * 设置radioGroup文本值对于radioGroup的位置
   * before代表文本值在radioGroup的左边，after代表文本值在radioGroup的右边
   */
  labelPosition: 'before' | 'after';

  /**
   * 设置选中的value值
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
   * 设置RadioGroup的onClick事件，会传递参数为：
   *
   * @param {any} value 当前选中值
   * @param {any} oldValue 上次选中值
   * @param {object} event 原生dom的点击事件
   */
  onChange: (...args: any[]) => unknown;

  /**
   * Specifies radio elements alignment in multiple columns and rows.
   * if rows props not mentioned it will be in normal strucure
   */
  rows: string;

  /**
   * Specifies radio elements alignment in multiple rows.
   * if rowSpacing props not mentioned it will be in normal strucure
   */
  rowSpacing: string;

  /**
   * Specifies radio elements alignment in multiple columns.
   * if colSpacing props not mentioned it will be in normal strucure
   */
  colSpacing: string;

  /**
   * Specifies the tool tip for the component.
   */
  tipText: string;

  /**
   * 通过添加class的方式自定义图标以及样式
   */
  iconClassName: string;

  /**
   * 通过添加style的方式自定义图标以及样式
   */
  iconStyle: object;

  /**
   * icon图标的路径
   */
  icon: string;

}
```

## 使用示例

### 基本属性设置

单选祖默认样式

```jsx
import RadioGroup from 'eview-ui/RadioGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class RadioGroupExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {value: 1, text: "MALE", description: "MALE"},
      {value: 2, text: "FEMALE", description: "FEMALE"},
      {value: 3, text: "NONE", description: "NONE"},
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_RadioGroup_example">
          <div>
            <RadioGroup label="单选组" data={data}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<RadioGroupExample />, mountNode);

```

### 自定义单选组

自定义单选组间距

```jsx
import RadioGroup from 'eview-ui/RadioGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class RadioGroupExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();
    let data = [{
      value: 1,
      text: "Each cell requires only one SAC, if no SAC is set for a cell, one SAC is automatically created for the operator (expect ICR ) with the minimum ID.",
      description: "Each cell requires only one SAC,\n if no SAC is set for a cell,\n one SAC is automatically created for the operator (expect ICR ) with the minimum ID."
    },
      {
        value: 2,
        text: "SACs are automatically created for all operators in the operators group of cells.",
        description: "SACs are automatically created for all \n operators in the operators group of cells."
      },
      {
        value: 3,
        text: "Manually plan SACs for cells and create the SACs.",
        description: "Manually plan SACs for cells and create the SACs."
      }];
    let data2 = [
      { value: 1, text: "MALE" },
      { value: 2, text: "FEMALE" },
      { value: 3, text: "NONE" },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_RadioGroup_example">
          <div>
            <RadioGroup label="自定义纵向展示" rowSpacing="50px" rows={"1:1|2:2|3:3"} data={data}/>
          </div>
          <div style={{ marginTop: '3rem'}}>
            <RadioGroup label="自定义横向间距" colSpacing="100px" data={data2}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<RadioGroupExample />, mountNode);

```

