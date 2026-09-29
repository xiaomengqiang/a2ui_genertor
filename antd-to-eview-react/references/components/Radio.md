# Radio 组件功能逻辑规格（含 RadioGroup）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Radio/types`、`RadioGroup/types`；官网组件页 Radio 及示例 `Basic.tsx` / `Disabled.tsx` / `Tip.tsx` / `RadioGroupBasic.tsx` / `RadioGroupVertical.tsx` / `RadioGroupDisabled.tsx`；组件使用规则文档 component-use（RadioGroup 必须用 `data`）
>
> ⚠️ **资料矛盾，未决**：`RadioGroup.onChange` 的类型声明是 `(oldValue, value, event)`，而同一份 API 表的文字描述是"value 当前选中值，oldValue 上次选中值"（与 CheckboxGroup 一致）；全部官方示例里没有任何一处调用该回调。本文 §4 给出**两种顺序都正确**的写法，并在 TODO 里登记实测任务。

## 1. 功能定位

Radio 是单个单选框；RadioGroup 是 `data` 驱动的互斥单选组，自带 label、必填、横竖排布。**实际业务几乎只用 RadioGroup**，单个 Radio 仅用于自绘布局。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表单里 2-6 个互斥选项 | `RadioGroup` + `data` | `<RadioGroup>` 里嵌 `<Radio>` children（**不支持**，component-use.md 明确） |
| 选项很多（> 6） | `Select` | 一长串 Radio |
| 二选一开关语义 | `Toggle` / `Switch`（第二批） | 两个 Radio |
| 卡片式单选 | `SelectCard`（第二批） | — |

## 2. 典型场景

- 表单枚举字段："协议 TCP / UDP"、"性别"、"启用 / 禁用"
- 筛选条件里的互斥维度："时间范围 近 1 天 / 7 天 / 30 天"
- 向导页的模式选择："快速创建 / 自定义创建"，切换后显隐不同的表单区块
- 竖排长列表（`type="vertical"`）配合 `rows` 分列

## 3. 状态声明

```tsx
// RadioGroup：value 存选中项的 value（不是 text、不是 index）
const [mode, setMode] = useState<string>('quick');

// 受控说明：Radio / RadioGroup 都有 isControlled 属性；不传时 value 只作初始值，
// 之后由组件内部维护。要让 state 真正驱动显示（如"重置"按钮回到默认项），传 isControlled。
```

## 4. 事件与交互逻辑

### 首选：放进 Form.Item，由 Form 托管值（官方 4 个 Form demo 都这么用）

```tsx
<Form.Item label="协议" name="protocol" rules={[{ required: true }]}>
  {/* 不传 value / onChange，Form 按 name 收集 */}
  <RadioGroup data={protocolData} />
</Form.Item>
```

### 独立使用：isControlled + value + onChange（回调参数顺序两头兼容）

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

## 5. 数据结构

```tsx
// RadioGroup.data 每一项（api/RadioGroup_types.md）
interface RadioGroupItem {
  value: string | number;      // 存取值
  text: string;                // 显示文字 —— 不是 label
  checked?: boolean;           // 初始选中（demo RadioGroupBasic.tsx）；与 value 同时存在时以 value 为准
}
```

## 6. 联动说明

- RadioGroup 选中值变化 → 条件渲染不同表单区块；切走时清掉被隐藏区块的值，避免脏数据提交
- 筛选 RadioGroup 变化 → 列表回第一页重新请求
- `required` 的 RadioGroup 与 TextField / Select 一起纳入提交前校验（在 Form 内由 Form 统一做）
- "重置"按钮 → `setMode(默认值)`，前提是传了 `isControlled`

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import RadioGroup from '@nce/eview-react/RadioGroup';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

interface RadioGroupItem {
  value: string;
  text: string;
}

// 创建向导：创建方式单选 → 自定义模式显示额外字段；支持重置
export default function CreateWizardStep() {
  const modeData: RadioGroupItem[] = [
    { value: 'quick', text: '快速创建' },
    { value: 'custom', text: '自定义创建' },
  ];
  const rangeData: RadioGroupItem[] = [
    { value: '1d', text: '近 1 天' },
    { value: '7d', text: '近 7 天' },
    { value: '30d', text: '近 30 天' },
  ];

  const [mode, setMode] = useState<string>('quick');
  const [range, setRange] = useState<string>('7d');
  const [template, setTemplate] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  // 兼容两种参数顺序：与当前值相等的是旧值，另一个是新值
  const pickNext = (current: string, a: string, b: string) => (a === current ? b : a);

  const handleModeChange = (a: string, b: string) => {
    const next = pickNext(mode, a, b);
    setMode(next);
    if (next !== 'custom') setTemplate('');       // 切走时清空被隐藏字段
    setSummary('');
  };

  const handleSubmit = () => {
    if (mode === 'custom' && template.trim() === '') {
      setSummary('自定义模式必须填写模板');
      return;
    }
    setSummary(`提交：mode=${mode}, range=${range}${mode === 'custom' ? `, template=${template}` : ''}`);
  };

  const handleReset = () => {
    setMode('quick');
    setRange('7d');
    setTemplate('');
    setSummary('');
  };

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioGroup label="创建方式" isControlled required data={modeData} value={mode} onChange={handleModeChange} />

      {mode === 'custom' ? (
        <TextField
          label="自定义模板"
          placeholder="请输入模板名称"
          required
          value={template}
          onChange={(value: string) => setTemplate(value)}
        />
      ) : null}

      <RadioGroup
        label="统计范围"
        type="vertical"
        isControlled
        data={rangeData}
        value={range}
        onChange={(a: string, b: string) => setRange(pickNext(range, a, b))}
      />

      {summary ? <div>{summary}</div> : null}
      <div style={{ display: 'flex', gap: 12 }}>
        <Button status="primary" text="提交" onClick={handleSubmit} />
        <Button text="重置" onClick={handleReset} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `api/Radio_types.md` / `api/RadioGroup_types.md`。

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
| `RadioGroup.onChange` | 类型 `(oldValue, value, event)`；描述 `(value, oldValue, event)` | **顺序冲突未决**，按 §4 写法兼容 |
| `RadioGroup.isControlled` | `boolean` | 设为受控组件；要用 state 驱动必传 |
| `RadioGroup.required` / `disabled` | `boolean`，默认 `false` | 必填 / 灰化 |
| `RadioGroup.type` | `'vertical' \| 'horizontal'`，默认 `horizontal` | 排布方向 |
| `RadioGroup.rows` / `rowSpacing` / `colSpacing` | `string` | 多行多列排布及间距 |
| `RadioGroup.label` / `labelPosition` / `title` | `string` / `'before' \| 'after'`（默认 before） | 组名及位置 / 组名提示 |
