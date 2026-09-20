# Select 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Select/Select`；官网组件页 Select 及示例 `selectBasic.tsx` / `SelectEvent.jsx` / `SelectClear.jsx` / `SelectDisable.jsx` / `SelectIcon.jsx` / `VirtualScroll.jsx`

## 1. 功能定位

Select 是单选下拉框：`options` 数组驱动，每项 `text` 显示、`value` 存取；支持初始选中、必填校验、清空、虚拟滚动。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 单选下拉 | `Select` + `options` | antd 的 `<Select><Option>` children、`mode` |
| 多选下拉 | `MultipleSelect`（第二批） | `Select` 加 `multiple` |
| 可输入 + 下拉建议 | `InputSelect`（第二批） | `Select` 加 `showSearch` |
| 树形下拉 | `TreeSelect`（第二批） | — |
| 级联 | `Cascader`（第二批） | — |

## 2. 典型场景

- 列表页筛选条："状态 / 类型"下拉，切换后重新拉取列表
- 表单枚举字段："区域 / 协议 / 级别"，必填校验
- 联动下拉：先选省 → 再加载市（第二个 Select 的 `options` 由第一个决定）
- 大数据量（> 100 项）下拉：开 `virtualScroll`

## 3. 状态声明

```tsx
// 受控写法（demo SelectEvent.jsx）：value 存选中项的 value，不是 text，也不是 index
const [status, setStatus] = useState<string | number | null>(null);   // null = 未选

// options 通常来自接口，用 state 存；静态枚举可直接写常量
const [regionOptions, setRegionOptions] = useState<SelectOption[]>([]);

// 需要命令式取值 / 校验 / 清空时加 ref（demo：getValue / validate / focus / clear）
const statusRef = useRef<any>(null);
```

## 4. 事件与交互逻辑

### onChange —— 五个参数 `(value, oldValue, text, oldText, event)`

```tsx
<Select
  label="状态"
  options={statusOptions}
  defaultLabel="-请选择-"                 // 占位文案（注意：不是 placeholder）
  value={status}
  onChange={(value, oldValue, text, oldText, event) => {
    setStatus(value);
    fetchList({ status: value, page: 1 });  // 筛选变化 → 回到第一页重新请求
  }}
/>
```

### 必填 + 校验 + 清空

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

## 5. 数据结构

```tsx
// options 每项结构（demos/Select/README.md：text 只支持字符串；value 支持 string/number/boolean/object，
// 为 object 时对象里必须含 key 为 value 的属性）
interface SelectOption {
  text: string;                 // 显示文字 —— 不是 label
  value: string | number | boolean | { value: any; [k: string]: any };
  icon?: string | ReactElement;  // 选项图标，默认用 icon+ 组件（SelectIcon.jsx）
  iconActive?: string | ReactElement;  // 选中态图标
  tipData?: string;             // 悬浮提示（SelectEvent.jsx）
}
```

## 6. 联动说明

- 筛选 Select 变化 → 列表 `page` 归 1 → 重新请求 → 空结果显示空态
- 省市级联：父级 `onChange` 里先 `setCity(null)`，再异步加载子级 `options`
- 表单内必填 Select → `ref.validate()` 与 TextField 一起纳入提交前统一校验
- 在 `Form.Item` 内使用时不传 `value` / `onChange`，交给 Form 按 `name` 托管
- `options` 长度 > 100 → 加 `virtualScroll`（README：数据量必须大于 100 才生效）

## 7. 完整代码示例

```tsx
import React, { useEffect, useRef, useState } from 'react';
import Select from '@nce/eview-react/Select';
import Button from '@nce/eview-react/Button';

interface SelectOption {
  text: string;
  value: string | number;
}

// 模拟接口：按区域返回站点列表；真实项目替换为已有 Service
const fetchSites = (region: string): Promise<SelectOption[]> =>
  new Promise((resolve) =>
    setTimeout(() => resolve([1, 2, 3].map((i) => ({ text: `${region}-站点${i}`, value: `${region}_${i}` }))), 300),
  );

// 区域 → 站点 两级联动 + 必填校验 + 重置
export default function SiteFilter() {
  const regionOptions: SelectOption[] = [
    { text: '华东', value: 'east' },
    { text: '华南', value: 'south' },
    { text: '华北', value: 'north' },
  ];
  const [region, setRegion] = useState<string | null>(null);
  const [site, setSite] = useState<string | null>(null);
  const [siteOptions, setSiteOptions] = useState<SelectOption[]>([]);
  const [loadingSites, setLoadingSites] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');

  const regionRef = useRef<any>(null);
  const siteRef = useRef<any>(null);

  // 区域变化：清空站点，重新加载站点列表
  useEffect(() => {
    if (!region) {
      setSiteOptions([]);
      return;
    }
    let cancelled = false;       // 防止快速切换时旧请求覆盖新结果
    setLoadingSites(true);
    fetchSites(region)
      .then((list) => {
        if (!cancelled) setSiteOptions(list);
      })
      .finally(() => {
        if (!cancelled) setLoadingSites(false);
      });
    return () => {
      cancelled = true;
    };
  }, [region]);

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setSite(null);               // 父级变了，子级选择作废
    setResult('');
  };

  const handleQuery = () => {
    const ok = regionRef.current.validate() && siteRef.current.validate();
    if (!ok) return;
    setResult(`查询：region=${region}, site=${site}`);
  };

  const handleReset = () => {
    regionRef.current.clear();
    siteRef.current.clear();
    setRegion(null);
    setSite(null);
    setResult('');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 24 }}>
      <Select
        ref={regionRef}
        label="区域"
        required
        hintType="tip"
        enableClear
        options={regionOptions}
        defaultLabel="-请选择-"
        value={region}
        onChange={handleRegionChange}
      />
      <Select
        ref={siteRef}
        label="站点"
        required
        hintType="tip"
        options={siteOptions}
        defaultLabel={loadingSites ? '加载中...' : '-请选择-'}
        disabled={!region || loadingSites}
        value={site}
        onChange={(value: string) => setSite(value)}
      />
      <Button status="primary" text="查询" onClick={handleQuery} />
      <Button text="重置" onClick={handleReset} />
      {result ? <span>{result}</span> : null}
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `api/Select_Select.md`；ref 方法仅列 README / demo 实际出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `options` | `Array<{ text, value, icon?, iconActive?, tipData? }>` | **必填**；`text` 字符串，`value` 可 string/number/boolean/object；`icon`/`iconActive` 收 `string \| ReactElement`（默认用 icon+ 组件） |
| `value` | `any`（可 `null`） | 受控选中值；按 `value` 匹配，不是 index |
| `selectedIndex` | `number` | 按 options 下标选中（VirtualScroll.jsx） |
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
