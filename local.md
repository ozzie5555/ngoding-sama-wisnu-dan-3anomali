# Testing Guide — KEMBALI Backend

Panduan lengkap testing backend KEMBALI. Semua yang masih manual/mock ditandai.

---

## Persiapan

1. `npm install`
2. `npm run dev`
3. Buka `http://localhost:5173`
4. Siapkan **2 email aktif** (1 untuk daftar, 1 untuk test email baru)

## 1. Sign-up

### Flow
1. Buka `/sign-up`
2. Isi **Email** & **Password** (min 8 karakter, ada huruf, angka, simbol)
3. Klik **Selanjutnya**
4. **WhatsApp OTP** → isin nomor → klik **Verifikasi** → isi 4 digit bebas → **Selanjutnya**
   > ⚠️ OTP masih **MOCK** — tidak ada SMS asli yang terkirim. Angka 4 digit bisa apa aja.
5. Muncul "Sign-up Berhasil!" → klik **Lengkapi Profil Anda**
6. Isi Nama Lengkap, Username, Tanggal Lahir, Domisili → **Simpan**
7. Pilih: Donasi / Komunitas / Beranda

### Yang terjadi di database
- `auth.users` → akun baru (email, password hash)
- `profiles` → baris baru (id, full_name, username, email) via trigger `handle_new_user`
- `profile_settings` → baris baru (default privacy) via trigger

### ⚠️ Catatan
- Kalau **"Confirm email"** hidup di Dashboard → user akan dapat email konfirmasi dari Supabase. Klik link di email dulu sebelum bisa login.
- Kalau **"Confirm email"** dimatikan → langsung bisa login tanpa konfirmasi.
- Kalau kena **email rate limit** → tunggu 1-2 menit, atau manual confirm di Dashboard → Authentication → Users → klik user → **Confirm email**.

---

## 2. Sign-in

### Flow
1. Buka `/login`
2. Login pakai **email** yang sudah didaftarkan
   > Bisa juga pakai **username** (misal: `@youokozzie`) — otomatis lookup email dari `profiles` table.
3. Muncul "Sign-in Berhasil!" → redirect ke Beranda

### Yang terjadi
- Supabase Auth: `signInWithPassword`
- Kalau pakai username → query `profiles` cari `email` → login pakai email tersebut
- Session disimpan di Supabase client

### ⚠️ Catatan
- Kalau email belum di-confirm (Confirm email hidup) → login gagal: "Email atau Password salah"
- Cek di Dashboard → Authentication → Users → pastikan **Confirmed at** sudah ada tanggal

---

## 3. Reset Password

### Flow
1. Buka `/login`
2. Klik **Lupa Password?**
3. Isi email yang terdaftar → klik **Verifikasi**
4. Cek email inbox → klik **link reset password** dari Supabase
5. Redirect ke halaman **Buat Ulang Password**
6. Isi password baru (min 8 karakter) → **Simpan Password**
7. "Password Baru Berhasil Disimpan" → **Kembali ke Sign-in**
8. Login pakai password baru

### Yang terjadi
- Supabase kirim email reset via `resetPasswordForEmail`
- User klik link → URL punya `?code=...` parameter
- App panggil `exchangeCodeForSession(code)` → session terbentuk
- `auth.updateUser({ password })` → password di-update
- Timestamp `password_last_updated` disimpan ke `profiles`

### ⚠️ Catatan
- Kalau email reset nggak masuk → cek **spam/junk folder**
- Kalau kena rate limit → tunggu beberapa menit
- Link reset expired dalam waktu tertentu (default 1 jam)

---

## 4. Edit Profile

### Flow
1. Login → buka `/profile`
2. Klik **Edit Profile**
3. Ubah data (nama, username, phone, tanggal lahir, lokasi)
4. Klik **Simpan**

### Yang terjadi
- `authService.updateProfile()` → update `profiles` table (full_name, username, phone, birth_date, address)
- Context user di-update

---

## 5. Upload Foto Profil

### Flow
1. Buka `/profile?tab=edit`
2. Klik **Ubah** di foto profil
3. Pilih gambar (max 2MB, jpg/png/webp)
4. Muncul modal **Posisikan Foto** — geser gambar drag ke posisi yang diingin di dalam lingkaran
5. Klik **Simpan**

### Yang terjadi
- File di-upload ke bucket `profile-photos` → path: `{user_id}/avatar.{ext}`
- URL disimpan ke `profiles.avatar_path`

### ⚠️ Catatan
- Kalau upload gagal → cek bucket `profile-photos` ada dan public
- Kalau foto hilang setelah save → bug known, perlu refresh halaman

---

## 6. Privasi & Data

### Flow
1. Buka `/profile` → klik **Privasi & Data**
2. Toggle on/off:
   - **Visibilitas kontribusi** — tampilkan jumlah donasi di profil
   - **Lokasi umum** — tampilkan kota di profil
   - **Laporan dampak** — izinkan data donasi dihitung anonim
   - **Riwayat donasi** — simpan riwayat donasi
3. Klik **Simpan**

### Yang terjadi
- `authService.updatePrivacySettings()` → upsert ke `profile_settings` table

### ⚠️ Catatan
- Toggle di-load dari database saat login
- Reset/Aatur Ulang hanya mengembalikan ke state terakhir dari DB

---

## 7. Keamanan

### Ubah Password
1. Klik icon edit di **Kata Sandi**
2. Isi **password lama** → isi **password baru** → **Simpan**
3. Yang terjadi: re-authenticate pakai password lama → `auth.updateUser({ password })` → timestamp disimpan

### Ubah Email
1. Klik icon edit di **Email**
2. Step 1: Isi **password lama** → **Simpan**
3. Step 2: Isi **email baru** → **Simpan**
4. Yang terjadi: re-authenticate → `auth.updateUser({ email })` → email di-sync ke `profiles.email`

### Ubah WhatsApp
1. Klik icon edit di **Nomor WhatsApp**
2. Isi nomor baru → **Simpan**
3. Yang terjadi: update `profiles.phone`

### Logout
1. Klik **Keluar**
2. Yang terjadi: `supabase.auth.signOut()` → session terhapus → redirect ke Beranda

---

## 8. Donasi

### Submit Donasi
1. Login → buka `/donasi`
2. Klik **Mulai Donasi Sekarang** atau pilih komunitas → **Lihat Kebutuhan**
3. Pilih komunitas → klik **Donasi Sekarang**
4. Isi form:
   - Nama Barang (wajib)
   - Jumlah, Satuan, Kondisi
   - Foto (opsional, max 5MB)
   - Metode: Drop Point / Penjemputan
   - Catatan (opsional)
5. Klik **Kirim Pengajuan Donasi**
6. Muncul **kode donasi** (cth: `KBL-7SSX`) + popup sukses

### Yang terjadi
- Insert ke `donations` table (status: `pending`)
- Slug komunitas (cth: `sedekas`) di-resolve ke UUID via query `communities.slug`
- Foto upload ke bucket `item-photos` → insert ke `donation_items`

### Lihat Status Donasi
1. Buka `/donasi` (setelah login)
2. **Aktivitas Donasi** → tampil donasi aktif dengan tracker 5 step
3. **Riwayat** → tampil donasi yang sudah received/cancelled

### ⚠️ Update Status — MASIH MANUAL

**Belum ada admin dashboard.** Status donasi harus di-update manual via SQL.

Buka **Supabase Dashboard → SQL Editor**, jalankan perintah ini (ganti `KBL-XXXX` dengan kode donasi kamu):

```sql
-- Langkah 1: Konfirmasi donasi
UPDATE donations SET status = 'verified' WHERE donation_code = 'KBL-XXXX';

-- Langkah 2: Pengambilan barang
UPDATE donations SET status = 'pickup' WHERE donation_code = 'KBL-XXXX';

-- Langkah 3: Pengiriman
UPDATE donations SET status = 'shipping' WHERE donation_code = 'KBL-XXXX';

-- Langkah 4: Diterima
UPDATE donations SET status = 'received', received_at = now() WHERE donation_code = 'KBL-XXXX';
```

**Alur status:**
```
pending → verified → pickup → shipping → received
                                                           ↘ cancelled (kapan saja)
```

---

## 9. Profile Overview

Buka `/profile` — cek data real dari database:
- **Stats** → Donasi/Tersalur/Simpan di-compute dari `donations` table
- **Donasi saya** → card donasi dengan foto, judul, komunitas, status
- **Komunitas Mitra** → logo + nama komunitas dari `communities` table

### ⚠️ Cek juga
- Kalau belum ada donasi → tampil empty state "Mulai Perjalanan Donasimu" + tombol "Mulai Donasi"
- Kalau ada donasi → card muncul dengan data real

---

## Hal yang Masih Manual / Mock

| Fitur | Status | Keterangan |
|---|---|---|
| **Email confirmation (sign-up)** | Manual | Matikan/hidupkan di Dashboard → Auth → Email → Confirm email |
| **WhatsApp OTP** | Mock | Tidak ada SMS asli. Angka 4 digit bebas. |
| **Status donasi** | Manual SQL | Update via SQL Editor, belum ada admin dashboard |
| **Upload foto donasi** | Real | Upload ke `item-photos` bucket |
| **Chat** | Belum | Migration ada, frontend belum di-wire |
| **Artikel Insight** | Hardcoded | Masih di file `insightData.js`, belum dari database |
| **Statistik global** | Hardcoded | Angka 12.400+, 2.000kg dll masih statis |
| **Email reset rate limit** | Supabase limit | Tunggu beberapa menit kalau kena rate limit |

---

## Troubleshooting

| Error | Solusi |
|---|---|
| "Email atau Password salah" setelah daftar | Cek email confirmation. Dashboard → Auth → Users → Confirm |
| "email rate limit exceeded" | Tunggu 1-2 menit, atau kirim ulang |
| "bucket not found" | Buat bucket di Dashboard → Storage → New bucket |
| "row-level security policy" | Jalankan migration RLS (0011, 0013) |
| "invalid input syntax for type uuid" | Jalankan seed data (0001_communities.sql) |
| Foto profil hilang setelah save | Known issue. Refresh halaman. |
| Reset password redirect ke halaman awal | Pastikan Supabase Dashboard → Auth → URL Configuration → Redirect URLs = `http://localhost:5173/reset-password` |

---