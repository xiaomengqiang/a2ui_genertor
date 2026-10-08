# Menu

侧边导航栏使用 Menu 组件，顶部导航栏不使用 Menu 组件（用原生 nav 自写）。

## 头部导航自写要求

- 选中项：文字 `--color-brand`，底部 2px 品牌色下划线；未选中项用 `border-bottom: 2px solid transparent` 占位，切换时不跳动。
- 未选中项 hover：文字变品牌色，无下划线。
