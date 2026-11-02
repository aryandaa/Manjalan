import { NextRequest, NextResponse } from 'next/server';
import { partnerLoginSchema } from '@/lib/validations';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = partnerLoginSchema.parse(body);

    let partnerData = {
      merchantId: validated.merchantId,
      role: validated.role,
      name: validated.role === 'umkm' ? 'Pak Joko (Kelotok Berkah)' : 'Petugas Balai Pos Kumai',
      businessName: validated.role === 'umkm' ? 'Kelotok Wisata Berkah Sekonyer' : 'Balai TN Tanjung Puting',
      verified: true,
      lastLogin: new Date().toISOString(),
      permissions: ['update_status', 'broadcast_signal', 'manage_prices'],
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('merchant_id', validated.merchantId)
        .single();

      if (!error && data) {
        partnerData = {
          ...partnerData,
          name: data.business_name,
          businessName: data.business_name,
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Autentikasi mitra lapangan berhasil.',
      partner: partnerData,
      token: `manjalan_partner_${Buffer.from(validated.merchantId).toString('base64')}_token`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.errors || err.message },
      { status: 400 }
    );
  }
}
