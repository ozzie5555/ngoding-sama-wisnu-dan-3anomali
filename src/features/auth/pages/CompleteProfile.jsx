import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';
import { supabase } from '../../../lib/supabase/client';
import KembaliLogo from '../../../assets/images/Group 6.svg';
import { LocationPickerModal } from '../../../components/profile/ProfileModal';
import AnimatedCheckmark from '../components/AnimatedCheckmark';

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function CompleteProfile() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Step 1: Phone verification
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [demoPopup, setDemoPopup] = useState({ open: false, status: 'loading' });
  const [autoFillingOtp, setAutoFillingOtp] = useState(false);

  // Step 2: Profile completion
  const [fullName, setFullName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [birthDate, setBirthDate] = useState('');
  const [location, setLocation] = useState('');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // WhatsApp timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1 handlers
  const handleSendVerifyCode = async () => {
    if (!phone.trim()) {
      setPhoneError('Nomor WhatsApp wajib diisi');
      return;
    }
    setPhoneError('');
    setDemoPopup({ open: true, status: 'loading' });
    setAutoFillingOtp(true);
    setOtp(['', '', '', '']);

    try {
      const result = await authService.requestWhatsappOtp(phone);
      setIsVerifying(true);
      setCountdown(60);

      const demoCode = result.demoCode;
      if (demoCode) {
        for (let index = 0; index < demoCode.length; index += 1) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          setOtp((previous) => {
            const next = [...previous];
            next[index] = demoCode[index];
            return next;
          });
        }
      }

      setAutoFillingOtp(false);
      setDemoPopup({ open: true, status: 'ready' });
    } catch (err) {
      setAutoFillingOtp(false);
      setDemoPopup({ open: false, status: 'loading' });
      setPhoneError(err.message || 'Gagal membuat kode verifikasi');
    }
  };

  const handleOtpChange = (index, value) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (otpError) setOtpError('');

    if (value !== '' && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    const otpString = otp.join('');
    if (otpString.length < 4) {
      setOtpError('Masukkan 4 digit kode verifikasi.');
      return;
    }

    try {
      await authService.verifyOtp(phone, otpString);
      setStep(2);
    } catch (err) {
      setOtpError(err.message || 'Kode verifikasi tidak valid.');
    }
  };

  // Step 2 handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Nama lengkap wajib diisi');
      return;
    }

    const normalizedUsername = username.trim().replace(/^@+/, '');
    if (normalizedUsername && !/^[a-zA-Z0-9._]{3,30}$/.test(normalizedUsername)) {
      setError('Username harus 3–30 karakter dan hanya boleh memakai huruf, angka, titik, atau garis bawah.');
      return;
    }

    const savedUsername = `@${normalizedUsername || fullName.trim().split(' ')[0].toLowerCase()}`;

    setLoading(true);
    try {
      await authService.updateProfile({
        name: fullName.trim(),
        username: savedUsername,
        email: user?.email || '',
        phone: phone,
        birthDate: birthDate,
        location: location,
      });

      // Best-effort: update metadata (not critical, ignore failure)
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: fullName.trim(),
            username: savedUsername,
          }
        });
      } catch (metaErr) {
        console.warn('[CompleteProfile] metadata update failed (non-critical):', metaErr.message);
      }

      await refreshProfile();
      setProfileSaved(true);
      await new Promise((resolve) => window.setTimeout(resolve, 1400));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

  if (profileSaved) {
    return (
      <AuthLayout>
        <div className="success-screen">
          <AnimatedCheckmark />
          <h2>Profil Berhasil Disimpan!</h2>
          <p>Selamat datang di KEMBALI</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* STEP 1: Phone Verification */}
      {step === 1 && (
        <>
          <div className="auth-header">
            <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
            <h1>Verifikasi Nomor</h1>
            <p>Verifikasi nomor telepon untuk melanjutkan</p>
          </div>

          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label htmlFor="whatsapp">Nomor Whatsapp</label>
              <div className="whatsapp-input-wrapper">
                <span className="input-icon-left">
                  <PhoneIcon />
                </span>
                <input
                  id="whatsapp"
                  type="text"
                  className={`auth-input ${phoneError ? 'input-error' : ''}`}
                  placeholder="cth: +62 812-XXXX-XXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  className="btn-whatsapp-verify"
                  onClick={handleSendVerifyCode}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? formatTime(countdown) : 'Verifikasi'}
                </button>
              </div>
              {phoneError && <span className="auth-error-msg">{phoneError}</span>}
            </div>

            {isVerifying && (
              <div className="form-group">
                <label>Kode Verifikasi</label>
                <span style={{ fontSize: '9px', color: '#7b9489', marginBottom: '4px' }}>
                  Kode demo telah disiapkan otomatis.
                </span>
                <div className="otp-container">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      className={`otp-input ${digit ? 'otp-input-filled' : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '9px', color: '#8b9fa2' }}>
                  Masukkan 4 digit kode verifikasi.
                </span>
                {otpError && <span className="auth-error-msg">{otpError}</span>}
              </div>
            )}

            {isVerifying && (
              <button type="submit" className="auth-submit-btn" disabled={autoFillingOtp}>
                {autoFillingOtp ? 'Menyiapkan kode...' : 'Selanjutnya'}
              </button>
            )}
          </form>

          {demoPopup.open && (
            <div className="demo-otp-overlay" role="dialog" aria-modal="true" aria-label="Mode demo OTP">
              <div className="demo-otp-modal">
                <div className={`demo-otp-icon ${demoPopup.status === 'ready' ? 'is-ready' : ''}`}>
                  {demoPopup.status === 'ready' ? '✓' : <span className="demo-otp-spinner" />}
                </div>
                <span className="demo-otp-badge">MODE DEMO</span>
                <h2>{demoPopup.status === 'ready' ? 'Kode Demo Siap' : 'Menyiapkan Kode'}</h2>
                <p>
                  {demoPopup.status === 'ready'
                    ? 'Kode verifikasi sudah diisi otomatis. Tidak ada SMS yang dikirim.'
                    : 'Menyiapkan simulasi verifikasi untuk presentasi...'}
                </p>
                {demoPopup.status === 'ready' && (
                  <button type="button" className="demo-otp-close" onClick={() => setDemoPopup({ open: false, status: 'loading' })}>
                    Lanjutkan
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* STEP 2: Complete Profile */}
      {step === 2 && (
        <>
          <div className="auth-header">
            <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
            <h1>Lengkapi Profil</h1>
            <p>Isi data diri Anda untuk melanjutkan</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <span className="auth-error-msg">{error}</span>}

            <div className="form-group">
              <label htmlFor="fullname">Nama Lengkap</label>
              <input
                id="fullname"
                type="text"
                className="auth-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="auth-input"
                style={{ paddingLeft: '14px' }}
                placeholder="cth: @username_anda"
                value={username}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '').replace(/^@+/, '');
                  setUsername(value ? `@${value}` : '');
                }}
                autoComplete="username"
                aria-describedby="complete-profile-username-hint"
              />
              <span id="complete-profile-username-hint" className="location-field-hint">
                Ditampilkan dengan @. Saat masuk, tanda @ boleh dipakai atau tidak.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="birthdate">Tanggal Lahir</label>
              <input
                id="birthdate"
                type="date"
                className="auth-input"
                style={{ paddingLeft: '14px' }}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Domisili</label>
              <button
                type="button"
                id="location"
                className={`location-picker-trigger ${location ? 'has-value' : ''}`}
                onClick={() => setIsLocationPickerOpen(true)}
              >
                <span className="location-picker-pin" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span className="location-picker-copy">
                  <strong>{location || 'Pilih domisili Anda'}</strong>
                  <small>{location ? 'Lokasi siap disimpan' : 'Provinsi, kota, kecamatan, dan kelurahan'}</small>
                </span>
                <ChevronDownIcon />
              </button>
              <span className="location-field-hint">Digunakan untuk mencocokkan Anda dengan komunitas terdekat.</span>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
            </button>
          </form>

          <LocationPickerModal
            isOpen={isLocationPickerOpen}
            onClose={() => setIsLocationPickerOpen(false)}
            currentLocation={location}
            onSaveLocation={setLocation}
          />
        </>
      )}
    </AuthLayout>
  );
}
