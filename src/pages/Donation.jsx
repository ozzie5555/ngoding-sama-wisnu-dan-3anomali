import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase/client'
import { donationService } from '../features/donation/services/donationService'
import CariKebutuhanModal from '../components/donation/CariKebutuhanModal'
import DonationActivity from '../components/donation/DonationActivity'
import DonationHistoryCard from '../components/donation/DonationHistoryCard'
import DonationDetailModal from '../components/donation/DonationDetailModal'
import Footer from '../components/Footer'
import './Donation.css'

const flow = [
  ['abandoned-cart.svg', 'Cari Kebutuhan Donasi', 'Cari barang yang sedang dibutuhkan oleh komunitas di sekitarmu.', 'Cari Kebutuhan', 'modal'],
  ['fingers-id.svg', 'Isi Form Donasi', 'Sudah tahu barang yang ingin didonasikan? Isi formulir donasi di sini.', 'Isi Form Donasi', '/donasi/form'],
  ['families.svg', 'Komunitas Penerima', 'Lihat komunitas terverifikasi yang menerima donasi sesuai kategori.', 'Lihat Komunitas', '#verified'],
  ['free-shipping.svg', 'Status Donasi', 'Pantau status donasi mulai dari verifikasi hingga barang diterima.', 'Cek Status Donasi', '#aktivitas'],
]

const partners = [
  ['sedekas semarang barat 1.svg', 'Sedekas', 'Komunitas di Semarang Barat yang mengumpulkan dan menyalurkan barang bekas layak pakai untuk membantu yang membutuhkan.', 'Jl. Simongan No. 69, Ngemplak Simongan, Semarang Barat, Kota Semarang, 50148', '@sedekas', 'sedekas'],
  ['dipo waste bank 1.svg', 'Dipo Waste Bank', 'Bank sampah di lingkungan kampus UNDIP yang menampung sampah terpilah untuk dikelola menjadi tabungan nasabah.', 'Tempat Pengelolaan Sampah Terpadu (TPST) UNDIP, Universitas Diponegoro, Tembalang, Semarang', '@dipowastebank', 'dipo-waste-bank'],
  ['Panji AL JANNAH 1.svg', 'Panti Asuhan Al Jannah', 'Panti Asuhan Al Jannah adalah panti asuhan di Semarang yang membina anak yatim, piatu, dan dhuafa melalui pendidikan serta pembinaan tahfidz Al-Qur’an.', 'Jl. Tapak No. 53, Tugurejo, Tugu, Kota Semarang, Jawa Tengah', '@pantialjannah', 'panti-asuhan-al-jannah'],
  ['Panti asuhan kristen tanah putih 1.svg', 'Panti Asuhan Kristen Tanah Putih', 'Panti asuhan yang membina anak-anak yatim dan kurang mampu lewat pendidikan, ibadah, dan kegiatan sosial.', 'Jl. Dr. Wahidin No. 14, Jomblang, Kec. Candisari, Kota Semarang, Jawa Tengah 50256, Indonesia', '@pantiasuhankristentanahputih', 'panti-asuhan-kristen-tanah-putih'],
]

const stats = [
  ['12.400+', 'Barang Tersirkulasi'],
  ['2.000 kg', 'Sampah Dikurangi'],
  ['4.680 kg', 'CO2 Dihemat'],
  ['1.500+', 'Pengguna Aktif'],
]

export default function Donation() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Modal State
  const [isCariModalOpen, setIsCariModalOpen] = useState(false)
  const [modalCommunityId, setModalCommunityId] = useState(null)

  // Donation State
  const [donations, setDonations] = useState([])
  const [donationsLoading, setDonationsLoading] = useState(false)
  const [activeDonation, setActiveDonation] = useState(null)
  const [selectedDetailDonation, setSelectedDetailDonation] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const loadDonations = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setDonations([])
      setActiveDonation(null)
      setDonationsLoading(false)
      return
    }

    setDonationsLoading(true)
    try {
      const all = await donationService.getUserDonations()
      setDonations(all)
      setActiveDonation(
        all.find((item) => ['pending', 'verified', 'pickup', 'shipping'].includes(item.status))
          || all.find((item) => item.status === 'received')
          || null,
      )
      setSelectedDetailDonation((current) => (
        current ? all.find((item) => item.id === current.id) || null : null
      ))
    } catch (error) {
      console.error('[Donation] Failed to load donations:', error)
      setDonations([])
      setActiveDonation(null)
    } finally {
      setDonationsLoading(false)
    }
  }, [isAuthenticated, user?.id])

  useEffect(() => {
    loadDonations()
    if (!isAuthenticated || !user?.id) return undefined

    const channel = supabase
      .channel('my-donation-changes')
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
  }, [isAuthenticated, user?.id, loadDonations])

  // Open modal if navigated with hash or state or search param
  useEffect(() => {
    if (location.state?.openCariModal || location.search.includes('cari=true')) {
      setIsCariModalOpen(true)
      if (location.state?.modalCommunityId) {
        setModalCommunityId(location.state.modalCommunityId)
      }
    }
  }, [location])

  const handleOpenCariModal = (communityId = null) => {
    setModalCommunityId(communityId)
    setIsCariModalOpen(true)
  }

  const handleOpenDetailModal = (item) => {
    setSelectedDetailDonation(item || activeDonation)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedDetailDonation(null)
  }

  const handleReviewSubmitted = () => {
    loadDonations()
  }

  return (
    <>
      <main className="donation-page">
      {/* Hero Section */}
      <section className="donation-hero">
        <div>
          <h1>
            Donasikan Barang,<br />
            Berikan Manfaat,<br />
            <em>Kembalikan Nilai.</em>
          </h1>
          <p>
            Barang layak pakai milikmu dapat membantu orang lain sekaligus mengurangi limbah. Bersama KEMBALI, wujudkan masa depan yang lebih hijau dan berkelanjutan.
          </p>
          <div className="donation-actions" style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
            <button
              type="button"
              onClick={() => handleOpenCariModal()}
              style={{
                backgroundColor: '#31595b',
                color: '#fff',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Mulai Donasi Sekarang &rarr;
            </button>
            <a href="#alur" style={{ padding: '14px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', border: '1.5px solid #31595b', color: '#31595b' }}>
              ▶ &nbsp; Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
        <img src="/design-thinking.svg" alt="Ilustrasi berbagi ide dan barang" />
      </section>

      {/* Authenticated Activity & History Section */}
      {isAuthenticated && donationsLoading && (
        <div className="donation-data-loading" role="status">
          <span className="donation-data-spinner" />
          Memuat aktivitas dan riwayat donasi...
        </div>
      )}
      {isAuthenticated && !donationsLoading && donations.length > 0 && (
        <section className="donation-activity-section" id="aktivitas">
          {activeDonation && (
            <div className="donation-activity-col">
              <div className="donation-section-heading-row">
                <h2 className="donation-section-title">Aktivitas Donasi</h2>
              </div>

              <DonationActivity
                donation={activeDonation}
                onOpenDetail={handleOpenDetailModal}
              />
            </div>
          )}

          <div className={`donation-history-col ${activeDonation ? '' : 'is-full-width'}`}>
            <div className="donation-section-heading-row">
              <h2 className="donation-section-title">Riwayat</h2>
            </div>
            <div className="donation-history-toolbar">
              <span>Donasi saya</span>
              <Link to="/donasi/history" className="history-see-all-link">Lihat Semua →</Link>
            </div>
            <div className="donation-history-list">
              {donations.slice(0, 2).map((item) => (
                <DonationHistoryCard
                  key={item.id}
                  donation={item}
                  onOpenDetail={handleOpenDetailModal}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Donation Flow */}
      <section className="donation-flow" id="alur">
        <h2>Alur Donasi di KEMBALI</h2>
        <div className="flow-row">
          {[
            ['Cari Kebutuhan', 'Temukan barang yang sedang dibutuhkan oleh komunitas.'],
            ['Isi Form Donasi', 'Lengkapi informasi barang dan data diri dengan mudah.'],
            ['Konfirmasi', 'Periksa kembali detail donasi dan konfirmasi pengajuan.'],
            ['Tracking Donasi', 'Pantau proses donasi hingga sampai ke penerima.'],
          ].map(([t, d], i) => (
            <article key={t}>
              <b>{i + 1}</b>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4 Options Grid */}
      <section className="donation-options">
        {flow.map(([img, title, desc, action, linkTarget], i) => (
          <article key={title}>
            <header>
              <div className="option-icon">
                {[
                  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
                  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M9 14l2 2 4-4" /></svg>,
                  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 17h4V5H2v12h3" /><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>,
                ][i]}
              </div>
              <div>
                <h3>{i + 1}. {title}</h3>
                <p>{desc}</p>
              </div>
            </header>
            <img src={'/' + img} alt="" />
            {linkTarget === 'modal' ? (
              <button
                type="button"
                onClick={() => handleOpenCariModal()}
                style={{
                  background: '#609400',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{action}</span>
                <span>&rarr;</span>
              </button>
            ) : linkTarget.startsWith('/') ? (
              <Link to={linkTarget}>{action} &rarr;</Link>
            ) : (
              <a href={linkTarget}>{action} &rarr;</a>
            )}
          </article>
        ))}
      </section>

      {/* Why Section */}
      <section className="why">
        <h2>Mengapa Berdonasi di KEMBALI?</h2>
        <div>
          {[
            ['mengapa-berdonasi-ikon/ri_leaf-fill.svg', 'Tersalurkan Tepat Sasaran', 'Donasimu akan disalurkan kepada penerima yang benar-benar membutuhkan.'],
            ['mengapa-berdonasi-ikon/mdi_recycle.svg', 'Dukung Ekonomi Sirkular', 'Mengurangi limbah dengan memanfaatkan kembali barang agar bernilai.'],
            ['mengapa-berdonasi-ikon/ant-design_safety-outlined.svg', 'Transparan & Terpercaya', 'Proses donasi transparan dan dapat dipantau setiap saat.'],
            ['mengapa-berdonasi-ikon/fluent_people-community-16-regular.svg', 'Bersama Komunitas', 'Berkolaborasi dengan komunitas, relawan, dan bank sampah.'],
          ].map(([icon, t, d]) => (
            <article key={t}>
              <img src={'/' + icon} alt="" className="why-icon" />
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Verified Communities */}
      <section className="verified" id="verified">
        <h2>Komunitas Terverifikasi</h2>
        <div className="verified-grid">
          {partners.map(([img, name, desc, address, handle, communityId]) => (
            <article key={name}>
              <img src={'/' + img} alt="" />
              <h3>{name}</h3>
              <p>{desc}</p>
              <div className="verified-meta">
                <address>{address}</address>
                <span>
                  <img src="/ri_instagram-fill.svg" alt="Instagram" className="verified-sosmed-icon" />
                  {handle}
                </span>
                <div style={{ marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenCariModal(communityId)}
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#3FBEC7',
                      color: '#ffffff',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px',
                    }}
                  >
                    Lihat Kebutuhan &rarr;
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Impact Banner */}
      <section className="donation-impact">
        <div>
          <h2>
            Siap Memberikan Kehidupan<br />
            Kedua untuk Barangmu?
          </h2>
          <p>
            Salurkan barang layak pakai ke komunitas yang membutuhkan hanya dalam beberapa langkah mudah.
          </p>
        </div>
        <div>
          {stats.map(([n, l]) => (
            <article key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </article>
          ))}
        </div>
        <img src="/Donation Streamline Bruxelles.svg" alt="" />
      </section>

      </main>

      {/* Premium Cari Kebutuhan Modal Component */}
      <CariKebutuhanModal
        isOpen={isCariModalOpen}
        onClose={() => {
          setIsCariModalOpen(false)
          setModalCommunityId(null)
        }}
        initialCommunityId={modalCommunityId}
      />

      {/* Donation Detail Modal */}
      <DonationDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        donation={selectedDetailDonation}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <Footer />
    </>
  )
}
