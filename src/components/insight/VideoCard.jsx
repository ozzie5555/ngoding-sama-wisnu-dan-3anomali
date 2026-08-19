export default function VideoCard({ video }) {
  const { title, categories, date, author, thumbnail, videoUrl } = video

  const handleClick = (e) => {
    e.preventDefault()
    window.open(videoUrl || 'https://www.youtube.com', '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="insight-video-card">
      <div className="video-card-thumbnail-wrapper" onClick={handleClick} role="button" tabIndex={0}>
        <img
          src={thumbnail}
          alt={title}
          className="video-card-thumbnail"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/insight/video-01.svg'
          }}
        />
        <div className="video-play-overlay">
          <div className="youtube-play-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="youtube-badge">
          <span>Watch on</span>
          <strong>YouTube</strong>
        </div>
      </div>

      <div className="video-card-info">
        <div className="video-card-tags">
          {categories.map((cat, idx) => (
            <span key={idx} className="category-tag is-light-outline">
              {cat}
            </span>
          ))}
          <span className="category-tag is-light-outline tag-dots">•••</span>
        </div>

        <h3 className="video-card-title" onClick={handleClick}>
          {title}
        </h3>

        <div className="video-card-meta">
          <span className="meta-date">{date}</span>
          <span className="meta-dot">•</span>
          <span className="meta-author">{author}</span>
        </div>
      </div>
    </article>
  )
}
