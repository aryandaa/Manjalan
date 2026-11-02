'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function MitraPortalPage() {
  const [role, setRole] = useState<'umkm' | 'pengelola'>('umkm');
  const [merchantId, setMerchantId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !pin) {
      showToast('Harap isi No. WhatsApp / ID dan PIN.');
      return;
    }
    setIsLoggedIn(true);
    showToast(`Berhasil masuk sebagai ${role === 'umkm' ? 'Mitra UMKM' : 'Pengelola Lapangan'}!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header showBack title="MANJALAN" subtitle="Portal Mitra" />

      <main className="flex-1 pt-20 pb-24 md:pb-16 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 w-full py-4">
          {!isLoggedIn ? (
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-outline-variant/30 space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-1">
                  <img
                    src="/logo/logo-master.png"
                    alt="MANJALAN Master Logo"
                    className="w-16 h-16 rounded-2xl shadow-sm object-contain"
                  />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Ruang Kerja Lapangan Terenkripsi</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                  Masuk Mitra MANJALAN
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
                  Khusus Pelaku UMKM Perahu Kelotok, Homestay Dayak & Pengelola Balai Konservasi.
                </p>
              </div>

              {/* Role Tabs */}
              <div className="bg-surface-container rounded-xl p-1.5 flex gap-1.5" role="tablist">
                <button
                  type="button"
                  onClick={() => setRole('umkm')}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
                    role === 'umkm'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <span>UMKM & Usaha</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('pengelola')}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
                    role === 'pengelola'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">forest</span>
                  <span>Pengelola Destinasi</span>
                </button>
              </div>

              {/* Role Context Hint */}
              <div className="p-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                  {role === 'umkm' ? 'directions_boat' : 'shield'}
                </span>
                <span className="leading-relaxed">
                  {role === 'umkm'
                    ? 'Perahu Kelotok Kumai, Homestay Dayak, Kuliner Tradisional, dan Kerajinan Rotan.'
                    : 'Balai Konservasi TN Tanjung Puting, Pos Pantau Jagawana, dan Tim Tiket Dermaga.'}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm text-on-surface font-bold">
                    {role === 'umkm' ? 'No. WhatsApp Aktif / ID Mitra' : 'ID Petugas Lapangan / NIP'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-outline flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                    </span>
                    <input
                      type="text"
                      value={merchantId}
                      onChange={(e) => setMerchantId(e.target.value)}
                      placeholder={role === 'umkm' ? '+62 812-XXXX-XXXX / ID: KLTK-01' : 'TNTP-XXXX-XXXX'}
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm text-on-surface font-bold">
                      PIN Keamanan (6 Digit)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-xs text-primary font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showPin ? 'visibility_off' : 'visibility'}
                      </span>
                      <span>{showPin ? 'Tutup' : 'Lihat'}</span>
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-outline flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </span>
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={6}
                      placeholder="••••••"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none tracking-widest focus:border-primary transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                    />
                    <span className="text-on-surface-variant font-medium">Ingat saya</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); showToast('Hubungi pengawas Balai TNTP atau Admin.'); }}
                    className="text-primary font-bold hover:underline"
                  >
                    Lupa PIN?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:bg-primary/95 active:scale-[0.99] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  <span>Masuk Ruang Kerja</span>
                </button>
              </form>
            </div>
          ) : (
            /* Logged in Dashboard */
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-outline-variant/30 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-xs font-bold text-secondary">
                    Status: Mitra Aktif Lapangan
                  </span>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-xs text-error font-bold hover:underline"
                >
                  Keluar
                </button>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface">
                  {role === 'umkm' ? 'Kelotok Berkah Sekonyer' : 'Balai TNTP Pos Kumai'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">ID Kredensial: {merchantId}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block text-xs">Verifikasi QRIS</span>
                  <strong className="text-primary font-bold text-sm sm:text-base mt-0.5 block">
                    Aktif & Valid
                  </strong>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block text-xs">Ketersediaan Trip</span>
                  <strong className="text-secondary font-bold text-sm sm:text-base mt-0.5 block">
                    Siap Berlayar
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                <strong>Sinkronisasi Offline Berhasil:</strong> Data tarif dan kontak Anda telah didistribusikan ke Travel Pack wisatawan yang berkunjung minggu ini.
              </div>

              <button
                onClick={() => showToast('Pembaruan status operasional berhasil disinkronkan ke cloud.')}
                className="w-full h-11 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">sync</span>
                <span>Sinkronkan Status Terkini</span>
              </button>
            </div>
          )}

          {/* Tourist switch note */}
          <div className="mt-6 p-4 bg-surface-container-low rounded-xl text-center space-y-1.5 border border-outline-variant/20">
            <p className="text-xs text-on-surface-variant">
              Wisatawan tidak perlu login. Akses langsung tersimpan di cache IndexedDB browser Anda.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-primary font-bold text-xs hover:underline"
            >
              <span>Masuk sebagai Wisatawan</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="text-center pt-4 text-outline text-xs">
            <p>MANJALAN Partner OS • Terenkripsi</p>
          </div>
        </div>
      </main>

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-sm w-[90%] z-50 p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2.5 text-xs animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <p>{toastMessage}</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
