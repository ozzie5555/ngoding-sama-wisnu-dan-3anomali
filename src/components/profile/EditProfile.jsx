import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { DatePickerModal } from './ProfileModal'
import './EditProfile.css'

export default function EditProfile() {
  const { user, updateProfile } = useAuth()

  // Local form state initialized from user context
  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
  }))

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

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

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setSaveMessage('Profil berhasil disimpan!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleAvatarChange = () => {
    const newPath = prompt(
      'Masukkan path gambar avatar baru (contoh: /src/assets/images/profile-placeholder.svg):',
      formData.avatar
    )
    if (newPath) {
      handleChange('avatar', newPath)
    }
  }

  const handleAvatarRemove = () => {
    handleChange('avatar', '/src/assets/images/profile-placeholder.svg')
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
                onError={(e) => {
                  e.target.src = '/src/assets/images/profile-placeholder.svg'
                }}
              />
            </div>
            <div className="photo-buttons">
              <button
                type="button"
                className="btn-avatar-change"
                onClick={handleAvatarChange}
              >
                Ubah
              </button>
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
              <input
                id="input-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="contoh: +62 812-XXXX-XXXX"
              />
            </div>

            <div className="input-group">
              <label htmlFor="input-location">Lokasi</label>
              <div className="input-with-icon-wrapper">
                <input
                  id="input-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Kota Semarang, Jawa Tengah"
                />
                <div className="input-trailing-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
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
    </div>
  )
}
