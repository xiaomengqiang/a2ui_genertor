# HexField Hex输入框

> 分类：数据录入

该组件是用于输入十六进制数值的文本输入框，支持同时定义文本框的名称，直接使用可简化样式定义，同时支持自定义样式。该组件同时支持必填设置与校验，并给出错误提示，还可选择错误提示的位置。组件内部会对输入内容进行十六进制校验和格式化（自动过滤非法字符，每两位字符间自动添加空格），支持原生input的所有事件。

## API

| 方法名 | 描述 | 参数 | 返回 |
|---|---|---|---|
| getValue | 获取当前文本框中的值 | 无 | string：当前文本框中的值 |
| validate | 用于手动进行非空检查，并返回是否通过校验 | 无 | boolean：校验结果 |
| focus | 用来设置文本框聚焦 | 无 | 无 |

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| id | 组件默认设置动态id，且组件支持用户自定义id | string | 自动生成（前缀`eui_tf_`） |
| style | 通过添加style的方式自定义该组件的整体样式（作用于最外层div），例如：margin padding | React.CSSProperties | |
| className | 通过添加class的方式自定义该组件的整体样式（作用于最外层div），例如：margin padding | string | |
| version | 传入该值可定制当前组件匹配的ucd规范，不传则默认aui2规范，例如：`version='aui3'` | string | |
| theme | 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式，例如：`theme='evening'` | string | |
| label | 设置输入框的名称文字 | string | |
| placeholder | 设置文本输入框的placeholder | string | |
| labelClassName | 通过添加class的方式控制label的样式以及输入框和文本之间的间距 | string | |
| labelStyle | 通过添加style的方式控制label的样式以及输入框和文本之间的间距 | React.CSSProperties | |
| errorLabelStyle | 通过添加style的方式控制错误提示标签的样式 | React.CSSProperties | `{}` |
| inputClassName | 通过添加class的方式来控制input的样式 | string | |
| inputStyle | 通过添加style的方式来控制input的样式 | React.CSSProperties | |
| containerStyle | 定义输入框容器的样式（包含input、字数统计、错误提示的外层div） | React.CSSProperties | |
| value | 支持给组件设置value值，传入的值会自动进行十六进制格式化 | string | |
| ruleText | 设置输入框右边显示的输入标准（该提示一直存在于输入框右侧） | string | |
| maxLength | 设置输入的最大长度，设置后输入框右下角显示当前字数/最大字数 | number | |
| labelPosition | 设置输入框的名称文字的位置：`before`代表名称文字在输入框的前面，`after`代表名称文字在输入框的后面 | enum: `'before'` \| `'after'` | `'before'` |
| required | 支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验 | boolean | `false` |
| disabled | 设置组件的灰化（禁用） | boolean | `false` |
| selectOnfocus | 聚焦时是否自动选中输入框中的内容 | boolean | `true` |
| isCharacterAllowed | 自定义字符过滤函数，返回`false`则输入的字符将被忽略<br><br>**签名:**<br>`function(value: string, id: string) => boolean`<br>*value:* 当前输入值<br>*id:* 组件的id | function | |
| validator | 设置自定义校验规则<br><br>**签名:**<br>`function(value: string, id: string, type: string) => { result: boolean, message: string }`<br>*value:* 用户输入值<br>*id:* 产生此事件的组件ID<br>*type:* 触发类型，`'onChange'` 或 `'onBlur'`<br><br>*returns* `{ result: boolean, message: string }`：<br/>result - 校验是否有错误（true为通过）<br/>message - 错误提示的文本信息<br/>result和message字段名不能更换 | function | |
| onBlur | 定义组件失去焦点时的事件<br><br>**签名:**<br>`function(event: React.FocusEvent) => void`<br>*event:* React的FocusEvent | function | |
| onChange | 定义组件内容改变时的事件<br><br>**签名:**<br>`function(newValue: string, oldValue: string, event: React.ChangeEvent) => void`<br>*newValue:* 新值<br>*oldValue:* 旧值<br>*event:* React的ChangeEvent | function | |
| onFocus | 定义组件聚焦时的事件<br><br>**签名:**<br>`function(event: React.FocusEvent) => void`<br>*event:* React的FocusEvent | function | |

## 使用示例

### 基本用法

```jsx
import HexField from 'eview-ui/HexField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class HexFieldExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const labelStyle = { display: 'block', paddingLeft: '0px' };
    const divStyle = { margin: '10px 20px', display: 'inline-block' };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_hexField_example">
          <div style={divStyle}>
            <HexField style={{ width: '50%' }} label="Default style" placeholder="Hex field..." labelStyle={labelStyle} />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<HexFieldExample />, mountNode);
```

### 必填与校验

```jsx
import HexField from 'eview-ui/HexField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class HexFieldValidatorExample extends React.Component {
  constructor(props) {
    super(props);
    this.hexRef = React.createRef();
  }

  customValidator(value, id, type) {
    if (value.length > 8) {
      return { result: false, message: '输入值不能超过8位' };
    }
    return { result: true, message: '' };
  }

  render() {
    const [version, theme] = getDemoVersion();
    const labelStyle = { display: 'block', paddingLeft: '0px' };

    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <HexField
            ref={this.hexRef}
            label="必填Hex"
            required
            placeholder="请输入十六进制值"
            labelStyle={labelStyle}
            validator={this.customValidator}
            errorLabelStyle={{ color: 'red' }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<HexFieldValidatorExample />, mountNode);
```

### 禁用、字数限制与输入标准

```jsx
import HexField from 'eview-ui/HexField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class HexFieldMoreExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <HexField label="禁用状态" value="0A 1F" disabled />
          <HexField label="最大长度" placeholder="最多输入12位" maxLength={12} />
          <HexField label="输入标准" placeholder="如 00 1A FF" ruleText="Hex (0-9, A-F)" />
          <HexField label="标签在后" placeholder="Hex value" labelPosition="after" />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<HexFieldMoreExample />, mountNode);
```

