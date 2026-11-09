---
name: antd-to-eview-ui
description: >-
  将 umd-to-antd-vite 产物（Vite 工程 + .umd-conversion.json 交接文件）的 antd 组件替换为 eview-ui（ICT eview-ui，aui3 规范，npm 包名 **@cloudsop/eview-ui** ^7.1.37）。
  仅处理 umd-to-antd-vite 产物，不直接处理 UMD 单 HTML 或其他来源的 antd 工程。
  覆盖：骨架换血（上游默认 profile 骨架→eview-ui：依赖/CSS/包壳清理 + ConfigProvider 接线）、antd→eview-ui 组件替换（Table→TablePro、Steps→Wizards、Modal→Dialog/MessageDialog、Menu→Accordion、Breadcrumb→Crumbs）、Layout/Badge/Empty/Cascader 等无对应组件手写、图标与图表保留源封装不迁移、暗色三轨（html .dark token 轨 + body data-theme 属性轨 + body eviewui_aui3_1_default/evening 类轨）。
  本 skill 的坑标注基于官方文档推导、未实测，首轮迁移需校准。
---

# antd → eview-ui 迁移 Skill

## 前置条件

1. **运行时**：Node.js ≥ 16（Vite 5 要求），`npm` 可正常解析内网 `.npmrc` 中的 eview-ui 包源（外网环境 `npm install` 记 SKIP 不判 FAIL）。
2. **源项目工程形态**：源项目**必须是** `umd-to-antd-vite` 的产物——标准 Vite + npm 工程，目标工程根附带 `.umd-conversion.json` 交接文件（含 `antdComponents` 字段）。**若目标工程根无 `.umd-conversion.json`，本 skill 停止执行，提示用户先跑 `umd-to-antd-vite`**——不直接处理 UMD 单 HTML 或其他来源的 antd 工程。
3. **骨架现状认知（两种形态，步骤 0.5 自检测）**：上游 scaffold 支持**双 profile**——
   - **新产物**（上游步骤 1 用 `--profile eview-ui` 搭骨架）：已是 eview-ui 骨架（eview-ui 依赖、无 @nce CSS、body 无类、无转发包壳、暗色单轨）——本 skill 步骤 0.5 **跳过换血**，仅核对 eview-ui 样式 import TODO
   - **老产物**（上游默认 `--profile eview-react`）：骨架是 eview-react 专属（`@nce/eview-react` 依赖 + `aui3_1*.css` + `src/shared/` 转发包壳 + 暗色双轨）——本 skill 步骤 0.5 执行「骨架换血」清单
4. **待内网确认项**（首轮执行时必须向用户/内网核实，SKILL 内已留 TODO 占位）：
   - eview-ui **全局样式接入方式**（79 个组件文档均未记载样式 import 路径；可能是包内自带或需 `import '@cloudsop/eview-ui/...'` 的 .css/.less——vite.config.js 已配 less + TildeFileManager `~` 导入支持）
   - `.npmrc` 的 @cloudsop scope 源路径（scaffold 已按 @nce 同源 product_npm 推断配置，内网核对）
   - 已确认：包名 `@cloudsop/eview-ui`（**官方组件文档示例里写的 `eview-ui/X` 是简写**，实际导入必须带 `@cloudsop/` 前缀——check-imports.cjs 的 EVUI_UNSCOPED_IMPORT 拦截裸形态）、版本 `^7.1.37`、`@hui/design-token` 保留、less 由 @cloudsop/eview-ui 传递依赖提供（无需显式 devDep）、**暗色机制**：body 切 `data-theme` 属性（白天 `default`/黑夜 `dark`）+ class 互换（白天 `eviewui_aui3_1_default`/黑夜 `eviewui_aui3_1_evening`，**白天也必须挂 default 类**）

## 迁移工作流（评估 + 4 步）

> 详细步骤见 [references/migration-workflow.md](references/migration-workflow.md)

| 步骤 | 做什么 | 产出 | 执行方式 |
|------|--------|------|---------|
| **0. 评估 + 生成迁移计划** | 读 `.umd-conversion.json` 的 `antdComponents`/`iconCallSites`/`chartCallSites`/`verification`；跑本 skill `build-migration-plan.cjs` 生成 `migrationPlanEui` + `globalRefEui`（写入 `.umd-conversion.json` 的独立字段，**不覆盖上游已有的 `migrationPlan`**） | 组件迁移清单 + 拼写/回调/显隐速查 | 主 agent 跑脚本 |
| **0.5 骨架换血** | 删 eview-react 生态依赖/CSS/body 类/`src/shared` 转发包壳；加 eview-ui 依赖 + 样式接入；**保留** `src/shared/Icon`（图标 shim）、react-intl `IntlProvider`（业务 i18n）、vite proxy | eview-ui 工程骨架（依赖可解析、无 @nce/eview-react 残留） | 主 agent（清单见硬约束 2） |
| **1. Provider 接线 + 暗色三轨** | app.jsx 内 `AppProvider` 之下加 `<ConfigProvider locale="zh" version="aui3" listenTheme theme={isDark ? 'evening' : 'lightday'}>` 包住业务树（theme 作双保险）；暗色 useEffect 换成 **eview-ui 三轨**：html `.dark`（token）+ body `data-theme`（default/dark）+ body class 互换（`eviewui_aui3_1_default`/`eviewui_aui3_1_evening`） | Provider 就绪 + 暗色三轨 | 主 agent |
| **2. 逐组件替换** | 按 `migrationPlanEui` 逐组件替换（A 类改 props/导入，B 类手写）；图标与 Chart **保留不动**（见硬约束 9/10） | 组件代码全部替换 | 主 agent（按 ref 读 components/*.md） |
| **3. 验证（机器兜底门禁）** | 必跑脚本：`check-imports.cjs`（硬 FAIL）；`check-select-options.cjs`（硬 FAIL）；`check-provider.cjs`（硬 FAIL）；`check-dark-mode.cjs`（硬 FAIL）；`check-visibility.cjs`（硬 FAIL）；`check-wizards.cjs`（硬 FAIL）；`check-crumbs.cjs`（硬 FAIL）；`check-table-defaults.cjs`（advisory 须逐条回应）；`check-css.cjs`（advisory 须回应）；`check-token-drift.cjs`（token 值漂移硬 FAIL + advisory 须回应）；`check-menu.cjs`（advisory 须回应）。`check-relative-imports.cjs` 跳过（上游已修正，读 `verification.relativeImports=PASS`）；`npm install`（timeout=30000，内网源超时/失败记 SKIP 不判 FAIL） | 验证结果（PASS/FAIL + advisory 回应） | 主 agent / 子 agent |

## 组件映射

> 完整映射（有对应 / 组合替代 / 无对应需手写）含 API 差异、导入特例（Panel 解构 / Tab TabItem / GridLayout Row/Col / RangePicker 解构）见 [component-mapping.md](references/component-mapping.md)；无对应组件手写模板见 [handwrite-templates.md](references/handwrite-templates.md)；单组件完整 API 见 [components/INDEX.md](references/components/INDEX.md) 索引。

## eview-ui 硬约束（迁移时必须遵守）

1. **导入路径**：统一 `import X from '@cloudsop/eview-ui/X'`（子路径**默认**导入；真实包名是 `@cloudsop/eview-ui`——**官方组件文档示例里写的 `eview-ui/X` 是简写，抄写时必须补 `@cloudsop/` 前缀**）。特例仅 4 个：`import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`；`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**必须解构**）；`import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`；`const { RangePicker } = DatePicker`（`<DatePicker.RangePicker>` 改 `<RangePicker>`）。业务代码**禁止残留** `from 'antd'` / `from '@ant-design/icons'` / `from '@nce/eview-react'`（后者是骨架换血目标，残留即换血未完成）。**机器验证**：步骤 3 `check-imports.cjs`，exit≠0 即 FAIL。

2. **骨架换血清单**（步骤 0.5，主 agent 亲自做；**先自检测 profile**——`package.json` 已含 `eview-ui` 依赖且 `main.jsx` 无 `@nce/eview-react` import 即**已是 eview-ui profile 骨架（上游 `--profile eview-ui` 产物），跳过本清单**，仅核对 main.jsx 的 eview-ui 样式 import TODO；以下清单仅对老产物（eview-react profile 骨架）执行）：
   - `package.json`：**删** `@nce/eview-react`、`@cloudsop/horizon`、`@cloudsop/horizon-intl`、`@cloudsop/htimezone`、`@baize/wdk`（eview-react 生态专属）；**保留** `react`/`react-dom`/`react-intl`/`dayjs`/`lodash`/`@hui/icon-plus`/**`@hui/design-token`**（eview-ui 迁移仍需要）；**加** `@cloudsop/eview-ui`（**`^7.1.37`**，已确认）——less 预处理器由其传递依赖提供，**无需显式加 less devDep**（npm install 后 vite 报缺再补）
   - `main.jsx`：**删** `import '@nce/eview-react/styles/aui3_1.css'` + `aui3_1_dark.css` + `import componentsLocales from '@nce/eview-react/locales'`；**加** eview-ui 样式 import（路径待内网确认，TODO 占位）；`IntlProvider` **保留**（react-intl 是公网包，业务 i18n 已由上游接线；`messages` 从 `componentsLocales[locale]`（已删）改为 `{}`——i18n 暂不处理，scenario B/C 业务包合并留 TODO）
   - `index.html`：**删** body 的 `aui3_1` 与 `ev_no_wcag` 类（eview-react 专属）
   - `src/shared/`：**删** 转发 `@nce/eview-react` 的包壳目录（Select/TextField/InputSelect/MultipleSelect/SearchInput/TextArea/DatePicker/Spinner/TreeSelector/TimePicker/Tag/Crumbs 等——它们 import 的包已删，残留必报错）；**保留** `src/shared/Icon/`（硬约束 9 图标策略）；`Cascader/` 若为纯手写（不 import @nce/eview-react）可保留给 antd Cascader 场景，否则删（antd Cascader → 手写，见 handwrite-templates §2）
   - `vite.config.js`：icon-plus proxy/transform 保留（Icon shim 运行时依赖）；`@` 别名保留；**追加 `css.preprocessorOptions.less` 配置块**（`javascriptEnabled: true` + `paths: [path.resolve('node_modules')]` + TildeFileManager 插件处理 `~` 前缀导入——eview-ui 的 .less 样式需要，完整代码见 [migration-workflow.md](references/migration-workflow.md) 步骤 0.5 第 6 条）
   - 换血后业务代码里 `@/shared/<包壳>` 导入在步骤 2 一并替换为 `@cloudsop/eview-ui/X`

3. **ConfigProvider 必须显式传全四项**：`locale="zh"`（**默认是 `en`，不传全英文**——组件内置文案全变英文，最高频遗漏）、`version="aui3"`、`listenTheme`（动态切主题必须，文档要求 version=aui3 且 theme 传值）、`theme={isDark ? 'evening' : 'lightday'}`（**响应式引用 isDark，禁止静态字符串**——写死暗色切换即失效）。位置：app.jsx 内 `AppProvider` 之下包住全部业务渲染树（Dialog 等 portal 经 createPortal 仍在 React 树内，context 可达）；**不要放进叶子组件**。**机器验证**：步骤 3 `check-provider.cjs`。

4. **回调签名**：第一个参数通常是值不是 event（TextField `onChange(value1, value2, event)`、Select `onChange(value, oldValue, text, oldText)`、Checkbox 四参）；**反直觉例外**：Rating `onClick(event, value)`、Table `onRowRightClick(e, row)`、FileUpload `onChange(event, itemList)`——event 在前。完整速查见 [component-mapping.md](references/component-mapping.md)「回调签名差异」表。

5. **显隐 prop 不统一**（最高频张冠李戴）：DialogPro/MessageDialogPro/Loader 用 `isOpen`；Drawer/Tooltip 用 `visible`；Popup/TipBox/DivMessage 用 `display`。**DialogPro/MessageDialogPro 的 `destroyOnClose` 默认 true（antd 默认 false，语义反转）**；所有弹层 `onClose` 都不自动关闭。速查见映射表「显隐 prop 速查」。**机器验证**：步骤 3 `check-visibility.cjs`。

6. **validator 返回 `{result, message}`**（`result: true` = 通过）；FormPro 的 Rule 是**扁平字段**（`required/email/ipv4/min...` + `custom`），不是 antd `{required, message, validator}` 数组——antd Form 迁 FormPro 时必须重写 rules。

7. **API 表里查不到的 props 一律不写**（eview-ui 文档属性表为准；文档标注「示例使用但属性表未列」的 prop 同样不写）。

8. **CSS 色值不漂移 + token 不漂移**：原项目 CSS 写死色值**允许**（忠实保留），但不能擅自改值；类名用业务前缀。**机器验证**：步骤 3 `check-css.cjs` + `check-token-drift.cjs` 对照 `.umd-conversion.json` 的 `sourceCssColors`/`sourceCssTokens` 快照。

9. **图标保留源 shim，不迁移**：`<Icon name="...">`（icon-plus 在线 + Lucide）调用点**零改动**，`import Icon from '@/shared/Icon'` 路径保持；**禁止**改用 eview-ui `Icon`（name 体系不同、无 catalog 匹配依据）、`SvgIcon`（文档标注废弃）、`IconButton`（废弃）。eview-ui 组件的 `leftIcon`/`rightIcon`/`icon` 类 prop 接收**图标 url 字符串**，与 Icon shim（ReactNode）类型不匹配——**不要把 Icon shim 塞进这些 prop**；带图标场景用 children 组合（如 `<Button><Icon name="x"/>{文字}</Button>`）。

10. **图表保留源封装，不迁移**：eview-ui **无 Chart 组件**——保留源项目 `chart.jsx` 封装与其 import 原样；**不需要**补 `a2ui: true`/`theme`（eview-ui 无此约束，勿凭空添加）；暗色下图表主题跟随由源项目逻辑自理。

11. **暗色三轨**（eview-ui 的暗色机制是 body 属性 + class，缺任一轨切换不完整）：
    ① html 轨：`document.documentElement.classList.toggle('dark', isDark)`（自定义 token 四层跟随，上游已有，保留）；
    ② body 属性轨：`document.body.setAttribute('data-theme', isDark ? 'dark' : 'default')`（白天 `default`/黑夜 `dark`）；
    ③ body class 轨：`document.body.classList.toggle('eviewui_aui3_1_evening', isDark)` + `document.body.classList.toggle('eviewui_aui3_1_default', !isDark)`（**白天也必须挂 default 类，不是仅移除 evening**）。
    **换血产物删掉 body `aui3_1_dark` 旧轨**（eview-react 专属，aui3_1_dark.css 已删）；`ConfigProvider theme` 响应派生保留作双保险（新 profile 产物的 app.jsx/index.html 已预置三轨——index.html body 首帧带 `eviewui_aui3_1_default` + `data-theme="default"` 防闪）。**机器验证**：步骤 3 `check-dark-mode.cjs`（检测暗色需求后验证三轨完整性）。

12. **拼写异常照抄原文**：`seprator`（Crumbs）、`disable`（**仅 SelectCard/FileUpload/Tag(message)/PopUpMenu 项**——其余组件用正确拼写 `disabled`，**不要全局替换**）、`placeHolder`（FileUpload/BrowseButton）、`upLoadErrorMessage`、`disposeTimeOut`、`disabelCheckAssociated`、`enablHorzScroll` 等。完整表见映射表「属性拼写异常」。**机器验证**：`check-crumbs.cjs`（separator 正确英文残留即 FAIL）。

13. **按钮/文字类组件内容用 prop 不用 children**：`Button text`、`TextButton text`、`DivMessage text`、`LabelField text`（Button 带 Icon 时例外走 children 组合，见硬约束 9）；`MessageDialog content/detail` 结构区分。

14. **有 Pro 版的组件一律用 Pro 版**：antd 组件只映射到 `SelectPro`（`placeholder` 同名、`onChange(value, options)` 两参、`mode` single/singleSearch/multiple/multiSearch）、`DialogPro`（**无 buttons prop——footer 自写**）、`MessageDialogPro`（受控 + 静态方法双形态）、`TablePro`（dataIndex/rowKey/selection 同构 antd）、`FormPro`（Rule 扁平化）。旧版组件（`Select`/`Table`/`Dialog`/`MessageDialog`/`Form`）**导入即违规**——注意官方组件文档示例里旧版与 Pro 混用，抄文档时认准 Pro。**机器验证**：步骤 3 `check-imports.cjs` 的 LEGACY_PRO_USED（exit≠0 即 FAIL）。

## 命名异常速查

> eview-ui 部分 API 命名与"正确英文"或 antd 习惯不同，迁移前必查 [component-mapping.md](references/component-mapping.md) 文末三张速查表：「属性拼写异常」（seprator/disable/placeHolder/...）、「回调签名差异」（首参是值/event 在前的例外）、「显隐 prop 速查」（isOpen/visible/display/isShow/iconDisplay 全家福）。

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

## 前置 skill：umd-to-antd-vite

以下工作已由 `umd-to-antd-vite` 完成，本 skill 跳过：工程骨架搭建（Vite+npm 工程就位——**新产物**用 `--profile eview-ui` 已是 eview-ui 骨架；**老产物**是默认 profile 骨架，由本 skill 步骤 0.5 换血）、组件扫描（`antdComponents`）、图标调用点预扫（`iconCallSites`）、图表调用点预扫（`chartCallSites`）、token 外置（`src/styles/` 四层）、相对导入修正（`verification.relativeImports=PASS`）、暗色 html `.dark` 轨、i18n 静态接线（scenario A/B 的 `IntlProvider`）。**不使用**上游的 `migrationPlan`/`globalRef` 字段（其内容对应 eview-ui 以外的组件库，与 eview-ui 组件名/坑不匹配）——本 skill 步骤 0 跑自己的 `build-migration-plan.cjs` 生成 `migrationPlanEui`/`globalRefEui`（上游 `--profile eview-ui` 时不跑步骤 5，不会生成该字段）。

## 核心问题（典型失败模式）

- **ConfigProvider 不传 locale**：默认 `en`，DatePicker 月份/分页条/弹层按钮全英文——**必显式 `locale="zh"`**
- **暗色三轨缺轨**：漏 body `data-theme` 或漏 `eviewui_aui3_1_default/evening` 类互换（只切一个不生效）；白天忘挂 default 类；残留 eview-react 的 `aui3_1_dark` 旧轨——`check-dark-mode.cjs` 三轨全检
- **theme 写死静态字符串**：ConfigProvider theme 双保险失效——theme 必须响应 `isDark`
- **骨架换血不彻底**：`@nce/eview-react` import 或 `aui3_1*.css` 残留→构建报错；`src/shared` 转发包壳残留→运行时 import 已删包
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
