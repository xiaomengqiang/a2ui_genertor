# Toggle 开关

> 分类：数据录入

该组件用于表示某些场景的on/off状态,可以通过接口getValue获取当前状态值。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点                                                                                                                                                                         |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Switch`  | `Toggle`   | `checked`→**`toggled`**；`onChange`→**`onToggle(value)`**；`data=[关值, 开值]`（值集合，顺序=关闭/开启）；`disabled` 正确拼写保留；无 `loading`/`size`；文档推荐设置 data 默认值 |

## API

| 方法名   | 描述                         | 参数 | 返回值           |
| -------- | ---------------------------- | ---- | ---------------- |
| getValue | 切换框当前表示on/off状态的值 | 无   | 切换框当前状态值 |

### 属性

| 属性名称       | 描述                                                                                                                                                                                       | 输入                                         | 默认     |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :------- |
| id             | 切换框根节点的id。                                                                                                                                                                         | string                                       |          |
| className      | 切换框最外层div的样式类名。                                                                                                                                                                | string                                       |          |
| style          | 覆盖切换框最外层div的行内样式。                                                                                                                                                            | object                                       |          |
| labelClassName | 通过添加class的方式控制label的样式,以及展示文本与组件之间的间距                                                                                                                            | string                                       |          |
| labelStyle     | 通过添加style的方式控制label的样式,以及展示文本与组件之间的间距                                                                                                                            | object                                       |          |
| data           | 切换框不同状态下的值集合，默认圆圈在左边时表示关闭状态，圆圈在右边时表示开启状态， 比如["33","44"],第一个值表示关闭状态下的值，第二个值表示开启状态下的值， 这个属性可选，推荐设置默认值。 | array                                        |          |
| label          | 设置组件的展示文本值                                                                                                                                                                       | string                                       |          |
| labelPosition  | 设置组件的文本值在组件图标的左侧还是右侧 before代表文本在组件的左边，after表示文本在组件的右边                                                                                             | enum:<br>&nbsp;'before'<br>&nbsp;'after'<br> | "before" |
| toggled        | 设置开启切换框，默认关闭。                                                                                                                                                                 | bool                                         | false    |
| disabled       | 设置禁用切换框，默认关闭。                                                                                                                                                                 | bool                                         | false    |
| onToggle       | 点击切换框时的回调。使用时需传data。并且此时toggled属性由用户维护。<br><br>**签名:**<br>`function(value: any) => void`<br>_value:_ 点击文本切换框时当前状态值                              | function                                     |          |

## 使用示例

### 基本属性设置

```jsx
import Toggle from "eview-ui/Toggle";

<Toggle toggled={true} /> {/* 开启态 */}
<Toggle /> {/* 关闭态（默认） */}
<Toggle toggled={true} disabled={true} /> {/* 禁用开启态 */}
<Toggle disabled={true} /> {/* 禁用关闭态 */}
```

### 事件处理

```jsx
import Toggle from "eview-ui/Toggle";

const data = [1, 2]; // [关闭值, 开启值]

<Toggle
  data={data}
  toggled={false} // 受控：由 onToggle 回写
  onToggle={(value) => {
    // value 是当前状态值（data 中对应项），取 value 更新 toggled
  }}
  ref={(toggle) => {
    // toggle.getValue() 取当前状态值
  }}
/>
```
