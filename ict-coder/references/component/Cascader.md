# Cascader 级联选择使用规范

用于从多层级联数据中逐级选择（省市区、设备树等场景）。

## 使用规则

- 必须使用包裹形态：`Cascader` 内包裹 children 作为触发器（`Input`、`Button`等），不使用内置选择框形态。
- 选中值不会自动回显：`onChange` 第二个参数是选中项对象数组，取每项的 `.label` 拼接写入 state 回显。

```jsx
const [text, setText] = useState("");
<Cascader options={options} onChange={(_v, selectedOptions) => setText(selectedOptions.map((o) => o.label).join(" / "))}>
  <Input value={text} readOnly placeholder="请选择省市区" style={{ width: "100%" }} />
</Cascader>
```

## Don't

- 不要使用无 children 的内置选择框形态。
- 不要使用 `prefix` 前缀装饰；附加内容用控件外的独立文本。
