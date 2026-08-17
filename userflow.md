# User Flow Lengkap — Website KEMBALI

Dokumen ini merangkum alur pengguna dari awal masuk situs sampai ke seluruh modul: **Beranda, Autentikasi, Donasi, Profile & Akun, Research / Insight, dan Community**.

---

## 0. Peta Modul

| No. | Modul                      | Akses                                          |
| --: | -------------------------- | ---------------------------------------------- |
|   1 | Beranda                    | Publik (Guest & Login)                         |
|   2 | Autentikasi (Masuk/Daftar) | Publik                                         |
|   3 | Donasi                     | Sebagian publik, aksi donasi membutuhkan login |
|   4 | Profile & Akun             | Wajib login                                    |
|   5 | Research / Insight         | Publik                                         |
|   6 | Community                  | Sebagian publik, chat/donasi membutuhkan login |

> **Catatan:** Guest dapat menjelajah **Beranda, Insight, dan Community** secara bebas. Ketika mencoba melakukan aksi yang membutuhkan autentikasi seperti **donasi, chat, atau membuka Profile**, sistem akan mengarahkan user ke halaman **Masuk/Daftar** terlebih dahulu.

---

# 1. Beranda (Landing Page)

### 1.1 Membuka Website

User membuka website → sistem menampilkan **Beranda**.

### 1.2 Navbar

Navbar terdiri dari:

* Beranda
* Donasi
* Insight
* Komunitas
* Masuk/Daftar

Setelah user login, bagian **Masuk/Daftar** berubah menjadi:

* Avatar user
* Ikon notifikasi
* Dropdown Profile / Logout

### 1.3 Hero Section

Hero section memiliki CTA:

* **Mulai Donasi Sekarang**
* **Hubungi Kami**

#### CTA — Mulai Donasi Sekarang

* Jika user **belum login**:

  * Klik `Mulai Donasi Sekarang`
  * Redirect ke halaman **Autentikasi**
  * User melakukan login/daftar
  * Setelah berhasil → diarahkan ke halaman **Donasi**
* Jika user **sudah login**:

  * Langsung diarahkan ke halaman **Donasi**

#### CTA — Hubungi Kami

User diarahkan ke informasi kontak atau halaman kontak KEMBALI.

### 1.4 Statistik Dampak

Menampilkan statistik informatif seperti:

* Barang tersirkulasi
* Sampah yang dikurangi
* CO₂ yang dihemat
* Pengguna aktif

### 1.5 Carousel — "Seputar Tentang KEMBALI"

User dapat melihat konten/artikel terkait KEMBALI.

Alur:

`Beranda → Carousel → Visit Now → Detail Artikel (Insight)`

### 1.6 Section — "Layanan untuk Anda"

Tersedia beberapa layanan:

| Layanan             | Tujuan                       |
| ------------------- | ---------------------------- |
| Donasi Online       | Modul Donasi                 |
| Informasi & Wawasan | Modul Insight                |
| Dokumentasi         | Halaman dokumentasi kegiatan |
| Komunitas           | Modul Community              |

### 1.7 Section — Ulasan Pengguna

User dapat membaca:

* Testimoni donatur
* Testimoni penerima manfaat

Testimoni donasi dapat ditampilkan setelah melalui proses moderasi.

### 1.8 Preview — "Bagaimana Cara Berdonasi"

Menampilkan proses donasi dalam **4 langkah**.

CTA:

`Lanjut → Halaman Donasi`

### 1.9 Section — "Barang yang Bisa Anda Donasikan"

Menampilkan informasi kategori barang:

* Barang Bekas
* Pakaian Layak
* Buku & ATK Bekas
* Karya Hasil Daur Ulang

Section ini bersifat informatif.

### 1.10 Section — Partner Kami

Menampilkan:

* Logo komunitas mitra
* Informasi singkat mengenai partner

### 1.11 CTA Akhir

CTA:

* **Mulai Donasi Sekarang**
* **Pelajari Lebih Lanjut**

### 1.12 Footer

Footer terdiri dari:

#### Navigasi Utama

* Beranda
* Donasi
* Insight
* Komunitas

#### Bantuan & Legal

* FAQ
* Syarat & Ketentuan
* Kebijakan Privasi

#### Newsletter

Form untuk mendaftarkan email user ke newsletter KEMBALI.

---

# 2. Autentikasi (Masuk/Daftar)

## 2.1 Masuk ke Autentikasi

User dapat masuk ke halaman autentikasi melalui:

* Klik **Masuk/Daftar** di navbar
* Redirect otomatis ketika Guest mencoba mengakses fitur yang membutuhkan login

## 2.2 Pilihan Autentikasi

User memilih:

* **Masuk**
* **Daftar**

---

## 2.2.1 Masuk (Login)

### Input

* Email / Nomor HP
* Password

User klik **Submit**.

### Login Berhasil

Alur:

`Input → Submit → Validasi → Berhasil → Beranda`

Setelah berhasil:

* User masuk ke Beranda
* Navbar berubah menjadi logged-in state
* Avatar user ditampilkan
* Ikon notifikasi ditampilkan

### Login Gagal

Sistem menampilkan pesan error.

User dapat:

* Mencoba login kembali
* Memilih **Lupa Password**

### Lupa Password

Alur:

`Lupa Password → Input Email → Link/Kode Reset → Set Password Baru → Login`

---

## 2.2.2 Daftar (Register)

### Form Registrasi

User mengisi:

* Nama
* Email
* Nomor WhatsApp
* Password

### Verifikasi OTP

Sistem mengirim OTP melalui:

* Email
* WhatsApp

User memasukkan OTP untuk memverifikasi akun.

### Registrasi Berhasil

Alur:

`Register → OTP → Verifikasi → Auto Login`

Setelah akun berhasil dibuat:

`Auto Login → Lengkapi Profile (Opsional) → Beranda`

User dapat **skip** proses melengkapi profile dan melakukannya nanti.

---

## 2.3 Logged-in State

Setelah login, navbar menampilkan:

* Avatar
* Ikon notifikasi
* Dropdown Profile
* Logout

---

# 3. Donasi

## 3.1 Masuk ke Halaman Donasi

User dapat membuka halaman Donasi melalui:

* Menu **Donasi** di navbar
* CTA di Beranda
* CTA dari Community

Jika user belum login ketika melakukan aksi donasi:

`Donasi → Autentikasi → Login/Register → Donasi`

---

## 3.2 Halaman Donasi

Halaman Donasi menampilkan:

* Hero section
* Alur Donasi
* Mengapa Berdonasi
* Daftar Komunitas Terverifikasi

Proses donasi terdiri dari **4 langkah**.

---

## Langkah 1 — Cari Kebutuhan

User dapat melihat daftar kebutuhan barang dari komunitas.

Fitur:

* Browsing kebutuhan
* Filter kategori
* Filter lokasi

User memilih salah satu komunitas untuk melihat:

* Detail komunitas
* Kebutuhan spesifik komunitas

---

## Langkah 2 — Isi Form Donasi

### Pilih Kategori Barang

Pilihan:

* Barang Bekas
* Pakaian Layak
* Buku & ATK Bekas
* Karya Daur Ulang

### Informasi Barang

User mengisi:

* Upload foto barang
* Deskripsi kondisi
* Jumlah barang

### Data Pendonor

User mengisi:

* Nama
* Kontak
* Alamat penjemputan/pengiriman

Jika data sudah tersedia di Profile, sistem melakukan **auto-fill**.

### Donasi dari Community

Jika user masuk melalui:

`Donasikan ke Komunitas Ini`

maka:

* Komunitas penerima otomatis terisi
* User tidak perlu memilih komunitas kembali

---

## Langkah 3 — Konfirmasi Donasi

Sistem menampilkan halaman review berisi:

### Detail Barang

* Kategori
* Foto
* Kondisi
* Jumlah
* Deskripsi

### Data Pendonor

* Nama
* Kontak
* Alamat

### Komunitas Penerima

* Nama komunitas
* Informasi penerima

User klik:

**Konfirmasi & Ajukan**

Setelah dikonfirmasi:

* Sistem membuat **ID Donasi**
* Notifikasi dikirim ke user
* Email konfirmasi dikirim jika tersedia

---

## Langkah 4 — Tracking Donasi

Status donasi:

```text
Menunggu Verifikasi
        ↓
Terverifikasi
        ↓
Dalam Penjemputan/Pengiriman
        ↓
Diterima Komunitas
```

User dapat melihat status melalui:

* Halaman Tracking
* Profile → Aktivitas

### Setelah Donasi Diterima

Ketika status berubah menjadi **Diterima Komunitas**:

* User mendapatkan opsi memberikan ulasan/testimoni
* Testimoni masuk proses moderasi
* Setelah disetujui → dapat ditampilkan pada section **Ulasan Pengguna** di Beranda

---

# 4. Profile & Akun

## 4.1 Membuka Profile

Alur:

`Avatar → Dropdown → Profile`

Profile hanya dapat diakses oleh user yang sudah login.

---

## 4.2 Halaman Profile

Profile menampilkan:

* Foto profile
* Nama
* Ringkasan statistik
* Jumlah donasi
* Informasi aktivitas

### Tab Aktivitas

Menampilkan:

* Riwayat donasi
* ID donasi
* Komunitas penerima
* Status donasi
* Detail donasi

---

## 4.3 Edit Profile

User klik **Edit Profile**.

Tersedia 3 tab:

1. Info Dasar
2. Privasi & Data
3. Verifikasi

---

## 4.3.1 Info Dasar

User dapat mengubah:

* Foto profile
* Nama
* Email
* Nomor HP
* Alamat

Setelah selesai:

`Simpan → Data Profile Diperbarui`

---

## 4.3.2 Privasi & Data

User dapat:

* Mengatur visibilitas informasi
* Mengubah password
* Mengatur preferensi notifikasi

### Mengubah Email

Alur:

`Email Baru → Verifikasi Kode → Email Diperbarui`

### Mengubah WhatsApp

Alur:

`Nomor Baru → Verifikasi Kode → Nomor Diperbarui`

---

## 4.3.3 Verifikasi

Sistem menampilkan status:

* Data Diri
* Email
* Nomor WhatsApp

Status dapat berupa:

* Belum Terverifikasi
* Diproses
* Terverifikasi

### Melakukan Verifikasi

Alur:

`Belum Terverifikasi → Verifikasi → Lengkapi Data → Submit → Diproses → Terverifikasi`

---

## 4.4 Kalender / Date Picker

Fitur kalender digunakan untuk mengatur jadwal penjemputan donasi.

Alur:

`Pilih Tanggal → Pilih Jadwal → Konfirmasi`

Jadwal kemudian tersimpan pada data donasi.

---

# 5. Research / Insight

## 5.1 Membuka Insight

User klik menu **Insight** di navbar.

Insight dapat diakses oleh Guest maupun user yang sudah login.

---

## 5.2 Listing Konten

Konten dibagi menjadi beberapa kategori:

* Artikel Edukasi
* Hasil Riset
* Konten Recycle / Upcycle
* Berita Lingkungan

---

## 5.3 Filter & Search

User dapat mencari konten berdasarkan:

* Kategori
* Kata kunci

---

## 5.4 Detail Artikel

User klik salah satu konten.

Alur:

`Insight Listing → Pilih Artikel → Detail Artikel`

Detail artikel menampilkan:

* Judul
* Isi lengkap
* Gambar
* Penulis
* Tanggal publish

### Fitur Tambahan

* Share ke media sosial
* Rekomendasi artikel terkait
* Tombol kembali ke listing Insight

---

## 5.5 Entry Point dari Beranda

User juga dapat membuka artikel melalui:

`Beranda → Seputar Tentang KEMBALI → Visit Now → Detail Artikel`

Entry point ini mengarah ke **Detail Artikel yang sama** pada modul Insight.

---

# 6. Community

## 6.1 Membuka Community

User klik menu **Komunitas** di navbar.

Community dapat dijelajahi oleh Guest.

---

## 6.2 Listing Komunitas Terverifikasi

Sistem menampilkan daftar komunitas terverifikasi.

Contoh:

* Sedekas
* Dipo Waste Bank
* Panti Asuhan Al Jannah
* Panti Asuhan Kristen Tanah Putih

Setiap komunitas menampilkan informasi:

* Nama komunitas
* Deskripsi singkat
* Lokasi
* Informasi terkait kebutuhan/donasi

---

## 6.3 Fitur Community

### 6.3.1 Rekomendasi Komunitas

Sistem memberikan rekomendasi berdasarkan:

* Kategori barang
* Lokasi user
* Kebutuhan komunitas

Alur:

`Data User → Sistem Rekomendasi → Komunitas yang Relevan`

---

### 6.3.2 Kontak Media Sosial

User dapat membuka media sosial komunitas melalui ikon:

* Instagram
* Facebook
* Platform sosial lainnya

Klik ikon → membuka profil media sosial komunitas di halaman/platform eksternal.

---

### 6.3.3 Community Chat

User dapat masuk ke ruang:

* Diskusi
* Forum antar-user
* Forum bersama komunitas

**Membutuhkan login.**

Jika Guest mencoba membuka chat:

`Community Chat → Autentikasi → Login/Register → Community Chat`

---

### 6.3.4 Saluran Donasi

User dapat melihat cara donasi khusus untuk komunitas, misalnya:

* Nomor rekening
* Alamat drop point
* Alamat komunitas
* Metode donasi lainnya

Fitur ini menjadi alternatif selain menggunakan **form donasi utama KEMBALI**.

---

### 6.3.5 Live Chat

User dapat membuka widget chat secara langsung dengan:

* Admin
* Pengelola komunitas

Digunakan untuk:

* Tanya jawab
* Informasi donasi
* Informasi kebutuhan komunitas

**Membutuhkan login.**

Alur Guest:

`Live Chat → Autentikasi → Login/Register → Live Chat`

---

# 7. Ringkasan User Flow Utama

```text
                         ┌─────────────┐
                         │   WEBSITE   │
                         └──────┬──────┘
                                │
                         ┌──────▼──────┐
                         │   BERANDA   │
                         └──────┬──────┘
                                │
          ┌─────────────┬───────┼────────┬─────────────┐
          │             │       │        │             │
          ▼             ▼       ▼        ▼             ▼
       Donasi        Insight  Community  Auth        Dokumentasi
          │             │       │
          │             │       ├── Browsing
          │             │       ├── Rekomendasi
          │             │       ├── Sosmed
          │             │       ├── Chat ──────┐
          │             │       └── Live Chat ─┤
          │             │                      │
          │             │                      ▼
          │             │                 AUTENTIKASI
          │             │                      │
          │             │              ┌───────┴───────┐
          │             │              │               │
          │             │            Login           Register
          │             │              │               │
          │             │              └───────┬───────┘
          │             │                      │
          ▼             ▼                      ▼
      FORM DONASI   DETAIL ARTIKEL         BERANDA
          │
          ▼
      KONFIRMASI
          │
          ▼
      ID DONASI
          │
          ▼
       TRACKING
          │
          ▼
    DITERIMA KOMUNITAS
          │
          ▼
     ULASAN/TESTIMONI
          │
          ▼
       MODERASI
          │
          ▼
    ULASAN DI BERANDA


             LOGGED-IN USER
                   │
                   ▼
               PROFILE
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
     Aktivitas  Edit Profile  Verifikasi
                   │
             ┌─────┼─────┐
             │     │     │
             ▼     ▼     ▼
           Info  Privasi Verifikasi
           Dasar & Data
```

---

# 8. Aturan Akses

| Fitur                  | Guest | Login |
| ---------------------- | :---: | :---: |
| Beranda                |   ✓   |   ✓   |
| Insight                |   ✓   |   ✓   |
| Detail Artikel         |   ✓   |   ✓   |
| Community Listing      |   ✓   |   ✓   |
| Rekomendasi Community  |   ✓   |   ✓   |
| Media Sosial Community |   ✓   |   ✓   |
| Donasi                 |   ✗   |   ✓   |
| Submit Form Donasi     |   ✗   |   ✓   |
| Tracking Donasi        |   ✗   |   ✓   |
| Profile                |   ✗   |   ✓   |
| Edit Profile           |   ✗   |   ✓   |
| Aktivitas Donasi       |   ✗   |   ✓   |
| Community Chat         |   ✗   |   ✓   |
| Live Chat              |   ✗   |   ✓   |
| Login / Register       |   ✓   |   —   |

---

# 9. Prinsip Navigasi

1. **Guest-first browsing** — user dapat menjelajah konten publik tanpa harus membuat akun.
2. **Authentication on action** — login diminta ketika user melakukan aksi yang membutuhkan identitas.
3. **Context preservation** — setelah login berhasil, user diarahkan kembali ke fitur yang sebelumnya ingin diakses.
4. **Community-driven donation** — user dapat memulai donasi dari halaman komunitas dan komunitas penerima otomatis terisi.
5. **Donation tracking** — setiap donasi memiliki ID dan status yang dapat dilacak.
6. **Profile as activity center** — Profile menjadi pusat informasi akun dan riwayat aktivitas donasi.
7. **Content discovery** — Insight dapat diakses melalui navbar maupun entry point dari Beranda.
8. **Verified community** — hanya komunitas terverifikasi yang ditampilkan sebagai penerima utama dalam sistem donasi.
