# CardGrid 卡片栅格

> 分类：布局

该组件对卡片进行分页展示，支持添加卡片点击方法。


## API

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|-----|-----|-----|-----|
| id |  设置CardGrid的id | string |  |
| className |  通过添加类的方式控制整个CardGrid的样式（控制最外层容器div） | string |  |
| style |  通过添加style的方式控制CardGrid网格容器的样式（应用于卡片网格区域，非单个卡片） | object |  |
| data |  支持通过data设置组件中卡片内容 例如：data =[{title:"test", icon:'iconURL',iconLabel:'Label',data:[{ key:'Owner', value:'admin' },{ key:'Update Time', value:new Date().getUTCDate() }]}, ...] | array | [] |
| enablePagination |  支持通过enablePagination设置组件卡片显示状态，enablePagination=true时，卡片分页显示，否则卡片不分页 | bool | false |
| pageSizeOptions |  分页选项 | array | [10, 20, 50, 100] |
| currentPage |  当前页码，点击分页会切换 | number | 1 |
| pageSize |  单页大小，切换分页下拉框会改变 | number | 1 |
| onCheckboxClick |  支持设置组件中卡片勾选框点击事件 <br><br>**签名:**<br>`function(data:object, isChecked:boolean, event: object) => void`<br>*data:* 所勾选卡片的data<br>*isChecked:* 勾选框是否选中<br>*event:* 该卡片勾选框change事件| func |  |
| onCardClick |  支持设置组件中卡片点击事件 <br><br>**签名:**<br>`function(data:object, event: object) => void`<br>*data:* 所点击卡片的data<br>*event:* 点击卡片的click事件| func |  |
| version |  支持通过version设置组件版本 | string |  |
| theme |  支持通过theme设置组件主题 | string |  |

## 接口定义

```typescript
import type { MouseEvent } from 'react';

interface CardGridDataItem {
  title: string;
  icon: string;
  iconLabel: string;
  data: Array<{ key: string; value: any }>;
}

interface CardGrid {

  id: string;
  className: string;
  style: React.CSSProperties;
  data: CardGridDataItem[];
  onCheckboxClick: (data: CardGridDataItem, isChecked: boolean, e: MouseEvent<HTMLSpanElement>) => unknown;
  onCardClick: (data: CardGridDataItem, e: MouseEvent<HTMLDivElement>) => unknown;
  enablePagination: boolean;
  pageSizeOptions: number[];
  currentPage: number;
  pageSize: number;

  version: string;

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
    console.log('卡片点击:', data);
  }

  handleCheckboxClick = (data, isChecked, evt) => {
    console.log('勾选框点击:', data, '是否选中:', isChecked);
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

### 样式与主题

通过 className、style、version 和 theme 控制组件外观

```jsx
import CardGrid from 'eview-ui/CardGrid';
import titleIcon from '@images/title_Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CardGridStyleExample extends React.Component {

  getData = () => {
    let dataRes = [];
    for(let i = 0; i < 6; i++) {
      let dataObj = {
        title:"Card Title " + i,
        icon: titleIcon,
        iconLabel:'Label',
        data:[
          { key:'Type', value:'file' },
          { key:'Owner', value:'admin' }
        ]
      }
      dataRes.push(dataObj);
    }
    return dataRes;
  }

  render() {
    const [version, theme] = getDemoVersion();

    return (
      <ConfigProvider version={version} theme={theme}>
        <CardGrid
          className='custom-card-grid'
          style={{ marginTop: '10px' }}
          version='aui3'
          theme='theme_dark'
          data={this.getData()}
        />
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<CardGridStyleExample />,
  mountNode,
);

```

### 不分页模式

enablePagination 为 false 时不分页，所有卡片同时展示

```jsx
import CardGrid from 'eview-ui/CardGrid';
import titleIcon from '@images/title_Icon';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class CardGridNoPageExample extends React.Component {

  getData = () => {
    let dataRes = [];
    for(let i = 0; i < 8; i++) {
      let dataObj = {
        title:"Card Title " + i,
        icon: titleIcon,
        iconLabel:'Label',
        data:[
          { key:'Status', value:'active' },
          { key:'Count', value: i * 10 }
        ]
      }
      dataRes.push(dataObj);
    }
    return dataRes;
  }

  render() {
    const [version, theme] = getDemoVersion();

    return (
      <ConfigProvider version={version} theme={theme}>
        <CardGrid
          data={this.getData()}
          onCardClick={(data, evt) => console.log(data)}
        />
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<CardGridNoPageExample />,
  mountNode,
);

```

