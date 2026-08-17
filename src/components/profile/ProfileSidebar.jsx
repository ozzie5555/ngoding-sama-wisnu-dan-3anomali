import './ProfileSidebar.css'

export default function ProfileSidebar({ activeTab, onSelectTab, onBackToOverview }) {
  const menuItems = [
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 'privacy',
      label: 'Privasi & Data',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'security',
      label: 'Keamanan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="profile-sidebar-wrapper" aria-label="Navigasi Pengaturan Profil">
      {onBackToOverview && (
        <button
          type="button"
          className="sidebar-back-overview-btn"
          onClick={onBackToOverview}
          title="Kembali ke ringkasan profil"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Ringkasan Profil</span>
        </button>
      )}

      <nav className="profile-sidebar-nav">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-menu-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="sidebar-active-indicator" />
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
