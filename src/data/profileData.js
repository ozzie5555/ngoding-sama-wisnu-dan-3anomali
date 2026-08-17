// Structured dummy data for easy replacement with backend API in the future

export const DEFAULT_USER = {
  name: 'Wisnu Megananda',
  shortName: 'Wisnu',
  username: '@wisnu_bersama_3_anomali',
  email: 'wisnubrsm3anomali@gmail.com',
  phone: 'contoh: +62 812-XXXX-XXXX',
  birthDate: 'DD/MM/YYYY',
  location: 'Kota Semarang, Jawa Tengah',
  status: 'Donatur Aktif',
  avatar: '/src/assets/images/profile-placeholder.svg', // Replace with final Figma asset
  stats: {
    donations: 8,
    distributed: 6,
    saved: 4,
  },
  passwordLastUpdated: '12 Agustus 2026',
  whatsapp: 'Diperlukan untuk koordinasi donasi',
  privacy: {
    contributionVisibility: true,
    generalLocation: false,
    impactReport: true,
    donationHistory: true,
  },
}

// Mock donation activities
export const DUMMY_ACTIVITIES = [
  {
    id: 'act-1',
    image: '/buku-pelajarn.svg',
    title: 'Buku Pelajaran SMP',
    recipient: 'Untuk Panti Asuhan Al Jannah',
    description: '6 buku pelajaran layak pakai. Diajukan pada 4 Agustus 2026',
    tags: ['Pendidikan', 'Layak Pakai', '6 Barang', 'Disalurkan'],
    actionText: 'Lihat Detail',
  },
  {
    id: 'act-2',
    image: '/pakaian-layak.svg',
    title: 'Pakaian Layak Pakai',
    recipient: 'Untuk Sedekas Semarang',
    description: '10 potong pakaian bersih dan layak pakai. Diajukan pada 10 Agustus 2026',
    tags: ['Pakaian', 'Layak Pakai', '10 Barang', 'Disalurkan'],
    actionText: 'Lacak Donasi',
  },
]

// Mock community partners related to user donations
export const DUMMY_PARTNERS = [
  {
    id: 'partner-1',
    image: '/sedekas.svg',
    title: 'Sedekas',
    description: 'Mengumpulkan dan menyalurkan barang bekas layak pakai agar kembali bermanfaat.',
  },
  {
    id: 'partner-2',
    image: '/panti-asuhan.svg',
    title: 'Panti Asuhan Al Jannah',
    description: 'Membina anak yatim, piatu, dan dhuafa melalui pendidikan serta pembinaan tahfidz Al-Qur’an.',
  },
]
