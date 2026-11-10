# ColorPicker 颜色选择器

> 分类：数据录入

颜色选择器组件，用于选择颜色。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `ColorPicker` | `ColorPicker` | `onChange`→**`onColorChange(color)`**；value '#rrggbb' 字符串 |

## API

| 属性名称      | 描述                                                  | 输入                                   | 默认  |
| :------------ | :---------------------------------------------------- | :------------------------------------- | :---- |
| value         | 绑定值                                                | string                                 |       |
| disabled      | 是否禁用                                              | boolean                                | false |
| id            | 定制组件 dom 元素 id，传入该值可覆盖组件自动生成的 id | string                                 |       |
| className     | 定制组件最外层 dom 元素 className                     | string                                 |       |
| zIndex        | 支持自定义组件弹出层的 zIndex                         | number                                 | 999   |
| style         | 自定义样式                                            | React.CSSProperties                    | -     |
| popupStyle    | 自定义弹出层样式                                      | React.CSSProperties                    | -     |
| onClick       | 定义点击组件的回调事件                                | (e: MouseEvent, color: string) => void |       |
| onCollapse    | 组件弹出层收缩时的回调事件                            | (e: MouseEvent, color: string) => void |       |
| onColorChange | 选择颜色或输入颜色等引起颜色变化的回调事件            | (color: string) => void                |       |

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import ColorPicker from 'eview-ui/ColorPicker';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CrumbsSimpleExample extends React.Component {
  state = {
    color: '#0077ee'
  };
  handleOnColorChange(color) {
    this.setState({
      color
    });
  }
  handleOnCollapse(e, color) {
    console.log('onCollapse: ', e, color);
  }
  setPrimaryColor() {
    this.setState({
      color: '#0077ee'
    });
  }
  render() {
    const [version, theme] = getDemoVersion();
    const labelStyle = { color: '#666', margin: '0.5rem 0' };
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Button text="设为主题色" onClick={() => this.setPrimaryColor()}/>
          <div style={labelStyle}>
            当前颜色：<strong>{this.state.color}</strong>
          </div>
          <ColorPicker
            id="color_pk"
            zIndex={999}
            value={this.state.color}
            onColorChange={color => this.handleOnColorChange(color)}
            onCollapse={this.handleOnCollapse}
          />
          <div style={labelStyle}>禁用状态</div>
          <ColorPicker disabled value="#0077ee"/>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<CrumbsSimpleExample />, mountNode);

```

