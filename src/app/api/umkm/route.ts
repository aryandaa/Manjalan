import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_UMKM } from '@/data/initialData';
import { umkmSubmitSchema } from '@/lib/validations';
import { verifyPartnerToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

function sanitizeString(str?: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`umkm_get_${ip}`, { limit: 120, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak permintaan.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destinationId');
    const category = searchParams.get('category');
    const qrisOnly = searchParams.get('qris') === 'true';

    let umkmList = INITIAL_UMKM;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('umkm').select('*');
      if (destinationId) query = query.eq('destination_id', destinationId);
      if (category && category !== 'all') query = query.eq('category', category);
      if (qrisOnly) query = query.eq('has_qris', true);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        umkmList = data as typeof INITIAL_UMKM;
      }
    } else {
      umkmList = umkmList.filter((item) => {
        if (destinationId && item.destinationId !== destinationId) return false;
        if (category && category !== 'all' && item.category !== category) return false;
        if (qrisOnly && !item.hasQris) return false;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      count: umkmList.length,
      data: umkmList,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`umkm_post_${ip}`, { limit: 15, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Batas pendaftaran UMKM terlampaui. Coba lagi dalam 1 menit.' },
        { status: 429 }
      );
    }

    // 1. Enforce Partner Authorization Token
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const partner = verifyPartnerToken(token);

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Akses ditolak. Token otorisasi mitra valid diperlukan untuk mendaftarkan UMKM.',
        },
        { status: 401 }
      );
    }

    // 2. Validate request body
    const body = await request.json();
    const validated = umkmSubmitSchema.parse(body);

    const newUmkm = {
      id: `umkm-${Date.now()}`,
      destinationId: sanitizeString(validated.destinationId),
      name: sanitizeString(validated.name),
      ownerName: sanitizeString(validated.ownerName) || partner.name || 'Mitra Terdaftar',
      category: validated.category,
      categoryLabel:
        validated.category === 'kuliner'
          ? 'Kuliner Khas'
          : validated.category === 'kelotok'
          ? 'Penginapan & Kelotok'
          : validated.category === 'souvenir'
          ? 'Oleh-oleh & Kerajinan'
          : 'Transportasi Lokal',
      description: sanitizeString(validated.description),
      priceRange: sanitizeString(validated.priceRange),
      locationDesc: 'Terkonfirmasi Lapangan',
      distanceDesc: 'Area Sentral Destinasi',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
      signalStatus: 'Kesiapan Diverifikasi',
      signalOk: true,
      hasQris: validated.hasQris,
      hasTransfer: validated.hasTransfer,
      needsCash: validated.needsCash,
      whatsapp: sanitizeString(validated.whatsapp),
      offlineNotes: sanitizeString(validated.offlineNotes),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('umkm').insert([newUmkm]);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Data UMKM berhasil disimpan.',
        data: newUmkm,
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
