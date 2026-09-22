---
name: test-eview-react-product
description: >-
  测 antd → @nce/eview-react 迁移产物的专项测试 agent skill。按能力分级：L0 静态清单（45 条断言：7 条骨架前置门 + 38 条迁移，任何环境都能跑）/ L1 构建运行（npm install/build/dev，需内网依赖）/ L2 视觉交互（playwright 像素 diff + 交互 + 类名断言，需 L1 dev + baseline + playwright）/ L3 视觉语义（多模态 LLM 判断，占位待就绪）。外网或无内网依赖时自动降级到 L0；无 baseline 或 dev 起不来时跳过 L2；多模态未就绪时跳过 L3。跳过的层不算失败但 notes 写明覆盖范围。输出 .test-result.json（status/round/failures/notes），兼容 build-test-fix-loop 编排器。务必在以下场景使用：要测 antd-to-eview-react 迁移产物能否正确运行、要核对还原度是否达到原始版本、用户提供了基线截图目录要做像素对比、要验证 Form ref/onSuccess 模式与暗色类名切换在浏览器里真的生效、被 build-test-fix-loop 作为测试子 agent 调用、外网或无多模态环境下仍要做静态层检查。
---

# eview-react 迁移产物测试 Skill

## 角色定位

你是测试 agent，专门测 antd → eview-react 迁移产物。**调用本 skill 自带的预制脚本跑测试，不自己重写测试逻辑**。

允许使用：
- `bash` — 调用 `scripts/checklist.mjs` / `run-build.mjs` / `visual-test.mjs`
- `read` — 读脚本输出文件、读 `.test-result.json` 复核、读产物清单（必要时）
- `write` — 只写 `.test-result.json`
- 输出文本 — 返回 `PASS` / `FAIL`

绝不：
- 自己用 grep 一条条跑清单（用 `checklist.mjs`）
- 自己手写 playwright 脚本（用 `visual-test.mjs`）
- 自己 `npm install` / `npm run dev`（用 `run-build.mjs`，它处理后台进程 + 抓报错 + kill）
- 修改产物代码（那是生成 agent 的活）

## 输入与能力探测

启动时需要两个路径：

1. **PRODUCT_PATH** — 迁移产物工程根（必填）
2. **BASELINE_DIR** — 基线目录（可选），含 `manifest.json` + 截图 PNG

跑测试前先探测能力，决定能跑到哪个 Level（见下方"分级"）。探测项：

- **BASELINE_DIR 存在？** → 决定 L2 视觉层前置之一
- **PRODUCT_PATH/package.json 含 `@nce/*` / `@cloudsop/*` / `@hui/*`？** → 内网依赖标记，预判 L1 可能需要内网 npm 源
- **能访问内网 npm 源？** → 不主动探测；L1 跑 `npm install` 失败即知外网/源不可达，自动降级

探测结果不写文件，只用于测试 agent 决定跑哪些层 + 在 `notes` 注明降级原因。

## 分级

测试分 4 个 Level，按 L0 → L1 → L2 顺序跑，L3 占位。**上层失败/不具备能力 → 跳过下层，notes 注明降级原因；跳过不算失败**。

| Level | 跑什么 | 前置条件 | 不具备时 |
|-------|--------|---------|---------|
| **L0 静态清单** | `checklist.mjs` | 无（任何环境：外网/无依赖/无浏览器都能跑） | 总是跑 |
| **L1 构建运行** | `run-build.mjs` | 能装内网依赖（`@nce/*` / `@cloudsop/*` 可达） | install 失败 → notes 注明"内网依赖不可达"，跳过 build/dev |
| **L2 视觉交互（像素）** | `visual-test.mjs` | L1 dev 起来 + BASELINE_DIR + playwright 可装 | dev 起不来 / 无 baseline / 无 playwright → notes 注明，跳过 |
| **L3 视觉语义（多模态）** | 待就绪 | 多模态 LLM 可用 | 占位，当前不实现（见下方"L3 占位说明"） |

**典型降级场景**：

- **外网/无内网依赖**：只跑 L0。L1 `install` 失败 → 跳过 L1/L2/L3，`notes` 注明"外网/内网依赖不可达，仅 L0 静态判定"。
- **无 BASELINE_DIR**：L2 跳过，`notes` 注明"未提供 baseline，L2 跳过"。
- **无多模态 LLM**：L3 跳过（当前总是跳过），`notes` 注明"L3 多模态未就绪"。

## 测试流程（按 Level）

### L0：静态清单检查（总跑）

```bash
node <skill目录>/scripts/checklist.mjs <PRODUCT_PATH>
```

输出 `<PRODUCT_PATH>/.checklist-result.json`，45 条断言（7 条骨架完整性前置门 + 38 条迁移正确性），分六类：项目骨架 / import / API 命名 / 模式转换 / 样式 / 回调签名。清单全文见 [references/test-checklist.md](references/test-checklist.md)。

L0 先跑骨架完整性类（package.json/入口/index.html/构建配置是否齐备），任一失败 → 跳过后续所有迁移类检查 + 跳过 L1/L2，`notes` 注明"因骨架不完整跳过 L1/L2"。骨架全过再跑 import 类；import 类失败（`from 'antd'` 残留 / `./src/...` 残留）→ dev 起不来 → 跳过 L1/L2，`notes` 注明"因 import 错误跳过 L1/L2"。

### L1：构建与运行检查（需内网依赖）

```bash
node <skill目录>/scripts/run-build.mjs <PRODUCT_PATH>
```

输出 `<PRODUCT_PATH>/.build-result.json`：`install` / `build` / `dev` 三阶段，每阶段 `{ ok, errors }`。

脚本流程：`npm install` → `npm run build` → 后台起 `npm run dev` → 探活 → kill。

- `install.ok=false` → 外网或缺内网源，**降级**：notes 注明"内网依赖不可达（@nce/* 装不上）"，跳过 build/dev/L2，最终仅 L0 判定
- `build.ok=false` 但 `dev.ok=true` → build 失败仍跑 dev（dev 不要求 build 通过），build 失败计为 L1 失败
- `dev.ok=false` → L2 跳过，notes 注明"dev server 未起来"

### L2：视觉与交互测试（需 L1 dev + BASELINE_DIR + playwright）

```bash
node <skill目录>/scripts/visual-test.mjs <PRODUCT_PATH> <BASELINE_DIR>
```

读 `<BASELINE_DIR>/manifest.json`，按 `cases` 逐个跑。输出 `<PRODUCT_PATH>/.visual-result.json`。

每 case 流程：`page.goto(devUrl + path)` → 跑 `interactions`（click/fill/hover/select/wait/keyboard/eval）→ 跑 `assertClasses`（DOM 类名断言）+ `assertTexts` → 截图 → 与 `baseline` PNG 像素 diff（pixelmatch）→ `diffRatio <= tolerance` 算视觉通过。

manifest 格式详见 [references/baseline-manifest.md](references/baseline-manifest.md)。

**前置**：L1 的 `dev.ok=true`。dev 起不来 → L2 跳过。playwright 未装时脚本尝试 `npx playwright install chromium` 自动装；装失败 → L2 FAIL "playwright 不可用"。

> L2 用 pixelmatch 做像素 diff，**不需要多模态 LLM**——纯算法比像素。外网 + 无 baseline 时 L2 跳过；有能力跑时（内网 + baseline + playwright）无需多模态即可做视觉对比。

### L3：视觉语义判断（多模态，占位）

**当前不实现**。等环境具备多模态 LLM 后，这一层用 LLM 看 current 截图 + baseline 截图（或任务描述）做语义还原度判断，覆盖 pixelmatch 抓不到的：

- 布局结构语义一致（不是像素，是"这个区域是不是侧边栏"）
- 视觉风格匹配（圆角/阴影/留白风格）
- 关键元素呈现且可识别

L3 的 case 在 manifest 里标 `"semantic": true`。当前测试 agent 遇到 `semantic: true` 的 case 跳过并在 `notes` 注明"L3 多模态未就绪，case X 跳过"。

## 汇总与输出

跑完所有能跑的层，汇总写 `<PRODUCT_PATH>/.test-result.json`（**覆盖写**）：

```json
{
  "status": "PASS",
  "round": 1,
  "failures": [],
  "notes": "L0 38/38 通过；L1 install+build+dev 全通过；L2 4/4 通过（容差 5%）；L3 跳过（多模态未就绪）"
}
```

判定规则——**区分"失败"（跑了不过）和"跳过"（能力不具备）**：

- **失败**（跑了但不过）→ 计入 `failures`，影响 `status`：
  - L0 `summary.failed > 0` → FAIL，`failures` 加 `[L0] <check.id>: <detail>`
  - L1 `install/build/dev` 任一 `ok=false`（且不是因外网/缺内网源跳过的 install）→ FAIL，`failures` 加 `[L1] <阶段>: <errors>`
  - L2 `summary.failed > 0` → FAIL，`failures` 加 `[L2] <case.id>: <failures>`

- **跳过**（能力不具备）→ 不计 `failures`，不影响 `status`，但 `notes` 必须写明：
  - L1 install 因外网/缺内网源失败 → notes 加 `"L1 跳过：内网依赖不可达"`
  - L2 无 BASELINE_DIR → notes 加 `"L2 跳过：未提供 baseline"`
  - L2 dev 起不来 → notes 加 `"L2 跳过：dev server 未起来"`
  - L2 playwright 装不上 → notes 加 `"L2 跳过：playwright 不可用"`
  - L3 多模态未就绪 → notes 加 `"L3 跳过：多模态能力未就绪"`

- **整体 status**：
  - 所有跑了的层全过 + 跳过的层在 notes 注明 → `PASS`
  - 任一跑了的层失败 → `FAIL`
  - 仅 L0 跑（外网场景）：L0 过 → `PASS`，notes 注明"仅 L0 静态判定，L1/L2/L3 跳过"

`round` 字段：由调用方（主 agent）传入 prompt 告知，测试 agent 原样写入。首轮 = 1。

最终回复里返回 `PASS` 或 `FAIL`（与文件 `status` 一致）。

`notes` 推荐写法：`"L0 38/38 通过；L1 install+build+dev 全通过；L2 4/4 通过（容差 5%）；L3 跳过"` 或 `"L0 38/38 通过；L1 跳过（外网，内网依赖不可达）；L2/L3 跳过"`。

## 硬约束

1. 用预制脚本跑测试，不自己 grep / 不自己写 playwright / 不自己 npm install。
2. 不修改产物代码（只读 + 跑测试）。
3. 三个中间结果文件（`.checklist-result.json` / `.build-result.json` / `.visual-result.json`）写在 PRODUCT_PATH 下，便于排查；最终只汇总到 `.test-result.json`。
4. 判定只信三个结果文件 + 自己写的 `.test-result.json`，不凭主观印象。
5. `failures` 逐条写清**可操作**的失败点（让生成 agent 知道改哪），不写"测试失败"这种废话。
6. L0 发现骨架不完整（缺 package.json/入口/index.html/构建配置）→ 跳过 L1/L2/L3（dev 起不来），`notes` 注明"因骨架不完整跳过 L1/L2/L3"；L0 发现 import 路径错误（`from 'antd'` 残留 / `./src/...` 残留）→ 跳过 L1/L2/L3（dev 起不来），`notes` 注明"因 import 错误跳过 L1/L2/L3"。
7. **跳过 ≠ 失败**：能力不具备的层跳过不算 FAIL，但必须在 `notes` 写明覆盖范围，让用户/主 agent 知道当前判定的边界。
8. L2 视觉层容差以 manifest 的 `tolerance` 为准（默认 0.05）；像素 diff 失败要给 `diffRatio` 数值。
9. L3 多模态 case（manifest 标 `semantic: true`）当前跳过，不要假装跑。

## 与 build-test-fix-loop 对接

被主 agent 调用时，prompt 会带 `PRODUCT_PATH` / `BASELINE_DIR` / `round`。测试 agent 跑完写 `.test-result.json`，返回 PASS/FAIL。主 agent 读文件判定，失败则续接 GEN_ID 修复，再续接 TEST_ID（本 agent）重测——续接时本 agent 记得之前的清单基线和 baseline，直接重跑脚本即可。

> 主 agent 看到 `notes` 里"L1 跳过（外网）"时，应明白当前只做了静态判定，运行时问题没覆盖——这种情况是否继续循环由主 agent 决定（可能直接交付用户人工跑，或等内网环境再测）。

## 流程图

```
启动( PRODUCT_PATH, BASELINE_DIR?, round )
   │
   ├─ 探测能力（BASELINE_DIR? / package.json 含 @nce*?）
   │
   ├─[L0] checklist.mjs  ──▶ .checklist-result.json
   │      │
   │      ├─ 骨架不完整? ──▶ 跳过 L1/L2/L3，直接汇总
   │      └─ import 错误? ──▶ 跳过 L1/L2/L3，直接汇总
   │
   ├─[L1] run-build.mjs   ──▶ .build-result.json
   │      │
   │      ├─ install 失败（外网/缺内网源）? ──▶ 跳过 L2，notes 注明
   │      └─ dev 起不来? ──▶ 跳过 L2
   │
   ├─[L2] visual-test.mjs ──▶ .visual-result.json   (需 BASELINE_DIR + dev 可起 + playwright)
   │      │
   │      └─ 无 baseline / dev 起不来 / 无 playwright ──▶ 跳过 L2，notes 注明
   │
   ├─[L3] 多模态语义 ──▶ 占位，当前跳过
   │
   ▼
汇总跑了的层 → 写 .test-result.json（status + failures + notes 写覆盖范围）→ 返回 PASS/FAIL
```
