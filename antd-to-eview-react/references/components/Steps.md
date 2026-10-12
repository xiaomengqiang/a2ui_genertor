# Steps 组件功能逻辑规格

> ⚠️ `currentStep` 对应 `data[].value`（不是下标）；`onClick(index)` 给的是**下标**，与 `currentStep` 不同源。
> ⚠️ `direction="vertical"` 只在 demo 出现，API 表未列 → 可用但标注来源。
> ⚠️ **antd 默认形态（文字在图标右侧）对应 eview-react `labelPlacement="horizontal"`**——eview-react 默认是 `vertical`（文字在图标下方），迁移时务必显式设为 `horizontal`，否则视觉与 antd 不一致。

## 1. 功能定位

Steps 是多步骤任务的步骤条，`data` 驱动，`currentStep` 指向当前步骤的 `value`，支持横 / 竖排布、错误态、自定义描述与图标、点击跳步。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 向导 / 多步表单顶部的进度指示 | `Steps` | antd 的 `<Steps><Step>` children、`current` 下标 |
| 旧工程已在用 | `Wizards`（同 API，旧名） | 新代码不要再用 |
| 纯展示的时间轴 | `TimeLine`（第二批） | Steps 竖排硬凑 |

## 2. 事件与交互逻辑

### currentStep 对应 data 里的 value，不是下标

```tsx
const stepData = [
  { text: '基本信息', value: '1', description: '名称与描述' },
  { text: '网络配置', value: '2', description: '区域与子网' },
  { text: '确认', value: '3' },
];
<Steps data={stepData} currentStep={stepData[stepIndex].value} />
```

### 自定义步骤图标：iconUrl 用 icon+

```tsx
import { IconPlusIcPublicConfig, IconPlusIcPublicCheck } from '@nce/icon-plus';
const stepData = [
  { text: '配置', value: '1', iconUrl: <IconPlusIcPublicConfig /> },
  { text: '确认', value: '2', iconUrl: <IconPlusIcPublicCheck /> },
];
<Steps data={stepData} currentStep={stepData[stepIndex].value} />
```

### 上一步 / 下一步 —— 校验当前步再前进

```tsx
const handleNext = () => {
  if (stepIndex === 0 && !basicRef.current.validate()) return;   // 当前步没过校验不前进
  setStepIndex((i) => Math.min(i + 1, stepData.length - 1));
};
const handlePrev = () => setStepIndex((i) => Math.max(i - 1, 0));

<Button text="上一步" disabled={stepIndex === 0} onClick={handlePrev} />
<Button status="primary" text={stepIndex === stepData.length - 1 ? '完成' : '下一步'} onClick={handleNext} />
```

### 点击步骤条跳步 —— onClick 给的是下标

```tsx
<Steps
  data={stepData}
  currentStep={stepData[stepIndex].value}
  onClick={(index: number) => {
    if (index <= maxReached) setStepIndex(index);   // 只允许回跳到已到达过的步骤
  }}
/>
```

### 错误态与竖排

```tsx
const data = stepData.map((s) => ({ ...s, status: errorSteps.has(s.value) ? 'error' : '' }));
<Steps data={data} currentStep={current} labelPlacement="horizontal" />   // 文字在图标右侧
<Steps data={data} currentStep={current} direction="vertical" />         // 竖排（仅 demo 出现）
```

## 3. 联动说明

- 步骤切换 → 条件渲染对应步骤的表单区块；已填数据保留在各自 state 里，回跳不丢
- "下一步"前先跑当前步控件的 `ref.validate()`；失败停在本步并 `focus()`
- 提交失败 → 把失败步骤的 `value` 放进 `errorSteps` → `status: 'error'` 高亮，并跳回该步
- 最后一步按钮文案切换为"完成"，点击后汇总各步 state 提交；`disabled` 整条步骤条防止提交中跳步

## 4. 反面示例

```tsx
// ❌ antd 写法：没有 Step 子组件，也没有 current 下标属性
<Steps current={1}>
  <Steps.Step title="基本信息" />
</Steps>

// ❌ 把下标直接传给 currentStep（它匹配的是 data[].value）
<Steps data={stepData} currentStep={stepIndex} />

// ❌ data 字段名写 title（应为 text）
<Steps data={[{ title: '基本信息', value: '1' }]} />

// ❌ 下一步不校验当前步，带着空表单往后走
<Button text="下一步" onClick={() => setStepIndex(stepIndex + 1)} />

// ❌ onClick 允许随意跳到未到达的步骤，跳过必填步
<Steps data={stepData} onClick={(index) => setStepIndex(index)} />

// ❌ 新代码还用旧名
import Wizards from '@nce/eview-react/Wizards';
```

## 5. API 速查

> 压缩自 `demos/Steps/__docs__/API.md`；`direction` 仅见于 demo。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `StepItem[]`，**必填** | 步骤配置；不配 `value` 时序号默认 1、2、3… |
| `currentStep` | `string \| number`，默认 `0` | 当前步骤，**对应 `data[].value`** |
| `disabled` | `boolean`，默认 `false` | 整条禁用 |
| `onClick` | `(index: number) => void`（3.5.16） | 点击步骤，参数是**下标** |
| `labelPlacement` | `'vertical' \| 'horizontal'`，默认 `vertical`（3.6.10） | 文字在图标下方 / 右侧；**antd 默认 = `horizontal`，迁移须显式指定** |
| `direction` | `'vertical'` | 竖排步骤条 |
| `wizardTextStyle` | `CSSProperties` | 每步文字样式 |
| `id` / `className` / `style` | — | 外层容器 |
| `Item.text` / `Item.value` | `string` / `string \| number`，**必填** | 标题 / 序号 |
| `Item.description` | `string \| ReactNode`（3.6.10） | 描述，可放节点 |
| `Item.iconUrl` | `string \| ReactElement`（3.6.10） | 自定义图标 |
| `Item.status` | `string`，可选 `error`（3.6.10） | 报错态 |
| `Item.className` | `string` | 每步类名 |
