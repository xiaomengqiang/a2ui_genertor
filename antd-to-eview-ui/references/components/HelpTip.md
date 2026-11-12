# HelpTip 文字提示

> 分类：数据展示

HelpTip组件可实现当鼠标悬浮在问号图标上时，显示出一个提示信息，该组件可用于为某些关键字提供帮助提示

## API

### 属性

| 属性名称 |  描述 | 输入                                                  | 默认                |
|:-----|:-----|:----------------------------------------------------|:------------------|
| id | 定制组件dom元素id，传入该值可覆盖组件自动生成的id| string                                              |                   |
| className | 支持通过className设置组件样式| string                                              |                   |
| iconSize | 定制图标的大小，不传则使用默认大小 | string[]                                            | [['1rem','1rem']] |
| tipStyle | 支持通过style设置tip提示框的样式 | React.CSSProperties                                 |                   |
| iconDisplay | 支持通过iconDisplay设置组件的显示和隐藏| bool                                                | true              |
| position |  设置图标的位置，图标本身的display属性为relative，例如position={[20,50]} => top: 20px，left: 50px| number[]                                            | [[0, 0]]          |
| arrowDirection |  支持通过arrowDirection设置箭头方向：上 下 左 右 | enum:<br>'left'<br>'right'<br>'top'<br>'bottom'<br> | 'left'            |
| tipContent |  设置提示框里的内容，默认值为空,提示框里的内容支持任意react元素 | any                                                 |                   |
| hideArrow |  是否隐藏箭头 | boolean                                             | false             |

## 使用示例

### 基本属性设置

## en-US

```jsx
import Icon from 'eview-ui/Icon'
import HelpTip from "eview-ui/HelpTip";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class HelpTipExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const containerStyle = {
      margin: "30px",
      height: '300px',
      width: "800px",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: 'black',
      position: 'relative'
    };

    const style = {
      width: '200px', backgroundColor: 'lightBlue', borderRadius: '5px',
    };

    return (// 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={containerStyle}>
          <span>默认情况下，箭头方向向左<HelpTip tipContent='arrow top, and you can set the position' /></span>
          <span>设置箭头方向向上，并通过position调整图标的位置<HelpTip arrowDirection='top'
                                                                      tipContent='arrow top, and you can set the position'
                                                                      position={[0, 30]} /></span>
          <span>设置箭头方向向下，并通过tipStyle设置提示框大小和自定义样式<HelpTip arrowDirection='bottom'
                                                                                  position={[0, 10]}
                                                                                  tipContent='arrow bottom, and you can set the style '
                                                                                  tipStyle={style} /></span>
          <span>设置箭头方向向右，通过tipContent设置提示框内容，提示框内的内容可以是任意的React节点<HelpTip
            arrowDirection='right' position={[0, 10]}
            tipContent={<div><Icon name='error' /> <span>help tip box support html</span>
            </div>} /></span>
          <span style={{ fontSize: '0.75rem' }}>通过iconSize设置icon大小，箭头将自动对齐到图标中间位置<HelpTip
            iconSize={['0.75rem', '0.75rem']} position={[0, 10]} arrowDirection='left'
            tipContent={<span>you can set the size of the icon ,<br />and the arrow will be align to the middle of the icon</span>} /></span>
          <span>隐藏箭头<HelpTip tipContent='配置hideArrow可以将箭头隐藏掉' hideArrow /></span>
        </div>
      </ConfigProvider>);
  }
}

ReactDOM.render(<HelpTipExample />, mountNode);

```

```jsx
import Icon from 'eview-ui/Icon'
import HelpTip from "eview-ui/HelpTip";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class HelpTipExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const containerStyle = {
      margin: "30px",
      height: '300px',
      width: "800px",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: 'black',
      position: 'relative'
    };

    const style = {
      width: '200px', backgroundColor: 'lightBlue', borderRadius: '5px',
    };

    return (// 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={containerStyle}>
          <span>默认情况下，箭头方向向左<HelpTip tipContent='arrow top, and you can set the position' /></span>
          <span>设置箭头方向向上，并通过position调整图标的位置<HelpTip arrowDirection='top'
                                                                      tipContent='arrow top, and you can set the position'
                                                                      position={[0, 30]} /></span>
          <span>设置箭头方向向下，并通过tipStyle设置提示框大小和自定义样式<HelpTip arrowDirection='bottom'
                                                                                  position={[0, 10]}
                                                                                  tipContent='arrow bottom, and you can set the style '
                                                                                  tipStyle={style} /></span>
          <span>设置箭头方向向右，通过tipContent设置提示框内容，提示框内的内容可以是任意的React节点<HelpTip
            arrowDirection='right' position={[0, 10]}
            tipContent={<div><Icon name='error' /> <span>help tip box support html</span>
            </div>} /></span>
          <span style={{ fontSize: '0.75rem' }}>通过iconSize设置icon大小，箭头将自动对齐到图标中间位置<HelpTip
            iconSize={['0.75rem', '0.75rem']} position={[0, 10]} arrowDirection='left'
            tipContent={<span>you can set the size of the icon ,<br />and the arrow will be align to the middle of the icon</span>} /></span>
          <span>隐藏箭头<HelpTip tipContent='配置hideArrow可以将箭头隐藏掉' hideArrow /></span>
        </div>
      </ConfigProvider>);
  }
}

ReactDOM.render(<HelpTipExample />, mountNode);

```

