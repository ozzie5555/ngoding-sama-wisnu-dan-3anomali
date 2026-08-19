import { useNavigate } from 'react-router';
import './DonationModal.css';

/**
 * AuthGateModal - Intercepts guest users before entering donation form
 * @param {boolean} isOpen - Visibility
 * @param {function} onClose - Close handler
 * @param {object} pendingContext - { communityId, selectedNeeds }
 */
export default function AuthGateModal({ isOpen, onClose, pendingContext }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    // Save pending donation context to sessionStorage for restoration
    if (pendingContext) {
      sessionStorage.setItem('pendingDonation', JSON.stringify(pendingContext));
    }
    navigate('/login', {
      state: {
        returnTo: '/donasi/form',
        pendingDonation: pendingContext,
      },
    });
  };

  const handleGoToSignUp = () => {
    if (pendingContext) {
      sessionStorage.setItem('pendingDonation', JSON.stringify(pendingContext));
    }
    navigate('/sign-up', {
      state: {
        returnTo: '/donasi/form',
        pendingDonation: pendingContext,
      },
    });
  };

  return (
    <div className="donation-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="donation-modal-card auth-gate-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-gate-icon-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="auth-gate-title">Masuk untuk Melanjutkan</h2>
        <p className="auth-gate-desc">
          Untuk mengisi form donasi dan melanjutkan proses donasi, silakan masuk atau daftar terlebih dahulu. Pilihan kebutuhan Anda akan tetap tersimpan.
        </p>

        <div className="auth-gate-actions">
          <button type="button" className="btn-gate-primary" onClick={handleGoToLogin}>
            Masuk
          </button>
          <button type="button" className="btn-gate-secondary" onClick={handleGoToSignUp}>
            Daftar
          </button>
          <button type="button" className="btn-gate-back" onClick={onClose}>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
