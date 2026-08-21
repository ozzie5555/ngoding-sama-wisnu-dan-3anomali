import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import AuthLayout from '../components/AuthLayout';
import AnimatedCheckmark from '../components/AnimatedCheckmark';
import { authService } from '../services/authService';
import { validateEmail, validatePassword } from '../validation/authValidation';
import KembaliLogo from '../../../assets/images/Group 6.svg';

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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('form');
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationStatus !== 'success') return undefined;
    const timer = window.setTimeout(() => navigate('/complete-profile', { replace: true }), 1400);
    return () => window.clearTimeout(timer);
  }, [navigate, registrationStatus]);

  const handleGoogleSignUp = async () => {
    setGeneralError('');
    setLoading(true);
    try {
      await authService.signInWithGoogle('/sign-up');
    } catch (error) {
      setGeneralError(error.message || 'Gagal mendaftar dengan Google.');
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    let invalid = false;

    if (nextEmailError) {
      setEmailError(nextEmailError === 'Email is required' ? 'Email wajib diisi.' : 'Format email tidak valid.');
      invalid = true;
    }
    if (nextPasswordError) {
      setPasswordError(nextPasswordError);
      invalid = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Konfirmasi password wajib diisi.');
      invalid = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Password tidak sesuai.');
      invalid = true;
    }
    if (invalid) return;

    setLoading(true);
    try {
      const result = await authService.register(email.trim(), password);
      setRegistrationStatus(result.needsConfirmation ? 'confirm-email' : 'success');
    } catch (error) {
      setEmailError(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (registrationStatus === 'success') {
    return (
      <AuthLayout>
        <div className="success-screen" role="status" aria-live="polite">
          <AnimatedCheckmark />
          <h2>Sign-up Berhasil!</h2>
          <p>Menyiapkan profil Anda...</p>
        </div>
      </AuthLayout>
    );
  }

  if (registrationStatus === 'confirm-email') {
    return (
      <AuthLayout>
        <div className="success-screen" role="status" aria-live="polite">
          <AnimatedCheckmark />
          <h2>Periksa Email Anda</h2>
          <p>Klik tautan konfirmasi yang telah dikirim, lalu masuk untuk melengkapi profil.</p>
          <Link className="auth-submit-btn" to="/login">Kembali ke Sign-in</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth-header">
        <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
        <h1>Sign-up</h1>
        <p>Ayo bergabung dengan KEMBALI!</p>
        {generalError && <span className="auth-error-msg">{generalError}</span>}
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <span className="input-icon-left"><MailIcon /></span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`auth-input ${emailError ? 'input-error' : ''}`}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError('');
              }}
              disabled={loading}
            />
          </div>
          {emailError && <span className="auth-error-msg">{emailError}</span>}
        </div>

        <div className="form-group">
          <div className="password-label-container">
            <label htmlFor="password">Password</label>
            <span className={`password-hint ${passwordError ? 'has-error' : ''}`}>
              {passwordError || 'Password minimal 8 karakter harus memuat huruf, angka, dan simbol'}
            </span>
          </div>
          <div className="input-wrapper">
            <span className="input-icon-left"><LockIcon /></span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`auth-input password-field ${passwordError ? 'input-error' : ''}`}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (passwordError) setPasswordError('');
              }}
              disabled={loading}
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              disabled={loading}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Konfirmasi Password</label>
          <div className="input-wrapper">
            <span className="input-icon-left"><LockIcon /></span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`auth-input password-field ${confirmPasswordError ? 'input-error' : ''}`}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              disabled={loading}
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {confirmPasswordError && <span className="auth-error-msg">{confirmPasswordError}</span>}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Mendaftarkan...' : 'Daftar'}
        </button>

        <div className="auth-divider">Atau</div>
        <button type="button" className="google-btn" onClick={handleGoogleSignUp} disabled={loading}>
          <img src="/google-logo.svg" alt="" />
          Lanjutkan dengan Google
        </button>

        <footer className="auth-footer">
          Sudah punya akun? <Link to="/login">Sign-in</Link>
        </footer>
      </form>
    </AuthLayout>
  );
}
