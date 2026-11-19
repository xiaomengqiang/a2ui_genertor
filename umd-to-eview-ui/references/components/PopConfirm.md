# PopConfirm 气泡确认框

> 分类：数据展示

PopConfirm 组件，是一个气泡确认框组件，用于在用户执行某些操作前，弹出一个小型的确认提示框，防止误操作。它通常用于删除、提交、取消等关键操作。
</br>
**注意：仅适用于 ICT 3.1 风格。**


## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Popconfirm` | `PopConfirm` | `title` 同名；`description`→**`content`**；`onConfirm`/`onCancel` 同名；`icon`→`type`（7 枚举同 MessageDialog）；`okText`/`cancelText`→按钮模式 `confirmButton`/`cancelButton` 对象 `{text, status}` 或文本模式 `confirmText`/`cancelText`（`mode="text"`）；**仅 ICT 3.1 风格**；placement 12 值 |

## API

### 属性

| 属性名称      | 描述                                                                                                                   | 类型                                                                                                                                 | 默认     |
| :------------ | :--------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :------- |
| title         | 确认框标题                                                                                                             | string                                                                                                                               |         |
| content       | 确认框内容                                                                                                             | string                                                                                                                               |         |
| mode          | 确认框底部按钮模式，'text'为文本链接模式，'Button'为按钮模式                                  | 'text' 或 'Button'                                                                                                                   | 'Button' |
| placement     | 气泡框位置，可选 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom | string                                                                                                                               | top      |
| confirmButton | 确认按钮配置，包括 text 与 status（mode='Button'时生效）                                                               | `{ text?: string, status?: string }`                                                                                                 | `{}`     |
| cancelButton  | 取消按钮配置，包括 text 与 status（mode='Button'时生效）                                                               | `{ text?: string, status?: string }`                                                                                                 | `{}`     |
| confirmText   | 确认文本（mode='text'时生效）                                                                                          | string                                                                                                                               | 国际化默认值 |
| cancelText    | 取消文本（mode='text'时生效）                                                                                          | string                                                                                                                               | 国际化默认值 |
| onConfirm     | 点击确认按钮/文本时的回调                                                                                              | `() => void`                                                                                                                         |         |
| onCancel      | 点击取消按钮/文本时的回调                                                                                              | `() => void`                                                                                                                         |         |
| type          | 提示框的提示类型                                                                                                       | enum:<br>&nbsp;'highRisk'<br>&nbsp;'risk'<br>&nbsp;'error'<br>&nbsp;'info'<br>&nbsp;'warn'<br>&nbsp;'confirm'<br>&nbsp;'success'<br> |         |
| customContent | 弹窗自定义内容，传入时覆盖默认内容区                                                                                   | React.ReactNode                                                                                                                      |         |
| popStyle      | 气泡框自定义样式，例如设置宽度                                                                                         | React.CSSProperties                                                                                                                  |         |
| version       | 组件版本，用于样式适配                                                                                                 | string                                                                                                                               |         |
| children      | 触发元素（必需）                                                                                                       | React.ReactNode                                                                                                                      |         |

## 使用示例

### 纯文本

```jsx
import PopConfirm from 'eview-ui/PopConfirm';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import LabelField from 'eview-ui/LabelField';

export default class PopConfirmDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <LabelField
          text='纯文本 + 自定义宽度'
          style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }}
        />
        <div style={{ display: 'flex', marginLeft: '40px', justifyContent: 'center', gap: '400px' }}>
          <PopConfirm
            content='这是一段描述文本。可以承载复杂的内容与操作，多行文本内容效果。'
            placement={'top'}
            confirmButton={{
              text: '确认',
              status: 'primary',
            }}
            cancelButton={{
              text: '取消',
            }}
            popStyle={{ width: '16rem' }}
            onConfirm={() => console.log('confirm')}
            onCancel={() => console.log('cancel')}
          >
            <div style={{ color: '#004EA8' }}>Button按钮</div>
          </PopConfirm>

          <PopConfirm
            content='这是一段描述文本。可以承载复杂的内容与操作，多行文本内容效果。'
            placement={'right'}
            mode={'text'}
            confirmText={'文本按钮'}
            cancelText={'文本按钮'}
            onConfirm={() => console.log('confirm')}
            onCancel={() => console.log('cancel')}
          >
            <div style={{ color: '#004EA8' }}>文本按钮</div>
          </PopConfirm>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PopConfirmDemo />, mountNode);
```

### 带标题

```jsx
import PopConfirm from 'eview-ui/PopConfirm';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import LabelField from 'eview-ui/LabelField';

export default class PopConfirmDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <LabelField text='带标题' style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }} />
        <div style={{ display: 'flex', marginLeft: '40px', justifyContent: 'center', gap: '400px' }}>
          <PopConfirm
            title='气泡标题'
            content='这是一段描述文本。可以承载复杂的内容与操作，多行文本内容效果。'
            placement={'right'}
            onConfirm={() => console.log('确认')}
            onCancel={() => console.log('取消')}
          >
            <div style={{ color: '#004EA8' }}>带标题按钮</div>
          </PopConfirm>
          <PopConfirm
            title='气泡标题'
            content='这是一段描述文本。可以承载复杂的内容与操作，多行文本内容效果。'
            placement={'right'}
            mode={'text'}
            onConfirm={() => console.log('确认')}
            onCancel={() => console.log('取消')}
          >
            <div style={{ color: '#004EA8' }}>带标题文本按钮</div>
          </PopConfirm>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PopConfirmDemo />, mountNode);
```

### 带图标

```jsx
import PopConfirm from 'eview-ui/PopConfirm';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import LabelField from 'eview-ui/LabelField';

export default class PopConfirmDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <LabelField text='带图标' style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }} />
        <div style={{ display: 'flex', marginLeft: '40px', justifyContent: 'center', gap: '400px' }}>
          <PopConfirm
            title='气泡标题'
            content='这是一段描述文本。可以承载复杂的内容与操作，多行文本内容效果。'
            placement={'right'}
            type={'info'}
            onConfirm={() => console.log('确认')}
            onCancel={() => console.log('取消')}
          >
            <div style={{ color: '#004EA8' }}>带图标按钮</div>
          </PopConfirm>
          <PopConfirm
            title='气泡标题'
            content='这是一段描述文本。可以承载复杂的内容与操作，多行文本内容效果。'
            placement={'right'}
            mode={'text'}
            type={'info'}
            onConfirm={() => console.log('确认')}
            onCancel={() => console.log('取消')}
          >
            <div style={{ color: '#004EA8' }}>带图标文本按钮</div>
          </PopConfirm>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PopConfirmDemo />, mountNode);
```

### 提示

```jsx
import PopConfirm from 'eview-ui/PopConfirm';
import ConfigProvider from 'eview-ui/ConfigProvider';
import { getDemoVersion } from 'eview-ui/ThemeProvider';
import LabelField from 'eview-ui/LabelField';

export default class PopConfirmDemo extends React.Component {
  render() {
    const [version, theme] = getDemoVersion();
    return (
      <ConfigProvider version={version} theme={theme}>
        <LabelField text='提示' style={{ display: 'block', fontWeight: 'bold', paddingBottom: '1rem' }} />
        <div style={{ display: 'flex', marginLeft: '40px', justifyContent: 'center', gap: '400px' }}>
          <PopConfirm
            title='这是气泡确认框'
            type={'info'}
            placement={'right'}
            onConfirm={() => console.log('确认')}
            onCancel={() => console.log('取消')}
          >
            <div style={{ color: '#004EA8' }}>提示按钮</div>
          </PopConfirm>
          <PopConfirm
            title='这是气泡确认框'
            placement={'right'}
            mode={'text'}
            type={'info'}
            onConfirm={() => console.log('确认')}
            onCancel={() => console.log('取消')}
          >
            <div style={{ color: '#004EA8' }}>提示文本按钮</div>
          </PopConfirm>
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<PopConfirmDemo />, mountNode);
```

