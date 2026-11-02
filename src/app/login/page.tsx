'use client';

import React, { useState, useEffect } from 'react';
import { PartnerRequest, ManagedPlace, PartnerAccount } from '@/types';

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

  // Petugas Dashboard State (3 Tabs)
  const [activeTab, setActiveTab] = useState<'requests' | 'accounts' | 'directory'>('requests');
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [managedPlaces, setManagedPlaces] = useState<ManagedPlace[]>([]);
  const [partnerAccounts, setPartnerAccounts] = useState<PartnerAccount[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rejection modal
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // ACC Success & WhatsApp Notification Modal (ONE-TIME VIEW)
  const [approvedNotification, setApprovedNotification] = useState<{
    applicantName: string;
    businessName: string;
    whatsapp: string;
    password: string;
    type: string;
    isExistingOwner: boolean;
  } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Password Reset Modal (ONE-TIME VIEW)
  const [passwordResetNotification, setPasswordResetNotification] = useState<{
    partnerName: string;
    businessName: string;
    whatsapp: string;
    newPassword: string;
  } | null>(null);
  const [copiedResetNotification, setCopiedResetNotification] = useState(false);

  // Create Manual Account Modal State
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccWhatsapp, setNewAccWhatsapp] = useState('');
  const [newAccBusiness, setNewAccBusiness] = useState('');
  const [newAccRole, setNewAccRole] = useState<'umkm' | 'pengelola'>('umkm');
  const [newAccCustomPassword, setNewAccCustomPassword] = useState('');
  const [isSubmittingNewAcc, setIsSubmittingNewAcc] = useState(false);

  // Edit Account Modal State
  const [editingAccount, setEditingAccount] = useState<PartnerAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editRole, setEditRole] = useState<'umkm' | 'pengelola'>('umkm');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [isSavingEditAcc, setIsSavingEditAcc] = useState(false);

  // Delete Account Modal State
  const [deletingAccount, setDeletingAccount] = useState<PartnerAccount | null>(null);
  const [isDeletingAcc, setIsDeletingAcc] = useState(false);

  const formatWhatsappNumber = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  const getWhatsappApprovalMessage = (info: {
    applicantName: string;
    businessName: string;
    whatsapp: string;
    password: string;
    isExistingOwner: boolean;
  }) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://manjalan.vercel.app';
    if (info.isExistingOwner) {
      return `Halo Bapak/Ibu ${info.applicantName}, selamat!\n\nPengajuan penambahan tempat/layanan Anda "*${info.businessName}*" telah DISANGGUPI & DISETUJUI (ACC) oleh Petugas Balai Konservasi Manjalan.\n\nTempat ini sekarang sudah otomatis aktif di bawah akun kelolaan Anda. Silakan masuk ke:\n• Ruang Kerja: ${origin}/mitra\n• ID Mitra: ${info.whatsapp}\n\nTerima kasih atas kerja samanya mendukung ekowisata Kalimantan Tengah!`;
    }

    return `Halo Bapak/Ibu ${info.applicantName}, selamat!\n\nPengajuan kemitraan Anda untuk "*${info.businessName}*" telah DISANGGUPI & DISETUJUI (ACC) oleh Petugas Balai Konservasi Manjalan.\n\nAkun mitra Anda telah otomatis aktif dengan rincian kredensial login berikut:\n• Halaman Masuk: ${origin}/mitra\n• ID Login (No. WhatsApp): ${info.whatsapp}\n• Password Keamanan: ${info.password}\n\nSilakan buka tautan di atas untuk mulai melengkapi fasilitas, memperbarui tarif, status sinyal, dan metode pembayaran Anda. Terima kasih!`;
  };

  const handleSendWhatsapp = () => {
    if (!approvedNotification) return;
    const phone = formatWhatsappNumber(approvedNotification.whatsapp);
    const msg = getWhatsappApprovalMessage(approvedNotification);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyNotification = () => {
    if (!approvedNotification) return;
    const msg = getWhatsappApprovalMessage(approvedNotification);
    navigator.clipboard.writeText(msg);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleSendResetWhatsapp = () => {
    if (!passwordResetNotification) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://manjalan.vercel.app';
    const phone = formatWhatsappNumber(passwordResetNotification.whatsapp);
    const msg = `Halo Bapak/Ibu ${passwordResetNotification.partnerName},\n\nKata sandi (password) akun mitra Anda untuk "*${passwordResetNotification.businessName}*" telah berhasil di-reset oleh Petugas Balai Konservasi Manjalan.\n\nBerikut kredensial login baru Anda:\n• Halaman Masuk: ${origin}/mitra\n• ID Login (No. WA): ${passwordResetNotification.whatsapp}\n• Password Baru: ${passwordResetNotification.newPassword}\n\nSilakan masuk dan jaga kerahasiaan kata sandi Anda. Terima kasih!`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyResetNotification = () => {
    if (!passwordResetNotification) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://manjalan.vercel.app';
    const msg = `Halo Bapak/Ibu ${passwordResetNotification.partnerName},\n\nKata sandi akun mitra "*${passwordResetNotification.businessName}*" telah di-reset:\n• Halaman: ${origin}/mitra\n• ID: ${passwordResetNotification.whatsapp}\n• Password Baru: ${passwordResetNotification.newPassword}`;
    navigator.clipboard.writeText(msg);
    setCopiedResetNotification(true);
    setTimeout(() => setCopiedResetNotification(false), 3000);
  };

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

  // Fetch requests, places, & accounts when logged in
  useEffect(() => {
    if (petugasSession) {
      loadDashboardData();
    }
  }, [petugasSession]);

  const loadDashboardData = async () => {
    if (!petugasSession) return;
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

      // 3. Fetch Accounts
      const resAcc = await fetch('/api/petugas/accounts', {
        headers: { Authorization: `Bearer ${petugasSession.token}` },
      });
      const dataAcc = await resAcc.json();
      if (dataAcc.success) {
        setPartnerAccounts(dataAcc.data);
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
      setErrorMessage('Harap isi ID Petugas dan Kata Sandi/PIN.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/petugas/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId, pin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'ID Petugas atau PIN salah.');
        showToast(data.error || 'Akses ditolak.');
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

      const targetReq = requests.find((r) => r.id === reqId) || data.data?.request;
      if (targetReq) {
        setApprovedNotification({
          applicantName: targetReq.applicantName,
          businessName: targetReq.businessName,
          whatsapp: targetReq.whatsapp,
          password: data.data?.temporaryPassword || targetReq.desiredPassword || targetReq.desiredPin || 'Manjalan2026',
          type: targetReq.type,
          isExistingOwner: Boolean(targetReq.targetExistingOwnerId),
        });
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

      showToast('Pengajuan telah ditolak.');
      setRejectingReqId(null);
      setRejectReason('');
      await loadDashboardData();
    } catch (e) {
      showToast('Terjadi kesalahan.');
    } finally {
      setProcessingId(null);
    }
  };

  // Petugas creates a partner account manually
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petugasSession) return;
    setIsSubmittingNewAcc(true);

    try {
      const res = await fetch('/api/petugas/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${petugasSession.token}`,
        },
        body: JSON.stringify({
          name: newAccName.trim(),
          whatsapp: newAccWhatsapp.trim(),
          businessName: newAccBusiness.trim(),
          role: newAccRole,
          password: newAccCustomPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal membuat akun mitra.');
        return;
      }

      showToast('Akun mitra berhasil dibuat!');
      setShowCreateAccountModal(false);

      // Trigger one-time view modal for Petugas to dispatch credentials to WhatsApp
      setApprovedNotification({
        applicantName: newAccName.trim(),
        businessName: newAccBusiness.trim(),
        whatsapp: newAccWhatsapp.trim(),
        password: data.temporaryPassword,
        type: newAccRole,
        isExistingOwner: false,
      });

      // Reset form
      setNewAccName('');
      setNewAccWhatsapp('');
      setNewAccBusiness('');
      setNewAccCustomPassword('');

      await loadDashboardData();
    } catch (e) {
      showToast('Gagal menghubungi server.');
    } finally {
      setIsSubmittingNewAcc(false);
    }
  };

  // Petugas saves edited partner account
  const handleSaveEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petugasSession || !editingAccount) return;
    setIsSavingEditAcc(true);

    try {
      const res = await fetch(`/api/petugas/accounts/${editingAccount.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${petugasSession.token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          businessName: editBusinessName.trim(),
          role: editRole,
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal memperbarui akun mitra.');
        return;
      }

      showToast('Detail akun mitra berhasil diperbarui.');
      setEditingAccount(null);
      await loadDashboardData();
    } catch (e) {
      showToast('Terjadi kesalahan.');
    } finally {
      setIsSavingEditAcc(false);
    }
  };

  // Petugas resets a partner's password (generates new alphanumeric password)
  const handleResetPassword = async (acc: PartnerAccount) => {
    if (!petugasSession) return;
    if (!confirm(`Reset kata sandi untuk akun "${acc.name}" (${acc.whatsapp})?\nPassword baru akan di-generate otomatis dan dapat langsung Anda kirimkan ke WhatsApp mitra.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/petugas/accounts/${acc.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${petugasSession.token}`,
        },
        body: JSON.stringify({ resetPassword: true }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal mereset kata sandi.');
        return;
      }

      showToast('Kata sandi berhasil di-reset!');

      // Open ONE-TIME VIEW reset modal with WhatsApp dispatch
      setPasswordResetNotification({
        partnerName: acc.name,
        businessName: acc.businessName,
        whatsapp: acc.whatsapp,
        newPassword: data.newGeneratedPassword,
      });

      await loadDashboardData();
    } catch (e) {
      showToast('Terjadi kesalahan saat reset password.');
    }
  };

  // Petugas deletes a partner account
  const handleDeleteAccountSubmit = async () => {
    if (!petugasSession || !deletingAccount) return;
    setIsDeletingAcc(true);

    try {
      const res = await fetch(`/api/petugas/accounts/${deletingAccount.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${petugasSession.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Gagal menghapus akun mitra.');
        return;
      }

      showToast(`Akun mitra "${deletingAccount.name}" berhasil dihapus.`);
      setDeletingAccount(null);
      await loadDashboardData();
    } catch (e) {
      showToast('Terjadi kesalahan.');
    } finally {
      setIsDeletingAcc(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg tracking-wider text-on-surface">
                MANJALAN OTORITAS
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-700 font-bold uppercase tracking-widest">
                Portal Pengawasan Lapangan &amp; Otoritas Balai
              </p>
            </div>
          </div>

          {petugasSession && (
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-surface-container text-xs font-bold text-error hover:bg-red-50 border border-outline-variant/30 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Keluar</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {!petugasSession ? (
          /* STATE 1: Petugas Login Form */
          <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-[32px]">shield_person</span>
              </div>
              <h2 className="text-2xl font-black text-on-surface">Masuk Khusus Petugas</h2>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Ruang kerja verifikasi permohonan mitra baru, manajemen akun mitra, dan supervisi destinasi Kalimantan Tengah.
              </p>
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
                    placeholder="Masukkan ID Petugas Otoritas"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface">PIN / Password Keamanan</label>
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
                    placeholder="••••••"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm border border-outline-variant/60 outline-none tracking-widest focus:border-amber-600 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-on-surface-variant text-[11px]">Sesi Terenkripsi Balai</span>
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
                  <span className="text-[10px] text-slate-400 block font-medium">Akun Mitra</span>
                  <strong className="text-base font-black text-blue-400">{partnerAccounts.length} Terdaftar</strong>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-600 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Tempat Binaan</span>
                  <strong className="text-base font-black text-emerald-400">{managedPlaces.length} Tempat</strong>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (3 Tabs) */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-surface-container-high w-fit">
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
                onClick={() => setActiveTab('accounts')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'accounts'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                <span>Kelola Akun Mitra (CRUD)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-secondary text-[10px] font-bold">
                  {partnerAccounts.length}
                </span>
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
                <span>Direktori Supervisi Tempat (Read-Only)</span>
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
                      Password dirahasiakan dan <strong>hanya muncul satu kali</strong> saat tombol ACC ditekan agar dapat langsung dikirimkan ke WhatsApp pemohon.
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
                                Kata Sandi / Password:{' '}
                                <span className="font-mono text-outline bg-surface-container px-2 py-0.5 rounded text-[11px] font-bold">
                                  •••••••• (Tersimpan Aman)
                                </span>
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

            {/* TAB 2: Kelola Akun Mitra (CRUD oleh Petugas) */}
            {activeTab === 'accounts' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
                      Manajemen Akun Mitra Terdaftar ({partnerAccounts.length})
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Petugas memiliki hak penuh CRUD akun mitra: ubah detail, reset password saat mitra lupa, atau buat akun manual.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCreateAccountModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    <span>+ Buat Akun Mitra Manual</span>
                  </button>
                </div>

                {partnerAccounts.length === 0 ? (
                  <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 text-on-surface-variant text-sm">
                    Belum ada akun mitra terdaftar. Klik "+ Buat Akun Mitra Manual" untuk menambahkan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {partnerAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                acc.role === 'umkm'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                            >
                              {acc.role === 'umkm' ? 'Pelaku UMKM' : 'Pengelola Destinasi'}
                            </span>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                acc.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                  : 'bg-red-50 text-red-700 border border-red-300'
                              }`}
                            >
                              {acc.status === 'active' ? 'Status: Aktif' : 'Status: Dinonaktifkan'}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-on-surface">{acc.name}</h4>
                          <p className="text-xs text-on-surface-variant font-medium">{acc.businessName}</p>

                          <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-on-surface-variant">ID / No. WhatsApp:</span>
                              <strong className="font-mono text-primary font-bold">{acc.whatsapp}</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-on-surface-variant">Tempat Dikelola:</span>
                              <strong className="text-secondary">{acc.placesCount || 0} Tempat (1-ke-Banyak)</strong>
                            </div>
                            <div className="flex justify-between items-center pt-0.5">
                              <span className="text-on-surface-variant">Kata Sandi:</span>
                              <span className="font-mono text-[11px] text-outline font-bold">•••••••• (Tersimpan Aman)</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Edit, Reset Password, Delete */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/20">
                          <button
                            onClick={() => {
                              setEditingAccount(acc);
                              setEditName(acc.name);
                              setEditBusinessName(acc.businessName);
                              setEditRole(acc.role);
                              setEditStatus(acc.status || 'active');
                            }}
                            className="flex-1 h-9 rounded-xl bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high flex items-center justify-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                            <span>Ubah Detail</span>
                          </button>

                          <button
                            onClick={() => handleResetPassword(acc)}
                            className="flex-1 h-9 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                            title="Reset kata sandi dan dapatkan password baru untuk dikirim ke WhatsApp"
                          >
                            <span className="material-symbols-outlined text-[15px]">lock_reset</span>
                            <span>Reset Password</span>
                          </button>

                          <button
                            onClick={() => setDeletingAccount(acc)}
                            className="h-9 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                            title="Hapus Akun Mitra"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Direktori Pengawasan Tempat (Read-Only) */}
            {activeTab === 'directory' && (
              <div className="space-y-4">
                {/* Strict Read-Only Authority Notice */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0">policy</span>
                  <div className="leading-relaxed">
                    <strong>Kebijakan Otoritas Supervisi Tempat:</strong> Petugas memiliki hak supervisi <em>(Read-Only)</em> terhadap tempat wisata dan UMKM yang terdaftar. Petugas <strong>dilarang mengubah atau menghapus data tempat mitra secara sepihak</strong>. Perubahan fasilitas dan penghapusan tempat dilakukan langsung oleh pengelola bersangkutan di ruang kerjanya.
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
                    Seluruh Tempat Terdaftar di Platform ({managedPlaces.length})
                  </h3>
                  <button
                    onClick={loadDashboardData}
                    disabled={isLoadingData}
                    className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high flex items-center gap-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Segarkan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {managedPlaces.map((plc) => (
                    <div
                      key={plc.id}
                      className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              plc.type === 'umkm'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {plc.categoryLabel || plc.type}
                          </span>
                          <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                            <span className="material-symbols-outlined text-[14px]">account_circle</span>
                            <span>Pemilik: {plc.ownerMerchantId}</span>
                          </span>
                        </div>

                        <h4 className="text-base font-black text-on-surface">{plc.name}</h4>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span>{plc.location}</span>
                        </p>

                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                          {plc.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          <span className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-bold">
                            Tarif: {plc.priceRange}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">
                              {plc.signalOk ? 'signal_cellular_4_bar' : 'signal_cellular_0_bar'}
                            </span>
                            <span>{plc.signalStatus}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-medium">
                            {plc.hasQris ? '✓ QRIS' : '✗ QRIS'} • {plc.needsCash ? 'Wajib Cash' : 'Bisa Non-Tunai'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
                        <span>Status: <strong>Aktif di Direktori</strong></span>
                        <span className="text-outline italic">Hanya Dapat Diedit oleh Pemilik</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: Rejection Modal */}
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

      {/* MODAL 2: ACC Success & WhatsApp Notification Modal (ONE-TIME VIEW) */}
      {approvedNotification && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface">
                  Akun Mitra Berhasil Diaktifkan!
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Password di bawah <strong>hanya muncul satu kali ini saja</strong> demi privasi akun.
                </p>
              </div>
            </div>

            {/* Credential Card */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Usaha / Destinasi:</span>
                <span className="font-bold text-on-surface text-right">{approvedNotification.businessName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Pemilik / Pengelola:</span>
                <span className="font-bold text-on-surface">{approvedNotification.applicantName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">ID Login (No. WhatsApp):</span>
                <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-sm">
                  {approvedNotification.whatsapp}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Password Akun (Sekali Lihat):</span>
                <span className="font-mono font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg text-sm tracking-wide">
                  {approvedNotification.password}
                </span>
              </div>
            </div>

            {/* Notification Dispatch Callout */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <span className="material-symbols-outlined text-[18px] text-emerald-700">outgoing_mail</span>
                <span>Kirimkan Kredensial Langsung ke WhatsApp Mitra</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                Kirim pesan konfirmasi resmi melalui WhatsApp agar pemilik dapat langsung login dan mengelola fasilitasnya di halaman <code>/mitra</code>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSendWhatsapp}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Kirim Kredensial via WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyNotification}
                  className="flex-1 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedNotification ? 'done' : 'content_copy'}
                  </span>
                  <span>{copiedNotification ? 'Pesan Tersalin!' : 'Salin Pesan'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setApprovedNotification(null)}
                  className="flex-1 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  Tutup / Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Password Reset Modal (ONE-TIME VIEW) */}
      {passwordResetNotification && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">lock_reset</span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface">
                  Kata Sandi Baru Berhasil Dibuat!
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Password ini <strong>hanya tampil satu kali ini saja</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Mitra:</span>
                <span className="font-bold text-on-surface">{passwordResetNotification.partnerName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">No. WhatsApp (ID):</span>
                <span className="font-mono font-bold text-primary">{passwordResetNotification.whatsapp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Password Baru:</span>
                <span className="font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg text-sm tracking-wide">
                  {passwordResetNotification.newPassword}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSendResetWhatsapp}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Kirim Password Baru ke WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyResetNotification}
                  className="flex-1 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedResetNotification ? 'done' : 'content_copy'}
                  </span>
                  <span>{copiedResetNotification ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordResetNotification(null)}
                  className="flex-1 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Create Manual Partner Account Modal */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-on-surface">Buat Akun Mitra Manual</h3>
                  <p className="text-[11px] text-on-surface-variant">Daftarkan langsung mitra tanpa melalui antrean pengajuan.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateAccountModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-on-surface">Jenis Mitra</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAccRole('umkm')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      newAccRole === 'umkm'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/40'
                    }`}
                  >
                    Pelaku UMKM
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAccRole('pengelola')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      newAccRole === 'pengelola'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/40'
                    }`}
                  >
                    Pengelola Destinasi
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">Nama Lengkap Pemilik / Pengelola</label>
                <input
                  type="text"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="Contoh: Pak Darman"
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">Nomor WhatsApp (Akan Menjadi ID Login)</label>
                <input
                  type="tel"
                  value={newAccWhatsapp}
                  onChange={(e) => setNewAccWhatsapp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/50 outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">Nama Usaha / Destinasi Wisata</label>
                <input
                  type="text"
                  value={newAccBusiness}
                  onChange={(e) => setNewAccBusiness(e.target.value)}
                  placeholder="Contoh: Kelotok Rimba Sejahtera"
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">
                  Password Awal (Opsional - Kosongkan untuk generate acak)
                </label>
                <input
                  type="text"
                  value={newAccCustomPassword}
                  onChange={(e) => setNewAccCustomPassword(e.target.value)}
                  placeholder="Kombinasi huruf & angka (misal: Borneo88)"
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/50 outline-none focus:border-primary font-mono"
                />
                <p className="text-[10px] text-on-surface-variant">
                  Jika dikosongkan, sistem akan membuatkan password alfanumerik acak 8 karakter secara otomatis.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAccountModal(false)}
                  className="flex-1 h-11 rounded-xl bg-surface-container font-bold text-on-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewAcc}
                  className="flex-1 h-11 rounded-xl bg-slate-900 text-white font-bold shadow-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmittingNewAcc ? 'Membuat...' : 'Buat & Dapatkan Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Edit Account Detail Modal */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-base text-on-surface">Ubah Detail Akun Mitra</h3>

            <form onSubmit={handleSaveEditAccount} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-on-surface">Nama Pemilik</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">Nama Usaha Utama</label>
                <input
                  type="text"
                  value={editBusinessName}
                  onChange={(e) => setEditBusinessName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">Status Akses Akun</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('active')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      editStatus === 'active'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/40'
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('suspended')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      editStatus === 'suspended'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/40'
                    }`}
                  >
                    Nonaktifkan
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="flex-1 h-11 rounded-xl bg-surface-container font-bold text-on-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEditAcc}
                  className="flex-1 h-11 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                >
                  {isSavingEditAcc ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Delete Account Confirmation Modal */}
      {deletingAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-on-surface">Hapus Akun Mitra?</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Anda akan menghapus akun <strong>{deletingAccount.name}</strong> ({deletingAccount.whatsapp}). Mitra tidak akan bisa login lagi ke ruang kerjanya.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAccount(null)}
                className="flex-1 h-11 rounded-xl bg-surface-container font-bold text-xs text-on-surface"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAccountSubmit}
                disabled={isDeletingAcc}
                className="flex-1 h-11 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-sm"
              >
                {isDeletingAcc ? 'Menghapus...' : 'Ya, Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-sm w-[90%] z-50 p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2.5 text-xs animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
