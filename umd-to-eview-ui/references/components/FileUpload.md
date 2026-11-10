# FileUpload 文件上传

> 分类：数据录入

文件上传组件，内置了4个状态，可根据不同的状态设置不同的提示，且支持上传进度条。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Upload` | `FileUpload` | **组件不发请求**——`handleSubmit({event, data})` 业务自己发；`fileList` 受控；`maxFileCount` 默认 10；**`disable`（不是 disabled）**、**`placeHolder`（大写 H）**、**`upLoadErrorMessage`/`upLoadSuccessMessage`**（upLoad 拼写）；上传状态回写 `fileUploadStatus={文件名: 'loading'/'fail'/'success'}` + 进度 `updateProgressStatus={文件名: '百分比'}`；`onReload` 重传；ref：`getValue`/`getValueEx`/`setFileList` |

## API

|方法名|参数|返回值|描述|
|---|---|---|---|---|
|getValue|无|文件对象|获取当前用户上传的文件对象|
|getValueEx|None|File Objects|Get the current user uploaded file objects|
|setFileList|fileList数组|无|手动设置fileList|

### 属性

| 属性名称 | 描述                                                                                                                                                                                                                                                                                                                                                                                          | 输入 | 默认 |
|:-----|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----|:-----|
| id | Custom组件id, 定义id将覆盖组件生成自动 ,例如: id = 'eui_fileUpload_1001'                                                                                                                                                                                                                                                                                                                                   | string | null |
| className | 定制组件类, 通过在上添加类组件默认风格定制的组件样式 例如: className = 'FileuploadUpdateClassName'                                                                                                                                                                                                                                                                                                                     | string |  |
| style | 增加File Upload风格的定制类                                                                                                                                                                                                                                                                                                                                                                         | object |  |
| disable | 设置开启或关闭File Upload                                                                                                                                                                                                                                                                                                                                                                          | bool | false |
| display | 要显示或隐藏文件上传                                                                                                                                                                                                                                                                                                                                                                                  | bool | true |
| type | 选择单个或多个文件.                                                                                                                                                                                                                                                                                                                                                                                  | string | 'single' |
| accept | 支持的过滤文件选择.                                                                                                                                                                                                                                                                                                                                                                                  | string | '' |
| maxSize | 指定输入文件的最大大小限制。默认单位为'字节'。                                                                                                                                                                                                                                                                                                                                                                    | string | '' |
| validator | 设置自定义校验规则<br><br>**签名:**<br>`function(value: value,id: id, type: type) => Object`<br>*value:* 用户输入值<br>*id:* ID of component which generate this.<br> *type:* if its triggered by "onChange" or "onBlur"<br><br> *returns* (Object): validationReturnMap={'result'：result,'message':message}  <br>result {bool} 用来设置校验是否有错误 <br>message {string} 用来设置错误提示的文本信息 <br>result和message，不能更换为其他字段 | function |  |
| width | 设置宽度.                                                                                                                                                                                                                                                                                                                                                                                       | string | '350px' |
| updateProgressStatus | 更新进度值百分比 .Ex: updateProgressStatus={'10'}                                                                                                                                                                                                                                                                                                                                                   | object | {} |
| placeHolder | 自定义placeHolder                                                                                                                                                                                                                                                                                                                                                                              | string |  |
| handleSubmit | 如果用户选择的文件上传.                                                                                                                                                                                                                                                                                                                                                                                | function |  |
| hideUploadButton | 隐藏上传按钮.                                                                                                                                                                                                                                                                                                                                                                                     | Bool | false |
| hideReload | 在文件上传失败时隐藏重试图标.                                                                                                                                                                                                                                                                                                                                                                             | Bool | false |
| formatter | 格式文件大小size与文件maxsize值显示。签名:`(value: number, precision: number) => string` | function | `(value, precision) => value.toFixed(precision)` |
| onFileClose | Callback when file is removed.                                                                                                                                                                                                                                                                                                                                                              | function |  |
| onCancelUpload | Callback when file upload is cancelled.                                                                                                                                                                                                                                                                                                                                                     | function |  |
| fileUploadStatus | 设置文件upoloading状态 ,上传状态和加载''失败''成功'                                                                                                                                                                                                                                                                                                                                                          | object | {} |
| maxFileCount | 定制文件的最大值,可以上传, 默认为 10 , 示例: maxFileCount = 1 . 本特性支持多种文件类型时                                                                                                                                                                                                                                                                                                                                 | number | 10 |
| buttonText | 设置按钮的名称。英语默认名称 'Upload' 中国 '上传'                                                                                                                                                                                                                                                                                                                                                             | string |  |
| buttonStyle | Custom风格, 例如: style = {{width:'100px'}}                                                                                                                                                                                                                                                                                                                                                     | object |  |
| showFileSize | 隐藏文件项的文件大小                                                                                                                                                                                                                                                                                                                                                                                  | bool | true |
| displayToolTip | 隐藏自定义工具提示                                                                                                                                                                                                                                                                                                                                                                                   | bool | false |
| tipText | 支持自定义提示信息                                                                                                                                                                                                                                                                                                                                                                                   | string |  |
| disableLinks | 默认在文件上传过程中会展示取消按钮。该属性设置为true时，则不展示                                                                                                                                                                                                                                                                                                                                                          | boolean | false |
| upLoadErrorMessage | 上传失败提示信息                                                                                                                                                                                                                                                                                                                                                                                    | ReactNode |  |
| upLoadErrorClassName | 定制上传失败提示信息样式                                                                                                                                                                                                                                                                                                                                                                                | string |  |
| upLoadSuccessMessage | 上传成功提示信息                                                                                                                                                                                                                                                                                                                                                                                    | ReactNode |  |
| upLoadSuccessClassName | 定制上传成功提示信息样式                                                                                                                                                                                                                                                                                                                                                                                | string |  |
| onChange | 文件选择事件                                                                                                                                                                                                                                                                                                                                                                                      | (event: React.ChangeEvent<HTMLInputElement>, itemList: File[]) => void |  |
| onReload | 文件重新上传事件                                                                                                                                                                                                                                                                                                                                                                                    | (event: {<br>event: fileReload;<br>data: File[];<br>}) => void |  |
| fileList | 从props中传入文件                                                                                                                                                                                                                                                                                                                                                                                 | file[] | []

## 使用示例

### 单选

## en-US



```jsx
import FileUpload from 'eview-ui/FileUpload';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class FileUploadExample1 extends React.Component {

  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: 'loading',
  }
  constructor(props) {
    super(props);
    this.state = { value: {}, fileUploadStatus: {}, disable: false, fileList: [] };
  }

  handleCancel = () => {
    console.log('onCancelUpload callback.');
  }

  handleChange = () => {
    console.log('onchange event callback.');
  }

  handleFileClose = (event) => {
    console.log('onFileClose CallBack: ', event);
  }

  validate = (value) => {
    console.log("files info", this.fileupload.getValue());
    let validationReturnMap = {};
    let validationResult = false;
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Custom Validator for Fileupload";
    return validationReturnMap;
  };

  getNameAndVal = (fileName, progress, loadingStatus) => {

    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (progress < 100 && loadingStatus != 'fail' && this.state.fileUploadStatus[fileName] != 'fail') {
      createVal.fileUploadStatus[fileName] = "loading";
    }
    else if (progress == 100 && this.state.fileUploadStatus[fileName] != "fail") {
      createVal.fileUploadStatus[fileName] = "success";
    }
    else if (progress != 100 || this.state.fileUploadStatus[fileName] == 'fail') {
      createVal.fileUploadStatus[fileName] = "fail";
      createVal.value[fileName] = 100;
    }
    return createVal;
  }

  uploadCallback = (obj) => {

    console.log("uploadCallback: ", this.fileupload.getValue());

    if (obj) {
      let fileName = obj.data[0].name
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 5000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 70)), 5500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 100)), 6000);
    }
  }

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div >
          <LabelField text="Default Type:" style={labelStyle} />
          <FileUpload type='single' width={'450px'} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} maxSize={'100000'}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} fileList={this.state.fileList}/>

          <br /><br />
          <LabelField text="Validation Input Type:" style={labelStyle} />
          <FileUpload type='single' width={'450px'} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} validator={this.validate}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} />

          <br /><br />
          <LabelField text="Disabled Type:" style={labelStyle} />
          <FileUpload type='single' buttonText='Upload' disable={true} accept=".png" placeHolder='Disabled Single Upload' />

        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<FileUploadExample1 />, mountNode);

```

```jsx
import FileUpload from 'eview-ui/FileUpload';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class FileUploadExample1 extends React.Component {

  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: 'loading',
  }
  constructor(props) {
    super(props);
    this.state = { value: {}, fileUploadStatus: {}, disable: false, fileList: [] };
  }

  handleCancel = () => {
    console.log('onCancelUpload callback.');
  }

  handleChange = () => {
    console.log('onchange event callback.');
  }

  handleFileClose = (event) => {
    console.log('onFileClose CallBack: ', event);
  }

  validate = (value) => {
    console.log("files info", this.fileupload.getValue());
    let validationReturnMap = {};
    let validationResult = false;
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Custom Validator for Fileupload";
    return validationReturnMap;
  };

  getNameAndVal = (fileName, progress, loadingStatus) => {

    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (progress < 100 && loadingStatus != 'fail' && this.state.fileUploadStatus[fileName] != 'fail') {
      createVal.fileUploadStatus[fileName] = "loading";
    }
    else if (progress == 100 && this.state.fileUploadStatus[fileName] != "fail") {
      createVal.fileUploadStatus[fileName] = "success";
    }
    else if (progress != 100 || this.state.fileUploadStatus[fileName] == 'fail') {
      createVal.fileUploadStatus[fileName] = "fail";
      createVal.value[fileName] = 100;
    }
    return createVal;
  }

  uploadCallback = (obj) => {

    console.log("uploadCallback: ", this.fileupload.getValue());

    if (obj) {
      let fileName = obj.data[0].name
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 5000);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 70)), 5500);
      setTimeout(() => this.setState(this.getNameAndVal(fileName, 100)), 6000);
    }
  }

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div >
          <LabelField text="Default Type:" style={labelStyle} />
          <FileUpload type='single' width={'450px'} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} maxSize={'100000'}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} fileList={this.state.fileList}/>

          <br /><br />
          <LabelField text="Validation Input Type:" style={labelStyle} />
          <FileUpload type='single' width={'450px'} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} validator={this.validate}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} />

          <br /><br />
          <LabelField text="Disabled Type:" style={labelStyle} />
          <FileUpload type='single' buttonText='Upload' disable={true} accept=".png" placeHolder='Disabled Single Upload' />

        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<FileUploadExample1 />, mountNode);

```

### 多选

## en-US



```jsx
import FileUpload from 'eview-ui/FileUpload';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class FileUploadExample2 extends React.Component {

  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: 'loading',
  }

  constructor(props) {
    super(props);
    this.state = { value: {}, fileUploadStatus: {} };
  }

  handleCancel = (event) => {
    console.log("onCancelUpload callback: ", event);
    this.setState({ value: {}, fileUploadStatus: {} });

  }
  handleReload = (obj) => {
    let fileName = "";
    for (let i = 0; i < obj.data.length; i++) {
      console.log("onReload callback: ", obj.data[i]);
      if (obj.data[i].name == obj.event.title) {
        fileName = obj.data[i].name
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 3000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 100)), 3500);
      }
    }
  }

  getNameAndVal = (fileName, progress, loadingStatus) => {

    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (progress < 100 && loadingStatus != 'fail') {
      createVal.fileUploadStatus[fileName] = 'loading';
    }
    else if (progress != 100) {
      createVal.fileUploadStatus[fileName] = 'fail';
    }
    else if (progress == 100) {
      createVal.fileUploadStatus[fileName] = 'success';
    }
    return createVal;
  }

  getNameAndValMulti = (files, progress, isFailed) => {
    let createVal = { value: {}, fileUploadStatus: {} };
    for (let file in files) {
      createVal.value[files[file].name] = progress;
      if (isFailed == true && file == 0) {
        createVal.value[files[file].name] = progress;
        createVal.fileUploadStatus[files[file].name] = 'fail';
      }
      else if (progress < 100) {
        createVal.fileUploadStatus[files[file].name] = 'loading';

      }
      else if (progress == 100) {
        createVal.value[files[file].name] = progress;
        createVal.fileUploadStatus[files[file].name] = 'success';
      }
    }
    return createVal;
  }

  successfullyUploaded = (evt) => {
    console.log(evt);
  }

  changeReadyState = (xhr, files) => {
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 25)), 500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 40)), 1000);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 50)), 1500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 65)), 2000);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 80)), 2500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 100, true)), 2500);
  }

  uploadMultiCallback = (obj) => {
    console.log("handleSubmit callback: ", obj);
    var files = obj.data;
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.onload = this.successfullyUploaded;
    xhr.open("POST", "url", true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    for (var file in files) {
      formData.append("uploads", files[file].data);
      console.log(files[file]);
    }
    xhr.onreadystatechange = this.changeReadyState(xhr, files);
    xhr.send(formData);
  }

  handleClickGetValue = () => {
    console.log("getValue API : ", this.fileUpload.getValue());
  };

  handleClickGetValueEx = () => {
    console.log("getValueEx API : ", this.fileUpload.getValueEx());
  };

  handleFileClose = (event) => {
    console.log('onFileClose CallBack: ', event);
  }

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { text: 'getValue', onClick: this.handleClickGetValue },
      { text: 'getValueEx', onClick: this.handleClickGetValueEx },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div >
            <FileUpload type='multi' maxFileCount={5} enableProgress={true} disable={false} handleSubmit={this.uploadMultiCallback}
              onFileClose={this.handleFileClose} fileUploadStatus={this.state.fileUploadStatus} updateProgressStatus={this.state.value}
              buttonText='Upload Multiple Files' onCancelUpload={this.handleCancel} onReload={this.handleReload}
              ref={(fileUpload) => this.fileUpload = fileUpload} />
          </div>
          <br /><br />
          <ButtonGroup data={data}/>
          <br /><br />
          <FileUpload type='multi' buttonText='Upload' disable={true} accept=".png" placeHolder='Disabled Multi Upload' />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<FileUploadExample2 />, mountNode);

```

```jsx
import FileUpload from 'eview-ui/FileUpload';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';


export default class FileUploadExample2 extends React.Component {

  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: 'loading',
  }

  constructor(props) {
    super(props);
    this.state = { value: {}, fileUploadStatus: {} };
  }

  handleCancel = (event) => {
    console.log("onCancelUpload callback: ", event);
    this.setState({ value: {}, fileUploadStatus: {} });

  }
  handleReload = (obj) => {
    let fileName = "";
    for (let i = 0; i < obj.data.length; i++) {
      console.log("onReload callback: ", obj.data[i]);
      if (obj.data[i].name == obj.event.title) {
        fileName = obj.data[i].name
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 3000);
        setTimeout(() => this.setState(this.getNameAndVal(fileName, 100)), 3500);
      }
    }
  }

  getNameAndVal = (fileName, progress, loadingStatus) => {

    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (progress < 100 && loadingStatus != 'fail') {
      createVal.fileUploadStatus[fileName] = 'loading';
    }
    else if (progress != 100) {
      createVal.fileUploadStatus[fileName] = 'fail';
    }
    else if (progress == 100) {
      createVal.fileUploadStatus[fileName] = 'success';
    }
    return createVal;
  }

  getNameAndValMulti = (files, progress, isFailed) => {
    let createVal = { value: {}, fileUploadStatus: {} };
    for (let file in files) {
      createVal.value[files[file].name] = progress;
      if (isFailed == true && file == 0) {
        createVal.value[files[file].name] = progress;
        createVal.fileUploadStatus[files[file].name] = 'fail';
      }
      else if (progress < 100) {
        createVal.fileUploadStatus[files[file].name] = 'loading';

      }
      else if (progress == 100) {
        createVal.value[files[file].name] = progress;
        createVal.fileUploadStatus[files[file].name] = 'success';
      }
    }
    return createVal;
  }

  successfullyUploaded = (evt) => {
    console.log(evt);
  }

  changeReadyState = (xhr, files) => {
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 25)), 500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 40)), 1000);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 50)), 1500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 65)), 2000);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 80)), 2500);
    setTimeout(() => this.setState(this.getNameAndValMulti(files, 100, true)), 2500);
  }

  uploadMultiCallback = (obj) => {
    console.log("handleSubmit callback: ", obj);
    var files = obj.data;
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.onload = this.successfullyUploaded;
    xhr.open("POST", "url", true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    for (var file in files) {
      formData.append("uploads", files[file].data);
      console.log(files[file]);
    }
    xhr.onreadystatechange = this.changeReadyState(xhr, files);
    xhr.send(formData);
  }

  handleClickGetValue = () => {
    console.log("getValue API : ", this.fileUpload.getValue());
  };

  handleClickGetValueEx = () => {
    console.log("getValueEx API : ", this.fileUpload.getValueEx());
  };

  handleFileClose = (event) => {
    console.log('onFileClose CallBack: ', event);
  }

  render() {
    const [version, theme] = getDemoVersion();
    let data = [
      { text: 'getValue', onClick: this.handleClickGetValue },
      { text: 'getValueEx', onClick: this.handleClickGetValueEx },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div >
            <FileUpload type='multi' maxFileCount={5} enableProgress={true} disable={false} handleSubmit={this.uploadMultiCallback}
              onFileClose={this.handleFileClose} fileUploadStatus={this.state.fileUploadStatus} updateProgressStatus={this.state.value}
              buttonText='Upload Multiple Files' onCancelUpload={this.handleCancel} onReload={this.handleReload}
              ref={(fileUpload) => this.fileUpload = fileUpload} />
          </div>
          <br /><br />
          <ButtonGroup data={data}/>
          <br /><br />
          <FileUpload type='multi' buttonText='Upload' disable={true} accept=".png" placeHolder='Disabled Multi Upload' />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<FileUploadExample2 />, mountNode);

```

### 用户传入FileList

## en-US



```jsx
import FileUpload from 'eview-ui/FileUpload';
import LabelField from 'eview-ui/LabelField';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class FileUploadExampleFileList extends React.Component {

  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: 'loading',
  }
  constructor(props) {
    super(props);
    this.state = { value: {}, fileUploadStatus: {}, disable: false, fileList: [], _fileList: [] };
    this.ids = [];
  }

  handleCancel = () => {
    console.log('onCancelUpload callback.');
    this.ids.forEach((id)=>{
      clearTimeout(id);
    })
    this.setState({fileList:[],fileUploadStatus: {},value:{}});
  }

  handleChange = (event, fileList) => {
    console.log('onchange event callback.');
    const list = this.fileupload.state.fileItems;
    console.log('fileItems', list);
    console.log('fileList', fileList);
    this.setState({_fileList: list});
  }

  handleFileClose = (event) => {
    console.log('onFileClose CallBack: ', event);
    const itemList = [...this.state.fileList];
    const fileUploadStatus = { ...this.state.fileUploadStatus };
    this.state.fileList.forEach((item, key) => {
      if (item.name === event.title) {
        itemList.splice(key, 1);
        fileUploadStatus[item.name] && delete fileUploadStatus[item.name];
      }
    });
    this.setState({ fileList: itemList, fileUploadStatus });
  }

  validate = (value) => {
    console.log("files info", this.fileupload.getValue());
    let validationReturnMap = {};
    let validationResult = false;
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Custom Validator for Fileupload";
    return validationReturnMap;
  };

  getNameAndVal = (fileName, progress, loadingStatus) => {

    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (progress < 100 && loadingStatus != 'fail' && this.state.fileUploadStatus[fileName] != 'fail') {
      createVal.fileUploadStatus[fileName] = "loading";
    }
    else if (progress == 100 && this.state.fileUploadStatus[fileName] != "fail") {
      createVal.fileUploadStatus[fileName] = "success";
    }
    else if (progress != 100 || this.state.fileUploadStatus[fileName] == 'fail') {
      createVal.fileUploadStatus[fileName] = "fail";
      createVal.value[fileName] = 100;
    }
    return createVal;
  }

  uploadCallback = (obj) => {

    console.log("uploadCallback: ", this.fileupload.getValue());

    if (obj) {
      let fileName = obj.data[0].name
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 5000));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 70)), 5500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 100)), 6000));
    }
  }
  chanegFileList = () => {
      this.setState({fileList: [
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
            }
      ]})
  }
  clearFileList = () => {
      this.setState({fileList: []});
  }
  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let data = [
      { text: window.eui_oh_locale === 'zh' ? '用户传入FileList' : 'User custom Filelist', onClick: this.chanegFileList },
      { text: window.eui_oh_locale === 'zh' ? '清空FileList' : 'User clear Filelist', onClick: this.clearFileList },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div >
          <ButtonGroup data={data}/>
          <div><LabelField text="Default Type:" style={labelStyle}/></div>
          <FileUpload type='multi' width={'450px'} maxFileCount={5} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} maxSize={'100000'}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} fileList={this.state.fileList}/>
          <br/>
          <br/>
          <FileUpload type='multi' width={'450px'} maxFileCount={5} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} maxSize={'100000'}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<FileUploadExampleFileList />, mountNode);

```

```jsx
import FileUpload from 'eview-ui/FileUpload';
import LabelField from 'eview-ui/LabelField';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class FileUploadExampleFileList extends React.Component {

  static defaultProps = {
    disable: false,
    display: true,
    enableProgress: false,
    fileUploadStatus: 'loading',
  }
  constructor(props) {
    super(props);
    this.state = { value: {}, fileUploadStatus: {}, disable: false, fileList: [], _fileList: [] };
    this.ids = [];
  }

  handleCancel = () => {
    console.log('onCancelUpload callback.');
    this.ids.forEach((id)=>{
      clearTimeout(id);
    })
    this.setState({fileList:[],fileUploadStatus: {},value:{}});
  }

  handleChange = (event, fileList) => {
    console.log('onchange event callback.');
    const list = this.fileupload.state.fileItems;
    console.log('fileItems', list);
    console.log('fileList', fileList);
    this.setState({_fileList: list});
  }

  handleFileClose = (event) => {
    console.log('onFileClose CallBack: ', event);
    const itemList = [...this.state.fileList];
    const fileUploadStatus = { ...this.state.fileUploadStatus };
    this.state.fileList.forEach((item, key) => {
      if (item.name === event.title) {
        itemList.splice(key, 1);
        fileUploadStatus[item.name] && delete fileUploadStatus[item.name];
      }
    });
    this.setState({ fileList: itemList, fileUploadStatus });
  }

  validate = (value) => {
    console.log("files info", this.fileupload.getValue());
    let validationReturnMap = {};
    let validationResult = false;
    validationReturnMap['result'] = validationResult;
    validationReturnMap['message'] = "Custom Validator for Fileupload";
    return validationReturnMap;
  };

  getNameAndVal = (fileName, progress, loadingStatus) => {

    let createVal = { value: {}, fileUploadStatus: {} };
    createVal.value[fileName] = progress;
    if (progress < 100 && loadingStatus != 'fail' && this.state.fileUploadStatus[fileName] != 'fail') {
      createVal.fileUploadStatus[fileName] = "loading";
    }
    else if (progress == 100 && this.state.fileUploadStatus[fileName] != "fail") {
      createVal.fileUploadStatus[fileName] = "success";
    }
    else if (progress != 100 || this.state.fileUploadStatus[fileName] == 'fail') {
      createVal.fileUploadStatus[fileName] = "fail";
      createVal.value[fileName] = 100;
    }
    return createVal;
  }

  uploadCallback = (obj) => {

    console.log("uploadCallback: ", this.fileupload.getValue());

    if (obj) {
      let fileName = obj.data[0].name
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 10)), 500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 20)), 1000));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 30)), 1500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 40)), 2000));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 50)), 2500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 60)), 5000));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 70)), 5500));
      this.ids.push(setTimeout(() => this.setState(this.getNameAndVal(fileName, 100)), 6000));
    }
  }
  chanegFileList = () => {
      this.setState({fileList: [
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
            }
      ]})
  }
  clearFileList = () => {
      this.setState({fileList: []});
  }
  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = { display: "block", paddingLeft: "0px" };
    let data = [
      { text: window.eui_oh_locale === 'zh' ? '用户传入FileList' : 'User custom Filelist', onClick: this.chanegFileList },
      { text: window.eui_oh_locale === 'zh' ? '清空FileList' : 'User clear Filelist', onClick: this.clearFileList },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div >
          <ButtonGroup data={data}/>
          <div><LabelField text="Default Type:" style={labelStyle}/></div>
          <FileUpload type='multi' width={'450px'} maxFileCount={5} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} maxSize={'100000'}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} fileList={this.state.fileList}/>
          <br/>
          <br/>
          <FileUpload type='multi' width={'450px'} maxFileCount={5} enableProgress={true} disable={this.state.disable} fileUploadStatus={this.state.fileUploadStatus} accept=".png"
            updateProgressStatus={this.state.value} buttonText='Upload File' ref={fileupload => { this.fileupload = fileupload }} maxSize={'100000'}
            placeHolder='select the file to upload' handleSubmit={this.uploadCallback} onChange={this.handleChange} onCancelUpload={this.handleCancel} onFileClose={this.handleFileClose}
            onReload={this.handleReload} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<FileUploadExampleFileList />, mountNode);

```

