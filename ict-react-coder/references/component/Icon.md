# Icon 图标使用规范

用于表达操作、导航、状态、类别或重点对象。

## 图标来源 — Lucide(唯一)

本 skill 的页面图标一律使用 **Lucide 图标**（`<Icon name="..." />`），不使用 `@ant-design/icons`。antd 组件自身的内置图标（Select 箭头、Modal 关闭键等）随 antd.min.js 携带，无需处理、也不做替换。

```jsx
import { Icon } from "./assets/shared/icons.js";

<Icon name="chevron-down" size={16} color="#0067D1" className="chev" />

const item = { icon: "home", label: "首页" };
<Icon name={item.icon} size={22} />

<Icon name={open ? "chevron-up" : "chevron-down"} />

<Icon src="./assets/uploads/logo.svg" size={28} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | — | Lucide 图标名（kebab-case） |
| `src` | string | — | 用户提供的图片路径（svg/png/jpg）；与 `name` 同设时优先 |
| `size` | number | `16` | 图标尺寸 px |
| `color` | string | `currentColor` | 描边色（name 模式） |
| `className` | string | `""` | CSS 类（间距/hover 效果写这里） |
| `style` | object | — | 内联样式 |
| `strokeWidth` | number | `2` | 描边宽度（name 模式） |

## name 模式规则（默认）

1. **只用真实存在的 Lucide 名** — kebab-case（`chevron-down`、`shopping-cart`、`circle-check`），不发明、不猜拼、不擅自复数化
2. **绝不手写 SVG path** — Icon 渲染的是 Lucide nodes，手写 path 不会显示
3. **camelCase 自动转换** — `chevronDown` → `chevron-down`，但仍优先 kebab-case
4. **变量传名合法** — `name={item.icon}`、`name={cond ? "a" : "b"}` 均可；运行时拼接名（`` `${type}-icon` ``）无法被构建提取，渲染为空
5. **不用已更名的旧名** — 如 `bar-chart-3` → `chart-column`、`more-horizontal` → `ellipsis`、`check-circle-2` → `circle-check-big`
6. 拿不准的名字靠 Lucide 知识或查 https://lucide.dev/icons
7. build.mjs 会在构建时校验每个名字并按需注入；非 Lucide 名触发 WARN

## src 模式（用户资产）

仅当用户明确提供图片资产（svg/png/jpg）时使用。文件放入页面脚手架 `assets/uploads/`，路径相对脚手架根解析：

1. `<Icon src="./assets/uploads/logo.svg" size={28} />`
2. `<img src="./assets/uploads/banner.png" />`

## 与 antd 组件搭配

antd 的 `icon` 类 prop 接收任意 ReactNode，直接传 `<Icon />`：

```jsx
<Button icon={<Icon name="search" size={14} />}>查询</Button>
<Input prefix={<Icon name="user" size={14} />} placeholder="账号" />
<Menu items={[{ key: "home", icon: <Icon name="house" size={14} />, label: "首页" }]} />
```

注意 `size` 显式传值（antd 文字默认 14px，Lucide 默认 24px 会撑爆行高）。
