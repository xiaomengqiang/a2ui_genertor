# TreeSelector 组件功能逻辑规格（树形下拉）

> 导入：`import TreeSelector from '@/shared/TreeSelector'`（scaffold 包壳，透明转发 `@nce/eview-react/TreeSelector`，API 不变）。

> ⚠️ 使用 `TreeSelector`，数据为 `treeData=[{ id, text, children? }]`。默认单选，单选 `value` 是节点 **id 字符串**；通过 `enableCheckbox` 开启多选，不沿用旧 TreeSelect 的属性和对象数组回调。
> ⚠️ 外部修改 `value` 的示例与说明只确认了**单选**；多选受控、回填和清空契约仍待验证。不要套用旧 TreeSelect 的 key / revision 重建规则。
> ⚠️ 当前发布包入口与实际实现尚未核验。使用前只读目标工程相关 `.d.ts`，核对 `@nce/eview-react/TreeSelector` 的默认导出与所需属性；类型检查通过不代表运行行为已验证。

## 1. 功能定位

TreeSelector 是带下拉树的选择输入框，用于部门、组织、资源范围等层级数据的单选或勾选多选。

| 想要的效果 | 用什么 | 使用边界 |
|-----------|--------|----------|
| 表单里选择一个部门 | `TreeSelector treeData value` | 单选值为 id 字符串 |
| 下拉树勾选多个节点 | `TreeSelector enableCheckbox` | 不保证外部回填 / 完全受控 |
| 页面中常驻树 | [Tree](Tree.md) | 使用 Tree 的独立事件契约 |
| 扁平选项 | [Select](Select.md) / [MultipleSelect](MultipleSelect.md) | 不需要树结构 |

## 2. 典型场景

- 编辑用户所属部门：加载树和已保存的非空 id，单选后提交业务 id。
- 资源范围选择：`enableCheckbox` 开启多选，核对实际回调后保存合法 id 集合。
- 父节点也允许选择：单选时设置 `isClickableNonLeaf`。
- 必填、禁用、可清除：分别使用 `required`、`disabled`、`clearable`；清除事件的空值形态未确认。

## 3. 状态声明

```tsx
// 单选展示值采用已经存在于 treeData 的非空 id
const [value, setValue] = useState<string>('31');
// 可提交业务值与展示分开：未知回调必须使业务选择失效
const [deptId, setDeptId] = useState<string | null>('31');
const [error, setError] = useState('');

// 多选业务结果，不据此承诺可以通过 value 回填多选组件
const [scopeIds, setScopeIds] = useState<string[]>([]);
```

## 4. 事件与交互逻辑

### 单选与外部回填

```tsx
<TreeSelector
  treeData={departments}
  label="所属部门"
  value={value}
  expandedKeys={['1']}
  required onlySelect
  onChange={handleDepartmentChange}
/>
// 非空 id 的外部回填：先确认该 id 存在，再更新业务值与展示值
setValue('23');
setDeptId('23');
```

默认单选；非叶节点默认用于展开 / 收起。`isClickableNonLeaf={true}` 才允许点击非叶节点改变目标值，仅适用于单选。`onlySelect` 也仅适用于单选：输入用于过滤，失焦清掉未从下拉项选定的输入文字；不要把搜索文字当提交 id。

### 回调冲突与输入校验

TypeDoc 声明 `onChange(value: string | string[], checkedKeys?: string[])`；旧注释写对象数组，部分示例把第二参命名为 `oldValue`。这些内容互相冲突，当前没有实现核验；本页以 TypeDoc 签名组织代码，**不推断第二参是旧值，也不把对象数组默认为正确结果**。接收第一参时用 `unknown`，按当前模式及业务 id 白名单检查，§7 演示单选处理。

多选可使用以下检查；`knownIds` 应从当前树的合法业务节点建立，不能只判断“是数组”。

```tsx
const handleScopeChange = (raw: unknown) => {
  if (!Array.isArray(raw) || !raw.every((id: unknown) => typeof id === 'string' && knownIds.has(id))) {
    setScopeIds([]);
    setError('选择结果格式不符合当前约定，请重新选择并核对组件版本');
    return;
  }
  setScopeIds(raw);
  setError('');
};
<TreeSelector treeData={resourceTree} enableCheckbox onChange={handleScopeChange} />
```

该检查只校验实际收到的数据，不承诺清除按钮会发出 `[]`，也不证明 `value={scopeIds}` 能同步多选面板。业务要求至少选一项时，还要在提交前检查 `scopeIds.length`。

`onSearch(value: string)` 接收搜索文本；`onFocus` 声明为焦点事件。`onBlur` 的 TypeDoc 为 `(value: string, checkedKeys?: string[])`，旧注释却写 event；未核验前不读取 `event.target` 或依赖第二参语义。

### 清除、Form 与 ref

`clearable` 有展示清除能力的示例，但清除后的回调参数、外部传 `'' / [] / undefined` 的效果未确认，不能据此编写通用清空适配。当前页完整示例使用非空回填，不依赖清空值。

Form 托管组合尚未验证；不要直接把旧 TreeSelect 的对象数组转换或重建逻辑搬来。现有 ref 示例只保存实例，没有方法调用证据；是否提供 `getValue / validate / clear / focus` 及其签名须核对目标声明，既不推荐猜用，也不宣称不存在。

## 5. 数据结构

```tsx
interface DepartmentNode {
  id: string;                 // 示例统一用字符串，value 与它对应
  text: string;
  children?: DepartmentNode[];
  isLeaf?: boolean;
  iconLeaf?: string;          // 图片 URL；没有据此使用 JSX 图标
  iconExpanded?: string;
  iconCollapsed?: string;
}
type DeclaredValue = string | string[];
```

不传 `treeData` 或传 `[]` 时显示空数据。`treeData` 的原声明较宽，业务应明确自己的节点结构；`nodeKey` 仅描述为“过滤树的字段名”，不要据此改用 `title/key` 或假定自定义选中主键已验证。

## 6. 联动说明

- 异步加载：树数据与已保存 id 都就绪、且 id 在树内时再渲染编辑控件。
- 外部切换记录：单选更新合法非空 id；同时更新可提交业务值、清理旧错误与提交结果。
- 未知回调：清掉可提交业务值并显示错误；在清空契约未确认时，可保留最后一个合法展示值，但不能继续提交它。
- 业务校验：`required` 提供组件必填能力；提交仍检查 id 是否允许、是否已确认，服务端继续做权限和有效性校验。
- 多选：`showLeafText` 影响展示；`checkedkeysFromOrigin` 影响过滤后的 checkedKeys 计算，不能据此推断回调第二参的完整语义或多选回填能力。

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import TreeSelector from '@/shared/TreeSelector';
import Button from '@nce/eview-react/Button';

interface DepartmentNode { id: string; text: string; children?: DepartmentNode[]; }
const DEPARTMENTS: DepartmentNode[] = [
  { id: '1', text: '总部', children: [
    { id: '31', text: '研发一部' }, { id: '23', text: '研发二部' },
  ] },
];
const ALLOWED_IDS = new Set(['31', '23']);

export default function DepartmentEditor({ onSave }: { onSave: (id: string) => Promise<void> }) {
  const [value, setValue] = useState('31');
  const [deptId, setDeptId] = useState<string | null>('31');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (raw: unknown) => {
    setMessage('');
    if (typeof raw !== 'string' || !ALLOWED_IDS.has(raw)) {
      setDeptId(null); // 禁止未知结果后悄悄提交上一次选择
      setError('选择结果未确认，请重新选择部门或重新载入已保存部门');
      return;
    }
    setValue(raw); setDeptId(raw); setError('');
  };
  const loadDepartment = (id: string) => {
    if (!ALLOWED_IDS.has(id)) {
      setDeptId(null); setMessage(''); setError('已保存部门不在当前可选范围');
      return;
    }
    setValue(id); setDeptId(id); setError(''); setMessage('');
  };
  const submit = async () => {
    if (saving) return;
    if (!deptId || error || !ALLOWED_IDS.has(deptId)) {
      setError('请先确认一个可用部门'); return;
    }
    setSaving(true); setMessage('');
    try {
      await onSave(deptId); // 调用业务层保存接口
      setMessage('部门已保存');
    } catch {
      setMessage('保存失败，请重试');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ width: 480, padding: 24 }}>
      <TreeSelector treeData={DEPARTMENTS} label="所属部门" value={value}
        expandedKeys={['1']} required onlySelect clearable={false}
        disabled={saving} onChange={handleChange} />
      {error && <div role="alert">{error}</div>}
      <div style={{ marginTop: 16 }}>
        <Button text="保存" status="primary" disabled={saving || deptId === null || !!error} onClick={submit} />
        <Button text="载入研发二部" disabled={saving} onClick={() => loadDepartment('23')} style={{ marginLeft: 12 }} />
      </div>
      {message && <div role="status">{message}</div>}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 开关：不能照搬 multiple / treeCheckable / treeDefaultExpandAll
<TreeSelector treeData={data} multiple treeCheckable treeDefaultExpandAll />

// ❌ antd 节点字段：本页节点为 text / id，不是 title / value
<TreeSelector treeData={[{ title: '研发部', value: '31' }]} />

// ❌ antd labelInValue：不能据此把单选 value 传成标签对象
<TreeSelector labelInValue value={{ value: '31', label: '研发部' }} />

// ❌ 沿用旧 TreeSelect 的属性和单选数组值
<TreeSelector enableMultiSelect={false} value={['31']} optionSelectEach />

// ❌ 把对象数组注释或第二参名称当已核验运行契约
onChange={(nodes, oldValue) => save(nodes[0].value, oldValue)}

// ❌ 未经验证就让多选 value 回写，并承诺 [] 能完整清空
<TreeSelector enableCheckbox value={ids} onChange={setIds} />
```

## 9. API 速查

以下按现有 TypeDoc 组织；宽泛的 restprop 声明不能作为新增属性的功能证据。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `treeData` | 原声明 `any`；业务用节点数组 | `id / text / children`；省略或 [] 为空数据 |
| `value` | `string \| string[]` | 单选用 id 字符串；外部改值仅单选有明确示例 |
| `onChange` | `(value: string \| string[], checkedKeys?: string[]) => void` | 注释 / 示例冲突，接收时检查实际形态，见 §4 |
| `enableCheckbox` | `boolean` | 开启多选；默认使用单选 |
| `clearable` | `boolean` | 显示清除能力；清除事件及空值契约未确认 |
| `required` / `disabled` | `boolean`，默认 false | 必填 / 灰化 |
| `expandedKeys` | `string[]` | 默认展开项；不承诺完全受控展开 |
| `isClickableNonLeaf` | `boolean`，默认 false | 非叶节点可选，仅单选 |
| `onlySelect` | `boolean`，默认 false | 仅单选；输入用于过滤，失焦清掉未选定输入 |
| `showLeafText` | `boolean`，默认 false | 多选时只显示叶子文本；默认全选子节点时显示父文本 |
| `checkedkeysFromOrigin` | `boolean`，默认 false | 过滤后根据原始数据获取 checkedKeys |
| `isTag` | `boolean`，默认 false | 标签形式展示 |
| `onSearch` | `(value: string) => void` | 搜索文本变化 |
| `onFocus` | `(event: React.FocusEvent) => void` | 聚焦 |
| `onBlur` | `(value: string, checkedKeys?: string[]) => void` | 与旧 event 注释冲突，不按原生事件使用 |
| `nodeKey` | `string` | 过滤树的字段名；自定义选中主键未确认 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`，默认 before | 名称及位置 |
| `hintType` / `focusTip` | `'div' \| 'tip'` / `string` | 校验提示方式 / 聚焦提示 |
| `zindex` | `string`，默认 `'9999'` | 弹层层级，属性是小写 i |
| `labelClassName` / `selectClassName` / `popUpClassName` | `string` | 名称 / 选择框 / 弹层类名 |
| `labelStyle` / `selectStyle` / `popUpStyle` | `React.CSSProperties` | 对应部分样式 |
| `id` / `className` / `style` | `string` / `string` / `React.CSSProperties` | 外层标识与样式 |
