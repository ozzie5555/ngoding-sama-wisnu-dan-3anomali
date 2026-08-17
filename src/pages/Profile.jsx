import { useSearchParams, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import ProfileOverview from '../components/profile/ProfileOverview'
import ProfileSidebar from '../components/profile/ProfileSidebar'
import EditProfile from '../components/profile/EditProfile'
import PrivacyData from '../components/profile/PrivacyData'
import Security from '../components/profile/Security'
import Footer from '../components/Footer'
import './Profile.css'

export default function Profile() {
  const { isAuthenticated, login } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Directly derive active view from URL search param
  const activeView = searchParams.get('tab') || 'overview'

  const handleSelectTab = (tabId) => {
    setSearchParams({ tab: tabId })
  }

  const handleBackToOverview = () => {
    setSearchParams({ tab: 'overview' })
  }

  const handleNavigateToEdit = () => {
    setSearchParams({ tab: 'edit' })
  }

  // If user is not authenticated, show friendly login prompt
  if (!isAuthenticated) {
    return (
      <main className="profile-page-unauthenticated">
        <div className="unauth-card">
          <div className="unauth-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Akses Terbatas</h2>
          <p>Silakan masuk ke akun Anda terlebih dahulu untuk melihat dan mengelola profil donatur Anda.</p>
          <div className="unauth-actions">
            <button type="button" className="btn-unauth-login" onClick={login}>
              Masuk Sekarang
            </button>
            <button type="button" className="btn-unauth-home" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="profile-page-main">
      <div className="profile-page-container">
        {activeView === 'overview' ? (
          /* FIGMA PAGE 1: Profile Overview with Left Profile Summary & Right Activities */
          <ProfileOverview onNavigateToEdit={handleNavigateToEdit} />
        ) : (
          /* FIGMA PAGES 2, 3, 4: Sidebar Navigation on Left + Tab Content on Right */
          <div className="profile-settings-layout">
            <ProfileSidebar
              activeTab={activeView}
              onSelectTab={handleSelectTab}
              onBackToOverview={handleBackToOverview}
            />

            <div className="profile-settings-content">
              {activeView === 'edit' && <EditProfile />}
              {activeView === 'privacy' && <PrivacyData />}
              {activeView === 'security' && <Security />}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
