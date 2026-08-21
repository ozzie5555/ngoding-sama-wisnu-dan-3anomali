import { useState, useEffect } from 'react'
import './ProfileModal.css'

const FALLBACK_PROVINCES = [{ id: '33', name: 'JAWA TENGAH' }]
const FALLBACK_CITIES = [{ id: '3374', name: 'KOTA SEMARANG' }]
const FALLBACK_DISTRICTS = [
  { id: '3374020', name: 'SEMARANG BARAT' },
  { id: '3374010', name: 'SEMARANG SELATAN' },
  { id: '3374030', name: 'SEMARANG UTARA' },
]
const FALLBACK_VILLAGES = [
  { id: '3374020005', name: 'NGEMPLAK SIMONGAN' },
  { id: '3374020006', name: 'BONGSARI' },
  { id: '3374020007', name: 'GISIKDRONO' },
]

// ==========================================================
// 1. DATE PICKER MODAL / POPOVER (Figma Page 5)
// ==========================================================
export function DatePickerModal({ isOpen, onClose, onSelectDate }) {
  const [currentYear, setCurrentYear] = useState(1990)
  const [currentMonth, setCurrentMonth] = useState(0) // 0 = January
  const [selectedDay, setSelectedDay] = useState(1)
  const [viewMode, setViewMode] = useState('date') // 'date', 'month', 'year'
  
  // For year view pagination
  const [yearPageStart, setYearPageStart] = useState(1980)

  if (!isOpen) return null

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const handlePrev = () => {
    if (viewMode === 'date') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear((y) => y - 1)
      } else {
        setCurrentMonth((m) => m - 1)
      }
    } else if (viewMode === 'year') {
      setYearPageStart((y) => y - 12)
    }
  }

  const handleNext = () => {
    if (viewMode === 'date') {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear((y) => y + 1)
      } else {
        setCurrentMonth((m) => m + 1)
      }
    } else if (viewMode === 'year') {
      setYearPageStart((y) => y + 12)
    }
  }

  const handleApply = () => {
    const formatted = `${String(selectedDay).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`
    onSelectDate(formatted)
    onClose()
  }

  // Generate calendar dates for the current month
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay() || 7 // 1=Mon...7=Sun
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
  
  const prevMonthDays = getDaysInMonth(currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear)
  
  const prevMonthDates = Array.from({ length: firstDay - 1 }, (_, i) => prevMonthDays - firstDay + 2 + i)
  const currentMonthDates = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const nextMonthDates = Array.from({ length: 42 - (prevMonthDates.length + currentMonthDates.length) }, (_, i) => i + 1)

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box datepicker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Navigation Header */}
        <div className="dp-header">
          {(viewMode === 'date' || viewMode === 'year') && (
            <button type="button" className="dp-nav-btn" onClick={handlePrev}>
              ‹
            </button>
          )}
          
          <div className="dp-title-group">
            {viewMode === 'date' && (
              <>
                <span className="dp-month-title clickable" onClick={() => setViewMode('month')}>
                  {monthNames[currentMonth]}
                </span>
                <span className="dp-month-title clickable" onClick={() => { setYearPageStart(currentYear - 4); setViewMode('year'); }}>
                  {currentYear}
                </span>
              </>
            )}
            {viewMode === 'month' && <span className="dp-month-title">Pilih Bulan</span>}
            {viewMode === 'year' && <span className="dp-month-title">{yearPageStart} - {yearPageStart + 11}</span>}
          </div>

          {(viewMode === 'date' || viewMode === 'year') && (
            <button type="button" className="dp-nav-btn" onClick={handleNext}>
              ›
            </button>
          )}
        </div>

        {viewMode === 'date' && (
          <>
            <div className="dp-days-header">
              <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
            </div>
            <div className="dp-grid">
              {prevMonthDates.map((day, idx) => (
                <button key={`prev-${idx}`} type="button" className="dp-day-btn is-other-month">
                  {day}
                </button>
              ))}
              {currentMonthDates.map((day) => (
                <button
                  key={`curr-${day}`}
                  type="button"
                  className={`dp-day-btn ${day === selectedDay ? 'is-selected' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
              {nextMonthDates.map((day, idx) => (
                <button key={`next-${idx}`} type="button" className="dp-day-btn is-other-month">
                  {day}
                </button>
              ))}
            </div>
          </>
        )}

        {viewMode === 'month' && (
          <div className="dp-grid-month-year">
            {monthNames.map((month, idx) => (
              <button 
                key={month} 
                type="button" 
                className={`dp-month-year-btn ${idx === currentMonth ? 'is-selected' : ''}`}
                onClick={() => { setCurrentMonth(idx); setViewMode('date'); }}
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {viewMode === 'year' && (
          <div className="dp-grid-month-year">
            {Array.from({ length: 12 }, (_, i) => yearPageStart + i).map(year => (
              <button 
                key={year} 
                type="button" 
                className={`dp-month-year-btn ${year === currentYear ? 'is-selected' : ''}`}
                onClick={() => { setCurrentYear(year); setViewMode('date'); }}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="dp-actions" style={{ marginTop: '16px' }}>
          <button type="button" className="modal-btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button type="button" className="modal-btn-primary" onClick={handleApply}>
            Pilih
          </button>
        </div>
      </div>
    </div>
  )
}

// ==========================================================
// 2. DELETE ACCOUNT MODAL (Figma Page 5)
// ==========================================================
export function DeleteAccountModal({ isOpen, onClose, onConfirmDelete, isDeleting = false }) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  if (!isOpen) return null

  return (
    <div className={isDeleting ? 'profile-modal-overlay is-busy' : 'profile-modal-overlay'} onClick={() => !isDeleting && onClose()}>
      <div className="profile-modal-box delete-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x-close" onClick={onClose} aria-label="Tutup modal" disabled={isDeleting}>
          &times;
        </button>

        <div className="delete-modal-content">
          <div className="delete-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <div className="delete-modal-text">
            <h3 className="modal-title">{isDeleting ? 'Menghapus akun...' : 'Hapus Akun'}</h3>
            <p className="modal-desc">
              {isDeleting
                ? 'Data akun dan file pribadi sedang dibersihkan dengan aman. Jangan tutup halaman ini.'
                : 'Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.'}
            </p>
          </div>
        </div>

        <div className="delete-modal-footer">
          <label className="modal-checkbox-label">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              disabled={isDeleting}
            />
            <span>Jangan tampilkan lagi</span>
          </label>

          <div className="modal-buttons-row">
            <button type="button" className="modal-btn-cancel" onClick={onClose} disabled={isDeleting}>
              Batal
            </button>
            <button
              type="button"
              className="modal-btn-danger"
              onClick={async () => {
                const deleted = await onConfirmDelete(dontShowAgain)
                if (deleted) onClose()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="delete-loading-spinner" aria-hidden="true" />
                  Menghapus...
                </>
              ) : 'Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================================
// 3. CHANGE PASSWORD MODAL (Figma Page 6)
// ==========================================================
export function ChangePasswordModal({ isOpen, onClose, onSavePassword, lastUpdated }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      setError('Kata sandi baru harus minimal 8 karakter.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }
    onSavePassword(currentPassword, newPassword)
    onClose()
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box security-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x-close" onClick={onClose} aria-label="Tutup modal">
          &times;
        </button>

        <div className="modal-header-with-icon">
          <div className="security-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h3 className="modal-title">Ubah Kata Sandi</h3>
            <p className="modal-subtitle">Terakhir diperbarui: {lastUpdated || 'Belum pernah diperbarui'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          {error && <div className="modal-alert-error">{error}</div>}

          <div className="modal-form-group">
            <label>Kata sandi saat ini*</label>
            <input
              type="password"
              placeholder="Masukkan kata sandi saat ini"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Kata sandi baru*</label>
            <input
              type="password"
              placeholder="Buat kata sandi baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Konfirmasi kata sandi baru*</label>
            <input
              type="password"
              placeholder="Ulangi kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="modal-field-note">Harus terdiri dari minimal 8 karakter.</span>
          </div>

          <div className="modal-form-actions-stacked">
            <button type="submit" className="modal-btn-teal-full">
              Simpan
            </button>
            <button type="button" className="modal-btn-cancel-full" onClick={onClose}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==========================================================
// 4. WHATSAPP NUMBER MODAL (Figma Page 6)
// ==========================================================
export function WhatsappModal({ isOpen, onClose, currentWhatsapp, onSaveWhatsapp }) {
  const [number, setNumber] = useState(currentWhatsapp || '')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSaveWhatsapp(number)
    onClose()
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box security-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x-close" onClick={onClose} aria-label="Tutup modal">
          &times;
        </button>

        <div className="modal-header-with-icon">
          <div className="green-check-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <h3 className="modal-title">Nomor WhatsApp</h3>
            <p className="modal-subtitle">
              Nomor WhatsApp diperlukan untuk koordinasi penjemputan atau pembaruan status donasi.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form-group">
            <label>Tambahkan Nomor</label>
            <input
              type="text"
              placeholder="+62 812-XXXX-XXXX"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>

          <div className="modal-buttons-row modal-space-between">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-primary">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==========================================================
// 5. CHANGE EMAIL MODAL (2 Steps - Figma Page 7)
// ==========================================================
export function ChangeEmailModal({ isOpen, onClose, currentEmail, onSaveEmail }) {
  const [step, setStep] = useState(1) // 1 = Confirm password, 2 = Enter new email
  const [password, setPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const resetAndClose = () => {
    if (isSaving) return
    setStep(1)
    setPassword('')
    setNewEmail('')
    setConfirmPassword('')
    setError('')
    onClose()
  }

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (!password) return
    setError('')
    setStep(2)
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    const normalizedEmail = newEmail.trim().toLowerCase()
    if (normalizedEmail === currentEmail.trim().toLowerCase()) {
      setError('Email baru harus berbeda dari email saat ini.')
      return
    }
    if (confirmPassword !== password) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    try {
      setError('')
      setIsSaving(true)
      await onSaveEmail(normalizedEmail, password)
      setIsSaving(false)
      resetAndClose()
    } catch (saveError) {
      setError(saveError.message || 'Permintaan perubahan email gagal.')
      setIsSaving(false)
    }
  }

  return (
    <div className="profile-modal-overlay" onClick={resetAndClose}>
      <div className="profile-modal-box security-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x-close" onClick={resetAndClose} aria-label="Tutup modal" disabled={isSaving}>
          &times;
        </button>

        {step === 1 ? (
          /* Step 1: Confirmation before changing email (Page 7 Right) */
          <>
            <div className="modal-header-with-icon">
              <div className="shield-icon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="modal-title">Silakan masukkan kata sandi Anda</h3>
                <p className="modal-subtitle">Masukkan kata sandi Anda untuk melakukan perubahan ini.</p>
              </div>
            </div>

            <form onSubmit={handleStep1Submit} className="modal-form">
              {error && <div className="modal-alert-error" role="alert">{error}</div>}
              <div className="modal-form-group">
                <label>Email atau username</label>
                <input
                  type="text"
                  value={currentEmail}
                  readOnly
                  style={{ background: '#f6f9f8', color: '#658185' }}
                />
              </div>

              <div className="modal-form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="modal-buttons-row modal-space-between">
                <button type="button" className="modal-btn-cancel" onClick={resetAndClose}>
                  Batal
                </button>
                <button type="submit" className="modal-btn-primary">
                  Lanjut
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Step 2: New email input (Page 7 Left) */
          <>
            <div className="modal-header-with-icon">
              <div className="green-check-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <h3 className="modal-title">Ubah Email</h3>
                <p className="modal-subtitle">
                  Email digunakan untuk masuk akun dan menerima pembaruan penting terkait keamanan.
                </p>
              </div>
            </div>

            <form onSubmit={handleStep2Submit} className="modal-form">
              {error && <div className="modal-alert-error" role="alert">{error}</div>}
              <div className="modal-form-group">
                <label>Masukkan Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={isSaving}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Konfirmasi Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSaving}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="modal-buttons-row modal-space-between">
                <button type="button" className="modal-btn-cancel" onClick={() => { setError(''); setStep(1) }} disabled={isSaving}>
                  Kembali
                </button>
                <button type="submit" className="modal-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Mengirim...' : 'Simpan'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ==========================================================
// 6. LOCATION PICKER MODAL
// ==========================================================
export function LocationPickerModal({ isOpen, onClose, currentLocation, onSaveLocation }) {
  const [provinces, setProvinces] = useState([])
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [villages, setVillages] = useState([])

  const [selectedProvince, setSelectedProvince] = useState({ id: '', name: '' })
  const [selectedCity, setSelectedCity] = useState({ id: '', name: '' })
  const [selectedDistrict, setSelectedDistrict] = useState({ id: '', name: '' })
  const [selectedVillage, setSelectedVillage] = useState({ id: '', name: '' })

  const [detail, setDetail] = useState('')
  const [isLoadingRegions, setIsLoadingRegions] = useState(false)
  const [regionError, setRegionError] = useState('')

  useEffect(() => {
    if (!isOpen || provinces.length) return undefined
    let active = true
    async function loadProvinces() {
      setIsLoadingRegions(true)
      setRegionError('')
      try {
        const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
        if (!response.ok) throw new Error('Wilayah tidak dapat dimuat')
        const data = await response.json()
        if (active) setProvinces(data)
      } catch {
        if (active) {
          setProvinces(FALLBACK_PROVINCES)
          setRegionError('Data wilayah online sedang tidak tersedia. Wilayah Jawa Tengah tetap tersedia.')
        }
      } finally {
        if (active) setIsLoadingRegions(false)
      }
    }
    loadProvinces()
    return () => { active = false }
  }, [isOpen, provinces.length])

  const handleProvinceChange = (e) => {
    const pId = e.target.value
    const pName = e.target.options[e.target.selectedIndex].text
    setSelectedProvince({ id: pId, name: pName })
    setSelectedCity({ id: '', name: '' })
    setSelectedDistrict({ id: '', name: '' })
    setSelectedVillage({ id: '', name: '' })
    setCities([])
    setDistricts([])
    setVillages([])

    if (pId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${pId}.json`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(() => { setCities(pId === '33' ? FALLBACK_CITIES : []); setRegionError('Daftar kota sementara menggunakan data lokal.') })
    }
  }

  const handleCityChange = (e) => {
    const cId = e.target.value
    const cName = e.target.options[e.target.selectedIndex].text
    setSelectedCity({ id: cId, name: cName })
    setSelectedDistrict({ id: '', name: '' })
    setSelectedVillage({ id: '', name: '' })
    setDistricts([])
    setVillages([])

    if (cId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cId}.json`)
        .then(res => res.json())
        .then(data => setDistricts(data))
        .catch(() => setDistricts(cId === '3374' ? FALLBACK_DISTRICTS : []))
    }
  }

  const handleDistrictChange = (e) => {
    const dId = e.target.value
    const dName = e.target.options[e.target.selectedIndex].text
    setSelectedDistrict({ id: dId, name: dName })
    setSelectedVillage({ id: '', name: '' })
    setVillages([])

    if (dId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${dId}.json`)
        .then(res => res.json())
        .then(data => setVillages(data))
        .catch(() => setVillages(dId === '3374020' ? FALLBACK_VILLAGES : []))
    }
  }

  const handleVillageChange = (e) => {
    const vId = e.target.value
    const vName = e.target.options[e.target.selectedIndex].text
    setSelectedVillage({ id: vId, name: vName })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let locationString = ''
    if (detail) locationString += `${detail}, `
    if (selectedVillage.name) locationString += `Kel. ${selectedVillage.name}, `
    if (selectedDistrict.name) locationString += `Kec. ${selectedDistrict.name}, `
    if (selectedCity.name) locationString += `${selectedCity.name}, `
    if (selectedProvince.name) locationString += `${selectedProvince.name}`
    
    // Fallback if they didn't fill anything but hit submit
    if (!locationString) locationString = currentLocation || 'Lokasi Belum Diatur'
    
    onSaveLocation(locationString.replace(/, $/, ''))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box location-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x-close" onClick={onClose} aria-label="Tutup modal">
          &times;
        </button>

        <div className="modal-header-with-icon">
          <div className="location-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div>
            <h3 className="modal-title">Atur Lokasi Anda</h3>
            <p className="modal-subtitle">Pilih wilayah Anda agar kami dapat mencocokkan dengan komunitas terdekat.</p>
          </div>
        </div>


        <div className="location-summary">
          <span className="location-summary-label">Lokasi terpilih</span>
          <strong>{selectedCity.name || currentLocation || 'Belum dipilih'}</strong>
          <small>{selectedProvince.name || 'Pilih provinsi untuk memulai'}</small>
        </div>
        {isLoadingRegions && <p className="location-status">Memuat daftar wilayah...</p>}
        {regionError && <p className="location-status is-warning">{regionError}</p>}

        <form onSubmit={handleSubmit} className="modal-form location-form">
          <div className="modal-form-group">
            <label>Provinsi</label>
            <select value={selectedProvince.id} onChange={handleProvinceChange} required>
              <option value="" disabled>Pilih Provinsi</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label>Kota / Kabupaten</label>
            <select value={selectedCity.id} onChange={handleCityChange} disabled={!selectedProvince.id} required>
              <option value="" disabled>Pilih Kota/Kabupaten</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label>Kecamatan</label>
            <select value={selectedDistrict.id} onChange={handleDistrictChange} disabled={!selectedCity.id} required>
              <option value="" disabled>Pilih Kecamatan</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label>Kelurahan</label>
            <select value={selectedVillage.id} onChange={handleVillageChange} disabled={!selectedDistrict.id} required>
              <option value="" disabled>Pilih Kelurahan</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label>Detail Alamat (Opsional)</label>
            <input 
              type="text" 
              placeholder="Nama Jalan, Gedung, No. Rumah, RT/RW" 
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          <div className="modal-buttons-row modal-space-between" style={{ marginTop: '24px' }}>
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="modal-btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
