# Breadcrumb
> id: string | component: "Breadcrumb" | props: object

## props (required: `items`)
- `items`: { `title?`: string | DataBinding | SlotNode, `type?`: "reference" | "", `separator?`: string }[] | DataBinding — The Breadcrumb item list.
- `separator?`: string | DataBinding
- `className?`: string — Tailwind CSS classes for the component.

## 设计规范

# Breadcrumb 面包屑使用规范

用于展示当前页面在层级结构中的位置。

## 使用规则

- 使用 `items` 按层级顺序提供路径，每项使用 `items.title`；当前项名称与页面标题或资源名称一致。
- 最后一项表示当前页面；上级路径表示可返回的层级。
- 全局分隔符使用 `separator`；仅单项需要不同分隔符时使用 `items.separator`。
- 除非明确需要用分隔符替换某项，否则不要设置 `items.type=reference`。
- 详情页、报告页和深层配置页使用；一级工作台或无层级页面不使用。

## 布局

- 放在页面标题或内容区上方，视觉权重低于页面标题。
- 路径过长时折叠或下拉，名称截断为单行，不挤压标题和操作区。

## Don't

- 不要用 Breadcrumb 替代主导航、Tabs 或 Steps。
- 不要为了凑层级添加虚假路径。
- 不要使用开发组件不存在的属性或枚举值。


## 示例

# Breadcrumb | 面包屑

### Example: Breadcrumb basic

```json
{
  "id": "breadcrumbBasic",
  "component": "Breadcrumb",
  "props": {
    "items": [
      { "title": "首页" },
      { "title": "商品列表" },
      { "title": "详情页" }
    ]
  }
}
```

### Example: Breadcrumb with separator

```json
{
  "id": "breadcrumbSeparator",
  "component": "Breadcrumb",
  "props": {
    "separator": "/",
    "items": [
      { "title": "首页" },
      { "title": "订单管理" },
      { "title": "订单详情" }
    ]
  }
}
```

### Example: Breadcrumb with icons

```json
{
  "id": "breadcrumbWithIcon",
  "component": "Breadcrumb",
  "props": {
    "items": [
      { "title": { "componentId": "homeIcon" }},
      { "title": "产品中心" },
      { "title": "当前页面" }
    ]
  }
},
{
  "id": "homeIcon",
  "component": "Icon",
  "props": { "name": "house" }
}
```

### Example: Breadcrumb replaces the current item with the separator

```json
{
  "id": "breadcrumbWithIcon",
  "component": "Breadcrumb",
  "props": {
    "items": [
      { "title": "位置"},
      { "type": "separator", "separator": ":" },
      { "title": "应用中心" },
      { "title": "应用A" }
    ]
  }
}
```
