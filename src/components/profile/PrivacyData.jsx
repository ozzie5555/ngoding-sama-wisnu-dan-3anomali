import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { DeleteAccountModal } from './ProfileModal'
import './PrivacyData.css'

export default function PrivacyData() {
  const { user, updatePrivacy, deleteAccount } = useAuth()

  const [privacyState, setPrivacyState] = useState(() => ({
    contributionVisibility: user?.privacy?.contributionVisibility ?? true,
    generalLocation: user?.privacy?.generalLocation ?? false,
    impactReport: user?.privacy?.impactReport ?? true,
    donationHistory: user?.privacy?.donationHistory ?? true,
  }))

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [saveToast, setSaveToast] = useState('')

  const handleToggle = (key) => {
    setPrivacyState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleReset = () => {
    if (user?.privacy) {
      setPrivacyState({
        contributionVisibility: user.privacy.contributionVisibility ?? true,
        generalLocation: user.privacy.generalLocation ?? false,
        impactReport: user.privacy.impactReport ?? true,
        donationHistory: user.privacy.donationHistory ?? true,
      })
    }
    setSaveToast('Pengaturan privasi telah diatur ulang.')
    setTimeout(() => setSaveToast(''), 3000)
  }

  const handleSave = () => {
    Object.keys(privacyState).forEach((k) => {
      updatePrivacy(k, privacyState[k])
    })
    setSaveToast('Pengaturan privasi berhasil diperbarui!')
    setTimeout(() => setSaveToast(''), 3000)
  }

  const handleConfirmDeleteAccount = () => {
    deleteAccount()
  }

  return (
    <div className="privacy-data-section">
      <header className="privacy-data-header">
        <h2 className="privacy-data-title">Privasi & Data</h2>
        <p className="privacy-data-description">
          Kami menjaga data pribadi Anda agar tetap aman dan hanya digunakan untuk mendukung proses donasi, penyaluran barang, serta peningkatan layanan Kembali. Anda dapat mengatur informasi yang ingin ditampilkan, mengelola persetujuan penggunaan data, dan meminta salinan atau penghapusan data akun kapan saja.
        </p>
      </header>

      {saveToast && <div className="save-notification-toast">{saveToast}</div>}

      <div className="privacy-settings-list">
        {/* Item 1: Visibilitas kontribusi */}
        <div className="privacy-item-row">
          <div className="privacy-item-info">
            <h3 className="privacy-item-title">Visibilitas kontribusi</h3>
            <p className="privacy-item-desc">
              Izinkan jumlah barang yang telah didonasikan dan donasi tersalurkan tampil pada profil Anda.
            </p>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${privacyState.contributionVisibility ? 'is-on' : ''}`}
            onClick={() => handleToggle('contributionVisibility')}
            role="switch"
            aria-checked={privacyState.contributionVisibility}
            aria-label="Toggle Visibilitas kontribusi"
          >
            <span className="toggle-switch-thumb" />
          </button>
        </div>

        {/* Item 2: Lokasi umum */}
        <div className="privacy-item-row">
          <div className="privacy-item-info">
            <h3 className="privacy-item-title">Lokasi umum</h3>
            <p className="privacy-item-desc">
              Tampilkan kota atau wilayah umum pada profil, misalnya Semarang, Jawa Tengah. Alamat lengkap tidak akan ditampilkan.
            </p>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${privacyState.generalLocation ? 'is-on' : ''}`}
            onClick={() => handleToggle('generalLocation')}
            role="switch"
            aria-checked={privacyState.generalLocation}
            aria-label="Toggle Lokasi umum"
          >
            <span className="toggle-switch-thumb" />
          </button>
        </div>

        {/* Item 3: Laporan dampak */}
        <div className="privacy-item-row">
          <div className="privacy-item-info">
            <h3 className="privacy-item-title">Laporan dampak</h3>
            <p className="privacy-item-desc">
              Izinkan data donasi Anda dihitung secara anonim dalam statistik dampak Kembali, seperti jumlah barang tersalurkan dan barang yang berhasil digunakan kembali.
            </p>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${privacyState.impactReport ? 'is-on' : ''}`}
            onClick={() => handleToggle('impactReport')}
            role="switch"
            aria-checked={privacyState.impactReport}
            aria-label="Toggle Laporan dampak"
          >
            <span className="toggle-switch-thumb" />
          </button>
        </div>

        {/* Item 4: Riwayat donasi */}
        <div className="privacy-item-row">
          <div className="privacy-item-info">
            <h3 className="privacy-item-title">Riwayat donasi</h3>
            <p className="privacy-item-desc">
              Simpan riwayat donasi pada akun agar Anda dapat melacak status dan dampak dari barang yang telah disalurkan.
            </p>
          </div>
          <button
            type="button"
            className={`toggle-switch-btn ${privacyState.donationHistory ? 'is-on' : ''}`}
            onClick={() => handleToggle('donationHistory')}
            role="switch"
            aria-checked={privacyState.donationHistory}
            aria-label="Toggle Riwayat donasi"
          >
            <span className="toggle-switch-thumb" />
          </button>
        </div>

        {/* Item 5: Hapus akun */}
        <div className="privacy-item-row privacy-delete-row">
          <div className="privacy-item-info">
            <h3 className="privacy-item-title">Hapus akun</h3>
            <p className="privacy-item-desc">
              Hapus akun dan data pribadi Anda dari Kembali secara permanen. Riwayat transaksi tertentu dapat disimpan secara terbatas untuk kebutuhan operasional dan pelaporan.
            </p>
          </div>
          <button
            type="button"
            className="btn-delete-account"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Hapus Akun
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="privacy-bottom-actions">
        <button
          type="button"
          className="btn-privacy-reset"
          onClick={handleReset}
        >
          Atur Ulang
        </button>
        <button
          type="button"
          className="btn-privacy-save"
          onClick={handleSave}
        >
          Simpan
        </button>
      </div>

      {/* Delete Account Modal Confirmation */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDeleteAccount}
      />
    </div>
  )
}
