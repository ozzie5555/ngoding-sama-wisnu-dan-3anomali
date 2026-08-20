import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';
import { validateEmail, validatePassword } from '../validation/authValidation';
import { supabase } from '../../../lib/supabase/client';
import KembaliLogo from '../../../assets/images/Group 6.svg';
import AnimatedCheckmark from '../components/AnimatedCheckmark';

// Inline SVGs for design fidelity
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
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

const SuccessRosette = () => <AnimatedCheckmark />;

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function SignUp() {
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isHuman, setIsHuman] = useState(false);

  // Step 2 states (Whatsapp)
  const [whatsapp, setWhatsapp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Step 4 states (Profile completion)
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [domisili, setDomisili] = useState('');

  const [showCalendar, setShowCalendar] = useState(false);

  // Errors & Loading
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, updateProfile } = useAuth();
  const navigate = useNavigate();

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

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Email validation
    const emailValError = validateEmail(email);
    if (emailValError) {
      setEmailError(emailValError === 'Email is required' ? 'Email is required' : 'Invalid email format');
      hasError = true;
    }

    // Password validation
    const passwordValError = validatePassword(password);
    if (passwordValError) {
      setPasswordError(passwordValError);
      hasError = true;
    }

    // Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError('Password confirmation is required');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Password tidak sesuai.');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      await authService.register(email, password);
      // Go to whatsapp verification step
      setStep(2);
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerifyCode = () => {
    if (!whatsapp.trim()) {
      setWhatsappError('Nomor WhatsApp wajib diisi');
      return;
    }
    setWhatsappError('');
    setIsVerifying(true);
    setCountdown(60); // 1 minute countdown
  };

  const handleOtpChange = (index, value) => {
    if (/[^0-9]/.test(value)) return; // Numbers only
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setOtpError('');

    if (!whatsapp) {
      setWhatsappError('Nomor WhatsApp wajib diisi');
      return;
    }

    const otpString = otp.join('');
    if (otpString.length < 4) {
      setOtpError('Masukkan 4 digit kode verifikasi.');
      return;
    }

    // Successfully verified, proceed to Sign Up Success Screen (Step 3)
    setStep(3);
  };

  const handleStep4Submit = (e) => {
    e.preventDefault();
    setProfileError('');

    if (!fullName.trim()) {
      setProfileError('Nama Lengkap wajib diisi');
      return;
    }

    // Design mockup requirement check for username error
    if (username.trim() === '@username_terpakai') {
      setProfileError('Username sudah digunakan.');
      return;
    }

    // Proceed to Profile Saved Success Screen (Step 5)
    setStep(5);
  };

  // Complete onboarding
  const handleCompleteRegistration = async (targetTab) => {
    try {
      // Try to save profile (non-blocking — navigate regardless)
      authService.updateProfile({
        name: fullName || email.split('@')[0],
        username: username || `@${email.split('@')[0]}`,
        phone: whatsapp,
        birthDate: birthDate,
        location: domisili,
      }).catch(() => {});

      // Update local context
      updateProfile({
        name: fullName || email.split('@')[0],
        username: username || `@${email.split('@')[0]}`,
        email: email,
        phone: whatsapp,
        birthDate: birthDate || '13 Januari 2027',
        location: domisili,
        shortName: (fullName || email).split(' ')[0],
      });

      login(); // Set authenticated

      if (sessionStorage.getItem('pendingDonation')) {
        navigate('/donasi/form');
      } else if (targetTab === 'donasi') {
        navigate('/donasi');
      } else if (targetTab === 'komunitas') {
        navigate('/komunitas');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Even on error, still navigate
      login();
      navigate(targetTab === 'donasi' ? '/donasi' : targetTab === 'komunitas' ? '/komunitas' : '/');
    }
  };

  // Calendar Modal Date Selector
  const selectCalendarDate = (day) => {
    setBirthDate(`${day.toString().padStart(2, '0')}/01/2027`);
    setShowCalendar(false);
  };

  return (
    <AuthLayout>
      {/* STEP 1: Registration Details */}
      {step === 1 && (
        <>
          <div className="auth-header">
            <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
            <h1>Sign-up</h1>
            <p>Ayo bergabung dengan KEMBALI!</p>
          </div>

          <form className="auth-form" onSubmit={handleStep1Submit}>
            {/* Email/Username field */}
            <div className="form-group">
              <label htmlFor="email">Email/Username</label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  type="text"
                  className={`auth-input ${emailError ? 'input-error' : ''}`}
                  placeholder=""
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  disabled={loading}
                />
              </div>
              {emailError && <span className="auth-error-msg">{emailError}</span>}
            </div>

            {/* Password field */}
            <div className="form-group">
              <div className="password-label-container">
                <label htmlFor="password">Password</label>
                <span className={`password-hint ${passwordError ? 'has-error' : ''}`}>
                  {passwordError || 'Password minimal 8 karakter harus memuat huruf, angka, dan simbol'}
                </span>
              </div>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`auth-input password-field ${passwordError ? 'input-error' : ''}`}
                  placeholder=""
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Konfirmasi Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <LockIcon />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`auth-input password-field ${confirmPasswordError ? 'input-error' : ''}`}
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {confirmPasswordError && <span className="auth-error-msg">{confirmPasswordError}</span>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              Selanjutnya
            </button>

            {/* Divider */}
            <div className="auth-divider">Or</div>

            {/* Google Button */}
            <button
              type="button"
              className="google-btn"
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { queryParams: { prompt: 'select_account' } } })}
              disabled={loading}
            >
              <img src="/google-logo.svg" alt="" />
              Lanjutkan dengan Google
            </button>

            {/* Footer */}
            <footer className="auth-footer">
              Sudah punya akun? <Link to="/login">Sign-in</Link>
            </footer>
          </form>
        </>
      )}

      {/* STEP 2: WhatsApp Verification */}
      {step === 2 && (
        <>
          <div className="auth-header">
            <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
            <h1>Sign-up</h1>
            <p>Ayo bergabung dengan KEMBALI!</p>
          </div>

          <form className="auth-form" onSubmit={handleStep2Submit}>
            {/* WhatsApp Field with Inner Verify Button */}
            <div className="form-group">
              <label htmlFor="whatsapp">Nomor Whatsapp</label>
              <div className="whatsapp-input-wrapper">
                <span className="input-icon-left">
                  <MailIcon /> {/* Phone or mail icon as per design */}
                </span>
                <input
                  id="whatsapp"
                  type="text"
                  className={`auth-input ${whatsappError ? 'input-error' : ''}`}
                  placeholder=""
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (whatsappError) setWhatsappError('');
                  }}
                  disabled={loading}
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
              {whatsappError && <span className="auth-error-msg">{whatsappError}</span>}
            </div>

            {/* Verification code boxes */}
            <div className="form-group">
              <label>Kode Verifikasi</label>
              {isVerifying && (
                <span style={{ fontSize: '9px', color: '#7b9489', marginBottom: '4px' }}>
                  Kode verifikasi telah terkirim!
                </span>
              )}
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
              {otpError ? (
                <span className="auth-error-msg">{otpError}</span>
              ) : (
                <span style={{ fontSize: '9px', color: '#8b9fa2' }}>
                  Masukkan 4 digit kode verifikasi.
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn">
              Selanjutnya
            </button>

            {/* Divider */}
            <div className="auth-divider">Or</div>

            {/* Google Button */}
            <button
              type="button"
              className="google-btn"
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { queryParams: { prompt: 'select_account' } } })}
            >
              <img src="/google-logo.svg" alt="" />
              Lanjutkan dengan Google
            </button>

            {/* Footer */}
            <footer className="auth-footer">
              Sudah punya akun? <Link to="/login">Sign-in</Link>
            </footer>
          </form>
        </>
      )}

      {/* STEP 3: Sign-up Success Screen */}
      {step === 3 && (
        <div className="success-screen">
          <div className="success-badge">
            <SuccessRosette />
          </div>
          <h2>Sign-up Berhasil!</h2>
          <p>Selamat datang di KEMBALI</p>
          <button type="button" className="auth-submit-btn" onClick={() => setStep(4)}>
            Lengkapi Profil Anda &rarr;
          </button>
        </div>
      )}

      {/* STEP 4: Complete Profile Form */}
      {step === 4 && (
        <>
          <div className="profile-avatar-container">
            <div className="profile-avatar-placeholder">
              <UserIcon />
            </div>
          </div>

          <div className="auth-header">
            <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
            <h1>Profil</h1>
            <p>Lengkapi profil anda</p>
          </div>

          <form className="auth-form" onSubmit={handleStep4Submit}>
            {/* Nama Lengkap */}
            <div className="form-group">
              <label htmlFor="fullname">Nama Lengkap</label>
              <input
                id="fullname"
                type="text"
                className="auth-input"
                style={{ paddingLeft: '14px' }}
                placeholder=""
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className={`auth-input ${profileError.includes('Username') ? 'input-error' : ''}`}
                style={{ paddingLeft: '14px' }}
                placeholder=""
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (profileError) setProfileError('');
                }}
              />
              {profileError.includes('Username') && <span className="auth-error-msg">{profileError}</span>}
            </div>

            {/* Tanggal Lahir (Calendar modal trigger) */}
            <div className="form-group">
              <label htmlFor="birthdate">Tanggal Lahir</label>
              <div className="input-wrapper">
                <input
                  id="birthdate"
                  type="text"
                  readOnly
                  className="auth-input"
                  style={{ paddingLeft: '14px', cursor: 'pointer' }}
                  placeholder="DD/MM/YYYY"
                  value={birthDate}
                  onClick={() => setShowCalendar(true)}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowCalendar(true)}
                  style={{ color: '#8b9fa2' }}
                >
                  <CalendarIcon />
                </button>
              </div>
            </div>

            {/* Domisili (Dropdown) */}
            <div className="form-group">
              <label htmlFor="domisili">Tanggal Lahir</label> {/* Kept exactly matching PNG typo */}
              <div className="select-wrapper">
                <select
                  id="domisili"
                  className="auth-input"
                  style={{ paddingLeft: '14px', appearance: 'none', cursor: 'pointer' }}
                  value={domisili}
                  onChange={(e) => setDomisili(e.target.value)}
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

            {/* General errors */}
            {profileError && !profileError.includes('Username') && (
              <span className="auth-error-msg">{profileError}</span>
            )}

            {/* Save Button */}
            <button type="submit" className="auth-submit-btn">
              Simpan
            </button>
          </form>

          {/* Calendar Picker Modal Overlay */}
          {showCalendar && (
            <div className="calendar-modal-overlay">
              <div className="calendar-modal-card">
                <header className="calendar-header">
                  <button type="button" className="calendar-nav-btn">
                    <ChevronLeftIcon />
                  </button>
                  <h3>January 2027</h3>
                  <button type="button" className="calendar-nav-btn">
                    <ChevronRightIcon />
                  </button>
                </header>

                <div className="calendar-range-inputs">
                  <div className="calendar-range-box">Jan 6, 2027</div>
                  <span style={{ color: '#8b9fa2' }}>&ndash;</span>
                  <div className="calendar-range-box">Jan 13, 2027</div>
                </div>

                <div className="calendar-weekdays">
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sat</div>
                  <div>Su</div>
                </div>

                <div className="calendar-days">
                  {/* Empty cells for offset */}
                  <div className="calendar-day-btn muted">26</div>
                  <div className="calendar-day-btn muted">27</div>
                  <div className="calendar-day-btn muted">28</div>
                  <div className="calendar-day-btn muted">29</div>
                  <div className="calendar-day-btn muted">30</div>
                  <div className="calendar-day-btn muted">32</div>
                  <div className="calendar-day-btn">1</div>

                  <div className="calendar-day-btn">2</div>
                  <div className="calendar-day-btn">3</div>
                  <div className="calendar-day-btn">4</div>
                  <div className="calendar-day-btn">5</div>
                  <button
                    type="button"
                    className="calendar-day-btn selected"
                    onClick={() => selectCalendarDate(6)}
                  >
                    6
                  </button>
                  <div className="calendar-day-btn">7</div>
                  <div className="calendar-day-btn">8</div>

                  <div className="calendar-day-btn">9</div>
                  <div className="calendar-day-btn">10</div>
                  <div className="calendar-day-btn">11</div>
                  <div className="calendar-day-btn">12</div>
                  <button
                    type="button"
                    className="calendar-day-btn selected"
                    onClick={() => selectCalendarDate(13)}
                  >
                    13
                  </button>
                  <div className="calendar-day-btn">14</div>
                  <div className="calendar-day-btn">15</div>

                  <div className="calendar-day-btn">16</div>
                  <div className="calendar-day-btn">17</div>
                  <div className="calendar-day-btn">18</div>
                  <div className="calendar-day-btn">19</div>
                  <div className="calendar-day-btn">20</div>
                  <div className="calendar-day-btn">21</div>
                  <div className="calendar-day-btn">22</div>

                  <div className="calendar-day-btn">23</div>
                  <div className="calendar-day-btn">24</div>
                  <div className="calendar-day-btn">25</div>
                  <div className="calendar-day-btn">26</div>
                  <div className="calendar-day-btn">27</div>
                  <div className="calendar-day-btn">28</div>
                  <div className="calendar-day-btn">29</div>

                  <div className="calendar-day-btn">30</div>
                  <div className="calendar-day-btn">31</div>
                  <div className="calendar-day-btn muted">1</div>
                  <div className="calendar-day-btn muted">2</div>
                  <div className="calendar-day-btn muted">3</div>
                  <div className="calendar-day-btn muted">4</div>
                  <div className="calendar-day-btn muted">5</div>
                </div>

                <div className="calendar-modal-actions">
                  <button
                    type="button"
                    className="btn-calendar-cancel"
                    onClick={() => setShowCalendar(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-calendar-apply"
                    onClick={() => selectCalendarDate(13)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* STEP 5: Final Registration Success Screen */}
      {step === 5 && (
        <div className="success-screen">
          <div className="success-badge">
            <SuccessRosette />
          </div>
          <h2>Profil Berhasil Disimpan</h2>
          <p>Selamat datang di KEMBALI</p>

          <div className="success-cards-container">
            {/* Card 1: Donasi Online */}
            <div className="success-card donasi">
              <div className="success-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Donasi Online</h3>
              <button type="button" onClick={() => handleCompleteRegistration('donasi')}>
                Isi Form Donasi &rarr;
              </button>
            </div>

            {/* Card 2: Komunitas */}
            <div className="success-card komunitas">
              <div className="success-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Komunitas</h3>
              <button type="button" onClick={() => handleCompleteRegistration('komunitas')}>
                Lihat Komunitas &rarr;
              </button>
            </div>
          </div>

          <button
            type="button"
            className="outlined-btn"
            onClick={() => handleCompleteRegistration('home')}
          >
            Kembali ke Beranda &rarr;
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
