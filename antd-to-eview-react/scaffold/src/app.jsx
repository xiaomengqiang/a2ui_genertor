import { useEffect, useState } from 'react';

export default function App() {
    const [isDark, setIsDark] = useState(false);
    // 暗色切换见 references/css-token-mapping.md §4
    useEffect(() => {
        document.body.className = isDark ? 'ev_no_wcag aui3_1 aui3_1_dark' : 'ev_no_wcag aui3_1';
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);
    return (
        <div className="root aui3_1">
            {/* TODO(步骤3): 迁移源项目 AppShell 布局到此。Layout/Menu/Avatar 等需手写，见 references/handwrite-templates.md */}
            <p>app root</p>
            <button type="button" onClick={() => setIsDark(d => !d)}>切换主题（演示）</button>
        </div>
    );
}
