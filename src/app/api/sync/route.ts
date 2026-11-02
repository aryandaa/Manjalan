import { NextRequest, NextResponse } from 'next/server';
import { syncPayloadSchema } from '@/lib/validations';
import { INITIAL_DESTINATIONS, INITIAL_UMKM } from '@/data/initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = syncPayloadSchema.parse(body);

    const processedItems: string[] = [];

    // Process queued offline operations
    for (const item of validated.queue) {
      if (item.type === 'budget_plan' && isSupabaseConfigured && supabase) {
        await supabase.from('budget_plans').upsert([
          {
            id: item.payload.id,
            destination_id: item.payload.destinationId,
            destination_name: item.payload.destinationName,
            origin: item.payload.origin,
            guests: item.payload.guests,
            duration_days: item.payload.durationDays,
            style: item.payload.style,
            total_cost: item.payload.totalCost,
            breakdown: item.payload.breakdown,
            created_at: item.payload.createdAt,
          },
        ]);
        processedItems.push(item.id);
      } else {
        processedItems.push(item.id);
      }
    }

    // Fetch latest snapshot to sync back to client's IndexedDB
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
      { success: false, error: err.errors || err.message },
      { status: 400 }
    );
  }
}
