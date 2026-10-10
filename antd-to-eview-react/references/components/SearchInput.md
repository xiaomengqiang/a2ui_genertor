# SearchInput 组件功能逻辑规格

> 导入：`import SearchInput from '@/shared/SearchInput'`（scaffold 包壳，透明转发 `@nce/eview-react/SearchInput`，API 不变）。

> 资料来源：TypeDoc `SearchInput/type` + 官网 Search 页示例。
> ⚠️ `onSearch` 的触发时机按 API 表是"点击搜索图标、按回车、**或文本值变化**"三种 —— 放在 `onSearch` 里的请求必须防抖 / 防重复，不要假设它只在回车时触发。
> ⚠️ **资料冲突**：`onItemClick` 类型为 `(value, obj)`，但 demo 把**第一个参数**当成选项对象用（`obj.value` / `obj.text`）。§2 给出两种情况都成立的写法，已登记待实测。
> ⚠️ demo 里的 `enablePopup={true}` 不在 API 表中，不要使用。

## 1. 功能定位

SearchInput 是带搜索图标、清除按钮、可选建议下拉的搜索框，可做必填与校验。列表页顶部的关键字搜索用它，不要用 TextField 拼图标。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 关键字搜索（回车 / 点图标触发） | `SearchInput` | antd `Input.Search` |
| 带建议列表的搜索 | `SearchInput` + `popItems` / `onSuggest` | — |
| 普通文本输入、有 label 的表单字段 | `TextField`（[TextField.md](TextField.md)） | — |
| 可输入 + 固定选项的下拉 | `InputSelect`（[InputSelect.md](InputSelect.md)） | — |

## 2. 事件与交互逻辑

### 基础搜索：onSearch 防抖，onClear 恢复

```tsx
// onSearch 在点图标 / 回车 / 值变化时都会触发 → 必须防抖 + 版本号防串（见通用 async 模式）
const doSearch = (value: string) => { /* clearTimeout + setTimeout + ++versionRef */ };

<SearchInput
  label="搜索"
  placeholder="名称 / IP"
  value={keyword}
  isLoading={searching}
  onChange={(value: string) => setKeyword(value)}
  onSearch={(value: string) => doSearch(value)}
  onClear={() => { setKeyword(''); doSearch(''); }}   // 清空后恢复全量
/>
```

### 建议下拉：popItems（业务控制）或 onSuggest（组件按返回值渲染），二者互斥

```tsx
// 方式一：onSuggest 同步返回匹配项
<SearchInput
  value={keyword}
  onChange={(v: string) => setKeyword(v)}
  onSuggest={(value: string) => ALL_NAMES.filter((n) => n.startsWith(value)).slice(0, 10).map((n, i) => ({ text: n, value: i }))}
  onItemClick={(a: any, b: any) => {
    // ⚠️ API 说 (value, obj)，demo 把第一个参数当 obj；取"带 text 的那个"两边都对
    const item = a && typeof a === 'object' && 'text' in a ? a : b;
    setKeyword(item.text);
    doSearch(item.text);
  }}
/>

// 方式二：popItems + showPopUp 由业务控制（异步建议时用）
<SearchInput value={keyword} popItems={suggestions} showPopUp={showPopUp} onChange={handleChangeAsync} onClosePopup={() => setShowPopUp(false)} />
```

### 必填 / 校验 / 长度

```tsx
<SearchInput label="搜索" required hintType="tip" maxLengthInput={50}
  validator={(value: string) => ({ result: value.trim() !== '', message: '请输入关键字' })} />
```

## 3. 联动说明

- `onBlur(value)` 默认 `isBlurTrim` 去掉首尾空格 → 用回传的 value 更新 state，避免提交带空格
- `isLoading` 与列表 loading 共用同一个状态
- 大结果集建议列表：`lazySearch` 分页懒加载 + `virtualScroll`

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 Input.Search / enterButton / onPressEnter / allowClear
<Input.Search enterButton allowClear onSearch={run} />

// ❌ 假设 onSearch 只在回车触发，直接发请求 → 每敲一个字符请求一次
<SearchInput onSearch={(v) => api.search(v)} />

// ❌ popItems 与 onSuggest 同时设置（API 明确互斥）
<SearchInput popItems={items} onSuggest={suggest} />

// ❌ 盲信 onItemClick 第一个参数是 value（资料冲突未决）
<SearchInput onItemClick={(value) => setKeyword(value)} />

// ❌ 用 demo 里不在 API 表中的属性
<SearchInput enablePopup={true} />

// ❌ 清除后不重新请求，列表还停在旧结果
<SearchInput onClear={() => setKeyword('')} />
```

## 5. API 速查

> 压缩自 `SearchInput/type`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `value` | `any` | 受控文本值 |
| `placeholder` / `label` / `labelPosition` | `string` / `string` / `'before' \| 'after'`（默认 before） | 占位 / 名称 / 位置 |
| `onChange` | `(value: string) => void` | 值变化 |
| `onSearch` | `(value) => void` | 点图标 / 回车 / **值变化**时触发 |
| `onClear` | `(value) => void` | 点清除图标 |
| `onBlur` | `(value: string) => void` | 失焦，回传文本值（受 `isBlurTrim` 影响） |
| `onFocus` | `() => void` | 聚焦 |
| `popItems` | `Array<{ text, value }>` | 建议列表，与 `onSuggest` 互斥 |
| `onSuggest` | `(value) => Array<{ text, value }>` | 动态返回建议列表，与 `popItems` 互斥 |
| `showPopUp` | `boolean`，默认 `false` | 控制建议列表显隐 |
| `onItemClick` | 类型 `(value, obj)`；demo 首参为 obj | **顺序冲突未决**，按 §2 写法兼容 |
| `onClosePopup` | `() => void` | 建议列表销毁后 |
| `lazySearch` | `{ totalRecords, onLoadRecords(index) }` | 建议列表分页懒加载（每次 10 条） |
| `virtualScroll` | `boolean` | 建议列表虚拟滚动 |
| `isLoading` | `boolean`，默认 `false` | 显示加载图标 |
| `clearButton` | `boolean`，默认 `true` | 显示清除按钮 |
| `isBlurTrim` | `boolean`，默认 `true` | 失焦去首尾空格 |
| `isAllowSpaceBar` | `boolean`，默认 `true` | 是否允许输入空格 |
| `maxLengthInput` | `number` | 最大输入长度 |
| `required` / `hideRequiredMark` | `boolean`，默认 `false` | 必填 / 隐藏星号 |
| `validator` | `(value, id?, type?) => { result, message }` | 自定义校验，`result: true` 通过；另有 `SearchInput.defaultValidator.*` |
| `hintType` | `'div' \| 'tip'`，默认 `div` | 提示形式 |
| `showTip` | `boolean`，默认 `false` | 文本超长时显示提示 |
| `disabled` | `boolean`，默认 `false` | 灰化 |
| `inputProps` | `InputHTMLAttributes` | 透传给原生 input |
| `zindex` | `string`，默认 `9999` | 弹层层级 |
| `inputStyle` / `inputClassName` / `labelStyle` / `labelClassName` / `style` / `className` / `id` | — | 常规透传 |
