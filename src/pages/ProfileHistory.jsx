import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import DonationHistoryCard from '../components/donation/DonationHistoryCard'
import DonationDetailModal from '../components/donation/DonationDetailModal'
import Footer from '../components/Footer'
import { getStoredDonations, getCommunityActivities } from '../data/donationData'
import './ProfileHistory.css'

const PROFILE_TABS = [
  { key: 'semua', label: 'Semua' },
  { key: 'donasi', label: 'Donasi' },
  { key: 'komunitas', label: 'Komunitas' },
]

export default function ProfileHistory() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('semua')
  const [donations, setDonations] = useState([])
  const [communityActs, setCommunityActs] = useState([])
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setDonations(getStoredDonations())
    setCommunityActs(getCommunityActivities())
  }, [])

  const handleOpenDetail = (donation) => {
    setSelectedDonation(donation)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDonation(null)
  }

  const handleReviewSubmitted = () => {
    setDonations(getStoredDonations())
  }

  // If user is not authenticated
  if (!isAuthenticated) {
    return (
      <main className="profile-history-unauth">
        <div className="unauth-box">
          <div className="unauth-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Akses Terbatas</h2>
          <p>Silakan masuk ke akun Anda terlebih dahulu untuk melihat seluruh riwayat aktivitas donasi dan komunitas Anda.</p>
          <div className="unauth-actions">
            <button type="button" className="btn-unauth-login" onClick={() => navigate('/login')}>
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
    <main className="profile-history-page">
      <div className="profile-history-container">
        {/* Navigation Breadcrumb */}
        <div className="profile-history-breadcrumb">
          <Link to="/profile" className="profile-back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali ke Profil
          </Link>
        </div>

        {/* Header */}
        <header className="profile-history-header">
          <div className="profile-history-header-left">
            <h1 className="profile-history-title">Riwayat Aktivitas</h1>
            <p className="profile-history-subtitle">
              Lihat seluruh aktivitas dan perjalanan donasimu di KEMBALI.
            </p>
          </div>
          <Link to="/donasi/form" className="profile-new-btn">
            + Donasi Baru
          </Link>
        </header>

        {/* Tab Filters */}
        <div className="profile-history-tabs-wrap">
          <div className="profile-history-tabs">
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`profile-tab-item ${activeTab === tab.key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="profile-history-content">
          {/* 1. DONATION ACTIVITIES (Shown in 'semua' or 'donasi') */}
          {(activeTab === 'semua' || activeTab === 'donasi') && (
            <section className="profile-activity-section">
              <div className="profile-section-heading">
                <h2>Aktivitas Donasi Saya</h2>
                <span className="profile-section-count">{donations.length} Donasi</span>
              </div>

              {donations.length === 0 ? (
                <div className="profile-empty-block">
                  <p>Belum ada donasi yang tercatat.</p>
                  <Link to="/donasi/form" className="empty-sub-btn">Mulai Donasi</Link>
                </div>
              ) : (
                <div className="profile-donation-cards-grid">
                  {donations.map((item) => (
                    <DonationHistoryCard
                      key={item.id}
                      donation={item}
                      onOpenDetail={handleOpenDetail}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 2. COMMUNITY ACTIVITIES (Shown in 'semua' or 'komunitas') */}
          {(activeTab === 'semua' || activeTab === 'komunitas') && (
            <section className="profile-activity-section">
              <div className="profile-section-heading">
                <h2>Riwayat Komunitas Mitra</h2>
                <span className="profile-section-count">{communityActs.length} Interaksi</span>
              </div>

              {communityActs.length === 0 ? (
                <div className="profile-empty-block">
                  <p>Belum ada riwayat keterlibatan komunitas.</p>
                </div>
              ) : (
                <div className="profile-community-cards-grid">
                  {communityActs.map((comm) => (
                    <article key={comm.id} className="profile-comm-card">
                      <div className="comm-card-logo-wrap">
                        <img
                          src={comm.image}
                          alt={comm.communityName}
                          className="comm-card-logo"
                          onError={(e) => {
                            e.target.src = '/sedekas.svg'
                          }}
                        />
                      </div>
                      <div className="comm-card-body">
                        <div className="comm-card-top-row">
                          <h4 className="comm-card-name">{comm.communityName}</h4>
                          <span className={`comm-card-badge status-${comm.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {comm.status}
                          </span>
                        </div>
                        <p className="comm-card-activity">{comm.activity}</p>
                        <p className="comm-card-desc">{comm.description}</p>
                        <div className="comm-card-footer">
                          <span className="comm-card-location">{comm.location}</span>
                          <span className="comm-card-date">{comm.date}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Donation Detail Modal */}
      <DonationDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        donation={selectedDonation}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <Footer />
    </main>
  )
}
