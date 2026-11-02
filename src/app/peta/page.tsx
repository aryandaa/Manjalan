'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

// Dynamically import MapComponent to prevent SSR window issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-surface gap-3">
      <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary animate-bounce">
        <span className="material-symbols-outlined text-[28px]">explore</span>
      </div>
      <span className="text-sm font-bold text-on-surface">Memuat Peta Ekspedisi...</span>
      <span className="text-xs text-on-surface-variant">Menyiapkan rute sungai & titik koordinat offline</span>
    </div>
  ),
});

export default function PetaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header title="MANJALAN" subtitle="Peta Interaktif" />

      <main className="flex-1 pt-16 pb-16 md:pb-0">
        <MapComponent />
      </main>

      <BottomNav />
    </div>
  );
}
