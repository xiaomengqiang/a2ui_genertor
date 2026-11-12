import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import '@cloudsop/eview-ui/style/aui3.1.less';
import './styles/base.css';
import './styles/light.css';
import './styles/theme.css';
import './styles/dark.css';
import App from './app.jsx';
import { ThemeProvider } from './theme/useTheme';

// IntlProvider 保留（react-intl 公网包，业务 i18n 用）；
// eview-ui 组件文案不走 react-intl，走 ThemeProvider 内的 <ConfigProvider locale="zh">。
const locale = 'zh';
createRoot(document.getElementById('root')).render(
    <IntlProvider locale={locale} messages={{}}>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </IntlProvider>
);

