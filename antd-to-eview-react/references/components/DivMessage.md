# DivMessage 组件功能逻辑规格

> 资料来源：TypeDoc `DivMessage/DivMessage` + 官网 DivMessage 页示例。
> ⚠️ 显隐是 **`display`**（不是 `visible`），默认 **10 秒自动消失**（`disposeTimeOut`，`enableDisposeTimeOut` 可关）；自动消失后组件内部隐藏，但外部 `display` state 仍是 true，再次触发前要先置回 false（或每次用新 key 重挂）。
> ⚠️ 没有命令式 API：不存在 `message.success()`，只能渲染一个 `<DivMessage>` 并控制 `display`。

## 1. 功能定位

DivMessage 是区域内的结果提示条：直接显示在内容区上方，默认 / 成功 / 失败 / 警告四种类型，可带标题、图标、自定义内容，自动消失。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 操作后的轻量结果提示（保存成功、校验失败） | `DivMessage` | antd `message.xxx()` / `Alert` |
| 需要用户确认才能继续 | `MessageDialog`（[MessageDialog.md](MessageDialog.md)） | DivMessage |
| 页面级常驻公告 | `PageMessage`（未覆盖） | DivMessage 关掉自动消失硬凑 |
| 输入框旁的校验错误 | 控件自带 `hintType` | DivMessage |

## 2. 事件与交互逻辑

```tsx
{notice ? (
  <DivMessage
    key={notice.key}                              // 换 key 重挂，重置自动消失计时
    display
    type={notice.type}
    title={notice.title}
    text={notice.text}
    disposeTimeOut={5000}                          // 5 秒后自动隐藏（默认 10000）
    onClose={() => setNotice(null)}                // 用户点 ×
    style={{ marginBottom: 12 }}
  />
) : null}

// 常驻错误：关掉自动消失
<DivMessage display type="error" text={errorText} enableDisposeTimeOut={false} onClose={() => setErrorText('')} />

// 自定义内容
<DivMessage display type="success" title="批量删除完成"><div>成功 8 条，失败 2 条（<a href="#log">查看日志</a>）</div></DivMessage>

// 自定义图标（默认用 icon+ 组件）
import { IconPlusIcPublicInfo } from '@nce/icon-plus';
<DivMessage display type="success" showIcon icon={<IconPlusIcPublicInfo />} text="已保存" />
```

## 3. 联动说明

- 请求 `try` 成功 → `notify('success', …)`；`catch` → `notify('error', …)`；同一位置只显示最新一条
- 表单校验失败（Form `onFailed`）→ `notify('warn', '请修正标红字段')`
- 关闭 / 自动消失 → `setNotice(null)`（自动消失时组件不回调 `onClose`，靠换 key 即可，不必同步 state）
- 提示条放在被操作区域的顶部，而不是页面顶部

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有命令式 message.success()，也没有 Alert 的 showIcon / closable / banner
message.success('保存成功');
<Alert type="success" showIcon closable banner />

// ❌ 显隐属性写 visible / isOpen（DivMessage 是 display）
<DivMessage visible={show} text="ok" />

// ❌ 自动消失后不换 key，第二次 setShow(true) 时组件内部已隐藏，什么都不显示
const [show, setShow] = useState(false);
<DivMessage display={show} text={msg} />      // 用 key={Date.now()} 或 setNotice(null) 后再设

// ❌ 错误提示也 10 秒自动消失，用户没看见就没了
<DivMessage type="error" text={err} />       // 加 enableDisposeTimeOut={false}

// ❌ type 写 warning / info（只有 default / success / error / warn）
<DivMessage type="warning" />
```

## 5. API 速查

> 压缩自 `DivMessage/DivMessage`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `display` | `boolean`，默认 `true` | 显隐 |
| `type` | `'default' \| 'success' \| 'error' \| 'warn'`，默认 `default` | 类型 |
| `text` / `title` / `children` | `string` / `string` / `ReactNode` | 文本 / 标题 / 自定义内容 |
| `disposeTimeOut` | `number`，默认 `10000` | 自动消失毫秒数 |
| `enableDisposeTimeOut` | `boolean`，默认 `true` | 是否自动消失 |
| `onClose` | `(event?) => void` | 点关闭按钮 |
| `closeIconDisplay` / `closeIconFocus` / `lastfocus` | `boolean`，默认 `true` | 关闭按钮显示 / 聚焦 / 关闭后焦点返回 |
| `showIcon` / `icon` / `iconClassName` | `boolean`（默认 true）/ `string \| ReactElement` / `string` | 图标（默认用 `icon={<IconPlusIc* />}`） |
| `size` | `string[]`，默认 `['auto','auto']` | 宽高 |
| `id` / `className` / `style` | — | 最外层 |
