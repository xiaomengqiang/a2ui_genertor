# Tag 组件功能逻辑规格

> 版本要求：3.4.11 起支持。
> ⚠️ closable / onClose / disabled 及 size 的声明存在差异，尚未确认对应发布版本，不能断言关闭功能不存在。默认不启用内置关闭或禁用；可删除标签用业务数组 + onClick，或旁边放 [IconButton](Icon.md)。
> ⚠️ `iconName` 在两份类型资料中均为 string，不能扩成 ReactElement。默认不定制图标；需要装饰图标时放在 Tag 旁边，不生成旧内置 Icon。

## 1. 功能定位

Tag 是关键词 / 状态 / 分类的小标签：`color` 六种语义色，`fill` 实心或描边，`round` 圆角，`size` 两档，`isMessageTag` 信息标签可带图标，`onClick` 可点击。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表格 / 卡片里的状态（正常 / 告警 / 危险） | `<Tag color="success">正常</Tag>` | 把其他库的颜色示例当成本库状态语义 |
| 对象的属性 / 类别关键词 | `<Tag isMessageTag>` | Badge |
| 可选中的筛选标签组 | `Tag` + `onClick` + 选中态用 `fill` 切换 | `Tag.CheckableTag`（不存在） |
| 小圆点状态 | `Badge status`（[Badge.md](Badge.md)） | Tag |

## 2. 典型场景

- 表格状态列：按告警等级映射 `color`（`danger` / `warning` / `caution` / `success` / `primary` / `default`）
- 详情页关键属性：多个 `isMessageTag` 并排，默认不定制图标
- 分类标签：自定义 `style` 的 `color` / `background` / `borderColor`（`TagClassify.jsx`）
- 可点击筛选：点击切换选中，选中用 `fill="solid"`、未选用 `fill="outline"`

## 3. 状态声明

```tsx
// 状态 → 颜色的映射表集中维护，与 Badge 的语义保持一致
const LEVEL_COLOR: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'caution' | 'danger'> = {
  critical: 'danger',
  major: 'warning',
  minor: 'caution',
  normal: 'success',
};

// 可点击筛选标签的选中集合
const [selected, setSelected] = useState<Set<string>>(new Set());
```

## 4. 事件与交互逻辑

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

### 可删除标签列表：默认由业务数组管理移除

```tsx
{tags.map((t) => (
  <Tag key={t} isMessageTag onClick={() => setTags((prev) => prev.filter((x) => x !== t))} style={{ marginRight: 8 }}>
    {t} ×
  </Tag>
))}
```

### 信息标签

```tsx
<Tag isMessageTag>已认证</Tag>
```

需要额外图标时，在 Tag 旁放已核验的 icon+ 元素。禁用交互默认由业务处理器检查权限 / 忙碌态，不依赖尚未核验版本的 Tag.disabled。

## 5. 数据结构

```tsx
interface FilterTag {
  key: string;
  text: string;
}

// 表格行里需要展示的状态
interface AlarmRow {
  id: string;
  level: 'critical' | 'major' | 'minor' | 'normal';
  levelText: string;
  type: string;
}
```

## 6. 联动说明

- 筛选 Tag 选中集合变化 → 列表重新请求（与 Select / SearchInput 的筛选参数合并，`page` 归 1）
- 表格状态 Tag 的 `color` 由行数据映射，映射表与 Badge 状态点共用一套语义
- 删除标签 → 同步更新表单值（如资源的标签数组），提交时以 state 为准
- 标签数量多时限制显示前 N 个 + "+M"（自行计算，Tag 无折叠能力）

## 7. 完整代码示例

```tsx
import React, { useMemo, useState } from 'react';
import Tag from '@nce/eview-react/Tag';

interface AlarmRow {
  id: string;
  name: string;
  level: 'critical' | 'major' | 'minor' | 'normal';
  levelText: string;
}

const LEVEL_COLOR: Record<AlarmRow['level'], 'danger' | 'warning' | 'caution' | 'success'> = {
  critical: 'danger',
  major: 'warning',
  minor: 'caution',
  normal: 'success',
};

const FILTERS: Array<{ key: AlarmRow['level']; text: string }> = [
  { key: 'critical', text: '紧急' },
  { key: 'major', text: '重要' },
  { key: 'minor', text: '次要' },
  { key: 'normal', text: '正常' },
];

// 告警列表：顶部可点击的等级筛选 Tag，列表行用状态 Tag 展示等级
export default function AlarmTags() {
  const rows: AlarmRow[] = [
    { id: 'a1', name: '端口 1/0/1 down', level: 'critical', levelText: '紧急' },
    { id: 'a2', name: 'CPU 使用率 85%', level: 'major', levelText: '重要' },
    { id: 'a3', name: '风扇转速偏低', level: 'minor', levelText: '次要' },
    { id: 'a4', name: '链路恢复', level: 'normal', levelText: '正常' },
  ];
  const [selected, setSelected] = useState<Set<AlarmRow['level']>>(new Set());

  const toggle = (key: AlarmRow['level']) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 未选任何筛选时显示全部
  const visible = useMemo(() => (selected.size === 0 ? rows : rows.filter((r) => selected.has(r.level))), [rows, selected]);

  return (
    <div style={{ width: 520, padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <Tag
            key={f.key}
            color={LEVEL_COLOR[f.key]}
            fill={selected.has(f.key) ? 'solid' : 'outline'}
            onClick={() => toggle(f.key)}
            style={{ marginRight: 8, cursor: 'pointer' }}
          >
            {f.text}
          </Tag>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{ color: '#939393' }}>无匹配告警</div>
      ) : (
        visible.map((row) => (
          <div key={row.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{row.name}</span>
            <Tag color={LEVEL_COLOR[row.level]}>{row.levelText}</Tag>
          </div>
        ))
      )}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 的 icon 属性与 CheckableTag 没有对应声明
<Tag icon={<IconPlusIcPublicXxx />}>标签</Tag>
<Tag.CheckableTag checked={on} onChange={setOn}>筛选</Tag.CheckableTag>

// ❌ 未核对版本差异就默认依赖内置关闭；不是断言这些字段在所有版本都不存在
<Tag closable onClose={remove}>标签</Tag>

// ❌ iconName 仅声明 string，不能照搬 IconButton 的元素用法
<Tag hasIcon iconName={<IconPlusIcPublicAbout />}>已认证</Tag>

// ❌ 想要描边效果去改 style，应该用 fill="outline"
<Tag style={{ background: '#fff', border: '1px solid #0067d1' }}>描边</Tag>

// ❌ 可点击标签没有任何选中态反馈
<Tag onClick={() => toggle(k)}>{text}</Tag>

// ❌ 用 Tag 表达"小圆点状态"，应该用 Badge status
<Tag color="success">●</Tag>
```

## 9. API 速查

> 压缩自 `Tag/types`。

size 默认取共同尺寸范围 normal / large；small 及 closable / onClose / disabled 须核验目标包声明与实现后才使用，不作已支持或已移除的统一结论。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `children` | `ReactNode` | 标签文字 |
| `color` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'caution' \| 'danger' \| string`，默认 `default` | 语义色；`solid` 时为背景色，`outline` 时为文字 / 边框色 |
| `fill` | `'solid' \| 'outline'`，默认 `solid` | 实心 / 描边 |
| `round` | `boolean`，默认 `true` | 圆角 |
| `size` | `'normal' \| 'large'`，默认 `normal` | 默认使用的共同范围；small 存在资料差异，不默认生成 |
| `onClick` | `(e: React.MouseEvent<HTMLSpanElement>) => void` | 点击 |
| `isMessageTag` | `boolean`，默认 `false` | 信息标签样式 |
| `hasIcon` / `iconName` | `boolean` / `string` | 历史图标配置，默认省略；不传 icon+ 元素或生成旧内置 Icon |
| `tagIconProps` | `{ iconUrl, hoverColor, style, className }` | 历史图标配置记录，默认省略；iconUrl 声明为图片路径字符串 |
| `style` | `React.CSSProperties` | 自定义颜色（分类标签用法）；color 属性类型允许 string，不将六种语义色写成全部合法值 |
| `id` / `className` | — | 最外层 |
