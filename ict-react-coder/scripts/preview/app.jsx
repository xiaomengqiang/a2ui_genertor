// 应用入口 — ICT React 页面
// 分层约定(目录与命名: views/components 下一组件一文件夹,kebab-case + index.jsx/index.css):
//   Layer 1 全局状态   → src/context.jsx            (AppProvider: 全局状态 + dark 模式切换)
//   Layer 2 数据与逻辑 → src/data.js                (mock 数据、派生统计)
//   Layer 3 通用小组件 → src/components/{name}/     (跨视图复用,如 status-tag)
//   Layer 4 视图组件   → src/views/{name}/          (每个页签/功能区一个,如 device-table)
//   Layer 5 布局骨架   → app.jsx                    (本文件: 组装 Provider + H5 布局骨架 header/aside/main)
//
// 样式约定: antd 组件承载布局与交互;自定义样式写在组件文件夹 index.css,颜色/阴影/圆角
// 一律使用 token(var(--primary) / var(--shadow-card) / var(--radius-*))。

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import "./app.css";


export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          {/* 视图组件挂载点 */}
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
