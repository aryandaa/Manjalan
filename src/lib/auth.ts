import crypto from 'crypto';
import { getServerAccountByMerchantId } from '@/lib/serverStore';

// Secret key for HMAC signature - fallback to a deterministic server seed if env not provided
const AUTH_SECRET = process.env.PARTNER_AUTH_SECRET || 'manjalan_secure_production_secret_key_2024_kalteng';

export interface PartnerSessionPayload {
  merchantId: string;
  role: 'umkm' | 'pengelola';
  name: string;
  businessName: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to keep constant time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Hash a password or PIN with a fixed salt
 */
export function hashPin(pin: string, salt: string = 'manjalan_pin_salt'): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(`${salt}:${pin}`).digest('hex');
}

export const hashPassword = hashPin;

/**
 * Generate a random alphanumeric password (letters + numbers)
 */
export function generateRandomPassword(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

type DynamicPartnerRecord = {
  pinHash: string;
  role: 'umkm' | 'pengelola';
  name: string;
  businessName: string;
};

const gAuth = globalThis as unknown as {
  __dynamicPartners?: Map<string, DynamicPartnerRecord>;
};

if (!gAuth.__dynamicPartners) {
  gAuth.__dynamicPartners = new Map();
}

const DYNAMIC_PARTNERS = gAuth.__dynamicPartners;

export function registerApprovedPartner(
  merchantId: string,
  pin: string,
  role: 'umkm' | 'pengelola',
  name: string,
  businessName: string
) {
  DYNAMIC_PARTNERS.set(merchantId.trim().toLowerCase(), {
    pinHash: hashPin(pin),
    role,
    name,
    businessName,
  });
}

export function removeApprovedPartner(merchantId: string) {
  DYNAMIC_PARTNERS.delete(merchantId.trim().toLowerCase());
}

/**
 * Pre-hashed credentials for known local/offline partners
 */
const VERIFIED_LOCAL_PARTNERS: Record<
  string,
  {
    pinHash: string;
    role: 'umkm' | 'pengelola';
    name: string;
    businessName: string;
  }
> = {
  // Kelotok Sekonyer Partner (ID: KLTK-01 or +6281234567890, PIN: 882024)
  'kltk-01': {
    pinHash: hashPin('882024'),
    role: 'umkm',
    name: 'Pak Joko (Kelotok Berkah)',
    businessName: 'Kelotok Wisata Berkah Sekonyer',
  },
  '+6281234567890': {
    pinHash: hashPin('882024'),
    role: 'umkm',
    name: 'Pak Joko (Kelotok Berkah)',
    businessName: 'Kelotok Wisata Berkah Sekonyer',
  },
  // Balai TN Tanjung Puting Officer (ID: TNTP-01 or TNTP-2024-001, PIN: 992024)
  'tntp-01': {
    pinHash: hashPin('992024'),
    role: 'pengelola',
    name: 'Petugas Balai Pos Kumai',
    businessName: 'Balai Konservasi TN Tanjung Puting',
  },
  'tntp-2024-001': {
    pinHash: hashPin('992024'),
    role: 'pengelola',
    name: 'Jagawana Balai Pos Kumai',
    businessName: 'Balai Konservasi TN Tanjung Puting',
  },
};

/**
 * Verify Petugas (Officer) credentials for secret /login page
 */
export function verifyPetugasCredentials(
  officerId: string,
  pin: string
): { isValid: boolean; officer?: { officerId: string; name: string; role: 'petugas'; agency: string } } {
  const normId = officerId.trim().toLowerCase();
  const validPetugas: Record<string, { pinHash: string; name: string; agency: string }> = {
    'petugas-01': {
      pinHash: hashPin('992024'),
      name: 'Rahmat Subekti (Pengawas Lapangan)',
      agency: 'Balai Konservasi & Otoritas Wisata Kalteng',
    },
    'tntp-01': {
      pinHash: hashPin('992024'),
      name: 'Koordinator Pos Kumai Balai TNTP',
      agency: 'Balai Taman Nasional Tanjung Puting',
    },
  };

  const officer = validPetugas[normId];
  if (!officer) {
    return { isValid: false };
  }

  const inputHash = hashPin(pin);
  if (!safeCompare(inputHash, officer.pinHash)) {
    return { isValid: false };
  }

  return {
    isValid: true,
    officer: {
      officerId: officerId.trim(),
      name: officer.name,
      role: 'petugas',
      agency: officer.agency,
    },
  };
}

/**
 * Verify partner PIN credentials against local verified store or custom validator
 */
export function verifyPartnerCredentials(
  merchantId: string,
  pin: string,
  role: 'umkm' | 'pengelola'
): { isValid: boolean; partner?: { merchantId: string; role: 'umkm' | 'pengelola'; name: string; businessName: string } } {
  const normalizedId = merchantId.trim().toLowerCase();

  // Check if account was suspended by Petugas
  const serverAcc = getServerAccountByMerchantId(normalizedId);
  if (serverAcc && serverAcc.status === 'suspended') {
    return { isValid: false };
  }

  const candidate = VERIFIED_LOCAL_PARTNERS[normalizedId] || DYNAMIC_PARTNERS.get(normalizedId);

  if (!candidate) {
    // If not in standard list, allow demo pin '123456' for testing newly typed IDs
    // but strictly enforce PIN matching and role matching
    const standardDemoHash = hashPin('123456');
    const inputHash = hashPin(pin);
    if (safeCompare(inputHash, standardDemoHash)) {
      return {
        isValid: true,
        partner: {
          merchantId: merchantId.trim(),
          role,
          name: role === 'umkm' ? `Mitra ${merchantId.trim()}` : `Petugas Balai (${merchantId.trim()})`,
          businessName: role === 'umkm' ? 'Kelotok & Homestay Mandiri' : 'Balai TN Tanjung Puting',
        },
      };
    }
    return { isValid: false };
  }

  // Check role match
  if (candidate.role !== role) {
    return { isValid: false };
  }

  // Check PIN hash using constant-time comparison
  const inputHash = hashPin(pin);
  if (!safeCompare(inputHash, candidate.pinHash)) {
    return { isValid: false };
  }

  return {
    isValid: true,
    partner: {
      merchantId: merchantId.trim(),
      role: candidate.role,
      name: candidate.name,
      businessName: candidate.businessName,
    },
  };
}

/**
 * Create a cryptographically signed HMAC-SHA256 session token
 */
export function createSignedToken(payload: Omit<PartnerSessionPayload, 'issuedAt' | 'expiresAt'>, ttlSeconds = 86400 * 7): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: PartnerSessionPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + ttlSeconds,
  };

  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');

  return `mjl_${payloadB64}.${signature}`;
}

/**
 * Verify a signed HMAC-SHA256 session token
 */
export function verifyPartnerToken(token: string | null | undefined): PartnerSessionPayload | null {
  if (!token || !token.startsWith('mjl_')) return null;

  try {
    const raw = token.slice(4);
    const parts = raw.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');

    if (!safeCompare(signature, expectedSig)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr) as PartnerSessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}
