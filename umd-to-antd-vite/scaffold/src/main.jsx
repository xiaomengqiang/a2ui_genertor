import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './styles/base.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import App from './app.jsx';

dayjs.locale('zh-cn');

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider locale={zhCN}>
            <App />
        </ConfigProvider>
    </StrictMode>
);
