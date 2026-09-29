# Form 迁移模式（antd → eview-react）

> antd Form 和 eview-react Form 都用 `Form.Item name` 托管值，但**校验触发与回调机制完全不同**。
> 这是迁移中最大的模式差异，本文给出三种常见场景的完整转换示例。
>
> 📁 **完整综合案例**：[form-case.jsx](form-case.jsx) — 真机工程片段，演示 `Form.Item.col` 单项覆盖 Form 级 `itemCol`、`inputStyle`/`selectStyle` 控控件本体宽度、`SelectCard` 在 Form 内的用法、`validateAllChildComponent`。作为本文各场景的综合参考。

> ✅ **运行时已验证（内网真机示例）**：`Form.Item name` + 控件不传 `value`/`onChange` + `ref.submit()` → `onSuccess(values)` 这套托管模式在真实 `@nce/eview-react` 工程里**确实能收到 `values`**（含所有 `name` 字段）。先前 `eview-react/TODO.md` 把它列为「待实测」，现已确认成立。
>
> ⚠️ **但有硬坑**：`initialValues` **必须是对象，不能传 `undefined`**。真机观察到：传 `undefined` 时 `submit()` 仍触发 `onSuccess`，但 `values` 是空对象——表现就是"托管没生效、确认页没数据"（机制未深究，但可复现；而传具体对象的案例 `values` 正常）。向导多步场景里 `allValues.basic` 首次必然是 `undefined`，**必须写 `initialValues={allValues.basic || {}}`**。
>
> 真机示例（Form 一直挂载、`initialValues` 传具体对象）：
> ```jsx
> const initialValues = { username: 'default_username', password: '1234', email: '12@' };
> const form = React.createRef();                       // 官方示例用 createRef；useRef(null) 等价且更规范
> <Form ref={form} initialValues={initialValues} onSuccess={v => setValues(v)} onFailed={errors => setErrors(errors)} validateErrorType="tip">
>   <Form.Item label="User Name" name="username" rules={[{ required: true }]}><TextField /></Form.Item>
>   <Form.Item name="address" label="The Internet"><Checkbox label="The Internet" /></Form.Item>
>   {/* 提交：<Button onClick={() => form.current.submit()} />；setFieldsValue / resetFields 均可用 */}
> </Form>
> ```
> 注意：真机示例里 Checkbox 的 Form.Item **没加** `valuePropName="checked" updateTriggerIndex={1}` 也能 `submit`，但这样 `values.address` 收到的是 Checkbox 的 `value` 不是 `checked` 布尔；要拿干净布尔值仍按下方表加这两项。
>
> 排查提示：真机示例**未用** `itemCol` / `layout`（默认单列）。若你的 Form 出现"托管没生效"且已确认 `initialValues` 是对象，下一步排查 `itemCol`（多列模式对值收集的影响未实测）——先去掉 `itemCol` 看是否恢复，再决定是否保留多列。

## 核心差异

| 维度 | antd | eview-react |
|------|------|-------------|
| 获取实例 | `const [form] = Form.useForm()` | `const formRef = useRef(null)` |
| 传给 Form | `<Form form={form}>` | `<Form ref={formRef}>` |
| 触发校验 | `await form.validateFields()` → Promise | `formRef.current.submit()` → `onSuccess(values)` 回调 |
| 校验通过 | `.then(values => ...)` | `onSuccess={(values) => ...}` |
| 校验失败 | `.catch()` / reject | `onFailed(errors)` 回调（真机示例只取一参 `errors`；如需 values 取第二参待实测） |
| 重置 | `form.resetFields()` | `formRef.current.resetFields()` |
| 回填 | `form.setFieldsValue(record)` | `formRef.current.setFieldsValue(record)` |
| 取全部值 | `form.getFieldsValue()` | `formRef.current.getFieldsValue()` |
| 提交按钮 | `htmlType="submit"` 或 `onClick` | `onClick={() => formRef.current.submit()}` |
| rules message | `rules=[{required:true, message:'必填'}]` | `rules=[{required:true}]`（无 message 字段） |
| Toggle in Form.Item | `valuePropName="checked"` | `valuePropName="toggled" updateTrigger="onToggle"` |
| Checkbox in Form.Item | `valuePropName="checked"` | `valuePropName="checked" updateTriggerIndex={1}` |
| 错误提示 | Form.Item `extra` / `help` | `validateErrorType="tip"` 或 `"div"`（默认）；无 `extra` |
| 控件不传 value/onChange | 相同 | 相同（Form 按 name 托管） |
| `initialValues` 异步 | 配合 `preserve={false}` | 只在初始化生效；异步数据用 `setFieldsValue`；**必须传对象，`undefined` 会让 `onSuccess(values)` 收到空对象** |

## 内置规则对照

| antd | eview-react | 说明 |
|------|-------------|------|
| `{ required: true, message: '必填' }` | `{ required: true }` | 删 message |
| `{ min: 3 }` / `{ max: 32 }` | `{ min: true, args: [3] }` / `{ max: true, args: [32] }` | 写法不同 |
| `{ range: [1, 65535] }` (InputNumber) | `{ range: true, args: [1, 65535] }` | eview-react Form rules |
| `{ type: 'email' }` | `{ email: true }` | |
| `{ pattern: /regex/ }` | 用控件自带 `validator` + Form 上加 `validateAllChildComponent={true}` | Form rules 无 pattern；控件 `validator` 默认不在 `submit()` 时跑，需开 `validateAllChildComponent` 才生效（待实测）；或提交前用 `ref.validate()` 先校验 |
| `{ type: 'url' }` | `{ url: true }` | |
| 自定义 `validator: (rule, value) => ...` | 控件 `validator: (value) => ({result, message})` + `validateAllChildComponent={true}` | 返回结构不同；同样需开 `validateAllChildComponent` 才在 `submit()` 时跑 |

## 场景一：表单提交页

### antd 原始

```tsx
const [form] = Form.useForm();
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async () => {
    try {
        const values = await form.validateFields();
        setSubmitting(true);
        await api.save(values);
    } catch { /* 校验失败 */ }
    finally { setSubmitting(false); }
};

<Form form={form} layout="vertical" onFinish={handleSubmit}>
    <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入' }]}>
        <Input />
    </Form.Item>
    <Form.Item name="enabled" label="启用" valuePropName="checked">
        <Switch />
    </Form.Item>
    <Button type="primary" htmlType="submit" loading={submitting}>保存</Button>
</Form>
```

### eview-react 转换后

```tsx
const formRef = useRef(null);
const [submitting, setSubmitting] = useState(false);

const handleSuccess = async (values) => {           // 回调代替 Promise
    if (submitting) return;
    setSubmitting(true);
    try { await api.save(values); }
    finally { setSubmitting(false); }
};

<Form
    ref={formRef}
    layout="vertical"
    validateErrorType="tip"
    onSuccess={handleSuccess}                       // 校验通过走这里
    onFailed={() => { /* 校验失败，停在本页 */ }}
>
    <Form.Item name="name" label="名称" rules={[{ required: true }]}>
        <TextField placeholder="请输入" maxLength={32} />
    </Form.Item>
    <Form.Item
        name="enabled"
        label="启用"
        valuePropName="toggled"                      // Switch → Toggle
        updateTrigger="onToggle"
    >
        <Toggle data={[false, true]} />
    </Form.Item>
    <Form.Item colon={false}>
        <Button
            status="primary"
            text={submitting ? '保存中...' : '保存'}
            disabled={submitting}
            onClick={() => formRef.current.submit()}  // 触发校验
        />
    </Form.Item>
</Form>
```

## 场景二：多步向导（Steps + Form）

### antd 原始：Promise 链

```tsx
const [basicForm] = Form.useForm();
const [networkForm] = Form.useForm();
const [current, setCurrent] = useState(0);
const [allValues, setAllValues] = useState({});

const handleNext = async () => {
    const form = [basicForm, networkForm, null][current];
    if (form) {
        try {
            const values = await form.validateFields();   // Promise
            setAllValues(prev => ({ ...prev, [stepKeys[current]]: values }));
        } catch { return; }
    }
    if (isLast) setSubmitted(true);
    else setCurrent(c => c + 1);
};

<Steps current={current} items={stepItems} />
{current === 0 && <BasicInfoForm form={basicForm} />}
{current === 1 && <NetworkForm form={networkForm} />}
```

### eview-react 转换后：回调链

```tsx
const basicFormRef = useRef(null);
const networkFormRef = useRef(null);
const [current, setCurrent] = useState(0);
const [allValues, setAllValues] = useState({});
const stepData = [                                  // 提取具名常量，currentStep 与 data 共用
    { text: '基础信息', value: 'basic' },
    { text: '网络配置', value: 'network' },
    { text: '确认提交', value: 'confirm' },
];

// 每步的 onSuccess 回调：存值 + 推进
const handleBasicSuccess = (values) => {
    setAllValues(prev => ({ ...prev, basic: values }));
    setCurrent(c => c + 1);
};
const handleNetworkSuccess = (values) => {
    setAllValues(prev => ({ ...prev, network: values }));
    setCurrent(c => c + 1);
};

// 下一步：调用当前步 Form 的 submit（触发校验 → onSuccess 推进）
const handleNext = () => {
    if (current === 0) basicFormRef.current?.submit();
    else if (current === 1) networkFormRef.current?.submit();
    else setSubmitted(true);          // 确认页直接提交
};

// Steps：currentStep 对应 data[].value（不是下标）
<Steps
    data={stepData}
    currentStep={stepData[current].value}
/>
{current === 0 && (
    <BasicInfoForm
        formRef={basicFormRef}                         // form prop → formRef
        initialValues={allValues.basic || {}}          // ⚠️ 必须 || {}：undefined 会让 onSuccess 收空值
        onSuccess={handleBasicSuccess}                // 传入回调
    />
)}
{current === 1 && (
    <NetworkForm
        formRef={networkFormRef}
        initialValues={allValues.network || {}}        // ⚠️ 同上
        onSuccess={handleNetworkSuccess}
    />
)}
```

### 子表单组件写法

```tsx
// BasicInfoForm.jsx
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';

export default function BasicInfoForm({ formRef, initialValues, onSuccess }) {
    return (
        <Form
            ref={formRef}
            initialValues={initialValues || {}}        // ⚠️ 必须 || {}：undefined 会让 onSuccess 收空值
            layout="vertical"
            itemCol={12}                                  // 所有项统一半宽
            validateErrorType="tip"
            onSuccess={onSuccess}
            onFailed={() => { /* 停在本步 */ }}
        >
            <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                <TextField placeholder="请输入" maxLength={32} />
            </Form.Item>
            <Form.Item label="类型" name="type" rules={[{ required: true }]}>
                <Select options={typeOptions} defaultLabel="-请选择-" enableClear />
            </Form.Item>
            <Form.Item label="站点" name="station" rules={[{ required: true }]}>
                <Select options={stationOptions} defaultLabel="-请选择-" enableClear />
            </Form.Item>
        </Form>
    );
}
```

## 场景三：弹窗 CRUD（Dialog + Form）

### antd 原始

```tsx
const [form] = Form.useForm();
const [open, setOpen] = useState(false);

const handleOk = async () => {
    try {
        const values = await form.validateFields();
        await api.save(values);
        setOpen(false);
        refresh();
    } catch {}
};

<Modal open={open} onOk={handleOk} onCancel={() => setOpen(false)}>
    <Form form={form} layout="vertical">
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
    </Form>
</Modal>
```

### eview-react 转换后

```tsx
const formRef = useRef(null);
const [isOpen, setIsOpen] = useState(false);
const [saving, setSaving] = useState(false);

const handleSuccess = async (values) => {
    if (saving) return;
    setSaving(true);
    try {
        await api.save(values);
        setIsOpen(false);                // 成功才关弹窗
        refresh();
    } catch { /* 失败保持弹窗打开 */ }
    finally { setSaving(false); }
};

<Dialog
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}     // 不会自动关闭，需自己置 false
    buttons={[
        { text: '取消', onClick: () => setIsOpen(false) },
        { text: saving ? '保存中...' : '保存', status: 'primary',
          onClick: () => formRef.current.submit() },
    ]}
>
    <Form
        ref={formRef}
        layout="vertical"
        validateErrorType="tip"
        onSuccess={handleSuccess}
    >
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <TextField placeholder="请输入" />
        </Form.Item>
    </Form>
</Dialog>
```

## 多列布局迁移

### eview-react Form 自带栅格系统

eview-react 的 Form 内置 24 栅格系统，`itemCol` 设 Form 级默认宽度、`Form.Item.col` 单项覆盖；**不需要也不能用 `<div>` 做栅格**。

| 属性 | 位置 | 作用 | 取值 |
|------|------|------|------|
| `itemCol` | `<Form>` | 所有 Form.Item 的栅格数（**Form 级默认值，可被 `Form.Item.col` 单项覆盖**） | `24`(全宽) / `12`(半宽) / `8`(三分之一) / `6`(四分之一)，默认 `24` |
| `labelCol` | `<Form>` | **仅在 `layout="horizontal"` 时生效**；将该项宽度分为 24 份，label 占其中的份数，剩余给输入框 | `number`，如 `labelCol={4}` → label 占 4/24（1/6），输入框占 20/24（5/6） |

**关键限制**：`itemCol` 是 Form 级属性，设置后作为所有 `Form.Item` 的**默认栅格数**；**单项可用 `Form.Item.col` 覆盖**（在同一 Form 内混用不同宽度，不必拆 Form）。

**layout 与栅格的关系**：
- `layout="vertical"`：label 在输入框上方，label 和输入框都占满 `itemCol` 的宽度；`labelCol` 不生效
- `layout="horizontal"`：`labelCol` 将该项宽度（由 `itemCol` 决定）均分为 24 份，label 占 `labelCol` 份，输入框占 `24 - labelCol` 份。例如 `itemCol={12} labelCol={4}`：该项占 12/24 行宽（半宽），其中 label 占 4/24（1/6），输入框占 20/24（5/6）

**硬约束**：
- `<Form>` 标签内不允许使用 `<div>` 进行栅格布局
- 多列布局优先用 Form 级的 `itemCol` 设默认宽度；**单项不同宽度用 `Form.Item.col` 覆盖**（不拆 Form、不用 div 包裹）

### antd 常见写法 → eview-react 转换

#### antd 方式一：div + CSS grid（源项目用的）

```jsx
// ❌ antd：用 div + CSS grid 包裹多个 Form.Item，部分全宽部分半宽
<Form layout="vertical">
  <Form.Item name="name" label="名称" rules={[{ required: true }]}>
    <Input />                                          {/* 全宽 */}
  </Form.Item>
  <div className="step-form-row">                     {/* CSS: grid-template-columns: 1fr 1fr */}
    <Form.Item name="type" label="类型" rules={[{ required: true }]}>
      <Select />                                       {/* 半宽 */}
    </Form.Item>
    <Form.Item name="station" label="站点" rules={[{ required: true }]}>
      <Select />                                       {/* 半宽 */}
    </Form.Item>
  </div>
</Form>
```

#### antd 方式二：Row + Col

```jsx
// ❌ antd：用 Row/Col 栅格包裹，每项可单独设 span
<Form layout="vertical">
  <Form.Item name="name" label="名称">                 {/* 全宽 */}
    <Input />
  </Form.Item>
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="type" label="类型">              {/* 半宽 */}
        <Select />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item name="station" label="站点">           {/* 半宽 */}
        <Select />
      </Form.Item>
    </Col>
  </Row>
</Form>
```

#### eview-react 转换后：itemCol

如果所有字段都用半宽（Form 级统一 `itemCol={12}`）：

```jsx
// ✅ eview-react：所有项统一半宽
<Form layout="vertical" itemCol={12}>
  <Form.Item name="name" label="名称" rules={[{ required: true }]}>
    <TextField placeholder="请输入" maxLength={32} />   {/* 12 = 半宽 */}
  </Form.Item>
  <Form.Item name="type" label="类型" rules={[{ required: true }]}>
    <Select options={typeOptions} defaultLabel="-请选择-" enableClear />
  </Form.Item>
  <Form.Item name="station" label="站点" rules={[{ required: true }]}>
    <Select options={stationOptions} defaultLabel="-请选择-" enableClear />
  </Form.Item>
</Form>
```

如果需要"名称"全宽、"类型"和"站点"半宽的混合布局，**用 `Form.Item.col` 单项覆盖 Form 的 `itemCol`，不要拆成两个 Form**（拆 Form 会让 `ref.submit()` / `onSuccess` 各自独立，无法统一校验和提交）：

```jsx
// ✅ eview-react：Form 设 itemCol={12}（默认半宽），名称项用 col={24} 单项整行
<Form layout="vertical" itemCol={12} ref={formRef} onSuccess={onSuccess}>
  <Form.Item name="name" label="名称" rules={[{ required: true }]} col={24}>
    <TextField placeholder="请输入" maxLength={32} />   {/* col={24} 覆盖默认，整行 */}
  </Form.Item>
  <Form.Item name="type" label="类型" rules={[{ required: true }]}>
    <Select options={typeOptions} defaultLabel="-请选择-" enableClear />   {/* 走 Form 级 itemCol=12，半宽 */}
  </Form.Item>
  <Form.Item name="station" label="站点" rules={[{ required: true }]}>
    <Select options={stationOptions} defaultLabel="-请选择-" enableClear />
  </Form.Item>
</Form>
```

也可以不设 Form 级 `itemCol`，每个 `Form.Item` 单独设 `col`（来自真机工程的写法）：

```jsx
// ✅ eview-react：不设 Form 级 itemCol，逐项 col 控制
<Form layout="vertical" ref={formRef} onSuccess={onSuccess} validateErrorType="div">
  <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]} col={24}>
    <TextField placeholder="如：华北风电场-03 逆变器 A12" maxLength={32} />
  </Form.Item>
  <Form.Item name="deviceType" label="设备类型" rules={[{ required: true }]} col={12}>
    <Select options={deviceTypeOptions} defaultLabel="请选择设备类型" enableClear />
  </Form.Item>
  <Form.Item name="station" label="所属站点" rules={[{ required: true }]} col={12}>
    <Select options={stationOptions} defaultLabel="请选择所属站点" enableClear />
  </Form.Item>
  <Form.Item name="protocol" label="接入协议" rules={[{ required: true }]}>
    <SelectCard data={protocolRadioData} />                {/* 不设 col 走默认 24，整行 */}
  </Form.Item>
  <Form.Item name="remark" label="备注">
    <TextArea placeholder="补充设备用途、投运时间等信息（选填）" rows={3} maxLength={200} />
  </Form.Item>
</Form>
```

> **不要拆成两个 Form 做混合宽度**：拆 Form 后 `ref.submit()` / `onSuccess` 各自独立触发，无法统一校验和提交。同一 Form 内用 `Form.Item.col` 单项覆盖即可。

### 水平布局的 labelCol

```jsx
// layout="horizontal" 时，labelCol 将该项宽度均分 24 份
<Form layout="horizontal" itemCol={12} labelCol={4}>
  <Form.Item name="name" label="名称">               {/* 项占 12/24 行宽(半宽)，其中 label 占 4/24(1/6)，输入框 20/24(5/6) */}
    <TextField />
  </Form.Item>
  <Form.Item name="type" label="类型">               {/* 同上 */}
    <Select options={typeOptions} defaultLabel="-请选择-" />
  </Form.Item>
</Form>
```

## 迁移要点总结

1. **`Form.useForm()` → `useRef(null)`**：删掉 useForm，改用 ref
2. **`form` prop → `ref` prop**：`<Form form={form}>` → `<Form ref={formRef}>`
3. **`validateFields()` Promise → `submit()` 回调**：推进逻辑从 `.then()` 移到 `onSuccess` 回调内
4. **`onFinish` → `onSuccess`**：函数签名一致 `(values) => void`
5. **`initialValues` 必须是对象**：向导多步等动态场景一律 `initialValues={x || {}}`；传 `undefined` 会让 `onSuccess(values)` 收到空对象（"托管没生效"的根因，已真机确认）
6. **`rules` 删 message**：eview-react rules 没有 message 字段
7. **Switch → Toggle**：加 `valuePropName="toggled" updateTrigger="onToggle"`
8. **Checkbox in Form.Item**：加 `valuePropName="checked" updateTriggerIndex={1}`（真机示例不加也能 submit，但 `values` 收到的是 Checkbox 的 `value` 不是 `checked`；要干净布尔值就加）
9. **控件 `validator` 提交校验**：Form rules（`required`/`email`/`range` 等）在 `submit()` 时正常跑；控件自带 `validator` 默认不跑，需 Form 上加 `validateAllChildComponent={true}`（待实测）
10. **`htmlType="submit"` → `onClick={() => formRef.current.submit()}`**
11. **`loading` → `disabled` + 文案切换**
12. **Modal → Dialog**：`open`→`isOpen`；`onOk`→`buttons[].onClick`；成功才关
13. **多列布局用 `itemCol` + `Form.Item.col`**：`itemCol` 设 Form 级默认宽度，**单项覆盖用 `Form.Item.col`**（不拆 Form）；Form 内不允许用 div 做栅格
