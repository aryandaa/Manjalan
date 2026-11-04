export interface MapPoint {
  id: string;
  name: string;
  category: 'destinasi' | 'umkm' | 'layanan' | 'atm';
  categoryLabel: string;
  lat: number;
  lng: number;
  location: string;
  description: string;
  image: string;
  signal: '4G Cepat' | '3G/Edge' | 'Blankspot Total';
  payment: 'Tunai Wajib' | 'QRIS & Tunai' | 'Transfer & Tunai' | string;
  estimatedCost: string;
  radioVhf?: string;
  isRiverStop: boolean;
  recommendedStayDuration: string;
}

export const MAP_POINTS: MapPoint[] = [
  // ==========================================
  // 1. DESTINASI WISATA RESMI KALIMANTAN TENGAH
  // ==========================================
  {
    id: 'tanjung-puting',
    name: 'Taman Nasional Tanjung Puting',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.8500,
    lng: 111.9000,
    location: 'Kotawaringin Barat & Seruyan',
    description: 'Pusat konservasi orangutan tropis terbesar di dunia, jelajah Sungai Sekonyer dengan perahu kelotok kayu ulin.',
    image: '/images/destinasi/tanjung-puting-main.jpg',
    signal: 'Blankspot Total',
    payment: 'Tunai Wajib',
    estimatedCost: 'Simaksi Rp 220.000 / 3 hari',
    radioVhf: 'VHF Ch-16 (156.800 MHz)',
    isRiverStop: true,
    recommendedStayDuration: '3 Hari 2 Malam',
  },
  {
    id: 'taman-nasional-sebangau',
    name: 'Taman Nasional Sebangau',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.3167,
    lng: 113.8833,
    location: 'Kereng Bangkirai, Palangka Raya',
    description: 'Kawasan ekosistem rawa gambut air hitam alami terbesar di Kalimantan Tengah. Susur sungai dan habitat bekantan.',
    image: '/images/destinasi/sebangau-main.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Simaksi Rp 30.000 / orang',
    radioVhf: 'VHF Ch-16 (Pos Jaga Sebangau)',
    isRiverStop: true,
    recommendedStayDuration: '3 - 4 Jam',
  },
  {
    id: 'bukit-tangkiling',
    name: 'Kawasan Wisata Alam Bukit Tangkiling',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.0433,
    lng: 113.7228,
    location: 'Tangkiling, Bukit Batu, Palangka Raya',
    description: 'Sembilan perbukitan batu granit purba dengan panorama hutan tropis 360 derajat. Berdekatan dengan Nyaru Menteng (BOSF).',
    image: '/images/destinasi/bukit-tangkiling.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 10.000 / orang',
    isRiverStop: false,
    recommendedStayDuration: '2 - 3 Jam',
  },
  {
    id: 'danau-tahai',
    name: 'Ekowisata Danau Gambut Tahai',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.0315,
    lng: 113.7441,
    location: 'Tumbang Tahai, Palangka Raya',
    description: 'Danau air gambut merah eksotis dengan jembatan titian kayu ulin meliuk melintasi rawa lebat dan perahu bebek kayuh.',
    image: '/images/destinasi/danau-tahai.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 10.000 / orang',
    isRiverStop: true,
    recommendedStayDuration: '2 Jam',
  },
  {
    id: 'istana-kuning',
    name: 'Istana Kuning Pangkalan Bun',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.6841,
    lng: 111.6247,
    location: 'Kotawaringin Barat',
    description: 'Istana bersejarah Kesultanan Kutaringin berbalut kayu ulin megah peninggalan abad ke-17 di jantung kota Pangkalan Bun.',
    image: '/images/destinasi/istana-kuning.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 10.000 (Donasi)',
    isRiverStop: false,
    recommendedStayDuration: '1 - 2 Jam',
  },
  {
    id: 'pantai-ujung-pandaran',
    name: 'Pantai Ujung Pandaran',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -3.0489,
    lng: 113.0125,
    location: 'Teluk Sampit, Kotawaringin Timur',
    description: 'Hamparan pasir putih pesisir Laut Jawa, panorama senja magis, serta situs ziarah kubah ulama Syekh Abu Hamid.',
    image: '/images/destinasi/pantai-ujung-pandaran.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 15.000 / orang',
    radioVhf: 'VHF Ch-16 (Polairud Sampit)',
    isRiverStop: false,
    recommendedStayDuration: 'Setengah Hari',
  },
  {
    id: 'rumah-betang-tumbang-gagu',
    name: 'Rumah Betang Tumbang Gagu',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -1.3320,
    lng: 112.5180,
    location: 'Antang Kalang, Kotawaringin Timur',
    description: 'Mahakarya cagar budaya rumah panjang kayu ulin suku Dayak Ngaju tertua (1870) di pedalaman hulu Sungai Kalang.',
    image: '/images/destinasi/rumah-betang-tumbang-gagu.jpg',
    signal: 'Blankspot Total',
    payment: 'Tunai Wajib',
    estimatedCost: 'Rp 20.000 (Donasi Adat)',
    radioVhf: 'Radio SSB Adat',
    isRiverStop: true,
    recommendedStayDuration: '1 - 2 Hari',
  },
  {
    id: 'batu-banama',
    name: 'Situs Budaya Batu Banama & Betang',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.0385,
    lng: 113.7180,
    location: 'Sei Gohong, Bukit Batu, Palangka Raya',
    description: 'Situs batu perahu keramat legenda kutukan saudagar Dayak, didampingi arsitektur Rumah Betang adat kuno.',
    image: '/images/destinasi/batu-banama.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 15.000 (Donasi Adat)',
    isRiverStop: false,
    recommendedStayDuration: '2 Jam',
  },
  {
    id: 'bukit-baka-bukit-raya',
    name: 'TN Bukit Baka Bukit Raya (TNBBBR)',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -0.6333,
    lng: 112.6333,
    location: 'Katingan & Perbatasan Kalbar',
    description: 'Atap tertinggi Kalimantan (Puncak Kaba 2.278 mdpl), flora endemik Rafflesia borneensis, serta jeram Sungai Samba.',
    image: '/images/destinasi/bukit-baka-bukit-raya.jpg',
    signal: 'Blankspot Total',
    payment: 'Tunai Wajib',
    estimatedCost: 'Simaksi Rp 50.000 / orang',
    radioVhf: 'HT 142.100 MHz (Pos Porter)',
    isRiverStop: true,
    recommendedStayDuration: 'Ekspedisi 5 Hari',
  },
  {
    id: 'pantai-kubu',
    name: 'Kawasan Pesisir Pantai Kubu & Bogam',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.8800,
    lng: 111.6700,
    location: 'Kubu, Kumai, Kotawaringin Barat',
    description: 'Pesisir Laut Jawa dengan dermaga kayu ulin panjang menjulur ke lautan dan sentra kuliner seafood rajungan nelayan.',
    image: '/images/destinasi/pantai-kubu.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 15.000 (Retribusi)',
    radioVhf: 'VHF Ch-16 (Polairud Kumai)',
    isRiverStop: false,
    recommendedStayDuration: '2 - 3 Jam',
  },

  // ==========================================
  // 2. UMKM, KELOTOK & SENTRA KULINER
  // ==========================================
  {
    id: 'umkm-kelotok-joko',
    name: 'Kelotok Wisata Berkah Sungai (Pak Joko)',
    category: 'umkm',
    categoryLabel: 'UMKM & Kelotok',
    lat: -2.7435,
    lng: 111.7350,
    location: 'Dermaga Panglima Utar, Kumai',
    description: 'Armada kapal kayu ulin 2 tingkat resmi TNTP include nahkoda bersertifikat, koki pribadi kapal, kasur dan shower bersih.',
    image: '/images/umkm/kelotok-berkah-sungai.jpg',
    signal: '4G Cepat',
    payment: 'Transfer & Tunai',
    estimatedCost: 'Rp 1.8jt - Rp 2.5jt / trip',
    radioVhf: 'VHF Ch-16 (Nahkoda Kapal)',
    isRiverStop: true,
    recommendedStayDuration: 'Titik Boarding',
  },
  {
    id: 'umkm-dapur-kumai',
    name: 'Dapur Dayak Kumai Sejahtera',
    category: 'umkm',
    categoryLabel: 'UMKM Kuliner',
    lat: -2.7420,
    lng: 111.7360,
    location: 'Jl. Bendahara, Pelabuhan Kumai',
    description: 'Spesialis hidangan autentik pesisir Kumai & Dayak: Baung Bakar Bambu, Juhu Umbut Sawit, dan Ikan Lais Goreng.',
    image: '/images/umkm/dapur-dayak-kumai.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 25.000 - Rp 65.000 / porsi',
    isRiverStop: false,
    recommendedStayDuration: '45 Menit',
  },
  {
    id: 'umkm-warung-sebangau',
    name: 'Warung Terapung Danau Sebangau (Ibu Asnah)',
    category: 'umkm',
    categoryLabel: 'UMKM Kuliner',
    lat: -2.3160,
    lng: 113.8825,
    location: 'Dermaga Kereng Bangkirai, Palangka Raya',
    description: 'Warung apung khas tepian rawa air hitam menyajikan Soto Banjar telur bebek, ikan gabus bakar madu, dan kopi hangat.',
    image: '/images/umkm/warung-terapung-sebangau.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 15.000 - Rp 45.000',
    isRiverStop: true,
    recommendedStayDuration: '45 Menit',
  },
  {
    id: 'umkm-getah-nyatu',
    name: 'Pusat Kerajinan Getah Nyatu Kahayan',
    category: 'umkm',
    categoryLabel: 'UMKM Kerajinan',
    lat: -2.2100,
    lng: 113.9250,
    location: 'Pahandut Seberang, Palangka Raya',
    description: 'Kerajinan getah pohon nyatu liar langka khas Dayak: perahu naga tiwah, miniatur kapal, dan ornamen tradisional.',
    image: '/images/umkm/kerajinan-getah-nyatu.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Transfer',
    estimatedCost: 'Rp 20.000 - Rp 350.000',
    isRiverStop: false,
    recommendedStayDuration: '30 Menit',
  },
  {
    id: 'umkm-juhu-umbut',
    name: 'Kuliner Dayak Juhu Umbut Rotan',
    category: 'umkm',
    categoryLabel: 'UMKM Kuliner',
    lat: -2.0325,
    lng: 113.7430,
    location: 'Jl. Tjilik Riwut Km 29, Tumbang Tahai',
    description: 'Kuliner sayur hutan autentik Dayak: Juhu Singkah / Umbut Rotan muda masak ikan nila sungai, sambal kandas, dan daun kelakai.',
    image: '/images/umkm/kuliner-juhu-umbut-rotan.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 20.000 - Rp 50.000',
    isRiverStop: false,
    recommendedStayDuration: '45 Menit',
  },
  {
    id: 'umkm-anyaman-kandui',
    name: 'Kerajinan Anyaman Rotan Dayak Kandui',
    category: 'umkm',
    categoryLabel: 'UMKM Kerajinan',
    lat: -2.0440,
    lng: 113.7220,
    location: 'Area Parkir Wisata Bukit Tangkiling',
    description: 'Tas anjat Dayak, tikar rotan luntik motif flora, dompet rotan pewarna alami akar tanaman hutan, dan keranjang bambu.',
    image: '/images/umkm/anyaman-rotan-kandui.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 35.000 - Rp 280.000',
    isRiverStop: false,
    recommendedStayDuration: '30 Menit',
  },
  {
    id: 'umkm-anyaman-taboyan',
    name: 'Kerajinan Anyaman Rotan Dayak Taboyan',
    category: 'umkm',
    categoryLabel: 'UMKM Kerajinan',
    lat: -2.2210,
    lng: 113.9180,
    location: 'Galeri Betang Hapakat, Palangka Raya',
    description: 'Anyaman rotan otentik karya perajin Dayak Taboyan dengan motif tribal geometris kuno yang sarat makna leluhur.',
    image: '/images/umkm/anyaman-rotan-taboyan.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Transfer',
    estimatedCost: 'Rp 50.000 - Rp 450.000',
    isRiverStop: false,
    recommendedStayDuration: '45 Menit',
  },
  {
    id: 'umkm-wadai-kiping',
    name: 'Wadai Kiping Dayak Maanyan',
    category: 'umkm',
    categoryLabel: 'UMKM Kuliner',
    lat: -2.0390,
    lng: 113.7190,
    location: 'Kompleks Budaya Tangkiling & Batu Banama',
    description: 'Kudapan manis tradisional tepung ketan kenyal berkuah santan gula aren wangi pandan khas pesta panen Dayak Maanyan.',
    image: '/images/umkm/wadai-kiping-maanyan.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 10.000 - Rp 25.000',
    isRiverStop: false,
    recommendedStayDuration: '20 Menit',
  },

  // ==========================================
  // 3. LAYANAN, POS PENJAGAAN & KESEHATAN
  // ==========================================
  {
    id: 'pos-kumai-balai',
    name: 'Balai Konservasi TNTP Pos Kumai',
    category: 'layanan',
    categoryLabel: 'Layanan & Pos Penjagaan',
    lat: -2.7430,
    lng: 111.7358,
    location: 'Pelabuhan Kumai, Kotawaringin Barat',
    description: 'Pusat verifikasi simaksi resmi TNTP, pendaftaran surat izin masuk kawasan konservasi, dan stasiun radio maritim.',
    image: '/images/destinasi/tanjung-puting-main.jpg',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Verifikasi Bebas Biaya',
    radioVhf: 'VHF Ch-16 (156.800 MHz)',
    isRiverStop: true,
    recommendedStayDuration: '20 Menit',
  },
  {
    id: 'puskesmas-kumai',
    name: 'Puskesmas Rawat Inap & Ambulans Air Kumai',
    category: 'layanan',
    categoryLabel: 'Layanan Kesehatan & SAR',
    lat: -2.7455,
    lng: 111.7345,
    location: 'Jl. Pemuda No. 12, Kumai Hulu',
    description: 'Fasilitas kesehatan rujukan pertama dengan unit ambulans speedboat cepat darurat evakuasi air dari sungai pedalaman.',
    image: '/images/destinasi/tanjung-puting-sekonyer.jpg',
    signal: '4G Cepat',
    payment: 'BPJS & Tunai',
    estimatedCost: 'Layanan Darurat 24 Jam',
    radioVhf: 'Radio Medik (0532-61118)',
    isRiverStop: false,
    recommendedStayDuration: 'Siaga 24 Jam',
  },

  // ==========================================
  // 4. ATM & TITIK TARIK TUNAI TERAKHIR
  // ==========================================
  {
    id: 'atm-bri-kumai',
    name: 'ATM BRI Unit Kumai (Tarik Tunai Terakhir TNTP)',
    category: 'atm',
    categoryLabel: 'Pemberhentian Tunai',
    lat: -2.7390,
    lng: 111.7320,
    location: 'Jl. Pelabuhan Kumai Hilir',
    description: 'Mesin ATM pecahan Rp 50.000 & Rp 100.000 terakhir yang dapat diakses sebelum kelotok berlayar masuk hutan sungai.',
    image: '/images/destinasi/tanjung-puting-main.jpg',
    signal: '4G Cepat',
    payment: 'Tarik Tunai Kartu / QRIS Cardless',
    estimatedCost: 'Cadangan Tunai Rp 500rb - Rp 1jt / orang',
    isRiverStop: false,
    recommendedStayDuration: '15 Menit',
  },
  {
    id: 'atm-kalteng-palangka',
    name: 'ATM Bank Kalteng Tjilik Riwut (Akses Sebangau & Tahai)',
    category: 'atm',
    categoryLabel: 'Pemberhentian Tunai',
    lat: -2.2085,
    lng: 113.9160,
    location: 'Jl. Tjilik Riwut, Palangka Raya',
    description: 'Titik tarik tunai strategis menuju Dermaga Sebangau, Bukit Tangkiling, dan Danau Tahai.',
    image: '/images/destinasi/sebangau-main.jpg',
    signal: '4G Cepat',
    payment: 'Tarik Tunai Kartu & QRIS Cardless',
    estimatedCost: 'Cadangan Tunai Rp 250.000 / orang',
    isRiverStop: false,
    recommendedStayDuration: '10 Menit',
  },
];

/**
 * Haversine formula to compute distance in KM between 2 geo coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Estimate Kelotok travel time on river (avg speed ~13 km/h with current)
 */
export function estimateKelotokTime(distanceKm: number): string {
  if (distanceKm < 0.5) return 'Tepat di Lokasi';
  const hours = distanceKm / 13;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `±${m} menit`;
  return `±${h} jam ${m > 0 ? `${m} mnt` : ''}`;
}
