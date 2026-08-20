// Structured dummy data for easy replacement with backend API in the future

export const DEFAULT_USER = {
  name: 'Pengguna',
  shortName: 'Pengguna',
  username: '@pengguna',
  email: '',
  phone: '',
  birthDate: '',
  location: '',
  status: 'Donatur Aktif',
  avatar: '/src/assets/images/profile-placeholder.svg',
  stats: {
    donations: 0,
    distributed: 0,
    saved: 0,
  },
  passwordLastUpdated: '',
  whatsapp: '',
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
