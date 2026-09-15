import { useState, useEffect, createContext, useContext } from "react";
import { ConfigProvider, theme } from "antd";

// Layer 1: 全局状态 — dark 模式双轨同步(antd algorithm + .dark class)
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
  };

  return (
    <AppContext.Provider value={value}>
      <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        {children}
      </ConfigProvider>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
