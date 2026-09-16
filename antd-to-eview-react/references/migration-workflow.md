# 迁移工作流（详细步骤）

> 从 antd 项目迁移到 eview-react 的完整流程。按步骤执行，每步产出明确。

## 步骤 0：评估迁移可行性

### 0.1 扫描源项目组件清单

用 grep / 人工审查源项目 `src/`，列出所有 antd 组件导入：

```bash
# 查找所有 antd 导入
grep -rn "from 'antd'" src/ --include="*.jsx" --include="*.tsx"
grep -rn "from \"antd\"" src/ --include="*.jsx" --include="*.tsx"
```

### 0.2 对照组件映射总表分类

将扫描到的组件分为三类：

| 分类 | 含义 | 处理 |
|------|------|------|
| **A. 有对应** | eview-react 有同名或功能等价组件（有 Reference） | 直接替换，改 props |
| **B. 无对应需手写** | eview-react 无对应组件 | 用 [handwrite-templates.md](handwrite-templates.md) 模板 |
| **C. 需模式转换** | 组件有对应但 API 模式不同（Form / Steps / Modal） | 读 [form-migration.md](form-migration.md) |

### 0.3 评估工作量

- A 类组件 × 数量 → 每个约 5-15 分钟（改 props）
- B 类组件 × 数量 → 每个约 15-30 分钟（手写 + 调样式）
- C 类模式 → Form 迁移约 30-60 分钟（控制流重写）
- CSS 变量切换 → 全局约 30-60 分钟

### 0.4 输出迁移清单

| antd 组件 | 分类 | eview-react 替换 | 涉及文件 | 备注 |
|-----------|------|-----------------|---------|------|
| Button | A | Button (status) | AppShell.jsx | type→status |
| Form | C | Form (ref) | StepFlow.jsx | useForm→ref |
| Layout | B | 手写 | AppShell.jsx | 无对应 |
| ... | | | | |

## 步骤 1：建工程骨架

### 1.1 判断是否需要新建

- 源项目已有 `package.json` + Vite → 跳到步骤 2
- 源项目是 UMD/单 HTML/无构建 → 执行 1.2-1.5

### 1.2 创建 package.json

```json
{
    "name": "project-name",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.3.0",
        "react-dom": "^18.3.0",
        "react-intl": "^7.1.14",
        "@nce/eview-react": "latest",
        "@nce/icon-plus": "latest",
        "@cloudsop/horizon": "latest",
        "@cloudsop/horizon-intl": "latest",
        "@cloudsop/htimezone": "latest",
        "@baize/wdk": "latest",
        "@hui/design-token": "latest",
        "lodash": "^4.17.21"
    },
    "devDependencies": {
        "@types/lodash": "^4.17.0",
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.3.0",
        "vite": "^5.4.0"
    }
}
```

### 1.3 创建 .npmrc

```ini
registry=https://cmc.centralrepo.rnd.huawei.com/npm
@nce:registry=https://cmc.centralrepo.rnd.huawei.com/artifactory/api/npm/product_npm
```

### 1.4 创建 vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });
```

### 1.5 创建 index.html + 入口文件

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>标题</title></head>
<body class="aui3_1 ev_no_wcag"><div id="root"></div><script type="module" src="/main.jsx"></script></body>
</html>
```

```jsx
// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import '@nce/eview-react/styles/aui3_1.css';
import App from './app.jsx';

const locale = 'zh';
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <IntlProvider locale={locale} messages={componentsLocales[locale]}>
                <App />
            </IntlProvider>
        </ConfigProvider>
    </StrictMode>
);
```

## 步骤 2：换 Provider 与入口

### 2.1 移除 antd Provider

```tsx
// ❌ 删除
import { ConfigProvider, theme } from 'antd';
import zhCN from './assets/shared/antd-zh-cn.js';

<ConfigProvider locale={zhCN}>
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        {children}
    </ConfigProvider>
</ConfigProvider>
```

### 2.2 暗色模式改类名切换

```tsx
// ✅ eview-react：根 DOM 切换 aui3_1_dark 类名
useEffect(() => {
    const root = document.querySelector('.app-root');
    if (root) root.classList.toggle('aui3_1_dark', isDark);
}, [isDark]);
```

### 2.3 根 DOM 加 aui3_1 类名

```tsx
// app.jsx
<div className="app-root aui3_1">
    <AppShell />
</div>
```

### 2.4 删除 antd 相关依赖

- 删除 `antd` 导入
- 删除 `antd-zh-cn.js` 等语言包
- 删除 UMD 库引用（`antd.min.js` 等）

## 步骤 3：逐组件替换

> 按组件映射总表替换，Form 模式单独处理。

### 3.1 A 类（有对应）：改 props

对每个有对应的组件，执行：
1. 改导入路径：`from 'antd'` → `from '@nce/eview-react/<Component>'`
2. 改属性名：对照 [naming-quirks.md](naming-quirks.md) 逐项替换
3. 改回调签名：首参从 event 改为 value
4. 改数据格式：`options` 的 `label`→`text`，`items`→`data` 等

### 3.2 B 类（无对应）：手写补位

1. 读 [handwrite-templates.md](handwrite-templates.md) 取对应模板
2. 按模板实现，样式用源项目的 CSS 变量（原始 token）
3. 加 `// TODO(eview-react)` 注释
4. 在最终回复中列出所有手写补位

### 3.3 C 类（Form 模式转换）

1. 读 [form-migration.md](form-migration.md)
2. `useForm()` → `useRef(null)`
3. `validateFields()` Promise → `submit()` + `onSuccess` 回调
4. 推进逻辑从 `.then()` 移到 `onSuccess` 内
5. `rules` 删 `message`
6. Toggle 加 `valuePropName="toggled" updateTrigger="onToggle"`

### 3.4 替换顺序建议

1. **叶子组件先换**（Button / TextField / Select 等）—— 改动小、验证快
2. **容器组件后换**（Form / Dialog / Table）—— 模式变化大
3. **布局组件最后换**（Layout / Menu / Breadcrumb）—— 影响全局

## 步骤 4：提取 CSS token

> 详见 [css-token-mapping.md](css-token-mapping.md)

迁移时保留源项目的 token 体系，不做变量名替换。操作：

1. 从源项目的 `index.page.html`（或内联 `<style>`）提取 `:root` 变量定义到 `src/styles/tokens.css`
2. 提取 `.dark` 暗色覆盖到 `src/styles/theme-dark.css`（有的话）
3. 在入口同时引入：`import '@nce/eview-react/styles/aui3_1.css'` + `import './styles/tokens.css'` + `import './styles/theme-dark.css'`
4. 布局/手写 CSS 不改（继续引用 `var(--surface)` 等原始变量名）
5. 暗色模式同时切 `aui3_1_dark` 和 `.dark` 两个类名

通用规则：
- 不写死色值，用 CSS 变量（源项目的原始 token）
- 类名用业务前缀（`app-`）不用 `ev_`
- 可点击元素用 `<button type="button">`

## 步骤 5：验证

### 5.1 编译检查

```bash
npm install
npm run dev
```

### 5.2 功能验证清单

- [ ] 页面能渲染（无 `Element type is invalid` → 检查 peer 依赖）
- [ ] 组件有 ICT 3.1 样式（无样式 → 检查 `aui3_1.css` 导入和 `aui3_1` 类名）
- [ ] 弹层文案是中文（显示 key → 检查 `IntlProvider` + `messages`）
- [ ] 表单能输入（`TextField` value+onChange 成对）
- [ ] 表单校验触发（`ref.submit()` → `onSuccess`）
- [ ] 下拉选项渲染（`options=[{text,value}]` 字段名正确）
- [ ] 弹窗能打开和关闭（`isOpen`/`visible` 受控 + `onClose` 里置 false）
- [ ] 暗色模式切换（`aui3_1_dark` + `.dark` 两个类名都切）
- [ ] 手写补位组件样式跟随主题（用了 CSS 变量，不写死色值）

### 5.3 常见报错对照

| 报错 | 原因 | 修复 |
|------|------|------|
| `Element type is invalid` | 缺 peer 依赖 | 补装 `@cloudsop/horizon` 等 |
| `Form.Item is undefined` | Form 导入方式错 | `import Form from '@nce/eview-react/Form'` |
| 组件无样式 | 未引 css 或缺类名 | 引 `aui3_1.css` + 根加 `class="aui3_1"` |
| 弹层文案是 key | 缺 IntlProvider | 加 `IntlProvider` + `messages` |
| `undefined is not a function` | ref 还没挂载就调方法 | 检查 `?.` 可选链 + 组件是否已渲染 |
