import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { DUMMY_ACTIVITIES, DUMMY_PARTNERS } from '../../data/profileData'
import './ProfileOverview.css'

export default function ProfileOverview({ onNavigateToEdit }) {
  const { user } = useAuth()
  const [selectedActivity, setSelectedActivity] = useState(null)

  return (
    <div className="profile-overview-container">
      {/* LEFT COLUMN: User Summary & Stats */}
      <section className="profile-left-col" aria-label="Informasi Pengguna">
        <div className="profile-avatar-card">
          <div className="profile-avatar-large-wrap">
            <img
              src={user.avatar}
              alt={user.name}
              className="profile-avatar-large"
              onError={(e) => {
                // Fallback to SVG placeholder if image is missing
                e.target.src = '/src/assets/images/profile-placeholder.svg'
              }}
            />
          </div>

          <h1 className="profile-user-fullname">{user.name}</h1>
          <p className="profile-user-handle">{user.username}</p>

          <div className="profile-meta-item profile-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{user.location}</span>
          </div>

          <div className="profile-donor-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{user.status || 'Donatur Aktif'}</span>
          </div>

          <button
            type="button"
            className="profile-edit-btn"
            onClick={onNavigateToEdit}
          >
            Edit Profile
          </button>
        </div>

        {/* 3 Statistic Cards */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <span className="profile-stat-number">{user.stats?.donations ?? 8}</span>
            <span className="profile-stat-label">Donasi</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-number">{user.stats?.distributed ?? 6}</span>
            <span className="profile-stat-label">Tersalur</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-number">{user.stats?.saved ?? 4}</span>
            <span className="profile-stat-label">Simpan</span>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Activities */}
      <section className="profile-right-col" aria-label="Aktivitas Pengguna">
        <h2 className="profile-section-title">Aktifitas</h2>

        {/* Group 1: Donasi saya */}
        <div className="activity-group">
          <div className="activity-group-header">
            <h3 className="activity-group-title">Donasi saya</h3>
            <a href="#lihat-semua-donasi" className="activity-see-all">
              Lihat Semua →
            </a>
          </div>

          <div className="activity-cards-slider">
            <div className="activity-cards-row">
              {DUMMY_ACTIVITIES.map((act) => (
                <article key={act.id} className="donation-card">
                  <div className="donation-card-img-wrap">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="donation-card-img"
                      onError={(e) => {
                        e.target.src = '/src/assets/images/donation-book.svg'
                      }}
                    />
                  </div>
                  <div className="donation-card-body">
                    <h4 className="donation-card-title">{act.title}</h4>
                    <p className="donation-card-recipient">{act.recipient}</p>
                    <p className="donation-card-desc">{act.description}</p>

                    <div className="donation-tags-section">
                      <span className="donation-tags-label">Detail Donasi</span>
                      <div className="donation-tags-list">
                        {act.tags.map((tag, idx) => (
                          <span key={idx} className="donation-tag-chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="donation-card-action-btn"
                      onClick={() => setSelectedActivity(act)}
                    >
                      {act.actionText}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="slider-next-arrow"
              aria-label="Lihat aktivitas selanjutnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Group 2: Partner / Komunitas Donasi */}
        <div className="activity-group">
          <div className="activity-group-header">
            <h3 className="activity-group-title">Donasi saya</h3>
            <a href="#lihat-semua-mitra" className="activity-see-all">
              Lihat Semua →
            </a>
          </div>

          <div className="activity-cards-slider">
            <div className="activity-cards-row">
              {DUMMY_PARTNERS.map((partner) => (
                <article key={partner.id} className="partner-card-profile">
                  <div className="partner-card-img-wrap">
                    <img
                      src={partner.image}
                      alt={partner.title}
                      className="partner-card-img"
                      onError={(e) => {
                        e.target.src = '/src/assets/images/donation-charity.svg'
                      }}
                    />
                  </div>
                  <div className="partner-card-body">
                    <h4 className="partner-card-title">{partner.title}</h4>
                    <p className="partner-card-desc">{partner.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="slider-next-arrow"
              aria-label="Lihat mitra selanjutnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Optional Activity Detail Modal */}
      {selectedActivity && (
        <div className="activity-detail-backdrop" onClick={() => setSelectedActivity(null)}>
          <div className="activity-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedActivity(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3>{selectedActivity.title}</h3>
            <p className="modal-sub">{selectedActivity.recipient}</p>
            <p>{selectedActivity.description}</p>
            <div className="donation-tags-list" style={{ marginTop: '16px' }}>
              {selectedActivity.tags.map((t, i) => (
                <span key={i} className="donation-tag-chip">{t}</span>
              ))}
            </div>
            <button
              type="button"
              className="profile-edit-btn"
              style={{ marginTop: '20px', width: '100%' }}
              onClick={() => setSelectedActivity(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
