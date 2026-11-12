# GridLayout 网格布局

> 分类：布局

网格布局组件，可以使用组件 `Row` 和`Col`生成网格布局。支持设置每行的列数，默认24列。


## antd 迁移注意事项

> 导入特例：`import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`（Row/Col 具名导出）

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Form` layout 布局 | `GridLayout`（Row/Col） | `Row totalCols`（默认 24）+ `Col cols`（= span）/`offset`；`gutter`→`colMargin`（CSS margin 写法）；**无响应式断点**（无 xs/sm/md）；配合 `eui_form_ctrl` 类受 Form 控制布局 |
| `Row` / `Col` | `Row` / `Col`（GridLayout） | `import { Row, Col } from '@cloudsop/eview-ui/GridLayout'`；`span`→**`cols`**；`gutter`→`colMargin`（**CSS margin 字符串写法**，如 `'0 0 1rem 1rem'`，不是数字/数组）；`offset` 同名；**无响应式断点**（xs/sm/md/lg/xl 全删）；复杂栅格手写 flex/grid |

## API

### Row属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  Row根节点的id | string |  |
| className |  Row根节点的样式类名 | string |  |
| style |  覆盖Row根节点的行内样式 | object |  |
| totalCols |  Row的列数 | number | 24 |
| colStyle |  为行内每列设置style | object |  |
| colMargin |  设置col的间距，同css margin设置写法 | string |  |

### Col属性

Col是Row的子标签和Row标签一起使用。

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  Col根节点的id | string |  |
| className |  Col根节点的样式类名 | string |  |
| style |  覆盖Col根节点的行内样式 | object |  |
| cols |  Col节点所占单元格数目 | number | 1 |
| offset |  Col节点相对于前一个同胞的单元格偏移量 | number | 0 |

## 接口定义

```typescript
import type { ReactNode } from 'react';
interface GridLayout {


  /**
   * Col根节点的id
   */
  id: string;

  /**
   * Col根节点的样式类名
   */
  className: string;

  /**
   * 覆盖Col根节点的行内样式
   */
  style: object;

  /**
   * Col节点所占单元格数目
   */
  cols: number;

  /**
   * Col节点相对于前一个同胞的单元格偏移量
   */
  offset: number;

  children: ReactNode;

}

interface Row {


  /**
   * Row根节点的id
   */
  id: string;

  /**
   * Row根节点的样式类名
   */
  className: string;

  /**
   * 覆盖Row根节点的行内样式
   */
  style: object;

  /**
   * Row的列数
   */
  totalCols: number;

  /**
   * 为行内每列设置style
   */
  colStyle: object;

  /**
   * 设置col的间距，同css margin设置写法
   */
  colMargin: string;

  children: ReactNode;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import {Row, Col} from 'eview-ui/GridLayout';
import LabelField from 'eview-ui/LabelField';

export default class RowExample extends React.Component {

  render() {

    const colProps = {
      style: {
        padding: "10px 15px",
        border: "1px solid #dadada",
        background: "#efefef",
        color: "#666",
        fontSize: "12px",
      }
    };

    const rowProps = {
      colStyle:{
        padding: "10px 0px",
        background: " rgba(134,134,134,0.8)",
        color: "#fff",
        fontSize: "12px",
        textAlign:"center"
      },
      style:{marginBottom:"20px", background:"#fccad6"},
      colMargin: "10px"
      };

    const labelStyle={
      style:{
        paddingLeft:"0",
        display:"block"
      }
    };

    let row1 =[];
    for(var i =0;i<24;i++){
      row1.push(<Col cols={1} key={i}>1</Col>)
    }
    let row2 =[];
    for(var i =0;i<12;i++){
      row2.push(<Col cols={2} key={i}>2</Col>)
    }

    let row3 =[];
    for(var i =0;i<8;i++){
      row3.push(<Col cols={3} key={i}>3</Col>)
    }

    let row4 =[];
    for(var i =0;i<6;i++){
      row4.push(<Col cols={4} key={i}>4</Col>)
    }

    let row6 =[];
    for(var i =0;i<4;i++){
      row6.push(<Col cols={6} key={i}>6</Col>)
    }
    let row8 =[];
    for(var i =0;i<3;i++){
      row8.push(<Col cols={8} key={i}>8</Col>)
    }
    let row12 =[];
    for(var i =0;i<2;i++){
      row12.push(<Col cols={12} key={i}>12</Col>)
    }
    let row24 =[];
    for(var i =0;i<1;i++){
      row24.push(<Col cols={24} key={i}>24</Col>)
    }

    return <div style={{margin:"0 20px"}}>

      <LabelField {...labelStyle} text={"Set the grid"}/>
      <Row {...rowProps}>
        {row1}
      </Row>
      <Row {...rowProps}>
        {row2}
      </Row>
      <Row {...rowProps}>
        {row3}
      </Row>
      <Row {...rowProps}>
        {row4}
      </Row>
      <Row {...rowProps}>
        {row6}
      </Row>
      <Row {...rowProps}>
        {row8}
      </Row>
      <Row {...rowProps}>
        {row12}
      </Row>
      <Row {...rowProps}>
        {row24}
      </Row>
    </div>
  }
}

ReactDOM.render(<RowExample />, mountNode);

```

```jsx
import {Row, Col} from 'eview-ui/GridLayout';
import LabelField from 'eview-ui/LabelField';

export default class RowExample extends React.Component {

  render() {

    const colProps = {
      style: {
        padding: "10px 15px",
        border: "1px solid #dadada",
        background: "#efefef",
        color: "#666",
        fontSize: "12px",
      }
    };

    const rowProps = {
      colStyle:{
        padding: "10px 0px",
        background: " rgba(134,134,134,0.8)",
        color: "#fff",
        fontSize: "12px",
        textAlign:"center"
      },
      style:{marginBottom:"20px", background:"#fccad6"},
      colMargin: "10px"
      };

    const labelStyle={
      style:{
        paddingLeft:"0",
        display:"block"
      }
    };

    let row1 =[];
    for(var i =0;i<24;i++){
      row1.push(<Col cols={1} key={i}>1</Col>)
    }
    let row2 =[];
    for(var i =0;i<12;i++){
      row2.push(<Col cols={2} key={i}>2</Col>)
    }

    let row3 =[];
    for(var i =0;i<8;i++){
      row3.push(<Col cols={3} key={i}>3</Col>)
    }

    let row4 =[];
    for(var i =0;i<6;i++){
      row4.push(<Col cols={4} key={i}>4</Col>)
    }

    let row6 =[];
    for(var i =0;i<4;i++){
      row6.push(<Col cols={6} key={i}>6</Col>)
    }
    let row8 =[];
    for(var i =0;i<3;i++){
      row8.push(<Col cols={8} key={i}>8</Col>)
    }
    let row12 =[];
    for(var i =0;i<2;i++){
      row12.push(<Col cols={12} key={i}>12</Col>)
    }
    let row24 =[];
    for(var i =0;i<1;i++){
      row24.push(<Col cols={24} key={i}>24</Col>)
    }

    return <div style={{margin:"0 20px"}}>

      <LabelField {...labelStyle} text={"Set the grid"}/>
      <Row {...rowProps}>
        {row1}
      </Row>
      <Row {...rowProps}>
        {row2}
      </Row>
      <Row {...rowProps}>
        {row3}
      </Row>
      <Row {...rowProps}>
        {row4}
      </Row>
      <Row {...rowProps}>
        {row6}
      </Row>
      <Row {...rowProps}>
        {row8}
      </Row>
      <Row {...rowProps}>
        {row12}
      </Row>
      <Row {...rowProps}>
        {row24}
      </Row>
    </div>
  }
}

ReactDOM.render(<RowExample />, mountNode);

```

### 用例演示

## en-US



```jsx
import { Row, Col } from 'eview-ui/GridLayout';
import LabelField from 'eview-ui/LabelField';
import { Button, IPInput, MultipleSelect, Toggle, FileUpload, LinkField, TimeSelector, Select, DatePicker, RadioGroup, TextField, TextArea } from 'eview-ui';
import ButtonMenu from 'eview-ui/ButtonMenu';

export default class GridApp2 extends React.Component {

  render() {
    
    const rowProps = {
      colStyle: {
        background: "#ffffff",
      }

    };
    const rowStyle = {
      marginBottom: "20px",
      marginLeft: "20px"
    };
    
    let optionButtonMenu = [
      { text: "Create", value: 1 },
      { text: "Export", value: 2 },
      { text: "Delete", value: 3 },
      { text: "Create1", value: 1 }];

    let buttonStyle = { marginRight: "5px", textAlign: "CENTER" };
    let buttonMenuStyle = { marginRight: "5px", textAlign: "CENTER", top: "-16px" };
   
    const labelStyle = {
      style: {
        paddingLeft: "10px",
        display: "block"
      }
    };
    const ipParam = {
      labelStyle: { marginRight: "20px" },
      disabled: false,
      paddingLeft: "-10px",
    };
    
    let toggleStyle = { marginRight: "10px" };
    let data = [{ value: 1, text: "MALE" }, { value: 2, text: "FEMALE" }];
    let optionSelect = [{ text: "SONY", value: 1 }, { text: "SAMSUNG", value: 2 }, { text: "NOKIA", value: 3 }];
    let langOptions = [{ text: "English", value: 1 }, { text: "Hindi", value: 2 }, { text: "Spanish", value: 3 }];
    let linkStyle = { display: "inline-block", marginRight: "30px" };

    return <div style={{ margin: "0 20px", background: "#ffffff", paddingBottom: "10px" }}>

      <LabelField {...labelStyle} text={"Grid Application"} />

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4} >
          <LabelField {...labelStyle} text={"*Name :"} />
        </Col>
        <Col cols={5} >
          <TextField placeholder="Please enter..." labelStyle={labelStyle} inputStyle={{width: '200px'}}/>
        </Col>
        <Col cols={4} >
          <LabelField {...labelStyle} text={"*Country :"} />
        </Col>
        <Col cols={5} >
          <TextField labelStyle={labelStyle} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Gender :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_RadioGroup_example">
            <RadioGroup data={data} />
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Brand Types :"} />
        </Col>
        <Col cols={5}>
          <Select options={optionSelect} selectedIndex={0} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Time :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_ts_example">
            <TimeSelector time={[17, 23, 30]} labelStyle={labelStyle} />
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Select :"} />
        </Col>
        <Col cols={5}>
          <Select options={langOptions} selectedIndex={0} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Password Field :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_inputPass_example">
            <TextField placeholder="Password field" type="password" value="" autoComplete="off" labelStyle={labelStyle} inputStyle={{width: '200px'}}/>
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*IP :"} />
        </Col>
        <Col cols={5}>
          <div>
            <IPInput {...ipParam} />
          </div>
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"Toggle :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_toggle_example">
            <Toggle toggled={true} style={toggleStyle} />
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Links :"} />
        </Col>
        <Col cols={5}>
          <LinkField style={linkStyle} text={"Wiki"} href={'https://www.google.com'} disabled={false} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"Text Area:"} />
        </Col>
        <Col cols={15}>
          <DatePicker value={new Date()} type='datetime' time={[10, 10, 10]} format='YYYY-MM-DD HH:mm:ss' required />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps} id="evu_button_example">
        <Col cols={24}>
          <Button text="Default button" disabled={false} style={buttonStyle} />
          <Button text="button1" id="createFiberButton" disabled={false} style={buttonStyle} />
          <Button text="button2" id="delFiberButton" disabled={false} style={buttonStyle} />
          <ButtonMenu text="Operation" options={optionButtonMenu} selectedIndex={0} selectStyle={buttonMenuStyle} />
          <ButtonMenu text="Operation" options={optionButtonMenu} selectedIndex={0} selectStyle={buttonMenuStyle} />
          <Button text="button1" id="createFiberButton" disabled={false} style={buttonStyle} />
          <Button text="button1" id="createFiberButton" disabled={false} style={buttonStyle} />
        </Col>

      </Row>

    </div>
  }
}

ReactDOM.render(<GridApp2 />, mountNode);

```

```jsx
import { Row, Col } from 'eview-ui/GridLayout';
import LabelField from 'eview-ui/LabelField';
import { Button, IPInput, MultipleSelect, Toggle, FileUpload, LinkField, TimeSelector, Select, DatePicker, RadioGroup, TextField, TextArea } from 'eview-ui';
import ButtonMenu from 'eview-ui/ButtonMenu';

export default class GridApp2 extends React.Component {

  render() {
    
    const rowProps = {
      colStyle: {
        background: "#ffffff",
      }

    };
    const rowStyle = {
      marginBottom: "20px",
      marginLeft: "20px"
    };
    
    let optionButtonMenu = [
      { text: "Create", value: 1 },
      { text: "Export", value: 2 },
      { text: "Delete", value: 3 },
      { text: "Create1", value: 1 }];

    let buttonStyle = { marginRight: "5px", textAlign: "CENTER" };
    let buttonMenuStyle = { marginRight: "5px", textAlign: "CENTER", top: "-16px" };
   
    const labelStyle = {
      style: {
        paddingLeft: "10px",
        display: "block"
      }
    };
    const ipParam = {
      labelStyle: { marginRight: "20px" },
      disabled: false,
      paddingLeft: "-10px",
    };
    
    let toggleStyle = { marginRight: "10px" };
    let data = [{ value: 1, text: "MALE" }, { value: 2, text: "FEMALE" }];
    let optionSelect = [{ text: "SONY", value: 1 }, { text: "SAMSUNG", value: 2 }, { text: "NOKIA", value: 3 }];
    let langOptions = [{ text: "English", value: 1 }, { text: "Hindi", value: 2 }, { text: "Spanish", value: 3 }];
    let linkStyle = { display: "inline-block", marginRight: "30px" };

    return <div style={{ margin: "0 20px", background: "#ffffff", paddingBottom: "10px" }}>

      <LabelField {...labelStyle} text={"Grid Application"} />

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4} >
          <LabelField {...labelStyle} text={"*Name :"} />
        </Col>
        <Col cols={5} >
          <TextField placeholder="Please enter..." labelStyle={labelStyle} inputStyle={{width: '200px'}}/>
        </Col>
        <Col cols={4} >
          <LabelField {...labelStyle} text={"*Country :"} />
        </Col>
        <Col cols={5} >
          <TextField labelStyle={labelStyle} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Gender :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_RadioGroup_example">
            <RadioGroup data={data} />
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Brand Types :"} />
        </Col>
        <Col cols={5}>
          <Select options={optionSelect} selectedIndex={0} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Time :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_ts_example">
            <TimeSelector time={[17, 23, 30]} labelStyle={labelStyle} />
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Select :"} />
        </Col>
        <Col cols={5}>
          <Select options={langOptions} selectedIndex={0} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Password Field :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_inputPass_example">
            <TextField placeholder="Password field" type="password" value="" autoComplete="off" labelStyle={labelStyle} inputStyle={{width: '200px'}}/>
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*IP :"} />
        </Col>
        <Col cols={5}>
          <div>
            <IPInput {...ipParam} />
          </div>
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"Toggle :"} />
        </Col>
        <Col cols={5} >
          <div id="evu_toggle_example">
            <Toggle toggled={true} style={toggleStyle} />
          </div>
        </Col>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"*Links :"} />
        </Col>
        <Col cols={5}>
          <LinkField style={linkStyle} text={"Wiki"} href={'https://www.google.com'} disabled={false} />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps}>
        <Col cols={4}>
          <LabelField {...labelStyle} text={"Text Area:"} />
        </Col>
        <Col cols={15}>
          <DatePicker value={new Date()} type='datetime' time={[10, 10, 10]} format='YYYY-MM-DD HH:mm:ss' required />
        </Col>
      </Row>

      <Row style={rowStyle} {...rowProps} id="evu_button_example">
        <Col cols={24}>
          <Button text="Default button" disabled={false} style={buttonStyle} />
          <Button text="button1" id="createFiberButton" disabled={false} style={buttonStyle} />
          <Button text="button2" id="delFiberButton" disabled={false} style={buttonStyle} />
          <ButtonMenu text="Operation" options={optionButtonMenu} selectedIndex={0} selectStyle={buttonMenuStyle} />
          <ButtonMenu text="Operation" options={optionButtonMenu} selectedIndex={0} selectStyle={buttonMenuStyle} />
          <Button text="button1" id="createFiberButton" disabled={false} style={buttonStyle} />
          <Button text="button1" id="createFiberButton" disabled={false} style={buttonStyle} />
        </Col>

      </Row>

    </div>
  }
}

ReactDOM.render(<GridApp2 />, mountNode);

```

### 用例演示

## en-US



```jsx
import { Row, Col } from 'eview-ui/GridLayout';
import huawei from '@images/huawei';
import Table from 'eview-ui/Table';
import img1 from '@images/table_1';
import img2 from '@images/table_2';
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';

class TableBasic extends React.Component {

  handleHeaderCheck = (row, checkedRows, e) => {
    console.log("header checked...")
  };

  handleRowExpend = (row) => {
    let columns = [
      {
        title: 'VPN Name',
        width: 300,
      },
      {
        title: 'State',
        width: 300,

      },
      {
        title: 'Site',
        width: 300,

      },
      {
        title: 'Alarm',
        allowSort: false,

      },
    ];
    const rowsdata = [];

    for (let i = 0; i < 5; i++) {
      rowsdata.push([`R&D VPN2${i}`, 'Active', i, 'ICMP Echo']);
    }
    return (<div style={{ padding: "20px", background: "#efefef" }}>
      <Table
        columns={columns}
        dataset={rowsdata}
        enableCheckBox
        headerCheckBoxSortAllow={true}
        ref={innerTable => { this.innerTable = innerTable; }} /></div>);
  }
  handleItemClick1 = (item) => {
    this.setState({ isShow1: false, value: item.value })
  };
  renderStateColumn(cell) {
    if (cell === 'TO BE') {
      return (
        <div>
          <img src={img1} style={{ verticalAlign: 'bottom' }} alt="TO BE" />
          {' '}
          TO BE
        </div>
      );
    }
    return (
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" />
        {' '}
        Active
      </div>
    );
  }


  render() {
    const columns = [
      {
        title: 'VPN Name',

        id: "col_1",
      },
      {
        title: 'State',

        render: cell => this.renderStateColumn(cell),
        allowSort: false,
        id: "col_2",
      },
      {
        title: 'Site',        
        display: true, // Hide column,
        id: "col_3",
      },
      {
        title: 'Alarm',
      },
    ];

    let options = [{ text: "Select All Data", value: 1 },
    { text: "Select Odd Rows", value: 2 },
    { text: "Select Even Rows", value: 3 },];
    const rows = [];
    rows.push(['R&D VPN2', 'TO BE', 3, 'ICMP Echo']);
    rows.push(['Shop Storage', 'Active', 3, 'ICMP Echo']);
    rows.push(['IT Link', 'Active', 7, 'Critical']);
    rows.push(['R&D VPN1', 'Active', 3, 'Major']);
    rows.push(['R&D VPN6', 'TO BE', 5, 'ICMP Echo']);

    return (
      <div>
        <Table
          columns={columns} // Column Details
          dataset={rows} // Data Set
          selectedRowIndex={2} // Row ID 2 is selected.       
          enableColumnFilter //Allow column to be selected.
          checkBoxOptions={options}
          onRowExpend={this.handleRowExpend}
          onRowCheck={this.handleHeaderCheck}
          enableCheckBox
          enableRowExpand
          checkBoxPopupData={{ data: options, optionStyle: { width: '15rem' }, onItemClick: this.handleItemClick1 }}
        />
      </div>
    );
  }
}

class TreeIconClassDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback, node id is : " + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    this.setState({ checkedKeys: checkedKeys, msg: "OnCheck event callback, node id is : " + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback, node id is : " + node.props.eventKey });
  };

  render() {
    let data = [
      {
        text: 'Root Node', id: 1,
        iconExpandedClassName: 'treeexampleOpenIcon',
        iconCollapsedClassName: 'treeexampleCloseIcon',
        children: [
          {
            text: 'Subnet0', id: 11,
            iconExpandedClassName: 'treeexampleOpenIcon',
            iconCollapsedClassName: 'treeexampleCloseIcon',
            children: [
              {
                text: 'NE_1', id: 21,
                iconExpandedClassName: 'treeexampleOpenIcon',
                iconCollapsedClassName: 'treeexampleCloseIcon',
                children: [
                  { text: 'NE_1', id: 31, iconLeafClassName: 'treeexampleLeafIcon' },
                  { text: 'NE_2', id: 32, iconLeafClassName: 'treeexampleLeafIcon' }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            iconExpandedClassName: 'treeexampleOpenIcon',
            iconCollapsedClassName: 'treeexampleCloseIcon',
            children: [
              { text: 'NE_1', id: 23, iconLeafClassName: 'treeexampleLeafIcon' },
              { text: 'NE_2', id: 24, iconLeafClassName: 'treeexampleLeafIcon' }]
          }]
      }
    ];
       return <div>
      <Tree
        data={data}
        nodeKey={'id'}
        checkedKeys={this.state.checkedKeys}
        selectedKeys={this.state.selectedKeys}
        expandedKeys={this.state.expandedKeys}
        checkable={true}
        onSelect={this.handleSelect}
        onCheck={this.handleCheck}
        onExpand={this.handleExpand} />

      {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "560px" }} /> : ''}
    </div>;
  }
}

export default class GridExample extends React.Component {

  render() {
    return <div style={{ height: "600px", margin: "0 20px", background: "#ffff9f", paddingBottom: "10px" }}>
      <div>
        <Row >
          <Col cols={4} style={{height: "500px", background: "#C2E89F", borderStyle: "ridge" }}  >
            <TreeIconClassDemo />
          </Col>
          <Col cols={20} style={{ background: "#A2E89F", borderStyle: "ridge" }}>
            <Row >
              <Col cols={6}>
                <img src={huawei} alt="Dinner" />
              </Col>
              <Col cols={16}>
                <TableBasic />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  }
}

ReactDOM.render(<GridExample />, mountNode);

```

```jsx
import { Row, Col } from 'eview-ui/GridLayout';
import huawei from '@images/huawei';
import Table from 'eview-ui/Table';
import img1 from '@images/table_1';
import img2 from '@images/table_2';
import Tree from 'eview-ui/Tree';
import DivMessage from 'eview-ui/DivMessage';

class TableBasic extends React.Component {

  handleHeaderCheck = (row, checkedRows, e) => {
    console.log("header checked...")
  };

  handleRowExpend = (row) => {
    let columns = [
      {
        title: 'VPN Name',
        width: 300,
      },
      {
        title: 'State',
        width: 300,

      },
      {
        title: 'Site',
        width: 300,

      },
      {
        title: 'Alarm',
        allowSort: false,

      },
    ];
    const rowsdata = [];

    for (let i = 0; i < 5; i++) {
      rowsdata.push([`R&D VPN2${i}`, 'Active', i, 'ICMP Echo']);
    }
    return (<div style={{ padding: "20px", background: "#efefef" }}>
      <Table
        columns={columns}
        dataset={rowsdata}
        enableCheckBox
        headerCheckBoxSortAllow={true}
        ref={innerTable => { this.innerTable = innerTable; }} /></div>);
  }
  handleItemClick1 = (item) => {
    this.setState({ isShow1: false, value: item.value })
  };
  renderStateColumn(cell) {
    if (cell === 'TO BE') {
      return (
        <div>
          <img src={img1} style={{ verticalAlign: 'bottom' }} alt="TO BE" />
          {' '}
          TO BE
        </div>
      );
    }
    return (
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" />
        {' '}
        Active
      </div>
    );
  }


  render() {
    const columns = [
      {
        title: 'VPN Name',

        id: "col_1",
      },
      {
        title: 'State',

        render: cell => this.renderStateColumn(cell),
        allowSort: false,
        id: "col_2",
      },
      {
        title: 'Site',        
        display: true, // Hide column,
        id: "col_3",
      },
      {
        title: 'Alarm',
      },
    ];

    let options = [{ text: "Select All Data", value: 1 },
    { text: "Select Odd Rows", value: 2 },
    { text: "Select Even Rows", value: 3 },];
    const rows = [];
    rows.push(['R&D VPN2', 'TO BE', 3, 'ICMP Echo']);
    rows.push(['Shop Storage', 'Active', 3, 'ICMP Echo']);
    rows.push(['IT Link', 'Active', 7, 'Critical']);
    rows.push(['R&D VPN1', 'Active', 3, 'Major']);
    rows.push(['R&D VPN6', 'TO BE', 5, 'ICMP Echo']);

    return (
      <div>
        <Table
          columns={columns} // Column Details
          dataset={rows} // Data Set
          selectedRowIndex={2} // Row ID 2 is selected.       
          enableColumnFilter //Allow column to be selected.
          checkBoxOptions={options}
          onRowExpend={this.handleRowExpend}
          onRowCheck={this.handleHeaderCheck}
          enableCheckBox
          enableRowExpand
          checkBoxPopupData={{ data: options, optionStyle: { width: '15rem' }, onItemClick: this.handleItemClick1 }}
        />
      </div>
    );
  }
}

class TreeIconClassDemo extends React.Component {

  state = {
    checkedKeys: [],
    selectedKeys: [1],
    expandedKeys: [1],
    msg: ''
  };

  handleSelect = (selectedKeys, node) => {
    this.setState({ selectedKeys: selectedKeys, msg: "OnSelect event callback, node id is : " + node.props.eventKey });
  };

  handleCheck = (checkedKeys, node) => {
    this.setState({ checkedKeys: checkedKeys, msg: "OnCheck event callback, node id is : " + node.props.eventKey });
  };

  handleExpand = (expandedKeys, node) => {
    this.setState({ expandedKeys: expandedKeys, msg: "OnExpand event callback, node id is : " + node.props.eventKey });
  };

  render() {
    let data = [
      {
        text: 'Root Node', id: 1,
        iconExpandedClassName: 'treeexampleOpenIcon',
        iconCollapsedClassName: 'treeexampleCloseIcon',
        children: [
          {
            text: 'Subnet0', id: 11,
            iconExpandedClassName: 'treeexampleOpenIcon',
            iconCollapsedClassName: 'treeexampleCloseIcon',
            children: [
              {
                text: 'NE_1', id: 21,
                iconExpandedClassName: 'treeexampleOpenIcon',
                iconCollapsedClassName: 'treeexampleCloseIcon',
                children: [
                  { text: 'NE_1', id: 31, iconLeafClassName: 'treeexampleLeafIcon' },
                  { text: 'NE_2', id: 32, iconLeafClassName: 'treeexampleLeafIcon' }]
              },
              { text: 'NE_2', id: 22 }]
          },
          {
            text: 'NE_3', id: 12,
            iconExpandedClassName: 'treeexampleOpenIcon',
            iconCollapsedClassName: 'treeexampleCloseIcon',
            children: [
              { text: 'NE_1', id: 23, iconLeafClassName: 'treeexampleLeafIcon' },
              { text: 'NE_2', id: 24, iconLeafClassName: 'treeexampleLeafIcon' }]
          }]
      }
    ];
       return <div>
      <Tree
        data={data}
        nodeKey={'id'}
        checkedKeys={this.state.checkedKeys}
        selectedKeys={this.state.selectedKeys}
        expandedKeys={this.state.expandedKeys}
        checkable={true}
        onSelect={this.handleSelect}
        onCheck={this.handleCheck}
        onExpand={this.handleExpand} />

      {this.state.msg ? <DivMessage text={this.state.msg} type="success" style={{ marginTop: "10px", width: "560px" }} /> : ''}
    </div>;
  }
}

export default class GridExample extends React.Component {

  render() {
    return <div style={{ height: "600px", margin: "0 20px", background: "#ffff9f", paddingBottom: "10px" }}>
      <div>
        <Row >
          <Col cols={4} style={{height: "500px", background: "#C2E89F", borderStyle: "ridge" }}  >
            <TreeIconClassDemo />
          </Col>
          <Col cols={20} style={{ background: "#A2E89F", borderStyle: "ridge" }}>
            <Row >
              <Col cols={6}>
                <img src={huawei} alt="Dinner" />
              </Col>
              <Col cols={16}>
                <TableBasic />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  }
}

ReactDOM.render(<GridExample />, mountNode);

```

