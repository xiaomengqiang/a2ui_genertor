# DragInput 滑动条

> 分类：数据录入

拖拽选择器，可支持数值选择和区间选择。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Slider` | `DragInput` | **`value` 永远是数组**：`type="single"` 默认 `[min]`、`type="range"` 默认 `[min, min]`；`marks` 对象→**`markIndexes` 纯数字数组（要求递增）**；`onChange(value, changeValue)`；`range`→`type="range"`；**无 `disabled` prop**（需要时外层禁用处理）；`displayInput` 默认 true 显示输入框 |

## API


### 属性

| 属性名称 | 描述                                                                                                                                           | 输入 | 默认 |
|:-----|:---------------------------------------------------------------------------------------------------------------------------------------------|:-----|:-----|
| id | 设置组件外层容器的id                                                                                                                                  | string |  |
| style | 通过自定义style来改变EditSelect的整体样式 例如:margin padding width                                                                                         | object |  |
| className | 通过自定义class来改变DragSelect的整体样式 例如:margin padding width                                                                                         | string |  |
| stickClassName | 通过自定义class来改变刻度条的整体样式                                                                                                                        | string |  |
| stickStyle | 通过自定义style来改变刻度条的整体样式                                                                                                                        | object |  |
| stickTotalWidth | 自定义刻度条容器元素的宽度（当不能正确的读取到元素宽度时，渲染会出现问题，此时由使用者传值）                                                                                               | number |  |
| barClassName | 通过自定义class来改变控制钮的整体样式                                                                                                                        | string |  |
| barStyle | 通过自定义style来改变控制钮的整体样式                                                                                                                        | object |  |
| inputStyle | 通过style控制输入框样式                                                                                                                               | object |  |
| inputClassName | 通过class控制输入框样式                                                                                                                               | string |  |
| precision | 精度，表示小数点后保留几位，默认0位                                                                                                                           | number | 0 |
| min | 刻度最小值                                                                                                                                        | number | 0 |
| max | 刻度最大值                                                                                                                                        | number | 100 |
| value | 初始值 type=="range"时默认值为[最小刻度值,最小刻度值] type=="single"时默认值为[最小刻度值]                                                                               | array |  |
| markIndexes | 需要显示刻度值的位置的对应value值的数组 markIndexes:[0,10,15] 该数组要求是递增的                                                                                       | array |  |
| unit | 单位，默认为"",如果需要多个单位，请在labelFormat函数中转换                                                                                                         | string |  |
| labelFormat | 数值转换函数<br><br>**签名:**<br>`function(value: number) => String`<br>*value:* 当前需要转换的数值<br> *returns* (String): formatValue 根据当前数值转换的带单位的字符串      | function |  |
| formatter | 格式化当前组件的所有数字，保持同一个格式显示。签名:`(value: number, precision: number) => string` | function | `(value, precision) => value.toFixed(precision)` |
| onChange | 定义组件内容改变时的事件<br><br>**签名:**<br>`function(value: string, changeValue: string) => void`<br>*value:* 当前组件中选中的项的value集合<br>*changeValue:* 当前改变的值 | function |  |
| displayInput | 是否显示输入框                                                                                                                                      | bool | true |
| type | 选择器类型 single：数值选择器，range：区间选择器                                                                                                               | enum:<br>&nbsp;"single"<br>&nbsp;"range"<br> | "single" |
| label | 设置标题文字                                                                                                                                       | string |  |
| labelPosition | 设置标题文字的位置 before代表文字在左边，after代表文字在右边                                                                                                         | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| labelStyle | 通过style设置label样式                                                                                                                             | object |  |
| labelClassName | 通过class设置label样式                                                                                                                             | string |  |

## 使用示例

### 基本样例

基本样例展示

```jsx
import DragInput from 'eview-ui/DragInput';
import PageMessage from 'eview-ui/PageMessage';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DragInputDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const param1 = {
      markIndexes:[15,16,17,18,19,20],
      selectMax:17,
      unit: "GB",
      value:[15],
      style:{width:'700px'},
      max: 20,
      min:15,
      precision: 1
    };

    const param2 = {
      type:"range",
      value:[10,15],
      markIndexes:[10,20],
      unit: "m",
      max: 20,
      min:10,
      precision: 2
    };
    const param3 = {
      type:"range",
      value:[10,15],
      markIndexes:[10,20],
      unit: "m",
      max: 20,
      min:10,
      displayInput:false,
      precision: 2
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{padding: "20px"}}>
          <DragInput {...param3} label={"Numerical selector"}/>
          <DragInput {...param1} label={"Numerical selector"}/>
          <br/>
          <DragInput {...param2} label={"Interval selector"}/>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<DragInputDemo />, mountNode);

```

### 动态更新

Dyanamic Updating the Values

```jsx
import DragInput from 'eview-ui/DragInput';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class DragSelectorDemo extends React.Component {
  state = {
    msg: "",
    value:[10,12]
  };
  onChange = (value, changeValue)=> {

    this.setState({
      msg: "The currently selected value for the onChange event is " + value[0]+" max:"+value[1],
      value:this.state.value
    })
  };


  getValue = ()=> {
    let value = this.dragSelect.getValue();
    this.setState({
      msg: <div>Call the getValue interface, the current selected value is<br/> min: {value[0]} max:{value[1]}</div>,
      value:this.state.value
    })
  };
  handleClick = () => {
      let minVal = this.state.value[0] == 18 ? 10 : this.state.value[0]+1;
      let maxVal = this.state.value[1] == 20 ? 12 : this.state.value[1]+1;
      this.setState({value:[minVal, maxVal]});
  }

  render() {
    const [version, theme] = getDemoVersion();
    const {
      id,
      ...other
      } = this.props;

    const param1 = {
      type:"range",
      value:this.state.value,
      unit: "MB",
      step:1,
      min:10,
      max: 20,
      markIndexes:[10,20],
      precision: 2,
      onChange: this.onChange,
    };
    let msg = this.state.msg ?
      <DivMessage text={this.state.msg}  type="success" style={{width:"100%"}}/> : "";
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{padding:"20px"}}>
          <DragInput {...param1} ref={(dragSelect)=>{this.dragSelect =dragSelect}}/><br/>
          <Button text={"Value"} onClick={this.getValue} style={{marginBottom:"10px", marginRight:"10px"}}/>
          <Button text = "Update Value" style = { {marginBottom: '20px'} } onClick = { this.handleClick } />
          {msg}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<DragSelectorDemo />, mountNode);

```

### 事件处理

事件处理

```jsx
import DragInput from 'eview-ui/DragInput';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class DragSelectorDemo extends React.Component {
  state = {
    msg: "",
    value:[0,5]
  };
  onChange = (value, changeValue)=> {

    this.setState({
      msg: "The currently selected value for the onChange event is " + value[0]+" max:"+value[1],
      value:this.state.value
    })
  };


  getValue = ()=> {
    let value = this.dragSelect.getValue();
    this.setState({
      msg: <div>Call the getValue interface, the current selected value is<br/> min: {value[0]} max:{value[1]}</div>,
      value:this.state.value
    })
  };

  render() {
    const [version, theme] = getDemoVersion();
    const {
      id,
      ...other
      } = this.props;

    const param1 = {
      type:"range",
      value:this.state.value,
      unit: "MB",
      step:1,
      max: 20,
      markIndexes:[0,10,20],
      precision: 2,
      onChange: this.onChange,
    };
    let msg = this.state.msg ?
      <DivMessage text={this.state.msg}  type="success" style={{width:"100%"}}/> : "";
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{padding:"20px"}}>
          <DragInput {...param1} ref={(dragSelect)=>{this.dragSelect =dragSelect}}/><br/>
          <Button text={"Value"} onClick={this.getValue} style={{marginBottom:"10px"}}/>
          {msg}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<DragSelectorDemo />, mountNode);

```

