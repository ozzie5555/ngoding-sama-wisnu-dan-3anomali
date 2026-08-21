import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth';
import { communityService, FALLBACK_COMMUNITIES } from '../../features/community/services/communityService';
import AuthGateModal from './AuthGateModal';
import './CariKebutuhanModal.css';

// SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      width: '16px',
      height: '16px',
      transition: 'transform 0.2s ease',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/**
 * CariKebutuhanModal - Premium centered modal for donation discovery
 * Steps: 'search' -> 'detail' -> 'selection'
 */
export default function CariKebutuhanModal({ isOpen, onClose, initialCommunityId = null, initialStep = 'search' }) {
  const [modalStep, setModalStep] = useState(initialStep);
  const [selectedCommunityId, setSelectedCommunityId] = useState(initialCommunityId);
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);
  const [pendingContext, setPendingContext] = useState(null);
  const [communities, setCommunities] = useState(FALLBACK_COMMUNITIES);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const regionDropdownRef = useRef(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;
    let active = true;
    communityService.getCommunities()
      .then((rows) => {
        if (active && rows.length) setCommunities(rows);
      })
      .catch((error) => {
        console.error('[CariKebutuhan] Failed to load communities:', error);
        if (active) setDataError('Data terbaru belum dapat dimuat. Menampilkan data cadangan.');
      })
      .finally(() => active && setDataLoading(false));
    return () => { active = false; };
  }, [isOpen]);

  // Sync initial props
  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      if (initialCommunityId) {
        setSelectedCommunityId(initialCommunityId);
        setModalStep(initialStep || 'detail');
      } else {
        setModalStep('search');
      }
    }, 0);
    return () => window.clearTimeout(syncTimer);
  }, [initialCommunityId, initialStep, isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close region dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
    }
    if (isRegionOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRegionOpen]);

  // Active community data
  const community = useMemo(() => {
    if (!selectedCommunityId) return null;
    return communities.find((c) => c.id === selectedCommunityId) || communities[0];
  }, [selectedCommunityId, communities]);

  const regions = useMemo(() => [
    'Semua Wilayah',
    ...new Set(communities.map((item) => item.location).filter(Boolean)),
  ], [communities]);

  // Filtered communities list
  const filteredCommunities = useMemo(() => {
    return communities.filter((item) => {
      if (selectedRegion !== 'Semua Wilayah') {
        const matchesRegion =
          item.location.toLowerCase().includes(selectedRegion.toLowerCase()) ||
          (item.fullLocation && item.fullLocation.toLowerCase().includes(selectedRegion.toLowerCase()));
        if (!matchesRegion) return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(term);
        const inCat = item.category.toLowerCase().includes(term);
        const inLocation = item.location.toLowerCase().includes(term);
        const inSummary = item.categoriesSummary?.toLowerCase().includes(term);
        const inNeeds = item.currentNeeds?.some((n) => n.toLowerCase().includes(term));
        const inSelectable = item.selectableNeeds?.some(
          (s) => s.title.toLowerCase().includes(term) || s.description.toLowerCase().includes(term)
        );

        return inName || inCat || inLocation || inSummary || inNeeds || inSelectable;
      }

      return true;
    });
  }, [searchTerm, selectedRegion, communities]);

  if (!isOpen) return null;

  // Handlers
  const handleOpenDetail = (id) => {
    setSelectedCommunityId(id);
    setModalStep('detail');
  };

  const handleOpenSelection = () => {
    setSelectedNeeds([]);
    setModalStep('selection');
  };

  const toggleNeed = (needTitle) => {
    setSelectedNeeds((prev) =>
      prev.includes(needTitle)
        ? prev.filter((item) => item !== needTitle)
        : [...prev, needTitle]
    );
  };

  const handleContinueToForm = () => {
    if (selectedNeeds.length === 0 || !community) return;

    const context = {
      communityId: community.id,
      communityName: community.name,
      selectedNeeds,
      selectedNeedRecords: community.selectableNeeds.filter((need) => selectedNeeds.includes(need.title)),
      community: {
        id: community.id,
        databaseId: community.databaseId,
        name: community.name,
        location: community.location,
        address: community.address,
        logo: community.logo,
      },
    };

    if (isAuthenticated) {
      onClose();
      navigate('/donasi/form', { state: context });
    } else {
      setPendingContext(context);
      setIsAuthGateOpen(true);
    }
  };

  return (
    <>
      <div className="cari-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="cari-modal-window" onClick={(e) => e.stopPropagation()}>
          {/* Top Bar Header */}
          <header className="cari-modal-topbar">
            {modalStep === 'search' ? (
              <div className="cari-modal-header-text">
                <h2 className="cari-modal-heading">Cari Kebutuhan</h2>
                <p className="cari-modal-subheading">
                  Temukan komunitas dan kebutuhan donasi yang ingin kamu bantu.
                </p>
              </div>
            ) : modalStep === 'detail' ? (
              <button
                type="button"
                className="btn-cari-modal-back"
                onClick={() => setModalStep('search')}
              >
                <ArrowLeftIcon />
                Kembali ke Daftar
              </button>
            ) : (
              <button
                type="button"
                className="btn-cari-modal-back"
                onClick={() => setModalStep('detail')}
              >
                <ArrowLeftIcon />
                Kembali ke Detail
              </button>
            )}

            <button
              type="button"
              className="btn-cari-modal-close"
              onClick={onClose}
              aria-label="Tutup modal"
            >
              &times;
            </button>
          </header>

          {/* Modal Body */}
          <div className="cari-modal-body">
            {/* ===============================================================
                STEP 1: SEARCH & 3-COLUMN CARDS GRID
                =============================================================== */}
            {modalStep === 'search' && (
              <>
                {/* Search Bar Row */}
                <div className="cari-modal-search-row">
                  {/* Keyword Input */}
                  <div className="cari-modal-search-input-wrap">
                    <span className="cari-modal-search-icon">
                      <SearchIcon />
                    </span>
                    <input
                      type="text"
                      className="cari-modal-search-input"
                      placeholder="Cari nama komunitas atau jenis kebutuhan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Region Filter Dropdown */}
                  <div className="cari-modal-region-wrap" ref={regionDropdownRef}>
                    <button
                      type="button"
                      className={`cari-modal-region-btn ${isRegionOpen ? 'is-active' : ''}`}
                      onClick={() => setIsRegionOpen((prev) => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={isRegionOpen}
                    >
                      <span>{selectedRegion}</span>
                      <ChevronDownIcon isOpen={isRegionOpen} />
                    </button>

                    {isRegionOpen && (
                      <div className="cari-modal-region-panel" role="listbox">
                        {regions.map((region) => (
                          <button
                            key={region}
                            type="button"
                            className={`cari-modal-region-option ${selectedRegion === region ? 'is-selected' : ''}`}
                            onClick={() => {
                              setSelectedRegion(region);
                              setIsRegionOpen(false);
                            }}
                          >
                            <span>{region}</span>
                            {selectedRegion === region && <CheckIcon />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Header */}
                <div className="cari-modal-results-header">
                  <h3 className="cari-modal-results-title">Komunitas yang Membutuhkan</h3>
                  <span className="cari-modal-results-count">
                    {filteredCommunities.length} komunitas ditemukan
                  </span>
                </div>

                {dataLoading && <div className="cari-data-status" role="status">Memuat kebutuhan terbaru...</div>}
                {dataError && <div className="cari-data-status is-warning" role="alert">{dataError}</div>}

                {/* 3-Column Cards Grid */}
                {filteredCommunities.length > 0 ? (
                  <div className="cari-modal-cards-grid">
                    {filteredCommunities.map((item) => (
                      <div key={item.id} className="cari-community-card">
                        <div>
                          {/* Logo container */}
                          <div className="cari-card-logo-container">
                            <img
                              src={item.logo}
                              alt={item.name}
                              className="cari-card-logo-img"
                              onError={(e) => {
                                e.currentTarget.src = '/sedekas.svg';
                              }}
                            />
                          </div>

                          {/* Info */}
                          <h4 className="cari-card-name">{item.name}</h4>
                          <p className="cari-card-location">{item.location} &bull; {item.category}</p>

                          {/* Chips */}
                          <div className="cari-card-chips">
                            {item.chips?.map((chip, idx) => (
                              <span key={idx} className="cari-card-chip">
                                {chip}
                              </span>
                            ))}
                          </div>

                          <p className="cari-card-desc">{item.description}</p>
                        </div>

                        {/* CTA */}
                        <button
                          type="button"
                          className="btn-cari-card-cta"
                          onClick={() => handleOpenDetail(item.id)}
                        >
                          Lihat Kebutuhan &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#8A9FA0' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#191919', marginBottom: '4px' }}>
                      Tidak ada komunitas ditemukan.
                    </p>
                    <p style={{ fontSize: '13.5px' }}>Coba ubah kata kunci atau filter wilayah.</p>
                  </div>
                )}
              </>
            )}

            {/* ===============================================================
                STEP 2: COMMUNITY DETAIL STATE
                =============================================================== */}
            {modalStep === 'detail' && community && (
              <div className="cari-detail-view">
                {/* Hero */}
                <div className="cari-detail-hero">
                  <div className="cari-detail-hero-logo">
                    <img
                      src={community.logo}
                      alt={community.name}
                      onError={(e) => {
                        e.currentTarget.src = '/sedekas.svg';
                      }}
                    />
                  </div>
                  <div className="cari-detail-hero-info">
                    <h3 className="cari-detail-name">{community.headerName || community.name}</h3>
                    <p className="cari-detail-meta">
                      {community.fullLocation || community.location} &bull; {community.category}
                    </p>
                    <p className="cari-detail-desc">{community.description}</p>
                  </div>
                </div>

                {/* 2-Column Grid */}
                <div className="cari-detail-grid">
                  {/* Left: Kebutuhan Saat Ini */}
                  <div className="cari-detail-col">
                    <h3>Kebutuhan Saat Ini</h3>
                    <ul className="cari-detail-needs-list">
                      {community.currentNeeds?.map((need, idx) => (
                        <li key={idx} className="cari-detail-need-item">
                          <span className="cari-detail-check">
                            <CheckIcon />
                          </span>
                          <span>{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vertical Divider */}
                  <div className="cari-detail-col-divider" />

                  {/* Right: Ketentuan Donasi */}
                  <div className="cari-detail-col">
                    <h3>Ketentuan Donasi</h3>
                    <ol className="cari-detail-rules-list">
                      {community.donationRules?.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="cari-detail-bottom-cta">
                  <button
                    type="button"
                    className="btn-cari-detail-action"
                    onClick={handleOpenSelection}
                  >
                    Pilih Kebutuhan & Lanjutkan &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* ===============================================================
                STEP 3: DONATION NEED SELECTION STATE
                =============================================================== */}
            {modalStep === 'selection' && community && (
              <div className="cari-selection-view">
                {/* Header */}
                <div className="cari-selection-header">
                  <div className="cari-selection-logo">
                    <img
                      src={community.logo}
                      alt={community.name}
                      onError={(e) => {
                        e.currentTarget.src = '/sedekas.svg';
                      }}
                    />
                  </div>
                  <h3 className="cari-selection-title">
                    {community.modalTitle || 'Pilih Kebutuhan Donasi'}
                  </h3>
                  <p className="cari-selection-sub">
                    {community.name} &bull; {community.location}
                  </p>
                  <p className="cari-selection-helper">
                    Pilih jenis kebutuhan yang ingin Anda bantu. Kamu dapat memilih lebih dari satu.
                  </p>
                </div>

                {/* Selection Cards Grid */}
                <div className="cari-selection-grid">
                  {community.selectableNeeds?.map((need) => {
                    const isSelected = selectedNeeds.includes(need.title);
                    return (
                      <div
                        key={need.id || need.title}
                        className={`cari-selection-card ${isSelected ? 'is-selected' : ''}`}
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
                        <div className="cari-selection-checkbox">
                          {isSelected && <CheckIcon />}
                        </div>
                        <div className="cari-selection-info">
                          <h4>{need.title}</h4>
                          <p>{need.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar for Selection Step */}
          {modalStep === 'selection' && (
            <footer className="cari-modal-actionbar">
              <span className="cari-modal-actionbar-summary">
                {selectedNeeds.length} kebutuhan dipilih
              </span>
              <div className="cari-modal-actionbar-btns">
                <button
                  type="button"
                  className="btn-cari-cancel"
                  onClick={() => setModalStep('detail')}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn-cari-continue"
                  disabled={selectedNeeds.length === 0}
                  onClick={handleContinueToForm}
                >
                  Lanjutkan ke Form Donasi &rarr;
                </button>
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Auth Gate Modal for Guests */}
      <AuthGateModal
        isOpen={isAuthGateOpen}
        onClose={() => setIsAuthGateOpen(false)}
        pendingContext={pendingContext}
      />
    </>
  );
}
