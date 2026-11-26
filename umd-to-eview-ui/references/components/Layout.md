# Layout 布局

> 分类：布局

布局组件，支持独占式布局，左右布局，上下布局，布局组件可以嵌套组合使用，默认子栏目大小平均分配，如需固定栏目，传入 class `"eui_layout_fix"`，并指定固定的宽或高。

**重要行为说明：**

- `type="full"` 时，渲染 `children` 作为内容区域，`leftPanel` 和 `rightPanel` 不生效
- `type="horizontal"` 或 `type="vertical"` 时，渲染 `leftPanel` 和 `rightPanel`，**`children` 不生效**
- 嵌套布局时，内部 Layout 自动去除外边距（margin: 0），宽高自适应父容器
- 固定栏目：为 leftPanel 或 rightPanel 的子元素添加 `className="eui_layout_fix"`，同时指定固定宽度（horizontal）或高度（vertical），可阻止该栏目被 flex 拉伸

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                           | eview 写法      | 迁移要点                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Layout`/`Header`/`Sider`/`Content` | `Layout` 或手写 | eview-ui `Layout` 仅三种形态：`type="full"/"horizontal"/"vertical"` + `leftPanel`/`rightPanel`（element）+ children 主区；**antd Layout 复合结构（Header+ Sider + Content 嵌套）无一一对应**——简单左右/上下分栏用 Layout，复杂骨架手写 CSS（固定侧栏 + flex 主区，见 [handwrite-templates.md](handwrite-templates.md) §1）；固定栏目传 `className="eui_layout_fix"` + 显式宽高 |

## API

### 属性

| 属性名称   | 描述                                                                         | 输入                                                                | 默认                    |
| :--------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------ | :---------------------- |
| id         | 定制组件dom元素id，传入该值可覆盖组件自动生成的id                            | string                                                              | 自动生成 (eui_layout_N) |
| className  | 定制组件dom元素className                                                     | string                                                              |                         |
| style      | 定制组件的样式                                                               | object                                                              |                         |
| type       | 自定义布局类型                                                               | enum:<br>&nbsp;'full'<br>&nbsp;'horizontal'<br>&nbsp;'vertical'<br> | "full"                  |
| children   | type="full" 时生效，作为内容区域渲染；type 为 horizontal/vertical 时不生效   | ReactNode                                                           |                         |
| leftPanel  | type="horizontal" 时为指定左侧面板内容，type="vertical" 时为指定上方面板内容 | ReactNode                                                           |                         |
| rightPanel | type="horizontal" 时为指定右侧面板内容，type="vertical" 时为指定下方面板内容 | ReactNode                                                           |                         |

## 使用示例

### 基本属性设置



```jsx
import Layout from "eview-ui/Layout";

// type="full"：渲染 children 作内容区，leftPanel/rightPanel 不生效
<Layout type="full">
  <div style={{ padding: "10px" }}>Full layout content area (children)</div>
</Layout>

// type="horizontal"：leftPanel(左) + rightPanel(右)；固定栏目加 className="eui_layout_fix" + 显式宽
<Layout
  type="horizontal"
  leftPanel={
    <div className="eui_layout_fix" style={{ width: "200px" }} />
  }
  rightPanel={<div />}
/>

// type="vertical"：leftPanel(上) + rightPanel(下)
<Layout type="vertical" leftPanel={<div />} rightPanel={<div />} />

// 嵌套组合：rightPanel 里再套一个 vertical Layout（内部 Layout 自动去除外边距，宽高自适应父容器）
<Layout
  type="horizontal"
  leftPanel={
    <div className="eui_layout_fix" style={{ width: "100px" }} />
  }
  rightPanel={
    <Layout type="vertical" leftPanel={<div />} rightPanel={<div />} />
  }
/>
```
