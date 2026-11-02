# MANJALAN — Travel Readiness Platform
> *"Rencanakan Saat Online, Tetap Siap Saat Offline."*

Platform kesiapan perjalanan wisata pertama untuk Kalimantan Tengah yang menjembatani perencanaan di kota dengan eksekusi lapangan di pedalaman tanpa sinyal internet.

---

## 🚀 Tech Stack
- **Frontend & App Shell:** [Next.js](https://nextjs.org) (App Router, React 18, TypeScript)
- **Styling & Design System:** [Tailwind CSS](https://tailwindcss.com) (Equatorial Expedition Utility System, font Plus Jakarta Sans & Google Material Symbols)
- **Local Persistence & Offline Cache:** [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [`idb`](https://github.com/jakearchibald/idb)
- **Cloud Database & Sync:** [Supabase](https://supabase.com) (PostgreSQL, Row Level Security, Edge Functions)

---

## 📱 Fitur Utama (Sesuai MANJALAN.md & UI Prototypes)

1. **Beranda & Readiness Hub (`/`)**
   - Header dinamis dengan status "Siap Offline" & Live Indicator ("Tilik Borneo").
   - Banner kesiapan offline lapangan (jumlah Travel Pack, progress bar, pemakaian MB di IndexedDB).
   - 4 Modul Aksi Cepat: Hitung Budget, Travel Pack Offline, Direktori UMKM, Portal Mitra.
   - Destinasi pilihan ekowisata Kalimantan Tengah (TN Tanjung Puting, TN Sebangau, Bukit Tangkiling).
   - Indikator metode pembayaran instan (QRIS, Tunai, Transfer Bank).

2. **Detail Destinasi & Unduh Travel Pack (`/destinasi/[id]`)**
   - Hero lanskap dengan badge GPS Siap Offline & kategori konservasi.
   - **Tombol Unduh Travel Pack**: Menyimpan data rute, panduan, nomor radio darurat, dan UMKM ke dalam **IndexedDB** secara instan.
   - 4 Tab Informasi: Ringkasan & Jalur, Kesiapan Pembayaran, Aktivitas Utama, UMKM Sekitar.
   - Peringatan kondisi sinyal seluler (Telkomsel Edge vs provider lain blankspot) & jarak ATM terdekat.

3. **Smart Budget Planner (`/budget`)**
   - Kalkulator biaya perjalanan interaktif berbasis tarif lapangan Kalimantan Tengah.
   - Pilihan titik keberangkatan (Palangka Raya, Pangkalan Bun, Jakarta, Surabaya, Banjarmasin).
   - Stepper jumlah peserta dan durasi ekspedisi.
   - Pilihan gaya perjalanan: Hemat, Standar, Eksklusif.
   - Rincian pos biaya: Sewa Kelotok, Tiket Masuk Balai TNTP (Simaksi), Logistik & Konsumsi, Pemandu HPI/Kru Dayak, dan Dana Darurat Tunai.
   - Simpan hasil kalkulasi ke IndexedDB dan fitur bagikan estimasi ke rombongan.

4. **Direktori UMKM & Kesiapan Pembayaran (`/umkm`)**
   - Direktori terverifikasi untuk usaha lokal: Perahu Kelotok, Kuliner Tradisional, Kerajinan Rotan, dan Pemandu Lokal.
   - Filter kesiapan pembayaran: Pasti Terima QRIS, Bisa Transfer Bank, Perlu Uang Tunai.
   - Modal detail UMKM dengan informasi rekening, QRIS verifikasi, catatan sinyal lapangan, dan tombol chat WhatsApp langsung.

5. **Travel Pack Offline Hub (`/pack`)**
   - Manajemen paket wisata offline yang tersimpan di IndexedDB.
   - **Offline Simulator**: Toggle untuk mensimulasikan penggunaan aplikasi tanpa sinyal internet.
   - Lembar contekan darurat (Emergency SOS) & frekuensi radio maritim VHF Saluran 16 Sungai Sekonyer.
   - Daftar rencana budget tersimpan.

6. **Portal Mitra & Pengelola Wisata (`/mitra`)**
   - Ruang kerja khusus mitra UMKM (nahkoda kelotok, kuliner) dan Jagawana Balai Konservasi.
   - Login nomor WhatsApp / ID Mitra & PIN keamanan.
   - Dashboard ringkasan status operasional & sinkronisasi data lapangan.

7. **Profil Petualang (`/profil`)**
   - Dashboard status kesiapan perjalanan, statistik memori cache browser, dan reset data offline.

---

## 🛠️ Cara Menjalankan Proyek

### 1. Prasyarat
- Node.js versi 18 atau 20+
- npm atau pnpm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Opsional untuk Supabase)
Salin berkas `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Isi variabel dengan kredensial Supabase Anda. Jika tidak diisi, aplikasi **tetap bekerja 100% normal** berkat arsitektur *offline-first fallback* ke IndexedDB!

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser (disarankan menggunakan mode Responsive/Mobile View di DevTools ukuran 390x844px untuk sensasi mobile-first maksimal).

### 5. Build Produksi
```bash
npm run build
npm start
```

---

## 🗄️ Supabase Schema
File skema PostgreSQL lengkap dengan RLS (Row Level Security) dan indexing tersedia di [`supabase/schema.sql`](file:///home/r3x/Documents/project/Manjalan/supabase/schema.sql).

---

## 💡 Rekomendasi Bahasa Backend Terbaik untuk MANJALAN

Lihat analisis arsitektur backend lengkap di dalam laporan dan dokumentasi proyek.
Pilihan terbaik: **TypeScript (Next.js Server Actions / Route Handlers + Supabase Edge Functions / Deno)**, dengan opsi **Go (Golang)** jika di masa depan mengimplementasikan gateway server portabel lokal di dermaga sungai.
