# DragInput 滑动条

> 分类：数据录入

拖拽选择器，可支持数值选择和区间选择。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Slider` | `DragInput` | **`value` 永远是数组**：`type="single"` 默认 `[min]`、`type="range"` 默认 `[min, min]`；`marks` 对象→**`markIndexes` 纯数字数组（要求递增）**；`onChange(value, changeValue)`；`range`→`type="range"`；**无 `disabled` prop**（需要时外层禁用处理）；`displayInput` 默认 true 显示输入框 |

## API


### 属性

| 属性名称 | 描述                                                                                                                                           | 输入 | 默认 |
|:-----|:---------------------------------------------------------------------------------------------------------------------------------------------|:-----|:-----|
| id | 设置组件外层容器的id                                                                                                                                  | string |  |
| style | 通过自定义style来改变EditSelect的整体样式 例如:margin padding width                                                                                         | object |  |
| className | 通过自定义class来改变DragSelect的整体样式 例如:margin padding width                                                                                         | string |  |
| stickClassName | 通过自定义class来改变刻度条的整体样式                                                                                                                        | string |  |
| stickStyle | 通过自定义style来改变刻度条的整体样式                                                                                                                        | object |  |
| stickTotalWidth | 自定义刻度条容器元素的宽度（当不能正确的读取到元素宽度时，渲染会出现问题，此时由使用者传值）                                                                                               | number |  |
| barClassName | 通过自定义class来改变控制钮的整体样式                                                                                                                        | string |  |
| barStyle | 通过自定义style来改变控制钮的整体样式                                                                                                                        | object |  |
| inputStyle | 通过style控制输入框样式                                                                                                                               | object |  |
| inputClassName | 通过class控制输入框样式                                                                                                                               | string |  |
| precision | 精度，表示小数点后保留几位，默认0位                                                                                                                           | number | 0 |
| min | 刻度最小值                                                                                                                                        | number | 0 |
| max | 刻度最大值                                                                                                                                        | number | 100 |
| value | 初始值 type=="range"时默认值为[最小刻度值,最小刻度值] type=="single"时默认值为[最小刻度值]                                                                               | array |  |
| markIndexes | 需要显示刻度值的位置的对应value值的数组 markIndexes:[0,10,15] 该数组要求是递增的                                                                                       | array |  |
| unit | 单位，默认为"",如果需要多个单位，请在labelFormat函数中转换                                                                                                         | string |  |
| labelFormat | 数值转换函数<br><br>**签名:**<br>`function(value: number) => { formatValue: string }`<br>*value:* 当前需要转换的数值<br> *returns* ({ formatValue: string }): 根据当前数值转换的带单位的字符串 | function |  |
| formatter | 格式化当前组件的所有数字，保持同一个格式显示。签名:`(value: number, precision: number) => string` | function | `(value, precision) => value.toFixed(precision)` |
| onChange | 定义组件内容改变时的事件<br><br>**签名:**<br>`function(value: number[], changeValue?: number[]) => void`<br>*value:* 当前组件中选中的项的value集合（数组）<br>*changeValue:* 当前改变的值 | function |  |
| displayInput | 是否显示输入框                                                                                                                                      | boolean | true |
| type | 选择器类型 single：数值选择器，range：区间选择器                                                                                                               | enum:<br>&nbsp;"single"<br>&nbsp;"range"<br> | "single" |
| label | 设置标题文字                                                                                                                                       | string |  |
| labelPosition | 设置标题文字的位置 before代表文字在左边，after代表文字在右边                                                                                                         | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| labelStyle | 通过style设置label样式                                                                                                                             | object |  |
| labelClassName | 通过class设置label样式                                                                                                                             | string |  |

## 使用示例

### 基本样例

基本样例展示

```jsx
import DragInput from 'eview-ui/DragInput';

// type: "single"（数值选择器）/ "range"（区间选择器）；value 永远是数组；markIndexes 要递增
<DragInput
  label="Numerical selector"
  type="single"
  markIndexes={[15, 16, 17, 18, 19, 20]} // 数字数组，需递增
  unit="GB"
  value={[15]} // single 默认 [min]
  max={20}
  min={15}
  precision={1}
  style={{ width: '700px' }}
/>

<DragInput
  label="Interval selector"
  type="range"
  value={[10, 15]} // range 默认 [min, min]
  markIndexes={[10, 20]}
  unit="m"
  max={20}
  min={10}
  precision={2}
/>

// displayInput: false 隐藏输入框
<DragInput
  label="Interval selector"
  type="range"
  value={[10, 15]}
  markIndexes={[10, 20]}
  unit="m"
  max={20}
  min={10}
  displayInput={false}
  precision={2}
/>
```

### 动态更新

Dyanamic Updating the Values

```jsx
import DragInput from 'eview-ui/DragInput';

// 受控 value（数组）；onChange(value, changeValue)：value 是选中值数组
<DragInput
  type="range"
  value={[10, 12]}
  unit="MB"
  min={10}
  max={20}
  markIndexes={[10, 20]} // 数字数组，需递增
  precision={2}
  onChange={(value, changeValue) => {
    // value 当前选中值数组，changeValue 本次改变的值
  }}
  ref={(dragSelect) => {
    // dragSelect.getValue() 返回选中值数组
  }}
/>
```

### 事件处理

事件处理

```jsx
import DragInput from 'eview-ui/DragInput';

// onChange(value, changeValue)：value 是选中值数组（含所有选中项）
<DragInput
  type="range"
  value={[0, 5]}
  unit="MB"
  max={20}
  markIndexes={[0, 10, 20]} // 数字数组，需递增
  precision={2}
  onChange={(value, changeValue) => {
    // value 当前选中值数组，changeValue 本次改变的值
  }}
  ref={(dragSelect) => {
    // dragSelect.getValue() 返回选中值数组
  }}
/>
```
