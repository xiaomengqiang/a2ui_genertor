# TreeSelect 下拉树选框

> 分类：数据录入

该组件用来设置树形多选下拉框，并在输入框提供当前选中的列表的预览。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法    | eview 写法   | 迁移要点                                                                                                                                                                                                                                                                                       |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TreeSelect` | `TreeSelect` | **组合式**：`treeProps`（**必传**，Tree 的 props 全部下钻）+ `selectBoxProps`（**不允许传 ref**）；无 treeData/value 一等 prop——antd `treeData`→`treeProps.data`、`onChange`→`treeProps.onCheck`（勾选模式）或 `treeProps.onSelect`；`treeNodeLabelProp` 无对应（用 `tagRenderer` 自定义显示） |

## API

### 属性

| 属性名称          | 描述                                                                                                                         | 输入                                | 默认 |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------- | :---------------------------------- | :--- |
| treeProps         | 必传，tree组件的props，默认selectBox获取checkedKeys值显示内容，enableCheckbox为false则获取selectedKeys，详情参考tree组件文档 |                                     |      |
| selectBoxProps    | selectBox的props， 可以传入一个div的属性，不允许传ref                                                                        |                                     |      |
| className         | 容器className                                                                                                                | string                              |      |
| style             | 容器style                                                                                                                    | CSSProperties                       |      |
| popupClassName    | popup的ClassName                                                                                                             | string                              |      |
| popupStyle        | popup的Style                                                                                                                 | CSSProperties                       |      |
| tagRenderer       | 自定义 selectBox 显示内容                                                                                                    | (keys: string[]) => React.ReactNode |      |
| getPopupContainer | 获取渲染父节点, 设为false时为元素虚拟dom的原位置                                                                             | (() => HTMLElement) &#124; false    |      |

## 使用示例

### 基本属性设置

```jsx
import TreeSelect from "eview-ui/TreeSelect";

const treeData = [
  {
    text: "Root Node",
    id: 1,
    children: [
      {
        text: "Subnet0",
        id: 11,
        children: [
          { text: "NE_1", id: 21 },
          { text: "NE_2", id: 22 },
        ],
      },
      { text: "NE_3", id: 12 },
    ],
  },
];

<TreeSelect
  treeProps={{
    data: treeData,
    onCheck: (keys) => {
      // keys: string[] 勾选节点 id 数组
    },
  }}
  selectBoxProps={{
    onClick: () => {},
  }}
  popupStyle={{ height: "200px" }}
  tagRenderer={(keys) => keys.join(" ")} // keys: string[] 选中值数组
/>
```
