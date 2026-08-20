-- Move Insight cards and detail content into Supabase.

alter table public.articles
  add column if not exists tags text[] not null default '{}',
  add column if not exists content_type text not null default 'article'
    check (content_type in ('article', 'news', 'promo')),
  add column if not exists is_featured boolean not null default false,
  add column if not exists cta_text text,
  add column if not exists cta_link text;

-- Authenticated users must not be able to bypass publication status and read drafts.
drop policy if exists "authenticated read articles" on public.articles;

-- Remove only the original development seed so the canonical Insight content replaces it.
delete from public.articles
where slug in ('pentingnya-daur-ulang', 'dampak-fast-fashion', 'mengenal-bank-sampah');

insert into public.articles (
  title, slug, content, excerpt, cover_path, category, tags, content_type,
  author_name, is_featured, cta_text, cta_link, is_published, published_at
) values
(
  'Ide Daur Ulang Sampah', 'ide-daur-ulang-sampah',
  E'Sampah rumah tangga sering dianggap tidak berguna setelah digunakan. Padahal, botol plastik, kardus, kaleng, kaos, dan celana jeans masih dapat dimanfaatkan menjadi barang baru.\n\nBotol plastik dapat menjadi pot tanaman, kardus dapat disusun menjadi organizer, dan kaleng bersih dapat dihias menjadi tempat alat tulis. Pakaian lama juga dapat dialihfungsikan menjadi tas atau dompet sederhana.\n\nKebiasaan menggunakan kembali barang membantu mengurangi sampah sekaligus melatih kreativitas. Mulailah dari satu barang yang tersedia di rumah dan pastikan prosesnya aman.',
  'Berbagai ide sederhana untuk mengubah barang bekas menjadi sesuatu yang kembali berguna.',
  '/insight/article-01.svg', 'recycle_upcycle', array['Recycle', 'Environment'], 'article',
  'KEMBALI', false, 'Visit Now', null, true, '2026-08-19 08:00:00+07'
),
(
  'Donasi Barang Bekas: Dari Barang Tak Terpakai Menjadi Manfaat', 'donasi-barang-bekas-menjadi-manfaat',
  E'Barang yang tidak lagi digunakan bukan berarti kehilangan nilai. Pakaian, buku, tas, mainan, dan perlengkapan rumah masih dapat membantu orang lain jika kondisinya layak.\n\nSebelum berdonasi, pilih barang yang masih aman dan berfungsi. Bersihkan barang, kelompokkan berdasarkan jenisnya, lalu pastikan barang tersebut sesuai dengan kebutuhan penerima.\n\nGunakan komunitas atau platform penyaluran yang jelas agar proses donasi dapat dipantau dan barang benar-benar sampai kepada pihak yang membutuhkan.',
  'Panduan menyiapkan dan menyalurkan barang bekas agar memberikan manfaat yang tepat.',
  '/insight/article-02.svg', 'artikel_edukasi', array['Recycle', 'Social'], 'article',
  'KEMBALI', false, 'Visit Now', null, true, '2026-08-18 08:00:00+07'
),
(
  'Ekonomi Sirkular: Mengubah Sampah Menjadi Sumber Daya', 'ekonomi-sirkular-sumber-daya',
  E'Ekonomi sirkular menjaga barang dan material tetap digunakan selama mungkin. Barang tidak langsung dibuang, melainkan diperbaiki, digunakan kembali, didonasikan, atau diolah menjadi produk baru.\n\nPenerapan ekonomi sirkular dapat mengurangi sampah di tempat pembuangan akhir dan menekan kebutuhan bahan baku baru. Konsep ini juga membuka peluang ekonomi melalui perbaikan, penggunaan kembali, dan pengolahan material.\n\nMasyarakat dapat berkontribusi dengan merawat barang, membeli seperlunya, memilah sampah, dan menyalurkan barang layak pakai kepada orang yang membutuhkannya.',
  'Mengenal cara ekonomi sirkular mempertahankan nilai barang dan mengurangi limbah.',
  '/insight/article-03.svg', 'hasil_riset', array['Social', 'Economy', 'Environment'], 'article',
  'KEMBALI', false, 'Visit Now', null, true, '2026-08-17 08:00:00+07'
),
(
  'Yuk, Kenali Cara Berdonasi yang Aman dan Tepat', 'cara-berdonasi-aman-dan-tepat',
  E'Berdonasi perlu dilakukan dengan bijak agar bantuan sampai kepada pihak yang membutuhkan. Kenali pihak pengelola, periksa tujuan penggunaan donasi, dan pastikan informasinya dapat dipercaya.\n\nPilih bentuk bantuan yang benar-benar dibutuhkan. Jika memberikan barang, pastikan kondisinya bersih, aman, dan masih layak digunakan agar tidak menjadi beban bagi penerima.\n\nPerhatikan transparansi penyaluran dan jangan mengambil keputusan hanya karena tekanan. Kehati-hatian membantu memastikan setiap kepedulian menghasilkan manfaat nyata.',
  'Langkah sederhana memeriksa kredibilitas dan transparansi sebelum berdonasi.',
  '/insight/article-04.svg', 'artikel_edukasi', array['Social', 'Safety', 'Environment'], 'article',
  'KEMBALI', false, 'Visit Now', null, true, '2026-08-16 08:00:00+07'
),
(
  'Gempa M7,7 Guncang Nagekeo, 47 Orang Meninggal dan Ratusan Bangunan Rusak', 'gempa-nagekeo-2026',
  E'Gempa bermagnitudo 7,7 mengguncang wilayah Nagekeo, Nusa Tenggara Timur. Guncangan dirasakan di sejumlah wilayah dan sempat memicu peringatan dini tsunami.\n\nBerdasarkan pemutakhiran data, puluhan orang meninggal dan ratusan rumah serta fasilitas umum mengalami kerusakan. Pendataan masih terus dilakukan oleh pihak terkait.\n\nPeristiwa ini kembali menunjukkan pentingnya kesiapsiagaan, informasi resmi, dan dukungan yang terkoordinasi bagi masyarakat terdampak.',
  'Informasi dampak gempa Nagekeo dan pentingnya kesiapsiagaan bencana.',
  '/insight/news-01.svg', 'berita_lingkungan', array['Social', 'Disaster', 'Environment'], 'news',
  'KEMBALI', false, 'Baca Selengkapnya', null, true, '2026-08-15 08:00:00+07'
),
(
  'Beri Kesempatan Kedua untuk Barangmu. Donasikan melalui KEMBALI!', 'beri-kesempatan-kedua-untuk-barangmu',
  'Salurkan barang layak pakai kepada komunitas terverifikasi melalui KEMBALI.',
  'Mulai donasi dan berikan kesempatan kedua untuk barangmu.',
  null, 'berita_lingkungan', array['Social', 'Recycle', 'Environment'], 'promo',
  'KEMBALI', true, 'Donasi Sekarang', '/donasi', true, '2026-03-19 08:00:00+07'
),
(
  'Bank Sampah: Dari Proyek Komunitas Menjadi Infrastruktur Resmi', 'bank-sampah-infrastruktur-resmi',
  E'Bank sampah di Indonesia berkembang dari gerakan komunitas menjadi bagian penting dalam pengelolaan material terpilah. Jaringan bank sampah membantu menghubungkan rumah tangga, pemilah, dan pengolah material.\n\nSejumlah kota mulai memperlakukan bank sampah sebagai infrastruktur pengumpulan resmi. Integrasi tersebut mendukung pemilahan dari sumber dan memperkuat rantai ekonomi sirkular.\n\nDukungan data, tata kelola, serta kolaborasi pemerintah dan komunitas diperlukan agar manfaat lingkungan dan ekonomi dapat terus berkembang.',
  'Perkembangan bank sampah sebagai bagian resmi dari sistem pengelolaan sampah kota.',
  '/insight/news-03.svg', 'berita_lingkungan', array['Recycle', 'Environment'], 'news',
  'KEMBALI', false, 'Baca Selengkapnya', null, true, '2026-01-14 08:00:00+07'
)
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  excerpt = excluded.excerpt,
  cover_path = excluded.cover_path,
  category = excluded.category,
  tags = excluded.tags,
  content_type = excluded.content_type,
  author_name = excluded.author_name,
  is_featured = excluded.is_featured,
  cta_text = excluded.cta_text,
  cta_link = excluded.cta_link,
  is_published = excluded.is_published,
  published_at = excluded.published_at;
