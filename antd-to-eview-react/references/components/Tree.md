# Tree 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Tree/Tree`；官网组件页 Tree 及示例 `TreeExample.jsx` / `TreeAsync.jsx` / `TreeSearchDemo.jsx` / `TreeSearchAPIWithCallbackDemo.jsx` / `TreeExpandCollapseDemo.jsx` / `TreeSingleExpand.jsx` / `TreeCancelLinkage.jsx` / `TreeVirtualScroll.jsx`（共 20 个 demo，本文只覆盖高频能力）
>
> ⚠️ 节点数据字段是 **`text` + `id` + `children`**（不是 antd 的 `title` / `key`），`nodeKey="id"` 指定主键字段名；三个受控数组 `selectedKeys` / `checkedKeys` / `expandedKeys` 各自配对回调 `onSelect` / `onCheck` / `onExpand`，回调第一个参数就是新的 keys 数组。
> ⚠️ 回调里的 `node` 是节点组件对象，主键取 **`node.props.eventKey`**（demo 写法），不是 `node.id`。
> ⚠️ demo 里出现的 `checkable={true}` 不在 API 表中；勾选框用 **`enableCheckbox`**。`enableMultiSelect` 默认 **true**，单选场景要显式关掉。

## 1. 功能定位

Tree 是层级数据展示与选择：选中 / 勾选 / 展开三套受控状态，支持异步加载子节点、连线、虚拟滚动、搜索定位、拖拽（顺序更新需自行处理）。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 左侧组织 / 区域导航树 | `Tree` 单选（`enableMultiSelect={false}`）+ `onSelect` | antd `Tree treeData` |
| 权限 / 资源勾选树 | `Tree enableCheckbox` + `checkedKeys` + `onCheck` | 自己递归渲染 Checkbox |
| 表单里选树节点 | `TreeSelect`（[TreeSelect.md](TreeSelect.md)） | Tree 塞进下拉 |
| 层级数据 + 多列 | `TreeTable`（[TreeTable.md](TreeTable.md)） | Tree 拼列 |

## 2. 典型场景

- 组织架构导航：点节点 → 右侧列表按组织过滤；默认展开前两级
- 权限分配：勾选父子联动（默认），`checkedKeys` 提交
- 大树懒加载：`loadData(itemData, callback)` 展开时才拉子节点
- 搜索定位：`ref.findLevelNodes(value)` 找到路径 → 写回 `expandedKeys`

## 3. 状态声明

```tsx
// 三套 keys 分开存，值类型与 data[].id 一致
const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
const [checkedKeys, setCheckedKeys] = useState<Array<string | number>>([]);
const [expandedKeys, setExpandedKeys] = useState<Array<string | number>>([1]);

// 树数据：可变（懒加载 / 增删节点）时放 state
const [treeData, setTreeData] = useState<TreeNode[]>(initialTree);

const treeRef = useRef<any>(null);   // 搜索定位用 findLevelNodes
```

## 4. 事件与交互逻辑

### 单选导航树（enableMultiSelect 关掉）

```tsx
<Tree
  data={treeData}
  nodeKey="id"
  enableMultiSelect={false}
  selectedKeys={selectedKeys}
  expandedKeys={expandedKeys}
  connectLine
  onSelect={(keys: Array<string | number>, node: any, event) => {
    setSelectedKeys(keys);
    loadList({ orgId: keys[0], page: 1 });          // 联动右侧列表
  }}
  onExpand={(keys: Array<string | number>, node: any) => setExpandedKeys(keys)}
/>
```

### 勾选树（父子联动默认开）

```tsx
<Tree
  data={treeData}
  nodeKey="id"
  enableCheckbox
  checkedKeys={checkedKeys}
  expandedKeys={expandedKeys}
  onCheck={(keys: Array<string | number>, node: any, checkedNodes?: any[]) => setCheckedKeys(keys)}
  onExpand={(keys: Array<string | number>) => setExpandedKeys(keys)}
  disabelCheckAssociated={false}      // 取消父子联动时用（属性名官方即如此拼）
/>
```

### 异步加载子节点（demo TreeAsync.jsx）

```tsx
<Tree
  data={treeData}
  nodeKey="id"
  loadData={(itemData: any, callback: (children: TreeNode[]) => void) => {
    api.children(itemData.id).then((list) => callback(list));   // 收起态展开时触发；无子节点 callback([])
  }}
/>
// 想让节点显示展开箭头，data 里标 isLeaf: false
```

### 搜索定位（demo TreeSearchAPIWithCallbackDemo.jsx）

```tsx
<SearchInput onSearch={(value: string) => {
  const nodes = treeRef.current.findLevelNodes(value);             // 返回匹配节点及其祖先
  setExpandedKeys(nodes.map((n: any) => n.id));
}} onClear={() => setExpandedKeys([1])} />
<Tree ref={treeRef} … />
```

### 三态图标：iconLeaf / iconExpanded / iconCollapsed 用 icon+

```tsx
import { IconPlusIcPublicFile, IconPlusIcPublicFolderOpen, IconPlusIcPublicFolder } from '@nce/icon-plus';
<Tree
  data={treeData}
  nodeKey="id"
  iconLeaf={<IconPlusIcPublicFile />}
  iconExpanded={<IconPlusIcPublicFolderOpen />}
  iconCollapsed={<IconPlusIcPublicFolder />}
  …
/>
// 三态需成套设置；同名属性也可在节点数据里单节点覆盖
```

## 5. 数据结构

```tsx
// Tree.data 节点（api data 描述）
interface TreeNode {
  id: string | number;            // 主键，字段名可由 nodeKey 改
  text: string;                   // 显示文本 —— 不是 title
  children?: TreeNode[];
  tip?: string;                   // 悬浮提示
  isLeaf?: boolean;               // false 表示还有子节点（懒加载时用）
  expanded?: boolean;             // 单节点展开态，权重高于 expandedKeys
  disabled?: boolean;
  draggable?: boolean;
  show?: boolean;                 // false 隐藏节点
  hideRootCheckbox?: boolean;     // 隐藏该节点复选框
  iconLeaf?: string | React.ReactNode;   // 单节点图标，同名属性也可全局设
}
```

## 6. 联动说明

- `onSelect` → 右侧列表 / 详情按 `keys[0]` 重新请求，`page = 1`
- `onCheck` → 提交按钮解锁，文案显示已选数量；提交时用 `checkedKeys`（含联动勾上的父节点，按业务过滤叶子）
- 搜索 → `findLevelNodes` → `expandedKeys` 展开路径；清空搜索恢复默认展开
- 懒加载：`loadData` 的 `callback` 只负责挂子节点；同时把新节点 id 加进 `expandedKeys`
- 大树（数千节点）→ 传 `height` 开虚拟滚动（3.9.24），或 `lazyLoad` 不渲染未展开子树

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import Tree from '@nce/eview-react/Tree';
import SearchInput from '@nce/eview-react/SearchInput';

interface TreeNode {
  id: string;
  text: string;
  children?: TreeNode[];
}

const ORG: TreeNode[] = [
  { id: 'hq', text: '总部', children: [
    { id: 'rd', text: '研发部', children: [{ id: 'rd-fe', text: '前端组' }, { id: 'rd-be', text: '后端组' }] },
    { id: 'ops', text: '运维部', children: [{ id: 'ops-net', text: '网络组' }] },
  ] },
];

// 组织架构：左侧单选树（搜索定位 + 默认展开）→ 右侧按组织加载成员
export default function OrgTreePage() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['hq']);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['hq']);
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const treeRef = useRef<any>(null);

  const loadMembers = async (orgId: string) => {
    setLoading(true);
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 200));
      setMembers([`${orgId}-张三`, `${orgId}-李四`]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    if (!value) { setExpandedKeys(['hq']); return; }
    const nodes = treeRef.current?.findLevelNodes(value) ?? [];
    setExpandedKeys(nodes.map((n: any) => n.id));
  };

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <div style={{ width: 260 }}>
        <SearchInput placeholder="搜索组织" onSearch={handleSearch} onClear={() => setExpandedKeys(['hq'])} />
        <Tree
          ref={treeRef}
          data={ORG}
          nodeKey="id"
          enableMultiSelect={false}
          connectLine
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={(keys: string[]) => {
            setSelectedKeys(keys);
            if (keys[0]) loadMembers(keys[0]);
          }}
          onExpand={(keys: string[]) => setExpandedKeys(keys)}
          style={{ marginTop: 12 }}
        />
      </div>
      <div style={{ flex: 1 }}>
        {loading ? '加载中...' : members.length === 0 ? '请选择组织' : members.map((m) => <div key={m} style={{ padding: '4px 0' }}>{m}</div>)}
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 treeData / title / key / checkable / onCheck(checkedKeys, info)
<Tree treeData={data} checkable onCheck={(keys, info) => …} fieldNames={{ title: 'name' }} />

// ❌ 节点字段写 title / key（应为 text / id + nodeKey）
data={[{ key: '1', title: '总部' }]}

// ❌ 用 demo 里的 checkable（不在 API 表），应为 enableCheckbox
<Tree checkable />

// ❌ 导航树没关多选，用户 Ctrl 点出多个选中，右侧不知道跟谁
<Tree onSelect={(keys) => load(keys[0])} />   // 少了 enableMultiSelect={false}

// ❌ 从 node 上取 id 用 node.id（demo 用的是 node.props.eventKey），或干脆不管 keys 数组只存单值
onSelect={(keys, node) => setSelected(node.id)}

// ❌ 只传 expandedKeys 不接 onExpand，用户点箭头展开不了
<Tree expandedKeys={['hq']} />
```

## 9. API 速查

> 压缩自 `Tree/Tree`，只列高频；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `TreeNode[]` | 节点数据（`text` / `id` / `children` …） |
| `nodeKey` | `string`，默认 `'id'` | 主键字段名 |
| `selectedKeys` / `onSelect` | `any[]` / `(selectedKeys, node, event) => void` | 选中（受控） |
| `enableMultiSelect` | `boolean`，默认 **`true`** | 是否多选 |
| `enableCheckbox` / `checkedKeys` / `onCheck` | `boolean`（默认 false）/ `any[]` / `(checkedKeys, node, checkedNodeArr?) => void` | 勾选（受控） |
| `selectBoxType` / `radioKey` / `radioCancelable` | `'check' \| 'radio'`（默认 check）/ `any` / `boolean` | 单选框模式 |
| `expandedKeys` / `onExpand` | `any[]` / `(expandedKeys, node) => void` | 展开（受控）；`expandAll` / `cancelAll` 全展开 / 全收起 |
| `enableMultiExpand` | `boolean`，默认 `true` | 同级是否可多个展开 |
| `disabelCheckAssociated` | `boolean`，默认 `true` | 父子联动（拼写照官方）；`disabledLinkage` 置灰子节点是否联动 |
| `selectTriggerCheck` / `checkWhenSelect` | `boolean`，默认 `true` | 点选是否同时勾选 |
| `loadData` | `(itemData, callback) => void` | 异步加载子节点 |
| `lazyLoad` | `boolean`，默认 `false` | 未展开子树不渲染 |
| `height` | `number` | 视口高，开虚拟滚动（3.9.24） |
| `connectLine` / `superLevel` | `boolean`，默认 `false` | 连线 / 超多级树容器不足时 |
| `focusNode` | `{ key }` | 滚动到并聚焦节点 |
| `disabled` | `boolean`，默认 `false` | 灰化 |
| `onNodeDoubleClick` / `onNodeRightClick` / `onClickRightIcon` | 回调 | 双击 / 右键 / 右侧图标 |
| `treeNodePrefix` / `treeNodeSuffix` / `nodeSuffixTrigger` / `showRightIcon(Arr)` | — | 节点前后缀 / 右侧图标 |
| `iconLeaf` / `iconExpanded` / `iconCollapsed`（及 className） | `string \| ReactNode` | 三态图标，需成套设置 |
| `draggable` / `onDragStart` / `onDrop` … | — | 拖拽（顺序更新需自行处理） |
| `ref.findLevelNodes(value)` | `(value) => node[]` | 搜索匹配节点及祖先（demo） |
