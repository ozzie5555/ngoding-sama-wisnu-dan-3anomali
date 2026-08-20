import { Route, Routes, useLocation, Navigate } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Donation from './pages/Donation'
import Profile from './pages/Profile'
import Insight from './pages/Insight'
import Community from './pages/Community'
import Login from './features/auth/pages/Login'
import SignUp from './features/auth/pages/SignUp'
import ResetPassword from './features/auth/pages/ResetPassword'
import CompleteProfile from './features/auth/pages/CompleteProfile'
import CariKebutuhan from './pages/CariKebutuhan'
import DonationForm from './pages/DonationForm'

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

export default function App() {
  const location = useLocation()
  const isAuthPage = ['/login', '/sign-up', '/reset-password', '/complete-profile'].includes(location.pathname)

  return (
    <AuthProvider>
      <NeedsProfileRedirect />
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donasi" element={<Donation />} />
        <Route path="/donasi/form" element={<DonationForm />} />
        <Route path="/donation/form" element={<DonationForm />} />
        <Route path="/cari-kebutuhan" element={<CariKebutuhan />} />
        <Route path="/cari-kebutuhan/:communityId" element={<CariKebutuhan />} />
        <Route path="/insight" element={<Insight />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/komunitas" element={<Community />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </AuthProvider>
  )
}



