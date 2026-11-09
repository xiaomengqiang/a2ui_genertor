# ConfigProvider 全局化配置

> 分类：其他

为组件提供统一的全局化配置。

```jsx
import { ConfigProvider } from 'eview-ui';

// ...

return (
  <ConfigProvider {...yourConfig}>
    <App />
  </ConfigProvider>
);
```

### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| locale |  语言配置 `zh` `en` `如果是小语种时确保是小写的字母`| string | `en` |
| initZIndex |  弹出类组件基础index，注意需要比Febs菜单zIndex大 | number | 100000 |
| baseZIndexUnit | 区分弹出容器和二级弹出组件的zIndex差  | number | 100 |
| theme |  主题配置 `lightday` `evening`（3.0特性）| string | `lightday` |
| version |  组件AUI规范配置 `aui2` `aui3`（3.0特性）| string | `aui2` |
| listenTheme |  组件是否切换主题，该值为true， version必须等于aui3，且theme必须传值（3.0特性）| bool | `false` |
