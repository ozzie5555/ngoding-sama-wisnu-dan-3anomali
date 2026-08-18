import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';
import { validateEmail } from '../validation/authValidation';
import KembaliLogo from '../../../assets/images/Group 6.svg';

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

const SuccessRosette = () => (
  <img src="/ceklist.svg" alt="Sukses" className="success-ceklist-img" />
);

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;

    // 1. Check if email/username is empty
    if (!emailOrUsername.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else {
      // If it looks like an email (contains @), check its format
      if (emailOrUsername.includes('@')) {
        const formatError = validateEmail(emailOrUsername);
        if (formatError) {
          setEmailError('Invalid email format');
          hasError = true;
        }
      }
    }

    // 2. Check if password is empty
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await authService.login(emailOrUsername, password);
      if (response.success) {
        setLoginSuccess(true);
        // Show success screen for 1.5s, then navigate
        setTimeout(() => {
          login(); // Set isAuthenticated true
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setGeneralError(err.message || 'Email atau Password salah.');
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <AuthLayout>
        <div className="success-screen">
          <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
          <SuccessRosette />
          <h2>Sign-in Berhasil!</h2>
          <p>Selamat datang di KEMBALI</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth-header">
        <img src={KembaliLogo} alt="KEMBALI" className="auth-page-logo" />
        <h1>Sign-in</h1>
        <p>Ayo bergabung dengan KEMBALI!</p>
      </div>

      <form className="auth-form" onSubmit={handleLogin}>
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
              placeholder="cth: email@contoh.com"
              value={emailOrUsername}
              onChange={(e) => {
                setEmailOrUsername(e.target.value);
                if (emailError) setEmailError('');
                if (generalError) setGeneralError('');
              }}
              disabled={loading}
            />
          </div>
          {emailError && <span className="auth-error-msg">{emailError}</span>}
        </div>

        {/* Password field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <span className="input-icon-left">
              <LockIcon />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`auth-input password-field ${passwordError || generalError ? 'input-error' : ''}`}
              placeholder=""
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (generalError) setGeneralError('');
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
          <div className="login-meta">
            {generalError ? (
              <span className="auth-error-msg">{generalError}</span>
            ) : passwordError ? (
              <span className="auth-error-msg">{passwordError}</span>
            ) : (
              <span />
            )}
            <a href="#lupa-password" className="forgot-password-link">
              Lupa Password?
            </a>
          </div>
        </div>

        {/* Sign In Button */}
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? <div className="spinner" /> : 'Sign-in'}
        </button>

        {/* Divider */}
        <div className="auth-divider">Or</div>

        {/* Google Button */}
        <button
          type="button"
          className="google-btn"
          onClick={() => {
            alert('Google authentication is not configured in mock mode.');
          }}
          disabled={loading}
        >
          <img src="/google-logo.svg" alt="" />
          Lanjutkan dengan Google
        </button>

        {/* Footer */}
        <footer className="auth-footer">
          Belum punya akun? <Link to="/sign-up">Sign-up</Link>
        </footer>
      </form>
    </AuthLayout>
  );
}
