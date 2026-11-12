# ScrollBar 滚动条

> 分类：其他

滚动条组件。

## API

### 属性

| 属性名称        | 描述                                                                                                        | 输入       | 默认   |
|:------------|:----------------------------------------------------------------------------------------------------------|:---------|:-----|
| style       | maxWidth: 550,// 配置组件需要水平滚动的的最大宽度. minWidth: 300, // 设置组件需要水平滚动的最小宽度. maxHeight: 200,//配置max组件需要垂直滚动条的高度. | shape    | {}   |
| children    | 滚动条的子组件                                                                                                   | node     | null |
| scrollEvent | 滚动后的回调函数                                                                                                  | function |      |
| scrollStep  | 设置滚动条单次滚动的步长                                                                                              | number   | 53   |

## 接口定义

```typescript
import type { ReactNode } from 'react';

interface ScrollBar {


  /**
   *maxWidth: 550;// required set max Width of the component need horizontal scroll.
   *minWidth: 300; // set min Width of the component need horizontal scroll.
   *maxHeight: 200;//required set max height of the component need vertical scroll bar.
   */
  style: any;

  /**
   * children inside the scrollbar
   */
  children: ReactNode;
  onUpdateSize: () => unknown;

  /**
   * Value that decides the position of the vertical scroll with respect to the scroll pane. This value will
   * be treated as a % value with in the range of 0 - 100.
   */
  vMovement: number;

  /**
   * Value true the scoll bar is always displayed .
   */
  isScrollAlwaysDisplay: boolean;

  /**
   * 设置滚动条轨道起始高度
   */
  trackTop: number;

  /**
   * 设置滚动条轨道高度
   */
  trackHeight: string;

  clientHeight: number;

  scrollEvent: (data: any) => unknown;

  /**
   * 设置滚动条单次滚动的步长
   */
  scrollStep: number;

  id: string;
  version: string;
  theme: string;

}

interface HorizontalScrollbar {
  draggingFromParent: boolean;
  scrolling: number;
  wrapper: any;
  area: any;
  onChangePosition: object;
  onDragging: object;
  onStopDrag: object;
  isScrollAlwaysDisplay: boolean;
  isVisible: boolean;
  onUpdateScrollEvent: object;
  version: string;
}

interface VerticalScrollbar {
  draggingFromParent: boolean;
  scrolling: number;
  wrapper: any;
  area: any;
  onChangePosition: (...args: any[]) => unknown;
  onDragging: (...args: any[]) => unknown;
  onStopDrag: (...args: any[]) => unknown;
  isScrollAlwaysDisplay: boolean;
  onUpdateScrollEvent: (...args: any[]) => unknown;
  trackTop: number;
  trackHeight: string;
  isVisible: boolean;
  version: string;
}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import ScrollBar from 'eview-ui/ScrollBar';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ScrollBarExample extends React.Component {

  handleScrollEvent = () => {
    console.log("scrollEvent Fired.");
  };

  render() {
    const myScrollbar = {
      maxWidth: 550,
      minWidth: 300,
      maxHeight: 200,
    };

    const kolom = {
      background: '#2196F3',
      width: '150px',
      height: '150px',
      display: 'inline-block',
      margin: '15px'
    }
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <ScrollBar style={myScrollbar} scrollEvent={this.handleScrollEvent}>
          <div className="scroll-content">
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div className="clearfix" />
          </div>

        </ScrollBar>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ScrollBarExample />, mountNode);

```

```jsx
import ScrollBar from 'eview-ui/ScrollBar';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ScrollBarExample extends React.Component {

  handleScrollEvent = () => {
    console.log("scrollEvent Fired.");
  };

  render() {
    const myScrollbar = {
      maxWidth: 550,
      minWidth: 300,
      maxHeight: 200,
    };

    const kolom = {
      background: '#2196F3',
      width: '150px',
      height: '150px',
      display: 'inline-block',
      margin: '15px'
    }
    const [version, theme] = getDemoVersion()
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <ScrollBar style={myScrollbar} scrollEvent={this.handleScrollEvent}>
          <div className="scroll-content">
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div style={kolom}/>
            <div className="clearfix" />
          </div>

        </ScrollBar>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ScrollBarExample />, mountNode);

```

