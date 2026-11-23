# MessageDialogPro 新消息对话框

> 分类：反馈

信息提示框组件，七种信息提示框，`error`, `info`, `warn`, `confirm`, `success`, `risk`, `highRisk` 根据不同场景调用不同信息提示框，并且自定制相关文本内容，标题，以及提示框位置，大小，是否模态等等。

**重要行为说明：**

- `type` 实际上有**七种**枚举类型（文档写"五种"有误）
- `children` 优先级高于 `content`；都不传则显示空内容
- `size` 会被组件内部覆盖——宽度强制为 aui3-1 时 `28.25rem`、其他版本 `31.5rem`；高度由 `size[1]` 控制
- `movable` 被强制设为 `true`；`resizable` 被强制设为 `false`（用户传入无效）
- `type` 为 `risk` 或 `highRisk` 时，确认按钮默认禁用，需勾选 Checkbox 才可点击
- `hasChecked` 仅在 `type` 为 `risk`/`highRisk` 时生效

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法                | eview 写法                                            | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Modal.confirm()` 等静态 | `MessageDialogPro`（**唯一——旧 MessageDialog 弃用**） | **受控形态**：`type` **必填** 7 枚举（highRisk/risk/error/info/warn/confirm/success）+ `isOpen` + **`buttons={ok: {…ButtonProps}, cancel: {…}}` 对象** + `onClose` 手动关 + `children` 优先于 `content`；**命令式**：`MessageDialogPro.confirm(config)` 等静态方法（≈ antd Modal.confirm，返回引用 `update`/`destroy`，`destroyAll()` 清场）；**函数式调用脱离 ConfigProvider context**（取不到 context/redux；3.1+ 必须传 `version`）——命令式弹窗优先受控形态；`hasChecked` 仅 risk/highRisk；`autoFocusButton` 默认 'ok'；`keepTopPosition` 尺寸变化保持顶部 |

## API

### 属性

| 属性名称           | 描述                                                                                                                                             | 输入                                                                                                                             | 默认                |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| id                 | 设置 MessageDialogPro 的 id                                                                                                                      | string                                                                                                                           |                     |
| type               | 定制信息提示框的提示类型，共七种枚举类型。例如：`type='error'`                                                                                   | enum:<br>&nbsp;'highRisk'<br>&nbsp;'risk'<br>&nbsp;'error'<br>&nbsp;'info'<br>&nbsp;'warn'<br>&nbsp;'confirm'<br>&nbsp;'success' | 'info'              |
| style              | 通过自定义 style 来改变组件的整体样式                                                                                                            | CSSProperties                                                                                                                    |                     |
| className          | 通过自定义 class 来改变组件的整体样式                                                                                                            | string                                                                                                                           |                     |
| maskStyle          | 通过添加 style 设置遮罩层的样式                                                                                                                  | CSSProperties                                                                                                                    |                     |
| contentStyle       | 通过 style 设置 content 区域的样式（组件内部会合并 `{padding:0, position:'relative', height:'auto'}`）                                           | CSSProperties                                                                                                                    |                     |
| size               | 宽，高。**注意：宽度会被组件内部覆盖**（aui3-1 为 28.25rem，其他为 31.5rem），高度支持 'auto' 或具体值                                           | [ReactText, ReactText]                                                                                                           | ['31.5rem', 'auto'] |
| minSize            | 最小宽高                                                                                                                                         | [number, number]                                                                                                                 |                     |
| title              | title 显示文本，不传则根据 type 自动生成国际化标题                                                                                               | string                                                                                                                           |                     |
| titleTip           | title 提示内容，默认与 title 一致                                                                                                                | string                                                                                                                           |                     |
| content            | 显示内容，优先级低于 children                                                                                                                    | ReactNode                                                                                                                        | ''                  |
| children           | 显示内容，优先级高于 content                                                                                                                     | ReactNode                                                                                                                        | ''                  |
| isOpen             | 是否打开                                                                                                                                         | boolean                                                                                                                          |                     |
| onClose            | 关闭事件，请在此事件中将 isOpen 设为 false                                                                                                       | (event) => void                                                                                                                  |                     |
| destroyOnClose     | 关闭时是否销毁子组件                                                                                                                             | boolean                                                                                                                          | true                |
| closeOnEscape      | esc 时是否触发关闭                                                                                                                               | boolean                                                                                                                          | true                |
| autoFocusButton    | 自动聚焦在哪个按钮                                                                                                                               | null \| 'ok' \| 'cancel' \| 'close' \| 'detail'                                                                                  | 'ok'                |
| position           | 打开时初始位置，[left, top, right, bottom]，不设置默认居中。top/bottom 和 left/right 只能设置一个，另一个设为 null，比如 [200, null, null, null] | [ReactText, ReactText, ReactText, ReactText]                                                                                     |                     |
| movable            | 是否可以拖拽（**内部强制为 true，传入无效**）                                                                                                    | boolean                                                                                                                          | true                |
| customHeader       | 自定义 header，适用于定制最小化场景                                                                                                              | ReactNode                                                                                                                        |                     |
| closable           | 是否显示关闭按钮                                                                                                                                 | boolean                                                                                                                          | true                |
| modal              | 是否是模态框                                                                                                                                     | boolean                                                                                                                          | true                |
| buttons            | ok 和 cancel 按钮的 props（参考 ButtonAdapter 属性），可设置 null 隐藏按钮区域                                                                   | null \| {ok: ButtonAdapterProps, cancel: ButtonAdapterProps}                                                                     | {}                  |
| zIndex             | zIndex 值                                                                                                                                        | number                                                                                                                           | 100000              |
| detail             | 详情文字。type 为 risk/highRisk 时会同时显示 Checkbox                                                                                            | ReactNode                                                                                                                        | ''                  |
| detailStyle        | 详情区域样式                                                                                                                                     | CSSProperties                                                                                                                    | {}                  |
| detailMessage      | 显示详情详细信息（点击"查看详情"展开/收起）                                                                                                      | ReactNode                                                                                                                        | ''                  |
| detailMessageStyle | 显示详情详细信息样式，其中 maxHeight 会覆盖 maxContHeight 的效果                                                                                 | CSSProperties                                                                                                                    | {}                  |
| hasChecked         | 当 type 为 risk/highRisk 时控制初始 CheckBox 勾选状态                                                                                            | boolean                                                                                                                          | false               |
| maxContHeight      | detailMessage 最高高度（px），会被 detailMessageStyle.maxHeight 覆盖                                                                             | number                                                                                                                           | 600 (37.5rem)       |
| keepTopPosition    | 当弹窗尺寸发生变化时，是否保持弹窗顶部位置不变                                                                                                   | boolean                                                                                                                          | true                |
| version            | 传入该值可定制当前组件匹配的ucd规范，不传则从 ConfigProvider context 获取                                                                        | string                                                                                                                           |                     |
| theme              | 传入该值可定制当前组件匹配的主题模式样式，不传则从 ConfigProvider context 获取                                                                   | string                                                                                                                           |                     |
| isNeedFocusOnOpen  | 打开时是否聚焦弹窗，设为 false 则 autoFocusButton 和 focusOnClose 均不生效                                                                       | boolean                                                                                                                          | true                |

## MessageDialogPro.method()

包括：

- `MessageDialogPro.success()`
- `MessageDialogPro.error()`
- `MessageDialogPro.warn()`
- `MessageDialogPro.warning()`（warn 的别名）
- `MessageDialogPro.confirm()`
- `MessageDialogPro.info()`
- `MessageDialogPro.risk()`
- `MessageDialogPro.highRisk()`

以上均为一个函数，参数为 object，具体属性如下：

| 属性名称           | 描述                                                                                                 | 输入                                                         | 默认                |
| :----------------- | :--------------------------------------------------------------------------------------------------- | :----------------------------------------------------------- | :------------------ |
| id                 | 设置 MessageDialogPro 的 id                                                                          | string                                                       |                     |
| version            | 组件AUI规范配置。**3.1 及以上必传参数**，函数式调用脱离 ConfigProvider context，不传则样式可能不生效 | string                                                       | aui2                |
| style              | 通过自定义 style 来改变组件的整体样式                                                                | CSSProperties                                                |                     |
| className          | 通过自定义 class 来改变组件的整体样式                                                                | string                                                       |                     |
| maskStyle          | 通过添加 style 设置遮罩层的样式                                                                      | CSSProperties                                                |                     |
| contentStyle       | 通过 style 设置 content 的样式                                                                       | CSSProperties                                                |                     |
| size               | 宽，高，默认 auto，弹性布局，请设置为偶数，支持 rem                                                  | [ReactText, ReactText]                                       | ['31.5rem', 'auto'] |
| minSize            | 最小宽高                                                                                             | [number, number]                                             |                     |
| title              | title 显示文本                                                                                       | string                                                       |                     |
| titleTip           | title 提示内容，默认与 title 一致                                                                    | string                                                       |                     |
| content            | 显示内容，优先级低于 children                                                                        | ReactNode                                                    |                     |
| children           | 显示内容，优先级高于 content                                                                         | ReactNode                                                    |                     |
| closeOnEscape      | esc 时是否触发关闭                                                                                   | boolean                                                      | true                |
| afterClose         | 消息对话框完全关闭后的回调（在 DOM 销毁之后触发）                                                    | () => void                                                   |                     |
| autoFocusButton    | 自动聚焦在哪个按钮                                                                                   | null \| 'ok' \| 'cancel' \| 'close' \| 'detail'              | 'ok'                |
| position           | 打开时初始位置                                                                                       | [ReactText, ReactText, ReactText, ReactText]                 |                     |
| movable            | 是否可以拖拽                                                                                         | boolean                                                      | true                |
| customHeader       | 自定义 header                                                                                        | ReactNode                                                    |                     |
| closable           | 是否显示关闭按钮                                                                                     | boolean                                                      | true                |
| zIndex             | zIndex 值                                                                                            | number                                                       |                     |
| modal              | 是否是模态框                                                                                         | boolean                                                      | true                |
| buttons            | ok 和 cancel 按钮的 props，可设置 null                                                               | null \| {ok: ButtonAdapterProps, cancel: ButtonAdapterProps} |                     |
| detail             | 详情                                                                                                 | ReactNode                                                    |                     |
| detailStyle        | 详情样式                                                                                             | CSSProperties                                                |                     |
| detailMessage      | 显示详情详细信息                                                                                     | ReactNode                                                    |                     |
| detailMessageStyle | 显示详情详细信息样式                                                                                 | CSSProperties                                                |                     |
| hasChecked         | 当 type 为 risk/highRisk 时控制初始 CheckBox 勾选                                                    | boolean                                                      | false               |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

```js
const dialog = MessageDialogPro.info();

// 更新弹窗（传入对象）
dialog.update({
  title: "修改的标题",
  content: "修改的内容",
});

// 可以通过传入函数的方式更新弹窗
dialog.update((prevConfig) => ({
  ...prevConfig,
  title: `${prevConfig.title}（新）`,
}));

// 关闭弹窗
dialog.destroy();
```

### MessageDialogPro.destroyAll

使用 `MessageDialogPro.destroyAll()` 可以销毁所有通过函数式调用弹出的对话框。

`MessageDialogPro.destroyAll()` 通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题。

```js
import { browserHistory } from "react-router";

browserHistory.listen(() => {
  MessageDialogPro.destroyAll();
});
```

**注意：** 直接调用 MessageDialogPro 函数式方法是通过 `ReactDOM.render` 创建新 React 实体，其 context 与当前代码所在 context 并不相同，所以不能获取 context、redux 的内容。3.1+ 必须显式传 `version` 参数。

## 接口定义

```typescript
type MessageType =
  | "error"
  | "success"
  | "info"
  | "warn"
  | "confirm"
  | "risk"
  | "highRisk";

type ButtonProps = {
  ok?: ButtonAdapterProps;
  cancel?: ButtonAdapterProps;
} | null;

interface MessageDialogProps {
  /**
   * 消息框类型
   */
  type?: MessageType;

  /**
   * 消息框 button 属性
   */
  buttons?: ButtonProps;

  /**
   * 内容，优先级比 content 高
   */
  children?: ReactNode;

  /**
   * 内容，优先级比 children 低
   */
  content?: ReactNode;

  /**
   * 内容样式
   */
  contentStyle?: CSSProperties;

  /**
   * 自动聚焦按钮
   * @default 'ok'
   */
  autoFocusButton?: null | "ok" | "cancel" | "close";

  prefixCls?: string;

  /**
   * 版本设置
   */
  version?: string;

  /**
   * 主题设置
   */
  theme?: string;

  // 以下继承自 DialogProps (通过 ...rest 透传)

  id?: string;
  className?: string;
  style?: CSSProperties;
  maskStyle?: CSSProperties;
  size?: [ReactText, ReactText];
  minSize?: [number, number];
  title?: string;
  titleTip?: string;
  isOpen?: boolean;
  onClose?: (event: any) => void;
  destroyOnClose?: boolean;
  closeOnEscape?: boolean;
  position?: [ReactText, ReactText, ReactText, ReactText];
  customHeader?: ReactNode;
  closable?: boolean;
  movable?: boolean;
  modal?: boolean;
  zIndex?: number;
  keepTopPosition?: boolean;
}

interface MessageDialogProProps extends Omit<
  MessageDialogProps,
  "content" | "children" | "autoFocusButton"
> {
  /**
   * 自动聚焦按钮（扩展支持 'detail'）
   * @default 'ok'
   */
  autoFocusButton?: null | "ok" | "cancel" | "close" | "detail";

  /**
   * content 内容，优先级比 content 高
   */
  children?: ReactNode;

  /**
   * 内容，优先级比 children 低
   */
  content?: ReactNode;

  /**
   * 详情文字。type 为 risk/highRisk 时会同时显示 Checkbox
   * @default ''
   */
  detail?: ReactNode;

  /**
   * 详情区域样式
   * @default {}
   */
  detailStyle?: CSSProperties;

  /**
   * 详情详细信息（点击"查看详情"展开/收起）
   * @default ''
   */
  detailMessage?: ReactNode;

  /**
   * 详情详细信息样式，其中 maxHeight 会覆盖 maxContHeight
   * @default {}
   */
  detailMessageStyle?: CSSProperties;

  /**
   * 当 type 为 risk/highRisk 时初始 CheckBox 勾选状态
   * @default false
   */
  hasChecked?: boolean;

  /**
   * detailMessage 最高高度（px），会被 detailMessageStyle.maxHeight 覆盖
   */
  maxContHeight?: number;

  /**
   * 版本设置
   */
  version?: string;

  /**
   * 主题设置
   */
  theme?: string;
}
```

## 使用示例

### 基本属性设置



```jsx
import MessageDialogPro from "eview-ui/MessageDialogPro";
import Button from "eview-ui/Button";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

export default class MessageDialogProSimpleExample extends React.Component {
  state = {
    successOpen: false,
    errorOpen: false,
    warnOpen: false,
    confirmOpen: false,
    riskOpen: false,
    highRiskOpen: false,
    infoOpen: false,
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
  closeInfoPanel = () => {
    this.setState({ infoOpen: false });
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ marginLeft: "15px" }}>
          <div style={{ padding: 5 }}>
            <Button
              text="Success Dialog"
              onClick={() => this.setState({ successOpen: true })}
            />
            <MessageDialogPro
              type="success"
              isOpen={this.state.successOpen}
              onClose={this.closeSuccessPanel}
              modal={false}
              content="Request success"
              detail="Request success"
              buttons={{ ok: { onClick: this.closeSuccessPanel } }}
            />
          </div>
          <div style={{ padding: 5 }}>
            <Button
              text="Error Dialog"
              onClick={() => this.setState({ errorOpen: true })}
            />
            <MessageDialogPro
              type="error"
              isOpen={this.state.errorOpen}
              onClose={this.closeErrorPanel}
              modal={false}
              content="Request Failed!"
              detail="Request data is Non-existent"
              buttons={{ ok: { onClick: this.closeErrorPanel } }}
            />
          </div>
          <div style={{ padding: 5 }}>
            <Button
              text="Warning Dialog"
              onClick={() => this.setState({ warnOpen: true })}
            />
            <MessageDialogPro
              type="warn"
              isOpen={this.state.warnOpen}
              onClose={this.closeWarnPanel}
              modal={false}
              content="Request exception!"
              detail="Request data exception"
              buttons={{ ok: { onClick: this.closeWarnPanel } }}
            />
          </div>
          <div style={{ padding: 5 }}>
            <Button
              text="Confirm Dialog"
              onClick={() => this.setState({ confirmOpen: true })}
            />
            <MessageDialogPro
              type="confirm"
              isOpen={this.state.confirmOpen}
              onClose={this.closeConfirmPanel}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{
                ok: { onClick: this.closeConfirmPanel },
                cancel: { onClick: this.closeConfirmPanel },
              }}
            />
          </div>
          <div style={{ padding: 5 }}>
            <Button
              text="Risk Dialog"
              onClick={() => this.setState({ riskOpen: true })}
            />
            <MessageDialogPro
              type="risk"
              isOpen={this.state.riskOpen}
              onClose={this.closeRiskPanel}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              hasChecked={true}
              buttons={{ ok: { onClick: this.closeRiskPanel } }}
            />
          </div>
          <div style={{ padding: 5 }}>
            <Button
              text="High Risk Dialog"
              onClick={() => this.setState({ highRiskOpen: true })}
            />
            <MessageDialogPro
              type="highRisk"
              isOpen={this.state.highRiskOpen}
              onClose={this.closeHighRiskPanel}
              modal={true}
              content="Delete data ?"
              detail="You will delete data"
              buttons={{ ok: { onClick: this.closeHighRiskPanel } }}
            />
          </div>
          <div style={{ padding: 5 }}>
            <Button
              text="Info Dialog (Bottom Right)"
              onClick={() => this.setState({ infoOpen: true })}
            />
            <MessageDialogPro
              type="info"
              isOpen={this.state.infoOpen}
              onClose={this.closeInfoPanel}
              position={[null, null, 0, 0]}
              modal={false}
              content="Data deleted"
              detail="You deleted data"
              buttons={{ ok: { onClick: this.closeInfoPanel } }}
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



```jsx
import MessageDialogPro from "eview-ui/MessageDialogPro";
import Button from "eview-ui/Button";
import ConfigProvider from "eview-ui/ConfigProvider";
import { getDemoVersion } from "eview-ui/ThemeProvider";

const MessageDialogProDemo2 = () => {
  React.useEffect(() => {
    return () => {
      MessageDialogPro.destroyAll();
    };
  });

  const [version, theme] = getDemoVersion();

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div>
        <Button
          text="Open a success dialog, auto close after 2000ms"
          onClick={() => {
            const dialog = MessageDialogPro.success({
              version: version,
              content: "success",
              detail: "success detail",
              modal: false,
              afterClose: () => {
                console.log("afterClose");
              },
            });
            setTimeout(() => {
              dialog.destroy();
            }, 2000);
          }}
        />
        <br />
        <br />
        <Button
          text="Open a success dialog, update config"
          onClick={() => {
            const dialog = MessageDialogPro.success({
              version: version,
              content: "success",
              modal: false,
              buttons: {
                ok: {
                  text: "click me to update",
                  onClick: () => {
                    dialog.update({
                      content: "new content",
                      detail: "new detail",
                    });
                  },
                },
              },
            });
          }}
        />
        <br />
        <br />
        <Button
          onClick={() => MessageDialogPro.destroyAll()}
          text="destroyAll"
        />
      </div>
    </ConfigProvider>
  );
};

ReactDOM.render(<MessageDialogProDemo2 />, mountNode);
```
