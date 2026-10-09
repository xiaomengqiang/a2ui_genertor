# DivMessage 组件功能逻辑规格

> ⚠️ 显隐是 **`display`**（不是 `visible`），默认 **10 秒自动消失**（`disposeTimeOut`，`enableDisposeTimeOut` 可关）；自动消失会无参调用 `onClose()`，在回调里同步外部 `display=false`。否则父级重渲染可能把内部已隐藏的提示再次显示；重复提示正常做 false → true，无须强制换 key。
> ⚠️ 没有命令式 API：不存在 `message.success()`，只能渲染一个 `<DivMessage>` 并控制 `display`。

## 1. 功能定位

DivMessage 是区域内的结果提示条：直接显示在内容区上方，默认 / 成功 / 失败 / 警告四种类型，可带标题、图标、自定义内容，自动消失。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 操作后的轻量结果提示（保存成功、校验失败） | `DivMessage` | antd `message.xxx()` / `Alert` |
| 需要用户确认才能继续 | `MessageDialog`（[MessageDialog.md](MessageDialog.md)） | DivMessage |
| 页面级常驻公告 | `PageMessage`（未覆盖） | DivMessage 关掉自动消失硬凑 |
| 输入框旁的校验错误 | 控件自带 `hintType` | DivMessage |

## 2. 典型场景

- 表单保存后："保存成功"绿色提示，10 秒自动消失
- 批量操作结果："成功 8 条，失败 2 条" + `title`
- 请求失败：`type="error"` + `enableDisposeTimeOut={false}` 常驻直到用户关闭
- 弹窗 / 抽屉内操作反馈：放在内容区顶部

## 3. 状态声明

```tsx
// null = display=false；手动关闭和自动消失都通过 onClose 同步为 null
const [notice, setNotice] = useState<{ type: 'default' | 'success' | 'error' | 'warn'; text: string; title?: string } | null>(null);
const notify = (type: Notice['type'], text: string, title?: string) => setNotice({ type, text, title });
```

## 4. 事件与交互逻辑

```tsx
<DivMessage
  display={!!notice}
  type={notice?.type ?? 'default'}
  title={notice?.title}
  text={notice?.text ?? ''}
  disposeTimeOut={5000}                          // 5 秒后自动隐藏（默认 10000）
  onClose={() => setNotice(null)}                // 点 × 或自动消失
  style={{ marginBottom: 12 }}
/>

// 常驻错误：关掉自动消失
<DivMessage display={!!errorText} type="error" text={errorText} enableDisposeTimeOut={false} onClose={() => setErrorText('')} />

// 自定义内容
<DivMessage display type="success" title="批量删除完成"><div>成功 8 条，失败 2 条（<a href="#log">查看日志</a>）</div></DivMessage>

// 自定义图标（默认用 icon+ 组件）
import { IconPlusIcPublicInfo } from '@nce/icon-plus';
<DivMessage display type="success" showIcon icon={<IconPlusIcPublicInfo />} text="已保存" />
```

## 5. 数据结构

```tsx
interface Notice {
  type: 'default' | 'success' | 'error' | 'warn';
  text: string;
  title?: string;
}
```

## 6. 联动说明

- 请求 `try` 成功 → `notify('success', …)`；`catch` → `notify('error', …)`；同一位置只显示最新一条
- 表单校验失败（Form `onFailed`）→ `notify('warn', '请修正标红字段')`
- 关闭 / 自动消失 → `setNotice(null)`，使 display=false；下次 notify 再变为 true。同一提示仍显示期间仅更换文案，不保证重新计时；需重新计时时先完成一次关闭再显示，避免同批次 false / true 被合并。
- 提示条放在被操作区域的顶部，而不是页面顶部

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import DivMessage from '@nce/eview-react/DivMessage';
import Button from '@nce/eview-react/Button';
import TextField from '@nce/eview-react/TextField';

interface Notice { type: 'default' | 'success' | 'error' | 'warn'; text: string; title?: string; }

// 保存设置：成功 / 失败提示条在表单顶部，5 秒自动消失，失败常驻
export default function SettingsPanel() {
  const [name, setName] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const notify = (type: Notice['type'], text: string, title?: string) => setNotice({ type, text, title });

  const handleSave = async () => {
    if (saving) return;
    if (name.trim() === '') { notify('warn', '名称不能为空'); return; }
    setSaving(true);
    setNotice(null); // 新请求先关闭旧提示，结果返回后再显示
    try {
      await new Promise((resolve, reject) => setTimeout(() => (name === 'bad' ? reject(new Error('名称已存在')) : resolve(null)), 300));   // 真实项目替换为已有 Service
      notify('success', `已保存：${name}`);
    } catch (e: any) {
      notify('error', e.message, '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ width: 480, padding: 24 }}>
      <DivMessage
        display={!!notice}
        type={notice?.type ?? 'default'}
        title={notice?.title}
        text={notice?.text ?? ''}
        disposeTimeOut={5000}
        enableDisposeTimeOut={notice?.type !== 'error'}     // 失败常驻，其余自动消失
        onClose={() => setNotice(null)}
        style={{ marginBottom: 12 }}
      />
      <TextField label="名称" required value={name} onChange={(v: string) => setName(v)} />
      <Button status="primary" text={saving ? '保存中...' : '保存'} disabled={saving} onClick={handleSave} style={{ marginTop: 16 }} />
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有命令式 message.success()，也没有 Alert 的 showIcon / closable / banner
message.success('保存成功');
<Alert type="success" showIcon closable banner />

// ❌ 显隐属性写 visible / isOpen（DivMessage 是 display）
<DivMessage visible={show} text="ok" />

// ❌ 自动消失后外部仍保持 true；父级重渲染会使提示重新出现
const [show, setShow] = useState(false);
<DivMessage display={show} text={msg} />      // 应加 onClose={() => setShow(false)}，下次再 setShow(true)

// ❌ 错误提示也 10 秒自动消失，用户没看见就没了
<DivMessage type="error" text={err} />       // 加 enableDisposeTimeOut={false}

// ❌ type 写 warning / info（只有 default / success / error / warn）
<DivMessage type="warning" />
```

## 9. API 速查

> 压缩自 `DivMessage/DivMessage`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `display` | `boolean`，默认 `true` | 显隐 |
| `type` | `'default' \| 'success' \| 'error' \| 'warn'`，默认 `default` | 类型 |
| `text` / `title` / `children` | `string` / `string` / `ReactNode` | 文本 / 标题 / 自定义内容 |
| `disposeTimeOut` | `number`，默认 `10000` | 自动消失毫秒数 |
| `enableDisposeTimeOut` | `boolean`，默认 `true` | 是否自动消失 |
| `onClose` | `(event?) => void` | 手动关闭或自动消失（自动时无参数）；应同步外部 display=false |
| `closeIconDisplay` / `closeIconFocus` / `lastfocus` | `boolean`，默认 `true` | 关闭按钮显示 / 聚焦 / 关闭后焦点返回 |
| `showIcon` / `icon` / `iconClassName` | `boolean`（默认 true）/ `string \| ReactElement` / `string` | 图标（默认用 `icon={<IconPlusIc* />}`） |
| `size` | `string[]`，默认 `['auto','auto']` | 宽高 |
| `id` / `className` / `style` | — | 最外层 |
