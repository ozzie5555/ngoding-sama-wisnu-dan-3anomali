# KEMBALI

> **Barang bekas tidak harus berakhir menjadi sampah. Beri kesempatan kedua, hadirkan manfaat kembali.**

KEMBALI (**Kolaborasi Ekonomi Masyarakat Berbasis Lingkungan**) adalah platform berbasis web yang menghubungkan masyarakat, komunitas, UMKM, dan bank sampah dalam satu ekosistem ekonomi sirkular.

<p align="left">
  <a href="https://kembali-donasi.vercel.app/"><strong>Demo Langsung</strong></a>
  ·
  <a href="https://github.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali"><strong>Repository</strong></a>
</p>

## Tentang KEMBALI

KEMBALI adalah platform berbasis web yang menerapkan konsep ekonomi sirkular dengan menghubungkan masyarakat dalam satu ekosistem untuk menjual, menukar, mendonasikan, memperbaiki, dan mendaur ulang barang yang masih dapat diolah menjadi sesuatu yang bernilai kembali.

Platform ini hadir untuk mengurangi penumpukan sampah di sekitar kita sekaligus meningkatkan nilai ekonomi barang bekas melalui pemanfaatan kembali secara berkelanjutan. KEMBALI juga menyediakan edukasi mengenai gaya hidup *zero waste*, informasi bank sampah, serta fitur yang mendorong masyarakat untuk lebih peduli terhadap lingkungan sekitar.

Melalui kolaborasi antara masyarakat, UMKM, komunitas, dan bank sampah, KEMBALI bertujuan menciptakan kebiasaan baru: barang bekas bukan untuk dibuang, melainkan untuk kembali dimanfaatkan, kembali bernilai, dan kembali memberikan manfaat bagi lingkungan maupun perekonomian.

## Fitur Utama

- **Eksplorasi komunitas terverifikasi** — Pengguna dapat menemukan komunitas mitra, melihat lokasi dan deskripsinya, serta memahami jenis barang yang sedang dibutuhkan.
- **Pengajuan donasi barang** — Pengguna dapat mengajukan barang layak pakai atau karya daur ulang dengan mengisi detail barang, alamat penjemputan, dan foto untuk proses verifikasi.
- **Pelacakan perjalanan donasi** — Setiap donasi memiliki status yang jelas mulai dari menunggu verifikasi, diverifikasi, penjemputan, pengiriman, hingga diterima komunitas.
- **Aktivitas dan riwayat donasi** — Pengguna dapat melihat donasi yang sedang berjalan, riwayat penyaluran, komunitas penerima, serta detail perkembangan setiap pengajuan.
- **Profil dan pengaturan privasi** — Pengguna dapat mengatur data diri, foto profil, domisili umum, visibilitas kontribusi, laporan dampak, dan penyimpanan riwayat donasi.
- **Autentikasi akun** — Tersedia login email, login username, Google OAuth, pendaftaran akun, pemulihan kata sandi, verifikasi Cloudflare Turnstile, dan proses melengkapi profil.
- **Live chat komunitas** — Pengguna yang sudah login dapat berkomunikasi melalui ruang chat komunitas, mengirim pesan, membalas, menyalin, mengedit, serta mengirim lampiran gambar.
- **Papan peringkat donatur** — Komunitas dapat menampilkan daftar donatur berdasarkan jumlah barang yang telah didonasikan dengan tetap menghormati pengaturan privasi pengguna.
- **Dashboard admin dan manager** — Petugas dapat memantau antrean donasi, melihat foto barang, mengambil atau melepas tugas, memperbarui status, serta memeriksa aktivitas operasional.
- **Ulasan dan moderasi testimoni** — Donatur dapat mengirim ulasan setelah donasi diterima. Admin dapat memilih ulasan yang layak ditampilkan pada halaman Beranda.
- **Responsif di berbagai perangkat** — Tampilan menyesuaikan desktop, tablet, dan mobile dengan navigasi adaptif, card rail yang dapat digeser, tombol ramah sentuhan, serta layout yang tetap terbaca pada layar kecil.

## Desain dan Pengalaman Pengguna

Antarmuka KEMBALI menggunakan gaya visual yang bersih, hangat, dan dekat dengan tema lingkungan. Warna hijau digunakan sebagai identitas utama untuk menyampaikan kesan pertumbuhan, keberlanjutan, dan kepedulian terhadap lingkungan. Kartu dengan sudut membulat, bayangan lembut, ilustrasi, dan ruang kosong yang cukup membantu pengguna memahami informasi tanpa merasa penuh.

Perancangan juga berfokus pada aksesibilitas, kejelasan informasi, dan umpan balik yang mudah dipahami. Setiap proses penting memiliki indikator loading, pesan validasi, notifikasi keberhasilan, animasi centang, dialog konfirmasi, dan status donasi yang terlihat jelas. Layout dan interaksi telah disesuaikan agar tetap nyaman digunakan melalui laptop maupun perangkat mobile.

## Fitur Utama: Alur Donasi

Alur utama KEMBALI dibuat agar proses donasi dapat dipahami oleh pengguna baru:

1. Pengguna melihat komunitas terverifikasi dan kebutuhan yang tersedia.
2. Pengguna masuk atau membuat akun KEMBALI.
3. Pengguna melengkapi profil dan domisili untuk kebutuhan koordinasi.
4. Pengguna mengisi formulir donasi, alamat penjemputan, detail barang, dan foto verifikasi.
5. Komunitas atau admin memeriksa pengajuan dan memperbarui status donasi.
6. Pengguna dapat melacak proses penjemputan, pengiriman, hingga barang diterima.
7. Setelah donasi diterima, pengguna dapat memberikan ulasan dan melihat dampaknya.

## Alur Pengguna

```text
Halaman Beranda
    │
    ├── Jelajahi komunitas dan kebutuhan
    │       │
    │       └── Formulir pengajuan donasi
    │
    └── Autentikasi
            │
            ├── Lengkapi profil
            ├── Aktivitas dan pelacakan donasi
            ├── Profil, privasi, dan keamanan
            └── Live chat komunitas

Admin / Manager Komunitas
    │
    ├── Memantau antrean pengajuan
    ├── Memverifikasi barang dan foto
    ├── Mengambil tugas dan memperbarui status
    └── Memoderasi ulasan pengguna
```

## Teknologi yang Digunakan

| Kategori | Teknologi |
| --- | --- |
| Frontend | React 19 dan Vite |
| Routing | React Router 7 |
| Styling | CSS responsif dan aset SVG |
| Backend | Supabase Auth, Edge Functions, Storage, dan Realtime |
| Database | PostgreSQL melalui Supabase |
| Keamanan | Row Level Security (RLS) dan Cloudflare Turnstile |
| Deployment | Vercel |

## Struktur Project

```text
project/
├── public/                 # Logo, ilustrasi, ikon, dan aset publik
├── src/
│   ├── components/         # Komponen UI bersama, profil, dan admin
│   ├── context/            # Context autentikasi dan state aplikasi
│   ├── features/auth/      # Login, daftar, reset password, dan layanan auth
│   ├── lib/                # Client Supabase dan utilitas bersama
│   └── pages/              # Beranda, donasi, komunitas, insight, profil, admin
├── supabase/
│   ├── functions/          # Supabase Edge Functions
│   └── migrations/         # Schema database, policy, RPC, dan realtime
├── ekspor/                 # Hasil ekspor desain dan referensi visual
├── backend.md              # Arsitektur dan catatan implementasi backend
├── userflow.md             # Dokumentasi alur produk dan pengguna
└── README.md
```

## Persiapan Menjalankan Project

### Prasyarat

- Node.js 22.x
- npm
- Git
- Project Supabase untuk fitur backend

### Instalasi

```bash
git clone https://github.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali.git
cd ngoding-sama-wisnu-dan-3anomali
npm install
```

### Environment Variables

Buat file `.env.local` dari file contoh:

```bash
cp .env.example .env.local
```

Isi variabel frontend berikut:

```env
VITE_SUPABASE_URL=url_project_supabase_kamu
VITE_SUPABASE_PUBLISHABLE_KEY=publishable_key_supabase_kamu
VITE_TURNSTILE_SITE_KEY=site_key_cloudflare_turnstile_kamu
VITE_ENABLE_DEMO_OTP=true
```

`VITE_ENABLE_DEMO_OTP=true` digunakan untuk kebutuhan demo lomba selama provider WhatsApp OTP produksi belum dikonfigurasi. Kode demo yang digunakan adalah `1234`. Jangan pernah memasukkan `.env.local`, service-role key, password database, Turnstile secret key, atau kredensial pribadi lainnya ke repository.

### Menjalankan Secara Lokal

```bash
npm run dev
```

Aplikasi dapat dibuka melalui:

```text
http://localhost:5173
```

Pengecekan kualitas kode:

```bash
npm run lint
npm run build
```

## Deployment

Versi produksi KEMBALI menggunakan Vercel dengan konfigurasi Vite:

- **Website:** https://kembali-donasi.vercel.app/
- **Perintah build:** `npm run build`
- **Folder output:** `dist`
- **Versi Node.js:** `22.x`

Tambahkan variabel `VITE_*` yang sama pada Vercel Project Settings untuk environment Preview dan Production. Supabase Auth juga perlu dikonfigurasi dengan redirect URL domain produksi, sedangkan hostname domain Vercel perlu ditambahkan ke widget Cloudflare Turnstile.

## Tim

| Anggota | Peran |
| --- | --- |
| Hanin | Desainer UI/UX |
| Elok | Desainer UI/UX · Frontend |
| Wisnu | Frontend |
| Krisna | Frontend Tipis" Backend Tebal" |

## Kompetisi

- **Nama lomba:** SATU CREANOVA
- **Tahun:** 2026
- **Kategori:** Web Development

## Pengembangan Berikutnya

- Menghubungkan verifikasi WhatsApp OTP dengan provider produksi seperti Twilio.
- Menambahkan pengelolaan komunitas, kebutuhan, dan artikel secara langsung dari dashboard admin.
- Menambahkan analitik dampak yang lebih lengkap serta laporan donasi yang dapat diunduh.
- Memperluas pengujian otomatis untuk realtime status donasi, live chat, dan hak akses berbasis role.
- Mengembangkan integrasi lebih banyak bank sampah, UMKM, dan komunitas di berbagai wilayah.

## Lisensi

Project ini dibuat oleh tim KEMBALI sebagai bagian dari **SATU CREANOVA 2026 — Web Development**.
