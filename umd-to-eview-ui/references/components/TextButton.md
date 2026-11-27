# TextButton 文本按钮

> 分类：通用

该组件支持自定义样式和文本。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法            | eview 写法   | 迁移要点                                     |
| -------------------- | ------------ | -------------------------------------------- |
| `Button type="text"` | `TextButton` | `text` prop（**`string`\|`ReactNode`，支持富文本**）；**不支持 children**（同 Button）；`onClick(event)`；或手写 `<a>` |

## API

### 属性

| 属性名称  | 描述                                         | 输入                                  | 默认  |
| --------- | -------------------------------------------- | ------------------------------------- | ----- |
| id        | 自定义id                                     | string                                | -     |
| className | 自定义class                                  | string                                | -     |
| style     | 自定义组件样式                               | React.CSSProperties                   | -     |
| text      | 显示文字（支持富文本，可传 ReactNode）       | string\|ReactNode                    | ''    |
| disabled  | 组件的灰化状态                               | boolean                                  | false |
| onClick   | 组件的点击事件<br>_event: 原生dom的点击事件_ | function:<br> (event: object) => void | -     |

## 使用示例

### 基本属性设置

```jsx
import TextButton from "eview-ui/TextButton";

<TextButton id="btnUpdate" text="Modify" />
<TextButton text="Set" disabled />
```

### 事件回调

```jsx
import TextButton from "eview-ui/TextButton";

<TextButton
  text="Event Display"
  onClick={() => {
    // event: 原生 dom 点击事件
  }}
/>
```
