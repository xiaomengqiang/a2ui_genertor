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

- **存储布局（两种，以页面现有 nodes 引用形态判定）**：**本地化**（现行默认）——页目录 `a2ui-data/<slug>/<slug>.json`（每节点独立文件夹）+ 页目录 `previewdist/`；**集中式**（既有页沿用）——项目根 `output/<module>[-<页标识>]-output.json` + 项目根 `previewdist/`。布局规则与判定特征见 SKILL.md 第 1 步存储布局表。
- **孪生**：每个活跃 JSON 伴随同名 `.data.js`（file:// 直开用，校验时自动生成在其所在文件夹，勿手改）；`*.js` 数据源天然免孪生。
- **本地化运行时**：页目录 `previewdist/` 来源 = **ict-coder 技能运行时**（`$Skills\ict-coder\scripts\previewdist\`，`$Skills` 为技能根，定位方式见 SKILL.md 第 1 步「技能根定位」；~21.6MB 真拷贝：index.prototype.html + assets + uploads + 渲染器），previewdist **不从项目根取**（拷贝命令见 SKILL.md 第 1 步）；页面引用全 `./`、`?v=` 独立维护。

---

## 文件清单

| 文件 | 角色 |
|---|---|
| `.opencode/skills/ict-html-mix/SKILL.md` | **执行手册**：意图路由 / 路线操作步骤 / 硬约束 |
| `.opencode/skills/ict-html-mix/WORKFLOW.md`（本文件） | **参考手册**：渲染器行为 / file:// 原理 / Pitfalls / 存储规则 / 文件清单 |
| `.opencode/skills/ict-html-mix/scripts/validate-and-sync.ps1` | **唯一维护脚本（双模式）**：`-InputFile` JSON 语法 + 项目 lint（flex/图表高度）+ file:// 孪生生成（A2UI 结构校验由 ict-coder 生成侧兜底）；`-GenMeta` 提取 ict-coder 运行时元信息扇出回写渲染器内嵌块 || `.opencode/skills/ict-coder/` | 生成技能：产出 A2UI JSON（另含打包为独立原型页能力）；本工作流仅借其生成能力 |
| `.opencode/skills/ict-html-mix/scripts/PreviewRenderer.js` | **渲染器唯一权威源**（`-GenMeta` 扇出同步到各运行时副本） |
| `previewdist/` | 项目根运行时（集中式页引用） |
| `<页目录>/previewdist/` | 本地化页运行时副本（来源 = ict-coder 运行时） |
| `<页目录>/a2ui-data/<slug>/` | 本地化页每节点数据文件夹（json + 孪生） |
| `output/<name>.json` + `.data.js` | 集中式页数据产物 + file:// 孪生 |
| 各承载页 `*.html` | 承载页（文档流布局，页尾内联编排） |

