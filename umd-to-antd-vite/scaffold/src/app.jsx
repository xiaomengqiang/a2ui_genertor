import { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

export default function App() {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);
    return (
        <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
            <div className="root">
                {/* TODO(步骤3): 把源项目 src/ 下的代码搬进来，替换本空壳。
                    搬入后保留上面的 isDark state + useEffect + 嵌套 ConfigProvider，
                    否则暗色模式切换会失效。 */}
                <p>app root</p>
                <button type="button" onClick={() => setIsDark(d => !d)}>切换主题（演示）</button>
            </div>
        </ConfigProvider>
    );
}
