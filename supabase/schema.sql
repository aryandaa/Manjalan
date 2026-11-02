-- =========================================================================
-- MANJALAN: Travel Readiness Platform (Central Kalimantan Ecotourism)
-- Supabase Schema & Initial Migration
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Destinations Table
create table if not exists public.destinations (
  id text primary key,
  name text not null,
  tagline text,
  location text not null,
  district text not null,
  categories text[] default '{}',
  rating numeric(3, 2) default 4.8,
  image text not null,
  pack_size text default '12.0 MB',
  overview text not null,
  signal_status jsonb default '{}'::jsonb,
  payment_readiness jsonb default '{}'::jsonb,
  logistics jsonb default '{}'::jsonb,
  activities jsonb default '[]'::jsonb,
  emergency_contacts jsonb default '[]'::jsonb,
  offline_pack_contents jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. UMKM / Local Merchant Directory Table
create table if not exists public.umkm (
  id text primary key,
  destination_id text references public.destinations(id) on delete cascade,
  name text not null,
  owner_name text,
  category text not null check (category in ('kuliner', 'kelotok', 'souvenir', 'transport')),
  category_label text not null,
  description text not null,
  price_range text,
  location_desc text,
  distance_desc text,
  image text not null,
  signal_status text,
  signal_ok boolean default true,
  has_qris boolean default false,
  qris_merchant_name text,
  has_transfer boolean default true,
  bank_name text,
  bank_number text,
  needs_cash boolean default true,
  whatsapp text,
  offline_notes text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Budget Simulations Table
create table if not exists public.budget_plans (
  id text primary key,
  destination_id text references public.destinations(id) on delete set null,
  destination_name text not null,
  origin text not null,
  guests integer default 2,
  duration_days integer default 3,
  style text default 'standar',
  total_cost numeric not null,
  breakdown jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Mitra / Partner Accounts Table
create table if not exists public.partners (
  id uuid default uuid_generate_v4() primary key,
  merchant_id text unique not null,
  role text not null check (role in ('umkm', 'pengelola')),
  business_name text not null,
  contact_phone text not null,
  pin_hash text not null,
  verified boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.destinations enable row level security;
alter table public.umkm enable row level security;
alter table public.budget_plans enable row level security;
alter table public.partners enable row level security;

-- Public Read Policies
create policy "Public Destinations Read" on public.destinations for select using (true);
create policy "Public UMKM Read" on public.umkm for select using (true);
create policy "Public Budget Insert" on public.budget_plans for insert with check (true);
create policy "Public Budget Read" on public.budget_plans for select using (true);

-- Indexing for performance
create index if not exists idx_umkm_destination on public.umkm(destination_id);
create index if not exists idx_umkm_category on public.umkm(category);
create index if not exists idx_destinations_district on public.destinations(district);
