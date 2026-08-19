import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth';
import { COMMUNITIES_DATA } from '../data/communityData';
import Footer from '../components/Footer';
import './DonationForm.css';

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UploadIcon = () => (
  <svg className="donation-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default function DonationForm() {
  const { isAuthenticated, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve selected community & needs from router state or sessionStorage
  const [contextData, setContextData] = useState(() => {
    if (location.state?.communityId) {
      return location.state;
    }
    const saved = sessionStorage.getItem('pendingDonation');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Form states
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemUnit, setItemUnit] = useState('Buah / Pcs');
  const [itemCondition, setItemCondition] = useState('Sangat Baik');
  const [deliveryMethod, setDeliveryMethod] = useState('drop-point');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. STRICT ROUTE-LEVEL AUTHENTICATION CHECK
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      // Save current state and redirect guest to login
      if (contextData) {
        sessionStorage.setItem('pendingDonation', JSON.stringify(contextData));
      }
      navigate('/login', {
        replace: true,
        state: {
          returnTo: '/donasi/form',
          pendingDonation: contextData,
        },
      });
    }
  }, [isAuthenticated, initialized, navigate, contextData]);

  // Find community object
  const community = COMMUNITIES_DATA.find((c) => c.id === contextData?.communityId) || COMMUNITIES_DATA[0];
  const selectedNeeds = contextData?.selectedNeeds || ['Pakaian Layak Pakai', 'Buku & Alat Tulis'];

  if (!initialized || !isAuthenticated) {
    return (
      <main className="donation-form-page">
        <div className="donation-form-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <p style={{ color: '#8A9FA0' }}>Memeriksa status autentikasi...</p>
        </div>
      </main>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setErrorMsg('Nama barang donasi wajib diisi.');
      return;
    }

    setIsSubmitted(true);
    // Clear pending donation storage
    sessionStorage.removeItem('pendingDonation');
  };

  return (
    <main className="donation-form-page">
      <div className="donation-form-container">
        {!isSubmitted ? (
          <>
            <header className="donation-form-header">
              <h1 className="donation-form-title">Formulir Pengajuan Donasi</h1>
              <p className="donation-form-subtitle">
                Lengkapi informasi barang yang ingin Anda donasikan untuk diverifikasi
              </p>
            </header>

            <div className="donation-form-card">
              {/* Selected Community & Needs Banner */}
              <div className="donation-context-banner">
                <img
                  src={community.logo}
                  alt={community.name}
                  className="donation-context-logo"
                  onError={(e) => {
                    e.currentTarget.src = '/sedekas.svg';
                  }}
                />
                <div className="donation-context-info">
                  <span className="donation-context-target">Tujuan Donasi</span>
                  <h3 className="donation-context-name">{community.name} &bull; {community.location}</h3>
                  <div className="donation-context-tags">
                    {selectedNeeds.map((need, idx) => (
                      <span key={idx} className="donation-context-tag">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Section 1: Informasi Barang */}
                <h3 className="form-section-title">Informasi Barang Donasi</h3>

                <div className="donation-field-group">
                  <label htmlFor="itemName" className="donation-field-label">
                    Nama Barang Donasi *
                  </label>
                  <input
                    id="itemName"
                    type="text"
                    className="donation-field-input"
                    placeholder="cth: Buku Pelajaran Matematika SMP Kelas 8"
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    required
                  />
                  {errorMsg && <span style={{ color: '#d9383a', fontSize: '12px', marginTop: '4px' }}>{errorMsg}</span>}
                </div>

                <div className="form-grid-2">
                  <div className="donation-field-group">
                    <label htmlFor="itemQuantity" className="donation-field-label">
                      Jumlah
                    </label>
                    <input
                      id="itemQuantity"
                      type="number"
                      min="1"
                      className="donation-field-input"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                    />
                  </div>

                  <div className="donation-field-group">
                    <label htmlFor="itemUnit" className="donation-field-label">
                      Satuan
                    </label>
                    <select
                      id="itemUnit"
                      className="donation-field-select"
                      value={itemUnit}
                      onChange={(e) => setItemUnit(e.target.value)}
                    >
                      <option value="Buah / Pcs">Buah / Pcs</option>
                      <option value="Buku / Jilid">Buku / Jilid</option>
                      <option value="Kg / Kilogram">Kg / Kilogram</option>
                      <option value="Paket / Dus">Paket / Dus</option>
                    </select>
                  </div>
                </div>

                <div className="donation-field-group">
                  <label htmlFor="itemCondition" className="donation-field-label">
                    Kondisi Barang
                  </label>
                  <select
                    id="itemCondition"
                    className="donation-field-select"
                    value={itemCondition}
                    onChange={(e) => setItemCondition(e.target.value)}
                  >
                    <option value="Baru">Baru (Belum Pernah Digunakan)</option>
                    <option value="Sangat Baik">Sangat Baik (Seperti Baru)</option>
                    <option value="Layak Pakai">Layak Pakai (Bersih dan Berfungsi)</option>
                  </select>
                </div>

                {/* Foto Upload */}
                <div className="donation-field-group">
                  <label className="donation-field-label">Foto Barang untuk Verifikasi</label>
                  <label htmlFor="file-upload" className="donation-upload-box">
                    <UploadIcon />
                    <p className="donation-upload-text">
                      {fileName ? `File terpilih: ${fileName}` : 'Klik untuk unggah foto barang'}
                    </p>
                    <p className="donation-upload-subtext">Format PNG, JPG atau JPEG (Maks. 5MB)</p>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Section 2: Metode Penyerahan */}
                <h3 className="form-section-title">Metode Penyerahan</h3>
                <div className="donation-radio-grid" style={{ marginBottom: '20px' }}>
                  <div
                    className={`donation-radio-card ${deliveryMethod === 'drop-point' ? 'is-selected' : ''}`}
                    onClick={() => setDeliveryMethod('drop-point')}
                  >
                    <div className="donation-radio-dot" />
                    <div>
                      <h4 className="donation-radio-title">Drop Point Komunitas</h4>
                      <p className="donation-radio-desc">Antar langsung ke alamat mitra</p>
                    </div>
                  </div>

                  <div
                    className={`donation-radio-card ${deliveryMethod === 'pickup' ? 'is-selected' : ''}`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <div className="donation-radio-dot" />
                    <div>
                      <h4 className="donation-radio-title">Penjemputan Terjadwal</h4>
                      <p className="donation-radio-desc">Kurir mitra menjemput ke alamat Anda</p>
                    </div>
                  </div>
                </div>

                {deliveryMethod === 'drop-point' ? (
                  <div className="donation-field-group">
                    <label className="donation-field-label">Lokasi Drop Point</label>
                    <input
                      type="text"
                      className="donation-field-input"
                      value={community.address}
                      disabled
                      style={{ backgroundColor: '#f6f9f8', color: '#334e50' }}
                    />
                  </div>
                ) : (
                  <div className="donation-field-group">
                    <label htmlFor="pickupAddress" className="donation-field-label">
                      Alamat Penjemputan
                    </label>
                    <input
                      id="pickupAddress"
                      type="text"
                      className="donation-field-input"
                      placeholder="Masukkan alamat lengkap penjemputan..."
                      defaultValue="Jl. Peleburan Barat No. 12, Semarang Selatan"
                    />
                  </div>
                )}

                {/* Catatan */}
                <div className="donation-field-group">
                  <label htmlFor="notes" className="donation-field-label">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    className="donation-field-textarea"
                    placeholder="Tuliskan catatan khusus atau pesan untuk penerima..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="donation-form-actions">
                  <button
                    type="button"
                    className="btn-form-cancel"
                    onClick={() => navigate(`/cari-kebutuhan/${community.id}`)}
                  >
                    Kembali
                  </button>
                  <button type="submit" className="btn-form-submit">
                    Kirim Pengajuan Donasi &rarr;
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="donation-form-card donation-success-card">
            <div className="donation-success-badge" role="img" aria-label="Sukses">
              <CheckCircleIcon />
            </div>
            <h2 className="donation-success-title">Donasi Berhasil Diajukan!</h2>
            <p className="donation-success-desc">
              Terima kasih telah berkontribusi memberikan kehidupan kedua pada barang layak pakai. Pengajuan donasi Anda sedang diproses oleh mitra {community.name}.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-form-cancel"
                onClick={() => navigate('/cari-kebutuhan')}
              >
                Cari Kebutuhan Lain
              </button>
              <button
                type="button"
                className="btn-form-submit"
                onClick={() => navigate('/donasi')}
              >
                Lihat Status di Halaman Donasi &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
