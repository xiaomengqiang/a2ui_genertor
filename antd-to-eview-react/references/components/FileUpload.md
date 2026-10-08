# FileUpload 组件功能逻辑规格

> 资料来源：TypeDoc `FileUpload/FileUpload` + 官网 Upload 页示例。
> ⚠️ **组件不发请求**。用户点"上传"按钮只触发 `handleSubmit({ event, data })`，请求、进度、成功失败都由业务代码做，再通过 `updateProgressStatus` / `fileUploadStatus` 两个按文件名索引的对象回写给组件（所有官方 demo 都是这个套路）。
> ⚠️ 禁用属性是 **`disable`**（不是 `disabled`）。
> ⚠️ `enableProgress` API 表注明"只支持单个文件"，但 `FileUploadMulti.jsx` 在 `type="multi"` 下也开了它 → 按 demo 可用，多文件时以实测为准。
> ⚠️ `handleSubmit` 拿到的 `data` 每项在 demo 里按 `item.name` / `item.data`（原生 File）取用（`formData.append('uploads', files[file].data)`），类型表写的是 `File[]`，以 demo 为准。

## 1. 功能定位

FileUpload 是"选择文件 + 文件列表 + 上传按钮 + 进度 / 状态"的整块上传控件，单 / 多文件，支持类型、大小、数量、自定义校验。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 表单里选文件并上传 | `FileUpload` | antd `<Upload action="/api">`（eview 没有 `action`，不会自己发请求） |
| 只是选一个路径填到输入框 | `BrowseButton`（第二批） | FileUpload |
| 选完立刻自动上传 | `FileUpload` + `hideUploadButton` + `onChange` 里调 `ref.handleSubmit()` | 自己监听 input |

## 2. 事件与交互逻辑

### 主流程：handleSubmit 里发请求，回写进度与状态

```tsx
const [progress, setProgress] = useState<Record<string, number>>({});    // 0-100，按文件名索引
const [status, setStatus] = useState<Record<string, UploadStatus>>({});  // 'loading'|'success'|'fail'|'added'|''

const setFile = (name: string, pct: number, st: UploadStatus) => {
  setProgress((prev) => ({ ...prev, [name]: pct }));
  setStatus((prev) => ({ ...prev, [name]: st }));
};

const handleSubmit = async ({ data }: { event: any; data: any[] }) => {
  for (const item of data) {                         // 顺序上传；并发上传自行 Promise.all
    const name = item.name;
    setFile(name, 0, 'loading');
    try {
      const form = new FormData();
      form.append('file', item.data);               // item.data 是原生 File（demo 用法）
      const res = await api.upload(form, (pct: number) => setFile(name, pct, 'loading'));
      setFile(name, 100, 'success');
    } catch (e) {
      setFile(name, 100, 'fail');                     // 失败也置 100，让进度条停下（demo 做法）
    }
  }
};

<FileUpload
  type="multi"
  maxFileCount={5}
  accept=".png,.svg,.xlsx"
  isAcceptValidate                                    // 不加这个，accept 只影响选择框过滤，不校验
  maxSize="10MB"
  enableProgress
  updateProgressStatus={progress}
  fileUploadStatus={status}
  handleSubmit={handleSubmit}
  onReload={({ event, data }) => handleSubmit({ event, data: data.filter((f) => f.name === event.title) })}  // 失败重传
  onFileClose={(event) => { /* 用户移除文件：同步删掉 progress/status 里对应项 */ }}
  onCancelUpload={() => { /* 取消：中止请求，清空 progress/status */ }}
/>
```

### 自动上传（demo FileUploadAuto.jsx）

```tsx
const uploadRef = useRef<any>(null);
<FileUpload
  ref={uploadRef}
  type="single"
  hideUploadButton                                    // 隐藏按钮
  onChange={(event, itemList) => uploadRef.current.handleSubmit()}   // 选完立刻触发 handleSubmit
  handleSubmit={handleSubmit}
/>
```

### 上传前校验 —— validator(files) 返回 { result, message }，result: true 放行

```tsx
validator={(files: any[]) => ({
  result: files.every((f) => /^[\w.-]+$/.test(f.name)),
  message: '文件名只能包含字母、数字、下划线、点和短横线',
})}
```

### 数据结构（组件回写 + handleSubmit data 项形状）

```tsx
type UploadStatus = 'loading' | 'fail' | 'success' | 'added' | '';

// 组件回写用的两个对象：key 都是文件名（api：{ [fileName: string]: number / upLoadStatus }）
type ProgressMap = Record<string, number>;
type StatusMap = Record<string, UploadStatus>;

// handleSubmit / onReload / onFileItemClick 的 data 项（以 demo 取用方式为准）
interface UploadItem {
  name: string;   // 文件名，也是上面两个 map 的 key
  data: File;     // 原生 File，放进 FormData
}
```

## 3. 联动说明

- `fail` 的文件出现"重新上传" → `onReload({ event, data })`，`event.title` 是文件名，只重传该文件
- 用户删除文件 → `onFileClose(event)` → 同步清理 map 与已上传 id；`onCancelUpload` → 中止进行中的请求
- 全部 `success` → 表单提交按钮解锁；有 `loading` 时提交按钮 `disabled`
- 表单重置 → 清空两个 map（`fileList` 可控制已上传列表）

## 4. 反面示例

```tsx
// ❌ antd 习惯：eview FileUpload 没有 action / beforeUpload / customRequest，不会自己发请求
<FileUpload action="/api/upload" beforeUpload={check} />

// ❌ 属性名写错：是 disable 不是 disabled
<FileUpload disabled />

// ❌ 只写 handleSubmit 不回写进度和状态，界面永远停在"未上传"
<FileUpload handleSubmit={({ data }) => api.upload(data)} />

// ❌ 进度 / 状态对象不用文件名做 key，组件对不上文件
setProgress({ 0: 50 });

// ❌ accept 只影响文件选择框过滤，不加 isAcceptValidate 就没有校验
<FileUpload accept=".xlsx" />

// ❌ 有文件还在 loading 就允许提交表单
<Button text="提交" onClick={submit} />
```

## 5. API 速查

> 压缩自 `api/FileUpload_FileUpload.md`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'single' \| 'multi'`，默认 `single` | 单 / 多文件 |
| `disable` | `boolean`，默认 `false` | 禁用（**不是 disabled**） |
| `accept` | `string`，如 `".png,.svg"` | 选择框过滤类型 |
| `isAcceptValidate` | `boolean`，默认 `false` | 开启 accept 校验 |
| `maxSize` | `string`，单位 `KB/MB/GB/TB`，默认字节 | 单文件大小上限 |
| `maxFileCount` | `number`，默认 `10` | 最大文件数 |
| `validator` | `(itemList) => { result, message }` | 点上传时校验，`result: true` 放行 |
| `handleSubmit` | `({ event, data }) => void` | 点上传按钮的回调，**业务在此发请求** |
| `onChange` | `(event, itemList) => void` | 选择文件变化 |
| `onFileClose` | `(event) => void` | 删除文件 |
| `onCancelUpload` | `() => void` | 取消上传 |
| `onReload` | `({ event, data }) => void` | 失败重传；`event.title` 是文件名 |
| `onFileItemClick` | `({ event, index, data }) => void` | 点击某个文件 |
| `enableProgress` | `boolean`，默认 `false` | 显示进度条（表注单文件；demo 多文件亦用） |
| `updateProgressStatus` | `{ [fileName]: number }` | 进度百分比回写 |
| `fileUploadStatus` | `{ [fileName]: 'loading' \| 'fail' \| 'success' \| 'added' \| '' }` | 状态回写 |
| `IsStepFileUpload` | `boolean`，默认 `false` | multi 下按序逐个上传并显示第几个 |
| `fileList` | `File[]` | 已上传文件列表 |
| `hideUploadButton` | `boolean`，默认 `false` | 隐藏上传按钮（自动上传用） |
| `buttonText` / `buttonStyle` / `placeHolder` / `tipText` | — | 文案与样式 |
| `width` | `string`，默认 `350px` | 不支持百分比，建议 ≥ 292px |
| `directory` | `boolean`，默认 `false` | 上传整个文件夹 |
| `ref.handleSubmit()` / `ref.getValue()` / `ref.getValueEx()` | 命令式方法 | 触发上传 / 取文件列表（demo） |
