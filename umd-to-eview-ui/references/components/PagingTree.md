# PagingTree 滚动分页树

> 分类：数据展示

滚动分页树组件，用于大数据量的树形数据展示。

## 注意事项

- TreeDataEngine的导入<br>
正式使用时，导入路径为 'eview-ui/TreeDataEngine'

## API


### 属性

#### PagingTree

| 属性名称 | 描述                                                                     | 类型 | 默认 |
|:-----|:-----------------------------------------------------------------------|:-----|:-----|
| id? | 最外层div的id                                                              | string | 自动生成（eui-paging-tree-前缀） |
| height | 树高，传纯数字时单位为px，string时支持px、rem、百分比                                                                     | string \| number | 20rem |
| width? | 树宽                                                                     | string \| number | '100%' |
| lineHeight? | 该属性仅用于计算每页显示节点数量，不影响最终渲染节点行高。使用场景：当业务通过其他方式修改树节点行高时，需要通过该属性配置真实的节点高度。传纯数字时单位为px，string时支持px、rem   | string \| number | 2rem |
| treeData | 树的数据源                                                                  | TreeNode[] | [] |
| treeDataController | 数据控制器                                                                  | TreeDataEngine | TreeDataEngine实例对象 |
| clickType | 点击模式, check或者select                                                    | 'check' \| 'select' | 'check' |
| hasExpand? | 是否有展开图标                                                                | boolean  | true |
| hasCheckBox? | 是否有checkbox, select模式强制为false                                          | boolean | true |
| nodeComponent? | 自定义树节点的React组件，传false则不渲染节点                                                         | React.ComponentClass \| false | DefaultNode |
| useSpace? | 是否使用space键进行选中                                                         | boolean | false |
| useEnterExpand? | 是否使用enter键进行展开, 只有当clickType等于select时生效                                | boolean | true |
| remSize? | 1rem对应的大小（px），默认为16                                                     | number | 16 |
| scrollStyle? | 滚动条样式                                                                   | React.CSSProperties |  |
| rowWrapperStyle? | treeRow包裹层的样式，不支持定制paddingLeft                                          | React.CSSProperties |  |
| rowConfig? | 需要给rowWrapper传递的其他任何属性                                                   | any |  |
| showNoDataInfo? | 是否显示无数据空状态（仅AUI3.1生效）                                                   | boolean | true |
| version? | AUI版本号，通常由ConfigProvider自动提供，一般不需要手动设置                                   | string | 由ConfigProvider提供 |
| theme? | AUI主题名，通常由ConfigProvider自动提供，一般不需要手动设置                                   | string | 由ConfigProvider提供 |
| onScroll? | 滚动回调                                                                   | (line: number, showNum: number) => void |  |
| onExpand? | 展开回调                                                                   | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number, expanded?: ExpandType) => void |  |
| onCheck? | 当clickType为check时，点击treeRow也会触发，触发场景不清晰。建议使用onCheckChange，仅在点击复选框时才触发。 | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onCheckChange? | 点击复选框时调用此回调                                                            | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onClick? | 只有clickType为select时点击才会触发。建议使用onRowClick，不区分clickType。                 | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onRowClick? | 点击treeRow的回调，不区分clickType                                              | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onDoubleClick? | 双击回调。clickType为select时，若未传此回调，双击默认触发展开                                   | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onRightMenu? | 右键回调                                                                   | (e: React.MouseEvent, node: TreeNode, line: number) => void |  |
| onMouseOver? | 鼠标移入node回调                                                             | (e: React.MouseEvent, node: TreeNode, line: number) => void |  |
| onMouseOut? | 鼠标移出node回调                                                             | (e: React.MouseEvent, node: TreeNode, line: number) => void |  |
| onKeyDown? | 键盘事件回调, 返回true表示用户接管, 组件不做处理                                           | (e: React.KeyboardEvent) => boolean |  |
| reRender? | 内部树修改数据后通知外部重绘                                                         | () => void |  |
| onTreeBlur? | 当row拥有焦点但是被销毁时, 会导致树失焦, 触发此回调                                          | () => void |  |
| onRowFocus? | row的聚焦回调                                                               | (e: React.FocusEvent, node: TreeNode, line: number) => void |  |
| onRowBlur? | row的失焦回调                                                               | (e: React.FocusEvent, node: TreeNode, line: number) => void |  |
| paddingStep? | 缩进大小, 单位rem                                                            | number | 1.5 |
| nativeScroll? | 是否使用原生滚动条                                                              | boolean | false |
| focusForward? | 是否转发TreeRow的焦点到自定义节点上, 默认组件接管                                          | boolean | false |
| style? | 最外层容器样式                                                                | React.CSSProperties |  |
| className? | 最外层容器class                                                             | string |  |
| treeStyle? | tree主体样式                                                               | React.CSSProperties |  |
| treeClass? | tree主体class                                                            | string |  |
| rowStyle? | treeRow样式                                                              | React.CSSProperties |  |
| rowClass? | treeRow的class                                                          | string |  |
| nodeStyle? | 默认treeNode的样式, 不指定nodeComponent时设置                                     | React.CSSProperties |  |
| nodeClass? | 默认treeNode的class                                                       | string |  |

#### TreeNode

| 属性名称 | 描述 | 类型 | 必填 |
|:-----|:-----|:-----|:-----|
| id | treeNode的唯一标识 | string | 是 |
| label | node名称 | string | 是 |
| line | 行号（由TreeDataEngine自动维护） | number | 是 |
| level | 当前级别 | number | 是 |
| isLeaf | 是否是叶子节点 | boolean | 是 |
| checked | 是否checked | CheckType (0=未选, 1=半选, 2=选中) | 是 |
| filter | 是否显示 | boolean | 是 |
| parentId? | 父节点id | string | 否 |
| disabled? | 是否禁用 | boolean | 否 |
| expand? | 是否展开 | boolean | 否 |
| isRoot? | 是否是root节点 | boolean | 否 |
| children? | 子节点数组 | TreeNode[] \| null | 否 |
| text? | 等同于label，产品兼容字段 | string | 否 |
| color? | node图标颜色 | string | 否 |
| userData? | 用户自定义数据 | any | 否 |

#### ExpandType 枚举

| 值 | 描述 |
|:--|:--|
| 1 (EXPAND) | 展开 |
| 2 (COLLAPSE) | 收缩 |

#### SelectionMode 枚举

| 值 | 描述 |
|:--|:--|
| 'multi' | 多选模式（默认） |
| 'single' | 单选模式 |

#### TreeDataEngine 构造参数

| 属性名称 | 描述 | 类型 | 默认 |
|:-----|:-----|:-----|:-----|
| treeData | 树的数据源 | TreeNode[] | [] |
| showBeginLine? | 第一条显示的行号  | number | 0 |
| pageNum? | 给UI组件传递的缓存数组大小 | number | 50 |
| selectionMode? | 选择模式: single / multi | SelectionMode \| 'multi' \| 'single' | SelectionMode.MULTI |
| defaultExpand? | 默认展开状态 | boolean | true |
| hideRoot? | 隐藏根节点 | boolean | false |
| getTreeNodesCallback? | 根据id获取TreeNode的回调 | (nodeIds: string[], callback: (nodes: UpdateNodesParams[]) => void) => void |  |
| selectNodeCallback? | 触发选中节点后的回调 | (treeNode: TreeNode) => void |  |
| cascade? | 父子节点选中状态是否关联  | boolean | true |

#### TreeDataEngine 实例方法

| 方法名 | 描述 | 参数 | 返回值 |
|:-----|:-----|:-----|:-----|
| $expand | 展开/收缩指定行节点 | (line: number, needUpdateFlat?: boolean, expandType?: ExpandType) | void |
| $expandAll | 展开所有非叶子节点 | () | void |
| $collapseAll | 收缩所有非叶子节点 | () | void |
| $check | 切换指定行的选中状态 | (line: number) | void |
| $scroll | 滚动指定条目数 | (num: number, showNum?: number) | boolean（是否发生了滚动） |
| $filter | 过滤节点 | (filterStr?: string, showBeginLine?: number) | void |
| $getCheckList | 获取选中节点列表 | (leaf?: boolean) | TreeNode[]（leaf=true只返回叶子节点） |
| $getShowLine | 获取节点在可视区域的位置 | (line?: number) | number |
| $addLeafCheckList | 批量设置叶子节点选中 | (arr: any[], type: string) | void |
| updateNodes | 更新/添加节点 | (nodes: UpdateNodesParams[], callback?: () => void, justUpdate?: boolean) | void |
| addNodes | 添加子节点 | (treeNodes: TreeNode[] \| null, parentId?: string, addCallback?: Function) | void |
| removeNode | 删除单个节点 | (nodeId: string) | void |
| removeNodes | 删除多个节点 | (nodeIds: string[]) | void |
| removeChildren | 移除指定节点的所有子节点 | (parentId: string, needUpdateFlat?: boolean) | void |
| setSelectedNodes | 选中指定节点 | (selectedNodeIds: string[], isClearSelectedNodes?: boolean, noScroll?: boolean) | void |
| clearSelectedNodes | 清除选中节点 | (nodeIds: string[]) | void |
| getSelectedNodeIds | 获取选中的NodeId数组 | () | string[] |
| getSelectedNodes | 获取选中的Node对象数组 | () | TreeNode[] |
| expandNodes | 展开指定节点 | (nodeIds: string[]) | void |
| collapseNodes | 收缩指定节点 | (nodeIds: string[]) | void |
| isParent | 判断节点是否是父节点 | (nodeId: string) | boolean |
| isExpanded | 判断节点是否已展开 | (nodeId: string) | boolean |
| getChildrenIds | 获取子节点id数组 | (parentId: string) | string[] |
| getChildren | 获取子节点对象数组 | (parentId: string) | TreeNode[] |
| getNodes | 根据nodeId数组获取node对象数组 | (nodeIds: string[]) | TreeNode[] |
| getParentId | 通过子节点id获取父节点id | (nodeId: string) | string \| null |
| getParentNode | 通过子节点id获取父节点对象 | (nodeId: string) | TreeNode \| null |
| getNodeRange | 获取起始到结束节点之间所有节点 | (data: { rangeInfo: { startNodeId, endNodeId } }) | TreeNode[] |
| updateFlatTree | 重建一维数组数据 | (justUpdate?: boolean) | void |
| destroy | 销毁实例，释放资源 | () | void |
| setCustomData | 设置用户自定义数据 | (key: string, value: any) | void |
| getCustomData | 获取用户自定义数据 | (key: string) | any |

## 使用示例

### 滚动分页树基本使用

```jsx
import PagingTree from "eview-ui/PagingTree";
import TreeDataEngine from "eview-ui/PagingTree/TreeDataEngine";

// 大数据量树：嵌套结构示意（实际可上万节点）
const tree = [];
for (let i = 0; i < 2; i++) {
  tree.push({ text: `lv0#${i}`, level: 0, expand: true });
  for (let j = 0; j < 2; j++) {
    tree.push({ text: `lv1#${i}_${j}`, level: 1, expand: true });
    for (let k = 0; k < 3; k++) {
      tree.push({ text: `lv2#${i}_${j}_${k}`, level: 2, isLeaf: true, expand: true });
    }
  }
}

const treeDataController = new TreeDataEngine({ treeData: tree });

<PagingTree
  height={400}
  treeDataController={treeDataController}
  treeData={treeDataController.pageList}
  clickType="check" // 'check' | 'select'
  hasCheckBox={true} // true / false（select 模式强制 false）
  hasExpand={true} // true / false
  useSpace={true}
  nativeScroll={true} // true 原生滚动条 / false 组件滚动条
  reRender={() => {
    // 内部树修改数据后通知外部重绘：取 treeDataController.pageList 更新
  }}
/>
```

### 拓扑场景

```jsx
import PagingTree from "eview-ui/PagingTree";
import TreeDataEngine from "eview-ui/PagingTree/TreeDataEngine";

// 自定义节点组件：接收 { node, treeDataController, onMouseOver, onMouseOut }
function TopoTreeNode({ node, treeDataController, onMouseOver, onMouseOut }) {
  const handleMouseOver = (e) => onMouseOver(e, node, node.line);
  const handleMouseOut = (e) => onMouseOut(e, node, node.line);
  const selectedNode = treeDataController.selectedNodeMap[node.id];
  const defaultSelected =
    Object.keys(treeDataController.selectedNodeMap).length === 0 && node.isRoot;
  const style = { whiteSpace: "nowrap" };
  if (selectedNode || defaultSelected) {
    style.background = "#186FC2";
    style.color = "#fff";
  }
  return (
    <div
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <img
        alt=""
        src="data:image/png;base64,..." // 图片 url
        style={{ border: `1px solid ${node.color}` }}
      />
      <div style={style}>{node.label}</div>
    </div>
  );
}

const treeDataController = new TreeDataEngine({ treeData: [] });

<PagingTree
  treeData={treeDataController.pageList}
  treeDataController={treeDataController}
  reRender={() => {
    // 取 treeDataController.pageList 更新
  }}
  hasCheckBox={false}
  clickType="select"
  nativeScroll={true}
  nodeComponent={TopoTreeNode}
  onExpand={(event, node, line, expandType) => {
    // 异步加载子节点：treeDataController.$expand(line, true, expandType)
    // 取树数据后 updateNodes([{ id, children }])
  }}
  onClick={(event, node, line) => {
    // 取 node 更新
  }}
  onMouseOver={(e, node) => {
    // 移入 node
  }}
  onMouseOut={(e, node) => {
    // 移出 node
  }}
  onRightMenu={(e, node, line) => {
    // 右键 node
  }}
  onDoubleClick={(event, node, line) => {
    // 双击：触发展开
  }}
  height={500}
/>
```

