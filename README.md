# KEMBALI

Website donasi barang layak pakai berbasis React, Vite, dan Supabase.

## Menjalankan secara lokal

Gunakan Node.js 22, kemudian jalankan:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Isi `.env.local` dengan konfigurasi frontend Supabase dan Cloudflare Turnstile. Jangan masukkan `service_role`, password database, atau Turnstile secret ke frontend.

## Deploy ke Vercel

### 1. Impor repository

1. Buka Vercel dan pilih **Add New → Project**.
2. Impor repository GitHub project KEMBALI.
3. Pastikan **Framework Preset** terdeteksi sebagai `Vite`.
4. Gunakan **Build Command** `npm run build` dan **Output Directory** `dist`.
5. Gunakan Node.js `22.x` sesuai `package.json`.

`vercel.json` sudah mengarahkan seluruh URL seperti `/login`, `/profile`, dan `/donasi/form` ke aplikasi React sehingga halaman tidak menjadi 404 ketika dibuka langsung atau di-refresh.

### 2. Tambahkan Environment Variables

Di **Project Settings → Environment Variables**, tambahkan variabel berikut untuk Production dan Preview:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_TURNSTILE_SITE_KEY
```

Nilainya diambil dari `.env.local` milik project. Variabel berawalan `VITE_` akan ikut masuk ke bundle browser, sehingga hanya gunakan publishable/anon key dan site key.

### 3. Deploy pertama

Klik **Deploy**. Setelah selesai, simpan domain produksi, misalnya:

```text
https://kembali.vercel.app
```

### 4. Konfigurasi Supabase Auth

Buka **Supabase Dashboard → Authentication → URL Configuration**, lalu atur:

```text
Site URL: https://domain-produksi.vercel.app

Redirect URLs:
http://localhost:5173/**
http://127.0.0.1:5173/**
https://domain-produksi.vercel.app/**
```

Jika Preview Deployment juga dipakai untuk menguji login, tambahkan pola preview Vercel milik tim sebagai Additional Redirect URL. Batasi pola wildcard pada akun/tim sendiri.

Google Cloud OAuth tetap memakai callback Supabase berikut sebagai **Authorized redirect URI**:

```text
https://PROJECT_REF.supabase.co/auth/v1/callback
```

### 5. Konfigurasi Cloudflare Turnstile

Tambahkan hostname produksi Vercel pada widget Turnstile tanpa `https://` dan tanpa path:

```text
domain-produksi.vercel.app
```

Kemudian perbarui daftar hostname yang diperbolehkan oleh Edge Function:

```bash
npx --yes supabase@latest secrets set TURNSTILE_ALLOWED_HOSTNAMES="localhost,127.0.0.1,domain-produksi.vercel.app"
```

Edge Function `verify-turnstile` sudah ter-deploy; fungsi hanya perlu di-deploy ulang jika kodenya berubah. `TURNSTILE_SECRET_KEY` tetap berada di Supabase Edge Function secrets dan tidak perlu ditambahkan ke Vercel.

### 6. Uji production

Periksa alur berikut pada domain Vercel:

- refresh langsung pada `/login`, `/donasi/form`, dan `/profile` tidak menghasilkan 404;
- sign-up, sign-in email/username, dan Google OAuth kembali ke domain produksi;
- reset password kembali ke `/reset-password`;
- Turnstile berhasil diverifikasi;
- pengguna biasa dan admin diarahkan ke halaman yang sesuai;
- unggah foto, donasi, aktivitas, notifikasi, dan live chat terhubung ke Supabase.

Setelah environment variable atau konfigurasi callback diubah, jalankan **Redeploy** pada deployment production.
