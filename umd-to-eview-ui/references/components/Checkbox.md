# Checkbox 复选框

> 分类：数据录入

该组件使用时要设置复选框的展示文本值和入库 value 值，并且可以自己选择文本与复选框的位置（文本在复选框的在左边或右边），同时具有选中状态和灰化状态，支持复选框状态改变事件的回调。

Checkbox 中的提示气泡采用 Tooltip 实现，样式对应 Tooltip 样式。可通过 `tipText` 和 `tipData` 配置提示内容。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cex 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Checkbox` | `Checkbox` | `label` prop（= antd children）；**`onChange(value, checked, event, additionalData)` 四参**（首参是 value 不是 event）；`indeterminate`→`halfChecked`；`labelPosition` 默认 `after`（文本在右，与 antd 一致，勿改） |


## API

| 方法名 | 描述 | 参数 | 返回值 |
|-----|-----|-----|-----|
| getValue | 用来获取被选中复选框的值 | 无 | 选中时返回 value 值，未选中返回 undefined |
| focus | 使复选框获得焦点 | 无 | 无 |

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 设置 Checkbox 的 id | string | 自动生成 |
| name | 设置组件的 name | string |  |
| className | 通过自定义类的方式控制 checkbox 的整体样式（最外层 div），例如 margin、padding | string |  |
| style | 通过自定义 style 的方式控制 checkbox 的整体样式（最外层 div），例如 margin、padding | object |  |
| version | 传入该值可定制当前组件匹配的 ucd 规范，不传则默认 aui2 规范 | string |  |
| theme | 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式 | string |  |
| additionalData | 可以从上层组件传递附加数据。配合 onChange 属性使用，作为 onChange 回调函数的第四个参数 | object |  |
| checkboxClassName | 通过自定义类的方式控制 checkbox 的图标尺寸以及颜色 | string |  |
| checkboxStyle | 通过自定义 style 的方式控制 checkbox 的图标尺寸以及颜色 | object |  |
| labelClassName | 通过添加 class 的方式控制 label 的样式，以及 checkbox 与文本之间的间距 | string |  |
| labelStyle | 通过添加 style 的方式控制 label 的样式，以及 checkbox 与文本之间的间距 | object |  |
| label | 设置 Checkbox 的展示文本值 | string |  |
| tipText | 配置 Checkbox 气泡提示内容 | string |  |
| tipData | 配置 Checkbox 气泡提示，参考 [Tooltip](/components/Tooltip/) | object | {} |
| value | 设置 Checkbox 在数据库中存取的 value | any |  |
| labelPosition | 设置文本值在复选框图标的左侧还是右侧，`before` 代表文本在左边，`after` 表示文本在右边 | `'before'` \| `'after'` | `'after'` |
| disabled | 设置 checkbox 的灰化（禁用）状态 | boolean | false |
| checked | 设置 Checkbox 是否是选中状态 | boolean | false |
| halfChecked | 设置 Checkbox 的半选状态 | boolean | false |
| halfToChecked | 设置复选框半选状态切换顺序。true: half → checked；false: half → unchecked | boolean | false |
| onPreChange | 在状态改变前调用，返回 false 可阻止状态变更<br><br>**签名:**<br>`function(value: any, newChecked: boolean, event: object) => boolean`<br>*value:* 复选框的 value 值<br>*newChecked:* 即将变更的选中状态<br>*event:* 原生 dom 事件 | func |  |
| onChange | 设置 Checkbox 的 onChange 事件<br><br>**签名:**<br>`function(value: any, checked: boolean, event: object, additionalData: object) => void`<br>*value:* 用户在 properties 中传入的 value 值<br>*checked:* 代表了复选框是否选中<br>*event:* 原生 dom 的点击事件<br>*additionalData:* 附加参数，参考 additionalData 属性 | func |  |
| onFocus | 设置 Checkbox 的聚焦事件<br><br>**签名:**<br>`function(value: any, checked: boolean, event: object) => void`<br>*value:* 用户在 properties 中传入的 value 值<br>*checked:* 代表了复选框是否选中<br>*event:* 原生 dom 的聚焦事件 | func |  |
| onBlur | 设置 Checkbox 的失焦事件<br><br>**签名:**<br>`function(value: any, checked: boolean, event: object) => void`<br>*value:* 复选框的 value 值<br>*checked:* 代表了复选框是否选中<br>*event:* 原生 dom 的失焦事件 | func |  |
| onKeyDown | 设置 Checkbox 的键盘事件 | KeyboardEventHandler |  |
| boxTabIndex | 定制 Checkbox 方框的 tabIndex | string | '' |
| icon | 自定义图标 URL | string |  |
| iconClassName | 通过添加 class 的方式自定义图标以及样式 | string |  |
| iconStyle | 通过添加 style 的方式自定义图标以及样式 | object |  |
| children | 自定义子内容 | ReactNode |  |
| required | 设置是否为必填项 | boolean | false |
| text | 设置文本内容（与 label 类似） | string |  |

## 接口定义

```typescript
import type { KeyboardEventHandler, MouseEvent, ReactNode, FocusEvent, CSSProperties } from 'react';

export interface Props {

  id: string;
  name: string;
  className: string;
  style: CSSProperties;
  version: string;
  theme: string;

  checkboxClassName: string;
  checkboxStyle: CSSProperties;
  labelClassName: string;
  labelStyle: CSSProperties;
  label: string;
  text: string;
  children: ReactNode;

  value: any;
  labelPosition: 'before' | 'after';
  disabled: boolean;
  checked: boolean;
  halfChecked: boolean;
  halfToChecked: boolean;
  required: boolean;

  additionalData: object;
  tipText: string;
  tipData: object;
  boxTabIndex: string;
  icon: string;
  iconClassName: string;
  iconStyle: CSSProperties;

  onPreChange: (value: any, newChecked: boolean, e: MouseEvent<HTMLSpanElement>) => boolean | unknown;
  onChange: (value: any, checked: boolean, e: MouseEvent<HTMLSpanElement>, additionalData?: object) => unknown;
  onFocus: (value: any, checked: boolean, e: FocusEvent) => unknown;
  onBlur: (value: any, checked: boolean, e: FocusEvent) => unknown;
  onKeyDown: KeyboardEventHandler<HTMLSpanElement>;

}

export type OptionalProps = Partial<Props>;
```

## 使用示例

### 基本属性设置

基本属性设置，展示默认选中、tooltip 提示、onPreChange 拦截、禁用和半选状态

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
          <Checkbox value="1" label="Administrative" disabled={true} style={style}></Checkbox>
          <Checkbox value="1" label="halfChecked" halfChecked={true} checked={true}></Checkbox>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<CheckboxExample />, mountNode);

```

### 事件处理

事件处理，展示 onChange 回调和 getValue / focus API 调用

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
    this.setState({msg: "getValue API: " + this.checkbox.getValue()});
  };

  handleClickFocus = () => {
    this.checkbox.focus();
  };

  handleChange = (value, checked, event, additionalData) => {
    if (checked) {
      this.setState({msg: "onChange callback: Selected, Value: " + value, checked: true});
    } else {
      this.setState({msg: "onChange callback: Deselected, Value: " + value, checked: false});
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle = {marginLeft: "20px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Checkbox_example">
          <Checkbox style={{marginLeft: "20px"}}
                    checked={this.state.checked} value="1" label="onChange event display" onChange={this.handleChange}
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

### labelPosition 与自定义图标

通过 labelPosition 控制文本位置，通过 icon/iconClassName/iconStyle 自定义图标

```jsx
import Checkbox from 'eview-ui/Checkbox';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CheckboxLabelExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginTop: '20px'}}>
          <Checkbox value="1" label="Label After (default)" style={{margin: '10px'}} />
          <Checkbox value="2" label="Label Before" labelPosition="before" style={{margin: '10px'}} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CheckboxLabelExample />, mountNode);
```

### 全选（CheckboxGroup）

使用 CheckboxGroup 实现全选功能

```jsx
import CheckboxGroup from 'eview-ui/CheckboxGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ComboCheckbox extends React.Component {

  handleChange = (value, oldValue, event) => {
    console.log("checked values: " + value);
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
    let fieldStyle = {width: "200px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_CheckboxGroup_example">
          <div>
            <CheckboxGroup label="Example with label: "
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

