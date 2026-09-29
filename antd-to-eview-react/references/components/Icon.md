# 图标（icon+ 与 IconButton）功能逻辑规格

> 资料来源：TypeDoc `Icon/Icon`、`IconButton/IconButton` + 官网 Icon / IconButton 页示例。
> ⚠️ 官网首推 **icon+ 图标库**：`import { IconPlusIcPublicSearch } from '@nce/icon-plus'`，按需引入，2000+ 图标，`type="filled"` 换风格、`iconColor={['red']}` 换色、`iconSize` 换尺寸（只能取 12/14/16/20/24/32/36/40/48/60）。
> ⚠️ **三种渲染方式**：**C. catalog 离线匹配 + icon+ 静态 import**（`import { IconPlusIcXxx } from '@nce/icon-plus'`，读 skill 自带 `../icons/icon-plus-names.json` 离线匹配 Lucide/antd 名，**优选默认、无网络依赖**）；**A. scaffold 自定义 `<Icon>` 组件**（`src/shared/icon.jsx`，运行时 fetch icon-plus，调用点零改动，内网兜底备选）；**B. icon+ 在线名发现**（`getIconInfo` 接口查名，外网不便时不用）。eview-react 内置 `Icon name="ict_*"` 已下线；scaffold 的同名自定义 `<Icon>` 是源项目契约保留件（A 范式），底层走 icon-plus 在线，**两者不同**。C/B 的真实 icon+ 组件名合成规则：`"IconPlusIc" + Domain + Name`（如 `Public` + `Search` → `IconPlusIcPublicSearch`，详见 §1.1）。

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
