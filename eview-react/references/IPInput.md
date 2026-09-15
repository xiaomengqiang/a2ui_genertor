# IPInput 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `IPInput/IPInput`；官网组件页 IP Input 及示例 `IPInputDemo.jsx` / `IPInputEventDemo.jsx` / `IpInputDisabled.jsx` / `IpInputType.jsx`；Form 示例 `FormPro.jsx`
>
> ⚠️ 值是**完整字符串**（如 `'10.8.52.211'`），组件内部拆成分段输入框；`onChange(value, event)` / `onBlur(value, event)` 第一个参数都是拼好的字符串。
> ⚠️ `type` 三种：`v4`（默认）/ `v6` / `mac`；MAC 类型粘贴带分隔符的串时行为由 `liftDelimiterOnPaste` 控制，`onChange` 回传去掉分隔符的十六进制文本，需自行格式化。

## 1. 功能定位

IPInput 是分段式 IP / MAC 输入框：按段校验、自动跳格、必填、自定义校验。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| IPv4 / IPv6 / MAC 地址输入 | `IPInput type="v4" \| "v6" \| "mac"` | `TextField` + 正则 |
| IP 校验但允许任意文本（如网段 CIDR） | `TextField validator={TextField.defaultValidator.ipv4()}` 或自定义 | IPInput |
| 端口、数字 | `Spinner` / `TextField format="number"` | IPInput |

## 2. 典型场景

- 网元配置：管理 IP（v4）、IPv6 地址、MAC 地址各一个输入
- 必填 + 业务校验：不能是保留地址 / 不能与已有重复
- 在 Form 内：`Form.Item name="ip" rules={[{ required: true }]}`（demo FormPro）
- 编辑回填：`value` 传完整字符串

## 3. 状态声明

```tsx
const [ip, setIp] = useState<string>('');            // '10.8.52.211'
const [mac, setMac] = useState<string>('');
const ipRef = useRef<any>(null);                     // demo：getValue()
```

## 4. 事件与交互逻辑

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

// 命令式取值（demo IPInputEventDemo.jsx）
const current = ipRef.current.getValue();
```

在 Form 内（demo FormPro.jsx）：

```tsx
<Form.Item label="IP" name="ip" rules={[{ required: true }]}>
  <IPInput type="v4" />
</Form.Item>
```

## 5. 数据结构

```tsx
type IpType = 'v4' | 'v6' | 'mac';
interface NetworkForm {
  mgmtIp: string;      // '10.8.52.211'
  ipv6?: string;
  mac?: string;        // 'AA-BB-CC-DD-EE-FF'（mac 默认以 - 分隔）
}
```

## 6. 联动说明

- IP 填完失焦 → 异步查重 / 探测可达性，结果显示在旁边
- 类型切换（RadioGroup v4/v6）→ 切换 `type` 并清空 `value`
- `required` 与其他控件一起提交前校验；Form 内由 Form 托管
- 未填满的段：组件按段校验，提交前用 `ipRef.current.getValue()` 拿最终值

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import IPInput from '@nce/eview-react/IPInput';
import RadioGroup from '@nce/eview-react/RadioGroup';
import Button from '@nce/eview-react/Button';

// 网元地址配置：v4/v6 切换、失焦查重、MAC 输入、提交取值
export default function NetAddressForm() {
  const [ipType, setIpType] = useState<'v4' | 'v6'>('v4');
  const [ip, setIp] = useState<string>('');
  const [mac, setMac] = useState<string>('');
  const [dupMsg, setDupMsg] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const ipRef = useRef<any>(null);

  const handleTypeChange = (a: string, b: string) => {          // RadioGroup 参数顺序冲突，取与当前值不同的那个
    const next = (a === ipType ? b : a) as 'v4' | 'v6';
    setIpType(next);
    setIp('');
    setDupMsg('');
  };

  const handleBlur = async (value: string) => {
    if (!value) return;
    await new Promise((resolve) => setTimeout(resolve, 200));    // 真实项目替换为已有 Service
    setDupMsg(value === '10.0.0.1' ? '该 IP 已被 core-sw-01 占用' : '');
  };

  const handleSubmit = () => {
    const finalIp: string = ipRef.current.getValue();
    if (!finalIp || dupMsg) { setResult('请填写可用的 IP'); return; }
    setResult(`保存：${ipType} ${finalIp}${mac ? ` / MAC ${mac}` : ''}`);
  };

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioGroup label="地址类型" isControlled data={[{ value: 'v4', text: 'IPv4' }, { value: 'v6', text: 'IPv6' }]} value={ipType} onChange={handleTypeChange} />
      <IPInput ref={ipRef} label="管理 IP" type={ipType} required hintType="tip" value={ip} onChange={(value: string) => { setIp(value); setDupMsg(''); }} onBlur={(value: string) => handleBlur(value)} />
      {dupMsg ? <div style={{ color: 'var(--colorAlarmUrgent)' }}>{dupMsg}</div> : null}
      <IPInput label="MAC" type="mac" value={mac} onChange={(value: string) => setMac(value)} />
      {result ? <div>{result}</div> : null}
      <div><Button status="primary" text="保存" onClick={handleSubmit} /></div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

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
