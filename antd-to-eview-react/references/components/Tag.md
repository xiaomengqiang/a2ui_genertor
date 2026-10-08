# Tag 组件功能逻辑规格

> 资料来源：TypeDoc `Tag/types`（3.4.11 起）+ 官网 Tag 页示例。
> ⚠️ eview Tag **没有 `closable` / `onClose`**（antd 最常用的可关闭标签在这里不存在）。需要"可删除的标签列表"时，用业务数组 + `onClick` 或旁边放 `IconButton` 自己实现。

## 1. 功能定位

Tag 是关键词 / 状态 / 分类的小标签：`color` 六种语义色，`fill` 实心或描边，`round` 圆角，`size` 两档，`isMessageTag` 信息标签可带图标，`onClick` 可点击。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表格 / 卡片里的状态（正常 / 告警 / 危险） | `<Tag color="success">正常</Tag>` | antd 的 `color="green"` |
| 对象的属性 / 类别关键词 | `<Tag isMessageTag>` | Badge |
| 可选中的筛选标签组 | `Tag` + `onClick` + 选中态用 `fill` 切换 | `Tag.CheckableTag`（不存在） |
| 小圆点状态 | `Badge status`（[Badge.md](Badge.md)） | Tag |

## 2. 事件与交互逻辑

### 状态标签：只读展示

```tsx
<Tag color={LEVEL_COLOR[row.level] ?? 'default'}>{row.levelText}</Tag>
<Tag color="primary" fill="outline">{row.type}</Tag>        // 描边弱化
<Tag color="default" round={false}>ID: {row.id}</Tag>       // 方角
```

### 可点击筛选标签：onClick(e)，选中态用 fill 表达

```tsx
const toggle = (key: string) => {
  setSelected((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
};

{filters.map((f) => (
  <Tag key={f.key} color="primary" fill={selected.has(f.key) ? 'solid' : 'outline'} onClick={() => toggle(f.key)} style={{ marginRight: 8 }}>
    {f.text}
  </Tag>
))}
```

### 可删除标签列表：Tag 没有 closable，用数组 + 点击移除

```tsx
{tags.map((t) => (
  <Tag key={t} isMessageTag onClick={() => setTags((prev) => prev.filter((x) => x !== t))} style={{ marginRight: 8 }}>
    {t} ×
  </Tag>
))}
```

### 信息标签带图标

```tsx
import { IconPlusIcPublicAbout } from '@nce/icon-plus';
<Tag isMessageTag hasIcon iconName={<IconPlusIcPublicAbout />}>已认证</Tag>
```

## 3. 联动说明

- 筛选 Tag 选中集合变化 → 列表重新请求（与 Select / SearchInput 的筛选参数合并，`page` 归 1）
- 表格状态 Tag 的 `color` 由行数据映射，映射表与 Badge 状态点共用一套语义
- 删除标签 → 同步更新表单值（如资源的标签数组），提交时以 state 为准
- 标签数量多时限制显示前 N 个 + "+M"（自行计算，Tag 无折叠能力）

## 4. 反面示例

```tsx
// ❌ antd 习惯：eview Tag 没有 closable / onClose / CheckableTag / icon 属性
<Tag closable onClose={remove} icon={<IconPlusIcPublicXxx />}>标签</Tag>
<Tag.CheckableTag checked={on} onChange={setOn}>筛选</Tag.CheckableTag>

// ❌ 颜色写 antd 的色名，eview 只认 default/primary/success/warning/caution/danger（或自定义 style）
<Tag color="green">正常</Tag>
<Tag color="red">紧急</Tag>

// ❌ 想要描边效果去改 style，应该用 fill="outline"
<Tag style={{ background: '#fff', border: '1px solid #0067d1' }}>描边</Tag>

// ❌ 可点击标签没有任何选中态反馈
<Tag onClick={() => toggle(k)}>{text}</Tag>

// ❌ 用 Tag 表达"小圆点状态"，应该用 Badge status
<Tag color="success">●</Tag>
```

## 5. API 速查

> 压缩自 `Tag/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `children` | `ReactNode` | 标签文字 |
| `color` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'caution' \| 'danger' \| string`，默认 `default` | 语义色；`solid` 时为背景色，`outline` 时为文字 / 边框色 |
| `fill` | `'solid' \| 'outline'`，默认 `solid` | 实心 / 描边 |
| `round` | `boolean`，默认 `true` | 圆角 |
| `size` | `'small' \| 'normal' \| 'large'`，默认 `normal` | 尺寸（`normal` 为小尺寸，`large` 为大尺寸） |
| `onClick` | `(e: MouseEvent) => void` | 点击 |
| `isMessageTag` | `boolean`，默认 `false` | 信息标签样式 |
| `hasIcon` / `iconName` | `boolean` / `string \| ReactElement` | 信息标签图标（默认用 `iconName={<IconPlusIc* />}`） |
| `tagIconProps` | `{ iconUrl, hoverColor, style, className }` | 自定义图标；`iconUrl` 仅自定义图片，默认用 `iconName` 走 icon+ |
| `style` | `{ color?, background?, borderColor?, borderRadius?, border? }` | 自定义颜色（分类标签用法） |
| `id` / `className` | — | 最外层 |
