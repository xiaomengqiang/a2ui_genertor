# Toggle 组件功能逻辑规格（含 Switch）

> 资料来源：TypeDoc `Toggle/Toggle`、`Switch/Switch` + 官网 Toggle 页示例。
> ⚠️ 官方 demo 全部 `import Toggle from 'eview-react/Toggle'`，`Switch` 是同 API 的超集（多 `allowPropagation` / `isControlToggled`）；需要"点击后先二次确认再切换"时换 `Switch` 的 `isControlToggled`。
> ⚠️ 状态属性叫 **`toggled`**、回调叫 **`onToggle(value)`**，`value` 来自 `data=[关值, 开值]`；不是 `checked` / `onChange`。
> ⚠️ 文案属性拼写是 `taggledChildren` / `unTaggledChildren`（官方即如此拼），照抄。

## 1. 功能定位

Toggle 是两态开关：立即生效的启用 / 禁用切换，可带 label、开关内文字或图标。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 设置项的启用 / 禁用（立即生效） | `Toggle` 或 `Switch` | antd `Switch checked onChange` |
| 需要勾选后再提交的布尔项 | `Checkbox`（[Checkbox.md](Checkbox.md)） | Toggle |
| 切换前要二次确认 | `Switch isControlToggled` + `MessageDialog` | Toggle 直接切 |
| 多个互斥选项 | `RadioGroup` / `SelectCard` | 多个 Toggle |

## 2. 事件与交互逻辑

### 基本：toggled + onToggle

```tsx
const [enabled, setEnabled] = useState<boolean>(false);
<Toggle
  label="启用告警"
  data={[false, true]}                    // data：两态对应的值 [关, 开]，决定 onToggle 回传的值
  toggled={enabled}
  onToggle={(value: boolean) => setEnabled(value)}   // value 是 data 中对应状态的值
/>
```

### 开关内显示文字 / 图标

```tsx
// 文字（拼写照官方：taggledChildren / unTaggledChildren）
<Toggle toggled={on} taggledChildren="开" unTaggledChildren="关" onToggle={(v: boolean) => setOn(v)} />

// 图标（icon+ 组件）
import { IconPlusIcPublicCheck, IconPlusIcPublicClose } from '@nce/icon-plus';
<Toggle toggled={on} taggledChildren={<IconPlusIcPublicCheck />} unTaggledChildren={<IconPlusIcPublicClose />} onToggle={(v: boolean) => setOn(v)} />
```

### 行内开关：切换即请求，失败回滚

```tsx
const handleToggle = async (row: Rule, value: boolean) => {
  if (switching.has(row.id)) return;
  setSwitching((s) => new Set(s).add(row.id));
  const prev = row.enabled;
  setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, enabled: value } : r)));   // 先乐观更新
  try {
    await api.setEnabled(row.id, value);
  } catch (e) {
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, enabled: prev } : r)));  // 失败回滚
  } finally {
    setSwitching((s) => { const n = new Set(s); n.delete(row.id); return n; });
  }
};
<Toggle data={[false, true]} toggled={row.enabled} disabled={switching.has(row.id)} onToggle={(v: boolean) => handleToggle(row, v)} />
```

### 切换前二次确认（Switch.isControlToggled）

```tsx
<Switch
  isControlToggled                                     // 外部控制：点击不自动切，等业务 setState
  data={[false, true]}
  toggled={protection}
  onToggle={(value: boolean) => (value ? setProtection(true) : setConfirmOpen(true))}   // 关闭需确认
/>
// MessageDialog ok → setProtection(false)
```

## 3. 联动说明

- 开启 → 显示子配置区块；关闭 → 隐藏并清掉子配置里的值
- 行内开关切换 → 立即请求 → 失败回滚 + 提示；切换中 `disabled`
- 危险方向的切换（如关闭防护）走 `Switch isControlToggled` + 确认框，安全方向直接切

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 checked / onChange / checkedChildren / loading / size
<Switch checked={on} onChange={setOn} checkedChildren="开" loading={busy} size="small" />

// ❌ 把 onToggle 当无参回调，自己翻转 state，data 传了也不用 → 与组件显示可能不同步
<Toggle data={['off', 'on']} toggled={on} onToggle={() => setOn(!on)} />

// ❌ 拼写按"正确英文"写成 toggledChildren（官方是 taggledChildren）
<Toggle toggledChildren="开" untoggledChildren="关" />

// ❌ 行内开关切换后不处理失败，接口报错界面仍显示已开启
onToggle={(v) => { setEnabled(v); api.setEnabled(v); }}

// ❌ 用 Toggle 表达"提交前勾选同意"（应为 Checkbox）
<Toggle label="我已阅读协议" />
```

## 5. API 速查

> 压缩自 `Toggle/Toggle` + `Switch/Switch`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `toggled` | `boolean`，默认 `false` | 开关态 |
| `onToggle` | `(value) => void` | 点击回调，`value` 为 `data` 中当前状态对应的值 |
| `data` | `any[]`，如 `[关值, 开值]` | 两态的值集合，推荐设置；**必须用布尔 `[false, true]`** |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 文本及位置 |
| `taggledChildren` / `unTaggledChildren` | `string \| ReactNode` | 开 / 关状态下开关内的内容（拼写照官方） |
| `disabled` | `boolean`，默认 `false` | 禁用 |
| `required` | `boolean`，默认 `false` | 必填标记 |
| `fieldStyle` / `fieldClassName` / `labelStyle` / `labelClassName` / `style` / `className` / `id` | — | 样式与标识 |
| `Switch.isControlToggled` | `boolean` | 外部控制切换（点击后先确认再 setState） |
| `Switch.allowPropagation` | `boolean`，默认 `false` | 允许点击事件向上冒泡（如被 TipBox 包裹） |
