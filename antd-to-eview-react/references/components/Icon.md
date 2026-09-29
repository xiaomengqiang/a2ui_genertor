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

### 迁移工作流要点

> 触发与 `--apply` 机制详见 [migration-workflow.md](../migration-workflow.md) §0.1（`antdIcons` 陷阱）+ §3.0（B/C 步骤）；本节为速查。

- **触发条件**：`src/` 下有 `<Icon name` 调用点（`grep -rl "<Icon\b" src/` 非空）或 `@ant-design/icons` 用法即走图标步骤，**与 `.umd-conversion.json` 的 `antdIcons` 是否为空无关**——ict-react-coder 产物用自定义 `<Icon name>` shim、`antdIcons` 恒 `[]` 但有大量站点，**`antdIcons: []` 禁止跳过 `match-icons.cjs`**。
- **源码 `<Icon name>` shim ≠ 产物方案A**：`<Icon name="字面量">` 站点必须转 C/B 静态 import，仅真动态名（`name={row.iconField}` 类运行时数据）落产物方案A。
- **方案C `--apply`**：仅落 confirmed（SEMANTIC/L1-L4），residual 不自动 apply；报告写 OS 临时目录、不进产物根、`--apply` 结束清理。**禁止因 residual 整体放弃方案C**——residual 由 LLM 在会话内按控制台/临时报告逐条复核。
- **已落方案A的产物可原地补救**：调用点仍为 `<Icon name="字面量" .../>` 时，直接 `node scripts/match-icons.cjs <工程根> --apply`（脚本幂等，已含 `IconPlusIc` 的站点自动跳过）。

### 动态名：数组循环 `name={t.icon}`

> 动态名（数组字段 `name={t.icon}` / 变量 / 链式三元）**不在 match-icons.cjs 自动解析范围**，交 LLM 在 residual 阶段按本段 recipe 解析。关键判定：`t.icon` 是循环变量取数组字段——若数组是**同文件静态字面量**（封闭集合），可静态解析、**不许默认退方案A**；若数组来自接口/props（真运行时），才退方案A。

**recipe（首选：icon+ 组件直接塞进 data 数组）**：

```tsx
// 前：t.icon 是循环变量取数组字段
const data = [
  { key: 'device', icon: 'server' },
  { key: 'user',   icon: 'user' },
];
{data.map((t) => <Icon name={t.icon} size={16} />)}

// 后：icon+ 组件塞进 data（封闭字面量集合 → 静态可解析，非方案A）
import { IconPlusIcPublicServer, IconPlusIcPublicUser } from '@nce/icon-plus';
const data = [
  { key: 'device', icon: IconPlusIcPublicServer },
  { key: 'user',   icon: IconPlusIcPublicUser },
];
{data.map((t) => <t.icon iconSize={16} />)}   // 成员表达式 JSX 恒当组件，不分大小写
```

判定三条：

- `t` 来自**同文件静态数组字面量**（封闭字面量集合）→ 可解析，按上面 recipe 塞进 data。先把数组里每个 `icon` 字面量匹配成 icon+ 名（用脚本 residual 候选/catalog/方案B 在线），再整体替换。
- `data` 来自**接口/props**（运行时，值迁移时不可预知）→ **方案A shim**，`<Icon name={t.icon} />` 保留、只改 import 路径。
- 数组字面量里**部分名未命中** → 该条先按候选/catalog 补齐再塞；补不齐的可退 name→组件 map + fallback（`const Ic = ICON_MAP[t.icon]; return Ic ? <Ic iconSize={16} /> : <Icon name={t.icon} />;`，`<Icon>` 即方案A shim 兜底未知 key）。

> `size`/`color`/`variant` 同字面量场景一样按 [§3.0](../migration-workflow.md) 透传（`iconSize` 支持 rem/px/数字，B/C 不转换；塞进 data 后 `<t.icon iconSize={...} />` 用法不变）。

## 1. 功能定位

icon+（`@nce/icon-plus`）是组件库首推的图标方案，按需引入、2000+ 图标，可换风格 / 颜色 / 尺寸；IconButton 是"纯图标按钮 + 气泡提示"，用于表格操作列、卡片角落等小面积区域。内置 `Icon` 组件已被 icon+ 替代、不再推荐。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 装饰性图标 / 状态图标 | icon+ 组件 | antd `@ant-design/icons` 或内置 `Icon name` |
| 可点击的图标操作（编辑 / 删除 / 刷新） | `IconButton iconName={<IconPlus* />} tipText onClick` | 给图标组件挂 onClick / antd 纯图标 Button 退化 |
| 文字 + 图标按钮 | `Button leftIcon={<IconPlusXxx />}`（[Button.md](Button.md)） | IconButton 加文字 |

### 渲染方式（三种，迁移期默认 C）

| 方式 | 是什么 | 何时用 |
|------|--------|--------|
| **C. catalog 离线匹配 + icon+ 静态 import**（优选默认） | 读 skill 自带 `../icons/icon-plus-names.json` 离线匹配源名 → `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import（scaffold 已预置依赖）；`type="filled"` 换风格、`iconColor` 换色、`iconSize` 换尺寸 | **迁移期默认**；无网络依赖、彻底离线；名查不到用占位 `IconPlusIcPublicTransverseRectangleTemplate` 保证编译通过 |
| **A. 自定义 `<Icon>` 组件**（scaffold 备选） | scaffold `src/shared/icon.jsx`，保留源项目 `<Icon name="search" size={14} />` 契约；运行时 fetch icon-plus（getConfig 探测 → getIconInfo 查名 → getIcon 取 SVG 注入）；probe 失败渲染 `null`。props：`name`/`src`/`size`/`color`/`variant`/`className`/`style` | 内网运行时 fetch 兜底备选；调用点零改动，只改 import 路径。切到 C 后保留 `src/shared/icon.jsx`（A 兜底，不删） |
| **B. icon+ 在线名发现**（备选） | `getIconInfo?keyword=&topK=2&source_id=6` 接口发现名 → 静态 import | 外网/接口不便时**不用**，改用 C；仅 catalog 未命中且能联通内网接口时兜底 |

### 1.1 方案 C：catalog 离线匹配 + 静态 import（默认）

> 迁移期默认走此方案，无网络依赖、彻底离线。

**匹配流程**：

1. 读 skill 自带 `references/icons/icon-plus-names.json`——按领域（`Public`/`Ict`/`Device`/...）划分的 icon+ 名目录；`Public` 与 `Ict` 为通用主力域，优先在这两个域里找
2. 取源项目的图标名（Lucide 名如 `search`/`trash`/`edit`，或 antd 图标名如 `EditOutlined`）→ 在 catalog 里逐域查找
3. 命中 → 组件名合成规则：`"IconPlusIc" + Domain + Name`
   - `Public` + `Search` → `IconPlusIcPublicSearch`
   - `Ict` + `Device` → `IconPlusIcIctDevice`
4. 静态 import：`import { IconPlusIcPublicSearch } from '@nce/icon-plus'`
5. 替换调用点：`<Icon name="search" size={14} color="red" />` → `<IconPlusIcPublicSearch iconSize={14} iconColor={['red']} />`
   - `size`→`iconSize`（支持 rem、px、数字；只能取 12/14/16/20/24/32/36/40/48/60）
   - 无 `color` 时传 `iconColor={['currentcolor']}`（继承业务容器文字颜色）
   - `type="filled"` 换图标风格
6. 未匹配名 → 用占位组件 `IconPlusIcPublicTransverseRectangleTemplate` 保证编译通过，加 `// TODO(icon)` 待人工补

**示例**：

```tsx
// 源项目（ict-react-coder 产物）
<Icon name="search" size={14} />

// 迁移后（方案 C）
import { IconPlusIcPublicSearch } from '@nce/icon-plus';
<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} />
```

### 1.2 方案 A：scaffold `<Icon>` shim（备选，内网 fetch 兜底）

> 内网运行时 fetch 兜底备选；调用点零改动，只改 import 路径。切到方案 C 后保留 `src/shared/icon.jsx` 不删（A 兜底）。

scaffold 预置 `src/shared/icon.jsx`，保留源项目 `<Icon name="search" size={14} />` 契约——底层运行时 fetch icon-plus（getConfig 探测 → getIconInfo 查名 → getIcon 取 SVG 注入），probe 失败渲染 `null`。

**import 路径改法**：

| 源项目原路径 | 迁移后路径 | 调用点位置 |
|-------------|-----------|-----------|
| `./assets/shared/icon.jsx` | `./shared/icon.jsx` | `src/` 下文件 |
| `../../../assets/shared/icon.jsx` | `../shared/icon.jsx` | `src/views/` 下文件 |

> 跑 `scripts/check-relative-imports.cjs`（见 [migration-workflow.md §4.1](../migration-workflow.md)）扫残留 `./assets/shared/...` 旧路径。

## 2. 事件与交互逻辑

### icon+ 图标（首选）

```tsx
import { IconPlusIcPublicSearch, IconPlusIcPublicTrash, IconPlusIcPublicEdit } from '@nce/icon-plus';
<IconPlusIcPublicSearch />
<IconPlusIcPublicTrash type="filled" iconColor={['currentcolor']} iconSize="1.25rem" />   // 继承业务容器文字颜色
```

### IconButton：图标操作 + 气泡

```tsx
<IconButton iconName={<IconPlusIcPublicEdit />} tipText="编辑" tipData={{ direction: 'top' }} onClick={() => openEdit(row)} />
<IconButton iconName={<IconPlusIcPublicTrash />} tipText="删除" disabled={deleting.has(row.id)} onClick={() => askDelete(row)} />
<IconButton iconName={<IconPlusIcPublicTips />} tipContent={<div style={{ maxWidth: '16rem' }}>该操作会同步到所有节点</div>} tipData={{ direction: 'right', arrowDirection: 'none' }} enableClickHideTip />
```

## 3. 联动说明

- 操作列 IconButton → 编辑打开 Dialog / Drawer，删除打开 MessageDialog（[MessageDialog.md](MessageDialog.md)）；处理中 `disabled`
- 权限 → 条件渲染该 IconButton（隐藏时相邻 `Divider type="vertical"` 一起隐藏）

## 4. 反面示例

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

## 5. API 速查

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
