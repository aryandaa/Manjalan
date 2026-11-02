import { NextRequest, NextResponse } from 'next/server';
import { budgetRequestSchema } from '@/lib/validations';
import { INITIAL_DESTINATIONS } from '@/data/initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = budgetRequestSchema.parse(body);

    const dest = INITIAL_DESTINATIONS.find((d) => d.id === validated.destinationId);
    if (!dest) {
      return NextResponse.json(
        { success: false, error: 'Destinasi tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Cost calculations
    const multiplier = validated.style === 'hemat' ? 0.85 : validated.style === 'eksklusif' ? 1.35 : 1.0;
    const durationDays = validated.durationDays;
    const guests = validated.guests;

    const transportKelotok = Math.round(
      dest.logistics.kelotokCharterPerDay * (durationDays - 1 || 1) * (validated.style === 'eksklusif' ? 1.2 : 1.0)
    );
    const parkTickets = Math.round(dest.logistics.simaksiDomestic * guests);
    const meals = Math.round(dest.logistics.mealsEstPerDay * durationDays * guests * multiplier);
    const guideCrew = Math.round(dest.logistics.localGuidePerDay * durationDays * multiplier);
    const emergencyCash = Math.round(dest.paymentReadiness.recommendedCash * guests);

    const totalCost = transportKelotok + parkTickets + meals + guideCrew + emergencyCash;
    const perPersonCost = Math.round(totalCost / guests);

    const result = {
      id: `budget-calc-${Date.now()}`,
      destinationId: dest.id,
      destinationName: dest.name,
      origin: validated.origin,
      guests,
      durationDays,
      style: validated.style,
      totalCost,
      perPersonCost,
      breakdown: {
        transportKelotok,
        parkTickets,
        meals,
        guideCrew,
        emergencyCash,
      },
      cashAlert: {
        recommendedCash: emergencyCash,
        formatted: `Rp ${emergencyCash.toLocaleString('id-ID')}`,
        nearestAtm: dest.paymentReadiness.lastAtmLocation,
        notes: dest.paymentReadiness.notes,
      },
      createdAt: new Date().toISOString(),
    };

    // Store in Supabase if online
    if (isSupabaseConfigured && supabase) {
      await supabase.from('budget_plans').insert([
        {
          id: result.id,
          destination_id: result.destinationId,
          destination_name: result.destinationName,
          origin: result.origin,
          guests: result.guests,
          duration_days: result.durationDays,
          style: result.style,
          total_cost: result.totalCost,
          breakdown: result.breakdown,
          created_at: result.createdAt,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.errors || err.message },
      { status: 400 }
    );
  }
}
