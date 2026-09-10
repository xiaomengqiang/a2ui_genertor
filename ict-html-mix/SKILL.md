---
name: ict-html-mix
description: A2UI 节点工作流：在承载页上生成、校验、替换、新增、修改或移除 A2UI 渲染节点，覆盖节点完整生命周期。管线：ict-coder 生成 data.js → validate-and-sync.ps1 校验 → 页面挂载。用户只需提供 页面 + 节点 + 需求。Use when the user mentions 承载页/替换节点/新增节点/渲染到节点/A2UI/code_artifact, or wants to modify already-rendered A2UI content.
---

# A2UI 节点工作流（执行手册）

用户输入三要素：**页面**（承载页路径）+ **节点**（选择器或描述）+ **需求**（要渲染/改成什么）。
若缺项，先用 question 工具向用户确认，不要猜。

> **分工**：本文件 = 执行手册（怎么做）；`WORKFLOW.md` = 参考手册（渲染器行为 / file:// 原理 / Pitfalls 排障 / 存储规则，按需查阅）；`scripts/` = 渲染器唯一权威源 `PreviewRenderer.js` + 唯一校验维护脚本 `validate-and-sync.ps1`。

## 首要总则：内容修改一律走管线

凡经本 skill 的**内容**修改，必须：调用 `ict-coder` 生成/派生对应 **data.js** → `validate-and-sync.ps1` 校验 PASS → 渲染器挂载生效。**禁止直接编辑页面既有 DOM/内容/样式来达成显示变化**——即使是原生 HTML 内容（原生表格、原生 DOM、非 A2UI 渲染的内容）也不得手改，必须先转化为 A2UI 渲染节点，再通过 data.js 数据层修改。

允许触碰页面的操作仅限两类（其余一律走 data.js）：

1. **结构登记**：页尾 `nodes` 数组项增删、渲染器 `script` 标签与 `?v=` bump、路线 B 新槽位插入、路线 D 移除自建槽位。
2. **路线 A 容器整备**（把布局控制权交给 data.js 的必要步骤，方法见 WORKFLOW.md Pitfall #7/#8/#11）：清空容器布局类、加 `style="display:block"` 覆盖 CSS 布局声明、迁移/移除容器视觉类。

已渲染内容的微调走路线 C（data.js 层 patch，遵守 ict-coder 的最小变更纪律：只改用户所述，其余字节不动）。

---

## 前置步骤：承载页入位（会话上传文件场景，先于意图路由执行）

若用户要修改的承载页 HTML 来自**当前会话上传的文件**（位于 `.octo/ses_<会话ID>/uploads/`）：

1. **用户选定**：会话上传了多个 html 而用户未指明目标时，先列出 uploads 下的 html 供用户选择，不要猜。
2. **复制副本并重命名**：选定后**必须先将该 html 复制**到当前会话产物目录 `[artifact-folder]`（即 `.octo/ses_<会话ID>/outputs/`，取运行时注入的 `[Artifact Folder]` 实际路径，勿硬编码会话 ID），同时将文件名改为 `{原文件名}.prototype.html`。用**文件工具**完成复制（跨平台，无需 shell）：
   - **Read**：读取 uploads 下选定的源 html 全文；
   - **Write**：将读到的完整内容写入 `<[artifact-folder]>/{原文件名}.prototype.html`。

   > 若源文件本身已包含 `.prototype.` 后缀（如 `xxx.prototype.html`），则保持原名不变，直接复制。
   > ⚠️ Read 对单行超过 2000 字符会截断：若源 html 内联了压缩脚本/超长样式行（工具生成页面常见），**禁止** Read+Write 复制，改用 shell 复制兜底（Windows `Copy-Item` / Unix `cp`），并核对副本与源文件大小一致。
3. **后续一律基于副本操作**：本地化拷贝（`previewdist/`）、`a2ui-data/` 存储、页尾 nodes 挂载等所有写操作，承载页路径均指向 outputs 下的副本；**副本所在目录即「页目录」**。`uploads/` 中的原始上传文件视为**只读源**，禁止直接修改或在其中派生产物。
4. **交付说明**：完成后向用户回报副本路径（outputs 下可直接预览的页面文件）及配套产物位置；回退时只需还原/删除副本，原始上传不受影响。

非上传来源（项目内既有页面）不经过此步骤，按原流程直接以项目路径为页目录。

---

## 第零步：意图路由（必做）

| 用户意图 | 路线 |
|---|---|
| 「在 X **上**加一个 Y」「给 X 的表格加一行」「修改 X 的 Z」（X 为已渲染 A2UI 节点） | **路线 C 修改模式**（patch 既有 data.js，不改页面结构） |
| 「替换 X 节点为 Y」「把 X 渲染成 Y」 | **路线 A 替换模式**（清空 X 内容渲染新内容，容器保留） |
| 「在 X 后新增一张独立卡」「页面加一个新模块」 | **路线 B 新增模式**（造新槽位 + 挂载） |
| 「把 X 区域整体改为 Y」且 X 内部**已含 A2UI 渲染子节点**（X 为外层大区域） | **路线 A 区域级替换**（见「路线 A 区域级替换」小节） |
| 「删掉 X」「下线 X」「不要这个节点了」 | **路线 D 移除模式**（见「路线 D：移除节点」小节） |
| 以上都不匹配 / 意图模糊 | 用 question 工具向用户澄清，**禁止猜路线** |

**硬约束：禁止无差别删除节点（删除走路线 D 且先确认）；禁止绕过管线直接手改原页面内容（见首要总则）。**
路线 A 只清空目标容器内容由渲染器重渲染；路线 B 不动任何既有节点。

**区域覆盖优先规则**：处理粒度以**用户选中区域**为准。当用户选中的目标区域**包含**既有 A2UI 渲染子节点（选中范围大于页尾 nodes 中已登记的 container）时，必须对**整个选中区域**走路线 A 整体替换——**禁止**退化为只针对内部部分子节点的局部修补（路线 C patch / 逐卡拆改）来绕过区域级接管。

---

## 路线 A / B：生成新内容并挂载

### 第 1 步：生成 A2UI data.js

用 **skill 工具加载 `ict-coder` 技能**并按其生成工作流产出数据。本工作流借其 **Step 1–5**（生成 + 结构校验），**不执行其 Step 6 打包/artifact 输出**。wrapper 落盘桥接（由本 skill 负责，ict-coder 不参与）：

1. ict-coder 按 Step 1–5 正常产出并校验 `output/a2ui-output-{timestamp}.json`（结构校验须 PASS）。
   注意 ict-coder 文档内命令均为相对路径（`scripts/validate-a2ui.mjs`、`output/`），跨技能调用时工作目录不保证在其技能目录——其校验命令与中间 JSON 的一应读写**一律改用 `<DirCoder>` 解析出的绝对路径**（如 `node "<DirCoder>/scripts/validate-a2ui.mjs" "<工作空间根>/output/a2ui-output-{timestamp}.json" --fix`）；中间 JSON 实际落盘在**当前工作空间根**的 `output/`（与页目录可能相距甚远，勿混淆）。
2. 本 skill 读取该校验通过的 JSON，用 **Write 工具**按 wrapper 格式 `window.__A2UI_DATA__ = <JSON>;` 写入 `<页目录>/a2ui-data/<slug>/data.js`（一节点一文件夹，slug 为 kebab-case 且**不得与页目录既有 slug 重名**——重名会覆盖旧 data.js，拿不准先列 `a2ui-data/` 目录）。**wrapper 内 JSON 必须保持多行缩进格式（每键一行），禁止压缩为单行**——路线 C 的 Read/Edit patch 依赖逐行读写，单行超过 2000 字符会被 Read 截断，Edit 将失配或改坏文件。
3. 随后由第 2 步 `validate-and-sync.ps1` 校验 wrapper 语法 + lint（结构校验 + 语法 lint 双保险，对象不同、不可互替）。
4. 中间产物 `output/a2ui-output-{timestamp}.json` 在 wrapper 写入且两道校验均 PASS 后删除（不作为交付物）。

**技能目录定位**（本地化拷贝与第 2 步校验共用的前置动作）：技能**不一定装在项目根**——可能位于用户技能目录，且两个技能**不保证同级安装**。故不设「技能根」共享父目录假设，**按技能逐个直接取目录**（skill 工具加载技能时会输出其 Skill directory 绝对路径），全程禁止硬编码：

1. **本技能目录 `<DirMix>`**：加载 ict-html-mix 时输出的 Skill directory 绝对路径（= 本 SKILL.md 所在目录）。
2. **ict-coder 目录 `<DirCoder>`**：第 1 步本来就要用 skill 工具加载 ict-coder——其加载输出中的 Skill directory 绝对路径**顺手记录**即得，无需额外探测。
3. **兜底**（加载输出未含目录信息时），按优先级依次探测，**禁止只依赖 Glob**：
   a. **本技能所在目录的同级探测（首选）**：取 `<DirMix>` 的父目录（即本技能所在的技能安装目录），探测 `<父目录>/ict-coder/SKILL.md` 是否存在（用 bash 工具 `Test-Path` 按绝对路径直查）。**Glob 工具只扫描 opencode 当前工作空间**——当本技能装在工作空间之外时，ict-coder 同样在工作空间之外，Glob 必然落空；而同级绝对路径探测不受工作空间限制，两技能同目录安装时（常见布局）必然命中。
   b. **Glob 工作空间扫描（次选）**：a 未命中且技能可能装在工作空间内时，用 **Glob** 分别匹配 `**/ict-html-mix/SKILL.md` 与 `**/ict-coder/SKILL.md`。
4. 仍取不到 → 立即停止并向用户报告，禁止盲跑。

**页面本地化**：运行时从 ict-coder 技能拷贝（`<DirCoder>/scripts/previewdist/` → 页目录 `previewdist/`），previewdist **不从项目根取**。数据用页目录 `a2ui-data/<slug>/`，页面引用全 `./` 相对路径、`?v=` 版本号**独立维护**。

本地化拷贝（`<页目录>` 换成实际页目录、`<DirMix>`/`<DirCoder>` 换成上一步定位到的技能目录绝对路径；先建目录再拷贝，任意工作目录可执行），拷贝清单：

| 源 | 目标（`<页目录>/previewdist/`） |
|---|---|
| `<DirCoder>/scripts/previewdist/index.prototype.html` | `previewdist/index.prototype.html` |
| `<DirMix>/scripts/PreviewRenderer.js` | `previewdist/PreviewRenderer.js` |
| `<DirCoder>/scripts/previewdist/assets/`（整目录） | `previewdist/assets/` |
| `<DirCoder>/scripts/previewdist/uploads/`（整目录） | `previewdist/uploads/` |

用 bash 工具以**当前平台原生复制命令**执行（Windows 下该工具即 PowerShell：`New-Item` + `Copy-Item -Recurse`；Linux/macOS：`mkdir -p` + `cp -r`）；源中的 `data.js` **不拷**。

> ⚠️ 含二进制 assets（约 21.6MB），**禁止**用 Read/Write 工具复制（超长行截断 + 二进制损坏），必须走 shell 复制命令。

「根据原内容」生成时，先从页面既有脚本/DOM 中提取真实数据（图表 series、文案、数值），保持数据保真，不凭空发明。跨页复用既有 data.js 派生产物时，数值字段必须与本页语境一致，不要照抄他页数值。

**⚠️ 生成前必须读取页面上下文**：在调用 ict-coder 生成新 data.js 之前，**必须先读取承载页中目标容器及周边兄弟节点、父节点**的 HTML 片段与生效 CSS，记录其实际尺寸（邻近卡片自然高度）、间距类（`gap-*`/`p-*`/`space-y-*`）、布局类（`grid`/`flex`/`grid-cols-*`）、视觉样式（padding/shadow/rounded/bg）、父子关系与 DOM 顺序。data.js 中的间距与视觉类必须取自这些实读值，不得凭空估算（去重规则见 WORKFLOW.md Pitfall #11）。

**高度与间距速查表（唯一口径；原理与推导见 WORKFLOW.md Pitfall #9/#10）**：

| 内容类型 | 高度策略 | 参考高度 |
|---|---|---|
| 图表卡（Bar/Line/Radar 等） | 容器不设固定高；图表 className 必含显式 `h-[xxx]`（如 `h-[320px]`） | ≈ **424px**（44 头 + 320 图 + 48 padding + 12 gap） |
| 表格卡（默认分页，每页 5 行） | `pagination: true`；容器不设固定高、无需 max-h | ≈ **413px**（80 头 + 240 表 + 45 分页 + 48 padding） |
| 表格卡（用户明确要求全显） | `pagination: false` + 外层 `max-h-[xxx] overflow-y-auto`（默认 `max-h-[380px]`） | 按实际行数 × 48px/行估算 |
| 指标 / KPI 卡 | 容器不设固定高，内容自然撑开 | ≈ **148px**（40 头 + 60 metric + 48 padding） |
| 多卡区域容器 | 不设固定高；行内卡片高度对齐交给 grid `align-items: stretch` | = 行内最高卡片 |

速查铁律：

1. **禁止给容器写死 `h-[xxx]` 固定高度**（会截断超限内容）；高度控制放在 data.js 内部。
2. **禁止 `max-h-*` 配 `overflow-hidden`**（静默截断）；须配 `overflow-y-auto`（允许滚动）。
3. 表格分页策略：数据量 ≤ 5 行可 `pagination: false` 免约束；**> 5 行必须 `pagination: true`**；仅用户明确要求"全部显示"才关分页，且必须配 `max-h` + `overflow-y-auto`。
4. 间距/视觉类（`p-*`/`gap-*`/`rounded-*`/`shadow-*`）一律取自页面实读值（邻近卡片同款），禁止自行发明数值。

### 第 2 步：校验（硬门禁，未 PASS 禁止挂载）

用「技能目录定位」解析出的 `<DirMix>` 执行（绝对路径注入，不依赖工作目录），用 bash 工具按平台选解释器：Windows 直接 `powershell -ExecutionPolicy Bypass -File "<DirMix>/scripts/validate-and-sync.ps1" -InputFile <产物绝对路径>`；Linux/macOS 需已安装 PowerShell 7+，同参数改用 `pwsh -File`（无 pwsh 时向用户报告，禁止跳过校验挂载）。

FAIL（仅语法错误会 FAIL）则读错误上下文 → Edit 修复 → 重跑，直到 `RESULT: PASS` 且 lint 告警清零。**data.js 本身即最终产物**（无孪生 / 中间 `.json` 文件）。本脚本只管**渲染关切**（JSON 语法 + 项目 lint）；A2UI 结构校验由 ict-coder 生成侧兜底，二者对象不同、不可互替。

| 检查 | 级别 | 说明 |
|---|---|---|
| data.js 语法 | FAIL（exit 1） | 非 `window.__A2UI_DATA__ = {...}` wrapper 开头，或剥壳后 `ConvertFrom-Json` 解析失败 → `RESULT: FAIL` + 错误行上下文 |
| flex 方向类必配 `flex`/`inline-flex` | lint 告警 | `flex-col`/`flex-row`/`flex-wrap` 漏配 `flex` → 容器停留 block、高度塌缩 |
| `*Chart` 组件必含显式 `h-` 高度类 | lint 告警 | 缺 `h-` 则 DOM 塌 10px，ResizeObserver 只能按 0/10px 重绘 |
| Table 关分页时的槽位高度约束 | lint 告警 | `pagination` 显式为 `false`（缺省视为开启）且数据行 ≥ 6 时提醒确认槽位已设 max-h |
| `max-h-*` 配 `overflow-hidden` | lint 告警 | 静默截断，改用 `overflow-y-auto`。注：lint 只扫 data.js 元素，页面槽位 HTML 不在扫描范围，须按速查铁律 2 人工遵守 |

常见修复：`no 'flex'` → className 加 `flex`；`missing height class (h-)` → 加 `h-full`/`h-64` 等。

### 第 3 步：承载页页尾挂载

**若页面已有编排脚本**（页尾 `<script src="...previewdist/PreviewRenderer.js?v=N">` 后的内联 script）：Read 后在 `nodes` 数组追加一项：
```js
{ container: '<目标节点选择器>', dataPath: './a2ui-data/<slug>/data.js' }
// 路线 B（新增/与宿主内容共存）须再加 replace: false
```

**若页面没有编排脚本**（如新增承载页 / 刚完成本地化）：在 `</body>` 前补完整挂载块（本地化页用 `./` 前缀）：
```html
<script src="./previewdist/PreviewRenderer.js?v=1"></script>
<script>
    (function () {
        var nodes = [
            { container: '<目标节点选择器>', dataPath: './a2ui-data/<slug>/data.js' }
        ];
        var chain = Promise.resolve();
        nodes.forEach(function (cfg) {
            chain = chain.then(function () {
                return new PreviewRenderer({
                    container: cfg.container,
                    distPath: './previewdist',
                    dataPath: cfg.dataPath,
                    // 路线 A 替换：条目不写 replace → 默认 true 清空容器；
                    // 路线 B 新增/与宿主内容共存：条目须写 replace: false（保留宿主内容）
                    replace: cfg.replace !== false,
                    autoInit: false
                }).init();
            });
        });
        chain.catch(function (e) { console.error('[A2UI] node render failed:', e); });
    })();
</script>
```

- **路线 A（替换）**：`container` 填既有节点选择器。渲染器默认 `replace:true` 清空该容器内容再渲染，容器节点本身保留。容器高度策略按第 1 步速查表（容器不写死高度；图表 `h-[xxx]`、表格分页/`max-h` 均在 data.js 内控）。
- **路线 B（新增）**：先做第 4 步造槽位，再登记 nodes；nodes 条目**须带 `replace: false`**（模板已按 `cfg.replace` 透传）。向**已有内容的容器**追加共存节点时必须显式 false，否则会清空宿主原有内容。
- `dataPath` 只支持 `*.js` 一种形态（data.js 自带 wrapper，http/file:// 均 script 直载）；不再使用 `*.json`。
- 多节点必须保持 promise 链**串行**（共享 `window.__A2UI_DATA__`，并发会张冠李戴），新增节点只追加数组项，勿改串行结构。
- **挂载前自检（逐项核对）**：① 间距/视觉类取自页面实读值；② 图表组件 className 含显式 `h-`；③ 表格有分页或 `max-h` + `overflow-y-auto`；④ 容器无写死 `h-[xxx]`；⑤ 容器 CSS 与 data.js root 之间 padding/shadow/rounded/bg 四项无重复（去重表见 WORKFLOW.md Pitfall #11）。

### 第 4 步（仅路线 B）：生成新槽位节点

承载页均为**文档流布局（grid/flex），节点固定位置固定大小**，DOM 顺序即视觉顺序。新增槽位必须：

1. **先 Read 目标区域布局语境**（邻近节点的类名/列跨度/高度）。
2. **贴合邻近语境造槽位**：grid 容器内新增 → 复用邻近卡片的类名与列跨度（如同款 `bg-white rounded-2xl p-5 border shadow-sm`）；独行成行 → 与同行卡片内容高度对齐（参考第 1 步速查表），靠 grid `align-items: stretch` 自动拉齐，不写死固定高度；flex 父级 → 加 `flex-shrink-0` 防压缩塌缩；不与既有节点重叠、不压缩既有布局。
3. **内容高度预判**按第 1 步速查表执行（表格/列表按行数 × 48px 估算，约束策略遵守速查铁律 2/3）。
4. 槽位容器类名若用 `flex-col`/`flex-row`/`flex-wrap` 必带 `flex`（校验 lint 会告警）。
5. **不动任何既有节点**，只插入新槽位 + nodes 登记。

### 路线 A 区域级替换：选中区域含既有 A2UI 子节点

**判定特征**：用户指定的目标容器位于某个已登记 nodes 项的 container **外围**（选择器覆盖范围更大，区域内含一个或多个已挂载的 A2UI 渲染子节点）。典型场景：第一张卡已替换为 A2UI 柱状图，用户随后选中整个 `section.chart-container` 要求改为别的组合。

1. **整体接管**：以整个选中区域为 container 走完整管线（生成 → 校验 PASS → 挂载）。新 data.js 的 root 承担区域内**全部**布局与内容编排——区域内多卡片布局在 root 内以 grid/flex 复刻原区域结构（列跨度、gap 取自实读值）；既有 A2UI 子节点与原生子元素的数据按数据保真原则一并并入新 data.js，不凭空发明。
2. **移除被覆盖的旧 nodes 项（硬性）**：旧 container 落在新 container 内部，区域整体 replace 后旧容器 DOM 已被清空重渲染，旧选择器将失配或指向新内容——保留会导致渲染报错或重复挂载。登记新 nodes 项的同时，必须从 `nodes` 数组删除**全部**被新 container 覆盖的旧项。
3. **旧数据文件夹保留不删**：被取代的旧 `a2ui-data/<slug>/` 保留作回退依据；新节点使用体现区域语义的新 slug（如 `chart-area-mixed`），不得复用旧 slug。
4. **容器照常整备**：清空区域容器的布局类（grid/flex/gap 交由 data.js root 复刻，Pitfall #7）；CSS 样式表布局须加 `style="display:block"` 覆盖（Pitfall #8）；容器不设固定高度，行高对齐由 data.js 内 grid 的 `align-items: stretch` 处理（Pitfall #9）。
5. **回退**：删除新 nodes 项 → 恢复旧 nodes 项（旧 data.js 未删，直接可用）→ 还原区域容器的布局类与被清空的原生内容（git / 备份）。

### 回退手段

- **先留底再动手**：承载页不在 git 管辖内时（如 `.octo/ses_*/outputs/` 副本），路线 A 清空容器/区域级替换执行前，先同目录复制一份 `<页面名>.html.bak` 留底（**后缀必须是 `.html.bak` 而非 `.bak.html`**——不以 `.html` 结尾才不会污染路线 C 的 Grep `*.html` 扫描与 Glob 匹配），回退 = 用 .bak 覆盖。
- 路线 A：还原被清空内容（git / 备份）。
- 路线 B：撤回插入的槽位节点与 nodes 数组项。
- 页面原内容被编排脚本接管后，原内联图表脚本中对应的 `new ApexCharts(...)` 等初始化代码若因容器被清空而失效，回退时一并还原。

---

## 路线 C：修改模式（目标节点已渲染内容）

复用原 data.js 作为唯一事实源，**不新建文件、不新建页面节点**；patch 遵守 ict-coder 的最小变更纪律（只改用户所述，其余字节不动，杜绝重生成漂移）。

> **重要限制**：路线 C 仅适用于**已有 data.js 数据源的渲染节点**。如果目标是**原生 HTML 元素**（如原生表格 `<table>`、原生 DOM 元素、非 A2UI 渲染的内容），不能直接编辑 HTML 文件来完成修改（见首要总则）。必须先在路线 A/B 中将这些原生内容**替换为 A2UI 渲染节点**，之后对该节点的修改再走路线 C 的 data.js patch 流程。

1. **反查 dataPath**：目标节点的 `dataPath` 登记在承载页页尾编排脚本的 `nodes` 数组里，用 **Grep** 工具检索（跨平台）：
   - 页面路径已知：Grep `pattern` 填 `<节点选择器片段>`，`path` 填该页面所在目录，`include` 填 `*.html`；
   - 页面路径未知：同 pattern + `include` 填 `*.html`，在项目内全量扫描定位文件。
   命中后 **Read** 该文件命中行号 ±3 行，即得 `container`/`dataPath` 登记项。类名选择器（如 `.card`）在全项目扫描时易误报——命中行必须位于页尾编排脚本的 `nodes` 数组内（同行含 `dataPath`）才算登记项，纯 DOM 出现的 class 命中不算；若目录内存在历史 `.bak.html` 留底文件也会命中，须排除（新留底统一用 `.html.bak` 后缀，见「回退手段」）。
2. **读 data.js 理解结构**（文件内即 A2UI JSON 结构）：
   - `state`：扁平数据对象。`/xxx` 是根字段绝对路径，`xxx`（无斜杠）是列表项相对路径。
   - `rootId`：根 element 的 id，顶层容器入口。
   - `elements[]`：元素定义表，每个 element 只有 `id`/`component`/`props`/`children` 四键。
   - `children` 两种形态：① 字符串数组 = 静态子 element id 列表；② `{path, componentId}` = 列表循环绑定（表格行、指标卡常用）。
   - 定位修改点：从 `rootId` 沿 `children` 引用下行找到目标父容器。
3. **data.js patch**（只动 wrapper 内的 `state`/`elements`/`rootId`）：
   - **容器子列表新增 element**：先在 `elements[]` push 新定义（id 全文件唯一，业务前缀防冲突），再把新 id 挂到目标父容器 `children` 数组（插入位置 = 数组位置）。
   - **列表循环容器加一条数据**：`children` 为 `{path, componentId}` 时**只动 `state`**：给对应数组 push 一项（字段与行模板绑定对齐），不动 `elements`。
   - **替换/修改已有元素**：定位 element 改 `props.className`/`props.value` 等；改文案优先动 `state`（保持数据/视图分层），`props` 用 `{path:"/xxx"}` 绑定。
4. **写回 + 校验**：用 Edit 工具改 data.js，跑第 2 步校验命令，必须 PASS。Edit 前确认目标行未超 2000 字符——遇历史遗留的单行压缩 data.js，先整体重排为多行缩进（语义不变）再 patch。
5. **告知用户刷新浏览器**即生效（页内 nodes 每次加载重新取数）。

---

## 路线 D：移除节点（删除/下线）

1. **确认对象与后果**：用路线 C 第 1 步同款 Grep 反查目标节点的 nodes 登记项。若该节点当初经路线 A 替换了原生内容（原生内容已不在页面上），删除后**无法**自动还原原生内容，须先告知用户后果并确认；容器只是变回空节点，不会报错。
2. **删除 nodes 数组项**：只删目标项，其余条目与串行结构不动。
3. **槽位处理**：路线 B 自建的新槽位节点一并移除该 DOM 节点；路线 A 只清空过内容的容器**保留**（原生内容还原走 git / `.html.bak` 备份）。
4. **数据文件夹保留**：`a2ui-data/<slug>/` 一律保留作回退依据（回退 = 重新登记 nodes 项），除非用户明确要求清理。
5. **告知用户刷新浏览器**生效。

---

## 硬约束（全程有效）

1. **校验硬门禁**：校验与元信息维护一律走本技能 `scripts/validate-and-sync.ps1`——必须 `RESULT: PASS` 且 lint 告警清零才挂载（结构合法性由 ict-coder 生成侧兜底）；无 PowerShell 环境时报告用户，禁止跳过校验。
2. **渲染器唯一权威源** = 本技能 `scripts/PreviewRenderer.js`，可改；改动需同步各运行时副本并 bump 宿主页 `?v=`（跑 `-GenMeta -ProjectRoot <项目根>` 自动扇出：源 + 项目根历史副本 + 各 `<页目录>/previewdist/` 递归扫描；技能装在项目外时**必须显式传 `-ProjectRoot`**，否则项目根按位置推断会算错；项目根历史副本若 ACL 拒写仅 WARN，不阻塞）；只改 data.js/HTML 不需要 bump。项目根 `previewdist/` 为**历史集中式副本**（可能对 Users 组只读；本地化页一律用页目录副本，不引用它）。
3. **data.js 只用 Write/Edit 工具写**，禁命令行管道写文件。所有 data.js 产物必须写入 `<页目录>/a2ui-data/<slug>/data.js`（`<slug>` 为 kebab-case，按业务语义命名，**不得与既有 slug 重名**——重名覆盖旧数据）；文件内容 = `window.__A2UI_DATA__ = <JSON>;`，wrapper 内 JSON 保持多行缩进（见第 1 步）；不得写入 `output/` 或其他临时目录。
4. **`dataPath` 前缀**一律 `./a2ui-data/<slug>/data.js`（唯一存储布局为本地化，渲染器只支持 `*.js` 形态；nodes 登记一律显式传 `dataPath`，不依赖默认数据回退）。
5. **容器高度约束**：一律遵循第 1 步速查表与速查铁律——容器不写死 `h-[xxx]`，由内容自然撑开；图表组件设显式 `h-[xxx]`；表格用分页或 `max-h` + `overflow-y-auto` 控高；禁止 `max-h` 配 `overflow-hidden`。违者视为工作流执行缺陷。
6. **禁止直接编辑原生 HTML 内容**（见首要总则）：不得用 Edit 工具直接在 HTML 文件中增删改 DOM 元素、列、行、样式或文案；原生内容先经路线 A 转化为 A2UI 节点，再走路线 C patch。
7. **禁止无差别删除节点**：删除/下线一律走路线 D 且先向用户确认。
8. **区域覆盖优先**：用户选中区域包含既有 A2UI 渲染子节点时，必须对**整个选中区域**做路线 A 整体替换，并同步移除被覆盖的旧 nodes 项（见「路线 A 区域级替换」）；不得只针对内部子节点做局部修改来绕过区域级接管。
9. **会话上传承载页必须先复制副本再操作**（见「前置步骤」）；`uploads/` 原始上传文件全程只读，禁止在 uploads 内直接修改或派生产物。
10. **多节点 promise 链串行**（共享 `window.__A2UI_DATA__`，并发会张冠李戴）；新增节点只追加 nodes 数组项，勿改串行结构。
11. 免服务器 file:// 直开与 ict-coder 运行时重建后的 `-GenMeta` + 重拷 assets 流程，详见 WORKFLOW.md「免服务器 file:// 直开」。
