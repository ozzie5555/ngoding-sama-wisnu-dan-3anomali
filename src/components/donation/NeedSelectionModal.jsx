import { useState } from 'react';
import './DonationModal.css';

/**
 * NeedSelectionModal - Modal to select donation categories for a community
 * @param {object} community - Selected community data
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Close handler
 * @param {function} onContinue - Handler when user clicks "Lanjutkan ke Form Donasi" with selected needs
 */
export default function NeedSelectionModal({ community, isOpen, onClose, onContinue, initialSelectedNeeds = [] }) {
  const [selectedNeeds, setSelectedNeeds] = useState(initialSelectedNeeds);

  if (!isOpen || !community) return null;

  const toggleNeed = (needTitle) => {
    setSelectedNeeds((prev) =>
      prev.includes(needTitle)
        ? prev.filter((item) => item !== needTitle)
        : [...prev, needTitle]
    );
  };

  const handleContinue = () => {
    if (selectedNeeds.length === 0) return;
    onContinue(selectedNeeds);
  };

  return (
    <div className="donation-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="donation-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="donation-modal-header">
          <img
            src={community.logo}
            alt={community.name}
            className="donation-modal-logo"
            onError={(e) => {
              e.currentTarget.src = '/sedekas.svg';
            }}
          />
          <h2 className="donation-modal-title">
            {community.modalTitle || 'Pilih Kebutuhan Donasi'}
          </h2>
          <p className="donation-modal-subtitle">
            {community.modalSubtitle || `${community.name} · ${community.location}`}
          </p>
          <p className="donation-modal-helper">
            {community.modalHelper ||
              'Pilih jenis donasi yang ingin Anda berikan. Pastikan barang dalam kondisi baik, bersih, dan layak digunakan.'}
          </p>
        </div>

        {/* Needs Checklist */}
        <div className="donation-needs-list" role="group" aria-label="Daftar Kategori Kebutuhan">
          {community.selectableNeeds?.map((need) => {
            const isSelected = selectedNeeds.includes(need.title);
            return (
              <div
                key={need.id || need.title}
                className={`donation-need-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => toggleNeed(need.title)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleNeed(need.title);
                  }
                }}
              >
                <div className="donation-need-checkbox" aria-hidden="true">
                  {isSelected && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="donation-need-info">
                  <h3 className="donation-need-title">{need.title}</h3>
                  <p className="donation-need-desc">{need.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="donation-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-modal-continue"
            disabled={selectedNeeds.length === 0}
            onClick={handleContinue}
          >
            Lanjutkan ke Form Donasi &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
