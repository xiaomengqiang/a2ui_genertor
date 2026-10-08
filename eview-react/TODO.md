# eview-react Skill 迭代计划

> 2026-09-29 修订：迭代重心从"扩覆盖"调整为"先建验证能力 → 再补横向 Pattern → 最后按需分批补组件"。原 P1 / P2 / P3 与执行节奏已并入下方「迭代路线」，用户此前的排除决定全部保留。

## 当前资产

| 维度 | 数量 | 明细 |
|------|------|------|
| 组件 Reference | 48 个 | 首批：Button（含 ButtonGroup）/ TextField / Select / Checkbox（含 CheckboxGroup）/ Radio（含 RadioGroup）；第二批：TextArea / SearchInput / Steps / Tab（含 TabItem）/ FileUpload；第三批：DatePicker / Spinner / DragInput / SelectCard / Rating / Tag / Badge / Divider；第四批：Form（含 Form.Item）/ Table / Paging / Dialog / MessageDialog / Toggle（含 Switch）/ MultipleSelect；第五批：Drawer / Tree / TreeSelect / TreeTable / InputSelect / IPInput / Cascader（旧资料保留，已核验版本不提供） / DivMessage / Loading（Loader 同）/ Empty / Crumbs / Panel（含 PanelItem）/ Icon（含 IconButton）/ TipBox；提前加入：Accordion（原排第七批，2026-09-29）；2026-10-08 补齐：Carousel / ColorPicker / ConfigProvider / DropDown / PopUpMenu / ProgressBar / TimeLine / TimePicker |
| Pattern 文档 | 3 份 | `project-setup.md`（工程接入）+ `page-flows.md`（页面调用链）+ `fallback-handwrite.md`（三层判定、87 项导出核对、业务样式与手写模板、TODO 边界） |
| 通用约束与组件细则 | 分层维护 | SKILL.md 保留导入、API 使用约束、校验、受控、表单托管、异步边界与编码要求；具体 props、回调签名、ref 方法及反例按组件 Reference 读取 |
| 页面调用链模板 | 16 种 | 位于 `references/patterns/page-flows.md`：登录注册 / 筛选列表 / 列表 CRUD / 多选批量 / 向导模式切换 / 级联下拉 / 表单提交 / 多步创建向导 / 多页签工作区 / 附件上传表单 / 时间范围查询条 / 参数配置表单 / 状态列表卡片 / 树 + 列表主从页 / 侧边详情编辑 / 四态内容区 |
| 评测用例 | 31 个 / 245 条断言 | 1 登录页 / 2 联动筛选条 / 3 待办批量删除 / 4 向导单选切换 / 5 新工程接入 / 6 新建用户表单统一校验与 PC 默认交付 / 7 三步创建向导 / 8 工作区页签 / 9 附件批量上传 / 10 设备搜索框 / 11 工单多行表单 / 12 报表时间范围查询条 / 13 QoS 参数配置 / 14 服务评价 / 15 告警列表状态展示 / 16 未覆盖组件手写补位（Card + CardGrid）/ 17 设备管理 CRUD（Table + Dialog(Form) + MessageDialog）/ 18 告警规则开关 / 19 多选筛选 + 卡片分页 / 20 组织树 + 成员表 + 抽屉 / 21 网元接入表单（联动Select + TreeSelect + InputSelect + IPInput + Panel）/ 22 概览卡片四态（Loading + Empty + IconButton）/ 23 配置中心侧边导航（Accordion 语义反转 + 叶子选中 + keepExpandState）/ 24 一级操作菜单 / 25 多级操作菜单 / 26 公告轮播 / 27 批量任务进度 / 28 审批时间轴 / 29 时分秒选择 / 30 分类颜色 / 31 应用配置条件接入 |
| 原始资料 | 856 + 2 文件 | 仓库根 `hui参考文档/`（**不随 skill 打包**，仅供写作与复核）：api 93 份 TypeDoc 表、demos 71 README + 91 API.md + 426 示例、rules 2 份、site-doc 15 份 |
| 验证环境 | 本地无真实发布包；有内网源码、产物及局部运行反馈 | 内网第二轮核对 3.10.28 包入口/声明，并报告 TreeSelect 隔离运行探针；本地仍只有 `hui参考文档/` 与 `eview-react-shadcn` 兼容层（只实现 Button / ButtonGroup / TextField / Select / Checkbox / CheckboxGroup / Radio / RadioGroup 8 个导出），不能替代真实包运行 |
| 目标使用方 | OpenCode + 国产模型 | 已实测 OpenCode 1.18.26 + deepseek-v4-flash 生成资源申请表单：组件 API 用法基本正确，首轮行为测试 2/5，两轮带修复提示的反馈后 5/5（记录见 `eview-react-shadcn/docs/opencode-form-evaluation.md`） |
| 资料版本 | 3.10 源码为主，3.10.28 部分产物，4.x 部分源码 | 3.10.36+6 源码；3.10.28 部分入口/声明，另发现 3.10.7 安装实例；4.0.607+15 仅部分源码对比。目标业务工程实际版本及 4.x 发布包仍未知 |

---

## Reference 写作硬约束（Hard Rule，永久生效）

> 承接 ArkUI-Skills 的实战教训，加上本仓库首批写作中新沉淀的 3 条（第 5-7 条）。

1. **API 必须有依据**：Reference 里的每个 props / 回调 / ref 方法都必须有官方类型、示例或明确版本实现核验依据。没有依据，宁可留空，不发明；发布版未验证的推断不能写成保证行为。
2. **速查表只是摘要**：第9节摘要只列有类型、示例或已核验实现依据的能力；实现已确认的漏表字段可补入，注明适用版本或类型缺漏。
3. **语义按已核验实现和版本判断**：实现核验可纠正文档与示例的错误；仅有参数表与示例时先交叉核对，并在文件头 ⚠️ 段说明正确用法（例：`validator.result === true` 表示通过），不列来源文件。
4. **改动必须经 validator**：`python3 skills/eview-react/evals/validate_references.py` 必须 0 错 0 警；新警告优先"改文档"而不是"放宽校验"。
5. **资料互相矛盾时显式标注、不拍板**（本仓库新增）：`api/` 与 `demos/*/types.ts`、`rules/` 与 `demos/` 之间存在版本差异（见 `hui参考文档/README.md`「已知的资料矛盾」）。未取得实现结论时给出兼容方案并登记待确认；取得明确版本的实现核验后按该版本修正，保留版本边界（RadioGroup顺序已按3.10实现修正）。
6. **ref 命令式方法需有示例或实现核验依据**（本仓库新增）：`getValue / validate / focus / clear` 目前只在 TextField、Select 的官方 demo 出现，FileUpload 出现过 `handleSubmit / getValue / getValueEx`；TextArea / SearchInput / Tab / Steps 不因“看起来也应该有”而新增方法；明确的实现核验也可作为依据（如SelectCard.getValue已确认）。
7. **反例以他库习惯为主**（本仓库新增）：第 8 节至少一半的 ❌ 应是 antd / Material 写法对照（`type="primary"`、`<Option>`、`e.target.value`……），这是 eview-react 生成错误的主要来源。
8. **不写 React 运行时版本要求**（本仓库新增）：业务侧使用的是兼容 React 的运行时，版本由目标工程决定。原始资料里的"React 18 / 不是 19 / 降级命令"一律不搬进 Skill；只保留组件库自身及构建工具（Vite、plugin-react、react-intl）的版本约束。
9. **发布内容必须自包含**：打包发布的 `SKILL.md` 与 `references/` 不得出现指向 skill 目录之外的链接或路径（validator 会拦 `hui参考文档` 字样和越界链接），不写“资料来源”段落或原始文件清单。未覆盖组件不带资料，按 SKILL.md「未覆盖组件的处理」三层判定：组合已覆盖组件 → 照抄工程 `src/` 现有用法 → 手写 HTML/JSX（接入项目样式、标 TODO）；**仅允许只读目标工程已安装组件包中与本任务相关的 `.d.ts`，核对导出、props、回调和 ref 类型；不修改依赖，不凭类型声明扩展未经验证的新用法，不将声明核验当作运行验证，也不用他库顶替**。

---

## 核验结论与待确认

> 2026-10-08 已消化两轮内网核验：主源码 `3.10.36-6-g2c9e16b83`，发布包 **3.10.28 的部分入口/声明**，另发现 3.10.7 安装实例；4.x 只对比 `4.0.607-15-ga873ca561` 源码，没有对应发布包验证。TreeSelect 有内网隔离运行反馈，其余按报告区分声明、源码和产物证据。**目标业务工程实际版本仍未知，不能把源码结论视为已在该工程运行通过。**

已同步的核心结论：

- 接入：使用 `@nce/icon-plus`；ICT 3.1 类名加在 body，覆盖 Select / Dialog / MessageDialog 默认 body 弹层；Provider 不自动写 DOM 类名。
- 回调：RadioGroup 第一参为新值；SearchInput.onItemClick(text,item)，onSearch 仅搜索图标或回车；InputSelect 第三参为 input/select；Toggle 不传 data 时回调 null。
- 表单：submit 默认也调用子控件 validate；validateAllChildComponent 控制遇到首个错误后是否继续。onFailed(errorFields,values)，errorFields 映射字段当前值；整数、整数范围和长度等 defaultValidator 可用于 rules。此前“开启开关才校验子控件”的推断已纠正。
- 选中与关闭：Tab.selectedIndex 外部更新生效，业务管理页签数组时用 isAutoClose=false；DropDown.selectedIndex 匹配菜单 value，onDropDown 仅展开通知 true，onClosePopup 无参；DivMessage.onClose 应同步外部 display=false。
- 数据与命名：Table.keyIndex 为 columns 的 0 基列下标；Tree 回调 node 是实例，使用 node.props.eventKey；TreeSelect 回填 id 数组而非文案；核验线没有 Cascader，时间组件根导出为 TimeSelector。
- 其他：FileUpload 逐文件进度与删除事件、DatePicker 输入回写与 timeEmbedded、Steps vertical、SelectCard.getValue、Dialog 按钮 disabled、Loading 默认图标、Accordion 字段与展开语义、Carousel 半受控、TimeLine JSX 回调等已按报告更新 Reference。
- 第二轮：TimePicker.getValue 返回字符串数组、timeEmbedded 内联渲染已确认；ColorPicker 在确认选色时触发 onColorChange，Form.Item 使用 updateTrigger="onColorChange"；3.10.28 的 Segmented / Slider / TimePicker / Transfer 子路径均有默认导出。
- 4.x 部分源码对比：RadioGroup 参数顺序、SearchInput、Switch.onToggle、Form.onFailed、DropDown.selectedIndex、InputSelect.type 与 3.10 一致，TimePicker.getValue 存在；该线移除 L4，且没有 Cascader。Cascader 在 3.10.28 发布包也不存在，不再作为默认可用组件。

已知实现限制（不再当作无结论的问题）：

- Checkbox 是 prop 变化同步的半受控；forceUpdate 用于重置未变 prop 对应的内部状态，treeChecked 主要供树使用。
- FileUpload.enableProgress 与 Spinner.doNotFocusWhenValueUpdate 在核验源码中未生效，示例不依赖它们。
- MessageDialog.ok.disabled 可能被内部 selected 状态解除，危险操作仍需处理器校验和同步防重锁。
- Drawer 程序化 visible=false 不保证 destroyOnClose 生效；换对象用重置后回填或独立 key，避免旧值残留。
- DropDown.selectedIndex=0 会传成 null，不能高亮 value=0 项；该项仍可正常点击派发。
- PopUpMenu children 与传统坐标模式的方向处理不同；坐标 0 与 offset 有实现限制，选项级 onClick 对 serialno=0 有回退问题，默认使用组件级回调。
- ProgressBar.overTime 的计时器无卸载清理；默认使用真实 current/max，需估算时由业务管理和清理计时器，不能把反复重挂作为可靠重试方案。
- TreeSelect 单改 value 不会完整同步文字与勾选；[] 只清文字、不清树。外部换记录、回填或清空使用独立 revision/key 重建，普通选择不每次重挂；不能凭 value 类型宣称完全受控。
- PopUpMenu 未设 serialno 的回退来自内部 option.value 或 DOM id；键盘路径可能得到字符串 "undefined"。它不是自增序列号；显式设置 serialno，并拒绝未知值。
- TimePicker 的 hh:mm + amPm 输出标记在下标 2，输入却读取 time[3]；小时范围 1–12，12/24 小时转换由业务处理。ampmVal 外部 prop 无效；核验的 3.10 源码与 3.10.28 包没有 bottomButtons，不再追问该属性的确认/取消行为。
- ConfigProvider 在核验 3.10 线中有 locale/messages 声明但无消费者，theme 非正式字段；不再生成靠它配置语言或主题的写法。animation 的消费者为 Motion/Animation，动态继承和业务 IntlContext 仍未答。

以下保留 **4 组待确认**。已解答的 getValue、嵌入模式、子路径入口和 TreeSelect 缺陷不再反复追问；范围外版本只在目标工程需要时核验。

| 项 | 现状 | 后续动作 |
|----|------|----------|
| 目标业务版本及适用范围 | 内网安装实例是 3.10.28 / 3.10.7，目标业务版本未知；4.x 只有部分源码对比，无发布包验证 | 读取目标工程实际 package.json 与相关声明；只有用到其他版本时再核对行为和入口，不因旧资料推断 Cascader 可用 |
| ColorPicker 回填、重置与浮层 | 事件、六位 hex、Form.Item.updateTrigger、默认 body 挂载已回答；Form 回填/清空/reset 的显示同步与 Dialog/Drawer 内实际遮挡未回答 | 补 Form 初始值→setFields→reset/清空的表现，及浮层层级/裁剪验证；保留已确认的最小 Form 接入 |
| ConfigProvider 业务上下文与动态配置 | 声明字段及消费者已回答；未说明是否提供 react-intl IntlContext、useIntl/FormattedMessage 兼容性，以及 animation 动态更新、嵌套继承、portal 表现；onlyRenderOutside 的精确挂载语义不清 | 保留用户的条件接入策略；替换前验证必要的国际化上下文，不能靠无消费者的 locale/messages 迁移；有相应需求时补动态配置和挂载行为 |
| PopUpMenu 全路径差异 | slno 来源及缺 serialno 的键盘字符串回退已回答；报告未给出两种模式 × 鼠标/键盘 × 组件/选项回调的完整结果矩阵 | 默认显式 serialno + 组件级回调已可用；需要选项回调或特殊模式时补齐矩阵，不再笼统宣称缺失时总为 undefined |

---

## 迭代路线（2026-09-29 修订）

### 为什么调整

- **覆盖面已够用**：48 份 Reference 对应旧入口快照中的 54 个名字（共 87 个；不能代表当前发布包，Cascader与TimeSelector差异见上），表单、表格、弹层、反馈等高频组件都在；剩余候选只有 18 个（见阶段 2），基本是长尾，其中 8 个没有官方 demo。
- **验证欠账大**：待确认 4 组；已有源码、部分产物和 TreeSelect 局部运行反馈，尚未在目标业务工程运行验证（见「当前资产 · 资料版本」）；`validate_references.py` 检查结构、链接、数量和禁用写法，但不检查 prop 是否真在 TypeDoc 表里；唯一一次 OpenCode 实测首轮行为测试只过 2/5。
- **写作速度不是瓶颈**：第二至五批 34 份大约一天内写完，核验手段没有跟上。写错的 Reference 比没有更糟：没有时模型走补位流程并标 TODO，写错时模型会照抄（`TextField.md` 的短路 `refs.find` 与 OpenCode 首轮失败表现一致）。

**约束**：作者侧拿不到真实包，核验基于 `hui参考文档/`、内网核验反馈与兼容层，必须区分类型、源码、产物与实际运行的覆盖范围；使用方是 OpenCode + 国产模型（如 deepseek-v4-flash），评测必须在这个组合上跑，Reference 篇幅也要照顾小模型的阅读能力。

**顺序**：阶段 0 验证能力 → 阶段 1 横向 Pattern → 阶段 2 按需分批补组件。

---

### 阶段 0：验证能力（先于任何新组件）

- [ ] **0.1 发布包基线**：已声明 3.10 源码、3.10.28 部分产物和 4.x 部分源码范围；目标业务工程实际版本及对应运行结果仍待确认。
- [ ] **0.2 待确认 4 组继续推进**
  - [x] 已消化内网报告Q1–Q31：回填组件Reference与评测中的旧错误要求；实现结论不再标成完全未知。
  - [x] 已消化第二轮 Q1–Q9：补 TimePicker.getValue、AM/PM、timeEmbedded，纠正 bottomButtons；补 ColorPicker Form 入口、ConfigProvider 字段/消费者、TreeSelect 与 PopUpMenu 缺陷和发布包子路径。
  - [ ] 按上表补目标版本、ColorPicker 回填/浮层、ConfigProvider 国际化/动态配置、PopUpMenu 全路径矩阵。
  - [ ] 在真实目标工程验证受控回显、关闭重开、表单切换等交互；记录明确失败，不将类型检查或模拟层通过当作真实包通过。
- [x] **0.3 修掉 4 处已知文档问题**，每处配一条回归断言（2026-09-29 完成；同批还修了新发现的 3 处：`Select.md` 用 `&&` 短路校验、`Table.md` 与 `Paging.md` 请求链缺 catch。回归断言见用例 2、3、5、6、17）
  - [x] `TextField.md` §7：`refs.find((r) => !r.current.validate())` 遇到第一个失败就停，其余字段不校验 → 先对全部 ref 执行 `validate()` 收集结果，再聚焦第一个失败项
  - [x] `Checkbox.md` §7：批量删除直接执行，与 `Button.md` 反例"危险操作直接执行，没有二次确认"冲突 → 补确认与取消分支，取消后数据不变
  - [x] `project-setup.md` §2：2026-09-29 曾修订双层 Provider 的嵌套顺序。**旧强制双层要求及 2026-10-08 早先的“普通页面默认无 Provider”规则，均已被当日最新确认替代**：已有 IntlProvider 且无 animation 需求时沿用；没有 IntlProvider 时用 ConfigProvider 最小 children 包装；需要控制 animation 时用 ConfigProvider 替代并传 boolean。复用已有 ConfigProvider，静态开关不强制增加状态/UI；替换前核对 useIntl / FormattedMessage 等实际消费者，保留必要上下文或先完成迁移，不强制叠双层，也不盲删 react-intl 包。
  - [x] `Select.md` §7：加载中点重置时，`!region` 分支没有 `setLoadingSites(false)`，"加载中..." 文案残留；请求链没有 catch 和错误状态 → 补齐，并覆盖"加载中重置""请求失败"两种情况
- [ ] **0.4 API 准确性机器检查**（在作者仓库运行，不进包）
  - [ ] 校验脚本新增：解析每份 Reference §9 的 API 名，以及 §7 示例里该组件 JSX 上的 props，对照 `api/` TypeDoc 表（缺表时对照 `__docs__/API.md` 与 `types.ts`），查不到报 ERROR；导出名与资料名不一致的建映射（DragInput / Slider、SelectCard / Segmented、TimePicker / TimeSelector）
  - [ ] 从 TypeDoc 表生成 `@nce/eview-react` 的类型声明（`.d.ts`），把各 Reference §7 示例抽成 `.tsx` 后用 `tsc --noEmit` 编译
- [ ] **0.5 评测流水线（OpenCode）**
  - [ ] 执行器用 `opencode run --pure --format json`（`eview-react-shadcn/artifacts/opencode-form/` 已跑通过），模型与使用方一致；小模型输出方差大，每个用例至少跑 3 次，按通过率计分
  - [ ] 同一 prompt 分"加载 skill / 不加载 skill"两组跑，得到基线分数；每次改版与上一版对比。方法参照 `ArkUI-Skills/.agents/skills/skill-creator/`（有无 skill 对比、断言打分、网页复核），其脚本依赖 Claude Code 的 `claude -p`，需改写为 OpenCode 调用
  - [ ] 自动检查分四层：禁用写法扫描（与 `EVIEW_FORBIDDEN` 共用一份规则）→ `tsc` 编译（用 0.4 生成的类型声明）→ 兼容层能覆盖的组件跑 Playwright 行为测试 → 其余 behavioral 断言由模型评分，加人工抽查
  - [ ] 触发测试：应触发、不应触发的 prompt 各 10 条，从 OpenCode 事件日志判断 skill 是否被加载
- [x] **0.6 打包流程化**（2026-09-29 已由 `scripts/package_skill.py` 实现：`python3 scripts/package_skill.py [--date YYYY-MM-DD]` 依次做静态校验、frontmatter 检查、写入 `metadata.packaged`，输出 `dist/eview-react-<日期>.zip` 与同内容的 `.skill`；旧包已改名移入 `dist/archive/`，当前最新为 `dist/eview-react-2026-09-29.zip`）。原要求：一条命令完成"跑校验 → 打包 → 包名带版本号"；排除 `__MACOSX`、`.DS_Store`、`evals/`、`TODO.md`（本文件含大量仓库外路径，按硬约束第 9 条本就不该进包；9 月 16 日的 `skills/eview-react.zip` 还混入了 52 个 `__MACOSX` / `.DS_Store` 条目）；用新包替换 `dist/` 下 9 月 11 日的旧包（旧包 SKILL.md 仍是 317 行的版本，缺 `page-flows.md` 与 `evals/`）
- [x] **0.7 清理过时的"第 N 批"说法**（2026-09-29）：11 份 Reference 中有 20 处"（第二批）"，其中 17 处指向早已有 Reference 的组件，已改为链接；TimeLine / BrowseButton / TextButton 3 处改为"未覆盖"；`Tab.md` 不再把 Accordion 推荐为表单分组。同日又清理 8 份 Reference 中 10 处"（后续批次）"与 Checkbox 的"留待后续"，其中 `Divider.md` 同样不再把 Accordion 推荐为表单分组
  - [ ] validator 增加规则：Reference 提到已有 Reference 的组件时必须带链接，禁止出现"第 N 批""后续批次"等字样

**完成标准**：待确认各项都有结论，或有明确的版本边界、兼容写法与 ⚠️；4 处问题修完；校验脚本能拦住表外 prop；全部用例都有"加载 / 不加载 skill"的基线分数。

---

### 阶段 1：横向 Pattern（优先于新组件）

OpenCode 实测里组件 API 基本用对、没有混入 antd 写法，失败集中在表单校验与重置这类跨字段逻辑；`page-flows.md` 只有调用链骨架，没有这类逻辑的标准实现。

- [ ] `form-validation.md`：先全部校验再聚焦首个错误；重置同时清除校验状态（优先用资料中有依据的 API，否则以单个表单容器为单位换 key 重挂载，不要给多个兄弟节点设同一个 key）；数字输入同时限制字符、范围与整数（测 0、65536、小数和上下边界）；Form `rules` 体系与控件自带 `validator` 的选型；`onSuccess` / `onFailed` 收口；异步查重（防抖 + 版本号）；`validateErrorType="tip"` 与 `hintType` 关系
- [ ] `async-data.md`（原计划名 `data-fetching.md`）：loading / empty / error / 重试、过期请求保护、防重复提交的标准实现（可直接移植 ArkUI 版的四态模型）；各 Reference §7 引用它，不再各写一套样板（`Select.md` 的 loading 残留就出在样板里）
- [ ] `table-crud.md`（NCE-Fabric 标杆）：筛选条 + Table + Paging + Dialog 表单 + 删除确认的完整 CRUD 调用链；`recordCount` 服务端分页；行操作列 `render`；批量勾选与 Checkbox.md 的 `Set` 模式衔接
- [ ] `theme-and-intl.md`（低优先）：`aui3_1` / `aui3_1_dark` 切换、`ev_direction_rtl`、`componentsLocales` 与业务语言包合并
- [ ] 每份 Pattern 至少配一个评测用例；Pattern 与 Reference 都把关键易错点放在文件开头，照顾小模型

---

### 阶段 2：按需分批补组件

`@nce/eview-react` 的资料入口列出 87 个可导入名字（`hui参考文档/demos/index.js`）：48 份 Reference 对应旧清单中的 54 个名字（已含 `ConfigProvider`，Cascader在3.10线不存在，时间根名改为TimeSelector）。以下覆盖数仅按旧清单统计，不作为当前包导入依据。剩余 33 个中，15 个已排除（按根导出名计，见下），实际候选 18 个。`ColorPicker` 有子路径入口与示例，但不在这份根导出清单中；`PanelItem` / `CarouselItem` 是组件子路径命名导出，`Form.Item` 是静态子组件，均不另计根导出。

**排序依据**：
1. 与 antd 习惯的差异程度：差异越大越需要 Reference；和 antd 几乎一样的组件，模型不看文档也能写对
2. 基线评测里不加载 skill 时的失败率（0.5 产出）
3. 资料完整度：有 TypeDoc 表和 demo 才写得出可信的 Reference
4. 能拿到业务代码时，用其中 `@nce/eview-react/*` 的 import 次数校准

**开批前准备**：
- [ ] 每份 Reference 加 front-matter（名称、别名、关键词、可信度），用脚本生成 SKILL.md 组件索引、README 目录树与覆盖表、本文件资产表、validator 的 `NON_COMPONENTS` / `CHILD_TO_PARENT`，取代下方"完成后同步更新"的手工步骤；`fallback-handwrite.md` 里写死的已覆盖数量（现为"48 个已覆盖组件"）也改为引用索引（`check_counts` 查不到这一处）
- [ ] 可信度分级写入文件头与索引：**A** 真实环境确认（目前只能来自使用方反馈）；**B** TypeDoc 表与 demo 交叉一致；**C** 只有类型表，或存在未决冲突。现有 48 份含类型/示例核对及3.10实现核验；源码核验不归为真实运行验证，ConfigProvider 按核验的 3.10 字段/消费者修订，旧资料中的配置型契约不作为当前版本保证（`Steps.md` 无 TypeDoc 表，以站点 API.md 为准）
- [ ] C 级精简模板：只写文件头 ⚠️、§5 数据结构、§8 反例、§9 API，不写 §7 完整示例（没有 demo 却写完整示例等于编造用法）；validator 相应放宽 C 级的章节要求
- [ ] validator 增加篇幅告警（总行数、§7 代码行数），阈值按下方完成标准第 8 条定；已于 2026-09-29 精简 Table / Form / Checkbox / Dialog / MessageDialog（分别为 237 / 252 / 254 / 203 / 218 行），FileUpload（292 行）/ DatePicker（291 行）待精简

**候选分批**（括号内为官方 demo 数）：

- **第六批 · 表单与表格链路**（沿用原计划"表单 / 表格链路优先"）
  - [ ] `Table.md` 二期：编辑列（`renderType` / `Table.ColumnRenderType.*` / `onEdit`）、列筛选弹窗、冻结列、多级表头、虚拟滚动、导出（首期只覆盖列表页高频能力）
  - [ ] `ScrollTable.md`（2）
  - [x] `TimePicker.md`（6）：2026-10-08 补齐，time 数组、格式、禁用、回调及重置；第二轮补 getValue、AM/PM 与内嵌模式，撤回 bottomButtons；新增用例 29。
  - [ ] `HexField.md`（2）
  - [x] `ProgressBar.md`（8）/ `TimeLine.md`（3）：2026-10-08 补齐，真实进度与时间轴内容渲染；新增用例 27、28，用例 16 改为 Card/CardGrid 补位。
- **第七批 · 反馈、弹层与导航**
  - [ ] `FormMessage.md`（3）/ `Popup.md`（1）
  - [x] `PopUpMenu.md`（6）/ `DropDown.md`（8）：2026-10-08 重新加入，多级与一级菜单、权限禁用、异步防重；新增用例 24、25。
  - [ ] `TreeSelector.md`（8）
  - [ ] `Anchor.md`（3）
  - [x] `Accordion.md`（6）：2026-09-29 提前完成。与 Panel / Tree / Tab 的辨析写在其 §1，`Panel.md`、`Tree.md`、`fallback-handwrite.md` 各补一行回指；新增用例 23；§9 与 TypeDoc 的 21 个 props 逐项比对一致，§7 按 TypeDoc 转写的类型声明做过 `tsc` 严格模式编译；已按完成标准第 8 条从 386 行精简到 220 行（§7 代码 178 → 87 行）
- **第八批 · 有 demo 的长尾**
  - [x] `Carousel.md`（6）：2026-10-08 补齐，children、自动播放、暂停与空态；新增用例 26。
  - [x] `ColorPicker.md`（2）/ `ConfigProvider.md`：2026-10-08 补齐，字符串颜色受控与应用配置版本边界；新增用例 30、31。用例 5、31 已按当日最新确认调整：已有 IntlProvider 且无动画需求时沿用；没有 IntlProvider 时使用 ConfigProvider 最小包装；需控制 animation 时用 ConfigProvider 替代并传 boolean，复用已有包装并核对业务消费者，不主动增加状态/UI、语言切换或主题状态。
  - [ ] `BrowseButton.md`（4）/ `CategoryInput.md`（4）/ `CategorySearch.md`（4）/ `LabelField.md`（2）
- **C 级精简版 · 无 demo，只有类型表**
  - [ ] `TimeRangeSelector` / `IconButtonGroup` / `TextButton` / `Menu` / `CardGrid` / `JList` / `ScrollBar` / `Shade`

**已排除（不建）**：`DoubleSelect`、`PageMessage`、`HelpTip`、`Layout`、`GridLayout`（含 `Row` / `Col`）、`Split`、`Card`、`PagingTree`（含 `TreeDataEngine`）、`TimescaleAxis`、`LinkField` 由用户排除；`ButtonMenu` 官方废弃；`Wizards` 是 `Steps` 旧名，不单建 Reference，已在 `Steps.md` 头部对照。

**每份 Reference 的完成标准**：
1. 核对 API 与示例，记录影响用法的差异和未决问题，不列来源清单
2. 按模板起草：B 级完整 9 节，C 级精简版
3. API 核验通过；§7 示例 `tsc` 编译通过
4. 至少一个评测用例用到它，且含一条针对 antd 习惯的反向断言
5. 未决矛盾登记到「待实测」，文件头加 ⚠️
6. 索引与计数同步，validator 0 错 0 警
7. 整批完成后跑全量评测，分数不低于上一版基线
8. 篇幅控制在现有中位数附近（约 220 行），§7 示例代码尽量不超过 90 行：模拟接口、加载 / 失败 / 空态等通用样板不进 §7，交给 SKILL.md 与阶段 1 的横向 Pattern；§9 只为核心 API 单列一行，官方 demo 少用或未用的 props 合并为"其余"一行，只列名字和极短说明，不整行删除（SKILL.md 要求"查不到不推断"，删掉会让模型误判没有这项能力）

**完成后同步更新**（front-matter 脚本落地前手工执行）：
- [ ] SKILL.md 组件索引追加行；"当前已覆盖 N 个组件" 同步
- [ ] README.md 目录树 + 组件覆盖表
- [ ] TODO.md 资产表
- [ ] validator 的 `NON_COMPONENTS` 集合里把已建 Reference 的组件名移除
- [ ] `fallback-handwrite.md` 中的已覆盖数量与 §5 未覆盖组件表

每批 5–7 份，核验与评测都通过再开下一批。

---

### 评测体系

现有 31 个用例、245 条断言，按类型分为 `eview_compliance` 111 条、`behavioral` 101 条、`contains_pattern` 33 条；没有执行器，`validate_references.py` 只检查 evals.json 的结构。

- [x] 补 Form / Table 用例：已由用例 17（Table + Dialog(Form) + MessageDialog）与用例 20（Tree + Table + Drawer 表单）覆盖
- [x] 反向断言：111 条 `eview_compliance` 断言已覆盖"不从 antd 导入""不用 `type="primary"`""Select 不用 `placeholder`""不用 `e.target.checked`"等
- [x] 用例 6 的断言"逐个校验，首个失败项调用 focus()"与 `TextField.md` 的短路写法一致，会给错误实现打高分 → 已改为"先全部校验再聚焦首个失败项"，并补"端口拒绝小数、0 和 65536"（2026-09-29）。`TextField.md` §7 已同步修复（全量校验 + `isCharacterAllowed` 拦小数）
- [ ] 收编 OpenCode 实测的资源申请表单为用例 32（需求原文在 `eview-react-shadcn/artifacts/opencode-form/prompt.md`），把首轮 3 个失败点（全量校验、整数端口、重置清除校验状态）写成断言
- [x] 断言不得把待实测项写死为唯一答案：已修订用例 8（关闭页签后的激活页）、17（`keyIndex`）、20（节点主键、DivMessage 再次提示），改为按行为判定，并在断言里注明待实测项与可接受的兼容写法（2026-09-29）。以后新增断言照此执行
- [x] 用例13已移除Spinner必须传doNotFocusWhenValueUpdate的要求；核验源码中该prop未生效（2026-10-08）。
- [ ] 原计划"在真实工程跑一遍用例"：作者侧无真实包，改为在兼容层 + 类型声明上跑全部用例（见 0.5），真实环境运行结论来自使用方运行反馈；内网源码反馈单独标明（见 0.2）
- [ ] 自动化断言与 `validate_references.py` 的 `EVIEW_FORBIDDEN` 共用一份规则（见 0.5）

---

## 已确认决策

- [x] **2026-10-08 · 已安装包 `.d.ts` 核验**：用户允许只读目标工程已安装组件包的相关 `.d.ts`，核对导出、props、回调和 ref 类型；不修改依赖，不凭类型扩展未经验证的新用法，也不将声明核验或类型编译通过视为运行验证。

## 待决策

| 事项 | 现状 | 建议 |
|------|------|------|
| 兼容层是否扩展 | `eview-react-shadcn` 只实现 8 个导出；资料冲突处必须自选实现（如 RadioGroup 取旧值在前），测到的是"与假设一致"而非"与真实库一致"。2026-09-29 已把 Select / RadioGroup / Radio / Checkbox / CheckboxGroup 回调的值参数按 TypeDoc 放宽为 `any`（此前多出的 `\| null` 让 OpenCode 首轮构建误报失败），首批 5 份示例在兼容层上严格编译通过 | 暂不扩展：其余组件只做 `tsc` 编译检查；等基线评测显示行为失败集中在哪些组件，再决定是否为 Form / Table / Dialog 补实现 |
| 运行时包内容 | 9 月 16 日打的包里含 `evals/`、`TODO.md` 和系统垃圾文件 | 已执行（`scripts/package_skill.py`）：只保留 SKILL.md 与 `references/`；待实测信息已写在各 Reference 文件头的 ⚠️ 中 |

---

## 执行节奏

| 阶段 | 任务 |
|------|------|
| 第一周 | 阶段 0：0.1 资料基线、0.2 资料内交叉核对与探针清单、0.3 修 4 处问题、0.4 API 检查与类型声明、0.6 打包脚本 |
| 第二周 | 阶段 0：0.5 评测流水线与基线分数；阶段 1：`form-validation.md`；评测体系中的用例 6 修订与用例 32 |
| 第三周 | 阶段 1：`async-data.md`、`table-crud.md`；阶段 2 开批前准备（front-matter、可信度分级、C 级模板） |
| 之后 | 第六批起每批 5–7 份，按基线评测结果调整批次顺序；`theme-and-intl.md` 穿插进行 |
