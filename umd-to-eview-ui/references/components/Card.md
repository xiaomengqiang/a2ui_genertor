# Card 卡片

> 分类：数据展示

卡片组件，支持通过type设置resource/detail/add三种类型，支持添加图标、标题、内容和下拉菜单，自定义样式。



## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Card` | `Card` | `type="resource"/"detail"/"add"`；`title` 同名（不传不显示）；`icon` 是 url 字符串；`content=[{text, value}]` 数组（卡片正文键值）；`menuData` 右上菜单（`onMenuItemClick`）；antd `extra`/`actions` 无对应（手写 children）；复杂卡片手写 div 更稳 |

## API

### 属性

| 属性名称              | 描述 | 输入 | 默认 |
|-------------------|----|-----|-----|
| id                |  设置Card的id | string |  |
| className         |  通过添加类的方式控制整个Card的样式（控制最外层div） 可控制：margin、padding | string |  |
| style             |  通过添加style的方式控制整个Card组件的样式（控制最外层div） 可控制：margin、padding 例如：style={{margin:"0px"}} | React.CSSProperties |  |
| icon              |  支持通过icon的url,设置组件的图标，不设置则默认不显示 例如：icon='./confirm.svg' | string |  |
| title             |  通过title设置组件标题，title默认值为null 如果不传title，则不显示title | any |  |
| titleStyle        |  title样式定制 | React.CSSProperties | {} |
| content           |  支持通过content设置组件内容 例如：content =[{ <br>text: "ID", // 必填，控制组件内容区域文本提示 <br>value: "test-node", // 必填，控制文本对应的值 <br> }, ...] | array |  |
| type              |  支持通过type设置组件类型 | enum:<br>&nbsp;'resource'<br>&nbsp;'detail'<br>&nbsp;'add'<br> | "detail" |
| selected          |  支持通过selected设置组件选中状态，selected=true时，组件外边框变色，否则保持不变 selected属性仅支持type=detail,resource两种类型，type=add时selected不起作用 | bool | false |
| menuTitle         |  设置下拉菜单的标题文本 | string |  |
| menuItemStyle     |  通过添加style的方式，设置组件下拉列表项的样式,作用于下拉的最外层div,可通过后代选择器控制下拉项的样式 | React.CSSProperties |  |
| menuItemClassName |  通过添加class的方式，设置组件下拉列表项的样式,作用于下拉的最外层div,可通过后代选择器控制下拉项的样式 | string |  |
| menuPosition      |  设置下拉菜单的位置 | enum:<br>&nbsp;'left'<br>&nbsp;'right'<br> | 'right' |
| menuData          |  支持通过menuData设置子组件下拉菜单数据 例如：menuData = [ <br/>{ <br/>text: "China",  //下拉菜单项展示值 <br/>value: 1        //菜单项存取值，点击时作为回调参数传入 <br/>},{...}]; | array |  |
| enableAdd         |  支持通过enableAdd设置组件底部添加按钮是否显示（仅在type="resource"且title不为空时有效） | bool | false |
| onAdd             |  支持设置组件onAdd添加事件： <br/>1.type=resource时，点击底部+号按钮添加事件； <br/>2.type=add时，组件+号点击添加事件；<br><br>**签名:**<br>`function() => void`<br>回调函数无参数 | function |  |
| onMenuItemClick   |  支持设置菜单子组件的onClick事件<br><br>**签名:**<br>`function(text: string, value: any) => void`<br>*text* ：菜单项的text属性<br>*value* ：菜单项的value属性 | function |  |
| version           |  aui版本 | string |  |
| theme             |  主题 | string |  |

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import Card from 'eview-ui/Card';

const detailContent = [
  { text: 'ID', value: 'test-node' },
  { text: 'Partitions', value: 'Root Partition' },
  { text: 'Create time', value: '2016-07-03 GMT + 08:00' },
];

const resourceContent = [
  { text: 'Indicators', value: '8' },
  { text: 'Alarm', value: '9' },
];

const options = [
  { text: 'China', value: 1 },
  { text: 'UK', value: 2 },
  { text: 'USA', value: 3 },
];

// type='resource'，不传 title 则不显示标题
<Card
  type="resource"
  content={[{ text: 'CPU USage', value: '18%' }]}
  icon="cloud" // 图片 url
  style={{ marginRight: '20px' }}
/>;

// type='resource'，设置 title
<Card
  icon="cloud" // 图片 url
  title="Elastic cloud host"
  content={resourceContent}
  enableAdd={false}
  type="resource"
  style={{ marginRight: '20px' }}
/>;

// type='resource'，enableAdd={true} + selected（selected 仅 detail/resource 生效）
<Card
  icon="cloud" // 图片 url
  title="Elastic cloud host"
  content={resourceContent}
  enableAdd={true}
  type="resource"
  selected={true}
  style={{ marginRight: '20px' }}
/>;

// type='detail' + menuData 下拉菜单
<Card
  title="Default-VPC"
  content={detailContent}
  type="detail"
  menuTitle="Options"
  menuData={options}
  selected={true}
  style={{ marginRight: '20px' }}
/>;

// type='add'
<Card type="add" />
```

### 事件处理

事件处理

```jsx
import Card from 'eview-ui/Card';

const detailContent = [
  { text: 'ID', value: 'test-node' },
  { text: 'Available partitions', value: '1' },
  { text: 'Create time', value: '2016-07-03 GMT + 08:00' },
];

const resourceContent = [
  { text: 'Indicators', value: '8' },
  { text: 'Alarm', value: '9' },
];

const options = [
  { text: 'China', value: 1 },
  { text: 'UK', value: 2 },
  { text: 'USA', value: 3 },
];

// onAdd：type='resource' 时点击底部 + 号触发（需 enableAdd={true}）
<Card
  icon="cloud" // 图片 url
  title="Elastic cloud host"
  content={resourceContent}
  enableAdd={true}
  selected={true}
  type="resource"
  onAdd={() => {
    // 回调无参数
  }}
  style={{ marginRight: '20px' }}
/>;

// onMenuItemClick(text, value)
<Card
  title="Default-VPC"
  content={detailContent}
  type="detail"
  menuTitle="Options"
  selected={true}
  menuData={options}
  menuItemStyle={{ width: '200px' }}
  onMenuItemClick={(text, value) => {
    // text: 菜单项 text, value: 菜单项 value
  }}
  style={{ marginRight: '20px' }}
/>;

// type='add' 的 onAdd：点击整个 + 号组件触发
<Card
  type="add"
  onAdd={() => {
    // 回调无参数
  }}
/>
```

