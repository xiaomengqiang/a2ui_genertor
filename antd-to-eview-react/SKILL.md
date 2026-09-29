---
name: antd-to-eview-react
description: >-
  将 umd-to-antd-vite 产物（eview-react Vite 工程 + .umd-conversion.json 交接文件）的 antd 组件替换为 @nce/eview-react（HUI Eview React，ICT 3.1）。
  仅处理 umd-to-antd-vite 产物，不直接处理 UMD 单 HTML 或其他来源的 antd 工程。
  覆盖：antd→eview-react 组件库替换、Steps/Modal 模式转换、Layout/Menu 等无对应组件手写。源项目表单用 div+输入组件拼合（无 Form/Form.Item）。
---

# antd → eview-react 迁移 Skill

## 前置条件

1. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可正常解析 `.npmrc` 中的 `@nce` scope。
2. **源项目工程形态**：源项目**必须是** `umd-to-antd-vite` 的产物——标准 Vite + npm 工程，附带 `.umd-conversion.json` 交接文件（含 `migrationPlan` 字段，由上游步骤 5 始终填充）。**若目标工程根无 `.umd-conversion.json`，本 skill 停止执行，提示用户先跑 `umd-to-antd-vite`**——不直接处理 UMD 单 HTML 或其他来源的 antd 工程。

## 迁移工作流（评估 + 3 步）

> 详细步骤见 [references/migration-workflow.md](references/migration-workflow.md)

| 步骤 | 做什么 | 产出 |
|------|--------|------|
| **0. 评估** | 读 `.umd-conversion.json` 的 `migrationPlan`（由 `umd-to-antd-vite` 步骤 5 始终生成，含分类 A/B/C + 替换名 + 关键差异 + 涉及文件 + reference 指引）。详见 [migration-workflow.md](references/migration-workflow.md) 步骤 0 | 组件迁移清单 |
| **1. i18n 设置** | 合并 `componentsLocales` + 业务语言包到 `IntlProvider` messages（scaffold `main.jsx` 已有基础 IntlProvider，需补业务文案）。详见 [i18n-migration.md](references/i18n-migration.md) §4 | IntlProvider 就绪 |
| **2. 逐组件替换** | 按映射总表替换每个 antd 组件；无对应的按 [handwrite-templates.md](references/handwrite-templates.md) 手写；图标按 §3.0 转 B/C 静态 import（方案A shim 兜底，详见 [Icon.md](references/components/Icon.md)）/图表（`@nce/eview-react/Chart`）走预制件复用，调用点零改动。详见 [§3.0–§3.5](references/migration-workflow.md) | 组件代码全部替换 |
| **3. 验证** | `check-relative-imports.cjs` 跳过（路径已由 `umd-to-antd-vite` 修正）。`check-i18n-keys.cjs` 必跑。`npm install`（bash 工具 timeout=30000，超时/失败记 SKIP 不判 FAIL）。详见 [§4.4](references/migration-workflow.md) | i18n 检查通过 |

## 组件映射

> 完整映射（有对应 / 组合替代 / 无对应需手写）含 API 差异、属性拼写异常、回调签名差异见 [component-mapping.md](references/component-mapping.md)；无对应组件的手写模板见 [handwrite-templates.md](references/handwrite-templates.md)；单组件完整 API 见 [components/INDEX.md](references/components/INDEX.md) 索引。

## eview-react 硬约束（迁移时必须遵守）

1. **导入路径**：`import Button from '@nce/eview-react/Button'`，不是 `import { Button } from 'antd'`
2. **样式**：scaffold `main.jsx` 已写好六处 CSS import（`aui3_1` / `aui3_1_dark` / `base` / `font` / `tokens` / `theme-dark`），不要删
3. **Provider**：scaffold `main.jsx` 已配好 `ConfigProvider` + `IntlProvider`（`messages={componentsLocales[locale]}`）；步骤 1 需合并业务语言包。**IntlProvider 必须在 `main.jsx`，是 `ConfigProvider` 的直接子级**（不是在 `app.jsx`/AppShell 里），否则弹层（Dialog 等 portal）取不到业务文案报 `MISSING_TRANSLATION`；**locale 用 `"zh"` 不是 `"zh-CN"`**
4. **回调签名**：第一个参数通常是值不是 event（TextField `onChange(value, ...)`、Select `onChange(value, oldValue, text, oldText, event)`）
5. **validator**：返回 `{ result: true, message }`，`result: true` = 通过
6. **API 表里查不到的 props 一律不写**
7. **CSS 不写死色值**：用源项目的 CSS 变量（原始 token）；类名用业务前缀 `app-` 不用 `ev_`
8. **Toggle `data` 必须用布尔值**：`data={[false, true]}`（不要用字符串 `['false','true']`，`'false'` 是 truthy 会导致开关无法关闭）
9. **相对导入解析**：路径已由 `umd-to-antd-vite` 修正并验证通过（`.umd-conversion.json` 的 `verification.relativeImports=PASS`），步骤 3 **跳过** `check-relative-imports.cjs`。步骤 2 替换组件时新增的 import 不要写 `./src/...`（同级用 `./`、上层用 `../`）。
10. **图标**：**图标步骤触发条件 = `src/` 下有 `<Icon name` 调用点（`grep -rl "<Icon\b" src/` 非空）或 `@ant-design/icons` 用法，与 `.umd-conversion.json` 的 `antdIcons` 是否为空无关**——ict-react-coder 产物用自定义 `<Icon name="...">` 运行时 shim、不用 `@ant-design/icons`，`antdIcons` 恒 `[]` 但有大量 `<Icon name>` 站点；**`antdIcons: []` 禁止跳过 `match-icons.cjs`**（误判陷阱见 [migration-workflow.md](references/migration-workflow.md) §0.1）。源码 `<Icon name>` shim ≠ 产物方案A：其 `<Icon name="字面量">` 站点必须转 C/B 静态 import，仅真动态名（`name={row.iconField}` 类运行时数据）落产物方案A shim。迁移期先探测 `https://octo.hdesign.huawei.com/`：可达（内网）→方案 B（在线名匹配），不可达（外网）→方案 C（`match-icons.cjs` 离线匹配 + `--apply`）。**完整机制（B/C/A 三种渲染方式、`matchOne` 匹配算法与 confirmed/residual 策略、iconSize 透传、方案A shim、动态名 `name={t.icon}` recipe、`--apply`/报告路径）见 [components/Icon.md](references/components/Icon.md) + [migration-workflow.md §3.0](references/migration-workflow.md)**。硬规则：eview-react 内置 `Icon name="ict_*"` 已下线不要用、不要用 `@ant-design/icons`；可点击图标用 `IconButton iconName={<IconPlusIc* />} tipText`（不给图标组件挂 onClick）；**antd 纯图标按钮（`Button type="text" shape="circle" icon={...}` 无 children）用 `IconButton`，禁退化为原生 `<button>+<Icon>`**（见 [component-mapping.md](references/component-mapping.md) 图标行）；**带图标 Button 文字必须用 `text=`，不写 children**（见 [Button.md](references/components/Button.md) §4）。

## 命名异常速查

> eview-react 部分 API 命名与"正确英文"或 antd 习惯不同（如 `seprator`/`taggledChildren`/`disable`/`status`/`defaultLabel`/`toggled` 等），迁移前必查 [references/component-mapping.md](references/component-mapping.md) 文末「属性拼写异常」+「回调签名差异」两张速查表

## 页面模式迁移

| antd 页面模式 | eview-react 迁移要点 |
|--------------|---------------------|
| **筛选列表页** | `Input.Search`→`SearchInput`+防抖；`Select` 换 `options` 格式；`Table` 换 `dataset`；分页用 Table 自带 `enablePagination` |
| **列表 CRUD** | `Modal`→`Dialog`；`Modal.confirm()`→`MessageDialog type="confirm"` |
| **多步向导** | `Steps current={i}`→`Steps currentStep={data[i].value}` |
| **表单提交页** | 输入组件逐个替换（源项目用 div+输入组件拼合，无 Form 包装）；提交逻辑不变 |
| **侧边详情/编辑** | `Drawer`→`Drawer`（`open`→`visible`）；底部按钮自写；`Descriptions`→手写 KeyValueList |
| **布局骨架** | `Layout`/`Avatar` 全部手写；`Menu`→`Accordion`；`Breadcrumb`→`Crumbs`；`Input.Search`→`SearchInput` |

## 前置 skill：umd-to-antd-vite

以下工作已由 `umd-to-antd-vite` 完成，本 skill 跳过：工程骨架搭建（eview-react scaffold 已就位）、组件扫描（`antdComponents`）、token 外置、相对导入修正、暗色模式转换（antd `theme.darkAlgorithm` → eview 类名切换）、组件分类评估（`migrationPlan`，由上游步骤 5 始终填充，步骤 0 直接读它）。

## 核心问题

从 antd 迁移到 eview-react 时的典型失败模式（每条详情见对应 reference）：

- **API 名称猜错**：`type`→`status`、`placeholder`→`defaultLabel`、`checked`→`toggled` 等；完整对照见 [component-mapping.md](references/component-mapping.md)
- **组件无对应**：Layout/Avatar/Descriptions/Result/Space 无直接对应，需手写补位；见 [handwrite-templates.md](references/handwrite-templates.md)
- **IntlProvider 放错位置**：必须在 `main.jsx` 作为 `ConfigProvider` 直接子级，locale 用 `"zh"` 不是 `"zh-CN"`；见 [i18n-migration.md](references/i18n-migration.md) §4
- **Table render i18n key 不对齐**：`t(cellValue, cellValue)` 取不到带前缀的 key，需 `t("deviceType." + value, value)`；脚本 `scripts/check-i18n-keys.cjs` 自动排查；见 [migration-workflow.md](references/migration-workflow.md) §3.5
- **命名拼写异常**：`seprator`/`taggledChildren`/`disable` 等官方拼错；见 [component-mapping.md](references/component-mapping.md) 文末「属性拼写异常」表
- **import 路径失效**：scaffold 后 `app.jsx` 在 `src/`，`./src/context.jsx` 须改 `./context.jsx`；脚本 `scripts/check-relative-imports.cjs` 按需排查（见 [§4.1](references/migration-workflow.md)）；步骤 4 默认跳过（路径已由前置 skill 修正）
- **`antdIcons:[]` 误判无图标 → 跳过 `match-icons.cjs` → 全落方案A**：`antdIcons` 只统计 `@ant-design/icons` 命名导入，ict-react-coder 产物用自定义 `<Icon name>` 运行时 shim、`antdIcons` 恒 `[]` 但有大量 `<Icon name>` 调用点；**触发条件看 `<Icon name` 站点（`grep -rl "<Icon\b" src/`）不看 `antdIcons`**，`antdIcons: []` 禁止跳过 `match-icons.cjs`；见 [migration-workflow.md](references/migration-workflow.md) §0.1 警告 + §3.0
