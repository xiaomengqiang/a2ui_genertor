# Radio 组件功能逻辑规格（含 RadioGroup）

> 资料来源：TypeDoc `Radio/types`、`RadioGroup/types` + 官网 Radio 页示例。
> ⚠️ **资料矛盾，未决**：`RadioGroup.onChange` 的类型声明是 `(oldValue, value, event)`，而同一份 API 表的文字描述是"value 当前选中值，oldValue 上次选中值"（与 CheckboxGroup 一致）；全部官方示例里没有任何一处调用该回调。§2 给出**两种顺序都正确**的写法，并在 TODO 里登记实测任务。
> ⚠️ `isControlled`：不传时 `value` 只作初始值、之后由组件内部维护；要让 state 真正驱动显示（如"重置"按钮回到默认项）必传 `isControlled`。RadioGroup 必须用 `data`，**不支持嵌 `<Radio>` children**。

## 1. 功能定位

Radio 是单个单选框；RadioGroup 是 `data` 驱动的互斥单选组，自带 label、必填、横竖排布。**实际业务几乎只用 RadioGroup**，单个 Radio 仅用于自绘布局。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表单里 2-6 个互斥选项 | `RadioGroup` + `data` | `<RadioGroup>` 里嵌 `<Radio>` children（**不支持**，component-use.md 明确） |
| 选项很多（> 6） | `Select`（[Select.md](Select.md)） | 一长串 Radio |
| 二选一开关语义 | `Toggle` / `Switch`（第二批） | 两个 Radio |
| 卡片式单选 | `SelectCard`（[SelectCard.md](SelectCard.md)） | — |

## 2. 事件与交互逻辑

### isControlled + value + onChange（回调参数顺序两头兼容）

```tsx
<RadioGroup
  label="创建方式"
  isControlled
  required
  data={modeData}
  value={mode}
  onChange={(a: string, b: string, event) => {
    // ⚠️ 参数顺序在资料中冲突（见文件头）。两个参数里一个是旧值一个是新值，
    // 与当前 state 相等的那个是旧值，另一个就是新值 —— 两种顺序下都成立。
    const next = a === mode ? b : a;
    setMode(next);
  }}
/>
```

### 切换 → 显隐区块

```tsx
{mode === 'custom' ? (
  <TextField label="自定义模板" required value={tpl} onChange={(v: string) => setTpl(v)} />
) : null}
```

### 单个 Radio（自绘布局时）—— onChange 是 `(value, event)`

```tsx
<Radio label="按天" value="day" checked={unit === 'day'} isControlled onChange={(value: string) => setUnit(value)} />
<Radio label="按周" value="week" checked={unit === 'week'} isControlled onChange={(value: string) => setUnit(value)} />
```

## 3. 联动说明

- RadioGroup 选中值变化 → 条件渲染不同表单区块；切走时清掉被隐藏区块的值，避免脏数据提交
- 筛选 RadioGroup 变化 → 列表回第一页重新请求；`required` 的 RadioGroup 与 TextField / Select 一起纳入提交前校验
- "重置"按钮 → `setMode(默认值)`，前提是传了 `isControlled`

## 4. 反面示例

```tsx
// ❌ 嵌套 children（component-use.md 明确不支持）
<RadioGroup name="status">
  <Radio value="active">激活</Radio>
  <Radio value="inactive">未激活</Radio>
</RadioGroup>

// ❌ antd 习惯：没有 Radio.Group / Radio.Button / optionType / onChange(e)
<Radio.Group optionType="button" onChange={(e) => setMode(e.target.value)} />

// ❌ data 字段名写 label（应为 text）
<RadioGroup data={[{ label: '快速', value: 'quick' }]} />

// ❌ 想用 state 驱动（重置回默认）却没传 isControlled，setMode 后界面不动
<RadioGroup data={modeData} value={mode} onChange={...} />

// ❌ 盲信某一个参数位置是新值（资料冲突未决），有 50% 概率永远拿到旧值
<RadioGroup isControlled value={mode} onChange={(value) => setMode(value)} />

// ❌ 切换模式后不清理被隐藏区块的值，提交时带上脏数据
const handleModeChange = (a, b) => setMode(a === mode ? b : a);   // 少了 setTemplate('')
```

## 5. API 速查

> 压缩自 `Radio/types` / `RadioGroup/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `Radio.label` / `value` | `string` / `any` | 显示文字 / 存取值 |
| `Radio.checked` | `boolean`，默认 `false` | 是否选中 |
| `Radio.disabled` | `boolean`，默认 `false` | 灰化 |
| `Radio.labelPosition` | `'before' \| 'after'`，默认 `after` | 文字位置 |
| `Radio.onChange` | `(value, event) => void` | 选中回调 |
| `Radio.onFocus` / `onBlur` | `(value, event) => void` | 聚焦 / 失焦 |
| `Radio.tipText` / `tipData` | `string` / `object` | 悬浮提示 |
| `Radio.description` | `string` | label 的描述文字 |
| `Radio.isControlled` | `boolean` | 设为受控组件 |
| `RadioGroup.data` | `Array<{ value, text, checked? }>` | 选项数据（**唯一**传选项的方式） |
| `RadioGroup.value` | `any` | 选中值 |
| `RadioGroup.onChange` | 类型 `(oldValue, value, event)`；描述 `(value, oldValue, event)` | **顺序冲突未决**，按 §2 写法兼容 |
| `RadioGroup.isControlled` | `boolean` | 设为受控组件；要用 state 驱动必传 |
| `RadioGroup.required` / `disabled` | `boolean`，默认 `false` | 必填 / 灰化 |
| `RadioGroup.type` | `'vertical' \| 'horizontal'`，默认 `horizontal` | 排布方向 |
| `RadioGroup.rows` / `rowSpacing` / `colSpacing` | `string` | 多行多列排布及间距 |
| `RadioGroup.label` / `labelPosition` / `title` | `string` / `'before' \| 'after'`（默认 before） | 组名及位置 / 组名提示 |
