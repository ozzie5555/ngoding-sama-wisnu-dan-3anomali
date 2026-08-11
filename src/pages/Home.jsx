import React, { useState } from 'react';
import './Home.css';

export default function Home() {
  // State for Article Carousel
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);

  // Article Dataset
  const articles = [
    {
      id: 1,
      category: 'Sampah & Daur Ulang',
      title: '5 Ide Daur Ulang Sampah',
      author: 'By - Anonymous',
      image: '/src/assets/images/article-01.png',
      link: '#',
    },
    {
      id: 2,
      category: 'Gaya Hidup',
      title: 'Tips Mengurangi Sampah Plastik',
      author: 'By - Tim KEMBALI',
      image: '/src/assets/images/article-01.png',
      link: '#',
    },
    {
      id: 3,
      category: 'Ekonomi Sirkular',
      title: 'Peluang Usaha dari Barang Bekas',
      author: 'By - Redaksi Eco',
      image: '/src/assets/images/article-01.png',
      link: '#',
    },
  ];

  // Static dataset for Services
  const services = [
    {
      id: 1,
      title: 'Donasi Online',
      action: 'Atur Sekarang →',
      image: '/src/assets/images/service-donation.png',
      alt: 'Layanan Donasi Online',
      bgClass: 'bg-lime-light',
      target: '#donasi',
    },
    {
      id: 2,
      title: 'Informasi & Wawasan',
      action: 'Mulai Melihat →',
      image: '/src/assets/images/service-information.png',
      alt: 'Informasi dan Wawasan',
      bgClass: 'bg-cyan-light',
      target: '#artikel',
    },
    {
      id: 3,
      title: 'Dokumentasi',
      action: 'Lihat Dokumentasi →',
      image: '/src/assets/images/service-documentation.png',
      alt: 'Dokumentasi Program',
      bgClass: 'bg-cyan-main',
      target: '#proses',
    },
    {
      id: 4,
      title: 'Komunitas',
      action: 'Lihat Komunitas →',
      image: '/src/assets/images/service-community.png',
      alt: 'Komunitas KEMBALI',
      bgClass: 'bg-cyan-main',
      target: '#partner',
    },
  ];

  // Static dataset for Testimonials
  const testimonialsRow1 = [
    {
      id: 1,
      name: 'Anisa Rahma',
      role: 'Donatur Aktif',
      text: 'Proses donasi pakaian bekas sangat mudah dan terarah. Senang bisa membantu sesama!',
    },
    {
      id: 2,
      name: 'Budi Santoso',
      role: 'Penggerak Lingkungan',
      text: 'Sangat menginspirasi. Barang yang tidak terpakai di rumah jadi bermanfaat lagi.',
    },
    {
      id: 3,
      name: 'Citra Dewi',
      role: 'Relawan Komunitas',
      text: 'Transparansi penyaluran barang sangat baik. Terima kasih KEMBALI!',
    },
    {
      id: 4,
      name: 'Deni Setiawan',
      role: 'Pengguna',
      text: 'Platform yang sangat dibutuhkan untuk mengurangi penumpukan sampah barang bekas.',
    },
  ];

  const testimonialsRow2 = [
    {
      id: 5,
      name: 'Eka Prasetya',
      role: 'Donatur',
      text: 'Sangat praktis, tim KEMBALI sangat membantu proses penjemputan barang.',
    },
    {
      id: 6,
      name: 'Fadhil Muhammad',
      role: 'Mitra Komunitas',
      text: 'Kolaborasi dengan KEMBALI memberikan dampak nyata bagi panti asuhan kami.',
    },
    {
      id: 7,
      name: 'Gita Gutawa',
      role: 'Pengguna',
      text: 'Barang-barang bekas berkualitas bisa menyebar ke tempat yang tepat.',
    },
    {
      id: 8,
      name: 'Hendra Wijaya',
      role: 'Penggerak Lingkungan',
      text: 'Langkah nyata mengurangi sampah dan menjaga ekosistem bumi kita.',
    },
  ];

  // Static dataset for Donatable Items
  const donationItems = [
    {
      id: 1,
      title: 'Barang Bekas',
      desc: 'Perabotan dan alat rumah tangga layak pakai.',
      image: '/src/assets/images/goods-items.png',
      blobClass: 'blob-lime',
    },
    {
      id: 2,
      title: 'Pakaian Layak',
      desc: 'Baju, celana, dan jaket bersih layak guna.',
      image: '/src/assets/images/goods-clothes.png',
      blobClass: 'blob-blue',
    },
    {
      id: 3,
      title: 'Buku & ATK Bekas',
      desc: 'Buku bacaan, buku pelajaran, dan alat tulis.',
      image: '/src/assets/images/goods-books.png',
      blobClass: 'blob-cyan',
    },
    {
      id: 4,
      title: 'Karya Daur Ulang',
      desc: 'Produk kreatif buatan tangan dari bahan bekas.',
      image: '/src/assets/images/goods-recycled.png',
      blobClass: 'blob-yellow',
    },
  ];

  // Static dataset for Partners
  const partners = [
    {
      id: 1,
      name: 'Sedekah',
      desc: 'Komunitas Berbagi Sesama',
      logo: '/src/assets/images/partner-01.png',
    },
    {
      id: 2,
      name: 'Diippo Waste Bank',
      desc: 'Bank Sampah Berbasis Warga',
      logo: '/src/assets/images/partner-02.png',
    },
    {
      id: 3,
      name: 'Panti Asuhan Al Jannah',
      desc: 'Mitra Penyaluran Manfaat',
      logo: '/src/assets/images/partner-03.png',
    },
    {
      id: 4,
      name: 'Panti Asuhan Kristen Tanah Putih',
      desc: 'Mitra Penyaluran Manfaat',
      logo: '/src/assets/images/partner-04.png',
    },
  ];

  // Carousel Handlers
  const handlePrevArticle = () => {
    setActiveArticleIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNextArticle = () => {
    setActiveArticleIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  // Smooth Scroll Helper
  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generic Interactive Handler
  const handleAction = (message) => {
    alert(message || 'Fitur sedang dalam pengembangan!');
  };

  const prevIndex = (activeArticleIndex - 1 + articles.length) % articles.length;
  const nextIndex = (activeArticleIndex + 1) % articles.length;

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="home-hero" id="beranda">
        <div className="home-hero-content">
          <div className="hero-left">
            <span className="pill-badge pill-badge-outline">
              Donasikan barang bekas & karya daur ulangmu!
            </span>
            <h1 className="hero-heading">
              Jangan Buang! <span className="text-normal">Beri Kesempatan Kedua untuk Barangmu!</span>
            </h1>
            <p className="hero-paragraph">
              KEMBALI menghubungkan donatur dan penerima manfaat, menjembatani barang layak pakai bekas di tempat sampah dan memberikan dampak nyata bagi lingkungan.
            </p>
            <div className="hero-cta-group">
              <button
                className="btn-primary"
                onClick={() => scrollToSection('#donasi')}
              >
                Mulai Donasi Sekarang →
              </button>
              <button
                className="btn-secondary"
                onClick={() => scrollToSection('#layanan')}
              >
                Mulai Jelajahi Kami
              </button>
            </div>
          </div>

          <div className="hero-right">
            <img
              src="/src/assets/images/hero.png"
              alt="Ilustrasi Utama KEMBALI"
              className="hero-image"
            />
          </div>
        </div>

        {/* Decorative Wave & Hill Landscape */}
        <div className="hero-landscape-decoration">
          <svg
            className="landscape-svg"
            viewBox="0 0 1440 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C320,120 420,20 720,70 C1020,120 1120,40 1440,80 L1440,180 L0,180 Z"
              fill="#DDF7F4"
            />
            <path
              d="M0,100 C360,30 500,130 800,80 C1100,30 1250,110 1440,90 L1440,180 L0,180 Z"
              fill="#DFFF8A"
            />
          </svg>
        </div>
      </section>

      {/* 2. STATISTICS / IMPACT SECTION */}
      <section className="home-stats-section" id="stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h2>12.400+</h2>
            <p>Barang Terkumpul</p>
          </div>
          <div className="stat-card">
            <h2>2.000 kg</h2>
            <p>Sampah Dikurangi</p>
          </div>
          <div className="stat-card">
            <h2>4.680 kg</h2>
            <p>CO2 Dihemat</p>
          </div>
          <div className="stat-card">
            <h2>1.500+</h2>
            <p>Pengguna Aktif</p>
          </div>
        </div>

        <div className="impact-statement">
          <h3>
            Dampak Positif <br />
            Untuk <span className="text-highlight">Bumi</span>
          </h3>
          <p>
            Kami mengurangi sampah, menghemat sumber daya, dan menciptakan dampak positif bagi bumi melalui penggunaan kembali barang layak pakai.
          </p>
        </div>
      </section>

      {/* 3. SEPUTAR KEMBALI ARTICLE SECTION */}
      <section className="home-articles-section" id="artikel">
        <div className="section-header center">
          <h2 className="section-title title-cyan">Seputar Tentang KEMBALI</h2>
          <p className="section-subtitle">
            Temukan berita terbaru, artikel inspiratif, tips gaya hidup berkelanjutan, serta berbagai informasi mengenai program dan dampak KEMBALI dalam membangun lingkungan yang lebih baik.
          </p>
        </div>

        <div className="article-carousel-wrapper">
          <button
            className="carousel-arrow arrow-left"
            onClick={handlePrevArticle}
            aria-label="Artikel Sebelumnya"
          >
            ‹
          </button>

          {/* Left Preview Card */}
          <div
            className="article-card card-side card-left"
            onClick={handlePrevArticle}
            role="button"
            tabIndex={0}
          >
            <span className="article-category">{articles[prevIndex].category}</span>
            <h4 className="article-side-title">{articles[prevIndex].title}</h4>
          </div>

          {/* Featured Center Card */}
          <div className="article-card card-center">
            <img
              src={articles[activeArticleIndex].image}
              alt={articles[activeArticleIndex].title}
              className="article-image"
            />
            <div className="article-body">
              <span className="article-category">{articles[activeArticleIndex].category}</span>
              <h3 className="article-title">{articles[activeArticleIndex].title}</h3>
              <p className="article-author">{articles[activeArticleIndex].author}</p>
              <button
                className="btn-visit"
                onClick={() => handleAction(`Membaca artikel: ${articles[activeArticleIndex].title}`)}
              >
                Visit Now
              </button>
            </div>
          </div>

          {/* Right Preview Card */}
          <div
            className="article-card card-side card-right"
            onClick={handleNextArticle}
            role="button"
            tabIndex={0}
          >
            <span className="article-category">{articles[nextIndex].category}</span>
            <h4 className="article-side-title">{articles[nextIndex].title}</h4>
            <button
              className="btn-visit-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(`Membaca artikel: ${articles[nextIndex].title}`);
              }}
            >
              Visit Now
            </button>
          </div>

          <button
            className="carousel-arrow arrow-right"
            onClick={handleNextArticle}
            aria-label="Artikel Selanjutnya"
          >
            ›
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-dots">
          {articles.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === activeArticleIndex ? 'active' : ''}`}
              onClick={() => setActiveArticleIndex(idx)}
              role="button"
              tabIndex={0}
            ></span>
          ))}
        </div>
      </section>

      {/* 4. LAYANAN UNTUK ANDA SECTION */}
      <section className="home-services-section" id="layanan">
        <div className="section-header center">
          <span className="pill-badge pill-badge-lime">Kami Menyediakan yang Anda Butuhkan</span>
          <h2 className="section-title">
            Layanan untuk <span className="text-highlight">Anda</span>
          </h2>
          <p className="section-subtitle">
            Kami Selalu Menyediakan Layanan yang Terbaik
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card"
              onClick={() => scrollToSection(service.target)}
              role="button"
              tabIndex={0}
            >
              <div className={`service-image-container ${service.bgClass}`}>
                <img
                  src={service.image}
                  alt={service.alt}
                  className="service-image"
                />
              </div>
              <div className="service-content">
                <h4>{service.title}</h4>
                <button
                  className="btn-service-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToSection(service.target);
                  }}
                >
                  {service.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ULASAN PENGGUNA SECTION */}
      <section className="home-testimonials-section" id="ulasan">
        <div className="section-header center">
          <span className="pill-badge pill-badge-lime">
            Segala Masukan Sangat Berarti untuk Kami
          </span>
          <h2 className="section-title">
            Ulasan <span className="text-highlight">Pengguna</span>
          </h2>
          <p className="section-subtitle">Bersama Menciptakan Perubahan</p>
        </div>

        <div className="testimonials-two-rows">
          <div className="testimonials-row row-stagger-1">
            {testimonialsRow1.map((item) => (
              <div
                key={item.id}
                className="testimonial-card"
                onClick={() => handleAction(`Ulasan dari ${item.name}`)}
                role="button"
                tabIndex={0}
              >
                <div className="testimonial-header">
                  <div className="avatar-placeholder">{item.name.charAt(0)}</div>
                  <div>
                    <h4 className="testimonial-name">{item.name}</h4>
                    <span className="testimonial-role">{item.role}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{item.text}"</p>
              </div>
            ))}
          </div>

          <div className="testimonials-row row-stagger-2">
            {testimonialsRow2.map((item) => (
              <div
                key={item.id}
                className="testimonial-card"
                onClick={() => handleAction(`Ulasan dari ${item.name}`)}
                role="button"
                tabIndex={0}
              >
                <div className="testimonial-header">
                  <div className="avatar-placeholder">{item.name.charAt(0)}</div>
                  <div>
                    <h4 className="testimonial-name">{item.name}</h4>
                    <span className="testimonial-role">{item.role}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BAGAIMANA CARA BERDONASI? SECTION */}
      <section className="home-process-section" id="proses">
        <div className="process-header">
          <h2 className="process-title">
            Bagaimana Cara <br />
            <span className="text-highlight">Berdonasi?</span>
          </h2>
          <p className="process-subtitle">
            Ikuti langkah-langkah berikut untuk melakukan donasi online melalui KEMBALI.
          </p>
        </div>

        <div className="process-steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-body">
              <h4>Daftar / Masuk</h4>
              <p>Buat akun KEMBALI atau masuk menggunakan akun terdaftar.</p>
            </div>
          </div>
          <div className="step-arrow">›</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-body">
              <h4>Pilih Barang</h4>
              <p>Pilih kategori barang layak pakai yang ingin disalurkan.</p>
            </div>
          </div>
          <div className="step-arrow">›</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-body">
              <h4>Konfirmasi</h4>
              <p>Isi detail pengiriman dan konfirmasikan jadwal donasi.</p>
            </div>
          </div>
          <div className="step-arrow">›</div>

          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-body">
              <h4>Siap Disalurkan</h4>
              <p>Barang dijemput/dikirim dan diteruskan ke penerima manfaat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BARANG YANG BISA ANDA DONASIKAN */}
      <section className="home-donation-items-section" id="donasi">
        <div className="section-header center">
          <span className="pill-badge pill-badge-lime">Beri Kehidupan Kedua untuk Barangmu!</span>
          <h2 className="section-title">
            Barang yang Bisa <br />
            Anda Donasikan
          </h2>
          <p className="section-subtitle">
            Barang apa saja yang bisa disalurkan melalui KEMBALI.
          </p>
        </div>

        <div className="donation-items-grid">
          {donationItems.map((item) => (
            <div
              key={item.id}
              className="donation-item-card"
              onClick={() => handleAction(`Pilih kategori donasi: ${item.title}`)}
              role="button"
              tabIndex={0}
            >
              <div className={`donation-item-img-wrapper ${item.blobClass}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="donation-item-image"
                />
              </div>
              <h3 className="donation-item-title">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PARTNER KAMI SECTION */}
      <section className="home-partners-section" id="partner">
        <div className="section-header center">
          <span className="pill-badge pill-badge-lime">Berkenalan dengan Komunitas Kami</span>
          <h2 className="section-title">Partner Kami</h2>
          <p className="section-subtitle">
            Kami bekerja sama dengan berbagai komunitas.
          </p>
        </div>

        <div className="partners-grid">
          {partners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <div className="partner-logo-wrapper">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-logo"
                />
              </div>
              <h4 className="partner-name">{partner.name}</h4>
              <p className="partner-desc">{partner.desc}</p>
              <button
                className="partner-link-btn"
                onClick={() => handleAction(`Informasi detail mitra: ${partner.name}`)}
              >
                Selengkapnya ›
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="home-final-cta-section" id="cta">
        <div className="cta-decorative-wrapper">
          <img
            src="/src/assets/images/cta-left-illustration.png"
            alt="Ilustrasi Kiri"
            className="cta-decor cta-decor-left"
          />

          <div className="cta-center-content">
            <span className="pill-badge pill-badge-transparent">
              Melakukan Kebaikan untuk Bumi & Sesama
            </span>
            <h2 className="cta-heading">
              Mari Berdonasi & Jelajahi <br />
              Komunitas Kami!
            </h2>
            <p className="cta-paragraph">
              KEMBALI menghubungkan donatur, komunitas, dan penerima manfaat sambil mengurangi sampah serta memberikan dampak nyata bagi bumi.
            </p>

            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => handleAction('Membuka formulir donasi utama...')}
              >
                Mulai Donasi Sekarang →
              </button>
              <button
                className="btn-secondary-light"
                onClick={() => scrollToSection('#proses')}
              >
                🔍 Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          <img
            src="/src/assets/images/cta-right-illustration.png"
            alt="Ilustrasi Kanan"
            className="cta-decor cta-decor-right"
          />
        </div>

        {/* Lower Impact Summary Box */}
        <div className="cta-impact-box">
          <div className="cta-impact-text">
            <h4>Bisa Memberikan Efek Bagi Berdasarkan Kebutuhanmu?</h4>
            <p>
              Setiap barang bekas yang disalurkan membantu mereka yang membutuhkan sekaligus mengurangi dampak lingkungan.
            </p>
          </div>
          <div className="cta-impact-stats">
            <div className="stat-item">
              <strong>12.400+</strong> <span>Barang Terkumpul</span>
            </div>
            <div className="stat-item">
              <strong>2.000 kg</strong> <span>Sampah Dikurangi</span>
            </div>
            <div className="stat-item">
              <strong>4.680 kg</strong> <span>CO2 Dihemat</span>
            </div>
            <div className="stat-item">
              <strong>1.500+</strong> <span>Pengguna Aktif</span>
            </div>
          </div>
          <div className="cta-impact-img-container">
            <img
              src="/src/assets/images/cta-impact-illustration.png"
              alt="Dampak KEMBALI"
              className="cta-impact-img"
            />
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="home-footer">
        <div className="footer-container">
          {/* Column 1: Logo & Description */}
          <div className="footer-col col-brand">
            <div className="footer-logo">
              <img src="/src/assets/images/footer-logo.png" alt="KEMBALI Logo" />
            </div>
            <p className="footer-description">
              Platform pengelolaan donasi barang bekas dan karya daur ulang untuk menciptakan lingkungan berkelanjutan.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.67 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.31 1.54-1.28 2.53.02 1.02.61 1.96 1.53 2.38.92.42 2.05.32 2.87-.27.7-.5 1.16-1.3 1.19-2.16.05-3.83.02-7.66.03-11.49z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136c-1.871-.501-9.376-.501-9.376-.501s-7.505 0-9.377.501a3.016 3.016 0 0 0-2.122 2.136c-.5 1.871-.5 5.76-.5 5.76s0 3.889.5 5.76a3.016 3.016 0 0 0 2.122 2.136c1.871.501 9.376.501 9.376.501s7.505 0 9.377-.501a3.016 3.016 0 0 0 2.122-2.136c.5-1.871.5-5.76.5-5.76s0-3.889-.5-5.76zm-13.498 9.182v-6.736l6.288 3.368-6.288 3.368z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigasi Utama */}
          <div className="footer-col">
            <h4 className="footer-title">Navigasi Utama</h4>
            <ul className="footer-links">
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#layanan">Tentang Kami</a></li>
              <li><a href="#layanan">Layanan</a></li>
              <li><a href="#partner">Komunitas</a></li>
            </ul>
          </div>

          {/* Column 3: Berbagai & Lainnya */}
          <div className="footer-col">
            <h4 className="footer-title">Berbagai & Lainnya</h4>
            <ul className="footer-links">
              <li><a href="#artikel">Tentang KEMBALI</a></li>
              <li><a href="#donasi">Program</a></li>
              <li><a href="#proses">Dokumentasi</a></li>
              <li><a href="#proses">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col col-newsletter">
            <h4 className="footer-title">Newsletter</h4>
            <p className="newsletter-text">
              Dapatkan pembaruan terkini mengenai program dan inspirasi daur ulang.
            </p>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleAction('Terima kasih telah berlangganan Newsletter KEMBALI!');
              }}
            >
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn-newsletter">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 KEMBALI. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}