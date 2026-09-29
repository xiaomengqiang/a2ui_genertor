# InputSelect 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `InputSelect/InputSelect`；官网组件页 InputSelect 及示例 `InputSelectBasic.jsx` / `InputSelectEvent.jsx` / `InputSelectDisable.jsx` / `InputSelectVirtual.jsx`；Form 示例 `FormItem.jsx`
>
> ⚠️ 它是"可输入的 Select"：`options=[{ text, value }]` 与 Select 一致，但输入框可以敲字过滤；**`onlySelect`** 决定输入的文字是只用于过滤（失焦清空）还是可作为值保留。
> ⚠️ `onChange(value, oldValue)`，API 描述还提到第三个参数 `type: 'input' | 'select'` 区分触发来源，类型签名里没写 → 待实测，不要依赖。

## 1. 功能定位

InputSelect 是可输入过滤的下拉：选项多时敲字过滤，只剩一个选项时回车选中；可限定只能选、也可允许自由输入。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 选项 > 20 且要敲字过滤、最终必须是选项之一 | `InputSelect onlySelect` | antd `Select showSearch` |
| 允许输入选项之外的值（历史记录 + 自定义） | `InputSelect`（不传 onlySelect） | `AutoComplete` |
| 选项少、不用过滤 | `Select`（[Select.md](Select.md)） | InputSelect |
| 多选 | `MultipleSelect`（[MultipleSelect.md](MultipleSelect.md)） | InputSelect |

## 2. 典型场景

- 选设备（几百台）：`onlySelect` + `virtualScroll`（> 100 项生效）
- 标签 / 分组名：允许输入新值，`enableClear` 可清
- 表单必填字段：`required` + `hintType="tip"`，提交前 `ref.validate()`
- 在 Form 内：`Form.Item name` 托管，`rules` 校验

## 3. 状态声明

```tsx
// 受控写法（README："value 与 onChange 配合使用"）
const [deviceId, setDeviceId] = useState<string | number | null>(null);
const inputSelectRef = useRef<any>(null);   // demo：getValue / validate / focus / clear
```

## 4. 事件与交互逻辑

```tsx
// 只能选（输入仅过滤，失焦清空未匹配文字）
<InputSelect
  label="设备"
  placeholder="输入名称过滤"
  options={deviceOptions}                        // [{ text, value }]
  onlySelect
  required
  hintType="tip"
  enableClear
  virtualScroll                                  // > 100 项生效
  value={deviceId}
  onChange={(value, oldValue) => setDeviceId(value)}
/>

// 允许自定义输入：不传 onlySelect，value 可能是选项外的字符串
<InputSelect label="分组" options={groupOptions} value={group} onChange={(value: string) => setGroup(value)} onInputEnter={(e, value: string) => setGroup(value)} />

// 命令式（demo InputSelectEvent.jsx）
if (!inputSelectRef.current.validate()) inputSelectRef.current.focus();
inputSelectRef.current.clear();
```

## 5. 数据结构

```tsx
interface SelectOption {
  text: string;                 // 显示 —— 不是 label
  value: string | number;
}
```

## 6. 联动说明

- 选中设备 → 拉取该设备详情 / 联动下一级下拉；清空 → 清子级
- `onlySelect` 下 `value` 恒为选项 value；不开时提交前判断是否命中选项，决定"新建"还是"引用"
- 与 TextField / Select 一起纳入提交前 `ref.validate()`
- Form 内不传 `value` / `onChange`

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import InputSelect from '@nce/eview-react/InputSelect';
import Button from '@nce/eview-react/Button';

interface SelectOption { text: string; value: string; }

const DEVICES: SelectOption[] = Array.from({ length: 150 }, (_, i) => ({ text: `device-${String(i + 1).padStart(3, '0')}`, value: `d${i + 1}` }));
const GROUPS: SelectOption[] = [{ text: '核心', value: 'core' }, { text: '接入', value: 'access' }];

// 绑定设备到分组：设备只能从列表选（过滤 + 虚拟滚动）；分组可选可新建
export default function BindDeviceForm() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [group, setGroup] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const deviceRef = useRef<any>(null);

  const handleSubmit = () => {
    if (!deviceRef.current.validate()) { deviceRef.current.focus(); return; }
    const isNewGroup = !GROUPS.some((g) => g.value === group || g.text === group);
    setResult(`设备 ${deviceId} → 分组 ${group}${isNewGroup ? '（新建）' : ''}`);
  };

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InputSelect ref={deviceRef} label="设备" placeholder="输入名称过滤" options={DEVICES} onlySelect required hintType="tip" enableClear virtualScroll value={deviceId} onChange={(value: string) => setDeviceId(value)} />
      <InputSelect label="分组" placeholder="选择或输入新分组" options={GROUPS} value={group} onChange={(value: string) => setGroup(value)} onInputEnter={(e: any, value: string) => setGroup(value)} />
      {result ? <div>{result}</div> : null}
      <div><Button status="primary" text="绑定" disabled={!deviceId || group.trim() === ''} onClick={handleSubmit} /></div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：Select showSearch / filterOption / AutoComplete
<Select showSearch filterOption={(i, o) => o.label.includes(i)} />
<AutoComplete options={opts} />

// ❌ options 字段写 label（应为 text）
<InputSelect options={[{ label: 'a', value: 1 }]} />

// ❌ 想"只能选"却没传 onlySelect，用户敲的半截字被当成值提交
<InputSelect options={opts} value={v} onChange={setV} />

// ❌ 依赖 API 描述里未写进签名的第三个参数 type
onChange={(value, oldValue, type) => { if (type === 'input') … }}

// ❌ 占位用 Select 的 defaultLabel（InputSelect 是 placeholder）
<InputSelect defaultLabel="请选择" />
```

## 9. API 速查

> 压缩自 `InputSelect/InputSelect`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `options` | `Array<{ text, value }>`，**必填** | 选项 |
| `value` / `selectedIndex` | `any` / `number` | 受控值 / 按下标（优先级高于 value） |
| `onChange` | `(value, oldValue) => void` | 值变化（描述提及第三参 `type`，未入签名） |
| `onSelect` | `(value, oldValue) => void` | 选中选项 |
| `onInputEnter` / `onInputKeyUp` | `(e, value) => void` / `(value) => void` | 输入框回车 / 键抬起 |
| `onlySelect` | `boolean`，默认 `false` | 输入只用于过滤，失焦清空，只有选项值保留 |
| `onlySelectLastValue` | `boolean` | 表内无说明 |
| `placeholder` | `string` | 占位 |
| `required` / `validator` / `hintType` | `boolean` / `(value, id?, type?) => { result, message }` / `'div' \| 'tip'`（默认 div） | 校验 |
| `enableClear` / `onClear` | `boolean`（默认 false）/ 回调 | 清除按钮 |
| `caseInsensitiveFilter` / `searchTrim` / `keepFiter` | `boolean` | 过滤忽略大小写（默认 true）/ 去首尾空格 / 再次打开保留过滤 |
| `showSearchTip` | `boolean`，默认 `true` | 无匹配时显示 "Not Found" |
| `virtualScroll` | `boolean` | 虚拟滚动（> 100 项） |
| `disabled` | `boolean`，默认 `false` | 灰化 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 名称文字 |
| `popupDirection` / `zindex` / `onOpenPopup` / `onClosePopup` / `popUpProps` | — | 下拉层 |
| `inputProps` / `enableFixWidth` / `selectStyle` / `optionStyle`（及 className） | — | 样式与原生属性透传 |
| `ref.getValue()` / `ref.validate()` / `ref.focus()` / `ref.clear()` | 命令式方法 | demo InputSelectEvent.jsx |
