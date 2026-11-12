# Shade 阴影

> 分类：其他

为组件添加阴影。

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  指定阴影的id | string |  |
| className |  指定类名提到阴影 | string |  |
| width |  设置阴影的宽度 | union:<br>&nbsp;string<br>&nbsp;number<br> | 100% |
| height |  设置阴影的高度 | union:<br>&nbsp;string<br>&nbsp;number<br> | 100% |
| position | 阴影的布局方式| string | fixed |
| left | 阴影距元素的左边距离| union:<br>&nbsp;string<br>&nbsp;number<br> | 0 |
| top |  阴影距元素的顶边距离| union:<br>&nbsp;string<br>&nbsp;number<br> | 0 |
| isShow |  是否显示阴影 | bool | true |

## 接口定义

```typescript
import type { ReactNode } from 'react';

interface Shade {

  position: string;
  left: number;
  top: number;
  width: string;
  height: string;
  isShow: boolean;
  className: string;
  children: ReactNode;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Shade from 'eview-ui/Shade';
import LabelField from 'eview-ui/LabelField';

export default class ShadeExample extends React.Component {

    render() {
        const labelStyle={
            style:{
              paddingLeft:"0",
              display:"block"
            }
          };
     
        return (
            <div id="evu_Shade_example" style={{margin:"0 20px"}}>
                 <LabelField {...labelStyle} text={"Set the shade"}/>
                <Shade isShow={true} width = '80%' height ='100%' position = "relative">
                  <div style={{color:'#272727'}}>
                    这是shade内部子组件，用于展示shade样式的文本。
                    <br />
                    This is an example text for shade style.
                    <br />
                     阴影的长度和宽度是设置取决于position的值，relative是以其父组件为基准，absolute是以整个DOM的根组件为基准。
                  </div>
                </Shade>        
            </div>
        )
    }
}

ReactDOM.render(<ShadeExample />, mountNode);

```

```jsx
import Shade from 'eview-ui/Shade';
import LabelField from 'eview-ui/LabelField';

export default class ShadeExample extends React.Component {

    render() {
        const labelStyle={
            style:{
              paddingLeft:"0",
              display:"block"
            }
          };
     
        return (
            <div id="evu_Shade_example" style={{margin:"0 20px"}}>
                 <LabelField {...labelStyle} text={"Set the shade"}/>
                <Shade isShow={true} width = '80%' height ='100%' position = "relative">
                  <div style={{color:'#272727'}}>
                    这是shade内部子组件，用于展示shade样式的文本。
                    <br />
                    This is an example text for shade style.
                    <br />
                     阴影的长度和宽度是设置取决于position的值，relative是以其父组件为基准，absolute是以整个DOM的根组件为基准。
                  </div>
                </Shade>        
            </div>
        )
    }
}

ReactDOM.render(<ShadeExample />, mountNode);

```

