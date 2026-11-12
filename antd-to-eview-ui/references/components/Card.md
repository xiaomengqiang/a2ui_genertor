# Card 卡片

> 分类：数据展示

该组件默认分default和primary两种样式，支持添加图标、设置按钮文本，自定义样式。


## API

### 属性

| 属性名称              | 描述 | 输入 | 默认 |
|-------------------|----|-----|-----|
| id                |  设置Card的id | string |  |
| className         |  通过添加类的方式控制整个Card的样式（控制最外层div） 可控制：margin、padding | string |  |
| style             |  通过添加style的方式控制整个Card组件的样式（控制最外层div） 可控制：margin、padding 例如：style={{margin:"0px"}} | React.CSSProperties |  |
| icon              |  支持通过icon的url,设置组件的图标，不设置则默认不显示 例如：icon='./confirm.svg' | string |  |
| title             |  通过title设置组件标题，title默认值为null 如果不传title，则不显示title | any |  |
| titleStyle        |  title样式定制 | React.CSSProperties |  |
| content           |  支持通过content设置组件内容 例如：content =[{ <br>text: "ID", // 必填，控制组件内容区域文本提示 <br>value: "test-node", // 必填，控制文本对应的值 <br> }, ...] | array |  |
| type              |  支持通过type设置组件类型 | enum:<br>&nbsp;'resource'<br>&nbsp;'detail'<br>&nbsp;'add'<br> | "detail" |
| selected          |  支持通过selected设置组件选中状态，selected=true时，组件外边框变色，否则保持不变 selected属性仅支持type=detail,resource两种类型，type=add时selected不起作用 | bool | false |
| menuTitle         |  setting the title of the dropDown menu. | string |  |
| menuItemStyle     |  通过添加style的方式，设置组件下拉列表项的样式,作用于下拉的最外层div,可通过后代选择器控制下拉项的样式 | React.CSSProperties |  |
| menuItemClassName |  通过添加class的方式，设置组件下拉列表项的样式,作用于下拉的最外层div,可通过后代选择器控制下拉项的样式 | string |  |
| menuPosition      |  设置下拉菜单的位置 | enum:<br>&nbsp;'left'<br>&nbsp;'right'<br> | 'right' |
| menuData          |  支持通过menuData设置子组件下拉菜单数据 例如：menuData = [ <br/>{ <br/>text: "China",  //下拉菜单项展示值 <br/>value: 1        //数据库存取值，为字符类型，点击时作为回调参数传入 <br/>},{...}]; | array |  |
| enableAdd         |  支持通过enableAdd设置组件底部添加按钮是否显示(目前仅在type="resource"时有效) | bool | false |
| onAdd             |  支持设置组件onAdd添加事件： <br/>1.type=resource或detail时，点击底部+号按钮添加事件，回调函数无参数； <br/>2.type=add时，组件+号点击添加事件；<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* ：+号按钮onClick事件 | function |  |
| onMenuItemClick   |  支持设置菜单子组件的onClick事件<br><br>**签名:**<br>`function(text: string) => void`<br>*text* ：菜单项的text的属性 | function |  |

## 接口定义

```typescript
interface Card {

  /**
   * 设置Card的id
   *
   */
  id: string;

  /**
   * 通过添加类的方式控制整个Card的样式（控制最外层div）
   * 可控制：margin、padding
   *
   */
  className: string;

  /**
   * 通过添加style的方式控制整个Card组件的样式（控制最外层div）
   * 可控制：margin、padding 例如：style={{margin:"0px"}}
   *
   */
  style: object;

  /**
   * 支持通过icon的url;设置组件的图标，不设置则默认不显示
   * 例如：icon='./confirm.svg'
   *
   */
  icon: string;

  /**
   * 通过title设置组件标题，title默认值为null
   * 如果不传title，则不显示title
   *
   */
  title: string;

  /**
   * 支持通过content设置组件内容
   * 例如：content =[{
   * <br>text: "ID"; // 必填，控制组件内容区域文本提示
   * <br>value: "test-node"; // 必填，控制文本对应的值
   * <br>
   * }; ...]
   *
   */
  content: any;

  /**
   * 支持通过type设置组件类型
   *
   */
  type: 'resource' | 'detail' | 'add';

  /**
   * 支持通过selected设置组件选中状态，selected=true时，组件外边框变色，否则保持不变
   * selected属性仅支持type=detail;resource两种类型，type=add时selected不起作用
   *
   */
  selected: boolean;

  /**
   * title provided for the dropDown Menu
   *
   */
  menuTitle: string;

  /**
   * 支持通过menuData设置子组件下拉菜单数据
   * 例如：menuData = [
   * <br/>{
   * <br/>text: "China";  //下拉菜单项展示值
   * <br/>value: 1        //数据库存取值，为字符类型，点击时作为回调参数传入
   * <br/>};{...}];
   *
   */
  menuData: any;

  /**
   * 通过添加style的方式，设置组件下拉列表项的样式;作用于下拉的最外层div;可通过后代选择器控制下拉项的样式
   */
  menuItemStyle: object;

  /**
   * 通过添加class的方式，设置组件下拉列表项的样式;作用于下拉的最外层div;可通过后代选择器控制下拉项的样式
   */
  menuItemClassName: string;

  /**
   * 设置下拉菜单的位置
   */
  menuPosition: 'left' | 'right';

  /**
   * 支持通过enableAdd设置组件底部添加按钮是否显示
   *
   */
  enableAdd: boolean;

  /**
   * 支持设置组件onAdd添加事件：
   * <br/>1.type=resource或detail时，点击底部+号按钮添加事件；
   * <br/>2.type=add时，组件+号点击添加事件；
   *
   * @param {object} event：+号按钮onClick事件
   */
  onAdd: () => unknown;

  /**
   * 支持设置菜单子组件的onClick事件
   *
   * @param {object} event：菜单项onClick事件
   */
  onMenuItemClick: (data: string, value: string) => unknown;

  /**
   * 支持通过version设置组件版本.
   */
  version: string;

  /**
   * 支持通过theme设置组件主题.
   */
  theme: string;

}

export type Props = Partial<Card>;
```

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import Card from 'eview-ui/Card';
import LabelField from 'eview-ui/LabelField';
import IconImage from '@images/cloud';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CardExample1 extends React.Component {
  render() {
    let divStyle = {
      margin: '5px 0px 30px 10px',
      display: 'block',
      height: '200px',
      width: '410px',
      float: 'left',
    };

    let detailContent = [
      { text: 'ID', value: 'test-node' },
      { text: 'Partitions', value: 'Root Partition' },
      { text: 'Create time', value: '2016-07-03 GMT + 08:00' },
    ];

    let resourceContent = [
      { text: 'Indicators', value: '8' },
      { text: 'Alarm', value: '9' },
    ];

    let options = [
      { text: 'China', value: 1 },
      { text: 'UK', value: 2 },
      { text: 'USA', value: 3 },
    ];

    let noTitleOptions = [{text: 'CPU USage', value: '18%'}];
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>

        <div id="eui_card_example">
          <div style={divStyle}>
            <LabelField text={"type='resource' && No title."}/>
            <Card
              type="resource"
              content={noTitleOptions}
              icon={IconImage}
              style={{marginRight: '20px'}}
            />
          </div>

          <div style={divStyle}>
            <LabelField text={"type='resource' && set title."}/>
            <Card
              icon={IconImage}
              title="Elastic cloud host"
              content={resourceContent}
              enableAdd={false}
              type="resource"
              style={{marginRight: '20px'}}
            />
          </div>

          <div style={divStyle}>
            <LabelField text={"type='resource' && enableAdd='true'."}/>
            <Card
              icon={IconImage}
              title="Elastic cloud host"
              content={resourceContent}
              enableAdd={true}
              type="resource"
              selected={true}
              style={{marginRight: '20px'}}
            />
          </div>

          <div style={divStyle}>
            <LabelField text={"type='detail' && set title."}/>
            <Card
              title="Default-VPC"
              content={detailContent}
              type="detail"
              menuTitle="Options"
              menuData={options}
              selected={true}
              style={{marginRight: '20px'}}
            />
          </div>

          <div style={divStyle}>
            <LabelField text="type='add'."/>
            <Card type="add"/>
          </div>

          <div style={{clear: 'both'}}></div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CardExample1 />, mountNode);
```

### 事件处理

事件处理

```jsx
import Card from 'eview-ui/Card';
import DivMessage from 'eview-ui/DivMessage';
import LabelField from 'eview-ui/LabelField';
import IconImage from '@images/cloud';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CardExample2 extends React.Component {
  state = {
    display: false,
    text: 'Default',
  };

  handleAddClick = () => {
    this.setState({
      display: true,
      text: 'Click Add Button',
    });
  };

  handleCardClick = () => {
    this.setState({
      display: true,
      text: 'Click Add Component',
    });
  };

  handleOptionClick = text => {
    this.setState({
      display: true,
      text: 'Click the action drop-down menu item :' + text,
    });
  };

  render() {
    let divStyle = {
      margin: '5px 0px 30px 10px',
      display: 'block',
      height: '220px',
      width: '410px',
      float: 'left',
    };

    let detailContent = [
      { text: 'ID', value: 'test-node' },
      { text: 'Available partitions', value: '1' },
      { text: 'Create time', value: '2016-07-03 GMT + 08:00' },
    ];

    let resourceContent = [
      { text: 'Indicators', value: '8' },
      { text: 'Alarm', value: '9' },
    ];

    let options = [
      { text: 'China', value: 1 },
      { text: 'UK', value: 2 },
      { text: 'USA', value: 3 },
    ];
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_card_example2">
          <div style={divStyle}>
            <LabelField text="onAdd event"/>
            <Card
              icon={IconImage}
              title="Elastic cloud host"
              content={resourceContent}
              enableAdd={true}
              selected={true}
              type="resource"
              onAdd={this.handleAddClick}
              style={{marginRight: '20px'}}
            />
          </div>

          <div style={divStyle}>
            <LabelField text="onMenuItemClick event"/>
            <Card
              title="Default-VPC"
              content={detailContent}
              type="detail"
              menuTitle="Options"
              selected={true}
              menuData={options}
              menuItemStyle={{width: '200px'}}
              onMenuItemClick={this.handleOptionClick}
              style={{marginRight: '20px'}}
            />
          </div>

          <div style={divStyle}>
            <LabelField text="type='add' && onAdd event"/>
            <Card type="add" onAdd={this.handleCardClick}/>
            <br/>
            <br/>
            <div style={{display: 'block'}}>
              <DivMessage text={this.state.text} type="default" display={this.state.display}/>
            </div>
          </div>

          <div style={{clear: 'both'}}></div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CardExample2 />, mountNode);
```

