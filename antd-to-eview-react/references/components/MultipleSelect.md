# MultipleSelect 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `MultipleSelect/MultipleSelect`；官网组件页 Multiple Select 及示例 `MultipleSelectDemo.jsx` / `MultipleSelectEventDemo.jsx` / `MultipleSelectSearchableDemo.jsx` / `MultipleSelectExpandQueryDemo.jsx` / `MultipleSelectVirtualScroll.jsx` / `DisabledDome.jsx`；Form 示例 `FormItem.jsx`
>
> ⚠️ 与单选 `Select` 的三个差别：`value` 是**数组**；占位用 **`placeholder`**（Select 是 `defaultLabel`）；选项禁用字段是 **`disabled`**（SelectCard 是 `disable`）。
> ⚠️ `onChange(value[], changeValue[], event)`：第一个是当前全部选中值，第二个是本次勾上 / 取消的值。
> ⚠️ demo `MultipleSelectDemo.jsx` 漏传了 `options`，不要照抄它；`options` 是必填。

## 1. 功能定位

MultipleSelect 是多选下拉：输入框内预览已选项，支持全选、搜索、关闭小图标、虚拟滚动、必填校验。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 从固定选项里选多个（标签、区域、角色） | `MultipleSelect` | antd `Select mode="multiple"` |
| 只选一个 | `Select`（[Select.md](Select.md)） | MultipleSelect 限一项 |
| 选项少于 5 个、希望一眼看全 | `CheckboxGroup`（[Checkbox.md](Checkbox.md)） | MultipleSelect |
| 树形多选 | `TreeSelect`（后续批次） | — |

## 2. 典型场景

- 筛选条"状态（多选）"：变化后列表回第一页重新请求
- 表单"通知人 / 角色"多选：`required` + `hintType="tip"`
- 选项很多：`searchable` 搜索 + `virtualScroll`（> 100 项生效）
- 已选项可直接在输入框里点 × 移除：`enableCloseIcon`

## 3. 状态声明

```tsx
// 受控写法（README："value 与 onChange 配合使用"）：value 是选中项 value 的数组
const [regions, setRegions] = useState<string[]>([]);

// 选项来自常量或接口
const [regionOptions, setRegionOptions] = useState<MultiOption[]>([]);

// 需要命令式校验 / 取值 / 聚焦时（demo EventDemo：getValue / validate / focus）
const regionRef = useRef<any>(null);
```

## 4. 事件与交互逻辑

### onChange(value[], changeValue[], event)

```tsx
<MultipleSelect
  label="区域"
  placeholder="请选择"
  options={regionOptions}                          // 必填：[{ text, value, disabled? }]
  value={regions}
  onChange={(value: string[], changeValue: string[], event) => {
    setRegions(value);                             // 第一个参数是全部选中
    fetchList({ regions: value, page: 1 });
  }}
/>
```

### 全选 / 搜索 / 关闭图标 / 数量限制

```tsx
<MultipleSelect
  options={bigOptions}
  value={selected}
  onChange={(v: string[]) => setSelected(v)}
  selectAll selectAllText="全部"                     // 下拉里加"全部"项
  searchable                                        // 输入过滤
  enableCloseIcon                                   // 已选项带 ×
  displayItems={5}                                  // 输入框最多预览 5 项
  virtualScroll                                     // > 100 项生效
  listHeight={240}
/>
```

### 必填 + 命令式校验（demo EventDemo）

```tsx
<MultipleSelect ref={regionRef} required hintType="tip" options={opts} value={regions} onChange={(v: string[]) => setRegions(v)} />
// 提交前
if (!regionRef.current.validate()) { regionRef.current.focus(); return; }
// 清空：setRegions([])（demo 的"清除"就是 setState({ value: [] })）
```

### 在 Form 内

```tsx
<Form.Item label="角色" name="roles" rules={[{ required: true }]}>
  <MultipleSelect options={roleOptions} placeholder="请选择" />
</Form.Item>
```

## 5. 数据结构

```tsx
// options 每项（api 示例：{ text, value, disabled: true }）
interface MultiOption {
  text: string;
  value: string | number;
  disabled?: boolean;                  // 注意：这里是 disabled（SelectCard 是 disable）
}

interface FilterQuery {
  regions: string[];                   // MultipleSelect 的 value 直接就是数组
  page: number;
}
```

## 6. 联动说明

- 多选变化 → 合并到筛选参数 → `page = 1` → 请求
- 父级单选（如"数据中心"）变化 → 清空多选 `setRegions([])` 再换 `options`
- 选中数量 → 显示"已选 N 项"或联动其他字段必填
- 与 Form 配合不传 `value` / `onChange`；`rules={[{ required: true }]}` 要求至少选一项

## 7. 完整代码示例

```tsx
import React, { useEffect, useRef, useState } from 'react';
import MultipleSelect from '@nce/eview-react/MultipleSelect';
import Select from '@nce/eview-react/Select';
import Button from '@nce/eview-react/Button';

interface MultiOption {
  text: string;
  value: string;
  disabled?: boolean;
}

const DC_OPTIONS = [
  { text: '华东数据中心', value: 'east' },
  { text: '华南数据中心', value: 'south' },
];
const SITES_BY_DC: Record<string, MultiOption[]> = {
  east: [{ text: '上海-A', value: 'sh-a' }, { text: '上海-B', value: 'sh-b' }, { text: '杭州-A', value: 'hz-a', disabled: true }],
  south: [{ text: '深圳-A', value: 'sz-a' }, { text: '广州-A', value: 'gz-a' }],
};

// 筛选条：数据中心单选 → 站点多选（级联清空）→ 查询
export default function SiteMultiFilter() {
  const [dc, setDc] = useState<string | null>(null);
  const [sites, setSites] = useState<string[]>([]);
  const [siteOptions, setSiteOptions] = useState<MultiOption[]>([]);
  const [result, setResult] = useState<string>('');
  const siteRef = useRef<any>(null);

  useEffect(() => {
    setSites([]);                                      // 父级变化先清子级
    setSiteOptions(dc ? SITES_BY_DC[dc] : []);
  }, [dc]);

  const handleQuery = () => {
    if (!siteRef.current.validate()) {                 // required：至少选一项
      siteRef.current.focus();
      return;
    }
    setResult(`查询：dc=${dc}, sites=[${sites.join(', ')}]`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 24 }}>
      <Select label="数据中心" options={DC_OPTIONS} defaultLabel="-请选择-" value={dc} onChange={(v: string) => setDc(v)} />
      <MultipleSelect
        ref={siteRef}
        label="站点"
        placeholder={dc ? '请选择' : '请先选择数据中心'}
        required
        hintType="tip"
        disabled={!dc}
        options={siteOptions}
        value={sites}
        selectAll
        enableCloseIcon
        displayItems={3}
        inputStyle={{ width: 280 }}
        onChange={(value: string[]) => setSites(value)}
      />
      <Button status="primary" text="查询" onClick={handleQuery} />
      <Button text="重置" onClick={() => { setDc(null); setSites([]); setResult(''); }} />
      {result ? <span>{result}</span> : null}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：Select mode="multiple" / <Option> / maxTagCount / allowClear
<Select mode="multiple" maxTagCount={3} allowClear><Select.Option value="a">A</Select.Option></Select>

// ❌ 沿用单选 Select 的占位属性（多选是 placeholder）
<MultipleSelect defaultLabel="请选择" />

// ❌ value 传标量或漏传 options
<MultipleSelect value="east" />
<MultipleSelect value={sites} onChange={setSites} />      // demo MultipleSelectDemo 的坑：没传 options

// ❌ 选项禁用字段沿用 SelectCard 的 disable
options={[{ text: 'A', value: 'a', disable: true }]}

// ❌ 把 onChange 第二个参数当全部选中值（它是本次改变的项）
onChange={(value, changeValue) => setSites(changeValue)}

// ❌ 父级切换后不清子级多选，提交带上不属于新父级的值
onChange={(v) => setDc(v)}   // 少了 setSites([])
```

## 9. API 速查

> 压缩自 `MultipleSelect/MultipleSelect`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `options` | `Array<{ text, value, disabled? }>`，**必填** | 选项 |
| `value` | `any[]` | 选中值数组（受控） |
| `selectedIndex` | `any` | 按下标选中；与 `value` 同传时以 `value` 为准 |
| `onChange` | `(value[], changeValue[], event) => void` | 全部选中 / 本次变化 |
| `onFocus` / `onBlur` | `(event) => void` | 聚焦 / 失焦 |
| `onOpenMultipleSelectPopup` / `onSearchChange` | 回调 / `(value, options?) => void` | 面板开合 / 搜索词变化 |
| `placeholder` | `string` | 占位（**不是 defaultLabel**） |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 名称文字及位置 |
| `required` / `hintType` | `boolean`（默认 false）/ `'div' \| 'tip'`（默认 div） | 必填 / 提示形式 |
| `disabled` | `boolean`，默认 `false` | 禁用 |
| `selectAll` / `selectAllText` | `boolean`（默认 false）/ `string` | 全选项 |
| `searchable` | `boolean` | 下拉搜索 |
| `enableCloseIcon` | `boolean`，默认 `false` | 已选项带关闭小图标 |
| `displayItems` | `number` | 输入框最多预览条数 |
| `delimiter` | `string`，默认 `,` | 预览分隔符 |
| `virtualScroll` / `smoothScroll` / `listHeight` | `boolean` / `boolean` / `number` | 虚拟滚动（> 100 项）/ 平滑 / 列表高 |
| `popupDirection` / `zIndex` / `showPopUp` | `'top' \| 'bottom'` / `string` / `boolean` | 弹层方向 / 层级 / 显隐 |
| `disableToolTip` / `toolTipPosition` / `title` | — | 悬浮提示 |
| `inputStyle` / `selectStyle` / `optionStyle` / `dropdownStyle` / `tagStyle`（及 className） | 样式 | 各区域样式 |
| `ref.getValue()` / `ref.validate()` / `ref.focus()` | 命令式方法 | 取值 / 校验 / 聚焦（demo EventDemo） |
