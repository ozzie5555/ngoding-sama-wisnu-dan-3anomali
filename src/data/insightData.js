// Centralized data structure for Insight Page
// All content and temporary images are defined here for easy editing and manual replacement later.

export const insightImages = {
  // TODO: Replace with final Insight hero image
  hero: '/insight/hero-illustration.svg',

  // Articles By KEMBALI
  // TODO: Replace with final Article 1 image
  article1: '/insight/article-01.svg',
  // TODO: Replace with final Article 2 image
  article2: '/insight/article-02.svg',
  // TODO: Replace with final Article 3 image
  article3: '/insight/article-03.svg',
  // TODO: Replace with final Article 4 image
  article4: '/insight/article-04.svg',

  // Article 1 Accordions
  // TODO: Replace with final accordion images
  accordion1: '/insight/accordion-01.svg',
  accordion2: '/insight/accordion-02.svg',
  accordion3: '/insight/accordion-03.svg',
  accordion4: '/insight/accordion-04.svg',
  accordion5: '/insight/accordion-05.svg',

  // Article 3 Assets
  bannerArticle3: '/insight/banner-article-3.svg',
  actionDonate: '/insight/action-donate.svg',
  actionRecycle: '/insight/action-recycle.svg',
  actionRepair: '/insight/action-repair.svg',
  actionReuse: '/insight/action-reuse.svg',

  // News For You
  // TODO: Replace with final News 1 image
  news1: '/insight/news-01.svg',
  // TODO: Replace with final News 3 image
  news3: '/insight/news-03.svg',

  // Educational Videos
  // TODO: Replace with final Video 1 thumbnail
  video1: '/insight/video-01.svg',
  // TODO: Replace with final Video 2 thumbnail
  video2: '/insight/video-02.svg',
  // TODO: Replace with final Video 3 thumbnail
  video3: '/insight/video-03.svg',

  // Impact Illustration
  impactIllustration: '/Donation Streamline Bruxelles.svg',
}

export const heroData = {
  eyebrow: 'Temukan berbagai informasi dan edukasi',
  titleLine1: 'Informasi untuk Menginspirasi',
  titleLine2: 'Aksi',
  description:
    'Jelajahi berita dan konten edukatif tentang lingkungan, sosial, dan berbagai cara untuk berkontribusi bersama KEMBALI.',
  primaryBtnText: 'Jelajahi Sekarang',
  secondaryBtnText: 'Hubungi Kami',
  image: insightImages.hero, // TODO: Replace with final image
}

export const articlesData = [
  {
    id: 'article-1',
    number: '01',
    title: 'Ide Daur Ulang Sampah',
    categories: ['Recycle', 'Environment'],
    date: '19 AUG 2026',
    detailDate: '15 AUG 2026',
    author: 'By KEMBALI',
    image: insightImages.article1, // TODO: Replace with final image
    ctaText: 'Visit Now',
    intro:
      'Sampah rumah tangga sering kali dianggap tidak berguna setelah digunakan. Padahal, beberapa jenis sampah masih dapat dimanfaatkan kembali menjadi barang yang memiliki fungsi dan nilai. Dengan sedikit kreativitas, kita bisa mengurangi jumlah sampah sekaligus menciptakan sesuatu yang bermanfaat.',
    subIntro: 'Berikut beberapa ide sederhana yang bisa dicoba di rumah:',
    accordions: [
      {
        id: 'acc-1',
        number: '01',
        title: 'Botol Plastik Menjadi Pot Tanaman',
        image: insightImages.accordion1, // TODO: Replace with final image
        description:
          'Botol plastik bekas dapat dimanfaatkan menjadi pot tanaman sederhana. Potong bagian botol sesuai ukuran yang diinginkan, buat beberapa lubang kecil di bagian bawah untuk drainase, lalu hias menggunakan cat atau bahan dekorasi lainnya. Pot ini cocok digunakan untuk menanam tanaman kecil seperti tanaman hias, cabai, atau berbagai tanaman herbal. Botol juga dapat digantung sehingga menjadi dekorasi sederhana untuk rumah.',
        activeColor: '#DDF3EE',
        textColor: '#062632',
      },
      {
        id: 'acc-2',
        number: '02',
        title: 'Kardus Bekas Menjadi Organizer',
        image: insightImages.accordion2, // TODO: Replace with final image
        description:
          'Kardus bekas dapat diubah menjadi organizer untuk menyimpan berbagai barang kecil seperti alat tulis, kaos kaki, atau perlengkapan lainnya. Potong kardus sesuai bentuk yang diinginkan, kemudian rekatkan dan lapisi dengan kertas kado, kain, atau bahan dekorasi lainnya. Selain mudah dibuat, organizer dari kardus dapat disesuaikan dengan ukuran dan kebutuhan. Dengan begitu, meja atau ruang penyimpanan menjadi lebih rapi tanpa harus membeli organizer baru.',
        activeColor: '#808964',
        textColor: '#FFFFFF',
      },
      {
        id: 'acc-3',
        number: '03',
        title: 'Kaleng Bekas Menjadi Tempat Alat Tulis',
        image: insightImages.accordion3, // TODO: Replace with final image
        description:
          'Kaleng bekas makanan atau minuman dapat dibersihkan dan dialihfungsikan menjadi tempat pensil atau kuas. Lapisi permukaan kaleng dengan cat, tali rami, atau stiker agar terlihat lebih menarik. Selain hemat biaya, penggunaan kaleng bekas ini juga membantu mengurangi limbah kaleng di rumah.',
        activeColor: '#0197D2',
        textColor: '#FFFFFF',
      },
      {
        id: 'acc-4',
        number: '04',
        title: 'Tote Bag dari Kaos Bekas Tidak Terpakai',
        image: insightImages.accordion4, // TODO: Replace with final image
        description:
          'Kaos bekas yang sudah tidak terpakai bisa disulap menjadi tote bag sederhana tanpa perlu dijahit. Potong bagian lengan dan kerah, kemudian ikat bagian bawah kaos dengan kuat. Tote bag ini dapat digunakan untuk berbelanja atau membawa barang sehari-hari, sekaligus mengurangi penggunaan kantong plastik sekali pakai.',
        activeColor: '#3FBEC7',
        textColor: '#062632',
      },
      {
        id: 'acc-5',
        number: '05',
        title: 'Dompet dari Celana Jeans',
        image: insightImages.accordion5, // TODO: Replace with final image
        description:
          'Celana jeans yang sudah tidak digunakan dapat dimanfaatkan menjadi dompet kecil. Bagian saku jeans dapat dilepas dan dijahit kembali dengan tambahan ritsleting atau kancing untuk membuat tempat penyimpanan yang praktis. Dompet dari jeans bekas dapat digunakan untuk menyimpan uang, kartu, atau barang-barang kecil lainnya. Tekstur jeans yang kuat juga membuatnya cukup tahan untuk digunakan sehari-hari.',
        activeColor: '#248689',
        textColor: '#FFFFFF',
      },
    ],
  },
  {
    id: 'article-2',
    number: '02',
    title: 'Donasi Barang Bekas: Dari Barang Tak Terpakai Menjadi Manfaat',
    categories: ['Recycle', 'Environment'],
    date: '19 AUG 2026',
    detailDate: '15 AUG 2026',
    author: 'By KEMBALI',
    image: insightImages.article2, // TODO: Replace with final image
    ctaText: 'Visit Now',
    intro:
      'Barang yang sudah tidak kita gunakan bukan berarti sudah tidak memiliki nilai. Pakaian yang memenuhi lemari, buku yang sudah selesai dibaca, atau perlengkapan rumah tangga yang jarang digunakan masih dapat memberikan manfaat bagi orang lain.',
    subIntro:
      'Melalui donasi barang bekas, kita dapat memperpanjang masa guna suatu barang sekaligus membantu mereka yang membutuhkan. Berikut beberapa hal yang perlu diperhatikan sebelum mendonasikan barang:',
    // Color interaction sequence: #0197D2, #3FBEC7, #248689, #808964
    interactionColors: ['#0197D2', '#3FBEC7', '#248689', '#808964'],
    // Exact numbering from PDF preserved: 01, 02, 03, 05 (Do NOT change 05 into 04)
    infoBoxes: [
      {
        number: '01',
        title: 'Pilih Barang yang Masih Layak',
        paragraphs: [
          'Langkah pertama adalah memilah barang yang ingin didonasikan. Pilih barang yang masih berfungsi, tidak rusak parah, dan aman untuk digunakan.',
          'Beberapa contoh barang yang dapat didonasikan antara lain pakaian, buku, tas, sepatu, perlengkapan sekolah, mainan, peralatan rumah tangga, dan barang lainnya yang masih memiliki fungsi.',
          'Hindari memberikan barang yang sudah rusak berat, kotor, atau tidak dapat digunakan. Donasi sebaiknya bukan sekadar memindahkan barang yang sudah menjadi sampah kepada orang lain, tetapi memberikan sesuatu yang benar-benar dapat memberikan manfaat.',
        ],
      },
      {
        number: '02',
        title: 'Bersihkan dan Persiapkan Barang',
        paragraphs: [
          'Sebelum diberikan, pastikan barang berada dalam kondisi bersih dan siap digunakan. Pakaian dapat dicuci dan dilipat dengan rapi, sementara buku dan perlengkapan lainnya dapat dibersihkan dari debu atau kotoran.',
          'Jika terdapat bagian yang sedikit rusak tetapi masih dapat diperbaiki, pertimbangkan untuk memperbaikinya terlebih dahulu. Barang yang sudah dipersiapkan dengan baik akan lebih mudah diterima dan digunakan oleh penerima.',
        ],
      },
      {
        number: '03',
        title: 'Pisahkan Sesuai Jenis Barang & Pastikan Sesuai dengan Kebutuhan',
        paragraphs: [
          'Setelah memilih barang, kelompokkan berdasarkan jenisnya. Misalnya, pakaian dipisahkan dari buku, perlengkapan sekolah, atau peralatan rumah tangga. Pengelompokan sederhana ini dapat membantu proses penyortiran dan penyaluran menjadi lebih mudah. Selain itu, kondisi dan jumlah barang juga akan lebih mudah diketahui sebelum disalurkan.',
          'Salah satu hal penting dalam berdonasi adalah memastikan barang yang diberikan memang dibutuhkan. Tidak semua penerima membutuhkan jenis barang yang sama.',
          'Sebelum berdonasi, cari tahu kebutuhan penerima atau lembaga yang menjadi tujuan donasi. Dengan begitu, barang yang diberikan memiliki kemungkinan lebih besar untuk langsung digunakan dan memberikan manfaat.',
        ],
      },
      {
        number: '05', // IMPORTANT: Preserved as 05 exactly as in reference PDF
        title: 'Pilih Penyaluran yang Tepat',
        paragraphs: [
          'Barang yang sudah siap didonasikan dapat disalurkan melalui lembaga sosial, komunitas, kegiatan penggalangan donasi, atau platform yang menyediakan layanan penyaluran barang.',
          'Memilih saluran yang tepat juga penting untuk memastikan barang dapat diterima oleh pihak yang membutuhkan. Melalui platform seperti KEMBALI, proses donasi dapat menjadi lebih mudah karena barang dapat dikumpulkan dan disalurkan melalui jaringan yang sesuai dengan kebutuhan.',
        ],
      },
    ],
  },
  {
    id: 'article-3',
    number: '03',
    title: 'Ekonomi Sirkular: Mengubah Sampah Menjadi Sumber Daya',
    categories: ['Social', 'Economy', 'Environment'],
    date: '19 AUG 2026',
    detailDate: '14 AUG 2026',
    author: 'By KEMBALI',
    image: insightImages.article3, // TODO: Replace with final image
    ctaText: 'Visit Now',
    bannerImage: insightImages.bannerArticle3,
    sections: [
      {
        type: 'intro',
        paragraphs: [
          'Selama ini, banyak barang digunakan, kemudian dibuang ketika sudah tidak lagi dibutuhkan. Pola seperti ini dikenal sebagai ekonomi linear: mengambil bahan dari alam, mengolahnya menjadi produk, menggunakannya, lalu membuangnya. Jika dilakukan terus-menerus, pola tersebut dapat meningkatkan jumlah sampah dan menghabiskan sumber daya alam.',
          'Sebagai alternatif, terdapat konsep ekonomi sirkular yang berusaha menjaga agar barang dan material tetap digunakan selama mungkin. Barang yang sudah tidak digunakan tidak langsung dianggap sebagai sampah, tetapi dapat diperbaiki, digunakan kembali, didonasikan, atau diolah menjadi sesuatu yang memiliki nilai baru.',
        ],
      },
      {
        type: 'heading',
        title: 'Apa Itu Ekonomi Sirkular?',
        paragraphs: [
          'Ekonomi sirkular adalah sistem ekonomi yang bertujuan mengurangi limbah dan penggunaan sumber daya baru dengan mempertahankan nilai suatu produk dan material selama mungkin. Konsep ini tidak hanya berfokus pada proses daur ulang, tetapi juga pada bagaimana sebuah produk dirancang, digunakan, dirawat, dan dimanfaatkan kembali.',
          'Contohnya sederhana. Pakaian yang sudah tidak digunakan tetapi masih layak pakai dapat diberikan kepada orang lain. Barang elektronik yang mengalami kerusakan dapat diperbaiki daripada langsung dibuang. Sementara material yang sudah tidak dapat digunakan kembali dapat diproses menjadi bahan untuk produk baru. Dengan cara tersebut, satu barang dapat memiliki lebih dari satu siklus penggunaan.',
        ],
      },
      {
        type: 'heading',
        title: 'Mengapa Ekonomi Sirkular Penting?',
        paragraphs: [
          'Pertumbuhan konsumsi membuat kebutuhan terhadap bahan baku terus meningkat. Pada saat yang sama, jumlah barang yang menjadi limbah juga semakin besar. Ekonomi sirkular hadir untuk mengurangi kesenjangan tersebut dengan memaksimalkan penggunaan barang dan material yang sudah tersedia.',
          'Penerapan ekonomi sirkular dapat membantu mengurangi jumlah sampah yang berakhir di tempat pembuangan akhir. Selain itu, penggunaan kembali material juga dapat mengurangi kebutuhan untuk mengambil sumber daya alam baru.',
          'Dari sisi ekonomi, konsep ini juga dapat membuka peluang baru. Barang bekas yang masih memiliki nilai dapat diperjualbelikan, diperbaiki, didonasikan, atau diolah menjadi produk baru. Hal ini dapat menciptakan aktivitas ekonomi sekaligus memberikan manfaat bagi masyarakat.',
        ],
      },
      {
        type: 'action_cards_section',
        title: 'Contoh Ekonomi Sirkular dalam Kehidupan Sehari-hari',
        cards: [
          {
            id: 'c1',
            icon: insightImages.actionDonate,
            title: 'Mendonasikan barang layak pakai',
            actionText: 'Donasi Sekarang',
            actionLink: '/donasi',
          },
          {
            id: 'c2',
            icon: insightImages.actionRecycle,
            title: 'Mendaur Ulang & Mengubah Barang Menjadi Produk Baru',
          },
          {
            id: 'c3',
            icon: insightImages.actionRepair,
            title: 'Memperbaiki Barang yang Rusak',
          },
          {
            id: 'c4',
            icon: insightImages.actionReuse,
            title: 'Menggunakan kembali barang',
          },
        ],
      },
      {
        type: 'heading',
        title: 'Peran Masyarakat dalam Ekonomi Sirkular',
        paragraphs: [
          'Ekonomi sirkular bukan hanya tanggung jawab pemerintah atau perusahaan. Masyarakat juga memiliki peran penting melalui kebiasaan sehari-hari. Memilih barang yang tahan lama, merawat barang agar tidak cepat rusak, mengurangi pembelian yang tidak diperlukan, serta memilah barang sebelum membuangnya merupakan beberapa langkah sederhana yang dapat dilakukan.',
          'Selain itu, ketika memiliki barang yang sudah tidak digunakan, kita dapat mempertimbangkan apakah barang tersebut masih bisa digunakan oleh orang lain. Mendonasikan barang layak pakai merupakan salah satu bentuk sederhana dari memperpanjang siklus hidup sebuah produk.',
        ],
      },
      {
        type: 'heading',
        title: 'Dari Barang Tak Terpakai Menjadi Manfaat',
        paragraphs: [
          'Ekonomi sirkular mengajarkan bahwa sesuatu yang sudah tidak kita butuhkan belum tentu kehilangan nilainya. Sebuah pakaian yang memenuhi lemari, buku yang sudah selesai dibaca, atau barang rumah tangga yang jarang digunakan masih dapat memberikan manfaat jika dialirkan kepada orang yang tepat.',
          'Pada akhirnya, ekonomi sirkular bukan sekadar tentang mengurangi sampah. Ini adalah tentang mengubah cara kita melihat barang: dari sesuatu yang memiliki akhir berupa tempat sampah menjadi sumber daya yang masih dapat digunakan kembali.',
          'Setiap barang yang digunakan lebih lama, diperbaiki, digunakan kembali, atau diberikan kepada orang lain adalah satu langkah menuju pola konsumsi yang lebih berkelanjutan.',
        ],
      },
    ],
  },
  {
    id: 'article-4',
    number: '04',
    title: 'Yuk, Kenali Cara Berdonasi yang Aman dan Tepat',
    categories: ['Social', 'Safety', 'Environment'],
    date: '19 AUG 2026',
    detailDate: '18 AUG 2026',
    author: 'By KEMBALI',
    image: insightImages.article4, // TODO: Replace with final image
    ctaText: 'Visit Now',
    intro:
      'Berdonasi merupakan salah satu cara sederhana untuk membantu orang lain yang sedang membutuhkan. Bantuan yang diberikan, baik dalam bentuk uang, barang, maupun kebutuhan lainnya, dapat memberikan manfaat nyata bagi penerimanya. Namun, agar bantuan benar-benar sampai kepada pihak yang membutuhkan, proses berdonasi perlu dilakukan dengan bijak dan tepat.',
    subIntro:
      'Di era digital seperti sekarang, berdonasi juga semakin mudah. Berbagai platform dan kampanye donasi dapat ditemukan melalui internet dan media sosial. Kemudahan ini tentu menjadi hal positif, tetapi di sisi lain, masyarakat perlu lebih berhati-hati agar tidak menjadi korban penipuan atau memberikan bantuan kepada pihak yang tidak bertanggung jawab.',
    whySection: {
      title: 'Mengapa Penting Berdonasi dengan Aman?',
      paragraphs: [
        'Ketika berdonasi, kita tentu berharap bantuan yang diberikan dapat sampai kepada penerima dan digunakan sebagaimana mestinya. Karena itu, penting untuk mengetahui siapa pihak yang mengelola donasi, untuk apa dana atau barang tersebut digunakan, serta bagaimana proses penyalurannya.',
        'Donasi yang dilakukan tanpa mengecek informasi terlebih dahulu berisiko tidak tepat sasaran. Dalam kasus tertentu, informasi mengenai penerima bantuan juga dapat dibuat secara tidak benar untuk menarik perhatian masyarakat.',
        'Dengan lebih teliti sebelum berdonasi, kita tidak hanya melindungi diri sendiri, tetapi juga membantu memastikan bantuan benar-benar memberikan dampak.',
      ],
    },
    safetyPoints: [
      {
        number: '01',
        title: 'Kenali Pihak yang Menggalang Donasi',
        paragraphs: [
          'Sebelum memberikan bantuan, cari tahu siapa yang mengadakan penggalangan dana. Periksa identitas organisasi, komunitas, atau individu yang menjadi pengelola donasi.',
          'Jika donasi dilakukan melalui platform tertentu, pastikan platform tersebut memiliki informasi yang jelas mengenai pengelola dan mekanisme penyaluran bantuan. Jangan mudah percaya hanya karena sebuah kampanye terlihat meyakinkan.',
        ],
      },
      {
        number: '02',
        title: 'Periksa Tujuan Penggunaan Donasi',
        paragraphs: [
          'Donatur berhak mengetahui untuk apa bantuan yang diberikan akan digunakan. Informasi mengenai kebutuhan penerima sebaiknya dijelaskan secara transparan dan mudah dipahami.',
          'Misalnya, sebuah kampanye dapat menjelaskan bahwa donasi digunakan untuk memenuhi kebutuhan pangan, perlengkapan sekolah, bantuan bencana, atau kebutuhan lainnya. Semakin jelas tujuan donasi, semakin mudah bagi donatur untuk menentukan apakah bantuan tersebut sesuai dengan keinginannya.',
        ],
      },
      {
        number: '03',
        title: 'Pastikan Informasinya Kredibel',
        paragraphs: [
          'Jangan langsung percaya hanya berdasarkan judul atau unggahan yang menyentuh secara emosional. Periksa informasi pendukung seperti lokasi, kondisi penerima, dokumentasi, serta sumber informasi lainnya.',
          'Jika memungkinkan, bandingkan informasi dari beberapa sumber. Untuk penggalangan dana terkait bencana atau kondisi tertentu, informasi dari lembaga resmi juga dapat membantu memastikan bahwa kejadian tersebut benar-benar terjadi.',
        ],
      },
      {
        number: '04',
        title: 'Pilih Bentuk Bantuan yang Sesuai',
        paragraphs: [
          'Donasi tidak selalu harus berupa uang. Barang yang masih layak digunakan juga dapat menjadi bentuk bantuan yang bermanfaat. Pakaian, buku, perlengkapan sekolah, peralatan rumah tangga, dan berbagai barang lainnya dapat didonasikan selama sesuai dengan kebutuhan penerima. Sebelum mengirimkan barang, pastikan kondisinya masih baik dan memang dibutuhkan.',
          'Memberikan barang secara asal justru dapat menambah beban pihak yang menerima. Karena itu, donasi yang baik bukan hanya tentang memberikan sesuatu, tetapi juga mempertimbangkan kebutuhan penerimanya.',
        ],
      },
      {
        number: '05',
        title: 'Perhatikan Transparansi Penyaluran',
        paragraphs: [
          'Setelah donasi terkumpul, pengelola yang terpercaya sebaiknya memberikan informasi mengenai proses penyalurannya. Transparansi dapat berupa laporan penggunaan dana, jumlah bantuan yang terkumpul, dokumentasi kegiatan, maupun informasi mengenai penerima manfaat.',
          'Transparansi penting karena dapat membangun kepercayaan antara donatur, pengelola, dan penerima bantuan.',
        ],
      },
      {
        number: '06',
        title: 'Jangan Mudah Terpengaruh oleh Tekanan',
        paragraphs: [
          'Kampanye donasi terkadang menggunakan kalimat yang sangat mendesak agar seseorang segera memberikan bantuan. Meskipun urgensi memang dapat terjadi dalam situasi tertentu, donatur tetap memiliki hak untuk memeriksa informasi sebelum mengambil keputusan.',
          'Berhati-hati bukan berarti tidak peduli. Justru dengan memeriksa informasi terlebih dahulu, kita dapat memastikan kepedulian yang diberikan benar-benar menghasilkan manfaat.',
        ],
      },
    ],
    closingSection: {
      title: 'Donasi yang Tepat Dimulai dari Kepedulian',
      paragraphs: [
        'Berdonasi bukan hanya tentang seberapa banyak yang kita berikan, tetapi juga bagaimana bantuan tersebut disalurkan. Dengan memilih penggalangan dana yang terpercaya, memahami kebutuhan penerima, serta memastikan adanya transparansi, kita dapat membuat bantuan menjadi lebih tepat sasaran.',
        'Pada akhirnya, setiap bentuk kepedulian memiliki arti. Namun, ketika kepedulian disertai dengan kehati-hatian dan informasi yang benar, manfaatnya dapat menjadi jauh lebih besar.',
        'Mari berdonasi dengan bijak. Karena bantuan yang tepat bukan hanya sampai kepada mereka yang membutuhkan, tetapi juga benar-benar memberikan manfaat.',
      ],
    },
  },
]

export const newsData = [
  {
    id: 'news-1',
    isFeatured: false,
    title: 'Gempa M7,7 Guncang Nagekeo, 47 Orang Meninggal dan Ratusan Bangunan Rusak',
    categories: ['Social', 'Disaster', 'Environment'],
    date: '15 AUG 2026',
    source: 'By KEMBALI based on Badan Meteorologi, Klimatologi, dan Geofisika',
    image: insightImages.news1, // TODO: Replace with final image
    paragraphs: [
      'Nagekeo, Nusa Tenggara Timur — Gempa bumi berkekuatan magnitudo 7,7 mengguncang wilayah Nagekeo, Nusa Tenggara Timur, pada Sabtu, 15 Agustus 2026 pukul 04.58 WIB. Pusat gempa berada di laut, sekitar 30 kilometer timur laut Mbay, Kabupaten Nagekeo, dengan kedalaman 15 kilometer. Gempa dangkal tersebut berkaitan dengan aktivitas Flores Back-Arc Thrust dan menimbulkan guncangan kuat di sejumlah wilayah Nusa Tenggara dan Indonesia bagian timur.',
      'Guncangan gempa tercatat di 55 stasiun akselerograf dengan intensitas hingga VIII MMI. Wilayah Ngada dan Sikka tercatat mengalami intensitas hingga VII MMI atau sangat kuat, sementara guncangan juga dirasakan di Ende, Manggarai, Sumba, Bima, hingga wilayah Sulawesi.',
      'Gempa tersebut juga sempat memicu peringatan dini tsunami. BMKG mendeteksi perubahan muka laut di beberapa wilayah, dengan perubahan terbesar sekitar 0,94 meter di Maurole, Ende. Namun, peringatan tsunami kemudian dinyatakan berakhir pada pukul 07.31 WIB setelah dilakukan pemantauan dan evaluasi lebih lanjut.',
      'Berdasarkan pemutakhiran data BNPB hingga 15 Agustus 2026 pukul 18.48 WIB, sebanyak 47 orang meninggal dunia akibat gempa. Selain itu, tercatat 346 rumah mengalami kerusakan, terdiri dari 157 rumah rusak berat, 41 rusak sedang, dan 148 rusak ringan. Kerusakan juga terjadi pada 87 fasilitas pendidikan, 18 fasilitas kesehatan, 5 tempat ibadah, dan 6 perkantoran. Data tersebut masih bersifat sementara dan dapat berubah seiring proses pendataan di lapangan.',
      'Gempa Nagekeo menjadi salah satu bencana besar yang menunjukkan tingginya risiko seismik di wilayah Flores dan Nusa Tenggara Timur. Proses asesmen dan pendataan dampak bencana masih terus dilakukan oleh pihak terkait.',
    ],
  },
  {
    id: 'news-2',
    isFeatured: true,
    title: 'Beri Kesempatan Kedua untuk Barangmu. Donasikan melalui KEMBALI!',
    categories: ['Social', 'Recycle', 'Environment'],
    date: '19 MAR 2026',
    source: 'At KEMBALI Website',
    ctaText: 'Donasi Sekarang',
    ctaLink: '/donasi',
  },
  {
    id: 'news-3',
    isFeatured: false,
    title: 'Bank Sampah: Dari Proyek Komunitas Menjadi Infrastruktur Resmi',
    categories: ['Recycle', 'Environment'],
    date: '14 JAN 2026',
    source: 'By KEMBALI based on Sirkulasi',
    image: insightImages.news3, // TODO: Replace with final image
    paragraphs: [
      'Seiring dengan pengakuan terhadap pekerja pemilah sampah, bank sampah di Indonesia juga mengalami transformasi status. Jaringan sekitar 27.631 bank sampah di Indonesia kini menangani 136.860 ton material dengan omzet sekitar Rp2,8 miliar per bulan.',
      'Beberapa kota seperti Semarang, Gunungkidul, Banjarbaru, dan Makassar mulai memperlakukan bank sampah sebagai infrastruktur pengumpulan resmi, bukan lagi sekadar inisiatif komunitas atau sukarela. Alur integrasi bank sampah ke dalam sistem pengelolaan sampah kota dinyatakan secara eksplisit, dan unit-unit ini diperlakukan sebagai tujuan resmi dalam rantai layanan kota.',
      'Transformasi ini terjadi seiring dengan kewajiban kota-kota besar untuk menerapkan pemilahan sampah dari sumber (rumah tangga), sehingga bank sampah menjadi mata rantai penting dalam ekosistem ekonomi sirkular.',
    ],
  },
]

export const educationalVideosData = [
  {
    id: 'video-1',
    title:
      'Explaining the Circular Economy and How Society Can Re-think Progress | Animated Video Essay',
    categories: ['Economy', 'Environment'],
    date: '14 YEARS AGO',
    author: 'Ellen MacArthur Foundation',
    thumbnail: insightImages.video1, // TODO: Replace with final image
    videoUrl: 'https://www.youtube.com',
  },
  {
    id: 'video-2',
    title:
      'Transforming Cardboard & Jute Rope ♻️ 5 GENIUS Recycling Ideas That Will Amaze You!',
    categories: ['Recycle', 'Waste', 'Environment'],
    date: '24 SEP 2022',
    author: 'By Leslie Alexander',
    thumbnail: insightImages.video2, // TODO: Replace with final image
    videoUrl: 'https://www.youtube.com',
  },
  {
    id: 'video-3',
    title: 'Bagaimana Konsep Ekonomi Sirkular Diterapkan?',
    categories: ['Economy', 'Environment'],
    date: '24 SEP 2022',
    author: 'By DOKPROJECT',
    thumbnail: insightImages.video3, // TODO: Replace with final image
    videoUrl: 'https://www.youtube.com',
  },
]

export const impactStatsData = [
  { value: '12.400+', label: 'Barang Tersirkulasi' },
  { value: '2.000 kg', label: 'Sampah Dikurangi' },
  { value: '4.680 kg', label: 'CO2 Dihemat' },
  { value: '1.500+', label: 'Pengguna Aktif' },
]
