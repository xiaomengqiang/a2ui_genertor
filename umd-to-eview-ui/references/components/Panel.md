# Panel 折叠面板

> 分类：数据展示

Panel组件，页面内面板常用于显示或隐藏页面信息，常用于表单页面的分组布局,可定制面板标题，标题简述，以及面板内容,配合PanelItem组件一起使用，将PanelItem标签嵌套在Panel内部使用。


## antd 迁移注意事项

> 导入特例：`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`（**必须解构**，默认导出不是 Panel 本身）

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Collapse` / `Panel` | `Panel` / `PanelItem` | **解构导入**：`import PanelE from '@cloudsop/eview-ui/Panel'; const { Panel, PanelItem } = PanelE;`；`items=[{key,label,children}]`→children `<PanelItem title>`；`defaultActiveKey`/`activeKey`（key）→**`selectedIndex`（下标数组，按顺序做 key→index 映射）**；`accordion`→**`enableMultiExpand={false}`（语义取反**：antd accordion=true 即手风琴 = eview enableMultiExpand=false）；`onChange(key)`→`onExpand(index, event)`/`onClose(index, event, collapsed)`；`destroyInactivePanel`→Panel `keepAlive`（取反）；`closable` 默认 true；**PanelItem `expanded` 是单项非受控初始态**，受控展开一律走 Panel 的 `selectedIndex` |

## API


### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id 例如： id='PanelId' | string |  |
| className |  定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 例如: className='PanelClassName' | string |  |
| style |  定制组件dom元素的样式，传入该值可追加组件自动生成的样式，从而自定义组件外观 例如: style={width:500,height:50} | object |  |
| onExpand |  自定义点击打开折叠时的回调方法，不传则无回调<br><br>**签名:**<br>`function(index: number, event: object) => void`<br>*index:* 被展开的PanelItem的下标<br>*event:* 原生dom事件 | function |  |
| onClose |  自定义点击关闭/折叠子面板时的回调方法，不传则无回调<br><br>**签名:**<br>`function(index: number, event: object, collapsed: boolean) => void`<br>*index:* 被关闭的PanelItem的下标<br>*event:* 原生dom事件（通过关闭图标触发时event为undefined）<br>*collapsed:* true表示点击标题折叠面板，false表示点击关闭图标移除面板 | function |  |
| selectedIndex |  设置默认展开的index数组,此index是传入数据数组下标 例如: selectedIndex=[0] | number[] |  |
| enableMultiExpand |  设置是否允许多个展开 | bool | false |
| keepAlive |  设置收缩时是否卸载PanelItem内容，为true时折叠时仅隐藏而非卸载 | bool | false |
| version |  支持通过version设置组件版本 | string |  |
| theme |  支持通过theme设置组件主题 | string |  |

## PanelItem
Panel的子标签和Panel一起使用。

### 属性

| 属性名称 | 描述 | 类型 | 默认值 |
|:-----|:-----|:-----|:-----|
| id |  定制组件dom元素id，传入该值可覆盖组件自动生成的id 例如： id='PanelItemId' | string |  |
| className |  定制组件dom元素className，传入该值可追加组件自动生成的className，从而自定义组件样式 例如: className='PanelItemClassName' | string |  |
| style |  定制组件样式 例如: style={width:500,height:100} | object |  |
| containerStyle |  定制组件容器样式 例如: containerStyle={width:500,height:100} | object | {} |
| containerClassName |  定制组件容器元素className，传入该值可追加组件自动生成的className 例如: containerClassName='PanelItemContainerClassName' | string |  |
| title |  定制组件标题，不传则为null 例如: title=&lt;div&gt;这是标题描述&lt;/div&gt; | any |  |
| expanded |  定制组件是否展开显示（非受控初始态），受控展开请使用Panel的selectedIndex 例如: expanded=true | bool | true |
| closable |  定制组件是否附带关闭移除功能 例如: closable=true | bool | true |
| disabled |  是否禁用面板交互 | bool | false |
| keepAlive |  收缩时是否保留内容不卸载（由Panel统一传递，也可单独设置） | bool |  |

## 使用示例

### 基本属性设置

```jsx
import PanelE from "eview-ui/Panel";
const { Panel, PanelItem } = PanelE;

<Panel
  enableMultiExpand={true}
  selectedIndex={[0]} // 默认展开的下标数组
  onExpand={(index) => {
    // index: 被展开 PanelItem 的下标
  }}
>
  <PanelItem closable={false} title={"Panel title one"}>
    <div style={{ padding: 50 }}>Fold content of panel one</div>
  </PanelItem>
  <PanelItem title={"Panel title two"}>
    <div style={{ padding: 50 }}>Fold content of panel two</div>
  </PanelItem>
  <PanelItem title={"Panel title three"}>
    <div style={{ padding: 50 }}>说明文字</div>
  </PanelItem>
</Panel>
```

### 事件处理

```jsx
import PanelE from "eview-ui/Panel";
const { Panel, PanelItem } = PanelE;

<Panel
  enableMultiExpand={true}
  selectedIndex={[0]}
  onExpand={(index) => {
    // index: 被展开 PanelItem 下标；取 index 更新 selectedIndex
  }}
  onClose={(index, event, collapsed) => {
    // collapsed: true 点击标题折叠 / false 点击关闭图标移除面板
  }}
>
  <PanelItem title={<div>Custom Title Area</div>}>
    <div style={{ padding: 50 }}>Content of My Folding Panel 1</div>
  </PanelItem>
  <PanelItem title={<div>Custom Title Area</div>}>
    <div style={{ padding: 50 }}>Content of My Folding Panel 2</div>
  </PanelItem>
</Panel>
```

