# Pattern：工程接入（让 eview-react 组件"跑得起来"）

> 本文不走 9 节模板。它回答的是"组件代码写对了，为什么页面还是报错 / 没样式 / 文案是 key"这一类问题。
> **生成任何 eview-react 页面前，先确认目标工程已满足 §1-§4；没有就把这些一并生成。**

## 0. 什么时候读本文

- 新建工程接入 `@nce/eview-react`
- 报错 `Element type is invalid`、`Form.Item is undefined`
- 组件渲染出来没有 ICT 3.1 样式，或弹层（Select 下拉、Dialog）位置错乱
- 组件内置文案（"请选择"、分页"共 x 条"）显示成英文或 key

## 1. 依赖与版本（必须按顺序，缺一不可）

**版本边界**：实现核验主要针对 R26.0-NCE 的 `3.10.36-6-g2c9e16b83`。内网已安装包中发现 3.10.28 与 3.10.7；本轮产物入口及声明核验针对 **3.10.28**，不把全部源码行为视为这两个包均已验证。目标业务工程的实际安装版本仍未知。

4.x 仅对比 `4.0.607-15-ga873ca561` 源码：RadioGroup 参数顺序、SearchInput、Switch.onToggle、Form.onFailed、DropDown.selectedIndex、InputSelect.type 与核验的 3.10 实现一致，TimePicker.getValue 存在；该线没有 L4 目录或 Cascader。**未验证任何 4.x 发布包**，其他行为需按目标版本核对。TreeSelect 的回显缺陷有内网隔离运行探针反馈，其余标为类型或源码的结论不等于运行验证。

```ini
# .npmrc —— 先配源，否则 @nce 包装不上
registry=https://cmc.centralrepo.rnd.huawei.com/npm
@nce:registry=https://cmc.centralrepo.rnd.huawei.com/artifactory/api/npm/product_npm
```

```bash
# 1) 运行时依赖
npm install lodash react-intl @types/lodash
# 2) 构建工具：锁 Vite 5 + plugin-react 4
npm install vite@^5.4.0 @vitejs/plugin-react@^4.3.0 -D
# 3) 组件库 + peer 依赖（缺 peer → "Element type is invalid"）
npm install @nce/eview-react
npm install @nce/icon-plus -D
npm install @cloudsop/horizon @cloudsop/horizon-intl @cloudsop/htimezone @baize/wdk @hui/design-token --legacy-peer-deps
```

**版本硬约束**（`project-setting.md`）：

| 依赖 | 版本 | 说明 |
|------|------|------|
| `react-intl` | `^7.1.14`（官网三方件表为 6.4.1） | 按组件库和已有业务依赖保留；安装此包不代表必须包 IntlProvider |
| `vite` / `@vitejs/plugin-react` | `^5.4.0` / `^4.3.0` | 锁版本，避免不兼容 |

可选：`npm install vite-plugin-eview-react -D`，在 `vite.config.js` 的 `plugins` 里加 `eviewReact()` 做按需引入。

## 2. 入口文件骨架（main.tsx）

平常尽量不用 ConfigProvider：已有 IntlProvider 且无动画配置需求时沿用。没有 IntlProvider，或需要控制 animation 时，再使用 [ConfigProvider](../ConfigProvider.md) 替代；已有根 ConfigProvider 时直接复用。下面展示新工程尚无 IntlProvider 的入口。

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import '@nce/eview-react/styles/aui3_1.css';                   // ICT 3.1 浅色主题，只引一次
import App from './App';

// 本次核验版本需在 DOM 上加 aui3_1，否则 ICT 3.1 样式不生效（深色再加 aui3_1_dark）；
// 加在 body 上，挂到 body 下的下拉、弹窗等弹层也能覆盖
document.body.classList.add('aui3_1');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider><App /></ConfigProvider>
  </StrictMode>,
);
```

需要控制动画时，在 ConfigProvider 上传布尔值；固定开关无需新建状态或开关界面：

```tsx
<ConfigProvider animation={false}><App /></ConfigProvider>
```

接入规则：

1. **按已有接入和动画需求选择 Provider**：已有 IntlProvider 且不需控制动画时沿用；没有 IntlProvider，或需要控制 animation 时使用 ConfigProvider 替代。不强制两者嵌套，不在每个业务页面重复包裹；替换时核对 `useIntl` / `FormattedMessage` 等业务消费者；ConfigProvider 是否提供兼容的 IntlContext 尚未确认，有依赖时保留必要的 IntlProvider，直到兼容性验证或迁移完成。3.10 核验线的 `locale/messages` 有声明但无实际消费者，不能用它们配置语言；`theme` 也不是已确认的正式字段。`popupProps` / `onlyRenderOutside` 在该线有声明和实现消费者，仅沿用目标工程已验证的用法。
2. **样式在入口引入** `@nce/eview-react/styles/aui3_1.css`（浅色）与 `aui3_1_dark.css`（深色）。**运行时双主题切换的工程两套都要引**，再靠根 DOM 的 `aui3_1` ↔ `aui3_1 aui3_1_dark` class 切换；单一深色主题工程可只引 `aui3_1_dark.css`。"只引一次"指别在每个组件重复引组件 CSS，不是只引一个主题文件。
3. **在 body 上加 `aui3_1` 类名**（深色 `aui3_1 aui3_1_dark`）：核验版本的 ICT 3.1 样式按该类名限定作用域，ConfigProvider / ThemeProvider 不自动添加。Select / Dialog / MessageDialog 默认挂到 body，可用 mountId 改变；Drawer 也挂 body。只加在内层 `#root` 会漏掉这些弹层；自定义挂载点也须覆盖主题类名。Popup 自身是常规 JSX，不把所有弹层都推断为 portal；4.x 接入另按目标版本核验。

## 3. 组件导入方式

```tsx
// ✅ 方式一（推荐）：按路径导入，便于按需加载
import Button from '@nce/eview-react/Button';
import TextField from '@nce/eview-react/TextField';
import Form from '@nce/eview-react/Form';

// ✅ 方式二：主包命名导出
import { Button, TextField, Select } from '@nce/eview-react';

// ✅ 时间选择器：核验源码的根导出名是 TimeSelector
import { TimeSelector as TimePicker } from '@nce/eview-react';

// ✅ Form 子项：始终写 Form.Item
<Form layout="horizontal">
  <Form.Item label="用户名" name="username">
    <TextField />
  </Form.Item>
</Form>

// ❌ 不要提取：const FormItem = Form.Item（project-setting.md 明确不推荐）
// ❌ 不要写成源码仓别名：import Button from 'eview-react/Button'（那是组件库仓内部路径）
```

发布包 **3.10.28** 已核对以下子路径具有默认导出；可按需使用，不能据此假定其他包版本入口相同：

```tsx
import Segmented from '@nce/eview-react/Segmented'; // 同 SelectCard
import Slider from '@nce/eview-react/Slider';       // 同 DragInput
import TimePicker from '@nce/eview-react/TimePicker';
```

`@nce/eview-react/Transfer` 也已确认默认导出，但当前未覆盖它的组件 API，使用时仍按[未覆盖组件流程](fallback-handwrite.md)处理。Cascader 在核验的两条源码线与 3.10.28 包中均不存在，级联需求默认组合联动 Select。

## 4. 常见报错对照

| 现象 | 原因 | 处理 |
|------|------|------|
| `Element type is invalid` | 缺 peer 依赖 | 补装 §1 第 3 步全部 peer 包 |
| `Form.Item is undefined` | Form 导入方式错 | `import Form from '@nce/eview-react/Form'` 后用 `Form.Item` |
| 组件无样式 / 样式错乱 | 未引 css，或 DOM 上缺 `aui3_1` 类名（只有下拉、弹窗没样式时，检查类名是否覆盖到弹层） | 见 §2 骨架与第 2、3 条 |
| 弹层文案是 key / 非预期语言 | 当前语言或消息包配置不匹配 | 检查现有国际化 Provider 和 messages 的消费链；3.10 核验线不能靠 ConfigProvider.locale/messages 修复文案，保留业务所需上下文，见 §2 |
| 弹窗过高留大空隙 | 用 `size={[w, 固定高]}` 定死 | `size={[w, 'auto']}` 让高自适应 + `style={{ maxHeight: '80vh' }}` 限高；宽按场景设（`aui_to_ict.md` FAQ 1；详见 Dialog.md §4） |
| 自定义样式被组件覆盖 | 3.x 增加 `aui3` 前缀权重更高 | 提高自定义选择器权重（`aui_to_ict.md` FAQ 2） |

## 5. 编码风格（来自 `site-doc/rules.md`，生成业务代码时一并遵守）

- ES module `import/export`，`const`/`let`，严格等 `===`，每句加分号
- 函数组件 + hooks（官方 demo 有 class 写法，属于历史遗留；新代码统一函数组件）
- 事件处理函数用 `handleXxx` 命名；派生布尔用 `is/has/can` 前缀
- 提交代码不留 `console.log`
- React 单向数据流：父传子只走 props，子回父只走回调；不要自造"双向绑定"（`f_&_q.md`）

## 6. 最小可运行 App（配合 §2 使用）

```tsx
import React, { useState } from 'react';
import Button from '@nce/eview-react/Button';
import TextField from '@nce/eview-react/TextField';

// 最小验证页：能输入、能点击，说明工程接入成功
export default function App() {
  const [name, setName] = useState<string>('');

  const handleClick = () => {
    alert(`Hello, ${name}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <TextField label="姓名" placeholder="请输入" value={name} onChange={(value: string) => setName(value)} />
      <Button status="primary" text="打招呼" onClick={handleClick} style={{ marginTop: 16 }} />
    </div>
  );
}
```
