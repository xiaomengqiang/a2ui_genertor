# ColorPicker 颜色选择器

> 分类：数据录入

颜色选择器组件，用于选择颜色。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cex 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `ColorPicker` | `ColorPicker` | `onChange`→**`onColorChange(color)`**；value '#rrggbb' 字符串 |

## API

| 属性名称      | 描述                                                  | 输入                                   | 默认  |
| :------------ | :---------------------------------------------------- | :------------------------------------- | :---- |
| value         | 绑定值，格式为 '#rrggbb' 的十六进制颜色字符串         | string                                 |       |
| disabled      | 是否禁用                                              | boolean                                | false |
| className     | 定制组件最外层 dom 元素 className                     | string                                 |       |
| style         | 自定义最外层样式                                      | React.CSSProperties                    | -     |
| popupStyle    | 自定义弹出层样式                                      | React.CSSProperties                    | -     |
| zIndex        | 支持自定义组件弹出层的 zIndex                         | number                                 | 9999  |
| version       | 设置组件版本，用于控制样式版本（如'aui3-1'），未设置时从ConfigProvider的context中获取 | string                              |       |
| theme         | 设置组件主题，未设置时从ConfigProvider的context中获取 | string                                 |       |
| onClick       | 定义点击组件的回调事件                                | (e: Event \| React.MouseEvent \| React.KeyboardEvent, color: string) => void |       |
| onCollapse    | 组件弹出层收缩时的回调事件                            | (e: Event \| React.MouseEvent \| React.KeyboardEvent, color: string) => void |       |
| onColorChange | 选择颜色或输入颜色等引起颜色变化的回调事件            | (color: string) => void                |       |

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import ColorPicker from 'eview-ui/ColorPicker';

<ColorPicker
  zIndex={9999}
  value="#0077ee" // '#rrggbb' 十六进制颜色字符串
  onColorChange={(color) => {
    // color 是 '#rrggbb' 字符串，取 color 更新 value
  }}
  onCollapse={(e, color) => {
    // e: 事件对象, color: 当前选中颜色值
  }}
/>
<ColorPicker disabled value="#0077ee" />
```

