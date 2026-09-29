# MessageDialog 组件功能逻辑规格

> 资料来源：TypeDoc `MessageDialog/types` + 官网 MessageDialog 页示例。
> ⚠️ 按钮是**对象** `buttons={{ ok: { text?, onClick, focused? }, cancel: { text?, onClick } }}`，与 Dialog 的数组写法不同；只传 `ok` 就是单按钮提示。
> ⚠️ 七种 `type`：`info`（默认）/ `success` / `error` / `warn` / `confirm` / `risk` / `highRisk`；`risk` / `highRisk` 可配 `hasChecked` 要求用户勾选后才能确认。
> ⚠️ 显隐同 Dialog：`isOpen` 受控，`onClose` / `ok.onClick` / `cancel.onClick` 都要自己 `setIsOpen(false)`。
> ⚠️ demo 用到的 `closeOnEscape` 不在 API 表里，不要依赖。

## 1. 功能定位

MessageDialog 是带类型图标的信息提示框：`content` 一句话结论 + `detail` 详细说明 + 确定 / 取消。删除确认、危险操作二次确认、操作结果反馈都用它，不要用 Dialog 自己拼。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 删除 / 停用等二次确认 | `type="confirm"`，危险操作 `type="risk"` / `"highRisk"`（+ `hasChecked`） | antd `Modal.confirm()` |
| 操作结果反馈（成功 / 失败 / 警告） | `type="success" \| "error" \| "warn"`，只传 `ok` | `alert()`、Dialog |
| 页面内非阻断提示条 | `DivMessage`（[DivMessage.md](DivMessage.md)） | MessageDialog |
| 带表单的弹窗 | `Dialog`（[Dialog.md](Dialog.md)） | MessageDialog 塞表单 |

## 2. 事件与交互逻辑

### 确认类：ok 里做事，成功才关

```tsx
<MessageDialog
  type="confirm"
  isOpen={pending?.type === 'delete'}
  iconLocation="title"
  content={`确定删除 ${pending?.row.name}？`}
  detail="删除后不可恢复"
  onClose={() => setPending(null)}                                   // × 关闭
  buttons={{
    cancel: { text: '取消', onClick: () => setPending(null) },
    ok: {
      text: working ? '删除中...' : '删除',
      focused: true,                                                  // 焦点默认落在 ok
      onClick: async () => {
        if (working || !pending) return;
        setWorking(true);
        try {
          await api.remove(pending.row.id);
          setPending(null);
          setResult({ type: 'success', content: '删除成功' });
          reload();
        } catch (e: any) { setResult({ type: 'error', content: '删除失败', detail: e.message }); }
        finally { setWorking(false); }
      },
    },
  }}
/>
```

buttons 是对象（与 Dialog 数组不同），agent 必须构造的形状：

```tsx
interface MessageButtons { ok?: { text?, onClick, focused? }; cancel?: { text?, onClick } }
type MessageType = 'error'|'info'|'success'|'warn'|'confirm'|'risk'|'highRisk';
interface PendingAction<T> { type: 'delete' | 'reset'; row: T }   // null = 关着
```

### 高危：highRisk + hasChecked，未勾选不放行

```tsx
<MessageDialog
  type="highRisk"
  isOpen={pending?.type === 'reset'}
  hasChecked={agreed}
  onCheckChange={(isChecked: boolean) => setAgreed(isChecked)}
  content="重置将清除全部配置"
  detail="请勾选以确认你已了解影响"
  onClose={() => { setPending(null); setAgreed(false); }}
  buttons={{
    cancel: { onClick: () => { setPending(null); setAgreed(false); } },
    ok: { text: '重置', onClick: () => { if (!agreed) return; doReset(); } },   // 组件不会自动禁用 ok，业务拦
  }}
/>
```

### 结果反馈：单按钮

```tsx
<MessageDialog
  type={result?.type ?? 'info'}
  isOpen={!!result}
  content={result?.content}
  detail={result?.detail}
  detailMessage={result?.raw}                     // 可折叠的技术详情（可选）
  detailMessageTitle="详情"
  onClose={() => setResult(null)}
  buttons={{ ok: { onClick: () => setResult(null) } }}
/>
```

## 3. 联动说明

- Table 操作列 / 批量按钮 → `setPending({ type, row })` 打开确认 → 成功 → 关窗 + 刷新列表 + `success` 反馈
- 请求失败 → 保持确认框打开还是切到 `error` 反馈，二选一（避免两层弹窗）
- `highRisk` 的 `agreed` 在关窗时重置，避免下次打开残留已勾选
- 处理中 `working` → ok 文案切"处理中..."，`onClick` 内 `if (working) return` 防重复（按钮对象无 disabled 字段可依赖时用此法）

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 Modal.confirm / message.success 这类命令式 API，也没有 onOk / onCancel
Modal.confirm({ title: '确定删除？', onOk: remove });
message.success('删除成功');

// ❌ buttons 写成数组（那是 Dialog 的写法）
<MessageDialog buttons={[{ text: '确定', onClick: ok }]} />

// ❌ ok 里先关窗再请求，失败无感知
buttons={{ ok: { onClick: () => { setOpen(false); api.remove(id); } } }}

// ❌ highRisk 传了 hasChecked 却不在 ok.onClick 里判断勾选态（组件不会自动禁用 ok）
buttons={{ ok: { onClick: doReset } }}

// ❌ 用 Dialog 自己拼确认框，丢了类型图标和默认标题
<Dialog title="提示" buttons={[…]}>确定删除？</Dialog>

// ❌ 危险操作用 info 类型，没有风险视觉提示
<MessageDialog type="info" content="删除全部数据？" />
```

## 5. API 速查

> 压缩自 `MessageDialog/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'error' \| 'info' \| 'success' \| 'warn' \| 'confirm' \| 'risk' \| 'highRisk'`，默认 `info` | 类型（决定图标与默认标题） |
| `isOpen` | `boolean`，默认 `false` | 显隐（受控） |
| `onClose` | `(event) => void` | 关闭按钮；需自行置 `isOpen=false` |
| `content` / `detail` | `string` / `any` | 一句话结论 / 详细说明（可 ReactNode） |
| `title` | `string` | 覆盖类型默认标题 |
| `buttons` | `{ ok?: { text?, onClick, focused? }, cancel?: { text?, onClick } }` | 按钮**对象**；`focused` 设默认焦点 |
| `hasChecked` / `onCheckChange` | `boolean` / `(isChecked, event) => void` | `risk` / `highRisk` 的确认勾选 |
| `detailMessage` / `detailMessageTitle` / `detailMessageShow` | `object` / `string`（默认"详情"）/ `boolean`（默认 false） | 可折叠详情 |
| `iconLocation` | `'content' \| 'title'`，默认 `content` | 图标位置（demo 统一用 `title`） |
| `modal` / `closable` | `boolean`，默认 `true` | 模态 / 关闭按钮 |
| `size` / `position` | `[w, h]` / `[x, y]`，可 `'auto'` | 最小 350×240 |
| `maxContHeight` | `number` | 内容区最大高 |
| `zindex` | `string`，默认 `9993` | 层级 |
| `mountId` | `string`，默认 `body` | 挂载节点 |
| `animationOff` / `autoSetPosition` | `boolean`，默认 `false` | 关动画 / 自动定位 |
| `detailStyle` / `style` / `className` / `id` | — | 样式与标识 |
