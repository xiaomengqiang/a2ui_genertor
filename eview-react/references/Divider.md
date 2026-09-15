# Divider 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Divider/Divider`；官网组件页 Divider 及示例 `DividerBasic.jsx` / `DividerPositoin.jsx` / `DividerVertical.jsx`

## 1. 功能定位

Divider 是内容分割线：水平（默认）或垂直，可虚线，可带标题文字（`children`）并指定文字位置。纯展示组件，无状态、无事件。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 区块之间的横线 | `<Divider />` | `<hr>` / 手写 border |
| 带小标题的分组线（"基本信息" / "高级配置"） | `<Divider orientation="left">基本信息</Divider>` | Divider + 单独的标题 div |
| 行内操作之间的竖线（编辑 \| 删除） | `<Divider type="vertical" />` | 文字 `\|` |
| 表单分组带折叠 | `Panel` / `Accordion`（后续批次） | Divider |

## 2. 典型场景

- 表单按区块分组：每组前一条 `orientation="left"` 的标题分割线
- 表格操作列：多个文字按钮之间用竖线隔开
- 详情页卡片内不同信息段之间的横线
- 弱化的辅助分隔用 `dashed`

## 3. 状态声明

无需状态。分割线的显隐跟随所在区块的条件渲染即可：

```tsx
{showAdvanced ? (
  <>
    <Divider orientation="left">高级配置</Divider>
    …高级配置字段…
  </>
) : null}
```

## 4. 事件与交互逻辑

没有事件。唯一的"逻辑"是布局：

```tsx
// 水平：默认占满父容器宽度，上下自带间距
<Divider />
<Divider dashed />

// 带标题：children 是标题内容，orientation 定位置（left / center / right）
<Divider orientation="left">基本信息</Divider>
<Divider orientation="center">或</Divider>

// 垂直：放在行内元素之间，父容器需为行内 / flex 布局
<span>编辑</span>
<Divider type="vertical" />
<span>删除</span>
```

## 5. 数据结构

无。

## 6. 联动说明

- 表单分组标题跟随分组显隐一起条件渲染，不要留下孤立的分割线
- 操作列里某个按钮因权限隐藏时，相邻的竖线也要一起隐藏（把"按钮 + 竖线"作为一组渲染）
- `orientation` 与页面文字对齐方向一致：左对齐表单用 `left`

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import Divider from '@nce/eview-react/Divider';
import TextField from '@nce/eview-react/TextField';
import Checkbox from '@nce/eview-react/Checkbox';
import Button from '@nce/eview-react/Button';

// 分组表单：基本信息 / 高级配置（可展开），操作区用竖线分隔文字按钮
export default function GroupedForm() {
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [timeout, setTimeoutValue] = useState<string>('30');
  const canDelete = false; // 例：无删除权限时隐藏"删除"及其前面的竖线

  return (
    <div style={{ width: 480, padding: 24 }}>
      <Divider orientation="left">基本信息</Divider>
      <TextField label="名称" required value={name} onChange={(v: string) => setName(v)} />
      <TextField label="描述" value={desc} onChange={(v: string) => setDesc(v)} style={{ marginTop: 12 }} />

      <Checkbox
        label="显示高级配置"
        checked={showAdvanced}
        onChange={(value, checked: boolean) => setShowAdvanced(checked)}
        style={{ marginTop: 16 }}
      />

      {showAdvanced ? (
        <>
          <Divider orientation="left" dashed>高级配置</Divider>
          <TextField label="超时(秒)" format="number" value={timeout} onChange={(v: string) => setTimeoutValue(v)} />
        </>
      ) : null}

      <Divider />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button status="text" text="保存草稿" onClick={() => {}} />
        <Divider type="vertical" />
        <Button status="text" text="预览" onClick={() => {}} />
        {canDelete ? (
          <>
            <Divider type="vertical" />
            <Button status="text" text="删除" onClick={() => {}} />
          </>
        ) : null}
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：eview Divider 没有 orientationMargin / plain / variant，标题位置只有 orientation
<Divider orientationMargin={0} plain variant="dotted">标题</Divider>

// ❌ 用 <hr> 或手写 border 代替，主题切换（aui3_1 / dark）时颜色不跟随
<hr style={{ borderColor: '#ddd' }} />

// ❌ 标题不放 children，另写一个 div，间距和字号与规范不一致
<div className="group-title">基本信息</div>
<Divider />

// ❌ 垂直分割线放在块级容器里，撑不出高度看不见
<div><Divider type="vertical" /></div>

// ❌ 按钮被权限隐藏后竖线还在，出现两条相邻竖线
<Button text="预览" /><Divider type="vertical" /><Divider type="vertical" /><Button text="导出" />
```

## 9. API 速查

> 压缩自 `Divider/Divider`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'horizontal' \| 'vertical'`，默认 `horizontal` | 水平 / 垂直 |
| `dashed` | `boolean`，默认 `false` | 虚线 |
| `orientation` | `'left' \| 'right' \| 'center'` | 标题文字位置 |
| `children` | `ReactNode` | 标题内容（可放按钮等） |
| `id` / `className` / `style` | — | 最外层容器 |
