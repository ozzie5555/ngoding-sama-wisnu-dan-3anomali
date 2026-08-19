import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import AuthLayout from '../components/AuthLayout';
import LoadingDots from '../components/LoadingDots';
import { authService } from '../services/authService';
import { validateEmail, validatePassword, validatePhone, validateOtp } from '../validation/authValidation';
import { supabase } from '../../../lib/supabase/client';
import KembaliLogo from '../../../assets/images/Group 6.svg';

// Custom SVG Icons matching exact visual identity
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SuccessCheckmark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * ResetPassword Component
 * Manages all states of the Reset Password flow:
 * - 'email' : Initial email form (Screen 1)
 * - 'email-sent' : Waiting for email confirmation with countdown (Screen 2)
 * - 'whatsapp' : WhatsApp phone input (Screen 6)
 * - 'otp' : WhatsApp 4-digit OTP verification (Screen 7)
 * - 'reset-confirmed' : Intermediate success state (Screen 3)
 * - 'new-password' : Create new password form (Screen 4)
 * - 'success' : Final password saved state (Screen 5)
 */
export default function ResetPassword() {
  const [step, setStep] = useState('email');
  const navigate = useNavigate();
  const location = useLocation();

  // Form Fields
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & Loading States
  const [emailError, setEmailError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Countdown Timers (in seconds)
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [whatsappCountdown, setWhatsappCountdown] = useState(0);

  // Check for Supabase Password Recovery session on mount
  useEffect(() => {
    const handleRecovery = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const code = searchParams.get('code');

      // PKCE flow: exchange authorization code for session
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          setStep('new-password');
        }
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Legacy implicit flow: check hash fragment
      if (
        searchParams.get('type') === 'recovery' ||
        hash.includes('type=recovery')
      ) {
        setStep('new-password');
      }
    };

    handleRecovery();

    // Subscribe to Supabase auth state change for PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStep('new-password');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Email Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (emailCountdown > 0) {
      timer = setInterval(() => {
        setEmailCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emailCountdown]);

  // WhatsApp Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (whatsappCountdown > 0) {
      timer = setInterval(() => {
        setWhatsappCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [whatsappCountdown]);

  // Auto redirect on success
  useEffect(() => {
    if (step === 'success') {
      const redirectTimer = setTimeout(() => {
        navigate('/login');
      }, 2500);
      return () => clearTimeout(redirectTimer);
    }
  }, [step, navigate]);

  // Auto transition for intermediate Screen 3 (Reset Password Berhasil)
  useEffect(() => {
    if (step === 'reset-confirmed') {
      const transitionTimer = setTimeout(() => {
        setStep('new-password');
      }, 1400);
      return () => clearTimeout(transitionTimer);
    }
  }, [step]);

  // Format seconds into MM:SS (e.g., 179 -> 02:59)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // HANDLERS: EMAIL FLOW
  // ==========================================
  const handleRequestEmailReset = async (e) => {
    if (e) e.preventDefault();
    setEmailError('');

    const valErr = validateEmail(email);
    if (valErr) {
      setEmailError(valErr === 'Email is required' ? 'Email wajib diisi' : 'Format email tidak valid');
      return;
    }

    setLoading(true);
    try {
      await authService.requestEmailReset(email.trim());
      setEmailCountdown(179); // 02:59
      setStep('email-sent');
    } catch (err) {
      setEmailError(err.message || 'Gagal mengirim email reset password.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: WHATSAPP FLOW
  // ==========================================
  const handleRequestWhatsappOtp = async (e) => {
    if (e) e.preventDefault();
    setWhatsappError('');

    const valErr = validatePhone(whatsapp);
    if (valErr) {
      setWhatsappError(valErr);
      return;
    }

    setLoading(true);
    try {
      await authService.requestWhatsappOtp(whatsapp.trim());
      setWhatsappCountdown(179); // 02:59
      setStep('otp');
    } catch (err) {
      setWhatsappError(err.message || 'Gagal mengirim kode verifikasi WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (otpError) setOtpError('');

    // Auto-focus next input field
    if (value !== '' && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpRefs[3].current?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    const valErr = validateOtp(otp);
    if (valErr) {
      setOtpError(valErr);
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(whatsapp, otp.join(''));
      setStep('reset-confirmed');
    } catch (err) {
      setOtpError(err.message || 'Kode verifikasi tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: NEW PASSWORD CREATION
  // ==========================================
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    // Validate new password rules
    const passErr = validatePassword(newPassword);
    if (passErr) {
      setPasswordError(passErr);
      hasError = true;
    }

    // Validate confirmation
    if (!confirmPassword) {
      setConfirmPasswordError('Konfirmasi password wajib diisi.');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Password tidak sesuai.');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      await authService.updateUserPassword(newPassword);
      setStep('success');
    } catch (err) {
      setPasswordError(err.message || 'Gagal menyimpan password baru.');
    } finally {
      setLoading(false);
    }
  };

  // Validation checks for button enabled/disabled states
  const isOtpComplete = otp.every((digit) => digit !== '');
  const isPasswordValid = validatePassword(newPassword) === null;
  const isPasswordMatching = newPassword && confirmPassword && newPassword === confirmPassword;
  const canSubmitNewPassword = isPasswordValid && isPasswordMatching;

  return (
    <AuthLayout>
      <div className="reset-auth-container">
        {/* Logo always centered above header */}
        <img src={KembaliLogo} alt="KEMBALI" className="reset-page-logo" />

        {/* ===================================================================
            SCREEN 1: EMAIL RESET (Initial)
            =================================================================== */}
        {step === 'email' && (
          <>
            <header className="reset-header">
              <h1 className="reset-heading">Reset Password</h1>
              <p className="reset-subtitle">
                Reset menggunakan Email/Nomor Seluler{'\n'}Anda
              </p>
            </header>

            <form className="reset-form" onSubmit={handleRequestEmailReset}>
              <div className="reset-form-group">
                <label htmlFor="reset-email" className="reset-label">
                  Masukkan Email
                </label>
                <div className={`reset-input-action-wrapper ${emailError ? 'has-error' : ''}`}>
                  <span className="reset-input-icon-left">
                    <MailIcon />
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    className="reset-field-input"
                    placeholder="wisnubrsm3anomali@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    disabled={loading}
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className="btn-reset-verify-action"
                    disabled={loading || !email.trim()}
                    aria-label="Verifikasi Email"
                  >
                    {loading ? <LoadingDots size="mini" color="#FFFFFF" /> : 'Verifikasi'}
                  </button>
                </div>
                {emailError && <span className="reset-hint-text has-error">{emailError}</span>}
              </div>

              {/* Disabled Waiting Button */}
              <button type="button" className="btn-reset-disabled" disabled>
                Menunggu Konfirmasi
              </button>

              {/* OR Divider */}
              <div className="reset-divider">Or</div>

              {/* Alternative WhatsApp Button */}
              <button
                type="button"
                className="btn-reset-secondary"
                onClick={() => {
                  setEmailError('');
                  setStep('whatsapp');
                }}
              >
                Gunakan Nomor Whatsapp
              </button>
            </form>
          </>
        )}

        {/* ===================================================================
            SCREEN 2: EMAIL RESET SENT (Waiting for Confirmation / Timer)
            =================================================================== */}
        {step === 'email-sent' && (
          <>
            <header className="reset-header">
              <h1 className="reset-heading">Reset Password</h1>
              <p className="reset-subtitle">
                Reset menggunakan Email/Nomor Seluler{'\n'}Anda
              </p>
            </header>

            <div className="reset-form">
              <div className="reset-form-group">
                <label className="reset-label">Masukkan Email</label>
                <div className="reset-input-action-wrapper">
                  <span className="reset-input-icon-left">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    className="reset-field-input"
                    value={email}
                    disabled
                  />
                  <span className="reset-timer-pill">
                    {formatTime(emailCountdown)}
                  </span>
                </div>
              </div>

              {/* Information Notice */}
              <p className="reset-info-text">
                Link reset password telah dikirimkan ke Email anda. Mohon
                buka Email anda dan lakukan konfirmasi kemudian kembali
                lagi ke halaman ini.
              </p>

              {/* Waiting For Confirmation Button */}
              <button type="button" className="btn-reset-disabled" disabled>
                Menunggu Konfirmasi
              </button>

              {/* Development Mode Simulation Tool */}
              {import.meta.env.DEV && (
                <div className="dev-action-notice">
                  <p>Mode Development: Simulasikan klik link reset dari email</p>
                  <button
                    type="button"
                    className="btn-dev-action"
                    onClick={() => setStep('reset-confirmed')}
                  >
                    Simulasikan Link Dikonfirmasi &rarr;
                  </button>
                </div>
              )}

              {/* OR Divider */}
              <div className="reset-divider">Or</div>

              {/* Alternative WhatsApp Button */}
              <button
                type="button"
                className="btn-reset-secondary"
                onClick={() => {
                  setStep('whatsapp');
                }}
              >
                Gunakan Nomor Whatsapp
              </button>
            </div>
          </>
        )}

        {/* ===================================================================
            SCREEN 6: WHATSAPP RESET (Initial)
            =================================================================== */}
        {step === 'whatsapp' && (
          <>
            <header className="reset-header">
              <h1 className="reset-heading">Reset Password</h1>
              <p className="reset-subtitle">
                Reset menggunakan Email/Nomor Seluler{'\n'}Anda
              </p>
            </header>

            <form className="reset-form" onSubmit={handleRequestWhatsappOtp}>
              {/* WhatsApp Number Field */}
              <div className="reset-form-group">
                <label htmlFor="reset-whatsapp" className="reset-label">
                  Nomor Whatsapp
                </label>
                <div className={`reset-input-action-wrapper ${whatsappError ? 'has-error' : ''}`}>
                  <span className="reset-input-icon-left">
                    <PhoneIcon />
                  </span>
                  <input
                    id="reset-whatsapp"
                    type="tel"
                    className="reset-field-input"
                    placeholder="+62 812-XXXX-XXXX"
                    value={whatsapp}
                    onChange={(e) => {
                      setWhatsapp(e.target.value);
                      if (whatsappError) setWhatsappError('');
                    }}
                    disabled={loading}
                    autoComplete="tel"
                  />
                  <button
                    type="submit"
                    className="btn-reset-verify-action"
                    disabled={loading || !whatsapp.trim()}
                    aria-label="Verifikasi Nomor WhatsApp"
                  >
                    {loading ? <LoadingDots size="mini" color="#FFFFFF" /> : 'Verifikasi'}
                  </button>
                </div>
                {whatsappError && <span className="reset-hint-text has-error">{whatsappError}</span>}
              </div>

              {/* Verification Code Box Placeholder (Disabled) */}
              <div className="reset-form-group">
                <label className="reset-label">Kode Verifikasi</label>
                <span className="reset-hint-text">*Masukkan 4 digit kode verifikasi.</span>
                <div className="reset-otp-grid">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="reset-otp-box"
                      disabled
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              {/* Disabled Confirm Button */}
              <button type="button" className="btn-reset-disabled" disabled>
                Konfirmasi
              </button>

              {/* OR Divider */}
              <div className="reset-divider">Or</div>

              {/* Switch Back to Email Button */}
              <button
                type="button"
                className="btn-reset-secondary"
                onClick={() => {
                  setWhatsappError('');
                  setStep('email');
                }}
              >
                Gunakan Email
              </button>
            </form>
          </>
        )}

        {/* ===================================================================
            SCREEN 7: WHATSAPP OTP VERIFICATION (Active)
            =================================================================== */}
        {step === 'otp' && (
          <>
            <header className="reset-header">
              <h1 className="reset-heading">Reset Password</h1>
              <p className="reset-subtitle">
                Reset menggunakan Email/Nomor Seluler{'\n'}Anda
              </p>
            </header>

            <form className="reset-form" onSubmit={handleVerifyOtp}>
              {/* WhatsApp Field with Running Countdown Pill */}
              <div className="reset-form-group">
                <label className="reset-label">Nomor Whatsapp</label>
                <div className="reset-input-action-wrapper">
                  <span className="reset-input-icon-left">
                    <PhoneIcon />
                  </span>
                  <input
                    type="tel"
                    className="reset-field-input"
                    value={whatsapp}
                    disabled
                  />
                  <span className="reset-timer-pill">
                    {formatTime(whatsappCountdown)}
                  </span>
                </div>
                <span className="reset-hint-text success-text" style={{ marginTop: '4px' }}>
                  *Kode verifikasi telah terkirim!
                </span>
              </div>

              {/* 4-digit OTP Inputs */}
              <div className="reset-form-group">
                <label className="reset-label">Kode Verifikasi</label>
                <span className="reset-hint-text">*Masukkan 4 digit kode verifikasi.</span>
                <div className="reset-otp-grid" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className={`reset-otp-box ${otpError ? 'has-error' : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      disabled={loading}
                      aria-label={`Digit OTP ke-${idx + 1}`}
                    />
                  ))}
                </div>
                {otpError && <span className="reset-hint-text has-error">{otpError}</span>}
              </div>

              {/* Active / Disabled Confirm Button */}
              <button
                type="submit"
                className="btn-reset-primary"
                disabled={loading || !isOtpComplete}
              >
                {loading ? <LoadingDots size="mini" color="#FFFFFF" /> : 'Konfirmasi'}
              </button>

              {/* OR Divider */}
              <div className="reset-divider">Or</div>

              {/* Switch Back to Email Button */}
              <button
                type="button"
                className="btn-reset-secondary"
                onClick={() => {
                  setOtp(['', '', '', '']);
                  setOtpError('');
                  setStep('email');
                }}
              >
                Gunakan Email
              </button>
            </form>
          </>
        )}

        {/* ===================================================================
            SCREEN 3: RESET PASSWORD BERHASIL (Intermediate)
            =================================================================== */}
        {step === 'reset-confirmed' && (
          <div className="reset-confirmed-screen">
            <header className="reset-header">
              <h1 className="reset-heading" style={{ marginBottom: '12px' }}>
                Reset Password Berhasil
              </h1>
              <p className="reset-subtitle">
                Lakukan Pembuatan Ulang Password
              </p>
            </header>
            <div style={{ marginTop: '24px' }}>
              <LoadingDots size="normal" color="#3FBEC7" />
            </div>
          </div>
        )}

        {/* ===================================================================
            SCREEN 4: BUAT ULANG PASSWORD (Create New Password)
            =================================================================== */}
        {step === 'new-password' && (
          <>
            <header className="reset-header">
              <h1 className="reset-heading">Buat Ulang Password</h1>
              <p className="reset-subtitle">
                Reset menggunakan Email/Nomor Seluler{'\n'}Anda
              </p>
            </header>

            <form className="reset-form" onSubmit={handleSavePassword}>
              {/* New Password Field */}
              <div className="reset-form-group">
                <label htmlFor="new-password" className="reset-label">
                  Password Baru
                </label>
                <span className={`reset-hint-text ${passwordError ? 'has-error' : ''}`}>
                  {passwordError || '*Password minimal 8 karakter harus memuat huruf, angka, dan simbol'}
                </span>
                <div className={`reset-password-wrapper ${passwordError ? 'has-error' : ''}`}>
                  <span className="reset-input-icon-left">
                    <LockIcon />
                  </span>
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    className="reset-field-input"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn-reset-eye-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div className="reset-form-group">
                <label htmlFor="confirm-new-password" className="reset-label">
                  Konfirmasi Password Baru
                </label>
                <div className={`reset-password-wrapper ${confirmPasswordError ? 'has-error' : ''}`}>
                  <span className="reset-input-icon-left">
                    <LockIcon />
                  </span>
                  <input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="reset-field-input"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn-reset-eye-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <span className="reset-hint-text has-error">{confirmPasswordError}</span>
                )}
              </div>

              {/* Save Password Button (Height 62px) */}
              <button
                type="submit"
                className="btn-reset-primary save-password-btn"
                disabled={loading || !canSubmitNewPassword}
                style={{ marginTop: '8px' }}
              >
                {loading ? <LoadingDots size="mini" color="#FFFFFF" /> : 'Simpan Password'}
              </button>
            </form>
          </>
        )}

        {/* ===================================================================
            SCREEN 5: PASSWORD BARU BERHASIL DISIMPAN (Success)
            =================================================================== */}
        {step === 'success' && (
          <div className="reset-success-screen">
            <div className="reset-success-badge-circle" role="img" aria-label="Sukses">
              <SuccessCheckmark />
            </div>
            <h1 className="reset-success-heading">
              Password Baru Berhasil{'\n'}Disimpan
            </h1>
            <p className="reset-success-subtitle">
              Selamat datang di Kembali!
            </p>
            <button
              type="button"
              className="btn-reset-primary"
              style={{ marginTop: '32px', maxWidth: '320px' }}
              onClick={() => navigate('/login')}
            >
              Kembali ke Sign-in &rarr;
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
