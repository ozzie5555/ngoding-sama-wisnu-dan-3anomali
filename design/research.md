# Riset Animasi Pembuka KEMBALI

flow: first-entry landing page animation

## Pola yang diadopsi

- Brand preloader singkat dengan exit reveal agar identitas KEMBALI langsung terlihat tanpa mengganti layout halaman.
- Staggered fade-up pada teks, CTA, dan ilustrasi hero untuk membentuk urutan fokus yang jelas.
- Animasi hanya memakai opacity dan transform agar tidak menyebabkan layout shift.
- Tampil sekali per sesi browser dan dilewati ketika pengguna memilih reduced motion.

## Pola yang dihindari

- Canvas, WebGL, partikel, atau gradient futuristik karena tidak sesuai dengan tema sosial-lingkungan KEMBALI.
- Loader lebih dari dua detik karena menunda pengguna membaca CTA utama.
- Animasi per huruf yang panjang, autoplay berulang, parallax besar, dan gerakan yang mengganggu aksesibilitas.
- Dependency animasi baru untuk efek yang dapat diselesaikan dengan CSS native.

## Arah terpilih

Intro hijau tua berdurasi sekitar 1,45 detik dengan logo asli, orbit yang menggambarkan ekonomi sirkular, tagline singkat, progress line, lalu panel naik dan membuka hero. Warna memakai token KEMBALI: dark teal, cyan, lime, dan putih.

## Referensi

- 21st.dev Preloader: https://21st.dev/community/components/info-mdshakeeb/preloader
- 21st.dev Animated Hero Section: https://21st.dev/community/components/uniquesonu/animated-hero-section-ui
- 21st.dev animated hero collection: https://21st.dev/community/components/s/animated-hero-section
- web.dev prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- web.dev CLS and transform animation guidance: https://web.dev/articles/cls
