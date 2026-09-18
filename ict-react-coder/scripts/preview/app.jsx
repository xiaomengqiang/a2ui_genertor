// App entry — ICT React page
// Layering convention (one folder per component, kebab-case + index.jsx/index.css):
//   Layer 1 global state  → src/context.jsx        (AppProvider: global state + dark mode toggle)
//   Layer 2 mock data     → src/mock/              (per-domain files, e.g. device.js / alarm.js)
//   Layer 3 reusable      → src/components/{name}/ (cross-view, e.g. status-tag / section-card)
//   Layer 4 views         → src/views/{name}/      (one per tab/section, e.g. device-table / header-bar)
//   Layer 5 layout        → app.jsx                (Provider + root container assembly)
//
// Styling: custom styles in component folder's index.css; prefer tokens for visual values.

import { ConfigProvider } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import "./app.css";


export default function App() {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app-root">
          {/* view mount point */}
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}
