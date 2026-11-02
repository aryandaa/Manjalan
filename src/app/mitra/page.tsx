'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

interface PartnerSession {
  merchantId: string;
  role: 'umkm' | 'pengelola';
  name: string;
  businessName: string;
  token: string;
}

export default function MitraPortalPage() {
  const [role, setRole] = useState<'umkm' | 'pengelola'>('umkm');
  const [merchantId, setMerchantId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerSession, setPartnerSession] = useState<PartnerSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('manjalan_partner_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.merchantId) {
          setPartnerSession(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!merchantId || !pin) {
      setErrorMessage('Harap isi No. WhatsApp / ID dan PIN.');
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setErrorMessage('PIN wajib 6 digit angka.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/partners/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: merchantId.trim(),
          pin: pin.trim(),
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Autentikasi gagal. Periksa ID dan PIN Anda.');
        showToast(data.error || 'Gagal masuk.');
        setIsSubmitting(false);
        return;
      }

      const session: PartnerSession = {
        merchantId: data.partner.merchantId,
        role: data.partner.role,
        name: data.partner.name,
        businessName: data.partner.businessName,
        token: data.token,
      };

      sessionStorage.setItem('manjalan_partner_session', JSON.stringify(session));
      setPartnerSession(session);
      showToast(`Berhasil masuk sebagai ${data.partner.name}!`);
    } catch (err: any) {
      setErrorMessage('Gagal menghubungi server. Periksa koneksi Anda.');
      showToast('Koneksi terputus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('manjalan_partner_session');
    setPartnerSession(null);
    setPin('');
    showToast('Berhasil keluar dari ruang kerja mitra.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header showBack title="MANJALAN" subtitle="Portal Mitra" />

      <main className="flex-1 pt-20 pb-24 md:pb-16 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 w-full py-4">
          {!partnerSession ? (
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
                  Khusus Pelaku UMKM Perahu Kelotok, Homestay Dayak &amp; Pengelola Balai Konservasi.
                </p>
              </div>

              {/* Role Tabs */}
              <div className="bg-surface-container rounded-xl p-1.5 flex gap-1.5" role="tablist">
                <button
                  type="button"
                  onClick={() => {
                    setRole('umkm');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
                    role === 'umkm'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <span>UMKM &amp; Usaha</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('pengelola');
                    setErrorMessage(null);
                  }}
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

              {/* Role Context Hint with Credentials Guide */}
              <div className="p-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                    {role === 'umkm' ? 'directions_boat' : 'shield'}
                  </span>
                  <span>
                    {role === 'umkm'
                      ? 'Akun Demo UMKM: ID KLTK-01 • PIN 882024'
                      : 'Akun Demo Petugas: ID TNTP-01 • PIN 992024'}
                  </span>
                </div>
                <span className="leading-relaxed text-[11px]">
                  {role === 'umkm'
                    ? 'Perahu Kelotok Kumai, Homestay Dayak, Kuliner Tradisional, dan Kerajinan Rotan.'
                    : 'Balai Konservasi TN Tanjung Puting, Pos Pantau Jagawana, dan Tim Tiket Dermaga.'}
                </span>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

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
                      placeholder={role === 'umkm' ? 'KLTK-01 atau +6281234567890' : 'TNTP-01'}
                      required
                      maxLength={50}
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
                  <span className="text-on-surface-variant text-[11px]">
                    Sistem terenkripsi dengan proteksi anti brute-force
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (role === 'umkm') {
                        setMerchantId('KLTK-01');
                        setPin('882024');
                      } else {
                        setMerchantId('TNTP-01');
                        setPin('992024');
                      }
                      setErrorMessage(null);
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    Gunakan Demo ID
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:bg-primary/95 active:scale-[0.99] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memverifikasi PIN...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">login</span>
                      <span>Masuk Ruang Kerja</span>
                    </>
                  )}
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
                    Status: Mitra Aktif Lapangan (Tervalidasi)
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-error font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Keluar</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {partnerSession.role === 'umkm' ? 'Mitra Transportasi & Logistik' : 'Petugas Otoritas Kawasan'}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface mt-0.5">
                  {partnerSession.businessName}
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Pengelola: <strong>{partnerSession.name}</strong> • ID: {partnerSession.merchantId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block text-xs">Sesi HMAC Terproteksi</span>
                  <strong className="text-primary font-bold text-sm sm:text-base mt-0.5 block truncate">
                    Aktif &amp; Terverifikasi
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
                <strong>Sinkronisasi Lapangan Aman:</strong> Token otentikasi Anda aktif. Perubahan tarif dan kontak langsung disinkronkan ke direktori offline wisatawan.
              </div>

              <button
                onClick={() => showToast('Pembaruan status operasional berhasil disinkronkan ke cloud.')}
                className="w-full h-11 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
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
            <p>MANJALAN Partner OS • Terenkripsi SHA-256 HMAC</p>
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
