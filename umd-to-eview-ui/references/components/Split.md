# Split 面板分割

> 分类：布局

拆分窗口组件提供"resizable和扩展选项。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法             | eview 写法 | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Splitter` 可拖拽分栏 | `Split`    | antd `<Splitter>` + `<Splitter.Panel>` 子项 → eview `Split` 两个 pane children；antd `layout="horizontal"/"vertical"` → eview `split="vertical"/"horizontal"`（**语义对照存疑，见 [Split.md](components/Split.md)**）；antd Panel `size`/`min`/`max`/`resizable` → eview `defaultSize`/`minSize`/`maxSize`/`allowResize`（默认 true）；antd `collapsible` 无对应；**不是 antd Space 的对应物** |

## API

| Method name  | Description      | Parameter | Return                                                            |
| ------------ | ---------------- | --------- | ----------------------------------------------------------------- |
| getPanelSize | 获取面板尺寸大小 | None      | "pane1":{"height":xx,"width":xx},"pane2":{"height":xx,"width":xx} |
| setPanelSize | 设置面板尺寸大小 | size      | none                                                              |

### 属性

| 属性名称          | 描述                                                          | 输入                                                | 默认       |
| :---------------- | :------------------------------------------------------------ | :-------------------------------------------------- | :--------- |
| id                | 指定拆分窗口的id                                              | string                                              |            |
| allowResize       | 指定窗格的大小是否开启                                        | bool                                                | true       |
| className         | 指定类名提到风格拆分窗口                                      | string                                              |            |
| minSize           | 设置最小可调整大小的窗口大小;支持rem                          | union:<br>&nbsp;string<br>&nbsp;number<br>          | 50         |
| maxSize           | 设置最大大小可调的窗口大小;支持rem                            | union:<br>&nbsp;string<br>&nbsp;number<br>          | 720        |
| minSplitClickSize | 设置单击后窗格的指定最小大小。如果未指定，则它将与minSize相同 | number                                              | minSize    |
| maxSplitClickSize | 设置单击后窗格的指定最大大小。如果未指定，则它将与maxSize相同 | number                                              | maxSize    |
| defaultSize       | 设置窗口的默认大小;支持rem                                    | union:<br>&nbsp;string<br>&nbsp;number<br>          | 100        |
| split             | Specifies the type of拆分                                     | enum:<br>&nbsp;'vertical'<br>&nbsp;'horizontal'<br> | 'vertical' |
| onDragStarted     | 设置处理观察开始拖动事件                                      | function                                            |            |
| onDragFinished    | 设置处理观察完成拖动事件                                      | function                                            |            |
| onChange          | 设置处理观察onchange事件                                      | function                                            |            |
| style             | 指定拆分窗格的风格                                            | object                                              |            |
| pane1Style        | 指定样式的第一子画面                                          | object                                              |            |
| pane2Style        | 指定第二窗格的风格                                            | object                                              |            |
| isOverflowY       | overflow-Y是否开启                                            | bool                                                | true       |
| splitResizerWidth | 设置resizer区域宽度                                           | union:<br>&nbsp;string<br>&nbsp;number<br>          |            |

## 使用示例

### 基本属性设置

```jsx
import Split from "eview-ui/Split";
import Accordion from "eview-ui/Accordion";

const data = [
  { title: "All", value: "over_view", icon: "navForm" }, // 项图标 url
  { title: "Star", value: "hero-since-child" },
  {
    title: "Off The Wall",
    value: "off-the-wall",
    children: [
      { title: "Don't Stop Till You Get Enough" },
      { title: "Rock with You" },
      { title: "Off The Wall" },
    ],
  },
  {
    title: "Zodiac",
    description: "说明文字",
    value: "thriller",
    children: [
      { title: "Twilight", description: "说明文字" },
      { title: "Knowing", description: "说明文字" },
    ],
  },
];

<div>
  <div>vertical split</div>
  <Split
    split="vertical"
    minSize={0}
    minSplitClickSize={100}
    maxSplitClickSize={400}
    maxSize={500}
    defaultSize={300}
    onDragStarted={() => {}}
    onDragFinished={() => {}}
    onChange={() => {}}
    pane1Style={{ height: "500px" }}
    pane2Style={{ background: "#FFF0F5" }}
  >
    <div>
      <Accordion data={data} header="MJ" />
    </div>
    <div>主体内容</div>
  </Split>

  <div>horizontal split</div>
  <Split
    split="horizontal"
    minSize={200}
    defaultSize={300}
    pane1Style={{ background: "#d1d3d6" }}
  />
</div>
```

```jsx
import Split from "eview-ui/Split";
import Accordion from "eview-ui/Accordion";

const data = [
  { title: "All", value: "over_view", icon: "navForm" }, // 项图标 url
  { title: "Star", value: "hero-since-child" },
  {
    title: "Off The Wall",
    value: "off-the-wall",
    children: [
      { title: "Don't Stop Till You Get Enough" },
      { title: "Rock with You" },
      { title: "Off The Wall" },
    ],
  },
];

<div>
  <div>vertical split</div>
  <Split
    split="vertical"
    minSize={0}
    minSplitClickSize={100}
    maxSplitClickSize={400}
    maxSize={500}
    defaultSize={300}
    onDragStarted={() => {}}
    onDragFinished={() => {}}
    onChange={() => {}}
    pane1Style={{ height: "500px" }}
    pane2Style={{ background: "#FFF0F5" }}
  >
    <div>
      <Accordion data={data} header="MJ" />
    </div>
    <div></div>
  </Split>

  <div>horizontal split</div>
  <Split
    split="horizontal"
    minSize={200}
    defaultSize={300}
    pane1Style={{ background: "#d1d3d6" }}
  />
</div>
```

### With Tree & Table

```jsx
import Split from "eview-ui/Split";
import Table from "eview-ui/Table";
import PopUpMenu from "eview-ui/PopUpMenu";

const columns = [
  { title: "VPN Name", dataType: Table.ColumnRenderType.TEXT_FIELD, key: "VPN_ID" },
  { title: "Site", dataType: Table.ColumnRenderType.TEXT_FIELD, key: "Site_ID" },
  { title: "Alarm", dataType: Table.ColumnRenderType.TEXT_FIELD, key: "Alarm_ID" },
];

// 数字数组：表格行数据
const rows = [
  ["R&D VPN2", "3", "ICMP Echo"],
  ["Shop Storage", "3", "ICMP Echo"],
  ["IT Link", "7", "ICMP Echo"],
];

const popUpMenuOptions = [
  {
    text: "Item1",
    serialno: 1,
    submenus: [
      {
        text: "Item11",
        serialno: 11,
        submenus: [
          { text: "Item111", serialno: 111, disable: true, submenus: [] },
          { text: "Item121", serialno: 121, submenus: [] },
        ],
      },
    ],
  },
  { text: "Item2", serialno: 2, submenus: [] },
];

// Split 嵌套：外层 vertical，内层 horizontal 再嵌套 horizontal
<div>
  <div>Split UseCase</div>
  <Split
    split="vertical"
    minSize={0}
    defaultSize={300}
    maxSize={1200}
    onDragStarted={() => {}}
    onDragFinished={() => {}}
    onChange={() => {}}
    pane2Style={{ background: "#FFF0F5" }}
  >
    <div></div>
    <div>
      <Split
        split="horizontal"
        minSize={0}
        defaultSize={300}
        pane1Style={{ background: "#d1d3d6" }}
      >
        <div>
          <Table columns={columns} dataset={rows} />
        </div>
        <div>
          <Split
            split="horizontal"
            minSize={0}
            defaultSize={300}
            pane1Style={{ background: "#87CEFA" }}
          >
            <div>
              <Table columns={columns} dataset={rows} />
              <PopUpMenu
                options={popUpMenuOptions}
                isOpen={false}
                X={100}
                Y={100}
                offset={{ X: 100, Y: 100 }}
                onClick={(evt) => {}}
              />
            </div>
            <div></div>
          </Split>
        </div>
      </Split>
    </div>
  </Split>
</div>
```

### Horizontal Split

```jsx
import Split from "eview-ui/Split";
import Table from "eview-ui/Table";

const columns = [
  { title: "VPN Name", dataType: Table.ColumnRenderType.TEXT_FIELD, key: "VPN_ID" },
  { title: "Site", dataType: Table.ColumnRenderType.TEXT_FIELD, key: "Site_ID" },
  { title: "Alarm", dataType: Table.ColumnRenderType.TEXT_FIELD, key: "Alarm_ID" },
];

// 数字数组：表格行数据
const rows = [
  ["R&D VPN2", "3", "ICMP Echo"],
  ["Shop Storage", "3", "ICMP Echo"],
  ["IT Link", "7", "ICMP Echo"],
];

<div>
  <div>Split UseCase</div>
  <div style={{ height: "523px" }}>
    <Split
      split="horizontal"
      minSize={200}
      defaultSize={500}
      maxSize={500}
      pane1Style={{ background: "#d1d3d6" }}
    >
      <div>
        <Table columns={columns} dataset={rows} />
      </div>
      <div>
        <Table columns={columns} dataset={rows} />
      </div>
    </Split>
  </div>
</div>
```
