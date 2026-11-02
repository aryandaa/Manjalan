import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PartnerRequest } from '@/types';
import { verifyPartnerToken } from '@/lib/auth';
import { getServerPlaces, addServerRequest } from '@/lib/serverStore';

// GET /api/partners/places
// - If owner query param: returns places owned by that owner
// - If no owner (Petugas viewing): returns all places
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const serverPlaces = getServerPlaces();

  if (owner) {
    const owned = serverPlaces.filter(
      (p) => p.ownerMerchantId.toLowerCase() === owner.trim().toLowerCase()
    );
    return NextResponse.json({
      success: true,
      count: owned.length,
      data: owned,
    });
  }

  return NextResponse.json({
    success: true,
    count: serverPlaces.length,
    data: serverPlaces,
  });
}

// POST /api/partners/places
// Existing owner requests to add another place under their account
const addPlaceRequestSchema = z.object({
  name: z.string().trim().min(3).max(150),
  category: z.string().trim().min(2).max(100),
  categoryLabel: z.string().trim().min(2).max(100),
  location: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(1000),
  priceRange: z.string().trim().max(100).optional(),
  type: z.enum(['umkm', 'destinasi']),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const partner = verifyPartnerToken(token);

    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token mitra valid diperlukan.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = addPlaceRequestSchema.parse(body);

    // Create an ACC request for Petugas with targetExistingOwnerId set to partner.merchantId
    const newReq: PartnerRequest = {
      id: `req-add-${Date.now()}`,
      type: validated.type,
      applicantName: partner.name,
      whatsapp: partner.merchantId,
      businessName: validated.name,
      category: validated.category,
      location: validated.location,
      description: validated.description,
      priceRange: validated.priceRange || 'Standar Lapangan',
      desiredPin: '000000', // not used since partner already has an account
      targetExistingOwnerId: partner.merchantId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addServerRequest(newReq);

    return NextResponse.json({
      success: true,
      message: 'Pengajuan tempat baru berhasil dikirim ke antrean ACC Petugas.',
      data: newReq,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.errors ? err.errors[0]?.message : err.message },
      { status: 400 }
    );
  }
}
