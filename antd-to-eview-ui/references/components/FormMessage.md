# FormMessage 表单提示

> 分类：反馈

FormMessage主要用于表单提示信息提示，支持自定义组件样式，图标样式，自定义图标，自定义文本内容。

## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  默认设置动态id，支持用户自定义id | string |  |
| className |  支持通过className设置组件样式 | string |  |
| style |  支持通过style设置组件样式，如：style={{color:'red'}} | React.CSSProperties |  |
| icon |  支持通过icon设置组件图标，icon为url组件图标默认符合AUI2.0规范，图片大小为16*16 | string |  |
| iconClassName |  支持通过iconClassName设置组件图标样式 | string |  |
| text |  支持通过text设置消息框文本内容,text支持任意类型 | any |  |
| type |  支持通过type设置组件类型 | enum:<br>&nbsp;'error'<br>&nbsp;'success'<br>&nbsp;'default'<br> | "default" |

## 使用示例

### 基本属性设置

## en-US



```jsx
import FormMessage from 'eview-ui/FormMessage';
import imgPicture from '@images/filter.png';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class FormMessageExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "10px"}}>
          <div>
            <FormMessage type="default" text="Default style" style={{width: "200px"}}/>
          </div>
          <div>
            <FormMessage type="success" text="Success" style={{width: "200px"}}/>
          </div>
          <div>
            <FormMessage type="error" text="Failure" style={{width: "200px"}}/>
          </div>
          <div>
            <FormMessage type="error" text="Support custom icons" style={{width: "200px"}} icon={imgPicture}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<FormMessageExample />, mountNode);

```

```jsx
import FormMessage from 'eview-ui/FormMessage';
import imgPicture from '@images/filter.png';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class FormMessageExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "10px"}}>
          <div>
            <FormMessage type="default" text="Default style" style={{width: "200px"}}/>
          </div>
          <div>
            <FormMessage type="success" text="Success" style={{width: "200px"}}/>
          </div>
          <div>
            <FormMessage type="error" text="Failure" style={{width: "200px"}}/>
          </div>
          <div>
            <FormMessage type="error" text="Support custom icons" style={{width: "200px"}} icon={imgPicture}/>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<FormMessageExample />, mountNode);

```

