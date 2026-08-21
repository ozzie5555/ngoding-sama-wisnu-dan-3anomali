import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase/client'
import { communityService, FALLBACK_COMMUNITIES } from '../features/community/services/communityService'
import { articlesData } from '../data/insightData'
import './Home.css'

const services = [
  ['order-delivered.svg', 'Donasi Online', 'Isi Form Donasi', 'lime'],
  ['analyze-data.svg', 'Informasi & Wawasan', 'Pelajari Lebih Lanjut', 'mint'],
  ['content-media-folder.svg', 'Dokumentasi', 'Lihat Dokumentasi', 'blue'],
  ['diversity-unity.svg', 'Komunitas', 'Lihat Komunitas', 'cyan'],
]
const items = [
  ['girl-doing-shopping-with-cart-2194198-0.svg', 'Barang Bekas', 'lime'],
  ['shopping-2194208-0.svg', 'Pakaian Layak', 'blue'],
  ['student-studying.svg', 'Buku & ATK Bekas', 'cyan'],
  ['girl-doing-paiting-on-the-canvas-2194214-0.svg', 'Karya Hasil Daur Ulang', 'mint'],
]
const EMPTY_REVIEW = [{ id: 'empty', avatar: '/User 03C.svg', name: 'Belum ada ulasan', role: 'Donatur KEMBALI', text: 'Jadilah donatur pertama yang membagikan pengalaman setelah donasi diterima komunitas.' }]
const stats = [['12.400+', 'Barang Tersirkulasi'], ['2.000 kg', 'Sampah Dikurangi'], ['4.680 kg', 'CO2 Dihemat'], ['1.500+', 'Pengguna Aktif']]

const faqs = [
  [
    'Bagaimana cara berdonasi di KEMBALI?',
    'Lakukan registrasi akun, kemudian anda akan diarahkan ke halaman donasi. Anda bisa mencari barang yang dibutuhkan komunitas untuk berdonasi. Isi form donasi dan lakukan konfirmasi pengajuan. Kemudian anda dapat melacak proses donasi hingga ke tangan penerima.'
  ],
  [
    'Apakah boleh mendonasikan barang daur ulang?',
    'Tentu. KEMBALI menerima barang yang masih layak atau dapat didaur ulang sesuai dengan ketentuan donasi.'
  ],
  [
    'Ke mana donasi saya disalurkan?',
    'Donasi disalurkan kepada penerima yang membutuhkan melalui program dan mitra KEMBALI yang telah ditentukan.'
  ],
  [
    'Bagaimana KEMBALI memastikan donasi sampai kepada penerima yang tepat?',
    'KEMBALI bekerja sama dengan mitra terpercaya dan melakukan proses verifikasi serta pemantauan penyaluran donasi.'
  ]
]

function Heading({ eyebrow, title, accent, sub, preAccent, className = '' }) {
  return (
    <header className={`section-heading ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{preAccent && <em>{preAccent} </em>}{title}{accent && <em> {accent}</em>}</h2>
      {sub && <p>{sub}</p>}
    </header>
  )
}

function PartnerGrid({ partners }) {
  return (
    <div className="partner-grid">
      {partners.map((partner, idx) => (
        <article className={`partner-card reveal-on-scroll reveal-delay-${(idx % 4) + 1}`} key={partner.id}>
          <img src={partner.logo} alt="" />
          <h3>{partner.name}</h3>
          <p>{partner.description}</p>
          <div className="partner-meta">
            <address>{partner.address}</address>
            <span>
              <img src="/ri_instagram-fill.svg" alt="Instagram" className="partner-sosmed-icon" />
              {partner.handle}
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}

function AnimatedStat({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const target = Number(value.replace(/\D/g, ''))
    const suffix = value.includes('kg') ? ' kg' : value.includes('+') ? '+' : ''
    const format = number => `${new Intl.NumberFormat('id-ID').format(number)}${suffix}`
    let frame

    const animate = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplay(format(target)); return }
      const started = performance.now()
      const tick = now => {
        const progress = Math.min((now - started) / 1600, 1)
        setDisplay(format(Math.round(target * (1 - Math.pow(1 - progress, 3)))))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { observer.disconnect(); animate() } }, { threshold: .35 })
    if (ref.current) observer.observe(ref.current)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [value])

  return <strong ref={ref}>{display}</strong>
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)
  const [reviews, setReviews] = useState([])
  const [partners, setPartners] = useState(FALLBACK_COMMUNITIES)
  
  // State untuk kontrol Carousel Insight
  const [activeIndex, setActiveIndex] = useState(0)
  const totalArticles = Math.min(articlesData.length, 4)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalArticles - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === totalArticles - 1 ? 0 : prev + 1))
  }

  // Scroll reveal observer
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let active = true
    communityService.getCommunities()
      .then((rows) => { if (active && rows.length) setPartners(rows) })
      .catch((error) => console.error('[Home] Failed to load communities:', error))
    return () => { active = false }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadReviews() {
      const { data, error } = await supabase.rpc('get_home_testimonials', { p_limit: 12 })

      if (error) {
        console.error('[Home] Failed to load testimonials:', error.message)
        return
      }
      if (ignore) return

      setReviews((data || []).map((item) => ({
        id: item.id,
        avatar: item.avatar_path || '/User 03C.svg',
        name: item.full_name || item.username || 'Donatur KEMBALI',
        role: 'Donatur KEMBALI',
        text: item.content,
      })))
    }

    loadReviews()
    const channel = supabase
      .channel('home:testimonials')
      .on('broadcast', { event: 'changed' }, loadReviews)
      .subscribe()

    return () => {
      ignore = true
      supabase.removeChannel(channel)
    }
  }, [])

  const reviewSource = reviews.length ? reviews : EMPTY_REVIEW
  const reviewSequence = Array.from(
    { length: Math.max(1, Math.ceil(4 / reviewSource.length)) },
    () => reviewSource,
  ).flat()
  const marqueeReviews = [...reviewSequence, ...reviewSequence]

  return (
    <>
      <main className="home">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy reveal-on-scroll">
              <span className="outline-pill">Donasikan Barang Bekas & Karya Daur Ulangmu!</span>
              <h1><em>Jangan Buang!</em> Beri Kesempatan<span className="desktop-break"><br /></span> Kedua untuk Barangmu!</h1>
              <p><strong>KEMBALI</strong> menghubungkan <strong>donatur</strong> dengan penerima<span className="desktop-break"><br /></span> <strong>manfaat</strong>, menyelamatkan barang layak pakai dari tempat<span className="desktop-break"><br /></span> sampah dan memberikan dampak nyata bagi lingkungan.</p>
              <div className="actions">
                <Link className="button primary" to="/donasi">Mulai Donasi Sekarang <b>→</b></Link>
                <a className="button secondary" href="#layanan">Hubungi Kami</a>
              </div>
            </div>
            <img className="hero-art reveal-on-scroll reveal-delay-2" src="/HEROSECTION_1_VECTOR.svg" alt="Orang-orang berbagi barang layak pakai" />
          </div>
          <img className="hero-grass" src="/rumput.svg" alt="" aria-hidden="true" />
          <div className="landscape" aria-hidden="true"><i /><i /><i /><i /></div>
        </section>

        <section className="impact">
          <div className="stat-grid">
            {stats.map(([n, l], idx) => (
              <article key={l} className={`reveal-on-scroll reveal-delay-${idx + 1}`}>
                <AnimatedStat value={n} />
                <span>{l}</span>
              </article>
            ))}
          </div>
          <div className="impact-copy reveal-on-scroll">
            <h2>Dampak Positif<br />Untuk <em>Bumi</em></h2>
            <p>Mengurangi sampah, menghemat sumber daya, dan menciptakan dampak positif bagi bumi melalui penggunaan kembali barang layak pakai.</p>
          </div>
        </section>
        
        {/* Section: Seputar Tentang KEMBALI - 3D Carousel Style */}
        <section className="insight reveal-on-scroll" id="insight">
          <Heading
            className="reveal-on-scroll"
            title="Seputar Tentang"
            accent="KEMBALI"
            sub="Temukan berita terbaru, artikel inspiratif, tips gaya hidup berkelanjutan, serta berbagai informasi mengenai program dan dampak KEMBALI."
          />

          <div className="article-carousel reveal-on-scroll reveal-delay-1">
            <button type="button" className="carousel-arrow prev" onClick={handlePrev} aria-label="Previous">
              ‹
            </button>

            <div className="article-window">
              {articlesData.slice(0, 4).map((art, idx) => {
                let positionClass = 'hidden'
                if (idx === activeIndex) {
                  positionClass = 'is-featured'
                } else if (idx === (activeIndex - 1 + totalArticles) % totalArticles) {
                  positionClass = 'side-card side-left'
                } else if (idx === (activeIndex + 1) % totalArticles) {
                  positionClass = 'side-card side-right'
                }

                return (
                  <article key={art.id} className={`home-insight-card ${positionClass}`}>
                    <div className="home-insight-card-content">
                      <span className="home-insight-date">{art.date}</span>
                      <h3 className="home-insight-card-title">{art.title}</h3>
                      <p className="home-insight-card-meta">
                        KEMBALI Insight<br />By - {art.author || 'KEMBALI'}
                      </p>
                      <div className="home-insight-card-action">
                        <Link to={`/insight?article=${art.id}`} className="home-insight-visit-btn">
                          Visit Now
                        </Link>
                      </div>
                    </div>

                    <div className="home-insight-card-media">
                      <img
                        src={art.image}
                        alt={art.title}
                        loading="lazy"
                        onError={(e) => { e.target.src = '/insight/article-01.svg' }}
                      />
                    </div>
                  </article>
                )
              })}
            </div>

            <button type="button" className="carousel-arrow next" onClick={handleNext} aria-label="Next">
              ›
            </button>
          </div>

          <div className="dots">
            {articlesData.slice(0, 4).map((_, idx) => (
              <i
                key={idx}
                className={idx === activeIndex ? 'active' : ''}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>

        </section>

        <section className="services reveal-on-scroll" id="layanan">
          <Heading
            className="reveal-on-scroll"
            eyebrow="Kami Menyediakan yang Anda Butuhkan"
            title="Layanan untuk"
            accent="Anda"
            sub="Kami Selalu Memberikan Layanan yang Terbaik"
          />
          <div className="service-grid">
            {services.map(([img, title, action, color], i) => (
              <article className={`service-card reveal-on-scroll reveal-delay-${i + 1}`} key={title}>
                <div className={'art-blob ' + color}>
                  <img src={'/' + img} alt="" />
                </div>
                <h3>{title}</h3>
                {i === 0 ? (
                  <Link to="/donasi?cari=true">{action}<b>&rarr;</b></Link>
                ) : (
                  <a href={i === 3 ? '#komunitas' : '#insight'}>{action}<b>&rarr;</b></a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="testimonials reveal-on-scroll">
          <Heading
            className="reveal-on-scroll"
            eyebrow="Segala Masukan Sangat Berarti untuk Kami"
            title="Ulasan"
            accent="Pengguna"
            sub="Bersama Menciptakan Perubahan"
          />
          <div className="review-board">
            <div className="review-track review-row-one">
              {marqueeReviews.map((review, i) => (
                <article key={`first-${review.id}-${i}`}>
                  <header>
                    <img src={review.avatar} alt={`Foto ${review.name}`} />
                    <div>
                      <h3>{review.name}</h3>
                      <span>{review.role}</span>
                    </div>
                  </header>
                  <p>“{review.text}”</p>
                </article>
              ))}
            </div>
            <div className="review-track review-row-two">
              {[...marqueeReviews].reverse().map((review, i) => (
                <article key={`second-${review.id}-${i}`}>
                  <header>
                    <img src={review.avatar} alt={`Foto ${review.name}`} />
                    <div>
                      <h3>{review.name}</h3>
                      <span>{review.role}</span>
                    </div>
                  </header>
                  <p>“{review.text}”</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="steps reveal-on-scroll" id="steps">
          <div className="steps-header reveal-on-scroll">
            <h2>Bagaimana Cara<br /><em>Berdonasi?</em></h2>
            <p className="steps-intro">Ikuti langkah-langkah berikut untuk melakukan donasi online melalui KEMBALI.</p>
          </div>
          <div className="step-grid">
            {[
              ['Cari Kebutuhan', 'Temukan barang yang sedang dibutuhkan oleh komunitas.'],
              ['Isi Form Donasi', 'Lengkapi informasi barang dan data diri dengan mudah.'],
              ['Konfirmasi', 'Periksa kembali detail donasi dan konfirmasi pengajuan.'],
              ['Tracking Donasi', 'Pantau proses donasi hingga sampai ke penerima.']
            ].map(([t, d], i) => (
              <article key={t} className={`reveal-on-scroll reveal-delay-${i + 1}`}>
                <b>{i + 1}</b>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="donatable reveal-on-scroll">
          <Heading
            className="reveal-on-scroll"
            eyebrow="Beri Kehidupan Kedua untuk Barangmu!"
            preAccent="Barang"
            title={<>yang Bisa<br />Anda Donasikan</>}
            sub="Barang apa saja yang bisa didonasikan melalui KEMBALI?"
          />
          <div className="item-grid">
            {items.map(([img, title, color], idx) => (
              <article key={title} className={`reveal-on-scroll reveal-delay-${idx + 1}`}>
                <div className={'art-blob ' + color}>
                  <img src={'/' + img} alt="" />
                </div>
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="partners reveal-on-scroll" id="komunitas">
          <Heading
            className="reveal-on-scroll"
            eyebrow="Berkenalan dengan Komunitas Kami"
            title="Partner Kami"
            sub="Kami bekerja sama dengan berbagai komunitas."
          />
          <PartnerGrid partners={partners} />
        </section>

        <div className="dark-band">
          <section className="final-cta reveal-on-scroll">
            <img src="/jumping-2194230-0.svg" alt="" className="reveal-on-scroll" />
            <div className="reveal-on-scroll reveal-delay-1">
              <span className="outline-pill">Melakukan Kebaikan untuk Bumi & Sesama</span>
              <h2>Mari Berdonasi & Jelajahi<br />Komunitas Kami!</h2>
              <p><strong>KEMBALI</strong> menghubungkan <strong>donatur</strong> dengan <strong>penerima manfaat</strong>, menyelamatkan barang layak pakai dari tempat sampah dan memberikan dampak nyata bagi lingkungan.</p>
              <div className="actions">
                <Link className="button primary" to="/donasi">Mulai Donasi Sekarang →</Link>
                <a className="button dark-outline" href="#steps">▶ &nbsp; Pelajari Lebih Lanjut</a>
              </div>
            </div>
            <img src="/order-delivered.svg" alt="" className="reveal-on-scroll reveal-delay-2" />
          </section>
        </div>

        <section className="faq reveal-on-scroll" id="faq">
          <Heading
            className="reveal-on-scroll"
            title="Frequently Asked Questions"
            sub="Pertanyaan yang sering ditanyakan"
          />
          <div className="faq-list">
            {faqs.map(([q, a], index) => {
              const isOpen = openFaq === index
              return (
                <article
                  key={q}
                  className={`faq-item reveal-on-scroll reveal-delay-${(index % 4) + 1} ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="faq-header">
                    <h3>{q}</h3>
                    <span className={`faq-icon ${isOpen ? 'is-active' : ''}`} aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </div>
                  <div className="faq-answer-wrapper">
                    <div className="faq-answer-inner">
                      <p className="faq-answer">{a}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}