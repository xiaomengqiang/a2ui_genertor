# MessageDialogPro 新消息对话框

> 分类：反馈

信息提示框组件，七种信息提示框，`error`, `info` ,`warn`, `confirm`, `success`, `risk`, `highRisk` 根据不同场景调用不同信息提示框，并且自定制相关文本内容，标题，以及提示框位置，大小，是否模态等等。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Modal.confirm()` 等静态 | `MessageDialogPro`（**唯一——旧 MessageDialog 弃用**） | **受控形态**：`type` **必填** 7 枚举（highRisk/risk/error/info/warn/confirm/success）+ `isOpen` + **`buttons={ok: {…ButtonProps}, cancel: {…}}` 对象** + `onClose` 手动关 + `children` 优先于 `content`；**命令式**：`MessageDialogPro.confirm(config)` 等静态方法（≈ antd Modal.confirm，返回引用 `update`/`destroy`，`destroyAll()` 清场）；**函数式调用脱离 ConfigProvider context**（取不到 context/redux；3.1+ 必须传 `version`）——命令式弹窗优先受控形态；`hasChecked` 仅 risk/highRisk；`autoFocusButton` 默认 'ok'；`keepTopPosition` 尺寸变化保持顶部 |

## API

### 属性

| 属性名称           | 描述                                                                                                                                       | 输入                                                     | 默认                |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- | :------------------ |
| id                 | 设置 MessageDialogPro 的 id                                                                                                                | string                                                   |                     |
| type |  必填项，定制信息提示框的提示类型，仅有五种枚举类型可传入 <br/>例如： type='error' | enum:<br>&nbsp;'highRisk'<br>&nbsp;'risk'<br>&nbsp;'error'<br>&nbsp;'info'<br>&nbsp;'warn'<br>&nbsp;'confirm'<br>&nbsp;'success'<br> | 'info' |
| style              | 通过自定义 style 来改变组件的的整体样式                                                                                                    | CSSProperties                                            |                     |
| className          | 通过自定义 class 来改变组件的整体样式                                                                                                      | string                                                   |                     |
| maskStyle          | 通过添加 style 设置遮罩层的样式                                                                                                            | CSSProperties                                            |                     |
| contentStyle       | 通过 style 设置 content 的样式                                                                                                             | CSSProperties                                            |                     |
| size               | 宽，高，默认 auto，弹性布局，请设置为偶数，支持 rem,resize 后转为 px 单位                                                                  | [ReactText, ReactText]                                   | ['31.5rem', 'auto'] |
| title              | title 显示文本                                                                                                                             | string                                                   |                     |
| titleTip           | title 提示内容 , 默认与 title 一致                                                                                                         | string                                                   |                     |
| content            | 显示内容                                                                                                                                   | ReactNode                                                |                     |
| children           | content 显示内容 , 优先级比 content 高                                                                                                     | ReactNode                                                |                     |
| isOpen             | 是否打开                                                                                                                                   | boolean                                                  |                     |
| onClose            | 关闭事件，请在此事件中将 isOpen 设为 false                                                                                                 | (event) => void                                          |                     |
| destroyOnClose     | 关闭时是否摧毁页面                                                                                                                         | boolean                                                  | true                |
| closeOnEscape      | esc 时是否触发关闭                                                                                                                         | boolean                                                  | true                |
| autoFocusButton    | 自动聚焦在哪个按钮                                                                                                                         | string : null \| 'ok' \| 'cancel' \| 'close' \| 'detail' | 'ok'                |
| position           | 打开时初始位置，0=left ,1=top，2=right, 3=bottom不设置默认居中,top/bottom和left/right只能设置一个，另一个设为null，比如[200, 200, null, null]   | [ReactText, ReactText, ReactText, ReactText]             |                     |
| movable            | 是否可以拖拽                                                                                                                               | boolean                                                  | true                |
| customHeader       | 自定义 header ，适用于定制最小化场景                                                                                                       | ReactNode                                                |                     |
| closable           | 是否显示关闭按钮                                                                                                                           | boolean                                                  | true                |
| modal              | 是否是模态框                                                                                                                               | boolean                                                  | true                |
| buttons            | ok 按钮 和 cancel 按钮的 props ,参考 Button 的属性, 可设置 null                                                                            | null \| {ok: ButtonProps, cancel: ButtonProps}           |
| zIndex             | zIndex 值                                                                                                                                  | number                                                   |                     |
| detail             | 详情                                                                                                                                       | ReactNode                                                |                     |
| detailStyle        | 详情样式                                                                                                                                   | CSSProperties                                            |                     |
| detailMessage      | 显示详情详细信息                                                                                                                           | ReactNode                                                |
| detailMessageStyle | 显示详情详细信息样式                                                                                                                       | CSSProperties                                            |                     |
| hasChecked         | 当`type` 为 `risk` `highRisk` 时控制初始 CheckBox 勾选                                                                                     | boolean                                                  | false               |
| maxContHeight      | detailMessage 最高高度, 会进行 px 转 rem ，会被 detailMessageStyle.maxHeight 覆盖                                                          | number                                                   |                     |
| keepTopPosition    | 当弹窗尺寸发生变化时，是否保持弹窗顶部位置不变                                                          | boolean                                                   |            true         |

### 迁移

| 属性名称           | 说明                 | 类型 |
| :----------------- | :------------------- | :--- |
| detailMessageStyle | 显示详情详细信息样式 | 新增 |
| autoFocusButton    | 自动聚焦在哪个按钮   | 新增 |

## 新增：MessageDialogPro.method()

包括：

- `MessageDialogPro.success()`
- `MessageDialogPro.error()`
- `MessageDialogPro.warn()`
- `MessageDialogPro.confirm()`
- `MessageDialogPro.info()`
- `MessageDialogPro.risk()`
- `MessageDialogPro.highRisk()`

以上均为一个函数，参数为 object，具体属性如下：

| 属性名称               | 描述                                                                                                            | 输入                                                       | 默认                  |
|:-------------------|:--------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------|:--------------------|
| id                 | 设置 MessageDialogPro 的 id                                                                                      | string                                                   |                     |
| version            | 组件AUI规范配置 aui3-1，3.1及以上必传参数，否则会出现样式不生效的情况(函数脱离ConfigProvider的context)                                         | string                                                   | aui2                |
| style              | 通过自定义 style 来改变组件的的整体样式                                                                                       | CSSProperties                                            |                     |
| className          | 通过自定义 class 来改变组件的整体样式                                                                                        | string                                                   |                     |
| maskStyle          | 通过添加 style 设置遮罩层的样式                                                                                           | CSSProperties                                            |                     |
| contentStyle       | 通过 style 设置 content 的样式                                                                                       | CSSProperties                                            |                     |
| size               | 宽，高，默认 auto，弹性布局，请设置为偶数，支持 rem,resize 后转为 px 单位                                                               | [ReactText, ReactText]                                   | ['31.5rem', 'auto'] |
| minSize            | 最小宽高，默认 504, 400，                                                                                             | 请设置为偶数                                                   |
| title              | title 显示文本                                                                                                    | string                                                   |                     |
| titleTip           | title 提示内容，默认与 title 一致                                                                                       | string                                                   |                     |
| content            | 显示内容                                                                                                          | ReactNode                                                |                     |
| children           | content 显示内容 ,优先级比 content 高                                                                                  | ReactNode                                                |                     |
| closeOnEscape      | esc 时是否触发关闭                                                                                                   | boolean                                                  | true                |
| afterClose         | 消息对话框关闭后回调                                                                                                    | function                                                 | () => void          |
| autoFocusButton    | 自动聚焦在哪个按钮                                                                                                     | string : null \| 'ok' \| 'cancel' \| 'close' \| 'detail' | 'ok'                |
| position           | 打开时初始位置，0=left ,1=top，2=right, 3=bottom不设置默认居中,top/bottom和left/right只能设置一个，另一个设为null，比如[200, 200, null, null] | [ReactText, ReactText, ReactText, ReactText]             |                     |
| movable            | 是否可以拖拽                                                                                                        | boolean                                                  | true                |
| customHeader       | 自定义 header                                                                                                    | ReactNode                                                |                     |
| closable           | 是否显示关闭按钮                                                                                                      | boolean                                                  | true                |
| zIndex             | zIndex 值                                                                                                      | number                                                   |                     |
| modal              | 是否是模态框                                                                                                        | boolean                                                  | true                |
| buttons            | ok 按钮 和 cancel 按钮的 props , 参考 Button 的属性 , 可设置 null                                                           | null \| {ok: ButtonProps, cancel: ButtonProps}           |
| detail             | 详情                                                                                                            | ReactNode                                                |                     |
| detailStyle        | 详情样式                                                                                                          | CSSProperties                                            |                     |
| detailMessage      | 显示详情详细信息                                                                                                      | ReactNode                                                |
| detailMessageStyle | 显示详情详细信息样式                                                                                                    | CSSProperties                                            |                     |
| hasChecked         | 当`type` 为 `risk` `highRisk` 时控制初始 CheckBox 勾选                                                                 | boolean                                                  | false               |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

```js
const dialog = MessageDialogPro.info();

// 更新弹窗
dialog.update({
  title: '修改的标题',
  content: '修改的内容',
});

// 可以通过传入函数的方式更新弹窗
dialog.update(prevConfig => ({
  ...prevConfig,
  title: `${prevConfig.title}（新）`,
}));

// 关闭弹窗
dialog.destroy();
```

- MessageDialogPro.destroyAll

使用 `MessageDialogPro.destroyAll()` 可以销毁所有弹出的对话框（即上述的 `MessageDialogPro.info` `MessageDialogPro.success` `MessageDialogPro.error` `MessageDialogPro.warn` `MessageDialogPro.confirm` `MessageDialogPro.risk` `MessageDialogPro.highRisk` ）。

`MessageDialogPro.destroyAll()` 通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题，而不用各处去使用实例的返回值进行关闭。（`dialog.destroy()` 适用于主动关闭，而不是路由这样被动关闭）

例如 react-router 中的 router change

```js
import { browserHistory } from 'react-router';

browserHistory.listen(() => {
  MessageDialogPro.destroyAll();
});
```

注意 ：直接调用 MessageDialogPro 函数是通过 ReactDOM.render ，创建了新 React 实体。其 context 与当前代码所在 context 并不相同。所以不能获取 context、redux 的内容

## 使用示例

### 基本属性设置

## en-US

```jsx
import MessageDialog from 'eview-ui/MessageDialogPro';
import Button from 'eview-ui/Button';
import Table from 'eview-ui/Table';
import img1 from '@images/table_1';
import img2 from '@images/table_2';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
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
        <img src={img1} style={{ verticalAlign: 'bottom' }} alt="TO BE" /> TO BE
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'Shop Storage',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo ',
    ]);
    rows.push([
      'IT Link',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '7',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
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
            ref={c => {
              this.scrollWrapper = c;
            }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

export default class MessageDialogProSimpleExample extends React.Component {
  handleClickSuccess = () => {
    this.setState({ successOpen: true });
  };

  handleClickError = () => {
    this.setState({ errorOpen: true });
  };

  handleClickWarn = () => {
    this.setState({ warnOpen: true });
  };

  handleClickConfirm = () => {
    this.setState({ confirmOpen: true });
  };

  handleClickRisk = () => {
    this.setState({ riskOpen: true });
  };

  handleClickHighRisk = () => {
    this.setState({ highRiskOpen: true });
  };

  handleClickInfo = () => {
    this.setState({ infoOpen: true });
  };

  handleClickDetail = () => {
    this.setState({ isdetailOpen: true });
  };
  handleCustomClickInfo = () => {
    this.setState({ infoCustomOpen: true });
  };
  handleCustomDetailClick = () => {
    this.setState({ customDetailOpen: true });
  };

  state = {
    successOpen: false,
    errorOpen: false,
    confirmOpen: false,
    warnOpen: false,
    riskOpen: false,
    highRiskOpen: false,
    infoOpen: false,
    isdetailOpen: false,
    infoCustomOpen: false,
    customDetailOpen: false,
  };
  closeSuccessPanel = () => {
    this.setState({ successOpen: false });
  };

  closeErrorPanel = () => {
    this.setState({ errorOpen: false });
  };

  closeWarnPanel = () => {
    this.setState({ warnOpen: false });
  };

  closeConfirmPanel = () => {
    this.setState({ confirmOpen: false });
  };

  closeRiskPanel = () => {
    this.setState({ riskOpen: false });
  };

  closeHighRiskPanel = () => {
    this.setState({ highRiskOpen: false });
  };

  cancelConfirmPanel = () => {
    this.setState({ confirmOpen: false });
  };

  closeInfoPanel = () => {
    this.setState({ infoOpen: false });
  };

  closeDetailPanel = () => {
    this.setState({ isdetailOpen: false });
  };

  cancelDetailPanel = () => {
    this.setState({ isdetailOpen: false });
  };

  closeCustomInfoPanel = () => {
    this.setState({ infoCustomOpen: false });
  };

  closeCustomDetailPanel = () => {
    this.setState({ customDetailOpen: false });
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: '15px'}}>
          <div style={{padding: 5}}>
            <Button text="Success Dialog" onClick={this.handleClickSuccess}/>
            <MessageDialog
              type="success"
              isOpen={this.state.successOpen}
              onClose={this.closeSuccessPanel}
              modal={false}
              content="Request success"
              detail="Request success"
              buttons={{ok: {onClick: this.closeSuccessPanel}}}
            />
          </div>
          <div style={{padding: 5}}>
            <Button text="Error Dialog" onClick={this.handleClickError}/>
            <MessageDialog
              type="error"
              isOpen={this.state.errorOpen}
              onClose={this.closeErrorPanel}
              modal={false}
              content="Request Failed！"
              detail="Request data is Non-existent"
              buttons={{ok: {onClick: this.closeErrorPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Warning Dialog" onClick={this.handleClickWarn}/>
            <MessageDialog
              type="warn"
              isOpen={this.state.warnOpen}
              onClose={this.closeWarnPanel}
              modal={false}
              content="request exception！"
              detail="Request data exception"
              buttons={{ok: {onClick: this.closeWarnPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Confirm Dialog" onClick={this.handleClickConfirm}/>
            <MessageDialog
              type="confirm"
              onClose={this.closeConfirmPanel}
              isOpen={this.state.confirmOpen}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{ok: {onClick: this.closeConfirmPanel}, cancel: {onClick: this.closeConfirmPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Risk Dialog" onClick={this.handleClickRisk}/>
            <MessageDialog
              type="risk"
              onClose={this.closeRiskPanel}
              isOpen={this.state.riskOpen}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{ok: {onClick: this.closeRiskPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="High Risk Dialog" onClick={this.handleClickHighRisk}/>
            <MessageDialog
              type="highRisk"
              onClose={this.closeHighRiskPanel}
              isOpen={this.state.highRiskOpen}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{ok: {onClick: this.closeHighRiskPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Information Dialog, at Bottom right" onClick={this.handleClickInfo}/>
            <MessageDialog
              onClose={this.closeInfoPanel}
              isOpen={this.state.infoOpen}
              position={[null, null, 0, 0]}
              modal={false}
              content="Data deleted"
              detail="You deleted data"
              buttons={{ok: {onClick: this.closeInfoPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Detail Dialog, Focus on Cancel" onClick={this.handleClickDetail}/>
            <MessageDialog
              size={[700, 'auto']}
              maxContHeight={350}
              type="confirm"
              onClose={this.closeDetailPanel}
              isOpen={this.state.isdetailOpen}
              modal={true}
              content="VPN Data: "
              detail="Table Info "
              autoFocusButton="cancel"
              detailMessage={<TableDemo/>}
              buttons={{
                ok: {onClick: this.closeDetailPanel},
                cancel: {onClick: this.closeDetailPanel},
              }}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Custom Size Dialog with Custom button , Focus on Close" onClick={this.handleCustomClickInfo}/>
            <MessageDialog
              onClose={this.closeCustomInfoPanel}
              isOpen={this.state.infoCustomOpen}
              modal={false}
              size={[200, 'auto']}
              autoFocusButton="close"
              content="Data deleted"
              detail="You deleted data"
              buttons={{ok: {text: 'I am big button', onClick: this.closeCustomInfoPanel, style: {width: 200}}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Custom detail style" onClick={this.handleCustomDetailClick}/>
            <MessageDialog
              onClose={this.closeCustomDetailPanel}
              isOpen={this.state.customDetailOpen}
              modal={false}
              detail="File Name: aaaaaabbbbbcccccceeeeeefffff.dat File path = F:\eView\react\git\docs\src\components\pages\Rating"
              detailStyle={{textAlign: 'left', wordBreak: 'break-all'}}
              buttons={{ok: {text: 'Confirm', onClick: this.closeCustomDetailPanel, style: {width: 150}}}}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<MessageDialogProSimpleExample />, mountNode);
```

```jsx
import MessageDialog from 'eview-ui/MessageDialogPro';
import Button from 'eview-ui/Button';
import Table from 'eview-ui/Table';
import img1 from '@images/table_1';
import img2 from '@images/table_2';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TableDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
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
        <img src={img1} style={{ verticalAlign: 'bottom' }} alt="TO BE" /> TO BE
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'Shop Storage',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo ',
    ]);
    rows.push([
      'IT Link',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '7',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);
    rows.push([
      'R&D VPN1',
      <div>
        <img src={img2} style={{ verticalAlign: 'bottom' }} alt="Active" /> Active
      </div>,
      '3',
      'ICMP Echo',
    ]);

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
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
            ref={c => {
              this.scrollWrapper = c;
            }}
          />
        </div>
      </ConfigProvider>
    );
  }
}

export default class MessageDialogProSimpleExample extends React.Component {
  handleClickSuccess = () => {
    this.setState({ successOpen: true });
  };

  handleClickError = () => {
    this.setState({ errorOpen: true });
  };

  handleClickWarn = () => {
    this.setState({ warnOpen: true });
  };

  handleClickConfirm = () => {
    this.setState({ confirmOpen: true });
  };

  handleClickRisk = () => {
    this.setState({ riskOpen: true });
  };

  handleClickHighRisk = () => {
    this.setState({ highRiskOpen: true });
  };

  handleClickInfo = () => {
    this.setState({ infoOpen: true });
  };

  handleClickDetail = () => {
    this.setState({ isdetailOpen: true });
  };
  handleCustomClickInfo = () => {
    this.setState({ infoCustomOpen: true });
  };
  handleCustomDetailClick = () => {
    this.setState({ customDetailOpen: true });
  };

  state = {
    successOpen: false,
    errorOpen: false,
    confirmOpen: false,
    warnOpen: false,
    riskOpen: false,
    highRiskOpen: false,
    infoOpen: false,
    isdetailOpen: false,
    infoCustomOpen: false,
    customDetailOpen: false,
  };
  closeSuccessPanel = () => {
    this.setState({ successOpen: false });
  };

  closeErrorPanel = () => {
    this.setState({ errorOpen: false });
  };

  closeWarnPanel = () => {
    this.setState({ warnOpen: false });
  };

  closeConfirmPanel = () => {
    this.setState({ confirmOpen: false });
  };

  closeRiskPanel = () => {
    this.setState({ riskOpen: false });
  };

  closeHighRiskPanel = () => {
    this.setState({ highRiskOpen: false });
  };

  cancelConfirmPanel = () => {
    this.setState({ confirmOpen: false });
  };

  closeInfoPanel = () => {
    this.setState({ infoOpen: false });
  };

  closeDetailPanel = () => {
    this.setState({ isdetailOpen: false });
  };

  cancelDetailPanel = () => {
    this.setState({ isdetailOpen: false });
  };

  closeCustomInfoPanel = () => {
    this.setState({ infoCustomOpen: false });
  };

  closeCustomDetailPanel = () => {
    this.setState({ customDetailOpen: false });
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: '15px'}}>
          <div style={{padding: 5}}>
            <Button text="Success Dialog" onClick={this.handleClickSuccess}/>
            <MessageDialog
              type="success"
              isOpen={this.state.successOpen}
              onClose={this.closeSuccessPanel}
              modal={false}
              content="Request success"
              detail="Request success"
              buttons={{ok: {onClick: this.closeSuccessPanel}}}
            />
          </div>
          <div style={{padding: 5}}>
            <Button text="Error Dialog" onClick={this.handleClickError}/>
            <MessageDialog
              type="error"
              isOpen={this.state.errorOpen}
              onClose={this.closeErrorPanel}
              modal={false}
              content="Request Failed！"
              detail="Request data is Non-existent"
              buttons={{ok: {onClick: this.closeErrorPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Warning Dialog" onClick={this.handleClickWarn}/>
            <MessageDialog
              type="warn"
              isOpen={this.state.warnOpen}
              onClose={this.closeWarnPanel}
              modal={false}
              content="request exception！"
              detail="Request data exception"
              buttons={{ok: {onClick: this.closeWarnPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Confirm Dialog" onClick={this.handleClickConfirm}/>
            <MessageDialog
              type="confirm"
              onClose={this.closeConfirmPanel}
              isOpen={this.state.confirmOpen}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{ok: {onClick: this.closeConfirmPanel}, cancel: {onClick: this.closeConfirmPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Risk Dialog" onClick={this.handleClickRisk}/>
            <MessageDialog
              type="risk"
              onClose={this.closeRiskPanel}
              isOpen={this.state.riskOpen}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{ok: {onClick: this.closeRiskPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="High Risk Dialog" onClick={this.handleClickHighRisk}/>
            <MessageDialog
              type="highRisk"
              onClose={this.closeHighRiskPanel}
              isOpen={this.state.highRiskOpen}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{ok: {onClick: this.closeHighRiskPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Information Dialog, at Bottom right" onClick={this.handleClickInfo}/>
            <MessageDialog
              onClose={this.closeInfoPanel}
              isOpen={this.state.infoOpen}
              position={[null, null, 0, 0]}
              modal={false}
              content="Data deleted"
              detail="You deleted data"
              buttons={{ok: {onClick: this.closeInfoPanel}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Detail Dialog, Focus on Cancel" onClick={this.handleClickDetail}/>
            <MessageDialog
              size={[700, 'auto']}
              maxContHeight={350}
              type="confirm"
              onClose={this.closeDetailPanel}
              isOpen={this.state.isdetailOpen}
              modal={true}
              content="VPN Data: "
              detail="Table Info "
              autoFocusButton="cancel"
              detailMessage={<TableDemo/>}
              buttons={{
                ok: {onClick: this.closeDetailPanel},
                cancel: {onClick: this.closeDetailPanel},
              }}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Custom Size Dialog with Custom button , Focus on Close" onClick={this.handleCustomClickInfo}/>
            <MessageDialog
              onClose={this.closeCustomInfoPanel}
              isOpen={this.state.infoCustomOpen}
              modal={false}
              size={[200, 'auto']}
              autoFocusButton="close"
              content="Data deleted"
              detail="You deleted data"
              buttons={{ok: {text: 'I am big button', onClick: this.closeCustomInfoPanel, style: {width: 200}}}}
            />
          </div>

          <div style={{padding: 5}}>
            <Button text="Custom detail style" onClick={this.handleCustomDetailClick}/>
            <MessageDialog
              onClose={this.closeCustomDetailPanel}
              isOpen={this.state.customDetailOpen}
              modal={false}
              detail="File Name: aaaaaabbbbbcccccceeeeeefffff.dat File path = F:\eView\react\git\docs\src\components\pages\Rating"
              detailStyle={{textAlign: 'left', wordBreak: 'break-all'}}
              buttons={{ok: {text: 'Confirm', onClick: this.closeCustomDetailPanel, style: {width: 150}}}}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<MessageDialogProSimpleExample />, mountNode);
```

### 函数调用

## en-US

```jsx
import MessageDialog from 'eview-ui/MessageDialogPro';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const MessageDialogProDemo2 = () => {
  React.useEffect(()=>{
    return () => {
      MessageDialog.destroyAll();
    }
  })

  const [version, theme] = getDemoVersion();

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div>
        <Button
          text="Open a success dialog, auto close after 2000ms"
          onClick={() => {
            const dialog = MessageDialog.success({
              version: version,
              content: 'success',
              detail: 'success detail',
              modal: false,
              afterClose: () => {
                console.log('afterClose');
              },
            });
            setTimeout(() => {
              dialog.destroy();
            }, 2000);
          }}
        />
        <br/>
        <br/>
        <Button
          text="Open a success dialog, update config"
          onClick={() => {
            const dialog = MessageDialog.success({
              version: version,
              content: 'success',
              modal: false,
              buttons: {
                ok: {
                  text: 'click me to update',
                  onClick: () => {
                    dialog.update({content: 'new content', detail: 'new detail'});
                  },
                },
              },
            });
          }}
        ></Button>
        <br/>
        <br/>
        <Button onClick={() => MessageDialog.destroyAll()} text="destroyAll"/>
      </div>
    </ConfigProvider>
  );
};

ReactDOM.render(<MessageDialogProDemo2 />, mountNode);
```

```jsx
import MessageDialog from 'eview-ui/MessageDialogPro';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const MessageDialogProDemo2 = () => {
  React.useEffect(()=>{
    return () => {
      MessageDialog.destroyAll();
    }
  })

  const [version, theme] = getDemoVersion();

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div>
        <Button
          text="Open a success dialog, auto close after 2000ms"
          onClick={() => {
            const dialog = MessageDialog.success({
              version: version,
              content: 'success',
              detail: 'success detail',
              modal: false,
              afterClose: () => {
                console.log('afterClose');
              },
            });
            setTimeout(() => {
              dialog.destroy();
            }, 2000);
          }}
        />
        <br/>
        <br/>
        <Button
          text="Open a success dialog, update config"
          onClick={() => {
            const dialog = MessageDialog.success({
              version: version,
              content: 'success',
              modal: false,
              buttons: {
                ok: {
                  text: 'click me to update',
                  onClick: () => {
                    dialog.update({content: 'new content', detail: 'new detail'});
                  },
                },
              },
            });
          }}
        ></Button>
        <br/>
        <br/>
        <Button onClick={() => MessageDialog.destroyAll()} text="destroyAll"/>
      </div>
    </ConfigProvider>
  );
};

ReactDOM.render(<MessageDialogProDemo2 />, mountNode);
```

