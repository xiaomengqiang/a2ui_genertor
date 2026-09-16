# Pattern：页面级调用链

只在页面涉及跨组件联动时读取，选择匹配的行组织业务逻辑；这些是页面组织模板，不新增组件 API，具体签名与限制仍以对应 Reference 为准。

| 页面模式 | 涉及组件 | 调用链骨架 |
|---------|---------|-----------|
| 登录 / 注册页 | [TextField](../TextField.md) + [Checkbox](../Checkbox.md) + [Button](../Button.md) | 输入 → `validator` 逐字段校验 → 协议勾选解锁按钮 → 提交 `disabled` 防重复 → 失败提示 |
| 筛选列表页 | [SearchInput](../SearchInput.md) + [Select](../Select.md) + [Table](../Table.md) | 关键字 `onSearch` 防抖 + 版本号 → 筛选变化 → `page=1` → 请求 → `enableLoading` / `emptyTableMsg` → Table 后台分页 + `disableEviewSort` 后台排序 |
| 列表 CRUD 页 | [Table](../Table.md) + [Dialog](../Dialog.md)([Form](../Form.md)) + [MessageDialog](../MessageDialog.md) | 操作列 `render` 按钮 → 新建 / 编辑打开 `Dialog`，确定调 `formRef.submit()` → `onSuccess` 请求成功才关窗刷新 → 删除走 `MessageDialog type="confirm"`，`ok.onClick` 成功后关窗 + 刷新 + `success` 反馈 |
| 多步创建向导 | [Steps](../Steps.md) + [TextField](../TextField.md) + [Select](../Select.md) + [Button](../Button.md) | `currentStep={data[i].value}` → 每步控件 `ref.validate()` 通过才 `i+1` → 最后一步汇总提交 → 失败步 `status:'error'` 并跳回 |
| 多页签工作区 / 详情页 | [Tab](../Tab.md) + [TabItem](../Tab.md) + [Table](../Table.md) / [Form](../Form.md) | `selectedIndex` 受控 → `onClick` 首次进入才请求（`Set` 记录已加载）→ `onClose` 移除数组并修正下标 → 未保存先确认 |
| 附件上传表单 | [FileUpload](../FileUpload.md) + [TextArea](../TextArea.md) + [Button](../Button.md) | 选文件 → `handleSubmit` 业务发请求 → 按文件名回写进度 / 状态 → `fail` 走 `onReload` 重传 → 全部 `success` 才解锁提交 |
| 时间范围查询条 | [DatePicker](../DatePicker.md)(range) + [SelectCard](../SelectCard.md) + [Select](../Select.md) + [Button](../Button.md) | 粒度 SelectCard 切换 `type/format` 并清空已选 → 范围 `onOkClick` 取 `fromDateObj/toDateObj` → 合并筛选参数 `page=1` 请求 → 空态 |
| 参数配置表单 | [Spinner](../Spinner.md) + [DragInput](../DragInput.md) + [SelectCard](../SelectCard.md) + [Checkbox](../Checkbox.md) + [Button](../Button.md) | 开关 Checkbox 控制 `disabled` → Spinner 有效值算派生量 / `onInputError` 锁提交 → DragInput 数组值与输入框互相钳制 → 重置用 `doNotFocusWhenValueUpdate` |
| 状态列表 / 卡片 | [Badge](../Badge.md) + [Tag](../Tag.md) + [Divider](../Divider.md) + [Icon](../Icon.md) | 业务状态码 → 统一映射表 → `Badge status/text` 或 `Tag color` → 筛选 Tag `fill` 切换选中 → 列表过滤 |
| 树 + 列表主从页 | [Tree](../Tree.md) + [Table](../Table.md) + [Crumbs](../Crumbs.md) | 左树 `enableMultiSelect={false}` `onSelect` → 右表 `page=1` 按节点请求 → 面包屑随选中路径派生 → 搜索 `findLevelNodes` 展开定位 |
| 侧边详情 / 编辑 | [Table](../Table.md) + [Drawer](../Drawer.md)([Form](../Form.md)) + [DivMessage](../DivMessage.md) | 行操作 → `setCurrent` + `visible=true` → `setFieldsValue` 回填 → 底部自写按钮 `submit()` → 成功关抽屉 + `DivMessage` 反馈 |
| 四态内容区 | [Loading](../Loading.md) + [Empty](../Empty.md) + [DivMessage](../DivMessage.md) | `loading` 局部遮罩（父容器 relative）→ 成功无数据 `Empty type="success"` / 失败 `type="fail"` + 重试 → 操作结果 `DivMessage` 换 key 重挂 |
| 多选批量操作 | [Checkbox](../Checkbox.md) + [Button](../Button.md) | 逐行勾选 → `Set` 计数 → 表头全选 / 半选派生 → 批量按钮解锁 → 确认 → 删除后同步集合 |
| 向导 / 模式切换 | [RadioGroup](../Radio.md) + [TextField](../TextField.md) + [Button](../Button.md) | `isControlled` 单选 → 条件渲染区块 → 切走清空隐藏字段 → 提交校验 |
| 级联下拉 | [Select](../Select.md) × 2 | 父级 `onChange` → 清空子级 → 异步加载子级 `options`（带取消标记防串数据） |
| 表单提交页 | [Form](../Form.md) + [Form](../Form.md).Item + [TextField](../TextField.md) / [Select](../Select.md) / [MultipleSelect](../MultipleSelect.md) / [Toggle](../Toggle.md) / [DatePicker](../DatePicker.md) | `initialValues` → `rules` 统一校验 → 按钮 `ref.submit()` → `onSuccess` 提交（防重复）/ `onFailed` 提示 → 编辑回填用 `setFieldsValue` |
