'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { getTravelPacks, getBudgetPlans, getStorageUsage, seedInitialDataIfNeeded } from '@/lib/indexeddb';

export default function ProfilePage() {
  const [packCount, setPackCount] = useState(0);
  const [budgetCount, setBudgetCount] = useState(0);
  const [storage, setStorage] = useState({ usageMb: '24.6 MB', totalMb: '512 MB', countPacks: 2 });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSplashModal, setShowSplashModal] = useState(false);

  useEffect(() => {
    loadStats();
    const sim = localStorage.getItem('manjalan_offline_simulation') === 'true';
    setIsSimulatedOffline(sim);
  }, []);

  const loadStats = async () => {
    const packs = await getTravelPacks();
    const budgets = await getBudgetPlans();
    const st = await getStorageUsage();
    setPackCount(packs.length);
    setBudgetCount(budgets.length);
    setStorage(st);
  };

  const handleResetData = async () => {
    if (confirm('Muat ulang basis data lokal (IndexedDB) ke data standar resmi Kalimantan Tengah?')) {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
        indexedDB.deleteDatabase('manjalan_offline_db');
        setTimeout(async () => {
          await seedInitialDataIfNeeded();
          await loadStats();
          showToast('Basis data offline berhasil diperbarui ke versi awal.');
        }, 500);
      }
    }
  };

  const toggleSimulation = () => {
    const nextVal = !isSimulatedOffline;
    setIsSimulatedOffline(nextVal);
    localStorage.setItem('manjalan_offline_simulation', String(nextVal));
    showToast(nextVal ? 'Mode Offline Lapangan Aktif' : 'Mode Online Sync Aktif');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header title="MANJALAN" subtitle="Profil & Pengaturan" />

      <main className="flex-1 pt-20 pb-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-8">
          {/* Profile Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary via-primary-container to-blue-900 text-white shadow-lg flex items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-4 ring-white/20 shrink-0">
              <img
                alt="Petualang"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx2injEluPYHwJ3yie2YvbgRoHtOqwEPB0lmbI_9CYtQ3EXraWnBdeo3PmavkbDILfrvS6MUFvXmiY6JtWEvFKEfWt3GWfiXuq4rCnCSmqg_m7sQ2sRUWXzLmPhOBe5iLKiivB_Re-hg92YRuijyMAHlwS6n-jbE3iwHqWdIxBKfvvbHs7yrp0G_9KkQSwp6H4L7MrYwYscgO08-KWEMauBL9AQU2z3-3ME2O5BoNd"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  Petualang Siaga
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold truncate mt-1">Penjelajah Borneo</h1>
              <p className="text-xs sm:text-sm text-primary-fixed truncate">ID Pengguna Tamu (Offline-First Ready)</p>
            </div>
          </div>

          {/* Desktop/Tablet 2-Column Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Readiness Stats & Tools */}
            <div className="md:col-span-7 flex flex-col gap-6">
              {/* Readiness Dashboard Stats */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 px-1">
                  Kesiapan Memori Lokal
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center shadow-sm">
                    <span className="text-xl sm:text-2xl font-extrabold text-primary block">{packCount}</span>
                    <span className="text-xs text-on-surface-variant font-bold">Pack Offline</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center shadow-sm">
                    <span className="text-xl sm:text-2xl font-extrabold text-secondary block">{budgetCount}</span>
                    <span className="text-xs text-on-surface-variant font-bold">Simulasi Budget</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center shadow-sm">
                    <span className="text-xl sm:text-2xl font-extrabold text-tertiary block">{storage.usageMb}</span>
                    <span className="text-xs text-on-surface-variant font-bold">Cache IDB</span>
                  </div>
                </div>
              </div>

              {/* Settings & Controls */}
              <div className="flex flex-col gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Pengaturan & Alat Lapangan
                </h2>

                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/20 shadow-sm">
                  {/* Toggle Offline Simulation */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          {isSimulatedOffline ? 'cloud_off' : 'wifi'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-on-surface">Simulasi Mode Offline</p>
                        <p className="text-xs text-on-surface-variant">Uji aplikasi seolah tanpa sinyal di pedalaman</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleSimulation}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        isSimulatedOffline ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          isSimulatedOffline ? 'right-0.5' : 'left-0.5'
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Portal Mitra Link */}
                  <Link
                    href="/mitra"
                    className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[20px]">handshake</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-on-surface">Portal Mitra & UMKM</p>
                        <p className="text-xs text-on-surface-variant">Login ruang kerja pengelola kelotok & posko</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
                  </Link>

                  {/* Reset Data */}
                  <button
                    onClick={handleResetData}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-error">
                        <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-error">Muat Ulang Cache Offline</p>
                        <p className="text-xs text-on-surface-variant">Segarkan IndexedDB ke data resmi Kalimantan Tengah</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Product Manifest & Ideathon Vision */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
                Tentang Produk
              </h2>
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between gap-2.5">
                  <img
                    src="/logo/logo-horizontal.png"
                    alt="MANJALAN Logo"
                    className="h-9 w-auto object-contain"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary border border-secondary/20">
                    Resmi
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface font-semibold italic text-primary">
                  &quot;Rencanakan Saat Online, Tetap Siap Saat Offline.&quot;
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  MANJALAN adalah platform travel readiness pertama yang fokus membantu wisatawan domestik sebelum dan selama perjalanan ke Kalimantan Tengah: transparansi biaya sewa perahu kelotok, kesiapan uang tunai &amp; QRIS, serta akses informasi tanpa koneksi internet.
                </p>

                <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-1 text-[11px] text-outline">
                  <div className="flex justify-between">
                    <span>Versi:</span>
                    <span className="font-semibold text-on-surface">1.0.0 (Ideathon Prototype)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tech Stack:</span>
                    <span className="font-semibold text-on-surface">Next.js • IndexedDB • Supabase</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fokus Wilayah:</span>
                    <span className="font-semibold text-on-surface">Kotawaringin Barat &amp; Palangka Raya</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSplashModal(true)}
                  className="w-full mt-2 h-10 rounded-xl bg-surface-container-high text-primary hover:bg-surface-container-highest text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                  <span>Pratinjau Splash Screen Resmi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Splash Screen Preview Modal */}
      {showSplashModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-xs w-full rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/20">
            <button
              onClick={() => setShowSplashModal(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <img
              src="/logo/splash-screen.png"
              alt="MANJALAN Official Splash Screen"
              className="w-full h-auto object-contain rounded-3xl"
            />
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-sm w-[90%] z-50 p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2.5 text-xs animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">info</span>
          <p>{toastMessage}</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
