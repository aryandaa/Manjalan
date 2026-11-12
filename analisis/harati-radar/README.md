# ANALISIS KOMPARATIF TUNGGAL: HARATI RADAR VS MANJALAN
## Mengapa Harati Radar Masuk Final Tambun Bungai Ideathon 2026 (Borneo DECAFEST - Bank Indonesia Kalteng)?

> **Dokumen Riset & Evaluasi Strategis**  
> **Target Kompetisi:** Tambun Bungai Ideathon 2026 — Borneo DECAFEST (Bank Indonesia Perwakilan Kalimantan Tengah)  
> **Karya Finalis Pembanding:** **Harati Radar** (*Hub ANPR Realtime Audit & Tagihan Inklusif*) — Tim Humasoft  
> **Karya Kami:** **MANJALAN** (*Travel Readiness & Ecotourism Companion Platform*) — Tim Politeknik Negeri Banjarmasin  
> **Sumber Analisis:** Video Instagram Submission ([@aby_fairuz Reel](https://www.instagram.com/reel/DffPOohpamj/)), Live Prototype Demo ([haratiradar.humasoftpedia.id](https://haratiradar.humasoftpedia.id)), Proposal & Kode Prototipe Manjalan.

---

## 1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)

Dalam penjurian **Tambun Bungai Ideathon 2026** yang diselenggarakan oleh **Bank Indonesia Perwakilan Kalimantan Tengah (BI Kalteng)** bekerjasama dengan Pemprov Kalteng melalui gerakan **Borneo DECAFEST (Digital Economy and Creative Festival)**, aplikasi **Harati Radar** berhasil lolos menjadi finalis, mengungguli ratusan ide lainnya termasuk konsep **MANJALAN**.

Berdasarkan investigasi mendalam terhadap prototipe live, video presentasi reel, dan logika bisnis kedua produk, keunggulan mutlak Harati Radar bukan terletak pada kompleksitas UI/UX semata, melainkan pada **keselarasan strategis yang sempurna antara masalah yang mereka angkat dengan tupoksi inti penyelenggara (Bank Indonesia dan Pemda)**.

| Dimensi Penilaian | Harati Radar (Finalis) | MANJALAN (Ide Kami) | Faktor Pembeda Utama |
| :--- | :--- | :--- | :--- |
| **Subtema Lomba** | Digitalisasi Layanan Pemda | Digitalisasi Transportasi & Wisata | Harati menyentuh jantung anggaran (PAD), Manjalan menyentuh industri pariwisata. |
| **Kaitan dengan Bank Indonesia** | **Sangat Kuat (Direct)**: Terkait langsung dengan indeks **ETPD (Elektronifikasi Transaksi Pemda)** & QRIS Pemda. | **Sekunder (Indirect)**: Mendorong inklusi keuangan UMKM lokal, namun masih mengadvokasi uang tunai untuk area blankspot. | Harati adalah "mesin penagih digital" untuk kas daerah; Manjalan adalah "pemandu kesiapan perjalanan". |
| **Kebutuhan Modal & Infrastruktur** | **Nol Pengadaan (Zero Capex)**: Memanfaatkan kamera ETLE Polda & Dishub yang sudah terpasang di jalan. | **Tinggi (High Effort)**: Membutuhkan pendataan manual nahkoda kelotok, warung apung, dan jaringan radio VHF. | Harati dapat diterapkan besok pagi secara regulasi; Manjalan butuh operasional komunitas lapangan yang masif. |
| **Kuantifikasi Dampak Finansial** | **Eksplisit & Terukur**: "Potensi PAD Rp 2,14 Miliar terselamatkan dari 1.284 plat tertunggak". | **Abstrak**: "Membantu wisatawan menghitung budget dan mempermudah UMKM". | Dewan juri fiskal/perbankan lebih mudah memvalidasi angka PAD rupiah pasti. |
| **Mekanisme Solusi** | Closed-loop otomatis (Kamera ➔ Samsat ➔ WA ➔ Bayar e-Pahari / Huma Betang). | Panduan multi-fitur (Kalkulator budget, IndexedDB offline pack, direktori UMKM). | Harati menawarkan satu solusi spesifik dengan eksekusi tajam tanpa friksi. |
| **Profil Tim** | Akademisi Senior (Dosen STMIK Palangka Raya & UIN Palangka Raya). | Mahasiswa (Politeknik Negeri Banjarmasin). | Kredibilitas riset, pemahaman regulasi daerah, dan relasi institusional di Palangka Raya. |

---

## 2. PROFIL MENDALAM KARYA FINALIS: HARATI RADAR

### 2.1 Identitas & Tim Pengembang
- **Nama Produk:** **Harati Radar** (singkatan dari *Hub ANPR Realtime Audit & Tagihan Inklusif*).
- **Filosofi Nama:** *"Harati"* berarti **"Pintar / Cerdas"** dalam bahasa Dayak Ngaju.
- **Tagline:** *"Plat Melintas. Tunggakan Tertagih."*
- **Pengembang:** Tim Humasoft
  - **Ir. Abdul Hadi, S.T., M.Kom.** (Ketua Tim — STMIK Palangka Raya)
  - **Ir. Heri Setiawan, M.Kom.** (Anggota — UIN Palangka Raya)
- **Tautan Live Prototype:** [haratiradar.humasoftpedia.id](https://haratiradar.humasoftpedia.id)
- **Video Instagram:** [Instagram Reel @aby_fairuz](https://www.instagram.com/reel/DffPOohpamj/)

### 2.2 Problem Statement yang Diangkat
1. **Kebocoran Pendapatan Asli Daerah (PAD):** Pajak Kendaraan Bermotor (PKB) dan Opsen PKB adalah penopang utama kas daerah Kalteng, namun tingkat tunggakan sangat tinggi karena penagihan manual lambat dan tidak efektif.
2. **Kamera ETLE Mubazir untuk Fiskal:** Kamera tilang elektronik (ETLE/ANPR) yang dipasang Polda dan Dishub di persimpangan jalan utama Kota Palangka Raya (Bundaran Besar, Jl. Tjilik Riwut, dsb.) saat ini **hanya digunakan untuk menilang pelanggaran lalu lintas**, bukan untuk memonitor kepatuhan pajak kendaraan.
3. **Surat Tilang/Peringatan Konvensional Sangat Mahal & Diabaikan:** Pengiriman surat fisik via kurir/pos memakan biaya besar per lembar dan sering tidak sampai atau diabaikan oleh pemilik kendaraan.
4. **Aplikasi Resmi Pemda Kurang Terpakai:** Pemprov Kalteng sudah membuat aplikasi *Samsat Huma Betang* dan *E-Pahari*, tetapi tingkat unduhan dan pengguna aktifnya masih rendah karena warga pasif dan lupa jadwal jatuh tempo.

### 2.3 Solusi & Alur Kerja Teknis (Closed-Loop Mechanism)
Harati Radar merancang jembatan integrasi 4 langkah yang sangat presisi:
1. **Deteksi Otomatis (ANPR/ETLE):** Kamera membaca plat nomor kendaraan (misal: `KH 1234 AB`) secara real-time di jalan raya dengan model OCR ber-confidence tinggi (>90%).
2. **Matching Realtime Database Samsat:** Plat langsung dicocokkan dengan database Bapenda/Samsat untuk mendeteksi status PKB (Lunas, Akan Jatuh Tempo H-90/H-30/H-10, atau Tertunggak + Nilai Denda & Opsen).
3. **Nudge Interaktif melalui WhatsApp (HumaWA):** Sistem memicu pengiriman pesan WhatsApp resmi otomatis dengan tautan bayar instan, menghindari jam malam (*quiet hours* 21.00 - 07.00 WIB).
4. **Penyelesaian Digital (Instant Settlement):** Tautan langsung mengarah ke kanal pembayaran digital resmi daerah: aplikasi **Samsat Huma Betang** atau **E-Pahari** dengan opsi pembayaran QRIS Bank Kalteng.

```
[Kamera ETLE / ANPR di Jalan] 
       │ (Scan Plat Nomor Realtime)
       ▼
[Harati Radar Engine] ──(Kueri API)──► [Database Samsat / Bapenda]
       │ (Deteksi Status Tunggakan)
       ▼
[Notifikasi WhatsApp Otomatis (HumaWA)]
       │ (Ajakan Bayar + Tautan Langsung)
       ▼
[Wajib Pajak Bayar via Samsat Huma Betang / E-Pahari / QRIS]
       │ (Settlement Kas Daerah)
       ▼
[PAD Kalteng Meningkat & Tercatat di Dashboard BI ETPD]
```

---

## 3. 6 FAKTOR PENENTU MENGAPA HARATI RADAR LOLOS KE FINAL (THE WINNING FORMULA)

### Faktor 1: Keselarasan Mutlak dengan Indikator Kinerja Bank Indonesia (ETPD & PAD)
Penyelenggara kompetisi ini adalah **Bank Indonesia Kantor Perwakilan Kalimantan Tengah**. Tupoksi utama Bank Indonesia dalam konteks daerah terangkum dalam agenda **Tim Percepatan dan Perluasan Digitalisasi Daerah (TP2DD)** yang mengukur indeks **Elektronifikasi Transaksi Pemerintah Daerah (ETPD)**.
- **Kriteria ETPD:** Seberapa banyak pendapatan pajak daerah (PBB, PKB, retribusi) yang dialihkan dari sistem manual/tunai ke kanal digital (QRIS, VA, Mobile Banking).
- Harati Radar secara eksplisit membedah:
  - Nilai potensi penagihan PKB: Rp 18,4 Miliar.
  - Nilai tunggakan terdeteksi: Rp 3,12 Miliar.
  - Opsen PKB Kabupaten/Kota: Rp 780 Juta.
- **Kesimpulan Juri:** Memilih Harati Radar langsung menjawab sasaran kerja formal Kepala Perwakilan Bank Indonesia Kalteng dan Kepala Bapenda Kalteng.

### Faktor 2: Konsep "Piggybacking" Infrastruktur yang Ada (Zero Capex)
Dalam kompetisi ide inovasi pemerintah, usulan yang meminta anggaran pengadaan perangkat keras baru bernilai puluhan miliar hampir selalu dieliminasi karena sulit dieksekusi.
- Harati Radar tidak meminta Pemda memasang ratusan kamera baru.
- Mereka dengan sangat cerdas mengatakan: *"Kamera ETLE di Bundaran Besar dan Tjilik Riwut sudah ada dan dibeli oleh negara. Kami hanya memasang software integrasi data antara CCTV polisi dengan database Samsat!"*
- Ini membuat solusi terlihat **sangat siap diimplementasikan (high feasibility, low barrier to adoption)**.

### Faktor 3: Menghubungkan Ekosistem Pemerintah yang Sudah Terlanjur Dibuat
Pemerintah daerah sering frustrasi karena sudah menghabiskan anggaran miliaran untuk membuat aplikasi mobile (seperti *Samsat Huma Betang* dan *E-Pahari*), namun aplikasinya sepi pengunjung di Google Play Store.
- Harati Radar tidak membongkar atau membuat aplikasi tandingan.
- Harati Radar memposisikan diri sebagai **"Top of the Funnel Generator"** yang memaksa dan mengingatkan warga melalui WhatsApp agar membuka aplikasi milik pemerintah tersebut.
- Solusi yang merangkul dan menaikkan pamor aset pemda yang sudah ada selalu mendapat nilai politis tertinggi dari dewan juri birokrasi.

### Faktor 4: Kualitas Demonstrasi Prototipe yang Sangat Matang (Live Prototype Demo)
Harati Radar tidak hanya mengumpulkan slide PDF atau Figma statis, melainkan meluncurkan website prototipe fungsional publik di domain khusus (`haratiradar.humasoftpedia.id`):
- **Role-based Authentication:** Juri bisa login sebagai Admin Bapenda, Operator Radar, maupun Verifikator.
- **Simulasi Event-Driven Nyata:** Terdapat log audit, masking keamanan privasi plat (`KH ** *AB`), tingkat kepercayaan OCR (*confidence score*), hingga penanganan jam malam (*quiet hours skipped*).
- **Conversion Tracking:** Melacak rasio WA Terkirim (412) ➔ Dibaca (356) ➔ CTA Dibuka (168) ➔ Lunas (97 / Rp 412 Juta).
- Dewan juri yang menguji link tersebut langsung merasa bahwa proyek ini tinggal 1 langkah menuju fase uji coba lapangan (*pilot project*).

### Faktor 5: Kredibilitas dan Kematangan Profil Tim Akademisi
Ketua tim Harati Radar adalah akademisi ilmu komputer dari STMIK Palangka Raya dan UIN Palangka Raya yang memahami medan tata kelola pemerintahan lokal Kalimantan Tengah. Cara mereka menyusun istilah regulasi (misal: "Opsen PKB sesuai UU HKPD No. 1 Tahun 2022") membuktikan penguasaan domain hukum dan fiskal yang sangat kuat di hadapan dewan juri.

### Faktor 6: Personalisasi Budaya Lokal (Cultural Identity Branding)
Pemilihan nama **"Harati"** (bahasa Dayak Ngaju untuk kecerdasan/kebijaksanaan) yang dipadukan dengan istilah modern **"Radar"** menciptakan resonansi emosional yang tinggi bagi panelis juri lokal Kalimantan Tengah, selaras dengan semangat festival daerah **Tambun Bungai** dan **Huma Betang**.

---

## 4. BEDAH KRITIS: MENGAPA "MANJALAN" TIDAK MASUK FINAL? (OBJECTIVE GAP ANALYSIS)

Meskipun **MANJALAN** memiliki keunggulan teknis yang luar biasa di sisi arsitektur PWA, caching IndexedDB offline, dan desain antarmuka modern yang memukau, terdapat 4 kesenjangan mendasar (*strategic gaps*) yang membuatnya kalah bersaing dalam konteks spesifik kompetisi ini:

### 1. Paradoks "Fitur Offline & Uang Tunai" di Mata Dewan Juri Bank Indonesia
- **Visi MANJALAN:** Mengakomodasi keterbatasan pedalaman dengan menghitung kebutuhan penarikan uang tunai (*emergency cash*) sebelum naik perahu kelotok di area blankspot tanpa sinyal.
- **Kacamata Dewan Juri BI:** Bank Indonesia memiliki agenda nasional **"Gerakan Nasional Non Tunai (GNNT)"** dan ekspansi **QRIS**. Ketika juri melihat fitur kalkulator kami menekankan *"Tarik uang tunai Rp 1.500.000 untuk nahkoda di muara karena tidak ada sinyal"*, meskipun ini fakta riil di lapangan, juri Bank Indonesia secara psikologis merasa ide ini **tidak sejalan dengan agenda ekspansi elektronifikasi transaksi**.
- Juri lebih tergiur dengan ide yang memaksa orang membayar lewat QRIS atau transfer digital seperti yang diajukan Harati Radar.

### 2. Kesenjangan Nilai Moneter: Potensi PAD Miliaran vs Dampak UMKM Tersebar
- Harati Radar menawarkan: **Rp 2,14 Miliar PAD** yang bisa langsung ditarik dari wajib pajak kendaraan bermotor yang melintasi jalan protokol Kota Palangka Raya.
- MANJALAN menawarkan: Efisiensi biaya liburan wisatawan dan promosi UMKM lokal (warung makan, sewa kapal, penginapan kayu ulin).
- Bagi juri perbankan dan fiskal daerah, dampak ekonomi pariwisata membutuhkan rantai distribusi panjang (*trickle-down effect*) yang sulit diverifikasi dalam jangka pendek, sedangkan penagihan PKB langsung masuk ke rekening kas umum daerah (RKUD) hari itu juga.

### 3. Tingkat Friksi Operasional Lapangan (Operational Complexity)
- **Harati Radar:** Hanya perlu mengintegrasikan server kamera ETLE Polda dan database Samsat. Pengguna akhir (pemilik mobil) tidak perlu mengunduh aplikasi apapun; mereka cukup menerima pesan WhatsApp. Tingkat friksinya hampir nol (*zero friction*).
- **MANJALAN:** Mengharuskan wisatawan mengunduh Travel Pack sebelum berangkat, mengharuskan nahkoda kelotok mendaftar sebagai mitra, dan mengandalkan frekuensi radio maritim VHF. Ketergantungan operasional pada banyak pihak non-digital di pedalaman dinilai oleh juri sebagai risiko implementasi yang sangat berat.

### 4. Format Kemasan Pitching Video Instagram
- Harati Radar menampilkan hook yang sangat tajam bagi masyarakat lokal: kamera CCTV jalan raya Kota Palangka Raya merekam plat nomor, mendeteksi tunggakan, dan langsung mengirim pesan penagihan.
- MANJALAN lebih memposisikan diri sebagai platform perencanaan travel yang luas (budget, destinasi, UMKM, offline pack), sehingga dalam durasi video pendek reel 60-90 detik, pesan inti inovasi teknologi kami terbagi-bagi dan kurang menonjolkan satu *killer feature* yang paling revolusioner.

---

## 5. MATRIKS KOMPARASI SKOR EVALUASI (BENCHMARK SCORECARD)

Berikut adalah estimasi komparasi penilaian objektif dewan juri berdasarkan rubrik resmi kompetisi Ideathon Bank Indonesia:

```
[Bobot Penilaian Ideathon Bank Indonesia Kalteng]
─────────────────────────────────────────────────────────────────────────────
Kriteria Penilaian                  Bobot   Harati Radar     MANJALAN
─────────────────────────────────────────────────────────────────────────────
1. Relevansi Tema & Visi BI         25%         95              74
   (ETPD, PAD, Digital Payment)
2. Kesiapan Solusi & Kelayakan      25%         92              82
   (Feasibility & Zero Capex)
3. Keaslian & Inovasi Teknologi      20%         88              89
   (Computer Vision vs Offline PWA)
4. Dampak Sosial-Ekonomi Konkret    20%         94              78
   (Kuantifikasi Rupiah Terukur)
5. Kualitas Presentasi & Prototype   10%         91              86
─────────────────────────────────────────────────────────────────────────────
TOTAL SKOR ESTIMASI                 100%       92.35           81.30
STATUS SELEKSI AKHIR                          [LOLOS FINAL]    [BELUM LOLOS]
─────────────────────────────────────────────────────────────────────────────
```

---

## 6. PELAJARAN PENTING & REKOMENDASI PENGEMBANGAN MANJALAN KE DEPAN

Kekalahan ini bukanlah kegagalan teknis, melainkan **masalah sudut pandang penyesuaian pasar (Product-Market Fit & Pitch-Judges Fit)**. Jika tim MANJALAN ingin kembali berkompetisi dalam ajang Bank Indonesia atau hackathon pemerintah lainnya, berikut langkah reposisi yang wajib dilakukan:

### 1. Ubah Framing: Dari "Platform Liburan" Menjadi "Sistem Retribusi Wisata Digital Kalteng"
- Jangan hanya menyebut Manjalan sebagai panduan wisata offline.
- Tampilkan Manjalan sebagai: **"Platform Elektronifikasi E-Retribusi Kawasan Konservasi & Destinasi Wisata Terpencil Kalteng"**.
- Perlihatkan bahwa saat wisatawan memesan paket di Manjalan, dana retribusi tiket masuk taman nasional (TN Tanjung Puting / Sebangau) otomatis terserap via QRIS Bank Kalteng, **sehingga PAD sektor pariwisata Kalteng meningkat dan tidak bocor melalui pungutan liar manual**.

### 2. Selesaikan Paradoks Offline dengan Konsep "Store-and-Forward QRIS Settlement"
- Alih-alih menyuruh wisatawan membawa uang tunai tebal, tawarkan solusi: **"Offline Vouchers / QRIS Token Offline"**.
- Wisatawan membayar deposit digital saat di kota (misal Rp 1.000.000 via QRIS). Mereka membawa QR-token offline di ponsel.
- Di perahu kelotok pedalaman, nahkoda memindai QR-token tersebut secara offline. Begitu nahkoda kembali ke pelabuhan dermaga muara yang ada sinyal, uang otomatis cair ke dompet digital / rekening bank nahkoda. Ini adalah inovasi *fintech offline* yang pasti akan membuat dewan juri Bank Indonesia terpukau!

### 3. Tampilkan Angka Kuantitatif Finansial yang Berani
- Selalu cantumkan metrik kalkulasi makro di slide pertama pitch deck, contoh:
  > *"Sektor ekowisata Kalteng mencatat 25.000 kunjungan per tahun dengan perputaran dana perahu Rp 45 Miliar. 85% dari transaksi tersebut menguap tanpa retribusi resmi karena transaksi tunai tanpa pencatatan. Manjalan siap mendigitalisasi potensi perputaran ekonomi Rp 38 Miliar tersebut ke dalam sistem keuangan perbankan resmi Kalimantan Tengah."*

### 4. Sederhanakan Video Pitch Reel Menjadi 1 Alur Masalah-Solusi
- Struktur video kompetisi 60 detik yang terbukti juara:
  - **Detik 0-10:** Masalah krusial daerah yang mencolok (misal: antrean retribusi robek kertas / uang tunai basah di perahu kelotok).
  - **Detik 10-30:** Solusi teknologi kami (tunjukkan demo tangan memencet aplikasi).
  - **Detik 30-50:** Validasi dampak angka (berapa rupiah terselamatkan, berapa UMKM terbantu).
  - **Detik 50-60:** Ajakan aksi & tautan prototipe live yang bisa diklik.

---

## 7. KESIMPULAN

**Harati Radar** berhasil masuk final karena mereka menembak tepat di titik nyeri terbesar pemerintah daerah dan Bank Indonesia: **mengejar kebocoran pajak daerah menggunakan kamera yang sudah ada**. Solusi mereka sangat pragmatis, politis, dan mudah dihitung rupiahnya.

Sementara itu, **MANJALAN** adalah produk yang indah dan humanis untuk para wisatawan serta UMKM rimba, namun kalah di aspek keterkaitan strategis dengan agenda moneter formal dewan juri. Dengan mengadopsi ketajaman framing kuantitatif dan integrasi retribusi digital, MANJALAN memiliki modal dasar yang jauh lebih besar untuk berkembang menjadi produk rintisan ekowisata nomor 1 di pulau Kalimantan.
