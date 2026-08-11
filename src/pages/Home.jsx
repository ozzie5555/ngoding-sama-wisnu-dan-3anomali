import React, { useState } from 'react';
import './Home.css';

export default function Home() {
  // Static dataset for Testimonials (Rendered using .map())
  const testimonials = [
    {
      id: 1,
      name: 'Anisa Rahma',
      role: 'Donatur Aktif',
      avatar: '/assets/images/avatar-01.png',
      text: 'Proses donasi pakaian bekas sangat mudah dan terarah. Senang bisa membantu sesama!',
    },
    {
      id: 2,
      name: 'Budi Santoso',
      role: 'Penggerak Lingkungan',
      avatar: '/assets/images/avatar-02.png',
      text: 'Sangat menginspirasi. Barang yang tidak terpakai di rumah jadi bermanfaat lagi.',
    },
    {
      id: 3,
      name: 'Citra Dewi',
      role: 'Relawan Komunitas',
      avatar: '/assets/images/avatar-03.png',
      text: 'Transparansi penyaluran barang sangat baik. Terima kasih KEMBALI!',
    },
    {
      id: 4,
      name: 'Deni Setiawan',
      role: 'Pengguna',
      avatar: '/assets/images/avatar-04.png',
      text: 'Platform yang sangat dibutuhkan untuk mengurangi penumpukan sampah barang bekas.',
    },
  ];

  // Static dataset for Services
  const services = [
    {
      id: 1,
      title: 'Donasi Online',
      action: 'Atur Sekarang',
      image: '/assets/images/service-donation.png',
      alt: 'Layanan Donasi Online',
    },
    {
      id: 2,
      title: 'Informasi & Wawasan',
      action: 'Pelajari Lebih Lanjut',
      image: '/assets/images/service-information.png',
      alt: 'Informasi dan Wawasan',
    },
    {
      id: 3,
      title: 'Dokumentasi',
      action: 'Lihat Sekarang',
      image: '/assets/images/service-documentation.png',
      alt: 'Dokumentasi Program',
    },
    {
      id: 4,
      title: 'Komunitas',
      action: 'Lihat Komunitas',
      image: '/assets/images/service-community.png',
      alt: 'Komunitas KEMBALI',
    },
  ];

  // Static dataset for Donatable Items
  const donationItems = [
    {
      id: 1,
      title: 'Barang Bekas',
      desc: 'Perabotan dan alat rumah tangga layak pakai.',
      image: '/assets/images/goods-items.png',
    },
    {
      id: 2,
      title: 'Pakaian Layak',
      desc: 'Baju, celana, dan jaket bersih layak guna.',
      image: '/assets/images/goods-clothes.png',
    },
    {
      id: 3,
      title: 'Buku & ATK Bekas',
      desc: 'Buku bacaan, buku pelajaran, dan alat tulis.',
      image: '/assets/images/goods-books.png',
    },
    {
      id: 4,
      title: 'Karya Daur Ulang',
      desc: 'Produk kreatif buatan tangan dari bahan bekas.',
      image: '/assets/images/goods-recycled.png',
    },
  ];

  // Static dataset for Partners
  const partners = [
    {
      id: 1,
      name: 'Sedekah',
      desc: 'Komunitas Berbagi Sesama',
      logo: '/assets/images/partner-01.png',
    },
    {
      id: 2,
      name: 'Diippo Waste Bank',
      desc: 'Bank Sampah Berbasis Warga',
      logo: '/assets/images/partner-02.png',
    },
    {
      id: 3,
      name: 'Panti Asuhan Al Jannah',
      desc: 'Mitra Penyaluran Manfaat',
      logo: '/assets/images/partner-03.png',
    },
    {
      id: 4,
      name: 'Panti Asuhan Kristen Tanah Putih',
      desc: 'Mitra Penyaluran Manfaat',
      logo: '/assets/images/partner-04.png',
    },
  ];

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="hero-left">
            <span className="pill-badge">
              Donasikan Barang Bekas & Karya Daur Ulang!
            </span>
            <h1 className="hero-heading">
              Jangan Buang! Beri Kesempatan Kedua untuk Barangmu!
            </h1>
            <p className="hero-paragraph">
              KEMBALI menghubungkan donatur dan penerima manfaat, menjembatani
              barang layak pakai bekas di tempat sampah dan memberikan dampak
              nyata bagi lingkungan.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary">Mulai Donasi Sekarang</button>
              <button className="btn-secondary">Mulai Jelajahi Kami</button>
            </div>
          </div>

          <div className="hero-right">
            {/* IMAGE: Hero illustration — replace with my original asset */}
            <img
              src="/assets/images/hero-illustration.png"
              alt="Ilustrasi Utama KEMBALI"
              className="hero-image"
            />
          </div>
        </div>

        {/* Decorative Wave Shapes */}
        <div className="hero-wave-decoration">
          <div className="wave-shape wave-cyan"></div>
          <div className="wave-shape wave-lime"></div>
        </div>
      </section>

      {/* 2. STATISTICS / IMPACT SECTION */}
      <section className="home-stats-section">
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
            <span className="text-highlight">Untuk Bumi</span>
          </h3>
          <p>
            Kami mengurangi sampah, menghemat sumber daya, dan menciptakan
            dampak positif bagi bumi melalui penggunaan kembali barang layak
            pakai.
          </p>
        </div>
      </section>

      {/* 3. SEPUTAR KEMBALI ARTICLE SECTION */}
      <section className="home-articles-section">
        <div className="section-header center">
          <h2 className="section-title">Seputar Tentang KEMBALI</h2>
          <p className="section-subtitle">
            Temukan berita terbaru, artikel inspiratif, tips gaya hidup
            berkelanjutan, serta berbagai informasi mengenai program dan dampak
            KEMBALI dalam membangun lingkungan yang lebih baik.
          </p>
        </div>

        <div className="article-carousel-wrapper">
          {/* Left Preview Card */}
          <div className="article-card card-side card-left">
            <span className="article-category">Gaya Hidup</span>
            <h4>Tips Mengurangi Sampah Plastik</h4>
          </div>

          {/* Featured Center Card */}
          <div className="article-card card-center">
            {/* IMAGE: Featured Article — replace with my original asset */}
            <img
              src="/assets/images/article-01.png"
              alt="5 Ide Daur Ulang Sampah"
              className="article-image"
            />
            <div className="article-body">
              <span className="article-category">Sampah</span>
              <h3 className="article-title">5 Ide Daur Ulang Sampah</h3>
              <p className="article-author">By - Anonymous</p>
              <button className="btn-outline-sm">Visit Now</button>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="article-card card-side card-right">
            <span className="article-category">Ekonomi</span>
            <h4>Berita Ekonomi Sirkular</h4>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* 4. LAYANAN UNTUK ANDA SECTION */}
      <section className="home-services-section">
        <div className="section-header center">
          <span className="pill-badge">Kami Menyediakan yang Anda Butuhkan</span>
          <h2 className="section-title">Layanan untuk Anda</h2>
          <p className="section-subtitle">
            Kami Selalu Menyediakan Layanan yang Terbaik
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-image-container">
                {/* IMAGE: Service Card Illustration */}
                <img
                  src={service.image}
                  alt={service.alt}
                  className="service-image"
                />
              </div>
              <div className="service-content">
                <h4>{service.title}</h4>
                <button className="btn-service-action">{service.action}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ULASAN PENGGUNA SECTION */}
      <section className="home-testimonials-section">
        <div className="section-header center">
          <span className="pill-badge">
            Segala Masukan Sangat Berarti untuk Kami
          </span>
          <h2 className="section-title">Ulasan Pengguna</h2>
          <p className="section-subtitle">Bersama Menciptakan Perubahan</p>
        </div>

        <div className="testimonials-scroll-container">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="testimonial-header">
                {/* IMAGE: Avatar placeholder */}
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="testimonial-avatar"
                  onError={(e) => {
                    // Fallback visual if avatar file doesn't exist yet
                    e.target.src =
                      'https://via.placeholder.com/50x50/32B8C6/FFFFFF?text=User';
                  }}
                />
                <div>
                  <h4 className="testimonial-name">{item.name}</h4>
                  <span className="testimonial-role">{item.role}</span>
                </div>
              </div>
              <p className="testimonial-text">"{item.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BAGAIMANA CARA BERDONASI? SECTION */}
      <section className="home-process-section">
        <div className="process-header">
          <h2 className="process-title">
            Bagaimana Cara <br />
            Berdonasi?
          </h2>
          <p className="process-subtitle">
            Ikuti langkah-langkah berikut untuk melakukan donasi online melalui
            KEMBALI.
          </p>
        </div>

        <div className="process-steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Daftar / Masuk</h4>
            <p>Buat akun KEMBALI atau masuk menggunakan akun terdaftar.</p>
          </div>
          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Pilih Barang</h4>
            <p>Pilih kategori barang layak pakai yang ingin disalurkan.</p>
          </div>
          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Konfirmasi</h4>
            <p>Isi detail pengiriman dan konfirmasikan jadwal donasi.</p>
          </div>
          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Siap Disalurkan</h4>
            <p>Barang dijemput/dikirim dan diteruskan ke penerima manfaat.</p>
          </div>
        </div>
      </section>

      {/* 7. BARANG YANG BISA ANDA DONASIKAN */}
      <section className="home-donation-items-section">
        <div className="section-header center">
          <span className="pill-badge">Beri Kehidupan Kedua untuk Barangmu!</span>
          <h2 className="section-title">
            Barang yang Bisa <br />
            Anda Donasikan
          </h2>
          <p className="section-subtitle">
            Berikan ruang bagi barang yang tidak digunakan melalui KEMBALI.
          </p>
        </div>

        <div className="donation-items-grid">
          {donationItems.map((item) => (
            <div key={item.id} className="donation-item-card">
              <div className="donation-item-img-wrapper">
                {/* IMAGE: Donation Item Category Illustration */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="donation-item-image"
                />
              </div>
              <h3 className="donation-item-title">{item.title}</h3>
              <p className="donation-item-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PARTNER KAMI SECTION */}
      <section className="home-partners-section">
        <div className="section-header center">
          <span className="pill-badge">Berkenalan dengan Komunitas Kami</span>
          <h2 className="section-title">Partner Kami</h2>
          <p className="section-subtitle">
            Kami bekerja sama dengan berbagai komunitas.
          </p>
        </div>

        <div className="partners-grid">
          {partners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <div className="partner-logo-wrapper">
                {/* IMAGE: Partner Logo — replace with my original asset */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-logo"
                />
              </div>
              <h4 className="partner-name">{partner.name}</h4>
              <p className="partner-desc">{partner.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA / COMMUNITY SECTION */}
      <section className="home-final-cta-section">
        <div className="cta-decorative-wrapper">
          {/* IMAGE: CTA Left Illustration */}
          <img
            src="/assets/images/cta-left-illustration.png"
            alt="Ilustrasi Kiri"
            className="cta-decor cta-decor-left"
          />

          <div className="cta-center-content">
            <span className="pill-badge pill-badge-dark">
              Melakukan Kebaikan untuk Bumi & Sesama
            </span>
            <h2 className="cta-heading">
              Mari Berdonasi & Jelajahi <br />
              Komunitas Kami!
            </h2>
            <p className="cta-paragraph">
              KEMBALI menghubungkan donatur, komunitas, dan penerima manfaat
              sambil mengurangi sampah serta memberikan dampak nyata bagi bumi.
            </p>

            <div className="cta-buttons">
              <button className="btn-primary">Mulai Donasi Sekarang</button>
              <button className="btn-secondary-light">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          {/* IMAGE: CTA Right Illustration */}
          <img
            src="/assets/images/cta-right-illustration.png"
            alt="Ilustrasi Kanan"
            className="cta-decor cta-decor-right"
          />
        </div>

        {/* Lower Impact Summary Box */}
        <div className="cta-impact-box">
          <div className="cta-impact-text">
            <h4>Bisa Memberikan Efek Bagi Berdasarkan Kebutuhanmu?</h4>
            <p>
              Setiap barang bekas yang disalurkan membantu mereka yang
              membutuhkan sekaligus mengurangi dampak lingkungan.
            </p>
          </div>
          <div className="cta-impact-stats">
            <div>
              <strong>12.400+</strong> <span>Barang Terkumpul</span>
            </div>
            <div>
              <strong>2.000 kg</strong> <span>Sampah Dikurangi</span>
            </div>
            <div>
              <strong>4.680 kg</strong> <span>CO2 Dihemat</span>
            </div>
            <div>
              <strong>1.500+</strong> <span>Pengguna Aktif</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="home-footer">
        <div className="footer-container">
          {/* Column 1: Logo & Description */}
          <div className="footer-col col-brand">
            {/* REPLACE WITH MY ORIGINAL KEMBALI LOGO */}
            <div className="footer-logo">
              <img src="/assets/images/footer-logo.png" alt="KEMBALI Logo" />
            </div>
            <p className="footer-description">
              Platform pengelolaan donasi barang bekas dan karya daur ulang
              untuk menciptakan lingkungan berkelanjutan.
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
              <li><a href="#tentang">Tentang Kami</a></li>
              <li><a href="#layanan">Layanan</a></li>
              <li><a href="#komunitas">Komunitas</a></li>
            </ul>
          </div>

          {/* Column 3: Berbagai & Lainnya */}
          <div className="footer-col">
            <h4 className="footer-title">Berbagai & Lainnya</h4>
            <ul className="footer-links">
              <li><a href="#tentang-kembali">Tentang KEMBALI</a></li>
              <li><a href="#program">Program</a></li>
              <li><a href="#dokumentasi">Dokumentasi</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col col-newsletter">
            <h4 className="footer-title">Newsletter</h4>
            <p className="newsletter-text">
              Dapatkan pembaruan terkini mengenai program dan inspirasi daur ulang.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="newsletter-input"
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