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
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram KEMBALI"
                className="social-link"
              >
                <img src="/ri_instagram-fill.svg" alt="" aria-hidden="true" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok KEMBALI"
                className="social-link"
              >
                <img src="/ic_baseline-tiktok.svg" alt="" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter KEMBALI"
                className="social-link"
              >
                <img src="/devicon_twitter.svg" alt="" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
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

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h3 className="footer-col-title">Newsletter</h3>
            <p className="newsletter-desc">
              Dapatkan update kegiatan dan informasi terbaru dari KEMBALI.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <span>✓ Terima kasih telah berlangganan!</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  aria-label="Alamat email untuk newsletter"
                  placeholder="Masukkan email kamu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Berlangganan</button>
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
