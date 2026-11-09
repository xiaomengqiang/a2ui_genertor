# BrowseButton 浏览按钮

> 分类：通用

Browse Button组件提供浏览元,用于触发组件选择对话框,更新和浏览路径。

## API

| 方法名      | 描述                   | 参数  | 返回值         |
|----------|----------------------|-----|-------------|
 validate | 用于手动进行非空检查，并返回是否通过校验 | -   | 校验结果，bool类型 |

### 属性

| 属性             | 说明                                                                                                                                                                               | 类型                                      | 默认值     |
|:---------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------|:--------|
| id             | 元素的id                                                                                                                                                                            | string                                  |         |
| label          | 自定义按钮的标签                                                                                                                                                                         | string                                  | `· · ·` |
| readOnly       | 设置文本框只读                                                                                                                                                                          | bool                                    | `false` |
| className      | 为组件增加className                                                                                                                                                                   | string                                  |         |
| buttonDisabled | 禁用按钮                                                                                                                                                                             | bool                                    | `false` |
| inputDisabled  | 禁用输入框                                                                                                                                                                            | bool                                    | `false` |
| value          | 设置需要显示的默认值。                                                                                                                                                                      | string                                  |         |
| placeHolder    | 字符串占位符                                                                                                                                                                           | string                                  |         |
| inputStyle     | 定制输入框样式                                                                                                                                                                          | object                                  |         |
| buttonStyle    | 定制按钮样式                                                                                                                                                                           | object                                  |         | 
| required       | 支持设置组件值是否必须，若为必须，支持非空校验                                                                                                                                                          | bool                                    | `false` |
| hintType       | 显示提示信息                                                                                                                                                                           | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br> |         |
| onClick        | 定义按钮点击事件<br>`function(event: React.MouseEvent, value: string) => void`<br>*event:* 原生dom的event<br>*value:* new value                                                             | function                                |         |
| onChange       | 定义输入框内容改变时的事件<br>`function(newValue: string, oldValue: string, event: React.ChangeEvent) => void`<br>*newValue:* new value<br>*oldValue:* previous value<br>*event:* 原生dom的event | function                                |         |
| onKeyDown      | 定义输入框在按下键盘键时的事件<br>`function(event: React.KeyboardEvent) => void`<br>*event:* 原生dom的event                                                                                        | function                                |         |
| onKeyPress     | 定义输入框在按下键盘键时的事件<br>`function(event: React.KeyboardEvent) => void`<br>*event:* 原生dom的event                                                                                        | function                                |         |
| onKeyUp        | 定义输入框在放开键盘键时的事件<br>`function(event: React.KeyboardEvent) => void`<br>*event:* 原生dom的event                                                                                        | function                                |         |
| onFocus        | 定义输入框聚焦时的事件<br>`function(event: React.FocusEvent) => void`<br>*event:* 原生dom的event                                                                                               | function                                |         |
| onBlur         | 定义输入框的失去焦点时的事件<br>`function(event: React.FocusEvent) => void`<br>*event:* 原生dom的event                                                                                            | function                                |         |
| useLatestValue | 设置文本框的useLatestValue属性，具体作用参考TextField                                                                                                                                           | boolean                                 | false   |
| inputProps | 设置文本框的属性，具体作用参考TextField                                                                                                                                           | object                                 |   |

## 使用示例

### Click事件

Click事件

```jsx
import BrowseButton from 'eview-ui/BrowseButton';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class BrowseButtonExample extends React.Component {

	constructor(props) {
		super(props);

		this.clickCallBack = this.clickCallBack.bind(this);
	}

	state = {
		msg1: '',
		msg2: '',
		msg3: ""
	};

	clickCallBack(e, value) {
		this.setState({ msg1: "OnClick, value : " + value });
		this.setState({ msg2: "" });
		this.setState({ msg3: "" });
	}

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <BrowseButton onClick={this.clickCallBack} defaultValue={"Default Value"} placeHolder={"Click here to search"}
                        value={"d:\\"}/>
          {this.state.msg1 ? <DivMessage text={this.state.msg1} type="success"/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<BrowseButtonExample />, mountNode);

```

### Change事件

Change事件

```jsx
import BrowseButton from 'eview-ui/BrowseButton';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class BrowseButtonExample extends React.Component {

	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	state = {
		msg1: '',
		msg2: '',
		msg3: ""
	};

	onChange(value, oldValue, e) {
		this.setState({ msg1: "" });
		this.setState({ msg2: "onChange, value : " + value });
		this.setState({ msg3: "" });
	}

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div><BrowseButton onChange={this.onChange} disabled={false} inputStyle={{width: "200px "}}/>
          {this.state.msg2 ? <DivMessage text={this.state.msg2} type="success"/> : ''}</div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<BrowseButtonExample />, mountNode);

```

### 禁用

禁用浏览按钮

```jsx
import BrowseButton from 'eview-ui/BrowseButton';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class BrowseButtonExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <BrowseButton label={"search"} buttonDisabled={true} />
        </div>
      </ConfigProvider>
    );
  }
}
ReactDOM.render(<BrowseButtonExample />, mountNode);

```

### 模糊事件和用户指定的样式

模糊事件和用户指定的样式

```jsx
import BrowseButton from 'eview-ui/BrowseButton';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class BrowseButtonExample extends React.Component {

	constructor(props) {
		super(props);

		this.onBlur = this.onBlur.bind(this);
	}

	state = {
		msg1: '',
		msg2: '',
		msg3: ""
	};

	onBlur(e) {
		this.setState({ msg1: "" });
		this.setState({ msg2: "" });
		this.setState({ msg3: "onBlur, value : " + e.target.value });
	}

  render() {
    const [version, theme] = getDemoVersion();
    let inputStyle = { width: "400px" };
    let buttonStyle = { width: "100px" };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div><BrowseButton label={"search"} onBlur={this.onBlur} inputStyle={inputStyle} buttonStyle={buttonStyle}/>
          {this.state.msg3 ? <DivMessage text={this.state.msg3} type="success"/> : ''}</div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<BrowseButtonExample />, mountNode);

```

### 自定义图标

自定义图标

```jsx
import BrowseButton from 'eview-ui/BrowseButton';
import homeIcon from '@images/home';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class BrowseButtonExample extends React.Component {

	constructor(props) {
		super(props);
	}

	state = {
		msg1: '',
		msg2: '',
		msg3: ""
	};

	render() {
    const [version, theme] = getDemoVersion();
		let buttonStyle = { backgroundImage: `url(${homeIcon})`, backgroundPosition: "center", backgroundRepeat: "no-repeat" };
		return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div><BrowseButton defaultValue={"defaultValue"} buttonStyle={buttonStyle} label={""}/></div>
      </ConfigProvider>
		);
	}
}

ReactDOM.render(<BrowseButtonExample />, mountNode);

```

