# DoubleSelect 穿梭框

> 分类：数据录入

该穿梭框支持list和tree两种类型，可分别传入左边内容区域和右边内容区域的数据，两边的数据可选择添加删除。支持普通模式(normal)和可编辑模式(editable)。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Transfer` | `DoubleSelect` | **双数组直传**（不是 dataSource/targetKeys 模式）：`items`（左）+ `selectedItems`（右），项 `{text, isMovable}`；`onMoveToRight(data)`/`onMoveToLeft(data)`；`filterable`（仅 list 型）；`itemOrderChanger` 右侧排序；`model` 区分 normal/editable 模式；快捷键 Ctrl+方向移动；ref：`getLeftItems`/`getRightItems`；性能：items ≤200 |

## Shortcut Keys

| 操作 | 快捷键 |
|------|--------|
| 上移焦点 | UpArrow |
| 下移焦点 | DownArrow |
| 将左边聚焦元素移至右边 | Ctrl + RightArrow |
| 将右边聚焦元素移至左边 | Ctrl + LeftArrow |
| 将左边全部元素移至右边 | Ctrl + Shift + RightArrow |
| 将右边全部元素移至左边 | Ctrl + Shift + LeftArrow |
| 切换左右焦点 | Ctrl + LeftArrow/RightArrow 或 Shift + LeftArrow/RightArrow |
| 多选 | Shift + 点击 |
| 双击移动 | 双击左侧/右侧项 |

## API

| 方法名 | 描述 | 参数 | 返回值 |
|--------|------|------|--------|
| getLeftItems | 用来获取组件存放左侧内容数据的数组 | 无 | 组件左侧区域的值 |
| getRightItems | 用来获取组件存放右侧内容数据的数组 | 无 | 组件右侧区域的值 |

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id | 组件id | string | 自动生成 |
| className | 通过添加class的方式改变组件的样式，作用于组件的最外层div | string | |
| style | 通过添加style的方式改变组件的样式，作用于组件的最外层div | CSSProperties | |
| disabled | 设置组件所有按钮的灰化 | boolean | false |
| height | 自定义组件的高度（单位px） | number | |
| width | 自定义组件的宽度（单位px） | number | |
| type | 设置组件支持的类型 | enum:<br>&nbsp;"list"<br>&nbsp;"tree" | "list" |
| model | 设置组件模式，normal为普通模式，editable为可编辑模式（仅list类型下生效） | enum:<br>&nbsp;"normal"<br>&nbsp;"editable" | "normal" |
| leftHeader | 自定义左侧标题 | string | |
| rightHeader | 自定义右侧标题 | string | |
| items | 左边内容条目，项可为字符串或对象 `{text, isMovable}`，isMovable为false时不可移动 | array | [] |
| selectedItems | 已选择条目，项可为字符串或对象 `{text, isMovable}`，isMovable为false时不可移动 | array | [] |
| nodeKey | 树节点标识属性名 | string | 'id' |
| leftExpandAll | 是否展开左侧树所有节点 | boolean | false |
| rightExpandAll | 是否展开右侧树所有节点 | boolean | false |
| expandedKeysL | 设置左侧树默认展开的节点，其值为节点标识，如：['1000', '1001'] | array | [] |
| expandedKeysR | 设置右侧树默认展开的节点，其值为节点标识，如：['1000', '1001'] | array | [] |
| leftTreeDisabled | 当type为tree时，是否禁用左侧树 | boolean | false |
| rightTreeDisabled | 当type为tree时，是否禁用右侧树 | boolean | false |
| itemOrderChanger | 是否支持右侧数据项调整顺序，只有当type='list'时才生效 | boolean | false |
| filterable | 是否可过滤，只有当type='list'时才生效 | boolean | false |
| filterInputProps | 配置过滤输入框属性，可分别设置左右两侧SearchInput的属性 | {left?: object, right?: object} | {left: {}, right: {}} |
| checkboxMode | aui3-1模式下是否开启checkbox选中模式：左侧项勾选时移至右侧，右侧项取消勾选时移至左侧。支持type=list和type=tree，仅当version=aui3-1时生效 | boolean | false |
| onLeftItemSelect | 左侧item点击事件。type为list时：value为当前点击的数据项；type为tree时：node为当前点击的节点信息 | function(value/item) | |
| onRightItemSelect | 右侧item点击事件。type为list时：value为当前点击的数据项；type为tree时：node为当前点击的节点信息 | function(value/item) | |
| onMoveToRight | 将数据移动到右边的回调。type为list时参数为移动的数据项数组；type为tree时参数为(nodeKeys, mergedData) | function(data) | |
| onMoveToLeft | 将数据移动到左边的回调。type为list时参数为移动的数据项数组；type为tree时参数为(nodeKeys, mergedData) | function(data) | |
| onRightOrderChange | 右侧项顺序变更事件，参数为顺序变更后的右侧数据数组 | function(data) | |
| onLeftItemDoubleClick | 左侧item双击事件，参数为(nodeKey, node, event) | function(nodeKey, node, event) | |
| onRightItemDoubleClick | 右侧item双击事件，参数为(nodeKey, node, event) | function(nodeKey, node, event) | |
| onLeftExpand | 左侧树展开/收起回调 | function(expandedKeys, node) | |
| onRightExpand | 右侧树展开/收起回调 | function(expandedKeys, node) | |
| onFilter | 过滤输入时的回调，参数为过滤关键词 | function(str) | |
| version | 组件版本 | string | |
| theme | 组件主题 | string | |

### 可编辑模式属性（model='editable'时额外支持的属性）

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| isValidateEditColumn | 编辑列校验回调 | function(value, text) => unknown | |
| getSelectedData | 右侧数据变更回调 | function(data) => unknown | |
| onUpdateLeftRightEditItems | 更新左右编辑项回调 | function(items, selectedItems) => unknown | |
| onUpdateData | 数据更新回调 | function(currentData, items) => unknown | |
| getRightItemsForTable | 获取右侧表格数据回调 | function(selectedItems) => unknown | |
| getData | 右侧数据变更回调 | function(data) => unknown | |


## 注意

为了保持左右两侧数据顺序的一致性，组件默认以右侧数据项为主。表象就是左侧项目移到右侧时，位置处于右侧原有项的下面。

如果组件启用了itemOrderChanger，当项目顺序有移动行为发生时，组件保存的初始左右侧顺序会被设置为当前顺序。

## 使用示例

### 列表模式

```jsx
import React, { useState } from 'react';
import DoubleSelect from 'eview-ui/DoubleSelect';
import Button from 'eview-ui/Button';

export const ListDemo = () => {
  const items = [
    { text: 'Computing' },
    { text: 'Mgmt & Deployment', isMovable: false },
    { text: 'Storage' },
    { text: 'Application' },
    { text: 'System' },
    { text: 'RAM' },
    { text: 'Memory' },
    { text: 'Mouse' },
    { text: 'Keyboard' },
    { text: 'Monitor' },
  ];
  const [selectedItems, setSelectedItems] = useState([]);

  const handleMoveToRight = (data) => {
    console.log('move to right:', data);
  };

  const handleMoveToLeft = (data) => {
    console.log('move to left:', data);
  };

  return (
    <div>
      <DoubleSelect
        leftHeader='Available NE'
        rightHeader='Selected NE'
        items={items}
        selectedItems={selectedItems}
        itemOrderChanger={true}
        onMoveToRight={handleMoveToRight}
        onMoveToLeft={handleMoveToLeft}
      />
    </div>
  );
};
```

### 树模式

```jsx
import React, { useState } from 'react';
import DoubleSelect from 'eview-ui/DoubleSelect';

export const TreeDemo = () => {
  const [leftTreeData, setLeftTreeData] = useState([
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
  ]);
  const [rightTreeData, setRightTreeData] = useState([]);

  const handleMoveToRight = (data) => {
    console.log('move to right:', data);
  };

  const handleMoveToLeft = (data) => {
    console.log('move to left:', data);
  };

  const handleLeftItemDoubleClick = (nodeKey, node, event) => {
    console.log('left double click:', nodeKey, node);
  };

  const handleRightItemDoubleClick = (nodeKey, node, event) => {
    console.log('right double click:', nodeKey, node);
  };

  return (
    <div>
      <DoubleSelect
        leftHeader='Available NE'
        rightHeader='Selected NE'
        type='tree'
        items={leftTreeData}
        selectedItems={rightTreeData}
        onMoveToRight={handleMoveToRight}
        onMoveToLeft={handleMoveToLeft}
        onLeftItemDoubleClick={handleLeftItemDoubleClick}
        onRightItemDoubleClick={handleRightItemDoubleClick}
      />
    </div>
  );
};
```

### 不可移动项与ref方法

通过设置 `isMovable: false` 可以禁止某些项被移动。通过ref可调用 `getLeftItems`/`getRightItems` 获取当前数据。

```jsx
import React, { useState, useRef } from 'react';
import DoubleSelect from 'eview-ui/DoubleSelect';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';

export const ImmovableDemo = () => {
  const doubleSelectRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [items] = useState([
    { text: 'Computing' },
    { text: 'Mgmt & Deployment', isMovable: false },
    { text: 'Storage' },
    { text: 'System' },
    { text: 'RAM' },
    { text: 'Memory' },
  ]);
  const [selectedItems, setSelectedItems] = useState([
    { text: 'Application', isMovable: false }
  ]);

  const handleGetLeftItems = () => {
    const leftItems = doubleSelectRef.current?.getLeftItems();
    setMsg('LeftItems: ' + JSON.stringify(leftItems));
  };

  const handleGetRightItems = () => {
    const rightItems = doubleSelectRef.current?.getRightItems();
    setMsg('RightItems: ' + JSON.stringify(rightItems));
  };

  return (
    <div>
      <DoubleSelect
        ref={doubleSelectRef}
        leftHeader='Available NE'
        rightHeader='Selected NE'
        items={items}
        selectedItems={selectedItems}
        onMoveToRight={(data) => console.log('move to right:', data)}
        onMoveToLeft={(data) => console.log('move to left:', data)}
      />
      <div style={{ marginTop: '10px' }}>
        <Button text='getLeftItems' onClick={handleGetLeftItems} style={{ marginLeft: '20px' }} />
        <Button text='getRightItems' onClick={handleGetRightItems} style={{ marginLeft: '20px' }} />
      </div>
      {msg && <DivMessage text={msg} type='success' style={{ marginTop: '10px', width: '560px' }} />}
    </div>
  );
};
```

### 可过滤与checkbox模式

```jsx
import React, { useState } from 'react';
import DoubleSelect from 'eview-ui/DoubleSelect';

export const FilterDemo = () => {
  const items = [
    { text: 'Computing' },
    { text: 'Storage' },
    { text: 'Application' },
    { text: 'System' },
    { text: 'RAM' },
  ];
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <div>
      <DoubleSelect
        leftHeader='Available'
        rightHeader='Selected'
        items={items}
        selectedItems={selectedItems}
        filterable={true}
        filterInputProps={{
          left: { maxLengthInput: 50 },
          right: { maxLengthInput: 50 },
        }}
        onMoveToRight={(data) => console.log('move to right:', data)}
        onMoveToLeft={(data) => console.log('move to left:', data)}
      />
    </div>
  );
};
```

