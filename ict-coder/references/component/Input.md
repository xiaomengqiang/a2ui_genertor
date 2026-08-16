# Input
> id: string | component: "Input" | props: object

## props (required: `value`)
- `value`: string | DataBinding — current value of the Input.
- `placeholder?`: string | DataBinding — placeholder of Input.
- `size?`: "large" | "medium" | "small"
- `maxLength?`: number
- `prefix?`: string — Lucide icon name (kebab-case) to display as prefix.
- `suffix?`: string — Lucide icon name (kebab-case) to display as suffix.
- `password?`: boolean — masks the entered characters for secure password input.
- `className?`: string — Tailwind CSS classes for the component.

## 设计规范

# Input 输入框使用规范

用于输入单行文本、密码、搜索关键词。

## 使用规则

- 必须设置 `value`；用作密码输入时 `password=true`。
- 使用 `placeholder` 提示输入格式或示例。
- 有字符限制时设置 `maxLength`。
- 前后辅助图标使用 Lucide kebab-case 名称，通过 `prefix` 或 `suffix` 设置。
- 常规表单使用 `size=medium`；紧凑筛选区使用 `size=small`；同组输入控件尺寸一致。

### 搜索框

- 关键词搜索使用 Input，并设置 `prefix=search`；不创建单独的 Search 组件。
- Placeholder 应说明搜索对象或字段，如“搜索名称、ID 或 IP”，不要只写“请输入”。
- 搜索范围复杂时在输入框外提供明确的筛选条件，不把多个条件塞进 Placeholder。
- 搜索结果、无结果和错误反馈显示在结果区域，不写入输入框内部。

## 布局

- 同一表单或筛选区域内输入框高度、Label、帮助文本和校验信息保持对齐。
- 为完整关键词和长 Placeholder 预留宽度；校验信息出现时不应造成大幅布局跳动。

## Don't

- 不要给 Input 使用属于 Select 的 `showSearch` 属性。
- 不要用普通 Input 代替数字、日期、时间等已有专用组件。
- 不要给输入框添加阴影或任意状态色。
- 不要使用开发组件不存在的属性或枚举值。
- 不要试图用 Input 组件做多行输入，多行输入应当使用 TextArea 组件。


## 示例

# Input | 输入框

### Example: Basic Input

```json
{
  "id": "inputBasic",
  "component": "Input",
  "props": {
    "value": { "path": "/inputVal" },
    "placeholder": "请输入内容"
  }
}
```

### Example: Input with size

```json
{
  "state": {
    "largeInput": ""
  },
  "rootId": "inputLarge",
  "elements": [
    {
      "id": "inputLarge",
      "component": "Input",
      "props": {
        "value": { "path": "/largeInput" },
        "placeholder": "大号输入框",
        "size": "large"
      }
    }
  ]
}
```

### Example: Input with maxLength

```json
{
  "state": {
    "limitedInput": ""
  },
  "rootId": "inputMaxLength",
  "elements": [
    {
      "id": "inputMaxLength",
      "component": "Input",
      "props": {
        "value": { "path": "/limitedInput" },
        "placeholder": "最多输入10个字符",
        "maxLength": 10
      }
    }
  ]
}
```

### Example: Input with prefix/suffix icon

```json
{
  "id": "inputWithPrefix",
  "component": "Input",
  "props": {
    "value": { "path": "/username" },
    "placeholder": "请输入用户名",
    "prefix": "user"
  }
},
{
  "id": "inputWithSuffix",
  "component": "Input",
  "props": {
    "value": { "path": "/email" },
    "placeholder": "请输入邮箱",
    "suffix": "mail"
  }
}
```

### Example: Input with password

```json
{
  "state": {
    "password": ""
  },
  "rootId": "inputPassword",
  "elements": [
    {
      "id": "inputPassword",
      "component": "Input",
      "props": {
        "value": { "path": "/password" },
        "placeholder": "请输入密码",
        "password": true
      }
    }
  ]
}
```

### Example: Input with className

```json
{
  "state": {
    "styledInput": ""
  },
  "rootId": "inputStyled",
  "elements": [
    {
      "id": "inputStyled",
      "component": "Input",
      "props": {
        "value": { "path": "/styledInput" },
        "placeholder": "自定义样式",
        "className": "w-64 bg-blue-50 border-blue-300"
      }
    }
  ]
}
```
