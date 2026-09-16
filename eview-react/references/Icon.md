# Icon 组件功能逻辑规格（含 IconButton 与 icon+ 图标库用法）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Icon/Icon`、`IconButton/IconButton`；官网组件页 Icon 及示例 `IconBasic.jsx` / `IconPlusBasic.jsx` / `IconPlusType.jsx` / `IconPlusSize.jsx`、IconButton 及示例 `Basic.tsx` / `IconPlus.tsx` / `BubbleDirection.tsx` / `Disabled.tsx` / `Event.tsx`
>
> ⚠️ 官网首推 **icon+ 图标库**：`import { IconPlusIcPublicSearch } from '@hui/icon-plus'`，按需引入，2000+ 图标，`type="filled"` 换风格、`iconColor={['red']}` 换色、`iconSize` 换尺寸（只能取 12/14/16/20/24/32/36/40/48/60）。组件库内置 `Icon name="ict_xxx"` 是老路径，仍可用。
> ⚠️ icon+ 的包名：Icon 页 README 写 `@hui/icon-plus`，工程配置文档写 `@nce/icon-plus`（见 project-setup 待实测），代码里按 demo 用 `@hui/icon-plus`。
> ⚠️ 只有图标、要点击、要气泡提示 → 用 **`IconButton`**，不要给 `Icon` 挂 onClick 再自己写 title。

## 1. 功能定位

Icon 渲染组件库内置图标（`name`）或自定义图片（`iconUrl`），可设颜色 / 悬浮色 / 尺寸 / 禁用；IconButton 是"纯图标按钮 + 气泡提示"，用于表格操作列、卡片角落等小面积区域。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 装饰性图标 / 状态图标 | icon+ 组件（首选）或 `Icon name` | antd `@ant-design/icons` |
| 可点击的图标操作（编辑 / 删除 / 刷新） | `IconButton iconName tipText onClick` | `Icon onClick` |
| 文字 + 图标按钮 | `Button leftIcon={<IconPlusXxx />}`（[Button.md](Button.md)） | IconButton 加文字 |
| 一组图标操作 | `IconButtonGroup`（未覆盖） | 多个 IconButton 手排 |

## 2. 典型场景

- 表格操作列：编辑 / 删除两个 `IconButton`，悬浮显示 `tipText`
- 状态列图标：icon+ 的成功 / 告警图标 + 文字
- 卡片右上角"更多"图标按钮
- 标题旁的帮助图标：`IconButton iconName="ict_tips" tipContent={<div>说明</div>}`

## 3. 状态声明

```tsx
// 图标本身无状态；IconButton 的 disabled / loading 由业务 state 派生
const [deleting, setDeleting] = useState<Set<string>>(new Set());
```

## 4. 事件与交互逻辑

### icon+ 图标（首选）

```tsx
import { IconPlusIcPublicSearch, IconPlusIcPublicTrash } from '@hui/icon-plus';
<IconPlusIcPublicSearch />
<IconPlusIcPublicTrash type="filled" iconColor={['currentColor']} iconSize={20} />   // 示例继承业务容器的文字颜色
```

### 内置 Icon

```tsx
<Icon name="ict_chevronDown" />                                   // 标准图标：浅色主题线性、深色主题面性，自带 hover
<Icon name="ict_trash" color="currentColor" hoverColor="currentColor" isStandard={false} size={[20, 20]} />   // 自定颜色必须 isStandard={false}
<Icon iconUrl="./image/custom.svg" size={[24, 24]} title="自定义" />
```

### IconButton：图标操作 + 气泡

```tsx
<IconButton iconName="ict_edit" tipText="编辑" tipData={{ direction: 'top' }} onClick={() => openEdit(row)} />
<IconButton iconName={<IconPlusIcPublicTrash />} tipText="删除" disabled={deleting.has(row.id)} onClick={() => askDelete(row)} />   // iconName 也接受 icon+ 组件
<IconButton iconName="ict_tips" tipContent={<div style={{ maxWidth: '16rem' }}>该操作会同步到所有节点</div>} tipData={{ direction: 'right', arrowDirection: 'none' }} enableClickHideTip />
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
- 业务状态决定图标名称；自定义颜色通过组件已支持的属性传入，取值由业务项目提供
- 标准图标自带主题与悬浮效果；自定义颜色时设置 `isStandard={false}`

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import IconButton from '@nce/eview-react/IconButton';
import Icon from '@nce/eview-react/Icon';
import Divider from '@nce/eview-react/Divider';

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
            <Icon name={row.state === 'ok' ? 'ict_checkmask' : 'ict_about'} color="currentColor" isStandard={false} />
            {row.name}
          </span>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton iconName="ict_edit" tipText="编辑" disabled={busy.has(row.id)} onClick={() => alert(`编辑 ${row.name}`)} />
            <Divider type="vertical" />
            <IconButton iconName="ict_export" tipText="刷新状态" disabled={busy.has(row.id)} onClick={() => run(row.id, async () => { await new Promise((r) => setTimeout(r, 400)); setRows((prev) => prev.map((d) => (d.id === row.id ? { ...d, state: 'ok' } : d))); })} />
            {row.canDelete ? (
              <>
                <Divider type="vertical" />
                <IconButton iconName="ict_trash" tipText="删除" tipData={{ direction: 'top' }} disabled={busy.has(row.id)} onClick={() => run(row.id, async () => { await new Promise((r) => setTimeout(r, 300)); setRows((prev) => prev.filter((d) => d.id !== row.id)); })} />
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

// ❌ 给 Icon 挂 onClick 当按钮用，没有气泡提示、没有禁用态、键盘不可达
<Icon name="ict_trash" onClick={remove} />

// ❌ 标准图标改颜色不加 isStandard={false}，颜色不生效
<Icon name="ict_trash" color="red" />

// ❌ icon+ 尺寸随意写（只能 12/14/16/20/24/32/36/40/48/60）
<IconPlusIcPublicTrash iconSize={18} />

// ❌ IconButton 的提示同时传 tipText 和 tipContent（二选一）
<IconButton tipText="删除" tipContent={<div>删除</div>} />
```

## 9. API 速查

> 压缩自 `Icon/Icon` / `IconButton/IconButton`；icon+ 用法来自 Icon 页 README 与 demo。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `Icon.name` | `string` | 内置图标名，如 `ict_chevronDown` / `ict_trash` / `ict_edit` |
| `Icon.iconUrl` | `string` | 自定义图片 |
| `Icon.isStandard` | `boolean`，默认 `true` | 标准图标（自带主题与 hover）；改色必须设 false |
| `Icon.color` / `hoverColor` / `pressColor` / `disabledColor` | `string` | 各态颜色 |
| `Icon.size` | `[w, h]`，默认 `[16, 16]` | 尺寸 |
| `Icon.disabled` / `disabledFocus` | `boolean` | 禁用 |
| `Icon.onClick` / `onKeyDown` | `(event) => void` | 事件（可点击场景建议用 IconButton） |
| `Icon.title` / `isShowIconTitle` | `string` / `boolean`（默认 true） | 原生 title |
| `IconButton.iconName` | `string \| ReactElement` | 内置图标名或 icon+ 组件 |
| `IconButton.iconUrl` / `hoverIconUrl` / `disabledIconUrl` | `string` | 图片三态 |
| `IconButton.iconProps` | `{ color, hoverColor, disabledColor }` | 配 `iconName` 用 |
| `IconButton.tipText` / `tipContent` | `string` / `any` | 气泡文本 / 自定义内容（二选一） |
| `IconButton.tipData` | `{ direction: 'top' \| 'bottom' \| 'left' \| 'right', arrowDirection?: 'none', disposeTimeOut? }` | 气泡方向 / 无箭头 |
| `IconButton.enableClickHideTip` | `boolean`，默认 `false` | 点击后隐藏气泡 |
| `IconButton.disabled` / `size` | `boolean` / `any` | 禁用 / 尺寸（数字、rem、px） |
| `IconButton.onClick` / `onKeyDown` / `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` | `(event) => void` | 事件 |
| icon+ 组件 `type` / `iconColor` / `iconSize` | `'filled' …` / `string[]` / `12…60` | 风格 / 颜色数组 / 尺寸 |
