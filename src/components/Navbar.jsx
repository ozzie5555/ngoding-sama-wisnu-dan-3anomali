import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const needsProfile = Boolean(user?.needsProfile)
  const displayName = needsProfile ? 'Lengkapi Profil' : (user?.shortName || 'Pengguna')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleNavClick = () => {
    setOpen(false)
    setDropdownOpen(false)
  }

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setOpen(false)
    navigate('/')
  }

  const handleProfileClick = () => {
    setDropdownOpen(false)
    setOpen(false)
    navigate(needsProfile ? '/complete-profile' : '/profile')
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Navigasi utama">
        <NavLink to="/" className="brand" onClick={handleNavClick}>
          <img src="/logo.svg" alt="" />
          <span>KEMBALI</span>
        </NavLink>

        <button
          className="menu-toggle"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
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
                {needsProfile ? 'Lengkapi Profil' : `Profil Saya (${user.shortName || user.name})`}
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
          <div className="user-menu-container" ref={dropdownRef}>
            <button
              type="button"
              className={`user-profile-btn ${dropdownOpen ? 'is-active' : ''}`}
              onClick={() => setDropdownOpen((prev) => !prev)}
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
