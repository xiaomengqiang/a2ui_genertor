# Panel 折叠面板

> 分类：数据展示

Panel组件，页面内面板常用于显示或隐藏页面信息，常用于表单页面的分组布局,可定制面板标题，标题简述，以及面板内容,配合PanelItem组件一起使用，将PanelItem标签嵌套在Panel内部使用。


## antd 迁移注意事项

> 导入特例：`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**必须解构**，默认导出不是 Panel 本身）

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Collapse` / `Panel` | `Panel` / `PanelItem` | **解构导入**：`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`；`items=[{key,label,children}]`→children `<PanelItem title>`；`defaultActiveKey`/`activeKey`（key）→**`selectedIndex`（下标数组，按顺序做 key→index 映射）**；`accordion`→**`enableMultiExpand={false}`（语义取反**：antd accordion=true 即手风琴 = eview enableMultiExpand=false）；`onChange(key)`→`onExpand(index, event)`/`onClose(index, event, collapsed)`；`destroyInactivePanel`→Panel `keepAlive`（取反）；`closable` 默认 true；**PanelItem `expanded` 是单项非受控初始态**，受控展开一律走 Panel 的 `selectedIndex` |

## API


### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id 例如： id='PanelId' | string |  |
| className |  定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 例如: className='PanelClassName' | string |  |
| style |  定制组件dom元素的样式，传入该值可追加组件自动生成的样式，从而自定义组件外观 例如: style={width:500,height:50} | object |  |
| onExpand |  自定义点击打开折叠时的回调方法，不传则无回调<br><br>**签名:**<br>`function(index: number, event: object) => void`<br>*index:* 被展开的PanelItem的下标<br>*event:* 原生dom事件 | function |  |
| onClose |  自定义点击关闭/折叠子面板时的回调方法，不传则无回调<br><br>**签名:**<br>`function(index: number, event: object, collapsed: boolean) => void`<br>*index:* 被关闭的PanelItem的下标<br>*event:* 原生dom事件（通过关闭图标触发时event为undefined）<br>*collapsed:* true表示点击标题折叠面板，false表示点击关闭图标移除面板 | function |  |
| selectedIndex |  设置默认展开的index数组,此index是传入数据数组下标 例如: selectedIndex=[0] | number[] |  |
| enableMultiExpand |  设置是否允许多个展开 | bool | false |
| keepAlive |  设置收缩时是否卸载PanelItem内容，为true时折叠时仅隐藏而非卸载 | bool | false |
| version |  支持通过version设置组件版本 | string |  |
| theme |  支持通过theme设置组件主题 | string |  |

## PanelItem
Panel的子标签和Panel一起使用。

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id 例如： id='PanelItemId' | string |  |
| className |  定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 例如: className='PanelItemClassName' | string |  |
| style |  定制组件样式 例如: style={width:500,height:100} | object |  |
| containerStyle |  定制组件容器样式 例如: containerStyle={width:500,height:100} | object | {} |
| containerClassName |  定制组件容器元素className，传入该值可追加组件自动生成的className 例如: containerClassName='PanelItemContainerClassName' | string |  |
| title |  定制组件标题，不传则为null 例如: title=&lt;div&gt;这是标题描述&lt;/div&gt; | any |  |
| expanded |  定制组件是否展开显示（非受控初始态），受控展开请使用Panel的selectedIndex 例如: expanded=true | bool | true |
| closable |  定制组件是否附带关闭移除功能 例如: closable=true | bool | true |
| disabled |  是否禁用面板交互 | bool | false |
| keepAlive |  收缩时是否保留内容不卸载（由Panel统一传递，也可单独设置） | bool |  |

## 接口定义

```typescript
import type { ReactNode } from 'react';

interface PanelItem {


  /**
   *定制组件dom元素id，传入该值可覆盖组件自动生成的id
   * 例如：
   * id='PanelItemId'
   */
  id: string;

  /**
   * 定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式
   * 例如:
   * className='PanelItemClassName'
   */
  className: string;

  /**
   * 定制组件container样式
   * 例如:
   * containerStyle={width:500;height:100}
   */
  containerStyle: object;

  /**
   * 定制组件container元素className，传入该值可追加组件自动生成的className，从而自定义组件样式
   * 例如:
   * containerClassName='PanelItemContainerClassName'
   */
  containerClassName: string;

  /**
   * 定制组件样式
   * 例如:
   * style={width:500;height:100}
   */
  style: object;

  /**
   * 定制组件标题，不传则为null
   * 例如:
   * title=<div>这是标题描述</div>
   */
  title: any;

  /**
   * 定制组件是否展开显示（非受控初始态），受控展开请使用Panel的selectedIndex
   * 例如:
   * expanded=true
   */
  expanded: boolean;

  /**
   * 是否禁用面板交互
   */
  disabled: boolean;

  /**
   * 定制组件是否附带关闭移除功能
   * 例如:
   * closable=true
   */
  closable: boolean;

  /**
   * 自定义点击标题展开/折叠时的回调方法（由Panel内部传递，一般不直接使用）
   *
   * @param {number} index  当前面板序号
   * @param {object} event 事件对象
   */
  onExpand: (index: number, e: MouseEvent) => unknown;

  /**
   * 自定义点击关闭图标时的回调方法（由Panel内部传递，一般不直接使用）
   *
   * @param {number} index  当前面板序号
   */
  onClose: (index: number) => unknown;

  keepAlive: boolean;

  index: number;

  children: ReactNode;

}

interface Panel {


  /**
   *定制组件dom元素id，传入该值可覆盖组件自动生成的id
   * 例如：
   * id='PanelId'
   */
  id: string;

  /**
   * 定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式
   * 例如:
   * className='PanelClassName'
   */
  className: string;

  /**
   * 定制组件dom元素的样式，传入该值可追加组件自动生成的样式，从而自定义组件外观
   * 例如:
   * style={width:500,height:50}
   */
  style: any;

  /**
   * 自定义点击打开折叠时的回调方法，不传则无回调
   *
   * @param {number} index  被展开的PanelItem下标
   * @param {object} event 原生dom事件
   */
  onExpand: (index: number, e: MouseEvent) => unknown;

  /**
   * 自定义点击关闭/折叠子面板时的回调方法，不传则无回调
   *
   * @param {number} index  被关闭的PanelItem下标
   * @param {object} event 原生dom事件（通过关闭图标触发时为undefined）
   * @param {boolean} collapsed true表示点击标题折叠面板，false表示点击关闭图标移除面板
   */
  onClose: (index: number, e: MouseEvent, collapsed: boolean) => unknown;

  /**
   * 设置选中的index,此index是传入数据数组下标
   */
  selectedIndex: number[];

  /**
   * 设置是否允许多个展开
   */
  enableMultiExpand: boolean;

  /**
   * 设置收缩时是否卸载PanelItem内容，为true时折叠时仅隐藏而非卸载
   */
  keepAlive: boolean;

  children: ReactNode;

  /*
   * 支持通过version设置组件版本.
   */
  version: string;

  /*
   * 支持通过theme设置组件主题.
   */
  theme: string;

}
```

## 使用示例

### 基本属性设置

```jsx
import PanelE from 'eview-ui/Panel';
import DivMessage from 'eview-ui/DivMessage';
import img1 from '@images/table_1';
import img2 from '@images/table_2';
import Table from 'eview-ui/Table';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const {Panel, PanelItem} = PanelE;

class TableDemo extends React.Component {
  render() {
    const columns = [
      {
        title: 'VPN Name',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        width: 160,
        allowSort: false,
        key: 'hideY',
      },
      {
        title: 'State',
        dataType: Table.ColumnRenderType.CUSTOM,
        ellipsis: true,
        width: 230,
        sort: 'asc',
        getCompareValue: v => v.age,
        key: 'hideX',
      },
      {
        title: 'Site',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        ellipsis: true,
        selected: true,
        key: 'hideY',
      },
      {
        title: 'Alarm',
        dataType: Table.ColumnRenderType.TEXT_FIELD,
        ellipsis: true,
        key: 'hideZ',
      },
    ];
    const rows = [];
    rows.push([
      'R&D VPN2 ',
      <div>
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'Shop Storage',
      <div>
        {' '}
        Active
      </div>,
      '3',
      'ICMP Echo ',
    ]);
    rows.push([
      'IT Link',
      <div>
        <img src={img2} style={{verticalAlign: 'bottom'}} alt="Active"/>
        {' '}
        Active
      </div>,
      '7',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{verticalAlign: 'bottom'}} alt="Active"/>
        {' '}
        Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{verticalAlign: 'bottom'}} alt="Active"/>
        {' '}
        Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{verticalAlign: 'bottom'}} alt="Active"/>
        {' '}
        Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{verticalAlign: 'bottom'}} alt="Active"/>
        {' '}
        Active
      </div>,
      '3',
      'ICMP Echo',
    ]);

    return (
      <div>
        <Table
          columns={columns}
          dataset={rows}
          height={450}
          pageSize={10}
          ref={table => {
            this.table = table;
          }}
          hideColumns={['hide', 'hideX']}
          ref={(c) => {
            this.scrollWrapper = c;
          }}
        />
      </div>
    );
  }
}

export default class PanelExample extends React.Component {

  state = {
    selectedIndex: [0]
  };

  handleClick = (index) => {
    //this.setState({selectedIndex: index})
  };

  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div style={{width: 500}}>
          <Panel enableMultiExpand={true} selectedIndex={this.state.selectedIndex} onExpand={this.handleClick}>
            <PanelItem closable={false} title={"Panel title one"}>
              <div style={{padding: 50}}>Fold content of panel one</div>
            </PanelItem>
            <PanelItem title={"Panel title two"}>
              <div style={{padding: 50}}>Fold content of panel two</div>
            </PanelItem>
            <PanelItem title={"Panel title three"}>
              <div style={{padding: 50}}><TableDemo/></div>
            </PanelItem>
          </Panel>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PanelExample />, mountNode);

```

### 事件处理

```jsx
import PanelE from 'eview-ui/Panel';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
const {Panel, PanelItem} = PanelE;

export default class PanelEventExample extends React.Component {

  title = () => {
    return <div>Custom Title Area</div>
  };

  state = {
    selectedIndex: [0],
    msg: '',
  };

  handlePanelExpand = (index) => {
    this.setState({ msg: "onExpand event callback on Panel, Index Id : " + index,selectedIndex: [index]})
  };

  handlePanelClose = (index,e,collapsed) => {
    this.setState({ msg: "onClose event callback on Panel, Index Id : " + index + " collpased : " + collapsed,  selectedIndex:[] })
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      <ConfigProvider version={version} theme={theme}>
        <div style={{width: 500}}>
          <Panel enableMultiExpand={true} selectedIndex={this.state.selectedIndex} onExpand={this.handlePanelExpand}
                 onClose={this.handlePanelClose}>
            <PanelItem title={this.title()}>
              <div style={{padding: 50}}>Content of My Folding Panel 1</div>
            </PanelItem>
            <PanelItem title={this.title()}>
              <div style={{padding: 50}}>Content of My Folding Panel 2</div>
            </PanelItem>
          </Panel>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PanelEventExample />, mountNode);

```

