# TextField 组件功能逻辑规格

> 资料来源：TypeDoc `TextField/TextField` + 官网 TextField 页示例。
> ⚠️ `validator` 返回值 `result` 语义：API 表写"是否有错误"，但官方示例都是 **`result: true` = 校验通过**、`message` 只在失败时展示 → 以示例为准。
> ⚠️ 密码框（`type="password"`）默认不允许通过 props 改 value；想"重置表单"清空 / 回填密码必须开 `isAllowToModifyPasswordByProps`（默认 `false`）。

## 1. 功能定位

TextField 是自带 label、必填星号、内置校验与错误提示的单行输入框，支持原生 input 全部事件。表单里"一行文字 / 数字 / 密码"的输入都用它。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 单行文本 / 密码 / 数字 | `TextField` | antd `Input` / `Input.Password` |
| 多行文本 | `TextArea`（[TextArea.md](TextArea.md)） | — |
| 带搜索图标、回车触发搜索 | `SearchInput`（[SearchInput.md](SearchInput.md)） | TextField 拼图标 |
| 可输入也可下拉选 | `InputSelect`（[InputSelect.md](InputSelect.md)） | — |
| IP 地址 | `IPInput`（[IPInput.md](IPInput.md)） | TextField + 正则 |

## 2. 事件与交互逻辑

### onChange —— 第一个参数是新值，不是 event

```tsx
<TextField
  label="资源名称"
  placeholder="请输入"
  required                                      // 自带非空校验 + 星号
  maxLength={64}
  value={name}
  onChange={(value: string, oldValue: string, event) => setName(value)}
  onBlur={(event, value) => checkNameDuplicate(value)}   // onBlur 是 (event, value)，与 onChange 顺序不同
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
const isWeightAllowed = (value: string) => value === '' || /^([1-9][0-9]{0,2}|1000|0)$/.test(value);
<TextField label="权重" value={weight} isCharacterAllowed={isWeightAllowed} onChange={(v: string) => setWeight(v)} />
```

### 命令式：提交前统一触发校验

```tsx
const handleSubmit = () => {
  const ok = nameRef.current.validate();     // 返回 boolean，并在界面显示错误
  if (!ok) { nameRef.current.focus(); return; }
  submit(nameRef.current.getValue());
};
<TextField ref={nameRef} label="名称" required value={name} onChange={(v: string) => setName(v)} />
```

## 3. 联动说明

- `hintType="tip"` 用气泡提示（省空间，表格 / 弹窗内常用）；`hintType="div"`（默认）在输入框下方占位显示

## 4. 反面示例

```tsx
// ❌ 把 event 当第一个参数（那是原生 input 的签名）
<TextField onChange={(e) => setName(e.target.value)} />

// ❌ antd 习惯：TextField 没有 rules / prefix / allowClear / onPressEnter
<TextField rules={[{ required: true }]} allowClear onPressEnter={search} />

// ❌ validator 返回布尔或改字段名，组件不识别（必须是 { result, message }）
<TextField validator={(v) => v.length > 3} />
<TextField validator={(v) => ({ valid: v.length > 3, msg: '太短' })} />

// ❌ result 语义反了：空值时 result=true，等于"空值通过校验"
<TextField validator={(v) => ({ result: v === '', message: '不能为空' })} />

// ❌ 密码框想通过 props 清空却没开 isAllowToModifyPasswordByProps，重置无效
<TextField type="password" value={pwd} onChange={(v: string) => setPwd(v)} />

// ❌ 只写了 value 没写 onChange，用户输入不进 state，提交拿到的是初始值
<TextField value={name} />
```

## 5. API 速查

> 压缩自 `TextField/TextField`；ref 方法仅列 demo 实际调用过的。

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
