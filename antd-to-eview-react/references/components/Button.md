# Button 组件功能逻辑规格

> 资料来源：TypeDoc `Button/types`、`ButtonGroup/types` + 官网 Button 页示例。
> ⚠️ `status` 缺 `text`、`size` 缺 `small` 在源码类型里，但 TypeDoc 表与示例都有 → 以表 + 示例为准。
> ⚠️ `onClick(event, additionalData)`——**第二个参数**才是业务数据；eview 没有 `type`/`loading`/`htmlType`，文字用 `text`，主/次/危险/纯文字用 `status`。处理中靠 `disabled` + 文案切换表达（无 `loading`）。

## 1. 功能定位

Button 是发起命令的按钮。**单页面内只能有一个 `status="primary"` 主按钮**（README）。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 文字按钮（主/次/危险/纯文字） | `Button` + `status` | antd `type="primary"`/`danger` |
| 一排等宽按钮 | `ButtonGroup` + `data` | 手写多个 Button 调 margin |
| 只有图标的按钮 | `<IconPlusIc* onClick={fn} title="…" />` 直接挂 icon+（[Icon.md](Icon.md) §3） | Button 只塞 icon 不给文字 |
| 文字链接样式 | `status="text"` | `<a>` |

`status`: `'default' | 'primary' | 'risk' | 'text'`（默认 `default`）。

## 2. 事件与交互逻辑

### onClick(event, additionalData) —— 防重复 + additionalData 区分来源

```tsx
// 提交：防连点 + disabled + 文案切换表达处理中
<Button status="primary" text={submitting ? '提交中...' : '提交'} disabled={!canSubmit || submitting}
  onClick={async () => {
    if (submitting) return;
    setSubmitting(true);
    try { await api.submit(form); } finally { setSubmitting(false); }
  }} />

// 多个按钮共一个 handler，用 additionalData 区分
<Button text="编辑" additionalData={{ id: row.id, action: 'edit' }} onClick={handleRowAction} />
<Button text="删除" status="risk" additionalData={{ id: row.id, action: 'delete' }} onClick={handleRowAction} />
const handleRowAction = (event: object, data: any) => { /* data 就是 additionalData */ };

// 文字溢出悬浮提示
<Button text={longText} tipType="tipbox" tipShow="overflow" tipData={longText} />
```

### ButtonGroup：data 驱动，不写 children

```tsx
<ButtonGroup data={[{ text: '上一步', onClick: handlePrev }, { text: '下一步', status: 'primary', onClick: handleNext }]} />
```

### 图标：leftIcon / rightIcon 用 icon+；纯图标按钮用 icon+ 直接挂 onClick

```tsx
import { IconPlusIcPublicSave, IconPlusIcPublicRefresh } from '@nce/icon-plus';

// 文字 + 图标
<Button status="primary" text="保存" leftIcon={<IconPlusIcPublicSave iconSize={14} iconColor={['currentcolor']} />} onClick={handleSave} />

// antd 纯图标按钮（Button type="text" shape="circle" icon 无 children）→ 剥 Button 外壳，icon+ 直接挂 onClick + 原生 title
//   脚本 --apply 已先把内层 <Icon>→<IconPlusIcPublicRefresh iconSize={14}/>，LLM 只需剥外壳 + 搬 onClick/title
<IconPlusIcPublicRefresh onClick={handleRefresh} title="刷新" iconSize={14} iconColor={['currentcolor']} />
```

> **图标尺寸别丢**：源 `size={15}` 不是丢掉，而是吸附到 `iconSize={14}` 写到 `<IconPlusIcPublicRefresh />` 上（默认 14；吸附规则见 [match-icons.cjs](../../scripts/match-icons.cjs)）。纯图标按钮剥 Button 外壳后，onClick/title 直接挂到 icon+（`IconButton` 已弃用，不再有"按钮尺寸 vs 图标尺寸"之分）。antd `@ant-design/icons` 没有 `size` prop、尺寸走 `style.fontSize`，同样剥 `px` 取数字吸附到 `iconSize`。

## 3. 联动说明

- `status="risk"` 点击 → 先弹确认框（[MessageDialog.md](MessageDialog.md)）再执行

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 type="primary" / danger / loading / htmlType
<Button type="primary" loading={submitting} htmlType="submit">提交</Button>

// ❌ 没有 onClick 或没防重复
<Button status="primary" text="提交" />
<Button text="提交" onClick={() => api.submit(form)} />

// ❌ 把 onClick 第一个参数当业务数据（第一个是 event，第二个才是 additionalData）
<Button additionalData={{ id: 1 }} onClick={(data) => remove(data.id)} />

// ❌ 单页出现两个 primary
<Button status="primary" text="保存" /><Button status="primary" text="发布" />

// ❌ 危险操作不二次确认
<Button status="risk" text="删除全部" onClick={() => api.deleteAll()} />
```

## 5. API 速查

> 压缩自 `Button/types`、`ButtonGroup/types`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `text` / `children` | `any` / `React.ReactNode` | 按钮文字；**带 `leftIcon`/`rightIcon`/`icon` 时必须用 `text`，不能用 children——children 会让图标不渲染**（无图标时二者等价） |
| `status` | `'default' \| 'primary' \| 'risk' \| 'text'`，默认 `default` | 主 / 次 / 危险 / 纯文字；**不是 `type`** |
| `size` | `'normal' \| 'large' \| 'small'`，默认 `normal` | 尺寸 |
| `disabled` | `boolean`，默认 `false` | 灰化；处理中也用它表达 |
| `focused` | `boolean`，默认 `false` | 是否默认聚焦 |
| `leftIcon` / `rightIcon` | `string \| React.ReactElement` | 图标路径或 icon+ 组件（`IconPlus.tsx`） |
| `leftIconProps` / `rightIconProps` | `{ leftHoverIcon, leftDisabledIcon, leftIconClass, leftIconDisabledClass }` | 悬浮 / 禁用态图标 |
| `onClick` | `(event: object, additionalData: any) => void` | **第二个参数**是 `additionalData` |
| `additionalData` | `object` | 透传给 `onClick` 的业务数据 |
| `onFocus` / `onBlur` / `onKeyDown` / `onMouseLeave` | 回调 | 原生事件透传 |
| `tipType` | `'title' \| 'tipbox'`，默认 `title` | 提示形式 |
| `tipShow` | `'always' \| 'never' \| 'overflow'`，默认 `never` | 何时显示 |
| `tipData` | `string` | 提示文案，不传则用 `text` |
| `id` / `className` / `style` | — | 透传 |
| `ButtonGroup.data` | `Array<ButtonProps>` | 每项可写 Button 全部属性 |
| `ButtonGroup.itemClassName` / `itemStyle` | — | 控制各按钮间距 |
