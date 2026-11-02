import { Destination, Umkm } from '@/types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'tanjung-puting',
    name: 'Taman Nasional Tanjung Puting',
    tagline: 'Ekspedisi Kelotok & Habitat Terbesar Orangutan Liar',
    location: 'Kotawaringin Barat, Kalimantan Tengah',
    district: 'Kotawaringin Barat',
    categories: ['Wisata Alam & Konservasi', 'Wildlife Orangutan', 'River Safari'],
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFokGFSbfWGEaWEAWeG1nOXCUf3UVAQZBWHpoqEpik2_wubRCiTBd1xRISuilASiO5XnGbodMbjJ61BZRyzczZoROY1ORE6zgNJ2RiupSSwUPLbfcho6RCs458XTT24zkQkG2NUht6SDwYSzsYWCbCISKQNjK5iW6XKLrWu20GxrswDxPEuvOok5rhRG2hro2HeCNg73ruhcrZO43Gqf3BLQcR7xsW2KO9KJfOp3Sp',
    packSize: '14.2 MB',
    packSizeBytes: 14889728,
    overview: 'Taman Nasional Tanjung Puting adalah pusat konservasi orangutan tropis terbesar di dunia. Wisatawan menjelajahi ekosistem hutan hujan primer dan rawa gambut dengan tinggal di atas perahu kayu tradisional (Kelotok) menyusuri Sungai Sekonyer selama 2 hingga 4 hari.',
    signalStatus: {
      telkomsel: 'Lemah / Edge di muara Sungai Sekonyer; Blankspot total di hulu Camp Leakey.',
      others: 'Tidak ada sinyal sama sekali sepanjang jalur kelotok.',
      fieldSummary: 'Koneksi seluler terputus 90% waktu ekspedisi sungai.',
      lastChecked: '2 jam lalu (Verifikasi Jagawana)'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: true,
      recommendedCash: 500000,
      recommendedCashFormatted: 'Rp 500.000 / orang',
      lastAtmLocation: 'Pelabuhan Kumai & Kota Pangkalan Bun',
      atmDistanceKm: 18,
      notes: 'QRIS & Transfer Bank aktif saat di Pelabuhan Kumai. Selama di atas kapal wajib uang tunai fisik untuk logistik ekstra dan tips nahkoda.'
    },
    logistics: {
      kelotokCharterPerDay: 700000,
      kelotokFormatted: 'Rp 2.100.000 (3H 2M include nahkoda & koki)',
      simaksiDomestic: 220000,
      simaksiFormatted: 'Rp 220.000 / orang (Simaksi TNTP 3 hari)',
      mealsEstPerDay: 100000,
      localGuidePerDay: 250000,
      bestSeason: 'Juni - Oktober (Musim Kering & Buah Hutan)'
    },
    activities: [
      {
        name: 'Feeding Time Orangutan',
        desc: 'Menyaksikan makan siang orangutan liar di Camp Leakey & Pondok Tanggui.',
        icon: 'nature_people',
        timing: '09.00 & 14.00 WIB'
      },
      {
        name: 'River Safari Kelotok',
        desc: 'Menyusuri sungai berair hitam Sekonyer, menyaksikan Bekantan bertengger di pohon nipah.',
        icon: 'directions_boat',
        timing: 'Sore Hari Menjelang Senja'
      },
      {
        name: 'Night Jungle Walk',
        desc: 'Trekking malam bersama pemandu lokal mencari jamur bercahaya (bioluminescent) dan tarsius.',
        icon: 'forest',
        timing: '19.30 - 21.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'Balai Konservasi TNTP Pos Kumai',
        role: 'Regulator & Izin Masuk',
        channel: 'VHF Saluran 16',
        phone: '+62 532 61451',
        notes: 'Pos pemantauan dermaga utama'
      },
      {
        name: 'Radio Darurat Kelotok Sekonyer',
        role: 'Nahkoda & Komunikasi Sungai',
        channel: 'Radio Maritim CH-16 (156.8 MHz)',
        notes: 'Dapat diakses nahkoda kapal Anda 24 jam'
      },
      {
        name: 'Puskesmas Perawatan Kumai',
        role: 'Fasilitas Kesehatan Terdekat',
        channel: 'Telepon Darurat',
        phone: '+62 532 61118',
        notes: 'Ambulans dermaga siap siaga'
      }
    ],
    offlinePackContents: {
      hasGpsTracks: true,
      hasOfflineMap: true,
      hasMerchantDirectory: true,
      hasEmergencyProtocols: true
    }
  },
  {
    id: 'taman-nasional-sebangau',
    name: 'Taman Nasional Sebangau',
    tagline: 'Laboratorium Rawa Gambut Terbesar & Susur Sungai Koran',
    location: 'Palangka Raya & Katingan, Kalimantan Tengah',
    district: 'Palangka Raya',
    categories: ['Wisata Alam & Konservasi', 'Susur Sungai Hitam', 'Ekowisata'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    packSize: '10.4 MB',
    packSizeBytes: 10905190,
    overview: 'Kawasan konservasi lahan gambut tropis yang mempesona dengan air sungai hitam alami (blackwater peat ecosystem). Titik tolak utama wisatawan berada di Dermaga Kereng Bangkirai menuju Sungai Koran.',
    signalStatus: {
      telkomsel: 'Stabil 4G di Dermaga Kereng Bangkirai; Hilang setelah 3 km masuk Sungai Koran.',
      others: 'Indosat & XL hanya terdeteksi di gerbang desa Kereng Bangkirai.',
      fieldSummary: 'Cukup stabil di area dermaga UMKM, hilang di jalur susur sungai.',
      lastChecked: '4 jam lalu'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: true,
      recommendedCash: 250000,
      recommendedCashFormatted: 'Rp 250.000 / orang',
      lastAtmLocation: 'Kota Palangka Raya (Radius 12 km)',
      atmDistanceKm: 12,
      notes: 'Banyak warung apung di dermaga sudah terima QRIS Bank Kalteng dan BCA. Sewa perahu kecil dianjurkan DP via transfer.'
    },
    logistics: {
      kelotokCharterPerDay: 450000,
      kelotokFormatted: 'Rp 450.000 (Sewa perahu susur 1 hari)',
      simaksiDomestic: 30000,
      simaksiFormatted: 'Rp 30.000 / orang',
      mealsEstPerDay: 75000,
      localGuidePerDay: 150000,
      bestSeason: 'Sepanjang tahun (puncak air pasang indah Nov - Maret)'
    },
    activities: [
      {
        name: 'Susur Air Hitam Kereng Bangkirai',
        desc: 'Berlayar santai menikmati keunikan air sungai berwarna merah pekat dari tanin pohon gambut.',
        icon: 'water',
        timing: '08.00 - 17.00 WIB'
      },
      {
        name: 'Pondok Wisata Pos Koran',
        desc: 'Singgah di pos rimba untuk melihat habitat kantung semar liar (Nepenthes) dan sarang orangutan Sebangau.',
        icon: 'forest',
        timing: '10.00 - 14.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'Pos Jaga Balai TN Sebangau Dermaga Kereng',
        role: 'Regulator & Posko',
        channel: 'Telepon / Radio',
        phone: '+62 536 3232675',
        notes: 'Pintu masuk Dermaga 1'
      },
      {
        name: 'SAR Palangka Raya (Basarnas)',
        role: 'Evakuasi Air & Hutan',
        channel: 'Hotline 115 / Radio VHF',
        phone: '+62 536 3221115',
        notes: 'Siaga darurat sungai 24 Jam'
      }
    ],
    offlinePackContents: {
      hasGpsTracks: true,
      hasOfflineMap: true,
      hasMerchantDirectory: true,
      hasEmergencyProtocols: true
    }
  },
  {
    id: 'bukit-tangkiling',
    name: 'Kawasan Wisata Alam Bukit Tangkiling',
    tagline: 'Panorama Bukit Batu Purba & Suaka Nyaru Menteng',
    location: 'Kecamatan Bukit Batu, Palangka Raya',
    district: 'Palangka Raya',
    categories: ['Trekking Bukit', 'Budaya Dayak', 'Konservasi'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    packSize: '8.1 MB',
    packSizeBytes: 8493465,
    overview: 'Gugusan sembilan bukit batu granit purba di tengah dataran gambut. Berdekatan dengan Pusat Rehabilitasi Orangutan Nyaru Menteng (BOS Foundation) dan rumah betang adat Dayak.',
    signalStatus: {
      telkomsel: 'Sinyal 4G kuat di kaki bukit & puncak Bukit Tangkiling.',
      others: 'Semua operator seluler beroperasi cukup baik.',
      fieldSummary: 'Aman sinyal, namun Travel Pack tetap dianjurkan untuk panduan rute batu terjal.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: false,
      recommendedCash: 150000,
      recommendedCashFormatted: 'Rp 150.000 / orang',
      lastAtmLocation: 'Jalan Tjilik Riwut Km 29 Tangkiling',
      atmDistanceKm: 2,
      notes: 'QRIS didukung hampir di semua gerai cenderamata batu akik dan kuliner Dayak.'
    },
    logistics: {
      kelotokCharterPerDay: 0,
      kelotokFormatted: 'Tidak ada (Jalur darat roda dua/empat)',
      simaksiDomestic: 10000,
      simaksiFormatted: 'Rp 10.000 / orang (Retribusi TWA)',
      mealsEstPerDay: 50000,
      localGuidePerDay: 100000,
      bestSeason: 'Pagi hari sebelum terik matahari (05.30 - 08.30 WIB)'
    },
    activities: [
      {
        name: 'Sunrise Trekking Puncak Batu',
        desc: 'Menikmati pemandangan hamparan kanopi hutan Kalimantan dari ketinggian batu karst.',
        icon: 'landscape',
        timing: '05.30 WIB'
      },
      {
        name: 'Kunjungan Edukasi Nyaru Menteng',
        desc: 'Mengenal proses sekolah hutan bayi orangutan yang diselamatkan.',
        icon: 'school',
        timing: '09.00 - 12.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'BKSDA Kalimantan Tengah Pos Tangkiling',
        role: 'Pengelola TWA',
        channel: 'Telepon',
        phone: '+62 536 3221234',
        notes: 'Pintu Gerbang TWA Tangkiling'
      }
    ],
    offlinePackContents: {
      hasGpsTracks: true,
      hasOfflineMap: true,
      hasMerchantDirectory: true,
      hasEmergencyProtocols: true
    }
  },
  {
    id: 'bukit-baka-bukit-raya',
    name: 'Taman Nasional Bukit Baka Bukit Raya',
    tagline: 'Atap Tertinggi Kalimantan & Ekspedisi Rimba Pegunungan Schwaner',
    location: 'Katingan & Perbatasan Kalbar, Kalimantan Tengah',
    district: 'Katingan',
    categories: ['Pendakian Ekspedisi', 'Hutan Pegunungan', 'Wisata Petualangan'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    packSize: '16.8 MB',
    packSizeBytes: 17616076,
    overview: 'Kawasan konservasi pegunungan megah di jantung pulau Borneo. Rumah bagi puncak tertinggi Kalimantan Tengah (Puncak Kaba 2.278 mdpl), flora langka Rafflesia borneensis, serta arung jeram menantang di Sungai Samba.',
    signalStatus: {
      telkomsel: 'Blankspot total di jalur pendakian rimba. Sinyal hanya ada di desa Kasongan & Tumbang Habangoi.',
      others: 'Tidak ada sinyal sama sekali.',
      fieldSummary: 'Wajib membawa Travel Pack offline dan radio komunikasi dua arah.',
      lastChecked: 'Kemarin (Laporan Jagawana Katingan)'
    },
    paymentReadiness: {
      qrisAvailable: false,
      cashRequired: true,
      recommendedCash: 750000,
      recommendedCashFormatted: 'Rp 750.000 / orang',
      lastAtmLocation: 'Kota Kasongan (Ibukota Katingan)',
      atmDistanceKm: 65,
      notes: 'Wajib tarik uang tunai penuh di Kasongan untuk pembayaran porter Dayak Ot Danum dan logistik perbekalan gunung.'
    },
    logistics: {
      kelotokCharterPerDay: 350000,
      kelotokFormatted: 'Rp 350.000 (Perahu getek susur sungai hulu)',
      simaksiDomestic: 50000,
      simaksiFormatted: 'Rp 50.000 / orang (Simaksi TNBBBR)',
      mealsEstPerDay: 80000,
      localGuidePerDay: 300000,
      bestSeason: 'Juli - Oktober (Musim kemarau pendakian aman)'
    },
    activities: [
      {
        name: 'Ekspedisi 7 Summits Puncak Raya',
        desc: 'Trekking menantang menembus hutan lumut purba pegunungan Schwaner hingga puncak 2.278 mdpl.',
        icon: 'hiking',
        timing: 'Ekspedisi 5 Hari 4 Malam'
      },
      {
        name: 'Pengamatan Rafflesia & Flora Langka',
        desc: 'Menelusuri lembah hulu sungai untuk melihat mekarnya bunga Rafflesia borneensis dan anggrek hitam liar.',
        icon: 'nature',
        timing: 'Pagi Hari Bersama Pemandu Adat'
      },
      {
        name: 'Arung Jeram Sungai Samba',
        desc: 'Uji adrenalin melintasi jeram berbatu alami di aliran sungai berarus jernih pedalaman Katingan.',
        icon: 'kayaking',
        timing: '09.00 - 15.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'Kantor Balai TNBBBR Resort Katingan',
        role: 'Regulator & Pos Simaksi',
        channel: 'Telepon & Radio Balai',
        phone: '+62 536 3228899',
        notes: 'Pendaftaran izin pendakian'
      },
      {
        name: 'Pos Radio Siaga Komunitas Porter Dayak',
        role: 'Pemandu & Evakuasi Gunung',
        channel: 'Radio Komunikasi VHF 142.100 MHz',
        notes: 'Standby pos basecamp Tumbang Habangoi'
      }
    ],
    offlinePackContents: {
      hasGpsTracks: true,
      hasOfflineMap: true,
      hasMerchantDirectory: true,
      hasEmergencyProtocols: true
    }
  },
  {
    id: 'danau-tahai',
    name: 'Ekowisata Danau Gambut Tahai',
    tagline: 'Danau Air Merah Eksotis & Jembatan Titian Pohon Ulin',
    location: 'Desa Tahai Baru, Pulang Pisau (Dekat Palangka Raya)',
    district: 'Pulang Pisau',
    categories: ['Danau Gambut Merah', 'Titian Kayu Ulin', 'Wisata Edukasi'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1200&auto=format&fit=crop',
    packSize: '7.6 MB',
    packSizeBytes: 7969177,
    overview: 'Keunikan danau air gambut berwarna kemerahan alami yang dikelilingi jembatan titian kayu ulin sepanjang ratusan meter melingkar di atas rawa. Pengunjung dapat menikmati sewa perahu bebek air dan kuliner ikan patin bakar terapung.',
    signalStatus: {
      telkomsel: 'Sinyal 4G sangat kuat dan lancar.',
      others: 'Semua operator seluler beroperasi optimal.',
      fieldSummary: 'Koneksi internet stabil untuk pembayaran digital dan live streaming.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: false,
      recommendedCash: 100000,
      recommendedCashFormatted: 'Rp 100.000 / orang',
      lastAtmLocation: 'Jalan Trans Kalimantan Km 29',
      atmDistanceKm: 3,
      notes: 'QRIS didukung di hampir semua warung terapung dan loket tiket masuk.'
    },
    logistics: {
      kelotokCharterPerDay: 50000,
      kelotokFormatted: 'Rp 50.000 (Sewa perahu keliling danau per rombongan)',
      simaksiDomestic: 10000,
      simaksiFormatted: 'Rp 10.000 / orang (Tiket Masuk)',
      mealsEstPerDay: 45000,
      localGuidePerDay: 80000,
      bestSeason: 'Pagi dan sore hari saat teduh'
    },
    activities: [
      {
        name: 'Menelusuri Titian Jembatan Ulin',
        desc: 'Berjalan santai di atas jembatan kayu ulin melingkar di bawah rimbunnya pohon jelutung dan ramin.',
        icon: 'directions_walk',
        timing: '07.00 - 17.30 WIB'
      },
      {
        name: 'Sewa Perahu Bebek Air & Dayung',
        desc: 'Mengayuh perahu santai di atas air gambut merah dan mengabadikan foto estetik refleksi hutan.',
        icon: 'rowing',
        timing: '08.00 - 17.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'Pengelola Pokdarwis Danau Tahai',
        role: 'Pemandu & Informasi Wisata',
        channel: 'WhatsApp / Telepon',
        phone: '+62 812 5543 2190',
        notes: 'Pintu Gerbang Utama'
      }
    ],
    offlinePackContents: {
      hasGpsTracks: true,
      hasOfflineMap: true,
      hasMerchantDirectory: true,
      hasEmergencyProtocols: true
    }
  },
  {
    id: 'pantai-kubu',
    name: 'Kawasan Pesisir Pantai Kubu & Bogam',
    tagline: 'Pesona Pasir Cokelat Laut Jawa & Dermaga Kayu Ulin',
    location: 'Kecamatan Kumai, Kotawaringin Barat',
    district: 'Kotawaringin Barat',
    categories: ['Wisata Pantai Pesisir', 'Kuliner Hasil Laut', 'Sunset Dermaga'],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    packSize: '8.5 MB',
    packSizeBytes: 8912896,
    overview: 'Pantai landai eksotis menghadap Laut Jawa dengan dermaga kayu ulin sepanjang 200 meter menjulur ke lautan. Menjadi destinasi favorit untuk menikmati matahari terbenam dan menyantap olahan kepiting rajungan segar tangkapan nelayan lokal.',
    signalStatus: {
      telkomsel: 'Sinyal 4G stabil di area dermaga dan warung makan pesisir.',
      others: 'Operator lain 3G/4G sedang.',
      fieldSummary: 'Koneksi seluler cukup baik di bibir pantai.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: true,
      recommendedCash: 250000,
      recommendedCashFormatted: 'Rp 250.000 / orang',
      lastAtmLocation: 'Pusat Kota Kumai',
      atmDistanceKm: 14,
      notes: 'QRIS aktif di resto olahan laut besar. Sediakan uang tunai untuk sewa perahu motor nelayan dan belanja cenderamata terasi rebon.'
    },
    logistics: {
      kelotokCharterPerDay: 150000,
      kelotokFormatted: 'Rp 150.000 (Sewa perahu motor susur teluk pesisir)',
      simaksiDomestic: 15000,
      simaksiFormatted: 'Rp 15.000 / orang (Retribusi Kawasan)',
      mealsEstPerDay: 75000,
      localGuidePerDay: 100000,
      bestSeason: 'Sore hari menjelang matahari terbenam (16.00 - 18.00 WIB)'
    },
    activities: [
      {
        name: 'Sunset Walk di Ujung Jembatan Ulin',
        desc: 'Menikmati hembusan angin laut dan panorama senja keemasan di atas jembatan dermaga ulin panjang.',
        icon: 'sunny',
        timing: '16.30 - 18.00 WIB'
      },
      {
        name: 'Pesta Kuliner Kepiting Rajungan & Udang Galah',
        desc: 'Menikmati sajian hidangan laut segar bumbu asam manis khas pesisir Kumai langsung dari tangkapan nelayan.',
        icon: 'restaurant',
        timing: 'Siang & Malam Hari'
      }
    ],
    emergencyContacts: [
      {
        name: 'Pos Polairud & SAR Teluk Kumai',
        role: 'Keamanan Laut & Keselamatan Pantai',
        channel: 'Radio Maritim VHF Ch-16 / Telepon',
        phone: '+62 532 61288',
        notes: 'Pos dermaga pantai Kubu'
      }
    ],
    offlinePackContents: {
      hasGpsTracks: true,
      hasOfflineMap: true,
      hasMerchantDirectory: true,
      hasEmergencyProtocols: true
    }
  },
  {
    id: 'batu-banama',
    name: 'Situs Budaya Dayak Batu Banama & Betang',
    tagline: 'Legenda Perahu Batu Keramat & Kemegahan Rumah Adat Betang',
    location: 'Kelurahan Sei Gohong, Bukit Batu, Palangka Raya',
    district: 'Palangka Raya',
    categories: ['Wisata Budaya Dayak', 'Situs Sejarah Legenda', 'Arsitektur Betang'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1200&auto=format&fit=crop',
    packSize: '9.2 MB',
    packSizeBytes: 9646899,
    overview: 'Situs formasi batu alam menyerupai perahu layar (Banama) yang melegenda dalam cerita rakyat Dayak Ngaju di tepian Sungai Rungan. Bersebelahan dengan Rumah Betang adat Dayak kayu ulin berusia ratusan tahun dan sanggar ukir getah nyatu.',
    signalStatus: {
      telkomsel: 'Sinyal 4G stabil di area pemukiman dan situs adat.',
      others: 'Sinyal 3G/4G stabil.',
      fieldSummary: 'Sinyal internet stabil.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: false,
      recommendedCash: 150000,
      recommendedCashFormatted: 'Rp 150.000 / orang',
      lastAtmLocation: 'Jalan Tjilik Riwut Km 32',
      atmDistanceKm: 4,
      notes: 'QRIS didukung untuk pembelian kerajinan getah nyatu dan cenderamata khas Dayak.'
    },
    logistics: {
      kelotokCharterPerDay: 0,
      kelotokFormatted: 'Tidak ada (Dapat diakses jalur darat)',
      simaksiDomestic: 15000,
      simaksiFormatted: 'Rp 15.000 / orang (Donasi Pemeliharaan Situs Adat)',
      mealsEstPerDay: 50000,
      localGuidePerDay: 100000,
      bestSeason: 'Pagi dan siang hari saat sanggar seni adat buka'
    },
    activities: [
      {
        name: 'Eksplorasi Legenda Perahu Batu Keramat',
        desc: 'Mendengarkan kisah tutur tetua adat tentang kutukan kapal saudagar yang membatu di tepian Sungai Rungan.',
        icon: 'history_edu',
        timing: '09.00 - 15.00 WIB'
      },
      {
        name: 'Napak Tilas Rumah Betang Adat Kayu Ulin',
        desc: 'Melihat arsitektur asli rumah panggung panjang Dayak yang tahan ratusan tahun tanpa paku besi.',
        icon: 'home',
        timing: '10.00 - 16.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'Lembaga Adat Dayak Kedamangan Bukit Batu',
        role: 'Tokoh Adat & Pendamping Wisata',
        channel: 'Telepon',
        phone: '+62 536 3224567',
        notes: 'Sekretariat Betang Sei Gohong'
      }
    ],
    offlinePackContents: {
      hasGpsTracks: true,
      hasOfflineMap: true,
      hasMerchantDirectory: true,
      hasEmergencyProtocols: true
    }
  }
];

export const INITIAL_UMKM: Umkm[] = [
  {
    id: 'umkm-1',
    destinationId: 'tanjung-puting',
    name: 'Dapur Dayak Kumai Sejahtera',
    ownerName: 'Ibu Ratna Kumai',
    category: 'kuliner',
    categoryLabel: 'Kuliner Khas',
    description: 'Spesialis Ikan Baung Bakar rempah Dayak & Juhu Singkah (sayur umbut rotan asam segar).',
    priceRange: 'Rp 25.000 - Rp 65.000',
    locationDesc: 'Dermaga Kumai, 800m dari loket kapal',
    distanceDesc: '800m dari Pelabuhan Kumai',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa-2Jlznh445KvsZQqjAvLqQ7w1YEOVAzl9zJcoge7E4chorQQphnW2PokzdcAdU7Dm48zWu43Mx9M_i2t4-vSlLe8R0oGyGVnYaTo3IXI9NcP-QLuq7vaAVK2lW_q80D5W5IioE8z4YAdcQjjf-6w1QG_PuBsnypVbmi2aPiKouQAMmNAWVfto46xu_i3jZWfZvZMq-ihR0P4r0kRXvcRJ9Lj5540RkPplgi2aKFk',
    signalStatus: 'Sinyal 4G Stabil',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Dapur Dayak Kumai (NMID: ID1020304050)',
    hasTransfer: true,
    bankName: 'Bank Kalteng / Mandiri',
    bankNumber: '100-2918-2819',
    needsCash: true,
    whatsapp: '+6281234567890',
    offlineNotes: 'Pilihan pas santap siang sebelum boarding ke perahu Kelotok.',
    featured: true
  },
  {
    id: 'umkm-2',
    destinationId: 'tanjung-puting',
    name: 'Kelotok Wisata Berkah Sungai (Pak Joko)',
    ownerName: 'Pak Joko Subagyo',
    category: 'kelotok',
    categoryLabel: 'Penginapan & Kelotok',
    description: 'Sewa perahu kayu tradisional jelajah TN Tanjung Puting 2D1N & 3D2N berfasilitas kasur bersih, kelambu, toilet duduk, dan juru masak.',
    priceRange: 'Rp 1.800.000 - Rp 2.500.000 / trip',
    locationDesc: 'Tambatan Dermaga 2 Sekonyer, Kumai',
    distanceDesc: 'Dermaga 2 Sekonyer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbGwKEHZh6OJwr_wberpt0_PIzKgNXDVDXs-tZIyoBJNkANeHKvqH3LRmzcKq8qzb7F_5_VDbcW1yILQ0rYGcONkWFa5-uhUn3fTIYYw908ABQFay-pP3vC96hZV0-tDwPvRtOIlK37RWgCg8eb1o3uExSVngRcxybbfZOuz7wv9gkXpOB_fDoRcFEqp2_YTunp9rxE-pPA0-UhiTN9HdgFZ7rK3hg-SsYctZ7QZGX',
    signalStatus: 'Sinyal Hilang saat Berlayar',
    signalOk: false,
    hasQris: false,
    hasTransfer: true,
    bankName: 'BRI / BNI',
    bankNumber: '0281-0102-3928-501',
    needsCash: true,
    whatsapp: '+6281351239876',
    offlineNotes: 'DP bisa transfer saat di kota; pelunasan dan tips awak disarankan uang tunai pecahan Rp 50.000/100.000.',
    featured: true
  },
  {
    id: 'umkm-3',
    destinationId: 'tanjung-puting',
    name: 'Kerajinan Anyaman Rotan Dayak "Kandui"',
    ownerName: 'Mama Kandui',
    category: 'souvenir',
    categoryLabel: 'Oleh-oleh & Kerajinan',
    description: 'Tas anjat, topi purun tahan air, gelang simpai rotan asli pengrajin perempuan Dayak Ngaju tepi Sungai Sekonyer.',
    priceRange: 'Rp 20.000 - Rp 180.000',
    locationDesc: 'Desa Sekonyer, tepi sungai',
    distanceDesc: '3.8 km susur sungai',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    signalStatus: 'Sinyal Kadang Edge',
    signalOk: false,
    hasQris: true,
    qrisMerchantName: 'Anyaman Rotan Kandui (QRIS Statis Tercetak)',
    hasTransfer: true,
    bankName: 'Bank Kalteng',
    bankNumber: '202-0921-3918',
    needsCash: true,
    whatsapp: '+6285249001122',
    offlineNotes: 'Memiliki lembar barcode QRIS fisik, tetapi jika sinyal drop wajib bayar tunai.',
    featured: true
  },
  {
    id: 'umkm-4',
    destinationId: 'tanjung-puting',
    name: 'Pemandu Rimba Berlisensi HPI (Pak Darman)',
    ownerName: 'Darman Bahalap',
    category: 'transport',
    categoryLabel: 'Transportasi Lokal',
    description: 'Pemandu lokal bersertifikat HPI Kalteng ahli mendeteksi suara orangutan, burung enggang, dan navigasi rimba.',
    priceRange: 'Rp 250.000 / hari',
    locationDesc: 'Sekonyer & Balai TNTP Kumai',
    distanceDesc: 'Pelabuhan Kumai',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGLrfBSImG7R_7cpSXyj3XPevtdaKzdche3TrfK_Dvx7xIpNZfLT17ZUQL4L4eBtVChWq9omkUrJIuUzptKgt30oG1DYPtnus7vM57PL-86mjpp4vpxEUxjoUThUmf0NcBVCaqfeG5Rg2PT894BBS2HoCnBrCSwmdAzFLzgdL-FBvpC6sx9Zg1tgekct5eTogNf_eK86ww0zZpEqHADCpEQmbo7psjV0IYCFTLHL-7',
    signalStatus: 'Radio CH-16 Aktif',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Darman Guide TNTP',
    hasTransfer: true,
    bankName: 'Mandiri',
    bankNumber: '159-00-1283910-1',
    needsCash: true,
    whatsapp: '+628115203344',
    offlineNotes: 'Bawa uang saku pecahan kecil untuk belanja di pondok konservasi.',
    featured: false
  },
  {
    id: 'umkm-5',
    destinationId: 'taman-nasional-sebangau',
    name: 'Warung Terapung Danau Sebangau (Ibu Asnah)',
    ownerName: 'Ibu Asnah',
    category: 'kuliner',
    categoryLabel: 'Kuliner Khas',
    description: 'Menyajikan Ikan Salap Bakar, Katu Sambal Terasi Habang, serta kelapa muda segar di atas dermaga apung Kereng Bangkirai.',
    priceRange: 'Rp 15.000 - Rp 45.000',
    locationDesc: 'Dermaga Kereng Bangkirai No. 12',
    distanceDesc: 'Tepi Dermaga Utama',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    signalStatus: 'Sinyal 4G Kuat',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Warung Terapung Asnah Sebangau',
    hasTransfer: true,
    bankName: 'BCA / Bank Kalteng',
    bankNumber: '8620-112-990',
    needsCash: true,
    whatsapp: '+6281255443322',
    offlineNotes: 'QRIS lancar dipindai dari semua aplikasi m-banking dan e-wallet.',
    featured: true
  },
  {
    id: 'umkm-6',
    destinationId: 'bukit-tangkiling',
    name: 'Pusat Kerajinan Getah Nyatu Kahayan',
    ownerName: 'Pak Budi Hartono',
    category: 'souvenir',
    categoryLabel: 'Oleh-oleh & Kerajinan',
    description: 'Miniatur perahu naga Dayak dan patung burung tingang yang terbuat dari getah pohon nyatu khas Kalimantan Tengah.',
    priceRange: 'Rp 50.000 - Rp 350.000',
    locationDesc: 'Jl. Tjilik Riwut Km 32 Tangkiling',
    distanceDesc: 'Pintu Masuk TWA Bukit Tangkiling',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    signalStatus: 'Sinyal 4G Stabil',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Getah Nyatu Kahayan Kalteng',
    hasTransfer: true,
    bankName: 'Mandiri / BRI',
    bankNumber: '159-00-998877-2',
    needsCash: false,
    whatsapp: '+6281344556677',
    offlineNotes: 'Menerima pembayaran digital penuh (QRIS, Kartu Debit, Transfer).',
    featured: true
  }
];
