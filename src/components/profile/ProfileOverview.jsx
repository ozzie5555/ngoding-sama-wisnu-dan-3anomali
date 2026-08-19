import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../context/useAuth'
import { donationService } from '../../features/donation/services/donationService'
import './ProfileOverview.css'

const STATUS_LABELS = {
  pending: 'Menunggu',
  verified: 'Terverifikasi',
  pickup: 'Pengambilan',
  shipping: 'Pengiriman',
  received: 'Diterima',
  cancelled: 'Dibatalkan',
}

const CATEGORY_LABELS = {
  barang_bekas: 'Barang Bekas',
  pakaian_layak: 'Pakaian Layak',
  buku_atk: 'Buku & ATK',
  karya_daur_ulang: 'Karya Daur Ulang',
}

// Community slug to logo mapping
const COMMUNITY_LOGOS = {
  sedekas: '/sedekas.svg',
  'dipo-waste-bank': '/dipo waste bank 1.svg',
  'panti-asuhan-al-jannah': '/Panji AL JANNAH 1.svg',
  'panti-asuhan-kristen-tanah-putih': '/Panti asuhan kristen tanah putih 1.svg',
}

export default function ProfileOverview({ onNavigateToEdit }) {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [partners, setPartners] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [donations, communities] = await Promise.all([
          donationService.getUserDonations(),
          donationService.getUserCommunities(),
        ])

        // Map donations to activity cards
        const acts = donations.map((d) => ({
          id: d.id,
          image: d.photoUrl || '/buku-pelajarn.svg',
          title: d.item_name,
          recipient: d.communities?.name || 'Komunitas',
          description: `${d.item_name} (${d.quantity} barang). Diajukan pada ${new Date(d.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          tags: [
            CATEGORY_LABELS[d.category] || d.category,
            d.condition_note || 'Layak Pakai',
            `${d.quantity} Barang`,
            STATUS_LABELS[d.status] || d.status,
          ],
          actionText: 'Lihat Detail',
        }))

        setActivities(acts)

        // Map communities to partner cards
        const parts = communities.map((c) => ({
          id: c.id,
          image: COMMUNITY_LOGOS[c.slug] || c.logo_path || '/sedekas.svg',
          title: c.name,
          description: c.description || c.location || 'Komunitas verified',
        }))

        setPartners(parts)
      } catch (err) {
        console.error('[ProfileOverview] Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="profile-overview-container">
      {/* LEFT COLUMN: User Summary & Stats */}
      <section className="profile-left-col" aria-label="Informasi Pengguna">
        <div className="profile-avatar-card">
          <div className="profile-avatar-large-wrap">
            <img
              src={user.avatar || '/src/assets/images/profile-placeholder.svg'}
              alt={user.name}
              className="profile-avatar-large"
              style={{ objectPosition: user.avatarPosition || '50% 50%' }}
              onError={(e) => {
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
            <span>{user.location || 'Lokasi belum diatur'}</span>
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
            <span className="profile-stat-number">{user.stats?.donations ?? 0}</span>
            <span className="profile-stat-label">Donasi</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-number">{user.stats?.distributed ?? 0}</span>
            <span className="profile-stat-label">Tersalur</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-number">{user.stats?.saved ?? 0}</span>
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
          </div>

          {loading ? (
            <div className="activity-loading">
              <div className="activity-loading-dots">
                <span /><span /><span />
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="activity-empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h4 className="empty-state-title">Mulai Perjalanan Donasimu</h4>
              <p className="empty-state-desc">Barang bekasmu bernilai. Donasikan ke komunitas yang membutuhkan.</p>
              <Link to="/donasi" className="empty-state-btn">
                Mulai Donasi
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="activity-cards-slider">
              <div className="activity-cards-row">
                {activities.map((act) => (
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
            </div>
          )}
        </div>

        {/* Group 2: Partner / Komunitas Donasi */}
        <div className="activity-group">
          <div className="activity-group-header">
            <h3 className="activity-group-title">Komunitas Mitra</h3>
          </div>

          {loading ? (
            <div className="activity-loading">
              <div className="activity-loading-dots">
                <span /><span /><span />
              </div>
            </div>
          ) : partners.length === 0 ? (
            <div className="activity-empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="empty-state-title">Belum Ada Komunitas Mitra</h4>
              <p className="empty-state-desc">Donasi pertamamu akan menghubungkanmu dengan komunitas penerima.</p>
              <Link to="/donasi" className="empty-state-btn">
                Lihat Komunitas
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="activity-cards-slider">
              <div className="activity-cards-row">
                {partners.map((partner) => (
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
            </div>
          )}
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
