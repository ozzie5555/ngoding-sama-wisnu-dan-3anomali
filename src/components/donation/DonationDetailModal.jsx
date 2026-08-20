import React, { useState, useEffect } from 'react'
import DonationTracker from './DonationTracker'
import { donationService } from '../../features/donation/services/donationService'
import './DonationDetailModal.css'

export default function DonationDetailModal({
  isOpen,
  onClose,
  donation,
  onReviewSubmitted,
}) {
  const [reviewMessage, setReviewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedReview, setSubmittedReview] = useState(false)
  const [activeTab, setActiveTab] = useState('tracking') // 'tracking' | 'review'

  useEffect(() => {
    if (donation) {
      setSubmittedReview(Boolean(donation.reviewSubmitted))
      setReviewMessage(donation.reviewText || '')
      // Default to review tab if completed, or tracking tab if in-progress
      if (donation.status === 'completed') {
        setActiveTab('review')
      } else {
        setActiveTab('tracking')
      }
    }
  }, [donation])

  if (!isOpen || !donation) return null

  const isCompleted = donation.status === 'completed' || donation.status === 'received'

  const handleSendReview = async (e) => {
    e.preventDefault()
    if (!reviewMessage.trim()) return

    setIsSubmitting(true)
    try {
      await donationService.createTestimonial({
        donationId: donation.id,
        rating: 5,
        title: 'Ulasan Donasi',
        content: reviewMessage.trim(),
      })
      setSubmittedReview(true)
      if (onReviewSubmitted) onReviewSubmitted(donation.id, reviewMessage)
    } catch (error) {
      alert(error.message || 'Ulasan gagal dikirim. Coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="donation-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="donation-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="donation-modal-close-btn"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          &times;
        </button>

        <div className="donation-modal-grid">
          {/* LEFT COLUMN: Donation Media & Summary */}
          <div className="modal-left-summary">
            <div className="modal-media-box">
              <img
                src={donation.image || '/buku-pelajarn.svg'}
                alt={donation.title}
                className="modal-item-image"
                onError={(e) => {
                  e.target.src = '/buku-pelajarn.svg'
                }}
              />
            </div>

            <div className="modal-item-meta">
              <h3 className="modal-item-title">{donation.title}</h3>
              <p className="modal-item-community">
                {donation.destinationFull || donation.destination}
              </p>
              <p className="modal-item-description">
                {donation.description || `${donation.quantity || 1} barang layak pakai. Diajukan pada ${donation.date}`}
              </p>

              {donation.tags && (
                <div className="modal-item-tags">
                  {donation.tags.map((tag, idx) => (
                    <span key={idx} className="modal-tag-chip">{tag}</span>
                  ))}
                </div>
              )}

              <div className="modal-detail-list">
                <div className="modal-detail-row">
                  <span className="detail-key">Kategori</span>
                  <span className="detail-val">{donation.category || 'Barang Bekas'}</span>
                </div>
                <div className="modal-detail-row">
                  <span className="detail-key">Jumlah Barang</span>
                  <span className="detail-val">{donation.quantity || 1} barang</span>
                </div>
                <div className="modal-detail-row">
                  <span className="detail-key">Tanggal Pengajuan</span>
                  <span className="detail-val">{donation.date || 'Agustus 2026'}</span>
                </div>
                <div className="modal-detail-row">
                  <span className="detail-key">Status Donasi</span>
                  <span className={`detail-val-status status-${donation.status}`}>
                    {donation.statusLabel || donation.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Tracking or Review */}
          <div className="modal-right-interactive">
            {isCompleted && (
              <div className="modal-view-toggle">
                <button
                  type="button"
                  className={`modal-tab-btn ${activeTab === 'review' ? 'active' : ''}`}
                  onClick={() => setActiveTab('review')}
                >
                  Ulasan Donasi
                </button>
                <button
                  type="button"
                  className={`modal-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tracking')}
                >
                  Lacak Perjalanan
                </button>
              </div>
            )}

            {activeTab === 'review' && isCompleted ? (
              /* COMPLETED STATE: Review submission flow */
              <div className="modal-review-section">
                <div className="review-header-icon-wrap">
                  <img src="/ceklist.svg" alt="Selesai" className="review-check-icon" />
                </div>

                <h3 className="review-modal-title">Donasi Anda Sudah Sampai Tujuan</h3>

                {submittedReview ? (
                  <div className="review-success-card">
                    <div className="success-icon-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4>Ulasan Terkirim!</h4>
                    <p className="success-message-text">
                      &ldquo;{reviewMessage}&rdquo;
                    </p>
                    <span className="success-note">
                      Terima kasih atas ulasan dan kontribusi kebaikanmu bersama KEMBALI.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSendReview} className="review-form-wrap">
                    <p className="review-modal-subtitle">Silahkan Masukkan Ulasan</p>
                    
                    <div className="review-field-group">
                      <label htmlFor="modal-review-text" className="review-field-label">
                        Pesan
                      </label>
                      <textarea
                        id="modal-review-text"
                        className="review-textarea"
                        rows={4}
                        placeholder="Masukkan pesan atau tanggapan Anda mengenai proses donasi ini..."
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="review-submit-btn"
                      disabled={isSubmitting || !reviewMessage.trim()}
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    </button>
                  </form>
                )}

                <div className="modal-help-link-row">
                  <a href="#faq" onClick={(e) => { e.preventDefault(); alert('Pusat Bantuan KEMBALI: Hubungi kami di support@kembali.id atau WhatsApp 0812-3456-7890') }}>
                    Ada kendala? Hubungi Pusat Bantuan
                  </a>
                </div>
              </div>
            ) : (
              /* TRACKING STATE: Horizontal tracker + details */
              <div className="modal-tracking-section">
                <h3 className="modal-tracking-title">Lacak Donasi</h3>

                <div className="modal-tracker-box">
                  <DonationTracker
                    currentStep={donation.stepIndex || (donation.status === 'completed' ? 5 : donation.status === 'delivery' ? 4 : donation.status === 'pickup' ? 3 : 2)}
                    status={donation.status}
                  />
                </div>

                <div className="modal-info-block">
                  <div className="info-block-row">
                    <span className="info-block-label">Donasi</span>
                    <p className="info-block-val">
                      {donation.category || donation.title}{' '}
                      <span className="info-block-sub">({donation.quantity || 1} barang)</span>
                    </p>
                  </div>

                  <div className="info-block-row">
                    <span className="info-block-label">Tujuan Donasi</span>
                    <p className="info-block-val">
                      {donation.destinationFull || donation.destination}
                    </p>
                  </div>
                </div>

                <div className="modal-help-link-row">
                  <a href="#faq" onClick={(e) => { e.preventDefault(); alert('Pusat Bantuan KEMBALI: Hubungi kami di support@kembali.id atau WhatsApp 0812-3456-7890') }}>
                    Ada kendala? Hubungi Pusat Bantuan
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
