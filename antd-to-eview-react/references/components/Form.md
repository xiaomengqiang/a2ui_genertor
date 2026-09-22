# Form 组件功能逻辑规格（含 Form.Item）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Form/Form`、`Form/FormItem`；官网组件页 Form 及示例 `FormPro.jsx` / `FormEvent.jsx` / `FormFunction.jsx` / `FormVertical.jsx` / `FormItem.jsx` / `FormRule.jsx` / `FormWCAG.jsx`；工程配置文档 project-setting（`Form.Item` 不要提取为变量）
>
> ⚠️ 官网 README 明确："表单 2.0 能力发布，推荐使用；传统用法 1.0 不推荐"。**2.0 = `Form.Item name + rules` 托管值与校验**；`FormDemo.jsx` 是 1.0 写法（控件自己带 `name` / `value`），不要参考。
> ⚠️ 提交按钮不是 `type="submit"`（Button 没有 type），而是 `onClick={() => formRef.current.submit()}`；校验通过走 `onSuccess(values)`，失败走 `onFailed(errorFields, values)`。
> ⚠️ 官方 demo 原话："尽量不要使用 TextField 等组件自己的赋值方法，请使用 Form 的 `setFieldsValue` 等方法"。
>
> ✅ **运行时已验证（内网真机，2026-09）**：2.0 托管模式（`Form.Item name` + 控件不传 `value`/`onChange` + `ref.submit()` → `onSuccess(values)`）在真实工程里**能收到 `values`**（含所有 `name` 字段）；`setFieldsValue` / `resetFields` / `submit` / `getFieldsValue` 均可用。先前 `TODO.md`「待实测」对应项 hereby 关闭。
> ⚠️ **硬坑**：`initialValues` **必须传对象，不能是 `undefined`**。真机观察到传 `undefined` 时 `submit()` 仍触发 `onSuccess` 但 `values` 是空对象（"托管没生效"的表现；机制未深究但可复现，传具体对象则 `values` 正常）。动态/异步场景务必 `initialValues={x || {}}`。
> ⚠️ 控件自带 `validator`（如 TextField/TextArea 的 `validator`）默认**不在 `submit()` 时执行**，需 Form 上加 `validateAllChildComponent={true}`；Form rules（`required`/`email`/`range` 等）则在 `submit()` 时正常跑（已验证）。`onFailed` 真机示例只取第一参 `errors`，第二参 `values` 是否提供待实测。
> ⚠️ `Form.Item` 必须是 `Form` 的**直接子节点**，不能套在 `div` / flex / CSS grid 里模拟 antd 的 `Row/Col`，条件显隐也不能用 Fragment 包一组（栅格同样失效，实测）：标签（渲染后的 `ev_label`）宽度与栅格都由 Form 按直接子级 `Form.Item` 计算，隔一层 DOM 标签宽度即塌缩、只显示一小截。多列在 `Form` 上设 `itemCol={8}` 等，单项覆盖用 `Form.Item.col`；说明文案用 `labelTip` 或放在 `Form.Item` 之间，不要连同 `Form.Item` 一起包进装饰性容器。

## 1. 功能定位

Form 是表单容器：按 `Form.Item` 的 `name` 收集值、按 `rules` 统一校验、提供 `submit / resetFields / setFieldsValue / getFieldsValue` 等命令式方法，并负责水平 / 垂直 / 多列布局。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 3 个以上字段、要统一校验与重置 | `Form` + `Form.Item` | 每个控件各自 `useState` + `ref.validate()` |
| 1-2 个字段的轻交互（搜索条、内联编辑） | 控件受控写法（各组件 Reference） | Form |
| 分步表单 | 每步一个 `Form`，或一个 Form + 条件渲染 Item（[Steps.md](Steps.md)） | — |
| 弹窗里的表单 | `Dialog` 内放 `Form`，确定按钮调 `submit()`（[Dialog.md](Dialog.md)） | — |

## 2. 典型场景

- 新建 / 编辑资源：`initialValues` 回填 → 逐项 `rules` → `onSuccess` 提交
- 登录 / 注册：必填 + 邮箱 / 长度规则，提交按钮防重复
- 多列表单：`Form` 上设 `itemCol`（两列 12 / 三列 8 / 四列 6）+ `labelCol` 控制标签宽；禁止 div 栅格包裹 `Form.Item`
- 动态表单：用 `setFieldsValue` 联动改值，`onValuesChange` 监听字段变化显隐区块

## 3. 状态声明

```tsx
// Form 托管字段值，业务不再为每个字段 useState
const formRef = useRef<any>(null);

// 只留"表单外"的状态：提交中、服务端结果、需要联动显隐的开关
const [submitting, setSubmitting] = useState<boolean>(false);
const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

// 初始值按 name 组织（只在初始化 / resetFields 时生效）
const initialValues: ResourceForm = { name: '', region: null, port: '', agree: false };
```

## 4. 事件与交互逻辑

### 基本骨架：Form.Item name + rules，按钮调 ref.submit()

```tsx
<Form
  ref={formRef}
  initialValues={initialValues}
  layout="horizontal"
  labelCol={6}
  validateErrorType="tip"
  onSuccess={(values: ResourceForm) => save(values)}                 // 全部规则通过
  onFailed={(errorFields, values) => setMessage('请修正标红字段')}     // 有规则失败
  onValuesChange={(changed, allNew, allPrev) => { /* 字段变化联动 */ }}
>
  <Form.Item label="名称" name="name" rules={[{ required: true }]}>
    <TextField placeholder="请输入" maxLength={32} />  {/* 不传 value / onChange，Form 托管；长度限制用控件自己的 maxLength */}
  </Form.Item>
  <Form.Item label="邮箱" name="email" rules={[{ required: true }, { email: true }]}>
    <TextField />
  </Form.Item>
  <Form.Item label="端口" name="port" rules={[{ range: true, args: [1, 65535] }]}>
    <TextField format="number" />
  </Form.Item>
  <Form.Item label="区域" name="region" rules={[{ required: true }]}>
    <Select options={regionOptions} defaultLabel="-请选择-" />
  </Form.Item>
  <Form.Item colon={false}>
    <Button status="primary" text="提交" onClick={() => formRef.current.submit()} />
    <Button text="重置" onClick={() => formRef.current.resetFields()} />
  </Form.Item>
</Form>
```

### 多列布局：itemCol 设在 Form 上，Form.Item 保持直接子级

```tsx
<Form ref={formRef} itemCol={8} labelCol={6}>          {/* 三列；两列 12、四列 6 */}
  <Form.Item label="名称" name="name"><TextField /></Form.Item>
  <Form.Item label="区域" name="region"><Select options={regionOptions} /></Form.Item>
  <Form.Item label="协议" name="protocol"><Select options={protocolOptions} /></Form.Item>
  <Form.Item label="端口" name="port"><TextField format="number" /></Form.Item>
  <Form.Item col={24} label="备注" name="remark"><TextArea /></Form.Item>  {/* 单项整行 */}
</Form>

{/* 分组标题、说明文案等装饰内容：放在 Form.Item 之间、或用 labelTip / Form 的 title，不要把 Form.Item 包进 div */}
```

### 条件显隐的 Form.Item：逐项三元或数组，不要用 Fragment 包一组

`itemCol` / `labelCol` 只注入到**直接子级** `Form.Item`；`{cond ? (<>…</>) : null}` 里 Fragment 包住的整组 Form.Item 会脱离直接子级，栅格不生效（实测）。两种写法：

```tsx
{/* 写法一：逐项三元 */}
{cond ? (
  <Form.Item label="端口" name="port"><TextField /></Form.Item>
) : null}

{/* 写法二：整组放数组（代码更聚合，实测可行）：React.Children 遍历子级时会展开数组，
   数组内 Form.Item 仍是直接子级，itemCol 正常注入 */}
const detailItems = [
  <Form.Item key="port" label="端口" name="port"><TextField /></Form.Item>,
  <Form.Item key="remark" label="备注" name="remark" col={24}><TextArea /></Form.Item>,
];
{cond ? detailItems : null}
```

装饰性节点（分组标题等）同样逐项三元，不影响其他 Form.Item 的栅格。

### 非 value/onChange 型控件：valuePropName + updateTrigger (+ updateTriggerIndex)

```tsx
{/* Checkbox：值在 checked，且 onChange(value, checked) 的第 2 个参数才是值 */}
<Form.Item name="agree" valuePropName="checked" updateTriggerIndex={1}>
  <Checkbox label="我已阅读并同意协议" />
</Form.Item>

{/* Toggle：值在 toggled，回调叫 onToggle */}
<Form.Item label="启用" name="enabled" valuePropName="toggled" updateTrigger="onToggle">
  <Toggle data={[false, true]} />
</Form.Item>

{/* RadioGroup / MultipleSelect / DatePicker：默认 value + onChange 即可 */}
<Form.Item label="协议" name="protocol" rules={[{ required: true }]}>
  <RadioGroup data={protocolData} />
</Form.Item>
```

### 命令式方法（demo FormFunction.jsx）

```tsx
formRef.current.submit();                      // 触发全量校验 → onSuccess / onFailed
formRef.current.resetFields();                 // 回到 initialValues
formRef.current.setFieldsValue({ name: 'x' }); // 程序化改值（回填 / 联动），不要去改控件自己的 value
formRef.current.getFieldsValue();              // 当前全部值
formRef.current.getFieldValue('name');
formRef.current.getErrors();                   // 当前错误
```

### 内置规则（demo FormRule.jsx 出现过的）

`required` · `min` / `max` / `range` / `rangeAndInteger`（配 `args`）· `digit` · `integer` · `url` · `email` · `alpha` · `postfix`（`args: ['后缀']`）· `ipv4` · `ipv6` · `creditCard`；写法 `rules={[{ required: true }, { range: true, args: [5, 15] }]}`。控件自己的 `validator` 仍可叠加使用（FormPro.jsx）。

## 5. 数据结构

```tsx
// 表单值模型 = initialValues 的形状 = onSuccess(values) 的形状，key 与 Form.Item.name 一致
interface ResourceForm {
  name: string;
  email: string;
  port: string;              // TextField 给的是字符串，提交前自行 Number()
  region: string | null;
  protocol: string;
  agree: boolean;
  enabled: boolean;
}

// rules 单项：{ 规则名: true, args?: any[] }
type FormRule = { required?: true; email?: true; range?: true; postfix?: true; args?: any[]; [k: string]: any };
```

## 6. 联动说明

- `onValuesChange(changed, allNew)` 里读 `changed` 判断哪个字段动了 → 条件渲染其他 `Form.Item`（被隐藏字段的值提交前用 `getFieldsValue()` 过滤）
- 父级 Select 变化 → `setFieldsValue({ child: null })` 清子级，再换子级 `options`
- 编辑页：数据加载完成后 `setFieldsValue(record)`（`initialValues` 只在初始化生效，异步数据要用方法回填）
- 提交：`submit()` → `onSuccess` 里 `setSubmitting(true)` → 请求 → `finally` 复位；按钮 `disabled={submitting}`
- 服务端字段级错误：目前资料未提供"设置单字段错误"的 API，用页面级提示（[MessageDialog.md](MessageDialog.md) 或文案区）

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import Checkbox from '@nce/eview-react/Checkbox';
import Toggle from '@nce/eview-react/Toggle';
import Button from '@nce/eview-react/Button';

interface ResourceForm {
  name: string;
  email: string;
  port: string;
  region: string | null;
  agree: boolean;
  enabled: boolean;
}

const INITIAL: ResourceForm = { name: '', email: '', port: '', region: null, agree: false, enabled: true };
const REGION_OPTIONS = [
  { text: '华东', value: 'east' },
  { text: '华南', value: 'south' },
];

// 新建资源表单：Form 托管值与校验，提交防重复，编辑态回填，启用开关联动端口必填
export default function ResourceFormPage({ record }: { record?: ResourceForm }) {
  const formRef = useRef<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
  const [message, setMessage] = useState<string>('');

  // 编辑态：异步数据到达后用方法回填（initialValues 只在初始化生效）
  React.useEffect(() => {
    if (record) {
      formRef.current?.setFieldsValue(record);
      setEnabled(record.enabled);
    }
  }, [record]);

  const handleSuccess = async (values: ResourceForm) => {
    if (submitting) return;
    setSubmitting(true);
    setMessage('');
    try {
      // 真实项目替换为已有 Service；端口转数字
      await new Promise((resolve) => setTimeout(resolve, 400));
      setMessage(`已保存：${values.name} / ${values.region} / 端口 ${Number(values.port) || '-'}`);
    } catch (e) {
      setMessage('保存失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: 640, padding: 24 }}>
      <Form
        ref={formRef}
        initialValues={INITIAL}
        layout="horizontal"
        labelCol={6}
        validateErrorType="tip"
        onSuccess={handleSuccess}
        onFailed={() => setMessage('请修正标红字段')}
        onValuesChange={(changed: Partial<ResourceForm>) => {
          if ('enabled' in changed) setEnabled(!!changed.enabled);   // 开关联动
        }}
      >
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <TextField placeholder="请输入名称" maxLength={32} />
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[{ required: true }, { email: true }]}>
          <TextField placeholder="name@example.com" />
        </Form.Item>
        <Form.Item label="区域" name="region" rules={[{ required: true }]}>
          <Select options={REGION_OPTIONS} defaultLabel="-请选择-" />
        </Form.Item>
        <Form.Item label="启用" name="enabled" valuePropName="toggled" updateTrigger="onToggle">
          <Toggle data={[false, true]} />
        </Form.Item>
        <Form.Item label="端口" name="port" rules={enabled ? [{ required: true }, { range: true, args: [1, 65535] }] : []}>
          <TextField format="number" placeholder="1-65535" disabled={!enabled} />
        </Form.Item>
        <Form.Item name="agree" valuePropName="checked" updateTriggerIndex={1} rules={[{ required: true }]}>
          <Checkbox label="我已阅读并同意服务协议" />
        </Form.Item>
        <Form.Item colon={false}>
          <Button status="primary" text={submitting ? '保存中...' : '保存'} disabled={submitting} onClick={() => formRef.current.submit()} />
          <Button text="重置" disabled={submitting} onClick={() => { formRef.current.resetFields(); setEnabled(INITIAL.enabled); setMessage(''); }} style={{ marginLeft: 12 }} />
        </Form.Item>
      </Form>
      {message ? <div style={{ marginTop: 8 }}>{message}</div> : null}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 Form.useForm / form 属性 / onFinish / name 数组路径 / Form.List
const [form] = Form.useForm();
<Form form={form} onFinish={save}><Form.Item name={['a', 'b']} /></Form>

// ❌ 提取 Form.Item 为变量（project-setting.md 明确不推荐）
const FormItem = Form.Item;

// ❌ div / CSS grid 模拟 antd Row/Col 包裹 Form.Item：不是直接子级，ev_label 宽度塌缩只显示一小截，itemCol 栅格也不生效
<Form>
  <div className="form-row">
    <div className="form-col">
      <Form.Item label="名称" name="name"><TextField /></Form.Item>
    </div>
  </div>
</Form>
// ✅ Form.Item 直接子级，多列在 Form 上设 itemCol
<Form itemCol={8}>...</Form>

// ❌ 条件显隐用 Fragment 包一组：整组脱离直接子级，itemCol 栅格失效（实测）
{cond ? (
  <>
    <Form.Item label="端口" name="port"><TextField /></Form.Item>
    <Form.Item label="备注" name="remark"><TextArea /></Form.Item>
  </>
) : null}
// ✅ 逐项三元
{cond ? <Form.Item label="端口" name="port"><TextField /></Form.Item> : null}

// ❌ 1.0 写法：控件自己带 name / value / onChange，绕开 Form 托管
<Form><TextField name="username" value={u} onChange={setU} /></Form>

// ❌ Checkbox / Toggle 不配 valuePropName / updateTrigger，Form 拿到的是 event 或 undefined
<Form.Item name="agree"><Checkbox /></Form.Item>
<Form.Item name="enabled"><Toggle /></Form.Item>

// ❌ 提交按钮想靠 type="submit"（Button 没有 type），或直接调业务 save 跳过校验
<Button type="submit" text="提交" />
<Button text="提交" onClick={() => save(formRef.current.getFieldsValue())} />

// ❌ 异步回填用 initialValues（只在初始化生效），应用 setFieldsValue
<Form initialValues={recordFromApi} />

// ❌ 规则写成 antd 形式
rules={[{ required: true, message: '必填' }, { type: 'email' }]}
```

## 9. API 速查

> 压缩自 `Form/Form`、`Form/FormItem`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `initialValues` | `object` | 按 `name` 初始化，仅初始化与 `resetFields` 时生效；**必须传对象，`undefined` 会让 `onSuccess(values)` 收到空对象（已真机确认）** |
| `onSuccess` | `(values) => void` | 提交且校验全部通过 |
| `onFailed` | `(errors, values?) => void` | 提交且校验失败；真机示例只取第一参 `errors`，第二参 `values` 待实测 |
| `onValuesChange` | `(changedFields, allNewValues, allPrevValues) => void` | 字段更新 |
| `layout` | `'horizontal' \| 'vertical'`，默认 `horizontal` | 不支持 inline |
| `itemCol` | `24 \| 12 \| 8 \| 6`，默认 `24` | 多列表单，每项占栅格；只作用于**直接子级** `Form.Item` |
| `labelCol` / `wrapperCol` | `number \| { span, offset }` | 仅水平布局；`labelCol + wrapperCol <= 24` |
| `labelAlign` / `colon` | `'left' \| 'right'`（默认 right）/ `boolean`（默认 true） | 标签对齐 / 冒号 |
| `validateTrigger` / `updateTrigger` | `string`，默认 `onChange` | 校验 / 取值的回调名 |
| `validateErrorType` | `'div' \| 'tip' \| 'none'` | 错误提示形式 |
| `validateAllChildComponent` | `boolean`，默认 `false` | 是否同时执行子控件自带校验；**控件 `validator` 要在 `submit()` 时跑必须设 `true`**（待实测确认，但官方 API 表语义如此） |
| `component` | `any`，默认 `form` | 渲染的 HTML 元素；`false` 不创建 DOM |
| `itemFillUp` / `padding` / `title` / `fields` | — | 垂直布局占满 / 内边距 / 标题 / 外部状态管理（不推荐） |
| `Form.Item.name` | `string`，**必填** | 字段名 |
| `Form.Item.label` / `labelTip` | `string` | 标签 / 标签提示 |
| `Form.Item.rules` | `Array<{ 规则名: true, args? }>` | `required` `min` `max` `range` `rangeAndInteger` `digit` `integer` `url` `email` `alpha` `postfix` `ipv4` `ipv6` `creditCard` |
| `Form.Item.valuePropName` | `string` | 控件值属性名（Checkbox `checked`、Toggle `toggled`） |
| `Form.Item.updateTrigger` / `updateTriggerIndex` | `string` / `number` | 取值回调名（Toggle `onToggle`）/ 值在回调第几个参数（Checkbox 为 1） |
| `Form.Item.col` / `colon` / `layout` / `labelCol` / `wrapperCol` / `validateErrorType` | — | 单项覆盖 Form 的布局与提示设置 |
| `ref.submit()` / `resetFields()` / `setFieldsValue(obj)` / `getFieldsValue()` / `getFieldValue(name)` / `getErrors()` | 命令式方法 | demo FormFunction.jsx |
