'use server';

import {
  budgetRequestSchema,
  partnerLoginSchema,
  BudgetRequestInput,
  PartnerLoginInput,
} from '@/lib/validations';
import { INITIAL_DESTINATIONS } from '@/data/initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { verifyPartnerCredentials, createSignedToken } from '@/lib/auth';

export async function calculateBudgetAction(input: BudgetRequestInput) {
  try {
    const validated = budgetRequestSchema.parse(input);
    const dest = INITIAL_DESTINATIONS.find((d) => d.id === validated.destinationId);

    if (!dest) {
      return { success: false, error: 'Destinasi tidak ditemukan.' };
    }

    const multiplier = validated.style === 'hemat' ? 0.85 : validated.style === 'eksklusif' ? 1.35 : 1.0;
    const durationDays = Math.max(1, validated.durationDays);
    const guests = Math.max(1, validated.guests);

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
      id: `server-budget-${Date.now()}`,
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
      createdAt: new Date().toISOString(),
    };

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

    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function partnerLoginAction(input: PartnerLoginInput) {
  try {
    const validated = partnerLoginSchema.parse(input);

    const check = verifyPartnerCredentials(
      validated.merchantId,
      validated.password || validated.pin || '',
      validated.role
    );

    if (!check.isValid || !check.partner) {
      return {
        success: false,
        error: 'Kredensial tidak valid. Periksa No. ID Mitra, peran, dan kata sandi Anda.',
      };
    }

    const token = createSignedToken({
      merchantId: check.partner.merchantId,
      role: check.partner.role,
      name: check.partner.name,
      businessName: check.partner.businessName,
    });

    return {
      success: true,
      partner: {
        merchantId: check.partner.merchantId,
        role: check.partner.role,
        name: check.partner.name,
        businessName: check.partner.businessName,
        verified: true,
      },
      token,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
