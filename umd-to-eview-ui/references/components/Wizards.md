# Wizards 步骤条

> 分类：导航

给输入的内容分类，按步骤呈现。建议不超过 5 步。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Steps`   | `Wizards`  | `current`→**`currentStep`（对应 `data[].value` 不是下标！）**；`items`→**`data=[{text, value, description?}]`**（`title`→`text`；value 不配默认序号 1,2,3…但**回跳依赖 value 唯一**）；`onClick`→data 项级 **`onStepClick(index)`**；`size`: antd default/small→`large`/`medium`/`small`/`mini`（**antd `small` 值同名但档位整体偏移**）；`direction="vertical"`→**`orientation="vertical"`**；`type="navigation"`→`isArrowType`（仅水平）；`progressDot` 无对应；`labelPlacement` 无对应；**建议不超过 5 步**（文档）；`isBacktrackable`（仅箭头型，需中间无跳过） |

## API

### 属性

| 属性名称        | 描述                                                                                                                                                                                                                                   | 输入    | 默认  |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :---- |
| id              | 外层容器 id                                                                                                                                                                                                                            | string  |       |
| style           | 外层容器样式                                                                                                                                                                                                                           | object  |       |
| className       | 外层容器 class, 自定义垂直步骤条，可以使用它设置宽高。                                                                                                                                                                                 | string  |       |
| disabled        | 是否禁用                                                                                                                                                                                                                               | boolean |       |
| currentStep     | 当前进行到的步骤,对应 data 中的 value 值，默认为第一步                                                                                                                                                                                 | string  |       |
| data            | 导航内容，data = [{text: "Basic Information",value:"1", description:"1"},{text: "Condition",value:"2",description:"2"},{text: "Action",value:"3",description:"2"}] 不配置 value 时序号默认为 1、2、3..., description为辅助文本（可选） | array   |       |
| isCustomStep    | 是否自定义步骤条                                                                                                                                                                                                                       | bool    | false |
| isBacktrackable | 是否回溯步骤，仅箭头型步骤条支持(需业务限制中间无跳过步骤) ，且data中的value为主键不重复。                                                                                                                                             | bool    | false |

### 自定义步骤条属性

| 属性名称         | 描述                                                                                                                                                                                                                          | 输入                | 默认     |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ | :------- |
| id               | 外层容器 id                                                                                                                                                                                                                   | string              |          |
| disabled         | 是否禁用                                                                                                                                                                                                                      | boolean             |          |
| currentStep      | 当前进行到的步骤,对应 data 中的 value 值，默认为第一步                                                                                                                                                                        | string              |          |
| data             | 导航内容，data = [{text: "Basic Information",value:"1"， description："test", onStepClick:()=>{}},{text: "Condition",value:"2"},{text: "Action",value:"3"}] 不配置 value 时序号默认为 1、2、3..., description为辅助文本(可选) | array               |          |
| titleStyle       | 可以设置标题的样，注意设置 maxwidth 要适配不同分辨率。                                                                                                                                                                        | React.CSSProperties |          |
| descriptionStyle | 可以设置所有辅助文本样， 注意设置 maxwidth 要适配不同分辨率。                                                                                                                                                                 | React.CSSProperties |          |
| size             | 设置步骤条尺寸，包括大中小与 最小,配置值'large'（大）,'medium'(中）,'small'(小),'mini'(最小)                                                                                                                                  | string              | 'medium' |
| orientation      | 设置步骤条尺寸，包括水平与垂直，配置值'horizontal'(水平),'vertical'(垂直)                                                                                                                                                     | string              |          |
| isArrowType      | 是否支持箭头型步骤条， 仅支持水平。                                                                                                                                                                                           | bool                | false    |

### 自定义步骤条 data 属性

| 属性名称          | 描述                                                                                                 | 输入                    | 默认 |
| :---------------- | :--------------------------------------------------------------------------------------------------- | :---------------------- | :--- |
| text              | 步骤标题                                                                                             | string                  |      |
| value             | 步骤 value                                                                                           | string                  |      |
| description       | 辅助文本内容                                                                                         | string                  |      |
| onStepClick       | 步骤选中事件,可以设置点击选中                                                                        | onStepClick:(index)=>{} |      |
| status            | 步骤状态，可选字段，目前仅支持 error，表示错误状态。                                                 | string                  |      |
| iconName          | 使用 icon 图标库已有的图标，参考 icon 组件                                                           | string                  |      |
| customIcon        | 使用本地的 icon, customIcon 与 iconName 同时使用时 customIcon 生效                                 | string                  |      |
| customDescription | 支持自定义辅助文本（仅自定义步骤条，配置自定义函数）, 同时配置description，仅customDescription生效。 | () => ReactNode         |      |

## 使用示例

### 基本属性设置

```jsx
import Wizards from "eview-ui/Wizards";

const data = [
  { text: "步骤一", value: "1", description: "辅助文本1" },
  { text: "步骤二", value: "2", description: "辅助文本2" },
  { text: "步骤三", value: "3", description: "辅助文本3" },
  { text: "步骤四", value: "4", description: "辅助文本4" },
  { text: "步骤五", value: "5", description: "辅助文本5" },
];

// currentStep 对应 data 中的 value 值（非下标），建议不超过 5 步
<Wizards
  data={data}
  currentStep="2"
  disabled={false} // 两态：true 禁用 / false 启用
  className="eui_wizard_container_sm"
/>
```

### 自定义步骤条

```jsx
import Wizards from "eview-ui/Wizards";

const customData = [
  {
    text: "步骤一",
    description: "辅助文本1",
    value: "1",
    iconName: "file", // 已入库 icon 名
    customIcon: "huawei", // 本地图标 url；与 iconName 同设时 customIcon 生效
    onStepClick: (index) => {
      // index: 步骤下标
    },
  },
  {
    text: "步骤二",
    description: "辅助文本2",
    value: "2",
    iconName: "folder",
    customIcon: "",
    status: "error", // 错误状态
    onStepClick: (index) => {},
  },
  {
    text: "步骤三",
    description: "辅助文本3",
    value: "3",
    iconName: "operation",
    customIcon: "",
    customDescription: () => {
      // 自定义辅助文本渲染，返回 ReactNode；与 description 同设时仅 customDescription 生效
      return <span>说明文字</span>;
    },
    onStepClick: (index) => {},
  },
  {
    text: "步骤四",
    description: "辅助文本4",
    value: "4",
    iconName: "",
    customIcon: "salescatalog", // 本地图标 url
    onStepClick: (index) => {},
  },
];

<Wizards
  data={customData}
  currentStep="2"
  isCustomStep
  disabled={false}
  size="medium" // 'large'|'medium'|'small'|'mini'
  orientation="horizontal" // 'horizontal'|'vertical'
  className="eui_wizard_container_sm"
/>
```

### 箭头型步骤条

```jsx
import Wizards from "eview-ui/Wizards";

// 箭头型（仅标题）：isArrowType 仅支持水平
const customData = [
  { text: "步骤一", value: "1", iconName: "file", customIcon: "huawei", onStepClick: (index) => {} },
  { text: "步骤二", value: "2", iconName: "folder", status: "error", onStepClick: (index) => {} },
  { text: "步骤三", value: "3", iconName: "operation", onStepClick: (index) => {} },
  { text: "步骤四", value: "4", customIcon: "salescatalog", onStepClick: (index) => {} },
  { text: "步骤五", value: "5", customIcon: "salescatalog", onStepClick: (index) => {} },
];

<Wizards
  data={customData}
  currentStep="2"
  isCustomStep
  isArrowType
  disabled={false}
  size="medium"
  orientation="horizontal"
  className="eui_wizard_container_sm"
/>;

// 箭头型（标题 + 辅助文本）
const customData2 = [
  { text: "步骤一", description: "辅助文本1", value: "1", iconName: "file", customIcon: "huawei", onStepClick: (index) => {} },
  { text: "步骤二", description: "辅助文本2", value: "2", iconName: "folder", status: "error", onStepClick: (index) => {} },
  { text: "步骤三", description: "辅助文本3", value: "3", iconName: "operation", onStepClick: (index) => {} },
  { text: "步骤四", description: "辅助文本4", value: "4", customIcon: "salescatalog", onStepClick: (index) => {} },
  { text: "步骤五", description: "辅助文本5", value: "5", customIcon: "salescatalog", onStepClick: (index) => {} },
];

<Wizards
  data={customData2}
  currentStep="2"
  isCustomStep
  isArrowType
  size="medium"
  orientation="horizontal"
  className="eui_wizard_container_sm"
/>;
```
