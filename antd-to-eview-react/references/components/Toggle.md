# Toggle 组件功能逻辑规格（含 Switch）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Toggle/Toggle`、`Switch/Switch`（同一套 props，Switch 多 `allowPropagation` / `isControlToggled`）；官网组件页 Toggle（目录名 Switch）及示例 `SwitchExample.jsx` / `SwitchInteractiveExample.jsx` / `SwitchTextExample.jsx` / `SwitchIconExample.jsx` / `SwitchTipExample.jsx`；Form 示例 `FormItem.jsx`（`valuePropName="toggled" updateTrigger="onToggle"`）
>
> ⚠️ 官方 demo 全部 `import Toggle from 'eview-react/Toggle'`，`Switch` 是同 API 的超集；本文按 `Toggle` 写，需要"点击后先二次确认再切换"时换 `Switch` 的 `isControlToggled`。
> ⚠️ 状态属性叫 **`toggled`**、回调叫 **`onToggle(value)`**，`value` 来自 `data=[关值, 开值]`；不是 `checked` / `onChange`。
> ⚠️ 文案属性拼写是 `taggledChildren` / `unTaggledChildren`（官方即如此拼），照抄。

## 1. 功能定位

Toggle 是两态开关：立即生效的启用 / 禁用切换，可带 label、开关内文字或图标。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 设置项的启用 / 禁用（立即生效） | `Toggle` | antd `Switch checked onChange` |
| 需要勾选后再提交的布尔项 | `Checkbox`（[Checkbox.md](Checkbox.md)） | Toggle |
| 切换前要二次确认 | `Switch isControlToggled` + `MessageDialog` | Toggle 直接切 |
| 多个互斥选项 | `RadioGroup` / `SelectCard` | 多个 Toggle |

## 2. 典型场景

- 列表行"启用"开关：切换即调接口，失败回滚
- 设置页开关联动：开启后显示下方子配置
- 表单里的布尔字段：在 `Form.Item` 内配 `valuePropName="toggled" updateTrigger="onToggle"`
- 危险切换（关闭防护）：`Switch isControlToggled` 先弹 `MessageDialog` 确认

## 3. 状态声明

```tsx
// 受控写法（demo SwitchInteractiveExample.jsx：toggled 绑 state，onToggle 里翻转）
const [enabled, setEnabled] = useState<boolean>(false);

// data 决定 onToggle 回传的值：[关, 开]；不传 data 时 demo 直接按 !toggled 翻转
const TOGGLE_DATA: [boolean, boolean] = [false, true];

// 列表行开关：切换中的行 id，防止连点
const [switching, setSwitching] = useState<Set<string>>(new Set());
```

## 4. 事件与交互逻辑

### 基本：toggled + onToggle

```tsx
<Toggle
  label="启用告警"
  data={[false, true]}
  toggled={enabled}
  onToggle={(value: boolean) => setEnabled(value)}   // value 是 data 中对应状态的值
/>
```

### 开关内显示文字 / 图标

```tsx
// 文字
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

### 在 Form 内

```tsx
<Form.Item label="启用" name="enabled" valuePropName="toggled" updateTrigger="onToggle">
  <Toggle data={[false, true]} />
</Form.Item>
```

## 5. 数据结构

```tsx
// data：两态对应的值 [关, 开]，可以是布尔、数字或字符串（api 示例 ["33", "44"]）
type ToggleData<T> = [T, T];

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
}
```

## 6. 联动说明

- 开启 → 显示子配置区块；关闭 → 隐藏并清掉子配置里的值
- 行内开关切换 → 立即请求 → 失败回滚 + 提示；切换中 `disabled`
- 与 Form 配合时不传 `toggled` / `onToggle`，用 `valuePropName` / `updateTrigger` 让 Form 托管
- 危险方向的切换（如关闭防护）走 `Switch isControlToggled` + 确认框，安全方向直接切

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import Toggle from '@nce/eview-react/Toggle';
import Spinner from '@nce/eview-react/Spinner';

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
}

// 告警规则设置：总开关联动子配置；规则列表行内开关切换即保存、失败回滚
export default function AlarmRuleSettings() {
  const [master, setMaster] = useState<boolean>(true);
  const [checkInterval, setCheckInterval] = useState<number>(30);
  const [rows, setRows] = useState<Rule[]>([
    { id: 'r1', name: 'CPU > 85%', enabled: true },
    { id: 'r2', name: '端口 down', enabled: false },
  ]);
  const [switching, setSwitching] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string>('');

  const handleRowToggle = async (row: Rule, value: boolean) => {
    if (switching.has(row.id)) return;
    setSwitching((s) => new Set(s).add(row.id));
    const prev = row.enabled;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, enabled: value } : r)));
    try {
      // 真实项目替换为已有 Service；模拟第二条规则开启失败
      await new Promise((resolve, reject) => setTimeout(() => (row.id === 'r2' && value ? reject(new Error('规则冲突')) : resolve(null)), 300));
      setMessage('');
    } catch (e: any) {
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, enabled: prev } : r)));
      setMessage(`${row.name} 切换失败：${e.message}`);
    } finally {
      setSwitching((s) => { const n = new Set(s); n.delete(row.id); return n; });
    }
  };

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Toggle label="启用告警" data={[false, true]} toggled={master} taggledChildren="开" unTaggledChildren="关" onToggle={(v: boolean) => setMaster(v)} />

      {master ? (
        <Spinner label="检测间隔(秒)" min={5} max={300} step={5} doNotFocusWhenValueUpdate value={checkInterval} onChange={(v: number) => setCheckInterval(v)} />
      ) : null}

      <div className="app-toggle-list" style={{ paddingTop: 12 }}>
        {rows.map((row) => (
          <div key={row.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <span className={master ? "app-toggle-label" : "app-toggle-label-disabled"}>{row.name}</span>
            <Toggle
              data={[false, true]}
              toggled={row.enabled}
              disabled={!master || switching.has(row.id)}
              onToggle={(v: boolean) => handleRowToggle(row, v)}
            />
          </div>
        ))}
      </div>
      {message ? <div className="app-error">{message}</div> : null}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 checked / onChange / checkedChildren / loading / size
<Switch checked={on} onChange={setOn} checkedChildren="开" loading={busy} size="small" />

// ❌ 把 onToggle 当无参回调，自己翻转 state，data 传了也不用 → 与组件显示可能不同步
<Toggle data={['off', 'on']} toggled={on} onToggle={() => setOn(!on)} />

// ❌ 拼写按"正确英文"写成 toggledChildren（官方是 taggledChildren）
<Toggle toggledChildren="开" untoggledChildren="关" />

// ❌ 行内开关切换后不处理失败，接口报错界面仍显示已开启
onToggle={(v) => { setEnabled(v); api.setEnabled(v); }}

// ❌ Form 内不配 valuePropName / updateTrigger，Form 收不到值
<Form.Item name="enabled"><Toggle /></Form.Item>

// ❌ 用 Toggle 表达"提交前勾选同意"（应为 Checkbox）
<Toggle label="我已阅读协议" />
```

## 9. API 速查

> 压缩自 `Toggle/Toggle` + `Switch/Switch`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `toggled` | `boolean`，默认 `false` | 开关态 |
| `onToggle` | `(value) => void` | 点击回调，`value` 为 `data` 中当前状态对应的值 |
| `data` | `any[]`，如 `[关值, 开值]` | 两态的值集合，推荐设置 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 文本及位置 |
| `taggledChildren` / `unTaggledChildren` | `string \| ReactNode` | 开 / 关状态下开关内的内容（拼写照官方） |
| `disabled` | `boolean`，默认 `false` | 禁用 |
| `required` | `boolean`，默认 `false` | 必填标记 |
| `fieldStyle` / `fieldClassName` / `labelStyle` / `labelClassName` / `style` / `className` / `id` | — | 样式与标识 |
| `Switch.isControlToggled` | `boolean` | 外部控制切换（点击后先确认再 setState） |
| `Switch.allowPropagation` | `boolean`，默认 `false` | 允许点击事件向上冒泡（如被 TipBox 包裹） |
