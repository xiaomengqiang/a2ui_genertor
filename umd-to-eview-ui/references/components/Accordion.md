# Accordion 侧边导航

> 分类：导航

手风琴控件提供展示页面和功能的导航菜单。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                      | eview 写法                | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Menu`（侧边导航，items 数组） | `Accordion`（**主映射**） | `items`→**`data=[{title, value, icon?, children?}]`**（`label`→`title`、`key`→`value`、`icon` 是 url 字符串——**保留 `<Icon>` shim 时 icon 字段不用**，图标走 customRender? 无——图标省略）；`selectedKeys`→**`selectedValue`（单 string）**；`onClick({key})`→**`onClick(node)`**（node 是 data 项原始对象，取 `node.value`）；`openKeys`→`defaultOpenKeys`；`mode="inline"` 收起态→`expanded`/`onExpand(flag)`；`enableMultiOpen`（嵌套菜单多开，默认 false）；`forceShowTip='title'` 溢出提示；单层平铺菜单：`data` 无 children + `enableExpand={false}` |

## API

### 属性

| 属性名称           | 描述                                                                                                                                                     | 输入                                      | 默认  |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- | :---- |
| id                 | 用户传入自定义 id 用于覆盖组件自动生成 id                                                                                                                | string                                    |       |
| data               | 手风琴数据 array<{title: ReactNode;value?: string;icon?: string;description?: string;activeIcon?: string;disabled?: boolean;children?: array}>           | array                                     |       |
| selectedValue      | 默认被选中的项的 value，不设置，则为第一项的 value                                                                                                       | string                                    | ''    |
| headerText         | 手风琴标题文字                                                                                                                                           | ReactNode                                 |       |
| headerIcon         | 手风琴标题图标的 url                                                                                                                                     | string                                    |       |
| enableTooltip      | 是否使用提示                                                                                                                                             | boolean                                      | true  |
| toolTipProps       | 自定义手风琴菜单的Tooltip属性(6.0.x版本支持)，需要将enableTooltip设置为true，参考Tooltip组件文档来设置                                                   | [CustomTooltipType](/components/Tooltip/) |       |
| forceShowTip       | 强制展示tip，设置为 'title'，使用浏览器默认的title属性。此时会忽略enableTooltip属性；enableTooltip只会在有溢出时才展示。                                 | string \| boolean                            | false |
| defaultOpenKeys    | 默认展示项的key                                                                                                                                          | string[]                                  |       |
| disabledItemKeys   | 禁用项的key                                                                                                                                              | string[]                                  |       |
| hideTitleBar       | 隐藏标题栏。                                                                                                                                             | boolean                                      | false |
| headerIconPosition | 控制头部 Icon 布局，可选值有 'top'、'left'                                                                                                               | string                                    | top   |
| enableMultiOpen    | 是否允许同时展开多个一级菜单                                                                                                                             | boolean                                      | false |
| showArrow          | 收起态时使用图标模式展示菜单项，为 true 时不显示菜单文字只显示图标，配合 enableExpand 使用                                                               | boolean                                      | false |
| enableExpand       | 是否允许展开/折叠面板                                                                                                                                    | boolean                                      | false |
| expanded           | 默认是否展开                                                                                                                                             | boolean                                      | true  |
| allowResize        | 是否允许拖动                                                                                                                                             | boolean                                      | false |
| maxResizableWidth  | 最大可拖动宽度，支持 px 和 rem 单位                                                                                                                      | string                                    | 16rem |
| style              | 通过 style 控制组件最外层样式                                                                                                                            | object                                    |       |
| className          | 通过 class 控制组件最外层样式                                                                                                                            | string                                    |       |
| onClick            | 手风琴元素被点击后的回调函数<br><br>**签名:**<br>`function(node: object) => void`<br>_node:_ 被点击项对应 data 中的原始数据                              | function                                  |       |
| onItemRightClick   | 右键点击菜单项的回调<br><br>**签名:**<br>`function(event: MouseEvent, { data }: { data: object }) => void`<br>_data:_ 被右键点击项对应 data 中的原始数据 | function                                  |       |
| onExpand           | 设置面板收起展开回调<br><br>**签名:**<br>`function(boolean: flag) => void`<br>_bool:_ 面板展开时为 true，收起时为 false                                     | function                                  |       |
| onResize           | 拖动回调函数`resizeData:{oldWidth: string;newWidth: string;}) => void;`<br>                                                                              | function                                  |       |

## 使用示例

### 基本

使用时需要传入菜单数据源，可以支持多级菜单

```jsx
import Accordion from "eview-ui/Accordion";

const data = [
  { title: "Navigation One", value: "1" },
  {
    title: "Navigation Two",
    value: "hero-since-child",
    children: [
      {
        title: "Option1",
        value: "opt1",
        children: [
          { title: "Sub Option1", value: "subOpt1" },
          { title: "Sub Option2", value: "subOpt2" },
        ],
      },
      { title: "Option2", value: "opt2" },
    ],
  },
  {
    title: "Navigation Tree",
    value: "off-the-wall",
    children: [
      { title: "Security Rule", value: "Security Rule" },
      { title: "URL Filter", value: "URL Filter" },
    ],
  },
];

<Accordion
  data={data}
  selectedValue="subOpt1"
  headerIcon="huawei" // 标题图标 url
  onClick={(node) => {
    // node 是 data 项原始对象，取 node.value
  }}
  onItemRightClick={(event, { data }) => {
    // event, { data: 右键项原始数据 }
  }}
  style={{ height: "540px" }}
/>
```

### 收缩、展开菜单

加入`enableExpand`属性可配置收缩功能，加入`showArrow`属性可配置展开功能

```jsx
import Accordion from "eview-ui/Accordion";

const data = [
  {
    title: "Overview",
    value: "over_view",
    icon: "navForm", // 项图标 url
    activeIcon: "navFormActive", // 选中态图标 url
  },
  {
    title: "Easy Configuration",
    value: "hero-since-child",
    icon: "navMsg",
    activeIcon: "navMsgActive",
    children: [
      { title: "Thriller", description: "说明文字" },
      { title: "Beat It", value: "beat-it" },
    ],
  },
  {
    title: "Advanced Configuration",
    value: "off-the-wall",
    icon: "navHeart",
    activeIcon: "navHeartActive",
    children: [
      { title: "Security Rule", value: "Security Rule" },
      { title: "URL Filter", value: "URL Filter" },
    ],
  },
];

// 收缩态：enableExpand={true} showArrow={false}（缩小模式，显示文字）
// 收起态：enableExpand={false} showArrow={true}（图标模式，仅显示图标）
<Accordion
  data={data}
  headerText="Site1-FW"
  selectedValue="URL Filter"
  enableExpand={true}
  showArrow={false}
  style={{ height: "776px", width: "344px" }}
/>
```

### 头部样式

设置`hideTitleBar`可以控制是否需要头部，`headerIconPosition`可以控制头部 Icon 布局

```jsx
import Accordion from "eview-ui/Accordion";

const data = [
  {
    title: "Overview",
    value: "over_view",
    icon: "navForm",
    activeIcon: "navFormActive",
  },
  {
    title: "Advanced Configuration",
    value: "off-the-wall",
    icon: "navHeart",
    activeIcon: "navHeartActive",
    children: [
      { title: "Security Rule", value: "Security Rule" },
      { title: "URL Filter", value: "URL Filter" },
    ],
  },
];

// hideTitleBar: false 显示头部 / true 隐藏头部
// headerIconPosition: "top"（默认）| "left"
<Accordion
  data={data}
  selectedValue="URL Filter"
  headerText="Header"
  hideTitleBar={false}
  headerIconPosition="top"
  showArrow={true}
  style={{ height: "540px" }}
/>
```

### 单个展开

设置`enableMultiOpen`为`false`，可设置菜单只展开单个

```jsx
import Accordion from "eview-ui/Accordion";

const data = [
  { title: "All", value: "over_view" },
  { title: "Star", value: "hero-since-child" },
  {
    title: "Off The Wall",
    children: [
      { title: "Don't Stop Till You Get Enough" },
      { title: "Off The Wall", value: "off-the-wall" },
    ],
  },
  {
    title: "Thriller",
    description: "巅峰中的巅峰",
    value: "thriller",
    children: [
      { title: "Thriller", description: "说明文字" },
      { title: "Beat It", description: "说明文字" },
    ],
  },
];

<Accordion
  data={data}
  selectedValue="off-the-wall"
  headerIcon="huawei" // 标题图标 url
  enableMultiOpen={false} // 只展开单个一级菜单（默认 false）
/>
```

### 允许拖动

可以通过设置`allowResize`属性开启拖动功能，`maxResizableWidth`可以设置拖动最大宽度，支持`px`和`rem`

```jsx
import Accordion from "eview-ui/Accordion";

const data = [
  { title: "Overview", value: "over_view" },
  {
    title: "Advanced Configuration",
    value: "off-the-wall",
    children: [
      { title: "Security Rule", value: "Security Rule" },
      { title: "URL Filter", value: "URL Filter" },
    ],
  },
];

<Accordion
  allowResize
  maxResizableWidth="500px" // 支持 px 和 rem
  data={data}
  selectedValue="URL Filter"
  enableMultiOpen
  style={{ height: "540px" }}
/>
```
