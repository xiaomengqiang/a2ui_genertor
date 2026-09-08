---
name: ict-html-mix
description: A2UI 节点工作流：在承载页上生成、校验、替换、新增或修改 A2UI 渲染节点，覆盖节点完整生命周期。内置工作流文档与校验脚本，调用 ict-coder 技能生成 JSON → validate-and-sync.ps1 校验 → 挂载到页面节点。用户只需提供 页面 + 节点 + 需求。Use when the user mentions 承载页/替换节点/新增节点/渲染到节点/A2UI/code_artifact, or wants to modify already-rendered A2UI content.
---

# A2UI 节点工作流（执行手册）

用户输入三要素：**页面**（承载页路径）+ **节点**（选择器或描述）+ **需求**（要渲染/改成什么）。
若缺项，先用 question 工具向用户确认，不要猜。

> **首要总则（凌驾于所有路线之上）**：凡经本 skill 的内容修改，**必须走工作流管线**——
> 调用 `ict-coder` 生成/派生对应 JSON 文件 → `validate-and-sync.ps1` 校验 PASS → 渲染器挂载生效。
> **不得直接编辑原页面的既有 DOM/内容/样式**来达成显示变化（绕过管线的手改一律禁止）。
> **即使目标是页面上已有的原生 HTML 内容（如原生表格、原生 DOM 元素、非 A2UI 渲染的内容），也不得直接编辑 HTML——必须先转化为 A2UI 渲染节点，再通过 JSON 层修改。**
> 允许触碰页面的仅限工作流自身的结构登记操作：页尾 `nodes` 数组项、路线 B 的新槽位节点插入、
> 渲染器 `script` 标签与 `?v=` bump。已渲染内容的微调走路线 C（JSON 层 patch，遵守 ict-coder
> 的最小变更纪律：只改用户所述，其余字节不动）。

> 技能文件夹：本文件 = 执行手册（操作自包含）；`WORKFLOW.md` = 参考手册（渲染器行为 /
> file:// 原理 / Pitfalls 排障 / 存储规则，按需查阅）；`scripts/` = **渲染器唯一权威源
> `PreviewRenderer.js` + 唯一校验维护脚本 `validate-and-sync.ps1`**。

---

## 前置步骤：承载页入位（会话上传文件场景，先于意图路由执行）

若用户要修改的承载页 HTML 来自**当前会话上传的文件**（位于 `.octo/ses_<会话ID>/uploads/`）：

1. **用户选定**：会话上传了多个 html 而用户未指明目标时，先列出 uploads 下的 html 供用户选择，不要猜。
2. **复制副本并重命名**：选定后**必须先将该 html 复制**到当前会话产物目录 `[artifact-folder]`（即 `.octo/ses_<会话ID>/outputs/`，取运行时注入的 `[Artifact Folder]` 实际路径，勿硬编码会话 ID），同时将文件名改为 `{原文件名}.prototype.html`：

   ```powershell
   $src = '<uploads 下选定的源 html 绝对路径>'
   $dst = Join-Path '<[artifact-folder]>' "$([System.IO.Path]::GetFileNameWithoutExtension($src)).prototype.html"
   Copy-Item -LiteralPath $src -LiteralPath $dst -Force
   ```

   > 若源文件本身已包含 `.prototype.` 后缀（如 `xxx.prototype.html`），则保持原名不变，直接复制。
3. **后续一律基于副本操作**：本地化拷贝（`previewdist/`）、`a2ui-data/` 存储、页尾 nodes 挂载等所有写操作，承载页路径均指向 outputs 下的副本；**副本所在目录即「页目录」**。`uploads/` 中的原始上传文件视为**只读源**，禁止直接修改或在其中派生产物。
4. **交付说明**：完成后向用户回报副本路径（outputs 下可直接预览的页面文件）及配套产物位置；回退时只需还原/删除副本，原始上传不受影响。

非上传来源（项目内既有页面）不经过此步骤，按原流程直接以项目路径为页目录。

---

## 第零步：意图路由（必做）

| 用户意图 | 路线 |
|---|---|
| 「在 X **上**加一个 Y」「给 X 的表格加一行」「修改 X 的 Z」 | **路线 C 修改模式**（patch 既有 JSON，不改页面结构） |
| 「替换 X 节点为 Y」「把 X 渲染成 Y」 | **路线 A 替换模式**（清空 X 内容渲染新内容，容器保留） |
| 「在 X 后新增一张独立卡」「页面加一个新模块」 | **路线 B 新增模式**（造新槽位 + 挂载） |

**硬约束：禁止无差别删除节点；禁止绕过管线直接手改原页面内容（见首要总则）。**
路线 A 只清空目标容器内容由渲染器重渲染；路线 B 不动任何既有节点。

---

## 路线 A / B：生成新内容并挂载

### 第 1 步：生成 A2UI JSON

用 **skill 工具加载 `ict-coder` 技能**并按其生成工作流产出 JSON。注意：本工作流**只借其生成能力**（其 Step 1–4 生成 + Step 5 校验），**不执行其 Step 6 打包/artifact 输出**；ict-coder 的 Step 5 已直接写入 `a2ui-data/<slug>/data.json`。

> 捷径：若用户明确要直挂 ict-coder 已打包的产物（`{slug}/data.js`，自带 wrapper），可跳过第 2 步——`dataPath` 直指该 `.js` 文件即可（渲染器原生支持，免校验孪生）。但默认路径不走打包，直接走 `a2ui-data/`。

| 存储布局 | 判定特征 | 产物路径 | 页面引用前缀 |
|---|---|---|---|
| **本地化**（现行默认，新页面 / 新接入一律采用） | 页目录内有 `previewdist/` | `<页目录>/a2ui-data/<slug>/data.json`（每节点独立文件夹，JSON 文件名统一为 `data.json`） | `./` |
| **集中式**（既有页面沿用） | nodes 引用 `../output/` | `output/<module>[-<页标识>]-output.json` | `../` |

以目标页**现有 nodes 数组的引用形态**为准选择布局；将集中式页改造为本地化时，先执行本地化拷贝并迁移既有数据，再统一改写引用。

**技能根定位**（本地化拷贝与第 2 步校验共用的前置动作）：技能**不一定装在项目根**——运行时可能位于用户技能目录（如 `C:\Users\<user>\.config\octo\skill`）。命令中的技能路径一律以 `$Skills` 变量注入，**禁止硬编码**。解析顺序：① 优先运行时注入的技能目录（加载本技能时输出的 Skill directory 绝对路径的父目录）；② 兜底项目根 `.opencode\skills\`（项目内技能布局）；③ 两者皆无 → 立即停止并向用户报告，禁止盲跑。

```powershell
# <技能目录> 换成 Skill directory 绝对路径（其父目录即技能根）；命中后 $Skills 即技能根
$Skills = if (Test-Path -LiteralPath '<技能目录>') { Split-Path -LiteralPath '<技能目录>' -Parent } elseif (Test-Path -LiteralPath '.opencode\skills\ict-html-mix') { Join-Path (Get-Location).Path '.opencode\skills' } else { $null }
if (-not $Skills) { Write-Error '技能根未定位到：运行时技能目录与项目根 .opencode\skills 均不存在' } else { $Skills }
```

**页面本地化**：运行时从 ict-coder 技能拷贝（`$Skills\ict-coder\scripts\previewdist\` → 页目录 `previewdist\`，含 `index.prototype.html` + `assets\` + `uploads\`，**不拷其 data.js**；渲染器从 `$Skills\ict-html-mix\scripts\PreviewRenderer.js` 拷入同目录），previewdist **不从项目根取**。数据用页目录 `a2ui-data/<slug>/`，页面引用全 `./` 相对路径、`?v=` 版本号**独立维护**。

本地化拷贝命令（`<页目录>` 换成实际页目录；先建目录再拷贝，任意工作目录可执行）：
```powershell
New-Item -ItemType Directory -Path '<页目录>\previewdist' -Force | Out-Null; Copy-Item "$Skills\ict-coder\scripts\previewdist\index.prototype.html","$Skills\ict-html-mix\scripts\PreviewRenderer.js" '<页目录>\previewdist\' -Force; Copy-Item "$Skills\ict-coder\scripts\previewdist\assets" '<页目录>\previewdist\assets' -Recurse -Force; Copy-Item "$Skills\ict-coder\scripts\previewdist\uploads" '<页目录>\previewdist\uploads' -Recurse -Force
```

「根据原内容」生成时，先从页面既有脚本/DOM 中提取真实数据（图表 series、文案、数值），保持数据保真，不凭空发明。跨页复用既有 JSON 派生产物时，数值字段必须与本页语境一致，不要照抄他页数值。

> **⚠️ 生成前必须读取页面上下文确定容器尺寸**：在调用 ict-coder 生成新 JSON 之前，**必须先读取承载页中目标容器及周边兄弟节点、父节点**的 HTML 片段，记录其实际高度、间距类（`gap-*`/`p-*`/`space-y-*`）、布局类（`grid`/`flex`/`grid-cols-*`）、父子关系与 DOM 顺序。容器 `h-[xxx]` 的高度值必须基于这些实际读取值计算，不得凭空估算。具体推导步骤见「陷阱 2 的高度推导步骤」。

### 第 2 步：校验（硬门禁，未 PASS 禁止挂载）

用「技能根定位」解析出的 `$Skills` 执行（绝对路径注入，不依赖工作目录）：

```powershell
powershell -ExecutionPolicy Bypass -File "$Skills\ict-html-mix\scripts\validate-and-sync.ps1" -InputFile <产物绝对路径>
```

FAIL（仅语法错误会 FAIL）则读错误上下文 → Edit 修复 → 重跑，直到 `RESULT: PASS` 且 lint 告警清零。PASS 后自动生成同名 `data.js` 孪生（file:// 直开用，勿手改）。规则详情见下方「校验规则」。

### 第 3 步：承载页页尾挂载

**若页面已有编排脚本**（页尾 `<script src="...previewdist/PreviewRenderer.js?v=N">` 后的内联 script）：Read 后在 `nodes` 数组追加一项：
```js
{ container: '<目标节点选择器>', dataPath: '<产物路径，见第 1 步存储布局表>' }
```

**若页面没有编排脚本**（如新增承载页 / 刚完成本地化）：在 `</body>` 前补完整挂载块（本地化页用 `./` 前缀）：
```html
<script src="./previewdist/PreviewRenderer.js?v=1"></script>
<script>
    (function () {
        var nodes = [
            { container: '<目标节点选择器>', dataPath: './a2ui-data/<slug>/data.json' }
        ];
        var chain = Promise.resolve();
        nodes.forEach(function (cfg) {
            chain = chain.then(function () {
                return new PreviewRenderer({
                    container: cfg.container,
                    distPath: './previewdist',
                    dataPath: cfg.dataPath,
                    autoInit: false
                }).init();
            });
        });
        chain.catch(function (e) { console.error('[A2UI] node render failed:', e); });
    })();
</script>
```

- **路线 A（替换）**：`container` 填既有节点选择器。渲染器默认 `replace:true` 清空该容器内容再渲染，容器节点本身保留——无需其他改动。
  - **⚠️ 高度陷阱提醒**：路线 A 替换时，必须同步确认容器已设 `h-[xxx]` 固定高度。若容器无固定高度，需编辑页面为容器添加 `h-[xxx]` 类（按「陷阱 2：挂载容器必须用固定高度」的精确公式计算）。这是路线 A 挂载操作的**必要组成部分**，不得省略。
- **路线 B（新增）**：先做第 4 步造槽位，再登记 nodes。
- `dataPath` 支持 `*.js`（ict-coder 打包产物可直挂）与 `*.json`（常规形态）两种形态（详见 WORKFLOW.md「渲染器行为参考」）。
- 多节点必须保持 promise 链**串行**（共享 `window.__A2UI_DATA__`，并发会张冠李戴），新增节点只追加数组项，勿改串行结构。


### 第 4 步（仅路线 B）：生成新槽位节点

承载页均为**文档流布局（grid/flex），节点固定位置固定大小**，DOM 顺序即视觉顺序。新增槽位必须：

1. **先理解目标区域布局语境**（Read 页面相关片段，看邻近节点的类名/列跨度/高度）。
2. **贴合邻近语境造槽位**：
   - grid 容器内新增 → 复用邻近卡片的类名与列跨度（如同款 `bg-white rounded-2xl p-5 border shadow-sm`）；
   - 独行成行 → 显式定高（如 kpi 网格第 5 卡 `h-[152px]` 对齐同行卡高）；
   - flex 父级 → 加 `flex-shrink-0` 防压缩塌缩；
   - 不与既有节点重叠、不压缩既有布局。
3. **内容高度预判（防占位过高）**：
   - 先评估渲染内容的预估高度：表格 ≈ 行数 × 行高（约 48px/行）+ 表头（约 45px）+ 内边距（约 40px）+ 分页条（约 45px，若启用）
   - 若预估高度超过邻近卡片高度的 1.5 倍，槽位必须加 `max-h-[xxx]` + `overflow-hidden` 约束
   - **表格/列表类内容默认策略**：
     - 数据量 ≤ 5 行：默认 `pagination: false`，无需 max-h 约束
     - 数据量 ＞ 5 行：**必须保留 `pagination: true`**（默认每页 5 行），槽位加 `max-h-[380px] overflow-hidden`
     - 仅当用户明确要求"全部显示"时才设 `pagination: false`，此时必须配 `max-h` + `overflow-y-auto`
4. **不动任何既有节点**，只插入新槽位 + nodes 登记。
5. 槽位容器类名若用 `flex-col`/`flex-row`/`flex-wrap` 必带 `flex`（校验 lint 会告警）。

### 回退手段

- 路线 A：还原被清空内容（git / 备份）。
- 路线 B：撤回插入的槽位节点与 nodes 数组项。
- 页面原内容被编排脚本接管后，原内联图表脚本中对应的 `new ApexCharts(...)` 等初始化代码若因容器被清空而失效，回退时一并还原。

---


## 路线 C：修改模式（目标节点已渲染内容）

复用原 JSON 作为唯一事实源，**不新建文件、不新建页面节点**；patch 遵守 ict-coder 的最小变更纪律（只改用户所述，其余字节不动，杜绝重生成漂移）。

> **重要限制**：路线 C 仅适用于**已有 A2UI JSON 数据源的渲染节点**。如果目标是**原生 HTML 元素**（如原生表格 `<table>`、原生 DOM 元素、非 A2UI 渲染的内容），不能直接编辑 HTML 文件来完成修改（见首要总则「不得直接编辑原页面既有 DOM」）。必须先在路线 A/B 中将这些原生内容**替换为 A2UI 渲染节点**，之后对该节点的修改再走路线 C 的 JSON patch 流程。

1. **反查 dataPath**：目标节点的 `dataPath` 登记在承载页页尾编排脚本的 `nodes` 数组里：
   ```powershell
   Select-String -Path "<页面路径>" -Pattern '<节点选择器片段>' -Context 2,2
   ```
   （页面路径未知时可通配扫描：`Select-String -Path "*\*.html" ...`）
2. **读 JSON 理解结构**：
   - `state`：扁平数据对象。`/xxx` 是根字段绝对路径，`xxx`（无斜杠）是列表项相对路径。
   - `rootId`：根 element 的 id，顶层容器入口。
   - `elements[]`：元素定义表，每个 element 只有 `id`/`component`/`props`/`children` 四键。
   - `children` 两种形态：① 字符串数组 = 静态子 element id 列表；② `{path, componentId}` = 列表循环绑定（表格行、指标卡常用）。
   - 定位修改点：从 `rootId` 沿 `children` 引用下行找到目标父容器。
3. **JSON patch**（只动 `state`/`elements`/`rootId`）：
   - **容器子列表新增 element**：先在 `elements[]` push 新定义（id 全文件唯一，业务前缀防冲突），再把新 id 挂到目标父容器 `children` 数组（插入位置 = 数组位置）。
   - **列表循环容器加一条数据**：`children` 为 `{path, componentId}` 时**只动 `state`**：给对应数组 push 一项（字段与行模板绑定对齐），不动 `elements`。
   - **替换/修改已有元素**：定位 element 改 `props.className`/`props.value` 等；改文案优先动 `state`（保持数据/视图分层），`props` 用 `{path:"/xxx"}` 绑定。
4. **写回 + 校验**：用 Edit 工具改 JSON，跑第 2 步校验命令，必须 PASS（孪生 `data.js` 随之自动同步）。
5. **告知用户刷新浏览器**即生效（页内 nodes 每次加载重新取数）。

---

## 校验规则（validate-and-sync.ps1）

**职责范围**：本脚本只管**渲染关切**——JSON 语法 + 项目 lint + 孪生生成。A2UI 结构校验（三键结构/元素键锁/id 唯一/children/path/括号）**不在本脚本内**，由 ict-coder 技能生成侧校验兜底。

| 检查 | 级别 | 说明 |
|---|---|---|
| JSON 语法 | FAIL（exit 1） | `ConvertFrom-Json` 解析失败 → `RESULT: FAIL (json syntax)` + 错误行上下文 |
| flex 方向类必配 `flex`/`inline-flex` | lint 告警 | 方向类只设 `flex-direction` 不设 `display`；漏 `flex` 则容器停留 block、高度塌缩 |
| `*Chart` 组件必含显式 `h-` 高度类 | lint 告警 | 缺 `h-` 则 DOM 塌 10px，ResizeObserver 只能按 0/10px 重绘 |
| `Table` 关闭分页时的槽位高度约束 | lint 告警 | Pagination 未开启（false/缺失默认真）且数据行 ≥ 6 时提醒：「Table 关闭分页后内容行数较多，请确认槽位已设 max-h 防止布局撑开」 |

lint 告警必须清零后才挂载。常见修复：`no 'flex'` → className 加 `flex`；`missing height class (h-)` → 加 `h-full`/`h-64` 等。

---

## 路线 A 布局冲突与容器高度陷阱

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

## 硬约束（全程有效）

1. `previewdist/`（项目根）对 Users 组只读，**勿改**；校验与元信息维护一律走本技能 `scripts/validate-and-sync.ps1`——校验必须 `RESULT: PASS` 且 lint 告警清零才挂载（结构合法性由 ict-coder 生成侧兜底）。
2. 渲染器唯一权威源 = 本技能 `scripts/PreviewRenderer.js`，可改；改动需同步各运行时副本并 bump 宿主页 `?v=`（跑 `-GenMeta` 自动扇出：源 + 项目根 previewdist + 各 `<页目录>/previewdist/`）；只改 JSON/HTML 不需要 bump。
3. JSON 只用 **Write/Edit 工具**写，禁命令行管道写文件。所有 JSON 产物必须写入 `<页目录>/a2ui-data/<slug>/data.json`（其中 `<slug>` 为 kebab-case 命名，按业务语义区分不同修改点），不得写入 `output/` 或其他临时目录。
4. `dataPath` 前缀：本地化页用 `./a2ui-data/<slug>/data.json`；集中式页用 `../output/<name>.json`——以页面现有 nodes 引用形态为准（见第 1 步存储布局表）。
5. 渲染器 `container` 必填；`data` 可替代 `dataPath` 传内联对象；都不传用 `previewdist/data.js` 默认数据。
6. 免服务器 file:// 直开与 ict-coder 运行时重建后的 `-GenMeta` + 重拷 assets 流程，详见 WORKFLOW.md「免服务器 file:// 直开」。
7. 会话上传的承载页 html **必须先复制到 `[artifact-folder]` 副本再操作**（见「前置步骤：承载页入位」）；`uploads/` 原始上传文件全程只读，禁止在 uploads 内直接修改或派生产物。
8. **容器高度硬约束**：每次路线 A/B 挂载新内容到容器时，必须严格遵循「陷阱 2」的固定高度规范与自检清单（见「容器高度自检清单」）。容器 `h-[xxx]` 的设置是挂载操作的**必要组成部分**，在生成 A2UI JSON 时同步完成高度计算并写入容器类名，不得遗漏或事后补救。任何因容器缺少固定高度导致内容溢出的问题，视为工作流执行缺陷。
9. **禁止直接编辑原生 HTML 内容**：即使目标节点是原生 HTML 元素（如原生 `<table>`、`<div>`、`<span>` 等非 A2UI 渲染的内容），也**不得用 Edit 工具直接在 HTML 文件中增删改 DOM 元素、列、行、样式或文案**来满足用户需求。必须先用路线 A 将原生区域替换为 A2UI 渲染容器，再用ict-coder 生成或路线 C patch 完成内容修改。违反此条视为绕过管线操作，与首要总则冲突。