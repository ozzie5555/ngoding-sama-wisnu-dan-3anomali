import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import { adminService, STATUS_LABELS } from '../features/admin/services/adminService'
import './Admin.css'

const STATUS_FLOW = {
  pending: ['verified', 'Verifikasi'],
  verified: ['pickup', 'Atur Pengambilan'],
  pickup: ['shipping', 'Tandai Dikirim'],
  shipping: ['received', 'Konfirmasi Diterima'],
}
const STATUS_ORDER = ['pending', 'verified', 'pickup', 'shipping', 'received', 'cancelled']
const ACTIVE_STATUSES = ['pending', 'verified', 'pickup', 'shipping']
const STALE_AFTER_MS = 24 * 60 * 60 * 1000
const SHORT_STATUS_LABELS = {
  pending: 'Menunggu',
  verified: 'Terverifikasi',
  pickup: 'Penjemputan',
  shipping: 'Pengiriman',
  received: 'Diterima',
  cancelled: 'Dibatalkan',
}

const ICONS = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  box: <><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
  logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
}

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>
}

const getErrorMessage = (error, fallback) => {
  const message = error?.message || ''
  if (message.includes('being handled by another admin')) return 'Donasi ini sedang ditangani admin lain.'
  if (message.includes('Claim this donation')) return 'Ambil tugas donasi ini sebelum mengubah status.'
  if (message.includes('assigned admin can release')) return 'Hanya admin yang menangani donasi ini yang dapat melepas tugas.'
  return message || fallback
}

export default function Admin() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('overview')
  const [donations, setDonations] = useState([])
  const [activities, setActivities] = useState([])
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [actionNote, setActionNote] = useState('')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [monitoringNow, setMonitoringNow] = useState(() => Date.now())

  const loadDonations = async (selectedId = null) => {
    setLoading(true)
    try {
      setError('')
      const [donationRows, activityRows] = await Promise.all([
        adminService.getDonations(),
        adminService.getRecentActivity(),
      ])
      setDonations(donationRows)
      setActivities(activityRows)
      setMonitoringNow(Date.now())
      if (selectedId) setSelected(donationRows.find((item) => item.id === selectedId) || null)
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Data monitoring gagal dimuat.'))
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    setUsersLoading(true)
    try {
      setError('')
      setUsers(await adminService.getUsers())
    } catch (loadError) {
      setError(loadError.message || 'Data pengguna gagal dimuat.')
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !['Admin', 'Manager Komunitas'].includes(user?.status)) return undefined

    let ignore = false
    async function startFetching() {
      try {
        const [donationRows, activityRows] = await Promise.all([
          adminService.getDonations(),
          adminService.getRecentActivity(),
        ])
        if (ignore) return
        setDonations(donationRows)
        setActivities(activityRows)
        setMonitoringNow(Date.now())
      } catch (loadError) {
        if (!ignore) setError(getErrorMessage(loadError, 'Data monitoring gagal dimuat.'))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    startFetching()
    return () => { ignore = true }
  }, [isAuthenticated, user?.id, user?.status])

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const counts = useMemo(() => STATUS_ORDER.reduce((result, status) => {
    result[status] = donations.filter((donation) => donation.status === status).length
    return result
  }, {}), [donations])

  const filtered = useMemo(() => donations.filter((donation) => (
    (filter === 'all' || donation.status === filter)
    && (!query.trim() || [donation.donation_code, donation.item_name, donation.donorName, donation.communityName]
      .some((value) => String(value || '').toLowerCase().includes(query.toLowerCase())))
  )), [donations, filter, query])

  const activeQueue = useMemo(() => donations
    .filter((donation) => ACTIVE_STATUSES.includes(donation.status))
    .slice(0, 5), [donations])

  const staleDonations = useMemo(() => donations.filter((donation) => (
    ACTIVE_STATUSES.includes(donation.status)
    && monitoringNow - new Date(donation.updated_at || donation.submitted_at).getTime() > STALE_AFTER_MS
  )), [donations, monitoringNow])

  const maxCount = Math.max(1, ...STATUS_ORDER.map((status) => counts[status] || 0))
  const selectedAssignedToMe = selected?.assigned_to === user?.id
  const selectedAssignedToOther = Boolean(selected?.assigned_to && !selectedAssignedToMe)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const openSection = (nextSection) => {
    setSection(nextSection)
    setMenuOpen(false)
    if (nextSection === 'users' && users.length === 0) loadUsers()
  }

  const handleClaim = async (donation, claim) => {
    setActionLoading(true)
    try {
      setError('')
      await adminService.claimDonation(donation.id, claim)
      await loadDonations(donation.id)
      showToast(claim ? 'Donasi berhasil Anda ambil.' : 'Tugas donasi berhasil dilepas.')
    } catch (claimError) {
      setError(getErrorMessage(claimError, 'Tugas donasi gagal diperbarui.'))
    } finally {
      setActionLoading(false)
    }
  }

  const requestTransition = (donation, nextStatus) => {
    setActionNote('')
    setPendingAction({ donation, nextStatus })
  }

  const confirmTransition = async () => {
    if (!pendingAction || (pendingAction.nextStatus === 'cancelled' && !actionNote.trim())) return
    setActionLoading(true)
    try {
      setError('')
      const note = actionNote.trim() || `Diproses oleh ${user.name}`
      await adminService.transitionDonation(pendingAction.donation.id, pendingAction.nextStatus, note)
      setPendingAction(null)
      setSelected(null)
      showToast(`Status diperbarui: ${STATUS_LABELS[pendingAction.nextStatus]}`)
      await loadDonations()
    } catch (transitionError) {
      setError(getErrorMessage(transitionError, 'Status gagal diperbarui.'))
    } finally {
      setActionLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <main className="admin-gate"><div className="admin-gate-card"><h1>Masuk diperlukan</h1><p>Gunakan akun admin khusus KEMBALI.</p><button type="button" onClick={() => navigate('/login', { state: { returnTo: '/admin' } })}>Masuk</button></div></main>
  }

  if (!['Admin', 'Manager Komunitas'].includes(user?.status)) {
    return <main className="admin-gate"><div className="admin-gate-card"><h1>Akses terbatas</h1><p>Akun ini belum memiliki role admin atau manager.</p><Link to="/">Kembali ke Beranda</Link></div></main>
  }

  const pageTitle = section === 'overview' ? 'Monitoring' : section === 'donations' ? 'Manajemen Donasi' : 'Pengguna & Role'
  const pageDescription = section === 'overview'
    ? 'Pantau antrean, keterlambatan, dan aktivitas operasional KEMBALI.'
    : section === 'donations'
      ? 'Periksa dan lanjutkan pengajuan berdasarkan tahap prosesnya.'
      : 'Kelola akun yang memiliki akses ke platform.'

  return <main className="admin-page">
    <div className="admin-shell">
      <div className={`admin-sidebar-backdrop ${menuOpen ? 'is-visible' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-head"><div className="admin-brand"><img src="/logo.svg" alt="KEMBALI"/><span>ADMIN</span></div><button type="button" className="admin-sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Tutup menu admin">×</button></div>
        <nav className="admin-nav" aria-label="Navigasi admin">
          <button className={section === 'overview' ? 'is-active' : ''} onClick={() => openSection('overview')}><Icon name="overview"/>Monitoring</button>
          <button className={section === 'donations' ? 'is-active' : ''} onClick={() => openSection('donations')}><Icon name="box"/>Donasi</button>
          <button className={section === 'users' ? 'is-active' : ''} onClick={() => openSection('users')}><Icon name="users"/>Pengguna</button>
        </nav>
        <div className="admin-sidebar-footer"><span className="admin-role-label">{user.status}</span><button type="button" className="admin-logout-button" onClick={async () => { await logout(); navigate('/login') }}><Icon name="logout"/>Keluar Akun</button></div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar"><button type="button" className="admin-mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Buka menu admin" aria-expanded={menuOpen}><span/><span/><span/></button><div><p className="admin-eyebrow">KEMBALI OPERATIONS</p><h1>{pageTitle}</h1><p className="admin-muted">{pageDescription}</p></div><div className="admin-user-pill"><span className="admin-user-dot"/>{user.name}</div></header>
        {toast && <div className="admin-toast" role="status">{toast}</div>}
        {error && <div className="admin-error" role="alert">{error}<button type="button" onClick={section === 'users' ? loadUsers : () => loadDonations(selected?.id)}>Coba lagi</button></div>}

        {section === 'overview' && <>
          <div className="admin-metric-grid">
            <article className="admin-metric-card admin-metric-primary"><span>Total Pengajuan</span><strong>{donations.length}</strong><small>Semua donasi tercatat</small></article>
            <article className="admin-metric-card"><span>Perlu Verifikasi</span><strong>{counts.pending || 0}</strong><small className="is-amber">Menunggu pemeriksaan</small></article>
            <article className="admin-metric-card"><span>Sedang Berjalan</span><strong>{(counts.verified || 0) + (counts.pickup || 0) + (counts.shipping || 0)}</strong><small className="is-blue">Dalam proses</small></article>
            <article className="admin-metric-card"><span>Perlu Perhatian</span><strong>{staleDonations.length}</strong><small className={staleDonations.length ? 'is-red' : 'is-green'}>{staleDonations.length ? 'Lebih dari 24 jam' : 'Operasional normal'}</small></article>
          </div>
          <div className="admin-monitoring-grid">
            <section className="admin-panel admin-chart-panel"><div className="admin-panel-header"><div><h2>Status Donasi</h2><p>Distribusi pengajuan berdasarkan tahapan.</p></div><button type="button" className="admin-refresh-btn" onClick={() => loadDonations()}>↻ Refresh</button></div><div className="admin-bar-chart" role="img" aria-label="Grafik jumlah donasi berdasarkan status">{STATUS_ORDER.map((status) => <div className="admin-bar-item" key={status}><div className="admin-bar-value">{counts[status] || 0}</div><div className={`admin-bar-fill status-${status}`} style={{ height: `${Math.max(5, ((counts[status] || 0) / maxCount) * 100)}%` }}/><span>{SHORT_STATUS_LABELS[status]}</span></div>)}</div></section>
            <section className="admin-panel admin-attention-panel"><div className="admin-panel-heading"><span className={staleDonations.length ? 'is-warning' : 'is-safe'}><Icon name={staleDonations.length ? 'clock' : 'shield'}/></span><div><h2>Perlu Perhatian</h2><p>Donasi tanpa pembaruan lebih dari 24 jam.</p></div></div>{staleDonations.length === 0 ? <div className="admin-safe-state"><strong>Semua proses terkendali</strong><span>Tidak ada donasi yang melewati batas pemantauan.</span></div> : <div className="admin-attention-list">{staleDonations.slice(0, 4).map((donation) => <button type="button" key={donation.id} onClick={() => setSelected(donation)}><span><strong>{donation.donation_code}</strong><small>{donation.item_name}</small></span><em>{donation.statusLabel}</em></button>)}</div>}</section>
            <section className="admin-panel admin-priority-panel"><div className="admin-panel-header"><div><h2>Antrean Prioritas</h2><p>Donasi aktif paling lama ditampilkan lebih dahulu.</p></div><button type="button" className="admin-text-button" onClick={() => openSection('donations')}>Lihat semua →</button></div>{loading ? <div className="admin-empty"><span className="admin-spinner"/>Memuat antrean...</div> : activeQueue.length === 0 ? <div className="admin-empty"><strong>Tidak ada antrean aktif</strong></div> : <div className="admin-priority-list">{activeQueue.map((donation) => <button type="button" key={donation.id} onClick={() => setSelected(donation)}><span className={`admin-priority-dot status-${donation.status}`}/><span><strong>{donation.item_name}</strong><small>{donation.donation_code} · {donation.donorName}</small></span><span className="admin-assignee-text">{donation.assigneeName || 'Belum ditangani'}</span><span className={`admin-status status-${donation.status}`}>{donation.statusLabel}</span></button>)}</div>}</section>
            <section className="admin-panel admin-activity-panel"><div className="admin-panel-header"><div><h2>Aktivitas Terbaru</h2><p>Riwayat perubahan oleh tim admin.</p></div></div>{activities.length === 0 ? <div className="admin-empty"><strong>Belum ada aktivitas</strong></div> : <div className="admin-activity-list">{activities.map((activity) => <article key={activity.id}><span className={`admin-activity-dot status-${activity.to_status}`}/><div><strong>{activity.actorName}</strong><p>{activity.donationCode} menjadi <b>{activity.toStatusLabel}</b></p><small>{activity.timeLabel}</small></div></article>)}</div>}</section>
          </div>
        </>}

        {section === 'donations' && <section className="admin-panel">
          <div className="admin-panel-header"><div><h2>Antrean Donasi</h2><p>Pilih tahap untuk memantau dan memproses pengajuan.</p></div><button type="button" className="admin-refresh-btn" onClick={() => loadDonations()}>↻ Refresh</button></div>
          <div className="admin-status-tabs" role="tablist" aria-label="Filter status donasi"><button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Semua <span>{donations.length}</span></button>{STATUS_ORDER.map((status) => <button type="button" role="tab" aria-selected={filter === status} className={filter === status ? 'is-active' : ''} onClick={() => setFilter(status)} key={status}>{SHORT_STATUS_LABELS[status]} <span>{counts[status] || 0}</span></button>)}</div>
          <div className="admin-toolbar"><label className="admin-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kode, donatur, barang, atau komunitas"/></label></div>
          {loading ? <div className="admin-empty"><span className="admin-spinner"/>Memuat data...</div> : filtered.length === 0 ? <div className="admin-empty"><Icon name="box"/><strong>Belum ada donasi yang cocok</strong></div> : <div className="admin-donation-list">{filtered.map((donation) => <button type="button" className="admin-donation-row" key={donation.id} onClick={() => setSelected(donation)}><img src={donation.image} alt=""/><span className="admin-donation-main"><strong>{donation.item_name}</strong><small>{donation.donation_code} · {donation.donorName}</small><em className={donation.assigned_to ? 'is-assigned' : ''}>{donation.assigneeName || 'Belum ditangani'}</em></span><span className="admin-donation-community">{donation.communityName}</span><span className={`admin-status status-${donation.status}`}>{donation.statusLabel}</span><span className="admin-donation-date">{donation.dateLabel}</span><span className="admin-row-arrow">→</span></button>)}</div>}
        </section>}

        {section === 'users' && <section className="admin-panel"><div className="admin-panel-header"><div><h2>Daftar Pengguna</h2><p>Role dan identitas akun yang terdaftar.</p></div><button type="button" className="admin-refresh-btn" onClick={loadUsers}>↻ Refresh</button></div>{usersLoading ? <div className="admin-empty"><span className="admin-spinner"/>Memuat pengguna...</div> : <div className="admin-users-list">{users.map((person) => <div className="admin-user-row" key={person.id}><div className="admin-user-avatar">{(person.full_name || person.username || 'P').charAt(0).toUpperCase()}</div><div className="admin-user-info"><strong>{person.full_name || 'Tanpa nama'}</strong><span>{person.username || person.email || 'Email tidak tersedia'}</span></div><span className={`admin-role-badge role-${person.role}`}>{person.role}</span><small>{person.phone || 'Telepon belum diatur'}</small></div>)}</div>}</section>}
      </section>
    </div>

    {selected && <div className="admin-modal-backdrop" onClick={() => !actionLoading && setSelected(null)}><article className="admin-detail-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="admin-modal-close" onClick={() => setSelected(null)} aria-label="Tutup detail">×</button><div className="admin-detail-head"><img src={selected.image} alt="Foto barang donasi"/><div><span className={`admin-status status-${selected.status}`}>{selected.statusLabel}</span><h2>{selected.item_name}</h2><p>{selected.donation_code} · {selected.dateLabel}</p></div></div><div className={`admin-assignment-banner ${selectedAssignedToOther ? 'is-locked' : selectedAssignedToMe ? 'is-mine' : ''}`}><Icon name="users"/><div><span>Penanggung jawab</span><strong>{selected.assigneeName || 'Belum ada admin yang menangani'}</strong></div></div><div className="admin-detail-grid"><div><span>Donatur</span><strong>{selected.donorName}</strong></div><div><span>Komunitas</span><strong>{selected.communityName}</strong></div><div><span>Jumlah</span><strong>{selected.quantity} barang</strong></div><div><span>Kondisi</span><strong>{selected.condition_note || '-'}</strong></div></div><div className="admin-detail-description"><span>Deskripsi</span><p>{selected.description || '-'}</p><span>Alamat pengambilan</span><p>{selected.pickup_address || '-'}</p></div>{STATUS_FLOW[selected.status] && <div className="admin-detail-actions">{!selected.assigned_to && <><p>Ambil tugas ini sebelum mengubah status agar tidak diproses admin lain.</p><button type="button" onClick={() => handleClaim(selected, true)} disabled={actionLoading}>{actionLoading ? 'Memproses...' : 'Ambil Tugas'}</button></>}{selectedAssignedToOther && <p className="admin-locked-message">Donasi sedang ditangani <strong>{selected.assigneeName}</strong>. Tombol perubahan status dikunci.</p>}{selectedAssignedToMe && <><p>Langkah berikutnya: <strong>{STATUS_LABELS[STATUS_FLOW[selected.status][0]]}</strong></p><button type="button" onClick={() => requestTransition(selected, STATUS_FLOW[selected.status][0])} disabled={actionLoading}>{STATUS_FLOW[selected.status][1]} →</button>{['pending', 'verified', 'pickup'].includes(selected.status) && <button type="button" className="admin-cancel-action" onClick={() => requestTransition(selected, 'cancelled')} disabled={actionLoading}>Batalkan Donasi</button>}<button type="button" className="admin-release-action" onClick={() => handleClaim(selected, false)} disabled={actionLoading}>Lepaskan Tugas</button></>}</div>}</article></div>}

    {pendingAction && <div className="admin-confirm-backdrop" onClick={() => !actionLoading && setPendingAction(null)}><article className="admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title" onClick={(event) => event.stopPropagation()}><div className="admin-confirm-icon"><Icon name="shield"/></div><p className="admin-eyebrow">KONFIRMASI STATUS</p><h2 id="admin-confirm-title">Pastikan donasi yang dipilih benar</h2><div className="admin-confirm-summary"><strong>{pendingAction.donation.donation_code} · {pendingAction.donation.item_name}</strong><span>Donatur: {pendingAction.donation.donorName}</span><div><span className={`admin-status status-${pendingAction.donation.status}`}>{STATUS_LABELS[pendingAction.donation.status]}</span><b>→</b><span className={`admin-status status-${pendingAction.nextStatus}`}>{STATUS_LABELS[pendingAction.nextStatus]}</span></div></div><label className="admin-note-field"><span>Catatan {pendingAction.nextStatus === 'cancelled' ? '(wajib)' : '(opsional)'}</span><textarea value={actionNote} onChange={(event) => setActionNote(event.target.value)} placeholder={pendingAction.nextStatus === 'cancelled' ? 'Tuliskan alasan pembatalan' : 'Tambahkan catatan operasional'}/></label><div className="admin-confirm-actions"><button type="button" className="admin-confirm-secondary" onClick={() => setPendingAction(null)} disabled={actionLoading}>Kembali</button><button type="button" className={pendingAction.nextStatus === 'cancelled' ? 'is-danger' : ''} onClick={confirmTransition} disabled={actionLoading || (pendingAction.nextStatus === 'cancelled' && !actionNote.trim())}>{actionLoading ? 'Menyimpan...' : 'Konfirmasi Perubahan'}</button></div></article></div>}
  </main>
}
