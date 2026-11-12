# IPAddress IP输入框

> 分类：数据录入

IPAddress组件实现ipv4和ipv6, mac格式的输入。

## API

|方法名       |参数        |返回值        |     描述                                                                       |
|-------------|------------|--------------|--------------------------------------------------------------------------------|
|getValue     |            |ip输入框的文本|获取IP输入框的值,ipv4时返回“xxx.xxx.xxx.xxx”,ipv6时返回“xxx:xxx:xxx:xxx:xxx:xxx:xxx:xxx”|
| validator | value | { result: boolean; message: string } |  自定义校验函数，要求返回值格式为：{ result: boolean; message: string }，见示例“IPV4事件处理”. |

### 属性

| 属性名称 | 输入 | 默认 | 描述 |
|:-----|:-----|:-----|:-----|
| className | string |  |  定制组件class，传入该值可在组件默认样式上追加class，从而自定义组件样式 例如： className='ipInputClassName' |
| type | enum:<br>&nbsp;"v4"<br>&nbsp;"v6"<br>&nbsp;"mac" | "v4" |  设置输入框类型，默认为v4 |
| disabled | bool | false |  设置组件初始状态是否禁用，默认为否 |
| readOnly | bool | false |  该属性直接赋给input，作为原生属性使用，仅隐藏了光标，并不能真正防止用户输入，建议使用disabled属性。<br>Set the component is read only. |
| required | bool | false |  支持设置组件值是否必须，若为必须，则input前的label文字前加*，同时支持非空校验 |
| value | string |  |  设置输入框组件默认值 |
| delimiter | string |  |  分隔符，ipv4分隔符默认为".",ipv6分隔符默认为":" |
| labelPosition | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |  设置文本内容与组件子节点的位置,  before：表示文本内容在组件子节点的左边,  after：表示文本内容在组件子节点的右边 |
| label | string |  |  ip框名称 |
| labelStyle | object |  |  通过style设置label的样式 |
| labelClassName | string |  |  通过class设置label的样式 |
| style | object |  |  设置外层样式 |
| inputStyle | object |  |  设置input样式 |
| onBlur | function |  |  设置输入框失焦时的回调方法，输入框的值将会传入回调方法<br><br>**签名:**<br>`function(value: string, event: object) => void`<br>*value:* 当前组件中的ip值<br>*event:* 触发失焦的事件对象 |
| onFocus | function |  |  设置输入框聚焦时的回调方法，输入框的值将会传入回调方法<br><br>**签名:**<br>`function(value: string) => void`<br>*value:* 当前组件中的ip值<br>*event:* 触发聚焦的事件对象 |
| onChange | function |  |  设置输入框改变时的回调方法，输入框的值将会传入回调方法<br><br>**签名:**<br>`function(value: string) => void`<br>*value:* 当前组件中的ip值 |
| hintType | 'div' &#124; 'tip' |   | 设置提示的类型 |
| tipProps | object |   | 参考Tooltip组件文档来设置 |

## 使用示例

### 基本使用

`type`设置`v4`或`v6`切换格式
<br />
请按demo设置`value`和`onChange`，从`value`获取值

```jsx
import IPAddress from 'eview-ui/IPAddress';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default function IPAddressDemo() {
  //初始值
  const initialIpv4 = '192.128.1.1';
  const initialIpv6 = 'FF:FF:FF:FF:FF:FF:FF:FF';
  const initialMac = 'FF-FF-FF-FF-FF-FF';

  const [ipv4, setIpv4] = React.useState(initialIpv4);
  const [ipv6, setIpv6] = React.useState(initialIpv6);
  const [mac, setMac] = React.useState(initialMac);
  const [version, theme] = getDemoVersion();
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div>
        <IPAddress type="v4" value={ipv4} onChange={(value) => {setIpv4(value)}}/>
        <div style={{margin: '1rem'}}/>
        <IPAddress type="v6" value={ipv6} onChange={(value) => {setIpv6(value)}}/>
        <div style={{margin: '1rem'}}/>
        <IPAddress type="mac" value={mac} onChange={(value) => {setMac(value)}}/>
      </div>
    </ConfigProvider>
  );
}

ReactDOM.render(<IPAddressDemo />, mountNode);
```

### 校验

`required`设置必填校验，`validator`设置自定义校验函数，函数返回对象必须包括`result`和`message`
`hintType` 设置校验提示类型，`div`或者`tip`

```jsx
import IPAddress from 'eview-ui/IPAddress';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default function IPAddressDemo() {
  const [version, theme] = getDemoVersion();
  const initialVal = ' . . .  ';
  const [val1, setVal1] = React.useState(initialVal);
  const [val2, setVal2] = React.useState(initialVal);
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div>
        <IPAddress
          hintType="tip"
          type="v4"
          value={val1}
          onChange={value => {
            setVal1(value);
          }}
          validator={value => ({
            result: value === '1.1.1.1',
            message: 'It should be 1.1.1.1',
          })}
        />
        <div style={{ margin: '1rem' }} />
        <IPAddress
          required
          hintType="div"
          type="v4"
          value={val2}
          onChange={value => {
            setVal2(value);
          }}
        />
      </div>
    </ConfigProvider>
  );
}

ReactDOM.render(<IPAddressDemo />, mountNode);
```

### 禁用

设置`disabled`禁用

```jsx
import IPAddress from 'eview-ui/IPAddress';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default function IPAddressDemo() {
  const [version, theme] = getDemoVersion();
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div>
        <IPAddress disabled type="v4" />
        <div style={{ margin: '1rem' }} />
        <IPAddress disabled type="v6" />
        <div style={{ margin: '1rem' }} />
        <IPAddress disabled type="mac" />
      </div>
    </ConfigProvider>
  );
}

ReactDOM.render(<IPAddressDemo />, mountNode);
```

