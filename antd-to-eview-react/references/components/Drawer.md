# Drawer 组件功能逻辑规格

> 资料来源：TypeDoc `Drawer/types` + 官网 Drawer 页示例。
> ⚠️ 显隐是 **`visible`**（Dialog 是 `isOpen`），关闭回调 `onClose(isShowDrawer)`；同 Dialog 一样**不会自动关**，业务在 `onClose` 里 `setVisible(false)`。
> ⚠️ 没有内置按钮区：底部操作栏自己写（demo 用绝对定位的 `<div>` 放 Button）。
> ⚠️ `destroyOnClose` 默认 **false**（Dialog 默认 true）：关闭后内容保留，再次打开表单是上次的值，需要重置时自己 `resetFields()`。

## 1. 功能定位

Drawer 是从页面边缘滑入的侧边面板：四个方向、可无遮罩、可拖拽调宽、可嵌套。承载详情查看、侧边编辑表单、辅助设置。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 列表行详情 / 侧边编辑 | `Drawer placement="right"` | antd `Drawer open onClose` |
| 需要对比原页面内容 | `Drawer showMask={false}` | 模态 Dialog |
| 居中确认 / 短表单 | `Dialog`（[Dialog.md](Dialog.md)） | Drawer |
| 底部工具面板 | `Drawer placement="bottom" height={…}` | — |

## 2. 事件与交互逻辑

### 基本：visible 受控，onClose 自己关

```tsx
<Button text="查看详情" onClick={() => { setCurrent(row); setVisible(true); }} />
<Drawer title={current?.name ?? '详情'} visible={visible} placement="right" width={480} onClose={() => setVisible(false)}>
  <DetailView row={current} />
</Drawer>
```

### 侧边编辑表单 + 自写底部栏

```tsx
<Drawer title="编辑设备" visible={visible} width={520} destroyOnClose onClose={() => setVisible(false)}>
   {/* 表单内容：div + 输入组件拼合 */}
   <div className="app-drawer-footer" style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', padding: '0.75rem 1rem', textAlign: 'right' }}>
     <Button text="取消" disabled={saving} onClick={() => setVisible(false)} />
     <Button status="primary" text={saving ? '保存中...' : '保存'} disabled={saving} onClick={handleSave} style={{ marginLeft: 12 }} />
   </div>
</Drawer>
```

### 无遮罩对照 / 可拖宽 / 渲染在当前 DOM

```tsx
<Drawer visible={v} showMask={false} isClickMask={false} onClose={close}>…</Drawer>
<Drawer visible={v} sizeDraggable onDragMove={(size: number) => setWidth(size)} onDragFinished={() => savePref(width)} onClose={close}>…</Drawer>
<Drawer visible={v} isMountBody={false} onClose={close}>…</Drawer>       // 挂在当前容器而非 body
```

## 3. 联动说明

- 表格行操作 → `setCurrent(row)` + `setVisible(true)`；关闭 → `setVisible(false)`，`current` 可保留供动画期间显示
- 编辑保存成功 → 关抽屉 + 刷新列表；失败 → 保持打开并提示
- `destroyOnClose` 默认 false：编辑不同行时要 `setFieldsValue(current)` 覆盖上次内容，或干脆开 `destroyOnClose`
- 嵌套抽屉各自独立 `visible`；内层关闭不影响外层

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 open / footer / extra / size="large" / maskClosable
<Drawer open={v} footer={<Button />} size="large" maskClosable={false} />

// ❌ 沿用 Dialog 的 isOpen（Drawer 是 visible）
<Drawer isOpen={v} />

// ❌ 只写 onClose 不置 visible=false，关不掉
<Drawer visible={v} onClose={() => console.info('close')} />

// ❌ 以为有内置按钮区，传 buttons（那是 Dialog 的）
<Drawer buttons={[{ text: '确定' }]} />

// ❌ 忘了 destroyOnClose 默认 false：换一行编辑时表单还是上一行的值
<Drawer visible={v}>{/* div + 输入组件，destroyOnClose 需显式开 */}</Drawer>
```

## 5. API 速查

> 压缩自 `Drawer/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `visible` | `boolean`，默认 `false` | 显隐（受控） |
| `onClose` | `(isShowDrawer: boolean) => void` | 关闭按钮 / 点遮罩；需自行置 `visible=false` |
| `title` / `showTitle` / `tipData` | `string` / `boolean`（默认 true）/ `string` | 标题 / 是否显示 / 标题提示 |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'`，默认 `right` | 方向 |
| `width` / `height` | `number`，默认 `300px` | 左右方向用 `width`，上下用 `height` |
| `showMask` / `isClickMask` | `boolean`，默认 `true` | 遮罩 / 点遮罩关闭 |
| `showClose` | `boolean`，默认 `true` | 关闭按钮 |
| `destroyOnClose` | `boolean`，默认 **`false`** | 关闭销毁内容 |
| `isMountBody` / `mountId` | `boolean`（默认 true）/ `string` | 挂 body 或当前 DOM / 指定挂载点（二者互斥） |
| `sizeDraggable` / `onDragMove` / `onDragFinished` | `boolean`（默认 false）/ `(size) => void` / `(event) => void` | 拖拽调整大小 |
| `animationDuration` | `number` | 动画时长 |
| `contentClassName` / `className` / `style` / `id` | — | 样式与标识 |
| `children` | `ReactNode`，**必填** | 内容 |
