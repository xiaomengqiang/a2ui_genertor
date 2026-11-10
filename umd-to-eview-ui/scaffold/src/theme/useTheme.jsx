import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
// 子路径默认导入（skill 导入规范——根包具名导入会被 check-imports.cjs 的 EVUI_ROOT_IMPORT 拦截）
import ConfigProvider from '@cloudsop/eview-ui/ConfigProvider';

// scaffold 出厂形态：ThemeProvider 自持 isDark 演示态（空壳工程可直接跑 dev 演示切换）。
// 步骤 3 接线（见 SKILL.md 步骤 3 模板 c）：删自持 state，改为 const { isDark } = useApp()
// （消费 context.jsx 的 AppProvider），useTheme 演示 hook 一并删除；main.jsx 把 <AppProvider>
// 包到 <ThemeProvider> 外层。暗色机制（实测）：html .dark 轨（本文件 useEffect）+
// ConfigProvider theme 轨（组件库内部切换，version="aui3-1"，无需 listenTheme / body 类轨）。

const THEME = {
    LIGHT: 'light',
    DARK: 'dark'
};

const EUI_THEME = {
    [THEME.LIGHT]: 'lightday',
    [THEME.DARK]: 'evening'
};

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children, defaultTheme = THEME.LIGHT }) => {
    const [currentTheme, setCurrentTheme] = useState(defaultTheme);
    const isDark = currentTheme === THEME.DARK;

    const setTheme = useCallback((theme) => {
        setCurrentTheme(theme);
    }, []);

    const toggleTheme = useCallback(() => {
        setCurrentTheme(prev => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
    }, []);

    // html.dark 驱动 dark.css 自定义 token 覆盖
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, isDark, setTheme, toggleTheme }}>
            <ConfigProvider locale="zh" version="aui3-1" theme={EUI_THEME[currentTheme]}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
