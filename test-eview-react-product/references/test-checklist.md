# 测试清单（静态层）

> 45 条断言：7 条骨架完整性（前置门）+ 38 条迁移正确性。迁移规则从 [antd-to-eview-react 的硬约束 + naming-quirks + form-migration + component-mapping](../../antd-to-eview-react/SKILL.md) 反向推导。
> `scripts/checklist.mjs` 按本清单执行，输出 `.checklist-result.json`。

## 分类与严重度

| 分类 | 严重度 | 说明 |
|------|--------|------|
| **骨架完整性** | 阻断（前置门） | 项目骨架不完整（缺 package.json/入口/index.html/构建配置），后续迁移检查无意义，整批跳过 |
| **import** | 阻断 | 错了 dev 起不来，跳过后续层 |
| **API 命名** | 硬失败 | props 名错组件不认 |
| **模式转换** | 硬失败 | Form/Modal 控制流不对，功能不工作 |
| **样式** | 硬失败 | 暗色/主题不跟随；CSS 写死色值 |
| **回调签名** | 警告 | `e.target.value` 多了会出错但未必挡运行 |

## 0. 项目骨架完整性类（阻断，前置门）

> 各条独立跑（不互相短路），任一失败 → `blockNext=true`，跳过后续所有 import/api/mode/style 类；warn 类（回调签名）仍跑。
> detail 直接指向缺失的文件/字段，让生成 agent 知道是"补骨架"而不是"改迁移写法"。

| id | 检查方法 | 通过条件 |
|----|---------|---------|
| `package-json-exists` | read `package.json` | 文件存在 |
| `package-json-react-dep` | parse `package.json`，查 `dependencies`+`devDependencies` | 含 `react` 或 `react-dom` |
| `package-json-eview-dep` | parse `package.json`，查 `dependencies`+`devDependencies` | 含 `@nce/*` / `@cloudsop/*` / `@hui/*` 任一（eview-react 已接入） |
| `package-json-scripts` | parse `package.json`，查 `scripts` | 同时有 `build` + `dev` |
| `entry-file-exists` | read `src/main.{jsx,tsx,js}` 或 `src/index.{jsx,tsx,js}` | 任一存在 |
| `index-html-exists` | read `index.html` 或 `public/index.html` | 任一存在 |
| `build-config-exists` | read `vite.config.{js,ts,mjs,cjs}` 或 `webpack.config.{js,ts}` | 任一存在 |

## 1. import 类（阻断）

| id | 检查方法 | 通过条件 |
|----|---------|---------|
| `no-antd-import` | grep `from ['"]antd['"]` / `require\(['"]antd['"]\)` 在 `src/**/*.{js,jsx,ts,tsx}` | 0 匹配 |
| `no-antd-locale` | grep `from ['"]antd/locale` | 0 匹配 |
| `no-antd-icons` | grep `from ['"]@ant-design/icons['"]` | 0 匹配 |
| `eview-import-path` | grep `from ['"]@nce/eview-react['"]`（命名导入） | 0 匹配；eview-react 必须用 `@nce/eview-react/<Component>` 默认导入 |
| `no-src-prefix-in-src` | 跑 `check-relative-imports.cjs <PRODUCT_PATH>` | 退出码 0 |
| `css-imports-in-entry` | read `src/main.jsx`，grep 4 条 import | 同时含 `aui3_1.css` + `base.css` + `tokens.css` + `theme-dark.css` |

## 2. API 命名类（硬失败）

| id | 检查方法 | 通过条件 |
|----|---------|---------|
| `button-status` | grep `<Button[^>]*\btype=` | 0 匹配（Button 无 type 属性） |
| `button-status-present` | grep `<Button[^>]*\bstatus=` | ≥1 匹配（若产物用到 Button） |
| `select-text-not-label` | grep `options=\[` 周边 200 字符内 `label:` | 0 匹配（Cascader 例外，见下） |
| `select-defaultLabel` | grep `<Select[^>]*\bplaceholder=` | 0 匹配（Select 用 `defaultLabel`） |
| `multipleselect-placeholder-ok` | （信息项）MultipleSelect 允许 `placeholder`，不报错 | — |
| `toggle-toggled` | grep `<Toggle[^>]*\bchecked=` | 0 匹配（用 `toggled`） |
| `toggle-onToggle` | grep `<Toggle[^>]*\bonChange=` | 0 匹配（用 `onToggle`） |
| `toggle-taggled-children` | grep `toggledChildren` / `checkedChildren` | `toggledChildren` 0 匹配；若有 Switch 文字配置应见 `taggledChildren` |
| `crumbs-seprator` | grep `<Crumbs[^>]*\bseparator=` | 0 匹配（必须拼错为 `seprator`） |
| `selectcard-disable` | grep `<SelectCard[^>]*\bdisabled=` | 0 匹配（用 `disable`） |
| `fileupload-disable` | grep `<FileUpload[^>]*\bdisabled=` | 0 匹配 |
| `dialog-isOpen` | grep `<Dialog[^>]*\bopen=`（裸 open，非 isOpen） | 0 匹配 |
| `drawer-visible` | grep `<Drawer[^>]*\bopen=` | 0 匹配（用 `visible`） |
| `loading-isOpen` | grep `<Loading[^>]*\bspinning=` | 0 匹配（用 `isOpen`） |
| `steps-currentStep` | grep `<Steps[^>]*\bcurrent=` | 0 匹配（用 `currentStep`，注意 currentStep 不算） |
| `badge-content` | grep `<Badge[^>]*\bcount=` | 0 匹配（用 `content`） |
| `tag-no-closable` | grep `<Tag[^>]*\bclosable` | 0 匹配 |
| `table-dataset` | grep `<Table[^>]*\bdataSource=` | 0 匹配（用 `dataset`） |
| `table-keyIndex` | grep `<Table[^>]*\browKey=` | 0 匹配（用 `keyIndex`） |
| `table-key-in-columns` | grep columns 配置里 `dataIndex:` | 0 匹配（用 `key`） |
| `cascader-label-allowed` | （信息项）Cascader 是唯一用 `label` 的，不报 `select-text-not-label` 的错 | — |

## 3. 模式转换类（硬失败）

| id | 检查方法 | 通过条件 |
|----|---------|---------|
| `form-ref-not-useForm` | grep `Form.useForm\(\)` | 0 匹配 |
| `form-ref-present` | grep `useRef\(null\)` + `ref={formRef}` | 若产物有 Form，应 ≥1 匹配 |
| `form-no-validateFields` | grep `\.validateFields\(\)` | 0 匹配 |
| `form-submit-onSuccess` | grep `formRef.*\.submit\(\)` + `onSuccess` | 若产物有 Form，应同时匹配 |
| `form-no-onFinish` | grep `onFinish` | 0 匹配（用 onSuccess） |
| `form-no-row-col-inside` | read Form 块内，grep `<Row` / `<Col` 或 `<div[^>]*grid` | Form 内 0 匹配（用 `itemCol`） |
| `form-rules-no-message` | grep `rules=\[` 周边 `message:` | 0 匹配 |
| `toggle-form-item-props` | grep Form.Item 包裹 Toggle 的，含 `valuePropName="toggled"` + `updateTrigger="onToggle"` | 若 Form 里有 Toggle，应匹配 |
| `checkbox-form-item-props` | grep Form.Item 包裹 Checkbox 的，含 `valuePropName="checked"` + `updateTriggerIndex=` | 若 Form 里有 Checkbox，应匹配 |
| `modal-manual-close` | grep Dialog 的 `onClose` 回调内 `setIsOpen\(false\)` / `setVisible\(false\)` | 若产物有 Dialog/Drawer，应匹配（不会自动关闭） |
| `message-imperial-gone` | grep `message\.(success|error|info|warning|loading)\(` | 0 匹配（无命令式 API，用 `<DivMessage>`） |
| `popconfirm-to-messagedialog` | grep `<Popconfirm` | 0 匹配（用 `MessageDialog type="confirm"`） |

## 4. 样式与入口类（硬失败）

| id | 检查方法 | 通过条件 |
|----|---------|---------|
| `body-aui3_1` | read `index.html`，grep `<body[^>]*\baui3_1` | 匹配 |
| `body-ev-no-wcag` | read `index.html`，grep `<body[^>]*\bev_no_wcag` | 匹配 |
| `config-provider-present` | read `src/main.jsx`，grep `<ConfigProvider` | 匹配 |
| `intl-provider-present` | read `src/main.jsx`，grep `IntlProvider` + `componentsLocales` | 同时匹配 |
| `dark-useeffect-two-classes` | grep `aui3_1_dark` + `.dark` 在同一 useEffect / 同一 toggle 块 | 同时匹配且 `aui3_1_dark` 挂 `body`、`dark` 挂 `documentElement`/`html` |
| `dark-on-body-not-root` | grep `document\.body\.classList.*aui3_1_dark` 或 `document\.querySelector\(['"]\.root` 残留 | 应挂 body；若见 `querySelector('.root')` 切 aui3_1_dark → 失败 |
| `no-dead-color-in-css` | grep `#[0-9a-fA-F]{3,8}\b` 在 `src/styles/*.css`（tokens.css 除外，token 定义本身允许） + `src/**/*.css` 组件样式 | 组件样式 0 匹配（用 `var(--*)`） |
| `no-ev-class-prefix` | grep `className=['"][^'"]*\bev_` 在 `src/**/*.{js,jsx,tsx}`（`ev_no_wcag` 除外，那是 eview-react 自有约定） | 0 匹配 |
| `clickable-is-button` | grep `<div[^>]*onClick` | 0 匹配（用 `<button type="button">`） |

## 5. 回调签名类（警告，不算硬失败）

| id | 检查方法 | 通过条件 |
|----|---------|---------|
| `no-etarget-value` | grep `e\.target\.value` / `e\.target\.checked` 在 `src/**/*.{js,jsx,tsx}` | 0 匹配为通过；>0 标 warning，`detail` 列出文件:行号，但不计入 `failed` |

## 检查执行顺序

1. 先跑骨架完整性类（structure）——各条独立跑，不互相短路。任一失败设 `blockNext=true`，跳过后续 import/api/mode/style（warn 类仍跑），主 agent 据此跳过 L1/L2。
2. 骨架全过 → 跑 import 类——任一失败设 `blockNext=true`，跑完 import 后若 `blockNext` 跳过 api/mode/style。
3. import 全过 → 跑 API 命名 → 模式转换 → 样式 → 回调签名。
4. 输出汇总：`total` / `passed` / `failed` / `warnings`。

## 失败 detail 写法

每条失败的 `detail` 必须可操作，格式：

```
<相对路径>:<行号> <具体问题>（应为 <正确写法>）
```

例：
- `src/App.jsx:12 Button 仍用 type="primary"（应为 status="primary"）`
- `src/components/Form.jsx:45 残留 form.validateFields()（应为 formRef.current.submit() + onSuccess 回调）`
- `src/styles/app.css:8 写死 #191919（应用 var(--surface)）`

让生成 agent 拿到 detail 能直接定位修改，不需要再排查。
