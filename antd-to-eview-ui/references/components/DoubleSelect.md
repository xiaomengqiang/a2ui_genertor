# DoubleSelect 穿梭框

> 分类：数据录入

该穿梭框器支持array和tree两种类型，可分别传入左边内容区域和右边内容区域的数据，两边的数据可选择添加删除。

## Shortcut Keys
| Opration            | Shortcut Keys   |
| --------------      | ----------- | ------ | ------------------------------------------------------------------------------------------------|
| UpArrow             | 焦点移入上一个元素 |
| DownArrow           | 焦点移入下一个元素 |
| Ctrl + RightArrow           | 将左边选择器聚焦的元素移入右边选择器 |
| Ctrl + LeftArrow           | 将右边选择器聚焦的元素移入左边选择器 |
| Ctrl + Shift + RightArrow           | 将左边选择器的元素全部移入右边选择器 |
| Ctrl + Shift + LeftArrow           | 将右边选择器的元素全部移入左边选择器 |
| Ctrl + LeftArrow/RightArrow           | 切换焦点 |
| Shift + LeftArrow/RightArrow           | 切换焦点 |
| 支持shift多选；双击移动

## API

|方法名|描述|参数|返回值|
|---|---|---|---|
|getLeftItems|用来获取组件存放左侧内容数据的数组|无|组件左侧区域的值|
|getRightItems|用来获取组件存放左侧内容数据的数组|无|组件右侧区域的值|

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  组件id | string |  |
| className |  通过添加class的方式改变组件的样式，作用于组件的最外层div | string |  |
| style |  通过添加style的方式改变组件的样式，作用于组件的最外层div | object |  |
| disabled |  设置组件所有按钮的灰化 | bool | false |
| height |  自定义组件的高度 | number | 300 |
| width |  自定义组件的宽度 | number | 700 |
| leftHeader |  自定义左侧标题 | string |  |
| nodeKey |  树节点标识属性名，默认为'id'，可以按业务需要修改 | string | id |
| leftExpandAll |  Set to expand all nodes in left side | bool | false |
| rightExpandAll |  Set to expand all nodes in right side| bool | false |
| expandedKeysL |  设置左侧树默认展开的节点，其值为节点标识，如：['1000', '1001']| array | [] |
| expandedKeysR |  设置右侧树默认展开的节点，其值为节点标识，如：['1000', '1001']| array | [] |
| rightHeader |  自定义右侧标题 | string |  |
| type |  设置组件支持的类型 | enum:<br>&nbsp;"list"<br>&nbsp;"tree"<br> | "list" |
| items |  左边内容条目, {text:"Mgmt & Deployment", isMovable:false}, is  movable is false item can't be moved | array |  |
| selectedItems |  已选择条目,{text:"Mgmt & Deployment", isMovable:false}, is  movable is false item can't be moved | array |  |
| onLeftItemSelect |  组件的item点击事件<br/> 组件type为array时：<br/> value: 当前点击的展示文本<br/> 组件type为tree时：<br/> node : 当前点击的节点信息<br/> | function |  |
| onRightItemSelect |  组件的item点击事件<br/> 组件type为array时：<br/> value: 当前点击的展示文本<br/> 组件type为tree时：<br/> node : 当前点击的节点信息<br/> | function |  |
| onMoveToLeft |  组件的左侧数据移动左边点击事件<br><br>**签名:**<br>`function(data: arr) => void`<br>*data:* 将要移动到左边的数据 | function |  |
| onMoveToRight |  组件的左侧数据移动右边点击事件<br><br>**签名:**<br>`function(data: arr) => void`<br>*data:* 将要移动到右边的数据 | function |  |
| itemOrderChanger |  是否支持右侧数据项调整顺序,只有当type='list'且右侧面板不是过滤场景时才生效 | bool | false |
| onRightOrderChange |  组件的左侧数据移动右边点击事件<br><br>**签名:**<br>`function(data: arr) => void`<br>*data:* 将要移动到右边的数据 | function |  |
| onRightItemDoubleClick |右侧item点击事件 |function |  |
| onLeftItemDoubleClick | 左侧item点击事件 | function |  |
| onRightExpand |全部展开右侧树| function |  |
| onLeftExpand |全部展开左侧树| function |  |
| filterable |   是否可过滤,只有当type='list' | bool | false |
| filterInputProps       | 配置过滤输入框属性                                                                                           | {left?:{maxLengthInput?: number}, right?: {maxLengthInput?: number}} | {left: {}, right: {}}} |
| checkboxMode | aui3-1 模式下是否开启 checkbox 选中模式：左侧项勾选时移至右侧，右侧项取消勾选时移至左侧。支持 type=list 和 type=tree，仅当 version=aui3-1 时生效 | bool | false |


## 注意
为了保持左右两侧数据顺序的一致性，组件默认以右侧数据项为主。表象就是 左侧项目移到右侧时，位置处于右侧原有项的下面。

如果组件启用了itemOrderChanger，当项目顺序有移动行为发生时，组件保存的初始左右侧顺序会被设置为当前顺序。

## 接口定义

```typescript
import type { ReactNode } from 'react';

interface DoubleSelect {

  /**
   * 组件id
   */
  id: string;

  /**
   * 通过添加class的方式改变组件的样式，作用于组件的最外层div
   */
  className: string;

  /**
   * 通过添加style的方式改变组件的样式，作用于组件的最外层div
   */
  style: object;

  /**
   *设置组件所有按钮的灰化
   */
  disabled: boolean;

  /**
   * When the Type is Tree then only this property should enable .
   * Left side tree we can make enable or diable
   */
  leftTreeDisabled: boolean;

  /**
   * When the Type is Tree then only this property should enable .
   * Selected side tree we can make enable or diable
   */
  rightTreeDisabled: boolean;

  /**
   * 自定义组件的高度
   */
  height: number;

  /**
   * 自定义组件的宽度
   */
  width: number;

  /**
   * 自定义左侧标题
   */
  leftHeader: string;

  /**
   * 自定义右侧标题
   */
  rightHeader: string;

  /**
   * 设置组件支持的类型
   */
  type: 'list' | 'tree';

  /**
   * 设置组件支持的类型
   */
  model: 'normal' | 'editable';

  /**
   * 左边内容条目
   */
  items: any;

  /**
   * 已选择条目
   */
  selectedItems: any;

  /**
   * 左侧item点击事件
   *
   * @param {any} value 当前选中的节点信息
   */
  onLeftItemSelect: (item: any) => unknown;

  /**
   * 右侧item点击事件
   *
   * @param {any} value 当前选中的节点信息
   */
  onRightItemSelect: (item: any) => unknown;

  /**
   * 组件的左侧数据移动左边点击事件
   *
   * @param {arr} data 将要移动到左边的数据
   */
  onMoveToLeft: (item: any) => unknown;

  /**
   * 组件的左侧数据移动右边点击事件
   *
   * @param {arr} data 将要移动到右边的数据
   */
  onMoveToRight: (item: any) => unknown;

  /**
   *  是否开启右侧项顺序变更，只有当type='list'时才生效
   */
  itemOrderChanger: boolean;

  /**
   * 右侧项顺序变更事件
   *
   * @param {arr} data 顺序变更的项
   */
  onRightOrderChange: (item: any) => unknown;

  /**
   * 树节点标识属性名，默认为'id'，可以按业务需要修改
   */
  nodeKey: string;

  /**
   *  ExpandAll For Right Side Tree
   */
  rightExpandAll: boolean;

  /**
   *  ExpandAll For Right Side Tree
   */
  leftExpandAll: boolean;

  /**
   * 设置左侧树默认展开的节点，其值为节点标识，如：['1000'; '1001']
   */
  expandedKeysL: string[];

  /**
   * 设置右侧树默认展开的节点，其值为节点标识，如：['1000'; '1001']
   */
  expandedKeysR: string[];

  /**
   *  Event callback for double click on the node
   */
  onRightItemDoubleClick: (nodeKey: string, node: ReactNode, e: MouseEvent) => unknown;

  /**
   *  Event callback for double click on the node
   */
  onLeftItemDoubleClick: (nodeKey: string, node: ReactNode, e: MouseEvent) => unknown;

  /**
   * 是否可过滤
   */
  filterable: boolean;

  /**
   * aui3-1 模式下是否开启 checkbox 选中模式：左侧项勾选时移至右侧，右侧项取消勾选时移至左侧，中间转移按钮隐藏
   */
  checkboxMode: boolean;

  /**
   *  Event callback when user filter
   */
  onFilter: (str: string) => unknown;

  onRightExpand: (expandedKeys: string[], node: ReactNode) => unknown;

  getSelectedData: (data: any) => unknown;

  getData: (data: any) => unknown;

  onLeftExpand: (expandedKeys: string[], node: ReactNode) => unknown;

  onUpdateLeftRightEditItems: (expandedKeys: string[], isMovable: boolean) => unknown;

  getRightItemsForTable: (expandedKeys: string[]) => unknown;

  isValidateEditColumn: (value: string, text: string) => unknown;

  display: boolean;

  version: string;

  theme: string;

}

interface DoubleSelectEditable {


  /**
   * 组件id
   */
  id: string;

  /**
   * 通过添加class的方式改变组件的样式，作用于组件的最外层div
   */
  className: string;

  /**
   * 通过添加style的方式改变组件的样式，作用于组件的最外层div
   */
  style: object;

  /**
   *设置组件所有按钮的灰化
   */
  disabled: boolean;

  /**
   * 自定义组件的高度
   */
  height: number;

  /**
   * 自定义组件的宽度
   */
  width: number;

  /**
   * 左边内容条目
   */
  items: any;

  /**
   * 已选择条目
   */
  selectedItems: any;

  /**
   * 组件的item点击事件<br/>
   * 组件type为array时：<br/>
   * value: 当前点击的展示文本<br/>
   * 组件type为tree时：<br/>
   * node : 当前点击的节点信息<br/>
   */
  onLeftItemSelect: (text: string) => unknown;

  /**
   * 组件的item点击事件<br/>
   * 组件type为array时：<br/>
   * value: 当前点击的展示文本<br/>
   * 组件type为tree时：<br/>
   * node : 当前点击的节点信息<br/>
   */
  onRightItemSelect: (text: string) => unknown;

  /**
   * 组件的左侧数据移动左边点击事件
   *
   * @param {arr} data 将要移动到左边的数据
   */
  onMoveToLeft: (selectedItems: any) => unknown;

  /**
   * 组件的左侧数据移动右边点击事件
   *
   * @param {arr} data 将要移动到右边的数据
   */
  onMoveToRight: (selectedItems: any) => unknown;

  /**
   *  Display the item order Changer , Item can be Up and Down .
   *  applicable only for for dataType: List
   *
   */
  itemOrderChanger: boolean;

  /**
   * 组件的左侧数据移动右边点击事件
   *
   * @param {arr} data 将要移动到右边的数据
   */
  onRightOrderChange: (selectedItems: any) => unknown;

  isValidateEditColumn: (value: string, text: string) => unknown;

  getSelectedData: (isMovable: boolean) => unknown;

  onUpdateLeftRightEditItems: (expandedKeys: string[], isMovable: boolean) => unknown;

  onUpdateData: (currentData: any, items: any) => unknown;

  onLeftExpand: (expandedKeys: string[], node: ReactNode) => unknown;

  onRightExpand: (expandedKeys: string[], node: ReactNode) => unknown;

  expandedKeysL: string[];

  expandedKeysR: string[];

  getData: any;

}

interface DoubleSelectRightPanelEditable {
  selectedItems: any;
  onClick: (...args: any[]) => void;
  disbaleClick: (...args: any[]) => void;
  treeSelectKeys: any;
  clickedItems: any;
  onUpdateSelectedItems: (...args: any[]) => void;
  type: string;
  panelWidth: object;
  clickedDisabledItems: (...args: any[]) => void;
}
```

## 使用示例

### 基本属性设置

列表

```jsx
import DoubleSelect from 'eview-ui/DoubleSelect';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DoubleSelectExample extends React.Component {

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div>
            <DoubleSelect id="DbleSelect" leftHeader='Available NE' rightHeader='Selected NE'
                          items={["Computing", "Mgmt & Deployment", "Storage", "Application", "System", "RAM", "Memory", "Mouse", "Keyboard", "Monitor"]}
                          display={true} disable={false} itemOrderChanger={true}
            />
          </div>

        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<DoubleSelectExample />, mountNode);

```

### 基本属性设置

Tree

```jsx
import DoubleSelect from 'eview-ui/DoubleSelect';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DoubleSelectTreeDemo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leftTreeData: this.getLeftData(),
            rightTreeData: [],
        }
    }
    getLeftData = () => {
        let data = [
            {
                text: 'Root Node', id: 1,
                children: [
                    {
                        text: 'Node11', id: 11,
                        children: [
                            {
                                text: 'NE_111', id: 111,
                                children: [
                                    { text: 'NE_1111', id: 1111 },
                                    { text: 'NE_1112', id: 1112 },
                                ]
                            },
                            { text: 'NE_112', id: 112 }
                        ]
                    },
                    {
                        text: 'Node22', id: 22,
                        children: [
                            { text: 'NE_221', id: 221 },
                            { text: 'NE_222', id: 222 }
                        ]
                    }
                ]
            }
        ];
        return data;
    }

    getRightData = () => {
        let data = [
            {
                text: 'Root Node', id: 1,
                children: [
                    {
                        text: 'Node11', id: 11,
                        children: [
                            {
                                text: 'NE_111', id: 111,
                                children: [
                                    { text: 'NE_1112', id: 1112 },
                                ]
                            },

                        ]
                    },
                    {
                        text: 'Node22', id: 22,
                        children: [
                            { text: 'NE_221', id: 221 },
                            { text: 'NE_222', id: 222 }
                        ]
                    }
                ]
            }
        ];
        return data;
    }

    onMoveToLeft(data) {
        console.log("onMoveToLeft : ", data);
    }

    onMoveToRight(data) {
        console.log("onMoveToRight : ", data);
    }

    onRightItemDoubleClick(nodeKey, node, event) {
        console.log("onRightItemDoubleClick called");
        console.log("nodeKey : ", nodeKey);
        console.log("node : ", node);
        console.log("event : ", event);
    }

    onLeftItemDoubleClick(nodeKey, node, event) {
        console.log("onLeftItemDoubleClick called");
        console.log("nodeKey : ", nodeKey);
        console.log("node : ", node);
        console.log("event : ", event);
    }

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div>
            <DoubleSelect id="DbleSelect"
                          leftHeader='Available NE'
                          rightHeader='Selected NE'
                          type='tree'
                          items={this.state.leftTreeData}
                          selectedItems={this.state.rightTreeData}
                          onMoveToRight={this.onMoveToRight}
                          onMoveToLeft={this.onMoveToLeft}
                          onRightItemDoubleClick={this.onRightItemDoubleClick}
                          onLeftItemDoubleClick={this.onLeftItemDoubleClick}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<DoubleSelectTreeDemo />, mountNode);

```

### 基本属性设置

Immovable Items

```jsx
import React, { Component, PropTypes } from 'react';
import DoubleSelect from 'eview-ui/DoubleSelect';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class DoubleSelectExample extends React.Component {
    state = {
         msg: ''
    };

    onMoveToLeft(data) {
        console.log("onMoveToLeft : ", data);
    }

    onMoveToRight(data) {
        console.log("onMoveToRight : ", data);
    }

    constructor(props) {
        super(props);
        this.state = {
            items: [
                { text: "Computing" },
                { text: "Mgmt & Deployment", isMovable: false },
                { text: "Storage" },
                { text: "System" },
                { text: "RAM" },
                { text: "Memory" },
                { text: "Mouse" },
                { text: "Keyboard" },
                { text: "Monitor" }],
            selectedItems: [{ text: "Application", isMovable: false }]
        };
    }
    handleRecordsClick(event) {
        console.log("onclick event triggered");
        console.log(event.data);
    }

    handleGetLeftItems = () => {
        this.setState({ msg: "LeftItems:" + JSON.stringify(this.doubleSelect.getLeftItems()) });
    }

    handleGetRighttItems = () => {
        this.setState({ msg: "RightItems:" + JSON.stringify(this.doubleSelect.getRightItems()) });
    }

  render() {
    const [version, theme] = getDemoVersion();
    let buttonStyle = {marginLeft: "20px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div>
            <DoubleSelect id="DbleSelect" leftHeader='Available NE' rightHeader='Selected NE'
                          leftContentHeader='Left List' rightContentHeader='Right List'
                          items={this.state.items}
                          selectedItems={this.state.selectedItems}
                          display={true} disable={false}
                          onClick={this.handleRecordsClick.bind(this)}
                          onMoveToRight={this.onMoveToRight}
                          onMoveToLeft={this.onMoveToLeft}
                          ref={(doubleSelect) => this.doubleSelect = doubleSelect}
            />
            <br/>
            <Button text="getLeftItems" onClick={this.handleGetLeftItems} style={buttonStyle}></Button>
            <Button text="getRightItems" onClick={this.handleGetRighttItems} style={buttonStyle}></Button>
          </div>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "560px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
    }
}

ReactDOM.render(<DoubleSelectExample />, mountNode);

```

