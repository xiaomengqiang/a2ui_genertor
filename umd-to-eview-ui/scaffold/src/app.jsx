
import { useTheme } from "./theme/useTheme";
//示例： 引入 Button 组件
import Button from "@cloudsop/eview-ui/Button";

export default function App() {
    const { toggleTheme, isDark } = useTheme();
    return (
        <div className="root">
            {/* TODO： 迁移源项目代码到这*/}
            <p>app root（当前主题：{isDark ? "evening" : "lightday"}）</p>
            <Button
                text="切换主题（演示）"
                status="primary"
                style={{ marginRight: "16px" }}
                onClick={toggleTheme}
            />
        </div>
    );
}
