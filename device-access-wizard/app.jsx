// 应用入口 — ICT React 页面
// Layer 5 布局骨架:组装 Provider + AppShell;视图组件见 src/views/

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh-cn.js";
import { AppProvider } from "./src/context.jsx";
import AppShell from "./src/views/AppShell.jsx";
import "./app.css";

export const APP_TITLE = "设备接入配置向导";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <AppShell />
      </ConfigProvider>
    </AppProvider>
  );
}
