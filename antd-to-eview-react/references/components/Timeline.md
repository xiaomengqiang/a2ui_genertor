# Timeline 组件功能逻辑规格（时间线）

> 导入：`import Timeline from '@/shared/Timeline'`（scaffold 手写 antd v6 Timeline 兼容件，零依赖，非 `@nce/eview-react`）。
>
> 本组件是 antd v6 `Timeline` 的零依赖移植（ported from ant-design v6 `components/timeline`，内置 `clsx`/`@rc-component/util`/`@ant-design/icons/LoadingOutlined` 的零依赖替代）。**API 兼容 antd Timeline，迁移时调用点近零改动**——只需把 `import { Timeline } from 'antd'` 改为 `import Timeline from '@/shared/Timeline'`，JSX 与 props 原样保留。

## 1. 功能定位

垂直 / 水平时间线：按顺序展示事件节点（圆点 + 标题 + 内容），支持左右交替、自定义图标 / 颜色、加载态、反向、待处理项。

| 想要的效果 | 用什么 |
|-----------|--------|
| 垂直时间线（默认，节点在左） | `<Timeline items={[...]} />`（`mode` 默认 `start`） |
| 节点在右 | `mode="end"`（antd 旧写法 `mode="right"` 已废弃，等价 `end`） |
| 左右交替 | `mode="alternate"` |
| 水平时间线 | `orientation="horizontal"` |
| 反向展示 | `reverse` |
| 最后一项待处理（loading dot） | `pending="..."` + 可选 `pendingDot={<Icon/>}` |

## 2. 状态声明

```jsx
// items 形态（推荐，与 antd 5+ 一致）
const items = [
  { color: 'green', children: '创建 2024-01-01' },
  { color: 'blue',  children: '审批通过', label: '步骤一' },
  { dot: <IconPlusIcPublicClock iconSize={14} />, children: '自定义节点' },
];
<Timeline items={items} />
```

```jsx
// Timeline.Item 子元素形态（antd 旧写法，仍兼容——props 被收集转 items）
<Timeline>
  <Timeline.Item color="green">创建</Timeline.Item>
  <Timeline.Item color="red">驳回</Timeline.Item>
</Timeline>
```

## 3. API 速查

### Timeline（根）

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `items` | `Item[]` | 时间线数据（推荐）；不传则从 `children`（`Timeline.Item`）派生 |
| `mode` | `'left'` \| `'right'` \| `'alternate'` | 节点位置；`left`/`right` 已废弃，内部映射为 `start`/`end`；默认 `start`（节点在左） |
| `reverse` | `boolean` | 反向排序 |
| `pending` | `ReactNode` | 末尾追加一个待处理项（loading dot + content） |
| `pendingDot` | `ReactNode` | 待处理项的自定义图标（默认 LoadingOutlined） |
| `orientation` | `'vertical'` \| `'horizontal'`，默认 `vertical` | 方向 |
| `variant` | `'outlined'` \| `'filled'`，默认 `outlined` | 圆点视觉：outlined 空心 + 边框 / filled 实心 |
| `titleSpan` | `number` \| `string` | alternate 布局的标题占比（数字 = `/24`，字符串 = 百分比）；仅非 alternate 生效 |
| `className` / `style` / `classNames` / `styles` | — | 同 antd 习惯；`classNames`/`styles` 支持 `root`/`item`/`itemIcon`/`itemHeader`/`itemTitle`/`itemContent`/`itemRail` 等槽位 |

### Item（items 数组元素 / Timeline.Item props）

| 字段 | 说明 |
|------|------|
| `color` | 预设 `'blue'`/`'red'`/`'green'`/`'gray'`；或任意 CSS 色值（hex/rgb/命名色）——自定义色走 `--temp-eview-timeline-dot-color` CSS 变量 |
| `dot` / `icon` | 自定义节点图标（`icon` 是 antd 5+ 名，`dot` 是 4.x 旧名，两者等价） |
| `label` / `title` | 标题（`label` 是 antd 旧名，内部映射为 `title`） |
| `children` / `content` | 内容（`content` 是 v6 名，`children` 是旧名，两者等价） |
| `loading` | `boolean`——该项显示 loading dot + 状态置 `process` |
| `placement` / `position` | 强制该项位置 `'start'`/`'end'`（覆盖 `mode` 推断） |
| `onClick` | 点击回调——挂上后该项 `role="button"` + `tabIndex=0` + Enter/Space 触发 |
| `className` / `style` | 单项样式 |

## 4. 暗色模式

**无需另写暗色 CSS**：组件 CSS 内置 `.dark` 祖先覆盖——尾线色、文字色、预设圆点色随 palette token（`--gray-*`/`--blue-50`/`--red-40`/`--mint-60`）自动翻转。前提：`<html>` 挂 `.dark` 类（由 scaffold 的暗色切换 useEffect 维护，见 umd-to-antd-vite 步骤 3）。每个 `var(--palette, fallback)` 都带 antd 默认 fallback，无 token 系统也能用。

## 5. 迁移要点（antd → @/shared/Timeline）

1. **只改 import**：`import { Timeline } from 'antd'` → `import Timeline from '@/shared/Timeline'`（默认导入）。JSX 与 props 原样保留。
2. **`mode="left"`/`"right"` 无需改**——内部兼容（映射 `start`/`end`）；新代码建议直接写 `start`/`end`。
3. **`Timeline.Item` 子元素形态无需改**——仍兼容。
4. **`color` 自定义色值无需改**——预设色走 className token，自定义色走 CSS 变量，与 antd 行为一致。
5. **暗色无需加 CSS**——随 `.dark` 自动翻转（antd Timeline 靠 `theme.darkAlgorithm`，本组件靠 CSS 变量 + `.dark` 类，迁移时删 antd `ConfigProvider theme.darkAlgorithm` 后暗色仍正常）。
6. **不要**从 `@nce/eview-react` 导入——Timeline 是 scaffold 手写件，eview-react 无 Timeline 导出（`TimeLine` 导出名存在但无 Reference，故手写）。

## 6. 反面示例

```jsx
// ❌ 从 antd 导入（未替换）
import { Timeline } from 'antd';

// ❌ 从 @nce/eview-react 导入（无 Timeline 导出）
import Timeline from '@nce/eview-react/Timeline';

// ✅ 从 scaffold 手写件导入
import Timeline from '@/shared/Timeline';
<Timeline items={items} mode="alternate" />
```
