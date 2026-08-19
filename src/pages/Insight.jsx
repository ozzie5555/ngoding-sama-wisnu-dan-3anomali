import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import Footer from '../components/Footer'
import ArticleCard from '../components/insight/ArticleCard'
import NewsCard from '../components/insight/NewsCard'
import VideoCard from '../components/insight/VideoCard'
import PaginationBar from '../components/insight/PaginationBar'
import ArticleDetailModal from '../components/insight/ArticleDetailModal'
import {
  heroData,
  articlesData,
  newsData,
  educationalVideosData,
  impactStatsData,
  insightImages,
} from '../data/insightData'
import './Insight.css'

export default function Insight() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Carousel states for Article By KEMBALI
  const [articlePage, setArticlePage] = useState(1)
  const [isArticlePaused, setIsArticlePaused] = useState(false)
  const articleTrackRef = useRef(null)

  // Carousel states for News For You
  const [newsPage, setNewsPage] = useState(1)
  const [isNewsPaused, setIsNewsPaused] = useState(false)
  const newsTrackRef = useRef(null)

  const totalArticlePages = 4
  const totalNewsPages = 4

  // Directly derive selected article/news from URL search params
  const articleId = searchParams.get('article')
  const newsId = searchParams.get('news')
  const selectedItem = articleId
    ? articlesData.find((a) => a.id === articleId) || null
    : newsId
    ? newsData.find((n) => n.id === newsId) || null
    : null

  // Auto-slide for Article Carousel
  useEffect(() => {
    if (isArticlePaused || selectedItem) return

    const interval = setInterval(() => {
      setArticlePage((prev) => (prev % totalArticlePages) + 1)
    }, 4500)

    return () => clearInterval(interval)
  }, [isArticlePaused, totalArticlePages, selectedItem])

  // Auto-slide for News Carousel
  useEffect(() => {
    if (isNewsPaused || selectedItem) return

    const interval = setInterval(() => {
      setNewsPage((prev) => (prev % totalNewsPages) + 1)
    }, 5500)

    return () => clearInterval(interval)
  }, [isNewsPaused, totalNewsPages, selectedItem])

  const handleOpenDetail = (item) => {
    if (item.id.startsWith('article')) {
      setSearchParams({ article: item.id })
    } else if (item.id.startsWith('news')) {
      setSearchParams({ news: item.id })
    }
  }

  const handleCloseDetail = () => {
    setSearchParams({})
  }

  const scrollToArticles = () => {
    const el = document.getElementById('articles-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Multiply items for smooth looping visual representation in carousel
  const carouselArticles = [...articlesData, ...articlesData, ...articlesData]
  const carouselNews = [...newsData, ...newsData, ...newsData]

  return (
    <main className="insight-page">
      {/* ── 1. HERO / INTRODUCTION SECTION ── */}
      <section className="insight-hero-section">
        <div className="insight-container hero-container">
          <div className="hero-illustration-col">
            <div className="hero-illustration-card">
              <img
                src={heroData.image}
                alt="Ilustrasi edukasi dan informasi KEMBALI"
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

      {/* ── 2. ARTICLE BY KEMBALI SECTION ── */}
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

          {/* Continuous sliding Carousel */}
          <div
            className="carousel-viewport"
            onMouseEnter={() => setIsArticlePaused(true)}
            onMouseLeave={() => setIsArticlePaused(false)}
            ref={articleTrackRef}
          >
            <div
              className="carousel-track articles-track"
              style={{
                transform: `translateX(-${(articlePage - 1) * 25}%)`,
              }}
            >
              {carouselArticles.map((article, idx) => (
                <div key={`${article.id}-${idx}`} className="carousel-slide article-slide">
                  <ArticleCard article={article} onCardClick={handleOpenDetail} />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination bar */}
          <div className="carousel-pagination-wrapper">
            <PaginationBar
              totalPages={totalArticlePages}
              currentPage={articlePage}
              onSelectPage={(page) => setArticlePage(page)}
            />
          </div>
        </div>
      </section>

      {/* ── 3. NEWS FOR YOU SECTION ── */}
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

          {/* News Carousel */}
          <div
            className="carousel-viewport"
            onMouseEnter={() => setIsNewsPaused(true)}
            onMouseLeave={() => setIsNewsPaused(false)}
            ref={newsTrackRef}
          >
            <div
              className="carousel-track news-track"
              style={{
                transform: `translateX(-${(newsPage - 1) * 33.333}%)`,
              }}
            >
              {carouselNews.map((news, idx) => (
                <div key={`${news.id}-${idx}`} className="carousel-slide news-slide">
                  <NewsCard news={news} onCardClick={handleOpenDetail} />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination bar */}
          <div className="carousel-pagination-wrapper">
            <PaginationBar
              totalPages={totalNewsPages}
              currentPage={newsPage}
              onSelectPage={(page) => setNewsPage(page)}
            />
          </div>
        </div>
      </section>

      {/* ── 4. ABOUT ENVIRONMENT / EDUCATIONAL VIDEOS SECTION ── */}
      <section className="insight-section insight-educational-section">
        <div className="insight-container edu-container">
          <div className="section-header-row is-light-header">
            <h2 className="section-heading-title is-light">
              About Environment Edu, Recycle, and Circular Economy
            </h2>
            <a
              href="https://www.youtube.com"
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

      {/* ── 5. CTA & STATISTICS SECTION ── */}
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
                Salurkan barang layak pakai ke komunitas yang membutuhkan hanya dalam beberapa langkah
                mudah.
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

        {/* ── 6. CONNECTED EXISTING FOOTER ── */}
        <Footer />
      </div>

      {/* ── 7. ARTICLE & NEWS DETAIL OVERLAY ── */}
      {selectedItem && <ArticleDetailModal item={selectedItem} onClose={handleCloseDetail} />}
    </main>
  )
}
