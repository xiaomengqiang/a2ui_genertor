const { useState } = React;

const navItems = [
  { key: "dashboard", label: "仪表盘" },
  { key: "analytics", label: "数据分析" },
  { key: "projects", label: "项目管理" },
  { key: "team", label: "团队协作" },
  { key: "settings", label: "系统设置" },
];

const notifications = [
  { id: 1, icon: "message", title: "张明 评论了你的方案", time: "2分钟前", unread: true, color: "info" },
  { id: 2, icon: "bell", title: "系统维护通知：今晚 23:00-02:00", time: "1小时前", unread: true, color: "warning" },
  { id: 3, icon: "package", title: "订单 #20260824 已发货", time: "3小时前", unread: false, color: "success" },
  { id: 4, icon: "user", title: "李薇 申请加入「前端架构」团队", time: "昨天", unread: false, color: "primary" },
];

const userMenuItems = [
  { icon: "user", label: "个人主页" },
  { icon: "settings", label: "账号设置" },
  { icon: "shield", label: "安全中心" },
  { icon: "gift", label: "升级套餐" },
];

function Header() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const colorMap = {
    primary: "var(--color-primary)",
    info: "var(--color-info)",
    warning: "var(--color-warning)",
    success: "var(--color-success)",
    error: "var(--color-error)",
  };

  const containerBgMap = {
    primary: "var(--color-primary-light)",
    info: "var(--color-info-container)",
    warning: "var(--color-warning-container)",
    success: "var(--color-success-container)",
    error: "var(--color-error-container)",
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <button
            className="header-mobile-toggle"
            onClick={() => setShowMobileNav(!showMobileNav)}
            aria-label="菜单"
          >
            <Icon paths={ICONS.grid} size={20} />
          </button>

          <div className="header-logo">
            <div className="header-logo-icon">
              <Icon paths={ICONS.zap} size={18} />
            </div>
            <span className="header-logo-text">Velocity</span>
          </div>

          <nav className={`header-nav ${showMobileNav ? "header-nav-open" : ""}`}>
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`header-nav-item ${activeNav === item.key ? "header-nav-active" : ""}`}
                onClick={() => {
                  setActiveNav(item.key);
                  setShowMobileNav(false);
                }}
              >
                {item.label}
                {activeNav === item.key && <span className="header-nav-indicator" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="header-right">
          <div className="header-search">
            <Icon paths={ICONS.search} size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="搜索功能、项目、文档..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="header-search-input"
            />
            {searchValue && (
              <button
                className="header-search-clear"
                onClick={() => setSearchValue("")}
                aria-label="清除"
              >
                <Icon paths={ICONS.x} size={14} />
              </button>
            )}
            <kbd className="header-search-kbd">⌘K</kbd>
          </div>

          <div className="header-actions">
            <button className="header-icon-btn" aria-label="消息">
              <Icon paths={ICONS.mail} size={18} />
              <span className="header-badge header-badge-info" />
            </button>

            <div className="header-dropdown-wrap">
              <button
                className="header-icon-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                aria-label="通知"
              >
                <Icon paths={ICONS.bell} size={18} />
                {unreadCount > 0 && (
                  <span className="header-badge header-badge-count">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="header-dropdown header-notifications">
                  <div className="header-dropdown-header">
                    <span className="header-dropdown-title">通知中心</span>
                    <button className="header-dropdown-link">全部已读</button>
                  </div>
                  <div className="header-notification-list">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`header-notification-item ${n.unread ? "header-notification-unread" : ""}`}
                      >
                        <div
                          className="header-notification-icon"
                          style={{
                            color: colorMap[n.color],
                            backgroundColor: containerBgMap[n.color],
                          }}
                        >
                          <Icon paths={ICONS[n.icon]} size={15} />
                        </div>
                        <div className="header-notification-content">
                          <p className="header-notification-title">{n.title}</p>
                          <span className="header-notification-time">{n.time}</span>
                        </div>
                        {n.unread && <span className="header-notification-dot" />}
                      </div>
                    ))}
                  </div>
                  <button className="header-dropdown-footer" onClick={() => setShowNotifications(false)}>
                    查看全部通知
                    <Icon paths={ICONS.arrowRight} size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="header-divider" />

          <div className="header-dropdown-wrap">
            <button
              className="header-user"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
            >
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="用户头像"
                className="header-avatar"
              />
              <div className="header-user-info">
                <span className="header-user-name">陈宇飞</span>
                <span className="header-user-role">产品负责人</span>
              </div>
              <Icon paths={ICONS.chevronDown} size={14} className={`header-user-chevron ${showUserMenu ? "header-chevron-rotate" : ""}`} />
            </button>

            {showUserMenu && (
              <div className="header-dropdown header-user-menu">
                <div className="header-user-card">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="用户头像"
                    className="header-user-card-avatar"
                  />
                  <div className="header-user-card-info">
                    <p className="header-user-card-name">陈宇飞</p>
                    <p className="header-user-card-email">chenyf@velocity.io</p>
                  </div>
                  <span className="header-user-card-badge">Pro</span>
                </div>
                <div className="header-dropdown-divider" />
                <div className="header-user-menu-list">
                  {userMenuItems.map((item) => (
                    <button key={item.label} className="header-user-menu-item">
                      <Icon paths={ICONS[item.icon]} size={16} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="header-dropdown-divider" />
                <button className="header-user-menu-item header-logout">
                  <Icon paths={ICONS.arrowRight} size={16} className="header-logout-icon" />
                  <span>退出登录</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {(showNotifications || showUserMenu) && (
        <div
          className="header-overlay"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}
