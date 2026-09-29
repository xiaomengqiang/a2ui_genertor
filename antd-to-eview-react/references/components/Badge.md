# Badge 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Badge/types`；官网组件页 Badge 及示例 `BadgeBasic.jsx` / `BadgeMax.jsx` / `BadgeStatus.jsx` / `BadgeChildren.jsx` / `BadgeOffset.jsx` / `BadgeChange.jsx`

## 1. 功能定位

Badge 是新事件 / 新消息的标记：包裹一个元素时显示在右上角（数字、文字或红点），不包裹时独立使用（状态点 + 文字）。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 图标 / 按钮右上角的未读数 | `<Badge content={n}>子元素</Badge>` | antd 的 `count` |
| 只要一个红点 | `<Badge dot>` | `content="."` |
| 状态点 + 文字（在线 / 离线 / 告警） | `<Badge dot status="success" text="在线" />` | 自己画圆点 |
| 表格里的状态列 | `Badge status` 或 `Tag color`（[Tag.md](Tag.md)） | — |

## 2. 典型场景

- 顶栏消息图标的未读数：超过 99 显示 `99+`，为 0 时隐藏
- 页签标题旁的待办数（配合 [Tab.md](Tab.md) 的 `titleExtraContent`）
- 列表 / 表格里的运行状态：`status` 五色状态点 + `text`
- 实时刷新的计数：`content` 绑定 state，`showZero` 控制归零时是否仍显示

## 3. 状态声明

```tsx
// 未读数来自接口或推送，直接作为 content
const [unread, setUnread] = useState<number>(0);

// 状态映射：业务状态码 → Badge.status，集中一处维护
const STATUS_MAP: Record<string, { status: 'default' | 'success' | 'error' | 'warning' | 'off'; text: string }> = {
  running: { status: 'success', text: '运行中' },
  alarm: { status: 'error', text: '告警' },
  degraded: { status: 'warning', text: '降级' },
  stopped: { status: 'off', text: '已停止' },
  unknown: { status: 'default', text: '未知' },
};
```

## 4. 事件与交互逻辑

Badge 本身没有事件；交互在被包裹的子元素上。

```tsx
// 未读数：0 不显示（默认），超 99 显示 99+（默认 max=99）
<Badge content={unread}>
  <Button text="消息" onClick={openInbox} />
</Badge>

// 归零仍要显示 "0"（如统计面板）
<Badge content={count} showZero>…</Badge>

// 自定义上限
<Badge content={total} max={999}>…</Badge>

// 只用红点提示"有新内容"
<Badge dot={hasNew}>…</Badge>          // dot 为 false 时不渲染红点

// 状态点：独立使用，不包裹子元素
const s = STATUS_MAP[row.state] ?? STATUS_MAP.unknown;
<Badge dot status={s.status} text={s.text} />

// 位置微调：[left, top] 距默认位置的偏移
<Badge content={5} offset={[10, 10]}>…</Badge>
```

## 5. 数据结构

```tsx
// 一条带状态的列表行
interface DeviceRow {
  id: string;
  name: string;
  state: 'running' | 'alarm' | 'degraded' | 'stopped' | 'unknown';
  unread: number;
}
```

## 6. 联动说明

- 打开消息面板 / 已读操作 → `setUnread(0)` → Badge 自动隐藏（`content` 为 0 且未 `showZero`）
- 轮询 / 推送更新计数 → 只改 `content`，不需要重新挂载
- 状态点的 `status` 由业务状态映射得出，映射表与 [Tag.md](Tag.md) 的状态色保持同一语义（success / warning / error）
- 作为 Tab 标题附件时，`content` 与页签内列表的未处理数同源

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import Badge from '@nce/eview-react/Badge';
import Button from '@nce/eview-react/Button';

interface DeviceRow {
  id: string;
  name: string;
  state: 'running' | 'alarm' | 'degraded' | 'stopped';
  unread: number;
}

const STATUS_MAP: Record<DeviceRow['state'], { status: 'success' | 'error' | 'warning' | 'off'; text: string }> = {
  running: { status: 'success', text: '运行中' },
  alarm: { status: 'error', text: '告警' },
  degraded: { status: 'warning', text: '降级' },
  stopped: { status: 'off', text: '已停止' },
};

// 设备列表：顶部消息按钮带未读总数，每行状态点 + 未读告警数，点击行标记已读
export default function DeviceList() {
  const [rows, setRows] = useState<DeviceRow[]>([
    { id: 'd1', name: 'core-sw-01', state: 'running', unread: 3 },
    { id: 'd2', name: 'core-sw-02', state: 'alarm', unread: 120 },
    { id: 'd3', name: 'edge-rt-01', state: 'stopped', unread: 0 },
  ]);

  const totalUnread = rows.reduce((sum, r) => sum + r.unread, 0);

  const markRead = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, unread: 0 } : r)));
  };

  return (
    <div style={{ width: 480, padding: 24 }}>
      <Badge content={totalUnread} max={999}>
        <Button text="全部告警" onClick={() => setRows((prev) => prev.map((r) => ({ ...r, unread: 0 })))} />
      </Badge>

      <div style={{ marginTop: 24 }}>
        {rows.map((row) => {
          const s = STATUS_MAP[row.state];
          return (
            <div
              key={row.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}
            >
              <Badge dot status={s.status} text={`${row.name} · ${s.text}`} />
              <Badge content={row.unread}>
                <Button size="small" text="查看" onClick={() => markRead(row.id)} />
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：eview Badge 没有 count / overflowCount / size / color
<Badge count={5} overflowCount={99} size="small" color="red" />

// ❌ 想要红点却塞字符
<Badge content=".">…</Badge>

// ❌ status 写成 Tag 的色名（Badge 是 default/success/error/warning/off，没有 danger/caution）
<Badge dot status="danger" text="告警" />

// ❌ 有 status 但没有 text，独立使用时只剩一个孤零零的点
<Badge dot status="success" />

// ❌ 计数归零后仍想隐藏，却传了 showZero
<Badge content={0} showZero>…</Badge>
```

## 9. API 速查

> 压缩自 `Badge/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `content` | `ReactNode \| string \| number` | 徽标内容；`null` / `undefined` / `''` / 不传则不显示 |
| `dot` | `boolean`，默认 `false` | 只显示小红点，不显示数字 |
| `max` | `number`，默认 `99` | 超过显示 `{max}+`，仅 `content` 为数字时生效 |
| `showZero` | `boolean` | 数值为 0 时是否显示 |
| `status` | `'default' \| 'success' \| 'error' \| 'warning' \| 'off'` | 设为状态点 |
| `text` | `ReactNode \| string` | 状态点旁的文字，需先设 `status` |
| `offset` | `[number, number]` | 位置偏移 `[left, top]` |
| `children` | `ReactNode` | 被包裹的元素；不传即独立使用 |
| `badgeClassName` / `badgeStyle` | `string` / `CSSProperties` | 徽标本身样式 |
| `id` / `className` / `style` | — | 最外层容器 |
