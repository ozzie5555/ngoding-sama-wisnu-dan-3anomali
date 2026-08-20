import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/useAuth'
import { authService } from '../../features/auth/services/authService'
import {
  ChangePasswordModal,
  WhatsappModal,
  ChangeEmailModal,
} from './ProfileModal'
import './Security.css'

export default function Security() {
  const { user, updateSecurity, refreshProfile, logout } = useAuth()
  const navigate = useNavigate()

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false)
  const [securityToast, setSecurityToast] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSavePassword = async (currentPassword, newPassword) => {
    setLoading(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
      await refreshProfile()
      setSecurityToast('Kata sandi berhasil diperbarui!')
    } catch (err) {
      setSecurityToast(err.message || 'Gagal memperbarui kata sandi.')
    } finally {
      setLoading(false)
      setTimeout(() => setSecurityToast(''), 3000)
    }
  }

  const handleSaveEmail = async (newEmail, currentPassword) => {
    setLoading(true)
    try {
      await authService.changeEmail(newEmail, currentPassword)
      await refreshProfile()
      setSecurityToast('Email berhasil diperbarui!')
    } catch (err) {
      setSecurityToast(err.message || 'Gagal memperbarui email.')
    } finally {
      setLoading(false)
      setTimeout(() => setSecurityToast(''), 3000)
    }
  }

  const handleSaveWhatsapp = async (newNumber) => {
    setLoading(true)
    try {
      await authService.updateWhatsapp(newNumber)
      await refreshProfile()
      setSecurityToast('Nomor WhatsApp berhasil diperbarui!')
    } catch (err) {
      setSecurityToast(err.message || 'Gagal memperbarui nomor WhatsApp.')
    } finally {
      setLoading(false)
      setTimeout(() => setSecurityToast(''), 3000)
    }
  }

  const handleLogoutClick = async () => {
    await logout()
    navigate('/')
  }

  const handleReset = () => {
    setSecurityToast('Pengaturan keamanan telah diatur ulang.')
    setTimeout(() => setSecurityToast(''), 3000)
  }

  const handleSave = () => {
    setSecurityToast('Pengaturan keamanan berhasil disimpan!')
    setTimeout(() => setSecurityToast(''), 3000)
  }

  return (
    <div className="security-section">
      <header className="security-header">
        <h2 className="security-title">Keamanan</h2>
        <p className="security-description">
          Lindungi akun Kembali Anda dengan mengatur kata sandi, verifikasi kontak, dan aktivitas login. Pengaturan ini membantu menjaga data pribadi serta proses donasi Anda tetap aman.
        </p>
      </header>

      {securityToast && <div className="save-notification-toast">{securityToast}</div>}

      <div className="security-rows-list">
        {/* Row 1: Kata Sandi */}
        <div className="security-row-item">
          <div className="security-item-info">
            <h3 className="security-item-title">Kata Sandi</h3>
            <p className="security-item-value">
              Terakhir diperbarui: {user?.passwordLastUpdated
                ? new Date(user.passwordLastUpdated).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                : 'Belum pernah diperbarui'}
            </p>
          </div>
          <button
            type="button"
            className="btn-security-edit"
            onClick={() => setIsPasswordModalOpen(true)}
            aria-label="Ubah kata sandi"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Row 2: Email */}
        <div className="security-row-item">
          <div className="security-item-info">
            <h3 className="security-item-title">Email</h3>
            <p className="security-item-value">{user?.email || 'Belum diatur'}</p>
          </div>
          <button
            type="button"
            className="btn-security-edit"
            onClick={() => setIsEmailModalOpen(true)}
            aria-label="Ubah email"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Row 3: Nomor WhatsApp */}
        <div className="security-row-item">
          <div className="security-item-info">
            <h3 className="security-item-title">Nomor WhatsApp</h3>
            <p className="security-item-value">
              {user?.whatsapp || 'Belum diatur'}
            </p>
          </div>
          <button
            type="button"
            className="btn-security-edit"
            onClick={() => setIsWhatsappModalOpen(true)}
            aria-label="Ubah nomor WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Row 4: Keluar Dari Akun */}
        <div className="security-logout-section">
          <h3 className="security-item-title">Keluar Dari Akun</h3>
          <button
            type="button"
            className="btn-security-logout"
            onClick={handleLogoutClick}
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="security-bottom-actions">
        <button
          type="button"
          className="btn-security-reset"
          onClick={handleReset}
        >
          Atur Ulang
        </button>
        <button
          type="button"
          className="btn-security-save"
          onClick={handleSave}
        >
          Simpan
        </button>
      </div>

      {/* Security Modals */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSavePassword={handleSavePassword}
        lastUpdated={user?.passwordLastUpdated}
      />

      <ChangeEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={user?.email || ''}
        onSaveEmail={handleSaveEmail}
      />

      <WhatsappModal
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        currentWhatsapp={user?.whatsapp}
        onSaveWhatsapp={handleSaveWhatsapp}
      />
    </div>
  )
}
