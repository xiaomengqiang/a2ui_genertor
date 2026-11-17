# Radio 单选框

> 分类：数据录入

该组件使用时要设置单选框的展示文本值和入库value值，并且可以自己选择文本与单选框的位置（文本在单选框的在左边或右边），同时具有选中状态和灰化状态，支持单选框状态改变事件的回调。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点                                                                                       |
| --------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `Radio`   | `Radio`    | `label` prop（= children）；`onChange(value, event)`（首参是值）；`labelPosition` 默认 `after` |

## API

| 方法名   | 描述                     | 参数 | 返回值     |
| -------- | ------------------------ | ---- | ---------- |
| getValue | 用来获取被选中单选框的值 | 无   | 单选框的值 |
| focus    | 用来设置radio的聚焦状态  | 无   | 无         |

### 属性

| 属性名称       | 描述                                                                                                                                                            | 输入                                         | 默认    |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :------ |
| id             | 设置radio的id                                                                                                                                                   | string                                       |         |
| className      | 通过自定义class改变radio的整体样式,作用于最外层div 例如：margin、padding、font                                                                                  | string                                       |         |
| style          | 通过自定义style改变radio的整体样式,作用于最外层div 例如：margin、padding、font                                                                                  | object                                       |         |
| labelClassName | 通过添加class的方式控制label的样式以及文本值与radio之间的间距                                                                                                   | string                                       |         |
| labelStyle     | 通过添加style的方式控制label的样式以及文本值与radio之间的间距                                                                                                   | object                                       |         |
| radioClassName | 通过自定义class改变radio的样式 例如：颜色、尺寸                                                                                                                 | string                                       |         |
| radioStyle     | 通过自定义style改变radio的样式 例如：颜色、尺寸                                                                                                                 | object                                       |         |
| label          | 设置radio的展示文本值                                                                                                                                           | string                                       |         |
| labelPosition  | 设置radio的文本值在radio图标的左侧还是右侧 before代表文本在radio的左边，after表示文本在radio的右边                                                              | enum:<br>&nbsp;'before'<br>&nbsp;'after'<br> | "after" |
| tipText        | 配置radio气泡提示内容                                                                                                                                           | string                                       |         |
| tipData        | 配置radio气泡提示 ，参考[Tooltip](./Tooltip.md)                                                                                                         | object                                       | {}      |
| value          | 设置radio的存入数据库的value值                                                                                                                                  | any                                          |         |
| checked        | 设置radio是否选中                                                                                                                                               | bool                                         | false   |
| disabled       | 设置radio是否灰化                                                                                                                                               | bool                                         | false   |
| onChange       | 设置radio的选中事件<br><br>**签名:**<br>`function(value: any, event: object) => void`<br>_value:_ 用户在properties中传入的value值<br>_event:_ 原生dom的点击事件 | function                                     |         |
| onFocus        | 设置radio的聚焦事件<br><br>**签名:**<br>`function(value: any, event: object) => void`<br>_value:_ 用户在properties中传入的value值<br>_event:_ 原生dom的聚焦事件 | function                                     |         |

## 使用示例

### 基本属性设置

```jsx
import Radio from "eview-ui/Radio";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class RadioExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let style = { margin: "20px 20px" };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Radio_example">
          <Radio
            value="1"
            label="Male"
            checked={true}
            style={style}
            tipText="Male"
            tipData={{ disposeTimeOut: 3000 }}
          ></Radio>
          <Radio
            value="1"
            label="Female"
            style={style}
            tipText="Female"
          ></Radio>
          <Radio
            value="1"
            label="Male"
            checked={true}
            disabled={true}
            style={style}
            tipText="Male"
          ></Radio>
          <Radio value="1" label="Female" disabled={true} style={style}></Radio>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<RadioExample />, mountNode);
```
