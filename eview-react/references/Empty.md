# Empty 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Empty/types`；官网组件页 Empty 及示例 `Empty.jsx` / `SuccessEmpty.jsx`
>
> ⚠️ 只有 6 个 props，`type` 两种：`fail`（默认图，加载失败 / 无权限）与 `success`（加载成功但数据为 0）。语义要选对：搜索无结果是 `success`，接口报错是 `fail`。
> ⚠️ 表格内部空态用 `Table` 自带的 `emptyTableMsg` / `showEmptyImage`，不要在 Table 外再叠 Empty。

## 1. 功能定位

Empty 是"没有内容"的占位：图 + 描述，可自定义图标 / 图片 / 描述节点（如放"去新建"按钮）。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 列表 / 卡片区无数据 | `Empty type="success" description="…"` | antd `Empty image=…` |
| 加载失败 / 无权限 | `Empty type="fail"`（默认）+ 重试按钮 | Empty 默认图不配文案 |
| 表格无数据 | `Table emptyTableMsg`（[Table.md](Table.md)） | Table 外叠 Empty |
| 还在加载 | `Loading`（[Loading.md](Loading.md)） | Empty 先闪一下 |

## 2. 典型场景

- 搜索无结果：`type="success"` + "未找到与「xxx」相关的结果"
- 新用户首次进入：`type="success"` + `description` 里放"去新建"按钮
- 请求失败：`type="fail"` + "加载失败，请重试" + 重试按钮
- 无权限：`type="fail"` + "暂无权限，请联系管理员"

## 3. 状态声明

```tsx
// 用四态驱动展示：loading / error / empty / ready，避免 Loading 与 Empty 同时出现
type ViewState = 'loading' | 'error' | 'empty' | 'ready';
const [view, setView] = useState<ViewState>('loading');
```

## 4. 事件与交互逻辑

无事件。按状态切换渲染：

```tsx
{view === 'loading' ? <Loading type="local" isOpen /> : null}
{view === 'error' ? <Empty type="fail" description={<span>加载失败 <Button status="text" text="重试" onClick={reload} /></span>} /> : null}
{view === 'empty' ? <Empty type="success" description={keyword ? `未找到与「${keyword}」相关的结果` : '暂无数据'} /> : null}
{view === 'ready' ? <List rows={rows} /> : null}

// 自定义图 / 图标
<Empty imgSrc="./image/no-permission.png" description="暂无权限，请联系管理员" />
<Empty icon={<IconPlusIcPublicSearch />} description="换个关键字试试" />
```

## 5. 数据结构

```tsx
type ViewState = 'loading' | 'error' | 'empty' | 'ready';
```

## 6. 联动说明

- 请求开始 → `loading`；成功且 `rows.length === 0` → `empty`；成功有数据 → `ready`；失败 → `error`
- 空态里的"去新建"按钮 → 打开 `Dialog` 表单；"清空筛选"→ 重置筛选并重新请求
- 搜索关键字变化 → 空态文案带上关键字
- 有筛选条件时的空态与全量为空的空态文案区分（"无匹配" vs "尚未创建"）

## 7. 完整代码示例

```tsx
import React, { useEffect, useState } from 'react';
import Empty from '@nce/eview-react/Empty';
import Loading from '@nce/eview-react/Loading';
import Button from '@nce/eview-react/Button';
import SearchInput from '@nce/eview-react/SearchInput';

type ViewState = 'loading' | 'error' | 'empty' | 'ready';
const ALL = ['core-sw-01', 'core-sw-02', 'edge-rt-01'];

// 设备卡片区：四态渲染，空态区分"无匹配"和"尚未创建"，失败可重试
export default function DeviceCards() {
  const [keyword, setKeyword] = useState<string>('');
  const [rows, setRows] = useState<string[]>([]);
  const [view, setView] = useState<ViewState>('loading');
  const [reload, setReload] = useState<number>(0);

  useEffect(() => {
    setView('loading');
    const timer = setTimeout(() => {
      if (keyword === 'err') { setView('error'); return; }          // 模拟失败；真实项目替换为已有 Service
      const list = ALL.filter((d) => d.includes(keyword.trim()));
      setRows(list);
      setView(list.length === 0 ? 'empty' : 'ready');
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, reload]);

  return (
    <div style={{ width: 520, padding: 24 }}>
      <SearchInput placeholder="搜索设备" value={keyword} onChange={(v: string) => setKeyword(v)} onSearch={(v: string) => setKeyword(v)} onClear={() => setKeyword('')} />
      <div style={{ position: 'relative', minHeight: 240, marginTop: 16 }}>
        {view === 'loading' ? <Loading type="local" isOpen /> : null}
        {view === 'error' ? (
          <Empty type="fail" description={<span>加载失败 <Button status="text" text="重试" onClick={() => setReload((n) => n + 1)} /></span>} />
        ) : null}
        {view === 'empty' ? (
          <Empty
            type="success"
            description={keyword ? <span>未找到与「{keyword}」相关的设备 <Button status="text" text="清空筛选" onClick={() => setKeyword('')} /></span> : <span>尚未创建设备 <Button status="text" text="去新建" onClick={() => {}} /></span>}
          />
        ) : null}
        {view === 'ready' ? rows.map((d) => <div key={d} style={{ padding: '8px 0', borderBottom: '1px solid var(--colorDivider)' }}>{d}</div>) : null}
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 image / PRESENTED_IMAGE_SIMPLE / imageStyle
<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ height: 60 }} />

// ❌ 搜索无结果用了 fail 图（应为 success：加载成功但为 0）
<Empty type="fail" description="未找到结果" />

// ❌ 请求还没回来就先渲染 Empty，用户先看到"暂无数据"再看到数据
{rows.length === 0 ? <Empty /> : <List />}      // 少了 loading 态

// ❌ Table 外再叠 Empty，与 Table 自带空态重复
{rows.length === 0 ? <Empty /> : null}<Table dataset={rows} />

// ❌ 空态没有下一步动作（去新建 / 清空筛选 / 重试）
<Empty description="暂无数据" />
```

## 9. API 速查

> 压缩自 `Empty/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'success' \| 'fail'` | 加载成功无数据 / 失败（默认图） |
| `description` | `ReactNode` | 描述，可放按钮 |
| `icon` / `imgSrc` | `ReactNode` / `string` | 自定义图标 / 图片 |
| `className` / `style` | — | 最外层 |
