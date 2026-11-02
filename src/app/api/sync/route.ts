import { NextRequest, NextResponse } from 'next/server';
import { syncPayloadSchema } from '@/lib/validations';
import { INITIAL_DESTINATIONS, INITIAL_UMKM } from '@/data/initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`sync_${ip}`, { limit: 30, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Batas sinkronisasi terlampaui. Silakan tunggu sebentar.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = syncPayloadSchema.parse(body);

    const processedItems: string[] = [];

    // Process queued offline operations safely
    for (const item of validated.queue) {
      if (item.type === 'budget_plan' && isSupabaseConfigured && supabase) {
        const p = item.payload;
        if (p && typeof p === 'object' && p.id && p.destinationId) {
          await supabase.from('budget_plans').upsert([
            {
              id: String(p.id).slice(0, 100),
              destination_id: String(p.destinationId).slice(0, 100),
              destination_name: String(p.destinationName || '').slice(0, 200),
              origin: String(p.origin || '').slice(0, 100),
              guests: Number(p.guests) || 1,
              duration_days: Number(p.durationDays) || 1,
              style: ['hemat', 'standar', 'eksklusif'].includes(p.style) ? p.style : 'standar',
              total_cost: Number(p.totalCost) || 0,
              breakdown: typeof p.breakdown === 'object' ? p.breakdown : {},
              created_at: String(p.createdAt || new Date().toISOString()).slice(0, 50),
            },
          ]);
        }
        processedItems.push(item.id);
      } else {
        processedItems.push(item.id);
      }
    }

    // Return sync confirmation
    return NextResponse.json({
      success: true,
      syncTimestamp: new Date().toISOString(),
      processedCount: processedItems.length,
      processedIds: processedItems,
      serverManifest: {
        destinationsVersion: '2024.11',
        totalDestinations: INITIAL_DESTINATIONS.length,
        totalUmkm: INITIAL_UMKM.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.errors ? err.errors[0]?.message || 'Payload sinkronisasi tidak valid.' : err.message,
      },
      { status: 400 }
    );
  }
}
