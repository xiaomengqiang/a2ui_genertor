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
| id? | 最外层div的id                                                              | string | `eui-paging-tree-${Date.now()}` |
| height | 树高                                                                     | string \| number | 10rem | |
| width? | 树宽                                                                     | string \| number | 100% |
| lineHeight? | 该属性仅用于计算每页显示节点数量，不影响最终渲染节点行高。使用场景：当业务通过其他方式修改树节点行高时，需要通过该属性配置真实的节点高度   | string \| number | 2rem |
| treeData | 树的数据源                                                                  | TreeNode[] | [] |
| treeDataController | 数据控制器                                                                  | TreeDataEngine | TreeDataEngine实例对象 |
| clickType | 点击模式, check或者select                                                    | 'check' \| 'select' | 'check' |
| hasExpand? | 是否有展开图标                                                                | boolean  | true |
| hasCheckBox? | 是否有checkbox, select模式强制为false                                          | boolean | true |
| nodeComponent? | 自定义树节点的React组件                                                         | React.ComponentClass | DefaultNode |
| onScroll? | 滚动回调                                                                   | (line: number, showNum: number) => void |  |
| onExpand? | 展开回调                                                                   | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number, expanded?: ExpandType) => void |  |
| onCheck? | 当clickType为check时，点击treeRow也会触发，触发场景不清晰。建议使用onCheckChange，仅在点击复选框时才触发。 | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onClick? | 只有clickType为select时点击才会触发。建议使用onRowClick，不区分clickType。                 | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onDoubleClick? | 双击回调                                                                   | (event: React.MouseEvent, node: TreeNode, line: number) => void |  |
| onRightMenu? | 右键回调                                                                   | (e: React.MouseEvent, node: TreeNode, line: number) => void |  |
| onMouseOver? | 鼠标移入node回调                                                             | (e: React.MouseEvent, node: TreeNode, line: number) => void |  |
| onMouseOut? | 鼠标移除node回调                                                             | (e: React.MouseEvent, node: TreeNode, line: number) => void |  |
| onKeyDown? | 键盘事件回调, 返回true表示用户接管, 组件不做处理                                           | (e: React.KeyboardEvent) => boolean |  |
| reRender? | 内部树修改数据后通知外部重绘                                                         | () => void |  |
| onTreeBlur? | 当row拥有焦点但是被销毁时, 会导致树失焦, 触发此回调                                          | () => void |  |
| onRowFocus? | row的聚焦回调                                                               | (e: React.FocusEvent, node: TreeNode, line: number) => void |  |
| onRowBlur? | row的失焦回调                                                               | (e: React.FocusEvent, node: TreeNode, line: number) => void |  |
| paddingStep? | 缩进大小, 单位rem                                                            | number | 1.5 |
| nativeScroll? | 是否使用原生滚动条                                                              | boolean | false |
| style? | 最外层容器样式                                                                |React.CSSProperties |  |
| className? | 最外层容器样式                                                                | string |  |
| treeStyle? | tree主体样式                                                               | React.CSSProperties |  |
| treeClass? | tree主体class                                                            | string |  |
| rowStyle? | treeRow样式                                                              | React.CSSProperties |  |
| rowClass? | treeRow的class                                                          | string |  |
| nodeStyle? | 默认treeNode的样式, 不指定nodeComponent时设置                                     | React.CSSProperties |  |
| nodeClass? | 默认treeNode的class                                                       | string |  |
| useSpace? | 是否使用space键进行选中                                                         | boolean | false |
| useEnterExpand? | 是否使用enter键进行展开, 只有当clickType等于select时生效                                | boolean | true |
| focusForward? | 是否转发TreeRow的焦点到自定义节点上, 默认组件接管                                          | boolean | false |
| onRowClick? | 点击treeRow的回调                                                           | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |
| onCheckChange? | 点击复选框时调用此回调                                                            | (event: React.MouseEvent \| React.KeyboardEvent, node: TreeNode, line: number) => void |  |

#### TreeDataEngine
| 属性名称 | 描述 | 类型 | 默认 |
|:-----|:-----|:-----|:-----|
| treeData | 数的数据源 | TreeNode[] | [] |
| showBeginLine? | 第一条显示的行号  | number | 0 |
| pageNum? | 给UI组件传递的缓存数组大小 | number | 50 |
| selectionMode? | 选择模式: single / multi, 默认multi | SelectionMode  | SelectionMode.MULTI |
| defaultExpand? | 默认展开状态 | boolean | true |
| hideRoot? | 隐藏根节点 | boolean | false |
| selectNodeCallback? | 触发选中节点后的回调 | (treeNode: TreeNode) => void | |
| cascade? | 父子节点选中状态是否关联  | boolean | true |

## 使用示例

### 拓扑场景的滚动分页树

```jsx
import React from 'react';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import PagingTree from 'eview-ui/PagingTree';
import TreeDataEngine from "eview-ui/PagingTree/TreeDataEngine";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const tree: any[] = []
for (let i = 0; i < 50; i++) {
  tree.push({
    text: `lv0#${i}`,
    level: 0,
    expand: true
  })
  for (let j = 0; j < 60; j++) {
    tree.push({
      text: `lv1#${i}_${j}`,
      level: 1,
      expand: true
    })
    for (let k = 0; k < 100; k++) {
      tree.push({
        text: `lv2#${i}_${j}_${k}`,
        level: 2,
        isLeaf: true,
        expand: true
      })
    }
  }
}

export default class TreeBasicDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    /**
     * tree 的内部数据结构还是有点复杂的。所以建议使用提供的类。
     * 当然，如果使用自建的数据结构，在满足展示侧要求时，也是可以的。
     */
    const treeDataController = new TreeDataEngine({
      treeData: tree
    });

    this.state = {
      treeData: treeDataController.pageList,
      treeDataController,
      filter: '',
      showCheckBox: true,
      showExpandIcon: true,
      nativeScroll: true,
      isSelectType: false
    };
  }

  onExpandAll = () => {
    const {treeDataController} = this.state;
    treeDataController.$expandAll();
    this.setState({
      treeData: treeDataController.pageList
    });
  }

  onCollapseAll = () => {
    const {treeDataController} = this.state;
    treeDataController.$collapseAll();
    this.setState({
      treeData: treeDataController.pageList
    });
  }

  handleCheckBoxSwitch = () => {
    this.setState({showCheckBox: !this.state.showCheckBox});
  }

  handleExpandSwitch = () => {
    this.setState({showExpandIcon: !this.state.showExpandIcon});
  }

  handleScrollSwitch = () => {
    this.setState({nativeScroll: !this.state.nativeScroll});
  }

  /**
   * 必要的传入Tree组件的方法。
   * 在tree进行默认操作时，需要调用该方法更新业务侧的值。
   * 当某一个过多个事件不想使用默认操作时，可以传入对应的事件。
   * 其他例子中会有说明。
   */

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { text: 'expandAll', onClick: this.onExpandAll },
      { text: 'collapseAll', onClick: this.onCollapseAll },
      { text: 'CheckBox Switch', onClick: this.handleCheckBoxSwitch },
      { text: 'Expand Switch', onClick: this.handleExpandSwitch },
      { text: 'Scroll Switch', onClick: this.handleScrollSwitch },
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{
          width: '50%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: "black"
        }}>
          <div>
            节点数量:{this.state.treeDataController.treeData.length},
            已选叶子节点数量:{this.state.treeDataController.$getCheckList().length}<br/>
            <ButtonGroup data={data}/>
          </div>
          <PagingTree height={400}
                      treeDataController={this.state.treeDataController}
                      clickType={this.state.isSelectType ? 'select' : 'check'}
                      treeData={this.state.treeData}
                      hasCheckBox={this.state.showCheckBox}
                      hasExpand={this.state.showExpandIcon}
                      useSpace={true}
                      nativeScroll={this.state.nativeScroll}
                      reRender={() => this.setState({treeData: this.state.treeDataController.pageList.concat()})}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TreeBasicDemo />, mountNode);
```

### 拓扑场景

## en-US



```jsx
import PagingTree from 'eview-ui/PagingTree';
import TreeDataEngine from "eview-ui/PagingTree/TreeDataEngine";
import TipBox from "eview-ui/TipBox";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TopoTreeNode extends React.Component<any, any> {

    SUBNET_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACGElEQVRIS62V4XHTQBCFv70UgKkAV4CtCkgqIKkAUUHsCpAriKjAcQWYCmIqkEIFTgdxAdwye9LJtiJbIuH+aEazt+/27b63wpBTMMJxizIL4UKO5zsJz33XpS+AghThDhi1Yp8RZkxYnctxGqDgsk487XlEiTInYdMV9xKgYIzwDUh7qzsOuEdZkLA9/H0E4AqXefG3HXQMxTLaciYs4oUGQEpKhcnQTD1xG6ZcVfNgp2rksnXpSURKVf3ckyzGXQLvmljlKwn3AaCmxnjfH+V9GMOC1OHGp0A8fk1CySM5itEbjlO38InPzgFchckwDVjD3cHrYpaohYKRiCwVvR4OIPzCkwH2+hJhDXyoE+xwpPyhdLjU4zcID4dV9lcQAaqLNoJzHGuUMco1F4zxLBEew0PeCGCP26DcVASTNXwfP6Qp4l8rIFRAoMkoMzHmYWr+A4DRYiM4QvhRfzM8P0NfhO2rKHLKyhOabI4ZDa+hQJC1qs7rJhuQeVGjg36K9jqwMT1leNvoPW0tHQFQMKudcz9pjhsbQxG5U7Rt1YeCtL6s2jqoHTaPVmFNK4+k/jZT2qFMrbq9mxZMW2J6LcQTShr3w4t9UHNpq3FvXMOgdk5dbv5zGN690QpGDnIvfBmSu564WdeOPr+TbW1Wqv3UCRRFdmJd2p3+pW9R1b6olFsd4zkzv++rcBhAzPKbyo4/BssYdP4CSgUJKAqA/tMAAAAASUVORK5CYII='

    handleMouseOver = (e: React.MouseEvent) => {
        const {onMouseOver, node} = this.props;
        onMouseOver(e, node, node.line);
    }

    handleMouseOut = (e: React.MouseEvent) => {
        const {onMouseOut, node} = this.props;
        onMouseOut(e, node, node.line);
    }

    render() {
      const [version, theme] = getDemoVersion();
        const {treeDataController, node} = this.props;
        const style: React.CSSProperties = {
            whiteSpace: 'nowrap'
        };

        const selectedNode = treeDataController.selectedNodeMap[this.props.node.id];
        const defaultSelected = Object.keys(treeDataController.selectedNodeMap).length === 0 && node.isRoot;
        if (selectedNode || defaultSelected) {
            style.background = '#186FC2';
            style.color = '#fff';
        }

      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            className={'topo-left-tree-node'}>
            {<img alt='' src={this.SUBNET_ICON} className={'topo-left-tree-node-img'}
                  style={{border: `1px solid ${node.color}`}}/>}
            <div style={style}>
              {node.label}
            </div>
          </div>
        </ConfigProvider>
      );
    }
}

export default class TopoPagingTree extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        const treeDataController = new TreeDataEngine({
            treeData: []
        });

        this.state = {
            treeData: treeDataController.pageList,
            treeDataController,
            filter: '',
            showCheckBox: true,
            showExpandIcon: true,
            nativeScroll: true
        };
    }

    reRender = () => {
        this.setState({treeData: this.state.treeDataController.pageList.concat()});
    };

    handleExpand = (event:React.MouseEvent, node: any, lineNum: number, expandType?: any) => {
        if (node.isLeaf) {
            return;
        }
        const {treeDataController} = this.state;
        // this.props.treeData是一个子集, 需要使用一个key去寻找
        const treeDatum = treeDataController.treeDataMap[node.id];

        treeDataController.$expand(lineNum, true, expandType);

        if (treeDatum.expand) {
            this.getTreeData(treeDatum.id);
        } else {
            this.reRender();
        }
    }

    handleClick = (event: React.MouseEvent, node: any, line: number) => {
        this.setState({callbackResult: `点击了node: ${node.label}`})
    }

    handleDoubleClick = (event: React.MouseEvent, node: any, line: number) => {
        this.handleExpand(event, node, line);
    }

    handleContextMenu = (event: React.MouseEvent, node: any, line: number) => {
        event.preventDefault();
        event.stopPropagation()
        console.log(`右键点击了node: ${node.label}`);
        this.setState({callbackResult: `右键点击了node: ${node.label}`})
    }

    handleMouseOver = (e: React.MouseEvent, node: any) => {
        this.setState({callbackResult: `移入node: ${node.label}`})
    }

    handleMouseOut = (e: React.MouseEvent, node: any) => {
        this.setState({callbackResult: `移出node: ${node.label}`})
    }

    getTreeData = (parentId?: string) => {
        const {treeDataController} = this.state;
        if (parentId) {
            setTimeout(() => {
                // 获取点击的节点
                const treeData: any[] = treeDataController.treeData;
                const line = treeData.findIndex(data => data.id === parentId);
                const nodeData = treeData[line];
                nodeData.expand = true;

                // 获取节点数据
                let data: any | any = {};
                if (parentId === '102') {
                    data.nodes = treeNodes.nodes.map(treeNode => {
                        // @ts-ignore
                        treeNode.id = treeNode.resId;
                        return treeNode;
                    });
                } else {
                    data.nodes = [];
                    for (let i = 0; i < 10000; i++) {
                        data.nodes.push({
                            "label": `${nodeData.label}_${i}`,
                            "id": `${nodeData.id}_${i}`,
                            "parentId": parentId,
                            "isLeaf": Math.floor(Math.random() * 100) % 2 === 0,
                            "isNE": false,
                            "isManaged": true,
                            "typeId": "200",
                            "isRoot": false,
                            "uncheckedDisable": false,
                            "imageHtml": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t height=\"20px\" width=\"20px\" fill=\"#1b8adb\" viewBox=\"0 0 16 16\" style=\"enable-background:new 0 0 16 16;\" xml:space=\"preserve\">\n<g>\n\t<path fill=\"#1b8adb\" d=\"M4.5,6v3.7C4.2,9.8,4,10.1,4,10.5c0,0.5,0.4,0.8,0.8,0.8c0.3,0,0.7-0.2,0.8-0.5h5.2\n\t\tc0.1,0.3,0.4,0.5,0.8,0.5c0.5,0,0.8-0.4,0.8-0.8c0-0.4-0.2-0.7-0.6-0.8V6c0.3-0.1,0.6-0.4,0.6-0.8c0-0.5-0.4-0.8-0.8-0.8\n\t\tc-0.4,0-0.7,0.2-0.8,0.6H5.6C5.5,4.6,5.2,4.4,4.8,4.4C4.3,4.4,4,4.8,4,5.2C4,5.6,4.2,5.9,4.5,6z M5.2,6l2.3,1.9L5.2,9.7V6z\n\t\t M5.7,10.2l2.4-1.9l2.4,1.9H5.7z M11.2,6v3.8c0,0,0,0.2,0,0.2L8.6,7.9L11.2,6C11.1,6,11.1,6,11.2,6z M10.4,5.6L8.1,7.5L5.7,5.6\n\t\tH10.4z M9,0.3l5,2.9c0.6,0.4,1,1,1,1.7v5.8c0,0.7-0.4,1.4-1,1.7l-5,2.9c-0.6,0.4-1.4,0.4-2,0l-5-2.9c-0.6-0.4-1-1-1-1.7V4.9\n\t\tc0-0.7,0.4-1.4,1-1.7l5-2.9C7.6-0.1,8.4-0.1,9,0.3z\"/>\n</g>\n</svg>\n",
                            "nodeClass": "subnet",
                            "elementType": "UIELEMENT_TYPE_SUBNET"
                        });
                    }
                }
                if (data.nodes && data.nodes.length > 0) {
                    const childLevel = nodeData.level + 1;
                    data.nodes.forEach((item: any, index: number) => {
                        item.level = childLevel;
                        item.line = line + index + 1;
                        item.expand = false;
                        item.filter = true;
                        item.checked = !item.disabled ? nodeData.checked : 0; 
                    });
                }
                treeDataController.updateNodes([{id: nodeData.id, children: data.nodes}]);
                this.setState({treeData: this.state.treeDataController.pageList.concat()})
            }, 200);
        } else {
            // 返回根节点
            setTimeout(() => {
                const rootData = rootNode;
                if (rootData.nodes && rootData.nodes.length > 0) {
                    const rootNode = rootData.nodes[0];
                    // @ts-ignore
                    rootNode.id = rootNode.resId;
                    // @ts-ignore
                    rootNode.line = 0;
                    // @ts-ignore
                    rootNode.level = 0;
                    // @ts-ignore
                    rootNode.expand = false;
                    // @ts-ignore
                    rootNode.filter = true;
                    // @ts-ignore
                    rootNode.checked = 0;
                    this.state.treeDataController.rootNode = rootNode;
                    this.state.treeDataController.updateFlatTree();
                    this.setState({treeData: this.state.treeDataController.pageList.concat()})
                    // @ts-ignore
                    this.getTreeData(rootNode.id);
                }
            }, 200);
        }
    };

    componentDidMount() {
        // 初始化时获取根节点数据
        this.getTreeData();
    }

    render() {
        const [version, theme] = getDemoVersion();
        const {treeData, treeDataController} = this.state;
        return (
          treeData ?
            <ConfigProvider version={version} theme={theme}>
              <div style={{position: 'relative', color: 'black'}}>
                当前节点数: {treeDataController.showTotal}
                <PagingTree
                  treeData={treeData}
                  treeDataController={treeDataController}
                  reRender={this.reRender}
                  hasCheckBox={false}
                  clickType={'select'}
                  nativeScroll={true}
                  nodeComponent={TopoTreeNode}
                  onExpand={this.handleExpand}
                  onClick={this.handleClick}
                  onMouseOver={this.handleMouseOver}
                  onMouseOut={this.handleMouseOut}
                  onRightMenu={this.handleContextMenu}
                  onDoubleClick={this.handleDoubleClick}
                  height={500}/>
                {this.state.callbackResult && <div>{this.state.callbackResult}</div>}
                {this.state.showTip &&
                  <TipBox display={true} position={this.state.tipPosition} content={this.state.tipContent}/>}
              </div>
            </ConfigProvider>
            :
            null);
    }
}
const {rootNode, treeNodes} = {
rootNode: {
  nodes: [{
    "label": "Product Phytopo",
    "resId": "102",
    "isLeaf": false,
    "isNE": false,
    "isManaged": true,
    "isRoot": true,
    "typeId": "0",
    "uncheckedDisable": true
  }]
},
// 根节点模拟数据
treeNodes: {
  "nodes": [{
    "label": "NCE",
    "resId": "1001",
    "parentId": "102",
    "isLeaf": true,
    "isNE": true,
    "isManaged": true,
    "typeId": "100000",
    "isRoot": false,
    "uncheckedDisable": true,
    "imageHtml": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 40 40\">\n<path fill=\"#1B8ADB\" d=\"m35 1.7h-30c-2.8 0-5 2.2-5 5v18.3c0 2.8 2.2 5 5 5h10v3.3h-5c-0.9 0-1.7 0.8-1.7 1.7s0.8 1.7 1.7 1.7h20c0.9 0 1.7-0.8 1.7-1.7s-0.8-1.7-1.7-1.7h-5v-3.3h10c2.8 0 5-2.2 5-5v-18.3c0-2.8-2.2-5-5-5z m-11.7 31.6h-6.6v-3.3h6.6v3.3z m13.4-8.3c0 0.9-0.8 1.7-1.7 1.7h-30c-0.9 0-1.7-0.8-1.7-1.7v-18.3c0-0.9 0.8-1.7 1.7-1.7h30c0.9 0 1.7 0.7 1.7 1.7v18.3z m-3.4-18.3h-26.6c-0.9 0-1.7 0.7-1.7 1.6v13.4c0 0.9 0.8 1.6 1.7 1.6h26.6c1 0 1.7-0.7 1.7-1.6v-13.4c0-0.9-0.7-1.6-1.7-1.6z m0 15h-26.6v-13.4h26.6v13.4z\"></path>\n           </svg>",
    "nodeClass": "ne",
    "elementType": "UIELEMENT_TYPE_NODE"
  }, {
    "label": "ComSubnet11345",
    "resId": "1120",
    "parentId": "102",
    "isLeaf": false,
    "isNE": false,
    "isManaged": true,
    "typeId": "200",
    "isRoot": false,
    "uncheckedDisable": false,
    "imageHtml": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t height=\"20px\" width=\"20px\" fill=\"#1b8adb\" viewBox=\"0 0 16 16\" style=\"enable-background:new 0 0 16 16;\" xml:space=\"preserve\">\n<g>\n\t<path fill=\"#1b8adb\" d=\"M4.5,6v3.7C4.2,9.8,4,10.1,4,10.5c0,0.5,0.4,0.8,0.8,0.8c0.3,0,0.7-0.2,0.8-0.5h5.2\n\t\tc0.1,0.3,0.4,0.5,0.8,0.5c0.5,0,0.8-0.4,0.8-0.8c0-0.4-0.2-0.7-0.6-0.8V6c0.3-0.1,0.6-0.4,0.6-0.8c0-0.5-0.4-0.8-0.8-0.8\n\t\tc-0.4,0-0.7,0.2-0.8,0.6H5.6C5.5,4.6,5.2,4.4,4.8,4.4C4.3,4.4,4,4.8,4,5.2C4,5.6,4.2,5.9,4.5,6z M5.2,6l2.3,1.9L5.2,9.7V6z\n\t\t M5.7,10.2l2.4-1.9l2.4,1.9H5.7z M11.2,6v3.8c0,0,0,0.2,0,0.2L8.6,7.9L11.2,6C11.1,6,11.1,6,11.2,6z M10.4,5.6L8.1,7.5L5.7,5.6\n\t\tH10.4z M9,0.3l5,2.9c0.6,0.4,1,1,1,1.7v5.8c0,0.7-0.4,1.4-1,1.7l-5,2.9c-0.6,0.4-1.4,0.4-2,0l-5-2.9c-0.6-0.4-1-1-1-1.7V4.9\n\t\tc0-0.7,0.4-1.4,1-1.7l5-2.9C7.6-0.1,8.4-0.1,9,0.3z\"/>\n</g>\n</svg>\n",
    "nodeClass": "subnet",
    "elementType": "UIELEMENT_TYPE_SUBNET"
  }, {
    "label": "ComSubnet12554",
    "resId": "1155",
    "parentId": "102",
    "isLeaf": true,
    "isNE": false,
    "isManaged": true,
    "typeId": "200",
    "isRoot": false,
    "uncheckedDisable": false,
    "imageHtml": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t height=\"20px\" width=\"20px\" fill=\"#1b8adb\" viewBox=\"0 0 16 16\" style=\"enable-background:new 0 0 16 16;\" xml:space=\"preserve\">\n<g>\n\t<path fill=\"#1b8adb\" d=\"M4.5,6v3.7C4.2,9.8,4,10.1,4,10.5c0,0.5,0.4,0.8,0.8,0.8c0.3,0,0.7-0.2,0.8-0.5h5.2\n\t\tc0.1,0.3,0.4,0.5,0.8,0.5c0.5,0,0.8-0.4,0.8-0.8c0-0.4-0.2-0.7-0.6-0.8V6c0.3-0.1,0.6-0.4,0.6-0.8c0-0.5-0.4-0.8-0.8-0.8\n\t\tc-0.4,0-0.7,0.2-0.8,0.6H5.6C5.5,4.6,5.2,4.4,4.8,4.4C4.3,4.4,4,4.8,4,5.2C4,5.6,4.2,5.9,4.5,6z M5.2,6l2.3,1.9L5.2,9.7V6z\n\t\t M5.7,10.2l2.4-1.9l2.4,1.9H5.7z M11.2,6v3.8c0,0,0,0.2,0,0.2L8.6,7.9L11.2,6C11.1,6,11.1,6,11.2,6z M10.4,5.6L8.1,7.5L5.7,5.6\n\t\tH10.4z M9,0.3l5,2.9c0.6,0.4,1,1,1,1.7v5.8c0,0.7-0.4,1.4-1,1.7l-5,2.9c-0.6,0.4-1.4,0.4-2,0l-5-2.9c-0.6-0.4-1-1-1-1.7V4.9\n\t\tc0-0.7,0.4-1.4,1-1.7l5-2.9C7.6-0.1,8.4-0.1,9,0.3z\"/>\n</g>\n</svg>\n",
    "nodeClass": "subnet",
    "elementType": "UIELEMENT_TYPE_SUBNET"
  }]
}

}

ReactDOM.render(<TopoPagingTree />, mountNode);
```

```jsx
import PagingTree from 'eview-ui/PagingTree';
import TreeDataEngine from "eview-ui/PagingTree/TreeDataEngine";
import TipBox from "eview-ui/TipBox";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TopoTreeNode extends React.Component<any, any> {

    SUBNET_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACGElEQVRIS62V4XHTQBCFv70UgKkAV4CtCkgqIKkAUUHsCpAriKjAcQWYCmIqkEIFTgdxAdwye9LJtiJbIuH+aEazt+/27b63wpBTMMJxizIL4UKO5zsJz33XpS+AghThDhi1Yp8RZkxYnctxGqDgsk487XlEiTInYdMV9xKgYIzwDUh7qzsOuEdZkLA9/H0E4AqXefG3HXQMxTLaciYs4oUGQEpKhcnQTD1xG6ZcVfNgp2rksnXpSURKVf3ckyzGXQLvmljlKwn3AaCmxnjfH+V9GMOC1OHGp0A8fk1CySM5itEbjlO38InPzgFchckwDVjD3cHrYpaohYKRiCwVvR4OIPzCkwH2+hJhDXyoE+xwpPyhdLjU4zcID4dV9lcQAaqLNoJzHGuUMco1F4zxLBEew0PeCGCP26DcVASTNXwfP6Qp4l8rIFRAoMkoMzHmYWr+A4DRYiM4QvhRfzM8P0NfhO2rKHLKyhOabI4ZDa+hQJC1qs7rJhuQeVGjg36K9jqwMT1leNvoPW0tHQFQMKudcz9pjhsbQxG5U7Rt1YeCtL6s2jqoHTaPVmFNK4+k/jZT2qFMrbq9mxZMW2J6LcQTShr3w4t9UHNpq3FvXMOgdk5dbv5zGN690QpGDnIvfBmSu564WdeOPr+TbW1Wqv3UCRRFdmJd2p3+pW9R1b6olFsd4zkzv++rcBhAzPKbyo4/BssYdP4CSgUJKAqA/tMAAAAASUVORK5CYII='

    handleMouseOver = (e: React.MouseEvent) => {
        const {onMouseOver, node} = this.props;
        onMouseOver(e, node, node.line);
    }

    handleMouseOut = (e: React.MouseEvent) => {
        const {onMouseOut, node} = this.props;
        onMouseOut(e, node, node.line);
    }

    render() {
      const [version, theme] = getDemoVersion();
        const {treeDataController, node} = this.props;
        const style: React.CSSProperties = {
            whiteSpace: 'nowrap'
        };

        const selectedNode = treeDataController.selectedNodeMap[this.props.node.id];
        const defaultSelected = Object.keys(treeDataController.selectedNodeMap).length === 0 && node.isRoot;
        if (selectedNode || defaultSelected) {
            style.background = '#186FC2';
            style.color = '#fff';
        }

      return (
        // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
        <ConfigProvider version={version} theme={theme}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            className={'topo-left-tree-node'}>
            {<img alt='' src={this.SUBNET_ICON} className={'topo-left-tree-node-img'}
                  style={{border: `1px solid ${node.color}`}}/>}
            <div style={style}>
              {node.label}
            </div>
          </div>
        </ConfigProvider>
      );
    }
}

export default class TopoPagingTree extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        const treeDataController = new TreeDataEngine({
            treeData: []
        });

        this.state = {
            treeData: treeDataController.pageList,
            treeDataController,
            filter: '',
            showCheckBox: true,
            showExpandIcon: true,
            nativeScroll: true
        };
    }

    reRender = () => {
        this.setState({treeData: this.state.treeDataController.pageList.concat()});
    };

    handleExpand = (event:React.MouseEvent, node: any, lineNum: number, expandType?: any) => {
        if (node.isLeaf) {
            return;
        }
        const {treeDataController} = this.state;
        // this.props.treeData是一个子集, 需要使用一个key去寻找
        const treeDatum = treeDataController.treeDataMap[node.id];

        treeDataController.$expand(lineNum, true, expandType);

        if (treeDatum.expand) {
            this.getTreeData(treeDatum.id);
        } else {
            this.reRender();
        }
    }

    handleClick = (event: React.MouseEvent, node: any, line: number) => {
        this.setState({callbackResult: `点击了node: ${node.label}`})
    }

    handleDoubleClick = (event: React.MouseEvent, node: any, line: number) => {
        this.handleExpand(event, node, line);
    }

    handleContextMenu = (event: React.MouseEvent, node: any, line: number) => {
        event.preventDefault();
        event.stopPropagation()
        console.log(`右键点击了node: ${node.label}`);
        this.setState({callbackResult: `右键点击了node: ${node.label}`})
    }

    handleMouseOver = (e: React.MouseEvent, node: any) => {
        this.setState({callbackResult: `移入node: ${node.label}`})
    }

    handleMouseOut = (e: React.MouseEvent, node: any) => {
        this.setState({callbackResult: `移出node: ${node.label}`})
    }

    getTreeData = (parentId?: string) => {
        const {treeDataController} = this.state;
        if (parentId) {
            setTimeout(() => {
                // 获取点击的节点
                const treeData: any[] = treeDataController.treeData;
                const line = treeData.findIndex(data => data.id === parentId);
                const nodeData = treeData[line];
                nodeData.expand = true;

                // 获取节点数据
                let data: any | any = {};
                if (parentId === '102') {
                    data.nodes = treeNodes.nodes.map(treeNode => {
                        // @ts-ignore
                        treeNode.id = treeNode.resId;
                        return treeNode;
                    });
                } else {
                    data.nodes = [];
                    for (let i = 0; i < 10000; i++) {
                        data.nodes.push({
                            "label": `${nodeData.label}_${i}`,
                            "id": `${nodeData.id}_${i}`,
                            "parentId": parentId,
                            "isLeaf": Math.floor(Math.random() * 100) % 2 === 0,
                            "isNE": false,
                            "isManaged": true,
                            "typeId": "200",
                            "isRoot": false,
                            "uncheckedDisable": false,
                            "imageHtml": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t height=\"20px\" width=\"20px\" fill=\"#1b8adb\" viewBox=\"0 0 16 16\" style=\"enable-background:new 0 0 16 16;\" xml:space=\"preserve\">\n<g>\n\t<path fill=\"#1b8adb\" d=\"M4.5,6v3.7C4.2,9.8,4,10.1,4,10.5c0,0.5,0.4,0.8,0.8,0.8c0.3,0,0.7-0.2,0.8-0.5h5.2\n\t\tc0.1,0.3,0.4,0.5,0.8,0.5c0.5,0,0.8-0.4,0.8-0.8c0-0.4-0.2-0.7-0.6-0.8V6c0.3-0.1,0.6-0.4,0.6-0.8c0-0.5-0.4-0.8-0.8-0.8\n\t\tc-0.4,0-0.7,0.2-0.8,0.6H5.6C5.5,4.6,5.2,4.4,4.8,4.4C4.3,4.4,4,4.8,4,5.2C4,5.6,4.2,5.9,4.5,6z M5.2,6l2.3,1.9L5.2,9.7V6z\n\t\t M5.7,10.2l2.4-1.9l2.4,1.9H5.7z M11.2,6v3.8c0,0,0,0.2,0,0.2L8.6,7.9L11.2,6C11.1,6,11.1,6,11.2,6z M10.4,5.6L8.1,7.5L5.7,5.6\n\t\tH10.4z M9,0.3l5,2.9c0.6,0.4,1,1,1,1.7v5.8c0,0.7-0.4,1.4-1,1.7l-5,2.9c-0.6,0.4-1.4,0.4-2,0l-5-2.9c-0.6-0.4-1-1-1-1.7V4.9\n\t\tc0-0.7,0.4-1.4,1-1.7l5-2.9C7.6-0.1,8.4-0.1,9,0.3z\"/>\n</g>\n</svg>\n",
                            "nodeClass": "subnet",
                            "elementType": "UIELEMENT_TYPE_SUBNET"
                        });
                    }
                }
                if (data.nodes && data.nodes.length > 0) {
                    const childLevel = nodeData.level + 1;
                    data.nodes.forEach((item: any, index: number) => {
                        item.level = childLevel;
                        item.line = line + index + 1;
                        item.expand = false;
                        item.filter = true;
                        item.checked = !item.disabled ? nodeData.checked : 0; 
                    });
                }
                treeDataController.updateNodes([{id: nodeData.id, children: data.nodes}]);
                this.setState({treeData: this.state.treeDataController.pageList.concat()})
            }, 200);
        } else {
            // 返回根节点
            setTimeout(() => {
                const rootData = rootNode;
                if (rootData.nodes && rootData.nodes.length > 0) {
                    const rootNode = rootData.nodes[0];
                    // @ts-ignore
                    rootNode.id = rootNode.resId;
                    // @ts-ignore
                    rootNode.line = 0;
                    // @ts-ignore
                    rootNode.level = 0;
                    // @ts-ignore
                    rootNode.expand = false;
                    // @ts-ignore
                    rootNode.filter = true;
                    // @ts-ignore
                    rootNode.checked = 0;
                    this.state.treeDataController.rootNode = rootNode;
                    this.state.treeDataController.updateFlatTree();
                    this.setState({treeData: this.state.treeDataController.pageList.concat()})
                    // @ts-ignore
                    this.getTreeData(rootNode.id);
                }
            }, 200);
        }
    };

    componentDidMount() {
        // 初始化时获取根节点数据
        this.getTreeData();
    }

    render() {
        const [version, theme] = getDemoVersion();
        const {treeData, treeDataController} = this.state;
        return (
          treeData ?
            <ConfigProvider version={version} theme={theme}>
              <div style={{position: 'relative', color: 'black'}}>
                当前节点数: {treeDataController.showTotal}
                <PagingTree
                  treeData={treeData}
                  treeDataController={treeDataController}
                  reRender={this.reRender}
                  hasCheckBox={false}
                  clickType={'select'}
                  nativeScroll={true}
                  nodeComponent={TopoTreeNode}
                  onExpand={this.handleExpand}
                  onClick={this.handleClick}
                  onMouseOver={this.handleMouseOver}
                  onMouseOut={this.handleMouseOut}
                  onRightMenu={this.handleContextMenu}
                  onDoubleClick={this.handleDoubleClick}
                  height={500}/>
                {this.state.callbackResult && <div>{this.state.callbackResult}</div>}
                {this.state.showTip &&
                  <TipBox display={true} position={this.state.tipPosition} content={this.state.tipContent}/>}
              </div>
            </ConfigProvider>
            :
            null);
    }
}
const {rootNode, treeNodes} = {
rootNode: {
  nodes: [{
    "label": "Product Phytopo",
    "resId": "102",
    "isLeaf": false,
    "isNE": false,
    "isManaged": true,
    "isRoot": true,
    "typeId": "0",
    "uncheckedDisable": true
  }]
},
// 根节点模拟数据
treeNodes: {
  "nodes": [{
    "label": "NCE",
    "resId": "1001",
    "parentId": "102",
    "isLeaf": true,
    "isNE": true,
    "isManaged": true,
    "typeId": "100000",
    "isRoot": false,
    "uncheckedDisable": true,
    "imageHtml": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 40 40\">\n<path fill=\"#1B8ADB\" d=\"m35 1.7h-30c-2.8 0-5 2.2-5 5v18.3c0 2.8 2.2 5 5 5h10v3.3h-5c-0.9 0-1.7 0.8-1.7 1.7s0.8 1.7 1.7 1.7h20c0.9 0 1.7-0.8 1.7-1.7s-0.8-1.7-1.7-1.7h-5v-3.3h10c2.8 0 5-2.2 5-5v-18.3c0-2.8-2.2-5-5-5z m-11.7 31.6h-6.6v-3.3h6.6v3.3z m13.4-8.3c0 0.9-0.8 1.7-1.7 1.7h-30c-0.9 0-1.7-0.8-1.7-1.7v-18.3c0-0.9 0.8-1.7 1.7-1.7h30c0.9 0 1.7 0.7 1.7 1.7v18.3z m-3.4-18.3h-26.6c-0.9 0-1.7 0.7-1.7 1.6v13.4c0 0.9 0.8 1.6 1.7 1.6h26.6c1 0 1.7-0.7 1.7-1.6v-13.4c0-0.9-0.7-1.6-1.7-1.6z m0 15h-26.6v-13.4h26.6v13.4z\"></path>\n           </svg>",
    "nodeClass": "ne",
    "elementType": "UIELEMENT_TYPE_NODE"
  }, {
    "label": "ComSubnet11345",
    "resId": "1120",
    "parentId": "102",
    "isLeaf": false,
    "isNE": false,
    "isManaged": true,
    "typeId": "200",
    "isRoot": false,
    "uncheckedDisable": false,
    "imageHtml": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t height=\"20px\" width=\"20px\" fill=\"#1b8adb\" viewBox=\"0 0 16 16\" style=\"enable-background:new 0 0 16 16;\" xml:space=\"preserve\">\n<g>\n\t<path fill=\"#1b8adb\" d=\"M4.5,6v3.7C4.2,9.8,4,10.1,4,10.5c0,0.5,0.4,0.8,0.8,0.8c0.3,0,0.7-0.2,0.8-0.5h5.2\n\t\tc0.1,0.3,0.4,0.5,0.8,0.5c0.5,0,0.8-0.4,0.8-0.8c0-0.4-0.2-0.7-0.6-0.8V6c0.3-0.1,0.6-0.4,0.6-0.8c0-0.5-0.4-0.8-0.8-0.8\n\t\tc-0.4,0-0.7,0.2-0.8,0.6H5.6C5.5,4.6,5.2,4.4,4.8,4.4C4.3,4.4,4,4.8,4,5.2C4,5.6,4.2,5.9,4.5,6z M5.2,6l2.3,1.9L5.2,9.7V6z\n\t\t M5.7,10.2l2.4-1.9l2.4,1.9H5.7z M11.2,6v3.8c0,0,0,0.2,0,0.2L8.6,7.9L11.2,6C11.1,6,11.1,6,11.2,6z M10.4,5.6L8.1,7.5L5.7,5.6\n\t\tH10.4z M9,0.3l5,2.9c0.6,0.4,1,1,1,1.7v5.8c0,0.7-0.4,1.4-1,1.7l-5,2.9c-0.6,0.4-1.4,0.4-2,0l-5-2.9c-0.6-0.4-1-1-1-1.7V4.9\n\t\tc0-0.7,0.4-1.4,1-1.7l5-2.9C7.6-0.1,8.4-0.1,9,0.3z\"/>\n</g>\n</svg>\n",
    "nodeClass": "subnet",
    "elementType": "UIELEMENT_TYPE_SUBNET"
  }, {
    "label": "ComSubnet12554",
    "resId": "1155",
    "parentId": "102",
    "isLeaf": true,
    "isNE": false,
    "isManaged": true,
    "typeId": "200",
    "isRoot": false,
    "uncheckedDisable": false,
    "imageHtml": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t height=\"20px\" width=\"20px\" fill=\"#1b8adb\" viewBox=\"0 0 16 16\" style=\"enable-background:new 0 0 16 16;\" xml:space=\"preserve\">\n<g>\n\t<path fill=\"#1b8adb\" d=\"M4.5,6v3.7C4.2,9.8,4,10.1,4,10.5c0,0.5,0.4,0.8,0.8,0.8c0.3,0,0.7-0.2,0.8-0.5h5.2\n\t\tc0.1,0.3,0.4,0.5,0.8,0.5c0.5,0,0.8-0.4,0.8-0.8c0-0.4-0.2-0.7-0.6-0.8V6c0.3-0.1,0.6-0.4,0.6-0.8c0-0.5-0.4-0.8-0.8-0.8\n\t\tc-0.4,0-0.7,0.2-0.8,0.6H5.6C5.5,4.6,5.2,4.4,4.8,4.4C4.3,4.4,4,4.8,4,5.2C4,5.6,4.2,5.9,4.5,6z M5.2,6l2.3,1.9L5.2,9.7V6z\n\t\t M5.7,10.2l2.4-1.9l2.4,1.9H5.7z M11.2,6v3.8c0,0,0,0.2,0,0.2L8.6,7.9L11.2,6C11.1,6,11.1,6,11.2,6z M10.4,5.6L8.1,7.5L5.7,5.6\n\t\tH10.4z M9,0.3l5,2.9c0.6,0.4,1,1,1,1.7v5.8c0,0.7-0.4,1.4-1,1.7l-5,2.9c-0.6,0.4-1.4,0.4-2,0l-5-2.9c-0.6-0.4-1-1-1-1.7V4.9\n\t\tc0-0.7,0.4-1.4,1-1.7l5-2.9C7.6-0.1,8.4-0.1,9,0.3z\"/>\n</g>\n</svg>\n",
    "nodeClass": "subnet",
    "elementType": "UIELEMENT_TYPE_SUBNET"
  }]
}

}

ReactDOM.render(<TopoPagingTree />, mountNode);
```

