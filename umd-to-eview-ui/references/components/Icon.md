# Icon 图标

> 分类：通用

Icon组件可通过配置name属性，便可以获取组件库中的对应图标，同时支持定制图标的颜色，以及鼠标悬浮后的颜色。

## antd 迁移注意事项

> 迁移分类：P（保留源 Icon shim，**不迁移到本组件**）｜build-migration-plan.cjs 跳过本节（Icon 保留行走 P 类注入，与手写无关）

- 源项目 `<Icon name="...">` shim（icon-plus 在线 + Lucide 兜底）调用点**零改动**：`import Icon from '@/shared/Icon'` 路径保持；vite proxy 不动
- **不使用** eview-ui `Icon`（name 体系不同、无 catalog 匹配依据）也不使用 `SvgIcon`（文档标注废弃）、`IconButton`（废弃）
- 源项目出现 `@ant-design/icons` 具名导入时：按语义换 `<Icon name="语义名">`（icon-plus 在线名）或 Lucide 内联
- eview-ui 组件的 `leftIcon`/`rightIcon`/`icon` 类 prop 接收**图标 url 字符串**，与 Icon shim（ReactNode）类型不匹配——**不要把 Icon shim 塞进这些 prop**；带图标场景用 children 组合（如 `<Button><Icon name="x" size={14}/>{文字}</Button>`）

## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id 例如： id='IconId' | string |  |
| className |  定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 例如： className='IconClassName' | string |  |
| style |  定制组件行内样式 例如： style={{color: 'red'}} | object |  |
| name |  定制图标标识名，标识名与图标名称相同； 例如： name='arrow_down' | string |  |
| color |  定制图标颜色 例如： color='#ff0000' | string |  |
| hoverColor |  定制鼠标悬浮时图标的颜色  例如： color='#ff0000' | string |  |
| size |  定制图标的大小，不传则使用默认大小 例如： size=[100,100] | array | [16, 16] |
| disabled |  设置组件的灰化状态 | bool | false |
| disabledColor |  定制组件的灰化颜色 例如： color='#ff0000' | string |  |

## 接口定义

```typescript
interface Icon {

  /**
   * 定制组件dom元素id，传入该值可覆盖组件自动生成的id
   * 例如：
   * id='IconId'
   */
  id: string;

  /**
   * 定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式
   * 例如：
   * className='IconClassName'
   */
  className: string;

  /**
   * 定制组件行内样式
   * 例如：
   * style={{color: 'red'}}
   */
  style: object;

  /**
   * 定制图标标识名，标识名与图标名称相同；
   * 例如：
   * name='arrow_down'
   */
  name: string;

  /**
   * 通过传入路径设置自定义图标
   * iconUrl= 'image/huawei.png'
   */
  iconUrl: string;

  /**
   * 定制图标颜色
   * 例如：
   * color='#ff0000'
   */
  color: string;

  /**
   * 定制鼠标悬浮时图标的颜色
   *  例如：
   * color='#ff0000'
   */
  hoverColor: string;

  /**
   * 定制图标的大小，不传则使用默认大小<br>
   * 例如：
   * size=[100;100]
   * "confirm";"default_info";"error";"info";"success";"warn"没有鼠标悬浮颜色
   */
  size: number[];

  /**
   * 设置组件的灰化状态
   */
  disabled: boolean;

  /**
   * 定制组件的灰化颜色<br>
   * 例如：
   * color='#ff0000'
   * "confirm";"default_info";"error";"info";"success";"warn"没有灰化样式
   */
  disabledColor: string;

  onBlur: (e: FocusEvent) => unknown;

  hover: boolean;

  onFocus: (e: FocusEvent) => unknown;

  /**
   * 设置组件的按下状态，仅3.1支持
   */
  active: boolean;

  /**
   * 定制组件的按下颜色<br>
   * 例如：color='#ff0000'
   */
  activeColor: string;

  /**
   * 设置组件的选中状态，仅3.1支持
   */
  focus: boolean;

  /**
   * 定制组件的选中颜色<br>
   * 例如：color='#ff0000'
   */
  focusColor: string;

  version: string;

  theme: string;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx

import Icon from 'eview-ui/Icon';
import LabelField from 'eview-ui/LabelField';
import huaweiIcon from '@images/huawei';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconDemo extends React.Component {

  render() {
    let divStyle = { display: "block", marginRight: "20px" };
    let labelStyle = { display: "inline-block", width: "120px" };
    const [version, theme] = getDemoVersion();

    return (
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
          <div style={divStyle}>
            <LabelField text="Custom Icon" style={labelStyle}/>
            <Icon name='top_angle' size={['3rem', '3rem']} color="red" iconUrl={huaweiIcon} hoverColor="red"
                  style={{ verticalAlign: "middle" }}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<IconDemo />, mountNode);

```

```jsx

import Icon from 'eview-ui/Icon';
import LabelField from 'eview-ui/LabelField';
import huaweiIcon from '@images/huawei';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class IconDemo extends React.Component {

  render() {
    let divStyle = { display: "block", marginRight: "20px" };
    let labelStyle = { display: "inline-block", width: "120px" };
    const [version, theme] = getDemoVersion();

    return (
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
          <div style={divStyle}>
            <LabelField text="Custom Icon" style={labelStyle}/>
            <Icon name='top_angle' size={['3rem', '3rem']} color="red" iconUrl={huaweiIcon} hoverColor="red"
                  style={{ verticalAlign: "middle" }}/>
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<IconDemo />, mountNode);

```

### 图标库

## en-US



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

        const Icon_library = {
            'width': '1296px',
            'border-top': '1px solid #e2e3e4',
            'border-left': '1px solid #e2e3e4',
            'overflow': 'hidden',
        }

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

        const Icon_library = {
            'width': '1296px',
            'border-top': '1px solid #e2e3e4',
            'border-left': '1px solid #e2e3e4',
            'overflow': 'hidden',
        }

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

