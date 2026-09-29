# MultipleSelect 组件功能逻辑规格

> 资料来源：TypeDoc `MultipleSelect/MultipleSelect` + 官网 Multiple Select 页示例。
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

## 2. 事件与交互逻辑

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

### 选项结构（agent 必须构造）

```tsx
interface MultiOption {
  text: string;
  value: string | number;
  disabled?: boolean;                  // 注意：这里是 disabled（SelectCard 是 disable）
}
```

## 3. 联动说明

- 多选变化 → 合并到筛选参数 → `page = 1` → 请求；父级单选变化 → 先 `setRegions([])` 清空多选再换 `options`

## 4. 反面示例

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

## 5. API 速查

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
