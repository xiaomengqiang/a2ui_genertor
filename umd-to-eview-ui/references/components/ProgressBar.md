# ProgressBar 进度条

> 分类：反馈

进度条组件来表示一段加载过程,包含进度条与进度文本两部分，文本格式有百分比与分数。


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Progress` | `ProgressBar` | `percent`→**`current`**；`max` 默认 100；`showInfo`→`format="percent"`（或 `"steps"` 步骤型）；`strokeColor`→`barStyle`；`size` 无对应；`formatter(value, precision, format) => string` |

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id |  进度条组件最外层容器id表识 | string |  |
| format |  进度文本表示形式：百分比| enum:<br>&nbsp;"percent"<br>&nbsp;"steps"<br> | "percent" |
| current |  当前进度 | number | 0 |
| max |  最大值，默认值为100， | number | 100 |
| style |  进度条组件容器样式，应用于组件最外层容器 | object |  |
| barStyle |  进度条样式 | object |  |
| barBackStyle |  进度条背景样式 | object |  |
| Classname  |  进度条容器的自定义类名称 | string |  |
| labelPosition | 进度条标签位置 | enum:<br>&nbsp;"after"<br>&nbsp;"none"<br> | "after" |
| precision | 自定义 percent 类型进度条精度 , 0 时向下取整 | number | 0 |
| formatter | 自定义格式化value，format是百分比（percent）或步骤（steps），precision为精度；格式current与max值。签名:`(value: number, precision: number, format: string) => string` | function | - |

## 使用示例

### 基本属性设置

## en-US



```jsx
import ProgressBar from 'eview-ui/ProgressBar';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ProgressBarDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    const param1 = {
      format: "percent",
      id:"gee",
      current: 10,
    };
    const param1a = {
      format: "percent",
      current: 50,
    };
    const param1b = {
      format: "percent",
      current: 100,
      labelPosition: "none"
    };
    const param1c = {
      format: "percent",
      current: 100,
      labelPosition: "after"
    };
    const param2 = {
      format: "steps",
      current: 30,
      max: 80
    };
    const param3 = {
      format: "steps",
      current: 30,
      max: 80,
      style: {
        width: "200px",
        height: "50px"
      },
      barStyle: {
        background: "#03A9F4",
        height: "8px",
        borderRadius: "4px",
        margin: "-3px 0"
      },
      barBackStyle: {
        background: "#cccccc",
        height: "2px",
        borderRadius: "1px"
      }
    };

    let labelProps = {
      style: {
        display: "block",
        paddingLeft: "0px"
      }
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{margin: "20px"}}>
          <LabelField text={"Percentage progress bar"}  {...labelProps} /><ProgressBar {...param1} /><br/><br/>
          <LabelField text={"Percentage progress bar"}  {...labelProps} /><ProgressBar {...param1a} /><br/><br/>
          <LabelField text={"Percentage progress bar"}  {...labelProps} /><ProgressBar {...param1b} /><br/><br/>
          <LabelField text={"Stpes progress bar:"}  {...labelProps} /><ProgressBar {...param2} /><br/><br/>
          <LabelField text={"progress bar with classname"}  {...labelProps} /><ProgressBar
          className="progressClassNameTest" {...param1} /><br/><br/>
          <LabelField text={"Custom style:"}  {...labelProps} /><ProgressBar {...param3} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ProgressBarDemo />, mountNode);

```

```jsx
import ProgressBar from 'eview-ui/ProgressBar';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

export default class ProgressBarDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();

    const param1 = {
      format: "percent",
      id:"gee",
      current: 10,
    };
    const param1a = {
      format: "percent",
      current: 50,
    };
    const param1b = {
      format: "percent",
      current: 100,
      labelPosition: "none"
    };
    const param1c = {
      format: "percent",
      current: 100,
      labelPosition: "after"
    };
    const param2 = {
      format: "steps",
      current: 30,
      max: 80
    };
    const param3 = {
      format: "steps",
      current: 30,
      max: 80,
      style: {
        width: "200px",
        height: "50px"
      },
      barStyle: {
        background: "#03A9F4",
        height: "8px",
        borderRadius: "4px",
        margin: "-3px 0"
      },
      barBackStyle: {
        background: "#cccccc",
        height: "2px",
        borderRadius: "1px"
      }
    };

    let labelProps = {
      style: {
        display: "block",
        paddingLeft: "0px"
      }
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{margin: "20px"}}>
          <LabelField text={"Percentage progress bar"}  {...labelProps} /><ProgressBar {...param1} /><br/><br/>
          <LabelField text={"Percentage progress bar"}  {...labelProps} /><ProgressBar {...param1a} /><br/><br/>
          <LabelField text={"Percentage progress bar"}  {...labelProps} /><ProgressBar {...param1b} /><br/><br/>
          <LabelField text={"Stpes progress bar:"}  {...labelProps} /><ProgressBar {...param2} /><br/><br/>
          <LabelField text={"progress bar with classname"}  {...labelProps} /><ProgressBar
          className="progressClassNameTest" {...param1} /><br/><br/>
          <LabelField text={"Custom style:"}  {...labelProps} /><ProgressBar {...param3} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ProgressBarDemo />, mountNode);

```

### 进度条加载

## en-US



```jsx
import ProgressBar from 'eview-ui/ProgressBar';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

let initProgress = 0;

export default class ProgressBarDemo extends React.Component {

  state = {
    progress: initProgress,
    disabled: false,
  };

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
  onClick = () => {
    var instance = this;
    this.timer = setInterval(function () {
      if (initProgress == 80) {
        clearInterval(instance.timer);
        return;
      }
      else {
        instance.increase();
      }
    }, 100)

  };

  increase = () => {
    this.setState({
      progress: initProgress += 1,
      disabled: true
    });
  };

  render() {
    const [version, theme] = getDemoVersion();

    const param = {
      format: "steps",
      current: this.state.progress,
      max: 80,
      style: {
        width: "300px"
      },
      barStyle: {
        background: "#03A9F4",
        height: "8px",
        borderRadius: "4px",
        margin: "-3px 0"
      },
      barBackStyle: {
        background: "#cccccc",
        height: "2px",
        borderRadius: "1px"
      }
    };

    const param2 = {
      format: "percent",
      current: this.state.progress,
      max: 80,
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <Button text={"Start loading"} disabled={this.state.disabled} onClick={this.onClick}/>
          <br/><br/>
          <ProgressBar {...param} />
          <br/><br/>
          <ProgressBar {...param2} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ProgressBarDemo />, mountNode);

```

```jsx
import ProgressBar from 'eview-ui/ProgressBar';
import Button from 'eview-ui/Button';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';

let initProgress = 0;

export default class ProgressBarDemo extends React.Component {

  state = {
    progress: initProgress,
    disabled: false,
  };

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
  onClick = () => {
    var instance = this;
    this.timer = setInterval(function () {
      if (initProgress == 80) {
        clearInterval(instance.timer);
        return;
      }
      else {
        instance.increase();
      }
    }, 100)

  };

  increase = () => {
    this.setState({
      progress: initProgress += 1,
      disabled: true
    });
  };

  render() {
    const [version, theme] = getDemoVersion();

    const param = {
      format: "steps",
      current: this.state.progress,
      max: 80,
      style: {
        width: "300px"
      },
      barStyle: {
        background: "#03A9F4",
        height: "8px",
        borderRadius: "4px",
        margin: "-3px 0"
      },
      barBackStyle: {
        background: "#cccccc",
        height: "2px",
        borderRadius: "1px"
      }
    };

    const param2 = {
      format: "percent",
      current: this.state.progress,
      max: 80,
    };

    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <div style={{marginLeft: "20px"}}>
          <Button text={"Start loading"} disabled={this.state.disabled} onClick={this.onClick}/>
          <br/><br/>
          <ProgressBar {...param} />
          <br/><br/>
          <ProgressBar {...param2} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ProgressBarDemo />, mountNode);

```

