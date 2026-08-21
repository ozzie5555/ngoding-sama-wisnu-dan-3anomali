import { useState, useRef, useEffect, useCallback } from 'react'
import { NavLink, Link, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import { notificationService } from '../features/notifications/services/notificationService'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationError, setNotificationError] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const actionsRef = useRef(null)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const needsProfile = Boolean(user?.needsProfile)
  const displayName = needsProfile ? 'Lengkapi Profil' : (user?.username || '@pengguna')
  const unreadCount = notifications.filter((item) => !item.is_read).length

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return
    setNotificationsLoading(true)
    setNotificationError('')
    try {
      setNotifications(await notificationService.getNotifications())
    } catch (error) {
      setNotificationError(error.message || 'Notifikasi gagal dimuat.')
    } finally {
      setNotificationsLoading(false)
    }
  }, [isAuthenticated, user?.id])

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined

    const initialLoad = window.setTimeout(loadNotifications, 0)
    const unsubscribe = notificationService.subscribe(user.id, loadNotifications)
    return () => {
      window.clearTimeout(initialLoad)
      unsubscribe()
    }
  }, [isAuthenticated, user?.id, loadNotifications])

  // Track scroll position to update sticky navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll() // Check initial scroll position
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setDropdownOpen(false)
        setNotificationOpen(false)
      }
    }
    if (dropdownOpen || notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen, notificationOpen])

  const handleNavClick = () => {
    setOpen(false)
    setDropdownOpen(false)
    setNotificationOpen(false)
  }

  const handleLogout = () => {
    logout()
    setNotifications([])
    setDropdownOpen(false)
    setNotificationOpen(false)
    setOpen(false)
    navigate('/')
  }

  const handleProfileClick = () => {
    setDropdownOpen(false)
    setOpen(false)
    navigate(needsProfile ? '/complete-profile' : '/profile')
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      setNotifications((current) => current.map((item) => (
        item.id === notification.id ? { ...item, is_read: true } : item
      )))
      try {
        await notificationService.markRead(notification.id)
      } catch {
        loadNotifications()
      }
    }
    setNotificationOpen(false)
    if (notification.type === 'donation_update' && notification.reference_id) navigate('/donasi')
  }

  const handleMarkAllRead = async () => {
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })))
    try {
      await notificationService.markAllRead()
    } catch {
      loadNotifications()
    }
  }

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar" aria-label="Navigasi utama">
        <NavLink to="/" className="brand" onClick={handleNavClick}>
          <img src="/logo.svg" alt="" />
          <span>KEMBALI</span>
        </NavLink>

        <button
          className="menu-toggle"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          onClick={() => {
            setOpen((current) => !current)
            setDropdownOpen(false)
            setNotificationOpen(false)
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={'nav-menu ' + (open ? 'is-open' : '')}>
          <NavLink to="/" end onClick={handleNavClick}>
            Beranda
          </NavLink>
          <NavLink to="/donasi" onClick={handleNavClick}>
            Donasi
          </NavLink>
          <NavLink to="/insight" onClick={handleNavClick}>
            Insight
          </NavLink>
          <NavLink to="/komunitas" onClick={handleNavClick}>
            Komunitas
          </NavLink>

          {/* Mobile only authenticated quick links when menu is open */}
          {isAuthenticated && open && (
            <div className="mobile-user-links">
              <Link to={needsProfile ? '/complete-profile' : '/profile'} className="mobile-profile-link" onClick={handleNavClick}>
                {needsProfile ? 'Lengkapi Profil' : `Profil Saya (${displayName})`}
              </Link>
              <button type="button" className="mobile-logout-btn" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          )}

          {/* Mobile only unauthenticated quick login link when menu is open */}
          {!isAuthenticated && open && (
            <div className="mobile-auth-links">
              <button
                type="button"
                className="mobile-login-btn"
                onClick={() => {
                  handleNavClick()
                  navigate('/login')
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.5-4 2.8-6 7-6s6.5 2 7 6" />
                </svg>
                Masuk / Daftar
              </button>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="navbar-user-actions" ref={actionsRef}>
            <div className="notification-menu-container">
              <button
                type="button"
                className={`notification-button ${notificationOpen ? 'is-active' : ''}`}
                onClick={() => {
                  setNotificationOpen((current) => !current)
                  setDropdownOpen(false)
                  setOpen(false)
                }}
                aria-expanded={notificationOpen}
                aria-haspopup="true"
                aria-label={unreadCount ? `${unreadCount} notifikasi belum dibaca` : 'Notifikasi'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>

              {notificationOpen && (
                <section className="notification-dropdown" aria-label="Daftar notifikasi">
                  <header>
                    <div><strong>Notifikasi</strong><span>{unreadCount ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}</span></div>
                    {unreadCount > 0 && <button type="button" onClick={handleMarkAllRead}>Tandai semua dibaca</button>}
                  </header>
                  <div className="notification-list">
                    {notificationsLoading && notifications.length === 0 ? (
                      <div className="notification-state"><span className="notification-spinner" />Memuat notifikasi...</div>
                    ) : notificationError ? (
                      <div className="notification-state is-error"><span>{notificationError}</span><button type="button" onClick={loadNotifications}>Coba lagi</button></div>
                    ) : notifications.length === 0 ? (
                      <div className="notification-state"><span className="notification-empty-icon">✓</span><strong>Belum ada notifikasi</strong><span>Perubahan donasi akan muncul di sini.</span></div>
                    ) : notifications.map((notification) => (
                      <button
                        type="button"
                        className={`notification-item ${notification.is_read ? '' : 'is-unread'}`}
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <span className="notification-item-icon">{notification.type === 'donation_update' ? '↗' : 'i'}</span>
                        <span><strong>{notification.title}</strong><p>{notification.body}</p><time>{new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(notification.created_at))}</time></span>
                        {!notification.is_read && <i aria-label="Belum dibaca" />}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="user-menu-container">
            <button
              type="button"
              className={`user-profile-btn ${dropdownOpen ? 'is-active' : ''}`}
              onClick={() => {
                setDropdownOpen((prev) => !prev)
                setNotificationOpen(false)
              }}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="Menu Pengguna"
            >
              <div className="user-avatar-wrapper">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar-img"
                  onError={(e) => {
                    // Fallback to SVG placeholder if image missing
                    e.target.src = '/src/assets/images/profile-placeholder.svg'
                  }}
                />
              </div>
              <span className="user-display-name">{displayName}</span>
              <svg
                className={`chevron-icon ${dropdownOpen ? 'chevron-up' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu" role="menu">
                <div className="dropdown-user-header">
                  <span className="dropdown-name">{needsProfile ? 'Profil belum lengkap' : user.name}</span>
                  <span className="dropdown-username">
                    {needsProfile ? 'Lengkapi data diri untuk melanjutkan' : user.username}
                  </span>
                </div>
                <div className="dropdown-divider" />
                {(user.status === 'Admin' || user.status === 'Manager Komunitas') && (
                  <Link to="/admin" className="dropdown-item" role="menuitem" onClick={handleNavClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={handleProfileClick}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{needsProfile ? 'Lengkapi Profil' : 'Profil'}</span>
                </button>
                <button
                  type="button"
                  className="dropdown-item dropdown-item-danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Keluar</span>
                </button>
              </div>
            )}
            </div>
          </div>
        ) : (
          <button className="login-button" type="button" onClick={() => navigate('/login')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c.5-4 2.8-6 7-6s6.5 2 7 6" />
            </svg>
            Masuk/daftar
          </button>
        )}
      </nav>
    </header>
  )
}
