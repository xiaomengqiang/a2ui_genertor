# baseline manifest 格式

> 用户提供的基线目录（`BASELINE_DIR`）结构、`manifest.json` 字段说明、截图基线生成方法。

## 目录结构

```
<BASELINE_DIR>/
├── manifest.json          # 必需，描述测试场景
└── screenshots/           # 基线截图（路径在 manifest 的 case.baseline 引用）
    ├── home-light.png
    ├── home-dark.png
    ├── form-submit.png
    └── dialog-open.png
```

`baseline` 路径相对 `BASELINE_DIR`。也允许写绝对路径。

## manifest.json 顶层字段

| 字段 | 类型 | 必需 | 默认 | 说明 |
|------|------|------|------|------|
| `devUrl` | string | 是 | — | dev server 根 URL，如 `http://localhost:5173`；与 `path` 拼接成测试 URL |
| `tolerance` | number | 否 | `0.05` | 像素 diff 容差（0~1），`diffRatio <= tolerance` 算视觉通过；case 可单独覆盖 |
| `waitTimeout` | number | 否 | `5000` | 页面 goto 后默认等待 ms（含等异步渲染） |
| `cases` | array | 是 | — | 测试场景数组，至少 1 个 |

## case 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 场景标识，输出结果按 id 索引；同名截图建议与 id 一致 |
| `path` | string | 是 | 相对 devUrl 的路径，如 `/` / `/form` / `/list?page=2` |
| `interactions` | array | 否 | goto 后依次执行的交互步骤，见下 |
| `baseline` | string | 是 | 基线截图路径（相对 BASELINE_DIR 或绝对） |
| `assertClasses` | array | 否 | DOM 类名断言，见下 |
| `assertTexts` | array | 否 | 文本断言，可选 |
| `tolerance` | number | 否 | 覆盖顶层 tolerance（某场景单独调） |
| `ignoreRegions` | array | 否 | 像素 diff 时忽略的区域，见下 |
| `waitTimeout` | number | 否 | 覆盖顶层 waitTimeout |
| `semantic` | boolean | 否 | 标 `true` 表示该 case 走 L3 多模态语义判断（待多模态能力就绪）。当前测试 agent 遇到 `semantic: true` 跳过并在 notes 注明"L3 多模态未就绪，case X 跳过"；L2 的 pixelmatch 像素 diff 不跑这种 case |

## interactions 步骤

按数组顺序执行，每步执行完再下一步。每步是一个对象，`type` 决定行为：

| type | 字段 | 说明 |
|------|------|------|
| `click` | `selector` | 点击元素（playwright `$selector.click()`） |
| `fill` | `selector`, `value` | 清空并填值（用于 input） |
| `hover` | `selector` | 悬浮 |
| `select` | `selector`, `value` | 选 `<select>` 选项 |
| `wait` | `selector` \| `timeout` | 等元素出现或等 ms |
| `eval` | `script` | 在页面里跑 `page.evaluate(script)`，用于切状态（如 `localStorage.setItem('theme','dark')`） |
| `keyboard` | `key` | 按键，如 `Enter` / `Escape` |

`selector` 用 CSS 选择器。建议产物里给关键交互元素加 `data-testid`（如 `<button data-testid="theme-toggle">`），selector 写 `[data-testid=theme-toggle]` 更稳。

## assertClasses / assertTexts

```json
"assertClasses": [
  { "selector": "html", "has": "dark" },
  { "selector": "body", "has": "aui3_1_dark" },
  { "selector": "body", "lacks": "aui3_1_dark" }
]
```

```json
"assertTexts": [
  { "selector": ".app-page-title", "equals": "设备接入配置向导" },
  { "selector": ".app-form-error", "contains": "请输入" }
]
```

- `has` / `lacks`：元素类名含 / 不含某 token
- `equals` / `contains`：元素 `textContent` 等于 / 包含某文本

## ignoreRegions

```json
"ignoreRegions": [
  { "selector": ".ev-loading-spinner" },
  { "x": 0, "y": 0, "width": 200, "height": 60 }
]
```

像素 diff 时把该区域置零（不参与差异计算）。用于忽略时间戳、加载动画等不可预测区域。

## 完整示例

```json
{
  "devUrl": "http://localhost:5173",
  "tolerance": 0.05,
  "waitTimeout": 5000,
  "cases": [
    {
      "id": "home-light",
      "path": "/",
      "interactions": [],
      "baseline": "screenshots/home-light.png",
      "assertClasses": [
        { "selector": "body", "has": "aui3_1" },
        { "selector": "body", "lacks": "aui3_1_dark" }
      ]
    },
    {
      "id": "home-dark",
      "path": "/",
      "interactions": [
        { "type": "click", "selector": "[data-testid=theme-toggle]" },
        { "type": "wait", "timeout": 300 }
      ],
      "baseline": "screenshots/home-dark.png",
      "assertClasses": [
        { "selector": "html", "has": "dark" },
        { "selector": "body", "has": "aui3_1_dark" }
      ]
    },
    {
      "id": "form-submit-success",
      "path": "/form",
      "interactions": [
        { "type": "fill", "selector": "[data-testid=input-name]", "value": "测试设备" },
        { "type": "click", "selector": "[data-testid=submit]" },
        { "type": "wait", "selector": "[data-testid=success-tip]" }
      ],
      "baseline": "screenshots/form-submit-success.png",
      "assertTexts": [
        { "selector": "[data-testid=success-tip]", "contains": "提交成功" }
      ]
    },
    {
      "id": "dialog-open",
      "path": "/list",
      "interactions": [
        { "type": "click", "selector": "[data-testid=open-dialog]" }
      ],
      "baseline": "screenshots/dialog-open.png",
      "assertClasses": [
        { "selector": "[data-testid=dialog]", "has": "ev-dialog-open" }
      ],
      "tolerance": 0.10
    }
  ]
}
```

## 用户怎么准备基线截图

1. 跑起**原始 antd 项目**（迁移前的版本），到每个场景的稳定状态，截图存为 `screenshots/<id>.png`。
2. 写 `manifest.json`，`cases` 数组每条对应一个截图，`interactions` 描述怎么从 `path` 走到该状态。
3. 截图分辨率建议 1280×720 或 1920×1080（测试脚本会以 `viewport: { width: 1280, height: 720 }` 默认跑；自定义视口在 manifest 顶层加 `viewport`）。

> **容差选择**：antd 与 eview-react 视觉本来就有差异（组件库不同），5% 是经验值。如某场景差异大但可接受，单独调高该 case 的 `tolerance`，不要全局放宽。

## 产物侧配合

为了让 selector 稳定，建议产物（生成 agent）给关键交互元素加 `data-testid`：
- 主题切换按钮：`data-testid="theme-toggle"`
- 提交按钮：`data-testid="submit"`
- 成功提示：`data-testid="success-tip"`
- 弹窗根：`data-testid="dialog"`

测试 agent 在生成 agent 的 prompt 里可要求加这些 testid（见 build-test-fix-loop 的修复轮 prompt 模板，可补充"给交互元素加 data-testid 以便测试"）。
