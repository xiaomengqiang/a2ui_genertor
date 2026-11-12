# Layout 布局

> 分类：布局

布局组件,支持独占式布局，左右布局，上下布局，布局组件可以嵌套组合使用，默认子栏目大小平均分配，如需固定栏目，传入class:"eui_layout_fix",并指定固定的宽或高。

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id | string |  |
| className |  定制组件dom元素className | string |  |
| style |  定制组件的样式 | object |  |
| type |  自定义布局类型 | enum:<br>&nbsp;'full'<br>&nbsp;'horizontal'<br>&nbsp;'vertical'<br> | "full" |
| leftPanel |  type="horizontal"时为指定左侧面板内容， type="vertical"时为指定上方面板内容 | element |  |
| rightPanel |  type="horizontal"时为指定右侧面板内容， type="vertical"时为指定下方面板内容 | element |  |

## 接口定义

```typescript
import type { ReactNode } from 'react';

interface Layout {


  /**
   *定制组件dom元素id，传入该值可覆盖组件自动生成的id
   */
  id: string;

  /**
   * 定制组件dom元素className
   */
  className: string;

  /**
   * 定制组件的样式
   */
  style: object;

  /**
   * 自定义布局类型
   */
  type: 'full' | 'horizontal' | 'vertical';

  /**
   * type="horizontal"时为指定左侧面板内容， type="vertical"时为指定上方面板内容
   */
  leftPanel: ReactNode;

  /**
   * type="horizontal"时为指定右侧面板内容， type="vertical"时为指定下方面板内容
   */
  rightPanel: ReactNode;

  /**
   * 子元素
   */
  children: ReactNode;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Layout from 'eview-ui/Layout';
import LabelField from 'eview-ui/LabelField';

export default class LayoutDemo extends React.Component {

  render() {

    let leftPanel = <div id="leftPanel" key="leftPanel" className={"eui_layout_fix"} style={{ background: "#ffffff", width: "200px" }}></div>;
    let rightPanel = <div id="rightPanel" key="rightPanel" style={{ background: "#ffffff" }}></div>;
    let topPanel = <div id="topPanel"  key="topPanel" style={{ background: "#ffffff" }}></div>;
    let bottomPanel = <div id="bottomPanel" key="bottomPanel"  style={{ background: "#ffffff" }}></div>;

    let horizontalLayout = <Layout type={"horizontal"} leftPanel={leftPanel} rightPanel={rightPanel} />
    let verticalLayout = <Layout type={"vertical"} leftPanel={topPanel} rightPanel={bottomPanel} />
    return (
      <div id="LayoutDemo" style={{ margin: "20px" }}>

        <LabelField text={"Type : Full"} />
        <div id="full" style={{ background: "#e8e8e8", height: "200px" }}>
          <Layout type={"full"} style={{ background: "#fff" }}>
          </Layout>
        </div>

        <LabelField text={"Type : horizontal"} />
        <div id="horizontal" style={{ background: "#e8e8e8", height: "200px" }}>
          {horizontalLayout}
        </div>

        <LabelField text={"Type : vertical"} />
        <div id="vertical" style={{ background: "#e8e8e8", height: "200px" }}>
          {verticalLayout}
        </div>

        <LabelField text={"Combined Layout"} />
        <div id="Combined" style={{ background: "#e8e8e8", height: "200px" }}>
          <Layout type={"horizontal"}
            leftPanel={<div id="CombinedLeft" key="CombinedLeft" className={"eui_layout_fix"} style={{ background: "#fff", width: "100px", marginRight: "20px" }}></div>}
            rightPanel={verticalLayout} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<LayoutDemo />, mountNode);

```

```jsx
import Layout from 'eview-ui/Layout';
import LabelField from 'eview-ui/LabelField';

export default class LayoutDemo extends React.Component {

  render() {

    let leftPanel = <div id="leftPanel" key="leftPanel" className={"eui_layout_fix"} style={{ background: "#ffffff", width: "200px" }}></div>;
    let rightPanel = <div id="rightPanel" key="rightPanel" style={{ background: "#ffffff" }}></div>;
    let topPanel = <div id="topPanel"  key="topPanel" style={{ background: "#ffffff" }}></div>;
    let bottomPanel = <div id="bottomPanel" key="bottomPanel"  style={{ background: "#ffffff" }}></div>;

    let horizontalLayout = <Layout type={"horizontal"} leftPanel={leftPanel} rightPanel={rightPanel} />
    let verticalLayout = <Layout type={"vertical"} leftPanel={topPanel} rightPanel={bottomPanel} />
    return (
      <div id="LayoutDemo" style={{ margin: "20px" }}>

        <LabelField text={"Type : Full"} />
        <div id="full" style={{ background: "#e8e8e8", height: "200px" }}>
          <Layout type={"full"} style={{ background: "#fff" }}>
          </Layout>
        </div>

        <LabelField text={"Type : horizontal"} />
        <div id="horizontal" style={{ background: "#e8e8e8", height: "200px" }}>
          {horizontalLayout}
        </div>

        <LabelField text={"Type : vertical"} />
        <div id="vertical" style={{ background: "#e8e8e8", height: "200px" }}>
          {verticalLayout}
        </div>

        <LabelField text={"Combined Layout"} />
        <div id="Combined" style={{ background: "#e8e8e8", height: "200px" }}>
          <Layout type={"horizontal"}
            leftPanel={<div id="CombinedLeft" key="CombinedLeft" className={"eui_layout_fix"} style={{ background: "#fff", width: "100px", marginRight: "20px" }}></div>}
            rightPanel={verticalLayout} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<LayoutDemo />, mountNode);

```

