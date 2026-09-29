# eview-react Skill 迭代计划

> 2026-09-29 修订：迭代重心从"扩覆盖"调整为"先建验证能力 → 再补横向 Pattern → 最后按需分批补组件"。原 P1 / P2 / P3 与执行节奏已并入下方「迭代路线」，用户此前的排除决定全部保留。

## 当前资产

| 维度 | 数量 | 明细 |
|------|------|------|
| 组件 Reference | 40 个 | 首批：Button（含 ButtonGroup）/ TextField / Select / Checkbox（含 CheckboxGroup）/ Radio（含 RadioGroup）；第二批：TextArea / SearchInput / Steps / Tab（含 TabItem）/ FileUpload；第三批：DatePicker / Spinner / DragInput / SelectCard / Rating / Tag / Badge / Divider；第四批：Form（含 Form.Item）/ Table / Paging / Dialog / MessageDialog / Toggle（含 Switch）/ MultipleSelect；第五批：Drawer / Tree / TreeSelect / TreeTable / InputSelect / IPInput / Cascader / DivMessage / Loading（Loader 同）/ Empty / Crumbs / Panel（含 PanelItem）/ Icon（含 IconButton）/ TipBox；提前加入：Accordion（原排第七批，2026-09-29） |
| Pattern 文档 | 3 份 | `project-setup.md`（工程接入）+ `page-flows.md`（页面调用链）+ `fallback-handwrite.md`（三层判定、87 项导出核对、业务样式与手写模板、TODO 边界） |
| 通用约束与组件细则 | 分层维护 | SKILL.md 保留导入、API 溯源、校验、受控、表单托管、异步边界与编码要求；具体 props、回调签名、ref 方法及反例按组件 Reference 读取 |
| 页面调用链模板 | 16 种 | 位于 `references/patterns/page-flows.md`：登录注册 / 筛选列表 / 列表 CRUD / 多选批量 / 向导模式切换 / 级联下拉 / 表单提交 / 多步创建向导 / 多页签工作区 / 附件上传表单 / 时间范围查询条 / 参数配置表单 / 状态列表卡片 / 树 + 列表主从页 / 侧边详情编辑 / 四态内容区 |
| 评测用例 | 23 个 / 173 条断言 | 1 登录页 / 2 联动筛选条 / 3 待办批量删除 / 4 向导单选切换 / 5 新工程接入 / 6 新建用户表单统一校验与 PC 默认交付 / 7 三步创建向导 / 8 工作区页签 / 9 附件批量上传 / 10 设备搜索框 / 11 工单多行表单 / 12 报表时间范围查询条 / 13 QoS 参数配置 / 14 服务评价 / 15 告警列表状态展示 / 16 未覆盖组件手写补位（进度条 + 时间轴）/ 17 设备管理 CRUD（Table + Dialog(Form) + MessageDialog）/ 18 告警规则开关 / 19 多选筛选 + 卡片分页 / 20 组织树 + 成员表 + 抽屉 / 21 网元接入表单（Cascader + TreeSelect + InputSelect + IPInput + Panel）/ 22 概览卡片四态（Loading + Empty + IconButton）/ 23 配置中心侧边导航（Accordion 语义反转 + 叶子选中 + keepExpandState） |
| 原始资料 | 856 + 2 文件 | 仓库根 `hui参考文档/`（**不随 skill 打包**，仅供写作与复核）：api 93 份 TypeDoc 表、demos 71 README + 91 API.md + 426 示例、rules 2 份、site-doc 15 份 |
| 验证环境 | 无真实包 | 拿不到内网 npm 源和装有 `@nce/eview-react` 的工程；可用的只有 `hui参考文档/` 与工作区的 `eview-react-shadcn` 兼容层（shadcn 重写，只实现 Button / ButtonGroup / TextField / Select / Checkbox / CheckboxGroup / Radio / RadioGroup 8 个导出） |
| 目标使用方 | OpenCode + 国产模型 | 已实测 OpenCode 1.18.26 + deepseek-v4-flash 生成资源申请表单：组件 API 用法基本正确，首轮行为测试 2/5，两轮带修复提示的反馈后 5/5（记录见 `eview-react-shadcn/docs/opencode-form-evaluation.md`） |
| 资料版本 | 不明确 | `eViewReactVersion.js` 是占位符 `%%GULP_INJECT_VERSION%%`；`change_log.md` 带版本号的标题最高到 3.9.8；FAQ 又提到 4.x |

---

## Reference 写作硬约束（Hard Rule，永久生效）

> 承接 ArkUI-Skills 的实战教训，加上本仓库首批写作中新沉淀的 3 条（第 5-7 条）。

1. **API 必须可溯源**：Reference 里的每个 props / 回调 / ref 方法都必须能在 `hui参考文档/api/<组件>_*.md` 或 `demos/<组件>/__demo__/` 里一比一搜到。原文没有，宁可留空，也不要发明。
2. **速查表只是摘要**：第 9 节是 api 表的压缩再引用，不能新增表里没有的行。
3. **语义以官方 demo 为准**：参数表文字描述与 `__demo__` 可执行代码冲突时以 demo 为准，并在文件头 ⚠️ 段写明依据（例：`validator.result === true` 表示通过，来自 `TextFieldEvent.jsx` / `selectBasic.tsx`）。
4. **改动必须经 validator**：`python3 skills/eview-react/evals/validate_references.py` 必须 0 错 0 警；新警告优先"改文档"而不是"放宽校验"。
5. **资料互相矛盾时显式标注、不拍板**（本仓库新增）：`api/` 与 `demos/*/types.ts`、`rules/` 与 `demos/` 之间存在版本差异（见 `hui参考文档/README.md`「已知的资料矛盾」）。写法上给出两头都成立的方案（如 `RadioGroup.onChange` 用"与当前值比较取新值"），并登记到下方「待实测」。
6. **ref 命令式方法只列 demo 出现过的**（本仓库新增）：`getValue / validate / focus / clear` 目前只在 TextField、Select 的官方 demo 出现，FileUpload 出现过 `handleSubmit / getValue / getValueEx`；TextArea / SearchInput / Tab / Steps 的 demo 没有 ref 方法，即使"看起来也应该有"，不写。
7. **反例以他库习惯为主**（本仓库新增）：第 8 节至少一半的 ❌ 应是 antd / Material 写法对照（`type="primary"`、`<Option>`、`e.target.value`……），这是 eview-react 生成错误的主要来源。
8. **不写 React 运行时版本要求**（本仓库新增）：业务侧使用的是兼容 React 的运行时，版本由目标工程决定。原始资料里的"React 18 / 不是 19 / 降级命令"一律不搬进 Skill；只保留组件库自身及构建工具（Vite、plugin-react、react-intl）的版本约束。
9. **skill 目录必须自包含**（本仓库新增）：`skills/eview-react/` 会被单独打包发布，目录内任何文件都不得出现指向目录之外的链接或路径（validator 会拦 `hui参考文档` 字样和越界链接）。"资料来源"只写纯文本的 TypeDoc 表名 + 示例文件名；未覆盖组件不带资料，按 SKILL.md「未覆盖组件的处理」三层判定：组合已覆盖组件 → 照抄工程 `src/` 现有用法 → 手写 HTML/JSX（接入项目样式、标 TODO）；**不读 `node_modules`、不用他库顶替**。

---

## 待实测（需在真实 `@nce/eview-react` 工程里跑一次确认，本地无内网 npm 源）

> 作者侧拿不到真实包，按「阶段 0 · 0.2」三步推进：资料内交叉核对 → 核不了的保持兼容写法并在 Reference 文件头标 ⚠️ → 借使用方的真实工程确认后回填本表。

| 项 | 现状 | 确认后动作 |
|----|------|-----------|
| `RadioGroup.onChange` 参数顺序 | 类型 `(oldValue, value, event)` vs 文档 `(value, oldValue, event)`，无 demo | 确认后把 `Radio.md` §4 的兼容写法简化为直接取值，删掉 ⚠️ |
| icon+ 包名 | `rules/project-setting.md` 写 `@nce/icon-plus`，`demos/Button/__demo__/IconPlus.tsx` 导入 `@hui/icon-plus` | 以实际工程为准后统一 `project-setup.md` §1 与 `Button.md` |
| 根 DOM 是否需要 `class="aui3_1"` | `aui_to_ict.md`（3.7.5+）明确要求，否则样式不生效；`f_&_q.md` 称 4.x 起默认 ICT3.1，但该节标注"待发布"。2026-09-29 起骨架默认加在 `body` 上；TypeDoc 写明 Dialog / MessageDialog 不传 `mountId` 时挂在 body | 确认 Select 等下拉弹层是否也挂在 body 下（否则改加到弹层容器）；若目标工程确为已发布的 4.x 且默认生效，可去掉 |
| `Checkbox.checked` 是否完全受控 | API 有 `forceUpdate` / `treeChecked` 暗示内部维护 state；FAQ 称组件在 receiveProps 做新旧值比较 | 若父级更新 `checked` 不生效，`Checkbox.md` 补 `forceUpdate` 说明 |
| `TextField.defaultValidator.integer()` | demo `InputValidator.jsx` 使用，但 api 表的 18 个内置规则里没有 | 确认存在则加入速查正文；不存在则从 `TextField.md` 移除 |
| 受控写法性能 | `f_&_q.md` 不建议 `value + onChange`"双向绑定"，官方 demo 却都这么写 | 首批按 demo；DatePicker 等会"修正 value"的组件在第二批单独核实 |
| `SearchInput.onItemClick` 参数顺序 | 类型 `(value, obj)`，demo `SearchItems.jsx` 把第一个参数当 obj 用 | 确认后把 `SearchInput.md` §4 的"取带 text 的那个"简化为直接取值 |
| `SearchInput.onSearch` 是否在值变化时触发 | API 表写"点图标 / 回车 / 值变化"三种时机 | 若实测只在图标 / 回车触发，可去掉 `SearchInput.md` 里的防抖要求 |
| `Tab.isAutoClose` 语义 | 默认 true，"set tab items AutoClose or not"，与业务自己维护页签数组是否冲突未知 | 若组件自行隐藏已关闭页签导致下标错位，`Tab.md` 改为 `isAutoClose={false}` |
| `Tab.selectedIndex` 是否受控 | demo 只演示初始值，未演示外部更新 | 若外部 `setActiveIndex` 不生效，`Tab.md` 补说明并改用 key 重挂载 |
| `Steps.direction="vertical"` | 仅 `WizardsVerticalDemo.jsx` 使用，`__docs__/API.md` 未列 | 确认后补进 API 表行或从 `Steps.md` 移除 |
| `FileUpload.onFileClose` 的 event 结构 | 类型名 `fileCloseEvent` 无字段说明，demo 只 `console.log` | 确认文件名字段后修正 `FileUpload.md` §7 的 `event.title ?? event.name` |
| `FileUpload.enableProgress` 多文件 | API 表注"只支持单个文件"，`FileUploadMulti.jsx` 多文件也开了 | 以实测为准修订 `FileUpload.md` 文件头 ⚠️ |
| `DatePicker` 受控回写 | 官方反例反对无条件回写；`DatePickerEvent.jsx` 用 `if (obj)` 回写字符串仍可用 | 实测"有效 Date 才回写 Date 对象"是否打断输入；不行则 `DatePicker.md` 只保留 defaultValue + ref.getValue 模式 |
| `DatePicker.timeEmbedded` | API 表无说明，demo 按主题 aui3_1 置 true | 确认语义后补速查说明 |
| `Spinner.doNotFocusWhenValueUpdate` | 描述"默认会获取焦点"，未实测程序化改值是否真的抢焦点 | 若不抢焦点，`Spinner.md` 降级为可选 |
| `SelectCard.ref.getValue()` | 仅官网 API 表 methods 列出，demo 未调用 | 确认存在后保留，否则从 `SelectCard.md` 速查移除 |
| `Segmented` / `Slider` 导出 | 官网页面名与导出名不一致，index.js 未导出 `Segmented` / `Slider` | 确认真实包是否已新增同名导出；若有，两份 Reference 头部补"可用别名" |
| `Dialog.buttons[].disabled` | demo 只出现 `text / status / onClick`，`disabled` 是按"数组项即 Button props"推断 | 不生效则 `Dialog.md` 改为 onClick 内 `if (saving) return` |
| `Table.onHeaderCheck` 第二、三参 | 接口写 `(checkedRows, checked, checkedRowsData)`，demo 只用第一个 | 确认后补充 `Table.md` §4 |
| `Table` 对象行 + `keyIndex` | `keyIndex` 描述为"列索引号"，对象行时是否按 columns 顺序取第 N 列未验证 | 若不支持，`Table.md` 改为数组行 + keyIndex 或对象行不设 keyIndex |
| `Form.Item rules` 支持的规则全集 | 只列了 `FormRule.jsx` 出现的 14 个；`minLength` / `maxLength` / `rangeLength` 等 TextField 内置规则是否可用于 Form 未验证 | 确认后补进 `Form.md` §4 |
| `MessageDialog.buttons.ok` 是否有 `disabled` | 类型表只写 `text / onClick / focused` | 若有，`MessageDialog.md` 的"处理中"改用 disabled |
| `Toggle` 不传 `data` 时 `onToggle` 的参数 | demo 有 data 时回传 data 值，无 data 时 demo 直接翻转 | 确认无 data 时是否回传 boolean |
| `TreeSelect.value` 受控 | 类型表有 `value`，两个 demo 都未演示受控与重置 | 确认后补 `TreeSelect.md` §3 受控写法 |
| `Cascader` 在 Form.Item 内 | 值属性是 `selectedValue`，推断需 `valuePropName="selectedValue"`；`showCheckedStrategy` demo 有表中无 | 确认后修订 `Cascader.md` §6 / §9 |
| `InputSelect.onChange` 第三参 `type` | API 描述提及 `'input' \| 'select'`，签名未写 | 确认后补进 `InputSelect.md` 签名 |
| `Tree` 回调 `node.props.eventKey` | demo 写法；3.9.24 虚拟滚动版是否仍是组件实例未验证 | 若变为普通对象改用 `node.id` |
| `Drawer` 内 Form 的 `destroyOnClose` | 默认 false，换对象编辑是否需要 `setFieldsValue` 覆盖 | 实测后决定 Reference 是否默认推荐 `destroyOnClose` |
| `DivMessage` 自动消失后 `display` 状态 | 推断组件内部隐藏但外部 state 仍为 true，用换 key 重挂 | 确认是否会回调 `onClose`；若回调则简化写法 |
| `Loading.iconUrl` 必填 | 类型表注"必填"，demo 不传也可用 | 确认默认图标是否存在 |
| `Accordion` demo 中的表外字段 | 4 个 demo 写了 `expand={true\|false}`（API 表只有 `expanded`）；`AccordionCustomContent.jsx` 子项带 `description`（data 描述未列） | 确认两者是否生效；无效则保持 `Accordion.md` 的"不要写"，有效再补说明 |
| `Accordion.hideTitleTips` 命名 | TypeDoc 表与官网 props 表均为 `hideTitleTips`，changelog 写作 `hideTitleTip` | 以实际生效的名字修订 `Accordion.md` §9 |
| `Accordion.isControlSelectedValue` | 无 demo；开启后父节点是否仍由组件展开收起、onClick 不回写时选中态是否保持不变，均未验证 | 确认后再在 `Accordion.md` §4 补"切换前拦截"写法（目前只注明未验证，不给代码） |
| `Accordion` 外部修改 `expanded` | demo 只在 `onExpand` 里回写；外部按钮直接切换是否生效未演示（changelog 记录过"组件更新后 expanded 属性值未更新"的修复） | 确认生效后再在 `Accordion.md` §4 补外部收起按钮写法（目前不作为默认写法，§7 也未使用） |

---

## 迭代路线（2026-09-29 修订）

### 为什么调整

- **覆盖面已够用**：40 份 Reference 覆盖 48 个导出名（共 87 个），表单、表格、弹层、反馈等高频组件都在；剩余候选只有 24 个（见阶段 2），基本是长尾，其中 8 个没有官方 demo。
- **验证欠账大**：待实测 35 项未决；资料对应的组件库版本不明确（见「当前资产 · 资料版本」）；`validate_references.py` 检查结构、链接、数量和禁用写法，但不检查 prop 是否真在 TypeDoc 表里；唯一一次 OpenCode 实测首轮行为测试只过 2/5。
- **写作速度不是瓶颈**：第二至五批 34 份大约一天内写完，核验手段没有跟上。写错的 Reference 比没有更糟：没有时模型走补位流程并标 TODO，写错时模型会照抄（`TextField.md` 的短路 `refs.find` 与 OpenCode 首轮失败表现一致）。

**约束**：作者侧拿不到真实包，所有核验只能基于 `hui参考文档/` 与兼容层；使用方是 OpenCode + 国产模型（如 deepseek-v4-flash），评测必须在这个组合上跑，Reference 篇幅也要照顾小模型的阅读能力。

**顺序**：阶段 0 验证能力 → 阶段 1 横向 Pattern → 阶段 2 按需分批补组件。

---

### 阶段 0：验证能力（先于任何新组件）

- [ ] **0.1 声明资料基线**：SKILL.md 与 `project-setup.md` 写明资料对应的版本不明确，生成代码时提示用户以目标工程实际安装的 `@nce/eview-react` 版本为准；同时向资料提供方确认资料对应的版本号，确认后写入
- [ ] **0.2 待实测 35 项按三步推进**（不依赖真实包）
  - [ ] 资料内交叉核对：逐项对照 `api/` TypeDoc 表（93 份）、`demos/*/types.ts(x)`（27 份）、`__docs__/API.md`、`__demo__/`、`site-doc/change_log.md`（245KB，此前 Reference 没有引用）。已发现的线索：
    - `change_log.md` 第 2145 行："onHeaderCheck 回调函数，新增两个入参 checked,checkedRowsData，目前整体入参为 checkedRowsRef,checked,checkedRowsData" → 可据此关闭「Table.onHeaderCheck 第二、三参」并补 `Table.md` §4
    - `change_log.md` 第 76 行的依赖清单写 `@nce/icon-plus`，第 141、336 行记录了 icon-plus 依赖的引入与变更（141 行原文前后都写作 `@hui/icon-plus`，疑似笔误）→ 作为「icon+ 包名」的证据，仍需确认
    - onSearch、DivMessage、iconUrl、selectedIndex 等关键词在 changelog 里也有命中，需逐条判断是否相关（已看过的两条 RadioGroup 记录与 onChange 参数顺序无关）
  - [ ] 核不了的保持"两种解释都成立"的兼容写法，并确认每项都在对应 Reference 文件头 ⚠️ 标注（硬约束第 5 条）
  - [ ] 借使用方的真实工程确认：SKILL.md 交付自检增加"列出本页用到的待实测 API，请用户在真实工程确认"；在仓库内（不进包）写一份探针清单，每项给出最小代码和观察点，有人能接触真实包时可一次跑完；结论回填上方「待实测」表
- [x] **0.3 修掉 4 处已知文档问题**，每处配一条回归断言（2026-09-29 完成；同批还修了新发现的 3 处：`Select.md` 用 `&&` 短路校验、`Table.md` 与 `Paging.md` 请求链缺 catch。回归断言见用例 2、3、5、6、17）
  - [x] `TextField.md` §7：`refs.find((r) => !r.current.validate())` 遇到第一个失败就停，其余字段不校验 → 先对全部 ref 执行 `validate()` 收集结果，再聚焦第一个失败项
  - [x] `Checkbox.md` §7：批量删除直接执行，与 `Button.md` 反例"危险操作直接执行，没有二次确认"冲突 → 补确认与取消分支，取消后数据不变
  - [x] `project-setup.md` §2：第 70 行写"`IntlProvider` 必须包在最外层"，但官方 `rules/project-setting.md` 示例与本文第 59–60 行都是 `ConfigProvider` 在外、`IntlProvider` 在内 → 按官方示例改文字（如"`IntlProvider` 必须包住整个 App"）
  - [x] `Select.md` §7：加载中点重置时，`!region` 分支没有 `setLoadingSites(false)`，"加载中..." 文案残留；请求链没有 catch 和错误状态 → 补齐，并覆盖"加载中重置""请求失败"两种情况
- [ ] **0.4 API 溯源改为机器检查**（在作者仓库运行，不进包）
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

**完成标准**：待实测各项都有结论，或有明确的兼容写法与 ⚠️；4 处问题修完；校验脚本能拦住表外 prop；全部用例都有"加载 / 不加载 skill"的基线分数。

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

`@nce/eview-react` 共导出 87 个可导入名字（`hui参考文档/demos/index.js`），已覆盖 48 个（40 份 Reference，明细见「当前资产」）。剩余 39 个中，`ConfigProvider` 已在工程接入 Pattern 讲过，另有 14 个已排除（见下），实际候选 24 个。

**排序依据**：
1. 与 antd 习惯的差异程度：差异越大越需要 Reference；和 antd 几乎一样的组件，模型不看文档也能写对
2. 基线评测里不加载 skill 时的失败率（0.5 产出）
3. 资料完整度：有 TypeDoc 表和 demo 才写得出可信的 Reference
4. 能拿到业务代码时，用其中 `@nce/eview-react/*` 的 import 次数校准

**开批前准备**：
- [ ] 每份 Reference 加 front-matter（名称、别名、关键词、可信度、资料来源），用脚本生成 SKILL.md 组件索引、README 目录树与覆盖表、本文件资产表、validator 的 `NON_COMPONENTS` / `CHILD_TO_PARENT`，取代下方"完成后同步更新"的手工步骤；`fallback-handwrite.md` 里写死的已覆盖数量（现为"40 个已覆盖组件"）也改为引用索引（`check_counts` 查不到这一处）
- [ ] 可信度分级写入文件头与索引：**A** 真实环境确认（目前只能来自使用方反馈）；**B** TypeDoc 表与 demo 交叉一致；**C** 只有类型表，或存在未决冲突。现有 40 份基本为 B（`Steps.md` 无 TypeDoc 表，以站点 API.md 为准）
- [ ] C 级精简模板：只写文件头 ⚠️、§5 数据结构、§8 反例、§9 API，不写 §7 完整示例（没有 demo 却写完整示例等于编造用法）；validator 相应放宽 C 级的章节要求
- [ ] validator 增加篇幅告警（总行数、§7 代码行数），阈值按下方完成标准第 8 条定；已于 2026-09-29 精简 Table / Form / Checkbox / Dialog / MessageDialog（分别为 237 / 252 / 254 / 203 / 218 行），FileUpload（292 行）/ DatePicker（291 行）待精简

**候选分批**（括号内为官方 demo 数）：

- **第六批 · 表单与表格链路**（沿用原计划"表单 / 表格链路优先"）
  - [ ] `Table.md` 二期：编辑列（`renderType` / `Table.ColumnRenderType.*` / `onEdit`）、列筛选弹窗、冻结列、多级表头、虚拟滚动、导出（首期只覆盖列表页高频能力）
  - [ ] `ScrollTable.md`（2）
  - [ ] `TimePicker.md`（6）：TypeDoc 表名为 `TimeSelector`，源码文件 `Timeselect.tsx`；DatePicker 的"修正 value"问题已在其 Reference 中处理
  - [ ] `HexField.md`（2）
  - [ ] `ProgressBar.md`（8）/ `TimeLine.md`（3）：用例 16 目前靠手写补位，需求现成
- **第七批 · 反馈、弹层与导航**
  - [ ] `FormMessage.md`（3）/ `Popup.md`（1）/ `PopUpMenu.md`（6）/ `DropDown.md`（8）
  - [ ] `TreeSelector.md`（8）
  - [ ] `Anchor.md`（3）
  - [x] `Accordion.md`（6）：2026-09-29 提前完成。与 Panel / Tree / Tab 的辨析写在其 §1，`Panel.md`、`Tree.md`、`fallback-handwrite.md` 各补一行回指；新增用例 23；§9 与 TypeDoc 的 21 个 props 逐项比对一致，§7 按 TypeDoc 转写的类型声明做过 `tsc` 严格模式编译；已按完成标准第 8 条从 386 行精简到 220 行（§7 代码 178 → 87 行）
- **第八批 · 有 demo 的长尾**
  - [ ] `Carousel.md`（6）/ `BrowseButton.md`（4）/ `CategoryInput.md`（4）/ `CategorySearch.md`（4）/ `LabelField.md`（2）
- **C 级精简版 · 无 demo，只有类型表**
  - [ ] `TimeRangeSelector` / `IconButtonGroup` / `TextButton` / `Menu` / `CardGrid` / `JList` / `ScrollBar` / `Shade`

**已排除（不建）**：`DoubleSelect`、`PageMessage`、`HelpTip`、`Layout`、`GridLayout`（含 `Row` / `Col`）、`Split`、`Card`、`PagingTree`（含 `TreeDataEngine`）、`TimescaleAxis`、`LinkField` 由用户排除；`ButtonMenu` 官方废弃；`Wizards` 是 `Steps` 旧名，不单建 Reference，已在 `Steps.md` 头部对照。

**每份 Reference 的完成标准**：
1. 列清资料：TypeDoc 表、demo 文件、README，以及资料之间的矛盾
2. 按模板起草：B 级完整 9 节，C 级精简版
3. 溯源检查通过；§7 示例 `tsc` 编译通过
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

现有 23 个用例、173 条断言，按类型分为 `eview_compliance` 74 条、`behavioral` 69 条、`contains_pattern` 30 条；没有执行器，`validate_references.py` 只检查 evals.json 的结构。

- [x] 补 Form / Table 用例：已由用例 17（Table + Dialog(Form) + MessageDialog）与用例 20（Tree + Table + Drawer 表单）覆盖
- [x] 反向断言：71 条 `eview_compliance` 断言已覆盖"不从 antd 导入""不用 `type="primary"`""Select 不用 `placeholder`""不用 `e.target.checked`"等
- [x] 用例 6 的断言"逐个校验，首个失败项调用 focus()"与 `TextField.md` 的短路写法一致，会给错误实现打高分 → 已改为"先全部校验再聚焦首个失败项"，并补"端口拒绝小数、0 和 65536"（2026-09-29）。`TextField.md` §7 已同步修复（全量校验 + `isCharacterAllowed` 拦小数）
- [ ] 收编 OpenCode 实测的资源申请表单为用例 24（需求原文在 `eview-react-shadcn/artifacts/opencode-form/prompt.md`），把首轮 3 个失败点（全量校验、整数端口、重置清除校验状态）写成断言
- [x] 断言不得把待实测项写死为唯一答案：已修订用例 8（关闭页签后的激活页）、17（`keyIndex`）、20（节点主键、DivMessage 再次提示），改为按行为判定，并在断言里注明待实测项与可接受的兼容写法（2026-09-29）。以后新增断言照此执行
- [ ] 用例 13 要求 Spinner 必须传 `doNotFocusWhenValueUpdate`，而该属性是否必要仍在待实测表中；确认前可考虑降为建议项
- [ ] 原计划"在真实工程跑一遍用例"：作者侧无真实包，改为在兼容层 + 类型声明上跑全部用例（见 0.5），真实环境结论只来自使用方反馈（见 0.2）
- [ ] 自动化断言与 `validate_references.py` 的 `EVIEW_FORBIDDEN` 共用一份规则（见 0.5）

---

## 待决策

| 事项 | 现状 | 建议 |
|------|------|------|
| 业务工程里能否用 `.d.ts` 核验 | SKILL.md 与 `fallback-handwrite.md` 禁止读 `node_modules`，理由是"类型里有不等于业务里验证过" | 作者侧拿不到真实包，使用方工程里已安装包的 `.d.ts` 是唯一能接触到的真实契约。建议改为"`.d.ts` 只用于核验、不用于扩展新用法"，交付自检加一步 `tsc --noEmit`，报错以真实类型为准并反馈回「待实测」表 |
| 兼容层是否扩展 | `eview-react-shadcn` 只实现 8 个导出；资料冲突处必须自选实现（如 RadioGroup 取旧值在前），测到的是"与假设一致"而非"与真实库一致"。2026-09-29 已把 Select / RadioGroup / Radio / Checkbox / CheckboxGroup 回调的值参数按 TypeDoc 放宽为 `any`（此前多出的 `\| null` 让 OpenCode 首轮构建误报失败），首批 5 份示例在兼容层上严格编译通过 | 暂不扩展：其余组件只做 `tsc` 编译检查；等基线评测显示行为失败集中在哪些组件，再决定是否为 Form / Table / Dialog 补实现 |
| 运行时包内容 | 9 月 16 日打的包里含 `evals/`、`TODO.md` 和系统垃圾文件 | 已执行（`scripts/package_skill.py`）：只保留 SKILL.md 与 `references/`；待实测信息已写在各 Reference 文件头的 ⚠️ 中 |

---

## 执行节奏

| 阶段 | 任务 |
|------|------|
| 第一周 | 阶段 0：0.1 资料基线、0.2 资料内交叉核对与探针清单、0.3 修 4 处问题、0.4 溯源检查与类型声明、0.6 打包脚本 |
| 第二周 | 阶段 0：0.5 评测流水线与基线分数；阶段 1：`form-validation.md`；评测体系中的用例 6 修订与用例 24 |
| 第三周 | 阶段 1：`async-data.md`、`table-crud.md`；阶段 2 开批前准备（front-matter、可信度分级、C 级模板） |
| 之后 | 第六批起每批 5–7 份，按基线评测结果调整批次顺序；`theme-and-intl.md` 穿插进行 |
