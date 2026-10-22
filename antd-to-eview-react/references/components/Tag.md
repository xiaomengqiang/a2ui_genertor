# Tag 组件功能逻辑规格

> 导入：`import Tag from '@/shared/Tag'`（scaffold 适配类包壳 `@nce/eview-react/Tag`，**调用点保留 antd 写法、仅改 import 路径**）。`color` 解析（对齐 antd 5.29.3 + ant.css 参考）：
> - 已映射预设色/状态色 → Tag.css className token + `ev_tag_fill`（浅色态，词汇见 `shared/Tag/Tag.css`：`success/error/warning/info(alert)/alert/green/rose/pink/purple/indigo/cyan/default/disabled`；
> - 未映射 antd 预设色 `red/volcano/orange/lime/blue` → 采用 antd 5.x 色值走 outline inline style（`{color, 浅 alpha 背景, 同色边框}`）；
> `bordered` 接收但忽略（ant.css 全量 `border:none`），`icon`（组件节点）**改写到 `children` 最前、不保留 `icon` prop**：`<Tag color="..."><IconPlusIc*/>文字</Tag>`（eview `iconName` 不渲染组件图标），`closable`/`onClose` 原样透传，antd `closeIcon` 丢弃。
> 资料来源：TypeDoc `Tag/types`（3.4.11 起）+ 官网 Tag 页示例 + 实测 `closable`/`onClose`。
> ℹ️ eview Tag **原生支持 `closable` + `onClose`**（点击 × 触发 `onClose(e)`，由 wrapper 原样透传）。antd 的 `closeIcon`（自定义关闭图标）无对应 prop，wrapper 丢弃、eview 渲染默认关闭图标；需要"可删除标签列表"时直接用 `closable`+`onClose`（`IconButton` 已弃用）。

## 1. 功能定位

Tag 是关键词 / 状态 / 分类的小标签：`color` 预设色/状态色，`icon` 可带图标（组件节点，前置到 children），`round` 圆角，`size` 两档，`onClick` 可点击。

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
<Tag color="processing">{row.type}</Tag>            // 蓝色信息态
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
  <Tag key={f.key} color={selected.has(f.key) ? 'processing' : 'default'} onClick={() => toggle(f.key)} style={{ marginRight: 8 }}>
    {f.text}
  </Tag>
))}
```

### 可删除标签列表：closable + onClose（eview 原生支持，wrapper 透传）

```tsx
{tags.map((t) => (
  <Tag key={t} color="default" closable onClose={() => setTags((prev) => prev.filter((x) => x !== t))} style={{ marginRight: 8 }}>
    {t}
  </Tag>
))}
```

### 标签带图标

**转换前后对比（icon prop → children，不要保留 `icon` prop）：**

```tsx
// antd 写法（源）
<Tag color="warning" icon={<IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />}>待处理</Tag>

// ✅ 转换后：icon 元素移到 children 最前、删掉 icon prop
<Tag color="warning"><IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />待处理</Tag>

// ❌ 错误：保留 icon prop（eview iconName 不渲染组件图标，图标不显示）
<Tag color="warning" icon={<IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />}>待处理</Tag>
```

## 3. 联动说明

- 筛选 Tag 选中集合变化 → 列表重新请求（与 Select / SearchInput 的筛选参数合并，`page` 归 1）
- 表格状态 Tag 的 `color` 由行数据映射，映射表与 Badge 状态点共用一套语义
- 删除标签 → 同步更新表单值（如资源的标签数组），提交时以 state 为准
- 标签数量多时限制显示前 N 个 + "+M"（自行计算，Tag 无折叠能力）

## 4. 反面示例

```tsx
// ✅ closable/onClose/icon 由 shared/Tag 包壳支持（eview 原生 closable+onClose，wrapper 透传）——调用点保留 antd 写法
<Tag closable onClose={remove}>标签</Tag>

// ❌ Tag.CheckableTag 仍无对应（包壳未提供），用 Tag + onClick + fill 切换
<Tag.CheckableTag checked={on} onChange={setOn}>筛选</Tag.CheckableTag>

// ✅ antd 预设色/状态色都支持：已映射的走 Tag.css token（gold→alert、magenta→rose、geekblue→indigo…），
//    未映射的 red/volcano/orange/lime/blue 用 antd 色值走 outline style，自定义 hex 走 solid
<Tag color="green">正常</Tag>
<Tag color="red">紧急</Tag>
<Tag color="#f50">自定义</Tag>

// ❌ 想要彩色标签去手写 style，应该用预设色（color="blue" 等走 outline，或 color="processing" 走浅色态）
<Tag style={{ background: '#fff', border: '1px solid #0067d1' }}>描边</Tag>

// ❌ 可点击标签没有任何选中态反馈
<Tag onClick={() => toggle(k)}>{text}</Tag>

// ❌ 用 Tag 表达"小圆点状态"，应该用 Badge status
<Tag color="success">●</Tag>
```

## 5. API 速查

> 压缩自 `Tag/types`。下表为底层 eview Tag API；`@/shared/Tag` 包壳另接收 antd 变体 prop（`color`/`bordered`/`icon`/`closable`/`onClose`/`closeIcon`）并在内部映射，调用点保留 antd 写法。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `children` | `ReactNode` | 标签文字 |
| `color` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'caution' \| 'danger' \| string`，默认 `default` | 语义色；`solid` 时为背景色，`outline` 时为文字 / 边框色（注：`@/shared/Tag` 包壳不透传 `color`，改用 `className` token 配色，见导入说明） |
| `fill` | `'solid' \| 'outline'`，默认 `solid` | 实心 / 描边（`@/shared/Tag` 包壳忽略；浅色/实心由 `color` 是否预设色决定：预设色→浅色态，自定义 hex→实心白字） |
| `round` | `boolean`，默认 `true` | 圆角 |
| `size` | `'small' \| 'normal' \| 'large'`，默认 `normal` | 尺寸（`normal` 为小尺寸，`large` 为大尺寸） |
| `onClick` | `(e: MouseEvent) => void` | 点击 |
| `closable` | `boolean`，默认 `false` | 是否可关闭（显示 ×；eview 原生支持，wrapper 原样透传） |
| `onClose` | `(e) => void` | 点击 × 关闭回调（eview 原生支持，wrapper 原样透传） |
| `isMessageTag` | `boolean`，默认 `false` | 信息标签样式（`@/shared/Tag` 包壳忽略，不再需要） |
| `hasIcon` / `iconName` | `boolean` / `string \| ReactElement` | 信息标签图标（`@/shared/Tag` 包壳忽略；antd `icon` 组件节点改走 `children` 前置，eview `iconName` 不渲染组件图标） |
| `tagIconProps` | `{ iconUrl, hoverColor, style, className }` | 自定义图标；经 `...rest` 透传给 eview（`iconUrl` 仅自定义图片） |
| `style` | `{ color?, background?, borderColor?, borderRadius?, border? }` | 自定义颜色（分类标签用法） |
| `id` / `className` | — | 最外层 |
