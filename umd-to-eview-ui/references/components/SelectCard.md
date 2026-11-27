# SelectCard 单选块

> 分类：数据录入

该组件用来设置单选块，组件默认支持尺寸不同的两种类型的单选块，同时支持自定义样式。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                    | eview 写法   | 迁移要点                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Radio.Button` / `Segmented` | `SelectCard` | `data=[{value, text}]`；`onChange(value, event)`（首参即选中值）；`defaultValue`→初始 `value` state（**`value=null` 时取消所有选择**）；`size`→`type`（`default`/`small`，值域不同）；禁用是 **`disable`**（不是 disabled，拼写异常表）；仅适合 ≤7 项的单行展示（文档警告）；`block` 无对应（宽度走 style）；选项带 `icon` → 并入 `text`（`data` 无 `icon` 字段，`text` 可传 ReactNode，用 `<SvgIcon>` 包 inline-flex `<div>`，见 §选项级图标） |

## API

| 方法名   | 描述                          | 参数 | 返回值           |
| -------- | ----------------------------- | ---- | ---------------- |
| getValue | 用来获取单选块选中项的value值 | 无   | 单选块选中项的值 |

### 属性

| 属性名称       | 描述                                                                                                                                                                                                                                                                                          | 输入                                          | 默认      |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :-------- |
| id             | 设置组件的id                                                                                                                                                                                                                                                                                  | string                                        |           |
| className      | 通过添加class的方式设置组件样式，作用于组件最外层div，可设置组件margin padding                                                                                                                                                                                                                | string                                        |           |
| style          | 通过styke的方式设置组件样式，作用于组件最外层div，可设置组件margin padding                                                                                                                                                                                                                    | object                                        |           |
| itemClassName  | 通过添加class的方式设置组件单选块样式                                                                                                                                                                                                                                                         | string                                        |           |
| itemStyle      | 通过添加style的方式设置组件单选块样式                                                                                                                                                                                                                                                         | object                                        |           |
| labelClassName | 通过添加class的方式自定义label的名称的样式                                                                                                                                                                                                                                                    | string                                        |           |
| labelStyle     | 通过添加style的方式自定义label的名称的样式                                                                                                                                                                                                                                                    | object                                        |           |
| type           | 设置组件的类型，默认为大尺寸单选块                                                                                                                                                                                                                                                            | enum:<br>&nbsp;"default"<br>&nbsp;"small"<br> | "default" |
| data           | 设置组件的数据，例如：[{value:1,text:"100MB"},{value:2,text:"200MB"},{value:3,text:"500MB"},{value:3,text:"800MB"}]。其中 text 可传 string 或 ReactNode（选项带图标时把图标并入 text，见 §选项级图标）。| array                                         |           |
| value          | 通过value设置组件的选中项                                                                                                                                                                                                                                                                     | any                                           |           |
| label          | 设置下拉框的名称文字                                                                                                                                                                                                                                                                          | string                                        |           |
| labelPosition  | 设置组件名称文字的位置 before代表名称文字在组件的前面，after代表名称文字在组件的后面                                                                                                                                                                                                          | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br>  | "before"  |
| required       | 设置组件是否需要                                                                                                                                                                                                                                                                              | boolean                                          |           |
| onChange       | 设置组件的onChange事件<br><br>**签名:**<br>`function(value: any, event: object) => void`<br>_value:_ 当前选中的选项值<br>_event:_ 原生dom的点击事件                                                                                                                                           | function                                      |           |

## 使用示例

### 基本属性设置

```jsx
import SelectCard from "eview-ui/SelectCard";

// type: "default"（默认大尺寸）/ "small"
<SelectCard label="Default" data={[
  { value: 1, text: "100MB" },
  { value: 2, text: "200MB" },
  { value: 3, text: "500MB" },
]} value={2} required />

<SelectCard label="Small" data={[
  { value: 1, text: "Day" },
  { value: 2, text: "Month" },
  { value: 3, text: "Year" },
]} value={1} type="small" />
```

### 事件处理

```jsx
import SelectCard from "eview-ui/SelectCard";

const data = [
  { value: 1, text: "100MB" },
  { value: 2, text: "200MB" },
  { value: 3, text: "500MB" },
  { value: 4, text: "800MB" },
  { value: 5, text: "1GB" },
];

// onChange 首参 value 即选中值（非 event）；取 value 更新受控 value
<SelectCard
  data={data}
  value={undefined}
  onChange={(value) => {
    // value 是当前选中的选项值
  }}
/>
```

### 改变数据

```jsx
import SelectCard from "eview-ui/SelectCard";

// 动态改变 data；getValue() 通过 ref 获取选中值
<SelectCard
  data={[
    { value: 1, text: "100MB" },
    { value: 2, text: "200MB" },
  ]}
  onChange={(value) => {
    // 取 value 更新受控值
  }}
  ref={(selectCard) => {
    // selectCard.getValue() 返回选中项的 value
  }}
/>
```



### 选项级图标（data 项 icon 并入 text）

SelectCard 的 `data` 形状是 `{ value, text }`——**没有 `icon` 字段**。源 antd `Segmented` / `Radio.Button` 选项里的 `icon` **不能原样保留为独立 `icon` key**，否则会被 SelectCard 静默丢弃、图标不渲染。`text` 既可以是字符串又可以是 ReactNode，所以把图标**并入 `text`**，包一个 inline-flex 的 `<div>`（图标在前、文字在后）。

**recipe**：

1. 先按 [Icon.md](Icon.md) 把选项里的 `icon` 名解析为 `<SvgIcon src={name} size={14} />`。
2. 把该 `<SvgIcon>` 与原 `text` 文字拼进一个 `<div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>` 作为新的 `text`——图标在前、空格、文字在后。
3. **删除独立的 `icon` 字段**。

```jsx
import SelectCard from "eview-ui/SelectCard";
import { SvgIcon } from "@/shared/SvgIcon";

// 前（源 antd Segmented / Radio.Button 选项带 icon）
const viewOpts = [
  { text: "列表", value: "list", icon: "lists" },
  { text: "卡片", value: "card", icon: "app" },
];

// 后（迁移为 SelectCard：icon 并入 text，删独立 icon 字段）
const viewOpts = [
  { text: (<div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><SvgIcon src="lists" size={14} /> 列表</div>), value: "list" },
  { text: (<div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><SvgIcon src="app" size={14} /> 卡片</div>), value: "card" },
];

const [view, setView] = useState("list");   // defaultValue → 初始 value
<SelectCard data={viewOpts} value={view} onChange={(v) => setView(v)} />
```

> **反面示例**：`{ text: "列表", value: "list", icon: <SvgIcon src="lists" size={14} /> }`——独立 `icon` 字段会被 SelectCard 静默丢弃、图标不渲染。必须并入 `text`（且 `icon` 名是字符串时先转 `<SvgIcon>` 元素再并入，不要留 `icon: "lists"` 字符串）。
