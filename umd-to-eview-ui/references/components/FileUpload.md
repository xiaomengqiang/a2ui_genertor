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
import LabelField from "eview-ui/LabelField";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class FileUploadExample1 extends React.Component {
  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: "loading",
  };
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      fileUploadStatus: {},
      disable: false,
      fileList: [],
    };
  }

  handleCancel = () => {
    console.log("onCancelUpload callback.");
  };

  handleChange = () => {
    console.log("onchange event callback.");
  };

  handleFileClose = (event) => {
    console.log("onFileClose CallBack: ", event);
  };

  validate = (value) => {
    console.log("files info", this.fileupload.getValue());
    let validationReturnMap = {};
    let validationResult = false;
    validationReturnMap["result"] = validationResult;
    validationReturnMap["message"] = "Custom Validator for Fileupload";
    return validationReturnMap;
  };

  getNameAndVal = (fileName, progress, loadingStatus) => {
    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (
      progress < 100 &&
      loadingStatus != "fail" &&
      this.state.fileUploadStatus[fileName] != "fail"
    ) {
      createVal.fileUploadStatus[fileName] = "loading";
    } else if (
      progress == 100 &&
      this.state.fileUploadStatus[fileName] != "fail"
    ) {
      createVal.fileUploadStatus[fileName] = "success";
    } else if (
      progress != 100 ||
      this.state.fileUploadStatus[fileName] == "fail"
    ) {
      createVal.fileUploadStatus[fileName] = "fail";
      createVal.value[fileName] = 100;
    }
    return createVal;
  };

  uploadCallback = (obj) => {
    console.log("uploadCallback: ", this.fileupload.getValue());

    if (obj) {
      let fileName = obj.data[0].name;
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 5000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 70)), 5500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 100)), 6000);
    }
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LabelField text="Default Type:" style={labelStyle} />
          <FileUpload
            type="single"
            width={"450px"}
            enableProgress={true}
            disable={this.state.disable}
            fileUploadStatus={this.state.fileUploadStatus}
            accept=".png"
            updateProgressStatus={this.state.value}
            buttonText="Upload File"
            ref={(fileupload) => {
              this.fileupload = fileupload;
            }}
            maxSize={"100000"}
            placeHolder="select the file to upload"
            handleSubmit={this.uploadCallback}
            onChange={this.handleChange}
            onCancelUpload={this.handleCancel}
            onFileClose={this.handleFileClose}
            onReload={this.handleReload}
            fileList={this.state.fileList}
          />

          <br />
          <br />
          <LabelField text="Validation Input Type:" style={labelStyle} />
          <FileUpload
            type="single"
            width={"450px"}
            enableProgress={true}
            disable={this.state.disable}
            fileUploadStatus={this.state.fileUploadStatus}
            accept=".png"
            updateProgressStatus={this.state.value}
            buttonText="Upload File"
            ref={(fileupload) => {
              this.fileupload = fileupload;
            }}
            validator={this.validate}
            placeHolder="select the file to upload"
            handleSubmit={this.uploadCallback}
            onChange={this.handleChange}
            onCancelUpload={this.handleCancel}
            onFileClose={this.handleFileClose}
            onReload={this.handleReload}
          />

          <br />
          <br />
          <LabelField text="Disabled Type:" style={labelStyle} />
          <FileUpload
            type="single"
            buttonText="Upload"
            disable={true}
            accept=".png"
            placeHolder="Disabled Single Upload"
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<FileUploadExample1 />, mountNode);
```

### 多选

```jsx
import FileUpload from "eview-ui/FileUpload";
import Button from "eview-ui/Button";
import ButtonGroup from "eview-ui/ButtonGroup";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class FileUploadExample2 extends React.Component {
  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: "loading",
  };

  constructor(props) {
    super(props);
    this.state = { value: {}, fileUploadStatus: {} };
  }

  handleCancel = (event) => {
    console.log("onCancelUpload callback: ", event);
    this.setState({ value: {}, fileUploadStatus: {} });
  };
  handleReload = (obj) => {
    let fileName = "";
    for (let i = 0; i < obj.data.length; i++) {
      console.log("onReload callback: ", obj.data[i]);
      if (obj.data[i].name == obj.event.title) {
        fileName = obj.data[i].name;
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 3000);
        setTimeout(
          () => this.setState(this.getNameAndVal(fileName, 100)),
          3500,
        );
      }
    }
  };

  getNameAndVal = (fileName, progress, loadingStatus) => {
    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (progress < 100 && loadingStatus != "fail") {
      createVal.fileUploadStatus[fileName] = "loading";
    } else if (progress != 100) {
      createVal.fileUploadStatus[fileName] = "fail";
    } else if (progress == 100) {
      createVal.fileUploadStatus[fileName] = "success";
    }
    return createVal;
  };

  getNameAndValMulti = (files, progress, isFailed) => {
    let createVal = { value: {}, fileUploadStatus: {} };
    for (let file in files) {
      createVal.value[files[file].name] = progress;
      if (isFailed == true && file == 0) {
        createVal.value[files[file].name] = progress;
        createVal.fileUploadStatus[files[file].name] = "fail";
      } else if (progress < 100) {
        createVal.fileUploadStatus[files[file].name] = "loading";
      } else if (progress == 100) {
        createVal.value[files[file].name] = progress;
        createVal.fileUploadStatus[files[file].name] = "success";
      }
    }
    return createVal;
  };

  successfullyUploaded = (evt) => {
    console.log(evt);
  };

  changeReadyState = (xhr, files) => {
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 25)), 500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 40)), 1000);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 50)), 1500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 65)), 2000);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 80)), 2500);
    setTimeout(
      () => this.setState(this.getNameAndValMulti(files, 100, true)),
      2500,
    );
  };

  uploadMultiCallback = (obj) => {
    console.log("handleSubmit callback: ", obj);
    var files = obj.data;
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.onload = this.successfullyUploaded;
    xhr.open("POST", "url", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    for (var file in files) {
      formData.append("uploads", files[file].data);
      console.log(files[file]);
    }
    xhr.onreadystatechange = this.changeReadyState(xhr, files);
    xhr.send(formData);
  };

  handleClickGetValue = () => {
    console.log("getValue API : ", this.fileUpload.getValue());
  };

  handleClickGetValueEx = () => {
    console.log("getValueEx API : ", this.fileUpload.getValueEx());
  };

  handleFileClose = (event) => {
    console.log("onFileClose CallBack: ", event);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { text: "getValue", onClick: this.handleClickGetValue },
      { text: "getValueEx", onClick: this.handleClickGetValueEx },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div>
            <FileUpload
              type="multi"
              maxFileCount={5}
              enableProgress={true}
              disable={false}
              handleSubmit={this.uploadMultiCallback}
              onFileClose={this.handleFileClose}
              fileUploadStatus={this.state.fileUploadStatus}
              updateProgressStatus={this.state.value}
              buttonText="Upload Multiple Files"
              onCancelUpload={this.handleCancel}
              onReload={this.handleReload}
              ref={(fileUpload) => (this.fileUpload = fileUpload)}
            />
          </div>
          <br />
          <br />
          <ButtonGroup data={data} />
          <br />
          <br />
          <FileUpload
            type="multi"
            buttonText="Upload"
            disable={true}
            accept=".png"
            placeHolder="Disabled Multi Upload"
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<FileUploadExample2 />, mountNode);
```

### 用户传入FileList

```jsx
import FileUpload from "eview-ui/FileUpload";
import LabelField from "eview-ui/LabelField";
import Button from "eview-ui/Button";
import ButtonGroup from "eview-ui/ButtonGroup";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class FileUploadExampleFileList extends React.Component {
  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: "loading",
  };
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      fileUploadStatus: {},
      disable: false,
      fileList: [],
      _fileList: [],
    };
    this.ids = [];
  }

  handleCancel = () => {
    console.log("onCancelUpload callback.");
    this.ids.forEach((id) => {
      clearTimeout(id);
    });
    this.setState({ fileList: [], fileUploadStatus: {}, value: {} });
  };

  handleChange = (event, fileList) => {
    console.log("onchange event callback.");
    const list = this.fileupload.state.fileItems;
    console.log("fileItems", list);
    console.log("fileList", fileList);
    this.setState({ _fileList: list });
  };

  handleFileClose = (event) => {
    console.log("onFileClose CallBack: ", event);
    const itemList = [...this.state.fileList];
    const fileUploadStatus = { ...this.state.fileUploadStatus };
    this.state.fileList.forEach((item, key) => {
      if (item.name === event.title) {
        itemList.splice(key, 1);
        fileUploadStatus[item.name] && delete fileUploadStatus[item.name];
      }
    });
    this.setState({ fileList: itemList, fileUploadStatus });
  };

  validate = (value) => {
    console.log("files info", this.fileupload.getValue());
    let validationReturnMap = {};
    let validationResult = false;
    validationReturnMap["result"] = validationResult;
    validationReturnMap["message"] = "Custom Validator for Fileupload";
    return validationReturnMap;
  };

  getNameAndVal = (fileName, progress, loadingStatus) => {
    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (
      progress < 100 &&
      loadingStatus != "fail" &&
      this.state.fileUploadStatus[fileName] != "fail"
    ) {
      createVal.fileUploadStatus[fileName] = "loading";
    } else if (
      progress == 100 &&
      this.state.fileUploadStatus[fileName] != "fail"
    ) {
      createVal.fileUploadStatus[fileName] = "success";
    } else if (
      progress != 100 ||
      this.state.fileUploadStatus[fileName] == "fail"
    ) {
      createVal.fileUploadStatus[fileName] = "fail";
      createVal.value[fileName] = 100;
    }
    return createVal;
  };

  uploadCallback = (obj) => {
    console.log("uploadCallback: ", this.fileupload.getValue());

    if (obj) {
      let fileName = obj.data[0].name;
      this.ids.push(
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500),
      );
      this.ids.push(
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000),
      );
      this.ids.push(
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500),
      );
      this.ids.push(
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000),
      );
      this.ids.push(
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500),
      );
      this.ids.push(
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 5000),
      );
      this.ids.push(
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 70)), 5500),
      );
      this.ids.push(
        setTimeout(
          () => this.setState(this.getNameAndVal(fileName, 100)),
          6000,
        ),
      );
    }
  };
  chanegFileList = () => {
    this.setState({
      fileList: [
        {
          lastModified: 1482992252295,
          name: "1.jpg",
          size: 3210897,
          type: "image/jpeg",
          webkitRelativePath: "",
          width: "43px",
        },
        {
          lastModified: 1465174942171,
          name: "02.jpg",
          size: 426239,
          type: "image/jpeg",
          webkitRelativePath: "",
          width: "52px",
        },
        {
          lastModified: 1482992252307,
          name: "03.jpg",
          size: 376224,
          type: "image/jpeg",
          webkitRelativePath: "",
          width: "52px",
        },
      ],
    });
  };
  clearFileList = () => {
    this.setState({ fileList: [] });
  };
  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let data = [
      {
        text:
          window.eui_oh_locale === "zh"
            ? "用户传入FileList"
            : "User custom Filelist",
        onClick: this.chanegFileList,
      },
      {
        text:
          window.eui_oh_locale === "zh"
            ? "清空FileList"
            : "User clear Filelist",
        onClick: this.clearFileList,
      },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <ButtonGroup data={data} />
          <div>
            <LabelField text="Default Type:" style={labelStyle} />
          </div>
          <FileUpload
            type="multi"
            width={"450px"}
            maxFileCount={5}
            enableProgress={true}
            disable={this.state.disable}
            fileUploadStatus={this.state.fileUploadStatus}
            accept=".png"
            updateProgressStatus={this.state.value}
            buttonText="Upload File"
            ref={(fileupload) => {
              this.fileupload = fileupload;
            }}
            maxSize={"100000"}
            placeHolder="select the file to upload"
            handleSubmit={this.uploadCallback}
            onChange={this.handleChange}
            onCancelUpload={this.handleCancel}
            onFileClose={this.handleFileClose}
            onReload={this.handleReload}
            fileList={this.state.fileList}
          />
          <br />
          <br />
          <FileUpload
            type="multi"
            width={"450px"}
            maxFileCount={5}
            enableProgress={true}
            disable={this.state.disable}
            fileUploadStatus={this.state.fileUploadStatus}
            accept=".png"
            updateProgressStatus={this.state.value}
            buttonText="Upload File"
            ref={(fileupload) => {
              this.fileupload = fileupload;
            }}
            maxSize={"100000"}
            placeHolder="select the file to upload"
            handleSubmit={this.uploadCallback}
            onChange={this.handleChange}
            onCancelUpload={this.handleCancel}
            onFileClose={this.handleFileClose}
            onReload={this.handleReload}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<FileUploadExampleFileList />, mountNode);
```
