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
import { SvgIcon, getIconBase64, getIconSvg } from '@/shared/SvgIcon';
```

| 产物 | 形态 | 用于 | 生成方式 |
|---|---|---|---|
| **图标组件** | ReactNode | 二类组件 ReactNode 型 icon prop（Menu.SubMenu.icon / Menu.MenuItem.icon / PopUpMenu.icon）；独立 `<Icon name>` 调用点 | `<SvgIcon src={name} size={n} color={...}/>`（renderMode 默认 `'svg'` 内联） |
| **图标字符串** | string（base64 data URL；亦可为图片路径） | 一类组件 string 型 icon prop（leftIcon/rightIcon/icon/iconUrl/iconLeaf/options[].icon 等，渲染 `<img src>` 或 `background-image: url()`） | `getIconBase64(src,{color,size})` 异步取 base64 data URL |
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
| `spin` | 是否旋转动画（loading 态） | bool | false |
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

### string 型 icon prop 的 async 预载模式

`getIconBase64` 是异步的，**不可同步赋值**给 string 型 prop。预载模式：

```jsx
import { getIconBase64 } from '@/shared/SvgIcon';

function MyButton() {
  const [iconUrl, setIconUrl] = useState('');
  useEffect(() => {
    let alive = true;
    getIconBase64('search', { color: '#0072e8', size: 16 }).then(url => {
      if (alive && url) setIconUrl(url);
    });
    return () => { alive = false; };
  }, []);
  return <Button text="搜索" leftIcon={iconUrl} />;  // leftIcon 收 string（路径/base64）
}
```

## 组件分类表（权威文档映射，已与 skill 实有 doc 核对）

### 一类：string 型 icon prop（收图片路径 / base64 data URL）→ `getIconBase64`

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

### string 型 icon prop（Button.leftIcon）→ getIconBase64 预载

```jsx
// before：leftIcon 收 string，源用图片路径
<Button text="搜索" leftIcon="/assets/search.png" />

// after：用 getIconBase64 把 icon+ 名转 base64 data URL（async 预载）
function SearchButton() {
  const [leftIcon, setLeftIcon] = useState('');
  useEffect(() => {
    let alive = true;
    getIconBase64('search', { size: 16 }).then(url => { if (alive) setLeftIcon(url); });
    return () => { alive = false; };
  }, []);
  return <Button text="搜索" leftIcon={leftIcon} />;
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

1. **统一 import**：`import { SvgIcon, getIconBase64, getIconSvg } from '@/shared/SvgIcon'`（scaffold 自带 `src/shared/SvgIcon/`）。
2. **string 型 icon prop 只收字符串**（图片路径 / base64 data URL）——用 `getIconBase64` 取 base64 传入；**不要塞 ReactNode**（`<SvgIcon>`）否则不渲染。
3. **ReactNode 型 icon prop 只收 React 元素**——用 `<SvgIcon>`；**不要塞字符串**否则不渲染。
4. **interactiveProps 必须原样透传**：源 `<Icon>` 的 onClick/title/aria-*/role/tabIndex/style/className/id/data-* 逐个搬到 `<SvgIcon>`（`iconCallSites[].interactiveProps` 是搬迁依据；具体标签文本读源文件取）。
5. **async 预载**：`getIconBase64` 是 Promise，string 型 prop 用 useEffect+useState 预载，**不可同步赋值**；批量场景调用方自组 `Promise.all`。
6. **禁用**：`eview-ui/Icon`（名体系不同）、`eview-ui/SvgIcon`、`eview-ui/svg-icons/*`（废弃）、`eview-ui/IconButton`（废弃）、源 `@/shared/Icon` 旧 shim（已删除，不再使用）。check-imports.cjs 校验（SHIM_PATH_RESIDUE + EVUI_ICON_FORBIDDEN）。
7. **图标 API 接口只能在内网访问**：`@/shared/SvgIcon` 运行时经 icon-plus 接口取 SVG，外网环境图标不渲染——属预期行为，不判 FAIL；校验只看 SvgIcon/getIconBase64 是否正确转换（import 路径 + 用法），不校验图标是否实际渲染。

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

### 图标库（icon+ 名/关键词参考，供 `<SvgIcon src>` / `getIconBase64(src)` 取用）

arrow_down, arrow_up, Left, Right, left_move, right_move, move_all_up, back, asc_sort_icon, desc_sort_icon, no_sort_default_icon, table_no_sort_default_icon, table_row_filter, calender, check, close, close_circle, plus, plus_circle, reduce, edit, feedback, del, operation, search, expand, minus, minus_circle, refresh, help, zoomIn, zoomOut, confirm, info, success, warn, error, risk, high_risk, detail, double_arrow, dropArrow, drop_arrow, file, folder, hover_sort_header_icon, loading, star, start, step_icon, step_icon_disabled, stop, tucked, move, reset, select, exportImg, split, clock。
