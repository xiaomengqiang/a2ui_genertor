# IPInput 组件功能逻辑规格

> 资料来源：TypeDoc `IPInput/IPInput` + 官网 IP Input 页示例。
> ⚠️ 值是**完整字符串**（如 `'10.8.52.211'`），组件内部拆成分段输入框；`onChange(value, event)` / `onBlur(value, event)` 第一个参数都是拼好的字符串。
> ⚠️ `type` 三种：`v4`（默认）/ `v6` / `mac`；MAC 类型粘贴带分隔符的串时行为由 `liftDelimiterOnPaste` 控制，`onChange` 回传去掉分隔符的十六进制文本，需自行格式化。

## 1. 功能定位

IPInput 是分段式 IP / MAC 输入框：按段校验、自动跳格、必填、自定义校验。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| IPv4 / IPv6 / MAC 地址输入 | `IPInput type="v4" \| "v6" \| "mac"` | `TextField` + 正则 |
| IP 校验但允许任意文本（如网段 CIDR） | `TextField validator={TextField.defaultValidator.ipv4()}` 或自定义（[TextField.md](TextField.md)） | IPInput |
| 端口、数字 | `Spinner` / `TextField format="number"` | IPInput |

## 2. 事件与交互逻辑

```tsx
<IPInput
  label="管理 IP"
  type="v4"
  required
  hintType="tip"
  value={ip}
  onChange={(value: string, event) => setIp(value)}            // 第一个参数是完整 IP 字符串
  onBlur={(value: string, event) => checkDuplicate(value)}      // 失焦做异步查重
  validator={(value: string) => ({ result: !value.startsWith('127.'), message: '不能使用回环地址' })}   // result: true 通过
/>

<IPInput label="IPv6" type="v6" value={ip6} onChange={(v: string) => setIp6(v)} />
<IPInput label="MAC" type="mac" value={mac} onChange={(v: string) => setMac(v)} liftDelimiterOnPaste />

// 命令式取值
const current = ipRef.current.getValue();
```

## 3. 联动说明

- 未填满的段：组件按段校验，提交前用 `ipRef.current.getValue()` 拿最终拼好的字符串
- 类型切换（RadioGroup v4/v6）→ 切换 `type` 并清空 `value`（v4 的值留在 v6 输入里会出错）

## 4. 反面示例

```tsx
// ❌ 用 TextField 手写 IP 正则替代分段输入（丢掉自动跳格与按段校验）
<TextField validator={(v) => ({ result: /^(\d{1,3}\.){3}\d{1,3}$/.test(v), message: 'IP 格式错误' })} />

// ❌ 把 value 拆成数组传（组件要完整字符串）
<IPInput value={['10', '0', '0', '1']} />

// ❌ 把 onChange 第一个参数当 event
<IPInput onChange={(e) => setIp(e.target.value)} />

// ❌ 类型切换不清空旧值，v4 的值留在 v6 输入里
onChange={(t) => setIpType(t)}   // 少了 setIp('')

// ❌ validator 返回布尔（必须 { result, message }）
<IPInput validator={(v) => !v.startsWith('127.')} />
```

## 5. API 速查

> 压缩自 `IPInput/IPInput`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'v4' \| 'v6' \| 'mac'`，默认 `v4` | 地址类型 |
| `value` | `string` | 完整地址字符串（受控） |
| `onChange` / `onBlur` / `onFocus` | `(value: string, event) => void` | 第一个参数是完整地址 |
| `delimiter` | `string` | 分隔符（v4 默认 `.`，v6 默认 `:`） |
| `required` / `validator` / `hintType` | `boolean` / `(value) => { result, message }` / `'div' \| 'tip'` | 校验 |
| `disabled` / `readOnly` | `boolean`，默认 `false` | 灰化 / 只读 |
| `autoSetZero` | `boolean` | 自动补 0 |
| `enableFocusAndInputNext` | `boolean`，默认 `false` | 段满后再输入自动跳到下一段并填入 |
| `liftDelimiterOnPaste` | `boolean`，默认 `false` | MAC 粘贴带分隔符串的处理 |
| `label` / `labelPosition` / `labelStyle` / `labelClassName` | — | 名称文字 |
| `inputStyle` / `style` / `className` / `id` / `onClick` | — | 样式与事件 |
| `ref.getValue()` | `() => string` | 取当前值（demo） |
