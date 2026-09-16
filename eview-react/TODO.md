# eview-react Skill 迭代计划

## 当前资产

| 维度 | 数量 | 明细 |
|------|------|------|
| 组件 Reference | 39 个 | 首批：Button（含 ButtonGroup）/ TextField / Select / Checkbox（含 CheckboxGroup）/ Radio（含 RadioGroup）；第二批：TextArea / SearchInput / Steps / Tab（含 TabItem）/ FileUpload；第三批：DatePicker / Spinner / DragInput / SelectCard / Rating / Tag / Badge / Divider；第四批：Form（含 Form.Item）/ Table / Paging / Dialog / MessageDialog / Toggle（含 Switch）/ MultipleSelect；第五批：Drawer / Tree / TreeSelect / TreeTable / InputSelect / IPInput / Cascader / DivMessage / Loading（Loader 同）/ Empty / Crumbs / Panel（含 PanelItem）/ Icon（含 IconButton）/ TipBox |
| Pattern 文档 | 3 份 | `project-setup.md`（工程接入）+ `page-flows.md`（页面调用链）+ `fallback-handwrite.md`（三层判定、87 项导出核对、业务样式与手写模板、TODO 边界） |
| 通用约束与组件细则 | 分层维护 | SKILL.md 保留导入、API 溯源、校验、受控、表单托管、异步边界与编码要求；具体 props、回调签名、ref 方法及反例按组件 Reference 读取 |
| 页面调用链模板 | 16 种 | 位于 `references/patterns/page-flows.md`：登录注册 / 筛选列表 / 列表 CRUD / 多选批量 / 向导模式切换 / 级联下拉 / 表单提交 / 多步创建向导 / 多页签工作区 / 附件上传表单 / 时间范围查询条 / 参数配置表单 / 状态列表卡片 / 树 + 列表主从页 / 侧边详情编辑 / 四态内容区 |
| 评测用例 | 22 个 / 161 条断言 | 1 登录页 / 2 联动筛选条 / 3 待办批量删除 / 4 向导单选切换 / 5 新工程接入 / 6 新建用户表单统一校验与 PC 默认交付 / 7 三步创建向导 / 8 工作区页签 / 9 附件批量上传 / 10 设备搜索框 / 11 工单多行表单 / 12 报表时间范围查询条 / 13 QoS 参数配置 / 14 服务评价 / 15 告警列表状态展示 / 16 未覆盖组件手写补位（进度条 + 时间轴）/ 17 设备管理 CRUD（Table + Dialog(Form) + MessageDialog）/ 18 告警规则开关 / 19 多选筛选 + 卡片分页 / 20 组织树 + 成员表 + 抽屉 / 21 网元接入表单（Cascader + TreeSelect + InputSelect + IPInput + Panel）/ 22 概览卡片四态（Loading + Empty + IconButton） |
| 原始资料 | 856 + 2 文件 | 仓库根 `hui参考文档/`（**不随 skill 打包**，仅供写作与复核）：api 93 份 TypeDoc 表、demos 71 README + 91 API.md + 426 示例、rules 2 份、site-doc 15 份 |

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

| 项 | 现状 | 确认后动作 |
|----|------|-----------|
| `RadioGroup.onChange` 参数顺序 | 类型 `(oldValue, value, event)` vs 文档 `(value, oldValue, event)`，无 demo | 确认后把 `Radio.md` §4 的兼容写法简化为直接取值，删掉 ⚠️ |
| icon+ 包名 | `rules/project-setting.md` 写 `@nce/icon-plus`，`demos/Button/__demo__/IconPlus.tsx` 导入 `@hui/icon-plus` | 以实际工程为准后统一 `project-setup.md` §1 与 `Button.md` |
| 根 DOM 是否需要 `class="aui3_1"` | `aui_to_ict.md`（3.7.5+）要求；`f_&_q.md` 称 4.x 起默认 ICT3.1 | 确认目标版本后精简 `project-setup.md` §2 第 3 条 |
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

---

## P1 — 第二批组件 Reference（对准 NCE-Fabric"标准表格 / 表单"目标）

`@nce/eview-react` 共导出 87 个可导入名字（`hui参考文档/demos/index.js`），已覆盖 47 个（39 份 Reference）。剩余按业务频度排序：

### 已完成的第二至五批

- [x] 第二批：`TextArea.md` / `SearchInput.md` / `Steps.md` / `Tab.md`（含 `TabItem`）/ `FileUpload.md`
- [x] 第三批：`DatePicker.md` / `Spinner.md` / `DragInput.md`（页面名 Slider）/ `SelectCard.md`（页面名 Segmented）/ `Rating.md` / `Tag.md` / `Badge.md` / `Divider.md`
- [x] 第四批：`Form.md`（含 `Form.Item`）/ `Table.md` / `Paging.md` / `Dialog.md` / `MessageDialog.md` / `Toggle.md`（含 `Switch`）/ `MultipleSelect.md`
- [x] 第五批：`Drawer.md` / `Tree.md` / `TreeSelect.md` / `TreeTable.md` / `InputSelect.md` / `IPInput.md` / `Cascader.md` / `DivMessage.md` / `Loading.md`（Loader 同）/ `Empty.md` / `Crumbs.md` / `Panel.md`（含 PanelItem）/ `Icon.md`（含 IconButton）/ `TipBox.md` —— 均已过 validator；新增待实测见上表

### 表单链路（优先）

- [ ] `HexField.md` / `DoubleSelect.md`（用户已排除 DoubleSelect）
- [ ] `TimePicker.md` / `TimeRangeSelector.md`（DatePicker 已完成，FAQ 的"修正 value"问题已在其 Reference 中处理）

### 表格链路（优先）

- [ ] `Table.md` 二期：编辑列（`renderType` / `Table.ColumnRenderType.*` / `onEdit`）、列筛选弹窗、冻结列、多级表头、虚拟滚动、导出（首期只覆盖列表页高频能力）
- [ ] `ScrollTable.md`

### 反馈与弹层

- [ ] `FormMessage.md` / `Popup.md` / `PopUpMenu.md`（`PageMessage` / `HelpTip` 用户已排除；`ButtonMenu` 官方废弃不建）

### 导航与布局

- [ ] `Anchor.md`（`Wizards` 是 `Steps` 旧名，不单建 Reference，已在 `Steps.md` 头部对照）
- [ ] `Accordion.md`（`Layout` / `GridLayout` / `Split` / `Card` 用户已排除）
- [ ] `TreeSelector.md`（`PagingTree` 用户已排除）

### 其余

- [ ] `IconButtonGroup.md` / `TextButton.md` / `DropDown.md` / `Menu.md` / `BrowseButton.md`（无 demo 的 IconButtonGroup / TextButton / Menu 只能按 API 表写）
- [ ] `ProgressBar.md` / `Carousel.md` / `TimeLine.md` / `CategoryInput.md` / `CategorySearch.md` / `LabelField.md`（`TimescaleAxis` / `LinkField` 用户已排除；`JList` / `Shade` / `ScrollBar` 无 demo）

### 完成后同步更新

- [ ] SKILL.md 组件索引追加行；"当前已覆盖 N 个组件" 同步
- [ ] README.md 目录树 + 组件覆盖表
- [ ] TODO.md 资产表
- [ ] validator 的 `NON_COMPONENTS` 集合里把已建 Reference 的组件名移除

---

## P2 — Pattern 文档

- [ ] `form-validation.md`：Form `rules` 体系 vs 控件自带 `validator` 的选型；`onSuccess` / `onFailed` 收口；异步查重（防抖 + 版本号）；`validateErrorType="tip"` 与 `hintType` 关系
- [ ] `table-crud.md`（NCE-Fabric 标杆）：筛选条 + Table + Paging + Dialog 表单的完整 CRUD 调用链；`recordCount` 服务端分页；行操作列 `render`；批量勾选与 Checkbox.md 的 `Set` 模式衔接
- [ ] `theme-and-intl.md`：`aui3_1` / `aui3_1_dark` 切换、`ev_direction_rtl`、`componentsLocales` 与业务语言包合并
- [ ] `data-fetching.md`：loading / empty / error 三态、取消标记防串数据（可直接移植 ArkUI 版的四态模型）

---

## P3 — 评测体系

- [ ] 补 Form / Table 用例（第二批 Reference 落地后）
- [ ] 增加"反向断言"用例：明确要求输出中**不出现** `antd`、`type="primary"`、`<Option>`、`e.target.value`
- [ ] 在真实 `@nce/eview-react` 工程里跑一遍 6 个用例生成的代码，回收编译 / 运行报错补进硬约束（对应 ArkUI 的 P0）
- [ ] 评估是否需要 `assertions.type` 之外的自动化断言（如正则扫描生成代码），与 `validate_references.py` 的 `EVIEW_FORBIDDEN` 共用一份规则

---

## 建议执行节奏

| 阶段 | 任务 |
|------|------|
| 第一周 | 在有内网 npm 源的机器上完成「待实测」31 项；按结果修订 Radio.md / SearchInput.md / Tab.md / FileUpload.md / DatePicker.md / Spinner.md / SelectCard.md / Dialog.md / Table.md / Form.md / MessageDialog.md / Toggle.md / project-setup.md |
| 第二周 | P1 剩余（TimePicker / HexField / ProgressBar / TimeLine / PopUpMenu）+ P2 `form-validation.md` |
| 第三周 | P1 表格链路二期（Table 编辑列 / ScrollTable）+ P2 `table-crud.md` + P3 补用例 |
| 之后 | 反馈弹层、导航布局、其余组件按业务需要分批 |
