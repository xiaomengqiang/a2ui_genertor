# Loading 组件功能逻辑规格（`Loader` 是同一组件的别名导出）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Loading/Loading`；官网组件页 Loader（目录 Loading）及示例 `GlobalLoadingExample.jsx` / `LocalLoadingExample.jsx` / `MicroLoadingExample.jsx` / `MicroIconExample.jsx`；源码 `Loader/index.ts`（`import Loader from '../Loading'` 再导出）
>
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

## 2. 典型场景

- 页面首屏：`global` 直到关键数据返回，超时后关闭并显示错误
- 卡片 / 面板区域刷新：`local` 只盖住该区域，其他区域可操作
- 表单提交按钮旁：`micro` + `desc="提交中"`
- 表格内加载：直接用 `Table enableLoading`，不叠 Loading

## 3. 状态声明

```tsx
const [pageLoading, setPageLoading] = useState<boolean>(true);     // global
const [panelLoading, setPanelLoading] = useState<boolean>(false);  // local，按区域各自一个
```

## 4. 事件与交互逻辑

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

// 自定义图标（demo MicroIconExample），默认用 icon+ 组件
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

## 5. 数据结构

```tsx
type LoadingType = 'global' | 'local' | 'micro';
// 多区域各自的加载态
interface LoadingMap { [area: string]: boolean; }
```

## 6. 联动说明

- 请求开始 `true` → `finally` 置 `false`；失败要给出错误提示而不是停在加载
- 首屏 `global` 与局部 `local` 不同时开；首屏结束后再由各区域自己管
- 加载期间禁用相关按钮（`disabled`），防止重复触发
- 长时间加载（> 10s）要有超时兜底：关掉 Loading、显示重试

## 7. 完整代码示例

```tsx
import React, { useEffect, useState } from 'react';
import Loading from '@nce/eview-react/Loading';
import Button from '@nce/eview-react/Button';

interface Summary { devices: number; alarms: number; }

// 概览页：首屏 global；两个卡片各自 local 刷新；带超时兜底
export default function OverviewPage() {
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [alarmLoading, setAlarmLoading] = useState<boolean>(false);
  const [alarms, setAlarms] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const withTimeout = <T,>(p: Promise<T>, ms = 10000): Promise<T> =>
    Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('请求超时')), ms))]);

  useEffect(() => {
    (async () => {
      try {
        const s = await withTimeout(new Promise<Summary>((resolve) => setTimeout(() => resolve({ devices: 128, alarms: 3 }), 400)));   // 真实项目替换为已有 Service
        setSummary(s);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setPageLoading(false);
      }
    })();
  }, []);

  const refreshAlarms = async () => {
    setAlarmLoading(true);
    try {
      const list = await withTimeout(new Promise<string[]>((resolve) => setTimeout(() => resolve(['端口 down', 'CPU 85%']), 500)));
      setAlarms(list);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAlarmLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Loading type="global" isOpen={pageLoading} />
      {error ? <div className="app-error" style={{ marginBottom: 12 }}>{error}<Button status="text" text="重试" onClick={() => window.location.reload()} /></div> : null}

      <div style={{ display: 'flex', gap: 16 }}>
        <section className="app-stat-card" style={{ flex: 1, padding: 16 }}>
          <div>设备总数：{summary?.devices ?? '-'}</div>
        </section>

        <section className="app-stat-card" style={{ flex: 1, position: 'relative', minHeight: 120, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>活动告警 {summary?.alarms ?? '-'}</span>
            <Button size="small" text="刷新" disabled={alarmLoading} onClick={refreshAlarms} />
          </div>
          {alarms.map((a) => <div key={a} style={{ padding: '4px 0' }}>{a}</div>)}
          <Loading type="local" isOpen={alarmLoading} />      {/* 只盖住本卡片 */}
        </section>
      </div>
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `Loading/Loading`（`Loader` 同）。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `isOpen` | `boolean`，默认 `false` | 显隐 |
| `type` | `'global' \| 'local' \| 'micro'`，默认 `global` | 全页 / 局部（父容器 relative）/ 微型 |
| `desc` | `string` | 说明文字 |
| `iconUrl` | `string \| ReactElement` | 自定义图标，默认用 icon+ 组件（表注"必填"，demo 不传也可用默认图标） |
| `textClassName` | `string` | 说明文字样式 |
| `id` / `className` / `style` | — | 最外层（局部遮罩常需 `zIndex`） |
