# TextArea 组件功能逻辑规格

> 资料来源：TypeDoc `TextArea/TextArea` + 官网 TextArea 页示例。
> ⚠️ 与 TextField 的差别：`onBlur` / `onFocus` 只给 `event`（TextField 的 `onBlur` 是 `(event, value)`）；`onChange` 是 `(targetValue, value, event)` 第一参为新值。没有 `type` / `format` / `isCharacterAllowed` / `suffix`；`maxLength` 会在右下角显示字数统计。官方 demo 没有 ref 命令式方法，不要假设有 `validate()`。

## 1. 功能定位

TextArea 是多行文本域：label、必填、字数限制与统计、自定义校验、可拉伸。表单里"描述 / 备注 / 原因 / 多行内容"一律用它。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 段落文本、备注、描述 | `TextArea` | antd `Input.TextArea` |
| 单行文本 / 密码 / 数字 | `TextField`（[TextField.md](TextField.md)） | — |
| 搜索关键字 | `SearchInput`（[SearchInput.md](SearchInput.md)） | — |

## 2. 事件与交互逻辑

### onChange —— `(targetValue, value, event)`，第一个参数是新值

```tsx
<TextArea
  label="描述"
  placeholder="请输入"
  rows={4}
  maxLength={200}                                  // 右下角显示 n/200，超长不能再输
  value={remark}
  onChange={(targetValue: string, value: string, event) => setRemark(targetValue)}
  onBlur={(event) => setRemark((v) => v.trim())}   // onBlur 只有 event；要值用 state
/>
```

### 必填 + 自定义校验

```tsx
<TextArea
  label="驳回原因"
  required                                          // 必填：label 前加 *
  rows={3}
  ruleText="10-200 字"
  hintType="tip"
  validator={(value: string) => ({
    result: value.length >= 10 && value.length <= 200,   // result: true 通过
    message: '原因需 10-200 字',
  })}
  value={reason}
  onChange={(v: string) => setReason(v)}
/>
```

## 3. 联动说明

- 字数达到 `maxLength` → 组件自动截断输入；业务侧不用再写长度判断，但提交前仍要 `trim()` 判空
- 与 TextField 同在一个表单：TextField 走 `ref.validate()`，TextArea 官方 demo 无 ref 方法 → 用 state 派生判断
- 拉伸：`inputStyle={{ resize: 'both' }}` 可拖拽放大，`{ resize: 'none' }` 锁定（只读展示长文本时用）

## 4. 反面示例

```tsx
// ❌ 把 event 当第一个参数
<TextArea onChange={(e) => setRemark(e.target.value)} />

// ❌ antd 习惯：没有 showCount / autoSize / allowClear，字数统计靠 maxLength 自带
<TextArea showCount autoSize={{ minRows: 2 }} allowClear />

// ❌ 借用 TextField 的属性：TextArea 没有 isCharacterAllowed / format / suffix / type
<TextArea format="number" suffix="字" />

// ❌ 假设有 ref.validate()（官方 demo 没有），运行时报 undefined
textAreaRef.current.validate();

// ❌ onBlur 想拿第二个参数取值（那是 TextField 的签名，TextArea 只有 event）
<TextArea onBlur={(event, value) => save(value)} />

// ❌ 只写 value 不写 onChange，用户输入不进 state
<TextArea value={remark} />
```

## 5. API 速查

> 压缩自 `TextArea/TextArea`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `label` / `placeholder` | `string` | 名称 / 占位 |
| `labelPosition` | `'before' \| 'after'`，默认 `before` | label 位置 |
| `value` | `string` | 受控值 |
| `onChange` | `(targetValue, value, event) => void` | **第一个参数是新值** |
| `onBlur` / `onFocus` / `onKeyDown` / `onKeyUp` / `onClick` | `(event) => void` | 只有 event |
| `rows` / `cols` | `number` | 显示行 / 列数 |
| `maxLength` | `number` | 最大长度，右下角显示字数统计 |
| `maxLengthCut` / `maxLengthByte` / `encodingType` | `boolean` / `boolean` / `'default' \| 'utf-8'` | 超长截取 / 按字节计 / 编码 |
| `required` | `boolean`，默认 `false` | 必填标记 |
| `validator` | `(value) => { result, message, type? }` | 自定义校验，`result: true` 通过 |
| `validateWhileEmpty` | `boolean` | 空值也校验 |
| `hintType` | `'div' \| 'tip'`，默认 `div` | 提示形式 |
| `ruleText` | `string` | 右侧常驻规则提示 |
| `focusTip` | `ReactNode` | 聚焦时提示 |
| `disabled` / `readOnly` | `boolean`，默认 `false` | 灰化 / 只读 |
| `inputStyle` / `inputClassName` | `CSSProperties` / `string` | textarea 样式，如 `{ resize: 'both' }` |
| `labelStyle` / `labelClassName` / `style` / `className` / `id` | — | 常规透传 |
| `sizeAuto` | `boolean` | 表内无说明 |
