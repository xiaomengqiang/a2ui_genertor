# TreeTable 树表

> 分类：数据展示

`TreeTable` 组件和 `Table` 组件的功能相近，但 `TreeTable` 注重于层级数据的展示。

## API

| 方法名                | 描述                                                                          | 参数  | 返回值 |
| --------------------- | ----------------------------------------------------------------------------- | ----- | ------ |
| getSelected           | 单击选中行原始数据(若无选中项，则为空数组) : {key1: value1, key2: value2 ...} | 无    | array  |
| setSizeColumnFit      | Set the specified column to Fit according to width of largest column value.   | id    | None   |
| reSetcolumnSize       | reset the column width to orginal value                                       | None  | None   |
| getSelectedRowsIndex  | selected row indexes                                                          | None  | array  |
| getCheckedRowsDataIds | Get the Row checked Ids                                                       | None  | array  |
| setCheckedRowsDataIds | Set the Checked Rows                                                          | array | None   |
| expandAll             | 树表全部变为展开状态                                                          | 无    | 无     |
| collapseAll           | 树表全部变为折叠状态                                                          | 无    | 无     |
| setScrollBarAt        | 设置表格纵向滚动条的位置(只在设定了表格height的场景下起作用)                  | id    | none   |

### 属性

| 属性名称                  | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 输入              | 默认              |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- | :---------------- |
| id                        | 表格的唯一标示编号，未指定则自动生成                                                                                                                                                                                                                                                                                                                                                                                                                                                         | string            |                   |
| className                 | By customizing the class to add user-defined style，You can control the entire component of the overall style（Outermost div） The following is an example：margin, padding                                                                                                                                                                                                                                                                                                                  | string            |                   |
| height                    | TreeTable组件的高度（像素）. This height is applicable to table Body part, Excluding the Table Header & Scroll Bar.                                                                                                                                                                                                                                                                                                                                                                          | number            |                   |
| maxHeight                 | TreeTable maximum height that can be claimed by the component.<br>If `maxHeight` (in pixels) is configured, treetable height is adjusted depending upon the content and maximum height for treetable becomes the `maxHeight` provided by the user.<br>Note: When `maxHeight` is configured then `height` should not be configured.                                                                                                                                                           | number            |                   |
| width                     | TreeTable组件的宽度（像素）                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | number            |                   |
| nodeKey                   | 定义作为id的字段名，默认为'id'                                                                                                                                                                                                                                                                                                                                                                                                                                                               | string            | 'id'              |
| expandedKeys              | 展开节点的id数组，例如：['step_31', 'step_95']                                                                                                                                                                                                                                                                                                                                                                                                                                               | array             | []                |
| columns                   | 头部的列和列头定义数据类型描述                                                                                                                                                                                                                                                                                                                                                                                                                                                               | array             | []                |
| dataset                   | 行数据：带层级关系的Object数组 [ { data: { fieldname1: value1, fieldname2: value2 }, option: { fieldname1: { style: 'cellClassName1', ... }, fieldname2: { style: 'cellClassName2', ... } }, children: [和dataset结构相同的数组], isLeaf: true, // 声明这个节点是否为叶子节点 } ] <br>Note: User can provide any property in the option field specific to the cell of that row. Be careful in using the style property, it should not override default styles which may upset the component. | array             | []                |
| style                     | TreeTable组件外层div样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | object            |                   |
| tableStyle                | TreeTable组件内部table样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | object            |                   |
| headerStyle               | TreeTable组件表头样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | object            |                   |
| onRowClick                | 行选中事件回调<br><br>**签名:**<br>`function(row: Object, e: Object) => void`<br>_row:_ 行对象<br>_e:_ 原生点击事件                                                                                                                                                                                                                                                                                                                                                                          | function          |                   |
| onRowCheck                | 树表体选中事件回调<br><br>**签名:**<br>`function(row: Object, checkedRows: array, e: Object) => void`<br>_row:_ 行对象<br>_checkedRows:_ 选中行的集合数组<br>_e:_ 原生点击事件                                                                                                                                                                                                                                                                                                               | function          |                   |
| onHeaderCheck             | 树表头选中事件回调<br><br>**签名:**<br>`function(checkedRowsRef: array, e: Object) => void`<br>_checkedRowsRef:_ 选中行的集合数组<br>_e:_ 原生点击事件                                                                                                                                                                                                                                                                                                                                       | function          |                   |
| onNodeExpand              | 点击展开/收起的时候的回调函数<br><br>**签名:**<br>`function(rowId: Number, expandedKeys: Array, expanded: Boolean) => void`<br>_rowId:_ Table行id<br>_expandedKeys:_ 已展开的id数组<br>_expanded:_ 展开状态                                                                                                                                                                                                                                                                                  | function          |                   |
| enableColumnDrag          | 支持表头列宽可拖拽                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | boolean              | true              |
| selectedRowKey            | 设置选中主键值                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | array             |                   |
| unmodifiableRowIds        | 设置状态不可变的节点                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | array             | []                |
| rowStyle                  | 表体内容样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | object            |                   |
| onColumnSizeChange        | On Cloumn size change callback.<br><br>**Signature:**<br>`function(column: Object) => void`<br>_column:_ column object                                                                                                                                                                                                                                                                                                                                                                       | function          | null              |
| onRowRightClick           | 右击事件回调函数.<br><br>**Signature:**<br>`function(e: Object, row: Object) => void`<br>_e:_ Native click event<br>_row:_ Line object                                                                                                                                                                                                                                                                                                                                                       | function          |                   |
| itemOrderChanger          | Display the item order changer in column selector, Item can be Up and Down.                                                                                                                                                                                                                                                                                                                                                                                                                  | boolean              | false             |
| mutiSelectEnable          | if true the multi select using control+click is supported .                                                                                                                                                                                                                                                                                                                                                                                                                                  | boolean              | false             |
| enableCheckBox            | Enable the check supports check boxes.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | boolean              | false             |
| disabelCheckAssociated    | CheckBox勾选/去勾选时，禁止父节点和子节点联动                                                                                                                                                                                                                                                                                                                                                                                                                                                | boolean              | false             |
| iconLeaf                  | 通过传入url的方式定义组件内部叶子节点图标,需配合iconExpanded和iconCollapsed一起使用 <br/>图片建议尺寸 16px\*16px                                                                                                                                                                                                                                                                                                                                                                             | string            |                   |
| iconExpanded              | 通过传入url的方式定义组件非叶子节点展开时的图标,需配合iconLeaf和iconCollapsed一起使用 <br/>图片建议尺寸 16px\*16px                                                                                                                                                                                                                                                                                                                                                                           | string            |                   |
| iconCollapsed             | 通过传入url的方式定义组件非叶子节点关闭时的图标,需配合iconLeaf和iconExpanded一起使用 <br/>图片建议尺寸 16px\*16px                                                                                                                                                                                                                                                                                                                                                                            | string            |                   |
| enableColumnFilter        | 开启列筛选，支持表头隐藏、表头排序                                                                                                                                                                                                                                                                                                                                                                                                                                                           | boolean              | false             |
| onFilterOkClick           | Double select OK click callback.<br><br>**Signature:**<br>`function(leftItems: Object, rightItems: Object) => void`<br>_leftItems:_ Line object <br>_rightItems:_ Line object                                                                                                                                                                                                                                                                                                                | function          |                   |
| onDoubleClick             | Double Click event callback.<br><br>**Signature:**<br>`function(cell:Object, row: Object,e: Object) => void`<br>_e:_ Native click event<br>_row:_ Line object <br>_cell:_ Line object                                                                                                                                                                                                                                                                                                        | function          |                   |
| onColumnSort              | 排序点击事件<br><br>**签名:**<br>`function(sortColumn: Object, sortType: string) => void`<br>_sortColumn:_ 排序列<br>_sortType:_ 排序方式                                                                                                                                                                                                                                                                                                                                                    | function          | null              |
| enableOriginSort          | 是否启用初始排序                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | boolean              | false             |
| expandColumnID            | 展开收缩图标在哪一列渲染                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | number            | 0                 |
| columnFilterMountId       | 支持设置列选择弹出框挂载DOM的Id，默认挂在body上                                                                                                                                                                                                                                                                                                                                                                                                                                              | string            | body              |
| disableHeaderCheckbox     | 是否禁用表头复选框                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | boolean              | false             |
| customRowStyle            | 表格所有行样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Object            |                   |
| enablePagination          | 开启分页                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | boolean              | false             |
| recordCount               | 总记录数                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | number            | 0                 |
| recordCountDisp           | Used in display of Total Record instead of recordCount. Note : Total number of page calculation will be based on recordCount                                                                                                                                                                                                                                                                                                                                                                 | string            |                   |
| pageSize                  | 表格可展示的根节点数                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | number            | 10                |
| currentPage               | 当前页码                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | number            | 1                 |
| pageSizeOptions           | 分页选项 [10, 20, 50, 100]                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | array             | [10, 20, 50, 100] |
| pagingType                | 分页类型：下拉或数字('list','select')                                                                                                                                                                                                                                                                                                                                                                                                                                                        | string            | 'list'            |
| splitPagination           | 如果为“true”，则将分页切换到右侧                                                                                                                                                                                                                                                                                                                                                                                                                                                             | boolean              | true              |
| paginationPopupDirection  | Defines the direction of the popup in the pagination page size selection control                                                                                                                                                                                                                                                                                                                                                                                                             | 'top' 'bottom'    |                   |
| pagingSelectWidth         | 自定义分页中Select下拉菜单的宽度                                                                                                                                                                                                                                                                                                                                                                                                                                                             | string            |                   |
| pagingProps               | Paging子组件的props, 详情请查阅Paging的API                                                                                                                                                                                                                                                                                                                                                                                                                                                   | object            |                   |
| isRequiredToUpdateColumns | 是否更新columns。如果设置为true，不会保存之前的列状态，由业务组自己维护列状态。<br>特殊场景：如果设置为 [["width"]]，表示列宽度将由组件维护保存，此时外部重新设置的列宽将不起作用。                                                                                                                                                                                                                                                                                                          | boolean或[["width"]] | false             |
| checkType                 | 设置勾选框类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 'single' 'multi'  | 'multi'           |
| defaultColumns            | 设置表格重置的默认值, 数组中传入columns中key值                                                                                                                                                                                                                                                                                                                                                                                                                                               | array             |                   |
| useCustomToolTip          | 启用自定义提示框，代替浏览器提示框。                                                                                                                                                                                                                                                                                                                                                                                                                                                         | boolean              | false             |
| disableEviewSort          | 如果业务组不希望使用组件的默认排序能力，可使用该属性。                                                                                                                                                                                                                                                                                                                                                                                                                                       | boolean              | false             |

## 属性详情

> 列 `<a id="columns"></a>`

| 定义          | 输入     | 默认                                                       | 描述                                                                                                                            |
| ------------- | -------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| align         | string   | 'center'                                                   | 列对齐支持：left，center，right                                                                                                 |
| display       | boolean     | true                                                       | 此列是否显示开关                                                                                                                |
| field         | string   |                                                            | 建议与数据库的字段名称一致                                                                                                      |
| options       | object   | '{}'                                                       | 需要建立编辑列表渲染的其他参数根据呈现类型'设置如下图所示                                                                       |
| render        | function | '(cellVaule, rowDatas, options, row) => ${cellVaule} Year' | 自定义此列单元格中的显示内容和样式。                                                                                            |
| tipFormatter  | function | 'v => ${v.age} Year'                                       | 自定义光标在小区显示内容                                                                                                        |
| title         | string   |                                                            | 必配,主题                                                                                                                       |
| width         | number   |                                                            | colounm宽度(像素)                                                                                                               |
| isMovable     | boolean     | true                                                       | 表头顺序是否可调整的开关                                                                                                        |
| cid           | string   |                                                            | 这是唯一id列                                                                                                                    |
| validator     | function |                                                            | 表头调整面板中的校验器                                                                                                          |
| displayPolicy | string   | 'never'                                                    | 如果此属性设置为'不'与该列显示false不会向用户显示在任何一点也不过滤对话框中。但此属性必须配合用户显示错误还会有不良影响列显示。 |
| cellClassName | string   | 'classnameforcellsofthiscolumn'                            | 它可以用来设置rowcells classname的特定列                                                                                        |
| key           | object   |                                                            | 列数据的唯一标识， 必须传入                                                                                                     |

## 使用示例

### 基本属性设置

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", width: "25%", field: "Engine", key: "col_1" },
  { title: "Browser", width: "25%", field: "Browser", display: true, key: "col_2" },
  { title: "Platform", field: "Platform", width: "25%", key: "col_3" },
  {
    title: "Progress",
    field: "Progress",
    renderType: TreeTable.ColumnRenderType.PROGRESS_BAR,
    options: { format: "percent" }, // 数字数组：进度百分比
    width: "25%",
    key: "col_4",
  },
];

const dataset = [
  {
    data: { Engine: "Trident_0", Progress: 3, id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", Progress: 2, id: "0.0" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", Progress: 6, id: "0.0.0" } },
        ],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", Progress: 6, id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", Progress: 2, id: "2" }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  expandedKeys={["0", "0.0"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* id: 节点 id；expandedKeys: 已展开 id 数组；expanded: 展开状态，取值更新 expandedKeys */ }}
  onRowClick={(row, e) => { /* row, e */ }}
  currentPage={1}
  recordCount={3}
  enablePagination
  pageSize={2}
  pageSizeOptions={[2, 4, 6]}
/>
```

### Tree Table MultiSelect

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", width: "50%", field: "Engine", key: "col_1" },
  { title: "Browser", width: "25%", field: "Browser", display: true, key: "col_2" },
  { title: "Platform", field: "Platform", width: "25%", key: "col_3" },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        children: [
          {
            data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" },
            children: [
              { data: { Engine: "Trident_9", Browser: "IE_9", Platform: "OS_Win_2", id: "0.0.0.0" } },
            ],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" },
        children: [
          { data: { Engine: "Trident_11", Browser: "IE_11", Platform: "OS_Win_11", id: "0.1.0" }, isLeaf: true },
        ],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  disableRowIds={["0.1"]}
  enableCheckBox
  expandedKeys={["0", "0.1"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  onRowClick={(row, e) => { /* row, e */ }}
  selectedRowKey={[]}
  ref={(treeTable) => { /* treeTable.getCheckedRowsDataIds() 取选中 id 数组；treeTable.setCheckedRowsDataIds(["0.1", "0.2"]) 设置选中 */ }}
/>
```

### 树表多选checkedRow

```jsx
import TreeTable from "eview-ui/TreeTable";
import LinkField from "eview-ui/LinkField";

const dataset = [
  {
    data: { Engine: "Trident_0", sid: "root" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", sid: "Node_1" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", sid: "Node_2" }, children: [], isLeaf: true },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", sid: "Node_5" }, isLeaf: true },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: "Trident_4", Browser: "IE_4", sid: "Node_4" },
        children: [
          { data: { Engine: "Trident_11", Browser: "IE_11", Platform: "OS_Win_11", sid: "Node_11" }, isLeaf: true },
        ],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", sid: "Node_3" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", sid: "Node_6" }, children: [], isLeaf: true },
];

const columns = [
  {
    title: "operation",
    field: "sid",
    width: "15%",
    render: (cellValue) => (
      <LinkField
        onClick={(e) => { /* 取 cellValue（sid）从 dataset 中删除对应行 */ }}
        text={"delete"}
        disabled={false}
        style={{ marginRight: "20px" }}
      />
    ),
    key: "col_1",
  },
  { title: "Engine", width: "35%", field: "Engine", key: "col_2" },
  { title: "Browser", width: "25%", field: "Browser", display: true, key: "col_3" },
  { title: "Platform", field: "Platform", width: "25%", key: "col_4" },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  enableCheckBox
  disabelCheckAssociated
  expandedKeys={["root", "Node_4"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  onRowCheck={(row, checkedRows, e) => { /* row, checkedRows: 选中行 id 数组, e */ }}
  onHeaderCheck={(checkedRowsRef, e) => { /* checkedRowsRef: 选中行 id 数组, e */ }}
  nodeKey={"sid"}
  expandColumnID={1}
/>
```

### 树表多选功能扩展特性

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", width: "50%", field: "Engine", key: "col_1" },
  { title: "Browser", width: "25%", field: "Browser", display: true, key: "col_2" },
  { title: "Platform", field: "Platform", width: "25%", key: "col_3" },
];

const dataset = [
  {
    data: { Engine: "Trident_0", sid: "root" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", sid: "Node_1" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", sid: "Node_2" }, children: [], isLeaf: true },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", sid: "Node_5" } },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: "Trident_4", Browser: "IE_4", sid: "Node_4" },
        children: [
          { data: { Engine: "Trident_11", Browser: "IE_11", Platform: "OS_Win_11", sid: "Node_11" }, isLeaf: true },
        ],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", sid: "Node_3" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", sid: "Node_6" }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  unmodifiableRowIds={["Node_4", "Node_7"]}
  enableCheckBox
  disabelCheckAssociated
  expandedKeys={["root", "Node_4"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  onRowClick={(row, e) => { /* row, e */ }}
  ref={(treeTable) => { /* treeTable.setCheckedRowsDataIds(["Node_4"]) 初始选中；treeTable.getCheckedRowsDataIds() 取选中 id 数组 */ }}
  nodeKey={"sid"}
/>
```

### Tree Table deletion setting

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", width: "50%", field: "Engine", key: "col_1" },
  { title: "Browser", width: "25%", field: "Browser", display: true, key: "col_2" },
  { title: "Platform", field: "Platform", width: "25%", key: "col_3" },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        children: [
          {
            data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" },
            children: [
              { data: { Engine: "Trident_9", Browser: "IE_9", Platform: "OS_Win_2", id: "0.0.0.0" } },
            ],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" },
        children: [{ data: { Engine: "Trident_11", Browser: "IE_11", Platform: "OS_Win_11", id: "0.1.0" } }],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  expandedKeys={["0"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  ref={(treeTable) => { /* treeTable.getSelected() 取选中行原始数据，据此从 dataset 中删除对应节点 */ }}
/>
```

### 全部展开和全部折叠

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", width: "50%", field: "Engine", key: "col_1" },
  { title: "Browser", width: "25%", field: "Browser", display: true, key: "col_2" },
  { title: "Platform", field: "Platform", width: "25%", key: "col_3" },
];

const dataset = [
  {
    data: { Engine: "Trident_0", sid: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", sid: "0.0" },
        children: [
          {
            data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", sid: "0.0.0" },
            children: [{ data: { Engine: "Trident_9", Browser: "IE_9", Platform: "OS_Win_2", sid: "0.0.0.0" } }],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: "Trident_4", Browser: "IE_4", sid: "0.1" },
        children: [{ data: { Engine: "Trident_11", Browser: "IE_11", Platform: "OS_Win_11", sid: "0.1.0" } }],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", sid: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", sid: "2" }, children: [], isLeaf: true },
];

<div style={{ height: "300px" }}>
  <TreeTable
    dataset={dataset}
    columns={columns}
    expandedKeys={["0"]}
    onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
    ref={(treeTable) => { /* treeTable.expandAll() 全部展开；treeTable.collapseAll() 全部折叠 */ }}
    virtualizeScroll={true}
    nodeKey={"sid"}
  />
</div>
```

### 基本属性设置

Basic Setting with Custom Icon

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", width: "50%", field: "Engine", key: "col_1" },
  { title: "Browser", width: "25%", field: "Browser", display: true, key: "col_2" },
  { title: "Platform", field: "Platform", width: "25%", key: "col_3" },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" } },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", id: "0.0.1" } },
        ],
        isLeaf: false,
      },
      { data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" }, children: [], isLeaf: false },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  expandedKeys={["0", "0.0"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  onRowClick={(row, e) => { /* row, e */ }}
  iconExpanded="image/nav-common.png" // 非叶子节点展开图标 url
  iconCollapsed="image/create-default.png" // 非叶子节点折叠图标 url
  iconLeaf="image/nav-heart-active.png" // 叶子节点图标 url
/>
```

### 冻结列宽

```jsx
import TreeTable from "eview-ui/TreeTable";

const img1 = "image/table_1.png"; // 图片 url
const img2 = "image/table_2.png"; // 图片 url

// 自定义列渲染：Browser 列根据值渲染不同图标
function renderBrowserColumn(cell) {
  if (!cell) return <div></div>;
  if (cell === "Chrome") {
    return <div><img src={img1} style={{ verticalAlign: "bottom" }} alt="Chrome" /> {cell}</div>;
  }
  return <div><img src={img2} style={{ verticalAlign: "bottom" }} alt="Active" /> {cell}</div>;
}

const columns = [
  { title: "Engine", width: "40%", field: "Engine", key: "col_1" },
  {
    title: "Browser",
    width: "30%",
    field: "Browser",
    render: (cell) => renderBrowserColumn(cell),
    tipFormatter: (cell) => cell,
    key: "col_2",
  },
  { title: "Platform", field: "Platform", width: "30%", key: "col_3" },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" } },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", id: "0.0.1" } },
        ],
        isLeaf: false,
      },
      { data: { Engine: "Trident_4", Browser: "Chrome", id: "0.1" }, children: [], isLeaf: false },
      { data: { Engine: "Trident_7", Browser: "Chrome", id: "0.2" }, children: [], isLeaf: false },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  expandedKeys={[]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  enableColumnDrag={false}
  width={"50rem"}
  height={"20rem"}
/>
```

### 树表接口 (Under devlopment)

```jsx
import TreeTable from "eview-ui/TreeTable";

const dataset = [
  {
    data: { Engine: "Trident_BBBBBBBBBBBBBBBBBBB_0", id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" } },
          { data: { Engine: "Trident_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_5", Browser: "IE_5", Platform: "OS_Win_5", id: "0.0.1" } },
        ],
        isLeaf: false,
      },
      { data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" }, children: [], isLeaf: false },
      { data: { Engine: "Trident_7", Browser: "IE_7", id: "0.2" }, children: [], isLeaf: false },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, children: [], isLeaf: true },
];

// 列宽可百分比 / 固定 px / 混合
const columns = [
  { title: "Engine", width: "50%", field: "Engine", key: "col_1" },
  { title: "Browser", width: "30%", field: "Browser", key: "col_2" },
  { title: "Platform", width: "20%", field: "Platform", key: "col_3" },
];

<div id="TreeTableBasicDiv" style={{ margin: "10px 20px", height: 250, width: "100%", overflow: "auto" }}>
  <TreeTable
    dataset={dataset}
    columns={columns}
    expandedKeys={["0", "0.0"]}
    onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
    onDoubleClick={(cell, row, e) => { /* 双击：取 row.raw.data.id，加入或移出 expandedKeys */ }}
    onRowRightClick={(e, row) => { /* e, row */ }}
    mutiSelectEnable
    enableColumnFilter
    itemOrderChanger
    showEmptyImage={true}
    ref={(table) => {
      // table.getSelected() 取选中行原始数据
      // table.getSelectedRowsIndex() 取选中行 index 数组
      // table.setSizeColumnFit(0) 按内容自适应第 0 列宽
      // table.reSetcolumnSize() 重置列宽为初始值
    }}
  />
</div>
```

### 具有cellClassNames的树表

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", field: "Engine", key: "col_1" },
  { title: "Browser", field: "Browser", key: "col_2" },
  {
    title: "Platform",
    field: "Platform",
    cellClassName: "testcellpink", // 列级 cellClassName
    isEditable: false,
    key: "col_3",
  },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    option: { Engine: { style: "testcellgreen" } }, // 行级 option：字段 → className
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        option: { Engine: { style: "testcellblue" }, Browser: { style: "testcellpink" } },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" }, option: { Browser: { style: "testcellgreen" }, Platform: { style: "testcellblue" } } },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", id: "0.0.1" }, option: { Browser: { style: "testcellpink" }, Platform: { style: "testcellred" } } },
        ],
        isLeaf: false,
      },
      { data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" }, option: { Engine: { style: "testcellpink" }, Browser: { style: "testcellred" } }, children: [], isLeaf: false },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, option: { Engine: { style: "testcellpink" } }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  expandedKeys={["0", "0.0"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
/>
```

### 自定义单元格项渲染内容

```jsx
import TreeTable from "eview-ui/TreeTable";
import LinkField from "eview-ui/LinkField";

const columns = [
  {
    title: "operation",
    field: "operation",
    render: (cellValue, rowVal) => (
      <LinkField
        text={"showTime"}
        onClick={() => { /* 业务回调 */ }}
        style={{ marginRight: "20px" }}
      />
    ),
    key: "col_1",
  },
  { title: "Engine", field: "Engine", key: "col_2" },
  {
    title: "Browser",
    field: "Browser",
    render: (cellValue, rowVal) => {
      if (rowVal[0] === "Trident_2") {
        return <div style={{ color: "red" }}>{"Custom render"}</div>;
      }
      return cellValue || "";
    },
    key: "col_3",
  },
  {
    title: "Platform",
    field: "Platform",
    cellClassName: "testcellpink",
    isEditable: false,
    key: "col_4",
  },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" } },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", id: "0.0.1" } },
        ],
        isLeaf: false,
      },
      { data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" }, children: [], isLeaf: false },
      { data: { Engine: "Trident_7", Browser: "IE_7", id: "0.2" }, children: [], isLeaf: false },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  expandedKeys={["0", "0.0"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  expandColumnID={2}
/>
```

### Tree Table Column Selection & Percentage width (under dev)

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", width: "50%", field: "Engine", key: "hide1", isMovable: false },
  { title: "Browser", width: "30%", field: "Browser", key: "hide2" },
  { title: "Platform", width: "20%", field: "Platform", key: "hide3" },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" } },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", id: "0.0.1" } },
        ],
        isLeaf: false,
      },
      { data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" }, children: [], isLeaf: false },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, children: [], isLeaf: true },
];

<div id="TreeTableBasicDiv" style={{ margin: "10px 20px", height: 250, width: 800 }}>
  <TreeTable
    dataset={dataset}
    columns={columns}
    expandedKeys={["0", "0.0"]}
    onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
    enableColumnFilter
    itemOrderChanger
  />
</div>
```

### 自定义行高

通过将 `customRowStyle` 设置表格body行高, 通过将 `headerStyle` 设置表头行高。
如果行高设置过大或者过小，导致样式异常，业务自行适配。

```jsx
import TreeTable from "eview-ui/TreeTable";

const columns = [
  { title: "Engine", field: "Engine", key: "col_1" },
  { title: "Browser", field: "Browser", key: "col_2" },
  {
    title: "Platform",
    field: "Platform",
    cellClassName: "testcellpink",
    isEditable: false,
    key: "col_3",
  },
];

const dataset = [
  {
    data: { Engine: "Trident_0", id: "0" },
    option: { Engine: { style: "testcellgreen" } },
    children: [
      {
        data: { Engine: "Trident_1", Browser: "IE_1", id: "0.0" },
        option: { Engine: { style: "testcellblue" }, Browser: { style: "testcellpink" } },
        children: [
          { data: { Engine: "Trident_2", Browser: "IE_2", Platform: "OS_Win_2", id: "0.0.0" }, option: { Browser: { style: "testcellgreen" }, Platform: { style: "testcellblue" } } },
          { data: { Engine: "Trident_5", Browser: "IE_5", Platform: "OS_Win_5", id: "0.0.1" }, option: { Browser: { style: "testcellpink" }, Platform: { style: "testcellred" } } },
        ],
        isLeaf: false,
      },
      { data: { Engine: "Trident_4", Browser: "IE_4", id: "0.1" }, option: { Engine: { style: "testcellpink" }, Browser: { style: "testcellred" } }, children: [], isLeaf: false },
    ],
    isLeaf: false,
  },
  { data: { Engine: "Trident_3", id: "1" }, children: [], isLeaf: true },
  { data: { Engine: "Trident_6", id: "2" }, option: { Engine: { style: "testcellpink" } }, children: [], isLeaf: true },
];

<TreeTable
  dataset={dataset}
  columns={columns}
  expandedKeys={["0", "0.0"]}
  onNodeExpand={(id, expandedKeys, expanded) => { /* 取 id/expandedKeys 更新 expandedKeys */ }}
  customRowStyle={{ height: 32 }} // body 行高
  headerStyle={{ height: 32 }} // 表头行高
/>
```
