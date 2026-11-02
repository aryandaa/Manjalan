import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PartnerRequest } from '@/types';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getServerRequests, addServerRequest } from '@/lib/serverStore';

const partnerRequestSchema = z.object({
  type: z.enum(['umkm', 'destinasi']),
  applicantName: z.string().trim().min(2, 'Nama pemohon minimal 2 karakter').max(100),
  whatsapp: z
    .string()
    .trim()
    .regex(/^(\+?[0-9\s-]{8,20})$/, 'Nomor WhatsApp tidak valid (contoh: 081234567890)'),
  businessName: z.string().trim().min(3, 'Nama usaha / destinasi minimal 3 karakter').max(150),
  category: z.string().trim().min(2).max(100),
  location: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter').max(1000),
  priceRange: z.string().trim().max(100).optional(),
  desiredPin: z.string().regex(/^\d{6}$/, 'PIN wajib 6 digit angka untuk keamanan login Anda'),
  targetExistingOwnerId: z.string().optional(),
});

export async function GET() {
  const requests = getServerRequests();
  return NextResponse.json({
    success: true,
    count: requests.length,
    data: requests,
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`req_partner_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Batas pengajuan per menit terlampaui. Silakan tunggu sebentar.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = partnerRequestSchema.parse(body);

    const newRequest: PartnerRequest = {
      id: `req-${Date.now()}`,
      type: validated.type,
      applicantName: validated.applicantName,
      whatsapp: validated.whatsapp.replace(/\s+/g, ''),
      businessName: validated.businessName,
      category: validated.category,
      location: validated.location,
      description: validated.description,
      priceRange: validated.priceRange || 'Sesuai Kesepakatan',
      desiredPin: validated.desiredPin,
      status: 'pending',
      targetExistingOwnerId: validated.targetExistingOwnerId,
      createdAt: new Date().toISOString(),
    };

    addServerRequest(newRequest);

    return NextResponse.json(
      {
        success: true,
        message: 'Pengajuan kemitraan berhasil dikirim. Menunggu persetujuan (ACC) Petugas Otoritas Balai/Web.',
        data: newRequest,
      },
      { status: 201 }
    );
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
