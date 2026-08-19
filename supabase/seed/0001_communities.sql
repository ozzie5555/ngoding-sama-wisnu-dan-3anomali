-- ============================================================
-- Seed: 4 Verified Communities (safe to re-run)
-- ============================================================

INSERT INTO public.communities (name, slug, description, location, address, is_verified, is_active) VALUES
(
  'Sedekas',
  'sedekas',
  'Komunitas peduli sesama yang bergerak di bidang pendidikan dan kemanusiaan. Menerima donasi pakaian layak, buku, dan barang bekas untuk disalurkan ke yang membutuhkan.',
  'Kota Semarang, Jawa Tengah',
  'Jl. Pandanaran No. 1, Semarang Tengah, Kota Semarang',
  true,
  true
),
(
  'Dipo Waste Bank',
  'dipo-waste-bank',
  'Bank sampah yang mengelola limbah rumah tangga menjadi barang bermanfaat. Menerima donasi barang bekas dan karya daur ulang untuk program daur ulang komunitas.',
  'Kota Semarang, Jawa Tengah',
  'Jl. Mugasari I No. 3, Semarang Selatan, Kota Semarang',
  true,
  true
),
(
  'Panti Asuhan Al Jannah',
  'panti-asuhan-al-jannah',
  'Panti asuhan yang menampung anak-anak yatim piatu. Menerima donasi pakaian layak, buku pelajaran, dan kebutuhan sehari-hari anak-anak asuh.',
  'Kota Semarang, Jawa Tengah',
  'Jl. Al Jannah No. 10, Gajah Mungkur, Kota Semarang',
  true,
  true
),
(
  'Panti Asuhan Kristen Tanah Putih',
  'panti-asuhan-kristen-tanah-putih',
  'Panti asuhan kristen yang melayani anak-anak kurang mampu. Menerima donasi pakaian, buku ATK, dan barang bekas layak pakai.',
  'Kota Semarang, Jawa Tengah',
  'Jl. Tanah Putih No. 25, Semarang Utara, Kota Semarang',
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Seed: Community Needs (safe to re-run)
-- ============================================================

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'pakaian_layak', 'Pakaian Anak 3-12 Tahun', 'Pakaian layak pakai untuk anak-anak usia 3-12 tahun', 50, 12, 'open'
FROM public.communities c WHERE c.slug = 'sedekas'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Pakaian Anak 3-12 Tahun');

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'buku_atk', 'Buku Pelajaran SD-SMP', 'Buku pelajaran bekas untuk siswa SD dan SMP', 100, 34, 'open'
FROM public.communities c WHERE c.slug = 'sedekas'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Buku Pelajaran SD-SMP');

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'barang_bekas', 'Botol Plastik Bekas', 'Botol plastik bekas untuk program daur ulang kerajinan tangan', 200, 87, 'open'
FROM public.communities c WHERE c.slug = 'dipo-waste-bank'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Botol Plastik Bekas');

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'karya_daur_ulang', 'Kerajinan Tangan Daur Ulang', 'Contoh kerajinan tangan dari bahan daur ulang untuk edukasi', 20, 5, 'open'
FROM public.communities c WHERE c.slug = 'dipo-waste-bank'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Kerajinan Tangan Daur Ulang');

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'pakaian_layak', 'Pakaian Dewasa dan Anak', 'Pakaian layak pakai untuk penghuni panti', 75, 28, 'open'
FROM public.communities c WHERE c.slug = 'panti-asuhan-al-jannah'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Pakaian Dewasa dan Anak');

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'buku_atk', 'Alat Tulis dan Buku Tulis', 'ATK dan buku tulis untuk kegiatan belajar anak-anak', 150, 67, 'open'
FROM public.communities c WHERE c.slug = 'panti-asuhan-al-jannah'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Alat Tulis dan Buku Tulis');

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'barang_bekas', 'Perlengkapan Bayi Bekas', 'Perlengkapan bayi layak pakai (baju, selimut, dot)', 40, 15, 'open'
FROM public.communities c WHERE c.slug = 'panti-asuhan-kristen-tanah-putih'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Perlengkapan Bayi Bekas');

INSERT INTO public.community_needs (community_id, category, item_name, description, quantity_needed, quantity_received, status)
SELECT c.id, 'pakaian_layak', 'Pakaian Musim Dingin', 'Pakaian hangat untuk anak-anak panti', 30, 8, 'open'
FROM public.communities c WHERE c.slug = 'panti-asuhan-kristen-tanah-putih'
AND NOT EXISTS (SELECT 1 FROM public.community_needs cn WHERE cn.community_id = c.id AND cn.item_name = 'Pakaian Musim Dingin');

-- ============================================================
-- Seed: Sample Articles (safe to re-run)
-- ============================================================

INSERT INTO public.articles (title, slug, content, excerpt, category, author_name, is_published, published_at) VALUES
(
  'Pentingnya Daur Ulang dalam Kehidupan Sehari-hari',
  'pentingnya-daur-ulang',
  'Daur ulang adalah proses mengubah limbah atau bahan bekas menjadi produk baru yang dapat digunakan kembali. Dalam konteks lingkungan, daur ulang memiliki peran penting dalam mengurangi jumlah sampah yang berakhir di tempat pembuangan akhir...',
  'Pelajari mengapa daur ulang penting dan bagaimana kamu bisa mulai melakukannya hari ini.',
  'artikel_edukasi',
  'Tim KEMBALI',
  true,
  now()
),
(
  'Dampak Fast Fashion terhadap Lingkungan',
  'dampak-fast-fashion',
  'Industri fashion merupakan salah industri terbesar yang berkontribusi terhadap polusi lingkungan. Setiap tahun, jutaan ton pakaian berakhir di tempat pembuangan sampah...',
  'Kenali dampak fast fashion dan temukan solusi berkelanjutan melalui donasi pakaian.',
  'berita_lingkungan',
  'Tim KEMBALI',
  true,
  now()
),
(
  'Mengenal Bank Sampah: Solusi Pengelolaan Limbah Komunitas',
  'mengenal-bank-sampah',
  'Bank sampah adalah sebuah tempat atau lembaga yang menghimpun sampah dari pengelola atau pengepul sampah untuk kemudian dipilah, diolah, dan didaur ulang menjadi produk yang lebih bernilai...',
  'Bagaimana bank sampah bekerja dan bagaimana kamu bisa berkontribusi.',
  'hasil_riset',
  'Tim KEMBALI',
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;
