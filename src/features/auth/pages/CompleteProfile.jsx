import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';
import { supabase } from '../../../lib/supabase/client';
import KembaliLogo from '../../../assets/images/Group 6.svg';

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
  const { user, updateProfile, refreshProfile } = useAuth();
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

  // Step 2: Profile completion
  const [fullName, setFullName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [birthDate, setBirthDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    try {
      await authService.requestWhatsappOtp(phone);
      setIsVerifying(true);
      setCountdown(60);
    } catch (err) {
      setPhoneError(err.message || 'Gagal mengirim kode verifikasi');
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

    setLoading(true);
    try {
      await authService.updateProfile({
        name: fullName.trim(),
        username: username.trim() || `@${fullName.trim().split(' ')[0].toLowerCase()}`,
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
            username: username.trim() || `@${fullName.trim().split(' ')[0].toLowerCase()}`,
          }
        });
      } catch (metaErr) {
        console.warn('[CompleteProfile] metadata update failed (non-critical):', metaErr.message);
      }

      await refreshProfile();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

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
                  Kode verifikasi telah terkirim!
                </span>
                <div className="otp-container">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      className="otp-input"
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
              <button type="submit" className="auth-submit-btn">
                Selanjutnya
              </button>
            )}
          </form>
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
                onChange={(e) => setUsername(e.target.value)}
              />
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
              <div className="select-wrapper">
                <select
                  id="location"
                  className="auth-input"
                  style={{ paddingLeft: '14px', appearance: 'none', cursor: 'pointer' }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="" disabled hidden>Pilih Domisili</option>
                  <option value="Kota Semarang, Jawa Tengah">Kota Semarang, Jawa Tengah</option>
                  <option value="Kota Surabaya, Jawa Timur">Kota Surabaya, Jawa Timur</option>
                  <option value="Jakarta Selatan, DKI Jakarta">Jakarta Selatan, DKI Jakarta</option>
                  <option value="Kota Bandung, Jawa Barat">Kota Bandung, Jawa Barat</option>
                </select>
                <span className="select-chevron">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}