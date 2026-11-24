# SelectCard 单选块

> 分类：数据录入

该组件用来设置单选块，组件默认支持尺寸不同的两种类型的单选块，同时支持自定义样式。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                    | eview 写法   | 迁移要点                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Radio.Button` / `Segmented` | `SelectCard` | `data=[{value, text}]`；`onChange(value, event)`（首参即选中值）；`defaultValue`→初始 `value` state（**`value=null` 时取消所有选择**）；`size`→`type`（`default`/`small`，值域不同）；禁用是 **`disable`**（不是 disabled，拼写异常表）；仅适合 ≤7 项的单行展示（文档警告）；`block` 无对应（宽度走 style） |

## API

| 方法名   | 描述                          | 参数 | 返回值           |
| -------- | ----------------------------- | ---- | ---------------- |
| getValue | 用来获取单选块选中项的value值 | 无   | 单选块选中项的值 |

### 属性

| 属性名称       | 描述                                                                                                                                                                                                                                                                                          | 输入                                          | 默认      |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :-------- |
| id             | 设置组件的id                                                                                                                                                                                                                                                                                  | string                                        |           |
| className      | 通过添加class的方式设置组件样式，作用于组件最外层div，可设置组件margin padding                                                                                                                                                                                                                | string                                        |           |
| style          | 通过styke的方式设置组件样式，作用于组件最外层div，可设置组件margin padding                                                                                                                                                                                                                    | object                                        |           |
| itemClassName  | 通过添加class的方式设置组件单选块样式                                                                                                                                                                                                                                                         | string                                        |           |
| itemStyle      | 通过添加style的方式设置组件单选块样式                                                                                                                                                                                                                                                         | object                                        |           |
| labelClassName | 通过添加class的方式自定义label的名称的样式                                                                                                                                                                                                                                                    | string                                        |           |
| labelStyle     | 通过添加style的方式自定义label的名称的样式                                                                                                                                                                                                                                                    | object                                        |           |
| type           | 设置组件的类型，默认为大尺寸单选块                                                                                                                                                                                                                                                            | enum:<br>&nbsp;"default"<br>&nbsp;"small"<br> | "default" |
| data           | 设置组件的数据，例如：[{value:1,text:"100MB"},{value:2,text:"200MB"},{value:3,text:"500MB"},{value:3,text:"800MB"}]。注意：该组件适用于单行展示少量单选块（一般不超过七项），如果选项较多（如果容器宽度不够，可能导致选项文字显示不完整），可使用下拉框组件或者通过自定义样式的方式更好的展示 | array                                         |           |
| value          | 通过value设置组件的选中项                                                                                                                                                                                                                                                                     | any                                           |           |
| label          | 设置下拉框的名称文字                                                                                                                                                                                                                                                                          | string                                        |           |
| labelPosition  | 设置组件名称文字的位置 before代表名称文字在组件的前面，after代表名称文字在组件的后面                                                                                                                                                                                                          | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br>  | "before"  |
| required       | 设置组件是否需要                                                                                                                                                                                                                                                                              | bool                                          |           |
| onChange       | 设置组件的onChange事件<br><br>**签名:**<br>`function(value: any, event: object) => void`<br>_value:_ 当前选中的选项值<br>_event:_ 原生dom的点击事件                                                                                                                                           | function                                      |           |

## 使用示例

### 基本属性设置

```jsx
import SelectCard from "eview-ui/SelectCard";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class SelectCardExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { value: 1, text: "100MB" },
      { value: 2, text: "200MB" },
      { value: 3, text: "500MB" },
      { value: 4, text: "800MB" },
      { value: 5, text: "1GB" },
    ];
    let data1 = [
      { value: 1, text: "Day" },
      { value: 2, text: "Month" },
      { value: 3, text: "Year" },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_SelectCard_example" style={{ marginLeft: "20px" }}>
          <SelectCard label="Default" data={data} value={2} required={true} />
          <SelectCard
            label="Small"
            data={data1}
            value={1}
            type="small"
            style={{ marginTop: "20px" }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SelectCardExample />, mountNode);
```

### 事件处理

```jsx
import SelectCard from "eview-ui/SelectCard";
import Button from "eview-ui/Button";
import DivMessage from "eview-ui/DivMessage";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class SelectEventExample extends React.Component {
  state = {
    msg: "",
    selectedValue: undefined,
  };

  handleChange = (value) => {
    this.setState({
      msg: "onChange event callback: The currently selected item is：" + value,
      selectedValue: value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { value: 1, text: "100MB" },
      { value: 2, text: "200MB" },
      { value: 3, text: "500MB" },
      { value: 4, text: "800MB" },
      { value: 5, text: "1GB" },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_SelectCard_example" style={{ marginLeft: "20px" }}>
          <SelectCard
            data={data}
            onChange={this.handleChange}
            value={this.state.selectedValue}
          />
          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{ marginTop: "10px", width: "600px" }}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SelectEventExample />, mountNode);
```

### 改变数据

```jsx
import SelectCard from "eview-ui/SelectCard";
import Button from "eview-ui/Button";
import DivMessage from "eview-ui/DivMessage";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class SelectCardChangeData extends React.Component {
  state = {
    msg: "",
    data: [
      { value: 1, text: "100MB" },
      { value: 2, text: "200MB" },
      { value: 3, text: "500MB" },
      { value: 4, text: "800MB" },
      { value: 5, text: "1GB" },
    ],
  };

  handleButtonChangeOption = () => {
    this.setState({
      data: [
        { value: 1, text: "100MB" },
        { value: 2, text: "200MB" },
      ],
      msg: "",
    });
  };

  handleButtonGetValue = () => {
    this.setState({
      msg:
        "getValue API: The currently selected item is：" +
        this.SelectCard.getValue(),
    });
  };

  handleChange = (value) => {
    this.setState({
      msg: "onChange event callback: The currently selected item is：" + value,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_SelectCard_example" style={{ marginLeft: "20px" }}>
          <Button
            text="Change Option"
            style={{ marginLeft: "5px" }}
            onClick={this.handleButtonChangeOption}
          ></Button>
          <Button
            text="getValue"
            style={{ marginLeft: "5px" }}
            onClick={this.handleButtonGetValue}
          ></Button>{" "}
          <br />
          <br />
          <SelectCard
            data={this.state.data}
            onChange={this.handleChange}
            ref={(SelectCard) => {
              this.SelectCard = SelectCard;
            }}
          />
          {this.state.msg ? (
            <DivMessage
              text={this.state.msg}
              type="success"
              style={{ marginTop: "10px", width: "600px" }}
            />
          ) : (
            ""
          )}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SelectCardChangeData />, mountNode);
```

### 带图标的单选块

通过 `leftIcon` `leftIconProps` 设置左图标，`rightIcon` `rightIconProps` 设置右图标。

```jsx
import SelectCard from "eview-ui/SelectCard";
import { getIconBase64 } from "@/shared/SvgIcon";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class SelectCardIconExample extends React.Component {
  state = { iconsSvg: {} };

  componentDidMount() {
    let alive = true;
    // leftIcon/rightIcon 收 string（base64 data URL），用 getIconBase64 异步预载
    Promise.all([
      getIconBase64("plus", { size: 16 }).then(url => ["plus", url]),
      getIconBase64("del", { size: 16 }).then(url => ["del", url]),
    ]).then(entries => {
      if (!alive) return;
      const iconsSvg = Object.fromEntries(entries.filter(([, url]) => url));
      this.setState({ iconsSvg });
    });
    return () => { alive = false; };
  }

  render() {
    const [version, theme] = getDemoVersion();
    const { iconsSvg } = this.state;
    const data = [
      { value: 1, text: "100MB" },
      { value: 2, text: "200MB" },
      { value: 3, text: "500MB" },
    ];
    return (
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_SelectCard_icon_example" style={{ marginLeft: "20px" }}>
          <SelectCard
            label="Left Icon"
            data={data}
            value={1}
            leftIcon={iconsSvg.plus}
          />
          <SelectCard
            label="Right Icon"
            data={data}
            value={2}
            rightIcon={iconsSvg.del}
            style={{ marginTop: "20px" }}
          />
          <SelectCard
            label="Both Icons"
            data={data}
            value={3}
            leftIcon={iconsSvg.plus}
            rightIcon={iconsSvg.del}
            leftIconProps={{ leftIconClass: "my-icon-class" }}
            rightIconProps={{ rightIconClass: "my-icon-class" }}
            style={{ marginTop: "20px" }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SelectCardIconExample />, mountNode);
```
