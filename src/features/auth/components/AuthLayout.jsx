import { Link } from 'react-router';
import '../pages/Auth.css';

export default function AuthLayout({ children }) {
  return (
    <main className="auth-page-wrapper">
      <div className="auth-split-container">
        {/* Left Form Panel */}
        <div className="auth-left-panel">
          <div className="auth-left-content">
            {children}
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="auth-right-panel">
          <nav className="auth-right-nav">
            <Link to="/">Beranda</Link>
            <Link to="/donasi">Donasi</Link>
            <a href="#insight">Insight</a>
            <Link to="/donasi#verified">Komunitas</Link>
          </nav>
          <div className="auth-right-illustration-container">
            <img src="/HEROSECTION_1_VECTOR.svg" alt="KEMBALI Illustration" className="auth-right-illustration" />
          </div>
          <div className="auth-right-footer-spacer" />
        </div>
      </div>
    </main>
  );
}

