# FileUpload 文件上传

> 分类：数据录入

文件上传组件，内置了4个状态，可根据不同的状态设置不同的提示，且支持上传进度条。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法   | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Upload`  | `FileUpload` | **组件不发请求**——`handleSubmit({event, data})` 业务自己发；`fileList` 受控；`maxFileCount` 默认 10；**`disable`（不是 disabled）**、**`placeHolder`（大写 H）**、**`upLoadErrorMessage`/`upLoadSuccessMessage`**（upLoad 拼写）；上传状态回写 `fileUploadStatus={文件名: 'loading'/'fail'/'success'}` + 进度 `updateProgressStatus={文件名: '百分比'}`；`onReload` 重传；ref：`getValue`/`getValueEx`/`setFileList` |

## API

### Ref Methods

| 方法名      | 参数             | 返回值   | 描述                             |
| :---------- | :--------------- | :------- | :------------------------------- |
| getValue    | 无               | string[] | 获取当前用户上传的文件名列表     |
| getValueEx  | 无               | File[]   | 获取当前用户上传的 File 对象数组 |
| setFileList | fileList: File[] | 无       | 手动设置 fileList                |

### 属性

| 属性名称               | 描述                                                                                                                           | 类型                                                                   | 默认值   |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- | :------- |
| id                     | 自定义组件 id，定义 id 将覆盖组件自动生成的 id                                                                                 | string                                                                 |          |
| className              | 定制组件类名                                                                                                                   | string                                                                 |          |
| style                  | 自定义组件样式                                                                                                                 | CSSProperties                                                          |          |
| disable                | 设置是否禁用 FileUpload                                                                                                        | boolean                                                                | false    |
| display                | 是否显示文件上传组件                                                                                                           | boolean                                                                | true     |
| type                   | 选择单个或多个文件，可选 `'single'` 或 `'multi'`                                                                               | 'single' &#124; 'multi'                                                | 'single' |
| accept                 | 支持的文件过滤选择                                                                                                             | string                                                                 | ''       |
| maxSize                | 指定上传文件的最大大小限制，默认单位为字节，支持 KB/MB/GB/TB 后缀                                                              | string                                                                 | ''       |
| validator              | 设置自定义校验规则，签名: `(itemList: File[]) => { result: boolean; message: string }`                                         | (itemList: File[]) => { result: boolean; message: string }             |          |
| width                  | 设置组件宽度                                                                                                                   | string                                                                 | '350px'  |
| updateProgressStatus   | 更新上传进度值百分比，key 为文件名，value 为百分比数字。示例: `{[fileName]: 10}`                                               | { [fileName: string]: number }                                         | {}       |
| placeHolder            | 自定义占位提示文本                                                                                                             | string                                                                 |          |
| handleSubmit           | 用户点击上传按钮时的回调，不自动发请求，业务需自行发起上传。签名: `(event: { event: React.MouseEvent; data: File[] }) => void` | (event: { event: React.MouseEvent; data: File[] }) => void             |          |
| hideUploadButton       | 是否隐藏上传按钮                                                                                                               | boolean                                                                | false    |
| hideReload             | 文件上传失败时是否隐藏重试图标                                                                                                 | boolean                                                                | false    |
| formatter              | 格式化文件大小显示，接收大小值和精度，返回格式化后的字符串                                                                     | (value: number, precision: number) => string                           |          |
| onFileClose            | 文件被移除时的回调。签名: `(event: FileCloseEvent) => void`                                                                    | (event: FileCloseEvent) => void                                        |          |
| onCancelUpload         | 取消文件上传时的回调                                                                                                           | () => void                                                             |          |
| fileUploadStatus       | 设置文件的上传状态，key 为文件名，value 为 `'loading'` / `'fail'` / `'success'` / `'added'` / `''`                             | { [fileName: string]: upLoadStatus }                                   | {}       |
| maxFileCount           | 最大可上传文件数量，默认为 10                                                                                                  | number                                                                 | 10       |
| buttonText             | 设置上传按钮的名称                                                                                                             | string                                                                 |          |
| buttonStyle            | 自定义上传按钮样式                                                                                                             | object                                                                 |          |
| showFileSize           | 是否显示文件大小                                                                                                               | boolean                                                                | true     |
| displayToolTip         | 是否显示自定义工具提示（hover 提示）                                                                                           | boolean                                                                | false    |
| tipText                | 自定义提示信息                                                                                                                 | string                                                                 |          |
| disableLinks           | 默认上传过程中会展示取消按钮。设为 true 时不展示取消按钮                                                                       | boolean                                                                | false    |
| upLoadErrorMessage     | 上传失败提示信息                                                                                                               | React.ReactNode                                                        |          |
| upLoadErrorClassName   | 定制上传失败提示信息的样式类名                                                                                                 | string                                                                 |          |
| upLoadSuccessMessage   | 上传成功提示信息                                                                                                               | React.ReactNode                                                        |          |
| upLoadSuccessClassName | 定制上传成功提示信息的样式类名                                                                                                 | string                                                                 |          |
| onChange               | 文件选择变化时的回调                                                                                                           | (event: React.ChangeEvent<HTMLInputElement>, itemList: File[]) => void |          |
| onReload               | 文件重新上传事件回调。签名: `(event: { event: FileReload; data: File[] }) => void`                                             | (event: { event: FileReload; data: File[] }) => void                   |          |
| fileList               | 从 props 中传入文件列表（受控）                                                                                                | File[]                                                                 | []       |
| version                | 设置组件版本，例如 `'aui3'`                                                                                                    | string                                                                 |          |
| theme                  | 设置组件主题，例如 `'evening'`                                                                                                 | string                                                                 |          |

```typescript
type upLoadType = "single" | "multi";
type upLoadStatus = "loading" | "fail" | "success" | "added" | "";

interface FileCloseEvent {
  event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>;
  title: string;
}

interface FileReload {
  event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>;
  title: string;
  size: number;
}

type FileUploadProps = {
  /** 自定义组件 id */
  id?: string;
  /** 定制组件类名 */
  className?: string;
  /** 设置组件版本，例如 'aui3' */
  version?: string;
  /** 设置组件主题，例如 'evening' */
  theme?: string;
  /** 自定义组件样式 */
  style?: CSSProperties;
  /** 自定义占位提示文本 */
  placeHolder?: string;
  /** 用户点击上传按钮时的回调，不自动发请求，业务需自行发起上传 */
  handleSubmit?: (event: {
    event: React.MouseEvent<HTMLSpanElement>;
    data: File[];
  }) => void;
  /** 取消文件上传时的回调 */
  onCancelUpload?: () => void;
  /** 设置上传按钮的名称 */
  buttonText?: string;
  /** 自定义上传按钮样式 */
  buttonStyle?: object;
  /** 指定上传文件的最大大小限制，默认单位为字节，支持 KB/MB/GB/TB 后缀 */
  maxSize?: string;
  /** 设置自定义校验规则 */
  validator?: (itemList: File[]) => { result: boolean; message: string };
  /** 从 props 中传入文件列表（受控） */
  fileList?: File[];
  /** 上传失败提示信息 */
  upLoadErrorMessage?: React.ReactNode;
  /** 定制上传失败提示信息的样式类名 */
  upLoadErrorClassName?: string;
  /** 上传成功提示信息 */
  upLoadSuccessMessage?: React.ReactNode;
  /** 定制上传成功提示信息的样式类名 */
  upLoadSuccessClassName?: string;
  /** 文件选择变化时的回调 */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    itemList: File[],
  ) => void;
  /** 文件被移除时的回调 */
  onFileClose?: (event: FileCloseEvent) => void;
  /** 文件重新上传事件回调 */
  onReload?: (event: { event: FileReload; data: File[] }) => void;
  /** 测试 id */
  "data-test-id"?: string;
  /** 格式化文件大小显示 */
  formatter?: (value: number, precision: number) => string;
} & {
  /** 设置是否禁用 FileUpload, @default false */
  disable: boolean;
  /** 是否显示文件上传组件, @default true */
  display: boolean;
  /** 选择单个或多个文件, @default 'single' */
  type: upLoadType;
  /** 支持的文件过滤选择, @default '' */
  accept: string;
  /** 设置组件宽度, @default '350px' */
  width: string;
  /** 更新上传进度值百分比, @default {} */
  updateProgressStatus: { [fileName: string]: number };
  /** 设置文件的上传状态, @default {} */
  fileUploadStatus: { [fileName: string]: upLoadStatus };
  /** 最大可上传文件数量, @default 10 */
  maxFileCount: number;
  /** 是否隐藏上传按钮, @default false */
  hideUploadButton: boolean;
  /** 是否显示文件大小, @default true */
  showFileSize: boolean;
  /** 是否显示自定义工具提示, @default false */
  displayToolTip: boolean;
  /** 自定义提示信息, @default '' */
  tipText: string;
  /** 默认上传过程中会展示取消按钮。设为 true 时不展示, @default false */
  disableLinks: boolean;
  /** 文件上传失败时是否隐藏重试图标, @default false */
  hideReload: boolean;
};
```

## 使用示例

### 单选

```jsx
import FileUpload from "eview-ui/FileUpload";

// 受控上传：fileUploadStatus 控制每文件状态，updateProgressStatus 控制进度百分比
const fileUploadStatus = { "1.jpg": "success" }; // 文件名: 'loading'/'fail'/'success'/'added'/''
const updateProgressStatus = { "1.jpg": 100 }; // 文件名: 百分比数字

<FileUpload
  type="single"
  width="450px"
  accept=".png"
  maxSize="100000"
  placeHolder="select the file to upload"
  buttonText="Upload File"
  disable={false}
  fileUploadStatus={fileUploadStatus}
  updateProgressStatus={updateProgressStatus}
  fileList={[]}
  handleSubmit={({ event, data }) => {
    // 业务自行发请求；data: File[]，取 data[0].name 更新 fileUploadStatus/updateProgressStatus
  }}
  onChange={(event, itemList) => {
    // event: React.ChangeEvent, itemList: File[]
  }}
  onCancelUpload={() => {
    // 取消上传
  }}
  onFileClose={(event) => {
    // event.title 为被移除文件名
  }}
  onReload={({ event, data }) => {
    // event.title 为重传文件名, data: File[]
  }}
/>;

// validator 自定义校验：返回 { result, message }
<FileUpload
  type="single"
  width="450px"
  accept=".png"
  placeHolder="select the file to upload"
  buttonText="Upload File"
  validator={(itemList) => {
    // itemList: File[]
    return { result: false, message: "Custom Validator for Fileupload" };
  }}
  handleSubmit={({ event, data }) => {
    // 业务自行发请求
  }}
/>;

// 禁用态：disable（注意拼写，不是 disabled）
<FileUpload
  type="single"
  buttonText="Upload"
  disable={true}
  accept=".png"
  placeHolder="Disabled Single Upload"
/>
```

### 多选

```jsx
import FileUpload from "eview-ui/FileUpload";

// 多文件上传：maxFileCount 控制最大数量（默认 10）
const fileUploadStatus = { "a.png": "loading", "b.png": "fail" }; // 文件名: 'loading'/'fail'/'success'
const updateProgressStatus = { "a.png": 60, "b.png": 100 }; // 文件名: 百分比数字

<FileUpload
  type="multi"
  maxFileCount={5}
  disable={false}
  buttonText="Upload Multiple Files"
  fileUploadStatus={fileUploadStatus}
  updateProgressStatus={updateProgressStatus}
  handleSubmit={({ event, data }) => {
    // data: File[]，业务自行发请求；遍历 data 逐个上传并更新进度
  }}
  onFileClose={(event) => {
    // event.title 为被移除文件名
  }}
  onCancelUpload={() => {
    // 取消上传
  }}
  onReload={({ event, data }) => {
    // event.title 为重传目标文件名, data: File[]
  }}
  ref={(fileUpload) => {
    // fileUpload.getValue() 返回文件名列表，fileUpload.getValueEx() 返回 File[]
  }}
/>;

// 禁用态
<FileUpload
  type="multi"
  buttonText="Upload"
  disable={true}
  accept=".png"
  placeHolder="Disabled Multi Upload"
/>
```

### 用户传入FileList

```jsx
import FileUpload from "eview-ui/FileUpload";

// 受控 fileList：业务直接传入 File 对象数组
const fileList = [
  { name: "1.jpg", size: 3210897, type: "image/jpeg" },
  { name: "02.jpg", size: 426239, type: "image/jpeg" },
  { name: "03.jpg", size: 376224, type: "image/jpeg" },
];

const fileUploadStatus = { "1.jpg": "success", "02.jpg": "fail" }; // 文件名: 'loading'/'fail'/'success'
const updateProgressStatus = { "1.jpg": 100, "02.jpg": 100 }; // 文件名: 百分比数字

<FileUpload
  type="multi"
  width="450px"
  maxFileCount={5}
  accept=".png"
  maxSize="100000"
  placeHolder="select the file to upload"
  buttonText="Upload File"
  disable={false}
  fileList={fileList}
  fileUploadStatus={fileUploadStatus}
  updateProgressStatus={updateProgressStatus}
  handleSubmit={({ event, data }) => {
    // 业务自行发请求
  }}
  onChange={(event, itemList) => {
    // itemList: File[]
  }}
  onCancelUpload={() => {}}
  onFileClose={(event) => {
    // event.title 为被移除文件名，需同步从 fileList 中移除
  }}
  onReload={({ event, data }) => {}}
/>;

// 不传 fileList：由组件内部管理
<FileUpload
  type="multi"
  width="450px"
  maxFileCount={5}
  accept=".png"
  maxSize="100000"
  placeHolder="select the file to upload"
  buttonText="Upload File"
  handleSubmit={({ event, data }) => {}}
/>
```
