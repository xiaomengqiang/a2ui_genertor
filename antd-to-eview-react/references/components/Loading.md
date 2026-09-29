# Loading 组件功能逻辑规格（`Loader` 是同一组件的别名导出）

> 资料来源：TypeDoc `Loading/Loading` + 官网 Loader 页示例。
> ⚠️ `Loader` 与 `Loading` 是**同一个组件**（Loader 只是再导出），demo 全部 `import Loader from 'eview-react/Loader'`；本文按 `Loading` 写，两者任选其一即可，不要同时用两个名字。
> ⚠️ 显隐是 **`isOpen`**；`type="local"` 覆盖的是**最近的 `position: relative` 父容器**（demo 给外层 div 加了 `position: 'relative'`）。
> ⚠️ 不是数字微调器 —— 那是 `Spinner`（[Spinner.md](Spinner.md)）。

## 1. 功能定位

Loading 是加载动效：`global` 全页遮罩、`local` 覆盖某个区域、`micro` 控件内的小圈，可带说明文字与自定义图标。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 整页初始化 / 提交中 | `Loading type="global"` | antd `Spin fullscreen` |
| 表格 / 卡片 / 面板局部加载 | `Loading type="local"`（父容器 `position: relative`）；表格优先用 `Table enableLoading` | 自己写遮罩 |
| 按钮 / 输入框旁的小圈 | `Loading type="micro"` + `desc` | Button 的 loading（不存在） |
| 数据为空 | `Empty`（[Empty.md](Empty.md)） | Loading 一直转 |

## 2. 事件与交互逻辑

无事件，纯受控显隐：

```tsx
import { IconPlusIcPublicLoading } from '@nce/icon-plus';
// 全局
<Loading type="global" isOpen={pageLoading} />

// 局部：父容器必须 position: relative
<div style={{ position: 'relative', minHeight: 200 }}>
  <PanelContent />
  <Loading type="local" isOpen={panelLoading} style={{ zIndex: 9998 }} />
</div>

// 微型 + 说明
<Loading type="micro" isOpen={submitting} desc="提交中" />

// 自定义图标（默认用 icon+ 组件）
<Loading type="micro" isOpen iconUrl={<IconPlusIcPublicLoading />} desc="加载说明文字" />
```

请求骨架：

```tsx
const load = async () => {
  setPanelLoading(true);
  try { setData(await api.get()); }
  catch (e) { notify('error', '加载失败'); }
  finally { setPanelLoading(false); }            // 一定在 finally 关，避免失败后一直转
};
```

## 3. 联动说明

- 请求开始 `true` → `finally` 置 `false`；失败要给出错误提示而不是停在加载
- 首屏 `global` 与局部 `local` 不同时开；首屏结束后再由各区域自己管
- 长时间加载（> 10s）要有超时兜底：关掉 Loading、显示重试

## 4. 反面示例

```tsx
// ❌ antd 习惯：没有 Spin / spinning / tip / fullscreen
<Spin spinning={loading} tip="加载中"><Table /></Spin>

// ❌ 把 Spinner 当 loading（Spinner 是数字微调器）
{loading ? <Spinner /> : null}

// ❌ local 的父容器没有 position: relative，遮罩盖到整页 / 位置错乱
<div><Table /><Loading type="local" isOpen /></div>

// ❌ 只在成功分支关 Loading，失败后一直转
try { setData(await api.get()); setLoading(false); } catch (e) { showError(e); }

// ❌ 同时用 Loader 和 Loading 两个名字（是同一组件）
import Loader from '@nce/eview-react/Loader'; import Loading from '@nce/eview-react/Loading';
```

## 5. API 速查

> 压缩自 `Loading/Loading`（`Loader` 同）。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `isOpen` | `boolean`，默认 `false` | 显隐 |
| `type` | `'global' \| 'local' \| 'micro'`，默认 `global` | 全页 / 局部（父容器 relative）/ 微型 |
| `desc` | `string` | 说明文字 |
| `iconUrl` | `string \| ReactElement` | 自定义图标，默认用 icon+ 组件（表注"必填"，demo 不传也可用默认图标） |
| `textClassName` | `string` | 说明文字样式 |
| `id` / `className` / `style` | — | 最外层（局部遮罩常需 `zIndex`） |
