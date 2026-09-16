# Pattern：未覆盖组件的补位（三层判定 + 手写 HTML/JSX 规范）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：官网文档 rules（类名前缀 `ev_` 约定）、component-use（查不到不推断）
>
> 本文不走 9 节模板。它回答的是：页面需要一个本 Skill **没有 Reference** 的组件时，AI 该怎么办。
> **不读 `node_modules` 猜 API，不用 antd 等其他库顶替**；按下面三层顺序处理，第三层用原生 HTML / JSX 手写并接入业务项目样式。

## 0. 什么时候读本文

- 设计稿 / 需求里出现了 SKILL.md 组件索引之外的控件（卡片、进度条、时间轴、轮播、穿梭框、键值详情……）
- 用户说"用 eview-react 做"，但某个区块找不到对应 Reference
- 生成结果里准备写 `import X from '@nce/eview-react/X'` 而 `X` 不在 39 个已覆盖组件里

## 1. 三层判定（按顺序，命中即停）

| 层 | 条件 | 做法 | 产出标记 |
|----|------|------|---------|
| **一：已覆盖组件** | 需求能用 39 个已覆盖组件（或其组合）表达 | 读对应 Reference 照规格写；优先用组合替代（见 §2） | 无 |
| **二：工程里已有用法** | 目标工程 `src/` 里已经 `import X from '@nce/eview-react/X'` 并在用 | **只照抄该工程里出现过的 props / 回调 / 数据结构**，不新增任何未出现过的属性；注释标出参考文件 | `// 用法参考：src/xxx/Yyy.tsx` |
| **三：手写补位** | 前两层都不命中 | 用原生 HTML / JSX 自己实现，按 §3 接入业务项目样式；复杂组件只做最小可用版并标 TODO（§5） | `// TODO(eview-react): 建议替换为 <X>，本 Skill 暂无其规格` |

三条硬纪律：

1. **第二层的边界是"工程源码"**，不是 `node_modules`。类型声明里有的 props 不等于业务里验证过；只抄 `src/` 里跑着的用法。
2. **第三层不模仿组件库的 DOM 结构和 `ev_` 类名去"借样式"**。`ev_` 是组件库内部前缀（官网开发规范），业务手写用自己的前缀（如 `app-`），避免被组件库样式权重覆盖或反向污染。
3. **每处手写补位都要在最终回复里向用户列出**：位置、用什么替代的、建议后续换成哪个组件。

### 第二层导入核对：已核验导出名

以下 87 个名字来自官方示例入口 `demos/index.js`（仅记录来源，不随 Skill 打包）。清单只证明导出名，**不授权猜测其 props 或回调**；仍须满足工程 `src/` 已有用法的条件：

`Accordion Anchor Badge BrowseButton Button ButtonGroup ButtonMenu Card CardGrid Carousel Cascader CategoryInput CategorySearch Checkbox CheckboxGroup Col ConfigProvider Crumbs DatePicker Dialog Divider DivMessage DoubleSelect DragInput Drawer DropDown Empty FileUpload Form FormMessage GridLayout HelpTip HexField Icon IconButton IconButtonGroup InputSelect IPInput JList LabelField Layout LinkField Loader Loading Menu MessageDialog MultipleSelect PageMessage Paging PagingTree Panel Popup PopUpMenu ProgressBar Radio RadioGroup Rating Row ScrollBar ScrollTable SearchInput Select SelectCard Shade Spinner Split Steps Switch Tab TabItem Table Tag TextArea TextButton TextField TimeLine TimePicker TimeRangeSelector TimescaleAxis TipBox Toggle Tree TreeDataEngine TreeSelect TreeSelector TreeTable Wizards`

不在清单中的 `Upload` / `Tabs` / `Input` / `Modal` / `Option` / `Step` 等不能作为本包组件导入；表单子项写 `Form.Item`。工程没有可核验用法时继续第三层。

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

## 3. 手写补位的接入边界

- 复用目标项目的业务样式；本 Skill 只说明组件选择、结构与交互，不定义颜色、字号、间距或主题映射。
- 类名用业务前缀（`app-table` / `app-modal`），不用 `ev_`。
- 操作按钮用 `<button type="button">`，不用 `<div onClick>`；模态弹层加 `role="dialog"` `aria-modal`。
- 下方模板中的 `app-` 类是业务样式挂载位置，由目标项目实现；交付时按页面需求补全样式。

## 4. 常见补位模板

### 4.1 卡片 / 面板区块（Card 未覆盖）

```tsx
function AppCard({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="app-card">
      <header className="app-card-header">
        <span>{title}</span>{extra}
      </header>
      <div className="app-card-body">{children}</div>
    </section>
  );
}
```

### 4.2 键值详情块（Descriptions 类组件不存在）

```tsx
function KeyValueList({ items, columns = 2 }: { items: Array<{ label: string; value: React.ReactNode }>; columns?: number }) {
  return (
    <dl className="app-kv" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, auto 1fr)` }}>
      {items.map((it) => (
        <React.Fragment key={it.label}>
          <dt className="app-kv-label">{it.label}</dt>
          <dd className="app-kv-value">{it.value ?? '--'}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

### 4.3 简单进度条（ProgressBar 未覆盖）

```tsx
// TODO(eview-react): 建议替换为 ProgressBar，本 Skill 暂无其规格。此处仅支持百分比与状态展示
function SimpleProgress({ percent, status = 'normal' }: { percent: number; status?: 'normal' | 'success' | 'error' }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="app-progress" data-status={status} role="progressbar" aria-label="执行进度" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      <div className="app-progress-track">
        <div className="app-progress-fill" style={{ width: `${p}%` }} />
      </div>
      <span className="app-progress-value">{p}%</span>
    </div>
  );
}
```

## 5. 只能做"最小可用版 + TODO"的复杂组件

下面这些手写版与真实组件差距大，**必须**在代码注释和最终回复里同时标出，并建议用户后续补 Reference 或换用真实组件；没有已核验导出名时只说明缺少规格，不能虚构替换组件：

| 需求 | 建议的真实组件 | 手写版明确不做的能力 |
|------|--------------|------------------|
| 滚动加载表格 / 树选择器 / 分页树 | `ScrollTable` / `TreeSelector` / `PagingTree` | 无限滚动分页、双栏树选择、树分页懒加载 |
| 穿梭框 | 暂无已核验导出；补规格后确定 | 双栏穿梭、搜索、全选 |
| 进度 / 时间轴 / 轮播 | `ProgressBar` / `TimeLine` / `Carousel` | 环形进度、节点状态、自动播放 |
| 上传路径浏览 / 十六进制 | `BrowseButton` / `HexField` | 路径校验、格式修正 |
| 弹出菜单 / 下拉菜单 | `PopUpMenu` / `DropDown` | 右键菜单、多级子菜单（`ButtonMenu` 已废弃，勿用） |
| 图表 | 暂无已核验导出；补规格后确定 | 一律不手写，直接标 TODO |

注释统一格式：

```tsx
// TODO(eview-react): 建议替换为 ProgressBar，本 Skill 暂无其规格；当前手写版仅支持百分比与状态展示
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

// ❌ 借组件库的类名"蹭样式"
<div className="ev_table ev_table-row" />

// ❌ 手写了复杂组件却不标 TODO、不告知用户
function MyProgress() { … }   // 少了 // TODO(eview-react): …

// ❌ 用 <div onClick> 做按钮，键盘不可达
<div onClick={confirm}>确定</div>
```
