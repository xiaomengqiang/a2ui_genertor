# Cascader 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：官网组件页 Cascader 的 props 表（`__docs__/API.md`）及示例 `CascaderBasic.jsx` / `CascaderMultiple.jsx`；源码类型 `Cascader/type.ts`
>
> ⚠️ **eview-react 里唯一一个选项字段用 `label` 的组件**：`options=[{ label, value, children, disabled }]`，其他组件都是 `text`。不要按"eview 都用 text"的规律套。
> ⚠️ 选中值是**路径数组** `selectedValue=['jiangsu', 'nanjing', 'yuhuataiqu']`；`multiple` 时是路径数组的数组。属性名是 `selectedValue`，不是 `value`。
> ⚠️ Cascader 没有 TypeDoc 表，以官网 props 表为准；demo 里的 `showCheckedStrategy="SHOW_CHILD" | "SHOW_PARENT"` 不在表中，标待实测。

## 1. 功能定位

Cascader 是级联选择：省 / 市 / 区、目录 / 子目录这类"一级一级选到底"的层级数据，单选或多选。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 地区 / 分类逐级选择 | `Cascader` | antd `Cascader`（`value` / `fieldNames`） |
| 任意层级都可选、看整棵树 | `TreeSelect`（[TreeSelect.md](TreeSelect.md)） | Cascader `changeOnSelect` 硬凑 |
| 只有两级、且父级选项少 | 两个 `Select` 级联（[Select.md](Select.md)） | Cascader |

## 2. 典型场景

- 地址：省 / 市 / 区 单选，必须选到叶子
- 资源归属：允许选到任意一级（`changeOnSelect`）
- 多选分类：`multiple` + `multiLimit` 限制预览个数
- 编辑回填：`selectedValue` 传完整路径

## 3. 状态声明

```tsx
// 单选：一条路径
const [region, setRegion] = useState<string[]>([]);
// 多选：多条路径
const [categories, setCategories] = useState<string[][]>([]);
```

## 4. 事件与交互逻辑

```tsx
// 单选：必须选到叶子（默认）
<Cascader options={AREA} placeholder="请选择地区" selectedValue={region} onChange={(value: string[]) => setRegion(value)} />

// 允许选中任意一级（含父节点）
<Cascader options={AREA} changeOnSelect selectedValue={region} onChange={(value: string[]) => setRegion(value)} />

// 多选 + 预览个数限制
<Cascader options={CATEGORY} multiple multiLimit={2} selectedValue={categories} onChange={(value: string[][]) => setCategories(value)} selectStyle={{ width: '30rem' }} />

// 取叶子值 / 完整文本路径
const leaf = region[region.length - 1];
const labelPath = resolveLabels(AREA, region).join(' / ');   // 自己按 options 递归查 label
```

## 5. 数据结构

```tsx
// options 节点 —— 注意是 label 不是 text
interface CascaderOption {
  label: string;
  value: string | number;
  children?: CascaderOption[];
  disabled?: boolean;
}
type CascaderPath = Array<string | number>;        // 单选值
type CascaderPaths = CascaderPath[];              // multiple 值
```

## 6. 联动说明

- 地区选中 → 叶子值提交，或用路径联动其他字段（如按省份限制可选运营商）
- `changeOnSelect` 时可能只选到父级 → 提交前判断路径长度是否满足业务要求
- options 来自接口 → 加载完成再渲染；编辑回填的 `selectedValue` 路径必须在 options 中存在
- 在 `Form.Item` 内：Form 按 `name` 托管；值属性是 `selectedValue`，需 `valuePropName="selectedValue"`（推断自 Form.Item 机制，待实测）

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import Cascader from '@nce/eview-react/Cascader';
import Button from '@nce/eview-react/Button';

interface CascaderOption { label: string; value: string; children?: CascaderOption[]; disabled?: boolean; }

const AREA: CascaderOption[] = [
  { label: '江苏', value: 'jiangsu', children: [
    { label: '南京', value: 'nanjing', children: [{ label: '建邺区', value: 'jianye' }, { label: '雨花台区', value: 'yuhuatai' }] },
    { label: '苏州', value: 'suzhou', children: [{ label: '姑苏区', value: 'gusu' }] },
  ] },
  { label: '广东', value: 'guangdong', disabled: true },
];

// 递归把路径翻成文字，用于摘要展示
const labelsOf = (opts: CascaderOption[], path: string[]): string[] => {
  const out: string[] = [];
  let level = opts;
  for (const v of path) {
    const hit = level.find((o) => o.value === v);
    if (!hit) break;
    out.push(hit.label);
    level = hit.children ?? [];
  }
  return out;
};

// 地址选择：单选到叶子 + 多选分类 + 摘要与提交校验
export default function AddressPicker() {
  const [region, setRegion] = useState<string[]>([]);
  const [tags, setTags] = useState<string[][]>([]);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = () => {
    if (region.length < 3) { setMessage('请选到区一级'); return; }
    setMessage(`地区：${labelsOf(AREA, region).join(' / ')}；分类 ${tags.length} 项`);
  };

  return (
    <div style={{ width: 520, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Cascader options={AREA} placeholder="请选择省 / 市 / 区" selectedValue={region} onChange={(value: string[]) => { setRegion(value); setMessage(''); }} />
      <Cascader options={AREA} multiple multiLimit={2} placeholder="可多选" selectedValue={tags} onChange={(value: string[][]) => setTags(value)} selectStyle={{ width: '28rem' }} />
      <div className="app-field-message">{message || (region.length ? labelsOf(AREA, region).join(' / ') : '未选择')}</div>
      <div><Button status="primary" text="提交" onClick={handleSubmit} /></div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ 按 eview 其他组件的习惯写 text（Cascader 偏偏是 label）
<Cascader options={[{ text: '江苏', value: 'jiangsu' }]} />

// ❌ 值属性写 value（应为 selectedValue），或传标量（应为路径数组）
<Cascader value="nanjing" />

// ❌ antd 习惯：没有 fieldNames / loadData / displayRender / expandTrigger
<Cascader fieldNames={{ label: 'name' }} loadData={load} displayRender={(l) => l.join('/')} />

// ❌ 用 demo 里不在 props 表中的属性当作确定能力
<Cascader showCheckedStrategy="SHOW_PARENT" />   // 待实测，不能作为默认写法

// ❌ 提交时只判非空，changeOnSelect 下用户可能只选了省
if (region.length > 0) submit();
```

## 9. API 速查

> 压缩自官网 Cascader props 表。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `options` | `Array<{ label, value, children?, disabled? }>` | 级联数据，**字段是 label** |
| `selectedValue` | `string[] \| number[]`；`multiple` 时为二维数组 | 选中路径（受控） |
| `onChange` | `(value: string[] \| number[]) => void` | 选中变化 |
| `changeOnSelect` | `boolean`，默认 `false` | 单选时允许选中任意层级（含父节点） |
| `multiple` | `boolean`，默认 `false` | 多选 |
| `multiLimit` | `number` | 多选预览最多展示个数 |
| `placeholder` | `string` | 占位 |
| `disabled` | `boolean`，默认 `false` | 禁用 |
| `selectStyle` / `selectClassName` / `itemClassName` / `style` / `className` / `id` | — | 选择框 / 下拉项 / 外层样式 |
