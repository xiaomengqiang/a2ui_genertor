# Split 面板分割

> 分类：布局

拆分窗口组件提供"resizable和扩展选项。

## API

| Method name            | Description                               | Parameter   | Return |
| --------------         | ------------------------------------------------------------------------------------------------| ----------- | ------ |
|getPanelSize|获取面板尺寸大小|None|"pane1":{"height":xx,"width":xx},"pane2":{"height":xx,"width":xx}|
|setPanelSize|设置面板尺寸大小|size|none|



### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  指定拆分窗口的id | string |  |
| allowResize |  指定窗格的大小是否开启 | bool | true |
| className |  指定类名提到风格拆分窗口 | string |  |
| minSize |  设置最小可调整大小的窗口大小;支持rem | union:<br>&nbsp;string<br>&nbsp;number<br> | 50 |
| maxSize |  设置最大大小可调的窗口大小;支持rem | union:<br>&nbsp;string<br>&nbsp;number<br> | 720 |
| minSplitClickSize |  设置单击后窗格的指定最小大小。如果未指定，则它将与minSize相同| number | minSize |
| maxSplitClickSize | 设置单击后窗格的指定最大大小。如果未指定，则它将与maxSize相同| number | maxSize |
| defaultSize |  设置窗口的默认大小;支持rem | union:<br>&nbsp;string<br>&nbsp;number<br> | 100 |
| split |  Specifies the type of拆分 | enum:<br>&nbsp;'vertical'<br>&nbsp;'horizontal'<br> | 'vertical' |
| onDragStarted |  设置处理观察开始拖动事件 | function |  |
| onDragFinished |  设置处理观察完成拖动事件 | function |  |
| onChange |  设置处理观察onchange事件 | function |  |
| style |  指定拆分窗格的风格 | object |  |
| pane1Style |  指定样式的第一子画面 | object |  |
| pane2Style |  指定第二窗格的风格 | object |  |
|isOverflowY|overflow-Y是否开启|bool|true|
| splitResizerWidth |  设置resizer区域宽度 | union:<br>&nbsp;string<br>&nbsp;number<br> |  |

## 接口定义

```typescript
import type { ReactNode } from 'react';

interface Split {


  /**
   *Specifies the id of Split pane
   */
  id: string;

  /**
   *Specifies the resize of pane is enabled or not .
   */
  allowResize: boolean;

  /**
   *Specifies the overflowY enabled or not .
   */
  isOverflowY: boolean;

  /**
   *Specifies the class name to mention styles for Split pane .
   */
  className: string;

  /**
   *Set the minimum resizable size of pane .
   */
  minSize: string | number;

  /**
   *Set the maximum resizable size of pane .
   */
  maxSize: string | number;

  /**
   *Set the specified minimum size to pane after click. If not specific; then it will be same as minSize.
   */
  minSplitClickSize: number;

  /**
   *Set the specified maximum size pane after click. If not specific; then it will be same as maxSize.
   */
  maxSplitClickSize: number;

  /**
   *Set the default size of pane .
   */
  defaultSize: string | number;

  /**
   *Specifies  the type of split  .
   */
  split: 'vertical' | 'horizontal';

  /**
   * set the handler to observe start of drag event
   */
  onDragStarted: () => unknown;

  /**
   * set the handler to observe finish of drag event
   */
  onDragFinished: (size: string) => unknown;

  /**
   * set the handler to observe onchange  event
   */
  onChange: (value: number) => unknown;

  /**
   *Specifies  the style of split pane  .
   */
  style: object;

  /**
   *Specifies  the style for first  pane  .
   */
  pane1Style: object;

  /**
   *Specifies  the  style for second pane  .
   */
  pane2Style: object;

  /**
   *Set the size to last dragged position.
   */
  setTolastDragPos: boolean;

  /**
   *Set the minimum resizable size of pane .
   */
  splitResizerWidth: string | number;

  allowResizeByDefaultSize: boolean;

  size: string | number;

  resizerStyle: object;

  children: ReactNode;

  /**
   * 通过version设置组件版本.
   */
  version: string;

  /**
   * 通过theme设置组件主题.
   */
  theme: string;


}

interface Pane {

  /**
   *Specifies the class name to mention styles for browsefield.
   */
  className: string;

  /**
   *Set the children nodes of pane
   */
  children: ReactNode;

  /**
   *Specifies the size of span
   */
  size: string | number;

  /**
   *Set the type of split .
   */
  split: 'vertical' | 'horizontal';

  /**
   *Specifies the style of the pane.
   */
  style: object;

}

interface Resizer {


  /**
   * Set the id of resizer
   */
  id: string;

  /**
   *Specifies the class name to mention styles for resizer.
   */
  className: string;

  /**
   * set the handler to handle click event
   */
  onClick: (e: MouseEvent) => unknown;

  /**
   * set the handler to handle mouse down event
   */
  onMouseDown: (e: MouseEvent) => unknown;

  /**
   * set the handler to handle touch event
   */
  onTouchStart: (e: TouchEvent) => unknown;

  /**
   * Set the split type
   */
  split: 'vertical' | 'horizontal';

  /**
   * Add a style to the resizer
   */
  style: object;

  /**
   * Set the resizer class name
   */
  resizerClassName: string;

  onTouchEnd: (e: TouchEvent) => unknown;

  direction: string;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Split from 'eview-ui/Split';
import Accordion from 'eview-ui/Accordion';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import navForm from "@images/nav_form";

export default class SplitExample extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onDragStarted = this.onDragStarted.bind(this);
    this.onDragFinished = this.onDragFinished.bind(this);

  }

  state = {
    data: [{
      title: 'All',
      value: 'over_view',
      icon: 'navForm',
    }, {
      title: 'Star',
      value: 'hero-since-child',
    }, {
      title: 'Off The Wall',
      value: 'off-the-wall',
      children: [{
        title: "Don't Stop Till You Get Enough",
      }, {
        title: 'Rock with You',
      }, {
        title: 'Off The Wall',
      }],
    }, {
      title: 'Zodiac ',
      description: 'Theres more than one way to lose your life to a killer',
      value: 'thriller',
      children: [{
        title: 'Twilight ',
        description: 'When you can live forever, what do you live for?',
      }, {
        title: 'Knowing ',
        description: 'What Happens When The Numbers Run Out?"',
      }, {
        title: 'The Green Hornet ',
        description: 'Breaking the Law to Protect It.',
      }, {
        title: 'Secretariat ',
        description: 'The Impossible True Story"',
      }],
    }],
    msg: '',
  };

  onDragStarted() {
    console.log("on drag start listeners");
  }

  onDragFinished() {
    console.log("on drag finish listeners");
  }

  onChange(event) {

    console.log("On cahnge event triggered");
  }

  render() {

    const styleA = {background: '#d1d3d6'};
    const styleB = {background: '#FFF0F5'};
    const styleC = {background: '#00d6ee'};
    const styleD = {height: '100px',};
    const styleE = {height: "500px"};
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{color: '#000000'}}> vertical split</div>
          <Split split="vertical" minSize={0} minSplitClickSize={100} maxSplitClickSize={400} maxSize={500}
                 defaultSize={300} onDragStarted={this.onDragStarted}
                 onDragFinished={this.onDragFinished} onChange={this.onChange} pane1Style={styleE} pane2Style={styleB}>
            <div>
              <Accordion
                data={this.state.data}
                header="MJ"
              />
            </div>
            <div>
            </div>
          </Split>

          <div style={{color: '#000000'}}> horizontal split</div>
          <Split split="horizontal" minSize={200} defaultSize={300} pane1Style={styleA}> </Split>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SplitExample />, mountNode);

```

```jsx
import Split from 'eview-ui/Split';
import Accordion from 'eview-ui/Accordion';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import navForm from "@images/nav_form";

export default class SplitExample extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onDragStarted = this.onDragStarted.bind(this);
    this.onDragFinished = this.onDragFinished.bind(this);

  }

  state = {
    data: [{
      title: 'All',
      value: 'over_view',
      icon: 'navForm',
    }, {
      title: 'Star',
      value: 'hero-since-child',
    }, {
      title: 'Off The Wall',
      value: 'off-the-wall',
      children: [{
        title: "Don't Stop Till You Get Enough",
      }, {
        title: 'Rock with You',
      }, {
        title: 'Off The Wall',
      }],
    }, {
      title: 'Zodiac ',
      description: 'Theres more than one way to lose your life to a killer',
      value: 'thriller',
      children: [{
        title: 'Twilight ',
        description: 'When you can live forever, what do you live for?',
      }, {
        title: 'Knowing ',
        description: 'What Happens When The Numbers Run Out?"',
      }, {
        title: 'The Green Hornet ',
        description: 'Breaking the Law to Protect It.',
      }, {
        title: 'Secretariat ',
        description: 'The Impossible True Story"',
      }],
    }],
    msg: '',
  };

  onDragStarted() {
    console.log("on drag start listeners");
  }

  onDragFinished() {
    console.log("on drag finish listeners");
  }

  onChange(event) {

    console.log("On cahnge event triggered");
  }

  render() {

    const styleA = {background: '#d1d3d6'};
    const styleB = {background: '#FFF0F5'};
    const styleC = {background: '#00d6ee'};
    const styleD = {height: '100px',};
    const styleE = {height: "500px"};
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{color: '#000000'}}> vertical split</div>
          <Split split="vertical" minSize={0} minSplitClickSize={100} maxSplitClickSize={400} maxSize={500}
                 defaultSize={300} onDragStarted={this.onDragStarted}
                 onDragFinished={this.onDragFinished} onChange={this.onChange} pane1Style={styleE} pane2Style={styleB}>
            <div>
              <Accordion
                data={this.state.data}
                header="MJ"
              />
            </div>
            <div>
            </div>
          </Split>

          <div style={{color: '#000000'}}> horizontal split</div>
          <Split split="horizontal" minSize={200} defaultSize={300} pane1Style={styleA}> </Split>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SplitExample />, mountNode);

```

### With Tree & Table

## en-US



```jsx
import Split from 'eview-ui/Split';
import Button from 'eview-ui/Button';
import Table from 'eview-ui/Table';
import PopUpMenu from 'eview-ui/PopUpMenu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableColumnFilter extends React.Component {
  state = {
    isMenuOpen: false,
    X: 100,
    Y: 100,
    offset: {
      X: 100,
      Y: 100
    },
    parentId: "",

  }
  onRowRightClick = (e, cbData) => {
    console.log("Table onRowRightClick cbData : ", cbData, e);

    this.setState({
      isMenuOpen: true,
      X: e.pageX,
      Y: e.pageY,
      offset: {
        X: e.offsetX, Y: e.offsetY
      },
      parentId: cbData.id,
    })
  }

  handleMenuClick = (evt) => {
    console.log("Popup menu onClick : ", evt);
  }

  render() {
    const columns = [
      {
        title: 'VPN Name',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'VPN_ID',
      },
      {
        title: 'Site',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Site_ID',
      },
      {
        title: 'Alarm',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Alarm_ID',
      },
    ];

    const rows = [];
    rows.push(['R&D VPN2 ', '3', 'ICMP Echo',]);
    rows.push(['Shop Storage', '3', 'ICMP Echo ',]);
    rows.push(['IT Link', '7', 'ICMP Echo',]);
    rows.push(['R&D VPN1', '3', 'ICMP Echo',]);
    rows.push(['R&D VPN6', '5', 'ICMP Echo',]);
    rows.push(['R&D VPN2', '7', 'ICMP Echo',]);


    let PopUpMenuOptions = [
      {
        text: "Item1", serialno: 1, submenus: [
          {
            text: "Item11Item11Item11Item11Item11Item11", serialno: 11, submenus: [
              {
                text: "Item111Item111", serialno: 111, disable: true, submenus: [
                  { text: "Item1111Item111", serialno: 1111, submenus: [] }
                ]
              },
              { text: "Item111112121Item111112121Item111112121", serialno: 12111, submenus: [] },
              { text: "Item121", serialno: 121, submenus: [] }
            ]
          }
        ]
      },
      { text: "Item2", serialno: 2, submenus: [] },
      {
        text: "Item 3", serialno: 3, submenus: [
          { text: "Item1111121", serialno: 1211, submenus: [] },
          { text: "Item121", serialno: 1221, submenus: [] }
        ]
      },
      { text: "Item 4", serialno: 4, submenus: [] }
    ];

    return (
      <div>
        <Table onRowRightClick={this.onRowRightClick}
          columns={columns}
          dataset={rows}
          ref={table => { this.table = table; }}
        />
        <PopUpMenu options={PopUpMenuOptions} parentId={this.state.parentId} isOpen={this.state.isMenuOpen} X={this.state.X} Y={this.state.Y} offset={this.state.offset}
          onClick={this.handleMenuClick}></PopUpMenu>
      </div>
    );
  }
}
export default class SplitUseCaseDemo extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onDragStarted = this.onDragStarted.bind(this);
        this.onDragFinished = this.onDragFinished.bind(this);
    }

    onDragStarted() {
        console.log("on drag start listeners");
    }

    onDragFinished() {
        console.log("on drag finish listeners");
    }

    onChange(event) {
        console.log("On cahnge event triggered");
    }

    onClick() {
        var data1 = this.split1.getPanelSize();
        var data2 = this.split2.getPanelSize();
        var data3 = this.split3.getPanelSize();
        console.log("Outer Split Size" + JSON.stringify(data1));
        console.log("Second Split Size" + JSON.stringify(data2));
        console.log("third Split Size" + JSON.stringify(data3));
    }

	onClickSetSize() {
        this.split1.setPanelSize(0);
        this.split2.setPanelSize(700);
        this.split3.setPanelSize(500);
        var data1 = this.split1.getPanelSize();
        var data2 = this.split2.getPanelSize();
        var data3 = this.split3.getPanelSize();
        console.log("Outer Split Size" + JSON.stringify(data1));
        console.log("Second Split Size" + JSON.stringify(data2));
        console.log("third Split Size" + JSON.stringify(data3));
    }

    render() {
      const styleA = {background: '#d1d3d6'};
      const styleB = {background: '#FFF0F5'};
      const styleC = {background: '#00d6ee'};
      const styleD = {height: '100px',};
      const styleE = {height: "500px"};
      const styleCol = {background: '#87CEFA'};
      const [version, theme] = getDemoVersion();
        return (
          // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
          <ConfigProvider version={version} theme={theme}>
            <div>
              <div style={{color: '#000000'}}>Split UseCase</div>
              <Split ref={(node) => {
                this.split1 = node;
              }} split="vertical" minSize={0} defaultSize={300} maxSize={1200} onDragStarted={this.onDragStarted}
                     onDragFinished={this.onDragFinished} onChange={this.onChange} pane2Style={styleB}>
                <div></div>
                <div>
                  <Split ref={(node) => {
                    this.split2 = node;
                  }} split="horizontal" minSize={0} defaultSize={300} pane1Style={styleA}>
                    <div>
                      <TableColumnFilter/>
                    </div>
                    <div>
                      <Split ref={(node) => {
                        this.split3 = node;
                      }} split="horizontal" minSize={0} defaultSize={300} pane1Style={styleCol}>
                        <div>
                          <TableColumnFilter/>
                        </div>
                        <div></div>
                      </Split>
                    </div>
                  </Split>
                </div>
              </Split>
              <br/>
              <div style={{marginBottom: "10px", marginLeft: "450px"}}>
                <Button text="GetSize" onClick={this.onClick.bind(this)}></Button>
                <Button text="SetSize" onClick={this.onClickSetSize.bind(this)}></Button>
              </div>
            </div>
          </ConfigProvider>
        );
    }
}

ReactDOM.render(<SplitUseCaseDemo />, mountNode);

```

```jsx
import Split from 'eview-ui/Split';
import Button from 'eview-ui/Button';
import Table from 'eview-ui/Table';
import PopUpMenu from 'eview-ui/PopUpMenu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableColumnFilter extends React.Component {
  state = {
    isMenuOpen: false,
    X: 100,
    Y: 100,
    offset: {
      X: 100,
      Y: 100
    },
    parentId: "",

  }
  onRowRightClick = (e, cbData) => {
    console.log("Table onRowRightClick cbData : ", cbData, e);

    this.setState({
      isMenuOpen: true,
      X: e.pageX,
      Y: e.pageY,
      offset: {
        X: e.offsetX, Y: e.offsetY
      },
      parentId: cbData.id,
    })
  }

  handleMenuClick = (evt) => {
    console.log("Popup menu onClick : ", evt);
  }

  render() {
    const columns = [
      {
        title: 'VPN Name',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'VPN_ID',
      },
      {
        title: 'Site',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Site_ID',
      },
      {
        title: 'Alarm',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Alarm_ID',
      },
    ];

    const rows = [];
    rows.push(['R&D VPN2 ', '3', 'ICMP Echo',]);
    rows.push(['Shop Storage', '3', 'ICMP Echo ',]);
    rows.push(['IT Link', '7', 'ICMP Echo',]);
    rows.push(['R&D VPN1', '3', 'ICMP Echo',]);
    rows.push(['R&D VPN6', '5', 'ICMP Echo',]);
    rows.push(['R&D VPN2', '7', 'ICMP Echo',]);


    let PopUpMenuOptions = [
      {
        text: "Item1", serialno: 1, submenus: [
          {
            text: "Item11Item11Item11Item11Item11Item11", serialno: 11, submenus: [
              {
                text: "Item111Item111", serialno: 111, disable: true, submenus: [
                  { text: "Item1111Item111", serialno: 1111, submenus: [] }
                ]
              },
              { text: "Item111112121Item111112121Item111112121", serialno: 12111, submenus: [] },
              { text: "Item121", serialno: 121, submenus: [] }
            ]
          }
        ]
      },
      { text: "Item2", serialno: 2, submenus: [] },
      {
        text: "Item 3", serialno: 3, submenus: [
          { text: "Item1111121", serialno: 1211, submenus: [] },
          { text: "Item121", serialno: 1221, submenus: [] }
        ]
      },
      { text: "Item 4", serialno: 4, submenus: [] }
    ];

    return (
      <div>
        <Table onRowRightClick={this.onRowRightClick}
          columns={columns}
          dataset={rows}
          ref={table => { this.table = table; }}
        />
        <PopUpMenu options={PopUpMenuOptions} parentId={this.state.parentId} isOpen={this.state.isMenuOpen} X={this.state.X} Y={this.state.Y} offset={this.state.offset}
          onClick={this.handleMenuClick}></PopUpMenu>
      </div>
    );
  }
}
export default class SplitUseCaseDemo extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onDragStarted = this.onDragStarted.bind(this);
        this.onDragFinished = this.onDragFinished.bind(this);
    }

    onDragStarted() {
        console.log("on drag start listeners");
    }

    onDragFinished() {
        console.log("on drag finish listeners");
    }

    onChange(event) {
        console.log("On cahnge event triggered");
    }

    onClick() {
        var data1 = this.split1.getPanelSize();
        var data2 = this.split2.getPanelSize();
        var data3 = this.split3.getPanelSize();
        console.log("Outer Split Size" + JSON.stringify(data1));
        console.log("Second Split Size" + JSON.stringify(data2));
        console.log("third Split Size" + JSON.stringify(data3));
    }

	onClickSetSize() {
        this.split1.setPanelSize(0);
        this.split2.setPanelSize(700);
        this.split3.setPanelSize(500);
        var data1 = this.split1.getPanelSize();
        var data2 = this.split2.getPanelSize();
        var data3 = this.split3.getPanelSize();
        console.log("Outer Split Size" + JSON.stringify(data1));
        console.log("Second Split Size" + JSON.stringify(data2));
        console.log("third Split Size" + JSON.stringify(data3));
    }

    render() {
      const styleA = {background: '#d1d3d6'};
      const styleB = {background: '#FFF0F5'};
      const styleC = {background: '#00d6ee'};
      const styleD = {height: '100px',};
      const styleE = {height: "500px"};
      const styleCol = {background: '#87CEFA'};
      const [version, theme] = getDemoVersion();
        return (
          // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
          <ConfigProvider version={version} theme={theme}>
            <div>
              <div style={{color: '#000000'}}>Split UseCase</div>
              <Split ref={(node) => {
                this.split1 = node;
              }} split="vertical" minSize={0} defaultSize={300} maxSize={1200} onDragStarted={this.onDragStarted}
                     onDragFinished={this.onDragFinished} onChange={this.onChange} pane2Style={styleB}>
                <div></div>
                <div>
                  <Split ref={(node) => {
                    this.split2 = node;
                  }} split="horizontal" minSize={0} defaultSize={300} pane1Style={styleA}>
                    <div>
                      <TableColumnFilter/>
                    </div>
                    <div>
                      <Split ref={(node) => {
                        this.split3 = node;
                      }} split="horizontal" minSize={0} defaultSize={300} pane1Style={styleCol}>
                        <div>
                          <TableColumnFilter/>
                        </div>
                        <div></div>
                      </Split>
                    </div>
                  </Split>
                </div>
              </Split>
              <br/>
              <div style={{marginBottom: "10px", marginLeft: "450px"}}>
                <Button text="GetSize" onClick={this.onClick.bind(this)}></Button>
                <Button text="SetSize" onClick={this.onClickSetSize.bind(this)}></Button>
              </div>
            </div>
          </ConfigProvider>
        );
    }
}

ReactDOM.render(<SplitUseCaseDemo />, mountNode);

```

### Horizontal Split

## en-US



```jsx
import Split from 'eview-ui/Split';
import Table from 'eview-ui/Table';
import PopUpMenu from 'eview-ui/PopUpMenu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableColumnFilter extends React.Component {
  state = {
    isMenuOpen: false,
    X: 100,
    Y: 100,
    offset: {
      X: 100,
      Y: 100
    },
    parentId: "",

  }
  onRowRightClick = (e, cbData) => {
    console.log("Table onRowRightClick cbData : ", cbData, e);

    this.setState({
      isMenuOpen: true,
      X: e.pageX,
      Y: e.pageY,
      offset: {
        X: e.offsetX, Y: e.offsetY
      },
      parentId: cbData.id,
    })
  }

  handleMenuClick = (evt) => {
    console.log("Popup menu onClick : ", evt);
  }

  render() {
    const columns = [
      {
        title: 'VPN Name',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'VPN_ID',
      },
      {
        title: 'Site',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Site_ID',
      },
      {
        title: 'Alarm',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Alarm_ID',
      },
    ];

    const rows = [];
    rows.push(['R&D VPN2 ', '3', 'ICMP Echo',]);
    rows.push(['Shop Storage', '3', 'ICMP Echo ',]);
    rows.push(['IT Link', '7', 'ICMP Echo',]);
    rows.push(['R&D VPN1', '3', 'ICMP Echo',]);
    rows.push(['R&D VPN6', '5', 'ICMP Echo',]);
    rows.push(['R&D VPN2', '7', 'ICMP Echo',]);


    let PopUpMenuOptions = [
      {
        text: "Item1", serialno: 1, submenus: [
          {
            text: "Item11Item11Item11Item11Item11Item11", serialno: 11, submenus: [
              {
                text: "Item111Item111", serialno: 111, disable: true, submenus: [
                  { text: "Item1111Item111", serialno: 1111, submenus: [] }
                ]
              },
              { text: "Item111112121Item111112121Item111112121", serialno: 12111, submenus: [] },
              { text: "Item121", serialno: 121, submenus: [] }
            ]
          }
        ]
      },
      { text: "Item2", serialno: 2, submenus: [] },
      {
        text: "Item 3", serialno: 3, submenus: [
          { text: "Item1111121", serialno: 1211, submenus: [] },
          { text: "Item121", serialno: 1221, submenus: [] }
        ]
      },
      { text: "Item 4", serialno: 4, submenus: [] }
    ];

    return (
      <div>
        <Table onRowRightClick={this.onRowRightClick}
               columns={columns}
               dataset={rows}
               ref={table => { this.table = table; }}
        />
        <PopUpMenu options={PopUpMenuOptions} parentId={this.state.parentId} isOpen={this.state.isMenuOpen} X={this.state.X} Y={this.state.Y} offset={this.state.offset}
                   onClick={this.handleMenuClick}></PopUpMenu>
      </div>
    );
  }
}

export default class SplitExampleHorizontal extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onDragStarted = this.onDragStarted.bind(this);
    this.onDragFinished = this.onDragFinished.bind(this);
  }

  onDragStarted() {
    console.log("on drag start listeners");
  }

  onDragFinished() {
    console.log("on drag finish listeners");
  }

  onChange(event) {
    console.log("On cahnge event triggered");
  }

  render() {

    const styleA = {background: '#d1d3d6'};
    const styleB = {background: '#FFF0F5'};
    const styleC = {background: '#00d6ee'};
    const styleD = {height: '100px',};
    const styleE = {height: "250px"};
    const styleCol = {background: '#87CEFA'};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{color: '#000000'}}>Split UseCase</div>
          <div>
            <div style={{height: "523px"}}>
              <Split split="horizontal" minSize={200} defaultSize={500} maxSize={500} pane1Style={styleA}>
                <div>
                  <TableColumnFilter/>
                </div>
                <div>
                  <TableColumnFilter/>
                </div>
              </Split>
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SplitExampleHorizontal />, mountNode);

```

```jsx
import Split from 'eview-ui/Split';
import Table from 'eview-ui/Table';
import PopUpMenu from 'eview-ui/PopUpMenu';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableColumnFilter extends React.Component {
  state = {
    isMenuOpen: false,
    X: 100,
    Y: 100,
    offset: {
      X: 100,
      Y: 100
    },
    parentId: "",

  }
  onRowRightClick = (e, cbData) => {
    console.log("Table onRowRightClick cbData : ", cbData, e);

    this.setState({
      isMenuOpen: true,
      X: e.pageX,
      Y: e.pageY,
      offset: {
        X: e.offsetX, Y: e.offsetY
      },
      parentId: cbData.id,
    })
  }

  handleMenuClick = (evt) => {
    console.log("Popup menu onClick : ", evt);
  }

  render() {
    const columns = [
      {
        title: 'VPN Name',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'VPN_ID',
      },
      {
        title: 'Site',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Site_ID',
      },
      {
        title: 'Alarm',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        key: 'Alarm_ID',
      },
    ];

    const rows = [];
    rows.push(['R&D VPN2 ', '3', 'ICMP Echo',]);
    rows.push(['Shop Storage', '3', 'ICMP Echo ',]);
    rows.push(['IT Link', '7', 'ICMP Echo',]);
    rows.push(['R&D VPN1', '3', 'ICMP Echo',]);
    rows.push(['R&D VPN6', '5', 'ICMP Echo',]);
    rows.push(['R&D VPN2', '7', 'ICMP Echo',]);


    let PopUpMenuOptions = [
      {
        text: "Item1", serialno: 1, submenus: [
          {
            text: "Item11Item11Item11Item11Item11Item11", serialno: 11, submenus: [
              {
                text: "Item111Item111", serialno: 111, disable: true, submenus: [
                  { text: "Item1111Item111", serialno: 1111, submenus: [] }
                ]
              },
              { text: "Item111112121Item111112121Item111112121", serialno: 12111, submenus: [] },
              { text: "Item121", serialno: 121, submenus: [] }
            ]
          }
        ]
      },
      { text: "Item2", serialno: 2, submenus: [] },
      {
        text: "Item 3", serialno: 3, submenus: [
          { text: "Item1111121", serialno: 1211, submenus: [] },
          { text: "Item121", serialno: 1221, submenus: [] }
        ]
      },
      { text: "Item 4", serialno: 4, submenus: [] }
    ];

    return (
      <div>
        <Table onRowRightClick={this.onRowRightClick}
               columns={columns}
               dataset={rows}
               ref={table => { this.table = table; }}
        />
        <PopUpMenu options={PopUpMenuOptions} parentId={this.state.parentId} isOpen={this.state.isMenuOpen} X={this.state.X} Y={this.state.Y} offset={this.state.offset}
                   onClick={this.handleMenuClick}></PopUpMenu>
      </div>
    );
  }
}

export default class SplitExampleHorizontal extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onDragStarted = this.onDragStarted.bind(this);
    this.onDragFinished = this.onDragFinished.bind(this);
  }

  onDragStarted() {
    console.log("on drag start listeners");
  }

  onDragFinished() {
    console.log("on drag finish listeners");
  }

  onChange(event) {
    console.log("On cahnge event triggered");
  }

  render() {

    const styleA = {background: '#d1d3d6'};
    const styleB = {background: '#FFF0F5'};
    const styleC = {background: '#00d6ee'};
    const styleD = {height: '100px',};
    const styleE = {height: "250px"};
    const styleCol = {background: '#87CEFA'};
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={{color: '#000000'}}>Split UseCase</div>
          <div>
            <div style={{height: "523px"}}>
              <Split split="horizontal" minSize={200} defaultSize={500} maxSize={500} pane1Style={styleA}>
                <div>
                  <TableColumnFilter/>
                </div>
                <div>
                  <TableColumnFilter/>
                </div>
              </Split>
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<SplitExampleHorizontal />, mountNode);

```

