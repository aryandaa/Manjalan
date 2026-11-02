'use client';

import React, { useState, useEffect } from 'react';
import { PartnerRequest, ManagedPlace } from '@/types';

interface PetugasSession {
  officerId: string;
  name: string;
  role: string;
  agency: string;
  token: string;
}

export default function PetugasLoginPage() {
  const [officerId, setOfficerId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petugasSession, setPetugasSession] = useState<PetugasSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Petugas Dashboard State
  const [activeTab, setActiveTab] = useState<'requests' | 'directory'>('requests');
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [managedPlaces, setManagedPlaces] = useState<ManagedPlace[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rejection modal
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Check existing session
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('manjalan_petugas_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.officerId) {
          setPetugasSession(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch requests & places when logged in
  useEffect(() => {
    if (petugasSession) {
      loadDashboardData();
    }
  }, [petugasSession]);

  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch Requests
      const resReq = await fetch('/api/partners/requests');
      const dataReq = await resReq.json();
      if (dataReq.success) {
        setRequests(dataReq.data);
      }

      // 2. Fetch Places
      const resPlaces = await fetch('/api/partners/places');
      const dataPlaces = await resPlaces.json();
      if (dataPlaces.success) {
        setManagedPlaces(dataPlaces.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!officerId || !pin) {
      setErrorMessage('Harap isi ID Petugas dan PIN.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/petugas/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId: officerId.trim(), pin: pin.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Kredensial petugas tidak valid.');
        showToast(data.error || 'Gagal masuk.');
        setIsSubmitting(false);
        return;
      }

      const session: PetugasSession = {
        officerId: data.officer.officerId,
        name: data.officer.name,
        role: data.officer.role,
        agency: data.officer.agency,
        token: data.token,
      };

      sessionStorage.setItem('manjalan_petugas_session', JSON.stringify(session));
      setPetugasSession(session);
      showToast(`Selamat bertugas, ${data.officer.name}!`);
    } catch (err) {
      setErrorMessage('Gagal menghubungi server.');
      showToast('Koneksi terputus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('manjalan_petugas_session');
    setPetugasSession(null);
    setPin('');
    showToast('Berhasil keluar dari ruang kerja petugas.');
  };

  // Petugas approves (ACC) a request
  const handleApprove = async (reqId: string) => {
    if (!petugasSession) return;
    setProcessingId(reqId);

    try {
      const res = await fetch(`/api/partners/requests/${reqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${petugasSession.token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal menyetujui pengajuan.');
        return;
      }

      showToast(data.message || 'Pengajuan berhasil di-ACC! Akun mitra otomatis aktif.');
      await loadDashboardData();
    } catch (e) {
      showToast('Terjadi kesalahan saat memproses ACC.');
    } finally {
      setProcessingId(null);
    }
  };

  // Petugas rejects a request
  const handleRejectSubmit = async () => {
    if (!petugasSession || !rejectingReqId) return;
    setProcessingId(rejectingReqId);

    try {
      const res = await fetch(`/api/partners/requests/${rejectingReqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${petugasSession.token}`,
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason: rejectReason || 'Tidak memenuhi kualifikasi lapangan balai konservasi.',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal menolak pengajuan.');
        return;
      }

      showToast('Pengajuan kemitraan telah ditolak.');
      setRejectingReqId(null);
      setRejectReason('');
      await loadDashboardData();
    } catch (e) {
      showToast('Terjadi kesalahan.');
    } finally {
      setProcessingId(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      
      {/* Petugas Custom Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-2">
                <span>MANJALAN Otoritas Petugas</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-600 text-white font-black tracking-wider uppercase">
                  Internal Only
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Portal Pengawasan & Verifikasi Mitra Balai</p>
            </div>
          </div>

          {petugasSession && (
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Keluar Sesi</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 pt-20 pb-16 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-6">
          
          {/* STATE 1: Petugas Login Form */}
          {!petugasSession ? (
            <div className="max-w-md mx-auto bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-outline-variant/30 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">shield_person</span>
                </div>
                <h2 className="text-2xl font-black text-on-surface">Masuk Khusus Petugas</h2>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  Ruang kerja verifikasi pendaftaran mitra baru dan pengawasan direktori ekowisata Kalimantan Tengah.
                </p>
              </div>

              {/* Demo Hint */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">info</span>
                <div>
                  <p className="font-bold">Kredensial Demo Petugas:</p>
                  <p className="text-[11px] mt-0.5">ID: <strong>PETUGAS-01</strong> • PIN: <strong>992024</strong></p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface">
                    ID Petugas Otoritas / NIP
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-outline pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">badge</span>
                    </span>
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="PETUGAS-01 atau TNTP-01"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none focus:border-amber-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-surface">PIN Keamanan (6 Digit)</label>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-xs text-amber-700 font-bold flex items-center gap-1"
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
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none tracking-widest focus:border-amber-600 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-on-surface-variant text-[11px]">Sesi Terenkripsi Balai</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOfficerId('PETUGAS-01');
                      setPin('992024');
                      setErrorMessage(null);
                    }}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Gunakan Demo ID
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memverifikasi Kredensial...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      <span>Masuk sebagai Petugas</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* STATE 2: Petugas Dashboard */
            <div className="space-y-6 animate-fade-in">
              
              {/* Officer Banner Card */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Petugas Terverifikasi Lapangan
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">{petugasSession.name}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Instansi: <strong>{petugasSession.agency}</strong> • ID: {petugasSession.officerId}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-600 text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Antrean ACC</span>
                    <strong className="text-base font-black text-amber-400">{pendingRequests.length} Menunggu</strong>
                  </div>
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-600 text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Total Tempat</span>
                    <strong className="text-base font-black text-emerald-400">{managedPlaces.length} Terdaftar</strong>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-high w-fit">
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'requests'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Antrean Pengajuan Mitra</span>
                  {pendingRequests.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('directory')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'directory'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Direktori Pengawasan (Read-Only)</span>
                </button>
              </div>

              {/* TAB 1: Antrean Pengajuan Mitra Baru */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
                        Pengajuan Kemitraan Baru &amp; Penambahan Tempat
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Klik <strong>ACC &amp; Buat Akun Mitra</strong> untuk menyetujui pengajuan. Sistem akan otomatis membuat akun pengelola dan mendaftarkan tempat tersebut.
                      </p>
                    </div>
                    <button
                      onClick={loadDashboardData}
                      disabled={isLoadingData}
                      className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high flex items-center gap-1 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Segarkan</span>
                    </button>
                  </div>

                  {requests.length === 0 ? (
                    <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 text-on-surface-variant text-sm">
                      Belum ada permohonan kemitraan yang masuk.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {requests.map((req) => (
                        <div
                          key={req.id}
                          className={`p-5 sm:p-6 rounded-3xl border shadow-sm flex flex-col justify-between gap-4 transition-all ${
                            req.status === 'pending'
                              ? 'bg-surface-container-lowest border-amber-300'
                              : req.status === 'approved'
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-red-50/50 border-red-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    req.type === 'umkm'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  }`}
                                >
                                  {req.type === 'umkm' ? 'Permohonan UMKM' : 'Pengelola Destinasi'}
                                </span>

                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    req.status === 'pending'
                                      ? 'bg-amber-500 text-white animate-pulse'
                                      : req.status === 'approved'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-red-600 text-white'
                                  }`}
                                >
                                  {req.status === 'pending'
                                    ? 'Menunggu ACC'
                                    : req.status === 'approved'
                                    ? 'Disetujui (ACC)'
                                    : 'Ditolak'}
                                </span>
                              </div>

                              <h4 className="text-lg sm:text-xl font-black text-on-surface">
                                {req.businessName}
                              </h4>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-on-surface-variant pt-1">
                                <p>
                                  Pemohon: <strong className="text-on-surface">{req.applicantName}</strong>
                                </p>
                                <p>
                                  No. WhatsApp (ID Login):{' '}
                                  <strong className="text-primary font-mono">{req.whatsapp}</strong>
                                </p>
                                <p>
                                  Kategori: <strong className="text-on-surface">{req.category}</strong>
                                </p>
                                <p>
                                  Lokasi: <strong className="text-on-surface">{req.location}</strong>
                                </p>
                                {req.priceRange && (
                                  <p>
                                    Estimasi Tarif: <strong className="text-secondary font-bold">{req.priceRange}</strong>
                                  </p>
                                )}
                              </div>

                              <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface leading-relaxed mt-2">
                                <strong>Deskripsi Layanan:</strong> {req.description}
                              </div>

                              {req.rejectionReason && (
                                <p className="text-xs text-red-700 font-semibold mt-1">
                                  Alasan Penolakan: {req.rejectionReason}
                                </p>
                              )}
                            </div>

                            {/* Actions if still pending */}
                            {req.status === 'pending' && (
                              <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  disabled={processingId === req.id}
                                  className="flex-1 sm:flex-initial h-11 px-4 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                  <span>{processingId === req.id ? 'Memproses...' : 'ACC & Buat Akun'}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setRejectingReqId(req.id);
                                    setRejectReason('');
                                  }}
                                  disabled={processingId === req.id}
                                  className="h-11 px-4 rounded-xl bg-surface-container text-error text-xs sm:text-sm font-bold flex items-center justify-center gap-1 hover:bg-red-50 border border-outline-variant/30 active:scale-95 transition-all"
                                >
                                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                                  <span>Tolak</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Direktori Pengawasan Tempat (Read-Only) */}
              {activeTab === 'directory' && (
                <div className="space-y-4">
                  {/* Strict Read-Only Authority Notice */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0">policy</span>
                    <div className="leading-relaxed">
                      <strong>Kebijakan Otoritas Pengawasan:</strong> Petugas hanya memiliki hak pengawasan <em>(Read-Only)</em> terhadap destinasi dan UMKM yang terdaftar. Demi integritas hak milik mitra, petugas <strong>tidak dapat mengubah atau menghapus data tempat</strong> secara sepihak. Perubahan dan penghapusan hanya bisa dilakukan oleh pengelola resmi dari tempat bersangkutan.
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
                      Seluruh Tempat Terdaftar di Platform ({managedPlaces.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {managedPlaces.map((plc) => (
                      <div
                        key={plc.id}
                        className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={plc.image}
                            alt={plc.name}
                            className="w-20 h-20 rounded-2xl object-cover bg-surface-container shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                              {plc.categoryLabel}
                            </span>
                            <h4 className="font-extrabold text-base text-on-surface truncate">
                              {plc.name}
                            </h4>
                            <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                              {plc.location}
                            </p>
                            <p className="text-xs text-secondary font-bold mt-1">
                              {plc.priceRange}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-on-surface-variant p-3 bg-surface-container-low rounded-xl leading-relaxed">
                          {plc.description}
                        </div>

                        <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-on-surface-variant">
                            Akun Pemilik: <strong className="text-on-surface">{plc.ownerMerchantId}</strong>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center gap-1 border">
                            <span className="material-symbols-outlined text-[13px]">lock</span>
                            <span>Hanya Pemilik yang Dapat Mengubah</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* Rejection Reason Modal */}
      {rejectingReqId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-on-surface">Tolak Pengajuan Kemitraan</h3>
            <p className="text-xs text-on-surface-variant">
              Berikan catatan alasan mengapa permohonan kemitraan ini belum dapat disetujui.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Dokumen kelayakan perahu belum lengkap atau nomor kontak tidak aktif."
              rows={3}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-red-600"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectingReqId(null)}
                className="flex-1 h-10 rounded-xl bg-surface-container text-xs font-bold text-on-surface"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 h-10 rounded-xl bg-red-600 text-white text-xs font-bold shadow-sm hover:bg-red-700"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-sm w-[90%] z-50 p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2.5 text-xs animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
