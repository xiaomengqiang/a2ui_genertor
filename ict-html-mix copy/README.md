# ict-html-mix

> A2UI 渲染节点工作流技能：在**已有承载页**上生成、校验、挂载、替换、新增或修改 A2UI 渲染节点，覆盖节点完整生命周期。

## 这个技能做什么

在已有的 HTML 承载页上，把 A2UI 渲染节点挂载到指定容器，完整流程：

- **生成** → 调用 `ict-coder` 技能产出 A2UI JSON
- **校验** → `validate-and-sync.ps1` 校验 JSON 语法 + 布局 lint，PASS 后生成 file:// 孪生
- **挂载** → 在承载页页尾 `nodes` 数组登记，渲染器 (`PreviewRenderer.js`) 接管容器

支持三种路线：

- **路线 A（替换）**：清空既有容器内容，渲染器重渲染，容器保留
- **路线 B（新增）**：造新槽位节点 + 挂载
- **路线 C（修改）**：patch 既有 JSON，不新建文件/节点

## 何时用它

- 用户要在某个**已有页面**上替换/新增/修改 A2UI 渲染节点
- 用户提到「承载页」「替换节点」「新增节点」「渲染到节点」「A2UI 节点」「code_artifact」
- 用户要修改**已渲染的** A2UI 内容

## 何时不用它

- 从零生成 A2UI JSON（无承载页）→ 用 `ict-coder`
- 生成 React/Vue 组件原型 → 用 `agentbox-component` / `gts-autin-coder` / `digitalpower-coder`

## 依赖

- **ict-coder** 技能（强依赖）：生成 A2UI JSON + 提供 previewdist 运行时。未安装则本技能无法运行。
- PowerShell（校验脚本运行环境）
- Chrome / Edge（file:// 直开预览；Firefox 对跨目录 file:// 子资源加载受限）

## 主要文件

| 文件 | 角色 |
|---|---|
| `SKILL.md` | AI 执行手册：意图路由 / 路线操作 / 阶段门槛 / 硬约束 |
| `WORKFLOW.md` | 参考手册：渲染器行为 / file:// 原理 / 容器布局与固定高度推导 / Pitfalls / 存储规则 |
| `scripts/PreviewRenderer.js` | 渲染器唯一权威源 |
| `scripts/validate-and-sync.ps1` | 唯一校验/维护脚本（双模式：校验 + 元信息扇出） |
| `scripts/locate-skill-root.ps1` | 技能根解析 + ict-coder 依赖检查（SKILL.md 与 validate-and-sync.ps1 共用） |

## 风险与边界

- **不得直接编辑承载页既有 DOM / 原生 HTML**（含原生表格）——必须经 JSON 层。违反即绕过管线。
- **破坏性操作需确认**：路线 A 清空容器、区域级替换删 `nodes` 项、`-GenMeta` 扇出改写多文件，落地前必须先向用户报告计划要素并等待执行语确认（见 SKILL.md「阶段门槛」）。
- **容器必须用固定高度 `h-[xxx]`**（禁 `min-h`/`max-h`），否则内容撑开。推导步骤与自检清单见 `WORKFLOW.md`「容器布局与固定高度推导」。
- **区域覆盖优先**：选中区域含既有 A2UI 子节点时整体接管，不得局部修补绕过。

## 与 SKILL.md 的分工

- 本 README 面向人：使用场景、功能、依赖、风险边界
- `SKILL.md` 面向 AI：执行规范、工作流、硬约束、阶段门槛
- 两者不重复执行细则
