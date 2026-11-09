# Wizards 步骤条

> 分类：导航

给输入的内容分类，按步骤呈现。建议不超过 5 步。

## API

### 属性

| 属性名称     | 描述                                                                                                                                                   | 输入    | 默认  |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :---- |
| id           | 外层容器 id                                                                                                                                            | string  |       |
| style        | 外层容器样式                                                                                                                                           | object  |       |
| className    | 外层容器 class, 自定义垂直步骤条，可以使用它设置宽高。                                                                                                                                        | string  |       |
| disabled     | 是否禁用                                                                                                                                               | boolean |       |
| currentStep  | 当前进行到的步骤,对应 data 中的 value 值，默认为第一步                                                                                                 | string  |       |
| data         | 导航内容，data = [{text: "Basic Information",value:"1", description:"1"},{text: "Condition",value:"2",description:"2"},{text: "Action",value:"3",description:"2"}] 不配置 value 时序号默认为 1、2、3..., description为辅助文本（可选） | array   |       |
| isCustomStep | 是否自定义步骤条                                                                                                                                       | bool    | false |
| isBacktrackable | 是否回溯步骤，仅箭头型步骤条支持(需业务限制中间无跳过步骤) ，且data中的value为主键不重复。                                                                                                                                     | bool    | false |

### 自定义步骤条属性

| 属性名称         | 描述                                                                                                                                                                                             | 输入                | 默认         |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ | :----------- | --- | --- | --- |
| id               | 外层容器 id                                                                                                                                                                                      | string              |              |
| disabled         | 是否禁用                                                                                                                                                                                         | boolean             |              |
| currentStep      | 当前进行到的步骤,对应 data 中的 value 值，默认为第一步                                                                                                                                           | string              |              |
| data             | 导航内容，data = [{text: "Basic Information",value:"1"， description："test", onStepClick:()=>{}},{text: "Condition",value:"2"},{text: "Action",value:"3"}] 不配置 value 时序号默认为 1、2、3... | array               |              |
| titleStyle       | 可以设置标题的样，注意设置 maxwidth 要适配不同分辨率。                                                                                                                                        | React.CSSProperties |              |
| descriptionStyle | 可以设置所有辅助文本样， 注意设置 maxwidth 要适配不同分辨率。                                                                                                                                  | React.CSSProperties
| size             | 设置步骤条尺寸，包括大中小与 最小,配置值'large'（大）,'medium'(中）,'small'(小),'mini'(最小)                                                                                                     | string              | 'medium'     |     |     |     |
| orientation      | 设置步骤条尺寸，包括水平与垂直，配置值'horizontal'(水平),'vertical'(垂直) 
| isArrowType      | 是否支持箭头型步骤条， 仅支持水平。                                     | bool              | false |     |     |     |

### 自定义步骤条 data 属性

| 属性名称    | 描述                                                                                                                                                 | 输入                    | 默认 |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------- | :--- |
| text        | 步骤标题                                                                                                                                             | string                  |      |
| value       | 步骤 value                                                                                                                                           | string                  |      |
| description | 辅助文本内容                                                                                                                                         | string                  |      |
| onStepClick | 步骤选中事件,可以设置点击选中                                                                                                                        | onStepClick:(index)=>{} |      |
| status      | 步骤状态，可选字段，目前仅支持 error，表示错误状态。                                                                                                 | string                  |      |
| iconName    | 使用 icon 图标库已有的图标，参考 icon 组件                                                                                                           | string                  |      |
| customIcon  | 使用本地的 icon, customIcon 与 iconName 同时使用时 customIcon 生效。| string                  |      |
| customDescription  | 支持自定义辅助文本（仅自定义步骤条，配置自定义函数）, 同时配置description，仅customDescription生效。 | () => ReactNode                  |      |

## 使用示例

### 基本属性设置

## en-US

```jsx
import Wizards from 'eview-ui/Wizards';
import PageMessage from 'eview-ui/PageMessage';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import huaweiIcon from '@images/huawei';
import salescatalogIcon from '@images/salescatalog';

export default class WizardsDemo extends React.Component {
  state = {
    index: 1,
    disabled: false,
  };
  next = () => {
    this.setState({
      index: this.state.index + 1,
    });
  };
  pre = () => {
    this.setState({
      index: this.state.index - 1,
    });
  };

  data = [
    { text: '步骤一', value: '1', description: '辅助文本1' },
    { text: '步骤二', value: '2', description: '辅助文本2' },
    { text: '步骤三', value: '3', description: '辅助文本3' },
    { text: '步骤四', value: '4', description: '辅助文本4' },
    { text: '步骤五', value: '5', description: '辅助文本5'},
  ];

  render() {
    const param = {
      data: this.data,
      currentStep: this.data[this.state.index].value,
    };
    const { disabled } = this.state;
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <LabelField text='默认步骤条：' style={{ display: 'block', fontWeight: 'bold' }} />
        <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
          <Wizards {...param} className='eui_wizard_container_sm' disabled={disabled} />
          <br />
          <Button
            onClick={() => this.setState({ disabled: !disabled })}
            text={'disabled'}
            style={{ marginRight: '20px' }}
          >
            disabled
          </Button>
          <Button
            onClick={this.pre}
            text={'Previous'}
            style={{ marginRight: '20px' }}
            disabled={this.state.index === 0 || disabled}
          />
          <Button onClick={this.next} text={'Next'} disabled={this.state.index === this.data.length - 1 || disabled} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<WizardsDemo />, mountNode);
```

```jsx
import Wizards from 'eview-ui/Wizards';
import PageMessage from 'eview-ui/PageMessage';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import huaweiIcon from '@images/huawei';
import salescatalogIcon from '@images/salescatalog';

export default class WizardsDemo extends React.Component {
  state = {
    index: 1,
    disabled: false,
  };
  next = () => {
    this.setState({
      index: this.state.index + 1,
    });
  };
  pre = () => {
    this.setState({
      index: this.state.index - 1,
    });
  };

  data = [
    { text: '步骤一', value: '1', description: '辅助文本1' },
    { text: '步骤二', value: '2', description: '辅助文本2' },
    { text: '步骤三', value: '3', description: '辅助文本3' },
    { text: '步骤四', value: '4', description: '辅助文本4' },
    { text: '步骤五', value: '5', description: '辅助文本5'},
  ];

  render() {
    const param = {
      data: this.data,
      currentStep: this.data[this.state.index].value,
    };
    const { disabled } = this.state;
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <LabelField text='默认步骤条：' style={{ display: 'block', fontWeight: 'bold' }} />
        <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
          <Wizards {...param} className='eui_wizard_container_sm' disabled={disabled} />
          <br />
          <Button
            onClick={() => this.setState({ disabled: !disabled })}
            text={'disabled'}
            style={{ marginRight: '20px' }}
          >
            disabled
          </Button>
          <Button
            onClick={this.pre}
            text={'Previous'}
            style={{ marginRight: '20px' }}
            disabled={this.state.index === 0 || disabled}
          />
          <Button onClick={this.next} text={'Next'} disabled={this.state.index === this.data.length - 1 || disabled} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<WizardsDemo />, mountNode);
```

### 自定义步骤条

## en-US

```jsx
import Wizards from 'eview-ui/Wizards';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import huaweiIcon from '@images/huawei';
import salescatalogIcon from '@images/salescatalog';

export default class WizardsDemo extends React.Component {
  state = {
    disabled: false,
    customIndex: 1,
  };

  customNext = () => {
    this.setState({
      customIndex: this.state.customIndex + 1,
    });
  };
  customPre = () => {
    this.setState({
      customIndex: this.state.customIndex - 1,
    });
  };

  customData = [
    {
      text: '步骤一',
      description: '辅助文本1, 这里的图标是本地的图标，图标自带底色，无法更换颜色，不建议用深色底色图标。',
      value: '1',
      iconName: 'file',
      customIcon: huaweiIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 0,
        });
        console.log('选择步骤一');
      },
    },
    {
      text: '步骤二',
      description:
        '这是一个iconName的图标folder, error状态的步骤。你可以选择跳过error步骤也可以设置onStepOnClick卡点。',
      value: '2',
      iconName: 'folder',
      customIcon: '',
      status: 'error',
      onStepClick: event => {
        this.setState({
          customIndex: 1,
        });
        console.log('选择步骤二');
      },
    },
    {
      text: '步骤三',
      description:
        '可以设置titleStyle设置标题样式，包括文本超长、字体颜色、多行显示等css样式，也可以通过设置descriptionStyle设置辅助标题样式。',
      value: '3',
      iconName: 'operation',
      customIcon: '',
      customDescription: () => {
        return this.customData.map((item, index) => {
          const dom =
            index === this.state.customIndex ? (
              <span style={{ color: 'red' }}>{item.text}</span>
            ) : (
              <span>{item.text}</span>
            );
          const str = ' > ';
          return (
            <span key={index}>
              {dom}
              {index < this.customData.length - 1 && (
                <span style={{ marginRight: '0.5rem', marginLeft: '0.5rem' }}>{str}</span>
              )}
            </span>
          );
        });
      },
      onStepClick: event => {
        this.setState({
          customIndex: 2,
        });
        console.log('选择步骤三');
      },
    },
    {
      text: '步骤四',
      description: '辅助文本4，这是一个本地图标。同样支持自定义辅助文本样式。',
      value: '4',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 3,
        });
        console.log('选择步骤四');
      },
    },
  ];

  render() {
    const customParams = {
      data: this.customData,
      currentStep: this.customData[this.state.customIndex].value,
      onClick: this.onClick,
    };
    const { disabled } = this.state;
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <LabelField text='自定义步骤条：' style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }} />
        <Wizards
          {...customParams}
          className='eui_wizard_container_sm'
          isCustomStep
          disabled={disabled}
          size={'medium'}
          orientation={'horizontal'}
        />
        <div style={{ marginTop: '20px' }}>
          <Button
            onClick={() => this.setState({ disabled: !disabled })}
            text={'disabled'}
            style={{ marginRight: '20px' }}
          >
            disabled
          </Button>
          <Button
            onClick={this.customPre}
            text={'Previous'}
            style={{ marginRight: '20px' }}
            disabled={this.state.customIndex === 0 || disabled}
          />
          <Button
            onClick={this.customNext}
            text={'Next'}
            disabled={this.state.customIndex === this.customData.length - 1 || disabled}
          />
          <div style={{ marginTop: '1rem' }}>
            <LabelField
              text=' 注：1.支持传入description的descriptionStyle定义辅助文本样式(如单行显示或字体显示等,
            默认多行展示)。2.iconName表示支持已入库eview icon的图标，可设置iconName。
            如果使用本地图标使用customIcon。3.仅展示标题可以不设置iconName与customIcon。3.Wizards是均分步骤，如果不需要全铺可使用div包裹wizard组件设置父容器的宽度。'
              style={{ display: 'block', paddingBottom: '1rem', whiteSpace: 'normal' }}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<WizardsDemo />, mountNode);
```

```jsx
import Wizards from 'eview-ui/Wizards';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import huaweiIcon from '@images/huawei';
import salescatalogIcon from '@images/salescatalog';

export default class WizardsDemo extends React.Component {
  state = {
    disabled: false,
    customIndex: 1,
  };

  customNext = () => {
    this.setState({
      customIndex: this.state.customIndex + 1,
    });
  };
  customPre = () => {
    this.setState({
      customIndex: this.state.customIndex - 1,
    });
  };

  customData = [
    {
      text: '步骤一',
      description: '辅助文本1, 这里的图标是本地的图标，图标自带底色，无法更换颜色，不建议用深色底色图标。',
      value: '1',
      iconName: 'file',
      customIcon: huaweiIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 0,
        });
        console.log('选择步骤一');
      },
    },
    {
      text: '步骤二',
      description:
        '这是一个iconName的图标folder, error状态的步骤。你可以选择跳过error步骤也可以设置onStepOnClick卡点。',
      value: '2',
      iconName: 'folder',
      customIcon: '',
      status: 'error',
      onStepClick: event => {
        this.setState({
          customIndex: 1,
        });
        console.log('选择步骤二');
      },
    },
    {
      text: '步骤三',
      description:
        '可以设置titleStyle设置标题样式，包括文本超长、字体颜色、多行显示等css样式，也可以通过设置descriptionStyle设置辅助标题样式。',
      value: '3',
      iconName: 'operation',
      customIcon: '',
      customDescription: () => {
        return this.customData.map((item, index) => {
          const dom =
            index === this.state.customIndex ? (
              <span style={{ color: 'red' }}>{item.text}</span>
            ) : (
              <span>{item.text}</span>
            );
          const str = ' > ';
          return (
            <span key={index}>
              {dom}
              {index < this.customData.length - 1 && (
                <span style={{ marginRight: '0.5rem', marginLeft: '0.5rem' }}>{str}</span>
              )}
            </span>
          );
        });
      },
      onStepClick: event => {
        this.setState({
          customIndex: 2,
        });
        console.log('选择步骤三');
      },
    },
    {
      text: '步骤四',
      description: '辅助文本4，这是一个本地图标。同样支持自定义辅助文本样式。',
      value: '4',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 3,
        });
        console.log('选择步骤四');
      },
    },
  ];

  render() {
    const customParams = {
      data: this.customData,
      currentStep: this.customData[this.state.customIndex].value,
      onClick: this.onClick,
    };
    const { disabled } = this.state;
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <LabelField text='自定义步骤条：' style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }} />
        <Wizards
          {...customParams}
          className='eui_wizard_container_sm'
          isCustomStep
          disabled={disabled}
          size={'medium'}
          orientation={'horizontal'}
        />
        <div style={{ marginTop: '20px' }}>
          <Button
            onClick={() => this.setState({ disabled: !disabled })}
            text={'disabled'}
            style={{ marginRight: '20px' }}
          >
            disabled
          </Button>
          <Button
            onClick={this.customPre}
            text={'Previous'}
            style={{ marginRight: '20px' }}
            disabled={this.state.customIndex === 0 || disabled}
          />
          <Button
            onClick={this.customNext}
            text={'Next'}
            disabled={this.state.customIndex === this.customData.length - 1 || disabled}
          />
          <div style={{ marginTop: '1rem' }}>
            <LabelField
              text=' 注：1.支持传入description的descriptionStyle定义辅助文本样式(如单行显示或字体显示等,
            默认多行展示)。2.iconName表示支持已入库eview icon的图标，可设置iconName。
            如果使用本地图标使用customIcon。3.仅展示标题可以不设置iconName与customIcon。3.Wizards是均分步骤，如果不需要全铺可使用div包裹wizard组件设置父容器的宽度。'
              style={{ display: 'block', paddingBottom: '1rem', whiteSpace: 'normal' }}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<WizardsDemo />, mountNode);
```

### 箭头型步骤条

## en-US

```jsx
import Wizards from 'eview-ui/Wizards';
import PageMessage from 'eview-ui/PageMessage';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import huaweiIcon from '@images/huawei';
import salescatalogIcon from '@images/salescatalog';

export default class WizardsDemo extends React.Component {
  state = {
    index: 1,
    disabled: false,
    customIndex: 1,
  };
  next = () => {
    this.setState({
      index: this.state.index + 1,
    });
  };
  pre = () => {
    this.setState({
      index: this.state.index - 1,
    });
  };

  customNext = () => {
    this.setState({
      customIndex: this.state.customIndex + 1,
    });
  };
  customPre = () => {
    this.setState({
      customIndex: this.state.customIndex - 1,
    });
  };

  customData = [
    {
      text: '步骤一',
      value: '1',
      iconName: 'file',
      customIcon: huaweiIcon,
      onStepClick: event => {
        this.setState({
          index: 0,
        });
        console.log('选择步骤一');
      },
    },
    {
      text: '步骤二',
      value: '2',
      iconName: 'folder',
      customIcon: '',
      status: 'error',
      onStepClick: event => {
        this.setState({
          index: 1,
        });
        console.log('选择步骤二');
      },
    },
    {
      text: '步骤三',
      value: '3',
      iconName: 'operation',
      customIcon: '',
      onStepClick: event => {
        this.setState({
          index: 2,
        });
        console.log('选择步骤三');
      },
    },
    {
      text: '步骤四',
      value: '4',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          index: 3,
        });
        console.log('选择步骤四');
      },
    },
    {
      text: '步骤五',
      value: '5',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          index: 4,
        });
        console.log('选择步骤五');
      },
    },
  ];

  customData2 = [
    {
      text: '步骤一',
      description: '辅助文本1',
      value: '1',
      iconName: 'file',
      customIcon: huaweiIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 0,
        });
        console.log('选择步骤一');
      },
    },
    {
      text: '步骤二',
      description: '辅助文本2',
      value: '2',
      iconName: 'folder',
      customIcon: '',
      status: 'error',
      onStepClick: event => {
        this.setState({
          customIndex: 1,
        });
        console.log('选择步骤二');
      },
    },
    {
      text: '步骤三',
      description: '辅助文本3',
      value: '3',
      iconName: 'operation',
      customIcon: '',
      onStepClick: event => {
        this.setState({
          customIndex: 2,
        });
        console.log('选择步骤三');
      },
    },
    {
      text: '步骤四',
      description: '辅助文本4',
      value: '4',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 3,
        });
        console.log('选择步骤四');
      },
    },
    {
      text: '步骤五',
      description: '辅助文本5',
      value: '5',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 4,
        });
        console.log('选择步骤五');
      },
    },
  ];

  render() {
    const customParams = {
      data: this.customData,
      currentStep: this.customData[this.state.index].value,
      onClick: this.onClick,
    };

    const customParams2 = {
      data: this.customData2,
      currentStep: this.customData2[this.state.customIndex].value,
      onClick: this.onClick,
    };
    const { disabled } = this.state;
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <LabelField
          text='箭头型步骤条(仅标题）：'
          style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }}
        />
        <Wizards
          {...customParams}
          className='eui_wizard_container_sm'
          isCustomStep
          isArrowType
          disabled={disabled}
          size={'medium'}
          orientation={'horizontal'}
        />
        <div style={{ marginTop: '20px' }}>
          <Button
            onClick={() => this.setState({ disabled: !disabled })}
            text={'disabled'}
            style={{ marginRight: '20px' }}
          >
            disabled
          </Button>
          <Button
            onClick={this.pre}
            text={'Previous'}
            style={{ marginRight: '20px' }}
            disabled={this.state.index === 0 || disabled}
          />
          <Button
            onClick={this.next}
            text={'Next'}
            disabled={this.state.index === this.customData.length - 1 || disabled}
          />
        </div>

        <LabelField
          text='自定义箭头型(标题+辅助文本）：'
          style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }}
        />
        <Wizards
          {...customParams2}
          className='eui_wizard_container_sm'
          isCustomStep
          isArrowType
          size={'medium'}
          orientation={'horizontal'}
        />
        <div style={{ marginTop: '1rem' }}>
          <LabelField
            text='注:点击步骤条，会触发onStepClick事件，在onStepClick事件中适配选中步骤。'
            style={{ display: 'block', paddingBottom: '1rem', whiteSpace: 'normal'}}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<WizardsDemo />, mountNode);
```

```jsx
import Wizards from 'eview-ui/Wizards';
import PageMessage from 'eview-ui/PageMessage';
import Button from 'eview-ui/Button';
import LabelField from 'eview-ui/LabelField';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import huaweiIcon from '@images/huawei';
import salescatalogIcon from '@images/salescatalog';

export default class WizardsDemo extends React.Component {
  state = {
    index: 1,
    disabled: false,
    customIndex: 1,
  };
  next = () => {
    this.setState({
      index: this.state.index + 1,
    });
  };
  pre = () => {
    this.setState({
      index: this.state.index - 1,
    });
  };

  customNext = () => {
    this.setState({
      customIndex: this.state.customIndex + 1,
    });
  };
  customPre = () => {
    this.setState({
      customIndex: this.state.customIndex - 1,
    });
  };

  customData = [
    {
      text: '步骤一',
      value: '1',
      iconName: 'file',
      customIcon: huaweiIcon,
      onStepClick: event => {
        this.setState({
          index: 0,
        });
        console.log('选择步骤一');
      },
    },
    {
      text: '步骤二',
      value: '2',
      iconName: 'folder',
      customIcon: '',
      status: 'error',
      onStepClick: event => {
        this.setState({
          index: 1,
        });
        console.log('选择步骤二');
      },
    },
    {
      text: '步骤三',
      value: '3',
      iconName: 'operation',
      customIcon: '',
      onStepClick: event => {
        this.setState({
          index: 2,
        });
        console.log('选择步骤三');
      },
    },
    {
      text: '步骤四',
      value: '4',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          index: 3,
        });
        console.log('选择步骤四');
      },
    },
    {
      text: '步骤五',
      value: '5',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          index: 4,
        });
        console.log('选择步骤五');
      },
    },
  ];

  customData2 = [
    {
      text: '步骤一',
      description: '辅助文本1',
      value: '1',
      iconName: 'file',
      customIcon: huaweiIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 0,
        });
        console.log('选择步骤一');
      },
    },
    {
      text: '步骤二',
      description: '辅助文本2',
      value: '2',
      iconName: 'folder',
      customIcon: '',
      status: 'error',
      onStepClick: event => {
        this.setState({
          customIndex: 1,
        });
        console.log('选择步骤二');
      },
    },
    {
      text: '步骤三',
      description: '辅助文本3',
      value: '3',
      iconName: 'operation',
      customIcon: '',
      onStepClick: event => {
        this.setState({
          customIndex: 2,
        });
        console.log('选择步骤三');
      },
    },
    {
      text: '步骤四',
      description: '辅助文本4',
      value: '4',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 3,
        });
        console.log('选择步骤四');
      },
    },
    {
      text: '步骤五',
      description: '辅助文本5',
      value: '5',
      iconName: '',
      customIcon: salescatalogIcon,
      onStepClick: event => {
        this.setState({
          customIndex: 4,
        });
        console.log('选择步骤五');
      },
    },
  ];

  render() {
    const customParams = {
      data: this.customData,
      currentStep: this.customData[this.state.index].value,
      onClick: this.onClick,
    };

    const customParams2 = {
      data: this.customData2,
      currentStep: this.customData2[this.state.customIndex].value,
      onClick: this.onClick,
    };
    const { disabled } = this.state;
    const [version, theme] = getDemoVersion();
    return (
      // 【重要】业务中使用当前组件不需要添加引用ConfigProvider组件的代码（ConfigProvider是全局组件,当前demo引用ConfigProvider仅用作ICT 3.0 组件样式演示使用）
      <ConfigProvider version={version} theme={theme}>
        <LabelField
          text='箭头型步骤条(仅标题）：'
          style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }}
        />
        <Wizards
          {...customParams}
          className='eui_wizard_container_sm'
          isCustomStep
          isArrowType
          disabled={disabled}
          size={'medium'}
          orientation={'horizontal'}
        />
        <div style={{ marginTop: '20px' }}>
          <Button
            onClick={() => this.setState({ disabled: !disabled })}
            text={'disabled'}
            style={{ marginRight: '20px' }}
          >
            disabled
          </Button>
          <Button
            onClick={this.pre}
            text={'Previous'}
            style={{ marginRight: '20px' }}
            disabled={this.state.index === 0 || disabled}
          />
          <Button
            onClick={this.next}
            text={'Next'}
            disabled={this.state.index === this.customData.length - 1 || disabled}
          />
        </div>

        <LabelField
          text='自定义箭头型(标题+辅助文本）：'
          style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }}
        />
        <Wizards
          {...customParams2}
          className='eui_wizard_container_sm'
          isCustomStep
          isArrowType
          size={'medium'}
          orientation={'horizontal'}
        />
        <div style={{ marginTop: '1rem' }}>
          <LabelField
            text='注:点击步骤条，会触发onStepClick事件，在onStepClick事件中适配选中步骤。'
            style={{ display: 'block', paddingBottom: '1rem', whiteSpace: 'normal'}}
          />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<WizardsDemo />, mountNode);
```

