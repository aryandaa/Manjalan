import { INITIAL_MANAGED_PLACES, INITIAL_PARTNER_REQUESTS } from '@/data/partnerData';
import { ManagedPlace, PartnerRequest } from '@/types';

// Use globalThis to maintain a singleton across Next.js API route chunks and dev hot-reloads
interface GlobalStore {
  __serverRequests?: PartnerRequest[];
  __serverPlaces?: ManagedPlace[];
}

const g = globalThis as unknown as GlobalStore;

if (!g.__serverRequests) {
  g.__serverRequests = [...INITIAL_PARTNER_REQUESTS];
}

if (!g.__serverPlaces) {
  g.__serverPlaces = [...INITIAL_MANAGED_PLACES];
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
