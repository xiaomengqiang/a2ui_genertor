# ProgressBar 进度条

> 分类：反馈

进度条组件来表示一段加载过程,包含进度条与进度文本两部分，文本格式有百分比与分数。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法  | eview 写法    | 迁移要点                                                                                                                                                                                |
| ---------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Progress` | `ProgressBar` | `percent`→**`current`**；`max` 默认 100；`showInfo`→`format="percent"`（或 `"steps"` 步骤型）；`strokeColor`→`barStyle`；`size` 无对应；`formatter(value, precision, format) => string` |

## API

### 属性

| 属性名称      | 描述                                                                                                                                                                  | 输入                                          | 默认      |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :-------- |
| id            | 进度条组件最外层容器id表识                                                                                                                                            | string                                        |           |
| format        | 进度文本表示形式：百分比                                                                                                                                              | enum:<br>&nbsp;"percent"<br>&nbsp;"steps"<br> | "percent" |
| current       | 当前进度                                                                                                                                                              | number                                        | 0         |
| max           | 最大值，默认值为100，                                                                                                                                                 | number                                        | 100       |
| style         | 进度条组件容器样式，应用于组件最外层容器                                                                                                                              | object                                        |           |
| barStyle      | 进度条样式                                                                                                                                                            | object                                        |           |
| barBackStyle  | 进度条背景样式                                                                                                                                                        | object                                        |           |
| className     | 进度条容器的自定义类名称                                                                                                                                              | string                                        |           |
| labelPosition | 进度条标签位置                                                                                                                                                        | enum:<br>&nbsp;"after"<br>&nbsp;"none"<br>    | "after"   |
| precision     | 自定义 percent 类型进度条精度 , 0 时向下取整                                                                                                                          | number                                        | 0         |
| formatter     | 自定义格式化value，format是百分比（percent）或步骤（steps），precision为精度；格式current与max值。签名:`(value: number, precision: number, format: string) => string` | function                                      | -         |

## 使用示例

### 基本属性设置

```jsx
import ProgressBar from "eview-ui/ProgressBar";

// format="percent"：百分比进度条
<ProgressBar format="percent" id="gee" current={10} />
<ProgressBar format="percent" current={50} />
<ProgressBar format="percent" current={100} labelPosition="none" />
<ProgressBar format="percent" current={100} labelPosition="after" />
// format="steps"：步骤型进度条，max 控制总步数
<ProgressBar format="steps" current={30} max={80} />
<ProgressBar className="progressClassNameTest" format="percent" current={10} />
// 自定义 barStyle / barBackStyle
<ProgressBar
  format="steps"
  current={30}
  max={80}
  style={{ width: "200px", height: "50px" }}
  barStyle={{ background: "#03A9F4", height: "8px", borderRadius: "4px", margin: "-3px 0" }}
  barBackStyle={{ background: "#cccccc", height: "2px", borderRadius: "1px" }}
/>
```

### 进度条加载

```jsx
import ProgressBar from "eview-ui/ProgressBar";

// 受控加载：current 由外部定时器递增更新（0 → 80）
<ProgressBar
  format="steps"
  current={40} // 0 → 80 递增
  max={80}
  style={{ width: "300px" }}
  barStyle={{ background: "#03A9F4", height: "8px", borderRadius: "4px", margin: "-3px 0" }}
  barBackStyle={{ background: "#cccccc", height: "2px", borderRadius: "1px" }}
/>

<ProgressBar format="percent" current={40} max={80} />
```
