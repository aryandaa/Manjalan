import { Destination, Umkm } from '@/types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'tanjung-puting',
    name: 'Taman Nasional Tanjung Puting',
    tagline: 'Pusat Konservasi Hutan Hujan Tropis & Habitat Liar Orangutan',
    location: 'Kotawaringin Barat & Seruyan, Kalimantan Tengah',
    district: 'Kotawaringin Barat',
    categories: ['Wisata Alam & Konservasi', 'Wildlife Orangutan', 'River Safari'],
    rating: 4.9,
    image: '/images/destinasi/tanjung-puting-main.jpg',
    gallery: [
      '/images/destinasi/tanjung-puting-main.jpg',
      '/images/destinasi/tanjung-puting-orangutan.jpg',
      '/images/destinasi/tanjung-puting-sekonyer.jpg',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=m0EY-GFn6Rc',
    gmapsUrl: 'https://maps.google.com/?q=Taman+Nasional+Tanjung+Puting',
    packSize: '14.2 MB',
    packSizeBytes: 14889728,
    overview: 'Taman Nasional Tanjung Puting adalah pusat konservasi orangutan tropis terbesar di dunia. Wisatawan menjelajahi ekosistem hutan hujan primer dan rawa gambut dengan tinggal di atas perahu kayu tradisional (Kelotok) menyusuri Sungai Sekonyer menuju Camp Leakey, Pondok Tanggui, dan Tanjung Harapan.',
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
    tagline: 'Laboratorium Ekosistem Gambut Air Hitam Terbesar Borneo',
    location: 'Palangka Raya, Katingan & Pulang Pisau, Kalimantan Tengah',
    district: 'Palangka Raya',
    categories: ['Wisata Alam & Konservasi', 'Susur Sungai Hitam', 'Ekowisata'],
    rating: 4.8,
    image: '/images/destinasi/sebangau-main.jpg',
    gallery: [
      '/images/destinasi/sebangau-main.jpg',
      '/images/destinasi/sebangau-river.jpg',
      '/images/destinasi/sebangau-rasau.jpg',
    ],
    videoUrl: '/images/destinasi/sebangau-video.webm',
    gmapsUrl: 'https://maps.google.com/?q=Dermaga+Kereng+Bangkirai+Sebangau',
    packSize: '10.4 MB',
    packSizeBytes: 10905190,
    overview: 'Kawasan konservasi lahan gambut tropis seluas lebih dari 568.000 hektar yang mempesona dengan air sungai hitam alami (blackwater peat ecosystem) akibat zat tanin gambut. Titik tolak utama wisatawan berada di Dermaga Kereng Bangkirai menuju Sungai Koran.',
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
    tagline: 'Perbukitan Batu Granit Purba & Suaka Alam Nyaru Menteng',
    location: 'Kecamatan Bukit Batu, Kota Palangka Raya, Kalimantan Tengah',
    district: 'Palangka Raya',
    categories: ['Wisata Alam', 'Trekking Perbukitan', 'Budaya & Legenda'],
    rating: 4.7,
    image: '/images/destinasi/bukit-tangkiling.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=rDb-rtI0eIM',
    gmapsUrl: 'https://maps.google.com/?q=Taman+Wisata+Alam+Bukit+Tangkiling',
    packSize: '8.1 MB',
    packSizeBytes: 8493465,
    overview: 'Kawasan konservasi alam seluas 1.114 hektar yang terdiri dari 9 perbukitan batu granit purba menjulang di dataran datar Kalimantan Tengah. Berdekatan dengan Pusat Rehabilitasi Orangutan Nyaru Menteng (BOS Foundation) dan rumah betang adat Dayak.',
    signalStatus: {
      telkomsel: 'Sinyal 4G kuat di kaki bukit & puncak Bukit Tangkiling.',
      others: 'Semua operator seluler beroperasi cukup baik.',
      fieldSummary: 'Aman sinyal, namun Travel Pack tetap dianjurkan untuk panduan rute batu terjal.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: true,
      recommendedCash: 150000,
      recommendedCashFormatted: 'Rp 150.000 / orang',
      lastAtmLocation: 'Tangkiling & Pasar Bukit Batu',
      atmDistanceKm: 2,
      notes: 'Kios oleh-oleh dan warung kaki bukit sebagian menerima QRIS, siapkan uang tunai untuk parkir dan jasa porter lokal.'
    },
    logistics: {
      kelotokCharterPerDay: 0,
      kelotokFormatted: 'Akses Darat (Mobil / Motor)',
      simaksiDomestic: 10000,
      simaksiFormatted: 'Rp 10.000 / orang',
      mealsEstPerDay: 50000,
      localGuidePerDay: 100000,
      bestSeason: 'Pagi hari (05.30 WIB untuk sunrise) atau sore hari'
    },
    activities: [
      {
        name: 'Trekking Puncak Batu Granit',
        desc: 'Menaklukkan jalur tangga batu menuju gardu pandang dengan panorama hutan 360 derajat.',
        icon: 'hiking',
        timing: '06.00 - 10.00 WIB'
      },
      {
        name: 'Wisata Edukasi Nyaru Menteng',
        desc: 'Melihat sekolah hutan orangutan BOSF di kawasan konservasi penyangga Tangkiling.',
        icon: 'pets',
        timing: '09.00 - 15.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'BKSDA Pos Jaga Tangkiling',
        role: 'Regulator Kawasan TWA',
        channel: 'Telepon Langsung',
        phone: '+62 536 3221762',
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
    id: 'danau-tahai',
    name: 'Ekowisata Danau Gambut Tahai',
    tagline: 'Danau Air Merah Gambut & Jembatan Titian Kayu Ulin Hutan Rawa',
    location: 'Kelurahan Tumbang Tahai, Bukit Batu, Palangka Raya, Kalimantan Tengah',
    district: 'Palangka Raya',
    categories: ['Ekowisata', 'Danau Gambut', 'Titian Kayu Ulin'],
    rating: 4.7,
    image: '/images/destinasi/danau-tahai.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=wKKTbggGOj8',
    gmapsUrl: 'https://maps.google.com/?q=Danau+Tahai+Palangka+Raya',
    packSize: '7.8 MB',
    packSizeBytes: 8178892,
    overview: 'Danau genangan air gambut berwarna merah kecokelatan yang unik, dikelilingi jembatan titian kayu ulin meliuk melintasi hutan rawa lebat, rumah pohon eksotis, dan berdekatan dengan Pusat Rehabilitasi Orangutan Nyaru Menteng (BOSF).',
    signalStatus: {
      telkomsel: 'Sinyal 4G kuat dan stabil di sepanjang titian ulin.',
      others: 'Operator lain 4G lancar.',
      fieldSummary: 'Area wisata tercover sinyal seluler dengan baik.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: true,
      recommendedCash: 100000,
      recommendedCashFormatted: 'Rp 100.000 / orang',
      lastAtmLocation: 'Kecamatan Bukit Batu',
      atmDistanceKm: 3,
      notes: 'Tiket masuk dan sewa sepeda air dapat menggunakan QRIS dan tunai.'
    },
    logistics: {
      kelotokCharterPerDay: 50000,
      kelotokFormatted: 'Rp 50.000 (Sewa perahu bebek kayuh)',
      simaksiDomestic: 10000,
      simaksiFormatted: 'Rp 10.000 / orang',
      mealsEstPerDay: 45000,
      localGuidePerDay: 80000,
      bestSeason: 'Pagi dan sore hari saat cuaca cerah'
    },
    activities: [
      {
        name: 'Jelajah Titian Jembatan Ulin',
        desc: 'Menyusuri jalur kayu ulin di atas air gambut merah sembari menikmati udara segar hutan rawa.',
        icon: 'forest',
        timing: '07.30 - 17.30 WIB'
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
    id: 'istana-kuning',
    name: 'Istana Kuning Pangkalan Bun',
    tagline: 'Warisan Bersejarah Kesultanan Kutaringin Berbalut Kayu Ulin Megah',
    location: 'Kotawaringin Barat, Kalimantan Tengah',
    district: 'Kotawaringin Barat',
    categories: ['Wisata Sejarah', 'Budaya Kerajaan', 'Arsitektur Kayu Ulin'],
    rating: 4.8,
    image: '/images/destinasi/istana-kuning.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=101kZBBjg0c',
    gmapsUrl: 'https://maps.google.com/?q=Istana+Kuning+Pangkalan+Bun',
    packSize: '6.5 MB',
    packSizeBytes: 6815744,
    overview: 'Istana Kesultanan Kutaringin—satu-satunya kerajaan Islam di Kalimantan Tengah yang didirikan abad ke-17. Bangunan megah ini didominasi kayu ulin kokoh dengan koleksi meriam kuno, baju adat kebesaran raja, dan ukiran khas perpaduan Melayu-Dayak.',
    signalStatus: {
      telkomsel: 'Sinyal 4G/5G sangat kuat di pusat kota Pangkalan Bun.',
      others: 'Semua operator seluler sangat stabil.',
      fieldSummary: 'Area perkotaan dengan koneksi internet cepat dan stabil.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: false,
      recommendedCash: 100000,
      recommendedCashFormatted: 'Rp 100.000 / orang',
      lastAtmLocation: 'Pusat Kota Pangkalan Bun (Radius 200m)',
      atmDistanceKm: 0.2,
      notes: 'Banyak gerai ATM dan merchant di sekitar istana yang menerima QRIS dan non-tunai.'
    },
    logistics: {
      kelotokCharterPerDay: 0,
      kelotokFormatted: 'Akses Darat Perkotaan',
      simaksiDomestic: 10000,
      simaksiFormatted: 'Rp 10.000 / orang (Donasi Cagar Budaya)',
      mealsEstPerDay: 50000,
      localGuidePerDay: 75000,
      bestSeason: 'Setiap hari pukul 08.00 - 16.00 WIB'
    },
    activities: [
      {
        name: 'Tur Sejarah Kerajaan Kutaringin',
        desc: 'Mengeksplorasi balairung istana kayu ulin kuno, meriam bersejarah, dan peninggalan pusaka sultan.',
        icon: 'museum',
        timing: '09.00 - 15.00 WIB'
      },
      {
        name: 'Foto Busana Adat Kerajaan',
        desc: 'Mencoba pakaian adat pengantin kerajaan Kutaringin di pelataran istana.',
        icon: 'photo_camera',
        timing: '10.00 - 14.00 WIB'
      }
    ],
    emergencyContacts: [
      {
        name: 'Dinas Pariwisata Kotawaringin Barat',
        role: 'Pengelola Cagar Budaya',
        channel: 'Telepon',
        phone: '+62 532 21255',
        notes: 'Pusat Informasi Wisata Pangkalan Bun'
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
    id: 'pantai-ujung-pandaran',
    name: 'Pantai Ujung Pandaran',
    tagline: 'Hamparan Pasir Putih Pesisir Laut Jawa & Wisata Religi Makam Ulama',
    location: 'Kecamatan Teluk Sampit, Kabupaten Kotawaringin Timur, Kalimantan Tengah',
    district: 'Kotawaringin Timur',
    categories: ['Wisata Bahari', 'Pantai Pasir Putih', 'Wisata Religi & Sunset'],
    rating: 4.7,
    image: '/images/destinasi/pantai-ujung-pandaran.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=C2_oEhF7XGA',
    gmapsUrl: 'https://maps.google.com/?q=Pantai+Ujung+Pandaran+Sampit',
    packSize: '8.9 MB',
    packSizeBytes: 9332326,
    overview: 'Destinasi pantai paling populer di Kotawaringin Timur yang menghadap langsung ke Laut Jawa. Menyajikan panorama matahari terbenam spektakuler, hamparan pasir putih bersih, serta situs ziarah kubah ulama Syekh Abu Hamid bin Syekh Haji Muhammad As\'ad Al-Banjari.',
    signalStatus: {
      telkomsel: 'Sinyal 4G stabil di area penginapan dan gerbang pantai.',
      others: 'Operator lain 3G/Edge di tepi pantai selatan.',
      fieldSummary: 'Sinyal cukup baik di pemukiman nelayan sekitar pantai.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: true,
      recommendedCash: 300000,
      recommendedCashFormatted: 'Rp 300.000 / orang',
      lastAtmLocation: 'Kota Samuda (Radius 35 km)',
      atmDistanceKm: 35,
      notes: 'Bawa uang tunai fisik yang cukup karena ATM terdekat berada di Samuda.'
    },
    logistics: {
      kelotokCharterPerDay: 200000,
      kelotokFormatted: 'Rp 200.000 (Sewa perahu nelayan susur pulau kubah)',
      simaksiDomestic: 15000,
      simaksiFormatted: 'Rp 15.000 / orang',
      mealsEstPerDay: 60000,
      localGuidePerDay: 100000,
      bestSeason: 'Mei - Oktober saat ombak tenang'
    },
    activities: [
      {
        name: 'Menyaksikan Sunset Laut Jawa',
        desc: 'Menikmati pemandangan matahari tenggelam di cakrawala pesisir selatan Borneo.',
        icon: 'sunny',
        timing: '16.30 - 18.00 WIB'
      },
      {
        name: 'Ziarah Makam Kubah Ujung Pandaran',
        desc: 'Menyeberang ke pulau karang makam Syekh Abu Hamid dengan perahu kayu nelayan.',
        icon: 'mosque',
        timing: 'Pagi & Siang Hari'
      }
    ],
    emergencyContacts: [
      {
        name: 'Polsek Teluk Sampit & Pos Polairud',
        role: 'Keamanan Pesisir',
        channel: 'Telepon / Radio Maritim',
        phone: '+62 531 21110',
        notes: 'Siaga 24 Jam di Pesisir Ujung Pandaran'
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
    id: 'rumah-betang-tumbang-gagu',
    name: 'Rumah Betang Tumbang Gagu',
    tagline: 'Cagar Budaya Rumah Panjang Kayu Ulin Tertua Dayak Ngaju (1870)',
    location: 'Desa Tumbang Gagu, Antang Kalang, Kotawaringin Timur, Kalimantan Tengah',
    district: 'Kotawaringin Timur',
    categories: ['Cagar Budaya', 'Arsitektur Dayak Kuno', 'Etnografi Tradisional'],
    rating: 4.9,
    image: '/images/destinasi/rumah-betang-tumbang-gagu.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=jAgcfKL4vMU',
    gmapsUrl: 'https://maps.google.com/?q=Rumah+Betang+Tumbang+Gagu',
    packSize: '11.5 MB',
    packSizeBytes: 12058624,
    overview: 'Mahakarya arsitektur vernakular suku Dayak Ngaju yang dibangun tahun 1870 di tepi hulu Sungai Kalang. Memiliki panjang 54 meter, lebar 15 meter, ditopang tiang-tiang kayu ulin bulat raksasa setinggi 5 meter untuk melindungi puluhan keluarga dari serangan musuh masa lampau.',
    signalStatus: {
      telkomsel: 'Sangat lemah / Blankspot di pedalaman hulu Sungai Kalang.',
      others: 'Tidak ada sinyal sama sekali.',
      fieldSummary: 'Wilayah terisolir. Travel Pack Offline Manjalan mutlak diperlukan.',
      lastChecked: 'Kemarin (Verifikasi Jagawana)'
    },
    paymentReadiness: {
      qrisAvailable: false,
      cashRequired: true,
      recommendedCash: 400000,
      recommendedCashFormatted: 'Rp 400.000 / orang',
      lastAtmLocation: 'Kota Sampit (Perjalanan darat 5-6 jam)',
      atmDistanceKm: 180,
      notes: 'Hanya melayani pembayaran tunai fisik. Sediakan uang pecahan kecil untuk donasi tetua adat dan logistik makanan warga lokal.'
    },
    logistics: {
      kelotokCharterPerDay: 500000,
      kelotokFormatted: 'Rp 500.000 (Sewa perahu ces menyusuri Sungai Kalang)',
      simaksiDomestic: 20000,
      simaksiFormatted: 'Rp 20.000 / orang (Donasi Adat Betang)',
      mealsEstPerDay: 60000,
      localGuidePerDay: 150000,
      bestSeason: 'Musim kemarau (Juli - September) agar jalur darat tidak berlumpur'
    },
    activities: [
      {
        name: 'Napak Tilas 150 Tahun Betang Ulin',
        desc: 'Melihat tiang ulin raksasa, tangga hejot tradisional, dan ukiran kayu sakral Dayak Ngaju purba.',
        icon: 'home',
        timing: '08.00 - 16.00 WIB'
      },
      {
        name: 'Interaksi Adat & Kisah Tetua',
        desc: 'Mendengarkan kisah perlawanan zaman perang suku dan filosofi hidup bersama dalam satu atap Betang.',
        icon: 'menu_book',
        timing: 'Malam hari bersama tetua kampung'
      }
    ],
    emergencyContacts: [
      {
        name: 'Kepala Adat Dayak Tumbang Gagu',
        role: 'Tokoh Adat & Pemimpin Desa',
        channel: 'Radio Komunikasi Antar Kampung',
        notes: 'Kediaman Rumah Betang Gagu'
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
    tagline: 'Monumen Kapal Membatu, Rumah Betang Tradisional & Ritual Adat Kaharingan',
    location: 'Kaki Bukit Tangkiling, Bukit Batu, Palangka Raya, Kalimantan Tengah',
    district: 'Palangka Raya',
    categories: ['Situs Budaya & Legenda', 'Ritual Adat Dayak', 'Cagar Budaya'],
    rating: 4.8,
    image: '/images/destinasi/batu-banama.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=xpJN5d9AsJM',
    gmapsUrl: 'https://maps.google.com/?q=Situs+Batu+Banama+Tangkiling',
    packSize: '7.2 MB',
    packSizeBytes: 7549747,
    overview: 'Situs batu keramat berbentuk lambung perahu besar yang menurut legenda Dayak merupakan kapal saudagar kaya yang dikutuk membatu. Di sekitarnya berdiri Rumah Betang tradisional dan tempat peribadatan ritual agama Kaharingan.',
    signalStatus: {
      telkomsel: 'Sinyal 4G sangat baik dan stabil.',
      others: 'Semua operator seluler beroperasi dengan lancar.',
      fieldSummary: 'Koneksi seluler lancar di sekitar kompleks situs budaya.',
      lastChecked: 'Hari ini'
    },
    paymentReadiness: {
      qrisAvailable: true,
      cashRequired: true,
      recommendedCash: 100000,
      recommendedCashFormatted: 'Rp 100.000 / orang',
      lastAtmLocation: 'Tangkiling',
      atmDistanceKm: 2,
      notes: 'Tersedia QRIS statis untuk tiket masuk dan pembelian suvenir anyaman rotan lokal.'
    },
    logistics: {
      kelotokCharterPerDay: 0,
      kelotokFormatted: 'Akses Darat',
      simaksiDomestic: 15000,
      simaksiFormatted: 'Rp 15.000 / orang (Retribusi & Donasi Pemeliharaan)',
      mealsEstPerDay: 50000,
      localGuidePerDay: 80000,
      bestSeason: 'Pagi dan sore hari'
    },
    activities: [
      {
        name: 'Melihat Batu Banama Keramat',
        desc: 'Menyaksikan formasi batu granit raksasa berbentuk kapal legenda kutukan saudagar Dayak.',
        icon: 'landscape',
        timing: '08.00 - 17.00 WIB'
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
  },
  {
    id: 'bukit-baka-bukit-raya',
    name: 'Taman Nasional Bukit Baka Bukit Raya',
    tagline: 'Atap Tertinggi Kalimantan Tengah (2.278 mdpl) & Habitat Flora Endemik',
    location: 'Katingan, Kalimantan Tengah & Melawi, Kalimantan Barat',
    district: 'Katingan',
    categories: ['Pendakian Gunung', 'Jungle Trekking', 'Konservasi Pegunungan Schwaner'],
    rating: 4.9,
    image: '/images/destinasi/bukit-baka-bukit-raya.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6nXVaayHQJU',
    gmapsUrl: 'https://maps.google.com/?q=Taman+Nasional+Bukit+Baka+Bukit+Raya',
    packSize: '15.6 MB',
    packSizeBytes: 16357785,
    overview: 'Puncak tertinggi di Pulau Kalimantan wilayah Indonesia (Seven Summits of Indonesia). Jalur pendakian melintasi hutan lumut purba pegunungan Schwaner, jeram sungai liar, dan habitat anggrek raksasa endemik Borneo.',
    signalStatus: {
      telkomsel: 'Blankspot total setelah meninggalkan desa pos terakhir Tumbang Habangoi.',
      others: 'Tidak ada sinyal sama sekali.',
      fieldSummary: 'Koneksi seluler terputus total selama 5-7 hari ekspedisi.',
      lastChecked: 'Verifikasi Jagawana Balai TNBBBR'
    },
    paymentReadiness: {
      qrisAvailable: false,
      cashRequired: true,
      recommendedCash: 750000,
      recommendedCashFormatted: 'Rp 750.000 / orang',
      lastAtmLocation: 'Kasongan (Radius 120 km)',
      atmDistanceKm: 120,
      notes: 'Wajib membawa uang tunai fisik untuk biaya porter lokal, logistik ekspedisi, dan sewa perahu kelotok desa.'
    },
    logistics: {
      kelotokCharterPerDay: 350000,
      kelotokFormatted: 'Rp 350.000 (Sewa perahu ces jeram Sungai Samba)',
      simaksiDomestic: 50000,
      simaksiFormatted: 'Rp 50.000 / orang (Simaksi Pendakian Balai)',
      mealsEstPerDay: 80000,
      localGuidePerDay: 300000,
      bestSeason: 'Juli - Oktober (Musim kemarau jalur pendakian)'
    },
    activities: [
      {
        name: 'Ekspedisi Puncak Kaba 2.278 Mdpl',
        desc: 'Mendaki atap tertinggi pulau Kalimantan jalur hutan lumut purba pegunungan Schwaner.',
        icon: 'terrain',
        timing: 'Ekspedisi 5 Hari 4 Malam'
      },
      {
        name: 'Pengamatan Flora Endemik Borneo',
        desc: 'Melihat Rafflesia borneensis dan anggrek hutan langka pegunungan tropis.',
        icon: 'yard',
        timing: 'Sepanjang jalur pendakian'
      }
    ],
    emergencyContacts: [
      {
        name: 'Balai TNBBBR SPTN Wilayah II Kasongan',
        role: 'Pusat Informasi & Perizinan',
        channel: 'Radio SSB & Satelit',
        phone: '+62 536 3228990',
        notes: 'Kantor Balai Kasongan'
      },
      {
        name: 'Pos Porter Adat Tumbang Habangoi',
        role: 'Regu Penyelamat Lokal',
        channel: 'Radio Handy Talkie (HT 142.100 MHz)',
        notes: 'Pos Awal Pendakian'
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
    tagline: 'Dermaga Kayu Ulin Panjang, Sentra Seafood Nelayan & Pesisir Bugam Raya',
    location: 'Kecamatan Kumai, Kotawaringin Barat, Kalimantan Tengah',
    district: 'Kotawaringin Barat',
    categories: ['Wisata Pesisir', 'Dermaga Kayu Ulin', 'Kuliner Seafood Nelayan'],
    rating: 4.6,
    image: '/images/destinasi/pantai-kubu.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PF6AUsv9u4c',
    gmapsUrl: 'https://maps.google.com/?q=Pantai+Kubu+Kumai',
    packSize: '8.5 MB',
    packSizeBytes: 8912896,
    overview: 'Kawasan wisata bahari terpadu di pedesaan pesisir Bugam Raya menghadap Laut Jawa dengan dermaga kayu ulin panjang menjulur ke tengah laut, pusat pendaratan ikan segar nelayan, dan kelapa muda pesisir.',
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
        name: 'Pos Pengamat Pantai & Polairud Kubu',
        role: 'Keselamatan Pantai',
        channel: 'VHF Saluran 16',
        phone: '+62 532 61201',
        notes: 'Pintu Gerbang Pantai Kubu'
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
    ownerName: 'Mama Yanti',
    category: 'kuliner',
    categoryLabel: 'Kuliner Khas',
    description: 'Menyajikan olahan autentik Dayak dan pesisir Kumai: Baung Bakar Bambu, Juhu Umbut Sawit, Ikan Lais Goreng Krispi, dan sambal serai limau khas Borneo.',
    priceRange: 'Rp 25.000 - Rp 65.000',
    locationDesc: 'Jl. Bendahara, Kawasan Pelabuhan Kumai',
    distanceDesc: '350 meter dari Dermaga Kelotok Kumai',
    image: '/images/umkm/dapur-dayak-kumai.jpg',
    signalStatus: 'Sinyal 4G Stabil',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Dapur Dayak Kumai Sejahtera',
    hasTransfer: true,
    bankName: 'Bank Mandiri / Bank Kalteng',
    bankNumber: '138-00-1849201-9',
    needsCash: true,
    whatsapp: '+6281255678901',
    offlineNotes: 'Pilihan pas santap siang sebelum boarding ke perahu Kelotok.',
    featured: true,
    gmapsUrl: 'https://maps.google.com/?q=Dapur+Kumai+Kotawaringin+Barat'
  },
  {
    id: 'umkm-2',
    destinationId: 'tanjung-puting',
    name: 'Kelotok Wisata Berkah Sungai (Pak Joko)',
    ownerName: 'Pak Joko Susanto',
    category: 'kelotok',
    categoryLabel: 'Penginapan & Kelotok',
    description: 'Perahu kelotok kayu ulin 2 tingkat resmi Balai TNTP include nahkoda bersertifikat, koki pribadi kapal, kasur busa kelambu, toilet duduk, dan solar cell ramah lingkungan.',
    priceRange: 'Rp 1.800.000 - Rp 2.500.000 / trip',
    locationDesc: 'Dermaga Wisata Panglima Utar, Kumai',
    distanceDesc: 'Titik kumpul keberangkatan TNTP',
    image: '/images/umkm/kelotok-berkah-sungai.jpg',
    signalStatus: 'Sinyal Hilang saat Berlayar',
    signalOk: false,
    hasQris: true,
    qrisMerchantName: 'Berkah Kelotok Safari TNTP',
    hasTransfer: true,
    bankName: 'Bank BRI / BNI',
    bankNumber: '0234-01-019284-53-1',
    needsCash: true,
    whatsapp: '+6281349887722',
    offlineNotes: 'Lakukan pelunasan atau transfer sebelum kapal bertolak keluar sinyal Kumai.',
    featured: true,
    gmapsUrl: 'https://maps.google.com/?q=Pelabuhan+Panglima+Utar+Kumai'
  },
  {
    id: 'umkm-3',
    destinationId: 'taman-nasional-sebangau',
    name: 'Warung Terapung Danau Sebangau (Ibu Asnah)',
    ownerName: 'Ibu Asnah',
    category: 'kuliner',
    categoryLabel: 'Kuliner Khas',
    description: 'Warung apung khas tepian rawa Kereng Bangkirai menyajikan Soto Banjar telur bebek, ikan gabus bakar madu, jagung rebus, dan aneka kopi hangat sebelum berangkat susur air hitam.',
    priceRange: 'Rp 15.000 - Rp 45.000',
    locationDesc: 'Tepian Dermaga Wisata Air Hitam Kereng Bangkirai, Palangka Raya',
    distanceDesc: 'Tepat di sisi dermaga perahu getek',
    image: '/images/umkm/warung-terapung-sebangau.jpg',
    signalStatus: 'Sinyal 4G Kuat',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Warung Terapung Asnah Sebangau',
    hasTransfer: true,
    bankName: 'Bank BCA / Bank Kalteng',
    bankNumber: '0892-348-119',
    needsCash: true,
    whatsapp: '+6282153449900',
    offlineNotes: 'Di hulu Sungai Koran tidak ada sinyal. Belilah air minum dan camilan di sini sebelum berlayar.',
    featured: true,
    gmapsUrl: 'https://maps.google.com/?q=Dermaga+Kereng+Bangkirai+Sebangau'
  },
  {
    id: 'umkm-4',
    destinationId: 'danau-tahai',
    name: 'Pusat Kerajinan Getah Nyatu Kahayan',
    ownerName: 'Bapak Cornelis',
    category: 'souvenir',
    categoryLabel: 'Oleh-oleh & Kerajinan',
    description: 'Kerajinan langka khas Kalimantan Tengah yang terbuat dari rebusan getah pohon nyatu liar, dibentuk menjadi perahu naga tiwah, miniatur prahu baling, gantungan kunci, dan ornamen Dayak.',
    priceRange: 'Rp 20.000 - Rp 350.000',
    locationDesc: 'Kawasan Pahandut Seberang & Titian Tahai, Palangka Raya',
    distanceDesc: 'Dekat akses Danau Tahai & Jembatan Kahayan',
    image: '/images/umkm/kerajinan-getah-nyatu.jpg',
    signalStatus: 'Sinyal 4G Stabil',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Kerajinan Getah Nyatu Kahayan',
    hasTransfer: true,
    bankName: 'Bank Kalteng / Mandiri',
    bankNumber: '100-02-04829-1',
    needsCash: false,
    whatsapp: '+6285249001234',
    offlineNotes: 'Bisa custom ukiran nama di perahu getah nyatu dalam 15 menit.',
    featured: true,
    gmapsUrl: 'https://maps.google.com/?q=Kerajinan+Getah+Nyatu+Palangka+Raya'
  },
  {
    id: 'umkm-5',
    destinationId: 'danau-tahai',
    name: 'Kuliner Dayak Juhu Umbut Rotan',
    ownerName: 'Mama Kristin',
    category: 'kuliner',
    categoryLabel: 'Kuliner Khas',
    description: 'Spesialis sayur tradisional Dayak: Juhu Singkah / Umbut Rotan muda masak ikan nila sungai dengan sensasi rasa manis-pahit yang segar kaya rempah, sambal kandas serai, dan sayur kelakai merah.',
    priceRange: 'Rp 20.000 - Rp 50.000',
    locationDesc: 'Jl. Tjilik Riwut Km. 29, Dekat Akses Ekowisata Tahai & BOSF',
    distanceDesc: '400 meter sebelum gerbang Danau Tahai',
    image: '/images/umkm/kuliner-juhu-umbut-rotan.jpg',
    signalStatus: 'Sinyal 4G Lancar',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Dapur Nyaru Juhu Umbut Rotan',
    hasTransfer: true,
    bankName: 'Bank BRI',
    bankNumber: '3421-01-002938-50-8',
    needsCash: true,
    whatsapp: '+6282255443321',
    offlineNotes: 'Menu juhu umbut rotan segar selalu habis setelah jam 14.00 siang.',
    featured: true,
    gmapsUrl: 'https://maps.google.com/?q=Danau+Tahai+Tumbang+Tahai'
  },
  {
    id: 'umkm-6',
    destinationId: 'batu-banama',
    name: 'Wadai Kiping Dayak Maanyan',
    ownerName: 'Ibu Natalia',
    category: 'kuliner',
    categoryLabel: 'Kuliner Khas',
    description: 'Kue tradisional khas suku Dayak Maanyan berbahan tepung ketan kenyal dalam kuah santan gula aren wangi pandan hutan, kudapan wajib saat pesta panen dan upacara adat.',
    priceRange: 'Rp 10.000 - Rp 25.000',
    locationDesc: 'Sentra Kuliner Adat, Kompleks Budaya Tangkiling & Betang',
    distanceDesc: 'Di samping pintu masuk Situs Batu Banama',
    image: '/images/umkm/wadai-kiping-maanyan.jpg',
    signalStatus: 'Sinyal 4G Stabil',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Wadai Kiping Warukin',
    hasTransfer: false,
    needsCash: true,
    whatsapp: '+6281351223344',
    offlineNotes: 'Siapkan pecahan uang kecil Rp 5.000 - Rp 20.000 untuk transaksi cepat.',
    featured: false,
    gmapsUrl: 'https://maps.google.com/?q=Situs+Batu+Banama+Tangkiling'
  },
  {
    id: 'umkm-7',
    destinationId: 'bukit-tangkiling',
    name: 'Kerajinan Anyaman Rotan Dayak Kandui',
    ownerName: 'Ibu Linawati',
    category: 'souvenir',
    categoryLabel: 'Oleh-oleh & Kerajinan',
    description: 'Pusat perajin tas anjat Dayak, tikar rotan luntik motif flora, dompet rotan pewarna alami akar tanaman hutan, dan keranjang bambu tahan puluhan tahun.',
    priceRange: 'Rp 35.000 - Rp 280.000',
    locationDesc: 'Kios Kerajinan Tangkiling, Bukit Batu',
    distanceDesc: 'Area parkir wisata Bukit Tangkiling',
    image: '/images/umkm/anyaman-rotan-kandui.jpg',
    signalStatus: 'Sinyal 4G Stabil',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Anyaman Rotan Kandui Dayak',
    hasTransfer: true,
    bankName: 'Bank Mandiri',
    bankNumber: '159-00-0928371-2',
    needsCash: true,
    whatsapp: '+6281250998811',
    offlineNotes: 'Bisa beli offline saat sinyal ponsel minim dengan transfer via m-Banking sebelum naik bukit.',
    featured: true,
    gmapsUrl: 'https://maps.google.com/?q=Taman+Wisata+Alam+Bukit+Tangkiling'
  },
  {
    id: 'umkm-8',
    destinationId: 'batu-banama',
    name: 'Kerajinan Anyaman Rotan Dayak Taboyan',
    ownerName: 'Mama Yurni',
    category: 'souvenir',
    categoryLabel: 'Oleh-oleh & Kerajinan',
    description: 'Anyaman rotan otentik karya pengrajin Dayak Taboyan pedalaman Barito Utara. Menggunakan serat rotan pilihan berdiameter halus dengan motif tribal geometris kuno yang sarat makna leluhur.',
    priceRange: 'Rp 50.000 - Rp 450.000',
    locationDesc: 'Galeri Budaya Betang Hapakat, Palangka Raya',
    distanceDesc: 'Satu kompleks dengan Situs Betang Dayak',
    image: '/images/umkm/anyaman-rotan-taboyan.jpg',
    signalStatus: 'Sinyal 4G Cepat',
    signalOk: true,
    hasQris: true,
    qrisMerchantName: 'Galeri Anyaman Taboyan',
    hasTransfer: true,
    bankName: 'Bank BRI',
    bankNumber: '0129-01-084729-50-3',
    needsCash: false,
    whatsapp: '+6282155887766',
    offlineNotes: 'Menerima pengiriman oleh-oleh ke seluruh Indonesia via ekspedisi.',
    featured: true,
    gmapsUrl: 'https://maps.google.com/?q=Betang+Hapakat+Palangka+Raya'
  }
];
