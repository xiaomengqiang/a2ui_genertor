# Crumbs 面包屑

> 分类：导航

这是面包屑组件，显示当前页面路径，可定制面包屑路径文本，可定制面包屑路径是否为链接，可定制面包屑分割图标，支持点击回调。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Breadcrumb` | `Crumbs` | **`items`→`data`**；项 `{title, url?, enable?, icon?}`（`href`/`path`→**`url`**；**`enable: false` 不可点击**，默认 true）；**`separator`→`seprator`（官方拼错，将错就错，残留正确英文 separator 即未迁移）**；头部标题 `title`；`onClick(url, event)` 组件级（非每项）；**`<Breadcrumb.Item>` JSX 子元素形态→拍平 `data=[{title:'xxx'}]` 数组**；最后一项不传 `url` 即当前页 |

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id 例如： id='crumbsId' | string |  |
| className |  定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 例如： className='crumbsClassName' | string |  |
| title |  传入该值可定制面包屑头部标题，不传则默认不需要标题 例如： title='当前位置' | string |  |
| seprator |  自定义分隔符 | string | > |
| data |  必填项，面包屑配置数据 array<{  url?: string;title: string;enable?: boolean;icon?: string;style?:CSSProperties}> |  | enable默认为true |
| style |  自定义面包屑组件最外层样式，例如：style={{padding:'2rem'}} | object |  |
| onClick |  定义带有链接的面包屑点击事件的回调方法<br><br>**签名:**<br>`function(url: string, event: object) => void`<br>*url:* 触发点击事件的目标元素的url属性.<br>*event:* dom原生事件. | function |  |
| itemStyle | 项 style  （0.1.x 版本支持) | CSSProperties | |
| sepratorStyle | 分隔符style  （0.1.x 版本支持)  | CSSProperties |

## 使用示例

### 基本属性设置

基本属性设置

```jsx
import Crumbs from "eview-ui/Crumbs";

const data = [
  { title: "Security", url: "#/Crumbs1" },
  { title: "Firewall", url: "#/Crumbs2" },
  { title: "Site-FW", url: "#/Crumbs3" },
  { title: "URL Filter" }, // 最后一项不传 url 即当前页
];

<Crumbs data={data} />

// seprator 自定义分隔符（注意是 seprator 拼写）
<Crumbs title="自定义分隔符" data={data} seprator="/" />
```

### 事件处理

事件处理

```jsx
import Crumbs from "eview-ui/Crumbs";

const data = [
  { title: "Security", url: "#/Crumbs" },
  { title: "Firewall" },
  { title: "Site-FW", url: "#/Crumbs", enable: false }, // enable: false 不可点击
  { title: "URL Filter" },
];

// onClick(url, event)：url 是被点击项的 url
<Crumbs
  title="Create URL Filter"
  onClick={(url, event) => {
    // url 是触发点击项的 url 属性
  }}
  data={data}
/>
```

### 带图标的

设置`data`中的`icon`可以设置图标

```jsx
import Crumbs from "eview-ui/Crumbs";

// data 项 icon 收图片 url 字符串
const data = [
  { title: "Security", url: "#/Crumbs", icon: "nav_form_active_url" }, // 图标 url
  { url: "#/Crumbs", icon: "nav_msg_active_url" }, // 图标 url
  { title: "URL Filter", icon: "nav_heart_active_url" }, // 图标 url
];

<Crumbs data={data} />
```

