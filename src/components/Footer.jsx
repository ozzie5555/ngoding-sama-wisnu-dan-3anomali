import { Link } from 'react-router'
import './Footer.css'
export default function Footer(){return <footer className="site-footer"><div className="footer-grid">
  <div className="footer-brand"><Link to="/" className="brand"><img src="/logo.svg" alt="" /><span>KEMBALI</span></Link><p>Platform donasi barang layak pakai untuk mengurangi limbah dan memberikan dampak sosial berkelanjutan.</p><div className="socials"><a href="#instagram" aria-label="Instagram"><img src="/ri_instagram-fill.svg" alt="" /></a><a href="#tiktok" aria-label="TikTok"><img src="/ic_baseline-tiktok.svg" alt="" /></a><a href="#x" aria-label="X"><img src="/devicon_twitter.svg" alt="" /></a><a href="#youtube" aria-label="YouTube"><img src="/selfhst_youtube-dark.svg" alt="" /></a></div></div>
  <div><h3>Navigasi Utama</h3><Link to="/">Beranda</Link><Link to="/donasi">Donasi</Link><Link to="/insight">Insight</Link><Link to="/komunitas">Komunitas</Link></div>
  <div><h3>Bantuan & Legal</h3><a href="#faq">Pusat Bantuan / FAQ</a><a href="#terms">Syarat & Ketentuan</a><a href="#privacy">Kebijakan Privasi</a><a href="#guide">Panduan Keamanan Donasi</a></div>
  <div><h3>Newsletter</h3><p>Dapatkan update kegiatan dan informasi terbaru dari KEMBALI.</p><form onSubmit={e=>e.preventDefault()}><input type="email" aria-label="Email" placeholder="Masukkan email kamu" required/><button>Berlangganan</button></form></div>
</div><p className="copyright">© 2026 KEMBALI. Seluruh hak cipta dilindungi.</p></footer>}
