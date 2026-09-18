import { useEffect, useState } from 'react';

export default function App() {
    const [isDark, setIsDark] = useState(false);
    // 暗色切换见 references/css-token-mapping.md §4
    // 注意：步骤 3 用源项目 AppShell 替换本组件时，请把下面这段暗色 useEffect 迁移到新 AppShell 或 main.jsx，
    // 否则暗色模式切换会失效。可点击元素的暗色按钮也需迁移到新 AppShell。
    useEffect(() => {
        // aui3_1_dark 挂 <body>（aui3_1 已在 index.html 的 <body> 上常驻）
        document.body.classList.toggle('aui3_1_dark', isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);
    return (
        <div className="root">
            {/* TODO(步骤3): 迁移源项目 AppShell 布局到此。Layout/Menu/Avatar 等需手写，见 references/handwrite-templates.md */}
            <p>app root</p>
            <button type="button" onClick={() => setIsDark(d => !d)}>切换主题（演示）</button>
        </div>
    );
}
