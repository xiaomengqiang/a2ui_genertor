# A2UI 工作流参考手册

> 定位：ict-html-mix 技能的**参考与排障手册**——渲染器行为、file:// 直开原理、
> Pitfalls、数据存储规则、文件清单。
> 执行步骤（意图路由 / 路线操作 / 挂载模板 / 校验门禁）与硬约束见同目录 `SKILL.md`；
> 两者职责不重叠：SKILL 管「怎么做」，本文件管「为什么、出问题查哪」。
> 校验 / 元信息维护脚本：`scripts/validate-and-sync.ps1`（唯一，双模式）。

---

## PreviewRenderer 渲染器行为参考

宿主页页尾引用渲染器并登记 nodes（完整挂载模板与登记步骤见 SKILL.md 第 3 步）。

- **渲染器位置（唯一源 + 运行时副本，`-GenMeta` 扇出同步）**：唯一权威源 `scripts/PreviewRenderer.js`（本技能目录）→ 运行时副本 `previewdist/PreviewRenderer.js`（项目根，集中式页引用）+ 各 `<页目录>/previewdist/PreviewRenderer.js`（本地化页）。改源必 bump 宿主页 `?v=`（Pitfall #6）。
- **http 入口页自适应**：fetch `index.html` 失败自动回退 `index.prototype.html`（ict-coder 运行时入口）。

### replace 双模式

| 选项 | 行为 | 适用 |
|---|---|---|
| `replace: true`（默认） | 清空容器内容后渲染 | 路线 A 替换/修改 |
| `replace: false` | 不清宿主内容，仅移除自产节点（`.preview-a2ui-app`）幂等重挂后追加 | 路线 B 新增 / 与宿主内容共存 |

`container` 必填（缺省 init 时显式报错）。错误提示（`_showDefaultError`）任何模式都是追加式，不破坏容器内容；`destroy()` 只删自产节点。`data` 可替代 `dataPath` 传内联对象；运行时临时挂载（控制台一次性）：同参数直接 `new PreviewRenderer({...}).init()`。

### 渲染步骤（自动，每节点）

1. 取数（`*.json` fetch 或孪生；`*.js` script 直载）→ 写入 `window.__A2UI_DATA__`
2. 容器内创建 appDiv（显式 `width/height:100%`）挂载点
3. 加载 previewdist 应用 JS：有 `__A2UI_BOOT__` 工厂出口则工厂挂载（bundle 只解析一次）；否则旧构建兜底（`#app` 挂载，每节点重执行 IIFE——**ict-coder 运行时即此模式**，功能/视觉等价，仅多节点首屏略慢；耗时大头是 bundle 解析 + Tailwind 浏览器运行时编译，两模式共有）
4. 预隐藏 + 布局落定后派发 `resize` 再显现（两种模式行为一致）

---

## 免服务器 file:// 直开

双击任意承载页 HTML（Chrome/Edge）即可查看渲染内容，无需起本地服务。原理：
Chromium 对 `file://` 页面的 fetch/XHR 一律 CORS 拦截，但**经典 `<script>` 标签不受限**，故：

| 环节 | http（服务器） | file://（直开） |
|---|---|---|
| 应用元信息（styles+scripts） | fetch 入口页（自适应 index.html / index.prototype.html） | `PreviewRenderer.js` 内嵌块 `__A2UI_EMBEDDED_META__` |
| 节点数据（`*.json`） | fetch | 同目录 `.data.js` 孪生（script 加载，`window.__A2UI_FILE_DATA__`） |
| 节点数据（`*.js`，ict-coder 产物） | script 直载（文件自写 `window.__A2UI_DATA__`） | 同左（天然免孪生） |
| 默认数据 | fetch `previewdist/data.js` 后执行 | script 直载 `data.js` |
| bundle 脚本 | script 标签 | 同左（不变） |

维护约定：

- **JSON 是唯一事实源**：`.data.js` 孪生由 `validate-and-sync.ps1` 校验 PASS 后自动生成/覆盖，禁止手改。
- **ict-coder 运行时重建后**：重跑 `powershell -ExecutionPolicy Bypass -File "$Skills\ict-html-mix\scripts\validate-and-sync.ps1" -GenMeta`（`$Skills` 为技能根，定位方式见 SKILL.md 第 1 步「技能根定位」；扇出刷新全部渲染器副本内嵌块 → bump 各宿主页 `?v=`）并重拷本地化页的 assets。
- Firefox 的 file:// 策略限制跨目录子资源加载，直开仅支持 Chrome/Edge（本地化页全程同目录/子目录加载，Firefox 也兼容）。
- 只更新 JSON（渲染器未变）：直开页普通刷新即可（孪生带时间戳防缓存）；渲染器变更后需硬刷新 Ctrl+Shift+R（配合 `?v=` bump）。

---

## 容器布局与固定高度推导（路线 A/B 挂载参考）

> 路线 A/B 挂载容器时必读：容器需清空布局类（交由 JSON root）、并用固定高度 `h-[xxx]`（禁 `min-h`/`max-h`，因 CSS `height:100%` 需明确高度锚点）。SKILL.md 各路线以「见 WORKFLOW.md 容器布局与固定高度」引用本节。

### 陷阱 1：容器自带布局类与 JSON root 布局重复

**场景**：路线 A 替换模式，目标容器 HTML 已有布局类（如 `class="grid grid-cols-1 lg:grid-cols-3 gap-6"`），而 JSON 的 root element 也带了相同的 grid/flex 布局类。

**后果**：双重 grid/flex 声明导致渲染异常——容器自身布局和 A2UI 渲染内容的布局叠加冲突，内容失去正确的列跨度控制、列宽异常、内边距翻倍。

**规范**：
- **优先统一布局控制权**：路线 A 替换时，将容器 HTML 的布局类清空（改为普通空 div 或仅保留定位类），JSON root 完全掌控布局。不要让 HTML 和 JSON 各管一部分。
- **例外**：如果容器仅为定位锚点（如 `id="xxx"` 且无布局类），则无需改动 HTML，JSON root 正常写布局类。
- 若不确认容器担任布局角色还是纯锚点角色，一律清空 HTML 布局类、把布局控制权交给 JSON。

### 陷阱 2：挂载容器必须用固定高度 `h-[xxx]`

**场景**：路线 A/B 将 A2UI 内容挂载到容器，容器高度用 `min-h-[xxx]` 或 `max-h-[xxx]` 设置。

**根因**：PreviewRenderer.js 注入的 CSS shim 强制内部元素 `height:100%; max-height:100%; overflow:hidden`，使渲染内容高度从容器继承。但 CSS 规范中 **`height:100%` 仅在父元素有明确 `height` 值时生效**（绝对值或百分比链到视口 / 定高祖先）。`min-height` / `max-height` 不参与百分比高度计算。高度继承链断裂后，内容以自然高度撑开到数千 px。

**规范**：
- A2UI 挂载容器**必须用 `h-[xxx]` 固定高度**（如 `h-[408px]`），不允许用 `min-h` / `max-h`。
- 容器高度应基于**页面上下文读取**，在生成 A2UI JSON 时同步确定，**一步到位**：

  **高度推导步骤（按序执行，缺一不可）**：
  1. **读目标容器当前尺寸与间距**：用 DevTools 或 Read 页面片段获取目标容器的 `offsetHeight` 或计算后高度，以及其 className 中的间距类（`p-*` 内边距）。
  2. **读兄弟节点尺寸与间距**：读取目标容器同一父级下的相邻兄弟节点的实际高度与 className，确认行对齐关系（grid 同行容器高度 = 最高卡片高度），同时记录兄弟节点的 `p-*` 内外边距与 `rounded-*` 圆角风格。
  3. **读父节点间距上下文**：读取父容器的 `gap-*`（子元素间距）、`space-y-*`/`space-x-*`（流向间距）等间距类，确认容器之间间距的精确像素值。
  4. **读目标容器原有布局类**：记录容器当前 className 中的 `grid`/`flex`/`gap`/`p-*` 等布局类（后续清空用，见陷阱 1）。
  5. **计算容器高度**= max(目标容器当前内容高度, 兄弟节点高度) + 上下间距补偿。若替换后内容高度变化，按新内容重新计算（见下方参考表，但**以实际读取值为准**，参考表仅做估算校验）。

  **间距取值规则**：生成 A2UI JSON 时，容器/卡片的 `p-*` 内边距、`gap-*` 子元素间距、`rounded-*` 圆角等视觉属性，**必须从页面既有 DOM 中读取**——取同一父级下邻近卡片的 class 为基准，保持一致。例如页面中 KPI 卡片用 `p-5 rounded-2xl`，则 A2UI 生成的卡片也应用 `p-5 rounded-2xl`；父容器用 `gap-4`，则 A2UI JSON 的子容器间距也应用 `gap-4`。**禁止脱离页面上下文自行选择间距值。**

  | 内容类型 | 数值来源 | 合计参考 |
  |---|---|---|
  | 折线图/柱状图卡片 | header(~80px) + chart(h-72=288px) + padding(40px) + gap(~8px) | **~416px** |
  | 雷达图卡片 | header(~50px) + chart(h-72=288px) + padding(40px) + 居中余量(~30px) | **~408px** |
  | 表格卡片（有分页） | header(~80px) + table(5行×48px=240px) + pagination(~45px) + padding(40px) | **~405px** |
  | 表格卡片（无分页） | header(~80px) + table(N行×48px) + padding(40px) | 按行数动态计算 |
  | 纯指标卡 | header(~40px) + metric(~60px) + padding(40px) | **~140px** |

- 若无法精确估算，取略高的值并用 `overflow-hidden` 约束（但优先精确计算避免留白）。
- **iframe 预览与浏览器直接打开行为不同**：iframe 高度在首次布局后固定，A2UI 异步渲染完成后不自动伸缩，容器无定高时塌缩/溢出表现比浏览器更恶劣。

### 容器高度自检清单（路线 A/B 挂载前必过）

每次生成新 A2UI JSON 并挂载到容器时，**必须逐项验证以下清单**，确认全部满足：

1. **是否先读取了页面上下文？** —— 已读取目标容器、兄弟节点、父节点的实际尺寸与间距类（`gap`/`p-*`/`space-y-*`），而非凭空估算
2. **容器是否有 `h-[xxx]` 固定高度？** —— 禁止使用 `min-h` / `max-h`
3. **高度值是否 >= header + chart高度 + padding + gap 的总和？** —— 按页面上下文读取值推导并精确计算
4. **内外间距是否与页面既有卡片一致？** —— A2UI 卡片的 `p-*`/`gap-*`/`rounded-*` 应取页面中邻近卡片的 class 值（如 `p-5 rounded-2xl`），不得自行发明间距数值
5. **JSON 内的图表 `className` 是否包含 `h-` 类？** —— 如 `h-72`（BarChart / RadarChart / LineChart 等必须显式设高）
6. **多个子卡片在同一行时，容器高度是否取了兄弟节点的最大值？** —— grid 行容器高度 = 读取到的最高卡片的实际高度
7. **是否加了 `overflow-hidden` 做安全兜底？** —— 防止意外溢出撑开布局

---

## 已知注意事项 / Pitfalls

> 排障先看这里。

1. **应用外壳 `h-screen` 撑爆小容器（直接模式）**：卡片高度变 100vh。已内置垫片 CSS 钉稳 `shell → content-wrap → a2ui-surface` 高度链为 `100%`；**不要去改 previewpc 内部**。
2. **图表卡高度塌成 10px**：根因是纯 CSS 高度链——`flex-col` 漏 `flex` → 子项 `flex-1` 失效。硬规则：凡 `flex-col`/`flex-row`/`flex-wrap` 必带 `flex`；图表组件（component 名以 `Chart` 结尾）`className` 必含显式 `h-` 高度类（`h-full`/`h-64`，`min-h-0` 不算）。图表 DOM 拿到真实高度后自带 ResizeObserver 自愈，无需改图表组件。
3. **`loadData` 不认 `'../'` 前缀 URL、也不支持 `*.js` wrapper 文件**：URL 判定只认 `'http'/'/'/'./'` 开头且按裸 JSON 解析。运行时注入数据先自行 `fetch` 拿对象再 `loadData(对象)`；`*.js` 数据源改用初始 `dataPath`（原生支持）。
4. **多节点必须串行**：共享 `window.__A2UI_DATA__`，并发会张冠李戴。页内编排用 promise 链串行。
5. **卡片/图表不撑满容器**：appDiv 用显式 `position:absolute;top:0;left:0;width:100%;height:100%`（**不是** `inset:0`——简写在某些环境 `bottom` 不生效，appDiv 退化成内容高度、整链塌缩）。排查：DevTools 看 `.preview-a2ui-app` 的 `offsetHeight` 是否 = 容器高度。
6. **改渲染器必 bump `?v=`**：渲染器唯一权威源在本技能 `scripts/PreviewRenderer.js`，运行时副本（项目根 previewdist / 各本地化页 previewdist）由 `-GenMeta` 扇出同步；宿主页引用带 `?v=N` 缓存指纹，每次改源 +1（本地化页版本号**独立**维护）；首次验证用 Ctrl+Shift+R 硬刷新。多次"改了没生效"实为浏览器吃了旧 JS——排障先排除缓存。

---

## 数据存储规则

- **存储布局（两种，以页面现有 nodes 引用形态判定）**：**本地化**（现行默认）——页目录 `a2ui-data/<slug>/<slug>.json`（每节点独立文件夹，JSON 唯一事实源）+ 页目录 `previewdist/`；**集中式**（既有页沿用）——项目根 `output/<module>[-<页标识>]-output.json` + 项目根 `previewdist/`。布局规则与判定特征见 SKILL.md 第 1 步存储布局表。
- **所有新产生的 JSON 必须直接写入 `a2ui-data/` 目录**，不使用 `output/` 作为中间暂存，也不走 package → extract → copy 的管道流程。ict-coder 的 Step 5 直接保存到 `a2ui-data/<slug>/<slug>.json`，无中间产物需清理。
- **孪生**：每个活跃 JSON 伴随同名 `.data.js`（file:// 直开用，校验时自动生成在其所在文件夹，勿手改）；`*.js` 数据源天然免孪生。
- **本地化运行时**：页目录 `previewdist/` 来源 = **ict-coder 技能运行时**（`$Skills\ict-coder\scripts\previewdist\`，`$Skills` 为技能根，定位方式见 SKILL.md 第 1 步「技能根定位」；~21.6MB 真拷贝：index.prototype.html + assets + uploads + 渲染器），previewdist **不从项目根取**（拷贝命令见 SKILL.md 第 1 步）；页面引用全 `./`、`?v=` 独立维护。

---

## 文件清单

| 文件 | 角色 |
|---|---|
| `.opencode/skills/ict-html-mix/SKILL.md` | **执行手册**：意图路由 / 路线操作步骤 / 硬约束 |
| `.opencode/skills/ict-html-mix/WORKFLOW.md`（本文件） | **参考手册**：渲染器行为 / file:// 原理 / Pitfalls / 存储规则 / 文件清单 |
| `.opencode/skills/ict-html-mix/scripts/validate-and-sync.ps1` | **唯一维护脚本（双模式）**：`-InputFile` JSON 语法 + 项目 lint（flex/图表高度）+ file:// 孪生生成（A2UI 结构校验由 ict-coder 生成侧兜底）；`-GenMeta` 提取 ict-coder 运行时元信息扇出回写渲染器内嵌块 |
| `.opencode/skills/ict-html-mix/scripts/locate-skill-root.ps1` | **技能根解析 + ict-coder 依赖检查**：从脚本位置上溯推导 `$Skills`，SKILL.md 与 validate-and-sync.ps1 共用，消除硬编码 |
| `.opencode/skills/ict-coder/` | 生成技能：产出 A2UI JSON（另含打包为独立原型页能力）；本工作流仅借其生成能力 |
| `.opencode/skills/ict-html-mix/scripts/PreviewRenderer.js` | **渲染器唯一权威源**（`-GenMeta` 扇出同步到各运行时副本） |
| `previewdist/` | 项目根运行时（集中式页引用） |
| `<页目录>/previewdist/` | 本地化页运行时副本（来源 = ict-coder 运行时） |
| `<页目录>/a2ui-data/<slug>/` | 本地化页每节点数据文件夹（json + 孪生） |
| `output/<name>.json` + `.data.js` | 集中式页数据产物 + file:// 孪生 |
| 各承载页 `*.html` | 承载页（文档流布局，页尾内联编排） |