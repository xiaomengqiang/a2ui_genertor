# Tab 组件功能逻辑规格（含 TabItem）

> 资料来源：TypeDoc `Tab/Tab`、`Tab/TabItem` + 官网 Tab 页示例。
> ⚠️ 与 Group 类组件相反，**Tab 是 children 驱动**：`<Tab><TabItem title="…">内容</TabItem></Tab>`，没有 `items` / `data` 属性。
> ⚠️ 切换回调叫 **`onClick`**（不是 `onChange`）；`draggable` 默认 **true**，业务页签通常要显式关掉。
> ⚠️ `isAutoClose` 默认 true（"set tab items AutoClose or not"），与业务自己维护页签数组是否冲突，资料未说明 → 已登记待实测。

## 1. 功能定位

Tab 是页面内平级版块切换容器：一级页签 `type="main"`（默认），卡片式二级页签 `type="sub"`；支持四个方向、可关闭、图标、拖拽排序、宽度不足自动收纳、懒加载。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 详情页多版块切换 | `Tab` + `TabItem` | antd `<Tabs items={[...]}>` / `<TabPane>` |
| 卡片式 / 可关闭的工作区页签 | `Tab type="sub"` + `TabItem closable` | 自己拼按钮 |
| 顶部导航切换整页 | 路由 + `Tab` 受控 `selectedIndex` | Tab 内塞整个页面 |
| 表单里的分组 | `Panel` / `Accordion`（第二批） | Tab |

## 2. 事件与交互逻辑

### 切换 —— onClick(index, title, event)

```tsx
<Tab
  selectedIndex={activeIndex}
  draggable={false}                                   // 业务页签一般不需要拖拽
  onClick={(index: number, title: string, event) => {
    setActiveIndex(index);
    if (!loaded.has(index)) {
      fetchSection(index);                            // 首次进入才请求
      setLoaded((prev) => new Set(prev).add(index));
    }
  }}
>
  <TabItem title="概览">…</TabItem>
  <TabItem title="监控">…</TabItem>
</Tab>
```

也可以直接 `lazyLoad` 让组件在激活时才渲染内容（默认首次渲染全部加载）：`<Tab lazyLoad>`。

### 可关闭页签 —— onClose(index, event, title)，业务自己维护数组

```tsx
<Tab
  type="sub"
  selectedIndex={activeIndex}
  draggable={false}
  onClose={(index: number, event, title: string) => {
    setTabs((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((cur) => (cur >= index && cur > 0 ? cur - 1 : cur));   // 关掉当前或前面的页签，下标前移
  }}
>
  {tabs.map((t) => (
    <TabItem key={t.id} title={t.title} closable>
      {t.title} 的内容
    </TabItem>
  ))}
</Tab>
```

#### 动态页签业务模型

```tsx
// Tab 本身不接收数组，由业务 map 成 TabItem
interface WorkTab {
  id: string;        // key，不要用下标当 key（关闭后会错位）
  title: string;
  closable?: boolean;
}
```

### 竖排 / 禁用 / 图标 / 自定义标题

```tsx
import { IconPlusIcPublicHome } from '@nce/icon-plus';
<Tab position="left" style={{ height: 400 }}>
  <TabItem title="基本设置" icon={<IconPlusIcPublicHome />}>…</TabItem>
  <TabItem title="高级设置" disabled>…</TabItem>
  <TabItem title="通知" titleExtraContent={<span className="my-unread">3</span>} itemTip="未读 3 条">…</TabItem>
</Tab>
```

## 3. 联动说明

- 列表行"打开"按钮 → 往 `tabs` 数组 push 新页签并把 `activeIndex` 指到它
- 关闭页签 → 数组移除 + 修正 `selectedIndex`（关掉的是当前或前面的页签时下标减一）
- 表单有未保存修改时关闭页签 → 先弹确认（`MessageDialog`，第二批），确认后再移除
- 页签内的 Table / Form 各自独立状态，切换不重置（默认非 `lazyLoad` 时内容全部保留在 DOM）

## 4. 反面示例

```tsx
// ❌ antd 写法：没有 items / TabPane / activeKey / onChange
<Tabs activeKey={key} items={[{ key: '1', label: '概览' }]} onChange={setKey} />

// ❌ 用 onChange 接切换事件，Tab 的切换回调是 onClick
<Tab onChange={(index) => setActiveIndex(index)} />

// ❌ 忘了 draggable 默认 true，业务页签被用户拖乱顺序
<Tab type="sub">…</Tab>

// ❌ 动态页签用下标当 key，关闭中间页签后内容错位
{tabs.map((t, i) => <TabItem key={i} title={t.title} />)}

// ❌ onClose 只删数组不修正 selectedIndex，关掉最后一个页签后下标越界
onClose={(index) => setTabs((prev) => prev.filter((_, i) => i !== index))}

// ❌ 每次切换都重新请求，没有"已加载"记录
onClick={(index) => { setActiveIndex(index); fetchSection(index); }}
```

## 5. API 速查

> 压缩自 `api/Tab_Tab.md` / `api/Tab_TabItem_md.md`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `selectedIndex` | `number` | 选中页签在 children 中的下标 |
| `onClick` | `(index, title, event) => void` | **切换回调** |
| `onClose` | `(index, event, title) => void` | 关闭回调；注意与 onClick 第二、三参顺序不同 |
| `type` | `'main' \| 'sub'`，默认 `main` | 一级 / 卡片式二级 |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'`，默认 `top` | 页签位置 |
| `draggable` | `boolean`，默认 **`true`** | 可拖拽排序；`ondragEnd(nodeAfterDrag[], event)` 拿新顺序 |
| `lazyLoad` | `boolean`，默认 `false` | 激活时才加载内容 |
| `isUpdateContent` | `boolean`，默认 `false` | 非 lazyLoad 时切换是否更新内容区 |
| `disabled` / `hover` | `boolean`，默认 `false` | 全部禁用 / hover 切换 |
| `isShowCloseBtns` | `boolean`，默认 `false` | 显示"关闭选中 / 其他 / 所有"按钮 |
| `isAutoClose` | `boolean`，默认 `true` | 页签自动关闭（语义待实测） |
| `isCloseByTabIds` / `onBeforeClose(tabIds)` / `onCloseByTabIds(tabIds, buttonIdentify)` | — | 由外部元素批量关闭页签 |
| `onlyHideNone` | `boolean`，默认 `false` | 收纳项是否只显示被隐藏的标题 |
| `headStyle` / `tabContentStyle` / `tabContentClassName` | 样式 | 标题区 / 内容区 |
| `observerWidthChange` / `observerTabItemChange` | `boolean` | 监听宽度变化重渲染 |
| `TabItem.title` | `string` | 标题 |
| `TabItem.closable` / `disabled` | `boolean`，默认 `false` | 可关闭 / 灰化 |
| `TabItem.icon` | `string \| ReactElement` | 图标 |
| `TabItem.titleExtraContent` | `ReactElement` | 标题自定义内容 |
| `TabItem.itemTip` | `string` | 悬浮提示 |
| `TabItem.setEditing` / `tabItemStyle` / `id` | — | 编辑态 / 标题样式 / id |
