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
  // 1. Destinasi Ekowisata
  {
    id: 'tanjung-harapan',
    name: 'Camp 1: Tanjung Harapan (TNTP)',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.7933,
    lng: 111.8542,
    location: 'Sungai Sekonyer, TN Tanjung Puting',
    description: 'Pusat feeding orangutan sesi sore (pukul 15:00 WIB), pusat informasi balai TNTP, dan stasiun edukasi bekantan di tepi rawa.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx3idpt9KEEdsqQAv2KekOb4vhEBIOzdifeDt-txpkM_GUf-JXum_ySpTPzr1__HxVajC3F4b4jVQGZ72rEcPANzh8CI4N2Ft0am-Qcx7XDIVMYd6oLZBYn9ofbfh2mbUEQ42BWwyvz6bJ0EM5HC22IntTJC_FY2cfdmu1d_We8bfD7uZDm5bw3C7pcpGkyVzHltDCCnYAzXGKXnB3kvHW0PPyzMHjK0MVnRi-tfMb',
    signal: '3G/Edge',
    payment: 'Tunai Wajib',
    estimatedCost: 'Rp 50.000 (Tiket Masuk)',
    radioVhf: 'VHF Ch-16 (156.800 MHz)',
    isRiverStop: true,
    recommendedStayDuration: '2 - 3 Jam',
  },
  {
    id: 'pondok-tanggui',
    name: 'Camp 2: Pondok Tanggui (TNTP)',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.8711,
    lng: 111.9318,
    location: 'Hulu Sekonyer, TN Tanjung Puting',
    description: 'Stasiun rehabilitasi orangutan remaja semi-liar dengan jadwal makan pagi (pukul 09:00 WIB). Terdapat trek kanopi hutan primer.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_qR1V-1XvE1Jj8vE5dE7h1P9W1kO7iJgD4vP7bK8xP7Q8lK4mN3vC6bY5tF8gH2jK1lM3nP5qR7sT9vW2xZ4aB6cD8eF0gH2jK1lM3nP5qR7sT9vW2xZ4aB6c',
    signal: 'Blankspot Total',
    payment: 'Tunai Wajib',
    estimatedCost: 'Termasuk Simaksi TNTP',
    radioVhf: 'VHF Ch-16 / SSB 4210 kHz',
    isRiverStop: true,
    recommendedStayDuration: '2 - 4 Jam',
  },
  {
    id: 'camp-leakey',
    name: 'Camp 3: Camp Leakey (Pusat Riset)',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.9189,
    lng: 111.9723,
    location: 'Pedalaman Sekonyer, TN Tanjung Puting',
    description: 'Pusat riset orangutan tertua didirikan oleh Dr. Biruté Galdikas sejak 1971. Jadwal feeding siang pukul 14:00 WIB di pedalaman hutan gambut.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9kO7iJgD4vP7bK8xP7Q8lK4mN3vC6bY5tF8gH2jK1lM3nP5qR7sT9vW2xZ4aB6cD8eF0gH2jK1lM3nP5qR7sT9vW2xZ4aB6cD8eF0gH2jK1lM3nP5qR7s',
    signal: 'Blankspot Total',
    payment: 'Tunai Wajib',
    estimatedCost: 'Simaksi + Pemandu Hutan',
    radioVhf: 'VHF Ch-16 (Stasiun Radio Balai)',
    isRiverStop: true,
    recommendedStayDuration: '4 - 5 Jam',
  },
  {
    id: 'sebangau-koran',
    name: 'TN Sebangau (Sungai Koran)',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.3167,
    lng: 113.8833,
    location: 'Kereng Bangkirai, Palangka Raya',
    description: 'Kawasan ekosistem rawa gambut air hitam terbesar di Kalimantan Tengah. Susur sungai dengan perahu getek dan tracking habitat bekantan.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_qR1V-1XvE1Jj8vE5dE7h1P9W1kO7iJgD4vP7bK8xP7Q8lK4mN3vC6bY5tF8gH2jK1lM3nP5qR7sT9vW2xZ4aB6cD8eF0gH2jK1lM3nP5qR7sT9vW2xZ4aB6c',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 35.000 - Rp 150.000',
    isRiverStop: true,
    recommendedStayDuration: '3 Jam',
  },
  {
    id: 'bukit-tangkiling',
    name: 'Taman Wisata Alam Bukit Tangkiling',
    category: 'destinasi',
    categoryLabel: 'Destinasi Wisata',
    lat: -2.0433,
    lng: 113.7228,
    location: 'Tangkiling, Palangka Raya',
    description: 'Bukit batu granit dengan panorama kanopi hutan tropis 360 derajat. Dekat dengan pusat suaka orangutan Nyaru Menteng (BOSF).',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx3idpt9KEEdsqQAv2KekOb4vhEBIOzdifeDt-txpkM_GUf-JXum_ySpTPzr1__HxVajC3F4b4jVQGZ72rEcPANzh8CI4N2Ft0am-Qcx7XDIVMYd6oLZBYn9ofbfh2mbUEQ42BWwyvz6bJ0EM5HC22IntTJC_FY2cfdmu1d_We8bfD7uZDm5bw3C7pcpGkyVzHltDCCnYAzXGKXnB3kvHW0PPyzMHjK0MVnRi-tfMb',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 20.000',
    isRiverStop: false,
    recommendedStayDuration: '2 Jam',
  },

  // 2. UMKM, Kelotok & Kuliner Sungai
  {
    id: 'dermaga-kumai',
    name: 'Dermaga Kelotok Utama Kumai',
    category: 'umkm',
    categoryLabel: 'UMKM & Transportasi',
    lat: -2.7431,
    lng: 111.7354,
    location: 'Pelabuhan Panglima Utar, Kumai',
    description: 'Titik kumpul keberangkatan armada perahu kelotok tradisional. Pusat sewa kapal, logistik bahan makanan, air galon, dan juru mudi.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    signal: '4G Cepat',
    payment: 'Transfer & Tunai',
    estimatedCost: 'Sewa Kelotok Rp 1.5jt - Rp 2.5jt/hari',
    radioVhf: 'VHF Ch-16 (Pengawas Pelabuhan)',
    isRiverStop: true,
    recommendedStayDuration: '1 Jam',
  },
  {
    id: 'warung-apung-dayah',
    name: 'Warung Apung Ibu Dayah Sekonyer',
    category: 'umkm',
    categoryLabel: 'UMKM Kuliner',
    lat: -2.7900,
    lng: 111.8510,
    location: 'Kanal Masuk Tanjung Harapan',
    description: 'Warung singgah terapung menyajikan ikan baung bakar khas sungai, kelapa muda segar, dan perbekalan kopi nahkoda kelotok.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    signal: '3G/Edge',
    payment: 'Tunai Wajib',
    estimatedCost: 'Rp 25.000 - Rp 60.000 / porsi',
    isRiverStop: true,
    recommendedStayDuration: '45 Menit',
  },
  {
    id: 'desa-sekonyer-craft',
    name: 'Sentra Anyaman Rotan Desa Sekonyer',
    category: 'umkm',
    categoryLabel: 'UMKM Kerajinan',
    lat: -2.7980,
    lng: 111.8590,
    location: 'Tepian Desa Sekonyer',
    description: 'Pengrajin lokal Dayak Ngaju & pesisir memproduksi tas anyaman rotan bermotif, miniatur kelotok kayu ulin, dan madu hutan alami.',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    signal: '3G/Edge',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 50.000 - Rp 250.000',
    isRiverStop: true,
    recommendedStayDuration: '1 Jam',
  },
  {
    id: 'kuliner-dermaga-kumai',
    name: 'Kedai Soto Banjar & Ikan Patin Kumai',
    category: 'umkm',
    categoryLabel: 'UMKM Kuliner',
    lat: -2.7415,
    lng: 111.7370,
    location: 'Jalan Bendahara, Dermaga Kumai',
    description: 'Kuliner sarapan pagi favorit sebelum menaiki kelotok. Tersedia nasi kuning iwak haruan dan soto banjar kuah rempah asli.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    signal: '4G Cepat',
    payment: 'QRIS & Tunai',
    estimatedCost: 'Rp 25.000 - Rp 45.000',
    isRiverStop: false,
    recommendedStayDuration: '30 Menit',
  },

  // 3. Layanan, Fasilitas & Radio Lapangan
  {
    id: 'pos-jagawana-teluk-pulai',
    name: 'Pos Pengawas Jagawana Teluk Pulai',
    category: 'layanan',
    categoryLabel: 'Layanan & Pos Penjagaan',
    lat: -2.7750,
    lng: 111.7820,
    location: 'Muara Masuk Sekonyer Bawah',
    description: 'Pemeriksaan tiket simaksi resmi, pencatatan log nahkoda, serta pos pengecekan radio keselamatan VHF maritim channel 16.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    signal: '3G/Edge',
    payment: 'Tunai Wajib',
    estimatedCost: 'Verifikasi Bebas Biaya',
    radioVhf: 'VHF Ch-16 (Stasiun Jaga)',
    isRiverStop: true,
    recommendedStayDuration: '15 Menit',
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
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    signal: '4G Cepat',
    payment: 'BPJS & Tunai',
    estimatedCost: 'Layanan Darurat 24 Jam',
    radioVhf: 'Radio Medik (0532-61234)',
    isRiverStop: false,
    recommendedStayDuration: 'Siaga 24 Jam',
  },

  // 4. ATM & Titik Tarik Tunai Terakhir
  {
    id: 'atm-bri-kumai',
    name: 'ATM BRI Unit Kumai (Tarik Tunai Terakhir)',
    category: 'atm',
    categoryLabel: 'Pemberhentian Tunai',
    lat: -2.7390,
    lng: 111.7320,
    location: 'Jl. Pelabuhan Kumai Hilir',
    description: 'Mesin ATM pecahan Rp 50.000 & Rp 100.000 terakhir yang dapat diakses sebelum kelotok berlayar masuk ke kawasan hutan sungai tanpa ATM.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    signal: '4G Cepat',
    payment: 'Tarik Tunai Kartu / QRIS Cardless',
    estimatedCost: 'Bawa Tunai Rp 1.5jt - Rp 2.5jt / orang',
    isRiverStop: false,
    recommendedStayDuration: '15 Menit',
  },
  {
    id: 'atm-bni-kumai',
    name: 'ATM BNI Link Kumai Panglima Utar',
    category: 'atm',
    categoryLabel: 'Pemberhentian Tunai',
    lat: -2.7410,
    lng: 111.7335,
    location: 'Depan Kantor Pelindo Kumai',
    description: 'Titik tarik tunai cadangan dengan akses kartu Prima/Bersama/Link, berjarak 300 meter dari dermaga kelotok.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    signal: '4G Cepat',
    payment: 'Tarik Tunai Kartu',
    estimatedCost: 'Tarik Tunai Siaga Ekspedisi',
    isRiverStop: false,
    recommendedStayDuration: '15 Menit',
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
