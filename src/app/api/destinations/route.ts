import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_DESTINATIONS } from '@/data/initialData';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`dest_get_${ip}`, { limit: 120, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak permintaan.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase().slice(0, 100);
    const district = (searchParams.get('district') || '').trim().toLowerCase().slice(0, 100);

    let destinations = INITIAL_DESTINATIONS;

    // Fetch from Supabase if available
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('rating', { ascending: false });

      if (!error && data && data.length > 0) {
        destinations = data as typeof INITIAL_DESTINATIONS;
      }
    }

    // Apply filtering safely
    const filtered = destinations.filter((d) => {
      if (query && !d.name.toLowerCase().includes(query) && !d.location.toLowerCase().includes(query)) {
        return false;
      }
      if (district && !d.district.toLowerCase().includes(district)) {
        return false;
      }
      return true;
    });

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      source: isSupabaseConfigured ? 'supabase_cloud' : 'local_snapshot',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
