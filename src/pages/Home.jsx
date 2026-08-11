import React from "react";
import "./Home.css";

const statsData = [
  { value: "12.400+", label: "Barang Terkumpul" },
  { value: "2.000 kg", label: "Sampah Dikurangi" },
  { value: "4.680 kg", label: "CO2 Dihemat" },
  { value: "1.500+", label: "Pengguna Aktif" },
];

const servicesData = [
  {
    title: "Donasi Online",
    image: "/src/assets/images/service-donation.png",
    cta: "Atur Sekarang",
    bgClass: "bg-yellow",
  },
  {
    title: "Informasi & Wawasan",
    image: "/src/assets/images/service-information.png",
    cta: "Pelajari Lebih Lanjut",
    bgClass: "bg-light-blue",
  },
  {
    title: "Dokumentasi",
    image: "/src/assets/images/service-documentation.png",
    cta: "Lihat Sekarang",
    bgClass: "bg-teal",
  },
  {
    title: "Komunitas",
    image: "/src/assets/images/service-community.png",
    cta: "Lihat Komunitas",
    bgClass: "bg-light-cyan",
  },
];

const testimonialsRow1 = [
  {
    name: "Anisa Rahma",
    role: "Donatur Aktif",
    text: "Proses donasi pakaian bekas sangat mudah dan terarah. Senang bisa membantu sesama!",
  },
  {
    name: "Budi Santoso",
    role: "Penggerak Lingkungan",
    text: "Sangat menginspirasi. Barang yang tidak terpakai di rumah jadi bermanfaat lagi.",
  },
  {
    name: "Citra Dewi",
    role: "Relawan Komunitas",
    text: "Transparansi penyaluran barang sangat baik. Terima kasih KEMBALI!",
  },
  {
    name: "Deni Setiawan",
    role: "Pengguna",
    text: "Platform yang sangat dibutuhkan untuk mengurangi penumpukan sampah barang bekas.",
  },
];

const testimonialsRow2 = [
  {
    name: "Eka Putri",
    role: "Donatur",
    text: "Penyaluran sangat tepat sasaran kepada yang membutuhkan.",
  },
  {
    name: "Fajar Nugraha",
    role: "Penggiat Daur Ulang",
    text: "Inisiatif luar biasa untuk mendukung ekonomi sirkular.",
  },
  {
    name: "Gita Savitri",
    role: "Pengguna Aktif",
    text: "Sangat cepat dan responsif layanannya!",
  },
  {
    name: "Hendra Wijaya",
    role: "Mitra Komunitas",
    text: "Sangat membantu program penyaluran bantuan kami.",
  },
];

const processSteps = [
  {
    step: "1",
    title: "Daftar / Masuk",
    desc: "Buat akun KEMBALI atau masuk menggunakan akun terdaftar.",
  },
  {
    step: "2",
    title: "Pilih Barang",
    desc: "Pilih kategori barang layak pakai yang ingin didonasikan.",
  },
  {
    step: "3",
    title: "Konfirmasi",
    desc: "Isi formulir pengiriman dan konfirmasikan jadwal donasi.",
  },
  {
    step: "4",
    title: "Siap Disalurkan",
    desc: "Barang dijemput/dikirim dan disalurkan ke penerima manfaat.",
  },
];

const donationItemsData = [
  {
    title: "Barang Bekas",
    desc: "Perabotan dan alat rumah tangga layak pakai.",
    image: "/src/assets/images/donation-item-01.png",
    colorClass: "blob-lime",
  },
  {
    title: "Pakaian Layak",
    desc: "Baju, celana, dan jaket bersih layak guna.",
    image: "/src/assets/images/donation-item-02.png",
    colorClass: "blob-cyan",
  },
  {
    title: "Buku & ATK Bekas",
    desc: "Buku bacaan, buku pelajaran, dan alat tulis.",
    image: "/src/assets/images/donation-item-03.png",
    colorClass: "blob-teal",
  },
  {
    title: "Karya Daur Ulang",
    desc: "Produk kreatif buatan tangan dari bahan bekas.",
    image: "/src/assets/images/donation-item-04.png",
    colorClass: "blob-olive",
  },
];

const partnersData = [
  {
    name: "Sedekah",
    desc: "Organisasi Berbagi Sembako",
    logo: "/src/assets/images/partner-01.png",
  },
  {
    name: "Dijppo Waste Bank",
    desc: "Bank Sampah Berbasis Warga",
    logo: "/src/assets/images/partner-02.png",
  },
  {
    name: "Panti Asuhan Al Jannah",
    desc: "Mitra Penyaluran Manfaat",
    logo: "/src/assets/images/partner-03.png",
  },
  {
    name: "Panti Asuhan Kristen Tanah Putih",
    desc: "Mitra Penyaluran Manfaat",
    logo: "/src/assets/images/partner-04.png",
  },
];

export default function Home() {
  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="home-hero">
        <div className="home-wrapper hero-grid">
          <div className="hero-content">
            <span className="pill-badge">
              Donasikan Barang Bekas & Karya Daur Ulang!
            </span>
            <h1 className="hero-title">
              Jangan Buang! <br />
              Beri Kesempatan Kedua untuk Barangmu!
            </h1>
            <p className="hero-description">
              KEMBALI menghubungkan donatur dan penerima manfaat, menjembatani
              barang layak pakai bekas di tempat sampah dan memberikan dampak
              nyata bagi lingkungan.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary">Mulai Donasi Sekarang</button>
              <button className="btn-secondary">Mulai Jelajahi Kami</button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img
              src="/src/assets/images/hero.png"
              alt="Ilustrasi Utama KEMBALI"
              className="hero-image"
            />
          </div>
        </div>

        {/* 2. DECORATIVE LANDSCAPE TRANSITION */}
        <div className="hero-landscape">
          <svg
            className="landscape-svg"
            viewBox="0 0 1440 180"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 90C280 50 520 40 720 70C960 100 1200 60 1440 75V180H0V90Z"
              fill="#DDF7F4"
            />
            <path
              d="M0 110C320 60 640 125 1040 85C1240 65 1360 90 1440 100V180H0V110Z"
              fill="#DFFF8A"
            />
          </svg>
        </div>
      </section>

      {/* 3. STATISTICS SECTION */}
      <section className="home-stats-section">
        <div className="home-wrapper">
          <div className="stats-grid">
            {statsData.map((stat, idx) => (
              <div key={idx} className="stats-card">
                <h3 className="stats-number">{stat.value}</h3>
                <p className="stats-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. IMPACT TEXT SECTION */}
      <section className="home-impact-section">
        <div className="home-wrapper impact-grid">
          <div className="impact-left">
            <h2>
              Dampak Positif <br />
              <span className="text-cyan">Untuk Bumi</span>
            </h2>
          </div>
          <div className="impact-right">
            <p>
              Kami mengurangi sampah, menghemat sumber daya alam, menciptakan
              dampak positif bagi bumi melalui penggunaan kembali barang layak
              pakai.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ARTICLE SECTION (LIME GREEN) */}
      <section className="home-article-section">
        <div className="home-wrapper">
          <h2 className="article-heading">Seputar Tentang KEMBALI</h2>
          <p className="article-subheading">
            Temukan berita, inspirasi, artikel interaktif, dan cara berpartisipasi
            aktif menjaga lingkungan lewat wawasan berkelanjutan dan gerakan ramah lingkungan.
          </p>

          <div className="article-carousel-wrapper">
            <button className="carousel-nav nav-prev" aria-label="Previous">
              &#8249;
            </button>

            <div className="article-carousel">
              <div className="article-card card-side">
                <div className="article-image-box">
                  <img src="/src/assets/images/article-01.png" alt="Tips Mengurangi Sampah Plastik" />
                </div>
                <div className="article-content">
                  <span className="article-tag">TIPS & TRICK</span>
                  <h3>Tips Mengurangi Sampah Plastik</h3>
                </div>
              </div>

              <div className="article-card card-center">
                <div className="article-image-box">
                  <img src="/src/assets/images/article-02.png" alt="5 Ide Daur Ulang Sampah" />
                </div>
                <div className="article-content">
                  <span className="article-tag">EDU KASI</span>
                  <h3>5 Ide Daur Ulang Sampah</h3>
                  <p className="article-author">By Admin KEMBALI</p>
                  <button className="btn-article">Visit Now</button>
                </div>
              </div>

              <div className="article-card card-side">
                <div className="article-image-box">
                  <img src="/src/assets/images/article-03.png" alt="Berita Ekonomi Sirkular" />
                </div>
                <div className="article-content">
                  <span className="article-tag">EKONOMI</span>
                  <h3>Berita Ekonomi Sirkular</h3>
                </div>
              </div>
            </div>

            <button className="carousel-nav nav-next" aria-label="Next">
              &#8250;
            </button>
          </div>

          <div className="carousel-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
        </div>
      </section>

      {/* 6. SERVICES SECTION */}
      <section className="home-services-section">
        <div className="home-wrapper text-center">
          <span className="pill-badge-lime">
            Kami Menyediakan yang Anda Butuhkan
          </span>
          <h2 className="section-title">Layanan untuk Anda</h2>
          <p className="section-subtitle">
            Kami Selalu Menyediakan Layanan yang Terbaik
          </p>

          <div className="services-grid">
            {servicesData.map((svc, idx) => (
              <div key={idx} className="service-card">
                <div className={`service-illustration ${svc.bgClass}`}>
                  <img src={svc.image} alt={svc.title} />
                </div>
                <h3 className="service-title">{svc.title}</h3>
                <button className="btn-service-pill">{svc.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIAL SECTION */}
      <section className="home-testimonial-section">
        <div className="text-center">
          <span className="pill-badge-lime">
            Segala Masukan Sangat Berarti untuk Kami
          </span>
          <h2 className="section-title">Ulasan Pengguna</h2>
          <p className="section-subtitle">Bersama Menciptakan Perubahan</p>
        </div>

        <div className="testimonial-rows">
          <div className="testimonial-track track-1">
            {testimonialsRow1.map((item, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-user">
                  <div className="user-avatar">
                    <div className="avatar-placeholder"></div>
                  </div>
                  <div>
                    <h4 className="user-name">{item.name}</h4>
                    <span className="user-role">{item.role}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{item.text}"</p>
              </div>
            ))}
          </div>

          <div className="testimonial-track track-2">
            {testimonialsRow2.map((item, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-user">
                  <div className="user-avatar">
                    <div className="avatar-placeholder"></div>
                  </div>
                  <div>
                    <h4 className="user-name">{item.name}</h4>
                    <span className="user-role">{item.role}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DONATION PROCESS SECTION (DARK NAVY) */}
      <section className="home-process-section">
        <div className="home-wrapper">
          <div className="process-header">
            <h2>Bagaimana Cara Berdonasi?</h2>
            <p>
              Ikuti langkah-langkah berikut untuk melakukan donasi online melalui
              KEMBALI.
            </p>
          </div>

          <div className="process-steps-grid">
            {processSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="process-step-item">
                  <div className="step-badge">{step.step}</div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>
                {idx < processSteps.length - 1 && (
                  <div className="step-arrow">&gt;</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 9. DONATION ITEMS SECTION */}
      <section className="home-donation-items-section">
        <div className="home-wrapper text-center">
          <span className="pill-badge-lime">
            Beri Kehidupan Kedua untuk Barangmu!
          </span>
          <h2 className="section-title">Barang yang Bisa Anda Donasikan</h2>
          <p className="section-subtitle">
            Berikan ruang bagi barang yang tidak digunakan melalui KEMBALI.
          </p>

          <div className="donation-items-grid">
            {donationItemsData.map((item, idx) => (
              <div key={idx} className="donation-item-card">
                <div className={`item-illustration ${item.colorClass}`}>
                  <img src={item.image} alt={item.title} />
                </div>
                <h3 className="item-card-title">{item.title}</h3>
                <p className="item-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. PARTNERS SECTION */}
      <section className="home-partners-section">
        <div className="home-wrapper text-center">
          <span className="pill-badge-lime">
            Berkenalan Dengan Komunitas Kami
          </span>
          <h2 className="section-title">Partner Kami</h2>
          <p className="section-subtitle">Kami bekerja sama dengan berbagai komunitas</p>

          <div className="partners-grid">
            {partnersData.map((partner, idx) => (
              <div key={idx} className="partner-card">
                <div className="partner-logo-box">
                  <img src={partner.logo} alt={partner.name} />
                </div>
                <h4 className="partner-name">{partner.name}</h4>
                <p className="partner-desc">{partner.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL DARK CTA SECTION */}
      <section className="home-final-cta-section">
        <div className="home-wrapper">
          <div className="cta-container">
            <div className="cta-top-grid">
              <div className="cta-illustration left">
                <img src="/src/assets/images/cta-left.png" alt="Ilustrasi Kiri" />
              </div>

              <div className="cta-content">
                <span className="pill-badge-dark">
                  Melakukan Kebaikan untuk Bumi &amp; Sesama
                </span>
                <h2 className="cta-title">
                  Mari Berdonasi &amp; Jelajahi Komunitas Kami!
                </h2>
                <p className="cta-desc">
                  KEMBALI menghubungkan donatur, komunitas, dan penerima manfaat
                  sambil mengurangi sampah serta memberikan dampak nyata bagi bumi.
                </p>
                <div className="cta-buttons">
                  <button className="btn-primary">Mulai Donasi Sekarang</button>
                  <button className="btn-outline-white">
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>

              <div className="cta-illustration right">
                <img src="/src/assets/images/cta-right.png" alt="Ilustrasi Kanan" />
              </div>
            </div>

            {/* MINI STATISTICS INSIDE FINAL CTA */}
            <div className="cta-mini-stats-block">
              <div className="mini-stats-left">
                <h3>Bisa Memberikan Efek Bagi Berdasarkan Kebutuhanmu?</h3>
                <p>
                  Setiap barang bekas yang didonasikan membantu mereka yang
                  membutuhkan sekaligus mengurangi dampak lingkungan.
                </p>
              </div>
              <div className="mini-stats-right">
                <div className="mini-stat-item">
                  <h4>12.400+</h4>
                  <span>Barang Terkumpul</span>
                </div>
                <div className="mini-stat-item">
                  <h4>2.000 kg</h4>
                  <span>Sampah Dikurangi</span>
                </div>
                <div className="mini-stat-item">
                  <h4>4.680 kg</h4>
                  <span>CO2 Dihemat</span>
                </div>
                <div className="mini-stat-item">
                  <h4>1.500+</h4>
                  <span>Pengguna Aktif</span>
                </div>
                <div className="mini-stat-image">
                  <img src="/src/assets/images/cta-footer-group.png" alt="Komunitas KEMBALI" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER SECTION */}
      <footer className="home-footer">
        <div className="home-wrapper footer-grid">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="logo-icon">&#10047;</span>
              <span className="logo-text">KEMBALI</span>
            </div>
            <p className="footer-desc">
              Platform daur ulang &amp; donasi barang bekas layak pakai untuk
              bumi yang lebih baik dan keberlanjutan.
            </p>
            <div className="social-links">
              <a href="#instagram" aria-label="Instagram">IG</a>
              <a href="#tiktok" aria-label="TikTok">TK</a>
              <a href="#x" aria-label="X">X</a>
              <a href="#youtube" aria-label="YouTube">YT</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigasi Utama</h4>
            <ul>
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#donasi">Donasi</a></li>
              <li><a href="#insight">Insight</a></li>
              <li><a href="#komunitas">Komunitas</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Berbagai &amp; Lainnya</h4>
            <ul>
              <li><a href="#tentang">Tentang KEMBALI</a></li>
              <li><a href="#program">Program</a></li>
              <li><a href="#syarat">Syarat &amp; Ketentuan</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col newsletter-col">
            <h4>Newsletter</h4>
            <p>Dapatkan pembaruan mengenai program dan kegiatan kami.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Masukkan email Anda" />
              <button className="btn-subscribe">Berlangganan</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} KEMBALI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}