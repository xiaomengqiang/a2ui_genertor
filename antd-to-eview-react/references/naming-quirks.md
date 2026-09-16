# API 命名异常速查表

> eview-react 部分 API 的命名与"正确英文"或 antd 习惯不同，迁移时容易写错。
> 本表汇总所有已知命名异常，按"容易写错的程度"排序。

## 属性拼写异常（官方即如此，照抄）

| 组件 | 正确拼写 | 常见错误 | 说明 |
|------|---------|---------|------|
| Crumbs | `seprator` | `separator` | 分隔符属性，官方拼错为 seprator |
| Toggle | `taggledChildren` | `toggledChildren` | 开态开关内文字，官方拼错为 taggled |
| Toggle | `unTaggledChildren` | `unToggledChildren` | 关态开关内文字 |
| SelectCard | `disable` | `disabled` | 整体禁用，不是 disabled |
| SelectCard | 选项级 `disable` | 选项级 `disabled` | 选项级禁用也是 disable |
| FileUpload | `disable` | `disabled` | 禁用上传 |

## 属性名差异（antd → eview-react）

| 组件 | antd | eview-react | 说明 |
|------|------|-------------|------|
| Button | `type="primary"` | `status="primary"` | 不是 type；status: default/primary/risk/text |
| Button | `danger` | `status="risk"` | 危险操作 |
| Button | `loading` | 无（用 `disabled` + 文案切换） | 处理中表达 |
| Button | `htmlType="submit"` | 无（用 `onClick`） | Button 没有 type 属性 |
| Button | `icon` | `leftIcon` / `rightIcon` | 分左右 |
| Select | `placeholder` | `defaultLabel` | 占位文案 |
| Select | `options=[{label,value}]` | `options=[{text,value}]` | 字段名 label→text |
| Select | `<Select.Option>` | 无（用 `options` 数组） | 不支持 children 写法 |
| Select | `allowClear` | `enableClear` | 清除按钮 |
| MultipleSelect | `placeholder` | `placeholder` | MultipleSelect 保留 placeholder（不是 defaultLabel） |
| Radio.Group | `<Radio>` children | `data=[{text,value}]` | 不支持 children |
| Radio.Group | `onChange(e)` | `onChange` 参数顺序冲突 | 用兼容写法：与当前值比较取新值 |
| Radio.Group | 无 | `isControlled` | 默认非受控，要受控必须传 |
| Checkbox.Group | `<Checkbox>` children | `data=[{text,value}]` | 不支持 children |
| Switch | `checked` | `toggled` | 开关状态属性 |
| Switch | `onChange(checked)` | `onToggle(value)` | 回调名和参数都不同 |
| Switch | `checkedChildren` | `taggledChildren` | 开态文字（拼错） |
| Switch | `unCheckedChildren` | `unTaggledChildren` | 关态文字（拼错） |
| InputNumber | `value` (number) | `value` (string\|number) | Spinner 的 value |
| InputNumber | `onChange(value)` | `onChange(value)` 仅有效值 | 无效值走 `onInputError` |
| Steps | `current={index}` | `currentStep={data[index].value}` | 对应 data[].value 不是下标 |
| Steps | `<Step>` children | `data=[{text,value}]` | 不支持 children |
| Steps | `items=[{title}]` | `data=[{text,value}]` | title→text |
| Tabs | `items=[...]` | children `<TabItem>` | 不支持 items |
| Tabs | `onChange(key)` | `onClick(index, title, event)` | 回调名和参数都不同 |
| Tabs | 无 | `draggable` 默认 true | 需关 `draggable={false}` |
| Modal | `open` | `isOpen` | Dialog 的显隐 |
| Modal | `footer` | `buttons=[{text,status,onClick}]` | 数组 |
| Modal | `onOk` / `onCancel` | `onClose(event)` | 只有一个回调；不会自动关闭 |
| Modal.confirm | `onOk` | `buttons={{ok:{onClick}, cancel:{onClick}}}` | 对象不是数组 |
| Drawer | `open` | `visible` | 显隐属性名不同 |
| Alert | `type="info"` | `type="default"` | DivMessage 只有 default/success/error/warn |
| Alert | `showIcon` | `showIcon`（默认 true） | 保留 |
| Alert | `closable` / `banner` | `closeIconDisplay`（默认 true） | 不同属性名 |
| message | `message.success()` | 无命令式 API | 渲染 `<DivMessage display type="success">` |
| Badge | `count` | `content` | 计数属性 |
| Tag | `closable` | 无（靠数组+onClick 删） | 不支持 closable |
| Tag | `color="green"` | `color="success"` | 六语义色 |
| Rate | `onChange(value)` | `onClick(value)` | 没有 onChange |
| Slider | `range` (boolean) | `type="range"` | DragInput 的类型属性 |
| Slider | `value` (number) | `value` (number[]) | 永远是数组 |
| Slider | `marks` (object) | `markIndexes` (number[]) | 数组不是对象 |
| Collapse | `items` / `activeKey` | `selectedIndex` (number[]) | Panel 的属性 |
| Popconfirm | `onConfirm` / `onCancel` | `buttons={{ok,cancel}}` | MessageDialog 的按钮对象 |
| Tooltip | `title` | `content` | TipBox 的内容 |
| Tooltip | `placement` | `direction` | 12 方位 |
| Breadcrumb | `items` / `separator` | `data` / `seprator` | 字段名和拼写都不同 |
| Descriptions | `items` / `bordered` | 无（手写 KeyValueList） | 无对应组件 |
| Result | `status` / `title` / `extra` | `Empty type="success"` + 手写 | API 完全不同 |
| Space | `<Space>` | flex div + gap | 无对应组件 |
| Empty | `image` | 无（用 `type` 选图） | Empty 只有 type/description |
| Spin | `spinning` | `isOpen` | Loading 的显隐 |
| Form | `form={form}` | `ref={formRef}` | ref 代替 form prop |
| Form | `onFinish` | `onSuccess` | 回调名不同 |
| Form | `validateFields()` | `submit()` → `onSuccess` | Promise → 回调 |
| Form.Item | `extra` | 无 | 用控件 `ruleText` 或手写 `<div>` |
| Form rules | `{ required:true, message:'...' }` | `{ required:true }` | 无 message |
| Form rules | `{ type:'email' }` | `{ email:true }` | 写法不同 |
| Form rules | `{ min:3 }` / `{ max:32 }` | `{ min:true, args:[3] }` / `{ max:true, args:[32] }` | 写法不同 |

## 回调签名差异（首参是值不是 event）

| 组件 | antd 签名 | eview-react 签名 |
|------|----------|-------------------|
| TextField.onChange | `(e) => e.target.value` | `(value, oldValue, event)` |
| TextField.onBlur | `(e)` | `(event, value)` — 注意顺序反了 |
| TextArea.onChange | `(e) => e.target.value` | `(targetValue, value, event)` |
| TextArea.onBlur | `(e)` | `(event)` — 只有 event，无 value |
| Select.onChange | `(value, option)` | `(value, oldValue, text, oldText, event)` — 五参 |
| Checkbox.onChange | `(e) => e.target.checked` | `(value, checked, event, additionalData)` |
| Switch.onChange | `(checked)` | `onToggle(value)` — 回调名不同 |
| Rating | `onChange(value)` | `onClick(value)` — 没有 onChange |
| Steps | `onChange(current)` | `onClick(index)` — 参数是下标不是 value |
| Tab | `onChange(key)` | `onClick(index, title, event)` — 参数顺序不同 |
| Button.onClick | `(e)` | `(event, additionalData)` — 第二个参数是业务数据 |
