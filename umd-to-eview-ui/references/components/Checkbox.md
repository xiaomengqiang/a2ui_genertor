# Checkbox 复选框

> 分类：数据录入

该组件使用时要设置复选框的展示文本值和入库value值，并且可以自己选择文本与复选框的位置（文本在复选框的在左边或右边），同时具有选中状态和灰化状态，支持复选框状态改变事件的回调。

Checkbox 中的提示气泡 ，在 0.0.x 版本中采用 TipBox 实现，样式对应 TipBox 的样式。在 0.1.x 版本中采用 Tooltip 实现，样式对应 Tooltip 样式。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Checkbox` | `Checkbox` | `label` prop（= antd children）；**`onChange(value, checked, event, additionalData)` 四参**（首参是 value 不是 event）；`indeterminate`→`halfChecked`；`labelPosition` 默认 `after`（文本在右，与 antd 一致，勿改） |

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getValue|用来获取被选中复选框的值|无|被选中复选框的值|
|focus|用来设置聚焦事件|无|无|


### 属性

| 属性名称 | 描述                                                                                                                                                                                                                                                            | 输入 | 默认 |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----|-----|
| id | 设置Checkbox的id                                                                                                                                                                                                                                                 | string |  |
| name | 设置组件的name                                                                                                                                                                                                                                                     | string |  |
| className | 通过自定义类的方式控制checkbox的整体样式（最外层div） 例如:margin、padding                                                                                                                                                                                                            | string |  |
| style | 通过自定义style的方式控制checkbox的整体样式（最外层div） 例如:margin、padding                                                                                                                                                                                                        | object |  |
| additionalData | 可以从上层组件传递附加数据。配合onChange属性使用，作为onChange回调函数的第四个参数。                                                                                                                                                                                                            | object |  |
| checkboxClassName | 通过自定义类的方式控制checkbox的图标尺寸以及颜色                                                                                                                                                                                                                                  | string |  |
| checkboxStyle | 通过自定义style的方式控制checkbox的图标尺寸以及颜色                                                                                                                                                                                                                              | object |  |
| labelClassName | 通过添加class的方式控制label的样式,以及checkbox与文本之间的间距                                                                                                                                                                                                                     | string |  |
| labelStyle | 通过添加style的方式控制label的样式,以及checkbox与文本之间的间距                                                                                                                                                                                                                     | object |  |
| label | 设置radio的展示文本值                                                                                                                                                                                                                                                 | string |  |
| tipText | 配置Checkbox气泡提示内容                                                                                                                                                                                                                                              | string |  |
| tipData | 配置Checkbox气泡提示 ，参考[Tooltip](/components/Tooltip/)                                                                                                                                                                                                             | object | {} |
| value | 设置Checkbox的在数据库中存取的value                                                                                                                                                                                                                                      | any |  |
| labelPosition | 设置radio的文本值在radio图标的左侧还是右侧 before代表文本在radio的左边，after表示文本在radio的右边                                                                                                                                                                                             | enum:<br>&nbsp;'before'<br>&nbsp;'after'<br> | 'after' |
| disabled | 设置checkbox的灰化                                                                                                                                                                                                                                                 | bool | false |
| checked | 设置Checkbox的是否是选中状态                                                                                                                                                                                                                                            | bool | false |
| halfChecked | 设置Checkbox的拥有半选状态                                                                                                                                                                                                                                             | bool | false |
| onChange | 设置Checkbox的onChange事件<br><br>**签名:**<br>`function(value: any, checked: bool, event: object, additionalData: object) => void`<br>*value:* 用户在properties中传入的value值<br>*checked:* 代表了复选框是否选中<br>*event:* 原生dom的点击事件<br>*additionalData:* 附加参数，参考additionalData属性 | function |  |
| onFocus | 设置Checkbox的聚焦事件<br><br>**签名:**<br>`function(value: any, checked: bool, event: object) => void`<br>*value:* 用户在properties中传入的value值<br>*checked:* 代表了复选框是否选中<br>*event:* 原生dom的聚焦事件                                                                            | function |  |
| boxTabIndex | 定制Checkbox的tabIndex                                                                                                                                                                                                                                           | string | ''

## 接口定义

```typescript
import type { KeyboardEventHandler, MouseEvent, ReactNode } from 'react';

export interface Props {

  /**
   * 设置Checkbox的id
   */
  id: string;

  /**
   * 设置组件的name
   */
  name: string;

  /**
   * 通过自定义类的方式控制checkbox的整体样式（最外层div）
   * 例如:margin、padding
   */
  className: string;

  /**
   * 通过自定义style的方式控制checkbox的整体样式（最外层div）
   * 例如:margin、padding
   */
  style: object;

  /**
   * 通过自定义类的方式控制checkbox的图标尺寸以及颜色
   */
  checkboxClassName: string;

  /**
   * 通过自定义style的方式控制checkbox的图标尺寸以及颜色
   */
  checkboxStyle: object;

  /**
   * 通过添加class的方式控制label的样式;以及checkbox与文本之间的间距
   */
  labelClassName: string;

  /**
   * 通过添加style的方式控制label的样式;以及checkbox与文本之间的间距
   */
  labelStyle: object;

  /**
   * 设置Checkbox的展示文本值
   */
  label: string;

  /**
   * 设置Checkbox的在数据库中存取的value
   */
  value: string;

  /**
   * 设置Checkbox的文本值在Checkbox图标的左侧还是右侧
   * before代表文本在Checkbox的左边，after表示文本在Checkbox的右边
   */
  labelPosition: 'before' | 'after';

  /**
   * 设置checkbox的灰化
   */
  disabled: boolean;

  /**
   * 设置Checkbox的是否是选中状态
   */
  checked: boolean;

  /**
   * 设置Checkbox的拥有半选状态
   */
  halfChecked: boolean;

  /**
   * 设置复选框半选状态切换顺序
   * 内部使用
   * true: half -> checked
   * false: half -> no checked
   */
  halfToChecked: boolean;

  /**
   * To check if operation need to be continued. This function will be called before change the status.
   *
   * @param {any} value
   * @param {boolean} newValue (checked or unchecked)
   * @param {object} event
   */
  onPreChange: (value: string | undefined, checked: boolean, e: MouseEvent<HTMLSpanElement>) => unknown;

  /**
   * 设置Checkbox的onChange事件
   *
   * @param {any} value 用户在properties中传入的value值
   * @param {boolean} checked 代表了复选框是否选中
   * @param {object} event 原生dom的点击事件
   */
  onChange: (value: string | undefined, checked: boolean, e: MouseEvent<HTMLSpanElement>, additionalData: object | undefined) => unknown;

  /**
   * 设置Checkbox的聚焦事件
   *
   * @param {any} value 用户在properties中传入的value值
   * @param {boolean} checked 代表了复选框是否选中
   * @param {object} event 原生dom的聚焦事件
   */
  onFocus: (value: string | undefined, checked: boolean, e: FocusEvent) => unknown;

  /**
   * 可以从上层组件传递附加数据。配合onChange属性使用，作为onChange回调函数的第四个参数。
   */
  additionalData: object;

  /**
   *content to display in the tip.
   */
  tipText: string;

  /**
   *props given for the tip
   */
  tipData: object;

  /**
   *定制方框的tabindex
   */
  boxTabIndex: string;

  /**
   * 通过添加class的方式自定义图标以及样式
   */
  iconClassName: string;

  /**
   * 通过添加style的方式自定义图标以及样式
   */
  iconStyle: object;

  /**
   * 通过添加style的方式自定义图标以及样式
   */
  icon: string;

  onKeyDown: KeyboardEventHandler<HTMLSpanElement>;
  onBlur: (value: string | undefined, e: FocusEvent) => void;

  required: boolean;

  text: string;

  children: ReactNode;

  version: string;

  theme: string;
}

export type OptionalProps = Partial<Props>;
```

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import Checkbox from 'eview-ui/Checkbox';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CheckboxExample extends React.Component {

  handlePreCheckAllowed = () => {
    return true;
  };

  handlePreCheckNotAllowed = () => {
    return false;
  };

  render() {
    const [version, theme] = getDemoVersion();
    let style = {margin: "20px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Checkbox_example">
          <Checkbox value="1" label="The Internet" checked={true} style={style} tipText="The Internet"
                    tipData={{disposeTimeOut: 3000}}></Checkbox>
          <Checkbox value="1" label="Design" style={style} tipText="Design"
                    tipData={{disposeTimeOut: 5000, arrowDirection: 'left'}}></Checkbox>
          <Checkbox value="1" label="Financial" style={style} tipText="Financial"
                    tipData={{disposeTimeOut: 3000, arrowDirection: 'right'}}></Checkbox>
          <Checkbox value="1" label="PreCheck Allowed" style={style} tipText="PreCheck Allowed"
                    onPreChange={this.handlePreCheckAllowed}></Checkbox>
          <Checkbox value="1" label="PreCheck Not Allowed" style={style} tipText="PreCheck Not Allowed"
                    onPreChange={this.handlePreCheckNotAllowed}></Checkbox>
          <Checkbox value="1" label="Administrative" disabled={true} tipText="PreCheck Allowed"
                    style={style}></Checkbox>
          <Checkbox value="1" label="halfChecked" halfChecked={true} checked={true}></Checkbox>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<CheckboxExample />, mountNode);

```

### 事件处理

事件处理

```jsx
import Checkbox from 'eview-ui/Checkbox';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CheckboxEventExample extends React.Component {

  state = {
    msg: '',
    checked: false,
  };

  handleClickGetValue = () => {
    this.setState({msg: "getValue API : " + this.checkbox.getValue()});
  };

  handleClickFocus = () => {
    this.checkbox.focus();
  };

  handleChange = (value, selected) => {
    if (selected) {
      this.setState({msg: "OnChange Event Callback: Selected, Value : " + value, checked: true});
    } else {
      this.setState({msg: "OnChange Event Callback: DeSelected,Value : " + value, checked: false});
    }
  };


  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle = {marginLeft: "20px",};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Checkbox_example">
          <Checkbox style={{marginLeft: "20px"}}
                    checked={this.state.checked} value="1" label="OnChange event display" onChange={this.handleChange}
                    ref={(checkbox) => this.checkbox = checkbox}>
          </Checkbox>

          <Button text="getValue" onClick={this.handleClickGetValue} style={buttonStyle}></Button>
          <Button text="Focus" onClick={this.handleClickFocus} style={buttonStyle}></Button>

          {this.state.msg ? <DivMessage text={this.state.msg} type="success"
                                        style={{marginLeft: "20px", marginTop: "10px", width: "500px"}}/> : ''}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<CheckboxEventExample />, mountNode);

```

### 全选

全选

```jsx
import CheckboxGroup from 'eview-ui/CheckboxGroup';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ComboCheckbox extends React.Component {

  handleChange = (value, event) => {
    console.log("checked values " + value);
  }

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {value: 0, text: "option1", disabled: true},
      {value: 1, text: "option2"},
      {value: 2, text: "option3"},
      {value: 3, text: "option4"},
      {value: 4, text: "option5"},
      {value: 5, text: "option6"},
      {value: 6, text: "option7"},
      {value: 7, text: "option8-a-b-c-d-e-f-g-h-i-"},
      {value: 8, text: "option9"},
      {value: 9, text: "option10"}];

    let selectAll = {text: "All", onChange: this.handleChange};
    let containerStyle = {width: "1000px"};
    let fieldStyle = {width: "200px",};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_CheckboxGroup_example">
          <div>
            <CheckboxGroup label="Example with label : "
                           fieldStyle={fieldStyle}
                           value={[0]}
                           style={containerStyle}
                           selectAll={selectAll}
                           data={data}
                           rows={"0:2|3:5|6|7:9"}/>
          </div>

        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<ComboCheckbox />, mountNode);

```

