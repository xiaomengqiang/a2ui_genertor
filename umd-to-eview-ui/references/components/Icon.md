# Icon 图标

> 分类：通用

Icon组件可通过配置name属性，获取组件库中的对应图标，同时支持定制图标的颜色、鼠标悬浮后的颜色、按下颜色和选中颜色。组件支持通过`iconUrl`传入自定义图片路径来显示自定义图标。aui3.1规范下额外支持`active`（按下）和`focus`（选中）两种状态及对应颜色的定制。

图标颜色状态优先级：disabled（禁用）> focus（选中）> active（按下）> hover（悬浮）> default（默认）。

> **注意**：`confirm`、`default_info`、`error`、`info`、`success`、`warn`、`confirmmd`、`infomd`、`errormd`、`warnmd`、`risk`、`high_risk`这些图标为自带颜色图标（simpleColorIcons），不受`color`、`hoverColor`、`disabledColor`、`activeColor`、`focusColor`属性影响。

## API

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|-----|-----|-----|-----|
| id | 定制组件dom元素id，传入该值可覆盖组件自动生成的id，自动生成前缀为`eui_icon_` | string | 自动生成 |
| className | 定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 | string | |
| style | 定制组件行内样式，例如：`style={{color: 'red'}}` | React.CSSProperties | |
| name | 定制图标标识名，标识名与图标名称相同，例如：`name='arrow_down'`；不传name时组件返回null | string | |
| iconUrl | 通过传入图片路径设置自定义图标，设置后图标将作为背景图（div）渲染而非SVG；例如：`iconUrl='image/huawei.png'` | string | |
| color | 定制图标的默认颜色，例如：`color='#ff0000'` | string | 主题默认色 |
| hoverColor | 定制鼠标悬浮/聚焦时图标的颜色，例如：`hoverColor='#ff0000'` | string | 主题悬浮色 |
| size | 定制图标的大小，格式为`[width, height]`，支持数字或带单位的字符串；例如：`size=[100, 100]`或`size={['1rem', '1rem']}` | number[] \| string[] | `['1rem', '1rem']` |
| disabled | 设置组件的灰化（禁用）状态 | boolean | `false` |
| disabledColor | 定制组件的灰化颜色，例如：`disabledColor='#ff0000'` | string | 主题禁用色 |
| active | 设置组件的按下状态，仅aui3.1规范支持 | boolean | |
| activeColor | 定制组件的按下颜色，仅aui3.1规范支持，例如：`activeColor='#ff0000'` | string | 主题按下色 |
| focus | 设置组件的选中状态，仅aui3.1规范支持 | boolean | |
| focusColor | 定制组件的选中颜色，仅aui3.1规范支持，例如：`focusColor='#ff0000'` | string | 主题选中色 |
| hover | 控制悬浮状态，可通过外部props强制设置hover状态 | boolean | |
| version | 传入该值可定制当前组件匹配的ucd规范，可选值：`'aui2'`、`'aui3'`、`'aui3-1'` | string | 取自ConfigProvider |
| theme | 传入该值可定制当前组件的主题模式，例如：`theme='evening'` | string | 取自ConfigProvider |
| onBlur | 失焦事件回调，**签名：**`function(event: FocusEvent) => void` | function | |
| onFocus | 聚焦事件回调，**签名：**`function(event: FocusEvent) => void` | function | |

> **注意**：组件内部默认设置`tabIndex={0}`，使图标可通过Tab键获取焦点，支持键盘无障碍访问。

### 各版本默认颜色

| 规范版本 | 默认色 | 悬浮色 | 禁用色 |
|---------|--------|--------|--------|
| aui2 | #707070 | #1B8ADB | #cccccc |
| aui2 (evening) | #eeeeee | #8bc3ff | rgba(238,238,238,0.3) |
| aui3 | #191919 | #0072e8 | rgba(25,25,25,0.3) |
| aui3 (evening) | #eeeeee | #8bc3ff | rgba(238,238,238,0.3) |
| aui3-1 | #191919 | #2E86DE | var(--color-icon-disabled) |
| aui3-1 (evening) | #DFDFDF | #5CA2E9 | var(--color-icon-disabled) |

### 图标名称映射

组件内部维护了图标名称映射表，以下名称会映射到同一图标：

| 显示名称 | 映射到 | 说明 |
|---------|--------|------|
| top_angle | arrow_up | 向上箭头 |
| bottom_angle | arrow_down | 向下箭头 |
| right_arrow | Right | 向右箭头 |
| error_close / close_active / close_hover / default_close / success_close | close | 关闭图标变体 |
| default_info / infomd | info | 信息图标变体 |
| confirmmd | confirm | 确认图标变体 |
| errormd | error | 错误图标变体 |
| warnmd | warn | 警告图标变体 |
| blue_check / check_primary | check | 勾选图标变体 |

## 使用示例

### 基本属性设置

```jsx

import Icon from 'eview-ui/Icon';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconDemo extends React.Component {

  render() {
    let divStyle = { display: "block", marginRight: "20px" };
    let labelStyle = { display: "inline-block", width: "120px" };
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={divStyle}>
            <LabelField text="Default" style={labelStyle}/>
            <Icon name='top_angle'/>
          </div>
          <div style={divStyle}>
            <LabelField text="Disabled" style={labelStyle}/>
            <Icon name='top_angle' disabled/>
          </div>
          <div style={divStyle}>
            <LabelField text="Custom color" style={labelStyle}/>
            <Icon name='top_angle' color="red" hoverColor="#3399ff"/>
          </div>
          <div style={divStyle}>
            <LabelField text="Custom Size" style={labelStyle}/>
            <Icon name='top_angle' size={['3rem', '3rem']} color="red" hoverColor="red"
                  style={{ verticalAlign: "middle" }}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<IconDemo />, mountNode);

```

### 自定义图标（iconUrl）

```jsx
import Icon from 'eview-ui/Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconUrlDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Icon iconUrl='image/custom-icon.png' size={['2rem', '2rem']} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconUrlDemo />, mountNode);
```

### aui3.1 状态图标

```jsx
import Icon from 'eview-ui/Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconStateDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = { display: 'inline-block', marginRight: '20px' };

    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <div style={divStyle}>
            <span>默认 <Icon name='top_angle' /></span>
          </div>
          <div style={divStyle}>
            <span>悬浮 <Icon name='top_angle' hover /></span>
          </div>
          <div style={divStyle}>
            <span>按下 <Icon name='top_angle' active activeColor="#ff0000" /></span>
          </div>
          <div style={divStyle}>
            <span>选中 <Icon name='top_angle' focus focusColor="#00cc00" /></span>
          </div>
          <div style={divStyle}>
            <span>禁用 <Icon name='top_angle' disabled /></span>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<IconStateDemo />, mountNode);
```

### 图标库

```jsx
import Icon from 'eview-ui/Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconLibraryDemo extends React.Component {

    render() {
        const [version, theme] = getDemoVersion();
        const aui31Icon = ['table_no_sort_default_icon', 'feedback', 'risk', 'high_risk','table_row_filter',
          'plus_circle','close_circle','back','minus_circle','move_all_up'];
        let iconSets = [
            "arrow_down",
            "arrow_up",
            "Left",
            "Right",
            "left_move",
            "right_move",
            "move_all_up",
            "back",
            "asc_sort_icon",
            "desc_sort_icon",
            "no_sort_default_icon",
            "table_no_sort_default_icon",
            "table_row_filter",
            "calender",
            "check",
            "close",
            "close_circle",
            "plus",
            "plus_circle",
            "reduce",
            "edit",
            "feedback",
            "del",
            "operation",
            "search",
            "expand",
            "minus",
            "minus_circle",
            "refresh",
            "help",
            "zoomIn",
            "zoomOut",
            "confirm",
            "info",
            "success",
            "warn",
            "error",
            "risk",
            "high_risk",
            "detail",
            "double_arrow",
            "dropArrow",
            "drop_arrow",
            "file",
            "folder",
            "hover_sort_header_icon",
            "loading",
            "star",
            "start",
            "step_icon",
            "step_icon_disabled",
            "stop",
            "tucked",
            "move",
            "reset",
            "select",
            "exportImg",
            "split",
            "clock",
            ];

        var imgArray = [];

        const itemStyle = {
            width: '150px',
            height: '60px',
            borderRight: '1px solid #e2e3e4',
            borderBottom: '1px solid #e2e3e4',
            float: 'left'
        }
        const libStyle = {
          width: '1296px',
          borderTop: '1px solid #e2e3e4',
          borderLeft: '1px solid #e2e3e4',
          overflow: 'hidden'
        }
        for (var i in iconSets) {
          const iconDom = <Icon name={iconSets[i]} size={['1rem', '1rem']} />;
          if ((version !== 'aui3-1' && !aui31Icon.includes(iconSets[i])) || version === 'aui3-1') {
            imgArray.push(
              <div key={i} style={itemStyle}>
                <p style={{ padding: '0 4rem', overflow: 'hidden' }}>
                  {iconDom}
                </p>
                <p style={{ textAlign: 'center', overflow: 'hidden' }}>{iconSets[i]}</p>
              </div>
            );
          }
        }

      return (
        <ConfigProvider version={version} theme={theme}>
          <div style={libStyle}>{imgArray}</div>
        </ConfigProvider>
      )
    }
}

ReactDOM.render(<IconLibraryDemo/>, mountNode);

```

