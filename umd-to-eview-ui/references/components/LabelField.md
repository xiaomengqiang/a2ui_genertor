# LabelField 标签

> 分类：数据录入

文本标签组件，主要用于表单中。支持自定义样式，通过required属性设置是否必须。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法      | eview 写法                       | 迁移要点                                                                                                                             |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `Descriptions` | `LabelField` + `GridLayout` 组合 | 轻量键值：`LabelField text`（+`required` 显星号）；多列用 Row/Col 排布；复杂态见 [handwrite-templates.md](handwrite-templates.md) §3 |

## API

### 属性

| 属性名称   | 描述                                                                                                              | 输入      | 默认  |
| :--------- | :---------------------------------------------------------------------------------------------------------------- | :-------- | :---- |
| id         | 组件默认设置动态id，且组件支持用户自定义id                                                                        | string    |       |
| className  | 通过class的方式自定义样式，作用于label元素                                                                        | string    |       |
| style      | 通过style的方式自定义样式，作用于label元素                                                                        | object    |       |
| text       | 支持通过text设置组件文本内容                                                                                      | string    |       |
| children   | 支持设置组件的子标签                                                                                              | ReactNode |       |
| required   | 设置是否是必填项，为true时，文字前面加星号                                                                        | bool      | false |
| useFakeCls | 是否使用伪类表示必填星号。为true时使用CSS伪类渲染星号样式，为false时使用独立span元素渲染星号（兼容Firefox）       | bool      | false |
| onClick    | 设置组件的点击事件<br><br>**签名:**<br>`function(event: React.MouseEvent) => void`<br>_event:_ React 合成鼠标事件 | function  |       |
| version    | 传入该值可定制当前组件匹配的ucd规范，不传则默认aui2规范，例如 `version='aui3'`                                    | string    |       |
| theme      | 传入该值可定制当前组件匹配的主题模式样式，不传则默认白天模式，例如 `theme='evening'`                              | string    |       |
| htmlFor    | 指定label关联的表单元素id，与原生HTML label的for属性一致                                                          | string    |       |

## 使用示例

### 基本属性设置





```jsx
import LabelField from "eview-ui/LabelField";

<LabelField text="Default style" />
<LabelField text="Mandatory style" required={true} />
<LabelField text="UseFakeCls style" required={true} useFakeCls={true} />
```
