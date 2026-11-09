# IPInput IP输入框

> 分类：数据录入

IPInput组件实现ipv4和ipv6, mac 格式的输入。

## API

| 方法名       | 参数    | 返回值                                  | 描述                                                                          |
|-----------|-------|--------------------------------------|-----------------------------------------------------------------------------|
| getValue  |       | ip输入框的文本                             | 获取IP输入框的值,ipv4时返回“xxx.xxx.xxx.xxx”,ipv6时返回“xxx:xxx:xxx:xxx:xxx:xxx:xxx:xxx” |
| validator | value | { result: boolean; message: string } | 自定义校验函数，要求返回值格式为：{ result: boolean; message: string }，见示例“IPV4事件处理”.        |

### 属性

| 属性名称           | 输入                                                   | 默认       | 描述                                                                                                                                             |
|:---------------|:-----------------------------------------------------|:---------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| id             | string                                               |          | 定制组件id，传入该值可覆盖组件自动生成的id 例如： id='eui_ip_input__1001'                                                                                            |
| className      | string                                               |          | 定制组件class，传入该值可在组件默认样式上追加class，从而自定义组件样式 例如： className='ipInputClassName'                                                                      |
| type           | enum:<br>&nbsp;"v4"<br>&nbsp;"v6"<br>&nbsp;"mac"<br> | "v4"     | 设置输入框类型，默认为v4                                                                                                                                  |
| disabled       | bool                                                 | false    | 设置组件初始状态是否禁用，默认为否                                                                                                                              |
| readOnly       | bool                                                 | false    | Set the component is read only.                                                                                                                |
| required       | bool                                                 | false    | 支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验                                                                                                   |
| value          | string                                               |          | 设置输入框组件默认值，输入参数的合法性由使用者保证，可以通过validate方法自定义校验函数，界面上交互合法性由组件保证                                                                                  |
| delimiter      | string                                               |          | 分隔符，ipv4分隔符默认为".",ipv6分隔符默认为":"                                                                                                                |
| labelPosition  | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br>         | "before" | 设置文本内容与组件子节点的位置,  before：表示文本内容在组件子节点的左边,  after：表示文本内容在组件子节点的右边                                                                               |
| label          | string                                               |          | ip框名称                                                                                                                                          |
| labelStyle     | object                                               |          | 通过style设置label的样式                                                                                                                              |
| labelClassName | string                                               |          | 通过class设置label的样式                                                                                                                              |
| inputStyle     | object                                               |          | 通过style设置input的外层样式                                                                                                                            |
| onBlur         | function                                             |          | 设置输入框失焦时的回调方法，输入框的值将会传入回调方法<br><br>**签名:**<br>`function(value: string, event: object) => void`<br>*value:* 当前组件中的ip值<br>*event:* 触发失焦的事件对象     |
| onFocus        | function                                             |          | 设置输入框聚焦时的回调方法，输入框的值将会传入回调方法<br><br>**签名:**<br>`function(value: string, event: object) => void`<br>*value:* 当前组件中的ip值<br>*event:* 触发聚焦的事件对象     |
| onChange       | function                                             |          | 设置输入框改变时的回调方法，输入框的值将会传入回调方法<br><br>**签名:**<br>`function(value: string, event: object) => void`<br>*value:* 当前组件中的ip值<br>*event:* 触发change的事件对象 |
| hintType       | 'div' &#124; 'tip'                                   |          | 设置提示的类型                                                                                                                                        |
| tipStyle       | CustomTooltipType                                    |          | 自定义组件中ToolTip的样式，详细参考ToolTip组件                                                                                                                 |                                                                                                                   |                                                                                                                               |

## 使用示例

### 基本属性设置

## en-US



```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IPInputDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const {
      id,
      ...other
    } = this.props;

    const outerStyle = {
      display: "block", marginBottom: "20px"
    };

    const param1 = {
      label: "ipv4",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: false,
      delimiter: ":",
      value: "10:80:52:211",
      required: true
    };

    const param2 = {
      label: "ipv6",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      value: "10:80:52:211:0000:0000:0000:0000",
      type: "v6"
    };

    const param3 = {
      label: "MAC",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      type: "mac",
      value: "3D-F2-C9-A6-B3-4F"
    };

    const param4 = {
      label: "ipv4",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: true,
      value: "10.80.52.212"
    };

    const param5 = {
      label: "ipv6",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: true,
      type: "v6",
      value: "10:80:52:211:0000:0000:0000:0000"
    };

    const param6 = {
      label: "MAC",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: true,
      type: "mac",
      value: "3D-F2-C9-A6-B3-4F",
    };

    const param7 = {
      label: "ipv4",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      readOnly: true,
      value: "10.80.52.212"
    };

    const param8 = {
      label: "ipv6",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      readOnly: true,
      type: "v6",
      value: "10:80:52:211:0000:0000:0000:0000"
    };

    const param9 = {
      label: "MAC",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      readOnly: true,
      type: "mac",
      value: "3D-F2-C9-A6-B3-4F",
    };

    const titleProps = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: 0
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>

          <LabelField text={"Default Style"} style={titleProps} />
          <IPInput {...param1} />
          <IPInput {...param2} />
          <IPInput {...param3} />

          <LabelField text={"Disabled Style"} style={titleProps} />
          <IPInput {...param4} />
          <IPInput {...param5} />
          <IPInput {...param6} />

          <LabelField text={"Read Only"} style={titleProps} />
          <IPInput {...param7} />
          <IPInput {...param8} />
          <IPInput {...param9} />

        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<IPInputDemo />, mountNode);

```

```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IPInputDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const {
      id,
      ...other
    } = this.props;

    const outerStyle = {
      display: "block", marginBottom: "20px"
    };

    const param1 = {
      label: "ipv4",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: false,
      delimiter: ":",
      value: "10:80:52:211",
      required: true
    };

    const param2 = {
      label: "ipv6",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      value: "10:80:52:211:0000:0000:0000:0000",
      type: "v6"
    };

    const param3 = {
      label: "MAC",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      type: "mac",
      value: "3D-F2-C9-A6-B3-4F"
    };

    const param4 = {
      label: "ipv4",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: true,
      value: "10.80.52.212"
    };

    const param5 = {
      label: "ipv6",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: true,
      type: "v6",
      value: "10:80:52:211:0000:0000:0000:0000"
    };

    const param6 = {
      label: "MAC",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      disabled: true,
      type: "mac",
      value: "3D-F2-C9-A6-B3-4F",
    };

    const param7 = {
      label: "ipv4",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      readOnly: true,
      value: "10.80.52.212"
    };

    const param8 = {
      label: "ipv6",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      readOnly: true,
      type: "v6",
      value: "10:80:52:211:0000:0000:0000:0000"
    };

    const param9 = {
      label: "MAC",
      labelStyle: { marginRight: "20px" },
      style: outerStyle,
      readOnly: true,
      type: "mac",
      value: "3D-F2-C9-A6-B3-4F",
    };

    const titleProps = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: 0
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "20px" }}>

          <LabelField text={"Default Style"} style={titleProps} />
          <IPInput {...param1} />
          <IPInput {...param2} />
          <IPInput {...param3} />

          <LabelField text={"Disabled Style"} style={titleProps} />
          <IPInput {...param4} />
          <IPInput {...param5} />
          <IPInput {...param6} />

          <LabelField text={"Read Only"} style={titleProps} />
          <IPInput {...param7} />
          <IPInput {...param8} />
          <IPInput {...param9} />

        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<IPInputDemo />, mountNode);

```

### IPV4事件处理

## en-US

```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IPInputEventDemo extends React.Component {
  state = {
    msg: '',
    value: '10.8.52.211',
  };

  componentDidMount() {
    this.ipInput.validate();
  }

  handleClick = () => {
    const value = this.ipInput.getValue();
    this.setState({
      msg: 'value is: ' + value,
      value,
    });
  };

  validator = value => {
    // 你的ip校验逻辑.
    // ...

    return { result: false, message: 'check failed.' };
  };

  onChange = value => {
    this.setState({
      msg: 'Trigger the change event，ip: ' + value,
      value: value,
    });
  };
  onBlur = value => {
    this.setState({
      msg: 'Trigger the blur event，ip: ' + value,
      value: value,
    });
  };
  onFocus = value => {
    this.setState({
      msg: 'Trigger the focus event，ip: ' + value,
      value: value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const { id, ...other } = this.props;

    const param = {
      label: 'ipv4 Input box:',
      labelStyle: { paddingLeft: '0' },
      style: { marginRight: '20px' },
      labelPosition: 'before',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      value: this.state.value,
      validator: this.validator,
    };
    let msg = this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ width: '660px' }} /> : '';
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px', display: 'inline-block' }}>
          <IPInput
            {...param}
            ref={ipInput => {
              this.ipInput = ipInput;
            }}
          />
          <Button text={'Value'} onClick={this.handleClick} />
          <br />
          <br />
          {msg}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IPInputEventDemo />, mountNode);
```

```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IPInputEventDemo extends React.Component {
  state = {
    msg: '',
    value: '10.8.52.211',
  };

  componentDidMount() {
    this.ipInput.validate();
  }

  handleClick = () => {
    const value = this.ipInput.getValue();
    this.setState({
      msg: 'value is: ' + value,
      value,
    });
  };

  validator = value => {
    // 你的ip校验逻辑.
    // ...

    return { result: false, message: 'check failed.' };
  };

  onChange = value => {
    this.setState({
      msg: 'Trigger the change event，ip: ' + value,
      value: value,
    });
  };
  onBlur = value => {
    this.setState({
      msg: 'Trigger the blur event，ip: ' + value,
      value: value,
    });
  };
  onFocus = value => {
    this.setState({
      msg: 'Trigger the focus event，ip: ' + value,
      value: value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const { id, ...other } = this.props;

    const param = {
      label: 'ipv4 Input box:',
      labelStyle: { paddingLeft: '0' },
      style: { marginRight: '20px' },
      labelPosition: 'before',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      value: this.state.value,
      validator: this.validator,
    };
    let msg = this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ width: '660px' }} /> : '';
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px', display: 'inline-block' }}>
          <IPInput
            {...param}
            ref={ipInput => {
              this.ipInput = ipInput;
            }}
          />
          <Button text={'Value'} onClick={this.handleClick} />
          <br />
          <br />
          {msg}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IPInputEventDemo />, mountNode);
```

### IPV6事件处理

## en-US

```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IPV6InputEventDemo extends React.Component {
  state = {
    msg: '',
    value: '10:80:52:211:0000:0000:0000:0000',
  };

  handleClick = () => {
    const value = this.ipInput.getValue();
    this.setState({
      msg: 'value is: ' + value,
      value,
    });
  };

  onChange = value => {
    this.setState({
      msg: 'Trigger the change event，ip: ' + value,
      value: value,
    });
  };
  onBlur = value => {
    this.setState({
      msg: 'Trigger the blur event，ip: ' + value,
      value: value,
    });
  };
  onFocus = value => {
    this.setState({
      msg: 'Trigger the focus event，ip: ' + value,
      value: value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const param = {
      label: 'ipv6 Input box:',
      type: 'v6',
      labelStyle: { paddingLeft: '0' },
      style: { marginRight: '20px' },
      labelPosition: 'before',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      value: this.state.value,
    };
    let msg = this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ width: '660px' }} /> : '';
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px', display: 'inline-block' }}>
          <IPInput
            {...param}
            ref={ipInput => {
              this.ipInput = ipInput;
            }}
          />
          <Button text={'Value'} onClick={this.handleClick} />
          <br />
          <br />
          {msg}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IPV6InputEventDemo />, mountNode);
```

```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IPV6InputEventDemo extends React.Component {
  state = {
    msg: '',
    value: '10:80:52:211:0000:0000:0000:0000',
  };

  handleClick = () => {
    const value = this.ipInput.getValue();
    this.setState({
      msg: 'value is: ' + value,
      value,
    });
  };

  onChange = value => {
    this.setState({
      msg: 'Trigger the change event，ip: ' + value,
      value: value,
    });
  };
  onBlur = value => {
    this.setState({
      msg: 'Trigger the blur event，ip: ' + value,
      value: value,
    });
  };
  onFocus = value => {
    this.setState({
      msg: 'Trigger the focus event，ip: ' + value,
      value: value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const param = {
      label: 'ipv6 Input box:',
      type: 'v6',
      labelStyle: { paddingLeft: '0' },
      style: { marginRight: '20px' },
      labelPosition: 'before',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      value: this.state.value,
    };
    let msg = this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ width: '660px' }} /> : '';
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px', display: 'inline-block' }}>
          <IPInput
            {...param}
            ref={ipInput => {
              this.ipInput = ipInput;
            }}
          />
          <Button text={'Value'} onClick={this.handleClick} />
          <br />
          <br />
          {msg}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IPV6InputEventDemo />, mountNode);
```

### Mac事件处理

## en-US

```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MacInputEventDemo extends React.Component {
  state = {
    msg: '',
    value: '3D-F2-C9-A6-B3-4F',
  };

  handleClick = () => {
    const value = this.ipInput.getValue();
    this.setState({
      msg: 'value is: ' + value,
      value,
    });
  };

  onChange = value => {
    this.setState({
      msg: 'Trigger the change event，ip: ' + value,
      value: value,
    });
  };
  onBlur = value => {
    this.setState({
      msg: 'Trigger the blur event，ip: ' + value,
      value: value,
    });
  };
  onFocus = value => {
    this.setState({
      msg: 'Trigger the focus event，ip: ' + value,
      value: value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const param = {
      label: 'MAC Input box:',
      type: 'mac',
      labelStyle: { paddingLeft: '0' },
      style: { marginRight: '20px' },
      labelPosition: 'before',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      value: this.state.value,
    };
    let msg = this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ width: '660px' }} /> : '';
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px', display: 'inline-block' }}>
          <IPInput
            {...param}
            ref={ipInput => {
              this.ipInput = ipInput;
            }}
          />
          <Button text={'Value'} onClick={this.handleClick} />
          <br />
          <br />
          {msg}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<MacInputEventDemo />, mountNode);
```

```jsx
import IPInput from 'eview-ui/IPInput';
import LabelField from 'eview-ui/LabelField';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MacInputEventDemo extends React.Component {
  state = {
    msg: '',
    value: '3D-F2-C9-A6-B3-4F',
  };

  handleClick = () => {
    const value = this.ipInput.getValue();
    this.setState({
      msg: 'value is: ' + value,
      value,
    });
  };

  onChange = value => {
    this.setState({
      msg: 'Trigger the change event，ip: ' + value,
      value: value,
    });
  };
  onBlur = value => {
    this.setState({
      msg: 'Trigger the blur event，ip: ' + value,
      value: value,
    });
  };
  onFocus = value => {
    this.setState({
      msg: 'Trigger the focus event，ip: ' + value,
      value: value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const param = {
      label: 'MAC Input box:',
      type: 'mac',
      labelStyle: { paddingLeft: '0' },
      style: { marginRight: '20px' },
      labelPosition: 'before',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      value: this.state.value,
    };
    let msg = this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ width: '660px' }} /> : '';
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: '20px', display: 'inline-block' }}>
          <IPInput
            {...param}
            ref={ipInput => {
              this.ipInput = ipInput;
            }}
          />
          <Button text={'Value'} onClick={this.handleClick} />
          <br />
          <br />
          {msg}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<MacInputEventDemo />, mountNode);
```

