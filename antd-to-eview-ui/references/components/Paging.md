# Paging 分页器

> 分类：导航

Paging为分页功能提供了基础支持。

### Paging组件的使用分为受控式和不受控式

- 完全受控式

通过在Props里设置currentPage来指定当前页码，通过在Props里设定onPageChange回调函数来改变当前页码

- 完全不受控式

通过在Props里设置currentPage来指定当前页码，不设置onPageChange回调函数，使用按钮的默认行为来改变当前页码

### 使用注意事项

一旦设置了onPageChange回调函数，组件将以完全受控式运行，按钮的默认行为将被禁用。


## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| recordCount |  总记录条数，必须 | number |  |
| recordCountDisp |  自定义总记录数的显示，会替代recordCount作为展示内容 | string |  |
| pageSize |  单页大小，切换分页下拉框会改变 | number | 10 |
| currentPage |  当前页码，点击分页会切换 | number | 1 |
| pageSizeOptions |  分页选项 | array | [10, 20, 50, 100] |
| type |  分页类型：数字列表或下拉框 | enum:<br>&nbsp;"list"<br>&nbsp;"select"<br>&nbsp;"simple"<br> | 'list' |
| onPageChange |  点击切换页码的时候触发的回调函数<br><br>**签名:**<br>`function(currentPage: number) => void`<br>*currentPage:* 页码 | function |  |
| onPageSizeChange |  分页大小切换事件回调<br><br>**签名:**<br>`function(pageSize: number) => void`<br>*pageSize:* 分页尺寸 | function |  |
| popupDirection |  弹出方向定义分页页面大小选择控制 | enum:<br>&nbsp;'top'<br>&nbsp;'bottom'<br> |  |
| splitPagination | 如果为“true”，则将分页切换到右侧。| bool |  false |
| className |  为组件外层容器增加class， | string |  |
| style |  为组件外层容器设置样式， | object |  |
| id |  ID of component | string |  |
| selectWidth | 自定义Select 下拉菜单的宽度。 | string |  |
| selectProps | Select子组件的props, 详情请查阅Select的API | object |  |
| hideConfig | 支持的配置['totalRecord', 'pageSize', 'gotoPage'], 其中totalRecord表示总数，pageSize表示页大小，gotoPage表示跳转页码，可根据实际需要配置其中一项或多项隐藏。默认不配置表示全部展示。注意：type配置select，由于原始不支持’pageSize'与‘gotoPage’，配置了无效。   | array |  |

## 接口定义

```typescript
export interface PaginationProps {

  /**
   * 设置多选下拉组件外层容器id
   */
  id?: string;

  /**
   * 通过style属性控制组件的样式，作用组件的最外层div
   */
  style?: object;

  /**
   * 通过添加class的方式控制组件的样式，作用于组件的最外层div
   */
  className?: string;

  /**
   * 总记录条数，必须
   */
  recordCount?: number;

  /**
   * Used in display of Total Record instead of recordCount.
   * Note : Total number of page calculation will be based on recordCount
   */
  recordCountDisp?: string;

  /**
   * 单页大小，切换分页下拉框会改变
   */
  pageSize?: number;

  /**
   * 当前页码，点击分页会切换
   */
  currentPage?: number;

  /**
   * 分页选项
   */
  splitPagination?: boolean;

  /**
   * 分页选项
   */
  pageSizeOptions?: number[];

  /**
   * 分页类型：数字列表或下拉框
   */
  type?: 'list' | 'select' | 'simple';

  /**
   * 点击切换页码的时候触发的回调函数
   * @param {number} currentPage 页码
   */
  onPageChange?: (currentPage: number) => void;

  /**
   * 分页大小切换事件回调
   *
   * @param {number} pageSize 分页尺寸
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Defines the direction of the popup in the pagination page size selection control
   */
  popupDirection?: 'top' | 'bottom';

  /**
   * Set the width of the select
   */
  selectWidth?: string;

  /**
   * Select子组件的props, 详情请查阅Select的API
   */
  selectProps?: any;

  /**
   * TextField 值变更后的回调函数
   */
  onInputChange?: (value: string) => void;

  /**
   * 支持通过version设置组件版本.
   */
  version?: string;

  /**
   * 支持通过theme设置组件主题.
   */
  theme?: string;
}
```

## 使用示例

### 基本属性设置

## en-US

```jsx
import Paging from "eview-ui/Paging";
import LabelField from "eview-ui/LabelField";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PagingBasic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 100,
      pageSize: 10,

      textTotal: 100,

      curPageForSelectType: 2,
      pageSizeForSelectType: 10,

      curPageForTextType: 2,
      pageSizeForTextType: 10,

      curPageForSimpleTextType: 2,
      pageSizeForSimpleTextType: 10,

      pageSizeForCustomType: 10,
    };
  }

  handlePageSizeChange = pageSize => {
    this.setState({ pageSize });
  };

  handlePageChangeForSelectType = curPageForSelectType => {
    this.setState({ curPageForSelectType });
  };

  handlePageChangeForSimpleTextType = curPageForSimpleTextType => {
    this.setState({ curPageForSimpleTextType });
  };

  handlePageChangeForTextType = curPageForTextType => {
    this.setState({ curPageForTextType });
  };

  handlePageSizeChangeForCustomType = pageSizeForCustomType => {
    this.setState({ pageSizeForCustomType });
  };

  render() {
    let labelStyle = { display: 'block', paddingLeft: '0px' };
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LabelField text="Default Type:" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            pageSize={this.state.pageSize}
            currentPage={2}
            onPageSizeChange={this.handlePageSizeChange}
            pageSizeOptions={[10, 30, 90]}
          />
          <br/> <br/>
          <LabelField text="Select Type:" style={labelStyle}/>
          <Paging
            type={"select"}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForSelectType}
            currentPage={this.state.curPageForSelectType}
            onPageChange={this.handlePageChangeForSelectType}
            pageSizeOptions={[10, 30, 90]}
          />
          <br/> <br/>
           <LabelField text="Simple Type: 精简分页器（配置hideConfig为['totalRecord', 'pageSize', 'gotoPage']）" style={labelStyle}/>
           <Paging
            type={"simple"}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForTextType}
            currentPage={this.state.curPageForTextType}
            onPageChange={this.handlePageChangeForTextType}
            pageSizeOptions={[10, 30, 90]}
            hideConfig={['totalRecord', 'pageSize', 'gotoPage']}
          />
          <br/> <br/>
          <LabelField text="Simple Type: 复杂分页器" style={labelStyle}/>
           <Paging
            type={"simple"}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForTextType}
            currentPage={this.state.curPageForTextType}
            onPageChange={this.handlePageChangeForTextType}
            pageSizeOptions={[10, 30, 90]}
          />
          <br/> <br/>
          <LabelField text="Custom Total Record Count" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            recordCountDisp={"100+"}
            pageSize={this.state.pageSizeForCustomType}
            splitPagination={false}
            currentPage={2}
            onPageSizeChange={this.handlePageSizeChangeForCustomType}
            pageSizeOptions={[10, 30, 90]}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PagingBasic />, mountNode);
```

```jsx
import Paging from "eview-ui/Paging";
import LabelField from "eview-ui/LabelField";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PagingBasic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 100,
      pageSize: 10,

      textTotal: 100,

      curPageForSelectType: 2,
      pageSizeForSelectType: 10,

      curPageForTextType: 2,
      pageSizeForTextType: 10,

      curPageForSimpleTextType: 2,
      pageSizeForSimpleTextType: 10,

      pageSizeForCustomType: 10,
    };
  }

  handlePageSizeChange = pageSize => {
    this.setState({ pageSize });
  };

  handlePageChangeForSelectType = curPageForSelectType => {
    this.setState({ curPageForSelectType });
  };

  handlePageChangeForSimpleTextType = curPageForSimpleTextType => {
    this.setState({ curPageForSimpleTextType });
  };

  handlePageChangeForTextType = curPageForTextType => {
    this.setState({ curPageForTextType });
  };

  handlePageSizeChangeForCustomType = pageSizeForCustomType => {
    this.setState({ pageSizeForCustomType });
  };

  render() {
    let labelStyle = { display: 'block', paddingLeft: '0px' };
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LabelField text="Default Type:" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            pageSize={this.state.pageSize}
            currentPage={2}
            onPageSizeChange={this.handlePageSizeChange}
            pageSizeOptions={[10, 30, 90]}
          />
          <br/> <br/>
          <LabelField text="Select Type:" style={labelStyle}/>
          <Paging
            type={"select"}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForSelectType}
            currentPage={this.state.curPageForSelectType}
            onPageChange={this.handlePageChangeForSelectType}
            pageSizeOptions={[10, 30, 90]}
          />
          <br/> <br/>
           <LabelField text="Simple Type: 精简分页器（配置hideConfig为['totalRecord', 'pageSize', 'gotoPage']）" style={labelStyle}/>
           <Paging
            type={"simple"}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForTextType}
            currentPage={this.state.curPageForTextType}
            onPageChange={this.handlePageChangeForTextType}
            pageSizeOptions={[10, 30, 90]}
            hideConfig={['totalRecord', 'pageSize', 'gotoPage']}
          />
          <br/> <br/>
          <LabelField text="Simple Type: 复杂分页器" style={labelStyle}/>
           <Paging
            type={"simple"}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForTextType}
            currentPage={this.state.curPageForTextType}
            onPageChange={this.handlePageChangeForTextType}
            pageSizeOptions={[10, 30, 90]}
          />
          <br/> <br/>
          <LabelField text="Custom Total Record Count" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            recordCountDisp={"100+"}
            pageSize={this.state.pageSizeForCustomType}
            splitPagination={false}
            currentPage={2}
            onPageSizeChange={this.handlePageSizeChangeForCustomType}
            pageSizeOptions={[10, 30, 90]}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PagingBasic />, mountNode);
```

### 事件处理

## en-US



```jsx
import Paging from 'eview-ui/Paging';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PagingAction extends React.Component {

  state = {
    msg: null,
    pageSize: 10,
    currentPage: 1,
    recordCount: 10000
  };

  handlePageChange = (currentPage) => {
    "use strict";
    this.setState({
      msg: "onPageChange Callback,  currentPage: " + currentPage,
      currentPage
    });
  };

  handlePageSizeChange = (pageSize) => {
    "use strict";
    this.setState({
      msg: "onPageSizeChange Callback,  pageSize: " + pageSize,
      pageSize,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Paging
            recordCount={this.state.recordCount}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
            onPageSizeChange={this.handlePageSizeChange}
            pageSizeOptions={[10, 30, 90]}
          />

          {this.state.msg &&
            <DivMessage text={this.state.msg} type="success" style={{marginTop: '10px', width: '100%'}}/>}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PagingAction />, mountNode);

```

```jsx
import Paging from 'eview-ui/Paging';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PagingAction extends React.Component {

  state = {
    msg: null,
    pageSize: 10,
    currentPage: 1,
    recordCount: 10000
  };

  handlePageChange = (currentPage) => {
    "use strict";
    this.setState({
      msg: "onPageChange Callback,  currentPage: " + currentPage,
      currentPage
    });
  };

  handlePageSizeChange = (pageSize) => {
    "use strict";
    this.setState({
      msg: "onPageSizeChange Callback,  pageSize: " + pageSize,
      pageSize,
    });
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Paging
            recordCount={this.state.recordCount}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
            onPageSizeChange={this.handlePageSizeChange}
            pageSizeOptions={[10, 30, 90]}
          />

          {this.state.msg &&
            <DivMessage text={this.state.msg} type="success" style={{marginTop: '10px', width: '100%'}}/>}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PagingAction />, mountNode);

```

### 拆分样式

## en-US



```jsx
import Paging from 'eview-ui/Paging';
import LabelField from 'eview-ui/LabelField';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PagingSplitStyle extends React.Component {

  state = {
    total: 100,
    pageSize: 10,

    curPageForSelectType: 2,
    pageSizeForSelectType: 10,

    pageSizeForCustomType: 10,

    pagingStyle: {}
  };

  handlePageSizeChange =pageSize => {
    this.setState({pageSize});
  };

  handlePageChangeForSelectType =curPageForSelectType => {
    this.setState({curPageForSelectType});
  };

  handlePageSizeChangeForCustomType =pageSizeForCustomType => {
    this.setState({pageSizeForCustomType});
  };

  handleChangeWidth = (value) => {
    this.setState({
      pagingStyle: { width: "50rem" }
    });
  };

  render() {
    let labelStyle = {display: "block", paddingLeft: "0px"};
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LabelField text="Default Type:" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            pageSize={this.state.pageSize}
            currentPage={2}
            onPageSizeChange={this.handlePageSizeChange}
            pageSizeOptions={[10, 30, 90]}
            style={this.state.pagingStyle}
            splitPagination
          />
          <br/> <br/>
          <LabelField text="Select Type:" style={labelStyle}/>
          <Paging
            type={'select'}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForSelectType}
            currentPage={this.state.curPageForSelectType}
            onPageChange={this.handlePageChangeForSelectType}
            pageSizeOptions={[10, 30, 90]}
            style={this.state.pagingStyle}
            splitPagination
          />
          <br/> <br/>
          <LabelField text="Custom Total Record Count" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            recordCountDisp={'100+'}
            pageSize={this.state.pageSizeForCustomType}
            currentPage={4}
            onPageSizeChange={this.handlePageSizeChangeForCustomType}
            pageSizeOptions={[10, 30, 90]}
            style={this.state.pagingStyle}
            splitPagination
          />

          <br/> <br/>
          <Button text="change width" onClick={this.handleChangeWidth}></Button>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PagingSplitStyle />, mountNode);

```

```jsx
import Paging from 'eview-ui/Paging';
import LabelField from 'eview-ui/LabelField';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class PagingSplitStyle extends React.Component {

  state = {
    total: 100,
    pageSize: 10,

    curPageForSelectType: 2,
    pageSizeForSelectType: 10,

    pageSizeForCustomType: 10,

    pagingStyle: {}
  };

  handlePageSizeChange =pageSize => {
    this.setState({pageSize});
  };

  handlePageChangeForSelectType =curPageForSelectType => {
    this.setState({curPageForSelectType});
  };

  handlePageSizeChangeForCustomType =pageSizeForCustomType => {
    this.setState({pageSizeForCustomType});
  };

  handleChangeWidth = (value) => {
    this.setState({
      pagingStyle: { width: "50rem" }
    });
  };

  render() {
    let labelStyle = {display: "block", paddingLeft: "0px"};
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <LabelField text="Default Type:" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            pageSize={this.state.pageSize}
            currentPage={2}
            onPageSizeChange={this.handlePageSizeChange}
            pageSizeOptions={[10, 30, 90]}
            style={this.state.pagingStyle}
            splitPagination
          />
          <br/> <br/>
          <LabelField text="Select Type:" style={labelStyle}/>
          <Paging
            type={'select'}
            recordCount={this.state.total}
            pageSize={this.state.pageSizeForSelectType}
            currentPage={this.state.curPageForSelectType}
            onPageChange={this.handlePageChangeForSelectType}
            pageSizeOptions={[10, 30, 90]}
            style={this.state.pagingStyle}
            splitPagination
          />
          <br/> <br/>
          <LabelField text="Custom Total Record Count" style={labelStyle}/>
          <Paging
            recordCount={this.state.total}
            recordCountDisp={'100+'}
            pageSize={this.state.pageSizeForCustomType}
            currentPage={4}
            onPageSizeChange={this.handlePageSizeChangeForCustomType}
            pageSizeOptions={[10, 30, 90]}
            style={this.state.pagingStyle}
            splitPagination
          />

          <br/> <br/>
          <Button text="change width" onClick={this.handleChangeWidth}></Button>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PagingSplitStyle />, mountNode);

```

