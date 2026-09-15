# Crumbs 组件功能逻辑规格（面包屑）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Crumbs/Crumbs`；官网组件页 Crumbs 及示例 `CrumbsBasic.jsx` / `CrumbsLinkExample.jsx` / `CrumbsIconExample.jsx` / `CrumbsIconPlus.jsx` / `CrumbsMultilExample.jsx`
>
> ⚠️ 组件名是 **`Crumbs`**（不是 Breadcrumb）；`data=[{ title, url?, enable?, icon? }]` 驱动，**最后一项不传 `url` 即当前页**；点击回调是组件级 `onClick(data, event)`，不是每项自己的 onClick。
> ⚠️ 分隔符属性拼写是 **`seprator`**（官方即如此），默认 `>`。
> ⚠️ 超过 `countLimit`（默认 6）项会自动折叠成下拉。

## 1. 功能定位

Crumbs 是面包屑导航：显示当前页路径，可点上级跳转，可带标题、图标、自定义分隔符。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 页面顶部路径导航 | `Crumbs data onClick` | antd `Breadcrumb items` / 手写 `<nav>` |
| 页内版块切换 | `Tab`（[Tab.md](Tab.md)） | Crumbs |
| 步骤进度 | `Steps`（[Steps.md](Steps.md)） | Crumbs |

## 2. 典型场景

- 三级路径"系统管理 / 用户管理 / 编辑用户"：前两级可点回跳
- 与路由集成：`onClick(data)` 里 `navigate(data.url)`
- 目录树式深路径：超过 6 级自动折叠
- 带"当前位置："标题：`title="当前位置"`

## 3. 状态声明

```tsx
// 面包屑数据通常由路由 / 页面层级派生，不需要独立 state
const crumbs: Crumb[] = useMemo(() => [
  { title: '系统管理', url: '/system' },
  { title: '用户管理', url: '/system/users' },
  { title: editing ? `编辑 ${editing.name}` : '新建用户' },        // 最后一项不传 url
], [editing]);
```

## 4. 事件与交互逻辑

```tsx
<Crumbs
  data={crumbs}
  seprator="/"                                       // 默认 >
  onClick={(item: Crumb, event) => {                 // 组件级回调；只有带 url 的项可点
    event.preventDefault?.();
    navigate(item.url!);                             // 与路由集成，不走 <a href> 整页刷新
  }}
/>

// 带标题 / 图标 / 折叠阈值
<Crumbs title="当前位置" data={crumbs} countLimit={4} itemTip />
```

## 5. 数据结构

```tsx
// Crumbs.data 每项（ICrumb）
interface Crumb {
  title: string;
  url?: string;          // 有 url 才可点；最后一项省略
  enable?: boolean;      // 是否禁用（api 描述如此）
  icon?: string;         // 图标 url
  id?: string | number;  // demo 里附带，便于 onClick 识别
}
```

## 6. 联动说明

- 路由变化 → 重新派生 `crumbs`；不要手动维护一份与路由脱节的数组
- 点击上级 → 路由跳转 + 当前页未保存修改时先确认（`MessageDialog`）
- 详情页标题随对象名变化 → 最后一项 `title` 跟随 state

## 7. 完整代码示例

```tsx
import React, { useMemo, useState } from 'react';
import Crumbs from '@nce/eview-react/Crumbs';
import Button from '@nce/eview-react/Button';

interface Crumb { title: string; url?: string; id?: string; }

// 模拟三级页面导航：面包屑随当前层级派生，点击上级回跳
export default function UserAdminShell() {
  const [level, setLevel] = useState<'list' | 'edit'>('list');
  const [current, setCurrent] = useState<string>('');

  const crumbs: Crumb[] = useMemo(() => {
    const base: Crumb[] = [{ id: 'sys', title: '系统管理', url: '/system' }, { id: 'users', title: '用户管理', url: level === 'edit' ? '/system/users' : undefined }];
    return level === 'edit' ? [...base, { id: 'edit', title: `编辑 ${current}` }] : base;
  }, [level, current]);

  const handleCrumbClick = (item: Crumb, event: any) => {
    event?.preventDefault?.();
    if (item.id === 'users') setLevel('list');           // 真实项目：navigate(item.url)
    if (item.id === 'sys') alert('跳转到系统管理');
  };

  return (
    <div style={{ padding: 24 }}>
      <Crumbs data={crumbs} seprator="/" onClick={handleCrumbClick} style={{ marginBottom: 16 }} />
      {level === 'list' ? (
        <div>
          {['张三', '李四'].map((u) => (
            <div key={u} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
              <span>{u}</span>
              <Button status="text" text="编辑" onClick={() => { setCurrent(u); setLevel('edit'); }} />
            </div>
          ))}
        </div>
      ) : (
        <div>正在编辑 {current}<Button status="text" text="返回列表" onClick={() => setLevel('list')} /></div>
      )}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 Breadcrumb / items / separator / Breadcrumb.Item
<Breadcrumb items={[{ title: '首页', href: '/' }]} separator="/" />
<Breadcrumb.Item>用户</Breadcrumb.Item>

// ❌ 分隔符按正确英文写 separator（官方拼写是 seprator）
<Crumbs separator="/" />

// ❌ 每项写自己的 onClick（组件只有一个 onClick(data, event)）
data={[{ title: '首页', onClick: goHome }]}

// ❌ 最后一项也传 url，当前页变成可点链接
data={[{ title: '用户管理', url: '/users' }, { title: '编辑', url: '/users/edit' }]}

// ❌ 手写 <nav> 面包屑（Crumbs 已覆盖，不再需要第三层手写）
<nav aria-label="breadcrumb">…</nav>
```

## 9. API 速查

> 压缩自 `Crumbs/Crumbs`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `Array<{ title, url?, enable?, icon? }>`，**必填** | 路径项；有 `url` 才可点 |
| `onClick` | `(data, event) => void` | 点击带链接的项 |
| `title` | `string` | 面包屑前的标题，如"当前位置" |
| `seprator` | `string`，默认 `>` | 分隔符（拼写照官方） |
| `splitIcon` | `string` | 自定义分隔图标 url |
| `countLimit` | `number`，默认 `6` | 超过则折叠为下拉 |
| `itemTip` | `boolean`，默认 `false` | 悬浮显示项文本提示 |
| `itemStyle` / `style` / `className` / `id` | — | 样式与标识 |
