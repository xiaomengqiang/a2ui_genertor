# TimeLine 时间轴

> 分类：数据展示

根据时间来陈述内容，比较适合一些网站展示发展历程，大事件等场景。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法  | eview 写法 | 迁移要点                                                                                                                                                                                                                                                                                                            |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Timeline` | `TimeLine` | **导出名大写 L（TimeLine 不是 Timeline）**；`items`→**`data=[{title, date, icon?, iconType?, content}]`**；`iconType: 'success'/'error'/'default'`（= antd color 三态）；`dot`→`icon`（url）；自定义内容 `render(content)`（**data 项级 render 函数**）；**第一条数据的 iconType 是内置固定的不受控制**（文档警告） |

## API

### 属性

| 属性名称         | 描述                                                                                                                                                                                                                                                                                         | 输入     | 默认 |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :--- |
| id               | 定制组件id，传入该值可覆盖组件自动生成的id                                                                                                                                                                                                                                                   | string   |      |
| className        | 定制组件class，传入该值可在组件默认样式上追加class，从而自定义组件样式                                                                                                                                                                                                                       | string   |      |
| style            | 自定义时间线样式                                                                                                                                                                                                                                                                             | object   |      |
| title            | 自定义标题文字                                                                                                                                                                                                                                                                               | string   |      |
| titleClassName   | 通过className设置时间线标题样式                                                                                                                                                                                                                                                              | string   |      |
| titleStyle       | 通过style设置时间线标题样式                                                                                                                                                                                                                                                                  | object   |      |
| data             | 时间轴内容 data: [{ title: "Succeed", date: "2017-01-04 16:00", icon: "./image/success.png", iconType:oneOf( ["success", "error", "default"]),默认值"default" content:"内容",//有render函数时由render函数渲染，显示渲染后结果 }] <br/>注意：第一条数据里的iconType是内置固定的，不受外界控制 | array    |      |
| render           | content内容的渲染函数 render:(o)=>{ return &lt;div&gt;&lt;a&gt;o.title&lt;/a&gt;&lt;span&gt;o.text&lt;/span&gt;&lt;/div&gt; }                                                                                                                                                                | function |      |
| iconClassName    | 通过className设置图标样式                                                                                                                                                                                                                                                                    | string   |      |
| iconStyle        | 通过style设置图标样式                                                                                                                                                                                                                                                                        | object   |      |
| contentClassName | 通过className设置右侧内容区域外层容器样式                                                                                                                                                                                                                                                    | string   |      |
| contentStyle     | 通过style设置右侧内容区域外层容器样式                                                                                                                                                                                                                                                        | object   |      |
| dateClassName    | 通过className设置左侧文字日期外层容器轴样式                                                                                                                                                                                                                                                  | string   |      |
| dateStyle        | 通过style设置左侧文字日期外层容器轴样式                                                                                                                                                                                                                                                      | object   |      |

## 接口定义

```typescript
interface TimeLineRow {
  contentClassName: string;
  dateClassName: string;
  data: any;
  index: number;
  contentStyle: object;
  render: any;
  iconClassName: string;
  dateStyle: object;
  iconStyle: object;
  hasLeftPart: boolean;
  isEnd: boolean;
  themeVersion: string;
}
```

## 使用示例

### 基本属性设置


```jsx
import TimeLine from "eview-ui/TimeLine";
import { Row, Col } from "eview-ui/GridLayout";

const props = {
  title: "Execution History",
  render: (obj) => {
    if (!obj) return;
    const styleRef = { fontSize: "1rem", color: "#212121" };
    if (obj.title1 === "Approval Failed") {
      styleRef.color = "#ff0000";
    }
    return (
      <Row colMargin={"0rem 1.25rem 0rem 0rem"}>
        <Col cols={8}>
          <div style={{ position: "relative" }}>
            <div style={styleRef}>{obj.title1}</div>
            <div style={{ fontSize: "0.875rem", color: "#999999" }}>
              {obj.text1}
            </div>
          </div>
        </Col>
      </Row>
    );
  },
  data: [
    {
      title: "",
      date: "",
      iconType: "default", // 'default' | 'success' | 'error'（第一条 iconType 内置固定不受控）
      content: { title1: "Inprogress", text1: "说明文字" },
    },
    {
      title: "",
      date: "",
      iconType: "success",
      content: { title1: "Approved", text1: "说明文字" },
    },
    {
      title: "",
      date: "",
      iconType: "error",
      content: { title1: "Approval Failed", text1: "说明文字" },
    },
  ],
};

<TimeLine {...props} />
```

### 随着时间的推移


```jsx
import TimeLine from "eview-ui/TimeLine";
import { Row, Col } from "eview-ui/GridLayout";

const props = {
  title: "Execution History",
  render: (obj) => (
    <Row colMargin={"0px 50px 0px 0px"}>
      <Col cols={8}>
        <div style={{ fontSize: "1.25rem", color: "#333333" }}>{obj.title1}</div>
        <div style={{ fontSize: "0.875rem", color: "#666666" }}>{obj.text1}</div>
      </Col>
      <Col cols={6}>
        <div style={{ fontSize: "0.875rem", color: "#999999" }}>{obj.title2}</div>
        <div style={{ fontSize: "0.875rem", color: "#666666" }}>{obj.text2}</div>
      </Col>
      <Col cols={6}>
        <div style={{ fontSize: "0.875rem", color: "#999999" }}>{obj.title3}</div>
        <div style={{ fontSize: "0.875rem", color: "#666666" }}>{obj.text3}</div>
      </Col>
      <Col cols={4}>
        <div style={{ fontSize: "0.875rem", color: "#999999" }}>{obj.title4}</div>
        <div style={{ fontSize: "0.875rem", color: "#666666" }}>{obj.text4}</div>
      </Col>
    </Row>
  ),
  data: [
    {
      title: "Succeed",
      date: "2017-01-04 16:00",
      iconType: "success",
      content: {
        title1: "说明文字",
        title2: "Event:",
        title3: "Condition:",
        title4: "Action:",
        text1: "说明文字",
        text2: "说明文字",
        text3: "说明文字",
        text4: "说明文字",
      },
    },
    {
      title: "Failure",
      date: "2017-01-04 16:00",
      iconType: "error",
      content: {
        title1: "说明文字",
        title2: "Event:",
        title3: "Condition:",
        title4: "Action:",
        text1: "说明文字",
        text2: "说明文字",
        text3: "说明文字",
        text4: "说明文字",
      },
    },
  ],
};

<TimeLine {...props} />
```
