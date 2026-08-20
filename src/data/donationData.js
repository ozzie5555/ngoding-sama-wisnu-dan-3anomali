/**
 * Centralized Donation & Activity Data Layer for KEMBALI
 * Provides single source of truth for Donation, DonationHistory, Profile, and ProfileHistory.
 */

export const INITIAL_DONATIONS = [
  {
    id: 'don-1',
    title: 'Buku Pelajaran SMP',
    category: 'Buku & Alat Tulis',
    categoryKey: 'buku_atk',
    image: '/buku-pelajarn.svg',
    destination: 'Panti Asuhan Kristen Tanah Putih',
    destinationFull: 'Panti Asuhan Kristen Tanah Putih · Semarang',
    location: 'Semarang',
    date: '4 Agustus 2026',
    submittedAt: '2026-08-04T10:30:00Z',
    status: 'completed', // completed | delivery | confirmation | pickup | cancelled | error | warning
    statusLabel: 'Donasi Diterima',
    stepIndex: 5, // 1: Form, 2: Konfirmasi, 3: Pengambilan, 4: Pengiriman, 5: Donasi Diterima
    stepStatus: 'completed',
    reviewSubmitted: false,
    reviewText: '',
    quantity: 6,
    conditionNote: 'Layak Pakai',
    description: '6 buah buku pelajaran SMP layak pakai untuk adik-adik panti.',
    tags: ['SMP', 'Layak Pakai', '6 Barang', 'Terverifikasi'],
    optionChosenNote: '(sesuai opsi yang sudah dipilih)',
  },
  {
    id: 'don-2',
    title: 'Pakaian Layak Pakai',
    category: 'Pakaian Layak',
    categoryKey: 'pakaian_layak',
    image: '/girl-doing-shopping-with-cart-2194198-0.svg',
    destination: 'Sedekas Semarang Barat',
    destinationFull: 'Sedekas · Semarang Barat',
    location: 'Semarang Barat',
    date: '10 Agustus 2026',
    submittedAt: '2026-08-10T14:15:00Z',
    status: 'delivery',
    statusLabel: 'Dalam Perjalanan',
    stepIndex: 4,
    stepStatus: 'active',
    reviewSubmitted: false,
    reviewText: '',
    quantity: 10,
    conditionNote: 'Layak Pakai',
    description: '10 potong pakaian bersih, tidak robek, dan siap didistribusikan.',
    tags: ['Pakaian', 'Layak Pakai', '10 Barang', 'Terverifikasi'],
    optionChosenNote: '(sesuai opsi yang sudah dipilih)',
  },
  {
    id: 'don-3',
    title: 'Buku & Alat Tulis',
    category: 'Buku & Alat Tulis',
    categoryKey: 'buku_atk',
    image: '/student-studying.svg',
    destination: 'Panti Asuhan Al Jannah',
    destinationFull: 'Panti Asuhan Al Jannah · Semarang',
    location: 'Semarang',
    date: '15 Agustus 2026',
    submittedAt: '2026-08-15T09:00:00Z',
    status: 'confirmation',
    statusLabel: 'Sedang Dikonfirmasi',
    stepIndex: 2,
    stepStatus: 'active',
    reviewSubmitted: false,
    reviewText: '',
    quantity: 12,
    conditionNote: 'Sangat Baik',
    description: 'Paket buku tulis dan perlengkapan sekolah dasar.',
    tags: ['Buku & ATK', 'Alat Tulis', '12 Barang', 'Dalam Proses'],
    optionChosenNote: '(sesuai opsi yang sudah dipilih)',
  },
  {
    id: 'don-4',
    title: 'Mainan Edukatif Anak',
    category: 'Barang Bekas',
    categoryKey: 'barang_bekas',
    image: '/abandoned-cart.svg',
    destination: 'Sedekas Semarang Barat',
    destinationFull: 'Sedekas · Semarang Barat',
    location: 'Semarang Barat',
    date: '18 Agustus 2026',
    submittedAt: '2026-08-18T11:20:00Z',
    status: 'pickup',
    statusLabel: 'Pengambilan',
    stepIndex: 3,
    stepStatus: 'active',
    reviewSubmitted: false,
    reviewText: '',
    quantity: 5,
    conditionNote: 'Layak Pakai',
    description: 'Mainan balok susun dan puzzle edukasi anak.',
    tags: ['Mainan', 'Edukatif', '5 Barang', 'Dalam Proses'],
    optionChosenNote: '(sesuai opsi yang sudah dipilih)',
  },
  {
    id: 'don-5',
    title: 'Seragam Sekolah SD',
    category: 'Pakaian Layak',
    categoryKey: 'pakaian_layak',
    image: '/pakaian-layak.svg',
    destination: 'Panti Asuhan Al Jannah',
    destinationFull: 'Panti Asuhan Al Jannah · Semarang',
    location: 'Semarang',
    date: '22 Juli 2026',
    submittedAt: '2026-07-22T08:45:00Z',
    status: 'cancelled',
    statusLabel: 'Dibatalkan',
    stepIndex: 2,
    stepStatus: 'error',
    reviewSubmitted: false,
    reviewText: '',
    quantity: 4,
    conditionNote: 'Kurang Layak',
    description: 'Donasi dibatalkan karena kondisi barang memerlukan perbaikan sebelum disalurkan.',
    tags: ['Seragam', '4 Barang', 'Dibatalkan'],
    optionChosenNote: '(sesuai opsi yang sudah dipilih)',
  },
];

export const COMMUNITY_ACTIVITIES = [
  {
    id: 'comm-act-1',
    communityName: 'Panti Asuhan Kristen Tanah Putih',
    image: '/Panti asuhan kristen tanah putih 1.svg',
    activity: 'Penerimaan Buku Pelajaran SMP',
    description: '6 buku pelajaran SMP berhasil diterima dan didistribusikan kepada anak-anak panti.',
    date: '4 Agustus 2026',
    status: 'Selesai',
    location: 'Candisari, Semarang',
  },
  {
    id: 'comm-act-2',
    communityName: 'Sedekas',
    image: '/sedekas semarang barat 1.svg',
    activity: 'Penyaluran Pakaian Layak Pakai',
    description: '10 potong pakaian sedang dalam proses pengiriman ke posko Semarang Barat.',
    date: '10 Agustus 2026',
    status: 'Dalam Proses',
    location: 'Semarang Barat',
  },
  {
    id: 'comm-act-3',
    communityName: 'Panti Asuhan Al Jannah',
    image: '/Panji AL JANNAH 1.svg',
    activity: 'Verifikasi Kebutuhan Buku & Alat Tulis',
    description: 'Pengajuan donasi buku dan alat tulis sedang diverifikasi oleh koordinator panti.',
    date: '15 Agustus 2026',
    status: 'Konfirmasi',
    location: 'Tugu, Semarang',
  },
  {
    id: 'comm-act-4',
    communityName: 'Dipo Waste Bank',
    image: '/dipo waste bank 1.svg',
    activity: 'Setoran Sampah Anorganik',
    description: 'Penyetoran 5kg kardus dan kertas bersih terpilah telah tercatat.',
    date: '18 Juli 2026',
    status: 'Selesai',
    location: 'Tembalang, Semarang',
  },
];

const STORAGE_KEY = 'kembali_donations_data';

export const getStoredDonations = () => {
  if (typeof window === 'undefined') return INITIAL_DONATIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DONATIONS));
      return INITIAL_DONATIONS;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Error reading stored donations:', err);
    return INITIAL_DONATIONS;
  }
};

export const saveStoredDonations = (donations) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
  } catch (err) {
    console.error('Error saving donations to storage:', err);
  }
};

export const getDonationById = (id) => {
  const donations = getStoredDonations();
  return donations.find((d) => d.id === id || String(d.id) === String(id)) || null;
};

export const getActiveDonation = () => {
  const donations = getStoredDonations();
  // Find first active/in-progress donation (delivery, pickup, confirmation, etc.), or fallback to first item
  const active = donations.find((d) => ['delivery', 'pickup', 'confirmation'].includes(d.status));
  return active || donations[0] || INITIAL_DONATIONS[0];
};

export const submitDonationReview = (donationId, reviewText) => {
  const donations = getStoredDonations();
  const updated = donations.map((d) => {
    if (d.id === donationId || String(d.id) === String(donationId)) {
      return {
        ...d,
        reviewSubmitted: true,
        reviewText: reviewText,
        reviewedAt: new Date().toISOString(),
      };
    }
    return d;
  });
  saveStoredDonations(updated);
  return updated.find((d) => d.id === donationId || String(d.id) === String(donationId));
};

export const getCommunityActivities = () => {
  return COMMUNITY_ACTIVITIES;
};
