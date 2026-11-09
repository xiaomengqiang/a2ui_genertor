# TablePro 新表格

> 分类：数据展示

## 如何使用

配置表格的数据源 `dataset` 和列配置`columns`。

```jsx
const dataset = [
  {
    key: '1',
    name: 'John Brown',
    age: 60,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 30,
    address: 'New York No. 3 Lake Park',
  },
];

const columns = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
  },
  {
    key: 'address',
    title: '住址',
    dataIndex: 'address',
  },
];

<TablePro dataset={dataset} columns={columns} />;
```
## API

### TablePro

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 表格容器id | string | - |
| style | 表格容器style | React.CSSProperties | - |
| dataset | 表格数据 | object\[] | - |
| columns | 表格列的配置，[查看具体配置](#Column) | [Column](#Column)\[] | - |
| components | 覆盖默认的 table 元素 | [TableComponents](#TableComponents) | - |
| expansion | 配置展开属性 | [expansion](#expansion) | - |
| pagination | 分页器，参考 [paging](/components/Paging/) 文档，设为 false 时不展示和进行分页 | object \| boolean | - |
| rowClassName | 表格行的类名 | function(record, index): string | - |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string \| function(record): string | `key` |
| selection | 表格行是否可选择，[配置项](#selection) | object | - |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll) | object | - |
| sortOrderList | 支持的排序方式，取值为 `ascend` `descend` | Array | \[`ascend`, `descend`] |
| multipleFilter | 支持多列过滤值 | boolean | false |
| columnResizable | 是否支持列宽度调整 | boolean \| {onColumnResize: function(resizingCol, newColumns)} | true |
| columnSettings | 列设置，控制列顺序和可见列 | [ColumnSettings](#ColumnSettings) |  |
| emptyNode | 没数据时,表格空提示 | React.ReactNode | - |
| tableLayout | 表格元素的 [table-layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout) 属性，设为 `fixed` 表示内容不会影响列的布局 | - \| `auto` \| `fixed` | 无<hr />固定表头/列或使用了 `column.ellipsis` 时，默认值为 `fixed` |
| onChange | 分页、排序、筛选、列设置变化时触发 | function(currentDataset, changeEvent: [TableChangeEvent](#TableChangeEvent)) | - |
| onHeaderRow | 设置头部行属性 | function(column, index) | - |
| onRow | 设置行属性 | function(record, index) | - |
| enableZebraCrossing | 表格是否显示斑马纹(aui3.0有效) | boolean | false |
| fixColumnsAfterDrag | 是否固定columns。如果设置为true，默认columns为固定值，表格刷新不在刷新表头。| bool | false

#### 自定义表格内部组件 用法

##### 自定义表格内部组件属性
适用于 `onRow` `onHeaderRow` `onCell` `onHeaderCell`。

```jsx
<TablePro
  onRow={record => {
    return {
      onClick: event => {}, // 点击行
      onDoubleClick: event => {},
      onContextMenu: event => {},
      onMouseEnter: event => {}, // 鼠标移入行
      onMouseLeave: event => {},
    };
  }}
  onHeaderRow={column => {
    return {
      onClick: () => {}, // 点击表头行
    };
  }}
/>
```
##### 自定义表格内部组件渲染
```jsx
  // 此处会接收到onRow的自定义参数
  function MyRow(props) {
    return <tr style={{background: 'blue' }} {...props}></tr>
  }
  // 此处会接收到onCell的自定义参数
  function MyCell(props) {
    return <td style={{background: 'blue' }} {...props}></td>
  }
  <TablePro
    components={{
      body: {
        row: MyRow,
        cell: MyCell
      }
    }}
  />
```

### Column

列设置项。

| 参数 | 说明                                                                                                                                                                                                                    | 类型 | 默认值 |
| --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| --- | --- |
| align | 设置列的对齐方式。对于自定义表头title导致该设置不生效需要使用方适配                                                                                                                                                                                  | `left` \| `right` \| `center` | `left` |
| className | 列样式类名                                                                                                                                                                                                                 | string | - |
| colSpan | 表头列合并,设置为 0 时，不渲染                                                                                                                                                                                                     | number | - |
| dataIndex | 列数据在数据项中对应的路径，支持通过数组查询嵌套路径                                                                                                                                                                                            | string \| string\[] | - |
| fixed | （IE 下无效）列是否固定， `left` `right`                                                                                                                                                                                         | boolean \| string | false |
| key | React 需要的 key，如果已经设置了唯一的 `dataIndex`，可以忽略这个属性                                                                                                                                                                         | string | - |
| ellipsis | 超过宽度将自动省略，`hintType` 设置提示类型。`tipOnOverflow` 设置是否只在单元格内容不完全可见时才展示tip，默认false。<br> 注意：<br>1.`tipOnOverflow` 只在 `hintType` 为tip时有效。 <br>2.`customTitle` 只在`hintType`为title时有效。 <br>3.`tooltipProps` 只在`hintType`为tip时有效。 | boolean \| { hintType: 'title' \| 'tip' \| false, tipOnOverflow?: boolean, customTitle?:(value: any, record: R, index?: number) => string, tooltipProps?: (value: any, record: R, index?: number) => [TooltipProps](/components/Tooltip/) } | false |
| title | 列头显示文字                                                                                                                                                                                                                | ReactNode  | - |
| width | 列宽度                                                                                                                                                                                                                   | string \| number | - |
| onHeaderCell | 设置头部单元格属性                                                                                                                                                                                                             | function(column) | - |
| onCell | 设置单元格属性                                                                                                                                                                                                               | function(record, rowIndex) | - |
| render | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引（算上分页），当前页行索引                                                                                                                                                                         | function(text, record, pageIndex, index) {} | - |
| shouldCellUpdate | 自定义单元格渲染时机                                                                                                                                                                                                            | (record, prevRecord) => boolean | - |
| filter | 筛选的运行函数                                                                                                                                                                                                               | function | - |
| filteredValue | 已筛选值                                                                                                                                                                                                                  | string | - |
| defaultFilteredValue | 默认筛选值                                                                                                                                                                                                                 | string | - |
| filterDropdown | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互                                                                                                                                                                                       | ReactNode \| (props: [FilterDropdownProps](https://git.io/fjP5h)) => ReactNode | - |
| filterDropdownVisible | 用于控制自定义筛选菜单是否可见                                                                                                                                                                                                       | boolean | - |
| filterClickAwayExcludeDOMS | 筛选框引发的避免clickaway的元素集合                                                                                                                                                                                                | React.RefObject<HTMLElement>[] | - |
| onFilterDropdownVisibleChange | 自定义筛选菜单可见变化时调用                                                                                                                                                                                                        | (value: boolean) => void | - |
| getFilterPopupContainer | 获取过滤弹框渲染的父节点, 设为false时以表头单元格为父容器，默认挂载在body上 (5.1.x版本支持)                                                                                                                                                               | (() => HTMLElement) \| false                                                                                                                                                                                                                | -                     |
| sorter | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)                                                                       | function \| boolean | - |
| sortOrder | 排序的受控属性，外界可用此控制列的排序，可设置为 `ascend` `descend` false                                                                                                                                                                     | boolean \| string | - |
| defaultOrder | 默认排序顺序                                                                                                                                                                                                                | `ascend` \| `descend` | - |
| sortOrderList | 支持的排序方式，覆盖`Table`中`sortOrderList`， 取值为 `ascend` `descend`                                                                                                                                                             | Array | \[`ascend`, `descend`] |
| isMovable | 在列选择器中是否可被移动                                                                                                                                                                                                          | boolean | true |

### pagination

支持dataset为全部数据的场景下，自动进行分页。

如果需要在翻页时渲染给定的dataset，需要业务组保证此时的dataset数量小于等于pagesize，recordCount属性也需要自行维护。

分页的配置项。请查看 [`Paging`](/components/Paging/)。

### expansion

展开功能的配置。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| childrenColumnName | 指定树形结构的列名 | string | children |
| defaultExpandedRowKeys | 默认展开的行 | string\[] | - |
| defaultExpandAllRows | 初始时，是否展开所有行 | boolean | false |
| expandedRowKeys | 展开的行，控制属性 | string\[] | - |
| expandedRowRender | 额外的展开行 | function(record, index, indent, expanded): ReactNode | - |
| expandRowByClick | 通过点击行来展开子行 | boolean | false |
| expandIcon | 自定义展开图标 | function(expanded, record, rowExpandable, triggerExpand): ReactNode | - |
| expandIconColumnIndex | 自定义展开按钮的列顺序，`-1` 时不展示 | number | - |
| expandedRowClassName | 展开行的 className | function(record, index, indent): string | - |
| indentSize | 展示树形数据时，每层缩进的宽度，以 px 为单位 | number | 15 |
| rowExpandable | 设置是否允许行展开 | (record) => boolean | - |
| onExpand | 点击展开图标时触发 | function(expanded, record) | - |
| onExpandedRowsChange | 展开的行变化时触发 | function(expandedRows) | - |

### selection

选择功能的配置。

| 参数 | 说明                                                                                     | 类型 | 默认值 |
| --- |----------------------------------------------------------------------------------------| --- | --- |
| columnTitle | 自定义列表选择框标题,注意该设置跟表头selectAll冲突                                                         | ReactNode | - |
| disabelCheckAssociated | 数据结构为tree类型时，配置是否禁止父节点和子节点勾选联动。<br> 注意：请在非tree结构以及不需要联动的场景下配置为true，以提高性能               | boolean | - |
| fixed | 把选择框列固定在左边 `left`                                                                      | string | - |
| getCheckboxProps | 选择框的默认属性配置                                                                             | function(record) | - |
| hideSelect | 隐藏勾选框，当前仅支持隐藏radio。<br>隐藏勾选框后，通过点击行进行选中，支持取消选中。 <br>注意：业务需要在单元格中可点击元素的onClick事件中阻止事件冒泡 | boolean | false |
| hideSelectAll | 隐藏全选勾选框与自定义选择项                                                                         | boolean | false |
| selectedRowKeys | 指定选中项的 key 数组，需要和 onChange 进行配合                                                        | string\[] \| number\[] | \[] |
| type | 多选/单选，`checkbox` or `radio`                                                            | string | `checkbox` |
| onChange | 选中项发生变化时的回调                                                                            | function(selectedRowKeys, selectedRows) | - |
| onSelect | 用户手动选择/取消选择某行的回调                                                                       | function(record, selected, selectedRows, nativeEvent) | - |

### scroll

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| x | 设置横向滚动，也可用于指定滚动区域的宽，px | number \| true | - |
| y | 设置纵向滚动，也可用于指定滚动区域的高，px | number | - |

### ColumnSettings

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| selectedColumnKeys | 要展示的列 | React.Key[] | - |
| columnOrderChanger | 是否需要调整列顺序 | boolean | - |
| dialogProps | 列定制弹窗的属性 | [DialogProps](/components/DialogPro/) | - |
| isDialogOpen | 列定制弹窗是否展开 | boolean | - |
| resetColKeys | 重置的展示列, 当没有时，会默认将columns里的所有列作为该值 | React.Key[] | - |


## 注意

在 TablePro 中，`dataset` 和 `columns` 里的数据值都需要指定 `key` 值，对于 `dataset` 默认将每列数据的 `key` 属性作为唯一的标识, \(原因请查看[React 数组组件规范](https://zh-hans.reactjs.org/docs/lists-and-keys.html#keys)\)。

如果 数据源中`dataset[i].key` 没有提供，你应该使用 `rowKey` 来指定 `dataset` 的 `key`

```jsx
// 比如表格数据主键是 id的话
return <TablePro rowKey="id" />;
// 或
return <TablePro rowKey={record => record.id} />;
```

若没有指定，控制台会出现以下的提示，表格组件也会出现未知错误。

``` jsx
'EVIEW-UI TablePro: Table dataset should have an unique `key`, or set `rowKey` prop to get an unique key'
```

## FAQ

### 为什么 更新 state 会导致全表渲染？

由于 `columns` 支持 `render` ，因而 Table 无法知道哪些单元会受到影响。你可以通过 `column.shouldCellUpdate` 来控制单元格的渲染。


## 表格参数类型

### TableComponents

该属性支持自定义表格组件

```tsx

type CustomizeComponent<p = any> =
  | keyof React.ReactHTML
  | React.FC<p>
  | React.ComponentType<p>
  | React.ForwardRefExoticComponent<p>;

export interface TableComponents {
  /** 自定义<table> */
  table?: CustomizeComponent;
  header?: {
    /** 自定义<thead> */
    container?: CustomizeComponent;
    /** 自定义<tr> */
    row?: CustomizeComponent;
    /** 自定义<td> */
    cell?: CustomizeComponent;
  };
  body?: {
    /** 自定义<tbody> */
    container?: CustomizeComponent;
    /** 自定义<tr> */
    row?: CustomizeComponent;
    /** 自定义<td> */
    cell?: CustomizeComponent;
  };
}

```

### TableChangeEvent

分页、排序、筛选、列设置变化时触发的回调函数

```tsx

export interface TableChangeEvent {
  /** 动作，依次为 排序、筛选、分页、列设置 */
  action: 'sort' | 'filter' | 'paginate' | 'columnSetting';
  /** 列设置已选择行 */
  selectedColumnKeys: React.Key[];
  /** 分页情况 */
  pagination: {
    currentPage: number;
    pageSize: number;
  };
  /** 排序情况 */
  sorter: {
    column?: ColumnType<R>;
    field?: React.Key;
    order?: 'ascend' | 'descend' | false;
  };
  /** 筛选情况 */
  filter: {
    [React.Key]?: [过滤值];
  };
}

```

## 接口定义

```typescript
import { FilterDropdownProps } from './hook/useFilter/FilterDropdown';
import { TooltipProps } from './../Tooltip/index';
import { ActiveSorterCol } from './hook/useSorter';
import { props as DialogProps } from './../DialogPro/Dialog';
import { InputChangeEvent as CheckboxChangeEvent } from '../CheckboxPro/interface';
import { CheckboxProps } from '../CheckboxPro/Checkbox';
import { ActiveFilterCol } from './hook/useFilter';
import React from 'react';

export type FixedType = 'left' | 'right' | boolean;
export type AlignType = 'left' | 'center' | 'right';
export type BuiltinRecordType = Record<string, any>;
export type ValuePath = Array<string | number> | number | string;
export type GetRowKey<R> = (record: R) => React.Key;

/** @inner 记录展开类型是树还展开行 */
export type ExpandType = 'tree' | 'expand';

/* ================================ Customize =============================== */

export type CustomizeComponent<p = any> =
  | keyof React.ReactHTML
  | React.FC<p>
  | React.ComponentType<p>
  | React.ForwardRefExoticComponent<p>;

export type GetComponentProps<DataType> = (data: DataType, index?: number) => React.HTMLAttributes<HTMLElement>;

/** 自定义Table 组件 */
export interface TableComponents {

  /** 自定义\<table> */
  table?: CustomizeComponent;
  header?: {

    /** 自定义\<thead> */
    container?: CustomizeComponent;

    /** 自定义\<tr> */
    row?: CustomizeComponent;

    /** 自定义\<td> */
    cell?: CustomizeComponent;
  };
  body?: {

    /** 自定义\<tbody> */
    container?: CustomizeComponent;

    /** 自定义\<tr> */
    row?: CustomizeComponent;

    /** 自定义\<td> */
    cell?: CustomizeComponent;
  };
}

export interface Selection<R> {

  /**
   * @default false
   */
  checkSubTree?: boolean;

  /** 自定义列表选择框标题 */
  columnTitle?: React.ReactNode;

  /** 禁止父节点和子节点联动 */
  disabelCheckAssociated?: boolean;

  /** 把选择框列固定在左边 */
  fixed?: boolean;

  /** 选择框的默认属性配置 */
  getCheckboxProps?: (record: R) => CheckboxProps<CheckboxChangeEvent>;

  /** 隐藏全选勾选框与自定义选择项 */
  hideSelectAll?: boolean;

  /** 隐藏勾选框，当前仅支持隐藏radio  */
  hideSelect?: boolean;

  /** 指定选中项的 key 数组，需要和 onChange 进行配合 */
  selectedRowKeys?: React.Key[];

  /**
   * 多选/单选，checkbox or radio
   * @default 'checkbox'
   */
  type?: 'checkbox' | 'radio';

  /** 选中项发生变化时的回调 */
  onChange?: (selectedRowKeys: React.Key[], selectedRows: R[]) => void;

  /** 用户手动选择/取消选择某行的回调	 */
  onSelect?: (record: R, selected: boolean, selectedRows: R[], nativeEvent: CheckboxChangeEvent) => void;

  /** 用户手动选择/取消选择所有行的回调 */
  onSelectAll?: (selected: boolean, selectedRows: R[]) => void;
}

/** Get Customize Component */
export type GetTableComponent = (path: ValuePath, originComponent: keyof React.ReactHTML) => CustomizeComponent;

/* ================================= Column ================================= */
export type CellEllipsisType<R> =
  | boolean

  // false时没有提示
  | {
      hintType: 'title' | false;
      customTitle?: (value: any, record: R, index?: number) => string;
    }
  | {
      hintType: 'tip';
      tipOnOverflow?: boolean;
      tooltipProps?: (value: any, record: R, index?: number) => TooltipProps;
    };
interface ColumnSharedType<R> {
  title?: React.ReactNode;
  originalTitle?: React.ReactNode; // 内部字段，保存业务列标题，用于tip提示信息展示
  key?: React.Key;
  className?: string;
  fixed?: FixedType;

  /** 设置表头单元格 */
  onHeaderCell?: GetComponentProps<ColumnListType<R>[number]>;

  /** 超长自动省略 */
  ellipsis?: CellEllipsisType<R>;
  align?: AlignType;
}

/** 排序函数，类似Array.sort */
export type CompareFn<T> = (a: T, b: T) => number;

/** 排序规则 */
export type SortOrder = 'ascend' | 'descend';

export interface CustomCell<R> {
  children?: React.ReactNode;
  props?: CellLayoutInfo<R>;
}
export interface ColumnType<R> extends ColumnSharedType<R> {

  /** @private 内部属性 */
  colClassName?: string;
  rowSpan?: number;
  colSpan?: number;
  width?: number | string;
  dataIndex?: ValuePath;
  render?: (value: any, record: R, pageIndex?: number, index?: number) => React.ReactNode | CustomCell<R>;

  /* ================================= Filter ================================= */
  /** 过滤函数 */
  filter?: (value: any, record: R) => boolean;

  /** 过滤的受控属性，外界可用此控制列的已过滤值 */
  filteredValue?: string;

  /** 自定义筛选控件渲染 */
  filterDropdown?: React.ReactNode | ((props: FilterDropdownProps) => React.ReactNode);

  /** 用于控制自定义筛选菜单是否可见	 */
  filterDropdownVisible?: boolean;

  /** 筛选框引发的避免clickaway的元素集合 */
  filterClickAwayExcludeDOMS?: Array<React.RefObject<HTMLElement>>;

  /** 自定义筛选菜单可见变化时调用	 */
  onFilterDropdownVisibleChange?: (value: boolean) => void;

  /**
   * 获取渲染父节点, 设为false时为元素虚拟dom的原位置
   */
  getFilterPopupContainer?: (() => HTMLElement) | false;

  /** 默认已过滤值 */
  defaultFilteredValue?: string;

  /* ================================= Sorter ================================= */
  /** 排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true */
  sorter?: CompareFn<R>;

  /** 排序的受控属性，外界可用此控制列的排序 */
  sortOrder?: SortOrder | false;

  /** 默认排序顺序 */
  defaultOrder?: SortOrder | false;

  /** 支持的排序方式 */
  sortOrderList?: SortOrder[];

  /** 自定义单元格是否重新渲染 */
  shouldCellUpdate?: (record: R, prevRecord: R) => boolean;

  /** 设置单元格属性 */
  onCell?: GetComponentProps<R>;

  /** 说明该列数据的最大长度，可用于该列默认筛选过滤框允许输入的最大字符长度限制 */
  maxLength?: number;
}

export interface ColumnGroupsType<R> extends ColumnSharedType<R> {
  children?: ColumnListType<R>;
}

export type ColumnListType<R = unknown> = Array<ColumnType<R> | ColumnGroupsType<R>>;

export interface CellLayoutInfo<R> {
  key?: React.Key;
  className?: string;
  style?: React.CSSProperties;

  column?: ColumnListType<R>[number];
  colSpan?: number;
  rowSpan?: number;

  hasSubCols?: boolean;
  colStart?: number;
  colEnd?: number;
}

/* =============================== Expandable =============================== */
export type EventHandler<R> = (record: R, event: React.MouseEvent | React.KeyboardEvent) => void;
export type ExpandIconRenderer<R> = (
  expanded: boolean,
  record: R,
  expandable: boolean,
  onExpand: EventHandler<R>
) => React.ReactNode;
export interface Expansion<R> {

  /**
   * 指定树形结构的列名
   * @default 'children'
   */
  childrenColumnName?: string;

  /**
   * 初始时，是否展开所有行
   * @default false
   */
  defaultExpandAllRows?: boolean;

  /** 默认展开的行 */
  defaultExpandedRowKeys?: string[];

  /** 展开行的 className */
  expandedRowClassName?: (record: R, index: number, indent: number) => string;

  /** 展开的行，控制属性 */
  expandedRowKeys?: string[];

  /** 额外的展开行渲染函数 */
  expandedRowRender?: (record: R, index: number, indent: number, expanded: boolean) => React.ReactNode;

  /** 自定义展开图标 */
  expandIcon?: ExpandIconRenderer<R>;

  /**
   *  自定义展开按钮的列顺序
   *  -1 时不展示
   */
  expandIconColumnIndex?: number;

  /**
   * 通过点击行来展开子行
   * @default false
   */
  expandRowByClick?: boolean;

  /**
   * 展示树形数据时，每层缩进的宽度，以 px 为单位
   * @default 15
   */
  indentSize?: number;

  /** 设置是否允许行展开 */
  rowExpandable?: (record: R) => boolean;

  /** 点击展开图标时触发 */
  onExpand?: (expanded: boolean, record: R) => void;

  /** 展开的行变化时触发 */
  onExpandedRowsChange?: (expandedRows: React.Key[]) => void;
}

/* ================================== Event ================================= */
export interface PaginationDetail {
  currentPage: number;
  pageSize: number;
}

export interface FilterDetail {
  [filterKey: string]: string;
}
export interface SortDetail<R> {
  order: SortOrder | false;
  field: React.Key;
  column: ColumnType<R>;
}
export type TableAction<R> =
  | {
      action: 'paginate';
      pagination: PaginationDetail;
    }
  | {
      action: 'columnSetting';
      selectedColumnKeys: React.Key[];
    }
  | {
      action: 'sort';
      sorterState: ActiveSorterCol<R>;
    }
  | {
      action: 'filter';
      filterState: Array<ActiveFilterCol<R>>;
    };
export interface TableChangeDetail<R> {
  sort: SortDetail<R>;
  filter: FilterDetail;
  selectedColumnKeys: React.Key[];
  pagination: PaginationDetail;
  sorterState: ActiveSorterCol<R>;
  filterState: Array<ActiveFilterCol<R>>;
  resetPagination?: () => void;
}
export interface TableChangeEvent<R> extends TableChangeDetail<R> {
  action: 'sort' | 'filter' | 'paginate' | 'columnSetting';
}

/* ================================= scroll ================================= */
export interface Scroll {
  x: React.CSSProperties['width'];
  y: React.CSSProperties['height'];
}

export interface StickyOffsets {
  left: number[];
  right: number[];
}

/* ============================= column setting ============================= */
export interface ColumnSettings {

  /** 要展示的列 */
  selectedColumnKeys?: React.Key[];

  /** 是否需要调整列顺序 */
  columnOrderChanger?: boolean;

  /** 列定制弹窗的属性 */
  dialogProps: DialogProps;

  /** 列定制弹窗是否展开 */
  isDialogOpen?: boolean;

  /** 重置的默认列 */
  resetColKeys?: React.Key[];
}

export type OnScroll = (target: React.UIEvent<HTMLDivElement>) => void;
```

## 使用示例

### 基本属性设置

简单的表格，最后一列是操作。
<br/>
`columns` 中`key`是列的唯一标识，`dataIndex`为数据路径，支持数组，如demo中的`['user', 'name']`，来减少前端不必要的数据转化。
<br/>
`dataset` 中 `key` 需要指定，或者指定`rowKey`来生成唯一标识。

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableBasic extends React.Component {
  columns = [
    {
      title: 'Name',
      width: 100,
      key: 'name',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'VPN Name',
      width: 300,
      key: 'vpnName',
      dataIndex: 'vpnName',
    },
    {
      title: 'State',
      width: 300,
      key: 'state',
      dataIndex: 'state',
    },
    {
      title: 'Site',
      width: 300,
      key: 'site',
      dataIndex: 'site',
    },
    {
      title: 'Alarm',
      key: 'alarm',
      dataIndex: 'alarm',
    },
    {
      title: '操作',
      width: '100px',
      key: 'operation',
      render: (text, record) => (
        <a
          onClick={() => {
            alert(`VPN:${record.vpnName}`);
          }}
        >
          detail
        </a>
      ),
    },
  ];

  dataset = [
    {
      user: {
        name: 'Jack',
      },
      vpnName: 'R&D VPN2',
      state: 'TO BE',
      site: 3,
      alarm: 'ICMP Echo',
    },
    {
      user: {
        name: 'Mick',
      },
      vpnName: 'Shop Storage',
      state: 'Active',
      site: 2,
      alarm: 'Critical',
    },
    {
      user: {
        name: 'Tom',
      },
      vpnName: 'R&D VPN1',
      state: 'TO BE',
      site: 4,
      alarm: 'Major',
    },
    {
      user: {
        name: 'Jerry',
      },
      vpnName: 'R&D VPN8',
      state: 'Active',
      site: 6,
      alarm: 'ICMP Echo',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns} // Column Details
          dataset={this.dataset} // Data Set
          style={{width:'500px',height:'200px'}}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableBasic />, mountNode);

```

### 可选择

## en-US

```tsx
import TablePro from 'eview-ui/TablePro';
import SelectPro from 'eview-ui/SelectPro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TableDemo extends React.Component {
  state = {
    type: 'checkbox',
  };

  dataset = [
    {
      key: '1',
      name: 'John',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim',
      age: 42,
      address: 'London Central Park',
    },
    {
      key: '3',
      name: 'Joe',
      age: 32,
      address: 'Tokyo Station',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Xi Cun',
    },
  ];
  columns = [
    {
      key: 'name',
      title: '名字',
      dataIndex: 'name',
    },
    {
      key: 'age',
      dataIndex: 'age',
      width: '15%',
      title: '年龄',
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: '260px',
    },
  ];
  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          类型：
          <SelectPro
            value={this.state.type}
            onChange={value => {
              this.setState({
                type: value,
              });
            }}
            options={[
              { text: 'checkbox', value: 'checkbox' },
              { text: 'radio', value: 'radio' },
            ]}
          ></SelectPro>
        </div>
        <br />
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          selection={{
            type: this.state.type,
            disabelCheckAssociated: true,
            getCheckboxProps: record => ({
              name: record.name,
              // Column configuration not to be checked
              disabled: record.name === 'Disabled User',
            }),
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

```tsx
import TablePro from 'eview-ui/TablePro';
import SelectPro from 'eview-ui/SelectPro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TableDemo extends React.Component {
  state = {
    type: 'checkbox',
  };

  dataset = [
    {
      key: '1',
      name: 'John',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim',
      age: 42,
      address: 'London Central Park',
    },
    {
      key: '3',
      name: 'Joe',
      age: 32,
      address: 'Tokyo Station',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Xi Cun',
    },
  ];
  columns = [
    {
      key: 'name',
      title: '名字',
      dataIndex: 'name',
    },
    {
      key: 'age',
      dataIndex: 'age',
      width: '15%',
      title: '年龄',
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: '260px',
    },
  ];
  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          类型：
          <SelectPro
            value={this.state.type}
            onChange={value => {
              this.setState({
                type: value,
              });
            }}
            options={[
              { text: 'checkbox', value: 'checkbox' },
              { text: 'radio', value: 'radio' },
            ]}
          ></SelectPro>
        </div>
        <br />
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          selection={{
            type: this.state.type,
            disabelCheckAssociated: true,
            getCheckboxProps: record => ({
              name: record.name,
              // Column configuration not to be checked
              disabled: record.name === 'Disabled User',
            }),
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

### 自定义属性和事件

使用`onCell`，`onHeaderCell`，`onRow`，`onHeaderRow`自定义属性和事件

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableBasic extends React.Component {
  columns = [
    {
      title: 'Name',
      width: 100,
      key: 'name',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'VPN Name',
      width: 300,
      key: 'vpnName',
      dataIndex: 'vpnName',
    },
    {
      title: 'State',
      width: 300,
      key: 'state',
      dataIndex: 'state',
    },
    {
      title: 'Site',
      width: 300,
      key: 'site',
      dataIndex: 'site',
    },
    {
      title: 'Alarm',
      key: 'alarm',
      dataIndex: 'alarm',
    },
    {
      title: '操作',
      width: '100px',
      key: 'operation',
      render: (text, record) => (
        <a
          onClick={() => {
            alert(`VPN:${record.vpnName}`);
          }}
        >
          detail
        </a>
      ),
    },
  ].map(col => ({
    ...col,
    onHeaderCell: (column) => ({
      onClick: () => {
        alert(column.title)
      }
    }),
    onCell: (record) => ({
      style: {
        background: record[col.dataIndex] === 'Blue' ? '#3b86fa' : 'transparnt'
      },
      onClick: () => {
        const value = record[col.dataIndex];
        if(value){
          alert(value)
        }
      },
      onContextMenu: (e) => {
        e.preventDefault();
        const value = record[col.dataIndex];
        if(value){
          alert("右击了：" + value)
        }
      }
    })
  }));

  dataset = [
    {
      user: {
        name: 'Jack',
      },
      vpnName: 'R&D VPN2',
      state: 'Blue',
      site: 3,
      alarm: 'ICMP Echo',
    },
    {
      user: {
        name: 'Mick',
      },
      vpnName: 'Shop Storage',
      state: 'Active',
      site: 2,
      alarm: 'Critical',
    },
    {
      user: {
        name: 'Tom',
      },
      vpnName: 'R&D VPN1',
      state: 'TO BE',
      site: 4,
      alarm: 'Major',
    },
    {
      user: {
        name: 'Jerry',
      },
      vpnName: 'R&D VPN8',
      state: 'Active',
      site: 6,
      alarm: 'ICMP Echo',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columnResizable={false}
          columns={this.columns} // Column Details
          dataset={this.dataset} // Data Set
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableBasic />, mountNode);
```

### 控制选择项

控制选择项，通过 `selection.selectedRowKeys` 来控制选中项。

```tsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


const dataset = [];

for (let i = 0; i < 46; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Queen Block Lane no. ${i}`,
  });
}

export default class TableDemo extends React.Component {
  state = {
    selectedRowKeys: [],
  };

  dataset = dataset;

  columns = [
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
  ];

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const { selectedRowKeys } = this.state;
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <p>
          <a
            style={{marginRight: '1rem'}}
            onClick={() => {
              this.setState({
                selectedRowKeys: [],
              });
            }}
          >
            RESET
          </a>
          {selectedRowKeys.length !== 0 && (
            <span>
              已选择：{selectedRowKeys.join('，')}
              ，共{selectedRowKeys.length}项
            </span>
          )}
        </p>
        <br />
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          pagination
          selection={{
            disabelCheckAssociated: true,
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
        />
      </ConfigProvider>
    );
  }
}
ReactDOM.render(<TableDemo />, mountNode);


```

### 筛选和排序

对某一列数据进行筛选，使用列的 `filter` 属性来指定筛选函数，`multipleFilter` 用于指定单列过滤和多列过滤。

对某一列数据进行排序，通过指定列的 `sorter` 函数即可启动排序按钮。`sorter: function(rowA, rowB) { ... }`， rowA、rowB 为比较的两个行数据，可参考[Array.prototype.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)。

`sortOrderList: ['ascend' | 'descend']`改变每列可用的排序方式，切换排序时按数组内容依次切换，设置在 table props 上时对所有列生效。

使用 `defaultSortOrder` 属性，设置列的默认排序顺序。

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


const cities = ['北京', '上海', '广州', '深圳'];
// 自定义筛选组件
function CityFilter({ value, onConfirm }) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '1rem',
        width: '10rem',
        boxShadow: '0 0.25rem 0.4375rem rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {cities.map(city =>
        city === value ? (
          <span>{city}</span>
        ) : (
          <a key={city} onClick={() => onConfirm(city)}>
            {city}
          </a>
        )
      )}
    </div>
  );
}
const dataset = [];
for (let index = 0; index < 60; index++) {
  dataset.push({
    key: index,
    name: '胡彦' + index,
    age: parseInt(Math.random().toFixed(2) * 100, 10),
    city: cities[parseInt(Math.random().toFixed(2) * 100, 10) % 4],
    address: '西湖区湖底公园1号',
  });
}
class TableDemo extends React.Component {
  state = {
    selectedRowKeys: [],
  };
  dataset = dataset;
  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      defaultOrder: 'descend',
      filter: (value, record) => String(record.age).includes(value),
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      filter: (value, record) => record.city === value,
      filterDropdown: CityFilter,
      defaultFilteredValue: '深圳'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro columns={this.columns} dataset={this.dataset} pagination/>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

### 可展开

配置`expansion`设置可展开

```jsx

import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableDemo extends React.Component {
  state = {
    selectedRowKeys: [],
  };
  dataset = [
    {
      key: 1,
      name: 'Jim Brown',
      id: 32,
      city: 'New York',
    },
    {
      key: 2,
      name: 'John Green',
      id: 42,
      city: 'London',
    },
    {
      key: 3,
      name: 'Not Expandable',
      id: 29,
      city: 'Jiangsu',
    },
    {
      key: 4,
      name: 'Joey Black',
      id: 12,
      city: 'Sidney',
    },
  ];
  columns = [
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          expansion={{
            expandedRowRender: record => {
              return `我是${record.name}, id：${record.id}，住在${record.city}`;
            },
            expandRowByClick: true,
            rowExpandable: record => record.name !== 'Not Expandable',
          }}
        />
      </ConfigProvider>
    );
  }
}
ReactDOM.render(<TableDemo />, mountNode);
```

### 树表格

## en-US



```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableDemo extends React.Component {
  state = {
    selectedRowKeys: [],
  };

  dataset = [
    {
      key: 1,
      name: 'Johnson Brown sr.',
      age: 60,
      address: 'Paris No. 1 Lake Park',
      children: [
        {
          key: 11,
          name: 'Johnson Brown',
          age: 42,
          address: 'Paris No. 2 Lake Park',
        },
        {
          key: 12,
          name: 'Johnson Brown jr.',
          age: 33,
          address: 'Paris No. 3 Lake Park',
          children: [
            {
              key: 121,
              name: 'Jimmy Brown',
              age: 56,
              address: 'Paris No. 3 Lake Park',
            },
          ],
        },
        {
          key: 13,
          name: 'Jim Green sr.',
          age: 72,
          address: 'Paris No. 1 Lake Park',
          children: [
            {
              key: 31,
              name: 'Jim Green',
              age: 62,
              address: 'Paris No. 2 Lake Park',
              children: [
                {
                  key: 14,
                  name: 'Jimmy Green jr.',
                  age: 15,
                  address: 'Paris No. 3 Lake Park',
                },
                {
                  key: 15,
                  name: 'Jimmy Green sr.',
                  age: 14,
                  address: 'Paris No. 4 Lake Park',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: 'Joey Black',
      age: 22,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: 3,
      name: 'Joey Black',
      age: 42,
      address: 'Sidney No. 1 Lake Park',
      children: false,
    },
  ];
  columns = [
    {
      key: 'name',
      title: '名字',
      dataIndex: 'name',
    },
    {
      key: 'age',
      dataIndex: 'age',
      width: '15%',
      title: '年龄',
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: '260px',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          selection={{
            disabelCheckAssociated: false,
            onSelect: (record, selected, selectedRows) => {
              console.log('OnSelect:', record, selected, selectedRows);
            },
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`SelectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableDemo extends React.Component {
  state = {
    selectedRowKeys: [],
  };

  dataset = [
    {
      key: 1,
      name: 'Johnson Brown sr.',
      age: 60,
      address: 'Paris No. 1 Lake Park',
      children: [
        {
          key: 11,
          name: 'Johnson Brown',
          age: 42,
          address: 'Paris No. 2 Lake Park',
        },
        {
          key: 12,
          name: 'Johnson Brown jr.',
          age: 33,
          address: 'Paris No. 3 Lake Park',
          children: [
            {
              key: 121,
              name: 'Jimmy Brown',
              age: 56,
              address: 'Paris No. 3 Lake Park',
            },
          ],
        },
        {
          key: 13,
          name: 'Jim Green sr.',
          age: 72,
          address: 'Paris No. 1 Lake Park',
          children: [
            {
              key: 31,
              name: 'Jim Green',
              age: 62,
              address: 'Paris No. 2 Lake Park',
              children: [
                {
                  key: 14,
                  name: 'Jimmy Green jr.',
                  age: 15,
                  address: 'Paris No. 3 Lake Park',
                },
                {
                  key: 15,
                  name: 'Jimmy Green sr.',
                  age: 14,
                  address: 'Paris No. 4 Lake Park',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: 'Joey Black',
      age: 22,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: 3,
      name: 'Joey Black',
      age: 42,
      address: 'Sidney No. 1 Lake Park',
      children: false,
    },
  ];
  columns = [
    {
      key: 'name',
      title: '名字',
      dataIndex: 'name',
    },
    {
      key: 'age',
      dataIndex: 'age',
      width: '15%',
      title: '年龄',
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: '260px',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          selection={{
            disabelCheckAssociated: false,
            onSelect: (record, selected, selectedRows) => {
              console.log('OnSelect:', record, selected, selectedRows);
            },
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`SelectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

### 固定表头

## en-US



```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const dataset = [];

for (let i = 0; i < 46; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London South Street Lane no. ${i}`,
  });
}

export default class TableDemo extends React.Component {
  dataset = dataset;

  columns = [
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          scroll={{ y: 240 }}
          pagination={false}
        />
      </ConfigProvider>

    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const dataset = [];

for (let i = 0; i < 46; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London South Street Lane no. ${i}`,
  });
}

export default class TableDemo extends React.Component {
  dataset = dataset;

  columns = [
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          scroll={{ y: 240 }}
          pagination={false}
        />
      </ConfigProvider>

    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

### 固定列

对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据，需要和 `scroll.x`配合使用。
> 建议指定 `scroll.x` 为大于表格宽度的固定值或百分比。注意，且非固定列宽度之和不要超过 `scroll.x`。

** !!注意：固定列通过 sticky 实现，IE 11 会降级成横向滚动。**

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const dataset = [];

for (let i = 0; i < 10; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London South Street Lane no. ${i}`,
  });
}

export default class TableDemo extends React.Component {
  dataset = dataset;

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '100px',
      fixed: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: '60px',
      fixed: 'left',
    },
    {
      title: 'Address1',
      key: 'col1',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address2',
      key: 'col2',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address3',
      key: 'col3',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address4',
      key: 'col4',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address5',
      key: 'col5',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address6',
      key: 'col6',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address7',
      key: 'col7',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address8',
      key: 'col8',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address9',
      key: 'col9',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address10',
      key: 'col10',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Action',
      key: 'action',
      width: '100px',
      render: () => <a>detail</a>,
      fixed: 'right',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro columns={this.columns} dataset={this.dataset} scroll={{ x: 1800 }} pagination={false} />
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

### 单元格可编辑

TablePro，有良好的扩展性，使用 `components` （自定义表格组件）  和 `onCell`、`onRow`（自定义单元格，行属性） 可已完成各种编辑功能

> 编写自定义的行组件、单元格组件，通过`components`注册到 表格组件中。

> `columns`中加入`onCell`、`onRow`等属性，注入所需属性到自定义组件中。

```jsx
import TablePro from 'eview-ui/TablePro';
import SelectPro from 'eview-ui/SelectPro';
import TextField from 'eview-ui/TextField';
import React, { useState, useEffect } from 'react';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


// 自定义表格的单元格组件
// 需要的Props可从 column 中的 onCell 获取
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, options, type, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(record ? record[dataIndex] : '');
  const inputRef = React.useRef();

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const save = newValue => {
    if (value) {
      try {
        toggleEdit();
        handleSave({ ...record, [dataIndex]: newValue });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    }
  };
  let childNode = children;
  if (editable) {
    const InputComponent =
      type === 'select' ? (
        <SelectPro
          required
          ref={inputRef}
          value={value}
          onChange={value => {
            setValue(value);
            save(value);
          }}
          options={options}
        />
      ) : (
        <TextField
          required
          ref={inputRef}
          onBlur={() => save(value)}
          value={value}
          onChange={value => setValue(value)}
          hintType="tip"
        />
      );

    childNode = editing ? InputComponent : <div onClick={toggleEdit}>{children}</div>;
  }

  return <td {...restProps}>{childNode}</td>;
};

class TableDemo extends React.Component {
  state = {
    data: [
      {
        key: '0',
        name: 'Edward King 0',
        sex: 'man',
        address: 'London, Park Lane no. 0',
      },
      {
        key: '1',
        name: 'Edward King 1',
        sex: 'woman',
        address: 'London, Park Lane no. 1',
      },
    ],
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      editable: 'true',
      width: '500px',
      key: 'name',
      type: 'textfield',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      editable: 'true',
      width: '300px',
      key: 'age',
      options: [
        { text: 'man', value: 'man' },
        { text: 'woman', value: 'woman' },
      ],
      type: 'select',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  // 传给EditableCell的回调函数，用来更新数据
  handleSave = row => {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({
      data: newData,
    });
  };

  render() {
    // 往 column 的 onCell注入 所需参数
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          options: col.options,
          type: col.type,
        }),
      };
    });
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataset={this.state.data}
          columns={columns}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);
```

### 固定头和列

## en-US



```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const dataset = [];

for (let i = 0; i < 50; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London South Street Lane no. ${i}`,
  });
}

export default class TableDemo extends React.Component {
  dataset = dataset;

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '100px',
      fixed: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: '60px',
      fixed: 'left',
    },
    {
      title: 'Address1',
      key: 'col1',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address2',
      key: 'col2',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address3',
      key: 'col3',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address4',
      key: 'col4',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address5',
      key: 'col5',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address6',
      key: 'col6',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address7',
      key: 'col7',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address8',
      key: 'col8',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address9',
      key: 'col9',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address10',
      key: 'col10',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Action',
      key: 'action',
      width: '100px',
      render: () => <a>detail</a>,
      fixed: 'right',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro columns={this.columns} dataset={this.dataset} scroll={{ x: 2600, y: 400 }} pagination={false} />
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const dataset = [];

for (let i = 0; i < 50; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London South Street Lane no. ${i}`,
  });
}

export default class TableDemo extends React.Component {
  dataset = dataset;

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '100px',
      fixed: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: '60px',
      fixed: 'left',
    },
    {
      title: 'Address1',
      key: 'col1',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address2',
      key: 'col2',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address3',
      key: 'col3',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address4',
      key: 'col4',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address5',
      key: 'col5',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address6',
      key: 'col6',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address7',
      key: 'col7',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address8',
      key: 'col8',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address9',
      key: 'col9',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Address10',
      key: 'col10',
      dataIndex: 'address',
      width: '260px',
    },
    {
      title: 'Action',
      key: 'action',
      width: '100px',
      render: () => <a>detail</a>,
      fixed: 'right',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro columns={this.columns} dataset={this.dataset} scroll={{ x: 2600, y: 400 }} pagination={false} />
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

### 多级表头

## en-US



```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const dataset = [];

for (let i = 0; i < 50; i++) {
  dataset.push({
    name: 'John Brown' + i,
    key: i,
    companyName: 'SoftLake Co',
    street: 'Lake Park',
    age: i + 1,
    gender: 'M',
    number: 8200820,
    building: 'No. B',
    companyAddress: 'River Street 432',
  });
}

export default class TableDemo extends React.Component {
  dataset = dataset;

  columns = [
    { title: '序号', render: (text, record, i) => i + 1, width: 50, fixed: 'left', align: 'center', key: 'no' },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      width: 180,
      fixed: 'left',
    },
    {
      title: '详细信息',
      children: [
        {
          key: 'age',
          title: '年龄',
          dataIndex: 'age',
          width: 150,
        },
        {
          title: '地址',
          children: [
            {
              title: '街道',
              key: 'street',
              dataIndex: 'street',
              width: 150,
            },
            {
              title: '区域',
              children: [
                {
                  title: '楼号',
                  key: 'building',
                  dataIndex: 'building',
                  width: 100,
                },
                {
                  title: '门牌号',
                  key: 'number',
                  dataIndex: 'number',
                  width: 100,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: '公司',
      children: [
        {
          title: '公司地址',
          key: 'companyAddress',
          dataIndex: 'companyAddress',
          width: 200,
        },
        {
          title: '公司名字',
          key: 'companyName',
          dataIndex: 'companyName',
          width: 200,
        },
      ],
    },
    {
      title: '年龄',
      key: 'gender',
      dataIndex: 'gender',
      width: 80,
      fixed: 'right',
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (text, record) => <a onClick={() => alert('hi ' + record.name)}>say hi</a>,
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro columns={this.columns} dataset={this.dataset} pagination/>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const dataset = [];

for (let i = 0; i < 50; i++) {
  dataset.push({
    name: 'John Brown' + i,
    key: i,
    companyName: 'SoftLake Co',
    street: 'Lake Park',
    age: i + 1,
    gender: 'M',
    number: 8200820,
    building: 'No. B',
    companyAddress: 'River Street 432',
  });
}

export default class TableDemo extends React.Component {
  dataset = dataset;

  columns = [
    { title: '序号', render: (text, record, i) => i + 1, width: 50, fixed: 'left', align: 'center', key: 'no' },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      width: 180,
      fixed: 'left',
    },
    {
      title: '详细信息',
      children: [
        {
          key: 'age',
          title: '年龄',
          dataIndex: 'age',
          width: 150,
        },
        {
          title: '地址',
          children: [
            {
              title: '街道',
              key: 'street',
              dataIndex: 'street',
              width: 150,
            },
            {
              title: '区域',
              children: [
                {
                  title: '楼号',
                  key: 'building',
                  dataIndex: 'building',
                  width: 100,
                },
                {
                  title: '门牌号',
                  key: 'number',
                  dataIndex: 'number',
                  width: 100,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: '公司',
      children: [
        {
          title: '公司地址',
          key: 'companyAddress',
          dataIndex: 'companyAddress',
          width: 200,
        },
        {
          title: '公司名字',
          key: 'companyName',
          dataIndex: 'companyName',
          width: 200,
        },
      ],
    },
    {
      title: '年龄',
      key: 'gender',
      dataIndex: 'gender',
      width: 80,
      fixed: 'right',
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (text, record) => <a onClick={() => alert('hi ' + record.name)}>say hi</a>,
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro columns={this.columns} dataset={this.dataset} pagination/>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<TableDemo />, mountNode);

```

### 单元格省略提示

设置 `column.ellipsis.hintType` 单元格内容自动省略提示，`title`或者`tip`。

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableDemo extends React.Component {
  columns = [
    {
      title: 'Name',
      width: 100,
      key: 'name',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'VPN Name',
      width: 300,
      key: 'vpnName',
      dataIndex: 'vpnName',
    },
    {
      title: 'State',
      width: 150,
      key: 'state',
      dataIndex: 'state',
    },
    {
      title: 'Site',
      key: 'site',
      dataIndex: 'site',
      width: 300,
      ellipsis: {
        hintType: 'tip',
      },
    },
    {
      title: 'Alarm',
      key: 'alarm',
      width: 300,
      ellipsis: {
        hintType: 'title',
      },
      dataIndex: 'alarm',
    },
    {
      title: '操作',
      width: '100px',
      key: 'operation',
      render: (text, record) => (
        <a
          onClick={() => {
            alert(`VPN:${record.vpnName}`);
          }}
        >
          detail
        </a>
      ),
    },
  ];

  dataset = [
    {
      user: {
        name: 'Jack',
      },
      vpnName: 'R&D VPN2',
      state: 'TO BE',
      site: 'Tooltip: Very very very very very very very very very very very very looooooooooooong',
      alarm: 'Title: Very very very very very very very very very very very very looooooooooooong',
    },
    {
      user: {
        name: 'Mick',
      },
      vpnName: 'Shop Storage',
      state: 'Active',
      site: 'Tooltip: Very very very very very very very very very very very very looooooooooooong',
      alarm: 'Title: Very very very very very very very very very very very very looooooooooooong',
    },
    {
      user: {
        name: 'Tom',
      },
      vpnName: 'R&D VPN1',
      state: 'TO BE',
      site: 'Tooltip: Very very very very very very very very very very very very looooooooooooong',
      alarm: 'Title: Very very very very very very very very very very very very looooooooooooong',
    },
    {
      user: {
        name: 'Jerry',
      },
      vpnName: 'R&D VPN8',
      state: 'Active',
      site: 'Tooltip: Very very very very very very very very very very very very very very very looooooooooooong',
      alarm: 'Title: Very very very very very very very very very very very very very very very looooooooooooong',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns} // Column Details
          dataset={this.dataset} // Data Set
        />
      </ConfigProvider>
    );
  }
}
ReactDOM.render(<TableDemo />, mountNode);

```

### 合并单元格

表格支持行/列合并，当 `onCell` 里的单元格属性 `colSpan` 或者 `rowSpan` 设值为 0 时，设置的表格不会渲染。

** 注意：

当表格设置斑马纹时，由于单元格合并导致某些行的单元格不渲染，会表现出斑马纹显示不规则。

表格自带的复选框、展开图标列不支持合并。

```jsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableDemo extends React.Component {
  columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Age',
      key: 'age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      key: 'address',
      dataIndex: 'address',
      colSpan: 1,
      onCell: (record, index) => {
        return {
          colSpan: index === 2 || index === 3 ? 2 : 1,
          rowSpan: index === 2 ? 2 : index === 3 ? 0 : 1,
        }
      }
    },
    {
      title: 'Detail Address',
      key: 'detailAddress',
      colSpan: 1,
      dataIndex: 'detailAddress',
      onCell: (record, index) => {
        return {
          colSpan: index === 2 || index === 3 ? 0 : 1
        }
      }
    },
    {
      title: 'Gender',
      key: 'gender',
      dataIndex: 'gender',
      onCell: (record, index) => {
        return {
          rowSpan: index === 1 ? 2 : index === 2 ? 0 : 1
        }
      }
    }
  ];

  dataset = [
    {
      key: 0,
      name: '张三',
      age: 21,
      address: '陕西',
      detailAddress: '西安',
      gender: '男',
    },
    {
      key: 1,
      name: '李四',
      age: 18,
      address: '新疆',
      detailAddress: '乌鲁木齐',
      gender: '女',
    }, {
      key: 2,
      name: '王五',
      age: 32,
      address: '四川',
      detailAddress: '成都',
      gender: '女',
    }, {
      key: 3,
      name: '孙六',
      age: 41,
      address: '广东',
      detailAddress: '青岛',
      gender: '男',
    },
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns} // Column Details
          dataset={this.dataset} // Data Set
          selection={{
            selectedRowKeys: [1, 3]
          }}
        />
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo/>, mountNode);
```

### 隐藏单选勾选框

通过将 `selection.type` 设置为radio, 并且将 `selection.hideSelect` 设置为true, 来隐藏单选勾选框。

注意：业务需要在单元格中可点击元素的onClick事件中阻止事件冒泡，防止点击时误触发行选中。例如在操作列中点击编辑时阻止事件冒泡

```tsx
import TablePro from 'eview-ui/TablePro';
import LinkField from 'eview-ui/LinkField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const dataset = [];
for (let i = 0; i < 4; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Queen Block Lane no. ${i}`,
  });
}
export default class TableDemo extends React.Component {
  state = {
    selectedRowKeys: [],
  };
  dataset = dataset;
  columns = [
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '操作',
      dataIndex: 'address',
      render: (text, record) => {
        return (
          <LinkField href={''}
                     children={'编辑'}
                     onClick={(e) => {
                       e.stopPropagation();
                     }} />
        );
      }
    },
  ];
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const { selectedRowKeys } = this.state;
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          selection={{
            type: 'radio',
            hideSelect: true,
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: (a, v) => {
              console.log('======onSelect===', a, v);
            }
          }}
        />
      </ConfigProvider>
    );
  }
}
ReactDOM.render(<TableDemo />, mountNode);

```

### 自定义行高

通过将 `onRow` 设置表格body行高, 通过将 `onHeaderRow` 设置表头行高。
如果行高设置过大或者过小，导致样式异常，业务自行适配。

```tsx
import TablePro from 'eview-ui/TablePro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const dataset = [];
for (let i = 0; i < 4; i++) {
  dataset.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Queen Block Lane no. ${i}`,
  });
}
export default class TableDemo extends React.Component {
  dataset = dataset;
  columns = [
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address'
    }
  ];

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <TablePro
          columns={this.columns}
          dataset={this.dataset}
          onRow={(record => {
            return {
              style: {
                height: 32
              }
            };
          })}
          onHeaderRow={column => {
            return {
              style: {
                height: 32
              }
            }
          }}
        />
      </ConfigProvider>
    );
  }
}
ReactDOM.render(<TableDemo />, mountNode);

```

### 合并单元格Hover验证

验证合并单元格场景下 hover 样式是否正常：鼠标悬停在合并单元格上，相关行应高亮；鼠标移出后高亮消失。同时验证筛选弹窗打开后，hover 行不会导致筛选组件重渲染。城市列支持 Select 编辑，验证编辑交互正常。

```jsx
import TablePro from 'eview-ui/TablePro';
import SelectPro from 'eview-ui/SelectPro';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const cities = ['北京', '上海', '广州', '深圳'];
const cityOptions = cities.map(c => ({ text: c, value: c }));

// 自定义筛选组件，renderCount 用于观察是否被重复渲染
let cityFilterRenderCount = 0;
function CityFilter({ value, onConfirm }) {
  cityFilterRenderCount++;
  console.log('[CityFilter] render #' + cityFilterRenderCount);
  return (
    <div
      style={{
        background: '#fff',
        padding: '1rem',
        width: '12rem',
        boxShadow: '0 0.25rem 0.4375rem rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ marginBottom: '0.5rem', fontSize: '12px', color: '#999' }}>
        渲染次数: {cityFilterRenderCount}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {cities.map(city =>
          city === value ? (
            <span key={city} style={{ color: '#1890ff', fontWeight: 'bold' }}>{city}</span>
          ) : (
            <a key={city} onClick={() => onConfirm(city)} style={{ cursor: 'pointer' }}>
              {city}
            </a>
          )
        )}
      </div>
    </div>
  );
}

// 可编辑单元格（Select）
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, options, ...restProps }) => {
  const [value, setValue] = React.useState(record ? record[dataIndex] : '');

  const handleChange = newValue => {
    setValue(newValue);
    handleSave({ ...record, [dataIndex]: newValue });
  };

  let childNode = children;
  if (editable) {
    childNode = (
      <SelectPro
        value={value}
        onChange={handleChange}
        options={options}
      />
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const initialData = [
  { key: 0, name: '张三', age: 21, city: '北京', address: '朝阳区' },
  { key: 1, name: '李四', age: 18, city: '上海', address: '浦东新区' },
  { key: 2, name: '王五', age: 32, city: '广州', address: '天河区' },
  { key: 3, name: '赵六', age: 32, city: '深圳', address: '南山区' },
  { key: 4, name: '孙七', age: 41, city: '北京', address: '海淀区' },
  { key: 5, name: '周八', age: 28, city: '上海', address: '静安区' },
];

class TableDemo extends React.Component {
  state = {
    data: initialData,
    selectedRowKeys: [],
  };

  handleSave = row => {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({ data: newData });
  };

  getColumns = () => [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      onCell: (record, index) => ({
        rowSpan: index === 2 ? 2 : index === 3 ? 0 : 1,
      }),
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      editable: true,
      options: cityOptions,
      filter: (value, record) => record.city === value,
      filterDropdown: CityFilter,
      defaultFilteredValue: '深圳',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      onCell: (record, index) => ({
        rowSpan: index === 2 ? 2 : index === 3 ? 0 : 1,
      }),
    },
  ];

  render() {
    const columns = this.getColumns().map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, index) => ({
          ...(col.onCell ? col.onCell(record, index) : {}),
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          options: col.options,
        }),
      };
    });
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
            <b>验证步骤：</b><br />
            1. 勾选行的 checkbox，验证选中状态正常<br />
            2. 点击"城市"列的筛选图标，打开筛选弹窗<br />
            3. 鼠标在表格行上移动，观察控制台 — CityFilter 不应重复 render（渲染次数不增加）<br />
            4. 关闭筛选弹窗，鼠标悬停在"王五"行上，"王五"和"赵六"的年龄/地址单元格应同时高亮<br />
            5. 鼠标移出，高亮消失<br />
            6. 点击"城市"列的下拉框，切换城市值，数据应正常更新
          </p>
          <TablePro
            components={{
              body: { cell: EditableCell },
            }}
            columns={columns}
            dataset={this.state.data}
            selection={{
              type: 'checkbox',
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                console.log('selectedRowKeys:', selectedRowKeys, 'selectedRows:', selectedRows);
                this.setState({ selectedRowKeys });
              },
            }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TableDemo />, mountNode);
```

