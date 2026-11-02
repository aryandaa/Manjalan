import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Destination, Umkm, BudgetCalculation } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch destinations from Supabase with fallback
 */
export async function fetchRemoteDestinations(): Promise<Destination[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch error, using local fallback:', error?.message);
      return null;
    }
    return data as Destination[];
  } catch (err) {
    console.warn('Supabase network error:', err);
    return null;
  }
}

/**
 * Fetch UMKM directory from Supabase with fallback
 */
export async function fetchRemoteUmkm(): Promise<Umkm[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('umkm')
      .select('*');

    if (error || !data) {
      return null;
    }
    return data as Umkm[];
  } catch (err) {
    console.warn('Supabase network error:', err);
    return null;
  }
}

/**
 * Save budget calculation to Supabase
 */
export async function syncBudgetToSupabase(plan: BudgetCalculation): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('budget_plans')
      .insert([
        {
          id: plan.id,
          destination_id: plan.destinationId,
          destination_name: plan.destinationName,
          origin: plan.origin,
          guests: plan.guests,
          duration_days: plan.durationDays,
          style: plan.style,
          total_cost: plan.totalCost,
          breakdown: plan.breakdown,
          created_at: plan.createdAt
        }
      ]);
    return !error;
  } catch (err) {
    console.error('Error syncing budget to cloud:', err);
    return false;
  }
}
