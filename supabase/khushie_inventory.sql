-- ============================================================================
-- Khushie Sarees — stock tracking for the boutique catalogue (lib/catalog.ts)
--
-- ADDITIVE ONLY. Safe to run more than once. Run it in the Supabase SQL editor
-- of the NEW project, after schema.sql and orders_fx.sql.
--
-- Products, copy and photos live in the code (lib/catalog.ts). The database
-- only holds what changes at run time: stock per SKU and paid orders.
-- Any rows in the old `products` table are no longer read by the shop
-- (they are hidden, not deleted).
-- ============================================================================

create table if not exists inventory (
  sku text primary key,
  stock integer not null default 1 check (stock >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists shop_orders (
  stripe_session_id text primary key,
  email text,
  skus text[] not null default '{}',
  amount_aud numeric,
  oversold text[] not null default '{}',
  details jsonb,
  created_at timestamptz not null default now()
);

alter table inventory enable row level security;
alter table shop_orders enable row level security;
-- No policies: only the server (service role key) can read or write.

-- Records one paid Checkout Session exactly once and takes one unit of each
-- SKU off the shelf. Returns { already_processed, oversold[] }.
create or replace function ks_record_sale(
  p_session_id text,
  p_email text,
  p_skus text[],
  p_amount_aud numeric,
  p_details jsonb
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_sku text;
  v_rows int;
  v_oversold text[] := '{}';
begin
  insert into shop_orders (stripe_session_id, email, skus, amount_aud, details)
  values (p_session_id, p_email, p_skus, p_amount_aud, p_details)
  on conflict (stripe_session_id) do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    return jsonb_build_object('already_processed', true, 'oversold', '[]'::jsonb);
  end if;

  foreach v_sku in array p_skus loop
    insert into inventory (sku, stock) values (v_sku, 1) on conflict (sku) do nothing;
    update inventory set stock = stock - 1, updated_at = now()
      where sku = v_sku and stock > 0;
    get diagnostics v_rows = row_count;
    if v_rows = 0 then
      v_oversold := array_append(v_oversold, v_sku);
    end if;
  end loop;

  update shop_orders set oversold = v_oversold where stripe_session_id = p_session_id;
  return jsonb_build_object('already_processed', false, 'oversold', to_jsonb(v_oversold));
end;
$$;

revoke all on function ks_record_sale(text, text, text[], numeric, jsonb) from public, anon, authenticated;
