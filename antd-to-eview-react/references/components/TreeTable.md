# TreeTable 组件功能逻辑规格

> 资料来源：TypeDoc `TreeTable/TreeTable` + 官网 TreeTable 页示例。
> ⚠️ 与 `Table` 的两个根本差别：列定义用 **`field`** 指字段（Table 是 `key`）；行数据是 **`{ data: {...}, children: [...], isLeaf }`** 的嵌套对象（Table 是扁平行）。
> ⚠️ 没有分页：层级数据一次给全，量大用 `virtualScroll` + `virtualShowNum`。
> ⚠️ 展开态受控：`expandedKeys` + `onNodeExpand(rowId, expandedKeys, expanded)`，全展开 / 全收起走 ref 的 `expandAll()` / `collapseAll()`。
> ⚠️ `disabelCheckAssociated` 默认 false（父子联动），属性名官方即如此拼写（不是 disableCheckAssociated）。

## 1. 功能定位

TreeTable 是"树 + 多列"的层级表格：属性 / 配置项分组展示、资源层级带多列指标。与 Table 功能相近但专注层级。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 层级数据 + 多列（配置树、拓扑层级） | `TreeTable` | Table 嵌套 / 手写缩进 |
| 扁平列表 + 分页 | `Table`（[Table.md](Table.md)） | TreeTable |
| 只要层级、单列 | `Tree`（[Tree.md](Tree.md)） | TreeTable |

## 2. 事件与交互逻辑

### 列用 field，行用 data + children

```tsx
const columns = [
  { title: '属性', field: 'property', width: 260 },
  { title: '值', field: 'value', render: (v: any, r: any) => (v === undefined ? '--' : String(v)) },   // render(v, r)
];
const dataset = [
  { data: { id: '0.0', property: 'VRRP 配置' }, isLeaf: false, children: [
    { data: { id: '0.0.0', property: 'Admin VRRP ID', value: '--' }, isLeaf: true },
    { data: { id: '0.0.1', property: 'Priority', value: 105 }, isLeaf: true },
  ] },
];
<TreeTable columns={columns} dataset={dataset} nodeKey="id" expandedKeys={expandedKeys}
  onNodeExpand={(rowId: string, keys: string[], expanded: boolean) => setExpandedKeys(keys)} />
```

#### 嵌套行与列定义形状

```tsx
interface TreeTableRow<T extends { id: string }> {
  data: T;                          // 一行的字段，列 field 指向这里
  children?: TreeTableRow<T>[];
  isLeaf?: boolean;                 // 无子行标 true，不显示展开箭头
}
interface TreeTableColumn {
  title: string;
  field: string;                    // data 里的字段名 —— 不是 key
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  display?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  tipFormatter?: (value: any) => string;
  renderType?: 'progress_bar' | 'custom';
  getCompareValue?: (v: any) => any;
}
```

### 全展开 / 全收起

```tsx
<Button text="全部展开" onClick={() => treeTableRef.current.expandAll()} />
<Button text="全部收起" onClick={() => treeTableRef.current.collapseAll()} />
<TreeTable ref={treeTableRef} … />
```

### 勾选

```tsx
<TreeTable
  … enableCheckBox
  onRowCheck={(row: any, rows: any[], e) => setCheckedRows(rows)}
  onHeaderCheck={(rows: any[], e) => setCheckedRows(rows)}
  disabelCheckAssociated={false}                 // 默认父子联动；true 取消（属性名官方即如此拼）
/>
```

### 三态图标用 icon+

```tsx
import { IconPlusIcPublicFile, IconPlusIcPublicFolderOpen, IconPlusIcPublicFolder } from '@nce/icon-plus';
<TreeTable
  columns={columns}
  dataset={dataset}
  nodeKey="id"
  iconLeaf={<IconPlusIcPublicFile />}
  iconExpanded={<IconPlusIcPublicFolderOpen />}
  iconCollapsed={<IconPlusIcPublicFolder />}
  …
/>
```

## 3. 联动说明

- 接口返回扁平数据 → 先按 parentId 组装成 `{ data, children }` 再传入；不要在渲染时递归组装
- 默认展开首层：`expandedKeys` 初始化为第一层 id；"全部展开"用 ref 方法，之后 `onNodeExpand` 会同步回 keys
- 勾选集合变化 → 批量按钮解锁；提交前按 `isLeaf` 过滤出叶子行

## 4. 反面示例

```tsx
// ❌ 用 Table 的写法：列 key + 扁平行 + children 直接挂在行上
<TreeTable columns={[{ title: '名称', key: 'name' }]} dataset={[{ name: 'a', children: [] }]} />

// ❌ antd 习惯：没有 dataSource / rowKey / expandable / defaultExpandAllRows
<Table dataSource={tree} rowKey="id" expandable={{ defaultExpandAllRows: true }} />

// ❌ 想要分页：TreeTable 没有分页，量大用 virtualScroll
<TreeTable enablePagination />

// ❌ 只传 expandedKeys 不接 onNodeExpand，用户点箭头展不开
<TreeTable expandedKeys={['vrrp']} />

// ❌ 叶子行不标 isLeaf，每行都带一个空箭头
{ data: { id: 'x', property: 'Priority', value: 105 } }
```

## 5. API 速查

> 压缩自 `TreeTable/TreeTable`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `columns` | `TreeTableColumn[]`，**必填** | 列定义，`field` 指字段 |
| `dataset` | `Array<{ data, children?, isLeaf? }>` | 嵌套行 |
| `nodeKey` | `any`，默认 `'id'` | `data` 里作为主键的字段名 |
| `expandedKeys` / `onNodeExpand` | `any[]` / `(rowId, expandedKeys, expanded) => void` | 展开态（受控） |
| `expandColumnID` | `number`，默认 `0` | 展开图标渲染在第几列 |
| `enableCheckBox` / `onRowCheck` / `onHeaderCheck` | `boolean`（默认 false）/ `(row, checkedRows, e)` / `(checkedRowsRef, e)` | 勾选 |
| `disabelCheckAssociated` | `boolean`，默认 `false` | 取消父子勾选联动（拼写照官方） |
| `disableHeaderCheckbox` / `disableCheckboxIds` / `unmodifiableRowIds` | — | 禁表头勾选 / 禁某行勾选 / 不可修改行 |
| `selectedRowKey` / `onRowClick` / `onDoubleClick` / `onRowRightClick` | `any[]` / `(row, e)` / `(cell, row, e)` / `(e, row)` | 选中与行事件 |
| `onColumnSort` / `enableOriginSort` / `customSort` | `(sortColumn, sortType)` / `boolean` / `(vector) => void` | 排序 |
| `height` / `maxHeight` / `width` | `number` | 尺寸（`maxHeight` 与 `height` 不同时配） |
| `virtualScroll` / `virtualShowNum` | `boolean` / `number` | 虚拟滚动 |
| `enableColumnFilter` / `itemOrderChanger` / `onFilterOkClick` | — | 列筛选弹窗 |
| `enableColumnDrag` / `onColumnSizeChange` | `boolean`（默认 true）/ 回调 | 列宽拖拽 |
| `iconLeaf` / `iconExpanded` / `iconCollapsed`（及 Class） | `string \| ReactNode` | 三态图标，默认用 icon+ 组件 |
| `showEmptyImage` / `rowStyle` / `customRowStyle` / `tableStyle` / `style` / `className` / `id` | — | 空图 / 样式 |
| `ref.expandAll()` / `ref.collapseAll()` | 命令式方法 | 全展开 / 全收起（demo） |
