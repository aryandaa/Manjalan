import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header title="MANJALAN" subtitle="404" />

      <main className="flex-1 pt-24 pb-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-md flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">explore_off</span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Jalur Tidak Ditemukan (404)
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface mt-1">
              Tersesat di Luar Jalur?
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Halaman atau tautan yang Anda tuju tidak tersedia atau rute telah dialihkan.
            </p>
          </div>

          <Link
            href="/"
            className="w-full h-11 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Kembali ke Beranda MANJALAN</span>
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
