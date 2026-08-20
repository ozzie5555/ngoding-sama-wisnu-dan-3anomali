import React from 'react'
import DonationTracker from './DonationTracker'
import './DonationActivity.css'

export default function DonationActivity({
  donation,
  onOpenDetail,
  className = '',
}) {
  if (!donation) {
    return (
      <div className={`donation-activity-card empty-activity ${className}`}>
        <div className="empty-activity-inner">
          <p>Belum ada aktivitas donasi yang sedang berjalan.</p>
        </div>
      </div>
    )
  }

  // Derive visual state config based on donation status
  const getStatusConfig = () => {
    switch (donation.status) {
      case 'completed':
      case 'received':
        return {
          themeClass: 'theme-completed',
          illustration: '/ceklist.svg',
          illustrationAlt: 'Donasi Sampai Tujuan',
          title: (
            <>
              Donasi Anda Sudah<br />Sampai Tujuan
            </>
          ),
          subtitle: 'Terima kasih sudah membantu memberikan manfaat.',
          buttonText: 'Lihat Detail',
        }

      case 'delivery':
      case 'shipping':
        return {
          themeClass: 'theme-delivery',
          illustration: '/free-shipping-1--e-commerce-free-shipping.svg',
          illustrationAlt: 'Donasi Sedang Dalam Perjalanan',
          title: (
            <>
              Donasi Anda Sedang<br />Dalam Perjalanan
            </>
          ),
          subtitle: (
            <>
              Jangan Lupa Mengisi Ulasan<br />Ketika Donasi Sampai
            </>
          ),
          buttonText: 'Lihat Detail',
        }

      case 'pickup':
        return {
          themeClass: 'theme-pickup',
          illustration: '/free-shipping-1--e-commerce-free-shipping.svg',
          illustrationAlt: 'Penjemputan Donasi',
          title: (
            <>
              Donasi Anda Sedang<br />Dijadwalkan Jemput
            </>
          ),
          subtitle: 'Kurir mitra akan mengambil donasi di lokasi penjemputan.',
          buttonText: 'Lihat Detail',
        }

      case 'confirmation':
      case 'pending':
      case 'verified':
      default:
        if (donation.status === 'cancelled' || donation.status === 'error') {
          return {
            themeClass: 'theme-error',
            illustration: '/abandoned-cart.svg',
            illustrationAlt: 'Donasi Dibatalkan',
            title: (
              <>
                Donasi Belum Dapat<br />Diproses
              </>
            ),
            subtitle: (
              <>
                Bila Ada Kendala Silahkan Hubungi<br />Pusat Bantuan
              </>
            ),
            buttonText: 'Lihat Detail',
          }
        }
        return {
          themeClass: 'theme-confirmation',
          illustration: '/student-studying.svg',
          illustrationAlt: 'Donasi Sedang Dikonfirmasi',
          title: (
            <>
              Donasi Anda Sedang<br />Dikonfirmasi
            </>
          ),
          subtitle: (
            <>
              Bila Ada Kendala Silahkan Hubungi<br />Pusat Bantuan
            </>
          ),
          buttonText: 'Lihat Detail',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`donation-activity-card ${className}`}>
      {/* Upper Status Banner with Illustration and Message Box */}
      <div className={`activity-banner-grid ${config.themeClass}`}>
        <div className="activity-illustration-wrap">
          <img
            src={config.illustration}
            alt={config.illustrationAlt}
            className="activity-illustration-img"
            onError={(e) => {
              e.target.src = '/ceklist.svg'
            }}
          />
        </div>

        <div className={`activity-status-box ${config.themeClass}`}>
          <h3 className="activity-status-heading">{config.title}</h3>
          <p className="activity-status-subtitle">{config.subtitle}</p>
        </div>
      </div>

      {/* Lower Tracking and Info Body */}
      <div className="activity-tracking-body">
        <h4 className="activity-tracking-title">Lacak Donasi</h4>

        <div className="activity-tracker-container">
          <DonationTracker
            currentStep={donation.stepIndex || (donation.status === 'completed' ? 5 : donation.status === 'delivery' ? 4 : donation.status === 'pickup' ? 3 : 2)}
            status={donation.status}
          />
        </div>

        <div className="activity-info-details">
          <div className="activity-info-row">
            <span className="activity-info-label">Donasi</span>
            <p className="activity-info-val">
              {donation.category || donation.title}{' '}
              <span className="activity-info-sub">{donation.optionChosenNote || '(sesuai opsi yang sudah dipilih)'}</span>
            </p>
          </div>

          <div className="activity-info-row">
            <span className="activity-info-label">Tujuan Donasi</span>
            <p className="activity-info-val">
              {donation.destinationFull || donation.destination || 'Komunitas Terverifikasi'}
            </p>
          </div>

          <button
            type="button"
            className="activity-detail-btn"
            onClick={() => onOpenDetail && onOpenDetail(donation)}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  )
}
