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
  image: z.string().trim().optional(),
  gmapsUrl: z.string().trim().min(5, 'Link Google Maps tempat wajib disertakan (contoh: https://maps.app.goo.gl/... atau https://maps.google.com/...)'),
  desiredPin: z.string().min(6, 'Password minimal 6 karakter kombinasi huruf & angka').max(50).optional(),
  desiredPassword: z.string().min(6, 'Password minimal 6 karakter kombinasi huruf & angka').max(50).optional(),
  targetExistingOwnerId: z.string().optional(),
}).refine((data) => data.desiredPin || data.desiredPassword, {
  message: 'Password wajib diisi minimal 6 karakter',
  path: ['desiredPassword'],
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
      image:
        validated.image ||
        (validated.type === 'umkm'
          ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'),
      gmapsUrl: validated.gmapsUrl,
      desiredPin: (validated.desiredPassword || validated.desiredPin || '').trim(),
      desiredPassword: (validated.desiredPassword || validated.desiredPin || '').trim(),
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
