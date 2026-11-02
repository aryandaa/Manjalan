import { NextRequest, NextResponse } from 'next/server';
import { partnerLoginSchema } from '@/lib/validations';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { verifyPartnerCredentials, createSignedToken, hashPin, safeCompare } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Max 5 login attempts per minute per IP)
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login_${ip}`, { limit: 5, windowMs: 60000 });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan masuk. Silakan tunggu 1 menit sebelum mencoba kembali.',
          retryAfterSeconds: Math.ceil(rateLimit.resetMs / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rateLimit.resetMs / 1000)),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // 2. Strict Input Validation via Zod
    const body = await request.json();
    const validated = partnerLoginSchema.parse(body);

    let authenticatedPartner: {
      merchantId: string;
      role: 'umkm' | 'pengelola';
      name: string;
      businessName: string;
    } | null = null;

    // 3. Supabase Remote Verification (if configured)
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('merchant_id', validated.merchantId)
        .eq('role', validated.role)
        .single();

      if (!error && data && data.pin_hash) {
        const inputHash = hashPin(validated.pin);
        if (safeCompare(inputHash, data.pin_hash)) {
          authenticatedPartner = {
            merchantId: data.merchant_id,
            role: data.role,
            name: data.business_name,
            businessName: data.business_name,
          };
        }
      }
    }

    // 4. Fallback to Local Verified Partner Credentials Verification
    if (!authenticatedPartner) {
      const localCheck = verifyPartnerCredentials(
        validated.merchantId,
        validated.pin,
        validated.role
      );
      if (localCheck.isValid && localCheck.partner) {
        authenticatedPartner = localCheck.partner;
      }
    }

    // 5. Reject unauthorized credentials
    if (!authenticatedPartner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kredensial tidak valid. Periksa No. ID Mitra, peran, dan 6 digit PIN Anda.',
        },
        { status: 401 }
      );
    }

    // 6. Generate cryptographically signed HMAC-SHA256 Token
    const token = createSignedToken({
      merchantId: authenticatedPartner.merchantId,
      role: authenticatedPartner.role,
      name: authenticatedPartner.name,
      businessName: authenticatedPartner.businessName,
    });

    const partnerData = {
      ...authenticatedPartner,
      verified: true,
      lastLogin: new Date().toISOString(),
      permissions: ['update_status', 'broadcast_signal', 'manage_prices'],
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Autentikasi mitra lapangan berhasil.',
        partner: partnerData,
        token,
      },
      {
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.errors ? err.errors[0]?.message || 'Data input tidak valid.' : err.message,
      },
      { status: 400 }
    );
  }
}
