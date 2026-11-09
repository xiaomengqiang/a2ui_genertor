# eview-ui 组件 API 文档索引

迁移时按需查阅对应文档。组件映射总表见 [../component-mapping.md](../component-mapping.md)。

> **导入规范**：统一 `import X from '@cloudsop/eview-ui/X'` 子路径默认导入；特例（Tab/Panel/GridLayout/RangePicker）见映射表「导入规范」小节。**本目录官方文档示例里的 `import X from 'eview-ui/X'` 是简写**——真实包名是 scoped 的 `@cloudsop/eview-ui`，写代码时必须带前缀。
> **不使用**：`PopUpMenu`（文档标注废弃）、`IconButton`（废弃）、`SvgIcon`（废弃，推荐 Icon）、`Carousel`（Under Development，慎用）、`TimeRangeSelector`（在开发中）。列表中标注 ⛔。

## 表单与输入

| 组件 | 文档 | 用途（antd 对应） |
|------|------|-------------------|
| TextField | [TextField.md](TextField.md) | 单行文本（Input/Input.Password） |
| TextArea | [TextArea.md](TextArea.md) | 多行文本（Input.TextArea） |
| SearchInput | [SearchInput.md](SearchInput.md) | 搜索输入（Input.Search） |
| InputSelect | [InputSelect.md](InputSelect.md) | 自动补全（AutoComplete） |
| SelectPro | [SelectPro.md](SelectPro.md) | 受控下拉（Select；single/singleSearch/multiple/multiSearch） |
| MultipleSelect | [MultipleSelect.md](MultipleSelect.md) | 多选下拉（Select mode="multiple"） |
| SelectCard | [SelectCard.md](SelectCard.md) | 单选块（Radio.Button/Segmented） |
| Checkbox | [Checkbox.md](Checkbox.md) | 复选框（Checkbox） |
| CheckboxGroup | [CheckboxGroup.md](CheckboxGroup.md) | 复选组（Checkbox.Group） |
| Radio | [Radio.md](Radio.md) | 单选（Radio） |
| RadioGroup | [RadioGroup.md](RadioGroup.md) | 单选组（Radio.Group） |
| Toggle | [Toggle.md](Toggle.md) | 开关（Switch） |
| DragInput | [DragInput.md](DragInput.md) | 滑块（Slider） |
| Rating | [Rating.md](Rating.md) | 评分（Rate） |
| DatePicker | [DatePicker.md](DatePicker.md) | 日期选择（DatePicker；RangePicker 为其静态属性） |
| TimePicker | [TimePicker.md](TimePicker.md) | 时间选择（TimePicker，time 数字数组） |
| TimeSelector | [TimeSelector.md](TimeSelector.md) | 旧式时间选择（TimeSelector，amPm） |
| ⛔ TimeRangeSelector | [TimeRangeSelector.md](TimeRangeSelector.md) | 时间线式范围选择（在开发中，勿用） |
| Spinner | [Spinner.md](Spinner.md) | 数字步进（InputNumber） |
| FileUpload | [FileUpload.md](FileUpload.md) | 文件上传（Upload） |
| ColorPicker | [ColorPicker.md](ColorPicker.md) | 颜色选择（ColorPicker） |
| CategoryInput | [CategoryInput.md](CategoryInput.md) | 分类+输入组合（无 antd 对应） |
| CategorySearch | [CategorySearch.md](CategorySearch.md) | 分类+搜索组合（无 antd 对应） |
| HexField | [HexField.md](HexField.md) | 十六进制输入（无 antd 对应） |
| IPInput | [IPInput.md](IPInput.md) | IP 输入（ict-coder IPInput 对应物之一） |
| IPAddress | [IPAddress.md](IPAddress.md) | IP 输入新版（onChange 单参） |
| BrowseButton | [BrowseButton.md](BrowseButton.md) | 浏览按钮+输入（无 antd 对应） |
| FormPro | [FormPro.md](FormPro.md) | 表单容器（antd Form/Form.Item → FormPro/FormItem；旧 Form 弃用无文档） |
| FormMessage | [FormMessage.md](FormMessage.md) | 表单内联提示（表单校验文案） |
| LabelField | [LabelField.md](LabelField.md) | 标签字段（Descriptions 键值行轻量替代） |
| GridLayout | [GridLayout.md](GridLayout.md) | Row/Col 栅格（Row/Col，无响应式） |

## 数据展示

| 组件 | 文档 | 用途（antd 对应） |
|------|------|-------------------|
| TablePro | [TablePro.md](TablePro.md) | 表格（Table，**唯一映射**：rowKey/dataIndex/selection 同构 antd；旧 Table 弃用无文档） |
| Tab | [Tab.md](Tab.md) | 标签页（Tabs/TabPane，TabItem + selectedIndex 下标） |
| Tree | [Tree.md](Tree.md) | 树（Tree，data 节点 {id, text}） |
| TreeTable | [TreeTable.md](TreeTable.md) | 树表格（数据包在行 data 字段里） |
| TreeSelect | [TreeSelect.md](TreeSelect.md) | 树选择（TreeSelect，treeProps 下钻） |
| DoubleSelect | [DoubleSelect.md](DoubleSelect.md) | 穿梭框（Transfer，items/selectedItems 双数组） |
| JList | [JList.md](JList.md) | 可选列表（List 选中态场景） |
| Tag | [Tag.md](Tag.md) | 标签（Tag，仅 ICT 3.1） |
| Card | [Card.md](Card.md) | 卡片（Card，type resource/detail/add） |
| CardGrid | [CardGrid.md](CardGrid.md) | 卡片网格（Card.Grid） |
| TimeLine | [TimeLine.md](TimeLine.md) | 时间线（Timeline，导出名大写 L） |
| ProgressBar | [ProgressBar.md](ProgressBar.md) | 进度条（Progress，percent→current） |
| LabelField | —（见表单组） | Descriptions 键值行 |
| Split | [Split.md](Split.md) | 可拖拽分栏（非 Space 对应物） |
| ScrollBar | [ScrollBar.md](ScrollBar.md) | 滚动条容器 |

## 反馈

| 组件 | 文档 | 用途（antd 对应） |
|------|------|-------------------|
| DialogPro | [DialogPro.md](DialogPro.md) | 对话框（Modal，无 buttons 自写 footer；旧 Dialog 弃用无文档） |
| MessageDialogPro | [MessageDialogPro.md](MessageDialogPro.md) | 消息框（Modal.confirm：受控 + 静态方法；旧 MessageDialog 弃用无文档） |
| Drawer | [Drawer.md](Drawer.md) | 抽屉（Drawer，visible） |
| DivMessage | [DivMessage.md](DivMessage.md) | 内联消息（Alert/message，display + disposeTimeOut） |
| PageMessage | [PageMessage.md](PageMessage.md) | 页面公告条（notification，无显隐 prop） |
| Loader | [Loader.md](Loader.md) | 加载（Spin，isOpen + type global/local/micro） |
| Shade | [Shade.md](Shade.md) | 遮罩（isShow） |
| Popup | [Popup.md](Popup.md) | 下拉列表弹层（无 antd 直接对应，Dropdown 内部物） |
| PopConfirm | [PopConfirm.md](PopConfirm.md) | 气泡确认（Popconfirm，仅 ICT 3.1） |
| Tooltip | [Tooltip.md](Tooltip.md) | 提示（Tooltip，title→content；trigger="click" 当 Popover） |
| TipBox | [TipBox.md](TipBox.md) | 静态浮层提示（display 默认 true） |
| HelpTip | [HelpTip.md](HelpTip.md) | 问号帮助提示（iconDisplay） |

## 通用

| 组件 | 文档 | 用途（antd 对应） |
|------|------|-------------------|
| Button | [Button.md](Button.md) | 按钮（Button，status + text） |
| ButtonGroup | [ButtonGroup.md](ButtonGroup.md) | 按钮组（Button.Group，data 驱动） |
| ButtonMenu | [ButtonMenu.md](ButtonMenu.md) | 下拉按钮（Dropdown.Button） |
| TextButton | [TextButton.md](TextButton.md) | 文本按钮（Button type="text"/"link"） |
| LinkField | [LinkField.md](LinkField.md) | 文字链接（Typography.Link，children/text + href） |
| ⛔ IconButton | [IconButton.md](IconButton.md) | 图标按钮（废弃，不用） |
| IconButtonGroup | [IconButtonGroup.md](IconButtonGroup.md) | 图标按钮组（data 驱动） |
| Icon | [Icon.md](Icon.md) | 图标（name 体系——**本 skill 保留源 Icon shim，不迁移到此组件**） |
| ⛔ SvgIcon | [SvgIcon.md](SvgIcon.md) | SVG 图标（废弃，不用） |
| ConfigProvider | [ConfigProvider.md](ConfigProvider.md) | 全局配置（locale zh / version aui3 / theme lightday-evening） |
| performanceDesc | [performanceDesc.md](performanceDesc.md) | 组件性能规格（数据规模上限），非组件 |

## 导航与布局

| 组件 | 文档 | 用途（antd 对应） |
|------|------|-------------------|
| Layout | [Layout.md](Layout.md) | 布局（Layout，type full/horizontal/vertical） |
| Menu | [Menu.md](Menu.md) | 菜单（Menu，children 驱动，selectable 默认 false） |
| Accordion | [Accordion.md](Accordion.md) | 侧边导航（Menu items 数组 → data，主映射） |
| Crumbs | [Crumbs.md](Crumbs.md) | 面包屑（Breadcrumb，seprator 拼写） |
| Dropdown | [Dropdown.md](Dropdown.md) | 下拉菜单（Dropdown，**antd 高度同构**：overlay/trigger/placement） |
| Wizards | [Wizards.md](Wizards.md) | 步骤条（Steps，currentStep 对应 data[].value） |
| Paging | [Paging.md](Paging.md) | 分页（Pagination，recordCount 必传） |
| PagingTree | [PagingTree.md](PagingTree.md) | 分页树（大数树虚拟化，TreeDataEngine） |
| ⛔ Carousel | [Carousel.md](Carousel.md) | 走马灯（Under Development，慎用） |
| ⛔ PopUpMenu | [PopUpMenu.md](PopUpMenu.md) | 弹出菜单（废弃，不用） |

> **无 eview-ui 对应的 antd 组件**（手写，见 [../handwrite-templates.md](../handwrite-templates.md)）：Space、Divider、Typography、Badge、Empty、Descriptions（LabelField 轻量替代）、Statistic、Skeleton、Avatar、Result、Affix、BackTop、Mentions、Cascader、Image、Breadcrumb.Item（拍平 data）。
> **Pro 优先原则**：Select→SelectPro、Table→TablePro、Modal→DialogPro、Modal.confirm→MessageDialogPro、antd Form→FormPro——旧版组件（Select/Table/Dialog/MessageDialog/Form）不使用，导入即违规（check-imports.cjs LEGACY_PRO_USED）。
