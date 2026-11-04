'use client';

import { openDB, IDBPDatabase } from 'idb';
import { Destination, Umkm, TravelPack, BudgetCalculation, PartnerRequest, ManagedPlace } from '@/types';
import { INITIAL_DESTINATIONS, INITIAL_UMKM } from '@/data/initialData';
import { INITIAL_MANAGED_PLACES, INITIAL_PARTNER_REQUESTS } from '@/data/partnerData';

const DB_NAME = 'manjalan_offline_db';
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Destinations Store
        if (!db.objectStoreNames.contains('destinations')) {
          const destStore = db.createObjectStore('destinations', { keyPath: 'id' });
          destStore.createIndex('district', 'district');
        }

        // UMKM Store
        if (!db.objectStoreNames.contains('umkm')) {
          const umkmStore = db.createObjectStore('umkm', { keyPath: 'id' });
          umkmStore.createIndex('destinationId', 'destinationId');
          umkmStore.createIndex('category', 'category');
        }

        // Travel Packs Store
        if (!db.objectStoreNames.contains('travel_packs')) {
          const packStore = db.createObjectStore('travel_packs', { keyPath: 'id' });
          packStore.createIndex('destinationId', 'destinationId');
        }

        // Budget Plans Store
        if (!db.objectStoreNames.contains('budget_plans')) {
          const budgetStore = db.createObjectStore('budget_plans', { keyPath: 'id' });
          budgetStore.createIndex('destinationId', 'destinationId');
          budgetStore.createIndex('createdAt', 'createdAt');
        }

        // Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Partner Requests Store (Petugas Approval Queue)
        if (!db.objectStoreNames.contains('partner_requests')) {
          const reqStore = db.createObjectStore('partner_requests', { keyPath: 'id' });
          reqStore.createIndex('status', 'status');
          reqStore.createIndex('createdAt', 'createdAt');
        }

        // Managed Places Store (1-to-many: 1 owner -> multiple places)
        if (!db.objectStoreNames.contains('managed_places')) {
          const placeStore = db.createObjectStore('managed_places', { keyPath: 'id' });
          placeStore.createIndex('ownerMerchantId', 'ownerMerchantId');
          placeStore.createIndex('type', 'type');
          placeStore.createIndex('status', 'status');
        }
      },
    });
  }

  return dbPromise;
}

/**
 * Seed initial data if database is empty
 */
export async function seedInitialDataIfNeeded(): Promise<void> {
  const db = await getDB();
  if (!db) return;

  // Always sync latest destinations and UMKM to ensure local DB matches official data
  const tx = db.transaction(['destinations', 'umkm'], 'readwrite');
  for (const d of INITIAL_DESTINATIONS) {
    await tx.objectStore('destinations').put(d);
  }
  for (const u of INITIAL_UMKM) {
    await tx.objectStore('umkm').put(u);
  }
  await tx.done;

  // Pre-populate with Tanjung Puting & Sebangau travel pack if travel_packs is empty
  const packCount = await db.count('travel_packs');
  if (packCount === 0) {
    const packTx = db.transaction(['travel_packs'], 'readwrite');
    const tanjungPuting = INITIAL_DESTINATIONS[0];
    const tpUmkm = INITIAL_UMKM.filter(u => u.destinationId === 'tanjung-puting');
    await packTx.objectStore('travel_packs').put({
      id: 'pack-tanjung-puting',
      destinationId: 'tanjung-puting',
      destinationName: tanjungPuting.name,
      location: tanjungPuting.location,
      sizeMb: tanjungPuting.packSize,
      downloadedAt: 'Tersimpan Hari Ini',
      itemCount: {
        routes: 4,
        umkm: tpUmkm.length,
        emergency: tanjungPuting.emergencyContacts.length,
      },
      data: {
        destination: tanjungPuting,
        umkmList: tpUmkm,
      },
    });

    const sebangau = INITIAL_DESTINATIONS[1];
    const sebangauUmkm = INITIAL_UMKM.filter(u => u.destinationId === 'taman-nasional-sebangau');
    await packTx.objectStore('travel_packs').put({
      id: 'pack-sebangau',
      destinationId: 'taman-nasional-sebangau',
      destinationName: sebangau.name,
      location: sebangau.location,
      sizeMb: sebangau.packSize,
      downloadedAt: 'Tersimpan Kemarin',
      itemCount: {
        routes: 2,
        umkm: sebangauUmkm.length,
        emergency: sebangau.emergencyContacts.length,
      },
      data: {
        destination: sebangau,
        umkmList: sebangauUmkm,
      },
    });
    await packTx.done;
  }

  // Seed Managed Places if empty
  const placesCount = await db.count('managed_places');
  if (placesCount === 0) {
    const txPlaces = db.transaction(['managed_places'], 'readwrite');
    for (const p of INITIAL_MANAGED_PLACES) {
      await txPlaces.objectStore('managed_places').put(p);
    }
    await txPlaces.done;
  }

  // Seed Partner Requests if empty
  const reqCount = await db.count('partner_requests');
  if (reqCount === 0) {
    const txReq = db.transaction(['partner_requests'], 'readwrite');
    for (const r of INITIAL_PARTNER_REQUESTS) {
      await txReq.objectStore('partner_requests').put(r);
    }
    await txReq.done;
  }
}

// Destination API
export async function getDestinations(): Promise<Destination[]> {
  const db = await getDB();
  if (!db) return INITIAL_DESTINATIONS;
  await seedInitialDataIfNeeded();
  const list = await db.getAll('destinations');
  return list.length > 0 ? list : INITIAL_DESTINATIONS;
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const db = await getDB();
  if (!db) {
    return INITIAL_DESTINATIONS.find(d => d.id === id) || null;
  }
  await seedInitialDataIfNeeded();
  const item = await db.get('destinations', id);
  return item || INITIAL_DESTINATIONS.find(d => d.id === id) || null;
}

// UMKM API
export async function getUmkmList(category?: string): Promise<Umkm[]> {
  const db = await getDB();
  if (!db) {
    return category && category !== 'all'
      ? INITIAL_UMKM.filter(u => u.category === category)
      : INITIAL_UMKM;
  }
  await seedInitialDataIfNeeded();
  let list = await db.getAll('umkm');
  if (!list || list.length === 0) list = INITIAL_UMKM;
  if (category && category !== 'all') {
    return list.filter(u => u.category === category);
  }
  return list;
}

// Travel Packs API
export async function getTravelPacks(): Promise<TravelPack[]> {
  const db = await getDB();
  if (!db) return [];
  await seedInitialDataIfNeeded();
  return await db.getAll('travel_packs');
}

export async function isTravelPackDownloaded(destinationId: string): Promise<boolean> {
  const db = await getDB();
  if (!db) return false;
  await seedInitialDataIfNeeded();
  const pack = await db.getFromIndex('travel_packs', 'destinationId', destinationId);
  return !!pack;
}

export async function saveTravelPack(pack: TravelPack): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('travel_packs', pack);
}

export async function deleteTravelPack(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('travel_packs', id);
}

// Budget Calculation API
export async function saveBudgetPlan(plan: BudgetCalculation): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('budget_plans', plan);
}

export async function getBudgetPlans(): Promise<BudgetCalculation[]> {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll('budget_plans');
}

export async function deleteBudgetPlan(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('budget_plans', id);
}

// Offline Map & Waypoint Trip API
export async function saveOfflineMapTrip(tripData: {
  waypoints: any[];
  totalDistanceKm: number;
  estimatedTime: string;
  savedAt: string;
}): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('settings', { key: 'offline_map_trip', data: tripData });
}

export async function getOfflineMapTrip(): Promise<any | null> {
  const db = await getDB();
  if (!db) return null;
  const res = await db.get('settings', 'offline_map_trip');
  return res ? res.data : null;
}

export async function saveOfflineMapPoints(points: any[]): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('settings', { key: 'offline_map_points', data: points, updatedAt: new Date().toISOString() });
}

export async function getOfflineMapPoints(): Promise<any[] | null> {
  const db = await getDB();
  if (!db) return null;
  const res = await db.get('settings', 'offline_map_points');
  return res ? res.data : null;
}

// Storage Estimator
export async function getStorageUsage(): Promise<{ usageMb: string; totalMb: string; countPacks: number }> {
  try {
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usedMb = ((estimate.usage || 24600000) / (1024 * 1024)).toFixed(1);
      const totalMb = ((estimate.quota || 500000000) / (1024 * 1024)).toFixed(0);
      const packs = await getTravelPacks();
      return {
        usageMb: `${usedMb} MB`,
        totalMb: `${totalMb} MB`,
        countPacks: packs.length,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return { usageMb: '24.6 MB', totalMb: '512 MB', countPacks: 2 };
}

// ==========================================
// PARTNER REQUESTS API (Petugas Approval)
// ==========================================
export async function getPartnerRequests(): Promise<PartnerRequest[]> {
  const db = await getDB();
  if (!db) return INITIAL_PARTNER_REQUESTS;
  await seedInitialDataIfNeeded();
  const list = await db.getAll('partner_requests');
  return list.length > 0 ? list : INITIAL_PARTNER_REQUESTS;
}

export async function savePartnerRequest(req: PartnerRequest): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('partner_requests', req);
}

export async function updatePartnerRequestStatus(
  id: string,
  status: 'approved' | 'rejected',
  reviewer: string = 'Petugas Otoritas',
  rejectionReason?: string
): Promise<PartnerRequest | null> {
  const db = await getDB();
  if (!db) return null;
  const existing = await db.get('partner_requests', id);
  if (!existing) return null;

  const updated: PartnerRequest = {
    ...existing,
    status,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewer,
    rejectionReason: rejectionReason || existing.rejectionReason,
  };

  await db.put('partner_requests', updated);
  return updated;
}

// ==========================================
// MANAGED PLACES API (1 Manager -> Many Places)
// ==========================================
export async function getManagedPlaces(): Promise<ManagedPlace[]> {
  const db = await getDB();
  if (!db) return INITIAL_MANAGED_PLACES;
  await seedInitialDataIfNeeded();
  const list = await db.getAll('managed_places');
  return list.length > 0 ? list : INITIAL_MANAGED_PLACES;
}

export async function getManagedPlacesByOwner(merchantId: string): Promise<ManagedPlace[]> {
  const db = await getDB();
  if (!db) {
    return INITIAL_MANAGED_PLACES.filter(
      (p) => p.ownerMerchantId.toLowerCase() === merchantId.toLowerCase()
    );
  }
  await seedInitialDataIfNeeded();
  const all = await db.getAll('managed_places');
  return all.filter(
    (p) => p.ownerMerchantId.toLowerCase() === merchantId.toLowerCase()
  );
}

export async function saveManagedPlace(place: ManagedPlace): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('managed_places', place);
}

export async function updateManagedPlace(
  id: string,
  updates: Partial<ManagedPlace>
): Promise<ManagedPlace | null> {
  const db = await getDB();
  if (!db) return null;
  const existing = await db.get('managed_places', id);
  if (!existing) return null;

  const updated: ManagedPlace = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await db.put('managed_places', updated);
  return updated;
}

export async function deleteManagedPlace(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('managed_places', id);
}
