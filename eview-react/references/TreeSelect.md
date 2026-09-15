# TreeSelect 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `TreeSelect/TreeSelect`；官网组件页 TreeSelect 及示例 `TreeSelectBasic.jsx` / `TreeSelectCheckbox.jsx`（仅 2 个 demo，事件回调在 demo 中为空实现）
>
> ⚠️ 数据属性是 **`treeData`**（不是 Select 的 `options`），节点字段沿用 Tree 的 `text` / `id` / `children`；`onChange(selectNode[])` 回传的是**选中节点对象数组** `[{ value, text, tipText }]`，不是 value 数组。
> ⚠️ 资料薄：只有基础 / 勾选两个 demo，且没演示受控 `value`。写法上按 API 表 + Tree 规律，标"待实测"。

## 1. 功能定位

TreeSelect 是下拉树选择：输入框里预览已选，下拉展开一棵 Tree，可单选或勾选多选，支持必填与校验。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表单里选组织 / 区域（层级） | `TreeSelect` | antd `TreeSelect treeData treeCheckable` |
| 页面左侧常驻的树 | `Tree`（[Tree.md](Tree.md)） | TreeSelect |
| 扁平选项 | `Select` / `MultipleSelect` | TreeSelect |
| 一级一级选（省 / 市 / 区） | `Cascader`（[Cascader.md](Cascader.md)） | TreeSelect |

## 2. 典型场景

- 新建用户表单的"所属部门"：单选
- 权限范围：`enableCheckbox` 多选勾选
- 筛选条按组织过滤：选中后列表 `page = 1` 重新请求
- 必填 + `validator`：与 TextField 一起在提交前校验

## 3. 状态声明

```tsx
// onChange 回传节点对象数组：存对象或只存 value 都行，提交时用 value
const [dept, setDept] = useState<Array<{ value: string | number; text: string }>>([]);
const deptValues = dept.map((n) => n.value);

const treeSelectRef = useRef<any>(null);   // demo 用到 ref，但未演示方法；不要假设有 validate()
```

## 4. 事件与交互逻辑

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

### 在 Form 内

```tsx
<Form.Item label="所属部门" name="dept" rules={[{ required: true }]}>
  <TreeSelect treeData={orgTree} nodeKey="id" enableMultiSelect={false} />
</Form.Item>
```

## 5. 数据结构

```tsx
// treeData 节点（与 Tree 一致）
interface TreeNode {
  id: string | number;
  text: string;
  children?: TreeNode[];
  isLeaf?: boolean;
  iconLeaf?: string; iconExpanded?: string; iconCollapsed?: string;
}
// onChange 回传项
interface SelectedNode {
  value: string | number;
  text: string;
  tipText?: string;
}
```

## 6. 联动说明

- 选中部门 → 列表按 `value` 过滤；清空 → 恢复全量
- 勾选范围数量 → 提交按钮解锁；提交时映射为 `value[]`
- 树数据来自接口 → 加载完成后再渲染 TreeSelect，避免空树闪一下
- `required` 与其他控件一起在提交前校验；本组件 demo 未演示 `ref.validate()`，用 `dept.length === 0` 派生判断

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import TreeSelect from '@nce/eview-react/TreeSelect';
import Button from '@nce/eview-react/Button';

interface TreeNode { id: string; text: string; children?: TreeNode[]; }
interface SelectedNode { value: string | number; text: string; }

const ORG: TreeNode[] = [
  { id: 'hq', text: '总部', children: [
    { id: 'rd', text: '研发部', children: [{ id: 'rd-fe', text: '前端组' }, { id: 'rd-be', text: '后端组' }] },
    { id: 'ops', text: '运维部' },
  ] },
];

// 用户归属：单选部门 + 多选可访问范围，提交前用 state 派生校验
export default function UserScopeForm() {
  const [dept, setDept] = useState<SelectedNode[]>([]);
  const [scopes, setScopes] = useState<SelectedNode[]>([]);
  const [message, setMessage] = useState<string>('');

  const canSubmit = dept.length === 1 && scopes.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) { setMessage('请选择所属部门和至少一个访问范围'); return; }
    setMessage(`部门=${dept[0].value}，范围=[${scopes.map((s) => s.value).join(', ')}]`);
  };

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TreeSelect label="所属部门" treeData={ORG} nodeKey="id" enableCheckbox={false} enableMultiSelect={false} required onChange={(nodes: SelectedNode[]) => setDept(nodes)} />
      <TreeSelect label="访问范围" treeData={ORG} nodeKey="id" enableCheckbox required onChange={(nodes: SelectedNode[]) => setScopes(nodes)} />
      <div style={{ color: 'var(--colorTextSecondary)' }}>{message}</div>
      <div><Button status="primary" text="提交" disabled={!canSubmit} onClick={handleSubmit} /></div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `TreeSelect/TreeSelect`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `treeData` | `TreeNode[]` | 下拉树数据（`text` / `id` / `children`） |
| `nodeKey` | `string` | 主键字段名 |
| `value` | `any` | 选中值（受控；demo 未演示，待实测） |
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
