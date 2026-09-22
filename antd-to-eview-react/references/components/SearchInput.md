# SearchInput 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `SearchInput/type`；官网组件页 Search 及示例 `Basic.tsx` / `Disabled.tsx` / `Validator.tsx` / `SearchItems.jsx`
>
> ⚠️ `onSearch` 的触发时机按 API 表是"点击搜索图标、按回车、**或文本值变化**"三种 —— 所以放在 `onSearch` 里的请求必须防抖 / 防重复，不要假设它只在回车时触发。
> ⚠️ **资料冲突**：`onItemClick` 类型为 `(value, obj)`，但 demo `SearchItems.jsx` 的处理函数把**第一个参数**当成选项对象用（`obj.value` / `obj.text`）。§4 给出两种情况都成立的写法，已登记待实测。
> ⚠️ demo 里的 `enablePopup={true}` 不在 API 表中，不要使用。

## 1. 功能定位

SearchInput 是带搜索图标、清除按钮、可选建议下拉的搜索框，可做必填与校验。列表页顶部的关键字搜索用它，不要用 TextField 拼图标。

| 想要的效果 | 用什么 |
|-----------|--------|
| 关键字搜索（回车 / 点图标触发） | `SearchInput` |
| 带建议列表的搜索 | `SearchInput` + `popItems` / `onSuggest` |
| 普通文本输入、有 label 的表单字段 | `TextField`（[TextField.md](TextField.md)） |
| 可输入 + 固定选项的下拉 | `InputSelect`（第二批） |

## 2. 典型场景

- 列表页搜索条：输入关键字 → 回车 / 点图标 → 列表回第一页重新请求；清除 → 恢复全量
- 搜索建议：输入时根据关键字返回前 10 条匹配项（`onSuggest`），点击建议项直接搜索
- 大结果集建议列表：`lazySearch` 分页懒加载 + `virtualScroll`
- 必填搜索框（`required` + `hintType="tip"`）或限制最大长度（`maxLengthInput`）

## 3. 状态声明

```tsx
const [keyword, setKeyword] = useState<string>('');           // 受控值
const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
const [showPopUp, setShowPopUp] = useState<boolean>(false);   // 建议列表显隐（用 popItems 时由业务控制）
const [searching, setSearching] = useState<boolean>(false);   // 映射到 isLoading
```

## 4. 事件与交互逻辑

### 基础搜索：onSearch 防抖，onClear 恢复

```tsx
const timerRef = useRef<any>(null);
const versionRef = useRef<number>(0);

const doSearch = (value: string) => {
  clearTimeout(timerRef.current);
  timerRef.current = setTimeout(async () => {
    const my = ++versionRef.current;                 // 版本号：丢弃过期响应
    setSearching(true);
    try {
      const list = await api.search({ keyword: value.trim(), page: 1 });
      if (my === versionRef.current) setRows(list);
    } finally {
      if (my === versionRef.current) setSearching(false);
    }
  }, 300);
};

<SearchInput
  label="搜索"
  placeholder="名称 / IP"
  value={keyword}
  isLoading={searching}
  onChange={(value: string) => setKeyword(value)}
  onSearch={(value: string) => doSearch(value)}     // 图标 / 回车 / 值变化都会进来，已防抖
  onClear={() => {
    setKeyword('');
    doSearch('');                                     // 清空后恢复全量
  }}
/>
```

### 建议下拉：popItems（业务控制）或 onSuggest（组件按返回值渲染），二者互斥

```tsx
// 方式一：onSuggest 同步返回匹配项（demo SearchItems.jsx 的 findMatchedResult 思路）
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

### 必填 / 校验 / 长度（demo Validator.tsx）

```tsx
<SearchInput label="搜索" required hintType="tip" maxLengthInput={50}
  validator={(value: string) => ({ result: value.trim() !== '', message: '请输入关键字' })} />
```

## 5. 数据结构

```tsx
// popItems / onSuggest 返回项（api：[{ text, value }]）
interface SuggestItem {
  text: string;
  value: string | number;
}

// 搜索请求参数：关键字变化时页码归 1
interface SearchQuery {
  keyword: string;
  page: number;
}
```

## 6. 联动说明

- 搜索触发 → 列表 `page = 1` → 请求 → loading → 空结果显示"未找到与 xxx 相关的结果"
- 与筛选 Select 组合：任一变化都重新请求，请求参数合并 `{ keyword, status, page: 1 }`
- 点击建议项 → 回填 `keyword` → 立即搜索，并关闭建议列表
- `onBlur(value)` 默认 `isBlurTrim` 去掉首尾空格 → 用回传的 value 更新 state，避免提交带空格
- `isLoading` 与列表 loading 共用同一个状态

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import SearchInput from '@nce/eview-react/SearchInput';

interface Device {
  id: string;
  name: string;
  ip: string;
}

const ALL: Device[] = [
  { id: '1', name: 'core-sw-01', ip: '10.0.0.1' },
  { id: '2', name: 'core-sw-02', ip: '10.0.0.2' },
  { id: '3', name: 'edge-rt-01', ip: '10.0.1.1' },
];

// 设备搜索：防抖 + 版本号防串 + 建议下拉 + 空态
export default function DeviceSearch() {
  const [keyword, setKeyword] = useState<string>('');
  const [rows, setRows] = useState<Device[]>(ALL);
  const [searching, setSearching] = useState<boolean>(false);
  const timerRef = useRef<any>(null);
  const versionRef = useRef<number>(0);

  // 模拟接口；真实项目替换为已有 Service
  const fetchDevices = (kw: string): Promise<Device[]> =>
    new Promise((resolve) =>
      setTimeout(() => resolve(ALL.filter((d) => d.name.includes(kw) || d.ip.includes(kw))), 300),
    );

  const doSearch = (value: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const my = ++versionRef.current;
      setSearching(true);
      try {
        const list = await fetchDevices(value.trim());
        if (my === versionRef.current) setRows(list);
      } finally {
        if (my === versionRef.current) setSearching(false);
      }
    }, 300);
  };

  const handleItemClick = (a: any, b: any) => {
    const item = a && typeof a === 'object' && 'text' in a ? a : b;   // 兼容两种参数顺序
    setKeyword(item.text);
    doSearch(item.text);
  };

  return (
    <div style={{ width: 520, padding: 24 }}>
      <SearchInput
        label="搜索设备"
        placeholder="名称或 IP"
        value={keyword}
        isLoading={searching}
        maxLengthInput={50}
        onChange={(value: string) => setKeyword(value)}
        onSearch={doSearch}
        onBlur={(value: string) => setKeyword(value)}     // isBlurTrim 默认 true，回传已去空格
        onClear={() => {
          setKeyword('');
          doSearch('');
        }}
        onSuggest={(value: string) =>
          value ? ALL.filter((d) => d.name.startsWith(value)).slice(0, 10).map((d) => ({ text: d.name, value: d.id })) : []
        }
        onItemClick={handleItemClick}
      />

      <div style={{ marginTop: 16 }}>
        {searching ? <div>搜索中...</div> : null}
        {!searching && rows.length === 0 ? <div style={{ color: '#939393' }}>未找到与「{keyword}」相关的设备</div> : null}
        {!searching &&
          rows.map((d) => (
            <div key={d.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              {d.name} — {d.ip}
            </div>
          ))}
      </div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `api/SearchInput_type.md`。

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
| `onItemClick` | 类型 `(value, obj)`；demo 首参为 obj | **顺序冲突未决**，按 §4 写法兼容 |
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
