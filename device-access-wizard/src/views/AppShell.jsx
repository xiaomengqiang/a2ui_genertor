import { Layout, Menu, Breadcrumb, Input, Button, Avatar } from "antd";
import { Icon } from "../../assets/shared/icons.js";
import { useApp } from "../context.jsx";
import { menuItems, breadcrumbs } from "../data.js";
import StepFlow from "./StepFlow.jsx";
import "./app-shell.css";

const { Header, Sider, Content } = Layout;

// Layer 4/5: 布局骨架 — 顶导航 + 侧菜单 + 主体(面包屑 → 步骤流)
export default function AppShell() {
  const { isDark, toggleDark } = useApp();

  return (
    <Layout className="shell">
      <Header className="shell-header">
        <div className="shell-brand">
          <Icon name="zap" size={22} className="shell-brand-icon" />
          <span className="shell-brand-text">电力接入平台</span>
        </div>
        <div className="shell-tools">
          <Input
            prefix={<Icon name="search" size={14} />}
            placeholder="搜索设备 / 站点"
            className="shell-search"
            allowClear
          />
          <Button
            onClick={toggleDark}
            icon={<Icon name={isDark ? "sun" : "moon"} size={14} />}
            title={isDark ? "切换浅色" : "切换深色"}
          />
          <Avatar size={32} className="shell-avatar">
            王
          </Avatar>
        </div>
      </Header>

      <Layout>
        <Sider width={248} theme="light" className="shell-sider">
          <Menu
            mode="inline"
            theme="light"
            defaultSelectedKeys={["devices"]}
            items={menuItems.map((m) => ({
              key: m.key,
              icon: <Icon name={m.icon} size={14} />,
              label: m.label,
            }))}
          />
        </Sider>

        <Content className="shell-content">
          <Breadcrumb
            items={breadcrumbs.map((b) => ({ title: b }))}
            className="shell-breadcrumb"
          />
          <StepFlow />
        </Content>
      </Layout>
    </Layout>
  );
}
