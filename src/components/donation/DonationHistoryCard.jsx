import './DonationHistoryCard.css'

export default function DonationHistoryCard({
  donation,
  onOpenDetail,
  className = '',
}) {
  if (!donation) return null

  const getStatusBadgeClass = () => {
    switch (donation.status) {
      case 'completed':
      case 'received':
        return 'status-selesai'
      case 'delivery':
      case 'shipping':
        return 'status-proses'
      case 'pickup':
      case 'confirmation':
      case 'pending':
        return 'status-konfirmasi'
      case 'cancelled':
      case 'error':
        return 'status-dibatalkan'
      default:
        return 'status-proses'
    }
  }

  const getButtonText = () => {
    if (donation.status === 'delivery' || donation.status === 'shipping' || donation.status === 'pickup') {
      return 'Lacak Donasi'
    }
    return 'Lihat Detail'
  }

  return (
    <article className={`kembali-history-card ${className}`}>
      <div className="kembali-history-media">
        <img
          src={donation.image || '/buku-pelajarn.svg'}
          alt={donation.title}
          className="kembali-history-img"
          onError={(e) => {
            e.target.src = '/buku-pelajarn.svg'
          }}
        />
        <div className={`kembali-status-badge ${getStatusBadgeClass()}`}>
          {donation.statusLabel || (donation.status === 'completed' ? 'Selesai' : donation.status === 'cancelled' ? 'Dibatalkan' : 'Dalam Proses')}
        </div>
      </div>

      <div className="kembali-history-info">
        <h4 className="kembali-history-title">{donation.title}</h4>
        <p className="kembali-history-meta">
          {donation.destinationFull || `Untuk ${donation.destination}`}
        </p>
        <p className="kembali-history-desc">
          {donation.description || `${donation.quantity || 1} barang layak pakai. Diajukan pada ${donation.date}`}
        </p>

        {donation.tags && donation.tags.length > 0 && (
          <div className="kembali-history-tags">
            {donation.tags.map((tag, i) => (
              <span key={i} className="kembali-tag-chip">{tag}</span>
            ))}
          </div>
        )}

        <button
          type="button"
          className="kembali-history-btn"
          onClick={() => onOpenDetail && onOpenDetail(donation)}
        >
          {getButtonText()}
        </button>
      </div>
    </article>
  )
}
