'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { getDestinations } from '@/lib/indexeddb';
import { Destination } from '@/types';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    getDestinations().then(setDestinations);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header showBack subtitle="Semua Destinasi" />

      <main className="flex-1 pt-24 pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5 md:mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">
              Jelajahi Kalimantan Tengah
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-on-surface">
              Semua Destinasi
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              {destinations.length} pilihan wisata untuk perjalanan Anda
            </p>
          </div>

          <div
            aria-label="Semua destinasi wisata"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
          >
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                href={`/destinasi/${destination.id}`}
                className="group min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-surface-container overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 sm:left-3 sm:top-3 max-w-[calc(100%-1rem)] truncate rounded-full bg-black/60 px-2 py-1 text-[10px] sm:text-xs font-bold text-white backdrop-blur-sm">
                    {destination.categories[0]}
                  </span>
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="text-sm sm:text-base font-extrabold leading-snug text-on-surface line-clamp-2">
                    {destination.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      location_on
                    </span>
                    <span className="truncate">{destination.location}</span>
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-primary">
                    Lihat destinasi
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
