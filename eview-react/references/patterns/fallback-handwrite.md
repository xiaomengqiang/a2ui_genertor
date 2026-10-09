# Pattern：未覆盖组件的补位（三层判定 + 手写 HTML/JSX 规范）

> 本文不走 9 节模板。它回答的是：页面需要一个本 Skill **没有 Reference** 的组件时，AI 该怎么办。
> **允许只读目标工程已安装包的相关 `.d.ts` 核验 API，不仅凭声明新增未验证用法，不用 antd 等其他库顶替**；按下面三层顺序处理，第三层用原生 HTML / JSX 手写并接入业务项目样式。

## 0. 什么时候读本文

- 设计稿 / 需求里出现了 SKILL.md 组件索引之外的控件（卡片、进度条、时间轴、轮播、穿梭框、键值详情……）
- 用户说"用 eview-react 做"，但某个区块找不到对应 Reference
- 生成结果里准备写 `import X from '@nce/eview-react/X'` 而 `X` 不在 48 个已覆盖组件里

## 1. 三层判定（按顺序，命中即停）

| 层 | 条件 | 做法 | 产出标记 |
|----|------|------|---------|
| **一：已覆盖组件** | 需求能用 48 个已覆盖组件（或其组合）表达 | 读对应 Reference 照规格写；优先用组合替代（见 §2） | 无 |
| **二：工程里已有用法** | 目标工程 `src/` 里已经 `import X from '@nce/eview-react/X'` 并在用 | **只照抄该工程里出现过的 props / 回调 / 数据结构**，不新增任何未出现过的属性；注释标出参考文件 | `// 用法参考：src/xxx/Yyy.tsx` |
| **三：手写补位** | 前两层都不命中 | 用原生 HTML / JSX 自己实现，按 §3 接入业务项目样式；复杂组件只做最小可用版并标 TODO（§5） | `// TODO(eview-react): 建议替换为 <X>，本 Skill 暂无其规格` |

三条硬纪律：

1. **第二层的用法依据仍是工程 `src/` 中已有代码**。允许只读 `node_modules` 内已安装组件包的相关 `.d.ts`，核对导出、props、回调和 ref 类型，不修改依赖。声明中存在不等于运行行为已验证，不能仅凭声明扩展工程未用过的能力；与 Reference 或现有代码冲突时核对目标版本并记录差异。
2. **第三层不模仿组件库的 DOM 结构和 `ev_` 类名去"借样式"**。`ev_` 是组件库内部前缀（官网开发规范），业务手写用自己的前缀（如 `app-`），避免被组件库样式权重覆盖或反向污染。
3. **每处手写补位都要在最终回复里向用户列出**：位置、用什么替代的、建议后续换成哪个组件。

### 第二层导入核对：历史入口与版本差异

以下 87 个名字是旧资料的入口快照，**不能据此认定目标发布包都支持**；当前核验的 3.10.36 源码线已有命名和可用性差异。先按下方差异与目标包声明核对导出，未覆盖组件仍须满足工程 `src/` 已有用法的条件：

`Accordion Anchor Badge BrowseButton Button ButtonGroup ButtonMenu Card CardGrid Carousel Cascader CategoryInput CategorySearch Checkbox CheckboxGroup Col ConfigProvider Crumbs DatePicker Dialog Divider DivMessage DoubleSelect DragInput Drawer DropDown Empty FileUpload Form FormMessage GridLayout HelpTip HexField Icon IconButton IconButtonGroup InputSelect IPInput JList LabelField Layout LinkField Loader Loading Menu MessageDialog MultipleSelect PageMessage Paging PagingTree Panel Popup PopUpMenu ProgressBar Radio RadioGroup Rating Row ScrollBar ScrollTable SearchInput Select SelectCard Shade Spinner Split Steps Switch Tab TabItem Table Tag TextArea TextButton TextField TimeLine TimePicker TimeRangeSelector TimescaleAxis TipBox Toggle Tree TreeDataEngine TreeSelect TreeSelector TreeTable Wizards`

另有 [ColorPicker](../ColorPicker.md) 已覆盖子路径默认导入 `@nce/eview-react/ColorPicker`，不把它当作已核验的根命名导出。

3.10 源码线的明确差异：**没有 Cascader；时间组件根名为 TimeSelector，不是 TimePicker；根名仍为 SelectCard / DragInput，没有 Segmented / Slider**。时间选择按 [TimePicker](../TimePicker.md) 用 `import { TimeSelector as TimePicker } from '@nce/eview-react'`。发布包 **3.10.28** 已核对 Segmented / Slider / TimePicker / Transfer 的直接子路径均可默认导入；入口确认不等于 Transfer 的 API 已覆盖，仍按未覆盖组件流程处理。Cascader 在 3.10.28 包与核验的 4.0.607 + 15 源码中也不存在；其他版本仅在目标包和工程已有用法均确认后复用，否则用联动 Select 组合。

不在清单中的 `Upload` / `Tabs` / `Input` / `Modal` / `Option` / `Step` 等不能作为本包组件导入；表单子项写 `Form.Item`。工程没有可核验用法时继续第三层。

## 2. 先想"能不能用已覆盖组件组合出来"

很多"缺组件"其实能组合：

| 需求 | 组合方案 |
|------|---------|
| 确认 / 结果提示 | `MessageDialog`（[MessageDialog.md](../MessageDialog.md)）；区域内轻提示用 `DivMessage` |
| 表单弹窗 / 侧边编辑 | `Dialog`（[Dialog.md](../Dialog.md)）/ `Drawer`（[Drawer.md](../Drawer.md)） |
| 面包屑 / 折叠分组 / 空态 / 加载 | `Crumbs` / `Panel` / `Empty` / `Loading`（均已覆盖） |
| 侧边多级导航菜单 | `Accordion`（[Accordion.md](../Accordion.md)）；内容折叠仍用 `Panel` |
| 树 / 树选择 / 树表 | `Tree` / `TreeSelect` / `TreeTable`（按各自 Reference） |
| 省市区等逐级选择 | 联动 `Select`；[Cascader](../Cascader.md) 仅用于已确认提供该组件的其他版本 |
| 状态列 / 分组标题 | `Badge status` / `Tag color` / `Divider orientation` |
| 时间点选择 | [TimePicker](../TimePicker.md) 选择时分秒；需日期时用 [DatePicker](../DatePicker.md)，步进输入用 [Spinner](../Spinner.md) |
| 相对时间范围 | `SelectCard`（近 1 天 / 7 天 / 30 天） |
| 卡片列表的分页 | `Paging`（[Paging.md](../Paging.md)） |
| 帮助说明 / 悬浮提示 | `TipBox` 包裹目标 / `IconButton tipText` |
| 可关闭标签 | `Tag onClick` + 数组移除 |
| 一级 / 多级操作菜单 | [DropDown](../DropDown.md) / [PopUpMenu](../PopUpMenu.md)，按层级与事件契约选择 |
| 任务进度 / 执行记录 | [ProgressBar](../ProgressBar.md) / [TimeLine](../TimeLine.md) |
| 内容轮播 / 配色选择 | [Carousel](../Carousel.md) / [ColorPicker](../ColorPicker.md) |
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

## 5. 只能做"最小可用版 + TODO"的复杂组件

下面这些手写版与真实组件差距大，**必须**在代码注释和最终回复里同时标出，并建议用户后续补 Reference 或换用真实组件；没有已核验导出名时只说明缺少规格，不能虚构替换组件：

| 需求 | 建议的真实组件 | 手写版明确不做的能力 |
|------|--------------|------------------|
| 滚动加载表格 / 树选择器 / 分页树 | `ScrollTable` / `TreeSelector` / `PagingTree` | 无限滚动分页、双栏树选择、树分页懒加载 |
| 穿梭框 | `Transfer`：3.10.28 已确认子路径默认导出，API 尚未覆盖；按三层流程处理 | 双栏穿梭、搜索、全选 |
| 上传路径浏览 / 十六进制 | `BrowseButton` / `HexField` | 路径校验、格式修正 |
| 图表 | 暂无已核验导出；补规格后确定 | 一律不手写，直接标 TODO |

注释统一格式：

```tsx
// TODO(eview-react): 建议替换为 ScrollTable，本 Skill 暂无其规格；当前仅支持普通分页，不支持无限滚动
```

## 6. 反面示例

```tsx
// ❌ 仅凭类型声明就新增未覆盖用法；只读 .d.ts 核验已有用法是允许的
import Transfer from '@nce/eview-react/Transfer';
<Transfer dataSource={items} targetKeys={keys} />   // 没有 Reference、工程里也没用过 → 不能写

// ❌ 用 antd 顶替缺失组件
import { Transfer } from 'antd';

// ❌ 已覆盖的组件还去手写（表格 / 树 / 抽屉 / 面包屑 / 空态 / 加载都有 Reference）
function MyTree() { … }   // 应直接用 Tree

// ❌ 借组件库的类名"蹭样式"
<div className="ev_table ev_table-row" />

// ❌ 手写了复杂组件却不标 TODO、不告知用户
function MyScrollTable() { … }   // 少了 // TODO(eview-react): …

// ❌ 用 <div onClick> 做按钮，键盘不可达
<div onClick={confirm}>确定</div>
```
