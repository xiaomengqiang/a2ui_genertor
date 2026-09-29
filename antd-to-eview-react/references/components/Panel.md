# Panel 组件功能逻辑规格（含 PanelItem，折叠面板）

> 资料来源：TypeDoc `Panel/Panel`、`Panel/PanelItem` + 官网 Panel 页示例。
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

## 2. 事件与交互逻辑

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

## 3. 联动说明

- 表单校验失败 → 把出错字段所在面板的下标加进 `openIdx`，确保用户能看到错误
- "全部展开 / 收起"按钮 → `setOpenIdx(all)` / `setOpenIdx([])`
- 手风琴模式下切换面板 → 上一块的编辑状态保留在 state 里（`destroyInactivePanel` 默认 false，DOM 也保留）
- 面板移除 → 同步删掉对应表单字段

## 4. 反面示例

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

## 5. API 速查

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
