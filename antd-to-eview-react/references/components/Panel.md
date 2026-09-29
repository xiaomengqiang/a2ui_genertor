# Panel 组件功能逻辑规格（含 PanelItem，折叠面板）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Panel/Panel`、`Panel/PanelItem`；官网组件页 Panel 及示例 `PanelMultipleExample.jsx` / `PanelExample.jsx` / `PanelNestExample.jsx` / `PanelEventExample.jsx`
>
> ⚠️ 导入是 `import Panel, { PanelItem } from '@nce/eview-react/Panel'`，**children 驱动**（同 Tab）；展开态受控用 `selectedIndex`（**数组**，即使手风琴模式也是数组）+ `onExpand(index, event)` / `onClose(index, event, collapsed)`。
> ⚠️ `PanelItem.closable` 默认 **true**——会在标题栏显示"移除"按钮；表单分组面板通常要显式 `closable={false}`。

## 1. 功能定位

Panel 是折叠面板：多个 `PanelItem` 可同时展开或手风琴互斥，用于表单分组、详情分区、可折叠的说明区。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 长表单按区块折叠 | `Panel enableMultiExpand` + `PanelItem closable={false}` | antd `Collapse items` |
| 每次只展开一块（手风琴） | `Panel enableMultiExpand={false}` | 多个 Panel |
| 平级内容切换 | `Tab`（[Tab.md](Tab.md)） | Panel |
| 不折叠的卡片区块 | `Card`（未覆盖）或手写卡片（fallback-handwrite §4.1） | Panel |

## 2. 典型场景

- 新建资源长表单："基本信息 / 网络配置 / 高级选项"三块，默认展开前两块
- 详情页分区：手风琴模式，一次看一块
- 面板内嵌表格（demo PanelMultipleExample）
- 可移除的面板：`closable` + `onClose(index, event, collapsed)` 区分"折叠"还是"点了移除"

## 3. 状态声明

```tsx
// 展开的下标数组（受控）
const [openIdx, setOpenIdx] = useState<number[]>([0, 1]);

// 可移除面板：用数组驱动 children，移除 = 从数组删
const [sections, setSections] = useState<Section[]>(initialSections);
```

## 4. 事件与交互逻辑

```tsx
<Panel
  enableMultiExpand                                   // 可多个同时展开；false 为手风琴
  selectedIndex={openIdx}
  onExpand={(index: number, event) => setOpenIdx((prev) => (prev.includes(index) ? prev : [...prev, index]))}
  onClose={(index: number, event, collapsed: boolean) => {
    if (collapsed) setOpenIdx((prev) => prev.filter((i) => i !== index));   // 折叠
    else setSections((prev) => prev.filter((_, i) => i !== index));         // 点了移除按钮
  }}
>
  <PanelItem title="基本信息" closable={false}>…</PanelItem>
  <PanelItem title="网络配置" closable={false}>…</PanelItem>
  <PanelItem title={<span>高级选项 <Tag color="primary">可选</Tag></span>} closable={false}>…</PanelItem>
</Panel>

// 手风琴
<Panel enableMultiExpand={false} selectedIndex={openIdx} onExpand={(i: number) => setOpenIdx([i])} onClose={() => setOpenIdx([])}>…</Panel>
```

## 5. 数据结构

```tsx
interface Section {
  key: string;
  title: string;
  removable?: boolean;      // 映射到 PanelItem.closable
}
```

## 6. 联动说明

- 表单校验失败 → 把出错字段所在面板的下标加进 `openIdx`，确保用户能看到错误
- "全部展开 / 收起"按钮 → `setOpenIdx(all)` / `setOpenIdx([])`
- 手风琴模式下切换面板 → 上一块的编辑状态保留在 state 里（`destroyInactivePanel` 默认 false，DOM 也保留）
- 面板移除 → 同步删掉对应表单字段

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import Panel, { PanelItem } from '@nce/eview-react/Panel';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

// 分组长表单：三块面板，默认展开前两块，校验失败自动展开出错块
export default function GroupedResourceForm() {
  const [openIdx, setOpenIdx] = useState<number[]>([0, 1]);
  const [message, setMessage] = useState<string>('');
  const formRef = useRef<any>(null);
  const FIELD_PANEL: Record<string, number> = { name: 0, ip: 1, note: 2 };   // 字段 → 面板下标

  return (
    <div style={{ width: 640, padding: 24 }}>
      <Form
        ref={formRef}
        initialValues={{ name: '', ip: '', note: '' }}
        layout="vertical"
        validateErrorType="tip"
        onSuccess={(values) => setMessage(`已保存：${JSON.stringify(values)}`)}
        onFailed={(errorFields: Record<string, any>) => {
          const idx = Object.keys(errorFields).map((k) => FIELD_PANEL[k]).filter((i) => i !== undefined);
          setOpenIdx((prev) => Array.from(new Set([...prev, ...idx])));     // 展开出错面板
          setMessage('请修正标红字段');
        }}
      >
        <Panel
          enableMultiExpand
          selectedIndex={openIdx}
          onExpand={(index: number) => setOpenIdx((prev) => (prev.includes(index) ? prev : [...prev, index]))}
          onClose={(index: number, event: any, collapsed: boolean) => { if (collapsed) setOpenIdx((prev) => prev.filter((i) => i !== index)); }}
        >
          <PanelItem title="基本信息" closable={false}>
            <Form.Item label="名称" name="name" rules={[{ required: true }]}><TextField maxLength={32} /></Form.Item>
          </PanelItem>
          <PanelItem title="网络配置" closable={false}>
            <Form.Item label="管理 IP" name="ip" rules={[{ required: true }, { ipv4: true }]}><TextField /></Form.Item>
          </PanelItem>
          <PanelItem title="高级选项（可选）" closable={false}>
            <Form.Item label="备注" name="note"><TextField maxLength={100} /></Form.Item>
          </PanelItem>
        </Panel>
        <Form.Item colon={false}>
          <Button status="primary" text="保存" onClick={() => formRef.current.submit()} />
          <Button text="全部展开" onClick={() => setOpenIdx([0, 1, 2])} style={{ marginLeft: 12 }} />
          <Button text="全部收起" onClick={() => setOpenIdx([])} style={{ marginLeft: 12 }} />
        </Form.Item>
      </Form>
      {message ? <div>{message}</div> : null}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 Collapse / items / activeKey / onChange / accordion
<Collapse accordion activeKey={keys} items={[{ key: '1', label: '基本信息' }]} onChange={setKeys} />

// ❌ 手风琴模式把 selectedIndex 传成数字（始终是数组）
<Panel enableMultiExpand={false} selectedIndex={0} />

// ❌ 忘了 closable 默认 true，表单分组面板标题上多了个"移除"按钮
<PanelItem title="基本信息">…</PanelItem>

// ❌ onClose 不区分 collapsed，用户折叠一下面板就被删了
onClose={(index) => setSections((prev) => prev.filter((_, i) => i !== index))}

// ❌ 校验失败不展开出错面板，用户看不到红字
onFailed={() => setMessage('有错误')}
```

## 9. API 速查

> 压缩自 `Panel/Panel` / `Panel/PanelItem`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `selectedIndex` | `number[]` | 展开的面板下标（受控，始终数组） |
| `enableMultiExpand` | `boolean`，默认 `false` | 允许多个同时展开；false 为手风琴 |
| `onExpand` | `(index, event) => void` | 展开 |
| `onClose` | `(index, event, collapsed: boolean) => void` | 折叠（`collapsed=true`）或点移除按钮（`false`） |
| `destroyInactivePanel` | `boolean`，默认 `false` | 折叠时销毁面板内容 |
| `children` | `PanelItem[]` | 面板项 |
| `PanelItem.title` | `any` | 标题（可 ReactNode） |
| `PanelItem.expanded` | `boolean` | 单项初始展开（与 `selectedIndex` 二选一控制） |
| `PanelItem.closable` | `boolean`，默认 **`true`** | 显示移除按钮 |
| `PanelItem.isShowTitleTips` / `titleTipProps` | `boolean` / `TipBoxProps` | 标题悬浮提示 |
| `PanelItem.titleClassName` / `containerClassName` / `style` / `className` / `id` | — | 样式与标识 |
| `id` / `className` / `style` | — | Panel 最外层 |
