# 图标（icon+ 与 IconButton）功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Icon/Icon`、`IconButton/IconButton`；官网组件页 Icon 及示例 `IconBasic.jsx` / `IconPlusBasic.jsx` / `IconPlusType.jsx` / `IconPlusSize.jsx`、IconButton 及示例 `Basic.tsx` / `IconPlus.tsx` / `BubbleDirection.tsx` / `Disabled.tsx` / `Event.tsx`
>
> ⚠️ 官网首推 **icon+ 图标库**：`import { IconPlusIcPublicSearch } from '@nce/icon-plus'`，按需引入，2000+ 图标，`type="filled"` 换风格、`iconColor={['red']}` 换色、`iconSize` 换尺寸（只能取 12/14/16/20/24/32/36/40/48/60）。
> ⚠️ 内置 `Icon name="ict_xxx"` 组件**已被 icon+ 替代、不再推荐**；下文示例统一用 icon+ 组件。真实 icon+ 名迁移时用 icon-plus 接口（`getIconInfo`）按 antd/Lucide 名 keyword 查得（见 antd-to-eview-react/source-project-guidelines §3.3），本文示例的 icon+ 组件名仅为示意。
> ⚠️ 只有图标、要点击、要气泡提示 → 用 **`IconButton`**，不要给图标组件挂 onClick 再自己写 title。

## 1. 功能定位

icon+（`@nce/icon-plus`）是组件库首推的图标方案，按需引入、2000+ 图标，可换风格 / 颜色 / 尺寸；IconButton 是"纯图标按钮 + 气泡提示"，用于表格操作列、卡片角落等小面积区域。内置 `Icon` 组件已被 icon+ 替代、不再推荐。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 装饰性图标 / 状态图标 | icon+ 组件 | antd `@ant-design/icons` 或内置 `Icon name` |
| 可点击的图标操作（编辑 / 删除 / 刷新） | `IconButton iconName={<IconPlus* />} tipText onClick` | 给图标组件挂 onClick |
| 文字 + 图标按钮 | `Button leftIcon={<IconPlusXxx />}`（[Button.md](Button.md)） | IconButton 加文字 |
| 一组图标操作 | `IconButtonGroup`（未覆盖） | 多个 IconButton 手排 |

## 2. 典型场景

- 表格操作列：编辑 / 删除两个 `IconButton`，悬浮显示 `tipText`
- 状态列图标：icon+ 的成功 / 告警图标 + 文字
- 卡片右上角"更多"图标按钮
- 标题旁的帮助图标：`IconButton iconName={<IconPlusIcPublicTips />} tipContent={<div>说明</div>}`

## 3. 状态声明

```tsx
// 图标本身无状态；IconButton 的 disabled / loading 由业务 state 派生
const [deleting, setDeleting] = useState<Set<string>>(new Set());
```

## 4. 事件与交互逻辑

### icon+ 图标（首选）

```tsx
import { IconPlusIcPublicSearch, IconPlusIcPublicTrash, IconPlusIcPublicEdit } from '@nce/icon-plus';
<IconPlusIcPublicSearch />
<IconPlusIcPublicEdit />
<IconPlusIcPublicTrash type="filled" iconColor={['currentColor']} iconSize={20} />   // 示例继承业务容器的文字颜色
```

### IconButton：图标操作 + 气泡

```tsx
<IconButton iconName={<IconPlusIcPublicEdit />} tipText="编辑" tipData={{ direction: 'top' }} onClick={() => openEdit(row)} />
<IconButton iconName={<IconPlusIcPublicTrash />} tipText="删除" disabled={deleting.has(row.id)} onClick={() => askDelete(row)} />
<IconButton iconName={<IconPlusIcPublicTips />} tipContent={<div style={{ maxWidth: '16rem' }}>该操作会同步到所有节点</div>} tipData={{ direction: 'right', arrowDirection: 'none' }} enableClickHideTip />
```

## 5. 数据结构

```tsx
// 操作列配置：集中定义图标、提示、权限
interface RowAction<T> {
  key: string;
  iconName: string | React.ReactElement;
  tip: string;
  visible?: (row: T) => boolean;
  onClick: (row: T) => void;
}
```

## 6. 联动说明

- 操作列 IconButton → 编辑打开 Dialog / Drawer，删除打开 MessageDialog；处理中 `disabled`
- 权限 → `visible(row)` 决定是否渲染该 IconButton（隐藏时相邻 `Divider type="vertical"` 一起隐藏）
- 业务状态决定用哪个 icon+ 组件；自定义颜色 / 风格通过 icon+ 的 `iconColor` / `type` 传入

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import IconButton from '@nce/eview-react/IconButton';
import Divider from '@nce/eview-react/Divider';
import { IconPlusIcPublicCheck, IconPlusIcPublicAbout, IconPlusIcPublicEdit, IconPlusIcPublicRefresh, IconPlusIcPublicTrash } from '@nce/icon-plus';

interface Device { id: string; name: string; state: 'ok' | 'alarm'; canDelete: boolean; }

// 设备列表操作列：状态图标 + 编辑 / 刷新 / 删除图标按钮（权限控制显隐，处理中禁用）
export default function DeviceRows() {
  const [rows, setRows] = useState<Device[]>([
    { id: 'd1', name: 'core-sw-01', state: 'ok', canDelete: true },
    { id: 'd2', name: 'core-sw-02', state: 'alarm', canDelete: false },
  ]);
  const [busy, setBusy] = useState<Set<string>>(new Set());

  const run = async (id: string, action: () => Promise<void>) => {
    if (busy.has(id)) return;
    setBusy((s) => new Set(s).add(id));
    try { await action(); } finally { setBusy((s) => { const n = new Set(s); n.delete(id); return n; }); }
  };

  return (
    <div style={{ width: 520, padding: 24 }}>
      {rows.map((row) => (
        <div key={row.id} className="app-device-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <span className={`app-device-state app-device-state-${row.state}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {row.state === 'ok' ? <IconPlusIcPublicCheck /> : <IconPlusIcPublicAbout />}
            {row.name}
          </span>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton iconName={<IconPlusIcPublicEdit />} tipText="编辑" disabled={busy.has(row.id)} onClick={() => alert(`编辑 ${row.name}`)} />
            <Divider type="vertical" />
            <IconButton iconName={<IconPlusIcPublicRefresh />} tipText="刷新状态" disabled={busy.has(row.id)} onClick={() => run(row.id, async () => { await new Promise((r) => setTimeout(r, 400)); setRows((prev) => prev.map((d) => (d.id === row.id ? { ...d, state: 'ok' } : d))); })} />
            {row.canDelete ? (
              <>
                <Divider type="vertical" />
                <IconButton iconName={<IconPlusIcPublicTrash />} tipText="删除" tipData={{ direction: 'top' }} disabled={busy.has(row.id)} onClick={() => run(row.id, async () => { await new Promise((r) => setTimeout(r, 300)); setRows((prev) => prev.filter((d) => d.id !== row.id)); })} />
              </>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 图标库
import { EditOutlined } from '@ant-design/icons';

// ❌ 用内置 Icon name="ict_*"（已下线），改用 icon+ 组件
<Icon name="ict_trash" />

// ❌ 给图标组件挂 onClick 当按钮用，没有气泡提示、没有禁用态、键盘不可达 → 用 IconButton
<IconPlusIcPublicTrash onClick={remove} />

// ❌ icon+ 尺寸随意写（只能 12/14/16/20/24/32/36/40/48/60）
<IconPlusIcPublicTrash iconSize={18} />

// ❌ IconButton 的提示同时传 tipText 和 tipContent（二选一）
<IconButton tipText="删除" tipContent={<div>删除</div>} />
```

## 9. API 速查

> 压缩自 `IconButton/IconButton`；icon+ 用法来自 Icon 页 README 与 demo。内置 `Icon/Icon` 组件已被 icon+ 替代、不再推荐，其 API 不再列入。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `IconButton.iconName` | `string \| ReactElement` | icon+ 组件（推荐，如 `<IconPlusIcPublicTrash />`）；也收 `ict_*` 名但不再推荐 |
| `IconButton.iconUrl` / `hoverIconUrl` / `disabledIconUrl` | `string` | 图片三态，仅自定义图片；默认用 `iconName={<IconPlusIc* />}` |
| `IconButton.iconProps` | `{ color, hoverColor, disabledColor }` | 配 `iconName` 用 |
| `IconButton.tipText` / `tipContent` | `string` / `any` | 气泡文本 / 自定义内容（二选一） |
| `IconButton.tipData` | `{ direction: 'top' \| 'bottom' \| 'left' \| 'right', arrowDirection?: 'none', disposeTimeOut? }` | 气泡方向 / 无箭头 |
| `IconButton.enableClickHideTip` | `boolean`，默认 `false` | 点击后隐藏气泡 |
| `IconButton.disabled` / `size` | `boolean` / `any` | 禁用 / 尺寸（数字、rem、px） |
| `IconButton.onClick` / `onKeyDown` / `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` | `(event) => void` | 事件 |
| icon+ 组件 `type` / `iconColor` / `iconSize` | `'filled' …` / `string[]` / `12…60` | 风格 / 颜色数组 / 尺寸 |
