# TreeSelect 组件功能逻辑规格

> 资料来源：TypeDoc `TreeSelect/TreeSelect` + 官网 TreeSelect 页示例（仅 2 个 demo，事件回调在 demo 中为空实现）。
> ⚠️ 数据属性是 **`treeData`**（不是 Select 的 `options`），节点字段沿用 Tree 的 `text` / `id` / `children`；`onChange(selectNode[])` 回传的是**选中节点对象数组** `[{ value, text, tipText }]`，不是 value 数组。
> ⚠️ 资料薄：只有基础 / 勾选两个 demo，且没演示受控 `value`。写法上按 API 表 + Tree 规律，标"待实测"；demo 未演示 `ref.validate()`，不要假设有。

## 1. 功能定位

TreeSelect 是下拉树选择：输入框里预览已选，下拉展开一棵 Tree，可单选或勾选多选，支持必填与校验。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表单里选组织 / 区域（层级） | `TreeSelect` | antd `TreeSelect treeData treeCheckable` |
| 页面左侧常驻的树 | `Tree`（[Tree.md](Tree.md)） | TreeSelect |
| 扁平选项 | `Select` / `MultipleSelect` | TreeSelect |

## 2. 事件与交互逻辑

### 单选

```tsx
<TreeSelect
  label="所属部门"
  treeData={orgTree}                          // [{ text, id, children }]
  nodeKey="id"
  enableCheckbox={false}
  enableMultiSelect={false}                   // 默认 true，单选要关
  required
  onChange={(selectNode: Array<{ value: string | number; text: string }>) => {
    setDept(selectNode);
    fetchList({ deptId: selectNode[0]?.value, page: 1 });
  }}
/>
```

### 勾选多选

```tsx
<TreeSelect label="权限范围" treeData={orgTree} nodeKey="id" enableCheckbox onChange={(nodes) => setScopes(nodes)} />
```

### 三态图标：iconLeaf / iconExpanded / iconCollapsed 用 icon+

> 同 Tree / TreeTable，节点三态图标收 `string | ReactNode`，默认用 icon+ 组件（需成套设置）。也可在 `treeData` 单节点上覆盖。

```tsx
import { IconPlusIcPublicFile, IconPlusIcPublicFolderOpen, IconPlusIcPublicFolder } from '@nce/icon-plus';
<TreeSelect
  label="所属部门"
  treeData={orgTree}
  nodeKey="id"
  enableMultiSelect={false}
  iconLeaf={<IconPlusIcPublicFile />}
  iconExpanded={<IconPlusIcPublicFolderOpen />}
  iconCollapsed={<IconPlusIcPublicFolder />}
  onChange={(nodes) => setDept(nodes)}
/>
```

### 节点结构（agent 必须构造）

```tsx
// treeData 节点（与 Tree 一致）
interface TreeNode {
  id: string | number;
  text: string;
  children?: TreeNode[];
  isLeaf?: boolean;
  iconLeaf?: string | ReactNode; iconExpanded?: string | ReactNode; iconCollapsed?: string | ReactNode;
}
// onChange 回传项
interface SelectedNode {
  value: string | number;
  text: string;
  tipText?: string;
}
```

## 3. 联动说明

- 选中部门 → 列表按 `value` 过滤；清空 → 恢复全量；勾选范围数量 → 提交按钮解锁，提交时映射为 `value[]`
- 树数据来自接口 → 加载完成后再渲染 TreeSelect，避免空树闪一下
- `required` 与其他控件一起在提交前校验；本组件 demo 未演示 `ref.validate()`，用 `dept.length === 0` 派生判断

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 treeCheckable / multiple / treeDefaultExpandAll / onChange(value)
<TreeSelect treeData={data} treeCheckable multiple treeDefaultExpandAll onChange={(value) => setV(value)} />

// ❌ 数据属性写成 options（应为 treeData），节点字段写 title / key
<TreeSelect options={[{ title: '总部', key: 'hq' }]} />

// ❌ 把 onChange 参数当 value 数组（它是节点对象数组，要取 .value）
onChange={(nodes) => setDeptId(nodes[0])}

// ❌ 单选场景不关 enableMultiSelect（默认 true）
<TreeSelect treeData={org} onChange={(nodes) => setDept(nodes[0].value)} />

// ❌ 假设有 ref.validate()（demo 未演示）
treeSelectRef.current.validate();
```

## 5. API 速查

> 压缩自 `TreeSelect/TreeSelect`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `treeData` | `TreeNode[]` | 下拉树数据（`text` / `id` / `children`） |
| `nodeKey` | `string` | 主键字段名 |
| `value` | `any` | 选中值（受控；demo 未演示，**待实测**） |
| `onChange` | `(selectNode: Array<{ value, text, tipText }>) => void` | 选中变化，回传节点对象数组 |
| `enableCheckbox` | `boolean`，默认 `false` | 勾选多选 |
| `enableMultiSelect` | `boolean`，默认 `true` | 多选 |
| `required` / `validator` | `boolean` / `(value, id?, type?) => { result, message }` | 必填 / 自定义校验 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 名称文字 |
| `disabled` | `boolean`，默认 `false` | 灰化 |
| `optionSelectEach` | `boolean`，默认 `false` | 选中均显示 |
| `onFocus` / `onBlur` / `onOpenMultipleSelectPopup` | 回调 | 聚焦 / 失焦 / 面板开合 |
| `enableCloseIcon` / `delimiter` / `tagStyle` / `inputStyle` | — | 已选预览的关闭图标 / 分隔符 / 样式（表内无说明） |
| `selectStyle` / `selectClassName` / `popUpStyle` / `popUpClassName` / `labelStyle` / `style` / `className` / `id` | — | 样式与标识 |
