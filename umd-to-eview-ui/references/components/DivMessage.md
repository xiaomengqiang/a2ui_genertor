# DivMessage 通知提醒

> 分类：反馈

Div提示框，主要用于区域操作的结果性提示，直接显示在主内容区域的上方，默认不自动消失（disposeTimeOut默认为0）。支持定义样式，自定义文本内容，自定义图标，支持["default","success","warn","error"]四种类型，ICT 3.1以上风格额外支持"risk"和"highRisk"类型。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Alert` | `DivMessage` | `message`→**`text`**；`type`（`default`/`success`/`error`/`warn`，3.1 另有 `risk`/`highRisk`）；**`display` 显隐（不是 visible/isOpen）**；`closable` 默认 true；`disposeTimeOut`（**默认 0 = 不自动隐藏**；TimeOut 大写 O 拼写）；`description`→`detail`? 无——内容全走 `text`（支持 string 和 ReactNode） |
| `message.success()` | `DivMessage`（受控渲染） | **无命令式 API**；只能渲染 `<DivMessage display type="success" text>`；换 key 重挂触发重新计时；或用 `MessageDialogPro.success(config)` 静态（但脱离 context）；**DivMessage 渲染在父组件渲染树中会引发输入组件失焦**（通知浮层抽离独立组件 + 自己的 state） |

## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id | 默认支持动态设置id;同时支持用户自定义设置固定id | string | |
| className | 支持通过className设置组件样式 | string | |
| style | 支持通过style设置组件样式 | CSSProperties | |
| text | 支持通过text设置组件文本内容 | string \| ReactNode | |
| icon | 支持通过icon设置组件图标，icon为url，组件默认图标符合AUI2.0规范，图片大小为16*16 | string | |
| iconClassName | 支持通过iconClassName设置图标样式 | string | |
| type | 支持通过type设置组件类型，包括[default, success, warn, error]四种类型，ICT 3.1以上风格额外支持 risk 和 highRisk 类型 | enum:<br>&nbsp;"default"<br>&nbsp;"success"<br>&nbsp;"warn"<br>&nbsp;"error"<br>&nbsp;"risk"<br>&nbsp;"highRisk" | "default" |
| display | 支持通过display设置组件显示与隐藏 | boolean | true |
| closable | 根据用户配置设置关闭信息提示 | boolean | true |
| disposeTimeOut | 支持通过设置disposeTimeOut显示时间，如果用户给出超过0毫秒，超过该时间就会隐藏。默认不隐藏 | number | 0 |
| onClose | 自定义点击关闭按钮关闭DivMessage时的回调方法，不传则无回调 例如：onClose={()=>alert('2')} | (event?: any) => void | |
| version | 支持通过version设置组件版本 | string | |
| theme | 支持通过theme设置组件主题 | string | |

## 使用示例

### 基本使用

DivMessage包含四种基本类型：default、success、warn、error。ICT 3.1风格额外支持risk和highRisk类型。

```jsx
import React, { useState } from 'react';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';

export const Demo = () => {
  const [display, setDisplay] = useState(false);

  const handleClose = () => {
    console.log('onClose fired');
  };

  const handleClick = () => {
    setDisplay(true);
  };

  return (
    <div style={{ margin: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <DivMessage text="Cloud host hws-ws-00032 started successfully!" type="success" disposeTimeOut={5000} onClose={handleClose} />
        <DivMessage text="Cloud host hws-ws-00032 failed to start!" type="error" style={{ marginBottom: '20px' }} />
        <DivMessage text="Cloud host hws-ws-00032 giving warning!" type="warn" style={{ marginBottom: '20px' }} />
        <DivMessage text="System is busy, please try again later!" type="default" style={{ marginBottom: '20px' }} />
      </div>
      {
        display && (
          <DivMessage
            text="This message will auto disappear after 5 seconds!"
            type="success"
            disposeTimeOut={5000}
            onClose={() => setDisplay(false)}
          />
        )
      }
      <Button onClick={handleClick} text="Show DivMessage (5s auto-close)" />
    </div>
  );
};
```

### 自定义图标

通过 `icon` 属性可以设置自定义图标，icon为图片url地址。

```jsx
import React from 'react';
import DivMessage from 'eview-ui/DivMessage';

export const IconDemo = () => {
  const customIconUrl = '/path/to/icon.png';

  return (
    <div>
      <DivMessage text="Custom icon message" type="default" icon={customIconUrl} style={{ marginBottom: '20px' }} />
      <DivMessage text="Custom icon with iconClassName" type="success" icon={customIconUrl} iconClassName="my-custom-icon" />
    </div>
  );
};
```

### 受控显隐

通过 `display` 属性控制组件的显示与隐藏，配合 `disposeTimeOut` 设置自动隐藏时间。

```jsx
import React, { useState } from 'react';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';

export const DisplayDemo = () => {
  const [display, setDisplay] = useState(false);

  return (
    <div>
      <DivMessage
        display={display}
        text="This is a controlled DivMessage"
        type="success"
        disposeTimeOut={0}
        onClose={() => setDisplay(false)}
      />
      <Button onClick={() => setDisplay(!display)} text={display ? 'Hide' : 'Show'} />
    </div>
  );
};
```

