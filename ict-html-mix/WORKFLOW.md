# A2UI 工作流参考手册

> 定位：ict-html-mix 技能的**参考与排障手册**——渲染器行为、file:// 直开原理、
> Pitfalls、数据存储规则、文件清单。
> 执行步骤（意图路由 / 路线操作 / 挂载模板 / 校验门禁）与硬约束见同目录 `SKILL.md`；
> 两者职责不重叠：SKILL 管「怎么做」，本文件管「为什么、出问题查哪」。
> 校验 / 元信息维护脚本：`scripts/validate-and-sync.ps1`（唯一，双模式）。

---

## PreviewRenderer 渲染器行为参考

宿主页页尾引用渲染器并登记 nodes（完整挂载模板与登记步骤见 SKILL.md 第 3 步）。

- **渲染器位置（唯一源 + 运行时副本，`-GenMeta` 扇出同步）**：唯一权威源 `scripts/PreviewRenderer.js`（本技能目录）→ 运行时副本 `previewdist/PreviewRenderer.js`（项目根，历史副本）+ 各 `<页目录>/previewdist/PreviewRenderer.js`（本地化页）。改源必 bump 宿主页 `?v=`（Pitfall #6）。
- **http 入口页自适应**：fetch `index.html` 失败自动回退 `index.prototype.html`（ict-coder 运行时入口）。

### replace 双模式

| 选项 | 行为 | 适用 |
|---|---|---|
| `replace: true`（默认） | 清空容器内容后渲染 | 路线 A 替换/修改 |
| `replace: false` | 不清宿主内容，仅移除自产节点（`.preview-a2ui-app`）幂等重挂后追加 | 路线 B 新增 / 与宿主内容共存 |

`container` 必填（缺省 init 时显式报错）。错误提示（`_showDefaultError`）任何模式都是追加式，不破坏容器内容；`destroy()` 只删自产节点。`data` 可替代 `dataPath` 传内联对象；运行时临时挂载（控制台一次性）：同参数直接 `new PreviewRenderer({...}).init()`。

### 渲染步骤（自动，每节点）

1. 取数（`*.js` script 直载，文件自写 `window.__A2UI_DATA__`）
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
| 节点数据（`*.js` = data.js 产物，唯一形态） | script 直载（文件自写 `window.__A2UI_DATA__`） | 同左（天然支持 file://） |
| 默认数据 | fetch `previewdist/data.js` 后执行 | script 直载 `data.js` |
| bundle 脚本 | script 标签 | 同左（不变） |

维护约定：

- **data.js 是唯一数据产物**：自带 wrapper（`window.__A2UI_DATA__ = <JSON>;`），由生成侧直接产出；无孪生、无中间 `.json` 文件，禁止手改 wrapper 结构。
- **默认数据回退仅项目根运行时适用**：本地化页拷贝清单不含 `previewdist/data.js`，nodes 未传 `dataPath` 时渲染器对缺失的默认数据**显式报错**（不会静默沿用串行链上一节点残留的全局数据）；本工作流 nodes 登记一律显式传 `dataPath`。
- **ict-coder 运行时重建后**：重跑 `powershell -ExecutionPolicy Bypass -File "<DirMix>/scripts/validate-and-sync.ps1" -GenMeta -ProjectRoot <项目根>`（`<DirMix>` 为本技能目录，定位方式见 SKILL.md 第 1 步「技能目录定位」；技能装在项目外/非标准层级时 `-ProjectRoot` **必须显式传**，否则项目根按位置推断会算错；扇出刷新全部渲染器副本内嵌块 → bump 各宿主页 `?v=`）并重拷本地化页的 assets。
- Firefox 的 file:// 策略限制跨目录子资源加载，直开仅支持 Chrome/Edge（本地化页全程同目录/子目录加载，Firefox 也兼容）。
- 只更新 data.js（渲染器未变）：普通刷新即可（script 加载带时间戳防缓存）；渲染器变更后需硬刷新 Ctrl+Shift+R（配合 `?v=` bump）。

---

## 已知注意事项 / Pitfalls

> 排障先看这里。

1. **应用外壳 `h-screen` 撑爆小容器（直接模式）**：卡片高度变 100vh。已内置垫片 CSS 钉稳 `shell → content-wrap → a2ui-surface` 高度链为 `100%`；**不要去改 previewpc 内部**。
2. **图表卡高度塌成 10px**：根因是纯 CSS 高度链——`flex-col` 漏 `flex` → 子项 `flex-1` 失效。硬规则：凡 `flex-col`/`flex-row`/`flex-wrap` 必带 `flex`；图表组件（component 名以 `Chart` 结尾）`className` 必含显式 `h-` 高度类（`h-full`/`h-64`，`min-h-0` 不算）。图表 DOM 拿到真实高度后自带 ResizeObserver 自愈，无需改图表组件。
3. **`loadData` 不认 `'../'` 前缀 URL、也不支持 `*.js` wrapper 文件**：URL 判定只认 `'http'/'/'/'./'` 开头且按裸 JSON 解析。运行时注入数据先自行 `fetch` 拿对象再 `loadData(对象)`；`*.js` 数据源改用初始 `dataPath`（原生支持）。
4. **多节点必须串行**：共享 `window.__A2UI_DATA__`，并发会张冠李戴。页内编排用 promise 链串行。
5. **卡片/图表不撑满容器**：appDiv 用显式 `position:absolute;top:0;left:0;width:100%;height:100%`（**不是** `inset:0`——简写在某些环境 `bottom` 不生效，appDiv 退化成内容高度、整链塌缩）。排查：DevTools 看 `.preview-a2ui-app` 的 `offsetHeight` 是否 = 容器高度。
6. **改渲染器必 bump `?v=`**：渲染器唯一权威源在本技能 `scripts/PreviewRenderer.js`，运行时副本（项目根 previewdist / 各本地化页 previewdist）由 `-GenMeta` 扇出同步；宿主页引用带 `?v=N` 缓存指纹，每次改源 +1（本地化页版本号**独立**维护）；首次验证用 Ctrl+Shift+R 硬刷新。多次"改了没生效"实为浏览器吃了旧 JS——排障先排除缓存。

### 布局类 Pitfalls（路线 A 挂载前必读，#7–#11）

> 执行规范（速查表/速查铁律）已内联于 SKILL.md 第 1 步；以下为原理、后果与排障细节。两处口径同源：表格分页高度 ≈ 413px，图表卡 ≈ 424px。

7. **容器 HTML 布局类与 data.js root 布局重复**：路线 A 替换时，目标容器 HTML 已有布局类（如 `class="grid grid-cols-1 lg:grid-cols-3 gap-6"`），而 data.js 的 root element 又写了相同 grid/flex 布局 → 双重布局声明叠加，内容失去列跨度控制、列宽异常、内边距翻倍。**规范**：清空容器布局类（改为普通空 div 或仅保留 id/定位类），布局控制权统一交 data.js root；容器本就是纯锚点（仅 `id` 无布局类）则无需改动。不确定容器是布局角色还是锚点角色时，一律清空布局类。
8. **CSS 样式表布局类双重叠加（高危）**：区域级替换时，目标容器布局不在 HTML `class` 属性上，而在 `<style>` / `.css` 的类选择器里（如 `.chart-container { display:grid; grid-template-columns:2fr 1fr; gap:24px }`）→ 外层 CSS grid 把 data.js root 当成单个网格项压进一个单元格，内部两列实际只占一个单元格宽度，列宽异常/重叠。比 #7 更隐蔽（布局类不在 HTML 上，易漏查）。**规范**：在容器 HTML 元素上加 `style="display:block"` 内联覆盖 CSS 的 grid/flex 声明，使容器退化为普通块级元素；**禁止直接编辑样式表**（可能含响应式断点/复用规则）。**自检**：每次区域级替换后，检查容器在 CSS 样式表中是否有 grid/flex/position 规则，有则必须内联覆盖。
9. **容器高度必须由内容自然撑开**：核心原则——容器不写死 `h-[xxx]` 固定高度（会截断超限内容，出现"只剩标题+部分内容"），高度控制放在 data.js 内部。各类内容高度推导（参考值，实际以页面上下文为准）：
   - **图表组件**（BarChart/LineChart/RadarChart 等）：className 必含显式 `h-[xxx]`（如 `h-[320px]`），不依赖父容器高度；卡片总高 ≈ header(44) + chart(320) + padding(48) + gap(12) ≈ **424px**。
   - **表格默认分页**（每页 5 行）：高度 ≈ 表头区(80) + 5行×48 + 分页条(45) + padding(48) ≈ **413px**，与图表卡自然对齐，无需 max-h。
   - **表格全显**（用户明确要求）：按实际行数 × 48px/行估算，外层 `max-h-[380px] overflow-y-auto` 约束。
   - **指标/KPI 卡**：≈ header(40) + metric(60) + padding(48) ≈ **148px**。
   - **多卡区域容器**：不设固定高，= 行内最高卡片；行内高度对齐交给 grid `align-items: stretch`。
   **常见误区**：给容器写死 h-[xxx]（截断超限内容）；用 overflow:hidden 做安全兜底（静默截断，见 #10）；给图表套 max-h+滚动（图表自带 h-[xxx] 不会溢出，不需要）。
   **间距取值规则**：`p-*`/`gap-*`/`rounded-*` 等视觉属性必须从页面既有 DOM 实读取值——同一父级下邻近卡片的 class 为基准（页面 KPI 用 `p-5 rounded-2xl` 则 A2UI 卡片同款；父容器 `gap-4` 则子容器间距同 `gap-4`），禁止脱离页面上下文自选数值。
10. **表格/列表可变高度内容的 overflow 策略**：`max-h-*` 必须配 `overflow-y-auto`（超限可滚动），**禁止配 `overflow-hidden`**（静默截断，用户看不到完整信息）；列表内容与混合内容卡片（以最长子项估高）同样用 `max-h` + `overflow-y-auto`；图表组件自带 h-[xxx] 固定高度，不需要额外约束。
11. **视觉样式与容器 CSS 重复叠加**：路线 A 替换时，容器在页面 CSS 中已有视觉样式（`box-shadow`/`padding`/`border-radius`/`background`），data.js 卡片又带同款（`p-6 rounded-[8px] shadow-sm bg-white`）→ padding 翻倍（内容区缩窄、破坏与相邻卡片对齐）、阴影叠影、圆角/背景冲突。**去重原则**：容器已有的视觉属性，data.js 不再设——

    | 样式属性 | 容器 CSS 有？ | data.js root 有？ | 操作 |
    |---|---|---|---|
    | padding | 是 | 是 → **去重** | 去掉 data.js 的 `p-*`（容器提供）或去掉容器的类名、迁移到 data.js |
    | box-shadow | 是 | 是 → **去重** | 去掉 data.js 的 `shadow-*`（容器提供）或去掉容器的类名、迁移到 data.js |
    | border-radius | 是 | 是 → **去重** | 去掉 data.js 的 `rounded-*`（容器提供）或去掉容器的类名、迁移到 data.js |
    | background | 是 | 是 → **去重** | 去掉 data.js 的 `bg-*`（容器提供）或去掉容器的类名、迁移到 data.js |

    任一项重复即为缺陷。**特例（容器被清空后样式失效）**：原容器有视觉样式但路线 A 替换后被清空为 `<div id="xxx"></div>`，容器自身已无子元素撑开，CSS 视觉样式残缺——此时把容器的视觉样式（padding/shadow/rounded/background）**全部迁移**到 data.js root 的 className，容器 HTML 去掉视觉类名（如去掉 `class="chart-card"`）改为纯定位锚点 `<div id="xxx"></div>`。**id 必须保留**（nodes 登记的 container 选择器靠它命中，删掉 id 挂载即失败）；禁止保留容器 CSS 样式的同时又在 data.js 中重复设。

---

## 数据存储规则

- **存储布局（唯一：本地化）**：页目录 `a2ui-data/<slug>/data.js`（每节点独立文件夹，自带 wrapper 的唯一数据产物）+ 页目录 `previewdist/`。最终交付物无集中式布局。
- **中间产物口径（与 SKILL.md 第 1 步一致）**：不走 package → extract → copy 管道。ict-coder Step 1–5 产出的 `output/a2ui-output-{timestamp}.json` **仅为短暂中间产物**（落当前工作空间根 `output/`）——由 ict-html-mix 读取后用 Write 落盘为 `a2ui-data/<slug>/data.js`（wrapper 内 JSON 多行缩进），双道校验（ict-coder 结构校验 + validate-and-sync 语法/lint）均 PASS 后即删除；最终交付物只有 data.js，`output/` 不留残余。
- **无孪生机制**：data.js 自带 wrapper（`window.__A2UI_DATA__ = <JSON>;`），http 与 file:// 均 script 直载，天然免任何转换产物。
- **本地化运行时**：页目录 `previewdist/` 来源 = **ict-coder 技能运行时**（`<DirCoder>/scripts/previewdist/`，`<DirCoder>` 为 ict-coder 技能目录，定位方式见 SKILL.md 第 1 步「技能目录定位」；~21.6MB 真拷贝：index.prototype.html + assets + uploads + 渲染器），previewdist **不从项目根取**（拷贝命令见 SKILL.md 第 1 步）；页面引用全 `./`、`?v=` 独立维护。

---

## 文件清单

| 文件 | 角色 |
|---|---|
| `<ict-html-mix 技能目录>/SKILL.md` | **执行手册**：意图路由 / 路线 A–D 操作步骤 / 挂载模板 / 校验门禁 / 高度速查表 / 硬约束 |
| `<ict-html-mix 技能目录>/WORKFLOW.md`（本文件） | **参考手册**：渲染器行为 / file:// 原理 / Pitfalls / 存储规则 / 文件清单 |
| `<ict-html-mix 技能目录>/scripts/validate-and-sync.ps1` | **唯一维护脚本（双模式）**：`-InputFile` data.js 语法校验（剥 wrapper）+ 项目 lint（A2UI 结构校验由 ict-coder 生成侧兜底）；`-GenMeta` 提取 ict-coder 运行时元信息扇出回写渲染器内嵌块 |
| `<ict-coder 技能目录>` | 生成技能：产出 A2UI 数据（本工作流直接落盘为 `a2ui-data/<slug>/data.js`，仅借其 Step 1–5 生成能力） |
| `<ict-html-mix 技能目录>/scripts/PreviewRenderer.js` | **渲染器唯一权威源**（`-GenMeta` 扇出同步到各运行时副本） |
| `previewdist/` | 项目根运行时（历史副本，`-GenMeta` 兼容同步） |
| `<页目录>/previewdist/` | 本地化页运行时副本（来源 = ict-coder 运行时） |
| `<页目录>/a2ui-data/<slug>/` | 本地化页每节点数据文件夹（data.js，唯一数据产物） |
| 各承载页 `*.html` | 承载页（文档流布局，页尾内联编排） |