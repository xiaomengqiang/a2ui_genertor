# Select 组件功能逻辑规格

> 资料来源：TypeDoc `Select/Select` + 官网 Select 页示例。
> ⚠️ `onChange(value, oldValue, text, oldText, event)`——**五个参数**，前四个都是值，`event` 是第五个；eview-react 没有 `mode` / `showSearch` / `placeholder`，占位用 `defaultLabel`，多选用 `MultipleSelect`、可输入用 `InputSelect`。
> ⚠️ 选项字段是 `text`（不是 `label`）；`value` 可 string/number/boolean/object，为 object 时对象里必须含 key 为 `value` 的属性；受控 `value` 存选中项的 value（不是 text / index），`null` = 未选。

## 1. 功能定位

Select 是单选下拉框：`options` 数组驱动，每项 `text` 显示、`value` 存取；支持初始选中、必填校验、清空、虚拟滚动。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 单选下拉 | `Select` + `options` | antd 的 `<Select><Option>` children、`mode` |
| 多选下拉 | `MultipleSelect`（[MultipleSelect.md](MultipleSelect.md)） | `Select` 加 `multiple` |
| 可输入 + 下拉建议 | `InputSelect`（第二批） | `Select` 加 `showSearch` |
| 树形下拉 | `TreeSelect`（[TreeSelect.md](TreeSelect.md)） | — |
| 级联 | `Cascader`（[Cascader.md](Cascader.md)） | — |

## 2. 事件与交互逻辑

### onChange —— 五个参数 `(value, oldValue, text, oldText, event)`

```tsx
<Select
  label="状态"
  options={statusOptions}
  defaultLabel="-请选择-"                 // 占位文案（不是 placeholder）
  value={status}
  onChange={(value, oldValue, text, oldText, event) => {
    setStatus(value);
    fetchList({ status: value, page: 1 });  // 筛选变化 → 回到第一页重新请求
  }}
/>
```

### 必填 + 校验 + 清空（ref 命令式）

```tsx
<Select
  ref={statusRef}
  label="级别"
  required                              // 必填，配合 ref.validate()
  hintType="tip"
  enableClear                           // 有值时 hover 出现清除按钮
  options={levelOptions}
  defaultLabel="-请选择-"
  value={level}
  onChange={(value) => setLevel(value)}
  validator={(value) => ({ result: value !== 0, message: '不允许选择 0 级' })}  // result: true 通过
/>

// 提交前：
if (!statusRef.current.validate()) { statusRef.current.focus(); return; }
// 重置：
statusRef.current.clear();
```

### 联动下拉：父级变化 → 清空子级并重新加载

```tsx
const handleProvinceChange = async (value) => {
  setProvince(value);
  setCity(null);                         // 先清子级，避免残留无效值
  setCityOptions(await api.getCities(value));
};
<Select label="省" options={provinceOptions} value={province} onChange={handleProvinceChange} />
<Select label="市" options={cityOptions} value={city} disabled={cityOptions.length === 0} onChange={(v) => setCity(v)} />
```

### 选项图标：icon / iconActive 用 icon+

```tsx
import { IconPlusIcPublicUser, IconPlusIcPublicUserActive } from '@nce/icon-plus';
const userOptions = [
  { text: '管理员', value: 'admin', icon: <IconPlusIcPublicUser />, iconActive: <IconPlusIcPublicUserActive /> },
  { text: '访客', value: 'guest' },
];
<Select label="角色" options={userOptions} value={role} onChange={setRole} />
```

### 选项结构（agent 必须构造）

```tsx
interface SelectOption {
  text: string;                 // 显示文字 —— 不是 label
  value: string | number | boolean | { value: any; [k: string]: any };
  icon?: string | ReactElement;
  iconActive?: string | ReactElement;
  tipData?: string;
}
```

## 3. 联动说明

- 省市级联：父级 `onChange` 里先 `setCity(null)` 清子级值，再异步加载子级 `options`，避免残留无效值
- `options` 长度 > 100 → 加 `virtualScroll`（README：数据量必须大于 100 才生效）

## 4. 反面示例

```tsx
// ❌ antd 写法：eview-react Select 没有 Option 子组件、mode、showSearch、placeholder
<Select placeholder="请选择" mode="multiple" showSearch>
  <Select.Option value="a">A</Select.Option>
</Select>

// ❌ options 字段名写成 label（应为 text）
<Select options={[{ label: '华东', value: 'east' }]} />

// ❌ 只写 value 不写 onChange，用户选了也不进 state
<Select options={opts} value={region} />

// ❌ 把 onChange 第二个参数当 event（它是 oldValue，event 是第五个）
<Select options={opts} onChange={(value, event) => event.stopPropagation()} />

// ❌ 父级切换后没清子级：city 还留着上一个省的值，提交时脏数据
const handleProvinceChange = (v) => { setProvince(v); loadCities(v); };
```

## 5. API 速查

> 压缩自 `Select/Select`；ref 方法仅列 README / demo 实际出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `options` | `Array<{ text, value, icon?, iconActive?, tipData? }>` | **必填**；`text` 字符串，`value` 可 string/number/boolean/object；`icon`/`iconActive` 收 `string \| ReactElement`（默认用 icon+ 组件） |
| `value` | `any`（可 `null`） | 受控选中值；按 `value` 匹配，不是 index |
| `selectedIndex` | `number` | 按 options 下标选中 |
| `defaultLabel` | `string` | 未选中时的提示文案（官方注明后续会改名 placeholder） |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`，默认 `before` | 名称文字及位置 |
| `onChange` | `(value, oldValue, text, oldText, event) => void` | 五参，前四个都是值 |
| `onFocus` / `onBlur` | `(event) => void` | 聚焦 / 失焦 |
| `onDropdownVisibleChange` / `onSelectClick` / `onClosePopup` | 回调 | 下拉显隐、点击、关闭 |
| `disabled` / `required` | `boolean`，默认 `false` | 灰化 / 必填 |
| `validator` | `(value) => { result, message }` | 自定义校验，`result: true` 通过 |
| `hintType` | `'div' \| 'tip'`，默认 `div` | 错误提示形式 |
| `enableClear` | `boolean`，默认 `false` | hover 显示清除按钮 |
| `virtualScroll` | `boolean` | 虚拟滚动，> 100 项才生效 |
| `popupDirection` | `'top' \| 'bottom'`，默认 `bottom` | 弹出方向 |
| `lazySearch` | `{ 总记录, onLoadRecords }` | 分页懒加载建议列表 |
| `zindex` / `autoZindex` | `string` / `boolean` | 弹层层级 |
| `selectStyle` / `selectClassName` / `optionStyle` / `optionClassName` | 样式 | 选择框 / 选项样式 |
| `ref.getValue()` / `ref.validate()` / `ref.focus()` / `ref.clear()` | 命令式方法 | 取值 / 校验 / 聚焦 / 清空 |
