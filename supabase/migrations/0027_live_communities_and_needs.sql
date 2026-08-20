-- Store all community discovery content in Supabase instead of frontend constants.

alter table public.communities
  add column if not exists header_name text,
  add column if not exists category_label text not null default 'Komunitas Mitra',
  add column if not exists donation_rules jsonb not null default '[]'::jsonb;

update public.communities
set
  header_name = 'SEDEKAS',
  category_label = 'Komunitas Barang Layak Pakai',
  description = 'Mengumpulkan dan menyalurkan barang layak pakai untuk membantu masyarakat yang membutuhkan.',
  location = 'Semarang Barat',
  address = 'Jl. Simongan No. 69, Ngemplak Simongan, Semarang Barat, Kota Semarang, 50148',
  logo_path = '/sedekas semarang barat 1.svg',
  social_links = jsonb_set(social_links, '{instagram}', '"@sedekas"'),
  donation_rules = '["Barang bersih dan layak pakai", "Tidak robek atau rusak berat", "Foto barang diperlukan untuk verifikasi", "Penyerahan melalui drop point atau penjemputan terjadwal"]'::jsonb
where slug = 'sedekas';

update public.communities
set
  header_name = 'DIPO WASTE BANK',
  category_label = 'Bank Sampah',
  description = 'Dipo Waste Bank menerima sampah anorganik terpilah dari warga dan civitas UNDIP untuk dikelola secara berkelanjutan.',
  location = 'Tembalang, Semarang',
  address = 'Tempat Pengelolaan Sampah Terpadu (TPST) UNDIP, Universitas Diponegoro, Tembalang, Semarang',
  logo_path = '/dipo waste bank 1.svg',
  social_links = jsonb_set(social_links, '{instagram}', '"@dipowastebank"'),
  donation_rules = '["Sampah harus dipilah berdasarkan jenisnya", "Pastikan sampah bersih dan kering", "Setorkan sampah ke lokasi penimbangan", "Foto setoran diperlukan untuk verifikasi"]'::jsonb
where slug = 'dipo-waste-bank';

update public.communities
set
  header_name = 'PANTI ASUHAN AL-JANNAH',
  category_label = 'Panti Asuhan',
  description = 'Panti Asuhan Al Jannah membina anak yatim, piatu, dan dhuafa melalui pendidikan, tahfidz Al-Quran, serta pemenuhan kebutuhan harian.',
  location = 'Tugu, Semarang',
  address = 'Jl. Tapak No. 53, Tugurejo, Tugu, Kota Semarang, Jawa Tengah',
  logo_path = '/Panji AL JANNAH 1.svg',
  social_links = jsonb_set(social_links, '{instagram}', '"@pantialjannah"'),
  donation_rules = '["Barang baru atau masih layak pakai", "Pakaian bersih, tidak robek, dan pantas digunakan", "Buku dan alat tulis masih dapat digunakan", "Foto barang diperlukan untuk verifikasi"]'::jsonb
where slug = 'panti-asuhan-al-jannah';

update public.communities
set
  header_name = 'Panti Asuhan Kristen Tanah Putih',
  category_label = 'Panti Asuhan',
  description = 'Panti Asuhan Kristen Tanah Putih membina dan merawat anak-anak melalui pendidikan, pembinaan, serta pemenuhan kebutuhan sehari-hari.',
  location = 'Candisari, Semarang',
  address = 'Jl. Dr. Wahidin No. 14, Jomblang, Kec. Candisari, Kota Semarang, Jawa Tengah 50256, Indonesia',
  logo_path = '/Panti asuhan kristen tanah putih 1.svg',
  social_links = jsonb_set(social_links, '{instagram}', '"@pantiasuhankristentanahputih"'),
  donation_rules = '["Barang baru atau masih layak pakai", "Pakaian bersih, tidak robek, dan pantas digunakan", "Kebutuhan kebersihan sebaiknya dalam kemasan baru", "Foto barang diperlukan untuk verifikasi"]'::jsonb
where slug = 'panti-asuhan-kristen-tanah-putih';

-- Align the original seed needs with the labels used by the donation flow.
update public.community_needs set item_name = 'Pakaian & Aksesori', description = 'Pakaian, sepatu, tas, atau aksesori yang bersih dan masih layak pakai' where item_name = 'Pakaian Anak 3-12 Tahun';
update public.community_needs set item_name = 'Buku & Perlengkapan Belajar', description = 'Buku bacaan, buku pelajaran, alat tulis, tas, atau perlengkapan sekolah' where item_name = 'Buku Pelajaran SD-SMP';
update public.community_needs set item_name = 'Botol Plastik', description = 'Botol minuman plastik yang sudah dikosongkan dan dipisahkan dari sisa cairan' where item_name = 'Botol Plastik Bekas';
update public.community_needs set item_name = 'Kertas', category = 'buku_atk', description = 'Kertas HVS, buku, atau majalah dalam kondisi bersih dan kering' where item_name = 'Kerajinan Tangan Daur Ulang';
update public.community_needs set item_name = 'Pakaian Layak Pakai', description = 'Pakaian anak yang bersih dan masih layak digunakan' where item_name = 'Pakaian Dewasa dan Anak';
update public.community_needs set item_name = 'Buku & Alat Tulis', description = 'Buku pelajaran, buku bacaan, tas, dan alat tulis' where item_name = 'Alat Tulis dan Buku Tulis';
update public.community_needs set item_name = 'Keperluan Harian', description = 'Sabun, sampo, deterjen, atau kebutuhan kebersihan lainnya' where item_name = 'Perlengkapan Bayi Bekas';
update public.community_needs set item_name = 'Pakaian & Sepatu', description = 'Pakaian, sepatu, atau sandal yang bersih dan masih layak pakai' where item_name = 'Pakaian Musim Dingin';

with missing(slug, category, item_name, description, quantity_needed) as (
  values
    ('sedekas', 'barang_bekas', 'Mainan Anak', 'Mainan atau perlengkapan anak yang aman, bersih, dan masih berfungsi', 40),
    ('sedekas', 'barang_bekas', 'Peralatan Rumah Tangga', 'Peralatan rumah atau barang fungsional yang masih layak digunakan', 30),
    ('dipo-waste-bank', 'barang_bekas', 'Kardus', 'Kardus bekas yang bersih, kering, dan tidak tercampur sampah basah', 100),
    ('dipo-waste-bank', 'barang_bekas', 'Kaleng & Logam', 'Kaleng aluminium atau logam bekas yang sudah dipilah dan aman', 100),
    ('panti-asuhan-al-jannah', 'barang_bekas', 'Sembako & Kebutuhan Harian', 'Beras, minyak, gula, susu, dan perlengkapan dapur', 80),
    ('panti-asuhan-al-jannah', 'barang_bekas', 'Kebersihan & Kesehatan', 'Sabun, sampo, pasta gigi, detergen, dan vitamin', 60),
    ('panti-asuhan-kristen-tanah-putih', 'buku_atk', 'Buku & Alat Tulis', 'Buku pelajaran, buku bacaan, tas, atau alat tulis untuk anak panti', 80),
    ('panti-asuhan-kristen-tanah-putih', 'barang_bekas', 'Makanan & Sembako', 'Beras, minyak, gula, susu, atau kebutuhan pokok lainnya', 80)
)
insert into public.community_needs (community_id, category, item_name, description, quantity_needed, status)
select communities.id, missing.category, missing.item_name, missing.description, missing.quantity_needed, 'open'
from missing
join public.communities on communities.slug = missing.slug
where not exists (
  select 1 from public.community_needs existing
  where existing.community_id = communities.id and existing.item_name = missing.item_name
);
