# TreeTable 树表

> 分类：数据展示

`TreeTable` 组件和 `Table` 组件的功能相近，但 `TreeTable` 注重于层级数据的展示。

## API

| 方法名      | 描述                                                                          | 参数 | 返回值 |
| ----------- | ----------------------------------------------------------------------------- | ---- | ------ |
| getSelected | 单击选中行原始数据(若无选中项，则为空数组) : {key1: value1, key2: value2 ...} | 无   | array  |
| setSizeColumnFit       | Set the specified column to Fit according to width of largest column value.                                          | id          | None   |
| reSetcolumnSize        | reset the column width to orginal value                                                                              | None        | None   |
|getSelectedRowsIndex | selected row indexes|None|array|
|getCheckedRowsDataIds | Get the Row checked Ids|None|array|
|setCheckedRowsDataIds | Set the Checked Rows|array|None|
| expandAll | 树表全部变为展开状态 | 无   | 无  |
| collapseAll | 树表全部变为折叠状态 | 无   | 无  |
| setScrollBarAt | 设置表格纵向滚动条的位置(只在设定了表格height的场景下起作用) | id | none |


### 属性

| 属性名称                      | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 输入 | 默认 |
|:--------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----|:-----|
| id                        | 表格的唯一标示编号，未指定则自动生成                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | string |  |
| className                 | By customizing the class to add user-defined style，You can control the entire component of the overall style（Outermost div） The following is an example：margin, padding                                                                                                                                                                                                                                                                                                                                                    | string |  |
| height                    | TreeTable组件的高度（像素）. This height is applicable to table Body part, Excluding the Table Header & Scroll Bar.                                                                                                                                                                                                                                                                                                                                                                                                                 | number |  |
| maxHeight                 | TreeTable maximum height that can be claimed by the component.<br>If `maxHeight` (in pixels)  is configured, treetable height is adjusted depending upon the content and maximum height for treetable becomes the `maxHeight` provided by the user.<br>Note: When `maxHeight` is configured then `height` should not be configured.                                                                                                                                                                                        | number |  |
| width                     | TreeTable组件的宽度（像素）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | number |  |
| nodeKey                   | 定义作为id的字段名，默认为'id'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | string | 'id' |
| expandedKeys              | 展开节点的id数组，例如：['step_31', 'step_95']                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | array | [] |
| columns                   | 头部的列和列头定义数据类型描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | array | [] |
| dataset                   | 行数据：带层级关系的Object数组 [           {             data: { fieldname1: value1, fieldname2: value2 },  option: { fieldname1: { style: 'cellClassName1', ... }, fieldname2: { style: 'cellClassName2', ... } },            children: [和dataset结构相同的数组],             isLeaf: true, // 声明这个节点是否为叶子节点           }        ] <br>Note: User can provide any property in the option field specific to the cell of that row. Be careful in using the style property, it should not override default styles which may upset the component. | array | [] |
| style                     | TreeTable组件外层div样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | object |  |
| tableStyle                | TreeTable组件内部table样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | object |  |
| headerStyle               | TreeTable组件表头样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | object |  |
| onRowClick                | 行选中事件回调<br><br>**签名:**<br>`function(row: Object, e: Object) => void`<br>*row:* 行对象<br>*e:* 原生点击事件                                                                                                                                                                                                                                                                                                                                                                                                                          | function |  |
| onRowCheck                | 树表体选中事件回调<br><br>**签名:**<br>`function(row: Object, checkedRows: array, e: Object) => void`<br>*row:* 行对象<br>*checkedRows:* 选中行的集合数组<br>*e:* 原生点击事件                                                                                                                                                                                                                                                                                                                                                                         | function |  |
| onHeaderCheck             | 树表头选中事件回调<br><br>**签名:**<br>`function(checkedRowsRef: array, e: Object) => void`<br>*checkedRowsRef:* 选中行的集合数组<br>*e:* 原生点击事件                                                                                                                                                                                                                                                                                                                                                                                              | function |  |
| onNodeExpand              | 点击展开/收起的时候的回调函数<br><br>**签名:**<br>`function(rowId: Number, expandedKeys: Array, expanded: Boolean) => void`<br>*rowId:* Table行id<br>*expandedKeys:* 已展开的id数组<br>*expanded:* 展开状态                                                                                                                                                                                                                                                                                                                                           | function |  |
| enableColumnDrag          | 支持表头列宽可拖拽                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | bool | true |
| selectedRowKey            | 设置选中主键值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | array |  |
| unmodifiableRowIds        | 设置状态不可变的节点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | array | [] |
| rowStyle                  | 表体内容样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | object |  |
| onColumnSizeChange        | On Cloumn size change callback.<br><br>**Signature:**<br>`function(column: Object) => void`<br>*column:* column object                                                                                                                                                                                                                                                                                                                                                                                                     |function|null|
| onRowRightClick           | 右击事件回调函数.<br><br>**Signature:**<br>`function(e: Object, row: Object) => void`<br>*e:* Native click event<br>*row:* Line object                                                                                                                                                                                                                                                                                                                                                                                             | function |  |
| itemOrderChanger          | 	Display the item order changer in column selector, Item can be Up and Down.                                                                                                                                                                                                                                                                                                                                                                                                                                               | bool     |false|
| mutiSelectEnable          | 	if true the multi select using control+click is supported .                                                                                                                                                                                                                                                                                                                                                                                                                                                               | bool     |false|
| enableCheckBox            | 	Enable the check supports check boxes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | bool     |false|
| disabelCheckAssociated    | CheckBox勾选/去勾选时，禁止父节点和子节点联动                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | bool | false |
| iconLeaf                  | 通过传入url的方式定义组件内部叶子节点图标,需配合iconExpanded和iconCollapsed一起使用 <br/>图片建议尺寸 16px*16px                                                                                                                                                                                                                                                                                                                                                                                                                                             | string |  |
| iconExpanded              | 通过传入url的方式定义组件非叶子节点展开时的图标,需配合iconLeaf和iconCollapsed一起使用 <br/>图片建议尺寸 16px*16px                                                                                                                                                                                                                                                                                                                                                                                                                                              | string |  |
| iconCollapsed             | 通过传入url的方式定义组件非叶子节点关闭时的图标,需配合iconLeaf和iconExpanded一起使用 <br/>图片建议尺寸 16px*16px                                                                                                                                                                                                                                                                                                                                                                                                                                               | string |  |
| enableColumnFilter        | 开启列筛选，支持表头隐藏、表头排序                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | bool | false |
| onFilterOkClick           | Double select OK click  callback.<br><br>**Signature:**<br>`function(leftItems: Object, rightItems: Object) => void`<br>*leftItems:* Line object <br>*rightItems:* Line object                                                                                                                                                                                                                                                                                                                                             | function |  |
| onDoubleClick             | Double Click event callback.<br><br>**Signature:**<br>`function(cell:Object, row: Object,e: Object) => void`<br>*e:* Native click event<br>*row:* Line object <br>*cell:* Line object                                                                                                                                                                                                                                                                                                                                      | function |  |
| onColumnSort              | 排序点击事件<br><br>**签名:**<br>`function(sortColumn: Object, sortType: string) => void`<br>*sortColumn:* 排序列<br>*sortType:* 排序方式                                                                                                                                                                                                                                                                                                                                                                                                 | function | null |
| enableOriginSort          | 是否启用初始排序                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | bool     |false|
| expandColumnID            | 展开收缩图标在哪一列渲染                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | number     |0|
| columnFilterMountId       | 支持设置列选择弹出框挂载DOM的Id，默认挂在body上                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | string    | body |
| disableHeaderCheckbox     | 是否禁用表头复选框                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |bool     |false|
| customRowStyle            | 表格所有行样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Object | |
| enablePagination          | 开启分页                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | bool | false |
| recordCount               | 总记录数                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | number | 0 |
| recordCountDisp           | Used in display of Total Record instead of recordCount. Note : Total number of page calculation will be based on recordCount                                                                                                                                                                                                                                                                                                                                                                                               | string |  |
| pageSize                  | 表格可展示的根节点数                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | number | 10 |
| currentPage               | 当前页码                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | number | 1 |
| pageSizeOptions           | 分页选项 [10, 20, 50, 100]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | array | [10, 20, 50, 100] |
| pagingType                | 分页类型：下拉或数字('list','select')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | string | 'list' |
| splitPagination           | 如果为“true”，则将分页切换到右侧                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | bool | true |
| paginationPopupDirection  | Defines the direction of the popup in the pagination page size selection control                                                                                                                                                                                                                                                                                                                                                                                                                                           |  'top' 'bottom' | |
| pagingSelectWidth         | 自定义分页中Select下拉菜单的宽度                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |  string | |
| pagingProps               | Paging子组件的props, 详情请查阅Paging的API                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | object | |
| isRequiredToUpdateColumns | 是否更新columns。如果设置为true，不会保存之前的列状态，由业务组自己维护列状态。<br>特殊场景：如果设置为 [["width"]]，表示列宽度将由组件维护保存，此时外部重新设置的列宽将不起作用。                                                                                                                                                                                                                                                                                                                                                                                                                    | bool或[["width"]] | false |
| checkType                 | 设置勾选框类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 'single' 'multi' | 'multi' |
| defaultColumns            | 设置表格重置的默认值, 数组中传入columns中key值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | array | |
| useCustomToolTip          | 启用自定义提示框，代替浏览器提示框。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | bool |false|
| disableEviewSort          | 	如果业务组不希望使用组件的默认排序能力，可使用该属性。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | bool     |false|

## 属性详情

> 列   `<a id="columns"></a>`

| 定义         | 输入     | 默认      | 描述
|--------------|-------------------- |--------|
| align        |string   | 'center'  | 列对齐支持：left，center，right |
| display      | bool    |  true   | 此列是否显示开关 |
| field        |  string |           |建议与数据库的字段名称一致 |
| options      |  object |   '{}'    | 需要建立编辑列表渲染的其他参数根据呈现类型'设置如下图所示  |
| render       |  function |   '(cellVaule, rowDatas, options, row) => ${cellVaule} Year'    | 自定义此列单元格中的显示内容和样式。|
| tipFormatter |  function       |   'v => ${v.age} Year' | 自定义光标在小区显示内容 |
| title        |  string |            | 必配,主题 |
| width        |  number |            | colounm宽度(像素)|
| isMovable    |  bool   |  true    | 表头顺序是否可调整的开关 |
| cid          |   string |              | 这是唯一id列|
| validator    | function |              | 表头调整面板中的校验器 |
| displayPolicy | string   |   'never'   | 如果此属性设置为'不'与该列显示false不会向用户显示在任何一点也不过滤对话框中。但此属性必须配合用户显示错误还会有不良影响列显示。|
| cellClassName |  string  | 'classnameforcellsofthiscolumn' |  它可以用来设置rowcells classname的特定列 |
| key           |   object  |              | 列数据的唯一标识， 必须传入 |

### Shortcut Keys

| Opration            | Shortcut Keys   |
| --------------      | ----------- | ------ | ------------------------------------------------------------------------------------------------|
| Tab                 | setFocus to the first header cell.Using tab key you set focus to next cell  |
| ctrl+End            | Focus Moved Out of the Table |
| space or Enter      | To select the checkBox |
| RightArrow          | Focus moves to the right side cell |
| LeftArrow           | Focus moves to the left side cell  |
| UpArrow             | Focus moves to the upper cell |
| DownArrow           | Focus moves to the down cell |
| shift+F             | To open the column filter dialog  |
| Esc                 | To dispose the filter dialog  |
| Enter               | To expand or collapse Tree Column  |
| ctrl+Home           | To get focus to the first table header element. |

## 接口定义

```typescript
import type { MouseEventHandler } from 'react';

interface TreeTable {

  /**
   * 表格的唯一标示编号，未指定则自动生成
   */
  id: string;

  /**
   * 定义作为id的字段名，默认为'id'
   */
  nodeKey: string;

  /**
   * 展开节点的id数组，例如：['step_31'; 'step_95']
   */
  expandedKeys: string[];

  /**
   * 列表头及列类型说明
   * 列表头定义数据，如：
   * <br>
   * [{
   * <br>&nbsp;align: 'center'; // 可选，列对齐设置，支持：`left` ; `center`; `right`
   * <br>&nbsp;display: true; // 选填，列显示开关，支持：true，false，默认为 true
   * <br>&nbsp;renderType: 'progress_bar';'custom'; // 选填，容器类型，提供枚举
   * <br>&nbsp;getCompareValue: v => v; // 选填，排序参数提取（后有说明）
   * <br>&nbsp;field: 'state'; // 选填，一般建议与数据库字段名保持一致
   * <br>&nbsp;options: {}; // 选填，当自定义renderType为某些类型的时候必填，详情见下方
   * <br>&nbsp;render: (v; r) => `${v.age}岁`; // 选填，自定义展现在td中的内容
   * <br>&nbsp;tipFormatter: v => `${v.age}岁`; // 选填，自定义鼠标悬浮在单元格上时显示的内容（若数据为非文本或不可直接转为文本则必填）
   * <br>&nbsp;title: 'State'; // 必填，标题
   * <br>&nbsp;width: 230; // 选填，宽度（像素），不填则自适应。
   * <br>
   * }]
   */
  columns: any;

  /**
   * 行数据：带层级关系的Object数组
   * [
   {
   data: { fieldname1: value1; fieldname2: value2 };
   children: [和dataset结构相同的数组];
   isLeaf: true; // 声明这个节点是否为叶子节点
   }
   ]
   */
  dataset: any;

  /**
   * TreeTable组件外层div样式
   */
  style: object;

  /**
   * TreeTable组件内部table样式
   */
  tableStyle: object;

  /**
   * Table组件的高度（像素）
   */
  height: string | number;

  /**
   * 是否开启初始排序状态
   */
  enableOriginSort: boolean;

  /**
   * 排序点击事件
   *
   * @param {string} sortColumn 排序列
   * @param {string} sortType 排序方式
   */
  onColumnSort: any;

  /**
   * TreeTable maximum height that can be claimed by the component.
   * If `maxHeight` (in pixels)  is configured; treetable height is adjusted depending upon the content and maximum
   * height for treetable becomes the `maxHeight` provided by the user.
   * Note: When `maxHeight` is configured then `height` should not be configured or it must be more then `height`
   */
  maxHeight: number;

  /**
   * Table组件的宽度（像素）
   */
  width: string | number;

  /**
   *  树表选中行的自定义背景色class名称
   */
  selectedRowBgcCls: string;

  /**
   * 行选中事件回调
   *
   * @param {Object} row 行对象
   * @param {Object} e 原生点击事件
   */
  onRowClick: (row: any, e: MouseEvent) => unknown;

  /**
   * 表表体行选中事件回调
   * @param {Object} row 行对象
   * @param {Array} checkedRows 行对象选中集合
   * @param {Object} e 原生点击事件
   */
  onRowCheck: (row: any, checkedRows: string[], e: MouseEvent) => unknown;

  /**
   * 表头行选中事件回调
   *
   * @param {Array} checkedRowsRef 行对象选中集合
   * @param {Object} e 原生点击事件
   */
  onHeaderCheck: (checkedRowsRef: unknown[], e: MouseEvent) => unknown;

  /**
   * 点击展开/收起的时候的回调函数
   *
   * @param {Number} rowId Table行id
   * @param {Array} expandedKeys 已展开的id数组
   * @param {Boolean} expanded 展开状态
   */
  onNodeExpand: (rowId: number, expandedKeys: string[], expanded: boolean) => unknown;

  /**
   * 开启拖动
   */
  enableColumnDrag: boolean;

  /**
   * 设置选中主键值
   */
  selectedRowKey: string[];

  /**
   * 内容行样式
   */
  rowStyle: object;

  /**
   *  if true the multi select using ctrl+click is supported .
   *  if false multi select is not supported.
   */
  mutiSelectEnable: boolean;

  /**
   * to enable the check box for each row .
   */
  enableCheckBox: boolean;

  /**
   * 取消父节点和子节点复选框勾选/去勾选联动
   */
  disabelCheckAssociated: boolean;

  /**
   * 指定内容不可修改的行
   */
  unmodifiableRowIds: string[];

  /**
   * @param {Object} column details of column .
   */
  onColumnSizeChange: (columns: any) => unknown;

  /**
   * Double click event.
   *
   */
  onDoubleClick: (evtCel: any, evtRow: any, event: MouseEvent) => unknown;

  showEmptyImage: boolean;

  iconLeaf: string;

  iconExpanded: string;

  iconCollapsed: string;

  isLeaf: boolean;

  iconLeafClass: string;

  iconExpandedClass: string;

  iconCollapsedClass: string;

  virtualizeScroll: boolean;

  expandColumnID: number;

  /**
   * 拖动列宽度时保持表格整体宽度不变
   */
  keepTableWidthAfterDragging: boolean;

  /**
   * 支持设置列选择弹出框挂载DOM的Id，默认挂在body上
   */
  columnFilterMountId: string;

  /**
   * 分页点击回调
   *
   * @param {num} currentPage 当前页的序号
   */
  onPageChange: (num: number) => unknown;

  /**
   * 分页尺寸点击回调
   *
   * @param {num} pageSize 表格页面可容纳行数
   */
  onPageSizeChange: (num: number) => unknown;

  /**
   * 表格可展示行数：是 pageSizeOptions 的第 0 个元素
   */
  pageSize: number;

  /**
   * 总记录数
   */
  recordCount: number;

  /**
   * 当前页码
   */
  currentPage: number;

  /**
   * 分页选项
   *
   * [10; 20; 50]
   */
  pageSizeOptions: number[];

  /**
   * 分页类型：数字列表或下拉框（'list'; 'select', 'simple'）
   */
  pagingType: string;

  /**
   * 分页切换的位置: 设置true将切换到右侧
   */
  splitPagination: boolean;

  /**
   * Defines the direction of the popup in the pagination page size selection control
   */
  paginationPopupDirection: 'top' | 'bottom';

  /**
   * To set width of select in paging
   */
  pagingSelectWidth: string;

  /**
   * 是否禁用表头复选框
   */
  disableHeaderCheckbox: boolean;

  /**
   * 设置表格的行样式
   */
  customRowStyle: object;

  /**
   * 设置表格是否分页
   */
  enablePagination: boolean;

  /**
   * Paging子组件的props; 详情请查阅Paging的API
   */
  pagingProps: object;

  /**
   * useCustomToolTip; 使用自定义 Tooltip 代替 tip
   */
  useCustomToolTip: boolean;

  /**
   * 禁用组件排序能力
   */
  disableEviewSort: boolean;

}

interface TreeTableHeader {
  groupHeaders: any;
  columns: any;
  handleMouseMove: MouseEventHandler<HTMLTableHeaderCellElement>;
  handleMouseDown: MouseEventHandler<HTMLTableHeaderCellElement>;
}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const columns = [
  {
    title: 'Engine',
    width: '25%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  },
  {
    title: 'Progress',
    field: 'Progress',
    renderType: TreeTable.ColumnRenderType.PROGRESS_BAR,
    options: {
      format: 'percent'
    },
    width: '25%',
    key: 'col_4',
  }
];
const dataset = [
  {
    data: { Engine: 'Trident_0', Progress: 3, id: '0' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', Progress: 2, id: '0.0' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              Progress: 6,
              id: '0.0.0'
            }
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              Progress: 9,
              id: '0.0.1'
            }
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              Progress: 4,
              id: '0.0.2'
            }
          }
        ],
        isLeaf: false
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', Progress: 3, id: '0.1' },
        children: [],
        isLeaf: false
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', Progress: 3, id: '0.2' },
        children: [],
        isLeaf: false
      }
    ],
    isLeaf: false
  },
  {
    data: { Engine: 'Trident_3', Progress: 6, id: '1' },
    children: [],
    isLeaf: true
  },
  {
    data: { Engine: 'Trident_6', Progress: 2, id: '2' },
    children: [],
    isLeaf: true
  }
];
export default class TreeTableBasic extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      dataSet:dataset,
      expandedKeys: ['0', '0.0'],
      columns:columns
    };
  }

  handleChangePage = (currentPage) => {
    this.setState({ currentPage });
  };

  handleRowClick=(row,e)=>
  {
    this.state = {
      dataSet:dataset,
      columns:columns
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          onRowClick={this.handleRowClick}
          onPageChange={this.handleChangePage}
          currentPage={this.state.currentPage}
          recordCount={3}
          enablePagination
          pageSize={2}
          pageSizeOptions={[2, 4, 6]}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableBasic />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const columns = [
  {
    title: 'Engine',
    width: '25%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  },
  {
    title: 'Progress',
    field: 'Progress',
    renderType: TreeTable.ColumnRenderType.PROGRESS_BAR,
    options: {
      format: 'percent'
    },
    width: '25%',
    key: 'col_4',
  }
];
const dataset = [
  {
    data: { Engine: 'Trident_0', Progress: 3, id: '0' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', Progress: 2, id: '0.0' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              Progress: 6,
              id: '0.0.0'
            }
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              Progress: 9,
              id: '0.0.1'
            }
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              Progress: 4,
              id: '0.0.2'
            }
          }
        ],
        isLeaf: false
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', Progress: 3, id: '0.1' },
        children: [],
        isLeaf: false
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', Progress: 3, id: '0.2' },
        children: [],
        isLeaf: false
      }
    ],
    isLeaf: false
  },
  {
    data: { Engine: 'Trident_3', Progress: 6, id: '1' },
    children: [],
    isLeaf: true
  },
  {
    data: { Engine: 'Trident_6', Progress: 2, id: '2' },
    children: [],
    isLeaf: true
  }
];
export default class TreeTableBasic extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      dataSet:dataset,
      expandedKeys: ['0', '0.0'],
      columns:columns
    };
  }

  handleChangePage = (currentPage) => {
    this.setState({ currentPage });
  };

  handleRowClick=(row,e)=>
  {
    this.state = {
      dataSet:dataset,
      columns:columns
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          onRowClick={this.handleRowClick}
          onPageChange={this.handleChangePage}
          currentPage={this.state.currentPage}
          recordCount={3}
          enablePagination
          pageSize={2}
          pageSizeOptions={[2, 4, 6]}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableBasic />, mountNode);

```

### Tree Table MultiSelect

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  },
];
const dataset = [
  {
    data: { Engine: 'Trident_0', id: '0' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              id: '0.0.0',
            },
            children: [
              {
                data: {
                  Engine: 'Trident_9',
                  Browser: 'IE_9',
                  Platform: 'OS_Win_2',
                  id: '0.0.0.0',
                },
                children: [
                  {
                    data: {
                      Engine: 'Trident_12',
                      Browser: 'IE_12',
                      Platform: 'OS_Win_12',
                      id: '0.0.0.0.0',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_13',
                      Browser: 'IE_13',
                      Platform: 'OS_Win_13',
                      id: '0.0.0.0.1',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_14',
                      Browser: 'IE_14',
                      Platform: 'OS_Win_14',
                      id: '0.0.0.0.2',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_15',
                      Browser: 'IE_15',
                      Platform: 'OS_Win_15',
                      id: '0.0.0.0.3',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_16',
                      Browser: 'IE_16',
                      Platform: 'OS_Win_16',
                      id: '0.0.0.0.4',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_17',
                      Browser: 'IE_17',
                      Platform: 'OS_Win_17',
                      id: '0.0.0.0.5',
                    },
                  },
                ],
                isLeaf: false,
              },
              {
                data: {
                  Engine: 'Trident_10',
                  Browser: 'IE_10',
                  Platform: 'OS_Win_10',
                  id: '0.0.0.1',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              id: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              id: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            id: '0.1.0',
          },
          isLeaf: true,
        },
        {
          data: {
            Engine: 'Trident_12',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            id: '0.1.1',
          },
          isLeaf: true,
        }],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
        children: [],
        isLeaf: true,
      },
    ],
    isLeaf: false,
  },
  {
    data: { Engine: 'Trident_3', id: '1' },
    children: [],
    isLeaf: true,
  },
  {
    data: { Engine: 'Trident_6', id: '2' },
    children: [],
    isLeaf: true,
  },
];

export default class TreeTableMultiSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet: dataset,
      expandedKeys: ['0', '0.1'],
      columns: columns,
      msg: '',
      selectedRowKey: []
    };
  }



  handleRowClick = (row, e) => {
    this.setState({ msg: 'handleRowClick' });
  }
  getCheckedRowsDataIds = () => {
    this.setState({ msg: this.treeTable.getCheckedRowsDataIds().join(' , ') });
  }
  setCheckedRowsDataIds = () => {
    let ids = ['0.1', '0.2']
    this.treeTable.setCheckedRowsDataIds(ids);
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}
          disableRowIds={['0.1']}
          enableCheckBox
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          onRowClick={this.handleRowClick}
          selectedRowKey={this.state.selectedRowKey}
          ref={treeTable => this.treeTable = treeTable}
        />
        <div style={{ padding: '10px' }}>
          <Button text="getCheckedRowsDataIds" onClick={this.getCheckedRowsDataIds} style={{ marginRight: "80px" }} />
          <Button text="setCheckedRowsDataIds" onClick={this.setCheckedRowsDataIds} />
        </div>
        {this.state.msg && <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableMultiSelect />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  },
];
const dataset = [
  {
    data: { Engine: 'Trident_0', id: '0' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              id: '0.0.0',
            },
            children: [
              {
                data: {
                  Engine: 'Trident_9',
                  Browser: 'IE_9',
                  Platform: 'OS_Win_2',
                  id: '0.0.0.0',
                },
                children: [
                  {
                    data: {
                      Engine: 'Trident_12',
                      Browser: 'IE_12',
                      Platform: 'OS_Win_12',
                      id: '0.0.0.0.0',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_13',
                      Browser: 'IE_13',
                      Platform: 'OS_Win_13',
                      id: '0.0.0.0.1',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_14',
                      Browser: 'IE_14',
                      Platform: 'OS_Win_14',
                      id: '0.0.0.0.2',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_15',
                      Browser: 'IE_15',
                      Platform: 'OS_Win_15',
                      id: '0.0.0.0.3',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_16',
                      Browser: 'IE_16',
                      Platform: 'OS_Win_16',
                      id: '0.0.0.0.4',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_17',
                      Browser: 'IE_17',
                      Platform: 'OS_Win_17',
                      id: '0.0.0.0.5',
                    },
                  },
                ],
                isLeaf: false,
              },
              {
                data: {
                  Engine: 'Trident_10',
                  Browser: 'IE_10',
                  Platform: 'OS_Win_10',
                  id: '0.0.0.1',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              id: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              id: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            id: '0.1.0',
          },
          isLeaf: true,
        },
        {
          data: {
            Engine: 'Trident_12',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            id: '0.1.1',
          },
          isLeaf: true,
        }],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
        children: [],
        isLeaf: true,
      },
    ],
    isLeaf: false,
  },
  {
    data: { Engine: 'Trident_3', id: '1' },
    children: [],
    isLeaf: true,
  },
  {
    data: { Engine: 'Trident_6', id: '2' },
    children: [],
    isLeaf: true,
  },
];

export default class TreeTableMultiSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet: dataset,
      expandedKeys: ['0', '0.1'],
      columns: columns,
      msg: '',
      selectedRowKey: []
    };
  }



  handleRowClick = (row, e) => {
    this.setState({ msg: 'handleRowClick' });
  }
  getCheckedRowsDataIds = () => {
    this.setState({ msg: this.treeTable.getCheckedRowsDataIds().join(' , ') });
  }
  setCheckedRowsDataIds = () => {
    let ids = ['0.1', '0.2']
    this.treeTable.setCheckedRowsDataIds(ids);
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}
          disableRowIds={['0.1']}
          enableCheckBox
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          onRowClick={this.handleRowClick}
          selectedRowKey={this.state.selectedRowKey}
          ref={treeTable => this.treeTable = treeTable}
        />
        <div style={{ padding: '10px' }}>
          <Button text="getCheckedRowsDataIds" onClick={this.getCheckedRowsDataIds} style={{ marginRight: "80px" }} />
          <Button text="setCheckedRowsDataIds" onClick={this.setCheckedRowsDataIds} />
        </div>
        {this.state.msg && <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableMultiSelect />, mountNode);

```

### 树表多选checkedRow

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import DivMessage from 'eview-ui/DivMessage';
import LinkField from 'eview-ui/LinkField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const dataset = [
    {
        data: { Engine: 'Trident_0', sid: 'root' },
        children: [
            {
                data: { Engine: 'Trident_1', Browser: 'IE_1', sid: 'Node_1' },
                children: [
                    {
                        data: {
                            Engine: 'Trident_2',
                            Browser: 'IE_2',
                            Platform: 'OS_Win_2',
                            sid: 'Node_2',
                        },
                        children: [],
                        isLeaf: true,
                    },
                    {
                        data: {
                            Engine: 'Trident_5',
                            Browser: 'IE_5',
                            Platform: 'OS_Win_5',
                            sid: 'Node_5',
                        },
                        isLeaf: true,
                    },
                    {
                        data: {
                            Engine: 'Trident_8',
                            Browser: 'IE_8',
                            Platform: 'OS_Win_8',
                            sid: 'Node_8',
                        },
                        isLeaf: true,
                    }
                ],
                isLeaf: false,
            },
            {
                data: { Engine: 'Trident_4', Browser: 'IE_4', sid: 'Node_4' },
                children: [
                    {
                        data: {
                            Engine: 'Trident_11',
                            Browser: 'IE_11',
                            Platform: 'OS_Win_11',
                            sid: 'Node_11',
                        },
                        isLeaf: true,
                    },
                    {
                        data: {
                            Engine: 'Trident_12',
                            Browser: 'IE_11',
                            Platform: 'OS_Win_11',
                            sid: 'Node_12',
                        },
                        isLeaf: true,
                    }
                ],
                isLeaf: false,
            },
            {
                data: { Engine: 'Trident_7', Browser: 'IE_7', sid: 'Node_7' },
                children: [],
                isLeaf: true,
            },
        ],
        isLeaf: false,
    },
    {
        data: { Engine: 'Trident_3', sid: 'Node_3' },
        children: [],
        isLeaf: true,
    },
    {
        data: { Engine: 'Trident_6', sid: 'Node_6' },
        children: [],
        isLeaf: true,
    }
];
export default class TreeTablecheckedRows extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet: dataset,
      expandedKeys: ['root', 'Node_4'],
      msg: '',
      checkedRows: []
    };


  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
        if (expanded) {
            expandedKeys = expandedKeys.filter(expId => expId !== id);
            this.setState({
                expandedKeys,
            });
        } else {
            expandedKeys.push(id);
            this.setState({
                expandedKeys,
            });
        }
  };


  handleRowDelete = (cellValue) => {
      const rowId = cellValue;
      const { dataSet, checkedRows } = this.state;
      this.deleteDataByRowId(dataSet, rowId);
      this.deleteCheckedRowsByRowId(checkedRows, rowId);
      this.setState({dataSet}, () => {
        this.setState({
            ...this.state,
            msg: '删除行成功！',
            checkedRows,
        })
      });
  }

  deleteCheckedRowsByRowId = (checkedRows, rowId) => {
    const len = checkedRows.length;
    for (let index = 0; index < len; index++) {
        const checkId = checkedRows[index];
        if (checkId === rowId) {
            checkedRows.splice(index, 1);
            break;
        }
    }
  }


  deleteDataByRowId = (dataSet, rowId) => {
    const nodeKey = 'sid';
    const deleteNode = (treeDataArr) => {
        const len = treeDataArr.length;
        for (let index = 0; index < len; index++) {
            const treeNode = treeDataArr[index];
            if (treeNode.data[nodeKey] === rowId ) {
                treeDataArr.splice(index, 1);
                break;
            } else {
                if (Array.isArray(treeNode.children) && treeNode.children.length) {
                    deleteNode(treeNode.children);
                }
            }
        }

    }
    deleteNode(dataSet);
  }

  onRowCheck = (row, checkedRows) => {
    this.setState({
        checkedRows
    })
  }
  onHeaderCheck = (checkedRowsRef) => {
    this.setState({
        checkedRows: checkedRowsRef,
    })
  }

  render() {
    const [version, theme] = getDemoVersion();
    const columns = [
        {
            title: 'operation',
            field: 'sid',
            width: '15%',
            render: (cellValue) => {
              return (
                <div>
                  <LinkField onClick={ (e) => {this.handleRowDelete(cellValue)} } text={'delete'} disabled={false} style={{ marginRight: '20px' }} />
                </div>
              );
            },
            key: 'col_1',
        },
        {
            title: 'Engine',
            width: '35%',
            field: 'Engine',
            key: 'col_2',
        },
        {
            title: 'Browser',
            width: '25%',
            field: 'Browser',
            display: true,
            key: 'col_3',
        },
        {
            title: 'Platform',
            field: 'Platform',
            width: '25%',
            key: 'col_4',
        }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
            dataset={this.state.dataSet}
            columns={columns}
            enableCheckBox
            disabelCheckAssociated
            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            onRowCheck={this.onRowCheck}
            onHeaderCheck={this.onHeaderCheck}
            ref={treeTable => this.treeTable = treeTable}
            nodeKey={'sid'}
            expandColumnID={1}
        />

        <span style={{color: '#000'}}>
            {`checkedRows:  [${this.state.checkedRows.toString()}]`}
        </span>
        {this.state.msg && <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTablecheckedRows />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import DivMessage from 'eview-ui/DivMessage';
import LinkField from 'eview-ui/LinkField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const dataset = [
    {
        data: { Engine: 'Trident_0', sid: 'root' },
        children: [
            {
                data: { Engine: 'Trident_1', Browser: 'IE_1', sid: 'Node_1' },
                children: [
                    {
                        data: {
                            Engine: 'Trident_2',
                            Browser: 'IE_2',
                            Platform: 'OS_Win_2',
                            sid: 'Node_2',
                        },
                        children: [],
                        isLeaf: true,
                    },
                    {
                        data: {
                            Engine: 'Trident_5',
                            Browser: 'IE_5',
                            Platform: 'OS_Win_5',
                            sid: 'Node_5',
                        },
                        isLeaf: true,
                    },
                    {
                        data: {
                            Engine: 'Trident_8',
                            Browser: 'IE_8',
                            Platform: 'OS_Win_8',
                            sid: 'Node_8',
                        },
                        isLeaf: true,
                    }
                ],
                isLeaf: false,
            },
            {
                data: { Engine: 'Trident_4', Browser: 'IE_4', sid: 'Node_4' },
                children: [
                    {
                        data: {
                            Engine: 'Trident_11',
                            Browser: 'IE_11',
                            Platform: 'OS_Win_11',
                            sid: 'Node_11',
                        },
                        isLeaf: true,
                    },
                    {
                        data: {
                            Engine: 'Trident_12',
                            Browser: 'IE_11',
                            Platform: 'OS_Win_11',
                            sid: 'Node_12',
                        },
                        isLeaf: true,
                    }
                ],
                isLeaf: false,
            },
            {
                data: { Engine: 'Trident_7', Browser: 'IE_7', sid: 'Node_7' },
                children: [],
                isLeaf: true,
            },
        ],
        isLeaf: false,
    },
    {
        data: { Engine: 'Trident_3', sid: 'Node_3' },
        children: [],
        isLeaf: true,
    },
    {
        data: { Engine: 'Trident_6', sid: 'Node_6' },
        children: [],
        isLeaf: true,
    }
];
export default class TreeTablecheckedRows extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet: dataset,
      expandedKeys: ['root', 'Node_4'],
      msg: '',
      checkedRows: []
    };


  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
        if (expanded) {
            expandedKeys = expandedKeys.filter(expId => expId !== id);
            this.setState({
                expandedKeys,
            });
        } else {
            expandedKeys.push(id);
            this.setState({
                expandedKeys,
            });
        }
  };


  handleRowDelete = (cellValue) => {
      const rowId = cellValue;
      const { dataSet, checkedRows } = this.state;
      this.deleteDataByRowId(dataSet, rowId);
      this.deleteCheckedRowsByRowId(checkedRows, rowId);
      this.setState({dataSet}, () => {
        this.setState({
            ...this.state,
            msg: '删除行成功！',
            checkedRows,
        })
      });
  }

  deleteCheckedRowsByRowId = (checkedRows, rowId) => {
    const len = checkedRows.length;
    for (let index = 0; index < len; index++) {
        const checkId = checkedRows[index];
        if (checkId === rowId) {
            checkedRows.splice(index, 1);
            break;
        }
    }
  }


  deleteDataByRowId = (dataSet, rowId) => {
    const nodeKey = 'sid';
    const deleteNode = (treeDataArr) => {
        const len = treeDataArr.length;
        for (let index = 0; index < len; index++) {
            const treeNode = treeDataArr[index];
            if (treeNode.data[nodeKey] === rowId ) {
                treeDataArr.splice(index, 1);
                break;
            } else {
                if (Array.isArray(treeNode.children) && treeNode.children.length) {
                    deleteNode(treeNode.children);
                }
            }
        }

    }
    deleteNode(dataSet);
  }

  onRowCheck = (row, checkedRows) => {
    this.setState({
        checkedRows
    })
  }
  onHeaderCheck = (checkedRowsRef) => {
    this.setState({
        checkedRows: checkedRowsRef,
    })
  }

  render() {
    const [version, theme] = getDemoVersion();
    const columns = [
        {
            title: 'operation',
            field: 'sid',
            width: '15%',
            render: (cellValue) => {
              return (
                <div>
                  <LinkField onClick={ (e) => {this.handleRowDelete(cellValue)} } text={'delete'} disabled={false} style={{ marginRight: '20px' }} />
                </div>
              );
            },
            key: 'col_1',
        },
        {
            title: 'Engine',
            width: '35%',
            field: 'Engine',
            key: 'col_2',
        },
        {
            title: 'Browser',
            width: '25%',
            field: 'Browser',
            display: true,
            key: 'col_3',
        },
        {
            title: 'Platform',
            field: 'Platform',
            width: '25%',
            key: 'col_4',
        }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
            dataset={this.state.dataSet}
            columns={columns}
            enableCheckBox
            disabelCheckAssociated
            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            onRowCheck={this.onRowCheck}
            onHeaderCheck={this.onHeaderCheck}
            ref={treeTable => this.treeTable = treeTable}
            nodeKey={'sid'}
            expandColumnID={1}
        />

        <span style={{color: '#000'}}>
            {`checkedRows:  [${this.state.checkedRows.toString()}]`}
        </span>
        {this.state.msg && <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTablecheckedRows />, mountNode);

```

### 树表多选功能扩展特性

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  },
];
const dataset = [
  {
    data: { Engine: 'Trident_0', sid: 'root' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', sid: 'Node_1' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              sid: 'Node_2',
            },
            children: [],
            isLeaf: true,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              sid: 'Node_5',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              sid: 'Node_8',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', sid: 'Node_4' },
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            sid: 'Node_11',
          },
          isLeaf: true,
        },
        {
          data: {
            Engine: 'Trident_12',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            sid: 'Node_12',
          },
          isLeaf: true,
        }],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', sid: 'Node_7' },
        children: [],
        isLeaf: true,
      },
    ],
    isLeaf: false,
  },
  {
    data: { Engine: 'Trident_3', sid: 'Node_3' },
    children: [],
    isLeaf: true,
  },
  {
    data: { Engine: 'Trident_6', sid: 'Node_6' },
    children: [],
    isLeaf: true,
  },
];
export default class TreeTableCheckExtendedFeature extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet: dataset,
      expandedKeys: ['root', 'Node_4'],
      columns: columns,
      msg: ''
    };
  }

  handleRowClick = (row, e) => {
    this.state = {
      dataSet: dataset,
      columns: columns
    };
  }
  getCheckedRowsDataIds = () => {
    this.setState({ msg: this.treeTable.getCheckedRowsDataIds().join(' , ') });
  }
  setCheckedRowsDataIds = () => {
    let ids = ['Node_4', 'Node_7']
    this.treeTable.setCheckedRowsDataIds(ids);
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}
          unmodifiableRowIds={['Node_4', 'Node_7']}
          enableCheckBox
          disabelCheckAssociated
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          onRowClick={this.handleRowClick}
          ref={treeTable => this.treeTable = treeTable}
          nodeKey={'sid'}
        />
        <div style={{ padding: '10px' }}>
          <Button text="getCheckedRowsDataIds" onClick={this.getCheckedRowsDataIds} style={{ marginRight: "80px" }} />
          <Button text="setCheckedRowsDataIds" onClick={this.setCheckedRowsDataIds} />
        </div>
        {this.state.msg && <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }

  componentDidMount() {
    this.treeTable.setCheckedRowsDataIds(['Node_4']);
  }
}

ReactDOM.render(<TreeTableCheckExtendedFeature />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  },
];
const dataset = [
  {
    data: { Engine: 'Trident_0', sid: 'root' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', sid: 'Node_1' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              sid: 'Node_2',
            },
            children: [],
            isLeaf: true,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              sid: 'Node_5',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              sid: 'Node_8',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', sid: 'Node_4' },
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            sid: 'Node_11',
          },
          isLeaf: true,
        },
        {
          data: {
            Engine: 'Trident_12',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            sid: 'Node_12',
          },
          isLeaf: true,
        }],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', sid: 'Node_7' },
        children: [],
        isLeaf: true,
      },
    ],
    isLeaf: false,
  },
  {
    data: { Engine: 'Trident_3', sid: 'Node_3' },
    children: [],
    isLeaf: true,
  },
  {
    data: { Engine: 'Trident_6', sid: 'Node_6' },
    children: [],
    isLeaf: true,
  },
];
export default class TreeTableCheckExtendedFeature extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet: dataset,
      expandedKeys: ['root', 'Node_4'],
      columns: columns,
      msg: ''
    };
  }

  handleRowClick = (row, e) => {
    this.state = {
      dataSet: dataset,
      columns: columns
    };
  }
  getCheckedRowsDataIds = () => {
    this.setState({ msg: this.treeTable.getCheckedRowsDataIds().join(' , ') });
  }
  setCheckedRowsDataIds = () => {
    let ids = ['Node_4', 'Node_7']
    this.treeTable.setCheckedRowsDataIds(ids);
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}
          unmodifiableRowIds={['Node_4', 'Node_7']}
          enableCheckBox
          disabelCheckAssociated
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          onRowClick={this.handleRowClick}
          ref={treeTable => this.treeTable = treeTable}
          nodeKey={'sid'}
        />
        <div style={{ padding: '10px' }}>
          <Button text="getCheckedRowsDataIds" onClick={this.getCheckedRowsDataIds} style={{ marginRight: "80px" }} />
          <Button text="setCheckedRowsDataIds" onClick={this.setCheckedRowsDataIds} />
        </div>
        {this.state.msg && <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }

  componentDidMount() {
    this.treeTable.setCheckedRowsDataIds(['Node_4']);
  }
}

ReactDOM.render(<TreeTableCheckExtendedFeature />, mountNode);

```

### Tree Table deletion setting

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from "eview-ui/Button";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  }
];

const dataset = [
  {
    data: {Engine: 'Trident_0', id: '0'},
    children: [
      {
        data: {Engine: 'Trident_1', Browser: 'IE_1', id: '0.0'},
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              id: '0.0.0',
            },
            children: [
              {
                data: {
                  Engine: 'Trident_9',
                  Browser: 'IE_9',
                  Platform: 'OS_Win_2',
                  id: '0.0.0.0',
                },
                children: [
                  {
                    data: {
                      Engine: 'Trident_12',
                      Browser: 'IE_12',
                      Platform: 'OS_Win_12',
                      id: '0.0.0.0.0',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_13',
                      Browser: 'IE_13',
                      Platform: 'OS_Win_13',
                      id: '0.0.0.0.1',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_14',
                      Browser: 'IE_14',
                      Platform: 'OS_Win_14',
                      id: '0.0.0.0.2',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_15',
                      Browser: 'IE_15',
                      Platform: 'OS_Win_15',
                      id: '0.0.0.0.3',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_16',
                      Browser: 'IE_16',
                      Platform: 'OS_Win_16',
                      id: '0.0.0.0.4',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_17',
                      Browser: 'IE_17',
                      Platform: 'OS_Win_17',
                      id: '0.0.0.0.5',
                    },
                  },
                ],
                isLeaf: false,
              },
              {
                data: {
                  Engine: 'Trident_10',
                  Browser: 'IE_10',
                  Platform: 'OS_Win_10',
                  id: '0.0.0.1',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              id: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              id: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_4', Browser: 'IE_4', id: '0.1'},
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            id: '0.1.0',
          },
        },],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_7', Browser: 'IE_7', id: '0.2'},
        children: [],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  {
    data: {Engine: 'Trident_3', id: '1'},
    children: [],
    isLeaf: true,
  },
  {
    data: {Engine: 'Trident_6', id: '2'},
    children: [],
    isLeaf: true,
  },
];

export default class TreeTableDlettionSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: this.cloneObj(dataset),
      expandedKeys: ['0'],
      columns: columns,
      testData: [],
    };
  }


  getLeafNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          let newDataSet = this.cloneObj(this.state.dataSet);
          return this.getNewDataSet(id, newDataSet)
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getLeafNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null;
  }


  getNewDataSet(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          //dataset中yichu出index
          dataset.splice(index, 1);
          return dataset;
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getNewDataSet(id, children);
        if (val != null) {
          subDataSet.children = val;
          dataset[index] = subDataSet;
          if (subDataSet.children.length == 0) {
            let expandedKeys = this.state.expandedKeys;
            expandedKeys = expandedKeys.filter(expId => expId !== data.id);
            this.setState({expandedKeys});
          }
          return dataset;
        }
      }
    }
    return null;
  }


  cloneObj(obj) {
    var newObj = {};
    if (obj instanceof Array) {
      newObj = [];
    }
    for (var key in obj) {
      var val = obj[key];
      newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
    }
    return newObj;
  };

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        dataSet: this.getExpandDtaSet(id, dataset),
        expandedKeys,
      });
    }
  };

  getExpandDtaSet(id, dataset) {
    let dataChildren = this.getExpandNode(id, dataset);
    if (dataChildren != null) {
      let dataSet = this.state.dataSet;
      this.setNodeInDataSet(dataSet, dataChildren, id);
      return dataSet;
    }
  }

  setNodeInDataSet(dataset, dataChildren, id) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        subDataSet.children = dataChildren;
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        this.setNodeInDataSet(children,dataChildren,id);
      }
    }
  }


  getExpandNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        return this.cloneObj(children);
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getExpandNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null
  }


  deleteRows = ((event) => {
    let slect = this.treeTable.getSelected();
    if (slect != undefined) {
      let dataSet = this.state.dataSet;
      let newdataSet = [];
      for (let index = 0; index < slect.length; index++) {
        newdataSet = this.getLeafNode(slect[index].id, dataSet);
        if (newdataSet != null) {
          dataSet = newdataSet;
          this.setState({dataSet: newdataSet});
        }
      }
    }
  });

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}

          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          ref={treeTable => (this.treeTable = treeTable)}
        />
        <div style={{padding: '10px'}}>
          <Button text="deleteRows" onClick={this.deleteRows}/>
        </div>
      </ConfigProvider>
    );
  }

}

ReactDOM.render(<TreeTableDlettionSetting />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from "eview-ui/Button";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  }
];

const dataset = [
  {
    data: {Engine: 'Trident_0', id: '0'},
    children: [
      {
        data: {Engine: 'Trident_1', Browser: 'IE_1', id: '0.0'},
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              id: '0.0.0',
            },
            children: [
              {
                data: {
                  Engine: 'Trident_9',
                  Browser: 'IE_9',
                  Platform: 'OS_Win_2',
                  id: '0.0.0.0',
                },
                children: [
                  {
                    data: {
                      Engine: 'Trident_12',
                      Browser: 'IE_12',
                      Platform: 'OS_Win_12',
                      id: '0.0.0.0.0',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_13',
                      Browser: 'IE_13',
                      Platform: 'OS_Win_13',
                      id: '0.0.0.0.1',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_14',
                      Browser: 'IE_14',
                      Platform: 'OS_Win_14',
                      id: '0.0.0.0.2',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_15',
                      Browser: 'IE_15',
                      Platform: 'OS_Win_15',
                      id: '0.0.0.0.3',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_16',
                      Browser: 'IE_16',
                      Platform: 'OS_Win_16',
                      id: '0.0.0.0.4',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_17',
                      Browser: 'IE_17',
                      Platform: 'OS_Win_17',
                      id: '0.0.0.0.5',
                    },
                  },
                ],
                isLeaf: false,
              },
              {
                data: {
                  Engine: 'Trident_10',
                  Browser: 'IE_10',
                  Platform: 'OS_Win_10',
                  id: '0.0.0.1',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              id: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              id: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_4', Browser: 'IE_4', id: '0.1'},
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            id: '0.1.0',
          },
        },],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_7', Browser: 'IE_7', id: '0.2'},
        children: [],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  {
    data: {Engine: 'Trident_3', id: '1'},
    children: [],
    isLeaf: true,
  },
  {
    data: {Engine: 'Trident_6', id: '2'},
    children: [],
    isLeaf: true,
  },
];

export default class TreeTableDlettionSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: this.cloneObj(dataset),
      expandedKeys: ['0'],
      columns: columns,
      testData: [],
    };
  }


  getLeafNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          let newDataSet = this.cloneObj(this.state.dataSet);
          return this.getNewDataSet(id, newDataSet)
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getLeafNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null;
  }


  getNewDataSet(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          //dataset中yichu出index
          dataset.splice(index, 1);
          return dataset;
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getNewDataSet(id, children);
        if (val != null) {
          subDataSet.children = val;
          dataset[index] = subDataSet;
          if (subDataSet.children.length == 0) {
            let expandedKeys = this.state.expandedKeys;
            expandedKeys = expandedKeys.filter(expId => expId !== data.id);
            this.setState({expandedKeys});
          }
          return dataset;
        }
      }
    }
    return null;
  }


  cloneObj(obj) {
    var newObj = {};
    if (obj instanceof Array) {
      newObj = [];
    }
    for (var key in obj) {
      var val = obj[key];
      newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
    }
    return newObj;
  };

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        dataSet: this.getExpandDtaSet(id, dataset),
        expandedKeys,
      });
    }
  };

  getExpandDtaSet(id, dataset) {
    let dataChildren = this.getExpandNode(id, dataset);
    if (dataChildren != null) {
      let dataSet = this.state.dataSet;
      this.setNodeInDataSet(dataSet, dataChildren, id);
      return dataSet;
    }
  }

  setNodeInDataSet(dataset, dataChildren, id) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        subDataSet.children = dataChildren;
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        this.setNodeInDataSet(children,dataChildren,id);
      }
    }
  }


  getExpandNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        return this.cloneObj(children);
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getExpandNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null
  }


  deleteRows = ((event) => {
    let slect = this.treeTable.getSelected();
    if (slect != undefined) {
      let dataSet = this.state.dataSet;
      let newdataSet = [];
      for (let index = 0; index < slect.length; index++) {
        newdataSet = this.getLeafNode(slect[index].id, dataSet);
        if (newdataSet != null) {
          dataSet = newdataSet;
          this.setState({dataSet: newdataSet});
        }
      }
    }
  });

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}

          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          ref={treeTable => (this.treeTable = treeTable)}
        />
        <div style={{padding: '10px'}}>
          <Button text="deleteRows" onClick={this.deleteRows}/>
        </div>
      </ConfigProvider>
    );
  }

}

ReactDOM.render(<TreeTableDlettionSetting />, mountNode);

```

### 全部展开和全部折叠

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from "eview-ui/Button";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  }
];

const dataset = [
  {
    data: {Engine: 'Trident_0', sid: '0'},
    children: [
      {
        data: {Engine: 'Trident_1', Browser: 'IE_1', sid: '0.0'},
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              sid: '0.0.0',
            },
            children: [
              {
                data: {
                  Engine: 'Trident_9',
                  Browser: 'IE_9',
                  Platform: 'OS_Win_2',
                  sid: '0.0.0.0',
                },
                children: [
                  {
                    data: {
                      Engine: 'Trident_12',
                      Browser: 'IE_12',
                      Platform: 'OS_Win_12',
                      sid: '0.0.0.0.0',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_13',
                      Browser: 'IE_13',
                      Platform: 'OS_Win_13',
                      sid: '0.0.0.0.1',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_14',
                      Browser: 'IE_14',
                      Platform: 'OS_Win_14',
                      sid: '0.0.0.0.2',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_15',
                      Browser: 'IE_15',
                      Platform: 'OS_Win_15',
                      sid: '0.0.0.0.3',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_16',
                      Browser: 'IE_16',
                      Platform: 'OS_Win_16',
                      sid: '0.0.0.0.4',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_17',
                      Browser: 'IE_17',
                      Platform: 'OS_Win_17',
                      sid: '0.0.0.0.5',
                    },
                  },
                ],
                isLeaf: false,
              },
              {
                data: {
                  Engine: 'Trident_10',
                  Browser: 'IE_10',
                  Platform: 'OS_Win_10',
                  sid: '0.0.0.1',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              sid: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              sid: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_4', Browser: 'IE_4', sid: '0.1'},
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            sid: '0.1.0',
          },
        },],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_7', Browser: 'IE_7', sid: '0.2'},
        children: [],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  {
    data: {Engine: 'Trident_3', sid: '1'},
    children: [],
    isLeaf: true,
  },
  {
    data: {Engine: 'Trident_6', sid: '2'},
    children: [],
    isLeaf: true,
  },
];


export default class TreeTableDlettionSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: this.cloneObj(dataset),
      expandedKeys: ['0'],
      columns: columns,
      testData: [],
    };
  }


  getLeafNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          let newDataSet = this.cloneObj(this.state.dataSet);
          return this.getNewDataSet(id, newDataSet)
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getLeafNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null;
  }


  getNewDataSet(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          //dataset中yichu出index
          dataset.splice(index, 1);
          return dataset;
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getNewDataSet(id, children);
        if (val != null) {
          subDataSet.children = val;
          dataset[index] = subDataSet;
          if (subDataSet.children.length == 0) {
            let expandedKeys = this.state.expandedKeys;
            expandedKeys = expandedKeys.filter(expId => expId !== data.id);
            this.setState({expandedKeys});
          }
          return dataset;
        }
      }
    }
    return null;
  }


  cloneObj(obj) {
    var newObj = {};
    if (obj instanceof Array) {
      newObj = [];
    }
    for (var key in obj) {
      var val = obj[key];
      newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
    }
    return newObj;
  };

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  setNodeInDataSet(dataset, dataChildren, id) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        subDataSet.children = dataChildren;
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        this.setNodeInDataSet(children,dataChildren,id);
      }
    }
  }


  getExpandNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        return this.cloneObj(children);
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getExpandNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null
  }

  handleExpandAll = () => {
    this.treeTable.expandAll();
  }

  handleCollapseAll = () => {
    this.treeTable.collapseAll();
  }

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{height: '300px'}}>
          <TreeTable
            dataset={this.state.dataSet}
            columns={this.state.columns}

            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            ref={treeTable => (this.treeTable = treeTable)}
            virtualizeScroll={true}
            nodeKey={'sid'}
          />
        </div>
        <div style={{padding: '10px'}}>
          <Button text="expandAll" onClick={this.handleExpandAll}/>
          <Button style={{ marginLeft: "50px" }} text="collapseAll" onClick={this.handleCollapseAll}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableDlettionSetting />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from "eview-ui/Button";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  }
];

const dataset = [
  {
    data: {Engine: 'Trident_0', sid: '0'},
    children: [
      {
        data: {Engine: 'Trident_1', Browser: 'IE_1', sid: '0.0'},
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              sid: '0.0.0',
            },
            children: [
              {
                data: {
                  Engine: 'Trident_9',
                  Browser: 'IE_9',
                  Platform: 'OS_Win_2',
                  sid: '0.0.0.0',
                },
                children: [
                  {
                    data: {
                      Engine: 'Trident_12',
                      Browser: 'IE_12',
                      Platform: 'OS_Win_12',
                      sid: '0.0.0.0.0',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_13',
                      Browser: 'IE_13',
                      Platform: 'OS_Win_13',
                      sid: '0.0.0.0.1',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_14',
                      Browser: 'IE_14',
                      Platform: 'OS_Win_14',
                      sid: '0.0.0.0.2',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_15',
                      Browser: 'IE_15',
                      Platform: 'OS_Win_15',
                      sid: '0.0.0.0.3',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_16',
                      Browser: 'IE_16',
                      Platform: 'OS_Win_16',
                      sid: '0.0.0.0.4',
                    },
                  },
                  {
                    data: {
                      Engine: 'Trident_17',
                      Browser: 'IE_17',
                      Platform: 'OS_Win_17',
                      sid: '0.0.0.0.5',
                    },
                  },
                ],
                isLeaf: false,
              },
              {
                data: {
                  Engine: 'Trident_10',
                  Browser: 'IE_10',
                  Platform: 'OS_Win_10',
                  sid: '0.0.0.1',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              sid: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              sid: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_4', Browser: 'IE_4', sid: '0.1'},
        children: [{
          data: {
            Engine: 'Trident_11',
            Browser: 'IE_11',
            Platform: 'OS_Win_11',
            sid: '0.1.0',
          },
        },],
        isLeaf: false,
      },
      {
        data: {Engine: 'Trident_7', Browser: 'IE_7', sid: '0.2'},
        children: [],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  {
    data: {Engine: 'Trident_3', sid: '1'},
    children: [],
    isLeaf: true,
  },
  {
    data: {Engine: 'Trident_6', sid: '2'},
    children: [],
    isLeaf: true,
  },
];


export default class TreeTableDlettionSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: this.cloneObj(dataset),
      expandedKeys: ['0'],
      columns: columns,
      testData: [],
    };
  }


  getLeafNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          let newDataSet = this.cloneObj(this.state.dataSet);
          return this.getNewDataSet(id, newDataSet)
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getLeafNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null;
  }


  getNewDataSet(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id) {
        if (isLeaf == undefined || isLeaf) {
          //dataset中yichu出index
          dataset.splice(index, 1);
          return dataset;
        }
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getNewDataSet(id, children);
        if (val != null) {
          subDataSet.children = val;
          dataset[index] = subDataSet;
          if (subDataSet.children.length == 0) {
            let expandedKeys = this.state.expandedKeys;
            expandedKeys = expandedKeys.filter(expId => expId !== data.id);
            this.setState({expandedKeys});
          }
          return dataset;
        }
      }
    }
    return null;
  }


  cloneObj(obj) {
    var newObj = {};
    if (obj instanceof Array) {
      newObj = [];
    }
    for (var key in obj) {
      var val = obj[key];
      newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
    }
    return newObj;
  };

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  setNodeInDataSet(dataset, dataChildren, id) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        subDataSet.children = dataChildren;
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        this.setNodeInDataSet(children,dataChildren,id);
      }
    }
  }


  getExpandNode(id, dataset) {
    for (let index = 0; index < dataset.length; index++) {
      let subDataSet = dataset[index];
      let data = subDataSet.data;
      let children = subDataSet.children;
      let isLeaf = subDataSet.isLeaf;
      if (data.id === id && !isLeaf) {
        return this.cloneObj(children);
      } else {
        if (children == undefined || children.length == 0) {
          continue;
        }
        let val = this.getExpandNode(id, children);
        if (val != null) {
          return val;
        }
      }
    }
    return null
  }

  handleExpandAll = () => {
    this.treeTable.expandAll();
  }

  handleCollapseAll = () => {
    this.treeTable.collapseAll();
  }

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{height: '300px'}}>
          <TreeTable
            dataset={this.state.dataSet}
            columns={this.state.columns}

            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            ref={treeTable => (this.treeTable = treeTable)}
            virtualizeScroll={true}
            nodeKey={'sid'}
          />
        </div>
        <div style={{padding: '10px'}}>
          <Button text="expandAll" onClick={this.handleExpandAll}/>
          <Button style={{ marginLeft: "50px" }} text="collapseAll" onClick={this.handleCollapseAll}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableDlettionSetting />, mountNode);

```

### 基本属性设置

Basic Setting with Custom Icon

```jsx
import TreeTable from 'eview-ui/TreeTable';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const columns = [
  {
    title: 'Engine',
    width: '50%',
    field: 'Engine',
    key: 'col_1',
  },
  {
    title: 'Browser',
    width: '25%',
    field: 'Browser',
    display: true,
    key: 'col_2',
  },
  {
    title: 'Platform',
    field: 'Platform',
    width: '25%',
    key: 'col_3',
  },
];
const dataset = [
  {
    data: { Engine: 'Trident_0', id: '0' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              id: '0.0.0',
            },
          },
          {
            data: {
              Engine: 'Trident_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              id: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              id: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
        children: [],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
        children: [],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  {
    data: { Engine: 'Trident_3', id: '1' },
    children: [],
    isLeaf: true,
  },
  {
    data: { Engine: 'Trident_6', id: '2' },
    children: [],
    isLeaf: true,
  },
];

export default class TreeTableCustomIcon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet:dataset,
      expandedKeys: ['0', '0.0'],
      columns:columns
    };
  }

  handleRowClick=(row,e)=>
  {
    this.state = {
      dataSet:dataset,
      columns:columns
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={this.state.dataSet}
          columns={this.state.columns}

          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          onRowClick={this.handleRowClick}
          iconExpanded="image/nav-common.png"
          iconCollapsed="image/create-default.png"
          iconLeaf="image/nav-heart-active.png"
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableCustomIcon />, mountNode);

```

### 冻结列宽

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import img1 from '@images/table_1';
import img2 from '@images/table_2';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableNoDrag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
    };
  }

  //Custom render method for column
  renderBrowserColumn(cell) {
    if (!cell) {
      return (
        <div>
        </div>
      );
    }
    if (cell === 'Chrome') {
      return (
        <div>
          <img src={img1} style={{ verticalAlign: 'bottom' }} alt="Chrome" />
          {' '}
          {cell}
        </div>
      );
    }
    return (
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" />
        {' '}
        {cell}
      </div>
    );
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const columns = [
      {
        title: 'Engine',
        width: '40%',
        field: 'Engine',
        key: 'col_1',
      },
      {
        title: 'Browser',
        width: '30%',
        field: 'Browser',
        render: cell => this.renderBrowserColumn(cell),
        tipFormatter: cell => { return cell },
        key: 'col_2',
      },
      {
        title: 'Platform',
        field: 'Platform',
        width: '30%',
        key: 'col_3',
      },
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },
              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_4', Browser: 'Chrome', id: '0.1' },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'Chrome', id: '0.2' },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        children: [],
        isLeaf: true,
      },
    ];
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={dataset}
          columns={columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          enableColumnDrag={false}
           width={'50rem'}
           height={'20rem'}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableNoDrag />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import img1 from '@images/table_1';
import img2 from '@images/table_2';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableNoDrag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
    };
  }

  //Custom render method for column
  renderBrowserColumn(cell) {
    if (!cell) {
      return (
        <div>
        </div>
      );
    }
    if (cell === 'Chrome') {
      return (
        <div>
          <img src={img1} style={{ verticalAlign: 'bottom' }} alt="Chrome" />
          {' '}
          {cell}
        </div>
      );
    }
    return (
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" />
        {' '}
        {cell}
      </div>
    );
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const columns = [
      {
        title: 'Engine',
        width: '40%',
        field: 'Engine',
        key: 'col_1',
      },
      {
        title: 'Browser',
        width: '30%',
        field: 'Browser',
        render: cell => this.renderBrowserColumn(cell),
        tipFormatter: cell => { return cell },
        key: 'col_2',
      },
      {
        title: 'Platform',
        field: 'Platform',
        width: '30%',
        key: 'col_3',
      },
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },
              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_4', Browser: 'Chrome', id: '0.1' },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'Chrome', id: '0.2' },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        children: [],
        isLeaf: true,
      },
    ];
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={dataset}
          columns={columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          enableColumnDrag={false}
           width={'50rem'}
           height={'20rem'}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableNoDrag />, mountNode);

```

### 树表接口 (Under devlopment)

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

var dataset = [];
dataset = [
  {
    data: { Engine: 'Trident_BBBBBBBBBBBBBBBBBBB_0', id: '0' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              id: '0.0.0',
            },
          },
          {
            data: {
              Engine: 'Trident_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              id: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              id: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
        children: [],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
        children: [],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  {
    data: { Engine: 'Trident_3', id: '1' },
    children: [],
    isLeaf: true,
  },
  {
    data: { Engine: 'Trident_6', id: '2' },
    children: [],
    isLeaf: true,
  },
];

export default class TreeTableAction extends React.Component {

  state = {
    msg: null,
    showEmptyImage: true,
    divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 250, width: '100%', overflow: 'auto' },
    ColumnSize: ["50%", '30%', '20%'],
    tableSize: [null, null],
    expandedKeys: ['0', '0.0'],
  };

  handleExpandSwitch = (id, expandedKeys, expanded) => {

    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }

  };

  handleGetSelectedRow = () => {
    let selected = this.table.getSelected();
    if (!selected) {
      selected = {};
    }
    this.setState({
      msg: (
        <div>
          getSelected api:<br />
          {JSON.stringify(selected)}
        </div>
      ),
    });
  };

  handleGetSelectedRowIndexes = () => {

    let selected = this.table.getSelectedRowsIndex();

    if (!selected) {
      selected = {};
    }
    this.setState({
      msg: (
        <div>
          getSelected api:<br />
          {JSON.stringify(selected)}
        </div>
      ),
    });
  };


  onRClick = () => {
    this.table.reSetcolumnSize();
  }

  handleAutoFit = () => {
    this.table.setSizeColumnFit(0);
  }

  handleRowRightClick = (event, object) => {
    console.log("event", event);
    console.log("object", object);
  }

  onDoubleClick = (evtCell, evtRow, event) => {

    console.log("evtCell", evtCell);
    console.log("evtRow", evtRow);
    console.log("event", event);

    const id = evtRow.raw.data['id'];

    let expandedKeys = this.state.expandedKeys;

    if (evtRow.expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  }

  onEmptyDataClick = () => {
    dataset = [];
    this.setState({ showEmptyImage: true })
  };

  onEmptyDataNoImageClick = () => {
    dataset = [];
    this.setState({ showEmptyImage: false })
  };

  handleIncreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 300, width: 1300, overflow: 'auto' },
    })

    this.triggerTableResize();
  };

  handleDecreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 200, width: 1000, overflow: 'auto' },
    })

    this.triggerTableResize();
  };

  triggerTableResize() {
    var custEvent = new CustomEvent('parentResize');
    document.dispatchEvent(custEvent);
  }

  handleSetTableSize = () => {
    this.setState({
      tableSize: [1000, 400],
    })
  };

  handleUnSetTableSize = () => {
    this.setState({
      tableSize: [null, null],
    })
  };

  handleChangeColumnSize = () => {
    this.setState({
      ColumnSize: ["30%", '30%', '40%'],
    })
  };

  handleFixedColumnSize = () => {
    this.setState({
      ColumnSize: [200, 450, 300],
    })
  };

  handlePartialPxColumnSize = () => {
    this.setState({
      ColumnSize: [300, null, null],
    })
  };

  handlePartialPercentageColumnSize = () => {
    this.setState({
      ColumnSize: ["40%", null, null],
    })
  };

  handleMixColumnSize = () => {
    this.setState({
      ColumnSize: ["20%", null, 400],
    })
  };

  handleClearColumnSize = () => {
    this.setState({
      ColumnSize: [null, null, null],
    })
  };

  render() {
    const [version, theme] = getDemoVersion();
    const columns = [
      {
        title: 'Engine',
        width: this.state.ColumnSize[0],
        field: 'Engine',
        key: 'col_1',
      },
      {
        title: 'Browser',
        width: this.state.ColumnSize[1],
        field: 'Browser',
        key: 'col_2',
      },
      {
        title: 'Platform',
        width: this.state.ColumnSize[2],
        field: 'Platform',
        key: 'col_3',
      },
    ];

    let buttonStyle = { marginRight: "5px", marginTop: "3px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={this.handleGetSelectedRow} style={buttonStyle} text="Read selected row of data" />
          <Button onClick={this.handleGetSelectedRowIndexes} style={buttonStyle} text="Read selected row of index" />
          <Button text={"Empty Data"} style={buttonStyle} onClick={this.onEmptyDataClick} />
          <Button text={"Empty Data No Image"} style={buttonStyle} onClick={this.onEmptyDataNoImageClick} />
        </div>

        <div id="TreeTableBasicDiv" style={this.state.divTableStyle}>
          <TreeTable
            dataset={dataset}
            columns={columns}
            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            onDoubleClick={this.onDoubleClick}
            onRowRightClick={this.handleRowRightClick}
            width={this.state.tableSize[0]}
            height={this.state.tableSize[1]}
            mutiSelectEnable
            enableColumnFilter
            itemOrderChanger
            showEmptyImage={this.state.showEmptyImage}
            ref={table => { this.table = table; }}
          />
        </div>
        <br />
        <Button text={"1st column auto Fit"} style={buttonStyle} onClick={this.handleAutoFit} />
        <Button text={"columns reset"} style={buttonStyle} onClick={this.onRClick} />
        <Button text="Increase Div Size" style={buttonStyle} onClick={this.handleIncreaseSize} />
        <Button text="Decrease Div Size" style={buttonStyle} onClick={this.handleDecreaseSize} />
        <Button text="Set table size" style={buttonStyle} onClick={this.handleSetTableSize} />
        <Button text="unSet table size" style={buttonStyle} onClick={this.handleUnSetTableSize} />
        <br />
        <Button text="Change Col Size %" style={buttonStyle} onClick={this.handleChangeColumnSize} />
        <Button text="Fixed Col Size px" style={buttonStyle} onClick={this.handleFixedColumnSize} />
        <Button text="Clear Col Size" style={buttonStyle} onClick={this.handleClearColumnSize} />
        <Button text="Partial Col Size px" style={buttonStyle} onClick={this.handlePartialPxColumnSize} />
        <Button text="Partial Col Size %" style={buttonStyle} onClick={this.handlePartialPercentageColumnSize} />
        <Button text="Mix Col Size" style={buttonStyle} onClick={this.handleMixColumnSize} />
        <br />
        {this.state.msg &&
          <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableAction />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

var dataset = [];
dataset = [
  {
    data: { Engine: 'Trident_BBBBBBBBBBBBBBBBBBB_0', id: '0' },
    children: [
      {
        data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
        children: [
          {
            data: {
              Engine: 'Trident_2',
              Browser: 'IE_2',
              Platform: 'OS_Win_2',
              id: '0.0.0',
            },
          },
          {
            data: {
              Engine: 'Trident_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_5',
              Browser: 'IE_5',
              Platform: 'OS_Win_5',
              id: '0.0.1',
            },
          },
          {
            data: {
              Engine: 'Trident_8',
              Browser: 'IE_8',
              Platform: 'OS_Win_8',
              id: '0.0.2',
            },
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
        children: [],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
        children: [],
        isLeaf: false,
      },
    ],
    isLeaf: false,
  },
  {
    data: { Engine: 'Trident_3', id: '1' },
    children: [],
    isLeaf: true,
  },
  {
    data: { Engine: 'Trident_6', id: '2' },
    children: [],
    isLeaf: true,
  },
];

export default class TreeTableAction extends React.Component {

  state = {
    msg: null,
    showEmptyImage: true,
    divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 250, width: '100%', overflow: 'auto' },
    ColumnSize: ["50%", '30%', '20%'],
    tableSize: [null, null],
    expandedKeys: ['0', '0.0'],
  };

  handleExpandSwitch = (id, expandedKeys, expanded) => {

    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }

  };

  handleGetSelectedRow = () => {
    let selected = this.table.getSelected();
    if (!selected) {
      selected = {};
    }
    this.setState({
      msg: (
        <div>
          getSelected api:<br />
          {JSON.stringify(selected)}
        </div>
      ),
    });
  };

  handleGetSelectedRowIndexes = () => {

    let selected = this.table.getSelectedRowsIndex();

    if (!selected) {
      selected = {};
    }
    this.setState({
      msg: (
        <div>
          getSelected api:<br />
          {JSON.stringify(selected)}
        </div>
      ),
    });
  };


  onRClick = () => {
    this.table.reSetcolumnSize();
  }

  handleAutoFit = () => {
    this.table.setSizeColumnFit(0);
  }

  handleRowRightClick = (event, object) => {
    console.log("event", event);
    console.log("object", object);
  }

  onDoubleClick = (evtCell, evtRow, event) => {

    console.log("evtCell", evtCell);
    console.log("evtRow", evtRow);
    console.log("event", event);

    const id = evtRow.raw.data['id'];

    let expandedKeys = this.state.expandedKeys;

    if (evtRow.expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  }

  onEmptyDataClick = () => {
    dataset = [];
    this.setState({ showEmptyImage: true })
  };

  onEmptyDataNoImageClick = () => {
    dataset = [];
    this.setState({ showEmptyImage: false })
  };

  handleIncreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 300, width: 1300, overflow: 'auto' },
    })

    this.triggerTableResize();
  };

  handleDecreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 200, width: 1000, overflow: 'auto' },
    })

    this.triggerTableResize();
  };

  triggerTableResize() {
    var custEvent = new CustomEvent('parentResize');
    document.dispatchEvent(custEvent);
  }

  handleSetTableSize = () => {
    this.setState({
      tableSize: [1000, 400],
    })
  };

  handleUnSetTableSize = () => {
    this.setState({
      tableSize: [null, null],
    })
  };

  handleChangeColumnSize = () => {
    this.setState({
      ColumnSize: ["30%", '30%', '40%'],
    })
  };

  handleFixedColumnSize = () => {
    this.setState({
      ColumnSize: [200, 450, 300],
    })
  };

  handlePartialPxColumnSize = () => {
    this.setState({
      ColumnSize: [300, null, null],
    })
  };

  handlePartialPercentageColumnSize = () => {
    this.setState({
      ColumnSize: ["40%", null, null],
    })
  };

  handleMixColumnSize = () => {
    this.setState({
      ColumnSize: ["20%", null, 400],
    })
  };

  handleClearColumnSize = () => {
    this.setState({
      ColumnSize: [null, null, null],
    })
  };

  render() {
    const [version, theme] = getDemoVersion();
    const columns = [
      {
        title: 'Engine',
        width: this.state.ColumnSize[0],
        field: 'Engine',
        key: 'col_1',
      },
      {
        title: 'Browser',
        width: this.state.ColumnSize[1],
        field: 'Browser',
        key: 'col_2',
      },
      {
        title: 'Platform',
        width: this.state.ColumnSize[2],
        field: 'Platform',
        key: 'col_3',
      },
    ];

    let buttonStyle = { marginRight: "5px", marginTop: "3px" };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={this.handleGetSelectedRow} style={buttonStyle} text="Read selected row of data" />
          <Button onClick={this.handleGetSelectedRowIndexes} style={buttonStyle} text="Read selected row of index" />
          <Button text={"Empty Data"} style={buttonStyle} onClick={this.onEmptyDataClick} />
          <Button text={"Empty Data No Image"} style={buttonStyle} onClick={this.onEmptyDataNoImageClick} />
        </div>

        <div id="TreeTableBasicDiv" style={this.state.divTableStyle}>
          <TreeTable
            dataset={dataset}
            columns={columns}
            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            onDoubleClick={this.onDoubleClick}
            onRowRightClick={this.handleRowRightClick}
            width={this.state.tableSize[0]}
            height={this.state.tableSize[1]}
            mutiSelectEnable
            enableColumnFilter
            itemOrderChanger
            showEmptyImage={this.state.showEmptyImage}
            ref={table => { this.table = table; }}
          />
        </div>
        <br />
        <Button text={"1st column auto Fit"} style={buttonStyle} onClick={this.handleAutoFit} />
        <Button text={"columns reset"} style={buttonStyle} onClick={this.onRClick} />
        <Button text="Increase Div Size" style={buttonStyle} onClick={this.handleIncreaseSize} />
        <Button text="Decrease Div Size" style={buttonStyle} onClick={this.handleDecreaseSize} />
        <Button text="Set table size" style={buttonStyle} onClick={this.handleSetTableSize} />
        <Button text="unSet table size" style={buttonStyle} onClick={this.handleUnSetTableSize} />
        <br />
        <Button text="Change Col Size %" style={buttonStyle} onClick={this.handleChangeColumnSize} />
        <Button text="Fixed Col Size px" style={buttonStyle} onClick={this.handleFixedColumnSize} />
        <Button text="Clear Col Size" style={buttonStyle} onClick={this.handleClearColumnSize} />
        <Button text="Partial Col Size px" style={buttonStyle} onClick={this.handlePartialPxColumnSize} />
        <Button text="Partial Col Size %" style={buttonStyle} onClick={this.handlePartialPercentageColumnSize} />
        <Button text="Mix Col Size" style={buttonStyle} onClick={this.handleMixColumnSize} />
        <br />
        {this.state.msg &&
          <DivMessage text={this.state.msg} type="success" style={{ marginTop: '10px', width: '100%' }} />}
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableAction />, mountNode);

```

### 具有cellClassNames的树表

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0', '0.0'],
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const columns = [
      {
        title: 'Engine',
        field: 'Engine',
        key: 'col_1',
      },
      {
        title: 'Browser',
        field: 'Browser',
        key: 'col_2',
      },
      {
        title: 'Platform',
        field: 'Platform',
        cellClassName: 'testcellpink',
        isEditable: false,
        key: 'col_3',
      },
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        option: { Engine: { style: 'testcellgreen' } },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            option: { Engine: { style: 'testcellblue' }, Browser: { style: 'testcellpink' } },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },
                option: { Browser: { style: 'testcellgreen' }, Platform: { style: 'testcellblue' } },
              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
                option: { Browser: { style: 'testcellpink' }, Platform: { style: 'testcellred' } },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
                option: { Browser: { style: 'testcellgreen' }, Platform: { style: 'testcellblue' } },
              },
            ],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
            option: { Engine: { style: 'testcellpink' }, Browser: { style: 'testcellred' } },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
            option: { Engine: { style: 'testcellblue' }, Browser: { style: 'testcellgreen' } },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        option: { Engine: { style: 'testcellpink' } },
        children: [],
        isLeaf: true,
      },
    ];
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={dataset}
          columns={columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableColumn />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0', '0.0'],
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const columns = [
      {
        title: 'Engine',
        field: 'Engine',
        key: 'col_1',
      },
      {
        title: 'Browser',
        field: 'Browser',
        key: 'col_2',
      },
      {
        title: 'Platform',
        field: 'Platform',
        cellClassName: 'testcellpink',
        isEditable: false,
        key: 'col_3',
      },
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        option: { Engine: { style: 'testcellgreen' } },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            option: { Engine: { style: 'testcellblue' }, Browser: { style: 'testcellpink' } },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },
                option: { Browser: { style: 'testcellgreen' }, Platform: { style: 'testcellblue' } },
              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
                option: { Browser: { style: 'testcellpink' }, Platform: { style: 'testcellred' } },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
                option: { Browser: { style: 'testcellgreen' }, Platform: { style: 'testcellblue' } },
              },
            ],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
            option: { Engine: { style: 'testcellpink' }, Browser: { style: 'testcellred' } },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
            option: { Engine: { style: 'testcellblue' }, Browser: { style: 'testcellgreen' } },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        option: { Engine: { style: 'testcellpink' } },
        children: [],
        isLeaf: true,
      },
    ];
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={dataset}
          columns={columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableColumn />, mountNode);

```

### 自定义单元格项渲染内容

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import LinkField from 'eview-ui/LinkField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableCustomRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0', '0.0'],
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    const columns = [
      {
        title: 'operation',
        field: 'operation',
        render: (cellValue, rowVal) => {
          return (
            <div>
              <LinkField text={'showTime'} onClick={() => alert('hello, eview')} style={{ marginRight: '20px' }} />
            </div>
          );
        },
        key: 'col_1',
      },
      {
        title: 'Engine',
        field: 'Engine',
        key: 'col_2',
      },
      {
        title: 'Browser',
        field: 'Browser',
        render: (cellValue, rowVal) => {
          if (rowVal[0] === 'Trident_2') {
            return <div style={{ color: 'red' }}>{'Custom render'}</div>;
          } else {
            return cellValue || '';
          }
        },
        key: 'col_3',
      },
      {
        title: 'Platform',
        field: 'Platform',
        cellClassName: 'testcellpink',
        isEditable: false,
        key: 'col_4',
      }
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },
              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        children: [],
        isLeaf: true,
      },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={dataset}
          columns={columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          expandColumnID={2}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableCustomRender />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import LinkField from 'eview-ui/LinkField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableCustomRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0', '0.0'],
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    const columns = [
      {
        title: 'operation',
        field: 'operation',
        render: (cellValue, rowVal) => {
          return (
            <div>
              <LinkField text={'showTime'} onClick={() => alert('hello, eview')} style={{ marginRight: '20px' }} />
            </div>
          );
        },
        key: 'col_1',
      },
      {
        title: 'Engine',
        field: 'Engine',
        key: 'col_2',
      },
      {
        title: 'Browser',
        field: 'Browser',
        render: (cellValue, rowVal) => {
          if (rowVal[0] === 'Trident_2') {
            return <div style={{ color: 'red' }}>{'Custom render'}</div>;
          } else {
            return cellValue || '';
          }
        },
        key: 'col_3',
      },
      {
        title: 'Platform',
        field: 'Platform',
        cellClassName: 'testcellpink',
        isEditable: false,
        key: 'col_4',
      }
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },
              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
              },
            ],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        children: [],
        isLeaf: true,
      },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={dataset}
          columns={columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          expandColumnID={2}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableCustomRender />, mountNode);

```

### Tree Table Column Selection & Percentage width (under dev)

## en-US



```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableGearButton extends React.Component {
  state = {
    divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 250, width: 800 },
  };

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0', '0.0'],
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 250, width: 800 },
    };
  }

  handleIncreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 300, width: 900 },
    })

    this.triggerTreeTableResize();
  };

  handleDecreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 200, width: 600 },
    })

    this.triggerTreeTableResize();
  };

  triggerTreeTableResize() {
    var custEvent = new CustomEvent('parentResize');
    document.dispatchEvent(custEvent);
  }

  render() {
    const columns = [
      {
        title: 'Engine',
        width: '50%',
        field: 'Engine',
        key: 'hide1',
        isMovable: false
      },
      {
        title: 'Browser',
        width: '30%',
        field: 'Browser',
        key: 'hide2',
      },
      {
        title: 'Platform',
        width: '20%',
        field: 'Platform',
        key: 'hide3',
      },
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },

              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
              },
            ],
            isLeaf: false,

          },
          {
            data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        children: [],
        isLeaf: true,
      },
    ];
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="TreeTableBasicDiv" style={this.state.divTableStyle}>
          <TreeTable
            dataset={dataset}
            columns={columns}
            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            enableColumnFilter
            itemOrderChanger
          />
        </div>
        <br />
        <Button text="Increase Div Size" onClick={this.handleIncreaseSize} />
        {}
        <Button text="Decrease Div Size" onClick={this.handleDecreaseSize} />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableGearButton />, mountNode);

```

```jsx
import TreeTable from 'eview-ui/TreeTable';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableGearButton extends React.Component {
  state = {
    divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 250, width: 800 },
  };

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0', '0.0'],
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 250, width: 800 },
    };
  }

  handleIncreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 300, width: 900 },
    })

    this.triggerTreeTableResize();
  };

  handleDecreaseSize = () => {
    this.setState({
      divTableStyle: { margin: "10px 20px", display: "inline-block", borderStyle: 'solid', borderColor: 'red', height: 200, width: 600 },
    })

    this.triggerTreeTableResize();
  };

  triggerTreeTableResize() {
    var custEvent = new CustomEvent('parentResize');
    document.dispatchEvent(custEvent);
  }

  render() {
    const columns = [
      {
        title: 'Engine',
        width: '50%',
        field: 'Engine',
        key: 'hide1',
        isMovable: false
      },
      {
        title: 'Browser',
        width: '30%',
        field: 'Browser',
        key: 'hide2',
      },
      {
        title: 'Platform',
        width: '20%',
        field: 'Platform',
        key: 'hide3',
      },
    ];
    const dataset = [
      {
        data: { Engine: 'Trident_0', id: '0' },
        children: [
          {
            data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
            children: [
              {
                data: {
                  Engine: 'Trident_2',
                  Browser: 'IE_2',
                  Platform: 'OS_Win_2',
                  id: '0.0.0',
                },

              },
              {
                data: {
                  Engine: 'Trident_5',
                  Browser: 'IE_5',
                  Platform: 'OS_Win_5',
                  id: '0.0.1',
                },
              },
              {
                data: {
                  Engine: 'Trident_8',
                  Browser: 'IE_8',
                  Platform: 'OS_Win_8',
                  id: '0.0.2',
                },
              },
            ],
            isLeaf: false,

          },
          {
            data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
            children: [],
            isLeaf: false,
          },
          {
            data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
            children: [],
            isLeaf: false,
          },
        ],
        isLeaf: false,
      },
      {
        data: { Engine: 'Trident_3', id: '1' },
        children: [],
        isLeaf: true,
      },
      {
        data: { Engine: 'Trident_6', id: '2' },
        children: [],
        isLeaf: true,
      },
    ];
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="TreeTableBasicDiv" style={this.state.divTableStyle}>
          <TreeTable
            dataset={dataset}
            columns={columns}
            expandedKeys={this.state.expandedKeys}
            onNodeExpand={this.handleExpandSwitch}
            enableColumnFilter
            itemOrderChanger
          />
        </div>
        <br />
        <Button text="Increase Div Size" onClick={this.handleIncreaseSize} />
        {}
        <Button text="Decrease Div Size" onClick={this.handleDecreaseSize} />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeTableGearButton />, mountNode);

```

### 自定义行高

通过将 `customRowStyle` 设置表格body行高, 通过将 `headerStyle` 设置表头行高。
如果行高设置过大或者过小，导致样式异常，业务自行适配。

```jsx

import TreeTable from 'eview-ui/TreeTable';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeTableColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0', '0.0'],
    };
  }

  handleExpandSwitch = (id, expandedKeys, expanded) => {
    if (expanded) {
      expandedKeys = expandedKeys.filter(expId => expId !== id);
      this.setState({
        expandedKeys,
      });
    } else {
      expandedKeys.push(id);
      this.setState({
        expandedKeys,
      });
    }
  };

  render() {
    const columns = [{
      title: 'Engine', field: 'Engine', key: 'col_1',
    }, {
      title: 'Browser', field: 'Browser', key: 'col_2',
    }, {
      title: 'Platform', field: 'Platform', cellClassName: 'testcellpink', isEditable: false, key: 'col_3',
    },];
    const dataset = [{
      data: { Engine: 'Trident_0', id: '0' }, option: { Engine: { style: 'testcellgreen' } }, children: [{
        data: { Engine: 'Trident_1', Browser: 'IE_1', id: '0.0' },
        option: { Engine: { style: 'testcellblue' }, Browser: { style: 'testcellpink' } },
        children: [{
          data: {
            Engine: 'Trident_2', Browser: 'IE_2', Platform: 'OS_Win_2', id: '0.0.0',
          }, option: { Browser: { style: 'testcellgreen' }, Platform: { style: 'testcellblue' } },
        }, {
          data: {
            Engine: 'Trident_5', Browser: 'IE_5', Platform: 'OS_Win_5', id: '0.0.1',
          }, option: { Browser: { style: 'testcellpink' }, Platform: { style: 'testcellred' } },
        }, {
          data: {
            Engine: 'Trident_8', Browser: 'IE_8', Platform: 'OS_Win_8', id: '0.0.2',
          }, option: { Browser: { style: 'testcellgreen' }, Platform: { style: 'testcellblue' } },
        },],
        isLeaf: false,
      }, {
        data: { Engine: 'Trident_4', Browser: 'IE_4', id: '0.1' },
        option: { Engine: { style: 'testcellpink' }, Browser: { style: 'testcellred' } },
        children: [],
        isLeaf: false,
      }, {
        data: { Engine: 'Trident_7', Browser: 'IE_7', id: '0.2' },
        option: { Engine: { style: 'testcellblue' }, Browser: { style: 'testcellgreen' } },
        children: [],
        isLeaf: false,
      },], isLeaf: false,
    }, {
      data: { Engine: 'Trident_3', id: '1' }, children: [], isLeaf: true,
    }, {
      data: { Engine: 'Trident_6', id: '2' }, option: { Engine: { style: 'testcellpink' } }, children: [], isLeaf: true,
    },];
    const [version, theme] = getDemoVersion();
    return (// 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TreeTable
          dataset={dataset}
          columns={columns}
          expandedKeys={this.state.expandedKeys}
          onNodeExpand={this.handleExpandSwitch}
          customRowStyle={{ height: 32 }}
          headerStyle={{ height: 32 }}
        />
      </ConfigProvider>);
  }
}

ReactDOM.render(<TreeTableColumn />, mountNode);

```

