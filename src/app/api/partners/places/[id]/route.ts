import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerPlaces, updateServerPlace, deleteServerPlace } from '@/lib/serverStore';
import { verifyPartnerToken } from '@/lib/auth';

const updatePlaceSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),
  category: z.string().trim().min(2).max(100).optional(),
  categoryLabel: z.string().trim().min(2).max(100).optional(),
  location: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(5).max(1000).optional(),
  priceRange: z.string().trim().max(100).optional(),
  hasQris: z.boolean().optional(),
  needsCash: z.boolean().optional(),
  signalStatus: z.string().trim().max(100).optional(),
  signalOk: z.boolean().optional(),
  whatsapp: z.string().trim().max(30).optional(),
  image: z.string().trim().optional(),
  gmapsUrl: z.string().trim().min(5, 'Link Google Maps tidak valid').optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const partner = verifyPartnerToken(token);

    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token mitra diperlukan.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const places = getServerPlaces();
    const existing = places.find((p) => p.id === id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Tempat / layanan tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Role check: Only the owner manager can edit their place!
    // Petugas is strictly read-only and CANNOT force-edit!
    if (existing.ownerMerchantId.toLowerCase() !== partner.merchantId.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Akses ditolak. Anda hanya dapat mengubah tempat yang berada di bawah akun Anda.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = updatePlaceSchema.parse(body);

    const updated = updateServerPlace(id, validated);

    return NextResponse.json({
      success: true,
      message: 'Informasi tempat berhasil diperbarui.',
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.errors ? err.errors[0]?.message : err.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const partner = verifyPartnerToken(token);

    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token mitra diperlukan.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const places = getServerPlaces();
    const existing = places.find((p) => p.id === id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Tempat / layanan tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Role check: Only the owner manager can delete their place!
    // Petugas is strictly read-only and CANNOT force-delete!
    if (existing.ownerMerchantId.toLowerCase() !== partner.merchantId.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Akses ditolak. Anda hanya dapat menghapus tempat yang berada di bawah akun Anda.',
        },
        { status: 403 }
      );
    }

    deleteServerPlace(id);

    return NextResponse.json({
      success: true,
      message: `Tempat "${existing.name}" berhasil dihapus dari akun Anda.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
