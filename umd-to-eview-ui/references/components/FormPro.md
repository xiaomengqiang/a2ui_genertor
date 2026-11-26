# FormPro 新表单

> 分类：数据录入


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Form` / `Form.Item` | `FormPro` / `FormItem` | **不要迁到 `Form`**——eview-ui `Form` 是原生 `<form>` 包装（action/method，无校验；**有 Pro 版，Form 不使用**）；`FormPro` 才有完整体系：`initialValues` 同名；`onFinish`→**`onSuccess(values)`**、`onFinishFailed`→**`onFailed(errors, values)`**；**Rule 是扁平字段**（`required/integer/float/email/url/alpha/ipv4/ipv6/creditCard/notEqualTo/min/max/minLength/maxLength/rangeLength/pattern/equalTo` + `custom: (value, name?) => Promise`）——**不是 antd 的 `{required, message, validator}` 数组形态**，message 走 `validateMessages`；FormInstance：`validateFields()`/`submit()`/`getFieldValue`/`setFieldsValue`/`resetFields`/`getErrors`/`getError`（经 `useForm` 或 ref）；`validateErrorType='div'/'tip'/'none'` |

## API
### type
```
type NamePath = string | number | Array<string | number>;

type ValidateError = string | React.ReactNode;

type ErrorEntity = {
    name: NamePath;
    errors: ValidateError[];
};

type ChangedFieldEntity = {
  name: NamePath;
  prevValue: any;
  newValue: any;
};

type BasicValidateMessage = string | React.ReactNode;

type ValidateMessage = BasicValidateMessage | ((name: string) => BasicValidateMessage)
```
### FormInstance
formInstance可以用来操作表单，包括获取表单字段值，更新表单，校验表单，提交表单等。在函数式组件中，可以通过useForm创建和使用FormInstance实例，在类组件中，则可以从Form组件的ref获取FormInstance实例

|方法名|类型|描述|
|---|---|---|
|getFieldValue|`(name: NamePath) => any`|获取一个字段的值|
|getFieldsValue|`(nameList?: NamePath[]) => object`|获取一组字段的值，如果不传nameList，则返回所有字段的值|
|setFieldsValue|`(values: object) => void`|更新表单字段的值|
|validateFields|`(nameList?: NamePath[]) => Promise<object>`|校验一组字段，如果nameList不传，则校验表单的所有字段。该方法返回一个Promise，如果检验的字段都没有错误，则Promise进入resolved状态，可以在then回调中获取要校验的字段值，否则，Promise进入rejected状态，可以在catch回调中获取校验失败的字段的错误信息|
|getError|`(name: NamePath) => ValidateError[]`|获取一个字段的校验结果，如果字段校验没有错误，则返回空数组，否则，返回校验错误信息的数组|
|getErrors|`(nameList?: NamePath[]) => object`|获取一组字段的校验结果，如果nameList不传，则获取所有字段的校验结果|
|setInitialValues|`(values: object, init?: boolean) => void`|设置表单初始值，如果init参数传入true，则在设置表单初始值的同时会更新对应的字段值|
|resetFields|`(nameList?: NamePath[]) => void`|重置表单|
|submit|`() => void`|提交表单，触发校验后根据结果调用onSuccess或onFailed|


### Form

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| component |  设置Form渲染元素，为false时，不创建任何DOM节点 | React.ComponentClass \| React.FC \| string \| false | 'form' |
| form | FormInstance实例，不提供时会自动创建 | FormInstance | - |
| initialValues | 表单初始值 | object | {} |
| validateMessages | 表单校验信息 | [validateMessages](#validatemessages) | |
| onSuccess |  提交表单数据验证成功后的回调事件 | (values: any) => void |  |
| onFailed | 提交表单数据验证失败后的回调事件 | (errors: ErrorEntity[],values: any) => void |  |
| onValuesChange | 表单数据更新时的回调 | (changedFields: ChangedFieldEntity[], AllNewValues: object, AllPrevValues: object) | |
| colon | 表单中每个FormItem的colon属性的默认值，表示是否显示 label 后面的冒号 | boolean | true |
| layout | 表单布局 | 'vertical' \| 'inline' \| 'horizontal' | horizontal |
| labelAlign | 表单中每个FormItem的labelAlign属性的默认值，表示label标签的文本对齐方式 | 'left' \| 'right' | right |
| valuePropName | 表单中每个FormItem的值属性的默认值，供FormItem进行属性劫持。例如某些组件的值的属性是text，checked等 | string | value |
| updateTrigger | 表单中每个FormItem收集字段变更的时机 | string | onChange |
| validateTrigger | 表单中每个FormItem进行字段校验的时机 | string \| string[] | onChange |
| labelCol | 表单中每个FormItem的label所占的列数，可以传一个数字，作为Col组件的cols属性，也可以直接把Col组件的所有props作为对象传入 | number \| [ColProps](/components/GridLayout-cn/#Col属性) | 自适应：当不传入该props时，label的宽度将会以所有FormItem中label最宽的为准 |
| wrapperCol | 表单中每个FormItem的包裹的输入控件所占的列数，可以传一个数字，作为Col组件的cols属性，也可以直接把Col组件的所有props作为对象传入 | number \| [ColProps](/components/GridLayout-cn/#Col属性) | 4 |
| validateErrorType | 表单中每个FormItem的校验提示信息的展现形式 | 'div' \| 'tip' \| 'none' | 'div' |
| validateDivErrorClassName | 表单中每个FormItem的校验提示信息是div的展现形式时的ClassName，作用于Error信息的div | string | '' |
| getPopupContainer | 表单中每个FormItem的校验提示信息tooltip的渲染父节点   | (() => HTMLElement) \| false | 无 |

### FormItem
FormItem可以覆盖Form中的同名属性

| 属性名称 | 描述 | 类型 | 默认值 |
|:-------|:------|:-----|:------|
| label | 字段标签名 | string \| React.ReactNode |
| name | 字段名 | string \| number \| Array<string \| number> | - |
| htmlFor | label的htmlFor属性 | string | |
| getValueFromEvent | 设置如何将event的值转换成字段值 | (...args: any[]) => any | |
| style | 字段样式 | React.CSSProperties | |
| colon | 是否显示 label 后面的冒号，可覆盖Form中设置的colon属性 | boolean | true |
| labelAlign | label标签的文本对齐方式，可覆盖Form中设置的labelAlign属性 | 'left' \| 'right' | right |
| rules | 表单中每个FormItem的默认校验规则 | [Rule](#Rule)[] | |
| layout | 表单布局, 可覆盖Form的layout属性 | 'vertical' \| 'inline' \| 'horizontal' | horizontal |
| valuePropName | FormItem包裹的子组件的值属性，供FormItem进行属性劫持。例如某些组件的值的属性是text，checked等，可覆盖Form中设置的valuePropName属性 | string | value |
| updateTrigger | FormItem收集字段变更的时机，可覆盖Form中设置的updateTrigger属性 | string | onChange |
| validateTrigger | FormItem对字段值进行校验的时机，可覆盖Form中设置的validateTrigger属性 | string \| string[] | onChange |
| labelCol | label所占的列数，可覆盖Form中设置的labelCol属性 | number \| [ColProps](/components/GridLayout-cn/#Col属性)  | 2 |
| wrapperCol | FormItem包裹的输入控件占的列数，可覆盖Form中设置的wrapperCol属性 | number \| [ColProps](/components/GridLayout-cn/#Col属性) | 4 |
| validateErrorType | 校验提示信息的展现形式，可覆盖Form中设置的validateErrorType属性 | 'div' \| 'tip' \| 'none' | 'div' |
| validateDivErrorClassName | 表单中每个FormItem的校验提示信息是div的展现形式时的ClassName，作用于Error信息的div，可覆盖Form中设置的validateDivErrorClassName属性 | string | '' |
| tipStyle | 自定义组件中ToolTip的样式，详细参考ToolTip组件 | CustomTooltipType | - |
| tipNoTrigger | 配置tooltip是否需要trigger（当前默认为[focus]）。当validateErrorType为tip时有效。应用场景：内容为checkbox类的元素时，请设置为true | boolean | false |
| labelTip | label的title属性，鼠标悬浮时显示提示文本 | string | - |
| version | 增加版本设置 | string | - |
| theme | 增加主题设置 | string | - |


### Rule

| 属性名 | 类型 | 描述                                                                       |
|:----|:----|:-------------------------------------------------------------------------|
| required | boolean | 校验字段值是否不能为空                                                              |
| integer | boolean | 校验字段值是否是整数                                                               |
| float | boolean | 校验字段值是否是浮点数                                                              |
| email | boolean | 校验字段值是否是邮箱地址                                                             |
| url | boolean | 校验字段值是否是url地址                                                            |
| alpha | boolean | 校验字段值是否只包含字母                                                             |
| ipv4 | boolean | 校验字段值是否是ipv4地址                                                           |
| ipv6 | boolean | 校验字段值是否是ipv6地址                                                           |
| creditCard | boolean | 校验字段值是否是银行卡号                                                             |
| enum | (string \| number)[] | 校验字段值是否在枚举值中                                                             |
| pattern | RegExp | 校验字段值是否满足正则表达式                                                           |
| equalTo | string\|number | 校验字段值是否等于给定的值                                                            |
| notEqualTo | string\|number | 校验字段值是否不等于给定的值                                                           |
| min | number | 校验字段值是否不小于给定的最小值 |
| max | number | 校验字段值是否不大于给定的最大值 |
| range | [number, number] | 校验字段值是否在给定区间内 |
| minLength | number | 检验字段值的长度是否不小于给定的最小值 |
| maxLength | number | 校验字段值的长度是否不大于给定的最大值 |
| rangeLength | [number, number] | 校验字段值的长度是否在给定区间内 |
| custom | (value: any, name?: string) => Promise<void> | 自定义校验规则, 通过传入一个异步函数来自定义校验过程，如果校验出错，则抛出异常提示信息; 7.1.x版本支持通过抛出Error类型设置提示信息 |

### ValidateMessages
当ValidateMessage为函数时，函数入参为字段名以及Rule中配置的校验参数，返回值是校验提示信息

| 属性名 | 类型 |
|:----|:----|
| required | ValidateMessage |
| integer |  ValidateMessage |
| float | ValidateMessage |
| email | ValidateMessage |
| url | ValidateMessage |
| alpha | ValidateMessage |
| ipv4 | ValidateMessage |
| ipv6 | ValidateMessage |
| creditCard | ValidateMessage |
| enum | BasicValidateMessage \| (name: string, enums: (string \| number)[]) => BasicValidateMessage |
| pattern | BasicValidateMessage \| (name: string, pattern: string) => BasicValidateMessage |
| equalTo | BasicValidateMessage \| (name: string, valueToEqual: number \| string) => BasicValidateMessage |
| notEqualTo | BasicValidateMessage \| (name: string, valueNotToEqual: number \| string ) => BasicValidateMessage |
| min | BasicValidateMessage \| (name: string, min: number) => BasicValidateMessage |
| max | BasicValidateMessage \| (name: string, max: number) => BasicValidateMessage |
| range | BasicValidateMessage \| (name: string, range: [number, number]) => BasicValidateMessage |
| minLength | BasicValidateMessage \| (name: string, minLength: number) => BasicValidateMessage |
| maxLength | BasicValidateMessage \| (name: string, maxLength: number) => BasicValidateMessage |
| rangeLength | BasicValidateMessage \| (name: string, lengthRange: [number, number]) => BasicValidateMessage |

## 使用示例

### 基本使用

基本的表单使用，包含表单初始化、校验、提交

```jsx
import Form from 'eview-ui/FormPro';
import TextField from 'eview-ui/TextField';
import Button from 'eview-ui/Button';

const initialValues = {
  username: 'default_username'
};

const form = Form.useForm();

// onSuccess(values): 校验通过；onFailed(errors): 校验失败
<Form
  form={form}
  initialValues={initialValues}
  onSuccess={(values) => { /* values: 全部表单值 */ }}
  onFailed={(errors) => { /* errors: 校验错误信息 */ }}
>
  <Form.Item label='User Name' name='username' rules={[{ required: true }]}>
    <TextField />
  </Form.Item>
  <Form.Item label='Password' name='password' rules={[{ required: true }]}>
    <TextField type='password' />
  </Form.Item>
  <Form.Item label='Email' name={['detail', 'email']} rules={[{ email: true }]}>
    <TextField />
  </Form.Item>
  <Form.Item label='Address' name={['detail', 'address']}>
    <TextField />
  </Form.Item>
  <Form.Item colon={false}>
    <Button text='Submit' onClick={() => { form.submit(); }} />
  </Form.Item>
</Form>
```

### 表单校验

可以通过配置FormItem的rules属性给表单域配置校验规则，配置Form的validateMessages属性则可以配置校验失败时对应的错误提示信息。
Eview-UI后续的演进方向是完善Form的校验功能，逐步剔除输入控件自身的校验逻辑。因此我们建议输入类组件的校验功能都迁移到Form中。

```jsx
import Form from 'eview-ui/FormPro';
import Spinner from 'eview-ui/Spinner';
import TextField from 'eview-ui/TextField';
import Button from 'eview-ui/Button';

// validateMessages: 配置各校验项失败的错误提示信息
const validateMessages = {
  required: 'User Name Can not be empty',
  range: (name, range) => `The ${name} must be a number between ${range[0]} and ${range[1]}`,
  pattern: 'The Password can only contains number and alpha'
};

const initialValues = { age: 15 };
const form = Form.useForm();

<Form
  form={form}
  initialValues={initialValues}
  onSuccess={(values) => { /* values: 全部表单值 */ }}
  onFailed={(errors) => { /* errors: 校验错误信息 */ }}
  validateMessages={validateMessages}
  labelCol={3}
  wrapperCol={6}
>
  {/* 一个 Rule 对象传入多个校验项，只显示第一个校验失败的提示 */}
  <Form.Item label='User Name' name='username' rules={[{ required: true }]}>
    <TextField />
  </Form.Item>
  <Form.Item label='Age' name='age' rules={[{ integer: true, range: [0, 18] }]}>
    <Spinner type="number" />
  </Form.Item>
  {/* rules 传多个 Rule 对象，会显示每个 Rule 对象第一个失败的提示 */}
  <Form.Item label='Password' name='password' rules={[{ minLength: 6 }, { pattern: /^[0-9a-zA-Z]+$/ }]}>
    <TextField type='password' />
  </Form.Item>
  {/* custom: 自定义异步校验，失败时抛出错误提示 */}
  <Form.Item label='Confirm PassWord' name='confirmPassword' rules={[{
    custom: async value => {
      if (value !== form.getFieldValue('password')) {
        throw 'The input is not same as the password';
      }
    }
  }]}>
    <TextField type='password' />
  </Form.Item>
  <Form.Item colon={false}>
    <Button text='Submit' onClick={() => { form.submit(); }} />
  </Form.Item>
</Form>
```

### 使用FormInstance操作表单

FormInstance是用来操作表单的实例，在函数式组件中，你可以通过自定义hook——useForm创建和使用formInstance实例，在类组件中，你可以通过Form组件的ref拿到FormInstance实例。FormInstance提供了一系列方法（详见[API](#FormInstance)），让你可以进行读、写、校验表单，设置表单初始值，重置表单，获取表单校验提示信息等操作。搭配Form组件的onValuesChange等钩子
可以让你实现复杂表单的依赖控制

```jsx
import Form from 'eview-ui/FormPro';
import TextField from 'eview-ui/TextField';
import Button from 'eview-ui/Button';
import RadioGroup from 'eview-ui/RadioGroup';
import Select from 'eview-ui/Select';

const initialValues = { showDetail: false };

const validateMessages = {
  required: 'User Name Can not be empty',
  range: (name, range) => `The ${name} must be a number between ${range[0]} and ${range[1]}`,
  pattern: 'The Password can only contains number and alpha'
};

const detailRadioGroupData = [{ text: 'Yes', value: true }, { text: 'No', value: false }];
const citizenShipOptions = [
  { text: 'America', value: 'America' },
  { text: 'China', value: 'China' },
  { text: 'Japan', value: 'Japan' }
];

// 类组件通过 ref 拿 FormInstance；函数组件用 Form.useForm()
const form = React.createRef();

const detailArea = (
  <>
    <Form.Item label='Email' name={['detail', 'email']} rules={[{ email: true }]}>
      <TextField />
    </Form.Item>
    <Form.Item label='Citizen Ship' name={['detail', 'citizenShip']}>
      <Select options={citizenShipOptions} />
    </Form.Item>
  </>
);

// onValuesChange(changedValues, allNewValues, allPrevValues)：建议在此控制依赖状态
<Form
  ref={form}
  initialValues={initialValues}
  onValuesChange={(changedValues, allNewValues, allPrevValues) => {
    // password 变化时重新校验 confirmPassword
    if (allNewValues.password !== allPrevValues.password) {
      form.current.validateFields(['confirmPassword']).catch(e => e);
    }
  }}
  onSuccess={(values) => { /* values: 全部表单值 */ }}
  onFailed={(errors) => { /* errors: 校验错误信息 */ }}
  validateMessages={validateMessages}
  labelCol={3}
  wrapperCol={6}
>
  <Form.Item label='User Name' name='username' rules={[{ required: true }]}>
    <TextField />
  </Form.Item>
  <Form.Item label='Password' name='password' rules={[{ minLength: 6 }, { pattern: /^[0-9a-zA-Z]+$/ }]}>
    <TextField type='password' />
  </Form.Item>
  <Form.Item label='Confirm PassWorld' name='confirmPassword' rules={[{
    custom: async value => {
      if (value !== form.current.getFieldValue('password')) {
        throw 'The input is not same as the password';
      }
    }
  }]}>
    <TextField type='password' />
  </Form.Item>
  <Form.Item label='Detail' name='showDetail'>
    <RadioGroup data={detailRadioGroupData} onChange={(value) => { /* 取 value 更新 showDetail */ }} />
  </Form.Item>
  {/* showDetail 为 true 时展示依赖表单项 */}
  {false ? detailArea : null}
  <Form.Item colon={false} wrapperCol={9}>
    <Button text='Submit' onClick={() => { form.current.submit(); }} />
    <Button text='Quick Set' onClick={() => { form.current.setFieldsValue({ username: 'default_username', password: 'defaultPassword', confirmPassword: 'defaultPassword', showDetail: false }); form.current.validateFields().catch(e => e); }} />
    <Button text='Reset' onClick={() => { form.current.resetFields(); }} />
  </Form.Item>
</Form>
```

### 错误提示

FormItem会劫持子组件的value和onChange属性（你也可以通过给FormItem传入valuePropName和validateTrigger来指定要劫持的属性），在子组件onChange时触发表单校验，并在校验失败时展示错误提示。当FormItem的validateErrorType为div时，错误提示将展示在输入控件的下方，当validateErrorType为tip时，错误提示是一个ToolTip气泡。如果默认的错误提示不满足你的需求，你可以将FormItem的validateErrorType置为none，然后包裹一个自定义组件，在该组件内部通过FormInstance.getError获取检验结果，并根据自己的需要展示错误提示

```jsx
import Form from 'eview-ui/FormPro';
import TextField from 'eview-ui/TextField';
import Tooltip from 'eview-ui/Tooltip';
import { SvgIcon } from "@/shared/SvgIcon";

// validateErrorType='none' 时，自定义组件内部通过 form.getError 取校验结果自行展示
const InputWithCustomErrorTip = (props) => {
  const errorsContent = props.form.getError('url');
  const showError = errorsContent !== undefined && errorsContent.length !== 0;
  return (
    <Tooltip content={<div>{errorsContent}</div>} placement="right" visible={showError}>
      <TextField value={props.value} onChange={value => { props.onChange(value); }} />
    </Tooltip>
  );
};

const Label = (props) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ marginRight: '0.25rem' }}>{props.label}</span>
    <Tooltip content={props.hint} trigger='click'>
      <SvgIcon src="help" size={14} style={{ marginLeft: '2px' }} />
    </Tooltip>
  </div>
);

const form = Form.useForm();
// FormItem 的 label 可传入 JSX 自由定制
const emailLabel = <Label label='Email' hint='this is a field with div errors hint' />;
const ipLabel = <Label label='IP' hint='this is a field with default tip errors hint' />;
const urlLabel = <Label label='Url' hint='this is a field with custom tip errors hint' />;

<Form form={form}>
  {/* validateErrorType='div'：错误提示展示在输入控件下方 */}
  <Form.Item label={emailLabel} name='email' validateErrorType='div' rules={[{ email: true }]}>
    <TextField />
  </Form.Item>
  {/* validateErrorType='tip'：错误提示为 Tooltip 气泡 */}
  <Form.Item label={ipLabel} name='Ip' validateErrorType='tip' rules={[{ ipv4: true }]}>
    <TextField />
  </Form.Item>
  {/* validateErrorType='none'：不显示 FormItem 提供的错误提示，自行展示 */}
  <Form.Item label={urlLabel} name='url' validateErrorType='none' rules={[{ url: true }]}>
    <InputWithCustomErrorTip form={form} onChange={() => { form.validateFields(['url']).catch(e => e); }} />
  </Form.Item>
</Form>
```

### 表单布局

Form提供了layout属性，实现了常用的三种布局。

```jsx
import Form from 'eview-ui/FormPro';
import TextField from 'eview-ui/TextField';

const SmallTextField = () => (<TextField inputStyle={{ width: '6rem' }} />);

// layout: "inline" | "horizontal" | "vertical"
const layout = "inline";

<Form
  layout={layout}
  labelAlign='left'
  labelCol={{ cols: 1, style: { minWidth: '2rem' } /* labelCol 也支持传 Col 的 props */ }}
>
  <Form.Item label='Email' name='email' rules={[{ email: true }]} style={{ marginRight: '1rem' }}>
    <SmallTextField />
  </Form.Item>
  <Form.Item label='Ip' name='Ip' rules={[{ ipv4: true }]} style={{ marginRight: '1rem' }}>
    <SmallTextField />
  </Form.Item>
  <Form.Item label='Url' name='url' rules={[{ url: true }]}>
    <SmallTextField />
  </Form.Item>
</Form>

{/* horizontal 布局中嵌套 inline 布局 */}
<Form labelCol={1}>
  <Form.Item label='Item1' name='item1'>
    <SmallTextField />
  </Form.Item>
  <Form.Item label='Item3' name='item3' wrapperCol={20}>
    <Form.Item colon={false} name='item3' layout='inline' style={{ padding: '0px 0.5rem 0px 0px' }}>
      <SmallTextField />
    </Form.Item>
    <Form.Item label='Item4' name='item4' layout='inline' style={{ padding: '0px 0.5rem' }}>
      <SmallTextField />
    </Form.Item>
  </Form.Item>
</Form>
```

