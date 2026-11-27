# Drawer 抽屉

> 分类：反馈

屏幕边缘滑出的浮层面板，抽屉从父窗体边缘滑入。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点                                                                                                                                                                                                                                                                                                                                      |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Drawer`  | `Drawer`   | antd v5 `open`→**`visible`**（回到 v4 拼写）；`placement` 同名（top/right/bottom/left）；`onClose(event)` **不自动关闭**（CloseEvent `{type:'ok'/'cancel'/'mask'}` 可区分来源）；`width` 默认 **'20rem'**（最小 4rem）；`title`/`footer` 支持 **`false`**（显式无）；遮罩 `maskSetting={disable, onClickClose, show}`；`inContainer` 挂父容器 |

## API

### 属性

| 属性名称           | 类型                                                                                                                    | 默认                                              | 描述                                                                                                                                                                                               |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| visible            | boolean                                                                                                                 | false                                             | 控制Drawer是否可见的变量                                                                                                                                                                           |
| onClose            | (event?: CloseEvent) => void;                                                                                           |                                                   | 关闭时的回调, 需要在此将visible设为false                                                                                                                                                           |
| inContainer?       | (() => HTMLElement) &#124; boolean                                                                                      | false                                             | 设置挂载的父容器 <br> false - 挂在document.body上 <br> true - 挂载在父容器中(注，其容器的position必须为relative) <br> Function: () => HTMLElement - 指定父容器(注，其容器的position必须为relative) |
| maskSetting?       | { disable: boolean, onClickClose?: boolean, show?: boolean, style?: React.CSSProperties }                               | { disable:false, onClickClose: true, show: true } | 遮罩层设置                                                                                                                                                                                         |
| title?             | string &#124; React.ReactNode &#124; false                                                                              |                                                   | 标题, 设置为false为无title                                                                                                                                                                         |
| width?             | string &#124; number                                                                                                    | '20rem'                                           | Drawer主体宽度, 默认为20rem, 最小为4rem, 类型为number时，单位为px                                                                                                                                  |
| height?            | string &#124; number                                                                                                    | '20rem'                                           | Drawer主体高度, 默认为20rem, 最小为6rem, 类型为number时，单位为px                                                                                                                                  |
| zIndex?            | number &#124; 'auto' &#124; 'initial' &#124; 'inherit' &#124; '-moz-initial' &#124; 'revert' &#124; 'unset' &#124; 1000 | 设置Drawer整体的基本z-index, 默认为1000           |                                                                                                                                                                                                    |
| placement?         | 'top' &#124; 'right' &#124; 'bottom' &#124; 'left'                                                                      | 'right'                                           | Drawer位置, 默认为'right'                                                                                                                                                                          |
| footer?            | React.ReactNode &#124; false                                                                                            |                                                   | 页脚的元素, 设置为false为无footer                                                                                                                                                                  |
| children?          | React.ReactNode                                                                                                         |                                                   | Drawer body内的元素                                                                                                                                                                                |
| style?             | React.CSSProperties                                                                                                     |                                                   | 最外层容器样式                                                                                                                                                                                     |
| drawerStyle?       | React.CSSProperties                                                                                                     |                                                   | Drawer主体样式                                                                                                                                                                                     |
| headerStyle?       | React.CSSProperties                                                                                                     |                                                   | Drawer主体中header的样式                                                                                                                                                                           |
| bodyStyle?         | React.CSSProperties                                                                                                     |                                                   | Drawer主体中body的样式                                                                                                                                                                             |
| footerStyle?       | React.CSSProperties                                                                                                     |                                                   | Drawer主体中footer的样式                                                                                                                                                                           |
| animationDuration? | number                                                                                                                  | 300                                               | 抽屉显隐动画时长，单位ms                                                                                                                                                                           |
| closable           | boolean                                                                                                                    | true                                              | 自定义抽屉是否显示关闭按钮，默认值为true，可隐藏，例如： closable={false}                                                                                                                          |
| closeByEsc?        | boolean                                                                                                                 | true                                              | 是否能通过键盘esc关闭                                                                                                                                                                              |
| version?           | string                                                                                                                  |                                                   | 支持通过version设置组件版本                                                                                                                                                                        |
| theme?             | string                                                                                                                  |                                                   | 支持通过theme设置组件主题                                                                                                                                                                          |

```javascript
export interface DrawerAPI extends DrawerStyleAPI {
    /** 控制Drawer是否可见的变量 */
    visible: boolean;

    /** 关闭时的回调, 需要在此将visible设为false */
    onClose: (event?: CloseEvent) => void;

    /** 挂载的容器，不设值默认为document.body, 设为false时为元素放置的原位置(注，其容器的position必须为relative, 并大于4rem*6rem) */
    container?: HTMLElement | false;

    /** 遮罩层设置 */
    maskSetting?: {
        /** 禁用遮罩层, 默认为false */
        disable?: boolean;

        /** 点击遮罩层是否关闭抽屉，默认为true (注, 请确保至少一种Drawer关闭方式) */
        onClickClose?: boolean;

        /** 显示遮罩层，默认为true */
        show?: boolean;

        /** 遮罩层样式 */
        style?: React.CSSProperties;
    };

    /** 标题, 设置为false为无footer */
    title?: string | React.ReactNode | false;

    /** Drawer主体宽度, 默认为20rem, 最小为4rem, 类型为number时，单位为px */
    width?: string | number;

    /** Drawer主体高度, 默认为20rem, 最小为6rem, 类型为number时，单位为px */
    height?: string | number;

    /** 设置Drawer整体的基本z-index, 默认为1000 */
    zIndex?: number | 'auto' | 'initial' | 'inherit' | '-moz-initial' | 'revert' | 'unset';

    /** Drawer位置, 默认为'right' */
    placement?: 'top' | 'right' | 'bottom' | 'left';

    /** 页脚的元素, 设置为false为无footer */
    footer?: React.ReactNode | false;

    /** Drawer body内的元素 */
    children?: React.ReactNode;
}


/**
 * 样式参数优先度: props > props.style > css
 */
interface DrawerStyleAPI {
    /** 最外层容器样式 */
    style?: React.CSSProperties;

    /** Drawer主体样式 */
    drawerStyle?: React.CSSProperties;

    /** Drawer主体中header的样式 */
    headerStyle?: React.CSSProperties;

    /** Drawer主体中body的样式 */
    bodyStyle?: React.CSSProperties;

    /** Drawer主体中footer的样式 */
    footerStyle?: React.CSSProperties;
}

interface CloseEvent {
    type: 'ok' | 'cancel' | 'mask';
}

type AnimationType = 'opening' | 'closing';
```

## 使用示例

### 基本属性设置

```jsx
import Drawer from "eview-ui/Drawer";
import Button from "eview-ui/Button";

// visible 受控：true 显示 / false 隐藏，onClose 中置 false
<Button text={"Open The Drawer"} onClick={() => { /* setVisible(true) 打开 */ }} />
<Drawer visible={false} onClose={() => { /* setVisible(false) 关闭 */ }} title={"Basic Drawer"} />
```

### 位置设置

```tsx
import Drawer from "eview-ui/Drawer";

// placement: "left" | "right" | "top" | "bottom"
// left/right 用 width；top/bottom 用 height
<Drawer
  visible={false}
  placement={"right"}
  onClose={() => { /* setVisible(false) 关闭 */ }}
  width={"40rem"}
  height={"100%"}
  title={`Drawer placed at right`}
/>
```

### 内容设置

```tsx
import Form from "eview-ui/FormPro";
import Drawer from "eview-ui/Drawer";
import Button from "eview-ui/Button";
import TextField from "eview-ui/TextField";

const footer = (
  <>
    <Button text={"Ok"} status="primary" onClick={() => { /* 关闭 */ }} />
    <Button text={"Cancel"} onClick={() => { /* 关闭 */ }} />
  </>
);

<Drawer
  visible={false}
  onClose={() => { /* setVisible(false) 关闭 */ }}
  title={"Basic Drawer"}
  footer={footer}
  width={"40rem"}
  height={"100%"}
>
  <Form>
    <Form.Item label="Name" name="username">
      <TextField />
    </Form.Item>
    <Form.Item label="Id" name="Id">
      <TextField />
    </Form.Item>
  </Form>
</Drawer>
```

### 容器设置

```tsx
import Drawer from "eview-ui/Drawer";
import Button from "eview-ui/Button";

const footer = (
  <>
    <Button text={"Ok"} status="primary" onClick={() => { /* 关闭 */ }} />
    <Button text={"Cancel"} onClick={() => { /* 关闭 */ }} />
  </>
);

// inContainer: true 挂载到父容器内 / false 挂载到 window
<Drawer
  visible={false}
  onClose={() => { /* setVisible(false) 关闭 */ }}
  title={"On this container"}
  width={"40rem"}
  height={"100%"}
  inContainer={true}
  footer={footer}
>
  <div>This component is a panel that slides in from one side of its container.</div>
</Drawer>
```
