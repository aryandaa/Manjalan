'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { ManagedPlace } from '@/types';

interface PartnerSession {
  merchantId: string;
  role: 'umkm' | 'pengelola';
  name: string;
  businessName: string;
  token: string;
}

export default function MitraPortalPage() {
  // Visitor Mode: 'login' (Masuk Akun) | 'register' (Ajukan Kemitraan Baru)
  const [visitorMode, setVisitorMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [role, setRole] = useState<'umkm' | 'pengelola'>('umkm');
  const [merchantId, setMerchantId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerSession, setPartnerSession] = useState<PartnerSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Partnership Request form state (Wisatawan -> Pengajuan Mitra)
  const [regType, setRegType] = useState<'umkm' | 'destinasi'>('umkm');
  const [regApplicant, setRegApplicant] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState('Perahu Kelotok Safari');
  const [regLocation, setRegLocation] = useState('');
  const [regDescription, setRegDescription] = useState('');
  const [regPriceRange, setRegPriceRange] = useState('');
  const [regDesiredPin, setRegDesiredPin] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Registration Submitted Dialog State
  const [regSuccessModal, setRegSuccessModal] = useState<{
    whatsapp: string;
    pin: string;
    applicant: string;
    businessName: string;
  } | null>(null);

  // Managed Places State (1 Owner -> Many Places)
  const [myPlaces, setMyPlaces] = useState<ManagedPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  // Edit Place Modal State
  const [editingPlace, setEditingPlace] = useState<ManagedPlace | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Add Place Request Modal State (Existing Owner requesting an additional venue)
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState('Kuliner Tradisional');
  const [newPlaceLocation, setNewPlaceLocation] = useState('');
  const [newPlaceDescription, setNewPlaceDescription] = useState('');
  const [newPlacePrice, setNewPlacePrice] = useState('');
  const [isSubmittingNewPlace, setIsSubmittingNewPlace] = useState(false);

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

  const loadMyPlaces = useCallback(async () => {
    if (!partnerSession) return;
    setIsLoadingPlaces(true);
    try {
      const res = await fetch(`/api/partners/places?owner=${encodeURIComponent(partnerSession.merchantId)}`);
      const data = await res.json();
      if (data.success) {
        setMyPlaces(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPlaces(false);
    }
  }, [partnerSession]);

  // Fetch places owned by this manager whenever session is active
  useEffect(() => {
    if (partnerSession) {
      loadMyPlaces();
    }
  }, [partnerSession, loadMyPlaces]);

  // Submit Login
  const handleLogin = async (e: React.FormEvent) => {
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

  // Submit New Partnership Request (Wisatawan/Calon Mitra)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regApplicant || !regWhatsapp || !regBusinessName || !regDescription || !regDesiredPin) {
      setErrorMessage('Harap lengkapi semua kolom wajib termasuk PIN 6 digit.');
      return;
    }

    if (!/^\d{6}$/.test(regDesiredPin)) {
      setErrorMessage('PIN Keamanan wajib tepat 6 digit angka.');
      return;
    }

    setIsSubmittingReg(true);

    try {
      const res = await fetch('/api/partners/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: regType,
          applicantName: regApplicant.trim(),
          whatsapp: regWhatsapp.trim(),
          businessName: regBusinessName.trim(),
          category: regCategory.trim(),
          location: regLocation.trim() || 'Kalimantan Tengah',
          description: regDescription.trim(),
          priceRange: regPriceRange.trim() || 'Standar Lapangan',
          desiredPin: regDesiredPin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal mengirim pengajuan.');
        showToast(data.error || 'Gagal mengirim.');
        setIsSubmittingReg(false);
        return;
      }

      showToast('Pengajuan kemitraan terkirim! Menunggu persetujuan (ACC) petugas.');
      
      // Save data for success confirmation dialog
      setRegSuccessModal({
        whatsapp: regWhatsapp.trim(),
        pin: regDesiredPin.trim(),
        applicant: regApplicant.trim(),
        businessName: regBusinessName.trim(),
      });

      // Reset form & switch to login tab with pre-filled ID
      setMerchantId(regWhatsapp.trim());
      setPin(regDesiredPin.trim());
      setVisitorMode('login');
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage('Gagal mengirim pengajuan ke server.');
      showToast('Koneksi terputus.');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Existing Owner submits request to add a new place under their account
  const handleAddPlaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerSession) return;

    if (!newPlaceName || !newPlaceDescription) {
      showToast('Harap isi nama tempat dan deskripsi.');
      return;
    }

    setIsSubmittingNewPlace(true);

    try {
      const res = await fetch('/api/partners/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${partnerSession.token}`,
        },
        body: JSON.stringify({
          type: partnerSession.role === 'umkm' ? 'umkm' : 'destinasi',
          name: newPlaceName.trim(),
          category: newPlaceCategory,
          categoryLabel: newPlaceCategory,
          location: newPlaceLocation.trim() || 'Kalimantan Tengah',
          description: newPlaceDescription.trim(),
          priceRange: newPlacePrice.trim() || 'Standar Lapangan',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal mengajukan tempat baru.');
        setIsSubmittingNewPlace(false);
        return;
      }

      showToast('Pengajuan tempat baru terkirim ke antrean ACC Petugas!');
      setShowAddPlaceModal(false);
      setNewPlaceName('');
      setNewPlaceDescription('');
      setNewPlacePrice('');
      setNewPlaceLocation('');
    } catch (e) {
      showToast('Gagal menghubungi server.');
    } finally {
      setIsSubmittingNewPlace(false);
    }
  };

  // Owner edits place
  const handleSavePlaceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerSession || !editingPlace) return;

    setIsSavingEdit(true);

    try {
      const res = await fetch(`/api/partners/places/${editingPlace.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${partnerSession.token}`,
        },
        body: JSON.stringify({
          name: editingPlace.name,
          description: editingPlace.description,
          priceRange: editingPlace.priceRange,
          hasQris: editingPlace.hasQris,
          needsCash: editingPlace.needsCash,
          whatsapp: editingPlace.whatsapp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal menyimpan perubahan.');
        setIsSavingEdit(false);
        return;
      }

      showToast('Informasi tempat berhasil diperbarui.');
      setEditingPlace(null);
      await loadMyPlaces();
    } catch (e) {
      showToast('Gagal menghubungi server.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Owner deletes place
  const handleDeletePlace = async (placeId: string, placeName: string) => {
    if (!partnerSession) return;
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${placeName}" dari akun Anda?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/partners/places/${placeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${partnerSession.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal menghapus tempat.');
        return;
      }

      showToast(`Tempat "${placeName}" berhasil dihapus.`);
      await loadMyPlaces();
    } catch (e) {
      showToast('Gagal menghubungi server.');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full py-4">
          
          {/* ============================================================== */}
          {/* SECTION 1: VISITOR VIEW (Belum Login: Masuk OR Ajukan Kemitraan) */}
          {/* ============================================================== */}
          {!partnerSession ? (
            <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-outline-variant/30 space-y-6">
              
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
                  <span>Ruang Kerja Ekosistem Kemitraan</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                  Portal Mitra MANJALAN
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
                  Kelola armada kelotok, warung apung, homestay, atau ajukan destinasi wisata baru Anda.
                </p>
              </div>

              {/* Mode Switcher: Masuk Akun vs Ajukan Kemitraan Baru */}
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-surface-container-high gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setVisitorMode('login');
                    setErrorMessage(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
                    visitorMode === 'login'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Masuk Ruang Kerja</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVisitorMode('register');
                    setErrorMessage(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
                    visitorMode === 'register'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">add_business</span>
                  <span>Ajukan Kemitraan Baru</span>
                </button>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: FORM LOGIN */}
              {visitorMode === 'login' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Role Tabs */}
                  <div className="bg-surface-container rounded-xl p-1 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setRole('umkm');
                        setErrorMessage(null);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                        role === 'umkm'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">storefront</span>
                      <span>UMKM &amp; Usaha</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('pengelola');
                        setErrorMessage(null);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                        role === 'pengelola'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">forest</span>
                      <span>Pengelola Destinasi</span>
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-on-surface">
                        {role === 'umkm' ? 'No. WhatsApp / ID Mitra' : 'ID Pengelola Destinasi'}
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-outline pointer-events-none">
                          <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                        </span>
                        <input
                          type="text"
                          value={merchantId}
                          onChange={(e) => setMerchantId(e.target.value)}
                          placeholder={role === 'umkm' ? 'Masukkan No. WhatsApp / ID Mitra' : 'Masukkan ID Pengelola'}
                          required
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-on-surface">PIN Keamanan (6 Digit)</label>
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
                        <span className="absolute left-3.5 text-outline pointer-events-none">
                          <span className="material-symbols-outlined text-[20px]">lock</span>
                        </span>
                        <input
                          type={showPin ? 'text' : 'password'}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          maxLength={6}
                          placeholder="••••••"
                          required
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none tracking-widest focus:border-primary transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-on-surface-variant text-[11px]">Sesi Terenkripsi SHA-256</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:bg-primary/95 active:scale-[0.99] transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Memverifikasi...</span>
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
              )}

              {/* TAB 2: FORM AJUKAN KEMITRAAN BARU */}
              {visitorMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
                    <span>
                      Wisatawan atau pengusaha lokal dapat mengajukan tempat/layanan di sini. Setelah di-<strong>ACC</strong> oleh Petugas, akun mitra Anda akan aktif otomatis dengan ID No. WhatsApp dan PIN 6 digit ini.
                    </span>
                  </div>

                  {/* Jenis Kemitraan */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface">Jenis Kemitraan</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegType('umkm')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          regType === 'umkm'
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-surface-container-low text-on-surface border-outline-variant/40'
                        }`}
                      >
                        UMKM / Usaha Wisata
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegType('destinasi')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          regType === 'destinasi'
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-surface-container-low text-on-surface border-outline-variant/40'
                        }`}
                      >
                        Pengelola Destinasi
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-on-surface">Nama Penanggung Jawab</label>
                      <input
                        type="text"
                        value={regApplicant}
                        onChange={(e) => setRegApplicant(e.target.value)}
                        placeholder="Contoh: Pak Darman"
                        required
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-on-surface">
                        Nomor WhatsApp Aktif (ID Login)
                      </label>
                      <input
                        type="tel"
                        value={regWhatsapp}
                        onChange={(e) => setRegWhatsapp(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        required
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface">
                      {regType === 'umkm' ? 'Nama Usaha / Kapal / Homestay' : 'Nama Destinasi Wisata'}
                    </label>
                    <input
                      type="text"
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      placeholder={regType === 'umkm' ? 'Contoh: Kelotok Rimba Borneo 02' : 'Contoh: Ekowisata Danau Gambut Bulat'}
                      required
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-on-surface">Kategori Layanan</label>
                      <input
                        type="text"
                        value={regCategory}
                        onChange={(e) => setRegCategory(e.target.value)}
                        placeholder="Contoh: Perahu Kelotok / Kuliner / Homestay"
                        required
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-on-surface">Lokasi / Dermaga</label>
                      <input
                        type="text"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        placeholder="Contoh: Dermaga Kumai, Kobar"
                        required
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-on-surface">Estimasi Tarif / Harga</label>
                      <input
                        type="text"
                        value={regPriceRange}
                        onChange={(e) => setRegPriceRange(e.target.value)}
                        placeholder="Contoh: Rp 2.000.000 / hari"
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-on-surface">
                        PIN Keamanan Diinginkan (6 Digit)
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        value={regDesiredPin}
                        onChange={(e) => setRegDesiredPin(e.target.value)}
                        placeholder="6 digit angka rahasia"
                        required
                        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface">Deskripsi Layanan &amp; Fasilitas</label>
                    <textarea
                      rows={2}
                      value={regDescription}
                      onChange={(e) => setRegDescription(e.target.value)}
                      placeholder="Jelaskan kapasitas penumpang, fasilitas kelotok / homestay, dll."
                      required
                      className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReg}
                    className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-primary/95 active:scale-[0.99] transition-all disabled:opacity-70"
                  >
                    {isSubmittingReg ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Mengirim Pengajuan...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        <span>Kirim Pengajuan Kemitraan</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Tourist Back Note */}
              <div className="pt-2 text-center">
                <Link href="/" className="inline-flex items-center gap-1 text-primary font-bold text-xs hover:underline">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Kembali ke Beranda Wisatawan</span>
                </Link>
              </div>

            </div>
          ) : (
            /* ============================================================== */
            /* SECTION 2: PENGELOLA DASHBOARD (Logged In: 1 Akun -> Banyak Tempat) */
            /* ============================================================== */
            <div className="space-y-6 animate-fade-in">
              
              {/* Profile Card */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-md border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Akun Pengelola Terverifikasi
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-on-surface">
                    {partnerSession.businessName}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Penanggung Jawab: <strong>{partnerSession.name}</strong> • ID Akun: <span className="font-mono text-primary font-bold">{partnerSession.merchantId}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowAddPlaceModal(true)}
                    className="h-11 px-4 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                    <span>+ Ajukan Tempat Baru</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="h-11 px-3.5 rounded-xl bg-surface-container text-error text-xs font-bold flex items-center gap-1 hover:bg-red-50 border border-outline-variant/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </div>
              </div>

              {/* 1 Akun Mengelola Banyak Tempat - Rules Info Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">check_circle</span>
                <div className="leading-relaxed">
                  <strong>Struktur Kepemilikan 1-ke-Banyak:</strong> Akun ini dapat mengelola <strong>banyak tempat</strong> (armada perahu, homestay, atau destinasi). Setiap tempat hanya dapat diubah dan dihapus oleh akun Anda. Jika ingin menambahkan tempat baru di bawah akun ini, klik <strong>+ Ajukan Tempat Baru</strong> untuk mendapatkan persetujuan (ACC) Petugas.
                </div>
              </div>

              {/* Tempat yang Dikelola */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
                    <span>Tempat yang Dikelola Akun Anda</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-xs font-extrabold">
                      {myPlaces.length} Tempat
                    </span>
                  </h3>
                  <button
                    onClick={loadMyPlaces}
                    disabled={isLoadingPlaces}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Segarkan</span>
                  </button>
                </div>

                {isLoadingPlaces ? (
                  <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-xs text-on-surface-variant mt-2">Memuat tempat Anda...</p>
                  </div>
                ) : myPlaces.length === 0 ? (
                  <div className="p-10 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 text-on-surface-variant space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center mx-auto text-outline">
                      <span className="material-symbols-outlined text-[26px]">storefront</span>
                    </div>
                    <p className="text-sm font-bold text-on-surface">Belum ada tempat aktif yang dikelola.</p>
                    <p className="text-xs max-w-sm mx-auto">
                      Klik tombol <strong>+ Ajukan Tempat Baru</strong> di atas untuk mendaftarkan perahu kelotok atau usaha wisata Anda.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-all group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start gap-3.5">
                            <img
                              src={place.image}
                              alt={place.name}
                              className="w-20 h-20 rounded-2xl object-cover bg-surface-container shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                {place.categoryLabel}
                              </span>
                              <h4 className="font-extrabold text-base text-on-surface truncate">
                                {place.name}
                              </h4>
                              <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                                {place.location}
                              </p>
                              <p className="text-xs text-secondary font-bold mt-1">
                                {place.priceRange}
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed bg-surface-container-low p-2.5 rounded-xl">
                            {place.description}
                          </p>

                          {/* Payment Readiness Chips */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            {place.hasQris ? (
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">qr_code_2</span>
                                QRIS Siap
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border font-semibold">
                                Tanpa QRIS
                              </span>
                            )}
                            {place.needsCash && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">payments</span>
                                Tunai
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions for this Place: Edit & Delete */}
                        <div className="pt-2.5 border-t border-outline-variant/20 flex items-center gap-2">
                          <button
                            onClick={() => setEditingPlace(place)}
                            className="flex-1 h-10 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            <span>Edit Informasi</span>
                          </button>

                          <button
                            onClick={() => handleDeletePlace(place.id, place.name)}
                            className="h-10 px-3 rounded-xl bg-surface-container text-error hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1 transition-colors active:scale-95"
                            title="Hapus tempat ini"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ============================================================== */}
      {/* MODAL 1: EDIT PLACE INFORMATION */}
      {/* ============================================================== */}
      {editingPlace && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="font-extrabold text-base sm:text-lg text-on-surface">
                Edit Informasi: {editingPlace.name}
              </h3>
              <button
                onClick={() => setEditingPlace(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePlaceEdit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Nama Tempat / Layanan</label>
                <input
                  type="text"
                  value={editingPlace.name}
                  onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Deskripsi Layanan</label>
                <textarea
                  rows={3}
                  value={editingPlace.description}
                  onChange={(e) => setEditingPlace({ ...editingPlace, description: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Kisaran Tarif / Harga</label>
                  <input
                    type="text"
                    value={editingPlace.priceRange}
                    onChange={(e) => setEditingPlace({ ...editingPlace, priceRange: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Nomor WhatsApp Booking</label>
                  <input
                    type="tel"
                    value={editingPlace.whatsapp}
                    onChange={(e) => setEditingPlace({ ...editingPlace, whatsapp: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              {/* Payment Methods Checkboxes */}
              <div className="p-3 bg-surface-container-low rounded-xl space-y-2">
                <span className="text-xs font-bold text-on-surface block">Kesiapan Pembayaran:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlace.hasQris}
                      onChange={(e) => setEditingPlace({ ...editingPlace, hasQris: e.target.checked })}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span>QRIS Tersedia</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlace.needsCash}
                      onChange={(e) => setEditingPlace({ ...editingPlace, needsCash: e.target.checked })}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span>Uang Tunai Diperlukan</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlace(null)}
                  className="flex-1 h-11 rounded-xl bg-surface-container text-xs font-bold text-on-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex-1 h-11 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: AJUKAN TEMPAT BARU (Di Bawah Akun Yang Sama) */}
      {/* ============================================================== */}
      {showAddPlaceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface">
                  Ajukan Tempat Baru
                </h3>
                <p className="text-[11px] text-on-surface-variant">
                  Tempat baru ini akan berada di bawah akun <strong>{partnerSession?.merchantId}</strong> setelah di-ACC Petugas.
                </p>
              </div>
              <button
                onClick={() => setShowAddPlaceModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddPlaceSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Nama Tempat / Armada Baru</label>
                <input
                  type="text"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  placeholder="Contoh: Kelotok Wisata Berkah 02 atau Homestay Apung"
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Kategori Layanan</label>
                  <input
                    type="text"
                    value={newPlaceCategory}
                    onChange={(e) => setNewPlaceCategory(e.target.value)}
                    placeholder="Contoh: Kelotok / Kuliner / Homestay"
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Lokasi</label>
                  <input
                    type="text"
                    value={newPlaceLocation}
                    onChange={(e) => setNewPlaceLocation(e.target.value)}
                    placeholder="Contoh: Dermaga Kumai"
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Estimasi Tarif / Harga</label>
                <input
                  type="text"
                  value={newPlacePrice}
                  onChange={(e) => setNewPlacePrice(e.target.value)}
                  placeholder="Contoh: Rp 1.800.000 / hari"
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Deskripsi Layanan &amp; Keunggulan</label>
                <textarea
                  rows={3}
                  value={newPlaceDescription}
                  onChange={(e) => setNewPlaceDescription(e.target.value)}
                  placeholder="Jelaskan fasilitas tempat atau armada baru Anda..."
                  required
                  className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Alur Persetujuan (ACC):</strong> Pengajuan ini akan langsung masuk ke antrean verifikasi Petugas Balai/Pengelola. Saat disetujui, tempat ini langsung aktif otomatis di daftar kelola akun Anda.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlaceModal(false)}
                  className="flex-1 h-11 rounded-xl bg-surface-container text-xs font-bold text-on-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewPlace}
                  className="flex-1 h-11 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmittingNewPlace ? 'Mengirim...' : 'Kirim ke Petugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Submitted Success Dialog */}
      {regSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface">
                  Pendaftaran Mitra Terkirim!
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Permohonan masuk ke antrean verifikasi Petugas Balai.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2.5 text-xs">
              <p className="font-bold text-on-surface">Kredensial Akun yang Didaftarkan:</p>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Usaha / Destinasi:</span>
                <span className="font-bold text-on-surface">{regSuccessModal.businessName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">ID Login (No. WhatsApp):</span>
                <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-sm">
                  {regSuccessModal.whatsapp}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">PIN Keamanan (6 Digit):</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-sm tracking-wider">
                  {regSuccessModal.pin}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Alur Aktivasi Akun (ACC):</span>
              </p>
              <p className="text-[11px] text-amber-900/90">
                Begitu Petugas Otoritas menyetujui (ACC) pengajuan Anda, akun Anda langsung aktif otomatis. Petugas juga dapat mengirimkan konfirmasi via WhatsApp ke nomor Anda.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRegSuccessModal(null)}
              className="w-full h-11 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/95 transition-all"
            >
              Saya Paham &amp; Siap Masuk
            </button>
          </div>
        </div>
      )}

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
