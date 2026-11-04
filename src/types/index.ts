export interface EmergencyContact {
  name: string;
  role: string;
  channel: string;
  phone?: string;
  notes?: string;
}

export interface Activity {
  name: string;
  desc: string;
  icon: string;
  timing?: string;
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  location: string;
  district: string;
  categories: string[];
  rating: number;
  image: string;
  gallery?: string[];
  videoUrl?: string;
  gmapsUrl?: string;
  packSize: string;
  packSizeBytes: number;
  overview: string;
  signalStatus: {
    telkomsel: string;
    others: string;
    fieldSummary: string;
    lastChecked: string;
  };
  paymentReadiness: {
    qrisAvailable: boolean;
    cashRequired: boolean;
    recommendedCash: number;
    recommendedCashFormatted: string;
    lastAtmLocation: string;
    atmDistanceKm: number;
    notes: string;
  };
  logistics: {
    kelotokCharterPerDay: number;
    kelotokFormatted: string;
    simaksiDomestic: number;
    simaksiFormatted: string;
    simaksiForeigner?: number;
    mealsEstPerDay: number;
    localGuidePerDay: number;
    bestSeason: string;
  };
  activities: Activity[];
  emergencyContacts: EmergencyContact[];
  offlinePackContents: {
    hasGpsTracks: boolean;
    hasOfflineMap: boolean;
    hasMerchantDirectory: boolean;
    hasEmergencyProtocols: boolean;
  };
}

export interface Umkm {
  id: string;
  destinationId: string;
  name: string;
  ownerName?: string;
  category: 'kuliner' | 'kelotok' | 'souvenir' | 'transport';
  categoryLabel: string;
  description: string;
  priceRange: string;
  locationDesc: string;
  distanceDesc: string;
  image: string;
  signalStatus: string;
  signalOk: boolean;
  hasQris: boolean;
  qrisMerchantName?: string;
  hasTransfer: boolean;
  bankName?: string;
  bankNumber?: string;
  needsCash: boolean;
  whatsapp?: string;
  offlineNotes?: string;
  featured?: boolean;
  gmapsUrl?: string;
}

export interface BudgetCalculation {
  id: string;
  destinationId: string;
  destinationName: string;
  origin: string;
  guests: number;
  durationDays: number;
  durationNights: number;
  style: 'hemat' | 'standar' | 'eksklusif';
  totalCost: number;
  perPersonCost: number;
  breakdown: {
    transportKelotok: number;
    parkTickets: number;
    meals: number;
    guideCrew: number;
    emergencyCash: number;
  };
  cashAdvice: string;
  createdAt: string;
}

export interface TravelPack {
  id: string;
  destinationId: string;
  destinationName: string;
  location: string;
  sizeMb: string;
  downloadedAt: string;
  itemCount: {
    routes: number;
    umkm: number;
    emergency: number;
  };
  data: {
    destination: Destination;
    umkmList: Umkm[];
  };
}

export interface PartnerAccount {
  id: string;
  merchantId: string;
  role: 'umkm' | 'pengelola';
  name: string;
  businessName: string;
  whatsapp: string;
  verified: boolean;
  status: 'active' | 'suspended';
  offlineAccessEnabled?: boolean;
  createdAt: string;
  updatedAt?: string;
  placesCount?: number;
}

export interface PartnerRequest {
  id: string;
  type: 'umkm' | 'destinasi';
  applicantName: string;
  whatsapp: string; // Will become merchantId / login ID
  businessName: string;
  category: string;
  location: string;
  description: string;
  priceRange?: string;
  desiredPin?: string; // legacy support
  desiredPassword?: string; // Alphanumeric password (letters + numbers)
  image?: string;
  gmapsUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  targetExistingOwnerId?: string; // If an existing manager is requesting an additional place
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ManagedPlace {
  id: string;
  type: 'umkm' | 'destinasi';
  ownerMerchantId: string; // 1 manager can own many places; each place belongs to 1 manager
  name: string;
  category: string;
  categoryLabel: string;
  location: string;
  description: string;
  priceRange: string;
  hasQris: boolean;
  needsCash: boolean;
  signalStatus: string;
  signalOk: boolean;
  whatsapp: string;
  image: string;
  gmapsUrl?: string;
  status: 'active' | 'pending_approval';
  createdAt: string;
  updatedAt?: string;
}
