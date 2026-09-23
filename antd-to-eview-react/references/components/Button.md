# Button 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Button/types`、`ButtonGroup/types`；官网组件页 Button 及示例 `Status.tsx` / `Size.tsx` / `Disabled.tsx` / `Icon.tsx` / `IconPlus.tsx` / `Tip.tsx` / `ButtonGroup.tsx`
>
> ⚠️ 源码 `Button/types.ts` 里 `status` 缺 `text`、`size` 缺 `small`，但 TypeDoc 表与示例 `Status.tsx` / `Size.tsx` 都有 → 以 TypeDoc 表 + 示例为准。

## 1. 功能定位

Button 是发起命令并获取结果的按钮。页面上凡是"点一下要做一件事"（提交、查询、删除、打开弹窗）都用它；**单个页面内只能有一个 `status="primary"` 主按钮**（`demos/Button/README.md`）。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 文字按钮（主/次/危险/纯文字） | `Button` + `status` | antd 的 `type="primary"` / `danger` |
| 一排等宽按钮 | `ButtonGroup` + `data` | 手写多个 `Button` 再调 margin |
| 只有图标的按钮 | `IconButton`（第二批） | `Button` 只塞 icon 不给文字 |
| 文字链接样式 | `TextButton`（第二批）或 `status="text"` | `<a>` |

## 2. 典型场景

- 表单底部的"提交 / 重置"：主按钮提交，次按钮重置
- 列表页顶部工具栏："新建"主按钮 + "导出"次按钮
- 行内危险操作："删除" 用 `status="risk"`，点击后先弹确认框
- 一组同级操作用 `ButtonGroup`，如"上一步 / 下一步"

## 3. 状态声明

```tsx
// 处理中：eview-react Button 没有 loading 属性，用 disabled + 文案切换表达
const [submitting, setSubmitting] = useState<boolean>(false);

// 表单是否可提交（由字段校验结果派生，不单独存）
const canSubmit = username.trim() !== '' && password.length >= 6 && !submitting;
```

## 4. 事件与交互逻辑

### onClick 是唯一核心事件 —— 注意签名 `(event, additionalData)`

```tsx
// 场景一：提交请求（防重复 + loading 表达）
<Button
  status="primary"
  text={submitting ? '提交中...' : '提交'}
  disabled={!canSubmit}
  onClick={async () => {
    if (submitting) return;            // 防连点
    setSubmitting(true);
    try {
      await api.submit(form);
    } finally {
      setSubmitting(false);
    }
  }}
/>

// 场景二：同一个处理函数服务多个按钮，用 additionalData 区分
<Button text="编辑" additionalData={{ id: row.id, action: 'edit' }} onClick={handleRowAction} />
<Button text="删除" status="risk" additionalData={{ id: row.id, action: 'delete' }} onClick={handleRowAction} />

const handleRowAction = (event: object, data: any) => {   // 第二个参数就是 additionalData
  if (data.action === 'delete') {
    setConfirmVisible(true);           // 危险操作先二次确认（MessageDialog，第二批）
    return;
  }
  openEditor(data.id);
};

// 场景三：文字溢出时悬浮显示完整提示
<Button text={longText} tipType="tipbox" tipShow="overflow" tipData={longText} />
```

### ButtonGroup：用 data 驱动，不写 children

```tsx
const groupData = [
  { text: '上一步', onClick: handlePrev },
  { text: '下一步', status: 'primary', onClick: handleNext },
];
<ButtonGroup data={groupData} />
```

### 图标：leftIcon / rightIcon 用 icon+

> 迁移期若源项目用 `<Icon name="...">` shim（自定义 `<Icon>` 组件，A 范式），调用点零改动即可；下例 `leftIcon`/`rightIcon` 用 icon+ 静态组件为 B 目标范式（可选，见 [source-project-guidelines §3.3](../source-project-guidelines.md)）。

```tsx
import { IconPlusIcPublicSave, IconPlusIcPublicArrowRight } from '@nce/icon-plus';
<Button status="primary" text="保存" leftIcon={<IconPlusIcPublicSave />} onClick={handleSave} />
<Button text="下一步" rightIcon={<IconPlusIcPublicArrowRight />} onClick={handleNext} />
```

### 纯图标按钮：antd `Button type="text" shape="circle" icon` → `IconButton`

antd 把 Button 当纯图标按钮用（有 `icon`、`type="text"`、`shape="circle"`、无文字 children）时，**不要**转成原生 `<button>+<Icon>`，用 `IconButton`（[Icon.md](Icon.md)）：

```tsx
// antd 源
<Button size="small" type="text" shape="circle" icon={<Icon name="refresh-cw" size={15} />} onClick={() => message.success("已刷新")} />

// eview-react 迁移（IconButton + icon+；提示文案移到 tipText）
import { IconPlusIcPublicRefresh } from '@nce/icon-plus';
import IconButton from '@nce/eview-react/IconButton';
<IconButton iconName={<IconPlusIcPublicRefresh />} tipText="刷新" size="small" onClick={handleRefresh} />
```

> 判定信号：antd `Button` 同时有 `icon` 且无文字 children（常见 `type="text"` + `shape="circle"`）→ 走 `IconButton`。

## 5. 数据结构

```tsx
// ButtonGroup.data 的每一项可定义 Button 的所有属性（api/ButtonGroup_types.md）
interface ButtonGroupItem {
  text: string;
  status?: 'default' | 'primary' | 'risk' | 'text';
  size?: 'normal' | 'large' | 'small';
  disabled?: boolean;
  onClick?: (event: object, additionalData?: any) => void;
  additionalData?: object;
}
```

## 6. 联动说明

- 表单字段全部校验通过 → 提交 Button `disabled={false}`
- 点击提交 → `submitting=true` → 请求结束 `finally` 复位 → 成功后跳转 / 提示
- Checkbox / Table 勾选数量 > 0 → "批量删除" 按钮出现或解锁
- `status="risk"` 按钮点击 → 打开确认弹窗 → 确认后才执行删除
- Form 场景下按钮 `onClick` 调 `formRef.current.submit()`，校验和值收集交给 Form（见 `demos/Form/__demo__/FormRule.jsx`）

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import Button from '@nce/eview-react/Button';
import TextField from '@nce/eview-react/TextField';

// 登录页：两个输入框 + 主按钮，演示防重复提交、禁用态、错误反馈
export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const canSubmit = username.trim().length >= 3 && password.length >= 6 && !submitting;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      // 模拟登录请求；真实项目替换为已有的 Service
      const ok = username === 'admin' && password === '123456';
      if (!ok) {
        setErrorMsg('用户名或密码错误');
      }
    } catch (e) {
      setErrorMsg('网络异常，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setErrorMsg('');
  };

  return (
    <div style={{ width: 360, padding: 24 }}>
      <TextField
        label="用户名"
        placeholder="至少 3 位"
        value={username}
        onChange={(value: string) => setUsername(value)}
      />
      <TextField
        label="密码"
        placeholder="至少 6 位"
        type="password"
        autoComplete="off"
        isAllowToModifyPasswordByProps   // 重置时要通过 props 清空密码，必须开启
        value={password}
        onChange={(value: string) => setPassword(value)}
        style={{ marginTop: 16 }}
      />
      {errorMsg ? <div style={{ color: '#f43146', marginTop: 8 }}>{errorMsg}</div> : null}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button
          status="primary"
          text={submitting ? '登录中...' : '登录'}
          disabled={!canSubmit}
          onClick={handleLogin}
        />
        <Button text="重置" disabled={submitting} onClick={handleReset} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 习惯：eview-react 没有 type="primary" / danger / loading / htmlType
<Button type="primary" loading={submitting} htmlType="submit">提交</Button>

// ❌ antd 纯图标 Button 退化为原生 <button>+<Icon>（应用 IconButton iconName tipText）
<button type="button" className="app-icon-btn" onClick={notify}><Icon name="refresh-cw" /></button>

// ❌ 没有 onClick，点了没反应
<Button status="primary" text="提交" />

// ❌ 没有防重复：连点会发多次请求
<Button text="提交" onClick={() => api.submit(form)} />

// ❌ 把 onClick 第一个参数当业务数据（第一个是 event，第二个才是 additionalData）
<Button additionalData={{ id: 1 }} onClick={(data) => remove(data.id)} />

// ❌ 一个页面出现两个主按钮（README：单页只能有一个 primary）
<Button status="primary" text="保存" />
<Button status="primary" text="发布" />

// ❌ 危险操作直接执行，没有二次确认
<Button status="risk" text="删除全部" onClick={() => api.deleteAll()} />
```

## 9. API 速查

> 压缩自 `api/Button_types.md` / `api/ButtonGroup_types.md`，不含表外行。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `text` / `children` | `any` / `React.ReactNode` | 按钮文字，二者等价 |
| `status` | `'default' \| 'primary' \| 'risk' \| 'text'`，默认 `default` | 主 / 次 / 危险 / 纯文字；**不是 `type`** |
| `size` | `'normal' \| 'large' \| 'small'`，默认 `normal` | 尺寸 |
| `disabled` | `boolean`，默认 `false` | 灰化；处理中也用它表达 |
| `focused` | `boolean`，默认 `false` | 是否默认聚焦 |
| `leftIcon` / `rightIcon` | `string \| React.ReactElement` | 图标路径或 icon+ 组件（`IconPlus.tsx`） |
| `leftIconProps` / `rightIconProps` | `{ leftHoverIcon, leftDisabledIcon, leftIconClass, leftIconDisabledClass }` | 悬浮 / 禁用态图标 |
| `onClick` | `(event: object, additionalData: any) => void` | **第二个参数**是 `additionalData` |
| `additionalData` | `object` | 透传给 `onClick` 的业务数据 |
| `onFocus` / `onBlur` / `onKeyDown` / `onMouseLeave` | 回调 | 原生事件透传 |
| `tipType` | `'title' \| 'tipbox'`，默认 `title` | 提示形式：浏览器 title 或 eview TipBox |
| `tipShow` | `'always' \| 'never' \| 'overflow'`，默认 `never` | 何时显示提示 |
| `tipData` | `string` | 提示文案，不传则用 `text` |
| `id` / `className` / `style` | — | 常规透传 |
| `ButtonGroup.data` | `Array<ButtonProps>` | 每项可写 Button 全部属性 |
| `ButtonGroup.itemClassName` / `itemStyle` | `string` / `CSSProperties` | 控制各按钮间距 |
