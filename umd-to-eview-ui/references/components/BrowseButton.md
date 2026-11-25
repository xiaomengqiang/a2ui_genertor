# BrowseButton 浏览按钮

> 分类：通用

Browse Button组件提供浏览元,用于触发组件选择对话框,更新和浏览路径。

## API

| 方法名   | 描述                                     | 参数 | 返回值             |
| -------- | ---------------------------------------- | ---- | ------------------ |
| validate | 用于手动进行非空检查，并返回是否通过校验 | -    | 校验结果，bool类型 |

### 属性

| 属性           | 说明                                                                                                                                                                                             | 类型                                    | 默认值  |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :------ |
| id             | 元素的id                                                                                                                                                                                         | string                                  |         |
| label          | 自定义按钮的标签                                                                                                                                                                                 | string                                  | `· · ·` |
| readOnly       | 设置文本框只读                                                                                                                                                                                   | bool                                    | `false` |
| className      | 为组件增加className                                                                                                                                                                              | string                                  |         |
| buttonDisabled | 禁用按钮                                                                                                                                                                                         | bool                                    | `false` |
| inputDisabled  | 禁用输入框                                                                                                                                                                                       | bool                                    | `false` |
| value          | 设置需要显示的默认值。                                                                                                                                                                           | string                                  |         |
| placeHolder    | 字符串占位符                                                                                                                                                                                     | string                                  |         |
| inputStyle     | 定制输入框样式                                                                                                                                                                                   | object                                  |         |
| buttonStyle    | 定制按钮样式                                                                                                                                                                                     | object                                  |         |
| required       | 支持设置组件值是否必须，若为必须，支持非空校验                                                                                                                                                   | bool                                    | `false` |
| hintType       | 显示提示信息                                                                                                                                                                                     | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br> | 'div'   |
| onClick        | 定义按钮点击事件<br>`function(event: React.MouseEvent, value: string) => void`<br>_event:_ 原生dom的event<br>_value:_ new value                                                                  | function                                |         |
| onChange       | 定义输入框内容改变时的事件<br>`function(newValue: string, oldValue: string, event: React.ChangeEvent) => void`<br>_newValue:_ new value<br>_oldValue:_ previous value<br>_event:_ 原生dom的event | function                                |         |
| onKeyDown      | 定义输入框在按下键盘键时的事件<br>`function(event: React.KeyboardEvent) => void`<br>_event:_ 原生dom的event                                                                                      | function                                |         |
| onKeyPress     | 定义输入框在按下键盘键时的事件<br>`function(event: React.KeyboardEvent) => void`<br>_event:_ 原生dom的event                                                                                      | function                                |         |
| onKeyUp        | 定义输入框在放开键盘键时的事件<br>`function(event: React.KeyboardEvent) => void`<br>_event:_ 原生dom的event                                                                                      | function                                |         |
| onFocus        | 定义输入框聚焦时的事件<br>`function(event: React.FocusEvent) => void`<br>_event:_ 原生dom的event                                                                                                 | function                                |         |
| onBlur         | 定义输入框的失去焦点时的事件<br>`function(event: React.FocusEvent) => void`<br>_event:_ 原生dom的event                                                                                           | function                                |         |
| useLatestValue | 设置文本框的useLatestValue属性，具体作用参考TextField                                                                                                                                            | bool                                    | false   |
| inputProps     | 设置文本框的属性，具体作用参考TextField                                                                                                                                                          | object                                  |         |
| version        | aui版本                                                                                                                                                                                          | string                                  |         |
| theme          | 主题                                                                                                                                                                                             | string                                  |         |

## 使用示例

### Click事件

Click事件

```jsx
import BrowseButton from "eview-ui/BrowseButton";

<BrowseButton
  onClick={(event, value) => {
    // value 是新值（非 event）
  }}
  placeHolder="Click here to search"
  value={"d:\\"}
/>
```

### Change事件

Change事件

```jsx
import BrowseButton from "eview-ui/BrowseButton";

<BrowseButton
  onChange={(newValue, oldValue, event) => {
    // newValue 新值, oldValue 旧值
  }}
  inputDisabled={false}
  inputStyle={{ width: "200px" }}
/>
```

### 禁用

禁用浏览按钮

```jsx
import BrowseButton from "eview-ui/BrowseButton";

<BrowseButton label={"search"} buttonDisabled={true} />
```

### 失焦事件和用户指定的样式

失焦事件和用户指定的样式

```jsx
import BrowseButton from "eview-ui/BrowseButton";

<BrowseButton
  label={"search"}
  onBlur={(event) => {
    // event.target.value 取值
  }}
  inputStyle={{ width: "400px" }}
  buttonStyle={{ width: "100px" }}
/>
```

### 自定义图标

自定义图标

```jsx
import BrowseButton from "eview-ui/BrowseButton";

const buttonStyle = {
  backgroundImage: "url(home-icon-url)", // 图片 url
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

<BrowseButton value={"defaultValue"} buttonStyle={buttonStyle} label={""} />
```
