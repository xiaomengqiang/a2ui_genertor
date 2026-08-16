# InputNumber
> id: string | component: "InputNumber" | props: object

## props (required: `value`)
- `value`: number | DataBinding — current value of the InputNumber.
- `placeholder?`: string | DataBinding — placeholder of InputNumber.
- `controls?`: boolean
- `min?`: number
- `max?`: number
- `step?`: number
- `size?`: "large" | "medium" | "small"
- `className?`: string — Tailwind CSS classes for the component.

## 设计规范

# InputNumber 计数器使用规范

用于直接输入或按固定步长调整数值。

## 使用规则

- 必须设置数值 `value`；需要增减操作时保留 `controls=true`，只需输入时可使用 `controls=false`。
- 根据业务边界设置 `min` 和 `max`，根据业务单位设置 `step`，不要默认假设步长为 1。
- 使用 `placeholder` 提示格式或范围；单位和限制在组件旁明确展示。
- 常规表单使用 `size=medium`；紧凑区域使用 `size=small`；同组控件尺寸一致。
- 达到边界时禁用对应增减操作，并校验空值、非数字和越界输入。

## Don't

- 不要缺少业务要求的边界校验。
- 不要用 InputNumber 表达复杂范围；使用两个明确字段或专用范围组件。
- 不要手动改写增减按钮样式。
- 不要使用开发组件不存在的属性或枚举值。


## 示例

# InputNumber | 数字输入框

### Example: Basic InputNumber

```json
{
  "id": "inputNumberBasic",
  "component": "InputNumber",
  "props": {
    "value": { "path": "/numVal" },
    "placeholder": "请输入数字"
  }
}
```

### Example: InputNumber with range

```json
{
  "id": "inputNumberRange",
  "component": "InputNumber",
  "props": {
    "value": { "path": "/age" },
    "min": 0,
    "max": 100,
    "placeholder": "请输入年龄"
  }
}
```

### Example: InputNumber with step

```json
{
  "id": "inputNumberStep",
  "component": "InputNumber",
  "props": {
    "value": { "path": "/price" },
    "min": 0,
    "step": 0.1,
    "placeholder": "请输入价格",
    "className": "w-32 bg-blue-50"
  }
}
```

### Example: InputNumber with controls

```json
{
  "id": "inputNumberControls",
  "component": "InputNumber",
  "props": {
    "value": { "path": "/withControls" },
    "min": 0,
    "max": 100,
    "controls": true
  }
}
```

### Example: InputNumber with size

```json
{
  "id": "inputNumberLarge",
  "component": "InputNumber",
  "props": {
    "value": { "path": "/largeNumber" },
    "size": "large",
    "placeholder": "大号"
  }
}
```
