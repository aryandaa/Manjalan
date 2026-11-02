'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Beranda',
      href: '/',
      icon: 'explore',
      isActive: pathname === '/',
    },
    {
      name: 'Peta',
      href: '/peta',
      icon: 'map',
      isActive: pathname.startsWith('/peta'),
    },
    {
      name: 'Budget',
      href: '/budget',
      icon: 'account_balance_wallet',
      isActive: pathname.startsWith('/budget'),
    },
    {
      name: 'Pack',
      href: '/pack',
      icon: 'cloud_download',
      isActive: pathname.startsWith('/pack'),
      hasDot: true,
    },
    {
      name: 'UMKM',
      href: '/umkm',
      icon: 'storefront',
      isActive: pathname.startsWith('/umkm'),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-space-xs">
        {navItems.map((item) => {
          const activeClass = item.isActive
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:text-on-surface';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${activeClass}`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    item.isActive ? 'scale-110 text-primary' : ''
                  } transition-transform`}
                >
                  {item.icon}
                </span>
                {item.hasDot && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
                )}
              </div>
              <span className="font-label-sm text-[11px] mt-0.5">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
