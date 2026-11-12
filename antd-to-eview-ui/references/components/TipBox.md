# TipBox Tip提示

> 分类：数据展示

TipBox组件一般用于图表，表单，文本信息提示，支持自定义样式，自定义标题与文本，自定义类型，支持display属性设置组件显示与自动消失。

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 | 
|:-----|:-----|:-----|:-----|
| id | 默认支持动态设置id;支持用户自定义设置固定id | string |  |
| className | 支持通过className设置样式 | string |  | 
| style | 支持通过style设置样式 | React.CSSProperties |  |
| title | 支持通过title设置标题 | string |  |
| titleStyle | 支持通过titleStyle设置标题样式 | React.CSSProperties |  |
| disposeTimeOut | 支持通过disposeTimeOut设置显示时间，如果用户给出0毫秒或默认不填，就不会隐藏。    | number | 0 | 
| content | 支持通过text设置内容 | any |  |
| arrowDirection | 支持通过arrowDirection设置箭头方向：上 下 左 右 | enum:<br>&nbsp;'left'<br>&nbsp;'right'<br>&nbsp;'top'<br>&nbsp;'bottom'<br>&nbsp;'none'<br> | 'bottom' |
| position | 支持通过position设置组件定位position = [top,left]，如[20,30] | array |  |
| display | 支持通过display设置组件显示与隐藏 | bool | true |
| isClosable | 根据用户配置关闭信息提示。| bool | false |
| onClose | 自定义点击关闭按钮关闭HelpTip时的回调方法，不传则无回调，例如：onClose={()=>alert('2')}  | function |  |

## 使用示例

### 基本属性设置

## en-US



```jsx
import TipBox from 'eview-ui/TipBox';
import Button from 'eview-ui/Button';
import imgPicture from '@images/error';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
/**
 * You can use TipBox to add the html element's tip.
 * This use case shows how to  how to add a tipbox and use the title of the tipbox.
 */
const data0 = [20, 20];
const data1 = [20, 200];
const data2 = [20, 380];
const data3 = [20, 560];
const data4 = [20, 740];
const data5 = [20, 940];

export default class TipBoxExample extends React.Component {
  state = {
    display: true
  };

  handleClick = () => {
    this.setState({ display: true });
  };
  handleCloseTip = (event: any) => {
    console.log(event)
  }

  render() {
    const [version, theme] = getDemoVersion();
    const style = {width: '160px'};
    const style1 = {width: '180px'};
    const style3 = {color: '#212121'}
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{position: 'relative', margin: '20px', height: '200px'}}>
          <Button onClick={this.handleClick}
                  text="When the TipBox component disappears, click button to display the TipBox"
                  style={{position: 'absolute', left: '10px', bottom: '20px'}}/>
          <TipBox content="有标题，箭头向下" title="tipbox" position={data0} titleStyle={style3} style={style} hintType='tip'/>
          <TipBox content="箭头向下，有关闭按钮" display={this.state.display} position={data1} style={style} isClosable={true}
                  onClose={this.handleCloseTip}/>
          <TipBox content="箭头向左，显示5s后关闭" arrowDirection="left" position={data2} disposeTimeOut={5000} style={style}/>
          <TipBox content="箭头向右，显示5s后关闭" arrowDirection="right" position={data3} disposeTimeOut={5000}
                  style={{right: '550px'}}/>
          <TipBox content="无箭头，鼠标移出后关闭" arrowDirection="none" position={data4} style={style}/>
          <TipBox content={<table>
            <tbody>
            <tr>
              <td><img src={imgPicture}/></td>
              <td>添加图标和内容，箭头向上，</td>
            </tr>
            </tbody>
          </table>} arrowDirection="top" position={data5} style={style1}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TipBoxExample />, mountNode);

```

```jsx
import TipBox from 'eview-ui/TipBox';
import Button from 'eview-ui/Button';
import imgPicture from '@images/error';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
/**
 * You can use TipBox to add the html element's tip.
 * This use case shows how to  how to add a tipbox and use the title of the tipbox.
 */
const data0 = [20, 20];
const data1 = [20, 200];
const data2 = [20, 380];
const data3 = [20, 560];
const data4 = [20, 740];
const data5 = [20, 940];

export default class TipBoxExample extends React.Component {
  state = {
    display: true
  };

  handleClick = () => {
    this.setState({ display: true });
  };
  handleCloseTip = (event: any) => {
    console.log(event)
  }

  render() {
    const [version, theme] = getDemoVersion();
    const style = {width: '160px'};
    const style1 = {width: '180px'};
    const style3 = {color: '#212121'}
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{position: 'relative', margin: '20px', height: '200px'}}>
          <Button onClick={this.handleClick}
                  text="When the TipBox component disappears, click button to display the TipBox"
                  style={{position: 'absolute', left: '10px', bottom: '20px'}}/>
          <TipBox content="有标题，箭头向下" title="tipbox" position={data0} titleStyle={style3} style={style} hintType='tip'/>
          <TipBox content="箭头向下，有关闭按钮" display={this.state.display} position={data1} style={style} isClosable={true}
                  onClose={this.handleCloseTip}/>
          <TipBox content="箭头向左，显示5s后关闭" arrowDirection="left" position={data2} disposeTimeOut={5000} style={style}/>
          <TipBox content="箭头向右，显示5s后关闭" arrowDirection="right" position={data3} disposeTimeOut={5000}
                  style={{right: '550px'}}/>
          <TipBox content="无箭头，鼠标移出后关闭" arrowDirection="none" position={data4} style={style}/>
          <TipBox content={<table>
            <tbody>
            <tr>
              <td><img src={imgPicture}/></td>
              <td>添加图标和内容，箭头向上，</td>
            </tr>
            </tbody>
          </table>} arrowDirection="top" position={data5} style={style1}/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TipBoxExample />, mountNode);

```

### 习惯

## en-US



```jsx
import TipBox from 'eview-ui/TipBox';
import Button from 'eview-ui/Button';
import imgPicture from '@images/warn';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
/**
 * You can use TipBox to add the html element's tip.
 * This use case shows how to  how to add a tipbox and use the title of the tipbox.
 */
let data1 = [20, 20];
let data2 = [20, 200];
let data3 = [20, 380];
let data4 = [20, 560];
let data5 = [20, 740];

export default class TipBoxCustom extends React.Component {
  state = {
    display: true
  };

  handleClick = () => {
    this.setState({ display: true });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let styleError = {width: "160px", backgroundColor: "#e54545"};
    let styleWarning = {width: "160px", backgroundColor: "#ffbb33"};
    let styleSucc = {right: "720px", backgroundColor: "#94cc5c"};
    let styleFont = {width: "160px", fontSize: "10px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{position: "relative", margin: "20px", height: "200px"}}>
          <Button onClick={this.handleClick}
                  text="When the TipBox component disappears, click button to display the TipBox"
                  style={{position: "absolute", left: "10px", bottom: "20px"}}/>

          <TipBox content="Error Tip" display={this.state.display} position={data1} style={styleError}/>
          <TipBox content="Warning Tip" display={this.state.display} position={data2} style={styleWarning}
                  arrowDirection="left"/>
          <TipBox content="Success Tip" display={this.state.display} position={data3} style={styleSucc}
                  arrowDirection="right"/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TipBoxCustom />, mountNode);

```

```jsx
import TipBox from 'eview-ui/TipBox';
import Button from 'eview-ui/Button';
import imgPicture from '@images/warn';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
/**
 * You can use TipBox to add the html element's tip.
 * This use case shows how to  how to add a tipbox and use the title of the tipbox.
 */
let data1 = [20, 20];
let data2 = [20, 200];
let data3 = [20, 380];
let data4 = [20, 560];
let data5 = [20, 740];

export default class TipBoxCustom extends React.Component {
  state = {
    display: true
  };

  handleClick = () => {
    this.setState({ display: true });
  };

  render() {
    const [version, theme] = getDemoVersion();
    let styleError = {width: "160px", backgroundColor: "#e54545"};
    let styleWarning = {width: "160px", backgroundColor: "#ffbb33"};
    let styleSucc = {right: "720px", backgroundColor: "#94cc5c"};
    let styleFont = {width: "160px", fontSize: "10px"};

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{position: "relative", margin: "20px", height: "200px"}}>
          <Button onClick={this.handleClick}
                  text="When the TipBox component disappears, click button to display the TipBox"
                  style={{position: "absolute", left: "10px", bottom: "20px"}}/>

          <TipBox content="Error Tip" display={this.state.display} position={data1} style={styleError}/>
          <TipBox content="Warning Tip" display={this.state.display} position={data2} style={styleWarning}
                  arrowDirection="left"/>
          <TipBox content="Success Tip" display={this.state.display} position={data3} style={styleSucc}
                  arrowDirection="right"/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TipBoxCustom />, mountNode);

```

