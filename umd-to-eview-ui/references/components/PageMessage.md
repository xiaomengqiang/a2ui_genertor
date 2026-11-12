# PageMessage 公告提示

> 分类：反馈

PageMessage组件主要用于页面内信息提示，支持自定义样式，自定义文本内容,自定义图标，支持[info,warn,default]三种类型。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `notification` | `PageMessage` | 页面公告条（**无 display/onClose/closable**，由父级条件渲染控制）；`type` 分版本枚举（3.1: info/warn/success/error/risk/highRisk）；`text`；`icon` 16×16（DivMessage 是 24×24） |

## API


### 属性

| 属性名称 | 描述                                                                                                                            | 输入                                                                                                        | 默认                                         |
|:-----|:------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------|:-------------------------------------------|
| id | 默认动态设置id，支持用户自定义id                                                                                                            | string                                                                                                    |                                            |
| className | 支持通过className自定义样式                                                                                                            | string                                                                                                    |                                            |
| style | 支持通过style自定义组件样式                                                                                                              | React.CSSProperties                                                                                       |                                            |
| iconClassName | 支持通过iconClassName自定义图标样式                                                                                                      | string                                                                                                    |                                            |
| text | 支持通过text自定义文字提示内容                                                                                                             | any                                                                                                       |                                            |
| icon | 支持通过icon设置组件图标，icon为url,组件图标默认符合AUI2.0规范，图片大小为16*16                                                                           | string                                                                                                    |                                            |
| type | AUI2 \| AUI3.0: 组件支持三种类型（type）:`info` `warn` `default`  <br> 在AUI3.1版本中, 支持 `info` `warn` `success` `error` `risk` `highRisk` | AUI2 \| AUI3.0: `info` `warn` `default`  <br> AUI3.1规范: `info` `warn` `success` `error` `risk` `highRisk` | `default` |

## 使用示例

### 基本属性设置

## en-US



```jsx
import PageMessage from 'eview-ui/PageMessage';
import imgPicture from '@images/filter';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PageMessageExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();

    let divStyle = { marginBottom: "20px" };

    return (// 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ margin: "20px" }}>
          <div style={divStyle}>
            <PageMessage text="Prompt text" type="info" style={{ width: "40%" }} />
          </div>
          <div style={divStyle}>
            <PageMessage text="Warning text" type="warn" style={{ width: "40%" }} />
          </div>
          {version === 'aui3-1' && (
            <>
              <div style={divStyle}>
                <PageMessage text="Success text" type="success" style={{ width: "40%" }} />
              </div>
              <div style={divStyle}>
                <PageMessage text="Error text" type="error" style={{ width: "40%" }} />
              </div>
              <div style={divStyle}>
                <PageMessage text="Risk text" type="risk" style={{ width: "40%" }} />
              </div>
              <div style={divStyle}>
                <PageMessage text="High Risk text" type="highRisk" style={{ width: "40%" }} />
              </div>
            </>
          )}
          <div style={divStyle}>
            <PageMessage text="Description Introduction to text" type="default" style={{ width: "40%" }} />
          </div>
          <div style={divStyle}>
            <PageMessage text="Custom icon" type="warn" icon={imgPicture} style={{ width: "40%" }} />
          </div>
        </div>
      </ConfigProvider>);
  }
}

ReactDOM.render(<PageMessageExample />, mountNode);

```

```jsx
import PageMessage from 'eview-ui/PageMessage';
import imgPicture from '@images/filter';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PageMessageExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();

    let divStyle = { marginBottom: "20px" };

    return (// 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ margin: "20px" }}>
          <div style={divStyle}>
            <PageMessage text="Prompt text" type="info" style={{ width: "40%" }} />
          </div>
          <div style={divStyle}>
            <PageMessage text="Warning text" type="warn" style={{ width: "40%" }} />
          </div>
          {version === 'aui3-1' && (
            <>
              <div style={divStyle}>
                <PageMessage text="Success text" type="success" style={{ width: "40%" }} />
              </div>
              <div style={divStyle}>
                <PageMessage text="Error text" type="error" style={{ width: "40%" }} />
              </div>
              <div style={divStyle}>
                <PageMessage text="Risk text" type="risk" style={{ width: "40%" }} />
              </div>
              <div style={divStyle}>
                <PageMessage text="High Risk text" type="highRisk" style={{ width: "40%" }} />
              </div>
            </>
          )}
          <div style={divStyle}>
            <PageMessage text="Description Introduction to text" type="default" style={{ width: "40%" }} />
          </div>
          <div style={divStyle}>
            <PageMessage text="Custom icon" type="warn" icon={imgPicture} style={{ width: "40%" }} />
          </div>
        </div>
      </ConfigProvider>);
  }
}

ReactDOM.render(<PageMessageExample />, mountNode);

```

