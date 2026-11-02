'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { getUmkmList } from '@/lib/indexeddb';
import { Umkm } from '@/types';

export default function UmkmDirectoryPage() {
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterQris, setFilterQris] = useState(false);
  const [filterTransfer, setFilterTransfer] = useState(false);
  const [filterCash, setFilterCash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getUmkmList();
      setUmkmList(data);
    }
    load();
  }, []);

  const filteredUmkm = umkmList.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filterQris && !item.hasQris) return false;
    if (filterTransfer && !item.hasTransfer) return false;
    if (filterCash && !item.needsCash) return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.locationDesc.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'Semua (24)' },
    { id: 'kuliner', label: 'Kuliner Khas' },
    { id: 'kelotok', label: 'Penginapan & Kelotok' },
    { id: 'souvenir', label: 'Oleh-oleh & Kerajinan' },
    { id: 'transport', label: 'Transportasi Lokal' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header title="MANJALAN" subtitle="UMKM Lokal" />

      <main className="flex-1 pt-20 pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-8">
          {/* Title Header (Clean & Minimal) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight">
                Direktori UMKM Destinasi
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Perahu kelotok, kuliner lokal, dan pemandu terpercaya Kalimantan Tengah.
              </p>
            </div>
          </div>

          {/* Search Bar & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kelotok Pak Joko, baung bakar, anyaman..."
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm border border-outline-variant/40 focus:outline-none focus:border-primary shadow-sm"
              />
            </div>

            {/* Payment Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterQris(!filterQris)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 border ${
                  filterQris
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                <span>QRIS Tersedia</span>
              </button>

              <button
                onClick={() => setFilterTransfer(!filterTransfer)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 border ${
                  filterTransfer
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                <span>Transfer Bank</span>
              </button>

              <button
                onClick={() => setFilterCash(!filterCash)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 border ${
                  filterCash
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">payments</span>
                <span>Perlu Tunai</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === c.id
                    ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* UMKM Responsive Grid (1 col mobile, 2 tablet, 3 laptop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUmkm.length === 0 ? (
              <div className="col-span-full p-12 text-center text-on-surface-variant text-sm bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                Tidak ada pelaku UMKM yang cocok dengan filter pencarian.
              </div>
            ) : (
              filteredUmkm.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedUmkm(item)}
                  className="rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div>
                    <div className="relative w-full h-48 bg-surface-container overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={item.name}
                        src={item.image}
                      />
                      <div
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md ${
                          item.signalOk
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.signalOk ? 'bg-secondary animate-pulse' : 'bg-error'
                          }`}
                        ></span>
                        <span>{item.signalStatus}</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          {item.categoryLabel}
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-on-surface leading-snug mt-0.5 truncate">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-secondary font-medium truncate flex-1 min-w-0 mr-2">
                          {item.distanceDesc}
                        </span>
                        <span className="font-bold text-on-surface shrink-0">{item.priceRange}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0">
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-outline-variant/20">
                      {item.hasQris && (
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          QRIS
                        </span>
                      )}
                      {item.hasTransfer && (
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[11px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">account_balance</span>
                          Transfer
                        </span>
                      )}
                      {item.needsCash && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">payments</span>
                          Tunai
                        </span>
                      )}
                      <span className="ml-auto text-xs text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        <span>Detail</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Detail UMKM (Responsive Centered Dialog) */}
        {selectedUmkm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
            <div className="bg-surface max-w-lg w-full rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto flex flex-col gap-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Detail Kesiapan Transaksi & Kontak
                </span>
                <button
                  onClick={() => setSelectedUmkm(null)}
                  className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={selectedUmkm.image}
                  alt={selectedUmkm.name}
                  className="w-24 h-24 rounded-2xl object-cover bg-surface-container shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {selectedUmkm.categoryLabel}
                  </span>
                  <h3 className="font-extrabold text-lg sm:text-xl text-on-surface">
                    {selectedUmkm.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{selectedUmkm.ownerName}</p>
                  <p className="text-sm text-secondary font-bold mt-1">{selectedUmkm.priceRange}</p>
                </div>
              </div>

              {/* Payment details breakdown */}
              <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-2.5">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Kesiapan Metode Pembayaran:
                </span>

                {selectedUmkm.hasQris && (
                  <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[26px]">
                      qr_code_2
                    </span>
                    <div>
                      <p className="text-xs font-bold text-primary">QRIS Statis Terverifikasi</p>
                      <p className="text-[11px] text-on-surface-variant">
                        {selectedUmkm.qrisMerchantName || selectedUmkm.name}
                      </p>
                    </div>
                  </div>
                )}

                {selectedUmkm.hasTransfer && (
                  <div className="p-3 bg-white rounded-xl border border-outline-variant/40 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[26px]">
                      account_balance
                    </span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        Transfer Bank: {selectedUmkm.bankName}
                      </p>
                      <p className="text-[11px] font-mono text-on-surface-variant">
                        No. Rek: {selectedUmkm.bankNumber}
                      </p>
                    </div>
                  </div>
                )}

                {selectedUmkm.needsCash && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-700 text-[26px]">
                      payments
                    </span>
                    <div>
                      <p className="text-xs font-bold text-amber-800">
                        Uang Tunai Diperlukan saat Blankspot
                      </p>
                      <p className="text-[11px] text-amber-900 leading-snug">
                        Sediakan uang tunai pas pecahan Rp 20.000 / Rp 50.000 saat perahu berada di hulu sungai.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedUmkm.offlineNotes && (
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-primary leading-relaxed">
                  <strong>Catatan Lapangan:</strong> {selectedUmkm.offlineNotes}
                </div>
              )}

              {/* Action WhatsApp */}
              {selectedUmkm.whatsapp && (
                <a
                  href={`https://wa.me/${selectedUmkm.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(
                    selectedUmkm.name
                  )},%20saya%20wisatawan%20MANJALAN%20ingin%20bertanya%20layanan%20Anda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Hubungi Mitra via WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
