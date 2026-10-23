---
name: umd-to-antd-vite
description: >-
  把 ict-coder 产出的 UMD 单 HTML 工程（index.page.html + 内联 token CSS + Babel-standalone 转译 + 双份代码）转换为标准 eview-react Vite + npm 工程的专项 Skill。提供 scaffold 预制骨架（一键拷贝 eview-react Vite 空壳）、extract-umd.cjs 从产物 assets/style/ 拷贝 ict-coder 已分好的 base/light/theme/dark 四层 CSS（@font-face 路径改写 /font/、uploads 改写 /uploads/）、check-relative-imports.cjs 排查路径错误。工作流为混合编排：主 agent 亲自跑脚本搭骨架+提取内容（步骤 1-2），派发 general 子 agent 搬代码修路径+验证（步骤 3-4）；验证结果写入 .conversion-result.json 供主 agent 判定。产出的 eview-react Vite 工程可直接衔接 antd-to-eview-react skill 继续把业务代码的 antd 组件替换为 @nce/eview-react（骨架已是 eview-react，下游不再跑 init-scaffold.cjs；保留本 skill 外置的 token CSS）。务必在以下场景使用：把 ict-coder 产物的 UMD 单 HTML 转成标准 React 工程、需要外置内联 token CSS 到独立文件、想标准化工程结构以降低后续组件库迁移成本、用户提供了 index.page.html 并要求转成 React 项目、需要为 antd-to-eview-react 迁移做前置工程标准化、想把 UMD 内联的 666+ 个 CSS 变量提取到 tokens.css + theme-dark.css。
---

# UMD → antd Vite 工程标准化 Skill

## 核心问题

从 ict-coder 产出的 UMD 单 HTML 工程转换为标准 Vite + npm 工程时的典型问题：

- **token CSS 全量丢失**：源项目 1000+ 行内联 `<style>` 里有 666 个 CSS 变量定义（三层 `:root` + `.dark` 暗色覆盖），迁移到 Vite 后 HTML 不能用，变量全丢。`extract-umd.cjs` 直接从产物 `assets/style/` 拷贝 ict-coder 已分好的 `base.css` / `light.css` / `theme.css` / `dark.css` 四层（`ant.css` 跳过，eview-react 用 `aui3_1.css` 替代；`base.css` 的 `@font-face` 路径改写为 Vite `/font/` 绝对路径、`./assets/uploads/` 改写为 `/uploads/`）
- **双份代码一致性**：源项目 `index.page.html` 内联版 vs `src/` 独立版两份代码，需判断以哪份为准。`extract-umd.cjs` 自动列出 `src/` 文件清单，优先用独立文件
- **相对 import 路径错位**：源项目根目录 `app.jsx` 写 `./src/context.jsx`，搬进 scaffold 的 `src/app.jsx` 后变成错误的 `src/src/context.jsx`。`check-relative-imports.cjs` 自动扫描
- **无 package.json / vite.config.js**：UMD 工程用 Babel-standalone 浏览器内转译，无构建工具。scaffold 预制 eview-react Vite 空壳，`init-scaffold.cjs` 一键拷贝
- **图标运行时 fetch 跨域**：源项目 icon 组件用 icon-plus 在线服务（绝对 URL），Vite dev 下跨域。vite.config.js 预配 proxy + transform 插件

## 前置条件

1. **源项目**：须为 ict-coder 产出的 UMD 单 HTML 工程。结构特征：`index.page.html`（含 UMD script 标签 + 内联 CSS + Babel-standalone + 内联 jsx 模块）+ `src/` 双份代码 + antd 5 + 内联 token CSS + Lucide 图标 + icon-plus 在线
2. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可用
3. **网络**：antd 在公共 npm 源，不需要内网/VPN。icon-plus 在线（`octo.hdesign.huawei.com`）需要内网——但仅影响图标渲染，不影响工程转换与验证

## 迁移工作流（5 步）

| 步骤 | 做什么 | 产出 | 执行方式 |
|------|--------|------|---------|
| **1. 搭骨架** | 跑 `init-scaffold.cjs` 拷贝 eview-react Vite 空壳（package.json/vite.config.js/index.html/main.jsx/styles/字体/icon shim） | 可运行的 eview-react 空壳工程 | 主 agent 跑脚本 |
| **2. 提取 UMD 内容** | 跑 `extract-umd.cjs` 从源产物 `assets/style/` 拷贝 ict-coder 已分好的 4 层 CSS：`base.css`（基础色阶+尺寸+排版+间距+@font-face+reset+scrollbar，`@font-face` 路径改写 `/font/`、uploads 路径改写 `/uploads/`，append 到 scaffold 预制 base.css 的 eview 专用样式后）/ `light.css`（语义层 :root）/ `theme.css`（角色层 :root）/ `dark.css`（.dark 覆盖）三个 write 覆盖空壳；`ant.css` 跳过（eview 用 `aui3_1.css`）；扫描 antd 组件导入（组件→文件映射 + 图标列表）；**扫描 `<Icon name>` 调用点**（字面量/动态/无 name，供下游图标步骤预定位）；**扫描 `<IpInput>` 调用点 + 手写共享件**（§4.7，ict-coder 内置 IPInput 非 antd 导入，extract-umd 默认扫不到）；**扫描 `<Chart>` 调用点 + 内置共享件**（§4.9，ict-coder 内置 Chart 非 antd 导入，extract-umd 默认扫不到）；**拷贝 `assets/uploads/` 图片资源到 `public/uploads/`**（§4.8）；扫描 i18n 用法判定 scenario A/B/C + 业务包/antd-locale 文件路径；生成 `.umd-conversion.json` 交接文件供 antd-to-eview-react 读取；无 `src/` 时加 `--scripts` 提取 script 块 | base/light/theme/dark 四层 CSS + antd 清单 + icon 调用点 + IPInput 调用点 + Chart 调用点 + uploads 图片资源 + i18n scenario + 交接文件 | 主 agent 跑脚本 |
| **3. 搬代码 + 修路径 + 转暗色 + i18n 接线** | 把源项目 `src/` 独立文件搬进 scaffold `src/`；修正 `./src/...` → `./...` 相对导入；`app.jsx` 搬入时删除 antd `ConfigProvider` + `theme.darkAlgorithm`，换成 eview 类名切换 `useEffect`；按 `i18nScenario` 做 i18n 静态接线（删 antd locale 文件；scenario B 合并业务包到 `main.jsx`；scenario C 留下游） | 代码就位，import 正确，暗色已转，i18n A/B 接线完成 | 派发 general 子 agent |
| **4. 验证** | 跑 `check-relative-imports.cjs` 静态检查；验证通过后更新 `.umd-conversion.json` 的 `verification` 字段 | import 通过 + 交接文件就绪 | 子 agent（步骤 3 续做） |
| **5. 下游评估** | 跑 `build-migration-plan.cjs`：读 `.umd-conversion.json` 的 `antdComponents` + antd-to-eview-react 的 `component-mapping.md`，自动给每组件分类（A/B/C）+ eview-react 替换名 + importPath + shellComponent 标志 + 完整 keyDiffs（映射表原文）+ ref 指引 + 涉及文件，写入 `migrationPlan` 字段；同时写入 `globalRef`（静态拼写异常 + 回调签名速查表）。**始终执行**——不依赖步骤 4 PASS，`antdComponents` 在步骤 2 已就绪 | 下游步骤 0 enriched 评估清单就绪 | 脚本（主 agent 跑 `node scripts/build-migration-plan.cjs <目标工程根>`） |

## scaffold 预制骨架

骨架由本 skill 的 `scaffold/` 目录维护，步骤 1 一键拷贝。骨架已含 eview-react 依赖、`aui3_1` body 类、`ConfigProvider` + `IntlProvider`、HarmonyOS 字体、icon shim（`src/shared/Icon/`，folder + 默认导出）；`vite.config.js` 预配 `@`→`./src` 别名 + icon-plus proxy/transform；`src/shared/` 下 Select/TextField/InputSelect/MultipleSelect/SearchInput/TextArea/Tag/DatePicker/Spinner/Steps/Cascader/TreeSelector/IPInput/TimePicker 包壳组件（多数透明转发 `@nce/eview-react` 供下游 antd-to-eview-react 从 `@/shared/X` 导入；Steps 包壳附带尺寸类名 xs/sm/lg 与 dot 模式样式见同目录 Steps.css；Cascader 为手写组件 API 基本同 antd）。`src/styles/` 下 `light.css` / `theme.css` / `dark.css` 为空壳占位，步骤 2 从产物 `assets/style/` 拷贝填充；`base.css` 预制 eview 专用样式（`ev_no_wcag`/`ev_form_item`），步骤 2 append ict `base.css`（`@font-face` 路径改写 `/font/`）。

用法：`node <skill目录>/scripts/init-scaffold.cjs <目标工程根> [项目名] [标题] [--force]`

## extract-umd.cjs：自动提取内联内容

这是本 skill 的核心脚本，机械化完成最耗 token 的 token CSS 提取工作。

```bash
node <skill目录>/scripts/extract-umd.cjs <源UMD文件路径> <目标工程根> [--scripts]
```

脚本自动完成：

1. **拷贝 `assets/style/` 4 层 CSS**（ict-coder 已分好类，对齐 ict 的 base/light/theme/dark 四分类）：
   - `base.css` → `src/styles/base.css`（append 到 scaffold 预制的 eview 专用样式后；`@font-face` 路径 `../font/` 改写为 `/font/`、`./assets/uploads/` 改写为 `/uploads/`）
   - `light.css` → `src/styles/light.css`（语义层 :root，`--color-*` 变量）
   - `theme.css` → `src/styles/theme.css`（角色层 :root，`--primary`/`--surface`/`--font-body-*` 等）
   - `dark.css` → `src/styles/dark.css`（.dark 暗色覆盖）
   - `ant.css` 跳过（eview-react 用 `aui3_1.css` 替代，不需 antd 组件换肤层）

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
  "iconCallSites": [{ "file": "src/views/AppShell.jsx", "line": 42, "name": "search", "type": "literal" }],
  "ipInputCallSites": { "sharedFiles": ["assets/shared/ip-input.jsx"], "imports": [], "callSites": [{ "file": "src/views/DeviceForm.jsx", "line": 15, "component": "IpInput", "props": "type=\"ipv4\"" }] },
  "chartCallSites": { "sharedFiles": ["assets/shared/chart.jsx"], "imports": [{ "file": "src/views/Dashboard.jsx", "importName": "Chart", "source": "./assets/shared/chart.jsx" }], "callSites": [{ "file": "src/views/Dashboard.jsx", "line": 30, "name": "BarChart", "type": "literal" }] },
  "styles": { "source": "assets/style", "files": ["base.css","light.css","theme.css","dark.css"], "cssFiles": ["src/styles/base.css","src/styles/light.css","src/styles/theme.css","src/styles/dark.css"] },
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
  "globalRef": null,
  "notes": ""
}
```

`antd-to-eview-react` 步骤 0 检查此文件：有则直接读 `antdComponents` 的 keys 作为迁移清单（跳过 explore 子 agent 扫描），读 `migrationPlan`（步骤 5 `build-migration-plan.cjs` 生成的 enriched 版，含 importPath/shellComponent/full keyDiffs）作为分类评估清单，**A 类组件无需再读 `component-mapping.md` 或 `components/<Name>.md`**，仅 B/C 类按 `ref` 指引读对应 reference；读 `globalRef` 获取静态拼写异常 + 回调签名速查表（跳过读 `component-mapping.md` 文末速查表）；读 `iconCallSites` 获取 `<Icon name>` 调用点预扫描结果（跳过 grep，直接跑 `match-icons.cjs`）；读 `chartCallSites` 获取 `<Chart>` 调用点预扫描结果（Chart 已由 `build-migration-plan.cjs` 注入 migrationPlan，下游步骤 0/2 直接见迁移行 + `a2ui: true`/`theme` 补全提醒）；读 `tokens` 确认 token 已外置（跳过步骤 4）；读 `verification` 确认路径已修正（跳过 `check-relative-imports.cjs`）；读 `i18nScenario.wired` 确认 i18n 静态接线状态（`true` 即 A/B 已由步骤 3 接线完成，下游步骤 1 跳过接线只做运行时验证；`false` 即 scenario C，下游步骤 1 做 keep i18next vs 迁 react-intl 决策）。**`migrationPlan` + `globalRef` 由步骤 5 `build-migration-plan.cjs` 脚本生成，下游步骤 0 直接读，跳过手动对照大表 + 组件文档，显著降低下游上下文压力。**

步骤 4 验证通过后，更新 `verification` 字段：

```json
"verification": { "relativeImports": "PASS" }
```

## 硬约束（转换时必须遵守）

1. **不换组件库**：业务代码（app.jsx、views/*、components/*）保持 antd 5 组件导入，不替换为 `@nce/eview-react` 组件（那是 antd-to-eview-react 的工作）；main.jsx 的 eview-react `ConfigProvider` / `locales` 属 scaffold 预设，不在此约束范围
2. **Provider 体系由 scaffold 定型，不在业务代码另设**：main.jsx 已预设 eview-react `ConfigProvider` + react-intl `IntlProvider`（`locale='zh'` + `componentsLocales`），步骤 3 删除 app.jsx 的 antd `ConfigProvider`（含 `zhCN` locale + `theme.darkAlgorithm`），不在业务代码另加 Provider；业务语言包合并到 `IntlProvider` messages 留给下游 antd-to-eview-react 步骤 1
3. **保留源项目暗色方案（CSS 类切换）**：`.dark` 挂 `<html>`（token 变量翻转）+ `aui3_1_dark` 挂 `<body>`（eview 暗色 CSS），步骤 3 删除 antd `ConfigProvider theme.darkAlgorithm`；antd 组件暗色留待下游替换为 eview-react 后由暗色 CSS 覆盖
4. **CSS 四层分类对齐 ict-coder**：`base.css`（基础色阶+@font-face+reset+scrollbar）、`light.css`（语义层 :root `--color-*`）、`theme.css`（角色层 :root `--primary`/`--surface`/`--font-body-*`）、`dark.css`（`.dark` 暗色覆盖）四文件对齐 ict 的 base/light/theme/dark 分类；`ant.css` 不搬（eview 用 `aui3_1.css` 替代）
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

## 步骤 4：验证（步骤 3 子 agent 续做）

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

## 步骤 5：下游评估（脚本自动化）

> 跑 `build-migration-plan.cjs` 自动完成组件分类评估，无需主 agent 手动读 `component-mapping.md`。

### 何时做 / 何时跳过

- **始终执行**：不依赖步骤 4 PASS/FAIL——`migrationPlan` 的输入是 `antdComponents`（步骤 2 已就绪）

### 操作

```bash
node <skill目录>/scripts/build-migration-plan.cjs <目标工程根>
```

脚本自动完成：
1. 读 `.umd-conversion.json` 的 `antdComponents`
2. 读 antd-to-eview-react 的 `references/component-mapping.md`，解析映射总表
3. 对每个 antd 组件匹配映射行，分类 A/B/C + eview 替换名 + importPath（含 @/shared/ 包壳检测 + `SHELL_COMPONENTS` 硬编码列表兜底 Steps 等无 `@/shared/` keyDiffs 的包壳）+ shellComponent 标志 + 完整 keyDiffs（映射表原文，非摘要）+ ref 指引
4. 写入 `globalRef`：静态拼写异常速查表（seprator/taggledChildren/disable/status/defaultLabel/toggled/iconSize）+ 回调签名速查表（TextField/Select/TextArea/Button/Tab/Toggle/Spinner/Checkbox/Radio/DragInput/TreeSelector 等 13 条）
5. 写回 `.umd-conversion.json` 的 `migrationPlan` + `globalRef` 字段

> `--skill-dir <dir>` 可显式指定 antd-to-eview-react skill 目录；不指定时脚本自动查找（先找同级目录，再找 `~/.opencode/skills/`）。

### `migrationPlan` 结构（enriched）

```json
"migrationPlan": [
  { "antd": "Button", "category": "A", "eview": "Button", "importPath": "@nce/eview-react/Button", "shellComponent": false, "keyDiffs": "type→status（default/primary/risk/text）；无 loading/htmlType/danger...", "ref": "components/Button.md", "files": ["src/views/AppShell.jsx"] },
  { "antd": "Select", "category": "A", "eview": "Select", "importPath": "@/shared/Select", "shellComponent": true, "keyDiffs": "options 字段 label→text；placeholder→defaultLabel；onChange(value,oldValue,text,oldText,event) 五参...", "ref": "components/Select.md", "files": ["src/views/DeviceForm.jsx"] },
  { "antd": "Steps", "category": "C", "eview": "Steps", "importPath": "@/shared/Steps", "shellComponent": true, "keyDiffs": "current→currentStep（对应 data[].value 不是下标）；items→data=[{text,value}]...", "ref": "components/Steps.md", "files": ["src/views/Wizard.jsx"] },
  { "antd": "Modal", "category": "C", "eview": "Dialog", "importPath": "@nce/eview-react/Dialog", "shellComponent": false, "keyDiffs": "open→isOpen；footer→buttons=[{text,status,onClick}]；onClose 不自动关闭...", "ref": "components/Dialog.md", "files": ["src/views/DeviceForm.jsx"] },
  { "antd": "Layout", "category": "B", "eview": "手写", "importPath": null, "shellComponent": false, "keyDiffs": "无对应，CSS 布局", "ref": "handwrite-templates.md §4", "files": ["src/views/AppShell.jsx"] }
],
"globalRef": {
  "spellingAnomalies": [{ "eview": "seprator", "correct": "separator", "component": "Crumbs" }, ...],
  "callbackSignatures": [{ "component": "TextField", "signature": "onChange(value, oldValue, event)", "note": "首参是值不是 event" }, ...]
}
```

> 下游 antd-to-eview-react 步骤 0 直接读 `migrationPlan`（含 importPath/shellComponent/full keyDiffs）+ `globalRef`（拼写/回调速查），A 类组件无需再读 `component-mapping.md` 或 `components/<Name>.md`，仅 B/C 类按需读 ref 指向的 reference。

## 与 antd-to-eview-react 的衔接

本 skill 产出 eview-react Vite 工程（骨架已搭好 + token CSS 已外置 + 代码已就位），可直接用 `antd-to-eview-react` skill 继续迁移。

衔接要点：

1. **骨架已是 eview-react**：步骤 1 已用 antd-to-eview-react 的 scaffold 搭好（依赖 / Provider / `aui3_1` body 类 / 字体 / icon shim 均就位），下游不再跑 `init-scaffold.cjs`
2. **下游步骤 1 i18n 设置**：i18n 静态接线已由步骤 3 按 `i18nScenario` 前置完成——scenario A/B 的 `main.jsx` IntlProvider + 业务包合并已就绪（`i18nScenario.wired=true`），下游步骤 1 跳过接线只做运行时验证（DatePicker 中文、Portal MISSING_TRANSLATION）；scenario C（`wired=false`）下游步骤 1 做 keep i18next vs 迁 react-intl 决策。antd ConfigProvider + darkAlgorithm 已在步骤 3 删除换成 eview 类名切换
3. **CSS 已外置、无需重提**：`base/light/theme/dark` 四层已在步骤 2 从产物 `assets/style/` 拷贝好，骨架的 `src/styles/` 原样保留
4. **相对导入已修正**：`check-relative-imports.cjs` 已跑过，路径正确——下游验证里此子项跳过（`check-i18n-keys.cjs` 仍照跑）
5. **代码只有一份**：双份代码已在步骤 3 归一
6. **评估清单已前置（脚本自动化 + enriched）**：`migrationPlan` 由步骤 5 `build-migration-plan.cjs` 脚本生成（非主 agent 手动），下游步骤 0 直接读它作为组件分类评估清单——含 A/B/C 分类 + 替换名 + **importPath**（含 @/shared/ 包壳检测 + `SHELL_COMPONENTS` 硬编码兜底 Steps）+ **shellComponent** 标志 + **完整 keyDiffs**（映射表原文，非一行摘要）+ ref 指引 + 涉及文件。A 类组件无需再读 `component-mapping.md` 或 `components/<Name>.md`，仅 B/C 类按 `ref` 指引读对应 reference。`globalRef`（拼写异常 + 回调签名速查表）由同一脚本写入，下游跳过读 `component-mapping.md` 文末速查表
7. **图标调用点已预扫**：`iconCallSites` 由步骤 2 `extract-umd.cjs` 预扫写入 `.umd-conversion.json`（字面量/动态/无 name 分类 + 文件 + 行号），下游图标步骤跳过 grep，直接用预扫结果跑 `match-icons.cjs`
8. **图表调用点已预扫 + 迁移行已注入**：`chartCallSites` 由步骤 2 `extract-umd.cjs` §4.9 预扫写入 `.umd-conversion.json`（chartType 字面量/动态/无 name 分类 + 文件 + 行号 + 共享件路径），步骤 5 `build-migration-plan.cjs` 读 `chartCallSites.callSites` 非空时注入 Chart 迁移行到 `migrationPlan`（category A、importPath `@nce/eview-react/Chart`、keyDiffs 含 `a2ui: true`/`theme` 补全提醒）——下游步骤 0 直接见迁移行，步骤 2 按 keyDiffs 改 import 路径 + 补 `a2ui`/`theme`，无需手动发现 `<Chart>` 调用点

向用户报告时说明：本 skill 完成的是"工程标准化 + 骨架搭建"，后续 antd-to-eview-react 完成"Provider 转换 + 组件替换"。
