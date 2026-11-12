# JList JList

> 分类：数据展示

JList is mainly used for display items in list form.

## API

| 方法名      | 描述                                                                          | 参数 | 返回值 |
| ----------- | ----------------------------------------------------------------------------- | ---- | ------ |
| getSelectedItemsIndex |get the indexes of selected items | 无   | array  |
| getSelectedItems   | get the selected data | none | array |

### 属性

| Property name | Description | Type | Default |
|:-----|:-----|:-----|:-----|
| id |  By default, the component set the dynamic id，The component allows users to customize id | string |  |
| style |  User-defined style  through style | object |  |
| className |  User-defined style  through class | string |  |
| style |  You can add a style of changing the style of a component，Function in the component of the outermost div | object |  |
| disabled |  Set the component cannot be selected | bool | false |
| height |  The height of the custom component | number | 300 |
| width |  Customizing Component width | number | 700 |
| items |  Content items on the left, {text:"Mgmt & Deployment", isEnable:false},if isEnable is false item can't be selected| array |  |
| textAlign| Text align , take of one value "left", "right", "center"|string|left|
| selectedIndex | Index of selected items.|array| |
| mutiSelectEnable|	if true the multi select using control+click is supported .| bool     |false|
| onClick |  Set the click event of the component<br><br>**Signature:**<br>`function(event: object,item,index) => void`<br>*event:* The original click event | function |  |

## 接口定义

```typescript
interface JList {


  /**
   * 组件id
   */
  id: string;

  /**
   * 通过添加class的方式改变组件的样式，作用于组件的最外层div
   */
  className: string;

  /**
   * 通过添加style的方式改变组件的样式，作用于组件的最外层div
   */
  style: object;

  /**
   *设置组件所有按钮的灰化
   */
  disabled: boolean;

  /**
   * 自定义组件的高度
   */
  height: number;

  /**
   * 自定义组件的宽度
   */
  width: number;


  /**
   * 左边内容条目
   */
  items: any;

  /**
   * 已选择条目
   */
  selectedIndex: number[];

  /**
   * 左侧item点击事件
   *
   * @param {any} value 当前选中的节点信息
   */
  onClick: any;

  /**
   *  Text Align.
   */
  textAlign: string;

  /**
   * select multi select option.
   */
  mutiSelectEnable: boolean;

  /**
   * add version setting.
   */
  version: string;

  /**
   * add theme setting.
   */
  theme: string;

}
```

## 使用示例

### 基本属性设置

## en-US




```jsx
import JList from 'eview-ui/JList';
import TextField from 'eview-ui/TextField';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class JListExample extends React.Component {
  state = {
    msg: null,
    selected: [3, 5],
  };

  onclickEvent = (e, value, index) => {
    console.log(e, value, index);
    // 这一句很重要，jlist没有将选中值暴露出来，主动更新到state中，避免state刷新后组件被使用初始值刷新
    // 如果是单选需要改成
    // this.setState({
    //   selected:index
    // })
    this.state.selected = this.jlist.getSelectedItemsIndex();
  };

  handleGetSelectedItemIndex = () => {
    const row = this.jlist.getSelectedItemsIndex();
    this.setState({
      msg: (
        <div>
          getSelectedItemsIndex
          <br />[{row.map(v => v.toString()).join(',')}]
        </div>
      ),
    });
  };

  handleGetSelectedData = () => {
    const row = this.jlist.getSelectedItems();
    console.log('row', row);
    this.setState({
      msg: (
        <div>
          getSelectedItems
          <br />[{row.map(v => v.text.toString()).join(',')}]
        </div>
      ),
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const children = [
      { text: 'Computing development system Computing development system Computing development system' },
      { text: 'Mgmt & Deployment system', isEnable: false },
      { text: 'High Storage device' },
      { text: 'Higly deployed System' },
      { text: 'RAM data' },
      { text: 'Memory storage' },
      { text: 'Mouse event' },
      { text: 'Keyboard envent' },
      { text: 'Monitor display' },
      { text: 'Monitor No display' },
      { text: 'Monitor working Ok' },
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_lbExample">
          <div style={{marginLeft: '20px', marginBottom: '20px'}}>
            <div style={{marginBottom: '10px'}}>
              <Button onClick={this.handleGetSelectedItemIndex} text="Read Selected indexes"/>{' '}
              <Button onClick={this.handleGetSelectedData} text="Read Selected data"/>{' '}
            </div>

            <JList
              items={children}
              selectedIndex={this.state.selected}
              width={500}
              height={240}
              mutiSelectEnable
              textAlign="right"
              onClick={this.onclickEvent}
              ref={jlist => {
                this.jlist = jlist;
              }}
            ></JList>
          </div>

          <br/>
          {this.state.msg && (
            <DivMessage text={this.state.msg} type="success" style={{marginTop: '10px', width: '100%'}}/>
          )}
          <br/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<JListExample />, mountNode);
```

```jsx
import JList from 'eview-ui/JList';
import TextField from 'eview-ui/TextField';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class JListExample extends React.Component {
  state = {
    msg: null,
    selected: [3, 5],
  };

  onclickEvent = (e, value, index) => {
    console.log(e, value, index);
    // 这一句很重要，jlist没有将选中值暴露出来，主动更新到state中，避免state刷新后组件被使用初始值刷新
    // 如果是单选需要改成
    // this.setState({
    //   selected:index
    // })
    this.state.selected = this.jlist.getSelectedItemsIndex();
  };

  handleGetSelectedItemIndex = () => {
    const row = this.jlist.getSelectedItemsIndex();
    this.setState({
      msg: (
        <div>
          getSelectedItemsIndex
          <br />[{row.map(v => v.toString()).join(',')}]
        </div>
      ),
    });
  };

  handleGetSelectedData = () => {
    const row = this.jlist.getSelectedItems();
    console.log('row', row);
    this.setState({
      msg: (
        <div>
          getSelectedItems
          <br />[{row.map(v => v.text.toString()).join(',')}]
        </div>
      ),
    });
  };

  render() {
    const [version, theme] = getDemoVersion();
    const children = [
      { text: 'Computing development system Computing development system Computing development system' },
      { text: 'Mgmt & Deployment system', isEnable: false },
      { text: 'High Storage device' },
      { text: 'Higly deployed System' },
      { text: 'RAM data' },
      { text: 'Memory storage' },
      { text: 'Mouse event' },
      { text: 'Keyboard envent' },
      { text: 'Monitor display' },
      { text: 'Monitor No display' },
      { text: 'Monitor working Ok' },
    ];

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_lbExample">
          <div style={{marginLeft: '20px', marginBottom: '20px'}}>
            <div style={{marginBottom: '10px'}}>
              <Button onClick={this.handleGetSelectedItemIndex} text="Read Selected indexes"/>{' '}
              <Button onClick={this.handleGetSelectedData} text="Read Selected data"/>{' '}
            </div>

            <JList
              items={children}
              selectedIndex={this.state.selected}
              width={500}
              height={240}
              mutiSelectEnable
              textAlign="right"
              onClick={this.onclickEvent}
              ref={jlist => {
                this.jlist = jlist;
              }}
            ></JList>
          </div>

          <br/>
          {this.state.msg && (
            <DivMessage text={this.state.msg} type="success" style={{marginTop: '10px', width: '100%'}}/>
          )}
          <br/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<JListExample />, mountNode);
```

