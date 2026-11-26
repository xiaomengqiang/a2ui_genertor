# GridLayout 网格布局

> 分类：布局

网格布局组件，可以使用组件 `Row` 和`Col`生成网格布局。支持设置每行的列数，默认24列。


## antd 迁移注意事项

> 导入特例：`import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`（Row/Col 具名导出）

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Form` layout 布局 | `GridLayout`（Row/Col） | `Row totalCols`（默认 24）+ `Col cols`（= span）/`offset`；`gutter`→`colMargin`（CSS margin 写法）；**无响应式断点**（无 xs/sm/md）；配合 `eui_form_ctrl` 类受 Form 控制布局 |
| `Row` / `Col` | `Row` / `Col`（GridLayout） | `import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`；`span`→**`cols`**；`gutter`→`colMargin`（**CSS margin 字符串写法**，如 `'0 0 1rem 1rem'`，不是数字/数组）；`offset` 同名；**无响应式断点**（xs/sm/md/lg/xl 全删）；复杂栅格手写 flex/grid |

## API

### Row属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  Row根节点的id | string |  |
| className |  Row根节点的样式类名 | string |  |
| style |  覆盖Row根节点的行内样式 | object |  |
| totalCols |  Row的列数 | number | 24 |
| colStyle |  为行内每列设置style | object |  |
| colMargin |  设置col的间距，同css margin设置写法，支持1~4个值（如 `'10px'`/`'10px 20px'`/`'10px 20px 10px 20px'`） | string |  |

### Col属性

Col是Row的子标签和Row标签一起使用。

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  Col根节点的id | string |  |
| className |  Col根节点的样式类名 | string |  |
| style |  覆盖Col根节点的行内样式 | object |  |
| cols |  Col节点所占单元格数目 | number | 1 |
| offset |  Col节点相对于前一个同胞的单元格偏移量 | number | 0 |

## 使用示例

### 基本属性设置

```jsx
import { Row, Col } from "eview-ui/GridLayout";

// totalCols（默认 24）= Row 列数；cols = Col 占的单元格数；colMargin = 列间距（CSS margin 写法）
const colStyle = { padding: "10px 0px", background: "#868686", color: "#fff", textAlign: "center" };
const rowProps = { colStyle, style: { marginBottom: "20px" }, colMargin: "10px" };

// 24 列各占 1 / 12 列各占 2 / 8 列各占 3 / … / 1 列占 24
<Row {...rowProps}>
  {Array.from({ length: 24 }, (_, i) => <Col key={i} cols={1}>1</Col>)}
</Row>
<Row {...rowProps}>
  {Array.from({ length: 12 }, (_, i) => <Col key={i} cols={2}>2</Col>)}
</Row>
<Row {...rowProps}>
  {Array.from({ length: 8 }, (_, i) => <Col key={i} cols={3}>3</Col>)}
</Row>
<Row {...rowProps}>
  <Col cols={12}>12</Col>
  <Col cols={12}>12</Col>
</Row>
<Row {...rowProps}>
  <Col cols={24}>24</Col>
</Row>
```

### 表单布局用例

```jsx
import { Row, Col } from "eview-ui/GridLayout";
import TextField from "eview-ui/TextField";
import DatePicker from "eview-ui/DatePicker";

// 表单布局：label Col + 控件 Col，cols 之和 ≤ totalCols（默认 24）；配合 eui_form_ctrl 类受 Form 控制布局
<Row colStyle={{ background: "#fff" }} style={{ marginBottom: "20px" }}>
  <Col cols={4}>
    <span>*Name :</span>
  </Col>
  <Col cols={5}>
    <TextField placeholder="Please enter..." />
  </Col>
  <Col cols={4}>
    <span>*Country :</span>
  </Col>
  <Col cols={5}>
    <TextField />
  </Col>
</Row>

// 一行内控件跨多列：cols={15} 占 15 列
<Row colStyle={{ background: "#fff" }} style={{ marginBottom: "20px" }}>
  <Col cols={4}>
    <span>DateTime :</span>
  </Col>
  <Col cols={15}>
    <DatePicker value={new Date()} type="datetime" time={[10, 10, 10]} format="YYYY-MM-DD HH:mm:ss" required />
  </Col>
</Row>
```

### 嵌套布局用例

```jsx
import { Row, Col } from "eview-ui/GridLayout";

// 嵌套布局：Col 内再套 Row/Col，cols 在各自 Row 的 totalCols 范围内分配
<Row>
  <Col cols={4} style={{ height: "500px" }}>
    {/* 左侧栏：如 Tree */}
  </Col>
  <Col cols={20}>
    <Row>
      <Col cols={6}>{/* 如缩略图 */}</Col>
      <Col cols={16}>{/* 如 Table */}</Col>
    </Row>
  </Col>
</Row>
```

