# Rating 评分

> 分类：数据录入

评分组件。

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  设置rating的id | string |  |
| className |  通过自定义class改变rating的整体样式，作用于最外层div 例如： margin、padding、font | string |  |
| value |  设置rating的值 | number | 0 |
| starCount |  设置rating的最大值 | number | 5 |
| disabled |  设置rating是否灰化 | bool | false |
| half |  设置rating是否支持半星评分 | bool | false |
| allowClear |  是否允许再次点击后清除 | bool | false |
| starColor |  设置rating选中的颜色 | string | '#fed900' |
| emptyStarColor |  设置rating未选中的颜色 | string | '#808080' |
| iconName |  通过传入name的方式，使用组件库中的已有图标 | string |  |
| size |  设置图标的大小 | number | FontUtil.convertRemToPx(2) |
| onClick |  设置rating的点击事件 | function(event, value: number) |  |

## 接口定义

```typescript
interface Rating {


  /**
   * 设置rating的id
   */
  id: string;

  /**
   * 通过自定义class改变rating的整体样式，作用于最外层div
   * 例如： margin、padding、font
   */
  className: string;

  /**
   * 设置rating的值
   */
  value: number;

  /**
   * 设置rating的最大值
   */
  starCount: number;

  /**
   * 设置rating是否灰化
   */
  disabled: boolean;

  /**
   * 设置rating是否支持半星评分
   */
  half: boolean;

  /**
   * 是否允许再次点击后清除
   */
  allowClear: boolean;

  /**
   * 设置rating选中的颜色
   */
  starColor: string;

  /**
   * 设置rating未选中的颜色
   */
  emptyStarColor: string;

  /**
   * 通过传入name的方式，使用组件库中的已有图标
   */
  iconName: string;

  /**
   * 设置图标的大小
   */
  size: number;

  /**
   * 设置rating的点击事件
   */
  onClick: (e: MouseEvent, value: number) => unknown;

  onMouseOver: (e: MouseEvent, index: number) => unknown;

  onMouseLeave: (e: MouseEvent, index: number) => unknown;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Rating from 'eview-ui/Rating';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class RatingExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = { margin: '20px 0px 50px 20px' };
    const labelStyle = { display: 'block', fontSize: '14px', marginBottom: '10px', paddingLeft: '0px' };
    return (
      <ConfigProvider version={version} theme={theme}>
        <div id='evu_rating_example'>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Default Size</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={false}
              half={false}
              iconName='star'></Rating>
          </div>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Basic Rating</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={false}
              half={false}
              iconName='star'
              size={32}></Rating>
          </div>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Half Rating</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={false}
              half={true}
              iconName='star'
              size={32}></Rating>
          </div>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Disabled Rating</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={true}
              half={false}
              iconName='star'
              size={24}></Rating>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<RatingExample />, mountNode);

```

```jsx
import Rating from 'eview-ui/Rating';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class RatingExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    const divStyle = { margin: '20px 0px 50px 20px' };
    const labelStyle = { display: 'block', fontSize: '14px', marginBottom: '10px', paddingLeft: '0px' };
    return (
      <ConfigProvider version={version} theme={theme}>
        <div id='evu_rating_example'>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Default Size</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={false}
              half={false}
              iconName='star'></Rating>
          </div>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Basic Rating</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={false}
              half={false}
              iconName='star'
              size={32}></Rating>
          </div>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Half Rating</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={false}
              half={true}
              iconName='star'
              size={32}></Rating>
          </div>
          <div style={divStyle}>
            <LabelField style={labelStyle}>Disabled Rating</LabelField>
            <Rating
              value={3}
              starCount={5}
              disabled={true}
              half={false}
              iconName='star'
              size={24}></Rating>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<RatingExample />, mountNode);

```

