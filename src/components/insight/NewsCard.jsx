import { Link } from 'react-router'

export default function NewsCard({ news, onCardClick }) {
  const { isFeatured, title, categories, date, source, image, ctaText, ctaLink } = news

  if (isFeatured) {
    return (
      <article className="insight-news-card is-featured-teal">
        <div className="news-card-tags">
          {categories.map((cat, idx) => (
            <span key={idx} className="category-tag is-light-tag">
              {cat}
            </span>
          ))}
          <span className="category-tag is-light-tag tag-dots">•••</span>
        </div>

        <h3 className="featured-news-title">{title}</h3>

        <div className="featured-news-action">
          <Link to={ctaLink || '/donasi'} className="btn-featured-donate">
            {ctaText || 'Donasi Sekarang'} <span className="arrow-icon">→</span>
          </Link>
        </div>

        <div className="news-card-meta is-light-meta">
          <span className="meta-date">{date}</span>
          <span className="meta-dot">•</span>
          <span className="meta-source">{source}</span>
        </div>
      </article>
    )
  }

  return (
    <article className="insight-news-card is-standard-news" onClick={() => onCardClick?.(news)}>
      {image && (
        <div className="news-card-media">
          <img
            src={image}
            alt={title}
            className="news-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/insight/news-01.svg'
            }}
          />
        </div>
      )}

      <div className="news-card-content">
        <div className="news-card-tags">
          {categories.map((cat, idx) => (
            <span key={idx} className="category-tag">
              {cat}
            </span>
          ))}
          <span className="category-tag tag-dots">•••</span>
        </div>

        <h3 className="news-card-title">{title}</h3>

        <div className="news-card-meta">
          <span className="meta-date">{date}</span>
          <span className="meta-dot">•</span>
          <span className="meta-source">{source}</span>
        </div>
      </div>
    </article>
  )
}
