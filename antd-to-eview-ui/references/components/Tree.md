# Tree 结构树

> 分类：数据展示

将指定数据以树状结构进行展现，支持节点选中、展开、折叠、勾选，自定义节点图标等。

## API

| 方法名      | 描述                                                                          | 参数 | 返回值 |
| ----------- | ----------------------------------------------------------------------------- | ---- | ------ |
|getAllTreeNodeId|1.这是一个静态方法,使用形式:Tree.getAllTreeNodeId<br/>2.返回值数组类型，所有的nodeKeys|treeData: Array, nodeKey: string/number|返回树数据所有的节点nodeKeys（节点标识属性名）|
|getValue|对象类型树中选择存储数据检查节点展开节点数据|无|选择节点返回对象类型(选择键)检查节点数据检查(密钥)扩展扩展节点数据(密钥)|
|getSelectedKeys|数组类型，存放了树的选中节点eventKey的数组|无|返回树的选中节点数据（selectedKeys）|
|getCheckedKeys|数组类型，存放了树的选中勾选节点eventKey的数组|无|返回树的勾选节点数据（checkedKeys）|
|getExpandedKeys|数组类型，存放了树的展开节点eventKey的数组|无|返回树的展开节点数据（expandedKeys）|

### 属性

| Property name | Description | Type | Default |
|:-----|:-----|:-----|:--------|
| id |  组件唯一标识 | string |         |
| className | 通过定制类来添加自定义样式，您可以控制整体风格的整个组件（最外层div），例如：边距、填充 | string |         |
| style |  设置外层div风格的控制。注意：业务组需要关注该项，以适配focus时的样式 | object | null    |
| treeNodeStyle | 树节点div样式 | object | null    |
| treeNodeClass | 树节点div样式 | object |     |
| treeTextStyle | 树节点内容的样式 | object | null    |
| data |  树节点数据，可指定多个根节点，数据格式：<br/> [{ text: 'Root'<br/>id: '1000',  //节点名称 <br/>tip: 'Root Node',  //节点提示信息，不填则显示text <br/> treeNodeClass : 'tree_node_class', //节点className <br/> treeNodeStyle : {background:'red'}, //node style <br/> fontColor: '#f1a047', //自定义字体颜色 <br/> isLeaf:false,  //节点标识，若不指定，则会以节点路径生成默认值，如：'0_1_2'<br/> iconLeaf:"images/demo.png",  //设置该节点不是叶子节点，可用于懒加载时叶子节点的控制<br/> iconExpanded:"images/demo.png",  //通过url设置该节点为叶子节点时的图标<br/> iconCollapsed:"images/demo.png",  //通过url设置该节点为非叶子节点时展开时的图标,<br/> hideRootCheckbox: true, // true隐藏表头，默认为false。用于root节点  <br/>  treeNodeSuffix: (`<span>xxx</span>`)), // 自定义树节点末尾， 传入自定义的JSX DOM  <br/> children: [ {text: 'NE_001', id: '1001'}, {text: 'NE_002', id: '1002'} ] //子节点,数组类型<br/>其中，id为必填属性 }] | array |         |
| nodeKey |  节点标识属性名，默认为'id'，可以按业务需要修改 | string | 'id'    |
| enableCheckbox |  是否支持勾选 | bool | false   |
| enableScroll |To enable/disable the horizontal scroll for the tree.|bool | false   |
| disabled |  	设置组件的灰化。 | bool | false   |
| enableMultiSelect |  是否支持选中多个树节点（非选中框） | bool | true    |
| iconLeaf |  通过传入url的方式定义组件内部叶子节点图标,需配合iconExpanded和iconCollapsed一起使用 <br/>图片建议尺寸 16px*16px | string |         |
| iconLeafArr |  通过传入url数组,支持叶子节点拥有多个图标，和iconLeaf互斥，不能同时使用 <br/>图片建议尺寸 16px*16px <br/> 示例：['image/example1.png','image/example1.png'] | array |         |
| iconExpanded |  通过传入url的方式定义组件非叶子节点展开时的图标,需配合iconLeaf和iconCollapsed一起使用 <br/>图片建议尺寸 16px*16px | string |         |
| iconCollapsed |  通过传入url的方式定义组件非叶子节点关闭时的图标,需配合iconLeaf和iconExpanded一起使用 <br/>图片建议尺寸 16px*16px | string |         |
| selectedKeys |  设置默认选中的节点，其值为节点标识，如：['1000', '1001'] | array | []      |
| checkedKeys |  设置默认勾选的节点，需要先设置enableCheckbox=true，其值为节点标识，如：['1000', '1001'] | array | []      |
| expandedKeys |  设置默认展开的节点，其值为节点标识，如：['1000', '1001'] | array | []      |
| expandAll |  设置展开全部节点 | bool | false   |
| cancelAll |  设置关闭全部节点 | bool | false   |
| onSelect |  节点单击选中时事件回调<br><br>**Signature:**<br>`function(selectedKeys: array, node: object, event:object) => void`<br>*selectedKeys:* 储存有点击节点eventKey的数组<br>*node:* 被点击节点的节点信息 | function |         |
| onCheck |  节点勾选或去选时事件回调，需要先设置enableCheckbox=true<br><br>**Signature:**<br>`function(checkedKeys: array, node: object) => void`<br>*checkedKeys:* 储存有已勾选节点的eventKey的数组<br>*node:* 被勾选节点的节点信息 | function |         |
| onExpand |  节点展开或折叠时事件回调，只有非叶子节点才会触发<br><br>**Signature:**<br>`function(expandedKeys: array, node: object) => void`<br>*expandedKeys:* 储存有展开节点eventKey的数组<br>*node:* 被展开节点的节点信息 | function |         |
| onNodeDoubleClick |  Event callback for double click on the node<br><br>**Signature:**<br>`function(nodeKey: any, node: object) => void`<br>*nodeKey:* The eventKey of the node that was double-clicked<br>*node:* the node object information | function |         |
| onNodeRightClick |  Event callback for right click on the node<br><br>**Signature:**<br>`function(nodeKey: any, node: object, event:object) => void`<br>*nodeKey:* The eventKey of the node that was right-clicked<br>*node:* the node object information | function |         |
| onClickRightIcon |  Event callback for right icon click on the node <br><br>**Signature:**<br>`function( node: object , event:object) => void`<br>*node:* The node information of the clicked node | function |         |
| focusNode |  Takes an object of the format {id:`node_id`} so that the node which is represented by the key will be focused and brought to view, if the node is currently with in the expanded hierarchy, Note : if nodeKey is not id then it need be replaced. | object |         |
| showRightIcon |  Define the component's right node icon by passing in the url <br/>It is recommended that the picture size is 16px*16px | string |         |
| checkWhenSelect | 选择时是否触发check事件 | bool | false   |
| selectBoxType | 勾选框类型 | 'check'或者'radio' | 'check' |
| radioKey | radioKey的值 | 和key的值一致 |         |
| hideRoot | 设置隐藏根节点 | bool | false   |
| prefixLeaf | 设置自定义前缀，传入DOM节点 |  DOM | null    |
| disabelCheckAssociated |  CheckBox勾选/去勾选时，禁止父节点和子节点联动 | bool | false   |
| clickTimeInterval |  单击双击事件时间间隔，单位ms | number | 500     |
| ignoreDisabledItem | 设置为真后，处理勾选状态时将忽略禁用项。勾选状态不会再联动(参见[FAQ](#FAQ)) | bool | false   |
| showLine | 展示节点连接线，仅支持ICT 3.1风格 | boolean | false |

### Shortcut Keys

| Opration            | Shortcut Keys   |
| --------------      | ----------- | ------ | ------------------------------------------------------------------------------------------------|
| Tab                 | 当聚焦在tree的外层div时，tab会聚焦到组件外的下一可聚焦元素。注意：Tab键与上下键混合使用时，非disabled节点，需要从折叠图标，tab键到元素节点上，才可以上下键切换节点 |
| DownArrow or Enter  | 当聚焦在tree的外层div时，可以聚焦到tree的第一个节点 |
| Esc                 | 当聚焦在tree的节点上时，可以跳出树，聚焦到外层div |
| ctrl+End            | Focus Moved Out of the Tree |
| space or Enter      | To select the checkBox |
| RightArrow          | Expand the Tree |
| LeftArrow           | collapse the Tree   |
| UpArrow             | Focus moves to the upper tree item |
| DownArrow           | Focus moves to the down tree item |


## FAQ

### `disabled` 节点在树中的关系是什么？

Tree 通过传导方式进行数据变更。从业界通用规范来说，勾选时，它会从变更的节点开始向上、向下传导变化，直到遍历的当前节点是 `disabled` 时停止。因而如果控制的节点本身为 `disabled` 时，那么它只会修改本身而不会影响其他节点。举例来说，一个父节点包含 3 个子节点，其中一个为 `disabled` 状态。那么勾选父节点，只会影响其余两个子节点变成勾选状态。勾选两个子节点后，无论 `disabled` 节点什么状态，父节点都会变成勾选状态。

这种传导终止的方式是为了防止通过勾选子节点使得 `disabled` 父节点变成勾选状态，而用户无法直接勾选 `disabled` 父节点更改其状态导致的交互矛盾。

由于历史原因，组件当前对disabled节点的处理有些混乱，存在交互矛盾的情形。为了避免这种情形，新增 ignoreDisabledItem 属性，以适配这种通用规范。

## 接口定义

```typescript
import type { ReactNode, WheelEvent } from 'react';

interface Data {
  event: DragEvent;
  node: any;
  dragKey: string;
}

type DragType = Omit<Data, 'dragKey'>;

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

interface Tree {


  /**
   * 组件唯一标识
   */
  id: string;

  /**
   * 树节点数据，可指定多个根节点，数据格式：<br/>
   * [{
   * text: 'Root';id: '1000';  //节点名称<br/>
   * isLeaf:false;  //节点标识，若不指定，则会以节点路径生成默认值，如：'0_1_2'<br/>
   * iconLeaf:"images/demo.png";  //设置该节点不是叶子节点，可用于懒加载时叶子节点的控制<br/>
   * iconExpanded:"images/demo.png";  //通过url设置该节点为叶子节点时的图标<br/>
   * iconCollapsed:"images/demo.png";  //通过url设置该节点为非叶子节点时展开时的图标;<br/>
   * children: [ {text: 'NE_001'; id: '1001'}; {text: 'NE_002'; id: '1002'} ] //子节点;数组类型<br/>
   * }]
   */
  data: any;

  /**
   * 节点标识属性名，默认为'id'，可以按业务需要修改
   */
  nodeKey: string;

  /**
   * 是否支持勾选
   */
  enableCheckbox: boolean;

  /**
   * 勾选框的类型： check - checkbox; radio - radio
   */
  selectBoxType: string;

  /**
   * radio选中方式
   */
  radioSelectMode: string;

  /**
   * select的同时是否同时触发checkbox或radio的选中事件
   */
  checkWhenSelect: boolean;

  className: string;

  /**
   * 是否支持多选
   */
  enableMultiSelect: boolean;

  /**
   * 通过传入url的方式定义组件内部叶子节点图标;需配合iconExpanded和iconCollapsed一起使用
   * <br/>图片建议尺寸 16px*16px
   */
  iconLeaf: string;

  /**
   * 通过传入url的方式定义组件非叶子节点展开时的图标;和iconLeaf互斥。需配合iconLeaf和iconCollapsed一起使用
   * <br/>图片建议尺寸 16px*16px
   */
  iconLeafArr: string[];

  /**
   * 通过传入url的方式定义组件非叶子节点展开时的图标;需配合iconLeaf和iconCollapsed一起使用
   * <br/>图片建议尺寸 16px*16px
   */
  iconExpanded: string;

  /**
   * 通过传入url的方式定义组件非叶子节点关闭时的图标;需配合iconLeaf和iconExpanded一起使用
   * <br/>图片建议尺寸 16px*16px
   */
  iconCollapsed: string;

  /**
   * 节点滚动参数，详情查看 `scrollIntoView` api
   * 默认 {behavior: "smooth" ;
   *  block: "start";
   *  inline: "nearest"}
   */
  scrollIntoViewOptions: object;

  /**
   * 设置默认选中的节点，其值为节点标识，如：['1000'; '1001']
   */
  selectedKeys: string[];

  /**
   * 设置默认勾选的节点，需要先设置enableCheckbox=true，其值为节点标识，如：['1000'; '1001']
   */
  checkedKeys: string[];

  /**
   * 默认选中radio的key值
   */
  radioKey: string;

  /**
   * 设置默认展开的节点，其值为节点标识，如：['1000'; '1001']
   */
  expandedKeys: string[];

  /**
   * 设置展开全部节点
   */
  expandAll: boolean;

  /**
   * 设置关闭圈全部节点
   */
  cancelAll: boolean;

  /**
   * 设置组件的灰化
   */
  disabled: boolean;

  /**
   * 设置组件子节点的字体样式
   */
  treeTextStyle: any;

  /**
   * 节点单击选中时事件回调
   *
   * @param {Array} selectedKeys 储存有点击节点eventKey的数组
   * @param {object} node 被点击节点的节点信息
   */
  onSelect: (selectedKeys: string[], node: any, event: MouseEvent) => unknown;

  /**
   * 节点勾选或去选时事件回调，需要先设置enableCheckbox=true
   *
   * @param {Array} checkedKeys 储存有已勾选节点的eventKey的数组
   * @param {object} node 被勾选节点的节点信息
   */
  onCheck: (selectedKeys: string[], node: any) => unknown;

  /**
   * 节点展开或折叠时事件回调，只有非叶子节点才会触发
   *
   * @param {Array} expandedKeys 储存有展开节点eventKey的数组
   * @param {object} node 被展开节点的节点信息
   */
  onExpand: (selectedKeys: string[], node: any) => unknown;

  /**
   * Event callback for double click on the node
   *
   * @param {any} nodeKey The eventKey of the node that was double-clicked
   * @param {object} node the node object information
   */
  onNodeDoubleClick: (eventKey: number, node: any, event: MouseEvent) => unknown;

  /**
   * Event callback for right click on the node
   *
   * @param {any} nodeKey The eventKey of the node that was right-clicked
   * @param {object} node the node object information
   */
  onNodeRightClick: (eventKey: number, node: any, event: MouseEvent) => unknown;

  /**
   * Takes an object of the format {key:`node_key`} so that the node which is represented by the key will
   * be focused and brought to view; if the node is currently with in the expanded hierarchy
   */
  onClickRightIcon: (node: any, event: MouseEvent) => unknown;

  focusNode: object;

  enableScroll: boolean;

  showRightIcon: string;

  lazyLoad: boolean;

  /* 设置节点可拖拽（IE>8） */
  draggable: boolean;

  /* 应用于拖拽元素，当拖拽开始时调用 */
  onDragStart: (data: DragType) => unknown;

  /* 应用于拖拽元素，当拖拽结束时调用 */
  onDragEnd: TreeNode['onDragEnd'];

  /* 应用于拖拽元素，当鼠标离开拖拽元素是调用 */
  onDragLeave: TreeNode['onDragLeave'];

  /* 应用于目标元素，当拖拽元素进入时调用 */
  onDragEnter: TreeNode['onDragEnter'];

  /* 应用于目标元素，当停留在目标元素上时调用 */
  onDragOver: TreeNode['onDragOver'];

  /* 应用于目标元素，当在目标元素上松开鼠标时调用 */
  onDrop: TreeNode['onDrop'];

  /* 隐藏根节点 */
  hideRoot: boolean;

  /* 取消父节点和子节点复选框勾选/去勾选联动 */
  disabelCheckAssociated: boolean;

  /* 单击双击事件时间间隔 */
  clickTimeInterval: number;

  treeNodeClass: string;

  treeNodeStyle: object;

  iconLeafClassName: string;

  iconExpandedClassName: string;

  iconCollapsedClassName: string;

  prefixLeaf: ReactNode;

  style: object;

  onVerticalScroll: (e: WheelEvent<HTMLDivElement>, scrollDistanceY: number) => unknown;

  version: string;

  theme: string;

  // 处理勾选状态时忽略禁用项。勾选状态不会再联动
  ignoreDisabledItem: boolean;
  onFocusNode: any;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeExample extends React.Component {

  state = {
    radioKey: '',
    radioSelectedKeys: [],
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node, event) => {
    let eventType = event.type;
    this.setState({ selectedKeys: selectedKeys, msg: `OnSelect event callback: node id is ${node.props.eventKey}, event type is ${eventType}` });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  radioCheck = (checkedKeys, node) => {
    const currentSelectedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ radioKey: checkedKeys, radioSelectedKeys: currentSelectedKeys });
  };

  radioSelect = (selectedKeys, node, event) => {
    let eventType = event.type;
    this.setState({ radioSelectedKeys: selectedKeys });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree data={data} nodeKey={'id'} enableCheckbox={true} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys} style={{width: "200px"}}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>

        <br/>
        <br/>
        <div>
          <h3>单选radio</h3>
          <Tree
            data={data}
            nodeKey={'id'}
            enableCheckbox={true}
            selectBoxType={'radio'}
            onSelect={this.radioSelect}
            onCheck={this.radioCheck}
            onExpand={this.handleExpand}
            radioKey={this.state.radioKey}
            selectedKeys={this.state.radioSelectedKeys}
            style={{width: "200px"}}
            expandedKeys={this.state.expandedKeys}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeExample />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeExample extends React.Component {

  state = {
    radioKey: '',
    radioSelectedKeys: [],
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node, event) => {
    let eventType = event.type;
    this.setState({ selectedKeys: selectedKeys, msg: `OnSelect event callback: node id is ${node.props.eventKey}, event type is ${eventType}` });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  radioCheck = (checkedKeys, node) => {
    const currentSelectedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ radioKey: checkedKeys, radioSelectedKeys: currentSelectedKeys });
  };

  radioSelect = (selectedKeys, node, event) => {
    let eventType = event.type;
    this.setState({ radioSelectedKeys: selectedKeys });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree data={data} nodeKey={'id'} enableCheckbox={true} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys} style={{width: "200px"}}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>

        <br/>
        <br/>
        <div>
          <h3>单选radio</h3>
          <Tree
            data={data}
            nodeKey={'id'}
            enableCheckbox={true}
            selectBoxType={'radio'}
            onSelect={this.radioSelect}
            onCheck={this.radioCheck}
            onExpand={this.handleExpand}
            radioKey={this.state.radioKey}
            selectedKeys={this.state.radioSelectedKeys}
            style={{width: "200px"}}
            expandedKeys={this.state.expandedKeys}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeExample />, mountNode);

```

### 更改数据时候监听选中状态

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import LinkField from 'eview-ui/LinkField';
import Button from 'eview-ui/Button';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


let treeData = [
    {
      text: 'Root Node', id: 1,
      children: [
        {
          text: 'Subnet0', id: 11,
          children: [
            {
              text: 'NE_1', id: 21,
              children: [
                { text: 'NE_1', id: 31 },
                { text: 'NE_2', id: 32 }]
            },
            { text: 'NE_2', id: 22 }]
        },
        {
          text: 'NE_3', id: 12,
          children: [
            { text: 'NE_1', id: 23 },
            { text: 'NE_2', id: 24 }]
        }]
    }
];

const filterTreeData = (node, searchValue) => {
    const { text, children } = node;
    if (text.includes(searchValue)) {
        return true;
    }
    if (children && children.length) {
        node.children = children.filter(childNode => filterTreeData(childNode, searchValue));
        return node.children.length;
    }
    return false;
};


export default class TreeChangeDataExample extends React.Component {

  constructor(props) {
      super(props);
      let data = JSON.parse(JSON.stringify(treeData));
      this.addDeleteButtonInTreeNode(data);
      this.state = {
        checkedKeys: [],
        selectedKeys: [1],
        expandedKeys: [1],
        msg: '',
        searchValue: '',
        data
      };
  }

  addDeleteButtonInTreeNode = (treeData) => {
      const _self = this;
      const addDeleteBtn = (treeArr) => {
          if (Array.isArray(treeData)) {
            treeArr.forEach( treeNode => {
                if (Array.isArray(treeNode.children) && treeNode.children.length > 0) {
                    addDeleteBtn(treeNode.children);
                }
                const id = treeNode['id'];
                if (!treeNode['treeNodeSuffix']) {
                    treeNode['treeNodeSuffix'] = (<LinkField onClick={ (e) => {_self.handleDelete(e, id)} } text={'删除'} disabled={false} style={{ color: 'red' }} />);
                }
            })
          }
      }
      addDeleteBtn(treeData);
  }

  handleSelect = (selectedKeys, node, event) => {
    let eventType = event.type;
    this.setState({ selectedKeys: selectedKeys, msg: `OnSelect event callback: node id is ${node.props.eventKey}, event type is ${eventType}` });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleDelete = (e, id) => {

    e.preventDefault();
    e.stopPropagation();
    const { data } = this.state;
    this.deleteDataById(data ,id);
    this.setState({data});
  }

  deleteDataById = (data, id) => {
    const deleteNode = (treeDataArr) => {
        const len = treeDataArr.length;
        for (let index = 0; index < len; index++) {
            const treeNode = treeDataArr[index];
            if (treeNode['id'] === id ) {
                treeDataArr.splice(index, 1);
                break;
            } else {
                if (Array.isArray(treeNode.children) && treeNode.children.length) {
                    deleteNode(treeNode.children);
                }
            }
        }

    }
    deleteNode(data);
  }
  returnOldData = () => {
    const data = JSON.parse(JSON.stringify(treeData));
    this.addDeleteButtonInTreeNode(data);
    this.setState({data});
  }
  getCheckedKeys = () => {
    console.log(this.expTree.getCheckedKeys());
  }

  searchHandle = searchValue => {
    let { newData: data, newCheckedKeys: checkedKeys } =
     this.getFillterTreeDataAndCheckedKeys(searchValue);
    this.setState({searchValue, data, checkedKeys});
  }

  getFillterTreeDataAndCheckedKeys = (searchValue) => {
     const checkedKeys = this.state.checkedKeys;
     let data = JSON.parse(JSON.stringify(treeData));
     let newData = [];
     let newCheckedKeys = [];
     const rootNodeId = data[0].id;
     newData = JSON.parse(JSON.stringify(data)).filter(item => filterTreeData(item, searchValue));
     this.addDeleteButtonInTreeNode(newData);
     newCheckedKeys = JSON.parse(JSON.stringify(checkedKeys)).filter(item => item !== rootNodeId);
     return {newData, newCheckedKeys};
  }


  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <SearchInput value={this.state.searchValue} onSearch={this.searchHandle}/>
          <br/>
          <br/>
          <Button text='恢复原来的数据' onClick={this.returnOldData} style={{marginRight: "2rem"}}></Button>
          <Button text='获得AllCheckedKeys' onClick={this.getCheckedKeys}></Button>

          <Tree data={this.state.data} nodeKey={'id'} enableCheckbox={true} onSelect={this.handleSelect}
                onCheck={this.handleCheck} onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys} ref={tree => {
            this.expTree = tree
          }}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<TreeChangeDataExample />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import LinkField from 'eview-ui/LinkField';
import Button from 'eview-ui/Button';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


let treeData = [
    {
      text: 'Root Node', id: 1,
      children: [
        {
          text: 'Subnet0', id: 11,
          children: [
            {
              text: 'NE_1', id: 21,
              children: [
                { text: 'NE_1', id: 31 },
                { text: 'NE_2', id: 32 }]
            },
            { text: 'NE_2', id: 22 }]
        },
        {
          text: 'NE_3', id: 12,
          children: [
            { text: 'NE_1', id: 23 },
            { text: 'NE_2', id: 24 }]
        }]
    }
];

const filterTreeData = (node, searchValue) => {
    const { text, children } = node;
    if (text.includes(searchValue)) {
        return true;
    }
    if (children && children.length) {
        node.children = children.filter(childNode => filterTreeData(childNode, searchValue));
        return node.children.length;
    }
    return false;
};


export default class TreeChangeDataExample extends React.Component {

  constructor(props) {
      super(props);
      let data = JSON.parse(JSON.stringify(treeData));
      this.addDeleteButtonInTreeNode(data);
      this.state = {
        checkedKeys: [],
        selectedKeys: [1],
        expandedKeys: [1],
        msg: '',
        searchValue: '',
        data
      };
  }

  addDeleteButtonInTreeNode = (treeData) => {
      const _self = this;
      const addDeleteBtn = (treeArr) => {
          if (Array.isArray(treeData)) {
            treeArr.forEach( treeNode => {
                if (Array.isArray(treeNode.children) && treeNode.children.length > 0) {
                    addDeleteBtn(treeNode.children);
                }
                const id = treeNode['id'];
                if (!treeNode['treeNodeSuffix']) {
                    treeNode['treeNodeSuffix'] = (<LinkField onClick={ (e) => {_self.handleDelete(e, id)} } text={'删除'} disabled={false} style={{ color: 'red' }} />);
                }
            })
          }
      }
      addDeleteBtn(treeData);
  }

  handleSelect = (selectedKeys, node, event) => {
    let eventType = event.type;
    this.setState({ selectedKeys: selectedKeys, msg: `OnSelect event callback: node id is ${node.props.eventKey}, event type is ${eventType}` });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleDelete = (e, id) => {

    e.preventDefault();
    e.stopPropagation();
    const { data } = this.state;
    this.deleteDataById(data ,id);
    this.setState({data});
  }

  deleteDataById = (data, id) => {
    const deleteNode = (treeDataArr) => {
        const len = treeDataArr.length;
        for (let index = 0; index < len; index++) {
            const treeNode = treeDataArr[index];
            if (treeNode['id'] === id ) {
                treeDataArr.splice(index, 1);
                break;
            } else {
                if (Array.isArray(treeNode.children) && treeNode.children.length) {
                    deleteNode(treeNode.children);
                }
            }
        }

    }
    deleteNode(data);
  }
  returnOldData = () => {
    const data = JSON.parse(JSON.stringify(treeData));
    this.addDeleteButtonInTreeNode(data);
    this.setState({data});
  }
  getCheckedKeys = () => {
    console.log(this.expTree.getCheckedKeys());
  }

  searchHandle = searchValue => {
    let { newData: data, newCheckedKeys: checkedKeys } =
     this.getFillterTreeDataAndCheckedKeys(searchValue);
    this.setState({searchValue, data, checkedKeys});
  }

  getFillterTreeDataAndCheckedKeys = (searchValue) => {
     const checkedKeys = this.state.checkedKeys;
     let data = JSON.parse(JSON.stringify(treeData));
     let newData = [];
     let newCheckedKeys = [];
     const rootNodeId = data[0].id;
     newData = JSON.parse(JSON.stringify(data)).filter(item => filterTreeData(item, searchValue));
     this.addDeleteButtonInTreeNode(newData);
     newCheckedKeys = JSON.parse(JSON.stringify(checkedKeys)).filter(item => item !== rootNodeId);
     return {newData, newCheckedKeys};
  }


  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <SearchInput value={this.state.searchValue} onSearch={this.searchHandle}/>
          <br/>
          <br/>
          <Button text='恢复原来的数据' onClick={this.returnOldData} style={{marginRight: "2rem"}}></Button>
          <Button text='获得AllCheckedKeys' onClick={this.getCheckedKeys}></Button>

          <Tree data={this.state.data} nodeKey={'id'} enableCheckbox={true} onSelect={this.handleSelect}
                onCheck={this.handleCheck} onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys} ref={tree => {
            this.expTree = tree
          }}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<TreeChangeDataExample />, mountNode);

```

### ClassName和节点风格基本设置

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeClassNameDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];

    let data1 = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11, treeNodeStyle: { background: 'red' },
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12, fontColor: '#f1a047',
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree data={data} nodeKey={'id'} className="exampleTest" enableCheckbox={true} onSelect={this.handleSelect}
                onCheck={this.handleCheck} onExpand={this.handleExpand} lazyLoad={true}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                style={{width: "200px", height: '200px'}} expandedKeys={this.state.expandedKeys}/>
          <br/>
          <br/>
          <Tree data={data1} nodeKey={'id'} enableCheckbox={true}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                style={{width: "200px", height: '200px'}} expandedKeys={this.state.expandedKeys}/>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeClassNameDemo />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeClassNameDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];

    let data1 = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11, treeNodeStyle: { background: 'red' },
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12, fontColor: '#f1a047',
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree data={data} nodeKey={'id'} className="exampleTest" enableCheckbox={true} onSelect={this.handleSelect}
                onCheck={this.handleCheck} onExpand={this.handleExpand} lazyLoad={true}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                style={{width: "200px", height: '200px'}} expandedKeys={this.state.expandedKeys}/>
          <br/>
          <br/>
          <Tree data={data1} nodeKey={'id'} enableCheckbox={true}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                style={{width: "200px", height: '200px'}} expandedKeys={this.state.expandedKeys}/>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeClassNameDemo />, mountNode);

```

### 自定义图标

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import success from '@images/success';
import createDefault from '@images/create_default';
import navCommon from '@images/nav_common';
import navHeartActive from '@images/nav_heart_active';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeIconExample extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback, node id is : " + node.props.eventKey });
    console.log("handleSelect : ", node);
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback, node id is : " + node.props.eventKey });
    console.log("handleCheck : ", node);
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback, node id is : " + node.props.eventKey });
    console.log("handleExpand : ", node);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1, extra: "Hello Root Node",
        children: [
          {
            text: 'Subnet0', id: 11, extra: "Hello Subnet0",
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22, iconLeafArr: [navHeartActive, success] }]
          },
          {
            text: 'NE_3', id: 12,
            iconExpanded: success,
            iconCollapsed: success,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree
            data={data}
            nodeKey={'id'}
            checkedKeys={this.state.checkedKeys}
            selectedKeys={this.state.selectedKeys}
            expandedKeys={this.state.expandedKeys}
            onSelect={this.handleSelect}
            onCheck={this.handleCheck}
            onExpand={this.handleExpand}
            iconExpanded={navCommon}
            iconCollapsed={createDefault}
            iconLeaf={navHeartActive}/>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeIconExample />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import success from '@images/success';
import createDefault from '@images/create_default';
import navCommon from '@images/nav_common';
import navHeartActive from '@images/nav_heart_active';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeIconExample extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback, node id is : " + node.props.eventKey });
    console.log("handleSelect : ", node);
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback, node id is : " + node.props.eventKey });
    console.log("handleCheck : ", node);
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback, node id is : " + node.props.eventKey });
    console.log("handleExpand : ", node);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1, extra: "Hello Root Node",
        children: [
          {
            text: 'Subnet0', id: 11, extra: "Hello Subnet0",
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22, iconLeafArr: [navHeartActive, success] }]
          },
          {
            text: 'NE_3', id: 12,
            iconExpanded: success,
            iconCollapsed: success,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree
            data={data}
            nodeKey={'id'}
            checkedKeys={this.state.checkedKeys}
            selectedKeys={this.state.selectedKeys}
            expandedKeys={this.state.expandedKeys}
            onSelect={this.handleSelect}
            onCheck={this.handleCheck}
            onExpand={this.handleExpand}
            iconExpanded={navCommon}
            iconCollapsed={createDefault}
            iconLeaf={navHeartActive}/>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeIconExample />, mountNode);

```

### 自定义树节点末尾

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
// import './css/Tree.less';

export default class TreeTextSuffixDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: [],
            selectedKeys: [1],
            expandedKeys: [1],
            msg: ''
        };
    }

    handleSelect = (selectedKeys, node) => {
        this.setState({ selectedKeys: selectedKeys, msg: 'OnSelect event callback, node id is : ' + node.props.eventKey });
        console.log('handleSelect : ', node);
    };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: 'OnCheck event callback, node id is : ' + node.props.eventKey });
    console.log('handleCheck : ', node);
  };

    handleExpand = (expandedKeys, node) => {
        this.setState({ expandedKeys: expandedKeys, msg: 'OnExpand event callback, node id is : ' + node.props.eventKey });
        console.log('handleExpand : ', node);
    };

    render() {
      const [version, theme] = getDemoVersion();
        let data = [
            {
                text: 'Root Node',
                id: 1,
                extra: 'Hello Root Node',
                children: [
                    {
                        text: 'Subnet0',
                        id: 11,
                        extra: 'Hello Subnet0',
                        treeNodeSuffix: (<span className = "red">treeNodeSuffix 11</span>),
                        children: [
                            {
                                text: 'NE_1',
                                id: 21,
                                children: [{ text: 'NE_1', id: 31 }, { text: 'NE_2', id: 32 }],
                            },
                            {
                                text: 'NE_2',
                                id: 22
                            },
                        ],
                    },
                    {
                            text: 'NE_3',
                            id: 12,
                            treeNodeSuffix: (<span className = "red">treeNodeSuffix 12</span>),
                            children: [{ text: 'NE_1', id: 23 }, { text: 'NE_2', id: 24 }],
                    },
                ]
            },
        ];
      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div>
            <Tree
              data={data}
              nodeKey={'id'}
              checkedKeys={this.state.checkedKeys}
              selectedKeys={this.state.selectedKeys}
              expandedKeys={this.state.expandedKeys}
              onSelect={this.handleSelect}
              onCheck={this.handleCheck}
              onExpand={this.handleExpand}
              showRightIcon="image/nav-heart-active.png"
            />
            {this.state.msg ?
              (
                <DivMessage
                  text={this.state.msg}
                  type="success"
                  style={{marginTop: '10px', width: '560px'}}/>
              ) :
              ('')
            }
          </div>
        </ConfigProvider>
      );
    }
}

ReactDOM.render(<TreeTextSuffixDemo />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
// import './css/Tree.less';

export default class TreeTextSuffixDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: [],
            selectedKeys: [1],
            expandedKeys: [1],
            msg: ''
        };
    }

    handleSelect = (selectedKeys, node) => {
        this.setState({ selectedKeys: selectedKeys, msg: 'OnSelect event callback, node id is : ' + node.props.eventKey });
        console.log('handleSelect : ', node);
    };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: 'OnCheck event callback, node id is : ' + node.props.eventKey });
    console.log('handleCheck : ', node);
  };

    handleExpand = (expandedKeys, node) => {
        this.setState({ expandedKeys: expandedKeys, msg: 'OnExpand event callback, node id is : ' + node.props.eventKey });
        console.log('handleExpand : ', node);
    };

    render() {
      const [version, theme] = getDemoVersion();
        let data = [
            {
                text: 'Root Node',
                id: 1,
                extra: 'Hello Root Node',
                children: [
                    {
                        text: 'Subnet0',
                        id: 11,
                        extra: 'Hello Subnet0',
                        treeNodeSuffix: (<span className = "red">treeNodeSuffix 11</span>),
                        children: [
                            {
                                text: 'NE_1',
                                id: 21,
                                children: [{ text: 'NE_1', id: 31 }, { text: 'NE_2', id: 32 }],
                            },
                            {
                                text: 'NE_2',
                                id: 22
                            },
                        ],
                    },
                    {
                            text: 'NE_3',
                            id: 12,
                            treeNodeSuffix: (<span className = "red">treeNodeSuffix 12</span>),
                            children: [{ text: 'NE_1', id: 23 }, { text: 'NE_2', id: 24 }],
                    },
                ]
            },
        ];
      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div>
            <Tree
              data={data}
              nodeKey={'id'}
              checkedKeys={this.state.checkedKeys}
              selectedKeys={this.state.selectedKeys}
              expandedKeys={this.state.expandedKeys}
              onSelect={this.handleSelect}
              onCheck={this.handleCheck}
              onExpand={this.handleExpand}
              showRightIcon="image/nav-heart-active.png"
            />
            {this.state.msg ?
              (
                <DivMessage
                  text={this.state.msg}
                  type="success"
                  style={{marginTop: '10px', width: '560px'}}/>
              ) :
              ('')
            }
          </div>
        </ConfigProvider>
      );
    }
}

ReactDOM.render(<TreeTextSuffixDemo />, mountNode);

```

### 自定义图标

Custom RightIcon

```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeRightIconExample extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback, node id is : " + node.props.eventKey });
    console.log("handleSelect : ", node);
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback, node id is : " + node.props.eventKey });
    console.log("handleCheck : ", node);
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback, node id is : " + node.props.eventKey });
    console.log("handleExpand : ", node);
  };

  handleClickRightIcon = (node ,event)=>{
    this.setState({ msg: "onClickRightIcon event callback : " + node.props.eventKey});
  }

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1, extra: "Hello Root Node",
        children: [
          {
            text: 'Subnet0', id: 11, extra: "Hello Subnet0",
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            iconExpanded: "image/success.png",
            iconCollapsed: "image/success.png",
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree
            data={data}
            nodeKey={'id'}
            checkedKeys={this.state.checkedKeys}
            selectedKeys={this.state.selectedKeys}
            expandedKeys={this.state.expandedKeys}
            onSelect={this.handleSelect}
            onCheck={this.handleCheck}
            onExpand={this.handleExpand}
            showRightIcon="./image/salescatalog.svg"
            onClickRightIcon={this.handleClickRightIcon}/>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeRightIconExample />, mountNode);

```

### Icon class demos

Custom RightIcon

```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import './css/TreeExampleStyle.css';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeIconClassDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback, node id is : " + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback, node id is : " + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback, node id is : " + node.props.eventKey });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1,
        iconExpandedClassName: 'treeexampleOpenIcon',
        iconCollapsedClassName: 'treeexampleCloseIcon',
        children: [
          {
            text: 'Subnet0', id: 11,
            iconExpandedClassName: 'treeexampleOpenIcon',
            iconCollapsedClassName: 'treeexampleCloseIcon',
            children: [
              {
                text: 'NE_1', id: 21,
                iconExpandedClassName: 'treeexampleOpenIcon',
                iconCollapsedClassName: 'treeexampleCloseIcon',
                children: [
                  { text: 'NE_1', id: 31, iconLeafClassName: 'treeexampleLeafIcon' },
                  { text: 'NE_2', id: 32, iconLeafClassName: 'treeexampleLeafIcon' }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            iconExpandedClassName: 'treeexampleOpenIcon',
            iconCollapsedClassName: 'treeexampleCloseIcon',
            children: [
              { text: 'NE_1', id: 23, iconLeafClassName: 'treeexampleLeafIcon' },
              { text: 'NE_2', id: 24, iconLeafClassName: 'treeexampleLeafIcon' }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree
            data={data}
            nodeKey={'id'}
            checkedKeys={this.state.checkedKeys}
            selectedKeys={this.state.selectedKeys}
            expandedKeys={this.state.expandedKeys}
            onSelect={this.handleSelect}
            onCheck={this.handleCheck}
            onExpand={this.handleExpand}/>

          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeIconClassDemo />, mountNode);

```

### Lazy loading of Nodes

Custom RightIcon

```jsx
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
// import './css/Tree.less';

export default class TreeLazyLoadDemo extends React.Component {

  state = {
    selectedKeys: [],
    expandedKeys: [],
    msg: '',
    data: [{
      id: 1,
      text: 'RootNode',
      children: [],
      isLeaf: false,
    }],
  };

  lazyGenerateData = (id) => {
    // Since we know the tree is created with a single root element, the traversal can begin with the first element of the data array without any check. But this will totally depend on your data set.
    // This approach is only for demo purpose and not recommended for data heavy cases.
    let foundNode = this.findNode(id, this.state.data[0]);
    foundNode.children = [];
    for (let i = 0; i < 5; i++) {
      let nodeid = parseInt(('' + id + (i + 1)));
      let isNodeLeaf = (i % 2 == 0);
      let newNode = {
        id: nodeid,
        text: 'New_Node_' + nodeid,
        isLeaf: isNodeLeaf,
        children: isNodeLeaf ? undefined : [],
      }
      foundNode.children.push(newNode);
    }
  }
  findNode = (id, node) => {
    if (node.id === id) {
      return node;
    }
    let foundNode;
    if (node.children && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        foundNode = this.findNode(id, node.children[i]);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return foundNode;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.lazyGenerateData(node.props.eventKey)
    let newData = this.state.data.concat();
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey, data: newData });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = this.state.data;
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tree data={data} nodeKey={'id'} onSelect={this.handleSelect} onExpand={this.handleExpand}
                selectedKeys={this.state.selectedKeys} expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeLazyLoadDemo />, mountNode);

```

### Search in Tree

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeSearchDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleSearch = (value) => {
    let filteredData = this.filterData(value);
    this.setState(() => ({ data: filteredData }));

  }

  filterData = (searchString) => {
    let data = this.getInitialData();
    let newRoot = this.matchFilterData(data[0], searchString);
    return newRoot ? [newRoot] : [];
  }
  matchFilterData = (node, searchString) => {
    if (node.text.indexOf(searchString) > -1) {
      return Object.assign({}, node);
    }
    let newNode;
    if (node.children && node.children.length) {
      let children = [];
      for (let j = 0; j < node.children.length; j++) {
        let matchedChild = this.matchFilterData(node.children[j], searchString);
        if (node.text == 'Root Node') {
        }
        if (matchedChild) {
          children.push(matchedChild);
        }
      }
      if (children.length) {
        newNode = Object.assign({}, node);
        newNode.children = children;
      }
    }
    return newNode;
  }

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <p className='note'>This example does the search on the data set passed by the application component, filters
            out the rest of the nodes and displays only found nodes and their children.</p>
          <SearchInput placeholder="Enter to search tree" onSearch={this.handleSearch} inputStyle={{width: "15rem"}}/>
          <Tree ref={tree => this.searchTree = tree}
                data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeSearchDemo />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeSearchDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleSearch = (value) => {
    let filteredData = this.filterData(value);
    this.setState(() => ({ data: filteredData }));

  }

  filterData = (searchString) => {
    let data = this.getInitialData();
    let newRoot = this.matchFilterData(data[0], searchString);
    return newRoot ? [newRoot] : [];
  }
  matchFilterData = (node, searchString) => {
    if (node.text.indexOf(searchString) > -1) {
      return Object.assign({}, node);
    }
    let newNode;
    if (node.children && node.children.length) {
      let children = [];
      for (let j = 0; j < node.children.length; j++) {
        let matchedChild = this.matchFilterData(node.children[j], searchString);
        if (node.text == 'Root Node') {
        }
        if (matchedChild) {
          children.push(matchedChild);
        }
      }
      if (children.length) {
        newNode = Object.assign({}, node);
        newNode.children = children;
      }
    }
    return newNode;
  }

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <p className='note'>This example does the search on the data set passed by the application component, filters
            out the rest of the nodes and displays only found nodes and their children.</p>
          <SearchInput placeholder="Enter to search tree" onSearch={this.handleSearch} inputStyle={{width: "15rem"}}/>
          <Tree ref={tree => this.searchTree = tree}
                data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeSearchDemo />, mountNode);

```

### 'Search in Tree: API'

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeSearchAPIDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleSearch = (value) => {
    let filteredData = this.filterData(value);
    this.setState(() => ({ data: filteredData }));

  }

  filterData = (resultnodes) => {
    let data = this.getInitialData();
    let newRoot = this.matchFilterData(data[0], resultnodes);
    return newRoot ? [newRoot] : [];
  }
  matchFilterData = (node, resultnodes) => {
    if (node.text.indexOf(resultnodes) > -1) {
      return Object.assign({}, node);
    }
    let newNode;
    if (node.children && node.children.length) {
      let children = [];
      for (let j = 0; j < node.children.length; j++) {
        let matchedChild = this.matchFilterData(node.children[j], resultnodes);
        if (node.text == 'Root Node') {
        }
        if (matchedChild) {
          children.push(matchedChild);
        }
      }
      if (children.length) {
        newNode = Object.assign({}, node);
        newNode.children = children;
      }
    }
    return newNode;
  }

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <p className='note'>This example calls the <code>findNodes</code> API of the tree and filters out the rest of
            the nodes and displayes only found nodes and their children.</p>
          <SearchInput placeholder="Enter to search tree" onSearch={this.handleSearch} inputStyle={{width: "15rem"}}/>
          <Tree ref={tree => this.searchTree = tree}
                data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeSearchAPIDemo />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeSearchAPIDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleSearch = (value) => {
    let filteredData = this.filterData(value);
    this.setState(() => ({ data: filteredData }));

  }

  filterData = (resultnodes) => {
    let data = this.getInitialData();
    let newRoot = this.matchFilterData(data[0], resultnodes);
    return newRoot ? [newRoot] : [];
  }
  matchFilterData = (node, resultnodes) => {
    if (node.text.indexOf(resultnodes) > -1) {
      return Object.assign({}, node);
    }
    let newNode;
    if (node.children && node.children.length) {
      let children = [];
      for (let j = 0; j < node.children.length; j++) {
        let matchedChild = this.matchFilterData(node.children[j], resultnodes);
        if (node.text == 'Root Node') {
        }
        if (matchedChild) {
          children.push(matchedChild);
        }
      }
      if (children.length) {
        newNode = Object.assign({}, node);
        newNode.children = children;
      }
    }
    return newNode;
  }

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <p className='note'>This example calls the <code>findNodes</code> API of the tree and filters out the rest of
            the nodes and displayes only found nodes and their children.</p>
          <SearchInput placeholder="Enter to search tree" onSearch={this.handleSearch} inputStyle={{width: "15rem"}}/>
          <Tree ref={tree => this.searchTree = tree}
                data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeSearchAPIDemo />, mountNode);

```

### 'Search in Tree'

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeSearchAPIDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleSearch = (value) => {
    let filteredData = this.filterData(value);
    this.setState(() => ({ data: filteredData }));

  }

  filterData = (resultnodes) => {
    let data = this.getInitialData();
    let newRoot = this.matchFilterData(data[0], resultnodes);
    return newRoot ? [newRoot] : [];
  }
  matchFilterData = (node, resultnodes) => {
    if (node.text.indexOf(resultnodes) > -1) {
      return Object.assign({}, node);
    }
    let newNode;
    if (node.children && node.children.length) {
      let children = [];
      for (let j = 0; j < node.children.length; j++) {
        let matchedChild = this.matchFilterData(node.children[j], resultnodes);
        if (node.text == 'Root Node') {
        }
        if (matchedChild) {
          children.push(matchedChild);
        }
      }
      if (children.length) {
        newNode = Object.assign({}, node);
        newNode.children = children;
      }
    }
    return newNode;
  }

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <p className='note'>This example calls the <code>findNodes</code> API of the tree and filters out the rest of
            the nodes and displayes only found nodes and their children.</p>
          <SearchInput placeholder="Enter to search tree" onSearch={this.handleSearch} inputStyle={{width: "15rem"}}/>
          <Tree ref={tree => this.searchTree = tree}
                data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeSearchAPIDemo />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeSearchAPIDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey });
  };

  handleSearch = (value) => {
    let filteredData = this.filterData(value);
    this.setState(() => ({ data: filteredData }));

  }

  filterData = (resultnodes) => {
    let data = this.getInitialData();
    let newRoot = this.matchFilterData(data[0], resultnodes);
    return newRoot ? [newRoot] : [];
  }
  matchFilterData = (node, resultnodes) => {
    if (node.text.indexOf(resultnodes) > -1) {
      return Object.assign({}, node);
    }
    let newNode;
    if (node.children && node.children.length) {
      let children = [];
      for (let j = 0; j < node.children.length; j++) {
        let matchedChild = this.matchFilterData(node.children[j], resultnodes);
        if (node.text == 'Root Node') {
        }
        if (matchedChild) {
          children.push(matchedChild);
        }
      }
      if (children.length) {
        newNode = Object.assign({}, node);
        newNode.children = children;
      }
    }
    return newNode;
  }

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <p className='note'>This example calls the <code>findNodes</code> API of the tree and filters out the rest of
            the nodes and displayes only found nodes and their children.</p>
          <SearchInput placeholder="Enter to search tree" onSearch={this.handleSearch} inputStyle={{width: "15rem"}}/>
          <Tree ref={tree => this.searchTree = tree}
                data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                onExpand={this.handleExpand}
                checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                expandedKeys={this.state.expandedKeys}/>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeSearchAPIDemo />, mountNode);

```

### Expand All - Collapse All- Disable

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeExpandCollapseDemo extends React.Component {

  state = {
    checkedKeys: [],
    expandedKeys: [1],
    selectedKeys: [],
    disable: false
  };


  handleExpandAll = () => {
    const expandAllKeys = [1, 11, 21, 31, 32, 22, 12, 23, 24];
    const treeStatevalue = this.expTree.getValue();
    const selectedKeys = treeStatevalue.selectedKeys;
    const checkedKeys = treeStatevalue.checkedKeys;
    // Set state with an array of all the parent nodes to the  expandedkeys.
    this.setState(() => ({ expandedKeys: expandAllKeys, selectedKeys: selectedKeys, checkedKeys: checkedKeys }));
  }

  handleCollapseAll = () => {
    // Set state with an empty array of expandedkeys.
    const treeStatevalue = this.expTree.getValue();
    const selectedKeys = treeStatevalue.selectedKeys;
    const checkedKeys = treeStatevalue.checkedKeys;
    this.setState(() => ({ expandedKeys: [], selectedKeys: selectedKeys, checkedKeys: checkedKeys }));
  }

  handleGetValue = () => {
    console.log(this.expTree.getValue());
  }

  handleGetSelectedKeys = () => {
    console.log(this.expTree.getSelectedKeys());
  }

  handleGetCheckedKeys = () => {
    console.log(this.expTree.getCheckedKeys());
  }

  handleGetExpandedKeys = () => {
    console.log(this.expTree.getExpandedKeys());
  }
  handleDisable = () => {
    console.log(this.state.disable);
    this.setState(() => ({ disable: !this.state.disable }));
  }

  handleSelect = () => {
    const checkedKeys = [1];
    this.setState(() => ({ checkedKeys: checkedKeys }));
  }

  handleTreeDoubleClick = (eventKey, node, event) => {
    console.log("handleTreeDoubleClick");
    console.log(eventKey, node, event);
  }

  handleTreeRightClick = (eventKey, node, event) => {
    console.log("handleTreeRightClick");
    console.log(eventKey);
    console.log(node);
    console.log(event);
  }

  render() {
    const [version, theme] = getDemoVersion();
    const buttonStyle = { marginRight: '0.5rem', marginBottom: '0.5rem' };
    let data = [
      {
        text: 'Root Node', id: 1,
        extra: 'hello world',
        hideRootCheckbox: true,
        children: [
          {
            text: 'Subnet0', id: 11,
            extra: 'hello Subnet0',
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Button text='Expand All' onClick={this.handleExpandAll} style={buttonStyle}/>
          <Button text='Collapse All' onClick={this.handleCollapseAll} style={buttonStyle}/>
          <Button text='getValue API' onClick={this.handleGetValue} style={buttonStyle}/>
          <Button text='getSelectedKeys API' onClick={this.handleGetSelectedKeys} style={buttonStyle}/>
          <Button text='getCheckedKeys API' onClick={this.handleGetCheckedKeys} style={buttonStyle}/>
          <Button text='getExpandedKeys API' onClick={this.handleGetExpandedKeys} style={buttonStyle}/>
          <Button text='Disable' onClick={this.handleDisable} style={buttonStyle}/>
          <Button text='Check Root Node' onClick={this.handleSelect} style={buttonStyle}/>
          <br/><br/><br/>

          <Tree
            ref={tree => {
              this.expTree = tree
            }}
            data={data} nodeKey={'id'} enableCheckbox={true}
            checkedKeys={this.state.checkedKeys} expandedKeys={this.state.expandedKeys}
            selectedKeys={this.state.selectedKeys}
            disabled={this.state.disable}
            onNodeDoubleClick={this.handleTreeDoubleClick}
            onNodeRightClick={this.handleTreeRightClick}/>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeExpandCollapseDemo />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class TreeExpandCollapseDemo extends React.Component {

  state = {
    checkedKeys: [],
    expandedKeys: [1],
    selectedKeys: [],
    disable: false
  };


  handleExpandAll = () => {
    const expandAllKeys = [1, 11, 21, 31, 32, 22, 12, 23, 24];
    const treeStatevalue = this.expTree.getValue();
    const selectedKeys = treeStatevalue.selectedKeys;
    const checkedKeys = treeStatevalue.checkedKeys;
    // Set state with an array of all the parent nodes to the  expandedkeys.
    this.setState(() => ({ expandedKeys: expandAllKeys, selectedKeys: selectedKeys, checkedKeys: checkedKeys }));
  }

  handleCollapseAll = () => {
    // Set state with an empty array of expandedkeys.
    const treeStatevalue = this.expTree.getValue();
    const selectedKeys = treeStatevalue.selectedKeys;
    const checkedKeys = treeStatevalue.checkedKeys;
    this.setState(() => ({ expandedKeys: [], selectedKeys: selectedKeys, checkedKeys: checkedKeys }));
  }

  handleGetValue = () => {
    console.log(this.expTree.getValue());
  }

  handleGetSelectedKeys = () => {
    console.log(this.expTree.getSelectedKeys());
  }

  handleGetCheckedKeys = () => {
    console.log(this.expTree.getCheckedKeys());
  }

  handleGetExpandedKeys = () => {
    console.log(this.expTree.getExpandedKeys());
  }
  handleDisable = () => {
    console.log(this.state.disable);
    this.setState(() => ({ disable: !this.state.disable }));
  }

  handleSelect = () => {
    const checkedKeys = [1];
    this.setState(() => ({ checkedKeys: checkedKeys }));
  }

  handleTreeDoubleClick = (eventKey, node, event) => {
    console.log("handleTreeDoubleClick");
    console.log(eventKey, node, event);
  }

  handleTreeRightClick = (eventKey, node, event) => {
    console.log("handleTreeRightClick");
    console.log(eventKey);
    console.log(node);
    console.log(event);
  }

  render() {
    const [version, theme] = getDemoVersion();
    const buttonStyle = { marginRight: '0.5rem', marginBottom: '0.5rem' };
    let data = [
      {
        text: 'Root Node', id: 1,
        extra: 'hello world',
        hideRootCheckbox: true,
        children: [
          {
            text: 'Subnet0', id: 11,
            extra: 'hello Subnet0',
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Button text='Expand All' onClick={this.handleExpandAll} style={buttonStyle}/>
          <Button text='Collapse All' onClick={this.handleCollapseAll} style={buttonStyle}/>
          <Button text='getValue API' onClick={this.handleGetValue} style={buttonStyle}/>
          <Button text='getSelectedKeys API' onClick={this.handleGetSelectedKeys} style={buttonStyle}/>
          <Button text='getCheckedKeys API' onClick={this.handleGetCheckedKeys} style={buttonStyle}/>
          <Button text='getExpandedKeys API' onClick={this.handleGetExpandedKeys} style={buttonStyle}/>
          <Button text='Disable' onClick={this.handleDisable} style={buttonStyle}/>
          <Button text='Check Root Node' onClick={this.handleSelect} style={buttonStyle}/>
          <br/><br/><br/>

          <Tree
            ref={tree => {
              this.expTree = tree
            }}
            data={data} nodeKey={'id'} enableCheckbox={true}
            checkedKeys={this.state.checkedKeys} expandedKeys={this.state.expandedKeys}
            selectedKeys={this.state.selectedKeys}
            disabled={this.state.disable}
            onNodeDoubleClick={this.handleTreeDoubleClick}
            onNodeRightClick={this.handleTreeRightClick}/>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeExpandCollapseDemo />, mountNode);

```

### Tree with or without scroll

## en-US



```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeScrollDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    checkedKeysOne: [],
    selectedKeysOne: [1],
    expandedKeysOne: [1],
    msg: '',
    msg1: '',
    height: '400px',
    height1: '400px',
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node Example Test 1234567890',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };
  handleSelectOne = (selectedKeys, node) => {
    this.setState({ selectedKeysOne: selectedKeys, msg1: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };
  handleCheckOne = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeysOne: currentCheckedKeys, msg1: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    let ht = this.state.height;
    if (node.props.expanded) {
      ht = parseInt(this.state.height, 10) > 1500 ? '300px' : ((parseInt(this.state.height, 10) - 110) + 'px');
    } else {
      ht = parseInt(this.state.height, 10) > 1500 ? '300px' : ((parseInt(this.state.height, 10) + 110) + 'px');
    }
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey, height: ht });
  };
  handleExpandOne = (expandedKeys, node) => {

    let ht = this.state.height1;
    if (node.props.expanded) {
      ht = parseInt(this.state.height1, 10) > 1500 ? '300px' : ((parseInt(this.state.height1, 10) - 110) + 'px');
    } else {
      ht = parseInt(this.state.height1, 10) > 1500 ? '300px' : ((parseInt(this.state.height1, 10) + 110) + 'px');
    }
    this.setState({ expandedKeysOne: expandedKeys, msg1: "OnExpand event callback: node id is" + node.props.eventKey, height1: ht });
  };


  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node Example Test', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{display: 'inline-block'}}>
            <div style={{width: '200px', backgroundColor: 'transparent', padding: '5px', height: '400px'}}>
              <Tree ref={tree => this.searchTree = tree} enableScroll={true} style={{overflow: 'auto', height: '95%'}}
                    data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                    onExpand={this.handleExpand}
                    checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                    expandedKeys={this.state.expandedKeys}/></div>

          </div>
          <div style={{float: 'right', paddingRight: '300px'}}>
            <div style={{width: '200px', backgroundColor: 'transparent', padding: '5px', height: this.state.height1}}>
              <Tree ref={tree => this.searchTree = tree}
                    data={this.state.data} nodeKey={'id'} onSelect={this.handleSelectOne} onCheck={this.handleCheckOne}
                    onExpand={this.handleExpandOne}
                    checkedKeys={this.state.checkedKeysOne} selectedKeys={this.state.selectedKeysOne}
                    expandedKeys={this.state.expandedKeysOne}/></div>

          </div>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeScrollDemo />, mountNode);

```

```jsx
import Tree from 'eview-ui/Tree';
import SearchInput from 'eview-ui/SearchInput';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class TreeScrollDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    checkedKeysOne: [],
    selectedKeysOne: [1],
    expandedKeysOne: [1],
    msg: '',
    msg1: '',
    height: '400px',
    height1: '400px',
  };
  constructor(props) {
    super(props);
    this.state.data = this.getInitialData()
  }
  getInitialData = () => {
    let rootnode = {
      text: 'Root Node Example Test 1234567890',
      id: 1,
      children: this.getChildren(10, 'root_chld_', 'Root Child_', true)
    };
    return [rootnode];
  }
  getChildren = (nodeCount, idPrefix, nodenamePrefix, needChildren) => {
    let data = [];
    let namePrefix = nodenamePrefix ? nodenamePrefix : 'Child Node_';
    for (let i = 1; i <= nodeCount; i++) {
      let node = {
        id: idPrefix + i,
        text: namePrefix + i
      }
      if (needChildren) {
        node.children = this.getChildren(3, node.id + '_');
      }
      data.push(node);
    }
    return data;
  }
  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback: node id is" + node.props.eventKey });
  };
  handleSelectOne = (selectedKeys, node) => {
    this.setState({ selectedKeysOne: selectedKeys, msg1: "OnSelect event callback: node id is" + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeys: currentCheckedKeys, msg: "OnCheck event callback: node id is" + node.props.eventKey });
  };
  handleCheckOne = (checkedKeys, node) => {
    const currentCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
    this.setState({ checkedKeysOne: currentCheckedKeys, msg1: "OnCheck event callback: node id is" + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    let ht = this.state.height;
    if (node.props.expanded) {
      ht = parseInt(this.state.height, 10) > 1500 ? '300px' : ((parseInt(this.state.height, 10) - 110) + 'px');
    } else {
      ht = parseInt(this.state.height, 10) > 1500 ? '300px' : ((parseInt(this.state.height, 10) + 110) + 'px');
    }
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback: node id is" + node.props.eventKey, height: ht });
  };
  handleExpandOne = (expandedKeys, node) => {

    let ht = this.state.height1;
    if (node.props.expanded) {
      ht = parseInt(this.state.height1, 10) > 1500 ? '300px' : ((parseInt(this.state.height1, 10) - 110) + 'px');
    } else {
      ht = parseInt(this.state.height1, 10) > 1500 ? '300px' : ((parseInt(this.state.height1, 10) + 110) + 'px');
    }
    this.setState({ expandedKeysOne: expandedKeys, msg1: "OnExpand event callback: node id is" + node.props.eventKey, height1: ht });
  };


  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      {
        text: 'Root Node Example Test', id: 1,
        children: [
          {
            text: 'Subnet0', id: 11,
            children: [
              {
                text: 'NE_1', id: 21,
                children: [
                  { text: 'NE_1', id: 31 },
                  { text: 'NE_2', id: 32 }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            children: [
              { text: 'NE_1', id: 23 },
              { text: 'NE_2', id: 24 }]
          }]
      }
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{display: 'inline-block'}}>
            <div style={{width: '200px', backgroundColor: 'transparent', padding: '5px', height: '400px'}}>
              <Tree ref={tree => this.searchTree = tree} enableScroll={true} style={{overflow: 'auto', height: '95%'}}
                    data={this.state.data} nodeKey={'id'} onSelect={this.handleSelect} onCheck={this.handleCheck}
                    onExpand={this.handleExpand}
                    checkedKeys={this.state.checkedKeys} selectedKeys={this.state.selectedKeys}
                    expandedKeys={this.state.expandedKeys}/></div>

          </div>
          <div style={{float: 'right', paddingRight: '300px'}}>
            <div style={{width: '200px', backgroundColor: 'transparent', padding: '5px', height: this.state.height1}}>
              <Tree ref={tree => this.searchTree = tree}
                    data={this.state.data} nodeKey={'id'} onSelect={this.handleSelectOne} onCheck={this.handleCheckOne}
                    onExpand={this.handleExpandOne}
                    checkedKeys={this.state.checkedKeysOne} selectedKeys={this.state.selectedKeysOne}
                    expandedKeys={this.state.expandedKeysOne}/></div>

          </div>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeScrollDemo />, mountNode);

```

