# Dialog 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Dialog/types`；官网组件页 Dialog 及示例 `Basic.tsx` / `Confirm.tsx` / `Modal.tsx` / `Nest.tsx` / `DialogTableSample.jsx` / `Animation.tsx`
>
> ⚠️ 显隐是 `isOpen`（不是 `open` / `visible`），关闭按钮 / ESC 触发 `onClose(event)`，**组件不会自己把 `isOpen` 置 false**，业务在 `onClose` 和按钮 `onClick` 里 `setIsOpen(false)`。
> ⚠️ 底部按钮用 `buttons={[{ text, status?, onClick }]}`（数组，每项是 Button props），不是 `footer` / `onOk`。
> ⚠️ `zindex` 默认 9999，官方注明不要超过 9999，否则会盖住弹窗内 Select 等组件的下拉层。

## 1. 功能定位

Dialog 是通用对话框：标题 + 任意内容 + 按钮区，模态 / 非模态，可拖动、可缩放、可最小化、可嵌套。承载表单、详情、内嵌表格等复杂内容；纯提示 / 确认用 [MessageDialog.md](MessageDialog.md)。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 新建 / 编辑表单弹窗 | `Dialog` + `Form`（[Form.md](Form.md)） | antd `Modal` + `onOk` |
| 删除确认 / 成功失败提示 | `MessageDialog`（有类型图标、`ok/cancel` 语义） | Dialog 自己拼 |
| 侧滑面板 | `Drawer`（后续批次） | Dialog |
| 弹窗里放表格 | `Dialog size={[w, h]}` + `Table`（demo DialogTableSample） | — |

## 2. 典型场景

- 列表页"新建"：打开 Dialog → Form 填写 → 确定按钮 `formRef.current.submit()` → `onSuccess` 里请求 → 成功关窗并刷新列表
- 编辑：打开时 `setFieldsValue(record)` 回填
- 详情查看：`buttons` 只放"关闭"，`size={['50%', null]}`
- 嵌套弹窗：外层选择 → 内层新建，`zindex` 递增但 ≤ 9999

## 3. 状态声明

```tsx
const [open, setOpen] = useState<boolean>(false);
const [saving, setSaving] = useState<boolean>(false);        // 确定按钮处理中
const [editing, setEditing] = useState<Row | null>(null);    // null = 新建，非 null = 编辑回填
const formRef = useRef<any>(null);
```

## 4. 事件与交互逻辑

### 基本：isOpen 受控，onClose 与按钮都要自己关

```tsx
<Button status="primary" text="新建" onClick={() => { setEditing(null); setOpen(true); }} />

<Dialog
  title={editing ? '编辑设备' : '新建设备'}
  isOpen={open}
  onClose={() => setOpen(false)}                          // 右上角 × / ESC
  size={[560, null]}                                      // 宽 560，高自适应
  buttons={[
    { text: '取消', disabled: saving, onClick: () => setOpen(false) },
    { text: saving ? '保存中...' : '确定', status: 'primary', disabled: saving, onClick: () => formRef.current.submit() },
  ]}
>
  <Form ref={formRef} initialValues={EMPTY} onSuccess={handleSave}>…</Form>
</Dialog>
```

### 表单弹窗完整链路

```tsx
const handleSave = async (values: DeviceForm) => {
  if (saving) return;
  setSaving(true);
  try {
    await api.save(editing ? { ...values, id: editing.id } : values);
    setOpen(false);                                         // 成功才关
    reloadList();
  } catch (e) {
    showError(e);                                           // 失败保持打开，让用户改
  } finally {
    setSaving(false);
  }
};

// 编辑：打开后回填（Dialog 默认 destroyOnClose，每次打开表单是新的）
useEffect(() => {
  if (open && editing) formRef.current?.setFieldsValue(editing);
}, [open, editing]);
```

### 非模态 / 不可关闭 / 固定位置

```tsx
<Dialog isOpen={open} modal={false} movable onClose={close}>…</Dialog>              // 非模态，可拖
<Dialog isOpen={open} closable={false} closeOnEscape={false} buttons={[…]}>…</Dialog> // 只能走按钮
<Dialog isOpen={open} position={[200, 120]} size={[400, 300]} resizable>…</Dialog>
```

## 5. 数据结构

```tsx
// buttons 每项 = Button 的 props（见 Button.md）。demo 出现过 text / status / onClick；
// disabled 等其余 Button props 按"数组项即 Button 属性"推断，已登记待实测
interface DialogButton {
  text: string;
  status?: 'default' | 'primary' | 'risk' | 'text';
  disabled?: boolean;
  onClick: (event: object, additionalData?: any) => void;
}

// 尺寸 / 位置：[x, y]，任一项可为 null 表示不设置
type SizeTuple = [number | string | null, number | string | null];
```

## 6. 联动说明

- 保存成功 → 关窗 + 刷新列表 + 清空 `editing`；失败 → 保持打开并提示
- 处理中 → 两个按钮都 `disabled`，避免重复提交或半途关窗
- 打开编辑弹窗 → 用 Form 的 `setFieldsValue` 回填，不要把 record 直接塞 `initialValues`（异步数据不生效）
- 弹窗内的 Select / DatePicker 下拉层依赖 `zindex ≤ 9999`
- 嵌套弹窗：内层关闭不影响外层 `isOpen`；各自独立 state

## 7. 完整代码示例

```tsx
import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@nce/eview-react/Dialog';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import Button from '@nce/eview-react/Button';

interface Device {
  id: string;
  name: string;
  region: string;
}
type DeviceForm = Omit<Device, 'id'>;

const EMPTY: DeviceForm = { name: '', region: '' };
const REGIONS = [
  { text: '华东', value: 'east' },
  { text: '华南', value: 'south' },
];

// 设备列表 + 新建 / 编辑弹窗（Dialog 内 Form），保存成功才关窗并刷新
export default function DeviceDialogPage() {
  const [list, setList] = useState<Device[]>([{ id: 'd1', name: 'core-sw-01', region: 'east' }]);
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Device | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (open && editing) formRef.current?.setFieldsValue({ name: editing.name, region: editing.region });
  }, [open, editing]);

  const openCreate = () => { setEditing(null); setError(''); setOpen(true); };
  const openEdit = (d: Device) => { setEditing(d); setError(''); setOpen(true); };

  const handleSave = async (values: DeviceForm) => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      // 真实项目替换为已有 Service；模拟重名校验失败
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (list.some((d) => d.name === values.name && d.id !== editing?.id)) throw new Error('名称已存在');
      setList((prev) => (editing ? prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d)) : [...prev, { id: `d${Date.now()}`, ...values }]));
      setOpen(false);                                       // 成功才关
    } catch (e: any) {
      setError(e.message || '保存失败');                     // 失败保持打开
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Button status="primary" text="新建设备" onClick={openCreate} />
      {list.map((d) => (
        <div key={d.id} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
          <span>{d.name} · {d.region}</span>
          <Button status="text" text="编辑" onClick={() => openEdit(d)} />
        </div>
      ))}

      <Dialog
        title={editing ? '编辑设备' : '新建设备'}
        isOpen={open}
        onClose={() => setOpen(false)}
        size={[520, null]}
        buttons={[
          { text: '取消', disabled: saving, onClick: () => setOpen(false) },
          { text: saving ? '保存中...' : '确定', status: 'primary', disabled: saving, onClick: () => formRef.current.submit() },
        ]}
      >
        <Form ref={formRef} initialValues={EMPTY} layout="horizontal" labelCol={6} validateErrorType="tip" onSuccess={handleSave}>
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <TextField placeholder="请输入" maxLength={32} />
          </Form.Item>
          <Form.Item label="区域" name="region" rules={[{ required: true }]}>
            <Select options={REGIONS} defaultLabel="-请选择-" />
          </Form.Item>
        </Form>
        {error ? <div style={{ color: 'var(--colorAlarmUrgent)', marginTop: 8 }}>{error}</div> : null}
      </Dialog>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 open / visible / footer / onOk / onCancel / okText / width
<Modal open={visible} onOk={save} onCancel={close} okText="保存" width={520} footer={null} />

// ❌ 只写 onClose 不置 isOpen=false，点 × 关不掉
<Dialog isOpen={open} onClose={() => console.info('closed')} />

// ❌ 确定按钮直接关窗再请求：请求失败用户看不到、也改不了
buttons={[{ text: '确定', onClick: () => { setOpen(false); save(); } }]}

// ❌ buttons 写成 ReactNode 或对象（Dialog 是数组；对象写法是 MessageDialog 的）
<Dialog buttons={<Button text="确定" />} />
<Dialog buttons={{ ok: { onClick } }} />

// ❌ zindex 超过 9999，弹窗里的 Select 下拉被盖住
<Dialog zindex={10000} />

// ❌ 编辑回填塞 initialValues（异步 record 到达时表单已初始化）
<Dialog isOpen={open}><Form initialValues={record} /></Dialog>
```

## 9. API 速查

> 压缩自 `Dialog/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `isOpen` | `boolean`，默认 `false` | 显隐（受控） |
| `onClose` | `(event) => void` | 关闭按钮 / ESC；需自行置 `isOpen=false` |
| `title` / `titleTip` | `any` / `string` | 标题 / 标题提示 |
| `children` | `any` | 内容（React 或原生标签） |
| `buttons` | `Array<ButtonProps>` | 按钮区，如 `[{ text, status: 'primary', onClick }]` |
| `buttonStyle` / `contentStyle` / `maskStyle` / `style` | `CSSProperties` | 按钮区 / 内容区 / 蒙层 / 整体样式 |
| `size` | `[w, h]`，可 `null` / 百分比 | 大小 |
| `position` | `[x, y]`，可 `null` | 位置（左边距 / 上边距） |
| `modal` | `boolean`，默认 `true` | 模态 |
| `closable` | `boolean`，默认 `true` | 显示关闭按钮 |
| `closeOnEscape` | `boolean`，默认 `true` | ESC 关闭 + 弹窗内焦点循环 |
| `movable` / `resizable` / `onResize` | `boolean`（默认 true）/ `boolean`（默认 false）/ `(obj) => void` | 拖动 / 缩放 |
| `minimizable` / `onMinimized` / `customMinimized` / `minimizModalEnable` | — | 最小化相关 |
| `destroyOnClose` | `boolean`，默认 `true` | 关闭时销毁内容 |
| `zindex` | `any`，默认 `9999` | 层级，**不要超过 9999** |
| `mountId` | `string` | 挂载节点 id，默认 body |
| `focusOnClose` / `lastFocus` | `boolean`，默认 `true` | 打开时聚焦关闭按钮 / 关闭后回到原焦点 |
| `customClose` | `boolean`，默认 `false` | 为 true 时默认关闭按钮不生效，自行处理 |
| `boundary` / `isAllowedExceed` / `autoSetPosition` | `{ top, right, bottom, left }` / `boolean` / `boolean` | 拖拽范围 / 可拖出窗口 / 自动定位 |
| `animationOff` | `boolean`，默认 `false` | 关闭动画 |
| `customIcons` / `url` | `any` / `string` | 标题栏自定义图标 / 内嵌第三方页面 |
| `id` / `className` | — | 最外层 |
