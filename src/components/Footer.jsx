import { useState } from 'react'
import { Link } from 'react-router'
import './Footer.css'

const impactStats = [
  ['12.400+', 'Barang Tersirkulasi'],
  ['2.000 kg', 'Sampah Dikurangi'],
  ['4.680 kg', 'CO2 Dihemat'],
  ['1.500+', 'Pengguna Aktif'],
]

export default function Footer() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)

    try {
      const response = await fetch("https://formsubmit.co/ajax/kembalikebalik@gmail.com", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setSubmitted(true)
        e.target.reset()
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert("Gagal mengirim masukan. Coba lagi nanti.")
      }
    } catch {
      alert("Terjadi kesalahan jaringan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="donation-impact" aria-labelledby="footer-impact-title">
        <div>
          <h2 id="footer-impact-title">Siap Memberikan Kehidupan<br />Kedua untuk Barangmu?</h2>
          <p>Salurkan barang layak pakai ke komunitas yang membutuhkan hanya dalam beberapa langkah mudah.</p>
        </div>
        <div>
          {impactStats.map(([value, label]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <img src="/Donation Streamline Bruxelles.svg" alt="" aria-hidden="true" />
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <Link to="/" className="brand" aria-label="KEMBALI Beranda">
                <img src="/logo.svg" alt="KEMBALI" />
                <span>KEMBALI</span>
              </Link>
              <p className="footer-desc">
                Platform donasi barang layak pakai untuk mengurangi limbah dan memberikan dampak sosial berkelanjutan.
              </p>
              <div className="footer-socials" aria-label="Media Sosial KEMBALI">
                <a
                  href="https://www.instagram.com/kembalidonasi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram KEMBALI"
                  className="social-link"
                >
                  <img src="/ri_instagram-fill.svg" alt="" aria-hidden="true" />
                </a>
                <a
                  href="https://www.tiktok.com/@kembalidonasi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok KEMBALI"
                  className="social-link"
                >
                  <img src="/ic_baseline-tiktok.svg" alt="" aria-hidden="true" />
                </a>
                <a
                  href="https://x.com/kembalidonasi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter KEMBALI"
                  className="social-link"
                >
                  <img src="/devicon_twitter.svg" alt="" aria-hidden="true" />
                </a>
                <a
                  href="https://www.youtube.com/@kembalidonasi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube KEMBALI"
                  className="social-link"
                >
                  <img src="/selfhst_youtube-dark.svg" alt="" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="footer-nav-col">
              <h3 className="footer-col-title">Navigasi Utama</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/">Beranda</Link>
                </li>
                <li>
                  <Link to="/donasi">Donasi</Link>
                </li>
                <li>
                  <Link to="/insight">Insight</Link>
                </li>
                <li>
                  <Link to="/komunitas">Komunitas</Link>
                </li>
              </ul>
            </div>

            {/* Help & Legal */}
            <div className="footer-nav-col">
              <h3 className="footer-col-title">Bantuan &amp; Legal</h3>
              <ul className="footer-links">
                <li>
                  <a href="/#faq">Pusat Bantuan / FAQ</a>
                </li>
                <li>
                  <a href="#terms">Syarat &amp; Ketentuan</a>
                </li>
                <li>
                  <a href="#privacy">Kebijakan Privasi</a>
                </li>
                <li>
                  <a href="#guide">Panduan Keamanan Donasi</a>
                </li>
              </ul>
            </div>

            {/* Form Pengaduan */}
            <div className="footer-newsletter">
              <h3 className="footer-col-title">Pengaduan &amp; Masukan</h3>
              <p className="newsletter-desc">
                Punya keluhan, kendala donasi, atau masukan? Sampaikan kepada tim KEMBALI.
              </p>
              
              {submitted ? (
                <div className="newsletter-success">
                  ✓ Terima kasih! Pesan kamu berhasil terkirim.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="newsletter-form">
                  <input type="email" name="email" placeholder="Email kamu" required />
                  <textarea name="message" placeholder="Tuliskan masukan atau pengaduan kamu..." rows={3} required />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Mengirim...' : 'Kirim'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <p className="copyright">
              © 2026 KEMBALI. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
