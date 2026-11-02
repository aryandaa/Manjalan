import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_DESTINATIONS, INITIAL_UMKM } from '@/data/initialData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
