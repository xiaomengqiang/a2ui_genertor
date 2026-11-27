# Icon 图标（@/shared/SvgIcon 方法说明）

> 分类：通用｜本文档是图标转换方法的**集中说明**，各组件 doc 仅点式引用本文，不重复铺陈。

## 背景：为什么不用 eview-ui 图标组件

skill 把 antd 项目转 eview-ui。源 antd 图标用 `shared/Icon`（`<Icon name="..."/>`，icon-plus 在线 + Lucide）。eview-ui 自有的图标**组件**（`Icon` / `SvgIcon` / `IconButton`）一律不用：
- `eview-ui/SvgIcon`、`eview-ui/svg-icons/*`、`eview-ui/IconButton`：**已废弃**（eview-ui 自有文档标注）。
- `eview-ui/Icon`：名体系与源 icon-plus 不同，无 catalog 匹配依据，不用。

eview-ui **其他组件**涉及图标的配置 prop 按类型分两种消费形态：**图标字符串**（string——图片路径或 base64 data URL）与 **图标组件**（ReactNode）。本 skill 用 scaffold 自带的 `@/shared/SvgIcon` 模块桥接。

> **模块来源**：`@/shared/SvgIcon` 的实现代码已随 scaffold 提供（`src/shared/SvgIcon/`，含 `SvgIcon.jsx` + `core/` fetch/color/transform 引擎）——**不是内网单独提供**，转换时无需另行索取。但模块运行时通过 icon-plus **图标 API 接口**取 SVG，该接口**只能在内网访问**（外网环境图标不渲染，不判 FAIL——属预期行为）。

> **命名冲突警告**：eview-ui 自有的 `SvgIcon`（`eview-ui/SvgIcon`、`eview-ui/svg-icons/*`）是废弃内置件，与 `@/shared/SvgIcon` 的 `SvgIcon` **同名不同源**。务必区分：
> - `import { SvgIcon } from '@/shared/SvgIcon'` —— ✅ scaffold 自带，**核心，允许**。
> - `import SvgIcon from 'eview-ui/SvgIcon'` / `from 'eview-ui/svg-icons/...'` —— ❌ 废弃内置，**禁用**。

## 核心方案：name/size/color → 图标组件 / 图标字符串

源 antd 图标 = **name + size + color** 三参。`@/shared/SvgIcon` 接收这三参，按 eview-ui 组件 prop 类型转换为两种产物：

```jsx
import { SvgIcon, getIconBase64, getIconSvg, useIcon } from '@/shared/SvgIcon';
```

| 产物 | 形态 | 用于 | 生成方式 |
|---|---|---|---|
| **图标组件** | ReactNode | 二类组件 ReactNode 型 icon prop（Menu.SubMenu.icon / Menu.MenuItem.icon / PopUpMenu.icon）；独立 `<Icon name>` 调用点 | `<SvgIcon src={name} size={n} color={...}/>`（renderMode 默认 `'svg'` 内联） |
| **图标字符串** | string（base64 data URL；亦可为图片路径） | 一类组件 string 型 icon prop（leftIcon/rightIcon/icon/iconUrl/iconLeaf/options[].icon 等，渲染 `<img src>` 或 `background-image: url()`） | `useIcon(name,{size,color?})` 主题响应式预载（底层 `getIconBase64(src,{color,size})` 异步原语） |
| 原始 SVG 文本 | string | 需要直接操作 SVG markup 的场景 | `getIconSvg(src,{color,size})` |

### 三件套 API

**`<SvgIcon>`**（图标组件，ReactNode）

| 属性 | 描述 | 类型 | 默认值 |
|---|---|---|---|
| `src` | 图标名/关键词（对应源 `<Icon name>`），亦可为 URL/本地路径/内联 SVG 字符串（必填） | string | — |
| `renderMode` | 渲染形态：`'svg'` 内联（继承上下文色）/ `'base64'` 输出 `<img>` | `'svg'` \| `'base64'` | `'svg'` |
| `type` | 图标变体 | `'lined'` \| `'filled'` \| `'lined-twotone'` \| `'filled-twotone'` \| `'round-bg'` \| `'square-bg'` | `lined`（undefined 同 lined） |
| `size` | 图标尺寸（数字 px 或字符串，吸附 icon+ 标准尺寸） | number \| string | 16 |
| `color` | 图标颜色（hex；经 transform 烘焙进 SVG） | string | 主题默认色 |
| `weight` | 描边粗细 | number | — |
| `filledStrokeColor` | filled 类型的描边色 | string | — |
| `rotate` | 旋转角度（deg） | number | — |
| `spin` | 是否旋转动画（loading 态） | boolean | false |
| `hoverColor` | 悬浮色（仅单色类型 lined/filled 生效） | string | — |
| `className` / `style` | 外层 `<span>` 样式 | string / object | — |
| `onClick` | 点击回调（设了后 cursor 变 pointer） | function | — |
| `...rest` | **透传 props**（title/aria-*/role/tabIndex/id/data-* 等原样到 `<span>`，承接源 `<Icon>` 的 interactiveProps 搬迁） | — | — |

> `renderMode='svg'`（默认）内联渲染 SVG，色经 transform 烘焙；`renderMode='base64'` 输出 `<img src="data:image/svg+xml;base64,...">`。

**`getIconBase64(src, options)` → `Promise<string>`**（图标字符串，base64 data URL）

| 参数 | 描述 | 类型 |
|---|---|---|
| `src` | icon+ 图标名/关键词（亦可为 URL/路径） | string |
| `options.color` | 颜色 hex | string |
| `options.size` | 尺寸（同 SvgIcon.size） | number \| string |
| `options.type` | 变体（默认 `lined`） | string |
| **返回** | `Promise<base64 data URL 字符串>`（失败返回 `''`） | `Promise<string>` |

可直接赋给 `img.src` 或作为 string 型 icon prop 值；UTF-8 安全，兼容 `background-image: url()` 与中文 SVG。

**`getIconSvg(src, options)` → `Promise<string>`**：返回原始 SVG 文本（options 同上）。模块另导出 `fetchSvg`/`setIconApiConfig`/`clearIconCache`/`isIconName` 等 core 工具（`setIconApiConfig` 可改图标 API 接口地址）。

### string 型 icon prop 的主题响应式预载（`useIcon`）

string 型 icon prop 收图片路径 / base64 data URL，由 eview-ui 渲染成 `<img src>` 或 `background-image: url()`。`<img>`/`background-image` 是隔离文档，**SVG 里的 `currentColor` 无法继承宿主页面的 `color`**（解析成黑色），所以 base64 路径不能依赖 `currentColor`——颜色必须烘焙进 data URL，且需要随主题切换重新烘焙。

统一用 `useIcon` hook 预载，**不要手写 `getIconBase64` + useEffect**：

```jsx
import { useIcon } from '@/shared/SvgIcon';

// Button 彩色 status：传 color，固定烘焙（primary 传 '#fff'，light/dark 两套主题都对）
function SearchButton() {
  const leftIcon = useIcon('search', { size: 16, color: '#fff' });
  return <Button status="primary" text="搜索" leftIcon={leftIcon} />;
}

// 其他图标组件 / default Button：不传 color，默认跟随主题文本色翻转
function MyCard() {
  const icon = useIcon('star', { size: 14 });
  return <Card icon={icon} />;
}
```

**`useIcon(name, options)` → `string`**（base64 data URL，未就绪时 `''`）

| 参数 | 描述 | 类型 | 默认 |
|---|---|---|---|
| `name` | icon+ 图标名/关键词（亦可为 URL/路径） | string | — |
| `options.size` | 尺寸（同 SvgIcon.size） | number \| string | 16 |
| `options.color` | 图标色 hex。**Button 彩色 status 必传**（primary → `'#fff'`）；不传则跟随主题 | string | 跟随主题 |
| `options.type` | 变体（默认 `lined`） | string | `lined` |
| **返回** | base64 data URL 字符串（首次未就绪返回 `''`） | string | — |

**主题响应规则**：
- **传 `color`**（Button 彩色 status：primary/danger/success/warning 等彩色底按钮）→ 按指定色烘焙，不随主题变（primary 底图标在 light/dark 都是白，固定即可）。
- **不传 `color`**（Card/Crumbs/Tab/Accordion/PageMessage/Tree 等所有其他图标组件，以及 default Button）→ 默认跟随主题文本色（aui3-1：light `#191919` / dark `#DFDFDF`），主题切换瞬时换色。
- 语义色图标（PageMessage success/error/warn/info）按需传对应 `color` hex（这类语义色通常两套主题同值，不翻转）。
- 带激活/选中态的组件（Tab.iconActive、Popup.options[].iconActive、Checkbox/Radio 选中态）默认态不传 color 跟随主题，激活态传 `color: 主色 hex`。

**机制**：base64 按 `(name,color,size,type)` 缓存，命中时 `useIcon` 同步返回（`return cache.get(key) || url`），主题切换那一刻即拿到新色 base64、无空帧闪烁；原始 SVG XML 走 `svgCache`，重烘焙不重新请求网络。

> `getIconBase64(src,{color,size})` 仍是底层异步原语（`Promise<string>`），仅当需要脱离 React 生命周期手动预载（批量 `Promise.all`、模块顶层常量等）时直接用；常规组件调用一律走 `useIcon`。

## 组件分类表（权威文档映射，已与 skill 实有 doc 核对）

### 一类：string 型 icon prop（收图片路径 / base64 data URL）→ `useIcon`

| 组件 | 图标属性 | 渲染 |
|---|---|---|
| Accordion | `icon` / `activeIcon` / `headerIcon` | `<img src>` |
| Button | `leftIcon` / `rightIcon`；`leftIconProps.{leftHoverIcon,leftDisabledIcon}`、`rightIconProps.*` | `<img src>` |
| ButtonMenu | `iconUrl` | 透传给 Button 的 left/rightIcon |
| Card | `icon` | `background-image: url()` |
| Crumbs | `icon`（item）/ `splitIcon` | `background-image: url()` |
| DivMessage | `icon` | 背景图 URL |
| FormMessage | `icon` | 背景图 URL |
| PageMessage | `icon` | 背景图 URL |
| IconButton（废弃，仅标注新方式） | `iconUrl` / `hoverIconUrl` | `background-image: url()` |
| IconButtonGroup | `iconUrl` | 透传给 IconButton |
| Loader | `iconUrl` | loading/refresh 图片路径 |
| InputSelect | `icon`（options item） | URL |
| Popup | `options[].icon` / `options[].iconActive` | URL |
| Checkbox | `icon` | URL |
| Radio | `icon` | URL |
| RadioGroup | `icon` | URL |
| Tab | `icon`（TabItem） | `background-image: url()` |
| Tree | `iconLeaf` / `iconLeafArr` / `iconExpanded` / `iconCollapsed` | 节点图标 URL |
| TreeTable | `iconLeaf` / `iconExpanded` / `iconCollapsed` | 节点图标 URL |
| TimeLine | `data[].icon` | `<img src>` |
| Wizards | `customIcon` | URL |

### 二类：ReactNode 型 icon prop → `<SvgIcon>`

| 组件 | 属性 | 说明 |
|---|---|---|
| Menu.SubMenu | `icon?: React.ReactElement` | 直接作为子节点渲染 |
| Menu.MenuItem | `icon` | **注意**：类型声明为 string，但实现是 `{icon}` 直接作为子节点渲染；传字符串会显示为文本，**实际应传 React 元素**（`<SvgIcon>`） |
| PopUpMenu | `icon`（ReactNode）+ `iconUrl`（string 路径，已废弃） | `renderIcon` 先判 `React.isValidElement(icon)`，否则用 `iconUrl` 渲染 `<img>`——优先传 `<SvgIcon>` |

### 特例：SelectPro

SelectPro options 无 `icon` 字段，用 `options[].node`（ReactNode）自定义整项展示。antd Select 选项带图标时，把图标+文本作为 node 整体渲染（图标位是 ReactNode → 用 `<SvgIcon>`）：

```jsx
const options = [
  {
    text: 'Create', value: 1,
    node: (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <SvgIcon src="create" size={14} /> <span>Create</span>
      </div>
    ),
  },
];
```

> 权威表里的 "Select options[].icon"（string URL）指旧 Select（本 skill 不用，antd Select→SelectPro）。

### 不存在 / 跳过

- `Message.md`、`RadioPro.md`：skill 无此 doc，跳过。
- `Dialog`（旧，`customIcons[].iconUrl`，已弃用无 doc）→ DialogPro 无 icon prop（用 `customHeader` ReactNode），跳过。
- `Dropdown`：权威标"DropDown废弃"，但 skill Dropdown.md 是 antd 高度同构、非废弃、无 icon prop → 不动。

## before / after 示例

### 独立 `<Icon name>` 调用点 → `<SvgIcon>`

```jsx
// before（源 antd / shared/Icon）
<Icon name="search" size={16} color="#0072e8" onClick={handleSearch} title="搜索" />

// after（@/shared/SvgIcon）—— interactiveProps 原样透传
<SvgIcon src="search" size={16} color="#0072e8" onClick={handleSearch} title="搜索" />
```

### string 型 icon prop（Button.leftIcon）→ useIcon 预载

```jsx
// before：leftIcon 收 string，源用图片路径
<Button text="搜索" leftIcon="/assets/search.png" />

// after：用 useIcon 把 icon+ 名转 base64 data URL（主题响应式）
//   - 彩色 status 传 color（primary → '#fff'，两套主题都对）
//   - default / 无 status 不传 color，跟随主题翻转
function SearchButton() {
  const leftIcon = useIcon('search', { size: 16, color: '#fff' });
  return <Button status="primary" text="搜索" leftIcon={leftIcon} />;
}
```

### ReactNode 型 icon prop（Menu.SubMenu.icon）→ `<SvgIcon>`

```jsx
// before：antd Menu.SubMenu.icon 收 ReactNode（antd Icon）
<Menu>
  <Menu.SubMenu icon={<AntdSearchOutlined />} title="查询">
    ...
  </Menu.SubMenu>
</Menu>

// after：用 <SvgIcon>（@/shared/SvgIcon）
<Menu>
  <Menu.SubMenu icon={<SvgIcon src="search" size={14} />} title="查询">
    ...
  </Menu.SubMenu>
</Menu>
```

## 硬约束

1. **统一 import**：`import { SvgIcon, getIconBase64, getIconSvg, useIcon } from '@/shared/SvgIcon'`（scaffold 自带 `src/shared/SvgIcon/`）。
2. **string 型 icon prop 只收字符串**（图片路径 / base64 data URL）——用 `useIcon` 取 base64 传入；**不要塞 ReactNode**（`<SvgIcon>`）否则不渲染。
3. **ReactNode 型 icon prop 只收 React 元素**——用 `<SvgIcon>`；**不要塞字符串**否则不渲染。
4. **interactiveProps 必须原样透传**：源 `<Icon>` 的 onClick/title/aria-*/role/tabIndex/style/className/id/data-* 逐个搬到 `<SvgIcon>`（`iconCallSites[].interactiveProps` 是搬迁依据；具体标签文本读源文件取）。
5. **string 型图标用 `useIcon` 主题响应式预载**：常规组件调用一律 `useIcon(name,{size,color?})`，不要手写 `getIconBase64`+useEffect。**Button 彩色 status 传 `color`**（primary→`'#fff'`，固定不翻转）；**其他图标组件 / default Button 不传 `color`**，默认跟随主题文本色翻转。`<img>`/`background-image` 是隔离文档、`currentColor` 无法继承宿主 `color`——**不可不烘焙颜色依赖 currentColor**。批量脱离 React 生命周期（模块顶层常量等）才直接用 `getIconBase64`（`Promise`，自组 `Promise.all`）。
6. **禁用**：`eview-ui/Icon`（名体系不同）、`eview-ui/SvgIcon`、`eview-ui/svg-icons/*`（废弃）、`eview-ui/IconButton`（废弃）、源 `@/shared/Icon` 旧 shim（已删除，不再使用）。check-imports.cjs 校验（SHIM_PATH_RESIDUE + EVUI_ICON_FORBIDDEN）。
7. **图标 API 接口只能在内网访问**：`@/shared/SvgIcon` 运行时经 icon-plus 接口取 SVG，外网环境图标不渲染——属预期行为，不判 FAIL；校验只看 SvgIcon/useIcon/getIconBase64 是否正确转换（import 路径 + 用法），不校验图标是否实际渲染。

---

## 附录：eview-ui 内置 Icon API 速查（仅供背景理解）

> 以下为 eview-ui 自有 `Icon` 组件的 API（**本 skill 不使用**，弃用 eview-ui 图标组件后仅作背景参考，帮助理解 string 路径型 prop 的来源与图标名体系）。业务代码**不要**从 `eview-ui/Icon` 导入图标组件。

eview-ui `Icon` 可通过 `name` 取组件库图标，支持 `color`/`hoverColor`/`size`/`disabled` 等；亦支持 `iconUrl` 传自定义图片路径（作为背景图渲染）。颜色状态优先级：disabled > focus > active > hover > default。`confirm`/`default_info`/`error`/`info`/`success`/`warn`/`confirmmd`/`infomd`/`errormd`/`warnmd`/`risk`/`high_risk` 为自带颜色图标（simpleColorIcons），不受 color/hoverColor/disabledColor/activeColor/focusColor 影响。

### 各版本默认颜色

| 规范版本 | 默认色 | 悬浮色 | 禁用色 |
|---|---|---|---|
| aui2 | #707070 | #1B8ADB | #cccccc |
| aui2 (evening) | #eeeeee | #8bc3ff | rgba(238,238,238,0.3) |
| aui3 | #191919 | #0072e8 | rgba(25,25,25,0.3) |
| aui3 (evening) | #eeeeee | #8bc3ff | rgba(238,238,238,0.3) |
| aui3-1 | #191919 | #2E86DE | var(--color-icon-disabled) |
| aui3-1 (evening) | #DFDFDF | #5CA2E9 | var(--color-icon-disabled) |

### 图标名称映射（同名变体）

`top_angle`→`arrow_up`；`bottom_angle`→`arrow_down`；`right_arrow`→`Right`；`error_close`/`close_active`/`close_hover`/`default_close`/`success_close`→`close`；`default_info`/`infomd`→`info`；`confirmmd`→`confirm`；`errormd`→`error`；`warnmd`→`warn`；`blue_check`/`check_primary`→`check`。

### 图标库（icon+ 名/关键词参考，供 `<SvgIcon src>` / `useIcon(name)` 取用）

arrow_down, arrow_up, Left, Right, left_move, right_move, move_all_up, back, asc_sort_icon, desc_sort_icon, no_sort_default_icon, table_no_sort_default_icon, table_row_filter, calender, check, close, close_circle, plus, plus_circle, reduce, edit, feedback, del, operation, search, expand, minus, minus_circle, refresh, help, zoomIn, zoomOut, confirm, info, success, warn, error, risk, high_risk, detail, double_arrow, dropArrow, drop_arrow, file, folder, hover_sort_header_icon, loading, star, start, step_icon, step_icon_disabled, stop, tucked, move, reset, select, exportImg, split, clock。
