---
name: eview-react
description: >-
  为 HUI Eview React（@nce/eview-react，ICT 3.1）生成和修改组件代码，补全状态、事件、校验、联动与异常处理，并处理工程接入。
  用户要求使用 eview-react / HUI React、将设计稿或 UX-DSL 转成该组件库页面、修改已有页面或排查接入问题时使用；即使未明确要求补全逻辑，也要生成可运行的交互。
---

# HUI Eview React

只说明组件库接入、API 与交互；页面视觉样式沿用目标项目，不定义设计 token。

## 页面默认值

以下是用户交付偏好，明确指定的目标端和设计稿优先：

- 默认 PC；“自适应 / 响应式”指桌面窗口宽度变化。只有明确要求移动端、手机、H5 或明确的移动端设计任务时才做移动适配。
- 按业务信息密度组织桌面布局，支持鼠标与键盘。预览优先采用 PC 设计稿尺寸，否则用 **1440×900**，必要时检查其他桌面宽度；检查遮挡、控件可见和标签对齐，交付 PC 截图，默认不做手机截图与测试。
- 给 OpenCode 等工具的提示词沿用这些默认值，历史移动端示例不构成新需求。

## 工作流程

1. 查看 `package.json`、入口、现有页面及 Service / 数据模型 / 状态管理，复用已有接入和工程风格；新接入或接入异常时读下方工程 Pattern。
2. 按组件索引**先读对应 Reference 再写代码**；优先看文件头警告、§3–6 状态与交互、§7 完整示例、§8 反例、§9 API。只读任务涉及的组件；跨组件页面再读匹配的页面调用链。
3. 补齐五要素：**状态声明、事件处理、数据结构、组件联动、异常边界**。受控值与回调配对；表单值、options / dataset 的类型和字段按各组件定义，不能统一假设为 `text/value` 或 `label/value`。
4. 验证交互链与工程可运行性，按目标端预览；交付前执行下方自检。

## 必须遵守

- 导入用 `@nce/eview-react` 的命名导出或 `@nce/eview-react/组件名` 的默认导出；不能用源码别名 `eview-react/…` 或 antd 顶替。入口引入主题 CSS：`aui3_1.css`（浅色），运行时切深色的工程同时引 `aui3_1_dark.css` 靠根 DOM `aui3_1` / `aui3_1 aui3_1_dark` 切换（详见工程 Pattern）。确保 `ConfigProvider` / `IntlProvider` 与依赖已接入。
- **图标默认用 icon+**（`import { IconPlusIc* } from '@nce/icon-plus'` 按需引入），不用内置 `Icon name='ict_…'`（已下线）；可点击图标用 `IconButton iconName={<IconPlus* />}`，不给图标组件挂 onClick。
- **props、导出名、回调参数顺序和 ref 方法都以对应 Reference 为准，查不到不推断**；不按其他库 API 或原生 event 猜写法。资料冲突按文档兼容方案处理，保留待实测说明，不能擅自认定某一版正确。
- 校验器 `validator` 返回 `{ result, message }`，`result === true` 表示通过；提交前触发文档支持的校验。不要给没有记录 ref 方法的组件虚构 `validate()` / `getValue()`。
- 受控方式逐组件核对：尤其是 Radio 的 `isControlled`、密码回填、DatePicker 回写及 Spinner 程序化更新；具体规则在各 Reference。
- `Form.Item` 按 `name + rules` 托管，内部控件不另传 `value/onChange`；特殊取值回调按 Form 文档配置 `valuePropName/updateTrigger`，不提取 `Form.Item` 别名。
- `Form.Item` 必须是 `Form` 的直接子节点，禁止用 `div` / flex / CSS grid 包裹或模拟 antd 的 `Row/Col`：标签（渲染后的 `ev_label`）宽度与栅格由 Form 按直接子级计算，隔一层 DOM 标签就塌缩成一小截。多列在 `Form` 上设 `itemCol`（24/12/8/6），单项覆盖用 `Form.Item.col`；条件显隐逐项三元或返回 `Form.Item` 数组（React.Children 会展开，实测可行），不得用 Fragment/容器包一组（整组脱离直接子级、栅格失效）；说明文案用 `labelTip` 或放在 `Form.Item` 之间，不要连 `Form.Item` 一起包进装饰性容器。
- 弹层显隐由业务状态更新；保存成功才关闭，失败保留输入。筛选变化重置分页；父级切换清空子级；异步结果防串数据，处理 loading / error / empty，并防重复提交。
- `Dialog` 尺寸：宽按场景设（表单 480–560、详情 640–800，勿过窄/过宽），高用 `size={[宽, 'auto']}` 自适应 + `style={{ maxHeight: '80vh' }}` 限高、超出内部滚动；勿定死高度。
- 新代码用函数组件 + hooks、ES module、`const/let`、`===`、分号及 `handleXxx` 事件命名；不留调试 `console.log`。

## 组件索引

当前 39 份组件 Reference；每份保留 API、回调、状态、联动、完整示例与反例。

| 组件 / 场景 | 读取 |
|-------------|------|
| `Button` / `ButtonGroup` / 按钮 / 提交 | [references/Button.md](references/Button.md) |
| `TextField` / 输入框 / 密码框 | [references/TextField.md](references/TextField.md) |
| `Select` / 下拉 / 筛选 | [references/Select.md](references/Select.md) |
| `Checkbox` / `CheckboxGroup` / 复选 / 全选 | [references/Checkbox.md](references/Checkbox.md) |
| `Radio` / `RadioGroup` / 单选 | [references/Radio.md](references/Radio.md) |
| `TextArea` / 多行文本 / 描述 / 备注 | [references/TextArea.md](references/TextArea.md) |
| `SearchInput` / 搜索框 / 关键字 | [references/SearchInput.md](references/SearchInput.md) |
| `Steps` / 步骤条 / 向导 | [references/Steps.md](references/Steps.md) |
| `Tab` / `TabItem` / 页签 | [references/Tab.md](references/Tab.md) |
| `FileUpload` / 上传 / 附件 | [references/FileUpload.md](references/FileUpload.md) |
| `DatePicker` / 日期 / 时间范围 | [references/DatePicker.md](references/DatePicker.md) |
| `Spinner` / 数字输入 / InputNumber / 微调 | [references/Spinner.md](references/Spinner.md) |
| `DragInput` / 滑块 / Slider | [references/DragInput.md](references/DragInput.md) |
| `SelectCard` / 分段选项卡 / Segmented | [references/SelectCard.md](references/SelectCard.md) |
| `Rating` / 评分 / 星级 | [references/Rating.md](references/Rating.md) |
| `Tag` / 标签 / 状态 | [references/Tag.md](references/Tag.md) |
| `Badge` / 徽标 / 未读数 / 状态点 | [references/Badge.md](references/Badge.md) |
| `Divider` / 分割线 | [references/Divider.md](references/Divider.md) |
| `Form` / `Form.Item` / 表单 | [references/Form.md](references/Form.md) |
| `Table` / 表格 / 列表 | [references/Table.md](references/Table.md) |
| `Paging` / 分页器 | [references/Paging.md](references/Paging.md) |
| `Dialog` / 对话框 / 弹窗表单 | [references/Dialog.md](references/Dialog.md) |
| `MessageDialog` / 确认框 / 结果提示 | [references/MessageDialog.md](references/MessageDialog.md) |
| `Toggle` / `Switch` / 开关 | [references/Toggle.md](references/Toggle.md) |
| `MultipleSelect` / 多选下拉 | [references/MultipleSelect.md](references/MultipleSelect.md) |
| `InputSelect` / 可输入下拉 / 搜索选择 | [references/InputSelect.md](references/InputSelect.md) |
| `Tree` / 树 / 组织架构 | [references/Tree.md](references/Tree.md) |
| `TreeSelect` / 树形下拉 | [references/TreeSelect.md](references/TreeSelect.md) |
| `TreeTable` / 树表 / 层级表格 | [references/TreeTable.md](references/TreeTable.md) |
| `Cascader` / 级联 / 省市区 | [references/Cascader.md](references/Cascader.md) |
| `Drawer` / 抽屉 / 侧滑面板 | [references/Drawer.md](references/Drawer.md) |
| `IPInput` / IP / MAC 输入 | [references/IPInput.md](references/IPInput.md) |
| `DivMessage` / 提示条 / 操作反馈 | [references/DivMessage.md](references/DivMessage.md) |
| `Loading` / `Loader` / 加载 | [references/Loading.md](references/Loading.md) |
| `Empty` / 空态 / 无数据 | [references/Empty.md](references/Empty.md) |
| `Crumbs` / 面包屑 | [references/Crumbs.md](references/Crumbs.md) |
| `Panel` / `PanelItem` / 折叠面板 / 分组 | [references/Panel.md](references/Panel.md) |
| `Icon` / `IconButton` / 图标 / icon+ | [references/Icon.md](references/Icon.md) |
| `TipBox` / 气泡 / 悬浮说明 | [references/TipBox.md](references/TipBox.md) |

## 按需读取的 Pattern

| 何时读取 | 文档 |
|----------|------|
| 新工程接入，或依赖 / Provider / 样式 / 国际化异常 | [工程接入](references/patterns/project-setup.md) |
| 完整页面有跨组件联动：筛选列表、CRUD、表单、向导等；只读匹配的调用链 | [页面调用链（16 种）](references/patterns/page-flows.md) |
| 索引外组件，或无法从对应 Reference 找到所需能力 | [未覆盖组件：三层判定、导出清单与补位](references/patterns/fallback-handwrite.md) |

## 未覆盖组件的处理

按顺序命中即停：**组合已覆盖组件 → 复用目标工程 src/ 已有用法 → 原生 HTML/JSX 补位**。第二层只用工程已出现的 props / 回调 / 数据结构，并注释来源；导出名先核对补位 Pattern 中的清单。没有记录的能力也走此流程，不从 `node_modules` 猜 API、不用他库顶替；原始资料不随 Skill 打包。

手写前读补位 Pattern：使用业务样式和语义化元素，不借 `ev_` 内部类名；按能力边界实现并标 `TODO(eview-react)`，最终回复列明补位位置、替代方式和可核验的后续组件。

## 交付自检

- [ ] 每个导入、prop、回调及 ref 方法都有依据；受控 / Form 托管方式正确，文档中的兼容说明未遗漏。
- [ ] 五要素齐全：值能更新、按钮有效、数据结构正确、联动完整，加载 / 失败 / 空态 / 重置 / 重复提交已处理。
- [ ] 依赖、Provider、样式完整；完成适用的编译 / 运行检查及 PC 预览，交代未验证事项与所有补位。
