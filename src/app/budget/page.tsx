'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { saveBudgetPlan } from '@/lib/indexeddb';
import { syncBudgetToSupabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

interface OriginOption {
  city: string;
  airport: string;
  baseFlightEst: number;
}

const ORIGINS: OriginOption[] = [
  { city: 'Palangka Raya', airport: 'Bandara Tjilik Riwut (PKY)', baseFlightEst: 0 },
  { city: 'Pangkalan Bun', airport: 'Bandara Iskandar (PKN)', baseFlightEst: 0 },
  { city: 'Jakarta', airport: 'Bandara Soekarno-Hatta (CGK)', baseFlightEst: 1100000 },
  { city: 'Surabaya', airport: 'Bandara Juanda (SUB)', baseFlightEst: 950000 },
  { city: 'Banjarmasin', airport: 'Bandara Syamsudin Noor (BDJ)', baseFlightEst: 500000 },
];

interface DestinationOption {
  id: string;
  name: string;
  subtitle: string;
  kelotokDaily: number;
  simaksiPerPerson: number;
  mealsDaily: number;
  guideDaily: number;
  cashPerPerson: number;
  hasKelotok: boolean;
}

const DEST_OPTIONS: DestinationOption[] = [
  {
    id: 'tanjung-puting',
    name: 'Tanjung Puting',
    subtitle: 'Taman Nasional (Kelotok River Safari)',
    kelotokDaily: 700000,
    simaksiPerPerson: 220000,
    mealsDaily: 100000,
    guideDaily: 250000,
    cashPerPerson: 500000,
    hasKelotok: true,
  },
  {
    id: 'taman-nasional-sebangau',
    name: 'Taman Nasional Sebangau',
    subtitle: 'Susur Sungai Koran & Kereng Bangkirai',
    kelotokDaily: 450000,
    simaksiPerPerson: 30000,
    mealsDaily: 75000,
    guideDaily: 150000,
    cashPerPerson: 250000,
    hasKelotok: true,
  },
  {
    id: 'bukit-tangkiling',
    name: 'Bukit Tangkiling & Tahawa',
    subtitle: 'Trekking Batu Purba & Dayak Culture',
    kelotokDaily: 0,
    simaksiPerPerson: 10000,
    mealsDaily: 50000,
    guideDaily: 100000,
    cashPerPerson: 150000,
    hasKelotok: false,
  },
  {
    id: 'bukit-baka-bukit-raya',
    name: 'Bukit Baka Bukit Raya (TNBBBR)',
    subtitle: 'Ekspedisi Puncak Kaba 2.278 mdpl',
    kelotokDaily: 350000,
    simaksiPerPerson: 50000,
    mealsDaily: 80000,
    guideDaily: 300000,
    cashPerPerson: 750000,
    hasKelotok: true,
  },
  {
    id: 'danau-tahai',
    name: 'Danau Gambut Tahai',
    subtitle: 'Titian Kayu Ulin & Danau Air Merah',
    kelotokDaily: 50000,
    simaksiPerPerson: 10000,
    mealsDaily: 45000,
    guideDaily: 80000,
    cashPerPerson: 100000,
    hasKelotok: true,
  },
  {
    id: 'pantai-kubu',
    name: 'Pantai Kubu & Bogam Raya',
    subtitle: 'Pesisir Laut Jawa & Dermaga Ulin',
    kelotokDaily: 150000,
    simaksiPerPerson: 15000,
    mealsDaily: 75000,
    guideDaily: 100000,
    cashPerPerson: 250000,
    hasKelotok: true,
  },
  {
    id: 'batu-banama',
    name: 'Situs Batu Banama & Betang',
    subtitle: 'Legenda Dayak & Rumah Adat Betang',
    kelotokDaily: 0,
    simaksiPerPerson: 15000,
    mealsDaily: 50000,
    guideDaily: 100000,
    cashPerPerson: 150000,
    hasKelotok: false,
  },
];

function BudgetPlannerInner() {
  const searchParams = useSearchParams();
  const preSelectedDest = searchParams.get('dest');

  const [selectedOrigin, setSelectedOrigin] = useState<OriginOption>(ORIGINS[0]);
  const [selectedDest, setSelectedDest] = useState<DestinationOption>(DEST_OPTIONS[0]);
  const [guests, setGuests] = useState(2);
  const [durationDays, setDurationDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState<'hemat' | 'standar' | 'eksklusif'>('standar');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (preSelectedDest) {
      const match = DEST_OPTIONS.find((d) => d.id === preSelectedDest);
      if (match) setSelectedDest(match);
    }
  }, [preSelectedDest]);

  // Style multiplier
  const styleMultiplier = travelStyle === 'hemat' ? 0.85 : travelStyle === 'eksklusif' ? 1.35 : 1.0;

  // Real calculations
  const transportKelotok = Math.round(
    (selectedDest.kelotokDaily * (durationDays - 1 || 1) + selectedOrigin.baseFlightEst * guests) *
      (travelStyle === 'eksklusif' ? 1.2 : 1.0)
  );
  const parkTickets = Math.round(selectedDest.simaksiPerPerson * guests);
  const meals = Math.round(selectedDest.mealsDaily * durationDays * guests * styleMultiplier);
  const guideCrew = Math.round(selectedDest.guideDaily * durationDays * styleMultiplier);
  const emergencyCash = Math.round(selectedDest.cashPerPerson * guests);

  const totalCost = transportKelotok + parkTickets + meals + guideCrew + emergencyCash;
  const perPersonCost = Math.round(totalCost / guests);

  // Percentages for bars
  const pKelotok = Math.round((transportKelotok / totalCost) * 100) || 0;
  const pTickets = Math.round((parkTickets / totalCost) * 100) || 0;
  const pMeals = Math.round((meals / totalCost) * 100) || 0;
  const pGuide = Math.round((guideCrew / totalCost) * 100) || 0;
  const pCash = Math.round((emergencyCash / totalCost) * 100) || 0;

  const handleSaveToPack = async () => {
    const plan = {
      id: `budget-${Date.now()}`,
      destinationId: selectedDest.id,
      destinationName: selectedDest.name,
      origin: selectedOrigin.city,
      guests,
      durationDays,
      durationNights: durationDays - 1,
      style: travelStyle,
      totalCost,
      perPersonCost,
      breakdown: {
        transportKelotok,
        parkTickets,
        meals,
        guideCrew,
        emergencyCash,
      },
      cashAdvice: `Siapkan minimal Rp ${emergencyCash.toLocaleString('id-ID')} uang tunai fisik.`,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    await saveBudgetPlan(plan);
    syncBudgetToSupabase(plan);

    setIsSaved(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
    });
    showToast('Estimasi tersimpan ke Travel Pack Offline (IndexedDB)!');
  };

  const handleShare = async () => {
    const text = `📋 Rencana Budget MANJALAN ke ${selectedDest.name}
Titik Asal: ${selectedOrigin.city}
Peserta: ${guests} orang | Durasi: ${durationDays}H ${durationDays - 1}M
Gaya: ${travelStyle.toUpperCase()}
Total Estimasi: Rp ${totalCost.toLocaleString('id-ID')} (Rp ${perPersonCost.toLocaleString('id-ID')}/orang)
Peringatan Tunai: Siapkan tunai Rp ${emergencyCash.toLocaleString('id-ID')} untuk area sungai tanpa sinyal.
Rencanakan Saat Online, Tetap Siap Saat Offline!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Budget MANJALAN - ${selectedDest.name}`,
          text,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('Rincian budget disalin ke clipboard!');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header title="MANJALAN" subtitle="Budget Planner" />

      <main className="flex-1 pt-20 pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-8">
          {/* Header Context (Clean & Minimal) */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface">
              Smart Budget Planner
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Estimasi biaya sewa kelotok, tiket konservasi, dan kebutuhan uang tunai.
            </p>
          </div>

          {/* Desktop/Tablet 2-Column Split Layout */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Column: Parameter Inputs (7 cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Parameter Config Card */}
              <div className="flex flex-col p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm gap-5">
                <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
                  <span className="text-base sm:text-lg font-bold text-on-surface">
                    Rencana Perjalanan
                  </span>
                </div>

                {/* Origins Picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs sm:text-sm font-bold text-on-surface-variant">
                    Titik Keberangkatan
                  </label>
                  <div className="relative">
                    <select
                      value={selectedOrigin.city}
                      onChange={(e) => {
                        const found = ORIGINS.find((o) => o.city === e.target.value);
                        if (found) setSelectedOrigin(found);
                      }}
                      className="w-full appearance-none px-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-bold text-sm border border-outline-variant/40 focus:outline-none focus:border-primary pr-10"
                    >
                      {ORIGINS.map((o) => (
                        <option key={o.city} value={o.city}>
                          {o.city} — {o.airport}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined text-outline text-[20px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Destination Picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs sm:text-sm font-bold text-on-surface-variant">
                    Destinasi Utama
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDest.id}
                      onChange={(e) => {
                        const found = DEST_OPTIONS.find((d) => d.id === e.target.value);
                        if (found) setSelectedDest(found);
                      }}
                      className="w-full appearance-none px-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-bold text-sm border border-outline-variant/40 focus:outline-none focus:border-primary pr-10"
                    >
                      {DEST_OPTIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.subtitle})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined text-outline text-[20px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Stepper Matrix: Peserta & Durasi */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-1">
                  {/* Stepper: Peserta */}
                  <div className="flex flex-col p-2.5 sm:p-3.5 rounded-xl bg-surface-container-low gap-1.5 sm:gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-on-surface-variant truncate">
                      Jumlah Peserta
                    </span>
                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-container text-on-surface flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-surface-container-high"
                        type="button"
                        aria-label="Kurangi Peserta"
                      >
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">remove</span>
                      </button>
                      <span className="text-xs sm:text-base font-bold text-on-surface text-center truncate px-1">
                        {guests} Orang
                      </span>
                      <button
                        onClick={() => setGuests((g) => Math.min(12, g + 1))}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-primary-fixed-dim"
                        type="button"
                        aria-label="Tambah Peserta"
                      >
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Stepper: Durasi */}
                  <div className="flex flex-col p-2.5 sm:p-3.5 rounded-xl bg-surface-container-low gap-1.5 sm:gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-on-surface-variant truncate">
                      Durasi Ekspedisi
                    </span>
                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => setDurationDays((d) => Math.max(1, d - 1))}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-container text-on-surface flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-surface-container-high"
                        type="button"
                        aria-label="Kurangi Durasi"
                      >
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">remove</span>
                      </button>
                      <span className="text-xs sm:text-base font-bold text-on-surface text-center truncate px-1">
                        {durationDays}H {Math.max(0, durationDays - 1)}M
                      </span>
                      <button
                        onClick={() => setDurationDays((d) => Math.min(7, d + 1))}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-primary-fixed-dim"
                        type="button"
                        aria-label="Tambah Durasi"
                      >
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Style of Travel Selector */}
                <div className="flex flex-col gap-2 pt-1">
                  <label className="text-xs sm:text-sm font-bold text-on-surface-variant">
                    Gaya Perjalanan
                  </label>
                  <div className="grid grid-cols-3 p-1 rounded-xl bg-surface-container-high gap-1.5">
                    {(['hemat', 'standar', 'eksklusif'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setTravelStyle(style)}
                        className={`py-2.5 rounded-lg text-xs sm:text-sm capitalize transition-all ${
                          travelStyle === style
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        type="button"
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Storytelling Teaser */}
              <div className="relative rounded-2xl overflow-hidden shadow-sm h-40 sm:h-48 bg-surface-container">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx3idpt9KEEdsqQAv2KekOb4vhEBIOzdifeDt-txpkM_GUf-JXum_ySpTPzr1__HxVajC3F4b4jVQGZ72rEcPANzh8CI4N2Ft0am-Qcx7XDIVMYd6oLZBYn9ofbfh2mbUEQ42BWwyvz6bJ0EM5HC22IntTJC_FY2cfdmu1d_We8bfD7uZDm5bw3C7pcpGkyVzHltDCCnYAzXGKXnB3kvHW0PPyzMHjK0MVnRi-tfMb"
                  alt="Kelotok Tanjung Puting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center gap-1.5 text-secondary-fixed">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Tarif Valid Lapangan 2024
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold mt-1 text-slate-100 max-w-lg">
                    Sewa Kelotok mencakup bahan bakar, nahkoda lokal, dan koki kapal berlisensi balai konservasi.
                  </p>
                </div>
              </div>

              {/* Quick Local Advice Card */}
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container ring-2 ring-primary/20">
                  <img
                    className="w-full h-full object-cover"
                    alt="Pak Darman"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGLrfBSImG7R_7cpSXyj3XPevtdaKzdche3TrfK_Dvx7xIpNZfLT17ZUQL4L4eBtVChWq9omkUrJIuUzptKgt30oG1DYPtnus7vM57PL-86mjpp4vpxEUxjoUThUmf0NcBVCaqfeG5Rg2PT894BBS2HoCnBrCSwmdAzFLzgdL-FBvpC6sx9Zg1tgekct5eTogNf_eK86ww0zZpEqHADCpEQmbo7psjV0IYCFTLHL-7"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-on-surface">
                    Saran Pak Darman (Nahkoda Sekonyer)
                  </span>
                  <span className="text-xs text-on-surface-variant mt-0.5 leading-snug">
                    &quot;Bawa lembaran 20 ribu &amp; 50 ribu pas, warung apung jarang sedia kembalian.&quot;
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Summary & Breakdown (5 cols on desktop) */}
            <div className="lg:col-span-5 mt-6 lg:mt-0 flex flex-col gap-5 lg:sticky lg:top-24">
              {/* High-Contrast Estimation Result Card */}
              <div className="flex flex-col rounded-2xl bg-inverse-surface text-inverse-on-surface p-5 sm:p-6 shadow-xl gap-5 border border-outline-variant/30">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider">
                      Total Estimasi Realistis
                    </span>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1">
                      Rp {totalCost.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs sm:text-sm text-surface-variant mt-0.5">
                      Rp {perPersonCost.toLocaleString('id-ID')} / orang ({guests} peserta)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-lowest/10 text-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">savings</span>
                  </div>
                </div>

                {/* Realism Status Chip */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-lowest/10 w-fit">
                  <span className="material-symbols-outlined text-secondary-fixed text-[18px]">
                    verified_user
                  </span>
                  <span className="text-xs text-surface-bright font-medium">
                    Termasuk Buffer Lapangan
                  </span>
                </div>

                {/* Breakdown Bars */}
                <div className="flex flex-col gap-3 pt-1">
                  <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider">
                    Rincian Biaya
                  </span>

                  {/* Pos 1 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-xs">
                      <span className="text-surface-bright flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim shrink-0">
                          directions_boat
                        </span>
                        <span className="truncate">Transport &amp; Sewa Kelotok</span>
                      </span>
                      <span className="font-bold text-white shrink-0 sm:text-right">
                        Rp {transportKelotok.toLocaleString('id-ID')} ({pKelotok}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-lowest/15 overflow-hidden">
                      <div
                        className="h-full bg-primary-fixed rounded-full transition-all duration-300"
                        style={{ width: `${pKelotok}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pos 2 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-xs">
                      <span className="text-surface-bright flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-secondary-fixed shrink-0">
                          confirmation_number
                        </span>
                        <span className="truncate">Tiket Masuk &amp; Konservasi</span>
                      </span>
                      <span className="font-bold text-white shrink-0 sm:text-right">
                        Rp {parkTickets.toLocaleString('id-ID')} ({pTickets}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-lowest/15 overflow-hidden">
                      <div
                        className="h-full bg-secondary-fixed-dim rounded-full transition-all duration-300"
                        style={{ width: `${pTickets}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pos 3 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-xs">
                      <span className="text-surface-bright flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-tertiary-fixed shrink-0">
                          restaurant
                        </span>
                        <span className="truncate">Konsumsi &amp; Logistik Kapal</span>
                      </span>
                      <span className="font-bold text-white shrink-0 sm:text-right">
                        Rp {meals.toLocaleString('id-ID')} ({pMeals}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-lowest/15 overflow-hidden">
                      <div
                        className="h-full bg-tertiary-fixed rounded-full transition-all duration-300"
                        style={{ width: `${pMeals}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pos 4 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-xs">
                      <span className="text-surface-bright flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-secondary-fixed shrink-0">
                          handshake
                        </span>
                        <span className="truncate">Pemandu &amp; Kru Lokal (UMKM)</span>
                      </span>
                      <span className="font-bold text-white shrink-0 sm:text-right">
                        Rp {guideCrew.toLocaleString('id-ID')} ({pGuide}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-lowest/15 overflow-hidden">
                      <div
                        className="h-full bg-secondary-container rounded-full transition-all duration-300"
                        style={{ width: `${pGuide}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pos 5 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-xs">
                      <span className="text-surface-bright flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-amber-300 shrink-0">
                          payments
                        </span>
                        <span className="truncate">Dana Darurat Tunai (Blackout Net)</span>
                      </span>
                      <span className="font-bold text-amber-300 shrink-0 sm:text-right">
                        Rp {emergencyCash.toLocaleString('id-ID')} ({pCash}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-lowest/15 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${pCash}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Readiness Recommendation Box */}
              <div className="flex flex-col p-5 rounded-2xl bg-amber-50 border border-amber-200 text-on-surface gap-3 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800">
                  <span className="material-symbols-outlined text-[22px]">warning</span>
                  <span className="font-bold text-sm">
                    Kesiapan Pembayaran Lapangan
                  </span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  <strong>Penting:</strong> Rute {selectedDest.name} memiliki titik blankspot total. Siapkan minimal{' '}
                  <strong>Rp {emergencyCash.toLocaleString('id-ID')} UANG TUNAI</strong> untuk logistik ekstra dan tips nahkoda perahu.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white shadow-sm text-primary text-xs font-bold border border-blue-200">
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                    <span>Dermaga: QRIS</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 text-white shadow-sm text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                    <span>Sungai: Cash Only</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleSaveToPack}
                  className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
                    isSaved
                      ? 'bg-secondary text-white'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isSaved ? 'check_circle' : 'cloud_download'}
                  </span>
                  <span>{isSaved ? 'Tersimpan ke IndexedDB Offline' : 'Simpan ke Travel Pack Offline'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full h-11 rounded-xl bg-surface-container text-on-surface-variant font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  <span>Bagikan Estimasi ke Rombongan</span>
                </button>
              </div>
            </div>
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

export default function BudgetPlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-surface">
          <Header title="MANJALAN" subtitle="Budget Planner" />
          <div className="flex-1 flex items-center justify-center pt-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      }
    >
      <BudgetPlannerInner />
    </Suspense>
  );
}
