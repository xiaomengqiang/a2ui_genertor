# LabelField 标签

> 分类：数据录入

文本标签组件，主要用于表单中。支持自定义样式，通过required属性设置是否必须。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Descriptions` | `LabelField` + `GridLayout` 组合 | 轻量键值：`LabelField text`（+`required` 显星号）；多列用 Row/Col 排布；复杂态见 [handwrite-templates.md](handwrite-templates.md) §3 |

## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  组件默认设置动态id，且组件支持用户自定义id | string |  |
| style |  通过style的方式自定义样式 | object |  |
| className |  通过class的方式自定义样式 | string |  |
| text |  支持通过text设置组件文本内容 | string |  |
| children |  支持设置组件的子标签 | node |  |
| required |  设置是否是必填项，为true时，文字前面加星号 | bool | false |
| onClick |  设置组件的点击事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 原生点击事件 | function |  |

## 使用示例

### 基本属性设置

## en-US



```jsx
import LabelField from 'eview-ui/LabelField';
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LabelFieldExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_lbExample">
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <LabelField text="Default style">
            </LabelField>
          </div>

          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <LabelField text="Mandatory style" required={true}>
            </LabelField>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<LabelFieldExample />, mountNode);

```

```jsx
import LabelField from 'eview-ui/LabelField';
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class LabelFieldExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_lbExample">
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <LabelField text="Default style">
            </LabelField>
          </div>

          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <LabelField text="Mandatory style" required={true}>
            </LabelField>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<LabelFieldExample />, mountNode);

```

