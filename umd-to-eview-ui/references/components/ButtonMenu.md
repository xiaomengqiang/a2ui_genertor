# Button Menu 菜单按钮

> 分类：通用

Menu组件提供API功能,用户可以创建和子菜单。
<br>
注意：文本下拉按钮类型仅适用于ICT3.1规范。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Dropdown.Button` | `ButtonMenu` | `text` + `options=[{text, value, iconUrl?, disable?}]` + `onClick(value, event)` |

## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| id | 自定义id | string | - |
| className |  自定义class | string | - |
| style |  自定义组件样式 | React.CSSProperties | - |
| text |  Button中的文本 | string |  |
| iconUrl |  图标 | string |  |
| status |  Button的状态 | `default`&#124;`primary`&#124;`risk`| `default `|
| value |  项的值 | any | - |
| disabled |  设置组件灰化。 | bool | false |
| required |  设置是否必选，但它无会使用在表单中，没有什么用处，可以忽略。 | bool |  |
| options |  设置每个数据项 例:options = [{text: "111", value: 1}, {text: "222", value: 2}, {text: "333", value: 2} 在 text, 页面显示值和, 数据库访问值 | array |  |
| optionClassName |  设置options类名 | string | - |
| optionStyle |  设置options的样式 例:optionStyle={{width:'350px'}}设置了下拉框的宽度. | React.CSSProperties | - |
|position| Button Menu的位置 | `left`&#124;`right` | `left` |
| onClick |  组件item的点击事件 | *function*:` (value: any, event: object) => void`<br>value: item <br>event: DOM原生click事件 |  |
| onFocus |  组件聚焦时的事件 | *function*:` (event: object) => void`<br>event: DOM原生click事件 |  |
| displayDirection |  弹出方向 | `auto`&#124;`up`&#124;`down` | `auto` |
| tipShow | tip是否展示 | `always`&#124;`never` | `never` |
| tipData | tip展示内容  | string | text属性值 |
| label |  设置label | string |  |
| labelClassName |  label自定义类 | string |  |
| labelStyle |  label自定义样式 | React.CSSProperties |  |
| labelPosition |  设置label的位置 | `before`&#124;`after` | `before` |
| getPopupContainer | 设置弹窗的容器元素 | (() => HTMLElement) |  | 
| isTextDropdown | 是否文本下拉按钮类型 | boolean | `false` 
| textColor | 文本下拉按钮类型的文本颜色 | 'blue'&#124;'black' | `blue`

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import ButtonMenu from "eview-ui/ButtonMenu";
import createDefault from "@images/create_default";
import deleteDefault from "@images/delete_default";
import exportDefault from "@images/export_default";
import createIcon from "@images/create_icon";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ButtonMenuExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    let style1 = { marginLeft: "20px", width: "400px" };
    let style2 = { marginLeft: "20px", width: "400px" };
    let labelStyle = { paddingLeft: "5px" };

    let optionsButton1 = [
      { text: "Create", value: 1, iconUrl: createDefault },
      { text: "Export", value: 2, iconUrl: exportDefault },
      { text: "Delete", value: 3, iconUrl: deleteDefault },
      { text: "Create1", value: 4, iconUrl: createDefault },
      { text: "Export1", value: 5, iconUrl: exportDefault },
      { text: "Delete1", value: 6, iconUrl: deleteDefault },
      { text: "Create2", value: 7, iconUrl: createDefault },
      { text: "Export2", value: 8, iconUrl: exportDefault },
      { text: "Delete2", value: 9, iconUrl: deleteDefault }
    ];

    let optionsButton2 = [
      { text: "Create", value: 1, iconUrl: createDefault },
      { text: "Export", value: 2, iconUrl: exportDefault },
      { text: "Delete", value: 3, iconUrl: deleteDefault },
      { text: "Create1", value: 4, iconUrl: createDefault },
      {
        text: "Create1Create1Create1Create1Create1Create1Create1Create1",
        value: 5,
        iconUrl: exportDefault
      },
      { text: "Delete1", value: 6, iconUrl: deleteDefault },
      { text: "Create2", value: 7, iconUrl: createDefault },
      { text: "Export2", value: 8, iconUrl: exportDefault },
      {
        text: "Create1Create1Create1Create1CreateCreate1Create1Create11",
        value: 9,
        iconUrl: deleteDefault
      },
      {
        text: "Create1Create1Create1Create1Create1Create1Create1",
        value: 10,
        iconUrl: createDefault
      },
      {
        text: "Create1Create1CreateCreate1Create1Create1Create11Create1Create1",
        value: 11,
        iconUrl: exportDefault
      },
      { text: "Create1", value: 12, iconUrl: deleteDefault }
    ];

    let textOptions = [
      { text: "Create", value: 1 },
      { text: "Modify I am Big Text", value: 2 }
    ];

    let options1 = [{ text: "Create", value: 1 }];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_ButtonMenu_example">
          <div>
            <ButtonMenu
              text="Operation "
              position="right"
              iconUrl={createDefault}
              options={optionsButton1}
              label="Default style"
              labelStyle={labelStyle}
              selectedIndex={1}
              style={style1}
            />
            <br/>
            <br/>
            <ButtonMenu
              text="Operation"
              options={textOptions}
              label="Only Text:"
              labelStyle={labelStyle}
              value={1}
              style={style2}
            />
            <br/>
            <br/>
            <ButtonMenu
              text="Operation"
              iconUrl={createIcon}
              options={textOptions}
              label="Disabled style"
              labelStyle={labelStyle}
              value={1}
              disabled={true}
              style={style2}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ButtonMenuExample />, mountNode);
```

### 文本下拉按钮类型

基本属性设置

```jsx
import ButtonMenu from "eview-ui/ButtonMenu";
import createDefault from "@images/create_default";
import deleteDefault from "@images/delete_default";
import exportDefault from "@images/export_default";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ButtonMenuExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    let style1 = { marginLeft: "20px", width: "400px" };
    let labelStyle = { paddingLeft: "5px" };

    let optionsButton1 = [
      { text: "Create", value: 1 },
      { text: "Export", value: 2 },
      { text: "Delete", value: 3 },
      { text: "Create1", value: 4 },
      { text: "Export1", value: 5 },
      { text: "Delete1", value: 6 },
      { text: "Create2", value: 7 },
      { text: "Export2", value: 8 },
      { text: "Delete2", value: 9 }
    ];


    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_ButtonMenu_example">
          <div>
            <ButtonMenu
              text="文本按钮"
              position="right"
              iconUrl={createDefault}
              options={optionsButton1}
              label="Default style"
              labelStyle={labelStyle}
              selectedIndex={1}
              style={style1}
              isTextDropdown
              width={'12rem'}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ButtonMenuExample />, mountNode);
```

### 按钮菜单事件

按钮菜单事件

```jsx
import ButtonMenu from 'eview-ui/ButtonMenu';
import createDefault from '@images/create_default';
import deleteDefault from '@images/delete_default';
import exportDefault from '@images/export_default';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ButtonMenuExample extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  state = {
    msg: '',
  };

  handleChange = (data, event) => {
    this.setState({
      msg: 'OnClick event callback: Selected option Text : ' + data.text + ' and Value : ' + data.value,
    });
  };

  handleFocus = e => {
    this.setState({ msg: 'OnFocus event callback: Selected option Text : ' + e.target.value });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let style = { marginLeft: '20px', width: '310px' };
    let labelStyle = { paddingLeft: '0px' };
    let options = [
      { text: 'Create', value: 1, iconUrl: createDefault, title: 'Create a Drive' },
      { text: 'Export', value: 2, disable: true, iconUrl: exportDefault, title: 'Export a Drive' },
      { text: 'Delete', value: 3, iconUrl: deleteDefault, title: 'Delete a Drive' },
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_ButtonMenu_example">
          <div>
            <ButtonMenu
              text="Operation"
              iconUrl={createDefault}
              options={options}
              label="OnClick Event"
              labelStyle={labelStyle}
              selectedIndex={0}
              style={style}
              onClick={this.handleChange}
              onFocus={this.handleFocus}
              tipShow={'always'}
              tipData={'Operation drive'}
            />
            {this.state.msg ? (
              <DivMessage
                text={this.state.msg}
                type="success"
                style={{marginTop: '10px', width: '420px', marginLeft: '93px'}}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ButtonMenuExample />, mountNode);
```

### popup位置

通过设置 `displayDirection` 为 `up` `down` 控制 popup 弹出位置。

```jsx
import ButtonMenu from 'eview-ui/ButtonMenu';
import createDefault from '@images/create_default';
import deleteDefault from '@images/delete_default';
import exportDefault from '@images/export_default';
import DivMessage from 'eview-ui/DivMessage';
import LabelField from 'eview-ui/LabelField';
import Radio from 'eview-ui/Radio';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ButtonMenuExample extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    msg: '',
  };

  render() {
    const [version, theme] = getDemoVersion();

    let style = { marginLeft: '20px', width: '310px' };
    let labelStyle = { paddingLeft: '0px' };
    let options = [
      {
        text: 'Create',
        value: 1,
        iconUrl: createDefault,
        title: 'Create a Drive',
      },
      {
        text: 'Export',
        value: 2,
        disable: true,
        iconUrl: exportDefault,
        title: 'Export a Drive',
      },
      {
        text: 'Delete',
        value: 3,
        iconUrl: deleteDefault,
        title: 'Delete a Drive',
      },
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_ButtonMenu_example">
          <div>
            <ButtonMenu
              text="Up Button"
              iconUrl={createDefault}
              options={options}
              label="display向上："
              labelStyle={labelStyle}
              displayDirection="up"
              style={style}
            />
            <br/>
            <br/>

            <ButtonMenu
              text="Down Button"
              iconUrl={createDefault}
              options={options}
              label="display向下："
              labelStyle={labelStyle}
              displayDirection="down"
              style={style}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ButtonMenuExample />, mountNode);
```

### icon和label位置设定

通过设置 `position` 为 `left` `right` 控制 icon 位置。
<br/>
通过设置 `labelPosition` 为 `before` `after` 控制 label 位置。

```jsx
import ButtonMenu from 'eview-ui/ButtonMenu';
import createDefault from '@images/create_default';
import deleteDefault from '@images/delete_default';
import exportDefault from '@images/export_default';
import DivMessage from 'eview-ui/DivMessage';
import LabelField from 'eview-ui/LabelField';
import Radio from 'eview-ui/Radio';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ButtonMenuExample extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    labelPos: 'before',
    iconPos: 'left',
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { paddingLeft: '0px' };
    let options = [
      {
        text: 'Create',
        value: 1,
        iconUrl: createDefault,
        title: 'Create a Drive',
      },
      {
        text: 'Export',
        value: 2,
        disable: true,
        iconUrl: exportDefault,
        title: 'Export a Drive',
      },
      {
        text: 'Delete',
        value: 3,
        iconUrl: deleteDefault,
        title: 'Delete a Drive',
      },
    ];
    const { iconPos, labelPos } = this.state;
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_ButtonMenu_example">
          <div style={{marginBottom: '1rem', display: 'flex'}}>
            <LabelField text="label位置:"/>
            <Radio
              value="before"
              label="before"
              checked={labelPos === 'before'}
              onChange={value => this.setState({labelPos: value})}
              style={{marginRight: '0.5rem'}}
            />
            <Radio
              value="after"
              label="after"
              checked={labelPos === 'after'}
              onChange={value => this.setState({labelPos: value})}
            />
          </div>
          <div style={{marginBottom: '1rem', display: 'flex'}}>
            <LabelField text="icon位置:"/>
            <Radio
              value="left"
              label="left"
              checked={iconPos === 'left'}
              onChange={value => this.setState({iconPos: value})}
              style={{marginRight: '0.5rem'}}
            />
            <Radio
              value="right"
              label="right"
              checked={iconPos === 'right'}
              onChange={value => this.setState({iconPos: value})}
            />
          </div>
          <div>
            <ButtonMenu
              text="Opertion"
              iconUrl={createDefault}
              options={options}
              position={iconPos}
              labelPosition={labelPos}
              label="自定义位置"
              labelStyle={labelStyle}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ButtonMenuExample />, mountNode);
```

