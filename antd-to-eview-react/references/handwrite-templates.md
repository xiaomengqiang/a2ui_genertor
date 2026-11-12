# 手写补位模板（antd 无对应组件）

> 以下 antd 组件在 eview-react 中无直接对应或无 Reference，按 fallback-handwrite.md 第三层手写。
> 模板中的 CSS 变量沿用源项目的原始 token 体系（保留策略），不写死色值。
> 类名用业务前缀 `app-`，可点击元素用 `<button type="button">`（仅限无 eview-react 对应组件时；可点击图标直接用 `<IconPlusIc* onClick={fn} title="…" />`，`IconButton` 已弃用，不得用原生 `<button>+<Icon>`）。
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

## 5. 结果页（antd Result）

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

## 6. 统计数字（antd Statistic）

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

## 7. 间距（antd Space）

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

## 8. 简单进度条（antd Progress）

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

## 9. 横向菜单（antd `Menu mode="horizontal"`）

> eview-react 无横向菜单对应组件（`Accordion` 是垂直侧边导航，不适用横向），antd `Menu mode="horizontal"` 按本节手写。
> 对齐 antd horizontal Menu 能力：横排、选中态高亮、hover 子菜单下拉、`disabled`/`danger`/`icon`/`divider`。
> **items 字段沿用 antd 形态**（`{ key, label, icon, disabled, danger, children, type }`），模板内部消化，调用点近零改动——仅需把 `<Menu mode="horizontal" items selectedKeys onClick>` 改成 `<AppHorizontalMenu items selectedKey onMenuClick>`。
> 子菜单下拉用 eview-react `DropDown`（包裹式、`trigger="hover"`，仅一级；antd horizontal 多级子菜单需拍平为一级，见 [DropDown.md](components/DropDown.md)）。
> **判定**：`mode="horizontal"` 手写；`mode="inline"`/默认垂直仍转 `Accordion`（见 [component-mapping.md](component-mapping.md) Menu 行 + [Accordion.md](components/Accordion.md) §10）。

```tsx
import DropDown from '@nce/eview-react/DropDown';

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  type?: 'divider' | 'group';
}

function AppHorizontalMenu({ items, selectedKey, onMenuClick }: {
  items: MenuItem[];
  selectedKey?: string;
  onMenuClick?: (key: string) => void;
}) {
  const renderLeaf = (item: MenuItem) => (
    <button
      type="button"
      disabled={item.disabled}
      className={`app-hmenu-item${item.key === selectedKey ? ' app-hmenu-item-active' : ''}${item.danger ? ' app-hmenu-item-danger' : ''}`}
      onClick={() => !item.disabled && onMenuClick?.(item.key)}
    >
      {item.icon ? <span className="app-hmenu-icon">{item.icon}</span> : null}
      <span>{item.label}</span>
    </button>
  );

  return (
    <nav className="app-hmenu">
      {items.map((item) => {
        if (item.type === 'divider') {
          return <li key={item.key} className="app-hmenu-divider" />;
        }
        if (item.children && item.children.length) {
          // 有子菜单：DropDown 包裹该项，hover 展开（DropDown 仅一级，多级子菜单需拍平）
          const subData = item.children
            .filter((c) => c.type !== 'divider')
            .map((c) => ({ value: c.key, text: c.label, disabled: c.disabled }));
          return (
            <li key={item.key} className="app-hmenu-entry app-hmenu-entry-has-sub">
              <DropDown
                data={subData}
                trigger="hover"
                onItemClick={(node) => {
                  const child = item.children.find((c) => c.key === node.value);
                  if (child && !child.disabled) onMenuClick?.(child.key);
                }}
              >
                {renderLeaf(item)}
              </DropDown>
            </li>
          );
        }
        return <li key={item.key} className="app-hmenu-entry">{renderLeaf(item)}</li>;
      })}
    </nav>
  );
}

// 用法（迁移对照）：
// antd: <Menu mode="horizontal" items={items} selectedKeys={[key]} onClick={({ key }) => setKey(key)} />
// eview: <AppHorizontalMenu items={items} selectedKey={key} onMenuClick={(key) => setKey(key)} />
```

```css
/* app-hmenu.css */
.app-hmenu {
  display: flex; align-items: center; gap: 4px;
  height: 48px; padding: 0 16px; margin: 0; list-style: none;
  background: var(--surface-container-highest, #fff);
  border-bottom: 1px solid var(--divider, #e0e0e0);
}
.app-hmenu-entry { list-style: none; position: relative; }
.app-hmenu-entry-has-sub .app-hmenu-item::after {
  content: '▾'; margin-left: 4px; font-size: 10px; color: var(--on-surface-variant, #999);
}
.app-hmenu-item {
  display: inline-flex; align-items: center; gap: 6px;
  height: 32px; padding: 0 12px;
  border: none; background: transparent;
  color: var(--on-surface-variant, #555);
  font-size: 14px; cursor: pointer; border-radius: 4px;
  transition: background .15s, color .15s;
}
.app-hmenu-item:hover { background: var(--hover, rgba(0,0,0,0.05)); color: var(--on-surface, #191919); }
.app-hmenu-item-active { color: var(--primary, #0067D1); font-weight: 500; }
.app-hmenu-item-active::before {
  content: ''; position: absolute; left: 12px; right: 12px; bottom: -8px;
  height: 2px; background: var(--primary, #0067D1);
}
.app-hmenu-item-danger { color: var(--error, #E02128); }
.app-hmenu-item:disabled { color: var(--on-surface-variant, #999); cursor: not-allowed; }
.app-hmenu-icon { display: inline-flex; }
.app-hmenu-divider { width: 1px; height: 20px; margin: 0 8px; background: var(--divider, #e0e0e0); list-style: none; }
```

> **迁移注意**：
> - antd `onClick({ key, keyPath, domEvent })` → 模板 `onMenuClick(key)`（仅传 key）
> - antd `selectedKeys` 是数组、horizontal 实际单选 → 模板用 `selectedKey` 单值（`selectedKeys={[k]}` → `selectedKey={k}`）
> - `type: 'group'`（分组标题）暂按普通项渲染，如需分组标题样式在模板内自行扩展
> - icon 透传：迁移后 icon 已是 icon+ 组件或 `@/shared/Icon`，原样塞进 `item.icon`
> - 暗色：色值走 token（`--on-surface-variant`/`--primary`/`--divider` 等），随 `<html>.dark` 自动翻转，无需另写暗色 CSS
