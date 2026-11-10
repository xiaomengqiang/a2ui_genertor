# 手写补位模板（antd 无对应组件）

> 以下 antd 组件在 eview-ui 中无直接对应（78 个组件文档确认），按模板手写。
> 模板中的 CSS 变量沿用源项目的原始 token 体系（保留策略），不写死色值（token 变量随 `.dark` 轨自动翻转暗色）。
> 类名用业务前缀 `app-`，不用 `ev_`/`evu_`（组件库前缀）。
> 图标一律用保留的 `<Icon name>` shim（`import Icon from '@/shared/Icon'`），**不要**用 eview-ui 的 url 字符串 icon prop。
> 以下示例用 `var(--*)` 表示源项目 token——具体变量名按源项目实际使用替换。


## antd → 手写模板索引

> 迁移分类：B｜本表由 build-migration-plan.cjs 解析（无 eview-ui 对应、按下方模板手写的 antd 组件；模板列 §N 对应本文件章节号）

| antd 写法 | 模板 | 迁移要点 |
|-----------|------|----------|
| `Space` | — | **无对应**（`Split` 是可拖拽分栏容器，不是间距容器，勿用）；`<div style={{ display:'flex', gap:'0.75rem' }}>` |
| `Typography.*` | — | `<h1>`~`<h6>`/`<span>` + 源项目 CSS 变量 |
| `Divider` | — | **无页面级对应**（仅 `Menu.Divider` 是菜单内分割线）；手写 `<div>` + border |
| `Cascader` | §2 | **无对应**（`CategoryInput` 是「下拉+输入框」组合不是级联选择）；见 [handwrite-templates.md](handwrite-templates.md) §2 |
| `Mentions` | — | 无对应 |
| `Badge` | §4 | **无对应**；见 [handwrite-templates.md](handwrite-templates.md) §4 |
| `Empty` | §5 | **无对应**；见 [handwrite-templates.md](handwrite-templates.md) §5 |
| `Statistic` | §6 | 无对应；见 [handwrite-templates.md](handwrite-templates.md) §6 |
| `Skeleton` | — | 无对应（迁移时源项目一般已用 loading 态，直接 Loader） |
| `Avatar` | §7 | 无对应；见 [handwrite-templates.md](handwrite-templates.md) §7 |
| `Image` | — | 无对应 |
| `Result` | — | 无对应；`DivMessage type` + 手写标题/按钮 |
| `Affix` | — | 无对应 |
| `BackTop` | — | 无对应 |

## 1. 布局骨架（antd Layout/Header/Sider/Content 嵌套）

> eview-ui `Layout` 只有 full/horizontal/vertical 三形态 + leftPanel/rightPanel——**简单左右/上下分栏可用 Layout**（固定栏传 `className="eui_layout_fix"` + 显式宽高）；antd 的 Header+Sider+Content 复合骨架手写：

```tsx
// TODO(eview-ui): antd Layout 复合骨架无一一对应，手写 CSS 布局
function AppLayout({ header, sider, children }) {
    return (
        <div className="app-layout" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="app-header" style={{
                height: '48px', flexShrink: 0,
                display: 'flex', alignItems: 'center', padding: '0 16px',
                background: 'var(--surface, #fff)',
                borderBottom: '1px solid var(--divider, #e0e0e0)',
            }}>{header}</header>
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                <aside className="app-sider" style={{
                    width: '220px', flexShrink: 0,
                    background: 'var(--surface, #fff)',
                    borderRight: '1px solid var(--divider, #e0e0e0)',
                    overflow: 'auto',
                }}>{sider}</aside>
                <main style={{ flex: 1, overflow: 'auto', padding: '16px' }}>{children}</main>
            </div>
        </div>
    );
}
```

## 2. 级联选择（antd Cascader）

> eview-ui 无 Cascader（CategoryInput 是「下拉+输入框」组合，不是级联）。源项目有 cascading 数据结构时手写：

```tsx
// TODO(eview-ui): Cascader 无对应，手写两级级联（深层可嵌套递归）
import SelectPro from '@cloudsop/eview-ui/SelectPro';

function AppCascader({ options, value = [], onChange }) {
    // options: [{ text, value, children: [{ text, value }] }]
    const [lv1, lv2] = value;
    const children = options.find(o => o.value === lv1)?.children ?? [];
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <SelectPro
                mode="single"
                options={options}
                value={lv1}
                onChange={(v) => onChange([v, undefined])}
            />
            {children.length > 0 && (
                <SelectPro
                    mode="single"
                    options={children}
                    value={lv2}
                    onChange={(v) => onChange([lv1, v])}
                />
            )}
        </div>
    );
}
```

> antd Cascader 的 `showSearch`/`changeOnSelect`/`fieldNames`/`loadData` 按需补：搜索加 `SearchInput` 联动、异步加载在 onChange 里 fetch 后 setOptions。

## 3. 键值详情块（antd Descriptions）

> 轻量场景直接用 eview-ui `LabelField`（`text` + `required` 显星号）+ `GridLayout` Row/Col 排布；带边框/bordered 完整形态手写：

```tsx
// 轻量形态（推荐，组件库组合）：
import LabelField from '@cloudsop/eview-ui/LabelField';
import { Row, Col } from '@cloudsop/eview-ui/GridLayout';

<Row totalCols={24}>
    {items.map(it => (
        <Col key={it.label} cols={12} style={{ padding: '4px 0' }}>
            <LabelField text={it.label} /> <span>{it.value ?? '—'}</span>
        </Col>
    ))}
</Row>
```

```tsx
// TODO(eview-ui): Descriptions bordered 形态无对应，手写键值网格
function KeyValueList({ items, columns = 2 }) {
    return (
        <dl style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, auto 1fr)`,
            gap: '0',
            margin: 0,
            border: '1px solid var(--divider, #e0e0e0)',
            borderRadius: 'var(--radius-container, 8px)',
            overflow: 'hidden',
        }}>
            {items.map((it) => (
                <React.Fragment key={it.label}>
                    <dt style={{
                        padding: '8px 16px',
                        background: 'var(--surface-container, #f5f5f5)',
                        color: 'var(--on-surface-variant, #777)',
                        borderTop: '1px solid var(--divider, #e0e0e0)',
                    }}>{it.label}</dt>
                    <dd style={{
                        margin: 0, padding: '8px 16px',
                        color: 'var(--on-surface, #191919)',
                        borderTop: '1px solid var(--divider, #e0e0e0)',
                    }}>{it.value ?? '—'}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}
```

## 4. 徽标（antd Badge）

```tsx
// TODO(eview-ui): Badge 无对应，手写徽标
function AppBadge({ count, max = 99, dot = false, children, offset = [0, 0] }) {
    const overflow = typeof count === 'number' && count > max;
    const content = dot ? '' : (overflow ? `${max}+` : count);
    return (
        <span style={{ position: 'relative', display: 'inline-flex' }}>
            {children}
            {count !== 0 && (
                <sup style={{
                    position: 'absolute',
                    top: offset[0], right: offset[1],
                    minWidth: dot ? '8px' : '18px', height: dot ? '8px' : '18px',
                    padding: dot ? 0 : '0 5px',
                    borderRadius: dot ? '50%' : '9px',
                    background: 'var(--error, #d93026)',
                    color: '#fff',
                    fontSize: '12px', lineHeight: '18px',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                }}>{content}</sup>
            )}
        </span>
    );
}
```

## 5. 空状态（antd Empty）

```tsx
// TODO(eview-ui): Empty 无对应，手写空状态
import Icon from '@/shared/Icon';

function AppEmpty({ description = '暂无数据', icon = 'inbox' }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '32px 16px',
            color: 'var(--on-surface-variant, #999)',
        }}>
            <Icon name={icon} size={48} />
            <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '14px' }}>{description}</p>
        </div>
    );
}
```

## 6. 统计数值（antd Statistic）

```tsx
// TODO(eview-ui): Statistic 无对应，手写统计块
function AppStatistic({ title, value, suffix, prefix }) {
    return (
        <div className="app-statistic">
            <div style={{
                fontSize: '14px',
                color: 'var(--on-surface-variant, #777)',
                marginBottom: '4px',
            }}>{title}</div>
            <div style={{
                fontSize: '24px', fontWeight: 600,
                color: 'var(--on-surface, #191919)',
                fontVariantNumeric: 'tabular-nums',
            }}>
                {prefix}{value}{suffix}
            </div>
        </div>
    );
}
```

## 7. 头像（antd Avatar）

```tsx
// TODO(eview-ui): Avatar 无对应，手写圆形占位
function AppAvatar({ text, size = 32, src }) {
    if (src) {
        return <img src={src} alt={text} style={{ width: size, height: size, borderRadius: '50%' }} />;
    }
    return (
        <div style={{
            width: size, height: size,
            borderRadius: '50%',
            background: 'var(--primary, #0067D1)',
            color: 'var(--on-primary, #fff)',
            fontSize: size * 0.4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', userSelect: 'none',
        }}>{text}</div>
    );
}
```

## 8. 间距容器（antd Space）

> **注意**：eview-ui `Split` 是可拖拽分栏容器，**不是** Space 的对应物，勿用。

```tsx
// TODO(eview-ui): Space 无对应，flex div + gap
function AppSpace({ children, direction = 'horizontal', size = 8, wrap = true }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: direction === 'vertical' ? 'column' : 'row',
            gap: typeof size === 'number' ? `${size}px` : size,
            flexWrap: wrap ? 'wrap' : 'nowrap',
        }}>{children}</div>
    );
}
```

> Table 操作列多按钮也用此模式（替代 antd `<Space>` 包 render）：`<div style={{ display: 'flex', gap: '12px' }}>...</div>`——不要用 Fragment（无间距）。

## 9. 分割线（antd Divider）

> 仅 `Menu.Divider` 是菜单内分割线；页面级手写：

```tsx
// TODO(eview-ui): Divider 无页面级对应，手写
function AppDivider({ type = 'horizontal', dashed = false }) {
    if (type === 'vertical') {
        return <span style={{
            display: 'inline-block',
            width: '1px', height: '0.9em', margin: '0 8px',
            verticalAlign: 'middle',
            borderLeft: `1px ${dashed ? 'dashed' : 'solid'} var(--divider, #e0e0e0)`,
        }} />;
    }
    return <hr style={{
        border: 'none',
        borderTop: `1px ${dashed ? 'dashed' : 'solid'} var(--divider, #e0e0e0)`,
        margin: '16px 0',
    }} />;
}
```

## 10. 吸附/回顶（antd Affix / BackTop）

```tsx
// TODO(eview-ui): Affix 无对应，position:sticky
// <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>吸附内容</div>

// TODO(eview-ui): BackTop 无对应，手写
import Icon from '@/shared/Icon';

function AppBackTop({ visible, onClick }) {
    if (!visible) return null;
    return (
        <button type="button" onClick={onClick} style={{
            position: 'fixed', right: '32px', bottom: '48px',
            width: '40px', height: '40px', borderRadius: '50%',
            border: '1px solid var(--divider, #e0e0e0)',
            background: 'var(--surface, #fff)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-card, 0 2px 8px rgba(0,0,0,0.15))',
        }}>
            <Icon name="arrow_up" size={18} />
        </button>
    );
}
```

## 11. 结果页（antd Result）

```tsx
// TODO(eview-ui): Result 无对应，手写（Empty 场景可参考 AppEmpty）
import Icon from '@/shared/Icon';

function AppResult({ status = 'success', title, subTitle, extra }) {
    const iconMap = { success: 'check_circle', error: 'x_circle', warn: 'alert_circle', info: 'info' };
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '48px 16px',
        }}>
            <Icon name={iconMap[status] ?? 'info'} size={56} />
            <h2 style={{ margin: '16px 0 8px', fontSize: '20px' }}>{title}</h2>
            {subTitle && <p style={{ color: 'var(--on-surface-variant, #777)', margin: 0 }}>{subTitle}</p>}
            {extra && <div style={{ marginTop: '24px' }}>{extra}</div>}
        </div>
    );
}
```

## 12. 骨架屏（antd Skeleton）

```tsx
// TODO(eview-ui): Skeleton 无对应，手写（加载态优先用 eview-ui Loader）
function AppSkeleton({ rows = 3 }) {
    return (
        <div style={{ padding: '16px' }}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} style={{
                    height: '16px', borderRadius: '4px',
                    margin: '8px 0',
                    width: i === rows - 1 ? '60%' : '100%',
                    background: 'var(--surface-container, #eee)',
                }} />
            ))}
        </div>
    );
}
```

> 其他无对应：`Image` 手写 `<img>`（预览态用 Dialog 包 img）；`Mentions` 手写 TextField + Popup 组合；`Typography.*` 手写 `<h1>`~`<h6>`/`<span>`/`<a>` + token 变量。
