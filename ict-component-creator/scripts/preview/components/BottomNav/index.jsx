const { useState } = React;

const defaultNavItems = [
  { id: "home", label: "首页", icon: "grid" },
  { id: "category", label: "分类", icon: "folder" },
  { id: "cart", label: "购物车", icon: "package", badge: 3 },
  { id: "message", label: "消息", icon: "message", badge: 12 },
  { id: "profile", label: "我的", icon: "user" },
];

function NavItem({ item, active, onClick }) {
  const isActive = active === item.id;
  const badge = item.badge;
  const showBadge = badge != null && badge > 0;

  return (
    <button
      className={`bn-item ${isActive ? "bn-item-active" : ""}`}
      onClick={() => onClick(item.id)}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="bn-icon-wrapper">
        <Icon paths={ICONS[item.icon]} size={22} className={`bn-icon ${isActive ? "bn-icon-active" : ""}`} />
        {showBadge && (
          <span className="bn-badge">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className={`bn-label ${isActive ? "bn-label-active" : ""}`}>
        {item.label}
      </span>
    </button>
  );
}

function BottomNav(props) {
  const items = props.items || defaultNavItems;
  const initialActive = props.activeId || "home";
  const [activeId, setActiveId] = useState(initialActive);

  return (
    <div className="bn-page">
      <div className="bn-page-content">
        <div className="bn-page-header">
          <h1 className="bn-page-title">BottomNav 底部导航</h1>
          <p className="bn-page-subtitle">点击下方导航项切换内容区域</p>
        </div>

        <div className="bn-page-body">
          {items.map((item) => {
            if (item.id !== activeId) return null;
            return (
              <div key={item.id} className="bn-content-card">
                <div className="bn-content-icon-circle">
                  <Icon paths={ICONS[item.icon]} size={32} className="bn-content-icon" />
                </div>
                <h2 className="bn-content-title">{item.label}</h2>
                <p className="bn-content-desc">
                  这是「{item.label}」页面。当前选中项为 <strong>{item.id}</strong>，
                  切换导航以查看不同页面内容。
                </p>
                {item.badge != null && item.badge > 0 && (
                  <span className="bn-content-badge">
                    <Icon paths={ICONS.bell} size={14} />
                    {item.badge} 条新动态
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="bn-spacer" />
      </div>

      <nav className="bn-bar" aria-label="底部导航">
        {items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeId}
            onClick={setActiveId}
          />
        ))}
      </nav>
    </div>
  );
}
