# FileUpload 组件功能逻辑规格

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `FileUpload/FileUpload`；官网组件页 Upload 及示例 `FileUploadSinge.jsx` / `FileUploadMulti.jsx` / `FileUploadAuto.jsx` / `FileUploadCustomValidate.jsx` / `FileUploadAcceptValidate.jsx` / `FileUploadExampleFileList.jsx`
>
> ⚠️ **组件不发请求**。用户点"上传"按钮只会触发 `handleSubmit({ event, data })`，请求、进度、成功失败都由业务代码做，再通过 `updateProgressStatus` / `fileUploadStatus` 两个按文件名索引的对象回写给组件（所有官方 demo 都是这个套路）。
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

## 2. 典型场景

- 导入配置：单文件，`accept=".xlsx"` + `isAcceptValidate`，`maxSize="10MB"`，成功后刷新列表
- 批量上传附件：`type="multi"`，`maxFileCount={5}`，逐个显示进度与失败重传
- 表单内的头像 / 证书上传：`hideUploadButton` 自动上传，上传成功后把返回的 URL 写进表单值
- 上传前业务校验：`validator(files)` 检查文件名规则 / 重名

## 3. 状态声明

```tsx
// 两个按文件名索引的对象，是驱动组件进度 UI 的全部状态
const [progress, setProgress] = useState<Record<string, number>>({});                 // 0-100
const [status, setStatus] = useState<Record<string, UploadStatus>>({});               // 'loading'|'success'|'fail'|'added'|''

// 业务侧结果：上传成功后服务端返回的文件 id / url
const [uploadedIds, setUploadedIds] = useState<string[]>([]);

const uploadRef = useRef<any>(null);   // 自动上传时调 handleSubmit()；demo 还用到 getValue() / getValueEx()
```

## 4. 事件与交互逻辑

### 主流程：handleSubmit 里发请求，回写进度与状态

```tsx
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
      setUploadedIds((prev) => [...prev, res.id]);
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
  onFileClose={(event) => { /* 用户移除文件：同步删掉 progress/status/uploadedIds 里对应项 */ }}
  onCancelUpload={() => { /* 取消：中止请求，清空 progress/status */ }}
/>
```

### 自动上传（demo FileUploadAuto.jsx）

```tsx
<FileUpload
  ref={uploadRef}
  type="single"
  hideUploadButton                                    // 隐藏按钮
  onChange={(event, itemList) => uploadRef.current.handleSubmit()}   // 选完立刻触发 handleSubmit
  handleSubmit={handleSubmit}
  …
/>
```

### 上传前校验 —— validator(files) 返回 { result, message }，result: true 放行

```tsx
validator={(files: any[]) => ({
  result: files.every((f) => /^[\w.-]+$/.test(f.name)),
  message: '文件名只能包含字母、数字、下划线、点和短横线',
})}
```

## 5. 数据结构

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

## 6. 联动说明

- 选择文件 → `onChange(event, itemList)` → 可在此做业务侧预检或直接自动上传
- 点上传 → `handleSubmit` → 每个文件 `loading` → 进度回写 → `success` / `fail`
- `fail` 的文件出现"重新上传" → `onReload({ event, data })`，`event.title` 是文件名，只重传该文件
- 用户删除文件 → `onFileClose(event)` → 同步清理 map 与已上传 id；`onCancelUpload` → 中止进行中的请求
- 全部 `success` → 表单提交按钮解锁；有 `loading` 时提交按钮 `disabled`
- 表单重置 → 清空两个 map 和 `uploadedIds`（`fileList` 可控制已上传列表）

## 7. 完整代码示例

```tsx
import React, { useRef, useState } from 'react';
import FileUpload from '@nce/eview-react/FileUpload';
import Button from '@nce/eview-react/Button';

type UploadStatus = 'loading' | 'fail' | 'success' | 'added' | '';

// 模拟分段上传接口：按文件名决定成败；真实项目替换为已有 Service（XMLHttpRequest/fetch + FormData）
const mockUpload = (name: string, onProgress: (pct: number) => void): Promise<string> =>
  new Promise((resolve, reject) => {
    let pct = 0;
    const timer = setInterval(() => {
      pct += 25;
      onProgress(Math.min(pct, 100));
      if (pct >= 100) {
        clearInterval(timer);
        name.includes('bad') ? reject(new Error('服务端拒绝')) : resolve(`id-${name}`);
      }
    }, 200);
  });

// 批量附件上传：多文件 + 进度 + 失败重传 + 全部成功后解锁提交
export default function AttachmentUploader() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, UploadStatus>>({});
  const [uploadedIds, setUploadedIds] = useState<Record<string, string>>({});
  const uploadRef = useRef<any>(null);

  const setFile = (name: string, pct: number, st: UploadStatus) => {
    setProgress((prev) => ({ ...prev, [name]: pct }));
    setStatus((prev) => ({ ...prev, [name]: st }));
  };

  const uploadItems = async (items: any[]) => {
    for (const item of items) {
      const name: string = item.name;
      setFile(name, 0, 'loading');
      try {
        const id = await mockUpload(name, (pct) => setFile(name, pct, 'loading'));
        setFile(name, 100, 'success');
        setUploadedIds((prev) => ({ ...prev, [name]: id }));
      } catch (e) {
        setFile(name, 100, 'fail');
      }
    }
  };

  const handleFileClose = (event: any) => {
    // 用户移除文件后清理对应记录；event 结构按实际字段取文件名
    const name: string | undefined = event?.title ?? event?.name;
    if (!name) return;
    const drop = (prev: Record<string, any>) => {
      const next = { ...prev };
      delete next[name];
      return next;
    };
    setProgress(drop);
    setStatus(drop);
    setUploadedIds(drop);
  };

  const uploading = Object.values(status).some((s) => s === 'loading');
  const allDone = Object.keys(status).length > 0 && Object.values(status).every((s) => s === 'success');

  return (
    <div style={{ width: 520, padding: 24 }}>
      <FileUpload
        ref={uploadRef}
        type="multi"
        maxFileCount={5}
        width="450px"
        accept=".png,.svg,.xlsx"
        isAcceptValidate
        maxSize="10MB"
        enableProgress
        buttonText="开始上传"
        updateProgressStatus={progress}
        fileUploadStatus={status}
        handleSubmit={({ data }: { event: any; data: any[] }) => uploadItems(data)}
        onReload={({ event, data }: { event: any; data: any[] }) =>
          uploadItems(data.filter((f) => f.name === event.title))
        }
        onFileClose={handleFileClose}
        onCancelUpload={() => {
          setProgress({});
          setStatus({});
        }}
        validator={(files: any[]) => ({
          result: files.every((f) => /^[\w.-]+$/.test(f.name)),
          message: '文件名只能包含字母、数字、下划线、点和短横线',
        })}
      />
      <Button
        status="primary"
        text={uploading ? '上传中...' : '提交'}
        disabled={!allDone || uploading}
        onClick={() => {
          // 提交时带上服务端返回的文件 id
          const ids = Object.values(uploadedIds);
          alert(`提交附件：${ids.join(', ')}`);
        }}
        style={{ marginTop: 16 }}
      />
    </div>
  );
}
```

## 8. 反面示例

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

## 9. API 速查

> 压缩自 `api/FileUpload_FileUpload.md`；ref 方法仅列 demo 出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `type` | `'single' \| 'multi'`，默认 `single` | 单 / 多文件 |
| `disable` | `boolean`，默认 `false` | 禁用（**不是 disabled**） |
| `display` | `boolean`，默认 `true` | 是否显示组件 |
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
| `hintType` / `showCustomHintTip` | `'div' \| 'tip'` / `boolean` | 校验提示形式 |
| `showFileSize` / `displayToolTip` / `isShowCancelFileText` | `boolean`，默认 `true` | 显示大小 / 提示 / 取消文本 |
| `ref.handleSubmit()` / `ref.getValue()` / `ref.getValueEx()` | 命令式方法 | 触发上传 / 取文件列表（demo FileUploadAuto / FileUploadMulti） |
