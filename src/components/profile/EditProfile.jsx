import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../context/useAuth'
import { DatePickerModal, LocationPickerModal } from './ProfileModal'
import { authService } from '../../features/auth/services/authService'
import './EditProfile.css'

export default function EditProfile() {
  const { user, updateProfile, refreshProfile } = useAuth()

  // Force refresh profile from DB on mount
  useEffect(() => {
    refreshProfile()
  }, [])

  // Local form state initialized from user context
  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    avatarPosition: user?.avatarPosition || '50% 50%',
  }))

  // Sync form when user data loads from DB (once per user ID)
  const [syncedUserId, setSyncedUserId] = useState(null)
  useEffect(() => {
    if (!user?.id || user.id === syncedUserId) return
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      birthDate: user.birthDate || '',
      location: user.location || '',
      avatar: user.avatar || '',
      avatarPosition: user.avatarPosition || '50% 50%',
    })
    setSyncedUserId(user.id)
  }, [user, syncedUserId])

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Avatar positioning
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarPosition, setAvatarPosition] = useState({ x: 50, y: 50 })
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const positionContainerRef = useRef(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleReset = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        location: user.location || '',
        avatar: user.avatar || '',
      })
    }
    setSaveMessage('Form telah diatur ulang ke data tersimpan.')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await authService.updateProfile({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        location: formData.location,
      })
      updateProfile(formData)
      setSaveMessage('Profil berhasil disimpan!')
    } catch (err) {
      setSaveMessage('Gagal menyimpan: ' + err.message)
    }
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setSaveMessage('File harus berupa gambar.')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setSaveMessage('Ukuran gambar maksimal 2MB.')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    setSelectedFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarPosition({ x: 50, y: 50 })
    setShowPositionModal(true)
    e.target.value = ''
  }

  const handlePositionMouseDown = (e) => {
    isDragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }

  const handlePositionMouseMove = useCallback((e) => {
    if (!isDragging.current || !positionContainerRef.current) return
    const rect = positionContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setAvatarPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }, [])

  const handlePositionMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  useEffect(() => {
    if (showPositionModal) {
      window.addEventListener('mousemove', handlePositionMouseMove)
      window.addEventListener('mouseup', handlePositionMouseUp)
      return () => {
        window.removeEventListener('mousemove', handlePositionMouseMove)
        window.removeEventListener('mouseup', handlePositionMouseUp)
      }
    }
  }, [showPositionModal, handlePositionMouseMove, handlePositionMouseUp])

  const handleSaveAvatarPosition = async () => {
    if (!selectedFile) {
      console.error('[Avatar] No file selected')
      return
    }
    try {
      setSaveMessage('Mengunggah foto...')
      console.log('[Avatar] Uploading:', selectedFile.name, selectedFile.size)
      const result = await authService.uploadAvatar(selectedFile)
      console.log('[Avatar] Upload success, URL:', result.url)
      const positionStr = `${avatarPosition.x}% ${avatarPosition.y}%`

      // Update local form state directly
      setFormData((prev) => ({
        ...prev,
        avatar: result.url,
        avatarPosition: positionStr,
      }))
      setShowPositionModal(false)
      setAvatarPreview(null)
      setSelectedFile(null)
      setSaveMessage('Foto profil berhasil diperbarui!')
    } catch (err) {
      console.error('[Avatar] Upload failed:', err)
      setSaveMessage('Gagal mengunggah: ' + err.message)
    }
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleCancelPosition = () => {
    setShowPositionModal(false)
    setAvatarPreview(null)
    setSelectedFile(null)
  }

  const handleAvatarRemove = () => {
    handleChange('avatar', '')
  }

  return (
    <div className="edit-profile-section">
      <header className="edit-profile-header">
        <h2 className="edit-profile-title">Edit Profile</h2>
        <p className="edit-profile-subtitle">Kelola informasi pribadi dan foto profil Anda.</p>
      </header>

      {saveMessage && <div className="save-notification-toast">{saveMessage}</div>}

      <form onSubmit={handleSave} className="edit-profile-form">
        {/* Photo Section */}
        <div className="photo-upload-section">
          <span className="photo-label">Foto</span>
          <div className="photo-controls-row">
            <div className="edit-avatar-wrap">
              <img
                src={formData.avatar || '/src/assets/images/profile-placeholder.svg'}
                alt={formData.name}
                className="edit-avatar-img"
                style={{ objectPosition: formData.avatarPosition || '50% 50%' }}
                onError={(e) => {
                  e.target.src = '/src/assets/images/profile-placeholder.svg'
                }}
              />
            </div>
            <div className="photo-buttons">
              <label className="btn-avatar-change" htmlFor="avatar-upload">
                Ubah
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn-avatar-delete"
                onClick={handleAvatarRemove}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Grid Form */}
        <div className="form-fields-grid">
          {/* Column 1 */}
          <div className="form-column">
            <div className="input-group">
              <label htmlFor="input-name">Nama Lengkap</label>
              <input
                id="input-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Wisnu Megananda"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="input-email">Email</label>
              <input
                id="input-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="wisnubrsm3anomali@gmail.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="input-birthdate">Tanggal Lahir</label>
              <div
                className="input-with-icon-wrapper"
                onClick={() => setIsDatePickerOpen(true)}
              >
                <input
                  id="input-birthdate"
                  type="text"
                  value={formData.birthDate}
                  placeholder="DD/MM/YYYY"
                  readOnly
                  style={{ cursor: 'pointer' }}
                />
                <button
                  type="button"
                  className="input-trailing-btn"
                  aria-label="Pilih tanggal lahir"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="form-column">
            <div className="input-group">
              <label htmlFor="input-username">Username</label>
              <input
                id="input-username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="@wisnu_bersama_3_anomali"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="input-phone">Nomor Telepon</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ padding: '10px 12px', background: '#f6f9f8', color: 'var(--color-navy)', borderRight: '1px solid var(--color-border)', fontWeight: 500, fontSize: '13px' }}>+62</span>
                <input
                  id="input-phone"
                  type="tel"
                  value={(formData.phone || '').replace(/^\+62\s*/, '')}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    handleChange('phone', raw ? '+62 ' + raw : '')
                  }}
                  onFocus={(e) => {
                    if (!formData.phone || formData.phone === '+62 ') {
                      e.target.select()
                    }
                  }}
                  placeholder="812-3456-7890"
                  style={{ border: 'none', borderRadius: '0', flex: 1, padding: '10px 12px', fontSize: '13px', outline: 'none', color: 'var(--color-text-main)', fontFamily: 'var(--font-sora)' }}
                />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>Nomor telepon dimulai dengan digit (contoh: 812-3456-7890)</span>
            </div>

            <div className="input-group">
              <label htmlFor="input-location">Lokasi</label>
              <div 
                className="input-with-icon-wrapper"
                onClick={() => setIsLocationPickerOpen(true)}
              >
                <input
                  id="input-location"
                  type="text"
                  value={formData.location}
                  placeholder="Atur Lokasi (Provinsi, Kota, dll)"
                  readOnly
                  style={{ cursor: 'pointer' }}
                />
                <button
                  type="button"
                  className="input-trailing-btn"
                  aria-label="Pilih lokasi"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="form-bottom-actions">
          <button
            type="button"
            className="btn-form-reset"
            onClick={handleReset}
          >
            Atur Ulang
          </button>
          <button
            type="submit"
            className="btn-form-save"
          >
            Simpan
          </button>
        </div>
      </form>

      {/* Date Picker Popup Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelectDate={(dateStr) => handleChange('birthDate', dateStr)}
      />

      {/* Location Picker Popup Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={formData.location}
        onSaveLocation={(locStr) => handleChange('location', locStr)}
      />

      {/* Avatar Positioning Modal */}
      {showPositionModal && (
        <div className="avatar-position-overlay">
          <div className="avatar-position-card">
            <div className="avatar-position-card-header">
              <h3>Posisikan Foto</h3>
              <button type="button" className="avatar-position-close" onClick={handleCancelPosition}>
                &times;
              </button>
            </div>

            <div
              className="avatar-position-stage"
              ref={positionContainerRef}
              onMouseDown={handlePositionMouseDown}
            >
              <img
                src={avatarPreview}
                alt=""
                draggable={false}
                className="avatar-position-bg"
                style={{ objectPosition: `${avatarPosition.x}% ${avatarPosition.y}%` }}
              />
              <div className="avatar-position-circle">
                <img
                  src={avatarPreview}
                  alt="Preview"
                  draggable={false}
                  style={{ objectPosition: `${avatarPosition.x}% ${avatarPosition.y}%` }}
                />
              </div>
              <div className="avatar-position-ring" />
            </div>

            <p className="avatar-position-hint">Geser untuk memposisikan foto</p>

            <div className="avatar-position-actions">
              <button type="button" className="btn-position-cancel" onClick={handleCancelPosition}>Batal</button>
              <button type="button" className="btn-position-save" onClick={handleSaveAvatarPosition}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
