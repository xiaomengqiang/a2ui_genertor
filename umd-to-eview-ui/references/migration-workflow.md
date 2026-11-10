# 迁移工作流（详细步骤）

> 本文件是 SKILL.md 步骤 5-8 的详细展开。步骤 1-4（搭骨架 / 提取 UMD / 搬代码 / import 验证）见 SKILL.md 与 [umd-structure.md](umd-structure.md)。
> 本 skill 的映射差异基于 eview-ui 官方文档推导（未实测），标注「需实测」的条目首轮迁移必须验证并回填。

## 步骤 5：评估 + 生成迁移计划

### 5.1 读状态文件

目标工程根必有 `.umd-conversion.json`（步骤 2 `extract-umd.cjs` 生成）。**无此文件说明步骤 2 未执行**，先补跑。

读以下字段：
- `antdComponents`（keys = 迁移清单）
- `iconCallSites` / `chartCallSites`（图标/图表调用点——本 skill **保留不迁**，仅用于确认它们的存在与 import 路径正确性）
- `ipInputCallSites`（ict-coder 内置 IPInput 手写共享件调用点——A 类注入迁移行）
- `verification.relativeImports`（应为 `PASS`——步骤 4 已修正路径）
- `sourceCssColors` / `sourceCssTokens`（步骤 8 色值/token 检查的对照快照）
- `i18nScenario`（步骤 3 的 i18n 接线状态：`wired=true` 即 scenario A/B 已接线）

### 5.2 跑 build-migration-plan.cjs（生成 eview-ui 版迁移计划）

```bash
node <本 skill 目录>/scripts/build-migration-plan.cjs <目标工程根>
```

脚本读 `.umd-conversion.json` 的 `antdComponents` + 各组件文档的「antd 迁移注意事项」区块（`references/components/<Name>.md` 三列表）与 `handwrite-templates.md` 头部 B 类索引表，对每个 antd 组件匹配映射行，写入 `.umd-conversion.json` 的 **`migrationPlanEui`** + **`globalRefEui`**（拼写异常 + 回调签名 + 显隐 prop 三张速查表；人读版在 [components/INDEX.md](components/INDEX.md) 文末）。

`migrationPlanEui` 每项结构：

```json
{ "antd": "Button", "category": "A", "eview": "Button", "importPath": "@cloudsop/eview-ui/Button",
  "keyDiffs": "注意事项表原文差异摘要", "ref": "components/Button.md", "files": ["src/views/AppShell.jsx"] }
```

类别：**A** = 有对应（改导入 + props，见 §7.1）；**B** = 无对应（手写，见 §7.2）；**P** = 保留不迁（Icon shim / Chart，见 §5.3——调用点零改动，仅校验 import 路径）。

后续步骤直接读 `migrationPlanEui` 作为分类评估清单，**无需手动通读各组件 md 的注意事项区块**；A 类组件按 `ref` 读 `components/<Name>.md`（迁移注意事项与完整 API 同文件），B 类按 `ref` 读 [handwrite-templates.md](handwrite-templates.md)，P 类不动。

### 5.3 图标与图表：保留策略

- **图标**：`iconCallSites` 列出的调用点**零改动**。`import Icon from '@/shared/Icon'` 保持；不转 eview-ui `Icon`/`SvgIcon`/`IconButton`；不往 eview-ui 组件的 `leftIcon`/`rightIcon`/`icon`（url 字符串 prop）塞 ReactNode。步骤 8 仅 `check-imports.cjs` 校验路径。
- **图表**：`chartCallSites` 列出的 `<Chart>` 调用点**零改动**（含其共享封装 import）；不补 `a2ui`/`theme`；暗色跟随由源逻辑自理。

### 5.4 eview-ui 样式接入（已确认）

scaffold 的 `main.jsx` 第 3 行已落实：`import '@cloudsop/eview-ui/style/aui3.1.less';`（.less 走 vite.config.js 的 less 预处理 + TildeFileManager `~` 导入支持）。**无需再确认路径、不要改成其他写法**。若内网实测发现该路径解析失败，再与用户核实包内样式目录结构。

## 步骤 6：黑白主题接线核对

黑白主题机制（**实测**）是**双轨**，且已全部由 scaffold 预制、步骤 3 完成接线，本步骤只核对不写代码：

- ① html 轨：`document.documentElement.classList.toggle('dark', isDark)`——自定义 token 四层跟随（ThemeProvider 内置）
- ② ConfigProvider theme 轨：`theme={isDark ? 'evening' : 'lightday'}` + `version="aui3-1"`——**组件库内部自行切换暗色**，不需要手写 body `data-theme` / `eviewui_aui3_1_*` 类切换，不需要 listenTheme

步骤 3 完成后的目标结构：

```jsx
// main.jsx（步骤 3 已接线）
import { AppProvider } from './context.jsx';
import { ThemeProvider } from './theme/useTheme';

<IntlProvider locale={locale} messages={{/* 业务包 */}}>
    <AppProvider>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </AppProvider>
</IntlProvider>
```

```jsx
// src/theme/useTheme.jsx（步骤 3 已改为消费 useApp——scaffold 出厂是自持演示态）
import ConfigProvider from '@cloudsop/eview-ui/ConfigProvider';
import { useApp } from '../context.jsx';

export const ThemeProvider = ({ children }) => {
    const { isDark } = useApp();
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);   // ① html 轨
    }, [isDark]);
    return (
        <ConfigProvider
            locale="zh"                                            // ⚠ 默认 en，必传
            version="aui3-1"
            theme={isDark ? 'evening' : 'lightday'}                 // ② 组件轨，禁止静态字符串
        >
            {children}
        </ConfigProvider>
    );
};
```

核对清单：
- main.jsx：`AppProvider` 包在 `ThemeProvider` 外层（useApp 需要 context）；全工程**只有一个** ConfigProvider——业务代码里再出现即错（步骤 3 删除 antd ConfigProvider 后不允许另写）
- ConfigProvider **不进叶子组件**；Dialog 等 portal 经 createPortal 仍在 React 树内 context 可达；**`MessageDialogPro.confirm()` 等静态调用脱离 context**（文档警告）——命令式弹窗优先用受控 `MessageDialogPro`
- 核对不过 → 回步骤 3 子 agent 修；缺 html 轨或 theme 静态 → `check-dark-mode.cjs` / `check-provider.cjs` FAIL

## 步骤 7：逐组件替换

> 本节为步骤 7 子 agent 的执行参考（派发模板与计划文件提取见 SKILL.md 步骤 7）。

### 7.1 A 类（有对应）：改导入 + props

对每个 A 类组件，执行：
1. 改导入：用 `migrationPlanEui` 的 `importPath`（4 个特例看 [components/INDEX.md](components/INDEX.md) 导入规范）
2. 改 props/回调/数据格式：按 `keyDiffs` 逐项替换；拼写异常查 `globalRefEui.spellingAnomalies`，回调签名查 `globalRefEui.callbackSignatures`，显隐 prop 查 `globalRefEui.visibilityProps`
3. 按 `ref` 读 `components/<Name>.md` 查完整 API（keyDiffs 是差异摘要，非完整 API；注意事项区块与 API 同文件）
4. **API 表查不到的 props 一律不写**（宁缺勿编）

### 7.2 B 类（无对应）：手写补位

1. 读 [handwrite-templates.md](handwrite-templates.md) 取模板（Space/Divider/Badge/Empty/Cascader/Statistic/Avatar/复杂 Layout）
2. 样式用源项目 CSS 变量（token 层保留）
3. 加 `// TODO(eview-ui)` 注释，最终回复列出手写清单

### 7.3 模式转换组件详解（高频坑，替换时对照）

**Steps → Wizards**（多步向导）：
- `current={i}` → `currentStep={data[i].value}`（**对应 data 项的 value，不是下标**；不配 value 时序号默认 1,2,3…但回跳依赖 value 唯一——**建议 data 显式配 value**）
- `items=[{title, description}]` → `data=[{text, value, description?}]`
- `onChange(current)` → data 项级 `onStepClick(index)`
- `size="small"` → `size="small"`（同名但档位整体偏移：antd default/small ≈ eview-ui medium/small）
- `direction="vertical"` → `orientation="vertical"`；`progressDot`/`labelPlacement` 无对应丢弃

**Modal → DialogPro**（CRUD 弹窗；**唯一——旧 Dialog 弃用**）：
- `open` → `isOpen`；`onCancel` 关闭逻辑并进 `onClose(event)`（**不自动关闭，必须 `setIsOpen(false)`**）
- **footer 自写**（DialogPro 无 buttons prop）：children 末尾排按钮行 + 自己的关闭逻辑——`<div style={{display:'flex',justifyContent:'flex-end',gap:'12px'}}><Button text="取消" onClick={() => setIsOpen(false)}/><Button text="确定" status="primary" onClick={handleOk}/></div>`
- `title` → `customHeader`（ReactNode）；`content` → children
- `width={520}` → `size={[520, 'auto']}`（**建议偶数**）
- **模态必须居中**（AUI 规范——不传 position）
- **`destroyOnClose` 默认 true**（antd false——若源项目依赖关闭后保留 DOM 状态，显式 `destroyOnClose={false}`）
- `Modal.confirm()` → `MessageDialogPro`（**唯一**）：受控形态（`type` 必填 7 枚举 + `isOpen` + `buttons={ok:{...}, cancel:{...}}` **对象** + `onClose` 手动关）；命令式用 `MessageDialogPro.confirm(config)` 静态（返回引用 `update`/`destroy`；**脱离 context**，3.1+ 必须传 `version`）——**命令式弹窗优先受控形态**

**Tabs → Tab**：
- `<TabPane tab="标题" key="a">内容</TabPane>` → `<TabItem title="标题">内容</TabItem>`
- `activeKey="a"` → `selectedIndex={0}`（**key→下标映射**，需要时建 `tabs.findIndex(t => t.key === activeKey)` 转换）
- `onChange(key)` → `onClick(index, title, event)`（回调里用 index 反查 key）
- **`draggable` 默认 true**——页面标签不该拖动时显式 `draggable={false}`
- **遍历生成 TabItem 数据源判空**：`(tabs || []).map(...)`——children 空数组/null 会崩（白屏）
- `tabBarExtraContent`/`type="card"` 无对应（手写）

**Collapse → Panel**：
- `import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**解构，直接 `import Panel from '@cloudsop/eview-ui/Panel'` 会拿到非组件对象**）
- `<Panel header="标题" key="1">内容</Panel>` → `<PanelItem title="标题">内容</PanelItem>`
- `defaultActiveKey={['1']}` → `selectedIndex={[0]}`（**key→下标数组映射**）；`accordion` → `enableMultiExpand={false}`（**语义取反**）
- `onChange(key)` → `onExpand(selectedIndex, event)`（index→key 反查）
- 受控展开一律走 Panel 的 `selectedIndex`（**PanelItem `expanded` 是单项非受控初始态**，不响应后续切换）

**Menu（items 数组）→ Accordion**（侧边导航主映射）：
- `items=[{key, label, children}]` → `data=[{value, title, children}]`（**嵌套 children 里逐层映射，勿留 antd 字段名**）
- `selectedKeys={['dashboard']}` → `selectedValue="dashboard"`（数组→单 string）
- `onClick={({key}) => ...}` → `onClick={(node) => ...}`（**node 是 data 项原始对象**，取 `node.value`）
- `defaultOpenKeys` 同名；`mode="inline"` 折叠态 → `expanded`/`onExpand(flag)`
- 单层平铺菜单：`data` 无 children + `enableExpand={false}`
- 需 checkbox 多选/复用 antd 心智时用 eview-ui `Menu`（children 驱动 + **`selectable` 必须显式 true** + `onOpenChange`→`onOpenKeysChange`）

**Table → TablePro**（**唯一——旧 Table 弃用，有 Pro 版**）：
- `dataSource` → `dataset`；`rowKey="id"` 同名保留；`columns[].dataIndex` 同名保留（同构 antd）
- `rowSelection={type, selectedRowKeys, onChange}` → `selection={type, selectedRowKeys, onChange(selectedRowKeys, selectedRows)}`
- `pagination={total, current, pageSize, onChange}` → `pagination={recordCount, currentPage, pageSize}` + 翻页回调拆 `onPageChange(currentPage)` / `onPageSizeChange(pageSize)`（TablePro 的 `onChange(currentDataset, changeEvent)` 也会触发——别重复处理）
- `expandable.expandedRowRender` → `expansion.expandedRowRender`
- **`columnResizable` 默认 true**（列宽拖拽）——源 antd 无拖拽且不需要时显式 `columnResizable={false}`
- `sorter`/`fixed`/`render(text, record, pageIndex, index)` 同构保留（render 第 3/4 参是页索引/页内索引，**与 antd 的 (text, record, index) 不同**——只用前两参最稳）
- **旧 Table 不使用**（导入即违规，check-imports LEGACY_PRO_USED）——源项目需要单元格编辑/虚拟滚动时查 TablePro 对应能力，无则手写；树表用独立组件 `TreeTable`
- `emptyText` → `emptyOptionsMsg`（TablePro）

**Tree → Tree**：
- `treeData` → `data`；节点 `title`→`text`、`key`→`id`（嵌套逐层）
- `checkable` → `enableCheckbox`（默认 false 显式开）；**`enableMultiSelect` 默认 true**——单选树显式 `enableMultiSelect={false}`
- `onCheck(checkedKeys, info)` → `onCheck(checkedKeys, node)`；`onExpand` 必须接（否则点箭头展开不了）
- 父子勾选联动断开：`disabelCheckAssociated`（拼写）

**TimePicker → TimePicker**（值形态转换）：
- `value={dayjs('13:02:03','HH:mm:ss')}` → `time={[13, 2, 3]}`（**数字数组 [时,分,秒]**）
- `onChange(time)` 里 `time.valueOf()` 之类 dayjs 调用 → 直接用 `time` 数组（`time.join(':')` 拼 string 或重组）
- `format="HH:mm:ss"` → `format="hh:mm:ss"`（**小写 h**）；`use12Hours` → `use12HrClock`
- dayjs ↔ 数组转换工具：`dayjs().format('HH:mm:ss').split(':').map(Number)`

**Slider → DragInput**：
- `value={30}` → `value={[30]}`（**恒数组**）；`range` 场景 `value={[min, max]}` + `type="range"`
- `marks={{0:'0', 50:'50'}}` → `markIndexes={[0, 50]}`（**纯数字数组、递增**；文字标签无对应）
- `onChange(value)` → `onChange(value, changeValue)`（value 是数组）
- **无 disabled**——禁用场景外层拦截

**Upload → FileUpload**：
- antd `action`/自动上传 → **自己发请求**：`handleSubmit={({event, data}) => {/* fetch */}}`
- 上传状态回写：`fileUploadStatus={{[文件名]: 'loading'|'fail'|'success'}}`、进度 `updateProgressStatus={{[文件名]: '50'}}`
- 拼写：`disable`、`placeHolder`、`upLoadErrorMessage`/`upLoadSuccessMessage`

**message.success() → DivMessage**：
- 无命令式；`<DivMessage display type="success" text="...">` 受控渲染；自动消失 `disposeTimeOut`（默认 0 不消失）
- **浮层抽离**：DivMessage 触发父组件重渲染会打掉输入组件焦点（TextField/Select 等输入组件的已知焦点竞争问题）——通知浮层独立组件 + 自己的 state

### 7.4 替换顺序

叶子先、容器后、布局最后（改动小→大，逐步可验证）：
1. **叶子**：Button/TextButton、TextField/TextArea/Select/MultipleSelect、Checkbox/Radio、Toggle、Spinner、DatePicker、TimePicker、Tooltip、Tag
2. **容器**：Dialog/MessageDialog、Drawer、Tab、Panel、Table(TablePro)、Tree、Wizards
3. **布局**：Accordion/Menu、Crumbs、Layout/Split、GridLayout

**每替换一个组件后立即 grep 残留**：`grep -rn "from 'antd'" src/` 递减到 0。

## 步骤 8：验证（机器兜底门禁）

**测试结果文件**（主 agent 判定依据）：`<目标工程根>/.eview-ui-migration-result.json`，结构：

```json
{
  "status": "PASS" 或 "FAIL",
  "round": 1,
  "failures": ["失败点 1"],
  "checks": {
    "imports": "PASS/FAIL",
    "select-options": "PASS/FAIL",
    "provider": "PASS/FAIL",
    "dark-mode": "PASS/FAIL",
    "visibility": "PASS/FAIL",
    "wizards": "PASS/FAIL",
    "crumbs": "PASS/FAIL",
    "table-defaults": "PASS/ADVISORY_ANNOTATED/FAIL",
    "css": "PASS/ADVISORY_ANNOTATED/FAIL",
    "token-drift": "PASS/ADVISORY_ANNOTATED/FAIL",
    "menu": "PASS/ADVISORY_ANNOTATED/FAIL",
    "npm-install": "PASS/FAIL/SKIP"
  },
  "advisoryReviews": { "tableDefaults": [], "css": [], "tokenDrift": [], "menu": [], "wizards": [] },
  "notes": "覆盖范围与 SKIP 原因说明"
}
```

**必跑脚本**（`node <本 skill 目录>/scripts/check-X.cjs <目标工程根>`）：

| 脚本 | 检查 | 级别 |
|------|------|------|
| `check-imports.cjs` | `from 'antd'`/`@ant-design/icons`/`@nce/eview-react` 残留；eview-ui 导入规范（默认导入形态 + 4 特例）；`@/shared/Icon` shim 路径 | 硬 FAIL |
| `check-select-options.cjs` | options/data 项 `label` 残留（Select/MultipleSelect/InputSelect/SelectPro/SelectCard/CheckboxGroup/RadioGroup/CategoryInput/CategorySearch/Popup/ButtonMenu——eview-ui 全家 `text`） | 硬 FAIL |
| `check-provider.cjs` | ConfigProvider 存在 + `locale="zh"` + `version="aui3-1"` + `theme` 响应式派生（含 `isDark`/`evening`/`lightday`） | 硬 FAIL |
| `check-dark-mode.cjs` | 黑白主题双轨：html `.dark` 轨 + ConfigProvider theme 轨（响应式）+ `aui3_1_dark` 旧轨已删 | 硬 FAIL |
| `check-visibility.cjs` | 显隐 prop 张冠李戴：Dialog/MessageDialog/Loader 用了 `visible=`/`display=`；Drawer/Tooltip 用了 `isOpen=`/`display=`；DivMessage 用了 `isOpen=`/`visible=` | 硬 FAIL |
| `check-wizards.cjs` | Steps 残留形态（`current=`、`items=`、`Steps.Step`、`<Steps`）；Wizards `currentStep` 是数字下标直接量（疑似传了 index 非 data[].value） | 硬 FAIL |
| `check-crumbs.cjs` | Breadcrumb 残留（`items=`/`<Breadcrumb`/`separator=` 正确英文残留——eview-ui 是 `seprator`）；Crumbs data 项 `href`/`path` 残留（应为 `url`） | 硬 FAIL |
| `check-table-defaults.cjs` | TablePro 反向坑：`dataSource=` 残留（应 `dataset`）、`rowSelection=` antd 形态残留（应 `selection` 对象）、`columnResizable` 默认 true 未显式处理 | `dataSource` 硬 FAIL；其余 advisory（须逐条回应） |
| `check-css.cjs` | 色值漂移（对照 `.umd-conversion.json` 的 `sourceCssColors` 快照，按文件+出现顺序配对）+ `.ev_` 类名 | advisory（须回应） |
| `check-token-drift.cjs` | token 定义值漂移（对照 `sourceCssTokens`，硬 FAIL）+ 业务 CSS 引用未定义 token（advisory） | 硬 FAIL + advisory |
| `check-menu.cjs` | eview-ui `Menu` 未传 `selectable`；Accordion data 项 `label`/`key` 残留（应 `title`/`value`）；antd `Menu` items 数组残留 | advisory（须回应） |

**跳过**：`check-relative-imports.cjs`（步骤 4 已跑，`verification.relativeImports=PASS`；步骤 7 新增 import 同级 `./`、上层 `../` 即可）。

**npm install**：`npm install`（timeout=30000）。内网源不可达/超时/registry 报错 → 记 `SKIP` 不判 FAIL，notes 写明（外网环境预期行为）；安装成功则进 checks.npm-install=PASS。

**advisory 回应规则**：advisory 项发现的问题**不阻断 PASS**，但必须在 `advisoryReviews` 逐条写明「已修复 / 有意保留（理由）」；空回应视同未检查（FAIL）。

**循环上限**：默认 5 轮。每轮 FAIL → 修复 → 重跑全量脚本 → round+1。第 5 轮仍 FAIL 停止，向用户报告失败项 + 建议人工介入。

### 终检补充（脚本门禁 PASS 后，主 agent 直接做——补 check 脚本未覆盖项）

1. **GBK 乱码抽查**：抽看几个含中文的 jsx（src/views/、src/components/）确认中文正常；发现乱码用 read+write/edit 重做对应文件（禁 PowerShell 写文件）
2. **痕迹 grep**（输出应为空）：`grep -rn "\.ant-" src/`（antd CSS 选择器残留）、`grep -rn "\./assets/uploads/" src/`（旧图片路径残留）
3. **结构完整性**：src/main.jsx / src/app.jsx / package.json / vite.config.js / index.html 存在；src/styles/{base,light,theme,dark}.css 齐全；public/uploads/ 有文件（仅当 `.umd-conversion.json` 的 uploadsAssets.copiedCount > 0）
4. **图标/图表零改动抽查**：`@/shared/Icon` shim 路径与源 chart 封装 import 保持原样
5. **待内网确认项**（仅剩 .npmrc scope 源——样式接入路径已确认 `@cloudsop/eview-ui/style/aui3.1.less`）的执行结果向用户汇报

### 向用户汇报

各步骤状态（PASS/FAIL）+ 改动文件汇总 + 手写组件清单（B 类 `// TODO(eview-ui)`）+ advisory 回应摘要与残留问题（grep 命中列文件:行号:内容）+ 遗留问题。

## §4 验证脚本判定细则

- **§4.1 check-imports**：业务代码（跳过 `src/shared/`、`node_modules`）出现 `from 'antd'`、`from 'antd/...'`、`from '@ant-design/icons'`、`from '@nce/eview-react'` 任一 → FAIL。**旧版 Pro 组件导入**（`eview-ui/Select`、`eview-ui/Table`、`eview-ui/Dialog`、`eview-ui/MessageDialog`、`eview-ui/Form` 精确路径，不含 *Pro 后缀）→ FAIL（LEGACY_PRO_USED——有 Pro 版一律用 Pro 版）。裸包名导入（`from 'eview-ui/...'`）→ FAIL（EVUI_UNSCOPED_IMPORT）。eview-ui 导入非默认形态（`import { X } from '@cloudsop/eview-ui'`）→ FAIL（特例 4 组件白名单：Tab 的 TabItem、GridLayout 的 Row/Col、Panel 解构、RangePicker 解构）。`import Icon from '@/shared/Icon'` 路径变体（`assets/shared/icon`）→ FAIL。
- **§4.2 check-select-options**：AST 扫描 `.map`/`Array.from`/spread/shorthand/计算键等动态形态里 `label:` 字段残留 → FAIL（拦 LLM 漏改 `label`→`text` 致下拉项文字空白）。
- **§4.3 check-provider**：全工程无 `<ConfigProvider` → FAIL；有但 `locale` 不是 `"zh"`（或缺）→ FAIL；`version` 非 `aui3-1`（或缺）→ FAIL；`theme` 是静态字符串（无 `isDark`/三元/派生）或缺失 → FAIL。listenTheme 不作要求（实测 theme 单独驱动组件暗色）。
- **§4.4 check-dark-mode**：检测暗色需求（CSS 有 `.dark` 选择器或 JS 有 `isDark`/`toggleDark`）后验证**双轨**：html 轨（`documentElement` 切 `.dark`）缺 → FAIL；theme 轨（`<ConfigProvider` 的 `theme={…}` 动态派生）缺 → FAIL；`aui3_1_dark` 残留 → FAIL（混入 eview-react 旧骨架）；@nce CSS import 残留 → FAIL。body `data-theme` / `eviewui_aui3_1_*` 类轨**不检查**（组件库内部管理，手写属多余但不算错）。
- **§4.5 check-visibility**：JSX 扫描 `<Dialog`/`<DialogPro`/`<MessageDialog`/`<MessageDialogPro`/`<PopUpMenu`/`<Loader` 元素上 `visible=`/`display=`/`isShow=` → FAIL；`<Drawer`/`<Tooltip` 上 `isOpen=`/`display=` → FAIL；`<DivMessage`/`<TipBox`/`<Popup` 上 `isOpen=`/`visible=` → FAIL。
- **§4.6 check-wizards**：`<Steps`/`Steps.Step` 残留、`<Wizards` 上 `items=` 残留、data 项 `title:`/`label:` 字段残留（AST 扫描，无 @babel/parser 时降级跳过并注明）→ 硬 FAIL；`currentStep={数字直接量或下标变量名}` → advisory（疑似传下标而非 `data[].value`，需人工确认）。
- **§4.7 check-crumbs**：`separator=`（正确英文）残留 → FAIL；`<Breadcrumb`/`items=` → FAIL；`<Crumbs` data 项 `href:`/`path:` 字段 → FAIL。
- **§4.8 check-table-defaults**：`dataSource=` → FAIL（TablePro 用 dataset）；`rowSelection=` antd 形态残留 → advisory（应 `selection` 对象）；TablePro `columnResizable` 默认 true 未显式处理 → advisory（须回应「有意保留拖拽」或补 false）。旧 Table 的使用由 §4.1 check-imports 的 LEGACY_PRO_USED 拦截（导入即 FAIL）。
- **§4.9 check-css**：对照快照按文件+出现顺序配对，COLOR_DRIFT（改值）/COLOR_ADDED/COLOR_DROPPED → advisory 须回应；`.ev_` 前缀类名 → advisory。自动排除 `src/styles/`（token 层）。
- **§4.10 check-token-drift**：`sourceCssTokens` 快照里的 token 定义值漂移 → **硬 FAIL**；业务 CSS 引用未定义 token → advisory。
- **§4.11 check-menu**：`<Menu`（eview-ui）无 `selectable` → advisory；`items={...}` 数组 prop → advisory（eview-ui Menu 无 items，必是残留或笔误）；Accordion `data` 项 `label:`/`key:` 字段 → advisory。
