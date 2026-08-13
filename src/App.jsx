import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Donation from './pages/Donation'

export default function App() {
  return <><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/donasi" element={<Donation />} /></Routes></>
}
