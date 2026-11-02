'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { MAP_POINTS, MapPoint, calculateDistanceKm, estimateKelotokTime } from '@/data/mapData';
import { saveOfflineMapTrip, getOfflineMapTrip, saveOfflineMapPoints, getOfflineMapPoints } from '@/lib/indexeddb';

// Kumai Gateway coordinates (Default Basecamp)
const KUMAI_BASECAMP = {
  lat: -2.7431,
  lng: 111.7354,
  name: 'Dermaga Utama Kumai (Basecamp)',
};

export default function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [points, setPoints] = useState<MapPoint[]>(MAP_POINTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [waypoints, setWaypoints] = useState<MapPoint[]>([]);
  
  // User GPS State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; isLive: boolean; name: string }>(
    { ...KUMAI_BASECAMP, isLive: false }
  );
  const [isLocating, setIsLocating] = useState(false);

  // Offline persistence state
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Leaflet Map (Client-Side Only)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // already initialized

      const L = (await import('leaflet')).default;

      // Fix Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Check if user has saved offline map in IndexedDB
      const savedTrip = await getOfflineMapTrip();
      if (savedTrip && savedTrip.waypoints && savedTrip.waypoints.length > 0) {
        setWaypoints(savedTrip.waypoints);
        setIsSavedOffline(true);
      }

      // Check offline points
      const cachedPoints = await getOfflineMapPoints();
      if (cachedPoints && cachedPoints.length > 0) {
        setPoints(cachedPoints);
      } else {
        await saveOfflineMapPoints(MAP_POINTS);
      }

      if (!isMounted || !mapContainerRef.current) return;

      // Create Leaflet instance
      const map = L.map(mapContainerRef.current, {
        center: [-2.82, 111.85],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // Add clean zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add OpenStreetMap raster tiles with graceful fallback
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 8,
      }).addTo(map);

      // Layer groups for markers & route lines
      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      renderMarkers();
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filtered Points
  const filteredPoints = useMemo(() => {
    if (selectedCategory === 'all') return points;
    return points.filter((p) => p.category === selectedCategory);
  }, [points, selectedCategory]);

  // Re-render markers whenever filters, points, or waypoints change
  useEffect(() => {
    renderMarkers();
  }, [filteredPoints, waypoints, userLocation]);

  // Render Markers and Polyline on Leaflet
  const renderMarkers = async () => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const L = (await import('leaflet')).default;

    markersLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();

    // 1. Render User GPS Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-[18px]">near_me</span>
          </div>
          <div class="absolute -inset-1 rounded-full bg-blue-400 animate-ping opacity-60 pointer-events-none"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindTooltip(userLocation.isLive ? 'Lokasi GPS Anda' : 'Posisi Awal (Dermaga Kumai)', {
        permanent: false,
        direction: 'top',
      })
      .addTo(markersLayerRef.current);

    // 2. Render Point Markers
    filteredPoints.forEach((point) => {
      const isWaypoint = waypoints.some((w) => w.id === point.id);
      const waypointIndex = waypoints.findIndex((w) => w.id === point.id);

      // Category color & icon mapping
      let colorClass = 'bg-primary text-white';
      let iconName = 'location_on';

      if (point.category === 'destinasi') {
        colorClass = 'bg-secondary text-white';
        iconName = 'forest';
      } else if (point.category === 'umkm') {
        colorClass = 'bg-amber-600 text-white';
        iconName = 'storefront';
      } else if (point.category === 'layanan') {
        colorClass = 'bg-blue-600 text-white';
        iconName = 'health_and_safety';
      } else if (point.category === 'atm') {
        colorClass = 'bg-emerald-600 text-white';
        iconName = 'payments';
      }

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
          <div class="w-9 h-9 rounded-2xl ${colorClass} shadow-md border-2 border-white flex items-center justify-center font-bold">
            ${
              isWaypoint
                ? `<span class="text-xs font-black text-white">${waypointIndex + 1}</span>`
                : `<span class="material-symbols-outlined text-[20px]">${iconName}</span>`
            }
          </div>
          ${
            isWaypoint
              ? `<div class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">✓</div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-point-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoint(point);
        mapInstanceRef.current?.panTo([point.lat, point.lng], { animate: true });
      });

      marker.addTo(markersLayerRef.current);
    });

    // 3. Draw Route Polyline connecting User -> Waypoints
    if (waypoints.length > 0) {
      const latlngs: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        ...waypoints.map((w): [number, number] => [w.lat, w.lng]),
      ];

      L.polyline(latlngs, {
        color: '#004ac6',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
        lineCap: 'round',
      }).addTo(routeLayerRef.current);
    }
  };

  // Toggle Live GPS
  const handleToggleGps = () => {
    if (!navigator.geolocation) {
      showToast('Browser Anda tidak mendukung deteksi GPS.');
      return;
    }

    if (userLocation.isLive) {
      // Revert to Kumai basecamp simulation
      setUserLocation({ ...KUMAI_BASECAMP, isLive: false });
      showToast('Kembali ke Titik Awal: Dermaga Kumai.');
      mapInstanceRef.current?.setView([KUMAI_BASECAMP.lat, KUMAI_BASECAMP.lng], 12);
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = {
          lat: latitude,
          lng: longitude,
          isLive: true,
          name: 'Posisi GPS Anda',
        };
        setUserLocation(newLoc);
        setIsLocating(false);
        showToast('GPS Terkoneksi: Menghitung jarak dari koordinat Anda.');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 13);
        }
      },
      () => {
        setIsLocating(false);
        showToast('Izin GPS ditolak. Tetap menggunakan titik acuan Dermaga Kumai.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Add or Remove Waypoint
  const handleToggleWaypoint = (point: MapPoint) => {
    const exists = waypoints.some((w) => w.id === point.id);
    let updated: MapPoint[];

    if (exists) {
      updated = waypoints.filter((w) => w.id !== point.id);
      showToast(`Dihapus dari rute singgah: ${point.name}`);
    } else {
      updated = [...waypoints, point];
      showToast(`Ditambahkan ke rute singgah [Pemberhentian ${updated.length}]: ${point.name}`);
    }

    setWaypoints(updated);
  };

  // Save Map & Trip Offline to IndexedDB
  const handleSaveOffline = async () => {
    const tripData = {
      waypoints,
      totalDistanceKm: routeMetrics.totalKm,
      estimatedTime: routeMetrics.estimatedTime,
      savedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    await saveOfflineMapTrip(tripData);
    await saveOfflineMapPoints(points);

    setIsSavedOffline(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    showToast('Data sudah tersimpan secara offline');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Route Accumulation Metrics
  const routeMetrics = useMemo(() => {
    if (waypoints.length === 0) {
      return { totalKm: 0, estimatedTime: '0 menit', waypointsCount: 0 };
    }

    let total = 0;
    let prevLat = userLocation.lat;
    let prevLng = userLocation.lng;

    waypoints.forEach((wp) => {
      const d = calculateDistanceKm(prevLat, prevLng, wp.lat, wp.lng);
      total += d;
      prevLat = wp.lat;
      prevLng = wp.lng;
    });

    const roundedTotal = Math.round(total * 10) / 10;
    return {
      totalKm: roundedTotal,
      estimatedTime: estimateKelotokTime(roundedTotal),
      waypointsCount: waypoints.length,
    };
  }, [waypoints, userLocation]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-surface">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2.5 rounded-2xl bg-inverse-surface text-inverse-on-surface text-xs sm:text-sm font-bold shadow-xl border border-outline-variant/30 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls Toolbar (Filters & GPS Toggle) - Responsive for Mobile & Desktop */}
      <div className="absolute top-3 left-3 right-3 sm:left-6 sm:right-auto z-[990] flex flex-col sm:flex-row sm:items-center gap-2 max-w-full pointer-events-none">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-md border border-outline-variant/30 overflow-x-auto no-scrollbar max-w-full pointer-events-auto">
          {[
            { id: 'all', label: 'Semua', icon: 'explore' },
            { id: 'destinasi', label: 'Wisata', icon: 'forest' },
            { id: 'umkm', label: 'UMKM & Kelotok', icon: 'storefront' },
            { id: 'layanan', label: 'Pos & Radio', icon: 'health_and_safety' },
            { id: 'atm', label: 'ATM / Tunai', icon: 'payments' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 self-start pointer-events-auto">
          {/* Live GPS Button */}
          <button
            onClick={handleToggleGps}
            disabled={isLocating}
            className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md border transition-all ${
              userLocation.isLive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-surface-container-lowest/95 backdrop-blur-md text-on-surface border-outline-variant/30 hover:bg-slate-50'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                userLocation.isLive ? 'animate-pulse text-white' : 'text-blue-600'
              }`}
            >
              {isLocating ? 'sync' : userLocation.isLive ? 'my_location' : 'location_searching'}
            </span>
            <span>{isLocating ? 'Satelit...' : userLocation.isLive ? 'GPS Aktif' : 'GPS Saya'}</span>
          </button>

          {/* Save to Offline Button */}
          <button
            onClick={handleSaveOffline}
            className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md border transition-all ${
              isSavedOffline
                ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
                : 'bg-surface-container-lowest/95 backdrop-blur-md text-primary border-outline-variant/30 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSavedOffline ? 'offline_pin' : 'download'}
            </span>
            <span>
              {isSavedOffline ? 'Tersimpan' : 'Simpan Offline'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full z-0" />

      {/* Bottom Floating Bar: Transparent Waypoint Accumulator */}
      {waypoints.length > 0 && (
        <div className="absolute bottom-20 md:bottom-6 left-3 right-3 sm:left-6 sm:right-6 lg:left-8 lg:max-w-xl z-[990]">
          <div className="p-4 rounded-3xl bg-inverse-surface/95 text-inverse-on-surface backdrop-blur-xl shadow-2xl border border-outline-variant/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-primary-fixed">
                  Akumulasi Rute Singgah
                </span>
              </div>
              <button
                onClick={() => setWaypoints([])}
                className="text-[11px] text-surface-variant hover:text-white font-semibold underline"
              >
                Reset Rute
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-1 text-center bg-surface-container-lowest/10 rounded-2xl p-2 sm:p-2.5">
              <div>
                <span className="text-[10px] text-surface-variant block">Titik Singgah</span>
                <strong className="text-xs sm:text-base font-black text-white truncate block">
                  {routeMetrics.waypointsCount} Lokasi
                </strong>
              </div>
              <div className="border-x border-white/10 px-1">
                <span className="text-[10px] text-surface-variant block">Total Jarak</span>
                <strong className="text-xs sm:text-base font-black text-secondary-fixed truncate block">
                  {routeMetrics.totalKm} km
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-surface-variant block">Est. Waktu</span>
                <strong className="text-xs sm:text-base font-black text-primary-fixed truncate block">
                  {routeMetrics.estimatedTime}
                </strong>
              </div>
            </div>

            {/* Ordered Stop Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <span className="px-2 py-0.5 rounded-lg bg-surface-container-lowest/20 text-[11px] text-surface-bright shrink-0">
                Mulai: {userLocation.name.replace(' (Basecamp)', '')}
              </span>
              {waypoints.map((wp, idx) => (
                <div
                  key={wp.id}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold text-[11px] shrink-0"
                >
                  <span>
                    {idx + 1}. {wp.name.split(' (')[0]}
                  </span>
                  <button
                    onClick={() => handleToggleWaypoint(wp)}
                    className="hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Point Detail Drawer / Modal */}
      {selectedPoint && (
        <div className="absolute bottom-20 md:bottom-6 right-3 sm:right-6 left-3 sm:left-auto sm:w-96 z-[995] animate-in fade-in slide-in-from-bottom duration-200">
          <div className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 flex flex-col gap-3.5 sm:gap-4 max-h-[75vh] overflow-y-auto">
            
            {/* Header & Close */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {selectedPoint.categoryLabel}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface leading-tight mt-0.5">
                  {selectedPoint.name}
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">
                    location_on
                  </span>
                  {selectedPoint.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Distance Transparency Badge */}
            {(() => {
              const dist = calculateDistanceKm(
                userLocation.lat,
                userLocation.lng,
                selectedPoint.lat,
                selectedPoint.lng
              );
              const timeEst = estimateKelotokTime(dist);

              return (
                <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">directions_boat</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block font-medium">
                        Jarak dari Titik Anda
                      </span>
                      <strong className="text-xs sm:text-sm text-on-surface">{dist} km</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant block font-medium">
                      Est. Tempuh Sungai
                    </span>
                    <strong className="text-xs sm:text-sm text-secondary font-bold">
                      {timeEst}
                    </strong>
                  </div>
                </div>
              );
            })()}

            {/* Key Field Readiness Badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">cell_tower</span>
                {selectedPoint.signal}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">payments</span>
                {selectedPoint.payment}
              </span>
              {selectedPoint.radioVhf && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">radio</span>
                  {selectedPoint.radioVhf.split(' (')[0]}
                </span>
              )}
            </div>

            {/* Actions: Add to Waypoint & External Maps */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleToggleWaypoint(selectedPoint)}
                className={`flex-1 h-11 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                  waypoints.some((w) => w.id === selectedPoint.id)
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {waypoints.some((w) => w.id === selectedPoint.id) ? 'remove_circle' : 'add_circle'}
                </span>
                <span>
                  {waypoints.some((w) => w.id === selectedPoint.id)
                    ? 'Batal Singgah'
                    : '+ Singgah di Sini'}
                </span>
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-3 rounded-2xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center font-bold text-xs"
                title="Buka di Google Maps"
              >
                <span className="material-symbols-outlined text-[20px]">directions</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
