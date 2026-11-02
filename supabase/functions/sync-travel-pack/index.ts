// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions
// Supabase Edge Function in TypeScript (Deno Runtime)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { destinationId } = await req.json();

    if (!destinationId) {
      return new Response(
        JSON.stringify({ error: 'destinationId parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch Destination info
    const { data: destination, error: destError } = await supabaseClient
      .from('destinations')
      .select('*')
      .eq('id', destinationId)
      .single();

    if (destError || !destination) {
      return new Response(
        JSON.stringify({ error: 'Destination not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch all verified UMKM for this destination
    const { data: umkmList } = await supabaseClient
      .from('umkm')
      .select('*')
      .eq('destination_id', destinationId);

    // 3. Assemble Offline Bundle
    const offlinePackBundle = {
      bundleVersion: '1.0.0',
      generatedAt: new Date().toISOString(),
      destination,
      umkmList: umkmList || [],
      offlineGpsTracks: [
        { name: 'Dermaga Kumai Waypoint', lat: -2.7423, lng: 111.7289 },
        { name: 'Tanjung Harapan Feeding Station', lat: -2.7831, lng: 111.8902 },
        { name: 'Pondok Tanggui Orangutan Center', lat: -2.8512, lng: 111.9321 },
        { name: 'Camp Leakey Historic Base', lat: -2.9348, lng: 111.9614 },
      ],
      radioFrequencies: {
        riverVhfChannel: 16,
        kumaiBaseMhz: '156.8 MHz',
        emergencyHotline: '115 (Basarnas Kalteng)',
      },
    };

    return new Response(
      JSON.stringify({ success: true, data: offlinePackBundle }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
