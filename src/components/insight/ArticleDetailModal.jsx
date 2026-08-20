import { useState, useEffect } from 'react'
import { Link } from 'react-router'

export default function ArticleDetailModal({ item, onClose }) {
  const [openAccordionId, setOpenAccordionId] = useState('acc-1')
  const [hoveredBoxIdx, setHoveredBoxIdx] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!item) return null

  const isNews = Boolean(item.id?.startsWith('news'))

  const toggleAccordion = (id) => {
    setOpenAccordionId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="insight-detail-overlay" role="dialog" aria-modal="true">
      <div className="insight-detail-container">
        {/* Floating Close Button */}
        <button
          type="button"
          className="btn-detail-close"
          onClick={onClose}
          aria-label="Tutup detail artikel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── ARTICLE 1: Ide Daur Ulang Sampah (Accordions) ── */}
        {item.id === 'article-1' && (
          <article className="article-detail-view article-1-view">
            <header className="detail-header">
              <div className="detail-header-left">
                <div className="detail-tags">
                  {item.categories?.map((cat, i) => (
                    <span key={i} className="category-tag">
                      {cat}
                    </span>
                  ))}
                  <span className="category-tag tag-dots">•••</span>
                </div>
                <h1 className="detail-title">{item.title}</h1>
                <div className="detail-meta">
                  <span>{item.detailDate || item.date}</span>
                  <span>•</span>
                  <span>{item.author}</span>
                </div>
                <p className="detail-intro">{item.intro}</p>
                <p className="detail-subintro">{item.subIntro}</p>
              </div>

              {item.image && (
                <div className="detail-header-right">
                  <img src={item.image} alt={item.title} className="detail-header-illustration" />
                </div>
              )}
            </header>

            {/* Accordions List */}
            <div className="accordions-list">
              {item.accordions?.map((acc) => {
                const isOpen = openAccordionId === acc.id
                return (
                  <div
                    key={acc.id}
                    className={`accordion-box ${isOpen ? 'is-open' : 'is-closed'}`}
                    style={
                      isOpen
                        ? {
                            backgroundColor: acc.activeColor,
                            color: acc.textColor,
                          }
                        : undefined
                    }
                  >
                    <div
                      className="accordion-header"
                      onClick={() => toggleAccordion(acc.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="accordion-title-row">
                        <span className="accordion-number">{acc.number}</span>
                        <h2 className="accordion-title">{acc.title}</h2>
                      </div>
                      <button
                        type="button"
                        className="btn-accordion-toggle"
                        aria-label={isOpen ? 'Tutup accordion' : 'Buka accordion'}
                      >
                        {isOpen ? '✕' : '+'}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="accordion-body">
                        <div className="accordion-media">
                          <img
                            src={acc.image}
                            alt={acc.title}
                            className="accordion-img"
                            onError={(e) => {
                              e.target.src = '/insight/accordion-01.svg'
                            }}
                          />
                        </div>
                        <div className="accordion-text">
                          <p>{acc.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </article>
        )}

        {/* ── ARTICLE 2: Donasi Barang Bekas (4 Information Boxes) ── */}
        {item.id === 'article-2' && (
          <article className="article-detail-view article-2-view">
            <header className="detail-header">
              <div className="detail-header-left">
                <div className="detail-tags">
                  {item.categories?.map((cat, i) => (
                    <span key={i} className="category-tag">
                      {cat}
                    </span>
                  ))}
                  <span className="category-tag tag-dots">•••</span>
                </div>
                <h1 className="detail-title">{item.title}</h1>
                <div className="detail-meta">
                  <span>{item.detailDate || item.date}</span>
                  <span>•</span>
                  <span>{item.author}</span>
                </div>
                <p className="detail-intro">{item.intro}</p>
                <p className="detail-subintro">{item.subIntro}</p>
              </div>

              {item.image && (
                <div className="detail-header-right">
                  <img src={item.image} alt={item.title} className="detail-header-illustration" />
                </div>
              )}
            </header>

            {/* 4 Informational Boxes (Preserving 01, 02, 03, 05 numbering) */}
            <div className="info-boxes-list">
              {item.infoBoxes?.map((box, idx) => {
                const colorSequence = item.interactionColors || ['#0197D2', '#3FBEC7', '#248689', '#808964']
                const activeColor = colorSequence[idx % colorSequence.length]
                const isHovered = hoveredBoxIdx === idx

                return (
                  <div
                    key={box.number}
                    className={`article-info-box ${isHovered ? 'is-hovered' : ''}`}
                    onMouseEnter={() => setHoveredBoxIdx(idx)}
                    onMouseLeave={() => setHoveredBoxIdx(null)}
                    style={{
                      borderColor: isHovered ? activeColor : 'rgba(34, 34, 34, 0.15)',
                      boxShadow: isHovered ? `0 10px 30px ${activeColor}25` : 'none',
                    }}
                  >
                    <h2 className="info-box-title" style={{ color: isHovered ? activeColor : '#062632' }}>
                      {box.number}. {box.title}
                    </h2>
                    <div className="info-box-paragraphs">
                      {box.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        )}

        {/* ── ARTICLE 3: Ekonomi Sirkular (Banner + Editorial + 4 Action Cards) ── */}
        {item.id === 'article-3' && (
          <article className="article-detail-view article-3-view">
            {item.bannerImage && (
              <div className="detail-banner-wrapper">
                <img src={item.bannerImage} alt={item.title} className="detail-banner-img" />
              </div>
            )}

            <div className="detail-editorial-body">
              <div className="detail-tags">
                {item.categories?.map((cat, i) => (
                  <span key={i} className="category-tag">
                    {cat}
                  </span>
                ))}
                <span className="category-tag tag-dots">•••</span>
              </div>

              <h1 className="detail-title">{item.title}</h1>

              <div className="detail-meta">
                <span>{item.detailDate || item.date}</span>
                <span>•</span>
                <span>{item.author}</span>
              </div>

              {item.sections?.map((sec, secIdx) => {
                if (sec.type === 'intro') {
                  return (
                    <div key={secIdx} className="editorial-intro-block">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  )
                }

                if (sec.type === 'heading') {
                  return (
                    <section key={secIdx} className="editorial-section-block">
                      <h2 className="editorial-heading">{sec.title}</h2>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </section>
                  )
                }

                if (sec.type === 'action_cards_section') {
                  return (
                    <section key={secIdx} className="editorial-actions-block">
                      <h2 className="editorial-heading">{sec.title}</h2>
                      <div className="circular-actions-grid">
                        {sec.cards.map((card) => (
                          <div key={card.id} className="circular-action-card">
                            <div className={`action-card-icon-wrap action-card-${card.id}`}>
                              <img src={card.icon} alt="" className="action-card-icon" />
                            </div>
                            <h3 className="action-card-title">{card.title}</h3>
                            {card.actionText && (
                              <Link to={card.actionLink || '/donasi'} className="btn-action-card">
                                {card.actionText} →
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )
                }

                return null
              })}
            </div>
          </article>
        )}

        {/* ── ARTICLE 4: Cara Berdonasi yang Aman dan Tepat ── */}
        {item.id === 'article-4' && (
          <article className="article-detail-view article-4-view">
            <header className="detail-header">
              <div className="detail-header-left">
                <div className="detail-tags">
                  {item.categories?.map((cat, i) => (
                    <span key={i} className="category-tag">
                      {cat}
                    </span>
                  ))}
                  <span className="category-tag tag-dots">•••</span>
                </div>
                <h1 className="detail-title">{item.title}</h1>
                <div className="detail-meta">
                  <span>{item.detailDate || item.date}</span>
                  <span>•</span>
                  <span>{item.author}</span>
                </div>
                <p className="detail-intro">{item.intro}</p>
                <p className="detail-subintro">{item.subIntro}</p>
              </div>

              {item.image && (
                <div className="detail-header-right">
                  <img src={item.image} alt={item.title} className="detail-header-illustration" />
                </div>
              )}
            </header>

            <div className="detail-editorial-body">
              {item.whySection && (
                <section className="editorial-section-block">
                  <h2 className="editorial-heading">{item.whySection.title}</h2>
                  {item.whySection.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </section>
              )}

              {/* 6 Safety Points List */}
              <div className="safety-points-list">
                {item.safetyPoints?.map((pt) => (
                  <div key={pt.number} className="safety-point-box">
                    <h2 className="safety-point-title">
                      {pt.number}. {pt.title}
                    </h2>
                    <div className="safety-point-paragraphs">
                      {pt.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {item.closingSection && (
                <section className="editorial-section-block closing-block">
                  <h2 className="editorial-heading">{item.closingSection.title}</h2>
                  {item.closingSection.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </section>
              )}
            </div>
          </article>
        )}

        {/* ── NEWS DETAIL: Gempa Nagekeo & Bank Sampah ── */}
        {isNews && (
          <article className="article-detail-view news-detail-view">
            {item.image && (
              <div className="detail-banner-wrapper">
                <img src={item.image} alt={item.title} className="detail-banner-img" />
              </div>
            )}

            <div className="detail-editorial-body">
              <div className="detail-tags">
                {item.categories?.map((cat, i) => (
                  <span key={i} className="category-tag">
                    {cat}
                  </span>
                ))}
                <span className="category-tag tag-dots">•••</span>
              </div>

              <h1 className="detail-title">{item.title}</h1>

              <div className="detail-meta">
                <span>{item.date}</span>
                <span>•</span>
                <span>{item.source}</span>
              </div>

              <div className="editorial-paragraphs-flow">
                {item.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        )}

        {/* Bottom Back Button */}
        <div className="detail-bottom-actions">
          <button type="button" className="btn-detail-back" onClick={onClose}>
            ← Kembali ke Insight
          </button>
        </div>
      </div>
    </div>
  )
}
