# Table 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：源码接口 `Table/interfaces/TableProps.ts`、`Table/interfaces/ColumnProps.ts`（TypeDoc 表由此生成）；官网组件页 Table 及示例 `TableBasic.jsx` / `TableEmpty.jsx` / `TableObjectData.jsx` / `TablePaging.jsx` / `TablePagingAuto.jsx` / `TableSort.jsx` / `TableLoading.jsx` / `TableRowExpand.jsx` / `TableScrollPagination.jsx` / `TableEdit.jsx`（共 40 个 demo，本文只覆盖列表页高频能力）
>
> ⚠️ `dataset` 是**行数组**：既可以是二维数组（顺序与 `columns` 一致），也可以是对象数组（key 对应 `columns[].key`）；不是 antd 的 `dataSource + rowKey`。
> ⚠️ 勾选回调 `onRowCheck(row, checkedRows, e)` 的 `checkedRows` 是**主键数组**：设了 `keyIndex` 就是该列的值，没设就是行序号。
> ⚠️ 分页有两种：`enableAutoPaging` 前台分页（`dataset` 传全量）；后台分页（默认）`dataset` 只传当前页，`recordCount` 传总数，`onPageChange` 里去请求。
> ⚠️ 排序默认组件自己排（前台）；后台排序要 `disableEviewSort` + `onColumnSort(sortColumn, sortType)` 自己请求再换 `dataset`。

## 1. 功能定位

Table 是行列数据集展示：列定义驱动、自带分页 / 排序 / 勾选 / 列筛选 / 行展开 / 加载态 / 空态 / 斑马纹 / 冻结列 / 编辑列 / 虚拟滚动。列表页的主体一律用它。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 服务端分页的资源列表 | `Table` + `enablePagination` + `pagingProps` + `onPageChange` | antd `Table pagination={{...}}` |
| 几十条以内的静态数据 | `Table enableAutoPaging` | 自己切片 |
| 树形表格 | `TreeTable`（后续批次） | Table 嵌套 |
| 独立分页器（列表不是表格） | `Paging`（[Paging.md](Paging.md)） | Table 只为分页 |

## 2. 典型场景

- 资源列表页：筛选条 + Table（后台分页 + 排序 + 勾选）+ 批量操作按钮；状态列 / 操作列用 `render` 放 `Tag` / `Button status="text"`
- 请求中 `enableLoading`，无数据 `emptyTableMsg`；行详情用 `enableRowExpand` + `onRowExpend(row)` 或 `onRowClick` 打开 Dialog

## 3. 状态声明

```tsx
// 列表数据：只存当前页（后台分页）
const [rows, setRows] = useState<DeviceRow[]>([]);
const [loading, setLoading] = useState<boolean>(false);

// 分页三元组 + 排序：切换时都回到第 1 页
const [page, setPage] = useState<number>(1);
const [pageSize, setPageSize] = useState<number>(10);
const [total, setTotal] = useState<number>(0);
const [sort, setSort] = useState<{ column: string; type: string } | null>(null);

// 勾选：存主键数组（配合 keyIndex 指向 id 列），跨页保留用 preserveCheckedRows
const [checkedIds, setCheckedIds] = useState<Array<string | number>>([]);

const tableRef = useRef<any>(null);   // 需要 getCheckedRowsData() / setCheckedRows() 时用
```

## 4. 事件与交互逻辑

### 列定义与行数据

```tsx
const columns = [
  { title: 'ID', key: 'id', width: 80, display: false },                 // 隐藏列也参与 keyIndex
  { title: '名称', key: 'name', width: '30%', ellipsis: true },
  { title: '状态', key: 'state', allowSort: false, render: (cell: string) => <Tag color={STATE_COLOR[cell]}>{cell}</Tag> },
  { title: 'IP', key: 'ip' },
  {
    title: '操作', key: 'op', allowSort: false, width: 160,
    render: (cell: any, rowData: any[], options: any, row: any) => (        // render(cellValue, rowData, options, row, isEdit)
      <>
        <Button status="text" text="编辑" onClick={() => openEdit(rowData)} />
        <Button status="text" text="删除" onClick={() => askDelete(rowData)} />
      </>
    ),
  },
];
// 对象行：key 与 columns[].key 对应（TableObjectData.jsx）
const rows = list.map((d) => ({ id: d.id, name: d.name, state: d.state, ip: d.ip, op: null }));
```

### 后台分页 + 后台排序（TablePaging.jsx / TableSort.jsx）

```tsx
<Table
  columns={columns}
  dataset={rows}
  keyIndex={0}                                   // 第 0 列（id）作为行主键
  enableLoading={loading}
  emptyTableMsg="暂无设备"
  enablePagination
  pagingProps={{ pageSize, currentPage: page, recordCount: total, pageSizeOptions: [10, 20, 50], onPageSizeChange: (size: number) => { setPageSize(size); setPage(1); } }}
  onPageChange={(currentPage: number) => setPage(currentPage)}
  disableEviewSort                               // 关掉前台排序
  onColumnSort={(sortColumn: string, sortType: string) => { setSort({ column: sortColumn, type: sortType }); setPage(1); }}
/>
// page / pageSize / sort 任一变化 → useEffect 里请求 → setRows + setTotal
```

### 勾选与批量操作

```tsx
<Table
  …
  enableCheckBox
  checkType="multi"
  preserveCheckedRows                            // 跨页保留勾选（3.5.12）
  checkedRows={checkedIds}
  onRowCheck={(row: any, checkedRows: Array<string | number>) => setCheckedIds(checkedRows)}
  onHeaderCheck={(checkedRows: Array<string | number>) => setCheckedIds(checkedRows)}
/>
<Button status="risk" text={`删除所选（${checkedIds.length}）`} disabled={checkedIds.length === 0} onClick={askBatchDelete} />
// 需要整行数据时：tableRef.current.getCheckedRowsData()
```

### 前台分页 / 行点击 / 行展开

```tsx
<Table columns={columns} dataset={allRows} enablePagination enableAutoPaging pageSizeOptions={[10, 20, 50]} maxHeight={500} />   // 前台分页：recordCount 不传，取 dataset.length
<Table … onRowClick={(row: any, event) => openDetail(row)} enableRowExpand onRowExpend={(row: any) => <DetailPanel row={row} />} />
```

## 5. 数据结构

```tsx
// 列定义（ColumnProps 高频字段）
interface TableColumn {
  title: string | React.ReactNode;          // 列头
  key?: string;                             // 对象行取值 / 自定义排序时的字段名
  id?: string | number;
  width?: string | number;                  // 不填自适应
  align?: 'left' | 'center' | 'right';
  allowSort?: boolean;                      // 默认 true
  sort?: 'asc' | 'desc' | 'origin';         // 初始排序态
  display?: boolean;                        // 默认 true；false 隐藏（配合列筛选）
  ellipsis?: boolean;
  tipFormatter?: ((v: any) => string) | string;   // 悬浮提示；非文本单元格必填
  render?: (cellValue: any, rowData: any[], options: any, row: any, isEdit: boolean) => React.ReactNode;
  freezeCol?: boolean;                      // 冻结列；编辑列另有 renderType / isEditable（demo TableEdit）
}

// 行数据两种形态：二维数组（顺序 = columns）或对象（key = columns[].key）
type TableRow = any[] | Record<string, any>;
```

## 6. 联动说明

- 筛选 / 排序 / 翻页 / 改每页条数 → 合并到同一个请求（筛选与排序变化时 `page = 1`），版本号丢弃过期响应，请求期间 `enableLoading`
- 勾选数量 → 批量按钮 `disabled` 与文案；批量操作成功后 `setCheckedIds([])` 并刷新；删光当前页且 `page > 1` 则 `page - 1`
- 操作列按钮 → `Dialog`（编辑表单）/ `MessageDialog`（删除确认），成功后刷新

## 7. 完整代码示例

```tsx
import React, { useEffect, useRef, useState } from 'react';
import Table from '@nce/eview-react/Table';
import Tag from '@nce/eview-react/Tag';
import Button from '@nce/eview-react/Button';
import SearchInput from '@nce/eview-react/SearchInput';

interface DeviceRow {
  id: string;
  name: string;
  state: 'running' | 'alarm' | 'stopped';
  ip: string;
}
interface Query {
  keyword: string;
  page: number;
  pageSize: number;
  sortColumn?: string;
  sortType?: string;
}

const STATE_COLOR: Record<DeviceRow['state'], 'success' | 'danger' | 'default'> = { running: 'success', alarm: 'danger', stopped: 'default' };
const ALL: DeviceRow[] = Array.from({ length: 57 }, (_, i) => ({
  id: `d${i + 1}`, name: `device-${String(i + 1).padStart(2, '0')}`, state: (['running', 'alarm', 'stopped'] as const)[i % 3], ip: `10.0.${Math.floor(i / 10)}.${i % 10}`,
}));

// 模拟后台：过滤 + 排序 + 分页；真实项目替换为已有 Service
const fetchDevices = (q: Query): Promise<{ list: DeviceRow[]; total: number }> =>
  new Promise((resolve) => setTimeout(() => {
    let list = ALL.filter((d) => d.name.includes(q.keyword) || d.ip.includes(q.keyword));
    if (q.sortColumn && q.sortType !== 'origin') {
      const k = q.sortColumn as keyof DeviceRow;
      list = [...list].sort((a, b) => (a[k] > b[k] ? 1 : -1) * (q.sortType === 'desc' ? -1 : 1));
    }
    const start = (q.page - 1) * q.pageSize;
    resolve({ list: list.slice(start, start + q.pageSize), total: list.length });
  }, 300));

// 设备列表：搜索 → 后台分页 + 后台排序 + 跨页勾选 + 批量删除
export default function DeviceTablePage() {
  const [keyword, setKeyword] = useState<string>('');
  const [rows, setRows] = useState<DeviceRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sort, setSort] = useState<{ column: string; type: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedIds, setCheckedIds] = useState<Array<string | number>>([]);
  const [reload, setReload] = useState<number>(0);          // 删除等操作后强制重新请求
  const versionRef = useRef<number>(0);

  const columns = [
    { title: 'ID', key: 'id', display: false },
    { title: '名称', key: 'name', width: '35%', ellipsis: true },
    { title: '状态', key: 'state', allowSort: false, render: (cell: DeviceRow['state']) => <Tag color={STATE_COLOR[cell]}>{cell}</Tag> },
    { title: 'IP', key: 'ip', width: '25%' },
  ];

  useEffect(() => {
    const my = ++versionRef.current;
    setLoading(true);
    fetchDevices({ keyword: keyword.trim(), page, pageSize, sortColumn: sort?.column, sortType: sort?.type })
      .then(({ list, total: t }) => {
        if (my !== versionRef.current) return;          // 丢弃过期响应
        setRows(list);
        setTotal(t);
      })
      .finally(() => { if (my === versionRef.current) setLoading(false); });
  }, [keyword, page, pageSize, sort, reload]);

  const handleBatchDelete = async () => {
    // 真实项目：先用 MessageDialog 二次确认（见 MessageDialog.md），再调删除接口
    await new Promise((resolve) => setTimeout(resolve, 200));
    const remain = ALL.filter((d) => !checkedIds.includes(d.id));
    ALL.length = 0;
    ALL.push(...remain);                                     // 模拟服务端已删除
    setCheckedIds([]);
    if (rows.length === checkedIds.length && page > 1) setPage(page - 1);   // 删光当前页则回退一页
    else setReload((n) => n + 1);                                            // 否则刷新当前页
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <SearchInput placeholder="名称 / IP" value={keyword} onChange={(v: string) => setKeyword(v)} onSearch={(v: string) => { setKeyword(v); setPage(1); }} onClear={() => { setKeyword(''); setPage(1); }} />
        <Button status="risk" text={`删除所选（${checkedIds.length}）`} disabled={checkedIds.length === 0 || loading} onClick={handleBatchDelete} />
      </div>
      <Table
        columns={columns}
        dataset={rows.map((d) => ({ id: d.id, name: d.name, state: d.state, ip: d.ip }))}
        keyIndex={0}
        enableLoading={loading}
        emptyTableMsg="暂无设备"
        enableCheckBox
        preserveCheckedRows
        checkedRows={checkedIds}
        onRowCheck={(row: any, checkedRows: Array<string | number>) => setCheckedIds(checkedRows)}
        onHeaderCheck={(checkedRows: Array<string | number>) => setCheckedIds(checkedRows)}
        enablePagination
        pagingProps={{ pageSize, currentPage: page, recordCount: total, pageSizeOptions: [10, 20, 50], onPageSizeChange: (size: number) => { setPageSize(size); setPage(1); } }}
        onPageChange={(currentPage: number) => setPage(currentPage)}
        disableEviewSort
        onColumnSort={(sortColumn: string, sortType: string) => { setSort({ column: sortColumn, type: sortType }); setPage(1); }}
        maxHeight={520}
      />
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 dataSource / rowKey / pagination 对象 / rowSelection / columns[].dataIndex
<Table dataSource={rows} rowKey="id" columns={[{ dataIndex: 'name' }]} pagination={{ current: 1 }} rowSelection={{ onChange }} />

// ❌ 对象行的 key 与 columns[].key 对不上，整列为空
columns=[{ title: '名称', key: 'name' }]  dataset=[{ deviceName: 'a' }]

// ❌ 后台分页却把全量数据塞进 dataset，又传 recordCount，页码错乱
<Table dataset={ALL} enablePagination recordCount={ALL.length} />   // 要么 enableAutoPaging，要么只传当前页

// ❌ 想后台排序却没关前台排序：组件先把当前页排一遍，再触发请求，界面闪两次
<Table onColumnSort={fetchSorted} />   // 少了 disableEviewSort

// ❌ 勾选存整行对象、翻页即丢；应存主键数组 + keyIndex + preserveCheckedRows
onRowCheck={(row) => setChecked([...checked, row])}
```

## 9. API 速查

> 压缩自 `TableProps.ts` / `ColumnProps.ts`，只列列表页高频项；ref 方法来自 `TableAPI` 接口并在 demo 出现。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `columns` | `ColumnProps[]` | 列定义（见 §5） |
| `dataset` | `any[]`，**必填** | 行数组：二维数组或对象数组 |
| `keyIndex` | `number` | 行主键所在列序号；不设则用行号 |
| `enableCheckBox` / `checkType` | `boolean`（默认 false）/ `'multi' \| 'single'` | 勾选列 / 单多选 |
| `checkedRows` / `preserveCheckedRows` / `disableCheckboxIds` | `(string \| number)[]` / `boolean`（3.5.12）/ `(string \| number)[]` | 受控勾选 / 跨页保留 / 禁勾行 |
| `onRowCheck` | `(row, checkedRows, e) => void` | 行勾选；`checkedRows` 为主键数组 |
| `onHeaderCheck` | `(checkedRows, checked, checkedRowsData) => void` | 表头勾选 |
| `onRowClick` / `onDoubleClick` / `onRowRightClick` | `(row, event)` / `(evtRow, evtCell, e)` / `(event, row)` | 行事件（注意参数顺序各不相同） |
| `selectedRowIndex` | `number \| number[]` | 受控选中行 |
| `enablePagination` | `boolean`，默认 `false` | 显示分页 |
| `enableAutoPaging` | `boolean`，默认 `false`（3.3.2） | 前台分页，`dataset` 传全量 |
| `pagingProps` | `PagingProps` | 透传给分页器：`pageSize` `currentPage` `recordCount` `pageSizeOptions` `onPageSizeChange` … |
| `onPageChange` / `onPageSizeChange` | `(currentPage) => void` / `(pageSize) => void` | 翻页 / 改每页条数 |
| `recordCount` / `currentPage` / `pageSize` / `pageSizeOptions` | — | 也可直接放在 Table 上（demo TableObjectData） |
| `enableSort` / `disableEviewSort` / `enableOriginSort` | `boolean` | 排序开关 / 关前台排序（后台排序用）/ 允许"原始顺序"态 |
| `onColumnSort` / `onColumnSorted` / `customSortFun` | `(sortColumn, sortType)` / `(data)` / `(key, a, b) => number` | 排序回调 / 完成 / 自定义比较 |
| `enableLoading` | `boolean` | 加载态 |
| `emptyTableMsg` / `showEmptyImage` | `string` / `boolean` | 空态文案 / 图 |
| `height` / `minHeight` / `maxHeight` / `width` | `number \| string` | 尺寸（含表头与分页） |
| `enableZebraCrossing` | `boolean`，默认 `true` | 斑马纹 |
| `enableColumnFilter` / `itemOrderChanger` / `onFilterOkClick` | `boolean` / `boolean` / `(hideRow, displayRow, columns) => boolean` | 列筛选弹窗 |
| `enableRowExpand` / `onRowExpend` / `expandedRow` / `enableMulitiExpand` | `boolean` / `(row) => ReactNode` / `(string \| number)[]` / `boolean` | 行展开 |
| `enableColumnDrag` / `enableColumnWidthFit` / `freezeColPosition` / `virtualScroll` / `virtualShowNum` | — | 列宽拖拽（默认开）/ 自适应 / 冻结列位置 / 虚拟滚动（3.5.10） |
| `isRequiredToUpdateColumns` / `enableColumnCompareUpdate` | `boolean` | 更新 columns 是否生效 / 比较后再更新 |
| `ref.getCheckedRowsData()` / `getCheckedRowsIndexes()` / `getSelectedRowData()` / `getSelectedRowIndex()` / `setCheckedRows(keys)` / `getDataset()` / `setRowEditable(id, columns)` | 命令式方法 | 取勾选 / 选中 / 设勾选 / 取数据 / 设行可编辑 |
