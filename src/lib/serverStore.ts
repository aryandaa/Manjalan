import { INITIAL_MANAGED_PLACES, INITIAL_PARTNER_REQUESTS, INITIAL_PARTNER_ACCOUNTS } from '@/data/partnerData';
import { ManagedPlace, PartnerRequest, PartnerAccount } from '@/types';

// Use globalThis to maintain a singleton across Next.js API route chunks and dev hot-reloads
interface GlobalStore {
  __serverRequests?: PartnerRequest[];
  __serverPlaces?: ManagedPlace[];
  __serverAccounts?: PartnerAccount[];
}

const g = globalThis as unknown as GlobalStore;

if (!g.__serverRequests) {
  g.__serverRequests = [...INITIAL_PARTNER_REQUESTS];
}

if (!g.__serverPlaces) {
  g.__serverPlaces = [...INITIAL_MANAGED_PLACES];
}

if (!g.__serverAccounts) {
  g.__serverAccounts = [...INITIAL_PARTNER_ACCOUNTS];
}

// Requests store helpers
export function getServerRequests(): PartnerRequest[] {
  return g.__serverRequests!;
}

export function addServerRequest(request: PartnerRequest) {
  g.__serverRequests!.unshift(request);
}

export function updateServerRequest(updated: PartnerRequest) {
  g.__serverRequests = g.__serverRequests!.map((r) => (r.id === updated.id ? updated : r));
}

// Places store helpers
export function getServerPlaces(): ManagedPlace[] {
  return g.__serverPlaces!;
}

export function addServerPlace(place: ManagedPlace) {
  g.__serverPlaces!.unshift(place);
}

export function updateServerPlace(id: string, updates: Partial<ManagedPlace>): ManagedPlace | null {
  const list = g.__serverPlaces!;
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  return list[idx];
}

export function deleteServerPlace(id: string): boolean {
  const initialLen = g.__serverPlaces!.length;
  g.__serverPlaces = g.__serverPlaces!.filter((p) => p.id !== id);
  return g.__serverPlaces.length < initialLen;
}

// Partner Accounts Store Helpers (CRUD for Petugas)
export function getServerAccounts(): PartnerAccount[] {
  const places = g.__serverPlaces || [];
  return (g.__serverAccounts || []).map((acc) => {
    const count = places.filter(
      (p) => p.ownerMerchantId.toLowerCase() === acc.merchantId.toLowerCase()
    ).length;
    return {
      ...acc,
      placesCount: count,
    };
  });
}

export function getServerAccountById(id: string): PartnerAccount | null {
  const acc = (g.__serverAccounts || []).find((a) => a.id === id || a.merchantId.toLowerCase() === id.toLowerCase());
  return acc || null;
}

export function getServerAccountByMerchantId(merchantId: string): PartnerAccount | null {
  const acc = (g.__serverAccounts || []).find(
    (a) => a.merchantId.toLowerCase() === merchantId.trim().toLowerCase()
  );
  return acc || null;
}

export function addServerAccount(account: PartnerAccount) {
  if (!g.__serverAccounts) {
    g.__serverAccounts = [...INITIAL_PARTNER_ACCOUNTS];
  }
  g.__serverAccounts.unshift(account);
}

export function updateServerAccount(
  id: string,
  updates: Partial<PartnerAccount>
): PartnerAccount | null {
  if (!g.__serverAccounts) return null;
  const idx = g.__serverAccounts.findIndex((a) => a.id === id || a.merchantId.toLowerCase() === id.toLowerCase());
  if (idx === -1) return null;
  g.__serverAccounts[idx] = {
    ...g.__serverAccounts[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return g.__serverAccounts[idx];
}

export function deleteServerAccount(id: string): boolean {
  if (!g.__serverAccounts) return false;
  const initialLen = g.__serverAccounts.length;
  g.__serverAccounts = g.__serverAccounts.filter((a) => a.id !== id && a.merchantId.toLowerCase() !== id.toLowerCase());
  return g.__serverAccounts.length < initialLen;
}
