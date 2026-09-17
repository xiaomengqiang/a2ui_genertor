# TipBox 组件功能逻辑规格（气泡提示）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `TipBox/TipBox`；官网组件页 TipBox 及示例 `TipBoxBasic.jsx` / `TipBoxPosition.jsx` / `TipBoxIn.jsx` / `TipBoxWidth.jsx` / `TipBoxColor.jsx` / `TipBoxCustom.jsx`
>
> ⚠️ 推荐写法是**包裹式**：`<TipBox content="…" trigger="hover" direction="top"><Button /></TipBox>`；README 把用 `position=[top,left]` 手动定位的老写法标为"传统用法（不推荐）"。
> ⚠️ 被包裹的元素必须支持 `onMouseEnter / onMouseLeave / onClick / onFocus / onBlur`（原生标签或 eview 组件都行）。
> ⚠️ `direction` 支持 12 个方位（`top / topLeft / topRight / bottom / … / leftTop / rightBottom`），`arrowDirection="none"` 隐藏箭头；`type="simple"` 是无标题的简洁气泡。

## 1. 功能定位

TipBox 是悬停 / 点击 / 聚焦触发的气泡卡片：标题 + 内容（可 ReactNode），12 个方向，可手动关闭。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 悬浮说明、字段帮助 | `TipBox type="simple" content="…"` 包裹目标 | antd `Tooltip title` / `Popover` |
| 图标按钮的提示 | `IconButton tipText`（[Icon.md](Icon.md)，内部就是 TipBox） | 再包一层 TipBox |
| 表格单元格溢出提示 | `Table` 列 `tipFormatter`（[Table.md](Table.md)） | 每格包 TipBox |
| 需要用户操作的浮层 | `Dialog` / `PopUpMenu`（未覆盖） | TipBox 塞按钮 |

## 2. 典型场景

- 表单字段旁的问号：`trigger="hover"` 说明取值规则
- 截断文字悬浮显示全文：`content` 放完整文本，`style={{ maxWidth }}` 限宽
- 点击展开详情卡片：`trigger="click"` + `isMouseLeaveClose={false}` + `isClosable`
- 输入框校验错误气泡：控件自带 `hintType="tip"` 已经是 TipBox，不用手包

## 3. 状态声明

```tsx
// 悬浮类无需状态；点击展开且需要程序化关闭时用 key 重挂或控制 display（有 children 时 display 不生效，见 API）
const [helpKey, setHelpKey] = useState<number>(0);
```

## 4. 事件与交互逻辑

```tsx
// 悬停说明（最常用）
<TipBox type="simple" content="端口范围 1-65535" direction="top">
  <Icon name="ict_questionmarkCircle" />
</TipBox>

// 点击展开、鼠标移出不关、带关闭按钮
<TipBox title="策略说明" content={<div style={{ maxWidth: '20rem' }}>{longText}</div>} trigger="click" direction="rightTop" isMouseLeaveClose={false} isClosable>
  <Button status="text" text="查看说明" />
</TipBox>

// 聚焦触发（键盘可达）
<TipBox content="按 Enter 提交" trigger="focus" direction="bottom"><Button text="提交" /></TipBox>

// 无箭头 + 自动消失
<TipBox type="simple" content="已复制" arrowDirection="none" disposeTimeOut={1500} trigger="click"><Button text="复制" onClick={copy} /></TipBox>
```

## 5. 数据结构

```tsx
type Trigger = 'hover' | 'click' | 'focus';
type Direction = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom';
```

## 6. 联动说明

- 字段帮助气泡内容与 `TextField.ruleText` 二选一，避免同一信息出现两次
- 复制成功"已复制"气泡用 `disposeTimeOut` 自动消失，不要另起 DivMessage
- 表格里大量单元格用列级 `tipFormatter`，不要逐格包 TipBox（性能）

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import TipBox from '@nce/eview-react/TipBox';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';
import Icon from '@nce/eview-react/Icon';

// 表单字段帮助气泡 + 点击展开的策略说明 + 复制反馈气泡
export default function TipBoxUsage() {
  const [port, setPort] = useState<string>('');
  const [token] = useState<string>('a1b2c3d4');

  return (
    <div style={{ width: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TextField label="端口" format="number" value={port} onChange={(v: string) => setPort(v)} />
        <TipBox type="simple" content="取值 1-65535，1024 以下需管理员权限" direction="top">
          <Icon name="ict_questionmarkCircle" />
        </TipBox>
      </div>

      <TipBox
        title="限速策略说明"
        content={<div style={{ maxWidth: '20rem' }}>策略按接口生效；修改后需重启接口才能应用到已建立的会话。</div>}
        trigger="click"
        direction="rightTop"
        isMouseLeaveClose={false}
        isClosable
      >
        <Button status="text" text="查看策略说明" />
      </TipBox>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Token：{token}</span>
        <TipBox type="simple" content="已复制" arrowDirection="none" trigger="click" disposeTimeOut={1500}>
          <Button size="small" text="复制" onClick={() => navigator.clipboard?.writeText(token)} />
        </TipBox>
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：没有 Tooltip / Popover / title 属性做内容 / placement
<Tooltip title="说明" placement="topLeft"><Icon /></Tooltip>

// ❌ 传统定位写法（README 标不推荐）：手算 position
<TipBox position={[120, 40]} content="说明" display />

// ❌ 包裹的元素不支持鼠标 / 焦点事件（如自定义组件没透传 onMouseEnter），气泡永远不出
<TipBox content="说明"><MyCustomWidget /></TipBox>

// ❌ 有 children 的场景还想用 display 控制显隐（API 注明不支持）
<TipBox display={show} content="说明"><Button /></TipBox>

// ❌ 方向写 antd 的 placement 值
<TipBox direction="topCenter" />
```

## 9. API 速查

> 压缩自 `TipBox/TipBox`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `children` | `ReactNode` | 被包裹的触发元素（推荐写法） |
| `content` / `title` | `any` / `string` | 内容 / 标题 |
| `trigger` | `'hover' \| 'click' \| 'focus'` 或数组 | 触发方式，默认悬停 |
| `direction` | 12 方位，如 `'top' \| 'topLeft' \| 'rightBottom'` | 弹出方向 |
| `arrowDirection` | `'left' \| 'right' \| 'top' \| 'bottom' \| 'none'`，默认 `bottom` | 箭头方向 / 隐藏 |
| `type` | `'normal' \| 'simple'` | 简洁气泡（无标题） |
| `isMouseLeaveClose` | `boolean`，默认 `true` | 鼠标移出自动关 |
| `isClosable` / `onClose` | `boolean`（默认 false）/ `(event) => void` | 手动关闭按钮 |
| `disposeTimeOut` / `onDispose` | `number`（默认 0 不自动关）/ 回调 | 自动关闭 |
| `display` / `displayMode` | `boolean`（默认 true）/ `string` | 显隐（**有 children 时不支持**） |
| `position` | `[top, left]` | 传统手动定位（不推荐） |
| `isErrorTip` / `errorTitle` / `errorContent` / `errorInputClassName` | — | 错误提示样式（控件 `hintType="tip"` 内部使用） |
| `titleStyle` / `titleClassName` / `style` / `className` / `id` / `animationTime` / `autoZindex` | — | 样式与层级 |
