import { useEffect, useLayoutEffect, useState } from "react"
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router'
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
import BrandIntro from "./components/BrandIntro"
import LoadingScreen from './components/LoadingScreen'
import AnimatedCheckmark from './features/auth/components/AnimatedCheckmark'

function NeedsProfileRedirect() {
  const { user, isAuthenticated, initialized, pendingProfileRedirect, clearPendingProfileRedirect } = useAuth()
  const location = useLocation()
  const isAuthFlow = ['/login', '/admin/login', '/sign-up', '/reset-password', '/complete-profile'].includes(location.pathname)

  if (!initialized) {
    return <LoadingScreen />
  }

  if (sessionStorage.getItem('kembali_auth_success_pending') || isAuthFlow) return null

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
  const isAuthFlow = ['/login', '/admin/login', '/sign-up', '/reset-password', '/complete-profile'].includes(location.pathname)

  if (sessionStorage.getItem('kembali_auth_success_pending') || isAuthFlow) return null

  if (initialized && isAuthenticated && isStaff && !isAdminRoute) {
    return <Navigate to="/admin" replace />
  }

  return null
}

function OAuthSuccessRedirect() {
  const { initialized, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const pending = sessionStorage.getItem('kembali_auth_success_pending') === 'oauth'

  useEffect(() => {
    if (!pending || !initialized) return undefined
    if (!isAuthenticated) {
      sessionStorage.removeItem('kembali_auth_success_pending')
      return undefined
    }

    const timer = window.setTimeout(() => {
      sessionStorage.removeItem('kembali_auth_success_pending')
      const isStaff = user?.status === 'Admin' || user?.status === 'Manager Komunitas'
      const destination = isStaff
        ? '/admin'
        : user?.needsProfile
          ? '/complete-profile'
          : sessionStorage.getItem('pendingDonation') ? '/donasi/form' : '/'
      navigate(destination, { replace: true })
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [initialized, isAuthenticated, navigate, pending, user?.needsProfile, user?.status])

  if (!pending || !initialized || !isAuthenticated) return null
  return (
    <div className="app-auth-success" role="status" aria-live="polite">
      <AnimatedCheckmark />
      <h1>Berhasil Masuk!</h1>
      <p>Selamat datang di KEMBALI</p>
    </div>
  )
}

function AppContent() {
  const { initialized } = useAuth()
  const location = useLocation()
  const isAuthPage = ['/login', '/admin/login', '/sign-up', '/reset-password', '/complete-profile'].includes(location.pathname)
  const isAdminPage = location.pathname.startsWith('/admin')
  const [showIntro, setShowIntro] = useState(() => (
    location.pathname === "/"
    && sessionStorage.getItem("kembali:intro-seen") !== "true"
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ))

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  const finishIntro = () => {
    sessionStorage.setItem("kembali:intro-seen", "true")
    setShowIntro(false)
  }

  if (!initialized) return <LoadingScreen />

  return (
    <>
      <OAuthSuccessRedirect />
      {showIntro && <BrandIntro onComplete={finishIntro} />}
      <div className={"app-content " + (showIntro ? "is-intro-running" : "is-intro-ready")}>
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
      </div>
    </>
  )
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>
}
