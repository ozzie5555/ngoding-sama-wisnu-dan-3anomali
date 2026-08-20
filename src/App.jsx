import { Route, Routes, useLocation, Navigate } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Donation from './pages/Donation'
import DonationHistory from './pages/DonationHistory'
import Profile from './pages/Profile'
import ProfileHistory from './pages/ProfileHistory'
import Insight from './pages/Insight'
import Community from './pages/Community'
import Login from './features/auth/pages/Login'
import SignUp from './features/auth/pages/SignUp'
import ResetPassword from './features/auth/pages/ResetPassword'
import CompleteProfile from './features/auth/pages/CompleteProfile'
import CariKebutuhan from './pages/CariKebutuhan'
import DonationForm from './pages/DonationForm'
import Admin from './pages/Admin'

function NeedsProfileRedirect() {
  const { user, isAuthenticated, initialized, pendingProfileRedirect, clearPendingProfileRedirect } = useAuth()
  const location = useLocation()

  if (!initialized) {
    return <div className="app-loading-screen"><div className="app-loading-spinner" /></div>
  }

  // After login, redirect once to complete profile (if needed)
  // Only triggers after a fresh sign-in; user can then browse nav freely
  if (isAuthenticated && pendingProfileRedirect && user?.needsProfile) {
    clearPendingProfileRedirect()
    if (location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" replace />
    }
  }

  // Protected pages require completed profile
  const protectedPaths = ['/profile']
  if (
    isAuthenticated &&
    user?.needsProfile &&
    protectedPaths.some((p) => location.pathname.startsWith(p))
  ) {
    return <Navigate to="/complete-profile" replace />
  }

  return null
}

function StaffRouteRedirect() {
  const { isAuthenticated, initialized, user } = useAuth()
  const location = useLocation()
  const isStaff = user?.status === "Admin" || user?.status === "Manager Komunitas"
  const isAdminRoute = location.pathname === "/admin"

  if (initialized && isAuthenticated && isStaff && !isAdminRoute) {
    return <Navigate to="/admin" replace />
  }

  return null
}

export default function App() {
  const location = useLocation()
  const isAuthPage = ['/login', '/admin/login', '/sign-up', '/reset-password', '/complete-profile'].includes(location.pathname)
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <NeedsProfileRedirect />
      <StaffRouteRedirect />
      {!isAuthPage && !isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donasi" element={<Donation />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/donasi/history" element={<DonationHistory />} />
        <Route path="/donation/history" element={<DonationHistory />} />
        <Route path="/donasi/form" element={<DonationForm />} />
        <Route path="/donation/form" element={<DonationForm />} />
        <Route path="/cari-kebutuhan" element={<CariKebutuhan />} />
        <Route path="/cari-kebutuhan/:communityId" element={<CariKebutuhan />} />
        <Route path="/insight" element={<Insight />} />
        <Route path="/insight/:slug" element={<Insight />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/history" element={<ProfileHistory />} />
        <Route path="/komunitas" element={<Community />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </AuthProvider>
  )
}


