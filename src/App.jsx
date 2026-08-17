import { Route, Routes } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Donation from './pages/Donation'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donasi" element={<Donation />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AuthProvider>
  )
}
