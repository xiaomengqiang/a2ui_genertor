# Tab 页签

> 分类：导航

该标签配合TabItem标签一同使用，将TabItem嵌套在Tab内，具体页签的内容在TabItem内进行书写,同时支持标签的动态添加与删除，可自定义标签是否可关闭，支持标签切换时的回调。


## antd 迁移注意事项

> 导入特例：`import Tab, { TabItem } from '@cloudsop/eview-ui/Tab'`（TabItem 具名导出）

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Tabs` / `TabPane` | `Tab` / `TabItem` | **TabItem children 驱动**（`<Tab><TabItem title>内容</TabItem></Tab>`，**无 data/items prop**）；`activeKey`→**`selectedIndex`（数字下标，不是 key！）**——key→index 需映射；**切换回调是 `onClick(index, title, event)`（不是 onChange）**；`onClose(index, event, title)`；**`draggable` 默认 true**（不需要要显式 false）；TabItem：`title`/`closable`/`disabled`/`icon`（url 字符串）；`tabBarExtraContent` 无对应（手写）；**遍历生成 TabItem 时数据源必须判空兜底**（`(tabs |

## API

### 属性

| 属性名称               | 描述                                                                                                                                                                        | 输入                                                                          | 默认     |
|:-------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------|:-------|
| id                 | 设置Tab的id                                                                                                                                                                  | string                                                                      |        |
| selectedIndex      | 设置选中的index,此index是传入数据数组下标                                                                                                                                                | number                                                                      | 0      |
| disabled           | tab全体禁用                                                                                                                                                                   | bool                                                                        | false  |
| hover              | 用hover切换tab页                                                                                                                                                              | bool                                                                        | false  |
| className          | 通过自定义class来自定义Tab的整体样式 例如：margin、padding                                                                                                                                  | string                                                                      |        |
| style              | 通过自定义style来自定义Tab的整体样式 例如：margin、padding                                                                                                                                  | object                                                                      |        |
| type               | 设置页签的类型，default代表是基础页签，也是默认类型，sub表示选项卡页签;<br>page是页面级分割页签:<br>1.仅在3.1及以上版本支持<br>2.仅支持配置一种位置：position=top<br>3.不支持配置删除单个页签的功能                                              | enum:<br>&nbsp;"main"<br>&nbsp;"sub"<br>&nbsp;"page"                        | "main" |
| position           | Set the position/alignment of the tabs，default indicates the top alignment of the tab and it's content                                                                    | enum:<br>&nbsp;"top"<br>&nbsp;"bottom"<br>&nbsp;"left"<br>&nbsp;"right"<br> | "top"  |
| lazyLoad           | 设置是否在页签激活时动态加载内容，默认首次渲染时全部加载                                                                                                                                              | bool                                                                        | false  |
| draggable          | 默认情况下，Tab项是可拖动的。将此属性设置为false以使tab-items不可拖动示例：draggable = {false}                                                                                                         | bool                                                                        | true   |
| onClick            | 设置Tab页签的切换回调事件<br><br>**签名:**<br>`function(index: number, title: string, event: object) => void`<br>*index:* 被选中的页签在用户传入数组中的index<br>*title:* tabName<br>*event:* event事件 | function                                                                    |        |
| onClose            | 设置Tab是否可以关闭<br><br>**签名:**<br>`function(index: number, event: object, title: string) => void`<br>*index:* 被选中的页签在用户传入数组中的index<br>*event:* event事件<br>*title:* tabName    | function                                                                    |        |
| isAutoClose        | 设置Tab在onClose为true时是否可删除tab                                                                                                                                               | bool                                                                        | true   |
| alwaysShowIcon     | 配合TabItem的icon属性一起使用。当tabItem数量过多时，是否显示收起的tabItem中的图标                                                                                                                     | boolean                                                                     | false  |
| confirmBeforeLeave | 点击切换tab的回调函数,该回调函数返回一个Promise表示是否允许切换                                                                                                                                     | function                                                                    | false  |
| isShowCloseBtns    | 是否展示删除popOver，设为true，右侧会出现一个按钮，点击弹出popOver，可按需删除Tab元素（待废弃API）                                                                                                             | boolean                                                                     | false  |
| showAddButton      | 是否显示添加，注意：1.需要业务保证页签长度展示，不能在超长场景下继续添加；2.仅ICT 3.1以上风格生效；3.position为left或者right时不生效                                                                                                                           | boolean                                                                     | false  |
| onAddClick         | 添加Tab 页签回调方法，和showAddButton对应                                                                                                                                             | function                                                                    | —      |

## TabItem

TabItem是Tab的子标签和Tab标签一起使用。


| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| title |  tab的标题内容 | string |  |
| closable |  页签是否可关闭 | bool | false |
| disabled |   该属性用于设置页签的使能状态。 | bool | false |
| icon |  页签项的图标。并在此处设置图标的绝对路径。 | string |  |
| setEditing |  该属性用于启用或禁用页签的编辑。| bool | false |
| tabItemStyle |  设置页签标题的样式（比如字体大小、颜色） | object |  |
| tips |  提示内容 | string |  |

## 接口定义

```typescript
import type { MouseEvent, ReactNode } from 'react';

interface TabItemProps {


  /**
   * 设置TabItem的id
   */
  id: string;

  /**
   * tab的标题内容
   */
  title: string;

  /**
   * tab的标题内容
   */
  tips: string;

  /**
   * 设置标签是否可关闭
   */
  closable: boolean;

  /**
   * 设置Tab的灰化状态
   */
  disabled: boolean;

  /**
   * 用hover切换tab
   */
  hover: boolean;

  /**
   * Tab icon
   */
  icon: string;

  /**
   * setEditing for tab
   */
  setEditing: boolean;

  /**
   * set styling for tab header (font size, color etc..)
   */
  tabItemStyle: object;

  /**
   * tab标题的最大长度
   */
  titleLength: number;

  index: number;

  onClick: (e: MouseEvent<HTMLSpanElement>, index?: number, title?: string) => unknown;

  onKeyDown: any;

  onClose: (e: MouseEvent<HTMLSpanElement>, index?: number, title?: string) => unknown;

  bar: boolean;

  className: string;

}

export interface TabContentProps {
  className: string;
  style: object;
  lazyLoad: boolean;
  selectedIndex: number;
  itemStatus: boolean[];
  contentChildren: any;
  position: string;
}

interface Tab {

  /**
   * 设置Tab的id
   */
  id: string;

  /**
   * 设置选中的index,此index是传入数据数组下标
   */
  selectedIndex: number;

  /**
   * 通过自定义class来自定义Tab的整体样式
   * 例如：margin、padding
   */
  className: string;

  /**
   * 禁用所有Tab
   */
  disabled: boolean;

  /**
   * 用hover切换tab
   */
  hover: boolean;

  /**
   * 通过自定义style来自定义Tab的整体样式
   * 例如：margin、padding
   */
  style: object;

  /**
   * 设置页签的类型，default代表是一级页签，也是默认类型，sub表示二级页签
   */
  type: 'main' | 'sub';

  /**
   * set the alignment and the position of the tab
   */
  position: 'top' | 'bottom' | 'left' | 'right';

  /**
   * tab标题的最大长度
   */
  titleLength: number;

  /**
   * 设置是否在页签激活时动态加载内容，默认首次渲染时全部加载
   */
  lazyLoad: boolean;

  /**
   * 设置Tab页签的切换回调事件
   *
   * @param {number} index 被选中的页签在用户传入数组中的index
   * @param {object} event event事件
   */
  onClick: (index: string, title: string, e: MouseEvent<HTMLSpanElement>) => unknown;

  /**
   * 设置Tab是否可关闭
   *
   *  @param {number} index 被选中的页签在用户传入数组中的index
   *  @param {object} event event事件
   */
  onClose: (index: number, e: MouseEvent<HTMLSpanElement>, title: string) => unknown;

  /**
   * set tab items draggable or not
   */
  draggable: boolean;

  /**
   * set tab items AutoClose or not
   */
  isAutoClose: boolean;

  /**
   * 设置是否显示关闭选中，其他，所有等按钮 （专用能力，不对外提供）
   */
  isShowCloseBtns: boolean;

  /**
   * 是否通过其他元素关闭TabItem,默认为false
   */
  isCloseByTabIds: boolean;

  /**
   * Tab标签页关闭前手动触发
   */
  onBeforeClose: (ids: string[]) => unknown;

  /**
   * 通过控制tabIds关闭后的回调
   */
  onCloseByTabIds: (tabIds: string[], ids: number) => unknown;

  children: ReactNode;

  tabContentStyle: object;

  tabContentClassName: string;

  tabTitleStyle: object;

  tabTitleClassName: string;


  /**
   * tab数量过多时，是否显示收起的tab图标，默认TabItem过多时，收起的TabItem中不显示图标。
   */
  alwaysShowIcon: boolean;

  /**
   * 支持通过version设置组件版本.
   */
  version: string;

  /**
   * 支持通过theme设置组件主题.
   */
  theme: string;

  confirmBeforeLeave: () => Promise<any>;

}

export type OptionalProps = Partial<TabItemProps>;

export type TabProps = Partial<Tab>;
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import LabelField from 'eview-ui/LabelField';
import create_default from "@images/create_default";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const TabContent = (props)=>{
  const { content } = props;

  return (
    <div style={{ padding: '1rem' }}>
      {content}
    </div>
  );
}

export default class TabExample extends React.Component {

  handleClose = (index, e, title) => {
    console.log("Tab Close event: ", index, e, title);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = {display: "block", paddingLeft: "0px"};
    let contanierStyle = { width:'48%',border: '1px solid #f5f5f5',marginRight: '2rem',padding:'1rem'};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>

        <div id="evu_Tab_example" style={{margin: "0 20px"}}>
          <div style={{display:"flex"}}>
          <div style={contanierStyle}>
            <LabelField style={labelStyle}>默认Tab</LabelField>
            <Tab showAddButton={ version==='aui3-1' }>
              <TabItem title="Home">
                <TabContent content={'Home'}/>
              </TabItem>
              <TabItem title="Profile">
                <TabContent content={'Profile'}/>
              </TabItem>
              <TabItem title="Messages" disabled={true}>
                <TabContent content={'Messages'}/>
              </TabItem>
              <TabItem title="Settings">
                <TabContent content={'Settings'}/>
              </TabItem>
            </Tab>

            <LabelField style={labelStyle}>默认Tab：自定义图标、自定义width(超出width，显示...)</LabelField>
            <Tab style={{width: "350px"}}>
              <TabItem title="Home" icon={create_default}>
                <TabContent content={'Home'}/>
              </TabItem>
              <TabItem title="Profile" closable={true}>
                <TabContent content={'Profile'}/>
              </TabItem>
              <TabItem title="Messages" disabled={true}>
                <TabContent content={'Messages'}/>
              </TabItem>
              <TabItem title="Settings" icon={create_default}>
                <TabContent content={'Settings'}/>
              </TabItem>
              <TabItem title="loading">
                <TabContent content={'loading'}/>
              </TabItem>
            </Tab>
          </div>

          <div style={contanierStyle}>
            <LabelField style={labelStyle}>选项卡页签：type='sub'</LabelField>
            <Tab type="sub" selectedIndex={1} showAddButton={ version==='aui3-1' }>
              <TabItem title="Basic Setting">
                <TabContent content={'Basic Setting'}/>
              </TabItem>
              <TabItem title="Bandwidth">
                <TabContent content={'Bandwidth'}/>
              </TabItem>
              <TabItem title="Mirror" disabled={true}>
                <TabContent content={'Mirror'}/>
              </TabItem>
              <TabItem title="C&E">
                <TabContent content={'C&E'}/>
              </TabItem>
            </Tab>

            <br/>
            <br/>
            <LabelField style={labelStyle}>选项卡页签：自定义图标、自定义width(超出width，显示...)</LabelField>
            <Tab type="sub" selectedIndex={1} style={{width: "350px"}} isAutoClose={true} onClose={this.handleClose}>
              <TabItem title="Basic Setting" icon={create_default}>
                <TabContent content={'Basic Setting'}/>
              </TabItem>
              <TabItem title="Bandwidth" closable={true}>
                <TabContent content={'Bandwidth'}/>
              </TabItem>
              <TabItem title="Mirror" disabled={true}>
                <TabContent content={'Mirror'}/>
              </TabItem>
              <TabItem title="C&E">
                <TabContent content={'C&E'}/>
              </TabItem>
            </Tab>
          </div>
        </div>

          <div style={{ border: '1px solid #f5f5f5', padding:'1rem',marginTop:'1rem'}}>
          <LabelField style={labelStyle}>分割式页签：type='page'，仅3.1及以上版本支持</LabelField>
          <Tab type="page" selectedIndex={1} showAddButton={ version==='aui3-1' }>
            <TabItem title="Basic Setting">
              <TabContent content={'Basic Setting'}/>
            </TabItem>
            <TabItem title="Bandwidth">
              <TabContent content={'Bandwidth'}/>
            </TabItem>
            <TabItem title="Mirror" disabled={true}>
              <TabContent content={'Mirror'}/>
            </TabItem>
            <TabItem title="C&E">
              <TabContent content={'C&E'}/>
            </TabItem>
          </Tab>

          <LabelField style={labelStyle}>分割式页签：自定义图标、自定义width(超出width，显示...)</LabelField>
          <Tab type="page" selectedIndex={1} style={{width: "400px"}} isAutoClose={true} onClose={this.handleClose}>
            <TabItem title="Basic Setting" icon={create_default}>
              <TabContent content={'Basic Setting'}/>
            </TabItem>
            <TabItem title="Bandwidth" closable={true}>
              <TabContent content={'Bandwidth'}/>
            </TabItem>
            <TabItem title="Mirror" disabled={true}>
              <TabContent content={'Mirror'}/>
            </TabItem>
            <TabItem title="C&E">
              <TabContent content={'C&E'}/>
            </TabItem>
          </Tab>
        </div>
        </div>

      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabExample />, mountNode);

```

```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import LabelField from 'eview-ui/LabelField';
import create_default from "@images/create_default";
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

const TabContent = (props)=>{
  const { content } = props;

  return (
    <div style={{ padding: '1rem' }}>
      {content}
    </div>
  );
}

export default class TabExample extends React.Component {

  handleClose = (index, e, title) => {
    console.log("Tab Close event: ", index, e, title);
  };

  render() {
    const [version, theme] = getDemoVersion();
    let labelStyle = {display: "block", paddingLeft: "0px"};
    let contanierStyle = { width:'48%',border: '1px solid #f5f5f5',marginRight: '2rem',padding:'1rem'};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>

        <div id="evu_Tab_example" style={{margin: "0 20px"}}>
          <div style={{display:"flex"}}>
          <div style={contanierStyle}>
            <LabelField style={labelStyle}>默认Tab</LabelField>
            <Tab showAddButton={ version==='aui3-1' }>
              <TabItem title="Home">
                <TabContent content={'Home'}/>
              </TabItem>
              <TabItem title="Profile">
                <TabContent content={'Profile'}/>
              </TabItem>
              <TabItem title="Messages" disabled={true}>
                <TabContent content={'Messages'}/>
              </TabItem>
              <TabItem title="Settings">
                <TabContent content={'Settings'}/>
              </TabItem>
            </Tab>

            <LabelField style={labelStyle}>默认Tab：自定义图标、自定义width(超出width，显示...)</LabelField>
            <Tab style={{width: "350px"}}>
              <TabItem title="Home" icon={create_default}>
                <TabContent content={'Home'}/>
              </TabItem>
              <TabItem title="Profile" closable={true}>
                <TabContent content={'Profile'}/>
              </TabItem>
              <TabItem title="Messages" disabled={true}>
                <TabContent content={'Messages'}/>
              </TabItem>
              <TabItem title="Settings" icon={create_default}>
                <TabContent content={'Settings'}/>
              </TabItem>
              <TabItem title="loading">
                <TabContent content={'loading'}/>
              </TabItem>
            </Tab>
          </div>

          <div style={contanierStyle}>
            <LabelField style={labelStyle}>选项卡页签：type='sub'</LabelField>
            <Tab type="sub" selectedIndex={1} showAddButton={ version==='aui3-1' }>
              <TabItem title="Basic Setting">
                <TabContent content={'Basic Setting'}/>
              </TabItem>
              <TabItem title="Bandwidth">
                <TabContent content={'Bandwidth'}/>
              </TabItem>
              <TabItem title="Mirror" disabled={true}>
                <TabContent content={'Mirror'}/>
              </TabItem>
              <TabItem title="C&E">
                <TabContent content={'C&E'}/>
              </TabItem>
            </Tab>

            <br/>
            <br/>
            <LabelField style={labelStyle}>选项卡页签：自定义图标、自定义width(超出width，显示...)</LabelField>
            <Tab type="sub" selectedIndex={1} style={{width: "350px"}} isAutoClose={true} onClose={this.handleClose}>
              <TabItem title="Basic Setting" icon={create_default}>
                <TabContent content={'Basic Setting'}/>
              </TabItem>
              <TabItem title="Bandwidth" closable={true}>
                <TabContent content={'Bandwidth'}/>
              </TabItem>
              <TabItem title="Mirror" disabled={true}>
                <TabContent content={'Mirror'}/>
              </TabItem>
              <TabItem title="C&E">
                <TabContent content={'C&E'}/>
              </TabItem>
            </Tab>
          </div>
        </div>

          <div style={{ border: '1px solid #f5f5f5', padding:'1rem',marginTop:'1rem'}}>
          <LabelField style={labelStyle}>分割式页签：type='page'，仅3.1及以上版本支持</LabelField>
          <Tab type="page" selectedIndex={1} showAddButton={ version==='aui3-1' }>
            <TabItem title="Basic Setting">
              <TabContent content={'Basic Setting'}/>
            </TabItem>
            <TabItem title="Bandwidth">
              <TabContent content={'Bandwidth'}/>
            </TabItem>
            <TabItem title="Mirror" disabled={true}>
              <TabContent content={'Mirror'}/>
            </TabItem>
            <TabItem title="C&E">
              <TabContent content={'C&E'}/>
            </TabItem>
          </Tab>

          <LabelField style={labelStyle}>分割式页签：自定义图标、自定义width(超出width，显示...)</LabelField>
          <Tab type="page" selectedIndex={1} style={{width: "400px"}} isAutoClose={true} onClose={this.handleClose}>
            <TabItem title="Basic Setting" icon={create_default}>
              <TabContent content={'Basic Setting'}/>
            </TabItem>
            <TabItem title="Bandwidth" closable={true}>
              <TabContent content={'Bandwidth'}/>
            </TabItem>
            <TabItem title="Mirror" disabled={true}>
              <TabContent content={'Mirror'}/>
            </TabItem>
            <TabItem title="C&E">
              <TabContent content={'C&E'}/>
            </TabItem>
          </Tab>
        </div>
        </div>

      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabExample />, mountNode);

```

### 位置处理

## en-US



```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import Select from 'eview-ui/Select';
import Table from 'eview-ui/Table';
import img1 from '@images/table_1.png';
import img2 from '@images/table_2.png';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import create_default from "@images/create_default";

export default class TabExample extends React.Component {

  state = {
    index: 0,
    position: 'top',
  };

  handleSelChange = (val, oldVal, text, oldText) => {
    if (text != oldText) {
      this.setState({index: val - 1, position: text});
    }
  }

  render() {
    const [version, theme] = getDemoVersion();

    let options = [{text: "top", value: 1}, {text: "bottom", value: 2}, {text: "left", value: 3}, {
      text: "right",
      value: 4
    }];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <Select options={options} label="Tab Position:" selectedIndex={this.state.index}
                  onChange={this.handleSelChange}/>
          <Tab style={{width: "450px", height: '300px', marginTop: '20px'}} position={this.state.position}
               lazyLoad={true}>
            <TabItem title="Home" closable={true} icon={create_default}>
              <p>Home</p>
            </TabItem>
            <TabItem title="Profile" closable={true} setEditing={true}>
              <p>Profile</p>
            </TabItem>
            <TabItem title="Messages" closable={true} disabled={true}>
              <p>Messages</p>
            </TabItem>
            <TabItem title="Settings" closable={true}>
              <p>Settings</p>
            </TabItem>
            <TabItem title="Table" closable={true} setEditing={true}>

            </TabItem>
            <TabItem title="TreeTable" closable={true} setEditing={true}>

            </TabItem>
            <TabItem title="Profile3" closable={true}>
              <p>Profile3</p>
            </TabItem>
            <TabItem title="Messages2" closable={true} disabled={true}>
              <p>Messages2</p>
            </TabItem>
            <TabItem title="Settings2" closable={true}>
              <p>Settings2</p>
            </TabItem>
            <TabItem title="Messages3" closable={true} disabled={true}>
              <p>Messages3</p>
            </TabItem>
            <TabItem title="Settings3" closable={true}>
              <p>Settings3</p>
            </TabItem>
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabExample />, mountNode);

```

```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import Select from 'eview-ui/Select';
import Table from 'eview-ui/Table';
import img1 from '@images/table_1.png';
import img2 from '@images/table_2.png';
import Button from 'eview-ui/Button';
import DivMessage from 'eview-ui/DivMessage';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import create_default from "@images/create_default";

export default class TabExample extends React.Component {

  state = {
    index: 0,
    position: 'top',
  };

  handleSelChange = (val, oldVal, text, oldText) => {
    if (text != oldText) {
      this.setState({index: val - 1, position: text});
    }
  }

  render() {
    const [version, theme] = getDemoVersion();

    let options = [{text: "top", value: 1}, {text: "bottom", value: 2}, {text: "left", value: 3}, {
      text: "right",
      value: 4
    }];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <Select options={options} label="Tab Position:" selectedIndex={this.state.index}
                  onChange={this.handleSelChange}/>
          <Tab style={{width: "450px", height: '300px', marginTop: '20px'}} position={this.state.position}
               lazyLoad={true}>
            <TabItem title="Home" closable={true} icon={create_default}>
              <p>Home</p>
            </TabItem>
            <TabItem title="Profile" closable={true} setEditing={true}>
              <p>Profile</p>
            </TabItem>
            <TabItem title="Messages" closable={true} disabled={true}>
              <p>Messages</p>
            </TabItem>
            <TabItem title="Settings" closable={true}>
              <p>Settings</p>
            </TabItem>
            <TabItem title="Table" closable={true} setEditing={true}>

            </TabItem>
            <TabItem title="TreeTable" closable={true} setEditing={true}>

            </TabItem>
            <TabItem title="Profile3" closable={true}>
              <p>Profile3</p>
            </TabItem>
            <TabItem title="Messages2" closable={true} disabled={true}>
              <p>Messages2</p>
            </TabItem>
            <TabItem title="Settings2" closable={true}>
              <p>Settings2</p>
            </TabItem>
            <TabItem title="Messages3" closable={true} disabled={true}>
              <p>Messages3</p>
            </TabItem>
            <TabItem title="Settings3" closable={true}>
              <p>Settings3</p>
            </TabItem>
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabExample />, mountNode);

```

### 事件处理

## en-US



```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import DivMessage from 'eview-ui/DivMessage';
import img1 from '@images/table_1.png';
import img2 from '@images/table_2.png';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class LazyLoad extends React.Component {

  static timeouts: any;
  state = {
    lazyshowing: 'a',
  };


  setup() {
    return setTimeout(() => {
      this.setState({lazyshowing: 'good!'});
    }, 2000);
  }

  componentDidMount() {
    LazyLoad.timeouts = this.setup();
    console.log('lazy mounted!');
  }

  componentDidUpdate() {
    // this.setState({lazyshowing: 'eee'})
  }

  componentWillUnmount() {
    console.log('should not happen');
    clearTimeout(LazyLoad.timeouts);
  }

  render() {
    return (
      <span>{this.state.lazyshowing}</span>
    );
  }
}


export default class TabEventExample extends React.Component {

  state = {
    msg: '',
    selectedIndex: 0
  };

  handleClick = (index, title) => {
    this.setState({msg: "OnClick event callback: click on the title : " + title, selectedIndex: index})
  }

  handleCloseSub = (index, e, title) => {
    console.log("Tab Close event: ", index, e, title)
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <Tab selectedIndex={this.state.selectedIndex} onClick={this.handleClick} onClose={this.handleCloseSub}
               style={{width: "370px"}} lazyLoad>
            <TabItem title="Home">
              <p>Home</p>
            </TabItem>
            <TabItem title="Profile" closable={true}>
              <p>Profile</p>
            </TabItem>
            <TabItem title="Messages">

            </TabItem>
            <TabItem title="Settings">
              <p>Setting</p>
            </TabItem>
            <TabItem title="Lazyload">
              <LazyLoad/>
            </TabItem>
          </Tab>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabEventExample />, mountNode);

```

```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import DivMessage from 'eview-ui/DivMessage';
import img1 from '@images/table_1.png';
import img2 from '@images/table_2.png';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class LazyLoad extends React.Component {

  static timeouts: any;
  state = {
    lazyshowing: 'a',
  };


  setup() {
    return setTimeout(() => {
      this.setState({lazyshowing: 'good!'});
    }, 2000);
  }

  componentDidMount() {
    LazyLoad.timeouts = this.setup();
    console.log('lazy mounted!');
  }

  componentDidUpdate() {
    // this.setState({lazyshowing: 'eee'})
  }

  componentWillUnmount() {
    console.log('should not happen');
    clearTimeout(LazyLoad.timeouts);
  }

  render() {
    return (
      <span>{this.state.lazyshowing}</span>
    );
  }
}


export default class TabEventExample extends React.Component {

  state = {
    msg: '',
    selectedIndex: 0
  };

  handleClick = (index, title) => {
    this.setState({msg: "OnClick event callback: click on the title : " + title, selectedIndex: index})
  }

  handleCloseSub = (index, e, title) => {
    console.log("Tab Close event: ", index, e, title)
  };

  render() {
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <Tab selectedIndex={this.state.selectedIndex} onClick={this.handleClick} onClose={this.handleCloseSub}
               style={{width: "370px"}} lazyLoad>
            <TabItem title="Home">
              <p>Home</p>
            </TabItem>
            <TabItem title="Profile" closable={true}>
              <p>Profile</p>
            </TabItem>
            <TabItem title="Messages">

            </TabItem>
            <TabItem title="Settings">
              <p>Setting</p>
            </TabItem>
            <TabItem title="Lazyload">
              <LazyLoad/>
            </TabItem>
          </Tab>
          {this.state.msg ?
            <DivMessage text={this.state.msg} type="success" style={{marginTop: "10px", width: "600px"}}/> : ''}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabEventExample />, mountNode);

```

### Add/Delete Dynamically

## en-US



```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

let i = 0;
let j = 0;
export default class TabsExample extends React.Component {

  state = {
    data: [{title: "Home", closable: true, children: <p>111</p>},
      {title: "Profile", closable: true, children: <p>222</p>},
      {title: "Messages", closable: true, children: <p>333</p>}],

    subData: [{title: "Home", closable: true, children: <p>111</p>},
      {title: "Profile", closable: true, children: <p>222</p>},
      {title: "Messages", closable: true, children: <p>333</p>}]
  };

  handleCloseDefault = (index) => {
    let data = this.state.data;
    data.splice(index, 1);
    this.setState({
      data: data
    })
  };

  handleCloseSub = (index, e, title) => {
    let data = this.state.subData;
    data.splice(index, 1);
    this.setState({
      subData: data
    })
  };

  handleClickDefault = () => {
    let data = this.state.data;
    data.push({title: "Add item" + i++, closable: true, children: <p>Added</p>})
    this.setState({
      data: data
    })
  };

  handleClickSub = () => {
    let data = this.state.subData;
    data.push({title: "Add item" + j++, closable: true, children: <p>Added</p>})
    this.setState({
      subData: data
    })
  };

  render() {
    const [version, theme] = getDemoVersion();

    let tabs = this.state.data.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });
    let subTabs = this.state.subData.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>

        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <div>
            <Button text="Click to add a level header" onClick={this.handleClickDefault}
                    style={{marginBottom: "10px"}}></Button>
          </div>
          <Tab onClose={this.handleCloseDefault}>
            {tabs}
          </Tab>

          <div>
            <Button text="Click to add a second tab heading" onClick={this.handleClickSub}
                    style={{marginBottom: "10px", marginTop: "20px"}}></Button>
          </div>
          <Tab type="sub" onClose={this.handleCloseSub}>
            {subTabs}
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabsExample />, mountNode);

```

```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

let i = 0;
let j = 0;
export default class TabsExample extends React.Component {

  state = {
    data: [{title: "Home", closable: true, children: <p>111</p>},
      {title: "Profile", closable: true, children: <p>222</p>},
      {title: "Messages", closable: true, children: <p>333</p>}],

    subData: [{title: "Home", closable: true, children: <p>111</p>},
      {title: "Profile", closable: true, children: <p>222</p>},
      {title: "Messages", closable: true, children: <p>333</p>}]
  };

  handleCloseDefault = (index) => {
    let data = this.state.data;
    data.splice(index, 1);
    this.setState({
      data: data
    })
  };

  handleCloseSub = (index, e, title) => {
    let data = this.state.subData;
    data.splice(index, 1);
    this.setState({
      subData: data
    })
  };

  handleClickDefault = () => {
    let data = this.state.data;
    data.push({title: "Add item" + i++, closable: true, children: <p>Added</p>})
    this.setState({
      data: data
    })
  };

  handleClickSub = () => {
    let data = this.state.subData;
    data.push({title: "Add item" + j++, closable: true, children: <p>Added</p>})
    this.setState({
      subData: data
    })
  };

  render() {
    const [version, theme] = getDemoVersion();

    let tabs = this.state.data.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });
    let subTabs = this.state.subData.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>

        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <div>
            <Button text="Click to add a level header" onClick={this.handleClickDefault}
                    style={{marginBottom: "10px"}}></Button>
          </div>
          <Tab onClose={this.handleCloseDefault}>
            {tabs}
          </Tab>

          <div>
            <Button text="Click to add a second tab heading" onClick={this.handleClickSub}
                    style={{marginBottom: "10px", marginTop: "20px"}}></Button>
          </div>
          <Tab type="sub" onClose={this.handleCloseSub}>
            {subTabs}
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TabsExample />, mountNode);

```

### Nested Tab

## en-US



```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class NestedTab extends React.Component {
  state = {
    data: [
      {title: "Child1", closable: true, children: <p>111</p>},
      {title: "Child2", closable: true, children: <p>222</p>},
      {title: "Child3", closable: true, children: <p>333</p>}]
  };

  render() {
    const [version, theme] = getDemoVersion();

    let labelStyle = {display: "block", paddingLeft: "0px"};

    let tabs = this.state.data.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });
    let stylePadding = {padding: "10px 0px 0px 10px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <LabelField style={labelStyle}>Primary Tab：</LabelField>
          <Tab style={{width: "450px"}}>
            <TabItem title="Home" closable={true}>
              <Tab style={{margin: "20px 0px 10px 10px", width: "450px"}}>
                <TabItem title="Tab1">
                  <p style={stylePadding}>Home1</p>
                </TabItem>
                <TabItem title="Tab2">
                  <Tab style={{margin: "20px 0px 10px 20px", width: "450px"}}>
                    <TabItem title="Basic Setting Change">
                      <p style={stylePadding}>Child Tab1 content ...</p>
                    </TabItem>
                    <TabItem title="Bandwidth" closable={true}>
                      <p style={stylePadding}>Child Tab2 content ...</p>
                    </TabItem>
                    <TabItem title="Mirror">
                      <p style={stylePadding}>Child Tab3 Content ...</p>
                    </TabItem>
                  </Tab>
                </TabItem>
                <TabItem title="Tab3">
                  <p>Home3</p>
                </TabItem>
              </Tab>
            </TabItem>
            <TabItem title="Profile" closable={true}>
              <p>Profiles</p>
            </TabItem>
            <TabItem title="Messages">
              <p>Messages</p>
            </TabItem>
            <TabItem title="Settings">
              <p>Settings</p>
            </TabItem>
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<NestedTab />, mountNode);

```

```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class NestedTab extends React.Component {
  state = {
    data: [
      {title: "Child1", closable: true, children: <p>111</p>},
      {title: "Child2", closable: true, children: <p>222</p>},
      {title: "Child3", closable: true, children: <p>333</p>}]
  };

  render() {
    const [version, theme] = getDemoVersion();

    let labelStyle = {display: "block", paddingLeft: "0px"};

    let tabs = this.state.data.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });
    let stylePadding = {padding: "10px 0px 0px 10px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <LabelField style={labelStyle}>Primary Tab：</LabelField>
          <Tab style={{width: "450px"}}>
            <TabItem title="Home" closable={true}>
              <Tab style={{margin: "20px 0px 10px 10px", width: "450px"}}>
                <TabItem title="Tab1">
                  <p style={stylePadding}>Home1</p>
                </TabItem>
                <TabItem title="Tab2">
                  <Tab style={{margin: "20px 0px 10px 20px", width: "450px"}}>
                    <TabItem title="Basic Setting Change">
                      <p style={stylePadding}>Child Tab1 content ...</p>
                    </TabItem>
                    <TabItem title="Bandwidth" closable={true}>
                      <p style={stylePadding}>Child Tab2 content ...</p>
                    </TabItem>
                    <TabItem title="Mirror">
                      <p style={stylePadding}>Child Tab3 Content ...</p>
                    </TabItem>
                  </Tab>
                </TabItem>
                <TabItem title="Tab3">
                  <p>Home3</p>
                </TabItem>
              </Tab>
            </TabItem>
            <TabItem title="Profile" closable={true}>
              <p>Profiles</p>
            </TabItem>
            <TabItem title="Messages">
              <p>Messages</p>
            </TabItem>
            <TabItem title="Settings">
              <p>Settings</p>
            </TabItem>
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<NestedTab />, mountNode);

```

### Set Tab-Items are Non Draggable

## en-US



```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class NonDraggableTab extends React.Component {
  state = {
    data: [
      {title: "Child1", closable: true, children: <p>111</p>},
      {title: "Child2", closable: true, children: <p>222</p>},
      {title: "Child3", closable: true, children: <p>333</p>}]
  };

  render() {
    const [version, theme] = getDemoVersion();

    let labelStyle = {display: "block", paddingLeft: "0px"};

    let tabs = this.state.data.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });
    let stylePadding = {padding: "10px 0px 0px 10px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <LabelField style={labelStyle}>Primary Tab：</LabelField>
          <Tab style={{width: "450px"}} draggable={false}>
            <TabItem title="Home" closable={true}>
              <Tab style={{margin: "20px 0px 10px 10px", width: "450px"}} draggable={false}>
                <TabItem title="Tab1">
                  <p style={stylePadding}>Home1</p>
                </TabItem>
                <TabItem title="Tab2">
                  <Tab style={{margin: "20px 0px 10px 20px", width: "450px"}}>
                    <TabItem title="Basic Setting Change">
                      <p style={stylePadding}>Child Tab1 content ...</p>
                    </TabItem>
                    <TabItem title="Bandwidth" closable={true}>
                      <p style={stylePadding}>Child Tab2 content ...</p>
                    </TabItem>
                    <TabItem title="Mirror">
                      <p style={stylePadding}>Child Tab3 Content ...</p>
                    </TabItem>
                  </Tab>
                </TabItem>
                <TabItem title="Tab3">
                  <p>Home3</p>
                </TabItem>
              </Tab>
            </TabItem>
            <TabItem title="Profile" closable={true}>
              <p>Profiles</p>
            </TabItem>
            <TabItem title="Messages">
              <p>Messages</p>
            </TabItem>
            <TabItem title="Settings">
              <p>Settings</p>
            </TabItem>
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<NonDraggableTab />, mountNode);

```

```jsx
import Tab, { TabItem } from 'eview-ui/Tab';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class NonDraggableTab extends React.Component {
  state = {
    data: [
      {title: "Child1", closable: true, children: <p>111</p>},
      {title: "Child2", closable: true, children: <p>222</p>},
      {title: "Child3", closable: true, children: <p>333</p>}]
  };

  render() {
    const [version, theme] = getDemoVersion();

    let labelStyle = {display: "block", paddingLeft: "0px"};

    let tabs = this.state.data.map((item, index) => {
      return <TabItem title={item.title} closable={item.closable} key={index}>
        {item.children}
      </TabItem>
    });
    let stylePadding = {padding: "10px 0px 0px 10px"};
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div id="evu_Tab_example" style={{margin: "20px"}}>
          <LabelField style={labelStyle}>Primary Tab：</LabelField>
          <Tab style={{width: "450px"}} draggable={false}>
            <TabItem title="Home" closable={true}>
              <Tab style={{margin: "20px 0px 10px 10px", width: "450px"}} draggable={false}>
                <TabItem title="Tab1">
                  <p style={stylePadding}>Home1</p>
                </TabItem>
                <TabItem title="Tab2">
                  <Tab style={{margin: "20px 0px 10px 20px", width: "450px"}}>
                    <TabItem title="Basic Setting Change">
                      <p style={stylePadding}>Child Tab1 content ...</p>
                    </TabItem>
                    <TabItem title="Bandwidth" closable={true}>
                      <p style={stylePadding}>Child Tab2 content ...</p>
                    </TabItem>
                    <TabItem title="Mirror">
                      <p style={stylePadding}>Child Tab3 Content ...</p>
                    </TabItem>
                  </Tab>
                </TabItem>
                <TabItem title="Tab3">
                  <p>Home3</p>
                </TabItem>
              </Tab>
            </TabItem>
            <TabItem title="Profile" closable={true}>
              <p>Profiles</p>
            </TabItem>
            <TabItem title="Messages">
              <p>Messages</p>
            </TabItem>
            <TabItem title="Settings">
              <p>Settings</p>
            </TabItem>
          </Tab>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<NonDraggableTab />, mountNode);

```

