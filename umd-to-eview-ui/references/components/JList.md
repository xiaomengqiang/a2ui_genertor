# JList JList

> 分类：数据展示

JList is mainly used for display items in list form.

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cex 解析生成迁移计划

| antd 写法 | eview 写法                | 迁移要点                                                                                                                                                                                                                                                                                                                                                 |
| --------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `List`    | `JList`（可选列表）或手写 | `JList` 是**可选列表控件**（有选中态）不是纯展示列表——纯展示 antd List 手写 div 循环；`items=[{text, isEnable?}]` 或纯字符串；`selectedIndex` 下标数组或单个数字；`onClick(event, item, index)`；**`mutiSelectEnable` 拼写**（ctrl+click 多选 / shift+click 范围多选）；文档明言选中值不自动暴露，需 onClick 里主动 `getSelectedItemsIndex()` 回写 state |

## API

| 方法名                | 描述                              | 参数 | 返回值   |
| --------------------- | --------------------------------- | ---- | -------- |
| getSelectedItemsIndex | get the indexes of selected items | 无   | number[] |
| getSelectedItems      | get the selected data             | none | object[] |

### 属性

| Property name    | Description                                                                                                                                                                                                                                                     | Type                  | Default               |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------- | :-------------------- |
| id               | By default, the component set the dynamic id，The component allows users to customize id                                                                                                                                                                        | string                | dynamically generated |
| className        | User-defined style through class, applied to the outermost div                                                                                                                                                                                                  | string                |                       |
| style            | User-defined style through style, applied to the outermost div                                                                                                                                                                                                  | object                |                       |
| disabled         | Set the component cannot be selected                                                                                                                                                                                                                            | bool                  | false                 |
| height           | The height of the custom component                                                                                                                                                                                                                              | number                | 300                   |
| width            | Customizing Component width                                                                                                                                                                                                                                     | number                | 700                   |
| items            | List content items. Each item can be a string or an object `{text, isEnable?}`. If `isEnable` is false, the item can't be selected                                                                                                                              | array{string\|object} | []                    |
| textAlign        | Text align, takes one of "left", "right", "center"                                                                                                                                                                                                              | string                | left                  |
| selectedIndex    | Index of selected items. Can be a single number or an array of numbers                                                                                                                                                                                          | number \| number[]    |                       |
| mutiSelectEnable | If true, multi-select is supported: ctrl+click to toggle individual items, shift+click to select a range                                                                                                                                                        | bool                  | false                 |
| onClick          | Set the click event of the component<br><br>**Signature:**<br>`function(nativeEvent: object, item, index) => void`<br>_nativeEvent:_ The native DOM click event (not React synthetic event)<br>_item:_ The clicked item data<br>_index:_ The clicked item index | function              |                       |
| version          | Version setting for theme, e.g. "aui3", "aui3-1"                                                                                                                                                                                                                | string                |                       |
| theme            | Theme setting, e.g. "dark", "light"                                                                                                                                                                                                                             | string                |                       |

## 接口定义

```typescript
interface JList {
  /**
   * 组件id，默认自动生成
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
   * 设置组件所有按钮的灰化
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
   * 列表内容条目，每项可以是字符串或 {text, isEnable?} 对象。
   * 若 isEnable 为 false 则该项不可选中
   */
  items: Array<string | { text: string; isEnable?: boolean }>;

  /**
   * 已选择条目的索引，支持单个数字或数字数组
   */
  selectedIndex: number | number[];

  /**
   * 列表item点击事件
   *
   * @param {NativeEvent} nativeEvent 原生DOM点击事件（非React合成事件）
   * @param {any} item 当前点击的条目数据
   * @param {number} index 当前点击的条目索引
   */
  onClick: (nativeEvent: object, item: any, index: number) => void;

  /**
   * Text Align, one of "left", "right", "center"
   */
  textAlign: string;

  /**
   * If true, multi-select is supported:
   * ctrl+click to toggle individual items, shift+click to select a range
   */
  mutiSelectEnable: boolean;

  /**
   * Version setting, e.g. "aui3", "aui3-1"
   */
  version: string;

  /**
   * Theme setting, e.g. "dark", "light"
   */
  theme: string;
}
```

## 使用示例

### 基本属性设置

```jsx
import JList from "eview-ui/JList";

const items = [
  { text: "Computing development system" },
  { text: "Mgmt & Deployment system", isEnable: false }, // isEnable:false 不可选
  { text: "High Storage device" },
  { text: "Higly deployed System" },
];

<JList
  items={items}
  selectedIndex={[3, 5]} // 数字数组（多选）；单选传单个数字
  width={500}
  height={240}
  mutiSelectEnable // ctrl+click 多选 / shift+click 范围多选
  textAlign="right"
  onClick={(nativeEvent, item, index) => {
    // nativeEvent: 原生 DOM 事件（非 React 合成事件）, item: 条目数据, index: 索引
    // 选中值不自动暴露，需 ref.getSelectedItemsIndex() 回写
  }}
  ref={(jlist) => {
    // jlist.getSelectedItemsIndex() / getSelectedItems()
  }}
/>
```
