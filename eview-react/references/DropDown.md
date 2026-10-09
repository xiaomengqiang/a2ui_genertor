# DropDown 组件功能逻辑规格（一级操作菜单）

> ⚠️ 名称是 `DropDown`：用 `data` + `onItemClick(item, event)`，只支持一级操作菜单；多级操作用 [PopUpMenu](PopUpMenu.md)。分组分割不是分裂按钮。
> ⚠️ 展开由组件管理，没有已记录的 `open` / `visible` 或 ref 开关接口。`onDropDown` 仅通知打开且参数恒为 `true`；关闭通知用无参 `onClosePopup()`。`selectedIndex` 匹配项的 `value`，不是下标；`0` / 空字符串会转为 `null`。
> 本文行为以 R26.0-NCE 3.10.36+6 源码核验为依据；其他版本仅采用明确核对过的结论，不视为已在目标工程运行通过，见[版本边界](patterns/project-setup.md)。

## 1. 功能定位

DropDown 收纳“更多操作”，点击触发器展开菜单，业务根据点击项执行命令。

| 想要的效果 | 用什么 | 不要用 |
|------------|--------|--------|
| 一级更多操作、导出命令 | `DropDown data` | antd `Dropdown menu.items` |
| 多级弹出菜单 | [PopUpMenu](PopUpMenu.md) | 给 DropDown 项添加 `children` |
| 表单选值 / 筛选 | [Select](Select.md) / [MultipleSelect](MultipleSelect.md) | 把操作菜单当输入控件 |

基于 Popup 封装不代表能传任意 Popup 属性，仍按本组件已记录的 API 使用。

## 2. 典型场景

- 配置详情页“更多操作”：复制、导出、发布，权限不足时保留禁用项。
- 表格批量操作：按当前选择派生禁用态，执行时快照选中 ID。
- 菜单分组标题、分割线、自定义 Button 触发器。

## 3. 状态声明

```tsx
const [pending, setPending] = useState(false);
const inFlight = useRef(false); // 同一轮 React 更新前也拦截重复请求
const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
// data 由权限、业务条件、pending 派生；无需 Select 式 value 或伪造 open state。
```

## 4. 事件与交互逻辑

- `onItemClick(item, event)`：第一个参数是传入的菜单项，第二个才是事件；不是 `{ key, domEvent }`。
- 先拦截分组、禁用项、缺少 `value` 的项；再匹配**当前**菜单复核权限与动作白名单。`value=0` 有效，不能用 `if (item.value)` 判断。
- `selectedIndex` 与 `data[i].value` 严格比较，父组件更新有效，展开时也按最新值高亮；焦点初始化使用匹配位置。内部先做 `selectedIndex ? selectedIndex : null`，所以 `0` / 空字符串不能用来高亮对应项，不能改传字符串 `'0'` 绕过类型匹配。需要高亮时为业务项定义非零、非空值；普通操作菜单可省略。此限制不影响点击回调中 `value=0` 的有效性。
- `trigger` 是 `'click'` / `'hover'` 单个字符串，默认点击；`position` 管左右，`popupDirection` 管上下。
- `itemStyle` / `itemClassName` 作用于菜单外层，宽度可设 `itemStyle={{ width: '180px' }}`；`style` / `className` 作用于整个组件外层。
- `disabled` 禁用整体，`data[i].disabled` 禁用单项。请求先同步上锁，结束后 `finally` 解锁；失败后用户可重新选择该项重试。
- `onDropDown(true)` 仅在点击、hover 或 Enter 打开时触发；`onClosePopup()` 在选项点击、失焦、点外部、hover 移出、滚动 / resize 收起、ESC 等关闭 / 卸载路径触发。回调没有等待 Promise 或返回 `false` 阻止关闭的契约，业务完成状态与菜单关闭分开处理。

自定义触发器用 children，子 Button 不另绑业务命令；请求中父、子都禁用：

```tsx
<DropDown data={menuData} disabled={pending} onItemClick={handleItemClick}>
  <Button text={pending ? '处理中…' : '更多操作'} disabled={pending} />
</DropDown>
```

## 5. 数据结构

```tsx
// 已核验用法的业务子集，不冒充完整 dataType；本例使用数字命令 ID。
interface DropDownItem {
  text: string;
  value?: number;
  disabled?: boolean;
  tipData?: string;
  icon?: string | React.ReactElement;
  iconActive?: string | React.ReactElement;
  label?: boolean; // true 为分组标题 / 分割行，不是文字字段
}
```

分组写 `{ text: '发布操作', value: 100, label: true }`；设 `onlyShowDivider` 则只显示分割线，隐藏标题文字。普通操作项用唯一 `value`，不加子菜单字段。

`iconUrl`、项 `icon/iconActive` 支持图标元素；`iconUrl` 的旧属性表只列 string，类型表与实际用法均支持 ReactElement。图标默认从 `@nce/icon-plus` 按需导入，沿用 [Icon](Icon.md)，不猜图标导出名。

## 6. 联动说明

- 权限 / 校验结果改变 → 派生发布项 `disabled`，执行前再次检查。
- 开始请求 → 锁定命令与触发器；成功反馈，失败反馈并恢复重试入口。若操作后需刷新列表，由注入的服务或页面处理。
- 删除等危险命令 → [MessageDialog](MessageDialog.md) 确认后执行，确认时复核当前条件。
- 需要观察开关时，分别用 `onDropDown` 记录打开、`onClosePopup` 记录关闭；两者是通知，不能驱动组件显隐。

## 7. 完整代码示例

`execute` 由业务注入；Promise 完成代表业务成功，失败应 reject。重试方式是重新点击相应菜单项。

```tsx
import React, { useRef, useState } from 'react';
import DropDown from '@nce/eview-react/DropDown';

type Action = 0 | 1 | 2;
interface ActionItem { text: string; value?: number; disabled?: boolean; label?: boolean; }
interface Props {
  canPublish: boolean;
  isValid: boolean;
  execute: (action: Action) => Promise<void>;
}

export default function ConfigActions({ canPublish, isValid, execute }: Props) {
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const menuData: ActionItem[] = [
    { text: '复制配置', value: 0, disabled: pending },
    { text: '导出配置', value: 1, disabled: pending },
    { text: '发布操作', value: 100, label: true },
    { text: '发布', value: 2, disabled: pending || !canPublish || !isValid },
  ];

  const handleItemClick = async (item: ActionItem, _event: unknown) => {
    if (inFlight.current || item.disabled || item.label || item.value === undefined) return;
    const current = menuData.find((entry) => entry.value === item.value);
    if (!current || current.disabled || current.label) return;
    const action = current.value;
    if (action !== 0 && action !== 1 && action !== 2) return;
    inFlight.current = true;
    setPending(true);
    setFeedback(null);
    try {
      await execute(action);
      setFeedback({ ok: true, text: `${current.text}成功` });
    } catch (error: unknown) {
      const reason = error instanceof Error && error.message ? error.message : '请重试';
      setFeedback({ ok: false, text: `${current.text}失败：${reason}` });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return (
    <section className="app-config-actions">
      <DropDown
        text={pending ? '处理中…' : '更多操作'}
        data={menuData}
        trigger="click"
        hasBorder
        disabled={pending}
        position="right"
        popupDirection="bottom"
        itemStyle={{ width: '180px' }}
        onItemClick={handleItemClick}
      />
      {feedback && <p role={feedback.ok ? 'status' : 'alert'}>{feedback.text}</p>}
    </section>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 的 menu/items/key/label；本组件用 data 和 text/value，分组才用 label:true
<DropDown menu={{ items: [{ key: 'export', label: '导出' }] }} />

// ❌ antd trigger 数组、placement、open/onOpenChange
<DropDown trigger={['click']} placement="bottomRight" open={open} onOpenChange={setOpen} />

// ❌ 不是 Select，没有 options/value/onChange 选值契约
<DropDown options={items} value={value} onChange={setValue} />

// ❌ 第一个参数是菜单项；value=0 不能被真假值判断漏掉
<DropDown data={items} onItemClick={({ key }) => execute(key)} />
const handleItemClick = (item) => { if (item.value) execute(item.value); };

// ❌ 不能保证选中第一项：selectedIndex=0 实际向 Popup.value 传 null
<DropDown data={items} selectedIndex={0} />

// ❌ 分组分割不是分裂按钮 API，也不支持嵌套子菜单
<DropDown split data={[{ text: '导出', children: formats }]} />
```

## 9. API 速查

未列出的默认值不推断；未核验 ref 方法，不列。菜单数据为 §5 的已核验子集。

| API | 类型 / 默认值 | 说明 |
|-----|---------------|------|
| `data` | `dataType[]` | 一级菜单数据 |
| `text` / `children` | `string` / `React.ReactNode` | 默认触发文字 / 自定义触发内容 |
| `onItemClick` | `(item: dataType, e: any) => void` | 菜单项在前，事件在后 |
| `trigger` | `'click' \| 'hover'`，默认 `'click'` | 触发方式，非数组 |
| `disabled` | `boolean`，默认 `false` | 整体禁用，单项禁用写在 data 中 |
| `position` / `popupDirection` | `'left' \| 'right' \| 'auto'` / `'top' \| 'bottom' \| 'auto'`，均默认 `'auto'` | 左右 / 上下位置 |
| `itemStyle` / `itemClassName` | `React.CSSProperties` / `string` | 菜单外层样式，可设置宽度 |
| `hasBorder` / `onlyShowDivider` | `boolean` | 触发器边框 / 分组只显示分割线 |
| `iconUrl` | `string \| React.ReactElement` | 触发器图标，默认使用 icon+ |
| `onDropDown` / `onClosePopup` | `(display: boolean) => void` / `() => void`（实现） | 前者仅打开时传 true；后者无参关闭通知 |
| `selectedIndex` | `string \| number` | 匹配 data 项 value，外部更新有效；`0` / 空字符串转 null，不能高亮对应项 |
| `displayItems` / `isScrollAlwaysDisplay` | `number` / `boolean`，默认 `8` / `false` | 最大显示项目数 / 始终显示滚动条 |
| `isAutoFirstFocus` | `boolean`，默认 `true` | 默认聚焦第一项 |
| `zindex` / `autoZindex` | `string`（默认 `'9999'`）/ `boolean` | 弹层层级 / 自动计算层级（有性能开销） |
| 常规 | — | `id` · `mountId` · `className`（string）、`style`（CSSProperties） |
| 图标样式 | — | `iconClassName` · `itemIconClassName`（string）、`iconStyle` · `itemIconStyle`（CSSProperties）；两组作用对象说明不清，按需实测 |
| 其余事件 | — | `onKeyDown(e: any)`、`onClick()`、`onBlur(e: React.MouseEvent<HTMLDivElement>)`（原声明）、`blurDelayShort`（boolean，失焦隐藏延迟） |
