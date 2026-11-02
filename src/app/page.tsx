'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { getDestinations, getTravelPacks, getStorageUsage, getUmkmList } from '@/lib/indexeddb';
import { Destination, Umkm, TravelPack } from '@/types';

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [travelPacks, setTravelPacks] = useState<TravelPack[]>([]);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageInfo, setStorageInfo] = useState({ usageMb: '24.6 MB', countPacks: 2 });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    async function loadData() {
      const dests = await getDestinations();
      const packs = await getTravelPacks();
      const umkms = await getUmkmList();
      const storage = await getStorageUsage();

      setDestinations(dests);
      setTravelPacks(packs);
      setUmkmList(umkms.slice(0, 4));
      setStorageInfo({
        usageMb: storage.usageMb,
        countPacks: packs.length,
      });
    }

    loadData();

    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredDestinations = destinations.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header title="MANJALAN" subtitle="Beranda" />

      <main className="flex-1 pt-20 pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-12">
          {/* Top Section: Hero Greeting & Live Readiness Dashboard */}
          <section className="pt-2 sm:pt-4">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-stretch">
              {/* Left Column: Greeting, Search & Quick Actions */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="/logo/app-icon.png"
                      alt="MANJALAN Icon"
                      className="w-6 h-6 rounded-md object-contain shrink-0 shadow-sm"
                    />
                    <span className="font-label-md text-xs text-secondary uppercase tracking-wider font-extrabold">
                      Tilik Borneo • Ekowisata Kalimantan Tengah
                    </span>
                    <div className="ml-auto sm:ml-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs">
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isOnline ? 'text-secondary' : 'text-amber-600'
                        }`}
                      >
                        {isOnline ? 'wifi' : 'wifi_off'}
                      </span>
                      <span>{isOnline ? 'Online Sync' : 'Mode Offline'}</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
                    Rencanakan Saat Online,<br />
                    <span className="text-primary">Tetap Siap Saat Offline.</span>
                  </h1>
                  <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl">
                    Platform kesiapan ekspedisi hutan tropis Kalteng: hitung budget kelotok secara transparan, pastikan kesiapan pembayaran tunai & QRIS, dan bawa Travel Pack offline.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative flex items-center gap-2 max-w-xl">
                  <div className="relative flex-1 flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                      search
                    </span>
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-10 pr-10 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-sm placeholder:text-outline border border-outline-variant/40 focus:outline-none focus:border-primary shadow-sm transition-all"
                      placeholder="Cari destinasi, taman nasional, UMKM kelotok..."
                      type="text"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 text-outline hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    )}
                  </div>
                  <Link
                    href="/umkm"
                    aria-label="Filter Pencarian"
                    className="h-12 w-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-surface-container-highest"
                  >
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </Link>
                </div>

                {/* Quick Action Field Shortcuts (4-Grid on Desktop/Tablet) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                      Modul Siaga Lapangan
                    </h2>
                    <span className="text-xs text-primary font-semibold">4 Modul Aktif</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Action 1 */}
                    <Link
                      href="/budget"
                      className="p-3 sm:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 active:scale-[0.98] transition-all hover:border-primary/50 hover:shadow-md group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">calculate</span>
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-on-surface block leading-tight">
                          Hitung Budget
                        </span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5 line-clamp-1">
                          Kelotok & tiket
                        </span>
                      </div>
                    </Link>

                    {/* Action 2 */}
                    <Link
                      href="/pack"
                      className="p-3 sm:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 active:scale-[0.98] transition-all hover:border-secondary/50 hover:shadow-md group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-on-surface block leading-tight">
                          Travel Pack
                        </span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5 line-clamp-1">
                          Offline rute & SOS
                        </span>
                      </div>
                    </Link>

                    {/* Action 3 */}
                    <Link
                      href="/umkm"
                      className="p-3 sm:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 active:scale-[0.98] transition-all hover:border-amber-300 hover:shadow-md group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">storefront</span>
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-on-surface block leading-tight">
                          Direktori UMKM
                        </span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5 line-clamp-1">
                          QRIS & Perahu
                        </span>
                      </div>
                    </Link>

                    {/* Action 4 */}
                    <Link
                      href="/mitra"
                      className="p-3 sm:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 active:scale-[0.98] transition-all hover:border-primary/50 hover:shadow-md group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-on-surface block leading-tight">
                          Portal Mitra
                        </span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5 line-clamp-1">
                          UMKM & Jagawana
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Prominent Offline Readiness Dashboard Card */}
              <div className="lg:col-span-5 mt-6 lg:mt-0 flex flex-col">
                <Link
                  href="/pack"
                  className="h-full p-5 sm:p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/40 flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-md hover:border-secondary/40 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary-container/50 flex items-center justify-center text-secondary shrink-0 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[26px]">offline_pin</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-extrabold text-on-surface">
                            Kesiapan Offline Lapangan
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                            Siap Jalur
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Penyimpanan Lokal IndexedDB
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    <strong>{storageInfo.countPacks} Travel Pack</strong> tersimpan di browser Anda. Seluruh titik feeding orangutan, radio nahkoda, dan panduan darurat aktif tanpa perlu kuota atau sinyal.
                  </p>

                  <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-secondary">
                          verified
                        </span>
                        Integritas Berkas Offline
                      </span>
                      <span className="font-bold text-secondary">
                        {Math.min(storageInfo.countPacks * 45, 100)}% Siaga
                      </span>
                    </div>

                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(storageInfo.countPacks * 45, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                      <span className="text-secondary font-semibold truncate max-w-[200px]">
                        {travelPacks.length > 0
                          ? travelPacks.map(p => p.destinationName.replace('Taman Nasional ', '')).join(' & ')
                          : 'Belum ada pack'}
                      </span>
                      <span className="font-mono text-outline">Pakai: {storageInfo.usageMb}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-primary font-bold pt-1 group-hover:translate-x-1 transition-transform">
                    <span>Buka Lembar Panduan Offline & Frekuensi Radio</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Popular Destinations Grid (Responsive: 1 col on mobile, 2 on tablet, 3 on laptop) */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                  Destinasi Pilihan Kalteng
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Terverifikasi tarif resmi, kondisi sinyal seluler, dan kebutuhan uang tunai.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-secondary bg-secondary-container/40 px-3 py-1 rounded-full border border-secondary/20">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Valid Lapangan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="relative w-full h-52 sm:h-56 bg-surface-container overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        offline_pin
                      </span>
                      <span>{dest.packSize}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                          {dest.categories[0]}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[15px] text-amber-300">
                          location_on
                        </span>
                        {dest.location}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {dest.overview}
                    </p>

                    {/* Connectivity & Payment Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">
                          signal_cellular_connected_no_internet_4_bar
                        </span>
                        Sinyal Lemah/Edge
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-primary text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">qr_code_2</span>
                        QRIS Tersedia
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">payments</span>
                        {dest.paymentReadiness.recommendedCashFormatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/20 mt-auto">
                      <Link
                        href={`/destinasi/${dest.id}`}
                        className="flex-1 h-11 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform hover:bg-primary/90"
                      >
                        <span>Lihat Panduan Jalur</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                      <Link
                        href={`/budget?dest=${dest.id}`}
                        aria-label="Hitung Budget"
                        className="h-11 px-3.5 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs gap-1 active:scale-95 transition-transform hover:bg-surface-container-highest"
                      >
                        <span className="material-symbols-outlined text-[18px]">calculate</span>
                        <span>Budget</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured UMKM Section (Responsive: 1 col mobile, 2 tablet, 4 desktop) */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                  UMKM Sekitar Destinasi
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Dukung perahu kelotok, kuliner Dayak, dan pengrajin lokal Kalimantan Tengah.
                </p>
              </div>
              <Link
                href="/umkm"
                className="text-xs sm:text-sm text-primary font-bold hover:underline shrink-0 flex items-center gap-1"
              >
                <span>Lihat Semua (24)</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {umkmList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md hover:border-primary/40 transition-all group"
                >
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-surface-container">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                    </div>
                    {item.hasQris && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-sm">
                          QRIS
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-on-surface truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-secondary font-semibold truncate">
                        {item.distanceDesc}
                      </span>
                      <span className="font-bold text-on-surface shrink-0">
                        {item.priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Call-To-Action Budget Card */}
          <section className="pb-4">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary via-primary-container to-blue-900 text-white shadow-lg relative overflow-hidden">
              <img
                src="/logo/logo-master.png"
                alt="MANJALAN Watermark"
                className="absolute -right-10 -bottom-10 w-72 h-72 opacity-15 pointer-events-none object-contain"
              />
              <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold w-fit mb-3">
                    <span className="material-symbols-outlined text-[16px]">savings</span>
                    <span>Transparansi Biaya Terpencil</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                    Belum tahu estimasi budget perjalananmu?
                  </h2>
                  <p className="text-sm sm:text-base text-primary-fixed mt-2 leading-relaxed">
                    Hitung sewa Kelotok, biaya simaksi taman nasional, konsumsi koki kapal, dan cadangan tunai darurat dalam hitungan detik.
                  </p>
                </div>
                <div className="mt-5 lg:mt-0 shrink-0">
                  <Link
                    href="/budget"
                    className="h-12 px-6 rounded-xl bg-surface-container-lowest text-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 hover:bg-slate-100 transition-all"
                  >
                    <span>Mulai Budget Planner Sekarang</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
