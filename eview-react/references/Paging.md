# Paging 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Paging/types`；官网组件页 Paging 及示例 `PagingBasic.jsx` / `PagingJump.jsx` / `PagingSimple.jsx` / `PagingDisabled.jsx`
>
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

## 2. 典型场景

- 卡片网格：每页 12 张，切换页码重新请求
- 批量选择的列表：`enableSelectedCount` + `selectedCount` 显示"已选 N 项"
- 弹窗内的小列表：`type="select"` 简单分页
- 每页条数切换：`onPageSizeChange` 后页码归 1

## 3. 状态声明

```tsx
// 与 Table 一致的分页三元组
const [page, setPage] = useState<number>(1);
const [pageSize, setPageSize] = useState<number>(12);
const [total, setTotal] = useState<number>(0);
```

## 4. 事件与交互逻辑

```tsx
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
<Paging … enableSelectedCount selectedCount={checked.size} onSelectedCountClick={() => setOnlyChecked(true)} />

// 请求中禁用，防止连点翻页
<Paging … disabled={loading} />

// 有未保存修改时拦截翻页（enablePageJumpTrigger + onPageChange 返回 false）
<Paging … enablePageJumpTrigger onPageChange={(p: number) => { if (dirty) { askSave(); return false; } setPage(p); }} />
```

## 5. 数据结构

```tsx
interface PageQuery {
  page: number;
  pageSize: number;
}
interface PageResult<T> {
  list: T[];
  total: number;   // → recordCount
}
```

## 6. 联动说明

- 筛选 / 搜索变化 → `page = 1`；`page` / `pageSize` 变化 → 请求 → `setTotal`
- 删除当前页最后一项且 `page > 1` → `page - 1`
- `total` 变小导致当前页越界 → 归到最后一页（自己算 `Math.ceil(total / pageSize)`）
- `disabled={loading}` 与列表 loading 同源

## 7. 完整代码示例

```tsx
import React, { useEffect, useRef, useState } from 'react';
import Paging from '@nce/eview-react/Paging';
import Checkbox from '@nce/eview-react/Checkbox';

interface Card {
  id: string;
  title: string;
}
const ALL: Card[] = Array.from({ length: 53 }, (_, i) => ({ id: `c${i + 1}`, title: `卡片 ${i + 1}` }));

// 模拟分页接口；真实项目替换为已有 Service
const fetchCards = (page: number, pageSize: number): Promise<{ list: Card[]; total: number }> =>
  new Promise((resolve) => setTimeout(() => resolve({ list: ALL.slice((page - 1) * pageSize, page * pageSize), total: ALL.length }), 250));

// 卡片网格 + 独立分页器 + 跨页勾选计数
export default function CardGridPage() {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const versionRef = useRef<number>(0);

  useEffect(() => {
    const my = ++versionRef.current;
    setLoading(true);
    fetchCards(page, pageSize)
      .then((res) => {
        if (my !== versionRef.current) return;
        setCards(res.list);
        setTotal(res.total);
      })
      .finally(() => { if (my === versionRef.current) setLoading(false); });
  }, [page, pageSize]);

  const toggle = (id: string, on: boolean) =>
    setChecked((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, minHeight: 240 }}>
        {loading ? <div>加载中...</div> : cards.map((c) => (
          <div key={c.id} style={{ border: '1px solid var(--colorBorder)', borderRadius: 'var(--borderRadius)', padding: 12 }}>
            <Checkbox label={c.title} value={c.id} checked={checked.has(c.id)} onChange={(v, on: boolean) => toggle(c.id, on)} />
          </div>
        ))}
      </div>
      <Paging
        style={{ marginTop: 16 }}
        recordCount={total}
        pageSize={pageSize}
        currentPage={page}
        pageSizeOptions={[12, 24, 48]}
        disabled={loading}
        enableSelectedCount
        selectedCount={checked.size}
        onPageChange={(p: number) => setPage(p)}
        onPageSizeChange={(size: number) => { setPageSize(size); setPage(1); }}
      />
    </div>
  );
}
```

## 8. 反面示例

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
<Paging recordCount={total} currentPage={page} onPageChange={setPage} />   // 少了 disabled={loading} 或版本号
```

## 9. API 速查

> 压缩自 `Paging/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `recordCount` | `number`，**必须** | 总记录数 |
| `recordCountDisp` | `string` | 展示用总数文案（页数仍按 `recordCount` 算） |
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
| `pagingCountContent` / `pageSizeDisp` | `any` / `boolean` | 自定义统计内容 / 显示"条/页" |
| `splitPagination` | `boolean`，默认 `false` | 分页切到右侧 |
| `showMorePage` / `enablePageSizeAlways` / `enableGotoAlways` / `singlePageJump` / `selectVirtualScroll` | `boolean` | 简单分页的增强项 |
| `popupDirection` / `selectWidth` / `zindex` | `'top' \| 'bottom'` / `string` / `string` | 每页条数下拉的弹出方向 / 宽 / 层级 |
| `id` / `className` / `style` | — | 最外层 |
