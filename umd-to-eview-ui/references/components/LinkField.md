# LinkField 文字链接

> 分类：通用

通过href跳转指定的链接地址。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Typography.Link` | `LinkField` | `href`/`target`/`underline`/`title`；**文字用 `children`**（`text` 即将废弃）；`disabled`；`onClick(event)` 原生事件；显隐 `display`（默认 true）；`Typography.Link` 的 `ellipsis`/`copyable` 无对应 |

## API

|方法名|参数|返回值|描述|
|---|---|---|---|---|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-------|
| id | 定制组件 id，传入该值可覆盖组件自动生成的 id。例如：`id='eui_linkField_1001'` | string | |
| className | 通过添加 class 的方式，自定义组件样式 | string | |
| style | 通过添加 style 的方式，自定义组件样式 | object | |
| display | 是否显示，默认 true | bool | true |
| children | 新属性，定制超链接文本 `children='超链接'` | string | |
| text | 定制超链接文本。例如：`text='超链接'`（此属性即将废弃，建议使用 children） | string | |
| target | 规定在何处打开链接文档：<br>"_blank"<br>"_parent"<br>"_self"<br>"_top" | enum | "_blank" |
| href | 必配属性，自定义链接地址,没有则配置空值。例如：`href='https://www.example.com'`。需要业务保障 href 属性的合法性并根据场景进行安全防护 | string | |
| disabled | 自定义超链接是否可用，true 时不可用，false 时可用 | bool | false |
| title | 定制超链接标题，不传则标题为空 | string | |
| onClick | 自定义点击回调。<br>**签名:** `function(event: object) => void` <br>*event:* 原生dom的点击事件  | function | |
| underline | 设置组件默认是否显示下划线 | bool | false |

## 使用示例

### 基本属性设置

## en-US



```jsx
import LinkField from 'eview-ui/LinkField'
import LabelField from 'eview-ui/LabelField'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LinkFieldExample1 extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();

    let style = {display: "inline-block", marginRight: "30px"};
    let customStyle = {display: "inline-block", marginRight: "30px", color: "red", textDecoration: "underline", textUnderlineOffset: "0.25rem"};

    const labelStyle = {
      display: 'block',
      marginBottom: '10px',
      paddingLeft: '0px',
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>默认状态</LabelField>
            <LinkField style={style} text={"文字链接"} href={''} disabled={false}/>
          </div>

          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>禁用状态</LabelField>
            <LinkField href={''} style={style} text={"文字链接"} disabled={true}/>
          </div>

          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>自定义样式</LabelField>
            <LinkField href={''} text={"文字链接"} disabled={false} style={customStyle}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LinkFieldExample1 />, mountNode);

```

```jsx
import LinkField from 'eview-ui/LinkField'
import LabelField from 'eview-ui/LabelField'
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LinkFieldExample1 extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();

    let style = {display: "inline-block", marginRight: "30px"};
    let customStyle = {display: "inline-block", marginRight: "30px", color: "red", textDecoration: "underline", textUnderlineOffset: "0.25rem"};

    const labelStyle = {
      display: 'block',
      marginBottom: '10px',
      paddingLeft: '0px',
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>默认状态</LabelField>
            <LinkField style={style} text={"文字链接"} href={''} disabled={false}/>
          </div>

          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>禁用状态</LabelField>
            <LinkField href={''} style={style} text={"文字链接"} disabled={true}/>
          </div>

          <div style={{display: "inline-block"}}>
            <LabelField style={labelStyle}>自定义样式</LabelField>
            <LinkField href={''} text={"文字链接"} disabled={false} style={customStyle}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LinkFieldExample1 />, mountNode);

```

### 事件处理

## en-US



```jsx
import LinkField from 'eview-ui/LinkField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LinkFieldExample1 extends React.Component {

  state = {
    msg: ''
  };

  onClick = (href) => {
    this.setState({ msg: "OnClick event callback : " + href });
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LinkField href={''} children={"Link text"} style={{marginLeft: "20px"}} disabled={false}
                     onClick={this.onClick}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginLeft: "20px", marginTop: "10px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LinkFieldExample1 />, mountNode);

```

```jsx
import LinkField from 'eview-ui/LinkField';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LinkFieldExample1 extends React.Component {

  state = {
    msg: ''
  };

  onClick = (href) => {
    this.setState({ msg: "OnClick event callback : " + href });
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LinkField href={''} children={"Link text"} style={{marginLeft: "20px"}} disabled={false}
                     onClick={this.onClick}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginLeft: "20px", marginTop: "10px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<LinkFieldExample1 />, mountNode);

```

