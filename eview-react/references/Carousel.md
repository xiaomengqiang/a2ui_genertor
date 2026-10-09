# Carousel 组件功能逻辑规格（含 CarouselItem）

> ⚠️ 轮播内容通过 **children** 传入，没有 `items` / `data`；自动播放间隔是 `autoplayInterval`，切换完成回调是 `onChange(index)`。
> ⚠️ `onChange` / `onClick` 给的是从 0 开始的**位置索引**，不是 `CarouselItem.itemKey`。`activeKey` 配合 `itemKey` 使用，不把业务 ID 与索引混用。
> ⚠️ `activeKey` 是半受控：初始值和外部变更可定位，内部切换不会回写它；children 变化会先重置到第 0 项。默认用内部切换 + `onChange` 记录位置，没有已验证的 ref 调用范式，不套用其他库的 `goTo()`。
> 本文行为以 R26.0-NCE 3.10.36+6 源码核验为依据；其他版本仅采用明确核对过的结论，不视为已在目标工程运行通过，见[版本边界](patterns/project-setup.md)。

## 1. 功能定位

Carousel 在同一区域轮播图片、公告或其他同类内容，支持自动播放、指示器、箭头与垂直切换。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 公告 / 图片轮播 | `Carousel` + children | antd 的 `items` / `dots` / `afterChange` |
| 指定初始项 / 外部切换业务项 | `Carousel activeKey` + `CarouselItem itemKey` | 把 React `key` 当 `itemKey` |
| 工作区页签 | [Tab](Tab.md) | 轮播切换业务表单 |
| 分步填写 | [Steps](Steps.md) | 让自动播放推进流程 |

## 2. 典型场景

- PC 首页公告：按固定间隔播放，提供暂停 / 继续按钮与当前条数。
- 产品介绍：children 内放图片、标题与摘要，所有项保持统一高度。
- 垂直信息栏：`axis="vertical"`，容器给足可见高度。
- 单条内容：关闭自动播放、箭头和指示器；没有内容时显示空态。

## 3. 状态声明

```tsx
const [index, setIndex] = useState(0);      // onChange 返回的位置，用于旁边的说明
const [paused, setPaused] = useState(false);
const canPlay = items.length > 1 && !paused;
```

`index` 是业务观察值，不默认回传 `activeKey={index}`；自定义 `itemKey` 时两者含义可能不同。

## 4. 事件与交互逻辑

### 自动播放与切换通知

```tsx
<Carousel
  autoplay={canPlay}
  autoplayInterval={5000}
  transformTime={350}
  repeat
  onChange={(nextIndex: number) => setIndex(nextIndex)}
>
  {items.map((item) => <div key={item.id}>{item.title}</div>)}
</Carousel>
```

- `onChange(index)` 用于更新计数、标题等旁边内容；索引越界时忽略，避免数据刷新后的旧回调访问不存在的项。
- `onClick(index)` 是幻灯片点击切换的通知，API 描述不足以保证它等价于“打开详情”。需要打开详情时，在 slide 内放明确的按钮或链接并绑定业务 ID。
- 纵向切换设 `axis="vertical"`；示例仅设置 axis 即可，不要求同时改 `direction`。方向细节和组合效果应在目标版本确认。
- 暂停按钮只改变 `autoplay`，不删除当前内容；动画中切换暂停、鼠标或焦点进入时的内部暂停策略未实测，不假定组件自动处理。

### 初始定位与外部切换

```tsx
import Carousel, { CarouselItem } from '@nce/eview-react/Carousel';

<Carousel activeKey="security">
  <CarouselItem itemKey="network"><div>网络公告</div></CarouselItem>
  <CarouselItem itemKey="security"><div>安全公告</div></CarouselItem>
</Carousel>
```

`CarouselItem` 的属性只有 `itemKey` 与 `children`；样式放内部内容上。它从 `@nce/eview-react/Carousel` 命名导入，不发明独立的 `/CarouselItem` 默认导入路径。

只有传入非 undefined 的 `activeKey` 才建立 itemKey 匹配；父组件更新为已存在的键会跳转，未知键不移动。自动播放、箭头、指示器和拖拽只改内部位置并通知 `onChange(index)`；需要父级同步时，将索引映射回该项的 itemKey 再保存，不能直接把索引当业务键。

## 5. 数据结构

```tsx
interface Slide {
  id: string;                 // 唯一、稳定的业务 ID，用作 React key
  title: string;
  summary: string;
}
```

图片属于 children 内容：使用项目已有资源，并给 `<img>` 写业务含义明确的 `alt`；`src` / `alt` 不传给 Carousel。

## 6. 联动说明

- children 改变会先回第 0 项并触发 `onChange(0)`、重启自动播放，再按 activeKey 匹配；原键仍存在则跳回，已删除则保留第 0 项。不要假定刷新能无条件保留位置。
- 只更新计数或暂停状态时保持 children 稳定；可用 useMemo 缓存内容，父级也应保持未变化的列表和回调引用稳定，避免无关重渲染触发重置。
- loading / error / empty 在轮播外处理，不把空数组作为仍可自动播放的轮播。
- 当前条数用 `index + 1` 展示，但访问数组仍用 `index`；业务跳转使用对应项的 ID。
- 默认按 PC 布局设置统一内容高度，避免轮播时页面跳动；窗口变窄时容器宽度跟随桌面内容区。

## 7. 完整代码示例

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import Carousel from '@nce/eview-react/Carousel';
import Button from '@nce/eview-react/Button';

interface Slide { id: string; title: string; summary: string; }
interface Props {
  items: Slide[];
  loading: boolean;
  error?: string;
  onRetry: () => void;
  onOpen: (id: string) => void;
}

export default function AnnouncementCarousel({ items, loading, error, onRetry, onOpen }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { setIndex(0); }, [items, loading, error]);
  const slides = useMemo(() => items.map((item) => (
    <article key={item.id} style={{ height: 216, boxSizing: 'border-box', padding: 32 }}>
      <h3>{item.title}</h3><p>{item.summary}</p>
      <Button status="text" text="查看详情" onClick={() => onOpen(item.id)} />
    </article>
  )), [items, onOpen]);
  const handleChange = (nextIndex: number) => {
    if (Number.isInteger(nextIndex) && nextIndex >= 0 && nextIndex < items.length) {
      setIndex(nextIndex);
    }
  };

  if (loading) return <p role="status">公告加载中…</p>;
  if (error) return <div role="alert">{error}<Button text="重试" onClick={onRetry} /></div>;
  if (!items.length) return <p>暂无公告</p>;
  const many = items.length > 1;
  const shownIndex = Math.min(index, items.length - 1);

  return (
    <section className="app-announcement" style={{ width: 840, maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>产品公告</h2>
        <Button
          text={paused ? '继续播放' : '暂停播放'}
          disabled={!many}
          onClick={() => setPaused((value) => !value)}
        />
      </div>
      <Carousel
        autoplay={many && !paused}
        autoplayInterval={5000}
        repeat
        indicator={many}
        hasArrows={many}
        allowTouch={false}
        onChange={handleChange}
      >
        {slides}
      </Carousel>
      <p>{shownIndex + 1} / {items.length} · {items[shownIndex].title}</p>
    </section>
  );
}
```

数据请求、失败重试与详情路由由已有 Service / 页面提供；示例不建立第二套计时器驱动轮播。

## 8. 反面示例

```tsx
// ❌ antd 属性名：间隔、指示器与回调分别应为 autoplayInterval / indicator / onChange
<Carousel autoplaySpeed={5000} dots afterChange={setIndex} />

// ❌ 其他库的数据驱动写法：内容应放在 children
<Carousel items={items} data={items} />

// ❌ 把 activeKey 当数组索引，实际 itemKey 是业务字符串
<Carousel activeKey={1}><CarouselItem itemKey="security">安全</CarouselItem></Carousel>

// ❌ 从空数组或过期索引直接读取标题
<h3>{items[index].title}</h3>
```

## 9. API 速查

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `children` | `ReactNode` | 幻灯片内容，可直接放元素或 CarouselItem |
| `autoplay` | `boolean` | 自动播放开关；资料未注明默认值，按场景显式设置 |
| `autoplayInterval` | `number`，默认 `3000` | 播放间隔，毫秒 |
| `transformTime` | `number`，默认 `350` | 动画时间，毫秒 |
| `axis` | `'horizontal' \| 'vertical'`，默认 `horizontal` | 水平 / 垂直切换 |
| `direction` | `'top' \| 'right' \| 'bottom' \| 'left'`，默认 `right` | 动画方向；与 axis 的组合按目标版本验证 |
| `indicator` / `hasArrows` | `boolean`，均默认 `true` | 指示器 / 左右箭头 |
| `repeat` / `allowTouch` | `boolean`，均默认 `true` | 重复播放 / 手势拖动 |
| `onChange` / `onClick` | `(index: number) => void` | 切换后 / 点击切换通知；参数是索引 |
| `activeKey` | `number \| string` | 对应 CarouselItem.itemKey；外部变更有效，内部切换需业务用 onChange 同步 |
| `id` / `className` / `style` | `string` / `string` / `CSSProperties` | 最外层标识与样式 |
| `CarouselItem.itemKey` / `children` | `number \| string` / `ReactNode`，均必填 | 自定义项标识与内容 |

站点 API 另列上一项 / 下一项能力，但示例未演示 ref 的取得与调用，暂不作为已验证的命令式用法；不补写未记录的跳转、暂停或重置方法。
