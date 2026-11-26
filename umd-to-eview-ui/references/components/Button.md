# Button 按钮

> 分类：通用

该组件默认分default和primary两种样式，支持添加图标、设置按钮文本，自定义样式，同时该组件底层采用原生的button标签，支持原生button的所有事件。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                         | eview 写法               | 迁移要点                                                                                                                                                                                                                                                                                                                            |
| --------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`（纯文字）                | `Button`                 | 文字用 `text` prop（**`string`\|`ReactNode`，支持富文本**）；**不支持 children**（antd `<Button>文字</Button>` → `<Button text="文字"/>` 或 `<Button text={<span>...</span>}/>）；`type`→`status`（`default`/`primary`/`risk`）；`size` 三档是 `small`/`normal`/`large`（**antd `middle`→`normal`**）；无 `loading`/`htmlType`/`danger`（`danger`→`status="risk"`）；处理中用 `disabled`+文案切换；`onClick(event)` 原生事件（同 antd）                  |
| `Button icon={<Icon/>}`（带图标） | `Button` + `leftIcon`/`rightIcon` | `leftIcon`/`rightIcon` 收 **string**（图标路径 / base64 data URL）——用 `useIcon(name,{size,color?})` 主题响应式预载（见 [Icon.md](./Icon.md)）传入：**彩色 status（`primary`/`risk` 等）传 `color`**（primary→`'#fff'`，固定不翻转）；**`default` 不传 `color`**，跟随主题翻转。`leftIconProps.{leftHoverIcon,leftDisabledIcon}`、`rightIconProps.*` 同理（hover/disabled 色按需各取一份 `useIcon`）。源 `<Icon name>` 不要塞进 leftIcon/rightIcon（ReactNode，不渲染） |

## API

### 属性

| 属性           | 说明                                                                                                                                                                                                                              | 类型                                    | 默认值     |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :--------- |
| id             | 自定义id                                                                                                                                                                                                                          | string                                  | -          |
| className      | 自定义class                                                                                                                                                                                                                       | string                                  | -          |
| style          | 自定义组件样式                                                                                                                                                                                                                    | React.CSSProperties                     | -          |
| title          | 鼠标悬浮在按钮上的展示的提示信息内容，优先级低于冒泡提示信息                                                                                                                                                                      | string                                  | -          |
| status         | 设置Button的使用场景，默认default样式，特殊场景下设置该属性值为primary                                                                                                                                                            | `default`\|`primary`\|`risk`            | `default ` |
| size           | 设置按钮尺寸                                                                                                                                                                                                                      | `small`\|`normal`\|`large`              | `normal`   |
| text           | Button中的文本（支持富文本，可传 ReactNode）                                                                                                                                                                                     | string\|ReactNode                      | ''         |
| disabled       | 设置Button的灰化状态                                                                                                                                                                                                              | bool                                    | `false`    |
| onClick        | 点击按钮时的回调<br>_event:_ 原生dom的点击事件 <br>                                                                                                                                                                               | function: <br>`(event: object) => void` | -          |
| onKeyDown      | 按下键盘键时的回调<br>_event:_ 原生dom的键盘事件 <br>                                                                                                                                                                             | function: <br>`(event: object) => void` | -          |
| focused        | 设置组件是否默认聚焦                                                                                                                                                                                                              | bool                                    | `false`    |
| leftIcon       | 在Button中文本的左边设置图标，传入值为图标的绝对路径或 base64 data URL                                                                                                      | string                                  | -          |
| rightIcon      | 在Button中文本的右边设置图标，传入值为图标的绝对路径或 base64 data URL                                                                                                      | string                                  | -          |
| leftIconProps  | 设置leftIcon的附加属性 <br>**属性：** <br> _leftHoverIcon_: 光标悬停时的leftIcon <br>_leftDisabledIcon_: 禁用时的leftIcon <br>_leftIconClass_: leftIcon的自定义类 <br>_leftIconDisabledClass_: 禁用时leftIcon的自定义类           | object                                  | null       |
| rightIconProps | 设置rightIcon的附加属性 <br>**属性：** <br> _rightHoverIcon_: 光标悬停时的rightIcon <br>_rightDisabledIcon_: 禁用时的rightIcon <br> _rightIconClass_: rightIcon的自定义类 <br>_rightIconDisabledClass_: 禁用时rightIcon的自定义类 | object                                  | null       |
| toolTipProps   | tip配置 _优先级高于其他tip相关配置_ <br> **请使用Tooltip组件添加提示框,结构清晰,组件控制便捷**                                                                                                                                    | object(具体配置见Tooltip组件文档)       | null       |
| tipStyle       | tip样式                                                                                                                                                                                                                           | React.CSSProperties                     | -          |
| tipType        | 提示类型（此属性与原生属性title重叠，后续慢慢废弃）                                                                                                                                                                               | `'title'`\|`'tipbox'`                   | `'tipbox'` |
| tipShow        | 指定鼠标悬浮在按钮上的提示为冒泡提示，设置的值为always或overflow时生效，与tipData配合使用                                                                                                                                         | `always`\|`never`\|`overflow`           | `never`    |
| tipData        | tip值，为空时默认显示text属性值                                                                                                                                                                                                   | string                                  | ''         |
| version        | aui版本                                                                                                                                                                                                                           | string                                  | -          |
| theme          | 主题                                                                                                                                                                                                                              | string                                  | -          |

## 使用示例

### 按钮类型

按钮有三种类型：主按钮`primary`、次按钮`default`、危险按钮`risk`

```jsx
import { Button } from "eview-ui";

<div>
  <Button text="Primary Button" status="primary" style={{ marginRight: "16px" }} />
  <Button text="Default Button" tipShow="overflow" style={{ marginRight: "16px" }} />
  <Button text="Risk Button" status="risk" />
</div>
```

### 不可用状态

添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。

```jsx
import Button from "eview-ui/Button";

<div>
  <Button text="Primary" status="primary" style={{ marginRight: "1rem", marginBottom: "20px" }} />
  <Button text="Disable Primary" status="primary" disabled={true} style={{ marginBottom: "20px" }} />
  <br />
  <Button text="Default" tipShow="overflow" style={{ marginRight: "1rem", marginBottom: "20px" }} />
  <Button text="Disable Default" disabled={true} style={{ marginBottom: "20px" }} />
  <br />
  <Button text="Risk" status="risk" style={{ marginRight: "1rem", marginBottom: "20px" }} />
  <Button text="Disable Risk" status="risk" disabled={true} style={{ marginBottom: "20px" }} />
</div>
```

### 带图标的按钮

`leftIcon` `leftIconProps`可以设置左图标<br/>
`rightIcon` `rightIconProps`可以设置右图标

```jsx
import Button from "eview-ui/Button";

// leftIcon/rightIcon 收 base64 data URL 字符串（用 useIcon(name,{size,color?}) 主题响应式预载）
const plusIcon = "data:image/svg+xml;base64,..."; // 图标 base64 url
const delIcon = "data:image/svg+xml;base64,..."; // 图标 base64 url

<div style={{ display: "flex" }}>
  <Button
    leftIcon={plusIcon}
    leftIconProps={{
      leftHoverIcon: delIcon,
      leftIconClass: "my-icon-class",
    }}
    onClick={() => {
      // 点击回调
    }}
    style={{ padding: 0, border: 0, height: "100%", margin: "0.5rem 1rem 0 0" }}
  />
  <Button
    text="Primary Button"
    tipShow="overflow"
    tipData={"Hello React"}
    status="primary"
    rightIcon={plusIcon}
    style={{ flex: "1", marginRight: "0.5rem" }}
  />
  <Button
    text="Default Button"
    tipShow="overflow"
    leftIcon={plusIcon}
    style={{ flex: "1", marginRight: "0.5rem" }}
  />
  <Button
    text="Risk Button"
    tipShow="overflow"
    tipData={"Hello React"}
    status="risk"
    leftIcon={delIcon}
    style={{ flex: "1", marginRight: "0.5rem" }}
  />
</div>
```

### 按钮尺寸

按钮有大、中（默认）、小三种尺寸。
通过设置 `size` 为 `large` `normal` `small` 分别把按钮设为大、中（默认）、小尺寸。

```jsx
import Button from "eview-ui/Button";

// size: "large" | "normal"（默认）| "small"
const size = "normal";
const btnStyle = { marginRight: "1rem", marginTop: "0.5rem" };

<div>
  <Button text="Primary Button" status="primary" size={size} style={btnStyle} />
  <Button text="Default Button" tipShow="overflow" size={size} style={btnStyle} />
  <Button text="Risk Button" status="risk" size={size} style={btnStyle} />
</div>
```

### 提示功能

`tipData`设置提示信息

```jsx
import Button from "eview-ui/Button";

<Button
  text="带提示的按钮"
  tipData="Hello eViews!"
  tipShow="always"
  style={{ width: "8rem", marginRight: "1rem", marginBottom: "20px" }}
/>
```

### 自动聚焦

`focused`属性可以让页面渲染完成后进行自动聚焦到按钮上

```jsx
import Button from "eview-ui/Button";

<Button text="自动聚焦按钮" focused={true} />
```
