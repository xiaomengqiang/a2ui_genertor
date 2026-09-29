# TextField 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `TextField/TextField`；官网组件页 TextField 及示例 `TextFieldExample.jsx` / `InputValidator.jsx` / `TextFieldEvent.jsx` / `InputPassward.jsx` / `TextFieldCharacterAllowed.jsx` / `TextFieldSuffix.jsx` / `InputDisable.jsx`
>
> ⚠️ `validator` 返回值 `result` 的语义：API 表写"用来设置校验是否有错误"，但 `TextFieldEvent.jsx` 与 Select 的 `selectBasic.tsx` 两个官方示例都是 **`result: true` = 校验通过**、`message` 只在失败时展示 → 以示例为准。

## 1. 功能定位

TextField 是自带 label、必填星号、内置校验与错误提示的单行输入框，支持原生 input 全部事件。表单里"一行文字 / 数字 / 密码"的输入都用它。

| 想要的效果 | 用什么 |
|-----------|--------|
| 单行文本 / 密码 / 数字 | `TextField` |
| 多行文本 | `TextArea`（第二批） |
| 带搜索图标、回车触发搜索 | `SearchInput`（第二批） |
| 可输入也可下拉选 | `InputSelect`（第二批） |
| IP 地址 | `IPInput`（第二批） |

## 2. 典型场景

- 登录 / 注册：用户名（必填 + 长度）、密码（`type="password"`）
- 新建资源表单：名称必填、`maxLength` 限长、`ruleText` 常驻规则提示
- 数值配置项：`format="number"` 只允许数字，或 `isCharacterAllowed` 自定义字符白名单
- 带后缀单位的输入：`suffix="Mbps"`

## 3. 状态声明

```tsx
// 受控写法（官方 demo TextFieldExample.jsx / TextFieldEvent.jsx 均如此）
const [name, setName] = useState<string>('');

// 需要命令式校验 / 取值 / 聚焦时再加 ref（demo TextFieldEvent.jsx：getValue / validate / focus）
const nameRef = useRef<any>(null);

// 密码框如果需要用 props 清空 / 回填，必须开 isAllowToModifyPasswordByProps（默认 false 不允许）
const [password, setPassword] = useState<string>('');
```

## 4. 事件与交互逻辑

### onChange —— 第一个参数是新值，不是 event

```tsx
<TextField
  label="资源名称"
  placeholder="请输入"
  required                                      // 自带非空校验 + 星号
  maxLength={64}
  value={name}
  onChange={(value: string, oldValue: string, event) => setName(value)}
  onBlur={(event, value) => checkNameDuplicate(value)}   // onBlur 是 (event, value)
/>
```

### validator —— 内置规则优先，自定义返回 `{ result, message }`

```tsx
// 内置：TextField.defaultValidator.xxx(...)（api 表列出 18 个；demo 还用了 integer()）
<TextField label="端口" validator={TextField.defaultValidator.range(1, 65535)} hintType="tip" />
<TextField label="邮箱" validator={TextField.defaultValidator.email()} />

// 自定义：result === true 通过；type 告诉你是 onChange 还是 onBlur 触发的
const validateAccount = (value: string, id?: string, type?: string) => {
  const ok = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(value);
  return { result: ok, message: '3-20 位，字母开头，仅含字母数字下划线' };
};
<TextField label="账号" required validator={validateAccount} ruleText="字母开头，3-20 位" />
```

### 输入拦截 —— isCharacterAllowed 返回 false 的字符直接不落入

```tsx
// 只允许 0-1000 的整数（demo TextFieldExample.jsx）
const isWeightAllowed = (value: string) => value === '' || /^([1-9][0-9]{0,2}|1000|0)$/.test(value);
<TextField label="权重" value={weight} isCharacterAllowed={isWeightAllowed} onChange={(v: string) => setWeight(v)} />
```

### 命令式：提交前统一触发校验（demo TextFieldEvent.jsx）

```tsx
const handleSubmit = () => {
  const ok = nameRef.current.validate();     // 返回 boolean，并在界面显示错误
  if (!ok) {
    nameRef.current.focus();
    return;
  }
  submit(nameRef.current.getValue());
};
<TextField ref={nameRef} label="名称" required value={name} onChange={(v: string) => setName(v)} />
```

## 5. 数据结构

```tsx
// 自定义 validator 的返回结构（字段名固定为 result / message，不能改名）
interface ValidateResult {
  result: boolean;                    // true = 通过
  message: string | JSX.Element;      // 失败时展示
  type?: 'error' | 'tip';             // 可选：提示级别
}

// 表单值模型（多个 TextField 时集中管理）
interface LoginForm {
  username: string;
  password: string;
}
```

## 6. 联动说明

- 每个字段 `validate()` 都返回 true → 提交 Button 解锁；任一失败 → `focus()` 到首个错误字段
- `onChange` 时清掉上一次的服务端错误提示；`onBlur` 时做异步查重
- 在 `Form.Item` 内使用时，**不要再传 `value` / `onChange`**，值与校验由 Form 按 `name` 托管（`demos/Form/__demo__/FormRule.jsx`）
- `type="password"` + 需要"重置表单"清空密码 → 加 `isAllowToModifyPasswordByProps`
- `hintType="tip"` 用气泡提示（省空间，表格 / 弹窗内常用）；`hintType="div"`（默认）在输入框下方占位显示

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

// 新建用户表单：必填 + 内置校验 + 自定义校验 + 提交前统一 validate
export default function CreateUserForm() {
  const [account, setAccount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [port, setPort] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<string>('');

  const accountRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const portRef = useRef<any>(null);

  // 自定义校验：result === true 表示通过
  const validateAccount = (value: string) => ({
    result: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(value),
    message: '3-20 位，字母开头，仅含字母、数字、下划线',
  });

  const handleSubmit = async () => {
    // 逐个触发校验，聚焦到第一个失败项
    const refs = [accountRef, emailRef, portRef];
    const firstBad = refs.find((r) => !r.current.validate());
    if (firstBad) {
      firstBad.current.focus();
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setResultMsg('');
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResultMsg(`创建成功：${account} / ${email} / ${port}`);
    } catch (e) {
      setResultMsg('创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: 420, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TextField
        ref={accountRef}
        label="账号"
        placeholder="请输入账号"
        required
        maxLength={20}
        ruleText="字母开头，3-20 位"
        validator={validateAccount}
        value={account}
        onChange={(value: string) => {
          setAccount(value);
          setResultMsg('');
        }}
      />
      <TextField
        ref={emailRef}
        label="邮箱"
        placeholder="name@example.com"
        required
        validator={TextField.defaultValidator.email()}
        value={email}
        onChange={(value: string) => setEmail(value)}
      />
      <TextField
        ref={portRef}
        label="端口"
        placeholder="1-65535"
        format="number"
        validator={TextField.defaultValidator.range(1, 65535)}
        hintType="tip"
        value={port}
        onChange={(value: string) => setPort(value)}
      />
      {resultMsg ? <div style={{ color: '#2da769' }}>{resultMsg}</div> : null}
      <div>
        <Button status="primary" text={submitting ? '提交中...' : '创建'} disabled={submitting} onClick={handleSubmit} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ 把 event 当第一个参数（那是原生 input 的签名）
<TextField onChange={(e) => setName(e.target.value)} />

// ❌ antd 习惯：TextField 没有 rules / prefix / allowClear / onPressEnter
<TextField rules={[{ required: true }]} allowClear onPressEnter={search} />

// ❌ validator 返回布尔或改字段名，组件不识别（必须是 { result, message }）
<TextField validator={(v) => v.length > 3} />
<TextField validator={(v) => ({ valid: v.length > 3, msg: '太短' })} />

// ❌ result 语义反了：这里空值时 result=true，等于"空值通过校验"
<TextField validator={(v) => ({ result: v === '', message: '不能为空' })} />

// ❌ 密码框想通过 props 清空却没开 isAllowToModifyPasswordByProps，重置无效
<TextField type="password" value={pwd} onChange={(v: string) => setPwd(v)} />

// ❌ 只写了 value 没写 onChange，用户输入不进 state，提交拿到的是初始值
<TextField value={name} />
```

## 9. API 速查

> 压缩自 `api/TextField_TextField.md`；ref 方法仅列 `TextFieldEvent.jsx` 实际调用过的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `label` / `placeholder` | `string` | 名称文字 / 占位 |
| `labelPosition` | `'before' \| 'after'`，默认 `before` | label 在左 / 右 |
| `value` | `string` | 受控值 |
| `onChange` | `(value: string, oldValue: string \| number, event) => void` | **第一个参数是新值** |
| `onBlur` | `(event, value) => void` | 失焦；注意与 onChange 参数顺序不同 |
| `onFocus` / `onKeyDown` / `onKeyUp` / `onPaste` / `onClick` | `(event) => void` | 原生事件透传 |
| `type` | `'text' \| 'password'`，默认 `text` | 密码类型需配 `autoComplete` |
| `autoComplete` | `'off' \| 'on' \| 'new-password'`，默认 `off` | 浏览器自动填充 |
| `canPasswordPaste` | `boolean`，默认 `false` | 密码是否允许粘贴 |
| `isAllowToModifyPasswordByProps` | `boolean`，默认 `false` | 密码模式下允许通过 props 改 value |
| `required` / `hideRequiredMark` | `boolean`，默认 `false` | 必填（自带非空校验 + 星号）/ 隐藏星号 |
| `validator` | `(value, id?, type?) => { result, message, type? }` | 自定义校验，`result: true` 通过 |
| `TextField.defaultValidator.*` | 静态方法 | `min max range number email digit url alpha regex postfix ipv4 ipv6 creditCard equalTo notEqualTo minLength maxLength rangeLength`（demo 另有 `integer`） |
| `validateWhileEmpty` | `boolean` | 空值时是否也执行校验 |
| `hintType` | `'div' \| 'tip'`，默认 `div` | 错误提示形式 |
| `ruleText` | `string` | 输入框右侧常驻规则提示 |
| `focusTip` / `showFocusTipAndError` | `string` / `boolean` | 聚焦提示；与错误同时显示 |
| `isCharacterAllowed` | `(value, id) => boolean` | 返回 false 的输入不落入 |
| `format` | `'number' \| 'any'`，默认 `any` | `number` 只能输数字 |
| `maxLength` | `number` | 最大长度 |
| `suffix` | `React.ReactNode` | 后缀元素 |
| `disabled` / `readOnly` | `boolean`，默认 `false` | 灰化 / 只读 |
| `inputStyle` / `labelStyle` / `containerStyle` / `tipStyle` | `CSSProperties` | 局部样式 |
| `enableFixWidth` | `'small' \| 'middle' \| 'large' \| 'none'`，默认 `none` | label 与输入框间隔 |
| `ref.getValue()` / `ref.validate()` / `ref.focus()` | 命令式方法 | 取值 / 触发校验（返回 boolean）/ 聚焦 |
