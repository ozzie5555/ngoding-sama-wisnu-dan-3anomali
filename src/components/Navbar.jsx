import { useState } from 'react'
import { NavLink } from 'react-router'
import './Navbar.css'

export default function Navbar() {
  const [open,setOpen]=useState(false)
  return <header className="site-header"><nav className="navbar" aria-label="Navigasi utama">
    <NavLink to="/" className="brand" onClick={()=>setOpen(false)}><img src="/logo.svg" alt="" /><span>KEMBALI</span></NavLink>
    <button className="menu-toggle" aria-label="Buka menu" aria-expanded={open} onClick={()=>setOpen(!open)}><span/><span/><span/></button>
    <div className={'nav-menu '+(open?'is-open':'')}><NavLink to="/" end onClick={()=>setOpen(false)}>Beranda</NavLink><NavLink to="/donasi" onClick={()=>setOpen(false)}>Donasi</NavLink><a href="/#insight" onClick={()=>setOpen(false)}>Insight</a><a href="/#komunitas" onClick={()=>setOpen(false)}>Komunitas</a></div>
    <button className="login-button" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.5-4 2.8-6 7-6s6.5 2 7 6"/></svg>Masuk/daftar</button>
  </nav></header>
}