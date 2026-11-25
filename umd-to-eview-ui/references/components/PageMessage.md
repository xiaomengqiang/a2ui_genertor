# PageMessage 公告提示

> 分类：反馈

PageMessage组件主要用于页面内信息提示，支持自定义样式，自定义文本内容，自定义图标。AUI2/AUI3.0支持 `info`、`warn`、`default` 三种类型；AUI3.1支持 `info`、`warn`、`success`、`error`、`risk`、`highRisk` 六种类型。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法      | eview 写法    | 迁移要点                                                                                                                                                                        |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `notification` | `PageMessage` | 页面公告条（**无 display/onClose/closable**，由父级条件渲染控制）；`type` 分版本枚举（3.1: info/warn/success/error/risk/highRisk）；`text`；`icon` 16×16（DivMessage 是 24×24） |

## API

### 方法

无

### 属性

| 属性名称      | 描述                                                                                                                                                                                       | 输入                                                                                                | 默认                 |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------- |
| id            | 默认动态生成id（eui_page_msg_NNNN），支持用户自定义id                                                                                                                                      | string                                                                                              | 自动生成             |
| className     | 支持通过className自定义样式                                                                                                                                                                | string                                                                                              |                      |
| style         | 支持通过style自定义组件样式                                                                                                                                                                | React.CSSProperties                                                                                 |                      |
| iconClassName | 支持通过iconClassName自定义图标样式                                                                                                                                                        | string                                                                                              |                      |
| text          | 支持通过text自定义文字提示内容，可传入字符串或ReactNode                                                                                                                                    | string \| ReactNode                                                                                 |                      |
| icon          | 支持通过icon设置组件图标，icon为url字符串，组件图标默认符合AUI2.0规范，图片大小为16×16                                                                                                     | string                                                                                              |                      |
| type          | AUI2/AUI3.0: 组件支持三种类型:`info` `warn` `default` <br> AUI3.1: 支持 `info` `warn` `success` `error` `risk` `highRisk` <br> **注意**：AUI3.1下传入 `default` 走兼容模式，样式与AUI2一致 | AUI2/AUI3.0: `info` `warn` `default` <br> AUI3.1: `info` `warn` `success` `error` `risk` `highRisk` | `default`            |
| version       | AUI版本号，通常由ConfigProvider自动提供，一般不需要手动设置                                                                                                                                | string                                                                                              | 由ConfigProvider提供 |
| theme         | AUI主题名，通常由ConfigProvider自动提供，一般不需要手动设置                                                                                                                                | string                                                                                              | 由ConfigProvider提供 |

## 接口定义

```typescript
import { Component, CSSProperties, ReactNode } from "react";

interface IPageMessageProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  iconClassName?: string;
  text?: string | ReactNode;
  icon?: string;
  type?:
    | "info"
    | "warn"
    | "default"
    | "success"
    | "error"
    | "risk"
    | "highRisk";
  version?: string;
  theme?: string;
}

export default class PageMessage extends Component<IPageMessageProps> {
  static defaultProps: {
    type: "default";
  };
}
```

## 使用示例

### 基本属性设置

```jsx
import PageMessage from "eview-ui/PageMessage";

<PageMessage text="Prompt text" type="info" />
<PageMessage text="Warning text" type="warn" />
{/* AUI3.1 支持的类型 */}
<PageMessage text="Success text" type="success" />
<PageMessage text="Error text" type="error" />
<PageMessage text="Risk text" type="risk" />
<PageMessage text="High Risk text" type="highRisk" />
<PageMessage text="Description Introduction to text" type="default" />
<PageMessage text="Custom icon" type="warn" icon="filter.png" /* 图片 url */ />
```
