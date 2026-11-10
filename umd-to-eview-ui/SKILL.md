---
name: umd-to-eview-ui
description: >-
  把 ict-coder 产出的 UMD 单 HTML 工程转换为 Vite 工程并完成 antd → eview-ui 组件替换。
---

# UMD → eview-ui Vite 全流程 Skill

## 前置条件

1. **源项目**：为 ict-coder 产出的 UMD 单 HTML 工程。结构特征：`index.page.html`（含 UMD script 标签 + 内联 CSS + Babel-standalone + 内联 jsx 模块）+ `src/` 双份代码 + antd 5 + 内联 token CSS + Lucide 图标 + icon-plus 在线。
2. **运行时**：Node.js ≥ 16（Vite 5 要求）。

## 迁移工作流（8 步）

| 步骤 | 做什么 | 产出 | 执行方式 |
|------|--------|------|---------|
| **1. 搭骨架** | 跑 `init-scaffold.cjs` 拷贝 eview-ui Vite 空壳（package.json/vite.config.js/index.html/main.jsx/theme/styles/字体/icon shim/Cascader 手写件）——**scaffold 已是 eview-ui 形态**（依赖 @cloudsop/eview-ui + .npmrc scope + less 预处理 + ThemeProvider 黑白主题切换 + body 首帧防闪） | 可运行的 eview-ui Vite 空壳工程 | 主 agent 跑脚本 |
| **2. 提取 UMD 内容** | 跑 `extract-umd.cjs` 从源产物 `assets/style/` 拷贝 ict-coder 已分好的 4 层 CSS（base append 到 scaffold 占位后 + light/theme/dark 三个 write 覆盖空壳；`ant.css` 跳过）；扫描 antd 组件导入（组件→文件映射 + 图标列表）；扫描 `<Icon name>` 调用点；扫描 `<IpInput>` 调用点 + 手写共享件；扫描 `<Chart>` 调用点 + 内置共享件；拷贝 `assets/uploads/` 图片资源到 `public/uploads/`；扫描 i18n 用法判定 scenario A/B/C + 业务包/antd-locale 文件路径；生成 `.umd-conversion.json` 状态文件（token/色值快照一并写入）；无 `src/` 时加 `--scripts` 提取 script 块 | 四层 CSS + antd 清单 + icon/chart/ipinput 调用点 + uploads 资源 + i18n scenario + 状态文件 | 主 agent 跑脚本 |
| **3. 搬代码 + 修路径 + 黑白主题接线 + i18n 接线** | 把源项目 `src/` 独立文件搬进 `src/`（`assets/shared/` 共享件按原路径拷入）；修正 `./src/...` → `./...` 相对导入；`app.jsx` 搬入时删除 antd `ConfigProvider` + `theme.darkAlgorithm`，使用 eview-ui 的黑白主题切换（scaffold 的 ThemeProvider 已预制，本步骤把它接到源项目 AppProvider——改 useTheme.jsx 消费 useApp + main.jsx 外层包 AppProvider，见步骤 3 模板）；按 `i18nScenario` 做 i18n 静态接线（删 antd locale 文件；scenario B 合并业务包到 `main.jsx`；scenario C 留步骤 7 决策） | 代码就位，import 正确，黑白主题接线完成，i18n A/B 接线完成 | 派发 general 子 agent1 |
| **4. import 验证** | 跑 `check-relative-imports.cjs` 静态检查；结果写入 `.conversion-result.json`，FAIL 循环修复（≤5 轮）；通过后更新 `.umd-conversion.json` 的 `verification` 字段 | `verification.relativeImports=PASS` | 子 agent1（步骤 3 续做） |
| **5. 生成迁移计划** | 跑 `build-migration-plan.cjs`：读 `.umd-conversion.json` 的 `antdComponents` + 各组件 md 的「antd 迁移注意事项」区块（`components/*.md` 三列表）与 `handwrite-templates.md` 的 B 类索引表，对每组件分类（A 有对应 / B 手写 / P 保留）+ eview-ui 替换名 + importPath + 完整 keyDiffs（注意事项表原文）+ ref 指引 + 涉及文件，写入 `migrationPlanEui` 字段；同时写入 `globalRefEui`（拼写异常 + 回调签名 + 显隐 prop 三张速查表）。**始终执行**——不依赖步骤 4 PASS，`antdComponents` 在步骤 2 已就绪 | 迁移计划 + 速查表就绪 | 主 agent 跑脚本 |
| **6. 黑白主题接线核对** | 核对步骤 3 的接线结果：main.jsx 结构（`IntlProvider > AppProvider > ThemeProvider > App`）、useTheme.jsx（ThemeProvider 消费 `useApp().isDark`；`ConfigProvider locale="zh" version="aui3-1" theme={isDark ? 'evening' : 'lightday'}`；全工程**只有一个** ConfigProvider）；**不要再新加 ConfigProvider**（scaffold 已预制）。样式接入已确认（main.jsx 的 `@cloudsop/eview-ui/style/aui3.1.less`），无需处理 | 接线核对完成 | 主 agent |
| **7. 逐组件替换** | 主 agent 先提取精简计划文件（node 一行，见下文步骤 7）再派发；按 `migrationPlanEui` 逐组件替换（A 类改 props/导入，B 类手写，P 类不动）；图标与 Chart **保留不动**（见硬约束 8/9）；scenario C 的 i18n 决策（keep i18next vs 迁 react-intl）由子 agent 按 i18n-migration.md §3 规则自决 | 组件代码全部替换 | 派发 general 子 agent2 |
| **8. 终验证（机器兜底门禁）** | 必跑 12 个 check 脚本（7 硬 FAIL + 4 advisory 须回应 + npm install 外网 SKIP）；结果写入 `.eview-ui-migration-result.json`，FAIL 循环修复（≤5 轮，修复续接步骤 7 子 agent） | PASS + advisory 回应 | 主 agent（跑脚本判定） |

> 步骤 5-8 的详细展开（含组件模式转换详解、验证脚本判定细则）见 [references/migration-workflow.md](references/migration-workflow.md)。
> 派发子 agent（步骤 3/4/7）时，把任务描述模板原文复制进 dispatch prompt，并在末尾附加通用约束：
> - 子 agent 不能再派子 agent
> - 读写文件一律用 read/write/edit 工具，禁用 PowerShell 读写文件（Windows GBK 编码会把中文变乱码）
> - 任务无法完成（超时/上下文不足）时，在最终回复写明已完成部分与剩余工作，供主 agent 续派接手 agent

## scaffold 预制骨架（eview-ui，单一形态）

骨架由本 skill 的 `scaffold/` 目录维护，步骤 1 一键拷贝，内含：

- **package.json**：`@cloudsop/eview-ui ^7.1.37` + `@hui/design-token` + `@hui/icon-plus` + react/react-dom/react-intl/dayjs/lodash；`.npmrc` 配 @cloudsop scope 源
- **index.html**：body 预置 `eviewui_aui3_1_default` 类 + `data-theme="default"`（默认样式）
- **main.jsx**：`IntlProvider`（业务 i18n）+ 四层 CSS import + eview-ui 全局样式 import 已落实（`import '@cloudsop/eview-ui/style/aui3.1.less'`，less 由 vite.config.js 预处理）+ `ThemeProvider` 包住 App（步骤 3 在其外再包 `AppProvider`）
- **src/theme/useTheme.jsx**：黑白主题切换预制件——`ThemeProvider`（自持 isDark 演示态 + `ConfigProvider locale="zh" version="aui3-1" theme` 派生 + html `.dark` useEffect；步骤 3 改为消费 `useApp().isDark`）+ `useTheme` 演示 hook（步骤 3 删）
- **app.jsx**：`useTheme()` 消费者空壳（含演示切换按钮；步骤 3 被源项目业务树替换）
- **vite.config.js**：`@`→`./src` 别名 + icon-plus proxy/transform + **less 预处理配置**（`javascriptEnabled: true` + `paths: [node_modules]` + TildeFileManager 插件处理 `~` 前缀导入；less 无需显式 devDep，由 @cloudsop/eview-ui 传递依赖提供）
- **src/shared/Icon/**：图标 shim（folder + 默认导出，两路线通用）
- **src/shared/Cascader/**：纯手写 antd 兼容件
- **src/styles/**：四层 CSS 占位（base.css 占位 + light/theme/dark 空壳，步骤 2 覆盖/追加）
- **public/font/**：HarmonyOS Sans SC 四字重

用法：`node <skill目录>/scripts/init-scaffold.cjs <目标工程根> [项目名] [标题] [--force] [--upgrade]`（项目名/标题由调用方提供或取源目录名；同名也分别传第 2、3 参数，不要省略）

## extract-umd.cjs：自动提取内联内容

步骤 2 的核心脚本，机械化完成最耗 token 的 token CSS 提取工作。

```bash
node <skill目录>/scripts/extract-umd.cjs <源UMD文件路径> <目标工程根> [--scripts]
```

脚本自动完成：拷贝 `assets/style/` 4 层 CSS（base.css append + 路径改写；light/theme/dark write 覆盖；ant.css 跳过）；检查 `src/` 目录并列出文件清单；`--scripts` 提取 script 块到 `_extracted/`；扫描 antd 组件导入（组件→文件映射 + 图标列表）；扫描 `<Icon name>` / `<IpInput>` / `<Chart>` 调用点；拷贝 `assets/uploads/` 到 `public/uploads/`；扫描 i18n 用法；生成 `.umd-conversion.json` 状态文件（含 `sourceCssTokens`/`sourceCssColors` 快照，供步骤 8 的 check-token-drift.cjs / check-css.cjs 对照）。

### 状态文件 `.umd-conversion.json`

全流程的中间状态与断点记录（步骤 2 生成、步骤 4/5/8 更新），结构：

```json
{
  "skill": "umd-to-eview-ui",
  "sourceFile": "index.page.html",
  "projectName": "xxx",
  "antdComponents": { "Button": ["src/views/AppShell.jsx"], "Select": ["src/views/DeviceForm.jsx"] },
  "antdIcons": ["SearchOutlined", "SunOutlined"],
  "iconCallSites": [{ "file": "src/views/AppShell.jsx", "line": 42, "name": "search", "type": "literal" }],
  "ipInputCallSites": { "sharedFiles": ["assets/shared/ip-input.jsx"], "imports": [], "callSites": [] },
  "chartCallSites": { "sharedFiles": ["assets/shared/chart.jsx"], "imports": [], "callSites": [] },
  "styles": { "source": "assets/style", "files": ["base.css","light.css","theme.css","dark.css"], "cssFiles": ["src/styles/base.css","src/styles/light.css","src/styles/theme.css","src/styles/dark.css"] },
  "srcFiles": ["src/context.jsx", "src/data.js"],
  "sourceCssTokens": { "base.css": { "--xxx": "value" } },
  "sourceCssColors": { "src/views/AppShell.jsx": ["#fff", "#0067D1"] },
  "darkMode": { "method": "html .dark (custom tokens) + ConfigProvider theme (component lib, version=aui3-1, 实测)", "darkClass": ".dark on <html>" },
  "i18nScenario": { "scenario": "A", "reactIntl": { "used": false, "files": [] }, "i18next": { "used": false, "files": [] }, "antdLocaleImports": [], "antdLocaleFiles": [], "businessLocaleFiles": [], "hasDayjs": false, "wired": true },
  "verification": null,
  "migrationPlanEui": null,
  "globalRefEui": null,
  "notes": ""
}
```

步骤 5 生成 `migrationPlanEui`（分类 A/B/P + importPath + keyDiffs + ref + files）与 `globalRefEui`（三张速查表内联）；步骤 4 通过后更新 `verification` 字段为 `{ "relativeImports": "PASS" }`。

## 步骤 3：搬代码 + 修路径（派发 general 子 agent）

步骤 3 是上下文消耗最高的步骤（要读源项目所有 jsx 文件、搬入、修路径）。

**任务描述模板：**

```
把源项目代码搬入目标 eview-ui Vite 工程并修正路径 + i18n 静态接线：

源项目路径：<源UMD文件所在目录>
目标工程根：<目标工程根>

操作：
1. 把源项目 src/ 下的独立文件（或 _extracted/ 下的提取文件）搬入 <目标工程根>/src/
   - 保持目录结构（src/views/、src/components/ 等）
   - **保留 src/context.jsx**（ict-coder 产物的 Layer 1 全局状态，含 `AppProvider` + `useApp` hook + isDark/dark toggle）：整文件搬入 <目标工程根>/src/context.jsx，**不改 AppProvider/useApp 的导出契约**——业务组件与暗色切换都依赖 `useApp().isDark`。若 context.jsx 里有 antd ConfigProvider 嵌套则删掉；AppProvider 内部的 isDark state + toggleDark 保留
   - 搬入源项目 icon.jsx 内容到 src/shared/Icon/Icon.jsx（`export function Icon`→`export default function Icon`，scaffold 的 index.jsx 桶 `export { default } from './Icon.jsx'` 已就位）；业务代码 `import { Icon } from ".../assets/shared/icon.jsx"` → `import Icon from "@/shared/Icon"`（默认导入，`@` 别名已由 vite.config.js 预配）
    - app.jsx 用源项目的版本替换 scaffold 的空壳 app.jsx，同时做黑白主题接线：
       a. 删除 antd ConfigProvider（含 locale + theme.darkAlgorithm）——eview-ui 的黑白主题切换已由 scaffold 的 ThemeProvider 预制（src/theme/useTheme.jsx，ConfigProvider 就在里面），本步骤只做接线（见 c），**不要再另写 ConfigProvider**
       b. **isDark 仍从 useApp() 取**（`const { isDark, toggleDark } = useApp()`，来自 context.jsx 的 AppProvider）——业务组件与暗色切换 UI 的契约不变，保留源项目的暗色切换 UI（toggleDark 调用点）
       c. 黑白主题接线（scaffold ThemeProvider 对接源项目 AppProvider）：
          - main.jsx：加 `import { AppProvider } from './context.jsx'`，把 `<AppProvider>` 包到 `<ThemeProvider>` 外层（最终结构：IntlProvider > AppProvider > ThemeProvider > App）
          - src/theme/useTheme.jsx：把 ThemeProvider 的自持演示 state（useState + toggleTheme）删掉，改为 `const { isDark } = useApp();`（消费 context.jsx 的 AppProvider）；保留 html `.dark` useEffect 与 ConfigProvider（`locale="zh" version="aui3-1" theme={isDark ? 'evening' : 'lightday'}`）；`useTheme` 演示 hook 一并删除（业务组件统一用 useApp）
          - app.jsx：源项目里 AppProvider 的包裹层上提到 main.jsx（app.jsx 只留业务树）；源项目自写的暗色 useEffect（html/body 切换逻辑）全删，统一由 ThemeProvider 管理
           - 暗色机制（实测）：html `.dark` 轨（自定义 token 四层）+ ConfigProvider `theme` 轨（组件库内部切换，version="aui3-1"）；**不要**手写 body `data-theme` / `eviewui_aui3_1_*` 类切换，**不要**加 listenTheme
   - 把源项目 assets/shared/ 下的共享件（.umd-conversion.json 的 chartCallSites.sharedFiles / ipInputCallSites.sharedFiles 列出者，连同伴随 css）按原相对路径拷入 <目标工程根>/assets/shared/，业务代码 import 路径不动——chart.jsx 由步骤 7 P 类原样保留；ip-input.jsx 由步骤 7 删除并替换为 @cloudsop/eview-ui/IPInput；src/components/chart|ip-input/ 变体随 src/ 搬入已就位，无需另拷
2. 修正所有相对导入路径：
   - ./src/context.jsx → ./context.jsx
   - ./src/views/X.jsx → ./views/X.jsx
   - ./src/data.js → ./data.js
3. i18n 静态接线（读 .umd-conversion.json 的 i18nScenario 字段）：
   - 删除源项目里的 antd locale 导入（i18nScenario.antdLocaleImports 列出）和自写 antd locale 文件（i18nScenario.antdLocaleFiles，如 antd-zh-cn.js）
   - scenario A（硬编码中文）: main.jsx 不改（scaffold 的 IntlProvider + messages={{}} 已就绪）
   - scenario B（源用 react-intl）:
     a. 搬 i18nScenario.businessLocaleFiles 列出的业务语言包到 <目标工程根>/src/ 下，保持原路径
     b. 改 main.jsx: 业务包挂进 IntlProvider messages={messages[locale]}；若源项目有动态语言切换（lang state in context）用 Root 包裹结构（见 references/i18n-migration.md §4.1）
     c. 业务代码里的 <FormattedMessage>/useIntl() 不用改（react-intl 同一套库）
   - scenario C（源用 i18next）: 本步骤不合并业务包到 main.jsx，留给步骤 7 做 keep i18next vs 迁 react-intl 决策；但仍要删 antd locale 导入/文件
   - 若 i18nScenario.hasDayjs 且项目用到 dayjs 中文星期/月份: 按 references/i18n-migration.md §5 在 main.jsx 单独 import 'dayjs/locale/zh-cn' + dayjs.locale() 同步

读 <skill目录>/references/umd-structure.md 了解 UMD 源项目结构。
读 <skill目录>/references/i18n-migration.md §4/§5 了解 scenario B 的 main.jsx 结构与 dayjs locale 注册。
本任务描述已自包含：除上面 2 个 reference 文件外，**不要读** skill 目录的其他文件（SKILL.md、migration-workflow.md、components/* 均与本步骤无关）。

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

本任务只需跑脚本 + 修 unresolved imports（规则：`./src/X` → `./X`）+ 写结果文件，**不要读** skill 目录的 SKILL.md / references/*（主 agent 阶段材料，与验证无关）。

本轮轮号：{round}
```

**循环上限**：默认 5 轮。第 5 轮仍 FAIL 必须停止，向用户报告失败项 + 建议人工介入。

## 步骤 5：生成迁移计划（脚本自动化）

```bash
node <skill目录>/scripts/build-migration-plan.cjs <目标工程根>
```

脚本读 `.umd-conversion.json` 的 `antdComponents` + 各组件文档的「antd 迁移注意事项」区块（`references/components/<Name>.md` 的三列表）与 `handwrite-templates.md` 头部的 B 类索引表，对每个 antd 组件生成迁移行：**A**（有对应：eview 替换名 + importPath + 完整 keyDiffs + `components/<Name>.md` ref）/ **B**（无对应：手写模板 ref）/ **P**（保留不迁：Icon shim / Chart）；`iconCallSites`/`chartCallSites`/`ipInputCallSites` 非空时自动注入 P 类保留行与 IPInput 迁移行；同时写入 `globalRefEui`（拼写异常 + antd→eview 重命名 + 回调签名 + 显隐 prop 速查表内联，人读版在 `components/INDEX.md` 文末）。

步骤 7 的子 agent 直接读提取的 `.migration-plan-eui.json`（无需手动通读各组件 md 的注意事项区块）：A 类按 `ref` 读 `components/<Name>.md`（迁移注意事项与完整 API 同文件），B 类按 ref 读 `handwrite-templates.md`，P 类不动。

## 步骤 6：黑白主题接线核对

核对步骤 3 的接线结果（scaffold 已预制 ThemeProvider/ConfigProvider，本步骤**不写代码**，只核对）：

1. main.jsx 结构：`IntlProvider > AppProvider > ThemeProvider > App`（AppProvider 来自 context.jsx，包在 ThemeProvider 外层）
2. useTheme.jsx：ThemeProvider 消费 `useApp().isDark`；html `.dark` useEffect 在；`ConfigProvider locale="zh" version="aui3-1" theme={isDark ? 'evening' : 'lightday'}`（theme 响应式派生，禁止静态字符串）
3. 全工程只有一个 ConfigProvider（业务代码里不允许再出现）
4. 样式接入已确认：main.jsx 的 `import '@cloudsop/eview-ui/style/aui3.1.less'`（无需处理）

核对不过 → 回到步骤 3 子 agent 修。接线核对细则见 [references/migration-workflow.md](references/migration-workflow.md) 步骤 6。

## 步骤 7：逐组件替换（派发 general 子 agent）

步骤 7 是组件知识消耗最高的步骤（迁移计划 + 逐组件完整 API 文档），派发子 agent 隔离上下文。

**派发前主 agent 提取精简计划**（在目标工程根执行；避免子 agent 读 `.umd-conversion.json` 全量——含 sourceCssTokens 等无关快照）：

```bash
node -e "const j=require('./.umd-conversion.json');require('fs').writeFileSync('.migration-plan-eui.json',JSON.stringify({migrationPlanEui:j.migrationPlanEui,globalRefEui:j.globalRefEui,i18nScenario:j.i18nScenario},null,2))"
```

产物 `.migration-plan-eui.json` 含三字段：`migrationPlanEui`（每组件分类 A/B/P + importPath + keyDiffs + ref + 涉及文件）、`globalRefEui`（拼写/回调/显隐三张速查表）、`i18nScenario`。

**任务描述模板：**

```
把目标 eview-ui Vite 工程里的 antd 组件替换为 @cloudsop/eview-ui 组件：

目标工程根：<目标工程根>

操作：
1. 读 <目标工程根>/.migration-plan-eui.json（migrationPlanEui/globalRefEui/i18nScenario 三字段），按涉及文件逐组件替换：
   - A 类（有对应）：导入改用 importPath；按 keyDiffs 逐项改 props/回调/数据格式（拼写异常/回调签名/显隐 prop 查 globalRefEui 三张速查表）；按 ref 读 components/<Name>.md 查完整 API（keyDiffs 是差异摘要，非完整 API）；API 表查不到的 props 一律不写（宁缺勿编）
   - B 类（无对应）：读 handwrite-templates.md 取模板手写补位；样式用源项目 CSS 变量；加 // TODO(eview-ui) 注释
   - P 类（保留不动）：Icon shim 与 Chart 封装零改动，import Icon from '@/shared/Icon' 路径保持
   - 替换顺序：叶子组件 → 容器组件 → 布局骨架
2. i18nScenario.scenario 为 C（源用 i18next）时：读 <skill目录>/references/i18n-migration.md §3 场景 C，按决策规则选定 keep i18next 或迁 react-intl 并执行
3. 每替换完一个组件立即 grep -rn "from 'antd'" src/ 检查残留数递减；全部完成后 antd 与 @ant-design/icons 残留须为 0

读 <skill目录>/references/migration-workflow.md 的「步骤 7」整节（7.1 A 类流程 / 7.2 B 类流程 / 7.3 模式转换详解——高频坑对照）。
B 类替换时读 <skill目录>/references/handwrite-templates.md；A 类按 ref 读 <skill目录>/references/components/<Name>.md。
本任务描述已自包含：除上面列出的文件与目标工程外，**不要读** skill 目录的其他文件（SKILL.md、scaffold/、scripts/ 均为主 agent 材料——硬约束已物化进计划文件与 migration-workflow.md 步骤 7 节）。

输出：替换组件清单（组件→文件→A/B/P）+ 手写件清单 + // TODO(eview-ui) 列表 + antd/@ant-design/icons 残留 import 数（须为 0）+ scenario C 决策与执行结果
```

步骤 8 FAIL 时续接本子 agent 修复（复用组件替换上下文）。

## 步骤 8：终验证（机器兜底门禁）

**测试结果文件**（主 agent 判定依据）：`<目标工程根>/.eview-ui-migration-result.json`。

**必跑脚本**（`node <skill目录>/scripts/check-X.cjs <目标工程根>`）：`check-imports.cjs`（硬 FAIL）；`check-select-options.cjs`（硬 FAIL）；`check-provider.cjs`（硬 FAIL）；`check-dark-mode.cjs`（硬 FAIL）；`check-visibility.cjs`（硬 FAIL）；`check-wizards.cjs`（硬 FAIL）；`check-crumbs.cjs`（硬 FAIL）；`check-table-defaults.cjs`（advisory 须逐条回应）；`check-css.cjs`（advisory 须回应）；`check-token-drift.cjs`（token 值漂移硬 FAIL + advisory 须回应）；`check-menu.cjs`（advisory 须回应）；`npm install`（timeout=30000，内网源超时/失败记 SKIP 不判 FAIL）。

**跳过**：`check-relative-imports.cjs`（步骤 4 已跑，读 `verification.relativeImports=PASS`）。

**advisory 回应规则**：advisory 项发现的问题不阻断 PASS，但必须在 `.eview-ui-migration-result.json` 的 `advisoryReviews` 逐条写明「已修复 / 有意保留（理由）」；空回应视同未检查（FAIL）。

**循环上限**：默认 5 轮。每轮 FAIL → 修复（续接步骤 7 的同一子 agent，复用组件替换上下文）→ 主 agent 重跑全量脚本 → round+1。第 5 轮仍 FAIL 停止，向用户报告失败项 + 建议人工介入。结果文件结构与脚本判定细则见 [references/migration-workflow.md](references/migration-workflow.md) 步骤 8 / §4。**PASS 后终检补充**（乱码抽查 / 痕迹 grep / 结构完整性 / 向用户汇报清单）见 [references/migration-workflow.md](references/migration-workflow.md) 步骤 8 终检补充。

## 组件映射

> 完整映射（有对应 / 组合替代 / 无对应需手写）：每个 eview-ui 组件文档 `components/<Name>.md` 内的「antd 迁移注意事项」表（antd 写法→eview 写法 + 迁移要点）+ `handwrite-templates.md` 头部的「antd → 手写模板索引」表；导入特例（Panel 解构 / Tab TabItem / GridLayout Row/Col / RangePicker 解构）见 [components/INDEX.md](references/components/INDEX.md) 导入规范；无对应组件手写模板见 [handwrite-templates.md](references/handwrite-templates.md)；三张横切速查表（拼写异常 / 回调签名 / 显隐 prop）见 [components/INDEX.md](references/components/INDEX.md) 文末。

## eview-ui 硬约束（迁移全程必须遵守）

1. **导入路径**：统一 `import X from '@cloudsop/eview-ui/X'`（子路径**默认**导入；真实包名是 `@cloudsop/eview-ui`——**官方组件文档示例里写的 `eview-ui/X` 是简写，抄写时必须补 `@cloudsop/` 前缀**）。特例仅 4 个：`import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`；`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**必须解构**）；`import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`；`const { RangePicker } = DatePicker`（`<DatePicker.RangePicker>` 改 `<RangePicker>`）。业务代码**禁止残留** `from 'antd'` / `from '@ant-design/icons'`。**机器验证**：步骤 8 `check-imports.cjs`，exit≠0 即 FAIL。

2. **ConfigProvider 必须显式传全三项**：`locale="zh"`（**默认是 `en`，不传全英文**——组件内置文案全变英文，最高频遗漏）、`version="aui3-1"`（**实测可用值**——官方属性表枚举只列 aui2/aui3，但组件库 3.1 特性（含黑白主题切换）以 aui3-1 为准）、`theme={isDark ? 'evening' : 'lightday'}`（**响应式引用 isDark，禁止静态字符串**——写死暗色切换即失效；**实测 theme 单独驱动组件暗色，无需 listenTheme**）。位置：scaffold 的 `src/theme/useTheme.jsx`（ThemeProvider 内、`AppProvider` 之下包住业务树——Dialog 等 portal 经 createPortal 仍在 React 树内，context 可达）；**不要再叠第二个 ConfigProvider**，也不要放进叶子组件。**机器验证**：步骤 8 `check-provider.cjs`。

3. **回调签名**：第一个参数通常是值不是 event（TextField `onChange(value1, value2, event)`、SelectPro `onChange(value, options)`、Checkbox 四参）；**反直觉例外**：Rating `onClick(event, value)`、Table `onRowRightClick(e, row)`、FileUpload `onChange(event, itemList)`——event 在前。完整速查见 [components/INDEX.md](references/components/INDEX.md) 文末「回调签名差异」表。

4. **显隐 prop 不统一**（最高频张冠李戴）：DialogPro/MessageDialogPro/Loader 用 `isOpen`；Drawer/Tooltip 用 `visible`；Popup/TipBox/DivMessage 用 `display`。**DialogPro/MessageDialogPro 的 `destroyOnClose` 默认 true（antd 默认 false，语义反转）**；所有弹层 `onClose` 都不自动关闭。速查见 [components/INDEX.md](references/components/INDEX.md) 文末「显隐 prop 速查」表。**机器验证**：步骤 8 `check-visibility.cjs`。

5. **validator 返回 `{result, message}`**（`result: true` = 通过）；FormPro 的 Rule 是**扁平字段**（`required/email/ipv4/min...` + `custom`），不是 antd `{required, message, validator}` 数组——antd Form 迁 FormPro 时必须重写 rules。

6. **API 表里查不到的 props 一律不写**（eview-ui 文档属性表为准；文档标注「示例使用但属性表未列」的 prop 同样不写）。

7. **CSS 色值不漂移 + token 不漂移**：原项目 CSS 写死色值**允许**（忠实保留），但不能擅自改值；类名用业务前缀。**机器验证**：步骤 8 `check-css.cjs` + `check-token-drift.cjs` 对照 `.umd-conversion.json` 的 `sourceCssColors`/`sourceCssTokens` 快照。

8. **图标保留源 shim，不迁移**：`<Icon name="...">`（icon-plus 在线 + Lucide）调用点**零改动**，`import Icon from '@/shared/Icon'` 路径保持；**禁止**改用 eview-ui `Icon`（name 体系不同、无 catalog 匹配依据）、`SvgIcon`（文档标注废弃）、`IconButton`（废弃）。eview-ui 组件的 `leftIcon`/`rightIcon`/`icon` 类 prop 接收**图标 url 字符串**，与 Icon shim（ReactNode）类型不匹配——**不要把 Icon shim 塞进这些 prop**；带图标场景用 children 组合（如 `<Button><Icon name="x"/>{文字}</Button>`）。

9. **图表保留源封装，不迁移**：eview-ui **无 Chart 组件**——保留源项目 `chart.jsx` 封装与其 import 原样；**不需要**补 `a2ui: true`/`theme`（eview-ui 无此约束，勿凭空添加）；暗色下图表主题跟随由源项目逻辑自理。

10. **黑白主题双轨**（实测机制，缺任一轨切换不完整）：
    ① html 轨：`document.documentElement.classList.toggle('dark', isDark)`（自定义 token 四层跟随，scaffold 的 ThemeProvider 已内置）；
    ② ConfigProvider theme 轨：`theme={isDark ? 'evening' : 'lightday'}` + `version="aui3-1"`——**组件库内部自行切换暗色，不需要手写 body `data-theme` / `eviewui_aui3_1_*` 类切换，也不要加 listenTheme**。
    index.html body 首帧已预置 `eviewui_aui3_1_default` + `data-theme="default"`（亮态防闪，运行时无需维护）。两轨统一收口在 ThemeProvider（消费 useApp().isDark），业务侧只管 `toggleDark`。**机器验证**：步骤 8 `check-dark-mode.cjs`（检测暗色需求后验证双轨完整性）。

11. **拼写异常照抄原文**：`seprator`（Crumbs）、`disable`（**仅 SelectCard/FileUpload/Tag(message)/PopUpMenu 项**——其余组件用正确拼写 `disabled`，**不要全局替换**）、`placeHolder`（FileUpload/BrowseButton）、`upLoadErrorMessage`、`disposeTimeOut`、`disabelCheckAssociated`、`enablHorzScroll` 等。完整表见 [components/INDEX.md](references/components/INDEX.md) 文末「属性拼写异常」表。**机器验证**：`check-crumbs.cjs`（separator 正确英文残留即 FAIL）。

12. **按钮/文字类组件内容用 prop 不用 children**：`Button text`、`TextButton text`、`DivMessage text`、`LabelField text`（Button 带 Icon 时例外走 children 组合，见硬约束 8）；`MessageDialog content/detail` 结构区分。

13. **有 Pro 版的组件一律用 Pro 版**：antd 组件只映射到 `SelectPro`（`placeholder` 同名、`onChange(value, options)` 两参、`mode` single/singleSearch/multiple/multiSearch）、`DialogPro`（**无 buttons prop——footer 自写**）、`MessageDialogPro`（受控 + 静态方法双形态）、`TablePro`（dataIndex/rowKey/selection 同构 antd）、`FormPro`（Rule 扁平化）。旧版组件（`Select`/`Table`/`Dialog`/`MessageDialog`/`Form`）**导入即违规**——注意官方组件文档示例里旧版与 Pro 混用，抄文档时认准 Pro。**机器验证**：步骤 8 `check-imports.cjs` 的 LEGACY_PRO_USED（exit≠0 即 FAIL）。

## 转换阶段硬约束（步骤 3/4 期间）

1. **步骤 3/4 不换组件库**：搬代码阶段业务代码（app.jsx、views/*、components/*）保持 antd 5 组件导入不动——**组件替换统一在步骤 7 做**（两个阶段分离，可分别验证；步骤 4 的 check 脚本与步骤 8 的检查目标不同）
2. **Provider 体系由 scaffold 定型**：main.jsx 已预设 react-intl `IntlProvider`（业务 i18n）+ `ThemeProvider`（黑白主题）；步骤 3 删除 app.jsx 的 antd `ConfigProvider`（含 `zhCN` locale + `theme.darkAlgorithm`），不在业务代码另加 Provider；eview-ui `ConfigProvider` 已由 scaffold 的 ThemeProvider 预制，步骤 3 只做 AppProvider 接线（步骤 6 核对）
3. **CSS 四层分类对齐 ict-coder**：`base.css`（基础色阶+@font-face+reset+scrollbar）、`light.css`（语义层 :root `--color-*`）、`theme.css`（角色层 :root `--primary`/`--surface`/`--font-body-*`）、`dark.css`（`.dark` 暗色覆盖）四文件对齐 ict 的 base/light/theme/dark 分类；`ant.css` 不搬
4. **相对导入不能有 `./src/...`**：`src/app.jsx` 导入同级用 `./context.jsx`，导入视图用 `./views/X.jsx`；`src/views/X.jsx` 导入上层数据用 `../data.js`
5. **图标组件保留源项目原版**：搬入源项目 `icon.jsx` 到 `src/shared/Icon/`，不剥离 Lucide、不换 icon+ 静态 import（替换是步骤 7 的 P 类保留策略——本就不迁移）

## 命名异常速查

> eview-ui 部分 API 命名与"正确英文"或 antd 习惯不同，迁移前必查 [components/INDEX.md](references/components/INDEX.md) 文末三张速查表：「属性拼写异常」（seprator/disable/placeHolder/...）、「回调签名差异」（首参是值/event 在前的例外）、「显隐 prop 速查」（isOpen/visible/display/isShow/iconDisplay 全家福）。

## 页面模式迁移

| antd 页面模式 | eview-ui 迁移要点 |
|--------------|-------------------|
| **筛选列表页** | `Input.Search`→`SearchInput`+**防抖**（onSearch 值变化也触发）；`Select`→**`SelectPro`**（`options` 的 `label`→`text`；`placeholder` 同名保留）；`Table`→**`TablePro`**（`dataset`+`pagination` 对象）；分页翻页回调拆 `onPageChange`+`onPageSizeChange` |
| **列表 CRUD** | `Modal`→**`DialogPro`**（`open`→`isOpen`；**无 buttons prop——footer 自写**：children 排 Button + 自己 `setIsOpen(false)`）；`Modal.confirm()`→**`MessageDialogPro`**（受控形态 buttons 是 `{ok,cancel}` 对象；或 `.confirm(config)` 静态——**脱离 context，慎用**） |
| **多步向导** | `Steps current={i}`→`Wizards currentStep={data[i].value}`（**对应 value 不是下标**）；`items`→`data=[{text, value}]` |
| **表单提交页** | 输入组件逐个替换（源项目 div+组件拼合结构**原样保留**，不用 label/labelPosition 重排）；真用了 antd Form 的迁 `FormPro`（rules 扁平化重写） |
| **侧边详情/编辑** | `Drawer`→`Drawer`（`open`→**`visible`**；底部按钮自写）；`Descriptions`→`LabelField`+`GridLayout` 组合 |
| **布局骨架** | 简单左右/上下分栏用 `Layout type + leftPanel/rightPanel`；复杂骨架**手写 CSS**；`Menu`（items 数组）→`Accordion`（data）；`Breadcrumb`→`Crumbs`（`seprator`） |
| **分段选项卡** | `Segmented`→`SelectCard`（`data=[{text,value}]`；`defaultValue`→初始 `value` state；禁用 `disable` 拼写） |
| **标签页** | `Tabs`→`Tab`+`TabItem` children 驱动；`activeKey`→`selectedIndex` **下标**；回调 `onClick(index, title, event)`；`draggable` 默认 true 要显式关 |

## 核心问题（eview-ui 迁移失败模式补充）

- **ConfigProvider 不传 locale**：默认 `en`，DatePicker 月份/分页条/弹层按钮全英文——**必显式 `locale="zh"`**
- **黑白主题接线断裂**：html `.dark` 轨缺失（自定义 token 不翻转）或 ConfigProvider theme 写死/版本写错（组件不跟随）——`check-dark-mode.cjs` 双轨全检
- **theme 写死静态字符串**：ConfigProvider theme 组件轨失效——theme 必须响应 `isDark`
- **显隐 prop 张冠李戴**：给 Drawer 传 `isOpen`、给 Dialog 传 `visible`/`display`——组件不响应
- **回调首参当 event 用**：`onChange(e) => e.target.value` 在 eview-ui 里 `e` 是值、`.target` undefined → 运行时崩溃
- **Table 列字段错位**：Table **唯一映射 TablePro**（`dataIndex`/`rowKey`/`sorter`/`ascend`/`descend` 同构 antd）；**旧 Table 弃用**——`from '@cloudsop/eview-ui/Table'` 导入即 FAIL（check-imports LEGACY_PRO_USED）；`dataSource` 残留即 FAIL（应 `dataset`）
- **Wizards currentStep 传下标**：必须传 `data[].value`，传数字下标步骤不推进
- **Tab activeKey 当 key 用**：`selectedIndex` 是**数字下标**，key 字符串不响应；遍历生成 TabItem 不判空会白屏
- **Menu 不传 selectable**：默认 false，点击无选中态
- **TimePicker 传 dayjs/字符串**：`time` 是 `[时,分,秒]` 数字数组，传对象不渲染
- **Rating 沿用 onChange**：事件名是 `onClick` 且 `event` 在前
- **Spinner 混收无效值**：`onChange` 只在有效值触发，无效输入走 `onError`——漏接 onError 输入静默丢失
- **拼写陷阱**：`separator`（正确英文）残留 = Crumbs 未迁移；`disabled` 全局替换成 `disable` = 误伤 Button/Select 等正确拼写组件
- **DivMessage 渲染在父组件树**：通知触发父组件重渲染致输入组件失焦（TextField/Select 等输入组件的已知焦点竞争问题）——浮层抽离独立组件
- **图标塞进 leftIcon/icon prop**：url 字符串 prop 塞 ReactNode——不渲染
