# Form（表单骨架）

## 设计规范

不使用 antd 的 `Form` / `Form.Item`（构建时 FAIL）。表单 = 纯 H5 骨架（`form` / `label` / `div`）+ antd 输入组件受控使用。布局不做统一规定，按页面场景自行选择并写在组件自己的 CSS 里。

## 布局原则

- 标签在左的多行表单：需要标签逐行对齐时用 CSS Grid（标签列 `max-content` 或固定 rem 宽度）或固定宽度 label，不用自然宽度 flex。
- 纵向排列（标签在上方）：flex column 即可。
- 同一表单内行距、标签与控件间距使用 spacing token，保持一致。
- 弹窗内紧凑表单、筛选区、详情表单可以采用不同布局，但同一区域内规则必须统一。

## 值与校验模式

- 每字段受控：`value` + `onChange`；`Input` 取 `e.target.value`，`Select` / `InputNumber` / `Switch` 回调直接是值。
- 提交时统一校验，结果写入 `errors` 对象 state；控件传 `status={errors.x ? "error" : undefined}`。
- 错误文案固定显示在对应控件正下方，随 `errors` 渲染；输入修正后对应错误即时清除。
- label 用 `htmlFor` 关联控件 `id`；必填标记写在 label 上（星号样式用 CSS 实现）。
- 动态字段列表：数组 state + `map` 渲染 + 增删按钮。

## Don't

- 不使用 `Form` / `Form.Item` / `Form.List`（构建 FAIL）。
- 不依赖浏览器原生校验气泡（原生 `required` / `type="email"` 提示）。
- 不手画红框代替 `status="error"`；错误信息不弹 message / notification，固定在控件下方。
