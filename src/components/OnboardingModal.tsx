'use client';

import React, { useState, useEffect } from 'react';

export default function OnboardingModal() {
  const [stage, setStage] = useState<'prompt' | 'guide' | null>(null);

  useEffect(() => {
    // Check if the user has already seen or dismissed the onboarding
    const hasSeen = localStorage.getItem('manjalan_onboarding_shown');
    if (!hasSeen) {
      // Small timeout for smooth entry animation after page load
      const timer = setTimeout(() => {
        setStage('prompt');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('manjalan_onboarding_shown', 'true');
    setStage(null);
  };

  const handleOpenGuide = () => {
    localStorage.setItem('manjalan_onboarding_shown', 'true');
    setStage('guide');
  };

  if (!stage) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      
      {/* POPUP 1: Pertanyaan / Penawaran Panduan */}
      {stage === 'prompt' && (
        <div className="bg-surface max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-outline-variant/30 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
            <img
              src="/logo/app-icon.png"
              alt="MANJALAN Icon"
              className="w-10 h-10 object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
              Selamat Datang di MANJALAN!
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Platform kesiapan ekspedisi hutan tropis & susur sungai Kalimantan Tengah. Apakah Anda membutuhkan panduan singkat cara menggunakan fitur web ini?
            </p>
          </div>

          <div className="flex items-center gap-3 w-full pt-2">
            <button
              onClick={handleDismiss}
              className="flex-1 h-12 rounded-2xl bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm hover:bg-surface-container-highest active:scale-95 transition-all"
            >
              Tidak Perlu
            </button>
            <button
              onClick={handleOpenGuide}
              className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Ya, Baca Panduan</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* POPUP 2: Panduan Lengkap Cara Menggunakan Web */}
      {stage === 'guide' && (
        <div className="bg-surface max-w-lg w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-outline-variant/30 flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface">
                  Panduan Singkat MANJALAN
                </h3>
                <span className="text-[11px] text-on-surface-variant">
                  4 Langkah Kesiapan Ekspedisi Lapangan
                </span>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* 4 Feature Guide Cards */}
          <div className="flex flex-col gap-3">
            
            {/* Guide 1: Peta Interaktif */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">map</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-xs sm:text-sm text-on-surface">
                  1. Peta Interaktif & Rute Singgah
                </h4>
                <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Buka menu <strong>Peta</strong> untuk mengaktifkan GPS Anda, menghitung jarak tempuh perahu kelotok, serta merencanakan titik singgah warung apung dan pos jagawana.
                </p>
              </div>
            </div>

            {/* Guide 2: Smart Budget Planner */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">calculate</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-xs sm:text-sm text-on-surface">
                  2. Smart Budget & Kalkulator Tunai
                </h4>
                <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Hitung sewa kelotok, tiket simaksi, dan ketahui estimasi uang tunai fisik yang wajib ditarik sebelum memasuki area sungai tanpa sinyal (blankspot).
                </p>
              </div>
            </div>

            {/* Guide 3: Travel Pack Offline */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-xs sm:text-sm text-on-surface">
                  3. Unduh Travel Pack (100% Offline)
                </h4>
                <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Klik <strong>Unduh Travel Pack</strong> di halaman destinasi untuk menyimpan panduan jalur dan frekuensi radio darurat (VHF Ch-16) ke memori browser tanpa butuh kuota.
                </p>
              </div>
            </div>

            {/* Guide 4: Direktori UMKM */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">storefront</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-xs sm:text-sm text-on-surface">
                  4. Direktori UMKM & Pembayaran
                </h4>
                <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Cek kepastian metode pembayaran (QRIS vs Tunai) dan hubungi langsung nahkoda kelotok atau pengrajin lokal Kalimantan Tengah.
                </p>
              </div>
            </div>

          </div>

          {/* Action CTA Button */}
          <button
            onClick={handleDismiss}
            className="w-full h-12 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 mt-1"
          >
            <span>Mengerti & Mulai Jelajah</span>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </button>
        </div>
      )}

    </div>
  );
}
