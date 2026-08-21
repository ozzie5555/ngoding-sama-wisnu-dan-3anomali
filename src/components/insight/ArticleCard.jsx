export default function ArticleCard({ article, onCardClick }) {
  const { title, categories, date, author, image, ctaText = 'Visit Now' } = article

  return (
    <article className="insight-article-card" onClick={() => onCardClick?.(article)}>
      <div className="article-card-media">
        <img
          src={image}
          alt={title}
          className="article-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/insight/article-01.svg'
          }}
        />
      </div>

      <div className="article-card-content">
        <div className="article-card-tags">
          {categories.map((cat, idx) => (
            <span key={idx} className="category-tag">
              {cat}
            </span>
          ))}
          <span className="category-tag tag-dots">•••</span>
        </div>

        <h3 className="article-card-title">{title}</h3>

        <div className="article-card-meta">
          <span className="meta-date">{date}</span>
          <span className="meta-dot">•</span>
          <span className="meta-author">{author}</span>
        </div>

        <div className="article-card-action">
          <button
            type="button"
            className="btn-visit-now"
            onClick={(e) => {
              e.stopPropagation()
              onCardClick?.(article)
            }}
          >
            <span>{ctaText}</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  )
}
