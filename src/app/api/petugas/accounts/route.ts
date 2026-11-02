import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPartnerToken, registerApprovedPartner, generateRandomPassword } from '@/lib/auth';
import { getServerAccounts, addServerAccount, addServerPlace } from '@/lib/serverStore';
import { ManagedPlace, PartnerAccount } from '@/types';

const createAccountSchema = z.object({
  name: z.string().trim().min(2, 'Nama pemohon minimal 2 karakter').max(100),
  whatsapp: z
    .string()
    .trim()
    .regex(/^(\+?[0-9\s-]{8,20})$/, 'Nomor WhatsApp tidak valid (contoh: 081234567890)'),
  businessName: z.string().trim().min(3, 'Nama usaha / destinasi minimal 3 karakter').max(150),
  role: z.enum(['umkm', 'pengelola']),
  password: z.string().min(6).optional(),
  initialPlaceCategory: z.string().optional(),
  initialPlaceLocation: z.string().optional(),
});

// GET /api/petugas/accounts - List all partner accounts
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const session = verifyPartnerToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token petugas diperlukan.' },
        { status: 401 }
      );
    }

    const accounts = getServerAccounts();
    return NextResponse.json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memuat akun mitra.' },
      { status: 500 }
    );
  }
}

// POST /api/petugas/accounts - Manually create partner account by Petugas
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const session = verifyPartnerToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token petugas diperlukan.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createAccountSchema.parse(body);

    const cleanWa = validated.whatsapp.replace(/\s+/g, '');
    const generatedPassword = validated.password?.trim() || generateRandomPassword(8);

    // 1. Register in auth store
    registerApprovedPartner(
      cleanWa,
      generatedPassword,
      validated.role,
      validated.name,
      validated.businessName
    );

    // 2. Add to server accounts store
    const newAccount: PartnerAccount = {
      id: `acc-${Date.now()}`,
      merchantId: cleanWa,
      role: validated.role,
      name: validated.name,
      businessName: validated.businessName,
      whatsapp: cleanWa,
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    addServerAccount(newAccount);

    // 3. Create default initial managed place for this account
    const initialPlace: ManagedPlace = {
      id: `plc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: validated.role === 'umkm' ? 'umkm' : 'destinasi',
      ownerMerchantId: cleanWa,
      name: validated.businessName,
      category: validated.initialPlaceCategory || (validated.role === 'umkm' ? 'kelotok' : 'konservasi'),
      categoryLabel: validated.role === 'umkm' ? 'Mitra UMKM Binaan Balai' : 'Destinasi Wisata Binaan Balai',
      location: validated.initialPlaceLocation || 'Kumai, Kotawaringin Barat',
      description: `Layanan resmi binaan Balai Konservasi Manjalan dikelola oleh ${validated.name}.`,
      priceRange: 'Sesuai Layanan',
      hasQris: true,
      needsCash: true,
      signalStatus: 'Kesiapan Lapangan Terverifikasi',
      signalOk: true,
      whatsapp: cleanWa,
      image:
        validated.role === 'umkm'
          ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    addServerPlace(initialPlace);

    return NextResponse.json(
      {
        success: true,
        message: `Akun mitra untuk "${validated.name}" berhasil dibuat secara manual.`,
        data: {
          ...newAccount,
          placesCount: 1,
        },
        temporaryPassword: generatedPassword, // ONE-TIME VIEW for Petugas to dispatch via WhatsApp
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.errors ? err.errors[0]?.message : err.message },
      { status: 400 }
    );
  }
}
