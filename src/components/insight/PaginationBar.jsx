import { Fragment } from 'react'

export default function PaginationBar({
  totalPages = 4,
  currentPage = 1,
  onSelectPage = () => {},
  className = '',
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div
      className={`insight-pagination-bar ${className}`}
      role="navigation"
      aria-label="Pagination carousel"
    >
      <div className="pagination-track">
        {pages.map((page) => {
          const isActive = page === currentPage
          const formattedNumber = String(page).padStart(2, '0')

          return (
            <Fragment key={page}>
              <button
                type="button"
                className={`pagination-number-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectPage(page)}
                aria-label={`Halaman ${page}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {formattedNumber}
              </button>

              {/* Connecting line between active item and next numbers */}
              {isActive && page < totalPages && (
                <div className="pagination-connector-line" aria-hidden="true">
                  <span className="line-fill" />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
