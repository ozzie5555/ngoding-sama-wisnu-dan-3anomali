import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase/client'
import { donationService } from '../features/donation/services/donationService'
import DonationHistoryCard from '../components/donation/DonationHistoryCard'
import DonationDetailModal from '../components/donation/DonationDetailModal'
import Footer from '../components/Footer'
import './DonationHistory.css'

const FILTER_TABS = [
  { key: 'semua', label: 'Semua' },
  { key: 'proses', label: 'Dalam Proses' },
  { key: 'selesai', label: 'Selesai' },
  { key: 'dibatalkan', label: 'Dibatalkan' },
]

export default function DonationHistory() {
  const { isAuthenticated, initialized, user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadDonations = async () => {
    if (!isAuthenticated || !user?.id) {
      setDonations([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const all = await donationService.getUserDonations()
      setDonations(all)
      setSelectedDonation((current) => (
        current ? all.find((item) => item.id === current.id) || null : null
      ))
    } catch (error) {
      console.error('[DonationHistory] Failed to load donations:', error)
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
    if (!isAuthenticated || !user?.id) return undefined

    const channel = supabase
      .channel('my-donation-history')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'donations',
        filter: `donor_id=eq.${user.id}`,
      }, loadDonations)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAuthenticated, user?.id])

  const handleOpenDetail = (donation) => {
    setSelectedDonation(donation)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDonation(null)
  }

  const handleReviewSubmitted = () => {
    loadDonations()
  }

  // Filter donations based on active tab and search query
  const filteredDonations = donations.filter((item) => {
    // Tab filter
    if (activeFilter === 'proses') {
      if (!['delivery', 'pickup', 'confirmation', 'shipping', 'pending', 'verified'].includes(item.status)) {
        return false
      }
    } else if (activeFilter === 'selesai') {
      if (!['completed', 'received'].includes(item.status)) {
        return false
      }
    } else if (activeFilter === 'dibatalkan') {
      if (!['cancelled', 'error'].includes(item.status)) {
        return false
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = item.title?.toLowerCase().includes(q)
      const matchCategory = item.category?.toLowerCase().includes(q)
      const matchDest = item.destination?.toLowerCase().includes(q) || item.destinationFull?.toLowerCase().includes(q)
      return matchTitle || matchCategory || matchDest
    }

    return true
  })

  if (!initialized || !isAuthenticated) {
    return (
      <>
        <main className="donation-history-page">
          <div className="history-empty-card">
            <h3>Masuk untuk Melihat Riwayat</h3>
            <p>Riwayat donasi hanya dapat dilihat oleh pemilik akun.</p>
            <Link to="/login" className="empty-action-btn">Masuk Sekarang</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="donation-history-page">
      <div className="donation-history-container">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="history-breadcrumb">
          <Link to="/donasi" className="history-back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali ke Halaman Donasi
          </Link>
        </div>

        {/* Page Header */}
        <header className="donation-history-header">
          <div className="history-header-left">
            <h1 className="history-page-title">Riwayat Donasi</h1>
            <p className="history-page-subtitle">
              Lihat seluruh perjalanan donasi yang pernah kamu lakukan di KEMBALI.
            </p>
          </div>
          <Link to="/donasi/form" className="history-new-donation-btn">
            + Ajukan Donasi Baru
          </Link>
        </header>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="donation-history-toolbar-box">
          <div className="history-filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`history-tab-btn ${activeFilter === tab.key ? 'is-active' : ''}`}
                onClick={() => setActiveFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="history-search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="history-search-input"
              placeholder="Cari nama barang atau komunitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Bersihkan pencarian"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* List / Grid of Donations */}
        <div className="donation-history-content-area">
          <div className="history-count-badge">
            Menampilkan <strong>{filteredDonations.length}</strong> donasi
          </div>

          {loading ? (
            <div className="history-empty-card"><p>Memuat riwayat donasi...</p></div>
          ) : filteredDonations.length === 0 ? (
            <div className="history-empty-card">
              <div className="empty-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                </svg>
              </div>
              <h3>Belum Ada Riwayat Donasi</h3>
              <p>
                {searchQuery
                  ? `Tidak ada donasi yang cocok dengan pencarian "${searchQuery}".`
                  : 'Perjalanan kebaikanmu akan tercatat secara detail di halaman ini.'}
              </p>
              <Link to="/donasi/form" className="empty-action-btn">
                Mulai Donasi Sekarang &rarr;
              </Link>
            </div>
          ) : (
            <div className="donation-history-grid">
              {filteredDonations.map((item) => (
                <DonationHistoryCard
                  key={item.id}
                  donation={item}
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>

    {/* Donation Detail Modal */}
    <DonationDetailModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      donation={selectedDonation}
      onReviewSubmitted={handleReviewSubmitted}
    />

    <Footer />
  </>
)
}
