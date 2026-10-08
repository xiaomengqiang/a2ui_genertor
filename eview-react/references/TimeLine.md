# TimeLine 组件功能逻辑规格（时间轴）

> ⚠️ 导入名是 `TimeLine`，不是 `Timeline`。使用 `data` 数组，不使用 `Timeline.Item` 或 antd 的 `items`。
> ⚠️ `render` 收到的是某一节点的 **`content`**，不是整个节点，也不是全部 `data`。类型表返回值为 `void`，实现直接渲染回调结果，支持 JSX / ReactNode；返回 JSX 的函数也可赋给此 void 回调类型。
> ⚠️ 自定义 `icon` 只确认支持图标路径；没有确认 JSX 图标元素可直接传入。无需自定义时使用 `iconType`，不把其他组件的 `iconUrl` 套进来。
> 本文行为以 R26.0-NCE 3.10.36+6 源码核验为依据；其他版本仅采用明确核对过的结论，不视为已在目标工程运行通过，见[版本边界](patterns/project-setup.md)。

## 1. 功能定位

TimeLine 展示按时间组织的事件、操作记录和执行历史。排序、筛选、加载和点击后的业务操作由页面管理。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 审批记录、操作日志、任务历史 | `TimeLine data + render` | antd `Timeline.Item` |
| 创建向导与可回跳步骤 | [Steps](Steps.md) | 给 TimeLine 添加 `currentStep` |
| 带列、分页与批量操作的日志列表 | [Table](Table.md) | 让时间轴承接表格交互 |

## 2. 典型场景

- 审批历史：时间、操作者、结果和说明按业务指定顺序展示。
- 执行记录：用 `success` / `error` / `default` 区分结果，并保留文字状态。
- 节点详情：在 `render` 的内容里放 Button，点击查看相应事件。
- 失败筛选：业务过滤 `data`，无匹配记录时展示空态。

## 3. 状态声明

```tsx
const [onlyErrors, setOnlyErrors] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
// 原始事件另存业务 ID 和数值时间戳；TimeLine 的 date 只是展示文字
const visibleEvents = events
  .filter((event) => !onlyErrors || event.status === 'error')
  .slice()
  .sort((a, b) => a.occurredAt - b.occurredAt);
```

不要为纯展示节点维护“当前步骤”。选中详情是业务状态，不存在已记录的 `selectedValue` / `activeKey` 属性。

## 4. 事件与交互逻辑

```tsx
<TimeLine
  title="处理记录"
  data={[{ date: '2026-10-08 09:00', iconType: 'success',
    content: [{ title: '审核通过', text: '材料齐全' }] }]}
  render={(content = []) => (
    <div>{content.map((item, index) => (
      <div key={index}><strong>{item.title}</strong><p>{item.text}</p></div>
    ))}</div>
  )}
/>
```

- 组件没有已记录的 `onClick`、`onChange` 或 ref 方法；点击入口放在 `render` 返回的业务内容内。
- `render` 返回 React 内容；不要拼 HTML 再通过 `dangerouslySetInnerHTML` 展示日志。
- `content` 可由业务定义结构，但结构必须与自己的 `render` 配对。最稳妥的默认结构是 `{ title, text }[]`。
- 标题 `title` 与时间文字 `date` 属于节点；组件级 `title` 则是整条时间轴标题，三者不要混用。
- 不假设组件会按 `date` 自动排序。使用原始数值时间戳排序后生成展示文案，也不直接修改传入的事件数组。

## 5. 数据结构

```tsx
interface TimeLineItem {
  title?: string;
  date?: string;
  iconType?: 'success' | 'error' | 'default'; // 默认 default
  icon?: string;                           // 自定义图标路径；未确认 JSX
  iconStyle?: React.CSSProperties;
  iconClassName?: string;
  customKey?: string;                      // 业务使用唯一字符串标识
  content: Array<{ title: string; text?: string }>;
}
```

这是面向示例的业务子集。`data` 描述也出现字符串 `content`，但完整示例均将数组交给 `render`；不把某一种业务结构宣称为组件唯一支持的类型。

`customKey` 可作为自定义 ID；它如何参与内部节点复用未验证，不将其等同于 React 的 `key` 契约。业务详情关联仍使用自己的 ID。

## 6. 联动说明

- 切换工单或任务 → 请求相应历史；处理 loading / error / empty，旧请求不能覆盖新对象的记录。
- 筛选变化 → 从原始事件重新派生节点；当前详情不再可见时清空或隐藏详情。
- 收到新事件 → 用新数组更新业务数据并重新排序，避免原地 `push` 后显示不更新。
- 需要重试操作 → 在节点内容中放 Button，请求期间禁用并防重复；状态仅在业务结果返回后更新。
- 图标外观不作为唯一结果标记；成功、失败和处理中应有文字可读。

## 7. 完整代码示例

示例接收已加载的事件，提供失败筛选与详情查看；接口加载由外层页面负责。

```tsx
import React, { useState } from 'react';
import TimeLine from '@nce/eview-react/TimeLine';
import Button from '@nce/eview-react/Button';

interface HistoryEvent {
  id: string;
  occurredAt: number;
  status: 'success' | 'error' | 'default';
  title: string;
  actor: string;
  detail: string;
}
export default function ApprovalHistory({ events }: { events: HistoryEvent[] }) {
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visibleEvents = events
    .filter((event) => !onlyErrors || event.status === 'error')
    .slice().sort((a, b) => a.occurredAt - b.occurredAt);
  const selected = visibleEvents.find((event) => event.id === selectedId);
  const data = visibleEvents.map((event) => ({
    customKey: event.id,
    title: event.title,
    date: new Date(event.occurredAt).toLocaleString('zh-CN', { hour12: false }),
    iconType: event.status,
    content: [{ title: event.actor, text: event.detail, eventId: event.id }],
  }));

  const renderContent = (content: Array<{ [key: string]: any }> = []) => (
    <div className="app-history-content">
      {content.map((item) => (
        <div key={item.eventId}>
          <strong>{item.title}</strong><p>{item.text}</p>
          <Button text="查看详情" status="text" onClick={() => setSelectedId(item.eventId)} />
        </div>
      ))}
    </div>
  );

  return (
    <section className="app-approval-history">
      <Button text={onlyErrors ? '查看全部' : '仅看失败'} onClick={() => {
        setOnlyErrors((value) => !value);
        setSelectedId(null);
      }} />
      {data.length > 0
        ? <TimeLine title="审批记录" data={data} render={renderContent} />
        : <p role="status">{onlyErrors ? '没有失败记录' : '暂无审批记录'}</p>}
      {selected && <aside aria-label="事件详情">
        <h3>{selected.title}</h3><p>{selected.detail}</p>
        <Button text="关闭详情" onClick={() => setSelectedId(null)} />
      </aside>}
    </section>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 的命名、items 和 Item 子组件
<Timeline items={items}><Timeline.Item>已完成</Timeline.Item></Timeline>

// ❌ antd 的 pending/reverse/mode 没有对应接口；顺序在业务数据里处理
<TimeLine data={data} pending="处理中" reverse mode="alternate" />

// ❌ render 收到 content，不是整个节点
<TimeLine data={data} render={(node) => <div>{node.date}</div>} />

// ❌ iconType 不接受 antd 风格的颜色或 warning；警告可用 default + 文字
<TimeLine data={[{ iconType: 'red', content: [] }]} />
```

## 9. API 速查

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `dataType[]` | 节点数组；字段见 §5 |
| `render` | `(content?: { [key: string]: any }[]) => void`（原声明） | 实现渲染返回的 JSX / ReactNode；入参是当前节点 content |
| `title` | `string` | 整条时间轴标题 |
| `titleClassName` / `titleStyle` | `string` / `React.CSSProperties` | 标题样式 |
| `iconClassName` / `iconStyle` | `string` / `React.CSSProperties` | 图标样式 |
| `contentClassName` / `contentStyle` | `string` / `React.CSSProperties` | 右侧内容外层样式 |
| `dateClassName` / `dateStyle` | `string` / `React.CSSProperties` | 左侧日期外层样式 |
| `id` / `className` / `style` | `string` / `string` / `React.CSSProperties` | 组件标识与样式 |

没有独立节点组件、内置业务点击回调或已记录的 ref 方法；无需为纯展示伪造这些接口。
