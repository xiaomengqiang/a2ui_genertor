# CardGrid 卡片栅格

> 分类：布局

该组件对卡片进行分页展示，支持添加卡片点击方法。


## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| id |  设置CardGrid的id | string |  |
| className |  通过添加类的方式控制整个CardGrid的样式（控制最外层div） | string |  |
| style |  通过添加style的方式控制整个CardGrid组件中每个Card的样式  | object |  |
| title |   | any |  |
| data |  支持通过data设置组件中卡片内容 例如：data =[{title:"test", icon:'iconURL',iconLabel:'Label',data:[{ key:'Owner', value:'admin' },{ key:'Update Time', value:new Date().getUTCDate() }]}, ...] | array | [] |
| enablePagination |  支持通过enablePagination设置组件卡片显示状态，enablePagination=true时，卡片分页显示，否则卡片不分页 | bool | false |
| pageSizeOptions |  分页选项 | array | [10, 20, 50, 100] |
| currentPage |  当前页码，点击分页会切换 | number | 1 |
| pageSize |  单页大小，切换分页下拉框会改变 | number | 1 |
| onCheckboxClick |  支持设置组件中卡片勾选框点击事件 <br><br>**签名:**<br>`function(data:object, event: object) => void`<br>*data:* 所勾选卡片的data<br>*event:* 该卡片勾选框onCheckboxClick事件| func |  |
| onCardClick |  支持设置组件中卡片点击事件 <br><br>**签名:**<br>`function(data:object, event: object) => void`<br>*data:* 所点击卡片的data<br>*event:* 点击卡片的onCardClick事件| func |  |

## 接口定义

```typescript
import type { ChangeEvent } from 'react';

interface CardGrid {

  id: string;
  title: any;
  className: string;
  style: object;
  data: any;
  onCheckboxClick: (data: any, isChecked: boolean, e: ChangeEvent<HTMLSpanElement>) => unknown;
  onCardClick: (data: any, e: ChangeEvent<HTMLSpanElement>) => unknown;
  enablePagination: boolean;
  pageSizeOptions: any;
  currentPage: number;
  pageSize: number;

  /**
   * 支持通过version设置组件版本.
   */
  version: string;

  /**
   * 支持通过theme设置组件主题.
   */
  theme: string;

}

export type Props = Partial<CardGrid>;
```

## 使用示例

### 事件处理

事件处理

```jsx
import CardGrid from 'eview-ui/CardGrid';
import titleIcon from '@images/title_Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CardGridExample extends React.Component {

  getData = () => {
    let dataRes = [];
    for(let i = 0; i < 20; i++) {
      let dataObj  =  {
        title:"Card Title "+ i,
        icon: titleIcon,
        iconLabel:'Label',
        data:[
          { key:'Storage Type', value:'file' },
          { key:'Owner', value:'admin' },
          { key:'Update Time', value:new Date().getUTCDate() }
        ]
      }
      dataRes.push(dataObj);
    }
    return dataRes;
  }

  handleCardClick = (data, evt) => {
    console.log(data);
  }

  handleCheckboxClick = (data, evt) => {
    console.log(data);
  }

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="eui_card_example">
          <CardGrid
            id='cardGrid'
            enablePagination
            currentPage={1}
            pageSize={10}
            pageSizeOptions={[2, 5, 10]}
            data={this.getData()}
            onCardClick={this.handleCardClick}
            onCheckboxClick={this.handleCheckboxClick}
          />
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<CardGridExample />,
  mountNode,
);

```

