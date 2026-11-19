# InputSelect 可输可选组件

> 分类：数据录入

该组件用来设置可输入的下拉框，需设置文本显示值text和数据库存取值value，同时可设置初始化选中项，同时可在输入框中过滤下拉选项，当下拉列表中只有一个选项时，可回车选中。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `AutoComplete` | `InputSelect` | `options=[{text, value}]`；**`onChange(value, oldValue)`**（两参）；**无 placeholder prop**（需外层处理）；`onInputEnter(e, value)`；`onInputChange(value)`；`enablHorzScroll` 拼写注意；`caseInsensitiveFilter` 默认为true；`showCustomInput` 支持自定义输入值 |

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getValue|用来获取下拉框中被选中项的value值|无|下拉框选中项的值|
|validate|用来校验下拉选项是否被选中，返回是否通过校验|无|校验结果，bool类型|
|focus|用来设置下拉框聚焦|无|无|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| options |  设置传入数据let options = [{ text: "111", value: 1 }, {text: "222", value: 2}, {text: "333", value: 3}]; <br>其中text是页面展示值，value是数据库存取值，disabled可设置该选项禁用 | array |  |
| id |  设置InputSelect的id | string |  |
| style |  通过自定义style来改变InputSelect的整体样式 例如:边缘边距宽度 | object |  |
| className |  通过自定义class来改变InputSelect的整体样式 例如:边缘边距宽度 | string |  |
| version | 传入该值可定制当前组件匹配的ucd规范，不传则默认aui2规范。例如：version='aui3' | string |  |
| theme | 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式。例如：theme='evening' | string |  |
| labelClassName |  通过添加class的方式自定义下拉框的名称的样式 | string |  |
| labelStyle |  通过添加style的方式自定义下拉框的名称的样式 | object |  |
| selectClassName |  通过自定义class来改变input的样式 例如:边框颜色背景 | string |  |
| selectStyle |  通过自定义style来改变input的样式 例如:边框颜色背景 | object |  |
| optionClassName |  通过自定class来改变option的样式 | string |  |
| optionStyle |  通过自定style来改变option的样式, 设置optionStyle={{width:'300px'}}可设置下拉框宽度 | object |  |
| iconClassName |  通过添加class的方式自定义下拉框中的图标以及样式 | string |  |
| iconStyle |  通过添加style的方式自定义下拉框中的图标以及样式 | object |  |
| label |  设置下拉框的名称文字 | string |  |
| labelPosition |  设置输入框的名称文字的位置 before代表名称文字在输入框的左边，after代表名称文字在输入框的右边 | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| value |  设置默认的value值,若同时设置了selectedIndex则以value为准 | any |  |
| selectedIndex |  设置默认的index,此处为数据属性options中对应的index | number | -1 |
| disabled |  设置inputSelect的灰化 | bool | false |
| enablHorzScroll | 是否为弹出窗口设置水平滚动条 | bool | false |
| showSearchTip |  是否启用"未找到"提示 | bool | true |
| showCustomInput | 是否展示自定义输入值，开启后允许输入不在下拉列表中的值 | bool | false |
| caseInsensitiveFilter | 是否启用大小写不敏感过滤，为true时输入框过滤忽略大小写 | bool | true |
| required |  设置组件是否为必填项 | bool | false |
| zIndex | 设置InputSelect弹出层的zIndex | number | getBaseZIndex() + getBaseZIndexUnit() |
| popupDirection |  下拉框弹出方向(注:当弹出方向空间不够时会自动切换到其他方向) | "top"<br>"bottom" | "bottom" |
| onChange |  设置inputSelect的onChange事件,监听inputSelect选中值得变化<br><br>**签名:**<br>`function(value: any, oldValue: any) => void`<br>*value:* 当前选中的选项的value值<br>*oldValue:* 组件上一次选中值 | function |  |
| onInputChange | 设置输入框内容变化时的回调<br><br>**签名:**<br>`function(value: string) => void`<br>*value:* 输入框当前输入的值 | function |  |
| onFocus |  设置inputSelect的onFocus事件<br><br>**签名:**<br>`function(e: object) => void`<br>*e:* 原生dom事件 | function |  |
| onBlur |  设置inputSelect的onBlur事件<br><br>**签名:**<br>`function(e: object) => void`<br>*e:* 原生dom事件 | function |  |
| onInputEnter | 输入框回车事件回调<br><br>**签名:**<br>`function(e: object, value: string) => void`<br>*e:* 原生dom事件<br>*value:* 输入框中输入的值 | function |  |
| onInputKeyUp | 输入框按键抬起事件回调<br><br>**签名:**<br>`function(value: string) => void`<br>*value:* 输入框中输入的值 | function |  |
| onClosePopup | 下拉弹窗关闭时的回调<br><br>**签名:**<br>`function() => void` | function |  |
| onClick | 设置inputSelect的onClick事件 | function |  |
| onKeyUp | 设置inputSelect的onKeyUp事件 | function |  |

> **注意：** 组件支持原生HTML input属性透传（如 `maxLength`、`placeholder` 等），通过 `{...other}` 传递给内部input元素。

## 接口定义

```typescript
interface data {
  text: string;
  value: string | number;
  disabled?: boolean;
}

interface InputSelect {

  /**
   * 设置传入数据let options = [{ text: "111", value: 1 }, {text: "222", value: 2}, {text: "333", value: 3}];
   * 其中text是页面展示值，value是数据库存取值，disabled可设置该选项禁用
   */
  options: data[];

  /**
   * 设置InputSelect的id
   */
  id: string;

  /**
   * 通过自定义style来改变InputSelect的整体样式
   * 例如:margin padding width
   */
  style: object;

  /**
   * 通过自定义class来改变InputSelect的整体样式
   * 例如:margin padding width
   */
  className: string;

  /**
   * 传入该值可定制当前组件匹配的ucd规范，不传则默认aui2规范
   * 例如：
   * version='aui3'
   */
  version: string;

  /**
   * 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式
   * 例如：
   * theme='evening'
   */
  theme: string;

  /**
   * 通过添加class的方式自定义下拉框的名称的样式
   */
  labelClassName: string;

  /**
   * 通过添加style的方式自定义下拉框的名称的样式
   */
  labelStyle: object;

  /**
   * 通过自定义class来改变input的样式
   * 例如:border color background
   */
  selectClassName: string;

  /**
   * 通过自定义style来改变input的样式
   * 例如:border color background
   */
  selectStyle: object;

  /**
   * 通过自定class来改变option的样式
   */
  optionClassName: string;

  /**
   * 通过自定style来改变option的样式
   */
  optionStyle: object;

  /**
   * 通过添加class的方式自定义下拉框中的图标以及样式
   */
  iconClassName: string;

  /**
   * 通过添加style的方式自定义下拉框中的图标以及样式
   */
  iconStyle: object;

  /**
   * 设置下拉框的名称文字
   */
  label: string;

  /**
   * 设置输入框的名称文字的位置
   * before代表名称文字在输入框的左边，after代表名称文字在输入框的右边
   */
  labelPosition: 'before' | 'after';

  /**
   * 设置选中的index;此处为数据属性options中对应的index
   */
  selectedIndex: number;

  /**
   * 设置选中的value值，组件通过该值选中下拉项
   */
  value: any;

  /**
   * 设置inputSelect的灰化
   */
  disabled: boolean;

  /**
   * 设置组件是否为必填项
   */
  required: boolean;

  /**
   * 是否启用"未找到"提示
   */
  showSearchTip: boolean;

  /**
   * 是否为弹出窗口设置水平滚动条
   */
  enablHorzScroll: boolean;

  /**
   * 是否启用大小写不敏感过滤，为true时输入框过滤忽略大小写
   */
  caseInsensitiveFilter: boolean;

  /**
   * 是否展示自定义输入值，开启后允许输入不在下拉列表中的值
   */
  showCustomInput: boolean;

  /**
   * 设置inputSelect的onChange事件;监听inputSelect选中值得变化
   *
   * @param {any} value 当前选中的选项的value值
   * @param {any} oldValue 组件上一次选中值
   */
  onChange: (value: any, oldValue: any) => void;

  /**
   * 设置输入框内容变化时的回调
   *
   * @param {string} value 输入框当前输入的值
   */
  onInputChange: (value: string) => void;

  /**
   * 设置inputSelect的onFocus事件
   *
   * @param {FocusEvent} e 原生dom事件
   */
  onFocus: (e: FocusEvent) => unknown;

  /**
   * 设置inputSelect的onBlur事件
   *
   * @param {FocusEvent} e 原生dom事件
   */
  onBlur: (e: FocusEvent) => unknown;

  /**
   * 输入框回车事件回调
   *
   * @param {KeyboardEvent} e 原生dom事件
   * @param {string} value 输入框中输入的值
   */
  onInputEnter: (e: KeyboardEvent, value: string) => unknown;

  /**
   * 输入框按键抬起事件回调
   *
   * @param {string} value 输入框中输入的值
   */
  onInputKeyUp: (value: string) => unknown;

  /**
   * 下拉框弹出方向
   */
  popupDirection: 'top' | 'bottom';

  /**
   * 设置弹出层的zIndex
   */
  zIndex: number;

  /**
   * 下拉弹窗关闭时的回调
   */
  onClosePopup: () => unknown;

  /**
   * 通过添加class的方式自定义下拉框中的图标以及样式
   */
  iconClassName: string;

  /**
   * 通过添加style的方式自定义下拉框中的图标以及样式
   */
  iconStyle: object;

  /**
   * 设置inputSelect的onClick事件
   */
  onClick: (e: any) => unknown;

  /**
   * 设置inputSelect的onKeyUp事件
   */
  onKeyUp: (e: any) => unknown;

}
```

## 使用示例

### 基本属性设置

```jsx
import InputSelect from 'eview-ui/InputSelect';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class InputSelectExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();
    let style = { marginRight: "1rem" };
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let options = [{ text: "China is very very big country", value: 1 }, { text: "UK is small country & in Europe", value: 2 }, { text: "USA", value: 3 }, { text: "USAB", value: 4 }, { text: "USAC", value: 5 }, { text: "USAD", value: 6 }, { text: "USAE", value: 7 }, { text: "USAF", value: 8 }, { text: "USAG", value: 9 }];
    let options1 = [{ text: "BeiJIng", value: 1 }, { text: "UK", value: 2 }, { text: "USA hjnm ghyh ", value: 3 }];
    let options2 = [{ text: "China", value: 1 }, { text: "A quick brown fox jumps over the white lazy dog", value: 2 }, { text: "USA", value: 3 }, { text: "USAB", value: 4 }, { text: "USAC", value: 5 }, { text: "USAD", value: 6 }, { text: "USAE", value: 7 }, { text: "USAF", value: 8 }, { text: "USAG", value: 9 }];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_InputSelect_example" style={{ marginLeft: "20px" }}>
            <InputSelect options={options} label="默认状态" labelStyle={labelStyle} selectStyle={{width: '150px'}} selectedIndex={0} style={style}/>
            <InputSelect options={options1} label="禁用状态" labelStyle={labelStyle} value={1} disabled={true} style={style} />
            <InputSelect options={options2} label="弹出窗口设置水平滚动条" labelStyle={labelStyle} selectedIndex={0} style={style} optionStyle={{width: '300px'}} enablHorzScroll={true} maxLength={15}/>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<InputSelectExample />, mountNode);

```

### 大小写不敏感过滤与自定义输入

```jsx
import InputSelect from 'eview-ui/InputSelect';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class InputSelectFilterExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();
    let options = [{ text: "Apple", value: 1 }, { text: "Banana", value: 2 }, { text: "Cherry", value: 3 }];

    return (
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>
            <InputSelect options={options} label="大小写不敏感过滤(caseInsensitiveFilter=true)" caseInsensitiveFilter={true} style={{ marginRight: "1rem" }} />
            <InputSelect options={options} label="大小写敏感过滤(caseInsensitiveFilter=false)" caseInsensitiveFilter={false} style={{ marginRight: "1rem" }} />
            <InputSelect options={options} label="自定义输入(showCustomInput=true)" showCustomInput={true} onInputChange={(val) => console.log('输入变化:', val)} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<InputSelectFilterExample />, mountNode);

```

### API使用

```jsx
import InputSelect from 'eview-ui/InputSelect';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class InputSelectEvent extends React.Component {

  state = {
    msg: '',
    selectedValue: ''
  };

  handleChange = (value) => {
    this.setState({msg: "onChange event callback, Selected value : " + value, selectedValue: value});
  };
  handleKeyUp = (value) => {
    console.log(value);
  }

  handleClick = () => {
    this.setState({msg: "getValue API, Current value : " + this.select.getValue()});
  };

  handleClickValidate = (result) => {
    if (this.select.validate()) {
      this.setState({
        msg: "Validated, Current value : " + this.select.getValue(),
        selectedValue: this.select.getValue()
      });
    }
  };

  handleClickFocus = () => {
    this.select.focus();
  };

  render() {
    const [version, theme] = getDemoVersion();
    let options = [{text: "All", value: -1},
      {text: "Shelf0-12-53ND2-1(IN1/OUT1)", value: 0},
      {text: "Shelf0-12-53ND2-2(IN2/OUT2)", value: 1},
      {text: "Shelf0-13-11LEM24-3(IN3/OUT3)", value: 2},
      {text: "USA", value: 3},
      {text: "a1", value: 4},
      {text: "a2", value: 5},
      {text: "a3", value: 6},
      {text: "a4", value: 7},
      {text: "a5", value: 8},
      {text: "a6", value: 9},
      {text: "a7", value: 10},
      {text: "a8", value: 11},
      {text: "a9", value: 12},
      {text: "a10", value: 13},
      {text: "a11", value: 14},
      {text: "a12", value: 15},];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_InputSelect_example">
          <div style={{marginLeft: "20px"}}>
            <InputSelect id={"ID_InputSelect"} label="Event callback function" options={options} required
                         value={this.state.selectedValue} onChange={this.handleChange} onInputKeyUp={this.handleKeyUp} ref={(select) => this.select = select}/>&nbsp;&nbsp;
            <Button text="Value" onClick={this.handleClick} style={{marginRight: "5px"}}></Button>
            <Button text="Verification" onClick={this.handleClickValidate} style={{marginRight: "5px"}}></Button>
            <Button text="Focusing" onClick={this.handleClickFocus} style={{marginRight: "5px"}}></Button>
            {this.state.msg ?
              <DivMessage text={this.state.msg} type="success" style={{marginTop: '10px', width: '500px',}}/> : ''}
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<InputSelectEvent />, mountNode);

```

