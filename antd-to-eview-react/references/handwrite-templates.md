# 手写补位模板（antd 无对应组件）

> 以下 antd 组件在 eview-react 中无直接对应或无 Reference，按 fallback-handwrite.md 第三层手写。
> 模板中的 CSS 变量沿用源项目的原始 token 体系（保留策略），不写死色值。
> 类名用业务前缀 `app-`，可点击元素用 `<button type="button">`（仅限无 eview-react 对应组件时；图标按钮有 `IconButton` 对应，不得用原生 `<button>+<Icon>`）。
> 以下示例用 `var(--*)` 表示源项目的 token——具体变量名按源项目实际使用替换。

## 1. 卡片 / 面板区块（antd Card）

```tsx
function AppCard({ title, extra, children }) {
    return (
        <section className="app-card" style={{
            background: 'var(--surface-container-highest, #fff)',
            border: '1px solid var(--divider, #e0e0e0)',
            borderRadius: 'var(--radius-container, 8px)',
            boxShadow: 'var(--shadow-card, 0 1px 6px rgba(0,0,0,0.08))',
        }}>
            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                height: '48px',
                padding: '0 16px',
                borderBottom: '1px solid var(--divider, #e0e0e0)',
                fontWeight: 'var(--font-weight-medium, 500)',
            }}>
                <span>{title}</span>
                {extra}
            </header>
            <div style={{ padding: '16px' }}>{children}</div>
        </section>
    );
}
```

## 2. 头像（antd Avatar）

```tsx
// TODO(eview-react): Avatar 未覆盖，当前手写圆形占位
function AppAvatar({ text, size = 32 }) {
    return (
        <div style={{
            width: `${size}px`, height: `${size}px`,
            borderRadius: '50%',
            background: 'var(--primary, #0067D1)',
            color: 'var(--on-primary, #fff)',
            fontSize: `${size * 0.4}px`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
        }}>
            {text}
        </div>
    );
}
```

## 3. 键值详情块（antd Descriptions）

```tsx
// TODO(eview-react): Descriptions 未覆盖，当前手写键值详情块
function KeyValueList({ items, columns = 2 }) {
    return (
        <dl style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, auto 1fr)`,
            gap: '12px 16px',
            margin: 0,
        }}>
            {items.map((it) => (
                <React.Fragment key={it.label}>
                    <dt style={{
                        color: 'var(--on-surface-variant, #777)',
                        whiteSpace: 'nowrap',
                    }}>{it.label}</dt>
                    <dd style={{
                        margin: 0,
                        color: 'var(--on-surface, #191919)',
                    }}>{it.value ?? '—'}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}

// 用法：
<KeyValueList
    items={[
        { label: '设备名称', value: '逆变器 A12' },
        { label: '端口', value: 502 },
    ]}
    columns={2}
/>
```

## 4. 布局骨架（antd Layout / Header / Sider / Content）

```tsx
// TODO(eview-react): Layout 有导出名但无 Reference，当前手写 CSS 布局
function AppLayout({ header, sider, children }) {
    return (
        <div className="app-layout">
            <header className="app-layout-header">{header}</header>
            <div className="app-layout-body">
                <aside className="app-layout-sider">{sider}</aside>
                <main className="app-layout-content">{children}</main>
            </div>
        </div>
    );
}
```

```css
/* app-layout.css */
.app-layout {
    min-height: 100vh;
    background: var(--surface-container-lowest, #f3f3f3);
}
.app-layout-header {
    display: flex; align-items: center; justify-content: space-between;
    height: 48px; padding: 0 32px;
    background: var(--surface-container-highest, #fff);
    border-bottom: 1px solid var(--divider, #e0e0e0);
}
.app-layout-body { display: flex; min-height: calc(100vh - 48px); }
.app-layout-sider {
    width: 248px;
    background: var(--surface-container-highest, #fff);
    border-right: 1px solid var(--divider, #e0e0e0);
}
.app-layout-content { flex: 1; padding: 12px 32px 32px; }
```

## 5. 侧导航菜单（antd Menu）

```tsx
// TODO(eview-react): Menu 有导出名但无 Reference，当前手写侧导航
function AppMenu({ items, activeKey, onSelect }) {
    return (
        <nav className="app-menu">
            {items.map((m) => (
                <button
                    key={m.key}
                    type="button"
                    className={`app-menu-item ${activeKey === m.key ? 'active' : ''}`}
                    onClick={() => onSelect(m.key)}
                >
                    {m.label}
                </button>
            ))}
        </nav>
    );
}
```

```css
.app-menu { padding: 8px 0; }
.app-menu-item {
    display: block; width: 100%;
    padding: 8px 16px;
    border: none; background: transparent;
    text-align: left;
    color: var(--on-surface, #191919);
    cursor: pointer;
    transition: background 0.2s;
}
.app-menu-item:hover { background: var(--hover, rgba(0,0,0,0.05)); }
.app-menu-item.active {
    background: var(--select, #E6F2FD);
    color: var(--color-text-on, #0067D1);
    border-left: 2px solid var(--primary, #0067D1);
}
```

## 6. 结果页（antd Result）

```tsx
// TODO(eview-react): Result 未覆盖，用 Empty type="success" + 手写内容替代
import Empty from '@nce/eview-react/Empty';
import Button from '@nce/eview-react/Button';

function AppResult({ title, subtitle, actionText, onAction }) {
    return (
        <Empty
            type="success"
            description={
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontWeight: 'var(--font-weight-medium, 500)',
                        color: 'var(--on-surface, #191919)',
                    }}>{title}</div>
                    <div style={{
                        color: 'var(--on-surface-variant, #777)',
                        marginTop: '8px',
                    }}>{subtitle}</div>
                    {actionText ? (
                        <Button
                            status="primary"
                            text={actionText}
                            onClick={onAction}
                            style={{ marginTop: '16px' }}
                        />
                    ) : null}
                </div>
            }
        />
    );
}
```

## 7. 统计数字（antd Statistic）

```tsx
// TODO(eview-react): Statistic 未覆盖，当前手写
function AppStatistic({ title, value, suffix }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{
                color: 'var(--on-surface-variant, #777)',
            }}>{title}</span>
            <span style={{
                fontWeight: 'var(--font-weight-bold, 700)',
                color: 'var(--on-surface, #191919)',
            }}>
                {value}{suffix ? <span style={{
                    fontWeight: 'var(--font-weight-normal, 400)',
                    marginLeft: '4px',
                }}>{suffix}</span> : null}
            </span>
        </div>
    );
}
```

## 8. 间距（antd Space）

```tsx
// antd <Space> → flex div + gap
// 水平间距
<div style={{ display: 'flex', gap: '12px' }}>
    <Button text="取消" />
    <Button status="primary" text="保存" />
</div>

// 垂直间距
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <TextField label="名称" />
    <TextField label="描述" />
</div>

// 对齐方式（antd Space align）
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
```

## 9. 简单进度条（antd Progress）

```tsx
// TODO(eview-react): ProgressBar 未覆盖，当前手写最小可用版
function SimpleProgress({ percent, status = 'normal' }) {
    const color = status === 'error'
        ? 'var(--error, #E02128)'
        : status === 'success'
            ? 'var(--success, #62B42E)'
            : 'var(--primary, #0067D1)';
    const p = Math.min(100, Math.max(0, percent));
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                flex: 1, height: '8px',
                background: 'var(--hover, rgba(0,0,0,0.05))',
                borderRadius: '4px',
                overflow: 'hidden',
            }}>
                <div style={{
                    width: `${p}%`, height: '100%',
                    background: color,
                    transition: 'width .2s',
                }} />
            </div>
            <span style={{
                color: 'var(--on-surface-variant, #777)',
                minWidth: '40px', textAlign: 'right',
            }}>{p}%</span>
        </div>
    );
}
```
