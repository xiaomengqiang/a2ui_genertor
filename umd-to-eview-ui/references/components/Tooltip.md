# Tooltip 气泡框

> 分类：数据展示

弹出气泡式的提示。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Tooltip` | `Tooltip` | **`title`→`content`**（ReactNode）；`placement` 同名 12 值；`trigger` 同名；`visible`/`onVisibleChange` 受控；`open`→`visible`；`arrowPointAtCenter` 同名；`getPopupContainer` 同名；`mouseEnterDelay`/`mouseLeaveDelay` 单位 **ms（antd 是秒，数值需 ×1000）**；`destroyTooltipOnHide` 同名 |
| `Popover` | `Tooltip` | `trigger="click"` + `content` 自定义；`Tooltip` 包裹式（`<Tooltip content trigger="click"><目标/></Tooltip>`）；`Tooltip.destroyAll()` |

## API


### 属性

| 参数                   | 说明                                                                                                                                     | 类型                    | 默认值    |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------|-----------------------|--------|
| content              | 气泡框内容                                                                                                                                  | React.ReactNode       |        |
| autoAdjustOverflow   | 气泡被遮挡时自动调整位置                                                                                                                           | boolean               | `true` |
| getPopupContainer    | 浮层渲染父节点，默认渲染到 body 上                                                                                                                   | (() => HTMLElement) \| false  | () => document.body |
| overlayClassName     | 卡片类名                                                                                                                                   | string                | 无      |
| overlayStyle         | 卡片样式                                                                                                                                   | object                | 无      |
| placement            | 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string                | top    |
| trigger              | 触发行为，可选 `hover/focus/click`，                                                                                                           | string \| string[]   | hover  |
| visible              | 用于手动控制浮层显隐，不设置时通过trigger触发控制显隐                                                                                                         | boolean               | 无  |
| arrowPointAtCenter   | 箭头是否指向目标元素中心	                                                                                                                          | boolean               | false  |
| onVisibleChange      | 显示隐藏的回调                                                                                                                                | (visible) => void     | 无      |
| space                | popup框依附aligned元素的附加距离                                                                                                                 | number                | 8      |
| zIndex               | popup框的z-index属性                                                                                                                       | number                | 9999   |
| mouseEnterDelay      | 进入多少 ms 显示 Tooltip（0.1.x 版本支持)                                                                                                         | number                | 100    |
| mouseLeaveDelay      | 移出多少 ms 隐藏 Tooltip（0.1.x 版本支持)                                                                                                         | number                | 100    |
| destroyTooltipOnHide | 关闭后是否销毁 Tooltip（0.1.x 版本支持)                                                                                                            | boolean               | false  |
| hideArrow            | 是否隐藏箭头（0.1.x 版本支持)                                                                                                                     | boolean               | false  |
| useAbsolute          | 是否使用 absolute 定位，适用于 Dialog 内FormPro校验 tip 等需要限制在容器内的场景,配合 getPopupContainer 可使 tooltip 被容器的 overflow 裁剪并跟随容器滚动。                       | boolean               | false  |

### 其他组件中使用ToolTip时可自定义的属性(CustomTooltipType)

`placement`, `hideArrow`, `autoConfig`, `overlayClassName`, `getPopupContainer`, `autoAdjustOverflow`
`arrowPointAtCenter`, `zIndex` ,`mouseEnterDelay`, `mouseLeaveDelay`

## FAQ
Q: Tooltip 滚动时位置错误？
A: 此场景下一般可滚动的元素不为window，需要使用`getPopupContainer`, 挂载到可滚动元素下。 （Tooltip默认挂载在body下，监听window的滚动事件来更新位置）

## 注意

请确保 `Tooltip` 的子元素能接受 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。

`Tooltip.destroyAll()` 主动销毁所有Tooltip

## 使用示例

### 基本使用

## en-US

```jsx
import Tooltip from 'eview-ui/Tooltip';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <Tooltip content="prompt text" trigger={['hover', 'focus']}>
      <span>Tooltip will show on mouse enter.</span>
    </Tooltip>
  </ConfigProvider>
  , mountNode);

```

```jsx
import Tooltip from 'eview-ui/Tooltip';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <Tooltip content="prompt text" trigger={['hover', 'focus']}>
      <span>Tooltip will show on mouse enter.</span>
    </Tooltip>
  </ConfigProvider>
  , mountNode);

```

### 触发开关方式

设置`trigger`控制触发方式。

```jsx
import Tooltip from 'eview-ui/Tooltip';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);
const style = {
  width: 70,
  margin: 4,
  background: '#fff',
  border: 'solid 1px #ccc',
  borderRadius: '3px',
  padding: '4px 8px'
};
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <div>
      <Tooltip content={content} trigger="hover">
        <button style={style}>Hover me</button>
      </Tooltip>
      <Tooltip content={content} trigger="focus">
        <button style={style}>Focus me</button>
      </Tooltip>
      <Tooltip content={content} trigger="click">
        <button style={style}>Click me</button>
      </Tooltip>
    </div>
  </ConfigProvider>,
  mountNode
);
```

### 位置处理

设置`Placement`控制放置位置。<br>
`Tooltip`弹出空间不足时会自动调整位置，可以通过`autoAdjustOverflow`关闭此功能

```jsx
import Tooltip from 'eview-ui/Tooltip';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

const text = 'Tooltip Text!';
const buttonWidth = 70;
const style = {
  width: 70,
  margin: 4,
  background: '#fff',
  border: 'solid 1px #ccc',
  borderRadius: '3px',
  padding: '4px 8px'
};
ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <div>
      <div style={{marginLeft: buttonWidth, whiteSpace: 'nowrap'}}>
        <Tooltip placement="topLeft" content={text} trigger={['hover', 'focus']}>
          <button style={style}>上左</button>
        </Tooltip>
        <Tooltip placement="top" content={text} trigger={['hover', 'focus']}>
          <button style={style}>上</button>
        </Tooltip>
        <Tooltip placement="topRight" content={text} trigger={['hover', 'focus']}>
          <button style={style}>上右</button>
        </Tooltip>
      </div>
      <div style={{width: buttonWidth, float: 'left'}} >
        <Tooltip placement="leftTop" content={text} trigger={['hover', 'focus']}>
          <button style={style}>左上</button>
        </Tooltip>
        <Tooltip placement="left" content={text} trigger={['hover', 'focus']}>
          <button style={style}>左</button>
        </Tooltip>
        <Tooltip placement="leftBottom" content={text} trigger={['hover', 'focus']}>
          <button style={style}>左下</button>
        </Tooltip>
      </div>
      <div style={{width: buttonWidth, marginLeft: buttonWidth * 4 + 24}}>
        <Tooltip placement="rightTop" content={text} trigger={['hover', 'focus']}>
          <button style={style}>右上</button>
        </Tooltip>
        <Tooltip placement="right" content={text} trigger={['hover', 'focus']}>
          <button style={style}>右</button>
        </Tooltip>
        <Tooltip placement="rightBottom" content={text} trigger={['hover', 'focus']}>
          <button style={style}>右下</button>
        </Tooltip>
      </div>
      <div style={{marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap'}}>
        <Tooltip placement="bottomLeft" content={text} trigger={['hover', 'focus']}>
          <button style={style}>下左</button>
        </Tooltip>
        <Tooltip placement="bottom" content={text} trigger={['hover', 'focus']}>
          <button style={style}>下</button>
        </Tooltip>
        <Tooltip placement="bottomRight" content={text} trigger={['hover', 'focus']}>
          <button style={style}>下右</button>
        </Tooltip>
      </div>
    </div>
  </ConfigProvider>,
  mountNode
);
```

### 箭头指向中心

设置`arrowPointAtCenter`设置气泡箭头指向元素中心

```jsx
import Tooltip from 'eview-ui/Tooltip';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const style = {
  margin: 4,
  background: '#fff',
  border: 'solid 1px #ccc',
  borderRadius: '3px',
  padding: '4px 8px',
};
const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <div>
      <div style={{textAlign: 'center'}}>
        <Tooltip placement="topLeft" content="Prompt Text" trigger={['hover', 'focus']}>
          <button style={style}>Align edge / 边缘对齐</button>
        </Tooltip>
        <Tooltip placement="topLeft" content="Prompt Text" arrowPointAtCenter trigger={['hover', 'focus']}>
          <button style={style}>Arrow points to center / 箭头指向中心</button>
        </Tooltip>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <Tooltip placement="rightTop" content="Prompt Text" trigger={['hover', 'focus']}>
            <button style={{...style, width: 16}}> 边缘对齐</button>
          </Tooltip>
          <Tooltip placement="rightTop" content="Prompt Text" arrowPointAtCenter trigger={['hover', 'focus']}>
            <button style={{...style, width: 16}}> 箭头指向中心</button>
          </Tooltip>
        </div>
        <div>
          <Tooltip placement="leftTop" content="Prompt Text" trigger={['hover', 'focus']}>
            <button style={{...style, width: 16}}> 边缘对齐</button>
          </Tooltip>
          <Tooltip placement="leftTop" content="Prompt Text" arrowPointAtCenter trigger={['hover', 'focus']}>
            <button style={{...style, width: 16}}> 箭头指向中心</button>
          </Tooltip>
        </div>
      </div>
    </div>
  </ConfigProvider>,
  mountNode
);
```

### Help Tooltip

将图标包裹`trigger`为`['hover', 'focus']`,即满足无障碍需求

```jsx
import Tooltip from 'eview-ui/Tooltip';
import Icon from 'eview-ui/Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <Tooltip content="Help text!!" arrowPointAtCenter placement="topLeft" trigger={['hover', 'focus']}>
      <Icon name="help" tabIndex={0}></Icon>
    </Tooltip>
  </ConfigProvider>,
  mountNode
);
```

### 多种颜色

## en-US

```jsx
import Tooltip from 'eview-ui/Tooltip';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#f50" trigger={['hover', 'focus']}>
        <Button text="#ff5500"></Button>
      </Tooltip>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#2db7f5" trigger={['hover', 'focus']}>
        <Button text="#2db7f5"></Button>
      </Tooltip>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#87d068" trigger={['hover', 'focus']}>
        <Button text="#87d068"></Button>
      </Tooltip>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#108ee9" trigger={['hover', 'focus']}>
        <Button text="#108ee9"></Button>
      </Tooltip>
    </div>
  </ConfigProvider>,
  mountNode
);
```

```jsx
import Tooltip from 'eview-ui/Tooltip';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const [version, theme] = getDemoVersion();

ReactDOM.render(
  // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
  <ConfigProvider version={version} theme={theme}>
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#f50" trigger={['hover', 'focus']}>
        <Button text="#ff5500"></Button>
      </Tooltip>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#2db7f5" trigger={['hover', 'focus']}>
        <Button text="#2db7f5"></Button>
      </Tooltip>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#87d068" trigger={['hover', 'focus']}>
        <Button text="#87d068"></Button>
      </Tooltip>
      <Tooltip content="Text!!" overlayStyle={{color: '#fff'}} color="#108ee9" trigger={['hover', 'focus']}>
        <Button text="#108ee9"></Button>
      </Tooltip>
    </div>
  </ConfigProvider>,
  mountNode
);
```

