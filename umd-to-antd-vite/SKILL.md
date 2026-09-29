---
name: umd-to-antd-vite
description: >-
  把 ict-react-coder 产出的 UMD 单 HTML 工程（index.page.html + 内联 token CSS + Babel-standalone 转译 + 双份代码）转换为标准 antd Vite + npm 工程的专项 Skill。提供 scaffold 预制骨架（一键拷贝 antd Vite 空壳）、extract-umd.cjs 自动提取内联 token CSS（:root/.dark/@font-face 分类外置到独立文件）、check-relative-imports.cjs 排查路径错误。工作流为混合编排：主 agent 亲自跑脚本搭骨架+提取内容（步骤 1-2），派发 general 子 agent 搬代码修路径+验证（步骤 3-4）；验证结果写入 .conversion-result.json 供主 agent 判定。产出的标准 antd Vite 工程可直接衔接 antd-to-eview-react skill 继续迁移到 eview-react（下游步骤 1 以 `--upgrade` 模式把骨架从 antd 换成 eview-react，保留本 skill 外置的 token CSS）。务必在以下场景使用：把 ict-react-coder 产物的 UMD 单 HTML 转成标准 React 工程、需要外置内联 token CSS 到独立文件、想标准化工程结构以降低后续组件库迁移成本、用户提供了 index.page.html 并要求转成 React 项目、需要为 antd-to-eview-react 迁移做前置工程标准化、想把 UMD 内联的 666+ 个 CSS 变量提取到 tokens.css + theme-dark.css。
---

# UMD → antd Vite 工程标准化 Skill

## 核心问题

从 ict-react-coder 产出的 UMD 单 HTML 工程转换为标准 Vite + npm 工程时的典型问题：

- **token CSS 全量丢失**：源项目 1000+ 行内联 `<style>` 里有 666 个 CSS 变量定义（三层 `:root` + `.dark` 暗色覆盖），迁移到 Vite 后 HTML 不能用，变量全丢。`extract-umd.cjs` 自动按选择器分类提取到 `tokens.css` / `theme-dark.css` / `font.css` / `base.css`
- **双份代码一致性**：源项目 `index.page.html` 内联版 vs `src/` 独立版两份代码，需判断以哪份为准。`extract-umd.cjs` 自动列出 `src/` 文件清单，优先用独立文件
- **相对 import 路径错位**：源项目根目录 `app.jsx` 写 `./src/context.jsx`，搬进 scaffold 的 `src/app.jsx` 后变成错误的 `src/src/context.jsx`。`check-relative-imports.cjs` 自动扫描
- **无 package.json / vite.config.js**：UMD 工程用 Babel-standalone 浏览器内转译，无构建工具。scaffold 预制 antd Vite 空壳，`init-scaffold.cjs` 一键拷贝
- **图标运行时 fetch 跨域**：源项目 icon 组件用 icon-plus 在线服务（绝对 URL），Vite dev 下跨域。vite.config.js 预配 proxy + transform 插件

## 前置条件

1. **源项目**：须为 ict-react-coder 产出的 UMD 单 HTML 工程。结构特征：`index.page.html`（含 UMD script 标签 + 内联 CSS + Babel-standalone + 内联 jsx 模块）+ `src/` 双份代码 + antd 5 + 内联 token CSS + Lucide 图标 + icon-plus 在线
2. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可用
3. **网络**：antd 在公共 npm 源，不需要内网/VPN。icon-plus 在线（`octo.hdesign.huawei.com`）需要内网——但仅影响图标渲染，不影响工程转换与验证

## 迁移工作流（4 步）

| 步骤 | 做什么 | 产出 | 执行方式 |
|------|--------|------|---------|
| **1. 搭骨架** | 跑 `init-scaffold.cjs` 拷贝 antd Vite 空壳（package.json/vite.config.js/index.html/main.jsx/styles），`npm install`（bash 工具 timeout=30000，超时记 SKIP 不阻断） | 可运行的空壳工程 | 主 agent 跑脚本 |
| **2. 提取 UMD 内容** | 跑 `extract-umd.cjs` 从源项目 `index.page.html` 提取：`:root` → tokens.css、`.dark` → theme-dark.css、`@font-face` → font.css、其他 → base.css 追加；扫描 antd 组件导入（组件→文件映射 + 图标列表）；生成 `.umd-conversion.json` 交接文件供 antd-to-eview-react 读取；无 `src/` 时加 `--scripts` 提取 script 块 | token 外置 + antd 清单 + 交接文件 | 主 agent 跑脚本 |
| **3. 搬代码 + 修路径** | 把源项目 `src/` 独立文件（或 `_extracted/`）搬进 scaffold `src/`；修正 `./src/...` → `./...` 相对导入；确保 `app.jsx` 含源项目 AppShell + 保留暗色切换逻辑 | 代码就位，import 正确 | 派发 general 子 agent |
| **4. 验证** | 跑 `check-relative-imports.cjs` 静态检查 + `npm install`（bash 工具 timeout=30000）；`npm install` 超时/失败（外网无法访问内网源）记 `SKIP` 不记 `FAIL`，整体 status 不因 SKIP 判 FAIL；验证通过后更新 `.umd-conversion.json` 的 `verification` 字段 | import 通过 + 交接文件就绪 | 派发 general 子 agent |
| **5. 下游评估前置（可选）** | 验证 PASS 且主 agent 余量充足时，读 antd-to-eview-react 的 `references/component-mapping.md`，对照 `antdComponents` 给每组件分类（A 有对应 / B 无对应手写 / C 模式转换）+ eview-react 替换名 + 关键差异摘要 + 涉及文件 + 下游 reference 指引，写入 `.umd-conversion.json` 的 `migrationPlan` 字段 | 下游步骤 0 评估清单就绪 | 主 agent（利用余量） |

### 编排边界（主 agent 亲自做 vs 派发子 agent）

**主 agent 亲自执行**（步骤 1-2）：
- 跑 `init-scaffold.cjs` 拷贝骨架、跑 `extract-umd.cjs` 提取内容
- 从子 agent 回复提取 `task_id` 并记录、合并改动清单、决定下一步
- 读验证结果文件（`.conversion-result.json`）的 `status` 字段判定 pass/fail（**不信子 agent 口头结论**）

**派发子 agent 执行**（步骤 3-4）：
- 步骤 3：派发 `general` 子 agent 搬代码 + 修路径 + 配入口
- 步骤 4：派发 `general` 子 agent 跑脚本 + 验证 → 把结果写入 `<目标工程根>/.conversion-result.json`

**续接硬约束**：步骤 4 验证 FAIL 回到步骤 3 修复时，**必须传 `task_id` 续接同一 session**（不另起新 session），否则子 agent 丢失之前的代码结构与改动上下文。主 agent 每轮派发后从子 agent 回复提取 `task_id` 并记录，修复轮续接时传入。

## scaffold/ 预制骨架

`scaffold/` 是预制的可运行 antd Vite 空壳工程，步骤 1 一键拷贝即可：

```
scaffold/
├── package.json        # antd 5 + react 18 + dayjs + lodash + @ant-design/icons
├── vite.config.js      # Vite + @vitejs/plugin-react + icon-plus proxy/transform
├── index.html          # 薄入口：<div id="root"> + /src/main.jsx
└── src/
    ├── main.jsx        # antd ConfigProvider + zhCN locale + dayjs locale + styles import
    ├── app.jsx         # 空壳 App（暗色切换：.dark 类 + ConfigProvider theme.darkAlgorithm）
    └── styles/
        ├── base.css          # 全局重置（步骤 2 追加源项目样式）
        ├── tokens.css        # 空壳占位，步骤 2 填 :root 变量
        └── theme-dark.css    # 空壳占位，步骤 2 填 .dark 覆盖
```

与 antd-to-eview-react scaffold 的关键区别：

| 项 | 本 skill scaffold | antd-to-eview-react scaffold |
|----|--------------------|-----------------------------|
| 组件库 | antd 5（公共 npm） | @nce/eview-react（华为内网 npm） |
| Provider | ConfigProvider + zhCN | ConfigProvider + IntlProvider + `aui3_1` body 类名 |
| 暗色 | `.dark` 类 + theme.darkAlgorithm | `aui3_1_dark` body 类 + `.dark` html 类 |
| npmrc | 无（公共源） | 华为内网源 |
| 图标 shim | 无（保留源项目原版 icon.jsx） | 预制 `src/shared/icon.jsx`（剥离 Lucide） |
| 字体 | 无（公共系统字体） | HarmonyOS Sans SC 预制 |

用法：`node <skill目录>/scripts/init-scaffold.cjs <目标工程根> [项目名] [标题] [--force]`

## extract-umd.cjs：自动提取内联内容

这是本 skill 的核心脚本，机械化完成最耗 token 的 token CSS 提取工作。

```bash
node <skill目录>/scripts/extract-umd.cjs <源UMD文件路径> <目标工程根> [--scripts]
```

脚本自动完成：

1. **提取 `<style>` 块**：用括号计数法拆分顶层 CSS 规则，按选择器分类：
   - `:root {...}` → `src/styles/tokens.css`（原始 token 变量）
   - `.dark {...}` → `src/styles/theme-dark.css`（暗色覆盖）
   - `@font-face {...}` → `src/styles/font.css`（字体注册）
   - `@media {...}` → 递归提取内部规则，按选择器分类，保留 `@media` 声明
   - 其他 → `src/styles/base.css` 追加（布局/组件样式）

2. **检查 `src/` 目录**：列出源项目 `src/` 下所有独立文件，提示优先使用

3. **提取 script 块**（`--scripts` 或无 `src/` 时自动触发）：从 `<script type="text/babel|jsx">` 提取源码到 `_extracted/`，文件名按首行注释 / export 声明 / 序号推断

4. **扫描 antd 组件导入**：扫描源项目 `src/` 或 `_extracted/` 下所有 `.jsx/.tsx` 文件的 `from 'antd'` / `from '@ant-design/icons'` 导入，生成组件→文件映射 + 图标列表

5. **生成交接文件**：写入 `<目标工程根>/.umd-conversion.json`，包含 antd 组件清单、token 统计、src/ 文件清单、暗色方案、验证状态（`verification` 初始为 `null`，步骤 4 验证通过后更新）

输出报告含：token 变量数、规则数、src/ 文件清单、antd 组件数、antd 图标数、交接文件路径。

### 交接文件 `.umd-conversion.json`

供 `antd-to-eview-react` skill 读取，避免重复扫描源项目。结构：

```json
{
  "skill": "umd-to-antd-vite",
  "sourceFile": "index.page.html",
  "projectName": "xxx",
  "antdComponents": { "Button": ["src/views/AppShell.jsx"], "Form": ["src/views/DeviceForm.jsx"] },
  "antdIcons": ["SearchOutlined", "SunOutlined"],
  "tokens": { "rootVarCount": 666, "darkVarCount": 200, "cssFiles": ["src/styles/tokens.css"] },
  "srcFiles": ["src/context.jsx", "src/data.js"],
  "darkMode": { "method": "css-vars + antd-darkAlgorithm" },
  "verification": null,
  "migrationPlan": null,
  "notes": ""
}
```

`antd-to-eview-react` 步骤 0 检查此文件：有则直接读 `antdComponents` 的 keys 作为迁移清单（跳过 explore 子 agent 扫描），读 `tokens` 确认 token 已外置（跳过步骤 4），读 `verification` 确认路径已修正（跳过 `check-relative-imports.cjs`）。**`migrationPlan`（步骤 5 生成）非 `null` 时，下游步骤 0 优先读它作为分类评估清单，跳过读 `component-mapping.md` 大表对照；为 `null` 时下游回退读 `antdComponents` + 手动对照 `component-mapping.md`。**

步骤 4 验证通过后，更新 `verification` 字段：

```json
"verification": { "relativeImports": "PASS", "npmInstall": "PASS|SKIP" }
```

> `npmInstall` 取值 `PASS` 或 `SKIP`（不取 `FAIL`）：`npm install` 设 30s 超时（bash 工具 timeout=30000），超时/失败（外网无法访问内网源）记 `SKIP`；整体 `status` 不因 `SKIP` 判 `FAIL`。

## 硬约束（转换时必须遵守）

1. **不换组件库**：保持 antd 5，不引入 `@nce/eview-react`（那是 antd-to-eview-react 的工作）
2. **不换 Provider 体系**：保持 antd `ConfigProvider` + `zhCN` locale，不加 `IntlProvider`
3. **保留源项目暗色方案**：`.dark` 类挂 `<html>`（CSS 变量翻转）+ antd `ConfigProvider theme.darkAlgorithm`（antd 组件暗色），两套并行
4. **token CSS 外置**：`:root` 变量只放 `tokens.css`，`.dark` 只放 `theme-dark.css`，不混在选择器规则里
5. **相对导入不能有 `./src/...`**：`src/app.jsx` 导入同级用 `./context.jsx`，导入视图用 `./views/X.jsx`；`src/views/X.jsx` 导入上层数据用 `../data.js`
6. **图标组件保留源项目原版**：搬入源项目的 `icon.jsx`（含 Lucide 兜底 + icon-plus 在线），不剥离 Lucide、不换 icon+ 静态 import（那是 antd-to-eview-react 的工作）。vite.config.js 已配 icon-plus proxy + transform
7. **不引入 eview-react 相关依赖**：不装 `@nce/eview-react` / `react-intl` / `@cloudsop/horizon` 等

## 步骤 3 派发子 agent：搬代码 + 修路径

步骤 3 是上下文消耗最高的步骤（要读源项目所有 jsx 文件、搬入、修路径）。派发 general 子 agent。

**任务描述模板：**

```
把源项目代码搬入目标 antd Vite 工程并修正路径：

源项目路径：<源UMD文件所在目录>
目标工程根：<目标工程根>

操作：
1. 把源项目 src/ 下的独立文件（或 _extracted/ 下的提取文件）搬入 <目标工程根>/src/
   - 保持目录结构（src/views/、src/components/ 等）
   - 搬入源项目的 icon.jsx 到 src/shared/icon.jsx 或 src/assets/shared/icon.jsx（保持源项目路径）
   - app.jsx 用源项目的版本替换 scaffold 的空壳 app.jsx，但保留暗色切换逻辑
     （.dark 类 + ConfigProvider theme.darkAlgorithm）
2. 修正所有相对导入路径：
   - ./src/context.jsx → ./context.jsx
   - ./src/views/X.jsx → ./views/X.jsx
   - ./src/data.js → ./data.js
3. 确保 main.jsx 的 ConfigProvider 包裹 App（antd ConfigProvider + zhCN，已在 scaffold 配好）
4. 如果源项目的 app.jsx 里有 ConfigProvider locale/theme，保留它们（嵌套在 App 内或提到 main.jsx）

读 <skill目录>/references/umd-structure.md 了解 UMD 源项目结构。

输出：改了哪些文件 + 每个文件做了什么 + 遗留问题
```

## 步骤 4 派发子 agent：验证

**测试结果文件**（主 agent 判定依据）：`<目标工程根>/.conversion-result.json`。

**任务描述模板：**

```
对 <目标工程根> 执行 UMD 转换验证：
1. 跑 node <skill目录>/scripts/check-relative-imports.cjs <目标工程根>，报告 unresolved imports
2. cd <目标工程根> && npm install（bash 工具 timeout=30000）；超时或失败（外网无法访问内网源）记 SKIP 不算失败

完成后必须：
1. 把结果写入 <目标工程根>/.conversion-result.json（覆盖写），JSON 结构：
   {
     "status": "PASS" 或 "FAIL",
     "round": {round},
     "failures": ["失败点 1", ...],
      "checks": {
        "relative-imports": "PASS/FAIL",
        "npm-install": "PASS/SKIP"
      },
     "notes": "可选说明"
   }
2. 在最终回复返回 PASS/FAIL。

本轮轮号：{round}
```

**循环上限**：默认 5 轮。第 5 轮仍 FAIL 必须停止，向用户报告失败项 + 建议人工介入。

## 步骤 5：下游评估前置（可选，利用主 agent 余量）

> 利用 umd-to-antd-vite 主 agent 在步骤 4 验证 PASS 后的剩余上下文，把 `antd-to-eview-react` 步骤 0 的"组件分类评估"工作前置完成，写入 `.umd-conversion.json` 的 `migrationPlan` 字段。下游步骤 0 优先读此字段，跳过读 `component-mapping.md` 大表对照，减轻下游主 agent 上下文压力。

### 何时做 / 何时跳过

- **做**：步骤 4 `.conversion-result.json` status=PASS 且主 agent 余量充足（能容纳 `component-mapping.md` 约 110 行 + 评估输出）。用户打算继续迁移到 eview-react。
- **跳过**（`migrationPlan` 保持 `null`，下游回退原流程）：余量不足；`component-mapping.md` 路径找不到；用户只要工程标准化不继续迁移。

### 操作

1. **定位 `component-mapping.md`**（只读引用，由 antd-to-eview-react skill 维护）：
   - 优先 `../antd-to-eview-react/references/component-mapping.md`（相对本 skill 目录的同级，`~/.opencode/skills/` 与本仓库 `skill大乱炖/` 两种安装形态下均成立）
   - 次选：glob 在 `~/.opencode/skills/` 下找 `antd-to-eview-react/references/component-mapping.md`
   - 仍找不到 → 跳过步骤 5（不报错，下游回退）
2. **读 `.umd-conversion.json` 的 `antdComponents`**：keys = 组件清单，values = 涉及文件列表。
3. **读 `component-mapping.md`**，按 antd-to-eview-react SKILL.md "组件映射总表"口径给每个组件分类：
   - **A 有对应**：eview-react 有同名/功能等价组件，改 props 即可。`eview`=替换名，`keyDiffs`从映射表"关键 API 差异"列摘一句，`ref`=`components/<名>.md`
   - **B 无对应需手写**：`eview`="手写"，`ref`=`handwrite-templates.md §X`（映射表标了章节号的填，未标的只写文件名）
   - **C 模式转换**：`Form`/`Form.Item`、`Steps`、`Modal`/`Modal.confirm`。`ref`=`form-migration.md`（Form/Steps）或 `components/Dialog.md`（Modal）
4. **写入 `migrationPlan` 数组**到 `.umd-conversion.json`。

### 范围边界（只做"是什么"，不做"怎么做"）

- ✅ 做：分类（A/B/C）、eview-react 替换名、关键差异**摘要**（一行）、涉及文件、下游 reference 指引
- ❌ 不做：抄 `form-migration.md` / `handwrite-templates.md` / `components/*.md` 全文；引入 eview-react 依赖；改源代码；替换组件（那是下游步骤 3 的工作）

### `migrationPlan` 结构

```json
"migrationPlan": [
  { "antd": "Button", "category": "A", "eview": "Button", "keyDiffs": "type→status；纯图标按钮用 IconButton", "ref": "components/Button.md", "files": ["src/views/AppShell.jsx"] },
  { "antd": "Form", "category": "C", "eview": "Form", "keyDiffs": "useForm→useRef；validateFields Promise→submit+onSuccess", "ref": "form-migration.md", "files": ["src/views/DeviceForm.jsx"] },
  { "antd": "Layout", "category": "B", "eview": "手写", "keyDiffs": "无对应，CSS 布局", "ref": "handwrite-templates.md §4", "files": ["src/views/AppShell.jsx"] }
]
```

> `antdIcons` 同理可补 `migrationPlan`（图标走 scaffold shim，调用点零改动，仅改 import 路径；可标 `category:"A"` `eview:"shim 复用"` `ref:"components/Icon.md 渲染方式 A"`）。非必需，按余量决定。

## 与 antd-to-eview-react 的衔接

本 skill 产出标准 antd Vite 工程后，可直接用 `antd-to-eview-react` skill 继续迁移到 eview-react。

衔接要点：

1. **antd-to-eview-react 步骤 1 跑 `--upgrade` 模式（不跳过）**：产出的是 antd Vite 骨架（antd 依赖 + antd `ConfigProvider`），下游需用 `init-scaffold.cjs --force --upgrade` 把骨架换成 eview-react（换依赖 / Provider / `aui3_1` body 类 / 字体），`--upgrade` 保留本 skill 已外置到 `src/styles/` 的 token CSS
2. **步骤 2 换 Provider**：移除源项目 `app.jsx` 里的 antd `ConfigProvider` + `theme.darkAlgorithm`，换 eview-react `ConfigProvider` + `IntlProvider` + `<body>` 的 `aui3_1` / `aui3_1_dark` 类
3. **token CSS 已外置、无需重提**：`tokens.css` + `theme-dark.css` 已在步骤 2 提取好，下游步骤 1 的 `--upgrade` 会原样保留（不重新跑 `extract-umd.cjs`）
4. **相对导入已修正**：`check-relative-imports.cjs` 已跑过，路径正确——下游步骤 4 验证里此子项跳过（但 `check-i18n-keys.cjs` + `npm install` 仍照跑；`npm install` 设 30s 超时，外网超时记 SKIP 不判 FAIL）
5. **代码只有一份**：双份代码已在步骤 3 归一
6. **评估清单已前置（若步骤 5 已跑）**：`migrationPlan` 非 `null` 时，下游步骤 0 直接读它作为组件分类评估清单（A/B/C + 替换名 + 关键差异 + 涉及文件 + reference 指引），跳过读 `component-mapping.md` 大表对照；为 `null` 时下游回退原流程（读 `antdComponents` + 手动对照 `component-mapping.md`）

向用户报告时说明：本 skill 完成的是"工程标准化"，后续 antd-to-eview-react 完成"组件库替换"。两步法的好处是 antd-to-eview-react 的步骤 3（逐组件替换）可以纯聚焦于组件替换，不用同时处理基础设施问题。
