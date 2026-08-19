import { Route, Routes, useLocation } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Donation from './pages/Donation'
import Profile from './pages/Profile'
import Insight from './pages/Insight'
import Community from './pages/Community'
import Login from './features/auth/pages/Login'
import SignUp from './features/auth/pages/SignUp'

export default function App() {
  const location = useLocation()
  const isAuthPage = ['/login', '/sign-up'].includes(location.pathname)

  return (
    <AuthProvider>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donasi" element={<Donation />} />
        <Route path="/insight" element={<Insight />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/komunitas" element={<Community />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </AuthProvider>
  )
}

