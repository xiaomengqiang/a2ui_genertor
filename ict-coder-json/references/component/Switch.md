# Switch
> id: string | component: "Switch" | props: object

## props (required: `value`)
- `value`: boolean | DataBinding — current value of the Switch.
- `size?`: "medium" | "small"
- `checkedChildren?`: string
- `unCheckedChildren?`: string
- `checkedChildrenIcon?`: string | DataBinding — lucide icon name to be shown when the state is checked.
- `unCheckedChildrenIcon?`: string | DataBinding — lucide icon name to be shown when the state is unchecked.
- `disabled?`: boolean | DataBinding

------

# Switch 开关使用规范

用于立即生效的开/关设置。

## 使用规则

- 必须设置布尔 `value`；切换后立即生效，不需要额外提交。
- 文案已能说明两态时使用基础 Switch；需要在控件内强化两态时使用 `checkedChildren` 和 `unCheckedChildren`。
- 控件内文字保持简短，建议不超过 5 个字符；更完整的含义由外部 Label 说明。
- 只有图标能清楚表达两态时使用 `checkedChildrenIcon` 和 `unCheckedChildrenIcon`，图标名使用 Lucide kebab-case。
- 常规设置使用 `size=medium`；紧凑列表使用 `size=small`。
- 高风险或批量切换需要确认并说明影响范围；异步结果需要明确反馈。

## 布局

- 设置项 Label 和说明放在行首，Switch 放在行尾。

## Don't

- 不要用于需要提交按钮确认的设置。
- 不要用于超过两个状态的选择。
- 不要同时堆叠无必要的控件内文字和图标。
- 不要使用开发组件不存在的属性或枚举值。

------

# Switch | 开关 示例

## Example: Switch basic

```json
{
  "id": "switchBasic",
  "component": "Switch",
  "props": {
    "value": false
  }
}
```

## Example: Switch with text

```json
{
  "id": "switchBasic",
  "component": "Switch",
  "props": {
    "value": { "path": "/switchVal" },
    "checkedChildren": "开启",
    "unCheckedChildren": "关闭"
  }
}
```

## Example: Switch with icons

```json
{
  "id": "switchWithIcon",
  "component": "Switch",
  "props": {
    "value": { "path": "/wifiSwitch" },
    "checkedChildrenIcon": "wifi",
    "unCheckedChildrenIcon": "close"
  }
}
```

## Example: Switch size

```json
{
    "id": "switchSmall",
    "component": "Switch",
    "props": { "value": { "path": "/small" }, "size": "small" }
}
```
