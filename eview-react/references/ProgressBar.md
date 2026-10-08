# ProgressBar 组件功能逻辑规格

> ⚠️ 进度值是 **`current` + `max`**，不是 antd 的 `percent`。线形状态用 `status`，环形状态用 **`circleStatus`**，均只接受 `success` / `exception`；处理中不传状态。
> ⚠️ `overTime` 以**秒**计，挂载时启动；改 props 不重启或清除计时器，源码也没有卸载清理。默认由真实进度更新 `current`；若需时间估算，由业务管理并清理计时器，再传 current，避免重挂遗留旧计时器。
> ⚠️ 类型声明把 `labelPosition` 列为必填，但文档默认 `after` 且示例常省略；本文显式传值。`hasDecimal` 有类型和示例支持，站点表漏列；示例里的 `min` 无对应 API，不使用。
> 本文行为以 R26.0-NCE 3.10.36+6 源码核验为依据；其他版本仅采用明确核对过的结论，不视为已在目标工程运行通过，见[版本边界](patterns/project-setup.md)。

## 1. 功能定位

ProgressBar 展示可量化的任务进度，支持线形、环形和模态进度层。它不执行任务，也不提供上传、取消、重试或完成回调。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 已完成条数 / 总条数 | `current` + `max`，线形 `format="steps"` | 把条数直接当百分比 |
| 百分比 / 环形概览 | `format="percent"` / `type="circle"` | antd `Progress percent` |
| 全屏任务进度 | `modal` + `isOpen` | `visible` / `open` |
| 完全未知进度的等待 | [Loading](Loading.md) | 用固定定时器伪造真实完成率 |

## 2. 典型场景

- 批量导入：显示已处理数量，成功后标成功，失败保留最后已知进度。
- 下载 / 安装：接口通知驱动 current，旁边提供业务取消或重试按钮。
- 环形概览：同一进度数据配 `circleWidth` / `strokeWidth` 设置尺寸。
- 耗时任务：模态层由运行状态控制，异常也要解除遮罩。

## 3. 状态声明

```tsx
type Phase = 'idle' | 'running' | 'success' | 'error';
const [phase, setPhase] = useState<Phase>('idle');
const [progress, setProgress] = useState({ current: 0, max: 100 });
const [message, setMessage] = useState('');
const status = phase === 'success' ? 'success' : phase === 'error' ? 'exception' : undefined;
```

业务状态单独维护；不能仅凭 `current === max` 认定后端任务成功。

## 4. 事件与交互逻辑

### 同一数据展示线形与环形

```tsx
<ProgressBar type="line" format="steps" current={done} max={total} status={status} labelPosition="after" />
<ProgressBar type="circle" current={done} max={total} circleStatus={status} labelPosition="after" />
```

- 业务保证 `max` 是大于 0 的有限数，`current` 是有限数并在 `[0, max]` 内；无效数据不直接送入组件。
- `format` 只用于线形；环形颜色用 `strokeColor`，它会覆盖 `circleStatus` 的状态颜色。
- `hasDecimal` 只控制显示小数，不负责舍入；需要一位小数时业务先处理数值。
- 成功状态由任务成功回包触发；失败时 `exception` + 错误文案，不能把进度归零后隐藏错误。

### 模态与超时是独立能力

```tsx
<ProgressBar modal isOpen={running} current={done} max={total}
  labelPosition="after" modalMessageTip="正在处理，请稍候" />
```

若沿用 `overTime`，只用正整数秒：间隔为 `Math.round(overTime) * 10` 毫秒，每次增加 `max/100`，到约 99% 停止并调用 `onOverTime`，不代表后台完成。API 未规定回调参数，不读取未记录参数。

计时从挂载开始，修改 `overTime` / `current` 都不重启或清除；与外部 current 并用时，二者共同写内部进度，最后写入者生效。条件重挂虽会开启新计时器，旧实例却无卸载清理，可能继续运行至自身停止，不能把它当安全的取消 / 重试方案。默认由业务拥有计时器，在取消、重试和卸载时清理，向组件只传 current；成功、失败和关闭模态仍由业务结果决定。

## 5. 数据结构

```tsx
interface JobProgress { current: number; max: number; }
// 业务 Service 契约，不是 ProgressBar 的 prop
type RunJob = (report: (completed: number) => void, signal: AbortSignal) => Promise<void>;
```

`RunJob` 仅在后台确认任务成功时 resolve，失败时 reject；report 只报告已完成数量。任务控制、权限检查和取消能力由已有 Service 提供。

## 6. 联动说明

- 开始任务前同步加锁，运行中禁用开始按钮；重复点击不能创建并行任务。
- 取消 / 重试 / 切换任务后，旧请求的迟到回调不能覆盖当前进度；用版本标记或已有请求取消机制隔离。
- 取消和重试按钮是 [Button](Button.md)，不虚构 ProgressBar 的 `onCancel` / `onRetry`。
- 模态 `isOpen` 跟随运行状态；成功、失败和取消都要收尾。卸载清理订阅、轮询与计时器。
- 不明总量用 Loading；总量为 0 的空任务先给业务说明，不传 `max={0}`。

## 7. 完整代码示例

```tsx
import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '@nce/eview-react/ProgressBar';
import Button from '@nce/eview-react/Button';

type Phase = 'idle' | 'running' | 'success' | 'error';
interface Props {
  total: number;
  run: (report: (completed: number) => void, signal: AbortSignal) => Promise<void>;
}

export default function BatchProgress({ total, run }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState({ current: 0, max: Number.isFinite(total) && total > 0 ? total : 1 });
  const [message, setMessage] = useState('尚未开始');
  const request = useRef<AbortController | null>(null);
  const version = useRef(0);
  useEffect(() => () => { version.current += 1; request.current?.abort(); }, []);
  const validTotal = Number.isFinite(total) && total > 0;

  const handleStart = async () => {
    if (request.current || !validTotal) return;
    const controller = new AbortController();
    request.current = controller;
    const token = ++version.current;
    setProgress({ current: 0, max: total });
    setPhase('running');
    setMessage('正在处理');
    try {
      await run((completed) => {
        if (token !== version.current || !Number.isFinite(completed)) return;
        setProgress({ current: Math.min(total, Math.max(0, completed)), max: total });
      }, controller.signal);
      if (token !== version.current) return;
      setProgress({ current: total, max: total });
      setPhase('success');
      setMessage('全部处理成功');
    } catch (error) {
      if (token !== version.current) return;
      setPhase('error');
      setMessage(error instanceof Error ? error.message : '处理失败，请重试');
    } finally {
      if (token === version.current) { request.current = null; version.current += 1; }
    }
  };
  const handleCancel = () => {
    version.current += 1;
    request.current?.abort();
    request.current = null;
    setPhase('idle');
    setMessage('已停止等待；后台是否取消以任务服务结果为准');
  };
  const status = phase === 'success' ? 'success' : phase === 'error' ? 'exception' : undefined;

  return (
    <section className="app-batch-progress" style={{ width: 640, maxWidth: '100%' }}>
      <h2>批量处理</h2>
      <ProgressBar current={progress.current} max={progress.max}
        format="steps" status={status} labelPosition="after" />
      <ProgressBar type="circle" current={progress.current} max={progress.max}
        circleStatus={status} circleWidth={96} labelPosition="after" />
      <p role={phase === 'error' ? 'alert' : 'status'}>{validTotal ? message : '没有可处理的有效任务'}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button text={phase === 'error' ? '重试' : '开始'} status="primary"
          disabled={!validTotal || phase === 'running'} onClick={handleStart} />
        <Button text="停止等待" disabled={phase !== 'running'} onClick={handleCancel} />
      </div>
    </section>
  );
}
```

示例展示真实回报进度，不使用 `overTime`；将已有任务服务作为 `run` 传入。`AbortSignal` 能否取消后台任务取决于服务契约，不能把停止前端等待当成取消成功。

## 8. 反面示例

```tsx
// ❌ antd 的组件名 / 数值属性：应为 ProgressBar current={50} max={100}
<Progress percent={50} />

// ❌ antd / 其他库的状态和值属性；环形须用 circleStatus="exception"
<ProgressBar type="circle" percent={70} status="error" labelPosition="after" />

// ❌ 把 format 当成 antd 的格式化函数；这里只接受 percent / steps
<ProgressBar format={(value) => `${value}%`} labelPosition="after" />

// ❌ 时间到就宣告后台成功；onOverTime 只通知估算超时
<ProgressBar overTime={30} onOverTime={() => setPhase('success')} labelPosition="after" />

// ❌ 组件没有任务生命周期回调；取消/完成由业务 Service 处理
<ProgressBar onComplete={saveResult} onCancel={cancelJob} labelPosition="after" />
```

## 9. API 速查

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'line' \| 'circle'`，默认 `line` | 线形 / 环形 |
| `current` / `max` | `number`，默认 `0` / `100` | 当前量 / 总量；业务先校验范围 |
| `format` | `'percent' \| 'steps'`，默认 `percent` | 线形文本：百分比 / 分数 |
| `status` / `circleStatus` | `'success' \| 'exception'` | 分别用于线形 / 环形；正常运行不传 |
| `labelPosition` | `'before' \| 'after' \| 'middle' \| 'none'`，默认 `after` | 文本位置；兼容类型声明时显式传入 |
| `hasDecimal` | `boolean`，默认 `false` | 显示小数，不负责舍入 |
| `barStyle` / `barBackStyle` | `CSSProperties` | 进度条 / 背景条样式 |
| `overTime` / `onOverTime` | `number` / 回调 | 正整数秒 / 约 99% 时通知；挂载计时，无重启与卸载清理，见 §4 |
| `modal` / `isOpen` | `boolean`，均默认 `false` | 模态模式 / 模态显示 |
| `modalMessageTip` / `mountId` | `string \| ReactNode` / `string`，mountId 默认 `body` | 模态说明 / 挂载容器 ID |
| `circleWidth` / `strokeWidth` | `number`，默认 `160` / `6` | 环形画布宽度 / 环线宽度 |
| `strokeColor` / `strokeLinecap` | `string` / `'round' \| 'butt' \| 'square'`，默认 `round` | 环形颜色（覆盖状态色）/ 端点形状 |
| `id` / `className` / `style` | `string` / `string` / `CSSProperties` | 最外层标识与样式 |
