# MultipleSelect 下拉复选框

> 分类：数据录入

该组件用来设置多选下拉框，并在输入框提供当前选中的列表的预览。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Select mode="multiple"` | `MultipleSelect` | 删 `mode`；`options=[{text, value}]`；`value` 数组；**`onChange(value[], changeValue[], event)`**；`placeholder` 同名保留；`searchable`（= showSearch）；`selectAll`；`getValue()`；性能：options ≤500（也可用 SelectPro `mode='multiple'`，本表主映射 MultipleSelect） |

## API

| 方法名      | 描述                  | 参数  | 返回值            |
|----------|---------------------|-----|----------------|
| getValue | 用来获取下拉框中被选中项的value值 |     | 当前选中的项的value集合 |
| validate | 用来手动进行非空校验          |     | 校验结果，bool类型    |
| focus    | 用来设置下拉框聚焦           |     | 无              |

### 属性

| 属性名称               | 描述                                                                                                                                                                                       | 输入                                           | 默认       |
|:-------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------|:---------|
| id                 | 设置多选下拉组件外层容器id                                                                                                                                                                           | string                                       |          |
| className          | 为组件外层容器增加class，                                                                                                                                                                          | string                                       |          |
| style              | 为组件外层容器设置样式，                                                                                                                                                                             | object                                       |          |
| options            | 设置下拉列表的选项<br>&nbsp; options : [{ text: "111", value: 1, optionStyle:{ }, optionClassName: 'customName'}, {text: "222", value: 2, disabled: true}];                                       | array                                        | []       |
| optionStyle        | 配置下拉列表每条选项的样式                                                                                                                                                                            | object                                       |          |
| optionClassName    | 配置下拉列表每条选项的className                                                                                                                                                                     | string                                       |          |
| selectedIndex      | 设置默认选中的index,此处为数据属性options中对应的index， 如果同时设置selectedValue，以selectedValue为准                                                                                                               | array                                        |          |
| value              | 设置默认选中的value                                                                                                                                                                             | array                                        |          |
| disabled           | 设置组件的禁用状态，默认false，                                                                                                                                                                       | bool                                         | false    |
| label              | 设置下拉框的名称文字                                                                                                                                                                               | string                                       |          |
| labelClassName     | 通过添加class的方式控制label的样式                                                                                                                                                                   | string                                       |          |
| labelStyle         | 通过添加style的方式控制label的样式                                                                                                                                                                   | object                                       |          |
| inputStyle         | 自定义样式，改变输入样式                                                                                                                                                                             | object                                       |          |
| searchable         | 是否启用搜索功能                                                                                                                                                                                 | bool                                         | false    |
| labelPosition      | 设置输入框的名称文字的位置 before代表名称文字在输入框的左边，after代表名称文字在输入框的右边                                                                                                                                     | enum:<br>&nbsp;"before"<br>&nbsp;"after"<br> | "before" |
| required           | 支持设置组件值是否必须，若为必须，则input前面加*                                                                                                                                                              | bool                                         |          |
| zIndex             | MultipleSelect Popup zIndex can be override by the user                                                                                                                                  | number                                       | 9999     |
| onBlur             | 定义组件的失去焦点时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 触发失焦的事件对象                                                                                                  | function                                     |          |
| onChange           | 定义组件内容改变时的事件<br><br>**签名:**<br>`function(value: array, changeValue: array, event: object) => void`<br>*value:* 当前组件中选中的项的value集合<br>*changeValue:* 当前选择或取消的项的value<br>*event:* 触发聚焦的事件对象 | function                                     |          |
| onFocus            | 定义组件聚焦时的事件<br><br>**签名:**<br>`function(event: object) => void`<br>*event:* 触发聚焦的事件对象                                                                                                     | function                                     |          |
| selectAll          | 在下拉菜单中添加“All”选项                                                                                                                                                                          | bool                                         | false    |
| selectAllSearched  | 有搜索结果时使用“Select all search results”选项替换“All”选项(searchable和selectAll为true时有效)                                                                                                             | bool                                         | false    |
| disableToolTip     | 禁用工具提示                                                                                                                                                                                   | bool                                         | false    |
| delimiter          | to separate the popup options using the delimiter, default is comma(',')                                                                                                                 | string                                       | ','      |
| toolTipPosition    | 设置自定义工具提示位置                                                                                                                                                                              | 跟Tooltip 组件的placement属性一致 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`       | 'topLeft'    |
| dropdownClassName  | 下拉框类名                                                                                                                                                                                    | string                                       |          |
| dropdownStyle      | 下拉框样式                                                                                                                                                                                    | object                                       |          |
| listHeight         | 设置选择列表的高度                                                                                                                                                                                | number                                       |          |
| placeholder        | 输入框默认文本                                                                                                                                                                                  | string                                       |          |
| hintType           | 显示提示信息                                                                                                                                                                                   | enum:<br>&nbsp;"div"<br>&nbsp;"tip"<br>      | 'div'    |
| tipStyle           | 通过添加tipStyle来自定义提示框的样式                                                                                                                                                                   | object                                       |          |
| onSearchTextChange | 搜索文本改变后的回调函数，函数接受的参数为搜索框中的文本(仅在searchable设置为true时有效)<br>**签名:**<br>`function(text: string) => void`<br>*text:* 搜索框文本                                                                     | function                                     |          |
| isVirtualScroll    | 是否虚拟滚动加载，注意虚拟滚动避免选项显示半截，设置listHeight无效，会使用组件定制的高度      | bool    | false 
| tipTextLimit    | 仅在isVirtualScroll虚拟滚动加载场景下生效，限制tip内容的长度显示，超过会截断内容加...显示      | number    |  
| inputTextDisplayLimit    | 限制输入框选择的内容显示的最大长度，超过会截断内容加...显示      | number    | 默认值1000 
| onOpenMultipleSelectPopup    | popup弹出框状态改变时的回调,参数为新的弹出框展示状态。      | function:(popupShow: boolean) => void   |  |
| isManualSearch    | 支持搜索时，是否支持手动搜索，仅适用于ICT 3.1规范。      | boolean   | false |

## 接口定义

```typescript
import type { MouseEvent, MouseEventHandler } from 'react';

interface MultipleSelect {

  /**
   * 设置多选下拉组件外层容器id
   */
  id: string;

  /**
   * 为组件外层容器增加class，
   */
  className: string;

  /**
   * 为组件外层容器设置样式，
   */
  style: object;

  /**
   * 为选择容器增加class，
   */
  inputStyle: object;

  /**
   * 为选择容器增加class，
   */
  selectClassName: string;

  /**
   * 为选择容器设置样式，
   */
  selectStyle: object;

  /**
   * 设置下拉列表的选项，
   * let options = [{ text: "111"; value: 1; disabled:true}; {text: "222"; value: 2}; {text: "333";value: 3}];
   */
  options: any;

  /**
   * 设置默认选中的index;此处为数据属性options中对应的index，
   * 如果同时设置selectedValue，以selectedValue为准
   */
  selectedIndex: number[];

  /**
   * 设置默认选中的value
   */
  value: string[];

  /**
   * 设置组件的禁用状态，默认false，
   */
  disabled: boolean;

  /**
   * 设置下拉框的名称文字
   */
  label: string;

  /**
   * 通过添加class的方式控制label的样式
   */
  labelClassName: string;

  /**
   * 通过添加style的方式控制label的样式
   */
  labelStyle: object;

  /**
   * 下拉列表每条样式
   */
  optionStyle: object;

  /**
   * 通过添加class的方式控制下拉列表每条样式
   */
  optionClassName: string;

  /**
   * 设置输入框的名称文字的位置
   * before代表名称文字在输入框的左边，after代表名称文字在输入框的右边
   */
  labelPosition: 'before' | 'after';

  /**
   *  支持设置组件值是否必须，若为必须，则input前面加*
   */
  required: boolean;

  /**
   * 定义组件的失去焦点时的事件
   *
   * @param {object} event 触发失焦的事件对象
   */
  onBlur: (e: FocusEvent) => unknown;

  onOpenMultipleSelectPopup: (isSelected: boolean) => unknown;

  onChange: (selectedVal: string, val: string) => unknown;

  /**
   * 定义组件聚焦时的事件
   *
   * @param {object} event 触发聚焦的事件对象
   */
  onFocus: (e: FocusEvent) => unknown;

  /**
   * Defines the direction of the popup in selection control
   */
  popupDirection: 'top' | 'bottom';

  /** class of dropdown root element */
  dropdownClassName: string;

  /** style of dropdown root element */
  dropdownStyle: object;

  /**
   * Adds 'All' option in the drop-down menu.
   */
  selectAll: boolean;

  /**
   * 有搜索结果时使用"Select all search results"选项替换"All"选项.
   */
  selectAllSearched: boolean;

  /**
   * Disable ToolTip.
   */
  disableToolTip: boolean;

  /**
   *  delimiter for separate the popup Items; Default is comma(';')
   */
  delimiter: string;

  /**
   * to set the zIndex popup .
   */
  zIndex: number;

  /**
   * 是否使用关闭选项小图标
   */
  enableCloseIcon: boolean;

  toolTipPosition: 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

  /**
   * Set the maximum items to be display in the popup
   */
  displayItems: number;

  /**
   * To limit the charcter in search input box
   */
  maxLengthInput: number;

  /**
   * 为输入框容器增加class，
   */
  inputClassName: string;

  /**
   * 设置选择列表的高度
   */
  listHeight: number;

  /**
   * 默认文字
   */
  placeholder: string;

  /**
   * style of tip
   */
  tipStyle: object;

  /**
   * type of tip; 'div' or 'tip'
   */
  hintType: string;

  /**
   * 一直校验
   */
  alwaysValidate: boolean;

  /**
   * 搜索文本改变后的回调函数，函数接受的参数为搜索框中的文本
   */
  onSearchTextChange: (val: string) => unknown;

  showPopUp: boolean;

  searchable: boolean;

  tagStyle: object;
  version: string;
  theme: string;

  isManualSearch?: boolean;
}

interface MultipleSelectTag {

  id: string;
  value: string;
  text: string;
  onDelete: (event: MouseEvent, value: string) => unknown;
  className: string;
  tagMouseDown: MouseEventHandler<HTMLSpanElement>;

}


interface MultipleSelectOption {

  id: string;
  className: string;
  selected: boolean;
  text: string;
  style: object;
  disabled: boolean;
  onClick: (e: MouseEvent, value: string, selected: boolean) => unknown;
  tipText: string;
  onMouseDown: (e: MouseEvent, value: string) => unknown;
  value: any;

}

interface MultipleSelectPopUp {
  displayItems: number;
  options: any;
  dropdownClassName: string;
  itemClassName: string;
  value: any;
  searchable: boolean;
  width: string | number;
  dropdownStyle: object;
  onOptionClick: (...value: any[]) => unknown;
  listHeight: number;
  maxLengthInput: number;
  optionStyle: object;
  selectAll: boolean;
  selectAllSearched: boolean;
  optionsChange: (...value: any[]) => unknown;
  searchTextChange: (...value: any[]) => unknown;
  version: string;
  theme: string;
}
```

## 使用示例

### 基本属性设置

## en-US

```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectDemo extends React.Component {

  onChange = () => {

  };

  render() {
    const [version, theme] = getDemoVersion();
    const param1 = {
      onChange: this.onChange,
      disabled: false,
      label: "Default Style",
      labelStyle: { display: "block" },
      value: ["1", "2"],
      useOption: true,
      style: { margin: "20px" },
      inputStyle: { width: "670px" },
      isVirtualScroll: true,
      options: [{
        value: "1",
        text: "The internet  ffffffffffffffffffffff ggggggg hhhhhhhh"
      }, {
        value: "2",
        text: "Network"
      }, {
        value: "3",
        text: "item 03"
      }, {
        value: "4",
        text: "item 04"
      }, {
        value: "5",
        text: "item 05",
        optionStyle: { color: 'red' },
        optionClassName: 'customName'
      }, {
        value: "6",
        text: "item 06"
      }, {
        value: "7",
        text: "item 07"
      }, {
        value: "8",
        text: "item 08"
      }, {
        value: "9",
        text: "item 09"
      }, {
        value: "10",
        text: "item 10"
      }, {
        value: "11",
        text: "item 11"
      }, {
        value: "12",
        text: "item 12"
      }, {
        value: "13",
        text: "item 13"
      }, {
        value: "14",
        text: "item 14"
      }, {
        value: "15",
        text: "item 15"
      },{
        value: "16",
        text: "item 16"
      }, {
        value: "17",
        text: "item 17"
      }, {
        value: "18",
        text: "item 18"
      }, {
        value: "19",
        text: "item 19"
      }]
    };

    const moreData = [];
    for(let i = 0; i < 10000; i++) {
       moreData.push({
        value: i,
        text: `new item${i}`
       });
    }

    param1.options = param1.options.concat(moreData);

    const param2 = {
      onChange: this.onChange,
      disabled: true,
      style: { margin: "20px" },
      label: "Disabled Style",
      labelStyle: { display: "block" },
      value: ["1", "2"],
      options: [{
        value: "1",
        text: "The internet ffffffffffffffffffffffffff"
      }, {
        value: "2",
        text: "Network"
      }, {
        value: "3",
        text: "item 03"
      }, {
        value: "4",
        text: "item 04"
      }, {
        value: "5",
        text: "item 05"
      }, {
        value: "6",
        text: "item 06"
      }, {
        value: "7",
        text: "item 07"
      }, {
        value: "8",
        text: "item 08"
      }, {
        value: "9",
        text: "item 09"
      }, {
        value: "10",
        text: "item 10"
      }]
    };

    const param3 = {
      onChange: this.onChange,
      disabled: false,
      label: "Enable Close Icon",
      labelStyle: { display: "block" },
      value: ["1", "2"],
      useOption: true,
      enableCloseIcon: true,
      style: { margin: "20px" },
      inputStyle: { width: "670px" },
      options: [{
        value: "1",
        text: "The internet  fffffffffff4444fff ggggggg hhhhhhhh"
      }, {
        value: "2",
        text: "Network"
      }, {
        value: "3",
        text: "item 03"
      }, {
        value: "4",
        text: "item 04"
      }, {
        value: "5",
        text: "item 05"
      }, {
        value: "6",
        text: "item 06"
      }, {
        value: "7",
        text: "item 07"
      }, {
        value: "8",
        text: "item 08"
      }, {
        value: "9",
        text: "item 09"
      }, {
        value: "10",
        text: "item 10"
      }, {
        value: "11",
        text: "item 11"
      }, {
        value: "12",
        text: "item 12"
      }, {
        value: "13",
        text: "item 13"
      }, {
        value: "14",
        text: "item 14"
      }, {
        value: "15",
        text: "item 15"
      }, {
        value: "11",
        text: "Network444444"
      }, {
        value: "12",
        text: "Networkkkkkk6666666kkk"
      }, {
        value: "13",
        text: "Networkkkkkkkkk77777777kk"
      }]
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <MultipleSelect {...param1} />
          <MultipleSelect {...param2} />
          <MultipleSelect {...param3} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectDemo />, mountNode);

```

```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectDemo extends React.Component {

  onChange = () => {

  };

  render() {
    const [version, theme] = getDemoVersion();
    const param1 = {
      onChange: this.onChange,
      disabled: false,
      label: "Default Style",
      labelStyle: { display: "block" },
      value: ["1", "2"],
      useOption: true,
      style: { margin: "20px" },
      inputStyle: { width: "670px" },
      isVirtualScroll: true,
      options: [{
        value: "1",
        text: "The internet  ffffffffffffffffffffff ggggggg hhhhhhhh"
      }, {
        value: "2",
        text: "Network"
      }, {
        value: "3",
        text: "item 03"
      }, {
        value: "4",
        text: "item 04"
      }, {
        value: "5",
        text: "item 05",
        optionStyle: { color: 'red' },
        optionClassName: 'customName'
      }, {
        value: "6",
        text: "item 06"
      }, {
        value: "7",
        text: "item 07"
      }, {
        value: "8",
        text: "item 08"
      }, {
        value: "9",
        text: "item 09"
      }, {
        value: "10",
        text: "item 10"
      }, {
        value: "11",
        text: "item 11"
      }, {
        value: "12",
        text: "item 12"
      }, {
        value: "13",
        text: "item 13"
      }, {
        value: "14",
        text: "item 14"
      }, {
        value: "15",
        text: "item 15"
      },{
        value: "16",
        text: "item 16"
      }, {
        value: "17",
        text: "item 17"
      }, {
        value: "18",
        text: "item 18"
      }, {
        value: "19",
        text: "item 19"
      }]
    };

    const moreData = [];
    for(let i = 0; i < 10000; i++) {
       moreData.push({
        value: i,
        text: `new item${i}`
       });
    }

    param1.options = param1.options.concat(moreData);

    const param2 = {
      onChange: this.onChange,
      disabled: true,
      style: { margin: "20px" },
      label: "Disabled Style",
      labelStyle: { display: "block" },
      value: ["1", "2"],
      options: [{
        value: "1",
        text: "The internet ffffffffffffffffffffffffff"
      }, {
        value: "2",
        text: "Network"
      }, {
        value: "3",
        text: "item 03"
      }, {
        value: "4",
        text: "item 04"
      }, {
        value: "5",
        text: "item 05"
      }, {
        value: "6",
        text: "item 06"
      }, {
        value: "7",
        text: "item 07"
      }, {
        value: "8",
        text: "item 08"
      }, {
        value: "9",
        text: "item 09"
      }, {
        value: "10",
        text: "item 10"
      }]
    };

    const param3 = {
      onChange: this.onChange,
      disabled: false,
      label: "Enable Close Icon",
      labelStyle: { display: "block" },
      value: ["1", "2"],
      useOption: true,
      enableCloseIcon: true,
      style: { margin: "20px" },
      inputStyle: { width: "670px" },
      options: [{
        value: "1",
        text: "The internet  fffffffffff4444fff ggggggg hhhhhhhh"
      }, {
        value: "2",
        text: "Network"
      }, {
        value: "3",
        text: "item 03"
      }, {
        value: "4",
        text: "item 04"
      }, {
        value: "5",
        text: "item 05"
      }, {
        value: "6",
        text: "item 06"
      }, {
        value: "7",
        text: "item 07"
      }, {
        value: "8",
        text: "item 08"
      }, {
        value: "9",
        text: "item 09"
      }, {
        value: "10",
        text: "item 10"
      }, {
        value: "11",
        text: "item 11"
      }, {
        value: "12",
        text: "item 12"
      }, {
        value: "13",
        text: "item 13"
      }, {
        value: "14",
        text: "item 14"
      }, {
        value: "15",
        text: "item 15"
      }, {
        value: "11",
        text: "Network444444"
      }, {
        value: "12",
        text: "Networkkkkkk6666666kkk"
      }, {
        value: "13",
        text: "Networkkkkkkkkk77777777kk"
      }]
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div>
          <MultipleSelect {...param1} />
          <MultipleSelect {...param2} />
          <MultipleSelect {...param3} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectDemo />, mountNode);

```

### 扩展处理

## en-US



```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectExpandQueryDemo extends React.Component {

  state = {
    msg: "",
    value: [],
    options:[]
  };
  onChange = (value, changeValue) => {
    this.setState({
      msg: "Current values: " + changeValue + " ,Select values: " + value.join(",") || "[]",
      value: value
    })
  };

  handleMultipleSelectPopup = (popupOpened) => {
    console.log("Calling"+popupOpened);
    if (popupOpened){
      this.setState({options:[{ value: "1", text: "The internet" },
                            { value: "2", text: "Network1" },
                            { value: "3", text: "Network2" }],
                  })
  }
}

  onFocus = (e) => {
    this.setState({
      msg: "On Focus",
    })
  };
  onBlur = (e) => {
    this.setState({
      msg: "on Blur",
    })
  };

  focus = () => {
    this.select.focus();
  };

  getValue = () => {
    let value = this.select.getValue();
    this.setState({
      msg: "getValue, Selected values are：" + value.join(",") || "[]",
      value: value
    })
  };
  validate = () => {
    this.select.validate();
    this.setState({
      msg: "Called validate interface"
    })
  };

  render() {
    const {
      id,
      ...other
    } = this.props;

    const param = {
      id:"demo_mulutiple_select",
      onChange: this.onChange,
      onBlur: this.onBlur,
      onOpenMultipleSelectPopup: this.handleMultipleSelectPopup,
      onFocus: this.onFocus,
      disabled: false,
      label: "Multi-select expand dropdown box",
      value: this.state.value,
      required: true,
      useOption:false,
      style: {"marginBottom": "20px", marginRight: "20px", verticalAlign: "top" },
      options: this.state.options,

    };

    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ "marginLeft": "20px", display: "inline-block" }}>
          <MultipleSelect ref={(select) => { this.select = select }} {...param} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectExpandQueryDemo />, mountNode);

```

```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectExpandQueryDemo extends React.Component {

  state = {
    msg: "",
    value: [],
    options:[]
  };
  onChange = (value, changeValue) => {
    this.setState({
      msg: "Current values: " + changeValue + " ,Select values: " + value.join(",") || "[]",
      value: value
    })
  };

  handleMultipleSelectPopup = (popupOpened) => {
    console.log("Calling"+popupOpened);
    if (popupOpened){
      this.setState({options:[{ value: "1", text: "The internet" },
                            { value: "2", text: "Network1" },
                            { value: "3", text: "Network2" }],
                  })
  }
}

  onFocus = (e) => {
    this.setState({
      msg: "On Focus",
    })
  };
  onBlur = (e) => {
    this.setState({
      msg: "on Blur",
    })
  };

  focus = () => {
    this.select.focus();
  };

  getValue = () => {
    let value = this.select.getValue();
    this.setState({
      msg: "getValue, Selected values are：" + value.join(",") || "[]",
      value: value
    })
  };
  validate = () => {
    this.select.validate();
    this.setState({
      msg: "Called validate interface"
    })
  };

  render() {
    const {
      id,
      ...other
    } = this.props;

    const param = {
      id:"demo_mulutiple_select",
      onChange: this.onChange,
      onBlur: this.onBlur,
      onOpenMultipleSelectPopup: this.handleMultipleSelectPopup,
      onFocus: this.onFocus,
      disabled: false,
      label: "Multi-select expand dropdown box",
      value: this.state.value,
      required: true,
      useOption:false,
      style: {"marginBottom": "20px", marginRight: "20px", verticalAlign: "top" },
      options: this.state.options,

    };

    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ "marginLeft": "20px", display: "inline-block" }}>
          <MultipleSelect ref={(select) => { this.select = select }} {...param} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectExpandQueryDemo />, mountNode);

```

### 事件处理

## en-US



```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectEventDemo extends React.Component {

  state = {
    msg: "",
    value: [],
  };
  onChange = (value, changeValue) => {
    console.log(value);
    console.log(changeValue);
    this.setState({
      msg: "Current values: " + changeValue + " ,Select values: " + value.join(",") || "[]",
      value: value
    })
  };

  onFocus = (e) => {
    this.setState({
      msg: "On Focus",
    })
  };
  onBlur = (e) => {
    this.setState({
      msg: "on Blur",
    })
  };

  focus = () => {
    this.select.focus();
  };
  clear=()=>
  {
    this.setState({value: [] })
  }

  getValue = () => {
    let value = this.select.getValue();
    this.setState({
      msg: "getValue, Selected values are：" + value.join(",") || "[]",
      value: value
    })
  };
  validate = () => {
    this.select.validate();
    this.setState({
      msg: "Called validate interface"
    })
  };

  render() {
    const {
      id,
      ...other
    } = this.props;

    const param = {
      id:"demo_mulutiple_select",
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      delimiter:';',
      selectedIndex:this.state.slectData,
      disabled: false,
      label: "Multi-select drop-down box",
      value: this.state.value,
      required: true,
      useOption:true,
      isVirtualScroll: true,
      tipTextLimit: 1000,
      inputTextDisplayLimit: 1000,
      style: {"marginBottom": "20px", marginRight: "20px", verticalAlign: "top" },
      options: [
        { value: "1", text: "The internet" },
        { value: "2", text: "Network" },
        { value: "3", text: "item 03" },
        { value: "4", text: "item 04", disabled: true },
        { value: "5", text: "item 05" },
        { value: "6", text: "item 06" },
        { value: "7", text: "item 07" },
        { value: "8", text: "item 08" },
        { value: "9", text: "item 09" },
        { value: "10", text: "item 10" },
        { value: "11", text: "item 11" },
        { value: "12", text: "item 12" },
        { value: "13", text: "item 13" },
        { value: "14", text: "item 14" },
        { value: "15", text: "item 15" },
        { value: "16", text: "The internet44444444" },
        { value: "17", text: "The internet6666666" },
        { value: "18", text: "The internet99999999" },]
    };

    const moreData = [];
    for(let i = 0; i < 10000; i++) {
       moreData.push({
        value: i,
        text: `new item67777777777777777777777777777777777798888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888899999999999999999999999${i}`
       });
    }

    param.options = param.options.concat(moreData);

    let msg = this.state.msg ? <DivMessage style={{ marginTop: "20px", width: "100%" }} text={this.state.msg} type="success" /> : "";
    const [version, theme] = getDemoVersion();
    let data = [
      { text: 'Check', onClick: this.validate },
      { text: 'getValue', onClick: this.getValue },
      { text: 'Focus', onClick: this.focus },
      { text: 'clear', onClick: this.clear },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ "marginLeft": "20px", display: "inline-block" }}>
          <MultipleSelect ref={(select) => { this.select = select }} {...param} selectAll/>
          <ButtonGroup data={data}/>
          {msg}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectEventDemo />, mountNode);

```

```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ButtonGroup from 'eview-ui/ButtonGroup';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectEventDemo extends React.Component {

  state = {
    msg: "",
    value: [],
  };
  onChange = (value, changeValue) => {
    console.log(value);
    console.log(changeValue);
    this.setState({
      msg: "Current values: " + changeValue + " ,Select values: " + value.join(",") || "[]",
      value: value
    })
  };

  onFocus = (e) => {
    this.setState({
      msg: "On Focus",
    })
  };
  onBlur = (e) => {
    this.setState({
      msg: "on Blur",
    })
  };

  focus = () => {
    this.select.focus();
  };
  clear=()=>
  {
    this.setState({value: [] })
  }

  getValue = () => {
    let value = this.select.getValue();
    this.setState({
      msg: "getValue, Selected values are：" + value.join(",") || "[]",
      value: value
    })
  };
  validate = () => {
    this.select.validate();
    this.setState({
      msg: "Called validate interface"
    })
  };

  render() {
    const {
      id,
      ...other
    } = this.props;

    const param = {
      id:"demo_mulutiple_select",
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      delimiter:';',
      selectedIndex:this.state.slectData,
      disabled: false,
      label: "Multi-select drop-down box",
      value: this.state.value,
      required: true,
      useOption:true,
      isVirtualScroll: true,
      tipTextLimit: 1000,
      inputTextDisplayLimit: 1000,
      style: {"marginBottom": "20px", marginRight: "20px", verticalAlign: "top" },
      options: [
        { value: "1", text: "The internet" },
        { value: "2", text: "Network" },
        { value: "3", text: "item 03" },
        { value: "4", text: "item 04", disabled: true },
        { value: "5", text: "item 05" },
        { value: "6", text: "item 06" },
        { value: "7", text: "item 07" },
        { value: "8", text: "item 08" },
        { value: "9", text: "item 09" },
        { value: "10", text: "item 10" },
        { value: "11", text: "item 11" },
        { value: "12", text: "item 12" },
        { value: "13", text: "item 13" },
        { value: "14", text: "item 14" },
        { value: "15", text: "item 15" },
        { value: "16", text: "The internet44444444" },
        { value: "17", text: "The internet6666666" },
        { value: "18", text: "The internet99999999" },]
    };

    const moreData = [];
    for(let i = 0; i < 10000; i++) {
       moreData.push({
        value: i,
        text: `new item67777777777777777777777777777777777798888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888899999999999999999999999${i}`
       });
    }

    param.options = param.options.concat(moreData);

    let msg = this.state.msg ? <DivMessage style={{ marginTop: "20px", width: "100%" }} text={this.state.msg} type="success" /> : "";
    const [version, theme] = getDemoVersion();
    let data = [
      { text: 'Check', onClick: this.validate },
      { text: 'getValue', onClick: this.getValue },
      { text: 'Focus', onClick: this.focus },
      { text: 'clear', onClick: this.clear },
    ];
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ "marginLeft": "20px", display: "inline-block" }}>
          <MultipleSelect ref={(select) => { this.select = select }} {...param} selectAll/>
          <ButtonGroup data={data}/>
          {msg}
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectEventDemo />, mountNode);

```

### 可搜索选择框

## en-US



```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectSearchableDemo extends React.Component {

  state = {
    msg: "",
    value: []
  };
  onChange = (value, changeValue) => {
    this.setState({
      msg: "Current values: " + changeValue + " ,Select values: " + value.join(",") || "[]",
      value: value
    })
  };

  onFocus = (e) => {
    this.setState({
      msg: "On Focus",
    })
  };
  onBlur = (e) => {
    this.setState({
      msg: "on Blur",
    })
  };

  focus = () => {
    this.select.focus();
  };

  getValue = () => {
    let value = this.select.getValue();
    this.setState({
      msg: "getValue, Selected values are：" + value.join(",") || "[]",
      value: value
    })
  };
  validate = () => {
    this.select.validate();
    this.setState({
      msg: "Called validate interface"
    })
  };

  render() {
    const {
      id,
      ...other
    } = this.props;

    const param = {
      id:"demo_mulutiple_select",
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      label: "Multi-select searchable dropdown box",
      value: this.state.value,
      searchable: true,
      required: true,
      useOption:true,
      isVirtualScroll: true,
      style: {"marginBottom": "20px", marginRight: "20px", verticalAlign: "top" },
      options: [
        { value: "1", text: "The internet" },
        { value: "2", text: "Network" },
        { value: "3", text: "item 03" },
        { value: "4", text: "item 04" },
        { value: "5", text: "item 05" },
        { value: "6", text: "item 06" },
        { value: "7", text: "item 07" },
        { value: "8", text: "item 08" },
        { value: "9", text: "item 09" },
        { value: "10", text: "item 10" },
        { value: "11", text: "item 11" },
        { value: "12", text: "item 12" },
        { value: "13", text: "item 13" },
        { value: "14", text: "item 14" },
        { value: "15", text: "item 15" }]
    };

    let msg = this.state.msg ? <DivMessage style={{ marginTop: "20px", width: "100%" }} text={this.state.msg} type="success" /> : "";
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ "marginLeft": "20px", display: "inline-block" }}>
          <MultipleSelect ref={(select) => { this.select = select }} {...param} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectSearchableDemo />, mountNode);

```

```jsx
import MultipleSelect from 'eview-ui/MultipleSelect';
import DivMessage from 'eview-ui/DivMessage';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class MultipleSelectSearchableDemo extends React.Component {

  state = {
    msg: "",
    value: []
  };
  onChange = (value, changeValue) => {
    this.setState({
      msg: "Current values: " + changeValue + " ,Select values: " + value.join(",") || "[]",
      value: value
    })
  };

  onFocus = (e) => {
    this.setState({
      msg: "On Focus",
    })
  };
  onBlur = (e) => {
    this.setState({
      msg: "on Blur",
    })
  };

  focus = () => {
    this.select.focus();
  };

  getValue = () => {
    let value = this.select.getValue();
    this.setState({
      msg: "getValue, Selected values are：" + value.join(",") || "[]",
      value: value
    })
  };
  validate = () => {
    this.select.validate();
    this.setState({
      msg: "Called validate interface"
    })
  };

  render() {
    const {
      id,
      ...other
    } = this.props;

    const param = {
      id:"demo_mulutiple_select",
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      disabled: false,
      label: "Multi-select searchable dropdown box",
      value: this.state.value,
      searchable: true,
      required: true,
      useOption:true,
      isVirtualScroll: true,
      style: {"marginBottom": "20px", marginRight: "20px", verticalAlign: "top" },
      options: [
        { value: "1", text: "The internet" },
        { value: "2", text: "Network" },
        { value: "3", text: "item 03" },
        { value: "4", text: "item 04" },
        { value: "5", text: "item 05" },
        { value: "6", text: "item 06" },
        { value: "7", text: "item 07" },
        { value: "8", text: "item 08" },
        { value: "9", text: "item 09" },
        { value: "10", text: "item 10" },
        { value: "11", text: "item 11" },
        { value: "12", text: "item 12" },
        { value: "13", text: "item 13" },
        { value: "14", text: "item 14" },
        { value: "15", text: "item 15" }]
    };

    let msg = this.state.msg ? <DivMessage style={{ marginTop: "20px", width: "100%" }} text={this.state.msg} type="success" /> : "";
    const [version, theme] = getDemoVersion();

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{ "marginLeft": "20px", display: "inline-block" }}>
          <MultipleSelect ref={(select) => { this.select = select }} {...param} />
        </div>
      </ConfigProvider>
    )
  }
}

ReactDOM.render(<MultipleSelectSearchableDemo />, mountNode);

```

