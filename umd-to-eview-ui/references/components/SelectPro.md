# SelectPro 选择器

> 分类：数据录入

此组件为 **[受控组件](https://zh-hans.reactjs.org/docs/forms.html#controlled-components)**<br>
`单选`/`单选带搜索`/`多选`/`多选带搜索` 四种类型可选择<br>
需在option数组中设置文本显示值text和唯一标识value; 可自定义显示的元素<br>

### 键盘操作:

Enter键: 打开下拉框/选中Option<br>
Esc键: 收起下拉框<br>
↑↓键: 切换不同的选项;聚焦到multiSearch类型下的输入框<br>


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Select` | `SelectPro`（**唯一——旧 Select 弃用**） | **受控组件**（value 唯一数据源）；基础下拉 `mode='single'`（默认可省）；`options` 项 `label`→**`text`**（`{text, value, disabled?}`）；**`placeholder` 同名保留**（旧 Select 才是 defaultLabel——本 skill 不用旧 Select）；**`onChange(value, options)` 两参**（options 是选中项对象/数组——antd `labelInValue` 的替代）；`defaultValue` 仅 mount 生效一次——antd defaultValue 转**初始 `value` state** 更稳（**必须设默认选中值**，无默认时取 `options[0].value`）；`notFoundContent`→`emptyOptionsMsg`；无 `allowClear`；性能：options ≤500、`isVirtualScroll` ≤1W 条 |
| `Select showSearch` | `SelectPro mode="singleSearch"` | 同上 + **`onInputChange(value, e)` 搜索时必填**（antd `onSearch` 逻辑迁入）；搜索过滤后仍只能选列表项；输入值可作选中值的场景（AutoComplete）用 `InputSelect` |

## API

| 方法名      | 描述                   | 参数  | 返回值                                   |
|----------|----------------------|-----|---------------------------------------|
| getValue | 获取已选中value的数组        | -   | React.ReactText  \| React.ReactText[] |
| focus    | 设置select组件聚焦         | -   | -                                     |
| validate | 用于手动进行非空检查，并返回是否通过校验 | -   | 校验结果，bool类型                           |

### 公共属性

| 属性                 | 描述                                                                                                                                                                                                                                                                                           | 类型                                                                                                                                                              | 默认值                             |
|:-------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------|
| id                 | 自定义组件id                                                                                                                                                                                                                                                                                      | string                                                                                                                                                          | -                               |
| className          | 设置组件class                                                                                                                                                                                                                                                                                    | string                                                                                                                                                          | -                               |
| emptyOptionsMsg    | 当options不存在数据时，自定义展示消息                                                                                                                                                                                                                                                                       | string                                                                                                                                                          | -                               |
| style              | 设置组件style                                                                                                                                                                                                                                                                                    | React.CSSProperties                                                                                                                                             | -                               |
| onPopupShowChanged | popup弹出框状态改变时的回调,参数为新的弹出框展示状态                                                                                                                                                                                                                                                                | `function:(popupShow: boolean) => void`                                                                                                                         | -                               |
| onFocus            | 获得焦点时回调,点击下拉框中选项也会触发                                                                                                                                                                                                                                                                         | `function:(event: object) => void`                                                                                                                              | -                               |
| onBlur             | 失去焦点时回调,点击下拉框中选项也会触发                                                                                                                                                                                                                                                                         | `function:(event: object) => void`                                                                                                                              | -                               |
| onChange           | 选中的value变化时，触发此回调 <br>**签名:**<br>*values*: 选中项的value 值/数组 <br>*options*: 选中项对应的option 值/数组                                                                                                                                                                                                   | `function:(value: ReactText                                                                                                                                     | ReactText[], options: OptionObj | OptionObj[]) => void` | - |
| mode               | 指定选择器的类型                                                                                                                                                                                                                                                                                   | `single`\| `singleSearch`\| `multiple` \| `multiSearch`                                                                                                         | 'single'                        |
| defaultValue       | 默认选中项,此项只在组件mount时生效一次                                                                                                                                                                                                                                                                       | ReactText \| ReactText[]                                                                                                                                        | -                               |
| value              | 选中项,此项是当前组件的唯一数据源                                                                                                                                                                                                                                                                            | ReactText \| ReactText[]                     | -                               |
| options            | 设置展示的option数据<br> 例: <br>[{`text`: "Option1",  //选中选项之后显示在Select中的值 <br> `value`: 1, //option的唯一标识 <br> `node`:<span\>option1</span\>, // 自定义option的展示项,不设置则option默认显示text值<br> `style`:{color:red}//设置样式 <br> `className`:'my-option-1' //设置类名<br>},<br> {`text`: "Option2", `value`: 2 }]; | OptObj[]<br><br>OptObj对象参数:<br>text: string<br>value: React.ReactText<br> <node\>: React.ReactNode <br> <style\>: React.CSSProperties <br> <className\>: string | -                               |
| disabled           | 是否禁用组件                                                                                                                                                                                                                                                                                       | bool                                                                                                                                                            | false                           |
| placeholder        | 选择框提示文字                                                                                                                                                                                                                                                                                      | string                                                                                                                                                          | 默认提示                            |
| popupDirection     | 下拉框弹出方向(注:当弹出方向空间不够时会自动切换到其他方向)                                                                                                                                                                                                                                                              | `top`\| `bottom`                 | bottom                          |
| selectClassName    | 自定义select的class                                                                                                                                                                                                                                                                              | string                                                                                                                                                          | -                               |
| selectStyle        | 自定义select的样式                                                                                                                                                                                                                                                                                 | React.CSSProperties                                                                                                                                             | -                               |
| dropdownClassName  | 自定义dropdown的class                                                                                                                                                                                                                                                                            | string                                                                                                                                                          | -                               |
| dropdownStyle      | 自定义dropdown的样式                                                                                                                                                                                                                                                                               | React.CSSProperties                                                                                                                                             | -                               |
| optionClassName    | 自定义option的class                                                                                                                                                                                                                                                                              | string                                                                                                                                                          | -                               |
| optionStyle        | 自定义option的样式, *set optionStyle.width for setting the width of the popup window                                                                                                                                                                                                               | object                                                                                                                                                          | -                               |
| required           | 设置组件是否为必填项                                                                                                                                                                                                                                                                                   | bool                                                                                                                                                            | false                           |
| toolTipProps       | 自定义选项的Tooltip样式，参考Tooltip组件文档来设置                                                                                                                                                                                                                                                             | object                                                                                                                                                          | -                               |
| validationTipStyle | 自定义校验弹出的Tooltip样式，参考Tooltip文档中的CustomTooltipType来设置                                                                                                                                                                                                                                          | object                                                                                                                                                          | -                               |
| validator          | 设置自定义校验规则<br>**签名:**<br>`function:(value: ReactText[]                                                                                                                                                                                                                                        | ReactText[]) => {result: boolean, message: string}`<br>*value:*选中项的value数组<br><br>*result:*校验结果,true代表通过<br>*message:*校验失败显示的提示信息                               | function                        | - |
| hintType           | 显示提示信息(required)                                                                                                                                                                                                                                                                             | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br>                                                                                                                         | 'div'                           |
| getPopupContainer | 获取渲染父节点, 设为false时为元素虚拟dom的原位置 | (() => HTMLElement) &#124; false |  |
| isVirtualScroll | 支持下拉内容虚拟滚动加载，注：不支持配置enableCloseIcon；不支持jsx定制化选项HTML内容；数据规模不超过1W条。 | false |  |
| tipTextLimit    | 限制多选时tip内容的长度显示，超过会截断内容加...显示，注：大量数据全选场景下设置显示tip内容，业务可根据实际诉求设置tip长度截断处理，提升Tip显示性能。    | number    |  
| tipMaxHeight    | 多选时tip内容太多，控制tip最大高度，超过最大高度，tip内容出滚动条展示。    |`number`\| `string`    | 支持px与rem，默认值 36rem
| inputTextDisplayLimit    | 限制输入框选择的内容显示的最大长度，超过会截断内容加...显示      | number    |  默认值1000 
| isManualSearch    | 支持搜索时，是否支持手动搜索, 仅适用于ICT 3.1规范。      | boolean   | false |

### 搜索模式属性

| 属性            | 描述                                      | 类型                                          | 默认值  |
|:--------------|:----------------------------------------|:--------------------------------------------|:-----|
| showSearchTip | 展示搜索为空提示                                | bool                                        | true |
| onInputChange | 当input中的值改变的时候触发这个函数, 如果要使用搜索功能，该属性为必填项 | `function(value: string, e: Event) => void` | -    |

### 多选模式属性

| 属性              | 描述              | 类型     | 默认值   |
|:----------------|:----------------|:-------|:------|
| delimiter       | value之间的分隔符     | string | ','   |
| selectAll       | 在下拉菜单中添加“All”选项 | bool   | false |
| enableCloseIcon | 每个选项可以单独删除      | bool   | false |

## 迁移文档

| 方法 / 属性                                                    | 说明                                                             | 类型   |
|------------------------------------------------------------|----------------------------------------------------------------|------|
| mode                                                       | 可选择 单选/单选带搜索/多选/多选带搜索 四种模式                                     | 新增   |
| dropdownClassName, dropdownStyle                           | 用来控制dropdown的样式                                                | 新增   |
| selectedIndex \-> defaultValue                             | value是唯一标识,所以使用defaultValue,不用index                            | 更改   |
| validate\(\) -> validator                                  | 原方法只能校验是否为空,无太大作用,现做成回调形式,具体见API                               | 更改   |
| options                                                    | 见API文档                                                         | 属性修改 |
| toolTipPosition, disableToolTip, tipStyle \-> TooltipProps | 用TooltipProps深度定制                                              | 属性收编 |
| zIndex                                                     | 可通过包装一层div来设置,冗余                                               | 删除   |
| label相关                                                    | 包括:labelClassName/ labelStyle/label/labelPosition/defaultLabel | 删除   |
| enableHorzScroll, isScrollAlwaysDisplay                    | 超出长度会自动展示tip                                                   | 删除   |
| hintType                                                   | 与Select组件无关                                                    | 删除   |
| iconClassName, iconStyle                                   | option中可传入自定义的ReactNode                                        | 删除   |

## 接口定义

```typescript
import React from 'react';

export type SelectMode = 'single' | 'singleSearch' | 'multiple' | 'multiSearch';
export type ValueType = React.ReactText | React.ReactText[];

export interface OptionObj {
  text: string;
  value: React.ReactText;
  node?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}
export interface OnChangeFunc {
  (values: ValueType, options: OptionObj | OptionObj[]): void;
}
export interface InnerSelectorProps {
  selectClassName?: string;
  selectStyle?: React.CSSProperties;
  mode?: SelectMode;
  placeholder?: string;
  disabled?: boolean;
  onChange?: OnChangeFunc;
  onInputChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  open?: boolean;
  tabIndex?: number;
  hintType?: 'div' | 'tip';
}
```

## 使用示例

### 单选(single) 基础属性 此组件为受控组件,保证唯一数据源

## en-US

```jsx
import SelectPro from 'eview-ui/SelectPro';
import Button from 'eview-ui/Button';
import navForm from '@images/nav_form';
import navFormActive from '@images/nav_form_active';
import navMsg from '@images/nav_msg';
import navMsgActive from '@images/nav_msg_active';
import navHeart from '@images/nav_heart';
import navHeartActive from '@images/nav_heart_active';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
export default class SelectProExample extends React.Component {
  constructor() {
    super();
    this.state = {
      curValue: '',
      curValue1: '',
    };
  }
  onSelectGroup = value => {
    this.setState({
      curValue: value,
    });
  };
  onSelectGroup1 = value => {
    this.setState({
      curValue1: value,
    });
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };

    let options0 = [
      { text: 'China is big country', value: '1' },
      { text: 'UK is small country', value: '2' },
      { text: 'USA', value: 3 },
      { text: 'USAB', value: 4 },
      { text: 'USAC', value: 5 },
      { text: 'USAD', value: 6 },
      { text: 'USAE', value: 7 },
      { text: 'USAF', value: 8 },
      { text: 'USAG', value: 9 },
      { text: 'aa', value: 10 },
      { text: 'bb', value: 11 },
      { text: 'cc', value: 12 },
      { text: 'dd', value: 13 },
      { text: 'ee', value: 14 },
    ];

    const moreOptions = [];
    for (let i = 15; i <= 10000; i++) {
      moreOptions.push({
        text: `val${i}`,
        value: i,
      });
    }
    options0 = options0.concat(moreOptions);

    const customizedOption = [
      {
        text: 'Create',
        value: 1,
        node: (
          <div>
            <Button
              leftIcon={navForm}
              size={'small'}
              leftIconProps={{
                leftHoverIcon: navFormActive,
              }}
              style={{ padding: 0, border: 0, background: 'transparent' }}
            />
            <span>Create</span>
          </div>
        ),
      },
      {
        text: 'Export',
        value: 2,
        node: (
          <div>
            <Button
              leftIcon={navMsg}
              size={'small'}
              leftIconProps={{
                leftHoverIcon: navMsgActive,
              }}
              style={{ padding: 0, border: 0, background: 'transparent' }}
            />
            <span>Export</span>
          </div>
        ),
      },
      {
        text: 'Delete',
        value: 3,
        node: (
          <div>
            <Button
              leftIcon={navHeart}
              size={'small'}
              leftIconProps={{
                leftHoverIcon: navHeartActive,
              }}
              style={{ padding: 0, border: 0, background: 'transparent' }}
            />
            <span>Delete</span>
          </div>
        ),
      },
    ];

    const [version, theme] = getDemoVersion();    

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div>
            <div>基础功能:value需要配合onChange使用</div>
            <SelectPro options={options0} value={this.state.curValue} onChange={this.onSelectGroup} isVirtualScroll={true}/>
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>必填项 / 弹出方向 / 提示语</div>
            <SelectPro
              options={options0}
              required={true}
              value={this.state.curValue1}
              onChange={this.onSelectGroup1}
              placeholder="请选择国家"
              popupDirection="top" // 当弹出方向空间不够时会自动切换到其他方向
            />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>自定义Options / 默认值</div>
            <SelectPro options={customizedOption} defaultValue={1} />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>disabled</div>
            <SelectPro options={options0} disabled={true} />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>id / style / className添加</div>
            <SelectPro
              options={options0}
              className="selectorClassName"
              selectClassName="selectClassName"
              dropdownClassName="dropdownClassName"
              optionClassName="optionClassName"
              style={{ width: '25rem' }}
              isVirtualScroll={true}
            />
            <br />
            <br />
            <br />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SelectProExample />, mountNode);
```

```jsx
import SelectPro from 'eview-ui/SelectPro';
import Button from 'eview-ui/Button';
import navForm from '@images/nav_form';
import navFormActive from '@images/nav_form_active';
import navMsg from '@images/nav_msg';
import navMsgActive from '@images/nav_msg_active';
import navHeart from '@images/nav_heart';
import navHeartActive from '@images/nav_heart_active';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
export default class SelectProExample extends React.Component {
  constructor() {
    super();
    this.state = {
      curValue: '',
      curValue1: '',
    };
  }
  onSelectGroup = value => {
    this.setState({
      curValue: value,
    });
  };
  onSelectGroup1 = value => {
    this.setState({
      curValue1: value,
    });
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };

    let options0 = [
      { text: 'China is big country', value: '1' },
      { text: 'UK is small country', value: '2' },
      { text: 'USA', value: 3 },
      { text: 'USAB', value: 4 },
      { text: 'USAC', value: 5 },
      { text: 'USAD', value: 6 },
      { text: 'USAE', value: 7 },
      { text: 'USAF', value: 8 },
      { text: 'USAG', value: 9 },
      { text: 'aa', value: 10 },
      { text: 'bb', value: 11 },
      { text: 'cc', value: 12 },
      { text: 'dd', value: 13 },
      { text: 'ee', value: 14 },
    ];

    const moreOptions = [];
    for (let i = 15; i <= 10000; i++) {
      moreOptions.push({
        text: `val${i}`,
        value: i,
      });
    }
    options0 = options0.concat(moreOptions);

    const customizedOption = [
      {
        text: 'Create',
        value: 1,
        node: (
          <div>
            <Button
              leftIcon={navForm}
              size={'small'}
              leftIconProps={{
                leftHoverIcon: navFormActive,
              }}
              style={{ padding: 0, border: 0, background: 'transparent' }}
            />
            <span>Create</span>
          </div>
        ),
      },
      {
        text: 'Export',
        value: 2,
        node: (
          <div>
            <Button
              leftIcon={navMsg}
              size={'small'}
              leftIconProps={{
                leftHoverIcon: navMsgActive,
              }}
              style={{ padding: 0, border: 0, background: 'transparent' }}
            />
            <span>Export</span>
          </div>
        ),
      },
      {
        text: 'Delete',
        value: 3,
        node: (
          <div>
            <Button
              leftIcon={navHeart}
              size={'small'}
              leftIconProps={{
                leftHoverIcon: navHeartActive,
              }}
              style={{ padding: 0, border: 0, background: 'transparent' }}
            />
            <span>Delete</span>
          </div>
        ),
      },
    ];

    const [version, theme] = getDemoVersion();    

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div>
            <div>基础功能:value需要配合onChange使用</div>
            <SelectPro options={options0} value={this.state.curValue} onChange={this.onSelectGroup} isVirtualScroll={true}/>
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>必填项 / 弹出方向 / 提示语</div>
            <SelectPro
              options={options0}
              required={true}
              value={this.state.curValue1}
              onChange={this.onSelectGroup1}
              placeholder="请选择国家"
              popupDirection="top" // 当弹出方向空间不够时会自动切换到其他方向
            />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>自定义Options / 默认值</div>
            <SelectPro options={customizedOption} defaultValue={1} />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>disabled</div>
            <SelectPro options={options0} disabled={true} />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>id / style / className添加</div>
            <SelectPro
              options={options0}
              className="selectorClassName"
              selectClassName="selectClassName"
              dropdownClassName="dropdownClassName"
              optionClassName="optionClassName"
              style={{ width: '25rem' }}
              isVirtualScroll={true}
            />
            <br />
            <br />
            <br />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SelectProExample />, mountNode);
```

### 事件处理

## en-US

```jsx
import SelectPro from 'eview-ui/SelectPro';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SelectEventExample extends React.Component {
  state = {
    msg: '',
    selectedValue: '',
    options: [
      { text: 'China', value: 1 },
      { text: 'UK', value: 2 },
      { text: 'USA', value: 3 },
    ],
  };

  handleChange = value => {
    this.setState({ msg: `OnChange Event Callback, Selected Value: ${value}`, selectedValue: value });
  };

  handleClick = () => {
    this.setState({ msg: `获取当前的值: ${this.state.selectedValue}`});
  };

  handleClickFocus = () => {
    this.select.focus();
  };

  render() {
    const buttonStyle = { marginLeft: '20px' };
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Select_example" style={{ marginLeft: '20px', minHeight: '80px' }}>
          <div style={blockStyle}>
            <div>Event Callback</div>
            <SelectPro
              options={this.state.options}
              ref={select => (this.select = select)}
              value={this.state.selectedValue}
              onChange={this.handleChange}
            />
            <Button text="Value" onClick={this.handleClick} style={buttonStyle}></Button>
            <Button text="Focusing" onClick={this.handleClickFocus} style={buttonStyle}></Button>
          </div>
          <br />
          <br />
          <br />
          {this.state.msg ? (
            <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '560px' }} />
          ) : (
            ''
          )}
        </div>
      </ConfigProvider>

    );
  }
}

ReactDOM.render(<SelectEventExample />, mountNode);
```

```jsx
import SelectPro from 'eview-ui/SelectPro';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class SelectEventExample extends React.Component {
  state = {
    msg: '',
    selectedValue: '',
    options: [
      { text: 'China', value: 1 },
      { text: 'UK', value: 2 },
      { text: 'USA', value: 3 },
    ],
  };

  handleChange = value => {
    this.setState({ msg: `OnChange Event Callback, Selected Value: ${value}`, selectedValue: value });
  };

  handleClick = () => {
    this.setState({ msg: `获取当前的值: ${this.state.selectedValue}`});
  };

  handleClickFocus = () => {
    this.select.focus();
  };

  render() {
    const buttonStyle = { marginLeft: '20px' };
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Select_example" style={{ marginLeft: '20px', minHeight: '80px' }}>
          <div style={blockStyle}>
            <div>Event Callback</div>
            <SelectPro
              options={this.state.options}
              ref={select => (this.select = select)}
              value={this.state.selectedValue}
              onChange={this.handleChange}
            />
            <Button text="Value" onClick={this.handleClick} style={buttonStyle}></Button>
            <Button text="Focusing" onClick={this.handleClickFocus} style={buttonStyle}></Button>
          </div>
          <br />
          <br />
          <br />
          {this.state.msg ? (
            <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '560px' }} />
          ) : (
            ''
          )}
        </div>
      </ConfigProvider>

    );
  }
}

ReactDOM.render(<SelectEventExample />, mountNode);
```

### 搜索

## en-US

```jsx
import SelectPro from 'eview-ui/SelectPro';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LazySelectExample extends React.Component {
  constructor() {
    super();
    this.state = {
      msg: '',
      curValue1: '',
      curValue2: [],
    };
    this.options = [
      { text: 'Afghanistan', value: 1 },
      { text: 'Albania', value: 2 },
      { text: 'Algeria', value: 3 },
      { text: 'Andorra', value: 4 },
      { text: 'Angola', value: 5 },
      { text: 'Anguilla', value: 6 },
      { text: 'Antigua & Barbuda', value: 7 },
      { text: 'Argentina', value: 8 },
      { text: 'Armenia', value: 9 },
      { text: 'Australia', value: 10 },
      { text: 'Austria', value: 11 },
      { text: 'Azerbaijan', value: 12 },
      { text: 'Bahamas', value: 13 },
      { text: 'Bahrain', value: 14 },
      { text: 'Bangladesh', value: 15 },
      { text: 'Barbados', value: 16 },
      { text: 'Belarus', value: 17 },
      { text: 'Belgium', value: 18 },
      { text: 'Belize', value: 19 },
      { text: 'Benin', value: 20 },
      { text: 'Bermuda', value: 21 },
      { text: 'Bhutan', value: 22 },
      { text: 'Bolivia', value: 23 },
      { text: 'Bosnia & Herzegovina', value: 24 },
      { text: 'Botswana', value: 25 },
      { text: 'Brazil', value: 26 },
      { text: 'Brunei Darussalam', value: 27 },
      { text: 'Bulgaria', value: 28 },
      { text: 'Burkina Faso', value: 29 },
      { text: 'Myanmar/Burma', value: 30 },
      { text: 'Burundi', value: 31 },
      { text: 'Cambodia', value: 32 },
      { text: 'Cameroon', value: 33 },
      { text: 'Canada', value: 34 },
      { text: 'Cape Verde', value: 35 },
      { text: 'Cayman Islands', value: 36 },
      { text: 'Central African Republic', value: 37 },
      { text: 'Chad', value: 38 },
      { text: 'Chile', value: 39 },
      { text: 'China', value: 40 },
      { text: 'Colombia', value: 41 },
      { text: 'Comoros', value: 42 },
      { text: 'Congo', value: 43 },
      { text: 'Costa Rica', value: 44 },
      { text: 'Croatia', value: 45 },
      { text: 'Cuba', value: 46 },
      { text: 'Cyprus', value: 47 },
      { text: 'Czech Republic', value: 48 },
      { text: 'Democratic Republic of the Congo', value: 49 },
      { text: 'Denmark', value: 50 },
      { text: 'Djibouti', value: 51 },
      { text: 'Dominican Republic', value: 52 },
      { text: 'Dominica', value: 53 },
      { text: 'Ecuador', value: 54 },
      { text: 'Egypt', value: 55 },
      { text: 'El Salvador', value: 56 },
      { text: 'Equatorial Guinea', value: 57 },
      { text: 'Eritrea', value: 58 },
      { text: 'Estonia', value: 59 },
      { text: 'Ethiopia', value: 60 },
      { text: 'Fiji', value: 61 },
      { text: 'Finland', value: 62 },
      { text: 'France', value: 63 },
      { text: 'French Guiana', value: 64 },
      { text: 'Gabon', value: 65 },
      { text: 'Gambia', value: 66 },
      { text: 'Georgia', value: 67 },
      { text: 'Germany', value: 68 },
      { text: 'Ghana', value: 69 },
      { text: 'Great Britain', value: 70 },
      { text: 'Greece', value: 71 },
      { text: 'Grenada', value: 72 },
      { text: 'Guadeloupe', value: 73 },
      { text: 'Guatemala', value: 74 },
      { text: 'Guinea', value: 75 },
      { text: 'Guinea-Bissau', value: 76 },
      { text: 'Guyana', value: 77 },
      { text: 'Haiti', value: 78 },
      { text: 'Honduras', value: 79 },
      { text: 'Hungary', value: 80 },
      { text: 'Iceland', value: 81 },
      { text: 'India', value: 82 },
      { text: 'Indonesia', value: 83 },
      { text: 'Iran', value: 84 },
      { text: 'Iraq', value: 85 },
      { text: 'Israel and the Occupied Territories', value: 86 },
      { text: 'Italy', value: 87 },
      { text: "Ivory Coast (Cote d'Ivoire)", value: 88 },
      { text: 'Jamaica', value: 89 },
      { text: 'Japan', value: 90 },
      { text: 'Jordan', value: 91 },
      { text: 'Kazakhstan', value: 92 },
      { text: 'Kenya', value: 93 },
      { text: 'Kosovo', value: 94 },
      { text: 'Kuwait', value: 95 },
      { text: 'Kyrgyz Republic (Kyrgyzstan)', value: 96 },
      { text: 'Laos', value: 97 },
      { text: 'Latvia', value: 98 },
      { text: 'Lebanon', value: 99 },
      { text: 'Lesotho', value: 100 },
      { text: 'Liberia', value: 101 },
      { text: 'Libya', value: 102 },
      { text: 'Liechtenstein', value: 103 },
      { text: 'Lithuania', value: 104 },
      { text: 'Luxembourg', value: 105 },
      { text: 'Republic of Macedonia', value: 106 },
      { text: 'Madagascar', value: 107 },
      { text: 'Malawi', value: 108 },
      { text: 'Malaysia', value: 109 },
      { text: 'Maldives', value: 110 },
      { text: 'Mali', value: 111 },
      { text: 'Malta', value: 112 },
      { text: 'Martinique', value: 113 },
      { text: 'Mauritania', value: 114 },
      { text: 'Mauritius', value: 115 },
      { text: 'Mayotte', value: 116 },
      { text: 'Mexico', value: 117 },
      { text: 'Moldova', value: 118 },
      { text: 'Mongolia', value: 119 },
    ];
  }

  handleChange1 = value => {
    console.log('handleChange1触发', value);
    this.setState({ curValue1: value, msg: 'onChange1: ' + value });
  };

  handleInputChange1 = (value, e) => {
    this.setState({ curValue1: value, msg: 'handleInputChange1: ' + value });
  };

  handleChange2 = value => {
    this.setState({ curValue2: value, msg: 'onChange2: ' + value });
  };

  handleInputChange2 = (value, e) => {
    this.setState({ msg: 'handleInputChange2: ' + value });
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={blockStyle}>
            <div>单选带搜索</div>
            <SelectPro
              mode="singleSearch"
              options={this.options}
              value={this.state.curValue1}
              onChange={this.handleChange1}
              onInputChange={this.handleInputChange1}
              isVirtualScroll={true}
            />
          </div>

          <div style={blockStyle}>
            <div>多选带搜索</div>
            <SelectPro
              mode='multiSearch'
              options={this.options}
              value={this.state.curValue2}
              onChange={this.handleChange2}
              onInputChange={this.handleInputChange2}
              enableCloseIcon
              isVirtualScroll={true}
            />
          </div>
          {this.state.msg ? (
            <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '560px' }} />
          ) : (
            ''
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LazySelectExample />, mountNode);
```

```jsx
import SelectPro from 'eview-ui/SelectPro';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LazySelectExample extends React.Component {
  constructor() {
    super();
    this.state = {
      msg: '',
      curValue1: '',
      curValue2: [],
    };
    this.options = [
      { text: 'Afghanistan', value: 1 },
      { text: 'Albania', value: 2 },
      { text: 'Algeria', value: 3 },
      { text: 'Andorra', value: 4 },
      { text: 'Angola', value: 5 },
      { text: 'Anguilla', value: 6 },
      { text: 'Antigua & Barbuda', value: 7 },
      { text: 'Argentina', value: 8 },
      { text: 'Armenia', value: 9 },
      { text: 'Australia', value: 10 },
      { text: 'Austria', value: 11 },
      { text: 'Azerbaijan', value: 12 },
      { text: 'Bahamas', value: 13 },
      { text: 'Bahrain', value: 14 },
      { text: 'Bangladesh', value: 15 },
      { text: 'Barbados', value: 16 },
      { text: 'Belarus', value: 17 },
      { text: 'Belgium', value: 18 },
      { text: 'Belize', value: 19 },
      { text: 'Benin', value: 20 },
      { text: 'Bermuda', value: 21 },
      { text: 'Bhutan', value: 22 },
      { text: 'Bolivia', value: 23 },
      { text: 'Bosnia & Herzegovina', value: 24 },
      { text: 'Botswana', value: 25 },
      { text: 'Brazil', value: 26 },
      { text: 'Brunei Darussalam', value: 27 },
      { text: 'Bulgaria', value: 28 },
      { text: 'Burkina Faso', value: 29 },
      { text: 'Myanmar/Burma', value: 30 },
      { text: 'Burundi', value: 31 },
      { text: 'Cambodia', value: 32 },
      { text: 'Cameroon', value: 33 },
      { text: 'Canada', value: 34 },
      { text: 'Cape Verde', value: 35 },
      { text: 'Cayman Islands', value: 36 },
      { text: 'Central African Republic', value: 37 },
      { text: 'Chad', value: 38 },
      { text: 'Chile', value: 39 },
      { text: 'China', value: 40 },
      { text: 'Colombia', value: 41 },
      { text: 'Comoros', value: 42 },
      { text: 'Congo', value: 43 },
      { text: 'Costa Rica', value: 44 },
      { text: 'Croatia', value: 45 },
      { text: 'Cuba', value: 46 },
      { text: 'Cyprus', value: 47 },
      { text: 'Czech Republic', value: 48 },
      { text: 'Democratic Republic of the Congo', value: 49 },
      { text: 'Denmark', value: 50 },
      { text: 'Djibouti', value: 51 },
      { text: 'Dominican Republic', value: 52 },
      { text: 'Dominica', value: 53 },
      { text: 'Ecuador', value: 54 },
      { text: 'Egypt', value: 55 },
      { text: 'El Salvador', value: 56 },
      { text: 'Equatorial Guinea', value: 57 },
      { text: 'Eritrea', value: 58 },
      { text: 'Estonia', value: 59 },
      { text: 'Ethiopia', value: 60 },
      { text: 'Fiji', value: 61 },
      { text: 'Finland', value: 62 },
      { text: 'France', value: 63 },
      { text: 'French Guiana', value: 64 },
      { text: 'Gabon', value: 65 },
      { text: 'Gambia', value: 66 },
      { text: 'Georgia', value: 67 },
      { text: 'Germany', value: 68 },
      { text: 'Ghana', value: 69 },
      { text: 'Great Britain', value: 70 },
      { text: 'Greece', value: 71 },
      { text: 'Grenada', value: 72 },
      { text: 'Guadeloupe', value: 73 },
      { text: 'Guatemala', value: 74 },
      { text: 'Guinea', value: 75 },
      { text: 'Guinea-Bissau', value: 76 },
      { text: 'Guyana', value: 77 },
      { text: 'Haiti', value: 78 },
      { text: 'Honduras', value: 79 },
      { text: 'Hungary', value: 80 },
      { text: 'Iceland', value: 81 },
      { text: 'India', value: 82 },
      { text: 'Indonesia', value: 83 },
      { text: 'Iran', value: 84 },
      { text: 'Iraq', value: 85 },
      { text: 'Israel and the Occupied Territories', value: 86 },
      { text: 'Italy', value: 87 },
      { text: "Ivory Coast (Cote d'Ivoire)", value: 88 },
      { text: 'Jamaica', value: 89 },
      { text: 'Japan', value: 90 },
      { text: 'Jordan', value: 91 },
      { text: 'Kazakhstan', value: 92 },
      { text: 'Kenya', value: 93 },
      { text: 'Kosovo', value: 94 },
      { text: 'Kuwait', value: 95 },
      { text: 'Kyrgyz Republic (Kyrgyzstan)', value: 96 },
      { text: 'Laos', value: 97 },
      { text: 'Latvia', value: 98 },
      { text: 'Lebanon', value: 99 },
      { text: 'Lesotho', value: 100 },
      { text: 'Liberia', value: 101 },
      { text: 'Libya', value: 102 },
      { text: 'Liechtenstein', value: 103 },
      { text: 'Lithuania', value: 104 },
      { text: 'Luxembourg', value: 105 },
      { text: 'Republic of Macedonia', value: 106 },
      { text: 'Madagascar', value: 107 },
      { text: 'Malawi', value: 108 },
      { text: 'Malaysia', value: 109 },
      { text: 'Maldives', value: 110 },
      { text: 'Mali', value: 111 },
      { text: 'Malta', value: 112 },
      { text: 'Martinique', value: 113 },
      { text: 'Mauritania', value: 114 },
      { text: 'Mauritius', value: 115 },
      { text: 'Mayotte', value: 116 },
      { text: 'Mexico', value: 117 },
      { text: 'Moldova', value: 118 },
      { text: 'Mongolia', value: 119 },
    ];
  }

  handleChange1 = value => {
    console.log('handleChange1触发', value);
    this.setState({ curValue1: value, msg: 'onChange1: ' + value });
  };

  handleInputChange1 = (value, e) => {
    this.setState({ curValue1: value, msg: 'handleInputChange1: ' + value });
  };

  handleChange2 = value => {
    this.setState({ curValue2: value, msg: 'onChange2: ' + value });
  };

  handleInputChange2 = (value, e) => {
    this.setState({ msg: 'handleInputChange2: ' + value });
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={blockStyle}>
            <div>单选带搜索</div>
            <SelectPro
              mode="singleSearch"
              options={this.options}
              value={this.state.curValue1}
              onChange={this.handleChange1}
              onInputChange={this.handleInputChange1}
              isVirtualScroll={true}
            />
          </div>

          <div style={blockStyle}>
            <div>多选带搜索</div>
            <SelectPro
              mode='multiSearch'
              options={this.options}
              value={this.state.curValue2}
              onChange={this.handleChange2}
              onInputChange={this.handleInputChange2}
              enableCloseIcon
              isVirtualScroll={true}
            />
          </div>
          {this.state.msg ? (
            <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '560px' }} />
          ) : (
            ''
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LazySelectExample />, mountNode);
```

### 多选

## en-US

```jsx
import SelectPro from 'eview-ui/SelectPro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LazySelectExample extends React.Component {
  constructor() {
    super();
    this.state = {
      curValue1: [],
      curValue2: ['1', '2', '3', '4', '5', '6'],
      curValue3: [],
      selectedValue: [9, 10, 11],
    };
    this.selRef = null;
    this.options1 = [
      { text: 'Armenia', value: '1' },
      { text: 'Australia', value: '2' },
      { text: 'Austria', value: '3' },
      { text: 'Azerbaijan', value: '4' },
      { text: 'Bahamas', value: '5' },
      { text: 'Bahrain', value: '6' },
    ];
    this.defaultValue1 = ['1', '2'];
    this.options = [
      { text: 'Afghanistan', value: 1 },
      { text: 'Albania', value: 2 },
      { text: 'Algeria', value: 3 },
      { text: 'Andorra', value: 4 },
      { text: 'Angola', value: 5 },
      { text: 'Anguilla', value: 6 },
      { text: 'Antigua & Barb', value: 7 },
      { text: 'Argentina', value: 8 },
      { text: 'Armenia', value: 9 },
      { text: 'Australia', value: 10 },
      { text: 'Austria', value: 11 },
      { text: 'Azerbaijan', value: 12 },
      { text: 'Bahamas', value: 13 },
      { text: 'Bahrain', value: 14 },
      { text: 'Bangladesh', value: 15 },
      { text: 'Barbados', value: 16 },
      { text: 'Belarus', value: 17 },
      { text: 'Belgium', value: 18 },
      { text: 'Belize', value: 19 },
      { text: 'Benin', value: 20 },
      { text: 'Bermuda', value: 21 },
      { text: 'Bhutan', value: 22 },
      { text: 'Bolivia', value: 23 },
      { text: 'Bosnia & Herzegovina', value: 24 },
      { text: 'Botswana', value: 25 },
      { text: 'Brazil', value: 26 },
      { text: 'Brunei Darussalam', value: 27 },
      { text: 'Bulgaria', value: 28 },
      { text: 'Burkina Faso', value: 29 },
      { text: 'Myanmar/Burma', value: 30 },
      { text: 'Burundi', value: 31 },
      { text: 'Cambodia', value: 32 },
      { text: 'Cameroon', value: 33 },
      { text: 'Canada', value: 34 },
      { text: 'Cape Verde', value: 35 },
      { text: 'Cayman Islands', value: 36 },
      { text: 'Central African Republic', value: 37 },
      { text: 'Chad', value: 38 },
      { text: 'Chile', value: 39 },
      { text: 'China', value: 40 },
      { text: 'Colombia', value: 41 },
      { text: 'Comoros', value: 42 },
      { text: 'Congo', value: 43 },
      { text: 'Costa Rica', value: 44 },
      { text: 'Croatia', value: 45 },
      { text: 'Cuba', value: 46 },
      { text: 'Cyprus', value: 47 },
      { text: 'Czech Republic', value: 48 },
      { text: 'Democratic Republic of the Congo', value: 49 },
      { text: 'Denmark', value: 50 },
      { text: 'Djibouti', value: 51 },
      { text: 'Dominican Republic', value: 52 },
      { text: 'Dominica', value: 53 },
      { text: 'Ecuador', value: 54 },
      { text: 'Egypt', value: 55 },
      { text: 'El Salvador', value: 56 },
      { text: 'Equatorial Guinea', value: 57 },
      { text: 'Eritrea', value: 58 },
      { text: 'Estonia', value: 59 },
      { text: 'Ethiopia', value: 60 },
      { text: 'Fiji', value: 61 },
      { text: 'Finland', value: 62 },
      { text: 'France', value: 63 },
      { text: 'French Guiana', value: 64 },
      { text: 'Gabon', value: 65 },
      { text: 'Gambia', value: 66 },
      { text: 'Georgia', value: 67 },
      { text: 'Germany', value: 68 },
      { text: 'Ghana', value: 69 },
      { text: 'Great Britain', value: 70 },
      { text: 'Greece', value: 71 },
      { text: 'Grenada', value: 72 },
      { text: 'Guadeloupe', value: 73 },
      { text: 'Guatemala', value: 74 },
      { text: 'Guinea', value: 75 },
      { text: 'Guinea-Bissau', value: 76 },
      { text: 'Guyana', value: 77 },
      { text: 'Haiti', value: 78 },
      { text: 'Honduras', value: 79 },
      { text: 'Hungary', value: 80 },
      { text: 'Iceland', value: 81 },
      { text: 'India', value: 82 },
      { text: 'Indonesia', value: 83 },
      { text: 'Iran', value: 84 },
      { text: 'Iraq', value: 85 },
      { text: 'Israel and the Occupied Territories', value: 86 },
      { text: 'Italy', value: 87 },
      { text: "Ivory Coast (Cote d'Ivoire)", value: 88 },
      { text: 'Jamaica', value: 89 },
      { text: 'Japan', value: 90 },
      { text: 'Jordan', value: 91 },
      { text: 'Kazakhstan', value: 92 },
      { text: 'Kenya', value: 93 },
      { text: 'Kosovo', value: 94 },
      { text: 'Kuwait', value: 95 },
      { text: 'Kyrgyz Republic (Kyrgyzstan)', value: 96 },
      { text: 'Laos', value: 97 },
      { text: 'Latvia', value: 98 },
      { text: 'Lebanon', value: 99 },
      { text: 'Lesotho', value: 100 },
      { text: 'Liberia', value: 101 },
      { text: 'Libya', value: 102 },
      { text: 'Liechtenstein', value: 103 },
      { text: 'Lithuania', value: 104 },
      { text: 'Luxembourg', value: 105 },
      { text: 'Republic of Macedonia', value: 106 },
      { text: 'Madagascar', value: 107 },
      { text: 'Malawi', value: 108 },
      { text: 'Malaysia', value: 109 },
      { text: 'Maldives', value: 110 },
      { text: 'Mali', value: 111 },
      { text: 'Malta', value: 112 },
      { text: 'Martinique', value: 113 },
      { text: 'Mauritania', value: 114 },
      { text: 'Mauritius', value: 115 },
      { text: 'Mayotte', value: 116 },
      { text: 'Mexico', value: 117 },
      { text: 'Moldova', value: 118 },
      { text: 'Mongolia', value: 119 },
    ];
  }

  handleChange1 = value => {
    this.setState({ curValue1: value });
  };

  handleChange2 = value => {
    this.setState({ curValue2: value });
  };

  handleChange3 = value => {
    this.setState({ curValue3: value });
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={blockStyle}>
            <div>基础功能</div>
            <SelectPro
              mode="multiple"
              options={this.options1}
              value={this.state.curValue1}
              onChange={this.handleChange1}
            />
            <br />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>delimiter, selectAll</div>
            <SelectPro
              mode="multiple"
              options={this.options}
              delimiter="~"
              selectAll
              value={this.state.curValue2}
              onChange={this.handleChange2}
              isVirtualScroll
              tipMaxHeight={200}
              inputTextDisplayLimit={1000}
            />
            <br />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>enableCloseIcon / defaultValue</div>
            <SelectPro
              mode="multiple"
              options={this.options1}
              enableCloseIcon
              defaultValue={this.defaultValue1}
              value={this.state.curValue3}
              onChange={this.handleChange3}
            />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </ConfigProvider>

    );
  }
}

ReactDOM.render(<LazySelectExample />, mountNode);
```

```jsx
import SelectPro from 'eview-ui/SelectPro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LazySelectExample extends React.Component {
  constructor() {
    super();
    this.state = {
      curValue1: [],
      curValue2: ['1', '2', '3', '4', '5', '6'],
      curValue3: [],
      selectedValue: [9, 10, 11],
    };
    this.selRef = null;
    this.options1 = [
      { text: 'Armenia', value: '1' },
      { text: 'Australia', value: '2' },
      { text: 'Austria', value: '3' },
      { text: 'Azerbaijan', value: '4' },
      { text: 'Bahamas', value: '5' },
      { text: 'Bahrain', value: '6' },
    ];
    this.defaultValue1 = ['1', '2'];
    this.options = [
      { text: 'Afghanistan', value: 1 },
      { text: 'Albania', value: 2 },
      { text: 'Algeria', value: 3 },
      { text: 'Andorra', value: 4 },
      { text: 'Angola', value: 5 },
      { text: 'Anguilla', value: 6 },
      { text: 'Antigua & Barb', value: 7 },
      { text: 'Argentina', value: 8 },
      { text: 'Armenia', value: 9 },
      { text: 'Australia', value: 10 },
      { text: 'Austria', value: 11 },
      { text: 'Azerbaijan', value: 12 },
      { text: 'Bahamas', value: 13 },
      { text: 'Bahrain', value: 14 },
      { text: 'Bangladesh', value: 15 },
      { text: 'Barbados', value: 16 },
      { text: 'Belarus', value: 17 },
      { text: 'Belgium', value: 18 },
      { text: 'Belize', value: 19 },
      { text: 'Benin', value: 20 },
      { text: 'Bermuda', value: 21 },
      { text: 'Bhutan', value: 22 },
      { text: 'Bolivia', value: 23 },
      { text: 'Bosnia & Herzegovina', value: 24 },
      { text: 'Botswana', value: 25 },
      { text: 'Brazil', value: 26 },
      { text: 'Brunei Darussalam', value: 27 },
      { text: 'Bulgaria', value: 28 },
      { text: 'Burkina Faso', value: 29 },
      { text: 'Myanmar/Burma', value: 30 },
      { text: 'Burundi', value: 31 },
      { text: 'Cambodia', value: 32 },
      { text: 'Cameroon', value: 33 },
      { text: 'Canada', value: 34 },
      { text: 'Cape Verde', value: 35 },
      { text: 'Cayman Islands', value: 36 },
      { text: 'Central African Republic', value: 37 },
      { text: 'Chad', value: 38 },
      { text: 'Chile', value: 39 },
      { text: 'China', value: 40 },
      { text: 'Colombia', value: 41 },
      { text: 'Comoros', value: 42 },
      { text: 'Congo', value: 43 },
      { text: 'Costa Rica', value: 44 },
      { text: 'Croatia', value: 45 },
      { text: 'Cuba', value: 46 },
      { text: 'Cyprus', value: 47 },
      { text: 'Czech Republic', value: 48 },
      { text: 'Democratic Republic of the Congo', value: 49 },
      { text: 'Denmark', value: 50 },
      { text: 'Djibouti', value: 51 },
      { text: 'Dominican Republic', value: 52 },
      { text: 'Dominica', value: 53 },
      { text: 'Ecuador', value: 54 },
      { text: 'Egypt', value: 55 },
      { text: 'El Salvador', value: 56 },
      { text: 'Equatorial Guinea', value: 57 },
      { text: 'Eritrea', value: 58 },
      { text: 'Estonia', value: 59 },
      { text: 'Ethiopia', value: 60 },
      { text: 'Fiji', value: 61 },
      { text: 'Finland', value: 62 },
      { text: 'France', value: 63 },
      { text: 'French Guiana', value: 64 },
      { text: 'Gabon', value: 65 },
      { text: 'Gambia', value: 66 },
      { text: 'Georgia', value: 67 },
      { text: 'Germany', value: 68 },
      { text: 'Ghana', value: 69 },
      { text: 'Great Britain', value: 70 },
      { text: 'Greece', value: 71 },
      { text: 'Grenada', value: 72 },
      { text: 'Guadeloupe', value: 73 },
      { text: 'Guatemala', value: 74 },
      { text: 'Guinea', value: 75 },
      { text: 'Guinea-Bissau', value: 76 },
      { text: 'Guyana', value: 77 },
      { text: 'Haiti', value: 78 },
      { text: 'Honduras', value: 79 },
      { text: 'Hungary', value: 80 },
      { text: 'Iceland', value: 81 },
      { text: 'India', value: 82 },
      { text: 'Indonesia', value: 83 },
      { text: 'Iran', value: 84 },
      { text: 'Iraq', value: 85 },
      { text: 'Israel and the Occupied Territories', value: 86 },
      { text: 'Italy', value: 87 },
      { text: "Ivory Coast (Cote d'Ivoire)", value: 88 },
      { text: 'Jamaica', value: 89 },
      { text: 'Japan', value: 90 },
      { text: 'Jordan', value: 91 },
      { text: 'Kazakhstan', value: 92 },
      { text: 'Kenya', value: 93 },
      { text: 'Kosovo', value: 94 },
      { text: 'Kuwait', value: 95 },
      { text: 'Kyrgyz Republic (Kyrgyzstan)', value: 96 },
      { text: 'Laos', value: 97 },
      { text: 'Latvia', value: 98 },
      { text: 'Lebanon', value: 99 },
      { text: 'Lesotho', value: 100 },
      { text: 'Liberia', value: 101 },
      { text: 'Libya', value: 102 },
      { text: 'Liechtenstein', value: 103 },
      { text: 'Lithuania', value: 104 },
      { text: 'Luxembourg', value: 105 },
      { text: 'Republic of Macedonia', value: 106 },
      { text: 'Madagascar', value: 107 },
      { text: 'Malawi', value: 108 },
      { text: 'Malaysia', value: 109 },
      { text: 'Maldives', value: 110 },
      { text: 'Mali', value: 111 },
      { text: 'Malta', value: 112 },
      { text: 'Martinique', value: 113 },
      { text: 'Mauritania', value: 114 },
      { text: 'Mauritius', value: 115 },
      { text: 'Mayotte', value: 116 },
      { text: 'Mexico', value: 117 },
      { text: 'Moldova', value: 118 },
      { text: 'Mongolia', value: 119 },
    ];
  }

  handleChange1 = value => {
    this.setState({ curValue1: value });
  };

  handleChange2 = value => {
    this.setState({ curValue2: value });
  };

  handleChange3 = value => {
    this.setState({ curValue3: value });
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={blockStyle}>
            <div>基础功能</div>
            <SelectPro
              mode="multiple"
              options={this.options1}
              value={this.state.curValue1}
              onChange={this.handleChange1}
            />
            <br />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>delimiter, selectAll</div>
            <SelectPro
              mode="multiple"
              options={this.options}
              delimiter="~"
              selectAll
              value={this.state.curValue2}
              onChange={this.handleChange2}
              isVirtualScroll
              tipMaxHeight={200}
              inputTextDisplayLimit={1000}
            />
            <br />
            <br />
            <br />
            <br />
          </div>

          <div style={blockStyle}>
            <div>enableCloseIcon / defaultValue</div>
            <SelectPro
              mode="multiple"
              options={this.options1}
              enableCloseIcon
              defaultValue={this.defaultValue1}
              value={this.state.curValue3}
              onChange={this.handleChange3}
            />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </ConfigProvider>

    );
  }
}

ReactDOM.render(<LazySelectExample />, mountNode);
```

### 校验

## en-US

```jsx
import SelectPro from 'eview-ui/SelectPro';
import Tooltip from 'eview-ui/Tooltip';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LazySelectExample extends React.Component {
  constructor() {
    super();
    this.state = {
      curValue: [],
      showTip: false,
    };
    this.timer;
    this.options1 = [
      { text: 'Armenia', value: 9 },
      { text: 'Australia', value: 10 },
      { text: 'Austria', value: 11 },
      { text: 'Azerbaijan', value: 12 },
      { text: 'Bahamas', value: 13 },
      { text: 'Bahrain', value: 14 },
    ];
  }

  handleOnChange = value => {
    if (value.length > 3) {
      this.setState({
        showTip: true,
      });
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(
        function () {
          this.setState({
            showTip: false,
          });
        }.bind(this),
        2000
      );
    } else {
      this.setState({
        curValue: value,
        showTip: false,
      });
    }
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={blockStyle}>
            <div>校验功能</div>
            <Tooltip content="选中项不能大于3个" visible={this.state.showTip}>
              <SelectPro
                mode="multiple"
                options={this.options1}
                selectAll
                value={this.state.curValue}
                onChange={this.handleOnChange}
              />
            </Tooltip>
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LazySelectExample />, mountNode);
```

```jsx
import SelectPro from 'eview-ui/SelectPro';
import Tooltip from 'eview-ui/Tooltip';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LazySelectExample extends React.Component {
  constructor() {
    super();
    this.state = {
      curValue: [],
      showTip: false,
    };
    this.timer;
    this.options1 = [
      { text: 'Armenia', value: 9 },
      { text: 'Australia', value: 10 },
      { text: 'Austria', value: 11 },
      { text: 'Azerbaijan', value: 12 },
      { text: 'Bahamas', value: 13 },
      { text: 'Bahrain', value: 14 },
    ];
  }

  handleOnChange = value => {
    if (value.length > 3) {
      this.setState({
        showTip: true,
      });
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(
        function () {
          this.setState({
            showTip: false,
          });
        }.bind(this),
        2000
      );
    } else {
      this.setState({
        curValue: value,
        showTip: false,
      });
    }
  };

  render() {
    const blockStyle = {
      marginRight: '3rem',
    };
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={blockStyle}>
            <div>校验功能</div>
            <Tooltip content="选中项不能大于3个" visible={this.state.showTip}>
              <SelectPro
                mode="multiple"
                options={this.options1}
                selectAll
                value={this.state.curValue}
                onChange={this.handleOnChange}
              />
            </Tooltip>
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LazySelectExample />, mountNode);
```

