'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { getTravelPacks, deleteTravelPack, getBudgetPlans, deleteBudgetPlan, getStorageUsage } from '@/lib/indexeddb';
import { TravelPack, BudgetCalculation } from '@/types';

export default function TravelPackPage() {
  const [packs, setPacks] = useState<TravelPack[]>([]);
  const [budgets, setBudgets] = useState<BudgetCalculation[]>([]);
  const [storage, setStorage] = useState({ usageMb: '24.6 MB', totalMb: '512 MB', countPacks: 2 });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
    const sim = localStorage.getItem('manjalan_offline_simulation') === 'true';
    setIsSimulatedOffline(sim);
  }, []);

  const loadAll = async () => {
    const p = await getTravelPacks();
    const b = await getBudgetPlans();
    const s = await getStorageUsage();
    setPacks(p);
    setBudgets(b);
    setStorage(s);
  };

  const handleDeletePack = async (id: string, name: string) => {
    if (confirm(`Hapus Travel Pack "${name}" dari memori offline?`)) {
      await deleteTravelPack(id);
      await loadAll();
      showToast(`Travel Pack ${name} berhasil dihapus.`);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    await deleteBudgetPlan(id);
    await loadAll();
    showToast('Rencana budget dihapus.');
  };

  const toggleSimulation = () => {
    const nextVal = !isSimulatedOffline;
    setIsSimulatedOffline(nextVal);
    localStorage.setItem('manjalan_offline_simulation', String(nextVal));
    showToast(
      nextVal
        ? 'Mode Simulasi Lapangan Aktif (Semua data dari IndexedDB)'
        : 'Mode Online Sync Aktif'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header title="MANJALAN" subtitle="Travel Pack" />

      <main className="flex-1 pt-20 pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-8">
          {/* Header context (Clean & Minimal) */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface">
              Travel Pack Offline
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Panduan rute, frekuensi radio darurat, dan data tersimpan di IndexedDB.
            </p>
          </div>

          {/* Desktop/Tablet 2-Column Split Layout */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Column: Downloaded Packs & Saved Budgets (7-8 cols on desktop) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
              {/* Downloaded Packs List */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-extrabold text-on-surface">
                    Paket Wisata Tersimpan ({packs.length})
                  </h2>
                  <Link href="/" className="text-xs sm:text-sm text-primary font-bold hover:underline">
                    + Tambah Destinasi
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packs.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant text-sm">
                      Belum ada Travel Pack yang diunduh. Jelajahi destinasi dan klik &quot;Unduh Travel Pack&quot;.
                    </div>
                  ) : (
                    packs.map((pack) => (
                      <div
                        key={pack.id}
                        className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                                Tersimpan Offline
                              </span>
                              <span className="text-xs text-outline font-mono">{pack.sizeMb}</span>
                            </div>
                            <h3 className="font-extrabold text-base sm:text-lg text-on-surface mt-1.5">
                              {pack.destinationName}
                            </h3>
                            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[15px] text-amber-500">
                                location_on
                              </span>
                              {pack.location}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeletePack(pack.id, pack.destinationName)}
                            className="p-2 rounded-xl text-outline hover:text-error hover:bg-red-50 transition-colors"
                            title="Hapus dari offline"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-surface-container-low grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-on-surface-variant block">Jalur Rute</span>
                            <strong className="text-on-surface text-xs">{pack.itemCount?.routes || 4} Titik</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-on-surface-variant block">UMKM Mitra</span>
                            <strong className="text-on-surface text-xs">{pack.itemCount?.umkm || 4} Usaha</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-on-surface-variant block">Radio Darurat</span>
                            <strong className="text-secondary font-bold text-xs">VHF Aktif</strong>
                          </div>
                        </div>

                        <div className="pt-1">
                          <Link
                            href={`/destinasi/${pack.destinationId}`}
                            className="w-full h-10 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform hover:bg-primary/90"
                          >
                            <span>Buka Panduan Offline</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Saved Custom Budget Plans */}
              {budgets.length > 0 && (
                <section>
                  <h2 className="text-lg sm:text-xl font-extrabold text-on-surface mb-4">
                    Simulasi Budget Tersimpan ({budgets.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgets.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-primary">
                              {b.style} • {b.guests} Orang • {b.durationDays} Hari
                            </span>
                            <h4 className="font-bold text-sm sm:text-base text-on-surface mt-0.5">
                              {b.destinationName}
                            </h4>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              Asal: {b.origin} • Dibuat: {b.createdAt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-extrabold text-primary">
                              Rp {b.totalCost.toLocaleString('id-ID')}
                            </span>
                            <button
                              onClick={() => handleDeleteBudget(b.id)}
                              className="text-outline hover:text-error p-1"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50 text-xs text-amber-900 border border-amber-200">
                          {b.cashAdvice}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Storage Gauge, Simulator & Emergency Sheet (4-5 cols on desktop) */}
            <div className="lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0 flex flex-col gap-5 lg:sticky lg:top-24">
              {/* Storage Gauge & Simulator Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container/50 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">sd_card</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">Penyimpanan IndexedDB</h3>
                      <p className="text-xs text-on-surface-variant">
                        {storage.usageMb} terpakai dari ~{storage.totalMb}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleSimulation}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSimulatedOffline
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-surface-container-high text-primary hover:bg-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isSimulatedOffline ? 'cloud_off' : 'wifi'}
                    </span>
                    <span>{isSimulatedOffline ? 'Simulasi Aktif' : 'Tes Offline'}</span>
                  </button>
                </div>

                <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(packs.length * 40, 100)}%` }}
                  ></div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Status: <strong>{packs.length} destinasi</strong> siap diakses saat ponsel Anda di mode pesawat atau di kedalaman sungai Sekonyer.
                </p>
              </div>

              {/* Emergency Cheat Sheet */}
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined text-[24px]">contact_emergency</span>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface">
                    Posko & Frekuensi Darurat Rimba
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Catatan frekuensi radio dan nomor darurat ini selalu dapat dibuka offline jika terjadi kendala pada perahu.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-container flex justify-between items-center">
                    <span className="font-medium">Radio Maritim Sekonyer</span>
                    <span className="font-mono font-bold text-primary">VHF Saluran 16</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container flex justify-between items-center">
                    <span className="font-medium">Kantor Balai TNTP Kumai</span>
                    <span className="font-mono font-bold text-on-surface">+62 532 61451</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container flex justify-between items-center">
                    <span className="font-medium">Basarnas Palangka Raya</span>
                    <span className="font-mono font-bold text-on-surface">Hotline 115</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
