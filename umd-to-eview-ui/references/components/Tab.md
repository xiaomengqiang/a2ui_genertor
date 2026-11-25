# Tab 页签

> 分类：导航

该标签配合TabItem标签一同使用，将TabItem嵌套在Tab内，具体页签的内容在TabItem内进行书写,同时支持标签的动态添加与删除，可自定义标签是否可关闭，支持标签切换时的回调。

## antd 迁移注意事项

> 导入特例：`import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`（TabItem 具名导出）

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法          | eview 写法        | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tabs` / `TabPane` | `Tab` / `TabItem` | **TabItem children 驱动**（`<Tab><TabItem title>内容</TabItem></Tab>`，**无 data/items prop**）；`activeKey`→**`selectedIndex`（数字下标，不是 key！）**——key→index 需映射；**切换回调是 `onClick(index, title, event)`（不是 onChange）**；`onClose(index, event, title)`；**`draggable` 默认 true**（不需要要显式 false）；TabItem：`title`/`closable`/`disabled`/`icon`（url 字符串）；`tabBarExtraContent` 无对应（手写）；**遍历生成 TabItem 时数据源必须判空兜底**（`(tabs |

## API

### 属性

| 属性名称           | 描述                                                                                                                                                                                                    | 输入                                                                        | 默认   |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- | :----- |
| id                 | 设置Tab的id                                                                                                                                                                                             | string                                                                      |        |
| selectedIndex      | 设置选中的index,此index是传入数据数组下标                                                                                                                                                               | number                                                                      | 0      |
| disabled           | tab全体禁用                                                                                                                                                                                             | boolean                                                                     | false  |
| hover              | 用hover切换tab页                                                                                                                                                                                        | boolean                                                                     | false  |
| className          | 通过自定义class来自定义Tab的整体样式 例如：margin、padding                                                                                                                                              | string                                                                      |        |
| style              | 通过自定义style来自定义Tab的整体样式 例如：margin、padding                                                                                                                                              | object                                                                      |        |
| type               | 设置页签的类型，default代表是基础页签，也是默认类型，sub表示选项卡页签;<br>page是页面级分割页签:<br>1.仅在3.1及以上版本支持<br>2.仅支持配置一种位置：position=top<br>3.不支持配置删除单个页签的功能     | enum:<br>&nbsp;"main"<br>&nbsp;"sub"<br>&nbsp;"page"                        | "main" |
| position           | Set the position/alignment of the tabs，default indicates the top alignment of the tab and it's content                                                                                                 | enum:<br>&nbsp;"top"<br>&nbsp;"bottom"<br>&nbsp;"left"<br>&nbsp;"right"<br> | "top"  |
| lazyLoad           | 设置是否在页签激活时动态加载内容，默认首次渲染时全部加载                                                                                                                                                | boolean                                                                     | false  |
| draggable          | 默认情况下，Tab项是可拖动的。将此属性设置为false以使tab-items不可拖动示例：draggable = {false}                                                                                                          | boolean                                                                     | true   |
| onClick            | 设置Tab页签的切换回调事件<br><br>**签名:**<br>`function(index: number, title: string, event: object) => void`<br>_index:_ 被选中的页签在用户传入数组中的index<br>_title:_ tabName<br>_event:_ event事件 | function                                                                    |        |
| onClose            | 设置Tab是否可以关闭<br><br>**签名:**<br>`function(index: number, event: object, title: string) => void`<br>_index:_ 被选中的页签在用户传入数组中的index<br>_event:_ event事件<br>_title:_ tabName       | function                                                                    |        |
| isAutoClose        | 设置Tab在onClose为true时是否可删除tab                                                                                                                                                                   | boolean                                                                     | true   |
| alwaysShowIcon     | 配合TabItem的icon属性一起使用。当tabItem数量过多时，是否显示收起的tabItem中的图标                                                                                                                       | boolean                                                                     | false  |
| confirmBeforeLeave | 点击切换tab的回调函数,该回调函数返回一个Promise表示是否允许切换                                                                                                                                         | function                                                                    | false  |
| isShowCloseBtns    | 是否展示删除popOver，设为true，右侧会出现一个按钮，点击弹出popOver，可按需删除Tab元素（待废弃API）                                                                                                      | boolean                                                                     | false  |
| showAddButton      | 是否显示添加，注意：1.需要业务保证页签长度展示，不能在超长场景下继续添加；2.仅ICT 3.1以上风格生效；3.position为left或者right时不生效                                                                    | boolean                                                                     | false  |
| onAddClick         | 添加Tab 页签回调方法，和showAddButton对应                                                                                                                                                               | function                                                                    | —      |

## TabItem

TabItem是Tab的子标签和Tab标签一起使用。

| 属性名称     | 描述                                                                        | 输入     | 默认  |
| :----------- | :-------------------------------------------------------------------------- | :------- | :---- |
| title        | tab的标题内容                                                               | string   |       |
| closable     | 页签是否可关闭                                                              | boolean  | false |
| disabled     | 该属性用于设置页签的使能状态。                                              | boolean  | false |
| icon         | 页签项的图标。并在此处设置图标的绝对路径                                  | string   |       |
| setEditing   | 该属性用于启用或禁用页签的编辑。                                            | boolean  | false |
| tabItemStyle | 设置页签标题的样式（比如字体大小、颜色）                                    | object   |       |
| tips         | 提示内容                                                                    | string   |       |
| onClick      | (e: MouseEvent<HTMLSpanElement>,index?: number, title?: string) => unknown; | function |       |
| onClose      | (e: MouseEvent<HTMLSpanElement>,index?: number, title?: string) => unknown; | function |       |

## 使用示例

### 基本属性设置

```jsx
import Tab, { TabItem } from "eview-ui/Tab";

const icon = "create_default"; // 图片 url

{/* 默认 Tab */}
<Tab>
  <TabItem title="Home"><div style={{ padding: "1rem" }}>Home</div></TabItem>
  <TabItem title="Profile"><div style={{ padding: "1rem" }}>Profile</div></TabItem>
  <TabItem title="Messages" disabled={true}><div style={{ padding: "1rem" }}>Messages</div></TabItem>
</Tab>

{/* type="sub"：子页签；isAutoClose + onClose 自动关闭 */}
<Tab type="sub" selectedIndex={1} isAutoClose={true} onClose={(index, e, title) => { /* index, e, title */ }}>
  <TabItem title="Basic Setting" icon={icon}><div style={{ padding: "1rem" }}>Basic Setting</div></TabItem>
  <TabItem title="Bandwidth" closable={true}><div style={{ padding: "1rem" }}>Bandwidth</div></TabItem>
  <TabItem title="Mirror" disabled={true}><div style={{ padding: "1rem" }}>Mirror</div></TabItem>
</Tab>

{/* type="page"：分割式页签 */}
<Tab type="page" selectedIndex={1}>
  <TabItem title="Basic Setting"><div style={{ padding: "1rem" }}>Basic Setting</div></TabItem>
  <TabItem title="Bandwidth"><div style={{ padding: "1rem" }}>Bandwidth</div></TabItem>
</Tab>
```

### 位置处理

```jsx
import Tab, { TabItem } from "eview-ui/Tab";

const icon = "create_default"; // 图片 url

// position: "top" | "bottom" | "left" | "right"
<Tab style={{ width: "450px", height: "300px" }} position={"top"} lazyLoad={true}>
  <TabItem title="Home" closable={true} icon={icon}><p>Home</p></TabItem>
  <TabItem title="Profile" closable={true}><p>Profile</p></TabItem>
  <TabItem title="Messages" closable={true} disabled={true}><p>Messages</p></TabItem>
  <TabItem title="Settings" closable={true}><p>Settings</p></TabItem>
</Tab>
```

### 事件处理

```jsx
import Tab, { TabItem } from "eview-ui/Tab";

// onClick(index, title)；onClose(index, e, title)
<Tab
  selectedIndex={0}
  onClick={(index, title) => { /* 取 index 更新 selectedIndex */ }}
  onClose={(index, e, title) => { /* index, e, title */ }}
  style={{ width: "370px" }}
  lazyLoad
>
  <TabItem title="Home"><p>Home</p></TabItem>
  <TabItem title="Profile" closable={true}><p>Profile</p></TabItem>
  <TabItem title="Messages"></TabItem>
  <TabItem title="Settings"><p>Setting</p></TabItem>
</Tab>
```

### Add/Delete Dynamically

```jsx
import Tab, { TabItem } from "eview-ui/Tab";

const data = [
  { title: "Home", closable: true, children: <p>111</p> },
  { title: "Profile", closable: true, children: <p>222</p> },
  { title: "Messages", closable: true, children: <p>333</p> },
];

// onClose(index)：删除第 index 项；新增项 push 到 data 后重渲染
<Tab onClose={(index) => { /* 从 data 中删除第 index 项 */ }}>
  {data.map((item, index) => (
    <TabItem title={item.title} closable={item.closable} key={index}>
      {item.children}
    </TabItem>
  ))}
</Tab>
```

### Nested Tab

```jsx
import Tab, { TabItem } from "eview-ui/Tab";

<Tab style={{ width: "450px" }}>
  <TabItem title="Home" closable={true}>
    <Tab style={{ margin: "20px 0px 10px 10px", width: "450px" }}>
      <TabItem title="Tab1"><p style={{ padding: "10px 0px 0px 10px" }}>Home1</p></TabItem>
      <TabItem title="Tab2">
        <Tab style={{ margin: "20px 0px 10px 20px", width: "450px" }}>
          <TabItem title="Basic Setting Change"><p style={{ padding: "10px 0px 0px 10px" }}>Child Tab1 content ...</p></TabItem>
          <TabItem title="Bandwidth" closable={true}><p style={{ padding: "10px 0px 0px 10px" }}>Child Tab2 content ...</p></TabItem>
          <TabItem title="Mirror"><p style={{ padding: "10px 0px 0px 10px" }}>Child Tab3 Content ...</p></TabItem>
        </Tab>
      </TabItem>
      <TabItem title="Tab3"><p>Home3</p></TabItem>
    </Tab>
  </TabItem>
  <TabItem title="Profile" closable={true}><p>Profiles</p></TabItem>
  <TabItem title="Messages"><p>Messages</p></TabItem>
  <TabItem title="Settings"><p>Settings</p></TabItem>
</Tab>
```

### Set Tab-Items are Non Draggable

```jsx
import Tab, { TabItem } from "eview-ui/Tab";

// draggable={false}：禁止 TabItem 拖拽排序
<Tab style={{ width: "450px" }} draggable={false}>
  <TabItem title="Home" closable={true}>
    <Tab style={{ margin: "20px 0px 10px 10px", width: "450px" }} draggable={false}>
      <TabItem title="Tab1"><p style={{ padding: "10px 0px 0px 10px" }}>Home1</p></TabItem>
      <TabItem title="Tab2">
        <Tab style={{ margin: "20px 0px 10px 20px", width: "450px" }}>
          <TabItem title="Basic Setting Change"><p style={{ padding: "10px 0px 0px 10px" }}>Child Tab1 content ...</p></TabItem>
          <TabItem title="Bandwidth" closable={true}><p style={{ padding: "10px 0px 0px 10px" }}>Child Tab2 content ...</p></TabItem>
          <TabItem title="Mirror"><p style={{ padding: "10px 0px 0px 10px" }}>Child Tab3 Content ...</p></TabItem>
        </Tab>
      </TabItem>
      <TabItem title="Tab3"><p>Home3</p></TabItem>
    </Tab>
  </TabItem>
  <TabItem title="Profile" closable={true}><p>Profiles</p></TabItem>
  <TabItem title="Messages"><p>Messages</p></TabItem>
  <TabItem title="Settings"><p>Settings</p></TabItem>
</Tab>
```
