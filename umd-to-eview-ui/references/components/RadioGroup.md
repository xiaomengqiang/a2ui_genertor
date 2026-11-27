# RadioGroup 单选组

> 分类：数据录入

This component is used to define a set of radio boxes that can customize the selected items, as well as the location of the radio boxes and text, while supporting selected call changes and custom styles.

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法     | eview 写法   | 迁移要点                                                                                                                                                           |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Radio.Group` | `RadioGroup` | **`data=[{value, text}]`**（不是 options）；`onChange(value, oldValue, event)`（带 oldValue）；无 `buttonStyle`（Radio.Button 场景转 SelectCard）；无 `optionType` |

## API

| 方法名   | 描述                                   | 参数 | 返回值             |
| -------- | -------------------------------------- | ---- | ------------------ |
| getValue | 用来获取一组单选框中被选中的值         | 无   | 单选框组的值       |
| validate | 用来手动进行非空校验，返回是否通过校验 | 无   | 校验结果，boolean类型 |

### 属性

| 属性名称       | 描述                                                                                                                                                                                                        | 输入                                         | 默认     |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :------- |
| data           | 设置RadioGroup的数据：let radios1=[{value:1,text:"MALE"},{value:2,text:"222"},{value:3,text:"333", disabled:true}] value为数据库存取值，text为文本展示值                                                    | array                                        |          |
| label          | 设置radioGroup的文本子名称                                                                                                                                                                                  | string                                       |          |
| id             | 设置RadioGroup的id                                                                                                                                                                                          | string                                       |          |
| className      | 通过自定义class来改变RadioGroup的整体样式 例如：margin、padding                                                                                                                                             | string                                       |          |
| style          | 通过自定义style来改变RadioGroup的整体样式 例如：margin、padding                                                                                                                                             | object                                       |          |
| labelClassName | 通过添加class的方式控制label的样式，可用来调节单选组和单选组文本名字之间的间距                                                                                                                              | string                                       |          |
| labelStyle     | 通过添加style的方式控制label的样式，可用来调节单选组和单选组文本名字之间的间距                                                                                                                              | object                                       |          |
| labelPosition  | 设置radioGroup文本值对于radioGroup的位置 before代表文本值在radioGroup的左边，after代表文本值在radioGroup的右边                                                                                              | enum:<br>&nbsp;'before'<br>&nbsp;'after'<br> | "before" |
| value          | 设置选中的value值                                                                                                                                                                                           | any                                          |          |
| required       | 设置组件是否为必填项                                                                                                                                                                                        | boolean                                         | false    |
| disabled       | 设置组件的灰化状态                                                                                                                                                                                          | boolean                                         | false    |
| onChange       | 设置RadioGroup的onClick事件，会传递参数为：<br><br>**签名:**<br>`function(value: any, oldValue: any, event: object) => void`<br>_value:_ 当前选中值<br>_oldValue:_ 上次选中值<br>_event:_ 原生dom的点击事件 | function                                     |          |

## 使用示例

### 基本属性设置

单选祖默认样式

```jsx
import RadioGroup from "eview-ui/RadioGroup";

const data = [
  { value: 1, text: "MALE", description: "MALE" },
  { value: 2, text: "FEMALE", description: "FEMALE" },
  { value: 3, text: "NONE", description: "NONE" },
];

<RadioGroup label="单选组" data={data} />
```

### 自定义单选组

自定义单选组间距

```jsx
import RadioGroup from "eview-ui/RadioGroup";

// 自定义纵向展示：rows 格式 "起始:数量|..."，rowSpacing 控制行间距
const data = [
  { value: 1, text: "说明文字", description: "说明文字" },
  { value: 2, text: "说明文字", description: "说明文字" },
  { value: 3, text: "说明文字", description: "说明文字" },
];
<RadioGroup
  label="自定义纵向展示"
  rowSpacing="50px"
  rows={"1:1|2:2|3:3"}
  data={data}
/>

// 自定义横向间距：colSpacing 控制列间距
const data2 = [
  { value: 1, text: "MALE" },
  { value: 2, text: "FEMALE" },
  { value: 3, text: "NONE" },
];
<RadioGroup label="自定义横向间距" colSpacing="100px" data={data2} />
```
