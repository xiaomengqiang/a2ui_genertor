# DialogPro 新对话框

> 分类：反馈

该组件用来显示对话框

### 属性

| 属性名称 | 描述 | 输入                                                        | 默认               |
|:-----|:-----|:----------------------------------------------------------|:-----------------|
| id |  设置DialogPro的id | string                                                    |                  |
| style |  通过自定义style来改变组件的的整体样式 例如:margin padding display | CSSProperties                                             |                  |
| className |  通过自定义class来改变组件的整体样式 例如:margin padding display | string                                                    |                  |
| maskStyle |  通过添加style设置遮罩层的样式 | CSSProperties                                             |                  |
| contentStyle | 通过style设置content的样式 | CSSProperties                                             |                  |
| size | 宽，高，默认auto，弹性布局，请设置为偶数，支持rem,resize后转为px单位 | [ReactText, ReactText]                                    | ['auto', 'auto'] |
| minSize | 最小宽高，默认[504, 400]，请设置为偶数 | [number, number]                                          |                  |
| title | title 显示文本 | string                                                    |                  |
| titleTip | title 提示内容，默认与title一致 | string                                                    |                  |
| children | content显示内容(当组件中不包含子组件时，此属性生效) | ReactNode                                                 |                  |
| isOpen | 是否打开 | boolean                                                   |                  |
| onClose | 关闭事件，请在此事件中将isOpen设为false | (event) => void                                           |                  |
| destroyOnClose | 关闭时是否摧毁页面 | boolean                                                   | true             |
| closeOnEscape | esc时是否触发关闭 | boolean                                                   | true             |
| focusOnClose | isOpen由false转true时是否聚焦close | boolean                                                   | true             |
| isNeedFocusOnOpen | 打开时是否需要聚焦到dialog上。<br> 注意：false时 focusOnClose api会失效 | boolean                                                   | true             |
| position | 打开时初始位置，0=left ,1=top，2=right, 3=bottom不设置默认居中,top/bottom和left/right只能设置一个，另一个设为null，比如[200, 200, null, null] | [ReactText, ReactText, ReactText, ReactText]              |                  |
| customHeader | 自定义header | ReactNode                                                 |                  |
| closable | 是否显示关闭按钮 | boolean                                                   | true             |
| resizable | 是否可以resize，默认false，一旦用户拖拽修改了弹框大小，弹框不再自适应 | boolean                                                   | false            |
| movable | 是否可以拖拽，默认true | boolean                                                   | true             |
| modal | 是否是模态框 | boolean                                                   | true             |
| zIndex | zIndex值 | number                                                    |                  |
| mountId | Dialog 挂载节点 id | string                                                    | body             |
| limitMoveInMountContainer | 是否将拖拽范围限制在mountId指定的容器内，默认false。配置为true时需要设置mountId容器的宽高。 | boolean                                                   | false            |
| onDragStart | 拖动开始时回调 | (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void |                  |

## 使用示例

### 基本使用

DialogPro的基本使用
Dialog包含模态和非模态两种，按照AUI规范，模态框不能设置位置，保持居中，非模态框可以设置位置和拖动。

关于resize的说明：
resize默认不开启，也不建议使用。开发人员应该合理的设置好弹框的宽高确保用户有良好的使用体验，而不是让用户手动拖动修改。

关于宽高设置
如果需要固定宽高，请设置好宽高。
如果需要弹框高度随内容变化，请不要设置宽高，但是需要设置最小宽高minSize。
当需要支持拖动时，请确保宽高值为偶数，避免弹框内容模糊。

关于最小化
旧Dialog的最小化存在非常多的问题，是极为罕见的场景，属于定制，现在不予支持，但是提供了customHeader接口供使用者自行实现。

```jsx
import DialogPro from 'eview-ui/DialogPro';
import Button from 'eview-ui/Button';
import TextField from 'eview-ui/TextField';
import React, { useState } from 'react';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export const Demo = () => {
  const [version, theme] = getDemoVersion();
  const [height, setHeight] = useState(400);
  const [open, setOpen] = useState(false);
  return (
    // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
    <ConfigProvider version={version} theme={theme}>
      <div style={{ height: 50, width: 2400 }}>
        <Button onClick={() => setOpen(true)} text='open dialog'/>
        <DialogPro
          isOpen={open}
          onClose={() => setOpen(false)}
          title={'Modal Dialog'}
          modal={true}
          resizable={true}
          minSize={[600, 400]}
          movable={false}
        >
          <div style={{height: height}}>
            这是一个弹框
          </div>
        </DialogPro>
      </div>
    </ConfigProvider>
  );
};

ReactDOM.render(<Demo />, mountNode);
```

