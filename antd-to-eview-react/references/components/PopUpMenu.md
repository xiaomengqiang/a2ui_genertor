# PopUpMenu 组件功能逻辑规格（多级操作菜单）

> ⚠️ 正式名称 `PopUpMenu`；用 `options/submenus`、项 `disable` 和 `onClick(evt)`，不要套用 DropDown 的 `data/disabled/onItemClick`。
> 默认 **children 模式**沿用已核验的 `top`（向上）/ `bottom`（向下），可省略或使用 `auto`；传统坐标模式在本次核验源码中仅识别 `up`，不要混用两种模式的方向规则。
> **默认 children 模式显式配置 serialno 后，组件级回调读取 `evt.value`，即该 serialno。** 编号 `0` 有效。未配置时不能保证是 undefined，键盘路径可能得到字符串 `"undefined"`，也不能期望回退到业务 id。统一设置业务序列号并用组件级回调。
> 本文行为以 R26.0-NCE 3.10.36+6 源码核验为依据；未在对应发布包或 4.x 验证，见[版本边界](patterns/project-setup.md)。

## 1. 功能定位

PopUpMenu 从按钮等触发器弹出多级操作菜单，支持嵌套子菜单、禁用项与图标，默认用 children 包裹触发器。

| 想要的效果 | 用什么 | 区别 |
|------------|--------|------|
| 二级 / 三级操作菜单 | `PopUpMenu options` | 子菜单用 `submenus` |
| 一级更多操作 | [DropDown](DropDown.md) | 用 `data + onItemClick` |
| 常驻侧边多级导航 | [Accordion](Accordion.md) | 不是弹出操作菜单 |
| 表单或筛选选值 | [Select](Select.md) / [MultipleSelect](MultipleSelect.md) | 有选值契约 |

## 2. 典型场景

- “导出 → 格式 → CSV / JSON”等分层命令。
- 工具栏或表格行操作，父分组无权限时保留禁用，后代也不得执行。
- 菜单切换数据时，各层级选项使用稳定唯一 `id`；业务执行项另设稳定、整棵菜单树内唯一的 `serialno`，用于点击回调匹配。

## 3. 状态声明

```tsx
const [pending, setPending] = useState(false);
const inFlight = useRef(false);
const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
// options 从权限和 pending 派生；children 模式通常无需维护 isOpen / X / Y。
```

组件没有 `disabled` prop；请求期间禁用子 Button、派生各项 `disable`，处理器同时加锁。

## 4. 事件与交互逻辑

```tsx
interface MenuClickEvent {
  text?: string;
  value?: string | number;
}
const handleMenuClick = (evt: MenuClickEvent) => {
  const serialno = evt.value;
  if (serialno === undefined) return;
  // 按 serialno 匹配当前 options，检查叶子和整条祖先链后执行业务。
};
```

- `onClick` 只收一个菜单事件对象，不能当 DOM 事件，也不是 `(item, event)`；显式 serialno 的组件级回调用 `evt.value` 匹配业务序列号。
- 不假定回调只来自叶子：父项只展开，业务拦截父项、禁用项、禁用祖先与未知动作；按序列号查找当前 options，读取当前禁用状态。
- 未配置 serialno 时的回退值不是稳定业务标识，不能仅凭 `evt.value !== undefined` 就执行业务；必须匹配当前 options 中显式配置的 serialno，未命中直接拒绝，不回退到 id / clickItem。编号 `0` 有效，不能用 `if (!evt.value)` 判断缺失；匹配保留字符串 / 数字类型，不自行转换。
- 默认 `<PopUpMenu options={options}><Button text="更多" /></PopUpMenu>`，触发由组件处理，子 Button 不另绑业务执行。
- children 模式固定向上用 `top`、向下用 `bottom`，默认 `auto`；`width` 管宽度，`hDirection` 管左右。没有 DropDown 的 `trigger/position/popupDirection/itemStyle`，不要靠 Promise / `false` 返回值或虚构 ref 方法控制关闭。
- 传统坐标模式用 `isOpen`、大写 `X/Y`，坐标取含滚动量的 `pageX/pageY`；任一为 `0` 会被当作未传。传坐标时以 body 定位，`parentId` 只作菜单顶层容器 ID；不传坐标时才按 parentId 元素定位。该模式仅识别 `direction="up"`，`offset` 当前未使用，不依赖它调整位置。
- 坐标模式外部点击会内部关闭并触发 `onBlur`，选项点击只内部关闭：业务分别在 `onBlur` 和组件级 `onClick` 中把 `isOpen` 置 false，再更新坐标并置 true 重开。无需无说明延时，也不能把坐标属性当内建右键触发器。

## 5. 数据结构

```tsx
// 业务侧按已声明字段定义；组件入口只导出 PopUpMenuProps，不导出 OptionType。
interface MenuOption {
  id?: string; // 一旦设置必须唯一；建议每层都设置
  text?: string;
  serialno?: string | number; // 选项序列号，点击回调的 value；业务执行项显式设置
  cls?: string;
  iconUrl?: string | React.ReactElement;
  submenus?: MenuOption[];
  disable?: boolean; // 默认 false，不是 disabled
}
```

父项传非空 `submenus`；叶子可省略或传 `[]`，源码以数组长度是否大于 0 区分父项，二者均按叶子处理。

`id` 与 `serialno` 分别配置：仅有 id 不能得到可靠业务回调标识。按序列号派发时，为执行项设置整棵树内唯一的 serialno，避免匹配到其他分支。

源码支持 `isDivider` 与选项级 `onClick`，但二者不在已声明的选项字段中，默认不扩展数据结构。选项级回调存在时不会再执行组件级回调，二者均先关菜单再回调；选项级用真值判断，`serialno=0` 会错误回退到内部 `slno`，可能得到字符串 `"undefined"`，组件级则保留 0。

`slno` 不是自增编号：鼠标路径来自内部未公开的 option.value，键盘 Enter 路径从 DOM id 截取；内部 value 与 serialno 均未设置时键盘可得到字符串 `"undefined"`。这些内部字段仅解释差异，不作为业务配置 API，也不要用 option.value 替代 serialno。全部模式 × 回调位置 × 序列号取值的组合尚未完整验证。

无图标时省略 `iconUrl`，不传空或占位字符串；需要图标时默认从 `@nce/icon-plus` 按需引入，见 [Icon](Icon.md)。

## 6. 联动说明

- 权限变化 → 重建 `options` 的 `disable`；递归查找时累计祖先禁用态。
- 开始异步命令 → 立即上锁并禁用触发器和选项；成功反馈，失败反馈并在 `finally` 解锁，可重新选择叶子重试。
- 业务对象变化时快照对象、隔离过期结果，按 SKILL.md 通用异步规则处理；本例不引入对象切换。
- 危险命令用 [MessageDialog](MessageDialog.md) 确认，取消时不执行；单层命令优先用 DropDown。

## 7. 完整代码示例

通过 `execute` 注入业务请求，传入已匹配并校验的选项序列号；示例用 `11` / `12` 导出、`0` 刷新，父项不配置序列号。保留默认自动方向。

```tsx
import React, { useRef, useState } from 'react';
import PopUpMenu from '@nce/eview-react/PopUpMenu';
import Button from '@nce/eview-react/Button';

interface MenuOption {
  id?: string;
  text?: string;
  serialno?: string | number;
  disable?: boolean;
  submenus?: MenuOption[];
}
interface MenuClickEvent { text?: string; value?: string | number; }
type ActionSerial = 11 | 12 | 0;
interface Props { canExport: boolean; execute: (serialno: ActionSerial) => Promise<void>; }

function findOption(options: MenuOption[], serialno: string | number, ancestorDisabled = false):
  { option: MenuOption; blocked: boolean } | undefined {
  for (const option of options) {
    const blocked = ancestorDisabled || Boolean(option.disable);
    if (option.serialno === serialno) return { option, blocked };
    const found = findOption(option.submenus ?? [], serialno, blocked);
    if (found) return found;
  }
  return undefined;
}

export default function ExportMenu({ canExport, execute }: Props) {
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const options: MenuOption[] = [
    { id: 'export', text: '导出', disable: pending || !canExport, submenus: [
      { id: 'format', text: '格式', disable: pending, submenus: [
        { id: 'export-csv', serialno: 11, text: 'CSV', disable: pending },
        { id: 'export-json', serialno: 12, text: 'JSON', disable: pending },
      ] },
    ] },
    { id: 'refresh', text: '刷新', serialno: 0, disable: pending },
  ];

  const handleMenuClick = async (evt: MenuClickEvent) => {
    if (inFlight.current) return;
    const serialno = evt.value;
    const found = serialno === undefined ? undefined : findOption(options, serialno);
    if (!found) { setFeedback({ ok: false, text: '无法识别菜单项，请重试' }); return; }
    if (found.blocked || found.option.submenus?.length) return;
    if (serialno !== 11 && serialno !== 12 && serialno !== 0) return;
    inFlight.current = true;
    setPending(true);
    setFeedback(null);
    try {
      await execute(serialno);
      setFeedback({ ok: true, text: `${found.option.text}成功` });
    } catch (error: unknown) {
      const reason = error instanceof Error && error.message ? error.message : '请重试';
      setFeedback({ ok: false, text: `${found.option.text}失败：${reason}` });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return (
    <section className="app-export-menu">
      <PopUpMenu options={options} width="180px" onClick={handleMenuClick}>
        <Button text={pending ? '处理中…' : '更多操作'} disabled={pending} />
      </PopUpMenu>
      {feedback && <p role={feedback.ok ? 'status' : 'alert'}>{feedback.text}</p>}
    </section>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 的 menu/items/key/label、trigger、open/onOpenChange、placement
<PopUpMenu menu={{ items }} trigger={['click']} open={open} onOpenChange={setOpen} placement="bottomRight" />

// ❌ 本组件用 options/submenus/disable，没有 data/onItemClick 或组件级 disabled
<PopUpMenu data={items} onItemClick={handleItemClick} disabled={pending} />
<PopUpMenu options={[{ text: '导出', disabled: true, children: formats }]} />

// ❌ children 模式固定方向使用 top/bottom，不能照搬坐标模式的 up
<PopUpMenu options={options} direction="up"><Button text="更多" /></PopUpMenu>

// ❌ 用真假判断缺失，会误拦 serialno 为 0 的选项
<PopUpMenu options={options} onClick={(evt) => { if (!evt.value) return; execute(evt.value); }} />

// ❌ 只配 id 就假定回调可用于业务；缺 serialno 的值不稳定，也不会自动变为业务 id
<PopUpMenu options={[{ id: 'refresh', text: '刷新' }]} onClick={(evt) => {
  if (evt.value === 'refresh') refresh();
}} />

// ❌ 未核验 OptionType 从组件入口导出；应本地定义已声明的业务字段
import { OptionType } from '@nce/eview-react/PopUpMenu';
```

## 9. API 速查

未演示的 ref 方法不列，未声明的事件参数不推断。

| API | 类型 / 默认值 | 说明 |
|-----|---------------|------|
| `options` | `OptionType[]` | 多级数据，7 个已声明字段见 §5；各层设置唯一 id，业务执行项设置唯一 serialno |
| `children` | `any` | 推荐包裹 Button / IconButton 作为触发器 |
| `onClick` | `(evt: { text?: string; value?: any; clickItem?: OptionType }) => void` | 显式 serialno 的 children 组件级回调 value 为 serialno，0 有效；缺失时回退依路径而异，键盘可能为字符串 "undefined"，须匹配显式序列号 |
| `width` | `number \| string`，默认 `'120px'` | 菜单宽度 |
| `direction` | children：`'top' \| 'bottom' \| 'auto'`，默认 auto | 坐标模式源码仅识别 up，按模式区分 |
| `hDirection` | `'left' \| 'right' \| 'auto'`，默认 `'auto'` | 与触发元素哪侧对齐 |
| `isOpen` | `boolean`，默认 `false` | 传统坐标模式显隐，默认不与 children 模式混用 |
| `X` / `Y` / `parentId` | `number` / `number` / `string` | 页面坐标，0 被当作未传；parentId 的作用见 §4 |
| `offset` | `object` | 当前源码接收但未使用，不能依赖其效果 |
| `onBlur` | `(value?: any, event?: React.ReactElement) => void` | 原声明；失焦（如点外部）回调 |
| `onClickOutside` / `onKeyDown` | `any` / `(event: any) => void` | 点外部（参数未声明）/ 键盘事件 |
| `hasScroll` | `boolean`，默认 `false` | 滚动开关，详细行为未说明 |
| 常规 | — | `id` · `className`（string）、`style`（React.CSSProperties） |
