# Drawer 抽屉

> 分类：反馈

屏幕边缘滑出的浮层面板，抽屉从父窗体边缘滑入。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Drawer` | `Drawer` | antd v5 `open`→**`visible`**（回到 v4 拼写）；`placement` 同名（top/right/bottom/left）；`onClose(event)` **不自动关闭**（CloseEvent `{type:'ok'/'cancel'/'mask'}` 可区分来源）；`width` 默认 **'20rem'**（最小 4rem）；`title`/`footer` 支持 **`false`**（显式无）；遮罩 `maskSetting={disable, onClickClose, show}`；`inContainer` 挂父容器 |

## API


### 属性

| 属性名称           | 类型                                                         | 默认                                               | 描述                                                         |
| :----------------- | :----------------------------------------------------------- | :------------------------------------------------- | :----------------------------------------------------------- |
| visible            | boolean                                                      | false                                              | 控制Drawer是否可见的变量                                     |
| onClose            | (event?: CloseEvent) => void;                                |                                                    | 关闭时的回调, 需要在此将visible设为false                     |
| inContainer?       | (() => HTMLElement) &#124; boolean                           | false                                              | 设置挂载的父容器 <br> false - 挂在document.body上 <br> true - 挂载在父容器中(注，其容器的position必须为relative) <br> Function: () => HTMLElement - 指定父容器(注，其容器的position必须为relative) |
| maskSetting?       | { disable: boolean, onClickClose?: boolean, show?: boolean, style?: React.CSSProperties } | { disable:false, onClickClose: false, show: true } | 遮罩层设置                                                   |
| title?             | string &#124; React.ReactNode &#124; false                   |                                                    | 标题, 设置为false为无title                                   |
| width?             | string &#124; number                                         | '20rem'                                            | Drawer主体宽度, 默认为20rem, 最小为4rem, 类型为number时，单位为px |
| height?            | string &#124; number                                         | '20rem'                                            | Drawer主体高度, 默认为20rem, 最小为6rem, 类型为number时，单位为px |
| zIndex?            | number &#124; 'auto' &#124; 'initial' &#124; 'inherit' &#124; '-moz-initial' &#124; 'revert' &#124; 'unset' &#124; 1000 | 设置Drawer整体的基本z-index, 默认为1000            |                                                              |
| placement?         | 'top' &#124; 'right' &#124; 'bottom' &#124; 'left'           | 'right'                                            | Drawer位置, 默认为'right'                                    |
| footer?            | React.ReactNode &#124; false                                 |                                                    | 页脚的元素, 设置为false为无footer                            |
| children?          | React.ReactNode                                              |                                                    | Drawer body内的元素                                          |
| style?             | React.CSSProperties                                          |                                                    | 最外层容器样式                                               |
| drawerStyle?       | React.ReactNode                                              |                                                    | Drawer主体样式                                               |
| headerStyle?       | React.ReactNode                                              |                                                    | Drawer主体中header的样式                                     |
| bodyStyle?         | React.ReactNode                                              |                                                    | Drawer主体中body的样式                                       |
| footerStyle?       | React.ReactNode                                              |                                                    | Drawer主体中footer的样式                                     |
| animationDuration? | number                                                       | 300                                                | 抽屉显隐动画时长，单位ms                                     |
| closable           | bool                                                         | true                                               | 自定义抽屉是否显示关闭按钮，默认值为true，可隐藏，例如： closable={false} |

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

## en-US



```jsx
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default function DrawerBasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const [version, theme] = getDemoVersion();
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <Button text={'Open The Drawer'} onClick={open}></Button>
        <Drawer visible={visible} onClose={close} title={'Basic Drawer'}/>
      </>
    </ConfigProvider>
  );
}

ReactDOM.render(<DrawerBasicDemo />, mountNode);

```

```jsx
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default function DrawerBasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const [version, theme] = getDemoVersion();
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <Button text={'Open The Drawer'} onClick={open}></Button>
        <Drawer visible={visible} onClose={close} title={'Basic Drawer'}/>
      </>
    </ConfigProvider>
  );
}

ReactDOM.render(<DrawerBasicDemo />, mountNode);

```

### 位置设置

## en-US



```tsx
import React from 'react';
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const buttonStyle: React.CSSProperties = {
    marginRight: '1rem',
};

type Placement = 'left' | 'right' | 'top' | 'bottom';

export default function DrawerPlacementDemo() {
  const [visible, setVisible] = React.useState(false);
  const [width, setWidth] = React.useState('40rem');
  const [height, setHeight] = React.useState('40rem');
  const [placement, setPlacement] = React.useState('right' as Placement);
  const close = () => setVisible(false);
  const open = (newPlacement: Placement) => {
    if (newPlacement === 'left' || newPlacement === 'right') {
      setWidth('40rem');
      setHeight('100%');
    } else {
      setWidth('100%');
      setHeight('40rem');
    }
    setPlacement(newPlacement);
    setVisible(true);
  };
  const [version, theme] = getDemoVersion();
  let data = [
    { text: 'left', onClick: () => open('left') },
    { text: 'right', onClick: () => open('right') },
    { text: 'top', onClick: () => open('top') },
    { text: 'bottom', onClick: () => open('bottom') },
  ];

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <ButtonGroup data={data}/>
        <Drawer
          visible={visible}
          placement={placement}
          onClose={close}
          width={width}
          height={height}
          title={`Drawer placed at ${placement}`}
        ></Drawer>
      </>
    </ConfigProvider>
  );
}

ReactDOM.render(<DrawerPlacementDemo />, mountNode);

```

```tsx
import React from 'react';
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const buttonStyle: React.CSSProperties = {
    marginRight: '1rem',
};

type Placement = 'left' | 'right' | 'top' | 'bottom';

export default function DrawerPlacementDemo() {
  const [visible, setVisible] = React.useState(false);
  const [width, setWidth] = React.useState('40rem');
  const [height, setHeight] = React.useState('40rem');
  const [placement, setPlacement] = React.useState('right' as Placement);
  const close = () => setVisible(false);
  const open = (newPlacement: Placement) => {
    if (newPlacement === 'left' || newPlacement === 'right') {
      setWidth('40rem');
      setHeight('100%');
    } else {
      setWidth('100%');
      setHeight('40rem');
    }
    setPlacement(newPlacement);
    setVisible(true);
  };
  const [version, theme] = getDemoVersion();
  let data = [
    { text: 'left', onClick: () => open('left') },
    { text: 'right', onClick: () => open('right') },
    { text: 'top', onClick: () => open('top') },
    { text: 'bottom', onClick: () => open('bottom') },
  ];

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <ButtonGroup data={data}/>
        <Drawer
          visible={visible}
          placement={placement}
          onClose={close}
          width={width}
          height={height}
          title={`Drawer placed at ${placement}`}
        ></Drawer>
      </>
    </ConfigProvider>
  );
}

ReactDOM.render(<DrawerPlacementDemo />, mountNode);

```

### 内容设置

## en-US



```tsx
import React from 'react';
import Form from 'eview-ui/FormPro';
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import { Row, Col } from 'eview-ui/GridLayout';
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const buttonStyle: React.CSSProperties = {
  width: '4.5rem',
  paddingLeft: '0rem',
  paddingRight: '0rem',
  borderRadius: '0.3125rem',
  marginLeft: '0.3125rem',
  marginRight: '0.3125rem'
};

export default function DrawerBasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const footer: React.ReactNode = <>
    <Button text={'Ok'} onClick={close} status='primary' style={buttonStyle}></Button>
    <Button text={'Cancel'} onClick={close} style={buttonStyle}></Button>
  </>;

  const [version, theme] = getDemoVersion();

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <Button text={'Fill in the form'} onClick={open}></Button>
        <Drawer visible={visible} onClose={close}
                title={'Basic Drawer'} footer={footer}
                width={'40rem'} height={'100%'}>
          <Form>
            <Form.Item label='Name' name='username'>
              <TextField />
            </Form.Item>
            <Form.Item label='Id' name='Id'>
              <TextField />
            </Form.Item>
          </Form>
        </Drawer>
      </>
    </ConfigProvider>
  );
}

ReactDOM.render(<DrawerBasicDemo />, mountNode);

```

```tsx
import React from 'react';
import Form from 'eview-ui/FormPro';
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import { Row, Col } from 'eview-ui/GridLayout';
import TextField from 'eview-ui/TextField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const buttonStyle: React.CSSProperties = {
  width: '4.5rem',
  paddingLeft: '0rem',
  paddingRight: '0rem',
  borderRadius: '0.3125rem',
  marginLeft: '0.3125rem',
  marginRight: '0.3125rem'
};

export default function DrawerBasicDemo() {
  const [visible, setVisible] = React.useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const footer: React.ReactNode = <>
    <Button text={'Ok'} onClick={close} status='primary' style={buttonStyle}></Button>
    <Button text={'Cancel'} onClick={close} style={buttonStyle}></Button>
  </>;

  const [version, theme] = getDemoVersion();

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <>
        <Button text={'Fill in the form'} onClick={open}></Button>
        <Drawer visible={visible} onClose={close}
                title={'Basic Drawer'} footer={footer}
                width={'40rem'} height={'100%'}>
          <Form>
            <Form.Item label='Name' name='username'>
              <TextField />
            </Form.Item>
            <Form.Item label='Id' name='Id'>
              <TextField />
            </Form.Item>
          </Form>
        </Drawer>
      </>
    </ConfigProvider>
  );
}

ReactDOM.render(<DrawerBasicDemo />, mountNode);

```

### 容器设置

## en-US

```tsx
import React from 'react';
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const containerStyle: React.CSSProperties = {
  position: 'relative',
  height: '9rem',
  border: '1px solid #808080',
};

const buttonStyle: React.CSSProperties = {
  marginRight: '0.5rem',
};

const content = 'This component is a panel that slides in from one side of its container.';

export default function DrawerContainerDemo() {
  const [visible, setVisible] = React.useState(false);
  const [inContainer, setInContainer] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const close = () => setVisible(false);

  const clickByContainer = (newTitle: string, newInContainer?: boolean) => {
    if (!visible) {
      setInContainer(newInContainer);
      setTitle(newTitle);
    }
    setVisible(!visible);
  };


  const footer: React.ReactNode = <>
    <Button text={'Ok'} onClick={close} status="primary" style={buttonStyle}></Button>
    <Button text={'Cancel'} onClick={close} style={buttonStyle}></Button>
  </>;
  const [version, theme] = getDemoVersion();
  let data = [
    { text: 'Default (window)', onClick: () => clickByContainer('Default (window)', false)},
    { text: 'On this container', onClick: () => clickByContainer('On this container', true) },
  ];

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div style={containerStyle}>
        <ButtonGroup data={data}/>
        <Drawer visible={visible} onClose={close} title={title}
                width={'40rem'} height={'100%'} inContainer={inContainer} footer={footer}>
          <div>{content}</div>
        </Drawer>
      </div>
    </ConfigProvider>
  );
}


ReactDOM.render(<DrawerContainerDemo />, mountNode);

```

```tsx
import React from 'react';
import Drawer from 'eview-ui/Drawer';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const containerStyle: React.CSSProperties = {
  position: 'relative',
  height: '9rem',
  border: '1px solid #808080',
};

const buttonStyle: React.CSSProperties = {
  marginRight: '0.5rem',
};

const content = 'This component is a panel that slides in from one side of its container.';

export default function DrawerContainerDemo() {
  const [visible, setVisible] = React.useState(false);
  const [inContainer, setInContainer] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const close = () => setVisible(false);

  const clickByContainer = (newTitle: string, newInContainer?: boolean) => {
    if (!visible) {
      setInContainer(newInContainer);
      setTitle(newTitle);
    }
    setVisible(!visible);
  };


  const footer: React.ReactNode = <>
    <Button text={'Ok'} onClick={close} status="primary" style={buttonStyle}></Button>
    <Button text={'Cancel'} onClick={close} style={buttonStyle}></Button>
  </>;
  const [version, theme] = getDemoVersion();
  let data = [
    { text: 'Default (window)', onClick: () => clickByContainer('Default (window)', false)},
    { text: 'On this container', onClick: () => clickByContainer('On this container', true) },
  ];

  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div style={containerStyle}>
        <ButtonGroup data={data}/>
        <Drawer visible={visible} onClose={close} title={title}
                width={'40rem'} height={'100%'} inContainer={inContainer} footer={footer}>
          <div>{content}</div>
        </Drawer>
      </div>
    </ConfigProvider>
  );
}


ReactDOM.render(<DrawerContainerDemo />, mountNode);

```

