import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  // Active navigation tab state
  const [activeTab, setActiveTab] = useState('Beranda');

  // Navigation menu items
  const navItems = ['Beranda', 'Donasi', 'Insight', 'Komunitas'];

  return (
    // Navbar container
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="src\assets\LOGO KEMBALI.svg" alt="Kembali Logo" />
      </div>

      {/* Navigation links */}
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className={activeTab === item ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      {/* Login/register button */}
      <button className="navbar-btn">
        {/* User icon */}
        <svg
          className="user-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Masuk/daftar</span>
      </button>
    </nav>
  );
}