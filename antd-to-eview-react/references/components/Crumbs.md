# Crumbs 组件功能逻辑规格（面包屑）

> 导入：`import Crumbs from '@/shared/Crumbs'`（scaffold 包壳，透明转发 `@nce/eview-react/Crumbs`，API 不变）。
> 资料来源：TypeDoc `Crumbs/Crumbs` + 官网 Crumbs 页示例。
> ⚠️ 组件名是 **`Crumbs`**（不是 Breadcrumb）；`data=[{ title, url?, enable?, icon? }]` 驱动，**最后一项不传 `url` 即当前页**；点击回调是组件级 `onClick(data, event)`，不是每项自己的 onClick。
> ⚠️ 分隔符属性拼写是 **`seprator`**（官方即如此），默认 `>`。
> ⚠️ 超过 `countLimit`（默认 6）项会自动折叠成下拉。

> **antd Breadcrumb → Crumbs 字段映射（必须逐项改，勿保留 antd prop/字段名）**：
>
> | antd Breadcrumb | Crumbs | 说明 |
> |-----------------|--------|------|
> | `items` prop | `data` prop | **prop 重命名**，`items=`/`item=` 残留即未转 |
> | 项 `title` | 项 `title` | 两边同名，**不用改**（但别因此误以为其他字段也不用改） |
> | 项 `href` / `path` | 项 `url` | **字段重命名**；有 `url` 才可点，最后一项省略 `url` 即当前页 |
> | 项 `icon` | 项 `icon` | 基本不变（eview 收 `string \| ReactElement`） |
> | `separator` prop | `seprator` prop | **拼写反转**：eview 官方 API 即拼错的 `seprator`（将错就错），正确英文 `separator` 残留即未转 |
> | `<Breadcrumb.Item>xxx</Breadcrumb.Item>` JSX 子元素 | `data=[{title:'xxx'}]` | **拍平成数组**，不要保留 `Breadcrumb.Item` 结构 |
> | `Breadcrumb.Item href="/x"` | `data` 项 `url:'/x'` | 子元素的 `href` 也转成项的 `url` |
> | `items[].menu`（下拉子菜单） | — | 无对应，手写或删除 |

## 1. 功能定位

Crumbs 是面包屑导航：显示当前页路径，可点上级跳转，可带标题、图标、自定义分隔符。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 页面顶部路径导航 | `Crumbs data onClick` | antd `Breadcrumb items` / 手写 `<nav>` |
| 页内版块切换 | `Tab`（[Tab.md](Tab.md)） | Crumbs |
| 步骤进度 | `Steps`（[Steps.md](Steps.md)） | Crumbs |

## 2. 事件与交互逻辑

```tsx
const crumbs = [
  { title: '系统管理', url: '/system' },
  { title: '用户管理', url: '/system/users' },
  { title: '编辑用户' },        // 最后一项不传 url → 当前页
];

<Crumbs
  data={crumbs}
  seprator="/"                                       // 默认 >（拼写：seprator 不是 separator）
  onClick={(item: Crumb, event) => {                 // 组件级回调；只有带 url 的项可点
    event.preventDefault?.();
    navigate(item.url!);                             // 与路由集成，不走 <a href> 整页刷新
  }}
/>

// 带标题 / 折叠阈值
<Crumbs title="当前位置" data={crumbs} countLimit={4} itemTip />

// 项图标 / 分隔图标用 icon+
import { IconPlusIcPublicHome, IconPlusIcPublicChevronRight } from '@hui/icon-plus';
<Crumbs
  data={[{ title: '首页', url: '/', icon: <IconPlusIcPublicHome /> }, { title: '用户管理' }]}
  splitIcon={<IconPlusIcPublicChevronRight />}
/>
```

## 3. 联动说明

- 路由变化 → 重新派生 `crumbs`；不要手动维护一份与路由脱节的数组
- 点击上级 → 路由跳转 + 当前页未保存修改时先确认（[MessageDialog.md](MessageDialog.md)）
- 详情页标题随对象名变化 → 最后一项 `title` 跟随 state

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 Breadcrumb / items / separator / Breadcrumb.Item
<Breadcrumb items={[{ title: '首页', href: '/' }]} separator="/" />
<Breadcrumb.Item>用户</Breadcrumb.Item>

// ❌ prop 没转：items=/item= 残留（应为 data=）
<Crumbs items={crumbs} onClick={(d, e) => {}} />
<Crumbs item={crumbs} onClick={(d, e) => {}} />

// ❌ 字段没转：项里残留 href/path（应为 url）——title 同名掩护了 href 漏改，最常见
<Crumbs data={[{ title: '首页', href: '/' }, { title: '用户' }]} onClick={(d, e) => {}} />

// ❌ 拼写没转：separator=（正确英文）残留（eview 官方 API 是 seprator，将错就错）
<Crumbs data={crumbs} separator="/" onClick={(d, e) => {}} />

// ❌ 分隔符按正确英文写 separator（官方拼写是 seprator）
<Crumbs separator="/" />

// ❌ 每项写自己的 onClick（组件只有一个 onClick(data, event)）
data={[{ title: '首页', onClick: goHome }]}

// ❌ 最后一项也传 url，当前页变成可点链接
data={[{ title: '用户管理', url: '/users' }, { title: '编辑', url: '/users/edit' }]}

// ❌ 手写 <nav> 面包屑（Crumbs 已覆盖）
<nav aria-label="breadcrumb">…</nav>
```

## 5. API 速查

> 压缩自 `Crumbs/Crumbs`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `Array<{ title, url?, enable?, icon? }>`，**必填** | 路径项；**prop 名是 `data`（非 antd 的 `items`），项字段用 `url`（非 antd 的 `href`/`path`），`title` 两边同名**；有 `url` 才可点；最后一项省略 `url`；`icon` 收 `string \| ReactElement`（默认用 icon+） |
| `onClick` | `(data, event) => void` | 点击带链接的项（组件级，非每项） |
| `title` | `string` | 面包屑前的标题，如"当前位置" |
| `seprator` | `string`，默认 `>` | 分隔符（拼写照官方） |
| `splitIcon` | `string \| ReactElement` | 自定义分隔图标，默认用 icon+ 组件 |
| `countLimit` | `number`，默认 `6` | 超过则折叠为下拉 |
| `itemTip` | `boolean`，默认 `false` | 悬浮显示项文本提示 |
| `itemStyle` / `style` / `className` / `id` | — | 样式与标识 |
