# Steps 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：官网组件页 Steps 的 props 表（`__docs__/API.md`）及示例 `WizardsDemo.jsx` / `WizardsClick.jsx` / `WizardsError.jsx` / `WizardsVerticalDemo.jsx` / `WizardsLabelPlacement.jsx` / `WizardsCustom.jsx`；旧名对照 TypeDoc 类型表 `Wizards/Wizards`、`Wizards/WizardsItem`
>
> ⚠️ `Steps` 没有 TypeDoc 类型表，以官网组件页的 props 表为准；组件页标题仍写 "Wizards"，示例也写 `import Wizards from 'eview-react/Steps'`，**导入路径是 `Steps`**，`Wizards` 是同时保留的旧组件。
> ⚠️ `direction="vertical"` 只在 `WizardsVerticalDemo.jsx` 出现，API 表未列 → 可用但标注来源。

## 1. 功能定位

Steps 是多步骤任务的步骤条，`data` 驱动，`currentStep` 指向当前步骤的 `value`，支持横 / 竖排布、错误态、自定义描述与图标、点击跳步。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 向导 / 多步表单顶部的进度指示 | `Steps` | antd 的 `<Steps><Step>` children、`current` 下标 |
| 旧工程已在用 | `Wizards`（同 API，旧名） | 新代码不要再用 |
| 纯展示的时间轴 | `TimeLine`（第二批） | Steps 竖排硬凑 |

## 2. 典型场景

- 创建向导：步骤条 + 每步表单 + "上一步 / 下一步 / 完成"按钮
- 任务执行进度：某步失败标 `status: 'error'`，描述里放错误原因
- 审批流展示：竖排 `direction="vertical"`，`description` 放审批人 / 时间
- 可点击回跳：`onClick(index)` 允许回到已完成的步骤修改

## 3. 状态声明

```tsx
// 用"下标"存当前步，渲染时换成 data[stepIndex].value —— 与官方 demo 一致
const [stepIndex, setStepIndex] = useState<number>(0);

// 每步的表单数据分开存，最后一步汇总提交
const [basic, setBasic] = useState<BasicForm>({ name: '' });
const [advanced, setAdvanced] = useState<AdvancedForm>({ region: null });

// 失败步骤集合：渲染时映射为 data[i].status = 'error'
const [errorSteps, setErrorSteps] = useState<Set<string>>(new Set());
```

## 4. 事件与交互逻辑

### currentStep 对应 data 里的 value，不是下标

```tsx
const stepData = [
  { text: '基本信息', value: '1', description: '名称与描述' },
  { text: '网络配置', value: '2', description: '区域与子网' },
  { text: '确认', value: '3' },
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

### 点击步骤条跳步 —— onClick 给的是下标（demo WizardsClick.jsx）

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

## 5. 数据结构

```tsx
// Steps.data 每一项（__docs__/API.md「Item props」）
interface StepItem {
  text: string;                          // 必填：步骤标题
  value: string | number;                // 必填：序号，currentStep 按它匹配
  description?: string | React.ReactNode;// 辅助文本，可放 ReactNode（WizardsCustom.jsx）
  iconUrl?: string | React.ReactElement; // 自定义图标
  status?: 'error' | '';                 // 报错状态，可选 error
  className?: string;
}
```

## 6. 联动说明

- 步骤切换 → 条件渲染对应步骤的表单区块；已填数据保留在各自 state 里，回跳不丢
- "下一步"前先跑当前步控件的 `ref.validate()`；失败停在本步并 `focus()`
- 提交失败 → 把失败步骤的 `value` 放进 `errorSteps` → `status: 'error'` 高亮，并跳回该步
- 最后一步按钮文案切换为"完成"，点击后汇总各步 state 提交；`disabled` 整条步骤条防止提交中跳步

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import Steps from '@nce/eview-react/Steps';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import Button from '@nce/eview-react/Button';

interface StepItem {
  text: string;
  value: string;
  description?: string;
  status?: string;
}

// 三步创建向导：步骤条 + 分步表单 + 校验前进 + 失败回跳标错
export default function CreateWizard() {
  const stepData: StepItem[] = [
    { text: '基本信息', value: '1', description: '名称' },
    { text: '网络配置', value: '2', description: '区域' },
    { text: '确认', value: '3' },
  ];
  const regionOptions = [
    { text: '华东', value: 'east' },
    { text: '华南', value: 'south' },
  ];

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [region, setRegion] = useState<string | null>(null);
  const [errorSteps, setErrorSteps] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const nameRef = useRef<any>(null);
  const regionRef = useRef<any>(null);
  const isLast = stepIndex === stepData.length - 1;

  // 当前步校验：只校验本步的控件
  const validateCurrent = (): boolean => {
    if (stepIndex === 0) return nameRef.current.validate();
    if (stepIndex === 1) return regionRef.current.validate();
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrent()) return;
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setMessage('');
    try {
      // 真实项目替换为已有 Service；这里模拟第 2 步的数据被服务端拒绝
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (region === 'south') {
        setErrorSteps(new Set(['2']));
        setStepIndex(1);                 // 跳回出错步骤
        setMessage('华南区域暂不可用');
        return;
      }
      setErrorSteps(new Set());
      setMessage(`创建成功：${name} / ${region}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 渲染时把失败集合映射到 status
  const data = stepData.map((s) => ({ ...s, status: errorSteps.has(s.value) ? 'error' : '' }));

  return (
    <div style={{ width: 560, padding: 24 }}>
      <Steps
        data={data}
        currentStep={stepData[stepIndex].value}
        disabled={submitting}
        onClick={(index: number) => {
          if (index < stepIndex) setStepIndex(index);   // 只允许回跳
        }}
      />

      <div style={{ margin: '24px 0', minHeight: 80 }}>
        {stepIndex === 0 ? (
          <TextField ref={nameRef} label="名称" required maxLength={32} value={name} onChange={(v: string) => setName(v)} />
        ) : null}
        {stepIndex === 1 ? (
          <Select
            ref={regionRef}
            label="区域"
            required
            hintType="tip"
            options={regionOptions}
            defaultLabel="-请选择-"
            value={region}
            onChange={(v: string) => setRegion(v)}
          />
        ) : null}
        {stepIndex === 2 ? <div>名称：{name}；区域：{region}</div> : null}
        {message ? <div style={{ marginTop: 12 }}>{message}</div> : null}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button text="上一步" disabled={stepIndex === 0 || submitting} onClick={() => setStepIndex((i) => i - 1)} />
        <Button
          status="primary"
          text={isLast ? (submitting ? '提交中...' : '完成') : '下一步'}
          disabled={submitting}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `demos/Steps/__docs__/API.md`；`direction` 仅见于 demo。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `StepItem[]`，**必填** | 步骤配置；不配 `value` 时序号默认 1、2、3… |
| `currentStep` | `string \| number`，默认 `0` | 当前步骤，**对应 `data[].value`** |
| `disabled` | `boolean`，默认 `false` | 整条禁用 |
| `onClick` | `(index: number) => void`（3.5.16） | 点击步骤，参数是**下标** |
| `labelPlacement` | `'vertical' \| 'horizontal'`，默认 `vertical`（3.6.10） | 文字在图标下方 / 右侧 |
| `direction` | `'vertical'`（仅 demo） | 竖排步骤条 |
| `wizardTextStyle` | `CSSProperties` | 每步文字样式 |
| `id` / `className` / `style` | — | 外层容器 |
| `Item.text` / `Item.value` | `string` / `string \| number`，**必填** | 标题 / 序号 |
| `Item.description` | `string \| ReactNode`（3.6.10） | 描述，可放节点 |
| `Item.iconUrl` | `string \| ReactElement`（3.6.10） | 自定义图标 |
| `Item.status` | `string`，可选 `error`（3.6.10） | 报错态 |
| `Item.className` | `string` | 每步类名 |
