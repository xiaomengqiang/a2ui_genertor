import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import '@nce/eview-react/styles/aui3_1.css';
import './styles/base.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import App from './app.jsx';

const locale = 'zh';
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <IntlProvider locale={locale} messages={componentsLocales[locale]}>
                <App />
            </IntlProvider>
        </ConfigProvider>
    </StrictMode>
);
