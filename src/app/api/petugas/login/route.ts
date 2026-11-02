import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPetugasCredentials, createSignedToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const petugasLoginSchema = z.object({
  officerId: z.string().trim().min(3, 'ID Petugas minimal 3 karakter').max(50),
  pin: z.string().regex(/^\d{6}$/, 'PIN wajib 6 digit angka'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`petugas_login_${ip}`, { limit: 5, windowMs: 60000 });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan masuk petugas. Silakan tunggu 1 menit.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = petugasLoginSchema.parse(body);

    const check = verifyPetugasCredentials(validated.officerId, validated.pin);

    if (!check.isValid || !check.officer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kredensial petugas tidak valid. Akses ditolak.',
        },
        { status: 401 }
      );
    }

    const token = createSignedToken({
      merchantId: check.officer.officerId,
      role: 'pengelola',
      name: check.officer.name,
      businessName: check.officer.agency,
    });

    return NextResponse.json({
      success: true,
      message: 'Autentikasi petugas otoritas berhasil.',
      officer: check.officer,
      token,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.errors ? err.errors[0]?.message : err.message,
      },
      { status: 400 }
    );
  }
}
