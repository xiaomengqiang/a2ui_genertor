# GTS Design System（gts-autin-coder）

页面一切颜色经由 **GTS token**（`--gts-*` CSS 变量）表达。token 由皮肤（`src/assets/themes/gts-*.css`）提供，经 `gts-bridge.css` 桥接到 Element Plus（`--el-*`）—— 因此换肤时 Element Plus 组件与页面同时跟随，无需改任何页面代码。

## 1. Token 全表

### 品牌色

| Token | 用途 |
|-------|------|
| `--gts-color-primary` | 主操作（CTA 按钮、选中 Tab、链接、聚焦描边） |
| `--gts-color-primary-hover` / `-active` | 主色 hover / 按下 |
| `--gts-color-on-primary` | 主色底上的文字/图标 |
| `--gts-color-primary-container` | 轻量高亮区块（选中列表项底、标签底、品牌卡片浅底） |
| `--gts-color-on-primary-container` | 高亮区块上的文字 |

### 功能色

| Token | 用途 |
|-------|------|
| `--gts-color-success` | 成功/运行中/在线 — 绿 |
| `--gts-color-warning` | 注意/待处理 — 橙 |
| `--gts-color-danger` / `--gts-color-error` | 失败/不可逆操作 — 红（语义等价，按钮用 danger） |
| `--gts-color-info` | 中立信息 — 灰 |

### 文本色（层级递弱）

| Token | 用途 |
|-------|------|
| `--gts-text-1` | 主标题、正文重点 |
| `--gts-text-2` | 常规正文 |
| `--gts-text-3` | 次要说明、日期、副标题 |
| `--gts-text-4` | 占位符（placeholder） |
| `--gts-text-disabled` | 禁用态文字 |
| `--gts-text-inverse` | 深色底上的反白文字 |

### 背景色

| Token | 用途 |
|-------|------|
| `--gts-bg-page` | 页面 body 底色 |
| `--gts-bg-container` | 卡片、面板、表格容器底 |
| `--gts-bg-overlay` | 浮层（下拉、popover、dialog）底 |
| `--gts-bg-hover` | 行/项 hover 底 |
| `--gts-bg-fill` | 填充底（输入框、禁用底） |

### 边框 / 遮罩 / 阴影 / 圆角

| Token | 用途 |
|-------|------|
| `--gts-border-1` | 分割线、表格网格线 |
| `--gts-border-2` | 控件描边（输入框、卡片描边） |
| `--gts-mask` | 弹窗遮罩 |
| `--gts-shadow-1` / `-2` / `-3` | 卡片 / 弹窗 / 最高层浮层阴影 |
| `--gts-radius-sm` / `-md` / `-lg` / `-full` | 控件 / 卡片 / 大容器 / 胶囊圆角 |
| `--gts-font-family` | 字体栈（默认 HarmonyOS Sans） |

**使用规则：**
- 页面模板内联 style、页面样式区（`<style data-gts-page>`）、JS 动态样式 — 一律 `var(--gts-*)`。
- Element Plus 组件优先语义 prop（`type="primary|success|warning|danger|info"`、`effect`、`status`），组件内部色自动走桥接。
- 用户明确指定精确颜色时才允许 hex 字面量，并加注释说明。
- Element Plus 的 `light-N` 色阶由桥接层 `color-mix` 自动派生，页面代码不要自己算浅色。

## 2. 换肤协议（Skin Protocol）

皮肤 = `src/assets/themes/` 下的一个 css 文件，作用域 `html[data-gts-theme="{name}"]`。当前内置 `gts-default`（占位皮肤）。**接入自有换肤体系时**（用户提供皮肤 css 后）：

1. 皮肤文件放 `themes/gts-{name}.css`，token 定义在 `html[data-gts-theme="{name}"]` 下（非 `:root`，保证多皮肤共存）。
2. `index.gts.html` 换肤插槽处追加 `<link rel="stylesheet" href="./src/assets/themes/gts-{name}.css">`；真实工程在 `main.js` 换肤插槽追加 `import './styles/themes/gts-{name}.css'`。
3. 运行时切换：`document.documentElement.setAttribute("data-gts-theme", "{name}")`。
4. 自有变量名与 `--gts-*` 不一致时：优先在皮肤文件里做映射（`--gts-color-primary: var(--自有变量);`），保持桥接层不动。
5. **深色皮肤必须**覆盖 `--gts-mix-base`（改向深色表面，如 `#1d1d1d`），否则 EP light 色阶发白。

完整操作手册：`scripts/preview/src/assets/themes/README.md`。

## 3. 布局规范

- **B 端控制台页：** `el-container` 外壳 — `el-aside`（`el-menu` 侧导航，可折叠）+ `el-container`（`el-header` 顶栏 + `el-main` 内容）。顶栏含面包屑/标题 + 操作区。
- **内容页：** 单栏，根容器 `gts-page-root`（padding 20-24px，`max-width: 1280px` 居中）。
- **看板页：** 顶部 KPI 卡行（`el-row`/`el-col` 或 grid，等高），下方 2/3 + 1/3 图表区。
- **列表页标配：** 标题行（标题 + 主操作按钮）→ 筛选行（`el-input` 搜索 + `el-select` 筛选 + 计数）→ `el-table` → `el-pagination` 右对齐。
- **卡片：** 信息聚合容器，用 `--gts-bg-container` 底 + `--gts-shadow-1`/描边 + `--gts-radius-lg`。
- **间距：** 4 的倍数 px；区块间 16-24px，组件内 8-12px。
- **响应式：** 预览以桌面为主（≥1200px），但栅格用 `el-col` 的 `:xs/:sm/:md/:lg` 保证窄屏不破版。

## 4. Element Plus 组件要点

API 以 Element Plus 2.x 为准。常见场景与 Don'ts：

| 场景 | 做法 | Don't |
|------|------|-------|
| 表格自定义列 | `<el-table-column>` 内 `<template #default="{ row }">` | 不要用作用域插槽旧语法 `slot-scope` |
| 表格操作列 | `label="操作" fixed="right"`，按钮用 `link` 型 | 不要塞超过 3 个按钮，多的收进 `el-dropdown` |
| 表单 | `el-form` + `el-form-item` + `rules` 校验 + `ref` 调 `validate()` | 不要裸 `el-input` 数组无校验 |
| 弹窗表单 | `el-dialog` + footer 双按钮（取消/确定） | 确定按钮要处理 loading/关闭时机 |
| 详情面板 | `el-drawer`（`direction="rtl"`） | 不要用 dialog 塞长内容 |
| 轻提示 | `ElMessage.success/warning/error` | 不要 alert/自定义浮层 |
| 危险操作 | `ElMessageBox.confirm(..., { type: "warning" })` | 删除必须二次确认 |
| 状态 | `el-tag` + type 映射表（STATUS_MAP） | 不要用颜色字符魔法值散落模板 |
| 加载 | 表格 `v-loading`；局部 `ElLoading` 服务 | 不要空白等待 |
| 空态 | `el-empty`（描述 + 操作按钮） | 不要空 div |
| 图标 | `const { X } = ElementPlusIconsVue` + `<el-icon><X /></el-icon>` 或 `:icon="X"` | 图标名拼错=静默不渲染，verify 会拦截 |
| 数字输入 | `el-input-number`（有 `:min/:max`） | 不要 `el-input` + 手写校验 |
| 日期 | `el-date-picker` + `type="daterange"` 值是数组 | 单值/数组别搞混 |
| 页脚分页 | `el-pagination` `layout="total, prev, pager, next"` + `background` | 不要只放 pager 不显示 total |

**Vue SFC 反模式（校验之外的人肉检查项）：**
- `v-for` 忘 `:key`；`v-if` 与 `v-for` 同标签。
- `el-select` 的 `v-model` 初值不在 options 中 — 显示裸值。
- script setup 里声明的变量忘 return？— 不存在这个问题（`<script setup>` 自动暴露），但**别用 Options API 混写** `setup()` + `data()`。
- 图片路径写死相对字符串 — 应 `import img from '../../assets/uploads/x.png'`（预览与工程语义一致）。
- 把业务组件注册到全局 — 交付件里组件一律显式 import。
