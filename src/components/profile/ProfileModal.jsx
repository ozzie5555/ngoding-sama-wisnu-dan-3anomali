import { useState } from 'react'
import './ProfileModal.css'

// ==========================================================
// 1. DATE PICKER MODAL / POPOVER (Figma Page 5)
// ==========================================================
export function DatePickerModal({ isOpen, onClose, onSelectDate }) {
  const [currentYear, setCurrentYear] = useState(2027)
  const [currentMonth, setCurrentMonth] = useState(0) // 0 = January
  const [selectedDay, setSelectedDay] = useState(6)
  const endDay = 13

  if (!isOpen) return null

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleApply = () => {
    const formatted = `${String(selectedDay).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`
    onSelectDate(formatted)
    onClose()
  }

  // Calendar dates matrix for Jan 2027 matching Figma layout
  const prevMonthDates = [26, 27, 28, 29, 30, 31]
  const currentMonthDates = Array.from({ length: 31 }, (_, i) => i + 1)
  const nextMonthDates = [1, 2, 3, 4, 5]

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box datepicker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Month Navigation */}
        <div className="dp-header">
          <button type="button" className="dp-nav-btn" onClick={handlePrevMonth} aria-label="Bulan sebelumnya">
            ‹
          </button>
          <span className="dp-month-title">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button type="button" className="dp-nav-btn" onClick={handleNextMonth} aria-label="Bulan selanjutnya">
            ›
          </button>
        </div>

        {/* Selected Range Display */}
        <div className="dp-range-display">
          <div className="dp-range-pill">{monthNames[currentMonth].slice(0, 3)} {selectedDay}, {currentYear}</div>
          <span className="dp-range-sep">-</span>
          <div className="dp-range-pill">{monthNames[currentMonth].slice(0, 3)} {endDay}, {currentYear}</div>
        </div>

        {/* Days Header */}
        <div className="dp-days-header">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sat</span>
          <span>Su</span>
        </div>

        {/* Calendar Grid */}
        <div className="dp-grid">
          {prevMonthDates.map((day, idx) => (
            <button key={`prev-${idx}`} type="button" className="dp-day-btn is-other-month">
              {day}
            </button>
          ))}
          {currentMonthDates.map((day) => {
            const isSelectedStart = day === selectedDay
            const isSelectedEnd = day === endDay
            const inRange = day > selectedDay && day < endDay
            return (
              <button
                key={`curr-${day}`}
                type="button"
                className={`dp-day-btn ${isSelectedStart || isSelectedEnd ? 'is-selected' : ''} ${inRange ? 'is-in-range' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            )
          })}
          {nextMonthDates.map((day, idx) => (
            <button key={`next-${idx}`} type="button" className="dp-day-btn is-other-month">
              {day}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="dp-actions">
          <button type="button" className="modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="modal-btn-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

// ==========================================================
// 2. DELETE ACCOUNT MODAL (Figma Page 5)
// ==========================================================
export function DeleteAccountModal({ isOpen, onClose, onConfirmDelete }) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  if (!isOpen) return null

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box delete-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x-close" onClick={onClose} aria-label="Tutup modal">
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
            <h3 className="modal-title">Hapus Akun</h3>
            <p className="modal-desc">
              Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="delete-modal-footer">
          <label className="modal-checkbox-label">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>Jangan tampilkan lagi</span>
          </label>

          <div className="modal-buttons-row">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button
              type="button"
              className="modal-btn-danger"
              onClick={() => {
                onConfirmDelete(dontShowAgain)
                onClose()
              }}
            >
              Hapus
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
    onSavePassword(newPassword)
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
            <h3 className="modal-title">Ubah Kata sandi</h3>
            <p className="modal-subtitle">Terakhir diperbarui: {lastUpdated || '12 Agustus 2026'}</p>
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

  if (!isOpen) return null

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (password.length > 0) {
      setStep(2)
    }
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    if (newEmail) {
      onSaveEmail(newEmail)
      onClose()
      setStep(1)
    }
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box security-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x-close" onClick={onClose} aria-label="Tutup modal">
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
                <button type="button" className="modal-btn-cancel" onClick={onClose}>
                  Batal
                </button>
                <button type="submit" className="modal-btn-primary">
                  Simpan
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
              <div className="modal-form-group">
                <label>Masukkan Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="modal-buttons-row modal-space-between">
                <button type="button" className="modal-btn-cancel" onClick={() => setStep(1)}>
                  Batal
                </button>
                <button type="submit" className="modal-btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
