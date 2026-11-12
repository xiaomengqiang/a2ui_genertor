import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
// TODO(eview-ui): 全局样式接入路径待内网确认后取消下行注释并改对路径
// （eview-ui 组件文档未记载样式 import；可能是包内自带，或需 import '@cloudsop/eview-ui/...' 的 .css/.less——
//  vite.config.js 已配 less + TildeFileManager ~ 导入支持）
// import '@cloudsop/eview-ui/dist/css/eview-ui.css';
import './styles/base.css';
import './styles/light.css';
import './styles/theme.css';
import './styles/dark.css';
import App from './app.jsx';

// IntlProvider 保留（react-intl 公网包，业务 i18n 用）；
// eview-ui 组件文案不走 react-intl，走 app.jsx 的 <ConfigProvider locale="zh">（antd-to-eview-ui 步骤 1 接入）
const locale = 'zh';
createRoot(document.getElementById('root')).render(
    <IntlProvider locale={locale} messages={{}}>
        <App />
    </IntlProvider>
);
