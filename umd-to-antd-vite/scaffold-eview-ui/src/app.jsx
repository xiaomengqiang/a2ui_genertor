import { useEffect, useState } from 'react';

export default function App() {
    const [isDark, setIsDark] = useState(false);
    // 暗色三轨（eview-ui 路线，缺任一轨主题切换不完整）：
    //   ① html .dark（本 useEffect）——自定义 token 四层跟随
    //   ② body data-theme 属性（default ↔ dark）——eview-ui 主题标识
    //   ③ body class 互换（eviewui_aui3_1_default ↔ eviewui_aui3_1_evening）——eview-ui 样式层
    //      注意白天也必须挂 default 类（不是仅移除 evening）
    // ConfigProvider（locale/version/theme/listenTheme）由 antd-to-eview-ui 步骤 1 在 AppProvider 之下
    // 接入（theme 响应 isDark 作双保险）；本空壳的 useState 会被源项目 AppProvider 替换。
    // 注意：eview-ui 路线**没有** body aui3_1_dark 轨（那是 eview-react profile 专属）
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'default');
        document.body.classList.toggle('eviewui_aui3_1_evening', isDark);
        document.body.classList.toggle('eviewui_aui3_1_default', !isDark);
    }, [isDark]);
    return (
        <div className="root">
            {/* TODO(步骤3): 迁移源项目 AppShell 布局到此。Layout/Menu/Avatar 等需手写，见 antd-to-eview-ui handwrite-templates.md */}
            <p>app root</p>
            <button type="button" onClick={() => setIsDark(d => !d)}>切换主题（演示）</button>
        </div>
    );
}
