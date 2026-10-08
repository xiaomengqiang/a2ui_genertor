# Dialog 组件功能逻辑规格

> 资料来源：TypeDoc `Dialog/types` + 官网 Dialog 页示例。
> ⚠️ 显隐是 `isOpen`（不是 `open` / `visible`），关闭按钮 / ESC 触发 `onClose(event)`，**组件不会自己把 `isOpen` 置 false**，业务在 `onClose` 和按钮 `onClick` 里 `setIsOpen(false)`。
> ⚠️ 底部按钮用 `buttons={[{ text, status?, onClick }]}`（**数组**，每项是 Button props），不是 `footer` / `onOk`。
> ⚠️ `zindex` 默认 9999，不要超过 9999，否则会盖住弹窗内 Select 等组件的下拉层。

## 1. 功能定位

Dialog 是通用对话框：标题 + 任意内容 + 按钮区，模态 / 非模态，可拖动、可缩放、可最小化、可嵌套。承载表单、详情、内嵌表格等复杂内容；纯提示 / 确认用 [MessageDialog.md](MessageDialog.md)。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 新建 / 编辑表单弹窗 | `Dialog` + 输入组件（div 拼合） | antd `Modal` + `onOk` |
| 删除确认 / 成功失败提示 | `MessageDialog`（有类型图标、`ok/cancel` 语义） | Dialog 自己拼 |
| 侧滑面板 | `Drawer`（[Drawer.md](Drawer.md)） | Dialog |
| 弹窗里放表格 | `Dialog size={[w, h]}` + `Table` | — |

## 2. 事件与交互逻辑

### 基本：isOpen 受控，onClose 与按钮都要自己关

```tsx
<Button status="primary" text="新建" onClick={() => { setEditing(null); setOpen(true); }} />
<Dialog title={editing ? '编辑设备' : '新建设备'} isOpen={open}
  onClose={() => setOpen(false)}            // × / ESC，需自行置 false
  size={[560, 'auto']}                       // 宽 560，高自适应
  buttons={[
    { text: '取消', disabled: saving, onClick: () => setOpen(false) },
    { text: saving ? '保存中...' : '确定', status: 'primary', disabled: saving, onClick: handleSave },
  ]}>
   {/* 表单内容：div + 输入组件拼合 */}
   </Dialog>
```

buttons 每项 = Button props（见 [Button.md](Button.md)），agent 必须构造的形状：

```tsx
interface DialogButton { text: string; status?: 'default'|'primary'|'risk'|'text'; disabled?: boolean; onClick: (event, additionalData?) => void; }
// size / position：[x, y]，任一项可为 null
```

### 弹窗尺寸：宽按场景设、高自适应 + 最大 80% 视口

- **宽度**：按信息密度给固定值（表单 480–560、详情 640–800、内嵌表格 800–1200），或百分比 `'60%'`；窄别低于 360，宽别超过 1200。
- **高度**：`size` 第二项传 `'auto'` + `style={{ maxHeight: '80vh' }}` 限整体上限，内容超出时内部滚动。**不要定死高度**。

### 表单弹窗完整链路：成功才关，失败保持打开 + 编辑回填

```tsx
const handleSave = async (values: DeviceForm) => {
  if (saving) return;
  setSaving(true);
  try {
    await api.save(editing ? { ...values, id: editing.id } : values);
    setOpen(false);                                         // 成功才关
    reloadList();
  } catch (e) {
    showError(e);                                           // 失败保持打开
  } finally {
    setSaving(false);
  }
};

// 编辑：打开后回填（Dialog 默认 destroyOnClose，每次打开表单是新的）
useEffect(() => {
  if (open && editing) formRef.current?.setFieldsValue(editing);
}, [open, editing]);
```

### 非模态 / 不可关闭 / 固定位置 / 自定义标题图标

```tsx
<Dialog isOpen={open} modal={false} movable onClose={close}>…</Dialog>              // 非模态，可拖
<Dialog isOpen={open} closable={false} closeOnEscape={false} buttons={[…]}>…</Dialog> // 只能走按钮
<Dialog isOpen={open} position={[200, 120]} size={[400, 300]} resizable>…</Dialog>
import { IconPlusIcPublicHelp } from '@nce/icon-plus';
<Dialog isOpen={open} title="新建" customIcons={<IconPlusIcPublicHelp />} onClose={close}>…</Dialog>
```

## 3. 联动说明

- 保存成功 → 关窗 + 刷新列表 + 清空 `editing`；失败 → 保持打开并提示
- 打开编辑弹窗 → 用 Form 的 `setFieldsValue` 回填，不要把 record 直接塞 `initialValues`（异步数据不生效）
- 嵌套弹窗：内层关闭不影响外层 `isOpen`；各自独立 state
- 弹窗内的 Select / DatePicker 下拉层依赖 `zindex ≤ 9999`

## 4. 反面示例

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

// ❌ 编辑回填：异步 record 到达时表单已渲染，需手动 setFieldsValue 或 state 回填
<Dialog isOpen={open}>{/* div + 输入组件，异步数据到达后 state 回填 */}</Dialog>

// ❌ 尺寸误用：定死高 [w,480] / 不限 maxHeight 长表单撑出视口 / 宽<360 挤一团或>1200 两侧留白
<Dialog size={[560, 480]} />
<Dialog size={[560, 'auto']} />
<Dialog size={[300, 'auto']} />
```

## 5. API 速查

> 压缩自 `Dialog/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `isOpen` | `boolean`，默认 `false` | 显隐（受控） |
| `onClose` | `(event) => void` | 关闭按钮 / ESC；需自行置 `isOpen=false` |
| `title` / `titleTip` | `any` / `string` | 标题 / 标题提示 |
| `children` | `any` | 内容（React 或原生标签） |
| `buttons` | `Array<ButtonProps>` | 按钮区，如 `[{ text, status: 'primary', onClick }]` |
| `buttonStyle` / `contentStyle` / `maskStyle` / `style` | `CSSProperties` | 按钮区 / 内容区 / 蒙层 / 整体样式 |
| `size` | `[w, h]`，可 `null` / `'auto'` / 百分比 | 大小；**高传 `'auto'` + `style={{ maxHeight: '80vh' }}` 限高**，宽按场景设，勿定死 |
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
| `customIcons` / `url` | `any` / `string` | 标题栏自定义图标（`customIcons={<IconPlusIc* />}`）/ 内嵌第三方页面 |
| `id` / `className` | — | 最外层 |
