# TextArea 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `TextArea/TextArea`；官网组件页 TextArea 及示例 `TextAreaExample.jsx` / `TextAreaEvent.jsx` / `TextAreaLimitExample.jsx` / `ValidateExample.jsx` / `TextAreaResizeExample.jsx` / `TextAreaDisabledExample.jsx`
>
> ⚠️ 与 TextField 的差别：`onBlur` / `onFocus` 只给 `event`（TextField 的 `onBlur` 是 `(event, value)`）；没有 `type` / `format` / `isCharacterAllowed` / `suffix`；`maxLength` 会在右下角显示字数统计。官方 demo 没有 ref 命令式方法，不要假设有 `validate()`。

## 1. 功能定位

TextArea 是多行文本域：label、必填、字数限制与统计、自定义校验、可拉伸。表单里"描述 / 备注 / 原因 / 多行内容"一律用它。

| 想要的效果 | 用什么 |
|-----------|--------|
| 段落文本、备注、描述 | `TextArea` |
| 单行文本 / 密码 / 数字 | `TextField`（[TextField.md](TextField.md)） |
| 搜索关键字 | `SearchInput`（[SearchInput.md](SearchInput.md)） |

## 2. 典型场景

- 新建资源表单的"描述"字段：`maxLength={200}` 显示字数，`rows={4}`
- 审批 / 驳回原因：`required` + 自定义 `validator` 限制长度或敏感词
- 只读展示长文本：`readOnly` + `inputStyle={{ resize: 'none' }}`
- 用户可拖拽放大的编辑区：`inputStyle={{ resize: 'both' }}`（demo TextAreaResizeExample.jsx）

## 3. 状态声明

```tsx
// 受控写法（demo TextAreaEvent.jsx）：value + onChange，第一个参数是新值
const [remark, setRemark] = useState<string>('');

// 派生：是否超限 / 是否为空，用于提交按钮
const isRemarkValid = remark.trim().length > 0 && remark.length <= 200;
```

## 4. 事件与交互逻辑

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

### 必填 + 自定义校验（demo ValidateExample.jsx）

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

### 在 Form.Item 内

```tsx
<Form.Item label="描述" name="description" rules={[{ required: true }]}>
  <TextArea rows={4} maxLength={200} />     {/* 不传 value / onChange，Form 按 name 托管 */}
</Form.Item>
```

## 5. 数据结构

```tsx
// 自定义 validator 返回结构（字段名固定）
interface ValidateResult {
  result: boolean;                 // true = 通过
  message: string | JSX.Element;
  type?: string;
}

// 表单值模型里的多行字段
interface TicketForm {
  title: string;        // TextField
  description: string;  // TextArea
}
```

## 6. 联动说明

- `required` 的 TextArea 为空 → 提交按钮 `disabled`；有 `validator` 时以校验结果为准
- 字数达到 `maxLength` → 组件自动截断输入；业务侧不用再写长度判断，但提交前仍要 `trim()` 判空
- 与 TextField 同在一个表单：TextField 走 `ref.validate()`，TextArea 官方 demo 无 ref 方法 → 用 state 派生判断（或整体放进 Form 由 Form 统一校验）
- 选择不同"类型"（Select / RadioGroup）→ 切换 TextArea 的 `placeholder` / `ruleText`

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import TextArea from '@nce/eview-react/TextArea';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

interface TicketForm {
  title: string;
  description: string;
}

// 工单提交：标题（单行）+ 描述（多行，10-500 字）+ 提交前判空与防重复
export default function TicketForm() {
  const [form, setForm] = useState<TicketForm>({ title: '', description: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');

  const descLen = form.description.trim().length;
  const canSubmit = form.title.trim() !== '' && descLen >= 10 && descLen <= 500 && !submitting;

  const validateDesc = (value: string) => ({
    result: value.trim().length >= 10,
    message: '描述至少 10 个字',
  });

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setResult('');
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 400));
      setResult(`已提交：${form.title}`);
      setForm({ title: '', description: '' });
    } catch (e) {
      setResult('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: 520, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TextField
        label="标题"
        required
        maxLength={64}
        value={form.title}
        onChange={(value: string) => setForm((prev) => ({ ...prev, title: value }))}
      />
      <TextArea
        label="描述"
        required
        rows={5}
        maxLength={500}
        ruleText="10-500 字"
        hintType="tip"
        validator={validateDesc}
        placeholder="请描述问题现象、复现步骤"
        value={form.description}
        onChange={(targetValue: string) => setForm((prev) => ({ ...prev, description: targetValue }))}
      />
      {result ? <div>{result}</div> : null}
      <div>
        <Button status="primary" text={submitting ? '提交中...' : '提交工单'} disabled={!canSubmit} onClick={handleSubmit} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `api/TextArea_TextArea.md`。

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
