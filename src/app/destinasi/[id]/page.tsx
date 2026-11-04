'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import {
  getDestinationById,
  getUmkmList,
  isTravelPackDownloaded,
  saveTravelPack,
  deleteTravelPack,
} from '@/lib/indexeddb';
import { Destination, Umkm } from '@/types';

export default function DestinationDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'pembayaran' | 'aktivitas' | 'umkm'>('ringkasan');
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Build slides: Gambar -> (scroll) -> Video YT
  const slides: Array<{ type: 'image' | 'video'; url: string; label: string }> = [];
  if (destination) {
    if (destination.gallery && destination.gallery.length > 0) {
      destination.gallery.forEach((img, idx) => {
        slides.push({
          type: 'image',
          url: img,
          label: idx === 0 ? 'Foto Utama' : `Foto ${idx + 1}`,
        });
      });
    } else if (destination.image) {
      slides.push({
        type: 'image',
        url: destination.image,
        label: 'Foto Utama',
      });
    }

    if (destination.videoUrl) {
      slides.push({
        type: 'video',
        url: destination.videoUrl,
        label: destination.videoUrl.endsWith('.webm') ? 'Video Sebangau' : 'Video YouTube',
      });
    }
  }

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      setActiveSlide(idx);
    }
  };

  const goToSlide = (idx: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: idx * carouselRef.current.clientWidth,
      behavior: 'smooth',
    });
    setActiveSlide(idx);
  };

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        const dest = await getDestinationById(id);
        if (dest) {
          setDestination(dest);
          const umkms = await getUmkmList();
          setUmkmList(umkms.filter((u) => u.destinationId === dest.id));
          const downloaded = await isTravelPackDownloaded(dest.id);
          setIsDownloaded(downloaded);
        }
      } catch (err) {
        console.error('Error loading destination:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleToggleDownload = async () => {
    if (!destination) return;

    if (isDownloaded) {
      await deleteTravelPack(`pack-${destination.id}`);
      setIsDownloaded(false);
      showToast('Travel Pack dihapus dari penyimpanan offline lokal.');
    } else {
      setIsDownloading(true);
      setTimeout(async () => {
        await saveTravelPack({
          id: `pack-${destination.id}`,
          destinationId: destination.id,
          destinationName: destination.name,
          location: destination.location,
          sizeMb: destination.packSize,
          downloadedAt: 'Baru saja',
          itemCount: {
            routes: 4,
            umkm: umkmList.length,
            emergency: destination.emergencyContacts.length,
          },
          data: {
            destination,
            umkmList,
          },
        });
        setIsDownloading(false);
        setIsDownloaded(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        showToast('Berhasil! Travel Pack tersimpan di IndexedDB untuk mode tanpa sinyal.');
      }, 700);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Header showBack title="Destinasi" subtitle="Memuat..." />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Header showBack title="Destinasi" subtitle="Tidak Ditemukan" />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
            <span className="material-symbols-outlined text-[32px]">travel_explore</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface">Destinasi Tidak Ditemukan</h2>
          <p className="text-xs text-on-surface-variant max-w-sm mt-1">
            Destinasi dengan ID tersebut belum terdaftar atau telah dipindahkan.
          </p>
          <Link
            href="/"
            className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header showBack title="Destinasi" subtitle={destination.name} />

      <main className="flex-1 pt-20 pb-28 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-8">
          {/* Hero Media Carousel: Gambar -> (scroll) -> Video YT */}
          <div className="relative w-full h-80 sm:h-96 lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 shadow-md group">
            {/* Carousel Scroll Container */}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            >
              {slides.map((slide, sIdx) => (
                <div
                  key={sIdx}
                  className="w-full h-full flex-shrink-0 snap-center relative overflow-hidden bg-black"
                >
                  {slide.type === 'image' ? (
                    <div className="w-full h-full relative">
                      <img
                        src={slide.url}
                        alt={`${destination.name} - ${slide.label}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black relative">
                      {slide.url.endsWith('.webm') || slide.url.endsWith('.mp4') ? (
                        <video
                          controls
                          className="w-full h-full object-contain bg-black"
                          src={slide.url}
                        >
                          Browser Anda tidak mendukung pemutar video HTML5.
                        </video>
                      ) : (
                        <iframe
                          src={slide.url.replace('watch?v=', 'embed/')}
                          title={`Video Dokumentasi ${destination.name}`}
                          className="w-full h-full border-0 bg-black"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Floating Top Controls: Navigation Pills & External YouTube Button */}
            <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2 pointer-events-none">
              {/* Slide Selection Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/65 backdrop-blur-md border border-white/10 shadow-md pointer-events-auto overflow-x-auto no-scrollbar max-w-[70%]">
                {slides.map((slide, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => goToSlide(sIdx)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                      activeSlide === sIdx
                        ? slide.type === 'video'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white text-slate-900 shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {slide.type === 'video' ? 'play_circle' : 'photo_camera'}
                    </span>
                    <span>{slide.label}</span>
                  </button>
                ))}
              </div>

              {/* Top Right: Status / External Link */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {slides[activeSlide]?.type === 'video' && slides[activeSlide].url.startsWith('http') && (
                  <a
                    href={slides[activeSlide].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    <span className="hidden sm:inline">Buka YouTube</span>
                  </a>
                )}
                {isDownloaded && (
                  <div className="flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md text-xs font-bold text-emerald-800 border border-emerald-200">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">offline_pin</span>
                    <span className="hidden sm:inline">Tersimpan Offline</span>
                  </div>
                )}
              </div>
            </div>

            {/* Left & Right Chevron Arrows */}
            {slides.length > 1 && (
              <>
                {activeSlide > 0 && (
                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all active:scale-90"
                    aria-label="Slide sebelumnya"
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">chevron_left</span>
                  </button>
                )}

                {activeSlide < slides.length - 1 && (
                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all active:scale-90"
                    aria-label="Slide berikutnya (Video YT)"
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">chevron_right</span>
                  </button>
                )}
              </>
            )}

            {/* Bottom Hint on Image Slide: Geser ke Video */}
            {slides[activeSlide]?.type === 'image' && slides.some((s) => s.type === 'video') && (
              <button
                type="button"
                onClick={() => goToSlide(slides.findIndex((s) => s.type === 'video'))}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-rose-600 text-white backdrop-blur-md text-xs font-bold shadow-md flex items-center gap-1.5 transition-all group/hint active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px] text-rose-500 group-hover/hint:text-white transition-colors">
                  play_circle
                </span>
                <span>Geser untuk video YT</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            )}

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-sm pointer-events-none">
              {slides.map((_, dotIdx) => (
                <div
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === dotIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Destination Header Card (Clean, Always Accessible Info) */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold shadow-sm">
                {destination.categories[0]}
              </span>
              {destination.categories[1] && (
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold shadow-sm">
                  {destination.categories[1]}
                </span>
              )}
              {destination.gmapsUrl && (
                <a
                  href={destination.gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ml-auto sm:ml-0"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>Lihat Google Maps</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
              {destination.name}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-on-surface-variant pt-2 border-t border-outline-variant/20">
              <div className="flex items-center gap-1.5 text-primary font-medium">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  {destination.rating}
                </span>
                <span className="text-outline">•</span>
                <span className="font-mono text-outline">{destination.packSize}</span>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet 2-Column Split Layout */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Content Column (7-8 cols on desktop) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-outline-variant/30">
                <button
                  onClick={() => setActiveTab('ringkasan')}
                  className={`tab-btn px-4 py-2.5 rounded-xl font-label-md text-xs sm:text-sm whitespace-nowrap transition-all ${
                    activeTab === 'ringkasan'
                      ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  Ringkasan & Jalur
                </button>
                <button
                  onClick={() => setActiveTab('pembayaran')}
                  className={`tab-btn px-4 py-2.5 rounded-xl font-label-md text-xs sm:text-sm whitespace-nowrap transition-all ${
                    activeTab === 'pembayaran'
                      ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  Kesiapan Pembayaran
                </button>
                <button
                  onClick={() => setActiveTab('aktivitas')}
                  className={`tab-btn px-4 py-2.5 rounded-xl font-label-md text-xs sm:text-sm whitespace-nowrap transition-all ${
                    activeTab === 'aktivitas'
                      ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  Aktivitas Utama
                </button>
                <button
                  onClick={() => setActiveTab('umkm')}
                  className={`tab-btn px-4 py-2.5 rounded-xl font-label-md text-xs sm:text-sm whitespace-nowrap transition-all ${
                    activeTab === 'umkm'
                      ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  UMKM Sekitar ({umkmList.length})
                </button>
              </div>

              {/* TAB 1: Ringkasan & Jalur */}
              {activeTab === 'ringkasan' && (
                <div className="flex flex-col gap-6">
                  {/* Field Readiness Grid */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">sensors</span>
                        Kondisi Lapangan & Konektivitas
                      </h2>
                      <span className="text-xs text-tertiary font-semibold">
                        {destination.signalStatus.lastChecked}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Sinyal */}
                      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-[22px]">
                            signal_cellular_connected_no_internet_4_bar
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs sm:text-sm text-on-surface">
                            Sinyal Seluler & Komunikasi
                          </span>
                          <p className="text-xs text-on-surface-variant mt-1">
                            <span className="font-semibold text-secondary">Telkomsel:</span>{' '}
                            {destination.signalStatus.telkomsel}
                          </p>
                          <p className="text-xs text-error mt-0.5">
                            <span className="font-semibold">Provider Lain:</span>{' '}
                            {destination.signalStatus.others}
                          </p>
                        </div>
                      </div>

                      {/* ATM & Cash Transition */}
                      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary shrink-0">
                          <span className="material-symbols-outlined text-[22px]">atm</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs sm:text-sm text-on-surface">
                            Pemberhentian ATM Terakhir
                          </span>
                          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            {destination.paymentReadiness.lastAtmLocation} (Jarak ~
                            {destination.paymentReadiness.atmDistanceKm} km). Tidak ada mesin ATM di dalam kawasan konservasi sungai.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Destination Overview */}
                  <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-on-surface">
                      Tentang Ekspedisi
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {destination.overview}
                    </p>
                    <div className="p-3 rounded-xl bg-surface-container-low text-on-surface-variant text-xs flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[18px] text-secondary">calendar_month</span>
                      <span><strong>Musim Terbaik:</strong> {destination.logistics.bestSeason}</span>
                    </div>
                  </div>

                  {/* Photo Gallery if available */}
                  {destination.gallery && destination.gallery.length > 1 && (
                    <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[22px]">photo_library</span>
                        Galeri Foto Eksplorasi
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {destination.gallery.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative aspect-video rounded-xl overflow-hidden bg-surface-container group shadow-sm"
                          >
                            <img
                              src={photo}
                              alt={`${destination.name} ${pIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergency Radio Channels */}
                  <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-error text-[22px]">emergency</span>
                      Kontak Darurat & Saluran Radio
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                      {destination.emergencyContacts.map((contact, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-xs sm:text-sm text-on-surface truncate">{contact.name}</p>
                            <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                              {contact.role} • <span className="font-semibold text-primary">{contact.channel}</span>
                            </p>
                          </div>
                          {contact.phone && (
                            <a
                              href={`tel:${contact.phone}`}
                              className="w-full sm:w-auto justify-center px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-1 shrink-0 hover:bg-primary/90"
                            >
                              <span className="material-symbols-outlined text-[15px]">call</span>
                              Hubungi
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Kesiapan Pembayaran */}
              {activeTab === 'pembayaran' && (
                <div className="flex flex-col gap-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 border border-amber-200 text-on-surface flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="material-symbols-outlined text-[26px]">payments</span>
                      <h3 className="text-base sm:text-lg font-bold">
                        Kesiapan Pembayaran Lapangan
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      {destination.paymentReadiness.notes}
                    </p>
                    <div className="p-3.5 bg-white rounded-xl border border-amber-200 mt-1 max-w-sm">
                      <p className="text-xs text-amber-900 font-semibold">
                        Rekomendasi Cadangan Tunai:
                      </p>
                      <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-0.5">
                        {destination.paymentReadiness.recommendedCashFormatted}
                      </p>
                    </div>
                  </div>

                  {/* Logistics Breakdown Table */}
                  <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-on-surface">
                      Standar Tarif Resmi Lapangan
                    </h3>
                    <div className="divide-y divide-outline-variant/20 text-xs sm:text-sm">
                      <div className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="text-on-surface-variant text-xs sm:text-sm">Sewa Kelotok River Safari</span>
                        <span className="font-bold text-on-surface text-xs sm:text-sm sm:text-right">{destination.logistics.kelotokFormatted}</span>
                      </div>
                      <div className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="text-on-surface-variant text-xs sm:text-sm">Tiket Masuk / Simaksi Balai TNTP</span>
                        <span className="font-bold text-on-surface text-xs sm:text-sm sm:text-right">{destination.logistics.simaksiFormatted}</span>
                      </div>
                      <div className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="text-on-surface-variant text-xs sm:text-sm">Estimasi Makan &amp; Kru Kapal</span>
                        <span className="font-bold text-on-surface text-xs sm:text-sm sm:text-right">Rp {destination.logistics.mealsEstPerDay.toLocaleString('id-ID')} / hari</span>
                      </div>
                      <div className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="text-on-surface-variant text-xs sm:text-sm">Jasa Pemandu Berlisensi HPI</span>
                        <span className="font-bold text-on-surface text-xs sm:text-sm sm:text-right">Rp {destination.logistics.localGuidePerDay.toLocaleString('id-ID')} / hari</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Aktivitas Utama */}
              {activeTab === 'aktivitas' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start gap-3.5"
                    >
                      <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-[24px]">{act.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-on-surface">
                            {act.name}
                          </h4>
                        </div>
                        {act.timing && (
                          <span className="text-[11px] font-bold text-primary mt-0.5">
                            {act.timing}
                          </span>
                        )}
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: UMKM Sekitar */}
              {activeTab === 'umkm' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {umkmList.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-on-surface-variant text-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                      Belum ada UMKM terdaftar di destinasi ini.
                    </div>
                  ) : (
                    umkmList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover bg-surface-container shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {item.categoryLabel}
                            </span>
                            <h4 className="font-bold text-sm text-on-surface truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-outline-variant/20">
                          {item.hasQris ? (
                            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-primary text-[10px] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">qr_code_2</span>
                              QRIS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">payments</span>
                              Tunai Disarankan
                            </span>
                          )}
                          <span className="text-xs text-on-surface font-semibold ml-auto">
                            {item.priceRange}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Right Sticky Sidebar Column (4-5 cols on desktop) */}
            <div className="lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0 flex flex-col gap-5 lg:sticky lg:top-24">
              {/* Offline Pack Readiness Hero Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-md border border-outline-variant/30 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary-container/20 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary shrink-0">
                      <span className="material-symbols-outlined text-[26px]">offline_pin</span>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-on-surface">
                        Travel Pack Offline
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        Peta rute, UMKM, & kontak darurat
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-bold text-xs shrink-0">
                    {destination.packSize}
                  </span>
                </div>

                {/* Readiness Meter */}
                <div className="flex flex-col gap-2 bg-surface-container-low p-3.5 rounded-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-medium">Status Penyimpanan</span>
                    <span className="text-secondary font-bold">
                      {isDownloaded ? '100% Tersimpan' : 'Belum Diunduh'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: isDownloaded ? '100%' : '20%' }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleToggleDownload}
                  disabled={isDownloading}
                  className={`w-full h-12 transition-all rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] ${
                    isDownloaded
                      ? 'bg-secondary text-white hover:bg-secondary/90'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {isDownloading
                      ? 'sync'
                      : isDownloaded
                      ? 'check_circle'
                      : 'download_for_offline'}
                  </span>
                  <span>
                    {isDownloading
                      ? 'Menyimpan ke IndexedDB...'
                      : isDownloaded
                      ? `Tersimpan Offline (${destination.packSize}) — Hapus?`
                      : `Unduh Travel Pack (${destination.packSize})`}
                  </span>
                </button>
              </div>

              {/* Direct Desktop Budget CTA */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Perencanaan Logistik
                </span>
                <h3 className="text-base font-extrabold text-on-surface">
                  Hitung Estimasi Biaya {destination.name}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Gunakan Smart Budget Planner untuk menghitung tarif sewa kelotok nahkoda lokal, izin simaksi, dan cadangan uang tunai.
                </p>
                <Link
                  href={`/budget?dest=${destination.id}`}
                  className="w-full h-11 rounded-xl bg-surface-container-high text-primary hover:bg-primary hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">calculate</span>
                  <span>Mulai Hitung Budget</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Sticky Action Bar (Hidden on desktop because sidebar is used) */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 p-3 px-4 z-40">
        <div className="max-w-md mx-auto">
          <Link
            href={`/budget?dest=${destination.id}`}
            className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">calculate</span>
            <span>Hitung Budget Destinasi Ini</span>
          </Link>
        </div>
      </div>

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
