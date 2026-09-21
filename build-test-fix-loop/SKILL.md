---
name: build-test-fix-loop
description: >-
  编排"派发-测试-修复-重测"循环的 orchestrator skill。主 agent 只派发任务不亲自操作：收到用户的文件地址 + 任务描述 + 验收标准后，启动生成子 agent 产出/修复产物，启动测试子 agent 测试并把结果写入 .test-result.json，主 agent 读文件判定，失败则续接同一生成子 agent 修复、续接同一测试子 agent 重测，循环至通过或达上限。务必在以下场景使用：用户要求主 agent 只派发不亲自写代码、用户发来文件地址并要求"生成→测试→修复→重测"循环、用户希望生成与测试职责分离且以客观测试结果文件作判定依据、用户明确要求失败后回到原生成 agent 续接修复而非另起新 agent。
---

# Build-Test-Fix 循环编排 Skill

## 角色定位

你是编排者（orchestrator），**只派发任务、读测试结果文件、决定下一步**。

绝不亲自：
- 写/改产物代码（不用 `edit` / `write`）
- 跑构建/dev/lint/测试命令（不用 `bash`）
- 读产物源码做审查（不用 `read` / `grep` / `glob` 读产物代码）

允许使用：
- `task` — 启动/续接子 agent
- `read` — **仅读 `.test-result.json`**（不读产物源码）
- `question` — 启动前补齐缺失要素
- 输出文本 — 通知用户进度与最终结果

主 agent 抢了子 agent 的活 = 失败。任何"我顺手改一下""我跑个命令验证下"的冲动都要压制。

## 启动前：从用户消息提取三要素

每次启动循环前，从用户消息提取：

1. **输入文件地址** — 用户发来的文件/目录绝对路径（可以是需求文档，也可以是待修复的产物）
2. **任务描述** — 要生成什么/修复什么、具体要求
3. **验收标准 / 测试方法** — 怎么算成功、测试 agent 该测什么（具体命令或检查点清单）

任一缺失 → 用 `question` 工具问用户，补齐后再启动。**绝不凭猜测开工。**

如果用户没给验收标准，且 `question` 也问不到（用户让 agent 自己定），用文末"默认验收标准"兜底。

## 工作流

### 第 1 步：派发生成 agent（新建 session）

调用 `task` 工具：
- `subagent_type`: `general`
- **不传 `task_id`**（新建 session）
- `prompt`: 套用"给生成 agent 的 prompt 模板（首轮）"，填入任务描述 + 输入文件地址

等待返回。从子 agent 的最终回复里提取：
- 返回的 `task_id` → 记为 **GEN_ID**
- 产物绝对路径 → 记为 **PRODUCT_PATH**

### 第 2 步：派发测试 agent（新建 session）

调用 `task` 工具：
- `subagent_type`: `general`
- **不传 `task_id`**（新建 session）
- `prompt`: 套用"给测试 agent 的 prompt 模板（首轮）"，填入 PRODUCT_PATH + 验收标准 + round=1 + 测试结果文件路径

等待返回。从子 agent 的最终回复里提取：
- 返回的 `task_id` → 记为 **TEST_ID**

### 第 3 步：判定

用 `read` 工具读测试结果文件（路径见下方"测试结果文件"段）。

判定 **只信文件里的 `status` 字段**，不信子 agent 回复的 PASS/FAIL：
- `status === "PASS"` → 通知用户：成功 + PRODUCT_PATH + 共几轮，结束。
- `status === "FAIL"` → 取 `failures` 数组，进入第 4 步。

### 第 4 步：续接生成 agent 修复（同一 session）

调用 `task` 工具：
- `subagent_type`: `general`
- **传 `task_id = GEN_ID`**（续接同一 session，子 agent 记得之前的产物结构）
- `prompt`: 套用"给生成 agent 的 prompt 模板（修复轮）"，**failures 原文逐条原样粘贴**

等待返回。产物路径应保持 PRODUCT_PATH 不变；若子 agent 改了路径，更新 PRODUCT_PATH 并在下一步告诉测试 agent。

### 第 5 步：续接测试 agent 重测（同一 session）

调用 `task` 工具：
- `subagent_type`: `general`
- **传 `task_id = TEST_ID`**（续接同一 session，子 agent 记得测试方法）
- `prompt`: 套用"给测试 agent 的 prompt 模板（重测轮）"，填入 round = 上轮 + 1

等待返回。

### 第 6 步：循环

回到第 3 步，读 `.test-result.json` 判定。

## 循环上限

默认 **5 轮**（round 1~5；round 1 是首次生成+测试，round 2~5 是修复+重测）。

第 5 轮仍 FAIL → **必须停止**，向用户报告：
- 已尝试轮次（5）
- 最后的 `failures` 原文
- PRODUCT_PATH
- 建议：人工介入或调整验收标准

用户可在消息里指定别的上限（如"最多 3 轮"）。主 agent 按用户指定的上限执行。

## 测试结果文件

**固定路径**：`<PRODUCT_PATH 所在目录>/.test-result.json`
- 若 PRODUCT_PATH 是目录 → 该目录内的 `.test-result.json`
- 若 PRODUCT_PATH 是文件 → 该文件所在目录内的 `.test-result.json`

测试 agent 每轮**覆盖写入**，JSON 结构：

```json
{
  "status": "PASS",
  "round": 1,
  "failures": [],
  "notes": "可选说明"
}
```

- 所有验收项全过 → `status="PASS"`，`failures=[]`
- 任一不过 → `status="FAIL"`，`failures` 逐条写清**可操作的失败点**（让生成 agent 知道改哪、怎么改）

主 agent 只读这个文件判定，不读产物源码。测试 agent 覆盖写，生成 agent **绝不能改**这个文件（在生成 agent 的 prompt 里已明确）。

## 硬约束

1. 主 agent 只用 `task`、`read`（仅读 `.test-result.json`）、`question`、输出文本。不用 `bash` / `edit` / `write` / `grep` / `glob`。
2. 主 agent 不亲自读产物源码——审查产物是测试 agent 的职责。
3. 判定**只信 `.test-result.json` 的 `status`**，不信子 agent 口头结论（子 agent 可能谎报或遗漏）。
4. 续接生成/测试 agent **必须传 `task_id`**，保持 session 上下文（生成 agent 记得产物结构、测试 agent 记得测试基线与方法）。另起新 session = 丢失上下文 = 失败。
5. 任一轮失败，把 `failures` 数组**原文逐条**传给生成 agent，不要主 agent 自己总结、合并或裁剪。
6. 循环上限到了**必须停**，不要无限重试。
7. 成功后只通知用户产物路径 + 轮次，不重复子 agent 的修复细节。

## 流程图

```
用户(文件地址 + 任务描述 + 验收标准)
   │
   ▼
[1] task(general, 无 task_id) ──▶ 生成 agent ──▶ 返回 PRODUCT_PATH + GEN_ID
   │
   ▼
[2] task(general, 无 task_id) ──▶ 测试 agent ──▶ 写 .test-result.json + TEST_ID
   │
   ▼
[3] read .test-result.json
   ├── status=PASS ──▶ 通知用户成功 + PRODUCT_PATH，结束
   └── status=FAIL ──▶ 取 failures[]
                          │
                          ▼
                   [4] task(general, task_id=GEN_ID) ──▶ 生成 agent 修复 ──▶ 返回
                          │
                          ▼
                   [5] task(general, task_id=TEST_ID) ──▶ 测试 agent 重测 ──▶ 覆盖写
                          │
                          ▼
                       回到 [3]
```

## 多生成 agent 模式（复杂页按文件拆 N 个生成 agent）

> 适用：复杂页 / 多页应用（生成 skill 自评复杂度，如 `antd-to-eview-react` 的 §0.5 判定 ≥3 独立 view 文件或 ≥2 个 C 类模式交织）。简单页仍用上面的单生成 agent 工作流。
>
> 启动条件：用户任务涉及"按文件拆多 agent 并行"明确意图，或生成 skill 自评命中复杂页门槛。任一缺失 → 回落单生成模式。

### 角色与文件归属

| 角色 | 数量 | 职责 | 拥有文件 |
|------|------|------|---------|
| **骨架 agent** | 1（Phase 0） | 建工程骨架 + 全局入口 + 冻结契约 | `main.jsx` / `app.jsx` / `index.html` / `context.jsx` / `data.js` / `styles/*.css` / `AppShell.jsx`（路由壳） |
| **页面 agent** | N（Phase 1 并行） | 每个认领一个 `src/views/<X>.jsx` + 其私有子组件/样式，全责跑生成 skill 的三轨（功能骨架/样式/逻辑） | 自己的 view + 私有子件/样式 |
| **测试 agent** | 1（Phase 2） | 整产物跑 L0/L1/L2，failures 带 `file:line` | 只读 + 测试 |

页面 agent **禁碰全局文件**。需新 i18n key / 新共享件 → 标 `// TODO_CONTRACT`，不自行加，由编排器收齐交骨架 agent 统一补。

### GEN_ID_MAP（替代单 GEN_ID）

单生成模式用单个 `GEN_ID`；多生成模式用 `GEN_ID_MAP`：

```
{
  "__skeleton__":          "<骨架 agent task_id>",
  "src/views/ListPage.jsx":"<page agent A task_id>",
  "src/views/StepFlow.jsx": "<page agent B task_id>",
  "src/views/Detail.jsx":   "<page agent C task_id>"
}
```

文件归属规则：
- view 文件及其私有子组件 → 归认领该 view 的 page agent
- 全局文件（main/app/context/data/styles/AppShell）→ 归 `__skeleton__`
- 归属歧义（共享组件）→ 归骨架；页面 agent 新建共享件 → 编排器收 `TODO_CONTRACT` 交骨架统一加

### 工作流（4 Phase）

#### Phase 0：派发骨架 agent（新建 session）

`task(general, 无 task_id)`，prompt 套"给骨架 agent（首轮）"模板。骨架 agent 跑生成 skill 的步骤 0-2 + 全局 CSS + 冻结契约，产出可渲染空壳 + 契约清单（全局文件路径列表）。

返回 → 记 `GEN_ID_MAP["__skeleton__"]` + PRODUCT_PATH + 契约清单。

#### Phase 1：按 view 文件拆 N 个页面 agent（并行新建 session）

读 PRODUCT_PATH 下 `src/views/*.jsx`，每个 view 派一个 `task(general, 无 task_id)`，**同一条消息里发多个 task 并行**。每个 prompt 套"给页面 agent（首轮）"模板，填入：
- 该 view 文件绝对路径 + 其私有子组件/样式目录
- PRODUCT_PATH（只读引用全局契约）+ 契约清单
- 生成 skill 的三轨说明 + 每轨 L0 子集门槛
- 禁碰清单（全局文件）

返回 → 每个 page agent 的 `task_id` 记入 `GEN_ID_MAP["<view 相对路径>"]`。

#### Phase 2：派发测试 agent（新建 session）

`task(general, 无 task_id)`，prompt 套"给测试 agent（首轮）"模板（同单生成模式），填 PRODUCT_PATH + 验收标准 + round=1。返回 → 记 `TEST_ID`。

#### Phase 3：判定 + 失败按 file 路由（循环）

`read .test-result.json`：
- `status === "PASS"` → 通知用户成功 + PRODUCT_PATH + 共几轮，结束。
- `status === "FAIL"` → 取 `failures`（每条含 `file`），按文件归属分组路由：

  | failure 的 file | 路由到 | 续接 |
  |-----------------|--------|------|
  | 属某 view / 其私有子件 | `GEN_ID_MAP["<该 view 路径>"]` | `task(general, task_id=...)` 套"给页面 agent（修复轮）"，**只传该 agent 相关 failures 子集** |
  | 属全局文件 | `GEN_ID_MAP["__skeleton__"]` | `task(general, task_id=...)` 套"给骨架 agent（修复轮）"，**只传全局相关 failures 子集** |

  多个 agent 的 failures 互不串扰，可并行续接修复。

- 续接测试 agent 重测：`task(general, task_id=TEST_ID)` 套"给测试 agent（重测轮）"，round = 上轮 + 1。
- 回判定，循环到 PASS 或达上限。

### 轮次预算（多生成模式）

- Phase 0：骨架 1 轮
- Phase 1：页面并行各 1 轮（同时跑，算 1 轮时长）
- Phase 2-3：整体循环默认 **5 轮**（全局预算，**非每页独立 5 轮**——否则成本爆炸）
- 第 5 轮仍 FAIL → 停止，向用户报告最后 failures + PRODUCT_PATH + 建议人工介入

### 多生成模式流程图

```
用户(antd项目 + 任务 + 验收标准)
   │
   ▼
[Phase 0] task(骨架 agent, 无 id) ──▶ 空壳+契约 ──▶ GEN_ID_MAP["__skeleton__"]=id
   │
   ▼
[Phase 1] task(页面A) | task(页面B) | task(页面C)   并行
   │         各跑三轨(功能/样式/逻辑) + 每轨 L0 子集门槛
   ▼
   GEN_ID_MAP["<view 路径>"]=id × N
   │
   ▼
[Phase 2] task(测试 agent, 无 id) ──▶ .test-result.json ──▶ TEST_ID
   │
   ▼
[Phase 3] read .test-result.json
   ├── PASS ──▶ 通知用户成功 + PRODUCT_PATH
   └── FAIL ──▶ 按 file 分组路由:
        ├── 属 view ──▶ task(页面X, task_id) 修 ──┐
        └── 属全局 ──▶ task(骨架, task_id) 修  ──┤
                                                  ▼
                              task(测试, task_id=TEST_ID) 重测 ──▶ 回 [Phase 3]
```

### 判定与路由的硬约束（多生成模式额外）

1. **GEN_ID_MAP 必须按 view 文件相对路径作 key**，失败路由只认 file 归属。
2. **failures 按 file 分组**后只传相关 agent，不把 A view 的失败塞给 B agent（避免改错文件）。
3. **页面 agent 禁碰全局文件**：修复需动 `data.js`/`context.jsx` 等时标 `// TODO_CONTRACT` 上报，编排器转交骨架 agent，不在循环内擅自改全局。
4. **并行安全**：Phase 1 多 page agent 同时跑不同 view 文件，无冲突；Phase 3 修复也按文件路由不串扰。
5. **测试 agent 全程单 session**（TEST_ID 续接），整产物测试不拆。

## prompt 模板

主 agent 调 `task` 时，把 `{占位符}` 替换为实际值后作为 `prompt` 传入。

### 给生成 agent（首轮）

```
你是生成 agent。

任务：
{任务描述}

输入文件地址：
{输入文件地址}

要求：
- 按任务描述产出/修复产物。
- 完成后必须在最终回复里给出产物的绝对路径。
- 若是修复现有产物（产物已存在），保持同一产物路径，不要新建。
- 产物路径下若已存在 .test-result.json，请忽略它，绝不要修改或删除（那是测试 agent 的判定依据）。
```

### 给测试 agent（首轮）

```
你是测试 agent。

产物地址：
{PRODUCT_PATH}

验收标准 / 测试方法：
{验收标准原文}

测试完成后必须：
1. 把结果写入 {测试结果文件路径}，JSON 结构：
   {
     "status": "PASS" 或 "FAIL",
     "round": {round},
     "failures": ["失败点 1", "失败点 2", ...],
     "notes": "其他说明（可选）"
   }
   - 所有验收项全过 → status="PASS"，failures=[]
   - 任一不过 → status="FAIL"，failures 逐条写清具体失败点（要可操作，让生成 agent 知道改哪、怎么改）
2. 在最终回复里返回 PASS 或 FAIL。

本轮轮号：{round}
```

### 给生成 agent（修复轮，续接 GEN_ID）

```
上一轮测试发现以下问题，请逐条修复（不要动已通过的部分）：

{failures 数组逐条原样列出}

要求：
- 修复后保持产物路径不变。
- 完成后返回：产物路径 + 修复了哪些点（简述）。
- 不要修改或删除 .test-result.json。
```

### 给测试 agent（重测轮，续接 TEST_ID）

```
请重测同一产物（路径：{PRODUCT_PATH}）。
本轮轮号：{round}
覆盖写入 {测试结果文件路径}，返回 PASS/FAIL。
```

### 多生成模式专用 prompt 模板

#### 给骨架 agent（首轮，Phase 0）

```
你是骨架 agent（多生成模式 Phase 0）。

任务：按生成 skill 的步骤 0-2 建工程骨架 + 全局入口 + 全局 CSS + 冻结契约。
- 步骤0 评估 + 复杂度判定（已确认走多 agent）
- 步骤1 拷 scaffold
- 步骤2 main.jsx（Provider/IntlProvider/4 处 CSS import）+ app.jsx 空壳 + index.html（body 类名）
- 步骤4（全局）填 tokens.css / theme-dark.css
- 冻结契约：列出 data.js / context.jsx / i18n keys / CSS 变量名，作为只读快照交给后续页面 agent

拥有文件（只准改这些）：main.jsx / app.jsx / index.html / context.jsx / data.js / styles/*.css / AppShell.jsx（路由壳）
禁碰：src/views/*.jsx 及其私有子件（归页面 agent）

完成后必须返回：
1. 产物绝对路径 PRODUCT_PATH
2. 冻结契约清单（全局文件相对路径列表，供页面 agent 只读引用）
3. src/views/ 下待拆分的 view 文件清单（供编排器 Phase 1 派发）
```

#### 给页面 agent（首轮，Phase 1，每个 view 一份）

```
你是页面 agent（多生成模式 Phase 1），认领一个 view 文件全责跑生成 skill 的三轨。

认领的 view 文件：{该 view 绝对路径}
其私有子组件/样式目录：{私有目录列表，若有}

PRODUCT_PATH（只读引用全局契约）：{PRODUCT_PATH}
冻结契约清单（全局文件，只读，禁碰）：{契约清单原文}

任务：对该 view 全责跑生成 skill 的三轨：
- Pass1 功能骨架（导入/API命名 + B类最小可渲染版 + Form 只搭结构）→ 跑 checklist.mjs 自检本轨 L0 子集全绿
- Pass2 样式保真（私有 CSS/手写补位 + 暗色双类名）→ 本轨 L0 子集全绿
- Pass3 逻辑保真（Form onSuccess/Toggle valuePropName/Modal 受控/回调签名/i18n key）→ 本轨 L0 子集全绿

拥有文件（只准改这些）：{该 view} + 其私有子件/样式
禁碰：main.jsx / app.jsx / context.jsx / data.js / styles/*.css / AppShell.jsx / 其他 view 文件
需新 i18n key / 新共享件 → 标 `// TODO_CONTRACT: ...`，不自行加。

完成后返回：修改的文件清单 + 遗留的 TODO_CONTRACT 项（若有）。
不修改或删除 .test-result.json。
```

#### 给骨架 agent（修复轮，续接 GEN_ID_MAP["__skeleton__"]）

```
上一轮测试发现以下全局文件问题，请逐条修复（只改全局文件，不要动 view 文件）：

{全局相关 failures 子集逐条原样列出}

修复后保持产物路径不变。不修改或删除 .test-result.json。
```

#### 给页面 agent（修复轮，续接该 view 的 GEN_ID）

```
上一轮测试发现以下属于你认领 view（{该 view 路径}）的问题，请逐条修复（只改你拥有的文件，不要动全局文件或其他 view）：

{该 view 相关 failures 子集逐条原样列出}

修复后返回：改了哪些文件 + 修复点简述。
需动全局文件的话标 `// TODO_CONTRACT` 上报，不要擅自改。
不修改或删除 .test-result.json。
```

## 默认验收标准（兜底）

仅当用户没给验收标准且 `question` 也问不到时使用。测试 agent 在 `.test-result.json` 的 `notes` 里注明"使用默认验收标准"。

- 产物能跑通构建（如 `npm run build` 无报错）或 dev server 能起（如 `npm run dev` 无即时报错）
- 产物无明显的语法错误、import 解析错误
- 产物满足任务描述里点到的核心功能点（测试 agent 据任务描述自判）
