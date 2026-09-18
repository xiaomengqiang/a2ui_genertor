# Pattern：工程接入（让 eview-react 组件"跑得起来"）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：工程配置文档 project-setting；官网文档 quick-start / intl / aui_to_ict / f_&_q
>
> 本文不走 9 节模板。它回答的是"组件代码写对了，为什么页面还是报错 / 没样式 / 文案是 key"这一类问题。
> **生成任何 eview-react 页面前，先确认目标工程已满足 §1-§4；没有就把这些一并生成。**

## 0. 什么时候读本文

- 新建工程接入 `@nce/eview-react`
- 报错 `Element type is invalid`、`Form.Item is undefined`
- 组件渲染出来没有 ICT 3.1 样式，或弹层（Select 下拉、Dialog）位置错乱
- 组件内置文案（"请选择"、分页"共 x 条"）显示成英文或 key

## 1. 依赖与版本（必须按顺序，缺一不可）

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
| `react-intl` | `^7.1.14`（官网三方件表为 6.4.1） | 国际化必需 |
| `vite` / `@vitejs/plugin-react` | `^5.4.0` / `^4.3.0` | 锁版本，避免不兼容 |

可选：`npm install vite-plugin-eview-react -D`，在 `vite.config.js` 的 `plugins` 里加 `eviewReact()` 做按需引入。

## 2. 入口文件骨架（main.tsx，照抄）

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';      // 组件库内置语言包
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import '@nce/eview-react/styles/aui3_1.css';                   // ICT 3.1 浅色主题，只引一次
import App from './App';

const locale = 'zh'; // 或 'en'；需要切换时用 state 保存并动态传入

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ConfigProvider：弹层统一挂到外层容器；IntlProvider：组件内置文案 */}
    <ConfigProvider popupProps={{ className: 'nce-common-xxxx' }} onlyRenderOutside>
      <IntlProvider locale={locale} messages={componentsLocales[locale]}>
        <App />
      </IntlProvider>
    </ConfigProvider>
  </StrictMode>,
);
```

三条硬纪律：

1. **`IntlProvider` 必须包在最外层**，`messages` 用 `componentsLocales[locale]`；有业务语言包时按 `intl.md` 用 `Object.assign(componentsLocales.en, projectLocales.en)` 合并
2. **样式在入口引入** `@nce/eview-react/styles/aui3_1.css`（浅色）与 `aui3_1_dark.css`（深色）。**运行时双主题切换的工程两套都要引**，再靠根 DOM 的 `aui3_1` ↔ `aui3_1 aui3_1_dark` class 切换；单一深色主题工程可只引 `aui3_1_dark.css`。"只引一次"指别在每个组件重复引组件 CSS，不是只引一个主题文件。
3. 3.7.5 ~ 3.9.x 版本按 `aui_to_ict.md` 需在期望生效的根 DOM 上加 `class="aui3_1"`（深色 `aui3_1 aui3_1_dark`）；4.x 起默认 ICT 3.1（`f_&_q.md`）—— **不确定版本时加上类名不会有副作用**

## 3. 组件导入方式

```tsx
// ✅ 方式一（推荐）：按路径导入，便于按需加载
import Button from '@nce/eview-react/Button';
import TextField from '@nce/eview-react/TextField';
import Form from '@nce/eview-react/Form';

// ✅ 方式二：主包命名导出
import { Button, TextField, Select } from '@nce/eview-react';

// ✅ Form 子项：始终写 Form.Item
<Form layout="horizontal">
  <Form.Item label="用户名" name="username">
    <TextField />
  </Form.Item>
</Form>

// ❌ 不要提取：const FormItem = Form.Item（project-setting.md 明确不推荐）
// ❌ 不要写成源码仓别名：import Button from 'eview-react/Button'（那是组件库仓内部路径）
```

## 4. 常见报错对照

| 现象 | 原因 | 处理 |
|------|------|------|
| `Element type is invalid` | 缺 peer 依赖 | 补装 §1 第 3 步全部 peer 包 |
| `Form.Item is undefined` | Form 导入方式错 | `import Form from '@nce/eview-react/Form'` 后用 `Form.Item` |
| 组件无样式 / 样式错乱 | 未引 css 或根 DOM 缺 `aui3_1` 类名 | 见 §2 第 2、3 条 |
| 弹层文案是 key / 英文 | 缺 `IntlProvider` 或 `messages` 未传 | 见 §2 第 1 条 |
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
