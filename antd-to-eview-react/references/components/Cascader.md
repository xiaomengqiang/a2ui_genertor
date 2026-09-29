# Cascader 组件功能逻辑规格

> 资料来源：官网 Cascader props 表 + 示例；源码类型 `Cascader/type.ts`。
> ⚠️ **eview-react 里唯一一个选项字段用 `label` 的组件**：`options=[{ label, value, children, disabled }]`，其他组件都是 `text`。不要按"eview 都用 text"的规律套。
> ⚠️ 选中值是**路径数组** `selectedValue=['jiangsu', 'nanjing', 'yuhuataiqu']`；`multiple` 时是路径数组的数组。属性名是 `selectedValue`，不是 `value`。
> ⚠️ Cascader 没有 TypeDoc 表，以官网 props 表为准；demo 里的 `showCheckedStrategy="SHOW_CHILD" | "SHOW_PARENT"` 不在表中，**待实测**。

## 1. 功能定位

Cascader 是级联选择：省 / 市 / 区、目录 / 子目录这类"一级一级选到底"的层级数据，单选或多选。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 地区 / 分类逐级选择 | `Cascader` | antd `Cascader`（`value` / `fieldNames`） |
| 任意层级都可选、看整棵树 | `TreeSelect`（[TreeSelect.md](TreeSelect.md)） | Cascader `changeOnSelect` 硬凑 |
| 只有两级、且父级选项少 | 两个 `Select` 级联（[Select.md](Select.md)） | Cascader |

## 2. 事件与交互逻辑

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

### 选项结构（agent 必须构造，注意是 label 不是 text）

```tsx
interface CascaderOption {
  label: string;                        // 显示文字 —— Cascader 唯一用 label
  value: string | number;
  children?: CascaderOption[];
  disabled?: boolean;
}
type CascaderPath = Array<string | number>;        // 单选值
type CascaderPaths = CascaderPath[];              // multiple 值
```

## 3. 联动说明

- `changeOnSelect` 时可能只选到父级 → 提交前判断路径长度是否满足业务要求（如必须选到区一级）
- options 来自接口 → 加载完成再渲染；编辑回填的 `selectedValue` 路径必须在 options 中存在

## 4. 反面示例

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

## 5. API 速查

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
