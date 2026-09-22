# Drawer 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Drawer/types`；官网组件页 Drawer 及示例 `DrawerDemo.jsx` / `DrawerMaskDemo.jsx` / `DrawerSizeDome.jsx` / `DrawerNestDemo.jsx` / `DrawerFormDemo.jsx` / `DrawerContainerDome.jsx` / `DrawerDraggableDemo.jsx`
>
> ⚠️ 显隐是 **`visible`**（Dialog 是 `isOpen`），关闭回调 `onClose(isShowDrawer)`；同 Dialog 一样**不会自动关**，业务在 `onClose` 里 `setVisible(false)`。
> ⚠️ 没有内置按钮区：底部操作栏自己写（demo `DrawerFormDemo.jsx` 用绝对定位的 `<div>` 放 Button）。
> ⚠️ `destroyOnClose` 默认 **false**（Dialog 默认 true）：关闭后内容保留，再次打开表单是上次的值，需要重置时自己 `resetFields()`。

## 1. 功能定位

Drawer 是从页面边缘滑入的侧边面板：四个方向、可无遮罩、可拖拽调宽、可嵌套。承载详情查看、侧边编辑表单、辅助设置。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 列表行详情 / 侧边编辑 | `Drawer placement="right"` | antd `Drawer open onClose` |
| 需要对比原页面内容 | `Drawer showMask={false}` | 模态 Dialog |
| 居中确认 / 短表单 | `Dialog`（[Dialog.md](Dialog.md)） | Drawer |
| 底部工具面板 | `Drawer placement="bottom" height={…}` | — |

## 2. 典型场景

- 表格行"查看详情"：右侧抽屉展示只读信息，无遮罩可对照表格
- 侧边编辑：抽屉内 Form，底部自写"保存 / 取消"栏，保存成功才关
- 多层抽屉：列表抽屉 → 选中项再打开一层编辑抽屉
- 可拖宽的抽屉：`sizeDraggable` + `onDragMove(size)` 记住用户偏好

## 3. 状态声明

```tsx
const [visible, setVisible] = useState<boolean>(false);
const [current, setCurrent] = useState<Row | null>(null);   // 抽屉里展示 / 编辑的对象
const [saving, setSaving] = useState<boolean>(false);
const formRef = useRef<any>(null);
```

## 4. 事件与交互逻辑

### 基本：visible 受控，onClose 自己关

```tsx
<Button text="查看详情" onClick={() => { setCurrent(row); setVisible(true); }} />
<Drawer title={current?.name ?? '详情'} visible={visible} placement="right" width={480} onClose={() => setVisible(false)}>
  <DetailView row={current} />
</Drawer>
```

### 侧边编辑表单 + 自写底部栏（demo DrawerFormDemo.jsx）

```tsx
<Drawer title="编辑设备" visible={visible} width={520} destroyOnClose onClose={() => setVisible(false)}>
  <Form ref={formRef} initialValues={EMPTY} validateErrorType="tip" component={false} onSuccess={handleSave}>…</Form>
  <div className="app-drawer-footer" style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', padding: '0.75rem 1rem', textAlign: 'right' }}>
    <Button text="取消" disabled={saving} onClick={() => setVisible(false)} />
    <Button status="primary" text={saving ? '保存中...' : '保存'} disabled={saving} onClick={() => formRef.current.submit()} style={{ marginLeft: 12 }} />
  </div>
</Drawer>
```

### 无遮罩对照 / 可拖宽 / 渲染在当前 DOM

```tsx
<Drawer visible={v} showMask={false} isClickMask={false} onClose={close}>…</Drawer>
<Drawer visible={v} sizeDraggable onDragMove={(size: number) => setWidth(size)} onDragFinished={() => savePref(width)} onClose={close}>…</Drawer>
<Drawer visible={v} isMountBody={false} onClose={close}>…</Drawer>       // 挂在当前容器而非 body
```

## 5. 数据结构

```tsx
type Placement = 'top' | 'right' | 'bottom' | 'left';
interface DrawerState<T> {
  visible: boolean;
  current: T | null;
}
```

## 6. 联动说明

- 表格行操作 → `setCurrent(row)` + `setVisible(true)`；关闭 → `setVisible(false)`，`current` 可保留供动画期间显示
- 编辑保存成功 → 关抽屉 + 刷新列表；失败 → 保持打开并提示
- `destroyOnClose` 默认 false：编辑不同行时要 `setFieldsValue(current)` 覆盖上次内容，或干脆开 `destroyOnClose`
- 嵌套抽屉各自独立 `visible`；内层关闭不影响外层

## 7. 完整代码示例

```tsx
import React, { useEffect, useRef, useState } from 'react';
import Drawer from '@nce/eview-react/Drawer';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

interface Device { id: string; name: string; ip: string; }

// 设备列表 + 右侧编辑抽屉：打开回填、保存成功才关、失败保持打开
export default function DeviceDrawerPage() {
  const [list, setList] = useState<Device[]>([{ id: 'd1', name: 'core-sw-01', ip: '10.0.0.1' }, { id: 'd2', name: 'core-sw-02', ip: '10.0.0.2' }]);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Device | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (visible && current) formRef.current?.setFieldsValue({ name: current.name, ip: current.ip });
  }, [visible, current]);

  const handleSave = async (values: { name: string; ip: string }) => {
    if (saving || !current) return;
    setSaving(true);
    setError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));   // 真实项目替换为已有 Service
      setList((prev) => prev.map((d) => (d.id === current.id ? { ...d, ...values } : d)));
      setVisible(false);
    } catch (e: any) {
      setError(e.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {list.map((d) => (
        <div key={d.id} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
          <span>{d.name} · {d.ip}</span>
          <Button status="text" text="编辑" onClick={() => { setCurrent(d); setError(''); setVisible(true); }} />
        </div>
      ))}

      <Drawer title={current ? `编辑 ${current.name}` : '编辑'} visible={visible} placement="right" width={480} destroyOnClose onClose={() => setVisible(false)}>
        <Form ref={formRef} initialValues={{ name: '', ip: '' }} layout="vertical" validateErrorType="tip" component={false} onSuccess={handleSave}>
          <Form.Item label="名称" name="name" rules={[{ required: true }]}><TextField maxLength={32} /></Form.Item>
          <Form.Item label="IP" name="ip" rules={[{ required: true }, { ipv4: true }]}><TextField /></Form.Item>
        </Form>
        {error ? <div className="app-error">{error}</div> : null}
        <div className="app-drawer-footer" style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', padding: '0.75rem 1rem', textAlign: 'right' }}>
          <Button text="取消" disabled={saving} onClick={() => setVisible(false)} />
          <Button status="primary" text={saving ? '保存中...' : '保存'} disabled={saving} onClick={() => formRef.current.submit()} style={{ marginLeft: 12 }} />
        </div>
      </Drawer>
    </div>
  );
}
```

## 8. 反面示例

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
<Drawer visible={v}><Form initialValues={current} /></Drawer>
```

## 9. API 速查

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
