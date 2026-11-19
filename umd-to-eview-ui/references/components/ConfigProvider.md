# ConfigProvider 全局化配置

> 分类：其他

为组件提供统一的全局化配置，包括国际化、主题、zIndex等。包裹在业务组件外层，所有子组件均可获取全局配置。

```jsx
import { ConfigProvider } from 'eview-ui';

return (
  <ConfigProvider locale="zh" version="aui3-1" theme="lightday">
    <App />
  </ConfigProvider>
);
```

## API

| 方法名 | 描述 | 参数 | 返回值 |
|:-------|:-----|:-----|:-------|
| getLocale | 获取当前语言配置 | 无 | string |
| formatMessage | 格式化国际化消息 | (keyObj: {id: string}, valueObj?: object) | string |
| addLocaleData | 添加自定义语言包数据 | (data: object) | 无 |
| getBaseZIndex | 获取弹出类组件基础zIndex | 无 | number |
| getBaseZIndexUnit | 获取弹出容器和二级弹出组件的zIndex差 | 无 | number |
| nextZIndex | 获取下一个递增的zIndex值 | 无 | number |
| getBaseUseSingleTooltip | 获取是否只允许出现一个Tooltip的配置 | 无 | boolean |

### FormattedMessage 组件

用于在JSX中输出国际化文本。

```jsx
import { FormattedMessage } from 'eview-ui';

<FormattedMessage id="eui_select_notBeEmpty" values={{ name: 'test' }} />
```

| 属性名称 | 描述 | 输入 | 默认 |
|:---------|:-----|:-----|:-----|
| id | 国际化消息的key | string |  |
| values | 消息中占位符的替换值 | { [key: string]: string } |  |

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:---------|:-----|:-----|:-----|
| locale | 语言配置，支持 `zh`、`en` 及小语种（小语种需确保是小写字母，如 `fr`、`de`）。小语种会自动从 `/rest/eviewwebsite/v1/i18n?lang=xx` 拉取语言包 | string | `en` |
| messages | 自定义语言包数据，会合并到现有语言包中 | object | `{}` |
| initZIndex | 弹出类组件基础zIndex，注意需要比Febs菜单zIndex大 | number | 100000 |
| baseZIndexUnit | 区分弹出容器和二级弹出组件的zIndex差 | number | 100 |
| theme | 主题配置，支持 `lightday`（日间）、`evening`（夜间）（3.0/3.1特性）| string | `lightday` |
| version | 组件AUI规范版本，支持 `aui2`、`aui3`、`aui3-1` | string | `aui2` |
| listenTheme | 是否监听主题切换。该值为true时，version必须等于`aui3`，且theme必须传值，组件会动态切换CSS样式文件（3.0特性）| bool | `false` |
| useSingleTooltip | 是否只允许同时出现一个Tooltip | bool | `false` |
| localTheme | 局部主题配置。当version为`aui3-1`时，设置localTheme后组件不会修改body的全局class，而是在ConfigProvider内部包裹一个带主题class的div容器，实现局部主题隔离 | string |  |
| primaryTheme | 产品定制主主题。当产品需要覆盖平台样式进行换肤时使用，优先级高于theme。适用于3.1版本产品定制换肤场景 | string |  |
| changeTheme | 是否将主题变更应用到body的全局class。当version为`aui3-1`时生效。设为false则不会修改body的class，避免与其他主题配置冲突 | bool | `true` |

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `ConfigProvider`（antd） | `ConfigProvider`（eview-ui） | 见 SKILL.md 硬约束 2：`locale="zh"`、`version="aui3-1"`（实测）、`theme={isDark ? 'evening' : 'lightday'}` 响应式；scaffold ThemeProvider 已预制 |

## 接口定义

```typescript
interface IntlProviderProps {
  /**
   * 子节点
   */
  children?: React.ReactNode;

  /**
   * 语言配置，支持 'zh'、'en' 及小语种
   * 小语种需确保是小写字母，会自动从后端拉取语言包
   */
  locale?: string;

  /**
   * 自定义语言包数据，会合并到现有语言包中
   */
  messages?: object;

  /**
   * 主题配置，支持 'lightday'（日间）、'evening'（夜间）
   */
  theme?: string;

  /**
   * 组件AUI规范版本，支持 'aui2'、'aui3'、'aui3-1'
   */
  version?: string;

  /**
   * 弹出类组件基础zIndex，注意需要比Febs菜单zIndex大
   */
  initZIndex?: number;

  /**
   * 区分弹出容器和二级弹出组件的zIndex差
   */
  baseZIndexUnit?: number;

  /**
   * 是否只允许同时出现一个Tooltip
   */
  useSingleTooltip?: boolean;

  /**
   * 是否监听主题切换
   * 该值为true时，version必须等于'aui3'，且theme必须传值
   */
  listenTheme?: boolean;

  /**
   * 局部主题配置
   * 当version为'aui3-1'时，设置localTheme后组件不会修改body全局class
   * 而是包裹一个带主题class的div容器，实现局部主题隔离
   */
  localTheme?: string;

  /**
   * 产品定制主主题
   * 优先级高于theme，适用于3.1版本产品定制换肤场景
   */
  primaryTheme?: string;

  /**
   * 是否将主题变更应用到body的全局class
   * 当version为'aui3-1'时生效
   * 设为false则不会修改body的class
   */
  changeTheme?: boolean;
}
```

## 使用示例

### 基本配置

基本国际化与主题配置

```jsx
import { ConfigProvider } from 'eview-ui';

export default class App extends React.Component {
  render() {
    return (
      <ConfigProvider locale="zh" version="aui3-1" theme="lightday">
        <div>
          {/* 子组件自动获取全局语言、主题、版本配置 */}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```

### 主题切换

通过state动态切换日间/夜间主题

```jsx
import { ConfigProvider } from 'eview-ui';
import Button from 'eview-ui/Button';

export default class ThemeSwitchApp extends React.Component {
  state = {
    isDark: false,
  };

  toggleTheme = () => {
    this.setState(prevState => ({ isDark: !prevState.isDark }));
  };

  render() {
    const { isDark } = this.state;
    return (
      <ConfigProvider locale="zh" version="aui3-1" theme={isDark ? 'evening' : 'lightday'}>
        <div>
          <Button text={isDark ? '切换为日间模式' : '切换为夜间模式'} onClick={this.toggleTheme} />
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ThemeSwitchApp />, mountNode);
```

### 局部主题与产品定制

使用localTheme实现局部主题隔离，使用primaryTheme进行产品定制换肤

```jsx
import { ConfigProvider } from 'eview-ui';

export default class LocalThemeApp extends React.Component {
  render() {
    return (
      <div>
        {/* 全局使用日间主题 */}
        <ConfigProvider locale="zh" version="aui3-1" theme="lightday">
          <div>日间主题区域</div>
        </ConfigProvider>

        {/* 局部区域使用夜间主题，不影响全局body class */}
        <ConfigProvider locale="zh" version="aui3-1" theme="lightday" localTheme="evening">
          <div>局部夜间主题区域</div>
        </ConfigProvider>

        {/* 产品定制主主题，primaryTheme优先级高于theme */}
        <ConfigProvider locale="zh" version="aui3-1" theme="lightday" primaryTheme="evening">
          <div>产品定制主题区域</div>
        </ConfigProvider>
      </div>
    );
  }
}

ReactDOM.render(<LocalThemeApp />, mountNode);
```

### 自定义zIndex与Tooltip配置

```jsx
import { ConfigProvider } from 'eview-ui';

export default class ZIndexApp extends React.Component {
  render() {
    return (
      <ConfigProvider
        locale="zh"
        version="aui3-1"
        theme="lightday"
        initZIndex={200000}
        baseZIndexUnit={200}
        useSingleTooltip={true}
      >
        <div>
          {/* 弹出类组件基础zIndex为200000，每次弹出递增 */}
          {/* 同一时间只允许显示一个Tooltip */}
        </div>
      </ConfigProvider>
    );
  }
}

ReactDOM.render(<ZIndexApp />, mountNode);
```

