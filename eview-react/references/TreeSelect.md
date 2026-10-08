# TreeSelect 组件功能逻辑规格

> ⚠️ 数据属性是 **`treeData`**（不是 Select 的 `options`），节点字段为 `text` / `id` / `children`，选中匹配固定用 `id`；`onChange(selectNode[])` 回传**节点对象数组**，其中 `value` 是显示文案，业务标识取 `id`。
> ⚠️ 单选、多选的 `value` 都是 **id 数组**。已核验：单改 value 不更新树节点高亮 / 勾选，文字还可能丢失；单传 `[]` 只清文字，不清树。外部回填 / 重置须配合 key 重建，不能称为完全受控。

## 1. 功能定位

TreeSelect 是下拉树选择：输入框里预览已选，下拉展开一棵 Tree，可单选或勾选多选，支持必填与校验。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表单里选组织 / 区域（层级） | `TreeSelect` | antd `TreeSelect treeData treeCheckable` |
| 页面左侧常驻的树 | `Tree`（[Tree.md](Tree.md)） | TreeSelect |
| 扁平选项 | `Select` / `MultipleSelect` | TreeSelect |
| 一级一级选（省 / 市 / 区） | 先核实目标包是否有 `Cascader`（[版本限制](Cascader.md)） | 直接假设组件存在 |

## 2. 典型场景

- 新建用户表单的"所属部门"：单选
- 权限范围：`enableCheckbox` 多选勾选
- 筛选条按组织过滤：选中后列表 `page = 1` 重新请求
- 必填 + `validator`：与 TextField 一起在提交前校验

## 3. 状态声明

```tsx
// onChange 的 value 是文案；保存对象后用 id 提交或回填
const [dept, setDept] = useState<Array<{ id: string | number; value: string; text: string }>>([]);
const deptIds = dept.map((n) => n.id);
const [revision, setRevision] = useState(0); // 只在外部替换、回填或清空时递增

const treeSelectRef = useRef<any>(null);   // demo 用到 ref，但未演示方法；不要假设有 validate()
```

## 4. 事件与交互逻辑

### 单选

```tsx
<TreeSelect
  label="所属部门"
  treeData={orgTree}                          // [{ text, id, children }]
  enableCheckbox={false}
  enableMultiSelect={false}                   // 默认 true，单选要关
  required
  onChange={(selectNode: Array<{ id: string | number; value: string; text: string }>) => {
    setDept(selectNode);
    fetchList({ deptId: selectNode[0]?.id, page: 1 });
  }}
/>
```

### 勾选多选

```tsx
<TreeSelect label="权限范围" treeData={orgTree} enableCheckbox onChange={(nodes) => setScopes(nodes)} />
```

### 回填 / 清空与 Form 边界

单选和多选均以 id 数组回填。单改 `[A] → [B]` 只同步内部 value，树的高亮 / 勾选停留在旧值；重建选项时丢失 id 还会清空文字。`value={[]}` 仅清输入文字，树上的旧勾选仍在；`null` / `undefined` / `''` 也不能可靠清空。

外部替换记录、异步回填或清空时，同步保存目标 id 数组并递增业务 `revision`，渲染 `key={revision}` 的新实例，回填传 `value={recordIds}`，清空传 `value={[]}`（非受控示例可直接重建）。`recordIds` 是外部回填快照；不要把每次 onChange 当作外部替换而递增 revision，否则会关闭面板、打断连续勾选。普通 onChange 只更新业务选择结果；不要逐次回写 value 并期待其稳定同步。

Form 默认把 onChange 第一参直接回填，而本组件返回对象数组、value 要 id 数组，不能直接套普通 `Form.Item` 托管示例。转换适配、key 重建与 Form 值 / 错误同步的组合尚未核实；没有可据此推荐的手动 clear API。

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
  id: string | number;          // 回填与提交取此字段
  value: string;                 // text 或多选汇总文案，如 [父:子]
  text: string;
  tipText?: string;
}
```

## 6. 联动说明

- 选中部门 → 列表按 `id` 过滤；外部清空 → 同步清业务选择结果并递增 revision 重建组件，再恢复全量
- 勾选范围数量 → 提交按钮解锁；提交时映射为 `id[]`
- 树数据来自接口 → 加载完成后再渲染 TreeSelect，避免空树闪一下
- `required` 与其他控件一起在提交前校验；本组件 demo 未演示 `ref.validate()`，用 `dept.length === 0` 派生判断

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import TreeSelect from '@nce/eview-react/TreeSelect';
import Button from '@nce/eview-react/Button';

interface TreeNode { id: string; text: string; children?: TreeNode[]; }
interface SelectedNode { id: string | number; value: string; text: string; }

const ORG: TreeNode[] = [
  { id: 'hq', text: '总部', children: [
    { id: 'rd', text: '研发部', children: [{ id: 'rd-fe', text: '前端组' }, { id: 'rd-be', text: '后端组' }] },
    { id: 'ops', text: '运维部' },
  ] },
];

// 非受控选择：onChange 只存业务结果；外部重置才重建实例
export default function UserScopeForm() {
  const [dept, setDept] = useState<SelectedNode[]>([]);
  const [scopes, setScopes] = useState<SelectedNode[]>([]);
  const [message, setMessage] = useState<string>('');
  const [revision, setRevision] = useState(0);
  const resetSelection = () => {
    setDept([]); setScopes([]); setMessage('');
    setRevision((current) => current + 1); // 清掉文字和树状态，不只改 value=[]
  };

  const canSubmit = dept.length === 1 && scopes.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) { setMessage('请选择所属部门和至少一个访问范围'); return; }
    setMessage(`部门=${dept[0].id}，范围=[${scopes.map((s) => s.id).join(', ')}]`);
  };

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TreeSelect key={`dept-${revision}`} label="所属部门" treeData={ORG} enableCheckbox={false} enableMultiSelect={false} required onChange={(nodes: SelectedNode[]) => setDept(nodes)} />
      <TreeSelect key={`scopes-${revision}`} label="访问范围" treeData={ORG} enableCheckbox required onChange={(nodes: SelectedNode[]) => setScopes(nodes)} />
      <div className="app-field-message">{message}</div>
      <div>
        <Button status="primary" text="提交" disabled={!canSubmit} onClick={handleSubmit} />
        <Button text="重置" onClick={resetSelection} style={{ marginLeft: 12 }} />
      </div>
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

// ❌ 把 onChange 参数当 id 数组（它是节点对象数组，要取 .id，.value 是文案）
onChange={(nodes) => setDeptId(nodes[0])}

// ❌ 单选场景不关 enableMultiSelect（默认 true）
<TreeSelect treeData={org} onChange={(nodes) => setDept(nodes[0].value)} />

// ❌ 外部重置只改 value=[]，树上的旧勾选没有清掉
<TreeSelect treeData={org} value={[]} />

// ❌ 每次 onChange 都换 key，打断面板内的连续选择
<TreeSelect key={revision} treeData={org} onChange={() => setRevision((r) => r + 1)} />

// ❌ 假设有 ref.validate()（demo 未演示）
treeSelectRef.current.validate();
```

## 9. API 速查

> 压缩自 `TreeSelect/TreeSelect`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `treeData` | `TreeNode[]` | 下拉树数据（`text` / `id` / `children`） |
| `nodeKey` | `string`（旧声明） | 当前实现未下传到树，匹配固定用 id；不要依赖自定义主键 |
| `value` | `Array<string \| number>` | 单选、多选均为 id 数组；单改值不能同步树，[] 仅清文字；外部回填 / 清空须配合 key 重建，见 §4 |
| `onChange` | `(selectNode: Array<{ id, value, text, tipText? }>) => void` | value 为文案（可能为汇总文案），回填和业务标识取 id |
| `enableCheckbox` | `boolean`，默认 `false` | 勾选多选 |
| `enableMultiSelect` | `boolean`，默认 `true` | 多选 |
| `required` / `validator` | `boolean` / `(value, id?, type?) => { result, message }` | 必填 / 自定义校验 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 名称文字 |
| `disabled` | `boolean`，默认 `false` | 灰化 |
| `optionSelectEach` | `boolean`，默认 `false` | 选中均显示 |
| `onFocus` / `onBlur` / `onOpenMultipleSelectPopup` | 回调 | 聚焦 / 失焦 / 面板开合 |
| `enableCloseIcon` / `delimiter` / `tagStyle` / `inputStyle` | — | 已选预览的关闭图标 / 分隔符 / 样式（表内无说明） |
| `selectStyle` / `selectClassName` / `popUpStyle` / `popUpClassName` / `labelStyle` / `style` / `className` / `id` | — | 样式与标识 |
