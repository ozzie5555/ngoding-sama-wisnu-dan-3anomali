import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../context/useAuth'
import { donationService } from '../../features/donation/services/donationService'
import DonationDetailModal from '../donation/DonationDetailModal'
import PaginationBar from '../insight/PaginationBar'
import { getStoredDonations, getDonationById } from '../../data/donationData'
import './ProfileOverview.css'

const STATUS_LABELS = {
  pending: 'Menunggu',
  verified: 'Terverifikasi',
  pickup: 'Pengambilan',
  shipping: 'Pengiriman',
  received: 'Diterima',
  cancelled: 'Dibatalkan',
  completed: 'Selesai',
  delivery: 'Dalam Perjalanan',
  confirmation: 'Konfirmasi',
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

const chunkArray = (arr, size = 2) => {
  const res = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res.length > 0 ? res : [[]]
}

export default function ProfileOverview({ onNavigateToEdit }) {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [partners, setPartners] = useState([])
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1-indexed pagination state
  const [donationPage, setDonationPage] = useState(1)
  const [partnerPage, setPartnerPage] = useState(1)

  const loadData = async () => {
    try {
      let donations = []
      let communities = []

      try {
        const [donRes, commRes] = await Promise.all([
          donationService.getUserDonations(),
          donationService.getUserCommunities(),
        ])
        donations = donRes || []
        communities = commRes || []
      } catch {
        // Fallback to local store
      }

      // If no remote donations, use centralized local donations
      if (donations.length === 0) {
        const localDonations = getStoredDonations()
        donations = localDonations.map((d) => ({
          id: d.id,
          rawDonation: d,
          item_name: d.title,
          photoUrl: d.image,
          communities: { name: d.destination },
          category: d.categoryKey || d.category,
          condition_note: d.conditionNote || 'Layak Pakai',
          quantity: d.quantity || 1,
          status: d.status,
          submitted_at: d.submittedAt || new Date().toISOString(),
        }))
      }

      // Map donations to activity cards
      const acts = donations.map((d) => ({
        id: d.id,
        rawDonation: d.rawDonation || d,
        image: d.photoUrl || d.image || '/buku-pelajarn.svg',
        title: d.item_name || d.title,
        recipient: d.communities?.name || d.destination || 'Komunitas Terverifikasi',
        description: `${d.item_name || d.title} (${d.quantity || 1} barang). Diajukan pada ${new Date(d.submitted_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        tags: [
          CATEGORY_LABELS[d.category] || d.category || 'Barang Bekas',
          d.condition_note || 'Layak Pakai',
          `${d.quantity || 1} Barang`,
          STATUS_LABELS[d.status] || d.statusLabel || d.status,
        ],
        actionText: 'Lihat Detail',
      }))

      setActivities(acts)

      // Fallback partners if empty
      if (communities.length === 0) {
        setPartners([
          {
            id: 'p1',
            image: '/sedekas semarang barat 1.svg',
            title: 'Sedekas',
            description: 'Komunitas di Semarang Barat yang menyalurkan barang layak pakai.',
          },
          {
            id: 'p2',
            image: '/Panji AL JANNAH 1.svg',
            title: 'Panti Asuhan Al Jannah',
            description: 'Membina anak yatim, piatu, dan dhuafa di Semarang.',
          },
          {
            id: 'p3',
            image: '/Panti asuhan kristen tanah putih 1.svg',
            title: 'Panti Asuhan Kristen Tanah Putih',
            description: 'Panti asuhan di Candisari, Semarang.',
          },
          {
            id: 'p4',
            image: '/dipo waste bank 1.svg',
            title: 'Dipo Waste Bank',
            description: 'Bank sampah TPST UNDIP Tembalang Semarang.',
          },
        ])
      } else {
        const parts = communities.map((c) => ({
          id: c.id,
          image: COMMUNITY_LOGOS[c.slug] || c.logo_path || '/sedekas.svg',
          title: c.name,
          description: c.description || c.location || 'Komunitas verified',
        }))
        setPartners(parts)
      }
    } catch (err) {
      console.error('[ProfileOverview] Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenDetail = (act) => {
    const fullDonation = getDonationById(act.id) || act.rawDonation || {
      id: act.id,
      title: act.title,
      image: act.image,
      destination: act.recipient,
      destinationFull: act.recipient,
      category: act.tags[0],
      status: 'delivery',
      stepIndex: 4,
      date: 'Agustus 2026',
      description: act.description,
      tags: act.tags,
    }
    setSelectedDonation(fullDonation)
    setIsDetailModalOpen(true)
  }

  const donationChunks = chunkArray(activities, 2)
  const partnerChunks = chunkArray(partners, 2)

  const activeDonationPage = Math.min(donationPage, donationChunks.length)
  const activePartnerPage = Math.min(partnerPage, partnerChunks.length)

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
        <h2 className="profile-section-title">Aktivitas &amp; Riwayat</h2>

        {/* Group 1: Donasi saya */}
        <div className="activity-group">
          <div className="activity-group-header">
            <h3 className="activity-group-title">Donasi saya</h3>
            <Link to="/profile/history" className="activity-see-all">
              Lihat Semua &rarr;
            </Link>
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
            <div className="activity-carousel-wrapper">
              <div className="activity-carousel-viewport">
                <div
                  className="activity-carousel-track"
                  style={{ transform: `translateX(-${(activeDonationPage - 1) * 100}%)` }}
                >
                  {donationChunks.map((chunk, chunkIdx) => (
                    <div key={chunkIdx} className="activity-cards-slide">
                      {chunk.map((act, index) => (
                        <article key={act.id} className={`donation-card card-variant-${index % 2}`}>
                          <div className="donation-card-img-wrap">
                            <img
                              src={act.image}
                              alt={act.title}
                              className="donation-card-img"
                              onError={(e) => {
                                e.target.src = '/buku-pelajarn.svg'
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
                              onClick={() => handleOpenDetail(act)}
                            >
                              {act.rawDonation?.status === 'delivery' ? 'Lacak Donasi' : act.actionText || 'Lihat Detail'}
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight-style Pagination Indicator Bar */}
              {donationChunks.length > 1 && (
                <div className="activity-pagination-footer">
                  <button
                    type="button"
                    className="activity-nav-chevron-btn"
                    onClick={() => setDonationPage((p) => Math.max(1, p - 1))}
                    disabled={activeDonationPage === 1}
                    aria-label="Halaman sebelumnya"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <PaginationBar
                    totalPages={donationChunks.length}
                    currentPage={activeDonationPage}
                    onSelectPage={(p) => setDonationPage(p)}
                  />

                  <button
                    type="button"
                    className="activity-nav-chevron-btn"
                    onClick={() => setDonationPage((p) => Math.min(donationChunks.length, p + 1))}
                    disabled={activeDonationPage === donationChunks.length}
                    aria-label="Halaman selanjutnya"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Group 2: Partner / Komunitas Donasi */}
        <div className="activity-group">
          <div className="activity-group-header">
            <h3 className="activity-group-title">Komunitas Mitra</h3>
            <Link to="/profile/history" className="activity-see-all">
              Lihat Semua &rarr;
            </Link>
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
            <div className="activity-carousel-wrapper">
              <div className="activity-carousel-viewport">
                <div
                  className="activity-carousel-track"
                  style={{ transform: `translateX(-${(activePartnerPage - 1) * 100}%)` }}
                >
                  {partnerChunks.map((chunk, chunkIdx) => (
                    <div key={chunkIdx} className="activity-cards-slide">
                      {chunk.map((partner, index) => (
                        <article key={partner.id} className={`partner-card-profile partner-variant-${index % 2}`}>
                          <div className="partner-card-img-wrap">
                            <img
                              src={partner.image}
                              alt={partner.title}
                              className="partner-card-img"
                              onError={(e) => {
                                e.target.src = '/sedekas.svg'
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
                  ))}
                </div>
              </div>

              {/* Insight-style Pagination Indicator Bar */}
              {partnerChunks.length > 1 && (
                <div className="activity-pagination-footer">
                  <button
                    type="button"
                    className="activity-nav-chevron-btn"
                    onClick={() => setPartnerPage((p) => Math.max(1, p - 1))}
                    disabled={activePartnerPage === 1}
                    aria-label="Halaman sebelumnya"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <PaginationBar
                    totalPages={partnerChunks.length}
                    currentPage={activePartnerPage}
                    onSelectPage={(p) => setPartnerPage(p)}
                  />

                  <button
                    type="button"
                    className="activity-nav-chevron-btn"
                    onClick={() => setPartnerPage((p) => Math.min(partnerChunks.length, p + 1))}
                    disabled={activePartnerPage === partnerChunks.length}
                    aria-label="Halaman selanjutnya"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Donation Detail Modal */}
      <DonationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedDonation(null)
        }}
        donation={selectedDonation}
        onReviewSubmitted={loadData}
      />
    </div>
  )
}
