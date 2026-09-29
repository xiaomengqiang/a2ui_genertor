# 图标（icon+ 与 IconButton）功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Icon/Icon`、`IconButton/IconButton`；官网组件页 Icon 及示例 `IconBasic.jsx` / `IconPlusBasic.jsx` / `IconPlusType.jsx` / `IconPlusSize.jsx`、IconButton 及示例 `Basic.tsx` / `IconPlus.tsx` / `BubbleDirection.tsx` / `Disabled.tsx` / `Event.tsx`
>
> ⚠️ 官网首推 **icon+ 图标库**：`import { IconPlusIcPublicSearch } from '@nce/icon-plus'`，按需引入，2000+ 图标，`type="filled"` 换风格、`iconColor={['red']}` 换色、`iconSize` 换尺寸（数字取 12/14/16/20/24/32/36/40/48/60，或 rem/px 字符串如 `"1.25rem"`）。
> ⚠️ **三种渲染方式**（详见下方「渲染方式」段，按**迁移环境**二选一，A 兜底）：**B. icon+ 在线名匹配 + 静态 import**（`import { IconPlusIcXxx } from '@nce/icon-plus'`，**内网环境**——`https://octo.hdesign.huawei.com/` 可达——通过 `getIconInfo` 接口在线匹配图标名）；**C. catalog 离线匹配 + icon+ 静态 import**（读 skill 自带 `../icons/icon-plus-names.json` 离线匹配，**外网环境**——octo 接口不可达——无网络依赖）；**A. scaffold 自定义 `<Icon>` 组件**（`src/shared/icon.jsx`，运行时 fetch icon-plus，调用点零改动，**B 与 C 的兜底**——当 LLM(B) 或本地算法(C) 实在识别不出 icon+ 名时用）。**B 与 C 仅图标名匹配方式不同，命中后均 `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import**；项目级二选一：迁移开始先探测 `https://octo.hdesign.huawei.com/`，可达（内网）→ B，不可达（外网）→ C。eview-react 内置 `Icon name="ict_*"` 已下线；scaffold 的同名自定义 `<Icon>` 是源项目契约保留件（A 范式），底层走 icon-plus 在线，**两者不同**。B/C 的真实 icon+ 组件名合成规则：`"IconPlusIc" + Domain + Name`（如 `Public` + `Search` → `IconPlusIcPublicSearch`，算法见 [match-icons.cjs](../../scripts/match-icons.cjs) 顶部注释 + `matchOne` 函数）。

## 渲染方式（三种）

| 方式 | 是什么 | 迁移成本 | 何时用 |
|------|--------|---------|--------|
| **B. icon+ 在线名匹配 + 静态 import**（内网） | `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import，名靠在线 `getIconInfo?keyword=&topK=2&source_id=6` 接口匹配；与 C 共用静态 import 范式，仅名匹配方式不同 | **中**：逐个查名替换调用点（在线 getIconInfo 名匹配 → PascalCase） | **内网环境**（`https://octo.hdesign.huawei.com/` 可达）；名查不到/接口不可用时用占位 `IconPlusIcPublicTransverseRectangleTemplate` 保证编译通过 |
| **C. catalog 离线匹配 + icon+ 静态 import**（外网） | 读 skill 自带 `../icons/icon-plus-names.json`（顶层 key 是按图标名前置词分的桶，**非语义领域**）离线匹配源 Lucide/antd 名 → `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import（scaffold 已预置依赖）；`type="filled"` 换风格、`iconColor` 换色、`iconSize` 换尺寸（支持rem、px、数字） | **低-中**：跑 `node scripts/match-icons.cjs <目标工程根>`——**confirmed**（SEMANTIC/L1-L4 命中，含多桶同名按最短完整名 tie-break）`--apply` 自动改写；**residual**（前缀/fuzzy/未命中/链式三元/未追源变量）生成 top-K 候选交 LLM 选，不自动 apply；UNMATCHED 不落占位而是带候选；LLM 只看短名单、不必扫整本 66KB；iconSize 原样透传（icon+ 支持 rem/px/数字；仅方案A shim 转数字） | **外网环境**（octo 接口不可达）；无网络依赖、彻底离线；算法见 [match-icons.cjs](../../scripts/match-icons.cjs)。residual 候选都不对时 LLM 再查 catalog |
| **A. 自定义 `<Icon>` 组件**（B/C 兜底） | scaffold `src/shared/icon.jsx`，保留源项目 `<Icon name="search" size={14} />` 契约；运行时 fetch icon-plus（getConfig 探测 → getIconInfo 查名 → getIcon 取 SVG 注入）；dev 下 vite `icon-api-base-transform` 插件 + `/assetRepository` 反代解决跨域；probe 失败渲染 `null`。props：`name`/`src`/`size`（rem/px/数字，shim 内部转 px 数字供 getIcon API）/`color`/`variant`(`lined`/`filled`/`two-tone`/`circle`/`square`)/`className`/`style` | **最低**：调用点零改动，只改 import 路径 `./assets/shared/icon.jsx` → `./shared/icon.jsx` | **B 与 C 的兜底**：当 LLM（B）或本地算法（C）实在识别不出 icon+ 名的调用点，零改动保留 shim；转换后代码运行于内网，运行时 fetch 恒可达 |

> 本文 §1 起的 icon+ / IconButton 用法是 **B/C 范式**（静态 import 目标态）。**迁移期先探测 `https://octo.hdesign.huawei.com/` 定项目级方案**：可达（内网）→ B（getIconInfo 在线名匹配 → 静态 import）；不可达（外网）→ C（catalog 离线匹配 → 静态 import）。A 为 B/C 兜底，切定后保留 `src/shared/icon.jsx`（不删）。
>
> **方案 A/B/C 的选择只由图标名决定**：`size`/`color`/`variant` 是独立 props（B/C 原样透传 icon+，A 由 shim 内部处理），**不影响方案选择**——尺寸/颜色异常不因此退方案A，名匹配命中即落对应方案。

## 1. 功能定位

icon+（`@nce/icon-plus`）是组件库首推的图标方案，按需引入、2000+ 图标，可换风格 / 颜色 / 尺寸；IconButton 是"纯图标按钮 + 气泡提示"，用于表格操作列、卡片角落等小面积区域。内置 `Icon` 组件已被 icon+ 替代、不再推荐。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 装饰性图标 / 状态图标 | icon+ 组件 | antd `@ant-design/icons` 或内置 `Icon name` |
| 可点击的图标操作（编辑 / 删除 / 刷新） | `IconButton iconName={<IconPlus* />} tipText onClick` | 给图标组件挂 onClick / antd 纯图标 Button 退化 |
| 文字 + 图标按钮 | `Button leftIcon={<IconPlusXxx />}`（[Button.md](Button.md)） | IconButton 加文字 |
| 一组图标操作 | `IconButtonGroup`（未覆盖） | 多个 IconButton 手排 |

## 2. 典型场景

- 表格操作列：编辑 / 删除两个 `IconButton`，悬浮显示 `tipText`
- 状态列图标：icon+ 的成功 / 告警图标 + 文字
- 卡片右上角"更多"图标按钮
- 标题旁的帮助图标：`IconButton iconName={<IconPlusIcPublicTips />} tipContent={<div>说明</div>}`

## 3. 状态声明

```tsx
// 图标本身无状态；IconButton 的 disabled / loading 由业务 state 派生
const [deleting, setDeleting] = useState<Set<string>>(new Set());
```

## 4. 事件与交互逻辑

### icon+ 图标（首选）

```tsx
import { IconPlusIcPublicSearch, IconPlusIcPublicTrash, IconPlusIcPublicEdit } from '@nce/icon-plus';
<IconPlusIcPublicSearch />
<IconPlusIcPublicEdit />
<IconPlusIcPublicTrash type="filled" iconColor={['currentcolor']} iconSize="1.25rem" />   // 示例继承业务容器的文字颜色
```

### IconButton：图标操作 + 气泡

```tsx
<IconButton iconName={<IconPlusIcPublicEdit />} tipText="编辑" tipData={{ direction: 'top' }} onClick={() => openEdit(row)} />
<IconButton iconName={<IconPlusIcPublicTrash />} tipText="删除" disabled={deleting.has(row.id)} onClick={() => askDelete(row)} />
<IconButton iconName={<IconPlusIcPublicTips />} tipContent={<div style={{ maxWidth: '16rem' }}>该操作会同步到所有节点</div>} tipData={{ direction: 'right', arrowDirection: 'none' }} enableClickHideTip />
```

## 5. 数据结构

```tsx
// 操作列配置：集中定义图标、提示、权限
interface RowAction<T> {
  key: string;
  iconName: string | React.ReactElement;
  tip: string;
  visible?: (row: T) => boolean;
  onClick: (row: T) => void;
}
```

## 6. 联动说明

- 操作列 IconButton → 编辑打开 Dialog / Drawer，删除打开 MessageDialog；处理中 `disabled`
- 权限 → `visible(row)` 决定是否渲染该 IconButton（隐藏时相邻 `Divider type="vertical"` 一起隐藏）
- 业务状态决定用哪个 icon+ 组件；自定义颜色 / 风格通过 icon+ 的 `iconColor` / `type` 传入

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import IconButton from '@nce/eview-react/IconButton';
import Divider from '@nce/eview-react/Divider';
import { IconPlusIcPublicCheck, IconPlusIcPublicAbout, IconPlusIcPublicEdit, IconPlusIcPublicRefresh, IconPlusIcPublicTrash } from '@nce/icon-plus';

interface Device { id: string; name: string; state: 'ok' | 'alarm'; canDelete: boolean; }

// 设备列表操作列：状态图标 + 编辑 / 刷新 / 删除图标按钮（权限控制显隐，处理中禁用）
export default function DeviceRows() {
  const [rows, setRows] = useState<Device[]>([
    { id: 'd1', name: 'core-sw-01', state: 'ok', canDelete: true },
    { id: 'd2', name: 'core-sw-02', state: 'alarm', canDelete: false },
  ]);
  const [busy, setBusy] = useState<Set<string>>(new Set());

  const run = async (id: string, action: () => Promise<void>) => {
    if (busy.has(id)) return;
    setBusy((s) => new Set(s).add(id));
    try { await action(); } finally { setBusy((s) => { const n = new Set(s); n.delete(id); return n; }); }
  };

  return (
    <div style={{ width: 520, padding: 24 }}>
      {rows.map((row) => (
        <div key={row.id} className="app-device-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <span className={`app-device-state app-device-state-${row.state}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {row.state === 'ok' ? <IconPlusIcPublicCheck /> : <IconPlusIcPublicAbout />}
            {row.name}
          </span>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton iconName={<IconPlusIcPublicEdit />} tipText="编辑" disabled={busy.has(row.id)} onClick={() => alert(`编辑 ${row.name}`)} />
            <Divider type="vertical" />
            <IconButton iconName={<IconPlusIcPublicRefresh />} tipText="刷新状态" disabled={busy.has(row.id)} onClick={() => run(row.id, async () => { await new Promise((r) => setTimeout(r, 400)); setRows((prev) => prev.map((d) => (d.id === row.id ? { ...d, state: 'ok' } : d))); })} />
            {row.canDelete ? (
              <>
                <Divider type="vertical" />
                <IconButton iconName={<IconPlusIcPublicTrash />} tipText="删除" tipData={{ direction: 'top' }} disabled={busy.has(row.id)} onClick={() => run(row.id, async () => { await new Promise((r) => setTimeout(r, 300)); setRows((prev) => prev.filter((d) => d.id !== row.id)); })} />
              </>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 图标库
import { EditOutlined } from '@ant-design/icons';

// ❌ 用内置 Icon name="ict_*"（已下线），改用 icon+ 组件
<Icon name="ict_trash" />

// ❌ 给图标组件挂 onClick 当按钮用，没有气泡提示、没有禁用态、键盘不可达 → 用 IconButton
//   也包括 antd <Button type="text" shape="circle" icon={...}>（无 children）→ 同样用 IconButton，不要退化为原生 button+Icon
<IconPlusIcPublicTrash onClick={remove} />

// ❌ icon+ 尺寸随意写（只能 12/14/16/20/24/32/36/40/48/60）
<IconPlusIcPublicTrash iconSize={18} />

// ❌ IconButton 的提示同时传 tipText 和 tipContent（二选一）
<IconButton tipText="删除" tipContent={<div>删除</div>} />
```

## 9. API 速查

> 压缩自 `IconButton/IconButton`；icon+ 用法来自 Icon 页 README 与 demo。内置 `Icon/Icon` 组件已被 icon+ 替代、不再推荐，其 API 不再列入。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `IconButton.iconName` | `string \| ReactElement` | icon+ 组件（推荐，如 `<IconPlusIcPublicTrash />`）；也收 `ict_*` 名但不再推荐 |
| `IconButton.iconUrl` / `hoverIconUrl` / `disabledIconUrl` | `string` | 图片三态，仅自定义图片；默认用 `iconName={<IconPlusIc* />}` |
| `IconButton.iconProps` | `{ color, hoverColor, disabledColor }` | 配 `iconName` 用 |
| `IconButton.tipText` / `tipContent` | `string` / `any` | 气泡文本 / 自定义内容（二选一） |
| `IconButton.tipData` | `{ direction: 'top' \| 'bottom' \| 'left' \| 'right', arrowDirection?: 'none', disposeTimeOut? }` | 气泡方向 / 无箭头 |
| `IconButton.enableClickHideTip` | `boolean`，默认 `false` | 点击后隐藏气泡 |
| `IconButton.disabled` / `size` | `boolean` / `any` | 禁用 / 尺寸（数字、rem、px） |
| `IconButton.onClick` / `onKeyDown` / `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` | `(event) => void` | 事件 |
| icon+ 组件 `type` / `iconColor` / `iconSize` | `'filled' …` / `string[]` / `12/14/16/20/24/32/36/40/48/60` | 风格 / 颜色数组 / 尺寸 |
