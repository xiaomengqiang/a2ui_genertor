---
name: ict-html-mix
description: A2UI 节点工作流：在承载页上生成、校验、替换、新增或修改 A2UI 渲染节点，覆盖节点完整生命周期。内置工作流文档与校验脚本，调用 ict-coder 技能生成 JSON → validate-and-sync.ps1 校验 → 挂载到页面节点。用户只需提供 页面 + 节点 + 需求。Use when the user mentions 承载页/替换节点/新增节点/渲染到节点/A2UI/code_artifact, or wants to modify already-rendered A2UI content.
---

# A2UI 节点工作流（执行手册）

用户输入三要素：**页面**（承载页路径）+ **节点**（选择器或描述）+ **需求**（要渲染/改成什么）。
若缺项，先用 question 工具向用户确认，不要猜。

> **首要总则（凌驾于所有路线之上）**：凡经本 skill 的内容修改，**必须走工作流管线**——
> 调用 `ict-coder` 生成/派生对应 JSON 文件 → `validate-and-sync.ps1` 校验 PASS → 渲染器挂载生效。
> **一般不得直接编辑原页面的既有 DOM/内容/样式**来达成显示变化（绕过管线的手改一律禁止）。
> 允许触碰页面的仅限工作流自身的结构登记操作：页尾 `nodes` 数组项、路线 B 的新槽位节点插入、
> 渲染器 `script` 标签与 `?v=` bump。已渲染内容的微调走路线 C（JSON 层 patch，遵守 ict-coder
> 的最小变更纪律：只改用户所述，其余字节不动）。

> 技能文件夹：本文件 = 执行手册（操作自包含）；`WORKFLOW.md` = 参考手册（渲染器行为 /
> file:// 原理 / Pitfalls 排障 / 存储规则，按需查阅）；`scripts/` = **渲染器唯一权威源
> `PreviewRenderer.js` + 唯一校验维护脚本 `validate-and-sync.ps1`**。

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

用 **skill 工具加载 `ict-coder` 技能**并按其生成工作流产出 JSON。注意：本工作流**只借其生成能力**（其 Step 1–4 生成 + Step 5 校验），**不执行其 Step 6 打包/artifact 输出**；产物按下方表格命名并常驻（勿用其 `a2ui-output-{timestamp}` 时间戳名、勿 `--cleanup`）。用 **Write 工具**（禁 bash echo/Out-File/heredoc，命令行 ~32KB 限长会炸）写入。

> 捷径：若用户明确要直挂 ict-coder 已打包的产物（`{slug}/data.js`，自带 wrapper），可跳过第 2 步——`dataPath` 直指该 `.js` 文件即可（渲染器原生支持，免校验孪生）。

| 存储布局 | 判定特征 | 产物路径 | 页面引用前缀 |
|---|---|---|---|
| **本地化**（现行默认，新页面 / 新接入一律采用） | 页目录内有 `previewdist/` | `<页目录>/a2ui-data/<slug>/<slug>.json`（每节点独立文件夹） | `./` |
| **集中式**（既有页面沿用） | nodes 引用 `../output/` | `output/<module>[-<页标识>]-output.json` | `../` |

以目标页**现有 nodes 数组的引用形态**为准选择布局；将集中式页改造为本地化时，先执行本地化拷贝并迁移既有数据，再统一改写引用。

**页面本地化**：运行时从 ict-coder 技能拷贝（`.opencode/skills/ict-coder/scripts/previewdist/` → 页目录 `previewdist/`，含 `index.prototype.html` + `assets/` + `uploads/`，**不拷其 data.js**；渲染器从本技能 `scripts/PreviewRenderer.js` 拷入同目录），previewdist **不从项目根取**。数据用页目录 `a2ui-data/<slug>/`，页面引用全 `./` 相对路径、`?v=` 版本号**独立维护**。

本地化拷贝命令（在项目根执行，`<页目录>` 换成实际页目录）：
```powershell
Copy-Item '.opencode\skills\ict-coder\scripts\previewdist\index.prototype.html','.opencode\skills\ict-html-mix\scripts\PreviewRenderer.js' '<页目录>\previewdist\'; Copy-Item '.opencode\skills\ict-coder\scripts\previewdist\assets','<页目录>\previewdist\assets' -Recurse -Force; Copy-Item '.opencode\skills\ict-coder\scripts\previewdist\uploads','<页目录>\previewdist\uploads' -Recurse -Force
```

「根据原内容」生成时，先从页面既有脚本/DOM 中提取真实数据（图表 series、文案、数值），保持数据保真，不凭空发明。跨页复用既有 JSON 派生产物时，数值字段必须与本页语境一致，不要照抄他页数值。

### 第 2 步：校验（硬门禁，未 PASS 禁止挂载）

在项目根目录执行：

```
powershell -ExecutionPolicy Bypass -File .\.opencode\skills\ict-html-mix\scripts\validate-and-sync.ps1 -InputFile <产物路径>
```

FAIL（仅语法错误会 FAIL）则读错误上下文 → Edit 修复 → 重跑，直到 `RESULT: PASS` 且 lint 告警清零。PASS 后自动生成同名 `.data.js` 孪生（file:// 直开用，勿手改）。规则详情见下方「校验规则」。

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
            { container: '<目标节点选择器>', dataPath: './a2ui-data/<slug>/<slug>.json' }
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
3. **不动任何既有节点**，只插入新槽位 + nodes 登记。
4. 槽位容器类名若用 `flex-col`/`flex-row`/`flex-wrap` 必带 `flex`（校验 lint 会告警）。

### 回退手段

- 路线 A：还原被清空内容（git / 备份）。
- 路线 B：撤回插入的槽位节点与 nodes 数组项。
- 页面原内容被编排脚本接管后，原内联图表脚本中对应的 `new ApexCharts(...)` 等初始化代码若因容器被清空而失效，回退时一并还原。

---


## 路线 C：修改模式（目标节点已渲染内容）

复用原 JSON 作为唯一事实源，**不新建文件、不新建页面节点**；patch 遵守 ict-coder 的最小变更纪律（只改用户所述，其余字节不动，杜绝重生成漂移）。

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
4. **写回 + 校验**：用 Edit 工具改 JSON，跑第 2 步校验命令，必须 PASS（孪生 .data.js 随之自动同步）。
5. **告知用户刷新浏览器**即生效（页内 nodes 每次加载重新取数）。

---

## 校验规则（validate-and-sync.ps1）

**职责范围**：本脚本只管**渲染关切**——JSON 语法 + 项目 lint + 孪生生成。A2UI 结构校验（三键结构/元素键锁/id 唯一/children/path/括号）**不在本脚本内**，由 ict-coder 技能生成侧校验兜底。

| 检查 | 级别 | 说明 |
|---|---|---|
| JSON 语法 | FAIL（exit 1） | `ConvertFrom-Json` 解析失败 → `RESULT: FAIL (json syntax)` + 错误行上下文 |
| flex 方向类必配 `flex`/`inline-flex` | lint 告警 | 方向类只设 `flex-direction` 不设 `display`；漏 `flex` 则容器停留 block、高度塌缩 |
| `*Chart` 组件必含显式 `h-` 高度类 | lint 告警 | 缺 `h-` 则 DOM 塌 10px，ResizeObserver 只能按 0/10px 重绘 |

lint 告警必须清零后才挂载。常见修复：`no 'flex'` → className 加 `flex`；`missing height class (h-)` → 加 `h-full`/`h-64` 等。

---

## 硬约束（全程有效）

1. `previewdist/`（项目根）对 Users 组只读，**勿改**；校验与元信息维护一律走本技能 `scripts/validate-and-sync.ps1`——校验必须 `RESULT: PASS` 且 lint 告警清零才挂载（结构合法性由 ict-coder 生成侧兜底）。
2. 渲染器唯一权威源 = 本技能 `scripts/PreviewRenderer.js`，可改；改动需同步各运行时副本并 bump 宿主页 `?v=`（跑 `-GenMeta` 自动扇出：源 + 项目根 previewdist + 各 `<页目录>/previewdist/`）；只改 JSON/HTML 不需要 bump。
3. JSON 只用 **Write/Edit 工具**写，禁命令行管道写文件。
4. `dataPath` 前缀：本地化页用 `./a2ui-data/<slug>/<slug>.json`；集中式页用 `../output/<name>.json`——以页面现有 nodes 引用形态为准（见第 1 步存储布局表）。
5. 渲染器 `container` 必填；`data` 可替代 `dataPath` 传内联对象；都不传用 `previewdist/data.js` 默认数据。
6. 免服务器 file:// 直开与 ict-coder 运行时重建后的 `-GenMeta` + 重拷 assets 流程，详见 WORKFLOW.md「免服务器 file:// 直开」。