-- ============================================================================
-- KSarees — Supabase schema
-- Run this in the Supabase SQL editor to provision the database.
-- RLS is left OFF for the MVP (per spec). Lock it down before production.
-- ============================================================================

-- Products ------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  description text,
  price numeric not null default 0,
  images text[] not null default '{}',
  category text not null check (category in ('saree','lehenga','suit','kurti','mens')),
  fabric text,
  size_guide text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- Orders --------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  shipping_country text not null,
  items jsonb not null default '[]',
  total numeric not null default 0,        -- canonical AUD base total (source of truth)
  status text not null default 'pending' check (status in ('pending','paid','shipped')),
  -- Multi-currency: FX details locked at payment time (see orders_fx.sql for
  -- the additive migration that backfills these onto an existing database).
  currency text,                            -- charged currency code (e.g. USD)
  amount_charged numeric,                   -- total charged in `currency`
  fx_rate numeric,                          -- AUD -> currency rate applied
  aud_total numeric,                        -- AUD base total (mirrors `total`)
  created_at timestamptz not null default now()
);

-- Cart items (optional server-side cart by session) -------------------------
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_cart_session on cart_items(session_id);
create index if not exists idx_orders_email on orders(user_email);

-- RLS off for MVP (Supabase enables it by default on new tables in some setups)
alter table products disable row level security;
alter table orders disable row level security;
alter table cart_items disable row level security;
