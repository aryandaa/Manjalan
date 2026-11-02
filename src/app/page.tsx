'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import OnboardingModal from '@/components/OnboardingModal';
import { getDestinations, getTravelPacks, getStorageUsage, getUmkmList } from '@/lib/indexeddb';
import { Destination, Umkm } from '@/types';

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageInfo, setStorageInfo] = useState({ usageMb: '24.6 MB', countPacks: 2 });
  const [downloadedDestIds, setDownloadedDestIds] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    async function loadData() {
      const dests = await getDestinations();
      const packs = await getTravelPacks();
      const umkms = await getUmkmList();
      const storage = await getStorageUsage();

      setDestinations(dests);
      setUmkmList(umkms.slice(0, 4));
      setDownloadedDestIds(packs.map((p) => p.destinationId));
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-10">
          
          {/* Top Hero & Status Section */}
          <section className="pt-2 sm:pt-4">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              
              {/* Left Column: Greeting, Search & Quick Actions */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="/logo/app-icon.png"
                      alt="MANJALAN"
                      className="w-6 h-6 rounded-md object-contain shrink-0 shadow-sm"
                    />
                    <span className="font-extrabold text-xs text-secondary uppercase tracking-wider">
                      MANJALAN BORNEO
                    </span>
                    <div className="ml-auto sm:ml-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isOnline ? 'text-secondary' : 'text-amber-600'
                        }`}
                      >
                        {isOnline ? 'wifi' : 'wifi_off'}
                      </span>
                      <span>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-on-surface leading-[1.15]">
                    Rencanakan Saat Online,<br />
                    <span className="text-primary">Tetap Siap Saat Offline.</span>
                  </h1>
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
                      className="w-full h-12 pl-10 pr-10 rounded-2xl bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline border border-outline-variant/40 focus:outline-none focus:border-primary shadow-sm transition-all"
                      placeholder="Cari destinasi, kelotok, UMKM..."
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
                    className="h-12 w-12 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-surface-container-highest"
                  >
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </Link>
                </div>

                {/* 5 Action Cards (Clean, Bold, Zero Clutter) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                  <Link
                    href="/peta"
                    className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col items-start gap-2 active:scale-[0.98] transition-all hover:border-emerald-500 hover:shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">map</span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-emerald-700 transition-colors">
                      Peta Interaktif
                    </span>
                  </Link>

                  <Link
                    href="/budget"
                    className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col items-start gap-2 active:scale-[0.98] transition-all hover:border-primary hover:shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">calculate</span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors">
                      Hitung Budget
                    </span>
                  </Link>

                  <Link
                    href="/pack"
                    className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col items-start gap-2 active:scale-[0.98] transition-all hover:border-secondary hover:shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-secondary transition-colors">
                      Travel Pack
                    </span>
                  </Link>

                  <Link
                    href="/umkm"
                    className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col items-start gap-2 active:scale-[0.98] transition-all hover:border-amber-400 hover:shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">storefront</span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-tertiary transition-colors">
                      Direktori UMKM
                    </span>
                  </Link>

                  <Link
                    href="/mitra"
                    className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col items-start gap-2 active:scale-[0.98] transition-all hover:border-primary hover:shadow-md group col-span-2 sm:col-span-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors">
                      Portal Mitra
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Clean Offline Status Card */}
              <div className="lg:col-span-5 mt-6 lg:mt-0">
                <Link
                  href="/pack"
                  className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-5 hover:border-secondary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[26px]">offline_pin</span>
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-on-surface">
                          Kesiapan Offline
                        </h2>
                        <span className="text-xs text-secondary font-bold">
                          IndexedDB Siap Pakai
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Siap
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant mb-2">
                      <span>{storageInfo.countPacks} Destinasi Tersimpan</span>
                      <span className="font-mono text-secondary">{storageInfo.usageMb}</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(storageInfo.countPacks * 45, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-primary font-bold pt-2 border-t border-outline-variant/20 group-hover:translate-x-1 transition-transform">
                    <span>Buka Panduan Offline & Radio VHF</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Destinations Grid (Clean, Easy UX, Consistent Height) */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Destinasi Pilihan
              </h2>
              <span className="text-xs font-bold text-on-surface-variant">
                {filteredDestinations.length} Destinasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  {/* Hero Image */}
                  <div className="relative w-full h-52 sm:h-56 bg-surface-container overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Show badge ONLY if actually downloaded */}
                    {downloadedDestIds.includes(dest.id) && (
                      <div className="absolute top-3.5 right-3.5 bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          offline_pin
                        </span>
                        <span>Tersimpan Offline</span>
                      </div>
                    )}

                    {/* Category & Title */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold inline-block mb-1">
                        {dest.categories[0]}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold leading-tight">
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body: Clean Key Metrics & CTA */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    {/* Location & Cash Info */}
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          location_on
                        </span>
                        <span>{dest.location}</span>
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                        <span className="text-on-surface-variant font-medium">Estimasi Tunai:</span>
                        <span className="font-bold text-on-surface">
                          {dest.paymentReadiness.recommendedCashFormatted.replace(' / orang (Tunai)', '')}
                        </span>
                      </div>
                    </div>

                    {/* Full Width Primary CTA Button */}
                    <Link
                      href={`/destinasi/${dest.id}`}
                      className="w-full h-11 rounded-2xl bg-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all hover:bg-primary/90"
                    >
                      <span>Lihat Panduan Jalur</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* UMKM Section (Clean, Scannable Cards) */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                UMKM Sekitar Destinasi
              </h2>
              <Link
                href="/umkm"
                className="text-xs sm:text-sm text-primary font-bold hover:underline flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {umkmList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md hover:border-primary/40 transition-all group"
                >
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-surface-container">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
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

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-sm text-on-surface truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-secondary font-medium truncate max-w-[120px]">
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

          {/* Clean Call-To-Action Budget Banner */}
          <section className="pb-2">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary to-blue-900 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
                  Hitung Estimasi Budget Perjalanan
                </h2>
                <p className="text-xs sm:text-sm text-primary-fixed mt-1">
                  Kalkulasi sewa kelotok, tiket masuk simaksi, dan cadangan tunai.
                </p>
              </div>
              <Link
                href="/budget"
                className="h-11 px-6 rounded-2xl bg-surface-container-lowest text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-95 hover:bg-slate-100 transition-all"
              >
                <span>Buka Kalkulator</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </section>

        </div>
      </main>

      <OnboardingModal />
      <BottomNav />
    </div>
  );
}
