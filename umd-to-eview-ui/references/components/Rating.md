# Rating 评分

> 分类：数据录入

评分组件。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点                                                                                                                                                                                                                            |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Rate`    | `Rating`   | `count`→**`starCount`**；`allowHalf`→`half`；**`onChange`→`onClick(event, value)`（event 在前！且事件名是 onClick 不是 onChange）**；`allowClear` 默认 **false**（antd 默认 true）；`character`→`iconName`（字符串）；无 `tooltips` |

## API

### 属性

| 属性名称       | 描述                                                                              | 输入                           | 默认                       |
| :------------- | :-------------------------------------------------------------------------------- | :----------------------------- | :------------------------- |
| id             | 设置rating的id                                                                    | string                         |                            |
| className      | 通过自定义class改变rating的整体样式，作用于最外层div 例如： margin、padding、font | string                         |                            |
| value          | 设置rating的值                                                                    | number                         | 0                          |
| starCount      | 设置rating的最大值                                                                | number                         | 5                          |
| disabled       | 设置rating是否灰化                                                                | boolean                           | false                      |
| half           | 设置rating是否支持半星评分                                                        | boolean                           | false                      |
| allowClear     | 是否允许再次点击后清除                                                            | boolean                           | false                      |
| starColor      | 设置rating选中的颜色                                                              | string                         | '#fed900'                  |
| emptyStarColor | 设置rating未选中的颜色                                                            | string                         | '#808080'                  |
| iconName       | 通过传入name的方式，使用组件库中的已有图标                                        | string                         |                            |
| size           | 设置图标的大小                                                                    | number                         | FontUtil.convertRemToPx(2) |
| onClick        | 设置rating的点击事件                                                              | function(event, value: number) |                            |

## 使用示例

### 基本属性设置

```jsx
import Rating from "eview-ui/Rating";

<Rating value={3} starCount={5} half={false} iconName="star" />
<Rating value={3} starCount={5} half={false} iconName="star" size={32} />
<Rating value={3} starCount={5} half={true} iconName="star" size={32} /> {/* 半星评分 */}
<Rating value={3} starCount={5} half={false} iconName="star" size={24} disabled={true} />
```
