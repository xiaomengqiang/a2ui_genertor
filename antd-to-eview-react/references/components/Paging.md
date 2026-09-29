# Paging 组件功能逻辑规格

> 资料来源：TypeDoc `Paging/types` + 官网 Paging 页示例。
> ⚠️ 表格场景优先用 `Table` 自带分页（`enablePagination` + `pagingProps`，属性与本组件同名，见 [Table.md](Table.md)）；独立 `Paging` 用于卡片列表、图库、非表格列表。
> ⚠️ 跳转输入框只在总页数 > 7 时出现（README），`enableGoInput={false}` 可关。

## 1. 功能定位

Paging 是分页器：总数 `recordCount` 驱动页码，`pageSize` / `pageSizeOptions` 控制每页条数，`type="select"` 为窄区域的简单分页。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 卡片 / 列表下方的分页 | `Paging` | antd `Pagination`（`total` / `current` / `showSizeChanger`） |
| 表格分页 | `Table enablePagination`（[Table.md](Table.md)） | Table 外再放一个 Paging |
| 侧栏 / 弹窗里的窄分页 | `Paging type="select"` | 完整分页 |
| 无限滚动加载 | 自己监听滚动 + 追加数据 | Paging |

## 2. 事件与交互逻辑

```tsx
const [page, setPage] = useState<number>(1);
const [pageSize, setPageSize] = useState<number>(12);
const [total, setTotal] = useState<number>(0);

<Paging
  recordCount={total}                                // 必须：总条数
  pageSize={pageSize}
  currentPage={page}
  pageSizeOptions={[12, 24, 48]}
  onPageChange={(currentPage: number) => setPage(currentPage)}
  onPageSizeChange={(size: number) => { setPageSize(size); setPage(1); }}   // 改每页条数回到第 1 页
  enableGoInput                                      // 页数 > 7 时显示跳转框（默认 true）
/>

// 简单分页（窄区域）
<Paging type="select" recordCount={total} pageSize={pageSize} currentPage={page} onPageChange={(p: number) => setPage(p)} />

// 显示已选数量
<Paging enableSelectedCount selectedCount={checked.size} onSelectedCountClick={() => setOnlyChecked(true)} />

// 请求中禁用，防止连点翻页
<Paging disabled={loading} />

// 有未保存修改时拦截翻页（enablePageJumpTrigger + onPageChange 返回 false）
<Paging enablePageJumpTrigger onPageChange={(p: number) => { if (dirty) { askSave(); return false; } setPage(p); }} />
```

## 3. 联动说明

- 筛选 / 搜索变化 → `page = 1`；`page` / `pageSize` 变化 → 请求 → `setTotal`
- 删除当前页最后一项且 `page > 1` → `page - 1`
- `total` 变小导致当前页越界 → 归到最后一页（自己算 `Math.ceil(total / pageSize)`）
- `disabled={loading}` 与列表 loading 同源

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 total / current / showSizeChanger / showQuickJumper / onShowSizeChange
<Pagination total={100} current={1} showSizeChanger onShowSizeChange={setSize} />

// ❌ 漏传 recordCount，分页器算不出页数
<Paging pageSize={10} currentPage={page} onPageChange={setPage} />

// ❌ 改每页条数不把页码归 1，可能停在越界页
onPageSizeChange={(size) => setPageSize(size)}

// ❌ 表格下面再放独立 Paging，与 Table 自带分页重复
<Table dataset={rows} enablePagination /><Paging recordCount={total} />

// ❌ 请求中不禁用，用户连点触发多次请求且响应乱序
<Paging recordCount={total} currentPage={page} onPageChange={setPage} />   // 少了 disabled={loading}
```

## 5. API 速查

> 压缩自 `Paging/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `recordCount` | `number`，**必须** | 总记录数 |
| `pageSize` | `number`，默认 `10` | 每页条数 |
| `currentPage` | `number`，默认 `1` | 当前页 |
| `pageSizeOptions` | `number[]`，默认 `[10, 20, 50, 100]` | 每页条数选项 |
| `onPageChange` | `(currentPage) => void \| boolean` | 翻页；配 `enablePageJumpTrigger` 时返回 `false` 不跳 |
| `onPageSizeChange` | `(pageSize) => void` | 改每页条数 |
| `type` | `'list' \| 'select'`，默认 `list` | 完整 / 简单分页 |
| `enableGoInput` | `boolean`，默认 `true` | 跳转输入框（页数 > 7 才显示） |
| `enablePageJumpTrigger` | `boolean` | `onPageChange` 返回 false 时不跳转 |
| `disabled` / `disableSelect` | `boolean` | 禁用整体 / 仅禁用每页条数下拉 |
| `enableSelectedCount` / `selectedCount` / `onSelectedCountClick` | `boolean`（默认 false）/ `number \| string` / 回调 | 已选行数文本 |
| `splitPagination` | `boolean`，默认 `false` | 分页切到右侧 |
| `recordCountDisp` / `pageSizeDisp` / `pagingCountContent` | `string` / `boolean` / `any` | 自定义统计文案 / 显示"条/页" / 自定义统计内容 |
| `id` / `className` / `style` | — | 最外层 |
