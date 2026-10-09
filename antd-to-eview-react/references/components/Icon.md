# 图标（icon+）功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Icon/Icon`；官网组件页 Icon 及示例 `IconBasic.jsx` / `IconPlusBasic.jsx` / `IconPlusType.jsx` / `IconPlusSize.jsx`。`IconButton` 已弃用，可点击图标直接用 icon+ 挂 `onClick`+`title`（见 §3）。
>
> 官网首推 **icon+ 图标库**：`import { IconPlusIcPublicSearch } from '@nce/icon-plus'`，按需引入、2000+ 图标；`type="filled"` 换风格、`iconColor` 换色、`iconSize` 换尺寸（B/C 静态 import 支持任意数字 / rem / px 字符串如 `"1.25rem"`，原样透传；**方案A shim 的 `getIcon` API 另需吸附到离散集 12/14/16/20/24/32/36/40/48/60**，见下表 A 行）。组件名合成 = `"IconPlusIc" + Domain + Name`（`Public`+`Search` → `IconPlusIcPublicSearch`，算法见 [match-icons.cjs](../../scripts/match-icons.cjs) `matchOne`）。eview-react 内置 `Icon name="ict_*"` 已下线；scaffold 同名自定义 `<Icon>` 是源项目契约保留件（方案A 范式），底层走 icon-plus 在线，**两者不同**。

## 渲染方式（三种）

> 项目级二选一：迁移开始先探测 `https://octo.hdesign.huawei.com/`，可达（内网）→ B，不可达（外网）→ C；A 为 B/C 兜底，切定后保留 `src/shared/Icon`（不删）。本文 §1 起的 icon+ 用法是 B/C 范式（静态 import 目标态）。触发条件、`--apply` 机制、`antdIcons:[]` 陷阱见下方「迁移工作流要点」+ [migration-workflow.md](../migration-workflow.md) §0.1/§3.0。

| 方式 | 是什么 | 迁移成本 | 何时用 |
|------|--------|---------|--------|
| **B. 在线名匹配 + 静态 import**（内网） | `import { IconPlusIcXxx } from '@nce/icon-plus'`，名靠在线 `getIconInfo?keyword=&topK=2&source_id=6` 接口匹配；与 C 共用静态 import 范式，仅名匹配方式不同 | **中**：逐个查名替换调用点 | `https://octo.hdesign.huawei.com/` 可达（内网）；名查不到 → 方案A shim 兜底 |
| **C. catalog 离线匹配 + 静态 import**（外网，默认） | 读 skill 自带 `../icons/icon-plus-names.json`（顶层 key 是按图标名前置词分的桶，**非语义领域**）离线匹配 → `import { IconPlusIcXxx } from '@nce/icon-plus'` 静态 import（scaffold 已预置依赖）；混合策略：**confirmed**（SEMANTIC/L1-L4，含多桶同名按最短完整名 tie-break）`--apply` 自动改写，**residual**（前缀/fuzzy/未命中/链式三元/未追源变量）带 top-K 候选交 LLM 选、不自动 apply，UNMATCHED **不落占位而是带候选**；iconSize 原样透传（支持 rem/px/数字） | **低-中**：`node scripts/match-icons.cjs <工程根> [--apply]` | octo 接口不可达（外网）；无网络依赖、彻底离线；算法见 [match-icons.cjs](../../scripts/match-icons.cjs) |
| **A. 自定义 `<Icon>` 组件**（B/C 兜底） | scaffold `src/shared/Icon`，保留源项目 `<Icon name="search" size={14} />` 契约；运行时 fetch icon-plus（getConfig → getIconInfo → getIcon 取 SVG 注入），probe 失败渲染 `null`。props：`name`/`src`/`size`（rem/px/数字，shim 内 `toApiSize` 吸附到 **12/14/16/20/24/32/36/40/48/60** 供 getIcon API）/`color`/`variant`/`className`/`style` | **最低**：调用点零改动，只改 import 路径 | B/C 实在识别不出 icon+ 名的调用点；转换后代码运行于内网，运行时 fetch 恒可达 |

> **方案 A/B/C 的选择只由图标名决定**：`size`/`color`/`variant` 是独立 props（B/C 原样透传 icon+，A 由 shim 内部处理），不影响方案选择——尺寸/颜色异常不因此退方案A，名匹配命中即落对应方案。

**替换示例**：

```tsx
// 源项目（ict-react-coder 产物）→ 迁移后（B/C 静态 import）
<Icon name="search" size={14} />
import { IconPlusIcPublicSearch } from '@nce/icon-plus';
<IconPlusIcPublicSearch iconSize={14} iconColor={['currentcolor']} />   // 无 color 时传 currentcolor 继承容器文字色；type="filled" 换风格
```

### 迁移工作流要点

> 触发与 `--apply` 机制详见 [migration-workflow.md](../migration-workflow.md) §0.1（`antdIcons` 陷阱）+ §3.0（B/C 步骤）；本节为速查。

- **触发条件**：`src/` 下有 `<Icon name` 调用点（`grep -rl "<Icon\b" src/` 非空）或 `@ant-design/icons` 用法即走图标步骤，**与 `.umd-conversion.json` 的 `antdIcons` 是否为空无关**——ict-react-coder 产物用自定义 `<Icon name>` shim、`antdIcons` 恒 `[]` 但有大量站点，**`antdIcons: []` 禁止跳过 `match-icons.cjs`**。
- **源码 `<Icon name>` shim ≠ 产物方案A**：`<Icon name="字面量">` 站点必须转 C/B 静态 import；**成员表达式 `name={t.icon}` / `name={MENU[0].icon}` 也由 `--apply` 自动转 B/C**（绑到静态数组即塞 icon+ 元素进 data + render 改 `{t.icon}`）；**自定义 wrapper 组件（SoftTag/ToggleRow：接收 `icon` prop、内部 `<Icon name={icon}/>` 渲染）也由 `--apply` Phase C 自动转 B/C**（调用点 `icon="字面量"`/`icon={常量}`/`icon={扁平三元}` → `icon={<IconPlusIc…/>}`，内部 → `{icon}`；`icon={成员}` 透传 + 数据数组元素化），仅真运行时数据（`name={row.iconField}` 类、wrapper 调用方 `icon={expr}` 不可静态解析触发安全闸）落产物方案A。
- **方案C `--apply`**：落 confirmed（SEMANTIC/L1-L4）+ 扁平三元两分支均 confirmed + **数据数组图标整组改写**（命中用真实组件，未命中用占位 `IconPlusIcPublicTransverseRectangleTemplate`）；residual 不自动 apply。报告写 OS 临时目录、不进产物根、`--apply` 结束清理。**禁止因 residual 整体放弃方案C**——residual 由 LLM 在会话内按控制台/临时报告逐条复核。
- **`.js→.jsx` 自动转换**：`--apply` 把因改写引入 JSX（替换串含 `<IconPlusIc`）的 `.js`→`.jsx` / `.ts`→`.tsx`，并扫 `src/` 修引用方显式 `.js`/`.ts` 扩展名 import（无扩展名 import 不动）；非 `src/` 引用（vite.config、index.html）不处理，需人工核对。
- **已落方案A的产物可原地补救**：调用点仍为 `<Icon name="字面量" .../>` 或 `name={t.icon}` 时，直接 `node scripts/match-icons.cjs <工程根> --apply`（脚本幂等，已含 `IconPlusIc` 的站点自动跳过）。

### 硬规则

- eview-react 内置 `Icon name="ict_*"` 已下线，**不要用**；也不要用 `@ant-design/icons`——一律用 `@nce/icon-plus` 的 `IconPlusIc*` 静态 import。
- **方案 A（`src/shared/Icon` shim）仅用于真运行时数据**：`name` 的值在迁移时不可预知（来自接口/props 字段、或成员表达式绑不到任何已扫文件中的静态数组常量）。字面量、同文件常量、三元、**成员表达式 `name={t.icon}` / `name={MENU[0].icon}`（绑到静态数组）一律走 B/C 静态 import**（`match-icons.cjs --apply` 自动改写），不许默认退方案 A。**自定义 wrapper 组件**（`icon` prop + 内部 `<Icon name={icon}/>`）同理自动转 B/C，仅当调用方 `icon={expr}` 不可静态解析（安全闸）才整组退方案 A。
- 可点击图标（编辑/删除/刷新等）直接给 icon+ 挂 `onClick` + 原生 `title` 属性（hover 提示），**`IconButton` 已弃用**：`<IconPlusIcPublicTrash onClick={remove} title="删除" />`；禁用态见 §3）。
- **antd 纯图标按钮（`Button type="text" shape="circle" icon={...}` 无 children）→ 剥 Button 外壳，`onClick`/`title` 直接搬到内层 `<IconPlusIc* />`**（见 [component-mapping.md](../component-mapping.md) 图标行；脚本 `--apply` 已先把内层 `<Icon>`→`<IconPlusIc>` 并吸附 `iconSize`，LLM 只需剥外壳 + 搬 onClick/title）。
- **带图标的 Button 文字必须用 `text=`，不能写 children**（children 会让图标不渲染，见 [Button.md](Button.md) §4）。

### 动态名：数组循环 `name={t.icon}` / 直接索引 `name={MENU[0].icon}`

> 成员表达式动态名**现已由 `match-icons.cjs --apply` 自动解析**（方案 C/B，不退方案 A）。脚本 Phase B 把 `name={IDENT.field}`（循环变量 `t.icon`）或 `name={IDENT[i].field}`（直接索引 `MENU[0].icon`）绑定到同文件/跨文件静态数组字面量，自动改写整组；仅绑不到静态数组源（接口/props 等真运行时数据）才退方案 A 保留 `<Icon>` shim。

**自动改写形态（`--apply` 落地）**：

```tsx
// 前：t.icon 是循环变量取数组字段
const data = [
  { key: 'device', icon: 'server' },
  { key: 'user',   icon: 'user' },
  { key: 'x',      icon: 'qzwxnonexist' },   // catalog 未命中
];
{data.map((t) => <Icon name={t.icon} size={16} />)}
<Icon name={data[0].icon} size={16} />        // 直接索引同样处理

// 后：icon+ 元素塞进 data（命中用真实组件，未命中用占位 IconPlusIcPublicTransverseRectangleTemplate）；render 改 {t.icon}
import { IconPlusIcPublicServer, IconPlusIcPublicUser, IconPlusIcPublicTransverseRectangleTemplate } from '@nce/icon-plus';
const data = [
  { key: 'device', icon: <IconPlusIcPublicServer iconSize={16} iconColor={['currentcolor']} /> },
  { key: 'user',   icon: <IconPlusIcPublicUser iconSize={16} iconColor={['currentcolor']} /> },
  { key: 'x',      icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} /> },   // 占位，residual 段带候选供后续替换
];
{data.map((t) => t.icon)}                      // 箭头隐式返回 → 裸表达式
{data[0].icon}                                 // 独立 JSX 子节点 → {data[0].icon}
```

落地规则：

- **整组全改写**：数组内每个 `icon: "lit"` 字段都改写——命中的用真实 icon+ 组件，**未命中的用 icon+ 默认占位图标 `IconPlusIcPublicTransverseRectangleTemplate` 顶替**（保证 render `{t.icon}` 永远拿到 React 元素，不出现"一半字符串一半元素"的中间态）。未命中项同时进 residual 报告带 top-K 候选，供 LLM 后续把占位换成贴切图标。
- **render 站点按上下文替换**：`<Icon name={EXPR}/>` → `EXPR`（箭头隐式返回体 / prop 表达式容器 `leftIcon={<Icon/>}` / 括号位）或 `{EXPR}`（独立 JSX 子节点 `<div><Icon/></div>`）。EXPR 即原表达式（`t.icon` / `MENU[0].icon`）。
- **`size`/`color`/`variant`**：取自 render 站点，透传进 data 元素的 `iconSize`/`iconColor`/`type`（`iconSize` 支持 rem/px/数字，B/C 不转换）。
- **绑不到静态数组源**（`IDENT` 非循环变量、也非任何已扫文件中的 `const ARR = [...]`；或数组含非字符串字面量字段，集合不封闭；或跨文件同名多名歧义）→ **真运行时数据，退方案 A**：`<Icon name={IDENT.field}/>` 保留，仅修 `shared/Icon` shim 的 import 路径（`assets/shared/icon` → `@/shared/Icon`，具名→默认），报告 `runtimeDataSites` 段交 LLM 确认。
- **`.js`→`.jsx`**：data 文件塞进 `<IconPlusIc…/>` 元素即引入 JSX，`--apply` 自动把该 `.js` 转 `.jsx`（`.ts`→`.tsx`），并修引用方显式 `.js`/`.ts` 扩展名 import（无扩展名 import 不动，解析器仍命中 `.jsx`）。
- 仅**标识符** `name={x}`（常量传播未命中）与**链式/嵌套三元** `name={a ? 'x' : b ? 'y' : 'z'}` 仍交 LLM 在 residual 阶段按 catalog/候选解析（recipe：name→组件 map + fallback `<Icon name={t.icon}/>` 兜底未知 key）。

### `<Icon name={X}/>` 改写的 `{}` 上下文规则

> 剥离/替换 `<Icon name={X}/>` 包装时（脚本 `--apply` 的三元 / 数据数组 render，以及 LLM residual 手改的链式三元、prop 驱动调用方同步更新），**改写结果是一个表达式 `X`（如 `cond ? <A/> : <B/>`、`group.icon`），是否包 `{}` 取决于 `<Icon/>` 原所处语法上下文**。包错位置会让 `{}` 被解析为对象字面量/块语句而语法报错。

| `<Icon name={X}/>` 原位置 | 改写后 | 说明 |
|--------------------------|--------|------|
| JSX 子节点 `<div><Icon name={X}/></div>`、`<li><Icon name={X}/></li>` | `{X}` | 子节点位需 `{}` 嵌入表达式 |
| 三元分支表达式 `cond ? <Icon name={X}/> : null` | `X` | 已在表达式位，`{}` 变对象字面量 ❌ |
| 对象属性值 `icon: <Icon name={X}/>` | `icon: X` | `{}` 变嵌套对象字面量 ❌ |
| 数组元素 `[<Icon name={X}/>]` | `[X]` | 同上 ❌ |
| JSX 属性值容器 `prefix={<Icon name={X}/>`} | `prefix={X}` | 外层 `{}` 已是容器，内层再加 `{}` 变对象字面量 ❌ |
| 箭头隐式返回 `(t) => <Icon name={X}/>` | `(t) => X` | `{}` 被当块语句 ❌ |
| `return <Icon name={X}/>` | `return X` | `{}` 变对象字面量（shorthand）❌ |

**规则**：`<Icon name={X}/>` → `{X}` **仅当**原处 JSX 子节点位；**其余表达式位一律裸 `X`（不加 `{}`）**。判定：`<Icon/>` 前一个非空白字符是 `>`（开/自闭合/闭合标签，但非 `=>`）或 `}`（前一个 `{expr}` 子节点结束）→ 子节点位 → 包 `{}`；否则（`(` `)` `,` `:` `[` `?` `{` `=>` `return` 等）→ 表达式位 → 裸。

**prop 驱动调用方同步更新**（数据数组 `icon` 已从字符串改成 icon+ 元素后，调用方去 `<Icon/>` 壳直接透传）：对象值位 `icon: <Icon name={group.icon}/>` → `icon: group.icon`（裸）；JSX 子节点位 `<li><Icon name={group.icon}/></li>` → `<li>{group.icon}</li>`（包）。链式/嵌套三元 LLM 手拼条件渲染同理按上下文判 `{}`。脚本 `--apply` 已按此规则（`wrapIfNeeded`）处理三元与数据数组 render；LLM residual 手改其他形态时务必遵守。

### 图标-prop wrapper 组件（SoftTag / ToggleRow 模式）

> 自定义组件接收 `icon` prop（字符串名），内部 `<Icon name={icon}/>` 渲染。调用点的字面量不在 `<Icon>` 标签上（`<SoftTag icon="bell-ring">`）→ `scanIconComponent` 看不见；内部 `name={icon}` 是解构 prop 参数 → `scanDynamicIcons` 归变量 residual。两半耦合改写由 `match-icons.cjs --apply` **Phase C 自动处理**（方案 B/C，不退方案 A）。

**模式识别**（脚本 `scanIconPropWrappers`）：
- `function NAME({ ..., icon, ... }) {...}` / `const NAME = ({ ..., icon, ... }) => {...}`（解构参数含 `icon` 绑定）；
- 函数体内含 `<Icon name={icon}/>`（`name` 表达式恰为裸标识符 `icon`）；
- `icon` 仅在该 `<Icon name={icon}/>` 内被引用（truthy `icon ?` / render `{icon}` 兼容 ReactNode，放行；`icon.toLowerCase()` / `icon[i]` / `${icon}` 等字符串用法 → 跳过，不入自动）。

**改写规则**（两半同改，否则半改致 `name={<element/>}` 报错）：

| 调用方 `icon=` 形态 | 改写 |
|---|---|
| `icon="字面量"` / `icon={常量}`（同文件 `const X = "lit"` 传播命中） | `icon={<IconPlusIc… iconSize=…/>}`（**尺寸/颜色取自 wrapper 内部 `<Icon/>` 的 size/color**）；未命中 → 占位 `IconPlusIcPublicTransverseRectangleTemplate` |
| `icon={cond ? "a" : "b"}` 扁平两分支字面量 | `icon={cond ? <A…/> : <B…/>}`（任一未命中→该分支占位） |
| `icon={IDENT.field}` 成员（`item.icon` / `MENU[0].icon`） | 调用点**不改**（透传）；数据数组 `FIELD:"lit"` → `FIELD:<IconPlusIc…/>` 元素化（复用数据数组 Phase B 流水线） |
| `icon={链式/嵌套三元}` / 裸标识符未命中常量 / 追不到数组源 | **安全闸：整组退方案 A**（见下） |
| 无 `icon` prop | 不动（`icon` undefined → `{icon}` 渲染空） |

**wrapper 内部** `<Icon name={icon} size="0.75rem"/>` → `{icon}` / 裸 `icon`，按上文 `<Icon name={X}/>` 的 `{}` 上下文规则判：JSX 子节点位（`<span><Icon name={icon}/></span>`）→ `{icon}`；三元分支位（`{icon ? <Icon name={icon}/> : null}`）→ 裸 `icon`（结果 `{icon ? icon : null}`，LLM 可精简为 `{icon}`）。`icon` prop 契约由「字符串名」变「ReactNode」。

**安全闸**：若某 wrapper 存在任一**不可静态解析**的 `icon={expr}` 调用方（链式/嵌套三元、未命中常量的裸标识符、成员表达式追不到静态数组源），**整组跳过自动改写** → wrapper 内部 `<Icon name={icon}/>` 保留走方案 A shim（修 `shared/icon` import 路径），调用方维持原样，报告 `propWrapperResidual` 段交 LLM。理由：wrapper 内部与调用方强耦合——内部转 `{icon}` 透传后，传字符串的调用方会渲染成文本；传元素的调用方又要求内部是透传。二者必须同态，故任一不可解析即整组退 A（与"真运行时数据退方案 A"一致）。LLM residual 处理 `propWrapperResidual` 时：若 `expr` 可追源到静态字面量/数组 → 按 B/C 改写两半；若真运行时 → 保留 shim。

## 1. 功能定位

icon+（`@nce/icon-plus`）是组件库首推的图标方案，按需引入、2000+ 图标，可换风格 / 颜色 / 尺寸；可点击图标操作（编辑/删除/刷新等）直接给 icon+ 挂 `onClick`+原生 `title`，不再用 `IconButton`（已弃用）。内置 `Icon` 组件已被 icon+ 替代、不再推荐。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 装饰性图标 / 状态图标 | icon+ 组件 | antd `@ant-design/icons` 或内置 `Icon name` |
| 可点击的图标操作（编辑 / 删除 / 刷新） | `<IconPlusIc* onClick={fn} title="…" />` 直接挂 icon+ | 用已弃用的 `IconButton` 包一层 / antd 纯图标 Button 退化成原生 `<button>+<Icon>` |
| 文字 + 图标按钮 | `Button leftIcon={<IconPlusXxx />}`（[Button.md](Button.md)） | 给纯 icon+ 加文字（文字按钮用 `Button leftIcon`） |

### 方案A import 路径改法

scaffold 预置 `src/shared/Icon`（folder + 默认导出），保留源项目 `<Icon name="search" size={14} />` 契约（底层运行时 fetch icon-plus）。调用点零改动，只改 import 路径（具名→默认导入）：

| 源项目原路径 | 迁移后路径 | 调用点位置 |
|-------------|-----------|-----------|
| `./assets/shared/icon.jsx` | `@/shared/Icon`（`import Icon`，默认导入） | `src/` 下文件 |
| `../../../assets/shared/icon.jsx` | `@/shared/Icon`（`import Icon`，默认导入） | `src/views/` 下文件 |

> 跑 `scripts/check-relative-imports.cjs`（见 [migration-workflow.md §4.1](../migration-workflow.md)）扫残留 `./assets/shared/...` 旧路径。

## 2. 事件与交互逻辑

### icon+ 图标（首选）

```tsx
import { IconPlusIcPublicSearch, IconPlusIcPublicTrash, IconPlusIcPublicEdit } from '@nce/icon-plus';
<IconPlusIcPublicSearch />
<IconPlusIcPublicTrash type="filled" iconColor={['currentcolor']} iconSize="1.25rem" />   // 继承业务容器文字颜色
```

### 可点击图标：icon+ 直接挂 onClick + title（IconButton 已弃用）

```tsx
// ✅ 可点击图标：onClick + 原生 title（hover 提示）直接挂 icon+；iconSize 已由脚本 --apply 吸附（默认 14）
<IconPlusIcPublicEdit onClick={() => openEdit(row)} title="编辑" iconSize={14} iconColor={['currentcolor']} />
<IconPlusIcPublicTrash onClick={() => askDelete(row)} title="删除" iconSize={14} iconColor={['currentcolor']} />

// 禁用/处理中态：icon+ 无 disabled prop → 条件渲染，或 style 降透明 + 禁指针
{!deleting.has(row.id) && (
  <IconPlusIcPublicTrash onClick={() => askDelete(row)} title="删除" iconSize={14} />
)}
// 或：
<IconPlusIcPublicTrash onClick={deleting.has(row.id) ? undefined : () => askDelete(row)} title="删除" iconSize={14}
  style={{ cursor: deleting.has(row.id) ? 'not-allowed' : 'pointer', opacity: deleting.has(row.id) ? 0.5 : 1, pointerEvents: deleting.has(row.id) ? 'none' : 'auto' }} />
```

> - **hover 提示**用原生 HTML `title` 属性（源 antd Button 的 `title` prop 原样搬；源无 title 则省略，不强加）。需**富文本气泡**（自定义内容/方向）才用 `TipBox` 包裹 icon+，见 [TipBox.md](TipBox.md)。
> - **cursor**：icon+ 默认非 pointer，可点击图标建议 `style={{ cursor: 'pointer' }}`（或业务 className）。
> - **a11y（可选）**：icon+ 非 `<button>` 元素、默认不可键盘聚焦/Enter 触发；无障碍敏感位加 `role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}}}`。常规表格操作列可省。
> - **antd 纯图标 Button 迁移**：`<Button type="text" shape="circle" icon={<Icon name="trash-2" size="0.875rem"/>} title="删除规则" onClick={remove}/>` → 脚本 `--apply` 先把内层 `<Icon>`→`<IconPlusIcPublicTrash iconSize={14}/>`（detectContext 识别 Button 语境、吸附尺寸），LLM 再剥 Button 外壳、把 `onClick`/`title` 搬到 icon+：`<IconPlusIcPublicTrash onClick={remove} title="删除规则" iconSize={14} />`。

## 3. 联动说明

- 操作列可点击图标 → 编辑打开 Dialog / Drawer，删除打开 MessageDialog（[MessageDialog.md](MessageDialog.md)）；处理中用条件渲染或 `pointerEvents:'none'` 降级
- 权限 → 条件渲染该图标（隐藏时相邻 `Divider type="vertical"` 一起隐藏）

## 4. 反面示例

```tsx
// ❌ antd 图标库
import { EditOutlined } from '@ant-design/icons';

// ❌ 用内置 Icon name="ict_*"（已下线），改用 icon+ 组件
<Icon name="ict_trash" />

// ❌ 用已弃用的 IconButton 包一层——可点击图标直接给 icon+ 挂 onClick + title 即可
<IconButton iconName={<IconPlusIcPublicTrash />} tipText="删除" onClick={() => askDelete(row)} />

// ✅ 目标态：icon+ 直接挂 onClick + 原生 title（含 antd 纯图标 Button 剥外壳后）
<IconPlusIcPublicTrash onClick={remove} title="删除" iconSize={14} />

// ❌ 剥离 <Icon name={X}/> 包装时在非子节点位包 {}，{X} 被解析为对象字面量/块语句而语法报错（缺陷一/二）
//   三元分支位：cond ? {openKey===item.key ? <A/> : <B/>} : null      → 内层 {} 变对象字面量
//   对象值位：  icon: {group.icon}                                   → {} 变嵌套对象字面量
//   正确：按上下文剥 {} —— 子节点位才包 {X}，表达式位（三元分支/对象值/数组元素/prop 容器/箭头体/return）裸 X
cond ? (openKey === item.key ? <IconPlusIcPublicChevronUp /> : <IconPlusIcPublicChevronDown />) : null
icon: group.icon
```

```jsx
// ❌ 图标-prop wrapper 半改：调用点 icon="bell-ring" 改了，wrapper 内部 <Icon name={icon}/> 没改
//    → <SoftTag icon={<IconPlusIcPublicXxx/>}> 配内部 <Icon name={icon}/> → name={<element/>} 非法
<SoftTag tone="brand" icon={<IconPlusIcPublicXxx iconSize="0.75rem" />}>已开启</SoftTag>
//   wrapper 内部仍是 {icon ? <Icon name={icon} size="0.75rem"/> : null}  // name 收到元素，报错

//   正确：两半同改——调用点 icon= → icon={<IconPlusIc…/>}（尺寸取自 wrapper 内部 size），内部 <Icon name={icon}/> → {icon}/裸透传
<SoftTag tone="brand" icon={<IconPlusIcPublicXxx iconSize="0.75rem" />}>已开启</SoftTag>
//   内部：{icon ? icon : null}   // icon 已是 ReactNode，透传渲染

// ❌ wrapper 存在不可静态解析的调用方仍强改内部 → 传字符串的调用方渲染成文本
<BadWrapper icon={pickIcon(row)} label="alert" />   // pickIcon(row) 运行时才知值
//   正确：安全闸整组退方案 A——内部保留 <Icon name={icon}/> shim，调用方维持原样，交 LLM residual
```

## 5. API 速查

> icon+ 用法来自 Icon 页 README 与 demo。`IconButton` 已弃用，可点击图标直接用 icon+ + `onClick` + 原生 `title`（见 §3）；其 API 不再列入。内置 `Icon/Icon` 组件已被 icon+ 替代、不再推荐，其 API 不再列入。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| icon+ 组件 `type` / `iconColor` / `iconSize` | `'filled' …` / `string[]` / 数字 / rem / px 字符串 | 风格 / 颜色数组 / 尺寸（B/C 原样透传；方案A shim 的 `size` 另吸附到 12/14/16/20/24/32/36/40/48/60，见渲染方式 A 行） |
| icon+ 组件 `onClick` | `(event) => void` | 可点击图标直接挂（弃用 IconButton 后的目标态）；配 `title`（原生 hover） |
| icon+ 组件 `title` / `style` / `className` | 原生 HTML 属性 | `title` 承载 hover 提示（原 antd Button `title`） |
