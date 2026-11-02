'use client';

import { openDB, IDBPDatabase } from 'idb';
import { Destination, Umkm, TravelPack, BudgetCalculation } from '@/types';
import { INITIAL_DESTINATIONS, INITIAL_UMKM } from '@/data/initialData';

const DB_NAME = 'manjalan_offline_db';
const DB_VERSION = 1;

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

  const count = await db.count('destinations');
  if (count < INITIAL_DESTINATIONS.length) {
    const tx = db.transaction(['destinations'], 'readwrite');
    for (const d of INITIAL_DESTINATIONS) {
      await tx.objectStore('destinations').put(d);
    }
  }

  if (count === 0) {
    const tx = db.transaction(['destinations', 'umkm', 'travel_packs'], 'readwrite');
    for (const d of INITIAL_DESTINATIONS) {
      await tx.objectStore('destinations').put(d);
    }
    for (const u of INITIAL_UMKM) {
      await tx.objectStore('umkm').put(u);
    }

    // Pre-populate with Tanjung Puting & Sebangau travel pack to match the initial UI state
    const tanjungPuting = INITIAL_DESTINATIONS[0];
    const tpUmkm = INITIAL_UMKM.filter(u => u.destinationId === 'tanjung-puting');
    await tx.objectStore('travel_packs').put({
      id: 'pack-tanjung-puting',
      destinationId: 'tanjung-puting',
      destinationName: tanjungPuting.name,
      location: tanjungPuting.location,
      sizeMb: '14.2 MB',
      downloadedAt: 'Tersimpan Hari Ini',
      itemCount: {
        routes: 4,
        umkm: tpUmkm.length,
        emergency: 3,
      },
      data: {
        destination: tanjungPuting,
        umkmList: tpUmkm,
      },
    });

    const sebangau = INITIAL_DESTINATIONS[1];
    const sebangauUmkm = INITIAL_UMKM.filter(u => u.destinationId === 'taman-nasional-sebangau');
    await tx.objectStore('travel_packs').put({
      id: 'pack-sebangau',
      destinationId: 'taman-nasional-sebangau',
      destinationName: sebangau.name,
      location: sebangau.location,
      sizeMb: '10.4 MB',
      downloadedAt: 'Tersimpan Kemarin',
      itemCount: {
        routes: 2,
        umkm: sebangauUmkm.length,
        emergency: 2,
      },
      data: {
        destination: sebangau,
        umkmList: sebangauUmkm,
      },
    });

    await tx.done;
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
