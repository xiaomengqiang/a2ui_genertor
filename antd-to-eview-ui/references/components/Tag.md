# Tag 标签

> 分类：数据展示

标签用于按特征、组织等维度来标记对象的分类信息，也可用于标记对象的某种状态。
注意：仅适用与ICT 3.1风格。

## API

### 属性

| 属性名       | 属性描述                                                                                                  | 类型                                                         | 默认值       |
|-----------|-------------------------------------------------------------------------------------------------------|------------------------------------------------------------|-----------|
| className | 自定义class改变tag的整体样式，作用于最外层div                                                                          | string                                                     |           |
| id        | 自定义id改变tag的整体样式，作用于最外层div                                                                             | string                                                     | 自动生成随机值   |
| children  | 子元素内容                                                                                                 | React.ReactNode                                            | -         |
| type      | Tag 类型，可选message、dot、status                                                                           | string                                                     | 'message' |
| color     | 填充颜色，可选：`default`、`primary`、`success`、`warning`、`danger`、`caution` 以及具体颜色值如“#ffffff”,仅 status和dot类型生效 | string                                                     | 'default' |
| onClick   | 标签点击事件，仅message tag生效， onClick设置后标签有可交互状态                                                             | (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void | -         |
| style     | 自定义的css变量样式                                                                                           | React.CSSProperties                                        | -         |
| size      | 设置组件的大小，'normal'为小尺寸, 'large'为大尺寸型,'defalt'为中等尺寸，dot类型不支持该属性                                          | 'small' \| 'normal' \| 'large'                             | 'normal' |
| onClose   | 设置message标签的关闭回调事件                                                                                    | (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void | -         |
| selected  | 设置message tag的选中状态                                                                                    | boolean                                                    | false     |
| disable   | 设置message tag的禁用状态                                                                                    | boolean                                                    | false     |

## 接口定义

```typescript
import type { MouseEvent } from 'react';
import React from 'react';

export enum TagType {
  Message = 'message',
  Dot = 'dot',
  Status = 'status'
}

export enum TagSize {
  Normal = 'normal',
  Large = 'large'
}

export interface TagProps {
  className?: string;
  id?: string;
  children?: React.ReactNode;
  type: TagType;
  color?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  size?: TagSize;
  onClose?: (e: MouseEvent) => void;
  selected?: boolean;
  disabled?: boolean;
}
```

## 使用示例

### 信息标签

## en-US



```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import Icon from 'eview-ui/Icon';


class TagExample extends React.Component {
  state = {
    selected: false
  };
  onCLick() {
    this.setState({
      selected: !this.state.selected
    })
  }
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tag type={"message"} style={{marginRight: "2rem"}}>
            Tag
          </Tag>
          <Tag type={"message"} hasIcon={true} style={{marginRight: "2rem"}}>
            <span style={{display: 'inline-block', verticalAlign: 'middle', marginRight: "0.125rem"}}><Icon size={[12, 12]} name="calender" hoverColor="#191919"/></span>
              Tag
          </Tag>
          <Tag type={"message"} onClick={()=>{this.onCLick()}} selected={this.state.selected} style={{marginRight: "2rem"}} onClose={()=>{}}>
            Active Tag
          </Tag>
          <Tag type={"message"} disable>
            Disabled Tag
          </Tag>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TagExample />, mountNode);

```

```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import Icon from 'eview-ui/Icon';


class TagExample extends React.Component {
  state = {
    selected: false
  };
  onCLick() {
    this.setState({
      selected: !this.state.selected
    })
  }
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tag type={"message"} style={{marginRight: "2rem"}}>
            Tag
          </Tag>
          <Tag type={"message"} hasIcon={true} style={{marginRight: "2rem"}}>
            <span style={{display: 'inline-block', verticalAlign: 'middle', marginRight: "0.125rem"}}><Icon size={[12, 12]} name="calender" hoverColor="#191919"/></span>
              Tag
          </Tag>
          <Tag type={"message"} onClick={()=>{this.onCLick()}} selected={this.state.selected} style={{marginRight: "2rem"}} onClose={()=>{}}>
            Active Tag
          </Tag>
          <Tag type={"message"} disable>
            Disabled Tag
          </Tag>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TagExample />, mountNode);

```

### 状态标签

## en-US



```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TagExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tag type="status" color="default" style={{marginRight: "1rem"}}>default</Tag>
          <Tag type="status" color="primary" style={{marginRight: "1rem"}}>primary</Tag>
          <Tag type="status" color="success" style={{marginRight: "1rem"}}>success</Tag>
          <Tag type="status" color="warning" style={{marginRight: "1rem"}}>warning</Tag>
          <Tag type="status" color="caution" style={{marginRight: "1rem"}}>caution</Tag>
          <Tag type="status" color="danger" style={{marginRight: "1rem"}}>danger</Tag>
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<TagExample />, mountNode);
```

```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TagExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tag type="status" color="default" style={{marginRight: "1rem"}}>default</Tag>
          <Tag type="status" color="primary" style={{marginRight: "1rem"}}>primary</Tag>
          <Tag type="status" color="success" style={{marginRight: "1rem"}}>success</Tag>
          <Tag type="status" color="warning" style={{marginRight: "1rem"}}>warning</Tag>
          <Tag type="status" color="caution" style={{marginRight: "1rem"}}>caution</Tag>
          <Tag type="status" color="danger" style={{marginRight: "1rem"}}>danger</Tag>
        </div>
      </ConfigProvider>
    );
  }
}


ReactDOM.render(<TagExample />, mountNode);
```

### 圆点标签

## en-US



```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import Icon from 'eview-ui/Icon';


class TagExample extends React.Component {
  state = {
    selected: false
  };
  onCLick() {
    this.setState({
      selected: !this.state.selected
    })
  }
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tag type="dot" color="default" style={{marginRight: "1rem"}}>default</Tag>
          <Tag type="dot" color="primary" style={{marginRight: "1rem"}}>primary</Tag>
          <Tag type="dot" color="success" style={{marginRight: "1rem"}}>success</Tag>
          <Tag type="dot" color="warning" style={{marginRight: "1rem"}}>warning</Tag>
          <Tag type="dot" color="caution" style={{marginRight: "1rem"}}>caution</Tag>
          <Tag type="dot" color="danger" style={{marginRight: "1rem"}}>danger</Tag>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TagExample />, mountNode);

```

```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import Icon from 'eview-ui/Icon';


class TagExample extends React.Component {
  state = {
    selected: false
  };
  onCLick() {
    this.setState({
      selected: !this.state.selected
    })
  }
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
          <Tag type="dot" color="default" style={{marginRight: "1rem"}}>default</Tag>
          <Tag type="dot" color="primary" style={{marginRight: "1rem"}}>primary</Tag>
          <Tag type="dot" color="success" style={{marginRight: "1rem"}}>success</Tag>
          <Tag type="dot" color="warning" style={{marginRight: "1rem"}}>warning</Tag>
          <Tag type="dot" color="caution" style={{marginRight: "1rem"}}>caution</Tag>
          <Tag type="dot" color="danger" style={{marginRight: "1rem"}}>danger</Tag>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TagExample />, mountNode);

```

### 尺寸

## en-US



```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TagExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
            <Tag type="status" size="large" style={{marginRight: "2rem"}}> large </Tag>
            <Tag type="status" style={{marginRight: "2rem"}}> default </Tag>
            <Tag type="status" size="small">small </Tag>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TagExample />, mountNode);
```

```jsx
import Tag from 'eview-ui/Tag';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

class TagExample extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <div>
            <Tag type="status" size="large" style={{marginRight: "2rem"}}> large </Tag>
            <Tag type="status" style={{marginRight: "2rem"}}> default </Tag>
            <Tag type="status" size="small">small </Tag>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<TagExample />, mountNode);
```

