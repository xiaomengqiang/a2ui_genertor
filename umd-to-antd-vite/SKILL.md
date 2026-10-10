---
name: umd-to-antd-vite
description: >-
  把 ict-react-coder 产出的 UMD 单 HTML 工程（index.page.html + 内联 token CSS + Babel-standalone 转译 + 双份代码）转换为标准 eview-react Vite + npm 工程的专项 Skill。提供 scaffold 预制骨架（一键拷贝 eview-react Vite 空壳）、extract-umd.cjs 自动提取内联 token CSS（:root/.dark/@font-face 分类外置到独立文件）、check-relative-imports.cjs 排查路径错误。工作流为混合编排：主 agent 亲自跑脚本搭骨架+提取内容（步骤 1-2），派发 general 子 agent 搬代码修路径+验证（步骤 3-4）；验证结果写入 .conversion-result.json 供主 agent 判定。产出的 eview-react Vite 工程可直接衔接 antd-to-eview-react skill 继续把业务代码的 antd 组件替换为 @nce/eview-react（骨架已是 eview-react，下游不再跑 init-scaffold.cjs；保留本 skill 外置的 token CSS）。务必在以下场景使用：把 ict-react-coder 产物的 UMD 单 HTML 转成标准 React 工程、需要外置内联 token CSS 到独立文件、想标准化工程结构以降低后续组件库迁移成本、用户提供了 index.page.html 并要求转成 React 项目、需要为 antd-to-eview-react 迁移做前置工程标准化、想把 UMD 内联的 666+ 个 CSS 变量提取到 tokens.css + theme-dark.css。
---

# UMD → antd Vite 工程标准化 Skill

## 核心问题

从 ict-react-coder 产出的 UMD 单 HTML 工程转换为标准 Vite + npm 工程时的典型问题：

- **token CSS 全量丢失**：源项目 1000+ 行内联 `<style>` 里有 666 个 CSS 变量定义（三层 `:root` + `.dark` 暗色覆盖），迁移到 Vite 后 HTML 不能用，变量全丢。`extract-umd.cjs` 自动按选择器分类提取到 `tokens.css` / `theme-dark.css` / `font.css` / `base.css`
- **双份代码一致性**：源项目 `index.page.html` 内联版 vs `src/` 独立版两份代码，需判断以哪份为准。`extract-umd.cjs` 自动列出 `src/` 文件清单，优先用独立文件
- **相对 import 路径错位**：源项目根目录 `app.jsx` 写 `./src/context.jsx`，搬进 scaffold 的 `src/app.jsx` 后变成错误的 `src/src/context.jsx`。`check-relative-imports.cjs` 自动扫描
- **无 package.json / vite.config.js**：UMD 工程用 Babel-standalone 浏览器内转译，无构建工具。scaffold 预制 eview-react Vite 空壳，`init-scaffold.cjs` 一键拷贝
- **图标运行时 fetch 跨域**：源项目 icon 组件用 icon-plus 在线服务（绝对 URL），Vite dev 下跨域。vite.config.js 预配 proxy + transform 插件

## 前置条件

1. **源项目**：须为 ict-react-coder 产出的 UMD 单 HTML 工程。结构特征：`index.page.html`（含 UMD script 标签 + 内联 CSS + Babel-standalone + 内联 jsx 模块）+ `src/` 双份代码 + antd 5 + 内联 token CSS + Lucide 图标 + icon-plus 在线
2. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可用
3. **网络**：antd 在公共 npm 源，不需要内网/VPN。icon-plus 在线（`octo.hdesign.huawei.com`）需要内网——但仅影响图标渲染，不影响工程转换与验证

## 迁移工作流（5 步）

| 步骤 | 做什么 | 产出 | 执行方式 |
|------|--------|------|---------|
| **1. 搭骨架** | 跑 `init-scaffold.cjs` 拷贝 eview-react Vite 空壳（package.json/vite.config.js/index.html/main.jsx/styles/字体/icon shim） | 可运行的 eview-react 空壳工程 | 主 agent 跑脚本 |
| **2. 提取 UMD 内容** | 跑 `extract-umd.cjs` 从源项目 `index.page.html` 提取：`:root` → tokens.css、`.dark` → theme-dark.css、`@font-face` → font.css、其他 → base.css 追加；扫描 antd 组件导入（组件→文件映射 + 图标列表）；扫描 i18n 用法判定 scenario A/B/C + 业务包/antd-locale 文件路径；生成 `.umd-conversion.json` 交接文件供 antd-to-eview-react 读取；无 `src/` 时加 `--scripts` 提取 script 块 | token 外置 + antd 清单 + i18n scenario + 交接文件 | 主 agent 跑脚本 |
| **3. 搬代码 + 修路径 + 转暗色 + i18n 接线** | 把源项目 `src/` 独立文件搬进 scaffold `src/`；修正 `./src/...` → `./...` 相对导入；`app.jsx` 搬入时删除 antd `ConfigProvider` + `theme.darkAlgorithm`，换成 eview 类名切换 `useEffect`；按 `i18nScenario` 做 i18n 静态接线（删 antd locale 文件；scenario B 合并业务包到 `main.jsx`；scenario C 留下游） | 代码就位，import 正确，暗色已转，i18n A/B 接线完成 | 派发 general 子 agent |
| **4. 验证** | 跑 `check-relative-imports.cjs` 静态检查 ；验证通过后更新 `.umd-conversion.json` 的 `verification` 字段 | import 通过 + 交接文件就绪 | 主 agent |
| **5. 下游评估** | 读 antd-to-eview-react 的 `references/component-mapping.md`，对照 `antdComponents` 给每组件分类（A 有对应 / B 无对应手写 / C 模式转换）+ eview-react 替换名 + 关键差异摘要 + 涉及文件 + 下游 reference 指引，写入 `.umd-conversion.json` 的 `migrationPlan` 字段。**始终执行**——不依赖步骤 4 PASS，`antdComponents` 在步骤 2 已就绪 | 下游步骤 0 评估清单就绪 | 主 agent |

## scaffold 预制骨架

骨架由本 skill 的 `scaffold/` 目录维护，步骤 1 一键拷贝。骨架已含 eview-react 依赖、`aui3_1` body 类、`ConfigProvider` + `IntlProvider`、HarmonyOS 字体、icon shim（`src/shared/Icon/`，folder + 默认导出）；`vite.config.js` 预配 `@`→`./src` 别名 + icon-plus proxy/transform；`src/shared/` 下 Select/TextField/InputSelect/MultipleSelect/SearchInput/TextArea 包壳组件（透明转发 `@nce/eview-react`，供下游 antd-to-eview-react 从 `@/shared/X` 导入）。`src/styles/` 下 `tokens.css` / `theme-dark.css` 为空壳占位，步骤 2 填充；`base.css` / `font.css` 预制不用改。

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

5. **生成交接文件**：写入 `<目标工程根>/.umd-conversion.json`，包含 antd 组件清单、token 统计、src/ 文件清单、暗色方案、验证状态（`verification` 初始为 `null`，步骤 4 更新）、下游评估清单（`migrationPlan` 初始为 `null`，步骤 5 始终填充）

输出报告含：token 变量数、规则数、src/ 文件清单、antd 组件数、antd 图标数、交接文件路径。

### 交接文件 `.umd-conversion.json`

供 `antd-to-eview-react` skill 读取，避免重复扫描源项目。结构：

```json
{
  "skill": "umd-to-antd-vite",
  "sourceFile": "index.page.html",
  "projectName": "xxx",
  "antdComponents": { "Button": ["src/views/AppShell.jsx"], "Select": ["src/views/DeviceForm.jsx"] },
  "antdIcons": ["SearchOutlined", "SunOutlined"],
  "tokens": { "rootVarCount": 666, "darkVarCount": 200, "cssFiles": ["src/styles/tokens.css"] },
  "srcFiles": ["src/context.jsx", "src/data.js"],
  "darkMode": { "method": "css-vars + aui3_1_dark class", "darkClass": ".dark on <html> + aui3_1_dark on <body>" },
  "i18nScenario": {
    "scenario": "A",
    "reactIntl": { "used": false, "files": [] },
    "i18next": { "used": false, "files": [] },
    "antdLocaleImports": [],
    "antdLocaleFiles": [],
    "businessLocaleFiles": [],
    "hasDayjs": false,
    "wired": true
  },
  "verification": null,
  "migrationPlan": null,
  "notes": ""
}
```

`antd-to-eview-react` 步骤 0 检查此文件：有则直接读 `antdComponents` 的 keys 作为迁移清单（跳过 explore 子 agent 扫描），读 `tokens` 确认 token 已外置（跳过步骤 4），读 `verification` 确认路径已修正（跳过 `check-relative-imports.cjs`），读 `i18nScenario.wired` 确认 i18n 静态接线状态（`true` 即 A/B 已由步骤 3 接线完成，下游步骤 1 跳过接线只做运行时验证；`false` 即 scenario C，下游步骤 1 做 keep i18next vs 迁 react-intl 决策）。**`migrationPlan` 由步骤 5 始终填充，下游步骤 0 直接读它作为分类评估清单（A/B/C + 替换名 + 关键差异 + 涉及文件 + reference 指引），跳过读 `component-mapping.md` 大表对照。**

步骤 4 验证通过后，更新 `verification` 字段：

```json
"verification": { "relativeImports": "PASS" }
```

## 硬约束（转换时必须遵守）

1. **不换组件库**：业务代码（app.jsx、views/*、components/*）保持 antd 5 组件导入，不替换为 `@nce/eview-react` 组件（那是 antd-to-eview-react 的工作）；main.jsx 的 eview-react `ConfigProvider` / `locales` 属 scaffold 预设，不在此约束范围
2. **Provider 体系由 scaffold 定型，不在业务代码另设**：main.jsx 已预设 eview-react `ConfigProvider` + react-intl `IntlProvider`（`locale='zh'` + `componentsLocales`），步骤 3 删除 app.jsx 的 antd `ConfigProvider`（含 `zhCN` locale + `theme.darkAlgorithm`），不在业务代码另加 Provider；业务语言包合并到 `IntlProvider` messages 留给下游 antd-to-eview-react 步骤 1
3. **保留源项目暗色方案（CSS 类切换）**：`.dark` 挂 `<html>`（token 变量翻转）+ `aui3_1_dark` 挂 `<body>`（eview 暗色 CSS），步骤 3 删除 antd `ConfigProvider theme.darkAlgorithm`；antd 组件暗色留待下游替换为 eview-react 后由暗色 CSS 覆盖
4. **token CSS 外置**：`:root` 变量只放 `tokens.css`，`.dark` 只放 `theme-dark.css`，不混在选择器规则里
5. **相对导入不能有 `./src/...`**：`src/app.jsx` 导入同级用 `./context.jsx`，导入视图用 `./views/X.jsx`；`src/views/X.jsx` 导入上层数据用 `../data.js`
6. **图标组件保留源项目原版**：搬入源项目的 `icon.jsx` 内容到 `src/shared/Icon/Icon.jsx`（`export function Icon`→`export default function Icon`，scaffold 的 `index.jsx` 桶 `export { default } from './Icon.jsx'` 已就位），不剥离 Lucide、不换 icon+ 静态 import（那是 antd-to-eview-react 的工作）。vite.config.js 已配 icon-plus proxy + transform
7. **不在业务代码引入额外 eview-react 依赖**：scaffold package.json 已预设 `@nce/eview-react` / `react-intl` / `@cloudsop/horizon` 等（骨架自带，不算转换时引入）；scaffold 预置的 `src/shared/` 包壳组件（Select/TextField 等）属 baseline，同上不算转换时引入——新增包壳须同步 antd-to-eview-react 的「包壳组件清单」（硬约束 #1）。业务代码保持 antd 组件导入，不替换为 `@nce/eview-react` 组件、不另装额外依赖（组件替换是 antd-to-eview-react 的工作）

## 步骤 3：搬代码 + 修路径

步骤 3 是上下文消耗最高的步骤（要读源项目所有 jsx 文件、搬入、修路径）。派发 general 子 agent。

**任务描述模板：**

```
把源项目代码搬入目标 eview-react Vite 工程并修正路径 + i18n 静态接线：

源项目路径：<源UMD文件所在目录>
目标工程根：<目标工程根>

操作：
1. 把源项目 src/ 下的独立文件（或 _extracted/ 下的提取文件）搬入 <目标工程根>/src/
   - 保持目录结构（src/views/、src/components/ 等）
   - 搬入源项目 icon.jsx 内容到 src/shared/Icon/Icon.jsx（`export function Icon`→`export default function Icon`，scaffold 的 index.jsx 桶 `export { default } from './Icon.jsx'` 已就位）；业务代码 `import { Icon } from ".../assets/shared/icon.jsx"` → `import Icon from "@/shared/Icon"`（默认导入，`@` 别名已由 vite.config.js 预配）
   - app.jsx 用源项目的版本替换 scaffold 的空壳 app.jsx，同时转换暗色模式：
     a. 删除 antd ConfigProvider（含 locale + theme.darkAlgorithm），eview-react ConfigProvider + IntlProvider 已在 main.jsx 配好
     b. 保留源项目的 isDark 状态和切换 UI
     c. 加 useEffect 切类名：
        useEffect(() => {
            document.body.classList.toggle('aui3_1_dark', isDark);
            document.documentElement.classList.toggle('dark', isDark);
        }, [isDark]);
2. 修正所有相对导入路径：
   - ./src/context.jsx → ./context.jsx
   - ./src/views/X.jsx → ./views/X.jsx
   - ./src/data.js → ./data.js
3. i18n 静态接线（读 .umd-conversion.json 的 i18nScenario 字段）：
   - 删除源项目里的 antd locale 导入（i18nScenario.antdLocaleImports 列出）和自写 antd locale 文件（i18nScenario.antdLocaleFiles，如 antd-zh-cn.js）
   - scenario A（硬编码中文）: main.jsx 不改（scaffold 的 IntlProvider + componentsLocales 已就绪）
   - scenario B（源用 react-intl）:
     a. 搬 i18nScenario.businessLocaleFiles 列出的业务语言包到 <目标工程根>/src/ 下，保持原路径
     b. 改 main.jsx: 合并 componentsLocales + 业务包成 mergedMessages，IntlProvider messages={mergedMessages[locale]}；若源项目有动态语言切换（lang state in context）用 Root 包裹结构（见 antd-to-eview-react/references/i18n-migration.md §4.1），否则简单合并即可
     c. 业务代码里的 <FormattedMessage>/useIntl() 不用改（react-intl 同一套库）
   - scenario C（源用 i18next）: 本步骤不合并业务包到 main.jsx，留给下游 antd-to-eview-react 步骤 1 做 keep i18next vs 迁 react-intl 决策；但仍要删 antd locale 导入/文件
   - 若 i18nScenario.hasDayjs 且项目用到 dayjs 中文星期/月份: 按 i18n-migration.md §5 在 main.jsx 单独 import 'dayjs/locale/zh-cn' + dayjs.locale() 同步（运行时是否真需要下游验证）

读 <skill目录>/references/umd-structure.md 了解 UMD 源项目结构。
读 <antd-to-eview-react skill 目录>/references/i18n-migration.md §4/§5 了解 scenario B 的 main.jsx 合并结构与 dayjs locale 注册。

输出：改了哪些文件 + 每个文件做了什么 + i18n scenario + 遗留问题
```

## 步骤 4 派发子 agent：验证

**测试结果文件**（主 agent 判定依据）：`<目标工程根>/.conversion-result.json`。

**任务描述模板：**

```
对 <目标工程根> 执行 UMD 转换验证：
1. 跑 node <skill目录>/scripts/check-relative-imports.cjs <目标工程根>，报告 unresolved imports

完成后必须：
1. 把结果写入 <目标工程根>/.conversion-result.json（覆盖写），JSON 结构：
   {
     "status": "PASS" 或 "FAIL",
     "round": {round},
     "failures": ["失败点 1", ...],
     "checks": {
       "relative-imports": "PASS/FAIL"
     },
     "notes": "可选说明"
   }
2. 在最终回复返回 PASS/FAIL。

本轮轮号：{round}
```

**循环上限**：默认 5 轮。第 5 轮仍 FAIL 必须停止，向用户报告失败项 + 建议人工介入。

## 步骤 5：下游评估

> 利用 umd-to-antd-vite 主 agent 在步骤 4 后的剩余上下文，把 `antd-to-eview-react` 步骤 0 的"组件分类评估"工作前置完成，写入 `.umd-conversion.json` 的 `migrationPlan` 字段。下游步骤 0 直接读此字段，跳过读 `component-mapping.md` 大表对照，减轻下游主 agent 上下文压力。

### 何时做 / 何时跳过

- **始终执行**：不依赖步骤 4 PASS/FAIL——`migrationPlan` 的输入是 `antdComponents`（步骤 2 已就绪），与路径验证结果无关。步骤 4 FAIL 时仍跑步骤 5，`migrationPlan` 照常填充，用户可据失败项决定是否先修 umd-to-antd-vite 再进下游

### 操作

1. **定位 `component-mapping.md`**（只读引用，由 antd-to-eview-react skill 维护）：
   - 在 `~/.opencode/skills/` 下找 `antd-to-eview-react/references/component-mapping.md`
2. **读 `.umd-conversion.json` 的 `antdComponents`**：keys = 组件清单，values = 涉及文件列表。
3. **读 `component-mapping.md`**，按 antd-to-eview-react SKILL.md "组件映射总表"口径给每个组件分类：
   - **A 有对应**：eview-react 有同名/功能等价组件，改 props 即可。`eview`=替换名，`keyDiffs`从映射表"关键 API 差异"列摘一句，`ref`=`components/<名>.md`
   - **B 无对应需手写**：`eview`="手写"，`ref`=`handwrite-templates.md §X`（映射表标了章节号的填，未标的只写文件名）
   - **C 模式转换**：`Steps`、`Modal`/`Modal.confirm`。`ref`=`components/Steps.md`（Steps）或 `components/Dialog.md`（Modal）
4. **写入 `migrationPlan` 数组**到 `.umd-conversion.json`。

### 范围边界（只做"是什么"，不做"怎么做"）

- ✅ 做：分类（A/B/C）、eview-react 替换名、关键差异**摘要**（一行）、涉及文件、下游 reference 指引
- ❌ 不做：抄 `handwrite-templates.md` / `components/*.md` 全文；引入 eview-react 依赖；改源代码；替换组件（那是下游步骤 3 的工作）

### `migrationPlan` 结构

```json
"migrationPlan": [
  { "antd": "Button", "category": "A", "eview": "Button", "keyDiffs": "type→status；纯图标按钮用 IconButton", "ref": "components/Button.md", "files": ["src/views/AppShell.jsx"] },
  { "antd": "Modal", "category": "C", "eview": "Dialog", "keyDiffs": "open→isOpen；footer→buttons；onClose 不自动关闭", "ref": "components/Dialog.md", "files": ["src/views/DeviceForm.jsx"] },
  { "antd": "Layout", "category": "B", "eview": "手写", "keyDiffs": "无对应，CSS 布局", "ref": "handwrite-templates.md §4", "files": ["src/views/AppShell.jsx"] }
]
```

> `antdIcons` 同理可补 `migrationPlan`（图标走 scaffold shim，调用点零改动，仅改 import 路径；可标 `category:"A"` `eview:"shim 复用"` `ref:"components/Icon.md 渲染方式 A"`）。非必需，按余量决定。

## 与 antd-to-eview-react 的衔接

本 skill 产出 eview-react Vite 工程（骨架已搭好 + token CSS 已外置 + 代码已就位），可直接用 `antd-to-eview-react` skill 继续迁移。

衔接要点：

1. **骨架已是 eview-react**：步骤 1 已用 antd-to-eview-react 的 scaffold 搭好（依赖 / Provider / `aui3_1` body 类 / 字体 / icon shim 均就位），下游不再跑 `init-scaffold.cjs`
2. **下游步骤 1 i18n 设置**：i18n 静态接线已由步骤 3 按 `i18nScenario` 前置完成——scenario A/B 的 `main.jsx` IntlProvider + 业务包合并已就绪（`i18nScenario.wired=true`），下游步骤 1 跳过接线只做运行时验证（DatePicker 中文、Portal MISSING_TRANSLATION）；scenario C（`wired=false`）下游步骤 1 做 keep i18next vs 迁 react-intl 决策。antd ConfigProvider + darkAlgorithm 已在步骤 3 删除换成 eview 类名切换
3. **token CSS 已外置、无需重提**：`tokens.css` + `theme-dark.css` 已在步骤 2 提取好，骨架的 `src/styles/` 原样保留
4. **相对导入已修正**：`check-relative-imports.cjs` 已跑过，路径正确——下游验证里此子项跳过（`check-i18n-keys.cjs` 仍照跑）
5. **代码只有一份**：双份代码已在步骤 3 归一
6. **评估清单已前置**：`migrationPlan` 由步骤 5 始终填充，下游步骤 0 直接读它作为组件分类评估清单（A/B/C + 替换名 + 关键差异 + 涉及文件 + reference 指引），跳过读 `component-mapping.md` 大表对照

向用户报告时说明：本 skill 完成的是"工程标准化 + 骨架搭建"，后续 antd-to-eview-react 完成"Provider 转换 + 组件替换"。
