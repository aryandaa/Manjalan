import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_DESTINATIONS, INITIAL_UMKM } from '@/data/initialData';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`dest_id_${ip}`, { limit: 120, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak permintaan.' },
        { status: 429 }
      );
    }

    const id = (params.id || '').trim().toLowerCase().slice(0, 100);
    let destination = INITIAL_DESTINATIONS.find((d) => d.id === id);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        destination = data as typeof destination;
      }
    }

    if (!destination) {
      return NextResponse.json(
        { success: false, error: `Destinasi dengan ID "${id}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    const umkms = INITIAL_UMKM.filter((u) => u.destinationId === id);

    return NextResponse.json({
      success: true,
      data: {
        destination,
        umkmList: umkms,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
