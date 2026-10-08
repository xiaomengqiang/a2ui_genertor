# Accordion 组件功能逻辑规格（手风琴导航菜单）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Accordion/Accordion`；官网组件页 Accordion 及示例 `AccordionBasic.jsx` / `AccordionMultiLevel.jsx` / `AccordionDisabled.jsx` / `AccordionDemo.jsx` / `AccordionIcon.jsx` / `AccordionCustomContent.jsx`；变更日志中的 Accordion 条目
>
> ⚠️ Accordion 是**多级导航菜单**（官网："为页面和功能提供导航的菜单列表"）：`data` 驱动，`selectedValue` 是**单个 string**，点击回调 `onClick(node)`。它不是 antd `Collapse` 那种内容折叠面板，内容折叠用 [Panel](Panel.md)。
> ⚠️ **`expanded` / `onExpand` 语义反转**（官方标注"组件属性遗留问题"）：`expanded={true}` 表示**收起**，`onExpand(flag)` 的 `flag` 为 true 表示变为展开。写法固定为 `expanded={collapsed}` + `onExpand={(flag) => setCollapsed(!flag)}`（demo `AccordionDemo.jsx` / `AccordionIcon.jsx`）。
> ⚠️ demo 中的 `expand={…}` 与子项字段 `description` 不在 API 表中，不要写。

## 1. 功能定位

Accordion 是侧边多级导航菜单：一级菜单可带图标，支持多层嵌套、禁用节点，整个面板可收起，收起后以节点图标呈现。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 页面 / 功能的多级侧边菜单，点叶子切换右侧内容 | `Accordion` + `data` + `selectedValue` + `onClick` | antd `Menu mode="inline" items` |
| 可收起的侧边导航 | `Accordion enableExpand` + `expanded` / `onExpand` | antd `Layout.Sider collapsed` |
| 表单分组、详情分区的内容折叠 | `Panel`（[Panel.md](Panel.md)） | `Accordion`、antd `Collapse` |
| 组织 / 区域 / 设备等业务数据层级，需要勾选、搜索、懒加载 | `Tree`（[Tree.md](Tree.md)） | `Accordion` |

## 2. 典型场景

- 配置中心 / 管理后台左侧菜单：一级为功能域（带图标），下级为具体页面，点叶子切换右侧内容
- 需要更大工作区时收起导航，收起后点节点图标可重新展开（`enableIconExpand` 默认 true）
- 菜单按权限下发、角标数量会变：无权限项过滤或置 `disabled`，数据变化时用 `keepExpandState` 保留展开层级

## 3. 状态声明

```tsx
// 选中叶子的 value：单个 string，不是 antd 的 selectedKeys 数组；不传时组件默认选第一项（可能是父节点）
const [selectedValue, setSelectedValue] = useState<string>('security-acl');

// 面板是否收起：直接传给 expanded（true = 收起）
const [collapsed, setCollapsed] = useState<boolean>(false);

// 菜单来自接口时另加 menuData state，加载 / 失败 / 空态按 SKILL.md 的异步要求处理
```

## 4. 事件与交互逻辑

```tsx
// onClick(node)：node 为 data 中的原始数据，类型声明是 object，严格模式下先断言
// 父节点由组件自己展开收起，只有叶子才更新选中（demo AccordionBasic.jsx / AccordionMultiLevel.jsx）
const handleMenuClick = (node: object) => {
  const item = node as AccordionItem;
  if (isLeaf(item) && item.value) setSelectedValue(item.value);
};

// onExpand(flag)：flag=true 表示由收起变为展开，写回时取反（demo AccordionDemo.jsx / AccordionIcon.jsx）
<Accordion
  data={menuData}
  selectedValue={selectedValue}
  onClick={handleMenuClick}
  expanded={collapsed}
  onExpand={(flag: boolean) => setCollapsed(!flag)}
/>
```

- **两种形态**：固定导航用 `enableExpand={false}` + `hideIcons`（demo 同时设置）；可收起导航用 `enableExpand` + `expanded` / `onExpand`，一级菜单都配 `icon`。官方 demo 都设了 `hideTitleBar`，页面标题放在导航之外
- `enableMultiOpen` 默认 false：展开一个一级菜单会收起其他一级菜单；需要同时展开多个时设为 true
- ⚠️ 外部按钮直接改 `expanded`、用 `isControlSelectedValue` 做切换前拦截，都没有 demo，已登记待实测，不作为默认写法

## 5. 数据结构

```tsx
// 字段来自 TypeDoc 表 data 描述与官方 demo
interface AccordionItem {
  title: React.ReactNode;        // 显示文字，demo 多为字符串
  value?: string;                // 要被选中的节点必须有唯一 value
  icon?: React.ReactNode;        // 图片 url 或 icon+ 组件元素；可收起导航的一级菜单必配
  activeIcon?: string;           // 选中态图标 url
  tip?: string;                  // 自定义悬浮提示
  content?: React.ReactNode;     // 自定义显示内容，如带数量角标（demo AccordionCustomContent.jsx）
  disabled?: boolean;            // 禁用节点（demo 用布尔值）
  isExpand?: boolean;            // 初始展开；设了 selectedValue 时展开其所在项
  children?: AccordionItem[];    // 子菜单，支持多层
}
```

## 6. 联动说明

- 点叶子 → 更新 `selectedValue` → 右侧内容切换或按选中项请求（带取消标记）；父节点点击只展开收起
- 选中路径 → 派生标题与面包屑：路径映射为 Crumbs 的 `data`（[Crumbs.md](Crumbs.md)），最后一项不传 `url`
- 菜单数据变化（刷新、角标更新）→ `keepExpandState` 保留展开层级；选中项不在新数据中时回退到第一个可选叶子
- 权限 → 无权限菜单从 `data` 过滤，或保留并置 `disabled`（demo AccordionDisabled.jsx）

## 7. 完整代码示例

```tsx
import React, { useMemo, useState } from 'react';
import Accordion from '@nce/eview-react/Accordion';
import Button from '@nce/eview-react/Button';
import { IconPlusIcHuaweiCloudNetwork, IconPlusIcPublicSecurity } from '@nce/icon-plus';  

interface AccordionItem {
  title: string;                 // 本例标题都用字符串，便于拼路径
  value?: string;
  icon?: React.ReactNode | string;
  content?: React.ReactNode;
  disabled?: boolean;
  children?: AccordionItem[];
}

// 菜单数据：真实项目一般来自接口；一级菜单图标用 icon+ 组件（封闭字面量集合，静态 import，见 Icon.md 动态名 recipe）
const buildMenu = (alarmCount: number): AccordionItem[] => [
  {
    title: '网络配置', value: 'network', icon: <IconPlusIcHuaweiCloudNetwork />,
    children: [{ title: '接口管理', value: 'network-interface' }, { title: '路由配置', value: 'network-route' }],
  },
  {
    title: '安全策略', value: 'security', icon: <IconPlusIcPublicSecurity />,
    children: [
      { title: '访问控制', value: 'security-acl' },
      {
        title: '告警规则', value: 'security-alarm',
        // 附加内容的类名沿用官方 data 示例
        content: <div><span>告警规则</span><span className="ev_accordion_content_tips">{alarmCount}</span></div>,
      },
      { title: '审计日志', value: 'security-audit', disabled: true },   // 无权限：保留显示并禁用
    ],
  },
];

const isLeaf = (node: AccordionItem): boolean => !node.children || node.children.length === 0;

// 从一级到目标节点的路径，用于标题与面包屑
const findPath = (items: AccordionItem[], value: string): AccordionItem[] => {
  for (const item of items) {
    if (item.value === value) return [item];
    const sub = item.children ? findPath(item.children, value) : [];
    if (sub.length > 0) return [item, ...sub];
  }
  return [];
};

// 可收起的侧边导航 + 右侧内容区：叶子切换内容，角标更新时保留展开层级
export default function ConfigCenterNav() {
  const [alarmCount, setAlarmCount] = useState<number>(3);
  const [selectedValue, setSelectedValue] = useState<string>('security-acl');
  const [collapsed, setCollapsed] = useState<boolean>(false);   // 传给 expanded：true = 收起

  const menuData = useMemo(() => buildMenu(alarmCount), [alarmCount]);   // data 只在角标变化时重新生成
  const path = findPath(menuData, selectedValue);

  const handleMenuClick = (node: object) => {
    const item = node as AccordionItem;
    if (isLeaf(item) && item.value) {
      setSelectedValue(item.value);
    }
  };

  return (
    <div style={{ display: 'flex', height: 600 }}>
      <Accordion
        data={menuData}
        selectedValue={selectedValue}
        onClick={handleMenuClick}
        hideTitleBar
        enableExpand
        expanded={collapsed}
        onExpand={(flag: boolean) => setCollapsed(!flag)}
        keepExpandState
        style={{ height: '100%' }}
      />
      <main style={{ flex: 1, padding: 24 }}>
        {/* 真实项目中角标由轮询或推送更新 */}
        <Button text="刷新告警数" onClick={() => setAlarmCount((count) => count + 1)} />
        {path.length > 0 ? (
          <section>
            <div>{path.map((node) => node.title).join(' / ')}</div>
            <h3>{path[path.length - 1].title}</h3>
          </section>
        ) : null}
      </main>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd Menu 写法：没有 items / key / label / selectedKeys / openKeys / inlineCollapsed
<Menu mode="inline" items={[{ key: 'acl', label: '访问控制' }]} selectedKeys={[key]} onClick={({ key }) => setKey(key)} />

// ❌ 字段名按 antd 写成 key / label（应为 value / title）
<Accordion data={[{ key: 'acl', label: '访问控制' }]} />

// ❌ selectedValue 传数组（它是单个 string，不是 selectedKeys）
<Accordion data={menuData} selectedValue={['security-acl']} />

// ❌ 按字面理解 expanded / onExpand：expanded={true} 实际是"收起"，flag 需要取反
<Accordion data={menuData} expanded={!collapsed} onExpand={(flag) => setCollapsed(flag)} />

// ❌ 照抄 demo 里的 expand：它不在 API 表中
<Accordion data={menuData} expand={false} />

// ❌ 父节点点击也切换内容：父节点只负责展开收起，业务选中只处理叶子
<Accordion data={menuData} onClick={(node) => setSelectedValue(node.value)} />

// ❌ 当内容折叠面板用（antd Collapse 思路）：content 只是菜单项的显示内容，表单分组用 Panel
<Accordion data={[{ title: '基本信息', value: 'basic', content: <BasicInfoForm /> }]} />
```

## 9. API 速查

> 压缩自 `Accordion/Accordion`，默认值缺失处参照官网 props 表；官方 demo 少用或未用的 props 合并在最后一行；demo 未调用 ref 方法，不列。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `dataItem[]`，**必填** | 菜单数据，字段见 §5 |
| `selectedValue` | `string` | 选中项的 value；不设置则为第一项的 value |
| `onClick` | `(node: object) => void` | 节点点击，`node` 为 data 中的原始数据 |
| `expanded` | `boolean`，默认 `false` | 面板展开状态（遗留问题：**`false` 为展开，`true` 为收起**） |
| `onExpand` | `(flag: boolean) => void` | 展开→收起 `flag=false`，收起→展开 `flag=true` |
| `enableExpand` | `boolean`，默认 `true` | 是否允许展开 / 折叠面板 |
| `enableIconExpand` | `boolean`，默认 `true` | 面板折叠时点击节点图标能否展开面板 |
| `hideIcons` | `boolean`，默认 `false` | 隐藏底部展开收起图标，显示右侧展开收起 dom |
| `hideTitleBar` | `boolean`，默认 `false` | 隐藏标题栏 |
| `enableMultiOpen` | `boolean`，默认 `false` | 允许同时展开多个一级菜单 |
| `keepExpandState` | `boolean`，默认 `false` | data 变更后保留上一次的展开收起状态 |
| 其余 | — | `isControlSelectedValue` 外部控制选中、组件不维护（⚠️ 无 demo）/ `onItemRightClick(event, node)` 右键 / `headerText` · `headerIcon` · `headerIconPosition`（`'top' \| 'left'`）标题栏文字、图标及位置 / `hideHeaderIcon` / `hideTitleTips` / `id` / `className` / `style` |
