# Backend Specification — KEMBALI

Dokumen ini adalah spesifikasi implementasi backend final untuk website KEMBALI. Setelah frontend selesai dan field pada setiap form sudah dikunci, berikan dokumen ini kepada agent backend dengan instruksi: **"Implementasikan backend Supabase sesuai `backend.md`, jalankan migration, seed data, RLS, RPC, Storage, Realtime, dan integrasikan service frontend sesuai kontrak dokumen ini."**

Dokumen ini menjadi sumber kebenaran untuk schema database, aturan akses, alur status, API/RPC, dan integrasi Supabase. Catatan tentang frontend di bawah hanya berfungsi sebagai prasyarat integrasi—bukan laporan bahwa backend sudah berjalan.

## Stack dan prinsip

- React + Vite: frontend yang sudah ada.
- Supabase Auth: session dan autentikasi.
- Supabase Postgres: database aplikasi.
- Supabase Storage: foto barang, avatar, logo komunitas, media artikel.
- Supabase Realtime: tracking donasi, notifikasi, dan chat.
- Supabase Edge Functions: logic server-side dan integrasi provider email/WhatsApp.

> Browser hanya memakai publishable/anon key. `service_role` key hanya di Edge Function/server terpercaya. Jangan pernah memasukkannya ke bundle Vite.

---

## 1. Prasyarat sebelum implementasi

Backend dikerjakan setelah frontend menyelesaikan hal berikut:

- route dan nama halaman final;
- field Form Donasi, Profile, Auth, Insight, Komunitas, dan Testimoni;
- state loading, empty, error, dan success pada setiap aksi;
- kebutuhan role: user/donor, manager komunitas, moderator, dan admin;
- mapping komponen ke service pada bagian **Kontrak service frontend**.

Jika field UI berbeda dari schema di dokumen ini, agent harus memperbarui kontrak dan migration terlebih dahulu, lalu meminta konfirmasi tim sebelum membuat tabel baru. Jangan membuat backend berdasarkan tebakan dari tampilan sementara.

### Perintah implementasi untuk agent

1. Baca `userflow.md` dan seluruh `backend.md`.
2. Audit route, form, dan data contract frontend yang sudah final.
3. Buat project client Supabase, migration, seed, RLS, RPC, Storage, dan Realtime sesuai urutan dokumen.
4. Implementasikan service frontend dan ganti mock/local state dengan query Supabase.
5. Jalankan pengujian role dan alur donasi dari awal sampai selesai.
6. Laporkan file yang dibuat, migration yang dijalankan, environment variable yang dibutuhkan, dan fitur yang masih tertunda.

Target arsitektur:

```mermaid
flowchart LR
  FE[React Frontend] --> AUTH[Supabase Auth]
  FE --> DB[(Postgres + RLS)]
  FE --> STORAGE[Storage Buckets]
  FE --> RT[Realtime]
  DB --> RPC[RPC / Trigger]
  RPC --> NOTIF[Notifications]
  EDGE[Edge Functions] --> PROVIDER[Email / WhatsApp Provider]
  EDGE --> DB
```

---

## 2. Alur website yang menjadi kontrak backend

### 2.1 Guest dan login

```mermaid
flowchart TD
  START[User membuka website] --> HOME[Beranda publik]
  HOME --> PUBLIC{Aksi publik?}
  PUBLIC -->|Insight / daftar komunitas| READ[Baca data publik]
  PUBLIC -->|Donasi / profile / chat| SESSION{Ada session?}
  SESSION -->|Tidak| AUTH[Masuk / Daftar]
  SESSION -->|Ya| ACTION[Jalankan aksi]
  AUTH --> CALLBACK[Kembali ke tujuan sebelumnya]
  CALLBACK --> ACTION
```

Guest boleh membaca Beranda, Insight, detail artikel, daftar komunitas terverifikasi, kebutuhan komunitas, dan tautan sosial. Login diperlukan untuk membuat donasi, melihat tracking, membuka profile, mengirim testimoni, dan memakai chat.

### 2.2 Siklus donasi

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Pending: Konfirmasi & Ajukan
  Pending --> Verified: Admin verifikasi
  Verified --> InTransit: Admin atur pengiriman/pickup
  InTransit --> Received: Komunitas menerima
  Received --> TestimonialPending: User kirim ulasan
  TestimonialPending --> Published: Admin setujui
  TestimonialPending --> Rejected: Admin tolak
```

Aturan inti:

1. Draft boleh disimpan sementara di FE sebelum submit final.
2. Submit membuat `donation_code` dan event `pending` dalam satu transaksi.
3. Setelah `pending`, status hanya berubah melalui RPC admin/manager.
4. Setiap perubahan status membuat event timeline dan notifikasi.
5. Testimoni baru boleh dibuat ketika donasi berstatus `received`.

### 2.3 Donasi dari komunitas

```mermaid
flowchart LR
  C[Detail komunitas] --> NEED[Kebutuhan komunitas]
  NEED --> CTA[Donasikan ke komunitas ini]
  CTA --> FORM[Form dengan community_id terisi]
  FORM --> REVIEW[Review data]
  REVIEW --> SUBMIT[Submit donation]
```

RPC harus memvalidasi ulang `community_id`: komunitas harus aktif dan terverifikasi. Jangan mempercayai nilai role, owner, atau komunitas hanya dari browser.

---

## 3. Modul dan route target

| Modul | Route target | Akses | Data utama |
| --- | --- | --- | --- |
| Beranda | `/` | Publik | statistik, artikel, komunitas, testimoni |
| Auth | `/auth` | Publik | Supabase Auth |
| Donasi | `/donasi` | Baca publik; submit perlu login | komunitas, kebutuhan, donasi |
| Tracking | `/donasi/:donationCode` | Pemilik/admin | donasi + status events |
| Profile | `/profile` | Login | profile, settings, donasi, notifikasi |
| Insight | `/insight` | Publik | articles |
| Detail artikel | `/insight/:slug` | Publik | articles |
| Komunitas | `/komunitas` | Publik | communities + needs |
| Chat | `/komunitas/:id/chat` | Login | rooms, members, messages |
| Admin | `/admin/*` | Admin | moderasi dan transisi status |

Route yang belum ada boleh dibuat setelah UI selesai. Schema backend ini menjadi target agar FE dapat berkembang tanpa mengganti nama tabel/status di tengah jalan.

---

## 4. Model data

Semua tabel memakai UUID dan timestamp UTC. Jalankan melalui migration SQL di repository, bukan membuat tabel manual tanpa riwayat.

### 4.1 Auth dan profile

#### `profiles`

Satu profile untuk setiap `auth.users`. Kredensial tetap dikelola Supabase Auth.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | uuid PK/FK | sama dengan `auth.users.id` |
| `username` | text unique | nama publik |
| `full_name` | text | nama lengkap |
| `phone` | text unique nullable | format E.164 |
| `address` | text nullable | alamat pickup/pengiriman |
| `avatar_path` | text nullable | path Storage, bukan URL permanen |
| `birth_date` | date nullable | |
| `role` | text | `user`, `manager`, `admin` |
| `verification_status` | text | `unverified`, `processing`, `verified` |
| `phone_verified_at` | timestamptz nullable | |
| `created_at` / `updated_at` | timestamptz | dikelola database |

#### `profile_settings`

`user_id`, `privacy_level`, `contribution_visibility`, `general_location`, `impact_report`, `donation_history`, dan `notification_preferences jsonb`.

### 4.2 Komunitas

#### `communities`

`id`, `name`, `slug unique`, `description`, `location`, `address`, `logo_path`, `social_links jsonb`, `manager_id`, `is_verified`, `is_active`, timestamps.

#### `community_needs`

`id`, `community_id`, `category`, `item_name`, `description`, `quantity_needed`, `quantity_received`, `status` (`open`, `fulfilled`, `archived`), timestamps.

Kategori resmi:

```text
barang_bekas | pakaian_layak | buku_atk | karya_daur_ulang
```

#### `donation_channels`

Saluran donasi alternatif komunitas: drop point, alamat resmi, rekening, atau kontak. Data hanya dapat diubah manager/admin.

### 4.3 Donasi dan tracking

#### `donations`

| Kolom | Keterangan |
| --- | --- |
| `id` | UUID internal |
| `donation_code` | kode publik unik, misalnya `KMB-2026-00001` |
| `donor_id` | `profiles.id` |
| `community_id` | komunitas penerima |
| `need_id` | kebutuhan yang dipilih, nullable |
| `category`, `item_name`, `condition_note` | detail barang |
| `quantity` | integer lebih besar dari 0 |
| `description` | deskripsi tambahan |
| `pickup_address` | snapshot alamat saat submit |
| `pickup_at` | jadwal pickup/pengiriman, nullable |
| `status` | `pending`, `verified`, `in_transit`, `received`, `cancelled` |
| `submitted_at`, `received_at` | waktu status terkait |
| `created_at`, `updated_at` | timestamp |

#### `donation_items`

`id`, `donation_id`, `storage_path`, `sort_order`. Binary foto berada di Storage, bukan di Postgres.

#### `donation_status_events`

`id`, `donation_id`, `from_status`, `to_status`, `note`, `changed_by`, `created_at`. Inilah sumber timeline tracking.

### 4.4 Konten dan aktivitas

| Tabel | Fungsi |
| --- | --- |
| `articles` | Insight: title, slug, content, cover, category, author, published_at |
| `testimonials` | Ulasan setelah `received`, menunggu moderasi |
| `notifications` | Notifikasi per user dan `is_read` |
| `activity_feed` | Aktivitas publik yang sudah disanitasi |
| `impact_statistics` | Angka dampak di Beranda |
| `newsletter_subscribers` | Email newsletter dan status unsubscribe |

### 4.5 Chat target

FE belum menyediakan chat. Saat dikerjakan, gunakan `chat_rooms`, `chat_members`, `chat_messages`, dan `live_chat_threads`. Semua read/write harus dibatasi membership atau relasi user-admin.

---

## 5. Migration dan aturan database

Urutan migration:

```text
0001_extensions_and_helpers
0002_profiles_and_profile_settings
0003_communities_and_needs
0004_donations_and_status_events
0005_notifications_activity_statistics
0006_articles_testimonials_newsletter
0007_chat
0008_storage_realtime_policies
```

Aturan:

- Tambahkan index untuk semua FK, `donation_code`, `communities.slug`, `articles.slug`, `category`, `location`, dan `status`.
- Validasi `quantity > 0`, jumlah diterima tidak negatif, dan jumlah diterima tidak melebihi kebutuhan.
- Gunakan `on delete restrict` untuk donasi historis; gunakan cascade hanya untuk data anak yang memang tidak bermakna tanpa parent.
- `donation_code`, `status`, role, approval, dan statistik global dibuat/diubah backend.
- Gunakan satu penamaan status dan kategori di migration, RPC, service FE, dan UI.

### 5.1 Trigger profile

Gunakan trigger setelah insert `auth.users`. Function `security definer` harus memakai `set search_path = ''` dan nama schema lengkap.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', 'user-' || left(new.id::text, 8))
  );

  insert into public.profile_settings (user_id) values (new.id);
  return new;
end;
$$;
```

Uji trigger di project development sebelum dipakai production.

### 5.2 RPC submit donasi

Buat `submit_donation(payload jsonb)` agar submit tidak terdiri dari banyak request terpisah. RPC harus:

1. Memastikan `auth.uid()` tersedia.
2. Memastikan komunitas aktif dan terverifikasi.
3. Memvalidasi kategori, quantity, dan data wajib.
4. Membuat `donation_code`.
5. Insert `donations` berstatus `pending`.
6. Insert event `pending`.
7. Membuat notifikasi.
8. Mengembalikan `id`, `donation_code`, dan `status`.

Buat `transition_donation_status(donation_id, next_status, note)` untuk admin/manager. RPC harus memiliki daftar transisi yang diizinkan dan menulis event + notification dalam transaksi yang sama.

---

## 6. Row Level Security (RLS)

RLS wajib aktif sebelum frontend membaca tabel.

| Tabel | Guest | User login | Manager | Admin |
| --- | --- | --- | --- | --- |
| `profiles` | Tidak/field publik terbatas | Baca/update milik sendiri | Sesuai komunitas | Sesuai tugas |
| `communities` | Baca aktif + verified | Sama | CRUD komunitas sendiri | CRUD semua |
| `community_needs` | Baca `open` | Sama | CRUD komunitas sendiri | CRUD semua |
| `donations` | Tidak | Insert/baca milik sendiri | Baca/update komunitas sendiri | Kelola semua |
| `donation_status_events` | Tidak | Baca donasi sendiri | Baca/insert komunitas sendiri | Semua |
| `notifications` | Tidak | Baca/update milik sendiri | Milik sendiri | Sistem |
| `articles` | Baca published | Sama | Tidak | CRUD |
| `testimonials` | Baca approved | Insert milik sendiri setelah received | Tidak | Moderasi |
| `chat_messages` | Tidak | Hanya member room | Manager room | Audit/admin |

Contoh policy profile:

```sql
alter table public.profiles enable row level security;

create policy "authenticated users read profiles"
on public.profiles for select to authenticated
using (true);

create policy "users update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
```

Untuk `UPDATE`, policy `SELECT` yang sesuai juga diperlukan. Kolom `role`, `verification_status`, `is_approved`, dan status donasi tidak boleh dinaikkan oleh user biasa.

### Pengujian RLS minimum

Uji sebagai anon, User A, User B, manager, dan admin. User A tidak boleh membaca atau mengubah donasi User B. User biasa tidak boleh mengubah status, role, approval testimoni, atau statistik global.

---

## 7. Auth dan verifikasi

### Fase awal

Implementasikan dulu flow yang paling stabil:

```text
Email + password → email confirmation sesuai setting → session → profiles
```

`AuthContext` harus mengganti localStorage dengan:

- `supabase.auth.signUp`
- `supabase.auth.signInWithPassword`
- `supabase.auth.signOut`
- `supabase.auth.onAuthStateChange`
- `supabase.auth.resetPasswordForEmail`

Tambahkan state `initialized` agar route private tidak merender sebelum session selesai dimuat. Session Supabase adalah sumber kebenaran production.

### Nomor HP dan WhatsApp OTP

Userflow meminta login nomor HP serta OTP email/WhatsApp. Kerjakan setelah email auth stabil:

- Phone Auth mengikuti provider phone/SMS yang didukung Supabase.
- WhatsApp membutuhkan Edge Function dan provider eksternal; secret tidak boleh berada di browser.
- OTP custom harus di-hash, punya expiry pendek, batas percobaan, dan hanya sekali pakai.
- Jangan mengubah `phone_verified_at` hanya karena form OTP terkirim.

Setelah login, simpan tujuan seperti `/donasi?community_id=...` dan kembalikan user ke tujuan tersebut. Jangan menyimpan password atau token manual di localStorage.

---

## 8. Storage dan Realtime

### Storage buckets

| Bucket | Isi | Akses |
| --- | --- | --- |
| `item-photos` | Foto barang | Upload user login; baca pemilik/admin/manager terkait |
| `profile-photos` | Avatar | Upload pemilik; baca sesuai privacy |
| `community-assets` | Logo komunitas | Baca publik; upload manager/admin |
| `article-media` | Cover artikel | Baca published; upload admin |
| `documentation-media` | Foto/video kegiatan | Baca publik sesuai status; upload admin/manager |

Gunakan path ownership, misalnya `{user_id}/{donation_id}/{uuid}.webp`. Validasi MIME, ukuran, dan jumlah file. Bucket private memakai signed URL.

### Realtime

Aktifkan hanya untuk `donations`, `donation_status_events`, `notifications`, `chat_messages`, dan `activity_feed` bila memang dipakai. Filter berdasarkan `user_id`, `donation_id`, atau `room_id`. Subscription React harus di-unsubscribe saat unmount.

```mermaid
flowchart LR
  RPC[Status RPC] --> EVENT[Status event]
  RPC --> N[Notification row]
  RPC --> FEED[Activity feed]
  EVENT --> TRACK[Tracking UI]
  N --> RT[Realtime user]
  RPC --> EDGE[Edge Function opsional]
  EDGE --> MSG[Email / WhatsApp]
```

---

## 9. Kontrak service frontend

Buat query terpusat di `src/lib/supabase/`, bukan di component UI:

```text
src/lib/supabase/client.js
src/lib/supabase/auth.js
src/lib/supabase/profile.js
src/lib/supabase/communities.js
src/lib/supabase/donations.js
src/lib/supabase/insight.js
src/lib/supabase/notifications.js
```

Minimal service:

| Service | Function |
| --- | --- |
| Auth | `signUp`, `signIn`, `signOut`, `resetPassword` |
| Profile | `getMyProfile`, `updateMyProfile`, `uploadAvatar` |
| Community | `listVerifiedCommunities`, `listOpenNeeds`, `getCommunityDetail` |
| Donation | `submitDonation`, `getMyDonations`, `getDonationByCode`, `subscribeDonation` |
| Content | `listPublishedArticles`, `getArticleBySlug` |
| Testimonial | `createTestimonial` |
| Notification | `listMyNotifications`, `markNotificationRead` |

Semua service mengembalikan bentuk yang konsisten:

```js
{ data: null, error: null }
```

---

## 10. Setup Supabase

### Dependency dan environment

```bash
npm install @supabase/supabase-js
```

`.env.local` (jangan commit):

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-or-anon-key>
```

Secret provider WhatsApp/email dan `service_role` disimpan sebagai Supabase Edge Function secrets.

### Checklist dashboard

1. Buat project development.
2. Atur Site URL dan redirect URL local/production.
3. Aktifkan metode Auth yang sudah siap.
4. Jalankan migration berurutan.
5. Aktifkan RLS dan policy.
6. Buat bucket dan policy Storage.
7. Aktifkan publication Realtime untuk tabel yang diperlukan.
8. Seed Sedekas, Dipo Waste Bank, Panti Asuhan Al Jannah, dan Panti Asuhan Kristen Tanah Putih.

---

## 11. Roadmap implementasi

### Fase 0 — Fondasi ✅ SELESAI

- Tambahkan client Supabase dan `.env.example`.
- Buat migration, seed, helper RLS, dan tipe status.
- Pastikan migration dapat dijalankan ulang.

**Lulus jika:** tidak ada service key di browser dan schema development konsisten.

### Fase 1 — Auth dan Profile ✅ SELESAI

- Ganti AuthContext localStorage dengan Supabase Auth.
- Login: email + username lookup via `profiles.email` (kolom baru di migration 0009).
- Register: Supabase signUp + trigger `handle_new_user` simpan full_name, username, email.
- Reset Password: Supabase `resetPasswordForEmail` + PKCE flow `exchangeCodeForSession`.
- Edit Profile: save ke `profiles` table (nama, username, email, phone, birthDate, location).
- Upload Avatar: upload ke `profile-photos` bucket (public, 2MB) + save `avatar_path` ke profiles.
- Avatar Positioning: drag-to-position modal, `objectPosition` CSS.
- Privacy Settings: load/save dari `profile_settings` table (4 toggles).
- Change Password: re-auth + `auth.updateUser({ password })` + timestamp ke `profiles.password_last_updated`.
- Change Email: re-auth + `auth.updateUser({ email })` + sync ke `profiles.email`.
- Change WhatsApp: save ke `profiles.phone`.
- Delete Account: hapus dari `profiles` (cascade ke `profile_settings`) + sign out.

**Lulus jika:** dua akun dapat daftar/login/logout/edit profile/reset password dan tidak dapat melihat data private akun lain.

**Known Issue:** Avatar positioning — upload berhasil tapi preview有时 hilang setelah save. Perlu fix sync state antara `formData.avatar` dan `user.avatar` dari DB.

### Fase 2 — Community dan Insight (SEBAGIAN)

- ProfileOverview: fetch donasi dari `donations` table, fetch komunitas dari `communities` table.
- Stats (Donasi/Tersalur/Simpan) di-compute dari `donations` table.
- Komunitas Mitra: mapped dari `communities` table via slug → logo SVG.
- Status donasi 5 step: pending → verified → pickup → shipping → received.

**Belum:** Pindahkan artikel hardcoded ke database, filter kategori/lokasi.

**Lulus jika:** guest dapat membaca data publik, manager/admin yang dapat mengubahnya.

### Fase 3 — Form dan submit donasi (SEBAGIAN)

- DonationForm: submit ke `donations` table via `donationService.submitDonation()`.
- Photo upload ke `item-photos` bucket (private) + save ke `donation_items` table.
- Slug → UUID resolution untuk `community_id`.
- Status donasi 5 step: pending → verified → pickup → shipping → received.
- Status update via SQL manual (belum ada admin dashboard).
- **Donation page (`/donasi`)**: Aktivitas Donasi & Riwayat masih **hardcode/design** — BE belum di-wire. Menunggu design final.

### Fase 4 — Admin, tracking, realtime

- Buat admin transition dan timeline `/donasi/:donationCode`.
- Hubungkan notifications dan Realtime dengan filter ownership.

**Lulus jika:** admin mengubah status dan pemilik melihat timeline/notifikasi tanpa refresh.

### Fase 5 — Testimoni, newsletter, chat

- Testimoni hanya setelah `received`, lalu moderasi admin.
- Newsletter dan WhatsApp memakai Edge Function jika provider diperlukan.
- Chat dikerjakan setelah membership dan route komunitas siap.

---

## 12. Definition of Done

Backend siap diintegrasikan ke FE jika:

- Migration tersimpan di repository dan bisa dijalankan dari awal.
- RLS diuji dengan anon, user A, user B, manager, dan admin.
- Tidak ada service key di bundle/browser.
- FE memiliki loading, empty, dan error state.
- Submit multi-tabel memakai RPC/transaksi.
- Status donasi memiliki transition rule dan audit event.
- Upload memiliki limit ukuran, MIME, ownership path, dan policy.
- Realtime memiliki filter dan cleanup subscription.
- Edge Function memvalidasi input dan membaca secret dari environment.
- Kontrak service FE didokumentasikan sebelum component UI memakainya.

---

## 13. Urutan kerja tim

```text
1. Finalkan UI Auth dan Form Donasi
2. Migration profiles + communities
3. Hubungkan AuthContext ke Supabase
4. Hubungkan listing komunitas dan profile
5. Finalkan field form donasi
6. RPC submit_donation + Storage
7. Tracking + admin transition
8. Notifications + Realtime
9. Pindahkan artikel, statistik, testimonial
10. Chat dan WhatsApp OTP setelah alur inti stabil
```

Jangan mengerjakan WhatsApp OTP, live chat, atau dashboard admin sebelum Auth, Profile, dan submit donasi dasar stabil. Ketiganya bergantung pada identitas user, role, dan policy yang sama.

## 14. Keamanan

- `localStorage` auth saat ini hanya mode prototype dan harus dihapus dari production.
- Jangan menerima `user_id`, `role`, `is_approved`, `status`, atau `donation_code` dari browser sebagai nilai terpercaya.
- Validasi ulang akses di RLS/RPC.
- Jangan menaruh data pribadi berlebihan di activity feed atau notifikasi publik.
- Gunakan soft disable untuk komunitas/artikel; jangan menghapus histori donasi.
- Log Edge Function tidak boleh memuat token, OTP, nomor telepon, atau alamat lengkap.

Jika UI berubah, update kontrak data dan migration plan di dokumen ini lebih dulu, lalu integrasikan service/component frontend.

---

## 15. WhatsApp OTP — Status & Rencana

**Status saat ini:** Mock (simulasi success setelah delay 700ms)

**Rencana implementasi:** Twilio Trial
- Daftar akun Twilio → dapat $15 trial credit (~2000 SMS)
- Aktifkan **Phone Auth** di Supabase Dashboard → Providers → Phone
- Isi credentials Twilio (Account SID, Auth Token, Messaging Service SID) di Supabase Dashboard
- Ganti `authService.requestWhatsappOtp` dari mock jadi `supabase.auth.signInWithOtp({ phone })`
- Ganti `authService.verifyOtp` dari mock jadi `supabase.auth.verifyOtp({ phone, token, type: 'sms' })`
- Note: Trial Twilio hanya bisa kirim ke nomor yang sudah diverifikasi di dashboard

**Yang perlu didokumentasi setelah implementasi:**
- Twilio Account SID & credentials (simpan di env, jangan commit)
- Nomor yang sudah di-whitelist di Twilio trial
- Flow OTP: signup, reset password, login

---

## 16. Migration Log

| Migration | Isi | Status |
|---|---|---|
| 0001 | Extensions + helpers | ✅ Run |
| 0002 | Profiles + profile_settings + triggers | ✅ Run |
| 0003 | Communities + needs | ✅ Run (seed via 0001_communities.sql) |
| 0004 | Donations + status_events + donation_items | ✅ Run |
| 0005 | Notifications + activity_statistics + RPCs | ✅ Run |
| 0006 | Articles + testimonials + newsletter | ✅ Run |
| 0007 | Chat (rooms + messages) | ✅ Run |
| 0008 | Storage buckets + realtime policies | ✅ Run |
| 0009 | Add email column to profiles | ✅ Run |
| 0010 | Add password_last_updated to profiles | ✅ Run |
| 0011 | Storage policies for item-photos | ✅ Run |
| 0012 | Add pickup & shipping donation statuses | ✅ Run |
| 0013 | DELETE policy for profile-photos | ✅ Run |

**Buckets yang dibuat manual di Dashboard:**
- `profile-photos` — PUBLIC, 2MB, image/jpeg|png|webp
- `item-photos` — PUBLIC, 5MB, image/jpeg|png|webp

---

## 17. Known Issues

- **Avatar positioning**: Upload foto berhasil, tapi `formData.avatar` ter-overwrite oleh `useEffect` sync dari DB. Workaround: sync cuma sekali per user ID. Perlu audit lebih lanjut.
- **Donation photo display**: Foto diambil dari `donation_items.storage_path` via `getPublicUrl`. Belum ditampilkan di card donasi di `/donasi`.
- **Status donasi**: Update status masih manual via SQL. Belum ada admin dashboard atau RPC untuk transition.
- **WhatsApp OTP**: Masih mock. Butuh Twilio trial untuk real SMS.
- **Chat**: Migration ada tapi belum ada frontend integration.
- **Insight articles**: Masih hardcoded di frontend. Perlu fetch dari `articles` table.
