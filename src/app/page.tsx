'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import OnboardingModal from '@/components/OnboardingModal';
import { getDestinations, getUmkmList } from '@/lib/indexeddb';
import { Destination, Umkm } from '@/types';

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      const dests = await getDestinations();
      const umkms = await getUmkmList();

      setDestinations(dests);
      setUmkmList(umkms.slice(0, 4));
    }

    loadData();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-10">
          
          {/* Top Hero & Status Section */}
          <section className="pt-2 sm:pt-4">
            <div className="flex flex-col gap-4 md:gap-6">
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-on-surface leading-[1.15]">
                  Menjelajah Isen Mulang,<br />
                  <span className="text-primary">Lebih Siap Setiap Langkah.</span>
                </h1>
                <p className="mt-2 md:mt-2.5 text-xs sm:text-base text-on-surface-variant font-medium">
                  &ldquo;Temukan Destinasi, Siapkan Perjalanan.&rdquo;
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
                    className="w-full h-11 md:h-12 pl-10 pr-10 rounded-2xl bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline border border-outline-variant/40 focus:outline-none focus:border-primary shadow-sm transition-all"
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
                  className="h-11 w-11 md:h-12 md:w-12 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-surface-container-highest"
                >
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </Link>
              </div>

            </div>
          </section>

          {/* Destinations Grid (Clean, Easy UX, Consistent Height) */}
          <section>
            <div className="flex items-center justify-between mb-3 md:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Destinasi Pilihan
              </h2>
              <Link
                href="/destinasi"
                className="text-xs sm:text-sm text-primary font-bold hover:underline flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            <div
              aria-label="Daftar destinasi pilihan"
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
            >
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="min-w-[84%] max-w-[340px] snap-start bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group md:min-w-0 md:max-w-none"
                >
                  {/* Hero Image */}
                  <div className="relative w-full h-40 sm:h-56 bg-surface-container overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

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

                  {/* Card Body: Clean Key Metrics & GMaps */}
                  <div className="p-4 md:p-5 flex-1 flex flex-col justify-between gap-3 md:gap-4">
                    {/* Location, Google Maps Link & Cash Info */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 font-medium min-w-0 flex-1">
                          <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                            location_on
                          </span>
                          <span className="truncate">{dest.location}</span>
                        </p>

                        {dest.gmapsUrl && (
                          <a
                            href={dest.gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] shrink-0 transition-colors shadow-xs active:scale-95"
                            title="Buka rute & ulasan di Google Maps"
                          >
                            <span className="material-symbols-outlined text-[14px] text-emerald-700">map</span>
                            <span>GMaps</span>
                            <span className="material-symbols-outlined text-[12px] text-emerald-600">open_in_new</span>
                          </a>
                        )}
                      </div>

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
            <div className="flex items-center justify-between mb-3 md:mb-6">
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

            <div
              aria-label="Daftar UMKM sekitar destinasi"
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
            >
              {umkmList.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[72%] max-w-[260px] snap-start p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md hover:border-primary/40 transition-all group sm:min-w-0 sm:max-w-none"
                >
                  <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-surface-container">
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
                      <span className="text-secondary font-medium truncate flex-1 min-w-0 mr-2">
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
            <div className="p-4 sm:p-8 rounded-3xl bg-gradient-to-r from-primary to-blue-900 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
              <div>
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold leading-tight">
                  Hitung Estimasi Budget Perjalanan
                </h2>
                <p className="text-xs sm:text-sm text-primary-fixed mt-1">
                  Kalkulasi sewa kelotok, tiket masuk simaksi, dan cadangan tunai.
                </p>
              </div>
              <Link
                href="/budget"
                className="h-10 sm:h-11 px-5 sm:px-6 rounded-2xl bg-surface-container-lowest text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-95 hover:bg-slate-100 transition-all"
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
