# Pattern：未覆盖组件的补位（三层判定 + 手写 HTML/JSX 规范）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：官网文档 custom_theme（css var 变量表）、rules（类名前缀 `ev_` 约定）、aui_to_ict（间距 4px 倍数、rem 统一）、component-use（查不到不推断）
>
> 本文不走 9 节模板。它回答的是：页面需要一个本 Skill **没有 Reference** 的组件时，AI 该怎么办。
> 结论先行：**不读 `node_modules` 猜 API，不用 antd 等其他库顶替**；按下面三层顺序处理，第三层用原生 HTML / JSX + 组件库 CSS 变量手写。

## 0. 什么时候读本文

- 设计稿 / 需求里出现了 SKILL.md 组件索引之外的控件（卡片、进度条、时间轴、轮播、穿梭框、键值详情……）
- 用户说"用 eview-react 做"，但某个区块找不到对应 Reference
- 生成结果里准备写 `import X from '@nce/eview-react/X'` 而 `X` 不在 39 个已覆盖组件里

## 1. 三层判定（按顺序，命中即停）

| 层 | 条件 | 做法 | 产出标记 |
|----|------|------|---------|
| **一：已覆盖组件** | 需求能用 39 个已覆盖组件（或其组合）表达 | 读对应 Reference 照规格写；优先用组合替代（见 §2） | 无 |
| **二：工程里已有用法** | 目标工程 `src/` 里已经 `import X from '@nce/eview-react/X'` 并在用 | **只照抄该工程里出现过的 props / 回调 / 数据结构**，不新增任何未出现过的属性；注释标出参考文件 | `// 用法参考：src/xxx/Yyy.tsx` |
| **三：手写补位** | 前两层都不命中 | 用原生 HTML / JSX 自己实现，样式只用 §3 的 CSS 变量；复杂组件只做最小可用版并标 TODO（§5） | `// TODO(eview-react): 建议替换为 <X>，本 Skill 暂无其规格` |

三条硬纪律：

1. **第二层的边界是"工程源码"**，不是 `node_modules`。类型声明里有的 props 不等于业务里验证过；只抄 `src/` 里跑着的用法。
2. **第三层不模仿组件库的 DOM 结构和 `ev_` 类名去"借样式"**。`ev_` 是组件库内部前缀（官网开发规范），业务手写用自己的前缀（如 `app-`），避免被组件库样式权重覆盖或反向污染。
3. **每处手写补位都要在最终回复里向用户列出**：位置、用什么替代的、建议后续换成哪个组件。

## 2. 先想"能不能用已覆盖组件组合出来"

很多"缺组件"其实能组合：

| 需求 | 组合方案 |
|------|---------|
| 确认 / 结果提示 | `MessageDialog`（[MessageDialog.md](../MessageDialog.md)）；区域内轻提示用 `DivMessage` |
| 表单弹窗 / 侧边编辑 | `Dialog`（[Dialog.md](../Dialog.md)）/ `Drawer`（[Drawer.md](../Drawer.md)） |
| 面包屑 / 折叠分组 / 空态 / 加载 | `Crumbs` / `Panel` / `Empty` / `Loading`（均已覆盖） |
| 树 / 树选择 / 树表 / 级联 | `Tree` / `TreeSelect` / `TreeTable` / `Cascader`（均已覆盖） |
| 状态列 / 分组标题 | `Badge status` / `Tag color` / `Divider orientation` |
| 时间点选择 | `Spinner type="time"` 或 `DatePicker type="datetime"` |
| 相对时间范围 | `SelectCard`（近 1 天 / 7 天 / 30 天） |
| 卡片列表的分页 | `Paging`（[Paging.md](../Paging.md)） |
| 帮助说明 / 悬浮提示 | `TipBox` 包裹目标 / `IconButton tipText` |
| 可关闭标签 | `Tag onClick` + 数组移除 |
| 卡片容器 | 第三层手写（§4.1）或 `Panel`（需折叠时） |

## 3. 手写补位的样式规范（只用组件库 CSS 变量）

引入 `aui3_1.css` 后这些变量在全局 `:root` 可用；手写元素**只引用变量，不写死色值**，深色主题切换才能跟随。

### 3.1 颜色

| 用途 | 变量 |
|------|------|
| 品牌 / 选中 / 悬浮 / 按下 | `--colorCommonSelected` `--colorCommonHover` `--colorCommonPressed` |
| 文字：主要 / 次要 / 占位 / 禁用 | `--colorTextPrimary` `--colorTextSecondary` `--colorTextExtra` `--colorTextDisabled` |
| 边框：默认 / 悬浮 / 禁用 | `--colorBorder` `--colorBorderHover` `--colorBorderDisabled` |
| 分割线 | `--colorDivider` |
| 填充：控件底 / 悬浮 / 选中 / 禁用 / 斑马纹 | `--colorControlBG` `--colorFillingHover` `--colorFillingSelected` `--colorBackgroundDisable` `--colorZebra` |
| 背景：页面底 / 白底 / 一级 / 二级 | `--colorBackground` `--colorBasic` `--colorFirstBackground` `--colorBulletFrameBG` |
| 告警：紧急 / 重要 / 次要 / 成功 / 提示 / 关机 | `--colorAlarmUrgent` `--colorAlarmCaution` `--colorAlarmSecondary` `--colorAlarmSuccess` `--colorAlarmOff` `--colorAlarmTips` |
| 遮罩：弹窗 / 全局 loading / 局部 loading | `--colorMask` `--colorGlobalMask` `--colorLocalMask` |
| 阴影：弹层 / 卡片 | `--colorTCShadow` `--colorXLShadow` `--colorKPShadow` |
| 图标：默认 / 禁用 | `--colorIcon` `--colorIconDisabled` |

### 3.2 字号 / 圆角 / 尺寸

| 用途 | 变量 |
|------|------|
| 字号：小 / 中 / 默认 / 大 / 标题 / 大标题 | `--fontSizeSmall`(0.75rem) `--fontSizeMid`(0.875rem) `--fontSize`(1rem) `--fontSizeLarge` `--titleFontSize` `--titleFontSizeLarge` |
| 字重 | `--fontWeight`(400) `--fontWeightActive`(700) |
| 边框宽度 | `--borderSize`(1px) `--borderSizeFocus`(2px) |
| 圆角：小 / 默认 / 大 / 圆 | `--borderRadiusSmall`(2px) `--borderRadius`(4px) `--borderRadiusLarge`(1rem) `--borderRound`(50%) |
| 控件高度：默认 / 大 | `--commonHeight`(2rem) `--commonHeightLarge`(2.5rem) |
| 行高 | `--commonLineHeightSmall` `--commonLineHeightMid` `--commonLineHeight` `--commonLineHeightLarge` |
| 图标尺寸 | `--iconWidth` `--iconHeight`(1rem) |

### 3.3 其他约定

- 间距用 4px 的整数倍（4 / 8 / 12 / 16 / 24 / 32），单位统一 rem，不与 px 混用
- 类名用业务前缀（`app-table` / `app-modal`），不用 `ev_`
- 可点击元素用 `<button type="button">`，不用 `<div onClick>`；弹层加 `role="dialog"` `aria-modal`
- 深色主题用户通常靠切换根节点类名（`aui3_1 aui3_1_dark`）实现，手写元素只要用了变量就会自动跟随

## 4. 常见补位模板

### 4.1 卡片 / 面板区块（Card 未覆盖）

```tsx
function AppCard({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="app-card" style={{ background: 'var(--colorBasic)', border: 'var(--borderSize) solid var(--colorBorder)', borderRadius: 'var(--borderRadius)', boxShadow: 'var(--colorKPShadow)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'var(--commonHeightLarge)', padding: '0 1rem', borderBottom: 'var(--borderSize) solid var(--colorDivider)', fontSize: 'var(--fontSize)', fontWeight: 'var(--fontWeightActive)' }}>
        <span>{title}</span>{extra}
      </header>
      <div style={{ padding: '1rem' }}>{children}</div>
    </section>
  );
}
```

### 4.2 键值详情块（Descriptions 类组件不存在）

```tsx
function KeyValueList({ items, columns = 2 }: { items: Array<{ label: string; value: React.ReactNode }>; columns?: number }) {
  return (
    <dl className="app-kv" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, auto 1fr)`, gap: '0.75rem 1rem', margin: 0, fontSize: 'var(--fontSizeMid)' }}>
      {items.map((it) => (
        <React.Fragment key={it.label}>
          <dt style={{ color: 'var(--colorTextSecondary)', whiteSpace: 'nowrap' }}>{it.label}</dt>
          <dd style={{ margin: 0, color: 'var(--colorTextPrimary)' }}>{it.value ?? '--'}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

### 4.3 简单进度条（ProgressBar 未覆盖）

```tsx
// TODO(eview-react): 建议替换为 ProgressBar，本 Skill 暂无其规格。此处仅支持百分比与三色
function SimpleProgress({ percent, status = 'normal' }: { percent: number; status?: 'normal' | 'success' | 'error' }) {
  const color = status === 'error' ? 'var(--colorAlarmUrgent)' : status === 'success' ? 'var(--colorAlarmSuccess)' : 'var(--colorCommonSelected)';
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="app-progress" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '0.5rem', background: 'var(--colorFillingHover)', borderRadius: 'var(--borderRadiusSmall)', overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: color, transition: 'width .2s' }} />
      </div>
      <span style={{ fontSize: 'var(--fontSizeSmall)', color: 'var(--colorTextSecondary)', minWidth: '2.5rem', textAlign: 'right' }}>{p}%</span>
    </div>
  );
}
```

## 5. 只能做"最小可用版 + TODO"的复杂组件

下面这些手写版与真实组件差距大，**必须**在代码注释和最终回复里同时标出，并建议用户后续补 Reference 或换用真实组件：

| 需求 | 建议的真实组件 | 手写版明确不做的能力 |
|------|--------------|------------------|
| 滚动加载表格 / 树选择器 / 分页树 | `ScrollTable` / `TreeSelector` / `PagingTree` | 无限滚动分页、双栏树选择、树分页懒加载 |
| 穿梭框 | `Transfer` | 双栏穿梭、搜索、全选 |
| 进度 / 时间轴 / 轮播 | `ProgressBar` / `TimeLine` / `Carousel` | 环形进度、节点状态、自动播放 |
| 上传路径浏览 / 十六进制 | `BrowseButton` / `HexField` | 路径校验、格式修正 |
| 弹出菜单 / 下拉菜单 | `PopUpMenu` / `DropDown` | 右键菜单、多级子菜单（`ButtonMenu` 已废弃，勿用） |
| 图表 | `Chart` / `ChartCard` | 一律不手写，直接标 TODO |

注释统一格式：

```tsx
// TODO(eview-react): 建议替换为 ProgressBar，本 Skill 暂无其规格；当前手写版仅支持百分比与三色
```

## 6. 反面示例

```tsx
// ❌ 去 node_modules 里翻类型声明猜 props（第二层只认工程 src/ 里跑着的用法）
import Transfer from '@nce/eview-react/Transfer';
<Transfer dataSource={items} targetKeys={keys} />   // 没有 Reference、工程里也没用过 → 不能写

// ❌ 用 antd 顶替缺失组件
import { Transfer } from 'antd';

// ❌ 已覆盖的组件还去手写（表格 / 树 / 抽屉 / 面包屑 / 空态 / 加载都有 Reference）
function MyTree() { … }   // 应直接用 Tree

// ❌ 手写时写死色值、px 与 rem 混用
<div style={{ color: '#191919', borderBottom: '1px solid #ddd', padding: '10px' }} />

// ❌ 借组件库的类名"蹭样式"
<div className="ev_table ev_table-row" />

// ❌ 手写了复杂组件却不标 TODO、不告知用户
function MyProgress() { … }   // 少了 // TODO(eview-react): …

// ❌ 用 <div onClick> 做按钮，键盘不可达
<div onClick={confirm}>确定</div>
```
