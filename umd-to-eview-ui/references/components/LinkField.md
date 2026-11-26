# LinkField 文字链接

> 分类：通用

通过href跳转指定的链接地址。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法         | eview 写法  | 迁移要点                                                                                                                                                                                                    |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Typography.Link` | `LinkField` | `href`/`target`/`underline`/`title`；**文字用 `children`**（`text` 已废弃）；`disabled`；`onClick(event)` 为 React 合成事件；显隐 `display`（默认 true）；`Typography.Link` 的 `ellipsis`/`copyable` 无对应 |

## API

| 方法名 | 参数 | 返回值 | 描述 |
| ------ | ---- | ------ | ---- |

### 属性

| 属性名称  | 描述                                                                                                                                                                 | 输入      | 默认      |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :-------- |
| id        | 定制组件 id，传入该值可覆盖组件自动生成的 id。例如：`id='eui_linkField_1001'`                                                                                        | string    |           |
| className | 通过添加 class 的方式，自定义组件样式                                                                                                                                | string    |           |
| style     | 通过添加 style 的方式，自定义组件样式                                                                                                                                | object    |           |
| display   | 是否显示，默认 true                                                                                                                                                  | bool      | true      |
| children  | 定制超链接内容，支持文本或 ReactNode                                                                                                                                 | ReactNode |           |
| text      | 定制超链接文本。例如：`text='超链接'`（**此属性已废弃，建议使用 children**）                                                                                         | string    |           |
| target    | 规定在何处打开链接文档：<br>"\_blank"<br>"\_parent"<br>"\_self"<br>"\_top"                                                                                           | enum      | "\_blank" |
| href      | 自定义链接地址，不传则默认为空字符串。例如：`href='https://www.example.com'`。需要业务保障 href 属性的合法性并根据场景进行安全防护                                   | string    | ''        |
| disabled  | 自定义超链接是否可用，true 时不可用（点击被阻止），false 时可用                                                                                                      | bool      | false     |
| title     | 定制超链接标题，不传则标题为空                                                                                                                                       | string    | ''        |
| onClick   | 自定义点击回调。<br>**签名:** `function(event: React.MouseEvent) => void` <br>_event:_ React 合成鼠标事件。disabled 或 href 为空时，点击行为被阻止但仍会触发 onClick | function  |           |
| underline | 设置组件是否显示下划线                                                                                                                                               | bool      | false     |
| version   | 传入该值可定制当前组件匹配的ucd规范，不传则默认aui2规范，例如 `version='aui3'`                                                                                       | string    |           |
| theme     | 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式，例如 `theme='evening'`                                                                                 | string    |           |

## 使用示例

### 基本属性设置



```jsx
import LinkField from "eview-ui/LinkField";

const style = { display: "inline-block", marginRight: "30px" };
const customStyle = {
  display: "inline-block",
  marginRight: "30px",
  color: "red",
  textDecoration: "underline",
  textUnderlineOffset: "0.25rem",
};

// 默认状态
<LinkField style={style} text="文字链接" href="" disabled={false} />
// 禁用状态
<LinkField href="" style={style} text="文字链接" disabled={true} />
// 自定义样式
<LinkField href="" text="文字链接" disabled={false} style={customStyle} />
```

### 事件处理



```jsx
import LinkField from "eview-ui/LinkField";

<LinkField
  href=""
  children="Link text"
  style={{ marginLeft: "20px" }}
  disabled={false}
  onClick={(e) => {
    // e 是 React 合成事件，取 e.target.href 更新
  }}
/>
```
