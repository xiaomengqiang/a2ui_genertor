# Dropdown
> id: string | component: "Dropdown" | props: object | children: object

## props (required: `menu`)
- `placement?`: "bottom" | "bottomLeft" | "bottomRight" | "top" | "topLeft" | "topRight"
- `trigger?`: "click" | "hover" | "contextMenu"[] — The trigger mode for opening the dropdown.
- `menu`: { `label`: string, `key`: string | number, `icon?`: string }[] | DataBinding — The dropdown menu list.
- `className?`: string — Tailwind CSS classes for the component.

## children
类型: string[]
> The element to be wrapped by the Dropdown. A static list of child component IDs. Note: The node ID count must be exactly 1;

------

# Dropdown 下拉菜单使用规范

用于从当前上下文展开一组操作或轻量导航入口。

## 使用规则

- 必须设置 `menu`，每项必须包含 `menu.label` 和唯一 `menu.key`；仅在图标帮助识别时设置 `menu.icon`。
- 非默认触发方式才设置 `trigger`；浮层位置通过 `placement=bottom | bottomLeft | bottomRight | top | topLeft | topRight` 选择。
- 更多操作、导出、下载、复制和行操作使用 Dropdown；选择表单值使用 Select。
- 菜单项使用短动词或名词短语，同组语法保持一致。

## 布局

- 浮层贴近触发器并与其边缘对齐，靠近视口边缘时选择不会溢出的 `placement`。
- 菜单宽度容纳最长菜单项，文字保持单行。

## Don't

- 不要用 Dropdown 替代 Select、主导航或复杂层级选择。
- 不要在菜单项内放表单、图表或长段说明。
- 不要写 API 表未定义的 trigger 枚举值。

------

# Dropdown | 下拉菜单 示例

## Example: Dropdown basic

```json
{
  "id": "menuDropdown",
  "component": "Dropdown",
  "props": {
    "menu": [
      { "label": "菜单项一", "key": "item1", "icon": "user" },
      { "label": "菜单项二", "key": "item2", "icon": "setting" },
      { "label": "菜单项三", "key": "item3", "icon": "delete" }
    ]
  },
  "children": ["menuButton"]
},
{
  "id": "menuButton",
  "component": "div",
  "props": { "className": "p-4", "value": "菜单" }
}
```

## Example: Dropdown with trigger

```json
{
  "id": "dropdownClick",
  "component": "Dropdown",
  "props": {
    "trigger": ["click"],
    "menu": [
      { "label": "复制", "key": "copy" },
      { "label": "粘贴", "key": "paste" },
      { "label": "剪切", "key": "cut" }
    ]
  },
  "children": ["operations"]
},
{
  "id": "operations",
  "component": "div",
  "props": { "className": "p-4", "value": "菜单" }
}
```

## Example: Dropdown with placement

```json
{
  "id": "dropdownBottomLeft",
  "component": "Dropdown",
  "props": {
    "placement": "bottomLeft",
    "menu": [
      { "label": "左下角菜单位置", "key": "1" }
    ]
  },
  "children": ["dropdownPosition"]
},
{
  "id": "dropdownPosition",
  "component": "div",
  "props": { "className": "p-4", "value": "左下角" }
}
```
