'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function Header({ subtitle, showBack = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [showSimNotice, setShowSimNotice] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('manjalan_offline_simulation');
    if (saved === 'true') {
      setIsOfflineSimulated(true);
    }
  }, []);

  const toggleOfflineSimulation = () => {
    const nextVal = !isOfflineSimulated;
    setIsOfflineSimulated(nextVal);
    localStorage.setItem('manjalan_offline_simulation', String(nextVal));
    setShowSimNotice(true);
    setTimeout(() => setShowSimNotice(false), 3000);
  };

  const navLinks = [
    { name: 'Beranda', href: '/', icon: 'explore' },
    { name: 'Peta Interaktif', href: '/peta', icon: 'map' },
    { name: 'Smart Budget', href: '/budget', icon: 'account_balance_wallet' },
    { name: 'Travel Pack', href: '/pack', icon: 'cloud_download', hasDot: true },
    { name: 'Direktori UMKM', href: '/umkm', icon: 'storefront' },
    { name: 'Portal Mitra', href: '/mitra', icon: 'handshake' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand / Back Button */}
          <div className="flex items-center gap-3 min-w-0">
            {showBack && (
              <button
                onClick={() => router.back()}
                aria-label="Kembali"
                className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
              <img
                src="/logo/logo-horizontal.png"
                alt="MANJALAN Logo"
                className="h-8 sm:h-9 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
              {subtitle && (
                <div className="hidden sm:flex items-center pl-2.5 border-l border-outline-variant/40">
                  <span className="font-body-sm text-xs font-semibold text-on-surface-variant truncate">
                    {subtitle}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop & Tablet Navigation Menu (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.hasDot && (
                    <span className="w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Offline Readiness Switcher Pill */}
            <button
              onClick={toggleOfflineSimulation}
              title="Klik untuk simulasi mode tanpa sinyal di pedalaman"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                isOfflineSimulated
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-secondary-container/40 text-secondary border border-secondary-container'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOfflineSimulated ? 'bg-amber-600' : 'bg-secondary animate-pulse'
                }`}
              ></span>
              <span className="font-label-sm text-xs">
                {isOfflineSimulated ? 'Offline Sim' : 'Siap Offline'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Offline Toast Notification */}
      {showSimNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-sm w-[90%] z-50 p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl flex items-center gap-3 text-xs animate-bounce border border-white/10">
          <span className="material-symbols-outlined text-secondary-fixed text-[24px]">
            {isOfflineSimulated ? 'cloud_off' : 'wifi'}
          </span>
          <div>
            <p className="font-bold text-sm">
              {isOfflineSimulated ? 'Mode Offline Lapangan Aktif' : 'Mode Online Sync Aktif'}
            </p>
            <p className="text-surface-variant text-xs mt-0.5">
              {isOfflineSimulated
                ? 'Seluruh data dimuat 100% dari IndexedDB browser lokal.'
                : 'Tersambung ke database cloud Supabase.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
