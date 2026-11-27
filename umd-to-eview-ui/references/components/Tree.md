# Tree 结构树

> 分类：数据展示

将指定数据以树状结构进行展现，支持节点选中、展开、折叠、勾选，自定义节点图标等。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tree`    | `Tree`     | `treeData`→**`data`**；节点 `title`→**`text`**、`key`→**`id`**（主键字段名 `nodeKey` 默认 'id'，**不是 fieldNames**）；`checkable`→**`enableCheckbox`**（默认 false，勾选需显式开）；**`enableMultiSelect` 默认 true**——单选树必须显式 `enableMultiSelect={false}`；回调：`onSelect(selectedKeys, node, event)`/`onCheck(checkedKeys, node)`（首参是 keys 数组）/`onExpand(expandedKeys, node)`（**必须接**，只传 expandedKeys 不接回调点箭头展开不了）；`loadData` 异步加载（`isLeaf` 显箭头）；父子勾选关联 `disabelCheckAssociated`（拼写）；`showLine` 仅 3.1；`expandedKeys`/`selectedKeys`/`checkedKeys` 受控同名保留 |

## API

| 方法名           | 描述                                                                                   | 参数                                    | 返回值                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| getAllTreeNodeId | 1.这是一个静态方法,使用形式:Tree.getAllTreeNodeId<br/>2.返回值数组类型，所有的nodeKeys | treeData: Array, nodeKey: string/number | 返回树数据所有的节点nodeKeys（节点标识属性名）                           |
| getValue         | 对象类型树中选择存储数据检查节点展开节点数据                                           | 无                                      | 选择节点返回对象类型(选择键)检查节点数据检查(密钥)扩展扩展节点数据(密钥) |
| getSelectedKeys  | 数组类型，存放了树的选中节点eventKey的数组                                             | 无                                      | 返回树的选中节点数据（selectedKeys）                                     |
| getCheckedKeys   | 数组类型，存放了树的选中勾选节点eventKey的数组                                         | 无                                      | 返回树的勾选节点数据（checkedKeys）                                      |
| getExpandedKeys  | 数组类型，存放了树的展开节点eventKey的数组                                             | 无                                      | 返回树的展开节点数据（expandedKeys）                                     |

### 属性

| Property name          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Type               | Default |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- | :------ |
| id                     | 组件唯一标识                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | string             |         |
| className              | 通过定制类来添加自定义样式，您可以控制整体风格的整个组件（最外层div），例如：边距、填充                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | string             |         |
| style                  | 设置外层div风格的控制。注意：业务组需要关注该项，以适配focus时的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | object             | null    |
| treeNodeStyle          | 树节点div样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | object             | null    |
| treeNodeClass          | 树节点div样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | object             |         |
| treeTextStyle          | 树节点内容的样式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | object             | null    |
| data                   | 树节点数据，可指定多个根节点，数据格式：<br/> [{ text: 'Root'<br/>id: '1000', //节点名称 <br/>tip: 'Root Node', //节点提示信息，不填则显示text <br/> treeNodeClass : 'tree_node_class', //节点className <br/> treeNodeStyle : {background:'red'}, //node style <br/> fontColor: '#f1a047', //自定义字体颜色 <br/> isLeaf:false, //节点标识，若不指定，则会以节点路径生成默认值，如：'0_1_2'<br/> iconLeaf:"images/demo.png", //设置该节点不是叶子节点，可用于懒加载时叶子节点的控制<br/> iconExpanded:"images/demo.png", //通过url设置该节点为叶子节点时的图标<br/> iconCollapsed:"images/demo.png", //通过url设置该节点为非叶子节点时展开时的图标,<br/> hideRootCheckbox: true, // true隐藏表头，默认为false。用于root节点 <br/> treeNodeSuffix: (`<span>xxx</span>`)), // 自定义树节点末尾， 传入自定义的JSX DOM <br/> children: [ {text: 'NE_001', id: '1001'}, {text: 'NE_002', id: '1002'} ] //子节点,数组类型<br/>其中，id为必填属性 }] | array              |         |
| nodeKey                | 节点标识属性名，默认为'id'，可以按业务需要修改                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | string             | 'id'    |
| enableCheckbox         | 是否支持勾选                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | boolean               | false   |
| enableScroll           | To enable/disable the horizontal scroll for the tree.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | boolean               | false   |
| disabled               | 设置组件的灰化。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | boolean               | false   |
| enableMultiSelect      | 是否支持选中多个树节点（非选中框）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | boolean               | true    |
| iconLeaf               | 通过传入url的方式定义组件内部叶子节点图标,需配合iconExpanded和iconCollapsed一起使用 <br/>图片建议尺寸 16px\*16px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | string             |         |
| iconLeafArr            | 通过传入url数组,支持叶子节点拥有多个图标，和iconLeaf互斥，不能同时使用 <br/>图片建议尺寸 16px\*16px <br/> 示例：['image/example1.png','image/example1.png']                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | array              |         |
| iconExpanded           | 通过传入url的方式定义组件非叶子节点展开时的图标,需配合iconLeaf和iconCollapsed一起使用 <br/>图片建议尺寸 16px\*16px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | string             |         |
| iconCollapsed          | 通过传入url的方式定义组件非叶子节点关闭时的图标,需配合iconLeaf和iconExpanded一起使用 <br/>图片建议尺寸 16px\*16px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | string             |         |
| selectedKeys           | 设置默认选中的节点，其值为节点标识，如：['1000', '1001']                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | array              | []      |
| checkedKeys            | 设置默认勾选的节点，需要先设置enableCheckbox=true，其值为节点标识，如：['1000', '1001']                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | array              | []      |
| expandedKeys           | 设置默认展开的节点，其值为节点标识，如：['1000', '1001']                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | array              | []      |
| expandAll              | 设置展开全部节点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | boolean               | false   |
| cancelAll              | 设置关闭全部节点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | boolean               | false   |
| onSelect               | 节点单击选中时事件回调<br><br>**Signature:**<br>`function(selectedKeys: array, node: object, event:object) => void`<br>_selectedKeys:_ 储存有点击节点eventKey的数组<br>_node:_ 被点击节点的节点信息                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | function           |         |
| onCheck                | 节点勾选或去选时事件回调，需要先设置enableCheckbox=true<br><br>**Signature:**<br>`function(checkedKeys: array, node: object) => void`<br>_checkedKeys:_ 储存有已勾选节点的eventKey的数组<br>_node:_ 被勾选节点的节点信息                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | function           |         |
| onExpand               | 节点展开或折叠时事件回调，只有非叶子节点才会触发<br><br>**Signature:**<br>`function(expandedKeys: array, node: object) => void`<br>_expandedKeys:_ 储存有展开节点eventKey的数组<br>_node:_ 被展开节点的节点信息                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | function           |         |
| onNodeDoubleClick      | Event callback for double click on the node<br><br>**Signature:**<br>`function(nodeKey: any, node: object) => void`<br>_nodeKey:_ The eventKey of the node that was double-clicked<br>_node:_ the node object information                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | function           |         |
| onNodeRightClick       | Event callback for right click on the node<br><br>**Signature:**<br>`function(nodeKey: any, node: object, event:object) => void`<br>_nodeKey:_ The eventKey of the node that was right-clicked<br>_node:_ the node object information                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | function           |         |
| onClickRightIcon       | Event callback for right icon click on the node <br><br>**Signature:**<br>`function( node: object , event:object) => void`<br>_node:_ The node information of the clicked node                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | function           |         |
| focusNode              | Takes an object of the format {id:`node_id`} so that the node which is represented by the key will be focused and brought to view, if the node is currently with in the expanded hierarchy, Note : if nodeKey is not id then it need be replaced.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | object             |         |
| showRightIcon          | Define the component's right node icon by passing in the url <br/>It is recommended that the picture size is 16px\*16px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | string             |         |
| checkWhenSelect        | 选择时是否触发check事件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | boolean               | false   |
| selectBoxType          | 勾选框类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 'check'或者'radio' | 'check' |
| radioKey               | radioKey的值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 和key的值一致      |         |
| hideRoot               | 设置隐藏根节点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | boolean               | false   |
| prefixLeaf             | 设置自定义前缀，传入DOM节点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | DOM                | null    |
| disabelCheckAssociated | CheckBox勾选/去勾选时，禁止父节点和子节点联动                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | boolean               | false   |
| clickTimeInterval      | 单击双击事件时间间隔，单位ms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | number             | 500     |
| ignoreDisabledItem     | 设置为真后，处理勾选状态时将忽略禁用项。勾选状态不会再联动(参见[FAQ](#FAQ))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | boolean               | false   |
| showLine               | 展示节点连接线，仅支持ICT 3.1风格                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | boolean            | false   |

## FAQ

### `disabled` 节点在树中的关系是什么？

Tree 通过传导方式进行数据变更。从业界通用规范来说，勾选时，它会从变更的节点开始向上、向下传导变化，直到遍历的当前节点是 `disabled` 时停止。因而如果控制的节点本身为 `disabled` 时，那么它只会修改本身而不会影响其他节点。举例来说，一个父节点包含 3 个子节点，其中一个为 `disabled` 状态。那么勾选父节点，只会影响其余两个子节点变成勾选状态。勾选两个子节点后，无论 `disabled` 节点什么状态，父节点都会变成勾选状态。

这种传导终止的方式是为了防止通过勾选子节点使得 `disabled` 父节点变成勾选状态，而用户无法直接勾选 `disabled` 父节点更改其状态导致的交互矛盾。

由于历史原因，组件当前对disabled节点的处理有些混乱，存在交互矛盾的情形。为了避免这种情形，新增 ignoreDisabledItem 属性，以适配这种通用规范。

## 接口定义

```typescript
import type { ReactNode, WheelEvent } from "react";

interface Data {
  event: DragEvent;
  node: any;
  dragKey: string;
}

type DragType = Omit<Data, "dragKey">;

interface TreeNode {
  text: any;
  tip: string;
  eventKey: any;
  selected: boolean;
  expanded: boolean;
  checked: boolean;
  checkedKeys: string[];
  enableCheckbox: boolean;
  enableRadio: boolean;
  halfChecked: boolean;
  isLeaf: boolean;
  isLastNode: boolean;
  disabled: boolean;
  iconLeaf: string;
  iconLeafArr: any;
  iconExpanded: string;
  iconCollapsed: string;
  iconLeafClass: string;
  iconExpandedClass: string;
  iconCollapsedClass: string;
  onSelect: (obj: any, e: MouseEvent) => unknown;
  onCheck: (obj: any) => unknown;
  onExpand: (obj: any) => unknown;
  onClickRightIcon: (obj: any, e: MouseEvent) => unknown;
  enableScroll: boolean;
  showRightIcon: string;
  fontColor: string;
  hideRootCheckbox: boolean;
  treeNodeSuffix: any;
  lazyLoad: boolean;
  nodePath: any;
  onDoubleClick: (obj: any, event: MouseEvent) => unknown;
  onDragStart: (data: DragType) => unknown;
  onDragEnd: (data: DragType) => unknown;
  onDragEnter: (data: DragType) => unknown;
  onDragLeave: (data: DragType) => unknown;
  onDragOver: (data: DragType) => unknown;
  onDrop: (data: Data) => unknown;
  isFocused: boolean;
  isKeyBoardSelect: boolean;
  treeTextStyle: any;
  scrollIntoViewOptions: object;
  clickTimeInterval: number;
  children: ReactNode;
  onRadioChange: (obj: any) => unknown;
  onRightClick: (obj: any, e: MouseEvent) => unknown;
  treeNodeClass: string;
  treeNodeStyle: object;
  hideRoot: boolean;
  nodeLevel: number;
  draggable: boolean;
  prefixLeaf: ReactNode;
  onFocusNode: (e: FocusEvent) => unknown;
}
```

## 使用示例

### 基本属性设置

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

<Tree
  data={data}
  nodeKey="id"
  enableCheckbox={true}
  onSelect={(selectedKeys, node, event) => {
    // selectedKeys 是选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 是勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 是展开节点 id 数组
  }}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  style={{ width: "200px" }}
/>

// selectBoxType="radio"：单选勾选框
<Tree
  data={data}
  nodeKey="id"
  enableCheckbox={true}
  selectBoxType="radio"
  onSelect={(selectedKeys, node, event) => {
    // selectedKeys 是选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 是勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 是展开节点 id 数组
  }}
  radioKey=""
  selectedKeys={[]}
  style={{ width: "200px" }}
  expandedKeys={[1]}
/>
```

### 更改数据时候监听选中状态

```jsx
import Tree from "eview-ui/Tree";
import SearchInput from "eview-ui/SearchInput";
import Button from "eview-ui/Button";
import LinkField from "eview-ui/LinkField";

const treeRef = React.useRef();

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        treeNodeSuffix: (
          <LinkField
            onClick={(e) => {
              // 删除节点 id
            }}
            text={"删除"}
            disabled={false}
            style={{ color: "red" }}
          />
        ),
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

<SearchInput
  value=""
  onSearch={(searchValue) => {
    // 按 searchValue 过滤 data 更新
  }}
/>
<Button text="获得AllCheckedKeys" onClick={() => { treeRef.current.getCheckedKeys(); }}/>
<Tree
  data={data}
  nodeKey="id"
  enableCheckbox={true}
  onSelect={(selectedKeys, node, event) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  ref={treeRef}
/>
```

### ClassName和节点风格基本设置

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

const data1 = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        treeNodeStyle: { background: "red" },
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12, fontColor: "#f1a047" },
    ],
  },
];

<Tree
  data={data}
  nodeKey="id"
  className="exampleTest"
  enableCheckbox={true}
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  lazyLoad={true}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  style={{ width: "200px", height: "200px" }}
/>
<Tree
  data={data1}
  nodeKey="id"
  enableCheckbox={true}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  style={{ width: "200px", height: "200px" }}
/>
```

### 自定义图标

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32, iconLeafArr: ["nav-heart-active-url", "success-url"] }, // 图片 url
        ],
      },
      {
        text: "NE_3",
        id: 12,
        iconExpanded: "success-url", // 图片 url
        iconCollapsed: "success-url", // 图片 url
        children: [
          { text: "NE_1", id: 23 },
          { text: "NE_2", id: 24 },
        ],
      },
    ],
  },
];

<Tree
  data={data}
  nodeKey="id"
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  iconExpanded="nav-common-url" // 图片 url
  iconCollapsed="create-default-url" // 图片 url
  iconLeaf="nav-heart-active-url" // 图片 url
/>
```

### 自定义树节点末尾

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        treeNodeSuffix: <span className="red">treeNodeSuffix 11</span>,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      {
        text: "NE_3",
        id: 12,
        treeNodeSuffix: <span className="red">treeNodeSuffix 12</span>,
        children: [
          { text: "NE_1", id: 23 },
          { text: "NE_2", id: 24 },
        ],
      },
    ],
  },
];

<Tree
  data={data}
  nodeKey="id"
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  showRightIcon="image/nav-heart-active.png" // 图片 url
/>
```

### 自定义图标

Custom RightIcon

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      {
        text: "NE_3",
        id: 12,
        iconExpanded: "image/success.png", // 图片 url
        iconCollapsed: "image/success.png", // 图片 url
        children: [
          { text: "NE_1", id: 23 },
          { text: "NE_2", id: 24 },
        ],
      },
    ],
  },
];

<Tree
  data={data}
  nodeKey="id"
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  showRightIcon="./image/salescatalog.svg" // 图片 url
  onClickRightIcon={(node, event) => {
    // node 是点击节点的信息
  }}
/>
```

### Icon class demos

Custom RightIcon

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    text: "Root Node",
    id: 1,
    iconExpandedClassName: "treeexampleOpenIcon",
    iconCollapsedClassName: "treeexampleCloseIcon",
    children: [
      {
        text: "Subnet0",
        id: 11,
        iconExpandedClassName: "treeexampleOpenIcon",
        iconCollapsedClassName: "treeexampleCloseIcon",
        children: [
          {
            text: "NE_1",
            id: 21,
            children: [
              { text: "NE_1", id: 31, iconLeafClassName: "treeexampleLeafIcon" },
              { text: "NE_2", id: 32, iconLeafClassName: "treeexampleLeafIcon" },
            ],
          },
        ],
      },
    ],
  },
];

<Tree
  data={data}
  nodeKey="id"
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
/>
```

### Lazy loading of Nodes

Custom RightIcon

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    id: 1,
    text: "RootNode",
    children: [],
    isLeaf: false,
  },
];

<Tree
  data={data}
  nodeKey="id"
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // 异步加载：按 node.props.eventKey 拉取子节点更新 data
  }}
  selectedKeys={[]}
  expandedKeys={[]}
/>
```

### Search in Tree

```jsx
import Tree from "eview-ui/Tree";
import SearchInput from "eview-ui/SearchInput";

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

<SearchInput
  placeholder="Enter to search tree"
  onSearch={(value) => {
    // 按 value 过滤 data 更新
  }}
  inputStyle={{ width: "15rem" }}
/>
<Tree
  data={data}
  nodeKey="id"
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
/>
```

### 'Search in Tree: API'

```jsx
import Tree from "eview-ui/Tree";
import SearchInput from "eview-ui/SearchInput";

const treeRef = React.useRef();

const data = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

<SearchInput
  placeholder="Enter to search tree"
  onSearch={(value) => {
    // 调用 treeRef.current.findNodes(value) 过滤节点
  }}
  inputStyle={{ width: "15rem" }}
/>
<Tree
  ref={treeRef}
  data={data}
  nodeKey="id"
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
/>
```

### Expand All - Collapse All- Disable

```jsx
import Tree from "eview-ui/Tree";
import Button from "eview-ui/Button";

const treeRef = React.useRef();

const data = [
  {
    text: "Root Node",
    id: 1,
    hideRootCheckbox: true,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

<Button text="Expand All" onClick={() => { /* 设置 expandedKeys 为全部父节点 */ }} style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}/>
<Button text="Collapse All" onClick={() => { /* 设置 expandedKeys 为 [] */ }} style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}/>
<Button text="getValue API" onClick={() => { treeRef.current.getValue(); }} style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}/>
<Button text="getSelectedKeys API" onClick={() => { treeRef.current.getSelectedKeys(); }} style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}/>

<Tree
  ref={treeRef}
  data={data}
  nodeKey="id"
  enableCheckbox={true}
  checkedKeys={[]}
  expandedKeys={[1]}
  selectedKeys={[]}
  disabled={false}
  onNodeDoubleClick={(eventKey, node, event) => {
    // eventKey 双击节点 id
  }}
  onNodeRightClick={(eventKey, node, event) => {
    // eventKey 右键节点 id
  }}
/>
```

### Tree with or without scroll

```jsx
import Tree from "eview-ui/Tree";

const data = [
  {
    text: "Root Node Example Test",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 31 },
          { text: "NE_2", id: 32 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

<Tree
  enableScroll={true}
  style={{ overflow: "auto", height: "400px", width: "200px" }}
  data={data}
  nodeKey="id"
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
/>
<Tree
  style={{ height: "400px", width: "200px" }}
  data={data}
  nodeKey="id"
  onSelect={(selectedKeys, node) => {
    // selectedKeys 选中节点 id 数组
  }}
  onCheck={(checkedKeys, node) => {
    // checkedKeys 勾选节点 id 数组
  }}
  onExpand={(expandedKeys, node) => {
    // expandedKeys 展开节点 id 数组
  }}
  checkedKeys={[]}
  selectedKeys={[1]}
  expandedKeys={[1]}
/>
```
