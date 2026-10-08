# ConfigProvider 组件功能逻辑规格（可选应用配置）

> **保留用户选定的接入策略**：已有 IntlProvider 且无动画需求时沿用；没有 IntlProvider 或需要控制 `animation` 时使用 ConfigProvider，已有 ConfigProvider 则复用。**它是否提供 react-intl 的 IntlContext 仍未确认**；业务已有 IntlProvider 时，兼容性未确认前保留其上下文，不能为替换而破坏文案。
> 核验的 3.10 源码线声明 `locale` / `messages` / `animation` / `children` / `popupProps` / `onlyRenderOutside`。`locale` / `messages` 当前无消费者，不能用于配置语言；`theme` 不是正式字段。

## 1. 功能定位

ConfigProvider 向组件提供动画及弹层相关配置。组件配置与业务国际化上下文分开核对；入口安装、样式与挂载骨架见 [工程接入](patterns/project-setup.md)。

| 需求 | 处理 |
|------|------|
| 已有 IntlProvider，无动画配置需求 | 沿用 IntlProvider，不额外加 ConfigProvider |
| 没有 IntlProvider | 按用户选择使用 ConfigProvider；已有时复用，否则在应用根部最小包裹 |
| 需要控制 animation 开关 | 使用 ConfigProvider 并传 boolean；已有业务 IntlProvider 在兼容未明时保留 |
| 配置业务语言文案 | 沿用业务国际化方案；不能依赖 ConfigProvider 的 locale/messages |
| 切换明暗主题 | 入口载入对应 CSS 并切换根 DOM 类名，不传 theme 来替代样式接入 |

## 2. 典型场景

- 普通业务页面已有 IntlProvider：无动画需求时保持现有接入，不逐页追加 ConfigProvider。
- 新工程或缺少 IntlProvider：按用户选择采用最小 ConfigProvider 包裹；这不代表已经证明它兼容业务 `useIntl`。
- 需要关闭或开启动画：使用 `animation`；先检查已有 Provider，复用同一层组件配置，保留实际业务文案所需的 IntlProvider。

## 3. 状态声明

仅透传 children 或静态设置 `animation={false}` / `{true}` 时无需状态，不主动增加开关 UI。动态更新是否影响已挂载组件、嵌套配置如何继承、portal 内动画如何传播仍未确认；不要将静态属性有效扩大为这些行为均已验证。

## 4. 事件与交互逻辑

```tsx
// 没有 IntlProvider，且无需额外控制动画：最小包裹
<ConfigProvider>{children}</ConfigProvider>

// 需要关闭动画；开启时传 true
<ConfigProvider animation={false}>{children}</ConfigProvider>
```

- `animation` 的已确认消费者是组件的动画实现；固定设置使用 boolean，不要求同时配置语言、主题或弹层属性。
- 已有根 ConfigProvider 时直接复用。业务已有 IntlProvider，先保留并核验实际 `useIntl` / `FormattedMessage` 等消费者；只有证明兼容或完成迁移后，才落实替换。
- ConfigProvider 没有已确认的 `onChange` / `onThemeChange`；不要直接修改内部 Context。

## 5. 数据结构

最小包裹只需 React children，动画配置用 boolean。`locale` / `messages` 虽在当前声明中，运行逻辑没有消费者，传入不能据此实现语言切换或消息覆盖，因此不生成语言包合并与传值示例。

`popupProps` / `onlyRenderOutside` 有消费者，但本次未给出完整字段结构及外部渲染开关的精确语义。按目标工程已验证用法接入，不推断为“渲染到 body 外部”或虚构容器参数。旧契约中的 `formatMessage` / `isUse` 不列为当前业务 props。

## 6. 联动说明

- 主题 CSS 及 `body` 的 `aui3_1` / `aui3_1_dark` 类名仍由入口配置；Provider 不自动加载样式或改 DOM 类名。
- 用户选择用 ConfigProvider 承担组件配置，不等于已证实它提供 react-intl IntlContext；不因加入它而删除业务 IntlProvider 或 `react-intl` 依赖。
- 涉及动态动画、嵌套继承、portal 传播或弹层配置时分别核验；不要凭声明存在就保证具体行为。

## 7. 完整代码示例

以下封装用于没有 IntlProvider、也无需额外控制动画的应用。已有业务 IntlProvider 时保留其上下文；此示例不证明国际化替换兼容性。

```tsx
import type { ReactNode } from 'react';
import ConfigProvider from '@nce/eview-react/ConfigProvider';

export default function AppConfig({ children }: { children: ReactNode }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}
```

## 8. 反面示例

```tsx
// ❌ 已有 IntlProvider 且无动画需求，却无必要地再加一层配置
<ConfigProvider><IntlProvider locale="zh" messages={messages}><App /></IntlProvider></ConfigProvider>

// ❌ antd theme token 与容器回调不能照搬；theme 也不是当前正式字段
<ConfigProvider theme={{ token: { colorPrimary: '#0077ee' } }} getPopupContainer={() => document.body} />

// ❌ 依赖当前没有消费者的字段实现语言切换
<ConfigProvider locale={language} messages={messages[language]}>{children}</ConfigProvider>

// ❌ 未核实 IntlContext 兼容就删掉现有 IntlProvider
<ConfigProvider><ExistingPageUsingUseIntl /></ConfigProvider>

// ❌ 虚构事件或套用别库命名空间属性
<ConfigProvider onThemeChange={setTheme} prefixCls="app" />
```

## 9. API 速查

| API | 类型 / 当前状态 | 说明 |
|-----|-----------------|------|
| `locale` / `messages` | 声明存在 | 当前无消费者，不作为有效语言配置 |
| `animation` | `boolean` | 控制组件动画；静态值无需增加状态，动态/嵌套/portal 行为待核验 |
| `children` | React children | 包裹应用或子树，不据此保证提供 IntlContext |
| `popupProps` | 声明存在，结构按目标包核验 | 有弹层相关消费者，不虚构字段或默认值 |
| `onlyRenderOutside` | 声明存在，精确语义待核验 | 外部渲染控制；不推断 body 内外及具体挂载行为 |

`theme` 非正式字段；`formatMessage` / `isUse` 不属于当前确认的 props 集合。没有已记录的 ref 方法。
