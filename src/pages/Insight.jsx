import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import Footer from '../components/Footer'
import ArticleCard from '../components/insight/ArticleCard'
import NewsCard from '../components/insight/NewsCard'
import VideoCard from '../components/insight/VideoCard'
import PaginationBar from '../components/insight/PaginationBar'
import ArticleDetailModal from '../components/insight/ArticleDetailModal'
import {
  heroData,
  educationalVideosData,
  impactStatsData,
  insightImages,
} from '../data/insightData'
import { articleService, FALLBACK_ARTICLES, FALLBACK_NEWS } from '../features/insight/services/articleService'
import './Insight.css'

export default function Insight() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [articlesData, setArticlesData] = useState(FALLBACK_ARTICLES)
  const [newsData, setNewsData] = useState(FALLBACK_NEWS)
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState('')

  // ── Article Carousel States (Infinite Seamless Loop) ──
  const [articleIndex, setArticleIndex] = useState(0)
  const [isArticleAnim, setIsArticleAnim] = useState(true)
  const [isArticlePaused, setIsArticlePaused] = useState(false)

  // ── News Carousel States (Infinite Seamless Loop) ──
  const [newsIndex, setNewsIndex] = useState(0)
  const [isNewsAnim, setIsNewsAnim] = useState(true)
  const [isNewsPaused, setIsNewsPaused] = useState(false)

  const totalArticlePages = Math.max(articlesData.length, 1)
  const totalNewsPages = Math.max(newsData.length, 1)

  // Duplikasi data untuk efek infinite seamless transition
  const doubledArticles = [...articlesData, ...articlesData]
  const doubledNews = [...newsData, ...newsData]

  const selectedItem = slug && !contentLoading
    ? [...articlesData, ...newsData].find((item) => item.slug === slug) || null
    : null

  useEffect(() => {
    let active = true
    articleService.getPublished()
      .then((rows) => {
        if (!active || !rows.length) return
        setArticlesData(rows.filter((item) => item.contentType === 'article'))
        setNewsData(rows.filter((item) => item.contentType === 'news' || item.contentType === 'promo'))
      })
      .catch((error) => {
        console.error('[Insight] Failed to load articles:', error)
        if (active) setContentError('Konten terbaru belum dapat dimuat. Menampilkan data cadangan.')
      })
      .finally(() => active && setContentLoading(false))
    return () => { active = false }
  }, [])

  // Auto-slide Articles
  useEffect(() => {
    if (isArticlePaused || selectedItem) return

    const interval = setInterval(() => {
      setIsArticleAnim(true)
      setArticleIndex((prev) => prev + 1)
    }, 3500)

    return () => clearInterval(interval)
  }, [isArticlePaused, selectedItem])

  // Reset posisi Article tanpa animasi saat menyentuh akhir klon
  const handleArticleTransitionEnd = () => {
    if (articleIndex >= totalArticlePages) {
      setIsArticleAnim(false)
      setArticleIndex(0)
    }
  }

  // Auto-slide News
  useEffect(() => {
    if (isNewsPaused || selectedItem) return

    const interval = setInterval(() => {
      setIsNewsAnim(true)
      setNewsIndex((prev) => prev + 1)
    }, 4500)

    return () => clearInterval(interval)
  }, [isNewsPaused, selectedItem])

  // Reset posisi News tanpa animasi saat menyentuh akhir klon
  const handleNewsTransitionEnd = () => {
    if (newsIndex >= totalNewsPages) {
      setIsNewsAnim(false)
      setNewsIndex(0)
    }
  }

  const handleOpenDetail = (item) => {
    if (item.contentType === 'promo' && item.ctaLink) return navigate(item.ctaLink)
    navigate(`/insight/${item.slug}`)
  }

  const handleCloseDetail = () => {
    navigate('/insight')
  }

  const scrollToArticles = () => {
    const el = document.getElementById('articles-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <main className="insight-page">
      {/* HERO SECTION */}
      <section className="insight-hero-section">
        <div className="insight-container hero-container">
          <div className="hero-illustration-col">
            <div className="hero-illustration-card">
              <img
                src={heroData.image}
                alt="Ilustrasi edukasi KEMBALI"
                className="hero-main-img"
              />
            </div>
          </div>

          <div className="hero-content-col">
            <div className="hero-eyebrow-pill">{heroData.eyebrow}</div>
            <h1 className="hero-main-title">
              {heroData.titleLine1}
              <br />
              <span className="title-accent">{heroData.titleLine2}</span>
            </h1>
            <p className="hero-description">{heroData.description}</p>
            <div className="hero-actions">
              <button type="button" className="btn-hero-primary" onClick={scrollToArticles}>
                {heroData.primaryBtnText}
              </button>
              <a href="#footer-cta" className="btn-hero-secondary">
                {heroData.secondaryBtnText}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE CAROUSEL SECTION */}
      <section className="insight-section insight-articles-section" id="articles-section">
        <div className="insight-container">
          <div className="section-header-row">
            <h2 className="section-heading-title">Article By KEMBALI</h2>
            <button
              type="button"
              className="btn-view-all-pill"
              onClick={() => handleOpenDetail(articlesData[0])}
            >
              View all
            </button>
          </div>
          {contentLoading && <p className="insight-content-status" role="status">Memuat artikel terbaru...</p>}
          {contentError && <p className="insight-content-status is-warning" role="alert">{contentError}</p>}

          <div
            className="carousel-viewport"
            onMouseEnter={() => setIsArticlePaused(true)}
            onMouseLeave={() => setIsArticlePaused(false)}
          >
            <div
              className="carousel-track articles-track"
              onTransitionEnd={handleArticleTransitionEnd}
              style={{
                transform: `translateX(-${articleIndex * 25}%)`,
                transition: isArticleAnim
                  ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'none',
              }}
            >
              {doubledArticles.map((article, idx) => (
                <div key={`article-${idx}`} className="carousel-slide article-slide">
                  <ArticleCard article={article} onCardClick={handleOpenDetail} />
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-pagination-wrapper">
            <PaginationBar
              totalPages={totalArticlePages}
              currentPage={(articleIndex % totalArticlePages) + 1}
              onSelectPage={(page) => {
                setIsArticleAnim(true)
                setArticleIndex(page - 1)
              }}
            />
          </div>
        </div>
      </section>

      {/* NEWS CAROUSEL SECTION */}
      <section className="insight-section insight-news-section">
        <div className="insight-container">
          <div className="section-header-row">
            <h2 className="section-heading-title">News For You</h2>
            <button
              type="button"
              className="btn-view-all-pill"
              onClick={() => handleOpenDetail(newsData[0])}
            >
              View All
            </button>
          </div>

          <div
            className="carousel-viewport"
            onMouseEnter={() => setIsNewsPaused(true)}
            onMouseLeave={() => setIsNewsPaused(false)}
          >
            <div
              className="carousel-track news-track"
              onTransitionEnd={handleNewsTransitionEnd}
              style={{
                transform: `translateX(-${newsIndex * 33.333}%)`,
                transition: isNewsAnim
                  ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'none',
              }}
            >
              {doubledNews.map((news, idx) => (
                <div key={`news-${idx}`} className="carousel-slide news-slide">
                  <NewsCard news={news} onCardClick={handleOpenDetail} />
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-pagination-wrapper">
            <PaginationBar
              totalPages={totalNewsPages}
              currentPage={(newsIndex % totalNewsPages) + 1}
              onSelectPage={(page) => {
                setIsNewsAnim(true)
                setNewsIndex(page - 1)
              }}
            />
          </div>
        </div>
      </section>

      {/* EDUCATIONAL VIDEOS */}
      <section className="insight-section insight-educational-section">
        <div className="insight-container edu-container">
          <div className="section-header-row is-light-header">
            <h2 className="section-heading-title is-light">
              About Environment Edu, Recycle, and Circular Economy
            </h2>
            <a
              href="https://youtu.be/zCRKvDyyHmI?si=nXAcfL6GGUnG3eZW"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view-all-pill is-light-pill"
            >
              View All
            </a>
          </div>

          <div className="video-cards-list">
            {educationalVideosData.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <div className="insight-dark-band" id="footer-cta">
        <section className="insight-impact-banner">
          <div className="insight-container impact-inner">
            <div className="impact-copy-col">
              <h2 className="impact-heading">
                Siap Memberikan Kehidupan
                <br />
                Kedua untuk Barangmu?
              </h2>
              <p className="impact-description">
                Salurkan barang layak pakai ke komunitas yang membutuhkan hanya dalam beberapa langkah mudah.
              </p>
            </div>

            <div className="impact-stats-grid">
              {impactStatsData.map((stat, idx) => (
                <div key={idx} className="stat-card-box">
                  <strong className="stat-value">{stat.value}</strong>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="impact-illustration-col">
              <img
                src={insightImages.impactIllustration}
                alt=""
                className="impact-bruxelles-art"
                aria-hidden="true"
              />
            </div>
          </div>
        </section>
      </div>
    </main>

      <Footer />

      {/* DETAIL MODAL OVERLAY */}
      {selectedItem && <ArticleDetailModal item={selectedItem} onClose={handleCloseDetail} />}
    </>
  )
}
