# Paging 分页器

> 分类：导航

Paging为分页功能提供了基础支持。

### Paging组件的使用分为受控式和不受控式

- 完全受控式

通过在Props里设置currentPage来指定当前页码，通过在Props里设定onPageChange回调函数来改变当前页码

- 完全不受控式

通过在Props里设置currentPage来指定当前页码，不设置onPageChange回调函数，使用按钮的默认行为来改变当前页码

### 使用注意事项

一旦设置了onPageChange回调函数，组件将以完全受控式运行，按钮的默认行为将被禁用。

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法    | eview 写法 | 迁移要点                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Pagination` | `Paging`   | `total`→**`recordCount`（必须传）**；`current`→`currentPage`；`pageSize`/`pageSizeOptions` 同名；`showTotal`→`recordCountDisp`（string 替代展示）；`onChange(page, pageSize)`→**`onPageChange(currentPage)` + `onPageSizeChange(pageSize)` 分开两个**；`hideConfig=['totalRecord','pageSize','gotoPage']` 隐藏分区；`simple`→`type='simple'`；**`onPageChange` 一旦设置即完全受控**（默认翻页行为被禁用——受控时必须接回调维护 currentPage） |

## API

### 属性

| 属性名称         | 描述                                                                                                                                                                                                                                                                 | 输入                                                          | 默认                 |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------ | :------------------- |
| recordCount      | 总记录条数，必须                                                                                                                                                                                                                                                     | number                                                        |                      |
| recordCountDisp  | 自定义总记录数的显示，会替代recordCount作为展示内容（页数计算仍基于recordCount）                                                                                                                                                                                     | string                                                        |                      |
| pageSize         | 单页大小，切换分页下拉框会改变                                                                                                                                                                                                                                       | number                                                        | 10                   |
| currentPage      | 当前页码，点击分页会切换                                                                                                                                                                                                                                             | number                                                        | 1                    |
| pageSizeOptions  | 分页大小选项，决定下拉框中的可选项                                                                                                                                                                                                                                   | number[]                                                      | [10, 20, 50, 100]    |
| type             | 分页类型：数字列表、下拉框或精简模式                                                                                                                                                                                                                                 | enum:<br>&nbsp;"list"<br>&nbsp;"select"<br>&nbsp;"simple"<br> | 'list'               |
| onPageChange     | 点击切换页码的时候触发的回调函数<br><br>**签名:**<br>`function(currentPage: number) => void`<br>_currentPage:_ 页码                                                                                                                                                  | function                                                      |                      |
| onPageSizeChange | 分页大小切换事件回调<br><br>**签名:**<br>`function(pageSize: number) => void`<br>_pageSize:_ 分页尺寸                                                                                                                                                                | function                                                      |                      |
| onInputChange    | 跳转输入框值变更后的回调函数<br><br>**签名:**<br>`function(value: string) => void`<br>_value:_ 输入框文本                                                                                                                                                            | function                                                      |                      |
| popupDirection   | 弹出方向，定义分页页面大小选择控件的弹窗方向                                                                                                                                                                                                                         | enum:<br>&nbsp;'top'<br>&nbsp;'bottom'<br>                    |                      |
| splitPagination  | 如果为true，则将分页切换器浮动到右侧                                                                                                                                                                                                                                 | bool                                                          | false                |
| className        | 为组件外层容器增加class                                                                                                                                                                                                                                              | string                                                        |                      |
| style            | 为组件外层容器设置样式                                                                                                                                                                                                                                               | object                                                        |                      |
| id               | 组件外层容器id，未设置时自动生成（eui_Paging_NNNN）                                                                                                                                                                                                                  | string                                                        | 自动生成             |
| selectWidth      | 自定义Select下拉菜单的宽度                                                                                                                                                                                                                                           | string                                                        | '7rem'               |
| selectProps      | Select子组件的props，详情请查阅Select的API                                                                                                                                                                                                                           | object                                                        |                      |
| hideConfig       | 支持的配置项：`['totalRecord', 'pageSize', 'gotoPage']`，其中totalRecord表示总数，pageSize表示页大小，gotoPage表示跳转页码，可根据实际需要配置其中一项或多项隐藏。默认不配置表示全部展示。注意：type配置为select时，由于原始不支持'pageSize'与'gotoPage'，配置了无效 | array                                                         |                      |
| version          | AUI版本号，通常由ConfigProvider自动提供，一般不需要手动设置                                                                                                                                                                                                          | string                                                        | 由ConfigProvider提供 |
| theme            | AUI主题名，通常由ConfigProvider自动提供，一般不需要手动设置                                                                                                                                                                                                          | string                                                        | 由ConfigProvider提供 |

## 使用示例

### 基本属性设置

```jsx
import Paging from "eview-ui/Paging";

// 默认 list 类型，未设 onPageChange → 不受控，按钮默认翻页生效
<Paging
  recordCount={100}
  pageSize={10}
  currentPage={2}
  pageSizeOptions={[10, 30, 90]}
  onPageSizeChange={(pageSize) => {
    // pageSize: 新分页尺寸
  }}
/>;

// type='select'
<Paging
  type="select"
  recordCount={100}
  pageSize={10}
  currentPage={2}
  pageSizeOptions={[10, 30, 90]}
  onPageChange={(currentPage) => {
    // currentPage: 新页码；onPageChange 一旦设置即完全受控
  }}
/>;

// type='simple' + hideConfig 隐藏分区（精简分页器）
<Paging
  type="simple"
  recordCount={100}
  pageSize={10}
  currentPage={2}
  pageSizeOptions={[10, 30, 90]}
  hideConfig={["totalRecord", "pageSize", "gotoPage"]}
  onPageChange={(currentPage) => {}}
/>;

// type='simple' 复杂分页器（不隐藏分区）
<Paging
  type="simple"
  recordCount={100}
  pageSize={10}
  currentPage={2}
  pageSizeOptions={[10, 30, 90]}
  onPageChange={(currentPage) => {}}
/>;

// recordCountDisp 自定义总记录数显示（页数计算仍基于 recordCount）
<Paging
  recordCount={100}
  recordCountDisp="100+"
  pageSize={10}
  currentPage={2}
  splitPagination={false}
  pageSizeOptions={[10, 30, 90]}
  onPageSizeChange={(pageSize) => {}}
/>
```

### 事件处理

```jsx
import Paging from "eview-ui/Paging";

// 受控式：onPageChange + onPageSizeChange 同时设置，按钮默认行为被禁用
<Paging
  recordCount={10000}
  pageSize={10}
  currentPage={1}
  pageSizeOptions={[10, 30, 90]}
  onPageChange={(currentPage) => {
    // currentPage: 新页码，需维护 currentPage
  }}
  onPageSizeChange={(pageSize) => {
    // pageSize: 新分页尺寸
  }}
/>
```

### 拆分样式

```jsx
import Paging from "eview-ui/Paging";

// splitPagination={true}：分页切换器浮动到右侧
<Paging
  recordCount={100}
  pageSize={10}
  currentPage={2}
  pageSizeOptions={[10, 30, 90]}
  splitPagination
  style={{ width: "50rem" }}
  onPageSizeChange={(pageSize) => {}}
/>;

<Paging
  type="select"
  recordCount={100}
  pageSize={10}
  currentPage={2}
  pageSizeOptions={[10, 30, 90]}
  splitPagination
  style={{ width: "50rem" }}
  onPageChange={(currentPage) => {}}
/>;

<Paging
  recordCount={100}
  recordCountDisp="100+"
  pageSize={10}
  currentPage={4}
  pageSizeOptions={[10, 30, 90]}
  splitPagination
  style={{ width: "50rem" }}
  onPageSizeChange={(pageSize) => {}}
/>
```
