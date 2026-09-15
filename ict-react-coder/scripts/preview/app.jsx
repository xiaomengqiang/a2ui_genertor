// 应用入口 — ICT React 页面
// 分层约定:
//   Layer 1 全局状态   → src/context.jsx  (AppProvider: 全局状态 + dark 模式同步)
//   Layer 2 数据与逻辑 → src/data.js      (mock 数据、派生统计)
//   Layer 3 通用小组件 → src/components/  (StatusTag / StatCard ...)
//   Layer 4 视图组件   → src/views/       (每个页签/功能区一个,配套同名 .css)
//   Layer 5 布局骨架   → app.jsx          (本文件: 组装 Provider + antd Layout)
//
// 样式约定: antd 组件承载布局与交互;自定义样式写在 CSS 文件中,颜色/阴影/圆角
// 一律使用 token(var(--primary) / var(--shadow-card) / var(--radius-*))。

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh-cn.js";
import "./app.css";

// 页面标题 — 构建时写入产物 <title>
export const APP_TITLE = "页面标题";

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app-root">
        {/* 视图组件挂载点 */}
      </div>
    </ConfigProvider>
  );
}
